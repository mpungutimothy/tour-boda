/**
 * WCAG 2.1 contrast audit for the Tour-Boda token set (all-dark, savanna gold).
 * Mirrors app/globals.css. Run: node scripts/check-contrast.mjs
 *
 * The three tier tones are audited twice: as text on the base surfaces, and as
 * a fill behind `--primary-foreground`, because both are real usages (tier
 * badges are text; the active tier tab is a fill).
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

const T = {
  background: [30, 8, 4],
  foreground: [36, 20, 96],
  card: [28, 7, 6],
  panel: [28, 6, 8],
  mutedForeground: [33, 9, 64],
  primary: [42, 90, 56],
  primaryForeground: [30, 25, 6],
  accent: [28, 6, 14],
  accentForeground: [36, 20, 96],
  secondary: [28, 6, 12],
  secondaryForeground: [36, 20, 96],
  success: [152, 62, 48],
  warning: [42, 100, 58],
  error: [358, 100, 68],
  scrim: [30, 12, 3],
  onScrim: [36, 20, 96],
  hairline: [28, 6, 15],
  tier1: [13, 65, 57],
  tier2: [42, 90, 56],
  tier3: [160, 60, 46],
};

const rgb = (t) => hslToRgb(t[0], t[1], t[2]);

const pairs = [
  ["foreground on background", "foreground", "background"],
  ["foreground on card", "foreground", "card"],
  ["foreground on panel", "foreground", "panel"],
  ["muted-foreground on background", "mutedForeground", "background"],
  ["muted-foreground on card", "mutedForeground", "card"],
  ["muted-foreground on panel", "mutedForeground", "panel"],
  ["gold accent as text on background", "primary", "background"],
  ["gold accent as text on card", "primary", "card"],
  ["gold accent as text on panel", "primary", "panel"],
  ["dark text on gold fill (buttons)", "primaryForeground", "primary"],
  ["accent-foreground on accent wash", "accentForeground", "accent"],
  ["secondary-foreground on secondary", "secondaryForeground", "secondary"],
  ["success on background", "success", "background"],
  ["warning on background", "warning", "background"],
  ["error on background", "error", "background"],
  ["on-scrim on scrim (hero text)", "onScrim", "scrim"],
  ["foreground/90 on background", "foreground", "background", 0.9],
  ["foreground/70 on background", "foreground", "background", 0.7],
  ["foreground/60 on background", "foreground", "background", 0.6],
];

// Tier tones: text usage, then fill usage.
for (const [key, label] of [
  ["tier1", "tier 1 freelance"],
  ["tier2", "tier 2 guided"],
  ["tier3", "tier 3 experience"],
]) {
  pairs.push([`${label} as text on background`, key, "background"]);
  pairs.push([`${label} as text on card`, key, "card"]);
  pairs.push([`dark text on ${label} fill`, "primaryForeground", key]);
}

// Tier chip: tone text over its own 13% wash on the card surface.
const failures = [];
for (const [key, label] of [
  ["tier1", "tier 1"],
  ["tier2", "tier 2"],
  ["tier3", "tier 3"],
]) {
  const bg = over(rgb(T[key]), rgb(T.card), 0.13);
  const ratio = contrast(rgb(T[key]), bg);
  const tag = ratio >= 4.5 ? (ratio >= 7 ? "AA / AAA" : "AA") : "AA FAIL";
  if (ratio < 4.5) failures.push(`${label} chip text on its own wash`);
  console.log(`  ${`${label} chip text on 13% wash`.padEnd(38)} ${ratio.toFixed(2).padEnd(7)} ${tag}`);
}

console.log("Resolved hex");
for (const k of Object.keys(T)) console.log(`  ${k.padEnd(18)} ${toHex(rgb(T[k]))}`);

console.log(`\n${"PAIR".padEnd(38)} ${"RATIO".padEnd(7)} VERDICT`);
for (const [label, fgKey, bgKey, alpha] of pairs) {
  let fg = rgb(T[fgKey]);
  const bg = rgb(T[bgKey]);
  if (alpha !== undefined) fg = over(fg, bg, alpha);
  const ratio = contrast(fg, bg);
  if (ratio < 4.5) failures.push(label);
  console.log(
    `  ${label.padEnd(38)} ${ratio.toFixed(2).padEnd(7)} ${ratio < 4.5 ? "AA FAIL" : "AA"}${
      ratio >= 7 ? " / AAA" : ""
    }`,
  );
}

console.log(`\n${failures.length} of ${pairs.length + 3} pair(s) below 4.5:1 AA for normal text.`);
if (failures.length > 0) {
  for (const failure of failures) console.log(`  FAIL  ${failure}`);
  process.exitCode = 1;
}
