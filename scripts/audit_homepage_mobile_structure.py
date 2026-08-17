import json
import re
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE = 'https://condominiosnapraia.com.br'
URL = BASE + '/?qa=mobile-full-audit'
html = requests.get(URL, headers={'User-Agent': 'PortalMeuLitoralMobileAudit/1.0'}, timeout=45).text
soup = BeautifulSoup(html, 'html.parser')
css = '\n'.join(style.get_text(' ', strip=False) for style in soup.find_all('style'))
sections = []
for section in soup.select('section[id]'):
    sid = section.get('id')
    classes = section.get('class', [])
    cards = len(section.select('.icard, .lch-card, .guia-card, .pcred-card, .qfilter-card, .cond-card, .viv-editorial-card, .bpcard, .c-card'))
    links = len(section.select('a[href]'))
    images = len(section.select('img'))
    sections.append({'id': sid, 'classes': classes, 'cards': cards, 'links': links, 'images': images, 'text': ' '.join(section.get_text(' ', strip=True).split())[:140]})

mobile_blocks = []
for match in re.finditer(r'@media\s*\((?:max-width|min-width)\s*:\s*(?:600|768)px\)\s*\{', css, re.I):
    start = max(0, match.start() - 80)
    end = min(len(css), match.end() + 260)
    mobile_blocks.append(re.sub(r'\s+', ' ', css[start:end]))

empty_links = [{'href': a.get('href'), 'text': ' '.join(a.get_text(' ', strip=True).split())[:80]} for a in soup.select('a[href="#"]')]
empty_images = [{'alt': img.get('alt', ''), 'id': img.get('id', ''), 'class': img.get('class', [])} for img in soup.select('img') if not (img.get('src') or img.get('data-src'))]

overflow_candidates = []
for el in soup.select('[style]'):
    style = el.get('style', '')
    if re.search(r'(width|min-width)\s*:\s*(?:[7-9]\d\d|1\d{3,})px', style):
        overflow_candidates.append({'tag': el.name, 'id': el.get('id', ''), 'class': el.get('class', []), 'style': style})

print(json.dumps({
    'url': URL,
    'section_count': len(sections),
    'sections': sections,
    'mobile_rule_count': len(mobile_blocks),
    'mobile_rule_samples': mobile_blocks[:18],
    'empty_visible_links': empty_links,
    'empty_image_elements': empty_images,
    'inline_width_candidates': overflow_candidates,
}, ensure_ascii=False, indent=2))
