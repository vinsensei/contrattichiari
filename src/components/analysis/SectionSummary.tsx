"use client";

import { ANALYSIS_ANCHORS } from "./anchors";
import SectionHeader from "@/components/SectionHeader";

export default function SectionSummary({
  summary,
}: {
  summary?: string | null;
}) {
  if (!summary) return null;

  return (
    <section
      id={ANALYSIS_ANCHORS.summary}
      className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
    >
      <SectionHeader
        title="Riassunto semplice"
        subtitle="Il contratto spiegato in poche frasi, senza linguaggio legale"
        icon="uploadok.svg"
        sticky
      />
      <p className="text-[15px] text-slate-800 leading-relaxed">
        {summary}
      </p>
    </section>
  );
}