import type { ReactNode } from "react";

const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

/** Split text on URLs and render each URL as a clickable link. */
export function linkifyText(text: string): ReactNode[] {
  const parts = text.split(URL_PATTERN);

  return parts.map((part, i) => {
    if (part.match(URL_PATTERN)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber underline decoration-amber/40 underline-offset-2 transition-colors hover:text-amber-light"
        >
          {part}
        </a>
      );
    }
    return part;
  });
}
