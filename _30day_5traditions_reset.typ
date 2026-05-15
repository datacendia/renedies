// REMEDIA: THE 30-DAY FIVE TRADITIONS RESET
// Compile: typst compile _30day_5traditions_reset.typ Remedia_30_Day_Five_Traditions_Reset.pdf

#set document(title: "The 30-Day Five Traditions Reset", author: "Remedia")
#set page(paper: "us-letter", margin: 1in, numbering: none)
#set text(font: ("Georgia", "Times New Roman", "Liberation Serif"), size: 11pt, lang: "en")
#set par(justify: true, leading: 0.75em, spacing: 1.1em)

#show heading.where(level: 1): h => {
  pagebreak(weak: true)
  v(1.2in)
  align(center)[#text(size: 10pt, tracking: 4pt, fill: rgb("#888"))[#upper(h.body)]]
  v(2em)
}
#show heading.where(level: 2): h => {
  v(1.5em)
  text(size: 16pt, weight: "bold")[#h.body]
  v(0.3em)
  line(length: 100%, stroke: 0.5pt + rgb("#333"))
  v(0.5em)
}
#show heading.where(level: 3): h => {
  v(1em)
  text(size: 12pt, weight: "bold", fill: rgb("#444"))[#h.body]
  v(0.2em)
}

// ============== CALLOUT HELPERS ==============

#let cultural-attribution(body) = {
  v(0.5em)
  block(
    fill: rgb("#f4ede0"),
    inset: 12pt,
    radius: 4pt,
    width: 100%,
    stroke: (left: 2pt + rgb("#7a6f57")),
  )[
    #text(size: 8pt, tracking: 2pt, fill: rgb("#7a6f57"))[CULTURAL ATTRIBUTION]
    #v(0.3em)
    #text(size: 9.5pt)[#body]
  ]
  v(0.5em)
}

#let contraindications(body) = {
  v(0.5em)
  block(
    fill: rgb("#fbf2ee"),
    inset: 12pt,
    radius: 4pt,
    width: 100%,
    stroke: (left: 2pt + rgb("#a85a4a")),
  )[
    #text(size: 8pt, tracking: 2pt, fill: rgb("#a85a4a"))[⚠  CONTRAINDICATIONS & SAFETY]
    #v(0.3em)
    #text(size: 9.5pt)[#body]
  ]
  v(0.5em)
}

#let costnote(body) = {
  v(0.5em)
  block(
    fill: rgb("#eef2ec"),
    inset: 12pt,
    radius: 4pt,
    width: 100%,
    stroke: (left: 2pt + rgb("#5a7a5e")),
  )[
    #text(size: 8pt, tracking: 2pt, fill: rgb("#5a7a5e"))[COST & ACCESS]
    #v(0.3em)
    #text(size: 9.5pt)[#body]
  ]
  v(0.5em)
}

// COVER
#v(2in)
#align(center)[#text(size: 10pt, tracking: 6pt, fill: rgb("#666"))[R E M E D I A]]
#v(1.5in)
#align(center)[
  #text(size: 34pt, weight: "bold")[The 30-Day]\
  #text(size: 34pt, weight: "bold")[Five Traditions]\
  #text(size: 34pt, weight: "bold")[Reset]
]
#v(1em)
#align(center)[
  #text(size: 14pt, style: "italic", fill: rgb("#555"))[Ancient Wisdom From Five Continents.]\
  #text(size: 14pt, style: "italic", fill: rgb("#555"))[One Body. Thirty Days.]
]
#v(2.5in)
#align(center)[#text(size: 9pt, tracking: 3pt, fill: rgb("#888"))[A R E M E D I A   P R O T O C O L]]
#pagebreak()

// DISCLAIMER
#v(1in)
#align(center)[#text(size: 9pt, tracking: 3pt, fill: rgb("#888"))[M E D I C A L   D I S C L A I M E R]]
#v(2em)

This book is intended for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. The protocols, foods, herbs, and rituals described here come from traditional healing systems that have been practiced for centuries — but they are not personalized to your specific medical history, current medications, or health conditions.

Before beginning this reset, especially if you are pregnant, nursing, taking prescription medications, managing a chronic condition, or recovering from surgery or illness, please consult a qualified healthcare provider. Several herbs mentioned in this guide can interact with pharmaceutical drugs or affect blood pressure, blood sugar, or hormone levels. None of the statements in this book have been evaluated by any food, drug, or medical regulatory authority.

If you experience symptoms that worry you at any point during the reset — sharp pain, persistent dizziness, allergic reactions, irregular heartbeat, or anything that feels acutely wrong — stop the protocol immediately and seek qualified medical attention.

The traditions referenced here — Ayurveda from India, Traditional Chinese Medicine from China, Andean curanderismo from Peru, Kampo from Japan, and the Mediterranean-Middle Eastern herbal tradition — represent the work of countless practitioners across many generations. Remedia is a respectful student of these systems, not a substitute for the licensed practitioners who carry them.

#v(2em)
#align(center)[#text(size: 8pt, fill: rgb("#888"))[© 2026 Remedia. All rights reserved.]]
#pagebreak()

// HOW THIS DIFFERS FROM QUICK-FIX WELLNESS (front matter)
#v(0.7in)
#align(center)[#text(size: 10pt, tracking: 3pt, fill: rgb("#888"))[H O W   T H I S   D I F F E R S]]
#v(1.5em)
#align(center)[
  #text(size: 22pt, weight: "bold")[from the wellness you've already tried]
]
#v(2em)

#text(size: 10.5pt)[
#table(
  columns: (1fr, 1fr),
  align: (left + top, left + top),
  stroke: 0.5pt + rgb("#bbb"),
  inset: 10pt,
  [#text(weight: "bold", fill: rgb("#a85a4a"))[The 7-day-fix wellness model]],
  [#text(weight: "bold", fill: rgb("#5a7a5e"))[The Five Traditions Reset]],

  [Promises a transformation in 7 days. Then 7 more. Then a new "protocol" next month.],
  [30 days minimum because that is the unit of meaningful change. Then a sustainable rhythm for years.],

  [Sells supplements. Often \$200–\$500 per cycle. Affiliate revenue drives recommendations.],
  [Sells nothing. Estimated cost \$40–\$60 across 30 days, mostly food. No supplements required.],

  [Names internal villains — "toxins," "parasites," "hidden sugar," usually unverifiable.],
  [Names external mechanisms — weak digestive fire, depleted yin, mitochondrial inefficiency — each rooted in clinical observation across centuries.],

  [Treats one symptom at a time. New cleanse for each issue. Shame-driven before-and-afters.],
  [Treats the body as one system. Symptoms cluster, so the protocols cluster too. No before-and-after photos as marketing.],

  [Cherry-picks studies. Skips contraindications. Implies herbs are uniformly safe.],
  [Cites studies in the back matter. Lists contraindications next to every protocol. Says "consult a practitioner" as a real instruction, not a legal disclaimer.],

  [Borrows from cultures without naming them. "Ancient wisdom" replaces specific lineages.],
  [Names every source culture and lineage. Pays attribution forward. Does not market "ancestral" content stripped of its ancestors.],

  [Demands daily app time, supplement timing, biomarker tracking. Wellness as a part-time job.],
  [40 minutes per day total — a morning ritual and an evening ritual. The rest is just how you eat that day.],
)
]

#v(1em)
#align(center)[
  #text(size: 10pt, style: "italic", fill: rgb("#555"))[Five traditions, layered intentionally,]\
  #text(size: 10pt, style: "italic", fill: rgb("#555"))[outperform any single “quick fix” — every time, in every body, given thirty days.]
]
#pagebreak()

// DEDICATION
#v(3.5in)
#align(center)[
  #text(size: 13pt, style: "italic")[For everyone who has been told]\
  #text(size: 13pt, style: "italic")[that there must be a pill for this.]
  #v(1em)
  #text(size: 13pt, style: "italic")[There is also a plant.]\
  #text(size: 13pt, style: "italic")[There is also a ritual.]\
  #text(size: 13pt, style: "italic")[There is also a tradition.]
]
#pagebreak()

// TABLE OF CONTENTS
#v(0.5in)
#align(center)[#text(size: 10pt, tracking: 4pt, fill: rgb("#888"))[C O N T E N T S]]
#v(1.5em)

#text(size: 10pt)[
#table(
  columns: (1fr, auto), align: (left, right), stroke: none, inset: (x: 0pt, y: 5pt),
  [*FOREWORD* — Why Five Traditions, Not One], [6],
  [How This Differs From Quick-Fix Wellness], [3],
  [], [],
  [*PART ONE — THE FOUNDATION*], [],
  [Chapter 1: Why Modern Wellness Keeps Failing], [8],
  [Chapter 2: The Five Traditions Framework], [11],
  [Chapter 3: How to Use This Book], [14],
  [], [],
  [*PART TWO — THE 30-DAY RESET*], [],
  [Week 1 — Ayurvedic Foundation (India)], [16],
  [Week 2 — TCM Balance (China)], [24],
  [Week 3 — Andean Reignition (Peru)], [32],
  [Week 4 — Kampo Renewal (Japan)], [40],
  [], [],
  [*PART THREE — INTEGRATION*], [],
  [Chapter 16: The 70/30 Principle], [48],
  [Chapter 17: Your New Daily Stack], [50],
  [Chapter 18: Which Tradition When], [52],
  [], [],
  [*BACK MATTER*], [],
  [Five Traditions At a Glance], [54],
  [Foods to Favor], [55],
  [Glossary], [56],
  [Sources and Further Reading], [58],
  [About Remedia], [60],
)
]
#pagebreak()

#set page(numbering: "1", number-align: center + bottom)
#counter(page).update(1)

= Foreword

== Why Five Traditions, Not One

Every wellness book that comes across your desk asks you to commit to a single system. Eat keto. Try paleo. Adopt Ayurveda. Embrace TCM. Live like a Blue Zone centenarian. Each of these traditions contains real wisdom — and each of them, taken alone, is a partial answer to a body that does not live inside a single tradition.

You are not a single tradition. You wake up with cortisol patterns shaped by your nervous system, blood sugar fluctuations shaped by what you ate yesterday, gut bacteria shaped by every meal of the last decade, and hormones that respond to the season, the light, the moon, the people around you. No single culture's wisdom can address all of this. But five, layered intentionally, can.

This book is built on a simple observation: the great healing traditions of the world were each developed by people solving different survival problems in different environments. Ayurveda emerged in the heat and dust of the Indian subcontinent, where digestion was the central battleground. Traditional Chinese Medicine evolved in the temperate seasons of East Asia, where harmonizing internal energies with external rhythms became the priority. Andean medicine grew at altitude, where humans needed extraordinary metabolic resilience just to stay alive at thirteen thousand feet. Kampo refined itself in island Japan, where longevity and the dignity of aging became central concerns. And the Mediterranean-Middle Eastern traditions developed in landscapes of olive, fig, and pomegranate, where food and ritual blurred into the same thing.

Take the best of each. Layer them by week. Listen to your body. That is the entire premise of this reset.

You will not become Indian, Chinese, Peruvian, or Japanese over the next thirty days. You will become more of yourself — by borrowing, with respect, what each of these traditions discovered about the human body when they had the time and patience that modern medicine no longer affords.

What you are about to do is not a diet. It is not a cleanse in the punishing sense. It is a guided tour of how humans, before pharmaceuticals, kept themselves well. The map is thirty days long. The territory is your own body. Let us begin.

= Part One

== Chapter 1: Why Modern Wellness Keeps Failing

You have probably tried things before. A cleanse that left you exhausted. A supplement stack that drained your wallet and left your symptoms intact. A diet that worked for three weeks and then collapsed. An app that tracked your sleep but did not improve it. A doctor who ran your labs, told you everything was fine, and sent you home to feel exactly the same.

This pattern is not your failure. It is the pattern of an industry that has fragmented the body into specialties, the day into hacks, and the person into a customer. Modern wellness sells you the next thing. The traditions in this book sell you nothing. They simply describe what worked, for a long time, for people who could not afford for it not to work.

=== The Three Failures of the Modern Approach

*The first failure is reductionism.* You are told that your bloating is a gut problem, your fatigue is a thyroid problem, your weight is a metabolism problem, your anxiety is a serotonin problem. You go to four different specialists who never speak to each other. Each prescribes for their domain. Nothing improves, because the four domains are one body, and the body responds as one.

*The second failure is speed.* The supplement aisle promises results in seven days. The trending diet promises a transformation in twenty-one. Your body, designed by hundreds of thousands of years of evolution, does not move on this timeline. The traditions in this book operate on rhythms of seasons, cycles, and full lunar months — because they are tracking what the body actually does.

*The third failure is isolation.* Every traditional healing system on Earth understood that health is not produced in private. It happens in kitchens shared with family, in walks taken in community, in rituals performed at sunrise and sunset, in seasonal foods eaten together. The modern wellness industry will sell you a meditation app to use alone, a meal plan to follow alone, a workout to do alone. The body knows the difference between alone and accompanied. So does your cortisol.

=== What This Reset Does Differently

The Five Traditions Reset works because it accepts three things that modern wellness denies.

First, that your symptoms are connected. The bloating, the brain fog, the anxiety, the weight that will not move — these are not five problems. They are one body responding to a hundred small daily inputs. We address them together, not in sequence.

Second, that thirty days is the minimum unit of meaningful change. By day seven, you will feel different. By day fourteen, you will look different. By day twenty-one, your patterns will begin to stick. By day thirty, your baseline will have moved. Anything that promises this faster is selling you a feeling, not a change.

Third, that traditions are wiser than apps. The protocols here come from peoples who lived without supplements, screens, or shortcuts. What they ate, when they fasted, how they rested, which herbs they trusted — this is the original evidence base. We pair it with what modern science has confirmed, never with what modern science has refused to test.

== Chapter 2: The Five Traditions Framework

The thirty days ahead are organized into four weekly tradition immersions, with a fifth tradition — Mediterranean-Middle Eastern — woven throughout as a foundational layer.

=== Week 1 — Ayurveda (India): The Digestive Fire

Ayurveda's central insight is that almost every illness begins in the gut. Not because of what is in the gut, but because of how strongly the gut is processing what arrives. The Sanskrit word for this processing power is _agni_ — the digestive fire. When _agni_ is strong, food becomes nutrition. When _agni_ is weak, food becomes _ama_ — the toxic, undigested residue that ferments into bloating, fatigue, skin breakouts, and joint pain.

Week 1 rebuilds _agni_. We do this with warm foods, simple meals, specific spices (turmeric, ginger, cumin, fennel), and a tea called CCF — cumin, coriander, fennel — that has supported gut healing for two thousand years. You will sip warm water all day. You will eat your last meal before sunset. You will rediscover what hunger actually feels like.

=== Week 2 — Traditional Chinese Medicine (China): The Five Elements

Chinese medicine sees the body as a network of five elements — wood, fire, earth, metal, water — each connected to organs, emotions, seasons, and times of day. When one element is depleted or in excess, the others fall out of balance. Hormones, in this view, are not just chemicals: they are the visible end-products of an entire energetic state.

Week 2 stabilizes that energetic state. We work with the liver-wood element (which governs frustration, menstrual flow, and decision-making), the kidney-water element (which governs deep energy reserves and reproductive vitality), and the spleen-earth element (which governs digestion and the capacity to nourish oneself). The signature practices are bone broth, congee, adaptogenic teas, evening foot soaks, and one full day of rest. By the end of Week 2, your sleep will deepen and your mood will steady.

=== Week 3 — Andean Curanderismo (Peru): The Energy Reset

The Andean tradition developed at altitudes where any wasted metabolic effort meant death. Andean healers understood, long before mitochondrial research existed, that what we call energy is not willpower — it is the efficiency of how cells produce ATP. They worked with foods that supported this efficiency directly: maca, quinoa, kiwicha, the Andean potato in its thousand forms, the leaves of the coca plant chewed not for narcotic effect but as a mineral and metabolic support.

Week 3 reignites metabolism using these same principles. We introduce maca root, increase movement (Andean walking, not gym sessions), use cold exposure intelligently, and time meals around natural light. The signature practice of this week is the _despacho_ — a daily ritual of intentional gratitude. You may roll your eyes at this. Try it for seven days anyway. Andean grandmothers were not wrong.

=== Week 4 — Kampo (Japan): The Longevity Layer

Kampo is Japan's adaptation of Chinese medicine, refined over a thousand years into a system known for precision, gentleness, and lifelong use. Where Ayurveda is dramatic and TCM is energetic, Kampo is quiet. Its formulas are small. Its movements are minimal. Its meals are barely seasoned. And yet Okinawan grandmothers walk to the market at ninety-five and live independently until one hundred.

Week 4 absorbs the Kampo principles: _hara hachi bu_ (eat until you are eighty percent full), _shinrin-yoku_ (forest bathing — twenty minutes of slow attention in a green space), seasonal foods (we work with what is in season for your hemisphere), and gentle daily tea (sencha or matcha, prepared with intention).

=== The Mediterranean Layer (Background to All Four Weeks)

Throughout all four weeks, we draw on the Mediterranean-Middle Eastern tradition — olive oil, lemon, pomegranate, fresh herbs (mint, parsley, rosemary, sage), legumes, sourdough, and unhurried meals around a shared table. This is not a fifth week because it is not a substitute. It is the constant. Whatever tradition you are immersed in that week, the Mediterranean foundation supports it.

== Chapter 3: How to Use This Book

This is a book you live with for thirty days. Not a book you finish in one weekend and forget. The chapters are designed to be read on the day they apply, and the rituals are designed to be done, not studied.

=== Before You Begin

In the seven days before Day 1, do four things.

First, read Part One. You are reading it now. Finish this chapter before Day 1 arrives.

Second, clear your kitchen. Move — do not throw away — the following to a single box stored out of sight: ultraprocessed snacks, refined sugar, seed oils (canola, soybean, sunflower, safflower), industrial-bread products, sweetened beverages, and any food whose ingredients you cannot pronounce. You are not throwing these out. You are removing them from the eye-level path your brain takes a hundred times a day.

Third, stock your pantry. The shopping lists for each week are in Part Two and the back matter. For Week 1, you will need: basmati rice, mung dal or red lentils, ghee (or unsalted butter), cumin seeds, coriander seeds, fennel seeds, fresh ginger, turmeric powder, lemons, leafy greens, sweet potatoes, and unsweetened plant or whole milk.

Fourth, rate your baseline. On a piece of paper or in a notebook, score the following from one to ten today: Energy, Sleep Quality, Digestion, Skin Clarity, Mood, Joint Comfort, Mental Focus. Take a photograph of yourself in soft natural light. Write down your weight if you weigh, your waist measurement if you measure. You will return to these numbers on Day 7, Day 14, Day 21, and Day 30.

=== Day 0 Prep Checklist (Print or Tear Out)

Use this to walk into Day 1 prepared. None of these items are optional.

#text(size: 10pt)[
#table(
  columns: (auto, 1fr, auto),
  align: (left, left, right),
  stroke: 0.5pt + rgb("#bbb"),
  inset: 8pt,
  [*□*], [*Action*], [*Time*],
  [□], [Read Chapter 1–3 of this book to the end.], [60 min],
  [□], [Score your seven baseline markers. Photograph yourself in soft natural light.], [10 min],
  [□], [Move ultraprocessed foods, refined sugar, seed oils, and sweetened drinks into a single box, out of sight.], [20 min],
  [□], [Shop the Week 1 list (below).], [45 min],
  [□], [Buy a copper or stainless steel tongue scraper. Buy a glass jar for CCF tea.], [10 min],
  [□], [Set a sundown alarm on your phone for Days 1–7.], [2 min],
  [□], [Tell one person you are doing this. Ask them to ask you about it on Day 7.], [5 min],
)
]

*Week 1 Day-0 shopping list (one trip, one store, mostly produce).* Basmati rice (1 lb), split mung dal or red lentils (1 lb), ghee or unsalted butter (8 oz), whole cumin seeds, whole coriander seeds, whole fennel seeds, ground turmeric, fresh ginger root, lemons (4–6), seasonal leafy greens, sweet potatoes, carrots, beets, zucchini, dates, soaked-overnight almonds, whole milk or unsweetened almond milk, raw honey (small jar). Optional: cinnamon, cardamom, black pepper, sesame oil for foot massage.

#costnote[
  *Estimated total cost of the 30-day reset.* Roughly *USD \$40–\$60* in groceries beyond a normal week's shopping (the Week 1 spice kit is the largest one-time spend at \$15–\$20; later weeks borrow from the same pantry). \
  \
  No supplements are required. The protocols use only food, water, light, movement, and rest. \
  \
  *For comparison — typical wellness reset programs:* supplement-stack cleanses run \$200–\$500 per cycle; coached "detox" courses run \$400–\$1,500; common name-brand 30-day reset programs that bundle a powder, a protein, a tea, and a probiotic run \$300–\$700. \
  \
  Remedia is built so that *cost is not the barrier*. The barrier is the thirty days of attention.
]

=== During the Reset

Read each week's chapter on the morning of Day 1 of that week. Read the daily rituals chapter alongside it. Each day, do the morning ritual, follow the eating guidelines, do the evening ritual. That is the entire commitment. Forty minutes of intentional time, split across morning and evening.

You are not expected to be perfect. You are expected to be consistent. A day where you ate processed food at lunch but kept the morning ritual is a successful day. A day where you skipped everything is a learning day, not a failure. Begin again at the next sunrise.

=== After the Reset

Part Three describes how to integrate what worked. You will not continue all four weekly protocols simultaneously after Day 30 — that would not be sustainable or intelligent. Instead, you will identify which two or three practices most changed how you felt, and those become permanent. The rest become tools you return to seasonally, when life shifts and you need to reset again.

This is the long game. The first thirty days are the introduction.

= Part Two

== Week 1: The Ayurvedic Foundation

#v(1em)
#align(center)[
  #text(size: 11pt, style: "italic", fill: rgb("#555"))[Days 1 through 7]\
  #text(size: 11pt, style: "italic", fill: rgb("#555"))[This week, we rebuild the fire that turns food into life.]
]
#v(1em)

#cultural-attribution[
  *Tradition:* Ayurveda — "the science of life." \
  *Source culture & geography:* The Indian subcontinent. The earliest extant treatises (the Charaka Samhita and Sushruta Samhita) are dated to approximately 200 BCE–300 CE, drawing on oral traditions older still. \
  *Practitioner lineages:* Modern Ayurveda is taught and practiced by BAMS-credentialed _vaidyas_ (Bachelor of Ayurvedic Medicine and Surgery) across India. The names attached to its foundational works — Charaka, Sushruta, Vagbhata — represent schools of thought, not single authors. \
  *Remedia's role:* a respectful student and translator, not a substitute for a licensed Ayurvedic practitioner. We use Ayurvedic terms in their original Sanskrit (e.g. _agni_, _ama_, _khichari_) and credit the tradition by name in every place we draw on it.
]

=== Why India First: The Digestive Fire

When Ayurvedic physicians examine a patient, the first question is not _what is wrong?_ It is _how is your digestion?_ This is not because Ayurveda is obsessed with the gut. It is because Ayurveda observed, over two and a half millennia of clinical practice, that almost every chronic symptom — fatigue that sleep does not fix, brain fog that coffee does not clear, skin that does not heal, weight that does not move, sleep that does not restore — eventually traces back to a digestive system that is no longer fully processing what enters it.

The Sanskrit word for this processing capacity is _agni_, often translated as digestive fire. When _agni_ is strong, you wake hungry, you eat with appetite, you finish meals feeling lighter rather than heavier, your tongue is pink and clean in the morning, and your bowel movements are regular and satisfying. When _agni_ is weak — and in modern lives surrounded by cold food, processed snacks, late dinners, and chronic stress, it is almost always weak — food does not become nutrition. It becomes _ama_, the Sanskrit term for the residue of incomplete digestion. _Ama_ accumulates in the tissues, the joints, the channels of circulation. It manifests as the coated tongue you see in the morning, the sluggishness after meals, the inflammation that no amount of exercise resolves.

Week 1 is dedicated entirely to rebuilding _agni_. You will not count calories. You will not eliminate large food groups. You will eat warm. You will eat simply. You will eat by the rhythm of the sun. And you will let the digestive system finally complete what has been only half-finishing for years.

=== What Modern Science Confirms

The Ayurvedic emphasis on warm, cooked, easily digestible food maps onto what gastroenterology has slowly relearned about gut motility. Cold food slows enzymatic action. Processed food disrupts the microbiome's diversity. Late-night eating overlaps with the period when the migrating motor complex — the gut's natural overnight cleaning wave — needs to operate, and overlap suppresses it.

The CCF tea you will drink this week (cumin, coriander, fennel in equal parts) has been studied for digestive enzyme stimulation, anti-bloating effect, and gentle support of bile flow. Turmeric, the spice you will use daily, has been studied more extensively than almost any other plant on Earth for anti-inflammatory action#footnote[Hewlings, S. J. & Kalman, D. S. (2017). Curcumin: A Review of Its Effects on Human Health. _Foods_, 6(10):92.]. Ginger has the most consistent evidence of any natural compound for reducing nausea and supporting gastric motility.

You are not borrowing folklore. You are using one of the most validated traditional medicine systems on the planet.

=== Your Week 1 Protocol

*Foods to favor this week.* Basmati rice, mung dal, red lentils, ghee (a tablespoon a day spread across meals), sweet potatoes, carrots, beets, zucchini, leafy greens (spinach, chard, dandelion), cooked apples and pears, dates, almonds (soaked overnight, peeled), pumpkin seeds, fennel bulb, asparagus, ginger, turmeric, cumin, coriander, fennel seeds, cinnamon, cardamom, black pepper, lemon, lime, raw honey in moderation never heated.

*Foods to set aside this week.* Ice and ice water (room temperature or warm only), raw salads as a main meal (small amounts as a side are fine), commercial yogurt (homemade or unsweetened cultured plant alternatives are acceptable), red meat, fried food, processed snacks, refined sugar, alcohol, and coffee on an empty stomach (with food only, and only one cup if you are not yet ready to taper).

*The CCF tea.* Bring one quart of water to a boil. Add one teaspoon each of whole cumin seeds, whole coriander seeds, and whole fennel seeds. Simmer for ten minutes. Strain. Sip warm throughout the day from a thermos. This is your hydration this week.

#contraindications[
  *Turmeric (Curcuma longa) —* avoid in pregnancy, with anticoagulants (warfarin, apixaban) due to mild blood-thinning, and with active gallbladder disease. \
  *Ginger (Zingiber officinale) —* lower doses if pregnant; can interact with anticoagulants and blood-pressure medications at therapeutic doses. \
  *Fennel seeds (Foeniculum vulgare) —* avoid in estrogen-sensitive conditions (estrogen-receptor-positive cancers, endometriosis under hormonal management). \
  *Honey —* never give to children under 12 months (botulism risk). The book specifies _raw, never heated_ — heating honey above 40°C is considered toxic in Ayurveda and produces compounds (HMF) that modern toxicology also flags. \
  *Ghee / dairy —* if you have a confirmed dairy intolerance or casein allergy, substitute with cold-pressed sesame oil for cooking and skip the warm spiced milk. \
  \
  Always consult a qualified practitioner before adding daily turmeric supplements (capsules) on top of the culinary doses in this protocol. Culinary use (a quarter teaspoon to half a teaspoon a day, with food and a fat) carries minimal risk for most healthy adults.
]

*The khichari.* Khichari — sometimes spelled kitchari — is the central food of Week 1 and the most studied detox food in Ayurveda. The base recipe: half a cup of basmati rice, half a cup of split mung dal, washed and soaked for thirty minutes. In a heavy pot, melt one tablespoon of ghee. Add half a teaspoon each of cumin, coriander, fennel, and a quarter teaspoon of turmeric. Toast the spices for thirty seconds. Add the drained rice and dal, stir to coat. Add four cups of water and a pinch of salt. Bring to a boil, reduce to simmer, cover, and cook for thirty to forty minutes until soft and porridge-like. Stir in chopped fresh ginger and lemon juice at the end. Eat warm. You can have khichari for one or two meals a day this entire week.

*Meal timing.* Three meals. No snacking. Breakfast within an hour of waking. Lunch should be the largest meal of the day, between noon and one in the afternoon when _agni_ is at its peak. Dinner should be light and finished by six-thirty or seven in the evening. Twelve hours between dinner and breakfast is the minimum.

=== Days 1 through 7 Daily Rituals

*Morning ritual (15 minutes).* Upon waking, scrape your tongue with a copper or stainless steel tongue scraper. This removes the overnight _ama_ that has settled on the tongue. You will be startled by the coating in the first three days. By Day 7 it will be lighter. This is direct visible evidence that _agni_ is improving.

Drink one full glass of warm water with the juice of half a lemon. Wait fifteen minutes before coffee, tea, or food. This is non-negotiable for the entire week.

Five minutes of slow breathing. Inhale through the nose for four counts, exhale through the nose for six counts. Twelve cycles. This activates the parasympathetic nervous system before the day begins.

One sentence of intention, spoken aloud or written. It can be as simple as: _Today I am rebuilding my fire._

*Daytime habits.* Sip the CCF tea throughout the day from a thermos. Eat your three meals warm. Walk for ten to twenty minutes after lunch. Avoid sitting immediately after meals. Avoid drinking large amounts of water with meals — small sips are fine, but a full glass dilutes digestive juices. Drink most water between meals.

*Evening ritual (20 minutes).* Finish dinner by six-thirty or seven. Take a fifteen-minute walk after dinner, even a short one around the block. Movement after the evening meal supports digestion before sleep.

One hour before bed, prepare warm spiced milk: a cup of whole milk or unsweetened almond milk, a pinch of turmeric, a pinch of cinnamon, a small pinch of nutmeg, and half a teaspoon of ghee. Heat gently, do not boil. Sip warm.

Massage the soles of your feet with warm sesame oil or ghee for five minutes before bed. This _padabhyanga_ practice is one of the most underrated sleep aids in Ayurveda.

Phone in another room, or in airplane mode at a minimum. Lights low. In bed by ten-thirty for a nine to nine-thirty asleep target.

=== Week 1 Check-In

You have arrived at Day 7. Notice what has shifted.

*What most people notice by Day 7.* The morning tongue coating is lighter. Bloating after meals has reduced. Energy is more stable through the afternoon — fewer or no crashes. Bowel movements are more regular. Sleep is slightly deeper. You wake before the alarm rather than fighting it. Mental clarity is improving. Cravings for sugar and processed snacks have noticeably decreased.

If you are not noticing these things, do not panic. Some bodies — especially those with longer histories of poor digestion, medication use, or chronic stress — take two weeks rather than one to show the first signs. The internal work is happening even when the external signs are quiet.

*Day 7 journal exercise.* Re-rate your seven markers from Day 0. Compare. Even a one or two point improvement across most markers is meaningful evidence that the protocol is working.

Then answer in one or two sentences each: What was the single hardest moment of Week 1, and how did you move through it? What habit from Week 1 do you want to keep no matter what comes next? What did you notice about your body that you had not noticed before?

You are ready for Week 2.

== Week 2: TCM Balance

#v(1em)
#align(center)[
  #text(size: 11pt, style: "italic", fill: rgb("#555"))[Days 8 through 14]\
  #text(size: 11pt, style: "italic", fill: rgb("#555"))[This week, we calm the storm beneath the symptoms.]
]
#v(1em)

#cultural-attribution[
  *Tradition:* Traditional Chinese Medicine (TCM, _Zhōngyī_, 中医). \
  *Source culture & geography:* China, with codified roots in the _Huangdi Neijing_ (黄帝内经, the Yellow Emperor's Inner Canon, c. 200 BCE) and continuous clinical refinement since. \
  *Practitioner lineages:* Today practiced by licensed TCM doctors across China, by L.Ac. (Licensed Acupuncturist) practitioners in the United States, and by O.M.D. credential holders internationally. The 2018 inclusion of TCM in the WHO's International Classification of Diseases (ICD-11) reflects its global clinical scale. \
  *Remedia's role:* respectful student and translator. We use TCM terms in their original characters (肉桁 _ròu_, 气 _qì_) and credit the tradition by name. Bone broth, congee, and adaptogen teas in this week are simplified domestic versions of Chinese practices, not a replacement for clinical TCM diagnosis (pulse-and-tongue assessment) or prescribed formulas.
]

=== Five Elements and the Hormonal Web

Chinese medicine looks at the body the way a meteorologist looks at weather — as a constantly shifting system of forces, none of which can be understood in isolation. The five elements (wood, fire, earth, metal, water) are not literal physical substances. They are categories of movement and quality. Wood is upward and outward, like a sprouting tree. Fire is full expansion, like noon sun. Earth is grounded and settling, like late summer. Metal is contracting and refining, like autumn. Water is deep, still, and conserving, like winter.

Every organ in your body, in this view, belongs to an element. The liver is wood. The heart is fire. The spleen is earth. The lungs are metal. The kidneys are water. And every element interacts with every other element — feeding it, controlling it, draining it, supporting it. When one element is depleted or overrun, the others compensate, and over time the compensation becomes its own dysfunction.

This is where hormones come in. Hormones, in TCM, are not separate chemicals. They are the visible end-products of which elements are strong and which are depleted. Estrogen dominance, in this view, is often a sign that liver-wood is congested. Cortisol dysregulation is often a sign that kidney-water is depleted. Cycle irregularity is often a sign that spleen-earth — the element that holds and contains — is weak.

Modern endocrinology and TCM use different languages, but they often describe the same observations. Cortisol exhausts adrenal reserves; TCM would say kidney essence is being drained. Insulin resistance creates damp accumulation; TCM has been describing damp accumulation for two thousand years. Estrogen metabolism depends on liver function; TCM placed the liver at the center of women's health long before estrogen had a name.

Week 2 works with three elements directly: liver-wood, kidney-water, and spleen-earth. We use food, herbs, movement, and one full day of rest each week to restore them.

=== Your Week 2 Protocol

You continue everything from Week 1 — warm meals, three meals a day, sundown dinner, CCF tea, the morning and evening rituals. Now you layer in the TCM additions.

*Bone broth daily.* Bone broth is the most concentrated food in TCM for nourishing the kidney essence and supporting the spleen-earth element. A simple recipe: one whole chicken carcass or two pounds of grass-fed beef bones, two tablespoons of apple cider vinegar (helps extract minerals), one quartered onion, two carrots, two celery stalks, a piece of fresh ginger, a piece of dried seaweed (kombu) if available, water to cover. Simmer twelve hours minimum, twenty-four hours preferred. Strain. Salt to taste. Sip one cup daily, warm, between meals. If you cannot make it, use a high-quality store-bought broth — frozen or refrigerated, not shelf-stable, and as close to bone-only ingredients as you can find.

*Congee for breakfast.* Congee is the Chinese morning porridge — a long-simmered, watery rice that has fed convalescing populations across East Asia for two thousand years. The base recipe: half a cup of jasmine or white rice, eight cups of water, simmered uncovered for two hours until the grains break down into a thick, soup-like consistency. Stir in shredded ginger at the end. Top with: a soft-boiled egg, sauteed greens, a sprinkle of furikake or sesame seeds, a few drops of toasted sesame oil. Congee is more digestible than oatmeal, more nourishing than toast, and warms the digestive system in a way coffee never can.

*Adaptogen tea.* Once a day, sip a tea of reishi mushroom, astragalus, and licorice root — the trio Chinese herbal medicine has used for centuries to support deep energy reserves. A teaspoon of each, simmered ten minutes in two cups of water, sipped slowly. If you cannot source these whole, a quality blended adaptogen tea will do.

*Foods for liver-wood.* Dark leafy greens (especially dandelion, mustard greens, watercress), beets, lemon water, artichoke, turmeric (continued from Week 1), milk thistle tea, sour foods in moderation (vinegar, sauerkraut, pickled vegetables, ume plums).

*Foods for kidney-water.* Bone broth, black foods (black beans, black sesame, blackberries, black rice), seaweed, walnuts, kidney beans, organ meats if you eat them, eggs.

*Foods for spleen-earth.* Cooked sweet potatoes, winter squash, congee, oats (cooked, not raw), rice, dates, cooked apples, cinnamon, cardamom, ginger.

*The Rest Day.* One day this week, take a full day of intentional rest. Not a sick day. Not a recovery day. A day of complete reduction. No work, no errands, no productivity, no email, no social media, no driving if possible. Long slow meals. A bath. A book. A walk in nature. Conversation with one person you love. Sleep without an alarm.

This day will feel uncomfortable. The discomfort is part of the medicine. You are letting your nervous system, which has been in low-grade fight-or-flight for years, finally land. The first time you do this, you may cry. Many people do. This is the parasympathetic nervous system finally getting permission to do its work.

=== Days 8 through 14 Daily Rituals

*Morning ritual addition.* After the warm lemon water, do three minutes of gentle qigong or stretching. The simplest version: stand with feet shoulder-width apart, knees soft. Inhale, raise arms slowly to shoulder height in front of you, palms facing down. Exhale, lower arms. Repeat ten times. This is _shaking the tree_ — one of the oldest qigong warm-ups. It moves stagnant qi out of the chest and shoulders before the day begins.

*Midday habit.* Between two and four in the afternoon, when energy traditionally dips, do not reach for coffee. Reach instead for one cup of the adaptogen tea, and step outside for five minutes. The afternoon dip in TCM is the moment when the small intestine and bladder meridians are transitioning. Caffeine forces through it; light, air, and adaptogens support it.

*Evening ritual.* The Week 1 evening ritual continues. Add: a foot soak three times this week. In a basin, combine warm water (as warm as comfortable), one tablespoon of Epsom salts, a few slices of fresh ginger, a small handful of mugwort if you can source it. Soak feet for fifteen minutes before the warm spiced milk. The feet are where the kidney meridian begins, and a warm soak before bed draws downward and inward the energy that has spent the day moving outward and upward.

=== Week 2 Check-In

You have arrived at Day 14. You are halfway through.

*What most people notice by Day 14.* Sleep is significantly deeper. You are dreaming more, or remembering dreams for the first time in years. Irritability and emotional reactivity have decreased. The afternoon energy crash is mostly gone. Skin is beginning to clear. The rest day, which was excruciating in the first hour, became a relief by the third. You are starting to look forward to the evening ritual rather than treating it as homework.

If you weighed yourself, you may notice some weight has shifted — typically two to five pounds at this point, mostly water and inflammation. The scale is not the point of this reset, but the trend is real.

*Day 14 journal exercise.* Re-rate the seven markers. Compare to Day 0 and Day 7. Note what is moving, what is stuck, and what surprised you. Write one full paragraph about the rest day. What was hardest about it? What was unexpected? Would you keep this as a weekly practice past Day 30?

You are ready for Week 3.

== Week 3: Andean Reignition

#v(1em)

#cultural-attribution[
  *Tradition:* Andean curanderismo and the broader medicinal-plant practices of the Quechua and Aymara peoples. \
  *Source culture & geography:* The high Andes — modern Peru, Bolivia, Ecuador — with continuous practice predating the Inca Empire (pre-1400 CE) and surviving Spanish colonization. \
  *Practitioner lineages:* _Curanderos_ and _curanderas_ (community healers), _paqos_ (Andean priests), and _maestros_ are still active throughout the highlands and have been formally documented by ethnobotanists since the 1970s. \
  *Remedia's role:* respectful student and translator. The _despacho_ practice we adopt this week is a simplified version of a sacred Andean ritual; the full ceremonial form is conducted by trained _paqos_ and is not what we are doing here. We name the source. Maca, quinoa, kiwicha, and the Andean walking practice are real Andean foods and movements; the suggestions here are domestic-scale adaptations, not ceremony.
]

#align(center)[
  #text(size: 11pt, style: "italic", fill: rgb("#555"))[Days 15 through 21]\
  #text(size: 11pt, style: "italic", fill: rgb("#555"))[This week, we wake the engine.]
]
#v(1em)

=== Altitude Wisdom and Metabolic Power

The Andean highlands sit at elevations where most of the world cannot live. Cuzco, in southern Peru, is at eleven thousand feet above sea level. La Paz, in Bolivia, sits at twelve thousand. Many traditional Andean villages are higher still. At these altitudes, the air contains roughly thirty percent less oxygen than at sea level. The body has to extract more, use less, and waste nothing.

This is not a metaphor. It is a metabolic reality that shaped how Andean peoples ate, moved, and rested for thousands of years. Every food in the traditional Andean diet — quinoa, kiwicha (amaranth), maca, the many varieties of potato, the freeze-dried tubers called _chuño_ — was selected over generations for one essential property: maximum nutrition per unit of digestive effort.

Modern mitochondrial research has finally caught up to what Andean grandmothers always knew. Mitochondria — the energy factories inside every cell — are exquisitely responsive to the right inputs. Cold exposure makes them more numerous. Certain compounds (the polyphenols in maca, the amino acid profile in quinoa, the mineral density of Andean salt) make them more efficient. Intermittent reductions in carbohydrate intake make them more flexible. Movement in natural light makes them communicate better with the cells around them.

Week 3 introduces these Andean principles. We will not ask you to fast aggressively, take cold plunges at five in the morning, or chew coca leaves. We will use gentler, fully accessible versions of the same wisdom.

=== Your Week 3 Protocol

You continue what is working from Weeks 1 and 2. You may relax the strictest elements — the CCF tea becomes optional, the rest day becomes preferred but not mandatory, the bone broth continues if you enjoy it. Now you layer in the Andean elements.

*Maca daily.* Maca root is one of the most studied Andean foods. It is an adaptogen, supports balanced hormone production (for both women and men), and provides slow-release energy without the crash of caffeine. Use one teaspoon of gelatinized maca powder daily — gelatinized is more digestible than raw. Mix it into a morning smoothie, oatmeal, or warm milk. Start with half a teaspoon for the first two days if you have a sensitive system.

*Quinoa and kiwicha.* Replace at least one rice-based meal a day with quinoa, kiwicha (amaranth), or another Andean pseudograin. These are complete proteins — they contain all essential amino acids, which is unusual for plant foods. Cook them like rice, in twice as much water, salted, for fifteen to twenty minutes. They are the best lunch base for this week.

*Andean walking.* Andean walking is not gym walking. It is steady, sustained, mostly uphill or on uneven terrain, in natural light, with no headphones. Three thirty-minute walks this week, ideally in the morning. If you do not live near hills, walk briskly on level ground but extend to forty-five minutes. The point is sustained moderate effort that builds mitochondrial density without spiking cortisol.

*Cold exposure (gentle version).* End each morning shower with thirty seconds of cold. Just thirty seconds. The water should be uncomfortably cold but not painful. Breathe slowly. Do not gasp or hyperventilate. By the end of the week, build to one minute. This minor stress is enough to upregulate mitochondrial biogenesis, brown fat activation, and norepinephrine release — all of which support metabolic function and mood. If you have a heart condition or are pregnant, skip this.

*Sunrise light.* Within thirty minutes of waking, spend at least ten minutes outside in natural light. This is non-negotiable for the week. Even on cloudy days, outdoor light is ten to fifty times brighter than indoor lighting, and it sets the circadian rhythm that controls cortisol, melatonin, and metabolic timing. If you cannot go outside, sit by a window. If you have no window, invest in a ten-thousand-lux light therapy lamp and use it for twenty minutes.

*The Despacho.* The _despacho_ is a traditional Andean offering — a ritual of gratitude given to _Pachamama_ (Mother Earth) at moments of transition. It is one of the oldest spiritual practices in the Americas, and it has been the object of considerable misuse by wellness tourism. We use it here in its simplest, most respectful form, not as an appropriated ceremony but as an inspiration.

Each morning this week, before any food or coffee, spend two minutes in silent gratitude for three specific things. Out loud or in your head — whichever feels real. The three things should be different each day. The constraint is what makes the practice work. Vague generalized gratitude does nothing. Specific gratitude, repeated, rewires.

=== Days 15 through 21 Daily Rituals

*Morning ritual (Week 3 version).* Tongue scrape, warm lemon water, ten minutes outside in natural light, two minutes of specific gratitude (the despacho practice), smoothie or breakfast with maca added. The breathing and intention from Week 1 are now optional but encouraged.

*Movement.* A thirty-minute Andean walk on at least four days this week. Two short strength sessions of twenty minutes (bodyweight is fine: squats, lunges, push-ups, planks, rows with a resistance band — no equipment required). Walking after lunch continues. No high-intensity training. We are building mitochondria, not cortisol.

*Evening ritual (Week 3 addition).* Add a five-minute reflection at the end of the evening ritual: _What was the most energizing moment of today, and what was the most draining?_ Write the answers in one line each. By the end of the week, patterns will appear. The data is for you.

=== Week 3 Check-In

You have arrived at Day 21.

*What most people notice by Day 21.* Morning energy is dramatically improved — you are awake within minutes of waking rather than dragging for an hour. Afternoon energy is sustained without coffee. Workouts feel easier; recovery is faster. Mood is more even, with fewer reactive spikes. Sleep is the deepest it has been in years. Cravings for sugar and processed snacks are mostly absent. Clothes fit differently — especially around the midsection. The scale, if you weigh, may have moved another two to four pounds.

This is typically the breakthrough week. Many people report that Week 3 is when they begin to feel _good_ rather than just _less bad_.

*Day 21 journal exercise.* Re-rate the seven markers. Compare to all previous check-ins. You will likely see three to five points of improvement across most markers. Answer in writing: What is the single biggest change you have noticed? Which of the new practices feels permanent? Which feels like a temporary tool you would return to seasonally?

You are ready for Week 4.

== Week 4: Kampo Renewal

#v(1em)

#cultural-attribution[
  *Tradition:* Kampo (漢方, _kanpō_) — Japan's traditional medicine system, derived from Chinese medicine and refined in Japan over more than a thousand years. \
  *Source culture & geography:* Japan. Kampo arrived from China between the 5th and 7th centuries CE and was refined into a distinct Japanese clinical practice especially during the Edo period (1603–1868). \
  *Practitioner lineages:* Today practiced by Japanese physicians (Kampo is integrated into the Japanese national health insurance system, which covers approximately 148 Kampo formulas) and by specialist Kampo practitioners. _Hara hachi bu_ and _shinrin-yoku_ are cultural practices wider than Kampo proper. \
  *Practitioners across generations:* Documented Okinawan centenarians, including those tracked by the Okinawa Centenarian Study (1976–present), live the practices we adapt here — not as a programme but as a daily life rhythm. \
  *Remedia's role:* respectful student and translator. The _shinrin-yoku_ and _hara_ breathing we adopt are domestic-scale adaptations; clinical Kampo prescription is the work of credentialed Japanese practitioners.
]

#align(center)[
  #text(size: 11pt, style: "italic", fill: rgb("#555"))[Days 22 through 30]\
  #text(size: 11pt, style: "italic", fill: rgb("#555"))[This week, we settle in for the long life.]
]
#v(1em)

=== Why Japan Lives Longest

Okinawa, an island chain in southern Japan, has produced more centenarians per capita than almost any region on Earth. The world has spent the last forty years trying to figure out why. The answers are not dramatic. They are quiet, repeated, and almost suspiciously ordinary.

Okinawan elders practice _hara hachi bu_ — a cultural habit of eating until they are approximately eighty percent full, then stopping. They walk daily, often to the market and back, into their nineties. They eat seasonal foods, mostly plant-based, with small amounts of fish and almost no red meat. They drink green tea continually. They sit on the floor and stand back up dozens of times a day, maintaining mobility that gym programs cannot replicate. They have _ikigai_ — a reason to wake up — that is rarely about career and almost always about people, place, or purpose.

Kampo, Japan's traditional medicine, codified these observations into formal medical practice. Where Chinese medicine is energetic and dramatic, Kampo is precise and gentle. Its formulas are small. Its diagnostic methods focus on tongue, pulse, abdomen, and constitution. Its philosophy is that you support the body, you do not override it.

Week 4 is gentle by design. After three weeks of building, we now consolidate. You will eat slightly less. You will move slightly slower. You will pay slightly more attention to small pleasures. You will set the foundation for the rest of your life, which is what this reset has been preparing you for the whole time.

=== Your Week 4 Protocol

You continue all the practices that have stuck — the morning ritual, sundown dinner, evening ritual, walking, sunrise light. Some Week 1, 2, and 3 elements you may have already let go (the strict CCF tea, the cold exposure if it did not suit you, the foot soaks if you preferred the walks). That is appropriate. We are now selecting.

*Hara hachi bu*#footnote[Willcox, B. J., Willcox, D. C., & Suzuki, M. (2001). _The Okinawa Program: How the World's Longest-Lived People Achieve Everlasting Health._ Three Rivers Press. The Okinawa Centenarian Study has tracked the practice and its association with longer healthspan since 1976.]*.* This is the central practice of Week 4. At every meal this week, eat slowly. Put your fork or chopsticks down between bites. When you sense the first signal of fullness — not the _I have eaten enough_ signal, but the earlier, quieter _I do not need much more_ signal — stop. Save the rest. Eat it later, or do not. The first three days of this practice are uncomfortable. Your body will tell you that you are still hungry. You are not. You are experiencing the gap between actual fullness and the overfullness our culture has trained as normal.

*Green tea (sencha or matcha).* Replace one or two of your daily caffeine sources with green tea this week. Sencha (loose-leaf) is the everyday Okinawan tea. Matcha (powdered) is more concentrated and ceremonial. Both provide L-theanine — an amino acid that pairs with caffeine to produce calm focus rather than jittery alertness. Steep sencha at one hundred sixty to one hundred seventy degrees for one minute. Whisk matcha at the same temperature with a small bamboo whisk if you have one, or any small whisk if you do not.

*Seasonal, mostly plant-based eating.* This week, eat what is in season where you live. If it is autumn, that means squashes, apples, root vegetables, mushrooms, late greens. If it is spring, that means tender greens, peas, asparagus, radishes. If it is summer, that means tomatoes, cucumbers, berries, herbs. Most meals should be plant-forward — vegetables, beans, rice, small amounts of fish or eggs if you eat them, occasional small amounts of meat as a flavoring rather than a centerpiece.

*Shinrin-yoku — forest bathing.* Twice this week, spend twenty minutes in a park, woodland, or any genuinely green space. The phrase _shinrin-yoku_ — translating roughly to forest bathing — was coined by the Japanese government in the nineteen-eighties to describe what researchers were measuring: that slow attentive time in green space lowers cortisol, reduces blood pressure, improves immune cell counts, and produces measurable mood improvements#footnote[Park, B. J., Tsunetsugu, Y., Kasetani, T., Kagawa, T., & Miyazaki, Y. (2010). The physiological effects of _Shinrin-yoku_ (forest bathing): evidence from field experiments in 24 forests across Japan. _Environmental Health and Preventive Medicine_, 15:18–26.]. There is no goal to forest bathing other than to be there. No tracker, no podcast, no destination. Walk slowly. Stop sometimes. Notice the shape of a leaf. Listen for the second-quietest sound. Twenty minutes.

*Sleep as the centerpiece.* This is the week sleep becomes the most important variable. Every other practice serves it. Same bedtime, same wake time, including weekends. Cool room — sixty-five to sixty-eight degrees. Complete darkness, or a sleep mask. No screens ninety minutes before bed. Magnesium glycinate thirty minutes before sleep if it is not contraindicated for you. Herbal tea — chamomile, peppermint, or lavender — as the final transition.

*The Hara practice.* In Kampo and broader Japanese culture, the _hara_ — the lower abdomen — is considered the center of the body and the seat of the spirit. Each evening this week, before bed, place both palms on your lower abdomen. Breathe slowly into your hands for two minutes. Inhale through the nose for four counts, expanding into the hands. Exhale through the nose for six counts. This is one of the simplest and most underused practices in any tradition for resetting the nervous system before sleep.

#contraindications[
  *Across the four weeks of this protocol — universal flags.* \
  *Pregnancy and breastfeeding.* The 30-day reset as a whole is not contraindicated, but the herbal teas should be reduced or skipped: avoid daily turmeric tea, mugwort foot soaks, large doses of ginger, and full Andean cold-exposure protocols. Switch caffeine to decaf herbal options. \
  *Anticoagulant therapy (warfarin, apixaban, rivaroxaban, antiplatelets).* Turmeric, ginger, and ginkgo can amplify effect. Use only culinary doses. Inform your prescriber. \
  *Diabetes and blood-sugar medication.* Maca, ginger, and bitter herbs can lower blood sugar. Monitor and consult your prescriber. \
  *Thyroid medication.* Avoid simultaneous dosing with high-fiber breakfasts, calcium-rich foods, or strong adaptogens — separate by at least four hours. \
  *Active gallbladder disease.* Avoid daily turmeric and limit ghee until evaluated by a clinician. \
  *Active depression, bipolar, or major mental-health treatment.* The protocol's caffeine taper, intermittent fasting, and increased introspection can amplify mood states. Coordinate any changes with your prescriber. \
  *Recent surgery or active illness.* Postpone the cold exposure (Week 3) and intermittent fasting elements until cleared by your clinician. \
  \
  *None of this is a substitute for medical advice.* If you are managing a condition, take this book to your provider before starting and ask which elements they want you to defer.
]

=== Days 22 through 30 Daily Rituals

The morning and evening rituals are largely settled at this point. You have your version. This week, refine rather than expand.

*Mornings.* Tongue scrape, warm lemon water, sunrise light, gratitude practice (despacho), simple breakfast (oats or congee or eggs with greens), one cup of green tea instead of coffee for at least four days this week.

*Days.* Three meals, eaten with _hara hachi bu_ attention. Walks after meals. Forest bathing twice this week. Strength session twice this week. Tea instead of caffeine for one or two cups daily.

*Evenings.* Light dinner before sundown. Slow evening — no screens after eight or nine. Warm shower or bath. _Hara_ breathing for two minutes. In bed by ten-thirty.

=== Week 4 Check-In

You have arrived at Day 30.

*What most people notice by Day 30.* You wake before the alarm most mornings and rise within minutes of waking. Your tongue is pink and clean in the morning. Your skin has cleared and brightened in ways that no product alone produces. Your weight has shifted between four and twelve pounds in most cases, though the more meaningful change is how clothes fit and how you feel inhabiting your body. Your sleep is consistently deeper than it was thirty days ago. Your moods are steadier. Your bowel movements are reliable. Your hunger comes at the right times and stops when it should.

These are not the changes the wellness industry promised you. They are the changes traditions deliver when you stop trying to hack them.

*Day 30 journal exercise.* Re-rate the seven markers one final time. Write the numbers from Day 0, Day 7, Day 14, Day 21, and today side by side. Look at the column. That column is your evidence.

Then answer in writing:

What changed that you did not expect? What was the hardest moment, and how did you get through it? What habit do you never want to give up? How do you feel in your body right now compared to Day 1? What do you want to tell the version of yourself who started this reset?

Write a letter to yourself. Date it. Put it somewhere you will find it in six months. When you read it again, you will remember this version of you — and you will know what is possible.

= Part Three

== Chapter 16: The 70/30 Principle

The reset is over. The habits are just beginning. The purpose of the last thirty days was not to create a temporary transformation. It was to show your body what is possible when you give it the right inputs — and to build the architecture that sustains it.

The 70/30 Principle is simple: seventy percent of the time, eat and live the way you did during the reset. Thirty percent of the time, live the rest of your life. A glass of wine at dinner. A piece of cake at a birthday. A travel day with airport food and bad sleep. A holiday meal that has nothing to do with khichari, congee, quinoa, or _hara hachi bu_.

This is not the eighty-twenty that other programs prescribe, and the difference matters. Eighty-twenty is aspirational. Most people who try to live by eighty-twenty end up at sixty-forty after three months and quit. Seventy-thirty is honest. It is what real lives look like. And paradoxically, the people who commit to seventy-thirty consistently outperform the people who commit to eighty-twenty intermittently.

=== Non-negotiable habits to keep

Warm water and lemon in the morning, before anything else. Three meals, no snacking. Last meal before sundown when possible. A walk after lunch. No screens ninety minutes before bed. The evening tea ritual in whatever form you settled into. The Sunday rest day in whatever form you settled into. Forest bathing once a week. Forty minutes of intentional time, split across morning and evening. That is the foundation.

Everything else — the maca, the bone broth, the foot soaks, the cold showers, the despacho gratitude, the qigong — these are tools. You keep the ones that work for you. You return to the others when life shifts and you need them.

=== What you can relax

Strict meal timing on weekends and during travel. Caffeine on the days you need it. The occasional aperitif with a meal you love. Late-night conversations with people you love, even when it means a slightly later bedtime. The reset taught you what optimal looks like. Real life rarely lives at optimal. You now have the baseline to come back to.

=== When the warning signs appear

If bloating returns, sleep worsens, energy dips, cravings come back, or your skin breaks out — these are signals. Do not panic. Do not shame yourself. Simply do a mini-reset: three to five days of strict Week 1 protocols. The Ayurvedic foundation will reset your gut. Layer Week 2 back in if needed. You have done thirty days. Five is nothing.

== Chapter 17: Your New Daily Stack

After thirty days, the practices that survived are now yours. Not borrowed. Not aspirational. Yours. Below is the synthesized daily rhythm most people settle into after a Five Traditions Reset.

*Morning (15 minutes).* Tongue scrape. Warm water with lemon. Ten minutes of natural light, outside if possible. Two minutes of specific gratitude. One sentence of intention.

*Breakfast.* Warm and protein-forward. Eggs with sauteed greens. Congee with toppings. Oatmeal with maca, cinnamon, and nuts. Whatever the season suggests.

*Mid-morning.* One cup of green tea or coffee with food, not on an empty stomach.

*Lunch (the largest meal).* Plant-forward, with a base of rice, quinoa, or sourdough; a generous serving of vegetables; a protein; olive oil; herbs. Eat slowly. Stop at _hara hachi bu_ — eighty percent full.

*Afternoon.* A walk. Adaptogen tea instead of a second coffee if the afternoon dip arrives.

*Dinner (light, before sundown when possible).* A soup, a stew, a simple bowl of vegetables and protein. Smaller than lunch.

*Evening (20 minutes).* A walk after dinner. Warm spiced milk or herbal tea. Two minutes of _hara_ breathing. Five minutes of journaling — the most energizing and most draining moment of the day. Screens off ninety minutes before bed. In bed by ten-thirty.

*Weekly.* One full rest day. One strength session of twenty minutes (or two). Two thirty-minute walks in nature. One forest bath of twenty minutes.

That is the long-term structure. It is sustainable indefinitely because it does not require anything heroic. It requires consistency.

== Chapter 18: Which Tradition When

The deepest gift of a five-traditions reset is that you now have five tools, not one. Different seasons of your life will call for different traditions. Knowing which to return to is the skill that protects you for decades.

*Return to Ayurveda (Week 1 protocols) when:* digestion is sluggish, the tongue is coated in the morning, you feel heavy after meals, bloating has returned, your bowel movements are irregular, your skin is dull, you feel toxic without knowing why. Ayurveda is the gut reset. It is also the seasonal-transition reset — spring and fall especially.

*Return to TCM (Week 2 protocols) when:* you cannot sleep, your nervous system is wound tight, you are reactive and irritable, your cycle is irregular, you feel depleted in a way that food cannot fix, you are recovering from illness, you have been chronically over-giving. TCM is the energy and hormone reset.

*Return to Andean (Week 3 protocols) when:* you feel sluggish in a way that is not gut-related, your mood is flat, you have been indoor and sedentary, your metabolism feels stuck, you are coming out of a season of grief or depression, you need to wake up. Andean medicine is the engine reset.

*Return to Kampo (Week 4 protocols) when:* you are overeating, you have lost the rhythm of hunger and fullness, you have stopped paying attention to what you put in your mouth, you have lost touch with seasonal foods, you feel disconnected from your own body. Kampo is the gentleness reset.

*Lean on the Mediterranean layer always.* Olive oil. Lemon. Fresh herbs. Legumes. Pomegranate. Slow meals with people you love. This is the ground. The other four are seasons of attention you bring to it.

You do not need a teacher to know which tradition you need at any given moment. Your body knows. The reset taught you how to listen to it.

// ============== QR CODE / OPT-IN PAGE ==============
#pagebreak()
#v(1.5in)
#align(center)[#text(size: 10pt, tracking: 3pt, fill: rgb("#888"))[O N E   M O R E   T H I N G]]
#v(2em)
#align(center)[
  #text(size: 22pt, weight: "bold")[The next thirty days]\
  #text(size: 22pt, weight: "bold")[— a weekly drop, free.]
]
#v(2em)
#align(center)[
  #text(size: 11pt)[Once a week, on Sunday morning, you will receive one short note from us.]\
  #text(size: 11pt)[A single recipe, a single ritual, a single tradition's seasonal practice.]\
  #text(size: 11pt)[No supplements to buy. No "\$97 program." No upsell.]
]
#v(2em)
#align(center)[
  // QR placeholder — replace with: #image("qr_remedia_drop.png", width: 1.6in)
  #block(
    fill: rgb("#fff"),
    stroke: 1pt + rgb("#888"),
    inset: 16pt,
    radius: 4pt,
    width: 1.7in,
    height: 1.7in,
  )[
    #align(center + horizon)[
      #text(size: 9pt, fill: rgb("#888"))[▣ ▣ ▣ ▣ ▣]\
      #text(size: 9pt, fill: rgb("#888"))[▣      ▣]\
      #text(size: 9pt, fill: rgb("#888"))[▣  REMEDIA  ▣]\
      #text(size: 9pt, fill: rgb("#888"))[▣      ▣]\
      #text(size: 9pt, fill: rgb("#888"))[▣ ▣ ▣ ▣ ▣]\
      #v(0.4em)
      #text(size: 7pt, fill: rgb("#888"))[QR placeholder]
    ]
  ]
]
#v(1em)
#align(center)[
  #text(size: 10pt, style: "italic", fill: rgb("#555"))[Scan, or visit *remedia.example/drop*.]\
  #text(size: 9pt, fill: rgb("#888"))[Replace this page's QR with a generated code via your email tool's opt-in URL.]
]
#v(1em)
#align(center)[
  #text(size: 9pt, fill: rgb("#888"))[We will never sell your email. Unsubscribe with one click.]
]
#pagebreak()

= Back Matter

== Five Traditions At a Glance

#text(size: 10pt)[
#table(
  columns: (auto, 1fr, 1fr),
  align: (left, left, left),
  stroke: 0.5pt + rgb("#888"),
  inset: 8pt,
  [*Tradition*], [*Central Insight*], [*Signature Practice*],
  [Ayurveda (India)], [Almost every illness begins with weak _agni_ — digestive fire.], [Tongue scraping, warm meals, CCF tea, sundown dinner.],
  [TCM (China)], [Five elements govern organs, emotions, seasons. Balance is everything.], [Bone broth, congee, adaptogen tea, foot soaks, weekly rest day.],
  [Andean (Peru)], [Energy is mitochondrial efficiency. Foods, light, and movement build it.], [Maca, sunrise light, Andean walking, gentle cold exposure, gratitude.],
  [Kampo (Japan)], [Longevity is built from quiet, consistent, gentle practice.], [_Hara hachi bu_, green tea, _shinrin-yoku_, _hara_ breathing.],
  [Mediterranean], [Health is built around a shared table. Olive oil is medicine.], [Olive oil daily, pomegranate, slow meals, fresh herbs at every meal.],
)
]

== Foods to Favor (Combined From All Five Traditions)

*Proteins.* Wild fish (salmon, sardines, mackerel), pasture-raised eggs, organic poultry, legumes (mung dal, lentils, chickpeas, black beans), occasional grass-fed meat.

*Whole grains and pseudograins.* Basmati rice, jasmine rice, black rice, quinoa, kiwicha, oats, barley, sourdough (in small amounts).

*Vegetables.* Leafy greens (spinach, chard, dandelion, kale, mustard greens), cruciferous (broccoli, cauliflower, cabbage), root vegetables (sweet potato, beet, carrot, parsnip), seasonal squashes, mushrooms, asparagus, fennel, artichoke, seaweed.

*Fruits.* Berries (especially wild blueberries), pomegranate, lemon, lime, apples, pears, dates, figs.

*Healthy fats.* Extra virgin olive oil, ghee, coconut oil, avocados, soaked almonds, walnuts, pumpkin seeds, sesame seeds, flaxseeds.

*Fermented foods.* Sauerkraut, kimchi, miso, kefir (small amounts), apple cider vinegar with the mother.

*Spices, herbs, and teas.* Turmeric, ginger, cumin, coriander, fennel, cinnamon, cardamom, black pepper, rosemary, sage, parsley, mint, basil, thyme. Chamomile, peppermint, ginger tea, green tea, matcha, sencha, reishi-astragalus blends, CCF tea.

== Foods to Set Aside During the Reset

Refined sugar and artificial sweeteners. Industrial seed oils (canola, soybean, sunflower, safflower, corn). Ultraprocessed snacks and packaged foods. Fast food and fried food. Soda and fruit juice (whole fruit is fine). Excessive alcohol (a single glass with a meal occasionally is realistic post-reset). Conventional dairy if you suspect intolerance — small amounts of high-quality fermented dairy (kefir, traditional yogurt) and ghee are acceptable. Anything with ingredients you cannot pronounce.

After Day 30, reintroduce eliminated foods one at a time, spaced three days apart. Observe what your body says. Keep what works.

== Glossary

*Agni* (Sanskrit) — Digestive fire. The capacity of the body to process food into nutrition rather than waste. Central concept of Ayurveda.

*Ama* (Sanskrit) — The toxic residue of incomplete digestion. Visible as morning tongue coating, felt as sluggishness, inflammation, and stuck weight.

*CCF Tea* — Cumin, coriander, and fennel seeds in equal parts, simmered in water. The most accessible Ayurvedic digestive tea.

*Congee* (Chinese) — Long-simmered rice porridge, central to TCM convalescent and digestive cuisine.

*Despacho* (Quechua) — Andean ritual of intentional gratitude offered to _Pachamama_ (Mother Earth). We use a simplified version: two minutes of specific gratitude daily.

*Hara* (Japanese) — The lower abdomen, considered in Japanese culture as the body's center of gravity and the seat of spirit.

*Hara hachi bu* (Japanese, Okinawan dialect) — Eat until you are eighty percent full. The central dietary practice of Okinawan longevity.

*Ikigai* (Japanese) — The reason to wake up in the morning. A purpose larger than career, usually rooted in people, place, or contribution.

*Kampo* (Japanese) — Japan's traditional medicine system, derived from Chinese medicine and refined over a thousand years into a precise, gentle clinical practice.

*Khichari* (Sanskrit/Hindi, also kitchari) — The central food of Week 1. Rice and mung dal cooked together with ghee and spices. The most studied detoxification food in Ayurveda.

*Maca* — Andean root vegetable, used as adaptogen and hormone support. Best in gelatinized powder form.

*Padabhyanga* (Sanskrit) — Foot oil massage. Ayurvedic sleep practice.

*Pachamama* (Quechua) — Mother Earth. The central deity of Andean spirituality.

*Qi* (Chinese) — Vital energy. The animating force that flows through the meridians.

*Shinrin-yoku* (Japanese) — Forest bathing. Slow attentive time in green space, documented to reduce cortisol and improve immune function.

*Yang and yin* (Chinese) — The two complementary forces of TCM. Yang is active, warm, outward, masculine. Yin is receptive, cool, inward, feminine. Health is balance, not dominance.

== Sources and Further Reading

*On Ayurveda*

Lad, V. (2002). _Textbook of Ayurveda, Volume One: Fundamental Principles._ The Ayurvedic Press.

Frawley, D. (2000). _Ayurvedic Healing: A Comprehensive Guide._ Lotus Press.

Pole, S. (2013). _Ayurvedic Medicine: The Principles of Traditional Practice._ Singing Dragon.

*On Traditional Chinese Medicine*

Maciocia, G. (2015). _The Foundations of Chinese Medicine_ (3rd ed.). Elsevier.

Kaptchuk, T. J. (2000). _The Web That Has No Weaver: Understanding Chinese Medicine._ Contemporary Books.

*On Andean Medicine and Foods*

Bussmann, R. W. & Sharon, D. (2006). Traditional medicinal plant use in northern Peru. _Journal of Ethnobiology and Ethnomedicine_, 2:47.

Gonzales, G. F. (2012). Ethnobiology and ethnopharmacology of _Lepidium meyenii_ (maca). _Evidence-Based Complementary and Alternative Medicine._

*On Kampo and Japanese Longevity*

Buettner, D. (2008). _The Blue Zones: Lessons for Living Longer From the People Who've Lived the Longest._ National Geographic.

Watanabe, K. et al. (2011). Traditional Japanese Kampo medicine: Clinical research between modernity and traditional medicine. _Evidence-Based Complementary and Alternative Medicine._

*On Gut Health and the Microbiome*

Valdes, A. M. et al. (2018). The role of the microbiome in health and disease. _BMJ_, 361:k2179.

Chassaing, B. et al. (2017). Dietary emulsifiers impact the gut microbiota promoting inflammation. _Nature._

*On Intermittent Fasting and Metabolism*

de Cabo, R. & Mattson, M. P. (2019). Effects of intermittent fasting on health, aging, and disease. _New England Journal of Medicine_, 381:2541–2551.

*On Cold Exposure and Mitochondria*

van Marken Lichtenbelt, W. D. et al. (2009). Cold-activated brown adipose tissue in healthy men. _New England Journal of Medicine._

*On Forest Bathing and Cortisol*

Park, B. J. et al. (2010). The physiological effects of _Shinrin-yoku_ (forest bathing). _Environmental Health and Preventive Medicine._

*On Sleep, Cortisol, and Hormonal Health*

Walker, M. (2017). _Why We Sleep: Unlocking the Power of Sleep and Dreams._ Scribner.

Sapolsky, R. M. (2004). _Why Zebras Don't Get Ulcers_ (3rd ed.). Henry Holt.

*On Mediterranean Diet and Longevity*

Estruch, R. et al. (2018). Primary prevention of cardiovascular disease with a Mediterranean diet. _New England Journal of Medicine_, 378:e34.

== About Remedia

Remedia is a digital home for traditional herbal medicine from five regions of the world: India, China, Japan, Peru, and the broader Mediterranean and Middle East. We are not a single voice. We are an aggregator and translator — bringing the wisdom of practitioners we respect into a form accessible to people who did not grow up inside any of these traditions.

We do not sell supplements. We do not have affiliate relationships with supplement brands. When we recommend a product, you will see exactly why — and you will see any commercial relationship we have, in plain language, where you can see it.

We believe in five things. That traditional medicine is not a museum — it is a working library. That every reader is the final authority on their own body. That information should be free, and depth should be earned. That kitchens are pharmacies if you know how to read them. And that the body, given the right inputs, knows what to do.

Visit us at remedia.example. Read the encyclopedia. Use the body map. Take the quiz. Find a practitioner. Bring what you learn back into your kitchen. That is how a tradition stays alive — not by being preserved, but by being practiced.

#v(2em)
#align(center)[
  #text(size: 12pt, style: "italic", fill: rgb("#555"))[Thirty days is a beginning.]\
  #text(size: 12pt, style: "italic", fill: rgb("#555"))[The next thirty years is the practice.]
]
