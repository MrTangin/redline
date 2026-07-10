import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy — Redline",
  description: "What Redline stores, for how long, and why — in plain terms.",
};

export default function PrivacyPage() {
  return (
    <LegalPageShell title="Privacy Policy" updated="July 9, 2026">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Redline is built to need as little of your data as possible. There are no user
        accounts, so there&apos;s no profile, email, or password to store in the first
        place. This page describes exactly what the two tools do handle.
      </p>

      <LegalSection heading="API Tester">
        <p>
          When you send a request from the API Tester, your browser posts it to
          Redline&apos;s server, which makes the actual HTTP request on your behalf and
          returns the response to you. That round trip happens in server memory only —
          Redline does not write your requests, responses, headers, or bodies to any
          database.
        </p>
        <p>
          Your request history (method, URL, headers, body) is saved only in your
          browser&apos;s <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">localStorage</code>,
          capped at the last 15 requests. It never leaves your device except when you
          actively click Send, and it&apos;s gone if you clear your browser storage.
        </p>
      </LegalSection>

      <LegalSection heading="Webhook Debugger">
        <p>
          When you create an inbox, Redline generates a random, unguessable ID and
          stores it in a database. Any request sent to that inbox&apos;s ingest URL is
          captured in full — method, path, query string, all headers, the raw body, and
          the sender&apos;s IP address — and stored against that inbox ID so you can
          inspect it.
        </p>
        <p>
          That data is kept until you clear it (removes the captured requests) or delete
          the inbox (removes everything, including the inbox itself). There is currently
          no automatic expiry — it&apos;s on you to clean up inboxes you&apos;re done with.
        </p>
        <p>
          Because a captured request can contain anything a third party sends —
          including authorization headers, API keys, or other secrets embedded by
          whatever service you pointed at the inbox — treat your inbox contents as
          sensitive, and clear or delete them once you&apos;re done debugging. See the{" "}
          <a href="/security" className="text-primary underline-offset-4 hover:underline">
            Security Policy
          </a>{" "}
          for how that data is protected in the meantime.
        </p>
      </LegalSection>

      <LegalSection heading="What we don't do">
        <ul className="ml-4 flex list-disc flex-col gap-1.5">
          <li>No account creation, no login, no password to leak.</li>
          <li>No analytics or tracking scripts are currently enabled on this site.</li>
          <li>No cookies are set for tracking purposes.</li>
          <li>No selling, renting, or sharing of any captured data with third parties.</li>
        </ul>
        <p>
          If that ever changes — for example, if we turn on privacy-respecting analytics
          — this page will be updated first.
        </p>
      </LegalSection>

      <LegalSection heading="Where data lives">
        <p>
          Webhook inbox data is stored in a managed Postgres database (Supabase). Access
          is locked down at the database level: only Redline&apos;s own server can read
          or write it, using a credential that never reaches your browser. See the{" "}
          <a href="/security" className="text-primary underline-offset-4 hover:underline">
            Security Policy
          </a>{" "}
          for details.
        </p>
      </LegalSection>

      <LegalSection heading="Questions">
        <p>
          If anything here is unclear, or you want an inbox&apos;s data removed and
          can&apos;t reach it yourself, reach out via the{" "}
          <a href="/contact" className="text-primary underline-offset-4 hover:underline">
            Contact
          </a>{" "}
          page.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
