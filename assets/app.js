// Portal shell + page renderers. Every page is <body data-page="..."> and gets the same rail and top navigation.
const NAV = [
  ["index.html", "Bu həftə"], ["riyaziyyat.html", "Riyaziyyat"], ["olimpiada.html", "Olimpiada"],
  ["fizika.html", "Fizika"], ["sinaqlar.html", "Sınaqlar"], ["temrar.html", "Təkrar"], ["dusturlar.html", "Düsturlar"],
];
const KAT = {
  math: { cls: "k-math", ink: "var(--math-ink)", ad: "Riyaziyyat" },
  olym: { cls: "k-olym", ink: "var(--olym-ink)", ad: "Olimpiada" },
  phys: { cls: "k-phys", ink: "var(--phys-ink)", ad: "Fizika" },
  proj: { cls: "k-proj", ink: "var(--proj-ink)", ad: "Layihə" },
  misc: { cls: "k-misc", ink: "var(--misc-ink)", ad: "Digər" },
};
const SUBJ_KAT = { riyaziyyat: "math", olimpiada: "olym", fizika: "phys" };
const ICON = {
  math: '<path d="M4 7h16M4 12h10M4 17h7"/><path d="M17 14l4 4m0-4l-4 4"/>',
  olym: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
  phys: '<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="9" ry="3.6"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(-60 12 12)"/>',
  proj: '<path d="M9 3h6M10 3v6L5 19a1.5 1.5 0 0 0 1.3 2h11.4A1.5 1.5 0 0 0 19 19l-5-10V3"/><path d="M7.5 15h9"/>',
  misc: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
};
function icon(k, color) {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("fill", "none"); s.setAttribute("stroke", color || "currentColor");
  s.setAttribute("stroke-width", "1.7"); s.setAttribute("stroke-linecap", "round"); s.setAttribute("stroke-linejoin", "round");
  s.innerHTML = ICON[k] || ICON.misc; return s;
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
const fmtH = h => String(h).replace(".", ",");

function allTopics(m) {
  return Object.entries(m).flatMap(([subj, rows]) => rows.map(r => ({ ...r, subj, kat: SUBJ_KAT[subj] })));
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
  ring.innerHTML = `<svg viewBox="0 0 220 220"><circle cx="110" cy="110" r="100" fill="none" stroke="#2a2a30" stroke-width="2"/>
    <circle cx="110" cy="110" r="100" fill="none" stroke="#f4f4f6" stroke-width="2" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>`;
  ring.append(el("div", { class: "v" }, el("div", { class: "big" }, String(closed)), el("div", { class: "lbl" }, `${total} mövzudan bağlanıb`, el("br"), `${pct}%`)));
  requestAnimationFrame(() => requestAnimationFrame(() => { ring.querySelectorAll("circle")[1].style.strokeDashoffset = C * (1 - Math.max(pct, 1) / 100); }));
  const hours = w ? w.saatlar.reduce((a, s) => a + s.saat, 0) : 0;
  const rail = el("aside", { class: "rail" },
    el("a", { class: "logo", href: "index.html" }, "Skilly"),
    el("div", { class: "who" }, el("div", { class: "avatar" }, "F"), el("b", {}, "Fikrət"), el("span", {}, "9-cu sinif · 2026–27"), el("span", { class: "chip" }, w ? w.hefte : "")),
    ring,
    el("div", { class: "minis" },
      el("div", { class: "mini" }, el("i", {}, fmtH(hours)), "saat/həftə"),
      el("div", { class: "mini" }, el("i", {}, String(topics.filter(t => t.status === "isl").length)), "işlənir"),
      el("div", { class: "mini" }, el("i", {}, String(topics.filter(t => t.ders).length)), "dərs"),
      el("div", { class: "mini" }, el("i", {}, String(topics.length)), "mövzu")),
    el("div", { class: "hey" }, el("b", {}, "Salam, Fikrət!"), el("span", {}, "Bu həftə nə etməli olduğun burada.")));
  const nav = el("nav", { class: "topnav", "aria-label": "Bölmələr" },
    NAV.map(([href, label]) => el("a", href === here ? { href, "aria-current": "page" } : { href }, label)));
  document.body.replaceChildren(el("div", { class: "app" }, rail, el("section", { class: "work" }, nav, content)));
  return { m, w, topics };
}

/* ---------- pages ---------- */
function topicCard(t) {
  const k = KAT[t.kat] || KAT.misc;
  const a = el(t.ders ? "a" : "div", t.ders ? { class: "ccard fade " + k.cls, href: t.ders } : { class: "ccard fade " + k.cls },
    el("div", { class: "ic" }, icon(t.kat, k.ink)),
    el("div", { class: "t" }, t.ad));
  const done = t.addim ? t.addim[0] : 0, all = t.addim ? t.addim[1] : 0;
  const bar = el("div", { class: "bar" }, el("i", { style: `width:${all ? Math.round(done / all * 100) : 0}%` }));
  a.append(bar, el("div", { class: "meta" }, el("span", {}, k.ad + " · " + t.bolme), el("span", {}, all ? `${done}/${all}` : (t.ders ? "dərs var" : "tezliklə"))));
  return a;
}

async function pageIndex() {
  const content = el("div", { class: "cols" });
  const { m, w, topics } = await shell(content);
  if (!m || !w) { content.append(el("p", { class: "empty" }, "Məlumat yüklənmədi.")); return; }
  // progress cards with tabs
  const groups = {
    isl: topics.filter(t => t.status === "isl"),
    yox: Object.keys(m).flatMap(s => m[s].filter(t => t.status === "yox").slice(0, 2).map(t => ({ ...t, subj: s, kat: SUBJ_KAT[s] }))),
    bag: topics.filter(t => t.status === "bag"),
  };
  const cards = el("div", { class: "cards" });
  const tabs = [["isl", "İşlənir"], ["yox", "Növbəti"], ["bag", "Bağlanıb"]].map(([k, label]) => {
    const b = el("button", { class: "tab", role: "tab", "aria-selected": String(k === "isl"), type: "button" }, label);
    b.addEventListener("click", () => { tabs.forEach(x => x.setAttribute("aria-selected", String(x === b))); draw(k); });
    return b;
  });
  function draw(k) {
    const list = groups[k];
    cards.replaceChildren(...(list.length ? list.map(topicCard) : [el("p", { class: "empty" }, k === "bag" ? "Hələ bağlanmış mövzu yoxdur — ilk mövzu yekun testdən sonra burada görünəcək." : "Boşdur.")]));
  }
  draw("isl");
  const left = el("div", { class: "stack" },
    el("section", {}, el("div", { class: "head", role: "tablist" }, ...tabs, el("a", { class: "more", href: "riyaziyyat.html" }, "Hamısı")), cards));
  // statistics
  const hours = w.saatlar.reduce((a, s) => a + s.saat, 0);
  const statItem = s => { const k = KAT[s.kat]; return el("div", { class: "stat" }, el("span", { class: "dot " + k.cls }, icon(s.kat, k.ink)), el("div", {}, el("small", {}, s.ad), el("b", {}, fmtH(s.saat) + " saat"))); };
  const half = Math.ceil(w.saatlar.length / 2);
  left.append(el("section", {},
    el("div", { class: "head" }, el("h2", {}, "Həftəlik saatlar"), el("span", { class: "more" }, "plan üzrə")),
    el("div", { class: "stats" },
      el("div", {}, ...w.saatlar.slice(0, half).map(statItem)),
      el("div", { class: "core" }, el("small", {}, "Hazırlıq saatı"), el("b", {}, fmtH(hours))),
      el("div", {}, ...w.saatlar.slice(half).map(statItem)))));
  // timeline
  const today = isoToday();
  const days = el("div", { class: "days" }, ...w.gunler.map(g => el("div", { class: "dcol" },
    el("div", { class: "dname" + (g.tarix === today ? " today" : "") }, g.qisa + " " + g.tarix.slice(8)),
    ...g.isler.map(t => { const k = KAT[t.kat] || KAT.misc; return el(t.link ? "a" : "div", t.link ? { class: "slot " + k.cls, href: t.link } : { class: "slot " + k.cls }, el("small", {}, t.saat), t.is); }))));
  left.append(el("section", {}, el("div", { class: "head" }, el("h2", {}, "Həftənin cədvəli"), el("span", { class: "more" }, w.hefte)), days));
  // right column
  const term = await load("data/terminler.json").catch(() => []);
  const upcoming = term.filter(t => t.tarix >= today).slice(0, 5);
  const side = el("aside", { class: "side" },
    el("section", {}, el("div", { class: "head" }, el("h2", {}, "Son tarixlər")),
      el("div", { class: "list" }, ...(upcoming.length ? upcoming.map(t => { const k = KAT[t.kat] || KAT.misc; return el("div", { class: "row" },
        el("span", { class: "ic " + k.cls }, icon(t.kat, k.ink)),
        el("div", { class: "tx" }, el("b", {}, t.ad), el("span", {}, t.qeyd || k.ad)),
        el("span", { class: "badge " + k.cls }, t.tarix.slice(8) + "." + t.tarix.slice(5, 7))); }) : [el("p", { class: "empty" }, "Yaxın son tarix yoxdur.")]))));
  const next = groups.isl.find(t => t.ders);
  if (next) side.append(el("section", {}, el("div", { class: "head" }, el("h2", {}, "Növbəti addım")),
    el("a", { class: "reco " + (KAT[next.kat] || KAT.misc).cls, href: next.ders, style: "margin-top:18px" },
      el("small", {}, (KAT[next.kat] || KAT.misc).ad), el("b", {}, next.ad), el("span", {}, "Dərsi aç, nümunələri kağızda özün hesabla, sonra məşqə keç."))));
  content.append(left, side);
}

async function pageTopics(key, title, lead) {
  const content = el("div", { style: "margin-top:30px" }, el("h1", {}, title), el("p", { class: "lead" }, lead));
  const { m } = await shell(content);
  if (!m) { content.append(el("p", { class: "empty" }, "Siyahı yüklənmədi.")); return; }
  const rows = m[key], kat = SUBJ_KAT[key];
  const c = s => rows.filter(r => r.status === s).length;
  content.append(el("p", { class: "lead" }, `${rows.length} mövzu · bağlanıb ${c("bag")} · işlənir ${c("isl")} · başlanmayıb ${c("yox")}`));
  const inProgress = rows.filter(r => r.status === "isl").map(r => ({ ...r, kat }));
  if (inProgress.length) content.append(el("div", { class: "cards" }, ...inProgress.map(topicCard)));
  const tb = el("tbody"); let sec = null, i = 0;
  rows.forEach(r => {
    if (r.bolme !== sec) { sec = r.bolme; tb.append(el("tr", { class: "sec" }, el("td", { colspan: "4" }, sec))); }
    i++;
    tb.append(el("tr", {}, el("td", { class: "n" }, String(i)),
      el("td", {}, r.ders ? el("a", { href: r.ders }, r.ad) : r.ad, r.fritl ? el("span", { class: "tag" }, "FRİTL") : null, r.yeni ? el("span", { class: "tag" }, "əlavə") : null),
      el("td", {}, stPill(r.status)), el("td", { style: "color:var(--muted)" }, r.ders ? "dərs var" : "tezliklə")));
  });
  content.append(el("div", { class: "tbl" }, el("table", {}, el("thead", {}, el("tr", {}, el("th", {}, "№"), el("th", {}, "Mövzu"), el("th", {}, "Vəziyyət"), el("th", {}, "Material"))), tb)));
}

async function pageFormulas() {
  const q = el("input", { class: "search", type: "search", placeholder: "Axtar: sin, təcil, parabola…", "aria-label": "Düstur axtar" });
  const list = el("div");
  const content = el("div", { style: "margin-top:30px" }, el("h1", {}, "Düsturlar"), el("p", { class: "lead" }, "Hər düsturun yanında: nə vaxt işlədilir, tipik səhv və izahı olan dərs."), q, list);
  await shell(content);
  const all = await load("data/dusturlar.json").catch(() => []);
  function draw(s) {
    s = s.toLowerCase(); list.replaceChildren();
    const f = all.filter(x => !s || (x.ad + x.fx + x.movzu + (x.nevaxt || "")).toLowerCase().includes(s));
    [...new Set(f.map(x => x.fenn))].forEach(fenn => {
      list.append(el("div", { class: "fsec" }, fenn), el("div", { class: "fgrid" }, ...f.filter(x => x.fenn === fenn).map(x => el("div", { class: "fcard" },
        el("div", { class: "m" }, x.movzu + " · " + x.ad), el("div", { class: "fx" }, x.fx), el("div", { class: "note" }, x.nevaxt || ""),
        x.sehv ? el("div", { class: "err" }, "Tipik səhv: " + x.sehv) : null, x.ders ? el("a", { href: x.ders }, "İzahı dərsdə →") : null))));
    });
    if (!f.length) list.append(el("p", { class: "empty" }, "Tapılmadı."));
  }
  draw(""); q.addEventListener("input", () => draw(q.value));
}

async function pageStatic(title, lead, html) {
  const box = el("div", { class: "box" }); box.innerHTML = html;
  await shell(el("div", { style: "margin-top:30px" }, el("h1", {}, title), el("p", { class: "lead" }, lead), box));
}

document.addEventListener("DOMContentLoaded", () => {
  const p = document.body.dataset.page;
  if (p === "index") pageIndex();
  else if (p === "riyaziyyat") pageTopics("riyaziyyat", "Riyaziyyat — buraxılış", "Hər mövzu giriş testi ilə başlayır: 80% və çox — mövzu bağlanır. Az olarsa: dərs → 20–25 məşq sualı → yekun test (80%). Bir həftə və bir ay sonra təkrar.");
  else if (p === "olimpiada") pageTopics("olimpiada", "Riyaziyyat olimpiadası", "Hər mövzuya ~2 həftə: dərs və 12–15 məşq sualı, sonra 5–6 olimpiada məsələsi (həll kağızda yazılır, şəkli göndərilir) və yekun test.");
  else if (p === "fizika") pageTopics("fizika", "Fizika", "FRİTL-də keçilən hər mövzu növbəti həftə burada təkrarlanır: sadə izah, məşq, test. FRİTL-in keçmədiyi mövzular ayrıca əlavə olunur.");
  else if (p === "dusturlar") pageFormulas();
  else if (p === "sinaqlar") pageStatic("Sınaqlar", "Şənbə 11:00–12:30 vaxt limitli sınaq: bir həftə riyaziyyat, bir həftə fizika.",
    '<p><b>Fizika</b> — <a href="dersler/fizika-mexanika-1.html">Mexanika sınağı 1</a> · 24 tapşırıq, 60 dəq <span class="st st-bag">işlənib: 23/24</span></p><p><b>Riyaziyyat</b> — <span class="empty">növbəti sınaq tezliklə.</span></p>');
  else if (p === "temrar") pageStatic("Təkrar", "Bağlanmış mövzulardan bir həftə və bir ay sonra 5 qarışıq sual; testlərdə səhv edilən suallar da bura düşür.",
    '<p class="empty">Hələ bağlanmış mövzu yoxdur — ilk mövzu bağlananda burada suallar görünəcək.</p>');
});
