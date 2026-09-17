import Link from "next/link";
import { destinations } from "@/data/destinations";
import { RouteLine } from "@/components/motion/route-line";

export function Footer() {
  const routes = destinations.length;

  return (
    <footer className="glow-accent relative mt-20 overflow-hidden border-t border-hairline">
      {/* Mapped-terrain texture, so the route line reads as drawn onto it. */}
      <div
        aria-hidden
        className="topo pointer-events-none absolute inset-0 -z-10 opacity-60"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* The network, drawn. Reinforces 'we know every road' on every page. */}
        <div className="mb-10">
          <RouteLine className="h-auto w-full max-w-2xl" />
          <p className="mt-3 max-w-2xl font-sans text-xs leading-relaxed text-muted-foreground">
            Three regions, one network. Every route is ridden by a local guide who
            knows the road by name.
          </p>
        </div>

        {/* Spec plate. */}
        <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-3 border-b border-hairline pb-6">
          <span className="font-display text-2xl font-bold tracking-[0.1em] text-primary">
            Tour-Boda
          </span>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <span className="telemetry text-muted-foreground">
              <span className="text-primary">{routes}</span> routes
            </span>
            <span className="telemetry text-muted-foreground">
              Fleet <span className="text-primary">Boda</span>
            </span>
            <span className="telemetry text-muted-foreground">
              Region <span className="text-primary">Uganda</span>
            </span>
            <span className="telemetry text-muted-foreground">
              Currency <span className="text-primary">UGX</span>
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
                className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-primary"
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
