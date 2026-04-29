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
