// Portal shell + page renderers. Every page is <body data-page="..."> and gets the same rail and top navigation.
const NAV = [
  ["index.html", "Bu həftə"], ["teqvim.html", "Təqvim"], ["riyaziyyat.html", "Riyaziyyat"], ["olimpiada.html", "Olimpiada"],
  ["fizika.html", "Fizika"], ["sinaqlar.html", "Sınaqlar"], ["temrar.html", "Səhvlər"], ["dusturlar.html", "Düsturlar"],
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
  ring.innerHTML = `<svg viewBox="0 0 220 220"><circle cx="110" cy="110" r="100" fill="none" style="stroke:var(--rail-2)" stroke-width="2"/>
    <circle cx="110" cy="110" r="100" fill="none" style="stroke:var(--rail-ink)" stroke-width="2" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C}"/></svg>`;
  ring.append(el("div", { class: "v" }, el("div", { class: "big" }, String(closed)), el("div", { class: "lbl" }, `${total} mövzudan bağlanıb`, el("br"), `${pct}%`)));
  requestAnimationFrame(() => requestAnimationFrame(() => { ring.querySelectorAll("circle")[1].style.strokeDashoffset = C * (1 - Math.max(pct, 1) / 100); }));
  const term = await load("data/terminler.json").catch(() => []);
  const exam = term.find(t => t.tarix >= isoToday() && t.ad.startsWith("Buraxılış"));
  const toExam = exam ? Math.round((new Date(exam.tarix) - new Date(isoToday())) / 864e5) : "–";
  const rail = el("aside", { class: "rail" },
    el("a", { class: "logo", href: "index.html" }, "Skilly"),
    el("div", { class: "who" }, el("div", { class: "avatar" }, "F"), el("b", {}, "Fikrət"), el("span", {}, "9-cu sinif · 2026–27"), el("span", { class: "chip" }, w ? w.hefte : "")),
    ring,
    el("div", { class: "minis" },
      el("div", { class: "mini" }, el("i", {}, String(toExam)), "gün sınağa"),
      el("div", { class: "mini" }, el("i", {}, String(topics.filter(t => t.status === "isl").length)), "işlənir"),
      el("div", { class: "mini" }, el("i", {}, String(topics.filter(t => t.ders).length)), "dərs"),
      el("div", { class: "mini" }, el("i", {}, String(topics.length)), "mövzu")),
    el("div", { class: "hey" }, el("b", {}, "Salam, Fikrət!"), el("span", {}, "Bu həftə nə etməli olduğun burada.")));
  const nav = el("nav", { class: "topnav", "aria-label": "Bölmələr" },
    NAV.map(([href, label]) => el("a", href === here ? { href, "aria-current": "page" } : { href }, label)));
  document.body.replaceChildren(el("div", { class: "app" }, rail, el("section", { class: "work" }, nav, content)));
  return { m, w, topics, term };
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
  const content = el("div", { style: "margin-top:30px" });
  const { m, w, topics, term } = await shell(content);
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
  // timeline
  const today = isoToday();
  const days = el("div", { class: "days" }, ...w.gunler.map(g => el("div", { class: "dcol" },
    el("div", { class: "dname" + (g.tarix === today ? " today" : "") }, g.qisa + " " + g.tarix.slice(8)),
    ...g.isler.map(t => { const k = KAT[t.kat] || KAT.misc; return el(t.link ? "a" : "div", t.link ? { class: "slot " + k.cls, href: t.link } : { class: "slot " + k.cls }, el("small", {}, t.saat), t.is); }))));
  left.append(el("section", {}, el("div", { class: "head" }, el("h2", {}, "Həftənin cədvəli"), el("span", { class: "more" }, w.hefte)), days));
  // right column
  const upcoming = term.filter(t => t.tarix >= today).slice(0, 5);
  const dl = el("section", {}, el("div", { class: "head" }, el("h2", {}, "Son tarixlər"), el("a", { class: "more", href: "teqvim.html" }, "Təqvim")),
      el("div", { class: "list dl" }, ...(upcoming.length ? upcoming.map(t => { const k = KAT[t.kat] || KAT.misc; return el("div", { class: "row" },
        el("span", { class: "ic " + k.cls }, icon(t.kat, k.ink)),
        el("div", { class: "tx" }, el("b", {}, t.ad), el("span", {}, t.qeyd || k.ad)),
        el("span", { class: "badge " + k.cls }, t.tarix.slice(8) + "." + t.tarix.slice(5, 7))); }) : [el("p", { class: "empty" }, "Yaxın son tarix yoxdur.")])));
  left.children[0].after(dl);
  content.append(left);
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
        el("span", { class: "ic " + k.cls }, icon(e.kat, k.ink)),
        el("div", { class: "tx" }, el("b", {}, e.is), el("span", {}, e.saat || e.qeyd || k.ad)),
        e.son ? el("span", { class: "badge " + k.cls }, "son tarix") : null); })
        : [el("p", { class: "empty" }, sel < today ? "Bu gün üçün qeyd yoxdur. Nəticələr Google Sheets qoşulandan sonra burada görünəcək." : "Plan yoxdur — həftənin cədvəli hər bazar yenilənir.")])));
  }
  content.append(el("div", { class: "head", style: "margin-top:26px" }, title, el("span", { class: "more" }, prev, " ", next)), grid, day);
  draw();
}

/* ---------- səhv jurnalı ---------- */
const KATS = { hesab: "Hesab / diqqət", qayda: "Qaydanı bilmirdim", sert: "Şərti səhv başa düşdüm" };
const FENN = { riyaziyyat: ["math", "Riyaziyyat"], olimpiada: ["olym", "Olimpiada"], fizika: ["phys", "Fizika"] };
const dmy = iso => iso ? iso.slice(8) + "." + iso.slice(5, 7) : "–";
const SST = { yeni: ["Təhlil gözləyir", "st-err"], aciq: ["Təkrarda", "st-isl"], baglandi: ["Bağlanıb", "st-bag"] };

function seg(opts, onPick) {
  let val = "";
  const box = el("div", { class: "seg", role: "radiogroup" });
  Object.entries(opts).forEach(([k, label]) => {
    const b = el("button", { type: "button", role: "radio", "aria-checked": "false" }, label);
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
  const kat = seg(KATS, () => { err.textContent = ""; });
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
  const content = el("div", { style: "margin-top:30px" }, el("h1", {}, "Səhv jurnalı"),
    el("p", { class: "lead" }, "Dərslərdə və sınaqlarda səhv etdiyin suallar özü bura düşür. Sən yalnız səhvin növünü seçirsən və düzgün yolu bir cümlə ilə yazırsan. Sual bir həftə sonra, sonra bir ay sonra yenə gəlir. İki dəfə düz həll edəndə səhv bağlanır."),
    sync, body);
  await shell(content);
  function draw() {
    const all = Skilly.all(), t = Skilly.today(), month = t.slice(0, 7);
    const yeni = all.filter(e => e.status === "yeni");
    const due = all.filter(e => e.status === "aciq" && e.novbeti && e.novbeti <= t);
    const open = all.filter(e => e.status !== "baglandi");
    const thisMonth = all.filter(e => (e.tarix || "").startsWith(month));
    const metric = (label, v) => el("div", { class: "metric" }, el("small", {}, label), el("b", {}, String(v)));
    const sec = (title, kids, more) => el("section", { class: "e-sec" }, el("div", { class: "head" }, el("h2", {}, title), more ? el("span", { class: "more" }, more) : null), ...kids);
    body.replaceChildren(
      el("div", { class: "metrics" }, metric("Təhlil gözləyir", yeni.length), metric("Bu gün təkrar", due.length), metric("Açıq", open.length), metric("Bu ay", thisMonth.length)),
      sec("Təhlil gözləyir", yeni.length ? [el("div", { class: "e-list" }, ...yeni.map(e => analyseCard(e, draw)))] : [el("p", { class: "empty" }, "Hamısı təhlil olunub.")]),
      sec("Təkrar vaxtıdır", due.length ? [el("div", { class: "e-list" }, ...due.map(e => redoCard(e, draw)))] : [el("p", { class: "empty" }, "Bu gün təkrar yoxdur.")]),
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
  draw();
  sync.textContent = (await Skilly.configured()) ? "Google Sheets-ə qoşulub." : "Hələlik yalnız bu cihazda saxlanır. Google Sheets qoşulandan sonra ata da görəcək.";
  if ((await Skilly.pull()).synced) draw();
}

async function pageStatic(title, lead, html) {
  const box = el("div", { class: "box" }); box.innerHTML = html;
  await shell(el("div", { style: "margin-top:30px" }, el("h1", {}, title), el("p", { class: "lead" }, lead), box));
}

document.addEventListener("DOMContentLoaded", () => {
  const p = document.body.dataset.page;
  if (p === "index") pageIndex();
  else if (p === "teqvim") pageCalendar();
  else if (p === "riyaziyyat") pageTopics("riyaziyyat", "Riyaziyyat — buraxılış", "Hər mövzu giriş testi ilə başlayır: 80% və çox — mövzu bağlanır. Az olarsa: dərs → 20–25 məşq sualı → yekun test (80%). Bir həftə və bir ay sonra təkrar.");
  else if (p === "olimpiada") pageTopics("olimpiada", "Riyaziyyat olimpiadası", "Hər mövzuya ~2 həftə: dərs və 12–15 məşq sualı, sonra 5–6 olimpiada məsələsi (həll kağızda yazılır, şəkli göndərilir) və yekun test.");
  else if (p === "fizika") pageTopics("fizika", "Fizika", "FRİTL-də keçilən hər mövzu növbəti həftə burada təkrarlanır: sadə izah, məşq, test. FRİTL-in keçmədiyi mövzular ayrıca əlavə olunur.");
  else if (p === "dusturlar") pageFormulas();
  else if (p === "sinaqlar") pageStatic("Sınaqlar", "Şənbə 11:00–12:30 vaxt limitli sınaq: bir həftə riyaziyyat, bir həftə fizika.",
    '<p><b>Fizika</b> — <a href="dersler/fizika-mexanika-1.html">Mexanika sınağı 1</a> · 24 tapşırıq, 60 dəq <span class="st st-bag">işlənib: 23/24</span></p><p><b>Riyaziyyat</b> — <span class="empty">növbəti sınaq tezliklə.</span></p>');
  else if (p === "temrar") pageSehv();
});
