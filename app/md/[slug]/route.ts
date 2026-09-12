import { destinations } from "@/data/destinations";
import { destinationToMarkdown } from "@/lib/markdown/destination";

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }));
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const slug = url.pathname.split("/").pop() ?? "";

  const destination = destinations.find((d) => d.slug === slug);

  if (!destination) {
    return new Response("Not found", { status: 404 });
  }

  const markdown = destinationToMarkdown(destination);

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
