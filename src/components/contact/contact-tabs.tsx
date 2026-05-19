"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ContactForm } from "./contact-form";
import { BookingForm } from "@/components/book/booking-form";

const tabs = [
  {
    id: "contact" as const,
    label: "Get in Touch",
    description: "Have a question or just want to say hi? Drop us a line.",
  },
  {
    id: "book" as const,
    label: "Book an Event",
    description:
      "Ready to book? Tell us about your event and we\u2019ll make it happen.",
  },
];

type TabId = (typeof tabs)[number]["id"];

export function ContactTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("contact");

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex rounded-lg border border-border-cool bg-smoke/40 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 rounded-md px-4 py-2.5 font-body text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-200 ${
              activeTab === tab.id
                ? "text-midnight"
                : "text-cream-dim hover:text-cream"
            }`}
          >
            {activeTab === tab.id && (
              <motion.span
                layoutId="active-tab"
                className="absolute inset-0 rounded-md bg-amber"
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab description */}
      <p className="mt-5 text-center font-body text-sm text-cream-dim">
        {tabs.find((t) => t.id === activeTab)?.description}
      </p>

      {/* Tab content */}
      <div className="mt-8 rounded-xl border border-border-cool bg-charcoal/90 p-6 shadow-2xl backdrop-blur-sm sm:p-8">
        {activeTab === "contact" ? <ContactForm /> : <BookingForm />}
      </div>
    </div>
  );
}
