"use server";

interface BookingFormData {
  name: string;
  email: string;
  eventType: string;
  date: string;
  message: string;
  turnstileToken: string;
}

interface BookingResult {
  success: boolean;
  error?: string;
}

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // Skip if not configured
  if (!token) return true; // Skip if token not yet generated (widget still loading)

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    }
  );

  const data = await response.json();
  return data.success === true;
}

export async function submitBooking(data: BookingFormData): Promise<BookingResult> {
  const { name, email, eventType, date, message, turnstileToken } = data;

  if (!name || !email || !eventType || !date || !message) {
    return { success: false, error: "All fields are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  const isHuman = await verifyTurnstile(turnstileToken);
  if (!isHuman) {
    return { success: false, error: "Spam check failed. Please try again." };
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  if (!accessKey) {
    return { success: false, error: "Contact form is not configured yet. Please email us directly." };
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `Booking Inquiry: ${eventType} on ${date}`,
        from_name: "Silver Lining Band Website",
        name,
        email,
        event_type: eventType,
        preferred_date: date,
        message,
      }),
    });

    const result = await response.json();

    if (!result.success) {
      return { success: false, error: "Something went wrong. Please try again or email us directly." };
    }

    return { success: true };
  } catch (err) {
    console.error("Booking form submission failed:", err);
    return { success: false, error: "Something went wrong. Please try again or email us directly." };
  }
}
