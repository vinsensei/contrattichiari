import React from "react";
import { ANALYSIS_ANCHORS } from "../anchors";
import SectionHeader from "@/components/SectionHeader";
import ProLockedSection from "@/components/analysis/pro/ProLockedSection";

type RiskLevel = "basso" | "medio" | "alto";

type RiskIndex = {
  score: number;
  level: RiskLevel;
  why_short?: string;
};

function clampScore(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function levelMeta(level: RiskLevel) {
  if (level === "basso") {
    return {
      label: "Basso",
      pill: "border-emerald-200 bg-emerald-50 text-emerald-800",
      bar: "bg-emerald-500",
      dot: "bg-emerald-500",
    };
  }
  if (level === "alto") {
    return {
      label: "Alto",
      pill: "border-red-200 bg-red-50 text-red-800",
      bar: "bg-red-500",
      dot: "bg-red-500",
    };
  }
  return {
    label: "Medio",
    pill: "border-amber-200 bg-amber-50 text-amber-900",
    bar: "bg-amber-500",
    dot: "bg-amber-500",
  };
}

export default function SectionRiskIndexBox({
  riskIndex,
  stickyHeader = false,
  locked = false,
}: {
  riskIndex?: RiskIndex;
  stickyHeader?: boolean;
  /** Se true: mostra la sezione ma con contenuto blur/lock (header visibile) */
  locked?: boolean;
}) {
  if (!riskIndex) return null;

  const score = clampScore(riskIndex.score);
  const meta = levelMeta(riskIndex.level);

  return (
    <section
      id={ANALYSIS_ANCHORS.riskIndex}
      className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
    >
      <SectionHeader
        title="Indice di rischio complessivo"
        subtitle="Valutazione sintetica su 100 basata sulle clausole rilevanti"
        icon="uploadok.svg"
        sticky={stickyHeader}
      />
      <ProLockedSection locked={locked}>
        {/* Score + level */}
        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-end gap-2">
              <div className="text-3xl font-semibold tracking-tight text-slate-900">
                {score}
                <span className="text-base font-medium text-slate-500">/100</span>
              </div>
            </div>
          </div>

          <div
            className={`shrink-0 rounded-full border px-3 py-1 text-sm font-medium ${meta.pill}`}
            title="Livello sintetico del rischio"
          >
            {meta.label}
          </div>
        </div>

        {/* Progress bar (bolletta-like) */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>Basso</span>
            <span>Alto</span>
          </div>
          <div
            className="mt-1 h-2 w-full rounded-full"
            style={{
              background:
                "linear-gradient(to right, #f1f5f9 0%, #f1f5f9 50%, #dbeafe 50%, #dbeafe 100%)",
            }}
          >
            <div
              className={`h-2 rounded-full ${meta.bar}`}
              style={{ width: `${score}%` }}
              aria-hidden="true"
            />
          </div>
        </div>

        {/* Why */}
        {riskIndex.why_short ? (
          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-medium text-slate-600">Perché</div>
            <p className="mt-1 text-sm leading-relaxed text-slate-800">
              {riskIndex.why_short}
            </p>
          </div>
        ) : null}

        {/* Tiny legend */}
        <div className="mt-3 flex items-center gap-3 text-xs text-slate-600">
          <div className="flex items-center gap-1">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-emerald-500"
              aria-hidden="true"
            />
            <span>OK</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-amber-500"
              aria-hidden="true"
            />
            <span>Attenzione</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="inline-flex h-2 w-2 rounded-full bg-red-500"
              aria-hidden="true"
            />
            <span>Rischio alto</span>
          </div>
        </div>
      </ProLockedSection>
    </section>
  );
}

export function SectionPlainLanguageBox({
  text,
  stickyHeader = false,
  locked = false,
}: {
  text?: string;
  stickyHeader?: boolean;
  /** Se true: mostra il box ma con contenuto blur/lock (header visibile) */
  locked?: boolean;
}) {
  if (!text || !text.trim()) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <SectionHeader
        title="In parole semplici"
        subtitle="Spiegazione chiara e diretta del contratto"
        icon="uploadok.svg"
        sticky={stickyHeader}
      />
      <ProLockedSection locked={locked}>
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-800">
          {text}
        </p>
      </ProLockedSection>
    </div>
  );
}
