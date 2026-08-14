import { C, PAD, type SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline, Subhead } from '../slides/parts';
import { FUNNEL, ROLE_TOTAL, ROLES } from './content';

// ─────────────────────────────────────────────────────────────────────────
// 03 — Who is in the room.
//
// Percentages of one whole, so one bar divided into four — not four bars.
// Separate bars encode "how big is each", which is the question a sponsor is
// not asking; a single divided bar encodes "what is this room made of", which
// is the one they are. It also makes the four numbers visibly sum to
// everything, so nothing looks omitted.
//
// Ordered largest first except that Other sits ahead of Investors: it is a
// residual rather than a category, and ending on it would leave the eye on the
// least meaningful segment. Investors last means the smallest slice is against
// a rounded end, where a 5% sliver still reads as deliberate.
//
// The legend carries the percentages instead of labelling segments in place —
// at 5% the Investors band is 83px wide, which fits neither a word nor a
// number at any size readable from the back of a room.
// ─────────────────────────────────────────────────────────────────────────

const TRACK_W = 1920 - PAD * 2;
const BAR_H = 116;

// All four are opaque. Other was a white wash at 26% and the animated field
// showed straight through it, so the one segment that is meant to recede read
// as a hole in the bar instead of a part of it.
const SEGMENT_COLOR: Record<string, string> = {
  Founders: C.brightBlue,
  Engineers: C.periwinkle,
  Other: '#39406B',
  Investors: C.magenta,
};

export function Background({ active }: SlideProps) {
  return <Backdrop fade="left" motion={20} paused={!active} />;
}

export function Content() {
  return (
    <Frame>
      <Headline>Who&rsquo;s in the room</Headline>
      <Subhead>{ROLE_TOTAL} registrants across three events</Subhead>

      <div style={{ marginTop: 'auto' }}>
        {/* one whole, divided */}
        <div style={{ display: 'flex', width: TRACK_W, height: BAR_H, borderRadius: 10, overflow: 'hidden' }}>
          {ROLES.map((r) => (
            <div key={r.label} style={{ width: `${r.pct}%`, background: SEGMENT_COLOR[r.label] }} />
          ))}
        </div>

        <div style={{ display: 'flex', width: TRACK_W, marginTop: 40 }}>
          {ROLES.map((r) => (
            <Legend key={r.label} label={r.label} pct={r.pct} color={SEGMENT_COLOR[r.label]} />
          ))}
        </div>

        {/* The stats sit on the same four columns as the legend above them, so
            the block has one grid rather than two competing ones — the label
            under Founders, the numbers under Other and Investors. */}
        <div
          style={{
            display: 'flex',
            width: TRACK_W,
            marginTop: 60,
            paddingTop: 44,
            borderTop: '1px solid rgba(244,245,255,0.14)',
          }}
        >
          <div
            style={{
              flex: 1,
              fontFamily: 'var(--font-mono)',
              fontSize: 24,
              lineHeight: 1.5,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.periwinkle,
              alignSelf: 'center',
            }}
          >
            Per event,
            <br />
            on average
          </div>
          <div style={{ flex: 1 }} />
          {FUNNEL.map((f, i) => (
            <Stat key={f.label} label={f.label} n={f.avg} emphasis={i === FUNNEL.length - 1} />
          ))}
        </div>
      </div>
    </Frame>
  );
}

/** Legend columns are equal width, not segment width. Sitting each label under
 *  its own band is the tidier idea and does not survive contact with the data:
 *  the Investors column would be 83px, which holds neither "5%" at this size
 *  nor the word beneath it. The colour chip does the matching instead. */
function Legend({ label, pct, color }: { label: string; pct: number; color: string }) {
  return (
    <div style={{ flex: 1, paddingRight: 24, minWidth: 0 }}>
      <div style={{ width: 48, height: 8, borderRadius: 4, background: color }} />
      <div
        style={{
          marginTop: 18,
          fontFamily: 'var(--font-sans)',
          fontSize: 74,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: C.white,
        }}
      >
        {pct}%
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: 'var(--font-sans)',
          fontSize: 30,
          fontWeight: 500,
          color: 'rgba(244,245,255,0.62)',
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Stat({ label, n, emphasis }: { label: string; n: number; emphasis: boolean }) {
  return (
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 92,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: '-0.03em',
          color: emphasis ? C.brightBlue : C.white,
        }}
      >
        {n}
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: 'var(--font-sans)',
          fontSize: 30,
          fontWeight: 500,
          color: 'rgba(244,245,255,0.62)',
        }}
      >
        {label}
      </div>
    </div>
  );
}
