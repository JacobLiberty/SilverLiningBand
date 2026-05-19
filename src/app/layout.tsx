import type { Metadata } from "next";
import { Bodoni_Moda, Josefin_Sans } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

import { client, isSanityConfigured } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

const josefin = Josefin_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://silverliningband.ca"),
  title: {
    default: "Silver Lining Band | Live Music for Events in Ottawa",
    template: "%s | Silver Lining Band",
  },
  description:
    "Ottawa's classic rock cover band — Fleetwood Mac, Eagles, Beatles & more. Available for weddings, corporate events, private parties, and venues across the Ottawa-Gatineau area.",
  keywords: [
    "Ottawa live band",
    "Ottawa cover band",
    "Ottawa wedding band",
    "corporate event band Ottawa",
    "live music Ottawa",
    "classic rock cover band Ottawa",
    "Silver Lining Band",
    "Ottawa-Gatineau live music",
    "hire a band Ottawa",
    "event entertainment Ottawa",
  ],
  authors: [{ name: "Silver Lining Band" }],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://silverliningband.ca",
    siteName: "Silver Lining Band",
    title: "Silver Lining Band | Live Music for Events in Ottawa",
    description:
      "Ottawa's classic rock cover band — Fleetwood Mac, Eagles, Beatles & more. Available for weddings, corporate events, private parties, and venues.",
    images: [
      {
        url: "/images/band/silverliningband.jpg",
        width: 1200,
        height: 630,
        alt: "Silver Lining Band performing live",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Silver Lining Band | Live Music for Events in Ottawa",
    description:
      "Ottawa's classic rock cover band — Fleetwood Mac, Eagles, Beatles & more. Book us for your next event.",
    images: ["/images/band/silverliningband.jpg"],
  },
  alternates: {
    canonical: "https://silverliningband.ca",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = isSanityConfigured
    ? await client.fetch(siteSettingsQuery).catch(() => null)
    : null;

  return (
    <html lang="en" className={`${bodoni.variable} ${josefin.variable}`}>
      <body className="grain">
        <Navbar />
        <main>{children}</main>
        <Footer socialLinks={settings?.socialLinks} />
      </body>
    </html>
  );
}
