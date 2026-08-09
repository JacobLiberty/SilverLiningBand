"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { SITE_TIME_ZONE, buildGoogleCalendarUrl, buildGoogleMapsUrl } from "@/lib/calendar";

interface ShowCardProps {
  slug: string;
  title: string;
  date: string;
  venue: string;
  address: string;
  city: string;
  image?: string;
  imageUrl?: string;
  description?: string;
}

export function ShowCard({
  slug,
  title,
  date,
  venue,
  address,
  city,
  image,
  imageUrl,
  description,
}: ShowCardProps) {
  const showImage = imageUrl || image;
  const dateObj = new Date(date);
  const month = dateObj
    .toLocaleDateString("en-US", { month: "short", timeZone: SITE_TIME_ZONE })
    .toUpperCase();
  const day = dateObj.toLocaleDateString("en-US", { day: "numeric", timeZone: SITE_TIME_ZONE });
  const weekday = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    timeZone: SITE_TIME_ZONE,
  });
  const year = dateObj.toLocaleDateString("en-US", { year: "numeric", timeZone: SITE_TIME_ZONE });
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: SITE_TIME_ZONE,
  });

  const mapsUrl = buildGoogleMapsUrl(address);
  const calendarUrl = buildGoogleCalendarUrl({
    title,
    date,
    venue,
    address,
    description,
  });
  const detailsHref = `/shows/${slug}`;

  return (
    <motion.div
      className="group relative flex overflow-hidden rounded-lg border border-border-cool bg-charcoal/80 transition-all duration-300 hover:border-amber/30 hover:shadow-[0_0_30px_rgba(193,149,82,0.08)]"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Venue image — links to show details */}
      {showImage && (
        <Link
          href={detailsHref}
          className="relative hidden w-32 shrink-0 sm:block lg:w-40"
        >
          <Image
            src={showImage}
            alt={venue}
            fill
            className="object-cover"
            sizes="160px"
          />
          <div className="absolute inset-0 bg-linear-to-r from-transparent to-charcoal/60" />
        </Link>
      )}

      {/* Amber left accent (shown when no image, or on mobile) */}
      {!showImage && (
        <div className="w-1 shrink-0 bg-gradient-to-b from-amber via-amber-light to-amber-glow" />
      )}

      <div className="flex flex-1 flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
        {/* Editorial date block — links to show details */}
        <Link
          href={detailsHref}
          className="flex shrink-0 flex-col items-center text-center transition-colors hover:text-amber sm:min-w-[60px]"
        >
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
            {month}
          </span>
          <span className="font-display text-3xl font-light leading-none text-cream sm:text-4xl">
            {day}
          </span>
          <span className="mt-0.5 font-body text-[10px] text-silver-dim">
            {year}
          </span>
        </Link>

        {/* Vertical separator (desktop) */}
        <div className="hidden h-12 w-px bg-border-cool sm:block" />

        {/* Event details */}
        <div className="min-w-0 flex-1">
          <Link
            href={detailsHref}
            className="font-display text-lg leading-snug text-cream transition-colors hover:text-amber sm:text-xl"
          >
            {title}
          </Link>
          <p className="mt-1 font-body text-sm text-silver">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-amber"
            >
              {venue}
            </a>
            <span className="mx-2 text-amber/40">&middot;</span>
            {city}
          </p>
          <p className="mt-0.5 font-body text-xs text-cream-dim">
            {weekday} at {time}
          </p>
          {/* Address with map link */}
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex items-center gap-1.5 font-body text-xs text-silver-dim transition-colors hover:text-amber"
          >
            <svg
              className="h-3 w-3 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {address}
          </a>
          {description && (
            <p className="mt-2 line-clamp-2 font-body text-xs leading-relaxed text-silver-dim">
              {description}
            </p>
          )}
        </div>

        {/* Add to Calendar */}
        <a
          href={calendarUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-2 self-start rounded border border-amber/30 bg-amber/[0.08] px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.1em] text-amber transition-all duration-200 hover:border-amber/50 hover:bg-amber/[0.15] hover:text-amber-light sm:self-center"
        >
          <svg
            className="h-3.5 w-3.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
          Add to Calendar
        </a>
      </div>
    </motion.div>
  );
}
