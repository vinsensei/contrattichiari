"use client";

import ContractTypePill from "@/components/analysis/ContractTypePill";

export default function SectionAnalysisHero({
  contractType,
  title,
  motivation,
  createdAt,
}: {
  contractType?: string;
  title: string;
  motivation?: string;
  createdAt: string;
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <ContractTypePill value={contractType ?? undefined} />
          <h1 className="text-3xl md:text-5xl text-slate-900 mb-4">
            {title}
          </h1>
        </div>
      </div>

      {motivation && (
        <p className="text-sm md:text-base text-slate-800 leading-relaxed">
          {motivation}
        </p>
      )}

      <span className="hidden text-xs md:text-sm text-slate-500 sm:inline">
        Analisi creata il {createdAt}
      </span>
    </section>
  );
}