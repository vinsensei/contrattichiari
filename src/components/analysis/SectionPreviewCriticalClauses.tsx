"use client";
import { ANALYSIS_ANCHORS } from "./anchors";
type ClausolaCritica = {
  titolo: string;
  estratto_originale: string;
  perche_critica: string;
};

export default function SectionPreviewCriticalClauses({
  clauses,
  show,
}: {
  clauses?: ClausolaCritica[];
  show: boolean;
}) {
  if (!show || !clauses || clauses.length === 0) return null;

  return (
    <section
          id={ANALYSIS_ANCHORS.criticalPreview}
          className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-4"
        >
      <h2 className="text-base font-semibold text-slate-900">
        Alcune clausole da tenere d’occhio
      </h2>

      <p className="text-xs text-slate-600">
        Questa è una selezione ridotta delle clausole che potrebbero richiedere
        attenzione. Con l’analisi completa vedrai il dettaglio completo e tutti i
        suggerimenti di modifica.
      </p>

      <div className="space-y-4">
        {clauses.slice(0, 2).map((c, idx) => (
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
                <span className="font-semibold">Perché è rilevante: </span>
                {c.perche_critica}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}