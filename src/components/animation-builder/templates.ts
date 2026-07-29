import type { OverlaySpec, Variant, Grad } from './overlay';
import type { Anchor } from './anchor';

// A template = a fixed export frame + how to build the overlay design elements
// from the editable text/logo controls. The same field animation flows under it.

export interface TemplateText {
  city: string;
  date: string;
}
export interface TemplateLogo {
  scale: number;
  variant: Variant;
  anchor: Anchor;
  mark: boolean; // mark-only vs full lockup
}
export interface Template {
  id: string;
  group: 'banner' | 'avatar' | 'cover';
  name: string;
  frame: { w: number; h: number };
  chrome?: 'x' | 'linkedin' | 'substack' | 'luma' | 'telegram' | 'youtube';
  defaults: { logoAnchor: Anchor; logoScale: number; variant: Variant; mark: boolean };
  build(text: TemplateText, logo: TemplateLogo): OverlaySpec;
}

const banner = (
  id: string,
  name: string,
  w: number,
  h: number,
  anchor: Anchor,
  mark: boolean,
  gradient: Grad,
  chrome: Template['chrome'],
  safeZone?: OverlaySpec['safeZone'],
): Template => ({
  id,
  group: 'banner',
  name,
  frame: { w, h },
  chrome,
  defaults: { logoAnchor: anchor, logoScale: mark ? 0.42 : 0.3, variant: 'white', mark },
  build: (_t, l) => ({ logo: { anchor: l.anchor, scale: l.scale, variant: l.variant, mark: l.mark }, gradient, safeZone }),
});

export const TEMPLATES: Template[] = [
  // ── Social banners (sizes from BannerBuilder PLATFORMS) ──
  banner('banner-youtube', 'YouTube banner', 2560, 1440, 'center', false, 'none', 'youtube', {
    kind: 'rect',
    xf: 0.5,
    yf: 0.5,
    wf: 0.604,
    hf: 0.294,
  }),
  banner('banner-x', 'X header', 1500, 500, 'right', false, 'none', 'x'),
  banner('banner-linkedin', 'LinkedIn cover', 1584, 264, 'right', false, 'none', 'linkedin'),
  banner('banner-substack', 'Substack masthead', 1344, 256, 'right', false, 'none', 'substack'),
  banner('banner-luma', 'Luma calendar', 1400, 400, 'right', false, 'none', 'luma'),
  banner('banner-telegram', 'Telegram photo', 512, 512, 'center', true, 'none', 'telegram', {
    kind: 'circle',
    xf: 0.5,
    yf: 0.5,
    wf: 1,
    hf: 1,
  }),

  // ── Avatar (square, white mark centered) ──
  {
    id: 'avatar',
    group: 'avatar',
    name: 'Avatar',
    frame: { w: 1024, h: 1024 },
    defaults: { logoAnchor: 'center', logoScale: 0.42, variant: 'white', mark: true },
    build: (_t, l) => ({
      logo: { anchor: l.anchor, scale: l.scale, variant: l.variant, mark: l.mark },
      safeZone: { kind: 'circle', xf: 0.5, yf: 0.5, wf: 1, hf: 1 },
    }),
  },

  // ── Luma event cover (square + lockup + city pill + date) ──
  {
    id: 'cover-luma',
    group: 'cover',
    name: 'Luma event cover',
    frame: { w: 1000, h: 1000 },
    defaults: { logoAnchor: 'center', logoScale: 0.7, variant: 'white', mark: false },
    build: (t, l) => ({
      vignette: true,
      coverGroup: { scale: l.scale, variant: l.variant, city: t.city, date: t.date },
    }),
  },

  // ── Title slide (16:9 presentation opener) ──
  // Same coverGroup design as the Luma cover; drawCoverGroup sizes off
  // min(W,H), so on a wide frame the lockup reads smaller than on the 1000²
  // square — hence the higher default scale.
  {
    id: 'cover-title',
    group: 'cover',
    name: 'Title slide (16:9)',
    frame: { w: 1920, h: 1080 },
    defaults: { logoAnchor: 'center', logoScale: 0.62, variant: 'white', mark: false },
    build: (t, l) => ({
      vignette: true,
      coverGroup: { scale: l.scale, variant: l.variant, city: t.city, date: t.date },
    }),
  },
];

export function findTemplate(id: string | null): Template | null {
  return id ? TEMPLATES.find((t) => t.id === id) ?? null : null;
}

// normalize a frame to a ~960px-long-edge display size (keeps the artboard light)
export function normalizeWH(w: number, h: number): { w: number; h: number } {
  const long = Math.max(w, h) || 1;
  const k = 960 / long;
  return { w: Math.max(1, Math.round(w * k)), h: Math.max(1, Math.round(h * k)) };
}

// no-template export size from the manual aspect (e.g. "16 / 9" → 960×540)
export function aspectToPx(aspect: string): { w: number; h: number } {
  const [aw, ah] = aspect.split('/').map((n) => Number(n.trim()) || 1);
  return aw >= ah ? { w: 960, h: Math.round((960 * ah) / aw) } : { w: Math.round((960 * aw) / ah), h: 960 };
}
