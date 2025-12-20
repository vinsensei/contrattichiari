"use client";
import { ANALYSIS_ANCHORS } from "./anchors";
import SectionHeader from "@/components/SectionHeader";

export default function SectionRebalancedVersion({
  show,
  text,
}: {
  show: boolean;
  text?: string;
}) {
  if (!show || !text || text.trim().length === 0) return null;

  return (
    <section
      id={ANALYSIS_ANCHORS.rebalanced}
      className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
    >
      <SectionHeader
        title="Versione riequilibrata"
        subtitle="Proposta di riscrittura più equa e bilanciata"
        icon="uploadok.svg"
        sticky
      />

      <p className="text-base text-slate-700 whitespace-pre-line leading-relaxed">
        {text}
      </p>
    </section>
  );
}