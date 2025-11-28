"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export function CheckoutConfirmClient() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const sessionId = searchParams.get("session_id");

    if (checkout === "success" && sessionId) {
      (async () => {
        try {
          await fetch(`/api/stripe/confirm?session_id=${sessionId}`, {
            method: "POST",
          });
        } catch (e) {
          console.error("Errore conferma abbonamento:", e);
        } finally {
          // pulisco l'URL dai parametri
          const url = new URL(window.location.href);
          url.searchParams.delete("checkout");
          url.searchParams.delete("session_id");
          window.history.replaceState({}, "", url.toString());
        }
      })();
    }
  }, [searchParams]);

  return null;
}