// src/app/api/password/reset/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || typeof token !== "string" || !password || typeof password !== "string") {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }

    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
    const admin = supabaseAdmin();

    // 1. Recupera token valido
    const { data: rows, error: selectError } = await admin
      .from("password_reset_tokens")
      .select("*")
      .eq("token_hash", tokenHash)
      .is("used_at", null)
      .limit(1);

    if (selectError) {
      console.error("Errore select reset token:", selectError);
      return NextResponse.json({ error: "Link non valido o scaduto" }, { status: 400 });
    }

    const row = rows?.[0];
    if (!row) {
      return NextResponse.json({ error: "Link non valido o scaduto" }, { status: 400 });
    }

    const now = new Date();
    const expiresAt = new Date(row.expires_at);
    if (expiresAt < now) {
      return NextResponse.json({ error: "Link scaduto" }, { status: 400 });
    }

    const userId = row.user_id as string;

    // 2. Aggiorna password via admin
    const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
      password,
    });

    if (updateError) {
      console.error("Errore updateUserById:", updateError);
      return NextResponse.json(
        { error: "Impossibile aggiornare la password" },
        { status: 500 }
      );
    }

    // 3. Marca token come usato
    await admin
      .from("password_reset_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("id", row.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Errore in /api/password/reset:", err);
    return NextResponse.json(
      { error: "Errore interno" },
      { status: 500 }
    );
  }
}