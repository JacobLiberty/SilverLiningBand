"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay before the first child starts animating (seconds) */
  baseDelay?: number;
  /** Stagger between each child (seconds) */
  stagger?: number;
}

const containerVariants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: {
      staggerChildren: stagger,
    },
  }),
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  },
};

/**
 * Wraps children in a staggered reveal animation.
 * Each direct child fades up in sequence when scrolled into view.
 * Use `<StaggerReveal.Item>` for each child that should animate.
 */
export function StaggerReveal({
  children,
  className,
  baseDelay = 0,
  stagger = 0.12,
}: StaggerRevealProps) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      custom={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delayChildren: baseDelay }}
    >
      {children}
    </motion.div>
  );
}

function Item({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

StaggerReveal.Item = Item;
