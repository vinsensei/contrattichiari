"use client";
import { ANALYSIS_ANCHORS } from "./anchors";
import SectionHeader from "@/components/SectionHeader";

type GlossaryItem = {
  termine: string;
  spiegazione: string;
};

export default function SectionGlossary({
  show,
  items,
}: {
  show: boolean;
  items?: GlossaryItem[];
}) {
  if (!show || !items || items.length === 0) return null;

  return (
    <section
      id={ANALYSIS_ANCHORS.glossary}
      className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
    >
      <SectionHeader
        title="Glossario"
        subtitle="Significato semplice dei termini legali usati nel contratto"
        icon="uploadok.svg"
        sticky
      />

      <ul className="space-y-4">
        {items.map((g, idx) => (
          <li
            key={idx}
            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xs"
          >
            {/* Icona */}
            <div className="h-[30px] w-[30px] shrink-0 rounded-full border border-slate-300 bg-white flex items-center justify-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="opacity-80"
              >
                <path
                  d="M12 17h.01M11 10a2 2 0 1 1 3 1.732c-.9.52-1.5 1.08-1.5 2.268v.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Testo */}
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-semibold text-slate-900 leading-snug">
                {g.termine}
              </div>
              <div className="mt-1 text-sm text-slate-700 leading-relaxed">
                {g.spiegazione}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}