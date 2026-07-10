#!/usr/bin/env node
// Interactive first-run wizard: `pnpm run setup`.
// Asks yes/no for each optional module; installs + scaffolds every "yes",
// touches nothing for every "no". Safe to re-run — modules already enabled
// are simply skipped.
import { existsSync } from "node:fs";
import { path, promptYesNo, readProjectConfig, writeProjectConfig } from "./modules/lib.mjs";

const MODULES = [
  {
    key: "database",
    label: "Database (Supabase)",
    installer: () => import("./modules/add-database.mjs"),
  },
  {
    key: "auth",
    label: "Auth (Clerk)",
    installer: () => import("./modules/add-auth.mjs"),
  },
  {
    key: "analytics",
    label: "Analytics (PostHog)",
    installer: () => import("./modules/add-analytics.mjs"),
  },
  {
    key: "monitoring",
    label: "Monitoring (Sentry)",
    installer: () => import("./modules/add-monitoring.mjs"),
  },
];

async function main() {
  if (!existsSync(path("node_modules"))) {
    console.error("Run `pnpm install` first.");
    process.exit(1);
  }

  console.log("Redline setup\n");
  console.log("Answer yes/no for each optional module. A \"no\" installs nothing —");
  console.log("no package, no config file, no env var required.\n");

  const existing = readProjectConfig();
  const answers = { ...existing };

  for (const mod of MODULES) {
    if (existing[mod.key]) {
      console.log(`${mod.label}: already enabled, skipping.`);
      answers[mod.key] = true;
      continue;
    }
    answers[mod.key] = await promptYesNo(`Enable ${mod.label}?`, false);
  }

  console.log("");

  for (const mod of MODULES) {
    if (answers[mod.key] && !existing[mod.key]) {
      const { install } = await mod.installer();
      await install();
    }
  }

  // Safety net: guarantee project.config.ts reflects every answer, even if
  // a module's install() didn't run (e.g. answered "no").
  writeProjectConfig(answers);

  console.log("Setup complete. Run `pnpm dev` to start the app.");
  if (Object.values(answers).some(Boolean)) {
    console.log("Fill in any blank values in .env.local before starting modules that need them.");
  }
}

await main();
