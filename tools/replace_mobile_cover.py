from pathlib import Path

root=Path(__file__).resolve().parents[1]
(root/'img/parceiro-capa-mobile.jpg').write_bytes(Path('/tmp/cover-mobile-replacement').read_bytes())
for p in [root/'functions/parceiro/[slug].js',root/'functions/parceiro-feed/[slug].js']:
    t=p.read_text().replace('background-position:center 30%!important','background-position:left center!important')
    p.write_text(t)
print(root/'img/parceiro-capa-mobile.jpg')
