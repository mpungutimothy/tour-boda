import Link from "next/link";
import type { Destination } from "@/types/destination";
import { fromPrice } from "@/data/destinations";
import { guidesForDestination } from "@/data/guides";
import { tierMeta } from "@/data/tiers";
import { formatUGX } from "@/lib/format";
import {
  InstrumentCluster,
  Readout,
  ScrimTag,
} from "@/components/instrument/readouts";
import { TierDot } from "@/components/marketplace/tier-ui";
import { ChevronRight, Star } from "lucide-react";

/**
 * Route hero.
 *
 * Carries a visible breadcrumb trail, because the page emits BreadcrumbList
 * markup and Google asks that structured data reflect content a reader can
 * actually see.
 */
export function DestinationHero({ destination }: { destination: Destination }) {
  const hero = destination.images[0];
  const guides = guidesForDestination(destination.slug);

  const fact = (label: string) =>
    destination.keyFacts.find((f) => f.label.toLowerCase() === label.toLowerCase())
      ?.value;

  const candidates = [
    { label: "Distance", value: fact("Total distance"), tone: "data" as const },
    { label: "Duration", value: fact("Duration"), tone: "signal" as const },
    { label: "Departs", value: fact("Starting point"), tone: "default" as const },
    { label: "Conditions", value: fact("Best time"), tone: "default" as const },
  ];
  const readouts = candidates.filter(
    (r): r is { label: string; value: string; tone: "default" | "signal" | "data" } =>
      typeof r.value === "string" && r.value.length > 0,
  );

  return (
    <section className="theme-shell relative isolate flex min-h-[88vh] flex-col justify-end overflow-hidden">
      {/* Windscreen: the road ahead. */}
      <div className="absolute inset-0 -z-10">
        {hero ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={hero.url}
            alt={hero.caption || destination.name}
            className="duotone h-full w-full object-cover"
          />
        ) : null}
        <div
          aria-hidden
          className="absolute inset-0 bg-primary/[0.14] mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/80 to-scrim/[0.45]" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 pb-10 pt-24 sm:px-6 lg:px-8 lg:pb-14">
        {/* Visible breadcrumb, matching the BreadcrumbList in the JSON-LD. */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-on-scrim/60">
            <li>
              <Link href="/" className="transition-colors hover:text-on-scrim">
                Home
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <Link href="/tours" className="transition-colors hover:text-on-scrim">
                All routes
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="h-3 w-3" />
            </li>
            <li>
              <span aria-current="page" className="text-on-scrim/90">
                {destination.name}
              </span>
            </li>
          </ol>
        </nav>

        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <ScrimTag tone="signal">{destination.category}</ScrimTag>
            <ScrimTag>{destination.location.region}</ScrimTag>
            {destination.pricingMode === "quotation" ? (
              <ScrimTag tone="signal">Priced by quotation</ScrimTag>
            ) : null}
          </div>

          <h1 className="mt-5 font-display text-5xl font-bold leading-[0.95] tracking-display-lg text-on-scrim sm:text-6xl lg:text-7xl">
            {destination.name}
          </h1>

          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 font-mono text-xs uppercase tracking-[0.16em] text-on-scrim/70">
            <span>
              Guide{" "}
              <span className="text-on-scrim">{destination.author.name}</span>
            </span>
            {guides[0] ? (
              <>
                <span aria-hidden className="text-on-scrim/40">
                  ·
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-3 w-3 fill-primary text-primary" aria-hidden />
                  <span className="text-on-scrim">{guides[0].rating.toFixed(1)}</span>
                  <span className="text-on-scrim/60">
                    ({guides[0].reviewCount} reviews)
                  </span>
                </span>
              </>
            ) : null}
          </p>

          {/* The three levels, on the hero, so the model is visible immediately. */}
          <ul className="mt-6 flex flex-wrap items-stretch gap-2">
            {destination.tiers.map((tier) => (
              <li
                key={tier.key}
                data-tier={tier.key}
                className="rounded-md border border-on-scrim/25 bg-scrim/60 px-3 py-2 backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  <TierDot tierKey={tier.key} />
                  <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] tier-text">
                    {tierMeta(tier.key).shortLabel}
                  </span>
                </span>
                <span
                  data-readout
                  className="mt-1 block font-mono text-sm font-bold text-on-scrim"
                >
                  {formatUGX(tier.price)}
                </span>
                <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-on-scrim/60">
                  {tier.duration}
                </span>
              </li>
            ))}
            <li className="flex flex-col justify-center rounded-md border border-primary/40 bg-scrim/60 px-3 py-2 backdrop-blur-sm">
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-on-scrim/60">
                From
              </span>
              <span
                data-readout
                className="mt-1 font-display text-base font-semibold text-primary-ink"
              >
                {formatUGX(fromPrice(destination))}
              </span>
              <span className="font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-on-scrim/60">
                per person
              </span>
            </li>
          </ul>
        </div>

        {/* The cluster. */}
        <div className="mt-10 border-t border-on-scrim/20 pt-6">
          <InstrumentCluster onScrim>
            {readouts.map((readout, i) => (
              <div
                key={readout.label}
                className="animate-readout-in"
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <Readout
                  onScrim
                  label={readout.label}
                  value={readout.value}
                  tone={readout.tone}
                />
              </div>
            ))}
          </InstrumentCluster>
        </div>
      </div>
    </section>
  );
}
