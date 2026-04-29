import { client, isSanityConfigured } from "@/lib/sanity/client";
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
  const [settings, shows, gallery] = isSanityConfigured
    ? await Promise.all([
        client.fetch(siteSettingsQuery).catch(() => null),
        client.fetch(upcomingShowsPreviewQuery).catch(() => []),
        client.fetch(galleryImagesQuery).catch(() => []),
      ])
    : [null, [], []];

  return (
    <>
      <Hero
        bandName={settings?.bandName || "Silver Lining Band"}
        tagline={settings?.tagline || "Classic rock covers from the golden era — Fleetwood Mac, Eagles, Beatles & more"}
        heroImage={settings?.heroImage}
      />
      <About bio={settings?.bio} />
      <UpcomingShows shows={shows || []} />
      <Music featuredVideoUrl={settings?.featuredVideoUrl} />
      <Gallery images={gallery || []} />
    </>
  );
}
