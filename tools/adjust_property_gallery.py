from pathlib import Path

path = Path('functions/corretor/[slug]/imovel/[imovelSlug].js')
text = path.read_text()
css = r'''
<style>
/* PROPERTY PHOTO SCALE — preserve desktop image quality */
.photo-gallery{height:min(42vw,560px);max-height:560px;border-radius:18px}
.photo-slide img{object-fit:cover;image-rendering:auto}
.gallery-arrow{width:52px;height:52px;font-size:36px}
@media(max-width:850px){.photo-gallery{height:min(68vw,520px);max-height:none;border-radius:0}}
@media(max-width:520px){.photo-gallery{height:min(78vw,420px)}}
</style>
'''
if 'PROPERTY PHOTO SCALE' not in text:
    text = text.replace('</head>', css + '</head>', 1)
path.write_text(text)
print(path)
