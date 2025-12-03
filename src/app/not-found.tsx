// app/not-found.tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900 mb-2">
        Pagina non trovata
      </h1>
      <p className="text-sm text-zinc-600 mb-6 max-w-md">
        La pagina che stai cercando non esiste o è stata spostata.
      </p>
      <Link
        href="/"
        className="inline-flex items-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-800"
      >
        Torna alla home
      </Link>
    </main>
  );
}