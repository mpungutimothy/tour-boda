"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion, formatUGX } from "@/lib/motion";
import { useTierSelection } from "@/components/destinations/tier-selection-context";
import type { Destination } from "@/types/destination";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function TierSelector({ destination }: { destination: Destination }) {
  const reduced = usePrefersReducedMotion();
  const { selectedIndex, selectTier } = useTierSelection();

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-data">04</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Packages</span>
      </div>

      <h2 className="mb-6 font-display text-2xl font-bold uppercase leading-tight tracking-[0.01em] sm:text-3xl">
        Compare the tiers
      </h2>

      {/* Comparison table. Column headers hold real buttons so selection works
          from the keyboard; the cards below are the primary selector. */}
      <div className="mb-8 overflow-x-auto rounded-lg border border-hairline">
        <table className="w-full min-w-[34rem] text-left">
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
              {destination.tiers.map((tier, i) => (
                <th key={tier.name} scope="col" className="px-4 py-2">
                  <button
                    type="button"
                    onClick={() => selectTier(i)}
                    aria-pressed={selectedIndex === i}
                    className={cn(
                      "w-full text-left font-display text-sm font-semibold uppercase tracking-[0.04em] transition-colors",
                      selectedIndex === i
                        ? "text-primary"
                        : "text-foreground hover:text-primary",
                    )}
                  >
                    {tier.name}
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
              {destination.tiers.map((tier, i) => (
                <td
                  key={tier.name}
                  data-readout
                  className={cn(
                    "px-4 py-3 font-mono text-sm font-semibold",
                    selectedIndex === i ? "text-primary" : "text-foreground",
                  )}
                >
                  {formatUGX(tier.price)}
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
              {destination.tiers.map((tier) => (
                <td key={tier.name} className="px-4 py-3 font-sans text-sm">
                  {tier.duration}
                </td>
              ))}
            </tr>
            <tr className="border-b border-hairline">
              <th
                scope="row"
                className="px-4 py-3 text-left align-top font-mono text-[0.625rem] font-normal uppercase tracking-[0.16em] text-muted-foreground"
              >
                Inclusions
              </th>
              {destination.tiers.map((tier) => (
                <td key={tier.name} className="px-4 py-3">
                  <ul className="space-y-1">
                    {tier.inclusions.map((inc) => (
                      <li
                        key={inc}
                        className="flex items-start gap-1.5 font-sans text-xs text-muted-foreground"
                      >
                        <Check
                          aria-hidden
                          className="mt-0.5 h-3 w-3 shrink-0 text-success"
                        />
                        {inc}
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
              {destination.tiers.map((tier) => (
                <td
                  key={tier.name}
                  className="max-w-[16rem] px-4 py-3 font-sans text-xs text-muted-foreground"
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
        {destination.tiers.map((tier, i) => {
          const selected = selectedIndex === i;
          return (
            <motion.button
              key={tier.name}
              type="button"
              onClick={() => selectTier(i)}
              aria-pressed={selected}
              initial={reduced ? false : { opacity: 0, y: 18 }}
              whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.35, delay: i * 0.08, ease: "easeOut" }}
              className={cn(
                "relative rounded-lg border bg-card p-5 text-left transition-colors",
                selected
                  ? "border-primary ring-1 ring-primary"
                  : "border-hairline hover:border-primary/50",
              )}
            >
              {selected ? (
                <span
                  aria-hidden
                  className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                >
                  <Check className="h-3 w-3" />
                </span>
              ) : null}

              <span className="telemetry text-muted-foreground">
                Tier {String(i + 1).padStart(2, "0")}
              </span>
              <span className="mt-2 block font-display text-lg font-semibold uppercase leading-tight tracking-[0.02em]">
                {tier.name}
              </span>
              <span
                data-readout
                className="mt-2 block font-mono text-xl font-semibold text-primary"
              >
                {formatUGX(tier.price)}
              </span>
              <span className="mt-1 block font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                {tier.duration}
              </span>
              <span className="mt-3 block font-sans text-xs leading-relaxed text-muted-foreground">
                {tier.bestFor}
              </span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
