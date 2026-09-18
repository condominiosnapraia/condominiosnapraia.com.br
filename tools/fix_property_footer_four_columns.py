from pathlib import Path
import re

path = Path('functions/corretor/[slug]/imovel/[imovelSlug].js')
text = path.read_text()
pattern = re.compile(r'<div class="footer-title footer-quick-title">Acesso rápido</div>(<div class="footer-quick-links">.*?</div>)</div><div class="footer-col"><div class="footer-title">Informações</div>', re.S)
if '<div class="footer-title">Acesso rápido</div>' not in text:
    def repl(m):
        return '</div><div class="footer-col"><div class="footer-title">Acesso rápido</div>' + m.group(1) + '</div><div class="footer-col"><div class="footer-title">Informações</div>'
    text, count = pattern.subn(repl, text, count=1)
    if count != 1:
        raise SystemExit('could not separate property quick access column')
css = r'''
<style>
/* PROPERTY FOOTER: four desktop columns */
.footer-grid{grid-template-columns:minmax(230px,1.3fr) minmax(165px,1fr) minmax(165px,1fr) minmax(175px,.95fr)!important;gap:32px!important}
.footer-grid .footer-col{min-width:0}
@media(max-width:760px){.footer-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.footer-grid>div:first-child{grid-column:1/-1}}
@media(max-width:520px){.footer-grid{grid-template-columns:1fr!important}.footer-grid>div:first-child{grid-column:auto}}
</style>
'''
if 'PROPERTY FOOTER: four desktop columns' not in text:
    text = text.replace('</head>', css + '</head>', 1)
path.write_text(text)
print(path)
