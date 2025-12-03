import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const admin = supabaseAdmin();

    // 1) Leggo header Authorization
    const h = await headers();
    const authHeader = h.get("authorization") || h.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();

    // 2) Verifico il token lato server
    const { data: userData, error: getUserError } =
      await admin.auth.getUser(accessToken);

    if (getUserError || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = userData.user.id;

    // 3) Aggiorno last_activity_at
    const { error: updateError } = await admin
      .from("user_meta")
      .update({ last_activity_at: new Date().toISOString() })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Errore update last_activity_at:", updateError);
      return NextResponse.json(
        { error: "Errore aggiornamento attività" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Errore inatteso in /api/user/activity:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}