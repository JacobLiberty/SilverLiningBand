import { defineType, defineField } from "sanity";
import { isValidEmail } from "@/lib/validate";

export const subscriber = defineType({
  name: "subscriber",
  title: "Subscriber",
  type: "document",
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) =>
        rule.required().custom((email) => isValidEmail(email) || "Enter a valid email address"),
    }),
    defineField({
      name: "source",
      title: "Signed Up Via",
      type: "string",
      options: {
        list: [
          { title: "Homepage signup", value: "homepage" },
          { title: "Footer signup", value: "footer" },
          { title: "Song suggestion form", value: "song-suggestion" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "relatedShow",
      title: "Related Show",
      type: "reference",
      to: [{ type: "show" }],
      description: "Set when the subscriber signed up via a show's song suggestion form",
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
      title: "email",
      subtitle: "source",
    },
  },
});
