from pathlib import Path

path = Path('functions/corretor/[slug]/imovel/[imovelSlug].js')
text = path.read_text()
css = r'''
<style>
/* TRANSPARENT HEADER IN FLOW — never overlays back link or breadcrumbs */
.header{position:sticky!important;top:0!important;height:auto!important;min-height:66px!important;background:rgba(6,28,38,.86)!important;backdrop-filter:blur(14px)!important;z-index:30!important}
.header .nav{height:66px!important;min-height:66px!important}.header + .wrap{padding-top:22px!important}
.crumb,.back-link,.crumb-path{position:relative;z-index:1}
@media(max-width:760px){.header{position:relative!important;min-height:0!important;background:rgba(6,28,38,.96)!important}.header .nav{height:auto!important;min-height:58px!important}.header + .wrap{padding-top:16px!important}}
</style>
'''
if 'TRANSPARENT HEADER IN FLOW' not in text:
    text = text.replace('</head>', css + '</head>', 1)
path.write_text(text)
print(path)
