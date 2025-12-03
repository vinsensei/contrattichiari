import { supabaseAdmin } from "@/lib/supabaseClient";

/**
 * Traccia un'attività dell'utente aggiornando last_activity_at.
 * Non lancia errori verso la UI: logga solo in console se qualcosa va storto.
 */
export async function trackActivity() {
    const supabase = supabaseAdmin();
    try {
        const { data: sessionData } = await supabase.auth.getSession();
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