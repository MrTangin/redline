import { createClient } from "@supabase/supabase-js";
import { getDatabaseEnv } from "@/lib/env";

/**
 * Anon-key client. SUPABASE_URL/SUPABASE_ANON_KEY are server-only env vars
 * (no NEXT_PUBLIC_ prefix), so import this from Server Components, Route
 * Handlers, or Server Actions — not from "use client" components.
 */
export const supabase = createClient(
  getDatabaseEnv().SUPABASE_URL,
  getDatabaseEnv().SUPABASE_ANON_KEY,
);
