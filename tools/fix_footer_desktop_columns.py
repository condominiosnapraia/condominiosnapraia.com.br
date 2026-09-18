from pathlib import Path

files = [
    Path('functions/parceiro/[slug].js'),
    Path('functions/parceiro-feed/[slug].js'),
    Path('functions/parceiro/[slug]/imoveis.js'),
    Path('functions/parceiro/[slug]/condominios.js'),
    Path('functions/parceiro/[slug]/condominio/[condoSlug].js'),
    Path('functions/corretor/[slug]/contato.js'),
    Path('functions/corretor/[slug]/imovel/[imovelSlug].js'),
]
replacements = {
    '@media(max-width:900px){.footer-main{grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 24px}.footer-main .footer-col:first-child{grid-column:1/-1}}':
    '@media(max-width:760px){.footer-main{grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 24px}.footer-main .footer-col:first-child{grid-column:1/-1}}',
    '@media(max-width:900px){.footer-grid,.footer-rich{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:30px 24px!important}.footer-grid>div:first-child,.footer-rich>div:first-child{grid-column:1/-1}}':
    '@media(max-width:760px){.footer-grid,.footer-rich{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:30px 24px!important}.footer-grid>div:first-child,.footer-rich>div:first-child{grid-column:1/-1}}',
}
for path in files:
    text = path.read_text()
    changed = False
    for old, new in replacements.items():
        if old in text:
            text = text.replace(old, new)
            changed = True
    if changed:
        path.write_text(text)
        print(path)
