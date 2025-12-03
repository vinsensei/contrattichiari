"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { trackActivity } from "@/lib/trackActivity";

function LoginInner() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const searchParams = useSearchParams();

  const analysisId = searchParams.get("analysisId");
  const redirectedFrom = searchParams.get("redirectedFrom") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      trackActivity();

      if (analysisId) {
        router.push(`/analysis/${analysisId}`);
      } else {
        router.push(redirectedFrom || "/dashboard");
      }
    } catch (err: any) {
      setErrorMsg(err.message ?? "Errore durante l'accesso");
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
              Accedi al tuo account per rivedere le analisi dei contratti e continuare da dove eri rimasto.
            </p>
          </div>

          {/* Card form */}
          <div className="w-full bg-white rounded-2xl shadow-md p-8 space-y-6 border border-slate-100">
            <h1 className="text-2xl font-semibold text-slate-900">
              Accedi
            </h1>

            <form onSubmit={handleLogin} className="space-y-4">
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
                {loading ? "Attendere..." : "Accedi"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-600">
              Non hai un account?{" "}
              <a
                href="/register"
                className="text-slate-900 underline font-medium"
              >
                Registrati
              </a>
            </p>

             <p className="text-center text-sm text-slate-600">
              Password dimenticata? {" "}
              <a
                href="/password/forgot"
                className="text-slate-900 underline font-medium"
              >
                Reimpostala
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

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}