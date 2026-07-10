/**
 * Shared request/response contracts between the Hono API (server/hono/routes/*)
 * and the client pages that call it (app/tester, app/webhooks). Keep this the
 * single source of truth for shapes crossing that boundary.
 */

export interface WebhookBin {
  id: string;
  name: string | null;
  createdAt: string;
  lastActiveAt: string | null;
}

export interface CapturedRequest {
  id: string;
  binId: string;
  method: string;
  path: string;
  query: Record<string, string>;
  headers: Record<string, string>;
  body: string | null;
  contentType: string | null;
  ip: string | null;
  receivedAt: string;
}

export interface ProxyRequestPayload {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

export type ProxyResult =
  | {
      ok: true;
      status: number;
      statusText: string;
      headers: Record<string, string>;
      body: string;
      durationMs: number;
      sizeBytes: number;
    }
  | {
      ok: false;
      error: string;
    };
