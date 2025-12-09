"use client";

import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "granted");
    setVisible(false);
    window.location.reload(); // ricarica per attivare GA4
  }

  function reject() {
    localStorage.setItem("cookie-consent", "denied");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] md:w-[480px] bg-white border border-zinc-200 shadow-lg rounded-xl p-4 z-50">
      <p className="text-sm text-zinc-700 mb-3">
        Usiamo cookie tecnici e cookie analitici (Google Analytics 4) per
        migliorare il servizio. Puoi accettare o rifiutare liberamente.
      </p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={reject}
          className="px-4 py-1.5 text-sm bg-zinc-200 text-black rounded-lg hover:bg-zinc-300"
        >
          Rifiuta
        </button>
        <button
          onClick={accept}
          className="px-4 py-1.5 text-sm bg-zinc-900 text-white rounded-lg hover:bg-zinc-800"
        >
          Accetta
        </button>
      </div>
    </div>
  );
}