"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import HeaderPrivate from "@/components/HeaderPrivate";
import Link from "next/link";

export default function AccountPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<"free" | "standard" | "pro">("free");
  const [isActive, setIsActive] = useState(false);

  const [loading, setLoading] = useState(true);
  const [billingLoading, setBillingLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          console.error("Errore nel recupero utente:", userError);
          router.replace("/login");
          return;
        }

        if (!user) {
          router.replace("/login");
          return;
        }

        setUserEmail(user.email ?? null);
        setUserId(user.id);

        const { data: sub, error: subError } = await supabase
          .from("user_subscriptions")
          .select("plan, is_active")
          .eq("user_id", user.id)
          .maybeSingle();

        if (subError) {
          console.error("Errore nel recupero abbonamento:", subError);
        }

        if (sub) {
          setPlan((sub.plan as any) ?? "free");
          setIsActive(sub.is_active ?? false);
        } else {
          setPlan("free");
          setIsActive(false);
        }
      } catch (e) {
        console.error("Errore imprevisto nel caricamento account:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [supabase, router]);

  const planLabel =
    plan === "free"
      ? "Free (1 analisi)"
      : plan === "standard"
      ? "Standard"
      : "Pro";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const handleOpenBillingPortal = async () => {
    setErrorMsg(null);

    if (!userId) {
      setErrorMsg("Impossibile determinare l'utente. Riprova più tardi.");
      return;
    }

    setBillingLoading(true);

    try {
      console.log("[PORTAL] chiamo API con userId:", userId);

      const res = await fetch("/api/stripe/portal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Errore apertura portale:", text);
        throw new Error("Impossibile aprire l’area fatturazione.");
      }

      const data = (await res.json()) as { url: string };
      window.location.href = data.url;
    } catch (err: any) {
      console.error("[PORTAL] errore lato client:", err);
      setErrorMsg(err.message ?? "Errore apertura area fatturazione");
      setBillingLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setErrorMsg(null);

    if (!userId) {
      setErrorMsg("Impossibile determinare l'utente. Riprova più tardi.");
      return;
    }

    const confirmDelete = window.confirm(
      "Sei sicuro di voler eliminare il tuo account? L’operazione è definitiva e rimuoverà anche le analisi salvate."
    );
    if (!confirmDelete) return;

    setDeleting(true);

    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("[ACCOUNT DELETE] errore:", text);
        throw new Error("Errore durante l’eliminazione dell’account.");
      }

      // utente eliminato lato Supabase → porta alla home
      window.location.href = "/";
    } catch (err: any) {
      console.error("[ACCOUNT DELETE] errore lato client:", err);
      setErrorMsg(
        err.message ?? "Errore durante l’eliminazione dell’account."
      );
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Caricamento…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderPrivate
        userEmail={userEmail}
        planLabel={planLabel}
        plan={plan}
        isActive={isActive}
        onLogout={handleLogout}
      />

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">
            Il mio profilo
          </h1>
          <Link
            href="/dashboard"
            className="text-xs text-slate-700 underline-offset-2 hover:underline"
          >
            Torna alla dashboard
          </Link>
        </div>

        <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-2">
          <h2 className="text-sm font-semibold text-slate-900">Dati account</h2>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Email:</span> {userEmail}
          </p>
          <p className="text-sm text-slate-700">
            <span className="font-medium">Piano attuale:</span> {planLabel}{" "}
            {plan !== "free" && !isActive && (
              <span className="text-xs text-amber-600"> (non attivo)</span>
            )}
          </p>
        </section>

        <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100 space-y-3">
          <h2 className="text-sm font-semibold text-slate-900">
            Abbonamento e fatture
          </h2>
          <p className="text-sm text-slate-600">
            Gestisci il tuo abbonamento, aggiorna il metodo di pagamento e
            scarica le fatture dal portale Stripe.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <button
              type="button"
              onClick={handleOpenBillingPortal}
              disabled={billingLoading}
              className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {billingLoading
                ? "Apertura area fatturazione…"
                : "Apri area fatturazione"}
            </button>
            <Link
              href="/pricing"
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              Cambia piano
            </Link>
          </div>
        </section>

        <section className="rounded-2xl border border-rose-200 bg-rose-50 p-6 shadow-sm space-y-3">
          <h2 className="text-sm font-semibold text-rose-900">
            Elimina account
          </h2>
          <p className="text-sm text-rose-800">
            L’eliminazione dell’account rimuoverà definitivamente i tuoi dati,
            incluse le analisi dei contratti. L’operazione non può essere
            annullata.
          </p>
          <button
            type="button"
            onClick={handleDeleteAccount}
            disabled={deleting}
            className="rounded-full border border-rose-500 px-4 py-2 text-xs font-medium text-rose-900 hover:bg-rose-100 disabled:opacity-60"
          >
            {deleting ? "Eliminazione in corso…" : "Elimina account"}
          </button>
        </section>

        {errorMsg && <p className="text-sm text-red-600 pt-1">{errorMsg}</p>}
      </main>
    </div>
  );
}