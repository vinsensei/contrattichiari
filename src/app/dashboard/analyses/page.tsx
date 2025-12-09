"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import HeaderPrivate from "@/components/HeaderPrivate";
import Link from "next/link";
import type { Metadata } from "next";

type ContractAnalysisRow = {
  id: string;
  created_at: string;
  from_slug: string | null;
  source: string | null;
  is_full_unlocked: boolean | null;
  analysis_json: {
    tipo_contratto?: string | null;
    valutazione_rischio?: string | null;
    motivazione_rischio?: string | null;
    [key: string]: any;
  } | null;
};

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};


export default function AnalysesListPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();

  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<"free" | "standard" | "pro">("free");
  const [isActive, setIsActive] = useState(false);

  const [analyses, setAnalyses] = useState<ContractAnalysisRow[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAnalyses, setLoadingAnalyses] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

        // piano
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

        setLoadingUser(false);

        // tutte le analisi
        const { data: analysesData, error: analysesError } = await supabase
          .from("contract_analyses")
          .select("id, created_at, from_slug, source, is_full_unlocked, analysis_json")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (analysesError) {
          console.error("Errore nel recupero analisi:", analysesError);
        }

        setAnalyses(analysesData || []);
      } catch (e) {
        console.error("Errore imprevisto nel caricamento analisi:", e);
      } finally {
        setLoadingAnalyses(false);
      }
    };

    load();
  }, [supabase, router]);

  if (loadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-500">Caricamento…</p>
      </div>
    );
  }

  const planLabel =
    plan === "free"
      ? "Free (1 analisi)"
      : plan === "standard"
      ? "Standard"
      : "Pro";

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

  const filteredAnalyses = analyses.filter((a) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    const aj = a.analysis_json || {};
    const tipoContratto = (
      aj.tipo_contratto ||
      a.from_slug ||
      "Contratto senza titolo"
    )
      .toString()
      .toLowerCase();

    const motivazioneRischio = (aj.motivazione_rischio || "")
      .toString()
      .toLowerCase();

    return (
      tipoContratto.includes(q) ||
      motivazioneRischio.includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderPrivate
        userEmail={userEmail}
        planLabel={planLabel}
        plan={plan}
        isActive={isActive}
        onLogout={async () => {
          await supabase.auth.signOut();
          router.replace("/login");
        }}
      />

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-slate-900">
            Le mie analisi
          </h1>
          <Link
            href="/dashboard"
            className="text-xs text-slate-700 underline-offset-2 hover:underline"
          >
            Torna alla dashboard
          </Link>
        </div>
        <div className="mt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cerca per tipo di contratto o motivazione…"
            className="w-full sm:max-w-xs rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>

        <section className="bg-white rounded-2xl shadow-sm p-6 border border-slate-100">
          {loadingAnalyses ? (
            <p className="text-sm text-slate-500">Caricamento analisi…</p>
          ) : analyses.length === 0 ? (
            <p className="text-sm text-slate-500">
              Non hai ancora analizzato nessun contratto.
            </p>
          ) : filteredAnalyses.length === 0 && searchQuery.trim() ? (
            <p className="text-sm text-slate-500">
              Nessun risultato per &quot;{searchQuery.trim()}&quot;.
            </p>
          ) : (
            <ul className="space-y-3">
              {filteredAnalyses.map((a) => {
                const aj = a.analysis_json || {};
                const tipoContratto =
                  aj.tipo_contratto ||
                  a.from_slug ||
                  "Contratto senza titolo";
                const valutazioneRischio = aj.valutazione_rischio || null;
                const motivazioneRischio =
                  aj.motivazione_rischio ||
                  "Apri il dettaglio per vedere l’analisi completa.";
                const isLanding = a.source === "anonymous_landing";
                const isFullUnlocked = a.is_full_unlocked === true;
                const showFull = !isLanding || isFullUnlocked;

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
                        <p className="text-[11px] text-slate-500">
                          {showFull
                            ? "Analisi completa"
                            : "Versione ridotta dall’upload rapido"}
                        </p>
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
  );
}