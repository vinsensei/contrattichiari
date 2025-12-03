# Project Snapshot

## Tree: src/app

```
src/app
- src/app/(marketing)/[slug]/page.tsx
- src/app/analysis/[id]/page.tsx
- src/app/api/account/delete/route.ts
- src/app/api/analysis/[id]/pdf/route.ts
- src/app/api/analysis/[id]/route.ts
- src/app/api/analysis/anonymous/route.ts
- src/app/api/analysis/route.ts
- src/app/api/auth/signup/route.ts
- src/app/api/contracts/analyze/route.ts
- src/app/api/cron/inactivityreminder/route.ts
- src/app/api/stripe/checkout/route.ts
- src/app/api/stripe/confirm/route.ts
- src/app/api/stripe/create-checkout-session/route.ts
- src/app/api/stripe/portal/route.ts
- src/app/api/stripe/webhook/route.ts
- src/app/api/user/activity/route.ts
- src/app/dashboard/account/page.tsx
- src/app/dashboard/analyses/page.tsx
- src/app/dashboard/page.tsx
- src/app/favicon.ico
- src/app/globals.css
- src/app/layout.tsx
- src/app/login/page.tsx
- src/app/not-found.tsx
- src/app/page.tsx
- src/app/password/forgot/page.tsx
- src/app/password/reset/page.tsx
- src/app/pricing/page.tsx
- src/app/pricing/success/page.tsx
- src/app/privacy/page.tsx
- src/app/register/page.tsx
- src/app/robots.txt
- src/app/sitemap.ts
- src/app/termini/page.tsx
- src/app/upload/page.tsx
```

## Tree: src/components

```
src/components
- src/components/AnalyticsProvider.tsx
- src/components/ContractUploadForm.tsx
- src/components/HeaderPrivate.tsx
- src/components/HeaderPublic.tsx
```

## Tree: src/lib

```
src/lib
- src/lib/emails.ts
- src/lib/gtag.ts
- src/lib/landingConfig.ts
- src/lib/openaiClient.ts
- src/lib/supabaseClient.ts
- src/lib/trackActivity.ts
```

## Important files

### package.json

```
{
  "name": "contrattichiari",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "snapshot": "node scripts/make-context-bundle.mjs"
  },
  "dependencies": {
    "@supabase/ssr": "^0.8.0",
    "@supabase/supabase-js": "^2.86.0",
    "@types/pdfkit": "^0.17.4",
    "mammoth": "^1.11.0",
    "next": "16.0.5",
    "openai": "^6.9.1",
    "pdfkit": "^0.17.2",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "stripe": "^20.0.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "eslint": "^9",
    "eslint-config-next": "16.0.5",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}

```

### eslint.config.mjs

```
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

```

## API Routes (content excerpt)

### src/app/api/account/delete/route.ts

```
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1) Parsing body sicuro (gestisce anche body vuoto)
    let userId: string | undefined;

    try {
      const rawBody = await req.text();
      if (rawBody) {
        const parsed = JSON.parse(rawBody);
        userId = parsed.userId;
      }
    } catch (parseErr) {
      console.error("[ACCOUNT DELETE] JSON parse error:", parseErr);
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // 2) Best-effort cleanup delle tabelle che referenziano l'utente
    //    (anche se hai ON DELETE CASCADE, questo non fa male)
    try {
      // Se hai altre tabelle legate a user_id, aggiungile qui
      await supabase
        .from("contract_analyses")
        .delete()
        .eq("user_id", userId);

      await supabase
        .from("user_subscriptions")
        .delete()
        .eq("user_id", userId);
    } catch (cleanupErr) {
      console.error("[ACCOUNT DELETE] errore nel cleanup relazioni:", cleanupErr);
      // Non facciamo return: proviamo comunque a cancellare l'utente
    }

    // 3) Elimina l’utente da auth.users
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("[ACCOUNT DELETE] errore deleteUser:", deleteError);

      const status =
        typeof (deleteError as any).status === "number"
          ? (deleteError as any).status
          : 500;

      const code = (deleteError as any).code ?? "unexpected_failure";

      return NextResponse.json(
        {
          error: "Errore durante l’eliminazione dell’account.",
          code,
        },
        { status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ACCOUNT DELETE] errore inatteso:", err);
    return NextResponse.json(
      { error: "Errore interno durante l’eliminazione dell’account." },
      { status: 500 }
    );
  }
}
```

### src/app/api/analysis/[id]/pdf/route.ts

```
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";
import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
import fs from "fs";
import path from "path";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = supabaseAdmin();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // Leggo header Authorization (Bearer token)
    const h = await headers();
    const authHeader = h.get("authorization") || h.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing auth token" },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();

    // Verifico il token lato server
    const { data: userData, error: getUserError } =
      await admin.auth.getUser(accessToken);

    if (getUserError || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = userData.user.id;

    // Recupero l'analisi dalla tabella reale contract_analyses
    const { data, error } = await admin
      .from("contract_analyses")
      .select("id, created_at, from_slug, source, analysis_json")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Errore fetch analysis per PDF:", error);
      return NextResponse.json(
        { error: "Errore nel caricamento dell'analisi" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Analisi non trovata" },
        { status: 404 }
      );
    }

    const aj = (data.analysis_json as any) || {};
    const tipoContratto =
      aj.tipo_contratto || data.from_slug || "Contratto senza titolo";
    const valutazioneRischio = aj.valutazione_rischio || "Non disponibile";
    const motivazioneRischio =
      aj.motivazione_rischio ||
      "Apri l'app ContrattoChiaro per vedere tutti i dettagli dell'analisi.";

    const createdAt = new Date(data.created_at).toLocaleString("it-IT");

    // Costruisco il PDF SENZA prima pagina per evitare Helvetica.afm
    const doc = new PDFDocument({
      autoFirstPage: false,
    });

    // percorso assoluto del font da usare
    const fontPath = path.join(process.cwd(), "public", "fonts", "Roboto-Regular.ttf");

    // registra il font custom
    doc.registerFont("Body", fs.readFileSync(fontPath));

    // aggiungo la prima pagina dopo aver caricato il font
    doc.addPage({
      margin: 50,
      size: "A4",
      font: "Body",
    });

    doc.font("Body");

    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => {
      chunks.push(chunk);
    });

    const pdfBufferPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => {
        resolve(Buffer.concat(chunks));
      });
      doc.on("error", (err: Error) => {
        reject(err);
      });
    });

    // Contenuto del PDF
    //
    // --- HEADER CON LOGO ---
    //
    /*
    try {
      const logoPath = path.join(process.cwd(), "public", "logo.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, {
          fit: [120, 120],
        });
        doc.moveDown(1.5);
      }
    } catch (e) {
      console.error("Logo non trovato o non leggibile", e);
    }
      */

    //
    // --- TITOLO DEL REPORT ---
    //
    doc.font("Body").fontSize(20).fillColor("#000000");
    doc.text("Analisi del contratto", { align: "left" });
    doc.moveDown(0.5);

    //
    // --- SOTTOINTESTAZIONE ---
    //
    doc.fontSize(11).fillColor("#555555");
    doc.text(`Data analisi: ${createdAt}`);
    doc.text(`ID analisi: ${data.id}`);
    doc.moveDown(0.75);

    //
    // --- LINEA SEPARATRICE ---
    //
    doc
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .strokeColor("#DDDDDD")
      .stroke();
    doc.moveDown(1.2);

    //
    // --- SEZIONE DATI PRINCIPALI ---
    //
    doc.fillColor("#000000").fontSize(14).text("Dettagli principali", {
      underline: true,
    });
    doc.moveDown(0.8);

    doc.fontSize(12).text(`Tipo di contratto: ${tipoContratto}`);
    doc.moveDown(0.25);
    doc.text(`Valutazione del rischio: ${valutazioneRischio}`);
    doc.moveDown();

    doc.fontSize(11).fillColor("#555555");
    doc.text(`Data analisi: ${createdAt}`);
    doc.text(`ID analisi: ${data.id}`);
    doc.moveDown();

    doc.fillColor("#000000").fontSize(14).text("Dettagli principali", {
      underline: true,
    });
    doc.moveDown(0.5);

    doc.fontSize(12).text(`Tipo di contratto: ${tipoContratto}`);
    doc.moveDown(0.25);
    doc.text(`Valutazione del rischio: ${valutazioneRischio}`);
    doc.moveDown();

    doc.fontSize(12).text("Motivazione della valutazione:");
    doc.moveDown(0.25);
    doc.fontSize(11).text(motivazioneRischio, {
      width: 500,
      align: "justify",
    });

    doc.moveDown();
    doc.fontSize(10).fillColor("#888888");
    doc.text(
      "Questo PDF è stato generato automaticamente da ContrattoChiaro sulla base dell'analisi effettuata.",
      {
        width: 500,
        align: "left",
      }
    );

    doc.end();

    const pdfBuffer = await pdfBufferPromise;

    const fileNameSafe = tipoContratto
      .toString()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60);

    const arrayBuffer = pdfBuffer.buffer.slice(
      pdfBuffer.byteOffset,
      pdfBuffer.byteOffset + pdfBuffer.byteLength
    );

    // 👇 cast esplicito, così TS è felice
    return new NextResponse(arrayBuffer as any, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="analisi-${
          fileNameSafe || "contratto"
        }.pdf"`,
      },
    });
  } catch (err) {
    console.error("Errore inatteso in GET /api/analysis/[id]/pdf:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
```

### src/app/api/analysis/[id]/route.ts

```
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = supabaseAdmin();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // 1) Auth: leggo token dal header
    const h = await headers();
    const authHeader = h.get("authorization") || h.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();

    const { data: userData, error: getUserError } =
      await admin.auth.getUser(accessToken);

    if (getUserError || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = userData.user.id;

    // 2) Recupero analisi, assicurandomi che sia dell'utente
    const { data, error } = await admin
      .from("contract_analyses")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Errore fetch analysis by id:", error);
      return NextResponse.json(
        { error: "Errore nel caricamento dell'analisi" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Analisi non trovata" }, { status: 404 });
    }

    return NextResponse.json({ analysis: data });
  } catch (err) {
    console.error("Errore inatteso in GET /api/analysis/[id]:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
```

### src/app/api/analysis/anonymous/route.ts

```
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
```

### src/app/api/analysis/route.ts

```
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const admin = supabaseAdmin();

    const h = await headers();
    const authHeader = h.get("authorization") || h.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();

    const { data: userData, error: getUserError } =
      await admin.auth.getUser(accessToken);

    if (getUserError || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = userData.user.id;

    const { data, error } = await admin
      .from("analyses")
      .select("id, file_name, status, created_at, completed_at, summary")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Errore fetch analyses:", error);
      return NextResponse.json({ error: "Errore caricamento storico" }, { status: 500 });
    }

    return NextResponse.json({ analyses: data ?? [] });
  } catch (err) {
    console.error("Errore inatteso in /api/analyses:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
```

### src/app/api/auth/signup/route.ts

```
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { sendWelcomeEmail } from "@/lib/emails";

export async function POST(req: Request) {
    try {
        const admin = supabaseAdmin();

        const { email, password, captchaToken } = await req.json();

        // 1) Verifica captcha (stub per ora)
        const captchaOk = await verifyCaptcha(captchaToken);
        if (!captchaOk) {
            return NextResponse.json({ error: "Captcha non valido" }, { status: 400 });
        }

        // 2) Leggo IP + UA
        const h = await headers();
        const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
        const userAgent = h.get("user-agent") || "unknown";

        // 3) Rate limit: max 5 signup / 10 minuti per IP
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

        const { count, error: countError } = await admin
        .from("user_meta")
        .select("*", { count: "exact", head: true })
        .eq("signup_ip", ip)
        .gte("created_at", tenMinutesAgo);

        if (countError) {
        console.error("Rate limit error:", countError);
        } else {
        const maxSignups =
            process.env.NODE_ENV === "production" ? 5 : 100; // in dev praticamente infinito

        if ((count ?? 0) >= maxSignups) {
            return NextResponse.json(
            { error: "Troppe registrazioni da questo IP. Riprova più tardi." },
            { status: 429 }
            );
        }
        }

        // 4) Crea utente in Auth
        const { data: authData, error: createError } = await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true // niente double opt-in
        });

        if (createError || !authData?.user) {
            return NextResponse.json(
            { error: createError?.message || "Errore creazione utente" },
            { status: 400 }
            );
        }

        const userId = authData.user.id;
        const emailUser = authData.user.email;


        // 5) Inserisco meta
        const { error: metaError } = await admin.from("user_meta").insert({
            user_id: userId,
            signup_ip: ip,
            signup_user_agent: userAgent,
        });

        if (metaError) {
            console.error("Errore insert user_meta:", metaError);
        }

        // 6) Email di benvenuto (non blocca la risposta se fallisce)
        if (emailUser) {
            sendWelcomeEmail(emailUser).catch((e) =>
                console.error("Errore invio welcome email:", e)
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
    }
}

async function verifyCaptcha(token: string): Promise<boolean> {
  // TODO: integrare Turnstile/hCaptcha
  return true;
}
```

### src/app/api/contracts/analyze/route.ts

```
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
```

### src/app/api/cron/inactivityreminder/route.ts

```
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { sendInactivityEmail } from "@/lib/emails";

const DAYS_1 = 7;   // primo reminder
const DAYS_2 = 30;  // secondo reminder

export async function GET() {
  try {
    const admin = supabaseAdmin();

    // 1) Utenti inattivi da >7 giorni, mai contattati (level 0)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - DAYS_1);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - DAYS_2);

    // NB: facciamo due query separate per semplicità

    // Primo livello: > 7 giorni, level = 0
    const { data: level0, error: level0Err } = await admin
      .from("user_meta")
      .select("user_id, last_activity_at, inactivity_email_level")
      .lte("last_activity_at", sevenDaysAgo.toISOString())
      .eq("inactivity_email_level", 0)
      .is("is_blocked", false);

    if (level0Err) {
      console.error("Errore fetch livello 0:", level0Err);
    }

    // Secondo livello: > 30 giorni, level = 1
    const { data: level1, error: level1Err } = await admin
      .from("user_meta")
      .select("user_id, last_activity_at, inactivity_email_level")
      .lte("last_activity_at", thirtyDaysAgo.toISOString())
      .eq("inactivity_email_level", 1)
      .is("is_blocked", false);

    if (level1Err) {
      console.error("Errore fetch livello 1:", level1Err);
    }

    const toNotify = [
      ...(level0 || []).map((u) => ({ ...u, level: 0 })),
      ...(level1 || []).map((u) => ({ ...u, level: 1 })),
    ];

    // Recupero email utenti
    const userIds = toNotify.map((u) => u.user_id);
    const { data: users, error: usersError } = await admin.auth.admin.listUsers();
    if (usersError) {
      console.error("Errore listUsers:", usersError);
    }

    // mapping user_id -> email
    const emailById = new Map<string, string>();
    users?.users?.forEach((u) => {
      if (u.id && u.email) emailById.set(u.id, u.email);
    });

    // Invio email + update livello
    for (const item of toNotify) {
      const email = emailById.get(item.user_id);
      if (!email) continue;

      try {
        await sendInactivityEmail(email, item.level);

        // aggiorno livello e last_inactivity_email_at
        const { error: updateErr } = await admin
          .from("user_meta")
          .update({
            inactivity_email_level: item.level + 1,
            last_inactivity_email_at: new Date().toISOString(),
          })
          .eq("user_id", item.user_id);

        if (updateErr) {
          console.error("Errore update inactivity_email_level:", updateErr);
        }
      } catch (e) {
        console.error("Errore sendInactivityEmail:", e);
      }
    }

    return NextResponse.json({
      success: true,
      processed: toNotify.length,
    });
  } catch (err) {
    console.error("Errore inatteso in /api/cron/inactivity-reminder:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
```

### src/app/api/stripe/checkout/route.ts

```
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Niente apiVersion qui: Stripe usa quella di default collegata alla chiave
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { plan, userId } = await req.json();

    if (!plan || !userId) {
      return NextResponse.json(
        { error: "Missing plan or userId" },
        { status: 400 }
      );
    }

    // Base URL app:
    // 1) NEXT_PUBLIC_SITE_URL se valida
    // 2) altrimenti origin della request (funziona in localhost)
    const envAppUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const requestOrigin = new URL(req.url).origin;

    const appUrl =
      envAppUrl && envAppUrl.startsWith("http") ? envAppUrl : requestOrigin;

    const successUrl = `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/pricing`;

    const priceId =
      plan === "standard"
        ? process.env.STRIPE_PRICE_STANDARD
        : process.env.STRIPE_PRICE_PRO;

    if (!priceId) {
      console.error(
        "Stripe checkout error: missing price ID for plan",
        plan
      );
      return NextResponse.json(
        { error: "Server misconfigured: missing Stripe price ID" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      // opzionale: potresti passare customer_email dal client se vuoi
      // customer_email,
      metadata: {
        userId,
        plan,
      },
      client_reference_id: userId, // comodo da vedere in Stripe
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json(
      { error: "Stripe checkout failure" },
      { status: 500 }
    );
  }
}
```

### src/app/api/stripe/confirm/route.ts

```
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const metadata = session.metadata || {};
    const userId = metadata.userId;
    const plan = (metadata.plan as "standard" | "pro") || "standard";

    if (!userId) {
      console.error("[CONFIRM] Missing userId in session.metadata", metadata);
      return NextResponse.json(
        { error: "Missing userId in metadata" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { error } = await supabase
      .from("user_subscriptions")
      .upsert(
        {
          user_id: userId,
          plan,
          is_active: true,
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("[CONFIRM] Supabase upsert error:", error);
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    console.log("[CONFIRM] Subscription activated for user:", userId, plan);

    return NextResponse.json({ ok: true, plan });
  } catch (err) {
    console.error("[CONFIRM] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
```

### src/app/api/stripe/create-checkout-session/route.ts

```
// app/api/stripe/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { priceId, userId } = await req.json();

    if (!priceId || !userId) {
      return NextResponse.json({ error: 'Missing priceId or userId' }, { status: 400 });
    }

    const appUrl = process.env.APP_URL || 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/billing/success`,
      cancel_url: `${appUrl}/billing/cancel`,
      metadata: {
        user_id: userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Stripe error' }, { status: 500 });
  }
}
```

### src/app/api/stripe/portal/route.ts

```
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseClient";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

export async function POST(req: Request) {
  try {
    // --- 1) Leggi il body in modo safe (come abbiamo fatto per /portal) ---
    let userId: string | undefined;

    try {
      const rawBody = await req.text();
      if (rawBody) {
        const parsed = JSON.parse(rawBody);
        userId = parsed.userId;
      }
    } catch (parseErr) {
      console.error("[PORTAL] JSON parse error:", parseErr);
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // --- 2) Prova a leggere stripe_customer_id da user_subscriptions ---
    const { data: sub, error: subError } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (subError) {
      console.error("[PORTAL] errore user_subscriptions:", subError);
    }

    let customerId: string | null =
      (sub?.stripe_customer_id as string | null) ?? null;

    // --- 3) Se stripe_customer_id non c'è, cerchiamo il cliente Stripe via email ---
    if (!customerId) {
      // Prendi la mail dall'utente in auth.users
      const {
        data: userData,
        error: userError,
      } = await supabase.auth.admin.getUserById(userId);

      if (userError || !userData?.user?.email) {
        console.error("[PORTAL] impossibile recuperare email utente:", userError);
        return NextResponse.json(
          { error: "Impossibile trovare l'utente o la sua email." },
          { status: 400 }
        );
      }

      const email = userData.user.email;

      console.log("[PORTAL] Nessun stripe_customer_id in DB, cerco per email:", email);

      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });

      const customer = customers.data[0];

      if (!customer) {
        console.error("[PORTAL] Nessun customer Stripe trovato per email:", email);
        return NextResponse.json(
          { error: "Nessun cliente Stripe associato all’account." },
          { status: 400 }
        );
      }

      customerId = customer.id;

      // Prova a salvare il customerId in user_subscriptions per il futuro
      const { error: updateError } = await supabase
        .from("user_subscriptions")
        .update({ stripe_customer_id: customerId })
        .eq("user_id", userId);

      if (updateError) {
        console.error("[PORTAL] errore nel salvataggio stripe_customer_id:", updateError);
      } else {
        console.log("[PORTAL] stripe_customer_id aggiornato per user:", userId);
      }
    }

    if (!customerId) {
      // ultra fallback, non dovrebbe mai arrivare qui
      return NextResponse.json(
        { error: "Nessun cliente Stripe associato all’account." },
        { status: 400 }
      );
    }

    // --- 4) Costruisci la base URL dell’app ---
    const envAppUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const requestOrigin = new URL(req.url).origin;

    const appUrl =
      envAppUrl && envAppUrl.startsWith("http") ? envAppUrl : requestOrigin;

    // --- 5) Crea la sessione del Billing Portal ---
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${appUrl}/dashboard/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err) {
    console.error("[PORTAL] errore inatteso:", err);
    return NextResponse.json(
      { error: "Errore interno apertura portale" },
      { status: 500 }
    );
  }
}
```

### src/app/api/stripe/webhook/route.ts

```
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    console.error("[WEBHOOK] Missing signature header");
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[WEBHOOK] Missing STRIPE_WEBHOOK_SECRET");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 }
    );
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err: any) {
    console.error("[WEBHOOK] Signature verify error:", err.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log("[WEBHOOK] Event received:", event.type);

  const supabase = supabaseAdmin();

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan =
          (session.metadata?.plan as "standard" | "pro") || "standard";

        console.log("[WEBHOOK] checkout.session.completed metadata:", {
          userId,
          plan,
        });

        if (!userId) {
          console.error("[WEBHOOK] Missing userId in session.metadata");
          break;
        }

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;

        // current_period_end dalla subscription se presente
        let currentPeriodEnd: string | null = null;
        const subscriptionId = session.subscription;
        if (typeof subscriptionId === "string") {
          try {
            const subscription = await stripe.subscriptions.retrieve(
              subscriptionId
            );
            const cpe = (subscription as any)
              .current_period_end as number | undefined;
            if (cpe) {
              currentPeriodEnd = new Date(cpe * 1000).toISOString();
            }
          } catch (err) {
            console.error(
              "[WEBHOOK] Error retrieving subscription for checkout.session.completed:",
              err
            );
          }
        }

        const { error } = await supabase
          .from("user_subscriptions")
          .upsert(
            {
              user_id: userId,
              plan,
              is_active: true,
              stripe_customer_id: customerId ?? null,
              current_period_end: currentPeriodEnd,
            },
            { onConflict: "user_id" }
          );

        if (error) {
          console.error("[WEBHOOK] Supabase upsert error:", error);
        } else {
          console.log("[WEBHOOK] Subscription upserted for user:", userId);
        }

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const status = subscription.status;
        const isActive =
          status === "active" || status === "trialing";

        const cpe = (subscription as any)
          .current_period_end as number | undefined;
        const currentPeriodEnd = cpe
          ? new Date(cpe * 1000).toISOString()
          : null;

        // deduci il piano dal priceId SOLO se è attivo
        let plan: "free" | "standard" | "pro" = "free";
        if (isActive) {
          const priceId = subscription.items.data[0]?.price?.id;
          if (priceId === process.env.STRIPE_PRICE_STANDARD) {
            plan = "standard";
          } else if (priceId === process.env.STRIPE_PRICE_PRO) {
            plan = "pro";
          }
        }

        console.log("[WEBHOOK] customer.subscription.updated:", {
          customerId,
          status,
          isActive,
          currentPeriodEnd,
          plan,
        });

        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            is_active: isActive,
            current_period_end: currentPeriodEnd,
            plan,
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error(
            "[WEBHOOK] Supabase update error (subscription.updated):",
            error
          );
        }

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        console.log("[WEBHOOK] customer.subscription.deleted:", {
          customerId,
        });

        const { error } = await supabase
          .from("user_subscriptions")
          .update({
            is_active: false,
            current_period_end: null,
            plan: "free",
          })
          .eq("stripe_customer_id", customerId);

        if (error) {
          console.error(
            "[WEBHOOK] Supabase update error (subscription.deleted):",
            error
          );
        }

        break;
      }

      default:
        console.log("[WEBHOOK] Unhandled event type:", event.type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error("[WEBHOOK] Handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
```

### src/app/api/user/activity/route.ts

```
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const admin = supabaseAdmin();

    // 1) Leggo header Authorization
    const h = await headers();
    const authHeader = h.get("authorization") || h.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();

    // 2) Verifico il token lato server
    const { data: userData, error: getUserError } =
      await admin.auth.getUser(accessToken);

    if (getUserError || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = userData.user.id;

    // 3) Aggiorno last_activity_at
    const { error: updateError } = await admin
      .from("user_meta")
      .update({ last_activity_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Errore update last_activity_at:", updateError);
      return NextResponse.json(
        { error: "Errore aggiornamento attività" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Errore inatteso in /api/user/activity:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}
```
