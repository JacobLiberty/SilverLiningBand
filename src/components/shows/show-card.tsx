"use client";

import { motion } from "framer-motion";

interface ShowCardProps {
  title: string;
  date: string;
  venue: string;
  city: string;
  ticketUrl?: string;
  description?: string;
}

export function ShowCard({
  title,
  date,
  venue,
  city,
  ticketUrl,
  description,
}: ShowCardProps) {
  const dateObj = new Date(date);
  const month = dateObj.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
  const day = dateObj.getDate();
  const weekday = dateObj.toLocaleDateString("en-US", { weekday: "long" });
  const year = dateObj.getFullYear();
  const time = dateObj.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <motion.div
      className="group relative flex overflow-hidden rounded-lg border border-border-cool bg-charcoal/80 transition-all duration-300 hover:border-amber/30 hover:shadow-[0_0_30px_rgba(193,149,82,0.08)]"
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      {/* Amber left accent border */}
      <div className="w-1 shrink-0 bg-gradient-to-b from-amber via-amber-light to-amber-glow" />

      <div className="flex flex-1 items-center gap-5 px-5 py-5 sm:gap-6 sm:px-6">
        {/* Editorial date block */}
        <div className="flex shrink-0 flex-col items-center text-center">
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-amber">
            {month}
          </span>
          <span className="font-display text-3xl font-light leading-none text-cream sm:text-4xl">
            {day}
          </span>
          <span className="mt-0.5 font-body text-[10px] text-silver-dim">
            {year}
          </span>
        </div>

        {/* Subtle vertical separator */}
        <div className="h-10 w-px bg-border-cool" />

        {/* Event details */}
        <div className="min-w-0 flex-1">
          <p className="font-display text-lg leading-snug text-cream sm:text-xl">
            {title}
          </p>
          <p className="mt-1 font-body text-sm text-silver">
            {venue}
            <span className="mx-2 text-amber/40">&middot;</span>
            {city}
          </p>
          <p className="mt-0.5 font-body text-xs text-cream-dim">
            {weekday} at {time}
          </p>
          {description && (
            <p className="mt-2 font-body text-xs leading-relaxed text-silver-dim">
              {description}
            </p>
          )}
        </div>

        {/* Ticket CTA */}
        {ticketUrl && (
          <a
            href={ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded border border-amber/30 bg-amber/[0.08] px-4 py-2 font-body text-xs font-medium uppercase tracking-[0.15em] text-amber transition-all duration-200 hover:border-amber/50 hover:bg-amber/[0.15] hover:text-amber-light"
          >
            Tickets
          </a>
        )}
      </div>
    </motion.div>
  );
}
