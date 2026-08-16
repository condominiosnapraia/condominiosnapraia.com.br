from __future__ import annotations

import html
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSS_HREF = '/css/condominio-pdf-map.css'

MAPS = {
    'ocean-side-xangri-la': ('Ocean Side', 'oceanside'),
    'one-atlantida-houses-xangri-la': ('One Atlântida Houses', 'one'),
    'playa-vista-xangri-la': ('Playa Vista', 'playavista'),
    'porto-coronado-xangri-la': ('Porto Coronado', 'portocoronado'),
    'riviera-xangri-la': ('Riviera', 'riviera'),
    'rossi-atlantida-xangri-la': ('Rossi Atlântida', 'rossi'),
    'sea-coast-xangri-la': ('Sea Coast', 'seacoast'),
    'velas-da-marina-xangri-la': ('Velas da Marina', 'velas-da-marina'),
    'ventura-club-xangri-la': ('Ventura Club', 'ventura-club'),
    'villaggio-xangri-la': ('Villaggio', 'vilaggio'),
}


def map_block(name: str, stem: str) -> str:
    safe_name = html.escape(name)
    pdf = f'/{stem}-mapa-implantacao.pdf'
    webp = f'/img/mapas/{stem}-mapa.webp'
    return f'''\n<section class="pdf-map-section" data-cond-order="9" aria-labelledby="mapa-implantacao-{stem}">
  <div class="pdf-map-kicker">Implantação</div>
  <h2 id="mapa-implantacao-{stem}">Mapa de implantação do condomínio</h2>
  <p class="pdf-map-lead">Consulte a planta do empreendimento com a disposição dos lotes e das áreas comuns. Toque na imagem para abrir o PDF em alta resolução.</p>
  <a class="pdf-map-card" href="{pdf}" target="_blank" rel="noopener" aria-label="Abrir mapa de implantação de {safe_name} em PDF">
    <img src="{webp}" alt="Miniatura do mapa de implantação de {safe_name}" width="1280" height="900" loading="lazy" decoding="async">
    <span>Abrir mapa em alta resolução ↗</span>
  </a>
  <div class="pdf-map-actions">
    <a class="pdf-map-action" href="{pdf}" target="_blank" rel="noopener">Abrir PDF do mapa</a>
  </div>
</section>\n'''


def ensure_css(text: str) -> str:
    if CSS_HREF in text:
        return text
    marker = '  <link rel="stylesheet" href="/css/portal-footer.css">'
    if marker in text:
        return text.replace(marker, f'  <link rel="stylesheet" href="{CSS_HREF}">\n{marker}', 1)
    return text.replace('</head>', f'  <link rel="stylesheet" href="{CSS_HREF}">\n</head>', 1)


def insert_before_anchor(text: str, block: str) -> tuple[str, str]:
    market = re.search(r'<h2[^>]*>\s*Mercado\s+e\s+Valoriza(?:ção|cao)\s*</h2>', text, re.I)
    if market:
        return text[:market.start()] + block + text[market.start():], 'before-market'
    diff = re.search(r'<h2[^>]*>\s*Diferenciais\s*</h2>', text, re.I)
    if diff:
        return text[:diff.start()] + block + text[diff.start():], 'before-differentials'
    anchor = re.search(r'</main>|</section>\s*<footer', text, re.I)
    if anchor:
        return text[:anchor.start()] + block + text[anchor.start():], 'before-content-end'
    return text, 'no-anchor'


def main() -> None:
    for slug, (name, stem) in MAPS.items():
        path = ROOT / slug / 'index.html'
        if not path.exists():
            print(f'{slug}: page-missing')
            continue
        text = path.read_text(encoding='utf-8')
        text = ensure_css(text)
        if 'class="pdf-map-section"' in text and f'/img/mapas/{stem}-mapa.webp' in text:
            print(f'{slug}: already-present')
            path.write_text(text, encoding='utf-8')
            continue
        block = map_block(name, stem)
        updated, status = insert_before_anchor(text, block)
        if status == 'no-anchor':
            print(f'{slug}: no-anchor')
            continue
        path.write_text(updated, encoding='utf-8')
        print(f'{slug}: {status} -> {stem}-mapa.webp')


if __name__ == '__main__':
    main()
