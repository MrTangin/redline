"use client";

import { useEffect, useState } from "react";
import { CopyRow } from "@/components/copy-row";

/**
 * Isolated in its own component so the once-a-second tick only re-renders
 * this small widget, not the whole converter form below it.
 */
export function LiveClock() {
  const [seconds, setSeconds] = useState<number | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSeconds(Math.floor(Date.now() / 1000));
    const interval = setInterval(() => {
      setSeconds(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <CopyRow
      label="Right now (Unix seconds)"
      value={seconds === null ? "…" : String(seconds)}
    />
  );
}
