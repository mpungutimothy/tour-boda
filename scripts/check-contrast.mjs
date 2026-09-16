/**
 * WCAG 2.1 contrast audit for the Tour-Boda "Ride Computer" tokens.
 * Reproduces app/globals.css HSL triples as hex and computes real ratios.
 *
 * Run:  node scripts/check-contrast.mjs
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

/* --- tokens, mirroring app/globals.css ---------------------------------- */
const NIGHT = {
  background: [30, 9, 4],
  foreground: [38, 36, 94],
  card: [30, 10, 8],
  panel: [24, 10, 10],
  mutedForeground: [34, 11, 61],
  primary: [18, 100, 59],
  primaryForeground: [23, 48, 5],
  data: [188, 72, 47],
  accent: [189, 76, 23],
  accentForeground: [38, 36, 94],
  secondary: [24, 9, 14],
  secondaryForeground: [38, 36, 94],
  success: [151, 65, 54],
  warning: [43, 96, 56],
  error: [3, 100, 66],
  border: [30, 8, 15],
  ink: [38, 36, 94],
};

const MIDDAY = {
  background: [60, 14, 92],
  foreground: [30, 18, 7],
  card: [0, 0, 100],
  panel: [48, 18, 96],
  mutedForeground: [34, 10, 33],
  primary: [18, 88, 37],
  primaryForeground: [40, 100, 98],
  data: [193, 82, 31],
  accent: [193, 82, 31],
  accentForeground: [40, 100, 98],
  secondary: [48, 12, 88],
  secondaryForeground: [30, 18, 7],
  success: [142, 72, 26],
  warning: [26, 90, 33],
  error: [0, 74, 42],
  border: [44, 12, 82],
  ink: [30, 18, 7],
};

const rgb = (t) => hslToRgb(t[0], t[1], t[2]);

function audit(name, T, pairs) {
  console.log(`\n=== ${name} ===`);
  console.log(`  ${"PAIR".padEnd(46)} ${"RATIO".padEnd(7)} VERDICT`);
  let fails = 0;
  for (const [label, fgKey, bgKey, alpha] of pairs) {
    let fg = rgb(T[fgKey]);
    const bg = rgb(T[bgKey]);
    if (alpha !== undefined) fg = over(fg, bg, alpha);
    const ratio = contrast(fg, bg);
    if (ratio < 4.5) fails += 1;
    console.log(
      `  ${label.padEnd(46)} ${ratio.toFixed(2).padEnd(7)} ${ratio < 4.5 ? "AA FAIL" : "AA"}${
        ratio >= 7 ? " / AAA" : ""
      }`,
    );
  }
  return fails;
}

console.log("Night road — resolved hex");
for (const k of ["background", "card", "panel", "foreground", "mutedForeground", "primary", "data"]) {
  console.log(`  ${k.padEnd(18)} ${toHex(rgb(NIGHT[k]))}`);
}
console.log("\nMidday — resolved hex");
for (const k of ["background", "card", "foreground", "mutedForeground", "primary", "data"]) {
  console.log(`  ${k.padEnd(18)} ${toHex(rgb(MIDDAY[k]))}`);
}

let fails = 0;
fails += audit("NIGHT ROAD (default)", NIGHT, [
  ["foreground on background", "foreground", "background"],
  ["foreground on card", "foreground", "card"],
  ["muted-foreground on background", "mutedForeground", "background"],
  ["muted-foreground on card", "mutedForeground", "card"],
  ["primary on background (signal text)", "primary", "background"],
  ["primary on card", "primary", "card"],
  ["primary-foreground on primary (buttons)", "primaryForeground", "primary"],
  ["data on background (telemetry)", "data", "background"],
  ["data on card", "data", "card"],
  ["accent-foreground on accent", "accentForeground", "accent"],
  ["secondary-foreground on secondary", "secondaryForeground", "secondary"],
  ["success on background", "success", "background"],
  ["warning on background", "warning", "background"],
  ["error on background", "error", "background"],
  ["ink/90 on background", "ink", "background", 0.9],
  ["ink/70 on card", "ink", "card", 0.7],
  ["ink/60 on background", "ink", "background", 0.6],
  ["foreground on panel", "foreground", "panel"],
]);

fails += audit("MIDDAY (light bands)", MIDDAY, [
  ["foreground on background", "foreground", "background"],
  ["foreground on card", "foreground", "card"],
  ["muted-foreground on background", "mutedForeground", "background"],
  ["muted-foreground on card", "mutedForeground", "card"],
  ["primary on background (signal text)", "primary", "background"],
  ["primary on card", "primary", "card"],
  ["primary-foreground on primary (buttons)", "primaryForeground", "primary"],
  ["data on background (telemetry)", "data", "background"],
  ["data on card", "data", "card"],
  ["accent-foreground on accent", "accentForeground", "accent"],
  ["secondary-foreground on secondary", "secondaryForeground", "secondary"],
  ["success on background", "success", "background"],
  ["warning on background", "warning", "background"],
  ["error on background", "error", "background"],
  ["ink/70 on card", "ink", "card", 0.7],
  ["foreground on panel", "foreground", "panel"],
]);

console.log(`\n${fails} pair(s) below 4.5:1 AA for normal text.`);
