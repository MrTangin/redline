"use client";

import { useEffect, useState } from "react";
import { CopyRow } from "@/components/copy-row";
import { formatRelativeTime } from "@/lib/relative-time";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LiveClock } from "@/components/timestamp/live-clock";
import {
  buildBreakdown,
  parseDateTimeLocalInput,
  parseUnixInput,
  toDateTimeLocalValue,
} from "@/components/timestamp/format";

export function TimestampConverter() {
  const [unixInput, setUnixInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDate(now);
    setUnixInput(String(Math.floor(now.getTime() / 1000)));
    setDateInput(toDateTimeLocalValue(now));
  }, []);

  function handleUnixChange(value: string) {
    setUnixInput(value);
    if (!value.trim()) {
      setError(null);
      return;
    }
    const parsed = parseUnixInput(value);
    if (!parsed) {
      setError("Enter a whole number of seconds or milliseconds.");
      return;
    }
    setError(null);
    setDate(parsed);
    setDateInput(toDateTimeLocalValue(parsed));
  }

  function handleDateChange(value: string) {
    setDateInput(value);
    const parsed = parseDateTimeLocalInput(value);
    if (!parsed) {
      setError("Enter a valid date and time.");
      return;
    }
    setError(null);
    setDate(parsed);
    setUnixInput(String(Math.floor(parsed.getTime() / 1000)));
  }

  function useNow() {
    handleUnixChange(String(Math.floor(Date.now() / 1000)));
  }

  const breakdown = date ? buildBreakdown(date) : null;

  return (
    <div className="flex flex-col gap-6">
      <LiveClock />

      <Card>
        <CardContent className="flex flex-col gap-4">
          <Tabs defaultValue="unix">
            <TabsList>
              <TabsTrigger value="unix">Unix timestamp</TabsTrigger>
              <TabsTrigger value="date">Date & time</TabsTrigger>
            </TabsList>

            <TabsContent value="unix" className="mt-4 flex flex-col gap-2">
              <Label htmlFor="unix-input" className="text-xs text-muted-foreground">
                Seconds or milliseconds — auto-detected
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="unix-input"
                  value={unixInput}
                  onChange={(e) => handleUnixChange(e.target.value)}
                  placeholder="1751932800"
                  className="font-mono"
                  spellCheck={false}
                />
                <Button type="button" variant="outline" onClick={useNow} className="sm:w-32">
                  Use now
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="date" className="mt-4 flex flex-col gap-2">
              <Label htmlFor="date-input" className="text-xs text-muted-foreground">
                In your local timezone
              </Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="date-input"
                  type="datetime-local"
                  step="1"
                  value={dateInput}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="font-mono"
                />
                <Button type="button" variant="outline" onClick={useNow} className="sm:w-32">
                  Use now
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {breakdown && date && (
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">{formatRelativeTime(date)}</p>
          <CopyRow label="Unix seconds" value={String(breakdown.unixSeconds)} />
          <CopyRow label="Unix milliseconds" value={String(breakdown.unixMillis)} />
          <CopyRow label="ISO 8601 (UTC)" value={breakdown.iso} />
          <CopyRow label="UTC" value={breakdown.utc} />
          <CopyRow label={`Local (${breakdown.localTimeZone})`} value={breakdown.local} />
        </div>
      )}
    </div>
  );
}
