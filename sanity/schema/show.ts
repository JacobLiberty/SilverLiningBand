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
