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
// The subhead is the site's own hero line, extended. Cities are deliberately
// absent: the deck is read by sponsors who may be backing a city that is not
// yet on the list, and naming two of them reads as a limit rather than a
// footprint. The cards underneath say where, for anyone counting.
export const COMMUNITY = {
  headline: 'The room for agentic engineering',
  subhead:
    'A community of engineers and founders turning agents into an unfair advantage — meeting monthly, in person, to compare what actually works in production.',
};

export interface PastEvent {
  city: string;
  date: string;
  photo: string;
}

// Dates are the registration system's, which is also where the funnel numbers
// below come from. The meetup deck says 29 May and 17 Jun for the first two;
// those are a day or two out and this is the version to trust.
export const EVENTS: PastEvent[] = [
  { city: 'Lisbon', date: '27 May 2026', photo: '/assets/photos/events/lisbon-may2026.jpg' },
  { city: 'Berlin', date: '16 Jun 2026', photo: '/assets/photos/events/berlin-jun2026.jpg' },
  { city: 'Lisbon', date: '29 Jul 2026', photo: '/assets/photos/events/lisbon-jul2026.webp' },
];

// ── Slide 03: who is in the room ───────────────────────────────────────────
// Shares of one whole, so percentages rather than counts — a sponsor is buying
// the mix, and 228 means nothing without the denominator beside it.
//
// Engineers folds in researchers and DevRel (135 + 36 + 14 = 185): all three
// are the same person to a sponsor, and splitting them made the second-largest
// group look like the fourth. `Other` is the remaining five roles — BD,
// marketing, product, students, press — and is a residual, not a segment.
//
// Percentages are of 519 approved registrants and are rounded to whole numbers
// that still sum to 100. Change any count and check that they still do.
export const ROLES = [
  { label: 'Founders', pct: 44 },
  { label: 'Engineers', pct: 36 },
  { label: 'Other', pct: 15 },
  { label: 'Investors', pct: 5 },
] as const;

export const ROLE_TOTAL = 519;

// Per-event averages across Lisbon · Berlin · Lisbon. Registered 223/214/190,
// attended 43/70/75 — a real meetup show-rate, stated plainly rather than
// quoting registrations as if they were a door count.
export const FUNNEL = [
  { label: 'Register', avg: 210 },
  { label: 'Attend', avg: 63 },
] as const;

// ── Slide 04: what we know about them ──────────────────────────────────────
// Two columns: what they do on the left, where to find them on the right. Only
// Intent carries a description — the other five are their own explanation, and
// a line of body text under "GitHub" is noise that makes the slide look busier
// than it is.
export const CAPTURE = {
  headline: 'What we know about them',
  subhead: 'Every registration, enriched from public profiles',
  columns: [
    [
      { n: '01', title: 'Company' },
      { n: '02', title: 'Role' },
      { n: '03', title: 'Intent', body: 'Hiring · job-seeking · raising · co-founder' },
    ],
    [
      { n: '04', title: 'GitHub' },
      { n: '05', title: 'LinkedIn' },
      { n: '06', title: 'X' },
    ],
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
  benefits: string[];
  prices: { period: string; price: string; note?: string }[];
  featured: boolean;
}

export const TIERS: Tier[] = [
  {
    name: 'Partner',
    benefits: [
      'Logo on the event page, recaps and intro slides',
      'Mention during the event opening',
      'Merch and swag distribution at the event',
      'One dedicated slide, presented by the organizer',
      'Access to the enriched attendee list',
    ],
    prices: [
      { period: 'Single event', price: '$1,000' },
      { period: '3 months', price: '$2,400', note: '20% off' },
    ],
    featured: true,
  },
  {
    name: 'Community',
    benefits: [
      'Logo on the event page, recaps and intro slides',
      'Mention during the event opening',
      'Merch and swag distribution at the event',
    ],
    prices: [
      { period: 'Single event', price: '$400' },
      { period: '3 months', price: '$950', note: '20% off' },
    ],
    featured: false,
  },
];

// Sits as a footnote under the panels rather than as the subhead. It is still
// the line that protects everything above it, but as a headline it made the
// slide read as a disclaimer before it read as a price list.
export const NO_STAGE_TIME = 'Sponsorship never buys stage time. Talks are selected on merit.';

// ── Slide 07: where to find us ─────────────────────────────────────────────
export const LINKS = [
  { name: 'Telegram', url: 't.me/agntacc', qr: '/assets/qr/telegram.svg' },
  { name: 'Substack', url: 'agnteng.substack.com', qr: '/assets/qr/substack.svg' },
];
