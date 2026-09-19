/**
 * Two build modes, one codebase.
 *
 * `next build`            → normal server build in `.next/`. This is what
 *                           Netlify's Next.js Runtime consumes, and what
 *                           `netlify.toml` already points at
 *                           (`publish = ".next"`).
 *
 * `npm run build:static`  → sets NEXT_OUTPUT=export, which emits a plain static
 *                           site in `out/`. That folder can be dropped onto any
 *                           host — including Netlify Drop — with no build step
 *                           and no runtime, because every route in this app is
 *                           static.
 *
 * Static export is opt-in rather than permanent so that adding a route handler
 * or server-side data later cannot silently break an existing deploy.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Remote photography comes from Pexels and Wikimedia, already sized at the
  // edge. The optimiser adds nothing here and cannot run on a static host.
  images: { unoptimized: true },
  ...(process.env.NEXT_OUTPUT === "export" ? { output: "export" } : {}),
};

module.exports = nextConfig;
