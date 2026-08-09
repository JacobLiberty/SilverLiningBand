import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client, isSanityConfigured } from "@/lib/sanity/client";
import { showBySlugQuery, showSlugsQuery } from "@/lib/sanity/queries";
import { EventsJsonLd } from "@/components/seo/json-ld";
import { SongSuggestionForm } from "@/components/shows/song-suggestion-form";
import { linkifyText } from "@/lib/linkify";
import { SITE_TIME_ZONE, buildGoogleCalendarUrl, buildGoogleMapsUrl } from "@/lib/calendar";

export const revalidate = 60;

interface Show {
  _id: string;
  title: string;
  date: string;
  venue: string;
  address: string;
  city: string;
  description?: string;
  setlist?: string[];
  slug: string;
  imageUrl?: string;
  isPast: boolean;
}

async function getShow(slug: string): Promise<Show | null> {
  if (!isSanityConfigured) return null;
  return client.fetch(showBySlugQuery, { slug }).catch(() => null);
}

export async function generateStaticParams() {
  if (!isSanityConfigured) return [];
  const slugs: string[] = await client
    .withConfig({ useCdn: false })
    .fetch(showSlugsQuery)
    .catch(() => []);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const show = await getShow(slug);
  if (!show) return {};

  const dateStr = new Date(show.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: SITE_TIME_ZONE,
  });

  return {
    title: `${show.title} — ${dateStr}`,
    description:
      show.description || `Silver Lining Band live at ${show.venue}, ${show.city} on ${dateStr}.`,
    alternates: {
      canonical: `https://silverliningband.ca/shows/${show.slug}`,
    },
  };
}

export default async function ShowDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const show = await getShow(slug);

  if (!show) notFound();

  const dateObj = new Date(show.date);
  const dateStr = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: SITE_TIME_ZONE,
  });
  const timeStr = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: SITE_TIME_ZONE,
  });
  const isPastShow = show.isPast;
  const mapsUrl = buildGoogleMapsUrl(show.address);
  const calendarUrl = buildGoogleCalendarUrl(show);

  return (
    <div className="relative min-h-screen bg-midnight px-6 pt-28 pb-20">
      <EventsJsonLd shows={[show]} />

      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-amber-glow/[0.04] blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <Link
          href="/shows"
          className="inline-flex items-center gap-1.5 font-body text-xs uppercase tracking-[0.2em] text-silver-dim transition-colors hover:text-amber"
        >
          &larr; All Shows
        </Link>

        {show.imageUrl && (
          <div className="relative mt-8 h-56 w-full overflow-hidden rounded-lg sm:h-72">
            <Image
              src={show.imageUrl}
              alt={show.venue}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 768px, 100vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-transparent to-transparent" />
          </div>
        )}

        {/* Editorial header */}
        <p className="mt-8 text-center font-body text-xs font-medium uppercase tracking-[0.35em] text-amber">
          {dateStr}
        </p>
        <h1 className="mt-4 text-center font-display text-4xl font-light italic tracking-tight text-cream sm:text-5xl">
          {show.title}
        </h1>
        <p className="mt-4 text-center font-body text-sm text-cream-dim">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-amber"
          >
            {show.venue}
          </a>
          , {show.city} &middot; {timeStr}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-border-cool px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.1em] text-silver transition-all duration-200 hover:border-amber/30 hover:text-amber"
          >
            Directions
          </a>
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded border border-amber/30 bg-amber/[0.08] px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.1em] text-amber transition-all duration-200 hover:border-amber/50 hover:bg-amber/[0.15] hover:text-amber-light"
          >
            Add to Calendar
          </a>
        </div>

        <div className="mx-auto mt-10 flex max-w-xs items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber/30" />
          <span className="text-amber/60" aria-hidden="true">
            &#9834;
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber/30" />
        </div>

        {show.description && (
          <p className="mx-auto mt-10 max-w-xl text-center font-body text-sm leading-relaxed text-silver">
            {linkifyText(show.description)}
          </p>
        )}

        {show.setlist && show.setlist.length > 0 && (
          <section className="mt-20">
            <p className="text-center font-body text-xs font-medium uppercase tracking-[0.35em] text-amber">
              Setlist
            </p>
            <h2 className="mt-3 text-center font-display text-3xl italic text-cream">
              {isPastShow ? "What We Played" : "What We're Playing"}
            </h2>
            <ol className="mx-auto mt-8 max-w-md space-y-2">
              {show.setlist.map((song, i) => (
                <li
                  key={i}
                  className="flex items-baseline gap-3 rounded-sm border border-border-cool bg-charcoal/60 px-4 py-2.5"
                >
                  <span className="font-body text-xs text-amber/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-body text-sm text-silver-light">{song}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        <section className="mt-20">
          <p className="text-center font-body text-xs font-medium uppercase tracking-[0.35em] text-amber">
            Got a Request?
          </p>
          <h2 className="mt-3 text-center font-display text-3xl italic text-cream">
            Suggest a Song
          </h2>
          <div className="mx-auto mt-8 max-w-lg">
            <SongSuggestionForm showId={show._id} showTitle={show.title} />
          </div>
        </section>
      </div>
    </div>
  );
}
