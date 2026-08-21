from __future__ import annotations

import re
from pathlib import Path
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parents[1]
SITEMAP = ROOT / 'sitemap-cartas.xml'
INDEX = ROOT / 'sitemap-index.xml'
BASE = 'https://condominiosnapraia.com.br'
DATE = '2026-08-21'
PREFIX = 'carta-contemplada-imovel-'


def slugify(code: object) -> str:
    value = str(code or 'sem-codigo').lower()
    value = re.sub(r'[^a-z0-9]+', '-', value).strip('-')
    return value or 'sem-codigo'


def main() -> None:
    folders = sorted(p.name for p in ROOT.iterdir() if p.is_dir() and p.name.startswith(PREFIX))
    if not folders:
        raise SystemExit('No credit landing folders found')
    urls = [f'{BASE}/{folder}/' for folder in folders]
    body = ["<?xml version='1.0' encoding='utf-8'?>", '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for url in urls:
        body.append(f'  <url><loc>{escape(url)}</loc><lastmod>{DATE}</lastmod><changefreq>daily</changefreq><priority>0.7</priority></url>')
    body.append('</urlset>')
    SITEMAP.write_text('\n'.join(body) + '\n', encoding='utf-8')

    index = INDEX.read_text(encoding='utf-8')
    entry = f'    <sitemap>\n      <loc>{BASE}/sitemap-cartas.xml</loc>\n    </sitemap>'
    if 'sitemap-cartas.xml' not in index:
        index = index.replace('</sitemapindex>', entry + '\n</sitemapindex>')
        INDEX.write_text(index, encoding='utf-8')
    print({'landing_urls': len(urls), 'sitemap': str(SITEMAP), 'index_updated': 'sitemap-cartas.xml' in index})


if __name__ == '__main__':
    main()
