"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, KeyRound, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/relative-time";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  claimDate,
  decodeJwt,
  verifyHmacSignature,
  type ExpiryTone,
  type VerifyOutcome,
} from "@/components/jwt/decode";

const TONE_CLASSES: Record<ExpiryTone, string> = {
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-white",
  muted: "bg-muted text-muted-foreground",
};

const WELL_KNOWN_CLAIMS = ["iss", "sub", "aud", "exp", "nbf", "iat", "jti"];

function expiryStatus(payload: Record<string, unknown>): { tone: ExpiryTone; label: string } {
  const exp = claimDate(payload.exp);
  if (!exp) return { tone: "muted", label: "No expiry claim (exp)" };
  const expired = exp.getTime() < Date.now();
  return {
    tone: expired ? "destructive" : "success",
    label: expired
      ? `Expired ${formatRelativeTime(exp)}`
      : `Valid — expires ${formatRelativeTime(exp)}`,
  };
}

export function JwtDecoder() {
  const [token, setToken] = useState("");
  const [secret, setSecret] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<VerifyOutcome | null>(null);

  const result = useMemo(() => decodeJwt(token), [token]);

  function handleTokenChange(value: string) {
    setToken(value);
    setVerifyResult(null);
  }

  async function handleVerify() {
    if (!result.ok) return;
    setVerifying(true);
    setVerifyResult(null);
    try {
      const outcome = await verifyHmacSignature(result.jwt, secret);
      setVerifyResult(outcome);
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Label htmlFor="jwt-input" className="text-xs text-muted-foreground">
          JWT
        </Label>
        <Textarea
          id="jwt-input"
          value={token}
          onChange={(e) => handleTokenChange(e.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
          spellCheck={false}
          className="min-h-28 font-mono text-sm break-all"
        />
        <p className="text-xs text-muted-foreground">
          Decoded entirely in your browser — nothing here is ever sent to a server.
        </p>
      </div>

      {token.trim() === "" ? null : !result.ok ? (
        <Card className="ring-destructive/30">
          <CardContent className="flex items-center gap-2 text-sm text-destructive">
            <AlertTriangle className="size-4 shrink-0" />
            {result.error}
          </CardContent>
        </Card>
      ) : (
        <>
          {(() => {
            const status = expiryStatus(result.jwt.payload);
            const alg = String(result.jwt.header.alg ?? "none");
            return (
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-sm font-semibold text-foreground">
                  alg: {alg}
                </span>
                <span
                  className={cn(
                    "rounded-md px-2.5 py-1 text-sm font-medium",
                    TONE_CLASSES[status.tone],
                  )}
                >
                  {status.label}
                </span>
              </div>
            );
          })()}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardContent className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-foreground">Header</h3>
                <ScrollArea className="h-48 rounded-lg border border-border bg-muted/30">
                  <pre className="p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all">
                    {JSON.stringify(result.jwt.header, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-foreground">Payload</h3>
                <ScrollArea className="h-48 rounded-lg border border-border bg-muted/30">
                  <pre className="p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all">
                    {JSON.stringify(result.jwt.payload, null, 2)}
                  </pre>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {WELL_KNOWN_CLAIMS.some((c) => c in result.jwt.payload) && (
            <Card>
              <CardContent className="flex flex-col gap-2">
                <h3 className="text-sm font-medium text-foreground">Standard claims</h3>
                <Table>
                  <TableBody>
                    {WELL_KNOWN_CLAIMS.filter((c) => c in result.jwt.payload).map((claim) => {
                      const value = result.jwt.payload[claim];
                      const asDate = claimDate(value);
                      return (
                        <TableRow key={claim}>
                          <TableCell className="w-24 font-mono text-xs font-medium text-muted-foreground">
                            {claim}
                          </TableCell>
                          <TableCell className="font-mono text-xs break-all">
                            {asDate
                              ? `${asDate.toLocaleString()} (${formatRelativeTime(asDate)})`
                              : String(value)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="flex flex-col gap-3">
              <h3 className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <KeyRound className="size-4" />
                Verify signature
              </h3>
              <p className="text-xs text-muted-foreground">
                Only symmetric algorithms (HS256/384/512) can be verified with a shared
                secret in the browser — RS/ES/PS algorithms need a public key and
                aren&apos;t supported here.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={secret}
                  onChange={(e) => {
                    setSecret(e.target.value);
                    setVerifyResult(null);
                  }}
                  placeholder="Signing secret"
                  className="font-mono"
                  type="password"
                  spellCheck={false}
                />
                <Button
                  type="button"
                  onClick={handleVerify}
                  disabled={verifying || !secret}
                  className="sm:w-40"
                >
                  {verifying ? "Verifying…" : "Verify"}
                </Button>
              </div>
              {verifyResult && (
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                    verifyResult.status === "valid" && "bg-success/15 text-success",
                    verifyResult.status === "invalid" && "bg-destructive/15 text-destructive",
                    (verifyResult.status === "unsupported-alg" ||
                      verifyResult.status === "error") &&
                      "bg-muted text-muted-foreground",
                  )}
                >
                  {verifyResult.status === "valid" && (
                    <>
                      <ShieldCheck className="size-4" /> Signature is valid for this secret.
                    </>
                  )}
                  {verifyResult.status === "invalid" && (
                    <>
                      <AlertTriangle className="size-4" /> Signature does not match this
                      secret.
                    </>
                  )}
                  {verifyResult.status === "unsupported-alg" && (
                    <>Algorithm &quot;{verifyResult.alg}&quot; isn&apos;t supported for verification here.</>
                  )}
                  {verifyResult.status === "error" && <>{verifyResult.message}</>}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
