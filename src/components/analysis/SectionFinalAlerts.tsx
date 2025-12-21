"use client";
import { ANALYSIS_ANCHORS } from "./anchors";
import SectionHeader from "@/components/SectionHeader";

export default function SectionFinalAlerts({
  show,
  items,
}: {
  show: boolean;
  items?: string[];
}) {
  if (!show || !items || items.length === 0) return null;

  return (
    <section
      id={ANALYSIS_ANCHORS.finalAlerts}
      className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
    >
      <SectionHeader
        title="Alert finali"
        subtitle="Cose importanti da sapere prima di firmare"
        icon="uploadok.svg"
        sticky
      />

      <ul className="space-y-4">
        {items.map((al, idx) => (
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
                  d="M12 9v4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 17h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Testo */}
            <div className="min-w-0">
              <div className="text-sm sm:text-base text-slate-800 leading-relaxed">
                {al}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}