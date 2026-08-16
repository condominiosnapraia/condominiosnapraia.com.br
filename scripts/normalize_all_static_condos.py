from pathlib import Path
from bs4 import BeautifulSoup, NavigableString
import re

ROOT = Path(__file__).resolve().parents[1]

# Diretórios editoriais/turísticos que não são páginas de condomínio.
EXCLUDED = {
    'comprar-na-planta-ou-pronto','o-que-fazer-em-capao-da-canoa','o-que-fazer-em-maquine',
    'o-que-fazer-em-osorio','o-que-fazer-em-xangri-la','paradouros-a-beira-mar',
    'parque-eolico-de-osorio','plataforma-de-atlantida','trilha-do-garapia-ecoturismo',
    'viver-na-cidade','viver-na-lagoa','viver-no-mar','quero-comprar',
    'cascata-da-forqueta','cascata-do-garapia','lagoa-dos-barros','lagoa-dos-quadros',
    'largo-do-baronda','mirantes-de-osorio','morro-da-borussia','praia-de-atlantida',
    'praia-de-capao-da-canoa','praca-avezon','praca-da-zona-nova','praca-do-farol',
    'praca-do-mini-golf','praca-do-skate','praca-dos-camelos','praca-flavio-boianovski',
    'praca-israelita','praca-luiz-bassani','praca-tiaraju','green-village-golf-club-xangri-la'
}

CSS_MARKER = '/* STATIC CONDO NORMALIZER v1 */'
CSS = f'''{CSS_MARKER}
.body-content{{display:flex;flex-direction:column}}
.body-content>[data-cond-order]{{order:var(--cond-order,50)}}
.vpc{{max-width:none!important;width:100%!important;box-sizing:border-box!important;padding:52px 40px!important}}
.vpc-in{{max-width:1180px!important;margin:0 auto!important}}
.pdf-frame .pdf-thumb{{display:block;position:relative;border-radius:16px;overflow:hidden;background:#f4f6f3;text-decoration:none}}
.pdf-frame .pdf-thumb img{{display:block;width:100%;height:auto;max-height:520px;object-fit:contain}}
.pdf-frame .pdf-thumb span{{position:absolute;left:16px;right:16px;bottom:14px;text-align:center;background:rgba(13,59,84,.86);color:#fff;border-radius:999px;padding:9px 14px;font-size:12px;font-weight:600}}
@media(max-width:760px){{.vpc{{padding:36px 20px!important}}.vpc-in{{padding:34px 24px!important}}}}
'''

JS_MARKER = '/* STATIC CONDO ORDER v1 */'
JS = f'''<script>{JS_MARKER}
(function(){{
  var root=document.querySelector('.body-content'); if(!root) return;
  var nodes=Array.prototype.slice.call(root.children), current=1;
  function orderFor(el){{
    var text=(el.textContent||'').replace(/\\s+/g,' ').trim().toLowerCase();
    var cls=typeof el.className==='string'?el.className.toLowerCase():'';
    if(cls.indexOf('pdf-map')>-1 || text.indexOf('mapa de implantação')>-1 || text.indexOf('mapa de implantacao')>-1) return 9;
    if(cls.indexOf('faq')>-1 || text.indexOf('perguntas frequentes')>-1) return 11;
    if(cls.indexOf('map-embed')>-1 || text==='localização' || text==='localizacao' || text.indexOf('onde fica')>-1) return 6;
    if(cls.indexOf('tbl-wrap')>-1 || text.indexOf('diferenciais')>-1) return 5;
    if(text.indexOf('mercado e valorização')>-1 || text.indexOf('mercado e valorizacao')>-1) return 10;
    if(text.indexOf('imóveis à venda')>-1 || text.indexOf('imoveis a venda')>-1 || cls.indexOf('imoveis')>-1) return 7;
    if(cls.indexOf('lead-box')>-1 || cls.indexOf('cta-strip')>-1) return text.indexOf('venda')>-1 || text.indexOf('garanta')>-1 ? 12 : 8;
    if(text.indexOf('sobre o ')>-1 || text.indexOf('o que é')>-1 || text.indexOf('o que e')>-1 || text.indexOf('história')>-1 || text.indexOf('historia')>-1) return 3;
    if(text.indexOf('infraestrutura')>-1 || text.indexOf('amenidades')>-1 || text.indexOf('piscina')>-1 || text.indexOf('praia artificial')>-1 || text.indexOf('rooftop')>-1 || text.indexOf('spa')>-1) return 2;
    if(el.tagName==='H2' || el.tagName==='H3') return current;
    return current;
  }}
  nodes.forEach(function(el){{ var n=orderFor(el); if(el.tagName==='H2'||el.tagName==='H3'||el.className==='lead-box'||el.className==='faq') current=n; el.setAttribute('data-cond-order',''); el.style.setProperty('--cond-order',n); }});
}})();
</script>'''


def is_condo_page(path: Path) -> bool:
    if path.parent.name in EXCLUDED:
        return False
    text = path.read_text(encoding='utf-8', errors='ignore')
    return bool(re.search(r'cond-conteudo-full|class="cond-title"|class="body-content"|cond-mapa-section', text))


def add_css(soup):
    if CSS_MARKER in soup.get_text():
        return
    style = soup.new_tag('style')
    style.string = CSS
    (soup.head or soup).append(style)


def add_js(soup):
    if JS_MARKER in soup.get_text():
        return
    script = BeautifulSoup(JS, 'html.parser').script
    target = soup.body or soup.html or soup
    target.append(script)


def optimize_maps(soup, dirname):
    changed = False
    # Troca miniaturas JPG existentes pelo WebP equivalente quando disponível.
    for img in soup.select('img.mapz-img, .pdf-mobile img'):
        src = img.get('src','')
        if src.lower().endswith('.jpg'):
            candidate = ROOT / src.lstrip('/').replace('.jpg','.webp')
            if candidate.exists():
                img['src'] = src[:-4] + '.webp'
                changed = True
    # PDFs incorporados viram miniatura; o link continua abrindo o PDF completo sob demanda.
    for iframe in soup.select('.pdf-frame iframe'):
        src = iframe.get('src','').split('#',1)[0]
        if not src.lower().endswith('.pdf'):
            continue
        name = Path(src).stem.replace('-implantacao','')
        thumb = f'/img/mapas/{name}.webp'
        if not (ROOT / thumb.lstrip('/')).exists():
            continue
        a = soup.new_tag('a', href=src, target='_blank', rel='noopener', **{'class':'pdf-thumb','aria-label':'Abrir mapa de implantação em PDF'})
        img = soup.new_tag('img', src=thumb, alt='Miniatura do mapa de implantação', loading='lazy', decoding='async', width='1280', height='900')
        a.append(img)
        span = soup.new_tag('span')
        span.string = 'Toque para abrir o PDF em alta resolução ↗'
        a.append(span)
        iframe.replace_with(a)
        changed = True
    return changed


changed=[]
for path in sorted(ROOT.glob('*/index.html')):
    if not is_condo_page(path):
        continue
    soup = BeautifulSoup(path.read_text(encoding='utf-8'), 'html.parser')
    before = str(soup)
    add_css(soup)
    add_js(soup)
    optimize_maps(soup, path.parent.name)
    after = str(soup)
    if after != before:
        path.write_text('<!DOCTYPE html>\n' + after, encoding='utf-8')
        changed.append(path.parent.name)

print(f'Páginas estáticas normalizadas: {len(changed)}')
print('\n'.join(changed))
