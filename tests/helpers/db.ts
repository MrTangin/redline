import type { APIRequestContext } from "@playwright/test";

/**
 * Probes whether real Supabase credentials are wired up by actually trying
 * to create a bin. Returns the created bin's id if the DB is reachable, or
 * null if it isn't (placeholder/missing credentials) — tests use this to
 * skip DB-dependent assertions instead of failing on an environment gap.
 */
export async function checkDbConfigured(request: APIRequestContext): Promise<string | null> {
  const res = await request.post("/api/webhooks", { data: {} });
  if (res.status() !== 201) return null;
  const body = (await res.json()) as { id: string };
  return body.id;
}

export async function deleteBin(request: APIRequestContext, id: string): Promise<void> {
  await request.delete(`/api/webhooks/${id}`).catch(() => {});
}
