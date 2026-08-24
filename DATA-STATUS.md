# Data status

Last verification pass: **2026-08-24**, source: Google Business Profile via DataForSEO.

Refresh with `node scripts/fetch-gbp.mjs && node scripts/merge-gbp.mjs` (delete `scripts/gbp-cache.json` first to force a re-fetch).

## Coverage

- Street address: 100/110
- ZIP: 100/110
- Coordinates: 100/110
- Phone: 94/110
- Hours: 96/110
- Description: 95/110
- Features: 100/110
- Website: 106/110
- Menu URL: 2/110

## Needs manual research (10)

No Google Business Profile match. These render without address, phone, hours, or CTAs.

| Slug | Name | Town | License | Note |
|---|---|---|---|---|
| `cann-maxx-brattleboro` | Cann Maxx | Brattleboro | RTLR0040 | No GBP match found. |
| `emeraldrose-retail` | Emeraldrose Retail | Bristol | RTLR0021 | No GBP match found. |
| `upstate-elevator-dispensary` | Upstate Elevator Dispensary | Burlington | RTLR0004 | No GBP match found. |
| `vt-bud-barn` | VT Bud Barn | Derby | RTLR0015 | No GBP match found. |
| `clean-country-dispensary` | Clean Country Dispensary | Johnson | RTLR0091 | GBP returned *Notch Nugs Dispensary* (Jeffersonville). Rejected as a different business. |
| `cann-maxx-manchester-center` | Cann Maxx | Manchester Center | RTLR0065 | No GBP match found. |
| `big-intelligence-group` | Big Intelligence Group | Morrisville | RTLR0038 | No GBP match found. |
| `vermont-terps-cannabis` | Vermont Terps Cannabis | Pittsford | RTLR0066 | GBP collided with `montyvtstore` on the same place_id. Rejected. |
| `bwell-vt` | BWell VT | Poultney | RTLR0078 | GBP returned *Poultney Cannabis Supply Dispensary*. Same town, different name — possible rebrand, verify. |
| `royal-bud` | Royal Bud | Pownal | RTLR0112 | GBP returned *Rambler Cannabis Supply*. Same town, different name — possible rebrand, verify. |

## Marked inactive (4)

Google reports these as temporarily closed. Confirm against the CCB licensee list before relisting or removing.

| Slug | Name | Town |
|---|---|---|
| `forbins-reserve` | Forbins Reserve | Barre |
| `the-greenhouse` | The Greenhouse | Brandon |
| `craftsbury-cannabis` | Craftsbury Cannabis | Craftsbury |
| `west-street-cannabis` | West Street Cannabis | Rutland |

## Address moved since the CCB record (3)

Listed town comes from the license record; Google shows a different town. Decide which is current — it changes the town/county browse pages.

| Slug | Listed | Google says |
|---|---|---|
| `ideal-cannabis` | Sharon | South Royalton |
| `vermont-patients-alliance` | Waterbury Ctr | Montpelier |
| `woolly-mammoth-cannabis` | Woodstock | Bridgewater |

## Matched but no published hours (4)

`forbins-reserve`, `the-greenhouse`, `craftsbury-cannabis`, `west-street-cannabis`

## Known gaps

- `medicalProgram`, `veteranDiscount`, `seniorDiscount`, `firstTimeDiscount`, `loyaltyProgram`, `atm` have no Google signal and are `false` everywhere. They are deliberately **not** offered as filters. Fill editorially or drop from the type.
- `menuUrl` is set for only 2 entries. Most dispensaries run Dutchie or Jane menus that GBP does not expose; scraping each site is the likely source.
- Some seed `website` values were invented (11 of 26 checked did not resolve in DNS). The merge prefers the Google-verified URL wherever one exists.
- Four entries carried the literal string `"No website"` in the `website` field, which rendered a Visit Website button linking to a 404. Now null: `judys-holistic-solution`, `cann-maxx-manchester-center`, `bwell-vt`, `royal-bud`.
- 37 Google-supplied URLs were `http://`; all 37 were confirmed to serve HTTPS and were upgraded. `scripts/merge-gbp.mjs` now upgrades the scheme automatically on future refreshes.
