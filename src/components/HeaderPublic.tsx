"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function HeaderPublic() {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const client = supabaseBrowser();
    client.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });
  }, []);

  return (
    <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <img
            src="/logo.png"
            alt="ContrattoChiaro"
            className="h-9 w-auto"
          />
        </Link>

        {loggedIn === null ? (
          // stato iniziale: non sappiamo ancora se è loggato, mostriamo solo uno scheletro
          <div className="h-8 w-28 rounded-full bg-zinc-200 animate-pulse" />
        ) : loggedIn ? (
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/dashboard"
              className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
            >
              Dashboard
            </Link>
          </nav>
        ) : (
          <nav className="flex items-center gap-3 text-sm">
            <Link
              href="/login"
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-medium text-zinc-900 transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              Accedi
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
            >
              Registrati
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}