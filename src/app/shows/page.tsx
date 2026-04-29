import type { Metadata } from "next";
import { client, isSanityConfigured } from "@/lib/sanity/client";
import { upcomingShowsQuery, pastShowsQuery } from "@/lib/sanity/queries";
import { ShowList } from "@/components/shows/show-list";

export const metadata: Metadata = {
  title: "Shows | Silver Lining Band",
  description: "See where Silver Lining Band is playing next.",
};

export const revalidate = 60;

export default async function ShowsPage() {
  const [upcoming, past] = isSanityConfigured
    ? await Promise.all([
        client.fetch(upcomingShowsQuery).catch(() => []),
        client.fetch(pastShowsQuery).catch(() => []),
      ])
    : [[], []];

  return (
    <div className="relative min-h-screen bg-midnight px-6 pt-28 pb-20">
      {/* Ambient background gradients */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute top-0 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-amber-glow/[0.04] blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] rounded-full bg-silver/[0.02] blur-[100px]" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        {/* Editorial header */}
        <p className="text-center font-body text-xs font-medium uppercase tracking-[0.35em] text-amber">
          Live Performances
        </p>
        <h1 className="mt-4 text-center font-display text-5xl font-light italic tracking-tight text-cream sm:text-6xl">
          On Stage
        </h1>
        <p className="mt-4 text-center font-body text-sm text-cream-dim">
          Where the music comes alive
        </p>

        {/* Ornamental divider */}
        <div className="mx-auto mt-8 flex max-w-xs items-center gap-4">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-amber/30" />
          <span className="text-amber/60" aria-hidden="true">
            &#9835;
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber/30" />
        </div>

        <div className="mt-14">
          <ShowList upcoming={upcoming || []} past={past || []} />
        </div>
      </div>
    </div>
  );
}
