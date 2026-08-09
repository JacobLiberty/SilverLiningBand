import { groq } from "next-sanity";

export const upcomingShowsQuery = groq`
  *[_type == "show" && date >= now()] | order(date asc) {
    _id, title, date, venue, address, city, description,
    "slug": slug.current,
    "imageUrl": image.asset->url
  }
`;

export const upcomingShowsPreviewQuery = groq`
  *[_type == "show" && date >= now()] | order(date asc) [0...3] {
    _id, title, date, venue, address, city, description,
    "slug": slug.current,
    "imageUrl": image.asset->url
  }
`;

export const pastShowsQuery = groq`
  *[_type == "show" && date < now()] | order(date desc) {
    _id, title, date, venue, address, city, description,
    "slug": slug.current,
    "imageUrl": image.asset->url
  }
`;

export const showBySlugQuery = groq`
  *[_type == "show" && slug.current == $slug][0] {
    _id, title, date, venue, address, city, description, setlist,
    "slug": slug.current,
    "imageUrl": image.asset->url,
    "isPast": date < now()
  }
`;

export const showSlugsQuery = groq`
  *[_type == "show" && defined(slug.current)].slug.current
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
    "aboutImageUrl": aboutImage.asset->url,
    "heroVideoUrl": heroVideo.asset->url,
    contactEmail,
    socialLinks
  }
`;
