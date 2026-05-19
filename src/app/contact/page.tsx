import type { Metadata } from "next";
import Image from "next/image";
import { ContactTabs } from "@/components/contact/contact-tabs";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Silver Lining Band — questions, booking inquiries, or just to say hi. Available for weddings, corporate events, and venues across Ottawa.",
  alternates: {
    canonical: "https://silverliningband.ca/contact",
  },
};

export default function ContactPage() {
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
            Questions &amp; Bookings
          </p>
          <h1 className="mt-4 text-center font-display text-5xl font-light italic tracking-tight text-cream sm:text-6xl">
            Reach Out
          </h1>
          <p className="mt-5 text-center font-body text-sm leading-relaxed text-cream-dim">
            Whether you&apos;re looking to book us or just have a question
            &mdash; we&apos;d love to hear from you.
          </p>

          {/* Ornamental divider */}
          <div className="mx-auto mt-8 flex max-w-xs items-center gap-4">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber/30" />
            <span className="text-amber/60" aria-hidden="true">
              &#9830;
            </span>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber/30" />
          </div>

          {/* Tabbed forms */}
          <div className="mt-12">
            <ContactTabs />
          </div>
        </div>
      </div>
    </div>
  );
}
