from pathlib import Path

files=[Path('functions/parceiro/[slug].js'),Path('functions/parceiro-feed/[slug].js')]
css='''
<style id="partner-mobile-card-title-scale">
@media(max-width:760px){
  .property-card .property-body h3{font-size:15px!important;line-height:1.14!important;letter-spacing:-.015em!important}
  .property-card .property-body{padding:13px 12px!important}
  .condo-card .condo-body h3{font-size:15px!important;line-height:1.14!important;letter-spacing:-.015em!important}
}
</style>
'''
for p in files:
    t=p.read_text()
    if 'partner-mobile-card-title-scale' not in t:
        t=t.replace('</head>',css+'</head>',1)
    p.write_text(t)
    print(p)
