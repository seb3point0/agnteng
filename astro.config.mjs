// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // React islands for interactive components; static .astro for everything else.
  integrations: [react()],

  // Tailwind v4 is wired in as a Vite plugin (no separate config file needed).
  vite: {
    plugins: [tailwindcss()],
  },

  // Exposed on the LAN/host so the site is reachable via an sslip.io hostname.
  // host:true binds 0.0.0.0; allowedHosts lets the Vite dev server accept the
  // sslip.io Host header (it otherwise blocks non-localhost hosts).
  server: {
    host: true,
    port: 4321,
    allowedHosts: ['.sslip.io', '.nip.io'],
  },
});
