import type { Metadata } from "next";
import { guides } from "@/data/guides";
import { Badge } from "@/components/ui/badge";
import { MapPin, Languages, Briefcase, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Guides",
  description: "Meet the local boda-boda guides who lead Tour-Boda Uganda rides. Licensed, vetted, and local to the roads they ride.",
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-ink sm:text-5xl">Our Guides</h1>
        <p className="mt-3 max-w-2xl font-sans text-lg text-muted-foreground">
          The people who ride with you. Every guide is licensed, vetted, and local to the road they ride.
        </p>
      </div>

      {/* Guide grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="group overflow-hidden rounded-lg border border-border bg-card shadow-warm-sm transition-shadow hover:shadow-warm-md"
          >
            {/* Photo */}
            <div className="relative aspect-[3/4] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={guide.photo}
                alt={`${guide.name}, Tour-Boda guide`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3">
                <p className="font-serif text-lg font-semibold text-surface">{guide.name}</p>
                <p className="flex items-center gap-1 font-sans text-xs text-surface/70">
                  <MapPin className="h-3 w-3" />
                  {guide.region}
                </p>
              </div>
            </div>

            {/* Details */}
            <div className="p-5">
              {/* Languages */}
              <div className="mb-3">
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Languages className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">Languages</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {guide.languages.map((lang) => (
                    <Badge key={lang} variant="outline" className="text-xs">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="mb-3 flex items-center gap-1.5">
                <Briefcase className="h-3.5 w-3.5 text-primary" />
                <span className="font-sans text-sm text-ink">
                  {guide.yearsExperience} years on the road
                </span>
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <ul className="space-y-1">
                  {guide.specialties.map((spec) => (
                    <li key={spec} className="flex items-start gap-1.5 font-sans text-xs text-ink/80">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-success" />
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Bio */}
              <p className="border-t border-border/60 pt-3 font-sans text-sm leading-relaxed text-muted-foreground">
                {guide.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
