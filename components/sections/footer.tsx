import Link from "next/link";

const COLUMNS = [
  {
    heading: "Product",
    links: [
      { href: "/tools", label: "All Tools" },
      { href: "/tester", label: "API Tester" },
      { href: "/webhooks", label: "Webhook Debugger" },
      { href: "/jwt", label: "JWT Decoder" },
      { href: "/timestamp", label: "Timestamp Converter" },
    ],
  },
  {
    heading: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/behind-the-scenes", label: "Behind the Scenes" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/security", label: "Security Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <div className="grid gap-10 sm:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="relative flex h-6 w-1.5 overflow-hidden rounded-full bg-shadow-grey-800">
                <span className="absolute inset-x-0 bottom-0 h-3 bg-primary" />
              </span>
              <span className="font-display text-base font-semibold tracking-tight">
                Redline
              </span>
            </Link>
            <p className="max-w-2xs text-sm leading-relaxed text-muted-foreground">
              A free API tester and webhook debugger. No account, no setup, no signup.
            </p>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading} className="flex flex-col gap-3">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {column.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Redline. MIT licensed.</span>
          <span>Built for the moment you need to see what actually happened.</span>
        </div>
      </div>
    </footer>
  );
}
