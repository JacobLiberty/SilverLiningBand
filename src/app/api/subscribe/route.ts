import { NextRequest, NextResponse } from "next/server";
import { isWriteClientConfigured, writeClient } from "@/lib/sanity/writeClient";
import { isValidEmail } from "@/lib/validate";
import { verifyTurnstileToken } from "@/lib/turnstile";

const ALLOWED_SOURCES = ["homepage", "footer", "song-suggestion"];

export async function POST(request: NextRequest) {
  if (!isWriteClientConfigured) {
    console.error("Subscribe: SANITY_API_TOKEN is not configured");
    return NextResponse.json(
      { success: false, message: "Signups aren't set up yet. Please try again later." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const source = body?.source;

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { success: false, message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!ALLOWED_SOURCES.includes(source)) {
    return NextResponse.json(
      { success: false, message: "Invalid signup source." },
      { status: 400 }
    );
  }

  if (!(await verifyTurnstileToken(body?.["cf-turnstile-response"]))) {
    return NextResponse.json(
      { success: false, message: "Verification failed. Please try again." },
      { status: 400 }
    );
  }

  try {
    const existing = await writeClient.fetch(
      `*[_type == "subscriber" && email == $email][0]._id`,
      { email }
    );

    if (!existing) {
      await writeClient.create({
        _type: "subscriber",
        email,
        source,
      });
    }

    return NextResponse.json({ success: true, message: "You're on the list!" });
  } catch (err) {
    console.error("Subscribe failed:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
