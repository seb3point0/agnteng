import { C, PAD, type SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline, Subhead } from '../slides/parts';
import { ROLE_TOTAL, ROLES, STATS, TRACK } from './content';

// ─────────────────────────────────────────────────────────────────────────
// 03 — Who is in the room, and what we know about them.
//
// This was two slides. The mix and the data are one answer to one question a
// sponsor is asking, and splitting them meant the second slide opened with a
// headline that repeated the first. Together they fit, because neither half
// needs more than a third of the stage.
//
// Percentages of one whole, so one bar divided into three, not three bars.
// Separate bars encode "how big is each", which is not the question; a divided
// bar encodes "what is this room made of", which is. It also makes the three
// numbers visibly sum to everything, so nothing looks omitted.
//
// The bottom half is two stacked bands, not two side-by-side columns. Side by
// side, "what we track" had a third of the stage for three columns, so its
// third line wrapped while the other two did not, and the block that was meant
// to look like a tidy schema looked like a table that had outgrown its box.
// Full width, all three fit on one line each and the two bands read as two
// answers rather than as one crowded one.
// ─────────────────────────────────────────────────────────────────────────

const TRACK_W = 1920 - PAD * 2;
// Every box on this slide sets flexShrink: 0. The Frame is a flex column, so
// when the content outgrew the stage the bar simply got thinner instead of
// overflowing, which the gutter check cannot see and the eye reads as a design
// choice. With shrinking off, too much content pushes past the bottom padding
// and the measurement catches it.
const BAR_H = 72;

const SEGMENT_COLOR: Record<string, string> = {
  Founders: C.brightBlue,
  Engineers: C.periwinkle,
  'Investors & others': '#39406B',
};

const MONO_LABEL = {
  fontFamily: 'var(--font-mono)',
  fontSize: 22,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: C.periwinkle,
};

export function Background({ active }: SlideProps) {
  return <Backdrop fade="left" motion={20} paused={!active} />;
}

export function Content() {
  return (
    <Frame>
      <Headline>Who&rsquo;s in the room</Headline>
      <Subhead style={{ margin: '18px 0 0', fontSize: 36 }}>{ROLE_TOTAL}</Subhead>

      {/* one whole, divided */}
      <div
        style={{
          display: 'flex',
          width: TRACK_W,
          height: BAR_H,
          flexShrink: 0,
          marginTop: 32,
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        {ROLES.map((r) => (
          <div key={r.label} style={{ width: `${r.pct}%`, background: SEGMENT_COLOR[r.label] }} />
        ))}
      </div>

      {/* Each label sits on the left edge of the band it names, so the bar is
          its own legend. Equal columns were needed when the smallest segment
          was 5% and 83px wide; at three segments the narrowest is 20%, which is
          333px, and the colour chip that stood in for the alignment can go. */}
      <div style={{ display: 'flex', width: TRACK_W, flexShrink: 0, marginTop: 20 }}>
        {ROLES.map((r) => (
          <div key={r.label} style={{ width: `${r.pct}%`, paddingRight: 24, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 52,
                fontWeight: 800,
                lineHeight: 1,
                letterSpacing: '-0.03em',
                color: C.white,
              }}
            >
              {r.pct}%
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: 'var(--font-sans)',
                fontSize: 26,
                fontWeight: 500,
                color: 'rgba(244,245,255,0.62)',
              }}
            >
              {r.label}
            </div>
          </div>
        ))}
      </div>

      {/* No rules anywhere on this slide. A hairline on a field that is itself
          made of dots reads as another row of dots, and the whitespace was
          already doing the separating. */}
      <div style={{ marginTop: 'auto', flexShrink: 0 }}>
        <div style={MONO_LABEL}>{STATS.label}</div>
        <div style={{ display: 'flex', gap: 80, marginTop: 14 }}>
          {STATS.items.map((it, i) => (
            <Stat key={it.label} label={it.label} n={it.n} emphasis={i === STATS.items.length - 1} />
          ))}
        </div>

        <div style={{ ...MONO_LABEL, marginTop: 36 }}>{TRACK.label}</div>
        <div style={{ display: 'flex', width: TRACK_W, gap: 56, marginTop: 14 }}>
          {TRACK.items.map((it) => (
            <div key={it.title} style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 32,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: C.white,
                }}
              >
                {it.title}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontFamily: 'var(--font-sans)',
                  fontSize: 24,
                  fontWeight: 500,
                  lineHeight: 1.3,
                  color: 'rgba(244,245,255,0.62)',
                }}
              >
                {it.body}
              </div>
            </div>
          ))}
        </div>

        <p
          style={{
            margin: '20px 0 0',
            fontFamily: 'var(--font-sans)',
            fontSize: 25,
            fontWeight: 500,
            lineHeight: 1.35,
            color: 'rgba(244,245,255,0.55)',
          }}
        >
          {TRACK.note}
        </p>
      </div>
    </Frame>
  );
}

function Stat({ label, n, emphasis }: { label: string; n: number; emphasis: boolean }) {
  return (
    <div>
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 64,
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
          fontSize: 26,
          fontWeight: 500,
          color: 'rgba(244,245,255,0.62)',
        }}
      >
        {label}
      </div>
    </div>
  );
}
