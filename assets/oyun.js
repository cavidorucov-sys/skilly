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
  // The finished number must also be in its simplest form (father, 20 Nov 2026): 4/2 → 2, 6/4 → 3/2, √4 → 2,
  // √12 → 2√3, 1√3 → √3, 05 → 5. Not simplified → a hint and the attempt is not counted. Returns the hint or "".
  // Trailing zeros stay allowed (19,70 after rounding, 1,70 manat); √92 − 9 (the fractional part of √92) stays allowed:
  // the square factor is checked only for a one-term answer.
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  function simpler(raw) {
    const t = String(raw).replace(/\s+/g, "").replace(/sqrt/gi, "√").replace(/[−–—]/g, "-").replace(/,/g, ".").replace(/°$/, "").replace(/^[-+]/, "");
    const parts = t.split(/(?<=.)[-+]/);
    for (const p of parts) {
      if (/(^|[^\d.])0\d/.test(p) || /\.(?!\d)/.test(p)) return "lazımsız sıfırları sil.";
      const m = p.match(/^(?:(\d*)(√))?(\d+(?:\.\d+)?)(?:\/(\d+))?$/);
      if (!m) continue;
      const [, k = "", root, n, d] = m;
      if (root) {
        if (k === "1") return "kökün qarşısında 1 yazılmır.";
        if (/^\d+$/.test(n)) {
          const N = +n; let s = 1; for (let i = 2; i * i <= N; i++) if (N % (i * i) === 0) s = i;
          if (N <= 1 || Number.isInteger(Math.sqrt(N))) return "kökü çıxar — kökaltı tam kvadratdır.";
          if (s > 1 && parts.length === 1) return "vuruğu kök altından çıxar.";
        }
        if (d != null && (+d === 1 || gcd(+(k || 1), +d) > 1)) return "kəsri ixtisar et.";
      } else if (d != null) {
        if (!/^\d+$/.test(n)) return "kəsrin surətini və məxrəcini tam ədəd kimi yaz.";
        if (+d === 1 || (+n) % (+d) === 0) return "bu kəsr tam ədədə bərabərdir — tam ədəd kimi yaz.";
        if (gcd(+n, +d) > 1) return "kəsri ixtisar et.";
      }
    }
    return "";
  }
  const simplerMsg = raw => { const s = simpler(raw); return s ? "Cavabı sadələşdir: " + s : ""; };
  // exact answers (shown as a fraction or a root) need the exact value; rounded decimals are not accepted
  const tolOf = q => q.tol ?? (/[\/√]/.test(String(q.show)) ? 1e-6 : undefined);
  const close = (x, v, tol) => Math.abs(x - v) <= (tol ?? Math.max(0.005, Math.abs(v) * 0.005));

  // small on-screen keys for √, / and − (hard to type on a phone keyboard)
  function keys(input) {
    return h("div", { class: "oy-keys" }, ...["√", "/", "−"].map(k => h("button", { type: "button", class: "oy-key", "aria-label": "Daxil et: " + k,
      on: { click: () => { const a = input.selectionStart ?? input.value.length, b = input.selectionEnd ?? a; input.value = input.value.slice(0, a) + k + input.value.slice(b); input.focus(); input.setSelectionRange(a + 1, a + 1); input.dispatchEvent(new Event("input")); } } }, k)));
  }
  // ---- exam-format questions (father, 15 Nov 2026): A–E options built from typical mistakes, not from random numbers.
  // ae(right, [4 wrong], fmt?) → { choices: ["A) …", …], correct } in a random order; null when two options would
  // look the same (the generator then draws new numbers: again(make)). Numbers are written the Azerbaijani way: num().
  const AE = "ABCDE";
  const num = (x, dp = 4) => { if (typeof x !== "number") return String(x); const r = Math.round(x * 10 ** dp) / 10 ** dp; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  function ae(right, wrong, fmt) {
    const f = fmt || (x => num(x));
    const all = [right, ...wrong].map(f);
    if (all.length !== 5 || new Set(all.map(x => String(x).replace(/\s+/g, ""))).size !== 5) return null;
    const idx = [0, 1, 2, 3, 4];
    for (let i = 4; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
    return { choices: idx.map((k, i) => AE[i] + ") " + all[k]), correct: idx.indexOf(0) };
  }
  // ---- Azerbaijani-language questions (21 Nov 2026). Besides choices (A–E, also "A) 1, 3, 5" number combinations)
  // two more kinds, checked only as a whole (every word right):
  //   q.sec = { soz: [tokens], duz: [indices] } — tap every word that fits; a token without letters (punctuation) is
  //           not tappable;
  //   q.bol = { soz: [items], qrup: [group names], duz: [group index per item] } — put every item into its group.
  const LETTER = /[\p{L}\d]/u;
  const sameList = (a, b) => Array.isArray(a) && a.length === b.length && a.every((x, i) => x === b[i]);
  // the answer widget for a non-number question: { el, get, empty(v), msg }; null for a typed number
  function widget(q, onPick) {
    // long options (whole sentences, statements) stand one under another, as on the exam sheet
    const radio = (labels, set, aria) => { const box = h("div", { class: "oy-choices" + (labels.some(c => String(c).length > 30) ? " oy-long" : ""), role: "radiogroup", ...(aria ? { "aria-label": aria } : {}) }, ...labels.map((c, i) => h("button", { type: "button", role: "radio", "aria-checked": "false",
      on: { click: e => { set(i); box.querySelectorAll("button").forEach(b => b.setAttribute("aria-checked", String(b === e.currentTarget))); onPick(); } } }, c))); return box; };
    if (q.choices) { let pick = -1; return { el: radio(q.choices, i => { pick = i; }), get: () => pick, empty: v => v < 0, msg: "Əvvəl birini seç." }; }
    if (q.sec) {
      const on = new Set();
      const el = h("div", { class: "oy-sec" }, ...q.sec.soz.map((w, i) => LETTER.test(w) ? h("button", { type: "button", "aria-pressed": "false",
        on: { click: e => { on.has(i) ? on.delete(i) : on.add(i); e.currentTarget.setAttribute("aria-pressed", String(on.has(i))); onPick(); } } }, w) : h("span", {}, w)));
      return { el, get: () => [...on].sort((a, b) => a - b), empty: v => !v.length, msg: "Əvvəl sözə toxun." };
    }
    if (q.bol) {
      const val = q.bol.soz.map(() => -1);
      const el = h("div", { class: "oy-bol" }, ...q.bol.soz.map((w, i) => h("div", { class: "oy-bol-row" }, h("b", {}, w), radio(q.bol.qrup, j => { val[i] = j; }, w))));
      return { el, get: () => val.slice(), empty: v => v.some(x => x < 0), msg: "Hər sözü bir qrupa ayır." };
    }
    return null;
  }
  const tolOf0 = q => q.tol ?? (/[\/√]/.test(String(q.show)) ? 1e-6 : undefined);
  const isRight = (q, v) => v != null && (q.choices ? v === q.correct : q.sec ? sameList(v, q.sec.duz.slice().sort((a, b) => a - b))
    : q.bol ? sameList(v, q.bol.duz) : Math.abs(parse(v) - q.answer) <= (tolOf0(q) ?? Math.max(0.005, Math.abs(q.answer) * 0.005)));
  // the given answer as text (results, error journal)
  const answerText = (q, v) => v == null ? "(vaxt bitdi, cavab yoxdur)" : q.choices ? (q.choices[v] || "")
    : q.sec ? v.map(i => q.sec.soz[i]).join(", ") : q.bol ? v.map((g, i) => q.bol.soz[i] + " → " + (q.bol.qrup[g] || "?")).join("; ") : String(v);
  function again(make, n = 400) { for (let i = 0; i < n; i++) { const q = make(); if (q) return q; } throw new Error("again: no valid problem after " + n + " tries"); }
  // the game level made of the exam-format questions: one of them at random each time (Boss comes after it)
  const imtLevel = (imt, extra) => ({ id: "imtahan", ad: "İmtahan səviyyəsi", imt: true,
    izah: "Sual imtahandakı kimidir: variantlar tipik səhvlərdən qurulub. Kağızda həll et, sonra seç və ya yaz.",
    gen: () => { const s = imt.suallar[Math.floor(Math.random() * imt.suallar.length)]; return s.gen(); }, ...(extra || {}) });
  const TIP = { qapali: "Qapalı (A–E)", kod: "Kodlaşdırılan", yazili: "Yazılı" };

  // photos of written work (Skilly.sekil, Firestore): Fikrət adds and removes, the father only looks (as in rfo-final.js)
  // full-size view of the solution photos: arrows / swipe-free buttons between pages, Esc or a click outside closes it
  function lightbox(list, start) {
    let i = start;
    const img = h("img", { alt: "" }), cap = h("span", {});
    const prev = h("button", { type: "button", class: "btn ghost", "aria-label": "Əvvəlki səhifə", on: { click: () => go(-1) } }, "←");
    const next = h("button", { type: "button", class: "btn ghost", "aria-label": "Növbəti səhifə", on: { click: () => go(1) } }, "→");
    const close = h("button", { type: "button", class: "btn ghost", "aria-label": "Bağla", on: { click: () => dlg.close() } }, "✕");
    const dlg = h("dialog", { class: "oy-lightbox", "aria-label": "Həllin şəkli" },
      h("div", { class: "oy-lb-bar" }, prev, cap, next, close), h("div", { class: "oy-lb-img" }, img));
    const show = () => { img.src = list[i].data; img.alt = "Səhifə " + (i + 1); cap.textContent = "Səhifə " + (i + 1) + " / " + list.length; prev.disabled = i === 0; next.disabled = i === list.length - 1; };
    const go = d => { const j = i + d; if (j >= 0 && j < list.length) { i = j; show(); } };
    dlg.addEventListener("click", e => { if (e.target === dlg || e.target.classList.contains("oy-lb-img")) dlg.close(); });
    dlg.addEventListener("keydown", e => { if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); });
    dlg.addEventListener("close", () => dlg.remove());
    document.body.append(dlg); show(); dlg.showModal(); close.focus();
  }
  function photoBox(ref, onChange) {
    const viewer = window.Skilly && Skilly.viewer && Skilly.viewer();
    const msg = h("p", { class: "oy-fmt", "aria-live": "polite" }), grid = h("div", { class: "oy-thumbs" });
    let list = [], busy = false;
    const draw = () => {
      grid.replaceChildren(...list.map((p, i) => h("figure", { class: "oy-thumb" },
        // a data: URL cannot open in a new tab (the browser blocks it): the page is shown in a lightbox (father, 18 Nov 2026)
        h("button", { type: "button", class: "oy-thumb-open", title: "Böyüt", "aria-label": "Səhifə " + (i + 1) + " şəklini böyüt", on: { click: () => lightbox(list, i) } }, h("img", { src: p.data, alt: "Səhifə " + (i + 1) })),
        h("figcaption", {}, "Səhifə " + (i + 1) + " ", viewer ? null : h("button", { type: "button", class: "btn ghost", "aria-label": "Səhifə " + (i + 1) + " şəklini sil",
          on: { click: async () => { if (!confirm("Səhifə " + (i + 1) + " şəkli silinsin?")) return; await Skilly.sekil.del(p.id); list.splice(i, 1); draw(); onChange && onChange(list.length); } } }, "Sil")))));
      if (!busy) msg.textContent = list.length ? list.length + " şəkil Skilly-də saxlanıb." : "Hələ şəkil yoxdur.";
    };
    const input = h("input", { type: "file", accept: "image/*", multiple: "", hidden: "" });
    input.addEventListener("change", async () => {
      const files = [...input.files]; input.value = ""; busy = true;
      for (let i = 0; i < files.length; i++) {
        msg.textContent = "Yüklənir: " + (i + 1) + " / " + files.length + "...";
        try { list.push(await Skilly.sekil.add(ref, files[i])); } catch (e) { busy = false; draw(); msg.textContent = "Alınmadı: " + (e.message || e); return; }
        draw();
      }
      busy = false; draw(); onChange && onChange(list.length);
    });
    const add = h("button", { type: "button", class: "btn ghost", on: { click: () => input.click() } }, "📷 Həllin şəklini əlavə et");
    const box = h("div", { class: "oy-photos" }, viewer ? null : add, input, msg, grid);
    box.count = () => list.length;
    msg.textContent = "Yüklənir...";
    (window.Skilly && Skilly.sekil ? Skilly.sekil.list(ref) : Promise.resolve(null)).then(r => {
      if (r === null) { add.disabled = true; msg.textContent = "Şəkli Skilly-də saxlamaq üçün əvvəl soldakı “Google ilə daxil ol” düyməsi ilə öz hesabına daxil ol."; box.noAccount = true; return; }
      list = r; draw(); onChange && onChange(list.length);
    }).catch(() => { msg.textContent = "Şəkillər yüklənmədi (internet?)."; });
    return box;
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
        h("p", {}, "Hər səviyyədə " + STREAK + " sual, " + (cfg.tesadufi || "ədədlər təsadüfidir") + ". Hər sual düz cavablanmalıdır: səhv olsa, sual dəyişmir — düzünü tapana qədər yenidən yoxla. Sayğac sıfırlanmır. Səviyyələr bitəndə Boss raundu açılır (hər səviyyədən bir sual), Boss-dan sonra Sınaq."),
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
        const W = widget(q, () => { err.textContent = ""; });
        if (W) { input = W.el; getVal = W.get; }
        else {
          input = h("input", { class: "oy-in", type: "text", inputmode: "text", autocomplete: "off", "aria-label": "Cavab", placeholder: q.placeholder || "cavab" });
          input.addEventListener("input", () => { err.textContent = ""; });
          input.addEventListener("keydown", e => { if (e.key === "Enter") check(); });
          getVal = () => input.value;
        }
        const btn = h("button", { type: "button", class: "btn", on: { click: () => check() } }, "Yoxla");
        const row = W && !q.choices ? h("div", { class: "oy-row oy-row-w" }, input, btn) : h("div", { class: "oy-row" }, input, q.unit ? h("span", { class: "oy-unit" }, q.unit) : null, W ? null : keys(input), btn);
        box.replaceChildren(h("div", { class: "oy-q" }, opts.label ? h("div", { class: "oy-label" }, opts.label) : null,
          h("div", { class: "oy-text" }, q.text), q.svg || null, row, err, fb));
        if (!W) input.focus({ preventScroll: true });
        function check() {
          if (btn.disabled) return;
          const v = getVal();
          let ok;
          if (W) { if (W.empty(v)) { err.textContent = W.msg; return; } ok = isRight(q, v); }
          else {
            const x = parse(v);
            if (!String(v).trim()) { err.textContent = "Əvvəl cavabı yaz."; return; }
            if (isNaN(x) || !okForm(v)) { err.textContent = "Cavabı hazır ədəd kimi yaz: 12, 0.5, 3/5, 5√3, √3/2 (ifadə yox)."; return; }
            const sm = simplerMsg(v); if (sm) { err.textContent = sm; return; }
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
          if (!W) { input.select(); input.focus({ preventScroll: true }); }
        }
      });
    }
    const valText = answerText;

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
      if (imtBusy) { testRoot.replaceChildren(imtRoot); return; } // an exam-format test is running: keep it on screen
      drawTestOld(); drawImt();
      // the topic's state on top, so a passed old test plus a passed exam-format test read as "fully closed" (father, 18 Nov 2026)
      if (inBag()) {
        const tam = (() => { try { return JSON.parse(localStorage.getItem("skilly-tam") || "[]").includes(cfg.link); } catch (e) { return false; } })();
        const full = !IMT || (st.imt && st.imt.passed) || tam;
        testRoot.prepend(h("div", { class: "oy-done" + (full ? "" : " no") }, h("b", {}, full ? "Mövzu tam bağlanıb ✓" : "Mövzu qismən bağlanıb — imtahan formatlı sınaq qalıb")));
      }
      testRoot.append(imtRoot);
    }
    function drawTestOld() {
      // the test needs the whole game: every level mastered and the Boss passed
      const openLv = cfg.levels.filter(l => !l.imt && !st.lv[l.id].done);
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
      // closed by the old test and the topic has an exam-format test: the old one is done, only the new one is the next step
      // (a "Start again" button here led to retaking the old test instead of the new one — father, 18 Nov 2026)
      if (IMT && inBag()) {
        testRoot.replaceChildren(h("div", { class: "oy-intro" }, h("h2", {}, "Yekun sınaq"),
          h("p", { class: "oy-fmt" }, "Keçilib ✓" + (last && last.passed ? " — ilk cəhddə düz: " + last.bal + " / " + cfg.test.n : "") + ". Yenidən yazmaq lazım deyil.")));
        return;
      }
      testRoot.replaceChildren(h("div", { class: "oy-intro" }, h("h2", {}, "Yekun sınaq"),
        h("p", {}, cfg.test.n + " sual, " + (cfg.tesadufi || "ədədlər təsadüfidir") + ". Hər sual düz cavablanmalıdır: səhv olsa, sual qalır — düzünü tapana qədər. Hamısı düz olanda mövzu bağlanır. Kağız və qələm yanında olsun."),
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
      // closed now, on this page too (the sync would add it only on the next load)
      if (!(window.Skilly && Skilly.viewer && Skilly.viewer())) try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes(cfg.link)) { b.push(cfg.link); localStorage.setItem("skilly-bag", JSON.stringify(b)); } } catch (e) {}
      if (window.Skilly) Skilly.planReview(cfg.key, cfg.link, cfg.title);
      const part = IMT && !(st.imt && st.imt.passed);
      testRoot.replaceChildren(h("div", { class: "oy-done" }, h("b", {}, part ? "Sınaq bitdi — mövzu qismən bağlandı. Tam bağlanması üçün imtahan formatlı sınaq qalıb." : "Sınaq bitdi — mövzu bağlandı ✓"),
        part ? h("button", { type: "button", class: "btn", on: { click: () => drawTest() } }, "İmtahan formatlı sınağa keç →") : null,
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
    function collect(q, box, label, isLast, opt = {}) {
      return new Promise(resolve => {
        const err = h("div", { class: "oy-err", "aria-live": "polite" });
        let input, getVal;
        const W = widget(q, () => { err.textContent = ""; });
        if (W) { input = W.el; getVal = W.get; }
        else {
          input = h("input", { class: "oy-in", type: "text", autocomplete: "off", "aria-label": "Cavab", placeholder: q.placeholder || "cavab" });
          input.addEventListener("input", () => { err.textContent = ""; });
          input.addEventListener("keydown", e => { if (e.key === "Enter") go(); });
          getVal = () => input.value;
        }
        const btn = h("button", { type: "button", class: "btn", on: { click: () => go() } }, isLast ? "Bitir" : "Növbəti →");
        box.replaceChildren(h("div", { class: "oy-q" }, h("div", { class: "oy-label" }, label), h("div", { class: "oy-text" }, q.text), q.svg || null, opt.extra || null,
          W && !q.choices ? h("div", { class: "oy-row oy-row-w" }, input, btn) : h("div", { class: "oy-row" }, input, q.unit ? h("span", { class: "oy-unit" }, q.unit) : null, W ? null : keys(input), btn), err));
        if (!W) input.focus({ preventScroll: true });
        function go() {
          const v = getVal();
          if (W ? W.empty(v) : !String(v).trim()) { err.textContent = W ? W.msg : "Əvvəl cavabı yaz."; return; }
          if (!W && (isNaN(parse(v)) || !okForm(v))) { err.textContent = "Cavabı hazır ədəd kimi yaz: 12, 0.5, 3/5, 5√3, √3/2 (ifadə yox)."; return; }
          const sm = W ? "" : simplerMsg(v); if (sm) { err.textContent = sm; return; }
          const g = opt.guard && opt.guard(); if (g) { err.textContent = g; return; }
          resolve(v);
        }
      });
    }

    // a wrong answer from the final test or a review goes to the error journal
    function logWrong(where, id, q, val) {
      if (!window.Skilly) return;
      Skilly.sehv({ id: cfg.key + "-" + id, fenn: cfg.fenn, movzu: cfg.title, menbe: cfg.title + " — " + where,
        sual: typeof q.text === "string" ? q.text : q.text.textContent,
        cavab: valText(q, val), duz: q.show, link: cfg.link,
        // enough of the question to ask it again in the journal, checked the same way (the answer is never shown there)
        q2: { choices: q.choices || null, correct: q.correct ?? null, answer: q.answer ?? null, tol: tolOf(q) ?? null, unit: q.unit || "", svg: q.svg && q.svg.outerHTML ? q.svg.outerHTML : "",
          ...(q.sec ? { sec: q.sec } : {}), ...(q.bol ? { bol: q.bol } : {}) } });
    }

    function report(kind, r) {
      if (!window.Skilly) return;
      Skilly.netice({ id: cfg.key + "-" + kind + "@" + Date.now(), ders: cfg.title + ({ test: " — yekun sınaq", imtahan: " — imtahan formatlı sınaq", yoxla: " — yaddaş yoxlaması", giris: " — giriş testi", acildi: " — mövzu açıldı", baglandi: " — mövzu bağlandı" }[kind] || " — oyun (mənimsəmə)"), fenn: cfg.fenn, ...r });
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
      // the exam level came later (15 Nov 2026): a topic closed before it is "partly closed", not reopened
      const open = cfg.levels.filter(l => !l.imt && !st.lv[l.id].done).map(l => l.id);
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
        h("p", {}, `${n} sual, ${mins} dəqiqə. Mövzunu artıq bilirsənsə, burada görünəcək: ${n}/${n} olsa dərsləri, Oyunu və Boss-u keçmədən birbaşa Sınağa gedirsən. Az olsa — heç nə itmir, Dərs 1-dən başlayırsan.`),
        e ? h("p", { class: "oy-fmt" }, `Nəticən: ${e.bal} / ${n}` + (e.bal === n ? " — Sınaq açıqdır." : " — dərslərdən başla.")) : null,
        e || started ? (e && e.bal === n ? h("button", { type: "button", class: "btn", on: { click: () => cfg.goTest && cfg.goTest() } }, "Sınağa keç →")
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
      let bal = 0;
      pickIds.forEach((id, i) => { const q = genS(L(id), run.seeds[i]), val = run.vals[i];
        if (isRight(q, val)) bal++; }); // entry-test mistakes stay out of the journal (father, 10 Nov 2026)
      delete st.entryRun;
      st.entry = { bal, at: Date.now() };
      if (bal === n) { cfg.levels.forEach(l => Object.assign(st.lv[l.id], { done: true, streak: STREAK })); st.boss.passed = true; } // 8/8 at the first try is stricter than the Boss
      save(); drawMap(); drawEntry(); drawTest();
      report("giris", { bal, max: n, qeyd: bal === n ? "bütöv: birbaşa Sınaq" : "dərslərdən başlayır" });
    }

    // ---- exam-format test (father, 15 Nov 2026): a topic closed by the old final test is only "partly closed" until
    // this one is passed. Math: 6 closed (A–E) + 3 coded + 1 written (solution on paper, its photo uploaded, the final
    // answer typed and checked); physics: 10 A–E as in the RFO. Answers are checked only at the end, as in the exam;
    // then every wrong one is solved again until right (no answer shown). All right → the topic is fully closed.
    const IMT = cfg.imtahan;
    const imtRoot = h("div", { class: "oy-imt" });
    let imtBusy = false;
    const imtLv = cfg.levels.find(l => l.imt);
    const imtOpen = () => inBag() && (!imtLv || st.lv[imtLv.id].done);
    const mmss = ms => { const s = Math.round(ms / 1000); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
    const imtQs = run => IMT.suallar.map((s, i) => ({ ...genS({ gen: s.gen }, run.seeds[i]), tip: s.tip }));
    const right = isRight;
    const fmtLine = () => { const c = t => IMT.suallar.filter(s => s.tip === t).length;
      return IMT.suallar.length + " sual: " + [["qapali", "qapalı (A–E)"], ["kod", "kodlaşdırılan"], ["yazili", "yazılı"]].filter(([t]) => c(t)).map(([t, w]) => c(t) + " " + w).join(" + ") + (IMT.vaxt ? " · tövsiyə olunan vaxt " + IMT.vaxt + " dəqiqə" : ""); };
    function drawImt() {
      if (!IMT) { imtRoot.replaceChildren(); return; }
      const head = h("h2", {}, "İmtahan formatlı sınaq");
      if (st.imt && st.imt.passed) {
        imtRoot.replaceChildren(h("div", { class: "oy-intro" }, head, h("p", { class: "oy-fmt" }, "Keçildi ✓ — ilk cəhddə düz: " + st.imt.bal + " / " + IMT.suallar.length + " · vaxt " + mmss(st.imt.ms || 0) + ". Mövzu tam bağlanıb."),
          st.imt.ref ? photoBox(st.imt.ref) : null));
        return;
      }
      if (!inBag()) { imtRoot.replaceChildren(h("div", { class: "oy-intro" }, head, h("p", {}, "🔒 Yekun sınaqdan sonra açılır. Mövzu bu sınaqla tam bağlanır."))); return; }
      if (!imtOpen()) {
        imtRoot.replaceChildren(h("div", { class: "oy-intro" }, head,
          h("p", {}, "Mövzu qismən bağlanıb: köhnə sınaq keçilib. Tam bağlanması üçün imtahan formatlı sınaq qalıb. Əvvəl dərsdəki “İmtahanda necə gəlir” bölməsini oxu və Oyunda “İmtahan səviyyəsi”ni keç."),
          h("button", { type: "button", class: "btn", on: { click: () => { cfg.goGame && cfg.goGame(); play(imtLv.id); } } }, "İmtahan səviyyəsinə keç →")));
        return;
      }
      const r = st.imtRun;
      imtRoot.replaceChildren(h("div", { class: "oy-intro" }, head,
        h("p", {}, "Mövzu qismən bağlanıb. " + fmtLine() + ". Sual imtahandakı kimidir; cavablar yalnız sonda yoxlanır." + (IMT.suallar.some(s => s.tip === "yazili") ? " Yazılı sualda həlli kağızda tam yaz, şəklini yüklə və son cavabı daxil et." : "") + " Sonra səhv olan suallar yenidən gəlir — düzünü tapana qədər. Hamısı düz olanda mövzu tam bağlanır."),
        h("button", { type: "button", class: "btn", on: { click: runImt } }, r ? "Davam et" : "Başla")));
    }
    async function runImt() {
      if (!IMT || imtBusy) return;
      if (!st.imtRun) { st.imtRun = { seeds: IMT.suallar.map(newSeed), vals: [], t0: Date.now(), wrong: [] }; save(); }
      const run = st.imtRun, qs = imtQs(run), ref = cfg.key + "-imtahan@" + run.t0;
      imtBusy = true; testRoot.replaceChildren(imtRoot);
      const clock = h("div", { class: "oy-label" }), box = h("div");
      imtRoot.replaceChildren(clock, box);
      const tick = setInterval(() => { clock.textContent = "Keçən vaxt: " + mmss(Date.now() - run.t0) + (IMT.vaxt ? " · tövsiyə " + IMT.vaxt + " dəq" : ""); }, 500);
      try {
        // 1) every answer is taken without saying whether it is right
        for (let i = run.vals.length; i < qs.length; i++) {
          const q = qs[i], label = "İmtahan · " + (i + 1) + " / " + qs.length + " · " + TIP[q.tip];
          let extra = null, guard = null;
          if (q.tip === "yazili") {
            extra = h("div", {}, h("p", { class: "oy-fmt" }, "Həlli kağızda addım-addım yaz (imtahanda yalnız cavab bal gətirmir). Şəklini yüklə, sonra son cavabı yaz."), photoBox(ref + "#" + (i + 1)));
            guard = () => { const pb = extra.querySelector(".oy-photos"); if (!pb) return ""; const viewer = window.Skilly && Skilly.viewer && Skilly.viewer();
              return viewer || pb.count() > 0 ? "" : pb.noAccount ? "Əvvəl Google ilə daxil ol və həllin şəklini yüklə." : "Əvvəl həllin şəklini yüklə."; };
          }
          run.vals.push(await collect(q, box, label, i + 1 === qs.length, { extra, guard })); save();
        }
        if (run.ms == null) {
          run.ms = Date.now() - run.t0;
          run.wrong = qs.map((q, i) => right(q, run.vals[i]) ? -1 : i).filter(i => i >= 0);
          run.bal = qs.length - run.wrong.length;
          run.wrong.forEach(i => logWrong("imtahan formatlı sınaq", "imtahan@" + run.t0 + "#" + (i + 1), qs[i], run.vals[i]));
          save();
        }
        clearInterval(tick); clock.textContent = "";
        // 2) the result as in the exam, then the wrong ones again until right
        if (run.wrong.length && !run.fixStarted) {
          await new Promise(res => box.replaceChildren(h("div", { class: "oy-done no" }, h("b", {}, "Nəticə: " + run.bal + " / " + qs.length + " · vaxt " + mmss(run.ms)),
            h("ol", { class: "oy-review" }, ...qs.map((q, i) => h("li", { class: run.wrong.includes(i) ? "no" : "ok" }, (run.wrong.includes(i) ? "✗ " : "✓ ") + TIP[q.tip] + ": " + (typeof q.text === "string" ? q.text : q.text.textContent)))),
            h("p", {}, "İndi səhv olan " + run.wrong.length + " sual yenidən gəlir. Kağızda yenidən həll et; səhv olsa, sual qalır."),
            h("button", { type: "button", class: "btn", on: { click: () => { run.fixStarted = true; save(); res(); } } }, "Səhvləri düzəlt →"))));
        }
        run.fixed = run.fixed || [];
        for (const i of run.wrong) {
          if (run.fixed.includes(i)) continue;
          await ask(qs[i], box, { label: "Düzəliş · " + TIP[qs[i].tip] + " · sual " + (i + 1) });
          run.fixed.push(i); save();
        }
        // 3) all right: the topic is fully closed
        delete st.imtRun;
        const yi = qs.findIndex(q => q.tip === "yazili");
        st.imt = { passed: true, at: Date.now(), bal: run.bal, ms: run.ms, ref: yi >= 0 ? ref + "#" + (yi + 1) : null };
        try { const t = JSON.parse(localStorage.getItem("skilly-tam") || "[]"); if (!t.includes(cfg.link)) { t.push(cfg.link); localStorage.setItem("skilly-tam", JSON.stringify(t)); } } catch (e) {}
        save();
        const missed = run.wrong.map(i => (i + 1) + " (" + { qapali: "qapalı", kod: "kodlaşdırılan", yazili: "yazılı" }[qs[i].tip] + ")");
        report("imtahan", { bal: run.bal, max: qs.length, qeyd: "keçdi; ilk cəhddə " + run.bal + "/" + qs.length + "; vaxt " + mmss(run.ms) + (missed.length ? "; səhv: " + missed.join(", ") : "") + (st.imt.ref ? "; yazılı həllin şəkli Skilly-də (" + st.imt.ref + ")" : ""), ...(st.imt.ref ? { sekil: st.imt.ref } : {}) });
        box.replaceChildren(h("div", { class: "oy-done" }, h("b", {}, "İmtahan formatlı sınaq bitdi — mövzu tam bağlandı ✓"),
          h("p", {}, "İlk cəhddə düz: " + run.bal + " / " + qs.length + " · vaxt " + mmss(run.ms) + "."),
          h("button", { type: "button", class: "btn ghost", on: { click: () => { imtBusy = false; drawTest(); } } }, "Bağla")));
      } finally { clearInterval(tick); }
      imtBusy = false;
    }

    drawMap(); drawTest(); drawEntry();
    if (st.imtRun && IMT && imtOpen()) runImt();
    // after this device has the other devices' progress (a newer copy reloads the page before this runs)
    (window.Skilly && Skilly.synced ? Skilly.synced : Promise.resolve()).then(settle);
    if (st.entryRun && cfg.entryEl) runEntry();
    // an unfinished test resumes only while the test is open (every level mastered, Boss passed)
    if (st.testRun && testRoot) { if (st.boss.passed && allDone() && !pendingFix().length) runTest(); else { delete st.testRun; save(); drawTest(); } }
    cfg.refreshTest = drawTest;
    return { state: st, drawTest };
  }

  window.Oyun = { mount, parse, h, okForm, simpler, ae, again, num, imtLevel, isRight, answerText };
})();
