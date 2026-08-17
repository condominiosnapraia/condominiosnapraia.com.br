from pathlib import Path
import re
import xml.etree.ElementTree as ET
from PIL import Image

root=Path('/home/ubuntu/wt_supabase_queries')
checks=[
 ('vivendas-da-marina-osorio','Vivendas da Marina','Osório','39-Vivendasdamarina.webp'),
 ('prime-beach-capao-da-canoa','Prime Beach','Capão da Canoa','50-PrimeBeach.webp'),
]
errors=[]
for slug,name,city,asset in checks:
    page=root/slug/'index.html'; img=root/'img/mapas-condominios'/asset
    text=page.read_text(encoding='utf-8') if page.exists() else ''
    if not page.exists(): errors.append(f'missing page {slug}')
    for needle in [f'<title>{name} em {city}',f'rel="canonical" href="https://condominiosnapraia.com.br/{slug}/"',f'addressLocality":"{city}"',f'data-map-pdf-source="{asset}"',f'alt="Mapa de implantação de {name} em {city}"']:
        if needle not in text: errors.append(f'{slug}: missing {needle}')
    if not img.exists(): errors.append(f'missing asset {asset}')
    else:
        im=Image.open(img)
        print(slug,'|',im.width,im.height,'|',img.stat().st_size,'bytes')
        if im.width>1600: errors.append(f'{asset}: width {im.width}')
    if text.count(f'data-map-pdf-source="{asset}"')!=1: errors.append(f'{slug}: map marker count')
sitemap=root/'sitemap.xml'
try:
    ET.parse(sitemap)
except Exception as e: errors.append(f'sitemap invalid: {e}')
sitemap_text=sitemap.read_text(encoding='utf-8')
for slug,_,_,_ in checks:
    if f'https://condominiosnapraia.com.br/{slug}/' not in sitemap_text: errors.append(f'sitemap missing {slug}')
print('errors=',len(errors))
if errors:
    print('\n'.join(errors)); raise SystemExit(1)
print('pages=2, assets=2, sitemap=valid')
