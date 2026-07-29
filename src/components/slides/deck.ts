import type { ReactNode } from 'react';
import type { OverlayAssets } from '../animation-builder/overlay';

// ─────────────────────────────────────────────────────────────────────────
// Deck constants + content. Content sizes are authored in fixed px against a
// 1920×1080 stage; SlideDeck applies a single CSS transform to fit it to the
// viewport. See parts.tsx for the background/content layer split.
// ─────────────────────────────────────────────────────────────────────────

export const STAGE_W = 1920;
export const STAGE_H = 1080;

/** Slide gutter. All content lives inside this margin. */
export const PAD = 128;

/** What SlideDeck hands every slide layer. */
export interface SlideProps {
  active: boolean; // drives `paused` on any <Animation> the slide owns
  assets: OverlayAssets; // preloaded logo SVGs, hoisted to the deck
  fontsReady: boolean;
  started: boolean; // false until the first key/click — gates the start hint
}

/** A slide is a full-viewport backdrop plus a 16:9 content composition. */
export interface Slide {
  Background: (p: SlideProps) => ReactNode;
  Content: (p: SlideProps) => ReactNode;
}

// Brand palette, duplicated here as plain hex because slides paint onto canvas
// and inline styles as often as they use Tailwind classes.
export const C = {
  navy: '#05071E',
  panelNavy: '#0B0E2A',
  white: '#F4F5FF',
  blue: '#1E2BE6',
  brightBlue: '#3A4DFF',
  periwinkle: '#B5A6FF',
  magenta: '#ED4BA0',
  yellow: '#F9C835',
} as const;

// ── Tonight ────────────────────────────────────────────────────────────────
export const TONIGHT = {
  city: 'Lisbon',
  date: 'Wed 29 July 2026 · The Nest',
} as const;

// ── Slide 02: the community ────────────────────────────────────────────────
// Cities stay out of the subhead — the cards underneath already say Lisbon and
// Berlin. Phrasing echoes the Substack's own positioning ("people building
// software, infrastructure, and companies with agentic workflows").
export const COMMUNITY = {
  headline: 'The room for agentic engineering',
  subhead: '500+ builders and founders shipping with agents',
};

export interface PastEvent {
  city: string;
  date: string;
  photo: string;
}

export const EVENTS: PastEvent[] = [
  { city: 'Lisbon', date: '29 May 2026', photo: '/assets/photos/events/lisbon-may2026.jpg' },
  { city: 'Berlin', date: '17 Jun 2026', photo: '/assets/photos/events/berlin-jun2026.jpg' },
];

// ── Slide 03: where to find us ─────────────────────────────────────────────
export const LINKS = [
  { name: 'Telegram', url: 't.me/agntacc', qr: '/assets/qr/telegram.svg' },
  { name: 'Substack', url: 'agnteng.substack.com', qr: '/assets/qr/substack.svg' },
];

// ── Slide 04: how to contribute ────────────────────────────────────────────
export const ASKS = [
  { n: '01', title: 'Organize', body: 'Meetups and events' },
  { n: '02', title: 'Build', body: 'Website and tools' },
  { n: '03', title: 'Voice', body: 'Social and community' },
  { n: '04', title: 'Teach', body: 'Content, resources, newsletter' },
  { n: '05', title: 'Support', body: 'Partners, sponsors, venues' },
];

// ── Talk rules ─────────────────────────────────────────────────────────────
// All three bodies are deliberately the same length (37 chars) so they set as
// one even line each and the block reads as a set, not a paragraph.
export const RULES = [
  { n: '01', title: 'Under ten minutes', body: "Run long and we'll kindly cut you off" },
  { n: '02', title: 'Teach something', body: 'People leave having learned something' },
  { n: '03', title: 'No pitches', body: 'Save the fundraise for the networking' },
];
