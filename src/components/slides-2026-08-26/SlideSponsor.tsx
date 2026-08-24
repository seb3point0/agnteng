import { C, type SlideProps } from '../slides/deck';
import { Backdrop, Frame, Headline, Placeholder, Subhead } from '../slides/parts';
import { SPONSOR } from './content';

// ─────────────────────────────────────────────────────────────────────────
// 03 — This month's sponsor. A template: edit SPONSOR in ./content.ts each
// month — name, logo, a product screenshot, the ask, and a CTA link. Pitch
// on the left, the product itself large on the right in a browser-chrome
// frame.
//
// The screenshot shows in full (no crop) — it's sized to the screenshot's
// own aspect ratio rather than forced into a fixed height, so nothing gets
// cut off regardless of what shape this month's sponsor sends over.
//
// Logo and screenshot fall back to a labelled placeholder box when unset,
// so an unfilled slide never ships a broken image.
// ─────────────────────────────────────────────────────────────────────────

const TEXT_W = 620;
const LOGO_H = 64;
const PLACEHOLDER_H = 560;
const CHROME_DOT = ['#ED4BA0', '#F9C835', '#B5A6FF'];

export function Background({ active }: SlideProps) {
  return <Backdrop fade="right" motion={26} paused={!active} />;
}

export function Content({ active }: SlideProps) {
  return (
    <Frame>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 20,
          fontWeight: 600,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: C.periwinkle,
        }}
      >
        Tonight&rsquo;s sponsor
      </div>

      <div style={{ display: 'flex', gap: 72, alignItems: 'center', flex: 1 }}>
        <div style={{ width: TEXT_W, flex: 'none' }}>
          {SPONSOR.logo && (
            <img
              src={SPONSOR.logo}
              alt={`${SPONSOR.name} logo`}
              style={{ height: LOGO_H, objectFit: 'contain', marginBottom: 28 }}
            />
          )}

          <Headline>{SPONSOR.name}</Headline>
          <Subhead style={{ maxWidth: TEXT_W, fontSize: 27, lineHeight: 1.4 }}>{SPONSOR.ask}</Subhead>

          <a
            href={SPONSOR.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            tabIndex={active ? 0 : -1}
            style={{
              display: 'inline-block',
              marginTop: 40,
              pointerEvents: active ? 'auto' : 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontFamily: 'var(--font-mono)',
              fontSize: 40,
              fontWeight: 600,
              color: C.white,
            }}
          >
            {SPONSOR.cta.text}
          </a>
        </div>

        <div style={{ flex: 1 }}>
          <BrowserFrame src={SPONSOR.screenshot} name={SPONSOR.name} />
        </div>
      </div>
    </Frame>
  );
}

function BrowserFrame({ src, name }: { src: string | null; name: string }) {
  return (
    <div
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        background: C.panelNavy,
        border: '1px solid rgba(181,166,255,0.22)',
        boxShadow: '0 48px 96px -24px rgba(0,0,0,0.55)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '16px 20px',
          background: 'rgba(244,245,255,0.04)',
          borderBottom: '1px solid rgba(244,245,255,0.08)',
        }}
      >
        {CHROME_DOT.map((c) => (
          <span key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
        ))}
      </div>

      {src ? (
        <img src={src} alt={`${name} product screenshot`} style={{ display: 'block', width: '100%', height: 'auto' }} />
      ) : (
        <div style={{ padding: 24 }}>
          <Placeholder height={PLACEHOLDER_H} label="Product screenshot" />
        </div>
      )}
    </div>
  );
}
