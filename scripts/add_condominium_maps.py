from __future__ import annotations

import html
import json
import re
import unicodedata
from pathlib import Path
from urllib.parse import quote, urlparse

ROOT = Path(__file__).resolve().parents[1]
DATA_PATH = Path('/tmp/condominios_map_data.json')
MAP_CSS = '/css/condominio-map.css'


def normalize(value: str) -> str:
    text = unicodedata.normalize('NFKD', value or '')
    text = ''.join(char for char in text if not unicodedata.combining(char))
    return re.sub(r'[^a-z0-9]+', '', text.casefold())


def strip_tags(value: str) -> str:
    return re.sub(r'<[^>]+>', '', value or '').strip()


def text_match(pattern: str, text: str, flags: int = re.S | re.I) -> str:
    match = re.search(pattern, text, flags)
    return strip_tags(match.group(1)) if match else ''


def canonical_slug(text: str, fallback: str) -> str:
    match = re.search(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\']([^"\']+)', text, re.I)
    if not match:
        match = re.search(r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']canonical["\']', text, re.I)
    if not match:
        return fallback
    path = urlparse(match.group(1)).path.strip('/')
    return path.split('/')[-1] if path else fallback


def load_rows() -> list[dict]:
    rows = json.loads(DATA_PATH.read_text(encoding='utf-8'))
    if not isinstance(rows, list):
        raise RuntimeError('O arquivo de dados de localização não contém uma lista.')
    return rows


def find_row(rows: list[dict], slug: str, name: str) -> dict | None:
    candidates = {normalize(slug), normalize(slug.rstrip('-')), normalize(name)}
    for row in rows:
        row_slug = normalize(str(row.get('slug') or ''))
        row_name = normalize(str(row.get('nome') or ''))
        if row_slug in candidates or row_name in candidates:
            return row
    return None


def map_block(name: str, city: str, row: dict | None) -> str:
    row = row or {}
    lat_raw = row.get('latitude')
    lng_raw = row.get('longitude')
    try:
        lat = float(lat_raw)
        lng = float(lng_raw)
        exact = -90 <= lat <= 90 and -180 <= lng <= 180
    except (TypeError, ValueError):
        exact = False
        lat = lng = None

    location_label = city or str(row.get('cidade') or '') or 'Litoral Norte gaúcho'
    bairro = str(row.get('bairro') or '').strip()
    if bairro:
        location_label = f'{bairro} · {location_label}'
    query = ', '.join(part for part in [name, bairro, city or row.get('cidade'), 'RS'] if part)
    encoded_query = quote(query)
    if exact:
        embed = f'https://maps.google.com/maps?q={lat},{lng}&z=15&output=embed'
        open_url = f'https://www.google.com/maps/search/?api=1&query={lat},{lng}'
        subtitle = location_label
        notice = ''
        accuracy = 'exact'
    else:
        embed = f'https://maps.google.com/maps?q={encoded_query}&z=13&output=embed'
        open_url = f'https://www.google.com/maps/search/?api=1&query={encoded_query}'
        subtitle = f'{location_label}. A localização exata será exibida após a confirmação no cadastro.'
        notice = '<strong>Mapa de referência:</strong> a busca mostra o condomínio por nome e cidade, sem afirmar um ponto exato.'
        accuracy = 'approximate'

    notice_html = f'    <div class="cond-mapa-notice" data-map-accuracy="{accuracy}">{notice}</div>\n' if notice else ''
    return f'''\n<section class="cond-mapa-section" data-map-accuracy="{accuracy}" aria-labelledby="cond-mapa-title">\n  <div class="cond-mapa-head">\n    <div>\n      <div class="cond-mapa-kicker">Localização</div>\n      <h2 class="cond-mapa-title" id="cond-mapa-title">Onde fica este condomínio?</h2>\n      <p class="cond-mapa-subtitle">{html.escape(subtitle)}</p>\n    </div>\n    <a class="cond-mapa-open" href="{html.escape(open_url, quote=True)}" target="_blank" rel="noopener nofollow">Abrir no Google Maps ↗</a>\n  </div>\n  <div class="cond-mapa-frame{' approximate' if not exact else ''}">\n    <iframe src="{html.escape(embed, quote=True)}" title="Mapa de localização de {html.escape(name, quote=True)}" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>\n{notice_html}  </div>\n</section>\n'''


def inject_map(text: str, name: str, city: str, row: dict | None) -> tuple[str, str]:
    if 'class="cond-mapa-section"' in text:
        cleaned = re.sub(r'(class="cond-mapa-frame"[^>]*>\s*<iframe[^>]+></iframe>)\n\s+\n\s+(</div>)', r'\1\n  \2', text, flags=re.S)
        if cleaned != text:
            return cleaned, 'already-present-cleaned'
        return text, 'already-present'
    # Páginas antigas que já têm um mapa não recebem um segundo iframe.
    if 'maps.google.com/maps' in text:
        return text, 'existing-map'

    block = map_block(name, city, row)
    location_pattern = r'(<h2[^>]*>\s*Localização\s*</h2>\s*<p[^>]*>.*?</p>)'
    text, count = re.subn(location_pattern, r'\1' + block, text, count=1, flags=re.S | re.I)
    if count:
        return text, 'inserted-after-location'

    # La Marina é uma página antiga sem a seção Localização; inserir antes do bloco SEO.
    marker = '<section data-entity-template="v1"'
    if marker in text:
        return text.replace(marker, block + marker, 1), 'inserted-before-entity-guide'
    return text, 'no-anchor'


def ensure_css(text: str) -> str:
    if MAP_CSS in text:
        return text
    marker = '  <link rel="stylesheet" href="/css/portal-footer.css">'
    if marker in text:
        return text.replace(marker, f'  <link rel="stylesheet" href="{MAP_CSS}">\n{marker}', 1)
    return text.replace('</head>', f'  <link rel="stylesheet" href="{MAP_CSS}">\n</head>', 1)


def main() -> None:
    rows = load_rows()
    pages = sorted(ROOT.glob('*/index.html'))
    entity_pages = []
    for path in pages:
        original = path.read_text(encoding='utf-8')
        if 'data-entity-template="v1"' not in original:
            continue
        entity_pages.append(path)
        name = text_match(r'<h1[^>]*>(.*?)</h1>', original) or path.parent.name
        city = text_match(r'<div[^>]*class=["\'](?:loc|eyebrow)["\'][^>]*>(.*?)</div>', original)
        slug = canonical_slug(original, path.parent.name)
        row = find_row(rows, slug, name)
        updated, status = inject_map(original, name, city, row)
        updated = ensure_css(updated)
        if updated != original:
            path.write_text(updated, encoding='utf-8')
        accuracy = 'exact' if row and row.get('latitude') is not None and row.get('longitude') is not None else 'reference'
        print(f'{path}: {status}; map={accuracy}; slug={slug}')

    print(f'entity_pages={len(entity_pages)}')


if __name__ == '__main__':
    main()
