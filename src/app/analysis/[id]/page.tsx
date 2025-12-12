"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import SectionHeader from "@/components/SectionHeader";

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

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisRow | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasPaidSubscription, setHasPaidSubscription] = useState(false);

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

        // 2) recupero abbonamento utente
        let paid = false;
        try {
          const { data: subscription, error: subError } = await supabase
            .from("user_subscriptions")
            .select("plan, is_active")
            .eq("user_id", user.id)
            .maybeSingle();

          if (subError) {
            console.error("Errore nel recupero abbonamento:", subError);
          } else if (
            subscription &&
            subscription.is_active &&
            subscription.plan &&
            subscription.plan !== "free"
          ) {
            paid = true;
          }
        } catch (subErr) {
          console.error("Errore imprevisto nel recupero abbonamento:", subErr);
        }

        setHasPaidSubscription(paid);

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
          paid &&
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
        <span className={`${base} bg-red-100 text-red-700`}>
          Rischio alto
        </span>
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

    const top = el.getBoundingClientRect().top + window.scrollY - (anchorOffsetPx || 0);
    window.scrollTo({ top, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Caricamento…</p>
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
  const showFull = hasPaidSubscription || !isLanding || isFullUnlocked;

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
      <header
        data-fixed-header="true"
        className="w-full border-b border-slate-200 bg-white/95 backdrop-blur"
      >
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <span aria-hidden="true">←</span>
              <span>Torna alla dashboard</span>
            </button>
            
          </div>
          <div className="flex items-center gap-3">
            {riskBadge(a.valutazione_rischio)}
            <button
              onClick={async () => {
                try {
                  const { data: sessionData } = await supabase.auth.getSession();
                  const token = sessionData.session?.access_token;
                  if (!token) return alert("Devi essere autenticato.");

                  const res = await fetch(`/api/analysis/${id}/pdf`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  });

                  if (!res.ok) {
                    return alert("Errore nella generazione del PDF");
                  }

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
              }}
              className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs sm:text-sm font-medium text-white hover:bg-slate-800 transition"
            >
              Scarica PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-12 space-y-10 md:space-y-12">
        {/* Titolo + rischio */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-slate-500">
                Risultato analisi contratto 
              </p>
              <h1 className="text-3xl md:text-5xl text-slate-900 mb-4">
                {a.tipo_contratto || analysis.from_slug || "Contratto"}
              </h1>
            </div>
          </div>
          {a.motivazione_rischio && (
            <p className="text-sm md:text-base text-slate-800 leading-relaxed">
              {a.motivazione_rischio}
            </p>
          )}
          <span className="hidden text-xs md:text-sm text-slate-500 sm:inline">
              Analisi creata il {createdAt}
          </span>
        </section>

      {/* Navigazione ad ancore (sticky) */}
      <nav
        ref={anchorNavRef}
        data-anchor-nav="true"
        className="sticky top-0 z-30 -mx-4 sm:-mx-6 bg-white/95 backdrop-blur border-b border-slate-200"
      >
        <div className="mx-auto flex w-full max-w-5xl gap-2 overflow-x-auto px-4 py-3 text-xs sm:text-sm">
          {summary && (
            <button
              type="button"
              onClick={() => scrollToAnchor("riassunto-semplice")}
              className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-400 whitespace-nowrap"
            >
              Riassunto semplice
            </button>
          )}
          {hasClausoleCritiche && (
            <button
              type="button"
              onClick={() => scrollToAnchor("clausole-problematiche")}
              className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-400 whitespace-nowrap"
            >
              Clausole problematiche
            </button>
          )}
          {hasClausoleVessatorie && (
            <button
              type="button"
              onClick={() => scrollToAnchor("clausole-vessatorie")}
              className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-400 whitespace-nowrap"
            >
              Clausole potenzialmente vessatorie
            </button>
          )}
          {hasVersioneRiequilibrata && (
            <button
              type="button"
              onClick={() => scrollToAnchor("versione-riequilibrata")}
              className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-400 whitespace-nowrap"
            >
              Versione riequilibrata
            </button>
          )}
          {hasGlossario && (
            <button
              type="button"
              onClick={() => scrollToAnchor("glossario")}
              className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-400 whitespace-nowrap"
            >
              Glossario
            </button>
          )}
          {hasAlertFinali && (
            <button
              type="button"
              onClick={() => scrollToAnchor("alert-finali")}
              className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-400 whitespace-nowrap"
            >
              Alert finali
            </button>
          )}
        </div>
      </nav>

        {/* Riassunto semplice / preview */}
        {summary && (
          <section
            id="riassunto-semplice"
            className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
          >
            <div
              style={{ top: anchorOffsetPx }}
              className="sticky z-10 bg-white/95 backdrop-blur border-b border-slate-200 pt-3"
            >
              <SectionHeader
                title="Riassunto semplice"
                subtitle="Il contratto spiegato in poche frasi, senza linguaggio legale"
                icon="uploadok.svg"
              />
            </div>
            <p className="text-[15px] text-slate-800 leading-relaxed">
              {summary}
            </p>
          </section>
        )}

        {/* Anteprima clausole critiche (solo versione parziale) */}
        {!showFull && a.clausole_critiche && a.clausole_critiche.length > 0 && (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">
              Alcune clausole da tenere d’occhio
            </h2>
            <p className="text-xs text-slate-600">
              Questa è una selezione ridotta delle clausole che potrebbero
              richiedere attenzione. Con l’analisi completa vedrai il dettaglio
              completo e tutti i suggerimenti di modifica.
            </p>
            <div className="space-y-4">
              {a.clausole_critiche.slice(0, 2).map((c, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl bg-white px-5 py-4 space-y-2 shadow-xs"
                >
                  <h3 className="text-sm font-semibold text-slate-900">
                    {c.titolo || `Clausola ${idx + 1}`}
                  </h3>
                  {c.estratto_originale && (
                    <p className="text-xs text-slate-700 line-clamp-3">
                      {c.estratto_originale}
                    </p>
                  )}
                  {c.perche_critica && (
                    <p className="text-xs text-slate-600">
                      <span className="font-semibold">
                        Perché è rilevante:{" "}
                      </span>
                      {c.perche_critica}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Anteprima clausole potenzialmente vessatorie (solo versione parziale) */}
        {!showFull &&
          a.clausole_vessatorie_potenziali &&
          a.clausole_vessatorie_potenziali.length > 0 && (
            <section
              id="clausole-vessatorie"
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-4"
            >
              <h2 className="text-base font-semibold text-slate-900">
                ⚠️ Possibili clausole vessatorie
              </h2>
              <p className="text-xs text-slate-600">
                Qui vedi solo un assaggio delle clausole potenzialmente
                vessatorie. L’analisi completa ti mostra il quadro completo, con
                riferimenti normativi e suggerimenti pratici.
              </p>
              <ul className="space-y-2">
                {a.clausole_vessatorie_potenziali.slice(0, 1).map((c, idx) => (
                  <li key={idx} className="text-sm text-slate-700">
                    <span className="font-semibold">
                      {c.clausola || `Clausola ${idx + 1}`}:
                    </span>{" "}
                    {c.perche_vessatoria}
                  </li>
                ))}
              </ul>
            </section>
          )}

        {/* Fallback: mostra JSON grezzo se non c'è un riassunto strutturato */}
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

        {!showFull && (
          <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">
              Vuoi l’analisi completa?
            </h2>
            <p className="text-base text-slate-700">
              Al momento stai visualizzando una versione ridotta dell’analisi,
              generata a partire dal caricamento rapido del contratto. Con
              l’abbonamento ContrattiChiari puoi sbloccare:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1.5">
              <li>clausole critiche spiegate nel dettaglio</li>
              <li>clausole potenzialmente vessatorie evidenziate</li>
              <li>una versione riequilibrata del contratto</li>
              <li>alert finali e glossario dei termini complessi</li>
            </ul>
            <button
              onClick={() => router.push("/pricing")}
              className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
            >
              Vedi piani e sblocca l’analisi completa
            </button>
          </section>
        )}

        {showFull && a.clausole_critiche && a.clausole_critiche.length > 0 && (
          <section
            id="clausole-problematiche"
            className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
          >
            <div
              style={{ top: anchorOffsetPx }}
              className="sticky z-10 bg-white/95 backdrop-blur border-b border-slate-200 pt-3"
            >
              <SectionHeader
                title="Clausole problematiche"
                subtitle="Punti del contratto che possono creare rischi o ambiguità"
                icon="uploadok.svg"
              />
            </div>
            <div className="space-y-10">
              {a.clausole_critiche.map((c, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-2xl bg-white px-5 py-4 space-y-3 shadow-xs"
                >
                  <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {c.titolo || `Clausola ${idx + 1}`}
                    </h3>
                    {c.rischio_specifico && riskBadge(c.rischio_specifico)}
                  </div>

                  {c.estratto_originale && (
                    <div className="text-xs">
                      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500 mb-1">
                        Estratto originale
                      </div>
                      <div className="bg-white border border-slate-300 rounded-lg p-3 font-mono text-sm text-slate-800">
                        {c.estratto_originale}
                      </div>
                    </div>
                  )}

                  {c.perche_critica && (
                    <p className="text-sm text-slate-700 mt-4 mb-5">
                      <span className="font-semibold">Perché è critica: </span>
                      {c.perche_critica}
                    </p>
                  )}

                  {c.suggerimento_modifica && (
                    <div className="text-xs">
                      <div className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-slate-600 mb-1">
                        <span>Suggerimento di modifica</span>
                      </div>
                      <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-800">
                        {c.suggerimento_modifica}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {showFull &&
          a.clausole_vessatorie_potenziali &&
          a.clausole_vessatorie_potenziali.length > 0 && (
            <section
              id="clausole-vessatorie"
              className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
            >
              <div
                style={{ top: anchorOffsetPx }}
                className="sticky z-10 bg-white/95 backdrop-blur border-b border-slate-200 pt-3"
              >
                <SectionHeader
                  title="Clausole potenzialmente vessatorie"
                  subtitle="Clausole che potrebbero essere sfavorevoli o contestabili"
                  icon="uploadok.svg"
                />
              </div>
              <div className="space-y-10">
                {a.clausole_vessatorie_potenziali.map((c, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-2xl bg-white px-5 py-4 space-y-3 shadow-xs"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">
                      {c.clausola || `Clausola ${idx + 1}`}
                    </h3>
                    {c.estratto_originale && (
                      <div className="text-sm bg-white border border-slate-300 rounded-lg p-3 font-mono text-sm text-slate-800">
                        {c.estratto_originale}
                      </div>
                    )}
                    {c.perche_vessatoria && (
                      <p className="text-sm text-slate-800">
                        <span className="font-semibold">
                          Perché è vessatoria:{" "}
                        </span>
                        {c.perche_vessatoria}
                      </p>
                    )}
                    {c.riferimento_normativo && (
                      <p className="text-xs text-slate-600 italic inline-flex items-center gap-1.5">
                        <span
                          aria-hidden="true"
                          className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 bg-white text-[10px] font-semibold leading-none text-slate-600"
                        >
                          i
                        </span>
                        <span>
                          Riferimento: {c.riferimento_normativo}
                        </span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        {showFull &&
          a.versione_riequilibrata &&
          a.versione_riequilibrata.trim().length > 0 && (
            <section
              id="versione-riequilibrata"
              className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
            >
              <div
                style={{ top: anchorOffsetPx }}
                className="sticky z-10 bg-white/95 backdrop-blur border-b border-slate-200 pt-3"
              >
                <SectionHeader
                  title="Versione riequilibrata"
                  subtitle="Proposta di riscrittura più equa e bilanciata"
                  icon="uploadok.svg"
                />
              </div>
              <p className="text-base text-slate-700 whitespace-pre-line leading-relaxed">
                {a.versione_riequilibrata}
              </p>
            </section>
          )}

        {showFull && a.glossario && a.glossario.length > 0 && (
          <section
            id="glossario"
            className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
          >
            <div
              style={{ top: anchorOffsetPx }}
              className="sticky z-10 bg-white/95 backdrop-blur border-b border-slate-200 pt-3"
            >
              <SectionHeader
                title="Glossario"
                subtitle="Significato semplice dei termini legali usati nel contratto"
                icon="uploadok.svg"
              />
            </div>
            <ul className="space-y-4">
              {a.glossario.map((g, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xs"
                >
                  {/* Icona tonda 30x30 con SVG (placeholder) */}
                  <div className="h-[30px] w-[30px] shrink-0 rounded-full border border-slate-300 bg-white flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="opacity-80"
                    >
                      <path
                        d="M12 17h.01M11 10a2 2 0 1 1 3 1.732c-.9.52-1.5 1.08-1.5 2.268v.5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Testi */}
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                      {g.termine}
                    </div>
                    <div className="mt-1 text-sm text-slate-700 leading-relaxed">
                      {g.spiegazione}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {showFull && a.alert_finali && a.alert_finali.length > 0 && (
          <section
            id="alert-finali"
            className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
          >
            <div
              style={{ top: anchorOffsetPx }}
              className="sticky z-10 bg-white/95 backdrop-blur border-b border-slate-200 pt-3"
            >
              <SectionHeader
                title="Alert finali"
                subtitle="Cose importanti da sapere prima di firmare"
                icon="uploadok.svg"
              />
            </div>
            <ul className="space-y-4">
              {a.alert_finali.map((al, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xs"
                >
                  {/* Icona tonda 30x30 con SVG (placeholder) */}
                  <div className="h-[30px] w-[30px] shrink-0 rounded-full border border-slate-300 bg-white flex items-center justify-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                      className="opacity-80"
                    >
                      <path
                        d="M12 9v4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 17h.01"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  {/* Testo */}
                  <div className="min-w-0">
                    <div className="text-sm sm:text-base text-slate-800 leading-relaxed">
                      {al}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}
