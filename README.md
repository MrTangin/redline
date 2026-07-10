# Redline

API Endpoint Tester & Webhook Debugger. Fire requests at any API and inspect the
response, or spin up a unique inbox URL and watch real webhooks land in real time.

```bash
pnpm install
pnpm dev
```

Two tools, no account required:

- **`/tester`** — build a request (method, headers, body), send it through a
  server-side proxy so CORS never gets in the way, and inspect status, timing,
  headers, and body.
- **`/webhooks`** — create a disposable inbox with a unique ingest URL, point any
  webhook provider at it, and watch requests arrive live with full header/body
  detail.

Requires a Supabase project for webhook history to persist across requests —
see `supabase/schema.sql` and set `SUPABASE_URL`, `SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

Built on the modular Next.js + Hono starter this repo began from — see
`.claude/skills/` for the design and architecture conventions it follows.

MIT licensed.
