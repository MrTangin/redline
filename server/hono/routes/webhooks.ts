import { Hono } from "hono";
import { supabaseAdmin } from "@/server/db/admin";
import type { CapturedRequest, WebhookBin } from "@/lib/types";

interface BinRow {
  id: string;
  name: string | null;
  created_at: string;
  last_active_at: string | null;
}

interface RequestRow {
  id: string;
  bin_id: string;
  method: string;
  path: string;
  query: Record<string, string> | null;
  headers: Record<string, string> | null;
  body: string | null;
  content_type: string | null;
  ip: string | null;
  received_at: string;
}

function mapBin(row: BinRow): WebhookBin {
  return { id: row.id, name: row.name, createdAt: row.created_at, lastActiveAt: row.last_active_at };
}

function mapRequest(row: RequestRow): CapturedRequest {
  return {
    id: row.id,
    binId: row.bin_id,
    method: row.method,
    path: row.path,
    query: row.query ?? {},
    headers: row.headers ?? {},
    body: row.body,
    contentType: row.content_type,
    ip: row.ip,
    receivedAt: row.received_at,
  };
}

export const webhooks = new Hono()
  .post("/", async (c) => {
    const body = await c.req.json().catch(() => ({}) as Record<string, unknown>);
    const rawName = typeof body?.name === "string" ? body.name.trim() : "";
    const name = rawName ? rawName.slice(0, 80) : null;

    const { data, error } = await supabaseAdmin
      .from("webhook_bins")
      .insert({ name })
      .select()
      .single<BinRow>();

    if (error || !data) return c.json({ error: "Could not create webhook bin." }, 500);
    return c.json(mapBin(data), 201);
  })
  .get("/:id", async (c) => {
    const { data, error } = await supabaseAdmin
      .from("webhook_bins")
      .select()
      .eq("id", c.req.param("id"))
      .maybeSingle<BinRow>();

    if (error || !data) return c.json({ error: "Bin not found." }, 404);
    return c.json(mapBin(data));
  })
  .get("/:id/requests", async (c) => {
    const binId = c.req.param("id");
    const { data: bin } = await supabaseAdmin
      .from("webhook_bins")
      .select("id")
      .eq("id", binId)
      .maybeSingle<{ id: string }>();
    if (!bin) return c.json({ error: "Bin not found." }, 404);

    const { data, error } = await supabaseAdmin
      .from("webhook_requests")
      .select()
      .eq("bin_id", binId)
      .order("received_at", { ascending: false })
      .limit(200)
      .returns<RequestRow[]>();

    if (error) return c.json({ error: "Could not load requests." }, 500);
    return c.json({ requests: (data ?? []).map(mapRequest) });
  })
  .delete("/:id/requests", async (c) => {
    const { error } = await supabaseAdmin
      .from("webhook_requests")
      .delete()
      .eq("bin_id", c.req.param("id"));
    if (error) return c.json({ error: "Could not clear requests." }, 500);
    return c.json({ cleared: true });
  })
  .delete("/:id", async (c) => {
    const { error } = await supabaseAdmin.from("webhook_bins").delete().eq("id", c.req.param("id"));
    if (error) return c.json({ error: "Could not delete bin." }, 500);
    return c.json({ deleted: true });
  });
