import type { Destination } from "@/types/destination";

/**
 * The road log.
 *
 * Narrative runs in Inter at a 65ch measure. The closing "honest note" is
 * lifted out as a pull quote in Fraunces — the one place the serif is used, and
 * deliberately: it is the guide's own voice inside an otherwise instrumental
 * page. It is also the most distinctive thing this brand does editorially, so
 * it gets the emphasis.
 */
export function NarrativeSection({ destination }: { destination: Destination }) {
  const sentences = destination.narrative.split(/(?<=\.)\s+/);
  const honestAt = sentences.findIndex((s) => /honest note/i.test(s));

  const body = honestAt > 0 ? sentences.slice(0, honestAt) : sentences;
  const honest = honestAt > 0 ? sentences.slice(honestAt).join(" ") : null;

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-primary-ink">02</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Road log</span>
      </div>

      <h2 className="mb-6 font-display text-2xl font-bold leading-tight tracking-display sm:text-3xl">
        The ride
      </h2>

      <div
        className="font-sans text-[1.0625rem] leading-[1.75]"
        style={{ maxWidth: "65ch" }}
      >
        {body.map((para, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "mb-4 text-lg leading-[1.7] text-foreground"
                : "mb-4 text-muted-foreground"
            }
          >
            {para}
          </p>
        ))}
      </div>

      {honest ? (
        <blockquote
          className="mt-8 border-l-2 border-primary pl-5 sm:pl-6"
          style={{ maxWidth: "65ch" }}
        >
          <span className="telemetry text-primary-ink">Honest note</span>
          <p className="mt-2 font-serif text-lg italic leading-relaxed text-foreground sm:text-xl">
            {honest.replace(/^One honest note:\s*/i, "")}
          </p>
        </blockquote>
      ) : null}

      <div
        className="mt-10 flex items-center gap-4 border-t border-hairline pt-6"
        style={{ maxWidth: "65ch" }}
      >
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-hairline bg-card font-display text-lg font-bold text-primary-ink">
          {destination.author.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.06em]">
            {destination.author.name}
          </p>
          <p className="mt-0.5 font-sans text-xs leading-relaxed text-muted-foreground">
            {destination.author.bio}
          </p>
        </div>
      </div>
    </section>
  );
}
