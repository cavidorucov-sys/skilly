# Week plan for all topics:  python tools/plan.py [YYYY-MM-DD start Monday]
# Weekly hours per track and hours per topic are estimates; re-run monthly with the real pace.
# Rules (agreed with the father, 20 Oct 2026):
#  - buraxılış first; every topic starts with the entry test, so review topics take ~1 h, others ~2,5 h; 4 h/week
#  - olympiad math: number theory, combinatorics and algebra basics before the district round, final-level topics after it; 3,5 h/week
#  - physics follows the FRİTL order (list order), 6 h/week; heat and electricity first, before the RFO district round (11 Nov 2026)
#  - a topic never starts before its prerequisites (any track); in the same week it comes after them.
#    Not-started topics are locked in the portal until their prerequisites are closed; topics in progress stay open
#    (taught at school now) and their prerequisites are pulled to the front (20 Oct 2026).
import json, sys, os, datetime as dt
os.chdir(os.path.join(os.path.dirname(__file__), ".."))
args = [a for a in sys.argv[1:] if not a.startswith("--")]
opt = dict(a[2:].split("=", 1) for a in sys.argv[1:] if a.startswith("--") and "=" in a)
start = dt.date.fromisoformat(args[0]) if args else dt.date(2026, 10, 19)
# Re-plan from a later week (--from=YYYY-MM-DD) keeping the topics Fikrət has already closed (--keep=file with their
# lesson links, e.g. read from the results): those keep their week; everything else is scheduled from that week on.
FROM = dt.date.fromisoformat(opt["from"]) if "from" in opt else start
KEEP = set(json.load(open(opt["keep"], encoding="utf-8"))) if "keep" in opt else set()
d = json.load(open("data/movzular.json", encoding="utf-8"))
OLD_WEEK = {k + ":" + t["ad"]: t.get("hefte") for k in d for t in d[k]}
KEPT = {k + ":" + t["ad"] for k in d for t in d[k] if t.get("ders") in KEEP}
CAP = {"riyaziyyat": 4.0, "olimpiada": 3.5, "fizika": 6.0}
REVIEW = {"Natural ədədlər: bölünmə əlamətləri, sadə vuruqlar, ƏBOB/ƏKOB", "Adi və onluq kəsrlər, dövri kəsrlər", "Tam və rasional ədədlər, ədəd oxu, modul",
          "Nisbət, tənasüb, düz və tərs mütənasiblik", "Faiz", "Cəbri ifadələr, sadələşdirmə", "Xətti tənliklər", "Bucaqlar, paralel və perpendikulyar düz xətlər",
          "Üçbucaqlar, bərabərlik əlamətləri", "Ölçü vahidləri və statistika: median, moda, diaqramlar", "Koordinat sistemi, funksiya anlayışı",
          "Çoxluqlar, Eyler-Venn diaqramı", "Xətti bərabərsizliklər", "Çoxhədlilər"}
OLY_CORE = {"Say nəzəriyyəsi", "Kombinatorika"}
# RFO physics district round (~mid-January, grades 7–9 textbooks): about half of its questions are heat and
# electricity, so these physics topics come first (father, 11 Nov 2026)
RAYON_FIRST = {"Temperatur, istidən genişlənmə, istilik miqdarı", "İstilik balansı, faza keçidləri, istilik mühərrikləri",
               "Elektrik yükü, Kulon qanunu, elektrik sahəsi", "Cərəyan, gərginlik, müqavimət", "Om qanunu, ardıcıl və paralel birləşmə",
               "Elektrik işi və gücü, Coul-Lens qanunu",
               "Kinetik və potensial enerji", "Enerjinin saxlanması"}  # the last two: heat balance builds on them
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
# topics in progress (taught at school now) stay open and keep their week; what they build on is closed first
ISL_NEED = closure([k + ":" + t["ad"] for k in d for t in d[k] if t["status"] == "isl"])
def prio(k, i, t):  # lower = earlier
    urgent = -2 if t["status"] == "isl" else -1 if k + ":" + t["ad"] in ISL_NEED else 0
    if k == "olimpiada": return (urgent, 0 if (t["bolme"] in OLY_CORE or t["ad"] in OLY_CORE_TOPICS or t["status"] == "isl") else 1, i)
    if k == "riyaziyyat": return (urgent, PHYS_NEED.get(k + ":" + t["ad"], 99), i)
    return (urgent, 0 if t["ad"] in RAYON_FIRST else 1, i)
# continuous time per track (in weeks). A topic starts when its track is free and all its prerequisites are FINISHED
# (the portal locks a lesson until they are closed). The track that is furthest behind moves next and takes the topic
# that can start earliest (ties: priority order), so a track never idles while some topic of it could already start.
week, start_at, end_at, order = {}, {}, {}, {}
w0 = (FROM - start).days / 7
clock = {k: w0 for k in d}
n = 0
for k in d:  # kept (closed) topics: their old week, finished before the re-plan starts
    for t in d[k]:
        key = k + ":" + t["ad"]
        if key in KEPT: week[key] = min((dt.date.fromisoformat(OLD_WEEK[key]) - start).days // 7, int(w0)); end_at[key] = w0; order[key] = n; n += 1
queue = {k: sorted((i for i in range(len(d[k])) if k + ":" + d[k][i]["ad"] not in KEPT), key=lambda i: prio(k, i, d[k][i])) for k in d}
while any(queue.values()):
    moved = False
    for k in sorted((k for k in d if queue[k]), key=lambda k: clock[k]):
        best = None
        # physics may spend its own hours closing the math topics it needs (when that lets it start sooner):
        # with strict prerequisite locks, physics would otherwise wait weeks for the 4 h/week math track
        cands = [(k, i) for i in queue[k]] + ([("riyaziyyat", i) for i in queue["riyaziyyat"] if "riyaziyyat:" + d["riyaziyyat"][i]["ad"] in PHYS_NEED] if k == "fizika" else [])
        for kk, i in cands:
            t = d[kk][i]; pre = [] if t["status"] == "isl" else [p for p in t.get("on", []) if p.split(":", 1)[0] in d]
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
            if p in week and t["status"] != "isl" and k + ":" + t["ad"] not in KEPT: assert week[p] <= week[k + ":" + t["ad"]], (t["ad"], p)
json.dump(d, open("data/movzular.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
for k in d:
    ws = sorted(set(t["hefte"] for t in d[k]))
    print(f"{k:11s} {len(d[k])} mövzu · {ws[0]} → {ws[-1]} · saat {sum(hours(k, t) for t in d[k]):.1f}")
    if k == "olimpiada": print("            rayon turuna qədər (2027-01-11):", sum(1 for t in d[k] if t['hefte'] <= '2027-01-11'), "mövzu")
