# Production Infrastructure — Design Spec

## Overview

Move the Silver Lining Band website from hardcoded seed data to a fully CMS-driven, production-ready site. Three workstreams: Sanity CMS (content management), Resend (email), and Cloudflare Turnstile (spam protection).

## 1. Sanity CMS

### Sanity Project Setup

Create a Sanity project via `sanity init` or sanity.io/manage. Free tier (10GB assets, 500K API requests/month). Dataset: `production`.

### Schema Changes

**Show** (existing — add `image` field):
- `title`: string, required
- `date`: datetime, required
- `venue`: string, required
- `address`: string, required — used for Google Maps link
- `city`: string, required
- `image`: image with hotspot, optional — venue/event photo shown on show cards
- `description`: text, optional

**GalleryImage** (existing — no changes):
- `image`: image with hotspot, required
- `caption`: string, optional
- `category`: enum (live, promo, backstage)

**Video** (new):
- `title`: string, required — song/performance name
- `venue`: string, optional — where it was recorded
- `videoFile`: file, required — mp4 upload to Sanity asset CDN
- `order`: number — controls display order in the gallery

**SiteSettings** (existing — add fields):
- `bandName`: string
- `tagline`: string
- `bio`: portable text (rich text) — powers the About section body
- `aboutQuote`: string — the pull-quote in the About section ("Music is the silver lining...")
- `aboutImage`: image with hotspot — the About section photo
- `heroVideo`: file — the hero background video (mp4)
- `featuredVideoUrl`: url — deprecated, replaced by Video type
- `contactEmail`: string
- `socialLinks`: object { instagram, facebook, youtube } — URLs

### GROQ Queries (updates)

```groq
// Videos — ordered by the order field
*[_type == "video"] | order(order asc) {
  _id, title, venue, order,
  "videoUrl": videoFile.asset->url
}

// Site settings — add new fields
*[_type == "siteSettings"][0] {
  bandName, tagline, bio, aboutQuote, aboutImage,
  "heroVideoUrl": heroVideo.asset->url,
  contactEmail, socialLinks
}

// Shows — add image field
*[_type == "show" && date >= now()] | order(date asc) {
  ...,
  "imageUrl": image.asset->url
}
```

### Sanity Studio Structure

Organized in the Studio sidebar:
1. **Site Settings** (singleton at top)
2. Divider
3. **Shows** (list)
4. **Videos** (list)
5. **Gallery Images** (list)

### ISR Revalidation

Already built at `/api/revalidate`. Sanity webhook calls this endpoint on publish. No changes needed — just configure the webhook in Sanity project settings once the project is created.

## 2. Resend Email

### Setup Steps (manual — not code)

1. Create Resend account at resend.com
2. Option A: Verify a custom domain (e.g., `silverliningband.com`) for branded sender address
3. Option B: Use `onboarding@resend.dev` free sender for testing (limited to your own email)
4. Get API key from Resend dashboard

### Environment Variables

Set in Vercel dashboard (Settings > Environment Variables):
- `RESEND_API_KEY`: from Resend dashboard
- `BOOKING_EMAIL`: the band's email address (e.g., `silverliningband@gmail.com`)

### Code Changes

**Update `from` address** in `src/app/actions/booking.ts`:
- Once domain is verified: `Silver Lining Band <booking@silverliningband.com>`
- Until then: `onboarding@resend.dev`

No other code changes needed — the booking action and form are already built.

## 3. Cloudflare Turnstile (Spam Protection)

### What It Is

Invisible CAPTCHA alternative from Cloudflare. Free tier. No puzzles for real users — runs a background challenge. Returns a token that the server verifies.

### Setup Steps (manual)

1. Create Cloudflare account (or use existing)
2. Go to Turnstile dashboard, add a site
3. Set widget mode to "Invisible"
4. Get Site Key (public) and Secret Key (server)

### Environment Variables

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: public, used in the form widget
- `TURNSTILE_SECRET_KEY`: server-side, used to verify tokens

### Code Changes

**Booking form** (`src/components/book/booking-form.tsx`):
- Add Turnstile invisible widget using `@marsidev/react-turnstile` package
- Widget renders invisibly, produces a token on form submit
- Pass the token along with form data to the server action

**Booking action** (`src/app/actions/booking.ts`):
- Before sending email, verify the Turnstile token via Cloudflare's `/siteverify` API
- If verification fails, return error without sending email
- Token verification is a single `fetch` POST — no SDK needed

## 4. Component Updates

### Hero (`src/components/home/hero.tsx`)
- Read `heroVideoUrl` from Sanity settings instead of hardcoded `/video/featured.mp4`
- Fallback to the local file if Sanity isn't configured

### About (`src/components/home/about.tsx`)
- Read `aboutImage` and `aboutQuote` from Sanity settings
- Fallback to current hardcoded values

### Video Gallery (`src/components/home/music.tsx`)
- Fetch videos from Sanity instead of hardcoded array
- Use `videoUrl` from Sanity asset CDN
- Fallback to local `/public/video/` files if Sanity isn't configured

### Show Cards (`src/components/shows/show-card.tsx`, `upcoming-shows.tsx`)
- Read `imageUrl` from Sanity show data
- Fallback to local images

### Remove seed data
- Once Sanity is populated, remove `src/lib/seed-shows.ts`
- Remove hardcoded social links from footer and music section (read from Sanity)
- Keep local image/video files as fallbacks during development

## 5. Migration Plan

### Populate Sanity via Studio UI

After Sanity project is created and schemas deployed:

1. **Site Settings**: Fill in band name, tagline, bio, quote, about image, hero video, social links
2. **Shows**: Recreate the 5 upcoming + 2 past shows from seed data
3. **Gallery Images**: Upload the 6 gallery photos with captions
4. **Videos**: Upload the 6 mp4 files with titles and venues

This is a one-time manual task in the Studio at `yoursite.com/studio`.

### Order of Operations

1. Create Sanity project + deploy schemas
2. Set env vars on Vercel (Sanity project ID, dataset, revalidation secret)
3. Populate content via Studio
4. Verify site renders from Sanity data
5. Set up Resend (API key, booking email)
6. Set up Turnstile (site key, secret key)
7. Update booking form with Turnstile widget
8. Test booking form end-to-end
9. Clean up: remove seed data fallbacks, remove local assets if desired

## Dependencies

- `@marsidev/react-turnstile` — Turnstile React component (new)
- All other deps already installed

## Environment Variables Summary

| Variable | Where | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Vercel | Sanity project |
| `NEXT_PUBLIC_SANITY_DATASET` | Vercel | Sanity dataset (production) |
| `SANITY_REVALIDATE_SECRET` | Vercel | ISR webhook auth |
| `RESEND_API_KEY` | Vercel | Email sending |
| `BOOKING_EMAIL` | Vercel | Where booking inquiries go |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Vercel | Turnstile widget (public) |
| `TURNSTILE_SECRET_KEY` | Vercel | Turnstile verification (server) |
