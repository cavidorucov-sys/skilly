// Çoxhədlilər — mastery game levels (standard form and degree, addition/subtraction, monomial × polynomial,
// polynomial × polynomial, division by a monomial, find the mistake, word problems) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nz = (a, b) => { let v; do v = rnd(a, b); while (!v); return v; };
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);
  const sup = n => n === 1 ? "" : String(n).split("").map(d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("");
  const xp = n => n === 0 ? "" : "x" + sup(n);                              // x, x², x³ …
  // polynomial from [coef, var] terms, order kept
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  // coefficient array (index = power of x) → standard form, highest power first
  const pa = c => poly(c.map((k, i) => [k, xp(i)]).reverse());
  const mono = (c, n) => poly([[c, xp(n)]]);
  const br = s => s.startsWith("−") ? "(" + s + ")" : s;
  const deg = c => { for (let i = c.length - 1; i >= 0; i--) if (c[i]) return i; return 0; };
  const mul = (a, b) => { const r = Array(a.length + b.length - 1).fill(0); a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; })); return r; };
  const add = (a, b, s = 1) => { const r = Array(Math.max(a.length, b.length)).fill(0); a.forEach((x, i) => { r[i] += x; }); b.forEach((y, i) => { r[i] += s * y; }); return r; };
  const val = (c, x) => c.reduce((s, k, i) => s + k * x ** i, 0);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rpoly = (d, lo = -9, hi = 9) => { const c = []; for (let i = 0; i < d; i++) c.push(rnd(lo, hi)); c.push(nz(lo, hi)); return c; }; // degree exactly d
  const qName = k => k === 0 ? "Sərbəst hədd neçədir?" : `“${xp(k)}” həddinin əmsalı neçədir?`;

  const levels = [
    { id: "standart", ad: "Standart şəkil və dərəcə", izah: "Oxşar hədləri birləşdir, hədləri üstün azalması ilə düz. Dərəcə — standart şəkildə ən böyük üst (sıfıra çevrilən hədd sayılmır).",
      gen() {
        if (Math.random() < .3) { // two variables: degree of each monomial = sum of exponents
          const ms = []; while (ms.length < 3) { const a = rnd(0, 5), b = rnd(0, 5); if (a + b >= 2 && !ms.some(m => m[1] === a && m[2] === b)) ms.push([nz(-9, 9), a, b]); }
          const txt = poly(ms.map(([c, a, b]) => [c, (a ? "x" + sup(a) : "") + (b ? "y" + sup(b) : "")]));
          const ds = ms.map(([, a, b]) => a + b), d = Math.max(...ds);
          return { text: `Çoxhədlinin dərəcəsini tap: ${txt}.`, answer: d, show: String(d), tol: 0.01,
            solution: `Hər birhədlinin dərəcəsi — x və y üstlərinin cəmi: ${ms.map(([, a, b]) => `${a} + ${b} = ${a + b}`).join("; ")}. Çoxhədlinin dərəcəsi ən böyüyüdür: ${d}.` };
        }
        const d = rnd(2, 4), c = rpoly(d, -9, 9), terms = [];
        c.forEach((k, i) => { if (!k) return; if (Math.random() < .5) { let u; do u = nz(-9, 9); while (u === k); terms.push([u, i], [k - u, i]); } else terms.push([k, i]); });
        const cancel = Math.random() < .4 ? d + 1 : 0, ca = nz(-7, 7);
        if (cancel) terms.push([ca, cancel], [-ca, cancel]);
        shuffle(terms);
        const txt = poly(terms.map(([k, i]) => [k, xp(i)]));
        const std = `Oxşar hədlər birləşir${cancel ? ` (${poly([[ca, xp(cancel)], [-ca, xp(cancel)]])} = 0 — bu hədd yox olur)` : ""}: ${pa(c)}.`;
        const ask = pick(["deg", "deg", "coef", "c0"]);
        if (ask === "deg") return { text: `Çoxhədlini standart şəklə sal: ${txt}. Dərəcəsi neçədir?`, answer: d, show: String(d), tol: 0.01, solution: `${std} Ən böyük üst: ${d}.` };
        const k = ask === "c0" ? 0 : rnd(1, d);
        return { text: `Çoxhədlini standart şəklə sal: ${txt}. ${qName(k)}`, answer: c[k], show: S(c[k]), tol: 0.01, solution: `${std} Cavab: ${S(c[k])}.` };
      } },
    { id: "topla", ad: "Toplama və çıxma", izah: "Mötərizələri aç (çıxılanın bütün işarələri dəyişir), sonra oxşar hədləri birləşdir.",
      gen() {
        const a = rpoly(rnd(2, 3)), b = rpoly(rnd(2, 3)), s = pick([1, -1, -1]), r = add(a, b, s);
        const nb = b.map(k => s * k);
        const expr = `(${pa(a)}) ${s > 0 ? "+" : "−"} (${pa(b)})`;
        const opened = poly([...a.map((k, i) => [k, xp(i)]).reverse(), ...nb.map((k, i) => [k, xp(i)]).reverse()]);
        const head = `Mötərizələri aç: ${opened}. Oxşar hədlər: ${pa(r)}.`;
        if (Math.random() < .35) {
          const v = pick([-2, -1, 1, 2]), ans = val(r, v);
          return { text: `P(x) = ${pa(a)}, Q(x) = ${pa(b)}. P(x) ${s > 0 ? "+" : "−"} Q(x) çoxhədlisini standart şəklə sal və x = ${S(v)} olanda qiymətini tap.`, answer: ans, show: S(ans), tol: 0.01,
            solution: `${head} x = ${S(v)} qoy: ${S(ans)}.` };
        }
        const k = rnd(0, Math.max(a.length, b.length) - 1);
        return { text: `Sadələşdir: ${expr}. ${qName(k)}`, answer: r[k], show: S(r[k]), tol: 0.01,
          solution: `${head} ${k ? `${xp(k)}-li hədlər: ${S(a[k] || 0)} ${s > 0 ? "+" : "−"} ${P(b[k] || 0)} = ${S(r[k])}` : `Sərbəst hədd: ${S(a[0])} ${s > 0 ? "+" : "−"} ${P(b[0])} = ${S(r[0])}`}.` };
      } },
    { id: "vur1", ad: "Birhədli × çoxhədli", izah: "Birhədlini çoxhədlinin hər həddinə vur: əmsallar vurulur, üstlər toplanır.",
      gen() {
        const m = nz(-6, 6), n = rnd(1, 3), q = rpoly(rnd(2, 3), -7, 7), mc = Array(n).fill(0).concat([m]), r = mul(mc, q);
        const parts = q.map((k, i) => k ? `${mono(m, n)}·${br(mono(k, i))} = ${mono(m * k, n + i)}` : null).filter(Boolean).reverse().join("; ");
        if (Math.random() < .25) {
          const d = deg(r);
          return { text: `${br(mono(m, n))}·(${pa(q)}) hasilinin dərəcəsi neçədir?`, answer: d, show: String(d), tol: 0.01,
            solution: `Ən böyük dərəcəli hədd: ${mono(m, n)}·${br(mono(q[q.length - 1], q.length - 1))} = ${mono(m * q[q.length - 1], d)}. Dərəcə ${n} + ${q.length - 1} = ${d}.` };
        }
        const ks = r.map((k, i) => i).filter(i => i >= n), k = pick(ks);
        return { text: `Vur və standart şəklə sal: ${br(mono(m, n))}·(${pa(q)}). ${qName(k)}`, answer: r[k], show: S(r[k]), tol: 0.01,
          solution: `Hər həddə vur: ${parts}. Nəticə: ${pa(r)}. Cavab: ${S(r[k])}.` };
      } },
    { id: "vur2", ad: "Çoxhədli × çoxhədli", izah: "Birincinin hər həddini ikincinin hər həddinə vur, sonra oxşar hədləri birləşdir.",
      gen() {
        const a = [nz(-9, 9), nz(-4, 4)], b = Math.random() < .5 ? [nz(-9, 9), nz(-5, 5)] : [nz(-6, 6), nz(-6, 6), nz(-3, 3)];
        const r = mul(a, b);
        const prods = [];
        for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) prods.push([a[i] * b[j], xp(i + j)]);
        const expand = `(${pa(a)})(${pa(b)}) = ${poly(prods)} = ${pa(r)}`;
        if (Math.random() < .3) {
          const v = pick([-2, -1, 1, 2, 3]), ans = val(r, v);
          return { text: `(${pa(a)})(${pa(b)}) hasilini çoxhədli şəklində yaz. ${v === 1 ? "Əmsallarının cəmini tap." : `x = ${S(v)} olanda onun qiymətini tap.`}`, answer: ans, show: S(ans), tol: 0.01,
            solution: `${expand}. x = ${S(v)} qoy: ${S(ans)}. ` + (v === 1 ? "(Əmsalların cəmi = x = 1 olanda qiymət.)" : `Yoxlama: (${S(val(a, v))})·(${S(val(b, v))}) = ${S(ans)}.`) };
        }
        const k = rnd(1, r.length - 2);
        return { text: `Vur və standart şəklə sal: (${pa(a)})(${pa(b)}). ${qName(k)}`, answer: r[k], show: S(r[k]), tol: 0.01,
          solution: `${expand}. Cavab: ${S(r[k])}.` };
      } },
    { id: "bol", ad: "Birhədliyə bölmə", izah: "Çoxhədlinin hər həddini birhədliyə böl: əmsallar bölünür, üstlər çıxılır.",
      gen() {
        const m = nz(-6, 6), n = rnd(1, 3), q = rpoly(rnd(1, 3), -7, 7), mc = Array(n).fill(0).concat([m]), r = mul(mc, q);
        const parts = r.map((k, i) => k ? `${br(mono(k, i))} : ${br(mono(m, n))} = ${mono(k / m, i - n)}` : null).filter(Boolean).reverse().join("; ");
        const expr = `(${pa(r)}) : ${br(mono(m, n))}`;
        if (Math.random() < .4) {
          const v = pick([-3, -2, -1, 2, 3]), ans = val(q, v);
          return { text: `Böl: ${expr}. Alınan çoxhədlinin x = ${S(v)} olanda qiymətini tap.`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Hər həddi böl: ${parts}. Qismət: ${pa(q)}. x = ${S(v)} qoy: ${S(ans)}.` };
        }
        const k = rnd(0, q.length - 1);
        return { text: `Böl: ${expr}. Qismətdə ${k === 0 ? "sərbəst hədd neçədir?" : `“${xp(k)}” həddinin əmsalı neçədir?`}`, answer: q[k], show: S(q[k]), tol: 0.01,
          solution: `Hər həddi böl: ${parts}. Qismət: ${pa(q)}. Cavab: ${S(q[k])}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Sadələşdirmə üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const a = rnd(2, 9); let b; do b = rnd(2, 9); while (b === a); const c = rnd(2, 9), X = a - b - c, C = -a * b;
        const steps = [
          `1) (x + ${a})(x − ${b}) = ${poly([[1, "x²"], [a - b, "x"], [-a * b, ""]])}.`,
          `2) x(x + ${c}) = x² + ${c}x.`,
          `3) Fərq: ${poly([[X, "x"], [C, ""]])}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = pick([`1) (x + ${a})(x − ${b}) = x² − ${a * b}.`, `1) (x + ${a})(x − ${b}) = ${poly([[1, "x²"], [a - b, "x"], [a * b, ""]])}.`]);
        if (bad === 1) steps[1] = `2) x(x + ${c}) = x² + ${c}.`;
        if (bad === 2) steps[2] = `3) Fərq: ${poly([[a - b + c, "x"], [C, ""]])}.`;
        const text = h("div", {}, h("p", {}, `Sadələşdir: (x + ${a})(x − ${b}) − x(x + ${c}).`), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st.slice(3)))));
        const why = [`1-ci addım: (x + ${a})(x − ${b}) = x² − ${b}x + ${a}x − ${a * b} = ${poly([[1, "x²"], [a - b, "x"], [-a * b, ""]])}. Dörd hasilin hamısı lazımdır, ${a}·(−${b}) mənfidir.`,
          `2-ci addım: x həm x-ə, həm ${c}-ə vurulur: x(x + ${c}) = x² + ${c}x.`,
          `3-cü addım: çıxanda ${c}x-in işarəsi dəyişir: ${S(a - b)}x − ${c}x = ${poly([[X, "x"]])}. Düz cavab: ${poly([[X, "x"], [C, ""]])}.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Sahə, gəlir — ölçüləri çoxhədli olan kəmiyyətləri vur, standart şəklə sal.",
      gen() {
        if (Math.random() < .5) {
          const a = rnd(1, 9), b = rnd(1, 6); const r = [-a * b, a - b, 1];
          if (Math.random() < .5) {
            const v = rnd(b + 2, 20), ans = (v + a) * (v - b);
            return { text: `Kvadrat bağçanın tərəfi x m idi. Uzunluğunu ${a} m artırdılar, enini ${b} m azaltdılar. Yeni sahəni çoxhədli kimi yaz. x = ${v} olanda yeni sahə neçə m²-dir?`, answer: ans, unit: "m²", show: String(ans), tol: 0.01,
              solution: `Yeni sahə: (x + ${a})(x − ${b}) = ${pa(r)}. x = ${v}: ${v * v} ${a - b < 0 ? "−" : "+"} ${Math.abs((a - b) * v)} − ${a * b} = ${ans} m² (yoxla: ${v + a}·${v - b} = ${ans}).` };
          }
          return { text: `Kvadrat bağçanın tərəfi x m idi. Uzunluğunu ${a} m artırdılar, enini ${b} m azaltdılar. Yeni sahəni çoxhədli kimi standart şəkildə yaz. Sərbəst hədd neçədir?`, answer: -a * b, show: S(-a * b), tol: 0.01,
            solution: `(x + ${a})(x − ${b}) = x² − ${b}x + ${a}x − ${a * b} = ${pa(r)}. Sərbəst hədd: ${S(-a * b)}.` };
        }
        const p = pick([10, 12, 15, 20, 25]), n = pick([40, 50, 60, 80, 100]), k = rnd(1, 4);
        const r = [p * n, n - k * p, -k]; // (p + x)(n − kx)
        const ask = pick(["x", "x2", "v"]);
        const kx = k === 1 ? "x" : k + "x";
        const text = `Dükanda köynək ${p} manata satılır, gündə ${n} köynək alınır. Qiymət hər 1 manat artanda gündə ${k} köynək az alınır. Qiyməti x manat artırsaq, gündəlik gəlir (${p} + x)(${n} − ${kx}) manat olar. `;
        const exp = `(${p} + x)(${n} − ${kx}) = ${p * n} − ${p * k}x + ${n}x − ${kx}² = ${pa(r)}`;
        if (ask === "x") return { text: text + `Onu standart şəkildə yaz. “x” həddinin əmsalı neçədir?`, answer: r[1], show: S(r[1]), tol: 0.01, solution: `${exp}. x-in əmsalı: ${n} − ${p * k} = ${S(r[1])}.` };
        if (ask === "x2") return { text: text + `Onu standart şəkildə yaz. “x²” həddinin əmsalı neçədir?`, answer: -k, show: S(-k), tol: 0.01, solution: `${exp}. x²-nin əmsalı: ${S(-k)}.` };
        const v = rnd(1, 5), ans = val(r, v);
        return { text: text + `Qiymət ${v} manat artırılsa, gündəlik gəlir neçə manat olar?`, answer: ans, unit: "manat", show: String(ans), tol: 0.01,
          solution: `${exp}. x = ${v}: ${p + v}·${n - k * v} = ${ans} manat.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "coxhedliler", title: "Çoxhədlilər", fenn: "riyaziyyat", link: "dersler/coxhedliler.html",
      format: "Cavab ədəddir: əmsal işarəsi ilə (−3x²-nin əmsalı −3), dərəcə — tam ədəd. Hədd yoxdursa, onun əmsalı 0.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["standart", "standart", "topla", "topla", "vur1", "vur2", "vur2", "bol", "bol", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/coxhedliler.html")) b.push("dersler/coxhedliler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
