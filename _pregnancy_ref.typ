#let page-ref(label) = context {
  let hits = query(label)
  if hits.len() > 0 {
    let p = hits.first().location().page()
    text(size: 9pt, fill: rgb("#555"))[p.#p]
  } else {
    text(size: 9pt, fill: rgb("#bbb"))[--]
  }
}
// Auto-generated pregnancy quick reference.
#pagebreak()
= Pregnancy quick reference

#text(size: 9.5pt, fill: rgb("#666"))[One-page summary of every remedy in this compendium with a structured safety flag for pregnancy. Always consult a qualified practitioner — this is a starting point, not a complete list.]

#v(0.8em)
== #text(fill: rgb("#b91c1c"))[Avoid in pregnancy]

#grid(columns: (1fr, auto), column-gutter: 1em, row-gutter: 0.35em,
  [Arnica — _Arnica montana_], page-ref(<herb-global-83-arnica>),
  [Artemisia annua — _Sweet wormwood_], page-ref(<herb-global-153-artemisia-annua>),
  [Black Cohosh — _Actaea racemosa_], page-ref(<herb-global-70-black-cohosh>),
  [Black seed / Habbat al-Barakah — _Nigella sativa_], page-ref(<herb-global-25-black-seed-habbat-al-barakah>),
  [Calendula — _Calendula officinalis_], page-ref(<herb-global-12-calendula>),
  [Comfrey — _Symphytum officinale_], page-ref(<herb-global-82-comfrey>),
  [Dong Quai (Dang Gui) — _Angelica sinensis_], page-ref(<herb-global-74-dong-quai-dang-gui>),
  [Fenugreek (Men's) — _Trigonella foenum-graecum_], page-ref(<herb-global-80-fenugreek-men-s>),
  [Feverfew — _Tanacetum parthenium_], page-ref(<herb-global-115-feverfew>),
  [Frankincense / Luban — _Boswellia sacra / serrata_], page-ref(<herb-global-26-frankincense-luban>),
  [Ginkgo — _Ginkgo biloba_], page-ref(<herb-global-65-ginkgo>),
  [Goldenseal — _Hydrastis canadensis_], page-ref(<herb-global-42-goldenseal>),
  [Gotu Kola — _Centella asiatica_], page-ref(<herb-global-81-gotu-kola>),
  [Hawthorn — _Crataegus monogyna / oxyacantha_], page-ref(<herb-global-95-hawthorn>),
  [Hibiscus — _Hibiscus sabdariffa_], page-ref(<herb-global-137-hibiscus>),
  [Hibiscus / Bissap / Karkadé — _Hibiscus sabdariffa_], page-ref(<herb-global-38-hibiscus-bissap-karkad>),
  [Holy Basil (Tulsi) — _Ocimum tenuiflorum_], page-ref(<herb-global-64-holy-basil-tulsi>),
  [Kava — _Piper methysticum_], page-ref(<herb-global-43-kava>),
  [Kratom — _Mitragyna speciosa_], page-ref(<herb-global-149-kratom>),
  [Mugwort — _Artemisia vulgaris_], page-ref(<herb-global-151-mugwort>),
  [Neem — _Azadirachta indica_], page-ref(<herb-global-154-neem>),
  [Nigella / Black Seed — _Nigella sativa_], page-ref(<herb-global-164-nigella-black-seed>),
  [Passionflower — _Passiflora incarnata_], page-ref(<herb-global-59-passionflower>),
  [Rosemary — _Salvia rosmarinus_], page-ref(<herb-global-6-rosemary>),
  [Saffron — _Crocus sativus_], page-ref(<herb-global-108-saffron>),
  [Sage — _Salvia officinalis_], page-ref(<herb-global-7-sage>),
  [Saw Palmetto — _Serenoa repens_], page-ref(<herb-global-75-saw-palmetto>),
  [Schisandra — _Schisandra chinensis_], page-ref(<herb-global-140-schisandra>),
  [Skullcap — _Scutellaria lateriflora_], page-ref(<herb-global-61-skullcap>),
  [St John’s Wort — _Hypericum perforatum_], page-ref(<herb-global-13-st-john-s-wort>),
  [St. John's Wort — _Hypericum perforatum_], page-ref(<herb-global-58-st-john-s-wort>),
  [Valerian — _Valeriana officinalis_], page-ref(<herb-global-14-valerian>),
  [Vitex (Chaste Tree) — _Vitex agnus-castus_], page-ref(<herb-global-69-vitex-chaste-tree>),
  [White Willow — _Salix alba_], page-ref(<herb-global-113-white-willow>),
  [Yarrow — _Achillea millefolium_], page-ref(<herb-global-19-yarrow>),
  [Yohimbe — _Pausinystalia johimbe_], page-ref(<herb-global-148-yohimbe>),
)

#v(0.6em)
== #text(fill: rgb("#d97706"))[Use only with caution]

#grid(columns: (1fr, auto), column-gutter: 1em, row-gutter: 0.35em,
  [Astragalus — _Astragalus membranaceus_], page-ref(<herb-global-139-astragalus>),
  [Chamomile — _Matricaria chamomilla_], page-ref(<herb-global-9-chamomile>),
  [Clove — _Syzygium aromaticum_], page-ref(<herb-global-128-clove>),
  [Cloves — _Syzygium aromaticum_], page-ref(<herb-global-105-cloves>),
  [Dandelion — _Taraxacum officinale_], page-ref(<herb-global-17-dandelion>),
  [Elder Flower — _Sambucus nigra_], page-ref(<herb-global-118-elder-flower>),
  [Elderberry / Sambucus — _Sambucus nigra_], page-ref(<herb-global-2-elderberry-sambucus>),
  [Fennel — _Foeniculum vulgare_], page-ref(<herb-global-11-fennel>),
  [Lavender — _Lavandula angustifolia_], page-ref(<herb-global-8-lavender>),
  [Lemon Balm — _Melissa officinalis_], page-ref(<herb-global-60-lemon-balm>),
  [Milk thistle — _Silybum marianum_], page-ref(<herb-global-16-milk-thistle>),
  [Nettle — _Urtica dioica_], page-ref(<herb-global-18-nettle>),
  [Olive Leaf — _Olea europaea_], page-ref(<herb-global-97-olive-leaf>),
  [Olive Oil (EVOO) — _Olea europaea_], page-ref(<herb-global-160-olive-oil-evoo>),
  [Peppermint — _Mentha × piperita_], page-ref(<herb-global-10-peppermint>),
  [Slippery elm — _Ulmus rubra_], page-ref(<herb-global-41-slippery-elm>),
  [Thyme — _Thymus vulgaris_], page-ref(<herb-global-5-thyme>),
)
