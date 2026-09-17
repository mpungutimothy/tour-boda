"use client";

import type { TierKey, TourTier } from "@/types/destination";
import { TIER_META, TIER_ORDER, tierMeta } from "@/data/tiers";
import { cn } from "@/lib/utils";

/**
 * Tier presentation.
 *
 * Every element here carries `data-tier`, which is what resolves
 * `--tier-color` in globals.css. Nothing hardcodes a hue, so the three tier
 * colours stay consistent across cards, tabs, table and booking flow, and can
 * be re-tuned in one place.
 */

export function TierDot({
  tierKey,
  className,
}: {
  tierKey: TierKey;
  className?: string;
}) {
  return (
    <span
      data-tier={tierKey}
      aria-hidden
      className={cn("inline-block h-1.5 w-1.5 rounded-full tier-fill", className)}
    />
  );
}

export function TierBadge({
  tierKey,
  children,
  className,
}: {
  tierKey: TierKey;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      data-tier={tierKey}
      className={cn(
        "tier-chip inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em]",
        className,
      )}
    >
      <TierDot tierKey={tierKey} />
      {children ?? tierMeta(tierKey).shortLabel}
    </span>
  );
}

/**
 * Single-choice tier selector. Rendered as a radio group, because it selects
 * one value rather than switching between panels.
 */
export function TierTabs({
  tiers,
  value,
  onChange,
  className,
  label = "Service level",
}: {
  tiers: TourTier[];
  value: TierKey;
  onChange: (key: TierKey) => void;
  className?: string;
  label?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "grid grid-cols-3 gap-1 rounded-md border border-hairline bg-background/60 p-1",
        className,
      )}
    >
      {tiers.map((tier) => {
        const active = tier.key === value;
        return (
          <button
            key={tier.key}
            type="button"
            role="radio"
            aria-checked={active}
            data-tier={tier.key}
            onClick={() => onChange(tier.key)}
            title={`${tierMeta(tier.key).name} — ${tierMeta(tier.key).tagline}`}
            className={cn(
              "relative rounded-[4px] px-1.5 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.1em] transition-all duration-200",
              active
                ? "tier-fill font-semibold"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {tierMeta(tier.key).shortLabel}
          </button>
        );
      })}
    </div>
  );
}

/** The three-tier explainer strip, used above a grid of cards. */
export function TierLegend({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-3",
        className,
      )}
    >
      {TIER_ORDER.map((key, index) => {
        const meta = TIER_META[key];
        return (
          <li key={key} data-tier={key} className="bg-background p-4">
            <div className="flex items-center gap-2">
              <TierDot tierKey={key} />
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] tier-text">
                Tier {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-2 font-display text-sm font-semibold leading-tight tracking-display">
              {meta.name}
            </h3>
            <p className="mt-1.5 font-sans text-xs leading-relaxed text-muted-foreground">
              {meta.summary}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

/** Compact per-tier price list, for the card's comparison strip. */
export function TierPriceStrip({
  tiers,
  value,
  onChange,
  formatPrice,
  className,
}: {
  tiers: TourTier[];
  value: TierKey;
  onChange: (key: TierKey) => void;
  formatPrice: (tier: TourTier) => string;
  className?: string;
}) {
  return (
    <ul className={cn("grid grid-cols-3 gap-px bg-hairline", className)}>
      {tiers.map((tier) => {
        const active = tier.key === value;
        return (
          <li key={tier.key} data-tier={tier.key} className="bg-card">
            <button
              type="button"
              onClick={() => onChange(tier.key)}
              aria-pressed={active}
              className={cn(
                "flex w-full flex-col items-start gap-1 px-3 py-2.5 text-left transition-colors",
                active ? "tier-soft" : "hover:bg-accent",
              )}
            >
              <span
                className={cn(
                  "font-mono text-[0.5625rem] uppercase tracking-[0.14em]",
                  active ? "tier-text" : "text-muted-foreground",
                )}
              >
                {tierMeta(tier.key).shortLabel}
              </span>
              <span
                data-readout
                className={cn(
                  "font-mono text-xs font-semibold",
                  active ? "tier-text" : "text-foreground",
                )}
              >
                {formatPrice(tier)}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
