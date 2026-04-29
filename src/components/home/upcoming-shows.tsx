"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Show {
  _id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  ticketUrl?: string;
}

interface UpcomingShowsProps {
  shows: Show[];
}

export function UpcomingShows({ shows }: UpcomingShowsProps) {
  return (
    <section id="shows" className="bg-surface-raised px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-silver">
          Upcoming
        </p>
        <h2 className="mt-2 text-center text-3xl font-light">Catch Us Live</h2>

        <div className="mt-10 flex flex-col gap-3">
          {shows.length === 0 && (
            <p className="text-center text-muted">No upcoming shows — check back soon!</p>
          )}
          {shows.map((show, i) => (
            <motion.div
              key={show._id}
              className="flex items-center justify-between rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.03)] px-5 py-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div>
                <p className="text-xs font-semibold uppercase text-silver">
                  {new Date(show.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-1 text-silver-light">{show.title}</p>
                <p className="text-sm text-muted">
                  {show.venue}, {show.city} &middot;{" "}
                  {new Date(show.date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {show.ticketUrl && (
                <a
                  href={show.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-border-accent px-4 py-2 text-sm text-silver transition-colors hover:bg-surface-overlay"
                >
                  Details
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/shows"
            className="text-sm text-silver transition-colors hover:text-silver-light"
          >
            See All Shows &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
