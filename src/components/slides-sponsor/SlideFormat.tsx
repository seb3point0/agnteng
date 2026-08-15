import { C, PAD, type SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline, Subhead } from '../slides/parts';
import { FORMAT, RULES } from './content';

// ─────────────────────────────────────────────────────────────────────────
// 04 — Event format, with the talk rules under it. The meetup deck gives the
// rules a slide of their own because it is addressing the speakers; here they
// are evidence rather than instruction, the reason the room is worth being in
// front of, so they sit beneath the format as its supporting detail.
//
// Three across rather than three down. Each rule is now a phrase instead of a
// title and a sentence, and stacked they left three short lines adrift in a
// wide column. Side by side they read as one standard in three parts, and the
// slide stops looking like a list of complaints about speakers.
// ─────────────────────────────────────────────────────────────────────────

const GAP = 56;
const COL_W = (1920 - PAD * 2 - GAP * (RULES.length - 1)) / RULES.length;

export function Background({ active }: SlideProps) {
  return <Backdrop fade="up" motion={24} paused={!active} />;
}

export function Content() {
  return (
    <Frame>
      <Headline>{FORMAT.headline}</Headline>
      <Subhead style={{ margin: '36px 0 0', fontSize: 52, color: C.white }}>{FORMAT.subhead}</Subhead>

      <div style={{ marginTop: 'auto' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 24,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.periwinkle,
          }}
        >
          Talk rules
        </div>

        <div style={{ display: 'flex', gap: GAP, marginTop: 28 }}>
          {RULES.map((r) => (
            <div
              key={r.n}
              style={{ width: COL_W, flex: 'none', paddingTop: 32, borderTop: '1px solid rgba(244,245,255,0.14)' }}
            >
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 30, fontWeight: 600, color: C.periwinkle }}>
                {r.n}
              </div>
              <div
                style={{
                  marginTop: 20,
                  fontFamily: 'var(--font-sans)',
                  fontSize: 50,
                  fontWeight: 700,
                  lineHeight: 1.14,
                  letterSpacing: '-0.02em',
                  color: C.white,
                }}
              >
                {r.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}
