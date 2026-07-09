"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Switch } from "@/components/ui/switch";

type ModuleDemo = {
  key: string;
  label: string;
  pkg: string;
  file: string;
};

const modules: ModuleDemo[] = [
  { key: "database", label: "Database (Supabase)", pkg: "@supabase/supabase-js", file: "server/db/client.ts" },
  { key: "auth", label: "Auth (Clerk)", pkg: "@clerk/nextjs", file: "proxy.ts" },
  { key: "analytics", label: "Analytics (PostHog)", pkg: "posthog-js", file: "components/providers/posthog-provider.tsx" },
  { key: "monitoring", label: "Monitoring (Sentry)", pkg: "@sentry/nextjs", file: "sentry.server.config.ts" },
];

export function ModularByDesign() {
  const [state, setState] = useState<Record<string, boolean>>({
    database: false,
    auth: true,
    analytics: false,
    monitoring: false,
  });

  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Modular by design
          </h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Every optional module reads from one file — <code className="rounded bg-muted px-1.5 py-0.5 text-sm">lib/project.config.ts</code>.
            Flip it off and the module doesn&apos;t just hide: its package leaves{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-sm">package.json</code>, its
            provider stops mounting, and its files disappear. Nothing runs in a broken
            half-state — an enabled module with a missing env var throws a clear error at
            startup instead of failing silently.
          </p>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Try the toggles — this mirrors what actually happens when you run{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">pnpm run add:auth</code> (etc).
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-2"
        >
          {modules.map((mod) => {
            const enabled = state[mod.key];
            return (
              <div
                key={mod.key}
                className="flex items-center justify-between gap-4 border-b border-border/60 px-4 py-4 last:border-b-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{mod.label}</span>
                  </div>
                  <AnimatePresence mode="wait">
                    {enabled ? (
                      <motion.p
                        key="on"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 truncate font-mono text-xs text-muted-foreground"
                      >
                        + {mod.pkg} · {mod.file}
                      </motion.p>
                    ) : (
                      <motion.p
                        key="off"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="mt-1 text-xs text-muted-foreground/60"
                      >
                        not installed
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={(v) => setState((s) => ({ ...s, [mod.key]: v }))}
                />
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
