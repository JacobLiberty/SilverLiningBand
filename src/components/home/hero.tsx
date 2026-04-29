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
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {heroImage && (
        <Image
          src={urlFor(heroImage).width(1920).quality(80).url()}
          alt={bandName}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-surface/70 via-surface/50 to-surface" />

      <motion.div
        className="relative z-10 px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-5xl font-bold tracking-wide text-white sm:text-7xl">
          {bandName}
        </h1>
        <p className="mt-4 text-lg text-silver">{tagline}</p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/book">
            <Button size="lg" className="bg-silver text-surface hover:bg-silver-light">
              Book Us
            </Button>
          </Link>
          <Link href="/shows">
            <Button
              variant="outline"
              size="lg"
              className="border-border-accent text-silver hover:bg-surface-overlay"
            >
              See Shows
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
