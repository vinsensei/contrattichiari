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
    const file = formData.get("file") as File | null;
    const userId = formData.get("userId") as string | null;
    const from = formData.get("from") as string | null;

    if (!file || !(file instanceof File) || !userId) {
      return NextResponse.json(
        { error: "File o userId mancanti/non validi." },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // 1) Leggi piano utente
    const { data: sub, error: subError } = await supabase
      .from("user_subscriptions")
      .select("plan, is_active, current_period_end")
      .eq("user_id", userId)
      .maybeSingle();

    if (subError) {
      console.error("Error fetching subscription", subError);
      return NextResponse.json(
        { error: "Subscription lookup failed" },
        { status: 500 }
      );
    }

    const plan: string = sub?.plan ?? "free";
    const isActive: boolean = sub?.is_active ?? false;

    const currentPeriodEnd = sub?.current_period_end
      ? new Date(sub.current_period_end as string)
      : null;

    const now = new Date();

    // 2) Regole piano: free vs a pagamento + scadenza periodo
    if (plan === "free") {
      // piano free → controlla se ha già usato l’analisi gratuita
      const { count, error: analysesError } = await supabase
        .from("contract_analyses")
        .select("id", { count: "exact" })
        .eq("user_id", userId);

      if (analysesError) {
        console.error("Error counting analyses", analysesError);
        return NextResponse.json(
          { error: "Analysis lookup failed" },
          { status: 500 }
        );
      }

      const alreadyUsedFree = (count ?? 0) > 0;
      if (alreadyUsedFree) {
        return NextResponse.json(
          {
            error: "Free analysis already used",
            code: "FREE_LIMIT_REACHED",
          },
          { status: 402 }
        );
      }
    } else {
      // piano a pagamento → deve essere attivo e non scaduto
      const isExpired =
        currentPeriodEnd !== null &&
        currentPeriodEnd.getTime() < now.getTime();

      if (!isActive || isExpired) {
        // opzionale: se scaduto, facciamo un downgrade veloce lato DB
        if (isExpired) {
          const { error: downgradeError } = await supabase
            .from("user_subscriptions")
            .update({
              is_active: false,
              plan: "free",
            })
            .eq("user_id", userId);

          if (downgradeError) {
            console.error(
              "[ANALYZE] errore downgrade piano scaduto:",
              downgradeError
            );
          }
        }

        return NextResponse.json(
          {
            error:
              "Il tuo abbonamento non è più attivo. Aggiorna il piano per continuare a usare il servizio.",
            code: "SUB_INACTIVE",
          },
          { status: 402 }
        );
      }
    }

    // 3) Leggi il file in Buffer (vale per .pdf, .txt, ecc.)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log("File size bytes:", buffer.byteLength);

    const originalName = file.name || "contratto";
    const lowerName = originalName.toLowerCase();

    const isPdf = lowerName.endsWith(".pdf");
    const isDocx = lowerName.endsWith(".docx");
    const isPlainText =
      lowerName.endsWith(".txt") ||
      lowerName.endsWith(".text") ||
      lowerName.endsWith(".md") ||
      lowerName.endsWith(".markdown");

    if (!isPdf && !isDocx && !isPlainText) {
      console.warn("Unsupported file extension for analysis:", originalName);
      return NextResponse.json(
        {
          error:
            "Formato file non supportato. Puoi caricare solo PDF, file di testo (.txt, .md) o documenti Word salvati in formato .docx.",
          code: "UNSUPPORTED_FILE_TYPE",
        },
        { status: 400 }
      );
    }

    // 4) Prompt comune
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
        type: file.type || "application/pdf",
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
      console.error("No text output from responses API:", response);
      return NextResponse.json(
        { error: "LLM returned empty content" },
        { status: 500 }
      );
    }

    let analysisJson: any;
    try {
      analysisJson = parseAnalysisJson(textResult);
    } catch (e) {
      console.error("JSON parse error from LLM:", textResult);
      return NextResponse.json(
        { error: "LLM output is not valid JSON" },
        { status: 500 }
      );
    }

    // 5) Salva analisi in Supabase
    const analysisId = randomUUID();

    const { data: inserted, error: insertError } = await supabase
      .from("contract_analyses")
      .insert({
        id: analysisId,
        user_id: userId,
        from_slug: from,
        source: "dashboard",
        status: "completed",
        is_full_unlocked: true,
        analysis_json: analysisJson,
      })
      .select("id")
      .single();

    if (insertError) {
      console.error("Error inserting analysis", insertError);
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    return NextResponse.json(
      {
        id: inserted.id,
        analysis: analysisJson,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Analyze error", err);
    if (err?.error) {
      console.error("OpenAI error payload:", err.error);
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}