"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

/** Shared submit/status logic for the site's public POST-to-API forms. */
export function useApiForm(endpoint: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function submit(payload: Record<string, unknown>, formEl?: HTMLFormElement) {
    setStatus("sending");
    setErrorMessage("");

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    reset: () => setStatus("idle"),
  };
}
