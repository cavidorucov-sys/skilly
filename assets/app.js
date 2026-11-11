// Portal shell + page renderers. Every page is <body data-page="..."> and gets the same rail and top navigation.
const NAV = [
  // daily → study → check yourself → reference
  ["index.html", "Ana səhifə", "House"], ["riyaziyyat.html", "Buraxılış", "GraduationCap"], ["olimpiada.html", "Olimpiada", "Trophy"],
  ["sinaqlar.html", "Sınaqlar", "ClipboardCheck"], ["temrar.html", "Təkrar", "Repeat"],
  ["dusturlar.html", "Düsturlar", "Sigma"], ["teqvim.html", "Təqvim", "Calendar"],
];
const NAV_SUB = {
  "olimpiada.html": [["olimpiada.html#riyaziyyat", "Riyaziyyat", "Pi"], ["olimpiada.html#fizika", "Fizika", "Atom"]],
  "sinaqlar.html": [["sinaqlar.html#riyaziyyat", "Riyaziyyat", "Pi"], ["sinaqlar.html#fizika", "Fizika", "Atom"]],
  "dusturlar.html": [["dusturlar.html#riyaziyyat", "Riyaziyyat", "Pi"], ["dusturlar.html#fizika", "Fizika", "Atom"]],
};
// pages whose subject comes from the nav sub-item (#riyaziyyat / #fizika): marks the sub-item, returns the key
function subjectFromHash() {
  const k = location.hash.slice(1) === "fizika" ? "fizika" : "riyaziyyat";
  document.querySelectorAll(".nav-dd .dd a").forEach(a => a.getAttribute("href").endsWith(location.pathname.split("/").pop() + "#" + k) || a.getAttribute("href") === (location.pathname.split("/").pop() || "index.html") + "#" + k
    ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"));
  return k;
}
function onSubject(draw) { const run = () => draw(subjectFromHash()); run(); window.addEventListener("hashchange", run); }
const KAT = {
  math: { cls: "k-math", ink: "var(--math-ink)", ad: "Riyaziyyat" },
  olym: { cls: "k-olym", ink: "var(--olym-ink)", ad: "Olimpiada" },
  phys: { cls: "k-phys", ink: "var(--phys-ink)", ad: "Fizika" },
  proj: { cls: "k-proj", ink: "var(--proj-ink)", ad: "Layihə" },
  misc: { cls: "k-misc", ink: "var(--misc-ink)", ad: "Digər" },
};
const SUBJ_KAT = { riyaziyyat: "math", olimpiada: "olym", fizika: "phys" };
// Lucide icons, self-hosted in assets/icons.js. Subject → icon; individual items get a more specific one.
const ICON = { math: "Pi", olym: "Trophy", phys: "Atom", proj: "FlaskConical", misc: "CalendarCheck" };
const ITEM_ICON = [
  [/sınağ|sınaq/i, "ClipboardCheck"], [/experiment|ölçmə|analiz|readme/i, "FlaskConical"], [/olimpiada/i, "Trophy"],
  [/fritl|fizika|maili/i, "Atom"], [/cüdo/i, "Dumbbell"], [/səhv/i, "NotebookPen"], [/esse/i, "PenLine"],
  [/məktub|baxış/i, "Mail"], [/triqonometriya|funksiya|riyaziyyat/i, "Pi"],
];
const iconFor = (kat, text) => (ITEM_ICON.find(([re]) => re.test(text || "")) || [0, ICON[kat] || ICON.misc])[1];
// Topic → icon, matched on the topic name (first match wins).
const TOPIC_ICON = [
  [/irrasional|kök/i, "Radical"], [/natural|sadə ədəd/i, "Hash"], [/modul arifmetika|qalıq/i, "RotateCw"], [/^modul/i, "Brackets"], [/faiz/i, "Percent"],
  [/cəbri ifadə/i, "Variable"], [/çoxhədli/i, "Sigma"], [/qısa vurma/i, "SquareFunction"], [/vuruqlara/i, "Split"],
  [/tənliklər sistemi/i, "Layers"], [/bərabərsizli/i, "Scale"], [/viyet/i, "Key"], [/kəsr/i, "Divide"], [/kvadrat tənlik/i, "Spline"], [/xətti tənlik/i, "Equal"],
  [/koordinat/i, "Grid3x3"], [/xətti funksiya/i, "ChartLine"], [/funksiya|parabola/i, "ChartSpline"],
  [/ədədi silsilə/i, "ListOrdered"], [/həndəsi silsilə/i, "TrendingUp"], [/sin, cos|triqonometriya|pifaqor/i, "TriangleRight"],
  [/ehtimal/i, "Dices"], [/üçbucaq/i, "Triangle"], [/dördbucaq/i, "Square"], [/trapesiya/i, "Shapes"], [/sahə/i, "SquareDashed"],
  [/toxunan/i, "CircleDot"], [/çevrə üzrə/i, "RotateCw"], [/çevrə/i, "Circle"],
  [/bölünmə/i, "Divide"], [/əbob|evklid/i, "Repeat"], [/paritet/i, "ToggleLeft"], [/invariant/i, "Anchor"], [/sayma/i, "Tally5"],
  [/dirixle/i, "Boxes"], [/induksiya/i, "Workflow"],
  [/kəmiyyət|si vahid/i, "Ruler"], [/ölçmə/i, "Gauge"], [/hərəkət/i, "ChartLine"], [/sərbəst düşmə/i, "ArrowDownToLine"],
  [/nyuton/i, "Move"], [/sürtünmə|maili/i, "Mountain"], [/huk|elastik/i, "Spline"], [/mexaniki iş/i, "Weight"],
  [/kinetik|potensial/i, "Rocket"], [/enerjinin saxlanması/i, "Battery"], [/impuls|toqquşma/i, "CircleDot"], [/moment|tarazlıq/i, "Scale"],
  [/rəqqas/i, "Activity"], [/təzyiq|paskal/i, "Droplets"], [/arximed/i, "Ship"], [/temperatur/i, "Thermometer"], [/istilik|faza/i, "Flame"],
  [/om qanunu/i, "PlugZap"], [/yük|cərəyan|gərginlik/i, "Zap"], [/coul|elektrik işi/i, "Lightbulb"], [/işığ/i, "Sun"],
];
const topicIcon = t => (TOPIC_ICON.find(([re]) => re.test(t.ad)) || [0, ICON[t.kat] || ICON.misc])[1];
function icon(name, color) {
  const node = window.ICONS && ICONS[ICON[name] || name];
  if (!node) return el("span", { "aria-hidden": "true" });
  const NS = "http://www.w3.org/2000/svg", s = document.createElementNS(NS, "svg");
  const attrs = { viewBox: "0 0 24 24", fill: "none", stroke: color || "currentColor", "stroke-width": "1.75", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true" };
  for (const k in attrs) s.setAttribute(k, attrs[k]);
  node.forEach(([tag, a]) => { const c = document.createElementNS(NS, tag); for (const k in a) c.setAttribute(k, a[k]); s.append(c); });
  return s;
}
function el(tag, attrs, ...kids) {
  const e = document.createElement(tag);
  for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
  kids.flat().forEach(k => k != null && e.append(k));
  return e;
}
// one of the two accounts was signed in on this device at the last check (jurnal.js keeps "skilly-user")
const signedHere = () => { try { return String(JSON.parse(localStorage.getItem("skilly-user")) || "").includes("@"); } catch (e) { return false; } };
async function load(path) {
  const r = await fetch(path, { cache: "no-cache" });
  if (!r.ok) throw new Error(path + " " + r.status);
  const j = await r.json();
  // topics whose final test was passed (on any device, via the cloud) are closed on every page
  if (path.endsWith("movzular.json")) { const bag = passedHere(); for (const k in j) j[k].forEach(t => { if (t.ders && bag.includes(t.ders)) t.status = "bag"; }); }
  // statuses and the open-in-order rule are Fikrət's: other viewers see every topic not started and every lesson open
  // (acig), with the same "close these first" note on top
  if (path.endsWith("movzular.json") && !signedHere()) for (const k in j) j[k].forEach(t => { if (t.status === "isl") t.status = "yox"; t.acig = true; });
  return j;
}
// statuses are shown by icon and colour; the word stays only as a tooltip and for screen readers
const ST = { yox: ["Başlanmayıb", "st-yox", "CircleDashed"], isl: ["İşlənir", "st-isl", "Clock"], bag: ["Bağlanıb", "st-bag", "CircleCheck"] };
const stMark = ([txt, cls, ic]) => el("span", { class: "sti " + cls, title: txt, "aria-label": txt, role: "img" }, icon(ic));
const stPill = s => stMark(ST[s] || ST.yox);
const isoToday = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const daysLeft = (from, to) => { const n = Math.round((new Date(to) - new Date(from)) / 864e5); return t2(to) + " · " + (n === 0 ? "bu gün" : n === 1 ? "sabah" : n + " gün"); };
const t2 = iso => iso.slice(8) + "." + iso.slice(5, 7);
const fmtH = h => String(h).replace(".", ",");

// topics whose final test was passed on this device count as closed (until the data file catches up)
const passedHere = () => { try { return JSON.parse(localStorage.getItem("skilly-bag") || "[]"); } catch (e) { return []; } };
const LIST_KAT = { riyaziyyat: "math", olimpiada: "olym", fizika: "phys" };
function topicIndex(m) { const ix = {}; for (const k in m) m[k].forEach(t => { ix[k + ":" + t.ad] = { ...t, list: k }; }); return ix; }
const isClosed = t => t && (t.status === "bag" || (t.ders && passedHere().includes(t.ders)));
const missingPrereqs = (t, ix) => (t.on || []).map(id => ix[id]).filter(x => x && !isClosed(x));
// everything still to close below a topic, and the ones of them that can be opened right now (in plan order)
function openChain(t, ix) {
  const all = new Map(), stack = missingPrereqs(t, ix);
  while (stack.length) { const x = stack.pop(), id = x.list + ":" + x.ad; if (all.has(id)) continue; all.set(id, x); stack.push(...missingPrereqs(x, ix)); }
  const pos = Object.keys(ix), list = [...all.values()];
  const now = list.filter(x => x.ders && (x.status === "isl" || x.acig || !missingPrereqs(x, ix).length))
    .sort((a, b) => (a.hefte || "").localeCompare(b.hefte || "") || pos.indexOf(a.list + ":" + a.ad) - pos.indexOf(b.list + ":" + b.ad));
  return { total: list.length, now };
}
const weekLabel = iso => { const d = new Date(iso + "T12:00"); return d.getDate() + " " + AY[d.getMonth()].slice(0, 3); };
function allTopics(m) {
  const bag = passedHere();
  return Object.entries(m).flatMap(([subj, rows]) => rows.map(r => ({ ...r, subj, kat: SUBJ_KAT[subj], status: r.ders && bag.includes(r.ders) ? "bag" : r.status })));
}

/* ---------- shell ---------- */
// Google sign-in: results and the error journal then follow Fikrət to every device
function account() {
  const box = el("div", { class: "acct" });
  const draw = email => {
    if (email) {
      const out = el("button", { type: "button", class: "acct-btn ghost" }, "Çıx");
      out.addEventListener("click", async () => { await Skilly.signOut(); location.reload(); });
      box.replaceChildren(el("span", { class: "acct-on", title: email }, "✓ " + email.split("@")[0]), out,
        Skilly.viewer() ? el("span", { class: "acct-view", title: "Cavablarınız Fikrətin nəticəsi kimi yazılmır" }, "baxış rejimi") : null);
    } else {
      const btn = el("button", { type: "button", class: "acct-btn" }, "Google ilə daxil ol");
      const err = el("span", { class: "acct-err" });
      btn.addEventListener("click", async () => {
        btn.disabled = true; err.textContent = "";
        try { await Skilly.signIn(); location.reload(); } catch (e) { err.textContent = e.message || "Alınmadı"; btn.disabled = false; }
      });
      box.replaceChildren(btn, err);
    }
  };
  if (window.Skilly && Skilly.user) Skilly.user().then(draw);
  return box;
}

async function shell(content) {
  const here = location.pathname.split("/").pop() || "index.html";
  // the week plan is private: it opens only for the two signed-in accounts (w = null for everyone else)
  // the three files are fetched together: each one is a round trip to the server
  const termP = load("data/terminler.json").catch(() => []);
  const [m, w0] = await Promise.all([load("data/movzular.json"), window.Skilly ? Skilly.gizli("hefte") : null]).catch(() => [null, null]);
  const w = pickWeek(w0);
  const topics = m ? allTopics(m) : [];
  const closed = topics.filter(t => t.status === "bag").length, total = topics.length || 1;
  const pct = Math.round(closed / total * 100);
  const C = 2 * Math.PI * 100;
  const ring = el("div", { class: "ring" });
  ring.innerHTML = `<svg viewBox="0 0 220 220"><circle cx="110" cy="110" r="100" fill="none" style="stroke:var(--rail-2)" stroke-width="2"/>
    <circle cx="110" cy="110" r="100" fill="none" style="stroke:var(--rail-ink)" stroke-width="2" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>`;
  ring.append(el("div", { class: "v" }, el("div", { class: "big" }, String(closed)), el("div", { class: "lbl" }, `${total} mövzudan bağlanıb`, el("br"), `${total - closed} qalıb · ${pct}%`)));
  requestAnimationFrame(() => requestAnimationFrame(() => { ring.querySelectorAll("circle")[1].style.strokeDashoffset = C * (1 - Math.max(pct, 1) / 100); }));
  const term = await termP;
  const exam = term.find(t => t.tarix >= isoToday() && t.ad.startsWith("Buraxılış"));
  const toExam = exam ? Math.round((new Date(exam.tarix) - new Date(isoToday())) / 864e5) : "–";
  // collapsible rail; the choice is remembered on this device
  let collapsed = false; try { collapsed = localStorage.getItem("skilly-rail") === "1"; } catch (e) {}
  const toggle = el("button", { class: "rail-toggle", type: "button" });
  const setRail = c => {
    collapsed = c; document.documentElement.classList.toggle("rail-min", c);
    toggle.setAttribute("aria-label", c ? "Paneli aç" : "Paneli yığ"); toggle.setAttribute("aria-expanded", String(!c));
    toggle.replaceChildren(icon(c ? "PanelLeftOpen" : "PanelLeftClose"));
    try { localStorage.setItem("skilly-rail", c ? "1" : "0"); } catch (e) {}
  };
  toggle.addEventListener("click", () => setRail(!collapsed));
  setRail(collapsed);
  // light / dark theme (assets/tema.js); the open lesson frame follows through the storage event
  const theme = el("button", { class: "rail-toggle", type: "button" });
  const showTheme = () => {
    const dark = window.SkillyTema && SkillyTema.get() === "dark";
    theme.setAttribute("aria-label", dark ? "İşıqlı rejim" : "Qaranlıq rejim"); theme.title = theme.getAttribute("aria-label");
    theme.replaceChildren(icon(dark ? "Sun" : "Moon"));
  };
  theme.addEventListener("click", () => { if (window.SkillyTema) SkillyTema.toggle(); showTheme(); });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", showTheme);
  showTheme();
  // the name of whoever is signed in on this device (the sign-in remembers the e-mail)
  let me = ""; try { me = { "orujov.fikret@gmail.com": "Fikrət", "cavid.orucov@gmail.com": "Cavid" }[JSON.parse(localStorage.getItem("skilly-user") || '""')] || ""; } catch (e) {}
  if (!w) me = "";
  const rail = el("aside", { class: "rail" },
    el("div", { class: "rail-top" }, el("a", { class: "logo", href: "index.html", "aria-label": "Skilly" }, el("span", { class: "logo-mark", "aria-hidden": "true" }), el("span", { class: "logo-full" }, "Skilly")), el("div", { class: "rail-btns" }, theme, toggle)),
    el("div", { class: "who" }, el("div", { class: "avatar" }, me ? me[0] : "S"), el("b", {}, me || "Skilly"), el("span", {}, me === "Cavid" ? "Valideyn" : "9-cu sinif · 2026–27"), w ? el("span", { class: "chip" }, w.hefte) : null, account()),
    ring,
    el("div", { class: "minis" },
      el("div", { class: "mini" }, el("i", {}, String(toExam)), "gün sınağa"),
      el("div", { class: "mini" }, el("i", {}, String(topics.filter(t => t.status === "isl").length)), "işlənir"),
      el("div", { class: "mini" }, el("i", {}, String(topics.filter(t => t.ders).length)), "dərs"),
      el("div", { class: "mini" }, el("i", {}, String(topics.length)), "mövzu")));
  const nav = el("nav", { class: "topnav", "aria-label": "Bölmələr" },
    NAV.filter(([href]) => w || href !== "temrar.html").map(([href, label, ic]) => { // review: the two accounts only
      const link = el("a", href === here ? { href, "aria-current": "page" } : { href }, icon(ic), el("span", {}, label));
      const sub = NAV_SUB[href];
      if (!sub) return link;
      // dropdown on hover / keyboard focus (desktop); on phones the page has the same choices as tabs
      link.append(icon("ChevronDown"));
      const dd = el("div", { class: "dd" }, ...sub.map(([h, l, i]) => el("a", { href: h }, icon(i), el("span", {}, l))));
      const box = el("div", { class: "nav-dd" }, link, dd);
      link.addEventListener("click", ev => {
        if (!matchMedia("(max-width:980px)").matches) return;
        ev.preventDefault();
        const open = !box.classList.contains("open");
        box.classList.remove("shut");
        document.querySelectorAll(".nav-dd.open").forEach(x => x.classList.remove("open"));
        if (open) { const r = link.getBoundingClientRect(); dd.style.left = Math.min(r.left, innerWidth - 210) + "px"; dd.style.top = r.bottom + 6 + "px"; box.classList.add("open"); }
      });
      // a choice closes the menu: most choices only change the #hash on the same page, so nothing reloads and the
      // menu would stay open under the pointer and keyboard focus; it opens again once the pointer leaves and returns
      dd.addEventListener("click", ev => { if (!ev.target.closest("a")) return;
        box.classList.remove("open"); box.classList.add("shut"); if (document.activeElement) document.activeElement.blur(); });
      box.addEventListener("mouseleave", () => box.classList.remove("shut"));
      return box;
    }));
  document.body.replaceChildren(el("div", { class: "app" }, rail, el("section", { class: "work" }, nav, content)));
  return { m, w, topics, term };
}

/* ---------- pages ---------- */
function topicCard(t) {
  const k = KAT[t.kat] || KAT.misc;
  const a = el(t.ders ? "a" : "div", t.ders ? { class: "ccard fade " + k.cls, href: t.ders } : { class: "ccard fade " + k.cls },
    el("div", { class: "ic" }, icon(topicIcon(t), k.ink)),
    el("div", { class: "t" }, t.ad));
  // one short line under the title: why it is next, otherwise the section; a progress bar only when steps are tracked
  if (t.addim) a.append(el("div", { class: "bar" }, el("i", { style: `width:${Math.round(t.addim[0] / t.addim[1] * 100)}%` })));
  a.append(el("div", { class: "meta" }, el("span", {}, t.sebeb || t.bolme), t.ders ? el("span", { class: "open" }, "Dərsi aç →") : null));
  return a;
}

// Home = "what do I do now": today's plan first, then what needs attention, the week, and the next dates.
const GUN = ["Bazar", "Bazar ertəsi", "Çərşənbə axşamı", "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"];
const AY = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avqust", "sentyabr", "oktyabr", "noyabr", "dekabr"];
const hm = () => { const d = new Date(); return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0"); };
const span = t => t.split("–").map(x => x.trim());
const mins = t => { const [a, b] = span(t).map(x => { const [h, m] = x.split(":"); return +h * 60 + +m; }); return b - a; };

async function pageIndex() {
  const content = el("div", { style: "margin-top:30px" });
  const { w, term } = await shell(content);
  if (!w) { content.append(el("section", { class: "today" }, el("p", { class: "eyebrow" }, "Skilly"), el("h1", {}, "Riyaziyyat və fizika: dərslər, oyunlar, sınaqlar"),
    el("p", { class: "lead" }, "Mövzular soldakı bölmələrdədir. Şəxsi plan yalnız hesabla daxil olanda görünür."))); return; }
  const today = isoToday(), now = hm(), d = new Date();
  const day = (w.butun || w.gunler).find(g => g.tarix === today) || (w.butun || w.gunler).find(g => g.tarix > today);
  const isToday = day && day.tarix === today;

  // 1. today
  const total = day ? day.isler.filter(t => t.kat !== "misc" || /esse|səhv/i.test(t.is)).reduce((n, t) => n + mins(t.saat), 0) : 0;
  const hero = el("section", { class: "today" },
    el("p", { class: "eyebrow" }, isToday ? "Bu gün" : "Növbəti iş günü"),
    el("h1", {}, day ? `${GUN[new Date(day.tarix + "T12:00").getDay()]}, ${+day.tarix.slice(8)} ${AY[+day.tarix.slice(5, 7) - 1]}` : `${GUN[d.getDay()]}, ${d.getDate()} ${AY[d.getMonth()]}`),
    day ? el("p", { class: "lead" }, `${day.isler.length} iş · hazırlıq ${fmtH(Math.round(total / 6) / 10)} saat`) : null);
  const list = el("div", { class: "agenda" });
  if (!day) list.append(el("p", { class: "empty" }, "Bu həftənin planı bitib. Yeni cədvəl bazar axşamı gələcək."));
  else {
    let nextMarked = false;
    // what is really done: a lesson item when its topic is closed, the review item when nothing is waiting there;
    // other items (FRİTL, cüdo, esse) are not tracked here, so a past one only says its time is over
    if (window.Skilly) await Skilly.ready;
    const left = window.Skilly ? Skilly.dueReviews().reduce((n, r) => n + r.n, 0) + (Skilly.sehvOn ? Skilly.all().filter(e => e.status !== "baglandi").length : 0) : 0;
    const doneOf = t => /^dersler\//.test(t.link || "") ? passedHere().includes(t.link) : t.link === "temrar.html" ? left === 0 : null;
    day.isler.forEach(t => {
      const [from, to] = span(t.saat), k = KAT[t.kat] || KAT.misc, done = doneOf(t);
      const state = !isToday ? "" : now >= to ? "past" : now >= from ? "now" : (!nextMarked ? (nextMarked = true, "next") : "");
      const note = done ? (t.link === "temrar.html" ? "edilib ✓" : "bağlanıb ✓")
        : state === "past" ? (done === false ? "vaxtı keçdi — " + (t.link === "temrar.html" ? "edilməyib" : "bağlanmayıb") : "vaxtı keçdi")
        : state === "now" ? "indi" : state === "next" ? "növbəti" : k.ad;
      const row = el(t.link ? "a" : "div", { class: "ag " + state + (state === "past" && done === false ? " miss" : ""), ...(t.link ? { href: t.link } : {}) },
        el("span", { class: "ag-time" }, from, el("small", {}, to)),
        el("span", { class: "ag-ic " + k.cls }, icon(iconFor(t.kat, t.is), k.ink)),
        el("span", { class: "ag-tx" }, el("b", {}, t.is + (t.link === "temrar.html" && window.Skilly ? ` · ${reviewQueue().nowQ} sual` : "")), el("small", {}, note)),
        t.link ? el("span", { class: "ag-go" }, "Aç →") : null);
      list.append(row);
    });
  }
  hero.append(list);
  content.append(hero);

  // 2. needs attention: the error journal (only while it is switched on)
  if (window.Skilly && Skilly.sehvOn) {
    await Skilly.ready;
    const open = Skilly.all().filter(e => e.status !== "baglandi").length;
    if (open) content.append(el("a", { class: "attn", href: "temrar.html" },
      el("span", { class: "ag-ic k-misc" }, icon("NotebookPen")),
      el("span", { class: "ag-tx" }, el("b", {}, "Səhv jurnalı"), el("small", {}, `${open} sual yenidən həll gözləyir`)),
      el("span", { class: "ag-go" }, "Aç →")));
  }

  // 2b. topics planned to start this week
  const monday = (() => { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); })();
  const mm = await load("data/movzular.json").catch(() => null);
  const thisWeek = mm ? Object.entries(mm).flatMap(([k, v]) => v.filter(t => t.hefte === monday && t.status !== "bag").map(t => ({ ...t, kat: LIST_KAT[k] }))) : [];
  if (thisWeek.length) content.append(el("section", { class: "home-sec" }, el("div", { class: "head" }, el("h2", {}, "Bu həftənin mövzuları"), el("span", { class: "more" }, thisWeek.length + " mövzu")),
    el("div", { class: "list dl" }, ...thisWeek.map(t => { const k = KAT[t.kat]; return el(t.ders ? "a" : "div", { class: "row", ...(t.ders ? { href: t.ders, style: "text-decoration:none;color:inherit" } : {}) },
      el("span", { class: "ic " + k.cls }, icon(topicIcon(t), k.ink)), el("div", { class: "tx sf" }, el("span", {}, k.ad + " · " + t.bolme + (t.saat === "fizika" ? " · fizika saatında" : "")), el("b", { title: t.ad }, t.ad)), stPill(t.status)); }))));

  // 3. the week
  const days = el("div", { class: "days" }, ...w.gunler.map(g => el("div", { class: "dcol" },
    el("div", { class: "dname" + (g.tarix === today ? " today" : "") }, g.qisa + " " + g.tarix.slice(8)),
    ...g.isler.map(t => { const k = KAT[t.kat] || KAT.misc; return el(t.link ? "a" : "div", t.link ? { class: "slot " + k.cls, href: t.link } : { class: "slot " + k.cls }, el("small", {}, icon(iconFor(t.kat, t.is), k.ink), t.saat), t.is); }))));
  content.append(el("section", { class: "home-sec" }, el("div", { class: "head" }, el("h2", {}, "Bu həftə"), el("span", { class: "more" }, w.hefte)), days));

  // 4. next dates (three; the rest are in the calendar)
  const upcoming = term.filter(t => t.tarix >= today).slice(0, 3);
  if (upcoming.length) content.append(el("section", { class: "home-sec" },
    el("div", { class: "head" }, el("h2", {}, "Qarşıdakı tarixlər"), el("a", { class: "more", href: "teqvim.html" }, "Təqvim →")),
    el("div", { class: "list dl" }, ...upcoming.map(t => { const k = KAT[t.kat] || KAT.misc; return el("div", { class: "row" },
      el("span", { class: "ic " + k.cls }, icon(iconFor(t.kat, t.ad), k.ink)),
      el("div", { class: "tx" }, el("b", {}, t.ad), el("span", {}, t.qeyd || k.ad)),
      el("span", { class: "badge " + k.cls }, daysLeft(today, t.tarix))); }))));
}

async function pageTopics(key, title, lead) {
  const content = el("div", { style: "margin-top:30px" }, el("h1", {}, title));
  const { m } = await shell(content);
  if (!m) { content.append(el("p", { class: "empty" }, "Siyahı yüklənmədi.")); return; }
  renderTopics(content, m, key, lead);
}

// Olympiad page: one entry in the nav, math and physics as tabs (#riyaziyyat / #fizika).
async function pageOlympiad() {
  // the subject is chosen in the nav (dropdown on desktop, two items on phones); the page shows one subject
  const SUBJ = {
    riyaziyyat: ["Riyaziyyat olimpiadası", "Hər mövzuya ~2 həftə: dərs və 12–15 məşq sualı, sonra 5–6 olimpiada məsələsi (həll kağızda yazılır, şəkli göndərilir) və yekun test."],
    fizika: ["Fizika olimpiadası", "FRİTL-də keçilən hər mövzu növbəti həftə burada təkrarlanır: sadə izah, məşq, test. FRİTL-in keçmədiyi mövzular ayrıca əlavə olunur."],
  };
  const h1 = el("h1"), body = el("div");
  const { m } = await shell(el("div", { style: "margin-top:30px" }, h1, body));
  if (!m) { body.append(el("p", { class: "empty" }, "Siyahı yüklənmədi.")); return; }
  function draw(k) {
    h1.textContent = SUBJ[k][0]; document.title = SUBJ[k][0] + " · Skilly";
    body.replaceChildren(); renderTopics(body, m, SUBJ_KAT_KEY[k], SUBJ[k][1]);
    if (k === "fizika") body.firstChild.after(rfoBlock(m)); // under the count line, above the topic cards
  }
  onSubject(draw);
}
// RFO physics (father, 11 Nov 2026): the guide and the district-round mock, which opens when all its topics are closed
function rfoBlock(m) {
  const k = KAT.phys;
  const row = (ic, title, sub, right, href) => el("a", { class: "row", href },
    el("span", { class: "ic " + k.cls }, icon(ic, k.ink)), el("div", { class: "tx" }, el("b", {}, title), sub), right);
  const byLink = {}; m.fizika.forEach(t => { byLink[t.ders] = t; });
  // one row per stage mock: locked (how many of its topics are closed) or open
  const mockRow = (sim, title, fmt) => {
    const go = el("span", { class: "go wait" }, "…"), sub = el("span", {}, fmt);
    load("data/rfo-" + sim + ".json").then(cfg => {
      const links = (cfg.qruplar || []).flatMap(g => g.movzular.map(x => "dersler/" + x.slug + ".html")).concat((cfg.movzular || []).map(x => "dersler/" + x.slug + ".html"));
      const open = links.filter(l => !isClosed(byLink[l])).length;
      sub.textContent = open ? `🔒 ${links.length - open} / ${links.length} mövzu bağlanıb — hamısı bağlananda açılır` : "Açıqdır · " + fmt;
      go.textContent = open ? "Bax →" : "Başla →"; go.classList.toggle("wait", !!open);
    }).catch(() => {});
    return row("ClipboardCheck", title, sub, go, "ders.html?p=rfo-" + sim);
  };
  return el("section", { class: "e-sec rfo-list" }, el("div", { class: "head" }, el("h2", {}, "RFO fizika 2026-27")), el("div", { class: "list" },
    row("FileText", "Təlimat: olimpiada necə keçir", el("span", {}, "Mərhələlər, imtahan formatı, strategiya, hazırlıq planı"), el("span", { class: "go" }, "Oxu →"), "ders.html?p=rfo-telimat"),
    mockRow("rayon", "Rayon turu simulyasiyası", "20 sual · 150 dəqiqə · səhvə −1/4"),
    mockRow("yarimfinal", "Yarımfinal simulyasiyası", "20 sual · 120 dəqiqə · 4/5/6 bal · səhvə −1/4"),
    mockRow("final", "Final simulyasiyası", "3 məsələ · 3 saat · yazılı həll; evdə eksperiment")));
}
const SUBJ_KAT_KEY = { riyaziyyat: "olimpiada", fizika: "fizika" };

// search field in our style: magnifier on the left, our own clear (×) button on the right, live filtering on input
function searchBox(label, placeholder, onInput) {
  const input = el("input", { class: "search", type: "search", "aria-label": label, placeholder, autocomplete: "off", spellcheck: "false" });
  const clear = el("button", { type: "button", class: "sclear", "aria-label": "Təmizlə", hidden: "" }, icon("X"));
  const sync = () => { clear.hidden = !input.value; onInput(input.value.trim().toLocaleLowerCase("az")); };
  input.addEventListener("input", sync);
  input.addEventListener("keydown", e => { if (e.key === "Escape" && input.value) { input.value = ""; sync(); } });
  clear.addEventListener("click", () => { input.value = ""; sync(); input.focus(); });
  const box = el("div", { class: "sbox" }, el("span", { class: "sicon" }, icon("Search")), input, clear);
  box.input = input; box.reset = () => { input.value = ""; clear.hidden = true; };
  return box;
}

function renderTopics(content, m, key, lead) {
  // no description here: how a topic is passed is explained on every lesson page ("Necə keçmək")
  const rows = m[key], kat = SUBJ_KAT[key];
  const c = s => rows.filter(r => r.status === s).length;
  content.append(el("p", { class: "lead" }, `${rows.length} mövzu · bağlanıb ${c("bag")} · işlənir ${c("isl")} · başlanmayıb ${c("yox")}`));
  const inProgress = rows.filter(r => r.status === "isl").map(r => ({ ...r, kat }));
  // cards: topics in progress; if none yet, the next three to start, so every subject page looks the same
  const planned = rows.filter(r => r.status === "yox" && r.novbeti).sort((x, y) => x.novbeti - y.novbeti);
  const upNext = (planned.length ? planned : rows.filter(r => r.status === "yox")).slice(0, 3).map(r => ({ ...r, kat }));
  const shown = inProgress.length ? inProgress : upNext;
  if (shown.length) content.append(el("h2", { class: "cards-h" }, inProgress.length ? "İşlənir" : "Başlanacaq"), el("div", { class: "cards" }, ...shown.map(topicCard)));
  // learning order: prerequisites always come first; each row shows its planned week and what must be closed before it
  const ix = topicIndex(m), tb = el("tbody");
  rows.forEach((r, i) => {
    const k = KAT[kat] || KAT.misc, miss = missingPrereqs(r, ix);
    tb.append(el("tr", { "data-q": (r.ad + " " + r.bolme).toLocaleLowerCase("az") }, el("td", { class: "n" }, String(i + 1).padStart(2, "0")),
      el("td", {}, el("div", { class: "tname" }, el("span", { class: "tic " + k.cls }, icon(topicIcon({ ...r, kat }), k.ink)),
        el("span", { class: "tcol" }, el("span", {}, r.ad, r.fritl ? el("span", { class: "tag" }, "FRİTL") : null),
          el("small", {}, r.bolme + (miss.length && r.status !== "bag" ? " · əvvəl: " + miss.map(x => x.ad.split(/[:,(]/)[0].trim()).join(", ") : ""))))),
      el("td", { class: "wk" }, r.hefte ? weekLabel(r.hefte) : ""),
      el("td", {}, stPill(r.status)),
      el("td", { class: "act" }, r.ders ? el("a", { class: "go" + (miss.length && r.status === "yox" && !r.acig ? " wait" : ""), href: r.ders }, miss.length && r.status === "yox" && !r.acig ? "Gözləyir" : "Dərsi aç →") : el("span", { class: "soon" }, "tezliklə"))));
  });
  // live search over the topic list (name and section)
  const count = el("p", { class: "count" }), none = el("p", { class: "empty", hidden: "" }, "Tapılmadı.");
  const filter = s => { let n = 0; [...tb.rows].forEach(tr => { const ok = !s || tr.dataset.q.includes(s); tr.hidden = !ok; n += ok; });
    count.textContent = s ? `${n} / ${rows.length} mövzu` : ""; none.hidden = n > 0; };
  content.append(searchBox("Mövzu axtar", "Axtar: mövzu və ya bölmə…", filter), count, none);
  content.append(el("div", { class: "tbl" }, el("table", { class: "mt" }, el("thead", {}, el("tr", {}, el("th", {}, "№"), el("th", {}, "Mövzu"), el("th", {}, "Həftə"), el("th", {}, "Vəziyyət"), el("th", {}, ""))), tb)));
}

async function pageFormulas() {
  // short page: topics come folded (heading + count), cards show only name and formula (details on click),
  // and a filter keeps just the topics Fikrət works with; typing a search opens every matching topic
  const FENN = { riyaziyyat: ["Riyaziyyat", "Axtar: sin, diskriminant, parabola…"], fizika: ["Fizika", "Axtar: təcil, impuls, Om…"] };
  const FILTER = { all: "Hamısı", week: "Bu həftə", isl: "İşlənir", bag: "Bağlanıb" };
  const h1 = el("h1"), list = el("div"), sb = searchBox("Düstur axtar", "", () => draw()), q = sb.input;
  let filter = "all";
  const fseg = seg(FILTER, k => { filter = k; draw(); }, "all");
  const { m } = await shell(el("div", { style: "margin-top:30px" }, h1, el("p", { class: "lead" }, "Mövzunu aç, düstura bas — nə vaxt işlədildiyi, tipik səhv və dərsə keçid görünəcək."), sb, el("div", { class: "fbar" }, fseg), list));
  const all = await load("data/dusturlar.json").catch(() => []);
  const byPage = {}; if (m) for (const k in m) m[k].forEach(t => { if (t.ders && !byPage[t.ders]) byPage[t.ders] = t; });
  const monday = (() => { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 6) % 7)); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); })();
  const keep = x => { const t = byPage[x.ders]; if (filter === "all") return true; if (!t) return false;
    return filter === "week" ? t.hefte === monday && !isClosed(t) : filter === "isl" ? t.status === "isl" && !isClosed(t) : isClosed(t); };
  let fenn = "Riyaziyyat";
  const card = x => { const more = el("div", { class: "fmore", hidden: "" }, el("div", { class: "note" }, x.nevaxt || ""),
      x.sehv ? el("div", { class: "err" }, "Tipik səhv: " + x.sehv) : null, x.ders ? el("a", { href: x.ders }, "İzahı dərsdə →") : null);
    const c = el("div", { class: "fcard", role: "button", tabindex: "0", "aria-expanded": "false" },
      el("div", { class: "m" }, x.ad), el("div", { class: "fx" }, ...x.fx.split(";").map(f => el("span", {}, f.trim()))), more);
    const flip = e => { if (e.target.closest("a")) return; const open = more.hidden; more.hidden = !open; c.setAttribute("aria-expanded", String(open)); };
    c.addEventListener("click", flip); c.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(e); } });
    return c; };
  function draw() {
    const s = q.value.trim().toLocaleLowerCase("az"); list.replaceChildren();
    const inTab = all.filter(x => x.fenn === fenn && keep(x));
    const f = inTab.filter(x => !s || (x.ad + x.fx + x.movzu + (x.nevaxt || "") + (x.sehv || "")).toLocaleLowerCase("az").includes(s));
    const topics = [...new Set(f.map(x => x.movzu))];
    list.append(el("p", { class: "count" }, (s ? `${f.length} / ${inTab.length} düstur` : `${inTab.length} düstur`) + ` · ${topics.length} mövzu`));
    topics.forEach(mz => { const xs = f.filter(x => x.movzu === mz), t = byPage[xs[0].ders];
      list.append(el("details", { class: "fgrp", ...(s ? { open: "" } : {}) },
        el("summary", {}, el("span", { class: "fgt" }, mz), el("span", { class: "fgn" }, xs.length + " düstur"), t ? stPill(isClosed(t) ? "bag" : t.status) : null, el("span", { class: "fgc" }, icon("ChevronDown"))),
        el("div", { class: "fgrid" }, ...xs.map(card)))); });
    if (!f.length) list.append(el("p", { class: "empty" }, filter === "all" || s ? "Tapılmadı." : "Bu seçimdə mövzu yoxdur."));
  }
  onSubject(k => {
    const [name, ph] = FENN[k]; fenn = name;
    h1.textContent = name + " düsturları"; document.title = name + " düsturları · Skilly"; q.placeholder = ph; sb.reset(); draw();
  });
}

/* ---------- sınaqlar ---------- */
async function pageTests() {
  const h1 = el("h1"), lead = el("p", { class: "lead" }), body = el("div");
  const { term } = await shell(el("div", { style: "margin-top:30px" }, h1, lead, body));
  const today = isoToday();
  const row = (ic, kat, title, sub, right) => { const k = KAT[kat]; return el("div", { class: "row" },
    el("span", { class: "ic " + k.cls }, icon(ic, k.ink)), el("div", { class: "tx" }, el("b", {}, title), el("span", {}, sub)), right); };
  const sec = (title, kids) => el("section", { class: "e-sec" }, el("div", { class: "head" }, el("h2", {}, title)), el("div", { class: "list" }, ...kids));
  onSubject(k => {
    body.replaceChildren();
    if (k === "riyaziyyat") {
      h1.textContent = "Buraxılış sınaqları"; document.title = "Buraxılış sınaqları · Skilly";
      lead.textContent = "Məktəbdə DİM formatında sınaqlar (10:00–13:00) və evdə şənbə günləri 11:00–12:30 vaxt limitli sınaq.";
      const dim = term.filter(t => /Buraxılış sınağı/.test(t.ad));
      body.append(
        sec("Qarşıdakı", dim.filter(t => t.tarix >= today).map(t => row("ClipboardCheck", "math", t.ad, t.qeyd, el("span", { class: "badge k-math" }, daysLeft(today, t.tarix))))),
        sec("Keçmiş", [row("ClipboardCheck", "math", "Buraxılış sınağı 1", "3 oktyabr · nəticə səhv jurnalına və təkrar planına salınıb", stMark(["Edilib", "st-bag", "CircleCheck"]))]));
    } else {
      h1.textContent = "Fizika sınaqları"; document.title = "Fizika sınaqları · Skilly";
      lead.textContent = "Hər bölmənin sonunda vaxt limitli sınaq: FRİTL-də keçilən mövzular üzrə.";
      body.append(sec("Sınaqlar", [row("Atom", "phys", "Mexanika sınağı 1", "24 tapşırıq · 60 dəqiqə · kinematika və dinamika",
        el("a", { class: "go", href: "ders.html?p=fizika-mexanika-1#sq" }, "Aç →"))]));
      // past RFO physics papers (ARTİ PDFs; 2017–2018 from the old olimpiada.edu.az site via web.archive.org)
      const MER = { rayon: "Rayon (şəhər)", yarimfinal: "Yarımfinal", final: "Final" };
      const NOV = { suallar: "suallar", helller: "məsələlər və həllər", eksperiment: "eksperiment: qiymətləndirmə meyarları" };
      load("data/rfo-fizika-arxiv.json").then(list => body.append(sec("Keçmiş RFO fizika sınaqları", [
        el("p", { class: "count" }, "9-cu sinif və aşağı yaş qrupu (8–9-cu siniflər). Rayon və yarımfinal üçün cavab açarı dərc olunmayıb; 2019–2024-cü illərin fizika sınaqları ümumiyyətlə dərc olunmayıb."),
        ...list.map(x => row("FileText", "phys", `${x.il} · ${MER[x.merhele]}`, `${x.qrup === "AYQ" ? "8–9-cu siniflər" : "9-cu sinif"} · ${NOV[x.nov]}`,
          el("a", { class: "go", href: x.url, target: "_blank", rel: "noopener" }, "PDF →")))]))).catch(() => {});
    }
  });
}

// the plan file may already hold next week ("novbeti", made before Sunday): from its first day on it is the current
// week; until then it only adds its days to the calendar (w.butun = the days of both weeks)
function pickWeek(w) {
  if (!w || !w.novbeti) return w;
  const { novbeti, ...cur } = w, next = isoToday() >= novbeti.gunler[0].tarix;
  return { ...(next ? novbeti : cur), butun: [...cur.gunler, ...novbeti.gunler] };
}
const AYLAR = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
const slot = d => { const x = new Date(d + "T00:00"); while (x.getDay() !== 0 && x.getDay() !== 3) x.setDate(x.getDate() + 1); return iso(x.getFullYear(), x.getMonth(), x.getDate()); };
const iso = (y, m, d) => y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");

async function pageCalendar() {
  const content = el("div", { style: "margin-top:30px" }, el("h1", {}, "Təqvim"),
    el("p", { class: "lead" }, "Sınaqlar, bu həftənin dərsləri, mövzuların bağlandığı günlər və yaddaş yoxlamaları. Günə toxun — o günün işləri aşağıda açılır."));
  const { w, term } = await shell(content);
  // date → events: deadlines from terminler.json, lessons from the current week
  const ev = {};
  const add = (d, e) => (ev[d] = ev[d] || []).push(e);
  term.forEach(t => add(t.tarix, { kat: t.kat, is: t.ad, qeyd: t.qeyd, son: true }));
  const mm = await load("data/movzular.json").catch(() => null);
  // a week's new topics are not listed separately (father, 11 Nov 2026): they reach the days through the week plan
  (w ? w.butun || w.gunler : []).forEach(g => g.isler.forEach(t => add(g.tarix, { kat: t.kat, is: t.is, saat: t.saat, link: t.link })));
  const today = isoToday();
  // Fikrət's record (the father sees it through the cloud): the day each topic was closed, and every memory check
  // on its date with its result — a missed one is marked on the grid
  if (w && mm && window.Skilly) {
    await Skilly.ready;
    const byLink = {}; for (const k in mm) mm[k].forEach(t => { if (t.ders) byLink[t.ders] = { ...t, kat: LIST_KAT[k] }; });
    let res = []; try { res = JSON.parse(localStorage.getItem("skilly-netice") || "[]"); } catch (e) {}
    const closedOn = {};
    res.forEach(x => { const m = String(x.id).match(/^(.+)-(test|baglandi)@\d+$/);
      if (m && x.tarix && (m[2] === "baglandi" || /^keçdi/.test(x.qeyd || ""))) { const l = "dersler/" + m[1] + ".html"; if (!closedOn[l] || x.tarix > closedOn[l]) closedOn[l] = x.tarix; } });
    for (const l in closedOn) { const t = byLink[l]; if (t && isClosed(t)) add(closedOn[l], { kat: t.kat, is: "Bağlandı: " + t.ad, link: l, st: ST.bag, qeyd: "mövzu bağlandı" }); }
    // a topic counts as started once any of its results exists (entry test, game, test)
    const started = new Set(res.map(x => (String(x.id).match(/^(.+)-[a-z]+@/) || [])[1]).filter(Boolean).map(k => "dersler/" + k + ".html"));
    for (const k in ev) ev[k].forEach(e => { const t = e.link && byLink[e.link]; if (t && !/^Bağlandı/.test(e.is)) {
      e.st = ST[isClosed(t) ? "bag" : started.has(t.ders) || t.status === "isl" ? "isl" : "yox"];
      if (isClosed(t) && closedOn[t.ders]) e.qeyd = (e.saat ? e.saat + " · " : "") + "bağlanıb " + t2(closedOn[t.ders]); } });
    // checks are done in the Wednesday and Sunday review windows (Tuesday and Friday are FRİTL days), at most CAP questions each (as on the Təkrar page):
    // a waiting one goes to the first window on or after its date that still has room, a done one to the day it was
    // done, a missed one stays on the window it was due in
    const used = {}, next = d => { const x = new Date(d + "T00:00"); x.setDate(x.getDate() + 1); return slot(iso(x.getFullYear(), x.getMonth(), x.getDate())); };
    Skilly.reviews().slice().sort((a, b) => a.due.localeCompare(b.due)).forEach(r => {
      let at = r.done || slot(r.due);
      if (!r.done && at >= today) { if (at < slot(today)) at = slot(today); while (used[at] && used[at] + r.n > CAP) at = next(at); used[at] = (used[at] || 0) + r.n; }
      const t = byLink[r.link], late = !r.done && at < today;
      // a failed check reopens the topic; once the topic is closed again it is settled, not open
      const reclosed = r.done && !r.ok && t && isClosed(t) && closedOn[r.link] >= r.done;
      const st = r.done ? (r.ok ? ["Edilib " + t2(r.done), "st-bag", "CircleCheck"]
          : reclosed ? ["Keçmədi " + t2(r.done) + " · mövzu yenidən bağlandı " + t2(closedOn[r.link]), "st-bag", "CircleCheck"]
          : ["Keçmədi " + t2(r.done) + " · mövzu açıqdır", "st-err", "CircleAlert"])
        : late ? ["Edilməyib", "st-err", "CircleAlert"] : ["Gözləyir", "st-yox", "CircleDashed"];
      // the check itself runs in the lesson's test tab, so the item opens it there (as on the Təkrar page)
      add(at, { kat: t ? t.kat : "misc", is: "Yaddaş yoxlaması: " + r.title + " (" + r.n + " sual)", st, qeyd: st[0], gecikir: late,
        link: r.done ? r.link : "ders.html?p=" + r.link.replace(/^dersler\/|\.html$/g, "") + "#sinaq" });
    });
  }
  let y = +today.slice(0, 4), mo = +today.slice(5, 7) - 1, sel = today;
  // day counter: closed/done, missed, waiting. Only items with a status count (exam dates and FRİTL/cüdo-type items do not);
  // a week's new topic is missed only once its week is over
  const stat = (e, k) => !e.st || e.son ? null : e.st[1] === "st-bag" ? "ok" : e.st[1] === "st-err" ? "no" : k < today ? "no" : "wait";
  const counter = (list, k) => { const c = { ok: 0, no: 0, wait: 0 }; list.forEach(e => { const s = stat(e, k); if (s) c[s]++; });
    const parts = [["ok", "✓", "bağlanıb"], ["no", "✗", "edilməyib"], ["wait", "○", "gözləyir"]].filter(([s]) => c[s]);
    return parts.length ? el("span", { class: "cnt", "aria-label": parts.map(([s, , w]) => c[s] + " " + w).join(", ") }, ...parts.map(([s, m]) => el("b", { class: s }, m + c[s]))) : null; };
  const title = el("h2", {});
  const prev = el("button", { class: "nav-btn", type: "button", "aria-label": "Əvvəlki ay" }, "←");
  const next = el("button", { class: "nav-btn", type: "button", "aria-label": "Növbəti ay" }, "→");
  const grid = el("div", { class: "cal", role: "grid" });
  const day = el("section", { class: "cal-day" });
  prev.addEventListener("click", () => { mo--; if (mo < 0) { mo = 11; y--; } draw(); });
  next.addEventListener("click", () => { mo++; if (mo > 11) { mo = 0; y++; } draw(); });
  function draw() {
    title.textContent = AYLAR[mo] + " " + y;
    const first = (new Date(y, mo, 1).getDay() + 6) % 7, n = new Date(y, mo + 1, 0).getDate();
    const cells = ["B.e", "Ç.a", "Çər", "C.a", "Cümə", "Şən", "Baz"].map(d => el("div", { class: "cal-h" }, d));
    for (let i = 0; i < first; i++) cells.push(el("div", { class: "cal-c blank" }));
    for (let d = 1; d <= n; d++) {
      const k = iso(y, mo, d), list = ev[k] || [];
      const b = el("button", { type: "button", class: "cal-c" + (k === today ? " today" : "") + (k === sel ? " sel" : "") + (k < today ? " past" : ""), "aria-label": d + " " + AYLAR[mo] + (list.length ? ", " + list.length + " iş" : "") },
        el("span", { class: "num" }, String(d)),
        counter(list, k),
        el("span", { class: "evs" }, ...list.filter(e => e.son).map(e => el("span", { class: "cal-tag " + (KAT[e.kat] || KAT.misc).cls }, e.is)),
          ...(list.some(e => e.gecikir) ? [el("span", { class: "cal-tag late" }, "Yaddaş yoxlaması edilməyib")] : [])),
        el("span", { class: "dots" }, ...[...new Set(list.filter(e => !e.son && !e.gecikir).map(e => e.kat))].map(kt => el("i", { class: (KAT[kt] || KAT.misc).cls }))));
      b.addEventListener("click", () => { sel = k; draw(); });
      cells.push(b);
    }
    grid.replaceChildren(...cells);
    const list = (ev[sel] || []).slice().sort((a, b) => (a.saat || "").localeCompare(b.saat || ""));
    const [yy, mm, dd] = sel.split("-");
    day.replaceChildren(el("div", { class: "head" }, el("h2", {}, (+dd) + " " + AYLAR[+mm - 1]), sel === today ? el("span", { class: "more" }, "bu gün") : null),
      el("div", { class: "list" }, ...(list.length ? list.map(e => { const k = KAT[e.kat] || KAT.misc; return el(e.link ? "a" : "div", { class: "row", ...(e.link ? { href: e.link, style: "text-decoration:none" } : {}) },
        el("span", { class: "ic " + k.cls }, icon(iconFor(e.kat, e.is), k.ink)),
        el("div", { class: "tx" }, el("b", {}, e.is), el("span", {}, [e.saat || e.qeyd || k.ad, e.st && e.qeyd !== e.st[0] && !/^Bağlandı/.test(e.is) ? e.st[0] : ""].filter(Boolean).join(" · "))),
        e.son ? el("span", { class: "badge " + k.cls }, "son tarix") : e.st ? stMark(e.st) : null); })
        : [el("p", { class: "empty" }, sel < today ? "Bu gün üçün qeyd yoxdur." : "Plan yoxdur — həftənin cədvəli hər bazar yenilənir.")])));
  }
  content.append(el("div", { class: "head", style: "margin-top:26px" }, title, el("span", { class: "more" }, prev, " ", next)), grid, day);
  draw();
}

/* ---------- təkrar: topic reviews for the two weekly windows (mistakes are offered at once, outside them) ---------- */
const CAP = 10;
function reviewQueue() {
  const t = Skilly.today();
  const items = [
    ...Skilly.dueReviews().map(r => ({ type: "movzu", due: r.due, n: r.n, r })),
  ].sort((a, b) => a.due.localeCompare(b.due));
  const now = [], later = []; let used = 0;
  items.forEach(x => { if (used + x.n <= CAP || !now.length) { now.push(x); used += x.n; } else later.push(x); });
  return { now, later, nowQ: used, laterQ: later.reduce((n, x) => n + x.n, 0) };
}

/* ---------- səhv jurnalı ---------- */
const FENN = { riyaziyyat: ["math", "Riyaziyyat"], olimpiada: ["olym", "Olimpiada"], fizika: ["phys", "Fizika"] };
const dmy = iso => iso ? iso.slice(8) + "." + iso.slice(5, 7) : "–";
const SST = { yeni: ["Həll gözləyir", "st-isl", "Repeat"], aciq: ["Həll gözləyir", "st-isl", "Repeat"], baglandi: ["Həll olundu", "st-bag", "CircleCheck"] };

function seg(opts, onPick, initial) {
  let val = initial || "";
  const box = el("div", { class: "seg", role: "radiogroup" });
  Object.entries(opts).forEach(([k, label]) => {
    const b = el("button", { type: "button", role: "radio", "aria-checked": String(k === val) }, label);
    b.addEventListener("click", () => { val = k; box.querySelectorAll("button").forEach(x => x.setAttribute("aria-checked", String(x === b))); onPick && onPick(k); });
    box.append(b);
  });
  box.value = () => val;
  return box;
}
const errMsg = () => el("div", { class: "fld-err", "aria-live": "polite" });
function errHead(e) {
  const [kat, ad] = FENN[e.fenn] || ["misc", e.fenn];
  return el("div", { class: "e-meta" }, el("span", { class: "badge " + KAT[kat].cls }, ad), el("span", {}, e.menbe || e.movzu), el("span", {}, dmy(e.tarix)));
}
function errBody(e) {
  return el("div", {}, el("p", { class: "e-q" }, e.sual || "(sual mətni yoxdur)"),
    e.opts ? el("ol", { class: "e-opts", type: "A" }, ...e.opts.map(o => el("li", {}, o))) : null);
}

function redoCard(e, redraw) {
  // the same question again, checked as in the game; it stays until it is solved right — no answer, no explanation
  const q = e.q2 || {}, out = errMsg(), act = el("div", { class: "e-act" });
  let input;
  if (q.choices) input = seg(Object.fromEntries(q.choices.map((c, i) => [String(i), c])), () => { out.textContent = ""; });
  else { input = el("input", { class: "fld", type: "text", inputmode: "decimal", autocomplete: "off", "aria-label": "Cavab" }); input.addEventListener("input", () => { out.textContent = ""; }); }
  const btn = el("button", { class: "btn", type: "button" }, "Yoxla");
  btn.addEventListener("click", () => {
    const v = q.choices ? input.value() : input.value.trim();
    if (v === "" || v == null) { out.className = "fld-err"; out.textContent = q.choices ? "Əvvəl birini seç." : "Əvvəl cavabı yaz."; return; }
    const ok = Skilly.yoxla(q, q.choices ? +v : v);
    Skilly.tekrar(e.id, ok);
    out.className = "e-res " + (ok ? "ok" : "no");
    out.textContent = ok ? "Düz ✓" : "Düz deyil. Kağızda yenidən həll et və yenə yoxla.";
    if (ok) { const nx = el("button", { class: "btn ghost", type: "button" }, "Növbəti"); nx.addEventListener("click", redraw); act.replaceChildren(nx); }
  });
  act.append(btn);
  const fig = el("div", { class: "e-fig" }); if (q.svg) fig.innerHTML = q.svg;
  return el("div", { class: "e-card fade" }, errHead(e), el("p", { class: "e-q" }, e.sual || "(sual mətni yoxdur)"), q.svg ? fig : null,
    el("div", { class: "e-lbl" }, "Kağızda yenidən həll et, sonra cavabı yaz" + (q.unit ? " (" + q.unit + ")" : "")), input, out, act);
}

async function pageSehv() {
  const jurnal = !!(window.Skilly && Skilly.sehvOn);
  const body = el("div"), sync = el("p", { class: "lead" });
  const content = el("div", { style: "margin-top:30px" }, el("h1", {}, "Təkrar"),
    el("p", { class: "lead" }, "Bağlanmış mövzuların yaddaş yoxlaması (7 və 30 gün sonra) — həftədə iki dəfə, Çərşənbə və Bazar." +
      (jurnal ? " Səhv cavab verilən suallar da burada dərhal yenidən gəlir: düz həll edənə qədər qalır." : "")),
    sync, body);
  const { w } = await shell(content);
  if (!w) { content.replaceChildren(el("h1", {}, "Təkrar"), el("p", { class: "lead" }, "Bu bölmə yalnız hesabla daxil olanda açılır.")); return; }
  function draw() {
    const all = jurnal ? Skilly.all() : [], open = all.filter(e => e.status !== "baglandi");
    const Q = reviewQueue(), topics = Q.now;
    const metric = (label, v) => el("div", { class: "metric" }, el("small", {}, label), el("b", {}, String(v)));
    const sec = (title, kids, more) => el("section", { class: "e-sec" }, el("div", { class: "head" }, el("h2", {}, title), more ? el("span", { class: "more" }, more) : null), ...kids);
    body.replaceChildren(
      el("div", { class: "metrics" }, ...(jurnal ? [metric("Səhv — həll gözləyir", open.length)] : []), metric("Yaddaş yoxlaması", Q.nowQ + " sual")),
      ...(jurnal ? [sec("Səhvlər — yenidən həll et", open.length ? [el("div", { class: "e-list" }, ...open.map(e => redoCard(e, draw)))] : [el("p", { class: "empty" }, "Həll gözləyən səhv yoxdur.")])] : []),
      sec("Yaddaş yoxlaması", [
        ...topics.map(x => el("a", { class: "attn rv", href: "ders.html?p=" + x.r.link.replace(/^dersler\/|\.html$/g, "") + "#sinaq" },
          el("span", { class: "ag-ic k-math" }, icon("Repeat")), el("span", { class: "ag-tx" }, el("b", {}, x.r.title + " — yaddaş yoxlaması"), el("small", {}, x.r.n + " sual · tarixi " + dmy(x.r.due))), el("span", { class: "ag-go" }, "Başla →"))),
        ...(!topics.length ? [el("p", { class: "empty" }, "Bu gün yaddaş yoxlaması yoxdur.")] : []),
        ...(Q.laterQ ? [el("p", { class: Q.laterQ > CAP ? "warnline" : "count" }, `Növbəti pəncərəyə ${Q.laterQ} sual qaldı.` + (Q.laterQ > CAP ? " Növbə böyüyür — yeni mövzuların tempini azaltmaq lazımdır." : ""))] : [])]),
      ...(jurnal && all.length ? [sec("Hamısı", [el("div", { class: "tbl" }, el("table", {},
        el("thead", {}, el("tr", {}, ...["Tarix", "Fənn", "Mənbə", "Cəhd", "Vəziyyət"].map(h => el("th", {}, h)))),
        el("tbody", {}, ...all.slice().sort((a, b) => (b.tarix || "").localeCompare(a.tarix || "")).map(e => el("tr", {},
          el("td", {}, dmy(e.tarix)), el("td", {}, (FENN[e.fenn] || [0, e.fenn])[1]), el("td", {}, e.link ? el("a", { href: e.link }, e.menbe) : e.menbe),
          el("td", {}, String(e.tekrar || 0)), el("td", {}, stMark(SST[e.status] || SST.aciq)))))))])] : []));
  }
  if (Skilly.ready) await Skilly.ready;
  draw();
  const on = await Skilly.configured();
  sync.className = "sync " + (on ? "on" : "off");
  sync.textContent = on ? "✓ Buluda qoşulub — bütün cihazlarda eynidir" : "Yalnız bu cihazda saxlanır — soldakı \"Google ilə daxil ol\" düyməsini bas";
  if ((await Skilly.pull()).synced) draw();
}

/* ---------- lesson inside the portal ---------- */
const LESSON_NAV = { math: "riyaziyyat.html", phys: "olimpiada.html", olym: "olimpiada.html" };
async function pageLesson() {
  const name = new URLSearchParams(location.search).get("p") || "";
  if (!/^[a-z0-9-]+$/.test(name)) { location.replace("index.html"); return; }
  const frame = el("iframe", { class: "lesson-frame", title: "Dərs" }), wrap = el("div", { class: "lesson-wrap" }, frame);
  const { m } = await shell(wrap);
  if (window.Skilly) await Skilly.ready;
  const ix = m ? topicIndex(m) : {}, me = Object.values(ix).find(t => t.ders === "dersler/" + name + ".html");
  const miss = me ? missingPrereqs(me, ix) : [];
  // a new topic opens only when everything it builds on is closed; a topic already in progress (taught at school now)
  // stays open with a note. Either way each missing topic links straight to its lesson.
  const missRow = x => { const k = KAT[LIST_KAT[x.list]]; return el(x.ders ? "a" : "div", { class: "row", ...(x.ders ? { href: "ders.html?p=" + x.ders.split("/").pop().replace(/\.html$/, "") } : {}) },
    el("span", { class: "ic " + k.cls }, icon(topicIcon({ ...x, kat: LIST_KAT[x.list] }), k.ink)), el("div", { class: "tx sf" }, el("span", {}, k.ad + " · " + x.bolme), el("b", { title: x.ad }, x.ad)),
    stPill(x.status), x.ders ? el("span", { class: "gate-go" }, icon("ArrowRight")) : null); };
  if (me && miss.length && me.status === "yox" && !me.acig && !isClosed(me)) {
    // the chain can be long (up to ~17 steps), so the page points straight at the topic to open now
    const ch = openChain(me, ix), first = ch.now[0];
    wrap.replaceChildren(el("div", { class: "gate" }, el("h2", {}, me.ad),
      el("p", {}, "Bu dərs açılmamışdan əvvəl " + ch.total + " mövzu bağlanmalıdır. İndi buradan başla:"),
      first ? el("div", { class: "list gate-start" }, missRow(first)) : null,
      ch.now.length > 1 ? el("details", { class: "gate-more" }, el("summary", {}, "İndi açıq olan başqa " + (ch.now.length - 1) + " mövzu"), el("div", { class: "list" }, ...ch.now.slice(1).map(missRow))) : null,
      el("p", { class: "gate-sub" }, "Birbaşa əsaslandığı mövzular:"),
      el("div", { class: "list" }, ...miss.map(missRow))));
    return;
  }
  if (me && miss.length && !isClosed(me)) wrap.prepend(el("div", { class: "gate-note" },
    el("p", {}, "Bu mövzu bunlara əsaslanır. Dərs açıqdır, amma bunları da bağla — boşluq qalmasın:"), el("div", { class: "list" }, ...miss.map(missRow))));
  frame.src = "dersler/" + name + ".html" + location.hash;
  frame.addEventListener("load", () => {
    const d = frame.contentDocument; if (!d) return;
    document.title = d.title.replace(/ dərsi$/, "") + " · Skilly";
    const href = LESSON_NAV[d.documentElement.dataset.kat];
    document.querySelectorAll(".topnav a").forEach(a => a.toggleAttribute("aria-current", a.getAttribute("href") === href));
    document.querySelectorAll(".topnav a[aria-current]").forEach(a => a.setAttribute("aria-current", "page"));
  });
}

async function pageStatic(title, lead, html) {
  const box = el("div", { class: "box" }); box.innerHTML = html;
  await shell(el("div", { style: "margin-top:30px" }, el("h1", {}, title), el("p", { class: "lead" }, lead), box));
}

document.addEventListener("click", ev => { if (!ev.target.closest(".nav-dd")) document.querySelectorAll(".nav-dd.open").forEach(x => x.classList.remove("open")); });
window.addEventListener("scroll", () => document.querySelectorAll(".nav-dd.open").forEach(x => x.classList.remove("open")), { passive: true });
document.addEventListener("DOMContentLoaded", () => {
  const p = document.body.dataset.page;
  if (p === "index") pageIndex();
  else if (p === "ders") pageLesson();
  else if (p === "teqvim") pageCalendar();
  else if (p === "riyaziyyat") pageTopics("riyaziyyat", "Buraxılış — riyaziyyat", "Hər mövzu giriş testi ilə başlayır. Oyunda, Boss-da və Sınaqda hər sual düz cavablanmalıdır — səhv olsa, sual qalır. Hamısı düz olanda mövzu bağlanır. Bir həftə və bir ay sonra yaddaş yoxlaması.");
  else if (p === "olimpiada") pageOlympiad();
  else if (p === "fizika") location.replace("olimpiada.html#fizika");
  else if (p === "dusturlar") pageFormulas();
  else if (p === "sinaqlar") pageTests();
  else if (p === "temrar") pageSehv();
});
