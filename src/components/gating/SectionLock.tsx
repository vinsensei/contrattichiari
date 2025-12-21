"use client";

import React from "react";

export default function SectionLock({
  locked,
  children,
  overlay,
  className = "",
}: {
  locked: boolean;
  children: React.ReactNode;
  /** Overlay personalizzato (CTA, testo ecc) */
  overlay?: React.ReactNode;
  className?: string;
}) {
  if (!locked) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div className={["relative", className].join(" ")}>
      {/* body blur */}
      <div className="pointer-events-none select-none blur-[7px] opacity-90">
        {children}
      </div>

      {/* overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        {overlay ?? (
          <div className="rounded-2xl bg-white/90 backdrop-blur px-5 py-4 shadow-lg border border-slate-200 text-center">
            <div className="text-sm font-semibold text-slate-900 mb-1">
              🔒 Solo piano Pro
            </div>
            <p className="text-xs text-slate-600">
              Sblocca per vedere il dettaglio completo
            </p>
          </div>
        )}
      </div>
    </div>
  );
}