"use client";

import { motion } from "motion/react";
import { Radio, Send } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const testerSteps = [
  { title: "Pick a method and paste a URL", body: "Any HTTP verb, any host — no allowlist to configure first." },
  { title: "Add headers, params, or a body", body: "Raw text or JSON, with syntax that stays readable as it grows." },
  { title: "Send it through the proxy", body: "Requests are routed server-side, so browser CORS rules never get in the way." },
  { title: "Read the full response", body: "Status, timing, size, headers, and body — all in one place, instantly." },
];

const webhookSteps = [
  { title: "Create an inbox", body: "One click gives you a unique ingest URL. No form, no name required." },
  { title: "Point a provider at it", body: "Stripe, GitHub, Twilio, cron jobs, your own backend — anything that can POST." },
  { title: "Trigger an event", body: "Fire a test webhook, a real one, or just curl the URL yourself." },
  { title: "Watch it land", body: "Method, headers, query string, and body appear live, saved for when you come back." },
];

function StepList({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="flex flex-col gap-6">
      {steps.map((step, i) => (
        <motion.li
          key={step.title}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.06 }}
          className="flex gap-4"
        >
          <span className="font-mono text-sm text-muted-foreground/60 tabular-nums">
            0{i + 1}
          </span>
          <div>
            <h4 className="font-medium">{step.title}</h4>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}

export function HowItWorks() {
  return (
    <section className="border-t border-border bg-muted/20 px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl font-medium tracking-tight sm:text-4xl"
        >
          How it works
        </motion.h2>

        <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_auto_1fr] lg:gap-10">
          <div>
            <div className="mb-6 flex items-center gap-2 text-sm font-medium">
              <Send className="size-4 text-primary" />
              API Tester
            </div>
            <StepList steps={testerSteps} />
          </div>

          <Separator orientation="vertical" className="hidden lg:block" />
          <Separator className="lg:hidden" />

          <div>
            <div className="mb-6 flex items-center gap-2 text-sm font-medium">
              <Radio className="size-4 text-accent" />
              Webhook Debugger
            </div>
            <StepList steps={webhookSteps} />
          </div>
        </div>
      </div>
    </section>
  );
}
