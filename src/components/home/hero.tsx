"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";

interface HeroProps {
  bandName: string;
  tagline: string;
  heroImage?: SanityImageSource;
}

export function Hero({ bandName, tagline, heroImage }: HeroProps) {
  const imageUrl = heroImage
    ? urlFor(heroImage).width(1920).quality(80).url()
    : "/images/hero-band.jpg";

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background image with parallax feel */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={imageUrl}
          alt={bandName}
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      </motion.div>

      {/* Multi-layer overlay for depth */}
      <div className="absolute inset-0 bg-midnight/40" />
      <div className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/60 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-midnight/30 to-transparent" />

      {/* Warm ambient glow — simulates bar lighting */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-amber/[0.08] blur-[120px] rounded-full" />
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-amber/[0.04] blur-[100px] rounded-full" />

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
            <span className="inline-flex items-center gap-3 text-xs font-body font-light tracking-[0.3em] uppercase text-amber">
              <span className="block w-8 h-[1px] bg-amber" />
              Live Classic Rock
            </span>
          </motion.div>

          {/* Band name — editorial treatment */}
          <motion.h1
            className="font-display font-bold text-cream tracking-wide"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="block text-5xl sm:text-7xl lg:text-8xl">Silver</span>
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
                className="border-cream/20 text-cream hover:bg-cream/5 hover:border-cream/40 font-body font-light tracking-[0.1em] uppercase text-xs px-8 py-6 rounded-sm transition-all duration-300"
              >
                See Shows
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-[1px] h-12 bg-linear-to-b from-amber/60 to-transparent"
          animate={{ scaleY: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
