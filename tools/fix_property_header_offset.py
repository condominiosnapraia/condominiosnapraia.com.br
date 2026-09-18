from pathlib import Path

path = Path('functions/corretor/[slug]/imovel/[imovelSlug].js')
text = path.read_text()
css = r'''
<style>
/* FIXED HEADER OFFSET — breadcrumb and property content stay below navigation */
.header{height:66px}.header .nav{height:66px}.header + .wrap{padding-top:92px}
@media(max-width:760px){.header{position:relative!important;height:auto}.header .nav{height:auto;min-height:58px}.header + .wrap{padding-top:16px}}
</style>
'''
if 'FIXED HEADER OFFSET' not in text:
    text = text.replace('</head>', css + '</head>', 1)
path.write_text(text)
print(path)
