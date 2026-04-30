"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

interface AboutProps {
  bio?: PortableTextBlock[];
  aboutQuote?: string;
  aboutImageUrl?: string;
}

const DEFAULT_BIO_TEXT = `We\u2019re a classic rock cover band bringing the golden era back to life \u2014 Fleetwood Mac, Eagles, Beatles, and more. Every show is a celebration of the music that defined a generation.`;

export function About({ bio, aboutQuote, aboutImageUrl }: AboutProps) {
  return (
    <section id="about" className="relative bg-charcoal px-6 py-28 md:py-36 overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 h-[600px] w-[400px] rounded-full bg-amber/5 blur-[120px]" />

      <div className="relative mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16 lg:gap-20">
          {/* Image — asymmetric, editorial crop */}
          <motion.div
            className="relative md:col-span-5 lg:col-span-5"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative aspect-square overflow-hidden rounded-sm">
              <Image
                src={aboutImageUrl || "/images/band/about-band.jpg"}
                alt="Silver Lining Band at golden hour, Remic Rapids"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent" />
            </div>
            {/* Decorative frame accent — always visible */}
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-sm border border-amber/30 z-10 pointer-events-none" />
          </motion.div>

          {/* Text — staggered reveal */}
          <StaggerReveal className="md:col-span-7 lg:col-span-6 lg:col-start-7" stagger={0.1}>
            <StaggerReveal.Item>
              <p className="font-body text-xs font-medium uppercase tracking-[0.35em] text-amber">
                About the Band
              </p>
            </StaggerReveal.Item>

            <StaggerReveal.Item>
              <h2 className="mt-4 font-display text-4xl italic leading-tight text-cream md:text-5xl lg:text-6xl">
                The Silver Lining{" "}
                <span className="text-gradient-amber">Story</span>
              </h2>
            </StaggerReveal.Item>

            <StaggerReveal.Item>
              <div className="divider-ornament mt-6 mb-8 text-amber/40">
                <span className="text-amber text-lg">&#9835;</span>
              </div>
            </StaggerReveal.Item>

            <StaggerReveal.Item>
              <blockquote className="mb-8 border-l-2 border-amber/40 pl-5">
                <p className="font-display text-xl italic leading-relaxed text-cream md:text-2xl">
                  &ldquo;{aboutQuote || "Music is the silver lining in every storm."}&rdquo;
                </p>
              </blockquote>
            </StaggerReveal.Item>

            <StaggerReveal.Item>
              <div className="text-cream-dim font-body leading-relaxed [&_p]:mb-4 [&_p]:text-base [&_p]:leading-[1.8]">
                {bio ? (
                  <PortableText value={bio} />
                ) : (
                  <p>{DEFAULT_BIO_TEXT}</p>
                )}
              </div>
            </StaggerReveal.Item>
          </StaggerReveal>
        </div>
      </div>
    </section>
  );
}
