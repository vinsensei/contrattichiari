"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = supabaseBrowser();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/password/reset`
        : undefined;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo, // il link nelle mail porterà qui
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage(
      "Se l'indirizzo è corretto, ti abbiamo inviato un'email con il link per reimpostare la password."
    );
  };

  return (
    <div className="mx-auto max-w-md py-12">
      <h1 className="text-2xl font-semibold mb-4">Password dimenticata</h1>
      <p className="mb-6 text-sm text-gray-600">
        Inserisci l&apos;email con cui ti sei registrato. Ti invieremo un link
        per reimpostare la password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {loading ? "Invio in corso..." : "Invia link di reset"}
        </button>
      </form>

      <button
        type="button"
        onClick={() => router.push("/login")}
        className="mt-4 text-sm text-gray-500 underline"
      >
        Torna al login
      </button>
    </div>
  );
}