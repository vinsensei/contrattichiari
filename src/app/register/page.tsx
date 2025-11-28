// src/app/register/page.tsx
'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseClient';

export default function RegisterPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.replace('/dashboard');
        return;
      }
      setCheckingSession(false);
    };
    check();
  }, []);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // dove mandare il magic link / conferma
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;

      // niente redirect: mostriamo il messaggio di conferma
      setEmailSent(true);
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Errore durante la registrazione');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Caricamento…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 space-y-6">
        <h1 className="text-2xl font-semibold text-slate-900">Crea un account</h1>

        {emailSent ? (
          <div className="space-y-3">
            <p className="text-sm text-slate-700">
              Ti abbiamo inviato una email di verifica a <strong>{email}</strong>.
            </p>
            <p className="text-sm text-slate-600">
              Clicca sul link nella email per abilitare il tuo account.
              Dopo la conferma verrai portato direttamente alla dashboard.
            </p>
          </div>
        ) : (
          <>
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
                <p className="text-sm text-red-600">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-slate-900 text-white py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
              >
                {loading ? 'Attendere...' : 'Registrati'}
              </button>
            </form>

            <p className="text-center text-sm text-slate-600">
              Hai già un account?{' '}
              <a href="/login" className="text-slate-900 underline font-medium">
                Accedi
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}