from pathlib import Path

files=[Path('functions/parceiro/[slug].js'),Path('functions/parceiro-feed/[slug].js')]
css='''
<style id="partner-mobile-hero-scale">
@media(max-width:760px){
  .partner-hero .hero-broker-photo-wrap{width:min(40vw,145px)!important;height:min(50vw,185px)!important;margin-bottom:14px!important;padding:5px!important;border-radius:18px!important}
  .partner-hero .hero-broker-photo-wrap:after{inset:5px!important;border-radius:13px!important}
  .partner-hero .hero-broker-photo,.partner-hero .hero-broker-photo-empty{border-radius:13px!important}
  .partner-hero .hero-broker-name{font-size:clamp(21px,7.2vw,34px)!important;line-height:1.06!important;margin-top:8px!important}
  .partner-hero .hero-broker-meta{font-size:9px!important;letter-spacing:.1em!important;margin-top:6px!important}
  .partner-hero .hero-kicker{font-size:9px!important;letter-spacing:.16em!important}
  .partner-hero .hero-title-clean{font-size:clamp(17px,5.7vw,25px)!important;line-height:1.12!important;max-width:270px!important;gap:4px!important;margin-top:8px!important}
}
</style>
'''
for p in files:
    t=p.read_text()
    if 'partner-mobile-hero-scale' not in t:
        t=t.replace('</head>',css+'</head>',1)
    p.write_text(t)
    print(p)
