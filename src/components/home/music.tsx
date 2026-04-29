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
    <section id="music" className="bg-surface px-6 py-24">
      <motion.div
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-silver">
          Listen
        </p>
        <h2 className="mt-2 text-center text-3xl font-light">Hear Us Play</h2>

        <div className="mt-10 overflow-hidden rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.03)]">
          {embedUrl ? (
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                title="Featured performance"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center text-muted">
              Video coming soon
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-muted">
          More performances on our socials &mdash; links in the footer
        </p>
      </motion.div>
    </section>
  );
}
