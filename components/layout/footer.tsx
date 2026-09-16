import Link from "next/link";
import { destinations } from "@/data/destinations";

export function Footer() {
  const routes = destinations.length;

  return (
    <footer className="relative mt-20 border-t border-hairline">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Instrument plate header — the footer reads as the bike's spec plate. */}
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-hairline pb-6">
          <span className="font-display text-2xl font-bold uppercase tracking-[0.1em] text-primary">
            Tour-Boda
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span className="telemetry text-muted-foreground">
              <span className="text-data">{routes}</span> routes
            </span>
            <span className="telemetry text-muted-foreground">
              Fleet <span className="text-data">Boda</span>
            </span>
            <span className="telemetry text-muted-foreground">
              Region <span className="text-data">Uganda</span>
            </span>
            <span className="telemetry text-muted-foreground">
              Currency <span className="text-data">UGX</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            &copy; {new Date().getFullYear()} Tour-Boda Uganda
          </p>
          <nav className="flex items-center gap-6" aria-label="Footer">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
              { label: "Docs", href: "/docs" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-data"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
