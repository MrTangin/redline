"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBytes, formatDuration, tryPrettyJson } from "@/components/tester/format";
import type { ProxyResult } from "@/lib/types";

function statusTone(status: number): "success" | "warning" | "destructive" {
  if (status >= 200 && status < 300) return "success";
  if (status >= 300 && status < 400) return "warning";
  return "destructive";
}

const TONE_CLASSES: Record<string, string> = {
  success: "bg-success text-success-foreground",
  warning: "bg-warning text-warning-foreground",
  destructive: "bg-destructive text-white",
};

export function ResponsePanel({
  result,
  loading,
}: {
  result: ProxyResult | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Sending request…
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Send a request to see the response here.
        </CardContent>
      </Card>
    );
  }

  if (!result.ok) {
    return (
      <Card className="ring-destructive/30">
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-medium text-destructive">
            <AlertTriangle className="size-4" />
            Request failed
          </div>
          <p className="font-mono text-sm break-words text-destructive/90">
            {result.error}
          </p>
        </CardContent>
      </Card>
    );
  }

  const tone = statusTone(result.status);
  const { pretty, isJson } = tryPrettyJson(result.body);
  const headerEntries = Object.entries(result.headers);

  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-sm font-semibold",
              TONE_CLASSES[tone],
            )}
          >
            {result.status} {result.statusText}
          </span>
          <span className="font-mono text-sm text-muted-foreground">
            {formatDuration(result.durationMs)}
          </span>
          <span className="font-mono text-sm text-muted-foreground">
            {formatBytes(result.sizeBytes)}
          </span>
          {isJson && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              JSON
            </span>
          )}
        </div>

        <Tabs defaultValue="body">
          <TabsList>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">
              Headers ({headerEntries.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="body" className="mt-3">
            <ScrollArea className="h-96 rounded-lg border border-border bg-muted/30">
              <pre className="p-3 font-mono text-xs leading-relaxed whitespace-pre-wrap break-all">
                {pretty || "(empty body)"}
              </pre>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="headers" className="mt-3">
            <ScrollArea className="h-96 rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/3">Name</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {headerEntries.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-muted-foreground">
                        No headers returned.
                      </TableCell>
                    </TableRow>
                  )}
                  {headerEntries.map(([name, value]) => (
                    <TableRow key={name}>
                      <TableCell className="font-mono text-xs font-medium whitespace-normal break-all">
                        {name}
                      </TableCell>
                      <TableCell className="font-mono text-xs whitespace-normal break-all">
                        {value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
