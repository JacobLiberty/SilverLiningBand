"use client";

import { Turnstile } from "@marsidev/react-turnstile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiForm } from "@/lib/useApiForm";

export function FooterNewsletterForm() {
  const { status, errorMessage, submit, setTurnstileToken, turnstileReady } =
    useApiForm("/api/subscribe");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await submit({ email: formData.get("email"), source: "footer" }, e.currentTarget);
  }

  if (status === "success") {
    return (
      <p className="font-body text-sm text-cream-dim">
        <span className="mr-1.5 text-amber">&#10003;</span>
        You&apos;re on the list!
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-[240px] flex-col gap-2">
      <Input
        type="email"
        name="email"
        required
        placeholder="your@email.com"
        aria-label="Email address"
        className="h-9 border-border-cool bg-charcoal/60 text-sm text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
      />
      <Button
        type="submit"
        disabled={status === "sending" || !turnstileReady}
        className="h-9 bg-amber font-body text-xs font-medium tracking-[0.15em] uppercase text-midnight transition-all duration-300 hover:bg-amber-light disabled:opacity-50"
      >
        {status === "sending" ? "Joining..." : "Sign Up"}
      </Button>
      {status === "error" && <p className="font-body text-xs text-red-400">{errorMessage}</p>}
      {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
        <Turnstile
          siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
          onSuccess={setTurnstileToken}
          options={{ size: "invisible" }}
        />
      )}
    </form>
  );
}
