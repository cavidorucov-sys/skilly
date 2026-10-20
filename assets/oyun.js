// Mastery game ("Oyun") and final test ("Sınaq") for a lesson page.
// A topic file defines levels; each level has a generator that returns a fresh problem with random numbers.
// Rules: a level is mastered after STREAK correct answers in a row (a mistake resets it); levels open one by
// one; the boss round asks one problem per level and needs all correct — a mistake sends the player back to
// that level; the final test opens only after the boss. Progress lives in localStorage and is mirrored to the cloud.
(function () {
  const STREAK = 5, WAIT_MS = 2500;
  const h = (tag, attrs, ...kids) => {
    const e = document.createElement(tag);
    for (const k in attrs || {}) { if (k === "on") for (const ev in attrs.on) e.addEventListener(ev, attrs.on[ev]); else if (attrs[k] != null) e.setAttribute(k, attrs[k]); }
    kids.flat().forEach(k => k != null && e.append(k));
    return e;
  };
  const get = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } };
  const put = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} if (window.Skilly && Skilly.hal) Skilly.hal(k); };

  // Answers: integers, decimals (comma or dot), fractions 3/5, roots 5√3, √3/2, −√2/2.
  function parse(raw) {
    let s = String(raw).trim().replace(/[−–—]/g, "-").replace(/,/g, ".").replace(/\s+/g, "").replace(/°$/, "");
    if (!s) return NaN;
    s = s.replace(/sqrt/gi, "√").replace(/(\d*\.?\d*)√\(?(\d+(?:\.\d+)?)\)?/g, (m, k, n) => "(" + (k || "1") + "*Math.sqrt(" + n + "))");
    if (!/^[-+*/().\d]*(?:Math\.sqrt\(\d+(?:\.\d+)?\)[-+*/().\d]*)*$/.test(s)) return NaN;
    try { const v = Function('"use strict";return (' + s + ")")(); return typeof v === "number" && isFinite(v) ? v : NaN; } catch (e) { return NaN; }
  }
  const newSeed = () => (Math.random() * 4294967296) >>> 0;
  function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function genS(level, seed) { const keep = Math.random; Math.random = rng(seed); try { return level.gen(); } finally { Math.random = keep; } }
  // The answer must be written as a finished number, not as an expression for the browser to compute:
  // up to two terms, each a number, a fraction, or k√n (optionally /m), e.g. 12 · −0,5 · 3/5 · 5√3 · √3/2 · √23 − 4.
  const TERM = /^(?:\d+(?:[.,]\d+)?(?:\/\d+)?|\d*√\d+(?:[.,]\d+)?(?:\/\d+)?)$/;
  function okForm(raw) {
    const t = String(raw).replace(/\s+/g, "").replace(/sqrt/gi, "√").replace(/[−–]/g, "-").replace(/°$/, "").replace(/^[-+]/, "");
    const parts = t.split(/(?<=.)[-+]/);
    if (parts.length > 2 || !parts.every(x => TERM.test(x))) return false;
    // two terms only when a root is involved (√23 − 4, 2√3 + 1); "7/9+1/4" must be computed, not typed
    return parts.length === 1 || parts.some(x => x.includes("√"));
  }
  // exact answers (shown as a fraction or a root) need the exact value; rounded decimals are not accepted
  const tolOf = q => q.tol ?? (/[\/√]/.test(String(q.show)) ? 1e-6 : undefined);
  const close = (x, v, tol) => Math.abs(x - v) <= (tol ?? Math.max(0.005, Math.abs(v) * 0.005));

  // small on-screen keys for √, / and − (hard to type on a phone keyboard)
  function keys(input) {
    return h("div", { class: "oy-keys" }, ...["√", "/", "−"].map(k => h("button", { type: "button", class: "oy-key", "aria-label": "Daxil et: " + k,
      on: { click: () => { const a = input.selectionStart ?? input.value.length, b = input.selectionEnd ?? a; input.value = input.value.slice(0, a) + k + input.value.slice(b); input.focus(); input.setSelectionRange(a + 1, a + 1); input.dispatchEvent(new Event("input")); } } }, k)));
  }
  function mount(cfg) {
    const KEY = "oyun:" + cfg.key;
    const st = get(KEY, { lv: {}, boss: { passed: false, tries: 0 }, test: null, log: [] });
    cfg.levels.forEach(l => { st.lv[l.id] = st.lv[l.id] || { streak: 0, done: false, tries: 0, wrong: 0 }; });
    const save = () => put(KEY, st);
    let RUN = 0, current = null; // only the newest play/boss loop may continue
    const L = id => cfg.levels.find(l => l.id === id);
    const isOpen = i => i === 0 || st.lv[cfg.levels[i - 1].id].done;
    const allDone = () => cfg.levels.every(l => st.lv[l.id].done);

    const root = cfg.oyunEl, testRoot = cfg.testEl;
    const map = h("div", { class: "oy-map" }), stage = h("div", { class: "oy-stage" });
    root.replaceChildren(
      h("div", { class: "oy-intro" }, h("h2", {}, "Oyun: mövzunu mənimsə"),
        h("p", {}, "Hər səviyyədə " + STREAK + " sual, ədədlər təsadüfidir. Hər sual düz cavablanmalıdır: səhv olsa, sual dəyişmir — düzünü tapana qədər yenidən yoxla. Sayğac sıfırlanmır. Səviyyələr bitəndə Boss raundu açılır (hər səviyyədən bir sual), Boss-dan sonra Sınaq."),
        h("p", { class: "oy-fmt" }, cfg.format || "")),
      map, stage);

    function drawMap(active) {
      map.replaceChildren(...cfg.levels.map((l, i) => {
        const s = st.lv[l.id], open = s.done || isOpen(i); // a mastered level stays open even when an earlier one was reopened
        const dots = h("span", { class: "oy-dots" }, ...Array.from({ length: STREAK }, (_, j) => h("i", { class: j < (s.done ? STREAK : s.streak) ? "on" : "" })));
        return h("button", { type: "button", class: "oy-lv" + (s.done ? " done" : "") + (!open ? " locked" : "") + (active === l.id ? " active" : ""), ...(open ? {} : { "aria-disabled": "true" }),
          on: { click: () => open ? play(l.id) : null } },
          h("span", { class: "oy-no" }, s.done ? "✓" : open ? String(i + 1) : "🔒"), h("span", { class: "oy-name" }, l.ad), dots);
      }), h("button", { type: "button", class: "oy-lv boss" + (st.boss.passed ? " done" : "") + (!allDone() && !st.boss.passed ? " locked" : "") + (active === "boss" ? " active" : ""),
        on: { click: () => allDone() ? boss() : null } },
        h("span", { class: "oy-no" }, st.boss.passed ? "✓" : allDone() ? "★" : "🔒"), h("span", { class: "oy-name" }, "Boss raundu"),
        h("span", { class: "oy-sub" }, st.boss.passed ? "keçildi" : cfg.levels.length + " sual, hamısı düz")));
      cfg.onState && cfg.onState(st);
    }

    // one problem on screen; a wrong answer keeps the same problem until it is answered right (rule of 20 Oct 2026).
    // Resolves with { wrong: wrong attempts, first: the first wrong answer }. After HINT_AT wrong attempts the worked
    // solution can be opened, but the answer still has to be typed.
    const HINT_AT = 3;
    function ask(q, box, opts = {}) {
      return new Promise(resolve => {
        const err = h("div", { class: "oy-err", "aria-live": "polite" }), fb = h("div", { class: "oy-fb", "aria-live": "polite" });
        let input, getVal, wrong = 0, first;
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
        const row = h("div", { class: "oy-row" }, input, q.unit ? h("span", { class: "oy-unit" }, q.unit) : null, q.choices ? null : keys(input), btn);
        box.replaceChildren(h("div", { class: "oy-q" }, opts.label ? h("div", { class: "oy-label" }, opts.label) : null,
          h("div", { class: "oy-text" }, q.text), q.svg || null, row, err, fb));
        if (!q.choices) input.focus({ preventScroll: true });
        function check() {
          if (btn.disabled) return;
          const v = getVal();
          let ok;
          if (q.choices) { if (v < 0) { err.textContent = "Əvvəl birini seç."; return; } ok = v === q.correct; }
          else {
            const x = parse(v);
            if (!String(v).trim()) { err.textContent = "Əvvəl cavabı yaz."; return; }
            if (isNaN(x) || !okForm(v)) { err.textContent = "Cavabı hazır ədəd kimi yaz: 12, 0.5, 3/5, 5√3, √3/2 (ifadə yox)."; return; }
            ok = close(x, q.answer, tolOf(q));
          }
          if (ok) {
            btn.disabled = true; if (input.disabled !== undefined) input.disabled = true; input.querySelectorAll && input.querySelectorAll("button").forEach(b => b.disabled = true);
            fb.className = "oy-fb ok"; fb.textContent = "Düz ✓"; setTimeout(() => resolve({ wrong, first }), 600); return;
          }
          // wrong: the same problem stays; the answer is not shown
          wrong++; if (first === undefined) first = v;
          fb.className = "oy-fb no";
          const kids = [h("b", {}, "Səhv. Sual qalır — yenidən yoxla." + (wrong > 1 ? " (" + wrong + "-ci səhv)" : ""))];
          if (wrong >= HINT_AT && q.solution) {
            const sol = h("p", { hidden: "" }, q.solution);
            kids.push(h("button", { type: "button", class: "btn ghost", on: { click: e => { sol.hidden = false; e.currentTarget.remove(); } } }, "İzaha bax"), sol);
          }
          fb.replaceChildren(...kids);
          if (!q.choices) { input.select(); input.focus({ preventScroll: true }); }
        }
      });
    }
    const valText = (q, v) => v == null ? "(vaxt bitdi, cavab yoxdur)" : q.choices ? (q.choices[v] || "") : String(v);

    async function play(id) {
      if (current === id) return;
      const my = ++RUN; current = id;
      const lv = L(id), s = st.lv[id];
      drawMap(id);
      const head = h("div", { class: "oy-head" }, h("b", {}, lv.ad), h("span", {}, lv.izah || ""));
      const box = h("div");
      stage.replaceChildren(head, box);
      stage.scrollIntoView({ block: "nearest", behavior: "smooth" });
      while (!s.done) {
        if (!s.seed) { s.seed = newSeed(); save(); }
        const r = await ask(genS(lv, s.seed), box, { label: "Düz cavab: " + s.streak + " / " + STREAK });
        if (my !== RUN) return;
        delete s.seed; s.tries++; s.wrong += r.wrong; s.streak++;
        if (s.streak >= STREAK) s.done = true;
        save(); drawMap(id);
      }
      current = null; settle();
      const nextIdx = cfg.levels.findIndex(l => l.id === id) + 1;
      stage.replaceChildren(h("div", { class: "oy-done" }, h("b", {}, "Səviyyə bağlandı ✓"),
        nextIdx < cfg.levels.length ? h("button", { type: "button", class: "btn", on: { click: () => play(cfg.levels[nextIdx].id) } }, "Növbəti səviyyə →")
          : h("button", { type: "button", class: "btn", on: { click: boss } }, "Boss raunduna keç →")));
    }

    async function boss() {
      if (current === "boss") return;
      const my = ++RUN; current = "boss";
      drawMap("boss");
      if (!st.boss.run) { st.boss.run = { seeds: cfg.levels.map(newSeed), i: 0 }; st.boss.tries++; save(); }
      const run = st.boss.run;
      const box = h("div");
      stage.replaceChildren(h("div", { class: "oy-head" }, h("b", {}, "Boss raundu"), h("span", {}, "Hər səviyyədən bir sual, ipucu yoxdur. Səhv olsa, sual qalır — düzünü tapana qədər.")), box);
      for (let i = run.i; i < cfg.levels.length; i++) {
        const lv = cfg.levels[i];
        const r = await ask(genS(lv, run.seeds[i]), box, { label: "Boss · " + (i + 1) + " / " + cfg.levels.length + " · " + lv.ad });
        if (my !== RUN) return;
        run.wrong = (run.wrong || 0) + r.wrong; run.i = i + 1; save();
      }
      const bossWrong = run.wrong || 0;
      current = null; delete st.boss.run;
      st.boss.passed = true; save(); drawMap();
      report("oyun", { bal: cfg.levels.length, max: cfg.levels.length, qeyd: cfg.levels.map((l, i) => (i + 1) + ":" + st.lv[l.id].tries + "/" + st.lv[l.id].wrong).join(" ") + " (sual/səhv cəhd), boss səhv cəhdi " + bossWrong });
      stage.replaceChildren(h("div", { class: "oy-done" }, h("b", {}, "Boss keçildi ★ Mövzu mənimsənildi."), h("p", {}, "Sınaq açıldı."),
        h("button", { type: "button", class: "btn", on: { click: () => cfg.goTest && cfg.goTest() } }, "Sınağa keç →")));
    }

    // ---- final test: every problem must end right (a wrong answer keeps it); the topic closes when all are done
    function drawTest() {
      if (!testRoot) return;
      // the test needs the whole game: every level mastered and the Boss passed
      const openLv = cfg.levels.filter(l => !st.lv[l.id].done);
      if (!st.boss.passed || openLv.length) {
        testRoot.replaceChildren(h("div", { class: "oy-locked" }, h("b", {}, "🔒 Sınaq bağlıdır"),
          h("p", {}, st.boss.passed ? "Əvvəl açıq səviyyəni bitir: " + openLv.map(l => l.ad).join(", ") + "." : "Əvvəl Oyunu bitir: bütün səviyyələr və Boss raundu."),
          h("button", { type: "button", class: "btn", on: { click: () => { cfg.goGame && cfg.goGame(); if (st.boss.passed && openLv.length) play(openLv[0].id); } } }, "Oyuna keç →")));
        return;
      }
      const fix = pendingFix();
      if (fix.length) {
        testRoot.replaceChildren(h("div", { class: "oy-intro" }, h("h2", {}, "Sınaq: səhvi düzəlt"),
          h("p", {}, "Sınaqda " + fix.length + " sual səhv qalıb. İndi Sınaq yalnız " + (fix.length === 1 ? "o sualdır" : "o suallardır") + ": düz həll edəndə mövzu bağlanır. Səhv olsa, sual qalır."),
          h("button", { type: "button", class: "btn", on: { click: runFix } }, "Başla")));
        return;
      }
      const last = st.test;
      const due = window.Skilly ? Skilly.dueReviews(cfg.key) : [];
      if (due.length && last && last.passed) {
        const r = due[0];
        testRoot.replaceChildren(h("div", { class: "oy-intro" }, h("h2", {}, "Yaddaş yoxlaması"),
          h("p", {}, r.n + " sual. İlk cəhddə hamısı düz olmalıdır" + (r.n > 3 ? " (ən çox 1 səhv)" : "") + "; səhv olan sual qalır, düzünü tapana qədər. Çox səhv olarsa, həmin səviyyələr yenidən açılır və mövzu təkrar “İşlənir” olur."),
          h("button", { type: "button", class: "btn", on: { click: () => runReview(r) } }, "Başla")));
        return;
      }
      testRoot.replaceChildren(h("div", { class: "oy-intro" }, h("h2", {}, "Yekun sınaq"),
        h("p", {}, cfg.test.n + " sual, ədədlər təsadüfidir. Hər sual düz cavablanmalıdır: səhv olsa, sual qalır — düzünü tapana qədər. Hamısı düz olanda mövzu bağlanır. Kağız və qələm yanında olsun."),
        last ? h("p", { class: "oy-fmt" }, last.passed ? "Bitib ✓ — ilk cəhddə düz: " + last.bal + " / " + cfg.test.n : "Son cəhd: " + last.bal + " / " + cfg.test.n) : null,
        h("button", { type: "button", class: "btn", on: { click: runTest } }, last ? "Yenidən başla" : "Sınağa başla")));
    }
    async function runTest() {
      if (!st.testRun || !st.testRun.res) { st.testRun = { seeds: cfg.test.from.map(newSeed), res: [] }; save(); }
      const run = st.testRun, qs = cfg.test.from.map((id, i) => ({ id, q: genS(L(id), run.seeds[i]) }));
      const box = h("div");
      testRoot.replaceChildren(box);
      for (let i = run.res.length; i < qs.length; i++) {
        run.res.push(await ask(qs[i].q, box, { label: "Sınaq · " + (i + 1) + " / " + qs.length })); save();
      }
      const res = run.res;
      delete st.testRun;
      // every problem ended right, so the topic closes; "bal" = right at the first attempt (for the record)
      const bal = res.filter(r => !r.wrong).length;
      st.test = { bal, at: Date.now(), passed: true, v: 2 };
      res.forEach((r, i) => { if (r.wrong) logWrong("yekun sınaq", "test@" + st.test.at + "#" + (i + 1), qs[i].q, r.first); });
      save(); drawMap();
      const missed = qs.filter((x, i) => res[i].wrong).map(x => x.id);
      report("test", { bal, max: cfg.test.n, qeyd: "keçdi; ilk cəhddə " + bal + "/" + cfg.test.n + (missed.length ? "; səhv cəhd: " + missed.join(", ") : "") });
      if (cfg.onPass) cfg.onPass();
      if (window.Skilly) Skilly.planReview(cfg.key, cfg.link, cfg.title);
      testRoot.replaceChildren(h("div", { class: "oy-done" }, h("b", {}, "Sınaq bitdi — mövzu bağlandı ✓"),
        h("p", {}, "İlk cəhddə düz: " + bal + " / " + cfg.test.n + "."),
        h("ol", { class: "oy-review" }, ...qs.map((x, i) => h("li", { class: res[i].wrong ? "no" : "ok" }, (res[i].wrong ? "↻ " : "✓ ") + (typeof x.q.text === "string" ? x.q.text : x.q.text.textContent) + (res[i].wrong ? " — " + res[i].wrong + " səhv cəhddən sonra düz" : "")))),
        h("p", {}, "Bir həftə sonra 3 suallıq yaddaş yoxlaması gələcək.")));
    }

    // spaced review: n random levels, same rules as the test, stricter pass mark
    async function runReview(r) {
      if (!st.reviewRun || st.reviewRun.id !== r.id) {
        const ids = cfg.levels.filter(l => !l.noReview).map(l => l.id).sort(() => Math.random() - .5).slice(0, r.n);
        while (ids.length < r.n) ids.push(cfg.levels[Math.floor(Math.random() * cfg.levels.length)].id);
        st.reviewRun = { id: r.id, ids, seeds: ids.map(newSeed), res: [] }; save();
      }
      if (!st.reviewRun.res) { st.reviewRun.res = []; delete st.reviewRun.vals; }
      const run = st.reviewRun, ids = run.ids;
      const box = h("div"); testRoot.replaceChildren(box);
      for (let i = run.res.length; i < ids.length; i++) {
        run.res.push(await ask(genS(L(ids[i]), run.seeds[i]), box, { label: "Yaddaş yoxlaması · " + (i + 1) + " / " + ids.length })); save();
      }
      const res = ids.map((id, i) => ({ id, q: genS(L(id), run.seeds[i]), ok: !run.res[i].wrong, first: run.res[i].first }));
      delete st.reviewRun;
      const bal = res.filter(x => x.ok).length, ok = bal >= r.n - (r.n > 3 ? 1 : 0);
      Skilly.reviewDone(r.id, ok);
      const at = Date.now(); res.forEach((x, i) => { if (!x.ok) logWrong("yaddaş yoxlaması", "yoxla@" + at + "#" + (i + 1), x.q, x.first); });
      if (!ok) {
        res.filter(x => !x.ok).forEach(x => Object.assign(st.lv[x.id], { streak: 0, done: false }));
        st.boss.passed = false; st.test = { ...st.test, passed: false };
        try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]").filter(x => x !== cfg.link); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {}
        save(); drawMap();
      }
      report("yoxla", { bal, max: r.n, qeyd: (ok ? "keçdi" : "keçmədi; yenidən açılan: " + res.filter(x => !x.ok).map(x => x.id).join(", ")) + " (" + r.id + ")" });
      testRoot.replaceChildren(h("div", { class: "oy-done" + (ok ? "" : " no") }, h("b", {}, "Yaddaş yoxlaması: " + bal + " / " + r.n + (ok ? " ✓" : " — mövzu yenidən açıldı")),
        h("ol", { class: "oy-review" }, ...res.map(x => h("li", { class: x.ok ? "ok" : "no" }, (x.ok ? "✓ " : "↻ ") + (typeof x.q.text === "string" ? x.q.text : x.q.text.textContent) + (x.ok ? "" : " — ilk cəhddə səhv")))),
        ok ? null : h("button", { type: "button", class: "btn", on: { click: () => cfg.goGame && cfg.goGame() } }, "Oyuna qayıt →")));
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
          h("div", { class: "oy-row" }, input, q.unit ? h("span", { class: "oy-unit" }, q.unit) : null, q.choices ? null : keys(input), btn), err));
        if (!q.choices) input.focus({ preventScroll: true });
        function go() {
          const v = getVal();
          if (q.choices ? v < 0 : !String(v).trim()) { err.textContent = q.choices ? "Əvvəl birini seç." : "Əvvəl cavabı yaz."; return; }
          if (!q.choices && (isNaN(parse(v)) || !okForm(v))) { err.textContent = "Cavabı hazır ədəd kimi yaz: 12, 0.5, 3/5, 5√3, √3/2 (ifadə yox)."; return; }
          resolve(v);
        }
      });
    }

    // a wrong answer from the entry test, final test or a review goes to the error journal (Səhvlər sheet)
    function logWrong(where, id, q, val) {
      if (!window.Skilly) return;
      Skilly.sehv({ id: cfg.key + "-" + id, fenn: cfg.fenn, movzu: cfg.title, menbe: cfg.title + " — " + where,
        sual: typeof q.text === "string" ? q.text : q.text.textContent,
        cavab: valText(q, val), duz: q.show, link: cfg.link });
    }

    function report(kind, r) {
      if (!window.Skilly) return;
      Skilly.netice({ id: cfg.key + "-" + kind + "@" + Date.now(), ders: cfg.title + ({ test: " — yekun sınaq", yoxla: " — yaddaş yoxlaması", giris: " — giriş testi", acildi: " — mövzu açıldı", baglandi: " — mövzu bağlandı" }[kind] || " — oyun (mənimsəmə)"), fenn: cfg.fenn, ...r });
    }

    // The topic is closed only while everything is done: final test, Boss and every level (father, 20 Oct 2026).
    // A level reopened by the old rules keeps the topic open until it is mastered; then the topic closes by itself.
    const inBag = () => { try { return JSON.parse(localStorage.getItem("skilly-bag") || "[]").includes(cfg.link); } catch (e) { return false; } };
    // A test taken under the old rule (8/10 passed) left wrong answers uncorrected: those questions, from the error
    // journal, are the whole test now; the topic closes when they are answered right (father, 20 Oct 2026).
    function pendingFix() {
      if (!st.test || !st.test.passed || st.test.v || st.test.fixed || st.test.bal >= cfg.test.n || !window.Skilly) return [];
      const pre = cfg.key + "-test@" + st.test.at + "#";
      return Skilly.all().filter(e => String(e.id).startsWith(pre)).map(e => ({ e, k: +String(e.id).slice(pre.length) })).sort((a, b) => a.k - b.k);
    }
    function fixQuestion({ e, k }) {
      const x = parse(e.duz);
      if (!isNaN(x) && okForm(String(e.duz))) return { text: e.sual, answer: x, show: e.duz, solution: "" };
      return genS(L(cfg.test.from[k - 1] || cfg.levels[0].id), newSeed()); // not a number: a new problem of the same level
    }
    async function runFix() {
      const list = pendingFix(); if (!list.length) return drawTest();
      const box = h("div"); testRoot.replaceChildren(box);
      for (let i = 0; i < list.length; i++) await ask(fixQuestion(list[i]), box, { label: "Düzəliş · " + (i + 1) + " / " + list.length });
      st.test.fixed = Date.now(); save(); settle();
      testRoot.replaceChildren(h("div", { class: "oy-done" }, h("b", {}, "Səhv düzəldildi — mövzu bağlandı ✓"),
        h("p", {}, "Bir həftə sonra 3 suallıq yaddaş yoxlaması gələcək.")));
    }
    function settle() {
      // only Fikrət's device decides: a change here always goes with a result in the cloud, else sync would undo it
      if (!st.test || !st.test.passed || (window.Skilly && Skilly.viewer && Skilly.viewer())) return;
      const open = cfg.levels.filter(l => !st.lv[l.id].done).map(l => l.id);
      if (pendingFix().length) open.push("sınaq səhvi");
      if (!open.length && st.boss.passed && !inBag()) { report("baglandi", { qeyd: "hamısı düz həll olundu" }); cfg.onPass && cfg.onPass(); }
      if ((open.length || !st.boss.passed) && inBag()) {
        try { localStorage.setItem("skilly-bag", JSON.stringify(JSON.parse(localStorage.getItem("skilly-bag") || "[]").filter(x => x !== cfg.link))); } catch (e) {}
        report("acildi", { qeyd: "açıq qalan: " + (open.join(", ") || "Boss") });
      }
    }

    // ---- entry test (stage 0): everything right → skip the lessons and the levels, straight to the Boss
    function drawEntry() {
      const E = cfg.entryEl; if (!E) return;
      const n = (cfg.entry && cfg.entry.n) || 8, mins = (cfg.entry && cfg.entry.min) || 10;
      const e = st.entry;
      const started = cfg.levels.some(l => st.lv[l.id].tries > 0);
      E.replaceChildren(h("div", { class: "oy-intro" }, h("h2", {}, "Giriş testi"),
        h("p", {}, `${n} sual, ${mins} dəqiqə. Mövzunu artıq bilirsənsə, burada görünəcək: ${n}/${n} olsa dərsləri və Oyunu keçmədən birbaşa Boss raunduna gedirsən. Az olsa — heç nə itmir, Dərs 1-dən başlayırsan.`),
        e ? h("p", { class: "oy-fmt" }, `Nəticən: ${e.bal} / ${n}` + (e.bal === n ? " — Boss açıqdır." : " — dərslərdən başla.")) : null,
        e || started ? (e && e.bal === n ? h("button", { type: "button", class: "btn", on: { click: () => { cfg.goGame && cfg.goGame(); boss(); } } }, "Boss raunduna keç →")
          : h("button", { type: "button", class: "btn", on: { click: () => cfg.goLesson && cfg.goLesson() } }, "Dərs 1-ə keç →"))
          : h("div", { class: "oy-row" }, h("button", { type: "button", class: "btn", on: { click: runEntry } }, "Testə başla"),
              h("button", { type: "button", class: "btn ghost", on: { click: () => { st.entry = { bal: -1, at: Date.now(), skipped: true }; save(); cfg.goLesson && cfg.goLesson(); } } }, "Mövzu yenidir, dərsdən başla"))));
    }
    async function runEntry() {
      const n = (cfg.entry && cfg.entry.n) || 8, mins = (cfg.entry && cfg.entry.min) || 10, E = cfg.entryEl;
      const ids = cfg.levels.map(l => l.id), pickIds = Array.from({ length: n }, (_, i) => ids[i % ids.length]);
      if (!st.entryRun) { st.entryRun = { seeds: pickIds.map(newSeed), vals: [], end: Date.now() + mins * 60000 }; save(); }
      const run = st.entryRun;
      const clock = h("div", { class: "oy-label" }), box = h("div");
      E.replaceChildren(clock, box);
      const end = run.end; let over = Date.now() >= end;
      const tick = setInterval(() => { const left = Math.max(0, end - Date.now()); clock.textContent = "Qalan vaxt: " + Math.floor(left / 60000) + ":" + String(Math.floor(left / 1000) % 60).padStart(2, "0"); if (!left) { over = true; clearInterval(tick); box.dispatchEvent(new Event("timeup")); } }, 500);
      for (let i = run.vals.length; i < n && !over; i++) {
        const q = genS(L(pickIds[i]), run.seeds[i]);
        const val = await Promise.race([collect(q, box, "Giriş testi · " + (i + 1) + " / " + n, i + 1 === n), new Promise(r => box.addEventListener("timeup", () => r(null), { once: true }))]);
        if (val === null) break;
        run.vals.push(val); save();
      }
      clearInterval(tick);
      let bal = 0; const at = Date.now();
      pickIds.forEach((id, i) => { const q = genS(L(id), run.seeds[i]), val = run.vals[i];
        if (val != null && (q.choices ? val === q.correct : close(parse(val), q.answer, tolOf(q)))) bal++;
        else logWrong("giriş testi", "giris@" + at + "#" + (i + 1), q, val); });
      delete st.entryRun;
      st.entry = { bal, at: Date.now() };
      if (bal === n) cfg.levels.forEach(l => Object.assign(st.lv[l.id], { done: true, streak: STREAK }));
      save(); drawMap(); drawEntry();
      report("giris", { bal, max: n, qeyd: bal === n ? "bütöv: birbaşa Boss" : "dərslərdən başlayır" });
    }

    drawMap(); drawTest(); drawEntry();
    // after this device has the other devices' progress (a newer copy reloads the page before this runs)
    (window.Skilly && Skilly.synced ? Skilly.synced : Promise.resolve()).then(settle);
    if (st.entryRun && cfg.entryEl) runEntry();
    // an unfinished test resumes only while the test is open (every level mastered, Boss passed)
    if (st.testRun && testRoot) { if (st.boss.passed && allDone() && !pendingFix().length) runTest(); else { delete st.testRun; save(); drawTest(); } }
    cfg.refreshTest = drawTest;
    return { state: st, drawTest };
  }

  window.Oyun = { mount, parse, h, okForm };
})();
