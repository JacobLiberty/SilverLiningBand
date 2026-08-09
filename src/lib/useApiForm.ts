"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

/**
 * Shared submit/status/Turnstile logic for the site's public POST-to-API forms.
 *
 * `turnstileReady` stays true when Turnstile isn't configured, and only turns
 * true once a token has arrived when it is configured — the invisible widget's
 * onSuccess callback fires asynchronously, so gating on it prevents a fast
 * submit from going out tokenless and getting rejected server-side.
 */
export function useApiForm(endpoint: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const turnstileConfigured = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);
  const turnstileReady = !turnstileConfigured || Boolean(turnstileToken);

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
    turnstileReady,
    reset: () => setStatus("idle"),
  };
}
