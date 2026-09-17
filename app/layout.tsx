import "./globals.css";
import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

/** Reading voice — body copy. */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/** Display voice — geometric/technical, for headings. */
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space",
  display: "swap",
});

/** Human voice — the guide's own words, used with restraint. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

/** Data voice — every number that matters. */
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tour-boda.ug"),
  title: {
    default: "Tour-Boda Uganda — Your Tour. Your Boda Guide. Your Uganda Experience.",
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
    title: "Tour-Boda Uganda — Your Tour. Your Boda Guide. Your Uganda Experience.",
    description:
      "Connect with local boda-boda guides for authentic, personalized tours across Uganda.",
    type: "website",
    locale: "en_UG",
    siteName: "Tour-Boda Uganda",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tour-Boda Uganda",
    description:
      "Connect with local boda-boda guides for authentic, personalized tours across Uganda.",
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${fraunces.variable} ${jetbrains.variable}`}
    >
      <body className="font-sans antialiased">
        {/*
          Ambient backing: a precision grid plus a soft accent mesh. Fixed,
          decorative, behind all content, hidden from assistive tech.
        */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10 grid-plate opacity-40"
        />
        <div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[80vh] glow-mesh"
        />

        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
