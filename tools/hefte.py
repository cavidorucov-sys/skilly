# Day-by-day week plans from the topic plan:  python tools/hefte.py FROM_MONDAY CLOSED.json [UNTIL_MONDAY]
# Re-run every Sunday with the topics Fikrət has closed: what is left moves forward by itself.
# Reads data/movzular.json (weeks from tools/plan.py) and data/terminler.json; writes ../gizli/hefte.json,
# keeping the current week as it is and putting the new weeks in "hefteler". Then encrypt (see gizli/README.md).
# Week template agreed with the father (11 Nov 2026): FRİTL Tuesday and Friday (no other tasks those days),
# physics 9 h at home, math 4,5 h, memory checks Wednesday and Sunday, Sunday is not lightened on exam days.
import json, sys, os, datetime as dt
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
FROM = dt.date.fromisoformat(sys.argv[1])
CLOSED = set(json.load(open(sys.argv[2], encoding="utf-8")))
mm = json.load(open("data/movzular.json", encoding="utf-8"))
term = json.load(open("data/terminler.json", encoding="utf-8"))
GUN = ["Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə", "Bazar"]
QISA = ["B.e", "Ç.a", "Çər", "C.a", "Cümə", "Şən", "Baz"]
AY = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"]
H = 2.0  # a topic takes at most 2 h (father, 11 Nov 2026); one already started: 1 h
# (weekday 0 = Monday, start, end, track) — "math" or "phys"; fixed items have a text instead of a track
SLOTS = [(0, "16:45", "18:15", "math"), (0, "18:30", "20:00", "phys"),
         (2, "16:00", "18:00", "phys"),
         (3, "13:30", "15:00", "math"), (3, "15:00", "16:30", "phys"),
         (5, "11:00", "12:30", "math"), (5, "14:00", "16:00", "phys"),
         (6, "11:00", "13:00", "phys")]
FIXED = [(1, "15:00", "17:00", "phys", "FRİTL", None), (4, "15:00", "17:00", "phys", "FRİTL", None),
         (2, "18:00", "18:15", "misc", "Təkrar", "temrar.html"),
         (3, "17:00", "18:30", "misc", "Cüdo", None), (5, "17:00", "18:30", "misc", "Cüdo", None),
         (6, "14:00", "14:15", "misc", "Təkrar", "temrar.html"), (6, "16:00", "16:45", "misc", "Esse (ingiliscə, ~300 söz)", None),
         (6, "19:50", "20:20", "misc", "Həftəlik baxış + məktublar", None)]
# on an exam Sunday (school, 10:00–13:00) the Sunday physics block moves to 14:30–16:00, the review to 16:00 and the essay after it
EXAM_SUNDAY = {"phys": ("14:30", "16:00"), "Təkrar": ("16:00", "16:15"), "Esse (ingiliscə, ~300 söz)": ("16:15", "17:00")}
EXAMS = {t["tarix"]: t for t in term if t["kat"] == "math" and "sınağı" in t["ad"]}

mins = lambda s: int(s[:2]) * 60 + int(s[3:])
hm = lambda m: f"{m // 60:02d}:{m % 60:02d}"
# queues in plan order: a topic is not given before its plan week (its prerequisites come first in the plan)
queue = {"math": [], "phys": []}
for k in ("riyaziyyat", "fizika", "olimpiada"):
    for i, t in enumerate(mm[k]):
        if "hefte" not in t or t.get("ders") in CLOSED or not t.get("ders"): continue
        tr = "phys" if k == "fizika" or t.get("saat") == "fizika" else "math"
        label = t["ad"] + (" (fizika saatında)" if k != "fizika" and tr == "phys" else "")
        queue[tr].append({"hefte": t["hefte"], "n": i, "ad": label, "link": t["ders"], "left": (H / 2 if t["status"] == "isl" else H) * 60, "began": False})
for q in queue.values(): q.sort(key=lambda x: (x["hefte"], x["n"]))
last = max(x["hefte"] for q in queue.values() for x in q)
UNTIL = dt.date.fromisoformat(sys.argv[3]) if len(sys.argv) > 3 else dt.date.fromisoformat(last)

def label(m):
    s = m + dt.timedelta(days=6)
    return f"{m.day} – {s.day} {AY[s.month - 1]}" if m.month == s.month else f"{m.day} {AY[m.month - 1]} – {s.day} {AY[s.month - 1]}"

weeks, empty = [], {"math": 0.0, "phys": 0.0}
m = FROM
while (m <= UNTIL or any(queue.values())) and m <= UNTIL + dt.timedelta(weeks=12):
    days = [[] for _ in range(7)]
    for wd, a, b, kat, text, link in FIXED:
        d = m + dt.timedelta(days=wd)
        if wd == 6 and str(d) in EXAMS and text in EXAM_SUNDAY: a, b = EXAM_SUNDAY[text]
        days[wd].append({"saat": f"{a}–{b}", "kat": kat, "is": text, **({"link": link} if link else {})})
    sun = m + dt.timedelta(days=6)
    if str(sun) in EXAMS:
        e = EXAMS[str(sun)]; days[6].append({"saat": "10:00–13:00", "kat": "math", "is": e["ad"] + " (məktəbdə)"})
    for wd, a, b, tr in SLOTS:
        d = m + dt.timedelta(days=wd)
        if wd == 6 and str(d) in EXAMS and tr == "phys": a, b = EXAM_SUNDAY["phys"]
        t0, t1 = mins(a), mins(b)
        q = queue[tr]
        while t0 < t1:
            x = next((x for x in q if x["hefte"] <= str(m)), None)
            if not x: empty[tr] += (t1 - t0) / 60; break
            use = min(x["left"], t1 - t0)
            days[wd].append({"saat": f"{hm(t0)}–{hm(t0 + int(use))}", "kat": "phys" if tr == "phys" else "math",
                             "is": x["ad"] + (" (davamı)" if x["began"] else ""), "link": x["link"]})
            x["left"] -= use; x["began"] = True; t0 += int(use)
            if x["left"] <= 0: q.remove(x)
    gunler = [{"tarix": str(m + dt.timedelta(days=i)), "gun": GUN[i], "qisa": QISA[i],
               "isler": sorted(days[i], key=lambda t: t["saat"])} for i in range(7)]
    weeks.append({"hefte": label(m), "gunler": gunler})
    m += dt.timedelta(weeks=1)

p = "../gizli/hefte.json"
w = json.load(open(p, encoding="utf-8"))
w.pop("novbeti", None)
saatlar = [{"kat": "math", "ad": "Riyaziyyat (buraxılış)", "saat": 4.5}, {"kat": "phys", "ad": "Fizika (evdə; FRİTL ayrıca)", "saat": 9}]
for x in weeks: x.update(qeyd=w["qeyd"], saatlar=saatlar)
w["hefteler"] = weeks
json.dump(w, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
left = {tr: [x["ad"] for x in q] for tr, q in queue.items()}
print(f"{len(weeks)} həftə: {weeks[0]['hefte']} … {weeks[-1]['hefte']}")
print("boş qalan saat:", {k: round(v, 1) for k, v in empty.items()})
print("yerləşməyən:", left)
