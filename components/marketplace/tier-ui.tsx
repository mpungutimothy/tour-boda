"use client";

import type { TierKey, TourTier } from "@/types/destination";
import { TIER_META, TIER_ORDER, tierMeta } from "@/data/tiers";
import { cn } from "@/lib/utils";

/**
 * Tier presentation.
 *
 * Active state is gold for every tier. That is deliberate: gold marks the
 * *choice*, and three competing tier hues fighting for attention would make the
 * selected option the least obvious thing on the card. The levels stay
 * distinguishable through their labels, their prices, and the small legend
 * dots, which use each tier's own hue.
 *
 * Clay appears exactly once in this file — on the Experience flag.
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
      className={cn("inline-block h-2 w-2 rounded-full tier-bg", className)}
    />
  );
}

/** The Experience flag. The only clay on the site. */
export function ExperienceFlag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flag-experience inline-flex items-center rounded-full px-2 py-0.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.1em]",
        className,
      )}
    >
      Experience
    </span>
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
        "tier-chip inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[0.6875rem] font-semibold",
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
        "grid grid-cols-3 gap-1 rounded-md border border-hairline bg-field p-1",
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
              "relative rounded-[5px] px-1.5 py-2 font-sans text-[0.6875rem] font-semibold transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-background hover:text-foreground",
            )}
          >
            {tierMeta(tier.key).shortLabel}
          </button>
        );
      })}
    </div>
  );
}

/** The three-tier explainer strip, used above or below a grid of cards. */
export function TierLegend({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-3",
        className,
      )}
    >
      {TIER_ORDER.map((key, index) => {
        const meta = TIER_META[key];
        return (
          <li key={key} data-tier={key} className="bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2">
                <TierDot tierKey={key} />
                <span className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Level {index + 1}
                </span>
              </span>
              {key === "experience" ? <ExperienceFlag /> : null}
            </div>
            <h3 className="mt-2.5 font-display text-base font-semibold tracking-display">
              {meta.name}
            </h3>
            <p className="mt-1.5 font-sans text-[0.8125rem] leading-relaxed text-muted-foreground">
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
                active ? "bg-primary/[0.08]" : "hover:bg-accent",
              )}
            >
              <span
                className={cn(
                  "font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em]",
                  active ? "text-primary-ink" : "text-muted-foreground",
                )}
              >
                {tierMeta(tier.key).shortLabel}
              </span>
              <span
                data-readout
                className={cn(
                  "font-mono text-xs font-semibold",
                  active ? "text-primary-ink" : "text-foreground",
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
