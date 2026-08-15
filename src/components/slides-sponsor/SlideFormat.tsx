import { C, PAD, type SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline, Subhead } from '../slides/parts';
import { FORMAT, RULES, TALKS, type Talk, talkThumb, talkUrl } from './content';

// ─────────────────────────────────────────────────────────────────────────
// 04 — Event format. Rules down the left, past talks across the right.
//
// The rules alone were an assertion. Three real talks beside them are the
// evidence, and a sponsor who wants to check the claim can click one rather
// than take it on trust.
//
// Thumbnails use the same treatment as the event photos on slide 02, so the
// deck has one way of showing a picture. They are local files, not
// img.youtube.com: a deck gets opened on venue wifi, and three broken images
// under a rule about talk quality is worse than no images.
//
// Clicking is possible at all because pointer-events cascades: DeckEngine sets
// `pointerEvents: 'none'` on every slide layer so the whole stage is one big
// next-slide target, and a child that sets `auto` opts back in. The anchors
// stop propagation so opening a talk does not also advance the deck, and set
// their own cursor because the deck hides it once a presentation starts.
// ─────────────────────────────────────────────────────────────────────────

const COL_GAP = 72;
// 540 against a 40px rule: "Technical, no pitches" needs ~420 beside a 56px
// number column and its gap, and a rule that wraps stops looking like a rule.
// Raising the type to 44 to fill the column is what broke it the second time;
// the column has to grow with the type or not at all.
const RULES_W = 540;
const TALK_GAP = 28;
const TALK_W = (1920 - PAD * 2 - RULES_W - COL_GAP - TALK_GAP * (TALKS.length - 1)) / TALKS.length;
const TALK_H = Math.round((TALK_W * 9) / 16);

export function Background({ active }: SlideProps) {
  return <Backdrop fade="up" motion={24} paused={!active} />;
}

export function Content({ active }: SlideProps) {
  return (
    <Frame>
      <Headline>{FORMAT.headline}</Headline>
      <Subhead style={{ margin: '30px 0 0', fontSize: 44, maxWidth: 1240, color: C.white }}>
        {FORMAT.subhead}
      </Subhead>

      <div style={{ display: 'flex', gap: COL_GAP, marginTop: 'auto' }}>
        <div style={{ width: RULES_W, flex: 'none' }}>
          <div style={LABEL}>Talk rules</div>
          {RULES.map((r) => (
            <div key={r.n} style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 40 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 28,
                  fontWeight: 600,
                  color: C.periwinkle,
                  width: 56,
                  flex: 'none',
                }}
              >
                {r.n}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 40,
                  fontWeight: 700,
                  lineHeight: 1.16,
                  letterSpacing: '-0.02em',
                  color: C.white,
                }}
              >
                {r.title}
              </span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={LABEL}>Talks from past events</div>
          <div style={{ display: 'flex', gap: TALK_GAP, marginTop: 30 }}>
            {TALKS.map((t) => (
              <TalkCard key={t.id} talk={t} active={active} />
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

const LABEL = {
  fontFamily: 'var(--font-mono)',
  fontSize: 22,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: C.periwinkle,
};

function TalkCard({ talk, active }: { talk: Talk; active: boolean }) {
  return (
    <a
      href={talkUrl(talk.id)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      tabIndex={active ? 0 : -1}
      style={{
        width: TALK_W,
        flex: 'none',
        // Only the visible slide is clickable. Every slide stays mounted and
        // merely fades to opacity 0, so an always-on anchor here would be a
        // live link sitting invisibly over all six.
        pointerEvents: active ? 'auto' : 'none',
        cursor: 'pointer',
        textDecoration: 'none',
        display: 'block',
      }}
    >
      <div
        style={{
          position: 'relative',
          height: TALK_H,
          borderRadius: 14,
          overflow: 'hidden',
          background: C.panelNavy,
        }}
      >
        <img
          src={talkThumb(talk.id)}
          alt={`${talk.title} by ${talk.speaker}`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <PlayBadge />
      </div>

      {/* Two lines' worth of height whether the title needs it or not, so the
          three speaker names sit on one baseline. One title wrapping and the
          others not is the kind of half-pixel wrongness that reads as careless
          without anyone being able to say why. */}
      <div
        style={{
          marginTop: 16,
          height: 27 * 1.22 * 2,
          fontFamily: 'var(--font-sans)',
          fontSize: 27,
          fontWeight: 700,
          lineHeight: 1.22,
          letterSpacing: '-0.01em',
          color: C.white,
        }}
      >
        {talk.title}
      </div>
      <div
        style={{
          marginTop: 2,
          fontFamily: 'var(--font-mono)',
          fontSize: 21,
          color: 'rgba(244,245,255,0.55)',
        }}
      >
        {talk.speaker}
      </div>
    </a>
  );
}

/** Brand blue rather than YouTube red: the point is that a talk exists, not
 *  which platform is hosting it, and a red lozenge is the only warm thing on
 *  the entire deck. */
function PlayBadge() {
  const R = 68;
  return (
    <span
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: R,
        height: R,
        marginTop: -R / 2,
        marginLeft: -R / 2,
        borderRadius: '50%',
        background: 'rgba(5,7,30,0.62)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          width: 0,
          height: 0,
          marginLeft: 6,
          borderTop: '15px solid transparent',
          borderBottom: '15px solid transparent',
          borderLeft: `24px solid ${C.white}`,
        }}
      />
    </span>
  );
}
