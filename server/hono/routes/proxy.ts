import { Hono } from "hono";
import type { ProxyRequestPayload, ProxyResult } from "@/lib/types";
import { assertPublicUrl } from "../lib/ssrf-guard";

const TIMEOUT_MS = 20_000;

export const proxy = new Hono().post("/", async (c) => {
  let payload: ProxyRequestPayload;
  try {
    payload = await c.req.json();
  } catch {
    return c.json<ProxyResult>({ ok: false, error: "Request body must be JSON." }, 400);
  }

  if (!payload.url) {
    return c.json<ProxyResult>({ ok: false, error: "A target URL is required." }, 400);
  }

  const method = (payload.method || "GET").toUpperCase();

  let url: URL;
  try {
    url = await assertPublicUrl(payload.url);
  } catch (err) {
    return c.json<ProxyResult>(
      { ok: false, error: err instanceof Error ? err.message : "Invalid URL." },
      400,
    );
  }

  const headers = new Headers();
  for (const [key, value] of Object.entries(payload.headers ?? {})) {
    if (!key) continue;
    headers.set(key, value);
  }

  const canHaveBody = !["GET", "HEAD"].includes(method);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  const start = performance.now();

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: canHaveBody && payload.body ? payload.body : undefined,
      redirect: "follow",
      signal: controller.signal,
    });
    const durationMs = Math.round(performance.now() - start);
    const bodyText = await response.text();
    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return c.json<ProxyResult>({
      ok: true,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: bodyText,
      durationMs,
      sizeBytes: new TextEncoder().encode(bodyText).length,
    });
  } catch (err) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? `Request timed out after ${TIMEOUT_MS / 1000}s.`
        : err instanceof Error
          ? err.message
          : "Request failed.";
    return c.json<ProxyResult>({ ok: false, error: message }, 502);
  } finally {
    clearTimeout(timeout);
  }
});
