# Deploying to Cloudflare Pages

Everything in the codebase is launch-ready. What remains is buying the domain and
connecting it. Roughly 20 minutes.

## 1. Buy the domain

`vtdispensarydirectory.com` is referenced throughout the code (`src/config/site.ts`,
`astro.config.mjs`, `public/robots.txt`). If you buy a different domain, change it in
`src/config/site.ts` and `astro.config.mjs` and rebuild.

Buying through Cloudflare Registrar makes step 3 automatic. Any registrar works; you
will just point nameservers at Cloudflare yourself.

## 2. Create the Pages project

In the Cloudflare dashboard: **Workers & Pages > Create > Pages > Connect to Git**,
then pick `Fast-Frigate/vt-dispensary-directory`.

Build settings:

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22` or higher |

Node 22 matters: `package.json` sets `engines.node >= 22.12.0`. Set a
`NODE_VERSION` environment variable to `22` if the default is older.

`.npmrc` already sets `legacy-peer-deps=true`, which is what makes the install
succeed on Cloudflare.

## 3. Connect the domain

**Custom domains > Set up a custom domain**, enter the apex domain, and add `www`
as a second custom domain if you want it. Cloudflare issues the certificate.

Then verify:

```bash
curl -sI https://vtdispensarydirectory.com/ | head -1
```

## 4. Set the analytics environment variables

Under **Settings > Environment variables**, add these to the Production environment,
then trigger a redeploy. All three are optional and the site builds fine without
them, so you can launch first and add them after.

| Variable | Where it comes from |
|---|---|
| `PUBLIC_CF_BEACON_TOKEN` | Set. Cloudflare dashboard > Web Analytics > Manage site > the token in the JS snippet. Automatic injection was tried first and never added the beacon, so this site uses manual snippet installation, which keeps the tag in version control where you can see it. |
| `PUBLIC_GA4_ID` | GA4 property > Data Streams > Measurement ID, format `G-XXXXXXXXXX` |
| `PUBLIC_GSC_VERIFICATION` | Search Console > add property > HTML tag method, copy the `content` value |

These are build-time variables. Changing one requires a redeploy to take effect.

## 5. Search Console

Once the domain resolves, add the property in Google Search Console. If you verify
by DNS through Cloudflare you can skip `PUBLIC_GSC_VERIFICATION` entirely.

Then submit the sitemap: `https://vtdispensarydirectory.com/sitemap-index.xml`

## What is already handled

- Security headers via `public/_headers`
- `robots.txt` pointing at the sitemap, disallowing `/affiliate/click/`
- Sitemap generation excluding affiliate redirects (205 indexable URLs)
- `og-default.png` for social previews
- GA4 loaded under Consent Mode v2, denied until the visitor accepts
- Cloudflare Web Analytics, cookieless, needs no consent
- 21+ banner that does not block crawlers or content

## Refreshing dispensary data

Data is verified against Google Business Profiles. To refresh:

```bash
rm scripts/gbp-cache.json && node scripts/fetch-gbp.mjs && node scripts/merge-gbp.mjs
```

Needs `DATAFORSEO_LOGIN` and `DATAFORSEO_PASSWORD` in `.env`. Costs about $0.60 per
full run. This is authoring-time only; Cloudflare never needs these credentials.

Rebuild and commit the updated `src/data/dispensaries.ts` afterwards. See
`DATA-STATUS.md` for what is verified and what still needs manual research.
