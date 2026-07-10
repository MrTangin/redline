"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, Radio } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border bg-grid-faint px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-56 -right-56 h-144 w-144 rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "conic-gradient(from 90deg, var(--color-scarlet-rush-500), var(--color-orange-500), var(--color-scarlet-rush-700), var(--color-scarlet-rush-500))",
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="flex flex-col items-start">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
            free · no signup · no credit card
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="font-display text-5xl leading-[0.98] font-medium tracking-tight text-balance sm:text-7xl"
          >
            Send the request.
            <br />
            See what comes <span className="text-redline-gradient">back</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-8 max-w-lg text-lg leading-relaxed text-muted-foreground"
          >
            Redline is a free API tester and webhook debugger for the moment you need to
            see the actual bytes — status, headers, timing, body — without configuring
            another workspace first.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Link href="/tester" className={cn(buttonVariants({ size: "lg" }), "gap-2 px-5")}>
              Open the API Tester
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/webhooks"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }), "gap-2 px-5")}
            >
              Open the Webhook Debugger
              <ArrowUpRight className="size-4" />
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-5 font-mono text-xs text-muted-foreground"
          >
            no account · nothing to install · works in one tab
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:mx-0"
        >
          {/* Webhook feed card, offset behind */}
          <div className="absolute -right-6 -bottom-8 w-[90%] rotate-3 rounded-xl border border-border bg-card/80 p-4 shadow-xl backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <Radio className="size-3" />
                webhooks/in/8f3a21
              </span>
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
            </div>
            <div className="flex flex-col gap-2 font-mono text-[11px]">
              <div className="flex items-center justify-between rounded-md bg-muted/60 px-2 py-1.5">
                <span className="text-success">POST</span>
                <span className="text-muted-foreground">stripe · 2s ago</span>
              </div>
              <div className="flex items-center justify-between rounded-md bg-muted/60 px-2 py-1.5">
                <span className="text-success">POST</span>
                <span className="text-muted-foreground">github · 41s ago</span>
              </div>
            </div>
          </div>

          {/* API response terminal card, in front */}
          <div className="relative rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-scarlet-rush-500" />
                <span className="size-2.5 rounded-full bg-orange-500" />
                <span className="size-2.5 rounded-full bg-shadow-grey-600" />
              </div>
              <span className="rounded-full bg-success/15 px-2 py-0.5 font-mono text-[11px] font-medium text-success">
                200 OK
              </span>
            </div>
            <div className="space-y-3 p-4 font-mono text-[12px] leading-relaxed">
              <p className="text-muted-foreground">
                <span className="text-orange-400">POST</span> /v1/checkout/sessions
              </p>
              <pre className="overflow-x-auto text-foreground/90">
{`{
  "status": "succeeded",
  "amount": 4200,
  "currency": "usd",
  "latency_ms": 142
}`}
              </pre>
              <div className="flex items-center gap-4 border-t border-border pt-3 text-muted-foreground">
                <span>142ms</span>
                <span>1.2 kB</span>
                <span>12 headers</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
