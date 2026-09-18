from pathlib import Path

path = Path('functions/corretor/[slug]/imovel/[imovelSlug].js')
text = path.read_text()
css = r'''
<style>
/* LONG PROPERTY TITLES — controlled editorial scale */
.hero-info{max-width:780px}.hero-info h1{max-width:700px;font-size:clamp(29px,3.2vw,39px);line-height:1.1;letter-spacing:-.028em;margin-top:7px}.hero-info .location{margin-top:7px;font-size:12px}
@media(max-width:850px){.hero-info{max-width:100%}.hero-info h1{max-width:650px;font-size:33px}}
@media(max-width:620px){.hero-info h1{font-size:29px;line-height:1.08}}
</style>
'''
if 'LONG PROPERTY TITLES' not in text:
    text = text.replace('</head>', css + '</head>', 1)
path.write_text(text)
print(path)
