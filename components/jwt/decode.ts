export interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signingInput: string;
  raw: { header: string; payload: string; signature: string };
}

export type DecodeResult = { ok: true; jwt: DecodedJwt } | { ok: false; error: string };

function base64UrlDecode(segment: string): string {
  const padded = segment.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decodes entirely client-side — never sends the token anywhere. A JWT can
 * contain sensitive claims, so this file must stay free of any network call.
 */
export function decodeJwt(token: string): DecodeResult {
  const trimmed = token.trim();
  if (!trimmed) return { ok: false, error: "Paste a JWT to decode it." };

  const parts = trimmed.split(".");
  if (parts.length !== 3) {
    return {
      ok: false,
      error: `A JWT has three dot-separated parts (header.payload.signature) — this has ${parts.length}.`,
    };
  }
  const [rawHeader, rawPayload, rawSignature] = parts;

  let header: Record<string, unknown>;
  try {
    header = JSON.parse(base64UrlDecode(rawHeader));
  } catch {
    return { ok: false, error: "Couldn't decode the header — it isn't valid base64url JSON." };
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(base64UrlDecode(rawPayload));
  } catch {
    return { ok: false, error: "Couldn't decode the payload — it isn't valid base64url JSON." };
  }

  return {
    ok: true,
    jwt: {
      header,
      payload,
      signingInput: `${rawHeader}.${rawPayload}`,
      raw: { header: rawHeader, payload: rawPayload, signature: rawSignature },
    },
  };
}

const HMAC_ALGS: Record<string, string> = {
  HS256: "SHA-256",
  HS384: "SHA-384",
  HS512: "SHA-512",
};

export type VerifyOutcome =
  | { status: "valid" }
  | { status: "invalid" }
  | { status: "unsupported-alg"; alg: string }
  | { status: "error"; message: string };

/** Only symmetric (HS-prefixed) algorithms can be verified with a shared secret in the browser — asymmetric algorithms (RS-, ES-, PS-prefixed) need a public key, not covered here. */
export async function verifyHmacSignature(jwt: DecodedJwt, secret: string): Promise<VerifyOutcome> {
  const alg = String(jwt.header.alg ?? "");
  const hash = HMAC_ALGS[alg];
  if (!hash) return { status: "unsupported-alg", alg: alg || "unknown" };

  try {
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash },
      false,
      ["sign"],
    );
    const signature = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(jwt.signingInput),
    );
    const computed = base64UrlEncode(new Uint8Array(signature));
    return computed === jwt.raw.signature ? { status: "valid" } : { status: "invalid" };
  } catch (err) {
    return { status: "error", message: err instanceof Error ? err.message : "Verification failed." };
  }
}

export type ExpiryTone = "success" | "warning" | "destructive" | "muted";

export function claimDate(value: unknown): Date | null {
  if (typeof value !== "number" || !Number.isFinite(value)) return null;
  return new Date(value * 1000);
}
