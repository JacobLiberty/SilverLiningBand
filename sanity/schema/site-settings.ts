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
