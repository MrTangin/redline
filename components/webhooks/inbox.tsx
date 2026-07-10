"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, Eraser, Radio, Trash2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RequestList } from "@/components/webhooks/request-list";
import { RequestDetail } from "@/components/webhooks/request-detail";
import { addRecentWebhook } from "@/components/webhooks/utils";
import type { CapturedRequest, WebhookBin } from "@/lib/types";

type Status = "loading" | "ready" | "not-found";

const POLL_INTERVAL_MS = 3000;

export function Inbox({ id }: { id: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [bin, setBin] = useState<WebhookBin | null>(null);
  const [requests, setRequests] = useState<CapturedRequest[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [ingestUrl, setIngestUrl] = useState("");
  const [clearOpen, setClearOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Read window.location only after mount to avoid an SSR/client mismatch.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIngestUrl(`${window.location.origin}/api/hook/${id}`);
  }, [id]);

  // Confirm the bin exists, and if so, remember it locally for the landing
  // page's "recent inboxes" list (this covers shared links too). `status`
  // already starts as "loading" (see useState above), so there's no need to
  // set it again synchronously here — this effect only needs to resolve it.
  useEffect(() => {
    let cancelled = false;
    async function loadBin() {
      try {
        const res = await fetch(`/api/webhooks/${id}`);
        if (res.status === 404) {
          if (!cancelled) setStatus("not-found");
          return;
        }
        if (!res.ok) throw new Error("Failed to load inbox");
        const data: WebhookBin = await res.json();
        if (cancelled) return;
        setBin(data);
        setStatus("ready");
        addRecentWebhook({ id: data.id, name: data.name, createdAt: data.createdAt });
      } catch {
        if (!cancelled) setStatus("not-found");
      }
    }
    loadBin();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const loadRequests = useCallback(async () => {
    try {
      const res = await fetch(`/api/webhooks/${id}/requests`);
      if (!res.ok) return;
      const data: { requests: CapturedRequest[] } = await res.json();
      setRequests(data.requests);
    } catch {
      // Transient network hiccup — the next poll will retry.
    }
  }, [id]);

  useEffect(() => {
    if (status !== "ready") return;
    // Subscribing to an external system (polling the server) and syncing
    // its data into state on an interval — the canonical case an effect
    // exists for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadRequests();
    const interval = setInterval(loadRequests, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [status, loadRequests]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(ingestUrl);
      toast.success("Ingest URL copied to clipboard");
    } catch {
      toast.error("Could not copy — copy it manually");
    }
  }

  async function handleClearAll() {
    setClearing(true);
    try {
      const res = await fetch(`/api/webhooks/${id}/requests`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to clear");
      setRequests([]);
      toast.success("Cleared all captured requests");
    } catch {
      toast.error("Could not clear requests");
    } finally {
      setClearing(false);
      setClearOpen(false);
    }
  }

  async function handleDeleteBin() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Inbox deleted");
      setDeleteOpen(false);
      router.push("/webhooks");
    } catch {
      toast.error("Could not delete inbox");
      setDeleting(false);
    }
  }

  if (status === "not-found") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-6 py-32 text-center">
        <div className="rounded-full bg-muted p-3">
          <Radio className="size-6 text-muted-foreground" />
        </div>
        <h1 className="font-display text-2xl font-medium tracking-tight">
          This inbox doesn&apos;t exist or was deleted
        </h1>
        <p className="text-sm text-muted-foreground">
          The link might be wrong, or the inbox was removed from this device. Create a
          fresh one to keep testing.
        </p>
        <Link href="/webhooks" className={cn(buttonVariants())}>
          Back to Webhook Debugger
        </Link>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading inbox…</p>
      </div>
    );
  }

  // Derived rather than synced via an effect: keep the current selection
  // sticky across polls, and only fall back to the newest request when the
  // previous selection has disappeared (e.g. after "clear all").
  const selected =
    (selectedId ? requests.find((r) => r.id === selectedId) : undefined) ?? requests[0] ?? null;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            Webhook inbox
          </p>
          <h1 className="mt-1 truncate font-display text-2xl font-medium tracking-tight">
            {bin?.name || "Untitled inbox"}
          </h1>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setClearOpen(true)}
            disabled={requests.length === 0}
          >
            <Eraser className="size-3.5" />
            Clear all
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
            <Trash2 className="size-3.5" />
            Delete inbox
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground">Send requests to this URL</p>
        <div className="flex items-center gap-2">
          <code className="min-w-0 flex-1 truncate rounded-lg bg-muted px-3 py-2 font-mono text-sm text-foreground">
            {ingestUrl || "…"}
          </code>
          <Button size="icon-sm" variant="outline" onClick={handleCopy} aria-label="Copy ingest URL">
            <Copy className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
        <RequestList
          requests={requests}
          selectedId={selected?.id ?? null}
          onSelect={setSelectedId}
          ingestUrl={ingestUrl}
        />
        <RequestDetail request={selected} />
      </div>

      <Dialog open={clearOpen} onOpenChange={setClearOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear all requests?</DialogTitle>
            <DialogDescription>
              This deletes every captured request in this inbox. The inbox itself and its
              URL stay active. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={handleClearAll} disabled={clearing}>
              {clearing ? "Clearing…" : "Clear all"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this inbox?</DialogTitle>
            <DialogDescription>
              This permanently deletes the inbox and every request captured in it. The
              ingest URL will stop working. This can&apos;t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" />}>Cancel</DialogClose>
            <Button variant="destructive" onClick={handleDeleteBin} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete inbox"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
