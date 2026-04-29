"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface HeroProps {
  bandName: string;
  tagline: string;
}

export function Hero({ bandName, tagline }: HeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const hasUnmutedRef = useRef(false);

  // Unmute on first user interaction (browser requires gesture for audio)
  useEffect(() => {
    const handleInteraction = () => {
      if (videoRef.current && !hasUnmutedRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 0.4;
        setIsMuted(false);
        hasUnmutedRef.current = true;
      }
    };

    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("touchstart", handleInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("touchstart", handleInteraction);
    };
  }, []);

  // Mute when hero scrolls out of view, unmute when back
  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
          if (hasUnmutedRef.current) {
            video.muted = false;
            setIsMuted(false);
          }
        } else {
          video.muted = true;
          setIsMuted(true);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    if (!newMuted) {
      videoRef.current.volume = 0.4;
      hasUnmutedRef.current = true;
    }
    setIsMuted(newMuted);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-end overflow-hidden bg-midnight"
    >
      {/* Background video — starts muted, unmutes on first interaction */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        poster="/images/band/hero-group.jpg"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src="/video/featured.mp4" type="video/mp4" />
      </video>

      {/* Overlays */}
      <div className="absolute inset-0 bg-midnight/60 z-[1]" />
      <div className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/50 to-midnight/30 z-[1]" />
      <div className="absolute inset-0 bg-linear-to-r from-midnight/70 via-midnight/20 to-transparent z-[1]" />

      {/* Warm ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[400px] bg-amber/[0.06] blur-[120px] rounded-full z-[2]" />
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-amber/[0.03] blur-[100px] rounded-full z-[2]" />

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

      {/* Mute/Unmute control — bottom right */}
      <motion.div
        className="absolute bottom-6 right-6 z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <button
          onClick={toggleMute}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 bg-midnight/50 backdrop-blur-sm text-cream/70 transition-all duration-200 hover:border-amber/40 hover:text-cream"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <line x1="23" x2="17" y1="9" y2="15" />
              <line x1="17" x2="23" y1="9" y2="15" />
            </svg>
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5Z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      </motion.div>

      {/* Scroll indicator — bottom center */}
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
