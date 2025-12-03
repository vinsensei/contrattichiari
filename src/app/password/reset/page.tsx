"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = supabaseBrowser();

  // opzionale: controllo che type=recovery sia presente nell'URL
  const type = searchParams?.get("type");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== passwordConfirm) {
      setError("Le password non coincidono.");
      return;
    }

    setLoading(true);

    const { data: userData, error: getUserError } = await supabase.auth.getUser();

    if (getUserError || !userData?.user) {
      setLoading(false);
      setError(
        "Link non valido o scaduto. Richiedi di nuovo il reset della password."
      );
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setMessage("Password aggiornata con successo. Ora puoi effettuare il login.");
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="text-2xl font-semibold mb-4">Imposta una nuova password</h1>

      {type !== "recovery" && (
        <p className="mb-4 text-sm text-yellow-700">
          Attenzione: il link sembra non essere un link di recupero password.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Nuova password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Conferma nuova password
          </label>
          <input
            type="password"
            required
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {message && <p className="text-sm text-green-600">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-primary px-4 py-2 text-white text-sm font-medium disabled:opacity-50"
        >
          {loading ? "Aggiornamento..." : "Aggiorna password"}
        </button>
      </form>
    </div>
  );
}