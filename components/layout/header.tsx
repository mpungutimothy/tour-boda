import Link from "next/link";
import { destinations } from "@/data/destinations";
import { guides } from "@/data/guides";
import { ArrowRight, Search } from "lucide-react";

const navLinks = [
  { label: "Destinations", href: "/tours" },
  { label: "Guides", href: "/guides" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/**
 * Sticky header.
 *
 * `theme-shell` flips the surface, ink and divider tokens to the dark palette
 * for everything inside it. Nothing here hardcodes a dark colour, so the header
 * and the footer cannot drift apart, and any component dropped inside them —
 * a Button, a chip — inherits the correct theme without knowing about it.
 *
 * The CTA is persistent rather than scroll-revealed: this is a marketplace, and
 * the one action that matters should never be a scroll away.
 */
export function Header() {
  // Real figures — the number of routes and guides actually published.
  const routes = destinations.length;
  const guideCount = guides.length;

  return (
    <header className="theme-shell sticky top-0 z-50 w-full border-b border-hairline bg-background">
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

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-[0.8125rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
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

      {/* Second row on narrow screens: the nav has to stay reachable on the
          phone this will be demoed from. */}
      <nav
        className="scroll-x scroll-fade gap-6 border-t border-hairline px-4 py-2.5 lg:hidden"
        aria-label="Main, small screens"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 snap-start font-sans text-[0.75rem] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
