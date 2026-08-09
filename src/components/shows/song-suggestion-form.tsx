"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useApiForm } from "@/lib/useApiForm";

const WEB3FORMS_KEY = "c74a1e41-6c48-4510-878f-fdf48b0a6065";

interface SongSuggestionFormProps {
  showId: string;
  showTitle: string;
}

export function SongSuggestionForm({ showId, showTitle }: SongSuggestionFormProps) {
  const { status, errorMessage, submit, reset } = useApiForm("/api/song-suggestion");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const songTitle = formData.get("songTitle") as string;
    const artist = formData.get("artist") as string;
    const requesterName = formData.get("requesterName") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    // Best-effort notification email — Web3Forms only allows browser-side calls
    // on the free plan, so this has to happen here, not in the API route. It's
    // fire-and-forget: the songSuggestion record in Sanity (via `submit` below)
    // is the durable source of truth, so a Web3Forms hiccup shouldn't block the
    // actual submission.
    fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        access_key: WEB3FORMS_KEY,
        from_name: "Silver Lining Band Website",
        subject: `Song Suggestion: "${songTitle}" for ${showTitle}`,
        replyto: email,
        Song: songTitle,
        ...(artist && { Artist: artist }),
        Show: showTitle,
        ...(requesterName && { "Requester Name": requesterName }),
        Email: email,
        ...(message && { Message: message }),
      }),
    }).catch((err) => console.error("Band notification email failed:", err));

    await submit(
      { songTitle, artist, requesterName, email, message, showId, showTitle },
      e.currentTarget
    );
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
          <span className="text-xl text-amber">&#9835;</span>
        </div>
        <h3 className="font-display text-2xl italic text-cream">Request Sent</h3>
        <p className="mt-3 font-body text-sm text-cream-dim">
          Thanks for the suggestion — we&apos;ll take a look!
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded border border-amber/30 bg-amber/[0.08] px-5 py-2 font-body text-xs font-medium uppercase tracking-[0.15em] text-amber transition-all duration-200 hover:border-amber/50 hover:bg-amber/[0.15]"
        >
          Suggest Another Song
        </button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-5"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="song-title"
            className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
          >
            Song Title
          </Label>
          <Input
            id="song-title"
            name="songTitle"
            required
            placeholder="e.g. Dreams"
            className="mt-2 h-10 border-border-cool bg-smoke/80 text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
          />
        </div>

        <div>
          <Label
            htmlFor="song-artist"
            className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
          >
            Artist{" "}
            <span className="normal-case tracking-normal text-silver-dim">(optional)</span>
          </Label>
          <Input
            id="song-artist"
            name="artist"
            placeholder="e.g. Fleetwood Mac"
            className="mt-2 h-10 border-border-cool bg-smoke/80 text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label
            htmlFor="song-name"
            className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
          >
            Your Name{" "}
            <span className="normal-case tracking-normal text-silver-dim">(optional)</span>
          </Label>
          <Input
            id="song-name"
            name="requesterName"
            placeholder="Your name"
            className="mt-2 h-10 border-border-cool bg-smoke/80 text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
          />
        </div>

        <div>
          <Label
            htmlFor="song-email"
            className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
          >
            Email
          </Label>
          <Input
            id="song-email"
            name="email"
            type="email"
            required
            placeholder="your@email.com"
            className="mt-2 h-10 border-border-cool bg-smoke/80 text-cream placeholder:text-silver-dim focus-visible:border-amber/40 focus-visible:ring-amber/20"
          />
        </div>
      </div>

      <div>
        <Label
          htmlFor="song-message"
          className="font-body text-xs font-medium uppercase tracking-[0.15em] text-silver"
        >
          Message{" "}
          <span className="normal-case tracking-normal text-silver-dim">(optional)</span>
        </Label>
        <Textarea
          id="song-message"
          name="message"
          rows={3}
          placeholder="Anything else we should know?"
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

      <Button
        type="submit"
        disabled={status === "sending"}
        className="glow-amber-sm w-full bg-amber py-2.5 font-body text-xs font-semibold uppercase tracking-[0.2em] text-midnight transition-all duration-200 hover:bg-amber-light disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Suggest This Song"}
      </Button>

      <p className="text-center font-body text-xs text-silver-dim">
        Not a guarantee we&apos;ll play it — but we love requests!
      </p>
    </motion.form>
  );
}
