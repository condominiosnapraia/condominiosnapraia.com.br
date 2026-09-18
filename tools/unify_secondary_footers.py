from pathlib import Path

files = [
    Path('functions/parceiro/[slug]/imoveis.js'),
    Path('functions/parceiro/[slug]/condominios.js'),
    Path('functions/parceiro/[slug]/condominio/[condoSlug].js'),
    Path('functions/corretor/[slug]/contato.js'),
    Path('functions/corretor/[slug]/imovel/[imovelSlug].js'),
]
css = r'''
<style>
/* SHARED HERO-MATCHING FOOTER FOR ALL PARTNER SECONDARY PAGES */
footer,.footer{position:relative;overflow:hidden;background:linear-gradient(135deg,#0d303a 0%,#123f4a 52%,#1a5960 100%)!important;border-top:1px solid rgba(229,184,120,.75)!important;color:#fff!important}
footer:before,.footer:before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 12% 10%,rgba(229,184,120,.14),transparent 32%),linear-gradient(90deg,transparent,rgba(255,255,255,.025))}
.footer-inner,.footer-main,.footer-rich,.footer-grid,.footer-bottom{position:relative;z-index:1}
.footer-inner,.footer-main,.footer-rich{width:min(1180px,100%);margin:0 auto}
.footer-grid{display:grid!important;grid-template-columns:minmax(280px,1.35fr) minmax(220px,1fr) minmax(220px,.95fr)!important;gap:42px!important;align-items:start}
.footer-rich{display:grid!important;grid-template-columns:minmax(280px,1.35fr) minmax(220px,1fr) minmax(220px,.95fr)!important;gap:42px!important}
.footer-brand,.footer-logo{font-family:Fraunces,serif!important;font-weight:500!important;color:#fff!important;font-size:28px!important;line-height:1.05!important}
.footer-title,.footer-quick>strong{color:#e5b878!important;font-size:10px!important;letter-spacing:.19em!important;text-transform:uppercase!important}
.footer-col,.footer-quick{display:flex;flex-direction:column;align-items:flex-start;gap:9px;min-width:0}
.footer-col a,.footer-col span,.footer-quick a,.footer-quick span{display:block;width:100%;color:rgba(255,255,255,.78)!important;font-size:12px;line-height:1.45}
.footer-copy,.footer-text,.footer-rich small{display:block;color:rgba(255,255,255,.7)!important;font-size:13px;line-height:1.6;max-width:340px}
.footer-wpp{display:inline-flex!important;width:auto!important;align-items:center;justify-content:center;min-height:40px;padding:10px 18px;border-radius:8px;background:#25d366!important;color:#fff!important;font-weight:700;box-shadow:0 10px 22px rgba(0,0,0,.18)}
.footer-quick-title{margin-top:20px!important}.footer-quick-links{display:flex!important;flex-direction:column;gap:9px;width:100%}
.footer-bottom{display:flex!important;align-items:center;justify-content:space-between;gap:20px;margin-top:28px!important;padding-top:18px;border-top:1px solid rgba(255,255,255,.14);color:rgba(255,255,255,.62)!important;font-size:11px;line-height:1.4}
.footer-bottom span{color:rgba(255,255,255,.62)!important}
@media(max-width:900px){.footer-grid,.footer-rich{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:30px 24px!important}.footer-grid>div:first-child,.footer-rich>div:first-child{grid-column:1/-1}}
@media(max-width:600px){footer,.footer{padding:38px 18px 92px!important}.footer-inner,.footer-main,.footer-rich{display:block!important}.footer-grid,.footer-rich{display:grid!important;grid-template-columns:1fr!important;gap:26px!important}.footer-grid>div:first-child,.footer-rich>div:first-child{grid-column:auto}.footer-bottom{display:flex!important;flex-direction:column;align-items:flex-start;gap:7px}.footer-wpp{width:100%!important}}
</style>
'''
for path in files:
    text = path.read_text()
    if 'SHARED HERO-MATCHING FOOTER FOR ALL PARTNER SECONDARY PAGES' in text:
        continue
    if '</head>' not in text:
        raise SystemExit(f'head not found: {path}')
    path.write_text(text.replace('</head>', css + '</head>', 1))
    print(path)
