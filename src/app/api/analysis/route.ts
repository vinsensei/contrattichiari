import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET() {
  try {
    const admin = supabaseAdmin();

    const h = await headers();
    const authHeader = h.get("authorization") || h.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Missing auth token" }, { status: 401 });
    }

    const accessToken = authHeader.replace("Bearer ", "").trim();

    const { data: userData, error: getUserError } =
      await admin.auth.getUser(accessToken);

    if (getUserError || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = userData.user.id;

    const { data, error } = await admin
      .from("analyses")
      .select("id, file_name, status, created_at, completed_at, summary")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Errore fetch analyses:", error);
      return NextResponse.json({ error: "Errore caricamento storico" }, { status: 500 });
    }

    return NextResponse.json({ analyses: data ?? [] });
  } catch (err) {
    console.error("Errore inatteso in /api/analyses:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}