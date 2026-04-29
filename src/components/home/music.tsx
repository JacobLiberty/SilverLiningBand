"use client";

import { motion } from "framer-motion";
import { StaggerReveal } from "@/components/ui/stagger-reveal";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  );
}

const socials = [
  { icon: InstagramIcon, label: "Instagram", href: "#" },
  { icon: FacebookIcon, label: "Facebook", href: "#" },
  { icon: YoutubeIcon, label: "YouTube", href: "#" },
];

export function Music() {
  return (
    <section id="music" className="relative bg-midnight px-6 py-28 md:py-36 overflow-hidden">
      {/* Cinematic ambient glows */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[800px] rounded-full bg-amber/3 blur-[180px]" />

      <div className="relative mx-auto max-w-5xl">
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

        {/* Video + Socials side by side on desktop */}
        <div className="grid gap-8 lg:grid-cols-[1fr_280px] lg:items-start">
          {/* Video container — cinematic frame */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          >
            <div className="relative overflow-hidden rounded-lg glow-amber">
              <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-amber/30 via-transparent to-amber-glow/20" />
              <div className="relative m-px overflow-hidden rounded-lg bg-charcoal flex items-center justify-center">
                <video
                  controls
                  className="max-h-[70vh] w-full rounded-lg object-contain"
                >
                  <source src="/video/the-longest-time.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>
          </motion.div>

          {/* Social links panel */}
          <motion.div
            className="flex flex-col items-center lg:items-start lg:pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="font-display text-2xl italic text-cream lg:text-3xl">
              See More on{" "}
              <span className="text-gradient-amber">Our Socials</span>
            </h3>
            <p className="mt-3 font-body text-sm text-cream-dim leading-relaxed text-center lg:text-left">
              Follow us for live clips, behind-the-scenes moments, and show announcements.
            </p>

            <div className="mt-6 flex gap-4">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-2"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-border-warm bg-charcoal/60 text-cream-dim transition-all duration-300 group-hover:border-amber group-hover:text-amber group-hover:glow-amber-sm">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-body text-[10px] tracking-[0.15em] uppercase text-silver-dim group-hover:text-cream transition-colors">
                    {label}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
