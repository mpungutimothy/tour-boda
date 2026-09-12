"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion, formatUGX } from "@/lib/motion";
import { useTierSelection } from "@/components/destinations/tier-selection-context";
import type { Destination } from "@/types/destination";
import { Check, Package } from "lucide-react";
import { cn } from "@/lib/utils";

export function TierSelector({ destination }: { destination: Destination }) {
  const reduced = usePrefersReducedMotion();
  const { selectedIndex, selectTier } = useTierSelection();

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <Package className="h-5 w-5 text-primary" />
        <h2 className="font-serif text-xl font-semibold">Choose Your Package</h2>
      </div>

      {/* Comparison table */}
      <div className="mb-8 overflow-x-auto rounded-lg border border-border shadow-warm-sm">
        <table className="w-full text-left">
          <thead className="bg-surface">
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-mono text-xs uppercase tracking-wide text-muted-foreground">Feature</th>
              {destination.tiers.map((tier, i) => (
                <th
                  key={i}
                  className={cn(
                    "cursor-pointer px-4 py-3 font-serif text-sm font-semibold transition-colors",
                    selectedIndex === i ? "text-primary" : "text-ink hover:text-primary"
                  )}
                  onClick={() => selectTier(i)}
                >
                  {tier.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-card">
            <tr className="border-b border-border/60">
              <td className="px-4 py-3 font-mono text-xs uppercase text-muted-foreground">Price</td>
              {destination.tiers.map((tier, i) => (
                <td
                  key={i}
                  className={cn("px-4 py-3 font-mono text-sm font-semibold", selectedIndex === i ? "text-primary" : "text-ink")}
                >
                  {formatUGX(tier.price)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-4 py-3 font-mono text-xs uppercase text-muted-foreground">Duration</td>
              {destination.tiers.map((tier, i) => (
                <td key={i} className="px-4 py-3 font-sans text-sm text-ink">{tier.duration}</td>
              ))}
            </tr>
            <tr className="border-b border-border/60">
              <td className="px-4 py-3 font-mono text-xs uppercase text-muted-foreground">Inclusions</td>
              {destination.tiers.map((tier, i) => (
                <td key={i} className="px-4 py-3">
                  <ul className="space-y-1">
                    {tier.inclusions.map((inc, j) => (
                      <li key={j} className="flex items-start gap-1.5 font-sans text-xs text-ink/80">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className="px-4 py-3 font-mono text-xs uppercase text-muted-foreground">Best for</td>
              {destination.tiers.map((tier, i) => (
                <td key={i} className="px-4 py-3 font-sans text-xs text-muted-foreground">{tier.bestFor}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Selectable cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {destination.tiers.map((tier, i) => (
          <motion.button
            key={i}
            onClick={() => selectTier(i)}
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: "easeOut" }}
            whileHover={reduced ? undefined : { y: -4 }}
            className={cn(
              "relative rounded-lg border-2 bg-card p-5 text-left shadow-warm-sm transition-colors",
              selectedIndex === i
                ? "border-primary shadow-warm-md"
                : "border-border hover:border-primary/40"
            )}
          >
            {selectedIndex === i && (
              <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Check className="h-3 w-3" />
              </span>
            )}
            <h3 className="font-serif text-lg font-semibold text-ink">{tier.name}</h3>
            <p className="mt-1 font-mono text-xl font-semibold text-primary">{formatUGX(tier.price)}</p>
            <p className="mt-1 font-sans text-xs text-muted-foreground">{tier.duration}</p>
            <p className="mt-3 font-sans text-xs text-ink/70">{tier.bestFor}</p>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
