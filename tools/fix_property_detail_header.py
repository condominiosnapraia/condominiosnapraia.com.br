from pathlib import Path

path = Path('functions/corretor/[slug]/imovel/[imovelSlug].js')
text = path.read_text()
old = '<div class="footer-col"><div class="footer-title">Informações</div>${site.email ? `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : \'\'}<a href="${BASE}/politica-privacidade/">Política de Privacidade</a>'
new = '<div class="footer-col"><div class="footer-title">Informações</div>${site.creci ? `<span class="footer-info-creci">CRECI ${esc(site.creci)}</span>` : \'\'}${site.email ? `<a href="mailto:${esc(site.email)}">${esc(site.email)}</a>` : \'\'}<a href="${BASE}/politica-privacidade/">Política de Privacidade</a>'
if old not in text:
    raise SystemExit('information markup not found')
text = text.replace(old, new, 1)
css = r'''
<style>
/* PROPERTY DETAIL HEADER ALIGNMENT */
.header .nav{min-height:66px;justify-content:flex-end}.header .nav-actions{margin-left:auto;display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-wrap:nowrap}.header .nav-link,.header .nav-cta{white-space:nowrap}.wrap{padding-top:22px}.crumb{position:relative;z-index:1;clear:both}.footer-info-creci{color:#e5b878!important;font-weight:700;letter-spacing:.04em}
@media(max-width:760px){.header{position:relative}.header .nav{min-height:58px;padding:10px 14px}.header .nav-actions{width:100%;justify-content:space-between;gap:5px}.header .nav-link{font-size:10px;padding:8px 5px}.header .nav-cta{font-size:10px;padding:9px 11px}.wrap{padding-top:16px}.crumb{gap:7px}.back-link{font-size:15px}}
</style>
'''
if 'PROPERTY DETAIL HEADER ALIGNMENT' not in text:
    text = text.replace('</head>', css + '</head>', 1)
path.write_text(text)
print(path)
