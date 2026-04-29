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

interface GalleryProps {
  images: GalleryImageItem[];
}

export function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImageItem | null>(null);

  return (
    <section id="gallery" className="bg-surface-raised px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-silver">
          Photos
        </p>
        <h2 className="mt-2 text-center text-3xl font-light">Gallery</h2>

        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((item, i) => (
            <motion.button
              key={item._id}
              className="group relative aspect-square overflow-hidden rounded-md"
              onClick={() => setSelectedImage(item)}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Image
                src={urlFor(item.image).width(400).height(400).url()}
                alt={item.caption || "Band photo"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute right-4 top-4 text-white hover:text-silver"
              onClick={() => setSelectedImage(null)}
              aria-label="Close lightbox"
            >
              <X className="h-8 w-8" />
            </button>
            <motion.div
              className="relative max-h-[85vh] max-w-[85vw]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={urlFor(selectedImage.image).width(1200).quality(90).url()}
                alt={selectedImage.caption || "Band photo"}
                width={1200}
                height={800}
                className="rounded-lg object-contain"
              />
              {selectedImage.caption && (
                <p className="mt-2 text-center text-sm text-muted">
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
