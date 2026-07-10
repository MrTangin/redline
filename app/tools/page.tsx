import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, KeyRound, Radio, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Tools — Redline",
  description:
    "API Tester, Webhook Debugger, JWT Decoder, and Timestamp Converter — free, no account needed.",
};

const TOOLS = [
  {
    href: "/tester",
    icon: Send,
    name: "API Tester",
    tagline: "Send a request, see the real response",
    body: "Build a request — method, headers, body — send it through Redline's CORS-free proxy, and inspect the exact status, headers, timing, and body that came back.",
  },
  {
    href: "/webhooks",
    icon: Radio,
    name: "Webhook Debugger",
    tagline: "Watch webhooks land in real time",
    body: "Spin up a disposable inbox with its own unique URL, point any webhook provider at it, and see every request arrive live — method, headers, body, all of it.",
  },
  {
    href: "/jwt",
    icon: KeyRound,
    name: "JWT Decoder",
    tagline: "Decode, inspect, and verify a token",
    body: "Paste a JWT to see its header and payload, check its expiry at a glance, and verify HMAC signatures — decoded entirely in your browser.",
  },
  {
    href: "/timestamp",
    icon: Clock,
    name: "Timestamp Converter",
    tagline: "Unix timestamps, human-readable",
    body: "Convert between Unix time and readable dates in either direction, with ISO 8601, UTC, and your local timezone shown side by side.",
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 sm:py-20">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Tools</p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-balance sm:text-5xl">
        Pick your tool
      </h1>
      <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
        Free, no account needed. Jump into any of them.
      </p>

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {TOOLS.map(({ href, icon: Icon, name, tagline, body }) => (
          <Link
            key={href}
            href={href}
            className="group flex flex-col gap-4 rounded-2xl bg-card p-7 ring-1 ring-foreground/10 transition-all hover:-translate-y-0.5 hover:ring-primary/40"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="font-display text-xl font-medium tracking-tight">{name}</h2>
              <p className="text-sm font-medium text-muted-foreground">{tagline}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
            <span className="mt-auto flex items-center gap-1.5 text-sm font-medium text-primary">
              Open {name}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
