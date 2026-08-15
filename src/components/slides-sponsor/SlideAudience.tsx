import { C, PAD, type SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline, Subhead } from '../slides/parts';
import { FUNNEL, ROLE_TOTAL, ROLES, TRACK } from './content';

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
// The bottom half is two columns, numbers on the left and data on the right,
// separated by space rather than a rule. The per-event label sits directly
// above its own figures rather than off to the side, where it was far enough
// from them to read as a heading for the whole row.
// ─────────────────────────────────────────────────────────────────────────

const TRACK_W = 1920 - PAD * 2;
const BAR_H = 92;
const STATS_W = 620;

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
      <Subhead style={{ margin: '22px 0 0', fontSize: 36 }}>{ROLE_TOTAL}</Subhead>

      {/* one whole, divided */}
      <div
        style={{
          display: 'flex',
          width: TRACK_W,
          height: BAR_H,
          marginTop: 44,
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
      <div style={{ display: 'flex', width: TRACK_W, marginTop: 30 }}>
        {ROLES.map((r) => (
          <div key={r.label} style={{ width: `${r.pct}%`, paddingRight: 24, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 66,
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
                fontSize: 28,
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
      <div style={{ display: 'flex', marginTop: 'auto' }}>
        <div style={{ width: STATS_W, flex: 'none' }}>
          <div style={MONO_LABEL}>Per event, on average</div>
          <div style={{ display: 'flex', gap: 72, marginTop: 22 }}>
            {FUNNEL.map((f, i) => (
              <Stat key={f.label} label={f.label} n={f.avg} emphasis={i === FUNNEL.length - 1} />
            ))}
          </div>
        </div>

        <div style={{ flex: 1, paddingLeft: 72 }}>
          <div style={MONO_LABEL}>{TRACK.label}</div>
          <div style={{ display: 'flex', gap: 56, marginTop: 22 }}>
            {TRACK.items.map((it) => (
              <div key={it.title} style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 34,
                    fontWeight: 700,
                    letterSpacing: '-0.02em',
                    color: C.white,
                  }}
                >
                  {it.title}
                </div>
                {it.body && (
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
                )}
              </div>
            ))}
          </div>
          <p
            style={{
              margin: '30px 0 0',
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
          fontSize: 84,
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
