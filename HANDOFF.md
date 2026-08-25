# VT Dispensary Directory — Handoff

Status as of 2026-08-24 (updated after the data-verification pass). Written for whoever (human or Claude Code) picks this up next to finish and launch it.

## What this is

A statewide directory of licensed Vermont cannabis dispensaries — browse by town/county, individual dispensary profile pages, filtering by features (delivery, online ordering, accessibility, etc.), with an affiliate click-tracking layer on outbound links. Built as a fast, SEO-first static site, not a web app.

## Stack

- **Astro 6**, static output (`output: "static"`, `build.format: "directory"`)
- Tailwind CSS, `@astrojs/react` installed but not actually used yet
- `@astrojs/sitemap` configured (excludes `/affiliate/click/*`)
- Node `>=22.12.0`
- Repo: `github.com/Fast-Frigate/vt-dispensary-directory`, branch `main`, working tree clean, 7 commits
- Deploy target: Cloudflare Pages (see `public/_headers`, `.npmrc` with `legacy-peer-deps=true` added specifically to fix a CF Pages peer-dep resolution issue)
- Domain: `vtdispensarydirectory.com` — **does not currently resolve / is not live.** Confirm registration and the Cloudflare Pages custom-domain hookup before anything else matters.

`.env` holds `DATAFORSEO_LOGIN` / `DATAFORSEO_PASSWORD`, used only by `scripts/fetch-gbp.mjs` at
authoring time. It is gitignored and the built site needs no secrets.

## What already works

- Homepage (`src/pages/index.astro`) — hero, stats, browse-by-town grid
- Full directory listing with client-side filters (`src/pages/dispensaries/index.astro`)
- Individual dispensary profile pages (`src/pages/dispensaries/[slug].astro`) — hours, features, tags, nearby dispensaries, schema.org JSON-LD
- Browse by town / by county (`src/pages/dispensaries/by-town/`, `by-county/`)
- `DispensaryCard` component, `Header`/`Footer`/`SEOHead` layout components
- `robots.txt`, sitemap integration, security headers via `public/_headers`

## Status

### 1. Data completeness — mostly resolved, see `DATA-STATUS.md`

Backfilled 2026-08-24 from Google Business Profile via DataForSEO. 100 of 110 entries now
carry a real address, ZIP, coordinates, phone, hours, description, and features.

Three problems the original audit missed, all now fixed:

- **Hours were fabricated.** All 110 entries shared one identical hours block, and it was
  being emitted as `openingHoursSpecification` JSON-LD. Real hours now come from GBP;
  entries without verified hours emit no hours schema and say so on the page.
- **All 12 feature flags were `false` on all 110 entries**, so every feature filter returned
  zero results. Features now derive from GBP attributes. Filters only offer the six
  features that have real coverage.
- **`cann-maxx` was a duplicate slug** covering two different businesses (RTLR0040
  Brattleboro, RTLR0065 Manchester Center). One page silently overwrote the other. Both
  now have their own page.

Also: `unknown-county` was on 37 entries, not one. All resolved from the town name. And a
sample check found 11 of 26 seed `website` values did not resolve in DNS, so some were
invented — the merge now prefers the Google-verified URL.

**Still outstanding:** 10 entries have no GBP match and need manual research, 4 are marked
inactive (temporarily closed per Google), and 3 appear to have moved town since their
license record. All enumerated in `DATA-STATUS.md`. `menuUrl` is still nearly empty (2/110);
most dispensaries run Dutchie or Jane menus that GBP does not expose.

### 2. Missing pages — done

Every route linked from the header and footer now exists. Built this pass:

| Route | What it is |
|---|---|
| `/about/` | Methodology, data sources, ranking policy, how the site is funded |
| `/advertise/` | Three sponsorship tiers, with the no-paid-ranking rule stated |
| `/compare/` | Pick up to three verified dispensaries, compare side by side |
| `/map/` | Leaflet + OpenStreetMap, 100 plotted dispensaries, searchable list |
| `/news/` | Index plus three factual explainers on Vermont cannabis rules |
| `/strains/` | Index plus eight strain reference profiles |
| `/vermont-cannabis-guide/` | The flagship guide, with FAQ schema |
| `/affiliate/` | Affiliate disclosure |
| `/privacy/`, `/terms/` | Legal pages, linked in the footer |
| `/dispensaries/by-county/` | The county index the footer was already linking to |

Content collections are configured in `src/content.config.ts` (`news` and `strains`,
both schema-validated). Adding a post means dropping a markdown file in
`src/content/news/`; no code changes needed.

The `counties`, `dispensaries`, `guides` and `towns` collection folders are still
empty. Nothing links to them and nothing breaks; delete them or fill them later.

### 3. Missing infrastructure — done

- **Analytics wired.** Cloudflare Web Analytics (cookieless) plus GA4 under Consent
  Mode v2, denied until the visitor accepts. Plus a GSC verification meta tag. All
  three read build-time env vars from `src/config/site.ts`, so the repo carries no
  account IDs and the site builds fine with none of them set. See `DEPLOY.md`.
- **`public/og-default.png` created**, 1200x630, in the site palette.
- **Affiliate click tracking fixed, and it was worse than the last audit thought.**
  The redirect itself was broken, not just the logging: `Astro.url.searchParams` is
  evaluated at *build* time on a static build, so every one of the 110 redirect pages
  shipped with `to = "/"` hardcoded. Every affiliate link on the site sent visitors to
  the homepage instead of the dispensary. Destinations are now baked in per-slug at
  build time and selected client-side by `?target=`, which also closes the open-redirect
  hole the old `?to=` parameter left open. Clicks fire an `affiliate_click` analytics
  event instead of hitting an API route that never existed.
- **21+ age gate added** as a dismissible bar, deliberately not a blocking modal, so
  the directory stays crawlable. Choice persists in localStorage and doubles as the
  analytics consent signal.
- **Privacy policy and terms written** and linked in the footer. They describe
  accurately what the site does. They have *not* been reviewed by a lawyer.
- `worker/menu-status/` is still an empty directory. It is not tracked by git (git
  does not track empty directories), so it exists only in local working copies and has
  no effect on the build. Delete it locally if it bothers you.

### 4. Deployment — the only thing left

Buy `vtdispensarydirectory.com` and connect it to a Cloudflare Pages project.
Step-by-step instructions, including the exact build settings and the three analytics
environment variables, are in **`DEPLOY.md`**.

`npm run build` succeeds locally in under two seconds and produces 315 pages, 205 of
them in the sitemap. The rollup native-binary error the first audit hit was a sandbox
artifact.

## File map

| Path | Purpose |
|---|---|
| `src/data/dispensaries.ts` | Single source of dispensary data (110 entries), verified 2026-08-24 |
| `src/types/dispensary.ts` | `Dispensary` type definition |
| `src/pages/index.astro` | Homepage |
| `src/pages/dispensaries/index.astro` | Full directory with client-side filters |
| `src/pages/dispensaries/[slug].astro` | Dispensary detail page |
| `src/pages/dispensaries/by-town/`, `by-county/` | Location browse pages |
| `src/pages/affiliate/click/[slug].astro` | Outbound click redirect (tracking currently broken) |
| `src/components/layout/Header.astro`, `Footer.astro`, `SEOHead.astro` | Layout/shared components |
| `src/components/directory/DispensaryCard.astro` | Card used on all listing pages |
| `astro.config.mjs` | Site URL, sitemap config, static output settings |
| `public/_headers` | Cloudflare Pages security headers |
| `public/robots.txt` | Points at `/sitemap-index.xml` |
| `worker/menu-status/` | Empty — intended for live menu status, not built |
| `src/config/site.ts` | Site constants and the build-time analytics env vars |
| `src/layouts/Page.astro` | Shared shell used by the editorial and legal pages |
| `src/content.config.ts` | Schemas for the `news` and `strains` collections |
| `src/components/layout/Analytics.astro` | CF Web Analytics, GA4 consent mode, outbound click event |
| `src/components/layout/AgeGate.astro` | 21+ bar, doubles as the analytics consent prompt |
| `DEPLOY.md` | Cloudflare Pages setup, domain, and env vars |
| `scripts/fetch-gbp.mjs` | Pulls GBP data for every dispensary into `scripts/gbp-cache.json` |
| `scripts/merge-gbp.mjs` | Merges that cache into `dispensaries.ts`; holds the rejected-match list |
| `DATA-STATUS.md` | Per-entry verification status and what still needs manual research |

## What is left

1. **Buy the domain and connect Cloudflare Pages.** See `DEPLOY.md`. This is the only
   thing standing between the current state and a live site.
2. **Have a lawyer read `/privacy/` and `/terms/`.** They accurately describe what the
   site does, but they are not legal advice and nobody qualified has reviewed them.
3. **Clear the `DATA-STATUS.md` follow-ups.** 10 dispensaries with no Google match, 4
   marked temporarily closed, 3 that appear to have changed town.
4. **Fill in `menuUrl`.** Only 2 of 110 have one. Most shops run Dutchie or Jane menus
   that Google does not expose, so this likely means scraping each site.
5. Optional: swap the placeholder `hello@vtdispensarydirectory.com` in
   `src/config/site.ts` for a real inbox before the advertise page goes live.

## Context

Two rounds of work have happened since the original scaffold. The first fixed the data:
fabricated opening hours, dead feature filters, a duplicate slug hiding a real business,
and 37 unresolved counties, then backfilled 100 of 110 listings from Google Business
Profiles. The second built every missing page, wired analytics and consent, fixed an
affiliate redirect that was sending every click to the homepage, and added the legal
pages and age gate.

The architecture never needed rework and still does not. What was missing was real data
and the pages the navigation already promised. Both are now in place.
