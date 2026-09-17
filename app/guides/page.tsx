import type { Metadata } from "next";
import { guides } from "@/data/guides";
import { MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "Guides",
  description:
    "Meet the local boda-boda guides who lead Tour-Boda Uganda rides. Licensed, vetted, and local to the roads they ride.",
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-primary">01</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Riders</span>
      </div>

      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-display sm:text-5xl">
            Your guide
          </h1>
          <p className="mt-3 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
            The person who actually rides with you. Every guide is licensed, and
            local to the road they ride.
          </p>
        </div>

        <div className="shrink-0 rounded-lg border border-hairline px-5 py-3">
          <div className="telemetry text-muted-foreground">Guides</div>
          <div
            data-readout
            className="mt-1 font-mono text-2xl font-semibold leading-none text-primary"
          >
            {String(guides.length).padStart(2, "0")}
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <article
            key={guide.id}
            className="group card-glow glass flex flex-col overflow-hidden rounded-lg"
          >
            <div className="relative aspect-[4/5] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={guide.photo}
                alt={`${guide.name}, Tour-Boda guide`}
                loading="lazy"
                className="duotone h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-scrim to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-4">
                <h2 className="font-display text-2xl font-bold leading-none tracking-display text-on-scrim">
                  {guide.name}
                </h2>
                <p className="mt-1.5 flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-on-scrim/75">
                  <MapPin className="h-3 w-3" aria-hidden />
                  {guide.region}
                </p>
              </div>

              {/* Experience badge — instrument readout on the photo. */}
              <div className="absolute right-3 top-3 rounded-md border border-on-scrim/25 bg-scrim/70 px-2.5 py-1.5 text-right backdrop-blur-sm">
                <div className="font-mono text-base font-bold leading-none text-[#CCFF33]">
                  {guide.yearsExperience}
                </div>
                <div className="mt-0.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-on-scrim/70">
                  years
                </div>
              </div>
            </div>

            <div className="flex flex-1 flex-col p-5">
              <div>
                <span className="telemetry text-muted-foreground">Speaks</span>
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {guide.languages.map((lang) => (
                    <li
                      key={lang}
                      className="rounded-full border border-hairline px-2.5 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground"
                    >
                      {lang}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-4">
                <span className="telemetry text-muted-foreground">Specialties</span>
                <ul className="mt-2 space-y-1">
                  {guide.specialties.map((spec) => (
                    <li
                      key={spec}
                      className="flex items-start gap-2 font-sans text-xs text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary"
                      />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-5 border-t border-hairline pt-4 font-sans text-sm leading-relaxed text-muted-foreground">
                {guide.bio}
              </p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
