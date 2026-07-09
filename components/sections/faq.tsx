"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do I need Cloudflare or Vercel specifically?",
    a: "No. This template targets default Next.js hosting — Vercel is the path of least resistance, but nothing here depends on a specific host beyond standard Next.js deployment. Adapters for other targets are explicitly out of scope for this version.",
  },
  {
    q: "What if I want to add a module later?",
    a: "Run pnpm run add:<module> — e.g. pnpm run add:auth. It installs that module's packages, scaffolds its files, and flips its flag in lib/project.config.ts, without touching anything you've already built or any other module.",
  },
  {
    q: "What if I don't need a database at all?",
    a: "Leave modules.database as false. server/db/ never gets created, @supabase/supabase-js never gets installed, and no Supabase env var is ever required. The app runs fully public with no database dependency.",
  },
  {
    q: "Why Hono instead of plain Next.js route handlers?",
    a: "Hono gives cleaner route composition, middleware, and RPC-style type safety than scattering logic across many app/api/**/route.ts files — while still being mounted through Next.js's own hosting and routing via the hono/vercel adapter.",
  },
];

export function Faq() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-display text-3xl font-medium tracking-tight sm:text-4xl"
      >
        Frequently asked
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-10"
      >
        <Accordion>
          {faqs.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  );
}
