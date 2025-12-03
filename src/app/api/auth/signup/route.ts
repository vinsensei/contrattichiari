import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseClient";
import { sendWelcomeEmail } from "@/lib/emails";

export async function POST(req: Request) {
    try {
        const admin = supabaseAdmin();

        const { email, password, captchaToken } = await req.json();

        // 1) Verifica captcha (stub per ora)
        const captchaOk = await verifyCaptcha(captchaToken);
        if (!captchaOk) {
            return NextResponse.json({ error: "Captcha non valido" }, { status: 400 });
        }

        // 2) Leggo IP + UA
        const h = await headers();
        const ip = (h.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
        const userAgent = h.get("user-agent") || "unknown";

        // 3) Rate limit: max 5 signup / 10 minuti per IP
        const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();

        const { count, error: countError } = await admin
        .from("user_meta")
        .select("*", { count: "exact", head: true })
        .eq("signup_ip", ip)
        .gte("created_at", tenMinutesAgo);

        if (countError) {
        console.error("Rate limit error:", countError);
        } else {
        const maxSignups =
            process.env.NODE_ENV === "production" ? 5 : 100; // in dev praticamente infinito

        if ((count ?? 0) >= maxSignups) {
            return NextResponse.json(
            { error: "Troppe registrazioni da questo IP. Riprova più tardi." },
            { status: 429 }
            );
        }
        }

        // 4) Crea utente in Auth
        const { data: authData, error: createError } = await admin.auth.admin.createUser({
            email,
            password,
            email_confirm: true // niente double opt-in
        });

        if (createError || !authData?.user) {
            return NextResponse.json(
            { error: createError?.message || "Errore creazione utente" },
            { status: 400 }
            );
        }

        const userId = authData.user.id;
        const emailUser = authData.user.email;


        // 5) Inserisco meta
        const { error: metaError } = await admin.from("user_meta").insert({
            user_id: userId,
            signup_ip: ip,
            signup_user_agent: userAgent,
        });

        if (metaError) {
            console.error("Errore insert user_meta:", metaError);
        }

        // 6) Email di benvenuto (non blocca la risposta se fallisce)
        if (emailUser) {
            sendWelcomeEmail(emailUser).catch((e) =>
                console.error("Errore invio welcome email:", e)
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Errore interno del server" }, { status: 500 });
    }
}

async function verifyCaptcha(token: string): Promise<boolean> {
  // TODO: integrare Turnstile/hCaptcha
  return true;
}