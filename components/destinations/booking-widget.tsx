"use client";

import Link from "next/link";
import { useTierSelection } from "@/components/destinations/tier-selection-context";
import { formatUGX } from "@/lib/motion";
import type { Destination } from "@/types/destination";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * NOTE: the CTA previously read "Book Now" but had no handler and there is no
 * booking route in the app, so it did nothing when clicked. It now links to
 * /contact and is labelled for what it actually does. Wire it to a real
 * checkout and the label can go back.
 */
export function BookingWidget({ destination }: { destination: Destination }) {
  const { selectedIndex } = useTierSelection();
  const tier = destination.tiers[selectedIndex];

  return (
    <>
      {/* Desktop sticky sidebar — stays on the night road while the reading
          column runs in the midday band. */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-lg border border-hairline bg-card p-5">
          <span className="telemetry text-muted-foreground">Your selection</span>

          <p className="mt-2 font-display text-lg font-semibold uppercase leading-tight tracking-[0.02em]">
            {tier.name}
          </p>

          <p
            data-readout
            className="mt-3 font-mono text-2xl font-bold leading-none text-primary"
          >
            {formatUGX(tier.price)}
          </p>

          <div className="mt-3 flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
            <Clock className="h-3.5 w-3.5" aria-hidden />
            {tier.duration}
          </div>

          <div className="mt-5 border-t border-hairline pt-5">
            <Button asChild className="w-full" size="lg">
              <Link href="/contact">
                Request this ride
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-3 text-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
              No payment to reserve
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-card/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
              {tier.name}
            </p>
            <p
              data-readout
              className="font-mono text-base font-bold leading-tight text-primary"
            >
              {formatUGX(tier.price)}
            </p>
          </div>
          <Button asChild size="sm" className="shrink-0">
            <Link href="/contact">
              Request
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
