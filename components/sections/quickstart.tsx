"use client";

import { motion } from "motion/react";

const lines: { text: string; muted?: boolean }[] = [
  { text: "$ git clone https://github.com/your-org/nextpearljs.git" },
  { text: "$ cd nextpearljs && pnpm install" },
  { text: "$ pnpm run setup" },
  { text: "" },
  { text: "NextPearlJs setup", muted: true },
  { text: "" },
  { text: "Enable Database (Supabase)? (y/N) n", muted: true },
  { text: "Enable Auth (Clerk)? (y/N) y", muted: true },
  { text: "  $ pnpm add @clerk/nextjs", muted: true },
  { text: "  wrote proxy.ts", muted: true },
  { text: "Enable Analytics (PostHog)? (y/N) n", muted: true },
  { text: "Enable Monitoring (Sentry)? (y/N) n", muted: true },
  { text: "", muted: true },
  { text: "Setup complete. Run `pnpm dev` to start the app.", muted: true },
  { text: "" },
  { text: "$ pnpm dev" },
];

export function Quickstart() {
  return (
    <section id="quickstart" className="mx-auto max-w-4xl scroll-mt-24 px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Quickstart
        </h2>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Clone, install, answer a handful of yes/no prompts, and start the dev server. Only
          the modules you say yes to ever touch <code className="rounded bg-muted px-1.5 py-0.5 text-sm">package.json</code>.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-10 overflow-hidden rounded-xl border border-border bg-[#0b0b0d]"
      >
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
          <span className="size-2.5 rounded-full bg-white/20" />
        </div>
        <pre className="overflow-x-auto px-5 py-5 font-mono text-[13px] leading-6">
          {lines.map((line, i) => (
            <div
              key={i}
              className={line.muted ? "text-white/45" : "text-white/90"}
            >
              {line.text || " "}
            </div>
          ))}
        </pre>
      </motion.div>
    </section>
  );
}
