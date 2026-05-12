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
$body$

// ──────────────────────────── Back matter ────────────────────────────
// Page-number references inside these files resolve against labelled
// entry headings produced by the build script.
#include "_pregnancy_ref.typ"
#include "_symptom_ref.typ"
#include "_latin_index.typ"
#include "_colophon.typ"
