"use client";
import { ANALYSIS_ANCHORS } from "./anchors";

type ClausolaVessatoria = {
  clausola: string;
  perche_vessatoria: string;
};

export default function SectionPreviewUnfairClauses({
  clauses,
  show,
}: {
  clauses?: ClausolaVessatoria[];
  show: boolean;
}) {
  if (!show || !clauses || clauses.length === 0) return null;

  return (
    <section
      id={ANALYSIS_ANCHORS.unfairPreview}
      className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 space-y-4"
    >
      <h2 className="text-base font-semibold text-slate-900">
        Possibili clausole vessatorie
      </h2>

      <p className="text-xs text-slate-600">
        Qui vedi solo un assaggio delle clausole potenzialmente vessatorie.
        L’analisi completa ti mostra il quadro completo, con riferimenti
        normativi e suggerimenti pratici.
      </p>

      <ul className="space-y-2">
        {clauses.slice(0, 1).map((c, idx) => (
          <li key={idx} className="text-sm text-slate-700">
            <span className="font-semibold">
              {c.clausola || `Clausola ${idx + 1}`}:
            </span>{" "}
            {c.perche_vessatoria}
          </li>
        ))}
      </ul>
    </section>
  );
}