"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ContractUploadForm } from "@/components/ContractUploadForm";

export default function UploadPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromSlug = searchParams.get("from");

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER comune */}
      <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
          <a href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="ContrattoChiaro"
              className="h-8 w-auto"
            />
          </a>

          <nav className="flex items-center gap-3 text-sm">
            <a
              href="/login"
              className="rounded-full border border-zinc-300 px-4 py-1.5 text-xs font-medium text-zinc-900 transition hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
            >
              Accedi
            </a>
            <a
              href="/register"
              className="rounded-full bg-zinc-900 px-4 py-1.5 text-xs font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800"
            >
              Registrati
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        
          {/* titolo + testo... */}

          <ContractUploadForm
            bottomLeftText="Passaggio 1 di 3 · Caricamento contratto"
            bottomRightText="Passaggio successivo: registrazione e salvataggio analisi"
            onAnalyze={async (file) => {
              const fd = new FormData();
              fd.set("file", file);
              if (fromSlug) fd.set("from", fromSlug);

              const res = await fetch("/api/analysis/anonymous", {
                method: "POST",
                body: fd,
              });

              if (!res.ok) {
                throw new Error("Errore durante l'analisi del contratto.");
              }

              const data = (await res.json()) as { analysisId: string };

              const search = new URLSearchParams();
              search.set("analysisId", data.analysisId);
              if (fromSlug) search.set("from", fromSlug);

              router.push(`/register?${search.toString()}`);
            }}
          />
      </main>
    </div>
  );
}