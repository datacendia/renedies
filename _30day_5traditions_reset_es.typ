// REMEDIA: EL RESET DE 30 DÍAS — CINCO TRADICIONES (Edición ES-LATAM)
// Compile: typst compile _30day_5traditions_reset_es.typ Remedia_30_Dias_Cinco_Tradiciones_Reset.pdf
//
// STATUS: Front matter + foreword translated. Protocol body (Weeks 1–4)
// pending professional translation review. See bottom of file for TODO list.

#set document(title: "El Reset de 30 Días — Cinco Tradiciones", author: "Remedia")
#set page(paper: "us-letter", margin: 1in, numbering: none)
#set text(font: ("Georgia", "Times New Roman", "Liberation Serif"), size: 11pt, lang: "es")
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

// ============== HELPERS (idénticos a la edición EN) ==============

#let cultural-attribution(body) = {
  v(0.5em)
  block(
    fill: rgb("#f4ede0"),
    inset: 12pt,
    radius: 4pt,
    width: 100%,
    stroke: (left: 2pt + rgb("#7a6f57")),
  )[
    #text(size: 8pt, tracking: 2pt, fill: rgb("#7a6f57"))[ATRIBUCIÓN CULTURAL]
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
    #text(size: 8pt, tracking: 2pt, fill: rgb("#a85a4a"))[⚠  CONTRAINDICACIONES Y SEGURIDAD]
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
    #text(size: 8pt, tracking: 2pt, fill: rgb("#5a7a5e"))[COSTO Y ACCESO]
    #v(0.3em)
    #text(size: 9.5pt)[#body]
  ]
  v(0.5em)
}

// ============== PORTADA ==============
#v(2in)
#align(center)[#text(size: 10pt, tracking: 6pt, fill: rgb("#666"))[R E M E D I A]]
#v(1.5in)
#align(center)[
  #text(size: 34pt, weight: "bold")[El Reset de]\
  #text(size: 34pt, weight: "bold")[30 Días —]\
  #text(size: 34pt, weight: "bold")[Cinco Tradiciones]
]
#v(1em)
#align(center)[
  #text(size: 14pt, style: "italic", fill: rgb("#555"))[Sabiduría ancestral de cinco continentes.]\
  #text(size: 14pt, style: "italic", fill: rgb("#555"))[Un cuerpo. Treinta días.]
]
#v(2.5in)
#align(center)[#text(size: 9pt, tracking: 3pt, fill: rgb("#888"))[U N   P R O T O C O L O   D E   R E M E D I A]]
#pagebreak()

// ============== AVISO MÉDICO ==============
#v(1in)
#align(center)[#text(size: 9pt, tracking: 3pt, fill: rgb("#888"))[A V I S O   M É D I C O]]
#v(2em)

Este libro tiene fines educativos e informativos únicamente. No reemplaza la consulta, el diagnóstico ni el tratamiento médico profesional. Los protocolos, alimentos, hierbas y rituales descritos aquí provienen de sistemas de sanación tradicionales practicados durante siglos — pero no están personalizados a tu historial médico, medicación actual o condiciones de salud específicas.

Antes de comenzar este reset, especialmente si estás embarazada, en período de lactancia, tomando medicamentos recetados, manejando una condición crónica, o recuperándote de cirugía o enfermedad, consulta con un profesional de salud calificado. Varias hierbas mencionadas en esta guía pueden interactuar con medicamentos farmacéuticos o afectar la presión arterial, el azúcar en sangre, o los niveles hormonales. Ninguna de las afirmaciones de este libro ha sido evaluada por una autoridad regulatoria de alimentos, medicamentos o salud.

Si experimentas síntomas que te preocupen en cualquier momento durante el reset — dolor agudo, mareos persistentes, reacciones alérgicas, latido cardíaco irregular, o cualquier cosa que se sienta agudamente mal — detén el protocolo inmediatamente y busca atención médica calificada.

Las tradiciones referenciadas aquí — Ayurveda de la India, Medicina Tradicional China de China, curanderismo andino del Perú, Kampo de Japón, y la tradición herbal del Mediterráneo y Medio Oriente — representan el trabajo de innumerables practicantes a través de muchas generaciones. Remedia es un estudiante respetuoso de estos sistemas, no un substituto de los practicantes licenciados que los portan.

#v(2em)
#align(center)[#text(size: 8pt, fill: rgb("#888"))[© 2026 Remedia. Todos los derechos reservados.]]
#pagebreak()

// ============== EN QUÉ SE DIFERENCIA ==============
#v(0.7in)
#align(center)[#text(size: 10pt, tracking: 3pt, fill: rgb("#888"))[E N   Q U É   S E   D I F E R E N C I A]]
#v(1.5em)
#align(center)[
  #text(size: 22pt, weight: "bold")[del wellness que ya intentaste]
]
#v(2em)

#text(size: 10.5pt)[
#table(
  columns: (1fr, 1fr),
  align: (left + top, left + top),
  stroke: 0.5pt + rgb("#bbb"),
  inset: 10pt,
  [#text(weight: "bold", fill: rgb("#a85a4a"))[El modelo wellness de "fix en 7 días"]],
  [#text(weight: "bold", fill: rgb("#5a7a5e"))[El Reset de Cinco Tradiciones]],

  [Promete una transformación en 7 días. Después otros 7. Después un nuevo "protocolo" el próximo mes.],
  [30 días mínimo porque esa es la unidad de cambio significativo. Después un ritmo sostenible por años.],

  [Vende suplementos. A menudo \$200–\$500 por ciclo. Los ingresos por afiliación dirigen las recomendaciones.],
  [No vende nada. Costo estimado \$40–\$60 USD a lo largo de 30 días, en su mayoría comida. No requiere suplementos.],

  [Nombra villanos internos — "toxinas," "parásitos," "azúcar oculto," generalmente no verificables.],
  [Nombra mecanismos externos — fuego digestivo débil, yin agotado, ineficiencia mitocondrial — cada uno arraigado en observación clínica de siglos.],

  [Trata un síntoma a la vez. Una limpieza nueva para cada problema. Antes-y-después con vergüenza.],
  [Trata el cuerpo como un sistema. Los síntomas se agrupan, así que los protocolos también. Sin fotos antes-y-después como marketing.],

  [Selecciona estudios convenientes. Omite contraindicaciones. Implica que las hierbas son uniformemente seguras.],
  [Cita estudios al final. Lista contraindicaciones junto a cada protocolo. Dice "consulta a un practicante" como instrucción real, no como descargo legal.],

  [Toma de culturas sin nombrarlas. "Sabiduría ancestral" reemplaza linajes específicos.],
  [Nombra cada cultura fuente y linaje. Paga la atribución. No comercializa contenido "ancestral" despojado de sus ancestros.],

  [Exige tiempo diario en la app, horarios de suplementos, seguimiento de biomarcadores. Wellness como trabajo de medio tiempo.],
  [40 minutos al día en total — un ritual matutino y un ritual nocturno. El resto es solo cómo comes ese día.],
)
]

#v(1em)
#align(center)[
  #text(size: 10pt, style: "italic", fill: rgb("#555"))[Cinco tradiciones, en capas intencionales,]\
  #text(size: 10pt, style: "italic", fill: rgb("#555"))[superan a cualquier "fix rápido" — cada vez, en cada cuerpo, dados treinta días.]
]
#pagebreak()

// ============== DEDICATORIA ==============
#v(3.5in)
#align(center)[
  #text(size: 13pt, style: "italic")[Para todos a quienes les dijeron]\
  #text(size: 13pt, style: "italic")[que tenía que haber una pastilla para esto.]
  #v(1em)
  #text(size: 13pt, style: "italic")[También hay una planta.]\
  #text(size: 13pt, style: "italic")[También hay un ritual.]\
  #text(size: 13pt, style: "italic")[También hay una tradición.]
]
#pagebreak()

// ============== ÍNDICE ==============
#v(0.5in)
#align(center)[#text(size: 10pt, tracking: 4pt, fill: rgb("#888"))[Í N D I C E]]
#v(1.5em)

#text(size: 10pt)[
#table(
  columns: (1fr, auto), align: (left, right), stroke: none, inset: (x: 0pt, y: 5pt),
  [*PRÓLOGO* — Por qué Cinco Tradiciones, no una], [6],
  [En qué se diferencia del wellness rápido], [3],
  [], [],
  [*PARTE UNO — LA BASE*], [],
  [Capítulo 1: Por qué el wellness moderno sigue fallando], [8],
  [Capítulo 2: El marco de las Cinco Tradiciones], [11],
  [Capítulo 3: Cómo usar este libro], [14],
  [], [],
  [*PARTE DOS — EL RESET DE 30 DÍAS*], [],
  [Semana 1 — Fundamento Ayurvédico (India)], [16],
  [Semana 2 — Equilibrio MTC (China)], [24],
  [Semana 3 — Reignición Andina (Perú)], [32],
  [Semana 4 — Renovación Kampo (Japón)], [40],
  [], [],
  [*PARTE TRES — INTEGRACIÓN*], [],
  [Capítulo 16: El Principio 70/30], [48],
  [Capítulo 17: Tu nuevo ritmo diario], [50],
  [Capítulo 18: Qué tradición, cuándo], [52],
  [], [],
  [*MATERIA POSTERIOR*], [],
  [Las Cinco Tradiciones de un Vistazo], [54],
  [Alimentos a Favorecer], [55],
  [Glosario], [56],
  [Fuentes y Lecturas Adicionales], [58],
  [Acerca de Remedia], [60],
)
]
#pagebreak()

#set page(numbering: "1", number-align: center + bottom)
#counter(page).update(1)

// ============== PRÓLOGO ==============
= Prólogo

== Por qué Cinco Tradiciones, no una

Cada libro de wellness que llega a tu escritorio te pide comprometerte con un solo sistema. Come keto. Prueba paleo. Adopta la Ayurveda. Adopta la MTC. Vive como un centenario de las Zonas Azules. Cada una de estas tradiciones contiene sabiduría real — y cada una, por sí sola, es una respuesta parcial a un cuerpo que no vive dentro de una sola tradición.

No eres una sola tradición. Te despiertas con patrones de cortisol moldeados por tu sistema nervioso, fluctuaciones de azúcar moldeadas por lo que comiste ayer, bacterias intestinales moldeadas por cada comida de la última década, y hormonas que responden a la estación, la luz, la luna, las personas a tu alrededor. Ninguna sabiduría de una sola cultura puede abordar todo esto. Pero cinco, en capas intencionales, sí pueden.

Este libro está construido sobre una observación simple: las grandes tradiciones de sanación del mundo fueron desarrolladas por pueblos resolviendo diferentes problemas de supervivencia en diferentes ambientes. La Ayurveda emergió en el calor y polvo del subcontinente indio, donde la digestión era el campo de batalla central. La Medicina Tradicional China evolucionó en las estaciones templadas del Asia Oriental, donde armonizar las energías internas con los ritmos externos se volvió la prioridad. La medicina andina creció a altura, donde los humanos necesitaron resiliencia metabólica extraordinaria solo para mantenerse vivos a cuatro mil metros. El Kampo se refinó en el Japón insular, donde la longevidad y la dignidad del envejecimiento se volvieron preocupaciones centrales. Y las tradiciones del Mediterráneo y Medio Oriente se desarrollaron en paisajes de olivo, higo y granada, donde la comida y el ritual se difuminaban en la misma cosa.

Toma lo mejor de cada una. Apílalas por semana. Escucha a tu cuerpo. Esa es toda la premisa de este reset.

No te volverás indio, chino, peruano o japonés en los próximos treinta días. Te volverás más de ti mismo — tomando prestado, con respeto, lo que cada una de estas tradiciones descubrió sobre el cuerpo humano cuando tenían el tiempo y la paciencia que la medicina moderna ya no se permite.

Lo que estás a punto de hacer no es una dieta. No es una limpieza en el sentido punitivo. Es un recorrido guiado de cómo los humanos, antes de los farmacéuticos, se mantenían bien. El mapa tiene treinta días. El territorio es tu propio cuerpo. Comencemos.

// ============== PROTOCOLO TODO ==============
= Pendiente — Cuerpo del Protocolo

== Aviso de localización

#block(
  fill: rgb("#fbf2ee"),
  stroke: (left: 2pt + rgb("#a85a4a")),
  inset: 14pt,
  radius: 4pt,
  width: 100%,
)[
  *Esta edición está en construcción.* La materia frontal (portada, aviso médico, "En qué se diferencia," dedicatoria, índice y prólogo) está completa y lista para ser distribuida como vista previa o gancho de captura.

  Las Partes Uno, Dos y Tres del libro — los capítulos centrales del protocolo de 30 días, las atribuciones culturales por semana, las contraindicaciones por hierba, y la materia posterior — siguen pendientes de traducción profesional desde la edición en inglés (`_30day_5traditions_reset.typ`).

  *Recomendación:* contratar un traductor médico-cultural ES-LATAM con experiencia en medicina tradicional para los capítulos protocolarios, en lugar de traducción automática. El contenido cubre afirmaciones de salud y nombres de prácticas culturales sensibles (ayurveda, curanderismo andino) donde la precisión cultural y clínica es no negociable.

  *Coste estimado:* USD \$0.10–\$0.15 por palabra × ~22,000 palabras = \$2,200–\$3,300 para una traducción profesional revisada.

  *Mientras tanto,* esta edición ES-LATAM contiene la página "En qué se diferencia" — la pieza de marketing más importante para el mercado hispanohablante, que sienta el tono ético contra el wellness de "fix rápido" antes que cualquier protocolo se mencione.
]

#pagebreak()

== Lista de tareas pendientes (para el equipo de localización)

#text(size: 10pt)[
#table(
  columns: (auto, 1fr, auto),
  align: (left, left, right),
  stroke: 0.5pt + rgb("#bbb"),
  inset: 8pt,
  [*□*], [*Sección a traducir desde EN*], [*Páginas EN aprox.*],
  [□], [Capítulo 1: Why Modern Wellness Keeps Failing], [3],
  [□], [Capítulo 2: The Five Traditions Framework (incluye atribuciones culturales)], [4],
  [□], [Capítulo 3: How to Use This Book + Day 0 Prep Checklist], [3],
  [□], [Semana 1: The Ayurvedic Foundation + atribución + contraindicaciones turmeric/ginger/fennel/honey/ghee], [8],
  [□], [Semana 2: TCM Balance + atribución cultural China + contraindicaciones], [8],
  [□], [Semana 3: Andean Reignition + atribución cultural Quechua/Aymara + contraindicaciones], [8],
  [□], [Semana 4: Kampo Renewal + atribución cultural Japón + contraindicaciones universales], [8],
  [□], [Capítulo 16: El Principio 70/30], [2],
  [□], [Capítulo 17: Tu nuevo ritmo diario], [2],
  [□], [Capítulo 18: Qué tradición, cuándo], [2],
  [□], [Materia posterior — glosario (mantener términos sánscritos/chinos/japoneses originales)], [3],
  [□], [Materia posterior — fuentes y lecturas (mantener referencias en idioma original)], [3],
  [□], [Página de QR + opt-in (al final)], [1],
)
]

#v(1em)
*Notas para el traductor:*

- Mantener términos sánscritos (_agni_, _ama_, _khichari_, _padabhyanga_), chinos (_qì_, _yīn_, _yáng_), quechua (_despacho_, _Pachamama_), y japoneses (_hara hachi bu_, _shinrin-yoku_, _kanpō_) en su lengua original con traducción/explicación entre paréntesis la primera vez que aparecen.
- Preservar el registro literario del original — la edición EN evita el lenguaje de "biohacking" y mantiene un tono de respeto por las tradiciones. La traducción ES-LATAM debe seguir el mismo registro.
- Para Perú/LATAM, el _despacho_ es una práctica sagrada — la edición debe enfatizar (más aún que la EN, idealmente) que estamos adoptando una versión simplificada respetuosa, no la ceremonia completa.
- Las cantidades culinarias y la economía (USD) deben adaptarse a la región: precios sugeridos en MXN/PEN/COP en la sección "Costo y acceso," no solo USD.
- El CTA final del QR es "Comenta RESET" en los videos — coordinar con la edición ES-LATAM del Production Guide.

#v(2em)
#align(center)[
  #text(size: 12pt, style: "italic", fill: rgb("#555"))[Treinta días son un comienzo.]\
  #text(size: 12pt, style: "italic", fill: rgb("#555"))[Los próximos treinta años son la práctica.]
]
