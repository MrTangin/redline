import { lookup } from "node:dns/promises";

const BLOCKED_HOSTNAMES = new Set(["localhost", "localhost.localdomain", "0.0.0.0"]);

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) return false;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true; // link-local, incl. cloud metadata 169.254.169.254
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::1" || lower === "::") return true;
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local fc00::/7
  if (lower.startsWith("fe80")) return true; // link-local
  if (lower.startsWith("::ffff:")) {
    const v4 = lower.split(":").pop();
    if (v4?.includes(".")) return isPrivateIPv4(v4);
  }
  return false;
}

/**
 * Validates a user-supplied target URL for the /api/proxy tester before we
 * fetch it server-side. Blocks obvious loopback/private/link-local targets
 * (including the cloud metadata IP) both by literal hostname and by
 * resolving DNS, so a public hostname that resolves to an internal address
 * is rejected too. Not exhaustive DNS-rebinding protection (the app itself
 * doesn't pin the resolved IP for the subsequent fetch), but stops the
 * common case of pointing the tester at internal infrastructure.
 */
export async function assertPublicUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error("Enter a valid absolute URL, e.g. https://api.example.com/users.");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only http:// and https:// URLs are supported.");
  }

  const hostname = url.hostname.replace(/^\[|\]$/g, "");

  if (BLOCKED_HOSTNAMES.has(hostname.toLowerCase())) {
    throw new Error("Requests to local/internal hosts are not allowed.");
  }
  if (isPrivateIPv4(hostname) || isPrivateIPv6(hostname)) {
    throw new Error("Requests to private/internal IP addresses are not allowed.");
  }

  try {
    const { address } = await lookup(hostname);
    if (isPrivateIPv4(address) || isPrivateIPv6(address)) {
      throw new Error("Requests to private/internal IP addresses are not allowed.");
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("not allowed")) throw err;
    throw new Error(`Could not resolve host "${hostname}".`);
  }

  return url;
}
