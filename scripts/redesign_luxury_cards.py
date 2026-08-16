from pathlib import Path
import re

PAGE = Path('/home/ubuntu/wt_supabase_queries/imoveis-de-luxo/index.html')

CSS = r'''
/* Redesign premium dos cards da vitrine de luxo */
#grid-luxo.igrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;align-items:stretch}
#grid-luxo .luxo-property-card{display:flex!important;flex-direction:column!important;min-width:0;min-height:0;background:#fff;border:1px solid #e2e8e6;border-radius:20px;overflow:hidden;box-shadow:0 8px 22px rgba(13,59,84,.07);transition:transform .24s ease,box-shadow .24s ease,border-color .24s ease}
#grid-luxo .luxo-property-card:hover{transform:translateY(-5px);border-color:#caa04c;box-shadow:0 18px 38px rgba(13,59,84,.14)}
#grid-luxo .luxo-card-media{position:relative;aspect-ratio:4/3;overflow:hidden;background:linear-gradient(135deg,#dfe9e7,#f6f1e8)}
#grid-luxo .luxo-card-media img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
#grid-luxo .luxo-property-card:hover .luxo-card-media img{transform:scale(1.035)}
#grid-luxo .luxo-card-media::after{content:'';position:absolute;inset:42% 0 0;background:linear-gradient(180deg,transparent,rgba(6,37,53,.42));pointer-events:none}
#grid-luxo .luxo-card-status,#grid-luxo .luxo-card-code,#grid-luxo .luxo-card-premium{position:absolute;z-index:2;border-radius:999px;line-height:1;white-space:nowrap}
#grid-luxo .luxo-card-status{top:14px;left:14px;padding:8px 10px;background:#f5f1e8;color:#7a5a22;font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}
#grid-luxo .luxo-card-code{top:14px;right:14px;padding:8px 10px;background:rgba(7,43,61,.78);color:#fff;font-size:10px;font-weight:700;letter-spacing:.1em}
#grid-luxo .luxo-card-premium{bottom:14px;left:14px;padding:7px 10px;background:rgba(255,255,255,.92);color:#0d3b54;font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
#grid-luxo .luxo-card-content{display:flex;flex:1;flex-direction:column;padding:18px 18px 14px;min-width:0}
#grid-luxo .luxo-card-type{margin-bottom:8px;color:#b4862c;font-size:10px;font-weight:800;letter-spacing:.16em;text-transform:uppercase}
#grid-luxo .luxo-card-title{display:-webkit-box;overflow:hidden;margin:0;min-height:3.1em;color:#0d3b54;font-family:'Fraunces',serif;font-size:20px;font-weight:600;line-height:1.28;letter-spacing:-.01em;-webkit-box-orient:vertical;-webkit-line-clamp:2}
#grid-luxo .luxo-card-specs{display:flex;flex-wrap:wrap;gap:7px;margin-top:16px;padding-top:13px;border-top:1px solid #edf0ed;color:#617681;font-size:12px}
#grid-luxo .luxo-card-spec{display:inline-flex;align-items:center;padding:6px 8px;border-radius:7px;background:#f5f8f6;white-space:nowrap}
#grid-luxo .luxo-card-bottom{display:flex;align-items:flex-end;justify-content:space-between;gap:14px;padding:14px 18px 18px;border-top:1px solid #edf0ed}
#grid-luxo .luxo-card-price-label{display:block;margin-bottom:4px;color:#83939a;font-size:9px;font-weight:700;letter-spacing:.13em;text-transform:uppercase}
#grid-luxo .luxo-card-price{display:block;color:#0d3b54;font-family:'Fraunces',serif;font-size:23px;font-weight:600;line-height:1;white-space:nowrap}
#grid-luxo .luxo-card-cta{display:inline-flex;align-items:center;gap:6px;padding:10px 12px;border-radius:999px;background:#0d3b54;color:#fff;font-size:11px;font-weight:700;white-space:nowrap;transition:background .2s,transform .2s}
#grid-luxo .luxo-property-card:hover .luxo-card-cta{background:#b4862c;transform:translateX(2px)}
@media(max-width:980px){#grid-luxo.igrid{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}}
@media(max-width:560px){#grid-luxo.igrid{grid-template-columns:1fr;gap:14px}#grid-luxo .luxo-card-media{aspect-ratio:16/10}#grid-luxo .luxo-card-content{padding:16px 16px 12px}#grid-luxo .luxo-card-title{font-size:19px}#grid-luxo .luxo-card-bottom{padding:13px 16px 16px}#grid-luxo .luxo-card-price{font-size:21px}}
'''

JS = r'''  function card(i){var raw=i.fotos_no_site||i.fotos||[];var fotos=Array.isArray(raw)?raw:[raw];var foto=fotos.find(function(f){return f&&(String(f).indexOf('http')===0||String(f).indexOf('/cdn-fotos/')===0||String(f).indexOf('data:')===0);});var specs=[i.quartos?('🛏 '+i.quartos+' quartos'):null,i.suites?('🛁 '+i.suites+' suítes'):null,(i.area||i.area_privativa||i.area_construida)?('📐 '+(i.area||i.area_privativa||i.area_construida)+' m²'):null,i.vagas?('🚗 '+i.vagas+' vagas'):null].filter(Boolean).map(function(s){return '<span class="luxo-card-spec">'+esc(s)+'</span>';}).join('');return '<a class="luxo-property-card" href="'+href(i)+'" style="text-decoration:none;color:inherit"><div class="luxo-card-media">'+(foto?fotoTag(foto,i.titulo||'Imóvel de luxo'):'<span aria-hidden="true" style="display:grid;place-items:center;height:100%;font-size:42px">🏡</span>')+'<span class="luxo-card-status">Disponível</span>'+(i.codigo?'<span class="luxo-card-code">'+esc(i.codigo)+'</span>':'')+'<span class="luxo-card-premium">Alto padrão</span></div><div class="luxo-card-content"><div class="luxo-card-type">'+esc(i.tipo||'Imóvel exclusivo')+'</div><h3 class="luxo-card-title">'+esc(i.titulo||'Imóvel exclusivo no Litoral Norte')+'</h3><div class="luxo-card-specs">'+specs+'</div></div><div class="luxo-card-bottom"><div><span class="luxo-card-price-label">Valor de venda</span><strong class="luxo-card-price">'+brl(i.preco)+'</strong></div><span class="luxo-card-cta">Ver imóvel <span aria-hidden="true">→</span></span></div></a>;}'''

text = PAGE.read_text(encoding='utf-8')
if 'Redesign premium dos cards da vitrine de luxo' not in text:
    text = text.replace('</style>', CSS + '</style>', 1)
text, count = re.subn(r'  function card\(i\)\{.*?\n  function baseElegivel', JS + '\n  function baseElegivel', text, count=1, flags=re.S)
if count != 1:
    raise SystemExit(f'card function replacement count={count}')
PAGE.write_text(text, encoding='utf-8')
print('luxury cards redesigned')
