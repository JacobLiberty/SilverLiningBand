"use client";

import { motion } from "framer-motion";
import { Turnstile } from "@marsidev/react-turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiForm } from "@/lib/useApiForm";

interface MailingListCtaProps {
  id?: string;
}

export function MailingListCta({ id }: MailingListCtaProps) {
  const { status, errorMessage, submit, setTurnstileToken } = useApiForm("/api/subscribe");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await submit({ email: formData.get("email"), source: "homepage" }, e.currentTarget);
  }

  return (
    <section id={id} className="relative bg-charcoal px-6 py-24 md:py-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-amber/5 blur-[150px]" />

      <motion.div
        className="glow-amber relative mx-auto max-w-2xl rounded-lg border border-amber/20 bg-smoke/60 px-8 py-14 text-center sm:px-14"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber/30 bg-amber/10">
          <span className="text-2xl text-amber">&#9835;</span>
        </div>

        <p className="mt-6 font-body text-xs font-medium uppercase tracking-[0.35em] text-amber">
          Stay in the Loop
        </p>

        <h2 className="mt-3 font-display text-4xl italic text-cream md:text-5xl">
          Never Miss a <span className="text-gradient-amber">Show</span>
        </h2>

        <p className="mx-auto mt-4 max-w-md font-body text-sm text-cream-dim">
          Join the mailing list for new show announcements — no spam, just music.
        </p>

        <div className="mt-8">
          {status === "success" ? (
            <p className="rounded-lg border border-amber/20 bg-charcoal/80 px-6 py-4 font-body text-sm text-cream">
              <span className="mr-2 text-amber">&#10003;</span>
              You&apos;re on the list — thanks for signing up!
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <Input
                type="email"
                name="email"
                required
                placeholder="your@email.com"
                aria-label="Email address"
                className="h-12 flex-1 border-border-cool bg-charcoal/80 text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
              />
              <Button
                type="submit"
                disabled={status === "sending"}
                className="glow-amber-sm h-12 shrink-0 bg-amber px-7 font-body text-xs font-semibold uppercase tracking-[0.2em] text-midnight transition-all duration-200 hover:bg-amber-light disabled:opacity-50"
              >
                {status === "sending" ? "Joining..." : "Sign Up"}
              </Button>
              {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <Turnstile
                  siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                  onSuccess={setTurnstileToken}
                  options={{ size: "invisible" }}
                />
              )}
            </form>
          )}

          {status === "error" && (
            <p className="mx-auto mt-3 max-w-md rounded border border-red-500/20 bg-red-500/10 px-3 py-2 font-body text-sm text-red-400">
              {errorMessage}
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
