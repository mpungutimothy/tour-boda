import Link from "next/link";
import { destinations } from "@/data/destinations";
import { guides } from "@/data/guides";
import { TIER_META, TIER_ORDER } from "@/data/tiers";
import { PARTNERS } from "@/data/partners";
import { REVENUE_SPLIT } from "@/data/revenue";
import { PROTOTYPE_NOTICE } from "@/lib/demo";
import { RouteLine } from "@/components/motion/route-line";
import { TierDot } from "@/components/marketplace/tier-ui";

/**
 * Site footer.
 *
 * Carries three things the pitch needs visible on every page: the three-tier
 * model, the revenue split, and the partner ecosystem — plus the prototype
 * disclosure, so nobody mistakes sample data for a live claim.
 */
export function Footer() {
  const routes = destinations.length;
  const guideCount = guides.length;
  const districtCount = new Set(
    destinations.map((destination) => destination.location.district),
  ).size;

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
            {districtCount} districts, one network. Every route is ridden by a
            local guide who knows the road by name.
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
              <span className="text-primary">{guideCount}</span> guides
            </span>
            <span className="telemetry text-muted-foreground">
              Currency <span className="text-primary">UGX</span>
            </span>
            <span className="telemetry text-muted-foreground">
              Booking fee <span className="text-primary">None</span>
            </span>
          </div>
        </div>

        {/* Model, split, ecosystem — the three things an investor looks for. */}
        <div className="mb-8 grid gap-8 sm:grid-cols-3">
          <div>
            <h2 className="telemetry text-muted-foreground">Service levels</h2>
            <ul className="mt-3 space-y-2">
              {TIER_ORDER.map((key) => (
                <li key={key} data-tier={key} className="flex items-center gap-2">
                  <TierDot tierKey={key} />
                  <Link
                    href="/how-it-works"
                    className="font-sans text-xs text-muted-foreground transition-colors hover:tier-text"
                  >
                    {TIER_META[key].name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="telemetry text-muted-foreground">Revenue split</h2>
            <ul className="mt-3 space-y-2">
              {REVENUE_SPLIT.map((party) => (
                <li
                  key={party.id}
                  className="flex items-center gap-2 font-sans text-xs text-muted-foreground"
                >
                  <span data-readout className="font-mono text-foreground">
                    {Math.round(party.share * 100)}%
                  </span>
                  {party.shortLabel}
                </li>
              ))}
            </ul>
            <Link
              href="/how-it-works#revenue-heading"
              className="mt-3 inline-block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary transition-opacity hover:opacity-80"
            >
              How the split works
            </Link>
          </div>

          <div>
            <h2 className="telemetry text-muted-foreground">Ecosystem</h2>
            <ul className="mt-3 space-y-2">
              {PARTNERS.slice(0, 4).map((partner) => (
                <li
                  key={partner.id}
                  className="font-sans text-xs text-muted-foreground"
                >
                  {partner.name}
                </li>
              ))}
            </ul>
            <Link
              href="/how-it-works#partners"
              className="mt-3 inline-block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary transition-opacity hover:opacity-80"
            >
              All {PARTNERS.length} relationships
            </Link>
          </div>
        </div>

        {/* Prototype disclosure. */}
        <p className="mb-8 rounded-lg border border-hairline bg-background/60 p-3.5 font-sans text-[0.6875rem] leading-relaxed text-muted-foreground">
          <span className="font-mono uppercase tracking-[0.14em] text-primary">
            {PROTOTYPE_NOTICE.label}.
          </span>{" "}
          {PROTOTYPE_NOTICE.detail}
        </p>

        <div className="flex flex-col justify-between gap-6 border-t border-hairline pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            &copy; {new Date().getFullYear()} Tour-Boda Uganda
          </p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2" aria-label="Footer">
            {[
              { label: "How it works", href: "/how-it-works" },
              { label: "All routes", href: "/tours" },
              { label: "Guides", href: "/guides" },
              { label: "Privacy", href: "/privacy" },
              { label: "Terms", href: "/terms" },
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
