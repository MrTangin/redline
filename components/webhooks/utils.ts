/**
 * Client-only helpers shared by the webhooks landing page and inbox view:
 * a localStorage-backed "recent inboxes" list (there are no accounts, so this
 * is the only way a user finds their way back to a bin) and a hand-rolled
 * relative-time formatter.
 */

export interface RecentWebhook {
  id: string;
  name: string | null;
  createdAt: string;
}

const STORAGE_KEY = "redline:webhooks:recent";
const MAX_RECENT = 20;

function isRecentWebhook(value: unknown): value is RecentWebhook {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.id === "string" &&
    (typeof candidate.name === "string" || candidate.name === null) &&
    typeof candidate.createdAt === "string"
  );
}

export function getRecentWebhooks(): RecentWebhook[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentWebhook);
  } catch {
    return [];
  }
}

export function addRecentWebhook(entry: RecentWebhook): void {
  if (typeof window === "undefined") return;
  try {
    const deduped = getRecentWebhooks().filter((w) => w.id !== entry.id);
    const next = [entry, ...deduped].slice(0, MAX_RECENT);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — the recent list
    // is a convenience, not critical, so fail silently.
  }
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const diffSec = Math.max(0, Math.round((Date.now() - then) / 1000));
  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.round(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  const diffMonth = Math.round(diffDay / 30);
  return `${diffMonth}mo ago`;
}
