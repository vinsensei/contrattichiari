// src/app/not-found.tsx

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 text-zinc-900 px-4">
      <h1 className="text-2xl font-semibold mb-2">Pagina non trovata</h1>
      <p className="text-sm text-zinc-600 mb-4 text-center max-w-md">
        La pagina che stai cercando non esiste. Controlla l&apos;indirizzo oppure torna alla home.
      </p>
      <Link
        href="/"
        className="rounded-full bg-zinc-900 px-4 py-2 text-sm text-zinc-50 hover:bg-zinc-800 transition"
      >
        Torna alla home
      </Link>
    </div>
  );
}