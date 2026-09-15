import Link from "next/link";
import { destinations } from "@/data/destinations";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  MapPin,
  Star,
  Compass,
  CreditCard,
  Bike,
  ShieldCheck,
  Users,
  Wallet,
  Heart,
  Locate,
} from "lucide-react";

const heroImage =
  "https://images.pexels.com/photos/38520450/pexels-photo-38520450.jpeg?auto=compress&cs=tinysrgb&w=1920";

const howItWorks = [
  {
    icon: Compass,
    title: "Choose your experience",
    desc: "Pick a tour that fits your time and budget. Filter by region, duration, or price.",
  },
  {
    icon: CreditCard,
    title: "Book and pay",
    desc: "Reserve your spot online. Pay in shillings — no tourist markups, no surprise fees.",
  },
  {
    icon: Bike,
    title: "Ride with a vetted guide",
    desc: "Your guide picks you up. Every rider is licensed and knows the road by name.",
  },
];

const budgetPrompts = [
  {
    icon: Wallet,
    question: "What can I do this Saturday with UGX 50,000?",
  },
  {
    icon: Locate,
    question: "Places within 20 km of me",
  },
  {
    icon: Heart,
    question: "Romantic experiences under UGX 100,000",
  },
];

const whyTourBoda = [
  {
    icon: ShieldCheck,
    title: "Safety",
    desc: "Every guide carries a spare helmet and a first-aid kit. You ride with someone who has done this road a hundred times.",
  },
  {
    icon: Users,
    title: "Local guides",
    desc: "Our riders grew up here. They know the woman who sells the best rolex at Nakawa, and which pothole floods first.",
  },
  {
    icon: Wallet,
    title: "Fair prices",
    desc: "You pay in shillings at local rates. The price you see is the price you pay — no tourist markup, no hidden fees.",
  },
];

export default function Home() {
  return (
    <>
      {/* Hero — unchanged */}
      <section className="relative flex min-h-[80vh] items-center overflow-hidden">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Boda boda riders on a road in Uganda with mountains in the background"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/60 to-ink/20" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-primary/90 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wide text-primary-foreground">
              The Pearl of Africa
            </span>
            <h1 className="mt-6 font-serif text-5xl font-bold leading-[1.1] text-surface sm:text-6xl lg:text-7xl">
              Tour-Boda Uganda
            </h1>
            <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-surface/80 sm:text-xl">
              Your tour. Your boda guide. Your Uganda experience. Ride with
              local drivers who know every road, every shortcut, and the name
              of the woman who sells the best rolex at the Nakawa junction.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link href="/tours">
                  Find Your Guide
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-surface/30 bg-surface/10 text-surface hover:bg-surface/20 hover:text-surface">
                <Link href="#featured-tours">Browse Tours</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-sm text-surface/60">
              <span>6 guided tours</span>
              <span className="text-surface/30">·</span>
              <span>6 local boda guides</span>
              <span className="text-surface/30">·</span>
              <span>Prices from UGX 60,000</span>
            </div>
          </div>
        </div>
      </section>

      {/* 1. How it works */}
      <section className="border-b border-border/40 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-2 font-sans text-base text-muted-foreground">
              Three steps from idea to road.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {howItWorks.map((step, i) => (
              <div key={step.title} className="relative">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-serif text-3xl font-bold text-primary/30">
                    {i + 1}
                  </span>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="font-serif text-lg font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-1.5 font-sans text-sm leading-relaxed text-muted-foreground">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Featured destinations */}
      <section
        id="featured-tours"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              Featured Tours
            </h2>
            <p className="mt-2 font-sans text-base text-muted-foreground">
              Six guided rides across Uganda, each led by a local boda driver
              who knows the road.
            </p>
          </div>
          <Button
            asChild
            variant="link"
            className="hidden shrink-0 sm:inline-flex"
          >
            <Link href="/tours">
              View all tours
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <Link
              key={d.id}
              href={`/destinations/${d.slug}`}
              className="group overflow-hidden rounded-lg border border-border bg-card shadow-warm-sm transition-shadow hover:shadow-warm-md"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.images[0]?.url}
                  alt={d.images[0]?.caption ?? d.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute left-3 top-3">
                  <Badge variant="secondary" className="shadow-warm-sm">
                    {d.category}
                  </Badge>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-lg font-semibold text-ink">
                  {d.name}
                </h3>
                <div className="mt-2 flex items-center gap-4 font-sans text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {d.location.region}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                  <span className="font-mono text-xs font-medium text-ink">
                    4.8
                  </span>
                  <span className="font-sans text-xs text-muted-foreground">
                    · 12 reviews
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                  <span className="font-mono text-sm font-semibold text-primary">
                    From UGX{" "}
                    {Math.min(
                      ...d.tiers.map((t) => t.price)
                    ).toLocaleString("en-UG")}
                  </span>
                  <span className="flex items-center gap-1 font-sans text-sm text-primary transition-all group-hover:gap-2">
                    View Tour
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/tours">
              View all tours
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* 3. Budget-led discovery */}
      <section className="paper-grain border-y border-border/40 bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
              What Are You Looking For?
            </h2>
            <p className="mt-2 font-sans text-base text-muted-foreground">
              Tell us your budget or your plan. We will find the ride.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {budgetPrompts.map((prompt) => (
              <button
                key={prompt.question}
                className="group flex items-start gap-4 rounded-lg border border-border bg-card p-6 text-left shadow-warm-sm transition-all hover:border-primary/40 hover:shadow-warm-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <prompt.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-serif text-base font-semibold leading-snug text-ink">
                    {prompt.question}
                  </p>
                  <span className="mt-2 flex items-center gap-1 font-sans text-sm text-primary transition-all group-hover:gap-2">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Tour-Boda */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            Why Tour-Boda
          </h2>
          <p className="mt-2 font-sans text-base text-muted-foreground">
            Three things we get right, every single ride.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {whyTourBoda.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-border bg-card p-6 shadow-warm-sm"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-ink">
                {item.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-muted-foreground">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer CTA — email capture */}
      <section className="bg-ink">
        <div className="paper-grain mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-4xl font-bold text-surface sm:text-5xl">
            Find your Uganda
          </h2>
          <p className="mx-auto mt-4 max-w-lg font-sans text-base leading-relaxed text-surface/70">
            One email a month with new tours, seasonal routes, and guides who
            just joined. No spam. Unsubscribe anytime.
          </p>
          <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="you@example.com"
              required
              className="border-surface/20 bg-surface/5 text-surface placeholder:text-surface/40"
            />
            <Button type="submit" size="lg" className="shrink-0">
              Get Trip Ideas
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
          <p className="mt-4 font-mono text-xs text-surface/40">
            We send one email a month. Your address stays with us.
          </p>
        </div>
      </section>
    </>
  );
}
