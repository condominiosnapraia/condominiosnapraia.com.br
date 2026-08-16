from pathlib import Path
from bs4 import BeautifulSoup
import re

root=Path(__file__).resolve().parents[1]
excluded_pattern=re.compile(r'^(condominio|imovel|scripts|turismo|sobre|politica-privacidade|termos|lancamentos|mapa|quero-comprar|seguro-fianca|refinanciamento-imobiliario|comprar-na-planta-ou-pronto|o-que-fazer-|paradouros-|parque-eolico-|plataforma-de-atlantida|trilha-do-garapia|viver-|praca-|lagoa-|largo-do-baronda|mirantes-de-osorio|morro-da-borussia|praia-de-|cascata-|xangri-la(-|$)|maquine$|osorio$|capao-da-canoa$)$')
known={'vientos-resort-xangri-la','monaco-grand-marina-maquine','origem-natureza-habitada-xangri-la'}
rows=[]
for p in sorted(root.glob('*/index.html')):
    name=p.parent.name
    if name in known or excluded_pattern.match(name): continue
    text=p.read_text(encoding='utf-8',errors='ignore')
    if not re.search(r'cond-conteudo-full|class="cond-title"|class="body-content"|cond-mapa-section',text): continue
    soup=BeautifulSoup(text,'html.parser')
    photos=len(soup.select('.foto[data-fk]'))
    has_hero=bool(soup.select_one('.foto-hero-wrap'))
    rows.append((name,photos,has_hero))
print(f'candidatos={len(rows)}')
print(f'com_3_ou_mais_fotos={sum(n>=3 for _,n,_ in rows)}')
for name,n,hero in rows:
    print(f'{name}\tfotos={n}\thero={int(hero)}')
