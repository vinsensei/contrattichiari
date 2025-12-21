"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

import AnalysisHeader from "@/components/analysis/AnalysisHeader";
import AnchorNav from "@/components/analysis/AnchorNav";

import SectionUpgradeCta from "@/components/analysis/SectionUpgradeCta";

import SectionAnalysisHero from "@/components/analysis/SectionAnalysisHero";
import SectionSummary from "@/components/analysis/SectionSummary";
import SectionPreviewCriticalClauses from "@/components/analysis/SectionPreviewCriticalClauses";
import SectionPreviewUnfairClauses from "@/components/analysis/SectionPreviewUnfairClauses";
import SectionCriticalClausesFull from "@/components/analysis/SectionCriticalClausesFull";
import SectionUnfairClausesFull from "@/components/analysis/SectionUnfairClausesFull";
import SectionRebalancedVersion from "@/components/analysis/SectionRebalancedVersion";
import SectionGlossary from "@/components/analysis/SectionGlossary";
import SectionFinalAlerts from "@/components/analysis/SectionFinalAlerts";

/* componenti pro temporaneamente in standard */
import SectionsV2Blocks from "@/components/analysis/SectionsV2Blocks";

type ClausolaCritica = {
  titolo: string;
  estratto_originale: string;
  perche_critica: string;
  rischio_specifico: "basso" | "medio" | "alto" | string;
  suggerimento_modifica: string;
};

type ClausolaVessatoria = {
  clausola: string;
  estratto_originale: string;
  perche_vessatoria: string;
  riferimento_normativo: string;
};

type GlossarioItem = {
  termine: string;
  spiegazione: string;
};

type AnalysisJson = {
  tipo_contratto?: string;
  valutazione_rischio?: "basso" | "medio" | "alto" | string;
  motivazione_rischio?: string;
  clausole_critiche?: ClausolaCritica[];
  clausole_vessatorie_potenziali?: ClausolaVessatoria[];
  riassunto_semplice?: string;
  punti_a_favore_dell_utente?: string[];
  punti_a_sfavore_dell_utente?: string[];
  versione_riequilibrata?: string;
  glossario?: GlossarioItem[];
  alert_finali?: string[];
  v2?: {
    schema_version?: string;
    contract_type_short?:
      | "web-agency"
      | "affitto"
      | "lavoro"
      | "consulenza"
      | "nda"
      | "fornitura"
      | "saas"
      | "altro"
      | string;
    risk_index?: {
      score?: number;
      level?: "basso" | "medio" | "alto" | string;
      why_short?: string;
    };
    top_risk_clauses?: Array<{
      clause_id: string;
      title: string;
      risk_score: number;
      risk_level?: "basso" | "medio" | "alto" | string;
      why_short?: string;
      excerpt?: string;
    }>;
    plain_language?: string;
    balance_score?: {
      user?: number;
      counterparty?: number;
      note?: string;
    };
    checklist?: Array<{
      type: "action" | "caution" | "ok" | string;
      text: string;
    }>;
    clauses_enriched?: Array<{
      clause_id: string;
      title: string;
      excerpt: string;
      risk_level?: "basso" | "medio" | "alto" | string;
      risk_score: number;
      traffic_light?: "green" | "yellow" | "red" | string;
      diagnostic?: string;
      highlights?: string[];
    }>;
  };
};

type AnalysisRow = {
  id: string;
  created_at: string;
  from_slug: string | null;
  analysis_json: AnalysisJson | null;
  source: string | null;
  is_full_unlocked: boolean | null;
  user_id: string | null;
};

export default function AnalysisDetailPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  type PlanTier = "free" | "standard" | "pro";

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisRow | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [planTier, setPlanTier] = useState<PlanTier>("free");

  const [anchorOffsetPx, setAnchorOffsetPx] = useState(0);
  const anchorNavRef = useRef<HTMLElement | null>(null);

  const pageStyle = useMemo(() => {
    return {
      // Used by sticky SectionHeaders + scroll anchoring
      ["--anchor-offset" as any]: `${anchorOffsetPx}px`,
    } as React.CSSProperties;
  }, [anchorOffsetPx]);
  useLayoutEffect(() => {
    if (loading) return;

    const compute = () => {
      const navEl = anchorNavRef.current;
      if (!navEl) return;
      const navH = navEl.offsetHeight;
      setAnchorOffsetPx(navH);
    };

    // Measure once immediately and once on next frame (fonts/layout can settle)
    compute();
    const raf = window.requestAnimationFrame(() => compute());

    const navEl = anchorNavRef.current;

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && navEl) {
      ro = new ResizeObserver(() => compute());
      ro.observe(navEl);
    }

    window.addEventListener("resize", compute);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", compute);
      if (ro) ro.disconnect();
    };
  }, [loading]);

  useEffect(() => {
    const load = async () => {
      try {
        // 1) check utente loggato
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Errore nel recupero utente:", userError);
          router.replace("/login");
          return;
        }

        if (!user) {
          router.replace("/login");
          return;
        }

        // 2) recupero abbonamento utente (tier: free | standard | pro)
        let tier: PlanTier = "free";

        try {
          const { data: sub, error: subError } = await supabase
            .from("user_subscriptions")
            .select("plan, is_active, current_period_end")
            .eq("user_id", user.id)
            .maybeSingle();

          if (subError) {
            console.error("Errore nel recupero abbonamento:", subError);
          } else if (sub) {
            const cpeMs = sub.current_period_end
              ? new Date(sub.current_period_end).getTime()
              : null;

            const isActive =
              Boolean(sub.is_active) || Boolean(cpeMs && cpeMs > Date.now());

            if (isActive && sub.plan) {
              if (sub.plan === "pro") tier = "pro";
              else if (sub.plan === "standard") tier = "standard";
              else tier = "free";
            }
          }
        } catch (subErr) {
          console.error("Errore imprevisto nel recupero abbonamento:", subErr);
        }

        setPlanTier(tier);

        // 3) fetch analisi
        const { data, error } = await supabase
          .from("contract_analyses")
          .select(
            "id, created_at, from_slug, analysis_json, source, is_full_unlocked, user_id"
          )
          .eq("id", id)
          .maybeSingle();

        if (error) {
          console.error("Errore nel caricamento analisi:", error);
          setErrorMsg("Errore nel caricamento dell’analisi.");
          return;
        }

        if (!data) {
          setErrorMsg("Analisi non trovata.");
          return;
        }

        // Se l'analisi proviene da landing anonima e non è ancora assegnata a nessun utente,
        // la leghiamo all'utente corrente (così compare in dashboard).
        if (!data.user_id && data.source === "anonymous_landing") {
          const { error: linkError } = await supabase
            .from("contract_analyses")
            .update({ user_id: user.id })
            .eq("id", id);

          if (linkError) {
            console.error(
              "Errore nel collegare l’analisi all’utente:",
              linkError
            );
          } else {
            (data as any).user_id = user.id;
          }
        }

        // Se l'utente ha un abbonamento pagato e l'analisi arriva da landing anonima,
        // sblocchiamo l'analisi completa impostando is_full_unlocked = true.
        if (
          tier !== "free" &&
          data.source === "anonymous_landing" &&
          data.is_full_unlocked !== true
        ) {
          const { error: unlockError } = await supabase
            .from("contract_analyses")
            .update({ is_full_unlocked: true })
            .eq("id", id);

          if (unlockError) {
            console.error(
              "Errore nello sbloccare l’analisi completa:",
              unlockError
            );
          } else {
            (data as any).is_full_unlocked = true;
          }
        }

        setAnalysis(data as AnalysisRow);
      } catch (e) {
        console.error("Errore imprevisto nel caricamento analisi:", e);
        setErrorMsg("Errore nel caricamento dell’analisi.");
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id, supabase, router]);

  const riskBadge = (risk: string | null | undefined) => {
    if (!risk) return null;
    const base =
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
    if (risk === "alto")
      return (
        <span className={`${base} bg-red-100 text-red-700`}>Rischio alto</span>
      );
    if (risk === "medio")
      return (
        <span className={`${base} bg-amber-100 text-amber-700`}>
          Rischio medio
        </span>
      );
    return (
      <span className={`${base} bg-emerald-100 text-emerald-700`}>
        Rischio basso
      </span>
    );
  };

  const scrollToAnchor = (anchorId: string) => {
    const el = document.getElementById(anchorId);
    if (!el) return;

    const top =
      el.getBoundingClientRect().top + window.scrollY - (anchorOffsetPx || 0);
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">
          <img
            src="/loader.svg"
            alt="Caricamento in corso..."
            className="h-12 w-12 animate-bounce mx-auto mb-2"
          />
        </p>
      </div>
    );
  }

  if (errorMsg || !analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <p className="text-sm text-red-600 mb-4">{errorMsg || "Errore."}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
        >
          Torna alla dashboard
        </button>
      </div>
    );
  }

  const a = (analysis.analysis_json as AnalysisJson) || {};
  const v2 = a.v2;
  const trafficEmoji = (t?: string | null) => {
    if (t === "red") return "🔴";
    if (t === "yellow") return "🟡";
    if (t === "green") return "🟢";
    return "🟡";
  };

  const findEnrichedClause = (legacy: ClausolaCritica) => {
    const list = v2?.clauses_enriched || [];
    if (!list.length) return null;

    const lex = (legacy.estratto_originale || "").trim();
    const lt = (legacy.titolo || "").trim().toLowerCase();

    // 1) match per excerpt (più affidabile)
    if (lex) {
      const hit = list.find(
        (x) => (x.excerpt || "").includes(lex) || lex.includes(x.excerpt || "")
      );
      if (hit) return hit;
    }

    // 2) fallback per titolo
    if (lt) {
      const hit = list.find((x) => (x.title || "").trim().toLowerCase() === lt);
      if (hit) return hit;
    }

    return null;
  };
  const createdAt = new Date(analysis.created_at).toLocaleString("it-IT");

  const summary =
    a.riassunto_semplice ||
    // supporta il campo usato dalle analisi da landing
    (a as any).summary ||
    null;

  const hasRawJsonPreview =
    !summary &&
    analysis.analysis_json &&
    Object.keys(analysis.analysis_json as any).length > 0;

  const isLanding = analysis.source === "anonymous_landing";
  const isFullUnlocked = analysis.is_full_unlocked ?? false;

  // Standard+Pro vedono il “full legacy” (clausole complete, riequilibrata, glossario, alert…)
  const hasPaidAccess = planTier !== "free";

  // showFull = analisi completa (legacy full) se:
  // - utente standard/pro
  // - oppure non è landing anonima
  // - oppure è stata sbloccata (unlock flag)
  const showFull = hasPaidAccess || !isLanding || isFullUnlocked;

  // Pro-only
  const isPro = planTier === "pro";

  const hasClausoleCritiche =
    Array.isArray(a.clausole_critiche) && a.clausole_critiche.length > 0;

  const hasClausoleVessatorie =
    Array.isArray(a.clausole_vessatorie_potenziali) &&
    a.clausole_vessatorie_potenziali.length > 0;

  const hasVersioneRiequilibrata =
    typeof a.versione_riequilibrata === "string" &&
    a.versione_riequilibrata.trim().length > 0;

  const hasGlossario = Array.isArray(a.glossario) && a.glossario.length > 0;

  const hasAlertFinali =
    Array.isArray(a.alert_finali) && a.alert_finali.length > 0;

  return (
    <div style={pageStyle} className="min-h-screen flex flex-col bg-white">
      {/* Header */}

      <AnalysisHeader
        onBack={() => router.push("/dashboard")}
        riskBadge={riskBadge(a.valutazione_rischio)}
        isPro={isPro}
        onDownloadPdf={
          isPro
            ? async () => {
                try {
                  const { data: sessionData } =
                    await supabase.auth.getSession();
                  const token = sessionData.session?.access_token;
                  if (!token) return alert("Devi essere autenticato.");

                  const res = await fetch(`/api/analysis/${id}/pdf`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });

                  if (!res.ok) return alert("Errore nella generazione del PDF");

                  const blob = await res.blob();
                  const url = window.URL.createObjectURL(blob);

                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `analisi-${id}.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  link.remove();
                  window.URL.revokeObjectURL(url);
                } catch (err) {
                  console.error(err);
                  alert("Errore imprevisto");
                }
              }
            : undefined
        }
      />
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12 space-y-10 md:space-y-12">
        {/* 
          HERO DELL’ANALISI
          Mostra il tipo di contratto, il titolo principale, la motivazione del rischio
          e la data di creazione dell’analisi.
          È sempre visibile (free / standard / pro).
        */}
        <SectionAnalysisHero
          contractType={v2?.contract_type_short}
          title={a.tipo_contratto || analysis.from_slug || "Contratto"}
          motivation={a.motivazione_rischio}
          createdAt={createdAt}
        />

        {/* 
          NAVIGAZIONE AD ANCORE (STICKY)
          Barra orizzontale che permette di saltare alle varie sezioni dell’analisi.
          Le voci sono mostrate dinamicamente in base ai contenuti disponibili.
        */}
        <AnchorNav
          navRef={anchorNavRef}
          summary={summary}
          showFull={showFull}
          hasClausoleCritiche={hasClausoleCritiche}
          hasClausoleVessatorie={hasClausoleVessatorie}
          hasVersioneRiequilibrata={hasVersioneRiequilibrata}
          hasGlossario={hasGlossario}
          hasAlertFinali={hasAlertFinali}
          hasRiskIndex={Boolean(v2?.risk_index)}
          hasTopRiskClauses={Boolean(v2?.top_risk_clauses?.length)}
          hasBalanceScore={Boolean(v2?.balance_score)}
          hasChecklist={Boolean(v2?.checklist?.length)}
          hasClausesEnriched={Boolean(v2?.clauses_enriched?.length)}
          onGo={scrollToAnchor}
          isPro={isPro}
        />

        {/* 
          RIASSUNTO SEMPLICE
          Spiegazione testuale ad alto livello del contratto,
          pensata per utenti non esperti.
        */}
        <SectionSummary summary={summary} />

        {/* 
          ANTEPRIMA CLAUSOLE CRITICHE (VERSIONE PARZIALE)
          Mostrata solo se l’analisi NON è sbloccata.
          Serve a far capire il valore dell’analisi completa.
        */}
        <SectionPreviewCriticalClauses
          clauses={a.clausole_critiche}
          show={!showFull}
        />

        {/* 
          ANTEPRIMA CLAUSOLE POTENZIALMENTE VESSATORIE (VERSIONE PARZIALE)
          Mostrata solo agli utenti non sbloccati.
        */}
        <SectionPreviewUnfairClauses
          clauses={a.clausole_vessatorie_potenziali}
          show={!showFull}
        />

        {/* 
          CLAUSOLE CRITICHE – VERSIONE COMPLETA
          Mostrate solo quando l’analisi è sbloccata.
          Include arricchimenti, badge di rischio e punteggi.
        */}
        <SectionCriticalClausesFull
          show={showFull}
          clauses={a.clausole_critiche}
          findEnrichedClause={findEnrichedClause}
          riskBadge={riskBadge}
          trafficEmoji={trafficEmoji}
        />

        {/* 
          CLAUSOLE POTENZIALMENTE VESSATORIE – VERSIONE COMPLETA
          Include spiegazioni e riferimenti normativi.
        */}
        <SectionUnfairClausesFull
          show={showFull}
          items={a.clausole_vessatorie_potenziali}
        />

        {/* 
          FALLBACK TECNICO
          Se non esiste un riassunto strutturato,
          mostriamo il JSON grezzo dell’analisi.
          Utile per debug e per analisi legacy.
        */}
        {!summary && hasRawJsonPreview && (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8">
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              📄 Anteprima analisi (formato tecnico)
            </h2>
            <p className="text-sm text-slate-600 mb-2">
              Stiamo ancora perfezionando il layout di questa sezione. Nel
              frattempo puoi vedere il contenuto completo dell’analisi in
              formato tecnico.
            </p>
            <pre className="text-[11px] bg-slate-900/95 text-slate-50 rounded-lg p-3 overflow-x-auto">
              {JSON.stringify(analysis.analysis_json, null, 2)}
            </pre>
          </section>
        )}

        {/* 
          CALL TO ACTION DI UPGRADE
          Invito all’abbonamento quando l’utente
          sta visualizzando una versione ridotta dell’analisi.
        */}
        <SectionUpgradeCta
          show={!showFull}
          onUpgrade={() => router.push("/pricing")}
        />

        {/* 
          BLOCCO ANALISI V2 (STANDARD / PRO)
          Contiene i moduli strutturati di nuova generazione:
          - indice di rischio
          - linguaggio semplificato
          - clausole a rischio
          - bilanciamento parti
          - checklist
          - elenco clausole arricchite
          Il gating verrà gestito in seguito.
        */}
        <SectionsV2Blocks v2={v2} showPro={isPro} />

        {/* 
          VERSIONE RIEQUILIBRATA DEL CONTRATTO
          Proposta di riscrittura più equa delle clausole.
        */}
        <SectionRebalancedVersion
          show={showFull}
          text={a.versione_riequilibrata}
        />

        {/* 
          GLOSSARIO DEI TERMINI LEGALI
          Spiegazioni semplici dei termini complessi.
        */}
        <SectionGlossary show={showFull} items={a.glossario} />

        {/* 
          ALERT FINALI
          Avvisi importanti da considerare prima della firma.
        */}
        <SectionFinalAlerts show={showFull} items={a.alert_finali} />

        {/* 
          CALL TO ACTION DI UPGRADE
          Invito all’abbonamento quando l’utente
          sta visualizzando una versione ridotta dell’analisi.
        */}
        <SectionUpgradeCta
          show={!showFull}
          onUpgrade={() => router.push("/pricing")}
        />
      </main>
    </div>
  );
}
