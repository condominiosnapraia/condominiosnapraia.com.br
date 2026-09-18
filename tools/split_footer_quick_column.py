from pathlib import Path
import re

files = [
    Path('functions/parceiro/[slug].js'),
    Path('functions/parceiro-feed/[slug].js'),
    Path('functions/parceiro/[slug]/imoveis.js'),
    Path('functions/parceiro/[slug]/condominios.js'),
    Path('functions/parceiro/[slug]/condominio/[condoSlug].js'),
    Path('functions/corretor/[slug]/imovel/[imovelSlug].js'),
]
pattern = re.compile(r'<div class="footer-title footer-quick-title">Acesso rápido</div>(<div class="footer-quick-links">.*?</div>)</div><div class="footer-col"><div class="footer-title">Informações</div>', re.S)
for path in files:
    text = path.read_text()
    if 'footer-quick-title' not in text:
        continue
    def repl(match):
        links = match.group(1)
        return '</div><div class="footer-col"><div class="footer-title">Acesso rápido</div>' + links + '</div><div class="footer-col"><div class="footer-title">Informações</div>'
    text2, count = pattern.subn(repl, text, count=1)
    if count != 1:
        raise SystemExit(f'could not split quick column: {path}')
    path.write_text(text2)
    print(path)
