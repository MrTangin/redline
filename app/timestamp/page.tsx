import type { Metadata } from "next";
import { TimestampConverter } from "@/components/timestamp/converter";

export const metadata: Metadata = {
  title: "Timestamp Converter — Redline",
  description: "Convert between Unix timestamps and human-readable dates, in any timezone.",
};

export default function TimestampPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Timestamp Converter
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Convert a Unix timestamp to a readable date, or the other way around.
        </p>
      </div>
      <TimestampConverter />
    </div>
  );
}
