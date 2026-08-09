import { defineType, defineField } from "sanity";
import { isValidEmail } from "@/lib/validate";

export const songSuggestion = defineType({
  name: "songSuggestion",
  title: "Song Suggestion",
  type: "document",
  fields: [
    defineField({
      name: "songTitle",
      title: "Song Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "artist",
      title: "Artist",
      type: "string",
    }),
    defineField({
      name: "requesterName",
      title: "Requester Name",
      type: "string",
    }),
    defineField({
      name: "requesterEmail",
      title: "Requester Email",
      type: "string",
      validation: (rule) =>
        rule.required().custom((email) => isValidEmail(email) || "Enter a valid email address"),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "show",
      title: "Show",
      type: "reference",
      to: [{ type: "show" }],
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "songTitle",
      subtitle: "requesterEmail",
    },
  },
});
