# LEGACY Edge-headless PDF build. Retained as a fallback for environments
# without Typst installed. The canonical build is `_build_pdf_typst.ps1`
# which produces proper typography, a disclaimer page, and a Latin index.
$ErrorActionPreference = 'Stop'
Write-Warning "This is the legacy Edge-based PDF builder. Prefer _build_pdf_typst.ps1 for the canonical compendium PDF."
$root = $PSScriptRoot
$out  = Join-Path $root 'Traditional_Herbal_Remedies_Compendium.pdf'
$html = Join-Path $root '_combined.html'

$files = @(
  '00_README.md',
  '01_Indian_Ayurvedic.md',
  '02_Peruvian_Andean_Spanish.md',
  '03_Chinese_TCM.md',
  '04_Japanese_Kampo.md',
  '05_Other_Global.md',
  '06_Symptom_Index.md',
  '07_Ayurvedic_DeepDive_150_More.md',
  '08_Kampo_Full_Formulary.md',
  'A1_Triphala_Home_Recipe.md',
  'A2_Ashwagandha_Safety.md'
) | ForEach-Object { Join-Path $root $_ }

# Cover + TOC prefix as temporary file
$cover = @"
---
title: "Traditional and Herbal Remedies - A 250+ Entry Reference"
subtitle: "India, Peru and Andes, China, Japan, and Global"
date: "$(Get-Date -Format 'yyyy-MM-dd')"
toc: true
toc-depth: 2
---

"@
$tmpCover = Join-Path $root '_cover.md'
$cover | Set-Content -Path $tmpCover -Encoding UTF8

$css = @'
<style>
@page { size: A4; margin: 20mm 18mm; }
body { font-family: "Segoe UI", "Noto Sans", Arial, sans-serif; font-size: 11pt; line-height: 1.45; color:#222; max-width: none; }
h1 { page-break-before: always; border-bottom: 2px solid #444; padding-bottom: 4px; color:#2c3e50; }
h1:first-of-type { page-break-before: avoid; }
h2 { color:#34495e; margin-top: 1.2em; border-bottom: 1px solid #ddd; padding-bottom: 2px;}
h3 { color:#2c3e50; margin-top: 1em; }
code, pre { background:#f4f4f4; padding: 1px 4px; border-radius: 3px; font-size: 10pt;}
pre { padding: 8px; overflow-x:auto; }
table { border-collapse: collapse; width:100%; margin: 10px 0; }
th, td { border:1px solid #ccc; padding:4px 8px; text-align:left; font-size:10pt;}
th { background:#eee; }
blockquote { border-left:4px solid #bbb; background:#fafafa; margin:8px 0; padding:6px 12px; color:#555;}
ul,ol { margin: 4px 0 4px 18px; }
li { margin: 2px 0; }
hr { border:none; border-top:1px dashed #aaa; margin: 16px 0; }
.toc ul { list-style:none; padding-left: 14px; }
.toc a { text-decoration:none; color:#2c3e50; }
a { color:#1a5fa0; }
</style>
'@
$tmpCss = Join-Path $root '_style.html'
$css | Set-Content -Path $tmpCss -Encoding UTF8

Write-Host "Running pandoc to create HTML..."
$inputs = @($tmpCover) + $files
& pandoc @inputs `
    --from=gfm+yaml_metadata_block `
    --to=html5 `
    --standalone `
    --toc --toc-depth=2 `
    --metadata title="Traditional and Herbal Remedies - A 250+ Entry Reference" `
    --include-in-header="$tmpCss" `
    --output="$html"

if (-not (Test-Path $html)) { throw "HTML not produced" }

# Find Edge
$edge = $null
foreach ($p in @(
    "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe",
    "${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe",
    "$env:LOCALAPPDATA\Microsoft\Edge\Application\msedge.exe"
)) {
    if (Test-Path $p) { $edge = $p; break }
}
if (-not $edge) { throw "Microsoft Edge not found; cannot produce PDF." }

Write-Host "Running Edge headless to print PDF..."
$uri = ([Uri](Resolve-Path $html).Path).AbsoluteUri
& $edge --headless=new --disable-gpu --no-pdf-header-footer `
       "--print-to-pdf=$out" `
       "--print-to-pdf-no-header" `
       $uri | Out-Null

Start-Sleep -Seconds 2
if (Test-Path $out) {
    Write-Host "PDF created: $out"
    Write-Host ("Size: {0:N0} KB" -f ((Get-Item $out).Length/1KB))
} else {
    throw "PDF not produced"
}

# Cleanup intermediates (keep html for debugging)
Remove-Item $tmpCover,$tmpCss -ErrorAction SilentlyContinue
