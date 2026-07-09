// Enables the auth module (Clerk). Run standalone via `pnpm run add:auth`,
// or imported and called by scripts/setup.mjs.
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
  console.log("\n[add:auth] Installing Clerk...");

  pnpmAdd(["@clerk/nextjs"]);

  writeFile(
    "proxy.ts",
    `import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\\\..*).*)", "/(api|trpc)(.*)"],
};
`,
  );

  writeFile(
    "app/(dashboard)/dashboard/layout.tsx",
    `export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-4xl px-6 py-12">{children}</div>;
}
`,
  );

  writeFile(
    "app/(dashboard)/dashboard/page.tsx",
    `import { UserButton } from "@clerk/nextjs";

/**
 * Example protected route — proxy.ts requires sign-in for everything
 * under /dashboard. Delete this once you've built your own.
 */
export default function DashboardPage() {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <UserButton />
    </div>
  );
}
`,
  );

  if (prompt) {
    console.log("\nEnter your Clerk API keys (from the Clerk dashboard > API Keys).");
    console.log("Leave blank to fill in .env.local manually later.\n");
    const NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = await promptText(
      "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
    );
    const CLERK_SECRET_KEY = await promptText("CLERK_SECRET_KEY");
    upsertEnvLocal({ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY });
  }

  const modules = readProjectConfig();
  modules.auth = true;
  writeProjectConfig(modules);
  regenerateProvidersFile(modules);

  console.log("[add:auth] Done. Clerk is now enabled — /dashboard is a protected example route.\n");
}

if (isMainModule(import.meta.url)) {
  if (!existsSync(path("node_modules"))) {
    console.error("Run `pnpm install` first.");
    process.exit(1);
  }
  await install();
}
