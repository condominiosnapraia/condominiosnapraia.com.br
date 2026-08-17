from pathlib import Path
from PIL import Image

root=Path('/home/ubuntu/wt_supabase_queries')
out=root/'img'; out.mkdir(parents=True,exist_ok=True)
items=[
 ('/home/ubuntu/upload/1001091172.jpg','home-lagoa-capa.webp'),
 ('/home/ubuntu/upload/1001091090.jpg','home-mar-capa.webp'),
 ('/home/ubuntu/upload/1001091250.jpg','home-cidade-capa.webp'),
]
for source_name,out_name in items:
    source=Path(source_name)
    if not source.exists(): raise FileNotFoundError(source)
    img=Image.open(source).convert('RGB')
    if img.width>1800:
        img=img.resize((1800,round(img.height*1800/img.width)),Image.Resampling.LANCZOS)
    target=out/out_name
    img.save(target,'WEBP',quality=82,method=6)
    print(out_name,img.width,img.height,target.stat().st_size)
