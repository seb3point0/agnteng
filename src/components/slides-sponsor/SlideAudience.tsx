import { C, type SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline, Subhead } from '../slides/parts';
import { FUNNEL, ROLE_NOTE, ROLE_TOTAL, ROLES } from './content';

// ─────────────────────────────────────────────────────────────────────────
// 03 — Who is in the room. Roles on the left, the funnel on the right.
//
// One hue for every bar, because these are parts of one whole and a second
// colour would imply a second variable that does not exist. `Other` is the only
// bar that changes — it is a residual, not a segment, and drawing it at full
// strength would let it read as a fifth peer category.
//
// Bars are proportional to the largest value rather than to the total: at 44%
// of 519, Founders would otherwise use less than half the width available and
// Investors would collapse to a stub too short to carry its own label.
//
// The funnel is the number a sponsor is actually buying and it is the smallest
// of the three, so it is stated rather than charted — 63 in a room is a real
// meetup, and a bar that made it look like 209 would be the lie that gets
// noticed on the night.
// ─────────────────────────────────────────────────────────────────────────

const BAR_MAX = Math.max(...ROLES.map((r) => r.n));
const TRACK = 720;
const LABEL_W = 260;
const ROW_H = 96;

export function Background({ active }: SlideProps) {
  return <Backdrop fade="left" motion={20} paused={!active} />;
}

export function Content() {
  return (
    <Frame>
      <Headline>Who&rsquo;s in the room</Headline>
      <Subhead>{ROLE_TOTAL} approved registrants across three events</Subhead>

      <div style={{ display: 'flex', gap: 88, marginTop: 'auto', alignItems: 'flex-end' }}>
        <div style={{ flex: 'none' }}>
          {ROLES.map((r) => (
            <Bar key={r.label} label={r.label} n={r.n} muted={r.label === 'Other'} />
          ))}
          <p
            style={{
              margin: '26px 0 0',
              fontFamily: 'var(--font-mono)',
              fontSize: 22,
              color: 'rgba(244,245,255,0.58)',
            }}
          >
            {ROLE_NOTE}
          </p>
        </div>

        <div style={{ flex: 1, borderLeft: '1px solid rgba(244,245,255,0.14)', paddingLeft: 72 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 22,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: C.periwinkle,
            }}
          >
            Per event, on average
          </div>
          {FUNNEL.map((f, i) => (
            <Stat key={f.label} label={f.label} n={f.avg} emphasis={i === FUNNEL.length - 1} />
          ))}
        </div>
      </div>
    </Frame>
  );
}

function Bar({ label, n, muted }: { label: string; n: number; muted: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', height: ROW_H, gap: 28 }}>
      <span
        style={{
          width: LABEL_W,
          flex: 'none',
          fontFamily: 'var(--font-sans)',
          fontSize: 40,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: muted ? 'rgba(244,245,255,0.6)' : C.white,
        }}
      >
        {label}
      </span>
      {/* The track is opaque, not a white wash: at 7% alpha the animated field
          showed straight through it and every bar read as dithered noise. */}
      <span style={{ width: TRACK, flex: 'none', height: 40, background: '#141838', borderRadius: 4 }}>
        <span
          style={{
            display: 'block',
            height: '100%',
            width: (n / BAR_MAX) * TRACK,
            background: muted ? C.periwinkle : C.brightBlue,
            borderRadius: 4,
          }}
        />
      </span>
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 38,
          fontWeight: 600,
          color: muted ? 'rgba(244,245,255,0.6)' : C.white,
        }}
      >
        {n}
      </span>
    </div>
  );
}

function Stat({ label, n, emphasis }: { label: string; n: number; emphasis: boolean }) {
  return (
    <div style={{ marginTop: 34 }}>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: emphasis ? 108 : 78,
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
          marginTop: 8,
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
