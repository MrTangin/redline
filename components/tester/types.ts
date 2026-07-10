/**
 * Local-only types for the API Tester tool page. These never cross the
 * network boundary (see lib/types.ts for the shared client/server contract)
 * — they just describe the shape of the request builder's UI state and the
 * localStorage history entries.
 */

export interface HeaderRow {
  id: string;
  key: string;
  value: string;
}

export interface HistoryEntry {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  sentAt: string;
}

export const HTTP_METHODS = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
] as const;

export type HttpMethod = (typeof HTTP_METHODS)[number];

/** Methods where a request body is meaningless and the body editor de-emphasizes. */
export const BODYLESS_METHODS: ReadonlySet<string> = new Set(["GET", "HEAD"]);

let rowCounter = 0;

/** Deterministic-enough id generator for header rows (avoids SSR/client mismatch from crypto.randomUUID in some environments). */
export function nextRowId(): string {
  rowCounter += 1;
  return `row-${Date.now()}-${rowCounter}`;
}
