import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";
import PDFDocument from "pdfkit/js/pdfkit.standalone.js";
import fs from "fs";
import path from "path";

type AnyObj = Record<string, any>;

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
      return NextResponse.json({ error: "Analisi non trovata" }, { status: 404 });
    }

    const aj = (data.analysis_json as AnyObj) || {};
    const v2 = (aj.v2 as AnyObj) || {};

    const tipoContratto =
      aj.tipo_contratto || data.from_slug || "Contratto senza titolo";

    const valutazioneRischio = (aj.valutazione_rischio || "Non disponibile")
      .toString()
      .toLowerCase();

    const motivazioneRischio =
      aj.motivazione_rischio ||
      "Apri Contratti Chiari per vedere tutti i dettagli dell'analisi.";

    const createdAt = new Date(data.created_at).toLocaleString("it-IT");

    // ---- PDF SETUP ---------------------------------------------------------
    const doc = new PDFDocument({
      autoFirstPage: false,
      bufferPages: true, // <-- IMPORTANTISSIMO per footer Pag X / Y
    });

    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Roboto-Regular.ttf"
    );
    doc.registerFont("Body", fs.readFileSync(fontPath));

    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));

    const pdfBufferPromise = new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", (err: Error) => reject(err));
    });

    // ---- THEME (Enel-like) -------------------------------------------------
    const theme = {
      paper: "#FFFFFF",
      ink: "#0B1220",
      muted: "#475569",
      line: "#E2E8F0",

      accent: "#2563EB",
      accentSoft: "#EFF6FF",

      cardBg: "#F8FAFC",
      cardStroke: "#E2E8F0",

      warnBg: "#FFFBEB",
      okBg: "#ECFDF5",
      dangerBg: "#FEF2F2",

      warnStroke: "#FDE68A",
      okStroke: "#BBF7D0",
      dangerStroke: "#FECACA",

      warnFg: "#92400E",
      okFg: "#065F46",
      dangerFg: "#991B1B",
    };

    // ---- PAGE / LAYOUT -----------------------------------------------------
    const M = 50;
    const A4W = 595.28;
    const A4H = 841.89;

    const headerH = 66; // header fisso (stile bolletta)
    const footerH = 44; // footer fisso

    const page = {
      left: M,
      right: A4W - M,
      top: M,
      bottom: A4H - M,
    };
    const W = page.right - page.left;

    const cardPadX = 14;
    const cardPadY = 12;
    const cardRadius = 12;
    const cardGap = 12;

    const usableTop = () => page.top + headerH + 14;
    const usableBottom = () => page.bottom - footerH;

    const ensure = (h: number) => {
      if (doc.y + h > usableBottom()) addPage();
    };

    const riskLevelLabel = (lvl?: string) => {
      const s = (lvl || "").toString().toLowerCase();
      if (s === "alto") return "Alto";
      if (s === "medio") return "Medio";
      if (s === "basso") return "Basso";
      return lvl ? String(lvl) : "Non disponibile";
    };

    const riskBadgeTheme = () => {
      if (valutazioneRischio === "alto")
        return { bg: theme.dangerBg, stroke: theme.dangerStroke, fg: theme.dangerFg };
      if (valutazioneRischio === "basso")
        return { bg: theme.okBg, stroke: theme.okStroke, fg: theme.okFg };
      return { bg: theme.warnBg, stroke: theme.warnStroke, fg: theme.warnFg };
    };

    const checklistLabel = (t?: string) => {
      if (t === "action") return { tag: "AZIONE", color: "#111827" };
      if (t === "caution") return { tag: "ATTENZIONE", color: theme.warnFg };
      return { tag: "OK", color: theme.okFg };
    };

    const trafficColor = (traffic: string) => {
      if (traffic === "red") return "#EF4444";
      if (traffic === "green") return "#22C55E";
      return "#F59E0B";
    };

    const shortId = (full: string) => {
      const s = String(full || "");
      if (s.length <= 10) return s;
      return `${s.slice(0, 6)}…${s.slice(-4)}`;
    };

    // ---- MEASURE HELPERS (NO PAGE BREAKS HERE) -----------------------------
    const measureText = (
      text: string,
      opts: { fontSize: number; width: number; align?: any }
    ) => {
      const t = (text || "").toString();
      if (!t.trim()) return 0;
      doc.font("Body").fontSize(opts.fontSize);
      return doc.heightOfString(t, {
        width: opts.width,
        align: opts.align ?? "left",
      });
    };

    const lineH = (fontSize: number) => {
      doc.fontSize(fontSize);
      return doc.currentLineHeight(true);
    };

    // ---- FIXED HEADER / FOOTER --------------------------------------------
    const drawFixedHeader = () => {
      const y = page.top;
      const x = page.left;

      // Card bianca “bolletta” + barra blu laterale
      doc.save();
      doc.roundedRect(x, y, W, headerH, 14).fill(theme.paper);
      doc.roundedRect(x, y, W, headerH, 14).stroke(theme.line);
      doc.rect(x, y, 12, headerH).fill(theme.accent);
      doc.restore();

      // Titolo
      doc.fillColor(theme.ink).fontSize(16);
      doc.text("Analisi del contratto", x + 22, y + 14, {
        width: W - 220,
      });

      // Riga meta (stile bolletta)
      doc.fillColor(theme.muted).fontSize(9);
      doc.text(`Data: ${createdAt}`, x + 22, y + 36, { width: W - 220 });
      doc.text(`ID: ${shortId(data.id)}`, x + 170, y + 36, { width: W - 220 });

      // Badge rischio a destra
      const badge = riskBadgeTheme();
      const bw = 170;
      const bh = 34;
      const bx = page.right - bw;
      const by = y + 18;

      doc.save();
      doc.roundedRect(bx, by, bw, bh, 12).fill(badge.bg);
      doc.roundedRect(bx, by, bw, bh, 12).stroke(badge.stroke);
      doc.restore();

      doc.fillColor(badge.fg).fontSize(9);
      doc.text("Rischio", bx + 12, by + 7, { width: bw - 24 });
      doc.fillColor(theme.ink).fontSize(12);
      doc.text(riskLevelLabel(valutazioneRischio), bx + 12, by + 17, {
        width: bw - 24,
      });
    };

    const drawFixedFooter = (pageIndex: number, totalPages: number) => {
      const x = page.left;
      const y = page.bottom - footerH + 10;

      // Linea sottile
      doc
        .moveTo(x, y)
        .lineTo(page.right, y)
        .strokeColor(theme.line)
        .lineWidth(1)
        .stroke();

      // Paginazione
      doc.fillColor(theme.muted).fontSize(9);
      doc.text(`Pag. ${pageIndex} / ${totalPages}`, x, y + 10, {
        width: W,
        align: "right",
      });

      // Disclaimer (stile bolletta / nota)
      doc.fillColor(theme.muted).fontSize(8);
      doc.text(
        "Documento generato automaticamente da Contratti Chiari. Non sostituisce una consulenza legale.",
        x,
        y + 10,
        { width: W - 110, align: "left" }
      );
    };

    // ---- PAGE ADD ----------------------------------------------------------
    const addPage = () => {
      doc.addPage({ size: "A4", margin: M });
      doc.font("Body");
      doc.fillColor(theme.ink);

      drawFixedHeader();

      // Cursor nell’area contenuti (sotto header)
      doc.x = page.left;
      doc.y = usableTop();
    };

    addPage();

    // ---- DRAW HELPERS ------------------------------------------------------
    const divider = () => {
      ensure(18);
      doc
        .moveTo(page.left, doc.y)
        .lineTo(page.right, doc.y)
        .strokeColor(theme.line)
        .lineWidth(1)
        .stroke();
      doc.y += 14;
      doc.x = page.left;
    };

    const sectionTitle = (title: string) => {
      const h = 26;
      ensure(h + 10);
      const y = doc.y;

      doc.save();
      doc.roundedRect(page.left, y, W, h, 10).fill(theme.accentSoft);
      doc.restore();

      doc.fillColor(theme.accent).fontSize(11);
      doc.text(title.toUpperCase(), page.left + 12, y + 8, { width: W - 24 });

      doc.fillColor(theme.ink);
      doc.y = y + h + 12;
      doc.x = page.left;
    };

    // Card misurata (misura -> page break -> box -> testo)
    const measuredCard = (
      opts: { bg?: string; stroke?: string } = {},
      measure: () => number,
      render: (x: number, y: number, w: number) => void
    ) => {
      const bg = opts.bg ?? theme.cardBg;
      const stroke = opts.stroke ?? theme.cardStroke;

      const contentH = measure();
      const h = Math.max(56, contentH + cardPadY * 2 + 6);

      const maxH = usableBottom() - usableTop();
      if (h > maxH) {
        // fallback: niente box, ma evita pagine vuote
        ensure(40);
        render(page.left, doc.y, W);
        doc.y += 12;
        doc.x = page.left;
        return;
      }

      ensure(h);

      const x = page.left;
      const y = doc.y;

      doc.save();
      doc.roundedRect(x, y, W, h, cardRadius).fill(bg);
      doc.roundedRect(x, y, W, h, cardRadius).stroke(stroke);
      doc.restore();

      const ix = x + cardPadX;
      const iy = y + cardPadY;
      const iw = W - cardPadX * 2;

      render(ix, iy, iw);

      doc.y = y + h + cardGap;
      doc.x = page.left;
    };

    const renderLabelValue = (
      x: number,
      y: number,
      w: number,
      label: string,
      value: string
    ) => {
      doc.fillColor(theme.muted).fontSize(10);
      doc.text(label, x, y, { width: w });
      y += lineH(10) + 2;

      doc.fillColor(theme.ink).fontSize(12);
      doc.text(value, x, y, { width: w });
      y += measureText(value, { fontSize: 12, width: w }) + 10;

      return y;
    };

    // ---- START BUILD -------------------------------------------------------
    // “Guida alla lettura” (wow + bolletta)
    sectionTitle("Guida alla lettura");
    measuredCard(
      { bg: theme.paper, stroke: theme.line },
      () => {
        const w = W - cardPadX * 2;
        let h = 0;

        h += measureText("• Semaforo clausole:  verde = ok, giallo = attenzione, rosso = rischio alto.", { fontSize: 11, width: w }) + 4;
        h += measureText("• Indice di rischio (0–100): più è alto, più il contratto è sbilanciato o rischioso.", { fontSize: 11, width: w }) + 4;
        h += measureText("• Le sezioni 'legacy' mantengono la compatibilità con le analisi precedenti.", { fontSize: 11, width: w }) + 2;

        return h;
      },
      (x, y, w) => {
        doc.fillColor(theme.ink).fontSize(11);
        doc.text("• Semaforo clausole:  verde = ok, giallo = attenzione, rosso = rischio alto.", x, y, { width: w });
        y += measureText("• Semaforo clausole:  verde = ok, giallo = attenzione, rosso = rischio alto.", { fontSize: 11, width: w }) + 4;

        doc.text("• Indice di rischio (0–100): più è alto, più il contratto è sbilanciato o rischioso.", x, y, { width: w });
        y += measureText("• Indice di rischio (0–100): più è alto, più il contratto è sbilanciato o rischioso.", { fontSize: 11, width: w }) + 4;

        doc.text("• Le sezioni 'legacy' mantengono la compatibilità con le analisi precedenti.", x, y, { width: w });
      }
    );

    divider();

    // --- Dettagli principali (legacy)
    sectionTitle("Dettagli principali");
    measuredCard(
      {},
      () => {
        const w = W - cardPadX * 2;
        let h = 0;

        h += lineH(10) + 2 + measureText(String(tipoContratto), { fontSize: 12, width: w }) + 10;
        h += lineH(10) + 2 + measureText(riskLevelLabel(valutazioneRischio), { fontSize: 12, width: w }) + 10;

        h += lineH(12) + 6;
        h += measureText(String(motivazioneRischio), { fontSize: 11, width: w, align: "justify" }) + 2;
        return h;
      },
      (x, y, w) => {
        y = renderLabelValue(x, y, w, "Tipo di contratto", String(tipoContratto));
        y = renderLabelValue(
          x,
          y,
          w,
          "Valutazione del rischio",
          riskLevelLabel(valutazioneRischio)
        );

        doc.fillColor(theme.ink).fontSize(12);
        doc.text("Motivazione della valutazione", x, y, { width: w });
        y += lineH(12) + 6;

        doc.fillColor(theme.ink).fontSize(11);
        doc.text(String(motivazioneRischio), x, y, {
          width: w,
          align: "justify",
        });
      }
    );

    divider();

    // --- Sintesi Pro (v2)
    sectionTitle("Sintesi Pro");

    if (v2.contract_type_short) {
      measuredCard(
        { bg: theme.accentSoft, stroke: theme.line },
        () => {
          const w = W - cardPadX * 2;
          return measureText(`Tipo (v2): ${String(v2.contract_type_short)}`, {
            fontSize: 11,
            width: w,
          });
        },
        (x, y, w) => {
          doc.fillColor(theme.accent).fontSize(11);
          doc.text(`TIPO (V2): ${String(v2.contract_type_short).toUpperCase()}`, x, y, {
            width: w,
          });
        }
      );
    }

    if (v2.risk_index?.score != null) {
      measuredCard(
        {},
        () => {
          const w = W - cardPadX * 2;
          const score = Number(v2.risk_index.score);
          const lvl = riskLevelLabel(v2.risk_index.level);
          let h = 0;

          h += lineH(10) + 2 + measureText(`${isFinite(score) ? score : "—"}/100 (${lvl})`, { fontSize: 12, width: w }) + 10;
          if (v2.risk_index.why_short) {
            h += measureText(String(v2.risk_index.why_short), { fontSize: 11, width: w, align: "justify" }) + 2;
          }
          return h;
        },
        (x, y, w) => {
          const score = Number(v2.risk_index.score);
          const lvl = riskLevelLabel(v2.risk_index.level);

          y = renderLabelValue(
            x,
            y,
            w,
            "Indice di rischio complessivo",
            `${isFinite(score) ? score : "—"}/100 (${lvl})`
          );

          if (v2.risk_index.why_short) {
            doc.fillColor(theme.ink).fontSize(11);
            doc.text(String(v2.risk_index.why_short), x, y, {
              width: w,
              align: "justify",
            });
          }
        }
      );
    }

    {
      const pl = (v2.plain_language || aj.riassunto_semplice || "Non disponibile").toString();
      measuredCard(
        { bg: theme.accentSoft, stroke: theme.line },
        () => {
          const w = W - cardPadX * 2;
          let h = 0;
          h += lineH(12) + 6;
          h += measureText(pl, { fontSize: 11, width: w, align: "justify" }) + 2;
          return h;
        },
        (x, y, w) => {
          doc.fillColor(theme.ink).fontSize(12);
          doc.text("In parole semplici", x, y, { width: w });
          y += lineH(12) + 6;

          doc.fillColor(theme.ink).fontSize(11);
          doc.text(pl, x, y, { width: w, align: "justify" });
        }
      );
    }

    if (v2.balance_score?.user != null && v2.balance_score?.counterparty != null) {
      measuredCard(
        {},
        () => {
          const w = W - cardPadX * 2;
          const userPct = Number(v2.balance_score.user);
          const cpPct = Number(v2.balance_score.counterparty);
          let h = 0;

          h += lineH(10) + 2 + measureText(`${isFinite(userPct) ? userPct : "—"}% / ${isFinite(cpPct) ? cpPct : "—"}%`, { fontSize: 12, width: w }) + 10;
          if (v2.balance_score.note) {
            h += measureText(String(v2.balance_score.note), { fontSize: 11, width: w, align: "justify" }) + 2;
          }
          return h;
        },
        (x, y, w) => {
          const userPct = Number(v2.balance_score.user);
          const cpPct = Number(v2.balance_score.counterparty);

          y = renderLabelValue(
            x,
            y,
            w,
            "Equilibrio (tu vs controparte)",
            `${isFinite(userPct) ? userPct : "—"}% / ${isFinite(cpPct) ? cpPct : "—"}%`
          );

          if (v2.balance_score.note) {
            doc.fillColor(theme.ink).fontSize(11);
            doc.text(String(v2.balance_score.note), x, y, {
              width: w,
              align: "justify",
            });
          }
        }
      );
    }

    if (Array.isArray(v2.checklist) && v2.checklist.length) {
      measuredCard(
        {},
        () => {
          const w = W - cardPadX * 2;
          let h = 0;
          h += lineH(12) + 8;
          v2.checklist.slice(0, 12).forEach((it: AnyObj) => {
            const tag = checklistLabel(it?.type).tag;
            const row = `[${tag}] ${String(it?.text || "")}`;
            h += measureText(row, { fontSize: 11, width: w }) + 6;
          });
          return h;
        },
        (x, y, w) => {
          doc.fillColor(theme.ink).fontSize(12);
          doc.text("Cosa fare ora", x, y, { width: w });
          y += lineH(12) + 8;

          v2.checklist.slice(0, 12).forEach((it: AnyObj) => {
            const { tag, color } = checklistLabel(it?.type);
            doc.fillColor(color).fontSize(10);
            doc.text(`[${tag}]`, x, y, { width: w, continued: true });
            doc.fillColor(theme.ink).fontSize(11);
            doc.text(` ${String(it?.text || "")}`, { width: w });
            y += measureText(` ${String(it?.text || "")}`, { fontSize: 11, width: w }) + 6;
          });
        }
      );
    }

    divider();

    // --- Top 3 clausole più rischiose (v2)
    if (Array.isArray(v2.top_risk_clauses) && v2.top_risk_clauses.length) {
      sectionTitle("Top 3 clausole più rischiose");

      v2.top_risk_clauses.slice(0, 3).forEach((c: AnyObj, idx: number) => {
        const title = String(c?.title || `Clausola ${idx + 1}`);
        const score = c?.risk_score != null ? Number(c.risk_score) : null;
        const lvl = riskLevelLabel(c?.risk_level);
        const why = c?.why_short ? String(c.why_short) : "";
        const excerpt = c?.excerpt ? String(c.excerpt) : "";

        measuredCard(
          { bg: theme.cardBg, stroke: theme.cardStroke },
          () => {
            const w = W - cardPadX * 2;
            let h = 0;

            h += measureText(title, { fontSize: 12, width: w }) + 6;
            if (score != null && isFinite(score)) {
              h += measureText(`Rischio: ${score}/100 (${lvl})`, { fontSize: 10, width: w }) + 6;
            }
            if (why) h += measureText(why, { fontSize: 11, width: w, align: "justify" }) + 6;
            if (excerpt) h += measureText(excerpt, { fontSize: 10, width: w }) + 2;
            return h;
          },
          (x, y, w) => {
            doc.fillColor(theme.ink).fontSize(12);
            doc.text(title, x, y, { width: w });
            y += measureText(title, { fontSize: 12, width: w }) + 6;

            if (score != null && isFinite(score)) {
              doc.fillColor(theme.muted).fontSize(10);
              doc.text(`Rischio: ${score}/100 (${lvl})`, x, y, { width: w });
              y += measureText(`Rischio: ${score}/100 (${lvl})`, { fontSize: 10, width: w }) + 6;
            }

            if (why) {
              doc.fillColor(theme.ink).fontSize(11);
              doc.text(why, x, y, { width: w, align: "justify" });
              y += measureText(why, { fontSize: 11, width: w, align: "justify" }) + 6;
            }

            if (excerpt) {
              doc.fillColor(theme.muted).fontSize(10);
              doc.text(excerpt, x, y, { width: w });
            }
          }
        );
      });

      divider();
    }

    // --- Clausole evidenziate (v2)
    if (Array.isArray(v2.clauses_enriched) && v2.clauses_enriched.length) {
      sectionTitle("Clausole evidenziate (semaforo)");

      v2.clauses_enriched.slice(0, 80).forEach((c: AnyObj, idx: number) => {
        const traffic = String(c?.traffic_light || "yellow");
        const score = c?.risk_score != null ? Number(c.risk_score) : null;
        const lvl = riskLevelLabel(c?.risk_level);

        const bg =
          traffic === "red"
            ? theme.dangerBg
            : traffic === "green"
            ? theme.okBg
            : theme.warnBg;

        const stroke =
          traffic === "red"
            ? theme.dangerStroke
            : traffic === "green"
            ? theme.okStroke
            : theme.warnStroke;

        const title = String(c?.title || `Clausola ${idx + 1}`);
        const excerpt = c?.excerpt ? String(c.excerpt) : "";
        const diagnostic = c?.diagnostic ? String(c.diagnostic) : "";
        const highlights = Array.isArray(c?.highlights)
          ? c.highlights.slice(0, 3).map((x: any) => String(x))
          : [];

        measuredCard(
          { bg, stroke },
          () => {
            const w = W - cardPadX * 2 - 18;
            let h = 0;

            h += measureText(title, { fontSize: 12, width: w }) + 6;
            if (score != null && isFinite(score)) {
              h += measureText(`Rischio: ${score}/100 (${lvl})`, { fontSize: 10, width: w }) + 6;
            }
            if (excerpt) h += measureText(excerpt, { fontSize: 11, width: w }) + 6;
            if (diagnostic)
              h += measureText(`Diagnostica: ${diagnostic}`, {
                fontSize: 10,
                width: w,
                align: "justify",
              }) + 6;
            highlights.forEach((t: string) => {
              h += measureText(`• ${t}`, { fontSize: 11, width: w }) + 2;
            });
            return h;
          },
          (x, y, w) => {
            const dot = trafficColor(traffic);
            doc.save();
            doc.circle(x + 5, y + 7, 4).fill(dot);
            doc.restore();

            const tx = x + 16;
            const tw = w - 16;

            doc.fillColor(theme.ink).fontSize(12);
            doc.text(title, tx, y, { width: tw });
            y += measureText(title, { fontSize: 12, width: tw }) + 6;

            if (score != null && isFinite(score)) {
              doc.fillColor(theme.muted).fontSize(10);
              doc.text(`Rischio: ${score}/100 (${lvl})`, tx, y, { width: tw });
              y += measureText(`Rischio: ${score}/100 (${lvl})`, { fontSize: 10, width: tw }) + 6;
            }

            if (excerpt) {
              doc.fillColor(theme.ink).fontSize(11);
              doc.text(excerpt, tx, y, { width: tw });
              y += measureText(excerpt, { fontSize: 11, width: tw }) + 6;
            }

            if (diagnostic) {
              doc.fillColor(theme.muted).fontSize(10);
              doc.text(`Diagnostica: ${diagnostic}`, tx, y, {
                width: tw,
                align: "justify",
              });
              y +=
                measureText(`Diagnostica: ${diagnostic}`, {
                  fontSize: 10,
                  width: tw,
                  align: "justify",
                }) + 6;
            }

            if (highlights.length) {
              doc.fillColor(theme.ink).fontSize(11);
              highlights.forEach((t: string) => {
                doc.text(`• ${t}`, tx, y, { width: tw });
                y += measureText(`• ${t}`, { fontSize: 11, width: tw }) + 2;
              });
            }
          }
        );
      });

      divider();
    }

    // --- Clausole critiche (legacy)
    if (Array.isArray(aj.clausole_critiche) && aj.clausole_critiche.length) {
      sectionTitle("Clausole critiche (legacy)");

      aj.clausole_critiche.slice(0, 60).forEach((c: AnyObj, idx: number) => {
        const title = String(c?.titolo || `Clausola critica ${idx + 1}`);
        const risk = c?.rischio_specifico ? riskLevelLabel(c.rischio_specifico) : "";
        const estratto = c?.estratto_originale ? String(c.estratto_originale) : "";
        const why = c?.perche_critica ? String(c.perche_critica) : "";
        const sug = c?.suggerimento_modifica ? String(c.suggerimento_modifica) : "";

        measuredCard(
          {},
          () => {
            const w = W - cardPadX * 2;
            let h = 0;

            h += measureText(title, { fontSize: 12, width: w }) + 6;
            if (risk) h += measureText(`Rischio: ${risk}`, { fontSize: 10, width: w }) + 6;

            if (estratto) {
              h += measureText("Estratto:", { fontSize: 11, width: w }) + 2;
              h += measureText(estratto, { fontSize: 10, width: w }) + 6;
            }

            if (why) {
              h += measureText("Perché è critica:", { fontSize: 11, width: w }) + 2;
              h += measureText(why, { fontSize: 10, width: w, align: "justify" }) + 6;
            }

            if (sug) {
              h += measureText("Suggerimento:", { fontSize: 11, width: w }) + 2;
              h += measureText(sug, { fontSize: 10, width: w, align: "justify" }) + 2;
            }

            return h;
          },
          (x, y, w) => {
            doc.fillColor(theme.ink).fontSize(12);
            doc.text(title, x, y, { width: w });
            y += measureText(title, { fontSize: 12, width: w }) + 6;

            if (risk) {
              doc.fillColor(theme.muted).fontSize(10);
              doc.text(`Rischio: ${risk}`, x, y, { width: w });
              y += measureText(`Rischio: ${risk}`, { fontSize: 10, width: w }) + 6;
            }

            if (estratto) {
              doc.fillColor(theme.ink).fontSize(11);
              doc.text("Estratto:", x, y, { width: w });
              y += measureText("Estratto:", { fontSize: 11, width: w }) + 2;

              doc.fillColor(theme.ink).fontSize(10);
              doc.text(estratto, x, y, { width: w });
              y += measureText(estratto, { fontSize: 10, width: w }) + 6;
            }

            if (why) {
              doc.fillColor(theme.ink).fontSize(11);
              doc.text("Perché è critica:", x, y, { width: w });
              y += measureText("Perché è critica:", { fontSize: 11, width: w }) + 2;

              doc.fillColor(theme.ink).fontSize(10);
              doc.text(why, x, y, { width: w, align: "justify" });
              y += measureText(why, { fontSize: 10, width: w, align: "justify" }) + 6;
            }

            if (sug) {
              doc.fillColor(theme.ink).fontSize(11);
              doc.text("Suggerimento:", x, y, { width: w });
              y += measureText("Suggerimento:", { fontSize: 11, width: w }) + 2;

              doc.fillColor(theme.ink).fontSize(10);
              doc.text(sug, x, y, { width: w, align: "justify" });
            }
          }
        );
      });

      divider();
    }

    // --- Clausole vessatorie potenziali (legacy)
    if (
      Array.isArray(aj.clausole_vessatorie_potenziali) &&
      aj.clausole_vessatorie_potenziali.length
    ) {
      sectionTitle("Clausole vessatorie potenziali");

      aj.clausole_vessatorie_potenziali.slice(0, 60).forEach((c: AnyObj, idx: number) => {
        const title = String(c?.clausola || `Clausola ${idx + 1}`);
        const why = c?.perche_vessatoria ? String(c.perche_vessatoria) : "";
        const estratto = c?.estratto_originale ? String(c.estratto_originale) : "";
        const ref = c?.riferimento_normativo ? String(c.riferimento_normativo) : "";

        measuredCard(
          { bg: theme.warnBg, stroke: theme.warnStroke },
          () => {
            const w = W - cardPadX * 2;
            let h = 0;

            h += measureText(title, { fontSize: 12, width: w }) + 6;
            if (why) h += measureText(why, { fontSize: 10, width: w, align: "justify" }) + 6;
            if (estratto) h += measureText(estratto, { fontSize: 10, width: w }) + 6;
            if (ref) h += measureText(`Riferimento: ${ref}`, { fontSize: 10, width: w }) + 2;
            return h;
          },
          (x, y, w) => {
            doc.fillColor(theme.ink).fontSize(12);
            doc.text(title, x, y, { width: w });
            y += measureText(title, { fontSize: 12, width: w }) + 6;

            if (why) {
              doc.fillColor(theme.ink).fontSize(10);
              doc.text(why, x, y, { width: w, align: "justify" });
              y += measureText(why, { fontSize: 10, width: w, align: "justify" }) + 6;
            }

            if (estratto) {
              doc.fillColor(theme.muted).fontSize(10);
              doc.text(estratto, x, y, { width: w });
              y += measureText(estratto, { fontSize: 10, width: w }) + 6;
            }

            if (ref) {
              doc.fillColor(theme.muted).fontSize(10);
              doc.text(`Riferimento: ${ref}`, x, y, { width: w });
            }
          }
        );
      });

      divider();
    }

    // --- Versione riequilibrata
    if (aj.versione_riequilibrata) {
      sectionTitle("Versione riequilibrata");

      const text = String(aj.versione_riequilibrata);
      measuredCard(
        { bg: theme.cardBg, stroke: theme.cardStroke },
        () => {
          const w = W - cardPadX * 2;
          return measureText(text, { fontSize: 11, width: w, align: "justify" }) + 4;
        },
        (x, y, w) => {
          doc.fillColor(theme.ink).fontSize(11);
          doc.text(text, x, y, { width: w, align: "justify" });
        }
      );

      divider();
    }

    // --- Punti a favore / sfavore (semplici ma puliti)
    const renderBullets = (items: string[]) => {
      items.filter(Boolean).forEach((t) => {
        doc.fillColor(theme.ink).fontSize(11);
        doc.text(`• ${t}`, { width: W });
      });
      doc.y += 6;
    };

    if (Array.isArray(aj.punti_a_favore_dell_utente) && aj.punti_a_favore_dell_utente.length) {
      sectionTitle("Punti a favore");
      ensure(20);
      renderBullets(aj.punti_a_favore_dell_utente.map((x: any) => String(x)));
      divider();
    }

    if (Array.isArray(aj.punti_a_sfavore_dell_utente) && aj.punti_a_sfavore_dell_utente.length) {
      sectionTitle("Punti a sfavore");
      ensure(20);
      renderBullets(aj.punti_a_sfavore_dell_utente.map((x: any) => String(x)));
      divider();
    }

    // --- Glossario
    if (Array.isArray(aj.glossario) && aj.glossario.length) {
      sectionTitle("Glossario");

      aj.glossario.slice(0, 120).forEach((g: AnyObj) => {
        const term = String(g?.termine || "Termine");
        const expl = g?.spiegazione ? String(g.spiegazione) : "";

        measuredCard(
          { bg: theme.cardBg, stroke: theme.cardStroke },
          () => {
            const w = W - cardPadX * 2;
            let h = 0;
            h += measureText(term, { fontSize: 11, width: w }) + 4;
            if (expl) h += measureText(expl, { fontSize: 10, width: w, align: "justify" }) + 2;
            return h;
          },
          (x, y, w) => {
            doc.fillColor(theme.ink).fontSize(11);
            doc.text(term, x, y, { width: w });
            y += measureText(term, { fontSize: 11, width: w }) + 4;

            if (expl) {
              doc.fillColor(theme.muted).fontSize(10);
              doc.text(expl, x, y, { width: w, align: "justify" });
            }
          }
        );
      });

      divider();
    }

    // --- Alert finali
    if (Array.isArray(aj.alert_finali) && aj.alert_finali.length) {
      sectionTitle("Alert finali");
      measuredCard(
        { bg: theme.warnBg, stroke: theme.warnStroke },
        () => {
          const w = W - cardPadX * 2;
          let h = 0;
          aj.alert_finali.slice(0, 40).forEach((t: any) => {
            h += measureText(`• ${String(t)}`, { fontSize: 11, width: w }) + 2;
          });
          return h;
        },
        (x, y, w) => {
          doc.fillColor(theme.ink).fontSize(11);
          aj.alert_finali.slice(0, 40).forEach((t: any) => {
            doc.text(`• ${String(t)}`, x, y, { width: w });
            y += measureText(`• ${String(t)}`, { fontSize: 11, width: w }) + 2;
          });
        }
      );
      divider();
    }

    // --- PASS 2: header/footer per tutte le pagine (Pag X / Y) --------------
    const range = doc.bufferedPageRange(); // { start: 0, count: N }
    const totalPages = range.count;

    for (let i = 0; i < totalPages; i++) {
      doc.switchToPage(range.start + i);

      // header già disegnato in addPage, ma nel caso di future evoluzioni:
      // ridisegnarlo è ok (è in alto, non tocca il body perché body parte da usableTop()).
      drawFixedHeader();

      drawFixedFooter(i + 1, totalPages);
    }

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