/**
 * Minimal resolver hook so this repo's TypeScript can run under plain `node`
 * without a bundler.
 *
 * Two things Next.js/webpack resolves for us at build time do not work in
 * Node's ESM resolver:
 *   1. extensionless relative imports  -> "./voice"      needs "./voice.ts"
 *   2. the "@/" path alias             -> "@/lib/..."    needs "<root>/lib/..."
 *
 * Usage:
 *   node --import ./scripts/ts-alias-loader.mjs scripts/lint-destinations.ts
 */
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve as resolvePath } from "node:path";

const projectRoot = resolvePath(dirname(fileURLToPath(import.meta.url)), "..");
const EXTENSIONS = [".ts", ".tsx", ".mts", ".js", ".mjs", ".cjs", ".json"];
const HAS_EXTENSION = /\.[cm]?[jt]sx?$|\.[cm]?js$|\.json$/;

/** "@/" and "@/*" -> project root. */
const ALIAS_PREFIX = "@/";

registerHooks({
  resolve(specifier, context, nextResolve) {
    // 1. Path alias.
    if (specifier === "@" || specifier.startsWith(ALIAS_PREFIX)) {
      const target = resolvePath(
        projectRoot,
        specifier === "@" ? "." : specifier.slice(ALIAS_PREFIX.length),
      );
      const resolved = resolveWithExtensions(target);
      if (resolved) {
        return nextResolve(pathToFileURL(resolved).href, context);
      }
    }

    // 2. Extensionless relative imports.
    if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      !HAS_EXTENSION.test(specifier) &&
      context.parentURL
    ) {
      const target = fileURLToPath(new URL(specifier, context.parentURL));
      const resolved = resolveWithExtensions(target);
      if (resolved) {
        return nextResolve(pathToFileURL(resolved).href, context);
      }
    }

    return nextResolve(specifier, context);
  },
});

function resolveWithExtensions(target) {
  if (existsSync(target)) {
    for (const extension of EXTENSIONS) {
      if (target.endsWith(extension)) return target;
    }
  }
  for (const extension of EXTENSIONS) {
    const candidate = `${target}${extension}`;
    if (existsSync(candidate)) return candidate;
  }
  for (const extension of EXTENSIONS) {
    const candidate = resolvePath(target, `index${extension}`);
    if (existsSync(candidate)) return candidate;
  }
  return null;
}
