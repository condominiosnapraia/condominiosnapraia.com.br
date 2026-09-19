from pathlib import Path

files=[Path('functions/parceiro/[slug].js'),Path('functions/parceiro-feed/[slug].js')]
css='''
<style id="partner-hero-photo-visible">
.partner-hero:after{display:none!important}
</style>
'''
for p in files:
    t=p.read_text()
    if 'partner-hero-photo-visible' not in t:
        t=t.replace('</head>',css+'</head>',1)
    p.write_text(t)
    print(p)
