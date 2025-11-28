'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseClient';

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
  tipo_contratto: string | null;
  valutazione_rischio: string | null;
  motivazione_rischio: string | null;
  created_at: string;
  analisi: AnalysisJson;
};

export default function AnalysisDetailPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState<AnalysisRow | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

        // 2) fetch analisi
        const { data, error } = await supabase
          .from('contract_analyses')
          .select(
            'id, tipo_contratto, valutazione_rischio, motivazione_rischio, created_at, analisi'
          )
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
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium';
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

  const a = analysis.analisi || {};
  const createdAt = new Date(analysis.created_at).toLocaleString('it-IT');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white">
        <button
          onClick={() => router.push('/dashboard')}
          className="text-sm text-slate-600 hover:text-slate-900"
        >
          ← Torna alla dashboard
        </button>
        <div className="text-sm text-slate-500">
          Analisi creata il {createdAt}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Titolo + rischio */}
        <section className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                {analysis.tipo_contratto || a.tipo_contratto || 'Contratto'}
              </h1>
              <p className="text-sm text-slate-500">
                ID analisi: <span className="font-mono text-xs">{analysis.id}</span>
              </p>
            </div>
            <div>{riskBadge(analysis.valutazione_rischio || a.valutazione_rischio)}</div>
          </div>

          {a.motivazione_rischio && (
            <p className="text-sm text-slate-600 max-w-2xl">
              {a.motivazione_rischio}
            </p>
          )}
        </section>

        {/* Riassunto semplice */}
        {a.riassunto_semplice && (
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h2 className="text-base font-semibold text-slate-900 mb-2">
              📄 Riassunto semplice
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed">
              {a.riassunto_semplice}
            </p>
          </section>
        )}

        {/* Clausole critiche */}
        {a.clausole_critiche && a.clausole_critiche.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-4">
            <h2 className="text-base font-semibold text-slate-900">
              🔍 Clausole problematiche
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

        {/* Clausole vessatorie */}
        {a.clausole_vessatorie_potenziali &&
          a.clausole_vessatorie_potenziali.length > 0 && (
            <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-4">
              <h2 className="text-base font-semibold text-slate-900">
                ⚠️ Clausole potenzialmente vessatorie
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

        {/* Versione riequilibrata */}
        {a.versione_riequilibrata && a.versione_riequilibrata.trim().length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              ✍️ Versione riequilibrata
            </h2>
            <p className="text-sm text-slate-700 whitespace-pre-line">
              {a.versione_riequilibrata}
            </p>
          </section>
        )}

        {/* Glossario */}
        {a.glossario && a.glossario.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              📚 Glossario
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

        {/* Alert finali */}
        {a.alert_finali && a.alert_finali.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-3">
            <h2 className="text-base font-semibold text-slate-900">
              🚨 Alert finali
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