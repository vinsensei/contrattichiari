"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import Link from "next/link";
import { CheckoutConfirmClient } from "./CheckoutConfirmClient";

type ContractAnalysisRow = {
  id: string;
  tipo_contratto: string | null;
  valutazione_rischio: string | null;
  motivazione_rischio: string | null;
  created_at: string;
};

export default function DashboardPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [loadingUser, setLoadingUser] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [analyses, setAnalyses] = useState<ContractAnalysisRow[]>([]);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);

  const [plan, setPlan] = useState<"free" | "standard" | "pro">("free");
  const [isActive, setIsActive] = useState(false);

  // 1) Controlla utente e carica piano + storico (con gestione errori)
  useEffect(() => {
    const loadUserAndData = async () => {
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

        // carica piano
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

        // carica ultime analisi
        const { data: analysesData, error: analysesError } = await supabase
          .from("contract_analyses")
          .select(
            "id, tipo_contratto, valutazione_rischio, motivazione_rischio, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (analysesError) {
          console.error("Errore nel recupero analisi:", analysesError);
        }

        setAnalyses(analysesData || []);
      } catch (e) {
        console.error("Errore imprevisto nel caricamento dashboard:", e);
      } finally {
        setLoadingAnalyses(false);
        setLoadingUser(false);
      }
    };

    loadUserAndData();
  }, [supabase, router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    setAnalysisError(null);

    if (!file) {
      setAnalysisError("Seleziona un PDF prima di analizzare.");
      return;
    }
    if (!userId) {
      setAnalysisError("Utente non trovato, effettua nuovamente il login.");
      return;
    }

    setAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userId);

      const res = await fetch("/api/contracts/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        // gestione semplice errori noti
        if (data.code === "FREE_LIMIT_REACHED") {
          router.push("/pricing");
          return;

          // in futuro: router.push('/pricing');
        } else if (data.code === "NO_TEXT_IN_PDF") {
          setAnalysisError(
            "Non siamo riusciti a leggere testo dal PDF. Se è una scansione, l’OCR arriverà in una prossima versione."
          );
        } else if (data.code === "SUB_INACTIVE") {
          setAnalysisError(
            "Il tuo abbonamento non è attivo. Aggiorna il piano per continuare a usare il servizio."
          );
        } else {
          setAnalysisError(data.error || "Errore durante l’analisi.");
        }
        return;
      }

      // refresh storico
      const { data: analysesData } = await supabase
        .from("contract_analyses")
        .select(
          "id, tipo_contratto, valutazione_rischio, motivazione_rischio, created_at"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);

      setAnalyses(analysesData || []);
      setFile(null);
    } catch (err) {
      console.error(err);
      setAnalysisError("Errore imprevisto durante l’analisi.");
    } finally {
      setAnalyzing(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Caricamento…</p>
      </div>
    );
  }

  const riskBadge = (risk: string | null) => {
    if (!risk) return null;
    const base =
      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium";
    if (risk === "alto")
      return (
        <span className={`${base} bg-red-100 text-red-700`}>Rischio alto</span>
      );
    if (risk === "medio")
      return (
        <span className={`${base} bg-amber-100 text-amber-700`}>
          Rischio medio
        </span>
      );
    return (
      <span className={`${base} bg-emerald-100 text-emerald-700`}>
        Rischio basso
      </span>
    );
  };

  const planLabel =
    plan === "free"
      ? "Free (1 analisi)"
      : plan === "standard"
      ? "Standard"
      : "Pro";

  return (
    <>
      <CheckoutConfirmClient />

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white">
          <div className="text-lg font-semibold text-slate-900">
            Contratti Chiari
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-700">
            <div className="flex flex-col items-end">
              {userEmail && <span className="font-medium">{userEmail}</span>}
              <span className="text-xs text-slate-500">
                Piano: {planLabel}
                {!isActive && plan !== "free" && " (non attivo)"}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-xs"
            >
              Esci
            </button>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
          {/* Blocco upload */}
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <h1 className="text-xl font-semibold text-slate-900 mb-1">
              Analizza un nuovo contratto
            </h1>
            <p className="text-sm text-slate-600 mb-4">
              Carica un PDF. Leggeremo il contratto e ti restituiremo un’analisi
              chiara, con le clausole critiche evidenziate.
            </p>

            <form onSubmit={handleAnalyze} className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="text-sm"
                />
                <button
                  type="submit"
                  disabled={analyzing}
                  className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  {analyzing ? "Analisi in corso…" : "Analizza contratto"}
                </button>
              </div>

              {analysisError && (
                <p className="text-sm text-red-600">{analysisError}</p>
              )}

              {plan === "free" && (
                <p className="text-xs text-slate-500">
                  Con il piano Free puoi effettuare una sola analisi.
                  Successivamente potrai passare a un piano a pagamento per
                  analisi illimitate.
                </p>
              )}
            </form>
          </section>

          {/* Storico analisi */}
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Le tue ultime analisi
              </h2>
              {/* In futuro: link allo storico completo */}
            </div>

            {loadingAnalyses ? (
              <p className="text-sm text-slate-500">Caricamento analisi…</p>
            ) : analyses.length === 0 ? (
              <p className="text-sm text-slate-500">
                Non hai ancora analizzato nessun contratto.
              </p>
            ) : (
              <ul className="space-y-3">
                {analyses.map((a) => (
                  <li key={a.id}>
                    <Link
                      href={`/analysis/${a.id}`}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-slate-100 rounded-xl px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-slate-900">
                            {a.tipo_contratto || "Contratto senza titolo"}
                          </span>
                          {riskBadge(a.valutazione_rischio)}
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {a.motivazione_rischio ||
                            "Analisi disponibile. Apri il dettaglio per maggiori informazioni."}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(a.created_at).toLocaleString("it-IT")}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>
      </div>
  </>
  );
}
