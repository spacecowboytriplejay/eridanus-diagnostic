import { defineConfig } from 'vite';

export default defineConfig({
  // Root-relative. This build is served from its own hostname
  // (calculator.cobusnel.com), so assets resolve at /assets/...
  //
  // Only change this to '/calculator/' if you move the page to a SUBPATH of
  // the main site behind a Vercel rewrite. The two are mutually exclusive:
  // a '/calculator/' base produces a blank page on the bare hostname, which
  // is exactly what a subpath build looks like when it is served at a root.
  base: '/',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
});
