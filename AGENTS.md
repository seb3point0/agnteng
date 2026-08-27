# Agentic Engineering — Brand & Design System

Astro site: brand guidelines, website mockups, social banners, cover images,
and the live event decks (`/slides/*`) for Agentic Engineering meetups.

## Platform standard

This repo follows the conventions in `~/dev/platform` (the `demonik-platform`
skill). Read that first for anything about secrets, Dokploy, vaults, or
deploy — this file only covers what's specific to this repo.

## Structure

Single Astro app at the repo root (not a pnpm monorepo — see Divergences).

```
src/
  pages/            routes — mockups, slides, brand guidelines, the on-demand audience.json API
  components/       .astro components, React islands (animation-builder, slide decks)
  lib/luma.ts       server-only Luma API client — never import from a client:* component
```

## Tech stack

Astro 5 (node adapter, standalone mode) + React islands + Tailwind v4. One
Node process serves both prerendered static output and the on-demand routes.

## Environments

Production: `branding.agnteng.com`. No preview or development deploys —
`npm run dev` for local work.

## Commands

```
npm run dev         # local dev server, :4321
npm run build        # astro build
npm run typecheck    # astro check
npm test             # vitest run
```

## Divergences

- **npm, not pnpm.** This is a single app, not a monorepo — there's no
  `apps/`/`packages/` split for pnpm workspaces to manage, so it stays on
  `npm` (pinned via `packageManager`).
- **No lint step in CI.** No ESLint config exists yet. `typecheck` and `test`
  are the gate for now.
- **4 pre-existing `astro check` errors** in mockup/exporter code, tracked in
  issue #2 — not blocking, but CI will show them until fixed.
- **`LUMA_API_KEY` still resolves through `.env.schema` → `project-agnteng`**,
  which requires a 1Password vault + service account that doesn't exist yet.
  Until that's provisioned, Dokploy carries `LUMA_API_KEY` directly instead of
  `OP_TOKEN`/`APP_ENV` — see the `dev` branch PR for the cutover plan.

## Agent rules

- `src/lib/luma.ts` is server-only. Never import it from a `.tsx` file that
  ships to the browser via `client:*` — `LUMA_API_KEY` would end up in the
  client bundle.
- The Luma event id and start time live in
  `src/components/slides-2026-08-26/content.ts` — update there when a new
  event's deck goes live, not by editing the API route.
