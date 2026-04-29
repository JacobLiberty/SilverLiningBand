"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";

interface HeroProps {
  bandName: string;
  tagline: string;
  heroImage?: SanityImageSource;
}

const SLIDE_DURATION = 6000; // ms per slide

const slides = [
  { src: "/images/band/hero-group.jpg", alt: "Silver Lining Band" },
  { src: "/images/band/nancy-bw.jpg", alt: "Nancy performing" },
  { src: "/images/band/gallery-remic-group.jpg", alt: "Live at Remic Rapids" },
  { src: "/images/band/greg-bw.jpg", alt: "Greg on guitar" },
  { src: "/images/band/gallery-remic-night.jpg", alt: "Night performance" },
  { src: "/images/band/dom-bw.jpg", alt: "Dom on guitar" },
  { src: "/images/band/steve-bw.jpg", alt: "Steve at the mic" },
];

/** Ken Burns — alternate between zoom-in and zoom-out with subtle drift */
const kenBurnsVariants = [
  { scale: [1, 1.08], x: [0, -15], y: [0, -10] },
  { scale: [1.06, 1], x: [-10, 10], y: [-5, 5] },
  { scale: [1, 1.06], x: [0, 12], y: [0, -8] },
  { scale: [1.05, 1], x: [8, -8], y: [-8, 0] },
];

export function Hero({ bandName, tagline, heroImage }: HeroProps) {
  const [current, setCurrent] = useState(0);

  // Override first slide with Sanity hero image if available
  const allSlides = heroImage
    ? [
        { src: urlFor(heroImage).width(1920).quality(80).url(), alt: "Silver Lining Band" },
        ...slides.slice(1),
      ]
    : slides;

  const advance = useCallback(() => {
    setCurrent((prev) => (prev + 1) % allSlides.length);
  }, [allSlides.length]);

  useEffect(() => {
    const timer = setInterval(advance, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [advance]);

  const kenBurns = kenBurnsVariants[current % kenBurnsVariants.length];

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-midnight">
      {/* Background slideshow with crossfade + Ken Burns */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={current}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            scale: kenBurns.scale,
            x: kenBurns.x,
            y: kenBurns.y,
          }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.5, ease: "easeInOut" },
            scale: { duration: SLIDE_DURATION / 1000, ease: "linear" },
            x: { duration: SLIDE_DURATION / 1000, ease: "linear" },
            y: { duration: SLIDE_DURATION / 1000, ease: "linear" },
          }}
        >
          <Image
            src={allSlides[current].src}
            alt={allSlides[current].alt}
            fill
            className="object-cover"
            priority={current === 0}
            sizes="100vw"
          />
          {/* Warm tint */}
          <div className="absolute inset-0 bg-amber/[0.04] mix-blend-overlay" />
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-midnight/50 z-[5]" />
      <div className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/50 to-midnight/20 z-[5]" />
      <div className="absolute inset-0 bg-linear-to-r from-midnight/60 via-transparent to-transparent z-[5]" />

      {/* Warm ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-amber/[0.06] blur-[120px] rounded-full z-[5]" />
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-amber/[0.03] blur-[100px] rounded-full z-[5]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20 pt-40 lg:px-10 lg:pb-28">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <span className="inline-flex items-center gap-3 text-xs font-body font-normal tracking-[0.3em] uppercase text-amber">
              <span className="block w-8 h-[1px] bg-amber" />
              Live Classic Rock
            </span>
          </motion.div>

          {/* Band name */}
          <motion.h1
            className="font-display font-bold text-cream tracking-wide"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block text-5xl sm:text-7xl lg:text-8xl leading-none">
              Silver
            </span>
            <span className="block text-5xl sm:text-7xl lg:text-8xl italic text-gradient-amber leading-[1.15] pb-1">
              Lining
            </span>
            <span className="block text-2xl sm:text-3xl lg:text-4xl font-light tracking-[0.2em] text-silver mt-3">
              Band
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="mt-6 text-base sm:text-lg text-cream-dim font-body font-light max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {tagline}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link href="/book">
              <Button
                size="lg"
                className="bg-amber text-midnight hover:bg-amber-light font-body font-medium tracking-[0.1em] uppercase text-xs px-8 py-6 rounded-sm transition-all duration-300 glow-amber-sm hover:glow-amber"
              >
                Book Us
              </Button>
            </Link>
            <Link href="/shows">
              <Button
                variant="outline"
                size="lg"
                className="border-cream/20 text-cream hover:bg-cream/5 hover:border-cream/40 font-body font-normal tracking-[0.1em] uppercase text-xs px-8 py-6 rounded-sm transition-all duration-300"
              >
                See Shows
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {allSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-[2px] rounded-full transition-all duration-500 ${
              i === current
                ? "w-8 bg-amber"
                : "w-3 bg-cream/20 hover:bg-cream/40"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
