from pathlib import Path
import re
from html import unescape

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = 'https://condominiosnapraia.com.br'


def replace_or_insert(html, pattern, replacement, anchor_pattern=None):
    updated, count = re.subn(pattern, replacement, html, count=1, flags=re.I)
    if count:
        return updated
    if anchor_pattern:
        match = re.search(anchor_pattern, html, flags=re.I)
        if match:
            return html[:match.end()] + '\n' + replacement + html[match.end():]
    return html


def meta_line(html, kind, key, value):
    attr = 'property' if kind == 'property' else 'name'
    pattern = rf'<meta\b(?=[^>]*\b{attr}=["\']{re.escape(key)}["\'])[^>]*>'
    replacement = f'<meta {attr}="{key}" content="{value}">'
    if key == 'og:image':
        return replace_or_insert(html, pattern, replacement, r'<meta\b[^>]*property=["\']og:url["\'][^>]*>')
    if key == 'og:image:alt' or key == 'og:image:type':
        return replace_or_insert(html, pattern, replacement, r'<meta\b[^>]*property=["\']og:image["\'][^>]*>')
    if key.startswith('twitter:'):
        anchor = r'<meta\b[^>]*name=["\']twitter:card["\'][^>]*>' if key != 'twitter:card' else r'<meta\b[^>]*property=["\']og:description["\'][^>]*>'
        updated = replace_or_insert(html, pattern, replacement, anchor)
        if updated == html:
            updated = replace_or_insert(html, pattern, replacement, r'</head>')
        return updated
    return replace_or_insert(html, pattern, replacement, r'<meta\b[^>]*property=["\']og:description["\'][^>]*>')


def process(page):
    html = page.read_text(encoding='utf-8')
    hero_match = re.search(r'<div\s+class=["\']hero-wrap["\'][\s\S]*?<img\b[^>]*\bsrc=["\']([^"\']+)["\']', html, flags=re.I)
    if not hero_match:
        return False
    src = unescape(hero_match.group(1).strip())
    if not src or src.startswith('data:'):
        return False
    image_url = src if src.startswith('http') else ORIGIN.rstrip('/') + '/' + src.lstrip('/')
    title_match = re.search(r'<meta\b[^>]*property=["\']og:title["\'][^>]*content=["\']([^"\']*)["\']', html, flags=re.I)
    title = unescape(title_match.group(1)) if title_match else (page.parent.name.replace('-', ' ').title())
    html = meta_line(html, 'property', 'og:image', image_url)
    html = meta_line(html, 'property', 'og:image:alt', f'Foto de capa — {title}')
    html = meta_line(html, 'property', 'og:image:type', 'image/jpeg')
    html = meta_line(html, 'name', 'twitter:card', 'summary_large_image')
    html = meta_line(html, 'name', 'twitter:title', title)
    og_desc_match = re.search(r'<meta\b[^>]*property=["\']og:description["\'][^>]*content=["\']([^"\']*)["\']', html, flags=re.I)
    html = meta_line(html, 'name', 'twitter:description', unescape(og_desc_match.group(1)) if og_desc_match else '')
    html = meta_line(html, 'name', 'twitter:image', image_url)
    html = meta_line(html, 'name', 'twitter:image:alt', f'Foto de capa — {title}')
    page.write_text(html, encoding='utf-8')
    return True


def main():
    updated = 0
    skipped = 0
    for page in sorted(ROOT.glob('*/index.html')):
        if page.parent.name == 'condominio':
            continue
        if process(page):
            updated += 1
        else:
            skipped += 1
    print(f'Páginas atualizadas: {updated}')
    print(f'Páginas sem foto hero estática: {skipped}')


if __name__ == '__main__':
    main()
