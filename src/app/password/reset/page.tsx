"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function ResetInner() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // token che hai generato e mandato via email nel link
  const token = searchParams?.get("token") || "";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError(
        "Link non valido o mancante. Richiedi di nuovo il reset della password."
      );
      return;
    }

    if (password !== passwordConfirm) {
      setError("Le password non coincidono.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/password/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Impossibile aggiornare la password.");
      } else {
        setMessage(
          "Password aggiornata con successo. Ora puoi effettuare il login."
        );
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setError("Errore imprevisto. Riprova più tardi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      {/* Colonna sinistra: logo + form */}
      <div className="flex w-full md:w-1/2 flex-col justify-center px-6 py-10 md:px-12">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-3 text-center">
            <a href="/" className="inline-flex items-center">
              <img
                src="/logo_email.png"
                alt="ContrattiChiari"
                className="h-13 w-auto"
              />
            </a>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Reimposta la password
            </p>
          </div>

          <div className="w-full bg-white rounded-2xl shadow-md p-8 space-y-6 border border-slate-100">
            <h1 className="text-2xl font-semibold text-slate-900">
              Imposta una nuova password
            </h1>

            {!token && (
              <p className="mb-4 text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                Attenzione: il link sembra non contenere un token valido.
                Richiedi di nuovo il reset della password.
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Nuova password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Conferma nuova password
                </label>
                <input
                  type="password"
                  required
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full rounded-lg bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "Aggiornamento..." : "Aggiorna password"}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Colonna destra: placeholder */}
      <div className="hidden md:block md:w-1/2 bg-slate-200">
        <div className="h-full w-full" />
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetInner />
    </Suspense>
  );
}