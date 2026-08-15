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

export const ROLE_TOTAL = '550 registrants across our first three events';

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
  note: 'Every signup is enriched from public profiles, so sponsors know which participants are worth meeting before the event.',
};

// ── Slide 04: event format + talk rules ────────────────────────────────────
export const FORMAT = {
  headline: 'Event format',
  subhead: 'Three 10-minute talks, and networking',
};

// Laid out side by side, so each has to hold one line in a 517px column.
// "Educational & informative" did not, and a rule that wraps stops looking like
// a rule; the second word was carrying nothing the first did not already say.
//
// The originals were written for speakers and read as house style ("run long
// and we'll kindly cut you off"), which is charming on a meetup slide and
// flippant in front of a sponsor. These say the same three things as
// standards.
export const RULES = [
  { n: '01', title: 'Under 10 minutes' },
  { n: '02', title: 'Educational' },
  { n: '03', title: 'Technical, no pitches' },
];

// Talks from past events, sitting beside the rules as the proof of them.
//
// The stills are our own photographs of each talk, not YouTube's auto-generated
// thumbnails, which are a frame the encoder picked and looked it. They are also
// local files rather than anything fetched at render time: a deck gets opened
// in venues with hostile wifi, and a rule about talk quality illustrated by
// three broken images is worse than no illustration.
//
// They are 4:3 and the cards are 16:9, so each is centre-cropped by objectFit.
// Check the crop when swapping one in; a speaker near the top or bottom edge
// loses their head to it.
export interface Talk {
  id: string;
  title: string;
  speaker: string;
}

export const TALKS: Talk[] = [
  { id: 'KSmPCenbWJk', title: 'What The Hell Is An Agent?', speaker: 'Misha Kolesnik' },
  { id: 'KRzbyKm1thI', title: 'Me, My Slop, and I', speaker: 'Alex Lajarre' },
  { id: 'uZo2NWtdfsc', title: 'Harness the Harness', speaker: 'Juan Cruz Fortunatti' },
];

// Imported, not referenced by path out of public/. An asset in public/ ships at
// a stable URL, so replacing one leaves Cloudflare serving the previous bytes
// for its full max-age (four hours here) and the deploy looks like it silently
// did nothing. That is exactly what happened the first time these were swapped.
// Through the bundler each file gets a content-hashed name, so changing the
// image changes the URL and no cache anywhere can hold the old one.
//
// Astro hands back ImageMetadata for images under src/; a plain Vite build
// hands back a string. Take whichever arrived.
import misha from '../../assets/talks/KSmPCenbWJk.jpg';
import alex from '../../assets/talks/KRzbyKm1thI.jpg';
import juan from '../../assets/talks/uZo2NWtdfsc.jpg';

type Imported = string | { src: string };
const url = (m: Imported) => (typeof m === 'string' ? m : m.src);

const THUMBS: Record<string, Imported> = {
  KSmPCenbWJk: misha,
  KRzbyKm1thI: alex,
  uZo2NWtdfsc: juan,
};

export const talkThumb = (id: string) => url(THUMBS[id]);
export const talkUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`;

// ── Slide 05: packages ─────────────────────────────────────────────────────
export interface Benefit {
  text: string;
  // Only the ask slide carries one. It is the benefit nobody can picture from
  // its own name, and the line that turns a logo placement into a reason to
  // buy the tier.
  note?: string;
}

export interface Tier {
  name: string;
  benefits: Benefit[];
  prices: { period: string; price: string; note?: string }[];
  featured: boolean;
}

export const TIERS: Tier[] = [
  {
    name: 'Partner',
    benefits: [
      { text: 'Logo on the event page, recaps and intro slides' },
      { text: 'Mention during the event opening' },
      { text: 'Merch and swag distribution at the event' },
      {
        text: 'One ask slide, presented by the organizer',
        // Held to one line at 22px in a 702px column. Two lines here is what
        // pushed the panel into the word 'Packages'.
        note: 'Roles you are hiring for, a raise, a partner you are seeking',
      },
      { text: 'Access to the enriched attendee list' },
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
      { text: 'Logo on the event page, recaps and intro slides' },
      { text: 'Mention during the event opening' },
      { text: 'Merch and swag distribution at the event' },
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

// Slide 06 is the meetup deck's closing slide, reused as-is. Its LINKS live in
// ../slides/deck.ts; a second copy here was dead the moment SponsorDeck started
// importing the component rather than rebuilding it.
