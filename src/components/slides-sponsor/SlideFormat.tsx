import { C, type SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline, NumberedRow, Subhead } from '../slides/parts';
import { FORMAT, RULES } from './content';

// ─────────────────────────────────────────────────────────────────────────
// 05 — Event format, with the talk rules under it. The meetup deck gives the
// rules a slide of their own because it is addressing the speakers; here they
// are evidence rather than instruction — the reason the room is worth being in
// front of — so they sit beneath the format as its supporting detail.
//
// The subhead is the format, so it is set larger than the deck default and the
// rules are pushed clear of it: at 40px with the rules directly under, the
// three talks and the networking read as the first line of a list rather than
// as the thing the slide is about.
//
// The rules keep their own heading. Without it the three rows read as three
// more format details, and "No pitches" stops being a rule the event enforces.
// ─────────────────────────────────────────────────────────────────────────

export function Background({ active }: SlideProps) {
  return <Backdrop fade="up" motion={24} paused={!active} />;
}

export function Content() {
  return (
    <Frame>
      <Headline>{FORMAT.headline}</Headline>
      <Subhead style={{ margin: '36px 0 0', fontSize: 46, lineHeight: 1.3, maxWidth: 1320, color: C.white }}>
        {FORMAT.subhead}
      </Subhead>

      <div style={{ marginTop: 'auto' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 24,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: C.periwinkle,
            marginBottom: 22,
          }}
        >
          Talk rules
        </div>
        {RULES.map((r) => (
          <NumberedRow key={r.n} n={r.n} title={r.title} body={r.body} titleWidth={520} size={48} />
        ))}
      </div>
    </Frame>
  );
}
