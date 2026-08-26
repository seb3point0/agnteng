# ── build the site ──────────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── run it ───────────────────────────────────────────────────────────────
# Most pages are still prerendered at build time above, but the Luma-backed
# audience endpoint (src/pages/api/audience.json.ts) and the live deck page
# that polls it are on-demand, so this needs a real process, not nginx. The
# node adapter's standalone server serves the prerendered static output
# itself, so this one process is the whole app.
FROM node:22-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
ENV HOST=0.0.0.0
# Same port nginx used to listen on, so Dokploy's existing port mapping for
# this service doesn't need to change alongside the image.
ENV PORT=80
EXPOSE 80
CMD ["node", "./dist/server/entry.mjs"]
