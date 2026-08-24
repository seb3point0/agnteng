import DeckEngine from '../slides/DeckEngine';
import type { Slide } from '../slides/deck';
import type { AudienceData } from '../../lib/luma';
import * as Title from './SlideTitle';
import * as Community from './SlideCommunity';
import { createAudienceSlide } from './SlideAudience';
import * as Sponsor from './SlideSponsor';
import { createSupportSlide } from './SlideSupport';
import * as Rules from './SlideRules';
import * as LinksSlide from './SlideLinks';

// ─────────────────────────────────────────────────────────────────────────
// The Lisbon — 2026-08-26 meetup deck.
//
// Title → community → who's in the room (live Luma audience mix) → this
// month's sponsor → support the meetup (Luma supporter list) → talk rules →
// where to find us. Every slide here is this deck's own — none are imported
// directly from ../slides, so nothing about the standing Jul 29 deck changes.
// ─────────────────────────────────────────────────────────────────────────

export default function SlideDeck({
  supporters,
  audience,
}: {
  supporters: string[];
  audience: AudienceData;
}) {
  const SLIDES: Slide[] = [
    Title,
    Community,
    createAudienceSlide(audience),
    Sponsor,
    createSupportSlide(supporters),
    Rules,
    LinksSlide,
  ];
  return <DeckEngine slides={SLIDES} />;
}
