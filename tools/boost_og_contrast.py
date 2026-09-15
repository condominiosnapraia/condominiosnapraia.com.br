from pathlib import Path
from PIL import Image, ImageEnhance

root = Path(__file__).resolve().parents[1] / "img" / "corretores" / "og"
for path in sorted(root.glob("*.jpg")):
    image = Image.open(path).convert("RGB")
    width, height = image.size
    # Darken the complete artwork slightly, then add a stronger left-side veil
    # where the name, CRECI and supporting copy are placed.
    image = ImageEnhance.Brightness(image).enhance(0.93)
    veil = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    pixels = veil.load()
    for x in range(width):
        if x < int(width * 0.68):
            # strongest under text, fading smoothly toward the profile photo
            alpha = int(122 - (x / (width * 0.68)) * 82)
        else:
            alpha = 0
        for y in range(height):
            pixels[x, y] = (4, 20, 28, alpha)
    image = Image.alpha_composite(image.convert("RGBA"), veil).convert("RGB")
    image.save(path, quality=94, optimize=True, progressive=True)
    print(path.name)
