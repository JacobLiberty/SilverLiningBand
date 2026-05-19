interface Show {
  _id: string;
  title: string;
  date: string;
  venue: string;
  address?: string;
  city?: string;
  description?: string;
}

export function MusicGroupJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Silver Lining Band",
    url: "https://silverliningband.ca",
    description:
      "Ottawa's classic rock cover band performing Fleetwood Mac, Eagles, Beatles & more at weddings, corporate events, and venues across the Ottawa-Gatineau area.",
    genre: ["Classic Rock", "Rock", "Pop"],
    areaServed: {
      "@type": "City",
      name: "Ottawa",
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: "Ontario",
        containedInPlace: {
          "@type": "Country",
          name: "Canada",
        },
      },
    },
    location: {
      "@type": "City",
      name: "Ottawa",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    makesOffer: {
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: "Live Music Performance",
        description:
          "Live classic rock cover band for weddings, corporate events, private parties, fundraisers, and venue performances in Ottawa and the surrounding area.",
        areaServed: ["Ottawa", "Gatineau", "Ottawa-Gatineau", "Eastern Ontario"],
      },
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export function EventsJsonLd({ shows }: { shows: Show[] }) {
  if (!shows.length) return null;

  const jsonLd = shows.map((show) => ({
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: show.title,
    startDate: show.date,
    performer: {
      "@type": "MusicGroup",
      name: "Silver Lining Band",
      url: "https://silverliningband.ca",
    },
    location: {
      "@type": "Place",
      name: show.venue,
      address: {
        "@type": "PostalAddress",
        streetAddress: show.address || undefined,
        addressLocality: show.city || "Ottawa",
        addressRegion: "ON",
        addressCountry: "CA",
      },
    },
    description: show.description || `Silver Lining Band live at ${show.venue}`,
  }));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
