'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseClient';
import type { Metadata } from "next";

type ClausolaCritica = {
  titolo: string;
  estratto_originale: string;
  perche_critica: string;
  rischio_specifico: 'basso' | 'medio' | 'alto' | string;
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
  valutazione_rischio?: 'basso' | 'medio' | 'alto' | string;
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



export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
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

  useEffect(() => {
    const load = async () => {
      try {
        // 1) check utente loggato
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error('Errore nel recupero utente:', userError);
          router.replace('/login');
          return;
        }

        if (!user) {
          router.replace('/login');
          return;
        }

        // 2) recupero abbonamento utente
        let paid = false;
        try {
          const { data: subscription, error: subError } = await supabase
            .from('user_subscriptions')
            .select('plan, is_active')
            .eq('user_id', user.id)
            .maybeSingle();

          if (subError) {
            console.error('Errore nel recupero abbonamento:', subError);
          } else if (
            subscription &&
            subscription.is_active &&
            subscription.plan &&
            subscription.plan !== 'free'
          ) {
            paid = true;
          }
        } catch (subErr) {
          console.error('Errore imprevisto nel recupero abbonamento:', subErr);
        }

        setHasPaidSubscription(paid);

        // 3) fetch analisi
        const { data, error } = await supabase
          .from('contract_analyses')
          .select('id, created_at, from_slug, analysis_json, source, is_full_unlocked, user_id')
          .eq('id', id)
          .maybeSingle();

        if (error) {
          console.error('Errore nel caricamento analisi:', error);
          setErrorMsg('Errore nel caricamento dell’analisi.');
          return;
        }

        if (!data) {
          setErrorMsg('Analisi non trovata.');
          return;
        }

        // Se l'analisi proviene da landing anonima e non è ancora assegnata a nessun utente,
        // la leghiamo all'utente corrente (così compare in dashboard).
        if (!data.user_id && data.source === 'anonymous_landing') {
          const { error: linkError } = await supabase
            .from('contract_analyses')
            .update({ user_id: user.id })
            .eq('id', id);

          if (linkError) {
            console.error(
              'Errore nel collegare l’analisi all’utente:',
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
          data.source === 'anonymous_landing' &&
          data.is_full_unlocked !== true
        ) {
          const { error: unlockError } = await supabase
            .from('contract_analyses')
            .update({ is_full_unlocked: true })
            .eq('id', id);

          if (unlockError) {
            console.error(
              'Errore nello sbloccare l’analisi completa:',
              unlockError
            );
          } else {
            (data as any).is_full_unlocked = true;
          }
        }

        setAnalysis(data as AnalysisRow);
      } catch (e) {
        console.error('Errore imprevisto nel caricamento analisi:', e);
        setErrorMsg('Errore nel caricamento dell’analisi.');
      } finally {
        setLoading(false);
      }
    };

    if (id) load();
  }, [id, supabase, router]);

  const riskBadge = (risk: string | null | undefined) => {
    if (!risk) return null;
     const base =
      'inline-flex items-center px-3 py-1 rounded-full text-[11px] font-medium';
    if (risk === 'alto')
      return (
        <span className={`${base} bg-red-100 text-red-700`}>Rischio alto</span>
      );
    if (risk === 'medio')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50/40 to-indigo-50/40">
        <p className="text-base text-slate-500">Caricamento analisi…</p>
      </div>
    );
  }

  if (errorMsg || !analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <p className="text-sm text-red-600 mb-4">{errorMsg || 'Errore.'}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
        >
          Torna alla dashboard
        </button>
      </div>
    );
  }

  const a = (analysis.analysis_json as AnalysisJson) || {};
  const createdAt = new Date(analysis.created_at).toLocaleString('it-IT');

  const summary =
    a.riassunto_semplice ||
    // supporta il campo usato dalle analisi da landing
    (a as any).summary ||
    null;

  const hasRawJsonPreview =
    !summary && analysis.analysis_json && Object.keys(analysis.analysis_json as any).length > 0;

  const isLanding = analysis.source === 'anonymous_landing';
  const isFullUnlocked = analysis.is_full_unlocked ?? false;
  const showFull = hasPaidSubscription || !isLanding || isFullUnlocked;

  const hasClausoleCritiche =
    Array.isArray(a.clausole_critiche) && a.clausole_critiche.length > 0;

  const hasClausoleVessatorie =
    Array.isArray(a.clausole_vessatorie_potenziali) &&
    a.clausole_vessatorie_potenziali.length > 0;

  const hasVersioneRiequilibrata =
    typeof a.versione_riequilibrata === 'string' &&
    a.versione_riequilibrata.trim().length > 0;

  const hasGlossario = Array.isArray(a.glossario) && a.glossario.length > 0;

  const hasAlertFinali =
    Array.isArray(a.alert_finali) && a.alert_finali.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="w-full border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
            >
              <span aria-hidden="true">←</span>
              <span>Torna alla dashboard</span>
            </button>
            <span className="hidden text-[11px] text-slate-400 sm:inline">
              Analisi creata il {createdAt}
            </span>
          </div>
          <a href="/" className="inline-flex items-center">
            <img
              src="/logo.png"
              alt="ContrattoChiaro"
              className="h-8 w-auto"
            />
          </a>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 sm:py-10 space-y-8">
        {/* Titolo + rischio */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                Risultato analisi contratto
              </p>
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
  className="mt-2 inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-900 text-white text-sm hover:bg-slate-800"
>
  Scarica PDF
</button>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">
                {a.tipo_contratto || analysis.from_slug || 'Contratto'}
              </h1>
              <p className="text-xs text-slate-500">
                ID analisi:{' '}
                <span className="font-mono text-[11px] bg-slate-100 px-1.5 py-0.5 rounded">
                  {analysis.id}
                </span>
              </p>
            </div>
            <div className="flex items-start justify-end">
              {riskBadge(a.valutazione_rischio)}
            </div>
          </div>

          {a.motivazione_rischio && (
            <p className="text-[13px] md:text-sm text-slate-600 leading-relaxed">
              {a.motivazione_rischio}
            </p>
          )}
        </section>

        {/* Navigazione ad ancore (sticky) */}
        <nav className="sticky top-0 z-10 -mx-4 sm:-mx-6 bg-slate-50/95 backdrop-blur border-b border-slate-200">
          <div className="mx-auto flex w-full max-w-5xl gap-2 overflow-x-auto px-4 py-3 text-[11px] sm:text-xs">
            {summary && (
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('riassunto-semplice')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-400 whitespace-nowrap"
              >
                Riassunto semplice
              </button>
            )}
            {hasClausoleCritiche && (
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('clausole-problematiche')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-400 whitespace-nowrap"
              >
                Clausole problematiche
              </button>
            )}
            {hasClausoleVessatorie && (
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('clausole-vessatorie')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-400 whitespace-nowrap"
              >
                Clausole potenzialmente vessatorie
              </button>
            )}
            {hasVersioneRiequilibrata && (
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('versione-riequilibrata')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-400 whitespace-nowrap"
              >
                Versione riequilibrata
              </button>
            )}
            {hasGlossario && (
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('glossario')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-400 whitespace-nowrap"
              >
                Glossario
              </button>
            )}
            {hasAlertFinali && (
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById('alert-finali')
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="inline-flex h-8 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:border-slate-400 whitespace-nowrap"
              >
                Alert finali
              </button>
            )}
          </div>
        </nav>

        {/* Riassunto semplice / preview */}
        {summary && (
          <section id="riassunto-semplice" className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <span>Riassunto semplice</span>
            </h2>
            <p className="text-[15px] text-slate-800 leading-relaxed">
              {summary}
            </p>
          </section>
        )}

        {/* Anteprima clausole critiche (solo versione parziale) */}
        {!showFull &&
          a.clausole_critiche &&
          a.clausole_critiche.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-3">
              <h2 className="text-base font-semibold text-slate-900">
                🔍 Alcune clausole da tenere d’occhio
              </h2>
              <p className="text-xs text-slate-600">
                Questa è una selezione ridotta delle clausole che potrebbero
                richiedere attenzione. Con l’analisi completa vedrai il dettaglio
                completo e tutti i suggerimenti di modifica.
              </p>
              <div className="space-y-3">
                {a.clausole_critiche.slice(0, 2).map((c, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-100 rounded-xl bg-slate-50 px-4 py-3 space-y-1"
                  >
                    <h3 className="text-sm font-semibold text-slate-900">
                      {c.titolo || `Clausola ${idx + 1}`}
                    </h3>
                    {c.estratto_originale && (
                      <p className="text-[11px] text-slate-700 line-clamp-3">
                        {c.estratto_originale}
                      </p>
                    )}
                    {c.perche_critica && (
                      <p className="text-[11px] text-slate-600">
                        <span className="font-semibold">Perché è rilevante: </span>
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
            <section id="clausole-vessatorie" className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-3">
              <h2 className="text-base font-semibold text-slate-900">
                ⚠️ Possibili clausole vessatorie
              </h2>
              <p className="text-xs text-slate-600">
                Qui vedi solo un assaggio delle clausole potenzialmente
                vessatorie. L’analisi completa ti mostra il quadro completo,
                con riferimenti normativi e suggerimenti pratici.
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
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              📄 Anteprima analisi (formato tecnico)
            </h2>
            <p className="text-xs text-slate-600 mb-2">
              Stiamo ancora perfezionando il layout di questa sezione. Nel frattempo puoi vedere il contenuto completo dell’analisi in formato tecnico.
            </p>
            <pre className="text-[11px] bg-slate-900/95 text-slate-50 rounded-lg p-3 overflow-x-auto">
              {JSON.stringify(analysis.analysis_json, null, 2)}
            </pre>
          </section>
        )}

        {!showFull && (
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              Vuoi l’analisi completa?
            </h2>
            <p className="text-[15px] text-slate-700">
              Al momento stai visualizzando una versione ridotta dell’analisi,
              generata a partire dal caricamento rapido del contratto.
              Con l’abbonamento ContrattiChiari puoi sbloccare:
            </p>
            <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
              <li>clausole critiche spiegate nel dettaglio</li>
              <li>clausole potenzialmente vessatorie evidenziate</li>
              <li>una versione riequilibrata del contratto</li>
              <li>alert finali e glossario dei termini complessi</li>
            </ul>
            <button
              onClick={() => router.push('/pricing')}
              className="mt-2 inline-flex items-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800"
            >
              Vedi piani e sblocca l’analisi completa
            </button>
          </section>
        )}

        {showFull && a.clausole_critiche && a.clausole_critiche.length > 0 && (
          <section id="clausole-problematiche" className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Clausole problematiche
            </h2>
            <div className="space-y-3">
              {a.clausole_critiche.map((c, idx) => (
                <div
                  key={idx}
                  className="border border-slate-100 rounded-xl bg-slate-50 px-4 py-3 space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-900">
                      {c.titolo || `Clausola ${idx + 1}`}
                    </h3>
                    {c.rischio_specifico && (
                      <span className="text-[10px] uppercase tracking-wide text-slate-500">
                        Rischio: {c.rischio_specifico}
                      </span>
                    )}
                  </div>

                  {c.estratto_originale && (
                    <div className="text-xs">
                      <div className="text-slate-500 mb-1">Estratto originale:</div>
                      <div className="bg-white border border-slate-200 rounded-lg p-2 font-mono text-[11px] text-slate-700">
                        {c.estratto_originale}
                      </div>
                    </div>
                  )}

                  {c.perche_critica && (
                    <p className="text-xs text-slate-700">
                      <span className="font-semibold">Perché è critica: </span>
                      {c.perche_critica}
                    </p>
                  )}

                  {c.suggerimento_modifica && (
                    <div className="text-xs">
                      <div className="text-slate-500 mb-1">
                        Suggerimento di modifica:
                      </div>
                      <div className="bg-amber-50 border border-amber-100 rounded-lg p-2 text-[11px] text-amber-900">
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
            <section id="clausole-vessatorie" className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Clausole potenzialmente vessatorie
              </h2>
              <div className="space-y-3">
                {a.clausole_vessatorie_potenziali.map((c, idx) => (
                  <div
                    key={idx}
                    className="border border-amber-100 rounded-xl bg-amber-50 px-4 py-3 space-y-2"
                  >
                    <h3 className="text-sm font-semibold text-amber-900">
                      {c.clausola || `Clausola ${idx + 1}`}
                    </h3>
                    {c.estratto_originale && (
                      <div className="text-xs bg-white/60 border border-amber-100 rounded-lg p-2 font-mono text-[11px] text-amber-900">
                        {c.estratto_originale}
                      </div>
                    )}
                    {c.perche_vessatoria && (
                      <p className="text-xs text-amber-900">
                        <span className="font-semibold">Perché è vessatoria: </span>
                        {c.perche_vessatoria}
                      </p>
                    )}
                    {c.riferimento_normativo && (
                      <p className="text-[11px] text-amber-800 italic">
                        Riferimento: {c.riferimento_normativo}
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
            <section id="versione-riequilibrata" className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Versione riequilibrata
              </h2>
              <p className="text-[15px] text-slate-700 whitespace-pre-line leading-relaxed">
                {a.versione_riequilibrata}
              </p>
            </section>
          )}

        {showFull && a.glossario && a.glossario.length > 0 && (
          <section id="glossario" className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Glossario
            </h2>
            <ul className="space-y-2">
              {a.glossario.map((g, idx) => (
                <li key={idx} className="text-sm">
                  <span className="font-semibold text-slate-900">
                    {g.termine}:
                  </span>{' '}
                  <span className="text-slate-700">{g.spiegazione}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {showFull && a.alert_finali && a.alert_finali.length > 0 && (
          <section id="alert-finali" className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Alert finali
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              {a.alert_finali.map((al, idx) => (
                <li key={idx} className="text-sm text-slate-700">
                  {al}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
}