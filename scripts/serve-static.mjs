/**
 * Minimal static file server for the exported site.
 *
 * Usage:
 *   node scripts/serve-static.mjs [port]        (or: npm run serve:static)
 *
 * Serves `out/` the way a static host would: directories resolve to
 * index.html, extensionless paths try `.html`, and unknown paths fall back to
 * 404.html. Dependency-free, so the exported build can be checked on a machine
 * with no network — which matters when the thing being checked is a deploy.
 */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const ROOT = resolve("out");
const PORT = Number(process.argv[2] ?? 4173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

if (!existsSync(ROOT)) {
  console.error(`No out/ directory. Run "npm run build:static" first.`);
  process.exit(1);
}

/** Resolve a URL path to a file inside ROOT, or null. */
function resolveFile(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  // normalize + prefix check keeps `../` from escaping the export directory.
  const safe = normalize(decoded).replace(/^(\.\.[/\\])+/, "");
  const target = join(ROOT, safe);

  const candidates = [target, `${target}.html`, join(target, "index.html")];
  for (const candidate of candidates) {
    if (!candidate.startsWith(ROOT)) continue;
    if (existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  }
  return null;
}

createServer((request, response) => {
  const file = resolveFile(request.url ?? "/");

  if (!file) {
    const notFound = join(ROOT, "404.html");
    response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    if (existsSync(notFound)) createReadStream(notFound).pipe(response);
    else response.end("404");
    return;
  }

  const type = TYPES[extname(file)] ?? "application/octet-stream";
  response.writeHead(200, { "Content-Type": type });
  createReadStream(file).pipe(response);
}).listen(PORT, "127.0.0.1", () => {
  console.log(`Serving out/ at http://127.0.0.1:${PORT}`);
});
