"use client";

import { useState } from "react";
import Link from "next/link";
import type { TierKey } from "@/types/destination";
import type { DestinationMatch } from "@/lib/marketplace/filter";
import { getTier } from "@/data/destinations";
import { guidesForDestination } from "@/data/guides";
import { tierMeta } from "@/data/tiers";
import { buildQuote } from "@/lib/marketplace/pricing";
import { formatUGX } from "@/lib/format";
import { cn } from "@/lib/utils";
import { TierTabs } from "@/components/marketplace/tier-ui";
import { CardImage } from "@/components/visual/card-image";
import {
  ArrowRight,
  Check,
  Clock,
  MapPin,
  ShoppingBag,
  Star,
  Users,
  X,
} from "lucide-react";

/**
 * A marketplace listing.
 *
 * The tile is not one big link: the tier selector and the two calls to action
 * are interactive controls, and nesting buttons inside an anchor breaks both
 * HTML validity and keyboard navigation. The photo and the title are the links.
 *
 * The photograph bleeds off the top edge with square corners and only the
 * bottom of the card is rounded, so the tile reads as a printed sheet rather
 * than one more member of a rounded-card kit.
 *
 * RATING PROVENANCE: destinations have no rating of their own. The figure in
 * the chip is the rating of the guide who leads the route, and the card says so
 * in as many words — borrowing a guide's score without labelling it would make
 * the number look like something it is not.
 */
export function DestinationCard({
  match,
}: {
  match: DestinationMatch;
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

  const leadGuide = guidesForDestination(destination.slug)[0];

  return (
    <article className="card-lift group flex h-full flex-col overflow-hidden rounded-b-lg border border-hairline bg-card">
      {/* ---- Photograph, bleeding off the top edge ---- */}
      <Link
        href={`/destinations/${destination.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
        tabIndex={-1}
        aria-hidden
      >
        <CardImage
          src={destination.images[0]?.url ?? ""}
          alt=""
          // Deliberately lazy, including for the first row. This grid sits well
          // below the fold — under the hero and the quick picks — and Next
          // emits a <link rel="preload"> for every eager card image, so the
          // first three were competing for bandwidth with the hero photograph
          // on the connection that can least afford it. The hero is the only
          // image on the site that is prioritised; the shimmer placeholder
          // covers the gap for these.
          className="group-hover:scale-[1.04]"
        />

        <span
          aria-hidden
          className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-scrim/[0.55] to-transparent"
        />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-scrim/80 to-transparent"
        />

        {/* Category, top left */}
        <span className="absolute left-3 top-3 inline-flex items-center rounded-full bg-scrim/70 px-2.5 py-1 font-sans text-[0.6875rem] font-semibold text-on-scrim backdrop-blur-sm">
          {destination.category}
        </span>

        {/* Experience flag — the one place clay is allowed. Solid clay with
            white text rather than clay-on-scrim: #B5502D text over a dark
            photograph only reaches 3.9:1, and white on the same clay reaches
            5.1:1. */}
        {tier.key === "experience" ? (
          <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-clay px-2.5 py-1 font-sans text-[0.6875rem] font-semibold text-white shadow-sm">
            Experience
          </span>
        ) : null}

        {/* Rating chip, bottom left of the frame */}
        {leadGuide ? (
          <span
            className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-scrim/75 px-2.5 py-1 backdrop-blur-sm"
            aria-label={`Guide rating ${leadGuide.rating.toFixed(1)} out of 5, from ${leadGuide.reviewCount} reviews`}
          >
            <Star className="h-3.5 w-3.5 fill-primary text-primary" aria-hidden />
            <span className="font-sans text-[0.8125rem] font-bold leading-none text-on-scrim">
              {leadGuide.rating.toFixed(1)}
            </span>
            <span className="font-sans text-[0.6875rem] leading-none text-on-scrim/75">
              ({leadGuide.reviewCount})
            </span>
          </span>
        ) : null}

        {/* District, bottom right */}
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-on-scrim/90">
          <MapPin className="h-3 w-3" aria-hidden />
          {destination.location.district}
        </span>
      </Link>

      {/* ---- Body ---- */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-xl font-semibold leading-tight tracking-display">
          <Link
            href={`/destinations/${destination.slug}`}
            className="transition-colors hover:text-primary-ink"
          >
            {destination.name}
          </Link>
        </h3>

        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-sans text-[0.8125rem] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
            {tier.duration}
          </span>
          <span aria-hidden className="text-hairline">
            ·
          </span>
          <span className="font-mono text-xs">{distance}</span>
          <span aria-hidden className="text-hairline">
            ·
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
            {tier.maxParty} max
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

        {/* Price, in deep gold, crossfading as the tier changes.
            Stacks on a narrow card: the price, the "total · each" line and the
            "From" comparator are three separate figures, and at 375px they were
            sharing one row with only a few pixels between them. */}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {tier.badge ?? tierMeta(tier.key).tagline}
            </p>
            <p
              key={tier.key}
              data-readout
              className="animate-price-swap mt-1 font-display text-[1.75rem] font-semibold leading-none tracking-display text-primary-ink"
            >
              {formatUGX(tierQuote.total)}
            </p>
            <p className="mt-1.5 font-sans text-xs text-muted-foreground">
              total ·{" "}
              <span className="font-mono">{formatUGX(tierQuote.perPerson)}</span>{" "}
              each
            </p>
          </div>
          <span className="text-right sm:shrink-0">
            <span className="block font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {destination.pricingMode === "quotation" ? "Indicative" : "From"}
            </span>
            <span
              data-readout
              className="mt-1 block font-mono text-[0.8125rem] text-muted-foreground"
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
              className="flex items-start gap-2 font-sans text-[0.8125rem] leading-snug text-muted-foreground"
            >
              <Check
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success"
                strokeWidth={2.2}
                aria-hidden
              />
              {item}
            </li>
          ))}
          {tier.excludes.slice(0, 1).map((item) => (
            <li
              key={item}
              className="flex items-start gap-2 font-sans text-[0.8125rem] leading-snug text-muted-foreground/75"
            >
              <X className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
              {item}
            </li>
          ))}
        </ul>

        {match.upgradedForRequirements ? (
          <p className="mt-3 rounded-md border border-primary/30 bg-primary/[0.07] px-2.5 py-2 font-sans text-[0.75rem] leading-snug text-primary-ink">
            Priced at {tierMeta(tier.key).shortLabel} because you asked for
            something the cheaper tier leaves out.
          </p>
        ) : null}

        {/* Rating provenance, stated rather than implied. */}
        {leadGuide ? (
          <p className="mt-3 font-sans text-[0.6875rem] leading-relaxed text-muted-foreground">
            Rated for {leadGuide.name}, who leads this route.
          </p>
        ) : null}

        {/* ---- Actions ----
             Full-width buttons on a phone so both stay comfortably tappable
             (44px-ish targets, no text truncation), side by side from `sm`. */}
        <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row sm:items-center">
          <Link
            href={`/book/${destination.slug}?tier=${tier.key}`}
            className={cn(
              "sheen inline-flex h-10 w-full items-center justify-center gap-2 rounded-md px-3 sm:flex-1",
              "bg-primary font-sans text-[0.8125rem] font-semibold text-primary-foreground",
              "transition-colors hover:bg-primary-dark",
            )}
          >
            <ShoppingBag className="h-4 w-4" aria-hidden />
            Book
          </Link>
          <Link
            href={`/destinations/${destination.slug}`}
            className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md border border-hairline px-4 font-sans text-[0.8125rem] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary-ink sm:w-auto sm:shrink-0"
          >
            Details
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </article>
  );
}
