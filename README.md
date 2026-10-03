# dhrumkit.com

Astro site: About page (`/`) and Writing (`/writing/`).

## Run

```sh
npm install
npx playwright install chromium   # once, for e2e tests
npm run dev        # http://localhost:4321 (drafts visible)
npm run check      # type-check .astro/.ts files
npm run build      # static output in dist/ (drafts excluded)
npm run preview    # serve dist/ locally
npm run test:e2e   # build + Playwright against preview (desktop 1440 + Pixel 7)
npm test           # check + e2e — what CI runs
```

Failed e2e runs leave traces in `test-results/`; open with `npx playwright show-report`.

## Structure

```
src/
  site.ts                          name, description, email, social links (edit here only)
  content/posts/<slug>/index.mdx   one folder per post; folder name = URL
  content/posts/<slug>/*.astro     figures used only by that post
  components/
    Sidenote.astro                 margin note ≥1024, tap-to-expand inline <1024 (no JS)
    Listing.astro                  code block frame + registration corners, never wraps
    Divider.astro                  dimension-line section divider
    Seo.astro                      title, canonical, Open Graph, favicon, feeds
  layouts/Base.astro               site band (logo centre), fonts, small page scripts
  layouts/Post.astro               post header band, 7-track grid, contents rail
  lib/posts.ts                     getPosts() / postUrl() — the only post query
  lib/remark-reading-time.mjs      computes reading time
  lib/remark-sidenotes.mjs         numbers <Sidenote>s in document order
  pages/writing/[...slug].astro    one route for every post
  styles/global.css                tokens, grid, breakpoints, components
  styles/shiki-cyanotype.mjs       code highlighting palette
tests/site.spec.ts                 Playwright e2e suite
public/logo-bone.svg, favicon.svg
```

## Breakpoints

| Mode    | Width      | Behaviour |
|---------|------------|-----------|
| base    | < 640      | Single column. Notes collapse to tap-to-expand. Code + figures full-bleed; code scrolls (SCROLL → hint only when it overflows). Figure uses − / + stepper and 44px presets. |
| tablet  | 640–1023   | 600px measure, figure breaks out to 672px. Notes inline. Touch controls. |
| desktop | 1024–1439  | 200px margin column: sidenotes + captions move there. Slider replaces stepper (only with a fine pointer). |
| wide    | ≥ 1440     | 680px measure, 224px margin, sticky contents rail. Extra width is outer whitespace. |

Test at 375, 390, 430, 768, 1024, 1440, 1920. Test the figure controls on a real phone.

## Writing posts

```sh
mkdir src/content/posts/my-new-post && $EDITOR src/content/posts/my-new-post/index.mdx
```

```mdx
---
title: My new post
dek: One-sentence summary.
series: Streaming Systems
number: "015"
date: 2026-10-10
draft: true            # remove to publish
---
Sentence that needs a note.<Sidenote>Note text.</Sidenote>

<Listing title="LST. 02 — SQL">

\`\`\`sql
select 1;
\`\`\`

</Listing>

<Divider label="§ 02" />

## Heading
```

`Sidenote`, `Listing` and `Divider` need no import. Sidenotes number themselves. Reading time and the contents rail (from `##` headings) are computed; set `readingTime` or `sections` in front-matter only to override. The URL, writing index, RSS and sitemap update automatically.

## Deploy

Cloudflare Workers (static assets), worker `bold-queen-7c1d`, custom domain `dhrumkit.com`. Config: `wrangler.jsonc`.

- Work on a branch: `post/…` (posts), `feat/…`, `fix/…`, `docs/…`, `chore/…`.
- Open a PR into `main`. CI (type check + e2e) must pass; Cloudflare posts a preview URL.
- Merging into `main` deploys to production.

Cloudflare build settings: build command `npm run build`, deploy command `npx wrangler deploy`, non-production branch deploy command `npx wrangler preview` (needs the `previews` block in `wrangler.jsonc`).

## Notes

- Fonts load from Google Fonts. For self-hosting, swap the `<link>` in Base.astro for `@fontsource-variable/newsreader` + `@fontsource-variable/jetbrains-mono`.
- Grain sits on `body::before` at `z-index: -1`; it never overlays text.
