"use client";
import { ANALYSIS_ANCHORS } from "./anchors";
import SectionHeader from "@/components/SectionHeader";

type ClausolaVessatoria = {
  clausola: string;
  estratto_originale: string;
  perche_vessatoria: string;
  riferimento_normativo: string;
};

export default function SectionUnfairClausesFull({
  show,
  items,
}: {
  show: boolean;
  items?: ClausolaVessatoria[];
}) {
  if (!show || !items || items.length === 0) return null;

  return (
    <section
      id={ANALYSIS_ANCHORS.unfairFull}
      className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
    >
      <SectionHeader
        title="Clausole potenzialmente vessatorie"
        subtitle="Clausole che potrebbero essere sfavorevoli o contestabili"
        icon="uploadok.svg"
        sticky
      />

      <div className="space-y-10">
        {items.map((c, idx) => (
          <div
            key={idx}
            className="border border-slate-200 rounded-2xl bg-white px-5 py-4 space-y-3 shadow-xs"
          >
            <h3 className="text-sm font-semibold text-slate-900">
              {c.clausola || `Clausola ${idx + 1}`}
            </h3>

            {c.estratto_originale ? (
              <div className="text-sm bg-white border border-slate-300 rounded-lg p-3 font-mono text-sm text-slate-800">
                {c.estratto_originale}
              </div>
            ) : null}

            {c.perche_vessatoria ? (
              <p className="text-sm text-slate-800">
                <span className="font-semibold">Perché è vessatoria: </span>
                {c.perche_vessatoria}
              </p>
            ) : null}

            {c.riferimento_normativo ? (
              <p className="text-xs text-slate-600 italic inline-flex items-center gap-1.5">
                <span
                  aria-hidden="true"
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-300 bg-white text-[10px] font-semibold leading-none text-slate-600"
                >
                  i
                </span>
                <span>Riferimento: {c.riferimento_normativo}</span>
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}