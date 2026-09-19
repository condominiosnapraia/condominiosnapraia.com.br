from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter

root=Path(__file__).resolve().parents[1]
out_dir=root/'img/corretores/og'
cover=Image.open(root/'img/parceiro-capa-padrao.webp').convert('RGB')

SERIF='/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
SERIF_B='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
SANS='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
SANS_B='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'

def font(path,size): return ImageFont.truetype(path,size)

def rounded_photo(base, path):
    photo=Image.open(path).convert('RGB')
    photo=ImageOps.fit(photo,(350,440),method=Image.Resampling.LANCZOS,centering=(0.5,0.42))
    mask=Image.new('L',photo.size,0)
    ImageDraw.Draw(mask).rounded_rectangle((0,0,349,439),radius=34,fill=255)
    panel=Image.new('RGB',(374,464),(241,191,97))
    panel_mask=Image.new('L',panel.size,0)
    ImageDraw.Draw(panel_mask).rounded_rectangle((0,0,373,463),radius=40,fill=255)
    panel.putalpha(panel_mask)
    base.paste(panel,(788,82),panel_mask)
    base.paste(photo,(800,94),mask)

def render(out,name,creci,profile=None):
    bg=ImageOps.fit(cover,(1200,630),method=Image.Resampling.LANCZOS,centering=(0.5,0.54))
    overlay=Image.new('RGBA',bg.size,(5,28,36,0))
    od=ImageDraw.Draw(overlay)
    od.rectangle((0,0,1200,630),fill=(4,28,38,110))
    od.rectangle((0,0,760,630),fill=(4,28,38,48))
    bg=Image.alpha_composite(bg.convert('RGBA'),overlay).convert('RGB')
    draw=ImageDraw.Draw(bg)
    gold=(241,191,97); white=(250,250,247); muted=(236,239,235)
    draw.rectangle((70,174,150,178),fill=gold)
    draw.text((168,155),'ATENDIMENTO IMOBILIÁRIO',font=font(SANS,21),fill=white)
    draw.text((70,215),name,font=font(SERIF_B,53),fill=white,stroke_width=1,stroke_fill=(25,46,53))
    draw.text((72,295),f'CRECI {creci}  ·  Atendimento personalizado',font=font(SANS,21),fill=gold)
    draw.text((72,510),'Imóveis selecionados no Litoral Norte Gaúcho',font=font(SANS,19),fill=muted)
    if profile: rounded_photo(bg,profile)
    else:
        # Generic fallback retains the same branded composition without inventing a portrait.
        draw.rounded_rectangle((788,82,1162,546),radius=40,outline=gold,width=8)
        draw.multiline_text((825,270),'SEU\nCORRETOR\nPARCEIRO',font=font(SERIF_B,30),fill=white,align='center',spacing=8)
    bg.save(out,quality=92,optimize=True,subsampling=0)

render(out_dir/'jeferson-gimenez.jpg','Jeferson Gimenez','33.257',root/'img/corretores/jeferson-gimenez.jpg')
render(out_dir/'parceiro-padrao.jpg','Condomínios na Praia','',None)
print(out_dir/'jeferson-gimenez.jpg')
print(out_dir/'parceiro-padrao.jpg')
