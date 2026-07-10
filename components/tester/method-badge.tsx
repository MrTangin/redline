import { cn } from "@/lib/utils";

const METHOD_TONES: Record<string, string> = {
  GET: "text-success",
  POST: "text-primary",
  PUT: "text-warning",
  PATCH: "text-warning",
  DELETE: "text-destructive",
  HEAD: "text-muted-foreground",
  OPTIONS: "text-muted-foreground",
};

export function MethodBadge({
  method,
  className,
}: {
  method: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-mono text-xs font-semibold tracking-tight",
        METHOD_TONES[method] ?? "text-foreground",
        className,
      )}
    >
      {method}
    </span>
  );
}
