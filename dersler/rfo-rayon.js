// RFO physics district-round mock ("rayon simulyasiyası"; father, 11 Nov 2026). Format of the real round: 20 questions,
// five options A–E, 150 minutes, +5 for a right answer, −1/4 of that for a wrong one, 0 for a blank.
// The questions come from the lessons' own generators (dersler/oyun-fiz-*.js), so every attempt is new: a number
// answer becomes five options (the right one + four plausible wrong ones). The topic mix follows data/rfo-rayon.json.
// The mock stays locked while any of its topics is not closed. An attempt in progress lives in localStorage
// ("oyun:rfo-rayon", synced like the games) and resumes after a reload; the clock keeps running meanwhile.
(function () {
  const KEY = "oyun:rfo-rayon", LETTERS = "ABCDE";
  const { h } = Oyun;
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} if (window.Skilly && Skilly.hal) Skilly.hal(k); };
  const chipsEl = document.getElementById("rz-chips"), root = document.getElementById("rz-root");

  // same seeded generation as assets/oyun.js: a level + a seed always gives the same problem
  const newSeed = () => (Math.random() * 4294967296) >>> 0;
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function genS(level, seed) { const keep = Math.random; Math.random = rng(seed); try { return level.gen(); } finally { Math.random = keep; } }
  const shuffle = (a, r = Math.random) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // ---- numbers as options: up to 4 significant digits, decimal comma, scientific form for very large/small values
  const SUP = { "-": "⁻", 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  function num(x) {
    if (Math.abs(x) < 1e-12) return "0";
    const neg = x < 0; x = Math.abs(x);
    let s;
    if (x >= 1e6 || x < 1e-3) {
      let e = Math.floor(Math.log10(x)), m = +(x / 10 ** e).toPrecision(3);
      if (m >= 10) { m /= 10; e++; }
      s = String(m).replace(".", ",") + "·10" + String(e).split("").map(c => SUP[c]).join("");
    } else s = String(+x.toPrecision(4)).replace(".", ",");
    return (neg ? "−" : "") + s;
  }
  const withUnit = (s, u) => !u ? s : /^10/.test(u) ? s + "·" + u : s + " " + u;
  // a wrong option looks like the right one: whole numbers stay whole (from 2 up), else as many digits as the answer
  const sigDigits = v => String(+Math.abs(v).toPrecision(4)).replace(/^0\.0*|\./g, "").replace(/0+$/, "").length || 1;
  function roundLike(c, v) {
    if (Number.isInteger(v)) return Math.abs(c) >= 2 ? Math.round(c) : Math.round(c * 10) / 10;
    return +c.toPrecision(Math.max(2, sigDigits(v)));
  }
  // five options for a number answer: the right one + four wrong ones built from typical slips (×2, ÷2, ×1,5, ×10, sign…)
  function options(q, seed) {
    const r = rng(seed ^ 0x5bd1e995), v = q.answer, pct = q.unit === "%";
    const seen = new Set([num(v)]), wrong = [];
    let cands;
    if (Math.abs(v) < 1e-9) cands = shuffle([1, 2, 3, 4, 5, 6, 8, 10, -1, -2], r);
    else {
      const m = shuffle([2, 0.5, 1.5, 2 / 3, 3, 1 / 3, 4, 0.25, 1.25, 0.8, 10, 0.1, 1.2, 5 / 6], r);
      cands = (v < 0 ? [-1] : []).concat(m).map(k => v * k);
      if (v < 0) cands.splice(1 + Math.floor(r() * 3), 0, -v * 0.5);
    }
    for (const c0 of cands) {
      if (wrong.length === 4) break;
      const c = Math.abs(v) < 1e-9 ? c0 : roundLike(c0, v);
      if (pct && (c <= 0 || c > 100)) continue;
      if (v > 0 && c <= 0) continue;
      if (Math.abs(v) > 1e-9 && Math.abs(c - v) < 0.04 * Math.abs(v)) continue;
      const s = num(c); if (seen.has(s)) continue;
      seen.add(s); wrong.push(c);
    }
    for (let k = 1; wrong.length < 4; k++) { const c = v + k * (Math.abs(v) || 1); const s = num(c); if (!seen.has(s)) { seen.add(s); wrong.push(c); } }
    const vals = shuffle([v, ...wrong], r);
    return { opts: vals.map(x => withUnit(num(x), q.unit)), correct: vals.indexOf(v) };
  }

  // ---- the lessons' generators: each file sets window.__levels when it runs (its own start() finds no game here)
  const GEN = {};
  function loadGen(slug) {
    if (GEN[slug]) return Promise.resolve(GEN[slug]);
    return new Promise((res, rej) => {
      const s = document.createElement("script"); s.src = "oyun-" + slug + ".js";
      s.onload = () => { GEN[slug] = window.__levels; res(GEN[slug]); }; s.onerror = () => rej(new Error(slug));
      document.head.append(s);
    });
  }
  const loadAll = async slugs => { for (const s of [...new Set(slugs)]) await loadGen(s); }; // one at a time: each sets window.__levels
  const usable = slug => (GEN[slug] || []).filter(l => l.id !== "sehv"); // "find the mistake" levels have three options, not a number

  let CFG, TOPICS, st;
  const T = slug => TOPICS.find(t => t.slug === slug);
  const lessonHref = slug => "../ders.html?p=" + slug;
  const save = () => put(KEY, st);

  // ---- topic chips (on top): status before an attempt, question count during it, result after it
  function chip(t, cls, extra, link) {
    const kids = [t.qisa, extra ? h("i", {}, extra) : null];
    return link ? h("a", { class: "rz-chip " + cls, href: lessonHref(t.slug), target: "_top", title: t.ad }, ...kids) : h("span", { class: "rz-chip " + cls, title: t.ad }, ...kids);
  }
  function drawChips(mode, data) {
    const grp = CFG.qruplar.map(g => {
      let ts = TOPICS.filter(t => t.grp === g.id), row;
      if (mode === "status") row = ts.map(t => chip(t, t.closed ? "" : "open", t.closed ? "✓" : "○", true));
      else {
        ts = ts.filter(t => data[t.slug]);
        row = ts.map(t => { const d = data[t.slug];
          if (mode === "run") return chip(t, "", "×" + d.n, false);
          const cls = d.duz === d.n ? "ok" : d.sehv && !d.duz ? "no" : !d.duz ? "none" : "part";
          return chip(t, cls, d.duz + "/" + d.n, true); });
      }
      return h("div", { class: "rz-grp" }, h("b", {}, g.ad + " · " + g.n + " sual"), h("div", { class: "rz-row" }, ...row));
    });
    const legend = mode === "status" ? h("div", { class: "rz-legend" }, h("span", { style: "--c:var(--subj)" }, "✓ bağlanıb"), h("span", { style: "--c:var(--line-1)" }, "○ hələ bağlanmayıb"))
      : mode === "done" ? h("div", { class: "rz-legend" }, h("span", { style: "--c:var(--ok)" }, "hamısı düz"), h("span", { style: "--c:var(--part,#7a5200)" }, "qismən"),
        h("span", { style: "--c:var(--warn)" }, "səhv"), h("span", { style: "--c:var(--line-1)" }, "boş")) : null;
    chipsEl.replaceChildren(h("div", { class: "rz-chips" }, ...grp, legend));
  }

  // ---- gate: locked while any topic of the mock is open
  function drawGate() {
    const open = TOPICS.filter(t => !t.closed);
    drawChips("status");
    root.replaceChildren(h("div", { class: "rfo-gate" }, h("h2", {}, "🔒 Simulyasiya hələ bağlıdır"),
      h("p", {}, "Simulyasiya rayon turunun bütün mövzuları bağlananda açılır. " + TOPICS.length + " mövzudan " + (TOPICS.length - open.length) + "-i bağlanıb, " + open.length + "-i qalıb:"),
      h("div", { class: "rz-row" }, ...open.map(t => chip(t, "open", "→", true))),
      history()));
  }

  function history() {
    const hs = (st.hist || []).slice(-5).reverse();
    if (!hs.length) return null;
    const d = at => { const x = new Date(at); return String(x.getDate()).padStart(2, "0") + "." + String(x.getMonth() + 1).padStart(2, "0"); };
    return h("p", { class: "rz-hist" }, "Əvvəlki cəhdlər: " + hs.map(x => d(x.at) + " — " + num(x.bal) + " bal").join(" · "));
  }

  function drawStart() {
    drawChips("status");
    root.replaceChildren(h("div", { class: "oy-intro" }, h("h2", {}, "Hazırsan?"),
      h("p", {}, "Başlayanda saat işə düşür və dayanmır — səhifəni bağlasan da vaxt gedir; qayıdanda qaldığın yerdən davam edirsən. İstədiyin suala keçə, cavabı dəyişə və ya silə bilərsən. Vaxt bitəndə sınaq özü bitir."),
      h("p", {}, "Cavab nə düz, nə səhv göstərilir — yalnız sonda bal və mövzular üzrə nəticə. Səhv cavablar səhv jurnalına düşür."),
      h("button", { type: "button", class: "btn", on: { click: begin } }, (st.hist || []).length ? "Yeni cəhd başla" : "Simulyasiyaya başla"),
      history()));
  }

  // ---- a new attempt: topics by group, a level and a seed for each question
  async function begin() {
    root.replaceChildren(h("p", { class: "rfo-src" }, "Suallar hazırlanır…"));
    const pickSlugs = [];
    CFG.qruplar.forEach(g => { const ts = shuffle(TOPICS.filter(t => t.grp === g.id)); for (let i = 0; i < g.n; i++) pickSlugs.push(ts[i % ts.length].slug); });
    await loadAll(pickSlugs);
    const usedLv = {};
    const qs = pickSlugs.map(slug => {
      const lv = shuffle(usable(slug)), used = usedLv[slug] = usedLv[slug] || [];
      const order = lv.filter(l => !used.includes(l.id)).concat(lv.filter(l => used.includes(l.id)));
      for (const l of order) for (let k = 0; k < 20; k++) {
        const seed = newSeed(), q = genS(l, seed);
        if (!q.choices && isFinite(q.answer)) { used.push(l.id); return { slug, lv: l.id, seed }; }
      }
      throw new Error("no number question in " + slug);
    });
    const now = Date.now();
    st.run = { v: 1, start: now, end: now + CFG.deqiqe * 60000, qs, ans: qs.map(() => null), flag: [], i: 0 };
    save(); run();
  }

  // ---- the attempt
  let Q = [], tick = null;
  async function run() {
    const R = st.run;
    await loadAll(R.qs.map(x => x.slug));
    Q = R.qs.map(x => { const l = GEN[x.slug].find(l => l.id === x.lv), q = genS(l, x.seed); return { ...x, q, ...options(q, x.seed) }; });
    const counts = {}; Q.forEach(x => { (counts[x.slug] = counts[x.slug] || { n: 0 }).n++; });
    drawChips("run", counts);
    const clock = h("span", { class: "rz-clock", role: "timer" }), stat = h("span", { class: "rz-stat" });
    const endBtn = h("button", { type: "button", class: "btn", on: { click: () => askEnd() } }, "Bitir");
    const pal = h("div", { class: "rz-pal", role: "navigation", "aria-label": "Suallar" });
    const box = h("div"), confirmBox = h("div");
    root.replaceChildren(h("div", { class: "rz-top" }, clock, stat, endBtn), confirmBox, pal, box);
    const left = () => Math.max(0, R.end - Date.now());
    const fmt = ms => { const s = Math.ceil(ms / 1000); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
    const showClock = () => { const l = left(); clock.textContent = "⏱ " + fmt(l); clock.classList.toggle("low", l < 10 * 60000); if (!l) finish(true); };
    clearInterval(tick); tick = setInterval(showClock, 500); showClock();
    if (!st.run) return; // time was already over: finished above

    function drawPal() {
      pal.replaceChildren(...Q.map((_, i) => h("button", { type: "button", class: (R.ans[i] != null ? "an" : "") + (i === R.i ? " cur" : "") + (R.flag.includes(i) ? " flag" : ""),
        "aria-label": "Sual " + (i + 1) + (R.ans[i] != null ? ", cavablanıb" : "") + (R.flag.includes(i) ? ", işarəli" : ""), on: { click: () => go(i) } }, String(i + 1))));
      stat.textContent = "Cavablanıb: " + R.ans.filter(a => a != null).length + " / " + Q.length;
    }
    function go(i) { R.i = i; save(); drawQ(); drawPal(); }
    function drawQ() {
      const i = R.i, x = Q[i];
      const opts = h("div", { class: "rz-opts", role: "radiogroup", "aria-label": "Variantlar" }, ...x.opts.map((o, k) => h("button", { type: "button", role: "radio", "aria-checked": String(R.ans[i] === k),
        on: { click: () => { R.ans[i] = R.ans[i] === k ? null : k; save(); drawQ(); drawPal(); } } }, h("b", {}, LETTERS[k]), h("span", {}, o))));
      const flagged = R.flag.includes(i);
      box.replaceChildren(h("div", { class: "rz-q" },
        h("div", { class: "oy-label" }, h("span", {}, "Sual " + (i + 1) + " / " + Q.length), h("span", {}, "5 bal")),
        h("div", { class: "oy-text" }, x.q.text), x.q.svg || null, opts,
        h("div", { class: "rz-nav" },
          h("button", { type: "button", class: "btn ghost", ...(i ? {} : { disabled: "" }), on: { click: () => go(i - 1) } }, "← Əvvəlki"),
          h("button", { type: "button", class: "btn ghost", on: { click: () => { flagged ? R.flag.splice(R.flag.indexOf(i), 1) : R.flag.push(i); save(); drawQ(); drawPal(); } } }, flagged ? "İşarəni götür" : "İşarələ"),
          R.ans[i] != null ? h("button", { type: "button", class: "btn ghost", on: { click: () => { R.ans[i] = null; save(); drawQ(); drawPal(); } } }, "Cavabı sil") : null,
          h("span", { class: "sp" }),
          i + 1 < Q.length ? h("button", { type: "button", class: "btn", on: { click: () => go(i + 1) } }, "Növbəti →")
            : h("button", { type: "button", class: "btn", on: { click: () => askEnd() } }, "Bitir"))));
    }
    function askEnd() {
      const blank = R.ans.filter(a => a == null).length;
      confirmBox.replaceChildren(h("div", { class: "rfo-gate" }, h("p", {}, (blank ? blank + " sual boşdur. " : "") + "Qalan vaxt: " + fmt(left()) + ". Sınağı bitirmək istəyirsən?"),
        h("div", { class: "rz-nav" }, h("button", { type: "button", class: "btn", on: { click: () => finish(false) } }, "Bəli, bitir"),
          h("button", { type: "button", class: "btn ghost", on: { click: () => confirmBox.replaceChildren() } }, "Davam et"))));
      confirmBox.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    drawPal(); drawQ();
  }

  // ---- end of an attempt: score, result per topic, the result record, wrong answers to the error journal
  function finish(timeUp) {
    const R = st.run; if (!R) return;
    clearInterval(tick);
    const at = Date.now(), sec = Math.round((Math.min(at, R.end) - R.start) / 1000);
    const per = {}; let duz = 0, sehv = 0, bos = 0;
    const items = Q.map((x, i) => {
      const a = R.ans[i], res = a == null ? "bos" : a === x.correct ? "duz" : "sehv";
      const p = per[x.slug] = per[x.slug] || { n: 0, duz: 0, sehv: 0, bos: 0 };
      p.n++; p[res]++; res === "duz" ? duz++ : res === "sehv" ? sehv++ : bos++;
      return { slug: x.slug, res };
    });
    const bal = duz * CFG.bal - sehv * CFG.bal * CFG.cerime;
    const mm = Math.floor(sec / 60) + " dəq " + (sec % 60) + " san";
    st.last = { at, bal, duz, sehv, bos, sec, timeUp, per, items };
    st.hist = (st.hist || []).concat({ at, bal, duz, sehv, bos, sec });
    delete st.run; save();
    if (window.Skilly) {
      Skilly.netice({ id: "rfo-rayon-sim@" + at, ders: "RFO fizika — rayon simulyasiyası", fenn: "fizika", bal, max: CFG.sual * CFG.bal, vaxt: sec,
        qeyd: "düz " + duz + ", səhv " + sehv + ", boş " + bos + "; vaxt " + mm + (timeUp ? " (vaxt bitdi)" : "") + "; " +
          Object.entries(per).map(([s, p]) => T(s).qisa + " " + p.duz + "/" + p.n).join(", "),
        movzular: per });
      Q.forEach((x, i) => { if (items[i].res !== "sehv") return; const t = T(x.slug);
        Skilly.sehv({ id: "rfo-rayon-" + at + "#" + (i + 1), fenn: "fizika", movzu: t.ad, menbe: "RFO rayon simulyasiyası — sual " + (i + 1), link: "dersler/" + x.slug + ".html",
          sual: typeof x.q.text === "string" ? x.q.text : x.q.text.textContent, cavab: LETTERS[R.ans[i]] + ") " + x.opts[R.ans[i]], duz: LETTERS[x.correct] + ") " + x.opts[x.correct],
          q2: { choices: x.opts.map((o, k) => LETTERS[k] + ") " + o), correct: x.correct, answer: null, tol: null, unit: "", svg: x.q.svg && x.q.svg.outerHTML ? x.q.svg.outerHTML : "" } }); });
    }
    drawResult(st.last);
  }

  function drawResult(L) {
    drawChips("done", L.per);
    const mm = Math.floor(L.sec / 60) + ":" + String(L.sec % 60).padStart(2, "0");
    root.replaceChildren(h("div", { class: "oy-intro" }, h("h2", {}, "Nəticə" + (L.timeUp ? " — vaxt bitdi" : "")),
      h("div", { class: "rz-score" },
        h("div", {}, h("b", {}, num(L.bal) + " / " + CFG.sual * CFG.bal), h("span", {}, "bal")),
        h("div", {}, h("b", {}, String(L.duz)), h("span", {}, "düz · +" + num(L.duz * CFG.bal))),
        h("div", {}, h("b", {}, String(L.sehv)), h("span", {}, "səhv · −" + num(L.sehv * CFG.bal * CFG.cerime))),
        h("div", {}, h("b", {}, String(L.bos)), h("span", {}, "boş · 0")),
        h("div", {}, h("b", {}, mm), h("span", {}, "vaxt (150:00-dan)"))),
      L.sehv ? h("p", {}, "Səhv cavablar səhv jurnalına düşdü (Təkrar). Mövzu çipinə basanda həmin dərs açılır.") : h("p", {}, "Mövzu çipinə basanda həmin dərs açılır."),
      h("ol", { class: "rz-list" }, ...L.items.map((x, i) => { const t = T(x.slug);
        return h("li", { class: x.res === "duz" ? "ok" : x.res === "sehv" ? "no" : "bos" }, h("span", {}, (i + 1) + ". " + (x.res === "duz" ? "✓" : x.res === "sehv" ? "✗" : "–")),
          h("a", { href: lessonHref(x.slug), target: "_top" }, t ? t.qisa : x.slug), h("span", { class: "rz-stat" }, x.res === "duz" ? "düz" : x.res === "sehv" ? "səhv" : "boş")); })),
      h("button", { type: "button", class: "btn", on: { click: () => { delete st.last; save(); TOPICS.every(t => t.closed) ? drawStart() : drawGate(); } } }, "Yeni cəhd"),
      history()));
  }

  async function init() {
    try {
      const [cfg, m] = await Promise.all(["../data/rfo-rayon.json", "../data/movzular.json"].map(p => fetch(p, { cache: "no-cache" }).then(r => { if (!r.ok) throw new Error(p); return r.json(); })));
      CFG = cfg;
      const byLink = {}; for (const k in m) m[k].forEach(t => { if (t.ders) byLink[t.ders] = t; });
      const bag = get("skilly-bag", []);
      TOPICS = CFG.qruplar.flatMap(g => g.movzular.map(x => { const link = "dersler/" + x.slug + ".html", t = byLink[link] || {};
        return { ...x, grp: g.id, ad: t.ad || x.qisa, closed: t.status === "bag" || bag.includes(link) }; }));
    } catch (e) { root.replaceChildren(h("p", { class: "oy-err" }, "Məlumat yüklənmədi. Səhifəni yenilə.")); return; }
    st = get(KEY, {});
    if (st.run) return run();                 // an attempt in progress always resumes (the clock kept running)
    if (st.last) return drawResult(st.last);  // the last result stays on screen until a new attempt
    TOPICS.every(t => t.closed) ? drawStart() : drawGate();
  }
  init();
})();
