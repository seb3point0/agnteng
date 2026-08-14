// ─────────────────────────────────────────────────────────────────────────
// Sponsorship deck — all copy and figures, in one place.
//
// Stage geometry, the palette and the slide primitives are shared with the
// meetup deck (../slides/deck.ts, ../slides/parts.tsx); only the content and
// the running order differ. Every number below comes from the registration
// data for the three events run so far — nothing here is illustrative, because
// a sponsor deck that rounds its own numbers up is the one thing that makes
// the rest of it unbelievable.
// ─────────────────────────────────────────────────────────────────────────

// ── Slide 01: title ────────────────────────────────────────────────────────
// No city pill and no venue: this deck goes to a sponsor by email, months
// before whatever event they end up on. The line that carried the date on the
// meetup deck carries the subject instead.
export const TITLE = {
  line: 'Sponsorship & Partnerships',
} as const;

// ── Slide 02: the room ─────────────────────────────────────────────────────
export const COMMUNITY = {
  headline: 'The room for agentic engineering',
  subhead: 'Founders, engineers and operators building with agents — Lisbon and Berlin',
};

export interface PastEvent {
  city: string;
  date: string;
  photo: string;
  attended: number;
}

// Dates are the registration system's, which is also where the funnel numbers
// below come from. The meetup deck says 29 May and 17 Jun for the first two;
// those are a day or two out and this is the version to trust.
//
// TODO — the July card is the only placeholder in the deck. It points at the
// city shot that used to back the meetup title slide, because no room photo
// from the 29 July event exists in the repo yet. It reads as a postcard between
// two photographs of a full room, which undercuts exactly the thing this slide
// is for. Drop a room shot in public/assets/photos/events/ and change this one
// line.
export const EVENTS: PastEvent[] = [
  { city: 'Lisbon', date: '27 May 2026', photo: '/assets/photos/events/lisbon-may2026.jpg', attended: 43 },
  { city: 'Berlin', date: '16 Jun 2026', photo: '/assets/photos/events/berlin-jun2026.jpg', attended: 70 },
  { city: 'Lisbon', date: '29 Jul 2026', photo: '/assets/photos/event-lisbon.jpg', attended: 75 },
];

// ── Slide 03: who is in the room ───────────────────────────────────────────
// The full role breakdown is ten categories long; on a slide read from the back
// of a room that is a wall of small bars. Four rows carry the same argument.
// `Other` is the remaining six roles summed — researchers, BD, marketing, PM,
// DevRel, students, press — and is labelled so, not hidden.
export const ROLES = [
  { label: 'Founders', n: 228 },
  { label: 'Engineers', n: 135 },
  { label: 'Investors', n: 28 },
  { label: 'Other', n: 128 },
] as const;

export const ROLE_TOTAL = ROLES.reduce((t, r) => t + r.n, 0); // 519
export const ROLE_NOTE = 'Other: researchers, BD, marketing, product, DevRel, students, press';

// Per-event averages across Lisbon · Berlin · Lisbon. Registered 223/214/190,
// approved 150/196/173, attended 43/70/75 — a real meetup show-rate, stated
// plainly rather than quoting registrations as if they were attendance.
export const FUNNEL = [
  { label: 'Register', avg: 209 },
  { label: 'Approved', avg: 173 },
  { label: 'In the room', avg: 63 },
] as const;

// ── Slide 04: what we know about them ──────────────────────────────────────
export const CAPTURE = {
  headline: 'What we know about them',
  subhead: 'Every registration, enriched from public profiles',
  fields: [
    { n: '01', title: 'Company', body: 'Where they work today' },
    { n: '02', title: 'Role', body: 'What they actually do there' },
    { n: '03', title: 'GitHub', body: 'What they build in the open' },
    { n: '04', title: 'LinkedIn', body: 'Track record and network' },
    { n: '05', title: 'Intent', body: 'Hiring · job-seeking · raising · co-founder' },
  ],
};

// ── Slide 05: event format + talk rules ────────────────────────────────────
export const FORMAT = {
  headline: 'Event format',
  subhead: 'Three 10-minute technical talks, then drinks and time to actually talk',
};

// All three bodies are deliberately the same length (37 chars) so they set as
// one even line each and the block reads as a set, not a paragraph.
export const RULES = [
  { n: '01', title: 'Under 10 min', body: "Run long and we'll kindly cut you off" },
  { n: '02', title: 'Make it useful', body: 'People leave having learned something' },
  { n: '03', title: 'No pitches', body: 'Save the fundraise for the networking' },
];

// ── Slide 06: packages ─────────────────────────────────────────────────────
export interface Tier {
  name: string;
  availability: string;
  benefits: string[];
  prices: { period: string; price: string; note?: string }[];
  featured: boolean;
}

export const TIERS: Tier[] = [
  {
    name: 'Partner',
    availability: 'Exclusive — 1 per period',
    benefits: [
      'Logo on the event page, recaps and intro slides',
      'Mention during the event opening',
      'Merch and swag distribution at the event',
      'A hiring or looking-for slide, presented by the organizer',
      'Enriched attendee list — opted-in registrants only',
      'Personal introductions to the people you want to meet',
    ],
    prices: [
      { period: 'Single event', price: '$1,000' },
      { period: '3 months', price: '$2,400', note: '20% off' },
      { period: '6 months', price: '$4,200', note: '30% off' },
    ],
    featured: true,
  },
  {
    name: 'Community',
    availability: 'Up to 3 per period',
    benefits: [
      'Logo on the event page, recaps and intro slides',
      'Mention during the event opening',
      'Merch and swag distribution at the event',
    ],
    prices: [
      { period: 'Single event', price: '$400' },
      { period: '3 months', price: '$950', note: '20% off' },
      { period: '6 months', price: '$1,700', note: '30% off' },
    ],
    featured: false,
  },
];

// The one thing a sponsor deck must say out loud, because every other deck in
// their inbox is selling the opposite. It is why the room shows up, so it is
// the line that protects the value of everything above it.
export const NO_STAGE_TIME = 'Sponsorship never buys stage time. Talks are selected on merit.';

// ── Slide 07: where to find us ─────────────────────────────────────────────
export const LINKS = [
  { name: 'Telegram', url: 't.me/agntacc', qr: '/assets/qr/telegram.svg' },
  { name: 'Substack', url: 'agnteng.substack.com', qr: '/assets/qr/substack.svg' },
];
