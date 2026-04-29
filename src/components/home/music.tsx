"use client";

import { motion } from "framer-motion";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

export function Music() {
  return (
    <section id="music" className="relative bg-midnight px-6 py-28 md:py-36 overflow-hidden">
      {/* Cinematic ambient glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-amber/3 blur-[180px]" />

      <div className="relative mx-auto max-w-4xl">
        {/* Section header — staggered */}
        <StaggerReveal className="text-center" stagger={0.1}>
          <StaggerReveal.Item>
            <p className="font-body text-xs font-medium uppercase tracking-[0.35em] text-amber">
              Listen
            </p>
          </StaggerReveal.Item>

          <StaggerReveal.Item>
            <h2 className="mt-3 font-display text-4xl italic text-cream md:text-5xl">
              Hear Us <span className="text-gradient-amber">Play</span>
            </h2>
          </StaggerReveal.Item>

          <StaggerReveal.Item>
            <div className="divider-ornament mx-auto mt-5 mb-12 max-w-xs text-amber/40">
              <span className="text-amber text-sm">&#9835;</span>
            </div>
          </StaggerReveal.Item>
        </StaggerReveal>

        {/* Video container — cinematic frame */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        >
          <div className="relative overflow-hidden rounded-lg glow-amber">
            {/* Gradient border effect */}
            <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-amber/30 via-transparent to-amber-glow/20" />
            <div className="relative m-px overflow-hidden rounded-lg bg-charcoal flex items-center justify-center">
              <video
                controls
                poster="/images/band/gallery-band-remic.jpg"
                className="max-h-[70vh] w-full rounded-lg object-contain"
              >
                <source src="/video/cant-let-go.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
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
