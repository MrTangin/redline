"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export interface NavLinkItem {
  href: string;
  label: string;
  /** Extra path prefixes that should also mark this link "active" — e.g. the
   * Tools nav link stays highlighted while on /tester or /webhooks, not just
   * /tools itself. Defaults to just `href`. */
  activeMatch?: string[];
}

export function isNavLinkActive(pathname: string, link: NavLinkItem): boolean {
  const prefixes = link.activeMatch ?? [link.href];
  return prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

/**
 * Full-screen mobile nav panel, shown below the `xl` breakpoint in place of
 * the inline desktop nav (see nav-header.tsx). Built directly on Base UI's
 * Dialog primitive (not the generic Sheet component) so the slide distance
 * and full-screen sizing are fully our own — Sheet's default is a narrow
 * partial-width drawer, this needs to cover the whole viewport.
 *
 * Nav links are plain `<Link>`s with an onClick that closes the dialog,
 * rather than composing them via Dialog.Close's `render` prop — Base UI's
 * Close renders a native `<button>` by default, and asking it to render as
 * an `<a>` via `render` does not reliably produce a real anchor (see the
 * webhook "back" link bug this app already hit with the analogous
 * Button-render-as-Link composition). Controlled `open` state + a plain
 * onClick is the safe, working pattern.
 */
export function NavMobileMenu({ links }: { links: NavLinkItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Closes the panel on any route change (back/forward nav, programmatic
    // navigation) as a fallback beyond each link's own onClick handler —
    // syncing to the router, an external system, is exactly what an effect
    // is for.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted xl:hidden"
        aria-label="Open menu"
      >
        <Menu className="size-5" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-shadow-grey-950/70 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed inset-0 z-50 flex h-dvh w-full flex-col bg-background outline-none",
            "transition-transform duration-350 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform",
            "data-ending-style:translate-x-full data-starting-style:translate-x-full",
          )}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-border/60 px-6">
            <span className="relative flex h-6 w-1.5 overflow-hidden rounded-full bg-shadow-grey-800">
              <span className="absolute inset-x-0 bottom-0 h-3 bg-primary" />
            </span>
            <Dialog.Close
              className="inline-flex size-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
              aria-label="Close menu"
            >
              <X className="size-5" />
            </Dialog.Close>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-6 py-8">
            {links.map((link) => {
              const active = isNavLinkActive(pathname, link);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-xl px-4 py-3.5 text-lg font-medium transition-colors",
                    active
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="shrink-0 border-t border-border/60 p-6">
            <Link
              href="/tester"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ size: "lg" }), "w-full justify-center")}
            >
              Start testing
            </Link>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
