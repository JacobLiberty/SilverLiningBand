# Silver Lining Band Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a three-page band website (Home, Shows, Book Us) with Sanity CMS for content management and Resend for booking form emails.

**Architecture:** Next.js 15 App Router with hybrid rendering — SSG for home, ISR for shows, static shell + client form for booking. Sanity Studio embedded at /studio. Scroll-based homepage with sections for About, Shows preview, Music, and Gallery.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Framer Motion 12, Sanity v5, next-sanity 12, Resend 6

---

## File Structure

```
silver-lining-band/
├── .env.local.example          — Environment variable template
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts          — Not needed for Tailwind v4 (CSS-first config)
├── src/
│   ├── app/
│   │   ├── globals.css         — Tailwind v4 imports + custom theme tokens
│   │   ├── layout.tsx          — Root layout: fonts, metadata, navbar, footer
│   │   ├── page.tsx            — Home: assembles scroll sections
│   │   ├── shows/
│   │   │   └── page.tsx        — Full show calendar
│   │   ├── book/
│   │   │   └── page.tsx        — Booking form page
│   │   ├── studio/
│   │   │   └── [[...tool]]/
│   │   │       └── page.tsx    — Sanity Studio embed
│   │   ├── actions/
│   │   │   └── booking.ts      — Server Action: form → Resend
│   │   └── api/
│   │       └── revalidate/
│   │           └── route.ts    — Sanity webhook → ISR revalidation
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navbar.tsx      — Sticky nav, scroll-aware section links
│   │   │   └── footer.tsx      — Socials, newsletter signup, copyright
│   │   ├── home/
│   │   │   ├── hero.tsx        — Full-width hero with CTAs
│   │   │   ├── about.tsx       — Band story + photo
│   │   │   ├── upcoming-shows.tsx — Next 3 shows preview
│   │   │   ├── music.tsx       — YouTube embed section
│   │   │   └── gallery.tsx     — Photo grid with lightbox
│   │   ├── shows/
│   │   │   ├── show-card.tsx   — Individual show display
│   │   │   └── show-list.tsx   — Upcoming + past show lists
│   │   └── book/
│   │       └── booking-form.tsx — Contact form with validation
│   └── lib/
│       └── sanity/
│           ├── client.ts       — Sanity client config
│           ├── queries.ts      — All GROQ queries
│           └── image.ts        — Image URL builder helper
├── sanity/
│   ├── sanity.config.ts        — Sanity project config
│   ├── sanity.cli.ts           — CLI config
│   └── schema/
│       ├── index.ts            — Schema barrel export
│       ├── show.ts             — Show document type
│       ├── gallery-image.ts    — Gallery image document type
│       └── site-settings.ts    — Singleton site settings
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-04-29-silver-lining-band-website-design.md
```

---

## Task 1: Initialize Next.js Project + Git Repo

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `.gitignore`, `.env.local.example`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`

- [ ] **Step 1: Initialize git repo**

```bash
cd /Users/jacobliberty/Documents/GitHub/SilverLiningBand
git init
```

- [ ] **Step 2: Create Next.js app**

```bash
cd /Users/jacobliberty/Documents/GitHub/SilverLiningBand
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```

Select defaults when prompted. This scaffolds the project with Next.js 16, TypeScript, Tailwind CSS v4, ESLint, App Router, and `src/` directory.

- [ ] **Step 3: Verify the app runs**

```bash
cd /Users/jacobliberty/Documents/GitHub/SilverLiningBand
npm run dev &
sleep 3
curl -s http://localhost:3000 | head -20
kill %1
```

Expected: HTML output from the default Next.js page.

- [ ] **Step 4: Create .env.local.example**

Create `/Users/jacobliberty/Documents/GitHub/SilverLiningBand/.env.local.example`:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Resend
RESEND_API_KEY=

# Revalidation
SANITY_REVALIDATE_SECRET=

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- [ ] **Step 5: Update .gitignore**

Append to the existing `.gitignore`:

```
# Environment
.env.local
.env*.local

# Sanity
.sanity/

# Superpowers
.superpowers/
```

- [ ] **Step 6: Commit**

```bash
git add .
git commit -m "feat: initialize Next.js 16 project with TypeScript and Tailwind v4"
```

---

## Task 2: Install Dependencies + Configure Tailwind Theme

**Files:**
- Modify: `src/app/globals.css`
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install all project dependencies**

```bash
cd /Users/jacobliberty/Documents/GitHub/SilverLiningBand
npm install sanity next-sanity @sanity/image-url @sanity/vision resend framer-motion
```

- [ ] **Step 2: Install shadcn/ui**

```bash
cd /Users/jacobliberty/Documents/GitHub/SilverLiningBand
npx shadcn@latest init -d
```

This initializes shadcn/ui with defaults. When prompted, accept defaults.

- [ ] **Step 3: Add shadcn/ui components we need**

```bash
cd /Users/jacobliberty/Documents/GitHub/SilverLiningBand
npx shadcn@latest add button input textarea label card
```

- [ ] **Step 4: Configure Tailwind theme with Silver Lining palette**

Replace the contents of `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-silver: #c0c0ff;
  --color-silver-light: #e8e8ff;
  --color-silver-dim: #8080aa;
  --color-surface: #0a0a0a;
  --color-surface-raised: #0f0f14;
  --color-surface-overlay: #1a1a2e;
  --color-muted: #888888;
  --color-border-subtle: rgba(255, 255, 255, 0.06);
  --color-border-accent: rgba(192, 192, 255, 0.2);

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}

@layer base {
  body {
    @apply bg-surface text-white antialiased;
  }

  h1, h2, h3, h4 {
    @apply text-silver-light;
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: install dependencies, configure shadcn/ui and silver theme"
```

---

## Task 3: Sanity Schema + Studio Embed

**Files:**
- Create: `sanity/sanity.config.ts`
- Create: `sanity/sanity.cli.ts`
- Create: `sanity/schema/index.ts`
- Create: `sanity/schema/show.ts`
- Create: `sanity/schema/gallery-image.ts`
- Create: `sanity/schema/site-settings.ts`
- Create: `src/app/studio/[[...tool]]/page.tsx`

- [ ] **Step 1: Create Show schema**

Create `sanity/schema/show.ts`:

```typescript
import { defineType, defineField } from "sanity";

export const show = defineType({
  name: "show",
  title: "Show",
  type: "document",
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
      name: "city",
      title: "City",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "ticketUrl",
      title: "Ticket / Info URL",
      type: "url",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
  orderings: [
    {
      title: "Date (Newest First)",
      name: "dateDesc",
      by: [{ field: "date", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "venue",
      date: "date",
    },
    prepare({ title, subtitle, date }) {
      return {
        title,
        subtitle: `${subtitle} — ${date ? new Date(date).toLocaleDateString() : "No date"}`,
      };
    },
  },
});
```

- [ ] **Step 2: Create GalleryImage schema**

Create `sanity/schema/gallery-image.ts`:

```typescript
import { defineType, defineField } from "sanity";

export const galleryImage = defineType({
  name: "galleryImage",
  title: "Gallery Image",
  type: "document",
  fields: [
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "string",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Live", value: "live" },
          { title: "Promo", value: "promo" },
          { title: "Backstage", value: "backstage" },
        ],
      },
      initialValue: "live",
    }),
  ],
  preview: {
    select: {
      title: "caption",
      media: "image",
      category: "category",
    },
    prepare({ title, media, category }) {
      return {
        title: title || "Untitled",
        subtitle: category,
        media,
      };
    },
  },
});
```

- [ ] **Step 3: Create SiteSettings singleton schema**

Create `sanity/schema/site-settings.ts`:

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
      initialValue: "The Real Silver Lining Band",
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      initialValue: "Classic rock from the golden era",
    }),
    defineField({
      name: "bio",
      title: "Bio",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "heroImage",
      title: "Hero Background Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "featuredVideoUrl",
      title: "Featured YouTube Video URL",
      type: "url",
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

- [ ] **Step 4: Create schema barrel export**

Create `sanity/schema/index.ts`:

```typescript
import { show } from "./show";
import { galleryImage } from "./gallery-image";
import { siteSettings } from "./site-settings";

export const schemaTypes = [show, galleryImage, siteSettings];
```

- [ ] **Step 5: Create Sanity config**

Create `sanity/sanity.config.ts`:

```typescript
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./schema";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export default defineConfig({
  name: "silver-lining-band",
  title: "Silver Lining Band",
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Site Settings")
              .child(
                S.document()
                  .schemaType("siteSettings")
                  .documentId("siteSettings")
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (listItem) => !["siteSettings"].includes(listItem.getId()!)
            ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
});
```

- [ ] **Step 6: Create Sanity CLI config**

Create `sanity/sanity.cli.ts`:

```typescript
import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
```

- [ ] **Step 7: Create Sanity Studio page**

Create `src/app/studio/[[...tool]]/page.tsx`:

```typescript
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity/sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add Sanity schemas (Show, GalleryImage, SiteSettings) and Studio embed"
```

---

## Task 4: Sanity Client + GROQ Queries

**Files:**
- Create: `src/lib/sanity/client.ts`
- Create: `src/lib/sanity/queries.ts`
- Create: `src/lib/sanity/image.ts`

- [ ] **Step 1: Create Sanity client**

Create `src/lib/sanity/client.ts`:

```typescript
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2026-04-29",
  useCdn: true,
});
```

- [ ] **Step 2: Create GROQ queries**

Create `src/lib/sanity/queries.ts`:

```typescript
import { groq } from "next-sanity";

export const upcomingShowsQuery = groq`
  *[_type == "show" && date >= now()] | order(date asc)
`;

export const upcomingShowsPreviewQuery = groq`
  *[_type == "show" && date >= now()] | order(date asc) [0...3]
`;

export const pastShowsQuery = groq`
  *[_type == "show" && date < now()] | order(date desc)
`;

export const galleryImagesQuery = groq`
  *[_type == "galleryImage"] | order(_createdAt desc)
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    bandName,
    tagline,
    bio,
    heroImage,
    featuredVideoUrl,
    contactEmail,
    socialLinks
  }
`;
```

- [ ] **Step 3: Create image URL builder**

Create `src/lib/sanity/image.ts`:

```typescript
import imageUrlBuilder from "@sanity/image-url";
import { client } from "./client";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add Sanity client, GROQ queries, and image URL builder"
```

---

## Task 5: Root Layout + Navbar + Footer

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/components/layout/navbar.tsx`
- Create: `src/components/layout/footer.tsx`

- [ ] **Step 1: Create Navbar component**

Create `src/components/layout/navbar.tsx`:

```typescript
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const scrollLinks = [
  { label: "About", href: "#about" },
  { label: "Music", href: "#music" },
  { label: "Gallery", href: "#gallery" },
];

const pageLinks = [
  { label: "Shows", href: "/shows" },
  { label: "Book Us", href: "/book" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollLink = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-surface/80 backdrop-blur-md border-b border-border-accent" : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-widest text-silver">
          SILVER LINING
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-6 text-sm md:flex">
          {scrollLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleScrollLink(e, link.href)}
              className="text-muted transition-colors hover:text-silver"
            >
              {link.label}
            </a>
          ))}
          {pageLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-silver-light font-medium transition-colors hover:text-silver"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`h-0.5 w-6 bg-silver transition-transform ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-silver transition-opacity ${mobileOpen ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-silver transition-transform ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          className="border-t border-border-subtle bg-surface/95 backdrop-blur-md md:hidden"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <div className="flex flex-col gap-4 px-6 py-4">
            {scrollLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleScrollLink(e, link.href)}
                className="text-muted transition-colors hover:text-silver"
              >
                {link.label}
              </a>
            ))}
            {pageLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-silver-light font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
```

- [ ] **Step 2: Create Footer component**

Create `src/components/layout/footer.tsx`:

```typescript
import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";

interface FooterProps {
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
  };
}

const socialIcons = [
  { key: "instagram" as const, icon: Instagram, label: "Instagram" },
  { key: "facebook" as const, icon: Facebook, label: "Facebook" },
  { key: "youtube" as const, icon: Youtube, label: "YouTube" },
];

export function Footer({ socialLinks }: FooterProps) {
  return (
    <footer className="border-t border-border-accent bg-[#050508] px-6 py-12">
      <div className="mx-auto max-w-6xl text-center">
        {/* Social links */}
        <div className="mb-6 flex justify-center gap-6">
          {socialIcons.map(({ key, icon: Icon, label }) => {
            const url = socialLinks?.[key];
            if (!url) return null;
            return (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors hover:text-silver"
                aria-label={label}
              >
                <Icon className="h-5 w-5" />
              </a>
            );
          })}
        </div>

        {/* Copyright */}
        <p className="text-xs text-muted">
          &copy; {new Date().getFullYear()} The Real Silver Lining Band. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Install lucide-react for icons**

```bash
cd /Users/jacobliberty/Documents/GitHub/SilverLiningBand
npm install lucide-react
```

- [ ] **Step 4: Update root layout**

Replace `src/app/layout.tsx` with:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { client } from "@/lib/sanity/client";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "The Real Silver Lining Band",
  description:
    "Classic rock covers from the golden era — Fleetwood Mac, Eagles, Beatles & more. Book us for your next event.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await client.fetch(siteSettingsQuery);

  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer socialLinks={settings?.socialLinks} />
      </body>
    </html>
  );
}
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add root layout with Navbar and Footer components"
```

---

## Task 6: Homepage Sections

**Files:**
- Create: `src/components/home/hero.tsx`
- Create: `src/components/home/about.tsx`
- Create: `src/components/home/upcoming-shows.tsx`
- Create: `src/components/home/music.tsx`
- Create: `src/components/home/gallery.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Create Hero component**

Create `src/components/home/hero.tsx`:

```typescript
"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface HeroProps {
  bandName: string;
  tagline: string;
  heroImage?: SanityImageSource;
}

export function Hero({ bandName, tagline, heroImage }: HeroProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background image */}
      {heroImage && (
        <Image
          src={urlFor(heroImage).width(1920).quality(80).url()}
          alt={bandName}
          fill
          className="object-cover"
          priority
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-surface/70 via-surface/50 to-surface" />

      {/* Content */}
      <motion.div
        className="relative z-10 px-6 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-5xl font-bold tracking-wide text-white sm:text-7xl">
          {bandName}
        </h1>
        <p className="mt-4 text-lg text-silver">{tagline}</p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button asChild size="lg" className="bg-silver text-surface hover:bg-silver-light">
            <Link href="/book">Book Us</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-border-accent text-silver hover:bg-surface-overlay"
          >
            <Link href="/shows">See Shows</Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Create About component**

Create `src/components/home/about.tsx`:

```typescript
"use client";

import { motion } from "framer-motion";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

interface AboutProps {
  bio?: PortableTextBlock[];
}

export function About({ bio }: AboutProps) {
  return (
    <section id="about" className="bg-surface px-6 py-24">
      <motion.div
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-silver">
          About
        </p>
        <h2 className="mt-2 text-center text-3xl font-light">
          The Silver Lining Story
        </h2>

        <div className="mt-8 text-muted leading-relaxed [&_p]:mb-4">
          {bio ? (
            <PortableText value={bio} />
          ) : (
            <p>
              We&apos;re a classic rock cover band bringing the golden era back
              to life — Fleetwood Mac, Eagles, Beatles, and more. Every show is
              a celebration of the music that defined a generation.
            </p>
          )}
        </div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 3: Install @portabletext/react**

```bash
cd /Users/jacobliberty/Documents/GitHub/SilverLiningBand
npm install @portabletext/react
```

- [ ] **Step 4: Create UpcomingShows component**

Create `src/components/home/upcoming-shows.tsx`:

```typescript
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

interface Show {
  _id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  ticketUrl?: string;
}

interface UpcomingShowsProps {
  shows: Show[];
}

export function UpcomingShows({ shows }: UpcomingShowsProps) {
  return (
    <section id="shows" className="bg-surface-raised px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-silver">
          Upcoming
        </p>
        <h2 className="mt-2 text-center text-3xl font-light">Catch Us Live</h2>

        <div className="mt-10 flex flex-col gap-3">
          {shows.length === 0 && (
            <p className="text-center text-muted">No upcoming shows — check back soon!</p>
          )}
          {shows.map((show, i) => (
            <motion.div
              key={show._id}
              className="flex items-center justify-between rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.03)] px-5 py-4"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div>
                <p className="text-xs font-semibold uppercase text-silver">
                  {new Date(show.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <p className="mt-1 text-silver-light">{show.title}</p>
                <p className="text-sm text-muted">
                  {show.venue}, {show.city} &middot;{" "}
                  {new Date(show.date).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {show.ticketUrl && (
                <a
                  href={show.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded border border-border-accent px-4 py-2 text-sm text-silver transition-colors hover:bg-surface-overlay"
                >
                  Details
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/shows"
            className="text-sm text-silver transition-colors hover:text-silver-light"
          >
            See All Shows &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create Music component**

Create `src/components/home/music.tsx`:

```typescript
"use client";

import { motion } from "framer-motion";

interface MusicProps {
  featuredVideoUrl?: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function Music({ featuredVideoUrl }: MusicProps) {
  const embedUrl = featuredVideoUrl
    ? getYouTubeEmbedUrl(featuredVideoUrl)
    : null;

  return (
    <section id="music" className="bg-surface px-6 py-24">
      <motion.div
        className="mx-auto max-w-3xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-silver">
          Listen
        </p>
        <h2 className="mt-2 text-center text-3xl font-light">Hear Us Play</h2>

        <div className="mt-10 overflow-hidden rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.03)]">
          {embedUrl ? (
            <div className="aspect-video">
              <iframe
                src={embedUrl}
                title="Featured performance"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center text-muted">
              Video coming soon
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-muted">
          More performances on our socials &mdash; links in the footer
        </p>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 6: Create Gallery component**

Create `src/components/home/gallery.tsx`:

```typescript
"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { urlFor } from "@/lib/sanity/image";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

interface GalleryImageItem {
  _id: string;
  image: SanityImageSource;
  caption?: string;
}

interface GalleryProps {
  images: GalleryImageItem[];
}

export function Gallery({ images }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImageItem | null>(null);

  return (
    <section id="gallery" className="bg-surface-raised px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-silver">
          Photos
        </p>
        <h2 className="mt-2 text-center text-3xl font-light">Gallery</h2>

        <div className="mt-10 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {images.map((item, i) => (
            <motion.button
              key={item._id}
              className="group relative aspect-square overflow-hidden rounded-md"
              onClick={() => setSelectedImage(item)}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <Image
                src={urlFor(item.image).width(400).height(400).url()}
                alt={item.caption || "Band photo"}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </motion.button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute right-4 top-4 text-white hover:text-silver"
              onClick={() => setSelectedImage(null)}
              aria-label="Close lightbox"
            >
              <X className="h-8 w-8" />
            </button>
            <motion.div
              className="relative max-h-[85vh] max-w-[85vw]"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={urlFor(selectedImage.image).width(1200).quality(90).url()}
                alt={selectedImage.caption || "Band photo"}
                width={1200}
                height={800}
                className="rounded-lg object-contain"
              />
              {selectedImage.caption && (
                <p className="mt-2 text-center text-sm text-muted">
                  {selectedImage.caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
```

- [ ] **Step 7: Assemble Home page**

Replace `src/app/page.tsx` with:

```typescript
import { client } from "@/lib/sanity/client";
import {
  siteSettingsQuery,
  upcomingShowsPreviewQuery,
  galleryImagesQuery,
} from "@/lib/sanity/queries";
import { Hero } from "@/components/home/hero";
import { About } from "@/components/home/about";
import { UpcomingShows } from "@/components/home/upcoming-shows";
import { Music } from "@/components/home/music";
import { Gallery } from "@/components/home/gallery";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, shows, gallery] = await Promise.all([
    client.fetch(siteSettingsQuery),
    client.fetch(upcomingShowsPreviewQuery),
    client.fetch(galleryImagesQuery),
  ]);

  return (
    <>
      <Hero
        bandName={settings?.bandName || "The Real Silver Lining Band"}
        tagline={settings?.tagline || "Classic rock from the golden era"}
        heroImage={settings?.heroImage}
      />
      <About bio={settings?.bio} />
      <UpcomingShows shows={shows || []} />
      <Music featuredVideoUrl={settings?.featuredVideoUrl} />
      <Gallery images={gallery || []} />
    </>
  );
}
```

- [ ] **Step 8: Commit**

```bash
git add .
git commit -m "feat: add homepage with Hero, About, Shows, Music, and Gallery sections"
```

---

## Task 7: /shows Page

**Files:**
- Create: `src/app/shows/page.tsx`
- Create: `src/components/shows/show-card.tsx`
- Create: `src/components/shows/show-list.tsx`

- [ ] **Step 1: Create ShowCard component**

Create `src/components/shows/show-card.tsx`:

```typescript
interface ShowCardProps {
  title: string;
  date: string;
  venue: string;
  city: string;
  ticketUrl?: string;
  description?: string;
}

export function ShowCard({ title, date, venue, city, ticketUrl, description }: ShowCardProps) {
  const dateObj = new Date(date);

  return (
    <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.03)] px-5 py-4">
      <div>
        <p className="text-xs font-semibold uppercase text-silver">
          {dateObj.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="mt-1 text-lg text-silver-light">{title}</p>
        <p className="text-sm text-muted">
          {venue}, {city} &middot;{" "}
          {dateObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
        {description && (
          <p className="mt-2 text-sm text-muted">{description}</p>
        )}
      </div>
      {ticketUrl && (
        <a
          href={ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded border border-border-accent px-4 py-2 text-sm text-silver transition-colors hover:bg-surface-overlay"
        >
          Tickets / Info
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create ShowList component**

Create `src/components/shows/show-list.tsx`:

```typescript
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShowCard } from "./show-card";

interface Show {
  _id: string;
  title: string;
  date: string;
  venue: string;
  city: string;
  ticketUrl?: string;
  description?: string;
}

interface ShowListProps {
  upcoming: Show[];
  past: Show[];
}

export function ShowList({ upcoming, past }: ShowListProps) {
  const [showPast, setShowPast] = useState(false);

  return (
    <div>
      {/* Upcoming */}
      <div className="flex flex-col gap-3">
        {upcoming.length === 0 && (
          <p className="text-center text-muted py-8">
            No upcoming shows scheduled — check back soon!
          </p>
        )}
        {upcoming.map((show, i) => (
          <motion.div
            key={show._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <ShowCard {...show} />
          </motion.div>
        ))}
      </div>

      {/* Past shows toggle */}
      {past.length > 0 && (
        <div className="mt-12">
          <button
            onClick={() => setShowPast(!showPast)}
            className="w-full text-center text-sm text-muted transition-colors hover:text-silver"
          >
            {showPast ? "Hide" : "Show"} Past Shows ({past.length})
          </button>

          {showPast && (
            <motion.div
              className="mt-4 flex flex-col gap-3 opacity-60"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 0.6, height: "auto" }}
            >
              {past.map((show) => (
                <ShowCard key={show._id} {...show} />
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create Shows page**

Create `src/app/shows/page.tsx`:

```typescript
import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { upcomingShowsQuery, pastShowsQuery } from "@/lib/sanity/queries";
import { ShowList } from "@/components/shows/show-list";

export const metadata: Metadata = {
  title: "Shows | The Real Silver Lining Band",
  description: "See where The Real Silver Lining Band is playing next.",
};

export const revalidate = 60;

export default async function ShowsPage() {
  const [upcoming, past] = await Promise.all([
    client.fetch(upcomingShowsQuery),
    client.fetch(pastShowsQuery),
  ]);

  return (
    <div className="min-h-screen bg-surface px-6 pt-28 pb-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-silver">
          Live Shows
        </p>
        <h1 className="mt-2 text-center text-4xl font-light text-silver-light">
          Catch Us Live
        </h1>

        <div className="mt-12">
          <ShowList upcoming={upcoming || []} past={past || []} />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add .
git commit -m "feat: add /shows page with upcoming and past show lists"
```

---

## Task 8: /book Page + Resend Server Action

**Files:**
- Create: `src/app/book/page.tsx`
- Create: `src/components/book/booking-form.tsx`
- Create: `src/app/actions/booking.ts`

- [ ] **Step 1: Create booking Server Action**

Create `src/app/actions/booking.ts`:

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
```

- [ ] **Step 2: Create BookingForm component**

Create `src/components/book/booking-form.tsx`:

```typescript
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitBooking } from "@/app/actions/booking";

export function BookingForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      eventType: formData.get("eventType") as string,
      date: formData.get("date") as string,
      message: formData.get("message") as string,
    };

    const result = await submitBooking(data);

    if (result.success) {
      setStatus("success");
      (e.target as HTMLFormElement).reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        className="rounded-lg border border-border-accent bg-surface-raised p-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="text-xl text-silver-light">Thanks for reaching out!</h3>
        <p className="mt-2 text-muted">
          We&apos;ll get back to you as soon as possible.
        </p>
        <Button
          onClick={() => setStatus("idle")}
          variant="outline"
          className="mt-4 border-border-accent text-silver"
        >
          Send Another
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <Label htmlFor="name" className="text-silver-light">Name</Label>
        <Input
          id="name"
          name="name"
          required
          placeholder="Your name"
          className="mt-1 border-border-subtle bg-surface-raised text-white placeholder:text-muted"
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-silver-light">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="your@email.com"
          className="mt-1 border-border-subtle bg-surface-raised text-white placeholder:text-muted"
        />
      </div>

      <div>
        <Label htmlFor="eventType" className="text-silver-light">Event Type</Label>
        <Input
          id="eventType"
          name="eventType"
          required
          placeholder="Wedding, Corporate, Festival, Private Party..."
          className="mt-1 border-border-subtle bg-surface-raised text-white placeholder:text-muted"
        />
      </div>

      <div>
        <Label htmlFor="date" className="text-silver-light">Preferred Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          required
          className="mt-1 border-border-subtle bg-surface-raised text-white placeholder:text-muted"
        />
      </div>

      <div>
        <Label htmlFor="message" className="text-silver-light">Tell us about your event</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="Venue, expected guests, any special requests..."
          className="mt-1 border-border-subtle bg-surface-raised text-white placeholder:text-muted"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}

      <Button
        type="submit"
        disabled={status === "sending"}
        className="w-full bg-silver text-surface hover:bg-silver-light"
      >
        {status === "sending" ? "Sending..." : "Send Inquiry"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 3: Create Book page**

Create `src/app/book/page.tsx`:

```typescript
import type { Metadata } from "next";
import { BookingForm } from "@/components/book/booking-form";

export const metadata: Metadata = {
  title: "Book Us | The Real Silver Lining Band",
  description:
    "Book The Real Silver Lining Band for your next event — weddings, corporate events, private parties, and more.",
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-surface px-6 pt-28 pb-16">
      <div className="mx-auto max-w-xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-silver">
          Inquiries
        </p>
        <h1 className="mt-2 text-center text-4xl font-light text-silver-light">
          Book Us
        </h1>
        <p className="mt-4 text-center text-muted">
          Planning an event? We&apos;d love to be part of it. Fill out the form
          below and we&apos;ll get back to you.
        </p>

        <div className="mt-10">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add BOOKING_EMAIL to .env.local.example**

Append to `.env.local.example`:

```env

# Booking
BOOKING_EMAIL=
```

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "feat: add /book page with booking form and Resend server action"
```

---

## Task 9: ISR Revalidation Webhook

**Files:**
- Create: `src/app/api/revalidate/route.ts`

- [ ] **Step 1: Create revalidation API route**

Create `src/app/api/revalidate/route.ts`:

```typescript
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (secret !== process.env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  try {
    revalidatePath("/");
    revalidatePath("/shows");

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err) {
    console.error("Revalidation failed:", err);
    return NextResponse.json(
      { message: "Error revalidating" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add .
git commit -m "feat: add ISR revalidation webhook for Sanity"
```

---

## Task 10: Next.js Config + Final Wiring

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Update Next.js config for Sanity images**

Replace `next.config.ts` with:

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

- [ ] **Step 2: Verify the project builds**

```bash
cd /Users/jacobliberty/Documents/GitHub/SilverLiningBand
npm run build
```

Expected: Build succeeds (Sanity queries will return null without env vars, but components handle null gracefully with fallback content).

- [ ] **Step 3: Commit**

```bash
git add .
git commit -m "feat: configure Next.js for Sanity image CDN, verify build"
```

---

## Summary

| Task | What It Builds | Files |
|------|---------------|-------|
| 1 | Next.js project + git | Project scaffold |
| 2 | Dependencies + theme | Tailwind config, shadcn/ui |
| 3 | Sanity schemas + Studio | 6 Sanity files + Studio page |
| 4 | Sanity client + queries | 3 lib files |
| 5 | Layout + Nav + Footer | 3 component files + layout |
| 6 | Homepage sections | 5 components + page |
| 7 | /shows page | 3 files |
| 8 | /book page + Resend | 3 files |
| 9 | ISR webhook | 1 API route |
| 10 | Config + build verify | next.config.ts |
