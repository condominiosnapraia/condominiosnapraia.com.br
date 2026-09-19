from pathlib import Path

root=Path(__file__).resolve().parents[1]
(root/'img/parceiro-capa-desktop.jpg').write_bytes(Path('/tmp/cover-desktop-new').read_bytes())
(root/'img/parceiro-capa-mobile.jpg').write_bytes(Path('/tmp/cover-mobile-new').read_bytes())
files=[root/'functions/parceiro/[slug].js',root/'functions/parceiro-feed/[slug].js']
replacements={
"  const cover = site.capa_url || `${BASE}/img/parceiro-capa-padrao.webp`;\n  const profileImage = isRodrigo ? `${BASE}/img/corretores/rodrigo-carvalho-perfil.jpeg` : (site.logo_url || '');\n  const heroStyle = cover ? ` style=\"background-image:url('${esc(cover)}')\"` : '';":
"  const cover = site.capa_url || `${BASE}/img/parceiro-capa-desktop.jpg`;\n  const mobileCover = `${BASE}/img/parceiro-capa-mobile.jpg`;\n  const profileImage = isRodrigo ? `${BASE}/img/corretores/rodrigo-carvalho-perfil.jpeg` : (site.logo_url || '');\n  const heroStyle = cover ? ` style=\"background-image:url('${esc(cover)}');--partner-cover-mobile:url('${esc(mobileCover)}')\"` : '';",
"  const cover = site.capa_url || `${BASE}/img/parceiro-capa-padrao.webp`;\n  const heroStyle = cover ? ` style=\"background-image:url('${esc(cover)}')\"` : '';":
"  const cover = site.capa_url || `${BASE}/img/parceiro-capa-desktop.jpg`;\n  const mobileCover = `${BASE}/img/parceiro-capa-mobile.jpg`;\n  const heroStyle = cover ? ` style=\"background-image:url('${esc(cover)}');--partner-cover-mobile:url('${esc(mobileCover)}')\"` : '';",
}
css='''
<style id="partner-cover-responsive">
@media(max-width:760px){.partner-hero{background-image:var(--partner-cover-mobile)!important;background-position:center center!important}}
</style>
'''
for p in files:
    t=p.read_text()
    changed=False
    for old,new in replacements.items():
        if old in t:
            t=t.replace(old,new,1); changed=True; break
    if not changed and 'parceiro-capa-desktop.jpg' not in t:
        raise SystemExit(f'bloco da capa não encontrado em {p}')
    if 'partner-cover-responsive' not in t: t=t.replace('</head>',css+'</head>',1)
    p.write_text(t)
    print(p)
