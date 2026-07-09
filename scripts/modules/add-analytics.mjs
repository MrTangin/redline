// Enables the analytics module (PostHog). Run standalone via
// `pnpm run add:analytics`, or imported and called by scripts/setup.mjs.
import {
  isMainModule,
  path,
  pnpmAdd,
  promptText,
  readProjectConfig,
  regenerateProvidersFile,
  upsertEnvLocal,
  writeFile,
  writeProjectConfig,
} from "./lib.mjs";
import { existsSync } from "node:fs";

export async function install({ prompt = true } = {}) {
  console.log("\n[add:analytics] Installing PostHog...");

  pnpmAdd(["posthog-js"]);

  writeFile(
    "components/providers/posthog-provider.tsx",
    `"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";

/**
 * NEXT_PUBLIC_ vars are read directly (not via lib/env.ts) so the bundler
 * can statically inline them into the client bundle. lib/env.ts still
 * validates they're present at server startup via instrumentation.ts.
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!posthog.__loaded) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: true,
      });
    }
  }, []);

  return <PHProvider client={posthog}>{children}</PHProvider>;
}
`,
  );

  if (prompt) {
    console.log("\nEnter your PostHog project credentials (from Project Settings).");
    console.log("Leave blank to fill in .env.local manually later.\n");
    const NEXT_PUBLIC_POSTHOG_KEY = await promptText("NEXT_PUBLIC_POSTHOG_KEY");
    const NEXT_PUBLIC_POSTHOG_HOST = await promptText("NEXT_PUBLIC_POSTHOG_HOST", {
      defaultValue: "https://us.i.posthog.com",
    });
    upsertEnvLocal({ NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST });
  }

  const modules = readProjectConfig();
  modules.analytics = true;
  writeProjectConfig(modules);
  regenerateProvidersFile(modules);

  console.log("[add:analytics] Done. PostHog is now enabled.\n");
}

if (isMainModule(import.meta.url)) {
  if (!existsSync(path("node_modules"))) {
    console.error("Run `pnpm install` first.");
    process.exit(1);
  }
  await install();
}
