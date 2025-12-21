import React from "react";
import { ANALYSIS_ANCHORS } from "../anchors";
import SectionHeader from "@/components/SectionHeader";
import ProLockedSection from "@/components/analysis/pro/ProLockedSection";

type ChecklistItem = {
  type: "action" | "caution" | "ok" | string;
  text: string;
};

function typeMeta(type: string) {
  if (type === "action") {
    return {
      label: "AZIONE",
      dot: "bg-neutral-900",
      pill: "border-neutral-200 bg-neutral-900 text-white",
      rail: "bg-neutral-900",
      subtleBg: "bg-neutral-50",
    };
  }
  if (type === "caution") {
    return {
      label: "ATTENZIONE",
      dot: "bg-amber-500",
      pill: "border-amber-200 bg-amber-50 text-amber-900",
      rail: "bg-amber-500",
      subtleBg: "bg-amber-50",
    };
  }
  return {
    label: "OK",
    dot: "bg-emerald-500",
    pill: "border-emerald-200 bg-emerald-50 text-emerald-800",
    rail: "bg-emerald-500",
    subtleBg: "bg-emerald-50",
  };
}

export default function SectionChecklistBox({
  items,
  stickyHeader = false,
  locked = false,
}: {
  items?: ChecklistItem[];
  stickyHeader?: boolean;
  locked?: boolean;
}) {
  if (!items || items.length === 0) return null;

  const shown = items.slice(0, 12);

  return (
    <section
      id={ANALYSIS_ANCHORS.checklist}
      className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
    >
      {/* Header */}
      <SectionHeader
        title="Cosa fare ora"
        subtitle="Checklist operativa: poche righe, molto chiaro"
        icon="uploadok.svg"
        sticky={stickyHeader}
      />

      {/* Contenuto sotto l'header (blur solo del body, overlay gestito dal wrapper) */}
      <ProLockedSection locked={locked}>
        {/* Items */}
        <div className="mt-4 space-y-2">
          {shown.map((it, idx) => {
            const meta = typeMeta(it.type);
            return (
              <div key={idx} className="relative border border-slate-200 bg-white">
                {/* Left rail */}
                <div className={`absolute left-0 top-0 h-full w-1.5 ${meta.rail}`} />

                <div className="grid grid-cols-[1fr_auto] gap-4 p-4 pl-6">
                  {/* Main content */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex h-2.5 w-2.5 rounded-full ${meta.dot}`}
                        aria-hidden="true"
                      />
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${meta.pill}`}
                      >
                        {meta.label}
                      </span>
                    </div>

                    <div className="mt-2 text-sm leading-relaxed text-slate-800">
                      {it.text}
                    </div>
                  </div>

                  {/* Right column: meta */}
                  <div className="flex flex-col items-end justify-between text-[11px] text-slate-600">
                    <div className="font-medium text-slate-700">#{idx + 1}</div>
                    <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                      Priorità:{" "}
                      <span className="font-medium text-slate-800">
                        {it.type === "action"
                          ? "Alta"
                          : it.type === "caution"
                          ? "Media"
                          : "Bassa"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-neutral-900"
              aria-hidden="true"
            />
            <span>Azione</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-amber-500"
              aria-hidden="true"
            />
            <span>Attenzione</span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            <span>OK</span>
          </div>
          <div className="mt-1 shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600">
            Voci:{" "}
            <span className="font-medium text-slate-900">{shown.length}</span>
          </div>
        </div>
      </ProLockedSection>
    </section>
  );
}
