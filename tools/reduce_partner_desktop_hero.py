from pathlib import Path

files=[Path('functions/parceiro/[slug].js'),Path('functions/parceiro-feed/[slug].js')]
css='''
<style id="partner-desktop-hero-scale">
@media(min-width:761px){
  .partner-hero .hero-broker-photo-wrap{width:min(100%,260px)!important;height:325px!important}
  .partner-hero .hero-broker-name{font-size:clamp(29px,3.5vw,48px)!important;line-height:1.04!important}
}
</style>
'''
for p in files:
    t=p.read_text()
    if 'partner-desktop-hero-scale' not in t:
        t=t.replace('</head>',css+'</head>',1)
    p.write_text(t)
    print(p)
