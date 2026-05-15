import re, html, json
from pathlib import Path
from collections import Counter

files = [
    r'C:\Users\User\Downloads\(1) Instagram.html',
    r'C:\Users\User\Downloads\(3) Instagram.html',
    r'C:\Users\User\Downloads\(5) Instagram.html',
]
src = '\n\n=====FILE_BREAK=====\n\n'.join(Path(f).read_text(encoding='utf-8', errors='ignore') for f in files if Path(f).exists())

out = []
def w(s=''): out.append(str(s))

# Meta descriptions
descs = re.findall(r'<meta[^>]+content="([^"]+)"[^>]*(?:name|property)="(?:description|og:description|og:title|og:image:alt)"', src, re.IGNORECASE)
descs2 = re.findall(r'(?:name|property)="(?:description|og:description|og:title|og:image:alt)"[^>]+content="([^"]+)"', src, re.IGNORECASE)
all_descs = list(set([html.unescape(d) for d in descs + descs2]))

w('=== META TAGS ===')
for d in all_descs: w(d[:600]); w('---')

# alt= attributes
alts = re.findall(r'alt="([^"]{30,})"', src)
alts = list(dict.fromkeys([html.unescape(a) for a in alts]))
w(); w(f'=== ALT TEXT ({len(alts)} unique, len>=30) ===')
for a in alts: w(a[:400]); w('---')

# aria-labels
aria = re.findall(r'aria-label="([^"]{15,})"', src)
aria = list(dict.fromkeys([html.unescape(a) for a in aria]))
w(); w(f'=== ARIA LABELS ({len(aria)} unique) ===')
for a in aria[:80]: w(a[:300]); w('---')

# JSON-embedded post captions: look for "edge_media_to_caption" or "caption" or "accessibility_caption"
caption_patterns = [
    r'"accessibility_caption":"([^"]+)"',
    r'"edge_media_to_caption":\{[^}]*"text":"([^"]+)"',
    r'"caption":"([^"]+)"',
    r'"text":"([^"]{40,})"'
]
for pat in caption_patterns:
    matches = re.findall(pat, src)
    if matches:
        w(); w(f'=== PATTERN {pat[:50]} ({len(matches)} hits) ===')
        seen = set()
        for m in matches[:50]:
            decoded = m.encode().decode('unicode_escape', errors='ignore') if '\\u' in m else m
            if decoded not in seen and len(decoded) > 20:
                seen.add(decoded)
                w(decoded[:500]); w('---')

# Look for video URLs / view counts
videos = re.findall(r'\.mp4[^"\']{0,50}', src)
w(); w(f'=== VIDEO URL FRAGMENTS: {len(videos)} ===')

views = re.findall(r'(\d[\d,\.]*[KMB]?)\s*(?:views|likes|plays)', src, re.IGNORECASE)
w(f'=== VIEW/LIKE NUMBERS: {len(views)} ==='); 
for v in views[:30]: w(v)

Path(r'c:\Users\User\Remidies\_pdf_temp\ig_extract.txt').write_text('\n'.join(out), encoding='utf-8')
print(f'Wrote {len(out)} lines')
