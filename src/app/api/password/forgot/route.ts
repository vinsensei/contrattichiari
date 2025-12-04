// src/app/api/password/forgot/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { sendPasswordResetEmail } from "@/lib/emails";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email non valida" }, { status: 400 });
    }

    const admin = supabaseAdmin();

    // 1. Trova utente per email
    const { data: userList, error: userError } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      email
    } as any); // tipizzazione un po' rognosa, ma funziona

    if (userError) {
      console.error("Errore listUsers:", userError);
      // Risposta generica per non leakare info
      return NextResponse.json(
        {
          message:
            "Se l'indirizzo è corretto, ti abbiamo inviato un'email con le istruzioni per il reset.",
        },
        { status: 200 }
      );
    }

    const user = userList?.users?.[0];
    if (!user) {
      // Risposta comunque 200 (per non dire se l'email esiste o no)
      return NextResponse.json(
        {
          message:
            "Se l'indirizzo è corretto, ti abbiamo inviato un'email con le istruzioni per il reset.",
        },
        { status: 200 }
      );
    }

    // 2. Genera token + hash
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 ora di validità

    // 3. Salva in tabella
    const { error: insertError } = await admin
      .from("password_reset_tokens")
      .insert({
        user_id: user.id,
        token_hash: tokenHash,
        expires_at: expiresAt.toISOString(),
      });

    if (insertError) {
      console.error("Errore insert reset token:", insertError);
      return NextResponse.json(
        { error: "Errore interno" },
        { status: 500 }
      );
    }

    // 4. Costruisci link reset
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const resetLink = `${baseUrl.replace(/\/+$/, "")}/password/reset?token=${token}`;

    // 5. Invia email
    await sendPasswordResetEmail(email, resetLink);

    return NextResponse.json(
      {
        message:
          "Se l'indirizzo è corretto, ti abbiamo inviato un'email con il link per reimpostare la password.",
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Errore in /api/password/forgot:", err);
    return NextResponse.json(
      { error: "Errore interno" },
      { status: 500 }
    );
  }
}