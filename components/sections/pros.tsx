"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";

const pros = [
  {
    title: "No dead dependencies",
    body: "A disabled module installs nothing — not a stub, not a lazy-loaded no-op. Your package.json only ever lists what you actually use.",
  },
  {
    title: "Type-safe API layer, still on Next.js hosting",
    body: "Hono gives cleaner route composition and RPC-style type safety than scattered route handlers, without giving up Next.js's routing and deployment story.",
  },
  {
    title: "Real instrumentation from day one, opt-in",
    body: "PostHog and Sentry are a command away when you need product analytics or error tracking — and genuinely absent in the meantime.",
  },
  {
    title: "Consistent, ownable UI",
    body: "shadcn/ui components are copied into the repo, not hidden behind a package boundary — every project forked from this template looks and feels the same.",
  },
  {
    title: "One command to add a module later",
    body: "pnpm run add:auth (or database, analytics, monitoring) works on a project that started without it — no re-scaffolding, no touching unrelated modules.",
  },
];

export function Pros() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-display text-3xl font-medium tracking-tight sm:text-4xl"
      >
        Why this template
      </motion.h2>

      <ul className="mt-12 flex flex-col gap-8">
        {pros.map((pro, i) => (
          <motion.li
            key={pro.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex gap-4"
          >
            <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
              <Check className="size-3.5" strokeWidth={2.5} />
            </span>
            <div>
              <h3 className="font-medium">{pro.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{pro.body}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
