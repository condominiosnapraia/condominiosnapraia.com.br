from copy import deepcopy
from pathlib import Path
import json
from bs4 import BeautifulSoup, NavigableString

ROOT = Path(__file__).resolve().parents[1]
PAGE = ROOT / "atlantida-lagos-park-xangri-la" / "index.html"

SUMMARY = (
    "O Atlântida Lagos Park é um condomínio fechado de alto padrão em Atlântida, "
    "Xangri-Lá, com casas térreas, sobrados e terrenos. Seu principal diferencial "
    "é a presença de lagos para esportes náuticos, incluindo raias para esqui "
    "aquático e áreas para passeios de caiaque ou botes, além de ampla "
    "infraestrutura de lazer e esporte."
)
INFRA = (
    "Infraestrutura confirmada: lagos para esportes náuticos; raias para esqui "
    "aquático; lago para passeios de caiaque ou botes; vigias 24 horas; várias "
    "quadras de tênis sintéticas e 2 de saibro cobertas; quadras de padel abertas "
    "e 2 cobertas; 4 campos de futebol gramados, sendo 1 com espaço para churrasco; "
    "clube com salão de festas; restaurante no verão e em feriadões; piscinas "
    "adulta e infantil; praia artificial com toboágua e cascata; academia de "
    "musculação; quadras poliesportivas; playgrounds; praças e áreas verdes."
)

STYLE = r'''
<style id="cond-lagos-clean-style">
.hero img{object-fit:cover;object-position:center}
.cond-lagos-clean{display:block!important;max-width:1000px!important;margin:0 auto!important;padding:32px 24px 50px!important}
.cond-lagos-clean>*{order:initial!important}
.cond-lagos-section-title,.cond-lagos-clean h2{font-family:'Fraunces',serif!important;color:#0d3b54!important;font-weight:600!important;line-height:1.15!important}
.cond-lagos-section-title{font-size:clamp(25px,3vw,34px)!important;margin:0 0 8px!important}
.cond-lagos-gallery-count{font-size:13px;color:#5b7585;margin:0 0 18px;letter-spacing:.02em}
.cond-lagos-gallery{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:10px;margin:0 0 42px}
.cond-lagos-gallery-viewport{overflow:hidden;min-width:0;border-radius:16px}
.cond-lagos-gallery-track{display:flex;gap:12px;overflow-x:auto;scroll-behavior:smooth;scroll-snap-type:x mandatory;scrollbar-width:none;padding:0 2px 8px}
.cond-lagos-gallery-track::-webkit-scrollbar{display:none}
.cond-lagos-gallery-item{position:relative;flex:0 0 min(82%,720px);margin:0;scroll-snap-align:center;cursor:zoom-in}
.cond-lagos-gallery-item img{display:block;width:100%;aspect-ratio:16/10;height:auto!important;object-fit:cover;border-radius:14px;box-shadow:0 8px 24px rgba(13,59,84,.12)}
.cond-lagos-gallery-arrow{width:42px;height:42px;border:0;border-radius:50%;background:#fff;color:#0d3b54;box-shadow:0 5px 16px rgba(13,59,84,.16);font-size:27px;line-height:1;cursor:pointer}
.cond-lagos-gallery-arrow:hover{background:#e8f7f8}.cond-lagos-gallery-arrow:focus-visible{outline:3px solid #e0b34d;outline-offset:3px}
.cond-lagos-intro,.cond-lagos-infra{margin:0 0 34px;padding:22px 24px;background:#f7fbfb;border:1px solid rgba(31,181,196,.18);border-radius:16px}
.cond-lagos-clean h2{font-size:clamp(22px,2.6vw,29px)!important;margin:0 0 13px!important}
.cond-lagos-clean p{font-family:'Outfit',sans-serif;color:#33454f;font-size:15px;line-height:1.75;margin:0 0 14px}
.cond-lagos-availability{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin:0 0 34px}
.cond-lagos-availability-card{background:#fff;border:1px solid #e5ded3;border-radius:12px;padding:16px}
.cond-lagos-availability-label{font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:#5b7585}
.cond-lagos-availability-value{font-family:'Fraunces',serif;font-size:24px;color:#0d3b54;margin-top:4px}
.cond-lagos-followup{margin-top:28px}
.cond-lagos-lightbox{position:fixed;inset:0;z-index:1300;display:none;align-items:center;justify-content:center;padding:24px;background:rgba(5,25,38,.9);backdrop-filter:blur(8px)}
.cond-lagos-lightbox.open{display:flex}.cond-lagos-lightbox-inner{position:relative;display:flex;align-items:center;justify-content:center;width:min(1100px,100%);height:min(88vh,780px)}
.cond-lagos-lightbox-image{max-width:calc(100% - 100px);max-height:100%;object-fit:contain;border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.35)}
.cond-lagos-lightbox-close,.cond-lagos-lightbox-arrow{position:absolute;border:0;border-radius:50%;background:#fff;color:#0d3b54;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.2)}
.cond-lagos-lightbox-close{top:0;right:0;width:40px;height:40px;font-size:26px}.cond-lagos-lightbox-arrow{top:50%;transform:translateY(-50%);width:46px;height:46px;font-size:30px}.cond-lagos-lightbox-arrow.prev{left:0}.cond-lagos-lightbox-arrow.next{right:0}.cond-lagos-lightbox-caption{position:absolute;bottom:-4px;left:50%;transform:translateX(-50%);color:#fff;font-size:12px;letter-spacing:.08em}
@media(max-width:600px){.cond-lagos-clean{padding:24px 16px 40px!important}.cond-lagos-gallery{gap:6px}.cond-lagos-gallery-item{flex-basis:88%}.cond-lagos-gallery-arrow{width:34px;height:34px;font-size:22px}.cond-lagos-intro,.cond-lagos-infra{padding:18px 16px}.cond-lagos-lightbox{padding:14px}.cond-lagos-lightbox-image{max-width:calc(100% - 54px)}.cond-lagos-lightbox-arrow{width:34px;height:34px;font-size:24px}.cond-lagos-lightbox-close{width:34px;height:34px;font-size:22px}}
</style>
'''

LIGHTBOX = r'''
<div class="cond-lagos-lightbox" id="cond-lagos-lightbox" role="dialog" aria-modal="true" aria-label="Visualização ampliada das imagens do condomínio" aria-hidden="true">
  <div class="cond-lagos-lightbox-inner">
    <button class="cond-lagos-lightbox-close" id="cond-lagos-lightbox-close" type="button" aria-label="Fechar imagem ampliada">×</button>
    <button class="cond-lagos-lightbox-arrow prev" type="button" aria-label="Foto anterior">‹</button>
    <img class="cond-lagos-lightbox-image" id="cond-lagos-lightbox-image" src="" alt="" />
    <button class="cond-lagos-lightbox-arrow next" type="button" aria-label="Próxima foto">›</button>
    <div class="cond-lagos-lightbox-caption" id="cond-lagos-lightbox-caption"></div>
  </div>
</div>
'''

SCRIPT = r'''
<script id="cond-lagos-gallery-script">
(function(){
  var track=document.getElementById('cond-lagos-gallery-track');
  if(!track) return;
  var items=[].slice.call(track.querySelectorAll('.cond-lagos-gallery-item'));
  var step=function(){var item=items[0];return item?item.getBoundingClientRect().width+12:track.clientWidth};
  var move=function(delta){track.scrollBy({left:step()*delta,behavior:'smooth'});};
  document.querySelector('.cond-lagos-gallery-arrow.prev')?.addEventListener('click',function(){move(-1)});
  document.querySelector('.cond-lagos-gallery-arrow.next')?.addEventListener('click',function(){move(1)});
  var modal=document.getElementById('cond-lagos-lightbox');
  var image=document.getElementById('cond-lagos-lightbox-image');
  var caption=document.getElementById('cond-lagos-lightbox-caption');
  var current=0;
  var render=function(){
    var source=items[current]?.querySelector('img'); if(!source) return;
    image.src=source.currentSrc||source.src; image.alt=source.alt||'';
    caption.textContent=(current+1)+' / '+items.length;
  };
  var open=function(index){current=Math.max(0,Math.min(index,items.length-1));render();modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';};
  var close=function(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';};
  items.forEach(function(item,index){item.addEventListener('click',function(){open(index)});});
  document.getElementById('cond-lagos-lightbox-close')?.addEventListener('click',close);
  document.querySelector('.cond-lagos-lightbox-arrow.prev')?.addEventListener('click',function(){current=(current+items.length-1)%items.length;render()});
  document.querySelector('.cond-lagos-lightbox-arrow.next')?.addEventListener('click',function(){current=(current+1)%items.length;render()});
  modal.addEventListener('click',function(event){if(event.target===modal)close()});
  document.addEventListener('keydown',function(event){
    if(!modal.classList.contains('open')) return;
    if(event.key==='Escape') close();
    if(event.key==='ArrowLeft'){current=(current+items.length-1)%items.length;render()}
    if(event.key==='ArrowRight'){current=(current+1)%items.length;render()}
  });
})();
</script>
'''


def next_tag(node):
    sibling = node.next_sibling
    while sibling and isinstance(sibling, NavigableString):
        sibling = sibling.next_sibling
    return sibling if isinstance(sibling, type(node)) else None


def h2_with(section, phrase):
    for h in section.find_all('h2'):
        if phrase.lower() in h.get_text(' ', strip=True).lower():
            return h
    return None


def clone(node):
    return deepcopy(node) if node else None


def main():
    html = PAGE.read_text(encoding='utf-8')
    soup = BeautifulSoup(html, 'html.parser')

    # Idempotência: se a galeria nova já existe, apenas garanta os assets restantes.
    if soup.select_one('#cond-lagos-gallery-track'):
        clean = soup.select_one('section.cond-lagos-clean')
        infra_existing = clean.select_one('.cond-lagos-infra') if clean else None
        gallery_title = clean.select_one('.cond-lagos-section-title') if clean else None
        gallery_count = clean.select_one('.cond-lagos-gallery-count') if clean else None
        gallery_existing = clean.select_one('.cond-lagos-gallery') if clean else None
        if infra_existing and gallery_title and gallery_count and gallery_existing:
            for node in (gallery_title, gallery_count, gallery_existing):
                node.extract()
            infra_existing.insert_after(gallery_existing)
            infra_existing.insert_after(gallery_count)
            infra_existing.insert_after(gallery_title)
        if not soup.find('style', id='cond-lagos-clean-style'):
            soup.head.append(BeautifulSoup(STYLE, 'html.parser'))
        if not soup.find(id='cond-lagos-lightbox'):
            soup.body.append(BeautifulSoup(LIGHTBOX, 'html.parser'))
        if not soup.find('script', id='cond-lagos-gallery-script'):
            soup.body.append(BeautifulSoup(SCRIPT, 'html.parser'))
        PAGE.write_text(str(soup), encoding='utf-8')
        print(f'Página já normalizada; assets verificados: {PAGE}')
        return

    # SEO description uses the confirmed editorial text supplied by the user.
    seo_desc = SUMMARY
    for meta in soup.find_all('meta'):
        if meta.get('name') == 'description' or meta.get('property') == 'og:description':
            meta['content'] = seo_desc
    for script in soup.find_all('script', type='application/ld+json'):
        try:
            data = json.loads(script.string or script.get_text())
        except Exception:
            continue
        if isinstance(data, dict) and data.get('@type') == 'Residence':
            data['description'] = seo_desc
            script.string = json.dumps(data, ensure_ascii=False, separators=(',', ':'))

    loc = soup.select_one('.loc')
    if loc:
        loc_text = loc.get_text(' ', strip=True).replace('Atlantida', 'Atlântida')
        loc.clear(); loc.append(loc_text)

    # The first paragraph below the hero becomes the requested introduction.
    first_desc = soup.select_one('.wrap .desc')
    if first_desc:
        first_desc.clear(); first_desc.append(SUMMARY)

    section = soup.select_one('section.cond-conteudo-full')
    if not section:
        raise SystemExit('cond-conteudo-full não encontrado')

    gallery_grid = section.find('div', recursive=False)
    photos = gallery_grid.find_all('img', recursive=False) if gallery_grid else []
    gallery_photos = photos[1:] if len(photos) > 1 else photos
    available = len(section.select('a[href^="/imovel/"]')) or 0

    location_h2 = h2_with(section, 'Localização')
    location_p = next_tag(location_h2) if location_h2 else None
    map_section = section.select_one('.cond-mapa-section')
    market_h2 = h2_with(section, 'Mercado e Valorização')
    market_p = next_tag(market_h2) if market_h2 else None
    diff_h2 = h2_with(section, 'Diferenciais')
    diff_p = next_tag(diff_h2) if diff_h2 else None
    properties_h2 = h2_with(section, 'Imóveis à venda')
    properties_grid = next_tag(properties_h2) if properties_h2 else None
    followup = next((p for p in section.find_all('p') if p.get_text(strip=True).startswith('Explore outros')), None)

    new_section = BeautifulSoup('<section class="cond-conteudo-full cond-lagos-clean"></section>', 'html.parser').section

    title = soup.new_tag('h2', attrs={'class':'cond-lagos-section-title'}); title.string = 'Imagens do condomínio'; new_section.append(title)
    count = soup.new_tag('p', attrs={'class':'cond-lagos-gallery-count'}); count.string = 'Galeria de infraestrutura (20 fotos)'; new_section.append(count)

    gallery = soup.new_tag('div', attrs={'class':'cond-lagos-gallery', 'aria-label':'Galeria de infraestrutura'})
    prev = soup.new_tag('button', attrs={'class':'cond-lagos-gallery-arrow prev', 'type':'button', 'aria-label':'Foto anterior'}); prev.string = '‹'
    viewport = soup.new_tag('div', attrs={'class':'cond-lagos-gallery-viewport'})
    track = soup.new_tag('div', attrs={'class':'cond-lagos-gallery-track', 'id':'cond-lagos-gallery-track'})
    for i, source in enumerate(gallery_photos, 1):
        figure = soup.new_tag('figure', attrs={'class':'cond-lagos-gallery-item', 'tabindex':'0', 'role':'button', 'aria-label':f'Abrir foto {i} de {len(gallery_photos)}'})
        img = clone(source)
        img['alt'] = f'Atlântida Lagos Park — infraestrutura foto {i} — Xangri-Lá'
        img['loading'] = 'lazy'
        img['decoding'] = 'async'
        figure.append(img); track.append(figure)
    viewport.append(track)
    nxt = soup.new_tag('button', attrs={'class':'cond-lagos-gallery-arrow next', 'type':'button', 'aria-label':'Próxima foto'}); nxt.string = '›'
    gallery.extend([prev, viewport, nxt]); new_section.append(gallery)

    intro = soup.new_tag('section', attrs={'class':'cond-lagos-intro'}); h = soup.new_tag('h2'); h.string='Sobre o Atlântida Lagos Park'; p=soup.new_tag('p'); p.string=SUMMARY; intro.extend([h,p]); new_section.append(intro)
    availability = soup.new_tag('section', attrs={'class':'cond-lagos-availability-section'}); h=soup.new_tag('h2'); h.string='Disponibilidades'; availability.append(h)
    cards=soup.new_tag('div', attrs={'class':'cond-lagos-availability'}); card=soup.new_tag('div', attrs={'class':'cond-lagos-availability-card'}); label=soup.new_tag('div', attrs={'class':'cond-lagos-availability-label'}); label.string='Imóveis disponíveis'; value=soup.new_tag('div', attrs={'class':'cond-lagos-availability-value'}); value.string=str(available); card.extend([label,value]); cards.append(card); availability.append(cards); new_section.append(availability)
    infra=soup.new_tag('section', attrs={'class':'cond-lagos-infra'}); h=soup.new_tag('h2'); h.string='Infraestrutura e Amenidades'; p=soup.new_tag('p'); p.string=INFRA; infra.extend([h,p]); new_section.append(infra)

    for node in [location_h2, location_p, map_section, market_h2, market_p, diff_h2, diff_p, properties_h2, properties_grid, followup]:
        if node:
            new_section.append(clone(node))

    old_section = section
    old_section.replace_with(new_section)

    # Append page-specific carousel/lightbox assets once.
    if not soup.find('style', id='cond-lagos-clean-style'):
        soup.head.append(BeautifulSoup(STYLE, 'html.parser'))
    if not soup.find(id='cond-lagos-lightbox'):
        soup.body.append(BeautifulSoup(LIGHTBOX, 'html.parser'))
    if not soup.find('script', id='cond-lagos-gallery-script'):
        soup.body.append(BeautifulSoup(SCRIPT, 'html.parser'))

    PAGE.write_text(str(soup), encoding='utf-8')
    print(f'Página atualizada: {PAGE}')
    print(f'Fotos na capa: 1 | Fotos na galeria: {len(gallery_photos)} | Disponibilidades: {available}')


if __name__ == '__main__':
    main()
