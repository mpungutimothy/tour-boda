import { getDestination, getTier } from "@/data/destinations";
import {
  OPERATOR_DAY_RATE_BAND,
  REVENUE_SPLIT,
  TRAVELLER_FEES,
  splitRevenue,
} from "@/data/revenue";
import { tierMeta } from "@/data/tiers";
import { formatUGX } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Where the money goes.
 *
 * Rendered from the same split constants the rest of the app uses, and worked
 * against a real package from the catalogue rather than an invented figure, so
 * the numbers on the slide and the numbers on the tour page cannot drift apart.
 *
 * The split is drawn as one horizontal stacked bar with a legend beneath it,
 * rather than the donut this used to be. A stacked bar reads left-to-right the
 * way the money is described in prose ("sixty per cent to the road, twenty-five
 * to the destination, fifteen to run it"), and the three segments sit on one
 * baseline, which is what makes 60 against 25 against 15 immediately legible.
 */

const PARTY_COLOR: Record<string, string> = {
  operator: "hsl(var(--primary))", // gold
  provider: "hsl(var(--success))", // green
  platform: "hsl(var(--clay))", // clay
};

export function RevenueModel({
  destinationSlug = "kampala-city-heritage",
  tierKey = "guided",
  className,
}: {
  destinationSlug?: string;
  tierKey?: "freelance" | "guided" | "experience";
  className?: string;
}) {
  const destination = getDestination(destinationSlug);
  const tier = destination ? getTier(destination, tierKey) : undefined;

  if (!destination || !tier) return null;

  const packagePrice = tier.price;
  const shares = splitRevenue(packagePrice);
  const operatorShare = shares.find((share) => share.id === "operator");
  const insideBand =
    operatorShare !== undefined &&
    operatorShare.amount >= OPERATOR_DAY_RATE_BAND.min &&
    operatorShare.amount <= OPERATOR_DAY_RATE_BAND.max;

  return (
    <div className={cn("min-w-0", className)}>
      {/* ---- Worked example ----
           Stacks on a phone: "Every shilling of a Kampala City Heritage ·
           Guided Tour, per person" and "Package UGX 150,000" are two separate
           facts and read badly squeezed onto one line at 375px. */}
      <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:justify-between sm:gap-x-6 sm:gap-y-2">
        <p className="font-sans text-sm text-muted-foreground">
          Every shilling of a{" "}
          <span className="font-semibold text-foreground">
            {destination.name}
          </span>{" "}
          · {tierMeta(tier.key).name}, per person
        </p>
        <p className="font-sans text-sm text-muted-foreground">
          Package{" "}
          <span
            data-readout
            className="numeric-emphasis font-mono text-base"
          >
            {formatUGX(packagePrice)}
          </span>
        </p>
      </div>

      {/* ---- The stacked bar ---- */}
      <div
        className="mt-4 flex h-14 w-full overflow-hidden rounded-lg border border-hairline"
        role="img"
        aria-label={`Revenue split of a ${formatUGX(packagePrice)} package: ${shares
          .map(
            (share) =>
              `${share.label} ${Math.round(share.share * 100)} percent, ${formatUGX(
                share.amount,
              )}`,
          )
          .join("; ")}`}
      >
        {shares.map((share) => {
          const percent = Math.round(share.share * 100);
          return (
            <div
              key={share.id}
              className="relative flex origin-left animate-bar-grow items-center justify-center"
              style={{
                width: `${share.share * 100}%`,
                backgroundColor: PARTY_COLOR[share.id],
              }}
            >
              {/* The percentage is painted inline only where the segment is
                  comfortably wide enough to hold it.

                  At 375px the 15% segment is about 43px and a 14px "15%" is
                  about 28px, which leaves too little margin to survive a font
                  metric difference. Nothing overlaps — the bar clips its
                  children — but a clipped number reads as a rendering fault, so
                  the threshold sits at 20% and the label steps down a size on
                  phones. The legend below carries every figure regardless. */}
              {percent >= 20 ? (
                <span
                  className="font-sans text-xs font-bold sm:text-sm"
                  style={{
                    // Both non-gold segments are dark fills (deep green, clay),
                    // so they take the success foreground token rather than a
                    // literal #FFFFFF. It resolves to white in the light scope,
                    // which is where this bar always sits, and keeps the last
                    // hardcoded colour out of the component layer.
                    color:
                      share.id === "operator"
                        ? "hsl(var(--primary-foreground))"
                        : "hsl(var(--success-foreground))",
                  }}
                >
                  {percent}%
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* ---- Legend ---- */}
      <ul className="mt-6 grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-3">
        {shares.map((share) => (
          <li key={share.id}>
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="h-3 w-3 shrink-0 rounded-sm"
                style={{ backgroundColor: PARTY_COLOR[share.id] }}
              />
              <span className="font-display text-base font-semibold tracking-display">
                {share.label}
              </span>
            </div>

            <p className="mt-2.5 flex items-baseline gap-2">
              <span
                data-readout
                className="font-sans text-lg font-semibold text-foreground"
              >
                {Math.round(share.share * 100)}%
              </span>
              <span
                data-readout
                className="font-mono text-sm text-muted-foreground"
              >
                {formatUGX(share.amount)}
              </span>
            </p>

            <p className="mt-2 font-sans text-[0.8125rem] leading-relaxed text-muted-foreground">
              {share.description}
            </p>
          </li>
        ))}
      </ul>

      {/* ---- Sanity check against the concept note's operator band ---- */}
      <div className="mt-8 grid grid-cols-1 gap-6 rounded-lg border border-hairline bg-card p-5 sm:grid-cols-2">
        <div>
          <p className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Operator day-rate band
          </p>
          <p
            data-readout
            className="mt-1.5 font-mono text-base font-semibold text-foreground"
          >
            {OPERATOR_DAY_RATE_BAND.label}
          </p>
          <p
            className={cn(
              "mt-1.5 flex items-center gap-1.5 font-sans text-xs font-semibold",
              insideBand ? "text-success" : "text-primary-ink",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                insideBand ? "dot-trust" : "bg-primary",
              )}
            />
            {insideBand
              ? "The 60% share lands inside the band"
              : "The 60% share sits above the band"}
          </p>
        </div>
        <div>
          <p className="font-sans text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            Traveller booking fee
          </p>
          <p
            data-readout
            className="mt-1.5 font-mono text-base font-semibold text-foreground"
          >
            {formatUGX(TRAVELLER_FEES.bookingFee)}
          </p>
          <p className="mt-1.5 font-sans text-xs leading-snug text-muted-foreground">
            The platform is paid out of the package, not on top of it.
          </p>
        </div>
      </div>

      <p className="mt-4 font-sans text-xs leading-relaxed text-muted-foreground">
        {OPERATOR_DAY_RATE_BAND.note}
      </p>
    </div>
  );
}

/** A one-line version of the split, for the header of other sections. */
export function RevenueSummaryStrip({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs font-medium",
        className,
      )}
    >
      {REVENUE_SPLIT.map((party) => (
        <li key={party.id} className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: PARTY_COLOR[party.id] }}
          />
          <span className="text-muted-foreground">
            {party.shortLabel}{" "}
            <span data-readout className="numeric-emphasis font-mono">
              {Math.round(party.share * 100)}%
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
