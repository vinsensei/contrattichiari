# Project Snapshot

## Tree: src/app

```
src/app
- src/app/(marketing)/[...slug]/page.tsx
- src/app/(marketing)/argomenti/[topic]/page.tsx
- src/app/(marketing)/argomenti/page.tsx
- src/app/analysis/[id]/page.tsx
- src/app/api/account/delete/route.ts
- src/app/api/analysis/[id]/pdf/route.ts
- src/app/api/analysis/[id]/route.ts
- src/app/api/analysis/anonymous/route.ts
- src/app/api/analysis/route.ts
- src/app/api/auth/signup/route.ts
- src/app/api/contracts/analyze/route.ts
- src/app/api/cron/inactivityreminder/route.ts
- src/app/api/password/forgot/route.ts
- src/app/api/password/reset/route.ts
- src/app/api/stripe/checkout/route.ts
- src/app/api/stripe/confirm/route.ts
- src/app/api/stripe/create-checkout-session/route.ts
- src/app/api/stripe/portal/route.ts
- src/app/api/stripe/webhook/route.ts
- src/app/api/user/activity/route.ts
- src/app/apple-icon.png
- src/app/cookie/page.tsx
- src/app/dashboard/account/page.tsx
- src/app/dashboard/analyses/page.tsx
- src/app/dashboard/page.tsx
- src/app/favicon.ico
- src/app/globals.css
- src/app/icon.png
- src/app/layout.tsx
- src/app/login/page.tsx
- src/app/manifest.ts
- src/app/not-found.tsx
- src/app/page.tsx
- src/app/password/forgot/page.tsx
- src/app/password/reset/page.tsx
- src/app/pricing/page.tsx
- src/app/pricing/success/page.tsx
- src/app/privacy/page.tsx
- src/app/register/page.tsx
- src/app/robots.ts
- src/app/sitemap.ts
- src/app/termini/page.tsx
- src/app/upload/page.tsx
```

## Tree: src/components

```
src/components
- src/components/.DS_Store
- src/components/AnalysisListItem.tsx
- src/components/AnalyticsProvider.tsx
- src/components/ContractUploadForm.tsx
- src/components/CookieBanner.tsx
- src/components/HeaderPrivate.tsx
- src/components/HeaderPublic.tsx
- src/components/MobilePricingCTA.tsx
- src/components/PlanGate.tsx
- src/components/SectionHeader.tsx
- src/components/WhyYouSeeThis.tsx
- src/components/analysis/.DS_Store
- src/components/analysis/AnalysisHeader.tsx
- src/components/analysis/AnchorNav.tsx
- src/components/analysis/ContractTypePill.tsx
- src/components/analysis/GoToMarket.tsx
- src/components/analysis/SectionAnalysisHero.tsx
- src/components/analysis/SectionCriticalClausesFull.tsx
- src/components/analysis/SectionFinalAlerts.tsx
- src/components/analysis/SectionGlossary.tsx
- src/components/analysis/SectionPreviewCriticalClauses.tsx
- src/components/analysis/SectionPreviewUnfairClauses.tsx
- src/components/analysis/SectionRebalancedVersion.tsx
- src/components/analysis/SectionSummary.tsx
- src/components/analysis/SectionUnfairClausesFull.tsx
- src/components/analysis/SectionUpgradeCta.tsx
- src/components/analysis/SectionsV2Blocks.tsx
- src/components/analysis/anchors.ts
- src/components/analysis/pro/ProLockedSection.tsx
- src/components/analysis/pro/SectionBalanceScoreBox.tsx
- src/components/analysis/pro/SectionChecklistBox.tsx
- src/components/analysis/pro/SectionClausesList.tsx
- src/components/analysis/pro/SectionRiskIndexBox.tsx
- src/components/analysis/pro/SectionTopRiskClausesBox.tsx
- src/components/analysis/proPlaceholders.ts
- src/components/gating/SectionLock.tsx
```

## Tree: src/lib

```
src/lib
- src/lib/editorialConfig.ts
- src/lib/emailTemplate.ts
- src/lib/emails.ts
- src/lib/gtag.ts
- src/lib/landingConfig.ts
- src/lib/openaiClient.ts
- src/lib/resendClient.ts
- src/lib/supabaseClient.ts
- src/lib/trackActivity.ts
- src/lib/whyYouSeeThis.ts
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
    "next": "^16.0.7",
    "openai": "^6.9.1",
    "pdfkit": "^0.17.2",
    "react": "19.2.0",
    "react-dom": "19.2.0",
    "resend": "^6.5.2",
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
      console.warn(
        "Unsupported file extension for anonymous analysis:",
        originalName
      );

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
Analizza il seguente contratto (testo o file allegato) e restituisci SOLO un JSON valido.

VINCOLO DI COMPATIBILITÀ (IMPORTANTISSIMO):
- Devi mantenere ESATTAMENTE tutte le chiavi legacy già previste (stessi nomi e stessi tipi).
- NON rimuovere, NON rinominare, NON cambiare tipo dei campi legacy.
- Devi AGGIUNGERE un nuovo campo "v2" (append-only) con la struttura richiesta sotto.
- Rispondi SOLO con JSON valido. Nessun testo fuori dal JSON.

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
  ],
  "v2": {
    "schema_version": "2.0",
    "contract_type_short": "web-agency" | "affitto" | "lavoro" | "consulenza" | "nda" | "fornitura" | "saas" | "altro",
    "risk_index": {
      "score": number,
      "level": "basso" | "medio" | "alto",
      "why_short": string
    },
    "top_risk_clauses": [
      {
        "clause_id": string,
        "title": string,
        "risk_score": number,
        "risk_level": "basso" | "medio" | "alto",
        "why_short": string,
        "excerpt": string
      }
    ],
    "plain_language": string,
    "balance_score": {
      "user": number,
      "counterparty": number,
      "note": string
    },
    "checklist": [
      { "type": "action" | "caution" | "ok", "text": string }
    ],
    "clauses_enriched": [
      {
        "clause_id": string,
        "title": string,
        "excerpt": string,
        "risk_level": "basso" | "medio" | "alto",
        "risk_score": number,
        "traffic_light": "green" | "yellow" | "red",
        "diagnostic": string,
        "highlights": [ string ]
      }
    ]
  }
}

REGOLE IMPORTANTI:
- Il contratto è in italiano.
- Rispondi SOLO con JSON valido.
- Nessun testo fuori dal JSON.
- Score numerici:
  - v2.risk_index.score: 0-100
  - v2.*.risk_score: 0-100
- v2.balance_score.user + v2.balance_score.counterparty devono sommare a 100.
- clause_id deve essere stabile e semplice: "c1", "c2", "c3"... (uno per ogni elemento di v2.clauses_enriched).
- v2.top_risk_clauses deve contenere ESATTAMENTE 3 elementi (se possibile). Se non possibile, metti meno elementi ma mai null.
- v2.plain_language deve essere massimo 500 caratteri.
- v2.diagnostic deve essere massimo 250 caratteri.
- v2.highlights: massimo 3 frasi brevi.
- Le parole string/number nello schema indicano il tipo, NON devono comparire come valori.
- In "v2" non usare mai null per oggetti o array: se mancano dati usa stringhe brevi o array vuoti [].
- Se non hai abbastanza informazioni, compila comunque i campi con stringhe brevi tipo "Informazioni insufficienti nel testo fornito".
- In "v2" non usare mai null per oggetti o array: se mancano dati usa stringhe brevi o array vuoti [].
- Le parole string/number nello schema indicano il tipo, NON devono comparire come valori.
- v2.contract_type_short deve essere uno slug breve in minuscolo (es: "web-agency", "affitto", "lavoro", "nda", "consulenza", "fornitura", "altro").
- v2.contract_type_short deve essere UNO tra: "web-agency" | "affitto" | "lavoro" | "consulenza" | "nda" | "fornitura" | "saas" | "altro".

Ora analizza questo contratto:`;

    const answerRule =
      "RISPOSTA: restituisci SOLO il JSON, senza backtick, senza markdown, senza commenti.";

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
              { type: "input_text", text: `${userPrompt}\n\n${answerRule}` },
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

${contractText}

${answerRule}`;

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
            error:
              "Il motore di analisi ha restituito un risultato non valido.",
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
        currentPeriodEnd !== null && currentPeriodEnd.getTime() < now.getTime();

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
Analizza il seguente contratto (testo o file allegato) e restituisci SOLO un JSON valido.

VINCOLO DI COMPATIBILITÀ (IMPORTANTISSIMO):
- Devi mantenere ESATTAMENTE tutte le chiavi legacy già previste (stessi nomi e stessi tipi).
- NON rimuovere, NON rinominare, NON cambiare tipo dei campi legacy.
- Devi AGGIUNGERE un nuovo campo "v2" (append-only) con la struttura richiesta sotto.
- Rispondi SOLO con JSON valido. Nessun testo fuori dal JSON.

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
  ],
  "v2": {
    "schema_version": "2.0",
    "contract_type_short": string,
    "risk_index": {
      "score": number,
      "level": "basso" | "medio" | "alto",
      "why_short": string
    },
    "top_risk_clauses": [
      {
        "clause_id": string,
        "title": string,
        "risk_score": number,
        "risk_level": "basso" | "medio" | "alto",
        "why_short": string,
        "excerpt": string
      }
    ],
    "plain_language": string,
    "balance_score": {
      "user": number,
      "counterparty": number,
      "note": string
    },
    "checklist": [
      { "type": "action" | "caution" | "ok", "text": string }
    ],
    "clauses_enriched": [
      {
        "clause_id": string,
        "title": string,
        "excerpt": string,
        "risk_level": "basso" | "medio" | "alto",
        "risk_score": number,
        "traffic_light": "green" | "yellow" | "red",
        "diagnostic": string,
        "highlights": [ string ]
      }
    ]
  }
}

REGOLE IMPORTANTI:
- Il contratto è in italiano.
- Score numerici:
  - v2.risk_index.score: 0-100
  - v2.*.risk_score: 0-100
- v2.balance_score.user + v2.balance_score.counterparty devono sommare a 100.
- clause_id deve essere stabile e semplice: "c1", "c2", "c3"... (uno per ogni elemento di v2.clauses_enriched).
- v2.top_risk_clauses deve contenere ESATTAMENTE 3 elementi (se possibile). Se non possibile, metti meno elementi ma mai null.
- v2.plain_language deve essere massimo 500 caratteri.
- v2.diagnostic deve essere massimo 250 caratteri.
- v2.highlights: massimo 3 frasi brevi.
- Se non hai abbastanza informazioni, compila comunque i campi con stringhe brevi tipo "Informazioni insufficienti nel testo fornito".
- In "v2" non usare mai null per oggetti o array: se mancano dati usa stringhe brevi o array vuoti [].
- Le parole string/number nello schema indicano il tipo, NON devono comparire come valori.
- v2.contract_type_short deve essere uno slug breve in minuscolo (es: "web-agency", "affitto", "lavoro", "nda", "consulenza", "fornitura", "altro").
- v2.contract_type_short deve essere UNO tra: "web-agency" | "affitto" | "lavoro" | "consulenza" | "nda" | "fornitura" | "saas" | "altro".
Ora analizza questo contratto:`;

    const answerRule =
      "RISPOSTA: restituisci SOLO il JSON, senza backtick, senza markdown, senza commenti.";

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
              { type: "input_text", text: `${userPrompt}\n\n${answerRule}` },
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

${contractText}

${answerRule}`;

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

### src/app/api/password/forgot/route.ts

```
// src/app/api/password/forgot/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { sendPasswordResetEmail } from "@/lib/emails";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email non valida" }, { status: 400 });
    }

    const admin = supabaseAdmin();

    // 1. Trova utente per email
    const { data: userList, error: userError } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      email
    } as any); // tipizzazione un po' rognosa, ma funziona

    if (userError) {
      console.error("Errore listUsers:", userError);
      // Risposta generica per non leakare info
      return NextResponse.json(
        {
          message:
            "Se l'indirizzo è corretto, ti abbiamo inviato un'email con le istruzioni per il reset.",
        },
        { status: 200 }
      );
    }

    const user = userList?.users?.[0];
    if (!user) {
      // Risposta comunque 200 (per non dire se l'email esiste o no)
      return NextResponse.json(
        {
          message:
            "Se l'indirizzo è corretto, ti abbiamo inviato un'email con le istruzioni per il reset.",
        },
        { status: 200 }
      );
    }

    // 2. Genera token + hash
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 ora di validità

    // 3. Salva in tabella
    const { error: insertError } = await admin
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Errore insert reset token:", insertError);
      return NextResponse.json(
        { error: "Errore interno" },
        { status: 500 }
      );
    }

    // 4. Costruisci link reset
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const resetLink = `${baseUrl.replace(/\/+$/, "")}/password/reset?token=${token}`;

    // 5. Invia email
    await sendPasswordResetEmail(email, resetLink);

    return NextResponse.json(
      {
        message:
          "Se l'indirizzo è corretto, ti abbiamo inviato un'email con il link per reimpostare la password.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Errore in /api/password/forgot:", err);
    return NextResponse.json(
      { error: "Errore interno" },
      { status: 500 }
    );
  }
}
```

### src/app/api/password/reset/route.ts

```
// src/app/api/password/reset/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || typeof token !== "string" || !password || typeof password !== "string") {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const admin = supabaseAdmin();

    // 1. Recupera token valido
    const { data: rows, error: selectError } = await admin
      .from("password_reset_tokens")
      .select("*")
      .eq("token_hash", tokenHash)
      .is("used_at", null)
      .limit(1);

    if (selectError) {
      console.error("Errore select reset token:", selectError);
      return NextResponse.json({ error: "Link non valido o scaduto" }, { status: 400 });
    }

    const row = rows?.[0];
    if (!row) {
      return NextResponse.json({ error: "Link non valido o scaduto" }, { status: 400 });
    }

    const now = new Date();
    const expiresAt = new Date(row.expires_at);
    if (expiresAt < now) {
      return NextResponse.json({ error: "Link scaduto" }, { status: 400 });
    }

    const userId = row.user_id as string;

    // 2. Aggiorna password via admin
    const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
      password,
    });

    if (updateError) {
      console.error("Errore updateUserById:", updateError);
      return NextResponse.json(
        { error: "Impossibile aggiornare la password" },
        { status: 500 }
      );
    }

    // 3. Marca token come usato
    await admin
      .from("password_reset_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("id", row.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Errore in /api/password/reset:", err);
    return NextResponse.json(
      { error: "Errore interno" },
      { status: 500 }
    );
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

    // Per ora supportiamo SOLO il piano standard
    if (plan !== "standard") {
      return NextResponse.json(
        { error: "Unsupported plan" },
        { status: 400 }
      );
    }

    // Base URL app:
    const envAppUrl = process.env.NEXT_PUBLIC_SITE_URL;
    const requestOrigin = new URL(req.url).origin;

    const appUrl =
      envAppUrl && envAppUrl.startsWith("http") ? envAppUrl : requestOrigin;

    const successUrl = `${appUrl}/pricing/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/pricing`;

    // Usiamo solo il price STANDARD
    const priceId = process.env.STRIPE_PRICE_STANDARD;

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
      metadata: {
        userId,
        plan,
      },
      client_reference_id: userId,
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
