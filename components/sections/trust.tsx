"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";

const points = [
  {
    title: "No account, ever",
    body: "Open either tool and start immediately. For webhooks, the unique inbox URL is the access control — treat it like a secret, and delete the inbox when you're done.",
  },
  {
    title: "API history stays local",
    body: "Recent requests in the API Tester live in your browser's localStorage. They never touch our servers beyond the one request you asked us to send.",
  },
  {
    title: "Webhook history is server-side, on purpose",
    body: "Captured requests are stored so you can inspect them after the event fires — that's the point of a debugger. Clear an inbox and its history is gone with it.",
  },
  {
    title: "Requests to private networks are blocked",
    body: "The proxy refuses localhost, private IP ranges, and link-local addresses, so the tester can't be pointed at internal infrastructure — yours or anyone else's.",
  },
];

export function Trust() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24 sm:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="font-display text-3xl font-medium tracking-tight sm:text-4xl"
      >
        Free, and honest about how it works
      </motion.h2>

      <ul className="mt-12 flex flex-col gap-8">
        {points.map((point, i) => (
          <motion.li
            key={point.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="flex gap-4"
          >
            <span className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-foreground text-background">
              <Check className="size-3.5" strokeWidth={2.5} />
            </span>
            <div>
              <h3 className="font-medium">{point.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{point.body}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
