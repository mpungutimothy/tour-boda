# Tour-Boda — Visual Language

Status: **travel marketplace.** All-dark, warm ground.
Supersedes the previous cool lime "travel-tech" system.

## The brief

A confident, modern travel marketplace, benchmarked against Klook,
GetYourGuide, Airbnb Experiences and Uber rather than a generic tour-operator
template — with the mobility/booking patterns (filter bar, tier comparison,
"from UGX X" badges, itemised quote) doing the work that a brochure would do
with photography.

The accent must be rooted locally rather than generically. Generic travel-blue
is banned outright; so, on review, is electric lime, which reads Arc/Linear and
says nothing about Uganda.

## Colour

| Role | Value | Use |
|---|---|---|
| Ground | `#0A0908` (`30 8% 4%`) | Warm near-black. Never pure black. |
| Raised | `#100F0E` | Cards on the flat base |
| Panel | `#161413` | Inset blocks, table headers |
| Ink | `#F7F5F3` | Primary text |
| Muted ink | `#ABA49B` | Secondary text |
| **Accent** | **`#F4B72A`** (`42 90% 56%`) | **Savanna gold.** The only saturated brand colour. |
| Hairline | `#292624` | 1px borders |
| Scrim | `#090807` | Text over photography |

**Why gold.** The Uganda flag is black, yellow and red; the landscape is dry
savanna, red earth and Nile green. Savanna gold is the flag's yellow, and it
measures **11.0:1** as text on the base — better than the lime it replaces — and
**10.6:1** for dark text on a gold fill. It also reads warm and agricultural
rather than clinical, which is closer to what the product actually is.

**One accent, used sparingly.** Hierarchy comes from opacity and weight, not from
a second competing hue. `--accent` stays a *neutral* wash (`28 6% 14%`) on
purpose: the UI primitives use it for hover backgrounds, and a gold wash landing
behind body text would break contrast.

### Service-level tones

A second, tightly-scoped triad exists for the three service levels. This is not a
second brand colour — it is a **data encoding**, and it is the thing that makes
the tier comparison legible at a glance.

| Tier | Value | Hue source |
|---|---|---|
| Boda Freelance | `#D9694A` (`13 65% 57%`) | Red-earth terracotta |
| Guided Tour | `#F4B72A` (`42 90% 56%`) | Savanna gold — same as the accent |
| Experience Tour | `#2FBC8D` (`160 60% 46%`) | Nile green |

Components declare `data-tier="…"` and never a hue. One attribute selector in
`globals.css` resolves `--tier-color`, and the `.tier-text` / `.tier-chip` /
`.tier-fill` / `.tier-soft` / `.tier-ring` utilities read from it. The palette
can therefore be re-tuned in one place, and the tier colour is guaranteed
consistent across cards, tabs, comparison table, booking flow and footer.

All three clear **4.5:1** both as text on the base and as a fill behind
`--primary-foreground`; the lowest is terracotta at 5.7:1.

Semantic colours stay separate and are used only for state: success `#2FC67F`,
warning `#FFBF29`, error `#FF5C61`.

Contrast is verified by `scripts/check-contrast.mjs` — **31 pairs, 0 below AA**,
including the tier tones as text, as fill, and as text over their own 13% chip
wash.

## Type

| Voice | Face | Job |
|---|---|---|
| Display | **Space Grotesk** | Headings. Geometric/technical, tracking −0.02 to −0.03em. |
| Reading | **Inter** | Body copy. |
| Data | **JetBrains Mono** | Every number: prices, distances, durations, counters. |
| Human | **Fraunces** | The guide's own words — one pull quote, nothing else. |

Uppercase is reserved for **eyebrow labels** (`.telemetry`: mono, 0.18em
tracking) and small meta labels. Large headlines are sentence case with
*negative* tracking — the contrast between wide tracked-out labels and tight
headlines is what makes the system read as systematic.

## Surfaces

- `.glass` — frosted panel: `backdrop-filter: blur(14px) saturate(140%)` with a
  1px hairline at 75% opacity. For cards and the nav **over imagery**.
- `.glass-nav` — denser variant for the sticky header.
- `.plate` — solid card + hairline. Used for filter bars and side rails that sit
  on the flat base, where there is nothing behind them to blur. Glass there
  would be decoration without a job.
- No drop shadows for separation; hairlines instead.

## Texture and glow

- `.grid-plate` — precision grid, fixed behind the whole site at 40% opacity.
- `.topo` — concentric contour rings, for mapped-terrain sections.
- `.glow-mesh` — soft multi-stop radial mesh behind the hero and section
  headers, now mixing gold, Nile green and terracotta at 6–12%.
- `.glow-accent` — tighter accent bloom for section headers and the footer.
- `.paper-grain` — film grain at 3% for editorial bands.

Glows are deliberately low-alpha (5–12%). Anything stronger reads as neon.

## Photography

Two grades, both short of full grayscale so the country still reads as itself:

- `.duotone` — `grayscale(0.42) contrast(1.1) brightness(0.74) saturate(1.15)`,
  paired with a `bg-primary/14 mix-blend-overlay` layer. Warm grade for
  landscapes and route cards.
- `.grade-portrait` — lighter, for faces, where the heavy grade kills the eyes.

All destination photography is Wikimedia Commons under CC BY / CC BY-SA, chosen
so that every frame actually shows the place named on its card, and credited in
the data (`DestinationImage.credit`) because those licences require attribution.

## Motion

| Utility | Behaviour |
|---|---|
| `Reveal` | Scroll-triggered fade/slide-up, staggered by index. |
| `CountUp` / `CountUpCurrency` | rAF count-up on first scroll into view, easeOutExpo, tabular digits. |
| `RouteLine` | Self-drawing schematic of Entebbe → Kampala → Jinja with ping nodes. |
| `.card-glow` | Hover lift + accent border bloom on route tiles. |
| `.sheen` | Light sweep across accent buttons on hover. |
| `.track-dots` | Dotted progress rail, used for the booking stepper. |
| `animate-bar-grow` | Revenue-split bars growing out from the left. |
| `animate-seg-draw` | Donut segments sweeping round. |
| `animate-fade-up` | Filter results settling in as the query changes. |

Every one of these is transform/opacity only and is neutralised by the
`prefers-reduced-motion` block in `globals.css` and by `usePrefersReducedMotion`
in the animated components. Nothing hides content behind an animation that may
not run.

## Non-negotiables

- WCAG AA on body text, both as text and as fill — including all three tier tones.
- `prefers-reduced-motion` respected.
- Visible keyboard focus.
- Interactive controls are never nested inside an anchor.
- Every figure on screen traceable to `data/` — no invented telemetry and no
  fabricated ratings. The last hardcoded rating was removed from the structured
  data; see `lib/schema/destination.ts`.
