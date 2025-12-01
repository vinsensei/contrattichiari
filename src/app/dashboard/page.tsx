"use client";

import { useEffect, useRef, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import Link from "next/link";
import ContractUploadForm from "@/components/ContractUploadForm";
import HeaderPrivate from "@/components/HeaderPrivate";
import { gaEvent } from "@/lib/gtag";

type ContractAnalysisRow = {
  id: string;
  created_at: string;
  from_slug: string | null;
  analysis_json: {
    tipo_contratto?: string | null;
    valutazione_rischio?: string | null;
    motivazione_rischio?: string | null;
    [key: string]: any;
  } | null;
};

export default function DashboardPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [loadingUser, setLoadingUser] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [currentPeriodEnd, setCurrentPeriodEnd] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasTrackedActivationRef = useRef(false);

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
          .select("plan, is_active, current_period_end")
          .eq("user_id", user.id)
          .maybeSingle();

        if (subError) {
          console.error("Errore nel recupero abbonamento:", subError);
        }

        if (sub) {
          setPlan((sub.plan as any) ?? "free");
          setIsActive(sub.is_active ?? false);
          setCurrentPeriodEnd(sub.current_period_end ?? null);
        } else {
          setPlan("free");
          setIsActive(false);
        }

        // carica ultime analisi
        const { data: analysesData, error: analysesError } = await supabase
          .from("contract_analyses")
          .select("id, created_at, from_slug, analysis_json")
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

  // GA4: traccia attivazione abbonamento quando diventa attivo
  useEffect(() => {
    if (isActive && !hasTrackedActivationRef.current) {
      gaEvent("subscription_activated", {
        plan,
        source: "dashboard",
      });
      hasTrackedActivationRef.current = true;
    }
  }, [isActive, plan]);

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
        .select("id, created_at, from_slug, analysis_json")
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

  const baseDropzoneClasses =
    "relative rounded-2xl border border-dashed px-6 py-6 text-center shadow-sm transition";
  const inactiveClasses =
    "border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100";
  const activeClasses = "border-sky-400 bg-sky-50";

  return (
    <>
      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <HeaderPrivate
          userEmail={userEmail}
          planLabel={planLabel}
          plan={plan}
          isActive={isActive}
          currentPeriodEnd={currentPeriodEnd}
          onLogout={handleLogout}
        />

        {/* Main */}
        <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
          {/* Blocco upload */}

          <ContractUploadForm
            bottomLeftText="Analisi da area personale · accesso completo con il tuo piano"
            bottomRightText={
              plan === "free"
                ? "Free: 1 sola analisi. Aggiorna per averne di più."
                : "Piano standard e Pro: analisi illimitate."
            }
            onAnalyze={async (file) => {
              if (!userId) {
                throw new Error(
                  "Utente non trovato, effettua nuovamente il login."
                );
              }

              const formData = new FormData();
              formData.append("file", file);
              formData.append("userId", userId);

              const res = await fetch("/api/contracts/analyze", {
                method: "POST",
                body: formData,
              });

              const data = await res.json();

              if (!res.ok) {
                if (data.code === "FREE_LIMIT_REACHED") {
                  router.push("/pricing");
                  return;
                } else if (data.code === "NO_TEXT_IN_PDF") {
                  throw new Error(
                    "Non siamo riusciti a leggere testo dal PDF. Se è una scansione, l’OCR arriverà in una prossima versione."
                  );
                } else if (data.code === "SUB_INACTIVE") {
                  throw new Error(
                    "Il tuo abbonamento non è attivo. Aggiorna il piano per continuare a usare il servizio."
                  );
                } else {
                  throw new Error(data.error || "Errore durante l’analisi.");
                }
              }

              // refresh storico
              const { data: analysesData } = await supabase
                .from("contract_analyses")
                .select("id, created_at, from_slug, analysis_json")
                .eq("user_id", userId)
                .order("created_at", { ascending: false })
                .limit(5);

              setAnalyses(analysesData || []);
            }}
          />

          {/* Storico analisi */}
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">
                Le tue ultime analisi
              </h2>
              <Link
                href="/dashboard/analyses"
                className="text-xs font-medium text-slate-700 underline-offset-2 hover:underline"
              >
                Vedi tutte
              </Link>
            </div>

            {loadingAnalyses ? (
              <p className="text-sm text-slate-500">Caricamento analisi…</p>
            ) : analyses.length === 0 ? (
              <p className="text-sm text-slate-500">
                Non hai ancora analizzato nessun contratto.
              </p>
            ) : (
              <ul className="space-y-3">
                {analyses.map((a) => {
                  const aj = a.analysis_json || {};
                  const tipoContratto =
                    aj.tipo_contratto ||
                    a.from_slug ||
                    "Contratto senza titolo";
                  const valutazioneRischio = aj.valutazione_rischio || null;
                  const motivazioneRischio =
                    aj.motivazione_rischio ||
                    "Analisi disponibile. Apri il dettaglio per maggiori informazioni.";
                  return (
                    <li key={a.id}>
                      <Link
                        href={`/analysis/${a.id}`}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between border border-slate-100 rounded-xl px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-900">
                              {tipoContratto}
                            </span>
                            {riskBadge(valutazioneRischio)}
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-2">
                            {motivazioneRischio}
                          </p>
                          <p className="text-xs text-slate-400">
                            {new Date(a.created_at).toLocaleString("it-IT")}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </main>
      </div>
    </>
  );
}
