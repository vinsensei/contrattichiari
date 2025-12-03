import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { sendInactivityEmail } from "@/lib/emails";

const DAYS_1 = 7;   // primo reminder
const DAYS_2 = 30;  // secondo reminder

export async function GET() {
  try {
    const admin = supabaseAdmin();

    // 1) Utenti inattivi da >7 giorni, mai contattati (level 0)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - DAYS_1);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - DAYS_2);

    // NB: facciamo due query separate per semplicità

    // Primo livello: > 7 giorni, level = 0
    const { data: level0, error: level0Err } = await admin
      .from("user_meta")
      .select("user_id, last_activity_at, inactivity_email_level")
      .lte("last_activity_at", sevenDaysAgo.toISOString())
      .eq("inactivity_email_level", 0)
      .is("is_blocked", false);

    if (level0Err) {
      console.error("Errore fetch livello 0:", level0Err);
    }

    // Secondo livello: > 30 giorni, level = 1
    const { data: level1, error: level1Err } = await admin
      .from("user_meta")
      .select("user_id, last_activity_at, inactivity_email_level")
      .lte("last_activity_at", thirtyDaysAgo.toISOString())
      .eq("inactivity_email_level", 1)
      .is("is_blocked", false);

    if (level1Err) {
      console.error("Errore fetch livello 1:", level1Err);
    }

    const toNotify = [
      ...(level0 || []).map((u) => ({ ...u, level: 0 })),
      ...(level1 || []).map((u) => ({ ...u, level: 1 })),
    ];

    // Recupero email utenti
    const userIds = toNotify.map((u) => u.user_id);
    const { data: users, error: usersError } = await admin.auth.admin.listUsers();
    if (usersError) {
      console.error("Errore listUsers:", usersError);
    }

    // mapping user_id -> email
    const emailById = new Map<string, string>();
    users?.users?.forEach((u) => {
      if (u.id && u.email) emailById.set(u.id, u.email);
    });

    // Invio email + update livello
    for (const item of toNotify) {
      const email = emailById.get(item.user_id);
      if (!email) continue;

      try {
        await sendInactivityEmail(email, item.level);

        // aggiorno livello e last_inactivity_email_at
        const { error: updateErr } = await admin
          .from("user_meta")
          .update({
            inactivity_email_level: item.level + 1,
            last_inactivity_email_at: new Date().toISOString(),
          })
          .eq("user_id", item.user_id);

        if (updateErr) {
          console.error("Errore update inactivity_email_level:", updateErr);
        }
      } catch (e) {
        console.error("Errore sendInactivityEmail:", e);
      }
    }

    return NextResponse.json({
      success: true,
      processed: toNotify.length,
    });
  } catch (err) {
    console.error("Errore inatteso in /api/cron/inactivity-reminder:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}