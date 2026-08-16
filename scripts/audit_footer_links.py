from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import requests
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor, as_completed

ROOT=Path(__file__).resolve().parents[1]
BASE='https://condominiosnapraia.com.br'
files=[]
for p in ROOT.glob('*/index.html'):
    text=p.read_text(encoding='utf-8',errors='ignore')
    if 'ftr-main' in text or 'portal-footer' in text or 'ftr-col' in text:
        files.append(p)

links=defaultdict(set)
for p in files:
    soup=BeautifulSoup(p.read_text(encoding='utf-8',errors='ignore'),'html.parser')
    footer=soup.find('footer') or soup
    for a in footer.select('a[href]'):
        href=a.get('href','').strip()
        label=' '.join(a.get_text(' ',strip=True).split())
        if not href or href.startswith(('#','mailto:','tel:','javascript:')): continue
        u=urljoin(BASE+'/',href)
        if urlparse(u).netloc.endswith('condominiosnapraia.com.br'):
            links[u].add(label or '(sem texto)')

urls=sorted(links)
def test(u):
    try:
        r=requests.get(u,timeout=20,allow_redirects=True,headers={'User-Agent':'Mozilla/5.0 footer-audit'})
        return (u,r.status_code,r.url,r.headers.get('content-type',''))
    except Exception as e:
        return (u,'ERROR',str(e),'')

results=[]
with ThreadPoolExecutor(max_workers=10) as ex:
    futures=[ex.submit(test,u) for u in urls]
    for f in as_completed(futures): results.append(f.result())
results.sort()

out=ROOT/'footer-audit.tsv'
with out.open('w',encoding='utf-8') as f:
    f.write('status\turl\tfinal\tlabels\n')
    for u,status,final,ct in results:
        labels=' | '.join(sorted(links[u]))
        f.write(f'{status}\t{u}\t{final}\t{labels}\n')

print(f'templates={len(files)}')
print(f'unique_footer_urls={len(urls)}')
print(f'bad={sum(1 for _,s,_,_ in results if s == "ERROR" or (isinstance(s,int) and s >= 400))}')
for u,status,final,ct in results:
    if status == 'ERROR' or (isinstance(status,int) and status >= 400) or final.rstrip('/') != u.rstrip('/'):
        print(f'{status}\t{u}\t=>\t{final}\tlabels={" | ".join(sorted(links[u]))}')
print(f'report={out}')
