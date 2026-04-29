import type { Metadata } from "next";
import Image from "next/image";
import { BookingForm } from "@/components/book/booking-form";

export const metadata: Metadata = {
  title: "Book Us | Silver Lining Band",
  description:
    "Book Silver Lining Band for your next event — weddings, corporate events, private parties, and more.",
};

export default function BookPage() {
  return (
    <div className="relative min-h-screen bg-midnight">
      {/* Hero background with dark overlay */}
      <div className="absolute inset-0 h-[480px] overflow-hidden sm:h-[520px]">
        <Image
          src="/images/booking-bg.jpg"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-midnight/70 via-midnight/80 to-midnight" />
        <div className="absolute inset-0 bg-gradient-to-r from-midnight/40 via-transparent to-midnight/40" />
      </div>

      {/* Content */}
      <div className="relative px-6 pt-32 pb-20">
        <div className="mx-auto max-w-xl">
          {/* Editorial header */}
          <p className="text-center font-body text-xs font-medium uppercase tracking-[0.35em] text-amber">
            Private Events &amp; Performances
          </p>
          <h1 className="mt-4 text-center font-display text-5xl font-light italic tracking-tight text-cream sm:text-6xl">
            Book the Band
          </h1>
          <p className="mt-5 text-center font-body text-sm leading-relaxed text-cream-dim">
            Planning something special? We&apos;d love to bring the music.
            Fill out the form below and we&apos;ll be in touch.
          </p>

          {/* Ornamental divider */}
          <div className="mx-auto mt-8 flex max-w-xs items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber/30" />
            <span className="text-amber/60" aria-hidden="true">
              &#9830;
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber/30" />
          </div>

          {/* Form container */}
          <div className="mt-12 rounded-xl border border-border-cool bg-charcoal/90 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
            <BookingForm />
          </div>
        </div>
      </div>
    </div>
  );
}
