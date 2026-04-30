"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitBooking } from "@/app/actions/booking";

export function BookingForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      eventType: formData.get("eventType") as string,
      date: formData.get("date") as string,
      message: formData.get("message") as string,
    };

    const result = await submitBooking({
      ...data,
      turnstileToken,
    });

    if (result.success) {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        className="rounded-lg border border-amber/20 bg-smoke/80 p-10 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-amber/30 bg-amber/10">
          <span className="text-xl text-amber">&#10003;</span>
        </div>
        <h3 className="font-display text-2xl italic text-cream">
          Thank You
        </h3>
        <p className="mt-3 font-body text-sm text-cream-dim">
          We&apos;ve received your inquiry and will be in touch shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded border border-amber/30 bg-amber/[0.08] px-5 py-2 font-body text-xs font-medium uppercase tracking-[0.15em] text-amber transition-all duration-200 hover:border-amber/50 hover:bg-amber/[0.15]"
        >
          Send Another Inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div>
        <Label
          htmlFor="name"
          className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
        >
          Name
        </Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Your name"
          className="mt-2 h-10 border-border-cool bg-smoke/80 text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
        />
      </div>

      <div>
        <Label
          htmlFor="email"
          className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
        >
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="mt-2 h-10 border-border-cool bg-smoke/80 text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
        />
      </div>

      <div>
        <Label
          htmlFor="eventType"
          className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
        >
          Event Type
        </Label>
        <Input
          id="eventType"
          name="eventType"
          required
          placeholder="Wedding, Corporate, Festival, Private Party..."
          className="mt-2 h-10 border-border-cool bg-smoke/80 text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
        />
      </div>

      <div>
        <Label
          htmlFor="date"
          className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
        >
          Preferred Date
        </Label>
        <Input
          id="date"
          name="date"
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
          max="2099-12-31"
          className="mt-2 h-10 border-border-cool bg-smoke/80 text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
        />
      </div>

      <div>
        <Label
          htmlFor="message"
          className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
        >
          Tell Us About Your Event
        </Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Venue, expected guests, any special requests..."
          className="mt-2 border-border-cool bg-smoke/80 text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
        />
      </div>

      {status === "error" && (
        <motion.p
          className="rounded border border-red-500/20 bg-red-500/10 px-3 py-2 font-body text-sm text-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {errorMessage}
        </motion.p>
      )}

      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onSuccess={setTurnstileToken}
          options={{ size: "invisible" }}
        />
      )}

      <Button
        type="submit"
        disabled={status === "sending"}
        className="glow-amber-sm w-full bg-amber py-2.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-midnight transition-all duration-200 hover:bg-amber-light disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send Inquiry"}
      </Button>
    </motion.form>
  );
}
