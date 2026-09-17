/**
 * WCAG 2.1 contrast audit for the Tour-Boda token set (all-dark).
 * Mirrors app/globals.css. Run: node scripts/check-contrast.mjs
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
  background: [220, 14, 4],
  foreground: [220, 20, 96],
  card: [220, 13, 6],
  panel: [220, 12, 8],
  mutedForeground: [220, 10, 64],
  primary: [75, 100, 60],
  primaryForeground: [220, 16, 5],
  data: [75, 100, 60],
  accent: [220, 12, 14],
  accentForeground: [220, 20, 96],
  secondary: [220, 12, 12],
  secondaryForeground: [220, 20, 96],
  success: [152, 68, 52],
  warning: [42, 100, 58],
  error: [358, 100, 66],
  scrim: [220, 16, 3],
  onScrim: [220, 20, 96],
  hairline: [220, 12, 15],
};

const rgb = (t) => hslToRgb(t[0], t[1], t[2]);

const pairs = [
  ["foreground on background", "foreground", "background"],
  ["foreground on card", "foreground", "card"],
  ["foreground on panel", "foreground", "panel"],
  ["muted-foreground on background", "mutedForeground", "background"],
  ["muted-foreground on card", "mutedForeground", "card"],
  ["accent (lime) as text on background", "primary", "background"],
  ["accent (lime) as text on card", "primary", "card"],
  ["accent (lime) as text on panel", "primary", "panel"],
  ["dark text on lime fill (buttons)", "primaryForeground", "primary"],
  ["data (lime) on background", "data", "background"],
  ["accent-foreground on accent wash", "accentForeground", "accent"],
  ["secondary-foreground on secondary", "secondaryForeground", "secondary"],
  ["success on background", "success", "background"],
  ["warning on background", "warning", "background"],
  ["error on background", "error", "background"],
  ["on-scrim on scrim (hero text)", "onScrim", "scrim"],
  ["foreground/90 on background", "foreground", "background", 0.9],
  ["foreground/70 on background", "foreground", "background", 0.7],
  ["foreground/60 on background", "foreground", "background", 0.6],
  ["muted-foreground on panel", "mutedForeground", "panel"],
];

console.log("Resolved hex");
for (const k of Object.keys(T)) console.log(`  ${k.padEnd(18)} ${toHex(rgb(T[k]))}`);

console.log(`\n${"PAIR".padEnd(40)} ${"RATIO".padEnd(7)} VERDICT`);
let fails = 0;
for (const [label, fgKey, bgKey, alpha] of pairs) {
  let fg = rgb(T[fgKey]);
  const bg = rgb(T[bgKey]);
  if (alpha !== undefined) fg = over(fg, bg, alpha);
  const ratio = contrast(fg, bg);
  if (ratio < 4.5) fails += 1;
  console.log(
    `  ${label.padEnd(38)} ${ratio.toFixed(2).padEnd(7)} ${ratio < 4.5 ? "AA FAIL" : "AA"}${
      ratio >= 7 ? " / AAA" : ""
    }`,
  );
}

console.log(`\n${fails} pair(s) below 4.5:1 AA for normal text.`);
