import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { altFor, asset, creditForPath } from "@/lib/photos";

/**
 * A full-bleed photographic band.
 *
 * Long pages built entirely from cards, tables and readouts start to read like
 * a dashboard. Dropping a full-width photograph in at intervals resets the eye
 * and reminds the reader that the product is a place, not a spreadsheet.
 *
 * Attribution is rendered from the generated credit table rather than passed
 * in, so a CC BY-SA photograph cannot be placed on the site without its
 * licence travelling with it.
 */
export function PhotoBand({
  image,
  alt,
  eyebrow,
  title,
  body,
  action,
  align = "left",
  height = "tall",
  className,
}: {
  image: string;
  alt?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  action?: ReactNode;
  align?: "left" | "center";
  height?: "short" | "tall";
  className?: string;
}) {
  const credit = creditForPath(image);

  return (
    <section
      className={cn(
        // Dark scope: every token inside this band resolves to the shell
        // palette, so a gold eyebrow stays the bright #C98A2C it needs to be
        // over photography instead of dropping to the #A8701F used on white.
        "theme-shell relative isolate flex overflow-hidden bg-background",
        height === "tall" ? "min-h-[52vh]" : "min-h-[34vh]",
        align === "center" ? "items-center" : "items-end",
        className,
      )}
    >
      <div className="absolute inset-0 -z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(image)}
          alt={alt ?? altFor(image, "")}
          loading="lazy"
          className="duotone h-full w-full object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-primary/[0.14] mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim/80 to-scrim/50" />
        <div className="pointer-events-none absolute inset-0 glow-mesh opacity-50" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div
          className={cn(
            "max-w-2xl",
            align === "center" && "mx-auto text-center",
          )}
        >
          {eyebrow ? (
            <span className="telemetry text-primary-ink">{eyebrow}</span>
          ) : null}
          {title ? (
            <h2 className="mt-3 font-display text-3xl font-bold leading-[1.02] tracking-display text-on-scrim sm:text-4xl lg:text-5xl">
              {title}
            </h2>
          ) : null}
          {body ? (
            <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-on-scrim/80">
              {body}
            </p>
          ) : null}
          {action ? <div className="mt-6">{action}</div> : null}

          {credit ? (
            <p className="mt-6 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-on-scrim/[0.45]">
              Photograph: {credit.artist} · {credit.licence} · {credit.source}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
