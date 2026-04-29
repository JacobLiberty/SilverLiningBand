"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface BookingFormData {
  name: string;
  email: string;
  eventType: string;
  date: string;
  message: string;
}

interface BookingResult {
  success: boolean;
  error?: string;
}

export async function submitBooking(data: BookingFormData): Promise<BookingResult> {
  const { name, email, eventType, date, message } = data;

  if (!name || !email || !eventType || !date || !message) {
    return { success: false, error: "All fields are required." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    await resend.emails.send({
      from: "Silver Lining Band <booking@resend.dev>",
      to: [process.env.BOOKING_EMAIL || "band@example.com"],
      replyTo: email,
      subject: `Booking Inquiry: ${eventType} on ${date}`,
      text: [
        `New booking inquiry from ${name}`,
        `Email: ${email}`,
        `Event Type: ${eventType}`,
        `Date: ${date}`,
        ``,
        `Message:`,
        message,
      ].join("\n"),
    });

    await resend.emails.send({
      from: "Silver Lining Band <booking@resend.dev>",
      to: [email],
      subject: "We got your booking inquiry!",
      text: [
        `Hi ${name},`,
        ``,
        `Thanks for reaching out! We received your inquiry about a ${eventType} on ${date}.`,
        `We'll get back to you as soon as possible.`,
        ``,
        `— The Real Silver Lining Band`,
      ].join("\n"),
    });

    return { success: true };
  } catch (err) {
    console.error("Booking email failed:", err);
    return { success: false, error: "Something went wrong. Please try again or email us directly." };
  }
}
