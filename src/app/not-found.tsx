import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4 text-center">
        <h1 className="text-lg font-semibold text-slate-900">
          Errore 404
        </h1>
        <p className="text-sm text-slate-600">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/"
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800"
          >
            Torna alla home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
          >
            Vai alla dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}