"use client";

import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MethodBadge } from "@/components/tester/method-badge";
import { formatTimeAgo } from "@/components/tester/format";
import type { HistoryEntry } from "@/components/tester/types";

export function HistoryPanel({
  history,
  onSelect,
  onClear,
}: {
  history: HistoryEntry[];
  onSelect: (entry: HistoryEntry) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card p-4 ring-1 ring-foreground/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-medium">
          <History className="size-3.5 text-muted-foreground" />
          History
        </div>
        {history.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onClear}
            aria-label="Clear history"
          >
            <Trash2 />
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Sent requests will show up here.
        </p>
      ) : (
        <ScrollArea className="h-[calc(100vh-16rem)] min-h-40">
          <div className="flex flex-col gap-1 pr-2">
            {history.map((entry, index) => (
              <button
                key={`${entry.sentAt}-${index}`}
                type="button"
                onClick={() => onSelect(entry)}
                className="flex flex-col gap-0.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted"
              >
                <div className="flex items-center gap-2">
                  <MethodBadge method={entry.method} />
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(entry.sentAt)}
                  </span>
                </div>
                <span className="truncate font-mono text-xs text-foreground/80">
                  {entry.url}
                </span>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
