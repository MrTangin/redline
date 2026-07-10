export interface TimestampBreakdown {
  unixSeconds: number;
  unixMillis: number;
  iso: string;
  utc: string;
  local: string;
  localTimeZone: string;
}

export function buildBreakdown(date: Date): TimestampBreakdown {
  return {
    unixSeconds: Math.floor(date.getTime() / 1000),
    unixMillis: date.getTime(),
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(undefined, { timeZoneName: "short" }),
    localTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  };
}

/**
 * Unix timestamps in the wild are seconds almost everywhere, but a lot of
 * JS/JSON APIs hand out milliseconds — auto-detect by magnitude rather than
 * requiring the user to specify. A 12-digit-or-larger integer can't be a
 * plausible seconds-based date anywhere near the present (that would be
 * ~5138 CE), so treat it as milliseconds; anything shorter is seconds.
 */
export function parseUnixInput(raw: string): Date | null {
  const trimmed = raw.trim();
  if (!/^-?\d+$/.test(trimmed)) return null;
  const n = Number(trimmed);
  const ms = Math.abs(n) >= 1e11 ? n : n * 1000;
  const date = new Date(ms);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parseDateTimeLocalInput(raw: string): Date | null {
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** For pre-filling a `datetime-local` input from a Date, in the browser's local time. */
export function toDateTimeLocalValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}
