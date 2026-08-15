import DeckEngine from '../slides/DeckEngine';
import type { Slide } from '../slides/deck';
import * as Title from './SlideTitle';
import * as Community from './SlideCommunity';
import * as Audience from './SlideAudience';
import * as Format from './SlideFormat';
import * as Packages from './SlidePackages';
import * as Links from '../slides/SlideLinks';

// ─────────────────────────────────────────────────────────────────────────
// The sponsorship deck. Same engine and same primitives as the meetup deck;
// only the running order and the content differ.
//
// The order is the argument: here is the room, here is who is in it and what
// we know about them, here is how the evening works, and only then what it
// costs. Packages before the audience would make it a rate card.
//
// Links is the meetup deck's closing slide reused verbatim. Telegram and
// Substack are the same two places whoever is reading this should go, and a
// second copy would be one more thing to update when a URL changes.
// ─────────────────────────────────────────────────────────────────────────

const SLIDES: Slide[] = [Title, Community, Audience, Format, Packages, Links];

export default function SponsorDeck() {
  return <DeckEngine slides={SLIDES} />;
}
