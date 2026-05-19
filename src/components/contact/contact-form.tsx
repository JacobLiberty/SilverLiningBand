"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
const WEB3FORMS_KEY = "c74a1e41-6c48-4510-878f-fdf48b0a6065";

export function ContactForm() {
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
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `New Message from ${name}`,
          from_name: "Silver Lining Band Website",
          replyto: email,
          Name: name,
          Email: email,
          Message: message,
          ...(turnstileToken && { "cf-turnstile-response": turnstileToken }),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setStatus("error");
        setErrorMessage(
          result.message || "Something went wrong. Please try again."
        );
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "Could not connect. Please try again or email us directly."
      );
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
        <h3 className="font-display text-2xl italic text-cream">Thank You</h3>
        <p className="mt-3 font-body text-sm text-cream-dim">
          We&apos;ve received your message and will get back to you soon.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded border border-amber/30 bg-amber/[0.08] px-5 py-2 font-body text-xs font-medium uppercase tracking-[0.15em] text-amber transition-all duration-200 hover:border-amber/50 hover:bg-amber/[0.15]"
        >
          Send Another Message
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
          htmlFor="contact-name"
          className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
        >
          Name
        </Label>
        <Input
          id="contact-name"
          name="name"
          required
          placeholder="Your name"
          className="mt-2 h-10 border-border-cool bg-smoke/80 text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
        />
      </div>

      <div>
        <Label
          htmlFor="contact-email"
          className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
        >
          Email
        </Label>
        <Input
          id="contact-email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="mt-2 h-10 border-border-cool bg-smoke/80 text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
        />
      </div>

      <div>
        <Label
          htmlFor="contact-message"
          className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
        >
          Message
        </Label>
        <Textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="What's on your mind? Ask us anything..."
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
        {status === "sending" ? "Sending..." : "Send Message"}
      </Button>
    </motion.form>
  );
}
