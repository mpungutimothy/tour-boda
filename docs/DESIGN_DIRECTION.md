# Tour-Boda — Visual Language

Status: **next-generation travel-tech.** All-dark.
Supersedes the earlier warm "Ride Computer" instrument system.

## The brief

Precise, kinetic, a little bit "control panel for your trip" rather than
"brochure". Closer to a modern fintech/mobility app — Uber's dark mode, Arc,
Linear — while keeping the "local guide, real roads" copy front and centre.
Futuristic here means confident, not sci-fi: don't over-neon it.

All existing content, copy and structure are unchanged. This is a visual
language change only.

## Colour

| Role | Value | Use |
|---|---|---|
| Ground | `#090A0C` (`220 14% 4%`) | Cool near-black. Never pure black. |
| Raised | `#0D0F11` | Cards on the flat base |
| Panel | `#121417` | Inset blocks, table headers |
| Ink | `#F3F4F7` | Primary text |
| Muted ink | `#9AA0AC` | Secondary text |
| **Accent** | **`#CCFF33`** (`75 100% 60%`) | Electric lime. The only saturated colour. |
| Hairline | `#22252B` | 1px borders |
| Scrim | `#060709` | Text over photography |

**One accent, used sparingly.** The previous system split warmth (orange) and
information (teal) across two hues; that pair is collapsed into lime, and
hierarchy now comes from opacity rather than hue. The `--data` token was
removed entirely and its 16 files of usages folded into `--primary`, so the
single-accent rule holds in code, not just visually.

`--accent` stays a *neutral* wash (`220 12% 14%`) on purpose: the UI primitives
use it for hover backgrounds, and a lime wash landing behind body text would
break contrast.

Semantic colours stay separate and are used only for state: success `#31D88A`,
warning `#FFBF29`, error `#FF5252`.

Contrast is verified by `scripts/check-contrast.mjs` — 20 pairs, 0 below AA.
Lime measures **16.9:1** as text on the base and **16.7:1** for dark text on a
lime fill.

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

Fraunces survives in exactly one place — the honest-note pull quote in the road
log — because it is the one moment the guide speaks in their own voice.

## Surfaces

- `.glass` — frosted panel: `backdrop-filter: blur(14px) saturate(140%)` with a
  1px hairline at 75% opacity. For cards and the nav **over imagery**.
- `.glass-nav` — denser variant for the sticky header.
- Solid `bg-card` + hairline is correct for cards on the flat base, where there
  is nothing behind them to blur.
- No drop shadows for separation; hairlines instead.

## Texture and glow

- `.grid-plate` — precision grid, fixed behind the whole site at 40% opacity.
- `.topo` — concentric contour rings, for mapped-terrain sections.
- `.glow-mesh` — soft multi-stop radial mesh behind the hero and section headers.
- `.glow-accent` — tighter accent bloom for section headers and the footer.
- `.paper-grain` — film grain at 3% for editorial bands.

Glows are deliberately low-alpha (5–12%). Anything stronger reads as neon.

## Motion

| Utility | Behaviour |
|---|---|
| `Reveal` | Scroll-triggered fade/slide-up, staggered by index. |
| `CountUp` / `CountUpCurrency` | rAF count-up on first scroll into view, easeOutExpo, tabular digits. |
| `RouteLine` | Self-drawing schematic of Entebbe → Kampala → Jinja with ping nodes. |
| `.card-glow` | Hover lift + accent border bloom on route tiles. |
| `.sheen` | Light sweep across accent buttons on hover. |
| `.duotone` | Grayscale + darken + accent overlay so photography sits inside the dark UI. |
| `.track-dots` | Dotted route-progress track on route tiles. |

Every one of these is transform/opacity only and is neutralised by the
`prefers-reduced-motion` block in `globals.css` and by `usePrefersReducedMotion`
in the animated components. Nothing hides content behind an animation that may
not run.

## Non-negotiables

- WCAG AA on body text, both as text and as fill.
- `prefers-reduced-motion` respected.
- Visible keyboard focus.
- Every figure on screen traceable to `data/destinations.ts` — no invented
  telemetry, no fabricated ratings.
