from pathlib import Path
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
TARGETS=[ROOT/'index.html', ROOT/'condominio'/'index.html']
links={
    'Todos os condomínios':'/condominios/',
    'Condomínios em Xangri-lá':'/condominios/?cidade=Xangri-l%C3%A1',
    'Condomínios em Capão da Canoa':'/condominios/?cidade=Cap%C3%A3o%20da%20Canoa',
    'Condomínios em Osório':'/condominios/?cidade=Os%C3%B3rio',
    'Condomínios em Maquiné':'/condominios/?cidade=Maquin%C3%A9',
}
changed=[]
for path in TARGETS:
    soup=BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    count=0
    for a in soup.select('a'):
        label=' '.join(a.get_text(' ',strip=True).split())
        if label in links:
            a['href']=links[label]
            count+=1
    if count:
        path.write_text('<!DOCTYPE html>\n'+str(soup),encoding='utf-8')
        changed.append((str(path.relative_to(ROOT)),count))
print(f'templates_atualizados={len(changed)}')
for path,count in changed: print(path, count)
