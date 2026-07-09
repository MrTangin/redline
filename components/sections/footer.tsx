export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center">
        <p>MIT licensed. Built on Next.js, Hono, and shadcn/ui.</p>
        <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">
          View source on GitHub
        </a>
      </div>
    </footer>
  );
}
