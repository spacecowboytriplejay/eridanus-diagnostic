# Eridanus Capital Diagnostic

Calculator landing page for the Cobus Nel personal brand. Vanilla JS + Vite,
deploys as a static site to Vercel.

```
npm install
npm run dev      # local
npm run build    # -> dist/
```

## Structure

| File | What it holds |
|---|---|
| `main.js` | Every section. Layout is written inline; this file is the page. |
| `style.css` | Design tokens, primitives, the diptych, and the responsive overrides. |
| `index.html` | Meta, OG tags, fonts, Meta Pixel and GA slots, `#app` mount. |
| `public/` | The two architect photos, the icon set, the share card, the manifest. |
| `brand-assets/` | The icon set + both share cards, for uploading to the **root** of cobusnel.com. Not used by this build. |
| `ROOT-SITE-HEAD.html` | The `<head>` block to paste into the cobusnel.com home page. |
| `BRAND-SEARCH.md` | Why the Google result shows a globe, and the order to fix it in. |
| `DEPLOY.md` | Getting this live at cobusnel.com/calculator. |

## Before this goes back in front of paid traffic

1. **`SHEET_ENDPOINT_URL` in `main.js` is still `PASTE_APPS_SCRIPT_URL_HERE`.**
   Paste the Apps Script web app URL used on cobusnel.com/apply. Until then the
   form refuses to submit and says so, rather than showing fake success.
2. **Meta Pixel is commented out in `index.html`.** Add Cobus's own dataset ID.
   Do not reuse the FR Plus pixel.
3. **The four "As Seen On" logos still load from `files.manuscdn.com`,** a
   third-party session CDN. Download them into `public/` and update the
   constants at the top of `main.js`.
4. Submit one test lead and confirm it lands in the sheet before any spend.
5. The favicon in the Google result for cobusnel.com comes from the **root
   site**, not from here. See `BRAND-SEARCH.md`.

## Changelog — 24 Aug 2026

- Filled both architect photo slots with the studio portrait and the field
  shot, presented as a labelled diptych (`.diptych` in `style.css`).
- Fixed four grids that never collapsed on mobile: the video pair, the
  architect photos, the old-way/HALO comparison, and the Why HALO row. Two
  carried a duplicate `class` attribute, which HTML silently discards; two had
  no responsive class at all.
- Lead form no longer shows "You're in" when the submission had nowhere to go.
- `@keyframes float` now animates `translate`, not `transform`, so it stops
  clobbering the hero HALO letters' centring transform.
- Anchor targets get `scroll-margin-top` so `#diagnostic` clears the fixed nav.
- OG image self-hosted instead of pointing at the expiring CDN.

## Changelog — 24 Aug 2026, later

- Built the brand icon set: a gold serif N in a gold ring on black, chosen
  after testing five candidates at 16-96px on light and dark search
  backgrounds. Multi-resolution `.ico`, vector SVG, Apple touch icon,
  Android maskable, web manifest.
- Two 1200x630 share cards: one for the home page, one for the calculator.
- Added JSON-LD to this page (WebPage + WebApplication) and wrote the full
  Person/Organization/WebSite graph for the root site.
- Tightened title to 30 chars and description to 151, both inside what
  Google actually renders.
- Removed `maximum-scale=1` from the viewport meta. It blocked pinch-zoom
  on a page that is mostly read on phones.
