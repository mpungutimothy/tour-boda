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

export const metadata: Metadata = {
  title: "Styleguide",
  description: "Design system tokens, colors, typography, and components for Tour-Boda Uganda.",
};

const colorTokens = [
  { name: "Primary", var: "var(--primary)", hex: "#E85D2F", desc: "Laterite sunset" },
  { name: "Secondary", var: "var(--secondary)", hex: "#2F5D3E", desc: "Matoke green" },
  { name: "Accent", var: "var(--accent)", hex: "#E8A33D", desc: "Turmeric gold" },
  { name: "Ink", var: "var(--ink)", hex: "#1A1612", desc: "Ink black" },
  { name: "Surface", var: "var(--surface)", hex: "#FAF6EF", desc: "Paper cream" },
  { name: "Muted", var: "var(--muted)", hex: "#8A7E70", desc: "Warm grey" },
];

const semanticTokens = [
  { name: "Success", var: "var(--success)", desc: "Confirmations" },
  { name: "Warning", var: "var(--warning)", desc: "Cautions" },
  { name: "Error", var: "var(--error)", desc: "Destructive actions" },
];

const typeScale = [
  { label: "Display 2XL", className: "font-serif text-5xl font-bold", sample: "Pearl of Africa" },
  { label: "Display XL", className: "font-serif text-4xl font-bold", sample: "Find Your Guide" },
  { label: "Display LG", className: "font-serif text-3xl font-semibold", sample: "Popular Tours" },
  { label: "Heading MD", className: "font-serif text-2xl font-semibold", sample: "Kampala City Ride" },
  { label: "Heading SM", className: "font-serif text-xl font-medium", sample: "Trip Details" },
  { label: "Body LG", className: "font-sans text-lg", sample: "Ride through the red dusty roads of Kampala with a local guide." },
  { label: "Body Base", className: "font-sans text-base", sample: "Every boda guide is vetted and knows every shortcut." },
  { label: "Body SM", className: "font-sans text-sm text-muted-foreground", sample: "Duration: 3 hours · Distance: 45 km" },
  { label: "Mono Price", className: "font-mono text-2xl font-semibold text-primary", sample: "UGX 85,000" },
  { label: "Mono Caption", className: "font-mono text-sm text-muted-foreground", sample: "UGX 1 = $0.00027" },
];

export default function StyleguidePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="paper-grain mb-16 rounded-lg bg-surface p-8 shadow-warm-sm">
        <h1 className="font-serif text-4xl font-bold text-ink">Design System</h1>
        <p className="mt-3 max-w-2xl font-sans text-lg text-muted-foreground">
          Tour-Boda Uganda &mdash; tokens, colors, typography, and components.
        </p>
      </div>

      {/* Colors */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-6">Brand Colors</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {colorTokens.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-md border border-border shadow-warm-sm">
              <div
                className="flex h-24 items-end p-3"
                style={{ backgroundColor: c.hex }}
              >
                <span
                  className="font-mono text-xs font-semibold"
                  style={{
                    color: ["#FAF6EF", "#E8A33D", "#8A7E70"].includes(c.hex) ? "#1A1612" : "#FAF6EF",
                  }}
                >
                  {c.hex}
                </span>
              </div>
              <div className="bg-card p-3">
                <p className="font-sans text-sm font-semibold">{c.name}</p>
                <p className="font-sans text-xs text-muted-foreground">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="font-serif text-xl font-semibold mb-4 mt-8">Semantic Colors</h3>
        <div className="grid grid-cols-3 gap-4">
          {semanticTokens.map((c) => (
            <div key={c.name} className="overflow-hidden rounded-md border border-border shadow-warm-sm">
              <div
                className="flex h-16 items-center justify-center"
                style={{ backgroundColor: `hsl(${c.var})` }}
              >
                <span className="font-sans text-sm font-semibold text-white">
                  {c.name}
                </span>
              </div>
              <div className="bg-card p-3">
                <p className="font-sans text-xs text-muted-foreground">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-6">Typography</h2>
        <div className="rounded-lg border border-border bg-card p-8 shadow-warm-sm">
          <div className="space-y-6">
            {typeScale.map((t) => (
              <div key={t.label} className="flex flex-col gap-1 border-b border-border/60 pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-baseline sm:gap-8">
                <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground sm:w-32 shrink-0">
                  {t.label}
                </span>
                <span className={t.className}>{t.sample}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Radius */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-6">Radius Scale</h2>
        <div className="flex flex-wrap gap-6">
          {[
            { name: "sm", val: "6px" },
            { name: "md", val: "12px" },
            { name: "lg", val: "18px" },
            { name: "full", val: "999px" },
          ].map((r) => (
            <div key={r.name} className="text-center">
              <div
                className="h-20 w-20 bg-primary"
                style={{ borderRadius: r.val }}
              />
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                {r.name} · {r.val}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Shadows */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-6">Warm Shadows</h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {["shadow-warm-sm", "shadow-warm-md", "shadow-warm-lg", "shadow-warm-xl"].map((s) => (
            <div key={s} className="text-center">
              <div className={`h-20 w-full rounded-md bg-card border border-border ${s}`} />
              <p className="mt-2 font-mono text-xs text-muted-foreground">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-6">Buttons</h2>
        <div className="rounded-lg border border-border bg-card p-8 shadow-warm-sm">
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
          </div>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-6">Badges</h2>
        <div className="rounded-lg border border-border bg-card p-8 shadow-warm-sm">
          <div className="flex flex-wrap gap-3">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-6">Cards</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="shadow-warm-md">
            <CardHeader>
              <CardTitle className="font-serif">Kampala City Tour</CardTitle>
              <CardDescription>A 3-hour ride through the capital&rsquo;s highlights.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-sans text-sm text-muted-foreground">
                Visit the Kasubi Tombs, Bahai Temple, and local markets.
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="font-mono text-lg font-semibold text-primary">UGX 85,000</span>
              <Button size="sm">Book Now</Button>
            </CardFooter>
          </Card>

          <Card className="paper-grain shadow-warm-md">
            <CardHeader>
              <CardTitle className="font-serif">Jinja Source of the Nile</CardTitle>
              <CardDescription>A full-day adventure to the Nile&rsquo;s source.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-sans text-sm text-muted-foreground">
                Includes boat ride and lunch at a riverside restaurant.
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="font-mono text-lg font-semibold text-primary">UGX 180,000</span>
              <Button size="sm">Book Now</Button>
            </CardFooter>
          </Card>

          <Card className="shadow-warm-md">
            <CardHeader>
              <CardTitle className="font-serif">Entebbe Botanical Gardens</CardTitle>
              <CardDescription>A relaxing half-day nature walk.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-sans text-sm text-muted-foreground">
                Explore lush gardens along the shores of Lake Victoria.
              </p>
            </CardContent>
            <CardFooter className="justify-between">
              <span className="font-mono text-lg font-semibold text-primary">UGX 60,000</span>
              <Button size="sm">Book Now</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Inputs */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-6">Inputs</h2>
        <div className="rounded-lg border border-border bg-card p-8 shadow-warm-sm">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="demo-name">Full name</Label>
              <Input id="demo-name" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-email">Email address</Label>
              <Input id="demo-email" type="email" placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-disabled">Disabled input</Label>
              <Input id="demo-disabled" placeholder="Cannot edit" disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="demo-price">Price (UGX)</Label>
              <Input id="demo-price" type="number" placeholder="85000" className="font-mono" />
            </div>
          </div>
        </div>
      </section>

      {/* Paper grain demo */}
      <section className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-6">Paper Grain Overlay</h2>
        <div className="paper-grain grid gap-4 rounded-lg bg-surface p-8 shadow-warm-sm sm:grid-cols-2">
          <div>
            <h3 className="font-serif text-xl font-semibold">Editorial Surface</h3>
            <p className="mt-2 font-sans text-sm text-muted-foreground">
              This surface has a subtle paper grain texture at ~3% opacity,
              applied via the <code className="font-mono text-xs">.paper-grain</code> utility class.
              Use it on editorial surfaces to add warmth and depth.
            </p>
          </div>
          <div className="rounded-md bg-card p-4">
            <p className="font-mono text-xs text-muted-foreground">
              .paper-grain::after &#123; opacity: 0.03; &#125;
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
