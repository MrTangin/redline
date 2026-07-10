"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Braces, ClipboardCopy, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HeaderEditor } from "@/components/tester/header-editor";
import { ResponsePanel } from "@/components/tester/response-panel";
import { HistoryPanel } from "@/components/tester/history-panel";
import { buildCurlCommand } from "@/components/tester/build-curl";
import {
  BODYLESS_METHODS,
  HTTP_METHODS,
  HeaderRow,
  HistoryEntry,
  nextRowId,
} from "@/components/tester/types";
import type { ProxyRequestPayload, ProxyResult } from "@/lib/types";

const HISTORY_KEY = "redline:tester:history";
const HISTORY_LIMIT = 15;

function headersFromRows(rows: HeaderRow[]): Record<string, string> {
  const headers: Record<string, string> = {};
  for (const row of rows) {
    const key = row.key.trim();
    if (!key) continue;
    headers[key] = row.value;
  }
  return headers;
}

function rowsFromHeaders(headers: Record<string, string>): HeaderRow[] {
  const entries = Object.entries(headers);
  if (entries.length === 0) return [{ id: nextRowId(), key: "", value: "" }];
  return entries.map(([key, value]) => ({ id: nextRowId(), key, value }));
}

export default function TesterPage() {
  const [method, setMethod] = useState<string>("GET");
  const [url, setUrl] = useState("");
  const [headerRows, setHeaderRows] = useState<HeaderRow[]>([
    { id: nextRowId(), key: "", value: "" },
  ]);
  const [body, setBody] = useState("");
  const [reqTab, setReqTab] = useState("headers");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProxyResult | null>(null);

  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const bodyDisabled = BODYLESS_METHODS.has(method);

  useEffect(() => {
    // Reads a browser-only API after mount so the initial client render
    // matches the server-rendered (empty) HTML, avoiding a hydration
    // mismatch — the resulting extra render is the intended tradeoff here.
    try {
      const raw = window.localStorage.getItem(HISTORY_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setHistory(JSON.parse(raw));
    } catch {
      // Corrupt or inaccessible localStorage — start with empty history.
    }
  }, []);

  function persistHistory(entries: HistoryEntry[]) {
    setHistory(entries);
    try {
      window.localStorage.setItem(HISTORY_KEY, JSON.stringify(entries));
    } catch {
      // Storage full or unavailable — history just won't persist this run.
    }
  }

  function pushHistory(entry: HistoryEntry) {
    persistHistory([entry, ...history].slice(0, HISTORY_LIMIT));
  }

  function handleBeautify() {
    try {
      const parsed = JSON.parse(body);
      setBody(JSON.stringify(parsed, null, 2));
    } catch {
      toast.error("Body isn't valid JSON");
    }
  }

  function handleCopyCurl() {
    const headers = headersFromRows(headerRows);
    const curl = buildCurlCommand(method, url, headers, body);
    navigator.clipboard
      .writeText(curl)
      .then(() => toast.success("Copied as cURL"))
      .catch(() => toast.error("Couldn't copy to clipboard"));
  }

  function loadFromHistory(entry: HistoryEntry) {
    setMethod(entry.method);
    setUrl(entry.url);
    setHeaderRows(rowsFromHeaders(entry.headers));
    setBody(entry.body);
    setResult(null);
  }

  async function handleSend() {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) {
      toast.error("Enter a URL first");
      return;
    }

    const headers = headersFromRows(headerRows);
    const payload: ProxyRequestPayload = {
      method,
      url: trimmedUrl,
      headers,
      body: bodyDisabled || !body.trim() ? undefined : body,
    };

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: ProxyResult = await res.json();
      setResult(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setResult({ ok: false, error: `Couldn't reach the proxy: ${message}` });
    } finally {
      setLoading(false);
      pushHistory({
        method,
        url: trimmedUrl,
        headers,
        body,
        sentAt: new Date().toISOString(),
      });
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          API Tester
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Build a request, fire it through Redline&apos;s proxy, and inspect
          exactly what comes back — no CORS, no signup.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex min-w-0 flex-col gap-6">
          {/* Request builder bar */}
          <div className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center">
            <Select value={method} onValueChange={(value) => setMethod(value as string)}>
              <SelectTrigger className="h-10 w-full font-mono font-semibold sm:w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HTTP_METHODS.map((m) => (
                  <SelectItem key={m} value={m} className="font-mono">
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
              placeholder="https://api.example.com/v1/users?limit=20"
              className="h-10 flex-1 font-mono"
              spellCheck={false}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleCopyCurl}
                className="flex-1 sm:flex-none"
              >
                <ClipboardCopy data-icon="inline-start" />
                Copy as cURL
              </Button>
              <Button
                type="button"
                size="lg"
                onClick={handleSend}
                disabled={loading}
                className="min-w-24 flex-1 sm:flex-none"
              >
                {loading ? (
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Send data-icon="inline-start" />
                )}
                {loading ? "Sending" : "Send"}
              </Button>
            </div>
          </div>

          {/* Request config */}
          <Card>
            <CardContent>
              <Tabs value={reqTab} onValueChange={(v) => setReqTab(v as string)}>
                <TabsList>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="body">Body</TabsTrigger>
                </TabsList>

                <TabsContent value="headers" className="mt-4">
                  <HeaderEditor rows={headerRows} onChange={setHeaderRows} />
                </TabsContent>

                <TabsContent value="body" className="mt-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">
                        {bodyDisabled
                          ? `${method} requests don't send a body`
                          : "Raw request body"}
                      </Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleBeautify}
                        disabled={bodyDisabled}
                      >
                        <Braces data-icon="inline-start" />
                        Beautify JSON
                      </Button>
                    </div>
                    <Textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      disabled={bodyDisabled}
                      placeholder={'{\n  "key": "value"\n}'}
                      className={cn(
                        "min-h-56 font-mono text-sm",
                        bodyDisabled && "opacity-50",
                      )}
                      spellCheck={false}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Response */}
          <ResponsePanel result={result} loading={loading} />
        </div>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <HistoryPanel
            history={history}
            onSelect={loadFromHistory}
            onClear={() => persistHistory([])}
          />
        </aside>
      </div>
    </div>
  );
}
