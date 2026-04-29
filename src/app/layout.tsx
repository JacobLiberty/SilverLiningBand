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
  title: "Silver Lining Band",
  description:
    "Classic rock covers from the golden era — Fleetwood Mac, Eagles, Beatles & more. Book us for your next event.",
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
