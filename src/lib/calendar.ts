/**
 * The band's local timezone (Ottawa). Always pass this to date/time formatting
 * so show times render the same regardless of the server's or visitor's own
 * timezone — otherwise server-rendered HTML and client hydration can disagree.
 */
export const SITE_TIME_ZONE = "America/Toronto";

/** Build a Google Calendar "add event" URL */
export function buildGoogleCalendarUrl({
  title,
  date,
  venue,
  address,
  description,
}: {
  title: string;
  date: string;
  venue: string;
  address: string;
  description?: string;
}): string {
  const start = new Date(date);
  const end = new Date(start.getTime() + 3 * 60 * 60 * 1000); // assume 3-hour show

  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Silver Lining Band @ ${title}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: `${venue}, ${address}`,
    details: description
      ? `${description}\n\nhttps://silverliningband.com/shows`
      : "https://silverliningband.com/shows",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Build a Google Maps search URL from an address */
export function buildGoogleMapsUrl(address: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}
