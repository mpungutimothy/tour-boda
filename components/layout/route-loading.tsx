import { cn } from "@/lib/utils";

/**
 * Route loading UI.
 *
 * These are the Suspense fallbacks Next renders into `<main>` when the App
 * Router navigates to a segment that has a `loading.tsx`. Three rules shape all
 * of it:
 *
 *   1. The page CHROME IS NEVER COVERED. The header and the footer live in
 *      `app/layout.tsx`, so they are outside the Suspense boundary and stay
 *      mounted, visible and interactive the whole time. There is deliberately
 *      no full-page overlay or blocking spinner — a spinner that hides the
 *      navigation turns a fast page into a slow-looking one.
 *   2. The progress bar sits ABOVE the header (z-70 versus z-50) so it reads as
 *      the browser reporting a navigation, not as part of the page.
 *   3. Every placeholder MATCHES THE REAL BOX, aspect ratio included, so the
 *      content does not jump when it arrives.
 *
 * The top band of each variant mirrors the band the real page starts with —
 * cream for the sub-pages, photographic-dark for the home hero. Without that,
 * a cream skeleton would flash ahead of a dark hero and read as a glitch.
 */

/** The indeterminate sweep, pinned to the top of the viewport. */
export function RouteProgress() {
  return (
    <>
      <div className="route-progress" aria-hidden />
      <span role="status" className="sr-only">
        Loading page
      </span>
    </>
  );
}

/** A single shimmering line of placeholder text. */
function Line({ className }: { className?: string }) {
  return <span className={cn("skeleton block rounded", className)} />;
}

/** Stand-in for the cream `PageHeader` band every sub-page opens with. */
function PageHeaderSkeleton() {
  return (
    <div className="band-cream border-b border-hairline">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Line className="h-3 w-28" />
        <Line className="mt-5 h-9 w-full max-w-xl" />
        <Line className="mt-3 h-9 w-2/3 max-w-md" />
        <Line className="mt-6 h-4 w-full max-w-2xl" />
        <Line className="mt-2.5 h-4 w-4/5 max-w-xl" />
      </div>
    </div>
  );
}

/** Matches the aspect ratio and padding of a real destination card. */
function DestinationCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-b-lg border border-hairline bg-card">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="flex flex-1 flex-col p-5">
        <Line className="h-3 w-24" />
        <Line className="mt-3.5 h-6 w-3/4" />
        <Line className="mt-4 h-3.5 w-full" />
        <Line className="mt-2.5 h-3.5 w-5/6" />
        <div className="mt-6 flex items-center justify-between gap-3">
          <Line className="h-8 w-28" />
          <Line className="h-4 w-16" />
        </div>
      </div>
    </div>
  );
}

/** Matches a guide card, including the circular identity mark. */
function GuideCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-b-lg border border-hairline bg-card">
      <div className="skeleton aspect-[16/10] w-full" />
      <div className="flex flex-1 flex-col p-5 pt-12">
        <Line className="h-6 w-2/3" />
        <Line className="mt-3.5 h-3.5 w-full" />
        <Line className="mt-2.5 h-3.5 w-4/5" />
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Line className="h-10 w-full" />
          <Line className="h-10 w-full" />
          <Line className="h-10 w-full" />
        </div>
        <Line className="mt-6 h-10 w-full" />
      </div>
    </div>
  );
}

/** Generic paragraph stack, for the text-led pages. */
function ProseSkeleton() {
  return (
    <div className="space-y-4">
      {/* Last line of each group is short, the way real prose is — a stack of
          equal-width bars reads as a grey rectangle, not as text. */}
      <Line className="h-4 w-full" />
      <Line className="h-4 w-[96%]" />
      <Line className="h-4 w-[98%]" />
      <Line className="h-4 w-[72%]" />
      <div className="pt-5">
        <Line className="h-6 w-1/3" />
      </div>
      <Line className="h-4 w-[96%]" />
      <Line className="h-4 w-[88%]" />
      <Line className="h-4 w-[60%]" />
    </div>
  );
}

/** Dark photographic hero stand-in, for the home page. */
function HeroSkeleton() {
  return (
    <div className="theme-shell relative border-b border-hairline bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.02fr] lg:gap-14">
          <div>
            <Line className="h-3 w-56" />
            <Line className="mt-5 h-12 w-full" />
            <Line className="mt-3 h-12 w-5/6" />
            <Line className="mt-6 h-5 w-full max-w-md" />
            <div className="mt-9 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-hairline pt-7 sm:grid-cols-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index}>
                  <Line className="h-3 w-20" />
                  <Line className="mt-2.5 h-7 w-14" />
                </div>
              ))}
            </div>
          </div>
          <div className="theme-body h-72 rounded-lg border border-hairline bg-card shadow-xl lg:translate-y-10" />
        </div>
      </div>
    </div>
  );
}

export type RouteLoadingVariant =
  | "home"
  | "grid"
  | "guides"
  | "prose"
  | "detail";

/**
 * The standard fallback. `variant` chooses the placeholder that matches the page
 * being navigated to.
 */
export function RouteLoading({
  variant = "grid",
  className,
}: {
  variant?: RouteLoadingVariant;
  className?: string;
}) {
  if (variant === "home") {
    return (
      <>
        <RouteProgress />
        <HeroSkeleton />
        <section className="border-b border-hairline bg-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <DestinationCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <RouteProgress />
      <PageHeaderSkeleton />

      <div
        className={cn(
          "mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8",
          className,
        )}
      >
        {variant === "prose" ? (
          <div className="max-w-3xl">
            <ProseSkeleton />
          </div>
        ) : variant === "detail" ? (
          <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
            <ProseSkeleton />
            <div className="space-y-4">
              <Line className="h-40 w-full rounded-lg" />
              <Line className="h-11 w-full rounded-md" />
              <Line className="h-11 w-full rounded-md" />
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[0, 1, 2, 3, 4, 5].map((index) =>
              variant === "guides" ? (
                <GuideCardSkeleton key={index} />
              ) : (
                <DestinationCardSkeleton key={index} />
              ),
            )}
          </div>
        )}
      </div>
    </>
  );
}
