from pathlib import Path

files=[Path('functions/parceiro/[slug].js'),Path('functions/parceiro-feed/[slug].js')]
css='''
<style id="partner-mobile-cover-focus">
@media(max-width:760px){
  .partner-hero{background-position:center 30%!important}
  .partner-hero .hero-broker-meta{text-align:center!important;margin-left:auto!important;margin-right:auto!important;width:100%!important}
}
</style>
'''
for p in files:
    t=p.read_text()
    if 'partner-mobile-cover-focus' not in t:
        t=t.replace('</head>',css+'</head>',1)
    p.write_text(t)
    print(p)
