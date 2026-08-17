import json
import re
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

BASE = 'https://condominiosnapraia.com.br'
URL = BASE + '/?qa=full-links-assets-audit'
HEADERS = {'User-Agent': 'PortalMeuLitoralHomepageAudit/1.0'}
html = requests.get(URL, headers=HEADERS, timeout=45).text
soup = BeautifulSoup(html, 'html.parser')

sections = []
for el in soup.select('section[id]'):
    sections.append({'id': el.get('id'), 'classes': el.get('class', []), 'text': ' '.join(el.get_text(' ', strip=True).split())[:180]})

links = []
for a in soup.select('a'):
    href = (a.get('href') or '').strip()
    links.append({'href': href, 'text': ' '.join(a.get_text(' ', strip=True).split())[:100]})

images = []
for img in soup.select('img'):
    src = (img.get('src') or img.get('data-src') or '').strip()
    images.append({'src': urljoin(BASE, src) if src else '', 'alt': (img.get('alt') or '').strip(), 'loading': img.get('loading', '')})

empty_links = [x for x in links if not x['href'] or x['href'] == '#' or x['href'].lower().startswith('javascript:')]
empty_images = [x for x in images if not x['src']]
missing_alt = [x for x in images if x['src'] and not x['alt']]
internal_links = sorted({urljoin(BASE, x['href']) for x in links if x['href'] and not x['href'].startswith(('#', 'mailto:', 'tel:', 'javascript:')) and urlparse(urljoin(BASE, x['href'])).netloc == urlparse(BASE).netloc})
asset_urls = sorted({x['src'] for x in images if x['src']})

def check(url):
    try:
        r = requests.get(url, headers=HEADERS, timeout=20, allow_redirects=True, stream=True)
        return {'url': url, 'status': r.status_code, 'final': r.url, 'content_type': r.headers.get('content-type', '')}
    except Exception as exc:
        return {'url': url, 'status': 0, 'final': '', 'content_type': '', 'error': str(exc)}

checks = {}
with ThreadPoolExecutor(max_workers=12) as pool:
    futures = {pool.submit(check, url): url for url in internal_links + asset_urls}
    for future in as_completed(futures):
        row = future.result()
        checks[row['url']] = row

bad_links = [checks[u] for u in internal_links if checks.get(u, {}).get('status', 0) >= 400 or checks.get(u, {}).get('status', 0) == 0]
bad_assets = [checks[u] for u in asset_urls if checks.get(u, {}).get('status', 0) >= 400 or checks.get(u, {}).get('status', 0) == 0]
redirected_internal = [checks[u] for u in internal_links if checks.get(u, {}).get('final') and checks[u]['final'].rstrip('/') != u.rstrip('/')]

result = {
    'source_url': URL,
    'section_count': len(sections),
    'sections': sections,
    'link_count': len(links),
    'internal_link_count': len(internal_links),
    'image_count': len(images),
    'asset_url_count': len(asset_urls),
    'empty_links': empty_links,
    'empty_images': empty_images,
    'images_without_alt': missing_alt,
    'bad_internal_links': bad_links,
    'bad_assets': bad_assets,
    'redirected_internal_links': redirected_internal,
}
print(json.dumps(result, ensure_ascii=False, indent=2))
