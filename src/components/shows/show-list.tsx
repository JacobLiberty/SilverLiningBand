"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShowCard } from "./show-card";

interface Show {
  _id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  ticketUrl?: string;
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
      <div className="flex flex-col gap-3">
        {upcoming.length === 0 && (
          <p className="text-center text-muted py-8">
            No upcoming shows scheduled — check back soon!
          </p>
        )}
        {upcoming.map((show, i) => (
          <motion.div
            key={show._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <ShowCard {...show} />
          </motion.div>
        ))}
      </div>

      {past.length > 0 && (
        <div className="mt-12">
          <button
            onClick={() => setShowPast(!showPast)}
            className="w-full text-center text-sm text-muted transition-colors hover:text-silver"
          >
            {showPast ? "Hide" : "Show"} Past Shows ({past.length})
          </button>

          {showPast && (
            <motion.div
              className="mt-4 flex flex-col gap-3 opacity-60"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 0.6, height: "auto" }}
            >
              {past.map((show) => (
                <ShowCard key={show._id} {...show} />
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
