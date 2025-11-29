import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { openai } from "@/lib/openaiClient";
import * as mammoth from "mammoth";
import { randomUUID } from "crypto";

export const runtime = "nodejs";

function parseAnalysisJson(rawText: string) {
  let cleaned = rawText.trim();

  // Se il modello ha usato i fence ``` o ```json, ripulisci
  if (cleaned.startsWith("```")) {
    // rimuove la prima riga tipo ```json o ```
    cleaned = cleaned.replace(/^```[a-zA-Z]*\s*/, "");
    // rimuove l'ultimo ``` se presente
    cleaned = cleaned.replace(/```$/, "").trim();
  }

  // Estrarre solo la porzione tra la prima e l'ultima graffa
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    throw new Error("Nessun JSON valido trovato nel testo del modello");
  }

  const jsonString = cleaned.slice(firstBrace, lastBrace + 1);
  return JSON.parse(jsonString);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const from = formData.get("from") as string | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "File mancante o non valido." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // Genera un id per l'analisi
    const analysisId = randomUUID();

    // 1) Crea subito un record pending, marcando la sorgente come landing anonima
    const { error: insertError } = await supabase
      .from("contract_analyses")
      .insert({
        id: analysisId,
        from_slug: from,
        status: "pending", // pending | completed | failed
        source: "anonymous_landing",
        is_full_unlocked: false,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Errore insert contract_analyses", insertError);
      return NextResponse.json(
        { error: "Errore interno durante la creazione dell'analisi." },
        { status: 500 }
      );
    }

    // 2) Leggi il file in Buffer
    const arrayBuffer = await (file as File).arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const originalName = (file as File).name || "contratto";
    const lowerName = originalName.toLowerCase();

    const isPdf = lowerName.endsWith(".pdf");
    const isDocx = lowerName.endsWith(".docx");
    const isPlainText =
      lowerName.endsWith(".txt") ||
      lowerName.endsWith(".text") ||
      lowerName.endsWith(".md") ||
      lowerName.endsWith(".markdown");

    if (!isPdf && !isDocx && !isPlainText) {
      console.warn("Unsupported file extension for anonymous analysis:", originalName);

      await supabase
        .from("contract_analyses")
        .update({
          status: "failed",
          analysis_json: {
            error:
              "Formato file non supportato. Puoi caricare solo PDF, file di testo (.txt, .md) o documenti Word salvati in formato .docx.",
          },
        })
        .eq("id", analysisId);

      return NextResponse.json(
        {
          error:
            "Formato file non supportato. Per ora puoi caricare solo PDF, file di testo (.txt, .md) o documenti Word salvati in formato .docx.",
          code: "UNSUPPORTED_FILE_TYPE",
        },
        { status: 400 }
      );
    }

    // 3) Prompt comune (stesso di /api/contracts/analyze)
    const userPrompt = `
Analizza il seguente contratto (testo o file allegato) e restituisci SOLO un JSON con la seguente struttura:

{
  "tipo_contratto": string,
  "valutazione_rischio": "basso" | "medio" | "alto",
  "motivazione_rischio": string,
  "clausole_critiche": [
    {
      "titolo": string,
      "estratto_originale": string,
      "perche_critica": string,
      "rischio_specifico": "basso" | "medio" | "alto",
      "suggerimento_modifica": string
    }
  ],
  "clausole_vessatorie_potenziali": [
    {
      "clausola": string,
      "estratto_originale": string,
      "perche_vessatoria": string,
      "riferimento_normativo": string
    }
  ],
  "riassunto_semplice": string,
  "punti_a_favore_dell_utente": [ string ],
  "punti_a_sfavore_dell_utente": [ string ],
  "versione_riequilibrata": string,
  "glossario": [
    { "termine": string, "spiegazione": string }
  ],
  "alert_finali": [
    string
  ]
}

Regole IMPORTANTI:
- Il contratto è in italiano.
- Rispondi SOLO con JSON valido.
- Nessun testo fuori dal JSON.
- Se non hai abbastanza informazioni, metti stringhe brevi che lo indicano.
`;

    let response: any;

    if (isPdf) {
      const uploadFile = new File([buffer], originalName, {
        type: (file as File).type || "application/pdf",
      });

      const uploadedFile = await openai.files.create({
        file: uploadFile,
        purpose: "assistants",
      });

      response = await openai.responses.create({
        model: "gpt-4.1",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: userPrompt },
              { type: "input_file", file_id: uploadedFile.id },
            ],
          },
        ],
      });
    } else {
      let contractText = "";

      if (isDocx) {
        const result = await mammoth.extractRawText({ buffer });
        contractText = (result.value || "").trim();
      } else if (isPlainText) {
        contractText = buffer.toString("utf8").trim();
      }

      if (!contractText || contractText.length < 50) {
        await supabase
          .from("contract_analyses")
          .update({
            status: "failed",
            analysis_json: {
              error:
                "Il file non contiene abbastanza testo leggibile per una analisi. Assicurati che il documento contenga il testo del contratto.",
            },
          })
          .eq("id", analysisId);

        return NextResponse.json(
          {
            error:
              "Il file non contiene abbastanza testo leggibile per una analisi. Assicurati che il documento contenga il testo del contratto.",
          },
          { status: 400 }
        );
      }

      const fullPrompt = `${userPrompt}

Testo del contratto:

${contractText}`;

      response = await openai.responses.create({
        model: "gpt-4.1",
        input: [
          {
            role: "user",
            content: [{ type: "input_text", text: fullPrompt }],
          },
        ],
      });
    }

    const textResult: string | undefined =
      (response as any).output_text ??
      (response.output &&
        (response.output[0] as any)?.content?.[0]?.text?.value);

    if (!textResult) {
      console.error("No text output from responses API (anonymous):", response);

      await supabase
        .from("contract_analyses")
        .update({
          status: "failed",
          analysis_json: {
            error: "Il motore di analisi non ha restituito contenuto.",
          },
        })
        .eq("id", analysisId);

      return NextResponse.json(
        { error: "LLM returned empty content" },
        { status: 500 }
      );
    }

    let analysisJson: any;
    try {
      analysisJson = parseAnalysisJson(textResult);
    } catch (e) {
      console.error("JSON parse error from LLM (anonymous):", textResult);

      await supabase
        .from("contract_analyses")
        .update({
          status: "failed",
          analysis_json: {
            error: "Il motore di analisi ha restituito un risultato non valido.",
            raw: textResult,
          },
        })
        .eq("id", analysisId);

      return NextResponse.json(
        { error: "LLM output is not valid JSON" },
        { status: 500 }
      );
    }

    // 4) Aggiorna l'analisi con il JSON completo
    const { error: updateError } = await supabase
      .from("contract_analyses")
      .update({
        status: "completed",
        analysis_json: analysisJson,
      })
      .eq("id", analysisId);

    if (updateError) {
      console.error("Errore update contract_analyses (anonymous)", updateError);
      return NextResponse.json(
        { error: "Errore interno durante l'aggiornamento dell'analisi." },
        { status: 500 }
      );
    }

    // Restituisci solo l'id per collegare il funnel upload → register → analysis
    return NextResponse.json({ analysisId }, { status: 200 });
  } catch (err) {
    console.error("Errore in /api/analysis/anonymous", err);
    return NextResponse.json(
      { error: "Errore interno durante l'analisi anonima." },
      { status: 500 }
    );
  }
}