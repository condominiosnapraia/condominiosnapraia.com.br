from pathlib import Path
import html, json, re

PAGE = Path('/home/ubuntu/wt_supabase_queries/imoveis-de-luxo/index.html')
text = PAGE.read_text(encoding='utf-8')
match = re.search(r'var FALLBACK=(\[.*?\]);', text, re.S)
if not match:
    raise SystemExit('FALLBACK not found')
items = json.loads(match.group(1))

def esc(value):
    return html.escape(str(value or ''), quote=True)

def brl(value):
    value = float(value or 0)
    return 'R$ ' + f'{value:,.0f}'.replace(',', 'X').replace('.', ',').replace('X', '.')

def card(item):
    foto = (item.get('fotos_no_site') or item.get('fotos') or [''])[0]
    specs = []
    if item.get('quartos'): specs.append(f'🛏 {item["quartos"]} quartos')
    if item.get('suites'): specs.append(f'🛁 {item["suites"]} suítes')
    if item.get('area') or item.get('area_privativa') or item.get('area_construida'):
        specs.append(f'📐 {item.get("area") or item.get("area_privativa") or item.get("area_construida")} m²')
    if item.get('vagas'): specs.append(f'🚗 {item["vagas"]} vagas')
    specs_html = ''.join(f'<span class="luxo-card-spec">{esc(s)}</span>' for s in specs)
    title = esc(item.get('titulo') or 'Imóvel exclusivo no Litoral Norte')
    slug = esc(item.get('slug') or '')
    image = f'<img src="{esc(foto)}" alt="{title}" loading="lazy" decoding="async" width="640" height="480">' if foto else '<span aria-hidden="true" style="display:grid;place-items:center;height:100%;font-size:42px">🏡</span>'
    return f'<a class="luxo-property-card" href="/{slug}/" style="text-decoration:none;color:inherit"><div class="luxo-card-media">{image}<span class="luxo-card-status">Disponível</span><span class="luxo-card-code">{esc(item.get("codigo"))}</span><span class="luxo-card-premium">Alto padrão</span></div><div class="luxo-card-content"><div class="luxo-card-type">{esc(item.get("tipo") or "Imóvel exclusivo")}</div><h3 class="luxo-card-title">{title}</h3><div class="luxo-card-specs">{specs_html}</div></div><div class="luxo-card-bottom"><div><span class="luxo-card-price-label">Valor de venda</span><strong class="luxo-card-price">{brl(item.get("preco"))}</strong></div><span class="luxo-card-cta">Ver imóvel <span aria-hidden="true">→</span></span></div></a>'

markup = '<div class="luxo-fallback-grid" aria-label="Imóveis de luxo em destaque">' + ''.join(card(i) for i in items) + '</div>'
old = '<div class="igrid" id="grid-luxo" style="min-height:0"><div class="empty" style="grid-column:1/-1"><div class="empty-ico">✨</div><p>Carregando imóveis...</p></div></div>'
new = '<div class="igrid" id="grid-luxo" style="min-height:0">' + markup + '</div>'
if old not in text:
    raise SystemExit('grid placeholder not found')
text = text.replace(old, new, 1)
css = r'''\n#grid-luxo .luxo-fallback-grid{display:contents}\n#grid-luxo .luxo-fallback-grid .luxo-property-card{display:flex}\n'''
if '.luxo-fallback-grid' not in text:
    text = text.replace('</style>', css + '</style>', 1)
text = text.replace('Carregando opções...</p>', 'Selecione os filtros desejados.</p>', 1)
PAGE.write_text(text, encoding='utf-8')
print(f'seeded {len(items)} fallback cards')
