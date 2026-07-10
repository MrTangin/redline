import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Security Policy — Redline",
  description: "How Redline protects the API Tester proxy and Webhook Debugger data.",
};

export default function SecurityPage() {
  return (
    <LegalPageShell title="Security Policy" updated="July 9, 2026">
      <LegalSection heading="The proxy is guarded against SSRF">
        <p>
          The API Tester sends your request from Redline&apos;s server, not your
          browser — that&apos;s what lets it bypass CORS. To stop that from being
          abused to reach internal infrastructure, every target URL is checked before
          the request is made: requests to localhost, loopback, private (RFC 1918),
          and link-local addresses — including the cloud metadata IP — are rejected
          outright, both by literal address and by resolving the hostname&apos;s DNS
          first.
        </p>
      </LegalSection>

      <LegalSection heading="Webhook inboxes are locked down by default">
        <p>
          Webhook data is stored with row-level security enabled and zero access
          policies defined. In practice, that means the public/anonymous database
          credential has no access to inbox data at all — reads and writes only happen
          through a separate, privileged credential that lives on Redline&apos;s server
          and is never sent to the browser or included in any client-side code. It is
          also excluded from version control.
        </p>
      </LegalSection>

      <LegalSection heading="An inbox's URL is its access control">
        <p>
          There are no accounts, so a webhook inbox is protected the same way a
          well-known tool like webhook.site protects one: by a long, random,
          unguessable ID. Anyone with that ID (or the inbox&apos;s URL) can view its
          captured requests — don&apos;t share an inbox link anywhere you wouldn&apos;t
          want its contents seen, and delete the inbox when you&apos;re done with it.
        </p>
      </LegalSection>

      <LegalSection heading="Treat captured data as sensitive">
        <p>
          A captured webhook request is stored exactly as received, including every
          header. If the service you&apos;re testing sends authorization tokens, API
          keys, or other secrets in its webhook calls, those will be visible in your
          inbox. Clear or delete the inbox once you&apos;re done, and avoid pointing
          production traffic containing real secrets at a debugging tool for longer
          than necessary.
        </p>
      </LegalSection>

      <LegalSection heading="Transport security">
        <p>
          In production, Redline is served over HTTPS. Requests the API Tester proxies
          on your behalf use HTTPS whenever the target URL specifies it.
        </p>
      </LegalSection>

      <LegalSection heading="Reporting a vulnerability">
        <p>
          If you find a security issue — a way around the SSRF guard, a way to access
          another inbox&apos;s data, or anything else — please report it via the{" "}
          <a href="/contact" className="text-primary underline-offset-4 hover:underline">
            Contact
          </a>{" "}
          page rather than filing a public issue. We&apos;ll follow up as quickly as we
          can.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
