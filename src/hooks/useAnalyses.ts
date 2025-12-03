"use client";

import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/lib/supabaseClient";

export type AnalysisItem = {
  id: string;
  file_name: string;
  status: "pending" | "processing" | "completed" | "failed";
  created_at: string;
  completed_at: string | null;
  summary: string | null;
};

export function useAnalyses() {
  const [data, setData] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = supabaseAdmin();

  useEffect(() => {
    let mounted = true;

    async function fetchAnalyses() {
      setLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        setError("Non sei autenticato.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/analyses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Errore nel caricamento dello storico.");
        setLoading(false);
        return;
      }

      const body = (await res.json()) as { analyses: AnalysisItem[] };
      if (mounted) {
        setData(body.analyses || []);
        setLoading(false);
      }
    }

    fetchAnalyses();

    return () => {
      mounted = false;
    };
  }, []);

  return { analyses: data, loading, error };
}