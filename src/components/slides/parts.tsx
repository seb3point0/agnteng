import type { CSSProperties, ReactNode } from 'react';
import Animation from '../Animation';
import type { AnimName } from '../Animation';
import { C, PAD } from './deck';

// ─────────────────────────────────────────────────────────────────────────
// Shared slide primitives.
//
// A slide is split in two layers, because the deck letterboxes a 16:9 stage
// into a viewport that is usually NOT 16:9 (a 16:10 laptop leaves ~70px bars):
//
//   Background — full viewport, no transform. Owns the surface colour and the
//                animated field, so colour reaches every edge of the screen.
//   Content    — inside the scaled 1920×1080 stage. Owns all type and imagery,
//                so the composition keeps its exact proportions everywhere.
//
// Content sizes are absolute px against that 1920×1080 stage; nothing here is
// responsive by design.
// ─────────────────────────────────────────────────────────────────────────

/** Full-viewport backdrop: navy + the house field. Lives in the background layer. */
export function Backdrop({
  animation = 'aurora',
  fade = 'none',
  motion = 26,
  density = 0.34,
  opacity = 0.45,
  paused = false,
  children,
}: {
  animation?: AnimName;
  fade?: 'none' | 'left' | 'right' | 'up' | 'down' | 'radial';
  motion?: number;
  density?: number;
  opacity?: number;
  paused?: boolean;
  children?: ReactNode;
}) {
  return (
    <div style={{ position: 'absolute', inset: 0, background: C.navy, overflow: 'hidden' }}>
      <Animation
        animation={animation}
        color="#1E2BE6"
        edge="#ED4BA0"
        bg="#05071E"
        cell={6}
        gap={1}
        density={density}
        motion={motion}
        fade={fade}
        shape="square"
        paused={paused}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity }}
      />
      {children}
    </div>
  );
}

/** The padded content column every slide lays out inside. */
export function Frame({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        padding: PAD,
        color: C.white,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function Headline({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: 'var(--font-sans)',
        fontSize: 104,
        fontWeight: 800,
        lineHeight: 1.02,
        letterSpacing: '-0.03em',
        ...style,
      }}
    >
      {children}
    </h1>
  );
}

export function Subhead({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <p
      style={{
        margin: '28px 0 0',
        fontFamily: 'var(--font-sans)',
        fontSize: 40,
        fontWeight: 500,
        color: 'rgba(244,245,255,0.62)',
        ...style,
      }}
    >
      {children}
    </p>
  );
}

/** `01  ORGANIZE   Help run the next one.` — the list row used on slides 04/05. */
export function NumberedRow({
  n,
  title,
  body,
  titleWidth = 460,
  size = 46,
}: {
  n: string;
  title: string;
  body: string;
  titleWidth?: number;
  size?: number;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 40,
        padding: '30px 0',
        borderTop: '1px solid rgba(244,245,255,0.14)',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: size * 0.62,
          fontWeight: 600,
          color: C.periwinkle,
          width: 72,
          flex: 'none',
        }}
      >
        {n}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: size,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          width: titleWidth,
          flex: 'none',
        }}
      >
        {title}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: size * 0.72,
          fontWeight: 500,
          color: 'rgba(244,245,255,0.62)',
          flex: 1,
        }}
      >
        {body}
      </span>
    </div>
  );
}
