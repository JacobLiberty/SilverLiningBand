import { NextRequest, NextResponse } from "next/server";
import { isWriteClientConfigured, writeClient } from "@/lib/sanity/writeClient";
import { isValidEmail } from "@/lib/validate";

export async function POST(request: NextRequest) {
  if (!isWriteClientConfigured) {
    console.error("Song suggestion: SANITY_API_TOKEN is not configured");
    return NextResponse.json(
      { success: false, message: "Song suggestions aren't set up yet. Please try again later." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => null);
  const songTitle = typeof body?.songTitle === "string" ? body.songTitle.trim() : "";
  const artist = typeof body?.artist === "string" ? body.artist.trim() : "";
  const requesterName = typeof body?.requesterName === "string" ? body.requesterName.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const showId = typeof body?.showId === "string" ? body.showId : "";

  if (!songTitle) {
    return NextResponse.json(
      { success: false, message: "Please enter a song title." },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { success: false, message: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  if (!showId) {
    return NextResponse.json(
      { success: false, message: "Missing show reference." },
      { status: 400 }
    );
  }

  try {
    const showExists = await writeClient.fetch(`*[_type == "show" && _id == $showId][0]._id`, {
      showId,
    });

    if (!showExists) {
      return NextResponse.json(
        { success: false, message: "This show could not be found." },
        { status: 400 }
      );
    }

    await writeClient.create({
      _type: "songSuggestion",
      songTitle,
      ...(artist && { artist }),
      ...(requesterName && { requesterName }),
      requesterEmail: email,
      ...(message && { message }),
      show: { _type: "reference", _ref: showId },
    });

    const existingSubscriber = await writeClient.fetch(
      `*[_type == "subscriber" && email == $email][0]._id`,
      { email }
    );

    if (!existingSubscriber) {
      await writeClient.create({
        _type: "subscriber",
        email,
        source: "song-suggestion",
        relatedShow: { _type: "reference", _ref: showId },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Thanks for the suggestion! We'll take a look.",
    });
  } catch (err) {
    console.error("Song suggestion failed:", err);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
