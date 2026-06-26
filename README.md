# Agentic Engineering — Master Design System

The clean master design system for **Agentic Engineering** (not Interop, not Klimb).
This is scaffolding only — brand elements get moved in from the old
`DESIGN SYSTEM 1` / `DESIGN SYSTEM 2` folders later, then those folders get deleted.

## Stack

- **Astro 5** — static-first, component-based
- **React 19** islands — for interactive components (`client:*` directives)
- **Tailwind CSS v4** — via `@tailwindcss/vite`; tokens in `src/styles/global.css`

## Structure

```
src/
├─ layouts/Base.astro          shared <html> shell
├─ components/
│  ├─ PlaceholderCard.astro     reusable static component
│  └─ HealthCheck.tsx           React island (proves hydration; delete later)
├─ pages/
│  ├─ index.astro               overview / section index
│  ├─ brand-guidelines.astro    01 — logo, color, type, voice (clean slate)
│  ├─ website-mockups.astro     02
│  ├─ social-banners.astro      03
│  └─ cover-images.astro        04
└─ styles/global.css            Tailwind import + empty @theme tokens
public/assets/                  logos & brand assets land here later
```

## Develop

```bash
npm install
npm run dev      # serves on 0.0.0.0:4321 (reachable via sslip.io hostname)
```

The dev server binds to all interfaces and allows `*.sslip.io` hosts, so it's
reachable at `http://<dashed-ip>.sslip.io:4321`.

## Build

```bash
npm run build    # → dist/
npm run preview
```
