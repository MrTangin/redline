import type { Metadata } from "next";
import { JwtDecoder } from "@/components/jwt/decoder";

export const metadata: Metadata = {
  title: "JWT Decoder — Redline",
  description:
    "Decode a JWT's header and payload, check its expiry, and verify HMAC signatures — entirely in your browser.",
};

export default function JwtPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">JWT Decoder</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste a token to see its header, payload, and expiry — and optionally verify its
          signature. Nothing leaves your browser.
        </p>
      </div>
      <JwtDecoder />
    </div>
  );
}
