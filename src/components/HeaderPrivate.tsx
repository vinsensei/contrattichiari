"use client";

import { useState } from "react";
import Link from "next/link";

export default function HeaderPrivate({
  userEmail,
  planLabel,
  plan,
  isActive,
  onLogout,
  currentPeriodEnd,
}: {
  userEmail: string | null;
  planLabel: string;
  plan: "free" | "standard" | "pro";
  isActive: boolean;
  onLogout: () => void;
  currentPeriodEnd?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur relative z-40">
      <div className="mx-auto flex h-16 max-w-5xl shrink-0 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          {/* Logo Mobile */}
            <img
              src="/logo_mobile.png"
              alt="Contratti Chiari"
              className="h-9 w-auto shrink-0 block md:hidden"
            />

            {/* Logo Desktop */}
            <img
              src="/logo.png"
              alt="Contratti Chiari"
              className="h-8 w-auto shrink-0 hidden md:block"
            />
        </Link>

         <nav className="flex items-center gap-3 text-sm">

        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 transition"
        >
          Avvia analisi
        </Link>

        {/* Pulsante menu utente */}
        <div className="relative">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => setOpen((prev) => !prev)}
          >
            <span>{userEmail && <span className="font-medium">{userEmail}</span>}</span>
            <span className="text-[10px]">▾</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white shadow-lg text-xs z-20">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Piano attivo
                </p>
                <p className="mt-0.5 text-sm text-slate-900">
                  {planLabel}
                </p>
                {plan !== "free" && currentPeriodEnd && (
                  <p className="text-[11px] text-amber-600 mt-1">
                    {isActive
                      ? "Abbonamento attivo fino al "
                      : "Abbonamento annullato — attivo fino al "}
                    {new Date(currentPeriodEnd).toLocaleDateString("it-IT")}
                  </p>
                )}
              </div>
              <div className="py-1">
                 <Link
                  href="/dashboard"
                  className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                >
                  Analizza documento
                </Link>
                <Link
                  href="/dashboard/analyses"
                  className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                >
                  Le mie analisi
                </Link>
                <Link
                  href="/dashboard/account"
                  className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                >
                  Il mio profilo
                </Link>
                <Link
                  href="/dashboard/account"
                  className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                >
                  Abbonamento e fatturazione
                </Link>
                <Link
                  href="/pricing"
                  className="block px-3 py-2 hover:bg-slate-50 text-slate-700"
                >
                  Piani abbonamento
                </Link>
              </div>
              <div className="border-t border-slate-100 py-1">
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex w-full items-center justify-between px-3 py-2 text-rose-700 hover:bg-rose-50"
                >
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      </div>

     
    </header>
  );
}