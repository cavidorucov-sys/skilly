// Portal shell + page renderers. Every page is <body data-page="..."> and gets the same rail and top navigation.
const NAV = [
  // daily → study → check yourself → reference
  ["index.html", "Bu gün", "House"], ["riyaziyyat.html", "Buraxılış", "GraduationCap"], ["olimpiada.html", "Olimpiada", "Trophy"],
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
async function load(path) {
  const r = await fetch(path, { cache: "no-cache" });
  if (!r.ok) throw new Error(path + " " + r.status);
  return r.json();
}
const ST = { yox: ["Başlanmayıb", "st-yox"], isl: ["İşlənir", "st-isl"], bag: ["Bağlanıb", "st-bag"] };
const stPill = s => el("span", { class: "st " + (ST[s] || ST.yox)[1] }, (ST[s] || ST.yox)[0]);
const isoToday = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const daysLeft = (from, to) => { const n = Math.round((new Date(to) - new Date(from)) / 864e5); return t2(to) + " · " + (n === 0 ? "bu gün" : n === 1 ? "sabah" : n + " gün"); };
const t2 = iso => iso.slice(8) + "." + iso.slice(5, 7);
const fmtH = h => String(h).replace(".", ",");

// topics whose final test was passed on this device count as closed (until the data file catches up)
const passedHere = () => { try { return JSON.parse(localStorage.getItem("skilly-bag") || "[]"); } catch (e) { return []; } };
function allTopics(m) {
  const bag = passedHere();
  return Object.entries(m).flatMap(([subj, rows]) => rows.map(r => ({ ...r, subj, kat: SUBJ_KAT[subj], status: r.ders && bag.includes(r.ders) ? "bag" : r.status })));
}

/* ---------- shell ---------- */
async function shell(content) {
  const here = location.pathname.split("/").pop() || "index.html";
  const [m, w] = await Promise.all([load("data/movzular.json"), load("data/hefte.json")]).catch(() => [null, null]);
  const topics = m ? allTopics(m) : [];
  const closed = topics.filter(t => t.status === "bag").length, total = topics.length || 1;
  const pct = Math.round(closed / total * 100);
  const C = 2 * Math.PI * 100;
  const ring = el("div", { class: "ring" });
  ring.innerHTML = `<svg viewBox="0 0 220 220"><circle cx="110" cy="110" r="100" fill="none" style="stroke:var(--rail-2)" stroke-width="2"/>
    <circle cx="110" cy="110" r="100" fill="none" style="stroke:var(--rail-ink)" stroke-width="2" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>`;
  ring.append(el("div", { class: "v" }, el("div", { class: "big" }, String(closed)), el("div", { class: "lbl" }, `${total} mövzudan bağlanıb`, el("br"), `${pct}%`)));
  requestAnimationFrame(() => requestAnimationFrame(() => { ring.querySelectorAll("circle")[1].style.strokeDashoffset = C * (1 - Math.max(pct, 1) / 100); }));
  const term = await load("data/terminler.json").catch(() => []);
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
  const rail = el("aside", { class: "rail" },
    el("div", { class: "rail-top" }, el("a", { class: "logo", href: "index.html" }, el("span", { class: "logo-full" }, "Skilly"), el("span", { class: "logo-mini" }, "S")), toggle),
    el("div", { class: "who" }, el("div", { class: "avatar" }, "F"), el("b", {}, "Fikrət"), el("span", {}, "9-cu sinif · 2026–27"), el("span", { class: "chip" }, w ? w.hefte : "")),
    ring,
    el("div", { class: "minis" },
      el("div", { class: "mini" }, el("i", {}, String(toExam)), "gün sınağa"),
      el("div", { class: "mini" }, el("i", {}, String(topics.filter(t => t.status === "isl").length)), "işlənir"),
      el("div", { class: "mini" }, el("i", {}, String(topics.filter(t => t.ders).length)), "dərs"),
      el("div", { class: "mini" }, el("i", {}, String(topics.length)), "mövzu")));
  const nav = el("nav", { class: "topnav", "aria-label": "Bölmələr" },
    NAV.map(([href, label, ic]) => {
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
        document.querySelectorAll(".nav-dd.open").forEach(x => x.classList.remove("open"));
        if (open) { const r = link.getBoundingClientRect(); dd.style.left = Math.min(r.left, innerWidth - 210) + "px"; dd.style.top = r.bottom + 6 + "px"; box.classList.add("open"); }
      });
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
  if (!w) { content.append(el("p", { class: "empty" }, "Məlumat yüklənmədi.")); return; }
  const today = isoToday(), now = hm(), d = new Date();
  const day = w.gunler.find(g => g.tarix === today) || w.gunler.find(g => g.tarix > today);
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
    day.isler.forEach(t => {
      const [from, to] = span(t.saat), k = KAT[t.kat] || KAT.misc;
      const state = !isToday ? "" : now >= to ? "past" : now >= from ? "now" : (!nextMarked ? (nextMarked = true, "next") : "");
      const row = el(t.link ? "a" : "div", { class: "ag " + state, ...(t.link ? { href: t.link } : {}) },
        el("span", { class: "ag-time" }, from, el("small", {}, to)),
        el("span", { class: "ag-ic " + k.cls }, icon(iconFor(t.kat, t.is), k.ink)),
        el("span", { class: "ag-tx" }, el("b", {}, t.is + (t.link === "temrar.html" && window.Skilly ? ` · ${reviewQueue().nowQ} sual` : "")), el("small", {}, state === "now" ? "indi" : state === "next" ? "növbəti" : state === "past" ? "keçdi" : k.ad)),
        t.link ? el("span", { class: "ag-go" }, "Aç →") : null);
      list.append(row);
    });
  }
  hero.append(list);
  content.append(hero);

  // 2. needs attention: the error journal
  if (window.Skilly) {
    await Skilly.ready;
    const all = Skilly.all(), yeni = all.filter(e => e.status === "yeni").length;
    const due = all.filter(e => e.status === "aciq" && e.novbeti && e.novbeti <= today).length;
    if (yeni || due) content.append(el("a", { class: "attn", href: "temrar.html" },
      el("span", { class: "ag-ic k-misc" }, icon("NotebookPen")),
      el("span", { class: "ag-tx" }, el("b", {}, "Səhv jurnalı"),
        el("small", {}, [yeni ? `${yeni} səhv təhlil gözləyir` : "", due ? `${due} təkrar vaxtıdır` : ""].filter(Boolean).join(" · "))),
      el("span", { class: "ag-go" }, "Aç →")));
  }

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
  }
  onSubject(draw);
}
const SUBJ_KAT_KEY = { riyaziyyat: "olimpiada", fizika: "fizika" };

function renderTopics(content, m, key, lead) {
  content.append(el("p", { class: "lead" }, lead));
  const rows = m[key], kat = SUBJ_KAT[key];
  const c = s => rows.filter(r => r.status === s).length;
  content.append(el("p", { class: "lead" }, `${rows.length} mövzu · bağlanıb ${c("bag")} · işlənir ${c("isl")} · başlanmayıb ${c("yox")}`));
  const inProgress = rows.filter(r => r.status === "isl").map(r => ({ ...r, kat }));
  // cards: topics in progress; if none yet, the next three to start, so every subject page looks the same
  const planned = rows.filter(r => r.status === "yox" && r.novbeti).sort((x, y) => x.novbeti - y.novbeti);
  const upNext = (planned.length ? planned : rows.filter(r => r.status === "yox")).slice(0, 3).map(r => ({ ...r, kat }));
  const shown = inProgress.length ? inProgress : upNext;
  if (shown.length) content.append(el("h2", { class: "cards-h" }, inProgress.length ? "İşlənir" : "Başlanacaq"), el("div", { class: "cards" }, ...shown.map(topicCard)));
  const tb = el("tbody"); let sec = null, i = 0;
  rows.forEach(r => {
    if (r.bolme !== sec) { sec = r.bolme; tb.append(el("tr", { class: "sec" }, el("td", { colspan: "4" }, sec))); }
    i++;
    const k = KAT[kat] || KAT.misc;
    tb.append(el("tr", {}, el("td", { class: "n" }, String(i).padStart(2, "0")),
      el("td", {}, el("div", { class: "tname" }, el("span", { class: "tic " + k.cls }, icon(topicIcon({ ...r, kat }), k.ink)),
        el("span", {}, r.ad, r.fritl ? el("span", { class: "tag" }, "FRİTL") : null, r.yeni ? el("span", { class: "tag" }, "əlavə") : null))),
      el("td", {}, stPill(r.status)),
      el("td", { class: "act" }, r.ders ? el("a", { class: "go", href: r.ders }, "Dərsi aç →") : el("span", { class: "soon" }, "tezliklə"))));
  });
  content.append(el("div", { class: "tbl" }, el("table", { class: "mt" }, el("thead", {}, el("tr", {}, el("th", {}, "№"), el("th", {}, "Mövzu"), el("th", {}, "Vəziyyət"), el("th", {}, ""))), tb)));
}

async function pageFormulas() {
  const FENN = { riyaziyyat: ["Riyaziyyat", "Axtar: sin, diskriminant, parabola…"], fizika: ["Fizika", "Axtar: təcil, impuls, Om…"] };
  const h1 = el("h1"), q = el("input", { class: "search", type: "search", "aria-label": "Düstur axtar" }), list = el("div");
  await shell(el("div", { style: "margin-top:30px" }, h1, el("p", { class: "lead" }, "Hər düsturun yanında: nə vaxt işlədilir, tipik səhv və izahı olan dərs."), q, list));
  const all = await load("data/dusturlar.json").catch(() => []);
  let fenn = "Riyaziyyat";
  function draw() {
    const s = q.value.trim().toLowerCase(); list.replaceChildren();
    const inTab = all.filter(x => x.fenn === fenn);
    const f = inTab.filter(x => !s || (x.ad + x.fx + x.movzu + (x.nevaxt || "") + (x.sehv || "")).toLowerCase().includes(s));
    list.append(el("p", { class: "count" }, s ? `${f.length} / ${inTab.length} düstur` : `${inTab.length} düstur`));
    [...new Set(f.map(x => x.movzu))].forEach(mz => {
      list.append(el("div", { class: "fsec" }, mz), el("div", { class: "fgrid" }, ...f.filter(x => x.movzu === mz).map(x => el("div", { class: "fcard" },
        el("div", { class: "m" }, x.ad), el("div", { class: "fx" }, ...x.fx.split(";").map(f => el("span", {}, f.trim()))), el("div", { class: "note" }, x.nevaxt || ""),
        x.sehv ? el("div", { class: "err" }, "Tipik səhv: " + x.sehv) : null, x.ders ? el("a", { href: x.ders }, "İzahı dərsdə →") : null))));
    });
    if (!f.length) list.append(el("p", { class: "empty" }, "Tapılmadı."));
  }
  onSubject(k => {
    const [name, ph] = FENN[k]; fenn = name;
    h1.textContent = name + " düsturları"; document.title = name + " düsturları · Skilly"; q.placeholder = ph; q.value = ""; draw();
  });
  q.addEventListener("input", draw);
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
        sec("Keçmiş", [row("ClipboardCheck", "math", "Buraxılış sınağı 1", "3 oktyabr · nəticə səhv jurnalına və təkrar planına salınıb", el("span", { class: "st st-bag" }, "edilib"))]));
    } else {
      h1.textContent = "Fizika sınaqları"; document.title = "Fizika sınaqları · Skilly";
      lead.textContent = "Hər bölmənin sonunda vaxt limitli sınaq: FRİTL-də keçilən mövzular üzrə.";
      body.append(sec("Sınaqlar", [row("Atom", "phys", "Mexanika sınağı 1", "24 tapşırıq · 60 dəqiqə · kinematika və dinamika",
        el("a", { class: "go", href: "ders.html?p=fizika-mexanika-1#sq" }, "Aç →"))]));
    }
  });
}

const AYLAR = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
const iso = (y, m, d) => y + "-" + String(m + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");

async function pageCalendar() {
  const content = el("div", { style: "margin-top:30px" }, el("h1", {}, "Təqvim"),
    el("p", { class: "lead" }, "Sınaqlar, layihə son tarixləri və bu həftənin dərsləri. Günə toxun — o günün işləri aşağıda açılır."));
  const { w, term } = await shell(content);
  // date → events: deadlines from terminler.json, lessons from the current week
  const ev = {};
  const add = (d, e) => (ev[d] = ev[d] || []).push(e);
  term.forEach(t => add(t.tarix, { kat: t.kat, is: t.ad, qeyd: t.qeyd, son: true }));
  (w ? w.gunler : []).forEach(g => g.isler.forEach(t => add(g.tarix, { kat: t.kat, is: t.is, saat: t.saat, link: t.link })));
  const today = isoToday();
  let y = +today.slice(0, 4), mo = +today.slice(5, 7) - 1, sel = today;
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
        el("span", { class: "evs" }, ...list.filter(e => e.son).map(e => el("span", { class: "cal-tag " + (KAT[e.kat] || KAT.misc).cls }, e.is))),
        el("span", { class: "dots" }, ...[...new Set(list.filter(e => !e.son).map(e => e.kat))].map(kt => el("i", { class: (KAT[kt] || KAT.misc).cls }))));
      b.addEventListener("click", () => { sel = k; draw(); });
      cells.push(b);
    }
    grid.replaceChildren(...cells);
    const list = (ev[sel] || []).slice().sort((a, b) => (a.saat || "").localeCompare(b.saat || ""));
    const [yy, mm, dd] = sel.split("-");
    day.replaceChildren(el("div", { class: "head" }, el("h2", {}, (+dd) + " " + AYLAR[+mm - 1]), sel === today ? el("span", { class: "more" }, "bu gün") : null),
      el("div", { class: "list" }, ...(list.length ? list.map(e => { const k = KAT[e.kat] || KAT.misc; return el(e.link ? "a" : "div", { class: "row", ...(e.link ? { href: e.link, style: "text-decoration:none" } : {}) },
        el("span", { class: "ic " + k.cls }, icon(iconFor(e.kat, e.is), k.ink)),
        el("div", { class: "tx" }, el("b", {}, e.is), el("span", {}, e.saat || e.qeyd || k.ad)),
        e.son ? el("span", { class: "badge " + k.cls }, "son tarix") : null); })
        : [el("p", { class: "empty" }, sel < today ? "Bu gün üçün qeyd yoxdur. Nəticələr Google Sheets qoşulandan sonra burada görünəcək." : "Plan yoxdur — həftənin cədvəli hər bazar yenilənir.")])));
  }
  content.append(el("div", { class: "head", style: "margin-top:26px" }, title, el("span", { class: "more" }, prev, " ", next)), grid, day);
  draw();
}

/* ---------- təkrar: queue for the two weekly windows ---------- */
const CAP = 10;
function reviewQueue() {
  const t = Skilly.today();
  const items = [
    ...Skilly.dueReviews().map(r => ({ type: "movzu", due: r.due, n: r.n, r })),
    ...Skilly.all().filter(e => e.status === "aciq" && e.novbeti && e.novbeti <= t).map(e => ({ type: "sehv", due: e.novbeti, n: 1, e })),
  ].sort((a, b) => a.due.localeCompare(b.due));
  const now = [], later = []; let used = 0;
  items.forEach(x => { if (used + x.n <= CAP || !now.length) { now.push(x); used += x.n; } else later.push(x); });
  return { now, later, nowQ: used, laterQ: later.reduce((n, x) => n + x.n, 0) };
}

/* ---------- səhv jurnalı ---------- */
const KATS = { hesab: "Hesab / diqqət", qayda: "Qaydanı bilmirdim", sert: "Şərti səhv başa düşdüm" };
const FENN = { riyaziyyat: ["math", "Riyaziyyat"], olimpiada: ["olym", "Olimpiada"], fizika: ["phys", "Fizika"] };
const dmy = iso => iso ? iso.slice(8) + "." + iso.slice(5, 7) : "–";
const SST = { yeni: ["Təhlil gözləyir", "st-err"], aciq: ["Təkrarda", "st-isl"], baglandi: ["Bağlanıb", "st-bag"] };

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

function analyseCard(e, redraw) {
  const err = errMsg();
  const kat = seg(KATS, () => { err.textContent = ""; }, e.kat);
  const yol = el("input", { class: "fld", type: "text", placeholder: "Məsələn: əvvəl vahidləri SI-yə çevirməliydim", "aria-label": "Düzgün yol, bir cümlə" });
  yol.addEventListener("input", () => { err.textContent = ""; });
  const btn = el("button", { class: "btn", type: "button" }, "Saxla");
  btn.addEventListener("click", () => {
    if (!kat.value()) { err.textContent = "Səhvin növünü seç."; return; }
    if (yol.value.trim().length < 8) { err.textContent = "Düzgün yolu bir cümlə ilə yaz."; yol.focus(); return; }
    Skilly.update(e.id, { kat: kat.value(), yol: yol.value.trim(), status: "aciq" }); redraw();
  });
  return el("div", { class: "e-card fade" }, errHead(e), errBody(e),
    el("p", { class: "e-ans" }, e.bos ? "Boş qalıb" : "Sənin cavabın: " + (e.cavab || "—") + (e.vahid ? " " + e.vahid : "")),
    e.qeyd ? el("p", { class: "e-note" }, e.qeyd) : null,
    e.duz ? el("details", { class: "e-det" }, el("summary", {}, "Düz cavabı göstər"), e.duz) : null,
    el("div", { class: "e-lbl" }, "Niyə səhv oldu?"), kat,
    el("div", { class: "e-lbl" }, "Düzgün yol (bir cümlə)"), yol, err, el("div", { class: "e-act" }, btn));
}

function redoCard(e, redraw) {
  const out = errMsg(), act = el("div", { class: "e-act" });
  const done = ok => {
    Skilly.tekrar(e.id, ok);
    out.className = "e-res " + (ok ? "ok" : "no");
    out.textContent = (ok ? "Düz. " : "Hələ alınmadı, bir həftə sonra yenə gələcək. ") + "Sənin qeydin: " + (e.yol || "—");
    const nx = el("button", { class: "btn ghost", type: "button" }, "Növbəti");
    nx.addEventListener("click", redraw); act.replaceChildren(nx);
  };
  if (e.chk) {
    let inp;
    if (e.opts) inp = seg(Object.fromEntries(e.opts.map((o, i) => ["ABCDE"[i], "ABCDE"[i]])), () => { out.textContent = ""; });
    else { inp = el("input", { class: "fld", type: "text", inputmode: "decimal", autocomplete: "off", "aria-label": "Cavab" }); inp.addEventListener("input", () => { out.textContent = ""; }); }
    const btn = el("button", { class: "btn", type: "button" }, "Yoxla");
    btn.addEventListener("click", async () => {
      const v = Skilly.norm(e.opts ? inp.value() : inp.value, e.chk.p);
      if (!v) { out.className = "fld-err"; out.textContent = "Əvvəl cavabı yaz."; return; }
      done((await Skilly.hash(e.chk.p, e.chk.n, v)) === e.chk.h);
    });
    act.append(btn);
    return el("div", { class: "e-card fade" }, errHead(e), errBody(e), el("div", { class: "e-lbl" }, "Kağızda yenidən həll et, sonra cavabı yaz" + (e.vahid ? " (" + e.vahid + ")" : "")), inp, out, act);
  }
  const yes = el("button", { class: "btn", type: "button" }, "Bacardım"), no = el("button", { class: "btn ghost", type: "button" }, "Bacarmadım");
  yes.addEventListener("click", () => done(true)); no.addEventListener("click", () => done(false));
  act.append(yes, no);
  return el("div", { class: "e-card fade" }, errHead(e), errBody(e),
    el("div", { class: "e-lbl" }, "Kağızda yenidən həll et, sonra düz cavabla yoxla"),
    e.duz ? el("details", { class: "e-det" }, el("summary", {}, "Düz cavabı göstər"), e.duz) : null, out, act);
}

function addForm(redraw) {
  const f = {
    fenn: el("select", { class: "fld", "aria-label": "Fənn" }, ...Object.entries(FENN).map(([k, [, ad]]) => el("option", { value: k }, ad))),
    menbe: el("input", { class: "fld", type: "text", placeholder: "Məktəb quizi, 21.10", "aria-label": "Mənbə" }),
    movzu: el("input", { class: "fld", type: "text", placeholder: "Kvadrat tənliklər", "aria-label": "Mövzu" }),
    sual: el("textarea", { class: "fld", rows: "2", placeholder: "Sualın qısa mətni", "aria-label": "Sual" }),
    cavab: el("input", { class: "fld", type: "text", placeholder: "Sənin cavabın", "aria-label": "Sənin cavabın" }),
    duz: el("input", { class: "fld", type: "text", placeholder: "Düz cavab", "aria-label": "Düz cavab" }),
    yol: el("input", { class: "fld", type: "text", placeholder: "Bir cümlə", "aria-label": "Düzgün yol" }),
  };
  const err = errMsg(), kat = seg(KATS, () => { err.textContent = ""; });
  Object.values(f).forEach(x => x.addEventListener("input", () => { err.textContent = ""; }));
  const btn = el("button", { class: "btn", type: "button" }, "Əlavə et");
  btn.addEventListener("click", () => {
    const v = k => f[k].value.trim();
    if (!v("sual")) { err.textContent = "Sualı yaz."; f.sual.focus(); return; }
    if (!v("duz")) { err.textContent = "Düz cavabı yaz."; f.duz.focus(); return; }
    if (!kat.value()) { err.textContent = "Səhvin növünü seç."; return; }
    if (v("yol").length < 8) { err.textContent = "Düzgün yolu bir cümlə ilə yaz."; f.yol.focus(); return; }
    Skilly.sehv({ id: "el-" + Date.now(), fenn: v("fenn"), menbe: v("menbe") || "Kağız", movzu: v("movzu"), sual: v("sual"), cavab: v("cavab"), duz: v("duz"), kat: kat.value(), yol: v("yol"), status: "aciq" });
    redraw();
  });
  const row = (label, x) => el("label", { class: "e-row" }, el("span", { class: "e-lbl" }, label), x);
  return el("div", { class: "e-card" },
    el("div", { class: "e-grid" }, row("Fənn", f.fenn), row("Mənbə", f.menbe), row("Mövzu", f.movzu)),
    row("Sual", f.sual), el("div", { class: "e-grid" }, row("Sənin cavabın", f.cavab), row("Düz cavab", f.duz)),
    el("div", { class: "e-lbl" }, "Niyə səhv oldu?"), kat, row("Düzgün yol", f.yol), err, el("div", { class: "e-act" }, btn));
}

async function pageSehv() {
  const body = el("div"), sync = el("p", { class: "lead" });
  const content = el("div", { style: "margin-top:30px" }, el("h1", {}, "Təkrar"),
    el("p", { class: "lead" }, "Həftədə iki dəfə 15 dəqiqə: Çərşənbə axşamı və Bazar. Burada bağlanmış mövzuların yaddaş yoxlaması (7 və 30 gün sonra) və səhv jurnalının sualları növbə ilə gəlir — bir dəfəyə ən çox " + CAP + " sual, ən çox gecikən birinci."),
    sync, body);
  await shell(content);
  function draw() {
    const all = Skilly.all(), t = Skilly.today(), month = t.slice(0, 7);
    const yeni = all.filter(e => e.status === "yeni");
    const Q = reviewQueue(), due = Q.now.filter(x => x.type === "sehv").map(x => x.e), topics = Q.now.filter(x => x.type === "movzu");
    const open = all.filter(e => e.status !== "baglandi");
    const thisMonth = all.filter(e => (e.tarix || "").startsWith(month));
    const metric = (label, v) => el("div", { class: "metric" }, el("small", {}, label), el("b", {}, String(v)));
    const sec = (title, kids, more) => el("section", { class: "e-sec" }, el("div", { class: "head" }, el("h2", {}, title), more ? el("span", { class: "more" }, more) : null), ...kids);
    body.replaceChildren(
      el("div", { class: "metrics" }, metric("Təhlil gözləyir", yeni.length), metric("Bu pəncərədə", Q.nowQ + " sual"), metric("Açıq", open.length), metric("Bu ay", thisMonth.length)),
      sec("Bu pəncərədə", [
        ...topics.map(x => el("a", { class: "attn rv", href: "ders.html?p=" + x.r.link.replace(/^dersler\/|\.html$/g, "") + "#sinaq" },
          el("span", { class: "ag-ic k-math" }, icon("Repeat")), el("span", { class: "ag-tx" }, el("b", {}, x.r.title + " — yaddaş yoxlaması"), el("small", {}, x.r.n + " sual · tarixi " + dmy(x.r.due))), el("span", { class: "ag-go" }, "Başla →"))),
        ...(due.length ? [el("div", { class: "e-list" }, ...due.map(e => redoCard(e, draw)))] : []),
        ...(!Q.now.length ? [el("p", { class: "empty" }, "Bu gün təkrar yoxdur.")] : []),
        ...(Q.laterQ ? [el("p", { class: Q.laterQ > CAP ? "warnline" : "count" }, `Növbəti pəncərəyə ${Q.laterQ} sual qaldı.` + (Q.laterQ > CAP ? " Növbə böyüyür — yeni mövzuların tempini azaltmaq lazımdır." : ""))] : [])], Q.nowQ ? `~${Q.nowQ} dəq` : ""),
      sec("Təhlil gözləyir", yeni.length ? [el("div", { class: "e-list" }, ...yeni.map(e => analyseCard(e, draw)))] : [el("p", { class: "empty" }, "Hamısı təhlil olunub.")]),
      sec("Kağızdakı səhvi əlavə et", [addForm(draw)], "quiz, FRİTL, DİM sınağı"),
      sec("Bu ay növlər üzrə", [el("div", { class: "metrics" }, ...Object.entries(KATS).map(([k, l]) => metric(l, thisMonth.filter(e => e.kat === k).length)))]),
      sec("Hamısı", all.length ? [el("div", { class: "tbl" }, el("table", {},
        el("thead", {}, el("tr", {}, ...["Tarix", "Fənn", "Mənbə", "Növ", "Növbəti təkrar", "Vəziyyət"].map(h => el("th", {}, h)))),
        el("tbody", {}, ...all.slice().sort((a, b) => (b.tarix || "").localeCompare(a.tarix || "")).map(e => el("tr", {},
          el("td", {}, dmy(e.tarix)), el("td", {}, (FENN[e.fenn] || [0, e.fenn])[1]), el("td", {}, e.link ? el("a", { href: e.link }, e.menbe) : e.menbe),
          el("td", {}, KATS[e.kat] || "–"), el("td", {}, dmy(e.novbeti)),
          el("td", {}, el("span", { class: "st " + (SST[e.status] || SST.yeni)[1] }, (SST[e.status] || SST.yeni)[0])))))))]
        : [el("p", { class: "empty" }, "Hələ səhv yoxdur.")]));
  }
  if (Skilly.ready) await Skilly.ready;
  draw();
  const on = await Skilly.configured();
  sync.className = "sync " + (on ? "on" : "off");
  sync.textContent = on ? "✓ Google Sheets-ə qoşulub" : "Yalnız bu cihazda saxlanır — Google Sheets qoşulmayıb";
  if ((await Skilly.pull()).synced) draw();
}

/* ---------- lesson inside the portal ---------- */
const LESSON_NAV = { math: "riyaziyyat.html", phys: "olimpiada.html", olym: "olimpiada.html" };
async function pageLesson() {
  const name = new URLSearchParams(location.search).get("p") || "";
  if (!/^[a-z0-9-]+$/.test(name)) { location.replace("index.html"); return; }
  const frame = el("iframe", { class: "lesson-frame", title: "Dərs" });
  await shell(el("div", { class: "lesson-wrap" }, frame));
  if (window.Skilly) await Skilly.ready;
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
  else if (p === "riyaziyyat") pageTopics("riyaziyyat", "Buraxılış — riyaziyyat", "Hər mövzu giriş testi ilə başlayır: 80% və çox — mövzu bağlanır. Az olarsa: dərs → 20–25 məşq sualı → yekun test (80%). Bir həftə və bir ay sonra təkrar.");
  else if (p === "olimpiada") pageOlympiad();
  else if (p === "fizika") location.replace("olimpiada.html#fizika");
  else if (p === "dusturlar") pageFormulas();
  else if (p === "sinaqlar") pageTests();
  else if (p === "temrar") pageSehv();
});
