import React from "react";
import { ANALYSIS_ANCHORS } from "../anchors";
import SectionHeader from "@/components/SectionHeader";
import ProLockedSection from "@/components/analysis/pro/ProLockedSection";

type EnrichedClause = {
  clause_id: string;
  title: string;
  excerpt: string;
  risk_level: "basso" | "medio" | "alto";
  risk_score: number;
  traffic_light?: "green" | "yellow" | "red";
  diagnostic?: string;
  highlights?: string[];
};

function trafficLightFromScore(score: number): "green" | "yellow" | "red" {
  if (score >= 70) return "red";
  if (score >= 40) return "yellow";
  return "green";
}

function lightMeta(v: "green" | "yellow" | "red") {
  if (v === "green") {
    return {
      label: "OK",
      dot: "bg-emerald-500",
      pill: "border-emerald-200 bg-emerald-50 text-emerald-800",
      rail: "bg-emerald-500",
      bar: "bg-emerald-500",
      softBg: "bg-emerald-50",
      stroke: "border-emerald-200",
    };
  }

  if (v === "red") {
    return {
      label: "Rischio alto",
      dot: "bg-red-500",
      pill: "border-red-200 bg-red-50 text-red-800",
      rail: "bg-red-500",
      bar: "bg-red-500",
      softBg: "bg-red-50",
      stroke: "border-red-200",
    };
  }

  return {
    label: "Attenzione",
    dot: "bg-amber-500",
    pill: "border-amber-200 bg-amber-50 text-amber-900",
    rail: "bg-amber-500",
    bar: "bg-amber-500",
    softBg: "bg-amber-50",
    stroke: "border-amber-200",
  };
}

function clampScore(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

function RiskBar({ score, color }: { score: number; color: string }) {
  const s = clampScore(score);
  return (
    <div className="h-2 w-full rounded-full bg-slate-100">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${s}%` }} />
    </div>
  );
}

export default function SectionClausesList({
  clauses,
  stickyHeader = false,
  locked = false,
}: {
  clauses?: EnrichedClause[];
  stickyHeader?: boolean;
  /** Se true, il contenuto della sezione viene blurato e coperto da un overlay “Contenuto Pro”. */
  locked?: boolean;
}) {
  if (!clauses || clauses.length === 0) return null;

  return (
    <section
      id={ANALYSIS_ANCHORS.clausesEnriched}
      className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
    >
      {/* Header */}
      <SectionHeader
        title="Clausole evidenziate"
        subtitle="Semaforo + punteggio per capire subito cosa conta"
        icon="uploadok.svg"
        sticky={stickyHeader}
      />

      {/*
        Contenuto “Pro”: blur SOLO del contenuto (non dell’header).
        Wrapper unico per tutti i blocchi Pro.
      */}
      <ProLockedSection locked={locked}>
        <div className="mt-4 space-y-3">
          {clauses.map((c, idx) => {
            const light = c.traffic_light ?? trafficLightFromScore(c.risk_score);
            const meta = lightMeta(light);
            const score = clampScore(c.risk_score);

            return (
              <div
                key={c.clause_id}
                className={`relative overflow-hidden rounded-2xl border bg-white ${meta.stroke}`}
              >
                {/* Colored rail (bolletta-like) */}
                <div className={`absolute left-0 top-0 h-full w-2 ${meta.rail}`} />

                <div className="p-4 pl-5">
                  {/* Top row */}
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex h-2.5 w-2.5 rounded-full ${meta.dot}`}
                          aria-hidden="true"
                        />
                        <div className="min-w-0 truncate text-sm font-medium text-slate-900">
                          {c.title}
                        </div>
                      </div>

                      {/* Excerpt */}
                      <div className="mt-2 text-sm text-slate-700 line-clamp-3">
                        {c.excerpt}
                      </div>

                      {/* Diagnostic + Highlights */}
                      {(c.diagnostic || (c.highlights && c.highlights.length > 0)) && (
                        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                          {c.diagnostic ? (
                            <div className="text-xs text-slate-700">
                              <span className="font-medium text-slate-900">Diagnostica: </span>
                              <span className="text-slate-700">{c.diagnostic}</span>
                            </div>
                          ) : null}

                          {c.highlights && c.highlights.length > 0 ? (
                            <ul className="mt-2 space-y-1 text-xs text-slate-700">
                              {c.highlights.slice(0, 3).map((h, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span aria-hidden className="mt-[1px] text-slate-400">
                                    •
                                  </span>
                                  <span className="leading-relaxed">{h}</span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      )}
                    </div>

                    {/* Right column (score box) */}
                    <div className="shrink-0">
                      <div className={`rounded-2xl border p-3 ${meta.pill}`}>
                        <div className="text-xs opacity-80">Score</div>
                        <div className="mt-0.5 text-2xl font-semibold tracking-tight">
                          {score}
                          <span className="text-sm font-medium opacity-70">/100</span>
                        </div>
                        <div className="mt-2 text-xs font-medium">{meta.label}</div>
                      </div>

                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-600">
                          <span>0</span>
                          <span>100</span>
                        </div>
                        <RiskBar score={score} color={meta.bar} />
                        <div className="mt-2 text-[11px] text-slate-600">
                          Livello: <span className="font-medium text-slate-800">{c.risk_level}</span>
                          <span className="text-slate-400"> • </span>
                          <span className="text-slate-600">ID {c.clause_id || `#${idx + 1}`}</span>
                        </div>
                      </div>
                    </div>
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
