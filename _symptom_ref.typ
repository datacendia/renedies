#let page-ref(label) = context {
  let hits = query(label)
  if hits.len() > 0 {
    let p = hits.first().location().page()
    text(size: 9pt, fill: rgb("#555"))[p.#p]
  } else {
    text(size: 9pt, fill: rgb("#bbb"))[--]
  }
}
// Auto-generated symptom cross-reference.
#pagebreak()
= Symptom cross-reference

#text(size: 9.5pt, fill: rgb("#666"))[Every remedy grouped by the concern it traditionally addresses, with page number. Region codes: IN = India, PE = Peru/Andes, CN = China, JP = Japan, GL = Global.]

#v(0.6em)
