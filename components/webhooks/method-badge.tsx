import { cn } from "@/lib/utils";

/**
 * Method-coded pill. Colors are semantic (success/warning/destructive tokens)
 * rather than an arbitrary rainbow, so DELETE reads as destructive the same
 * way it does everywhere else in the app.
 */
const METHOD_STYLES: Record<string, string> = {
  GET: "bg-secondary text-secondary-foreground",
  POST: "bg-success/15 text-success",
  PUT: "bg-warning/15 text-warning",
  PATCH: "bg-warning/15 text-warning",
  DELETE: "bg-destructive/15 text-destructive",
  HEAD: "bg-muted text-muted-foreground",
  OPTIONS: "bg-muted text-muted-foreground",
};

export function MethodBadge({
  method,
  className,
}: {
  method: string;
  className?: string;
}) {
  const upper = method.toUpperCase();
  const style = METHOD_STYLES[upper] ?? "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-md px-1.5 font-mono text-[0.7rem] font-semibold tracking-tight",
        style,
        className,
      )}
    >
      {upper}
    </span>
  );
}
