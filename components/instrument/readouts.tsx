import type { ReactNode } from "react";

/**
 * Signal/data colours fixed for use over photography. The theme tokens flip
 * between night and midday, but a photo scrim is always dark, so these must not
 * follow the theme.
 */
const ON_SCRIM_SIGNAL = "text-[#FF6D2E]";
const ON_SCRIM_DATA = "text-[#22B7CE]";

/**
 * A single instrument readout: telemetry label above, large mono value below.
 * Every figure must be traceable to data/destinations.ts — no invented metrics.
 */
export function Readout({
  label,
  value,
  unit,
  hint,
  tone = "default",
  onScrim = false,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  hint?: string;
  tone?: "default" | "signal" | "data";
  /** Use over photography, where theme tokens are not reliable. */
  onScrim?: boolean;
}) {
  const valueTone = onScrim
    ? tone === "signal"
      ? ON_SCRIM_SIGNAL
      : tone === "data"
        ? ON_SCRIM_DATA
        : "text-on-scrim"
    : tone === "signal"
      ? "text-primary"
      : tone === "data"
        ? "text-data"
        : "text-foreground";

  return (
    <div className="px-4 py-3 first:pl-0 last:pr-0">
      <div className={`telemetry ${onScrim ? "text-on-scrim/60" : "text-muted-foreground"}`}>
        {label}
      </div>
      <div
        data-readout
        className={`mt-1 flex items-baseline gap-1 font-mono text-xl font-semibold leading-none sm:text-2xl ${valueTone}`}
      >
        {value}
        {unit ? (
          <span
            className={`font-mono text-xs font-medium uppercase tracking-wider ${
              onScrim ? "text-on-scrim/60" : "text-muted-foreground"
            }`}
          >
            {unit}
          </span>
        ) : null}
      </div>
      {hint ? (
        <div
          className={`mt-1 font-sans text-xs ${
            onScrim ? "text-on-scrim/70" : "text-muted-foreground"
          }`}
        >
          {hint}
        </div>
      ) : null}
    </div>
  );
}

/**
 * The instrument cluster: readouts separated by hairlines, the way a gauge
 * panel divides its dials. Collapses to a 2-up grid on small screens.
 */
export function InstrumentCluster({
  children,
  onScrim = false,
}: {
  children: ReactNode;
  onScrim?: boolean;
}) {
  const rules = onScrim
    ? "divide-on-scrim/20 border-on-scrim/20"
    : "divide-hairline border-hairline";

  return (
    <div
      className={`grid grid-cols-2 divide-x divide-y sm:grid-cols-4 sm:divide-y-0 ${rules}`}
    >
      {children}
    </div>
  );
}

/** Small status pill used for route state words (Dry season, Unpaved, etc.). */
export function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "signal" | "data";
}) {
  const tones = {
    neutral: "border-hairline text-muted-foreground",
    signal: "border-primary/50 text-primary",
    data: "border-data/50 text-data",
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/**
 * Tag variant for use over photography, where theme tokens are unreliable.
 */
export function ScrimTag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "signal";
}) {
  const tones = {
    neutral: "border-on-scrim/30 text-on-scrim/80",
    signal: `border-[#FF6D2E]/60 ${ON_SCRIM_SIGNAL}`,
  } as const;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/** Eyebrow label that opens a section — the instrument plate marking. */
export function SectionMark({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="telemetry text-data">{index}</span>
      <span className="h-px flex-1 bg-hairline" />
      <span className="telemetry text-muted-foreground">{children}</span>
    </div>
  );
}
