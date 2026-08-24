import { defineConfig } from 'vite';

export default defineConfig({
  // Served at cobusnel.com/calculator via a Vercel rewrite from the main
  // site. The base makes every emitted asset URL /calculator/... so the
  // proxy catches them. Set this back to '/' only if the page ever moves
  // to its own hostname.
  base: '/calculator/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
});
