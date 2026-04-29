"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitBooking } from "@/app/actions/booking";

export function BookingForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

    const result = await submitBooking(data);

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
        className="rounded-lg border border-border-accent bg-surface-raised p-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="text-xl text-silver-light">Thanks for reaching out!</h3>
        <p className="mt-2 text-muted">
          We&apos;ll get back to you as soon as possible.
        </p>
        <Button
          onClick={() => setStatus("idle")}
          variant="outline"
          className="mt-4 border-border-accent text-silver"
        >
          Send Another
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name" className="text-silver-light">Name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Your name"
          className="mt-1 border-border-subtle bg-surface-raised text-white placeholder:text-muted"
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-silver-light">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="mt-1 border-border-subtle bg-surface-raised text-white placeholder:text-muted"
        />
      </div>

      <div>
        <Label htmlFor="eventType" className="text-silver-light">Event Type</Label>
        <Input
          id="eventType"
          name="eventType"
          required
          placeholder="Wedding, Corporate, Festival, Private Party..."
          className="mt-1 border-border-subtle bg-surface-raised text-white placeholder:text-muted"
        />
      </div>

      <div>
        <Label htmlFor="date" className="text-silver-light">Preferred Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          required
          className="mt-1 border-border-subtle bg-surface-raised text-white placeholder:text-muted"
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-silver-light">Tell us about your event</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Venue, expected guests, any special requests..."
          className="mt-1 border-border-subtle bg-surface-raised text-white placeholder:text-muted"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}

      <Button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-silver text-surface hover:bg-silver-light"
      >
        {status === "sending" ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}
