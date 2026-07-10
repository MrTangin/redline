import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Cookie Policy — Redline",
  description: "Redline does not set tracking cookies. Here's what it uses instead.",
};

export default function CookiesPage() {
  return (
    <LegalPageShell title="Cookie Policy" updated="July 9, 2026">
      <LegalSection heading="Short version">
        <p>
          Redline does not currently set any cookies for tracking, advertising, or
          analytics. There is no cookie banner because there is nothing to consent to
          yet.
        </p>
      </LegalSection>

      <LegalSection heading="What we use instead">
        <p>
          The API Tester and Webhook Debugger use your browser&apos;s{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">localStorage</code>{" "}
          — not cookies — to remember two things locally on your device:
        </p>
        <ul className="ml-4 flex list-disc flex-col gap-1.5">
          <li>Your last 15 API Tester requests, so you can revisit them.</li>
          <li>
            A list of webhook inboxes you&apos;ve created or visited, so you can find
            your way back to them without an account.
          </li>
        </ul>
        <p>
          This data is stored only in your browser, is never transmitted to Redline
          automatically, and is cleared whenever you clear your browser&apos;s site
          data.
        </p>
      </LegalSection>

      <LegalSection heading="If that changes">
        <p>
          If Redline adds analytics or authentication in the future, either could
          introduce cookies. If that happens, this policy — and, where required, a
          consent prompt — will be updated before it ships.
        </p>
      </LegalSection>

      <LegalSection heading="Questions">
        <p>
          Reach out via the{" "}
          <a href="/contact" className="text-primary underline-offset-4 hover:underline">
            Contact
          </a>{" "}
          page.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
