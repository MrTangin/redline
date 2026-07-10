"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { NavMobileMenu, isNavLinkActive, type NavLinkItem } from "@/components/nav-mobile-menu";

const NAV_LINKS: NavLinkItem[] = [
  {
    href: "/tools",
    label: "Tools",
    activeMatch: ["/tools", "/tester", "/webhooks", "/jwt", "/timestamp"],
  },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function NavHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <span className="relative flex h-6 w-1.5 overflow-hidden rounded-full bg-shadow-grey-800">
            <span className="absolute inset-x-0 bottom-0 h-3 bg-primary" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Redline</span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {NAV_LINKS.map((link) => {
            const active = isNavLinkActive(pathname, link);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
                )}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3.5 -bottom-px h-px bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden shrink-0 xl:block">
          <Link href="/tester" className={cn(buttonVariants({ size: "sm" }), "px-4")}>
            Start testing
          </Link>
        </div>

        <NavMobileMenu links={NAV_LINKS} />
      </div>
    </header>
  );
}
