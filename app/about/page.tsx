import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, ShieldCheck, Zap, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About — Redline",
  description: "Why Redline exists and the principles it's built on.",
};

const PRINCIPLES = [
  {
    icon: Zap,
    title: "No setup tax",
    body: "No account, no workspace to configure, no team to invite. Open a tab and send a request.",
  },
  {
    icon: Eye,
    title: "Show the real bytes",
    body: "Status, headers, timing, body — exactly what came back, not a summarized version of it.",
  },
  {
    icon: ShieldCheck,
    title: "Honest about data",
    body: "What's stored, where, and for how long is documented, not buried — see the Privacy Policy.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">About</p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-balance sm:text-5xl">
        Built for the moment you need to see what actually happened.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        Redline started from a familiar annoyance: needing to fire off one API request
        or peek at one webhook payload, and not wanting to open a heavyweight app, sign
        in, and create a workspace just to do it.
      </p>

      <div className="mt-14 flex flex-col gap-8">
        <h2 className="font-display text-2xl font-medium tracking-tight">
          Two tools, one job: show you the truth
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          The <strong className="text-foreground">API Tester</strong> sends your request
          from Redline&apos;s server so CORS never gets in the way, then hands back the
          real status code, headers, timing, and body — no guessing, no client-side
          workarounds. The{" "}
          <strong className="text-foreground">Webhook Debugger</strong> gives you a
          disposable inbox URL and captures everything sent to it in real time, exactly
          as it arrived. Neither one asks who you are first.
        </p>
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {PRINCIPLES.map(({ icon: Icon, title, body }) => (
          <div key={title} className="flex flex-col gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
            <Icon className="size-5 text-primary" />
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 flex flex-wrap items-center gap-4 border-t border-border pt-10">
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
      </div>
    </div>
  );
}
