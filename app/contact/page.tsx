import type { Metadata } from "next";
import { Mail, Bug, ShieldAlert, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contact — Redline",
  description: "Reach out about a bug, a security issue, or anything else.",
};

const CONTACT_EMAIL = "hello@redline.dev";

const REASONS = [
  {
    icon: MessageCircle,
    title: "General",
    body: "Feedback, a question about how something works, anything that doesn't fit below.",
    subject: "Hello",
  },
  {
    icon: Bug,
    title: "Bug report",
    body: "Something broke, or behaved differently than the docs say it should.",
    subject: "Bug report",
  },
  {
    icon: ShieldAlert,
    title: "Security",
    body: "Found a way around the SSRF guard, or a way to access another inbox's data. See the Security Policy first.",
    subject: "Security report",
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Contact</p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
        Get in touch
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
        Redline doesn&apos;t have a support ticket system — it&apos;s a small,
        independently run tool. Email is the fastest way to reach a real person, and
        every message gets read.
      </p>

      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className={cn(buttonVariants({ size: "lg" }), "mt-8 w-fit gap-2 px-5")}
      >
        <Mail className="size-4" />
        {CONTACT_EMAIL}
      </a>

      <div className="mt-14 grid gap-6 sm:grid-cols-3">
        {REASONS.map(({ icon: Icon, title, body, subject }) => (
          <a
            key={title}
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`[Redline] ${subject}`)}`}
            className="group flex flex-col gap-3 rounded-xl bg-card p-5 ring-1 ring-foreground/10 transition-colors hover:ring-primary/40"
          >
            <Icon className="size-5 text-primary" />
            <h2 className="font-medium">{title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
            <span className="mt-auto text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Email about this →
            </span>
          </a>
        ))}
      </div>

      <p className="mt-14 border-t border-border pt-8 text-sm text-muted-foreground">
        Response times vary — this is a lean, independently run project, not a company
        with a support queue. Security reports get priority.
      </p>
    </div>
  );
}
