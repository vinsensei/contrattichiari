"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { gaEvent } from "@/lib/gtag";

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const analysisId = searchParams.get("analysisId");
  const redirectedFrom = searchParams.get("redirectedFrom") || "/dashboard";
  const fromSlug = searchParams.get("from");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (analysisId) {
      gaEvent("sign_up_started", {
        analysis_id: analysisId,
        from_slug: fromSlug || "(none)",
      });
    }
  }, [analysisId, fromSlug]);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // 1) Crea l’account
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (signUpError) throw signUpError;

      // 2) Login automatico dopo la registrazione
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (loginError) throw loginError;

      // 3) Evento GA: registrazione completata
      gaEvent("sign_up_completed", {
        method: "email",
        has_analysis_id: !!analysisId,
        analysis_id: analysisId || undefined,
        from_slug: fromSlug || "(none)",
      });

      // 4) Redirect:
      // - se arriva da analisi anonima, portalo alla pagina analisi
      // - altrimenti alla pagina da cui è stato reindirizzato o alla dashboard
      if (analysisId) {
        router.push(`/analysis/${analysisId}`);
      } else {
        router.push(redirectedFrom || "/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message ?? "Errore durante la registrazione");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Colonna sinistra: logo, payoff, form */}
      <div className="flex w-full md:w-1/2 flex-col justify-center px-6 py-10 md:px-12">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Logo + payoff */}
          <div className="space-y-3 text-center">
            <a href="/" className="inline-flex items-center">
              <img
                src="/logo.png"
                alt="ContrattiChiari"
                className="h-13 w-auto"
              />
            </a>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Contratti chiari, amicizia lunga.
            </p>
            <p className="text-sm text-slate-600">
              Crea il tuo account per salvare le analisi dei contratti, rivederle quando vuoi
              e sbloccare le funzioni avanzate.
            </p>
          </div>

          {/* Card form */}
          <div className="w-full bg-white rounded-2xl shadow-md p-8 space-y-6 border border-slate-100">
            <h1 className="text-2xl font-semibold text-slate-900">
              Crea nuovo account
            </h1>

            {analysisId && (
              <p className="text-sm text-slate-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                La tua analisi è quasi pronta. Completa la registrazione per vedere il risultato.
              </p>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {errorMsg && (
                <p className="text-sm text-red-600">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "Attendere..." : "Registrati"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-600">
              Hai già un account?{" "}
              <a
                href="/login"
                className="text-slate-900 underline font-medium"
              >
                Accedi
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Colonna destra: placeholder immagine a metà schermo (desktop) */}
      <div className="hidden md:block md:w-1/2 bg-slate-200">
        <div className="h-full w-full" />
      </div>
    </div>
  );
}