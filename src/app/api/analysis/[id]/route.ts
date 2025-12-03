import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = supabaseAdmin();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    // 1) Auth: leggo token dal header
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

    // 2) Recupero analisi, assicurandomi che sia dell'utente
    const { data, error } = await admin
      .from("contract_analyses")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Errore fetch analysis by id:", error);
      return NextResponse.json(
        { error: "Errore nel caricamento dell'analisi" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Analisi non trovata" }, { status: 404 });
    }

    return NextResponse.json({ analysis: data });
  } catch (err) {
    console.error("Errore inatteso in GET /api/analysis/[id]:", err);
    return NextResponse.json({ error: "Errore interno" }, { status: 500 });
  }
}