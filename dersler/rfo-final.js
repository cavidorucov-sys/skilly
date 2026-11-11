// RFO physics final mock (father, 11 Nov 2026): theory round = 3 written problems of 10 points in 3 hours, new problems
// in the style of the real finals, a new set each attempt (A, B, C, then A again); experiment = home practice in the
// format of the real experiment round (table, graph, quantity from the slope, conclusion; 15 points). Solutions are
// written on paper; Fikrət photographs the pages into Skilly (Skilly.sekil, Firestore), and they are checked with the
// marking in layihe/rfo-final-meseleler.md, which is not on the site. Locked until every physics topic is closed. State: "oyun:rfo-final" (synced like games).
(function () {
  const KEY = "oyun:rfo-final";
  const { h } = Oyun;
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} if (window.Skilly && Skilly.hal) Skilly.hal(k); };
  const chipsEl = document.getElementById("rz-chips"), root = document.getElementById("rz-root");
  let CFG, TOPICS, st, tick = null;
  const save = () => put(KEY, st);
  const fmt = ms => { const s = Math.ceil(ms / 1000); return Math.floor(s / 3600) + ":" + String(Math.floor(s / 60) % 60).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); };
  const dmy = at => { const x = new Date(at); return String(x.getDate()).padStart(2, "0") + "." + String(x.getMonth() + 1).padStart(2, "0"); };
  const chip = (t, cls, extra) => h("a", { class: "rz-chip " + cls, href: "../ders.html?p=" + t.slug, target: "_top", title: t.ad }, t.qisa, h("i", {}, extra));

  // photos of the written work for one attempt (ref); Fikrət adds and removes, the father only looks
  function photoBox(ref, onChange) {
    const box = h("div", { class: "rz-photos" }), msg = h("p", { class: "rz-stat", "aria-live": "polite" });
    const grid = h("div", { class: "rz-thumbs" });
    const viewer = window.Skilly && Skilly.viewer && Skilly.viewer();
    let list = [], busy = false;
    const draw = () => {
      grid.replaceChildren(...list.map((p, i) => h("figure", { class: "rz-thumb" },
        h("a", { href: p.data, target: "_blank", rel: "noopener", title: "Böyüt" }, h("img", { src: p.data, alt: "Səhifə " + (i + 1) })),
        h("figcaption", {}, "Səhifə " + (i + 1), viewer ? null : h("button", { type: "button", class: "rz-del", "aria-label": "Səhifə " + (i + 1) + " şəklini sil",
          on: { click: async () => { if (!confirm("Səhifə " + (i + 1) + " şəkli silinsin?")) return; await Skilly.sekil.del(p.id); list.splice(i, 1); draw(); onChange && onChange(list.length); } } }, "Sil")))));
      if (!busy) msg.textContent = list.length ? list.length + " şəkil Skilly-də saxlanıb." : "Hələ şəkil yoxdur.";
    };
    const input = h("input", { type: "file", accept: "image/*", multiple: "", hidden: "" });
    input.addEventListener("change", async () => {
      const files = [...input.files]; input.value = "";
      busy = true;
      for (let i = 0; i < files.length; i++) {
        msg.textContent = "Yüklənir: " + (i + 1) + " / " + files.length + "...";
        try { list.push(await Skilly.sekil.add(ref, files[i])); } catch (e) { busy = false; draw(); msg.textContent = "Alınmadı: " + (e.message || e); return; }
        draw();
      }
      busy = false; draw(); onChange && onChange(list.length);
    });
    const addBtn = h("button", { type: "button", class: "btn", on: { click: () => input.click() } }, "📷 Şəkil əlavə et");
    box.append(viewer ? "" : h("div", { class: "rz-nav" }, addBtn), input, msg, grid);
    msg.textContent = "Yüklənir...";
    (window.Skilly ? Skilly.sekil.list(ref) : Promise.resolve(null)).then(r => {
      if (r === null) { addBtn.disabled = true; msg.textContent = "Şəkilləri Skilly-də saxlamaq üçün əvvəl soldakı “Google ilə daxil ol” düyməsi ilə öz hesabına daxil ol."; return; }
      list = r; draw(); onChange && onChange(list.length);
    }).catch(() => { msg.textContent = "Şəkillər yüklənmədi (internet?)."; });
    return box;
  }

  function drawChips() {
    chipsEl.replaceChildren(h("div", { class: "rz-chips" }, h("div", { class: "rz-grp" }, h("b", {}, "Fizikanın " + TOPICS.length + " mövzusu"),
      h("div", { class: "rz-row" }, ...TOPICS.map(t => chip(t, t.closed ? "" : "open", t.closed ? "✓" : "○")))),
      h("div", { class: "rz-legend" }, h("span", { style: "--c:var(--subj)" }, "✓ bağlanıb"), h("span", { style: "--c:var(--line-1)" }, "○ hələ bağlanmayıb"))));
  }
  function drawGate() {
    const open = TOPICS.filter(t => !t.closed);
    root.replaceChildren(h("div", { class: "rfo-gate" }, h("h2", {}, "🔒 Simulyasiya hələ bağlıdır"),
      h("p", {}, "Final simulyasiyası fizikanın bütün mövzuları bağlananda açılır. " + TOPICS.length + " mövzudan " + (TOPICS.length - open.length) + "-i bağlanıb, " + open.length + "-i qalıb:"),
      h("div", { class: "rz-row" }, ...open.map(t => chip(t, "open", "→")))));
  }

  // ---- home: theory round + experiment practice
  function drawHome() {
    const done = st.done || [], next = CFG.desteler[done.length % CFG.desteler.length];
    const hist = (st.hist || []).slice(-6).reverse();
    root.replaceChildren(
      h("div", { class: "oy-intro" }, h("h2", {}, "Nəzəri tur"),
        h("p", {}, "3 məsələ, hər biri " + CFG.meseleBal + " bal, " + CFG.deqiqe / 60 + " saat. Cavab yox, həll yoxlanılır: hər düzgün addıma bal verilir. Düsturu, hesabı, vahidi kağızda tam yaz; cədvəl və qrafik də kağızda. Kalkulyator icazəlidir."),
        h("p", {}, "Başlayanda saat işə düşür və dayanmır. Vaxt bitəndə və ya “Bitir” basanda həllin səhifələrinin şəklini çəkib buraya əlavə edirsən; həll bal meyarları ilə yoxlanılır."),
        h("p", { class: "rfo-src" }, "Hər cəhddə yeni məsələlər: indi " + CFG.desteler.length + " dəst var, növbəti — dəst " + next.id + "." + (done.length >= CFG.desteler.length ? " Bütün dəstləri həll etmisən, dəstlər təkrarlanır." : "")),
        h("button", { type: "button", class: "btn", on: { click: begin } }, "Nəzəri turu başla"),
        hist.length ? h("div", { class: "rz-hist" }, "Əvvəlki cəhdlər (şəkillərə bax və ya əlavə et): ", ...hist.map(x => h("button", { type: "button", class: "rz-link", on: { click: () => drawSent(x) } }, dmy(x.at) + " — dəst " + x.dest + ", " + fmt(x.sec * 1000)))) : null),
      h("div", { class: "oy-intro" }, h("h2", {}, "Evdə eksperiment"),
        h("p", {}, "Finalda eksperiment turu imtahan yerində, verilən cihazlarla keçir. Burada eyni formatda evdə məşq edirsən: ölçmə, cədvəl, qrafik, qrafikdən kəmiyyət, nəticə — " + CFG.eksperimentBal + " bal."),
        h("div", { class: "list rz-exp" }, ...CFG.eksperimentler.map(e => h("button", { type: "button", class: "rz-exp-row", on: { click: () => drawExp(e) } },
          h("b", {}, e.id + ". " + e.ad), h("span", {}, ((st.eksp || {})[e.id] ? "göndərilib " + dmy(st.eksp[e.id]) + " · " : "") + "Aç →"))))));
  }

  function problemCard(p, i) {
    return h("article", { class: "rz-q rz-prob" }, h("div", { class: "oy-label" }, h("span", {}, "Məsələ " + (i + 1) + " · " + p.movzu), h("span", {}, CFG.meseleBal + " bal")),
      h("h3", {}, p.ad), h("p", {}, p.metn),
      h("ol", { class: "rz-parts" }, ...p.bendler.map((b, k) => h("li", {}, h("b", {}, "abc"[k] + ") "), b.metn, h("span", { class: "rz-pts" }, " (" + b.bal + " bal)")))));
  }

  // ---- theory round
  function begin() {
    const done = st.done || [], d = CFG.desteler[done.length % CFG.desteler.length], now = Date.now();
    st.run = { dest: d.id, start: now, end: now + CFG.deqiqe * 60000 }; save(); run();
  }
  function run() {
    const R = st.run, d = CFG.desteler.find(x => x.id === R.dest);
    const clock = h("span", { class: "rz-clock", role: "timer" });
    const confirmBox = h("div");
    const askEnd = () => confirmBox.replaceChildren(h("div", { class: "rfo-gate" }, h("p", {}, "Qalan vaxt: " + fmt(Math.max(0, R.end - Date.now())) + ". Nəzəri turu bitirmək istəyirsən?"),
      h("div", { class: "rz-nav" }, h("button", { type: "button", class: "btn", on: { click: () => finish(false) } }, "Bəli, bitir"),
        h("button", { type: "button", class: "btn ghost", on: { click: () => confirmBox.replaceChildren() } }, "Davam et"))));
    root.replaceChildren(h("div", { class: "rz-top" }, clock, h("span", { class: "rz-stat" }, "Dəst " + d.id + " · 3 məsələ · " + 3 * CFG.meseleBal + " bal"),
      h("button", { type: "button", class: "btn", on: { click: askEnd } }, "Bitir")), confirmBox,
      ...d.meseleler.map(problemCard));
    const show = () => { const l = Math.max(0, R.end - Date.now()); clock.textContent = "⏱ " + fmt(l); clock.classList.toggle("low", l < 15 * 60000); if (!l) finish(true); };
    clearInterval(tick); tick = setInterval(show, 500); show();
  }
  function finish(timeUp) {
    const R = st.run; if (!R) return;
    clearInterval(tick);
    const at = Date.now(), sec = Math.round((Math.min(at, R.end) - R.start) / 1000), ref = "rfo-final-" + R.dest + "-" + R.start;
    st.done = (st.done || []).concat(R.dest);
    st.hist = (st.hist || []).concat({ at, dest: R.dest, sec, timeUp, ref });
    st.last = { at, dest: R.dest, sec, timeUp, ref };
    delete st.run; save();
    if (window.Skilly) Skilly.netice({ id: "rfo-final-sim@" + at, ders: "RFO fizika — final simulyasiyası (nəzəri tur)", fenn: "fizika", max: 3 * CFG.meseleBal, vaxt: sec,
      qeyd: "dəst " + R.dest + "; vaxt " + fmt(sec * 1000) + (timeUp ? " (vaxt bitdi)" : "") + "; həll kağızda, şəkillər Skilly-də (" + ref + "); yoxlama bal meyarları ilə", sekil: ref });
    drawSent(st.last);
  }
  function drawSent(L) {
    const fresh = st.last && st.last.at === L.at;
    root.replaceChildren(h("div", { class: "oy-intro" }, h("h2", {}, fresh ? "Nəzəri tur bitdi" + (L.timeUp ? " — vaxt bitdi" : "") : "Dəst " + L.dest + " · " + dmy(L.at)),
      h("p", {}, "Dəst " + L.dest + " · sərf olunan vaxt " + fmt(L.sec * 1000) + "."),
      h("p", {}, "Həllinin bütün səhifələrini aydın şəkil çək və buraya əlavə et — sıra ilə, hər səhifə ayrıca. Şəkillər Skilly-də saxlanır, həll bal meyarları ilə yoxlanılacaq."),
      L.ref ? photoBox(L.ref) : h("p", { class: "rz-stat" }, "Bu cəhd şəkil yükləmə əlavə olunmazdan əvvəl olub."),
      h("div", { class: "rz-nav" }, h("button", { type: "button", class: "btn ghost", on: { click: () => { delete st.last; save(); drawHome(); } } }, "Simulyasiya səhifəsinə qayıt"))));
  }

  // ---- experiment practice (no clock: the duration of the real round is not published)
  function drawExp(e) {
    const sent = (st.eksp || {})[e.id], ref = "rfo-eksp-" + e.id;
    const send = h("button", { type: "button", class: "btn", disabled: "", on: { click: () => {
      const at = Date.now(); st.eksp = { ...(st.eksp || {}), [e.id]: at }; save();
      if (window.Skilly) Skilly.netice({ id: "rfo-final-eksp@" + at, ders: "RFO fizika — evdə eksperiment " + e.id + ": " + e.ad, fenn: "fizika", max: CFG.eksperimentBal, qeyd: "göndərildi; şəkillər Skilly-də (" + ref + "); yoxlama bal meyarları ilə", sekil: ref });
      drawExp(e); } } }, sent ? "Yenidən yoxlamaya göndər" : "Yoxlamaya göndər");
    root.replaceChildren(h("div", { class: "oy-intro rz-expv" },
      h("button", { type: "button", class: "btn ghost", on: { click: drawHome } }, "← Geri"),
      h("h2", {}, e.id + ". " + e.ad),
      h("p", {}, h("b", {}, "Avadanlıq: "), e.avadanliq + "."),
      h("ol", { class: "rz-parts" }, ...e.addimlar.map(a => h("li", {}, a))),
      h("p", {}, h("b", {}, "Cədvəl"), " (kağıza köçür və ya bu səhifəni çap et):"),
      h("div", { class: "tbl" }, h("table", {}, h("thead", {}, h("tr", {}, ...e.sutunlar.map(c => h("th", {}, c)))),
        h("tbody", {}, ...Array.from({ length: e.setir }, (_, i) => h("tr", {}, ...e.sutunlar.map((c, k) => h("td", {}, k ? "" : String(i + 1)))))))),
      h("p", {}, h("b", {}, "Bal (" + CFG.eksperimentBal + "):")),
      h("ul", { class: "rz-parts" }, ...CFG.eksperimentMeyar.map(([t, b]) => h("li", {}, t + " — " + b + " bal"))),
      h("p", {}, "Bitirəndə cədvəlin, qrafikin və nəticənin şəklini buraya əlavə et, sonra “Yoxlamaya göndər” bas." + (sent ? " (Son dəfə " + dmy(sent) + " göndərmisən.)" : "")),
      photoBox(ref, n => { if (n) send.removeAttribute("disabled"); else send.setAttribute("disabled", ""); }),
      h("div", { class: "rz-nav" }, send)));
    root.scrollIntoView({ block: "start" });
  }

  async function init() {
    try {
      const [cfg, m] = await Promise.all(["../data/rfo-final.json", "../data/movzular.json"].map(p => fetch(p, { cache: "no-cache" }).then(r => { if (!r.ok) throw new Error(p); return r.json(); })));
      CFG = cfg;
      const byLink = {}; for (const k in m) m[k].forEach(t => { if (t.ders) byLink[t.ders] = t; });
      const bag = get("skilly-bag", []);
      TOPICS = CFG.movzular.map(x => { const link = "dersler/" + x.slug + ".html", t = byLink[link] || {}; return { ...x, ad: t.ad || x.qisa, closed: t.status === "bag" || bag.includes(link) }; });
    } catch (e) { root.replaceChildren(h("p", { class: "oy-err" }, "Məlumat yüklənmədi. Səhifəni yenilə.")); return; }
    st = get(KEY, {});
    drawChips();
    if (st.run) return run();          // a round in progress resumes (the clock kept running)
    if (st.last) return drawSent(st.last); // finished: add the photos first
    TOPICS.every(t => t.closed) ? drawHome() : drawGate();
  }
  init();
})();
