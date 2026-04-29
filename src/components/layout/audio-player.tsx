"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BAR_COUNT = 24;
const AUDIO_SRC = "/audio/sample.mp4";

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animFrameRef = useRef<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState(false);
  const [bars, setBars] = useState<number[]>(Array(BAR_COUNT).fill(0));
  const [isVisible, setIsVisible] = useState(true);

  // Check if audio file exists on mount
  useEffect(() => {
    fetch(AUDIO_SRC, { method: "HEAD" })
      .then((res) => setHasAudio(res.ok))
      .catch(() => setHasAudio(false));
  }, []);

  const visualize = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current!.getByteFrequencyData(dataArray);

      const step = Math.floor(bufferLength / BAR_COUNT);
      const newBars = Array.from({ length: BAR_COUNT }, (_, i) => {
        const value = dataArray[i * step] ?? 0;
        return value / 255;
      });
      setBars(newBars);
    };

    draw();
  }, []);

  const togglePlay = useCallback(async () => {
    if (!audioRef.current) {
      const audio = new Audio(AUDIO_SRC);
      audio.loop = true;
      audio.volume = 0.4;
      audioRef.current = audio;

      // Set up Web Audio API for visualization
      const ctx = new AudioContext();
      const source = ctx.createMediaElementSource(audio);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
    }

    if (isPlaying) {
      audioRef.current.pause();
      cancelAnimationFrame(animFrameRef.current);
      setBars(Array(BAR_COUNT).fill(0));
    } else {
      await audioRef.current.play();
      visualize();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, visualize]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (!hasAudio) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-6 right-6 z-40"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="relative flex items-center gap-3 rounded-full border border-border-warm bg-charcoal/95 backdrop-blur-xl px-4 py-3 shadow-lg shadow-black/30">
            {/* Close button */}
            <button
              onClick={() => {
                if (isPlaying) togglePlay();
                setIsVisible(false);
              }}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-smoke border border-border-cool text-cream-dim hover:text-cream text-[10px]"
              aria-label="Close player"
            >
              &times;
            </button>

            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber text-midnight transition-all duration-200 hover:bg-amber-light hover:glow-amber-sm"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <svg className="h-3.5 w-3.5" viewBox="0 0 12 14" fill="currentColor">
                  <rect x="1" y="0" width="3" height="14" rx="1" />
                  <rect x="8" y="0" width="3" height="14" rx="1" />
                </svg>
              ) : (
                <svg className="h-3.5 w-3.5 ml-0.5" viewBox="0 0 12 14" fill="currentColor">
                  <path d="M0 0L12 7L0 14V0Z" />
                </svg>
              )}
            </button>

            {/* Waveform visualization */}
            <div className="flex items-end gap-[2px] h-7 w-[90px]">
              {bars.map((level, i) => (
                <motion.div
                  key={i}
                  className="w-[2px] rounded-full bg-amber"
                  animate={{
                    height: isPlaying
                      ? `${Math.max(3, level * 28)}px`
                      : `${3 + Math.sin((i / BAR_COUNT) * Math.PI) * 4}px`,
                  }}
                  transition={{
                    duration: isPlaying ? 0.05 : 0.8,
                    ease: "easeOut",
                  }}
                  style={{ opacity: isPlaying ? 0.6 + level * 0.4 : 0.3 }}
                />
              ))}
            </div>

            {/* Label */}
            <span className="text-[10px] font-body font-normal tracking-wider uppercase text-cream-dim whitespace-nowrap pr-2">
              {isPlaying ? "Now Playing" : "Listen"}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
