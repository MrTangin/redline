"use client";

import { motion } from "motion/react";
import {
  Boxes,
  Zap,
  Database,
  ShieldCheck,
  BarChart3,
  Bug,
  Component,
  Wand2,
  Gem,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

type Tech = {
  name: string;
  purpose: string;
  icon: LucideIcon;
  kind: "Core" | "Optional Module";
};

const stack: Tech[] = [
  { name: "Next.js", purpose: "App Router, hosting, and routing.", icon: Boxes, kind: "Core" },
  {
    name: "Hono",
    purpose: "Type-safe API routes mounted inside Next.js.",
    icon: Zap,
    kind: "Core",
  },
  {
    name: "Supabase",
    purpose: "Managed Postgres with row-level security.",
    icon: Database,
    kind: "Optional Module",
  },
  {
    name: "Clerk",
    purpose: "Drop-in hosted auth with prebuilt UI.",
    icon: ShieldCheck,
    kind: "Optional Module",
  },
  {
    name: "PostHog",
    purpose: "Product analytics, funnels, session replay.",
    icon: BarChart3,
    kind: "Optional Module",
  },
  {
    name: "Sentry",
    purpose: "Error tracking and performance monitoring.",
    icon: Bug,
    kind: "Optional Module",
  },
  {
    name: "shadcn/ui",
    purpose: "Ownable components on Tailwind + Radix.",
    icon: Component,
    kind: "Core",
  },
  {
    name: "Framer Motion",
    purpose: "Declarative animation for React.",
    icon: Wand2,
    kind: "Core",
  },
  { name: "Lucide", purpose: "Tree-shakeable, consistent icons.", icon: Gem, kind: "Core" },
];

export function TechStackGrid() {
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
          Nine technologies, two categories
        </h2>
        <p className="mt-4 text-muted-foreground">
          Core is always there. Optional modules are one command away — and truly absent
          until you run it.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {stack.map(({ name, purpose, icon: Icon, kind }, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.06 }}
            className="flex flex-col gap-4 bg-background p-6"
          >
            <div className="flex items-center justify-between">
              <Icon className="size-5 text-foreground" strokeWidth={1.5} />
              <Badge variant={kind === "Core" ? "default" : "secondary"} className="text-[10px]">
                {kind}
              </Badge>
            </div>
            <div>
              <h3 className="font-medium">{name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{purpose}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
