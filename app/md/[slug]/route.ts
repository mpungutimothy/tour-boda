import { destinations } from "@/data/destinations";
import { destinationToMarkdown } from "@/lib/markdown/destination";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

/**
 * Clean markdown for a destination: no navigation, no footer, no boilerplate.
 * Served as text/markdown so crawlers can consume it directly.
 *
 * NOTE: the slug comes from route params, not from parsing `request.url`.
 * Splitting the pathname broke on a trailing slash (`/md/kampala-city-heritage/`
 * yielded an empty slug and a spurious 404).
 */
export function GET(
  _request: Request,
  { params }: { params: { slug: string } },
) {
  const destination = destinations.find((d) => d.slug === params.slug);

  if (!destination) {
    return new Response("Not found\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  return new Response(destinationToMarkdown(destination), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
