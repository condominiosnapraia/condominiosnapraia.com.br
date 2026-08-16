from __future__ import annotations

import html
import json
import re
from pathlib import Path
from bs4 import BeautifulSoup

ROOT = Path('/home/ubuntu/wt_supabase_queries')
PAGE = ROOT / 'imoveis-de-luxo' / 'index.html'

PROPERTY_DATA = [
    ('imovel-cap-077', 8500000, 'Casa à venda no condomínio Velas da Marina', 'Casa', 'imovel-cap-077'),
    ('imovel-xan-209', 8000000, 'Mansão à venda no condomínio Las Dunas', 'Casa', 'imovel-xan-209'),
    ('imovel-xan-207', 7980000, '05 suítes à venda no Sense Xangri-lá', 'Sobrado', 'imovel-xan-207'),
    ('imovel-xan-208', 7890000, 'Suítes à venda no Sense Xangri-lá', 'Casa', 'imovel-xan-208'),
    ('imovel-xan-203', 5490000, 'Mansão à venda no Amaré Home Resort', 'Casa', 'imovel-xan-203'),
    ('imovel-xan-200', 5400000, 'Amaré Home Resort — 5 suítes', 'Sobrado', 'imovel-xan-200'),
    ('imovel-xan-201', 5250000, 'Mansão à venda no condomínio Amaré', 'Casa', 'imovel-xan-201'),
]
CONDO_DATA = [
    ('Vientos Resort', 'vientos-resort-xangri-la'),
    ('Amaré Home Resort', 'amare-home-resort-xangri-la'),
    ('Las Dunas', 'las-dunas-xangri-la'),
    ('Velas da Marina', 'velas-da-marina-xangri-la'),
    ('Riviera', 'riviera-xangri-la'),
    ('One Atlântida Houses', 'one-atlantida-houses-xangri-la'),
    ('Playa Vista', 'playa-vista-xangri-la'),
    ('Ventura Club', 'ventura-club-xangri-la'),
    ('Atlântida Lagos Park', 'atlantida-lagos-park-xangri-la'),
    ('Sense Xangri-lá', 'sense-xangri-la-xangri-la'),
]


def first_photo(slug: str) -> str:
    path = ROOT / slug / 'index.html'
    if not path.exists():
        return ''
    soup = BeautifulSoup(path.read_text(encoding='utf-8', errors='ignore'), 'html.parser')
    meta = soup.find('meta', attrs={'property': 'og:image'})
    if meta and meta.get('content'):
        return str(meta['content'])
    for img in soup.find_all('img'):
        src = str(img.get('src', ''))
        if '/cdn-fotos/' in src:
            return src
    return ''


def property_fallback() -> str:
    rows = []
    for slug, price, title, kind, _ in PROPERTY_DATA:
        page = ROOT / slug / 'index.html'
        soup = BeautifulSoup(page.read_text(encoding='utf-8', errors='ignore'), 'html.parser')
        h1 = soup.find('h1')
        final_title = ' '.join(h1.get_text(' ', strip=True).split()) if h1 else title
        photo = first_photo(slug)
        rows.append({'slug': slug, 'preco': price, 'titulo': final_title, 'tipo': kind, 'codigo': slug.replace('imovel-', '').upper(), 'fotos_no_site': [photo] if photo else []})
    return json.dumps(rows, ensure_ascii=False)


def related_markup() -> str:
    links = [
        ('Ver todos os imóveis', '/imoveis/', 'Veja o catálogo completo'),
        ('Apartamentos', '/imoveis/?tipo=Apartamento', 'Buscar apartamentos'),
        ('Casas', '/imoveis/?tipo=Casa&cond=em', 'Buscar casas em condomínio'),
        ('Sobrados', '/imoveis/?tipo=Sobrado&cond=em', 'Buscar sobrados em condomínio'),
        ('Lotes', '/imoveis/?tipo=Lote&cond=em', 'Buscar terrenos e lotes'),
        ('Condomínios', '/condominios/', 'Conhecer os condomínios'),
    ]
    buttons = ''.join(f'<a class="luxo-nav-card" href="{href}"><strong>{label}</strong><span>{sub}</span><b>→</b></a>' for label, href, sub in links)
    cards = []
    for name, slug in CONDO_DATA:
        photo = html.escape(first_photo(slug), quote=True)
        image = f'<img src="{photo}" alt="{html.escape(name)} — condomínio no Litoral Norte Gaúcho" loading="lazy" decoding="async" width="640" height="420">' if photo else '<div class="luxo-condo-placeholder">Portal Meu Litoral</div>'
        cards.append(f'<a class="luxo-condo-card" href="/{slug}/">{image}<span class="luxo-condo-body"><strong>{html.escape(name)}</strong><small>Condomínio de alto padrão · Litoral Norte Gaúcho</small><b>Conhecer condomínio →</b></span></a>')
    return f'''<section class="luxo-explore" aria-labelledby="luxo-explore-title"><div class="luxo-section-kicker">Encontre seu próximo endereço</div><h2 id="luxo-explore-title">Procure por tipo de imóvel</h2><p>Use os atalhos para encontrar rapidamente apartamentos, casas, sobrados, lotes ou todas as oportunidades disponíveis no portal.</p><div class="luxo-nav-grid">{buttons}</div></section>\n<section class="luxo-condos" aria-labelledby="luxo-condos-title"><div class="luxo-section-kicker">Curadoria Portal Meu Litoral</div><h2 id="luxo-condos-title">Conheça os 10 melhores condomínios</h2><p class="luxo-section-lead">Uma seleção de empreendimentos de alto padrão para comparar localização, infraestrutura, lazer e potencial de valorização.</p><div class="luxo-condo-grid">{''.join(cards)}</div><a class="luxo-outline-btn" href="/condominios/">Ver todos os condomínios →</a></section>'''


def css_block() -> str:
    return '''<style id="luxo-page-enrichment">
.luxo-explore,.luxo-condos{margin:42px 0;padding:34px 0;border-top:1px solid #e5ded3}
.luxo-section-kicker{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#b4862c;font-weight:700;margin-bottom:8px}
.luxo-explore h2,.luxo-condos h2{font-family:'Fraunces',serif;color:#0d3b54;font-size:clamp(24px,3vw,34px);margin:0 0 8px}
.luxo-explore p,.luxo-section-lead{max-width:760px;color:#536873;line-height:1.65;margin:0 0 22px}
.luxo-nav-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.luxo-nav-card{position:relative;display:flex;flex-direction:column;gap:5px;padding:18px 42px 18px 18px;border:1px solid #e5ded3;border-radius:14px;background:#fffdf8;color:#0d3b54;text-decoration:none;transition:transform .2s,box-shadow .2s,border-color .2s}
.luxo-nav-card:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(13,59,84,.1);border-color:#d9a83f}
.luxo-nav-card strong{font-size:16px}.luxo-nav-card span{font-size:12px;color:#6d7d84}.luxo-nav-card b{position:absolute;right:16px;top:50%;transform:translateY(-50%);font-size:22px;color:#b4862c}
.luxo-condo-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:14px;margin-top:22px}
.luxo-condo-card{overflow:hidden;border:1px solid #e5ded3;border-radius:14px;background:#fff;text-decoration:none;color:#0d3b54;box-shadow:0 4px 14px rgba(13,59,84,.05);transition:transform .2s,box-shadow .2s}
.luxo-condo-card:hover{transform:translateY(-3px);box-shadow:0 10px 24px rgba(13,59,84,.12)}
.luxo-condo-card img,.luxo-condo-placeholder{display:block;width:100%;height:145px;object-fit:cover;background:#dfe9e7}
.luxo-condo-placeholder{display:grid;place-items:center;color:#0d3b54;font-family:'Fraunces',serif;font-size:15px}
.luxo-condo-body{display:flex;flex-direction:column;gap:7px;padding:13px}.luxo-condo-body strong{font-size:14px;line-height:1.25}.luxo-condo-body small{font-size:11px;color:#6d7d84;line-height:1.35}.luxo-condo-body b{font-size:11px;color:#0e7490}
.luxo-outline-btn{display:inline-flex;margin-top:20px;padding:12px 18px;border:1px solid #b9c8c7;border-radius:999px;color:#0d3b54;text-decoration:none;font-weight:700;background:#fffdf8}
.luxo-outline-btn:hover{border-color:#d9a83f;background:#f7eedf}
@media(max-width:1000px){.luxo-condo-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:700px){.luxo-explore,.luxo-condos{margin:30px 0;padding:26px 0}.luxo-nav-grid{grid-template-columns:1fr 1fr;gap:10px}.luxo-nav-card{padding:15px 34px 15px 14px}.luxo-nav-card strong{font-size:14px}.luxo-condo-grid{grid-template-columns:1fr 1fr;gap:10px}.luxo-condo-card img,.luxo-condo-placeholder{height:120px}.luxo-condo-body{padding:10px}.luxo-condo-body strong{font-size:12px}}
@media(max-width:420px){.luxo-nav-grid,.luxo-condo-grid{grid-template-columns:1fr}.luxo-condo-card img,.luxo-condo-placeholder{height:160px}}
</style>'''


def js_block(sb: str, key: str) -> str:
    fallback = property_fallback()
    return f'''<script>
(function(){{
  var SB={json.dumps(sb)};
  var KEY={json.dumps(key)};
  var MIN_LUXO=5000000;
  var FALLBACK={fallback};
  function brl(v){{try{{return Number(v||0).toLocaleString('pt-BR',{{style:'currency',currency:'BRL',minimumFractionDigits:0}});}}catch(e){{return'Consulte';}}}}
  function esc(v){{return String(v||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}}
  function fotoPublica(u){{var s=String(u||'').trim();if(!s)return '';if(s.indexOf('/cdn-fotos/')===0||s.indexOf('data:')===0)return s;var m='/storage/v1/object/public/';var ix=s.indexOf(m);return ix>=0?'/cdn-fotos/'+s.slice(ix+m.length).replace(/^\/+/,''):s;}}
  function fotoTag(u,alt){{var b=fotoPublica(u);if(!b)return '';return '<img src="'+esc(b)+'" alt="'+esc(alt)+'" loading="lazy" decoding="async" width="640" height="480">';}}
  function href(i){{var s=String(i.slug||'').replace(/^\/+|\/+$/g,'');return s?'/'+s+'/':'/imovel?id='+encodeURIComponent(i.codigo||i.id||'');}}
  function elegivel(i){{var tipo=String(i.tipo||'').toLowerCase();return Number(i.preco||0)>=MIN_LUXO && /(casa|sobrado)/.test(tipo) && !/(lote|terreno|apartamento)/.test(tipo);}}
  function card(i){{var foto=(i.fotos_no_site||i.fotos||[]).find(function(f){{return f&&(String(f).indexOf('http')===0||String(f).indexOf('/cdn-fotos/')===0||String(f).indexOf('data:')===0);}});var specs=[i.quartos?('🛏 '+i.quartos):null,i.suites?('🛁 '+i.suites):null,(i.area||i.area_privativa||i.area_construida)?('📐 '+(i.area||i.area_privativa||i.area_construida)+'m²'):null,i.vagas?('🚗 '+i.vagas):null].filter(Boolean).map(function(s){{return '<span class="icspec">'+s+'</span>';}}).join('');return '<a class="icard vis" href="'+href(i)+'" style="text-decoration:none;color:inherit;display:block"><div class="icimg">'+(foto?fotoTag(foto,i.titulo||'Imóvel de luxo'):'🏠')+'<div class="icst stv">Disponível</div>'+(i.codigo?'<div class="iccod">'+esc(i.codigo)+'</div>':'')+'</div><div class="icbody"><div class="ictipo">'+esc(i.tipo||'Imóvel de alto padrão')+'</div><div class="ictit">'+esc(i.titulo||'Imóvel exclusivo no Litoral Norte')+'</div><div class="icspecs">'+specs+'</div></div><div class="icfoot"><div class="icpreco">'+brl(i.preco)+'</div><span style="font-size:10px;letter-spacing:.13em;text-transform:uppercase;color:#0c4a6e">Ver →</span></div></a>';}}
  function render(data){{var lista=(Array.isArray(data)?data:[]).filter(function(i){{return i.publicar!==false && i.status!=='Vendido' && elegivel(i);}}).sort(function(a,b){{return Number(b.preco||0)-Number(a.preco||0);}}).slice(0,24);if(!lista.length)lista=FALLBACK;var g=document.getElementById('grid-luxo');if(g)g.innerHTML=lista.map(card).join('');}}
  fetch(SB+'/rest/v1/imoveis?status=neq.Vendido&publicar=eq.true&preco=gte.5000000&select=id,slug,codigo,titulo,status,publicar,tipo,preco,quartos,suites,vagas,area,area_privativa,area_construida,fotos_no_site&order=preco.desc&limit=100',{{headers:{{apikey:KEY,Authorization:'Bearer '+KEY}}}}).then(function(r){{return r.json();}}).then(render).catch(function(){{render(FALLBACK);}});
}})();
</script>'''


def main() -> None:
    text = PAGE.read_text(encoding='utf-8')
    sb = re.search(r"var SB='([^']+)'", text)
    key = re.search(r"var KEY='([^']+)'", text)
    if not sb or not key:
        raise SystemExit('Supabase config not found')
    text = re.sub(r'<style id="luxo-page-enrichment">.*?</style>', '', text, flags=re.S)
    text = text.replace('</head>', css_block() + '\n</head>', 1)
    text = re.sub(r'<section class="luxo-explore".*?</section>\s*<section class="luxo-condos".*?</section>\s*', '', text, flags=re.S)
    text = text.replace('  <div class="anc-grid-sec">', '  ' + related_markup() + '\n  <div class="anc-grid-sec">', 1)
    text = re.sub(r'\n  <div class="anc-cta-box">', '\n  <div class="anc-cta-box">', text, count=1)
    text = re.sub(r'<script>\n\(function\(\)\{\n  var SB=.*?</script>', js_block(sb.group(1), key.group(1)), text, flags=re.S, count=1)
    PAGE.write_text(text, encoding='utf-8')
    print('updated', PAGE)


if __name__ == '__main__':
    main()
