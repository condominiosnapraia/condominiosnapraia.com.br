from pathlib import Path

root=Path(__file__).resolve().parents[1]
source=Path('/tmp/cover-mobile-replacement')
for name in ['parceiro-capa-desktop.jpg','parceiro-capa-mobile.jpg']:
    (root/'img'/name).write_bytes(source.read_bytes())
for p in [root/'functions/parceiro/[slug].js',root/'functions/parceiro-feed/[slug].js']:
    t=p.read_text().replace('background-position:center 30%!important','background-position:left center!important')
    p.write_text(t)
print('capas atualizadas:', source)
