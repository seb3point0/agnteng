import { C, PAD, type SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline, Subhead } from '../slides/parts';
import { COMMUNITY, EVENTS, type PastEvent } from './content';

// ─────────────────────────────────────────────────────────────────────────
// 02 — The room. The meetup deck's two-card slide with the third event added.
//
// Three cards, not two, so the card is narrower and the photo has to lose
// height with it — the meetup deck's 462 at this width would set a portrait
// crop of a room shot, which is the wrong crop for a room. Height tracks the
// original's 0.588 aspect so all three still read as the same object.
//
// Attendance sits on each card because this deck is read, not narrated: the
// meetup audience is looking at the photo while someone talks over it, and a
// sponsor is looking for the number.
// ─────────────────────────────────────────────────────────────────────────

const GAP = 40;
const CARD_W = (1920 - PAD * 2 - GAP * (EVENTS.length - 1)) / EVENTS.length;
const CARD_H = Math.round(CARD_W * 0.588);

export function Background({ active }: SlideProps) {
  return <Backdrop fade="radial" motion={22} paused={!active} />;
}

export function Content() {
  return (
    <Frame>
      <Headline>{COMMUNITY.headline}</Headline>
      <Subhead>{COMMUNITY.subhead}</Subhead>

      <div style={{ display: 'flex', gap: GAP, marginTop: 'auto' }}>
        {EVENTS.map((e) => (
          <Card key={`${e.city}-${e.date}`} event={e} />
        ))}
      </div>
    </Frame>
  );
}

function Card({ event }: { event: PastEvent }) {
  return (
    <div style={{ width: CARD_W, flex: 'none' }}>
      <div
        style={{
          position: 'relative',
          height: CARD_H,
          borderRadius: 20,
          overflow: 'hidden',
          background: C.panelNavy,
          border: '1px solid rgba(181,166,255,0.18)',
        }}
      >
        <img
          src={event.photo}
          alt={`Agentic Engineering ${event.city}, ${event.date}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>

      <div style={{ marginTop: 22, display: 'flex', alignItems: 'baseline', gap: 16 }}>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 42,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: C.white,
          }}
        >
          {event.city}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, color: C.periwinkle }}>{event.date}</span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'var(--font-mono)',
            fontSize: 22,
            color: 'rgba(244,245,255,0.55)',
          }}
        >
          {event.attended} in the room
        </span>
      </div>
    </div>
  );
}
