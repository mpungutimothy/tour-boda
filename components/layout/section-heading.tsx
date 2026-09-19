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
        "mb-8 flex flex-col gap-y-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-10",
        align === "center" && "items-center text-center sm:flex-col",
        className,
      )}
    >
      <div className={cn("min-w-0 max-w-2xl", align === "center" && "mx-auto")}>
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

      {/* `w-full` on a phone, `shrink-0` only once there is room. The revenue
          summary strip is ~361px of content; as a `shrink-0` flex item it could
          not narrow and pushed the whole page 2px past the viewport at 375px,
          and clipped the last chip at 320px. */}
      {action ? <div className="w-full sm:w-auto sm:shrink-0">{action}</div> : null}
    </div>
  );
}
