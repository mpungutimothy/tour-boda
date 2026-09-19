import "./globals.css";
import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { imagePath } from "@/lib/photos";
import { absoluteUrl } from "@/lib/site";

/**
 * Two typefaces, two jobs.
 *
 * Fraunces for headlines — a variable serif with a real optical-size axis, so a
 * 60px hero and an 18px card title are cut differently rather than being the
 * same shapes scaled. Inter for everything else. The previous build also loaded
 * a geometric sans and used it for headings; with Fraunces in that role it was
 * dead weight on every page load, so it is gone.
 */

/** Reading voice — body and UI copy. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Display voice — headlines, set with optical sizing. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

/** Data voice — tabular figures for prices, counts and distances. */
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tour-boda.ug"),
  title: {
    default:
      "Tour-Boda Uganda — Your Tour. Your Boda Guide. Your Uganda Experience.",
    template: "%s | Tour-Boda Uganda",
  },
  description:
    "Tour-Boda Uganda connects travelers with local boda-boda guides for authentic, personalized tours across Uganda. Explore the Pearl of Africa with a guide who knows every road.",
  keywords: [
    "Uganda tours",
    "boda boda guide",
    "Uganda travel",
    "Kampala tours",
    "African safaris",
    "local guide Uganda",
  ],
  authors: [{ name: "Tour-Boda Uganda" }],
  openGraph: {
    title:
      "Tour-Boda Uganda — Your Tour. Your Boda Guide. Your Uganda Experience.",
    description:
      "Connect with local boda-boda guides for authentic, personalized tours across Uganda.",
    type: "website",
    locale: "en_UG",
    siteName: "Tour-Boda Uganda",
    // `twitter.card` below is declared `summary_large_image`, which renders as a
    // bare grey box when no image is supplied. The image has to be an ABSOLUTE
    // url: a social scraper fetches it with no page context, so `/images/…`
    // means nothing to it. This mirrors what the destination pages already do.
    images: [
      {
        url: absoluteUrl(imagePath("hero-home.jpg")),
        width: 1920,
        height: 1080,
        alt: "A boda-boda rider carrying a passenger along a Ugandan street",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tour-Boda Uganda",
    description:
      "Connect with local boda-boda guides for authentic, personalized tours across Uganda.",
    images: [absoluteUrl(imagePath("hero-home.jpg"))],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable}`}
    >
      {/*
        The body is light and the shell is dark. There is no `dark` class on
        <html> and no theme toggle: the alternation is structural — dark header
        and footer bookending a light editorial body — so it is expressed by
        scoping, not by a user-switchable mode.

        The old build laid a fixed precision grid and a coloured mesh across the
        entire viewport. On a light editorial page that reads as a dashboard
        underlay, so both are gone; texture now appears only where a section
        explicitly asks for it.
      */}
      <body className="bg-background font-sans antialiased">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1 bg-background">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
