const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * Verifies a Turnstile token server-side. Turnstile is best-effort bot
 * protection here, not an access-control boundary — so this only rejects a
 * request when a token WAS presented and Cloudflare explicitly says it's
 * invalid (a forged/replayed token). No token at all (widget didn't fire in
 * time, blocked by an extension, briefly misconfigured, etc.) never blocks a
 * real submission; a network hiccup talking to Cloudflare fails open too.
 */
export async function verifyTurnstileToken(token: unknown): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (typeof token !== "string" || !token) return true;

  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });

    const data = await response.json();
    if (data.success !== true) {
      console.warn("Turnstile token rejected:", data["error-codes"]);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Turnstile verification request failed, allowing through:", err);
    return true;
  }
}
