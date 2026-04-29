"use client";

import { motion } from "framer-motion";

interface MusicProps {
  featuredVideoUrl?: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function Music({ featuredVideoUrl }: MusicProps) {
  const embedUrl = featuredVideoUrl
    ? getYouTubeEmbedUrl(featuredVideoUrl)
    : null;

  return (
    <section id="music" className="relative bg-midnight px-6 py-28 md:py-36 overflow-hidden">
      {/* Cinematic ambient glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-amber/3 blur-[180px]" />

      <div className="relative mx-auto max-w-4xl">
        {/* Section header */}
        <motion.p
          className="text-center font-body text-xs font-medium uppercase tracking-[0.35em] text-amber"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Listen
        </motion.p>

        <motion.h2
          className="mt-3 text-center font-display text-4xl italic text-cream md:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Hear Us <span className="text-gradient-amber">Play</span>
        </motion.h2>

        <motion.div
          className="divider-ornament mx-auto mt-5 mb-12 max-w-xs text-amber/40"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-amber text-sm">&#9835;</span>
        </motion.div>

        {/* Video container — cinematic frame */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          {embedUrl ? (
            <div className="relative overflow-hidden rounded-lg glow-amber">
              {/* Gradient border effect */}
              <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-amber/30 via-transparent to-amber-glow/20" />
              <div className="relative m-px overflow-hidden rounded-lg bg-charcoal">
                <div className="aspect-video">
                  <iframe
                    src={embedUrl}
                    title="Featured performance"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Moody placeholder when no video */
            <div className="relative overflow-hidden rounded-lg border border-border-warm bg-charcoal">
              <div className="flex aspect-video flex-col items-center justify-center gap-4">
                {/* Decorative music notes */}
                <span className="text-5xl text-amber/20">&#9835;</span>
                <p className="font-display text-2xl italic text-silver-dim md:text-3xl">
                  Coming to your ears soon
                </p>
                <p className="text-sm text-cream-dim">
                  We&apos;re preparing something special
                </p>
              </div>
              {/* Ambient inner glow */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-amber/5 via-transparent to-transparent" />
            </div>
          )}
        </motion.div>

        {/* Footer text */}
        <motion.p
          className="mt-8 text-center text-sm text-cream-dim"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          More performances on our socials &mdash; links in the footer
        </motion.p>
      </div>
    </section>
  );
}
