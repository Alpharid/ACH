"""Vectorise the Alpharium logo masters (docs/DA/logo/source/*.png) into SVG.

Usage (repo root):  python scripts/vectorize-logo.py
Needs: pillow, numpy, opencv-python-headless, potracer.

What is traced vs rebuilt:
- traced (potrace) : emblem ink (X + α ρ δ + seal glyph), the 4 numerals 1·9·9·6,
  the 9 letters of ALPHARIUM. Shapes are the graphic designer's, untouched.
- rebuilt          : the gold light at the X intersection (the original is a stepped
  Illustrator blend that cannot be traced cleanly) and the gold rim of the letters,
  as SVG gradients measured on the masters (see docs/DA/CHARTE.md).
- corrected        : the silver disc is a true circle (the master is a 3 % ellipse).

Outputs: docs/DA/logo/svg/ (masters) and web/assets/brand/*.svg (web, glow animated).
"""
from pathlib import Path

import cv2
import numpy as np
import potrace
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "docs/DA/logo/source"
OUT = ROOT / "docs/DA/logo/svg"
WEB = ROOT / "web/assets/brand"

INK = {"blanc": "#ffffff", "marine": "#182239", "noir": "#131515"}

# Gold measured on the masters.
NUM_STOPS = [(0, "#b3843a"), (0.45, "#a06c20"), (0.75, "#cf9f55"), (1, "#efcf98")]
RIM_STOPS = [(0, "#5e3d22"), (0.18, "#7a5530"), (0.5, "#ccb68a"), (0.75, "#b8996e"), (1, "#8c623c")]
DISC_STOPS = [(0, "#8f8f93"), (0.2, "#98989a"), (0.35, "#9d9d9e"), (0.48, "#a3a2a2"),
              (0.62, "#939292"), (0.8, "#7e7c7e"), (1, "#646365")]

RIM_PX = 5            # rim width on the 6763 px wordmark master (inside the letter)
GLOW_LEN = 1400       # halo reach along each arm, emblem master px
GLOW_W = 105          # halo half-width (arm half-width ≈ 120)
SPINDLE_LEN = 560     # half-length of each gold spindle
SPINDLE_W = 20        # half-width of a spindle at the centre


# ── tracing ─────────────────────────────────────────────────────────────────

def trace(mask, scale, dx=0.0, dy=0.0, alphamax=1.0):
    """potrace a boolean mask → SVG path data in master pixel units."""
    # potracer fills the False pixels, hence the inversion.
    curves = potrace.Bitmap(~mask).trace(
        turdsize=8, turnpolicy=potrace.POTRACE_TURNPOLICY_MINORITY,
        alphamax=alphamax, opticurve=True, opttolerance=0.2)
    f = lambda p: f"{p.x * scale - dx:.1f} {p.y * scale - dy:.1f}"
    d = []
    for c in curves:
        d.append("M" + f(c.start_point))
        for s in c.segments:
            if s.is_corner:
                d.append("L" + f(s.c) + "L" + f(s.end_point))
            else:
                d.append("C" + f(s.c1) + " " + f(s.c2) + " " + f(s.end_point))
        d.append("Z")
    return "".join(d)


def polygon(mask, scale, dx=0.0, dy=0.0, eps=1.5):
    """Straight-edged trace (OpenCV + Douglas-Peucker) for the geometric wordmark:
    keeps acute corners sharp where potrace blunts them. Use with fill-rule evenodd."""
    contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
    d = []
    for c in contours:
        pts = cv2.approxPolyDP(c, eps, True)[:, 0, :]
        d.append("M" + "L".join(f"{(x + .5) * scale - dx:.1f} {(y + .5) * scale - dy:.1f}" for x, y in pts) + "Z")
    return "".join(d)


def load(name, work):
    """Master as RGBA int array at a working size, + factor back to master px."""
    im = Image.open(SRC / f"alpharium-{name}.png").convert("RGBA")
    k = work / max(im.size)
    small = im.resize((round(im.width * k), round(im.height * k)), Image.LANCZOS)
    return np.array(small).astype(int), 1 / k, im.size


def components(mask, min_area=200):
    n, lab, st, _ = cv2.connectedComponentsWithStats(mask.astype(np.uint8), 8)
    return [(lab == i, st[i]) for i in range(1, n) if st[i][4] >= min_area]


def trace_emblem():
    a, sc, (W, H) = load("embleme-blanc", 3600)
    alpha = a[..., 3] > 127
    gold = alpha & (a[..., 0] - a[..., 2] > 50) & (a[..., 0] > 120)
    h, w = alpha.shape
    numerals = []
    num_all = np.zeros_like(alpha)
    for m, (x, y, ww, hh, _) in components(gold):
        cx, cy = x + ww / 2, y + hh / 2
        if min(cx, w - cx) < w * 0.12 and min(cy, h - cy) < h * 0.12:   # corner = numeral
            m = cv2.dilate(m.astype(np.uint8), np.ones((3, 3), np.uint8)).astype(bool) & alpha
            numerals.append((round(cy / h), round(cx / w), m))
            num_all |= m
    numerals.sort(key=lambda t: (t[0], t[1]))                          # TL, TR, BL, BR
    ink = alpha & ~num_all

    # X centre: intersection of both arm centre-lines (arms are exactly 45°).
    full = np.array(Image.open(SRC / "alpharium-embleme-blanc.png"))[..., 3] > 127
    c0 = np.array([W / 2, H / 2])

    def arm_offset(v, n):
        lo, hi = [], []
        for d in (1000, 1500):
            o = [o for o in range(-300, 301)
                 if full[tuple(np.round(c0 + v * d + n * o).astype(int))[::-1]]]
            lo.append(min(o)); hi.append(max(o))
        return (np.mean(lo) + np.mean(hi)) / 2

    se, ne = np.array([1, 1]) / 2 ** .5, np.array([1, -1]) / 2 ** .5
    centre = c0 + arm_offset(se, ne) * ne + arm_offset(ne, se) * se
    return {
        "size": (W, H),
        "ink": trace(ink, sc),
        "numerals": [trace(m, sc) for *_, m in numerals],
        "centre": centre,
    }


def trace_blason():
    """Alpharid's personal blazon (the stylised F under the X), alone, at master scale."""
    a = np.array(Image.open(SRC / "alpharium-embleme-blanc.png").convert("RGBA"))
    alpha = a[..., 3] > 127
    h = alpha.shape[0]
    m, (x, y, w, hh, _) = max((c for c in components(alpha) if c[1][1] > h * 0.6),
                              key=lambda c: c[1][4])   # biggest component in the lower part
    return {"box": (w, hh), "d": trace(m[y:y + hh, x:x + w], 1)}


def trace_wordmark():
    a, sc, (W, H) = load("wordmark-blanc", 6763)   # master size: no resampling
    alpha = a[..., 3] > 127
    letters = sorted(components(alpha, 1000), key=lambda t: t[1][0])
    ys, xs = np.nonzero(alpha)
    x0, y0 = xs.min() * sc - RIM_PX, ys.min() * sc - RIM_PX
    x1, y1 = (xs.max() + 1) * sc + RIM_PX, (ys.max() + 1) * sc + RIM_PX
    return {
        "box": (x1 - x0, y1 - y0),
        "letters": [polygon(m, sc, x0, y0) for m, _ in letters],
    }


# ── SVG building blocks ─────────────────────────────────────────────────────

def stops(spec, opacity=None):
    return "".join(
        f'<stop offset="{o}" stop-color="{c}"'
        + (f' stop-opacity="{opacity[i]}"' if opacity else "") + "/>"
        for i, (o, c) in enumerate(spec))


def emblem_defs(p, e):
    """Gradients + clip for one emblem; `p` prefixes ids so several can coexist."""
    return (
        f'<linearGradient id="{p}num" x1="0" y1="0" x2="1" y2="0">{stops(NUM_STOPS)}</linearGradient>'
        f'<radialGradient id="{p}halo">'
        f'<stop offset="0" stop-color="#dca751" stop-opacity=".5"/>'
        f'<stop offset=".4" stop-color="#c99a4e" stop-opacity=".32"/>'
        f'<stop offset=".72" stop-color="#b8894a" stop-opacity=".14"/>'
        f'<stop offset="1" stop-color="#c98f3e" stop-opacity="0"/></radialGradient>'
        f'<linearGradient id="{p}spindle" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0" stop-color="#e3a646"/><stop offset=".45" stop-color="#fcd690"/>'
        f'<stop offset=".6" stop-color="#f6c574"/><stop offset="1" stop-color="#b9802f"/></linearGradient>'
        f'<radialGradient id="{p}bloom"><stop offset="0" stop-color="#fbdc9c" stop-opacity=".85"/>'
        f'<stop offset=".4" stop-color="#f4c982" stop-opacity=".45"/>'
        f'<stop offset="1" stop-color="#dca751" stop-opacity="0"/></radialGradient>'
        f'<path id="{p}ink" d="{e["ink"]}"/>'
        f'<clipPath id="{p}arms"><use href="#{p}ink"/></clipPath>'
    )


def emblem_body(p, e, ink):
    cx, cy = e["centre"]
    L, w = SPINDLE_LEN, SPINDLE_W
    spindle = f"M{-L} 0Q0 {-2 * w} {L} 0Q0 {2 * w} {-L} 0Z"
    halo = f'<ellipse rx="{GLOW_LEN}" ry="{GLOW_W}" fill="url(#{p}halo)"/>'
    glow = (
        f'<g class="glow" clip-path="url(#{p}arms)">'
        f'<g transform="translate({cx:.1f} {cy:.1f})">'
        f'<g transform="rotate(45)">{halo}</g><g transform="rotate(-45)">{halo}</g>'
        f'<g class="spindles">'
        f'<path transform="rotate(45)" d="{spindle}" fill="url(#{p}spindle)"/>'
        f'<path transform="rotate(-45)" d="{spindle}" fill="url(#{p}spindle)"/>'
        f'</g><circle class="bloom" r="60" fill="url(#{p}bloom)"/></g></g>'
    )
    nums = "".join(f'<path d="{d}" fill="url(#{p}num)"/>' for d in e["numerals"])
    return f'<use href="#{p}ink" fill="{ink}"/>{glow}{nums}'


def wordmark_defs(p, wm):
    out = [f'<linearGradient id="{p}rim" x1="0" y1="0" x2="1" y2="0">{stops(RIM_STOPS)}</linearGradient>']
    for i, d in enumerate(wm["letters"]):
        out.append(f'<path id="{p}l{i}" d="{d}" fill-rule="evenodd"/>'
                   f'<clipPath id="{p}c{i}"><use href="#{p}l{i}" clip-rule="evenodd"/></clipPath>')
    return "".join(out)


def wordmark_body(p, wm, ink):
    return "".join(
        f'<use href="#{p}l{i}" fill="{ink}"/>'
        f'<use href="#{p}l{i}" fill="none" stroke="url(#{p}rim)" stroke-width="{2 * RIM_PX}" '
        f'clip-path="url(#{p}c{i})"/>'
        for i in range(len(wm["letters"])))


WEB_STYLE = (
    "<style>"
    # Rest state = fully lit, so the glow shows even where SVG-in-<img> animations don't run.
    ".glow{animation:ach-breathe 7s ease-in-out infinite}"
    ".bloom{transform-box:fill-box;transform-origin:center;animation:ach-bloom 7s ease-in-out infinite}"
    "@keyframes ach-breathe{0%,100%{opacity:1}50%{opacity:.72}}"
    "@keyframes ach-bloom{0%,100%{transform:scale(1)}50%{transform:scale(1.35)}}"
    "@media (prefers-reduced-motion:reduce){.glow,.bloom{animation:none}}"
    "</style>"
)


def svg(w, h, defs, body, title, style=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" '
            f'role="img" aria-label="{title}"><title>{title}</title>{style}'
            f'<defs>{defs}</defs>{body}</svg>\n')


def write(path, text):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")
    print(f"{path.relative_to(ROOT)}  {len(text) // 1024} KB")


# ── assemble ────────────────────────────────────────────────────────────────

def main():
    e = trace_emblem()
    wm = trace_wordmark()
    EW, EH = e["size"]
    WW, WH = wm["box"]

    for variant, ink in INK.items():
        write(OUT / f"alpharium-embleme-{variant}.svg",
              svg(EW, EH, emblem_defs("e", e), emblem_body("e", e, ink), "Alpharium"))
        write(OUT / f"alpharium-wordmark-{variant}.svg",
              svg(WW, WH, wordmark_defs("w", wm), wordmark_body("w", wm, ink), "Alpharium"))
        # Lockup layout measured on alpharium-lockup-*.png: emblem on top, gap, wordmark
        # (both at master scale, wordmark 5707 px wide vs emblem 4715 px).
        gap = 5357 - 4705 - RIM_PX
        lw, lh = max(EW, WW), EH + gap + WH
        body = (f'<g transform="translate({(lw - EW) / 2:.1f} 0)">{emblem_body("e", e, ink)}</g>'
                f'<g transform="translate({(lw - WW) / 2:.1f} {EH + gap:.1f})">{wordmark_body("w", wm, ink)}</g>')
        write(OUT / f"alpharium-lockup-{variant}.svg",
              svg(lw, lh, emblem_defs("e", e) + wordmark_defs("w", wm), body, "Alpharium"))

    # Macaron: navy emblem at 1.205× on a silver disc, measured on the master;
    # radius = mean of the master's two semi-axes, centred on the X.
    k, r = 1.205, (8817 + 8556) / 4
    cx, cy = e["centre"]
    size = 2 * r
    disc = (f'<linearGradient id="mdisc" x1="0" y1="0" x2="1" y2="0">{stops(DISC_STOPS)}</linearGradient>')
    body = (f'<circle cx="{r:.1f}" cy="{r:.1f}" r="{r:.1f}" fill="url(#mdisc)"/>'
            f'<g transform="translate({r - cx * k:.1f} {r - cy * k:.1f}) scale({k})">'
            f'{emblem_body("e", e, INK["marine"])}</g>')
    write(OUT / "alpharium-macaron.svg", svg(size, size, disc + emblem_defs("e", e), body, "Alpharium"))

    # Web copies: white on dark, glow animated on the emblem.
    write(WEB / "embleme-blanc.svg",
          svg(EW, EH, emblem_defs("e", e), emblem_body("e", e, INK["blanc"]), "Alpharium", WEB_STYLE))
    write(WEB / "wordmark-blanc.svg",
          svg(WW, WH, wordmark_defs("w", wm), wordmark_body("w", wm, INK["blanc"]), "Alpharium"))
    write(WEB / "macaron.svg", (OUT / "alpharium-macaron.svg").read_text(encoding="utf-8"))

    # Alpharid's blazon on its own (founder's mark, used as a signature).
    b = trace_blason()
    BW, BH = b["box"]
    for variant, ink in INK.items():
        write(OUT / f"alpharid-blason-{variant}.svg",
              svg(BW, BH, "", f'<path d="{b["d"]}" fill="{ink}"/>', "Blason d'Alpharid"))
    write(WEB / "blason-blanc.svg", (OUT / "alpharid-blason-blanc.svg").read_text(encoding="utf-8"))


if __name__ == "__main__":
    main()
