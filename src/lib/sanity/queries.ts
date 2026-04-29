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
