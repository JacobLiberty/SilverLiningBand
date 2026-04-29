interface ShowCardProps {
  title: string;
  date: string;
  venue: string;
  city: string;
  ticketUrl?: string;
  description?: string;
}

export function ShowCard({
  title,
  date,
  venue,
  city,
  ticketUrl,
  description,
}: ShowCardProps) {
  const dateObj = new Date(date);

  return (
    <div className="flex items-center justify-between rounded-lg border border-border-subtle bg-[rgba(255,255,255,0.03)] px-5 py-4">
      <div>
        <p className="text-xs font-semibold uppercase text-silver">
          {dateObj.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="mt-1 text-lg text-silver-light">{title}</p>
        <p className="text-sm text-muted">
          {venue}, {city} &middot;{" "}
          {dateObj.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
        {description && (
          <p className="mt-2 text-sm text-muted">{description}</p>
        )}
      </div>
      {ticketUrl && (
        <a
          href={ticketUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded border border-border-accent px-4 py-2 text-sm text-silver transition-colors hover:bg-surface-overlay"
        >
          Tickets / Info
        </a>
      )}
    </div>
  );
}
