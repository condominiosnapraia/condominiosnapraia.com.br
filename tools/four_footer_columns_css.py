from pathlib import Path

files = [
    Path('functions/parceiro/[slug].js'),
    Path('functions/parceiro-feed/[slug].js'),
    Path('functions/parceiro/[slug]/imoveis.js'),
    Path('functions/parceiro/[slug]/condominios.js'),
    Path('functions/parceiro/[slug]/condominio/[condoSlug].js'),
    Path('functions/corretor/[slug]/imovel/[imovelSlug].js'),
]
css = '''<style>/* FOUR FOOTER COLUMNS: identity, navigation, quick access, information */
.footer-main,.footer-grid,.footer-rich{grid-template-columns:minmax(240px,1.35fr) minmax(170px,1fr) minmax(170px,1fr) minmax(180px,.95fr)!important}
@media(max-width:760px){.footer-main,.footer-grid,.footer-rich{grid-template-columns:repeat(2,minmax(0,1fr))!important}.footer-main .footer-col:first-child,.footer-grid>div:first-child,.footer-rich>div:first-child{grid-column:1/-1}}
@media(max-width:520px){.footer-main,.footer-grid,.footer-rich{grid-template-columns:1fr!important}.footer-main .footer-col:first-child,.footer-grid>div:first-child,.footer-rich>div:first-child{grid-column:auto}}
</style>'''
for path in files:
    text = path.read_text()
    if 'FOUR FOOTER COLUMNS:' in text:
        continue
    text = text.replace('</head>', css + '</head>', 1)
    path.write_text(text)
    print(path)
