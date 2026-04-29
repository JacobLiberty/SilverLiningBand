import type { Metadata } from "next";
import { BookingForm } from "@/components/book/booking-form";

export const metadata: Metadata = {
  title: "Book Us | The Real Silver Lining Band",
  description:
    "Book The Real Silver Lining Band for your next event — weddings, corporate events, private parties, and more.",
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-surface px-6 pt-28 pb-16">
      <div className="mx-auto max-w-xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-silver">
          Inquiries
        </p>
        <h1 className="mt-2 text-center text-4xl font-light text-silver-light">
          Book Us
        </h1>
        <p className="mt-4 text-center text-muted">
          Planning an event? We&apos;d love to be part of it. Fill out the form
          below and we&apos;ll get back to you.
        </p>

        <div className="mt-10">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
