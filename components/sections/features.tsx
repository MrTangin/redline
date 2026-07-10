"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, Radio, Send } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const testerPoints = [
  "Any method — GET, POST, PUT, PATCH, DELETE, or a custom verb",
  "Custom headers, query params, and a raw or JSON body",
  "Routed through a server-side proxy, so CORS is never the blocker",
  "Status, timing, response size, headers, and body, all inline",
  "Recent requests are saved to your browser — reload without losing history",
];

const webhookPoints = [
  "One click creates a disposable inbox with a unique ingest URL",
  "Point Stripe, GitHub, Twilio, or your own backend at it",
  "Requests land live — full method, headers, query string, and body",
  "History is stored server-side, so it survives a page reload",
  "No signup: the unique URL itself is the access control",
];

const feedRows = [
  { method: "POST", source: "stripe", path: "/in/8f3a21", time: "just now" },
  { method: "POST", source: "github", path: "/in/8f3a21", time: "12s ago" },
  { method: "GET", source: "healthcheck", path: "/in/8f3a21", time: "1m ago" },
  { method: "POST", source: "twilio", path: "/in/8f3a21", time: "3m ago" },
];

export function Features() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl"
      >
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          Two tools
        </span>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
          Built for the two moments you actually reach for raw HTTP.
        </h2>
      </motion.div>

      {/* API Tester */}
      <div className="mt-20 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Send className="size-4 text-primary" />
            API Tester
          </div>
          <h3 className="mt-3 font-display text-2xl font-medium tracking-tight sm:text-3xl">
            Build a request, fire it, read every byte back.
          </h3>
          <ul className="mt-6 flex flex-col gap-3">
            {testerPoints.map((point) => (
              <li key={point} className="flex gap-2.5 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2.5} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/tester"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Open the API Tester
            <ArrowRight className="size-3.5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="overflow-hidden rounded-xl border border-border bg-card shadow-lg"
        >
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="rounded-md bg-primary/15 px-2 py-1 font-mono text-xs font-semibold text-primary">
              POST
            </span>
            <span className="truncate font-mono text-xs text-muted-foreground">
              https://api.example.com/v1/checkout/sessions
            </span>
          </div>

          <Tabs defaultValue="headers" className="p-4">
            <TabsList>
              <TabsTrigger value="headers">Headers</TabsTrigger>
              <TabsTrigger value="body">Body</TabsTrigger>
              <TabsTrigger value="response">Response</TabsTrigger>
            </TabsList>

            <TabsContent value="headers" className="mt-4 font-mono text-xs leading-relaxed">
              <div className="flex justify-between gap-4 py-1 text-muted-foreground">
                <span>Content-Type</span>
                <span className="text-foreground/80">application/json</span>
              </div>
              <div className="flex justify-between gap-4 py-1 text-muted-foreground">
                <span>Authorization</span>
                <span className="text-foreground/80">Bearer sk_test_•••••</span>
              </div>
              <div className="flex justify-between gap-4 py-1 text-muted-foreground">
                <span>Idempotency-Key</span>
                <span className="text-foreground/80">6b2f-91ac</span>
              </div>
            </TabsContent>

            <TabsContent value="body" className="mt-4">
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-foreground/90">
{`{
  "amount": 4200,
  "currency": "usd",
  "customer": "cus_9f2k1"
}`}
              </pre>
            </TabsContent>

            <TabsContent value="response" className="mt-4">
              <div className="mb-3 flex items-center gap-3 font-mono text-xs">
                <span className="rounded-full bg-success/15 px-2 py-0.5 font-medium text-success">
                  200 OK
                </span>
                <span className="text-muted-foreground">142ms · 1.2 kB</span>
              </div>
              <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-foreground/90">
{`{
  "status": "succeeded",
  "latency_ms": 142
}`}
              </pre>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Webhook Debugger */}
      <div className="mt-24 grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="order-2 overflow-hidden rounded-xl border border-border bg-card shadow-lg lg:order-1"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
              <Radio className="size-3.5" />
              redline.dev/webhooks/in/8f3a21
            </span>
            <span className="flex items-center gap-1.5 font-mono text-[11px] text-success">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              live
            </span>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {feedRows.map((row, i) => (
              <div
                key={`${row.source}-${i}`}
                className="flex items-center justify-between px-4 py-3 font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      row.method === "POST"
                        ? "w-10 text-orange-400"
                        : "w-10 text-muted-foreground"
                    }
                  >
                    {row.method}
                  </span>
                  <span className="text-foreground/80">{row.source}</span>
                </div>
                <span className="text-muted-foreground">{row.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="order-1 lg:order-2"
        >
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Radio className="size-4 text-accent" />
            Webhook Debugger
          </div>
          <h3 className="mt-3 font-display text-2xl font-medium tracking-tight sm:text-3xl">
            A live inbox for anything that can POST a webhook.
          </h3>
          <ul className="mt-6 flex flex-col gap-3">
            {webhookPoints.map((point) => (
              <li key={point} className="flex gap-2.5 text-sm text-muted-foreground">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.5} />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/webhooks"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          >
            Open the Webhook Debugger
            <ArrowRight className="size-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
