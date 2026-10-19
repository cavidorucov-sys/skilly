# Draw topic illustrations with Codex, 4 per sprite, then slice:  python tools/ill-ciz.py [workers=3] [only-group-numbers...]
# Scenes: ../plan/illustrasiya/sehneler.json [{slug, scene}]. Style: ../plan/illustrasiya/style-A.txt (chosen 20 Oct 2026).
# A group is skipped when all its WebP files exist, so the script can be re-run after failures.
import json, os, subprocess, sys, shutil
from concurrent.futures import ThreadPoolExecutor
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
PLAN = os.path.abspath("../plan/illustrasiya")
SPR = os.path.join(PLAN, "sprites"); os.makedirs(SPR, exist_ok=True)
scenes = json.load(open(os.path.join(PLAN, "sehneler.json"), encoding="utf-8"))
style = open(os.path.join(PLAN, "style-A.txt"), encoding="utf-8").read().strip()
groups = [scenes[i:i + 4] for i in range(0, len(scenes), 4)]
workers = int(sys.argv[1]) if len(sys.argv) > 1 else 3
only = {int(x) for x in sys.argv[2:]}
CODEX = shutil.which("codex") or shutil.which("codex.cmd")

def prompt(g, out):
    lines = "\n".join(f"{i + 1}. {s['scene']}" for i, s in enumerate(g))
    return f"""Generate an image with your image generation tool and save it as PNG at {out}, resized to exactly 2048x1152. Do not write any other files. Reply only with the saved path.

Create ONE image: a 2x2 sprite sheet, 2048x1152 px, landscape. Four equal cells (each ~1000x560), separated by a 32 px PURE WHITE (#FFFFFF) gutter, pure white outer margin 16 px. Each cell is a complete scene filling its whole cell edge to edge, with its own warm white background #F6F5F1 (never pure white inside a cell). No text, no letters, no digits, no formulas, no labels anywhere (a "%" sign only if a scene explicitly asks for it).

Scenes (top-left, top-right, bottom-left, bottom-right):
{lines}

Characters: the same 15-year-old boy in all scenes (short dark hair, violet t-shirt, blue trousers), friendly, not cartoon-exaggerated.
Colour palette (main colours): violet #534AB7, light violet #DEDBFA, blue #185FA5, light blue #D6E8F8, amber #BA7517, light amber #F8E3BE, rose #993556, ink #17171A, warm white #F6F5F1. Plus natural greens for plants.
{style}
Physical and geometric details must be correct (shadows away from the light, parabolic flight paths, arrows in the right direction)."""

def run(n):
    g = groups[n]
    slugs = [s["slug"] for s in g] + ["-"] * (4 - len(g))
    if all(os.path.exists(f"assets/ill/{s}.webp") for s in slugs if s != "-"): return f"{n:02d} skip"
    out = os.path.join(SPR, f"sprite-{n:02d}.png")
    if not os.path.exists(out):
        r = subprocess.run([CODEX, "exec", "--skip-git-repo-check", "-s", "workspace-write", "-C", SPR, prompt(g, out)],
                           capture_output=True, text=True, encoding="utf-8", errors="replace", timeout=900)
        if not os.path.exists(out): return f"{n:02d} FAIL codex: " + (r.stdout + r.stderr)[-400:].replace("\n", " ")
    r = subprocess.run([sys.executable, "tools/sprite-kes.py", out, *slugs], capture_output=True, text=True, encoding="utf-8")
    return f"{n:02d} " + ("ok " + " ".join(slugs) if r.returncode == 0 else "FAIL slice: " + r.stdout[-200:] + r.stderr[-300:])

todo = [n for n in range(len(groups)) if not only or n in only]
with ThreadPoolExecutor(workers) as ex:
    for line in ex.map(run, todo): print(line, flush=True)
