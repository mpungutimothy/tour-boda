# Tour-Boda — Design Direction: "Ride Computer"

Status: **direction locked, rollout in progress**
Supersedes the cream + Fraunces + terracotta system in `app/globals.css`.

## The brief

Make it engaging and futuristic while keeping the theme: touring Uganda on a
motorcycle with a local boda-boda guide.

## Subject

Tour-Boda Uganda. Boda-boda (motorcycle taxi) tours in Kampala, Jinja, Entebbe.
Audience: independent travellers who want a named local guide, not a coach bus.
The destination page's single job: convince a reader that this specific guide,
on this specific route, is worth UGX 85,000–450,000.

## Why the old system had to go

The previous palette was cream `#F8F6F1` + Fraunces + terracotta `#E66233`.
That is one of the three looks the frontend-design skill names as AI defaults
("a warm cream background with a high-contrast serif display and a terracotta
accent"). The palette *hues* were subject-derived and worth keeping; the
*assembly* was the default.

## What the tooling actually recommended

`dsh-ui-ux-pro-max` was queried for "dark futuristic instrument panel
automotive HUD". Its own style database rated the obvious answers poorly:

| Style | Its own rating | Verdict |
|---|---|---|
| HUD / Sci-Fi FUI | accessibility ⚠ Poor (thin lines); conversion ✗ Low; **unsuitable for reading-heavy content** | Rejected |
| Cyberpunk UI | light mode ✗; unsuitable for conservative brands | Rejected |
| Cyberpunk Mobile HUD | dark-only; unsuitable for minimal editorial apps | Rejected |
| **Dark Mode (OLED)** | **accessibility ✓ WCAG AAA; performance Excellent; complexity Low** | **Adopted as base** |

So a neon-on-black "futuristic" is disqualified by the tool itself — this site
is reading-heavy. We take the OLED base and borrow only the *structural*
HUD vocabulary: 1px hairlines, tick marks, monospace telemetry, waypoint
markers. No glow, no `#00FFFF`, no thin lines carrying content.

Its palette steer — **"Adventure orange + map teal"** — is adopted, because a
cool data colour is exactly what the old warm-only palette lacked.

## Concept

**A ride computer for a daytime road.** The interface is a motorcycle
instrument cluster: precise, legible in sunlight, warm in its signal colour.
The page moves through a day of riding — dawn departure (dark), midday
touring (light), dusk return (dark).

That day/night rhythm is the reason the site keeps both themes, and it gives
long pages a narrative arc instead of one flat surface.

## Colour

Dark is the primary surface; light is the "midday" reading surface.

| Role | Dark (night road) | Light (midday) |
|---|---|---|
| Ground | `#0C0B0A` warm charcoal | `#EDEDE7` cool bone |
| Raised | `#161412` | `#FFFFFF` |
| Ink | `#F5F1EA` bone | `#14110E` |
| Muted ink | `#A79E92` | `#5C554C` |
| **Signal** (warm) | `#FF6B2C` laterite | `#C2410C` |
| **Data** (cool) | `#22B8CF` map teal | `#0E7490` |
| Hairline | `#2A2724` | `#D6D3CB` |

Signal orange is warmth and action. Data teal is route, distance, telemetry —
a colour that carries *information* rather than emphasis. Splitting those two
jobs is what stops the palette reading as decoration.

Both themes target **≥ 4.5:1 for body text**, correcting the seven AA failures
found in the old tokens (verified with `scripts/check-contrast.mjs`).

## Type — three voices

| Voice | Face | Job |
|---|---|---|
| Machine | **Barlow Condensed** | Headings, UI labels, instrument readouts. Condensed, squared, derived from highway signage — fast and technical. |
| Data | **JetBrains Mono** | Every number that matters: distance, price, duration, coordinates. Promoted from captions to a primary role. |
| Reading | **Inter** | Body copy. Kept for legibility at small sizes. |
| Human | **Fraunces** *(restrained)* | Only the guide's own voice — pull quotes and first-person lines. |

The Fraunces/machine split is the one idea doing real work: the product is a
**human guide plus a machine**. Cold condensed telemetry around a warm serif
quote makes that argument visually instead of just saying it.

## Signature element — The Trip Rail

A persistent hairline rail down the page edge with tick marks and a live
distance readout. **Scrolling the page advances the odometer**: scroll
position is kilometres travelled along the route, and each narrative stop is a
labelled waypoint.

- Desktop: left rail, tick marks every 5 km, waypoint nodes at real stops.
- Mobile: thin top hairline, distance readout in the header.
- `aria-hidden` and purely additive — all content remains in the DOM in
  reading order, so screen readers and no-JS users lose nothing.
- Honours `prefers-reduced-motion`: the readout jumps rather than eases.

It earns its place because the page *is* a route, so the device encodes
something true rather than decorating.

## Layout

- Dark hero built as an **instrument cluster**: real destination figures
  (38 km, 3.5 hrs, 4 acres, 1.2bn shillings) as readouts, not a stat row.
- Light "midday" band for the long narrative, tiers and FAQ — the reading
  stretch of the ride.
- Dark close for the booking CTA (dusk).
- Narrative keeps its `65ch` measure (already correct).

## Motion

Scroll-linked rail progress, waypoint ticks, staggered readout reveal on load.
All transform/opacity only. Reduced motion removes the transitions without
removing information.

## Rollout

1. **Foundation** — tokens, fonts, tailwind theme.
2. **Signature** — Trip Rail, instrument readouts, header/footer.
3. **Flagship** — destination page.
4. **Remaining** — home, tours, guides, about, contact, styleguide, admin.

## Non-negotiables

- WCAG AA on body text in both themes.
- `prefers-reduced-motion` respected.
- Visible keyboard focus.
- Every number on screen traceable to `data/destinations.ts` — no invented
  telemetry.
