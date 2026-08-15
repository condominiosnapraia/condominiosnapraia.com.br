#!/usr/bin/env python3
"""Normalize generated condominium pages without touching database data or photos."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]

# The generated pages use this stable structure. The script only changes pages
# that contain both the editorial block and the amenity list; all other files
# are left untouched.
INFRA_BLOCK = re.compile(
    r'(?P<head><h2[^>]*>Infraestrutura</h2>)\s*'
    r'(?P<text><p[^>]*>.*?</p>)\s*'
    r'(?P<tags><div\s+style="display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 18px">.*?</div>)',
    re.S,
)
LOCATION_HEAD = re.compile(r'(<h2)(\s+style="[^"]*")>(Localização)</h2>')
LOCATION_TEXT = re.compile(
    r'(<h2\s+class="cond-location-copy"[^>]*>Localização</h2>\s*<p)'
    r'(\s+style=")'
)
AMLIST = re.compile(r'(<div\s+class="amlist">.*?</div>)', re.S)
MAP_KICKER = re.compile(r'\s*<div\s+class="cond-mapa-kicker">Localização</div>')
INLINE_INFRA = re.compile(r'<div\s+class="cond-infra-detalhada-inline">.*?</div>\s*', re.S)


def normalize(path: Path) -> bool:
    text = path.read_text(encoding="utf-8")
    if 'class="cond-conteudo-full"' not in text or 'class="amlist"' not in text:
        return False

    original = text
    text = INLINE_INFRA.sub('', text)
    text = MAP_KICKER.sub('', text)

    match = INFRA_BLOCK.search(text)
    if match:
        infra_text = match.group('text')
        text = text[:match.start()] + text[match.end():]
        am = AMLIST.search(text)
        if am:
            inline = (
                '\n<div class="cond-infra-detalhada-inline">\n'
                f'{infra_text}\n'
                '</div>'
            )
            text = text[:am.end()] + inline + text[am.end():]

    text = LOCATION_HEAD.sub(r'\1 class="cond-location-copy"\2>\3</h2>', text)
    text = LOCATION_TEXT.sub(r'\1 class="cond-location-copy-text"\2', text)

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


changed = 0
for page in sorted(ROOT.glob('*/index.html')):
    if normalize(page):
        changed += 1
print(f'Páginas estáticas normalizadas: {changed}')
