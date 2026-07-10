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
    q: "Is it actually free?",
    a: "Yes. Both the API Tester and the Webhook Debugger are free to use — no plan, no seats, no credit card, no usage cap you'll hit mid-debug.",
  },
  {
    q: "Do I need an account?",
    a: "No. Open either tool and start immediately. For the Webhook Debugger, the unique inbox URL you're given is effectively your access control — anyone with that link can see what lands in it, so don't post it somewhere public.",
  },
  {
    q: "How long is webhook history kept?",
    a: "Requests stay attached to your inbox until you clear them or delete the inbox yourself — there's no account tying an inbox to you, so treat each one as disposable and spin up a fresh inbox per integration or test run.",
  },
  {
    q: "Is it safe to test endpoints with real auth headers?",
    a: "The API Tester's proxy forwards exactly what you type — URL, headers, body — straight to the destination you specify and streams the response back; nothing is logged server-side beyond that single request/response cycle. That said, treat it like any tool you'd paste a curl command into: fine for your own services and sandbox keys, worth avoiding for production secrets you wouldn't hand to a terminal you don't control. Requests to localhost and private/internal IP ranges are blocked outright.",
  },
  {
    q: "What's the request timeout?",
    a: "20 seconds. If the target doesn't respond in time, the request is aborted and reported as a timeout rather than hanging indefinitely.",
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
