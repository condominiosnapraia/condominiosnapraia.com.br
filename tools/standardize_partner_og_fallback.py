from pathlib import Path

files=[Path('functions/parceiro/[slug].js'),Path('functions/parceiro-feed/[slug].js')]
known="const ogSlugs = new Set(['cassio-lopes','felipe-ranzolin','fernando-trevisol','jeferson-gimenez','juliano-machado','marcelo-bereta','marcia-anzolin','marcos-selbach','rodrigo-carvalho']);"
for p in files:
    t=p.read_text()
    if 'const ogSlugs = new Set' not in t:
        anchor='  const fullListingUrl = `${BASE}/${segment}/${encodeURIComponent(slug)}/imoveis/`;'
        if anchor not in t: raise SystemExit(f'anchor não encontrado em {p}')
        t=t.replace(anchor, anchor+'\n  '+known+'\n  const ogSlug = ogSlugs.has(slug) ? slug : \'parceiro-padrao\';',1)
    t=t.replace('${encodeURIComponent(slug)}.jpg', '${encodeURIComponent(ogSlug)}.jpg')
    p.write_text(t)
    print(p)
