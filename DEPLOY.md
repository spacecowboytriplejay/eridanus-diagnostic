# Getting this live

## The one thing that causes the blank white page

Vite's `base` decides what path the built HTML asks for its JavaScript and
CSS from. It has to match where the page is actually served.

| `base` | Works at | Blank page at |
|---|---|---|
| `'/'` | `eridanus-diagnostic.vercel.app` and `calculator.cobusnel.com` | `cobusnel.com/calculator` |
| `'/calculator/'` | `cobusnel.com/calculator` behind a rewrite | any bare hostname |

They are mutually exclusive. A blank white page with no console errors is
almost always this: the HTML loaded, then asked for assets at a path that
does not exist on that host.

**This repo is set to `base: '/'`.** It works standalone. Do not change it
unless you deliberately move to a subpath, and if you do, expect the bare
vercel.app URL to go blank.

## Recommended: calculator.cobusnel.com

A subdomain rather than a subpath. It is on the domain, so it carries the
brand in an ad, and it needs no proxy, no rewrite and no path juggling.

1. Vercel → the `eridanus-diagnostic` project → Settings → Domains → Add
   `calculator.cobusnel.com`
2. Vercel shows you a CNAME record. Add it at whatever hosts cobusnel.com's
   DNS. It will look like:

       Type   CNAME
       Name   calculator
       Value  cname.vercel-dns.com

3. Wait for Vercel to show the domain as Valid. Usually a few minutes, and
   the TLS certificate is issued automatically.
4. Load `https://calculator.cobusnel.com` and confirm the tab title reads
   "Capital Diagnostic | Cobus Nel".

That is the URL to put in the ads.

## Alternative: cobusnel.com/calculator

Only if you specifically need the subpath. It is more fragile, because you
are proxying one Vercel project through another.

1. Set `base: '/calculator/'` in `vite.config.js` and redeploy this project
2. In the **cobusnel.com** repo's `vercel.json`:

```json
"rewrites": [
  { "source": "/calculator", "destination": "https://eridanus-diagnostic.vercel.app/" },
  { "source": "/calculator/:match*", "destination": "https://eridanus-diagnostic.vercel.app/:match*" }
]
```

Both lines. The second is the one people leave out, and without it the HTML
loads while every asset 404s. You would also need to repoint the canonical,
`og:url` and `og:image` in `index.html` back to the `/calculator` paths.

## Before you spend money on it

1. `main.js`, `SHEET_ENDPOINT_URL` — replace `PASTE_APPS_SCRIPT_URL_HERE`
   with the Apps Script web app URL used on cobusnel.com/apply. Until then
   the form shows an honest error and captures nothing.
2. `index.html` — uncomment the two `fbq(...)` lines and insert Cobus's own
   Meta dataset ID. Not the FR Plus one.
3. Submit one real test lead and watch it land in the sheet. The Apps
   Script call is `mode: 'no-cors'`, so the browser cannot tell you whether
   it worked. The sheet is the only proof.
4. Fix the `manuscdn` images on the root site. See `BRAND-SEARCH.md`.

## Verifying a deploy in ten seconds

Open the URL, then check in this order:

- Tab title says "Capital Diagnostic | Cobus Nel"
- The page is dark and the headline reads "Your capital is working. For whom?"
- The "As Seen On" row shows four white logos, not four broken icons
- DevTools → Network → filter by Status, nothing in red

## Funnel discipline (changed 24 Aug)

Every call to action on this page now points at `#lead-form-section`, the
form on this page. Nothing else. The count went from 17 outbound links to 2.

What was removed and why:

| Removed | Why |
|---|---|
| 5x "Apply for a Discovery Session" to `cobusnel.com/apply` | The primary CTA was the biggest leak. It sent the highest-intent traffic to a second form on a second domain while the form on this page went unused. |
| Nav wordmark + `cobusnel.com` link | Pure exit, no purpose |
| Hero "What is Eridanus?" | Sat as a co-equal CTA and shipped cold traffic off-site before it had engaged with anything |
| "Full biography" | Meet the Architect already tells that story on-page |
| 2x "Watch on YouTube" | The embed plays inline on click; the link was a redundant exit |
| Footer nav column | Four more exits for no gain |

What was deliberately KEPT:

- **Privacy Policy and Terms of Service**, in the footer, opening in a new
  tab. These are not a UX choice. The form collects personal data and the
  consent checkbox references POPIA. A page collecting personal data under a
  POPIA consent statement, with no reachable privacy policy, is a compliance
  problem regardless of how tight you want the funnel. New tab means the page
  survives the click.
- **The video embeds.** They play inline. They are proof, not an exit.

`APPLY_URL` is now `#lead-form-section`. If you ever need to point it back at
a real page, change that one constant and every CTA follows.

**Consequence worth understanding:** the form is now the only way to convert
on this page. If `SHEET_ENDPOINT_URL` is still the placeholder when you spend,
the page converts at exactly zero. There is no longer a second path.
