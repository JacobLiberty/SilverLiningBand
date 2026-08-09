import { NextRequest, NextResponse } from "next/server";
import { isWriteClientConfigured, writeClient } from "@/lib/sanity/writeClient";
import { sendBandNotification } from "@/lib/email";
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
  const showTitle = typeof body?.showTitle === "string" ? body.showTitle : "the show";

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

    // Send the notification before writing to Sanity — if Web3Forms fails, we
    // return early with nothing persisted, so a client retry can't create
    // duplicate songSuggestion/subscriber records for the same request.
    await sendBandNotification({
      subject: `Song Suggestion: "${songTitle}" for ${showTitle}`,
      replyto: email,
      Song: songTitle,
      ...(artist && { Artist: artist }),
      Show: showTitle,
      ...(requesterName && { "Requester Name": requesterName }),
      Email: email,
      ...(message && { Message: message }),
    });

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
