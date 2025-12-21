import React from "react";
import { ANALYSIS_ANCHORS } from "../anchors";
import SectionHeader from "@/components/SectionHeader";
import ProLockedSection from "@/components/analysis/pro/ProLockedSection";

type BalanceScore = {
  user?: number;
  counterparty?: number;
  note?: string;
};

function clampPct(n: number) {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

export default function SectionBalanceScoreBox({
  data,
  stickyHeader = false,
  locked = false,
}: {
  data?: BalanceScore;
  stickyHeader?: boolean;
  /** Se true: header visibile, contenuto blur + overlay di blocco */
  locked?: boolean;
}) {
  if (!data) return null;

  const user = typeof data.user === "number" ? clampPct(data.user) : null;
  const counterparty =
    typeof data.counterparty === "number" ? clampPct(data.counterparty) : null;

  if (user === null || counterparty === null) return null;

  // Prefer the provided user % for the slider position.
  // If the pair doesn't sum to 100, we still show the knob based on user.
  const pos = user; // 0..100

  return (
    <section
      id={ANALYSIS_ANCHORS.balanceScore}
      className="scroll-mt-[var(--anchor-offset)] md:bg-white md:rounded-3xl md:border md:border-slate-200 md:shadow-sm p-0 md:p-5 space-y-5"
    >
      <SectionHeader
        title="Equilibrio del contratto"
        subtitle="Quanto il contratto è a tuo favore rispetto alla controparte"
        icon="uploadok.svg"
        sticky={stickyHeader}
      />

      <ProLockedSection locked={locked}>
        {/* Labels row: counterparty left (less emphasis), user right (more emphasis) */}
        <div className="mt-3 mb-3 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs text-neutral-500">A favore controparte</div>
            <div className="mt-0.5 flex items-baseline gap-2">
              <span className="text-sm text-neutral-800">🏢</span>
              <span className="text-2xl font-semibold tracking-tight text-neutral-900">
                {counterparty}%
              </span>
            </div>
          </div>

          <div className="min-w-0 text-right">
            <div className="text-xs text-neutral-500">A tuo favore</div>
            <div className="mt-0.5 flex items-baseline justify-end gap-2">
              <span className="text-2xl font-semibold tracking-tight text-neutral-900">
                {user}%
              </span>
              <span className="text-sm text-neutral-800">🧍‍♂️</span>
            </div>
          </div>
        </div>

        {/* Balance line with cursor (bilancia) */}
        <div className="relative">
          {/*
            Rail con altezza fissa: la linea viene centrata verticalmente nella rail,
            e il pallino usa LO STESSO centro (`top-1/2`).
            Così il pallino segue sempre la linea, indipendentemente da border/antialias.
          */}
          <div className="relative mx-[10px] h-6">
            {/* Base line centrata verticalmente */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
              <div
                className="h-2 w-full rounded-full"
                style={{
                  border: "1px solid #2b80ff29",
                  background:
                    "linear-gradient(to right, #ffffff 0%, #ffffff 50%, #bed8fa 50%, #bed8fa 100%)",
                }}
              />
            </div>

            {/* Center mark (centrato sulla linea) */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div
                className="h-2 w-0.5"
                style={{
                  background: "#115ac729",
                }}
              />
            </div>

            {/* Knob (stesso centro della linea)
            <div
              className="pointer-events-none absolute top-1/2"
              style={{
                left: `${pos}%`,
                transform: "translate(-50%, -50%)",
              }}
              aria-hidden="true"
            >
              <div className="h-5 w-5 rounded-full border border-blue-500 bg-blue-100 shadow-sm" />
            </div>
             */}
          </div>

          {/* Accessible value */}
          <div
            className="sr-only"
            role="img"
            aria-label={`Equilibrio: ${user}% a tuo favore, ${counterparty}% a favore controparte.`}
          />
        </div>

        {data.note ? (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-bold text-black">Nota</div>
            <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-neutral-700">
              {data.note}
            </p>
          </div>
        ) : null}
      </ProLockedSection>
    </section>
  );
}