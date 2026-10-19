# Week plan for all topics:  python tools/plan.py [YYYY-MM-DD start Monday]
# Weekly hours per track and hours per topic are estimates; re-run monthly with the real pace.
# Rules (agreed with the father, 20 Oct 2026):
#  - buraxılış first; every topic starts with the entry test, so review topics take ~1 h, others ~2,5 h; 4 h/week
#  - olympiad math: number theory, combinatorics and algebra basics before the district round, final-level topics after it; 3,5 h/week
#  - physics follows the FRİTL order (list order), 6 h/week
#  - a topic never starts before its prerequisites (any track); in the same week it comes after them.
#    This holds for in-progress topics too: the portal locks a lesson until its prerequisites are closed (20 Oct 2026).
import json, sys, os, datetime as dt
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
start = dt.date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else dt.date(2026, 10, 19)
d = json.load(open("data/movzular.json", encoding="utf-8"))
CAP = {"riyaziyyat": 4.0, "olimpiada": 3.5, "fizika": 6.0}
REVIEW = {"Natural ədədlər: bölünmə əlamətləri, sadə vuruqlar, ƏBOB/ƏKOB", "Adi və onluq kəsrlər, dövri kəsrlər", "Tam və rasional ədədlər, ədəd oxu, modul",
          "Nisbət, tənasüb, düz və tərs mütənasiblik", "Faiz", "Cəbri ifadələr, sadələşdirmə", "Xətti tənliklər", "Bucaqlar, paralel və perpendikulyar düz xətlər",
          "Üçbucaqlar, bərabərlik əlamətləri", "Ölçü vahidləri və statistika: median, moda, diaqramlar", "Koordinat sistemi, funksiya anlayışı",
          "Çoxluqlar, Eyler-Venn diaqramı", "Xətti bərabərsizliklər", "Çoxhədlilər"}
OLY_CORE = {"Say nəzəriyyəsi", "Kombinatorika"}
OLY_CORE_TOPICS = {"Eynilik çevirmələri, simmetrik çoxhədlilər", "Mətnli məsələlər: iş-hovuz, yaş, sürət, mürəkkəb faiz", "Viyet teoremi (olimpiada məsələləri)", "Ədədi silsilə", "Həndəsi silsilə"}
def hours(k, t):
    if t["status"] == "bag": return 0
    h = {"riyaziyyat": 2.5, "olimpiada": 3.5, "fizika": 4.0}[k]
    if k == "riyaziyyat" and t["ad"] in REVIEW: h = 1.0
    if t["status"] == "isl": h /= 2
    return h
# math topics that the next physics topics build on come first, so physics (6 h/week) never waits for the math track
def closure(keys):
    seen, stack = set(), list(keys)
    while stack:
        x = stack.pop()
        if x in seen: continue
        seen.add(x); kk, ad = x.split(":", 1)
        stack += [p for t in d.get(kk, []) if t["ad"] == ad for p in t.get("on", [])]
    return seen
PHYS_NEED = {}  # math topic -> rank of the first physics topic (FRİTL order) that needs it
for r, t in enumerate(x for x in d["fizika"] if x["status"] != "bag"):
    for key in closure(["fizika:" + t["ad"]]): PHYS_NEED.setdefault(key, r)
def prio(k, i, t):  # lower = earlier
    if k == "olimpiada": return (0 if (t["bolme"] in OLY_CORE or t["ad"] in OLY_CORE_TOPICS or t["status"] == "isl") else 1, i)
    if k == "riyaziyyat": return (PHYS_NEED.get(k + ":" + t["ad"], 99), i)
    return (0, i)
# continuous time per track (in weeks). A topic starts when its track is free and all its prerequisites are FINISHED
# (the portal locks a lesson until they are closed). The track that is furthest behind moves next and takes the topic
# that can start earliest (ties: priority order), so a track never idles while some topic of it could already start.
week, start_at, end_at, order = {}, {}, {}, {}
clock = {k: 0.0 for k in d}
queue = {k: sorted(range(len(d[k])), key=lambda i: prio(k, i, d[k][i])) for k in d}
n = 0
while any(queue.values()):
    moved = False
    for k in sorted((k for k in d if queue[k]), key=lambda k: clock[k]):
        best = None
        # physics may spend its own hours closing the math topics it needs (when that lets it start sooner):
        # with strict prerequisite locks, physics would otherwise wait weeks for the 4 h/week math track
        cands = [(k, i) for i in queue[k]] + ([("riyaziyyat", i) for i in queue["riyaziyyat"] if "riyaziyyat:" + d["riyaziyyat"][i]["ad"] in PHYS_NEED] if k == "fizika" else [])
        for kk, i in cands:
            t = d[kk][i]; pre = [p for p in t.get("on", []) if p.split(":", 1)[0] in d]
            if any(p not in end_at for p in pre): continue
            s0 = max([clock[k]] + [end_at[p] for p in pre])
            if best is None or s0 < best[0] - 1e-9: best = (s0, kk, i)
        if best is None: continue
        s0, kk, i = best; t = d[kk][i]; key = kk + ":" + t["ad"]
        start_at[key] = s0; week[key] = int(s0 + 1e-9); order[key] = n; n += 1
        if kk != k: t["saat"] = "fizika"  # done in physics hours
        else: t.pop("saat", None)
        end_at[key] = clock[k] = s0 + hours(kk, t) / CAP[k]; queue[kk].remove(i); moved = True
        break
    assert moved, "cycle or missing prerequisite"
for k in d:
    for t in d[k]: t["hefte"] = str(start + dt.timedelta(weeks=week[k + ":" + t["ad"]]))
    d[k].sort(key=lambda t: order[k + ":" + t["ad"]])
    # sanity: prerequisites strictly earlier
    for t in d[k]:
        for p in t.get("on", []):
            if p in week: assert week[p] <= week[k + ":" + t["ad"]], (t["ad"], p)
json.dump(d, open("data/movzular.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for k in d:
    ws = sorted(set(t["hefte"] for t in d[k]))
    print(f"{k:11s} {len(d[k])} mövzu · {ws[0]} → {ws[-1]} · saat {sum(hours(k, t) for t in d[k]):.1f}")
    if k == "olimpiada": print("            rayon turuna qədər (2027-01-11):", sum(1 for t in d[k] if t['hefte'] <= '2027-01-11'), "mövzu")
