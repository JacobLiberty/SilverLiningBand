import { client, isSanityConfigured } from "@/lib/sanity/client";
import {
  siteSettingsQuery,
  upcomingShowsPreviewQuery,
  galleryImagesQuery,
  videosQuery,
} from "@/lib/sanity/queries";
import { SEED_UPCOMING_SHOWS } from "@/lib/seed-shows";
import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { UpcomingShows } from "@/components/home/upcoming-shows";
import { Music } from "@/components/home/music";
import { Gallery } from "@/components/home/gallery";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, shows, gallery, videos] = isSanityConfigured
    ? await Promise.all([
        client.fetch(siteSettingsQuery).catch(() => null),
        client.fetch(upcomingShowsPreviewQuery).catch(() => []),
        client.fetch(galleryImagesQuery).catch(() => []),
        client.fetch(videosQuery).catch(() => []),
      ])
    : [null, SEED_UPCOMING_SHOWS.slice(0, 3), [], []];

  return (
    <>
      <Hero
        bandName={settings?.bandName || "Silver Lining Band"}
        tagline={settings?.tagline || "Classic rock covers from the golden era — Fleetwood Mac, Eagles, Beatles & more"}
        heroVideoUrl={settings?.heroVideoUrl}
      />
      <About
        bio={settings?.bio}
        aboutQuote={settings?.aboutQuote}
        aboutImageUrl={settings?.aboutImage?.asset?.url}
      />
      <UpcomingShows shows={shows || []} />
      <Music videos={videos || []} />
      <Gallery images={gallery || []} />
    </>
  );
}
