import type { Destination } from "@/types/destination";
import { BookOpen } from "lucide-react";

export function NarrativeSection({ destination }: { destination: Destination }) {
  const paragraphs = destination.narrative.split(/(?<=\.)\s+/);

  return (
    <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="font-serif text-xl font-semibold">The Tour</h2>
      </div>
      <div
        className="font-sans text-[1.0625rem] leading-[1.75] text-ink/90"
        style={{ maxWidth: "65ch" }}
      >
        {paragraphs.map((para, i) => (
          <p key={i} className={i === 0 ? "mb-4 font-serif text-lg leading-[1.7] text-ink" : "mb-4"}>
            {para}
          </p>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-3 border-t border-border/60 pt-6" style={{ maxWidth: "65ch" }}>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-serif text-lg font-bold text-primary">
          {destination.author.name.charAt(0)}
        </div>
        <div>
          <p className="font-sans text-sm font-semibold text-ink">{destination.author.name}</p>
          <p className="font-sans text-xs text-muted-foreground">{destination.author.bio}</p>
        </div>
      </div>
    </section>
  );
}
