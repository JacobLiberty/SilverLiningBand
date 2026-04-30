# Production Infrastructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move from hardcoded seed data to CMS-driven content (Sanity), working email (Resend), and spam protection (Cloudflare Turnstile).

**Architecture:** Update Sanity schemas to include video, show images, and expanded site settings. Update GROQ queries and components to read from Sanity with local fallbacks. Add Turnstile invisible widget to the booking form with server-side token verification before sending email.

**Tech Stack:** Sanity v5, next-sanity 12, Resend 6, @marsidev/react-turnstile, Cloudflare Turnstile API

---

## File Structure

```
sanity/schema/
  show.ts              — Add image field
  video.ts             — NEW: video document type
  site-settings.ts     — Add aboutQuote, aboutImage, heroVideo
  index.ts             — Register video schema

src/lib/sanity/
  queries.ts           — Add videosQuery, update siteSettingsQuery and show queries

src/app/
  page.tsx             — Fetch videos from Sanity, pass to Music
  actions/booking.ts   — Add Turnstile token verification

src/components/
  home/hero.tsx        — Read heroVideoUrl from settings
  home/about.tsx       — Read aboutImage, aboutQuote from settings
  home/music.tsx       — Accept videos prop from Sanity
  home/upcoming-shows.tsx — Read imageUrl from show data
  book/booking-form.tsx   — Add Turnstile widget
```

---

### Task 1: Install Turnstile Package

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install @marsidev/react-turnstile**

```bash
cd /Users/jacobliberty/Documents/GitHub/SilverLiningBand
npm install @marsidev/react-turnstile
```

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @marsidev/react-turnstile for spam protection"
```

---

### Task 2: Add Video Schema + Update Show and SiteSettings Schemas

**Files:**
- Create: `sanity/schema/video.ts`
- Modify: `sanity/schema/show.ts`
- Modify: `sanity/schema/site-settings.ts`
- Modify: `sanity/schema/index.ts`

- [ ] **Step 1: Create Video schema**

Create `sanity/schema/video.ts`:

```typescript
import { defineType, defineField } from "sanity";

export const video = defineType({
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Song / Performance Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
    }),
    defineField({
      name: "videoFile",
      title: "Video File",
      type: "file",
      options: { accept: "video/mp4" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first",
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: "Display Order",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "venue",
    },
  },
});
```

- [ ] **Step 2: Add image field to Show schema**

In `sanity/schema/show.ts`, add a new field after the `city` field. The full fields array should become:

```typescript
fields: [
    defineField({
      name: "title",
      title: "Event / Venue Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date & Time",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Venue",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "address",
      title: "Address",
      type: "string",
      description: "Full address — used for Google Maps link",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "City",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Venue / Event Photo",
      type: "image",
      options: { hotspot: true },
      description: "Shown on the show card — photo of the venue or a past event there",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
```

- [ ] **Step 3: Update SiteSettings schema**

Replace the contents of `sanity/schema/site-settings.ts`:

```typescript
import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "bandName",
      title: "Band Name",
      type: "string",
      initialValue: "Silver Lining Band",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      initialValue: "Classic rock from the golden era",
    }),
    defineField({
      name: "bio",
      title: "About — Bio Text",
      type: "array",
      of: [{ type: "block" }],
      description: "The main body text in the About section",
    }),
    defineField({
      name: "aboutQuote",
      title: "About — Pull Quote",
      type: "string",
      description: "The italic quote shown in the About section",
      initialValue: "Music is the silver lining in every storm.",
    }),
    defineField({
      name: "aboutImage",
      title: "About — Photo",
      type: "image",
      options: { hotspot: true },
      description: "The image shown next to the About text",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero — Background Video",
      type: "file",
      options: { accept: "video/mp4" },
      description: "Looping background video for the hero section",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "object",
      fields: [
        defineField({ name: "instagram", title: "Instagram URL", type: "url" }),
        defineField({ name: "facebook", title: "Facebook URL", type: "url" }),
        defineField({ name: "youtube", title: "YouTube URL", type: "url" }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
```

- [ ] **Step 4: Register video schema in barrel export**

Replace `sanity/schema/index.ts`:

```typescript
import { show } from "./show";
import { galleryImage } from "./gallery-image";
import { siteSettings } from "./site-settings";
import { video } from "./video";

export const schemaTypes = [show, galleryImage, siteSettings, video];
```

- [ ] **Step 5: Commit**

```bash
git add sanity/schema/
git commit -m "feat: add Video schema, image to Show, expand SiteSettings"
```

---

### Task 3: Update GROQ Queries

**Files:**
- Modify: `src/lib/sanity/queries.ts`

- [ ] **Step 1: Update queries**

Replace `src/lib/sanity/queries.ts`:

```typescript
import { groq } from "next-sanity";

export const upcomingShowsQuery = groq`
  *[_type == "show" && date >= now()] | order(date asc) {
    _id, title, date, venue, address, city, description,
    "imageUrl": image.asset->url
  }
`;

export const upcomingShowsPreviewQuery = groq`
  *[_type == "show" && date >= now()] | order(date asc) [0...3] {
    _id, title, date, venue, address, city, description,
    "imageUrl": image.asset->url
  }
`;

export const pastShowsQuery = groq`
  *[_type == "show" && date < now()] | order(date desc) {
    _id, title, date, venue, address, city, description,
    "imageUrl": image.asset->url
  }
`;

export const galleryImagesQuery = groq`
  *[_type == "galleryImage"] | order(_createdAt desc)
`;

export const videosQuery = groq`
  *[_type == "video"] | order(order asc) {
    _id, title, venue, order,
    "videoUrl": videoFile.asset->url
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    bandName,
    tagline,
    bio,
    aboutQuote,
    aboutImage,
    "heroVideoUrl": heroVideo.asset->url,
    contactEmail,
    socialLinks
  }
`;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/sanity/queries.ts
git commit -m "feat: update GROQ queries for videos, show images, expanded settings"
```

---

### Task 4: Update Components to Read from Sanity

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/hero.tsx`
- Modify: `src/components/home/about.tsx`
- Modify: `src/components/home/music.tsx`
- Modify: `src/components/home/upcoming-shows.tsx`
- Modify: `src/components/shows/show-card.tsx`
- Modify: `src/app/shows/page.tsx`

- [ ] **Step 1: Update page.tsx to fetch videos and pass expanded settings**

Replace `src/app/page.tsx`:

```typescript
import { client, isSanityConfigured } from "@/lib/sanity/client";
import {
  siteSettingsQuery,
  upcomingShowsPreviewQuery,
  galleryImagesQuery,
  videosQuery,
} from "@/lib/sanity/queries";
import { SEED_UPCOMING_SHOWS } from "@/lib/seed-shows";
import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { UpcomingShows } from "@/components/home/upcoming-shows";
import { Music } from "@/components/home/music";
import { Gallery } from "@/components/home/gallery";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, shows, gallery, videos] = isSanityConfigured
    ? await Promise.all([
        client.fetch(siteSettingsQuery).catch(() => null),
        client.fetch(upcomingShowsPreviewQuery).catch(() => []),
        client.fetch(galleryImagesQuery).catch(() => []),
        client.fetch(videosQuery).catch(() => []),
      ])
    : [null, SEED_UPCOMING_SHOWS.slice(0, 3), [], []];

  return (
    <>
      <Hero
        bandName={settings?.bandName || "Silver Lining Band"}
        tagline={settings?.tagline || "Classic rock covers from the golden era — Fleetwood Mac, Eagles, Beatles & more"}
        heroVideoUrl={settings?.heroVideoUrl}
      />
      <About
        bio={settings?.bio}
        aboutQuote={settings?.aboutQuote}
        aboutImageUrl={settings?.aboutImage?.asset?.url}
      />
      <UpcomingShows shows={shows || []} />
      <Music videos={videos || []} />
      <Gallery images={gallery || []} />
    </>
  );
}
```

- [ ] **Step 2: Update Hero to accept heroVideoUrl**

In `src/components/home/hero.tsx`, update the interface and video src:

Change the interface to:

```typescript
interface HeroProps {
  bandName: string;
  tagline: string;
  heroVideoUrl?: string;
}
```

Change the function signature to:

```typescript
export function Hero({ bandName, tagline, heroVideoUrl }: HeroProps) {
```

Change the `<source>` tag to:

```typescript
<source src={heroVideoUrl || "/video/featured.mp4"} type="video/mp4" />
```

- [ ] **Step 3: Update About to accept aboutQuote and aboutImageUrl**

In `src/components/home/about.tsx`, update the interface:

```typescript
interface AboutProps {
  bio?: PortableTextBlock[];
  aboutQuote?: string;
  aboutImageUrl?: string;
}
```

Update the function signature:

```typescript
export function About({ bio, aboutQuote, aboutImageUrl }: AboutProps) {
```

Update the image src:

```typescript
src={aboutImageUrl || "/images/band/about-band.jpg"}
```

Update the quote text:

```typescript
<p className="font-display text-xl italic leading-relaxed text-cream md:text-2xl">
  &ldquo;{aboutQuote || "Music is the silver lining in every storm."}&rdquo;
</p>
```

- [ ] **Step 4: Update Music to accept videos from Sanity**

In `src/components/home/music.tsx`, update the component to accept a `videos` prop. Add an interface and merge Sanity videos with local fallbacks:

Add at the top of the file (after imports):

```typescript
interface SanityVideo {
  _id: string;
  title: string;
  venue?: string;
  videoUrl: string;
}

interface MusicProps {
  videos: SanityVideo[];
}
```

Change the hardcoded `videos` array to a `LOCAL_VIDEOS` fallback:

```typescript
const LOCAL_VIDEOS = [
  { src: "/video/featured.mp4", title: "Be My Baby", venue: "Sonny's" },
  { src: "/video/fishermans-blues.mp4", title: "Fishermans Blues", venue: "Remic Rapids" },
  { src: "/video/cant-let-go.mp4", title: "Can't Let Go", venue: "Cumberland" },
  { src: "/video/without-love.mp4", title: "Without Love", venue: "Sonny's" },
  { src: "/video/the-longest-time.mp4", title: "The Longest Time", venue: "Live" },
  { src: "/video/live-clip.mp4", title: "Live Session", venue: "On Stage" },
];
```

Change the function signature and derive the video list:

```typescript
export function Music({ videos: sanityVideos }: MusicProps) {
  const galleryVideos = sanityVideos.length > 0
    ? sanityVideos.map((v) => ({ src: v.videoUrl, title: v.title, venue: v.venue }))
    : LOCAL_VIDEOS;
```

Pass `galleryVideos` to `<VideoGallery videos={galleryVideos} />`.

- [ ] **Step 5: Update show queries to use imageUrl**

In `src/components/home/upcoming-shows.tsx` and `src/components/shows/show-list.tsx`, the Show interface already has `image?: string`. Rename it to accept either:

In `src/components/home/upcoming-shows.tsx`, update the interface:

```typescript
interface Show {
  _id: string;
  title: string;
  date: string;
  venue: string;
  address: string;
  city: string;
  image?: string;
  imageUrl?: string;
  description?: string;
}
```

In `src/components/shows/show-list.tsx`, make the same update:

```typescript
interface Show {
  _id: string;
  title: string;
  date: string;
  venue: string;
  address: string;
  city: string;
  image?: string;
  imageUrl?: string;
  description?: string;
}
```

In `src/components/shows/show-card.tsx`, update the interface and usage:

```typescript
interface ShowCardProps {
  title: string;
  date: string;
  venue: string;
  address: string;
  city: string;
  image?: string;
  imageUrl?: string;
  description?: string;
}
```

And in the component body, use whichever is available:

```typescript
const showImage = imageUrl || image;
```

Then use `showImage` where `image` was used before.

- [ ] **Step 6: Verify build**

```bash
cd /Users/jacobliberty/Documents/GitHub/SilverLiningBand
npm run build
```

Expected: Build succeeds. Sanity queries return null/empty without env vars, components fall back to local data.

- [ ] **Step 7: Commit**

```bash
git add .
git commit -m "feat: components read from Sanity with local fallbacks"
```

---

### Task 5: Add Cloudflare Turnstile to Booking Form

**Files:**
- Modify: `src/components/book/booking-form.tsx`
- Modify: `src/app/actions/booking.ts`

- [ ] **Step 1: Add Turnstile widget to booking form**

In `src/components/book/booking-form.tsx`, add the import at the top:

```typescript
import { Turnstile } from "@marsidev/react-turnstile";
```

Add a ref for the token:

```typescript
const [turnstileToken, setTurnstileToken] = useState("");
```

In the `handleSubmit` function, pass the token:

```typescript
const result = await submitBooking({
  ...data,
  turnstileToken,
});
```

Add the Turnstile widget before the submit button (invisible mode — no visible UI):

```tsx
{process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
  <Turnstile
    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
    onSuccess={setTurnstileToken}
    options={{ size: "invisible" }}
  />
)}
```

- [ ] **Step 2: Add server-side Turnstile verification to booking action**

Replace `src/app/actions/booking.ts`:

```typescript
"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  if (!secret) return true; // Skip verification if not configured

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

  // Verify Turnstile token (spam protection)
  const isHuman = await verifyTurnstile(turnstileToken);
  if (!isHuman) {
    return { success: false, error: "Spam check failed. Please try again." };
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
        `— Silver Lining Band`,
      ].join("\n"),
    });

    return { success: true };
  } catch (err) {
    console.error("Booking email failed:", err);
    return { success: false, error: "Something went wrong. Please try again or email us directly." };
  }
}
```

- [ ] **Step 3: Verify build**

```bash
npm run build
```

Expected: Build succeeds. Without Turnstile env vars, the widget doesn't render and verification is skipped — graceful degradation.

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add Cloudflare Turnstile spam protection to booking form"
```

---

### Task 6: Update next.config.ts for Sanity File CDN

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add Sanity file CDN hostname**

The current config allows `cdn.sanity.io` for images. Sanity serves files (videos) from the same CDN, but the next/image component may need the pattern. More importantly, the `<video>` elements use direct URLs so no config change is needed for video playback. However, if the about image uses `next/image` with Sanity URLs, we need to ensure the pattern is there.

Read the current `next.config.ts` and verify `cdn.sanity.io` is already in `remotePatterns`. If it is, no changes needed. If not, add it.

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 2: Commit (if changed)**

```bash
git add next.config.ts
git commit -m "chore: ensure Sanity CDN in Next.js image config"
```

---

### Task 7: Verify Full Build and Final Commit

**Files:**
- No new files

- [ ] **Step 1: Run full build**

```bash
cd /Users/jacobliberty/Documents/GitHub/SilverLiningBand
npm run build
```

Expected: Clean build. All pages render with local fallback data when Sanity env vars are not set.

- [ ] **Step 2: Test dev server**

```bash
npm run dev
```

Verify:
- Homepage loads with local video hero, about image, seed shows, gallery, video gallery
- /shows loads with seed data
- /book loads with booking form (Turnstile widget hidden without env var)
- /studio loads Sanity Studio (will show config error without project ID — that's expected)

- [ ] **Step 3: Final commit if any remaining changes**

```bash
git add .
git commit -m "chore: verify production infrastructure build"
```

---

## Post-Implementation: Manual Setup Steps

These are NOT code tasks — they're done in external dashboards after the code is deployed:

### Sanity Project
1. Go to sanity.io/manage → New Project → "Silver Lining Band"
2. Copy Project ID
3. Set `NEXT_PUBLIC_SANITY_PROJECT_ID` in Vercel env vars
4. Set `NEXT_PUBLIC_SANITY_DATASET=production` in Vercel env vars
5. Generate a revalidation secret, set `SANITY_REVALIDATE_SECRET` in Vercel
6. In Sanity project settings → API → Webhooks: add webhook to `https://yourdomain.com/api/revalidate?secret=YOUR_SECRET` triggered on all document types
7. Go to `yourdomain.com/studio` and populate content

### Resend
1. Create account at resend.com
2. Get API key from dashboard
3. Set `RESEND_API_KEY` in Vercel env vars
4. Set `BOOKING_EMAIL` to the band's email address
5. (Optional) Verify custom domain for branded sender address

### Cloudflare Turnstile
1. Create Cloudflare account (or use existing)
2. Turnstile dashboard → Add site → Invisible mode
3. Set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` in Vercel env vars
4. Set `TURNSTILE_SECRET_KEY` in Vercel env vars

---

## Summary

| Task | What It Builds | Files |
|------|---------------|-------|
| 1 | Install Turnstile package | package.json |
| 2 | Sanity schemas (Video, Show image, expanded Settings) | 4 schema files |
| 3 | Updated GROQ queries | queries.ts |
| 4 | Components read from Sanity with fallbacks | 7 component/page files |
| 5 | Turnstile spam protection on booking form | booking action + form |
| 6 | Next.js config for Sanity CDN | next.config.ts |
| 7 | Full build verification | — |
