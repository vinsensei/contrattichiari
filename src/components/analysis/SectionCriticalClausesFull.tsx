"use client";
import { ANALYSIS_ANCHORS } from "./anchors";
import SectionHeader from "@/components/SectionHeader";

type ClausolaCritica = {
  titolo: string;
  estratto_originale: string;
  perche_critica: string;
  rischio_specifico: "basso" | "medio" | "alto" | string;
  suggerimento_modifica: string;
};

type EnrichedClause = {
  traffic_light?: "green" | "yellow" | "red" | string;
  risk_score?: number;
} | null;

export default function SectionCriticalClausesFull({
  show,
  clauses,
  findEnrichedClause,
  riskBadge,
  trafficEmoji,
}: {
  show: boolean;
  clauses?: ClausolaCritica[];
  findEnrichedClause: (legacy: ClausolaCritica) => EnrichedClause;
  riskBadge: (risk: string | null | undefined) => React.ReactNode;
  trafficEmoji: (t?: string | null) => string;
}) {
  if (!show || !clauses || clauses.length === 0) return null;

  return (
    <section
      id={ANALYSIS_ANCHORS.criticalFull}
      className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
    >
      <SectionHeader
        title="Clausole problematiche"
        subtitle="Punti del contratto che possono creare rischi o ambiguità"
        icon="uploadok.svg"
        sticky
      />

      <div className="space-y-10">
        {clauses.map((c, idx) => {
          const enriched = findEnrichedClause(c);

          return (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl bg-white px-5 py-4 space-y-3 shadow-xs"
            >
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  {c.titolo || `Clausola ${idx + 1}`}
                </h3>

                <div className="flex items-center gap-2">
                  {enriched?.traffic_light ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-slate-400 text-slate-600 bg-white px-2 py-1 text-xs">
                      <span aria-hidden>
                        {trafficEmoji(enriched.traffic_light as any)}
                      </span>
                      <span className="font-medium">
                        {(enriched as any).risk_score ?? 0}/100
                      </span>
                    </span>
                  ) : null}

                  {c.rischio_specifico ? riskBadge(c.rischio_specifico) : null}
                </div>
              </div>

              {c.estratto_originale ? (
                <div className="text-xs">
                  <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500 mb-1">
                    Estratto originale
                  </div>
                  <div className="bg-white border border-slate-300 rounded-lg p-3 font-mono text-sm text-slate-800">
                    {c.estratto_originale}
                  </div>
                </div>
              ) : null}

              {c.perche_critica ? (
                <p className="text-sm text-slate-700 mt-4 mb-5">
                  <span className="font-semibold">Perché è critica: </span>
                  {c.perche_critica}
                </p>
              ) : null}

              {c.suggerimento_modifica ? (
                <div className="text-xs">
                  <div className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-slate-600 mb-1">
                    <span>Suggerimento di modifica</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-300 rounded-lg p-3 text-sm text-slate-800">
                    {c.suggerimento_modifica}
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}