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