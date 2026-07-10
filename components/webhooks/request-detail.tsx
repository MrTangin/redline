"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CapturedRequest } from "@/lib/types";
import { MethodBadge } from "@/components/webhooks/method-badge";

function prettyBody(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}

function EmptyPanel({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-border p-4 text-xs text-muted-foreground">
      {children}
    </p>
  );
}

export function RequestDetail({ request }: { request: CapturedRequest | null }) {
  if (!request) {
    return (
      <div className="flex min-h-75 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground lg:min-h-140">
        Select a request to see its details.
      </div>
    );
  }

  const queryEntries = Object.entries(request.query);
  const headerEntries = Object.entries(request.headers);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <MethodBadge method={request.method} />
        <code className="min-w-0 break-all font-mono text-sm">{request.path || "/"}</code>
        <span className="ml-auto shrink-0 text-xs text-muted-foreground">
          {new Date(request.receivedAt).toLocaleString()}
        </span>
      </div>
      {request.ip && <p className="text-xs text-muted-foreground">From {request.ip}</p>}

      <Tabs defaultValue="body">
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">Headers ({headerEntries.length})</TabsTrigger>
          <TabsTrigger value="query">Query ({queryEntries.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="body">
          {request.body ? (
            <ScrollArea className="h-72 rounded-lg border border-border bg-muted/30">
              <pre className="p-3 font-mono text-xs break-all whitespace-pre-wrap text-foreground">
                {prettyBody(request.body)}
              </pre>
            </ScrollArea>
          ) : (
            <EmptyPanel>No body was sent with this request.</EmptyPanel>
          )}
        </TabsContent>

        <TabsContent value="headers">
          {headerEntries.length > 0 ? (
            <ScrollArea className="h-72 rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {headerEntries.map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell className="font-mono text-xs whitespace-normal break-all">
                        {key}
                      </TableCell>
                      <TableCell className="font-mono text-xs whitespace-normal break-all">
                        {value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          ) : (
            <EmptyPanel>No headers were captured.</EmptyPanel>
          )}
        </TabsContent>

        <TabsContent value="query">
          {queryEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queryEntries.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-mono text-xs whitespace-normal break-all">
                      {key}
                    </TableCell>
                    <TableCell className="font-mono text-xs whitespace-normal break-all">
                      {value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <EmptyPanel>No query parameters.</EmptyPanel>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
