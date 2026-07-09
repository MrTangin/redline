"use client";

import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-28 pb-32 sm:pt-36 sm:pb-40">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-144 w-5xl -translate-x-1/2 rounded-full opacity-[0.15] blur-3xl"
        style={{
          background:
            "conic-gradient(from 90deg, oklch(0.78 0.14 300), oklch(0.82 0.12 210), oklch(0.85 0.11 25), oklch(0.78 0.14 300))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative mx-auto flex max-w-4xl flex-col items-start">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-flex items-center rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
        >
          MIT licensed · installs only what you use
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="font-display text-6xl leading-[0.95] font-medium tracking-tight text-balance sm:text-8xl"
        >
          Next<span className="text-pearl-gradient">Pearl</span>Js
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
        >
          The modular Next.js starter that installs only what you use. Database, auth,
          analytics, and monitoring are one command away — and completely absent until
          you ask for them.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Button size="lg" nativeButton={false} render={<a href="#quickstart" />}>
            Get Started
            <ArrowRight className="size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<a href="#" target="_blank" rel="noopener noreferrer" />}
          >
            View on GitHub
            <ArrowUpRight className="size-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
