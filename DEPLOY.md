# Putting this live at cobusnel.com/calculator

## What the DNS already tells us

```
cobusnel.com            A      216.198.79.1              (Vercel anycast)
www.cobusnel.com        CNAME  ...vercel-dns-017.com     (Vercel)
eridanus-diagnostic     A      216.198.79.3 / 64.29.17.3 (Vercel)
```

cobusnel.com is already served by Vercel. **There is nothing to do in GoDaddy.**
DNS resolves hostnames, not paths, so no DNS record can ever point
`cobusnel.com/calculator` anywhere. A subpath is a routing decision made by
whatever already answers for `cobusnel.com` — which is Vercel.

GoDaddy only becomes relevant if you take the subdomain route instead
(`calculator.cobusnel.com`), which is one CNAME. See "Rejected" below.

## Recommended: rewrite from the main site

Two projects stay separate and deploy independently. One public URL.

### 1. In the **cobusnel.com** repo

Add or merge into `vercel.json` at the repo root:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/calculator",
      "destination": "https://eridanus-diagnostic.vercel.app/"
    },
    {
      "source": "/calculator/:match*",
      "destination": "https://eridanus-diagnostic.vercel.app/:match*"
    }
  ],
  "redirects": [
    { "source": "/diagnostic", "destination": "/calculator", "permanent": true },
    { "source": "/investments", "destination": "/calculator", "permanent": true }
  ]
}
```

The second rewrite is the one people forget. Without it the HTML loads and
every asset 404s, because the browser asks for `/calculator/assets/index.js`
and nothing is routed there.

If `vercel.json` already exists, merge the arrays. Do not replace the file.

### 2. In **this** repo

Already done:

- `vite.config.js` sets `base: '/calculator/'`, so every emitted URL is
  `/calculator/...` and the rewrite above catches it.
- The photo constants in `main.js` use `import.meta.env.BASE_URL`, so they
  follow the base instead of hardcoding a leading slash.
- `canonical` and the OG tags point at `https://cobusnel.com/calculator`, so
  the raw `.vercel.app` URL does not compete with it in search or on shares.

### 3. Ship and check

```bash
git add -A && git commit -m "Serve diagnostic under /calculator" && git push
```

Then, in order:

1. `https://cobusnel.com/calculator` renders.
2. DevTools Network tab: no 404s. This is the failure mode to look for.
3. `https://cobusnel.com/investments` 308s to `/calculator`.
4. Submit one test lead. Confirm the row lands in the sheet.
5. Meta Events Manager, Test Events: PageView and Lead both fire, and the
   event source URL reads `cobusnel.com`, not the vercel.app domain.

## Why /calculator and not /investments

`/calculator` names the thing the page is. Every button on it already says
"Run My Diagnostic" and "Show Me My Capital Gap"; the URL, the ad copy and
the page all agree, which is what the Meta crawler and a cold investor are
both checking. It also promises a tool rather than a pitch, which is a much
lower-commitment click from an ad.

`/investments` reads as a category page and sets up an offer the page does
not deliver: a visitor who clicks "investments" expects to see what Eridanus
invests in, hits a slider instead, and bounces. It is also a stronger claim
surface under Meta's financial-services rules than a diagnostic tool is.
Keep it free for a real investments overview later, and 308 it to
`/calculator` in the meantime so a typed guess still lands somewhere.

The counterargument, honestly stated: `/investments` would match a far larger
query class for the AI-search and GEO visibility work. That is a real cost.
It is outweighed by the intent mismatch, and the right fix is to eventually
build the page that genuinely belongs at `/investments`.

## Do this before the lead campaign goes on, not after

The Cobus lead campaign is built and paused with roughly R7.9k of the R10k
left. Changing an ad's destination URL after it is running restarts the
learning phase on that ad set. Right now the change is free. Set the
destination to `https://cobusnel.com/calculator` when you publish, with the
UTM string on each ad.

## Rejected alternatives

**Subdomain (`calculator.cobusnel.com`).** One CNAME in GoDaddy to
`cname.vercel-dns.com`, then add the domain in the Vercel project. Fifteen
minutes, near-zero risk. Rejected because it splits the cookie domain: the
pixel would set first-party cookies on a different host from the main site,
which weakens attribution across the profile funnel, and it shows a longer,
less trusted display domain in the ad.

**Merge this project into the cobusnel.com repo as a real route.** Better
long term: no proxy hop, one deploy, one analytics context, no second project
to keep in sync. Rejected for now only because it means touching the
Manus-generated main site while a campaign is about to launch. Worth doing
once the campaign is stable.

**Anything in GoDaddy.** There is no DNS record that routes a path.
