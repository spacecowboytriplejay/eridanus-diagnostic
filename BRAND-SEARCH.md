# How cobusnel.com shows up in Google and in AI answers

## What is wrong right now

The live search result shows a generic globe instead of an icon, because
**cobusnel.com declares no favicon at all.** There is no `<link rel="icon">`
in the home page head, no `/favicon.ico`, nothing. Google has nothing to
show, so it shows its placeholder.

Two more things I found while checking:

1. **Google is ignoring the meta description.** The snippet in the live
   result reads "…acquiring real South African agricultural assets …
   tax-efficient structures," which is not the meta description text. That
   is Google writing its own snippet from body copy, which it does when the
   supplied description is too long or too weakly matched. The current one
   is 197 characters against a render limit near 155.
2. **No structured data anywhere on the site.** Nothing tells Google,
   ChatGPT, Perplexity or Gemini that Cobus Nel is a person, that his role
   is CIO, that Eridanus is the organisation, or that FSP 48947 is a
   regulator-issued identifier. They are inferring all of it from prose.
   For a brand whose entire pitch is verifiable legitimacy, that is the
   cheapest credibility on the table and it is currently unclaimed.

## The mark

A gold serif **N** inside a gold ring on black.

I tested five candidates at 16, 24, 32, 48 and 96 pixels on both light and
dark search backgrounds before choosing. Findings:

- A **CN** monogram was unreadable at 16px. Two serif letters mush together
  at that size. This is the most common favicon mistake and it is why so
  many are illegible in a results list.
- An abstract mark (I tried a keystone and an arch) held its shape but
  nobody can connect a trapezoid to Cobus Nel. Beautiful and meaningless.
- A single **N** stayed legible down to 16px, and the letterform is drawn
  from Cormorant Garamond, the site's own display face. The favicon is
  literally a piece of the existing brand rather than a new invention.
- The **ring is what makes it work.** Without it the icon reads as a dark
  blob at 16px on a white results page. With it the mark has a defined
  edge on white and on dark, and at large sizes it reads as a seal, which
  suits a regulated financial brand far better than a bare letter.

Gold on black is also simply loud in context: a financial-services results
page is wall-to-wall blue circles and grey wordmarks.

The SVG carries the glyph as a vector path, so it needs no webfont and
cannot break if the font ever fails to load.

## What ships

In `brand-assets/`, all destined for the **root** of cobusnel.com:

| File | Purpose |
|---|---|
| `favicon.ico` | 16, 24, 32, 48, 64, 128, 256 in one file. The 16 and 24 frames are drawn with a proportionally heavier ring so they survive the size. |
| `favicon.svg` | Vector, preferred by modern browsers |
| `apple-touch-icon.png` | 180x180, opaque. iOS composites on white and applies its own rounding, so it cannot be transparent. |
| `icon-192.png`, `icon-512.png` | Android and PWA |
| `icon-512-maskable.png` | Android adaptive icons, 40% safe zone so the crop never clips the ring |
| `site.webmanifest` | Ties them together |
| `og-cobusnel.jpg` | 1200x630 share card for the home page |
| `og-calculator.jpg` | 1200x630 share card for the calculator (already in the calculator's `public/`) |

`ROOT-SITE-HEAD.html` holds the exact block to paste, with the tightened
title and description and the full JSON-LD.

## Order of operations

1. Upload the eight root files so `https://cobusnel.com/favicon.ico`
   resolves. Check it in a browser before going further.
2. Paste the block from `ROOT-SITE-HEAD.html` into the home page `<head>`.
3. Fill in or delete the two placeholder `sameAs` URLs. See below.
4. Confirm `robots.txt` blocks neither Googlebot nor Googlebot-Image from
   the home page or the icon files.
5. Search Console → URL Inspection on `https://cobusnel.com/` → Request
   Indexing.
6. Validate the JSON-LD at `search.google.com/test/rich-results`.
7. Re-scrape the share card at `developers.facebook.com/tools/debug/` and
   `linkedin.com/post-inspector/`, because both cache the old OG image
   aggressively and will keep serving it otherwise.

**Google takes several days to several weeks to refresh a favicon**, and it
is not guaranteed even when everything is correct. Do not expect it
tomorrow, and do not keep changing the file, because URL stability is one
of the things Google weighs.

## The one line I could not write for you

In the JSON-LD `Person` block, `sameAs` is the array that tells an AI
assistant the Cobus Nel on LinkedIn, the one on YouTube and the one on this
site are one entity rather than three. It is the highest-leverage line in
the whole block for AI-search visibility.

I put the Instagram profile in. I do not have his LinkedIn or YouTube URLs
and I will not guess them, because a wrong `sameAs` is worse than a missing
one: it asserts an identity link that is false. Fill them in or delete the
placeholders before shipping.

## An argument against part of this

Structured data and a favicon will not move rankings on their own. They
change how an existing result *presents*, and they give AI systems clean
facts to repeat. The thing that actually moves both is the corroboration
that already exists off-site and is currently doing nothing: the kykNET and
Ontbytsake appearances, the FSCA register entry, the Pretoria FM interview.

If the goal is for ChatGPT to answer "who is Cobus Nel" correctly and
confidently, the highest-value work is not this markup. It is making sure
those third-party mentions are crawlable, named consistently ("Cobus Nel,
CA(SA), Chief Investment Officer of Eridanus" every time, never a variant),
and linked from the site. The markup tells the machines what to think. The
citations are what make them believe it.

## Sources

- [Define a favicon to show in search results — Google Search Central](https://developers.google.com/search/docs/appearance/favicon-in-search)
- [General structured data guidelines — Google Search Central](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
