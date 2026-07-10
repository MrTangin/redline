import { Hono } from "hono";
import type { Context } from "hono";
import { supabaseAdmin } from "@/server/db/admin";

/**
 * The public ingest endpoint: `/api/hook/:id[/*]`. Accepts any method/path/
 * body a third-party webhook provider throws at it and stores it against the
 * bin, so this intentionally has no auth — the bin id itself is the secret.
 */
async function capture(c: Context) {
  const binId = c.req.param("id");

  const { data: bin } = await supabaseAdmin
    .from("webhook_bins")
    .select("id")
    .eq("id", binId)
    .maybeSingle<{ id: string }>();
  if (!bin) return c.json({ ok: false, error: "Unknown webhook bin." }, 404);

  const url = new URL(c.req.url);
  const headers: Record<string, string> = {};
  c.req.raw.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const query: Record<string, string> = {};
  url.searchParams.forEach((value, key) => {
    query[key] = value;
  });

  const method = c.req.method;
  const bodyText = method === "GET" || method === "HEAD" ? null : await c.req.text().catch(() => null);
  const path = url.pathname.replace(/^\/api\/hook\/[^/]+/, "") || "/";
  const ip = c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  const { data, error } = await supabaseAdmin
    .from("webhook_requests")
    .insert({
      bin_id: binId,
      method,
      path,
      query,
      headers,
      body: bodyText,
      content_type: headers["content-type"] ?? null,
      ip,
    })
    .select("id, received_at")
    .single<{ id: string; received_at: string }>();

  await supabaseAdmin
    .from("webhook_bins")
    .update({ last_active_at: new Date().toISOString() })
    .eq("id", binId);

  if (error || !data) return c.json({ ok: false, error: "Could not store request." }, 500);
  return c.json({ ok: true, id: data.id, receivedAt: data.received_at });
}

export const hook = new Hono().all("/:id", capture).all("/:id/*", capture);
