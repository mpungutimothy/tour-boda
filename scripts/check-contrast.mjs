/**
 * WCAG 2.1 contrast audit for the Tour-Boda token set.
 *
 * Mirrors app/globals.css exactly, in both scopes:
 *   LIGHT — the content body (white and cream)
 *   SHELL — the dark header, footer and photographic bands
 *
 * Run: node scripts/check-contrast.mjs
 *
 * Thresholds are per-pair because not every usage is body text. A 28px price in
 * gold is "large text" under WCAG (3:1); an 11px gold eyebrow is not (4.5:1).
 * Auditing both against a flat 4.5 either fails working pairs or, worse, passes
 * broken ones, so each pair declares the bar it actually has to clear.
 *
 *   min 4.5  normal body and small UI text
 *   min 3.0  large text (>=18.66px bold or >=24px), and non-text UI boundaries
 */

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0) * 255, f(8) * 255, f(4) * 255];
}

const toHex = (c) =>
  "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("").toUpperCase();

function luminance([r, g, b]) {
  const ch = [r, g, b].map((v) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function contrast(fg, bg) {
  const [a, b] = [luminance(fg), luminance(bg)].sort((x, y) => y - x);
  return (a + 0.05) / (b + 0.05);
}

const over = (fg, bg, alpha) => fg.map((c, i) => c * alpha + bg[i] * (1 - alpha));
const rgb = (t) => hslToRgb(t[0], t[1], t[2]);

/* ---------------------------------------------------------------- palettes */

const LIGHT = {
  background: [0, 0, 100], // #FFFFFF
  foreground: [45, 17, 9], // #1C1A14
  card: [0, 0, 100],
  cream: [44, 65, 96], // #FBF7EC
  field: [44, 44, 92], // #F3EEE0
  mutedForeground: [38, 11, 38], // #6B6355
  primary: [36, 64, 48], // #C98A2C — fills only
  primaryInk: [32, 71, 31], // #8A5A16 — gold text, AA at any size
  primaryForeground: [40, 30, 8],
  success: [130, 19, 26], // #3F5C44
  successDeep: [133, 27, 20], // #2F4A35
  clay: [15, 60, 44], // #B5502D
  destructive: [2, 66, 45],
  warning: [36, 84, 34],
  hairline: [60, 2, 89],
  scrim: [30, 12, 3],
  onScrim: [36, 20, 96],
};

const SHELL = {
  background: [40, 17, 7], // #15130F
  foreground: [43, 45, 92], // #F4EFE2
  card: [38, 16, 10],
  cream: [38, 16, 10],
  field: [38, 16, 13],
  mutedForeground: [44, 20, 74], // #C9C2AE
  primary: [36, 64, 48],
  primaryInk: [36, 64, 48], // bright gold is legible on soil
  primaryForeground: [40, 17, 7],
  success: [130, 26, 52],
  successDeep: [130, 30, 62],
  clay: [15, 60, 44],
  destructive: [2, 72, 62],
  warning: [36, 90, 58],
  hairline: [38, 10, 17],
  scrim: [30, 12, 3],
  onScrim: [36, 20, 96],
};

/* ------------------------------------------------------------------- pairs */

const LIGHT_PAIRS = [
  // Body text
  ["ink on white", "foreground", "background", 4.5],
  ["ink on cream band", "foreground", "cream", 4.5],
  ["ink on card", "foreground", "card", 4.5],
  ["secondary text on white", "mutedForeground", "background", 4.5],
  ["secondary text on cream band", "mutedForeground", "cream", 4.5],
  ["secondary text on card", "mutedForeground", "card", 4.5],
  ["secondary text on form field", "mutedForeground", "field", 4.5],

  // Gold — the pair the brief calls out explicitly. One token has to serve an
  // 11px eyebrow and a 28px price, so it is audited at the stricter 4.5 bar.
  ["gold text on white", "primaryInk", "background", 4.5],
  ["gold text on cream band", "primaryInk", "cream", 4.5],
  ["gold text on card", "primaryInk", "card", 4.5],
  ["gold text on form field", "primaryInk", "field", 4.5],
  ["dark text on gold fill (CTA)", "primaryForeground", "primary", 4.5],

  // Trust and tier accents
  ["green #3F5C44 on white", "success", "background", 4.5],
  ["green #3F5C44 on cream", "success", "cream", 4.5],
  ["green #2F4A35 small badge on white", "successDeep", "background", 4.5],
  ["white on green fill (Verified badge)", "background", "success", 4.5],
  ["clay #B5502D on white", "clay", "background", 4.5],
  ["white on clay fill (Experience flag)", "background", "clay", 4.5],

  // Status
  ["destructive on white", "destructive", "background", 4.5],
  ["warning on white", "warning", "background", 4.5],

  // Non-text boundaries
  ["hairline on white (divider)", "hairline", "background", 1.2],
  ["gold fill on white (button edge)", "primary", "background", 1.2],
];

const SHELL_PAIRS = [
  ["paper on soil", "foreground", "background", 4.5],
  ["dimmed paper nav link on soil", "mutedForeground", "background", 4.5],
  ["paper on shell card", "foreground", "card", 4.5],
  ["dimmed paper on shell card", "mutedForeground", "card", 4.5],
  ["gold on soil (small label)", "primaryInk", "background", 4.5],
  ["gold on soil (large)", "primaryInk", "background", 3.0],
  ["dark text on gold fill (CTA)", "primaryForeground", "primary", 4.5],
  ["lifted green on soil (Verified)", "success", "background", 4.5],
  ["paper/70 on soil", "foreground", "background", 4.5, 0.7],
  ["paper/60 on soil", "foreground", "background", 4.5, 0.6],
  ["hairline on soil (divider)", "hairline", "background", 1.2],
];

// Text over photography always sits on the constant scrim, in both scopes.
const SCRIM_PAIRS = [
  ["on-scrim paper on scrim", "onScrim", "scrim", 4.5],
  ["on-scrim/85 on scrim", "onScrim", "scrim", 4.5, 0.85],
  ["on-scrim/75 on scrim", "onScrim", "scrim", 4.5, 0.75],
  ["on-scrim/60 on scrim (small)", "onScrim", "scrim", 4.5, 0.6],
  ["gold on scrim (eyebrow over photo)", "primary", "scrim", 4.5],
  ["gold on scrim (rating star)", "primary", "scrim", 3.0],
  ["white on clay over scrim (Experience)", "background", "clay", 4.5],
];

/* ----------------------------------------------------------------- the hero */

/*
 * The hero is the one surface whose background is a PHOTOGRAPH rather than a
 * token, so it cannot be audited from the palette alone and is modelled here
 * explicitly.
 *
 * The model is deliberately adversarial: it assumes the pixel behind the text
 * is pure white. No real photograph of a street is, so every ratio below is a
 * floor rather than an estimate — if a pair passes here it passes on any image
 * anyone ever swaps in, which is the property that matters when the photography
 * is still temporary.
 *
 * Two overlay layers are stacked, matching app/page.tsx:
 *   base — gradient to bottom-right, alpha 0.70 → 0.78
 *   left — gradient to right,        alpha 0.45 → 0 in the text column
 * Light survives both as (1−a₁)(1−a₂), so the composite alpha under the
 * headline column is 1 − 0.30 × 0.55 = 0.835, and under the middle of the
 * column roughly 0.77.
 */
const WHITE_PIXEL = [255, 255, 255];
const heroBg = (alpha) => over([0, 0, 0], WHITE_PIXEL, alpha);
const stack = (a, b) => 1 - (1 - a) * (1 - b);

const HERO = {
  foreground: rgb(SHELL.foreground),
  mutedForeground: rgb(SHELL.mutedForeground),
  primary: rgb(SHELL.primary),
  base70: heroBg(0.7), // lightest point of the base gradient
  base78: heroBg(0.78), // deepest point
  leftColumn: heroBg(stack(0.7, 0.45)), // 0.835 — under the headline
  midColumn: heroBg(stack(0.7, 0.22)), // ~0.766 — right edge of the stat row
};

const HERO_PAIRS = [
  ["headline (paper) over lightest base", "foreground", "base70", 4.5],
  ["eyebrow (paper) over lightest base", "foreground", "base70", 4.5],
  ["stat number (paper) over lightest base", "foreground", "base70", 4.5],
  ["stat label (dimmed paper) over lightest base", "mutedForeground", "base70", 4.5],
  ["headline (paper) over deepest base", "foreground", "base78", 4.5],
  ["stat label (dimmed paper) over left column", "mutedForeground", "leftColumn", 4.5],
  ["stat label (dimmed paper) over mid column", "mutedForeground", "midColumn", 4.5],
];

/* -------------------------------------------------------------------- run */

const failures = [];
let total = 0;

function run(title, tokens, pairs) {
  console.log(`\n${title}`);
  console.log("─".repeat(72));
  console.log(`${"PAIR".padEnd(44)} ${"RATIO".padEnd(7)} VERDICT`);

  for (const [label, fgKey, bgKey, min, alpha] of pairs) {
    total += 1;
    const bg = rgb(tokens[bgKey]);
    let fg = rgb(tokens[fgKey]);
    if (alpha !== undefined) fg = over(fg, bg, alpha);

    const ratio = contrast(fg, bg);
    const pass = ratio >= min;
    if (!pass) failures.push(`${title} → ${label} (${ratio.toFixed(2)} < ${min})`);

    const verdict = pass
      ? ratio >= 7 && min >= 4.5
        ? "AA / AAA"
        : "PASS"
      : `FAIL (need ${min})`;
    console.log(`  ${label.padEnd(42)} ${ratio.toFixed(2).padEnd(7)} ${verdict}`);
  }
}

/** A variant of `run` for pairs whose "tokens" are already resolved RGB. */
function runRgb(title, tokens, pairs) {
  console.log(`\n${title}`);
  console.log("─".repeat(72));
  console.log(`${"PAIR".padEnd(44)} ${"RATIO".padEnd(7)} VERDICT`);

  for (const [label, fgKey, bgKey, min] of pairs) {
    total += 1;
    const ratio = contrast(tokens[fgKey], tokens[bgKey]);
    const pass = ratio >= min;
    if (!pass) failures.push(`${title} → ${label} (${ratio.toFixed(2)} < ${min})`);
    const verdict = pass
      ? ratio >= 7 && min >= 4.5
        ? "AA / AAA"
        : "PASS"
      : `FAIL (need ${min})`;
    console.log(`  ${label.padEnd(42)} ${ratio.toFixed(2).padEnd(7)} ${verdict}`);
  }
}

console.log("Resolved accents (identical in both scopes)");
for (const k of ["primary", "clay", "success"]) {
  console.log(
    `  ${k.padEnd(12)} light ${toHex(rgb(LIGHT[k]))}   shell ${toHex(rgb(SHELL[k]))}`,
  );
}

run("LIGHT — content body", LIGHT, LIGHT_PAIRS);
run("SHELL — header, footer, photo bands", SHELL, SHELL_PAIRS);
run("PHOTOGRAPHY — text over the constant scrim", LIGHT, SCRIM_PAIRS);
runRgb(
  "HERO — text over the overlay (worst case: a pure-white pixel)",
  HERO,
  HERO_PAIRS,
);

/*
 * Control for the hero eyebrow. The brand eyebrow is gold everywhere else on
 * the site, and it is deliberately PAPER on the hero. This is why: gold does
 * clear 4.5:1 at the far left, where the headline scrim is deepest, but it does
 * NOT hold across the full width of the eyebrow line, whose right-hand end sits
 * where the left scrim has faded out. Since the eyebrow is 11px text, and since
 * the overlay has to keep working when the temporary photograph is replaced,
 * paper is used there instead of a colour that only passes on one side of one
 * line. Printed rather than asserted: if a future overlay does make gold viable,
 * that is a colour decision, not a regression.
 */
const goldAtLeft = contrast(HERO.primary, HERO.leftColumn);
const goldAtMid = contrast(HERO.primary, HERO.midColumn);
const goldAtBase = contrast(HERO.primary, HERO.base70);
console.log("\nCONTROL — why the hero eyebrow is paper and not brand gold");
console.log("─".repeat(72));
console.log(
  `  gold #C98A2C, deepest scrim (left edge)   ${goldAtLeft.toFixed(2)}   ${goldAtLeft >= 4.5 ? "would clear 4.5" : "below 4.5"}`,
);
console.log(
  `  gold #C98A2C, mid column                 ${goldAtMid.toFixed(2)}   ${goldAtMid >= 4.5 ? "would clear 4.5" : "below 4.5"}`,
);
console.log(
  `  gold #C98A2C, lightest base              ${goldAtBase.toFixed(2)}   ${goldAtBase >= 4.5 ? "would clear 4.5" : "below 4.5"}`,
);
console.log(
  `  paper #F4EFE2, lightest base             ${contrast(HERO.foreground, HERO.base70).toFixed(2)}   used for the eyebrow`,
);

/* -------------------------------------------------------- negative control */
/*
 * The brief nominates #C98A2C for gold fills and a deeper #A8701F for gold
 * text on white. The fill tone is audited here as a negative control: it must
 * keep failing as text, because that is the reason the two tokens exist. Note
 * the shipped text token goes a step deeper than the brief's suggestion — see
 * the comment on `--primary-ink` in app/globals.css — because #A8701F measures
 * 4.25:1 and this token also paints 11px eyebrows.
 */
const brightGoldOnWhite = contrast(rgb(LIGHT.primary), rgb(LIGHT.background));
const deepGoldOnWhite = contrast(rgb(LIGHT.primaryInk), rgb(LIGHT.background));
const briefGoldOnWhite = contrast(hslToRgb(33, 68, 40), rgb(LIGHT.background));

console.log("\nNEGATIVE CONTROL — why gold fill and gold text are separate tokens");
console.log("─".repeat(72));
console.log(
  `  #C98A2C (fill gold) as text on white   ${brightGoldOnWhite.toFixed(2)}   must stay below 4.5`,
);
console.log(
  `  #A8701F (brief's text gold) on white   ${briefGoldOnWhite.toFixed(2)}   large text only`,
);
console.log(
  `  #8A5A16 (shipped text gold) on white   ${deepGoldOnWhite.toFixed(2)}   must clear 4.5`,
);
if (brightGoldOnWhite >= 4.5) {
  failures.push(
    "negative control: #C98A2C unexpectedly passes as text on white — the fill and text gold tokens may have been merged",
  );
}
if (deepGoldOnWhite < 4.5) {
  failures.push(
    "gold text token #8A5A16 no longer clears 4.5:1 on white",
  );
}

console.log(
  `\n${failures.length} of ${total} pair(s) below their required ratio.`,
);
if (failures.length > 0) {
  for (const failure of failures) console.log(`  FAIL  ${failure}`);
  process.exitCode = 1;
} else {
  console.log("All pairs clear WCAG AA at the level each usage requires.\n");
}
