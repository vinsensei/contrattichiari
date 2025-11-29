// src/lib/supabaseClient.ts
import { createBrowserClient, createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

let browserClient: SupabaseClient<any> | null = null;

export function supabaseBrowser(): SupabaseClient<any> {
  if (!browserClient) {
    browserClient = createBrowserClient(
      supabaseUrl,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || supabaseAnonKey
    );
  }
  return browserClient;
}

export function supabaseAdmin(): SupabaseClient<any> {
  return createServerClient(
    supabaseUrl,
    supabaseServiceRoleKey,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // no-op for admin client (not cookie-based)
        },
      },
    }
  );
}