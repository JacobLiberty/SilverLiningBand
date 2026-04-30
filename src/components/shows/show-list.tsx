"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShowCard } from "./show-card";

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

interface ShowListProps {
  upcoming: Show[];
  past: Show[];
}

export function ShowList({ upcoming, past }: ShowListProps) {
  const [showPast, setShowPast] = useState(false);

  return (
    <div>
      {/* Upcoming shows */}
      <div className="flex flex-col gap-4">
        {upcoming.length === 0 && (
          <motion.div
            className="rounded-lg border border-border-cool bg-charcoal/50 px-8 py-14 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-display text-2xl italic text-cream/60">
              Intermission
            </p>
            <p className="mt-3 font-body text-sm text-cream-dim">
              No upcoming shows scheduled — check back soon for our next
              performance.
            </p>
          </motion.div>
        )}
        {upcoming.map((show, i) => (
          <motion.div
            key={show._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: i * 0.1,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <ShowCard {...show} />
          </motion.div>
        ))}
      </div>

      {/* Past shows toggle */}
      {past.length > 0 && (
        <div className="mt-16">
          {/* Divider with toggle */}
          <div className="flex items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border-cool" />
            <button
              onClick={() => setShowPast((prev) => !prev)}
              className="rounded-full border border-border-cool bg-smoke/60 px-5 py-1.5 font-body text-xs font-medium uppercase tracking-[0.2em] text-silver-dim transition-all duration-200 hover:border-amber/30 hover:text-amber"
            >
              {showPast ? "Hide" : "View"} Past Shows
              <span className="ml-1.5 text-amber/50">({past.length})</span>
            </button>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border-cool" />
          </div>

          <AnimatePresence>
            {showPast && (
              <motion.div
                className="mt-6 flex flex-col gap-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                {past.map((show, i) => (
                  <motion.div
                    key={show._id}
                    className="opacity-50 transition-opacity hover:opacity-75"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 0.5, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.06,
                    }}
                  >
                    <ShowCard {...show} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
