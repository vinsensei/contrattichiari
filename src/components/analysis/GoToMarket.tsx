"use client";

import { useState } from "react";
import Link from "next/link";

export default function GoToMarket() {
  
  return (
     <div className="absolute inset-0 flex items-center justify-center">
      <div className="rounded-2xl bg-white/90 backdrop-blur px-5 py-4 shadow-lg border border-slate-200 text-center">
        <div className="text-sm font-semibold text-slate-900 mb-1">
          🔒 Solo piano Pro
        </div>
        <p className="text-xs text-slate-600">
          Sblocca per vedere il dettaglio completo di questa sezione.
        </p>
        <Link
          href="/pricing"
          className="mt-3 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-1.5 text-xs font-medium text-white shadow-sm transition hover:bg-slate-800"
        >
          Passa a Pro
        </Link>
      </div>
    </div>
  );
};
