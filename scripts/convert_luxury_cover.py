from pathlib import Path
from PIL import Image

src = Path('/home/ubuntu/wt_supabase_queries/img/luxo/capa-luxo-lago-palmeiras.jpg')
dst = Path('/home/ubuntu/wt_supabase_queries/img/luxo/capa-luxo-lago-palmeiras.webp')
with Image.open(src) as im:
    im = im.convert('RGB')
    im.save(dst, 'WEBP', quality=84, method=6)
print(f'{dst} {dst.stat().st_size} bytes')
