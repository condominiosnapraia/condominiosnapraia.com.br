from pathlib import Path

files=[Path('functions/parceiro/[slug].js'),Path('functions/parceiro-feed/[slug].js')]
css='''
<style id="partner-cover-force-visible">
.partner-hero{background-image:var(--partner-cover-desktop)!important;background-color:#173a46!important;background-size:cover!important;background-repeat:no-repeat!important}
@media(max-width:760px){.partner-hero{background-image:var(--partner-cover-mobile)!important;background-position:left center!important}}
</style>
'''
for p in files:
    t=p.read_text()
    t=t.replace("--partner-cover-mobile:url('${esc(mobileCover)}')", "--partner-cover-desktop:url('${esc(cover)}');--partner-cover-mobile:url('${esc(mobileCover)}')", 1)
    if 'partner-cover-force-visible' not in t:
        t=t.replace('</head>',css+'</head>',1)
    p.write_text(t)
    print(p)
