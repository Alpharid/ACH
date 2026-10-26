"""Filiale media → data/media.json + card thumbnails.

Inputs (one set per catalog project, all optional):
  data/fiches/<id>.md                  public-safe presentation shown in the sheet
  web/assets/filiales/<id>-{1,2,3}.webp  real captures, 1600x900 (1 = card vignette)
Outputs:
  web/assets/filiales/<id>-card.webp   640x360 thumbnail of capture 1
  data/media.json                      { id: { fiche: bool, captures: n } } read by the web

The catalog stays hand-written; this manifest is generated, never edit it by hand.
Usage: python scripts/build-filiales.py
"""
import json
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FICHES = ROOT / "data/fiches"
SHOTS = ROOT / "web/assets/filiales"
SIZE = (1600, 900)
CARD = (640, 360)


def main():
    catalog = json.loads((ROOT / "data/catalog.json").read_text(encoding="utf-8"))
    ids = [p["id"] for p in catalog["projects"]]
    media, warnings = {}, []

    for pid in ids:
        shots = []
        for n in (1, 2, 3):
            f = SHOTS / f"{pid}-{n}.webp"
            if not f.exists():
                break
            with Image.open(f) as im:
                if abs(im.width / im.height - 16 / 9) > 0.01:
                    warnings.append(f"{f.name}: {im.width}x{im.height} n'est pas en 16:9")
                elif im.size != SIZE:
                    warnings.append(f"{f.name}: {im.width}x{im.height} (attendu {SIZE[0]}x{SIZE[1]})")
                if n == 1:
                    im.convert("RGB").resize(CARD, Image.LANCZOS).save(
                        SHOTS / f"{pid}-card.webp", "WEBP", quality=78, method=6)
            shots.append(f)
        fiche = (FICHES / f"{pid}.md").exists()
        if fiche or shots:
            media[pid] = {"fiche": fiche, "captures": len(shots)}
        stale = SHOTS / f"{pid}-card.webp"
        if not shots and stale.exists():
            stale.unlink()

    known = {f"{pid}-{s}" for pid in ids for s in ("1", "2", "3", "card")}
    for f in sorted(SHOTS.glob("*.webp")):
        if f.stem not in known:
            warnings.append(f"{f.name}: aucun projet ou numéro attendu (1-3)")
    for f in sorted(FICHES.glob("*.md")):
        if f.stem not in ids:
            warnings.append(f"fiches/{f.name}: id inconnu du catalogue")

    out = ROOT / "data/media.json"
    out.write_text(json.dumps(media, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    n_f = sum(m["fiche"] for m in media.values())
    n_c = sum(1 for m in media.values() if m["captures"])
    print(f"data/media.json : {n_f} fiches, {n_c} filiales illustrées / {len(ids)}")
    for w in warnings:
        print("  ! " + w)


if __name__ == "__main__":
    main()
