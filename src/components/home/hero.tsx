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

/** Collage images — each with position, size, rotation, and drift animation */
const collageImages = [
  {
    src: "/images/band/hero-group.jpg",
    alt: "Silver Lining Band",
    className: "absolute top-[8%] right-[5%] w-[55%] sm:w-[45%] aspect-[4/3] z-[3]",
    rotate: 3,
    drift: { x: [0, 8, 0], y: [0, -6, 0] },
    duration: 18,
  },
  {
    src: "/images/band/nancy-bw.jpg",
    alt: "Nancy performing",
    className: "absolute top-[25%] left-[2%] w-[40%] sm:w-[32%] aspect-[3/4] z-[2]",
    rotate: -4,
    drift: { x: [0, -5, 0], y: [0, 8, 0] },
    duration: 22,
  },
  {
    src: "/images/band/greg-bw.jpg",
    alt: "Greg on guitar",
    className: "absolute bottom-[15%] right-[8%] w-[38%] sm:w-[30%] aspect-square z-[1]",
    rotate: 5,
    drift: { x: [0, 6, 0], y: [0, 5, 0] },
    duration: 20,
  },
  {
    src: "/images/band/dom-bw.jpg",
    alt: "Dom on guitar",
    className: "absolute bottom-[22%] left-[15%] w-[30%] sm:w-[24%] aspect-[4/5] z-[4]",
    rotate: -2,
    drift: { x: [0, -4, 0], y: [0, -7, 0] },
    duration: 24,
  },
];

export function Hero({ bandName, tagline, heroImage }: HeroProps) {
  // If Sanity provides a hero image, use it as the primary collage image
  if (heroImage) {
    collageImages[0] = {
      ...collageImages[0],
      src: urlFor(heroImage).width(1200).quality(80).url(),
    };
  }

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-midnight">
      {/* Collage images — slowly drifting */}
      {collageImages.map((img, i) => (
        <motion.div
          key={img.src}
          className={img.className}
          initial={{ opacity: 0, scale: 0.9, rotate: img.rotate }}
          animate={{
            opacity: [0, 1],
            scale: [0.9, 1],
            x: img.drift.x,
            y: img.drift.y,
          }}
          transition={{
            opacity: { duration: 1.2, delay: 0.3 + i * 0.2 },
            scale: { duration: 1.2, delay: 0.3 + i * 0.2 },
            x: {
              duration: img.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            },
            y: {
              duration: img.duration,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            },
          }}
          style={{ rotate: img.rotate }}
        >
          <div className="relative w-full h-full overflow-hidden rounded-sm shadow-2xl shadow-black/40">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="object-cover"
              priority={i === 0}
              sizes={i === 0 ? "(max-width: 768px) 55vw, 45vw" : "(max-width: 768px) 40vw, 30vw"}
            />
            {/* Subtle warm tint on each image */}
            <div className="absolute inset-0 bg-amber/[0.06] mix-blend-overlay" />
          </div>
          {/* Drop shadow / border effect */}
          <div className="absolute inset-0 rounded-sm border border-cream/[0.08]" />
        </motion.div>
      ))}

      {/* Dark vignette overlay */}
      <div className="absolute inset-0 bg-midnight/50 z-[5]" />
      <div className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/40 to-midnight/20 z-[5]" />
      <div className="absolute inset-0 bg-linear-to-r from-midnight/70 via-transparent to-transparent z-[5]" />

      {/* Warm ambient glow — bar lighting */}
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
