"use client";

import React from "react";

export default function AnalysisHeader({
  onBack,
  riskBadge,
  /** Handler per download PDF (solo Pro). Può essere omesso nei piani non Pro. */
  onDownloadPdf,
  isPro,
}: {
  onBack: () => void;
  riskBadge?: React.ReactNode;
  /** Handler per download PDF (solo Pro). Può essere omesso nei piani non Pro. */
  onDownloadPdf?: () => Promise<void> | void;
  isPro: boolean;
}) {
  return (
    <header
      data-fixed-header="true"
      className="w-full border-b border-slate-200 bg-white/95 backdrop-blur"
    >
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 inline-flex items-center gap-1"
          >
            <span aria-hidden="true">←</span>
            <span>Torna alla dashboard</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          {isPro ? (
            <button
              type="button"
              onClick={() => onDownloadPdf?.()}
              className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 transition"
            >
              Scarica PDF
            </button>
          ) : (
            <button
              disabled
              className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1.5 text-xs font-medium text-slate-500 cursor-not-allowed"
            >
              Scarica PDF (Pro)
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
