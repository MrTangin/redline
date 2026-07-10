"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addRecentWebhook,
  formatRelativeTime,
  getRecentWebhooks,
  type RecentWebhook,
} from "@/components/webhooks/utils";
import type { WebhookBin } from "@/lib/types";

export default function WebhooksPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [recent, setRecent] = useState<RecentWebhook[]>([]);

  useEffect(() => {
    // Reads localStorage after mount so the initial client render matches
    // the server-rendered (empty) HTML, avoiding a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecent(getRecentWebhooks());
  }, []);

  async function handleCreate() {
    if (creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || undefined }),
      });
      if (!res.ok) throw new Error("Failed to create inbox");
      const bin: WebhookBin = await res.json();
      addRecentWebhook({ id: bin.id, name: bin.name, createdAt: bin.createdAt });
      router.push(`/webhooks/${bin.id}`);
    } catch {
      toast.error("Could not create a new inbox. Try again.");
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-12 px-6 py-20">
      <div className="flex flex-col gap-3">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          <Radio className="size-3" />
          No signup, no expiry surprises
        </span>
        <h1 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
          Webhook Debugger
        </h1>
        <p className="max-w-lg text-muted-foreground">
          Spin up a disposable inbox, point any webhook provider at its URL, and watch
          requests land here in real time — headers, body, and all.
        </p>
      </div>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-2">
          <Label htmlFor="bin-name">Label (optional)</Label>
          <Input
            id="bin-name"
            placeholder="e.g. Stripe test webhook"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleCreate();
            }}
            maxLength={80}
          />
        </div>
        <Button onClick={handleCreate} disabled={creating} className="w-fit">
          {creating ? "Creating…" : "Create a new inbox"}
          {!creating && <ArrowRight className="size-4" />}
        </Button>
      </div>

      {recent.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Recent inboxes on this device
          </p>
          <ul className="flex flex-col divide-y divide-border rounded-xl border border-border">
            {recent.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/webhooks/${item.id}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/60"
                >
                  <span className="truncate font-medium">
                    {item.name || <span className="font-mono text-muted-foreground">{item.id}</span>}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(item.createdAt)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
