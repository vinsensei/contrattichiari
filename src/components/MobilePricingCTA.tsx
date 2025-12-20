"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";

export default function MobilePricingCTA() {
  const pathname = usePathname() || "";
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    const client = supabaseBrowser();

    // initial check
    client.auth.getUser().then(({ data }) => {
      setLoggedIn(!!data.user);
    });

    // keep in sync on login/logout
    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Only runs on client
    const THRESHOLD = 220;

    const update = () => {
      setIsShown(window.scrollY > THRESHOLD);
    };

    // init
    update();

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Avoid flashing while auth is being checked.
  if (loggedIn === null) return null;

  // Hide on pricing page (and any nested pricing routes).
  if (
    pathname === "/pricing" ||
    pathname.startsWith("/pricing") ||
    pathname === "/upload" ||
    pathname.startsWith("/upload")
  )
    return null;

  // Hide when the user is logged in.
  if (loggedIn) return null;

  return (
    <div
      className={
        "fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/90 backdrop-blur md:hidden transition-all duration-300 motion-reduce:transition-none " +
        (isShown
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-full opacity-0 pointer-events-none")
      }
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-col">
          <p className="text-xs font-medium text-zinc-900">
            Analizza i contratti senza rischi
          </p>
          <p className="text-[11px] leading-snug text-zinc-600">
            Abbonati e sblocca tutte le analisi
          </p>
        </div>

        <Link
          href="/pricing"
          className="shrink-0 rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-zinc-800"
        >
          Vedi prezzi
        </Link>
      </div>
    </div>
  );
}
