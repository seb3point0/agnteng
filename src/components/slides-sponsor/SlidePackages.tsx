import { C, PAD, type SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline } from '../slides/parts';
import { NO_STAGE_TIME, TIERS, type Tier } from './content';

// ─────────────────────────────────────────────────────────────────────────
// 06 — Packages. Two panels, prices aligned across both.
//
// This slide carries the most and had the least room, so everything that was
// not doing work has gone: the availability line beside each name, the
// six-month column, and the subhead. What is left is two names, two lists and
// four numbers, with space around them.
//
// Bullets are squares, not em dashes: the deck avoids the dash everywhere it
// reaches the screen, and the square is the mark the site already uses.
//
// The two tiers share three benefits and Partner adds two more, listed in the
// same order on both panels. A reader comparing them scans down one column and
// stops where they diverge, instead of re-reading two differently-ordered
// lists to find the difference.
//
// Prices sit in a strip pinned to the bottom of each panel — `marginTop: auto`
// rather than a fixed offset — so the five-benefit panel and the three-benefit
// one still line their numbers up. That row is what gets compared; it should
// not move because the list above it is longer.
//
// "Never buys stage time" is a footnote under both panels. As the subhead it
// pushed the panels down into the space they needed, and made the slide read
// as a disclaimer before it read as a price list.
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

      <div style={{ marginTop: 'auto' }}>
        <div style={{ display: 'flex', gap: GAP }}>
          {TIERS.map((t) => (
            <Panel key={t.name} tier={t} />
          ))}
        </div>

        <p
          style={{
            margin: '32px 0 0',
            fontFamily: 'var(--font-sans)',
            fontSize: 26,
            fontWeight: 500,
            color: 'rgba(244,245,255,0.55)',
          }}
        >
          {NO_STAGE_TIME}
        </p>
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
        // No minHeight: the row's default `align-items: stretch` already makes
        // Community as tall as Partner. The floor that was here was smaller
        // than Partner's real height, so it did nothing except hide the fact
        // that the panel had grown past the space between the headline and the
        // footnote — and the panels overlapped "Packages".
        padding: 38,
        borderRadius: 24,
        // Both panels are opaque. A translucent blue tint on the featured one
        // let the field through and made the more expensive package look like
        // the noisier one — the reverse of what the highlight is for.
        background: tier.featured ? '#141A4A' : C.panelNavy,
        border: `1px solid ${tier.featured ? 'rgba(181,166,255,0.42)' : 'rgba(181,166,255,0.18)'}`,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 50,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: C.white,
        }}
      >
        {tier.name}
      </div>

      <ul style={{ margin: '18px 0 0', padding: 0, listStyle: 'none' }}>
        {tier.benefits.map((b) => (
          <li key={b.text} style={{ display: 'flex', gap: 20, marginTop: 13 }}>
            <span
              style={{
                flex: 'none',
                width: 12,
                height: 12,
                marginTop: 12,
                background: C.brightBlue,
              }}
            />
            <span style={{ minWidth: 0 }}>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 27,
                  fontWeight: 500,
                  lineHeight: 1.3,
                  color: 'rgba(244,245,255,0.82)',
                }}
              >
                {b.text}
              </span>
              {b.note && (
                <span
                  style={{
                    display: 'block',
                    marginTop: 6,
                    fontFamily: 'var(--font-sans)',
                    fontSize: 22,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    color: 'rgba(244,245,255,0.5)',
                  }}
                >
                  {b.note}
                </span>
              )}
            </span>
          </li>
        ))}
      </ul>

      {/* The discount sits on the price's own baseline rather than under it.
          Stacked, it made the strip three rows deep and pushed the whole block
          up against the last perk; beside the number it is also where a reader
          comparing two prices is already looking. */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: 38,
          borderTop: '1px solid rgba(244,245,255,0.14)',
          display: 'flex',
          gap: 32,
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
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginTop: 10 }}>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 48,
                  fontWeight: 800,
                  letterSpacing: '-0.02em',
                  color: C.white,
                }}
              >
                {p.price}
              </span>
              {p.note && (
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 21, color: C.periwinkle }}>{p.note}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
