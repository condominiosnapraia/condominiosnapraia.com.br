from pathlib import Path

files=[Path('functions/parceiro/[slug].js'),Path('functions/parceiro-feed/[slug].js')]
css='''
<style id="partner-mobile-dock-fix">
.mobile-dock{display:none}
@media(max-width:760px){
  body{padding-bottom:92px!important;overflow-x:hidden}
  .footer{padding-bottom:108px!important}
  .mobile-dock{position:fixed!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;left:12px;right:12px;bottom:12px;z-index:1000;padding:8px;border:1px solid rgba(255,255,255,.22);border-radius:22px;background:rgba(7,35,48,.96);box-shadow:0 14px 40px rgba(0,0,0,.28);backdrop-filter:blur(16px);box-sizing:border-box}
  .mobile-dock a{display:flex!important;min-height:48px;align-items:center;justify-content:center;gap:6px;border:1px solid rgba(255,255,255,.22);border-radius:15px;color:#fff!important;font:700 11px/1 Outfit,Arial,sans-serif;text-decoration:none;text-align:center;white-space:nowrap}
  .mobile-dock a:first-child{background:#f4bf61;border-color:#f4bf61;color:#173743!important}
  .mobile-dock-icon{display:inline-grid!important;place-items:center;width:17px;height:17px;font-size:15px;line-height:1}
}
</style>
'''
for p in files:
    t=p.read_text()
    if 'partner-mobile-dock-fix' not in t:
        t=t.replace('</head>',css+'</head>',1)
    p.write_text(t)
    print(p)
