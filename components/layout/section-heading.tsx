import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Section heading.
 *
 * Replaces the previous indexed "instrument" header (a numeric code, a rule and
 * a monospace caption). That register read as a control panel; this one reads
 * as an editorial kicker, which is what the rest of the page is now doing.
 *
 * The eyebrow is gold, the title is Fraunces, and the lead sits beside it on
 * wide screens rather than beneath it, so a section announces itself in one
 * horizontal band instead of three stacked ones.
 */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  id,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  id?: string;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-wrap items-end justify-between gap-x-10 gap-y-4",
        align === "center" && "flex-col items-center text-center",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary-ink">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={id}
          className={cn(
            "font-display text-3xl font-semibold leading-[1.1] tracking-display text-foreground sm:text-4xl",
            eyebrow && "mt-2.5",
          )}
        >
          {title}
        </h2>
        {lead ? (
          <p className="mt-3 font-sans text-base leading-relaxed text-muted-foreground">
            {lead}
          </p>
        ) : null}
      </div>

      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
