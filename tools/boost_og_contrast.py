from pathlib import Path
from PIL import Image
import subprocess

root = Path(__file__).resolve().parents[1]
og = root / "img" / "corretores" / "og"
for path in sorted(og.glob("*.jpg")):
    original = subprocess.check_output(["git", "show", f"HEAD~1:img/corretores/og/{path.name}"], cwd=root)
    image_path = root / ".og-original.jpg"
    image_path.write_bytes(original)
    image = Image.open(image_path).convert("RGBA")
    width, height = image.size
    veil = Image.new("RGBA", image.size, (0, 0, 0, 0))
    vp = veil.load()
    for x in range(width):
        # A restrained left-side gradient improves text contrast without
        # changing the original typography or profile photo.
        alpha = int(52 * max(0, 1 - x / (width * 0.72))) if x < width * 0.72 else 0
        for y in range(height):
            vp[x, y] = (5, 22, 30, alpha)
    result = Image.alpha_composite(image, veil).convert("RGB")
    result.save(path, quality=94, optimize=True, progressive=True)
    print(path.name)
image_path.unlink(missing_ok=True)
