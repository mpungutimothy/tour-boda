import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstrumentCluster, Readout, Tag, SectionMark } from "@/components/instrument/readouts";

export const metadata: Metadata = {
  title: "Styleguide",
  description:
    "The Ride Computer design system: tokens, type voices, and components for Tour-Boda Uganda.",
};

/**
 * Swatches are filled from the tokens themselves (`hsl(var(--x))`), never from
 * a literal hex, so this page cannot drift out of sync with globals.css the way
 * the previous hardcoded list did.
 */
const palette = [
  {
    name: "Signal",
    token: "--primary",
    role: "Action and warmth. The rider.",
    use: "Primary buttons, active tier, honest-note rule",
  },
  {
    name: "Data",
    token: "--data",
    role: "Information. The machine.",
    use: "Distances, telemetry labels, link hover",
  },
  {
    name: "Ink",
    token: "--ink",
    role: "Primary text.",
    use: "Headings and body on the night road",
  },
  {
    name: "Surface",
    token: "--surface",
    role: "Raised panel.",
    use: "Table headers, inset blocks",
  },
  {
    name: "Hairline",
    token: "--hairline",
    role: "The 1px rule.",
    use: "Every divider and instrument tick",
  },
  {
    name: "Scrim",
    token: "--scrim",
    role: "Text over photography. Theme-constant.",
    use: "Hero overlays, captions on images",
  },
];

const semantic = [
  { name: "Success", token: "--success", role: "Confirmations" },
  { name: "Warning", token: "--warning", role: "Cautions" },
  { name: "Error", token: "--error", role: "Failures, destructive actions" },
];

const voices = [
  {
    voice: "Machine",
    face: "Barlow Condensed",
    job: "Headings, UI labels, instrument readouts",
    className: "font-display text-3xl font-bold uppercase tracking-[0.01em]",
    sample: "Ride the Jinja Road",
  },
  {
    voice: "Data",
    face: "JetBrains Mono",
    job: "Every number that matters",
    className: "font-mono text-2xl font-semibold text-data",
    sample: "168 km · 9h",
  },
  {
    voice: "Reading",
    face: "Inter",
    job: "Body copy",
    className: "font-sans text-base",
    sample: "The drive from Kampala to Jinja is 84 kilometres east.",
  },
  {
    voice: "Human",
    face: "Fraunces",
    job: "The guide's own words — with restraint",
    className: "font-serif text-lg italic",
    sample: "One honest note: that stretch is red mud.",
  },
];

const typeScale = [
  { label: "Display 2XL", className: "font-display text-5xl font-bold uppercase", sample: "Pearl of Africa" },
  { label: "Display XL", className: "font-display text-4xl font-bold uppercase", sample: "Find your ride" },
  { label: "Heading LG", className: "font-display text-3xl font-bold uppercase", sample: "Featured routes" },
  { label: "Heading MD", className: "font-display text-2xl font-bold uppercase", sample: "Compare the tiers" },
  { label: "Heading SM", className: "font-display text-lg font-semibold uppercase", sample: "Boda Freelance" },
  { label: "Body LG", className: "font-sans text-lg", sample: "Ride through the red dusty roads of Kampala." },
  { label: "Body Base", className: "font-sans text-base", sample: "Every boda guide knows every shortcut." },
  { label: "Body SM", className: "font-sans text-sm text-muted-foreground", sample: "Duration: 3.5 hours · Distance: 38 km" },
  { label: "Telemetry", className: "telemetry text-muted-foreground", sample: "Total distance" },
  { label: "Readout", className: "font-mono text-2xl font-semibold text-data", sample: "38 km" },
  { label: "Price", className: "font-mono text-xl font-semibold text-primary", sample: "UGX 85,000" },
];

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="telemetry text-data">00</span>
        <span className="h-px flex-1 bg-hairline" />
        <span className="telemetry text-muted-foreground">Reference</span>
      </div>

      <div className="mb-16">
        <h1 className="font-display text-4xl font-bold uppercase leading-[0.98] tracking-[0.01em] sm:text-5xl">
          Ride Computer
        </h1>
        <p className="mt-4 max-w-2xl font-sans text-base leading-relaxed text-muted-foreground">
          The Tour-Boda design system. A motorcycle instrument cluster for a
          daytime road: dark at the ends of the ride, light through the middle.
          Full rationale in <span className="font-mono text-sm">docs/DESIGN_DIRECTION.md</span>.
        </p>
      </div>

      {/* Voices */}
      <section className="mb-16">
        <SectionMark index="01">Type voices</SectionMark>
        <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-[0.01em]">
          Four voices
        </h2>

        <div className="overflow-hidden rounded-lg border border-hairline">
          {voices.map((v, i) => (
            <div
              key={v.voice}
              className={`grid gap-3 p-6 sm:grid-cols-[10rem_1fr] sm:items-baseline ${
                i > 0 ? "border-t border-hairline" : ""
              }`}
            >
              <div>
                <div className="telemetry text-data">{v.voice}</div>
                <div className="mt-1 font-mono text-[0.6875rem] text-muted-foreground">
                  {v.face}
                </div>
              </div>
              <div>
                <p className={v.className}>{v.sample}</p>
                <p className="mt-2 font-sans text-xs text-muted-foreground">{v.job}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 max-w-[70ch] font-sans text-sm leading-relaxed text-muted-foreground">
          Fraunces is deliberately scarce. It appears only for the guide&rsquo;s
          own words, so the human voice reads as human inside an otherwise
          instrumental page.
        </p>
      </section>

      {/* Palette */}
      <section className="mb-16">
        <SectionMark index="02">Palette</SectionMark>
        <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-[0.01em]">
          Colour
        </h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {palette.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-md border border-hairline">
              <div
                className="h-24 border-b border-hairline"
                style={{ backgroundColor: `hsl(var(${c.token}))` }}
                aria-hidden
              />
              <div className="p-3">
                <p className="font-display text-sm font-semibold uppercase tracking-[0.02em]">
                  {c.name}
                </p>
                <p className="mt-1 font-sans text-xs leading-snug text-muted-foreground">
                  {c.role}
                </p>
                <p className="mt-2 font-mono text-[0.5625rem] text-muted-foreground">
                  {c.token}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="mb-4 mt-10 font-display text-lg font-bold uppercase tracking-[0.02em]">
          Semantic
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {semantic.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-md border border-hairline">
              <div
                className="h-14 border-b border-hairline"
                style={{ backgroundColor: `hsl(var(${c.token}))` }}
                aria-hidden
              />
              <div className="p-3">
                <p className="font-display text-sm font-semibold uppercase">{c.name}</p>
                <p className="mt-1 font-sans text-xs text-muted-foreground">{c.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Both themes side by side — the day/night rhythm. */}
        <h3 className="mb-4 mt-10 font-display text-lg font-bold uppercase tracking-[0.02em]">
          Day / night
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-hairline bg-background p-6 text-foreground">
            <span className="telemetry text-muted-foreground">Night road · default</span>
            <p className="mt-3 font-display text-xl font-bold uppercase">Dawn and dusk</p>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              The whole site by default. Heroes, route cards, the booking rail.
            </p>
          </div>
          <div className="midday rounded-lg border border-hairline bg-background p-6 text-foreground">
            <span className="telemetry text-muted-foreground">Midday · .midday</span>
            <p className="mt-3 font-display text-xl font-bold uppercase">The reading stretch</p>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              Long-form bands. Narrative, FAQs, pricing tables, the contact form.
            </p>
          </div>
        </div>

        <p className="mt-4 max-w-[70ch] font-sans text-sm leading-relaxed text-muted-foreground">
          Every pair in both themes clears WCAG AA for normal text. Verify with{" "}
          <span className="font-mono text-xs">node scripts/check-contrast.mjs</span>.
          The <span className="font-mono text-xs">scrim</span> tokens are the
          exception: they stay dark in both themes, because a photograph is
          always dark behind an overlay.
        </p>
      </section>

      {/* Type scale */}
      <section className="mb-16">
        <SectionMark index="03">Scale</SectionMark>
        <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-[0.01em]">
          Type scale
        </h2>
        <div className="overflow-hidden rounded-lg border border-hairline">
          {typeScale.map((t, i) => (
            <div
              key={t.label}
              className={`flex flex-col gap-1 p-4 sm:flex-row sm:items-baseline sm:gap-8 ${
                i > 0 ? "border-t border-hairline" : ""
              }`}
            >
              <span className="telemetry shrink-0 text-muted-foreground sm:w-32">
                {t.label}
              </span>
              <span className={t.className}>{t.sample}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Instrument */}
      <section className="mb-16">
        <SectionMark index="04">Instrument</SectionMark>
        <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-[0.01em]">
          Cluster and rail
        </h2>

        <div className="rounded-lg border border-hairline p-6">
          <InstrumentCluster>
            <Readout label="Routes" value="03" tone="data" />
            <Readout label="Local guides" value="03" />
            <Readout label="From" value="60,000" unit="UGX" tone="signal" />
            <Readout label="Booking fees" value="0" hint="No markup, ever" />
          </InstrumentCluster>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <Tag tone="signal">City &amp; Heritage</Tag>
          <Tag tone="data">38 km</Tag>
          <Tag>Dry season</Tag>
        </div>
      </section>

      {/* Radius */}
      <section className="mb-16">
        <SectionMark index="05">Form</SectionMark>
        <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-[0.01em]">
          Radius
        </h2>
        <div className="flex flex-wrap gap-6">
          {[
            { name: "sm", val: "4px" },
            { name: "md", val: "8px" },
            { name: "lg", val: "12px" },
            { name: "full", val: "999px" },
          ].map((r) => (
            <div key={r.name} className="text-center">
              <div
                className="h-20 w-20 border border-hairline bg-surface"
                style={{ borderRadius: r.val }}
                aria-hidden
              />
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {r.name} · {r.val}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-4 max-w-[70ch] font-sans text-sm text-muted-foreground">
          Tighter than the previous system. Instrument bezels, not soft cards.
        </p>
      </section>

      {/* Surfaces */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-[0.01em]">
          Surfaces
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="grid-plate rounded-lg border border-hairline p-6">
            <p className="font-display text-lg font-semibold uppercase">Grid plate</p>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              Technical backing grid. Applied fixed behind the whole site.
            </p>
          </div>
          <div className="paper-grain rounded-lg border border-hairline bg-surface p-6">
            <p className="font-display text-lg font-semibold uppercase">Paper grain</p>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              Road dust at ~3.5% opacity, for editorial and dark bands.
            </p>
          </div>
        </div>
      </section>

      {/* Components */}
      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-[0.01em]">
          Buttons
        </h2>
        <div className="rounded-lg border border-hairline p-8">
          <div className="flex flex-wrap gap-4">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="lg" disabled>
              Disabled
            </Button>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-[0.01em]">
          Badges
        </h2>
        <div className="rounded-lg border border-hairline p-8">
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-[0.01em]">
          Cards
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="font-display uppercase">Kampala City Tour</CardTitle>
              <CardDescription>A 3.5-hour ride through the capital.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-sans text-sm text-muted-foreground">
                Kasubi Tombs, Bahai Temple, and the Nakawa market junction.
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="font-mono text-lg font-semibold text-primary">UGX 85,000</span>
              <Button size="sm">Open</Button>
            </CardFooter>
          </Card>

          <Card className="paper-grain">
            <CardHeader>
              <CardTitle className="font-display uppercase">Jinja &amp; the Nile</CardTitle>
              <CardDescription>A full day to the Nile&rsquo;s source.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-sans text-sm text-muted-foreground">
                Sugar cane at Lugazi, the Source of the Nile, Mabira Forest.
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="font-mono text-lg font-semibold text-primary">UGX 180,000</span>
              <Button size="sm">Open</Button>
            </CardFooter>
          </Card>

          <Card className="midday bg-background text-foreground">
            <CardHeader>
              <CardTitle className="font-display uppercase">Midday card</CardTitle>
              <CardDescription>The same component on the reading surface.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-sans text-sm text-muted-foreground">
                Anything inside a <span className="font-mono text-xs">.midday</span> wrapper
                picks up the light tokens automatically.
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="font-mono text-lg font-semibold text-primary">UGX 60,000</span>
              <Button size="sm">Open</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 font-display text-2xl font-bold uppercase tracking-[0.01em]">
          Inputs
        </h2>
        <div className="midday rounded-lg border border-hairline bg-background p-8 text-foreground">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="demo-name" className="telemetry text-muted-foreground">
                Full name
              </Label>
              <Input id="demo-name" placeholder="Enter your name" autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-email" className="telemetry text-muted-foreground">
                Email address
              </Label>
              <Input
                id="demo-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-disabled" className="telemetry text-muted-foreground">
                Disabled
              </Label>
              <Input id="demo-disabled" placeholder="Cannot edit" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-price" className="telemetry text-muted-foreground">
                Price (UGX)
              </Label>
              <Input
                id="demo-price"
                type="number"
                placeholder="85000"
                className="font-mono tabular-nums"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
