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
 */

const PARTY_COLOR: Record<string, string> = {
  operator: "hsl(var(--chart-1))",
  provider: "hsl(var(--chart-2))",
  platform: "hsl(var(--chart-3))",
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

  // Donut geometry. `pathLength={100}` on each circle makes the dash maths
  // read as percentages rather than arc lengths.
  const radius = 62;
  const size = 168;
  const stroke = 20;
  const centre = size / 2;

  let cursor = 0;
  const segments = shares.map((share) => {
    const segment = {
      ...share,
      dash: share.share * 100,
      offset: -cursor * 100,
    };
    cursor += share.share;
    return segment;
  });

  return (
    <div className={cn("grid gap-10 lg:grid-cols-[auto_1fr] lg:gap-14", className)}>
      {/* ---- Donut ---- */}
      <div className="flex flex-col items-center gap-5">
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            role="img"
            aria-label={`Revenue split of a ${formatUGX(packagePrice)} package: ${shares
              .map((share) => `${share.label} ${Math.round(share.share * 100)} percent`)
              .join(", ")}`}
          >
            <circle
              cx={centre}
              cy={centre}
              r={radius}
              fill="none"
              stroke="hsl(var(--hairline))"
              strokeWidth={stroke}
            />
            <g transform={`rotate(-90 ${centre} ${centre})`}>
              {segments.map((segment) => (
                <circle
                  key={segment.id}
                  cx={centre}
                  cy={centre}
                  r={radius}
                  fill="none"
                  stroke={PARTY_COLOR[segment.id]}
                  strokeWidth={stroke}
                  pathLength={100}
                  strokeDasharray={`${segment.dash} ${100 - segment.dash}`}
                  strokeDashoffset={segment.offset}
                  className="animate-seg-draw"
                  style={{ animationDelay: "120ms" }}
                />
              ))}
            </g>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
              Package
            </span>
            <span
              data-readout
              className="mt-1 font-mono text-lg font-bold leading-none text-primary"
            >
              {formatUGX(packagePrice)}
            </span>
            <span className="mt-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground">
              per person
            </span>
          </div>
        </div>

        <p className="max-w-[15rem] text-center font-sans text-xs leading-relaxed text-muted-foreground">
          {destination.name} · {tierMeta(tier.key).name}
        </p>
      </div>

      {/* ---- Breakdown ---- */}
      <div className="min-w-0">
        <ul className="space-y-5">
          {shares.map((share) => (
            <li key={share.id}>
              <div className="flex items-baseline justify-between gap-4">
                <span className="flex items-center gap-2.5">
                  <span
                    aria-hidden
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: PARTY_COLOR[share.id] }}
                  />
                  <span className="font-display text-sm font-semibold tracking-display">
                    {share.label}
                  </span>
                </span>
                <span className="shrink-0 text-right">
                  <span
                    data-readout
                    className="font-mono text-sm font-bold text-foreground"
                  >
                    {formatUGX(share.amount)}
                  </span>
                  <span
                    data-readout
                    className="ml-2 font-mono text-xs text-muted-foreground"
                  >
                    {Math.round(share.share * 100)}%
                  </span>
                </span>
              </div>

              {/* Proportional bar — the share, drawn to scale. */}
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hairline">
                <div
                  className="h-full origin-left animate-bar-grow rounded-full"
                  style={{
                    width: `${share.share * 100}%`,
                    backgroundColor: PARTY_COLOR[share.id],
                  }}
                />
              </div>

              <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground">
                {share.description}
              </p>
            </li>
          ))}
        </ul>

        {/* ---- Sanity check against the concept note's operator band ---- */}
        <div className="mt-7 grid gap-4 rounded-lg border border-hairline bg-background/60 p-4 sm:grid-cols-2">
          <div>
            <p className="telemetry text-muted-foreground">
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
                "mt-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em]",
                insideBand ? "text-success" : "text-primary",
              )}
            >
              {insideBand
                ? "60% share lands inside the band"
                : "60% share sits above the band"}
            </p>
          </div>
          <div>
            <p className="telemetry text-muted-foreground">
              Traveller booking fee
            </p>
            <p
              data-readout
              className="mt-1.5 font-mono text-base font-semibold text-foreground"
            >
              {formatUGX(TRAVELLER_FEES.bookingFee)}
            </p>
            <p className="mt-1.5 font-sans text-[0.6875rem] leading-snug text-muted-foreground">
              The platform is paid out of the package, not on top of it.
            </p>
          </div>
        </div>

        <p className="mt-4 font-sans text-xs leading-relaxed text-muted-foreground">
          {OPERATOR_DAY_RATE_BAND.note}
        </p>
      </div>
    </div>
  );
}

/** A one-line version of the split, for the footer of other sections. */
export function RevenueSummaryStrip({ className }: { className?: string }) {
  return (
    <ul
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em]",
        className,
      )}
    >
      {REVENUE_SPLIT.map((party) => (
        <li key={party.id} className="flex items-center gap-2">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: PARTY_COLOR[party.id] }}
          />
          <span className="text-muted-foreground">
            {party.shortLabel}{" "}
            <span data-readout className="text-foreground">
              {Math.round(party.share * 100)}%
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
