from pathlib import Path
from bs4 import BeautifulSoup
import re

ROOT = Path(__file__).resolve().parents[1]
MARK = 'STATIC MOSAIC GALLERY v1'
EXCLUDED = {
    'condominio','comprar-na-planta-ou-pronto','o-que-fazer-em-capao-da-canoa','o-que-fazer-em-maquine',
    'o-que-fazer-em-osorio','o-que-fazer-em-xangri-la','paradouros-a-beira-mar','parque-eolico-de-osorio',
    'plataforma-de-atlantida','trilha-do-garapia-ecoturismo','viver-na-cidade','viver-na-lagoa','viver-no-mar',
    'quero-comprar','cascata-da-forqueta','cascata-do-garapia','lagoa-dos-barros','lagoa-dos-quadros',
    'largo-do-baronda','mirantes-de-osorio','morro-da-borussia','praia-de-atlantida','praia-de-capao-da-canoa',
    'praca-avezon','praca-da-zona-nova','praca-do-farol','praca-do-mini-golf','praca-do-skate',
    'praca-dos-camelos','praca-flavio-boianovski','praca-israelita','praca-luiz-bassani','praca-tiaraju',
}

CSS = f'''<style>/* {MARK} */
.cond-mosaic-gallery{{max-width:1080px;margin:10px auto 36px;padding:0 24px;position:relative}}
.cond-mosaic-grid{{height:clamp(360px,48vw,590px);display:grid;grid-template-columns:minmax(0,2fr) minmax(260px,1fr);grid-template-rows:1fr 1fr;gap:10px;border-radius:18px;overflow:hidden;background:#dfe7ec;box-shadow:0 18px 50px rgba(12,74,110,.15)}}
.cond-mosaic-cell{{position:relative;min-width:0;min-height:0;overflow:hidden;background:#dfe7ec;cursor:zoom-in}}
.cond-mosaic-cell.main{{grid-row:1/3}}
.cond-mosaic-cell .foto{{width:100%;height:100%;min-height:0;margin:0;border:0;border-radius:0;box-shadow:none;aspect-ratio:auto;background-size:cover;background-position:center}}
.cond-mosaic-cell .foto .ic,.cond-mosaic-cell .foto .cap{{display:none}}
.cond-mosaic-cell::after{{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 62%,rgba(5,25,38,.3));pointer-events:none}}
.cond-mosaic-arrow{{position:absolute;top:50%;z-index:5;width:46px;height:46px;margin-top:-23px;border:1px solid rgba(255,255,255,.55);border-radius:50%;background:rgba(13,59,84,.5);backdrop-filter:blur(8px);color:#fff;font-size:29px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}}
.cond-mosaic-arrow.prev{{left:38px}}.cond-mosaic-arrow.next{{right:38px}}
.cond-mosaic-arrow:hover{{background:rgba(13,59,84,.82)}}
.cond-mosaic-count{{position:absolute;right:40px;bottom:16px;z-index:6;background:rgba(13,59,84,.82);color:#fff;border-radius:999px;padding:8px 14px;font-size:12px;font-weight:600;letter-spacing:.02em}}
.cond-mosaic-lightbox{{position:fixed;inset:0;display:none;align-items:center;justify-content:center;padding:34px;background:rgba(5,25,38,.93);z-index:100001}}
.cond-mosaic-lightbox.open{{display:flex}}
.cond-mosaic-lightbox-img{{max-width:92vw;max-height:88vh;width:min(1200px,92vw);height:min(780px,88vh);object-fit:contain;background-position:center;background-repeat:no-repeat;background-size:contain}}
.cond-mosaic-close{{position:absolute;top:18px;right:24px;width:44px;height:44px;border:0;border-radius:50%;background:#fff;color:#0d3b54;font-size:24px;cursor:pointer}}
@media(max-width:680px){{.cond-mosaic-gallery{{margin:0 auto 28px;padding:0 14px}}.cond-mosaic-grid{{height:auto;display:block;border-radius:14px;box-shadow:0 12px 30px rgba(12,74,110,.12)}}.cond-mosaic-cell.main{{height:clamp(260px,62vw,420px)}}.cond-mosaic-cell.side{{display:none}}.cond-mosaic-arrow.prev{{left:28px}}.cond-mosaic-arrow.next{{right:28px}}.cond-mosaic-count{{right:28px;bottom:12px}}}}
</style>'''

JS = f'''<script>/* {MARK} */
(function(){{
  function init(){{
    if(document.querySelector('.cond-mosaic-gallery')) return;
    var old=document.querySelector('.foto-hero-wrap');
    if(!old) return;
    var photos=Array.prototype.slice.call(document.querySelectorAll('.foto[data-fk]'));
    if(!photos.length) return;
    var gallery=document.createElement('section'); gallery.className='cond-mosaic-gallery'; gallery.setAttribute('aria-label','Galeria de fotos do condomínio');
    gallery.innerHTML='<div class="cond-mosaic-grid"><div class="cond-mosaic-cell main"></div><div class="cond-mosaic-cell side side-a"></div><div class="cond-mosaic-cell side side-b"></div></div><button class="cond-mosaic-arrow prev" type="button" aria-label="Foto anterior">‹</button><button class="cond-mosaic-arrow next" type="button" aria-label="Próxima foto">›</button><span class="cond-mosaic-count"></span>';
    old.replaceWith(gallery);
    var main=gallery.querySelector('.main'), a=gallery.querySelector('.side-a'), b=gallery.querySelector('.side-b');
    var idx=0;
    function put(cell, node){{ if(!node){{cell.style.display='none';return;}} cell.style.display='block'; cell.innerHTML=''; cell.appendChild(node); }}
    function render(){{
      var count=photos.length;
      put(main, photos[idx % count]); put(a, photos[(idx+1)%count]); put(b, photos[(idx+2)%count]);
      gallery.querySelector('.cond-mosaic-count').textContent = count > 3 ? '+'+(count-3)+' fotos exclusivas' : count+' fotos';
      [main,a,b].forEach(function(cell){{cell.onclick=function(){{var node=cell.querySelector('.foto'); if(node) openBox(node);}};}});
    }}
    function openBox(node){{
      var bg=getComputedStyle(node).backgroundImage; if(!bg || bg==='none') return;
      var box=document.querySelector('.cond-mosaic-lightbox'); if(!box){{box=document.createElement('div');box.className='cond-mosaic-lightbox';box.innerHTML='<button class="cond-mosaic-close" type="button" aria-label="Fechar">×</button><div class="cond-mosaic-lightbox-img"></div>';document.body.appendChild(box);box.querySelector('.cond-mosaic-close').onclick=function(){{box.classList.remove('open');}};box.onclick=function(e){{if(e.target===box)box.classList.remove('open');}};}}
      box.querySelector('.cond-mosaic-lightbox-img').style.backgroundImage=bg; box.classList.add('open');
    }}
    gallery.querySelector('.prev').onclick=function(){{idx=(idx-1+photos.length)%photos.length;render();}};
    gallery.querySelector('.next').onclick=function(){{idx=(idx+1)%photos.length;render();}};
    render(); setTimeout(render,900);
  }}
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
}})();
</script>'''

changed=[]
for path in sorted(ROOT.glob('*/index.html')):
    if path.parent.name in EXCLUDED or path.parent.name.startswith('blog-'):
        continue
    text=path.read_text(encoding='utf-8',errors='ignore')
    if 'class="foto-hero-wrap"' not in text or MARK in text:
        continue
    soup=BeautifulSoup(text,'html.parser')
    head=soup.head or soup
    head.append(BeautifulSoup(CSS,'html.parser').style)
    target=soup.body or soup.html or soup
    target.append(BeautifulSoup(JS,'html.parser').script)
    path.write_text('<!DOCTYPE html>\n'+str(soup),encoding='utf-8')
    changed.append(path.parent.name)
print(f'Galeria mosaico aplicada: {len(changed)}')
print('\n'.join(changed))
