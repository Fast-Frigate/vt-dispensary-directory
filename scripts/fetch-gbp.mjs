// Fetches Google Business Profile data for every dispensary from DataForSEO
// and writes the trimmed result to scripts/gbp-cache.json.
// Usage: node scripts/fetch-gbp.mjs [--limit N]
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const env = Object.fromEntries(
  readFileSync(new URL("../.env", import.meta.url), "utf8")
    .split("\n").filter(Boolean).map((l) => l.split(/=(.*)/s).slice(0, 2))
);
const AUTH = "Basic " + Buffer.from(`${env.DATAFORSEO_LOGIN}:${env.DATAFORSEO_PASSWORD}`).toString("base64");
const ENDPOINT = "https://api.dataforseo.com/v3/business_data/google/my_business_info/live";

const src = readFileSync(new URL("../src/data/dispensaries.ts", import.meta.url), "utf8");
const dispensaries = JSON.parse(src.slice(src.indexOf("["), src.lastIndexOf("] as unknown") + 1));

const limitArg = process.argv.indexOf("--limit");
const list = limitArg > -1 ? dispensaries.slice(0, +process.argv[limitArg + 1]) : dispensaries;

const cachePath = new URL("./gbp-cache.json", import.meta.url);
const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")) : {};

const hhmm = (t) => `${String(t.hour).padStart(2, "0")}:${String(t.minute).padStart(2, "0")}`;

function trim(item) {
  if (!item) return null;
  const tt = item.work_time?.work_hours?.timetable ?? null;
  let hours = null;
  if (tt) {
    hours = {};
    for (const day of ["monday","tuesday","wednesday","thursday","friday","saturday","sunday"]) {
      const slot = tt[day]?.[0];
      hours[day] = slot?.open && slot?.close ? { open: hhmm(slot.open), close: hhmm(slot.close) } : null;
    }
  }
  const a = item.attributes?.available_attributes ?? {};
  return {
    title: item.title,
    address: item.address_info?.address ?? null,
    city: item.address_info?.city ?? null,
    zip: item.address_info?.zip ?? null,
    lat: item.latitude ?? null,
    lng: item.longitude ?? null,
    phone: item.phone ?? null,
    url: item.url ?? null,
    description: item.description ?? null,
    category: item.category ?? null,
    status: item.work_time?.work_hours?.current_status ?? null,
    hours,
    attrs: Object.values(a).flat(),
    unavailable: Object.values(item.attributes?.unavailable_attributes ?? {}).flat(),
    rating: item.rating?.value ?? null,
    votes: item.rating?.votes_count ?? null,
    place_id: item.place_id ?? null,
  };
}

async function lookup(d) {
  const body = [{
    keyword: `${d.name} ${d.city} VT`,
    location_name: "Vermont,United States",
    language_code: "en",
  }];
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { Authorization: AUTH, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json();
  const task = json.tasks?.[0];
  if (task?.status_code !== 20000) return { error: task?.status_message ?? "unknown", cost: json.cost ?? 0 };
  return { data: trim(task.result?.[0]?.items?.[0]), cost: json.cost ?? 0 };
}

let cost = 0, ok = 0, miss = 0;
const CONCURRENCY = 8;
const queue = list.filter((d) => !cache[d.slug]);
console.log(`${queue.length} to fetch (${Object.keys(cache).length} cached)`);

for (let i = 0; i < queue.length; i += CONCURRENCY) {
  const batch = queue.slice(i, i + CONCURRENCY);
  const results = await Promise.all(batch.map(async (d) => [d.slug, await lookup(d)]));
  for (const [slug, r] of results) {
    cost += r.cost ?? 0;
    if (r.data) { cache[slug] = r.data; ok++; }
    else { cache[slug] = null; miss++; }
  }
  writeFileSync(cachePath, JSON.stringify(cache, null, 2));
  console.log(`  ${Math.min(i + CONCURRENCY, queue.length)}/${queue.length}  matched=${ok} missed=${miss}  $${cost.toFixed(3)}`);
}
console.log(`Done. matched=${ok} missed=${miss} cost=$${cost.toFixed(3)}`);
