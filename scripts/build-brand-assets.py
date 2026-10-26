"""Raster brand assets for web/assets/brand/ (favicon + PNG macaron for app icons).
The logos themselves are SVG: see scripts/vectorize-logo.py.
Usage (repo root): python scripts/build-brand-assets.py   — needs Pillow."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs/DA/logo/source/alpharium-macaron-argent.png"
DST = ROOT / "web/assets/brand"

im = Image.open(SRC).convert("RGBA")
im = im.crop(im.getbbox())
s = max(im.size)                       # master is not square: pad, don't stretch
sq = Image.new("RGBA", (s, s), (0, 0, 0, 0))
sq.paste(im, ((s - im.width) // 2, (s - im.height) // 2))

DST.mkdir(parents=True, exist_ok=True)
sq.resize((512, 512), Image.LANCZOS).save(DST / "macaron-argent.png", optimize=True)
sq.resize((256, 256), Image.LANCZOS).save(DST / "favicon.png", optimize=True)
sq.save(DST / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64), (256, 256)])
print("brand assets ->", DST)
