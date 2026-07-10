import { BODYLESS_METHODS } from "@/components/tester/types";

/** POSIX-shell single-quote escaping: close quote, escaped literal quote, reopen quote. */
function shellQuote(value: string): string {
  return `'${value.replace(/'/g, `'\\''`)}'`;
}

export function buildCurlCommand(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: string,
): string {
  const lines = [`curl -X ${method} ${shellQuote(url || "")}`];

  for (const [key, value] of Object.entries(headers)) {
    lines.push(`-H ${shellQuote(`${key}: ${value}`)}`);
  }

  if (body.trim() && !BODYLESS_METHODS.has(method)) {
    lines.push(`--data ${shellQuote(body)}`);
  }

  return lines.join(" \\\n  ");
}
