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

/**
 * Deployment subpath, e.g. `/tour-boda`.
 *
 * Empty by default, which is correct for Netlify and any custom domain served
 * from the root. It only needs a value when the site is hosted from a SUBPATH —
 * a GitHub Pages project site — where Next's own router has to know the prefix.
 *
 * `lib/photos.ts` reads the same variable through `asset()`, because Next
 * applies `basePath` to `/_next/*` and to `next/link` but NOT to a raw
 * `<img src="/images/…">`. Setting one variable keeps the router and the
 * photography in agreement; setting only basePath here would leave every card
 * image pointing at the domain root.
 */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Remote photography comes from Pexels and Wikimedia, already sized at the
  // edge. The optimiser adds nothing here and cannot run on a static host.
  images: { unoptimized: true },
  ...(basePath ? { basePath } : {}),
  ...(process.env.NEXT_OUTPUT === "export" ? { output: "export" } : {}),
};

module.exports = nextConfig;
