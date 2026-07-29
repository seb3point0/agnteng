import { C, LINKS, type SlideProps } from './deck';
import { Backdrop, Frame, Headline } from './parts';

// ─────────────────────────────────────────────────────────────────────────
// 05 — Where to find us. The closing slide, so it stays up while the room
// talks: platform name and URL, nothing else — the QR does the explaining.
// QR codes need a light field and their quiet zone intact, so the tiles stay
// white rather than being tinted to brand.
// ─────────────────────────────────────────────────────────────────────────

const QR = 268;

export function Background({ active }: SlideProps) {
  return <Backdrop animation="drift" fade="radial" motion={22} density={0.4} opacity={0.5} paused={!active} />;
}

export function Content() {
  return (
    <Frame>
      <Headline>Where to find us</Headline>

      <div style={{ display: 'flex', gap: 44, marginTop: 'auto' }}>
        {LINKS.map((l) => (
          <Panel key={l.name} {...l} />
        ))}
      </div>
    </Frame>
  );
}

function Panel({ name, url, qr }: (typeof LINKS)[number]) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 44,
        padding: 48,
        borderRadius: 24,
        background: C.panelNavy,
        border: '1px solid rgba(181,166,255,0.22)',
      }}
    >
      <img
        src={qr}
        alt={`QR code for ${url}`}
        style={{ width: QR, height: QR, flex: 'none', borderRadius: 12, background: '#fff' }}
      />
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 52,
            fontWeight: 800,
            letterSpacing: '-0.02em',
            color: C.white,
          }}
        >
          {name}
        </div>
        <div
          style={{
            marginTop: 18,
            fontFamily: 'var(--font-mono)',
            fontSize: 34,
            color: C.brightBlue,
            whiteSpace: 'nowrap',
          }}
        >
          {url}
        </div>
      </div>
    </div>
  );
}
