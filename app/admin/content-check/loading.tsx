import { RouteLoading } from "@/components/layout/route-loading";

/**
 * Route loading UI for this segment.
 *
 * Next renders this into <main> during a client-side navigation to the route,
 * so the header and footer — which live in the root layout, outside this
 * Suspense boundary — stay mounted and usable. See
 * components/layout/route-loading.tsx for the shared placeholders.
 *
 * Editorial content check.
 */
export default function Loading() {
  return <RouteLoading variant="prose" />;
}