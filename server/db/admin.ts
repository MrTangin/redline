import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getDatabaseEnv } from "@/lib/env";

/**
 * Service-role client — bypasses row-level security. Every Hono route in
 * this app uses this client rather than the anon one: webhook_bins/
 * webhook_requests have RLS enabled with zero policies (see
 * supabase/schema.sql), so the anon key has no access at all and this is
 * the only client that can read/write them. The "server-only" import makes
 * it a build error to import this from client code.
 */
export const supabaseAdmin = createClient(
  getDatabaseEnv().SUPABASE_URL,
  getDatabaseEnv().SUPABASE_SERVICE_ROLE_KEY,
);
