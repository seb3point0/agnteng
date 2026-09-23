// ─────────────────────────────────────────────────────────────────────────
// Per-meetup content for the Lisbon — 2026-09-23 deck. Same split as
// ../slides/content.ts: geometry, palette and slide primitives are shared;
// only TONIGHT, SPEAKERS, SPONSORS and the Luma event id are this meetup's own.
// ─────────────────────────────────────────────────────────────────────────

export const TONIGHT = {
  city: 'Lisbon',
  date: 'Wed 23 September 2026 · Lunar Strategy',
} as const;

// This event's Luma api_id — the supporter list on the "support" slide and
// the "who's in the room" numbers are both pulled from here (see
// src/lib/luma.ts, the page frontmatter, and src/pages/api/audience.json.ts).
// Find it via the Luma dashboard or `calendar/list-events`.
export const LUMA_EVENT_API_ID = 'evt-S0uIAjkttvEDJ6Z';

// Public registration page — safe to ship to the client, unlike the api key.
// Used on the "support" slide to link the ticket screenshot back to Luma.
export const LUMA_EVENT_URL = 'https://luma.com/kqlbak7w';

// Event start, from Luma's own start_at. Gates the "who's in the room" slide:
// before this instant it shows everyone registered, from this instant on it
// switches to checked-in guests only. See getEventAudience in src/lib/luma.ts.
export const LUMA_EVENT_START_AT = '2026-09-23T18:00:00.000Z';

export interface Sponsor {
  name: string;
  // A finished, full-slide artwork under /assets. When set, it IS the slide —
  // the name/ask/cta/QR composition below is skipped entirely and the image
  // fills the stage. Authored 16:9; see SlideSponsor.tsx for how a projector
  // that isn't 16:9 is handled.
  fullBleed: string | null;
  // The composed-slide fields. Only read when fullBleed is null. Image paths
  // under /assets; each falls back to a labelled placeholder box when unset.
  logo: string | null;
  screenshot: string | null;
  // What they need from the room: hiring, raising, intros, "try the product" —
  // whatever the pitch is this month.
  ask: string;
  // Where the room should go. `text` is the bare domain printed on the slide;
  // `href` is what the link and the generated QR code actually point at, so
  // any tracking parameters go there and stay off the slide.
  cta: { text: string; href: string };
}

// This month's sponsors — one slide per entry, in order. Swap or extend for
// whoever sponsors next month.
export const SPONSORS: Sponsor[] = [
  {
    name: 'HackMeridian',
    // HackMeridian supplied a finished slide, so it replaces the composition
    // wholesale. The artwork carries its own QR, and that QR decodes to the
    // same tracked url as cta.href below — verified, not assumed — so nothing
    // is lost by not drawing ours.
    fullBleed: '/assets/sponsors/hackmeridian-slide.png',
    logo: null,
    screenshot: '/assets/sponsors/hackmeridian-screenshot.jpeg',
    ask: "Stellar's annual hackathon is happening October 25–26 in Lisbon. For two days, 500 builders will hack to claim a piece of the $30,000 prize pool.",
    cta: {
      text: 'hackmeridian.com',
      href: 'https://www.hackmeridian.com/?utm_source=agentic_engineering&utm_medium=events&utm_campaign=activations',
    },
  },
];

// Same copy as the sponsorship deck's slide 02 — a real sentence with a real
// verb, not the meetup deck's fragment-style subhead.
export const COMMUNITY = {
  headline: 'The room for agentic engineering',
  subhead:
    'Agentic Engineering is for people building software, infrastructure and companies with agentic workflows. We have met every month since May 2026.',
};

// Six image slots, not a dated event list — just the room. Add a path to
// fill one in; leave it null for a placeholder box. See SlideCommunity.tsx.
export const COMMUNITY_PHOTOS: (string | null)[] = [
  '/assets/photos/community/slide2-speaker-mic.jpg',
  '/assets/photos/community/slide2-group-photo.jpg',
  '/assets/photos/events/lisbon-may2026.jpg',
  '/assets/photos/community/slide2-audience.jpg',
  '/assets/photos/community/slide2-laptop-demo-flipped-v2.jpg',
  '/assets/photos/community/slide2-harness-talk.jpg',
];

export interface Speaker {
  name: string;
  // Their role, e.g. "Founder, Acme" — not the talk title.
  title: string;
  // Image path under /assets, or null for a placeholder headshot.
  photo: string | null;
}

// Swapped in each month. See SlideAudience.tsx.
export const SPEAKERS: Speaker[] = [
  { name: 'Tim Haldorsson', title: 'CEO, Lunar Strategy', photo: '/assets/speakers/tim-haldorsson.jpg' },
  {
    name: 'Doris Hernandez Argueta',
    title: 'Co-Founder, Altana Network',
    photo: '/assets/speakers/doris-hernandez-argueta.jpg',
  },
  { name: 'Jeremy Healsmith', title: 'Co-Founder, Pravi', photo: '/assets/speakers/jeremy-healsmith.png' },
];
