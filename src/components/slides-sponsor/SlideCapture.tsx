import type { SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline, NumberedRow, Subhead } from '../slides/parts';
import { CAPTURE } from './content';

// ─────────────────────────────────────────────────────────────────────────
// 04 — What we know about them. Same numbered-row block the meetup deck uses
// for the asks, because it is the same shape of content: a short list read at
// a glance, from the back of a room.
//
// Intent is deliberately last and reads as four words rather than a sentence.
// It is the field a sponsor is really buying — "who is hiring" is the reason to
// take the list — and putting it first would make the four before it look like
// padding on the way to it.
// ─────────────────────────────────────────────────────────────────────────

export function Background({ active }: SlideProps) {
  return <Backdrop fade="right" motion={24} paused={!active} />;
}

export function Content() {
  return (
    <Frame>
      <Headline>{CAPTURE.headline}</Headline>
      <Subhead>{CAPTURE.subhead}</Subhead>

      <div style={{ marginTop: 'auto' }}>
        {CAPTURE.fields.map((f) => (
          <NumberedRow key={f.n} n={f.n} title={f.title} body={f.body} titleWidth={420} size={44} />
        ))}
      </div>
    </Frame>
  );
}
