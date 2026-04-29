"use client";

import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

interface AboutProps {
  bio?: PortableTextBlock[];
}

export function About({ bio }: AboutProps) {
  return (
    <section id="about" className="bg-surface px-6 py-24">
      <motion.div
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-silver">
          About
        </p>
        <h2 className="mt-2 text-center text-3xl font-light">
          The Silver Lining Story
        </h2>

        <div className="mt-8 text-muted leading-relaxed [&_p]:mb-4">
          {bio ? (
            <PortableText value={bio} />
          ) : (
            <p>
              We&apos;re a classic rock cover band bringing the golden era back
              to life — Fleetwood Mac, Eagles, Beatles, and more. Every show is
              a celebration of the music that defined a generation.
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
