import { client } from "@/lib/sanity/client";
import {
  siteSettingsQuery,
  upcomingShowsPreviewQuery,
  galleryImagesQuery,
} from "@/lib/sanity/queries";
import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { UpcomingShows } from "@/components/home/upcoming-shows";
import { Music } from "@/components/home/music";
import { Gallery } from "@/components/home/gallery";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, shows, gallery] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(upcomingShowsPreviewQuery),
    client.fetch(galleryImagesQuery),
  ]);

  return (
    <>
      <Hero
        bandName={settings?.bandName || "The Real Silver Lining Band"}
        tagline={settings?.tagline || "Classic rock from the golden era"}
        heroImage={settings?.heroImage}
      />
      <About bio={settings?.bio} />
      <UpcomingShows shows={shows || []} />
      <Music featuredVideoUrl={settings?.featuredVideoUrl} />
      <Gallery images={gallery || []} />
    </>
  );
}
