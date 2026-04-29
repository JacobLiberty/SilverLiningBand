"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

interface VideoItem {
  src: string;
  title: string;
  venue?: string;
}

interface VideoGalleryProps {
  videos: VideoItem[];
}

export function VideoGallery({ videos }: VideoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const handleMouseEnter = useCallback((index: number) => {
    // Mute all other videos first
    videoRefs.current.forEach((v, i) => {
      if (v && i !== index) {
        v.pause();
        v.muted = true;
        v.currentTime = 0;
      }
    });

    setActiveIndex(index);
    const video = videoRefs.current[index];
    if (video) {
      video.currentTime = 0;
      video.muted = false;
      video.volume = 0.5;
      video.play().catch(() => {});
    }
  }, []);

  const handleMouseLeave = useCallback((index: number) => {
    setActiveIndex(null);
    const video = videoRefs.current[index];
    if (video) {
      video.pause();
      video.muted = true;
      video.currentTime = 0;
    }
  }, []);

  return (
    <div className="flex items-stretch gap-2 h-[420px] sm:h-[480px] w-full">
      {videos.map((video, idx) => {
        const isActive = activeIndex === idx;
        return (
          <motion.div
            key={video.src}
            className="relative group cursor-pointer overflow-hidden rounded-lg border border-border-cool transition-all duration-500"
            style={{ flex: isActive ? 4 : 1 }}
            onMouseEnter={() => handleMouseEnter(idx)}
            onMouseLeave={() => handleMouseLeave(idx)}
            onTouchStart={() => handleMouseEnter(idx)}
          >
            {/* Video element */}
            <video
              ref={(el) => { videoRefs.current[idx] = el; }}
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src={video.src} type="video/mp4" />
            </video>

            {/* Dark overlay — fades on hover */}
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                isActive ? "opacity-30" : "opacity-60"
              } bg-midnight`}
            />

            {/* Amber glow on active */}
            {isActive && (
              <div className="absolute inset-0 bg-linear-to-t from-amber/20 via-transparent to-transparent" />
            )}

            {/* Title overlay — always visible */}
            <div className="absolute inset-x-0 bottom-0 z-10 p-4">
              <motion.div
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col"
              >
                <span className="font-display text-lg text-cream leading-tight sm:text-xl">
                  {video.title}
                </span>
                {video.venue && (
                  <span className="mt-1 font-body text-xs text-cream-dim tracking-wider uppercase">
                    {video.venue}
                  </span>
                )}

                {/* Play indicator — only on active */}
                {isActive && (
                  <motion.div
                    className="mt-3 flex items-center gap-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="flex items-center gap-[3px]">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="w-[3px] rounded-full bg-amber"
                          animate={{
                            height: ["8px", "16px", "8px"],
                          }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </div>
                    <span className="font-body text-[10px] tracking-[0.15em] uppercase text-amber">
                      Playing
                    </span>
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Vertical title when collapsed (rotated) */}
            {!isActive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-display text-sm text-cream/60 tracking-widest uppercase whitespace-nowrap"
                  style={{
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                  }}
                >
                  {video.title}
                </span>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
