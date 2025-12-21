import React from "react";
import { ANALYSIS_ANCHORS } from "../anchors";  
import SectionHeader from "@/components/SectionHeader";
import ProLockedSection from "@/components/analysis/pro/ProLockedSection";

type TopRiskClause = {
  clause_id: string;
  title: string;
  risk_score: number;
  risk_level: "basso" | "medio" | "alto";
  why_short?: string;
  excerpt?: string;
};

function metaFromScore(score: number) {
  if (score >= 70)
    return {
      rail: "bg-red-500",
      dot: "bg-red-500",
      label: "Rischio alto",
    };
  if (score >= 40)
    return {
      rail: "bg-amber-400",
      dot: "bg-amber-400",
      label: "Attenzione",
    };
  return {
    rail: "bg-emerald-500",
    dot: "bg-emerald-500",
    label: "Contenuto",
  };
}

export default function SectionTopRiskClausesBox({
  items,
  stickyHeader = false,
  locked = false,
}: {
  items?: TopRiskClause[];
  stickyHeader?: boolean;
  locked?: boolean;
}) {
  if (!items || items.length === 0) return null;

  return (
    <section
          id={ANALYSIS_ANCHORS.topRiskClauses}
          className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
        >
      <SectionHeader
        title="Focus immediato"
        subtitle="Le 3 clausole più rischiose"
        icon="uploadok.svg"
        sticky={stickyHeader}
      />

      <ProLockedSection locked={locked}>
        <div className="mt-4 divide-y divide-neutral-100">
          {items.slice(0, 3).map((c, idx) => {
            const meta = metaFromScore(c.risk_score);
            return (
              <div
                key={c.clause_id}
                className="relative grid grid-cols-[1fr_auto] gap-4 py-4"
              >
                {/* Left rail */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${meta.rail}`}
                  aria-hidden
                />

                {/* Main content */}
                <div className="min-w-0 pl-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex h-2.5 w-2.5 rounded-full ${meta.dot}`}
                      aria-hidden
                    />
                    <span className="text-xs font-medium text-neutral-500">
                      #{idx + 1}
                    </span>
                  </div>

                  <div className="mt-1 truncate text-sm font-medium text-neutral-900">
                    {c.title}
                  </div>

                  {c.why_short ? (
                    <div className="mt-1 text-sm text-neutral-700">
                      {c.why_short}
                    </div>
                  ) : null}
                </div>

                {/* Right column */}
                <div className="flex flex-col items-end justify-between pr-1">
                  <div className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-700">
                    {c.risk_score}/100
                  </div>
                  <div className="mt-2 text-[11px] font-medium text-neutral-500">
                    {meta.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ProLockedSection>
    </section>
  );
}