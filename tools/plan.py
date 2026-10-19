# Week plan for all topics:  python tools/plan.py [YYYY-MM-DD start Monday]
# Weekly hours per track and hours per topic are estimates; re-run monthly with the real pace.
# Rules (agreed with the father, 20 Oct 2026):
#  - buraxılış first; every topic starts with the entry test, so review topics take ~1 h, others ~2,5 h; 4 h/week
#  - olympiad math: number theory, combinatorics and algebra basics before the district round, final-level topics after it; 3,5 h/week
#  - physics follows the FRİTL order (list order), 6 h/week
#  - a topic never starts before its prerequisites (any track); in the same week it comes after them
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
def prio(k, i, t):  # lower = earlier
    if k == "olimpiada": return (0 if (t["bolme"] in OLY_CORE or t["ad"] in OLY_CORE_TOPICS or t["status"] == "isl") else 1, i)
    return (0, i)
# continuous time per track (in weeks): a topic starts when the track is free and its prerequisites have started
week, start_at, order = {}, {}, {}
clock = {k: 0.0 for k in d}
queue = {k: sorted(range(len(d[k])), key=lambda i: prio(k, i, d[k][i])) for k in d}
n = 0
while any(queue.values()):
    moved = False
    for k in d:
        for i in list(queue[k]):
            t = d[k][i]; pre = [p for p in t.get("on", []) if p.split(":", 1)[0] in d]
            if t["status"] != "isl" and any(p not in start_at for p in pre): continue
            s0 = clock[k] if t["status"] == "isl" else max([clock[k]] + [start_at[p] for p in pre if p in start_at])
            key = k + ":" + t["ad"]
            start_at[key] = s0; week[key] = int(s0 + 1e-9); order[key] = n; n += 1
            clock[k] = s0 + hours(k, t) / CAP[k]; queue[k].remove(i); moved = True
            break  # one topic per track per round keeps tracks interleaved in time
    assert moved, "cycle or missing prerequisite"
for k in d:
    for t in d[k]: t["hefte"] = str(start + dt.timedelta(weeks=week[k + ":" + t["ad"]]))
    d[k].sort(key=lambda t: order[k + ":" + t["ad"]])
    # sanity: prerequisites strictly earlier
    for t in d[k]:
        for p in t.get("on", []):
            if p in week and t["status"] != "isl": assert week[p] <= week[k + ":" + t["ad"]], (t["ad"], p)
json.dump(d, open("data/movzular.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for k in d:
    ws = sorted(set(t["hefte"] for t in d[k]))
    print(f"{k:11s} {len(d[k])} mövzu · {ws[0]} → {ws[-1]} · saat {sum(hours(k, t) for t in d[k]):.1f}")
    if k == "olimpiada": print("            rayon turuna qədər (2027-01-11):", sum(1 for t in d[k] if t['hefte'] <= '2027-01-11'), "mövzu")
