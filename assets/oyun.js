// Mastery game ("Oyun") and final test ("Sınaq") for a lesson page.
// A topic file defines levels; each level has a generator that returns a fresh problem with random numbers.
// Rules: a level is mastered after STREAK correct answers in a row (a mistake resets it); levels open one by
// one; the boss round asks one problem per level and needs all correct — a mistake sends the player back to
// that level; the final test opens only after the boss. Progress lives in localStorage; results go to Sheets.
(function () {
  const STREAK = 5, WAIT_MS = 2500;
  const h = (tag, attrs, ...kids) => {
    const e = document.createElement(tag);
    for (const k in attrs || {}) { if (k === "on") for (const ev in attrs.on) e.addEventListener(ev, attrs.on[ev]); else if (attrs[k] != null) e.setAttribute(k, attrs[k]); }
    kids.flat().forEach(k => k != null && e.append(k));
    return e;
  };
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };

  // Answers: integers, decimals (comma or dot), fractions 3/5, roots 5√3, √3/2, −√2/2.
  function parse(raw) {
    let s = String(raw).trim().replace(/[−–—]/g, "-").replace(/,/g, ".").replace(/\s+/g, "").replace(/°$/, "");
    if (!s) return NaN;
    s = s.replace(/sqrt/gi, "√").replace(/(\d*\.?\d*)√\(?(\d+(?:\.\d+)?)\)?/g, (m, k, n) => "(" + (k || "1") + "*Math.sqrt(" + n + "))");
    if (!/^[-+*/().\d]*(?:Math\.sqrt\(\d+(?:\.\d+)?\)[-+*/().\d]*)*$/.test(s)) return NaN;
    try { const v = Function('"use strict";return (' + s + ")")(); return typeof v === "number" && isFinite(v) ? v : NaN; } catch (e) { return NaN; }
  }
  const close = (x, v, tol) => Math.abs(x - v) <= (tol ?? Math.max(0.005, Math.abs(v) * 0.005));

  function mount(cfg) {
    const KEY = "oyun:" + cfg.key;
    const st = get(KEY, { lv: {}, boss: { passed: false, tries: 0 }, test: null, log: [] });
    cfg.levels.forEach(l => { st.lv[l.id] = st.lv[l.id] || { streak: 0, done: false, tries: 0, wrong: 0 }; });
    const save = () => put(KEY, st);
    const isOpen = i => i === 0 || st.lv[cfg.levels[i - 1].id].done;
    const allDone = () => cfg.levels.every(l => st.lv[l.id].done);

    const root = cfg.oyunEl, testRoot = cfg.testEl;
    const map = h("div", { class: "oy-map" }), stage = h("div", { class: "oy-stage" });
    root.replaceChildren(
      h("div", { class: "oy-intro" }, h("h2", {}, "Oyun: mövzunu mənimsə"),
        h("p", {}, "Hər səviyyədə suallar təsadüfi ədədlərlə yaranır. Ardıcıl " + STREAK + " düz cavab — səviyyə bağlanır; bir səhv sayğacı sıfırlayır. Hamısı bağlananda Boss raundu açılır: hər səviyyədən bir sual, hamısı düz olmalıdır. Boss-dan sonra Sınaq açılır."),
        h("p", { class: "oy-fmt" }, cfg.format || "")),
      map, stage);

    function drawMap(active) {
      map.replaceChildren(...cfg.levels.map((l, i) => {
        const s = st.lv[l.id], open = isOpen(i);
        const dots = h("span", { class: "oy-dots" }, ...Array.from({ length: STREAK }, (_, j) => h("i", { class: j < (s.done ? STREAK : s.streak) ? "on" : "" })));
        return h("button", { type: "button", class: "oy-lv" + (s.done ? " done" : "") + (!open ? " locked" : "") + (active === l.id ? " active" : ""), ...(open ? {} : { "aria-disabled": "true" }),
          on: { click: () => open ? play(l.id) : null } },
          h("span", { class: "oy-no" }, s.done ? "✓" : open ? String(i + 1) : "🔒"), h("span", { class: "oy-name" }, l.ad), dots);
      }), h("button", { type: "button", class: "oy-lv boss" + (st.boss.passed ? " done" : "") + (!allDone() ? " locked" : "") + (active === "boss" ? " active" : ""),
        on: { click: () => allDone() ? boss() : null } },
        h("span", { class: "oy-no" }, st.boss.passed ? "✓" : allDone() ? "★" : "🔒"), h("span", { class: "oy-name" }, "Boss raundu"),
        h("span", { class: "oy-sub" }, st.boss.passed ? "keçildi" : cfg.levels.length + " sual, hamısı düz")));
      cfg.onState && cfg.onState(st);
    }

    // one problem on screen; resolves with true/false after the player answers (and, if wrong, has seen the solution)
    function ask(q, box, opts = {}) {
      return new Promise(resolve => {
        const err = h("div", { class: "oy-err", "aria-live": "polite" }), fb = h("div", { class: "oy-fb", "aria-live": "polite" });
        let input, getVal;
        if (q.choices) {
          let pick = -1;
          input = h("div", { class: "oy-choices", role: "radiogroup" }, ...q.choices.map((c, i) => h("button", { type: "button", role: "radio", "aria-checked": "false",
            on: { click: e => { pick = i; input.querySelectorAll("button").forEach(b => b.setAttribute("aria-checked", String(b === e.currentTarget))); err.textContent = ""; } } }, c)));
          getVal = () => pick;
        } else {
          input = h("input", { class: "oy-in", type: "text", inputmode: "text", autocomplete: "off", "aria-label": "Cavab", placeholder: q.placeholder || "cavab" });
          input.addEventListener("input", () => { err.textContent = ""; });
          input.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
          getVal = () => input.value;
        }
        const btn = h("button", { type: "button", class: "btn", on: { click: () => check() } }, "Yoxla");
        const row = h("div", { class: "oy-row" }, input, q.unit ? h("span", { class: "oy-unit" }, q.unit) : null, btn);
        box.replaceChildren(h("div", { class: "oy-q" }, opts.label ? h("div", { class: "oy-label" }, opts.label) : null,
          h("div", { class: "oy-text" }, q.text), q.svg || null, row, err, fb));
        if (!q.choices) input.focus({ preventScroll: true });
        function check() {
          const v = getVal();
          let ok;
          if (q.choices) { if (v < 0) { err.textContent = "Əvvəl birini seç."; return; } ok = v === q.correct; }
          else {
            const x = parse(v);
            if (!String(v).trim()) { err.textContent = "Əvvəl cavabı yaz."; return; }
            if (isNaN(x)) { err.textContent = "Cavabı ədəd kimi yaz: 12, 0.5, 3/5, 5√3, √3/2."; return; }
            ok = close(x, q.answer, q.tol);
          }
          btn.disabled = true; if (input.disabled !== undefined) input.disabled = true; input.querySelectorAll && input.querySelectorAll("button").forEach(b => b.disabled = true);
          if (ok) { fb.className = "oy-fb ok"; fb.textContent = "Düz ✓"; setTimeout(() => resolve(true), 600); return; }
          // wrong: show the worked solution; the next problem comes only after a short pause
          const next = h("button", { type: "button", class: "btn", disabled: "" }, "Növbəti sual");
          fb.className = "oy-fb no";
          fb.replaceChildren(h("b", {}, "Səhv. Düz cavab: " + q.show), h("p", {}, q.solution), next);
          setTimeout(() => { next.removeAttribute("disabled"); next.focus({ preventScroll: true }); }, WAIT_MS);
          next.addEventListener("click", () => resolve(false));
        }
      });
    }

    async function play(id) {
      const lv = cfg.levels.find(l => l.id === id), s = st.lv[id];
      drawMap(id);
      const head = h("div", { class: "oy-head" }, h("b", {}, lv.ad), h("span", {}, lv.izah || ""));
      const box = h("div");
      stage.replaceChildren(head, box);
      stage.scrollIntoView({ block: "nearest", behavior: "smooth" });
      while (!s.done) {
        const ok = await ask(lv.gen(), box, { label: "Ardıcıl düz: " + s.streak + " / " + STREAK });
        s.tries++; if (ok) s.streak++; else { s.streak = 0; s.wrong++; }
        if (s.streak >= STREAK) s.done = true;
        save(); drawMap(id);
      }
      const nextIdx = cfg.levels.findIndex(l => l.id === id) + 1;
      stage.replaceChildren(h("div", { class: "oy-done" }, h("b", {}, "Səviyyə bağlandı ✓"),
        nextIdx < cfg.levels.length ? h("button", { type: "button", class: "btn", on: { click: () => play(cfg.levels[nextIdx].id) } }, "Növbəti səviyyə →")
          : h("button", { type: "button", class: "btn", on: { click: boss } }, "Boss raunduna keç →")));
    }

    async function boss() {
      drawMap("boss");
      st.boss.tries++; save();
      const box = h("div");
      stage.replaceChildren(h("div", { class: "oy-head" }, h("b", {}, "Boss raundu"), h("span", {}, "Hər səviyyədən bir sual. İpucu yoxdur. Bir səhv — həmin səviyyəyə qayıdırsan.")), box);
      for (let i = 0; i < cfg.levels.length; i++) {
        const lv = cfg.levels[i];
        const ok = await ask(lv.gen(), box, { label: "Boss · " + (i + 1) + " / " + cfg.levels.length + " · " + lv.ad });
        if (!ok) {
          Object.assign(st.lv[lv.id], { streak: 0, done: false }); save(); drawMap();
          stage.replaceChildren(h("div", { class: "oy-done no" }, h("b", {}, "Boss keçilmədi."), h("p", {}, "“" + lv.ad + "” səviyyəsini yenidən bağla, sonra Boss yenidən başlayacaq."),
            h("button", { type: "button", class: "btn", on: { click: () => play(lv.id) } }, "Səviyyəyə qayıt →")));
          return;
        }
      }
      st.boss.passed = true; save(); drawMap();
      report("oyun", { bal: cfg.levels.length, max: cfg.levels.length, qeyd: cfg.levels.map((l, i) => (i + 1) + ":" + st.lv[l.id].tries + "/" + st.lv[l.id].wrong).join(" ") + " (cəhd/səhv), boss cəhdi " + st.boss.tries });
      stage.replaceChildren(h("div", { class: "oy-done" }, h("b", {}, "Boss keçildi ★ Mövzu mənimsənildi."), h("p", {}, "Sınaq açıldı."),
        h("button", { type: "button", class: "btn", on: { click: () => cfg.goTest && cfg.goTest() } }, "Sınağa keç →")));
    }

    // ---- final test: no feedback until the end; pass mark cfg.test.pass of cfg.test.n
    function drawTest() {
      if (!testRoot) return;
      if (!st.boss.passed) {
        testRoot.replaceChildren(h("div", { class: "oy-locked" }, h("b", {}, "🔒 Sınaq bağlıdır"), h("p", {}, "Əvvəl Oyunu bitir: bütün səviyyələr və Boss raundu."),
          h("button", { type: "button", class: "btn", on: { click: () => cfg.goGame && cfg.goGame() } }, "Oyuna keç →")));
        return;
      }
      const last = st.test;
      testRoot.replaceChildren(h("div", { class: "oy-intro" }, h("h2", {}, "Yekun sınaq"),
        h("p", {}, cfg.test.n + " sual, ədədlər təsadüfidir. Cavablar sonda yoxlanır. Keçid: " + cfg.test.pass + " / " + cfg.test.n + ". Kağız və qələm yanında olsun."),
        last ? h("p", { class: "oy-fmt" }, "Son cəhd: " + last.bal + " / " + cfg.test.n + (last.bal >= cfg.test.pass ? " — keçib ✓" : " — keçməyib")) : null,
        h("button", { type: "button", class: "btn", on: { click: runTest } }, last ? "Yenidən başla" : "Sınağa başla")));
    }
    async function runTest() {
      const qs = cfg.test.from.map(id => ({ id, q: cfg.levels.find(l => l.id === id).gen() }));
      const answers = [];
      const box = h("div");
      testRoot.replaceChildren(box);
      for (let i = 0; i < qs.length; i++) {
        const q = qs[i].q, val = await collect(q, box, "Sınaq · " + (i + 1) + " / " + qs.length, i + 1 === qs.length);
        const ok = q.choices ? val === q.correct : close(parse(val), q.answer, q.tol);
        answers.push({ id: qs[i].id, q, val, ok });
      }
      const bal = answers.filter(a => a.ok).length, passed = bal >= cfg.test.pass;
      st.test = { bal, at: Date.now(), passed };
      // wrong answers: back to that level (re-master it) and into the error journal
      answers.forEach((a, i) => { if (a.ok) return;
        Object.assign(st.lv[a.id], { streak: 0, done: false });
        if (window.Skilly) Skilly.sehv({ id: cfg.key + "-test@" + st.test.at + "#" + (i + 1), fenn: cfg.fenn, movzu: cfg.title, menbe: cfg.title + " — yekun sınaq",
          sual: typeof a.q.text === "string" ? a.q.text : a.q.text.textContent, cavab: a.q.choices ? (a.q.choices[a.val] || "") : String(a.val || ""), duz: a.q.show, link: cfg.link });
      });
      if (!passed) st.boss.passed = false;
      save(); drawMap();
      report("test", { bal, max: cfg.test.n, qeyd: passed ? "keçdi" : "keçmədi; səhv səviyyələr: " + answers.filter(a => !a.ok).map(a => a.id).join(", ") });
      if (passed && cfg.onPass) cfg.onPass();
      testRoot.replaceChildren(h("div", { class: "oy-done" + (passed ? "" : " no") }, h("b", {}, "Nəticə: " + bal + " / " + cfg.test.n + (passed ? " — mövzu bağlandı ✓" : " — keçmədi")),
        h("ol", { class: "oy-review" }, ...answers.map(a => h("li", { class: a.ok ? "ok" : "no" }, (a.ok ? "✓ " : "✗ ") + (typeof a.q.text === "string" ? a.q.text : a.q.text.textContent) + (a.ok ? "" : " — düz: " + a.q.show)))),
        passed ? h("p", {}, "Bir həftə sonra 3 suallıq yaddaş yoxlaması gələcək.") : h("p", {}, "Səhv olan səviyyələr yenidən açıldı. Onları və Boss-u keç, sonra Sınaq yenidən açılacaq."),
        passed ? null : h("button", { type: "button", class: "btn", on: { click: () => cfg.goGame && cfg.goGame() } }, "Oyuna qayıt →")));
    }

    // test question: takes an answer without saying whether it is right
    function collect(q, box, label, isLast) {
      return new Promise(resolve => {
        const err = h("div", { class: "oy-err", "aria-live": "polite" });
        let input, getVal, pick = -1;
        if (q.choices) {
          input = h("div", { class: "oy-choices", role: "radiogroup" }, ...q.choices.map((c, i) => h("button", { type: "button", role: "radio", "aria-checked": "false",
            on: { click: e => { pick = i; input.querySelectorAll("button").forEach(b => b.setAttribute("aria-checked", String(b === e.currentTarget))); err.textContent = ""; } } }, c)));
          getVal = () => pick;
        } else {
          input = h("input", { class: "oy-in", type: "text", autocomplete: "off", "aria-label": "Cavab", placeholder: q.placeholder || "cavab" });
          input.addEventListener("input", () => { err.textContent = ""; });
          input.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
          getVal = () => input.value;
        }
        const btn = h("button", { type: "button", class: "btn", on: { click: () => go() } }, isLast ? "Bitir" : "Növbəti →");
        box.replaceChildren(h("div", { class: "oy-q" }, h("div", { class: "oy-label" }, label), h("div", { class: "oy-text" }, q.text), q.svg || null,
          h("div", { class: "oy-row" }, input, q.unit ? h("span", { class: "oy-unit" }, q.unit) : null, btn), err));
        if (!q.choices) input.focus({ preventScroll: true });
        function go() {
          const v = getVal();
          if (q.choices ? v < 0 : !String(v).trim()) { err.textContent = q.choices ? "Əvvəl birini seç." : "Əvvəl cavabı yaz."; return; }
          if (!q.choices && isNaN(parse(v))) { err.textContent = "Cavabı ədəd kimi yaz: 12, 0.5, 3/5, 5√3, √3/2."; return; }
          resolve(v);
        }
      });
    }

    function report(kind, r) {
      if (!window.Skilly) return;
      Skilly.netice({ id: cfg.key + "-" + kind + "@" + Date.now(), ders: cfg.title + (kind === "test" ? " — yekun sınaq" : " — oyun (mənimsəmə)"), fenn: cfg.fenn, ...r });
    }

    drawMap(); drawTest();
    cfg.refreshTest = drawTest;
    return { state: st, drawTest };
  }

  window.Oyun = { mount, parse, h };
})();
