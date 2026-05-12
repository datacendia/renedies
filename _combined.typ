// Typst template applied by pandoc via --template.
// Receives from pandoc: title, author, date, body, toc.
// Receives from the build script via include: _chapter_intros.typ (map),
// _pregnancy_ref.typ, _latin_index.typ, _symptom_ref.typ, _colophon.typ.

#set document(
  title: "Remedia — Traditional & Herbal Remedies Compendium",
  author: "Remedia",
  keywords: (
    "herbal medicine", "ayurveda", "traditional chinese medicine", "kampo",
    "andean herbalism", "phytotherapy", "pharmacognosy", "materia medica"
  )
)

#set page(
  paper: "a4",
  margin: (top: 2.2cm, bottom: 2.2cm, x: 2cm),
  header: context {
    let current = counter(page).get().first()
    if current == 1 { return }
    set text(size: 8pt, fill: rgb("#666"))
    grid(
      columns: (1fr, auto),
      align: (left, right),
      emph[Remedia — Traditional & Herbal Remedies],
      {
        let headings = query(heading.where(level: 1).before(here()))
        if headings.len() > 0 [
          #headings.last().body
        ]
      }
    )
    v(-0.3em)
    line(length: 100%, stroke: 0.3pt + rgb("#ccc"))
  },
  footer: context {
    set text(size: 8pt, fill: rgb("#666"))
    align(center)[
      Page #counter(page).display() of #counter(page).final().first()
    ]
  }
)

#set text(
  font: ("Segoe UI", "Arial"),
  size: 10.5pt,
  lang: "en"
)

#set par(justify: true, leading: 0.65em, first-line-indent: 0em)

// ─────────────────────────── Chapter intros map ──────────────────────────
// Static: keyed by tradition. The heading text is matched via `repr()` to
// select the appropriate entry.
#let chapter-intros = (
  "India": (
    epigraph: "Sarve bhavantu sukhinah — may all beings be well.",
    body: "Fifty entries from the Ayurvedic corpus: classical herbs (Ashwagandha, Turmeric, Triphala) alongside culinary-medicinal staples. Preparation language follows the Charaka and Sushruta conventions; dosages are given in practical home measures rather than shastric units."
  ),
  "Peru/Andes/Spanish": (
    epigraph: "Cada planta sabe su enfermedad.",
    body: "Andean curanderismo, Amazonian plant medicine, and Iberian folk remedies that crossed the Atlantic. Many entries list both Spanish and Quechua common names; altitude and harvest notes accompany sourcing where relevant."
  ),
  "China": (
    epigraph: "The superior physician treats what is not yet ill.",
    body: "Fifty materia medica entries from Traditional Chinese Medicine. Classical pinyin names precede modern botanical identifications where given in the source. Formulas follow the Shang Han Lun and Wen Bing conventions."
  ),
  "Japan": (
    epigraph: "Ichi-go ichi-e — one encounter, one opportunity.",
    body: "Kampo is TCM reinterpreted through four centuries of Japanese clinical adaptation. Expect familiar Chinese herbs in characteristically simplified formulas — usually fewer ingredients per prescription than their TCM equivalents."
  ),
  "Global": (
    epigraph: "Every landscape carries its own pharmacy.",
    body: "Remedies from Europe, Africa, the Middle East, the Americas, the Pacific, and Southeast Asia that do not belong to the four anchor traditions. Regulatory status varies widely — legality and sourcing notes are flagged where known."
  ),
)

// ─────────────────────────── Region colour ──────────────────────────
// Each tradition gets its own accent colour so running headers and chapter
// openers feel distinct while still coherent.
#let region-colors = (
  "India": rgb("#b45309"),
  "Peru/Andes/Spanish": rgb("#9a3412"),
  "China": rgb("#b91c1c"),
  "Japan": rgb("#9f1239"),
  "Global": rgb("#4d7c0f"),
)
// `body` is a `content` sequence, not a string — `.text` does not exist on
// sequences. Pass the whole body through `repr()` to get a flat string and
// substring-match the repr output. Repr includes quoted text fragments, so
// the keywords still match unambiguously.
#let chapter-color(body) = {
  let s = repr(body)
  if s.contains("Indian") or s.contains("Ayurved") { return region-colors.at("India") }
  if s.contains("Peruvian") or s.contains("Andean") or s.contains("Spanish") { return region-colors.at("Peru/Andes/Spanish") }
  if s.contains("Chinese") or s.contains("TCM") { return region-colors.at("China") }
  if s.contains("Kampo") or s.contains("Japanese") { return region-colors.at("Japan") }
  if s.contains("Global") or s.contains("Other") { return region-colors.at("Global") }
  rgb("#2c562b")
}
#let chapter-intro-key(body) = {
  let s = repr(body)
  if s.contains("Indian") or s.contains("Ayurved") { return "India" }
  if s.contains("Peruvian") or s.contains("Andean") or s.contains("Spanish") { return "Peru/Andes/Spanish" }
  if s.contains("Chinese") or s.contains("TCM") { return "China" }
  if s.contains("Kampo") or s.contains("Japanese") { return "Japan" }
  if s.contains("Global") or s.contains("Other") { return "Global" }
  ""
}

// ─────────────────────────── Heading styles ──────────────────────────
// H1 becomes a full chapter opener page for regional chapters; straight title
// for back-matter sections.
#show heading.where(level: 1): it => {
  let key = chapter-intro-key(it.body)
  let color = chapter-color(it.body)
  pagebreak(weak: true)
  if key != "" and key in chapter-intros {
    let info = chapter-intros.at(key)
    v(3cm)
    block(
      stroke: (left: 3pt + color),
      inset: (left: 16pt, rest: 0pt),
      width: 100%,
      [
        #text(size: 10pt, fill: color, weight: "bold")[CHAPTER]\
        #v(0.3em)
        #text(size: 32pt, weight: "bold", fill: color)[#it.body]
      ]
    )
    v(1.2em)
    block(
      width: 90%,
      text(size: 12pt, style: "italic", fill: rgb("#555"))[#info.epigraph]
    )
    v(0.8em)
    block(
      width: 90%,
      text(size: 11pt, fill: rgb("#333"))[#info.body]
    )
  } else {
    v(1em)
    set text(size: 22pt, weight: "bold", fill: color)
    it.body
    v(0.3em)
    line(length: 100%, stroke: 1pt + color)
    v(0.5em)
  }
}

#show heading.where(level: 2): it => {
  v(0.8em)
  // Pick up current chapter colour for H2 tint.
  context {
    let h1s = query(heading.where(level: 1).before(here()))
    let color = if h1s.len() > 0 { chapter-color(h1s.last().body) } else { rgb("#376d35") }
    set text(size: 14pt, weight: "bold", fill: color)
    it.body
    v(0.15em)
    line(length: 35%, stroke: 0.5pt + color.lighten(60%))
  }
}

#show heading.where(level: 3): it => {
  v(0.5em)
  set text(size: 12pt, weight: "bold", fill: rgb("#264525"))
  it.body
}

#show link: set text(fill: rgb("#1a5fa0"))
#show raw: set text(font: "Consolas", size: 9.5pt)

#show quote: it => block(
  fill: rgb("#fafafa"),
  stroke: (left: 3pt + rgb("#9fc89d")),
  inset: (x: 10pt, y: 6pt),
  width: 100%,
  it.body
)

// ─────────────────────────── Safety badge function ──────────────────────────
// Called inline from entry markdown via raw-typst injection. Renders a compact
// amber callout summarising pregnancy, lactation, and drug-interaction count.
#let flag-color(f) = {
  if f == "avoid"   { return rgb("#b91c1c") }
  if f == "caution" { return rgb("#b45309") }
  if f == "safe"    { return rgb("#047857") }
  if f == "unknown" { return rgb("#6b7280") }
  rgb("#6b7280")
}
#let flag-label(f) = {
  if f == "avoid"   { return "AVOID" }
  if f == "caution" { return "caution" }
  if f == "safe"    { return "generally safe" }
  if f == "unknown" { return "insufficient data" }
  f
}
#let safety-line(preg: "unknown", lact: "unknown", n: 0) = {
  block(
    fill: rgb("#fff8ec"),
    stroke: (left: 2pt + rgb("#d97706")),
    inset: (x: 10pt, y: 7pt),
    radius: 2pt,
    above: 0.3em, below: 0.5em,
    text(size: 9pt, fill: rgb("#333"))[
      #text(weight: "bold", fill: rgb("#b45309"))[Safety]
      #h(0.4em) Pregnancy: #text(weight: "bold", fill: flag-color(preg))[#flag-label(preg)].
      #h(0.3em) Lactation: #text(weight: "bold", fill: flag-color(lact))[#flag-label(lact)].
      #if n > 0 [#h(0.3em) #text(fill: rgb("#555"))[#n drug #if n == 1 {"interaction"} else {"interactions"} documented — see monograph.]]
    ]
  )
}

// ─────────────────────────── Page-ref helper ──────────────────────────
// Given a label, print the page number where it lives. Gracefully degrades to
// "—" if the label isn't present.
#let page-ref(label) = context {
  let hits = query(label)
  if hits.len() > 0 {
    let p = hits.first().location().page()
    text(size: 9pt, fill: rgb("#555"))[p.#p]
  } else {
    text(size: 9pt, fill: rgb("#bbb"))[—]
  }
}

// ─────────────────────────── Cover page ──────────────────────────
// A single-page editorial cover with:
//   • fine double rule frame
//   • compact small-caps eyebrow
//   • large display wordmark
//   • ornamental divider built from three rules + two bullets
//   • subtitle and tagline in italic serif
//   • five-tradition emblem with accent dots in region colours
//   • stat band (REMEDIES · TRADITIONS · REFERENCES) with fine vertical rules
//   • short editorial abstract
//   • imprint line at the bottom
//
// Everything is type-driven — no external assets required. Colours match
// the regional accent palette used throughout the book.

#page(
  margin: (x: 2cm, y: 2cm),
  header: none,
  footer: none,
  [
    // — fine double rule frame, drawn top and bottom —
    #let frame-colour = rgb("#1f3a1f")
    #place(top + left, dx: 0pt, dy: 0pt,
      line(length: 100%, stroke: 0.6pt + frame-colour))
    #place(top + left, dx: 0pt, dy: 3pt,
      line(length: 100%, stroke: 0.3pt + frame-colour))
    #place(bottom + left, dx: 0pt, dy: 0pt,
      line(length: 100%, stroke: 0.6pt + frame-colour))
    #place(bottom + left, dx: 0pt, dy: -3pt,
      line(length: 100%, stroke: 0.3pt + frame-colour))

    #v(1.4cm)

    // — eyebrow —
    #align(center)[
      #text(size: 9pt, tracking: 4pt, fill: rgb("#4b8a48"))[
        #upper[Compendium · Edition 1.0]
      ]
    ]

    #v(0.8cm)

    // — display wordmark —
    #align(center)[
      #text(
        size: 64pt,
        weight: "bold",
        tracking: 2pt,
        fill: rgb("#1f3a1f"),
        font: ("Georgia", "Segoe UI", "Arial"),
      )[Remedia]
    ]

    #v(0.4em)

    // — ornamental divider: rule · dot · rule · dot · rule —
    #align(center)[
      #box(width: 60%)[
        #grid(
          columns: (1fr, auto, 1fr, auto, 1fr),
          column-gutter: 6pt,
          align: horizon,
          line(length: 100%, stroke: 0.6pt + rgb("#4b8a48")),
          text(size: 10pt, fill: rgb("#4b8a48"))[#sym.diamond.filled],
          line(length: 100%, stroke: 0.6pt + rgb("#4b8a48")),
          text(size: 10pt, fill: rgb("#4b8a48"))[#sym.diamond.filled],
          line(length: 100%, stroke: 0.6pt + rgb("#4b8a48")),
        )
      ]
    ]

    #v(1.2em)

    // — tagline —
    #align(center)[
      #text(size: 17pt, style: "italic", fill: rgb("#2c562b"))[
        Traditional & Herbal Remedies
      ]
      #v(0.1em)
      #text(size: 12pt, tracking: 2pt, fill: rgb("#4b8a48"))[
        #upper[from five living traditions]
      ]
    ]

    #v(1.4cm)

    // — five-tradition emblem —
    #align(center)[
      #grid(
        columns: (auto, auto, auto, auto, auto),
        column-gutter: 18pt,
        align: horizon + center,
        ..(
          ("India",  "भारत",   region-colors.at("India")),
          ("Peru & Andes", "Ande", region-colors.at("Peru/Andes/Spanish")),
          ("China",  "中药",   region-colors.at("China")),
          ("Japan",  "漢方",   region-colors.at("Japan")),
          ("Global", "Mundus",region-colors.at("Global")),
        ).map(row => {
          let (name, script, color) = row
          stack(dir: ttb, spacing: 4pt,
            align(center, circle(radius: 4pt, fill: color)),
            align(center, text(size: 11pt, weight: "bold", fill: rgb("#1f3a1f"))[#name]),
            align(center, text(size: 10pt, style: "italic", fill: rgb("#666"))[#script]),
          )
        })
      )
    ]

    #v(1.2cm)

    // — stat band —
    // Three stat columns with fixed-height divider rules between them.
    // (Earlier revision used 100%-height rules inside a 1fr grid row, which
    //  made the whole band stretch to fill the page and pushed the imprint
    //  onto page 2. Fixed-height rules keep the band compact.)
    #let stat-cell(value, label) = stack(dir: ttb, spacing: 3pt,
      text(size: 26pt, weight: "bold", fill: rgb("#1f3a1f"))[#value],
      text(size: 8pt, tracking: 2pt, fill: rgb("#666"))[#upper[#label]],
    )
    #let stat-rule = box(width: 0.4pt, height: 34pt, fill: rgb("#c9e1c8"))
    #align(center)[
      #box(
        width: 80%,
        stroke: (top: 0.5pt + rgb("#c9e1c8"), bottom: 0.5pt + rgb("#c9e1c8")),
        inset: (x: 0pt, y: 12pt),
        [
          #stack(dir: ltr, spacing: 0pt,
            box(width: 33%, align(center, stat-cell("580", "Remedies"))),
            box(width: 0.5%, align(center + horizon, stat-rule)),
            box(width: 33%, align(center, stat-cell("5", "Traditions"))),
            box(width: 0.5%, align(center + horizon, stat-rule)),
            box(width: 33%, align(center, stat-cell("250", "Safety Entries"))),
          )
        ]
      )
    ]

    #v(1cm)

    // — editorial abstract —
    #align(center)[
      #box(width: 72%)[
        #set par(justify: false, leading: 0.75em)
        #text(size: 10.5pt, fill: rgb("#333"), style: "italic")[
          A cross-referenced reference work gathering the materia medica of
          Ayurveda, Andean & Iberian folk medicine, Traditional Chinese
          Medicine, Japanese Kampo, and the wider global herbal canon —
          with preparation recipes, structured safety flags, and modern
          pharmacological citations.
        ]
      ]
    ]

    // — bottom imprint — placed at a fixed offset from the bottom so it
    // sits clear of the 0.6pt / 0.3pt frame rules (which are at dy 0 and
    // dy -3pt respectively).
    #place(bottom + center, dy: -1.2cm,
      align(center)[
        #line(length: 120pt, stroke: 0.3pt + rgb("#4b8a48"))
        #v(0.6em)
        #text(size: 9pt, tracking: 2pt, fill: rgb("#4b8a48"))[
          #upper[Remedia · Editorial]
        ]
        #v(0.3em)
        #text(size: 9pt, fill: rgb("#999"))[
          Compiled #datetime.today().display("[month repr:long] [day], [year]")
        ]
      ]
    )
  ]
)

// ---- Safety disclaimer (non-skippable page) ----
#align(center)[
  #v(2cm)
  #text(size: 22pt, weight: "bold", fill: rgb("#7a2b2b"))[Safety Disclaimer]
  #v(0.3em)
  #line(length: 40%, stroke: 1pt + rgb("#7a2b2b"))
]
#v(1.5em)
#box(
  width: 100%,
  stroke: (left: 3pt + rgb("#c05555")),
  fill: rgb("#fdf6f6"),
  inset: 16pt,
  [
    #text(size: 11pt, weight: "bold")[This is educational material. It is not medical advice.]

    Traditional remedies and herbs can interact with prescription medications and
    have real contraindications — particularly in pregnancy, breastfeeding,
    paediatric use, chronic disease, and the perioperative period. Before acting
    on anything in this compendium:

    - Confirm correct botanical identification by Latin binomial. Common names
      collide across regions; several plants listed here share vernacular names
      with unrelated and potentially toxic species.
    - Start at the lowest typical dose. Observe for 24–72 hours. Discontinue at
      the first sign of allergy, rash, gastrointestinal upset, jaundice, dark
      urine, palpitations, or breathing difficulty.
    - Avoid long-term high-dose use of any single herb without supervision.
      "Natural" is not a synonym for "safe" and is not a synonym for "benign at
      any dose."
    - Check the legal status of each herb in your jurisdiction. Several entries
      (e.g. coca leaf, ephedra, kava, kratom, areca) are regulated or prohibited
      in some countries.
    - Consult a licensed practitioner — MD, pharmacist, registered herbalist,
      Ayurvedic doctor, TCM practitioner, or Kampo physician — before combining
      herbs with any medication or before use during pregnancy, breastfeeding,
      or for children.

    The authors and publishers accept no liability for outcomes resulting from
    use of this material. By continuing to read you acknowledge that the
    content is for study and reference only.
  ]
)

#pagebreak()

// ---- Preparation & measurement conventions ----
#text(size: 22pt, weight: "bold", fill: rgb("#2c562b"))[Preparation & Measurement]
#v(0.3em)
#text(size: 10pt, style: "italic", fill: rgb("#666"))[
  Recipes throughout this compendium use the shorthand below. Where an entry
  gives only a preparation type (e.g. "infusion", "decoction", "tincture") the
  standard dose here applies unless the entry states otherwise.
]
#v(1em)

#line(length: 100%, stroke: 0.5pt + rgb("#ccc"))
#v(0.5em)

#grid(
  columns: (auto, 1fr),
  column-gutter: 1.2em,
  row-gutter: 0.9em,
  [*Infusion (tea)*],
  [Leaves, flowers, soft aerials. *1 tbsp dried (≈ 3 g) per 240 ml* just-off-the-boil water. Cover. Steep 8–10 min. Strain. 1–3 cups/day.],

  [*Decoction*],
  [Roots, bark, seeds, tough material. *1 tsp dried (≈ 3–5 g) per 240 ml* cold water. Simmer covered 15–30 min. Strain. 1–2 cups/day. TCM formulas often double-boil 45–90 min.],

  [*Cold infusion*],
  [Mucilaginous or aromatic herbs (marshmallow, lemon balm). *1 tbsp per 250 ml* cold water, 4–8 hr. Strain.],

  [*Powder (churna / fine powder)*],
  [*¼–½ tsp (≈ 1–3 g)* in warm water, milk, ghee, or honey, 1–3× daily. Start at the lower end.],

  [*Tincture (1:5 in 40 % alcohol)*],
  [*2–4 ml (≈ 40–80 drops), 2–3× daily*, diluted in a little water. Acute doses up to every 2 hours short-term.],

  [*Glycerite*],
  [Alcohol-free tincture for children or sensitive users. *2.5–5 ml, 2–3× daily*.],

  [*Capsules / tablets*],
  [Follow label. Typical range *300–1000 mg of dried herb per capsule*, 1–3× daily with food.],

  [*Kampo / TCM granule sachets*],
  [*One sachet (typically 2.5–3 g) 2–3× daily* before meals, dissolved in warm water, unless a doctor directs otherwise.],

  [*Syrup / honey preparation*],
  [*1 tsp (5 ml), 1–3× daily*. Refrigerate and use within 4–6 weeks.],

  [*Essential oil*],
  [Topical: *1–3 drops per 5 ml carrier* (2–6 % dilution for adults). Do not ingest without professional guidance. Skin-test first.],

  [*Poultice / compress*],
  [Fresh or rehydrated herb, crushed, applied to clean skin 15–30 min. Repeat 1–3× daily.],

  [*Food-as-medicine*],
  [Culinary quantities. "Add to soup / grate over rice" means a normal kitchen amount (≈ 5–15 g fresh, 1–3 g dried per serving). Therapeutic effect is cumulative and mild.],
)

#v(0.8em)
#line(length: 100%, stroke: 0.5pt + rgb("#ccc"))
#v(0.5em)

#text(size: 9.5pt, fill: rgb("#555"))[
  *Unit quick reference.*   1 tsp ≈ 5 ml ≈ 3–5 g dried herb (varies by density — ginger powder is denser than chamomile).   1 tbsp ≈ 15 ml ≈ 10–15 g dried herb.   1 cup ≈ 240 ml.   1 fluid oz ≈ 30 ml.   Drops per ml varies by dropper; 20 drops ≈ 1 ml is a safe default.
]
#v(0.4em)
#text(size: 9.5pt, fill: rgb("#555"))[
  *Always start at the lowest dose in the range.*  Children, elderly, pregnant or breastfeeding individuals, and those on medication should reduce by half or consult a practitioner first.
]

#pagebreak()

// ---- Table of contents ----
#text(size: 22pt, weight: "bold", fill: rgb("#2c562b"))[Contents]
#v(0.5em)
#line(length: 100%, stroke: 1pt + rgb("#2c562b"))
#v(1em)

#outline(
  title: none,
  indent: auto,
  depth: 2
)

// ---- Main content injected by pandoc ----
= Traditional & Herbal Remedies --- 500+ Entry Reference
<traditional--herbal-remedies--500-entry-reference>
A structured reference of 500+ traditional/ancient herbal remedies
across five regions. The compendium is sourced from two layers:

+ #strong[Curated markdown] (250 foundational entries, 50 per region)
  --- the original hand-authored corpus.
+ #strong[Extended JSON datasets] (`site/data/extended/*.json`, \~330
  additional entries) --- the structured data that also powers the
  Remedia site\'s `/encyclopedia`. These are merged into the master PDF
  so the book and the site stay in sync.

Regions:

- `01_Indian_Ayurvedic.md` + `ayurveda.json` --- India / Ayurveda
- `02_Peruvian_Andean_Spanish.md` + `andean.json` --- Peru, Andes,
  Amazon, Spanish folk
- `03_Chinese_TCM.md` + `tcm.json` --- China / Traditional Chinese
  Medicine
- `04_Japanese_Kampo.md` + `kampo.json` --- Japan / Kampo & folk
- `05_Other_Global.md` + `global.json` --- Europe, Africa, Middle East,
  Americas, Pacific, SE Asia

== How each entry is structured
<how-each-entry-is-structured>
- #strong[Benefit] --- traditional use(s) and, where relevant, modern
  evidence direction.
- #strong[Preparation / Recipe] --- typical home preparation (decoction,
  infusion, powder, tincture, topical).
- #strong[Local Sourcing] --- where the plant/product is typically
  bought in its country of origin.

== Safety disclaimer
<safety-disclaimer>
This is educational material, not medical advice. Herbs can interact
with medications and have contraindications in pregnancy, breastfeeding,
pediatric use, or with chronic disease. Always:

+ Verify correct botanical identification (Latin binomial).
+ Start with low doses, watch for allergy.
+ Avoid long-term high-dose use without supervision.
+ Check legality in your jurisdiction (e.g., coca leaf, ephedra, kava,
  kratom).
+ Consult a licensed herbalist, Ayurvedic doctor, TCM practitioner,
  Kampo doctor, or MD.

== Requested follow-ups (addressed in appendix file)
<requested-follow-ups-addressed-in-appendix-file>
- `A1_Triphala_Home_Recipe.md` --- detailed home Triphala preparation.
- `A2_Ashwagandha_Safety.md` --- safety, side effects, and interactions.

== Building the PDF
<building-the-pdf>
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

- `Traditional_Herbal_Remedies_Compendium.pdf` --- master (all regions)
- `Traditional_Herbal_Remedies_India.pdf` / `_Peru.pdf` / `_China.pdf` /
  `_Japan.pdf` / `_Global.pdf` --- per-region editions

All variants share the same pipeline: #link("https://typst.app")[Typst]
via pandoc and `_pdf_template.typ` to produce a cover page, safety
disclaimer, TOC with running headers, regional chapters with per-entry
safety badges + modern-sources citations, a cross-referenced
#strong[Latin binomial index] (A--Z), a #strong[symptom
cross-reference], a #strong[pregnancy quick-reference], and a colophon
with dynamic entry counts.

`_build_pdf.ps1` (Edge-headless) is kept only as a fallback if Typst is
not installed.

== Preparation glossary
<preparation-glossary>
- #strong[Decoction] --- simmer hard plant parts (root, bark, berries)
  15--30 min covered.
- #strong[Infusion / Tea] --- pour hot water on leaves/flowers, steep
  5--10 min covered.
- #strong[Tincture] --- 1 part dried herb : 5 parts 40--60% alcohol,
  macerate 2--6 weeks, strain.
- #strong[Poultice] --- crushed fresh herb applied to skin, covered with
  cloth.
- #strong[Oil infusion] --- dried herb in olive/coconut oil, warm 2--4
  hours double-boiler or 2--6 weeks sun.
- #strong[Syrup] --- strong decoction + equal weight honey/sugar,
  refrigerate.

= 50 Other Global Ancient & Herbal Remedies
<50-other-global-ancient--herbal-remedies>
Covers Europe, Middle East, Africa, North America, Pacific, and
Southeast Asia.

== Europe & Mediterranean
<europe--mediterranean>
== 1. Echinacea (#emph[Echinacea purpurea]) --- Native American / Europe
<herb-global-1-echinacea-echinacea-purpurea-native-amer>
- #strong[Benefit:] Immune, colds, wound healing.
- #strong[Recipe:] Tincture 2--4 ml 3×/day at onset of cold; max 10
  days.
- #strong[Sourcing:] Health stores US/Europe; A. Vogel Echinaforce
  common.

== 2. Elderberry / Sambucus (#emph[Sambucus nigra])
<herb-global-2-elderberry-sambucus>
#safety-line(preg: "caution", lact: "caution", n: 3)
- #strong[Benefit:] Antiviral, flu severity reduction.
- #strong[Recipe:] Syrup --- 500 g berries + 1 L water simmer 30 min,
  strain, add equal honey. 1 tbsp daily.
- #strong[Sourcing:] Wild hedges; health stores.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/european-elder")[NCCIH --- European Elder]
·
#link("https://pubmed.ncbi.nlm.nih.gov/30670267/")[Cochrane --- Sambucus nigra for upper respiratory tract infections (2019)]]

== 3. Garlic (#emph[Allium sativum]) --- Mediterranean/Egyptian
<herb-global-3-garlic-allium-sativum-mediterranean-egyp>
- #strong[Benefit:] Antimicrobial, BP, cholesterol.
- #strong[Recipe:] Crush 1--2 cloves, rest 10 min, swallow with honey or
  in food.
- #strong[Sourcing:] Any grocer.

== 4. Oregano (#emph[Origanum vulgare])
<herb-global-4-oregano>
- #strong[Benefit:] Antimicrobial, respiratory.
- #strong[Recipe:] Steam inhalation with oregano; oil 1 drop in capsule
  with olive oil.
- #strong[Sourcing:] Supermarkets, herbolarios.

== 5. Thyme (#emph[Thymus vulgaris])
<herb-global-5-thyme>
#safety-line(preg: "caution", lact: "safe", n: 2)
- #strong[Benefit:] Cough, bronchitis, antibacterial.
- #strong[Recipe:] Infusion 1 tsp + honey + lemon 3×/day.
- #strong[Sourcing:] Supermarkets.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/29851894/")[PubMed --- Thymol and thyme essential oil: pharmacological review (2018)]
·
#link("https://powo.science.kew.org/?q=Thymus+vulgaris")[POWO --- Thymus vulgaris L.]]

== 6. Rosemary (#emph[Salvia rosmarinus])
<herb-global-6-rosemary>
#safety-line(preg: "avoid", lact: "safe", n: 4)
- #strong[Benefit:] Memory, circulation, hair.
- #strong[Recipe:] Infusion: 1 tsp dried leaf in 240 ml hot water, 8--10
  min; 1--2 cups/day. Vinegar hair rinse: 2 tbsp dried in 500 ml
  apple-cider vinegar 2 weeks; dilute 1:4 with water before use.
- #strong[Sourcing:] Mediterranean gardens; supermarkets.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/32758060/")[PubMed --- Rosmarinus officinalis: pharmacological profile review (2020)]
·
#link("https://powo.science.kew.org/?q=Salvia+rosmarinus")[POWO --- Salvia rosmarinus Spenn.]]

== 7. Sage (#emph[Salvia officinalis])
<herb-global-7-sage>
#safety-line(preg: "avoid", lact: "avoid", n: 3)
- #strong[Benefit:] Sore throat, sweating, menopause.
- #strong[Recipe:] Gargle: 1 tsp dried sage in 240 ml hot water, cooled
  10 min; gargle 30 sec 3--4× daily for sore throat. Hot flashes: 1 cup
  tea 1--2× daily, limit to 4 weeks.
- #strong[Sourcing:] Herb shops.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/28068532/")[PubMed --- Salvia officinalis: traditional and modern uses review (2017)]
·
#link("https://powo.science.kew.org/?q=Salvia+officinalis")[POWO --- Salvia officinalis L.]]

== 8. Lavender (#emph[Lavandula angustifolia])
<herb-global-8-lavender>
#safety-line(preg: "caution", lact: "safe", n: 2)
- #strong[Benefit:] Anxiety, sleep, burns.
- #strong[Recipe:] Sachet under pillow; essential oil diluted 2% in
  carrier.
- #strong[Sourcing:] Provence; everywhere.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/lavender")[NCCIH --- Lavender] ·
#link("https://pubmed.ncbi.nlm.nih.gov/30404593/")[PubMed --- Lavender for anxiety: systematic review (2019)]]

== 9. Chamomile (#emph[Matricaria chamomilla])
<herb-global-9-chamomile>
#safety-line(preg: "caution", lact: "safe", n: 3)
- #strong[Benefit:] Sleep, colic, digestion, skin.
- #strong[Recipe:] Infusion 1 tsp 5 min; cooled compress for eyes.
- #strong[Sourcing:] Every pharmacy.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/chamomile")[NCCIH --- Chamomile]
·
#link("https://pubmed.ncbi.nlm.nih.gov/22096320/")[PubMed --- Chamomile (Matricaria recutita) review of medicinal properties (2011)]]

== 10. Peppermint (#emph[Mentha × piperita])
<herb-global-10-peppermint>
#safety-line(preg: "caution", lact: "caution", n: 3)
- #strong[Benefit:] IBS, nausea, headache.
- #strong[Recipe:] IBS: 1 enteric-coated capsule (≈0.2 ml peppermint
  oil) 3× daily between meals, 4--12 weeks. Leaf tea: 1 tsp dried leaf
  in 240 ml hot water 8 min, 1--3 cups/day.
- #strong[Sourcing:] Supermarkets.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/peppermint-oil")[NCCIH --- Peppermint Oil]
·
#link("https://pubmed.ncbi.nlm.nih.gov/30560145/")[PubMed --- Peppermint oil for irritable bowel syndrome: systematic review (2019)]
·
#link("https://powo.science.kew.org/?q=Mentha+piperita")[POWO --- Mentha × piperita L.]]

== 11. Fennel (#emph[Foeniculum vulgare])
<herb-global-11-fennel>
#safety-line(preg: "caution", lact: "safe", n: 3)
- #strong[Benefit:] Colic, bloating, lactation.
- #strong[Recipe:] 1 tsp crushed seeds in hot water 10 min.
- #strong[Sourcing:] Spice shops.

#emph[Modern sources:
#link("https://www.ncbi.nlm.nih.gov/books/NBK501829/")[LactMed --- Fennel (LactMed)]
·
#link("https://pubmed.ncbi.nlm.nih.gov/25182906/")[PubMed --- Foeniculum vulgare: review of phytochemistry and pharmacology (2014)]]

== 12. Calendula (#emph[Calendula officinalis])
<herb-global-12-calendula>
#safety-line(preg: "avoid", lact: "safe", n: 1)
- #strong[Benefit:] Wounds, eczema, skin.
- #strong[Recipe:] Oil infusion: 1 cup dried flowers in 500 ml olive
  oil, 4--6 weeks low heat / windowsill; strain. Salve: 100 ml infused
  oil + 15 g beeswax melted together, poured into jars. Apply 2--3×
  daily to cuts, rashes, nappy-rash.
- #strong[Sourcing:] Herb shops; Weleda creams.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/24251846/")[PubMed --- Calendula officinalis in wound healing: systematic review (2013)]
·
#link("https://powo.science.kew.org/?q=Calendula+officinalis")[POWO --- Calendula officinalis L.]]

== 13. St John's Wort (#emph[Hypericum perforatum])
<herb-global-13-st-john-s-wort>
#safety-line(preg: "avoid", lact: "avoid", n: 6)
- #strong[Benefit:] Mild depression; nerve pain (topical).
- #strong[Recipe:] Red oil --- flowers in olive oil, sun-macerated 4
  weeks. Internal tincture under care.
- #strong[Caution:] Interacts with many drugs (contraceptives, SSRIs,
  warfarin, HIV meds).
- #strong[Sourcing:] Herb shops.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/st-johns-wort")[NCCIH --- St. John\'s Wort]
·
#link("https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD000448.pub3/full")[Cochrane --- St John\'s wort for major depression (Cochrane 2008)]
·
#link("https://pubmed.ncbi.nlm.nih.gov/25236355/")[PubMed --- Hypericum perforatum drug interactions (2014)]]

== 14. Valerian (#emph[Valeriana officinalis])
<herb-global-14-valerian>
#safety-line(preg: "avoid", lact: "avoid", n: 2)
- #strong[Benefit:] Sleep, anxiety.
- #strong[Recipe:] Root decoction 1 hr before bed; capsules 400--600 mg.
- #strong[Sourcing:] Pharmacies.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/valerian")[NCCIH --- Valerian] ·
#link("https://pubmed.ncbi.nlm.nih.gov/20347389/")[PubMed --- Valerian for insomnia: systematic review (2010)]]

== 15. Hops (#emph[Humulus lupulus])
<herb-global-15-hops>
- #strong[Benefit:] Sleep, anxiety, menopause.
- #strong[Recipe:] Sleep pillow: 50 g dried hop strobiles in a cotton
  pouch, placed near the head. Tea: 1 tsp dried strobile in 240 ml hot
  water, 8 min; 1 cup 30 min before bed.
- #strong[Sourcing:] Brewing + herb shops.

== 16. Milk thistle (#emph[Silybum marianum])
<herb-global-16-milk-thistle>
#safety-line(preg: "caution", lact: "safe", n: 2)
- #strong[Benefit:] Liver protection, hepatitis supportive.
- #strong[Recipe:] Crushed seeds 1 tsp in smoothie; standardized
  silymarin capsules.
- #strong[Sourcing:] Pharmacies.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/milk-thistle")[NCCIH --- Milk Thistle]
·
#link("https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD003620.pub3/full")[Cochrane --- Milk thistle for alcoholic and/or hepatitis B or C liver diseases (2007)]]

== 17. Dandelion (#emph[Taraxacum officinale])
<herb-global-17-dandelion>
#safety-line(preg: "caution", lact: "safe", n: 5)
- #strong[Benefit:] Liver, diuretic, digestion.
- #strong[Recipe:] Root decoction: 1 tsp dried root in 240 ml water
  simmered 15 min; 1 cup 1--2× daily. Salad: 1 handful young leaves.
  Roasted root "coffee": 1 tsp roasted ground root in 240 ml hot water,
  5 min steep.
- #strong[Sourcing:] Wild; herb shops.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/21241380/")[PubMed --- Taraxacum officinale: review of properties and human use (2011)]
·
#link("https://powo.science.kew.org/?q=Taraxacum+officinale")[POWO --- Taraxacum officinale F.H.Wigg.]]

== 18. Nettle (#emph[Urtica dioica])
<herb-global-18-nettle>
#safety-line(preg: "caution", lact: "safe", n: 5)
- #strong[Benefit:] Allergies, iron, joints.
- #strong[Recipe:] Food: 200 g fresh young nettle tops blanched 1 min,
  used like spinach. Tea: 1 tbsp dried leaf in 240 ml hot water 10 min;
  1--3 cups/day.
- #strong[Sourcing:] Wild (gloves); herb shops.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/29541693/")[PubMed --- Urtica dioica: therapeutic indications review (2018)]
·
#link("https://powo.science.kew.org/?q=Urtica+dioica")[POWO --- Urtica dioica L.]]

== 19. Yarrow (#emph[Achillea millefolium])
<herb-global-19-yarrow>
#safety-line(preg: "avoid", lact: "safe", n: 4)
- #strong[Benefit:] Wounds, fever (diaphoretic), menstrual.
- #strong[Recipe:] Leaf poultice for cuts; infusion 1 tsp for fever.
- #strong[Sourcing:] Wild; herb shops.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/28167226/")[PubMed --- Achillea millefolium: phytochemistry and pharmacology review (2017)]
·
#link("https://powo.science.kew.org/?q=Achillea+millefolium")[POWO --- Achillea millefolium L.]]

== 20. Linden flower / Tilia
<herb-global-20-linden-flower-tilia>
- #strong[Benefit:] Fever, anxiety, sleep.
- #strong[Recipe:] 1 tsp flowers infused 10 min.
- #strong[Sourcing:] European pharmacies.

== 21. Hawthorn (#emph[Crataegus]) --- European
<herb-global-21-hawthorn-crataegus-european>
- #strong[Benefit:] Mild heart failure, BP, anxiety.
- #strong[Recipe:] Standardized extract 300--900 mg/day; flower + leaf
  tea.
- #strong[Sourcing:] Pharmacies.

== 22. Ginkgo (#emph[Ginkgo biloba]) --- China/Europe
<herb-global-22-ginkgo-ginkgo-biloba-china-europe>
- #strong[Benefit:] Circulation, cognitive support.
- #strong[Recipe:] Standardized extract 120--240 mg/day (not raw
  leaves).
- #strong[Sourcing:] Pharmacies.

== 23. Bilberry (#emph[Vaccinium myrtillus])
<herb-global-23-bilberry>
- #strong[Benefit:] Night vision, capillaries.
- #strong[Recipe:] Fresh: 1 handful (≈80 g) berries daily. Standardized
  extract: 80--160 mg (25% anthocyanins) 2× daily.
- #strong[Sourcing:] Nordic/European markets.

== 24. Mullein (#emph[Verbascum thapsus])
<herb-global-24-mullein>
- #strong[Benefit:] Cough, bronchitis, ear oil.
- #strong[Recipe:] Leaf tea: 1 tsp dried leaf in 240 ml hot water 10
  min; strain through fine muslin to remove hairs; 1--3 cups/day. Ear
  oil: 2--3 drops warm flower-infused oil in the ear canal --- intact
  eardrum only.
- #strong[Sourcing:] Wild; herb shops.

== Middle East & North Africa
<middle-east--north-africa>
== 25. Black seed / Habbat al-Barakah (#emph[Nigella sativa])
<herb-global-25-black-seed-habbat-al-barakah>
#safety-line(preg: "avoid", lact: "caution", n: 5)
- #strong[Benefit:] Immune, respiratory, blood sugar.
- #strong[Recipe:] ½ tsp seeds or 1 tsp oil with honey daily.
- #strong[Sourcing:] Middle Eastern groceries; spice souks.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/23436482/")[PubMed --- Nigella sativa: clinical review (2013)]]

== 26. Frankincense / Luban (#emph[Boswellia sacra / serrata])
<herb-global-26-frankincense-luban>
#safety-line(preg: "avoid", lact: "caution", n: 3)
- #strong[Benefit:] Joint inflammation, asthma; resin chewed for oral
  health.
- #strong[Recipe:] Resin water: 2--3 pea-sized pieces (≈2 g) in 240 ml
  water overnight; drink on empty stomach. Standardized extract:
  300--400 mg #emph[Boswellia serrata] (60% boswellic acids) 2--3× daily
  with meals.
- #strong[Sourcing:] Oman, Yemen souks; spice shops.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/33162995/")[PubMed --- Boswellia serrata in osteoarthritis and inflammatory disease: review (2020)]]

== 27. Myrrh (#emph[Commiphora myrrha])
<herb-global-27-myrrh>
- #strong[Benefit:] Gum health, antimicrobial.
- #strong[Recipe:] Mouth rinse: 1 ml myrrh tincture in 30 ml water;
  swish 30 sec, spit; 2--3× daily for gum inflammation. Short-term only.
- #strong[Sourcing:] Middle Eastern souks.

== 28. Henna (#emph[Lawsonia inermis])
<herb-global-28-henna>
- #strong[Benefit:] Hair/skin dye, cooling, antifungal.
- #strong[Recipe:] 100 g henna powder + 100 ml lemon juice or plain
  yogurt, rested 6--12 hr; apply to hair 2--4 hr then rinse. Topical
  only --- never ingested; patch-test first.
- #strong[Sourcing:] Everywhere in MENA/South Asia.

== 29. Date + milk (traditional)
<herb-global-29-date-milk>
- #strong[Benefit:] Anemia, energy, pregnancy support.
- #strong[Recipe:] 3 dates soaked in warm milk overnight.
- #strong[Sourcing:] Markets throughout MENA.

== 30. Za'atar blend (thyme + sumac + sesame)
<herb-global-30-za-atar-blend>
- #strong[Benefit:] Digestive, antimicrobial, antioxidant.
- #strong[Recipe:] 1 tbsp with olive oil as bread dip.
- #strong[Sourcing:] Middle Eastern groceries.

== Sub-Saharan Africa
<sub-saharan-africa>
== 31. Rooibos (#emph[Aspalathus linearis]) --- South Africa
<herb-global-31-rooibos-aspalathus-linearis-south-africa>
- #strong[Benefit:] Antioxidant, caffeine-free, skin.
- #strong[Recipe:] 1 tsp steeped 5 min.
- #strong[Sourcing:] South African supermarkets worldwide.

== 32. Honeybush (#emph[Cyclopia])
<herb-global-32-honeybush>
- #strong[Benefit:] Menopause, antioxidant.
- #strong[Recipe:] Tea, 1 tsp 5 min.
- #strong[Sourcing:] South African shops.

== 33. African potato (#emph[Hypoxis hemerocallidea])
<herb-global-33-african-potato>
- #strong[Benefit:] Immune (traditional), prostate.
- #strong[Recipe:] 1 tsp dried corm in 240 ml water simmered 15 min; 1
  cup 1--2× daily, under practitioner guidance. Can interact with HIV
  antiretrovirals and anticoagulants.
- #strong[Sourcing:] Muthi markets SA (e.g., Warwick, Durban).

== 34. Sutherlandia / Cancer bush (#emph[Lessertia frutescens])
<herb-global-34-sutherlandia-cancer-bush>
- #strong[Benefit:] Adaptogen, appetite, immune.
- #strong[Recipe:] Leaf tea 1 tsp 5 min.
- #strong[Sourcing:] SA herb shops.

== 35. Moringa (#emph[Moringa oleifera]) --- Africa/India
<herb-global-35-moringa-moringa-oleifera-africa-india>
- #strong[Benefit:] Nutrient-dense, blood sugar.
- #strong[Recipe:] 1 tsp powder in water/soup.
- #strong[Sourcing:] Markets across Africa.

== 36. Baobab fruit (#emph[Adansonia digitata])
<herb-global-36-baobab-fruit>
- #strong[Benefit:] Vitamin C, fiber, gut.
- #strong[Recipe:] 1 tbsp powder in water/smoothies.
- #strong[Sourcing:] West/Southern African markets.

== 37. Shea butter (#emph[Vitellaria paradoxa])
<herb-global-37-shea-butter>
- #strong[Benefit:] Skin, burns, eczema.
- #strong[Recipe:] Neat: 1--2 tsp melted between palms, applied to skin
  1--2× daily. With essential oils: 1 tbsp shea + 3--6 drops essential
  oil (2--4% dilution) blended.
- #strong[Sourcing:] West African markets.

== 38. Hibiscus / Bissap / Karkadé (#emph[Hibiscus sabdariffa])
<herb-global-38-hibiscus-bissap-karkad>
#safety-line(preg: "avoid", lact: "safe", n: 4)
- #strong[Benefit:] Blood pressure, vitamin C.
- #strong[Recipe:] 2 tbsp dried calyces in 1 L water, steep 30 min.
- #strong[Sourcing:] Sudan, Egypt, West Africa; markets globally.

== Native American / North America
<native-american--north-america>
#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/25875025/")[PubMed --- Hibiscus sabdariffa for blood pressure: meta-analysis (2015)]]

== 39. Sage smudge / White sage (#emph[Salvia apiana])
<herb-global-39-sage-smudge-white-sage>
- #strong[Benefit:] Ceremonial cleansing; traditional respiratory use.
- #strong[Recipe:] Small bundle burned briefly (5--10 sec); smoke wafted
  through space. Use ethically-harvested sources only --- white sage is
  culturally sensitive; non-Indigenous users may prefer rosemary, garden
  sage, or cedar.
- #strong[Sourcing:] Buy from Indigenous sources; wild populations are
  threatened.

== 40. Sweetgrass / Cedar / Tobacco --- Four Sacred Medicines
<herb-global-40-sweetgrass-cedar-tobacco-four-sacred-med>
- #strong[Benefit:] Ceremonial across many First Nations.
- #strong[Preparation:] Traditional protocols --- learn from cultural
  knowledge keepers.
- #strong[Sourcing:] First Nations cultural centers.

== 41. Slippery elm (#emph[Ulmus rubra])
<herb-global-41-slippery-elm>
#safety-line(preg: "caution", lact: "safe", n: 1)
- #strong[Benefit:] Sore throat, GERD, gut lining.
- #strong[Recipe:] 1 tsp inner-bark powder in warm water → mucilage.
- #strong[Sourcing:] Health stores.

#emph[Modern sources:
#link("https://powo.science.kew.org/?q=Ulmus+rubra")[POWO --- Ulmus rubra Muhl.]]

== 42. Goldenseal (#emph[Hydrastis canadensis])
<herb-global-42-goldenseal>
#safety-line(preg: "avoid", lact: "avoid", n: 4)
- #strong[Benefit:] Mucous membranes, antimicrobial; threatened --- use
  cultivated.
- #strong[Recipe:] Tincture 1--3 ml 3×/day short term.
- #strong[Sourcing:] Herb stores (certified cultivated).

== Pacific & Oceania
<pacific--oceania>
#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/goldenseal")[NCCIH --- Goldenseal]
·
#link("https://pubmed.ncbi.nlm.nih.gov/29420797/")[PubMed --- Hydrastis canadensis and berberine: drug interactions (2018)]]

== 43. Kava (#emph[Piper methysticum])
<herb-global-43-kava>
#safety-line(preg: "avoid", lact: "avoid", n: 3)
- #strong[Benefit:] Anxiety, sleep, social relaxation.
- #strong[Recipe:] Noble-cultivar root powder kneaded in water 10 min,
  strained.
- #strong[Caution:] Avoid alcohol and hepatotoxic drugs; choose noble
  cultivars.
- #strong[Sourcing:] Fiji, Vanuatu, Tonga markets; reputable online
  vendors.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/kava")[NCCIH --- Kava] ·
#link("https://pubmed.ncbi.nlm.nih.gov/21128039/")[PubMed --- Kava hepatotoxicity: review of case reports (2011)]]

== 44. Manuka honey (#emph[Leptospermum scoparium]) --- NZ
<herb-global-44-manuka-honey-leptospermum-scoparium-nz>
- #strong[Benefit:] Wound healing, throat, antimicrobial (UMF rated).
- #strong[Recipe:] 1 tsp on toast; topical on wounds.
- #strong[Sourcing:] NZ supermarkets; look for UMF 10+ for therapeutic
  use.

== 45. Kawakawa (#emph[Piper excelsum]) --- Māori
<herb-global-45-kawakawa-piper-excelsum-m-ori>
- #strong[Benefit:] Digestion, skin, circulation.
- #strong[Recipe:] 3--4 young leaves with holes (insect-bitten) in hot
  water 10 min.
- #strong[Sourcing:] NZ herbal shops; wild on North Island.

== Southeast Asia
<southeast-asia>
== 46. Lemongrass / Sereh (#emph[Cymbopogon citratus])
<herb-global-46-lemongrass-sereh>
- #strong[Benefit:] Digestion, fever, mosquito repellent.
- #strong[Recipe:] 2 stalks crushed in hot water; tea with ginger.
- #strong[Sourcing:] SE Asian markets; supermarkets.

== 47. Pandan (#emph[Pandanus amaryllifolius])
<herb-global-47-pandan>
- #strong[Benefit:] Blood sugar traditional, aromatic.
- #strong[Recipe:] 3 leaves boiled in 1 L water as tea.
- #strong[Sourcing:] SE Asian groceries.

== 48. Kratom (#emph[Mitragyna speciosa]) --- Thailand/Indonesia
<herb-global-48-kratom-mitragyna-speciosa-thailand-indon>
- #strong[Benefit:] Traditional fatigue/pain; opioid-like and addictive.
- #strong[Caution:] Legal status varies; dependency risk; not
  recommended without caution.
- #strong[Sourcing:] Restricted in many countries.

== 49. Galangal / Lengkuas (#emph[Alpinia galanga])
<herb-global-49-galangal-lengkuas>
- #strong[Benefit:] Digestion, joint pain, nausea.
- #strong[Recipe:] Soup: 4--6 slices (≈5 g) fresh galangal per 500 ml
  broth (Tom Kha). Tea: 3--5 slices + 1 tsp grated ginger in 240 ml
  water simmered 10 min; 1 cup for nausea or cold symptoms.
- #strong[Sourcing:] SE Asian markets.

== 50. Betel leaf (#emph[Piper betle]) --- South/SE Asia
<herb-global-50-betel-leaf-piper-betle-south-se-asia>
- #strong[Benefit:] Oral health, digestion (traditional).
- #strong[Recipe:] Leaf chewed with cardamom/cloves (avoid areca nut ---
  carcinogenic).
- #strong[Sourcing:] Paan shops across South Asia.

== 51. Cleavers (#emph[Galium aparine]) --- Global weed
<herb-global-51-cleavers-galium-aparine-global-weed>
- #strong[Benefit:] Lymphatic drainage, gentle diuretic for skin
  conditions.
- #strong[Recipe:] Fresh herb as tea or juice; or tincture.
- #strong[Sourcing:] Common weed worldwide.

== 52. Chickweed (#emph[Stellaria media]) --- Global weed
<herb-global-52-chickweed-stellaria-media-global-weed>
- #strong[Benefit:] Cooling demulcent for skin irritation; nutritive
  spring green.
- #strong[Recipe:] Fresh leaves in salads; poultice for skin.
- #strong[Sourcing:] Common garden weed.

== 53. Fig (#emph[Ficus carica]) --- Mediterranean
<herb-global-53-fig-ficus-carica-mediterranean>
- #strong[Benefit:] Blood sugar support; mild laxative fruit and leaf.
- #strong[Recipe:] Fresh fruit; leaf tea for blood sugar.
- #strong[Sourcing:] Mediterranean origin.

== 54. Rosehip (#emph[Rosa canina]) --- Global
<herb-global-54-rosehip-rosa-canina-global>
- #strong[Benefit:] High vitamin C; joint support and immune tonic.
- #strong[Recipe:] Dried hips as tea or syrup.
- #strong[Sourcing:] Wild rose species worldwide.

== 55. Turkey Tail (#emph[Trametes versicolor]) --- Global mushroom
<herb-global-55-turkey-tail-trametes-versicolor-global-m>
- #strong[Benefit:] Immune modulating mushroom; PSK and PSP
  polysaccharides.
- #strong[Recipe:] Decoction 2--3 g dried mushroom daily.
- #strong[Sourcing:] Wood-decaying mushroom worldwide.

== 56. Chaga (#emph[Inonotus obliquus]) --- Northern hemisphere
<herb-global-56-chaga-inonotus-obliquus-northern-hemisph>
- #strong[Benefit:] Antioxidant-rich adaptogen; traditional Siberian
  tonic.
- #strong[Recipe:] Decoction or tincture of sclerotium.
- #strong[Sourcing:] Birch trees in northern climates.

== 57. Clove (#emph[Syzygium aromaticum]) --- Indonesia
<herb-global-57-clove-syzygium-aromaticum-indonesia>
- #strong[Benefit:] Antimicrobial spice; dental pain and digestive
  support.
- #strong[Recipe:] Whole clove for toothache; 1--2 drops oil diluted.
- #strong[Sourcing:] Indonesian origin; dried flower buds.

= Extended Reference --- Global
<extended-reference--global>
#emph[The following entries are sourced from the structured JSON dataset
that backs the Remedia site encyclopedia. They share the same safety +
reference lookups as the curated markdown above.]

== 58. St. John\'s Wort (#emph[Hypericum perforatum])
<herb-global-58-st-john-s-wort>
#safety-line(preg: "avoid", lact: "avoid", n: 6)
- #strong[Benefit:] Mild-to-moderate depression; SSRI-comparable
  efficacy in trials. Strong drug interactions.
- #strong[Recipe:] 300 mg standardized extract (0.3% hypericin) 3× daily
  for 4--6 weeks.
- #strong[Sourcing:] Mediterranean/temperate; flowering tops.
- #strong[Note:] Major CYP3A4 induction --- check all medications

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/st-johns-wort")[NCCIH --- St. John\'s Wort]
·
#link("https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD000448.pub3/full")[Cochrane --- St John\'s wort for major depression (Cochrane 2008)]
·
#link("https://pubmed.ncbi.nlm.nih.gov/25236355/")[PubMed --- Hypericum perforatum drug interactions (2014)]]

== 59. Passionflower (#emph[Passiflora incarnata])
<herb-global-59-passionflower>
#safety-line(preg: "avoid", lact: "caution", n: 3)
- #strong[Benefit:] Mild anxiolytic and sleep aid; GABAergic activity.
- #strong[Recipe:] 1 tsp dried aerial parts as tea before bed; or 400 mg
  extract.
- #strong[Sourcing:] Native southeastern US.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/passionflower")[NCCIH --- Passionflower]
·
#link("https://pubmed.ncbi.nlm.nih.gov/28444892/")[PubMed --- Passiflora incarnata for anxiety: systematic review (2017)]]

== 60. Lemon Balm (#emph[Melissa officinalis])
<herb-global-60-lemon-balm>
#safety-line(preg: "caution", lact: "caution", n: 3)
- #strong[Benefit:] Anxiolytic and antiviral (HSV); rosmarinic acid and
  terpenes.
- #strong[Recipe:] 1--2 tsp fresh/dried leaf as tea 2--3× daily; topical
  cream for cold sores.
- #strong[Sourcing:] Common garden herb.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/lemon-balm")[NCCIH --- Lemon Balm]
·
#link("https://pubmed.ncbi.nlm.nih.gov/30909956/")[PubMed --- Melissa officinalis for anxiety and sleep: systematic review (2019)]]

== 61. Skullcap (#emph[Scutellaria lateriflora])
<herb-global-61-skullcap>
#safety-line(preg: "avoid", lact: "avoid", n: 3)
- #strong[Benefit:] Gentle nervine; anxiety, tension, mild tremor.
- #strong[Recipe:] 1 tsp dried herb as tea; or tincture.
- #strong[Sourcing:] Eastern North America.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/28395178/")[PubMed --- Scutellaria baicalensis: flavonoids and pharmacology review (2017)]]

== 62. California Poppy (#emph[Eschscholzia californica])
<herb-global-62-california-poppy>
- #strong[Benefit:] Mild sedative and analgesic; non-addictive relative
  of opium poppy.
- #strong[Recipe:] 1 tsp herb as tea; or tincture.
- #strong[Sourcing:] Native western North America.

== 63. Rhodiola (#emph[Rhodiola rosea])
<herb-global-63-rhodiola>
#safety-line(preg: "unknown", lact: "unknown", n: 4)
- #strong[Benefit:] Adaptogen; reduces fatigue and burnout symptoms in
  trials.
- #strong[Recipe:] 200--400 mg standardized extract (3% rosavins)
  morning.
- #strong[Sourcing:] Arctic/alpine; overharvested --- buy sustainable.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/rhodiola")[NCCIH --- Rhodiola] ·
#link("https://pubmed.ncbi.nlm.nih.gov/22228617/")[PubMed --- Rhodiola rosea for stress and fatigue: systematic review (2012)]]

== 64. Holy Basil (Tulsi) (#emph[Ocimum tenuiflorum])
<herb-global-64-holy-basil-tulsi>
#safety-line(preg: "avoid", lact: "caution", n: 3)
- #strong[Benefit:] Duplicate of Tulsi.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/28400848/")[PubMed --- The clinical efficacy and safety of Tulsi: a systematic review (2017)]
·
#link("https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:452571-1")[POWO --- Ocimum tenuiflorum L.]]

== 65. Ginkgo (#emph[Ginkgo biloba])
<herb-global-65-ginkgo>
#safety-line(preg: "avoid", lact: "avoid", n: 4)
- #strong[Benefit:] Circulation and cognition; mixed trials for
  dementia.
- #strong[Recipe:] 120--240 mg standardized extract (EGb 761) daily.
- #strong[Sourcing:] Cultivated; leaf extract.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/ginkgo")[NCCIH --- Ginkgo] ·
#link("https://pubmed.ncbi.nlm.nih.gov/19160216/")[PubMed --- Ginkgo biloba for cognitive decline: Cochrane review (2009)]]

== 66. Burdock (#emph[Arctium lappa])
<herb-global-66-burdock>
- #strong[Benefit:] Blood-purifying root; inulin-rich for gut and skin
  support.
- #strong[Recipe:] Fresh root like parsnip; or decoction 1 tbsp dried
  root.
- #strong[Sourcing:] Biennial weed worldwide.

== 67. Yellow Dock (#emph[Rumex crispus])
<herb-global-67-yellow-dock>
- #strong[Benefit:] Iron-rich liver herb; chronic skin conditions,
  constipation.
- #strong[Recipe:] 1 tsp root decoction twice daily.
- #strong[Sourcing:] Common weed.

== 68. Red Raspberry Leaf (#emph[Rubus idaeus])
<herb-global-68-red-raspberry-leaf>
- #strong[Benefit:] Uterine tonic; traditional pregnancy tea (3rd
  trimester).
- #strong[Recipe:] 1--2 cups tea daily.
- #strong[Sourcing:] Common cultivated.

== 69. Vitex (Chaste Tree) (#emph[Vitex agnus-castus])
<herb-global-69-vitex-chaste-tree>
#safety-line(preg: "avoid", lact: "avoid", n: 4)
- #strong[Benefit:] PMS, PMDD, and cycle regulation; modulates
  prolactin.
- #strong[Recipe:] 20--40 mg standardized extract morning.
- #strong[Sourcing:] Mediterranean origin.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/28237390/")[PubMed --- Vitex agnus-castus for premenstrual syndrome: systematic review (2017)]]

== 70. Black Cohosh (#emph[Actaea racemosa])
<herb-global-70-black-cohosh>
#safety-line(preg: "avoid", lact: "avoid", n: 2)
- #strong[Benefit:] Menopausal hot flashes; mixed trial results.
  Short-term only.
- #strong[Recipe:] 40--80 mg extract daily; max 6 months.
- #strong[Sourcing:] Eastern North America; sustainability concerns.
- #strong[Note:] Rare liver toxicity --- stop if symptoms

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/black-cohosh")[NCCIH --- Black Cohosh]
·
#link("https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD007244.pub2/full")[Cochrane --- Black cohosh for menopausal symptoms (2012)]]

== 71. Red Clover (#emph[Trifolium pratense])
<herb-global-71-red-clover>
- #strong[Benefit:] Phytoestrogen-rich; menopause and women\'s health.
- #strong[Recipe:] 1 tsp flowers as tea 2--3× daily.
- #strong[Sourcing:] Pasture herb, widely available.

== 72. Evening Primrose (#emph[Oenothera biennis])
<herb-global-72-evening-primrose>
- #strong[Benefit:] GLA-rich seed oil; PMS breast tenderness, eczema
  support.
- #strong[Recipe:] 500 mg oil 2--4× daily.
- #strong[Sourcing:] Native North American, now worldwide.

== 73. Borage (#emph[Borago officinalis])
<herb-global-73-borage>
- #strong[Benefit:] Higher-GLA source than evening primrose; similar
  uses.
- #strong[Recipe:] 1000 mg seed oil daily.
- #strong[Sourcing:] Garden herb.
- #strong[Note:] Pyrrolizidine alkaloids --- choose PA-free processed
  oils

== 74. Dong Quai (Dang Gui) (#emph[Angelica sinensis])
<herb-global-74-dong-quai-dang-gui>
#safety-line(preg: "avoid", lact: "avoid", n: 3)
- #strong[Benefit:] Duplicate of Dang Gui.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/24063995/")[PubMed --- Angelica sinensis: pharmacological and clinical review (2013)]]

== 75. Saw Palmetto (#emph[Serenoa repens])
<herb-global-75-saw-palmetto>
#safety-line(preg: "avoid", lact: "avoid", n: 3)
- #strong[Benefit:] Benign prostatic hyperplasia; mixed trial results.
- #strong[Recipe:] 320 mg standardized extract daily.
- #strong[Sourcing:] Florida/southeastern US berries.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/saw-palmetto")[NCCIH --- Saw Palmetto]
·
#link("https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD001423.pub3/full")[Cochrane --- Serenoa repens for benign prostatic hyperplasia (2012)]]

== 76. Pygeum (#emph[Prunus africana])
<herb-global-76-pygeum>
- #strong[Benefit:] African herbal for BPH; modest urinary improvement.
- #strong[Recipe:] 100--200 mg standardized bark extract daily.
- #strong[Sourcing:] African tree bark; CITES-monitored.
- #strong[Note:] Sustainability: verify CITES compliance

== 77. Nettle Root (#emph[Urtica dioica radix])
<herb-global-77-nettle-root>
- #strong[Benefit:] BPH-specific use; combines well with saw palmetto.
- #strong[Recipe:] 240 mg extract 2× daily.
- #strong[Sourcing:] Root separate from leaf.

== 78. Tribulus (#emph[Tribulus terrestris])
<herb-global-78-tribulus>
- #strong[Benefit:] Traditional male vitality herb; libido effect shown,
  testosterone effect weak.
- #strong[Recipe:] 500 mg standardized extract 2× daily.
- #strong[Sourcing:] Weedy plant worldwide.

== 79. Horny Goat Weed (#emph[Epimedium spp])
<herb-global-79-horny-goat-weed>
- #strong[Benefit:] Traditional Chinese kidney-yang tonic; icariin may
  support erectile function.
- #strong[Recipe:] 1 g leaf extract 2× daily.
- #strong[Sourcing:] Chinese origin.

== 80. Fenugreek (Men\'s) (#emph[Trigonella foenum-graecum])
<herb-global-80-fenugreek-men-s>
#safety-line(preg: "avoid", lact: "caution", n: 3)
- #strong[Benefit:] Some studies show modest free-testosterone increase
  in middle-aged men.
- #strong[Recipe:] 600 mg standardized extract daily.
- #strong[Sourcing:] See Methi.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/fenugreek")[NCCIH --- Fenugreek]
·
#link("https://www.ncbi.nlm.nih.gov/books/NBK501779/")[LactMed --- Fenugreek (LactMed)]]

== 81. Gotu Kola (#emph[Centella asiatica])
<herb-global-81-gotu-kola>
#safety-line(preg: "avoid", lact: "caution", n: 4)
- #strong[Benefit:] Duplicate of Gotu Kola.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/25368447/")[PubMed --- Centella asiatica: review of its pharmacology and potential applications (2014)]]

== 82. Comfrey (#emph[Symphytum officinale])
<herb-global-82-comfrey>
#safety-line(preg: "avoid", lact: "avoid", n: 1)
- #strong[Benefit:] \'Knitbone\' --- topical healing of bruises,
  sprains, small fractures.
- #strong[Recipe:] Ointment on intact skin only; short courses.
- #strong[Sourcing:] Garden herb.
- #strong[Note:] PAs hepatotoxic --- external use only, intact skin

#emph[Modern sources:
#link("https://www.ema.europa.eu/en/medicines/herbal/symphyti-radix")[EMA --- Symphytum officinale: assessment report on pyrrolizidine alkaloids]
·
#link("https://pubmed.ncbi.nlm.nih.gov/31102765/")[PubMed --- Pyrrolizidine alkaloid hepatotoxicity: systematic review (2019)]]

== 83. Arnica (#emph[Arnica montana])
<herb-global-83-arnica>
#safety-line(preg: "avoid", lact: "avoid", n: 2)
- #strong[Benefit:] Topical bruise, muscle soreness, sprain.
- #strong[Recipe:] Gel or ointment on unbroken skin.
- #strong[Sourcing:] Alpine; most commercial is A. chamissonis.
- #strong[Note:] Oral use toxic --- topical only

#emph[Modern sources:
#link("https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD010538/full")[Cochrane --- Topical herbal therapies for osteoarthritis: arnica (2013)]]

== 84. Witch Hazel (#emph[Hamamelis virginiana])
<herb-global-84-witch-hazel>
- #strong[Benefit:] Astringent; hemorrhoids, minor skin irritation,
  varicose veins.
- #strong[Recipe:] Topical distillate or bark decoction.
- #strong[Sourcing:] Native eastern North America.

== 85. Chickweed (#emph[Stellaria media])
<herb-global-85-chickweed>
- #strong[Benefit:] Cooling demulcent; topical itch and eczema, internal
  cooling.
- #strong[Recipe:] Fresh salad; or topical cream.
- #strong[Sourcing:] Common weed.

== 86. Plantain (#emph[Plantago major])
<herb-global-86-plantain>
- #strong[Benefit:] Wound-drawing, astringent, and demulcent; insect
  bites, coughs.
- #strong[Recipe:] Fresh leaf mashed on bites/splinters; leaf infusion
  for coughs.
- #strong[Sourcing:] Common lawn weed.

== 87. Marshmallow Root (#emph[Althaea officinalis])
<herb-global-87-marshmallow-root>
#safety-line(preg: "safe", lact: "safe", n: 2)
- #strong[Benefit:] Mucilaginous demulcent; gastritis, sore throat,
  cough.
- #strong[Recipe:] Cold-water infusion 4 hr; 1 tsp root in water.
- #strong[Sourcing:] European origin.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/31450228/")[PubMed --- Althaea officinalis: review of phytochemistry and ethnopharmacology (2019)]]

== 88. Caraway (#emph[Carum carvi])
<herb-global-88-caraway>
- #strong[Benefit:] Classical carminative; IBS and colic.
- #strong[Recipe:] Seeds chewed after meals; or with peppermint oil.
- #strong[Sourcing:] European culinary seed.

== 89. Dill (#emph[Anethum graveolens])
<herb-global-89-dill>
- #strong[Benefit:] Infant colic (dill water), mild digestive.
- #strong[Recipe:] Seed infusion; traditional gripe water.
- #strong[Sourcing:] Garden herb.

== 90. Anise (#emph[Pimpinella anisum])
<herb-global-90-anise>
- #strong[Benefit:] Coughs, digestion, lactation.
- #strong[Recipe:] 1 tsp seeds in tea 2--3× daily.
- #strong[Sourcing:] Mediterranean.

== 91. Angelica (#emph[Angelica archangelica])
<herb-global-91-angelica>
- #strong[Benefit:] European digestive bitter; warming, carminative.
- #strong[Recipe:] Root tincture or tea, small doses.
- #strong[Sourcing:] Northern European tradition.

== 92. Gentian (#emph[Gentiana lutea])
<herb-global-92-gentian>
- #strong[Benefit:] Intensely bitter digestive aperitif; stimulates
  gastric secretion.
- #strong[Recipe:] Small amounts tincture before meals.
- #strong[Sourcing:] Alpine; CITES monitored.

== 93. Artichoke Leaf (#emph[Cynara scolymus])
<herb-global-93-artichoke-leaf>
- #strong[Benefit:] Bile stimulation; cholesterol, dyspepsia.
- #strong[Recipe:] 320--640 mg standardized extract daily.
- #strong[Sourcing:] Mediterranean cultivar.

== 94. Bitters blend (#emph[Traditional blend])
<herb-global-94-bitters-blend>
- #strong[Benefit:] Digestive bitters (angelica, gentian, citrus peel)
  stimulate upstream digestion.
- #strong[Recipe:] 1 dropperful tincture in water 15 min before meals.
- #strong[Sourcing:] Many herbalist brands.

== 95. Hawthorn (#emph[Crataegus monogyna / oxyacantha])
<herb-global-95-hawthorn>
#safety-line(preg: "avoid", lact: "caution", n: 4)
- #strong[Benefit:] Cardiac tonic; mild heart failure (NYHA I-II)
  support.
- #strong[Recipe:] 160--900 mg standardized extract daily.
- #strong[Sourcing:] European tree; leaves, flowers, and berries.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/hawthorn")[NCCIH --- Hawthorn] ·
#link("https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD005312.pub2/full")[Cochrane --- Hawthorn extract for treating chronic heart failure (2008)]]

== 96. Motherwort (#emph[Leonurus cardiaca])
<herb-global-96-motherwort>
- #strong[Benefit:] Cardiovascular calmative; palpitations with anxiety.
- #strong[Recipe:] Tincture or tea 1--3× daily.
- #strong[Sourcing:] European herb.

== 97. Olive Leaf (#emph[Olea europaea])
<herb-global-97-olive-leaf>
#safety-line(preg: "caution", lact: "safe", n: 3)
- #strong[Benefit:] Blood-pressure support; cardiovascular and
  antiviral.
- #strong[Recipe:] 500 mg standardized extract (oleuropein) daily.
- #strong[Sourcing:] Mediterranean olive leaves.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/25880820/")[PubMed --- Olea europaea leaf: cardiovascular effects review (2015)]]

== 98. Garlic (#emph[Allium sativum])
<herb-global-98-garlic>
#safety-line(preg: "safe", lact: "safe", n: 3)
- #strong[Benefit:] Duplicate of Garlic main entry.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/garlic")[NCCIH --- Garlic] ·
#link("https://pubmed.ncbi.nlm.nih.gov/22895964/")[PubMed --- Garlic for cardiovascular disease: Cochrane review (2012)]]

== 99. Onion (#emph[Allium cepa])
<herb-global-99-onion>
- #strong[Benefit:] Quercetin-rich; cardiovascular support, mild
  antiviral.
- #strong[Recipe:] Raw or cooked daily; traditional onion-honey cough
  syrup.
- #strong[Sourcing:] Universal culinary.

== 100. Horseradish (#emph[Armoracia rusticana])
<herb-global-100-horseradish>
- #strong[Benefit:] Circulatory stimulant, decongestant, urinary
  antiseptic.
- #strong[Recipe:] Fresh grated root in small amounts.
- #strong[Sourcing:] European culinary root.

== 101. Mustard (#emph[Sinapis alba])
<herb-global-101-mustard>
- #strong[Benefit:] Topical warming plaster for chest congestion.
- #strong[Recipe:] Classical mustard plaster on chest --- test skin
  first.
- #strong[Sourcing:] Seed and powder widely available.

== 102. Capsaicin / Chili (#emph[Capsicum annuum])
<herb-global-102-capsaicin-chili>
- #strong[Benefit:] Topical pain relief (neuropathic); circulatory
  stimulant.
- #strong[Recipe:] 0.025--0.075% topical cream 3--4× daily.
- #strong[Sourcing:] Universal culinary.

== 103. Black Pepper (#emph[Piper nigrum])
<herb-global-103-black-pepper>
- #strong[Benefit:] Warming digestive; piperine increases absorption of
  curcumin and other compounds.
- #strong[Recipe:] Freshly ground with meals, especially turmeric.
- #strong[Sourcing:] Tropical culinary.

== 104. Cinnamon (#emph[Cinnamomum verum (Ceylon)])
<herb-global-104-cinnamon-cinnamomum-verum-ceylon>
- #strong[Benefit:] Blood-sugar support; use Ceylon not Cassia for
  long-term (coumarin levels).
- #strong[Recipe:] ½--1 tsp Ceylon cinnamon daily in food.
- #strong[Sourcing:] Verify \'Ceylon\' / \'true\' cinnamon for long-term
  use.

== 105. Cloves (#emph[Syzygium aromaticum])
<herb-global-105-cloves>
#safety-line(preg: "caution", lact: "safe", n: 2)
- #strong[Benefit:] Potent antimicrobial (eugenol); toothache,
  digestion.
- #strong[Recipe:] Whole clove held by aching tooth; clove oil drop for
  localized relief.
- #strong[Sourcing:] Tropical spice.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/24980611/")[PubMed --- Syzygium aromaticum (clove): pharmacology and clinical review (2014)]]

== 106. Cardamom (#emph[Elettaria cardamomum])
<herb-global-106-cardamom>
#safety-line(preg: "safe", lact: "safe", n: 2)
- #strong[Benefit:] Digestive and respiratory warming spice.
- #strong[Recipe:] 3--5 pods crushed in tea.
- #strong[Sourcing:] Indian cultivar.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/32194464/")[PubMed --- Elettaria cardamomum: traditional and scientific review (2020)]]

== 107. Nutmeg (#emph[Myristica fragrans])
<herb-global-107-nutmeg>
- #strong[Benefit:] Mild sedative in small doses; toxic and
  hallucinogenic in excess.
- #strong[Recipe:] Pinch only, grated fresh; in warm milk before bed.
- #strong[Sourcing:] Indonesian/Caribbean spice.
- #strong[Note:] Doses above 5 g can be toxic

== 108. Saffron (#emph[Crocus sativus])
<herb-global-108-saffron>
#safety-line(preg: "avoid", lact: "caution", n: 3)
- #strong[Benefit:] Mild depression and PMS support; clinical trials
  promising.
- #strong[Recipe:] 15 mg standardized extract 2× daily; or culinary.
- #strong[Sourcing:] Iranian, Spanish, Kashmiri.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/30630194/")[PubMed --- Crocus sativus for major depressive disorder: meta-analysis (2019)]]

== 109. Green Tea (#emph[Camellia sinensis])
<herb-global-109-green-tea>
- #strong[Benefit:] EGCG-rich antioxidant; cardiovascular, metabolic,
  cognitive support.
- #strong[Recipe:] 2--4 cups daily; or 500 mg EGCG extract with food.
- #strong[Sourcing:] Japanese, Chinese.
- #strong[Note:] High-dose extracts: rare hepatotoxicity

== 110. Black Tea (#emph[Camellia sinensis])
<herb-global-110-black-tea>
- #strong[Benefit:] Theaflavins; cardiovascular and cognitive support.
- #strong[Recipe:] 2--4 cups daily.
- #strong[Sourcing:] Indian, Sri Lankan, Chinese.

== 111. Rooibos (#emph[Aspalathus linearis])
<herb-global-111-rooibos>
- #strong[Benefit:] South African caffeine-free; antioxidant and
  calming.
- #strong[Recipe:] 1 tsp in hot water; unlimited.
- #strong[Sourcing:] Western Cape, South Africa.

== 112. Devil\'s Claw (#emph[Harpagophytum procumbens])
<herb-global-112-devil-s-claw>
- #strong[Benefit:] Joint pain; osteoarthritis trials show modest
  benefit.
- #strong[Recipe:] 2--4 g dried root as decoction; or 600 mg extract 3×
  daily.
- #strong[Sourcing:] Southern African savanna; sustainability concerns.

== 113. White Willow (#emph[Salix alba])
<herb-global-113-white-willow>
#safety-line(preg: "avoid", lact: "avoid", n: 4)
- #strong[Benefit:] Salicin --- precursor to aspirin; back pain,
  osteoarthritis.
- #strong[Recipe:] 240 mg salicin daily; avoid with aspirin allergy.
- #strong[Sourcing:] European tree bark.

#emph[Modern sources:
#link("https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD004504.pub4/full")[Cochrane --- Herbal medicine for low back pain: willow bark (2014)]
·
#link("https://powo.science.kew.org/?q=Salix+alba")[POWO --- Salix alba L.]]

== 114. Meadowsweet (#emph[Filipendula ulmaria])
<herb-global-114-meadowsweet>
- #strong[Benefit:] Another salicylate source; gentler on stomach,
  digestive anti-inflammatory.
- #strong[Recipe:] 1 tsp flowers/leaves as tea.
- #strong[Sourcing:] European meadows.

== 115. Feverfew (#emph[Tanacetum parthenium])
<herb-global-115-feverfew>
#safety-line(preg: "avoid", lact: "avoid", n: 2)
- #strong[Benefit:] Migraine prophylaxis; reduces frequency in trials.
- #strong[Recipe:] 100--150 mg standardized extract daily for 2--3
  months.
- #strong[Sourcing:] European garden herb.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/feverfew")[NCCIH --- Feverfew] ·
#link("https://www.cochranelibrary.com/cdsr/doi/10.1002/14651858.CD002286.pub3/full")[Cochrane --- Feverfew for preventing migraine (2015)]]

== 116. Butterbur (#emph[Petasites hybridus])
<herb-global-116-butterbur>
- #strong[Benefit:] Migraine and allergic rhinitis; PA-free products
  only.
- #strong[Recipe:] 75 mg PA-free extract 2× daily.
- #strong[Sourcing:] European; verify PA-free processing.
- #strong[Note:] Use only certified PA-free preparations

== 117. Cranberry (#emph[Vaccinium macrocarpon])
<herb-global-117-cranberry>
- #strong[Benefit:] Recurrent UTI prevention; proanthocyanidins.
- #strong[Recipe:] 36 mg PAC standardized daily; or 250 ml juice.
- #strong[Sourcing:] North American cultivars.

== 118. Elder Flower (#emph[Sambucus nigra])
<herb-global-118-elder-flower>
#safety-line(preg: "caution", lact: "caution", n: 3)
- #strong[Benefit:] Diaphoretic; early-stage cold with fever.
- #strong[Recipe:] 1 tsp flowers in hot water 2--3× daily.
- #strong[Sourcing:] European hedgerow.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/european-elder")[NCCIH --- European Elder]
·
#link("https://pubmed.ncbi.nlm.nih.gov/30670267/")[Cochrane --- Sambucus nigra for upper respiratory tract infections (2019)]]

== 119. Linden / Lime Flower (#emph[Tilia cordata])
<herb-global-119-linden-lime-flower>
- #strong[Benefit:] Calming diaphoretic; colds with anxiety or children.
- #strong[Recipe:] 1 tsp flowers in hot water.
- #strong[Sourcing:] European street tree.

== 120. Horehound (#emph[Marrubium vulgare])
<herb-global-120-horehound>
- #strong[Benefit:] Expectorant for wet cough; traditional in cough
  lozenges.
- #strong[Recipe:] 1 tsp herb as tea or lozenges.
- #strong[Sourcing:] European herb.

== 121. Eucalyptus (#emph[Eucalyptus globulus])
<herb-global-121-eucalyptus>
- #strong[Benefit:] Decongestant; steam inhalation, chest rubs.
- #strong[Recipe:] 5 drops oil in hot water for steam; or diluted
  topical.
- #strong[Sourcing:] Australian origin; global cultivation.

== 122. Cleavers (#emph[Galium aparine])
<herb-global-122-cleavers>
- #strong[Benefit:] Lymphatic drainage; gentle diuretic for skin
  conditions.
- #strong[Recipe:] Fresh herb as tea or juice; or tincture.
- #strong[Sourcing:] Common weed worldwide.

== 123. Chickweed (#emph[Stellaria media])
<herb-global-123-chickweed>
- #strong[Benefit:] Cooling demulcent for skin irritation; nutritive
  spring green.
- #strong[Recipe:] Fresh leaves in salads; poultice for skin.
- #strong[Sourcing:] Common garden weed.

== 124. Fig (#emph[Ficus carica])
<herb-global-124-fig>
- #strong[Benefit:] Blood sugar support; mild laxative fruit and leaf.
- #strong[Recipe:] Fresh fruit; leaf tea for blood sugar.
- #strong[Sourcing:] Mediterranean origin.

== 125. Rosehip (#emph[Rosa canina])
<herb-global-125-rosehip>
- #strong[Benefit:] High vitamin C; joint support and immune tonic.
- #strong[Recipe:] Dried hips as tea or syrup.
- #strong[Sourcing:] Wild rose species worldwide.

== 126. Turkey Tail (#emph[Trametes versicolor])
<herb-global-126-turkey-tail>
- #strong[Benefit:] Immune modulating mushroom; PSK and PSP
  polysaccharides.
- #strong[Recipe:] Decoction 2--3 g dried mushroom daily.
- #strong[Sourcing:] Wood-decaying mushroom worldwide.

== 127. Chaga (#emph[Inonotus obliquus])
<herb-global-127-chaga>
#safety-line(preg: "unknown", lact: "unknown", n: 3)
- #strong[Benefit:] Antioxidant-rich adaptogen; traditional Siberian
  tonic.
- #strong[Recipe:] Decoction or tincture of sclerotium.
- #strong[Sourcing:] Birch trees in northern climates.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/33582228/")[PubMed --- Inonotus obliquus: medicinal mushroom review (2021)]]

== 128. Clove (#emph[Syzygium aromaticum])
<herb-global-128-clove>
#safety-line(preg: "caution", lact: "safe", n: 2)
- #strong[Benefit:] Antimicrobial spice; dental pain and digestive
  support.
- #strong[Recipe:] Whole clove for toothache; 1--2 drops oil diluted.
- #strong[Sourcing:] Indonesian origin; dried flower buds.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/24980611/")[PubMed --- Syzygium aromaticum (clove): pharmacology and clinical review (2014)]]

== 129. Tea Tree (#emph[Melaleuca alternifolia])
<herb-global-129-tea-tree>
- #strong[Benefit:] Topical antimicrobial; acne, fungal infections.
- #strong[Recipe:] 5% dilution topically; undiluted for spot treatment.
- #strong[Sourcing:] Australian native.

== 130. Oregon Grape (#emph[Mahonia aquifolium])
<herb-global-130-oregon-grape>
- #strong[Benefit:] Berberine substitute for goldenseal; skin and GI
  infections.
- #strong[Recipe:] Root decoction or tincture.
- #strong[Sourcing:] Western North American shrub.

== 131. Barberry (#emph[Berberis vulgaris])
<herb-global-131-barberry>
- #strong[Benefit:] Berberine source; metabolic, GI.
- #strong[Recipe:] Root or bark decoction; or 500 mg berberine 2--3×
  daily.
- #strong[Sourcing:] European shrub.

== 132. Berberine (isolated) (#emph[Various sources])
<herb-global-132-berberine-isolated>
- #strong[Benefit:] Isolated alkaloid; blood sugar and cholesterol ---
  comparable to metformin in small trials.
- #strong[Recipe:] 500 mg 3× daily with meals.
- #strong[Sourcing:] Capsule form from Coptis, Berberis, Hydrastis.
- #strong[Note:] Recent clinical research supports metabolic effects

== 133. Ivy Leaf (#emph[Hedera helix])
<herb-global-133-ivy-leaf>
- #strong[Benefit:] Pediatric cough syrup; Prospan extract widely
  prescribed in Europe.
- #strong[Recipe:] 5--7.5 ml syrup 2--3× daily.
- #strong[Sourcing:] European standardized extract.

== 134. Agrimony (#emph[Agrimonia eupatoria])
<herb-global-134-agrimony>
- #strong[Benefit:] Astringent; diarrhea, mild cystitis.
- #strong[Recipe:] 1 tsp herb as tea.
- #strong[Sourcing:] European/Asian herb.

== 135. Hyssop (#emph[Hyssopus officinalis])
<herb-global-135-hyssop>
- #strong[Benefit:] Expectorant; classical biblical herb.
- #strong[Recipe:] 1 tsp herb as tea.
- #strong[Sourcing:] Mediterranean garden herb.

== 136. Rose (#emph[Rosa damascena / gallica])
<herb-global-136-rose>
- #strong[Benefit:] Heart-soothing; rose-water, rose petal tea for grief
  and skin.
- #strong[Recipe:] Petal tea; hydrosol on skin.
- #strong[Sourcing:] Damask rose, Bulgarian and Iranian.

== 137. Hibiscus (#emph[Hibiscus sabdariffa])
<herb-global-137-hibiscus>
#safety-line(preg: "avoid", lact: "safe", n: 4)
- #strong[Benefit:] Blood pressure reduction; sour cooling tea.
- #strong[Recipe:] 1 tbsp flowers in hot water 5 min, 2--3× daily.
- #strong[Sourcing:] Tropical; Egypt, Sudan major producers.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/25875025/")[PubMed --- Hibiscus sabdariffa for blood pressure: meta-analysis (2015)]]

== 138. Cordyceps (#emph[Cordyceps spp])
<herb-global-138-cordyceps>
#safety-line(preg: "unknown", lact: "unknown", n: 3)
- #strong[Benefit:] Duplicate of TCM entry.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/23435589/")[PubMed --- Cordyceps sinensis: pharmacology and clinical applications review (2013)]]

== 139. Astragalus (#emph[Astragalus membranaceus])
<herb-global-139-astragalus>
#safety-line(preg: "caution", lact: "unknown", n: 4)
- #strong[Benefit:] Duplicate of Huang Qi.

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/astragalus")[NCCIH --- Astragalus]
·
#link("https://pubmed.ncbi.nlm.nih.gov/25258669/")[PubMed --- Astragalus membranaceus: pharmacology and clinical review (2014)]]

== 140. Schisandra (#emph[Schisandra chinensis])
<herb-global-140-schisandra>
#safety-line(preg: "avoid", lact: "unknown", n: 3)
- #strong[Benefit:] Duplicate of Wu Wei Zi.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/25281912/")[PubMed --- Schisandra chinensis: CYP-mediated drug interactions review (2014)]]

== 141. Rhaponticum (Maral Root) (#emph[Rhaponticum carthamoides])
<herb-global-141-rhaponticum-maral-root>
- #strong[Benefit:] Siberian adaptogen; physical stamina, traditional in
  athletes.
- #strong[Recipe:] Tincture or 500 mg extract.
- #strong[Sourcing:] Siberian/Altai mountains.

== 142. Spirulina (#emph[Arthrospira platensis])
<herb-global-142-spirulina>
- #strong[Benefit:] Protein-rich cyanobacteria; iron, B12 analog
  (limited bioavailability).
- #strong[Recipe:] 1--5 g daily in smoothies.
- #strong[Sourcing:] Cultivated; verify heavy-metal testing.

== 143. Chlorella (#emph[Chlorella vulgaris])
<herb-global-143-chlorella>
- #strong[Benefit:] Green algae; traditional detox (heavy metals
  evidence preliminary).
- #strong[Recipe:] 2--5 g daily broken-cell wall powder.
- #strong[Sourcing:] Cultivated.

== 144. Spearmint (#emph[Mentha spicata])
<herb-global-144-spearmint>
- #strong[Benefit:] Anti-androgenic (PCOS hirsutism); digestive.
- #strong[Recipe:] 2 cups tea daily for PCOS hirsutism.
- #strong[Sourcing:] Garden herb.

== 145. Damiana (#emph[Turnera diffusa])
<herb-global-145-damiana>
- #strong[Benefit:] Mexican traditional aphrodisiac and mild
  antidepressant.
- #strong[Recipe:] 1 tsp leaves as tea.
- #strong[Sourcing:] Mexico and Central America.

== 146. Muira Puama (#emph[Ptychopetalum olacoides])
<herb-global-146-muira-puama>
- #strong[Benefit:] Amazonian \'potency wood\' --- traditional sexual
  tonic.
- #strong[Recipe:] Bark tincture or decoction.
- #strong[Sourcing:] Amazonian tree bark.

== 147. Catuaba (#emph[Trichilia catigua])
<herb-global-147-catuaba>
- #strong[Benefit:] Brazilian aphrodisiac and nervine.
- #strong[Recipe:] Bark tincture 1--2 ml 2× daily.
- #strong[Sourcing:] Brazilian Atlantic forest.

== 148. Yohimbe (#emph[Pausinystalia johimbe])
<herb-global-148-yohimbe>
#safety-line(preg: "avoid", lact: "avoid", n: 5)
- #strong[Benefit:] African tree bark; yohimbine alkaloid used for
  erectile dysfunction.
- #strong[Recipe:] Prescription product (yohimbine HCl) preferable ---
  crude bark unreliable.
- #strong[Sourcing:] West African; bark sustainability concerns.
- #strong[Note:] BP and heart effects; don\'t combine with MAOIs

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/yohimbe")[NCCIH --- Yohimbe] ·
#link("https://pubmed.ncbi.nlm.nih.gov/29405779/")[PubMed --- Yohimbine adverse events: 10-year surveillance review (2018)]]

== 149. Kratom (#emph[Mitragyna speciosa])
<herb-global-149-kratom>
#safety-line(preg: "avoid", lact: "avoid", n: 4)
- #strong[Benefit:] Southeast Asian leaf; opioid-receptor agonist, pain
  and withdrawal. Regulated.
- #strong[Sourcing:] Southeast Asia.
- #strong[Note:] Controversial legal status; addiction potential

#emph[Modern sources:
#link("https://www.nccih.nih.gov/health/kratom")[NCCIH --- Kratom] ·
#link("https://www.fda.gov/news-events/public-health-focus/fda-and-kratom")[FDA --- FDA and Kratom]
·
#link("https://pubmed.ncbi.nlm.nih.gov/32221895/")[PubMed --- Mitragyna speciosa (kratom): pharmacology and clinical review (2020)]]

== 150. Blue Lotus (#emph[Nymphaea caerulea])
<herb-global-150-blue-lotus>
- #strong[Benefit:] Ancient Egyptian mildly psychoactive flower;
  calming.
- #strong[Recipe:] Wine infusion or tea from flowers.
- #strong[Sourcing:] Egypt, East Africa.

== 151. Mugwort (#emph[Artemisia vulgaris])
<herb-global-151-mugwort>
#safety-line(preg: "avoid", lact: "avoid", n: 2)
- #strong[Benefit:] Dream-enhancing, digestive bitter, menstrual
  regulator.
- #strong[Recipe:] 1 tsp herb as tea; or smudge.
- #strong[Sourcing:] European/Asian herb.
- #strong[Note:] Thujone content --- avoid long-term and in pregnancy

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/22096325/")[PubMed --- Artemisia vulgaris: phytochemistry and pharmacology review (2011)]]

== 152. Wormwood (#emph[Artemisia absinthium])
<herb-global-152-wormwood>
- #strong[Benefit:] Bitter tonic and traditional antiparasitic; base of
  absinthe.
- #strong[Recipe:] Small doses in formulas; short-term only.
- #strong[Sourcing:] European/global.
- #strong[Note:] Thujone neurotoxicity --- limit duration

== 153. Artemisia annua (#emph[Sweet wormwood])
<herb-global-153-artemisia-annua>
#safety-line(preg: "avoid", lact: "unknown", n: 3)
- #strong[Benefit:] Source of artemisinin antimalarial (Nobel 2015).
  Research in other conditions ongoing.
- #strong[Recipe:] Artemisinin-derived drugs used per protocol; crude
  herb unreliable.
- #strong[Sourcing:] Chinese cultivation.
- #strong[Note:] WHO recommends ACT therapy for malaria

#emph[Modern sources:
#link("https://www.who.int/publications/i/item/guidelines-for-the-treatment-of-malaria")[WHO --- WHO guidelines for the treatment of malaria --- artemisinin]
·
#link("https://pubmed.ncbi.nlm.nih.gov/28603104/")[PubMed --- Artemisia annua and artemisinin: pharmacological review (2017)]]

== 154. Neem (#emph[Azadirachta indica])
<herb-global-154-neem>
#safety-line(preg: "avoid", lact: "avoid", n: 3)
- #strong[Benefit:] Duplicate of Neem.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/23569463/")[PubMed --- Azadirachta indica: a comprehensive review (2013)]]

== 155. Tongkat Ali (#emph[Eurycoma longifolia])
<herb-global-155-tongkat-ali>
- #strong[Benefit:] Southeast Asian tonic; small studies suggest
  testosterone and stress effects.
- #strong[Recipe:] 200--400 mg standardized extract daily.
- #strong[Sourcing:] Malaysian, Indonesian.

== 156. Kudzu (#emph[Pueraria lobata])
<herb-global-156-kudzu>
- #strong[Benefit:] Alcohol craving reduction in small trials; also for
  neck tension.
- #strong[Recipe:] 300 mg root extract 2× daily before drinking.
- #strong[Sourcing:] Asian origin; invasive in US.

== 157. Pine Bark (#emph[Pinus pinaster (Pycnogenol)])
<herb-global-157-pine-bark-pinus-pinaster-pycnogenol>
- #strong[Benefit:] OPC-rich; circulation, cognitive, ADHD in children.
- #strong[Recipe:] 50--150 mg Pycnogenol daily.
- #strong[Sourcing:] French Landes pine.

== 158. Grape Seed Extract (#emph[Vitis vinifera])
<herb-global-158-grape-seed-extract>
- #strong[Benefit:] OPC-rich like pine bark; vascular support.
- #strong[Recipe:] 150--300 mg standardized extract daily.
- #strong[Sourcing:] Wine-industry byproduct.

== 159. Resveratrol (#emph[Polygonum cuspidatum])
<herb-global-159-resveratrol>
- #strong[Benefit:] Polyphenol studied for longevity and cardiovascular;
  human data mixed.
- #strong[Recipe:] 250--500 mg daily; often with food.
- #strong[Sourcing:] Japanese knotweed source.

== 160. Olive Oil (EVOO) (#emph[Olea europaea])
<herb-global-160-olive-oil-evoo>
#safety-line(preg: "caution", lact: "safe", n: 3)
- #strong[Benefit:] Cornerstone of Mediterranean diet; polyphenol-rich
  extra-virgin cardiovascular.
- #strong[Recipe:] 2--4 tbsp daily replacing other fats.
- #strong[Sourcing:] True extra-virgin; polyphenol-rich varieties.

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/25880820/")[PubMed --- Olea europaea leaf: cardiovascular effects review (2015)]]

== 161. Flaxseed (#emph[Linum usitatissimum])
<herb-global-161-flaxseed>
- #strong[Benefit:] ALA omega-3, lignans; hormone balance,
  cardiovascular.
- #strong[Recipe:] 1--2 tbsp freshly ground daily.
- #strong[Sourcing:] Global cultivation.

== 162. Chia Seed (#emph[Salvia hispanica])
<herb-global-162-chia-seed>
- #strong[Benefit:] Omega-3, fiber, mineral-rich; Aztec staple.
- #strong[Recipe:] 1--2 tbsp soaked in water or smoothie.
- #strong[Sourcing:] Mexican/Central American.

== 163. Hemp Seed (#emph[Cannabis sativa (fiber type)])
<herb-global-163-hemp-seed-cannabis-sativa-fiber-type>
- #strong[Benefit:] Complete protein and omega-3:6 balance;
  non-psychoactive.
- #strong[Recipe:] 2--3 tbsp hulled seeds daily.
- #strong[Sourcing:] Global cultivation.

== 164. Nigella / Black Seed (#emph[Nigella sativa])
<herb-global-164-nigella-black-seed>
#safety-line(preg: "avoid", lact: "caution", n: 5)
- #strong[Benefit:] Middle Eastern traditional tonic; trials for asthma,
  blood sugar, lipids.
- #strong[Recipe:] 1--3 g seeds or 500 mg oil daily.
- #strong[Sourcing:] Middle Eastern origin.
- #strong[Note:] Recent trial research

#emph[Modern sources:
#link("https://pubmed.ncbi.nlm.nih.gov/23436482/")[PubMed --- Nigella sativa: clinical review (2013)]]

== 165. Propolis (#emph[Bee-collected resin])
<herb-global-165-propolis>
- #strong[Benefit:] Antimicrobial; cold sores, wound healing, sore
  throat.
- #strong[Recipe:] Tincture spray for throat; topical for cold sores.
- #strong[Sourcing:] Beekeepers worldwide.

== 166. Raw Honey (#emph[Apis mellifera product])
<herb-global-166-raw-honey>
- #strong[Benefit:] Antimicrobial (Manuka particularly); cough
  suppressant in children over 1 year.
- #strong[Recipe:] 1 tsp for cough; topical on wounds.
- #strong[Sourcing:] Unpasteurized, single-source.
- #strong[Note:] Never to infants under 1 year (botulism)

== 167. Royal Jelly (#emph[Bee queen food])
<herb-global-167-royal-jelly>
- #strong[Benefit:] 10-HDA and proteins; traditional tonic, menopausal
  symptom research.
- #strong[Recipe:] 500--1000 mg fresh royal jelly daily.
- #strong[Sourcing:] Refrigerated fresh; quality varies.

== 168. Bee Pollen (#emph[Flower pollen collected by bees])
<herb-global-168-bee-pollen>
- #strong[Benefit:] Protein, vitamins, carotenoids; tonic.
- #strong[Recipe:] 1 tsp daily, building from small pinch for allergy
  testing.
- #strong[Sourcing:] Local beekeepers.

== 169. Spilanthes (#emph[Acmella oleracea])
<herb-global-169-spilanthes>
- #strong[Benefit:] \'Toothache plant\' --- analgesic and antimicrobial,
  fresh flower buds numb the mouth.
- #strong[Recipe:] Fresh flower bud chewed for local numbing.
- #strong[Sourcing:] Tropical garden.

== 170. Bladderwrack (#emph[Fucus vesiculosus])
<herb-global-170-bladderwrack>
- #strong[Benefit:] Iodine-rich seaweed; thyroid support. Verify needs
  first.
- #strong[Recipe:] 1--3 capsules daily.
- #strong[Sourcing:] Atlantic coast.

== 171. Irish Moss (#emph[Chondrus crispus])
<herb-global-171-irish-moss>
- #strong[Benefit:] Mucilaginous seaweed; respiratory, gut,
  mineral-rich.
- #strong[Recipe:] Soaked and blended into gel.
- #strong[Sourcing:] North Atlantic.

== 172. Colloidal Oatmeal (#emph[Avena sativa])
<herb-global-172-colloidal-oatmeal>
- #strong[Benefit:] Topical anti-itch; eczema, dermatitis.
- #strong[Recipe:] Oatmeal bath 1 cup ground oats in bath.
- #strong[Sourcing:] Food-grade rolled oats.

== 173. Oat Straw / Milky Oat (#emph[Avena sativa])
<herb-global-173-oat-straw-milky-oat>
- #strong[Benefit:] Nervine tonic; chronic stress, nicotine withdrawal.
- #strong[Recipe:] 1 tsp herb as tea 2--3× daily; or milky-oat tincture
  fresh.
- #strong[Sourcing:] Harvested in milky stage for medicinal use.

= Cross-Cultural Symptom Index
<cross-cultural-symptom-index>
Remedies from all five regions grouped by condition. Abbreviations:
#strong[\[IN\]] India, #strong[\[PE\]] Peru/Andes/Spanish,
#strong[\[CN\]] China, #strong[\[JP\]] Japan, #strong[\[GL\]] Other
Global.

#quote(block: true)[
Educational cross-reference only. Confirm suitability, dose, and
interactions for your situation before use.
]

== Respiratory --- cough, bronchitis, sore throat
<respiratory--cough-bronchitis-sore-throat>
- #strong[\[IN\]] Tulsi, Vasaka, Mulethi, Sitopaladi churna, Pippali,
  Turmeric + honey, Chyawanprash
- #strong[\[PE\]] Huamanripa, Matico, Eucalipto (folk), Thyme (tomillo),
  Malva
- #strong[\[CN\]] Pi Pa Ye (loquat), Bai He (lily bulb), Xing Ren,
  Bakumondō herbs, Jin Yin Hua, Nin Jiom Pei Pa Koa
- #strong[\[JP\]] Bakumondō-tō, Biwa-ha, Karin syrup, Kinkan honey,
  Daikon-ame, Renkon juice, Kakkon-tō
- #strong[\[GL\]] Thyme, Mullein, Elderberry syrup, Marshmallow/Slippery
  elm, Oregano steam, Sage gargle, Honey + lemon

== Cold, flu, fever
<cold-flu-fever>
- #strong[\[IN\]] Tulsi-ginger kadha, Giloy, Kalmegh, Turmeric-milk,
  Trikatu
- #strong[\[PE\]] Muña, Eucalipto vapor, Coca (altitude), Manzanilla
- #strong[\[CN\]] Yin Qiao San, Ban Lan Gen, Gan Mao Ling, Kakkon-tō
- #strong[\[JP\]] Kakkon-tō, Shōga-yu (ginger hot drink), Umeboshi
  bancha, Yuzu bath
- #strong[\[GL\]] Echinacea, Elderberry, Yarrow tea (diaphoretic),
  Garlic-honey, Linden flower

== Sleep & insomnia
<sleep--insomnia>
- #strong[\[IN\]] Ashwagandha milk, Jatamansi, Brahmi, Tagara,
  Nutmeg-milk
- #strong[\[PE\]] Valeriana, Pasiflora, Tilo, Manzanilla, Hierba Luisa
- #strong[\[CN\]] Suan Zao Ren, Bai Zi Ren, Long Yan Rou, Yuan Zhi, Gui
  Pi Tang
- #strong[\[JP\]] Yokukansan, Sansō\'nin-tō, Hōjicha, Lavender sachet
  (folk import)
- #strong[\[GL\]] Valerian, Hops, Passionflower, Lavender, Chamomile,
  Kava (noble)

== Anxiety & stress
<anxiety--stress>
- #strong[\[IN\]] Ashwagandha, Brahmi, Jatamansi, Shankhpushpi,
  Saraswatarishta
- #strong[\[PE\]] Pasiflora, Valeriana, Hierba Luisa, Manzanilla, Tilo
- #strong[\[CN\]] Suan Zao Ren, He Huan Pi, Gan Mai Da Zao Tang, Xiao
  Yao San
- #strong[\[JP\]] Yokukansan, Kamishoyōsan, Matcha (L-theanine), Hōjicha
- #strong[\[GL\]] Lemon balm, Passionflower, Rhodiola, Kava, Lavender,
  St John's Wort

== Depression, low mood
<depression-low-mood>
- #strong[\[IN\]] Ashwagandha, Brahmi, Saffron-milk, Mucuna
- #strong[\[PE\]] Maca, Pasiflora, Aguaymanto
- #strong[\[CN\]] Xiao Yao San, Chai Hu Shu Gan San, Gan Mai Da Zao Tang
- #strong[\[JP\]] Kamishoyōsan, Hangekōbokutō
- #strong[\[GL\]] St John's Wort, Saffron, Rhodiola, Lemon balm

== Memory & cognition
<memory--cognition>
- #strong[\[IN\]] Brahmi, Shankhpushpi, Mandukaparni (gotu kola),
  Ashwagandha, Saraswatarishta
- #strong[\[CN\]] Yuan Zhi, Shi Chang Pu, Tian Wang Bu Xin Dan
- #strong[\[JP\]] Yokukansan (dementia behaviors), Chōtōsan
- #strong[\[GL\]] Ginkgo, Rosemary, Bacopa, Lion's mane mushroom

== Digestion / bloating / gas
<digestion--bloating--gas>
- #strong[\[IN\]] Hingvastak churna, Trikatu, Ajwain, Jeera-saunf, Hing
  in ghee
- #strong[\[PE\]] Muña, Manzanilla, Hierba Luisa, Paico, Boldo
- #strong[\[CN\]] Bao He Wan, Xiang Sha Liu Jun Zi, Chen Pi tea, Shan
  Zha
- #strong[\[JP\]] Rikkunshitō, Ume-shō-bancha, Shōga-yu, Sanshō
- #strong[\[GL\]] Fennel, Peppermint (IBS), Chamomile, Caraway,
  Artichoke leaf

== Constipation
<constipation>
- #strong[\[IN\]] Triphala, Haritaki, Isabgol (psyllium), Castor oil,
  Avipattikar
- #strong[\[PE\]] Linaza (flax), Sen (senna), Cascara sagrada, Malva
- #strong[\[CN\]] Ma Ren Wan, Da Huang (short term), Run Chang Wan
- #strong[\[JP\]] Mashiningan, Kanten (agar), Gobō fiber
- #strong[\[GL\]] Psyllium, Senna (short-term), Prunes, Flaxseed

== Diarrhea
<diarrhea>
- #strong[\[IN\]] Bilva, Kutaja, Musta, Pomegranate peel tea
- #strong[\[PE\]] Guayaba leaf, Manzanilla, Llantén
- #strong[\[CN\]] Shen Ling Bai Zhu San, Huang Lian, Che Qian Zi
- #strong[\[JP\]] Hangeshashintō, Umeboshi, Kuzu-yu
- #strong[\[GL\]] BRAT diet, Blackberry root, Agrimony, Slippery elm

== Acid reflux / gastritis / ulcers
<acid-reflux--gastritis--ulcers>
- #strong[\[IN\]] Yashtimadhu (licorice DGL), Amla, Shatavari,
  Avipattikar
- #strong[\[PE\]] Matico, Manzanilla, Malva, Llantén
- #strong[\[CN\]] Hai Piao Xiao (cuttlebone), Wu Bei Zi, Huang Lian for
  heat
- #strong[\[JP\]] Rikkunshitō, Hangeshashintō, Anchūsan
- #strong[\[GL\]] Slippery elm, DGL licorice, Marshmallow root, Cabbage
  juice

== Nausea & motion sickness
<nausea--motion-sickness>
- #strong[\[IN\]] Ginger, Pippali, Ajwain
- #strong[\[PE\]] Jengibre, Muña, Manzanilla
- #strong[\[CN\]] Sheng Jiang, Ban Xia (processed), Huo Xiang Zheng Qi
  San
- #strong[\[JP\]] Shōga-yu, Hangeshashintō
- #strong[\[GL\]] Ginger, Peppermint, Acupressure P6

== Liver support / detox
<liver-support--detox>
- #strong[\[IN\]] Bhumyamalaki, Kutki, Punarnava, Kalmegh, Bhringraj,
  Triphala
- #strong[\[PE\]] Boldo, Hercampuri, Chancapiedra, Diente de león
- #strong[\[CN\]] Yin Chen Hao, Xiao Chai Hu Tang, Wu Wei Zi
- #strong[\[JP\]] Shōsaikotō (under guidance), Ukon (turmeric)
- #strong[\[GL\]] Milk thistle, Dandelion root, Schisandra, Artichoke

== Kidney / urinary / stones
<kidney--urinary--stones>
- #strong[\[IN\]] Gokshura, Varuna, Punarnava, Pashanabheda
- #strong[\[PE\]] Chancapiedra, Cola de caballo, Manayupa
- #strong[\[CN\]] Che Qian Zi, Jin Qian Cao, Liu Wei Di Huang Wan
- #strong[\[JP\]] Chorei-to, Hachimijiogan
- #strong[\[GL\]] Cornsilk, Uva ursi (short-term), Nettle, Parsley

== Menstrual pain & PMS
<menstrual-pain--pms>
- #strong[\[IN\]] Ashoka, Shatavari, Dashamoola, Turmeric, Cinnamon
- #strong[\[PE\]] Orégano peruano, Manzanilla, Ruda (folk --- avoid
  pregnancy)
- #strong[\[CN\]] Si Wu Tang, Xiao Yao San, Dang Gui, Yi Mu Cao
- #strong[\[JP\]] Tōki-shakuyaku-san, Kamishoyōsan, Keishibukuryōgan
- #strong[\[GL\]] Chasteberry (Vitex), Cramp bark, Ginger, Raspberry
  leaf

== Menopause
<menopause>
- #strong[\[IN\]] Shatavari, Ashwagandha, Saffron
- #strong[\[CN\]] Zhi Bai Di Huang Wan, Er Xian Tang
- #strong[\[JP\]] Kamishoyōsan, Keishibukuryōgan, Tōki-shakuyaku-san
- #strong[\[GL\]] Black cohosh, Sage, Red clover, Honeybush, Maca

== Male vitality / fertility
<male-vitality--fertility>
- #strong[\[IN\]] Ashwagandha, Kapikacchu, Safed musli, Gokshura,
  Shilajit
- #strong[\[PE\]] Maca (black), Huanarpo macho, Chuchuhuasi
- #strong[\[CN\]] Lu Rong (antler), Yin Yang Huo, You Gui Wan, Cordyceps
- #strong[\[JP\]] Hachimijiogan, Gosha-jinki-gan
- #strong[\[GL\]] Tribulus, Tongkat ali, Fenugreek, Pine pollen

== Joint pain, arthritis
<joint-pain-arthritis>
- #strong[\[IN\]] Guggul (Yogaraj/Kaishore), Ashwagandha, Shallaki,
  Mahanarayan oil
- #strong[\[PE\]] Uña de gato, Chuchuhuasi, Cola de caballo
- #strong[\[CN\]] Du Huo Ji Sheng Tang, Fang Feng, Wei Ling Xian
- #strong[\[JP\]] Goshajinkigan, Keishi-ka-jutsubu-tō
- #strong[\[GL\]] Boswellia, Turmeric-piperine, Nettle, Devil's claw,
  Willow bark

== Skin --- eczema, acne, psoriasis
<skin--eczema-acne-psoriasis>
- #strong[\[IN\]] Neem, Manjistha, Turmeric paste, Sandalwood, Aloe
- #strong[\[PE\]] Sangre de grado, Sábila, Matico
- #strong[\[CN\]] Jin Yin Hua, Pu Gong Ying, Xiao Feng San
- #strong[\[JP\]] Dokudami, Yomogi bath, Jumihaidokutō
- #strong[\[GL\]] Calendula, Chamomile, Oregon grape root, Tea tree,
  Chickweed

== Wound healing
<wound-healing>
- #strong[\[IN\]] Turmeric + honey, Neem, Aloe gel, Jatyadi taila
- #strong[\[PE\]] Sangre de grado, Matico poultice, Miel de abeja
- #strong[\[CN\]] Yunnan Baiyao, San Qi, Zi Cao oil
- #strong[\[JP\]] Shiunkō ointment, Yomogi poultice
- #strong[\[GL\]] Manuka honey, Calendula, Plantain, Yarrow, Comfrey
  (external only)

== Headache & migraine
<headache--migraine>
- #strong[\[IN\]] Shadbindu, Anu taila nasya, Brahmi, Jatamansi
- #strong[\[CN\]] Chuan Xiong Cha Tiao San, Tian Ma, Gou Teng
- #strong[\[JP\]] Goshuyū-tō, Chōtōsan
- #strong[\[GL\]] Feverfew, Butterbur, Peppermint oil temple, Ginger

== Blood pressure
<blood-pressure>
- #strong[\[IN\]] Sarpagandha (Rx only), Arjuna, Ashwagandha
- #strong[\[CN\]] Gou Teng, Du Zhong, Tian Ma
- #strong[\[JP\]] Daisaikotō, Oren-gedoku-tō
- #strong[\[GL\]] Hawthorn, Hibiscus, Garlic, Olive leaf

== Cholesterol
<cholesterol>
- #strong[\[IN\]] Guggul, Arjuna, Fenugreek, Amla
- #strong[\[CN\]] Shan Zha, He Ye, Jue Ming Zi
- #strong[\[GL\]] Red yeast rice (with CoQ10), Artichoke, Oats, Psyllium

== Blood sugar / diabetes support
<blood-sugar--diabetes-support>
- #strong[\[IN\]] Gurmar (Gymnema), Jamun seed, Karela, Methi, Turmeric,
  Neem
- #strong[\[PE\]] Yacón, Pasuchaca, Hercampuri
- #strong[\[CN\]] Yu Mi Xu (cornsilk), Xiao Ke formulas, Bitter melon
- #strong[\[JP\]] Bakumondō-tō for dry diabetes thirst
- #strong[\[GL\]] Berberine, Bitter melon, Cinnamon, Fenugreek

== Immunity (general, chronic)
<immunity-general-chronic>
- #strong[\[IN\]] Chyawanprash, Guduchi, Amla, Ashwagandha
- #strong[\[PE\]] Uña de gato, Camu camu, Maca
- #strong[\[CN\]] Yu Ping Feng San (Astragalus + Bai Zhu + Fang Feng),
  Ling Zhi, Cordyceps
- #strong[\[JP\]] Hochu-ekki-tō, Jūzen-taiho-tō
- #strong[\[GL\]] Elderberry, Astragalus, Echinacea (short), Reishi,
  Vitamin D + Zn

== Fatigue / adrenal
<fatigue--adrenal>
- #strong[\[IN\]] Ashwagandha, Shatavari, Chyawanprash, Shilajit
- #strong[\[PE\]] Maca, Suma
- #strong[\[CN\]] Ren Shen, Huang Qi, Dang Shen
- #strong[\[JP\]] Hochu-ekki-tō, Jūzen-taiho-tō
- #strong[\[GL\]] Rhodiola, Eleuthero, Schisandra, Licorice (short),
  Cordyceps

== Eyes / vision
<eyes--vision>
- #strong[\[IN\]] Triphala eyewash, Amla, Saptamrita lauha
- #strong[\[CN\]] Gou Qi Zi + Ju Hua tea, Mi Meng Hua, Qi Ju Di Huang
  Wan
- #strong[\[GL\]] Bilberry, Lutein-rich greens

== Hair loss, graying
<hair-loss-graying>
- #strong[\[IN\]] Bhringraj oil, Amla, Neelibhringadi, Brahmi oil
- #strong[\[CN\]] Zhi He Shou Wu, Nu Zhen Zi, Han Lian Cao
- #strong[\[JP\]] Camellia oil (tsubaki), Kombu rinse
- #strong[\[GL\]] Rosemary oil, Nettle, Horsetail

== Oral / dental
<oral--dental>
- #strong[\[IN\]] Neem twig (datun), Triphala gargle, Clove oil
- #strong[\[MENA\]] Miswak stick, Myrrh rinse
- #strong[\[CN\]] Wu Bei Zi mouthwash
- #strong[\[JP\]] Salt + green tea rinse
- #strong[\[GL\]] Tea tree diluted, Propolis, Clove oil for toothache

== Ear
<ear>
- #strong[\[IN\]] Bilva taila drops, Garlic-ajwain oil
- #strong[\[GL\]] Mullein-garlic oil (intact eardrum only)

== Antiparasitic
<antiparasitic>
- #strong[\[IN\]] Vidanga, Palasha seed, Neem
- #strong[\[PE\]] Paico, Epazote, Papaya seeds
- #strong[\[CN\]] Bing Lang (betel nut), Shi Jun Zi
- #strong[\[GL\]] Black walnut hull, Wormwood, Clove, Pumpkin seeds

== Weight management (supportive)
<weight-management-supportive>
- #strong[\[IN\]] Triphala, Guggul, Medohar Vati
- #strong[\[CN\]] Shan Zha, He Ye (lotus leaf), Pu-erh tea
- #strong[\[JP\]] Bōfūtsūshōsan, Dai-saiko-tō
- #strong[\[GL\]] Green tea catechins, Glucomannan, Psyllium

// ──────────────────────────── Back matter ────────────────────────────
// Page-number references inside these files resolve against labelled
// entry headings produced by the build script.
#include "_pregnancy_ref.typ"
#include "_symptom_ref.typ"
#include "_latin_index.typ"
#include "_colophon.typ"
