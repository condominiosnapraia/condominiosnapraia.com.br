from pathlib import Path
from bs4 import BeautifulSoup
import re

root = Path('/home/ubuntu/wt_supabase_queries')
rows = []
for path in sorted(root.glob('imovel-*/index.html')):
    text = path.read_text(encoding='utf-8', errors='ignore')
    soup = BeautifulSoup(text, 'html.parser')
    plain = ' '.join(soup.get_text(' ', strip=True).split())
    values = []
    for match in re.findall(r'R\$\s*([\d.]+)(?:,\d+)?', plain):
        digits = match.replace('.', '')
        if digits:
            values.append(int(digits))
    if not values or max(values) < 5_000_000:
        continue
    title = (soup.title.get_text(' ', strip=True) if soup.title else path.parent.name)
    h1 = soup.find('h1')
    h1_text = ' '.join(h1.get_text(' ', strip=True).split()) if h1 else ''
    code_match = re.search(r'\b(?:CAP|XAN|OSO|MAQ)-?\d{3}\b', plain, re.I)
    area_match = re.search(r'([\d\.]+,\d+)\s*m²', plain, re.I)
    kind = ''
    for candidate in ('Casa', 'Sobrado', 'Apartamento', 'Terreno', 'Cobertura', 'Mansão', 'Mansao'):
        if re.search(r'\b'+candidate+r'\b', h1_text + ' ' + title, re.I):
            kind = candidate
            break
    rows.append((max(values), path.parent.name, code_match.group(0).upper() if code_match else '', kind, area_match.group(1)+' m²' if area_match else '', h1_text or title))
for price, slug, code, kind, area, title in sorted(rows, reverse=True):
    print(f'{price}\t{code}\t{kind}\t{area}\t{slug}\t{title}')
print(f'COUNT={len(rows)}')
