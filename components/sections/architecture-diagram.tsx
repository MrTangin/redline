"use client";

import { motion } from "motion/react";
import { ArrowRight, Globe, Layers, Route, Zap, Database } from "lucide-react";

const nodes = [
  { icon: Globe, label: "Browser", sub: null },
  { icon: Layers, label: "Next.js", sub: "App Router" },
  { icon: Route, label: "/app/api/[[...route]]", sub: "hono/vercel adapter" },
  { icon: Zap, label: "Hono", sub: "route composition" },
];

export function ArchitectureDiagram() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-14 max-w-2xl"
      >
        <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Request flow
        </h2>
        <p className="mt-4 text-muted-foreground">
          One API surface, hosted entirely by Next.js. The Supabase branch only exists when
          the database module is enabled.
        </p>
      </motion.div>

      <div className="flex flex-col items-stretch gap-3 lg:flex-row lg:items-center lg:justify-between">
        {nodes.map(({ icon: Icon, label, sub }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className="flex items-center gap-3"
          >
            <div className="flex min-w-[11rem] flex-1 flex-col items-center gap-2 rounded-xl border border-border bg-card px-5 py-6 text-center lg:flex-none">
              <Icon className="size-5" strokeWidth={1.5} />
              <span className="text-sm font-medium">{label}</span>
              {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
            </div>
            {i < nodes.length - 1 && (
              <ArrowRight className="hidden size-5 shrink-0 text-muted-foreground lg:block" />
            )}
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: nodes.length * 0.08 }}
          className="flex items-center gap-3"
        >
          <ArrowRight className="size-5 shrink-0 rotate-90 text-muted-foreground lg:rotate-0" />
          <div className="flex min-w-[11rem] flex-1 flex-col items-center gap-2 rounded-xl border border-dashed border-border bg-transparent px-5 py-6 text-center lg:flex-none">
            <Database className="size-5 text-muted-foreground" strokeWidth={1.5} />
            <span className="text-sm font-medium text-muted-foreground">Supabase</span>
            <span className="text-xs text-muted-foreground/70">only if database is enabled</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
