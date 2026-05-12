# Traditional & Herbal Remedies — 500+ Entry Reference

A structured reference of 500+ traditional/ancient herbal remedies across five regions. The compendium is sourced from two layers:

1. **Curated markdown** (250 foundational entries, 50 per region) — the original hand-authored corpus.
2. **Extended JSON datasets** (`site/data/extended/*.json`, ~330 additional entries) — the structured data that also powers the Remedia site's `/encyclopedia`. These are merged into the master PDF so the book and the site stay in sync.

Regions:

- `01_Indian_Ayurvedic.md` + `ayurveda.json` — India / Ayurveda
- `02_Peruvian_Andean_Spanish.md` + `andean.json` — Peru, Andes, Amazon, Spanish folk
- `03_Chinese_TCM.md` + `tcm.json` — China / Traditional Chinese Medicine
- `04_Japanese_Kampo.md` + `kampo.json` — Japan / Kampo & folk
- `05_Other_Global.md` + `global.json` — Europe, Africa, Middle East, Americas, Pacific, SE Asia

## How each entry is structured
- **Benefit** — traditional use(s) and, where relevant, modern evidence direction.
- **Preparation / Recipe** — typical home preparation (decoction, infusion, powder, tincture, topical).
- **Local Sourcing** — where the plant/product is typically bought in its country of origin.

## Safety disclaimer
This is educational material, not medical advice. Herbs can interact with medications and have contraindications in pregnancy, breastfeeding, pediatric use, or with chronic disease. Always:

1. Verify correct botanical identification (Latin binomial).
2. Start with low doses, watch for allergy.
3. Avoid long-term high-dose use without supervision.
4. Check legality in your jurisdiction (e.g., coca leaf, ephedra, kava, kratom).
5. Consult a licensed herbalist, Ayurvedic doctor, TCM practitioner, Kampo doctor, or MD.

## Requested follow-ups (addressed in appendix file)
- `A1_Triphala_Home_Recipe.md` — detailed home Triphala preparation.
- `A2_Ashwagandha_Safety.md` — safety, side effects, and interactions.

## Building the PDF

The canonical compendium PDF is produced by:

```powershell
# Master compendium — all regions, includes extended JSON (~500+ entries)
pwsh ./_build_pdf_typst.ps1

# Single-region PDF — ships only one tradition
pwsh ./_build_pdf_typst.ps1 -Region India
pwsh ./_build_pdf_typst.ps1 -Region Peru
pwsh ./_build_pdf_typst.ps1 -Region China
pwsh ./_build_pdf_typst.ps1 -Region Japan
pwsh ./_build_pdf_typst.ps1 -Region Global

# Markdown-only (fast, 250 entries, no JSON merge)
pwsh ./_build_pdf_typst.ps1 -NoExtended

# Build master + every regional variant
pwsh ./_build_pdf_typst.ps1 -All
```

Outputs:

- `Traditional_Herbal_Remedies_Compendium.pdf` — master (all regions)
- `Traditional_Herbal_Remedies_India.pdf` / `_Peru.pdf` / `_China.pdf` / `_Japan.pdf` / `_Global.pdf` — per-region editions

All variants share the same pipeline: [Typst](https://typst.app) via pandoc and `_pdf_template.typ` to produce a cover page, safety disclaimer, TOC with running headers, regional chapters with per-entry safety badges + modern-sources citations, a cross-referenced **Latin binomial index** (A–Z), a **symptom cross-reference**, a **pregnancy quick-reference**, and a colophon with dynamic entry counts.

`_build_pdf.ps1` (Edge-headless) is kept only as a fallback if Typst is not installed.

## Preparation glossary
- **Decoction** — simmer hard plant parts (root, bark, berries) 15–30 min covered.
- **Infusion / Tea** — pour hot water on leaves/flowers, steep 5–10 min covered.
- **Tincture** — 1 part dried herb : 5 parts 40–60% alcohol, macerate 2–6 weeks, strain.
- **Poultice** — crushed fresh herb applied to skin, covered with cloth.
- **Oil infusion** — dried herb in olive/coconut oil, warm 2–4 hours double-boiler or 2–6 weeks sun.
- **Syrup** — strong decoction + equal weight honey/sugar, refrigerate.
