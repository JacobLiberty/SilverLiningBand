"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Shared submit/status/Turnstile logic for the site's public POST-to-API forms.
 *
 * The Turnstile token is sent along when available, but submission is never
 * blocked waiting for it — the invisible widget's onSuccess callback fires
 * asynchronously and isn't guaranteed to resolve before a user submits (or at
 * all), so gating the button on it risks bricking the form entirely. The
 * server treats Turnstile as best-effort too (src/lib/turnstile.ts).
 */
export function useApiForm(endpoint: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  async function submit(payload: Record<string, unknown>, formEl?: HTMLFormElement) {
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          ...(turnstileToken && { "cf-turnstile-response": turnstileToken }),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus("success");
        formEl?.reset();
      } else {
        setStatus("error");
        setErrorMessage(result.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage("Could not connect. Please try again.");
    }
  }

  return {
    status,
    errorMessage,
    submit,
    setTurnstileToken,
    reset: () => setStatus("idle"),
  };
}
