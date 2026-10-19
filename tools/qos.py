# Attach finished topics to the portal:  python tools/qos.py <list> "<slug>=<exact topic name>" ...
# For each: runs the game self-test, checks the page has the template's required parts, then sets
# "ders": "dersler/<slug>.html" on the topic in data/movzular.json. Stops on the first failure.
import json, subprocess, sys, os, re
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
lst, pairs = sys.argv[1], sys.argv[2:]
data = json.load(open("data/movzular.json", encoding="utf-8"))
names = {t["ad"]: t for t in data[lst]}
ok = True
for p in pairs:
    slug, name = p.split("=", 1)
    page, game = f"dersler/{slug}.html", f"dersler/oyun-{slug}.js"
    if name not in names: print("NO TOPIC:", name); ok = False; break
    for f in (page, game):
        if not os.path.exists(f): print("MISSING:", f); ok = False
    if not ok: break
    html = open(page, encoding="utf-8").read()
    need = [f'oyun-{slug}.js', 'id="giris-root"', 'id="oyun-root"', 'id="sinaq-root"', '../assets/tabs.js', '../assets/oyun.js', '../assets/jurnal.js', '../assets/ders.css', 'data-kat="']
    miss = [n for n in need if n not in html]
    if miss: print(slug, "page missing:", miss); ok = False; break
    r = subprocess.run(["node", "tools/oyun-test.js", game, "300"], capture_output=True, text=True, encoding="utf-8", timeout=180)
    if r.returncode: print(slug, "SELF-TEST FAIL\n" + r.stdout[-1500:]); ok = False; break
    if not re.search(r'link:\s*"dersler/' + re.escape(slug) + r'\.html"', open(game, encoding="utf-8").read()): print(slug, "WARN: link field differs")
    names[name]["ders"] = page
    print("ok ", slug)
if ok:
    json.dump(data, open("data/movzular.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("movzular.json updated")
sys.exit(0 if ok else 1)
