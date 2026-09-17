"use client";

import Link from "next/link";
import { useTierSelection } from "@/components/destinations/tier-selection-context";
import { formatUGX } from "@/lib/format";
import { tierMeta } from "@/data/tiers";
import { COMPONENT_ORDER, buildQuote } from "@/lib/marketplace/pricing";
import type { Destination } from "@/types/destination";
import { Check, Clock, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Sticky selection panel on the destination page.
 *
 * Quoted for a party of two, which is the baseline the published prices are set
 * against, so the figure here matches the tier price a reader just looked at.
 */
const BASELINE_PARTY = { adults: 2, children: 0 };

export function BookingWidget({ destination }: { destination: Destination }) {
  const { selectedIndex } = useTierSelection();
  const tier = destination.tiers[selectedIndex] ?? destination.tiers[0];

  const quote = buildQuote({
    destination,
    tier,
    party: BASELINE_PARTY,
    requirements: {
      transport: tier.components.transport.included,
      guide: tier.components.guide.included,
      meals: tier.components.meals.included,
    },
  });

  const bookingHref = `/book/${destination.slug}?tier=${tier.key}`;

  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-3">
          <div data-tier={tier.key} className="plate rounded-lg p-5">
            <span className="telemetry text-muted-foreground">
              Your selection
            </span>

            <p className="mt-2 font-display text-lg font-semibold leading-tight tracking-display">
              {tierMeta(tier.key).name}
            </p>

            <p
              data-readout
              className="mt-3 font-mono text-2xl font-bold leading-none tier-text"
            >
              {formatUGX(tier.price)}
            </p>
            <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
              per person · VAT included
            </p>

            <div className="mt-3 flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {tier.duration}
            </div>

            <ul className="mt-4 space-y-1.5 border-t border-hairline pt-4">
              {COMPONENT_ORDER.map((key) => {
                const included = tier.components[key].included;
                const label =
                  key === "transport"
                    ? "Boda transport"
                    : key === "guide"
                      ? "Licensed guide"
                      : "Meals";
                return (
                  <li
                    key={key}
                    className={cn(
                      "flex items-center gap-2 font-sans text-xs",
                      included ? "text-muted-foreground" : "text-muted-foreground/60",
                    )}
                  >
                    {included ? (
                      <Check className="h-3 w-3 shrink-0 text-success" aria-hidden />
                    ) : (
                      <Minus className="h-3 w-3 shrink-0" aria-hidden />
                    )}
                    {label}
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-hairline pt-4">
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                Two riders
              </span>
              <span
                data-readout
                className="font-mono text-base font-semibold text-foreground"
              >
                {formatUGX(quote.total)}
              </span>
            </div>

            {destination.pricingMode === "quotation" ? (
              <p className="mt-3 rounded-md border border-primary/30 bg-primary/[0.07] px-2.5 py-2 font-sans text-[0.6875rem] leading-snug text-primary">
                Indicative. This route is quoted by hand within 48 hours.
              </p>
            ) : null}

            <div className="mt-5">
              <Button asChild className="w-full" size="lg">
                <Link href={bookingHref}>
                  {destination.pricingMode === "quotation"
                    ? "Request a quote"
                    : "Book this ride"}
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
                </Link>
              </Button>
              <p className="mt-3 text-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                {destination.minLeadTimeHours}h notice · no booking fee
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-card/95 backdrop-blur-md lg:hidden">
        <div
          data-tier={tier.key}
          className="flex items-center justify-between gap-3 px-4 py-3"
        >
          <div className="min-w-0">
            <p className="truncate font-mono text-[0.625rem] uppercase tracking-[0.14em] tier-text">
              {tierMeta(tier.key).name}
            </p>
            <p
              data-readout
              className="font-mono text-base font-bold leading-tight text-foreground"
            >
              {formatUGX(tier.price)}
              <span className="ml-1 text-[0.5625rem] font-normal uppercase tracking-[0.12em] text-muted-foreground">
                pp
              </span>
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link href={bookingHref}>
              Book
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
