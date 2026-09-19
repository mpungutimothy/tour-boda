/**
 * Static export build.
 *
 * Usage:
 *   node scripts/build-static.mjs      (or: npm run build:static)
 *
 * Sets NEXT_OUTPUT=export for the child process and runs `next build`, which
 * emits a plain static site into `out/`. This exists instead of an inline
 * `NEXT_OUTPUT=export next build` because that syntax does not work in
 * cmd.exe, and installing cross-env just for one variable is not worth a
 * dependency.
 *
 * stdio is inherited rather than piped: piped stdio is blocked in some sandbox
 * configurations, and Next's build output should stream to the terminal anyway.
 */
import { spawnSync } from "node:child_process";

const result = spawnSync("next", ["build"], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_OUTPUT: "export" },
});

if (result.error) {
  console.error(`Failed to start the build: ${result.error.message}`);
  process.exit(1);
}

process.exit(result.status ?? 1);
