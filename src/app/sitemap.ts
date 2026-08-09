import type { MetadataRoute } from "next";
import { client, isSanityConfigured } from "@/lib/sanity/client";
import { showSlugsQuery } from "@/lib/sanity/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://silverliningband.ca";

  const slugs: string[] = isSanityConfigured
    ? await client.fetch(showSlugsQuery).catch(() => [])
    : [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/shows`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...slugs.map((slug) => ({
      url: `${baseUrl}/shows/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
