#!/usr/bin/env node
/**
 * Mirror the repo-root markdown files into site/content/markdown/ so that
 * Vercel (or any deploy where the site is the project root) can resolve
 * them at build time. Runs as a prebuild step; idempotent.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_DIR = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(SITE_DIR, "..");
const DEST = path.join(SITE_DIR, "content", "markdown");

const FILES = [
  "00_README.md",
  "01_Indian_Ayurvedic.md",
  "02_Peruvian_Andean_Spanish.md",
  "03_Chinese_TCM.md",
  "04_Japanese_Kampo.md",
  "05_Other_Global.md",
  "06_Symptom_Index.md",
  "07_Ayurvedic_DeepDive_150_More.md",
  "08_Kampo_Full_Formulary.md",
  "A1_Triphala_Home_Recipe.md",
  "A2_Ashwagandha_Safety.md"
];

fs.mkdirSync(DEST, { recursive: true });

let copied = 0;
let missing = 0;
for (const f of FILES) {
  const src = path.join(REPO_ROOT, f);
  const dst = path.join(DEST, f);
  if (!fs.existsSync(src)) {
    console.warn(`[sync-content] missing: ${src}`);
    missing++;
    continue;
  }
  fs.copyFileSync(src, dst);
  copied++;
}

console.log(`[sync-content] copied ${copied} file(s) to ${path.relative(SITE_DIR, DEST)}${missing ? `, ${missing} missing` : ""}`);
