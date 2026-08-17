from pathlib import Path
import shutil
import xml.etree.ElementTree as ET

root=Path('/home/ubuntu/wt_supabase_queries')
asset_dir=root/'img/mapas-condominios'; asset_dir.mkdir(parents=True,exist_ok=True)
source_dir=root/'assets/condo-maps/webp'
items=[
 {'slug':'vivendas-da-marina-osorio','name':'Vivendas da Marina','city':'Osório','asset':'39-Vivendasdamarina.webp','desc':'Página oficial do Vivendas da Marina em Osório, no Litoral Norte Gaúcho. Dados do empreendimento em atualização no Portal Meu Litoral.'},
 {'slug':'prime-beach-capao-da-canoa','name':'Prime Beach','city':'Capão da Canoa','asset':'50-PrimeBeach.webp','desc':'Página oficial do Prime Beach em Capão da Canoa, no Litoral Norte Gaúcho. Dados do empreendimento em atualização no Portal Meu Litoral.'},
]
css='''*{box-sizing:border-box}body{margin:0;background:#f7fafb;color:#173b50;font-family:Arial,Helvetica,sans-serif}a{color:inherit}.top{background:#0b4963;color:#fff;padding:18px 24px}.nav{max-width:1120px;margin:auto;display:flex;justify-content:space-between;align-items:center;gap:16px}.brand{font-family:Georgia,serif;font-size:23px}.links{display:flex;gap:18px;font-size:13px}.hero{background:linear-gradient(135deg,#0b4963,#167d8e);color:#fff;padding:72px 24px 80px}.wrap{max-width:1120px;margin:auto}.eyebrow{letter-spacing:.14em;text-transform:uppercase;font-size:11px;color:#b8dfcf}.hero h1{font-family:Georgia,serif;font-size:clamp(34px,6vw,62px);margin:12px 0}.hero p{max-width:720px;font-size:18px;line-height:1.65;color:#e4f3f4}.main{max-width:1000px;margin:-34px auto 60px;padding:0 22px;position:relative}.card{background:#fff;border-radius:18px;padding:28px;box-shadow:0 10px 32px rgba(13,59,84,.10);margin-bottom:22px}.card h2{font-family:Georgia,serif;color:#0d3b54;margin-top:0}.map{width:100%;height:auto;display:block;border-radius:12px;background:#f1f5f6}.note{font-size:13px;line-height:1.65;color:#5d7180}.footer{background:#0d3b54;color:#d8ebed;padding:36px 24px}.footer .wrap{display:flex;justify-content:space-between;gap:24px;flex-wrap:wrap}.footer strong{font-family:Georgia,serif;color:#fff;font-size:20px}'''
for x in items:
    d=root/x['slug']; d.mkdir(parents=True,exist_ok=True)
    src=source_dir/x['asset']; dst=asset_dir/x['asset']
    if src.exists(): shutil.copy2(src,dst)
    canonical=f'https://condominiosnapraia.com.br/{x["slug"]}/'
    html=f'''<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{x['name']} em {x['city']} | Portal Meu Litoral</title><meta name="description" content="{x['desc']}"><link rel="canonical" href="{canonical}"><meta property="og:type" content="website"><meta property="og:title" content="{x['name']} em {x['city']} | Portal Meu Litoral"><meta property="og:description" content="{x['desc']}"><meta property="og:url" content="{canonical}"><meta property="og:image" content="{canonical}img/mapas-condominios/{x['asset']}"><script type="application/ld+json">{{"@context":"https://schema.org","@type":"Residence","name":"{x['name']}","description":"{x['desc']}","address":{{"@type":"PostalAddress","addressLocality":"{x['city']}","addressRegion":"RS","addressCountry":"BR"}},"url":"{canonical}"}}</script><style>{css}</style></head><body><header class="top"><nav class="nav"><a class="brand" href="/">Portal Meu Litoral</a><div class="links"><a href="/condominios/">Condomínios</a><a href="/imoveis/">Imóveis</a><a href="/contato/">Contato</a></div></nav></header><section class="hero"><div class="wrap"><div class="eyebrow">Condomínio no Litoral Norte Gaúcho</div><h1>{x['name']}</h1><p>{x['desc']}</p></div></section><main class="main"><section class="card"><h2>Sobre o empreendimento</h2><p class="note">As informações editoriais, disponibilidade e infraestrutura deste empreendimento estão em fase de atualização no CRM. Consulte a nossa equipe para confirmar localização, condições e dados técnicos antes de tomar qualquer decisão.</p></section><section class="card" data-map-pdf-source="{x['asset']}"><h2>Mapa de implantação</h2><p class="note">Material visual fornecido para referência. A imagem não confirma quadra, lote, coordenadas ou disponibilidade comercial.</p><a href="/img/mapas-condominios/{x['asset']}" target="_blank" rel="noopener"><img class="map" src="/img/mapas-condominios/{x['asset']}" alt="Mapa de implantação de {x['name']} em {x['city']}" loading="lazy" decoding="async"></a></section><section class="card"><h2>Fale com um consultor</h2><p class="note">Solicite a ficha atualizada do empreendimento e confirme as informações disponíveis.</p><a href="/contato/" style="display:inline-block;background:#0e8794;color:#fff;border-radius:999px;padding:13px 20px;text-decoration:none">Entrar em contato</a></section></main><footer class="footer"><div class="wrap"><div><strong>Portal Meu Litoral</strong><p>Condomínios e imóveis do Litoral Norte Gaúcho.</p></div><div><a href="/condominios/">Ver condomínios</a><br><a href="/imoveis/">Ver imóveis</a></div></div></footer></body></html>'''
    (d/'index.html').write_text(html,encoding='utf-8')
# Add canonical URLs to sitemap.xml only when absent.
sitemap=root/'sitemap.xml'
if sitemap.exists():
    text=sitemap.read_text(encoding='utf-8')
    for x in items:
        url=f'https://condominiosnapraia.com.br/{x["slug"]}/'
        if url not in text:
            pos=text.rfind('</urlset>')
            block=f'  <url><loc>{url}</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n'
            text=text[:pos]+block+text[pos:]
    sitemap.write_text(text,encoding='utf-8')
print('created=',','.join(x['slug'] for x in items))
