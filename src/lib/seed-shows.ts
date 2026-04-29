export interface Show {
  _id: string;
  title: string;
  date: string;
  venue: string;
  address: string;
  city: string;
  description?: string;
}

/** Seed shows for development — replace with Sanity data once connected */
export const SEED_UPCOMING_SHOWS: Show[] = [
  {
    _id: "seed-1",
    title: "Remic Rapids",
    date: "2026-06-14T18:00:00.000Z",
    venue: "Remic Rapids Park",
    address: "Remic Rapids, Sir John A. Macdonald Pkwy, Ottawa, ON",
    city: "Ottawa, ON",
    description: "Outdoor summer series by the river. Bring a lawn chair and enjoy classic rock as the sun sets over the rapids.",
  },
  {
    _id: "seed-2",
    title: "Sonny's",
    date: "2026-06-28T20:00:00.000Z",
    venue: "Sonny's Bar & Grill",
    address: "1374 Old Montreal Rd, Cumberland, ON K4C 1E3",
    city: "Cumberland, ON",
    description: "Saturday night live music. Full setlist — Fleetwood Mac, Eagles, Beatles & more.",
  },
  {
    _id: "seed-3",
    title: "Broadhead Brewing",
    date: "2026-07-11T19:00:00.000Z",
    venue: "Broadhead Brewing Company",
    address: "73 Lorne Ave, Ottawa, ON K1S 0C2",
    city: "Ottawa, ON",
    description: "Craft beer and classic rock — what more could you want? Patio session weather permitting.",
  },
  {
    _id: "seed-4",
    title: "No Go Cafe",
    date: "2026-07-25T19:30:00.000Z",
    venue: "No Go Cafe",
    address: "264 Dalhousie St, Ottawa, ON K1N 7E6",
    city: "Ottawa, ON",
    description: "Intimate acoustic set in the heart of the ByWard Market. Limited seating — arrive early.",
  },
  {
    _id: "seed-5",
    title: "Remic Rapids",
    date: "2026-08-09T18:00:00.000Z",
    venue: "Remic Rapids Park",
    address: "Remic Rapids, Sir John A. Macdonald Pkwy, Ottawa, ON",
    city: "Ottawa, ON",
    description: "Back by popular demand. Golden hour classics by the Ottawa River.",
  },
];

export const SEED_PAST_SHOWS: Show[] = [
  {
    _id: "seed-past-1",
    title: "Homestead",
    date: "2026-03-15T20:00:00.000Z",
    venue: "The Homestead",
    address: "The Homestead, Ottawa, ON",
    city: "Ottawa, ON",
    description: "Great night with a packed house. Thanks to everyone who came out!",
  },
  {
    _id: "seed-past-2",
    title: "Sonny's",
    date: "2026-02-22T20:00:00.000Z",
    venue: "Sonny's Bar & Grill",
    address: "1374 Old Montreal Rd, Cumberland, ON K4C 1E3",
    city: "Cumberland, ON",
  },
];
