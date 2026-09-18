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
    if 'footer-quick-title' in text and 'Acesso rápido' in text and '<div class="footer-title">Acesso rápido</div>' not in text:
        def repl(m):
            return '</div><div class="footer-col"><div class="footer-title">Acesso rápido</div>' + m.group(1) + '</div><div class="footer-col"><div class="footer-title">Informações</div>'
        text, count = pattern.subn(repl, text, count=1)
        if count != 1:
            raise SystemExit(f'could not split quick column: {path}')
    if path.name == '[slug].js' and path.parent.name == 'parceiro-feed' and '<div class="footer-title">Acesso rápido</div>' not in text:
        marker = '<div class="footer-col"><div class="footer-title">Informações</div>'
        quick = '<div class="footer-col"><div class="footer-title">Acesso rápido</div><div class="footer-quick-links"><a href="${fullListingUrl}?cat=casa-condominio">Casas e sobrados</a><a href="${fullListingUrl}?cat=terreno-condominio">Lotes e terrenos</a><a href="${fullListingUrl}?cat=apartamento">Apartamentos</a></div></div>'
        if marker not in text:
            raise SystemExit(f'feed info marker not found: {path}')
        text = text.replace(marker, quick + marker, 1)
    path.write_text(text)
    print(path)
