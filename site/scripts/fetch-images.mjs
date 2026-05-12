#!/usr/bin/env node
/**
 * Fetches botanical thumbnails + short descriptions from Wikipedia REST
 * for every remedy with a Latin binomial, and caches them to
 * `site/data/images.json`.
 *
 * Usage (from repo root or site/):
 *   node site/scripts/fetch-images.mjs           # incremental (skip cached)
 *   node site/scripts/fetch-images.mjs --force   # refetch everything
 *   node site/scripts/fetch-images.mjs --stale 30 # refetch entries older than 30 days
 *
 * Rate-limited to ~3 req/sec — Wikipedia REST is generous but we're polite.
 * Wikipedia text + thumbnails are CC-BY-SA; the BotanicalImage component
 * renders attribution + the Wikipedia page URL.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..");
const SITE_DIR  = path.resolve(__dirname, "..");
const OUT_FILE  = path.resolve(SITE_DIR, "data", "images.json");
const UA = "Remedia/1.0 (educational herbal encyclopedia; contact: info@remedia.app)";

const FORCE   = process.argv.includes("--force");
const staleIx = process.argv.indexOf("--stale");
const STALE_DAYS = staleIx >= 0 ? Number(process.argv[staleIx + 1]) : null;

/* ────────── Markdown parsing (simple regex extract) ────────── */

const FILES = [
  { file: "01_Indian_Ayurvedic.md",         region: "india" },
  { file: "02_Peruvian_Andean_Spanish.md",  region: "peru"  },
  { file: "03_Chinese_TCM.md",              region: "china" },
  { file: "04_Japanese_Kampo.md",           region: "japan" },
  { file: "05_Other_Global.md",             region: "global"}
];

function slugify(s) {
  return s.toLowerCase()
    .replace(/[*_]/g, "")
    .replace(/[()]/g, "")
    .replace(/[^\w\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseEntries() {
  const entries = [];
  for (const { file, region } of FILES) {
    const p1 = path.join(REPO_ROOT, file);
    const p2 = path.join(SITE_DIR, "content", "markdown", file);
    const candidatePath = fs.existsSync(p1) ? p1 : p2;
    if (!fs.existsSync(candidatePath)) continue;
    const content = fs.readFileSync(candidatePath, "utf8");
    const re = /^#{2,3}\s+(\d+)\.\s+(.+?)\s*$/gm;
    let m;
    while ((m = re.exec(content)) !== null) {
      const num = m[1];
      const title = m[2].replace(/\{#[^}]+\}/, "").trim();
      const latinMatch = title.match(/\*([^*]+)\*/);
      const latin = latinMatch ? latinMatch[1].trim() : null;
      const common = title.replace(/\*[^*]+\*/, "").replace(/[()]/g, "").trim();
      const slug = `${region}-${num}-${slugify(common.split("/")[0])}`;
      entries.push({ slug, common, latin });
    }
  }
  return entries;
}

/* ────────── Wikipedia lookup ────────── */

async function lookup(query) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}?redirect=true`;
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA, "Accept": "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.type === "disambiguation" || !data.thumbnail) return null;
    return {
      title: data.title,
      description: (data.description ?? "").slice(0, 200),
      extract: (data.extract ?? "").slice(0, 400),
      thumb: data.thumbnail?.source,
      thumbWidth: data.thumbnail?.width,
      thumbHeight: data.thumbnail?.height,
      full: data.originalimage?.source,
      fullWidth: data.originalimage?.width,
      fullHeight: data.originalimage?.height,
      pageUrl: data.content_urls?.desktop?.page ?? `https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`
    };
  } catch (e) {
    console.warn(`  fetch error for "${query}":`, e.message);
    return null;
  }
}

async function lookupBest(entry) {
  if (entry.latin) {
    const hit = await lookup(entry.latin.replace(/\s+/g, "_"));
    if (hit) return { ...hit, queriedAs: entry.latin };
  }
  if (entry.common) {
    const hit = await lookup(entry.common.replace(/\s+/g, "_"));
    if (hit) return { ...hit, queriedAs: entry.common };
  }
  return null;
}

/* ────────── Main ────────── */

function loadCache() {
  if (!fs.existsSync(OUT_FILE)) return {};
  try { return JSON.parse(fs.readFileSync(OUT_FILE, "utf8")); } catch { return {}; }
}

function isStale(entry) {
  if (FORCE) return true;
  if (!STALE_DAYS) return false;
  if (!entry || !entry.fetched) return true;
  const ageMs = Date.now() - Date.parse(entry.fetched);
  return ageMs > STALE_DAYS * 24 * 60 * 60 * 1000;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const entries = parseEntries();
  const cache = loadCache();
  let fetched = 0, skipped = 0, missed = 0;

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });

  console.log(`[fetch-images] ${entries.length} remedies — cache has ${Object.keys(cache).length}`);

  for (const e of entries) {
    if (cache[e.slug] && !isStale(cache[e.slug])) { skipped++; continue; }
    process.stdout.write(`  ${e.slug} (${e.latin ?? e.common})… `);
    const result = await lookupBest(e);
    if (result) {
      cache[e.slug] = { ...result, fetched: new Date().toISOString() };
      fetched++;
      console.log("ok");
    } else {
      cache[e.slug] = { missing: true, fetched: new Date().toISOString() };
      missed++;
      console.log("miss");
    }
    // Persist every 25 to survive interruption.
    if ((fetched + missed) % 25 === 0) {
      fs.writeFileSync(OUT_FILE, JSON.stringify(cache, null, 2));
    }
    await sleep(350);
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify(cache, null, 2));
  console.log(`\n[fetch-images] fetched=${fetched} skipped=${skipped} missed=${missed}`);
  console.log(`[fetch-images] wrote ${OUT_FILE}`);
}

main().catch(e => { console.error(e); process.exit(1); });
