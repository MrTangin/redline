import type { Metadata } from "next";
import type { ReactNode } from "react";
import { MethodBadge } from "@/components/tester/method-badge";

export const metadata: Metadata = {
  title: "Behind the Scenes — Redline",
  description: "How Redline is actually built — architecture, API, database, and security.",
};

const TOC = [
  { id: "overview", label: "Overview" },
  { id: "stack", label: "Tech stack" },
  { id: "repo-map", label: "Repository map" },
  { id: "pages", label: "Pages & routes" },
  { id: "tester-flow", label: "The API Tester" },
  { id: "webhook-flow", label: "The Webhook Debugger" },
  { id: "api-reference", label: "API reference" },
  { id: "database", label: "Database & RLS" },
  { id: "security", label: "Security model" },
  { id: "design-system", label: "Design system" },
  { id: "navigation", label: "Navigation" },
  { id: "testing", label: "Testing" },
];

function Section({
  id,
  title,
  lede,
  children,
}: {
  id: string;
  title: string;
  lede?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="border-l-2 border-primary pl-3.5 font-display text-2xl font-medium tracking-tight">
        {title}
      </h2>
      {lede && (
        <p className="mt-1.5 max-w-xl pl-4 text-sm text-muted-foreground">{lede}</p>
      )}
      <div className="mt-6 flex flex-col gap-4 text-sm leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

function Code({ children }: { children: string }) {
  return (
    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
      {children}
    </code>
  );
}

function Pre({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 font-mono text-[12.5px] leading-relaxed text-foreground/90">
      <code>{children}</code>
    </pre>
  );
}

function Table({
  head,
  rows,
}: {
  head: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[480px] border-collapse text-[13px]">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {head.map((h) => (
              <th
                key={h}
                className="px-3.5 py-2.5 text-left text-[11px] font-medium tracking-wide text-muted-foreground uppercase"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-border last:border-none">
              {row.map((cell, j) => (
                <td key={j} className="px-3.5 py-2.5 align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-card p-5 ring-1 ring-foreground/10">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

const SWATCHES = [
  { name: "scarlet-rush-500", cls: "bg-scarlet-rush-500" },
  { name: "scarlet-rush-600", cls: "bg-scarlet-rush-600" },
  { name: "orange-500", cls: "bg-orange-500" },
  { name: "shadow-grey-950", cls: "bg-shadow-grey-950" },
  { name: "shadow-grey-800", cls: "bg-shadow-grey-800" },
  { name: "shadow-grey-50", cls: "bg-shadow-grey-50" },
];

export default function BehindTheScenesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Behind the Scenes
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight text-balance sm:text-5xl">
          How Redline is actually built
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
          Not a marketing page — an honest walkthrough of the architecture, the API, the
          database, and how the security model actually works.
        </p>
      </div>

      <div className="mt-16 grid gap-12 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-0.5">
            <p className="mb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
              On this page
            </p>
            {TOC.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="flex min-w-0 flex-col gap-16">
          <Section
            id="overview"
            title="Overview"
            lede="Four tools, one job."
          >
            <p>
              Redline is a handful of free, no-signup developer tools sharing one
              Next.js app: an <strong className="text-foreground">API Tester</strong> for
              firing one-off HTTP requests, a{" "}
              <strong className="text-foreground">Webhook Debugger</strong> for watching
              real webhook traffic land in a disposable inbox, a{" "}
              <strong className="text-foreground">JWT Decoder</strong>, and a{" "}
              <strong className="text-foreground">Timestamp Converter</strong>. None of
              them require an account — there&apos;s no auth system, no user table.
              Access to a webhook inbox is simply knowing its (unguessable) URL; the JWT
              Decoder and Timestamp Converter don&apos;t touch the server at all.
            </p>
            <p>
              The app was designed with an optional-module architecture from the start —
              pieces like sign-in or analytics can be switched on later without dragging
              in code or dependencies for the ones nobody&apos;s using. Right now, the
              only one turned on is the database, because the Webhook Debugger needs
              somewhere durable to keep captured requests.
            </p>
          </Section>

          <Section id="stack" title="Tech stack" lede="What's actually running.">
            <Table
              head={["Layer", "Choice", "Why"]}
              rows={[
                [<Code key="a">Next.js 16</Code>, "React 19, App Router, Turbopack", "Server + Client Components, one deploy"],
                [<Code key="b">Hono</Code>, "Typed API router", "Mounted under /api via a single catch-all route"],
                [<Code key="c">Supabase</Code>, "Managed Postgres", "Persists webhook inbox data across requests"],
                [<Code key="d">Tailwind v4</Code>, "CSS-first config", "Entire theme lives in one CSS file, no separate config"],
                [<Code key="e">shadcn/ui + Base UI</Code>, "Copied-in components", "Editable source, not an opaque dependency"],
                [<Code key="f">Playwright</Code>, "End-to-end tests", "Runs against a real production build — see Testing"],
              ]}
            />
          </Section>

          <Section
            id="repo-map"
            title="Repository map"
            lede="Where things live."
          >
            <Pre>{`app/
  page.tsx                  # landing page
  tools/page.tsx            # hub page — a card per tool
  tester/page.tsx           # API Tester
  webhooks/page.tsx         # create a new inbox
  webhooks/[id]/page.tsx    # a single inbox
  jwt/page.tsx              # JWT Decoder (fully client-side)
  timestamp/page.tsx        # Timestamp Converter (fully client-side)
  api/[[...route]]/route.ts # hands every /api/* request to Hono

server/
  hono/app.ts               # composes all API routes
  hono/routes/               # proxy.ts, webhooks.ts, hook.ts
  hono/lib/ssrf-guard.ts    # blocks the proxy from hitting private IPs
  db/admin.ts                # the only client allowed to touch the database

components/
  ui/                        # shadcn primitives
  sections/                  # landing-page sections
  tester/, webhooks/, jwt/, timestamp/  # each tool's own pieces

lib/
  types.ts                   # shared request/response contracts
  relative-time.ts           # bidirectional "in 3 hours" / "2 days ago"`}</Pre>
          </Section>

          <Section
            id="pages"
            title="Pages & routes"
            lede="Every route, and what owns it."
          >
            <Table
              head={["Route", "Purpose"]}
              rows={[
                [<Code key="1">/</Code>, "Landing page"],
                [<Code key="9">/tools</Code>, "Hub page — a card for each tool"],
                [<Code key="2">/tester</Code>, "API Tester"],
                [<Code key="3">/webhooks</Code>, "Create a new webhook inbox"],
                [<Code key="4">/webhooks/:id</Code>, "A single inbox — ingest URL + live capture"],
                [<Code key="10">/jwt</Code>, "JWT Decoder — fully client-side, nothing sent to a server"],
                [<Code key="11">/timestamp</Code>, "Timestamp Converter — also fully client-side"],
                [<Code key="5">/about</Code>, "Product story & principles"],
                [<Code key="6">/contact</Code>, "Ways to reach us"],
                [<Code key="7">/privacy, /terms, /disclaimer, /cookies, /security</Code>, "Legal pages"],
                [<Code key="8">/api/*</Code>, "Every backend endpoint — see API reference"],
              ]}
            />
          </Section>

          <Section
            id="tester-flow"
            title="How the API Tester works"
            lede="The round trip, from click to response panel."
          >
            <ol className="ml-4 flex list-decimal flex-col gap-2">
              <li>
                You fill in method, URL, headers, and body in the browser, then hit Send.
              </li>
              <li>
                Your browser posts that as JSON to <Code>/api/proxy</Code> — never
                straight to the target API. That&apos;s what lets Redline bypass CORS
                entirely: the request happens server-side, not in your browser.
              </li>
              <li>
                The server validates the target URL (see{" "}
                <a href="#security" className="text-primary underline-offset-4 hover:underline">
                  Security model
                </a>
                ), then makes the real request with a 20-second timeout.
              </li>
              <li>
                Status, headers, body, timing, and size come back as one JSON object and
                render in the response panel, color-coded by status class.
              </li>
              <li>
                The sent request is saved to your browser&apos;s{" "}
                <Code>localStorage</Code>, capped at 15 — the only place tester history
                lives. Redline&apos;s server never stores your requests or responses.
              </li>
            </ol>
          </Section>

          <Section
            id="webhook-flow"
            title="How the Webhook Debugger works"
            lede="The part that actually needs a database."
          >
            <ol className="ml-4 flex list-decimal flex-col gap-2">
              <li>
                Creating an inbox inserts one row into a <Code>webhook_bins</Code> table
                and returns its random ID.
              </li>
              <li>
                You get an ingest URL — <Code>/api/hook/:id</Code> — and hand it to
                whatever should send you webhooks.
              </li>
              <li>
                Any request to that URL, any method, any path, is captured in full:
                method, path, query string, every header, the raw body, and the
                sender&apos;s IP — stored against that inbox&apos;s ID. There&apos;s no
                auth on this endpoint by design; the inbox ID is the access control.
              </li>
              <li>
                The inbox page polls for new requests every few seconds and shows them
                newest-first, with a detail view for headers, query params, and body.
              </li>
              <li>
                Deleting an inbox cascades to every request captured in it, at the
                database level.
              </li>
            </ol>
          </Section>

          <Section id="api-reference" title="API reference" lede="Everything under /api.">
            <Table
              head={["Method", "Path", "Does"]}
              rows={[
                [<MethodBadge key="1" method="GET" />, <Code key="1p">/api/health</Code>, "Liveness check"],
                [<MethodBadge key="2" method="POST" />, <Code key="2p">/api/proxy</Code>, "Performs the API Tester's request, SSRF-guarded"],
                [<MethodBadge key="3" method="POST" />, <Code key="3p">/api/webhooks</Code>, "Creates an inbox"],
                [<MethodBadge key="4" method="GET" />, <Code key="4p">/api/webhooks/:id</Code>, "Inbox metadata, or 404"],
                [<MethodBadge key="5" method="GET" />, <Code key="5p">/api/webhooks/:id/requests</Code>, "Up to 200 captured requests, newest first"],
                [<MethodBadge key="6" method="DELETE" />, <Code key="6p">/api/webhooks/:id/requests</Code>, "Clears captured requests"],
                [<MethodBadge key="7" method="DELETE" />, <Code key="7p">/api/webhooks/:id</Code>, "Deletes the inbox"],
                [<MethodBadge key="8" method="ALL" />, <Code key="8p">/api/hook/:id</Code>, "The public ingest endpoint"],
              ]}
            />
          </Section>

          <Section
            id="database"
            title="Database & row-level security"
            lede="Two tables, locked down by default."
          >
            <Pre>{`webhook_bins
  id uuid primary key
  name text
  created_at, last_active_at timestamptz

webhook_requests
  id uuid primary key
  bin_id uuid references webhook_bins(id) on delete cascade
  method text, path text, query jsonb, headers jsonb
  body text, content_type text, ip text
  received_at timestamptz`}</Pre>
            <p>
              Both tables have <strong className="text-foreground">row-level security
              enabled with zero policies defined</strong>. That&apos;s deliberate: the
              public/anonymous database credential has no access to this data at all,
              full stop. Every read and write goes through a single privileged
              server-side client that bypasses RLS — there&apos;s only one trusted
              caller, so there was never a need for granular policies.
            </p>
          </Section>

          <Section
            id="security"
            title="Security model"
            lede="The mechanisms actually doing the work."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Card title="SSRF guard on the proxy">
                Every API Tester target is checked before the request fires: localhost,
                private and link-local IPs (including the cloud metadata address), and
                any hostname that <em>resolves</em> to one, are rejected — checked via a
                real DNS lookup, not just a string match.
              </Card>
              <Card title="The database credential never reaches your browser">
                It&apos;s excluded from client bundles at build time, not just by
                convention — importing it from browser-facing code fails the build
                outright.
              </Card>
              <Card title="An inbox's URL is its access control">
                No accounts means no per-user permission check — an inbox is protected
                the way a well-known tool like webhook.site protects one: a long, random,
                unguessable ID. Whoever has the link can see it.
              </Card>
              <Card title="Captured data can be sensitive">
                A webhook payload is stored exactly as received, including any auth
                headers a third party sent. Clear or delete an inbox once you&apos;re
                done with it — see the{" "}
                <a href="/security" className="text-primary underline-offset-4 hover:underline">
                  Security Policy
                </a>
                .
              </Card>
            </div>
          </Section>

          <Section
            id="design-system"
            title="Design system"
            lede="One theme file, no separate config."
          >
            <p>
              Three full color scales — scarlet, orange, and a warm neutral grey — are
              mapped onto semantic tokens (<Code>primary</Code>, <Code>background</Code>,{" "}
              <Code>destructive</Code>, and so on), plus two custom tokens for
              status-code coloring across both tools.
            </p>
            <div className="flex flex-wrap gap-3">
              {SWATCHES.map((s) => (
                <div key={s.name} className="w-24">
                  <div className={`h-11 rounded-lg ring-1 ring-foreground/10 ${s.cls}`} />
                  <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
                    {s.name}
                  </p>
                </div>
              ))}
            </div>
            <p>
              Type is three faces: a sans for body and UI, a monospace face used
              heavily for anything technical (URLs, headers, JSON), and a display serif
              reserved for statement headings rather than every heading. Every component
              under <Code>components/ui/</Code> is source in the repo, not an installed
              package — added via a CLI, then owned and editable directly.
            </p>
          </Section>

          <Section
            id="navigation"
            title="Navigation"
            lede="Why the nav is shaped the way it is."
          >
            <p>
              The main nav stays to three items — Tools, About, Contact — rather than
              listing both tools individually; Tools links to the hub page where each
              tool gets its own card. On genuinely wide screens the nav bar shows those
              links inline. Below that, the inline links and CTA disappear entirely and
              a single hamburger trigger takes their place — opening a full-screen panel
              that slides in from the right with a real focus trap and portal, and
              closes itself the moment you tap a link or press Escape.
            </p>
            <p>
              The footer carries the full site map — product, company, and legal links —
              so none of the legal pages needed to clutter the main nav bar itself.
            </p>
          </Section>

          <Section
            id="testing"
            title="Testing"
            lede="37 end-to-end tests, run against a real production build."
          >
            <p>
              Every page and both tools are covered by Playwright tests that run against
              an actual production build — not mocked, not a dev server. That includes a{" "}
              <em>real</em> proxied HTTP request in the API Tester tests, and a full
              create → capture → inspect → delete round trip against the real database
              for the Webhook Debugger. The database-dependent tests check that real
              credentials are configured before running, and skip cleanly with a clear
              reason if they aren&apos;t, rather than reporting a false failure.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}
