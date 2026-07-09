// Enables the monitoring module (Sentry). Run standalone via
// `pnpm run add:monitoring`, or imported and called by scripts/setup.mjs.
import {
  isMainModule,
  path,
  pnpmAdd,
  promptText,
  readProjectConfig,
  regenerateInstrumentationFile,
  upsertEnvLocal,
  writeFile,
  writeProjectConfig,
} from "./lib.mjs";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

function wrapNextConfigWithSentry() {
  const configPath = path("next.config.mjs");
  const original = readFileSync(configPath, "utf8");

  if (original.includes("withSentryConfig")) return; // already wrapped

  const withImport = `import { withSentryConfig } from "@sentry/nextjs";\n\n${original}`;
  const wrapped = withImport.replace(
    /export default nextConfig;/,
    `export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
});`,
  );
  writeFileSync(configPath, wrapped, "utf8");
  console.log("  updated next.config.mjs (wrapped with withSentryConfig)");
}

export async function install({ prompt = true } = {}) {
  console.log("\n[add:monitoring] Installing Sentry...");

  pnpmAdd(["@sentry/nextjs"]);

  const sentryInitOptions = `{
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1,
  enableLogs: true,
}`;

  writeFile(
    "instrumentation-client.ts",
    `import * as Sentry from "@sentry/nextjs";

Sentry.init(${sentryInitOptions});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
`,
  );

  writeFile(
    "sentry.server.config.ts",
    `import * as Sentry from "@sentry/nextjs";

Sentry.init(${sentryInitOptions});
`,
  );

  writeFile(
    "sentry.edge.config.ts",
    `import * as Sentry from "@sentry/nextjs";

Sentry.init(${sentryInitOptions});
`,
  );

  writeFile(
    "app/global-error.tsx",
    `"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import NextError from "next/error";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  );
}
`,
  );

  wrapNextConfigWithSentry();

  if (prompt) {
    console.log("\nEnter your Sentry project details (from Settings > Projects).");
    console.log("Leave blank to fill in .env.local manually later.\n");
    const NEXT_PUBLIC_SENTRY_DSN = await promptText("NEXT_PUBLIC_SENTRY_DSN");
    const SENTRY_ORG = await promptText("SENTRY_ORG (for source map upload, optional)");
    const SENTRY_PROJECT = await promptText("SENTRY_PROJECT (for source map upload, optional)");
    const SENTRY_AUTH_TOKEN = await promptText(
      "SENTRY_AUTH_TOKEN (for source map upload, optional)",
    );
    upsertEnvLocal({
      NEXT_PUBLIC_SENTRY_DSN,
      SENTRY_ORG,
      SENTRY_PROJECT,
      SENTRY_AUTH_TOKEN,
    });
  }

  const modules = readProjectConfig();
  modules.monitoring = true;
  writeProjectConfig(modules);
  regenerateInstrumentationFile(modules);

  console.log("[add:monitoring] Done. Sentry is now enabled.\n");
}

if (isMainModule(import.meta.url)) {
  if (!existsSync(path("node_modules"))) {
    console.error("Run `pnpm install` first.");
    process.exit(1);
  }
  await install();
}
