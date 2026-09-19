"use client";

import { destinations } from "@/data/destinations";
import { priceBounds } from "@/lib/marketplace/filter";
import { guides } from "@/data/guides";
import { TIER_META, TIER_ORDER } from "@/data/tiers";
import { useSearch } from "@/components/marketplace/search-provider";
import { SearchBar } from "@/components/marketplace/search-bar";
import { ResultsGrid } from "@/components/marketplace/results-grid";
import { TierDot } from "@/components/marketplace/tier-ui";
import { formatUGX } from "@/lib/format";
import { BadgeCheck, Bike, Clock } from "lucide-react";

/** Cheapest lead time across the catalogue, for the "book ahead" note. */
const SHORTEST_NOTICE = Math.min(
  ...destinations.map((destination) => destination.minLeadTimeHours),
);

/**
 * The browse view.
 *
 * Filter bar across the top, a reference rail on the left, live results on the
 * right. The rail carries the things a shopper wants to know *while* filtering —
 * what the tiers mean, which guides can lead them, how much notice a route
 * needs — rather than duplicating the controls.
 */
export function BrowseView() {
  const { outcome, activeCount } = useSearch();
  const bounds = priceBounds(destinations);

  return (
    <div className="space-y-8">
      <SearchBar />

      <div className="grid gap-8 lg:grid-cols-[260px_1fr] lg:gap-10">
        {/* ---- Reference rail ---- */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <div className="plate rounded-lg p-4">
            <p className="telemetry text-muted-foreground">Service levels</p>
            <ul className="mt-3 space-y-3">
              {TIER_ORDER.map((key) => {
                const meta = TIER_META[key];
                return (
                  <li key={key} data-tier={key}>
                    <span className="flex items-center gap-2">
                      <TierDot tierKey={key} />
                      <span className="font-display text-sm font-semibold tracking-display">
                        {meta.name}
                      </span>
                    </span>
                    <span className="mt-1 block font-mono text-[0.5625rem] uppercase tracking-[0.14em] tier-text">
                      {meta.tagline}
                    </span>
                    <span className="mt-1 block font-sans text-xs leading-relaxed text-muted-foreground">
                      {meta.summary}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="plate rounded-lg p-4">
            <p className="telemetry text-muted-foreground">Catalogue</p>
            <dl className="mt-3 space-y-2.5 font-sans text-xs">
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">Routes</dt>
                <dd data-readout className="font-mono text-foreground">
                  {destinations.length}
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">Price range</dt>
                <dd data-readout className="text-right font-mono text-foreground">
                  {formatUGX(bounds.min)}
                  <span className="block text-[0.625rem] text-muted-foreground">
                    to {formatUGX(bounds.max)}
                  </span>
                </dd>
              </div>
              <div className="flex items-baseline justify-between gap-3">
                <dt className="text-muted-foreground">Showing</dt>
                <dd data-readout className="font-mono text-primary-ink">
                  {outcome.matches.length}
                </dd>
              </div>
              {activeCount > 0 ? (
                <div className="flex items-baseline justify-between gap-3">
                  <dt className="text-muted-foreground">Filters on</dt>
                  <dd data-readout className="font-mono text-primary-ink">
                    {activeCount}
                  </dd>
                </div>
              ) : null}
            </dl>
          </div>

          <div className="plate rounded-lg p-4">
            <p className="telemetry text-muted-foreground">Good to know</p>
            <ul className="mt-3 space-y-2.5 font-sans text-xs leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-ink" aria-hidden />
                Some routes need {SHORTEST_NOTICE} hours&apos; notice, others 72.
                The booking step tells you before you pay.
              </li>
              <li className="flex items-start gap-2">
                <Bike className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-ink" aria-hidden />
                Two riders per boda. Larger parties are quoted across several
                bikes automatically.
              </li>
              <li className="flex items-start gap-2">
                <BadgeCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary-ink" aria-hidden />
                {guides.length} vetted guides, each cleared for specific tiers.
              </li>
            </ul>
          </div>
        </aside>

        {/* ---- Results ---- */}
        <div id="results" className="min-w-0 scroll-mt-24">
          <ResultsGrid columns={2} />
        </div>
      </div>
    </div>
  );
}
