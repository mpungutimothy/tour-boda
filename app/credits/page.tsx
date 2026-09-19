import type { Metadata } from "next";
import Link from "next/link";
import { PHOTO_CREDITS, licenceSummary } from "@/data/photo-credits";
import { PageHeader } from "@/components/layout/page-header";
import { PROTOTYPE_NOTICE } from "@/lib/demo";
import { Camera, ExternalLink, Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Photography credits",
  description:
    "Every photograph on Tour-Boda, with the photographer and licence it is used under.",
};

/**
 * Photography credits.
 *
 * Required, not decorative: most of the photography on this site is Creative
 * Commons, and both CC BY and CC BY-SA require attribution. The list is
 * generated from the same licence metadata that produced the images
 * (`scripts/sync-photos.mjs`), so it cannot drift from what is actually shown.
 */
export default function CreditsPage() {
  const licences = licenceSummary();

  // Grouped by where the photograph appears, so a reader can find the one they
  // are looking at rather than scanning 54 undifferentiated rows.
  const groups = PHOTO_CREDITS.reduce<Map<string, typeof PHOTO_CREDITS>>(
    (map, credit) => {
      const key = credit.context.split(" — ")[0];
      const list = map.get(key) ?? [];
      list.push(credit);
      map.set(key, list);
      return map;
    },
    new Map(),
  );

  return (
    <div>
      <PageHeader
        eyebrow="Attribution"
        title="Photography credits"
        lead={`${PHOTO_CREDITS.length} photographs, every one of them a real frame of a real place in Uganda. Most are Creative Commons, which means the photographer keeps the copyright and we publish under their licence — so the attribution below is a condition of using them, not a courtesy.`}
      />

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Licence summary */}
        <dl className="grid gap-px overflow-hidden rounded-lg border border-hairline bg-hairline sm:grid-cols-3">
        <div className="bg-card p-4">
          <dt className="telemetry text-muted-foreground">Photographs</dt>
          <dd
            data-readout
            className="mt-1 font-mono text-2xl font-semibold text-primary-ink"
          >
            {PHOTO_CREDITS.length}
          </dd>
        </div>
        <div className="bg-card p-4">
          <dt className="telemetry text-muted-foreground">Licences in use</dt>
          <dd
            data-readout
            className="mt-1 font-mono text-2xl font-semibold text-foreground"
          >
            {licences.length}
          </dd>
        </div>
        <div className="bg-card p-4">
          <dt className="telemetry text-muted-foreground">Sources</dt>
          <dd className="mt-1 font-mono text-sm text-foreground">
            Wikimedia Commons · Pexels
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-2">
        {licences.map((entry) => (
          <span
            key={entry.licence}
            className="rounded-full border border-hairline px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground"
          >
            {entry.licence}
            <span className="ml-2 text-primary-ink">{entry.count}</span>
          </span>
        ))}
      </div>

      {/* Self-hosting rationale — an investor question worth answering inline. */}
      <div className="mt-10 rounded-lg border border-hairline bg-card p-5">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold tracking-display">
          <ImageIcon className="h-4 w-4 text-primary-ink" aria-hidden />
          Why these images are stored, not hotlinked
        </h2>
        <p className="mt-2 max-w-3xl font-sans text-sm leading-relaxed text-muted-foreground">
          Every photograph is served from this site rather than linked from
          Wikimedia or Pexels. That removes a dependency on two third parties
          staying up, keeps the whole static export self-contained so it works
          offline, and means the imagery cannot be swapped out from under us
          between a rehearsal and the pitch.
        </p>
        <p className="mt-3 max-w-3xl font-sans text-sm leading-relaxed text-muted-foreground">
          To change or add photography, edit{" "}
          <code className="rounded bg-background px-1.5 py-0.5 font-mono text-[0.75rem] text-primary-ink">
            scripts/photo-manifest.json
          </code>{" "}
          and run{" "}
          <code className="rounded bg-background px-1.5 py-0.5 font-mono text-[0.75rem] text-primary-ink">
            npm run photos
          </code>
          . The credits below regenerate from the source metadata automatically.
        </p>
      </div>

      {/* The credits themselves */}
      <div className="mt-12 space-y-10">
        {Array.from(groups.entries()).map(([group, credits]) => (
          <section key={group}>
            <h2 className="flex items-center gap-2 border-b border-hairline pb-2 font-display text-xl font-semibold tracking-display">
              <Camera className="h-4 w-4 text-primary-ink" aria-hidden />
              {group}
            </h2>

            <ul className="mt-4 divide-y divide-hairline">
              {credits.map((credit) => (
                <li
                  key={credit.file}
                  className="flex flex-col gap-2 py-3.5 sm:flex-row sm:items-start sm:gap-5"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/${credit.file}`}
                    alt=""
                    loading="lazy"
                    className="h-20 w-32 shrink-0 rounded border border-hairline object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-sans text-sm leading-snug">
                      {credit.subject}
                    </p>
                    <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
                      {credit.context}
                    </p>
                    <p className="mt-1.5 font-sans text-xs text-muted-foreground">
                      Photograph by{" "}
                      <span className="text-foreground">{credit.artist}</span> ·{" "}
                      {credit.licence} · {credit.source}
                    </p>
                  </div>
                  <a
                    href={credit.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-primary-ink transition-opacity hover:opacity-80"
                  >
                    Source
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-12 rounded-lg border border-hairline bg-field p-3.5 font-sans text-[0.6875rem] leading-relaxed text-muted-foreground">
        <span className="font-semibold uppercase tracking-[0.12em] text-primary-ink">
          {PROTOTYPE_NOTICE.label}.
        </span>{" "}
        {PROTOTYPE_NOTICE.detail} {PROTOTYPE_NOTICE.photography}
      </p>

        <div className="mt-8">
          <Link
            href="/"
            className="font-sans text-xs font-semibold text-muted-foreground transition-colors hover:text-primary-ink"
          >
            ← Back to the marketplace
          </Link>
        </div>
      </div>
    </div>
  );
}
