// src/lib/trackActivity.ts
"use client";

import { supabaseBrowser } from "@/lib/supabaseClient";

/**
 * Traccia un'attività dell'utente aggiornando last_activity_at.
 * Non lancia errori verso la UI: logga solo in console se qualcosa va storto.
 *
 * Da usare SOLO in componenti client (login, register, upload, ecc).
 */
export async function trackActivity() {
  // safety: non eseguire mai lato server
  if (typeof window === "undefined") {
    return;
  }

  const supabase = supabaseBrowser();

  try {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    if (sessionError) {
      console.warn("[trackActivity] Errore getSession:", sessionError.message);
      return;
    }

    const accessToken = sessionData.session?.access_token;

    if (!accessToken) {
      console.warn("[trackActivity] Nessun access token, utente non loggato.");
      return;
    }

    const res = await fetch("/api/user/activity", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.warn(
        "[trackActivity] Errore risposta API:",
        res.status,
        body?.error
      );
    }
  } catch (err) {
    console.error("[trackActivity] Errore inatteso:", err);
  }
}