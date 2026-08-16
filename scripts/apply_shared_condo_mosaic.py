from pathlib import Path
from bs4 import BeautifulSoup

ROOT=Path(__file__).resolve().parents[1]
MARK='SHARED CONDO MOSAIC v1'
CSS=f'''<style>/* {MARK} */
@media(min-width:981px){{
  .cond-gallery-viewport{{position:relative;height:clamp(400px,42vw,580px);overflow:hidden;border-radius:18px}}
  .cond-gallery-grid{{display:grid!important;grid-template-columns:minmax(0,2fr) minmax(260px,1fr);grid-template-rows:1fr 1fr;gap:10px;height:100%;transform:none!important;transition:none!important}}
  .cond-gallery-item{{width:auto!important;height:auto!important;min-width:0!important;flex:none!important;aspect-ratio:auto!important;border-radius:0!important}}
  .cond-gallery-item:nth-child(1){{grid-column:1;grid-row:1/3}}
  .cond-gallery-item:nth-child(2){{grid-column:2;grid-row:1}}
  .cond-gallery-item:nth-child(3){{grid-column:2;grid-row:2}}
  .cond-gallery-item:nth-child(n+4){{display:none}}
  .cond-gallery-item img{{object-fit:cover!important}}
  .cond-gallery-arrow{{z-index:8;width:46px!important;height:46px!important;border-radius:50%!important;background:rgba(13,59,84,.52)!important;color:#fff!important;backdrop-filter:blur(8px);box-shadow:0 8px 20px rgba(0,0,0,.16)}}
  .cond-gallery-arrow.prev{{left:14px!important}}.cond-gallery-arrow.next{{right:14px!important}}
  .cond-gallery-position{{position:relative;margin-top:-52px;margin-right:20px;z-index:9;text-align:right;color:#fff;pointer-events:none}}
}}
@media(max-width:980px){{.cond-gallery-grid{{transform:translateX(0)}}}}
</style>'''
changed=[]
for p in sorted(ROOT.glob('*/index.html')):
    text=p.read_text(encoding='utf-8',errors='ignore')
    if 'class="cond-gallery-grid"' not in text or MARK in text: continue
    soup=BeautifulSoup(text,'html.parser')
    (soup.head or soup).append(BeautifulSoup(CSS,'html.parser').style)
    p.write_text('<!DOCTYPE html>\n'+str(soup),encoding='utf-8')
    changed.append(p.parent.name)
print(f'Páginas com galeria compartilhada ajustadas: {len(changed)}')
print('\n'.join(changed))
