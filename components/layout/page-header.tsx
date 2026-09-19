import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Page header band.
 *
 * Every inner page opens on cream and then hands over to white for its content.
 * That is the same restrained alternation the homepage uses — cream, then
 * white, then the dark footer — applied to a page that only needs one band.
 *
 * Putting it in one component means the band cannot be a slightly different
 * cream, or a slightly different height, from one page to the next.
 */
export function PageHeader({
  eyebrow,
  title,
  lead,
  aside,
  below,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Stats, a count plate, or a primary action — sits beside the title. */
  aside?: ReactNode;
  /** Full-width content under the title row, still inside the cream band. */
  below?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("band-cream border-b border-hairline", className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-8">
          <div className="max-w-3xl">
            {eyebrow ? (
              <p className="font-sans text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-primary-ink">
                {eyebrow}
              </p>
            ) : null}
            <h1
              className={cn(
                "font-display text-4xl font-semibold leading-[1.05] tracking-display-lg text-foreground sm:text-5xl",
                eyebrow && "mt-3",
              )}
            >
              {title}
            </h1>
            {lead ? (
              <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
                {lead}
              </p>
            ) : null}
          </div>

          {aside ? <div className="shrink-0">{aside}</div> : null}
        </div>

        {below ? <div className="mt-10">{below}</div> : null}
      </div>
    </section>
  );
}
