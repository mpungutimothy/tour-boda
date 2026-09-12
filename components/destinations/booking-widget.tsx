"use client";

import { useTierSelection } from "@/components/destinations/tier-selection-context";
import { formatUGX } from "@/lib/motion";
import type { Destination } from "@/types/destination";
import { Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BookingWidget({ destination }: { destination: Destination }) {
  const { selectedIndex } = useTierSelection();
  const tier = destination.tiers[selectedIndex];

  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-24 rounded-lg border border-border bg-card p-5 shadow-warm-md">
          <h3 className="font-serif text-lg font-semibold text-ink">Book This Tour</h3>
          <div className="mt-4 space-y-3">
            <div className="rounded-md bg-surface px-3 py-3">
              <p className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Selected Package</p>
              <p className="mt-0.5 font-serif text-base font-semibold text-ink">{tier.name}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-sans text-sm text-muted-foreground">Price</span>
              <span className="font-mono text-xl font-bold text-primary">{formatUGX(tier.price)}</span>
            </div>
            <div className="flex items-center gap-2 font-sans text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {tier.duration}
            </div>
            <Button className="w-full" size="lg">
              <Calendar className="mr-2 h-4 w-4" />
              Book Now
            </Button>
            <p className="text-center font-mono text-xs text-muted-foreground">
              No payment required to reserve
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile sticky bottom bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate font-sans text-xs text-muted-foreground">{tier.name}</p>
            <p className="font-mono text-base font-bold text-primary">{formatUGX(tier.price)}</p>
          </div>
          <Button size="sm" className="shrink-0">
            <Calendar className="mr-1.5 h-4 w-4" />
            Book Now
          </Button>
        </div>
      </div>
    </>
  );
}
