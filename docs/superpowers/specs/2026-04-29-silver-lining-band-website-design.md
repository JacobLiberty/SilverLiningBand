# Silver Lining Band Website — Design Spec

## Overview

Website for "The Real Silver Lining Band," a classic rock cover band (Fleetwood Mac, Eagles, Beatles era). Dual audience: fans finding upcoming shows and event bookers hiring the band. Three-page hybrid architecture with a scroll-based homepage.

## Tech Stack

- **Framework:** Next.js 15 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Animations:** Framer Motion (scroll-triggered, page transitions)
- **CMS:** Sanity v3 (Studio embedded at /studio)
- **Email:** Resend (booking form submissions)
- **Hosting:** Vercel (free tier)
- **Image CDN:** Sanity Image Pipeline (auto-optimization, responsive srcsets)

## Visual Direction

- **Palette:** Black base (#0a0a0a), dark navy (#0f0f14, #1a1a2e), silver/blue accent (#c0c0ff), bright white (#e8e8ff) for headings, muted gray (#888) for secondary text
- **Typography:** Clean sans-serif (Inter or similar), wide letter-spacing on headings, uppercase section labels
- **Mood:** Cool, polished, modern — leans into "Silver" in the band name
- **Design note:** First revision is a functional blueprint with placeholder content. UI will be significantly improved in future iterations with bento grids, advanced Framer Motion animations, and polished components.

## Pages & Routing

### / (Home) — Scroll Sections

Sticky transparent nav with backdrop blur. Logo left, nav links right. Links for About, Music, Gallery scroll to sections on this page. Shows and Book Us navigate to separate pages.

**Sections in order:**

1. **#hero** — Full-width band photo with dark overlay. Band name ("The Real Silver Lining Band"), tagline ("Classic rock from the golden era"), two CTA buttons: "Book Us" → /book, "See Shows" → /shows.

2. **#about** — Band photo + bio text side by side. Bio content pulled from Sanity SiteSettings. Full about section (not a preview).

3. **#upcoming-shows** — Next 3 upcoming shows as cards (date, venue, city, time). Each card links to details or ticket URL if available. "See All Shows →" links to /shows. Shows pulled from Sanity, sorted by date, filtered to future dates.

4. **#music** — YouTube video embed (featured performance). Brief note pointing to socials for more content. Video URL managed in Sanity SiteSettings.

5. **#gallery** — Photo grid (3 columns) with lightbox on click. Images managed in Sanity (GalleryImage type). Lazy loaded with Sanity CDN optimization.

6. **Footer** — Social links (Instagram, Facebook, YouTube), newsletter email signup (Resend), copyright line.

### /shows — Full Show Calendar

All upcoming shows listed with date, venue, city, time, and optional ticket/info link. Past shows archived below in a collapsed or secondary section. All data from Sanity. ISR with on-demand revalidation via Sanity webhook.

### /book — Booking Inquiry

Brief "what we offer" blurb at top. Simple contact form: name, email, event type, date, message. Form submission via Next.js Server Action → Resend API → band email inbox. Confirmation email sent back to the person who submitted. Testimonials section if/when available.

### /studio — Sanity Studio

Embedded Sanity Studio for content management. Band members log in here to add shows, upload photos, and edit site settings. No custom code needed — standard Sanity Studio embed.

## Sanity Schema (Lean)

### Show
- `title`: string (venue name or event name)
- `date`: datetime
- `venue`: string
- `city`: string
- `time`: string
- `ticketUrl`: url (optional)
- `description`: text (optional)

### GalleryImage
- `image`: image (with hotspot)
- `caption`: string (optional)
- `category`: string enum — "live", "promo", "backstage"

### SiteSettings (singleton)
- `bandName`: string
- `tagline`: string
- `bio`: block content (rich text)
- `heroImage`: image
- `featuredVideoUrl`: url
- `contactEmail`: string
- `socialLinks`: object — instagram, facebook, youtube URLs

## Data Flow

1. **Build time (SSG):** Home page statically generated, fetching shows, gallery, and site settings from Sanity via GROQ queries.
2. **ISR:** /shows page uses Incremental Static Regeneration. Sanity webhook hits a Next.js revalidation endpoint on publish, so new shows appear within seconds.
3. **Booking form:** Client-side form → Server Action → Resend API. No client-side API keys exposed. Server Action validates input, sends email, returns success/error.
4. **Images:** All images served via Sanity's CDN with automatic format conversion (WebP), responsive sizing, and lazy loading via Next.js Image component.

## Rendering Strategy

| Page | Strategy | Reason |
|------|----------|--------|
| / | SSG + ISR | Fast loads, content updates on Sanity publish |
| /shows | ISR | Show data changes frequently |
| /book | Static shell + client form | Form is interactive, page frame is static |
| /studio | Client-side only | Sanity Studio is a full SPA |

## Project Structure

```
src/
  app/
    layout.tsx          — Root layout, fonts, metadata
    page.tsx            — Home page (scroll sections)
    shows/
      page.tsx          — Full show calendar
    book/
      page.tsx          — Booking form
    studio/
      [[...tool]]/
        page.tsx        — Sanity Studio embed
    actions/
      booking.ts        — Server Action for booking form → Resend
    api/
      revalidate/
        route.ts        — Webhook endpoint for Sanity ISR
  components/
    layout/
      navbar.tsx        — Sticky nav with scroll-aware links
      footer.tsx        — Social links, newsletter, copyright
    home/
      hero.tsx          — Hero section
      about.tsx         — About section
      upcoming-shows.tsx — Show preview cards
      music.tsx         — Video embed section
      gallery.tsx       — Photo grid with lightbox
    shows/
      show-card.tsx     — Individual show card
      show-list.tsx     — Show list with upcoming/past separation
    book/
      booking-form.tsx  — Booking inquiry form
  lib/
    sanity/
      client.ts         — Sanity client config
      queries.ts        — GROQ queries
      image.ts          — Image URL builder
  sanity/
    schema/
      index.ts          — Schema barrel
      show.ts           — Show schema
      gallery-image.ts  — Gallery image schema
      site-settings.ts  — Site settings singleton
    sanity.config.ts    — Sanity config
    sanity.cli.ts       — Sanity CLI config
```

## Key Decisions

- **No BandMember schema** — lineup is stable, hardcode in about section. Can add later if needed.
- **No dedicated about/music/gallery pages** — all live as home sections. Nav scrolls to them.
- **Server Actions over API routes** — simpler for form handling, no exposed endpoints.
- **Sanity SiteSettings singleton** — bio, hero image, video URL, and social links are editable without code changes.
- **Newsletter signup in footer** — Resend for collection, simple email list to start. Can integrate Mailchimp/ConvertKit later.

## Future Enhancements (Not in V1)

- Bento grid layouts and advanced component design
- Rich Framer Motion animations (parallax, staggered reveals, page transitions)
- Merch store integration
- Blog/news section
- EPK (Electronic Press Kit) page for industry contacts
- Fan RSVP for shows
- Custom domain + SEO optimization pass
