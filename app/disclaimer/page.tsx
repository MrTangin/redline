import type { Metadata } from "next";
import { LegalPageShell, LegalSection } from "@/components/legal-page-shell";

export const metadata: Metadata = {
  title: "Disclaimer — Redline",
  description: "Redline is an independent developer tool, not affiliated with the APIs you test.",
};

export default function DisclaimerPage() {
  return (
    <LegalPageShell title="Disclaimer" updated="July 9, 2026">
      <LegalSection heading="Independent tool">
        <p>
          Redline is an independent developer utility. It is not affiliated with,
          endorsed by, or connected to Stripe, GitHub, Twilio, or any other API or
          webhook provider referenced on this site as an example — those names are used
          purely to illustrate what kind of traffic the tools handle.
        </p>
      </LegalSection>

      <LegalSection heading="Accuracy of proxied responses">
        <p>
          The API Tester forwards your request to the target server and returns exactly
          what that server sends back, including its status code, headers, and body. We
          don&apos;t modify, validate, or guarantee the accuracy of third-party
          responses — you&apos;re seeing what the target API actually returned, for
          better or worse.
        </p>
      </LegalSection>

      <LegalSection heading="Not a production dependency">
        <p>
          Redline is meant for testing, debugging, and development workflows. It is not
          designed, and should not be relied on, as a component of a production system —
          for example, don&apos;t point a live production webhook permanently at a
          Redline inbox and depend on it for uptime or delivery guarantees.
        </p>
      </LegalSection>

      <LegalSection heading="Use at your own judgment">
        <p>
          You&apos;re responsible for verifying that your use of Redline complies with
          the terms of service of any API or provider you test against, and with any
          laws applicable to your use case.
        </p>
      </LegalSection>

      <LegalSection heading="Questions">
        <p>
          Reach out via the{" "}
          <a href="/contact" className="text-primary underline-offset-4 hover:underline">
            Contact
          </a>{" "}
          page if anything here needs clarifying.
        </p>
      </LegalSection>
    </LegalPageShell>
  );
}
