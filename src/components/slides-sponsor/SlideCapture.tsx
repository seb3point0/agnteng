import { C, PAD, type SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline, Subhead } from '../slides/parts';
import { CAPTURE } from './content';

// ─────────────────────────────────────────────────────────────────────────
// 04 — What we know about them. Two columns: what they do on the left, where
// to find them on the right.
//
// Six items down one column filled the slide and read as a form. In two, the
// split is itself the information — the left column is who someone is, the
// right is how you reach them — and the rows get to be larger.
//
// Only Intent carries a description. The other five explain themselves, and a
// body line under "GitHub" would be there to balance the layout rather than to
// say anything. The rows are a fixed height so the two columns stay in step
// even though only one of them has a second line.
// ─────────────────────────────────────────────────────────────────────────

const COL_GAP = 96;
const COL_W = (1920 - PAD * 2 - COL_GAP) / 2;
const ROW_H = 150;

export function Background({ active }: SlideProps) {
  return <Backdrop fade="right" motion={24} paused={!active} />;
}

export function Content() {
  return (
    <Frame>
      <Headline>{CAPTURE.headline}</Headline>
      <Subhead>{CAPTURE.subhead}</Subhead>

      {/* The closing rule belongs to the column, not the last row: without it
          the list trails off, and the two columns stop reading as one block the
          moment their last rows are different heights. */}
      <div style={{ display: 'flex', gap: COL_GAP, marginTop: 'auto' }}>
        {CAPTURE.columns.map((col, i) => (
          <div
            key={i}
            style={{ width: COL_W, flex: 'none', borderBottom: '1px solid rgba(244,245,255,0.14)' }}
          >
            {col.map((f) => (
              <Row key={f.n} n={f.n} title={f.title} body={'body' in f ? f.body : undefined} />
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Row({ n, title, body }: { n: string; title: string; body?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 36,
        height: ROW_H,
        borderTop: '1px solid rgba(244,245,255,0.14)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 30,
          fontWeight: 600,
          color: C.periwinkle,
          width: 72,
          flex: 'none',
        }}
      >
        {n}
      </span>
      <span style={{ minWidth: 0 }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-sans)',
            fontSize: 54,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: C.white,
          }}
        >
          {title}
        </span>
        {body && (
          <span
            style={{
              display: 'block',
              marginTop: 10,
              fontFamily: 'var(--font-sans)',
              fontSize: 30,
              fontWeight: 500,
              color: 'rgba(244,245,255,0.62)',
            }}
          >
            {body}
          </span>
        )}
      </span>
    </div>
  );
}
