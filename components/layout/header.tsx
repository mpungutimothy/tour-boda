import Link from "next/link";
import { destinations } from "@/data/destinations";
import { guides } from "@/data/guides";

const navLinks = [
  { label: "All routes", href: "/tours" },
  { label: "Guides", href: "/guides" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  // Real figures — the number of routes and guides actually published.
  const routes = destinations.length;
  const guideCount = guides.length;

  return (
    <header className="glass-nav sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-2"
          aria-label="Tour-Boda Uganda, home"
        >
          <span className="font-display text-xl font-bold leading-none tracking-[0.1em] text-primary">
            Tour-Boda
          </span>
          <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            Uganda
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live catalogue chip — dot plus pill. */}
          <span className="hidden items-center gap-2 rounded-full border border-hairline bg-card/50 px-2.5 py-1 md:inline-flex">
            <span className="relative flex h-1.5 w-1.5">
              <span
                aria-hidden
                className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-primary/70"
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {routes} routes · {guideCount} guides
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-card/50 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
            EN<span className="text-hairline">/</span>UGX
          </span>
        </div>
      </div>

      {/* Second row on narrow screens: the nav has to stay reachable on the
          phone this will be demoed from. */}
      <nav
        className="scroll-x scroll-fade gap-5 border-t border-hairline px-4 py-2 lg:hidden"
        aria-label="Main, small screens"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 snap-start font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-primary"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
