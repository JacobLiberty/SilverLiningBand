import { defineType, defineField, defineArrayMember } from "sanity";

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
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "Used in the show's URL. Click \"Generate\" after setting the title and date.",
      options: {
        source: (doc) =>
          `${doc.title ?? ""} ${typeof doc.date === "string" ? doc.date.slice(0, 10) : ""}`,
        maxLength: 96,
      },
      validation: (rule) =>
        rule.required().custom(async (slug, context) => {
          if (!slug?.current) return true;

          const client = context.getClient({ apiVersion: "2026-04-29" });
          const id = context.document?._id?.replace(/^drafts\./, "");

          const existing = await client.fetch(
            `count(*[_type == "show" && slug.current == $slug && !(_id in [$id, "drafts." + $id])])`,
            { slug: slug.current, id }
          );

          return existing === 0 || "This slug is already used by another show";
        }),
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
      description: "Any http(s):// links you paste in here will automatically become clickable.",
    }),
    defineField({
      name: "setlist",
      title: "Setlist",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      description:
        "Optional — songs played or planned for this show, in order. Leave empty to hide the setlist on the show's page.",
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
