#!/usr/bin/env node
/**
 * Mobile layout audit — measures real rendered geometry in headless Chrome.
 *
 * The acceptance criteria for this work are stated in viewport widths ("test at
 * 375px, 414px and 768px"), and reading class names cannot answer any of them:
 * whether text is actually clipped, whether the document actually scrolls
 * sideways, or whether a grid really collapsed to one column depends on the
 * cascade, the content and the font metrics together.
 *
 * So this drives Chrome over the DevTools Protocol and measures the rendered
 * page. It uses Node's built-in WebSocket (Node 22+) and no npm dependencies,
 * and it talks to a Chrome binary the developer already has.
 *
 * Usage:
 *   node scripts/serve-static.mjs 4200 &
 *   node scripts/audit-mobile.mjs [--port 4200] [--shots]
 *
 * Chrome is launched on a random debugging port and shut down afterwards.
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(name);
  return at === -1 ? fallback : args[at + 1];
};
const PORT = Number(flag("--port", 4200));
const WANT_SHOTS = args.includes("--shots");
const SHOT_DIR = path.join(process.cwd(), ".mobile-audit");

const CHROME_CANDIDATES = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
];
const CHROME = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!CHROME) {
  console.error("No Chrome or Edge binary found. Install one, or skip this audit.");
  process.exit(2);
}

const WIDTHS = [320, 375, 414, 768, 1024];
const PAGES = [
  ["home", "/"],
  ["tours", "/tours"],
  ["guides", "/guides"],
  ["destination", "/destinations/jinja-nile"],
  ["how-it-works", "/how-it-works"],
  ["contact", "/contact"],
  ["credits", "/credits"],
];

/* ---------------------------------------------------------------- chrome */

const DEBUG_PORT = 9333;
const profile = path.join(tmpdir(), `dsh-mobile-audit-${Date.now()}`);

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    `--remote-debugging-port=${DEBUG_PORT}`,
    `--user-data-dir=${profile}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--disable-gpu",
    "--disable-extensions",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function waitForDebugger() {
  for (let i = 0; i < 100; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/version`);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 150));
  }
  throw new Error("Chrome DevTools endpoint never came up");
}

await waitForDebugger();

const targets = await (await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`)).json();
const page = targets.find((t) => t.type === "page");
if (!page) throw new Error("No page target");

const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener("open", resolve, { once: true });
  ws.addEventListener("error", reject, { once: true });
});

let nextId = 0;
const pending = new Map();
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(new Error(JSON.stringify(msg.error)));
    else resolve(msg.result);
  }
});

function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.exception?.description ?? "evaluate failed");
  }
  return result.result.value;
}

await send("Page.enable");
await send("Runtime.enable");

/* ------------------------------------------------------- the audit probe */

/**
 * Runs in the page. Returns geometry facts, not opinions.
 *
 * An element is only reported as overflow if it lies OUTSIDE any intentional
 * horizontal scroller — `overflow-x: auto|scroll` on an ancestor means the
 * overflow is a deliberate carousel and is excluded, exactly as the acceptance
 * criteria allow.
 */
const PROBE = `(() => {
  const vw = document.documentElement.clientWidth;
  const doc = document.documentElement;

  const describe = (el) => {
    const cls = typeof el.className === 'string' ? el.className : '';
    return {
      tag: el.tagName.toLowerCase(),
      cls: cls.slice(0, 120),
      text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 60),
    };
  };

  const inScroller = (el) => {
    let p = el.parentElement;
    while (p && p !== doc) {
      const ox = getComputedStyle(p).overflowX;
      if (ox === 'auto' || ox === 'scroll') return p;
      p = p.parentElement;
    }
    return null;
  };

  const overflows = [];
  const clipped = [];
  const contentOverflow = [];
  const scrollers = new Set();

  for (const el of doc.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;

    const scroller = inScroller(el);
    if (scroller) {
      scrollers.add(scroller);
      continue;
    }
    // Extends past the right edge of the viewport.
    if (r.right > vw + 1) {
      overflows.push({ ...describe(el), right: Math.round(r.right), width: Math.round(r.width) });
    }

    // Content wider than its own box AND clipped rather than allowed to show.
    // .sr-only is excluded: it is a 1px box on purpose, so its overflowing
    // text is the technique, not a defect.
    if (
      (cs.overflowX === 'hidden' || cs.overflowX === 'clip') &&
      el.scrollWidth > el.clientWidth + 1 &&
      el.clientWidth > 0 &&
      !el.classList.contains('sr-only')
    ) {
      clipped.push({
        ...describe(el),
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
      });
    }

    // Content wider than its own box, whether or not it is clipped.
    //
    // This is the check that catches text spilling OUT of a grid track and
    // colliding with its neighbour — a case where nothing is clipped and
    // nothing passes the viewport edge, so the first two checks both stayed
    // silent while two stat labels visually overlapped.
    //
    // A CSS transform inflates scrollWidth without moving anything in layout:
    // a "+" glyph rotated 45 degrees reports a box about 40% wider than the box
    // it occupies. So anything this check flags is re-measured with transforms
    // neutralised, and only reported if it still overflows. Without that step
    // the signal is drowned by decorative rotations.
    if (
      el.scrollWidth > el.clientWidth + 1 &&
      el.clientWidth > 0 &&
      cs.overflowX !== 'auto' &&
      cs.overflowX !== 'scroll' &&
      !el.classList.contains('sr-only')
    ) {
      const restores = [];
      const neutralize = (node) => {
        // Disabling the transition matters as much as disabling the transform.
        // A rotating glyph usually also carries transition-transform, and
        // without this scrollWidth is read mid-animation and still reports the
        // old inflated box — which is how an earlier version of this check
        // managed to "prove" a real 4px overhang was harmless.
        restores.push([node, node.style.transform, node.style.transition]);
        node.style.transform = 'none';
        node.style.transition = 'none';
      };
      if (cs.transform !== 'none') neutralize(el);
      for (const d of el.querySelectorAll('*')) {
        if (getComputedStyle(d).transform !== 'none') neutralize(d);
      }
      const layoutScroll = el.scrollWidth;
      for (const [node, transform, transition] of restores) {
        node.style.transform = transform;
        node.style.transition = transition;
      }

      if (layoutScroll > el.clientWidth + 1) {
        contentOverflow.push({
          ...describe(el),
          scrollWidth: layoutScroll,
          clientWidth: el.clientWidth,
        });
      }
    }
  }

  // Grid column counts for the sections the brief calls out.
  const gridInfo = {};
  const gridFor = (label, sel) => {
    const el = sel && document.querySelector(sel);
    if (!el) return;
    const cs = getComputedStyle(el);
    gridInfo[label] = {
      display: cs.display,
      cols: cs.gridTemplateColumns.split(' ').filter(Boolean).length,
    };
  };
  gridFor('heroGrid', 'main section:first-of-type .grid');
  gridFor('trustBar', 'main section:nth-of-type(2) ul.grid');
  gridFor('experienceGrid', 'main .grid');
  gridFor('revenueTop', 'main .lg\\\\:grid-cols-2');
  gridFor('footer', 'footer .grid');

  return {
    vw,
    docScrollWidth: doc.scrollWidth,
    horizontalOverflow: doc.scrollWidth > vw + 1,
    bodyScrollWidth: document.body.scrollWidth,
    overflows: overflows.slice(0, 25),
    overflowCount: overflows.length,
    clipped: clipped.slice(0, 25),
    clippedCount: clipped.length,
    contentOverflow: contentOverflow.slice(0, 25),
    contentOverflowCount: contentOverflow.length,
    scrollerCount: scrollers.size,
    // Named so each one can be checked against "is this an intentional,
    // visually obvious horizontal scroller?" rather than assumed to be fine.
    scrollers: [...scrollers].map((el) => ({
      tag: el.tagName.toLowerCase(),
      cls: (typeof el.className === 'string' ? el.className : '').slice(0, 110),
      text: (el.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 50),
      scrollW: el.scrollWidth,
      clientW: el.clientWidth,
    })),
    gridInfo,
  };
})()`;

/* ------------------------------------------------------------------- run */

if (WANT_SHOTS && !existsSync(SHOT_DIR)) mkdirSync(SHOT_DIR, { recursive: true });

const findings = [];

for (const [name, route] of PAGES) {
  for (const width of WIDTHS) {
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: 800,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });

    await send("Page.navigate", { url: `http://127.0.0.1:${PORT}${route}` });
    // Wait for load + hydration. Poll rather than guess a fixed delay.
    for (let i = 0; i < 60; i++) {
      const ready = await evaluate(`document.readyState === 'complete'`);
      if (ready) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    await new Promise((r) => setTimeout(r, 350));

    const result = await evaluate(PROBE);
    findings.push({ page: name, route, width, ...result });

    if (WANT_SHOTS) {
      const shot = await send("Page.captureScreenshot", {
        format: "png",
        captureBeyondViewport: true,
      });
      writeFileSync(
        path.join(SHOT_DIR, `${name}-${width}.png`),
        Buffer.from(shot.data, "base64"),
      );
    }
  }
}

ws.close();
chrome.kill();

/* ---------------------------------------------------------------- report */

let failures = 0;
console.log("\nMobile layout audit");
console.log("═".repeat(78));

for (const [name, route] of PAGES) {
  console.log(`\n${name}  (${route})`);
  for (const width of WIDTHS) {
    const f = findings.find((x) => x.page === name && x.width === width);
    const bad =
      f.horizontalOverflow ||
      f.overflowCount > 0 ||
      f.clippedCount > 0 ||
      f.contentOverflowCount > 0;
    if (bad) failures++;
    const flag = bad ? "FAIL" : " ok ";
    console.log(
      `  [${flag}] ${String(width).padStart(4)}px  doc=${String(f.docScrollWidth).padStart(4)}  ` +
        `overflow=${String(f.overflowCount).padStart(2)}  clipped=${String(f.clippedCount).padStart(2)}  ` +
        `contentOver=${String(f.contentOverflowCount).padStart(2)}  scrollers=${f.scrollerCount}`,
    );
    for (const o of f.overflows.slice(0, 4)) {
      console.log(`           ↳ overflow <${o.tag} class="${o.cls}"> right=${o.right} w=${o.width} "${o.text}"`);
    }
    for (const c of f.clipped.slice(0, 4)) {
      console.log(
        `           ↳ clipped  <${c.tag} class="${c.cls}"> scrollW=${c.scrollWidth} clientW=${c.clientWidth} "${c.text}"`,
      );
    }
    for (const c of f.contentOverflow.slice(0, 5)) {
      console.log(
        `           ↳ content  <${c.tag} class="${c.cls}"> scrollW=${c.scrollWidth} clientW=${c.clientWidth} "${c.text}"`,
      );
    }
  }
}

console.log("\n" + "═".repeat(78));
console.log(`${failures} page/width combination(s) with overflow or clipping.`);
if (WANT_SHOTS) console.log(`Screenshots written to ${SHOT_DIR}`);

writeFileSync(
  path.join(process.cwd(), ".mobile-audit-results.json"),
  JSON.stringify(findings, null, 2),
);
console.log("Raw geometry written to .mobile-audit-results.json\n");
process.exit(failures > 0 ? 1 : 0);
