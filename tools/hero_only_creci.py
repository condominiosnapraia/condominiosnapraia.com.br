from pathlib import Path

files=[Path('functions/parceiro/[slug].js'),Path('functions/parceiro-feed/[slug].js')]
old="<div class=\"hero-broker-meta\">${site.creci ? `CRECI ${esc(site.creci)} · ` : ''}Atendimento personalizado</div>"
new="<div class=\"hero-broker-meta\">${site.creci ? `CRECI ${esc(site.creci)}` : ''}</div>"
for p in files:
    t=p.read_text()
    if old not in t:
        raise SystemExit(f'trecho não encontrado em {p}')
    p.write_text(t.replace(old,new,1))
    print(p)
