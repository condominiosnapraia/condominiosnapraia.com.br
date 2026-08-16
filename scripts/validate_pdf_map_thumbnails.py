from pathlib import Path
from PIL import Image
import re

ROOT = Path(__file__).resolve().parents[1]
MAPS = {
    'lagoa-do-passo-xangri-la': 'lagoa-do-passo',
    'atlantida-lagos-park-xangri-la': 'atlantida-lagos-park',
    'las-dunas-xangri-la': 'las-dunas',
    'pacific-residence-xangri-la': 'pacific-residence',
    'la-plage-xangri-la': 'la-plage',
    'ocean-side-xangri-la': 'oceanside',
    'one-atlantida-houses-xangri-la': 'one',
    'playa-vista-xangri-la': 'playavista',
    'porto-coronado-xangri-la': 'portocoronado',
    'riviera-xangri-la': 'riviera',
    'rossi-atlantida-xangri-la': 'rossi',
    'sea-coast-xangri-la': 'seacoast',
    'velas-da-marina-xangri-la': 'velas-da-marina',
    'ventura-club-xangri-la': 'ventura-club',
    'villaggio-xangri-la': 'vilaggio',
}

errors = []
for slug, stem in MAPS.items():
    page = ROOT / slug / 'index.html'
    webp = ROOT / 'img' / 'mapas' / f'{stem}-mapa.webp'
    pdf = ROOT / f'{stem}-mapa-implantacao.pdf'
    text = page.read_text(encoding='utf-8') if page.exists() else ''
    status = []
    if not page.exists(): errors.append(f'{slug}: página ausente')
    if not webp.exists(): errors.append(f'{slug}: WebP ausente')
    if not pdf.exists(): errors.append(f'{slug}: PDF ausente')
    if 'class="pdf-map-section"' not in text: errors.append(f'{slug}: bloco ausente')
    if f'/img/mapas/{stem}-mapa.webp' not in text: errors.append(f'{slug}: referência WebP ausente')
    if f'/{stem}-mapa-implantacao.pdf' not in text: errors.append(f'{slug}: referência PDF ausente')
    if webp.exists():
        with Image.open(webp) as image:
            status.append(f'{image.width}x{image.height}')
            if image.width < 600 or image.height < 400: errors.append(f'{slug}: dimensão pequena {image.size}')
    print(f'{slug}\t{stem}\t{webp.stat().st_size if webp.exists() else 0} bytes\t{" ".join(status)}')

if errors:
    print('\nERRORS')
    print('\n'.join(errors))
    raise SystemExit(1)
print(f'OK: {len(MAPS)} mapas validados')
