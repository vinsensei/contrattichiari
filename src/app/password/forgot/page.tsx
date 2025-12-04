"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch("/api/password/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            "Errore nell'invio dell'email di reset. Riprova più tardi."
        );
      } else {
        setMessage(
          data.message ||
            "Se l'indirizzo è corretto, ti abbiamo inviato un'email con il link per reimpostare la password."
        );
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
          {/* Logo + payoff */}
          <div className="space-y-3 text-center">
            <a href="/" className="inline-flex items-center">
              <img
                src="/logo_email.png"
                alt="ContrattiChiari"
                className="h-13 w-auto"
              />
            </a>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Recupero password
            </p>
          </div>

          {/* Card form */}
          <div className="w-full bg-white rounded-2xl shadow-md p-8 space-y-6 border border-slate-100">
            <h1 className="text-2xl font-semibold text-slate-900">
              Password dimenticata
            </h1>

            <p className="text-sm text-slate-600">
              Inserisci l&apos;email con cui ti sei registrato. Ti invieremo un
              link per reimpostare la password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? "Invio in corso..." : "Invia link di reset"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-600">
              Torna al{" "}
              <a
                href="/login"
                className="text-slate-900 underline font-medium"
              >
                login
              </a>
            </p>
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