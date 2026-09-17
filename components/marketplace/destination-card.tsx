"use client";

import { useState } from "react";
import Link from "next/link";
import type { TierKey } from "@/types/destination";
import type { DestinationMatch } from "@/lib/marketplace/filter";
import { getTier } from "@/data/destinations";
import { tierMeta } from "@/data/tiers";
import { buildQuote } from "@/lib/marketplace/pricing";
import { formatUGX } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TierPriceStrip, TierTabs } from "@/components/marketplace/tier-ui";
import {
  ArrowRight,
  Check,
  Clock,
  MapPin,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";

/**
 * A marketplace listing.
 *
 * The whole tile is not one link: the tier selector and the two calls to action
 * are interactive controls, and nesting buttons inside an anchor breaks both
 * HTML validity and keyboard navigation. The photo and the title are the links.
 */
export function DestinationCard({
  match,
  index,
}: {
  match: DestinationMatch;
  index: number;
}) {
  const { destination, quote } = match;
  const [tierKey, setTierKey] = useState<TierKey>(match.tier.key);

  const tier = getTier(destination, tierKey) ?? match.tier;
  const isMatchedTier = tier.key === match.tier.key;

  // Price for the tier the traveller is looking at, for *their* party — not a
  // generic "from" figure. Falls back to the matched quote so the number on the
  // card is always the number the booking flow will produce.
  const tierQuote =
    isMatchedTier && match.party
      ? quote
      : buildQuote({
          destination,
          tier,
          party: match.party,
          requirements: {
            transport: tier.components.transport.included,
            guide: tier.components.guide.included,
            meals: tier.components.meals.included,
          },
        });

  const distance =
    destination.keyFacts.find((fact) => fact.label === "Total distance")?.value ??
    "—";

  return (
    <article className="group card-glow glass flex h-full flex-col overflow-hidden rounded-lg">
      {/* ---- Photo ---- */}
      <Link
        href={`/destinations/${destination.slug}`}
        className="relative block aspect-[16/10] overflow-hidden"
        tabIndex={-1}
        aria-hidden
    >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={destination.images[0]?.url}
          alt=""
          loading={index < 3 ? "eager" : "lazy"}
          className="duotone h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-primary/14 mix-blend-overlay"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-scrim/95 via-scrim/40 to-transparent" />

        <span className="absolute left-3 top-3 inline-flex items-center rounded-full border border-on-scrim/25 bg-scrim/65 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-on-scrim backdrop-blur-sm">
          {destination.category}
        </span>

        {destination.pricingMode === "quotation" ? (
          <span className="absolute right-3 top-3 inline-flex items-center rounded-full border border-primary/50 bg-scrim/70 px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary backdrop-blur-sm">
            Quotation
          </span>
        ) : null}

        <span className="absolute inset-x-3 bottom-3 flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-on-scrim">
            <MapPin className="h-3 w-3" aria-hidden />
            {destination.location.district}
          </span>
          <span aria-hidden className="h-px flex-1 bg-on-scrim/25" />
          <span className="flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-on-scrim">
            <Clock className="h-3 w-3" aria-hidden />
            {tier.duration}
          </span>
        </span>
      </Link>

      {/* ---- Body ---- */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-tight tracking-display">
          <Link
            href={`/destinations/${destination.slug}`}
            className="transition-colors hover:text-primary"
          >
            {destination.name}
          </Link>
        </h3>

        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            {match.quote.passengers}{" "}
            {match.quote.passengers === 1 ? "rider" : "riders"}
          </span>
          <span aria-hidden className="text-hairline">·</span>
          <span data-readout className="font-mono">
            {distance}
          </span>
        </p>

        {/* Three-tier selector — the "shopping" moment. */}
        <TierTabs
          tiers={destination.tiers}
          value={tier.key}
          onChange={setTierKey}
          className="mt-4"
          label={`Service level for ${destination.name}`}
        />

        {/* Price for the selected tier and this party. */}
        <div className="mt-4 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {tier.badge ? tier.badge : tierMeta(tier.key).tagline}
            </p>
            <p
              data-readout
              data-tier={tier.key}
              className="mt-1 font-mono text-2xl font-bold leading-none tier-text"
            >
              {formatUGX(tierQuote.total)}
            </p>
            <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
              total · {formatUGX(tierQuote.perPerson)} each
            </p>
          </div>
          <span className="shrink-0 text-right">
            <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
              {destination.pricingMode === "quotation" ? "Indicative" : "From"}
            </span>
            <span
              data-readout
              className="mt-1 block font-mono text-xs text-muted-foreground"
            >
              {formatUGX(
                Math.min(...destination.tiers.map((entry) => entry.price)),
              )}
            </span>
          </span>
        </div>

        {/* Inclusions / exclusions for the selected tier. */}
        <ul className="mt-4 space-y-1.5 border-t border-hairline pt-4">
          {tier.inclusions.slice(0, 3).map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 font-sans text-xs leading-snug text-muted-foreground"
            >
              <Check
                className="mt-0.5 h-3 w-3 shrink-0 text-success"
                aria-hidden
              />
              {item}
            </li>
          ))}
          {tier.excludes.slice(0, 1).map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 font-sans text-xs leading-snug text-muted-foreground/70"
            >
              <X className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        {match.upgradedForRequirements ? (
          <p className="mt-3 rounded-md border border-primary/25 bg-primary/[0.07] px-2.5 py-2 font-sans text-[0.6875rem] leading-snug text-primary">
            Priced at {tierMeta(tier.key).shortLabel} because you asked for
            something the cheaper tier leaves out.
          </p>
        ) : null}

        {/* ---- Actions ---- */}
        <div className="mt-auto flex items-center gap-2 pt-5">
          <Link
            href={`/book/${destination.slug}?tier=${tier.key}`}
            className={cn(
              "sheen inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-md px-3",
              "bg-primary font-mono text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-primary-foreground",
              "transition-all hover:bg-primary/90 hover:shadow-glow-sm",
            )}
          >
            <ShoppingBag className="h-3.5 w-3.5" aria-hidden />
            Book
          </Link>
          <Link
            href={`/destinations/${destination.slug}`}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-md border border-hairline px-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
          >
            Details
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
