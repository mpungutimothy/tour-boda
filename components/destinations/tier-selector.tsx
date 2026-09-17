"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion, formatUGX } from "@/lib/motion";
import { useTierSelection } from "@/components/destinations/tier-selection-context";
import { TierTabs } from "@/components/marketplace/tier-ui";
import { COMPONENT_LABELS, COMPONENT_ORDER } from "@/lib/marketplace/pricing";
import { tierMeta } from "@/data/tiers";
import type { Destination } from "@/types/destination";
import { Check, Minus, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * The three-tier comparison.
 *
 * This is the commerce centrepiece of the destination page, so the table is
 * scannable by row (price, then what each level includes) and the cards below
 * are the primary, keyboard-accessible selector.
 */
export function TierSelector({ destination }: { destination: Destination }) {
  const reduced = usePrefersReducedMotion();
  const { selectedIndex, selectTier } = useTierSelection();

  const selectedKey = destination.tiers[selectedIndex]?.key ?? "freelance";

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-primary">04</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Packages</span>
      </div>

      <h2 className="mb-2 font-display text-2xl font-bold leading-tight tracking-display sm:text-3xl">
        Compare the three service levels
      </h2>
      <p className="mb-6 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
        The same road, at three levels of service. Pick the level here and the
        booking panel follows your choice.
      </p>

      {/* Selector for narrow screens, where the table needs sideways scrolling. */}
      <TierTabs
        tiers={destination.tiers}
        value={selectedKey}
        onChange={(key) => {
          const index = destination.tiers.findIndex((tier) => tier.key === key);
          if (index >= 0) selectTier(index);
        }}
        className="mb-6 lg:hidden"
        label={`Service level for ${destination.name}`}
      />

      {/* Comparison table. Column headers hold real buttons so selection works
          from the keyboard; the cards below remain the primary selector. */}
      <div className="mb-8 overflow-x-auto rounded-lg border border-hairline">
        <table className="w-full min-w-[46rem] text-left">
          <caption className="sr-only">
            Package comparison for {destination.name}
          </caption>
          <thead>
            <tr className="border-b border-hairline bg-surface">
              <th
                scope="col"
                className="px-4 py-3 text-left font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
              >
                Feature
              </th>
              {destination.tiers.map((tier, index) => (
                <th
                  key={tier.key}
                  scope="col"
                  data-tier={tier.key}
                  className={cn(
                    "px-4 py-3 align-bottom",
                    selectedIndex === index && "tier-soft",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => selectTier(index)}
                    aria-pressed={selectedIndex === index}
                    className={cn(
                      "w-full text-left transition-colors",
                      selectedIndex === index
                        ? "tier-text"
                        : "text-foreground hover:tier-text",
                    )}
                  >
                    <span className="block font-mono text-[0.5625rem] uppercase tracking-[0.16em]">
                      Tier {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block font-display text-sm font-semibold uppercase tracking-[0.04em]">
                      {tier.name}
                    </span>
                    {tier.badge ? (
                      <span className="mt-1 block font-mono text-[0.5625rem] uppercase tracking-[0.14em] tier-text">
                        {tier.badge}
                      </span>
                    ) : null}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-hairline">
              <th
                scope="row"
                className="px-4 py-3 text-left font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
              >
                Price
              </th>
              {destination.tiers.map((tier, index) => (
                <td
                  key={tier.key}
                  data-tier={tier.key}
                  className={cn(
                    "px-4 py-3 align-bottom",
                    selectedIndex === index && "tier-soft",
                  )}
                >
                  <span
                    data-readout
                    className={cn(
                      "block font-mono text-base font-bold",
                      selectedIndex === index ? "tier-text" : "text-foreground",
                    )}
                  >
                    {formatUGX(tier.price)}
                  </span>
                  <span className="mt-0.5 block font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground">
                    per person
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-hairline">
              <th
                scope="row"
                className="px-4 py-3 text-left font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
              >
                Duration
              </th>
              {destination.tiers.map((tier, index) => (
                <td
                  key={tier.key}
                  className={cn(
                    "px-4 py-3 font-sans text-sm",
                    selectedIndex === index && "tier-soft",
                  )}
                >
                  {tier.duration}
                  <span className="mt-0.5 block font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground">
                    up to {tier.maxParty} riders
                  </span>
                </td>
              ))}
            </tr>

            {/* Component rows — the mechanical difference between the tiers. */}
            {COMPONENT_ORDER.map((key) => (
              <tr key={key} className="border-b border-hairline">
                <th
                  scope="row"
                  className="px-4 py-3 text-left font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
                >
                  {COMPONENT_LABELS[key]}
                </th>
                {destination.tiers.map((tier, index) => {
                  const component = tier.components[key];
                  return (
                    <td
                      key={tier.key}
                      className={cn(
                        "px-4 py-3 font-sans text-sm",
                        selectedIndex === index && "tier-soft",
                      )}
                    >
                      {component.included ? (
                        <span className="inline-flex items-center gap-1.5 text-success">
                          <Check className="h-3.5 w-3.5" aria-hidden />
                          Included
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                          <Minus className="h-3.5 w-3.5" aria-hidden />
                          {formatUGX(component.value)} to add
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            <tr className="border-b border-hairline">
              <th
                scope="row"
                className="px-4 py-3 text-left align-top font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
              >
                Includes
              </th>
              {destination.tiers.map((tier, index) => (
                <td
                  key={tier.key}
                  className={cn(
                    "px-4 py-3",
                    selectedIndex === index && "tier-soft",
                  )}
                >
                  <ul className="space-y-1">
                    {tier.inclusions.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-1.5 font-sans text-xs leading-snug text-muted-foreground"
                      >
                        <Check
                          aria-hidden
                          className="mt-0.5 h-3 w-3 shrink-0 text-success"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr className="border-b border-hairline">
              <th
                scope="row"
                className="px-4 py-3 text-left align-top font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
              >
                Not included
              </th>
              {destination.tiers.map((tier, index) => (
                <td
                  key={tier.key}
                  className={cn(
                    "px-4 py-3",
                    selectedIndex === index && "tier-soft",
                  )}
                >
                  <ul className="space-y-1">
                    {tier.excludes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-1.5 font-sans text-xs leading-snug text-muted-foreground/70"
                      >
                        <Minus aria-hidden className="mt-0.5 h-3 w-3 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <th
                scope="row"
                className="px-4 py-3 text-left align-top font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
              >
                Best for
              </th>
              {destination.tiers.map((tier, index) => (
                <td
                  key={tier.key}
                  className={cn(
                    "max-w-[18rem] px-4 py-3 font-sans text-xs text-muted-foreground",
                    selectedIndex === index && "tier-soft",
                  )}
                >
                  {tier.bestFor}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Selectable cards — the primary, fully keyboard-accessible selector. */}
      <div className="grid gap-4 sm:grid-cols-3">
        {destination.tiers.map((tier, index) => {
          const selected = selectedIndex === index;
          const meta = tierMeta(tier.key);
          return (
            <motion.button
              key={tier.key}
              type="button"
              data-tier={tier.key}
              onClick={() => selectTier(index)}
              aria-pressed={selected}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: index * 0.08, ease: "easeOut" }}
              className={cn(
                "relative rounded-lg border bg-card p-5 text-left transition-all duration-200",
                selected
                  ? "tier-border tier-ring"
                  : "border-hairline hover:border-primary/40",
              )}
            >
              {selected ? (
                <span
                  aria-hidden
                  className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full tier-fill"
                >
                  <Check className="h-3 w-3" />
                </span>
              ) : null}

              <span className="telemetry text-muted-foreground">
                Tier {String(index + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 block font-display text-lg font-semibold leading-tight tracking-display">
                {meta.name}
              </span>
              <span
                data-readout
                className="mt-2 block font-mono text-xl font-semibold tier-text"
              >
                {formatUGX(tier.price)}
              </span>
              <span className="mt-1 block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                {tier.duration} · per person
              </span>
              <span className="mt-3 block font-sans text-xs leading-relaxed text-muted-foreground">
                {tier.bestFor}
              </span>

              <span className="mt-4 flex items-center gap-1.5 border-t border-hairline pt-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                {selected ? "Selected" : "Select this level"}
                {!selected ? (
                  <ArrowRight className="h-3 w-3" aria-hidden />
                ) : null}
              </span>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button asChild size="lg">
          <Link href={`/book/${destination.slug}?tier=${selectedKey}`}>
            Continue to booking
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Link>
        </Button>
        <p className="font-sans text-xs text-muted-foreground">
          Party size, add-ons and the full price come next.
        </p>
      </div>
    </section>
  );
}
