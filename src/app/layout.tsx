import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { client, isSanityConfigured } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "The Real Silver Lining Band",
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
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer socialLinks={settings?.socialLinks} />
      </body>
    </html>
  );
}
