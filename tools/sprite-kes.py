# Slice a 2×2 illustration sprite into four WebP files:  python tools/sprite-kes.py <sprite.png> <slug1> <slug2> <slug3> <slug4>
# Order: top-left, top-right, bottom-left, bottom-right; "-" skips a cell. Output: assets/ill/<slug>.webp (960 px wide).
# The generator does not hit the layout to the pixel, so the white gutters are found from the image itself.
import sys, os
from PIL import Image
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
src, slugs = sys.argv[1], sys.argv[2:6]
im = Image.open(src).convert("RGB")
W, H = im.size
g = im.convert("L")
px = g.load()

def white_line(i, axis, lo, hi):  # share of pure-white pixels (the scene background #F6F5F1 stays below the threshold) on one column (axis 0) or row (axis 1)
    n = sum(1 for j in range(lo, hi, 4) if (px[i, j] if axis == 0 else px[j, i]) > 250)
    return n / len(range(lo, hi, 4))

def band(axis, size, other):  # the white band closest to the middle
    mid, best = size // 2, None
    for r in range(0, size // 6):
        for i in (mid - r, mid + r):
            if white_line(i, axis, 0, other) > 0.97: best = i; break
        if best is not None: break
    if best is None: sys.exit(f"no gutter found on axis {axis}")
    a = b = best
    while a > 0 and white_line(a - 1, axis, 0, other) > 0.97: a -= 1
    while b < size - 1 and white_line(b + 1, axis, 0, other) > 0.97: b += 1
    return a, b

cx0, cx1 = band(0, W, H)
cy0, cy1 = band(1, H, W)
boxes = [(0, 0, cx0, cy0), (cx1 + 1, 0, W, cy0), (0, cy1 + 1, cx0, H), (cx1 + 1, cy1 + 1, W, H)]

def trim(box):  # drop the white outer margin of a cell
    x0, y0, x1, y1 = box
    while x0 < x1 and white_line(x0, 0, y0, y1) > 0.97: x0 += 1
    while x1 > x0 and white_line(x1 - 1, 0, y0, y1) > 0.97: x1 -= 1
    while y0 < y1 and white_line(y0, 1, x0, x1) > 0.97: y0 += 1
    while y1 > y0 and white_line(y1 - 1, 1, x0, x1) > 0.97: y1 -= 1
    return x0 + 2, y0 + 2, x1 - 2, y1 - 2  # a couple of pixels inside to avoid antialiased edges

os.makedirs("assets/ill", exist_ok=True)
for slug, box in zip(slugs, boxes):
    if slug == "-": continue
    x0, y0, x1, y1 = trim(box)
    cell = im.crop((x0, y0, x1, y1))
    # keep a fixed 16:9 frame so all illustrations line up
    w, h = cell.size; tw = min(w, round(h * 16 / 9)); th = round(tw * 9 / 16)
    cell = cell.crop(((w - tw) // 2, (h - th) // 2, (w - tw) // 2 + tw, (h - th) // 2 + th)).resize((960, 540), Image.LANCZOS)
    out = f"assets/ill/{slug}.webp"
    cell.save(out, "WEBP", quality=80, method=6)
    print(slug, (x0, y0, x1, y1), os.path.getsize(out) // 1024, "KB")
