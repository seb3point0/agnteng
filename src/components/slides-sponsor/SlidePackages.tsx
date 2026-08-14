import { C, PAD, type SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline, Subhead } from '../slides/parts';
import { NO_STAGE_TIME, TIERS, type Tier } from './content';

// ─────────────────────────────────────────────────────────────────────────
// 06 — Packages. Two panels, prices aligned across both.
//
// The two tiers carry three benefits in common and Partner adds three more, so
// the shared three are listed first in the same order on both panels. A reader
// comparing them scans down one column and stops where they diverge, instead of
// re-reading two differently-ordered lists to find the difference.
//
// Prices sit in a strip pinned to the bottom of each panel — `marginTop: auto`
// rather than a fixed offset — so the six-benefit panel and the three-benefit
// one still line their numbers up. That row is what gets compared; it should
// not move because the list above it is longer.
//
// "Never buys stage time" is the subhead, not a footnote. It is the constraint
// that makes the audience worth selling, so it is read before the prices rather
// than discovered after them.
// ─────────────────────────────────────────────────────────────────────────

const GAP = 44;
const PANEL_W = (1920 - PAD * 2 - GAP) / 2;

export function Background({ active }: SlideProps) {
  return <Backdrop animation="drift" fade="radial" motion={20} density={0.38} opacity={0.42} paused={!active} />;
}

export function Content() {
  return (
    <Frame>
      <Headline>Packages</Headline>
      <Subhead style={{ margin: '20px 0 0', fontSize: 34 }}>{NO_STAGE_TIME}</Subhead>

      <div style={{ display: 'flex', gap: GAP, marginTop: 'auto' }}>
        {TIERS.map((t) => (
          <Panel key={t.name} tier={t} />
        ))}
      </div>
    </Frame>
  );
}

function Panel({ tier }: { tier: Tier }) {
  return (
    <div
      style={{
        width: PANEL_W,
        flex: 'none',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 606,
        padding: 44,
        borderRadius: 24,
        // Both panels are opaque. A translucent blue tint on the featured one
        // let the field through and made the more expensive package look like
        // the noisier one — the reverse of what the highlight is for.
        background: tier.featured ? '#141A4A' : C.panelNavy,
        border: `1px solid ${tier.featured ? 'rgba(181,166,255,0.42)' : 'rgba(181,166,255,0.18)'}`,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: C.white,
          }}
        >
          {tier.name}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 21,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: tier.featured ? C.periwinkle : 'rgba(244,245,255,0.45)',
          }}
        >
          {tier.availability}
        </span>
      </div>

      <ul style={{ margin: '32px 0 0', padding: 0, listStyle: 'none' }}>
        {tier.benefits.map((b) => (
          <li
            key={b}
            style={{
              display: 'flex',
              gap: 18,
              marginTop: 16,
              fontFamily: 'var(--font-sans)',
              fontSize: 27,
              fontWeight: 500,
              lineHeight: 1.3,
              color: 'rgba(244,245,255,0.82)',
            }}
          >
            <span style={{ color: C.brightBlue, flex: 'none' }}>—</span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      <div
        style={{
          marginTop: 'auto',
          paddingTop: 30,
          borderTop: '1px solid rgba(244,245,255,0.14)',
          display: 'flex',
          gap: 20,
        }}
      >
        {tier.prices.map((p) => (
          <div key={p.period} style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 20,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(244,245,255,0.5)',
              }}
            >
              {p.period}
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: 'var(--font-sans)',
                fontSize: 48,
                fontWeight: 800,
                letterSpacing: '-0.02em',
                color: C.white,
              }}
            >
              {p.price}
            </div>
            {p.note && (
              <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 20, color: C.periwinkle }}>
                {p.note}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
