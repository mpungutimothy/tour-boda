import Link from "next/link";
import { destinations } from "@/data/destinations";

const navLinks = [
  { label: "Tours", href: "/tours" },
  { label: "Guides", href: "/guides" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  // Real figure — the number of routes actually published.
  const routes = destinations.length;

  return (
    <header className="glass-nav sticky top-0 z-50 w-full">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-baseline gap-2"
          aria-label="Tour-Boda Uganda, home"
        >
          <span className="font-display text-xl font-bold uppercase leading-none tracking-[0.12em] text-primary">
            Tour-Boda
          </span>
          <span className="hidden font-mono text-[0.625rem] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            Uganda
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live status chip — dot plus pill. */}
          <span className="hidden items-center gap-2 rounded-full border border-hairline bg-card/50 px-2.5 py-1 sm:inline-flex">
            <span className="relative flex h-1.5 w-1.5">
              <span
                aria-hidden
                className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-primary/70"
              />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {routes} routes live
            </span>
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-card/50 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
            EN<span className="text-hairline">/</span>UGX
          </span>
        </div>
      </div>
    </header>
  );
}
