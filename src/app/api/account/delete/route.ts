import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    // 1) Parsing body sicuro (gestisce anche body vuoto)
    let userId: string | undefined;

    try {
      const rawBody = await req.text();
      if (rawBody) {
        const parsed = JSON.parse(rawBody);
        userId = parsed.userId;
      }
    } catch (parseErr) {
      console.error("[ACCOUNT DELETE] JSON parse error:", parseErr);
    }

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    // 2) Best-effort cleanup delle tabelle che referenziano l'utente
    //    (anche se hai ON DELETE CASCADE, questo non fa male)
    try {
      // Se hai altre tabelle legate a user_id, aggiungile qui
      await supabase
        .from("contract_analyses")
        .delete()
        .eq("user_id", userId);

      await supabase
        .from("user_subscriptions")
        .delete()
        .eq("user_id", userId);
    } catch (cleanupErr) {
      console.error("[ACCOUNT DELETE] errore nel cleanup relazioni:", cleanupErr);
      // Non facciamo return: proviamo comunque a cancellare l'utente
    }

    // 3) Elimina l’utente da auth.users
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("[ACCOUNT DELETE] errore deleteUser:", deleteError);

      const status =
        typeof (deleteError as any).status === "number"
          ? (deleteError as any).status
          : 500;

      const code = (deleteError as any).code ?? "unexpected_failure";

      return NextResponse.json(
        {
          error: "Errore durante l’eliminazione dell’account.",
          code,
        },
        { status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[ACCOUNT DELETE] errore inatteso:", err);
    return NextResponse.json(
      { error: "Errore interno durante l’eliminazione dell’account." },
      { status: 500 }
    );
  }
}