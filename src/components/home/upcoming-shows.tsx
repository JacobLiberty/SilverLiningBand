"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { buildGoogleCalendarUrl, buildGoogleMapsUrl } from "@/lib/calendar";

interface Show {
  _id: string;
  title: string;
  date: string;
  venue: string;
  address: string;
  city: string;
  image?: string;
  imageUrl?: string;
  description?: string;
}

interface UpcomingShowsProps {
  shows: Show[];
}

function formatDay(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric" });
}

function formatMonthYear(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.1,
      ease: "easeOut" as const,
    },
  }),
};

export function UpcomingShows({ shows }: UpcomingShowsProps) {
  return (
    <section id="shows" className="relative bg-smoke px-6 py-28 md:py-36">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-amber/3 blur-[150px]" />

      <div className="relative mx-auto max-w-4xl">
        <motion.p
          className="text-center font-body text-xs font-medium uppercase tracking-[0.35em] text-amber"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Upcoming Shows
        </motion.p>

        <motion.h2
          className="mt-3 text-center font-display text-4xl italic text-cream md:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Catch Us <span className="text-gradient-amber">Live</span>
        </motion.h2>

        <motion.div
          className="divider-ornament mx-auto mt-5 mb-12 max-w-xs text-amber/40"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-amber text-sm">&#9834;</span>
        </motion.div>

        {/* Show cards */}
        <div className="flex flex-col gap-4">
          {shows.length === 0 && (
            <motion.div
              className="flex flex-col items-center gap-3 py-16"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-display text-2xl italic text-silver-dim">
                The stage is set&hellip;
              </p>
              <p className="text-sm text-cream-dim">
                No upcoming shows just yet. Check back soon for new dates.
              </p>
            </motion.div>
          )}

          {shows.map((show, i) => (
            <motion.div
              key={show._id}
              className="group relative flex items-stretch overflow-hidden rounded-sm border border-border-cool bg-charcoal transition-all duration-300 hover:border-border-warm hover:shadow-[0_4px_40px_rgba(193,149,82,0.08)] hover:-translate-y-0.5"
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {/* Left amber accent — ticket stub feel */}
              <div className="w-1.5 shrink-0 bg-gradient-to-b from-amber-light via-amber to-amber-glow" />

              <div className="flex flex-1 items-center justify-between gap-4 px-6 py-5">
                <div className="flex items-center gap-6">
                  {/* Large editorial date */}
                  <div className="hidden min-w-[60px] flex-col items-center sm:flex">
                    <span className="font-display text-3xl leading-none text-amber">
                      {formatDay(show.date)}
                    </span>
                    <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cream-dim">
                      {formatMonthYear(show.date)}
                    </span>
                  </div>

                  {/* Divider line (desktop) */}
                  <div className="hidden h-12 w-px bg-border-warm sm:block" />

                  {/* Show details */}
                  <div>
                    <p className="text-sm font-medium uppercase tracking-wide text-cream sm:hidden">
                      {new Date(show.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="mt-0.5 text-lg text-silver-light sm:mt-0">
                      {show.title}
                    </p>
                    <p className="mt-1 text-sm text-cream-dim">
                      <a
                        href={buildGoogleMapsUrl(show.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-amber transition-colors"
                      >
                        {show.venue}
                      </a>
                      , {show.city} &middot; {formatTime(show.date)}
                    </p>
                  </div>
                </div>

                {/* Add to Calendar */}
                <a
                  href={buildGoogleCalendarUrl(show)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden shrink-0 items-center gap-1.5 rounded-sm border border-amber/30 bg-amber/5 px-4 py-2 text-xs font-medium tracking-wide text-amber transition-all duration-200 hover:border-amber hover:bg-amber/10 hover:text-amber-light sm:flex"
                >
                  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                  </svg>
                  Add
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See All Shows link with ornamental divider */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="divider-ornament text-amber/30">
            <Link
              href="/shows"
              className="whitespace-nowrap text-sm font-medium tracking-wide text-amber transition-colors hover:text-amber-light"
            >
              See All Shows &rarr;
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
