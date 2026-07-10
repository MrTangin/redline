"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { CapturedRequest } from "@/lib/types";
import { MethodBadge } from "@/components/webhooks/method-badge";
import { formatRelativeTime } from "@/components/webhooks/utils";

interface RequestListProps {
  requests: CapturedRequest[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  ingestUrl: string;
}

export function RequestList({ requests, selectedId, onSelect, ingestUrl }: RequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border px-6 py-20 text-center">
        <span className="relative flex size-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/50" />
          <span className="relative inline-flex size-3 rounded-full bg-primary" />
        </span>
        <p className="text-sm font-medium text-foreground">Waiting for requests…</p>
        <p className="max-w-2xs text-xs text-balance text-muted-foreground">
          Send anything to{" "}
          <code className="break-all font-mono text-foreground">{ingestUrl || "this inbox's URL"}</code>{" "}
          and it will show up here within a few seconds.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <ScrollArea className="h-140">
        <ul className="divide-y divide-border">
          {requests.map((req) => (
            <li key={req.id}>
              <button
                type="button"
                onClick={() => onSelect(req.id)}
                aria-current={selectedId === req.id}
                className={cn(
                  "flex w-full flex-col gap-1 px-4 py-3 text-left transition-colors hover:bg-muted/60",
                  selectedId === req.id && "bg-muted",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <MethodBadge method={req.method} />
                    <span className="truncate font-mono text-sm">{req.path || "/"}</span>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {formatRelativeTime(req.receivedAt)}
                  </span>
                </div>
                {req.contentType && (
                  <span className="truncate pl-0.5 font-mono text-xs text-muted-foreground">
                    {req.contentType}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </div>
  );
}
