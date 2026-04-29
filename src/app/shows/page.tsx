import type { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { upcomingShowsQuery, pastShowsQuery } from "@/lib/sanity/queries";
import { ShowList } from "@/components/shows/show-list";

export const metadata: Metadata = {
  title: "Shows | The Real Silver Lining Band",
  description: "See where The Real Silver Lining Band is playing next.",
};

export const revalidate = 60;

export default async function ShowsPage() {
  const [upcoming, past] = await Promise.all([
    client.fetch(upcomingShowsQuery),
    client.fetch(pastShowsQuery),
  ]);

  return (
    <div className="min-h-screen bg-surface px-6 pt-28 pb-16">
      <div className="mx-auto max-w-3xl">
        <p className="text-center text-xs font-medium uppercase tracking-[0.3em] text-silver">
          Live Shows
        </p>
        <h1 className="mt-2 text-center text-4xl font-light text-silver-light">
          Catch Us Live
        </h1>

        <div className="mt-12">
          <ShowList upcoming={upcoming || []} past={past || []} />
        </div>
      </div>
    </div>
  );
}
