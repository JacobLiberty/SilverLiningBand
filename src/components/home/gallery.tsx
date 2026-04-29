"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImageSource } from "@sanity/image-url";

interface GalleryImageItem {
  _id: string;
  image: SanityImageSource;
  caption?: string;
}

interface StockImageItem {
  _id: string;
  src: string;
  caption: string;
}

type DisplayImage = GalleryImageItem | StockImageItem;

interface GalleryProps {
  images: GalleryImageItem[];
}

const STOCK_IMAGES: readonly StockImageItem[] = [
  { _id: "stock-1", src: "/images/band/gallery-remic-group.jpg", caption: "Live at Remic Rapids" },
  { _id: "stock-2", src: "/images/band/gallery-helen-bw.jpg", caption: "Helen at the mic" },
  { _id: "stock-3", src: "/images/band/gallery-greg.jpg", caption: "Greg on guitar" },
  { _id: "stock-4", src: "/images/band/gallery-remic-night.jpg", caption: "Night performance at Remic" },
  { _id: "stock-5", src: "/images/band/gallery-nancy-helen.jpg", caption: "Nancy and Helen at Homestead" },
  { _id: "stock-6", src: "/images/band/gallery-dom-remic.jpg", caption: "Dom at Remic Rapids" },
] as const;

function isStockImage(item: DisplayImage): item is StockImageItem {
  return "src" in item;
}

function getImageUrl(item: DisplayImage, width: number, height?: number): string {
  if (isStockImage(item)) {
    return item.src;
  }
  const builder = urlFor(item.image).width(width);
  return height ? builder.height(height).url() : builder.url();
}

function getFullImageUrl(item: DisplayImage): string {
  if (isStockImage(item)) {
    return item.src;
  }
  return urlFor(item.image).width(1200).quality(90).url();
}

function getCaption(item: DisplayImage): string {
  return item.caption ?? "Band photo";
}

/** Bento grid — 3x3 square layout, no empty cells */
const BENTO_CLASSES = [
  "col-start-1 col-end-3 row-start-1 row-end-3",   // 0 — large 2x2
  "col-start-3 col-end-4 row-start-1 row-end-2",    // 1 — top right
  "col-start-3 col-end-4 row-start-2 row-end-3",    // 2 — mid right
  "col-start-1 col-end-2 row-start-3 row-end-4",    // 3 — bottom left
  "col-start-2 col-end-3 row-start-3 row-end-4",    // 4 — bottom mid
  "col-start-3 col-end-4 row-start-3 row-end-4",    // 5 — bottom right
] as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.93, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: "easeOut" as const,
    },
  }),
};

export function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<DisplayImage | null>(null);

  const displayImages: readonly DisplayImage[] =
    images.length > 0 ? images : STOCK_IMAGES;

  return (
    <section id="gallery" className="relative bg-charcoal px-6 py-28 md:py-36 overflow-hidden">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/4 bottom-0 h-[400px] w-[600px] rounded-full bg-amber/3 blur-[140px]" />

      <div className="relative mx-auto max-w-5xl">
        <motion.p
          className="text-center font-body text-xs font-medium uppercase tracking-[0.35em] text-amber"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Photos
        </motion.p>

        <motion.h2
          className="mt-3 text-center font-display text-4xl italic text-cream md:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="text-gradient-amber">Gallery</span>
        </motion.h2>

        <motion.div
          className="divider-ornament mx-auto mt-5 mb-12 max-w-xs text-amber/40"
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-amber text-sm">&#9835;</span>
        </motion.div>

        {/* Bento grid — explicit placement with fixed row heights */}
        <div
          className="grid gap-2 md:gap-3"
          style={{
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "repeat(3, 200px)",
          }}
        >
          {displayImages.slice(0, 6).map((item, i) => {
            const bentoClass = BENTO_CLASSES[i] ?? "col-span-1 row-span-1 aspect-square";
            return (
              <motion.button
                key={item._id}
                className={`group relative overflow-hidden rounded-sm ${bentoClass}`}
                onClick={() => setSelectedImage(item)}
                custom={i}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                aria-label={`View ${getCaption(item)}`}
              >
                <Image
                  src={getImageUrl(item, i === 0 ? 800 : 400, i === 0 ? 600 : 400)}
                  alt={getCaption(item)}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes={i === 0 ? "(max-width: 768px) 100vw, 60vw" : "(max-width: 768px) 50vw, 30vw"}
                />
                {/* Hover overlay — amber gradient from bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber/25 via-midnight/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                {/* Caption on hover */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
                  <p className="text-xs font-medium tracking-wide text-cream/90">
                    {getCaption(item)}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-midnight/95 backdrop-blur-sm p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <button
              className="absolute right-5 top-5 rounded-full border border-border-cool bg-charcoal/80 p-2 text-cream-dim transition-colors hover:border-amber/40 hover:text-cream"
              onClick={() => setSelectedImage(null)}
              aria-label="Close lightbox"
            >
              <X className="h-5 w-5" />
            </button>

            <motion.div
              className="relative max-h-[85vh] max-w-[85vw]"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative overflow-hidden rounded-sm glow-amber-sm">
                <Image
                  src={getFullImageUrl(selectedImage)}
                  alt={getCaption(selectedImage)}
                  width={1200}
                  height={800}
                  className="rounded-sm object-contain"
                />
              </div>
              {selectedImage.caption && (
                <p className="mt-3 text-center font-body text-sm text-cream-dim">
                  {selectedImage.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
