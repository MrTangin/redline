import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Terms of Service — Redline",
  description: "The terms for using Redline's API tester and webhook debugger.",
};

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms of Service" updated="July 9, 2026">
      <p className="text-sm leading-relaxed text-muted-foreground">
        Redline is a free tool. These terms are short on purpose — using the service
        means you agree to them.
      </p>

      <LegalSection heading="The service">
        <p>
          Redline provides two tools: an API request tester that proxies HTTP requests
          on your behalf, and a webhook debugger that captures requests sent to a
          disposable inbox URL. Both are provided &quot;as is,&quot; free of charge, with
          no account required.
        </p>
      </LegalSection>

      <LegalSection heading="Acceptable use">
        <p>You agree not to use Redline to:</p>
        <ul className="ml-4 flex list-disc flex-col gap-1.5">
          <li>
            Attack, scan, flood, or otherwise abuse a third-party endpoint or Redline
            itself.
          </li>
          <li>Attempt to reach internal/private infrastructure through the proxy (this is also blocked technically — see the Security Policy).</li>
          <li>Send or store unlawful content through a webhook inbox.</li>
          <li>Interfere with the availability of the service for other users.</li>
        </ul>
        <p>
          We reserve the right to rate-limit, block, or remove access for use that
          threatens the service or third parties.
        </p>
      </LegalSection>

      <LegalSection heading="Your responsibility for data you send">
        <p>
          You are responsible for what you choose to send through the API Tester and
          what you allow to be sent to a Webhook Debugger inbox — including any
          credentials, tokens, or personal data contained in that traffic. Redline is a
          debugging tool, not a secrets vault; don&apos;t rely on it to store anything
          long-term or highly sensitive.
        </p>
      </LegalSection>

      <LegalSection heading="No warranty">
        <p>
          Redline is provided without warranties of any kind, express or implied,
          including fitness for a particular purpose or non-infringement. We don&apos;t
          guarantee uptime, that responses proxied through the API Tester are accurate
          or unmodified in transit, or that webhook data will never be lost.
        </p>
      </LegalSection>

      <LegalSection heading="Limitation of liability">
        <p>
          To the fullest extent permitted by law, Redline and its operator aren&apos;t
          liable for any indirect, incidental, or consequential damages arising from
          your use of the service, including data loss or exposure of information you
          chose to send through it.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          The service and these terms may change as Redline evolves. Material changes
          will be reflected on this page with an updated date.
        </p>
      </LegalSection>

      <LegalSection heading="Contact">
        <p>
          Questions about these terms? Reach out via the{" "}
          <a href="/contact" className="text-primary underline-offset-4 hover:underline">
            Contact
          </a>{" "}
          page.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
