from pathlib import Path

files = [Path('functions/parceiro/[slug].js'), Path('functions/parceiro-feed/[slug].js')]
css = r'''
<style>
/* FOOTER ALIGNMENT + CONTACT DATA FORMAT */
footer{position:relative;overflow:hidden}
.footer-main{align-items:start;grid-template-columns:minmax(250px,1.35fr) minmax(190px,1fr) minmax(190px,.9fr) minmax(180px,.9fr);gap:42px}
.footer-col{display:flex;flex-direction:column;align-items:flex-start;min-width:0;gap:9px}
.footer-col .footer-title{width:100%;margin:0 0 5px;line-height:1.2}
.footer-col a,.footer-col span{display:block;width:100%;line-height:1.45}
.footer-col span{color:rgba(255,255,255,.82);font-size:13px;white-space:normal}
.footer-col .footer-quick-title{margin-top:22px}
.footer-quick-links{display:flex;flex-direction:column;align-items:flex-start;gap:9px;width:100%}
.footer-wpp{display:inline-flex!important;width:auto!important;align-items:center;justify-content:center;min-height:40px;padding:10px 18px;border-radius:8px;background:#25d366;color:#fff!important;font-size:12px;font-weight:700;line-height:1.2!important}
.footer-bottom{display:flex;align-items:center;justify-content:space-between;gap:20px;width:min(1180px,100%);margin:28px auto 0;padding-top:18px;border-top:1px solid rgba(255,255,255,.14);line-height:1.4}
.footer-bottom span{display:block;color:rgba(255,255,255,.64);font-size:11px}
@media(max-width:900px){.footer-main{grid-template-columns:repeat(2,minmax(0,1fr));gap:30px 24px}.footer-main .footer-col:first-child{grid-column:1/-1}.footer-text{max-width:540px}}
@media(max-width:600px){footer{padding:38px 18px 92px}.footer-main{display:grid;grid-template-columns:1fr;gap:26px}.footer-main .footer-col:first-child{grid-column:auto}.footer-col{gap:8px}.footer-col .footer-quick-title{margin-top:16px}.footer-bottom{display:flex;flex-direction:column;align-items:flex-start;gap:7px;margin-top:28px;padding-top:16px}.footer-bottom span{font-size:10px}.footer-wpp{width:100%!important}.footer-col span,.footer-col a{font-size:12px}}
</style>
'''
for path in files:
    text = path.read_text()
    if 'FOOTER ALIGNMENT + CONTACT DATA FORMAT' in text:
        continue
    text = text.replace('</head>', css + '</head>', 1)
    path.write_text(text)
    print(path)
