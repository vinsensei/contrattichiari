import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
} as any);

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const metadata = session.metadata || {};
    const userId = metadata.userId;
    const plan = (metadata.plan as "standard" | "pro") || "standard";

    if (!userId) {
      console.error("[CONFIRM] Missing userId in session.metadata", metadata);
      return NextResponse.json(
        { error: "Missing userId in metadata" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { error } = await supabase
      .from("user_subscriptions")
      .upsert(
        {
          user_id: userId,
          plan,
          is_active: true,
        },
        { onConflict: "user_id" }
      );

    if (error) {
      console.error("[CONFIRM] Supabase upsert error:", error);
      return NextResponse.json(
        { error: "Database error" },
        { status: 500 }
      );
    }

    console.log("[CONFIRM] Subscription activated for user:", userId, plan);

    return NextResponse.json({ ok: true, plan });
  } catch (err) {
    console.error("[CONFIRM] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}