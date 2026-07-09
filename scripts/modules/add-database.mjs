// Enables the database module (Supabase). Run standalone via
// `pnpm run add:database`, or imported and called by scripts/setup.mjs.
import {
  isMainModule,
  path,
  pnpmAdd,
  promptText,
  readProjectConfig,
  upsertEnvLocal,
  writeFile,
  writeProjectConfig,
} from "./lib.mjs";
import { existsSync } from "node:fs";

export async function install({ prompt = true } = {}) {
  console.log("\n[add:database] Installing Supabase...");

  pnpmAdd(["@supabase/supabase-js", "server-only"]);

  writeFile(
    "server/db/client.ts",
    `import { createClient } from "@supabase/supabase-js";
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
`,
  );

  writeFile(
    "server/db/admin.ts",
    `import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getDatabaseEnv } from "@/lib/env";

/**
 * Service-role client — bypasses row-level security. The "server-only"
 * import makes it a build error to import this from client code.
 */
export const supabaseAdmin = createClient(
  getDatabaseEnv().SUPABASE_URL,
  getDatabaseEnv().SUPABASE_SERVICE_ROLE_KEY,
);
`,
  );

  if (prompt) {
    console.log("\nEnter your Supabase project credentials (from Project Settings > API).");
    console.log("Leave blank to fill in .env.local manually later.\n");
    const SUPABASE_URL = await promptText("SUPABASE_URL");
    const SUPABASE_ANON_KEY = await promptText("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = await promptText("SUPABASE_SERVICE_ROLE_KEY");
    upsertEnvLocal({ SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY });
  }

  const modules = readProjectConfig();
  modules.database = true;
  writeProjectConfig(modules);

  console.log("[add:database] Done. Supabase is now enabled.\n");
}

if (isMainModule(import.meta.url)) {
  if (!existsSync(path("node_modules"))) {
    console.error("Run `pnpm install` first.");
    process.exit(1);
  }
  await install();
}
