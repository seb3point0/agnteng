// ─────────────────────────────────────────────────────────────────────────
// Sponsorship deck. All copy and figures, in one place.
//
// Stage geometry, the palette and the slide primitives are shared with the
// meetup deck (../slides/deck.ts, ../slides/parts.tsx); only the content and
// the running order differ.
//
// No em dashes in anything that reaches the screen. They read as machine
// writing to the people this deck is going to, and a sponsor deck cannot
// afford to look generated. Bullets are squares, not dashes, for the same
// reason. Comments are exempt; nobody reads those over your shoulder.
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
    'A community of engineers and founders turning agents into an unfair advantage. Monthly, in person, comparing what actually works in production.',
};

export interface PastEvent {
  city: string;
  date: string;
  photo: string;
}

// Dates are the registration system's. The meetup deck says 29 May and 17 Jun
// for the first two; those are a day or two out and this is the version to
// trust.
export const EVENTS: PastEvent[] = [
  { city: 'Lisbon', date: '27 May 2026', photo: '/assets/photos/events/lisbon-may2026.jpg' },
  { city: 'Berlin', date: '16 Jun 2026', photo: '/assets/photos/events/berlin-jun2026.jpg' },
  { city: 'Lisbon', date: '29 Jul 2026', photo: '/assets/photos/events/lisbon-jul2026.webp' },
];

// ── Slide 03: who is in the room, and what we track ────────────────────────
// Three segments, not four. `Other` as its own band invited the question of
// what was in it, which is not a question worth spending a slide on; folded in
// with investors it is one group a sponsor can price.
//
// Engineers includes researchers and DevRel. All three are the same person to
// a sponsor, and splitting them made the second-largest group look like the
// fourth.
//
// Percentages are the observed mix across the three events (228 founders, 185
// engineers, 106 everyone else, of 519 approved) and are rounded to whole
// numbers that still sum to 100. Change a count and check that they still do.
export const ROLES = [
  { label: 'Founders', pct: 44 },
  { label: 'Engineers', pct: 36 },
  { label: 'Investors & others', pct: 20 },
] as const;

export const ROLE_TOTAL = '550 registrants across three events';

export const FUNNEL = [
  { label: 'Registrations', avg: 180 },
  { label: 'Attendees', avg: 70 },
] as const;

// What a sponsor gets out of the list. Company and role are one line because
// they answer one question; socials cover themselves; only intent needs saying
// out loud, because it is the field that turns a list into introductions.
export const TRACK = {
  label: 'What we track',
  items: [
    { title: 'Company & role' },
    { title: 'Socials', body: 'GitHub, LinkedIn, X' },
    { title: 'Intent', body: 'Hiring, job seeking, raising, co-founder' },
  ],
  note: 'Every signup is enriched from public profiles, so sponsors know which people are worth meeting before the doors open.',
};

// ── Slide 04: event format + talk rules ────────────────────────────────────
export const FORMAT = {
  headline: 'Event format',
  subhead: 'Three 10-minute talks, and networking',
};

// Three words each, laid out side by side. The old rules were written for
// speakers and read as house style ("run long and we'll kindly cut you off"),
// which is charming on a meetup slide and flippant in front of a sponsor.
// These say the same three things as standards.
export const RULES = [
  { n: '01', title: 'Under 10 minutes' },
  { n: '02', title: 'Educational & informative' },
  { n: '03', title: 'Technical, no pitches' },
];

// ── Slide 05: packages ─────────────────────────────────────────────────────
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

// ── Slide 06: where to find us ─────────────────────────────────────────────
export const LINKS = [
  { name: 'Telegram', url: 't.me/agntacc', qr: '/assets/qr/telegram.svg' },
  { name: 'Substack', url: 'agnteng.substack.com', qr: '/assets/qr/substack.svg' },
];
