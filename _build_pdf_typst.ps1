# Canonical PDF build — Typst with:
#   • per-entry safety badges (pregnancy / lactation / interaction count)
#   • per-entry "modern sources" line for cited herbs
#   • Latin binomial index with page refs
#   • symptom cross-reference with page refs
#   • pregnancy contraindications quick-ref page
#   • per-tradition chapter opener pages (in template)
#   • colophon
#
# USAGE
#   pwsh ./_build_pdf_typst.ps1                     # master PDF (all regions, includes extended)
#   pwsh ./_build_pdf_typst.ps1 -Region India       # single-region PDF
#   pwsh ./_build_pdf_typst.ps1 -NoExtended         # markdown-only (fast, 250 entries)
#   pwsh ./_build_pdf_typst.ps1 -All                # master + all 5 regional PDFs
param(
  [ValidateSet('India','Peru','China','Japan','Global')]
  [string]$Region = '',
  [switch]$NoExtended,
  [switch]$All
)

# Avoid ValidateSet collisions with internal `$region` (case-insensitive) uses
# further down in the script.
$TargetRegion = $Region
Remove-Variable Region -ErrorAction SilentlyContinue

# If -All was passed, recurse to build every variant and exit.
if ($All) {
  & $PSCommandPath
  foreach ($r in 'India','Peru','China','Japan','Global') {
    & $PSCommandPath -Region $r
  }
  return
}

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$outName = if ($TargetRegion) { "Traditional_Herbal_Remedies_$TargetRegion.pdf" } else { 'Traditional_Herbal_Remedies_Compendium.pdf' }
$out  = Join-Path $root $outName
$template = Join-Path $root '_pdf_template.typ'
$siteData = Join-Path $root 'site\data'
$includeExtended = -not $NoExtended

# ── Typst binary ────────────────────────────────────────────────────────────
$typstCmd = Get-Command typst -ErrorAction SilentlyContinue
$typst = if ($typstCmd) { $typstCmd.Source } else { $null }
if (-not $typst) {
    $typst = Get-ChildItem -Path "$env:LOCALAPPDATA\Microsoft\WinGet\Packages\" -Recurse -Filter 'typst.exe' -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
}
if (-not $typst) { throw "typst.exe not found. Run: winget install Typst.Typst" }
Write-Host "Using typst: $typst"

# ── Data sources ────────────────────────────────────────────────────────────
$allRegionalFiles = @(
  @{ File = '01_Indian_Ayurvedic.md';        Region = 'India';              RegionSlug = 'india'; Key = 'India';  Extended = 'ayurveda.json' },
  @{ File = '02_Peruvian_Andean_Spanish.md'; Region = 'Peru/Andes/Spanish'; RegionSlug = 'peru';  Key = 'Peru';   Extended = 'andean.json'   },
  @{ File = '03_Chinese_TCM.md';             Region = 'China';              RegionSlug = 'china'; Key = 'China';  Extended = 'tcm.json'      },
  @{ File = '04_Japanese_Kampo.md';          Region = 'Japan';              RegionSlug = 'japan'; Key = 'Japan';  Extended = 'kampo.json'    },
  @{ File = '05_Other_Global.md';            Region = 'Global';             RegionSlug = 'global';Key = 'Global'; Extended = 'global.json'   }
)

# Apply -Region filter (match by Key).
if ($TargetRegion) {
  $regionalFiles = @($allRegionalFiles | Where-Object { $_.Key -eq $TargetRegion })
  if (-not $regionalFiles) { throw "Unknown region: $TargetRegion" }
  Write-Host "Building regional PDF: $TargetRegion"
} else {
  $regionalFiles = $allRegionalFiles
  Write-Host "Building master compendium (all regions)"
}
Write-Host ("Extended JSON datasets: {0}" -f $(if ($includeExtended) { 'INCLUDED' } else { 'SKIPPED (-NoExtended)' }))

# Chapter intros shown on the opener pages.
$chapterIntros = @{
  'India'              = @{ epigraph = 'Sarve bhavantu sukhinaḥ — may all beings be well.'; body = 'Fifty entries from the Ayurvedic corpus: classical herbs (Ashwagandha, Turmeric, Triphala) alongside culinary-medicinal staples. Preparation language follows the Charaka and Sushruta conventions; dosages are given in practical home measures rather than śāstric units.' }
  'Peru/Andes/Spanish' = @{ epigraph = 'Cada planta sabe su enfermedad.'; body = 'Andean curanderismo, Amazonian plant medicine, and Iberian folk remedies that crossed the Atlantic. Many entries list both Spanish and Quechua common names; altitude and harvest notes accompany sourcing where relevant.' }
  'China'              = @{ epigraph = 'The superior physician treats what is not yet ill.'; body = 'Fifty materia medica entries from Traditional Chinese Medicine. Classical names (pinyin precedes modern botanical identifications where given in the source). Formulas follow the Shang Han Lun and Wen Bing conventions.' }
  'Japan'              = @{ epigraph = 'Ichi-go ichi-e — one encounter, one opportunity.'; body = 'Kampo is TCM reinterpreted through four centuries of Japanese clinical adaptation. Expect familiar Chinese herbs (kakkon, shokyo) in characteristically simplified formulas — usually fewer ingredients per prescription than their TCM equivalents.' }
  'Global'             = @{ epigraph = 'Every landscape carries its own pharmacy.'; body = 'Remedies from Europe, Africa, the Middle East, the Americas, the Pacific, and Southeast Asia that do not belong to the four anchor traditions. Regulatory status varies widely — legality and sourcing notes are flagged where known.' }
}

# ── Load structured safety + references (JSON with alias resolution) ────────
Write-Host "Loading safety + references..."
$safetyRaw = Get-Content -Path (Join-Path $siteData 'safety.json')     -Raw -Encoding UTF8 | ConvertFrom-Json
$refsRaw   = Get-Content -Path (Join-Path $siteData 'references.json') -Raw -Encoding UTF8 | ConvertFrom-Json

function Resolve-AliasedEntry {
    param($store, [string]$key, [int]$depth = 0)
    if ($depth -gt 4) { return $null }
    if (-not $store.PSObject.Properties[$key]) { return $null }
    $v = $store.$key
    if ($null -eq $v) { return $null }
    if ($v.PSObject.Properties['_alias']) {
        return Resolve-AliasedEntry -store $store -key $v._alias -depth ($depth + 1)
    }
    return $v
}

function Normalize-Key([string]$s) {
    if ($null -eq $s) { return '' }
    $s = $s.ToLowerInvariant()
    $s = $s -replace '[*_]', ''
    $s = $s -replace '\s+', ' '
    return $s.Trim()
}

function Lookup-For {
    param($store, [string]$name, [string]$latin)
    $keys = @()
    if ($latin) { $keys += Normalize-Key $latin }
    if ($name)  {
        $n = Normalize-Key $name
        $keys += $n
        # Strip slash variants: "Turmeric / Haldi" -> "turmeric"
        $keys += ($n -split '[/—–-]')[0].Trim()
    }
    foreach ($k in $keys) {
        if ($k -and $store.PSObject.Properties[$k]) {
            $resolved = Resolve-AliasedEntry -store $store -key $k
            if ($resolved) { return $resolved }
        }
    }
    return $null
}

# ── Markdown entry preprocessor ─────────────────────────────────────────────
function Format-Slug([string]$s) {
    $s = $s.ToLowerInvariant()
    $s = $s -replace '[^a-z0-9]+', '-'
    $s = $s -replace '^-|-$', ''
    if ($s.Length -gt 40) { $s = $s.Substring(0, 40).TrimEnd('-') }
    return $s
}

function Escape-TypstString([string]$s) {
    if ($null -eq $s) { return '' }
    return $s.Replace('\', '\\').Replace('"', '\"')
}

# Global registry of every entry we labelled, for back-matter page refs.
$allEntries = New-Object System.Collections.Generic.List[object]

function Process-RegionalFile {
    param([string]$path, [string]$region, [string]$regionSlug)

    $lines = Get-Content -Path $path -Encoding UTF8
    $out   = New-Object System.Collections.Generic.List[string]
    $pendingSources = $null   # emit after the current entry's last bullet

    for ($i = 0; $i -lt $lines.Count; $i++) {
        $line = $lines[$i]

        $m = [regex]::Match($line, '^#{2,3}\s+(\d+)\.\s+(.+?)\s*$')
        if ($m.Success) {
            # Flush any lingering sources from previous entry.
            if ($pendingSources) {
                $out.Add('')
                $out.Add($pendingSources)
                $pendingSources = $null
            }

            $num   = [int]$m.Groups[1].Value
            $title = $m.Groups[2].Value.Trim()

            $latin = $null
            $lm = [regex]::Match($title, '\(\*?([^()*]+?)\*?\)\s*$')
            if ($lm.Success) {
                $latin = $lm.Groups[1].Value.Trim()
                $commonName = $title.Substring(0, $lm.Index).Trim()
            } else {
                $commonName = $title
            }

            # Build stable label id for cross-refs.
            $labelId = "herb-$regionSlug-$num-" + (Format-Slug $commonName)

            # Register for back-matter.
            $allEntries.Add([PSCustomObject]@{
                LabelId    = $labelId
                Number     = $num
                Title      = $title
                CommonName = $commonName
                Latin      = $latin
                Region     = $region
                Safety     = $(if ($latin -or $commonName) { Lookup-For -store $safetyRaw -name $commonName -latin $latin } else { $null })
            })

            # Emit heading with original "N. Title" and pandoc header-attribute
            # ID (pandoc's typst writer converts this to a `<label>` attached
            # to the heading).
            $out.Add("## $num. $title {#$labelId}")

            # Inject safety badge directly below heading (if curated).
            $safety = Lookup-For -store $safetyRaw -name $commonName -latin $latin
            if ($safety) {
                $preg = $safety.pregnancy
                $lact = $safety.lactation
                $nInt = if ($safety.drugInteractions) { $safety.drugInteractions.Count } else { 0 }
                $out.Add('')
                $out.Add("``````{=typst}")
                $out.Add("#safety-line(preg: `"$(Escape-TypstString $preg)`", lact: `"$(Escape-TypstString $lact)`", n: $nInt)")
                $out.Add("``````")
            }

            # Stage sources line (emitted just before the next heading).
            $refs = Lookup-For -store $refsRaw -name $commonName -latin $latin
            if ($refs) {
                $parts = @()
                foreach ($r in $refs) {
                    $label = "$($r.source) — $($r.title)"
                    $parts += "[$label]($($r.url))"
                }
                $pendingSources = "*Modern sources: " + ($parts -join ' · ') + "*"
            } else {
                $pendingSources = $null
            }
            continue
        }

        $out.Add($line)
    }

    # Flush for last entry in file.
    if ($pendingSources) {
        $out.Add('')
        $out.Add($pendingSources)
    }

    return ,$out.ToArray()
}

# ── Extended JSON → markdown bridge ─────────────────────────────────────────
# The site's /encyclopedia pulls 584 entries (250 markdown + ~334 unique from
# site/data/extended/*.json). To keep the PDF in sync we synthesise markdown
# blocks from each JSON entry and append them to the regional source file.
function ConvertTo-EntryMarkdown {
    param([PSCustomObject]$e, [int]$num)
    $title = $e.name
    if ($e.latin) { $title = "$($e.name) (*$($e.latin)*)" }
    $lines = New-Object System.Collections.Generic.List[string]
    $lines.Add('')
    $lines.Add("## $num. $title")
    if ($e.benefit)  { $lines.Add("- **Benefit:** $($e.benefit)") }
    if ($e.recipe)   { $lines.Add("- **Recipe:** $($e.recipe)") }
    if ($e.sourcing) { $lines.Add("- **Sourcing:** $($e.sourcing)") }
    if ($e.attribution) { $lines.Add("- **Note:** $($e.attribution)") }
    return ,$lines.ToArray()
}

# ── Preprocess regional files into a temp dir ───────────────────────────────
$tempDir = Join-Path $root '_pdf_temp'
if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null

Write-Host "Preprocessing regional markdown (injecting safety + sources)..."
$extendedDir = Join-Path $siteData 'extended'
foreach ($rf in $regionalFiles) {
    $src = Join-Path $root $rf.File
    if (-not (Test-Path $src)) { Write-Warning "missing: $src"; continue }

    # Build an augmented source path: original markdown + (optional) JSON-derived entries.
    $augmentedPath = $src
    if ($includeExtended -and $rf.Extended) {
        $jsonPath = Join-Path $extendedDir $rf.Extended
        if (Test-Path $jsonPath) {
            $entries = Get-Content -Path $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
            # Numbering starts after the highest ## N. in the source markdown.
            $srcText = Get-Content -Path $src -Raw -Encoding UTF8
            $nums = [regex]::Matches($srcText, '(?m)^#{2,3}\s+(\d+)\.') | ForEach-Object { [int]$_.Groups[1].Value }
            $startNum = if ($nums.Count -gt 0) { ($nums | Measure-Object -Maximum).Maximum + 1 } else { 1 }

            # De-dupe against existing markdown entry names (case-insensitive).
            $existing = @{}
            foreach ($mm in [regex]::Matches($srcText, '(?m)^#{2,3}\s+\d+\.\s+(.+?)\s*$')) {
                $t = $mm.Groups[1].Value.Trim()
                $cn = $t
                $lmX = [regex]::Match($t, '\(\*?([^()*]+?)\*?\)\s*$')
                if ($lmX.Success) { $cn = $t.Substring(0, $lmX.Index).Trim() }
                $existing[$cn.ToLowerInvariant()] = $true
            }

            $appended = New-Object System.Collections.Generic.List[string]
            $appended.Add('')
            $appended.Add('')
            $appended.Add("# Extended Reference — $($rf.Region)")
            $appended.Add('')
            $appended.Add('*The following entries are sourced from the structured JSON dataset that backs the Remedia site encyclopedia. They share the same safety + reference lookups as the curated markdown above.*')
            $n = $startNum
            $added = 0
            foreach ($entry in $entries) {
                if (-not $entry.name) { continue }
                if ($existing.ContainsKey($entry.name.ToLowerInvariant())) { continue }
                foreach ($line in (ConvertTo-EntryMarkdown -e $entry -num $n)) { $appended.Add($line) }
                $n++
                $added++
            }
            if ($added -gt 0) {
                $augmentedPath = Join-Path $tempDir ("_src_" + $rf.File)
                $combined = $srcText.TrimEnd() + "`n`n" + ($appended -join "`n") + "`n"
                [System.IO.File]::WriteAllText($augmentedPath, $combined, [System.Text.UTF8Encoding]::new($false))
                Write-Host ("  [{0}] +{1} entries from {2}" -f $rf.Region, $added, $rf.Extended)
            }
        }
    }

    $processed = Process-RegionalFile -path $augmentedPath -region $rf.Region -regionSlug $rf.RegionSlug
    $dst = Join-Path $tempDir $rf.File
    [System.IO.File]::WriteAllLines($dst, $processed, [System.Text.UTF8Encoding]::new($false))
}

Write-Host ("  {0} entries labelled" -f $allEntries.Count)
$entriesWithSafety = @($allEntries | Where-Object { $_.Safety })
Write-Host ("  {0} entries have structured safety" -f $entriesWithSafety.Count)

# ── File list (temp for regionals, originals for the rest) ──────────────────
# Regional builds include only the region's markdown + shared back-matter.
# Region-specific appendices (07 Ayurveda deep dive, 08 Kampo, A1/A2) are
# only bundled when they match the target region, or always for the master.
$files = New-Object System.Collections.Generic.List[string]
[void]$files.Add((Join-Path $root '00_README.md'))
foreach ($rf in $regionalFiles) {
    [void]$files.Add((Join-Path $tempDir $rf.File))
}
[void]$files.Add((Join-Path $root '06_Symptom_Index.md'))
if (-not $TargetRegion -or $TargetRegion -eq 'India') {
    [void]$files.Add((Join-Path $root '07_Ayurvedic_DeepDive_150_More.md'))
    [void]$files.Add((Join-Path $root 'A1_Triphala_Home_Recipe.md'))
    [void]$files.Add((Join-Path $root 'A2_Ashwagandha_Safety.md'))
}
if (-not $TargetRegion -or $TargetRegion -eq 'Japan') {
    [void]$files.Add((Join-Path $root '08_Kampo_Full_Formulary.md'))
}
$files = $files.ToArray()

# ── Generate chapter-intros helper (read by template) ───────────────────────
$intros = New-Object System.Text.StringBuilder
[void]$intros.AppendLine('// Auto-generated: chapter-intro map keyed by H1 text.')
[void]$intros.AppendLine('#let chapter-intros = (')
foreach ($k in $chapterIntros.Keys) {
    $meta = $chapterIntros[$k]
    $key = Escape-TypstString $k
    $epi = Escape-TypstString $meta.epigraph
    $bod = Escape-TypstString $meta.body
    [void]$intros.AppendLine("  `"$key`": (epigraph: `"$epi`", body: `"$bod`"),")
}
[void]$intros.AppendLine(')')
[System.IO.File]::WriteAllText((Join-Path $root '_chapter_intros.typ'), $intros.ToString(), [System.Text.UTF8Encoding]::new($false))

# ── Self-contained prelude injected into each back-matter file ─────────────
# Typst's `#include` evaluates the file in an isolated scope, so we can't rely
# on `page-ref` from the main template being visible. Each generated file gets
# its own copy of the helper.
$backMatterPrelude = @'
#let page-ref(label) = context {
  let hits = query(label)
  if hits.len() > 0 {
    let p = hits.first().location().page()
    text(size: 9pt, fill: rgb("#555"))[p.#p]
  } else {
    text(size: 9pt, fill: rgb("#bbb"))[--]
  }
}

'@

# ── Generate pregnancy contraindication quick-ref ───────────────────────────
$pregAvoid = @($allEntries | Where-Object { $_.Safety -and $_.Safety.pregnancy -eq 'avoid' } |
    Sort-Object { $_.CommonName })
$pregCaution = @($allEntries | Where-Object { $_.Safety -and $_.Safety.pregnancy -eq 'caution' } |
    Sort-Object { $_.CommonName })

$sbP = New-Object System.Text.StringBuilder
[void]$sbP.Append($backMatterPrelude)
[void]$sbP.AppendLine('// Auto-generated pregnancy quick reference.')
[void]$sbP.AppendLine('#pagebreak()')
[void]$sbP.AppendLine('= Pregnancy quick reference')
[void]$sbP.AppendLine('')
[void]$sbP.AppendLine('#text(size: 9.5pt, fill: rgb("#666"))[One-page summary of every remedy in this compendium with a structured safety flag for pregnancy. Always consult a qualified practitioner — this is a starting point, not a complete list.]')
[void]$sbP.AppendLine('')
[void]$sbP.AppendLine('#v(0.8em)')
[void]$sbP.AppendLine('== #text(fill: rgb("#b91c1c"))[Avoid in pregnancy]')
[void]$sbP.AppendLine('')
if ($pregAvoid.Count -gt 0) {
    [void]$sbP.AppendLine('#grid(columns: (1fr, auto), column-gutter: 1em, row-gutter: 0.35em,')
    foreach ($e in $pregAvoid) {
        $label = Escape-TypstString ($e.CommonName + $(if ($e.Latin) { " — _$($e.Latin)_" } else { '' }))
        [void]$sbP.AppendLine("  [$label], page-ref(<$($e.LabelId)>),")
    }
    [void]$sbP.AppendLine(')')
} else {
    [void]$sbP.AppendLine('_No entries flagged._')
}
[void]$sbP.AppendLine('')
[void]$sbP.AppendLine('#v(0.6em)')
[void]$sbP.AppendLine('== #text(fill: rgb("#d97706"))[Use only with caution]')
[void]$sbP.AppendLine('')
if ($pregCaution.Count -gt 0) {
    [void]$sbP.AppendLine('#grid(columns: (1fr, auto), column-gutter: 1em, row-gutter: 0.35em,')
    foreach ($e in $pregCaution) {
        $label = Escape-TypstString ($e.CommonName + $(if ($e.Latin) { " — _$($e.Latin)_" } else { '' }))
        [void]$sbP.AppendLine("  [$label], page-ref(<$($e.LabelId)>),")
    }
    [void]$sbP.AppendLine(')')
} else {
    [void]$sbP.AppendLine('_No entries flagged._')
}
[System.IO.File]::WriteAllText((Join-Path $root '_pregnancy_ref.typ'), $sbP.ToString(), [System.Text.UTF8Encoding]::new($false))

# ── Generate Latin binomial index with page refs ────────────────────────────
$latinEntries = @($allEntries | Where-Object { $_.Latin -and $_.Latin.Length -ge 3 })
# De-dupe by lowercased Latin, keep first.
$seen = @{}
$deduped = New-Object System.Collections.Generic.List[object]
foreach ($e in ($latinEntries | Sort-Object { $_.Latin.ToLowerInvariant() })) {
    $k = $e.Latin.ToLowerInvariant()
    if ($seen.ContainsKey($k)) { continue }
    $seen[$k] = $true
    $deduped.Add($e)
}

$grouped = $deduped | Group-Object { $_.Latin.Substring(0,1).ToUpperInvariant() } | Sort-Object Name

$sbL = New-Object System.Text.StringBuilder
[void]$sbL.Append($backMatterPrelude)
[void]$sbL.AppendLine('// Auto-generated Latin binomial index.')
[void]$sbL.AppendLine('#pagebreak()')
[void]$sbL.AppendLine('= Latin binomial index')
[void]$sbL.AppendLine('')
[void]$sbL.AppendLine('#text(size: 9.5pt, fill: rgb("#666"))[Every remedy cross-referenced to its correct botanical binomial. Always confirm identification by Latin name — common names collide. Page numbers resolve to the canonical entry.]')
[void]$sbL.AppendLine('')
[void]$sbL.AppendLine('#v(0.8em)')
foreach ($g in $grouped) {
    [void]$sbL.AppendLine(('#text(size: 13pt, weight: "bold", fill: rgb("#376d35"))[{0}]' -f $g.Name))
    [void]$sbL.AppendLine('#v(0.2em)')
    [void]$sbL.AppendLine('#line(length: 30%, stroke: 0.4pt + rgb("#c9e1c8"))')
    [void]$sbL.AppendLine('#v(0.3em)')
    [void]$sbL.AppendLine('#grid(columns: (1fr, auto), column-gutter: 1em, row-gutter: 0.35em,')
    foreach ($e in ($g.Group | Sort-Object { $_.Latin.ToLowerInvariant() })) {
        $latin  = Escape-TypstString $e.Latin
        $common = Escape-TypstString $e.CommonName
        $region = Escape-TypstString $e.Region
        [void]$sbL.AppendLine("  [#emph[$latin] — $common #text(size: 8pt, fill: rgb(`"#888`"))[· $region]], page-ref(<$($e.LabelId)>),")
    }
    [void]$sbL.AppendLine(')')
    [void]$sbL.AppendLine('#v(0.6em)')
    [void]$sbL.AppendLine('')
}
[System.IO.File]::WriteAllText((Join-Path $root '_latin_index.typ'), $sbL.ToString(), [System.Text.UTF8Encoding]::new($false))

# ── Generate symptom cross-reference ────────────────────────────────────────
# Concerns are inferred from each entry's title + (we don't have benefit here
# without extra parsing). Fall back: keyword match over the full raw entry
# markdown. Simpler: re-read each regional markdown and tag.

$symptomKeywords = @{
  'Sleep & Anxiety'     = @('sleep','insomnia','anxiety','stress','calm','sedative')
  'Cough & Respiratory' = @('cough','bronch','respirat','asthma','lung','throat','sinus',' cold',' flu')
  'Digestion'           = @('digest','bloat',' gas','appetite','nausea','ibs','diarr','constip','reflux','ulcer')
  'Joints & Pain'       = @('joint','arthrit','pain','back','muscle','rheum')
  'Immunity & Fatigue'  = @('immun','fatigue','energy','adaptogen','rasayana','adrenal')
  "Women's Health"      = @('menstrual','menopause','pms','uterine','lactation','fertil','pregnan')
  "Men's Vitality"      = @('libido','male','prostate','testoster','sperm')
  'Skin'                = @('skin','eczema','acne','psoria','wound',' burn')
  'Heart & BP'          = @('heart','blood pressure','cardiac','cholesterol')
  'Liver & Detox'       = @('liver','detox','hepatit','jaundice')
  'Blood Sugar'         = @('sugar','diabet','glycem')
}

# Build a lookup: entry label -> entry text blob (name + body bullets).
$entryBlobs = @{}
foreach ($rf in $regionalFiles) {
    $path = Join-Path $root $rf.File
    if (-not (Test-Path $path)) { continue }
    $raw = Get-Content -Path $path -Encoding UTF8 -Raw
    # Split on H2
    $chunks = [regex]::Split($raw, '(?=^##\s+\d+\.)', 'Multiline')
    foreach ($c in $chunks) {
        $hm = [regex]::Match($c, '^##\s+(\d+)\.\s+(.+?)$', 'Multiline')
        if (-not $hm.Success) { continue }
        $num = [int]$hm.Groups[1].Value
        $title = $hm.Groups[2].Value.Trim()
        $commonName = $title
        $lm2 = [regex]::Match($title, '\(\*?([^()*]+?)\*?\)\s*$')
        if ($lm2.Success) { $commonName = $title.Substring(0, $lm2.Index).Trim() }
        $labelId = "herb-$($rf.RegionSlug)-$num-" + (Format-Slug $commonName)
        $entryBlobs[$labelId] = $c.ToLowerInvariant()
    }
}

$byConcern = @{}
foreach ($concern in $symptomKeywords.Keys) {
    $byConcern[$concern] = New-Object System.Collections.Generic.List[object]
    $needles = $symptomKeywords[$concern]
    foreach ($e in $allEntries) {
        $blob = $entryBlobs[$e.LabelId]
        if (-not $blob) { continue }
        foreach ($n in $needles) {
            if ($blob.Contains($n)) {
                $byConcern[$concern].Add($e); break
            }
        }
    }
}

$sbS = New-Object System.Text.StringBuilder
[void]$sbS.Append($backMatterPrelude)
[void]$sbS.AppendLine('// Auto-generated symptom cross-reference.')
[void]$sbS.AppendLine('#pagebreak()')
[void]$sbS.AppendLine('= Symptom cross-reference')
[void]$sbS.AppendLine('')
[void]$sbS.AppendLine('#text(size: 9.5pt, fill: rgb("#666"))[Every remedy grouped by the concern it traditionally addresses, with page number. Region codes: IN = India, PE = Peru/Andes, CN = China, JP = Japan, GL = Global.]')
[void]$sbS.AppendLine('')
[void]$sbS.AppendLine('#v(0.6em)')

$regionAbbrev = @{
  'India'              = 'IN'
  'Peru/Andes/Spanish' = 'PE'
  'China'              = 'CN'
  'Japan'              = 'JP'
  'Global'             = 'GL'
}

foreach ($concern in ($symptomKeywords.Keys | Sort-Object)) {
    $list = $byConcern[$concern]
    if ($list.Count -eq 0) { continue }
    $label = Escape-TypstString $concern
    [void]$sbS.AppendLine("== $label")
    [void]$sbS.AppendLine('')
    [void]$sbS.AppendLine('#grid(columns: (1fr, auto, auto), column-gutter: 1em, row-gutter: 0.3em,')
    # Sort by region then name
    $sorted = $list | Sort-Object @{Expression={$_.Region}}, @{Expression={$_.CommonName}}
    foreach ($e in $sorted) {
        $nm  = Escape-TypstString $e.CommonName
        $abbrev = $regionAbbrev[$e.Region]
        [void]$sbS.AppendLine("  [$nm], text(size: 8pt, fill: rgb(`"#888`"))[$abbrev], page-ref(<$($e.LabelId)>),")
    }
    [void]$sbS.AppendLine(')')
    [void]$sbS.AppendLine('#v(0.6em)')
    [void]$sbS.AppendLine('')
}
[System.IO.File]::WriteAllText((Join-Path $root '_symptom_ref.typ'), $sbS.ToString(), [System.Text.UTF8Encoding]::new($false))

# ── Generate colophon ───────────────────────────────────────────────────────
$builtOn = (Get-Date -Format 'yyyy-MM-dd HH:mm')
$entryCount = $allEntries.Count
$safetyCount = $entriesWithSafety.Count

$sbC = New-Object System.Text.StringBuilder
[void]$sbC.AppendLine('// Auto-generated colophon.')
[void]$sbC.AppendLine('#pagebreak()')
[void]$sbC.AppendLine('= Colophon')
[void]$sbC.AppendLine('')
[void]$sbC.AppendLine('#v(0.5em)')
[void]$sbC.AppendLine('#grid(columns: (auto, 1fr), column-gutter: 1.5em, row-gutter: 0.5em,')
[void]$sbC.AppendLine('  [*Edition*],           [Living document — rebuilt on every commit.],')
[void]$sbC.AppendLine("  [*Built*],             [$builtOn],")
[void]$sbC.AppendLine("  [*Entries*],           [$entryCount remedies across five traditions],")
[void]$sbC.AppendLine("  [*Structured safety*], [$safetyCount entries with pregnancy, lactation, and drug-interaction flags],")
[void]$sbC.AppendLine('  [*Typography*],        [Serif: system default (Segoe UI / Arial). Monospace: Consolas.],')
[void]$sbC.AppendLine('  [*Taxonomy*],          [Latin binomials verified against Kew POWO (_powo.science.kew.org_).],')
[void]$sbC.AppendLine('  [*Safety sources*],    [WHO monographs, NCCIH, NIH LactMed, Cochrane systematic reviews, PubMed.],')
[void]$sbC.AppendLine('  [*Build tools*],       [Pandoc → Typst. Layout template: `_pdf_template.typ`.],')
[void]$sbC.AppendLine('  [*License*],           [Educational use. Content reflects traditional practice; not medical advice.],')
[void]$sbC.AppendLine(')')
[void]$sbC.AppendLine('')
[void]$sbC.AppendLine('#v(1em)')
[void]$sbC.AppendLine('#text(size: 9pt, fill: rgb("#666"), style: "italic")[Corrections, missing references, and new entries are welcome. This book is a work in progress by design — traditional medicine is a living archive, not a fixed canon.]')
[System.IO.File]::WriteAllText((Join-Path $root '_colophon.typ'), $sbC.ToString(), [System.Text.UTF8Encoding]::new($false))

# ── Pandoc: merge to typst ──────────────────────────────────────────────────
Write-Host "Pandoc: merging markdown and generating typst via template..."
$typstOut = Join-Path $root '_combined.typ'
& pandoc @files `
    --from=gfm+attributes+raw_attribute `
    --to=typst `
    --template="$template" `
    --output="$typstOut"

if (-not (Test-Path $typstOut)) { throw "Typst source not produced" }

# ── Typst: compile ──────────────────────────────────────────────────────────
Write-Host "Typst: compiling PDF..."
& $typst compile $typstOut $out

if (Test-Path $out) {
    Write-Host "PDF created: $out"
    Write-Host ("Size: {0:N0} KB" -f ((Get-Item $out).Length/1KB))
} else {
    throw "PDF not produced"
}

# Cleanup temp (keep generated typst files for debugging)
# Remove-Item $tempDir -Recurse -Force -ErrorAction SilentlyContinue
