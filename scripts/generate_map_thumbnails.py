from pathlib import Path
from pdf2image import convert_from_path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "img" / "mapas"
OUT.mkdir(parents=True, exist_ok=True)

for pdf in sorted(ROOT.glob("*-mapa-implantacao.pdf")):
    stem = pdf.stem.replace("-mapa-implantacao", "")
    target = OUT / f"{stem}-mapa.webp"
    pages = convert_from_path(str(pdf), dpi=110, first_page=1, last_page=1, fmt="ppm")
    if not pages:
        raise RuntimeError(f"Não foi possível renderizar {pdf}")
    image = pages[0].convert("RGB")
    image.thumbnail((1280, 900))
    image.save(target, "WEBP", quality=76, method=6)
    print(f"{pdf.name}\t{target.relative_to(ROOT)}\t{target.stat().st_size}")
