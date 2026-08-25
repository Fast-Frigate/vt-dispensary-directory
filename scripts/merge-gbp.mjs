// Merges scripts/gbp-cache.json into src/data/dispensaries.ts.
// Only writes fields actually attested by the Google Business Profile.
// Usage: node scripts/merge-gbp.mjs
import { readFileSync, writeFileSync } from "node:fs";

const VERIFIED_ON = "2026-08-24";

// Matches rejected on review: GBP returned a different business.
const REJECT = new Set([
  "clean-country-dispensary",  // GBP returned "Notch Nugs Dispensary" in Jeffersonville
  "vermont-terps-cannabis",    // collided on the same place_id as montyvtstore
  "bwell-vt",                  // GBP returned "Poultney Cannabis Supply Dispensary"
  "royal-bud",                 // GBP returned "Rambler Cannabis Supply"
]);

const MENU_HOSTS = ["dutchie.com", "iheartjane.com", "jane.com", "leafly.com", "weedmaps.com"];
const PROVIDER = { "dutchie.com": "dutchie", "iheartjane.com": "iheartjane", "jane.com": "jane", "leafly.com": "leafly" };

const path = new URL("../src/data/dispensaries.ts", import.meta.url);
const src = readFileSync(path, "utf8");
const head = src.slice(0, src.indexOf("["));
const arr = JSON.parse(src.slice(src.indexOf("["), src.lastIndexOf("] as unknown") + 1));
const cache = JSON.parse(readFileSync(new URL("./gbp-cache.json", import.meta.url), "utf8"));

const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, "").toLowerCase(); } catch { return null; } };
const clean = (u) => {
  try {
    const x = new URL(u);
    x.search = "";
    // GBP records plenty of these as http://; every one tested serves https.
    if (x.protocol === "http:") x.protocol = "https:";
    return x.toString();
  } catch { return u; }
};

function featuresFrom(g) {
  const a = new Set(g.attrs ?? []);
  const un = new Set(g.unavailable ?? []);
  return {
    delivery: a.has("has_delivery"),
    onlineOrdering: a.has("has_in_store_pickup") || a.has("has_curbside_pickup"),
    medicalProgram: false,
    veteranDiscount: false,
    seniorDiscount: false,
    firstTimeDiscount: false,
    loyaltyProgram: false,
    atm: a.has("has_atm"),
    parking: a.has("has_parking_lot_free") || a.has("has_onsite_parking") || a.has("has_wheelchair_accessible_parking"),
    accessible: a.has("has_wheelchair_accessible_entrance"),
    cashOnly: a.has("requires_cash_only"),
    debitAccepted: a.has("pay_debit_card") || a.has("pay_credit_card"),
    _un: un.size,
  };
}

let merged = 0, skipped = 0, closed = 0;
const flags = [];

for (const d of arr) {
  const g = cache[d.slug];
  if (!g || REJECT.has(d.slug)) { skipped++; continue; }

  if (g.address) d.address = g.address;
  if (g.zip) d.zip = g.zip;
  if (typeof g.lat === "number") d.lat = g.lat;
  if (typeof g.lng === "number") d.lng = g.lng;
  if (g.phone) d.phone = g.phone.replace(/^\+1/, "+1 ");
  if (g.description) d.description = g.description.split("\n")[0].trim().slice(0, 400);
  if (g.hours) d.hours = g.hours;

  const f = featuresFrom(g);
  delete f._un;
  d.features = f;

  // Prefer the Google-verified URL. A menu host goes to menuUrl, not website.
  if (g.url) {
    const h = host(g.url);
    if (MENU_HOSTS.includes(h)) {
      d.menuUrl = clean(g.url);
      if (PROVIDER[h]) d.menuProvider = PROVIDER[h];
    } else {
      d.website = clean(g.url);
    }
  }

  if (g.status === "temporarily_closed") { d.licenseStatus = "inactive"; closed++; }

  d._meta = { ...(d._meta ?? {}), rating: g.rating, googleReviews: g.votes, placeId: g.place_id };
  d.lastVerified = VERIFIED_ON;
  merged++;

  const gc = (g.city ?? "").toLowerCase().replace(/[^a-z]/g, "");
  const dc = (d.city ?? "").toLowerCase().replace(/[^a-z]/g, "");
  if (gc && dc && gc !== dc && !gc.includes(dc) && !dc.includes(gc)) {
    flags.push(`${d.slug}: listed in ${d.city}, GBP says ${g.city} (${g.title})`);
  }
}

writeFileSync(path, head + JSON.stringify(arr, null, 2) + " as unknown as Dispensary[];\n");
console.log(`merged=${merged} skipped=${skipped} marked-inactive=${closed}`);
console.log(`\nTown mismatches to review (${flags.length}):`);
flags.forEach((f) => console.log("  " + f));
