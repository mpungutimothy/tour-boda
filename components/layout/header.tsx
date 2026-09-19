"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { destinations } from "@/data/destinations";
import { guides } from "@/data/guides";
import { cn } from "@/lib/utils";
import { ArrowRight, Search } from "lucide-react";

/**
 * Navigation, with the active section marked.
 *
 * `match` is declared explicitly rather than derived from `href`, because the
 * URL space deliberately does not mirror the nav. A destination detail page
 * lives at `/destinations/<slug>`, a booking at `/book/<slug>`, and the
 * catalogue at `/tours` — but to a traveller all three are the same section, so
 * all three light up "Destinations". Deriving the match from `href` would leave
 * the nav unmarked on every detail page.
 */
const NAV_ITEMS = [
  {
    label: "Destinations",
    href: "/tours",
    match: ["/tours", "/destinations", "/book"],
  },
  { label: "Guides", href: "/guides", match: ["/guides"] },
  { label: "How it works", href: "/how-it-works", match: ["/how-it-works"] },
  { label: "About", href: "/about", match: ["/about"] },
  { label: "Contact", href: "/contact", match: ["/contact"] },
];

/**
 * True for the exact route and for anything nested beneath it, so `/guides`
 * stays active on `/guides/okello`.
 */
function isActive(pathname: string, match: readonly string[]): boolean {
  return match.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/**
 * Sticky header.
 *
 * `theme-shell` flips the surface, ink and divider tokens to the dark palette
 * for everything inside it. Nothing here hardcodes a dark colour, so the header
 * and the footer cannot drift apart, and any component dropped inside them —
 * a Button, a chip — inherits the correct theme without knowing about it.
 *
 * `glass-nav` is the specified treatment: #15130F at 92% with a backdrop blur.
 * It is not fully transparent on purpose — this bar sits above photography on
 * the hero and on the destination pages, and nav labels must not show the
 * picture through them.
 *
 * The active colour is `text-primary` rather than a literal #C98A2C because the
 * shell token resolves to exactly that value; writing the hex here would create
 * a second source of truth for the brand gold.
 *
 * The CTA is persistent rather than scroll-revealed: this is a marketplace, and
 * the one action that matters should never be a scroll away.
 */
export function Header() {
  const pathname = usePathname();

  // Real figures — the number of routes and guides actually published, counted
  // from the data source so the badge cannot drift as the catalogue grows.
  const routes = destinations.length;
  const guideCount = guides.length;

  return (
    <header className="theme-shell glass-nav sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-2"
          aria-label="Tour-Boda Uganda, home"
        >
          <span className="font-display text-[1.375rem] font-semibold leading-none tracking-display text-foreground">
            Tour-Boda
          </span>
          <span className="hidden font-sans text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            Uganda
          </span>
        </Link>

        <nav className="hidden h-16 items-stretch gap-7 lg:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.match);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center font-sans text-[0.8125rem] transition-colors",
                  active
                    ? "font-semibold text-primary"
                    : "font-medium text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
                {/* 2px rule pinned to the header's own bottom edge, so marking
                    the active item never nudges the label off the baseline. */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-0.5",
                    active ? "bg-primary" : "bg-transparent",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Catalogue size, stated plainly. An investor reads this as traction;
              a traveller reads it as choice. */}
          <span className="hidden font-sans text-[0.75rem] text-muted-foreground xl:inline">
            <span className="font-semibold text-foreground">{routes}</span> routes
            {" · "}
            <span className="font-semibold text-foreground">{guideCount}</span>{" "}
            guides
          </span>

          <Link
            href="/tours"
            className="sheen inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 font-sans text-[0.8125rem] font-semibold text-primary-foreground transition-colors hover:bg-primary-dark"
          >
            <Search className="h-4 w-4" aria-hidden />
            Find a ride
            <ArrowRight className="hidden h-4 w-4 sm:inline" aria-hidden />
          </Link>
        </div>
      </div>

      {/* Second row on narrow screens. This is a scrollable rail rather than a
          hamburger: there are only five destinations in the nav, and a rail is
          always open, so there is no open/close state that can fail to open —
          one less thing to go wrong on the phone this gets demoed from. It uses
          the same `isActive` rule as the desktop nav. */}
      <nav
        className="scroll-x scroll-fade gap-6 border-t border-hairline px-4 lg:hidden"
        aria-label="Main, small screens"
      >
        {NAV_ITEMS.map((item) => {
          const active = isActive(pathname, item.match);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 snap-start border-b-2 py-2.5 font-sans text-[0.75rem] transition-colors",
                active
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent font-medium text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
