// Cəbri ifadələr, sadələşdirmə — mastery game levels (value of an expression, monomials, like terms, brackets,
// "simplify first", find the mistake, word problems) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nz = (a, b) => { let v; do v = rnd(a, b); while (!v); return v; };   // non-zero random integer
  const S = n => n < 0 ? "−" + (-n) : String(n);                           // number with a real minus sign
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);                     // substituted number, bracketed if negative
  const D = n => S(n).replace(".", ",");                                     // decimal with a comma
  const sup = n => n === 1 ? "" : String(n).split("").map(d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]).join("");
  // polynomial from [coef, "x²"|"x"|""] terms, order kept: [[5,"x"],[-3,"y"],[2,""]] → "5x − 3y + 2"
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  // monomial c·x^p·y^q
  const vars = (p, q) => (p ? "x" + sup(p) : "") + (q ? "y" + sup(q) : "");
  const mono = (c, p, q) => { const v = vars(p, q); return v ? (c === 1 ? v : c === -1 ? "−" + v : S(c) + v) : S(c); };
  const br = s => s.startsWith("−") ? "(" + s + ")" : s;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  const levels = [
    { id: "qiymet", ad: "İfadənin qiyməti", izah: "Dəyişənin yerinə ədədi qoy (mənfi ədədi mötərizəyə al) və əməllər sırası ilə hesabla.",
      gen() {
        const kind = pick(["kv", "kv", "iki", "hasil"]);
        if (kind === "kv") {
          const a = nz(-4, 5), b = nz(-9, 9), c = rnd(-9, 9), v = nz(-5, 5), ans = a * v * v + b * v + c;
          return { text: `${poly([[a, "x²"], [b, "x"], [c, ""]])} ifadəsinin x = ${S(v)} olanda qiymətini tap.`, answer: ans, show: S(ans), tol: 0.01,
            solution: `x = ${S(v)} qoy: x² = ${P(v)}² = ${v * v}. ${S(a)}·${v * v} = ${S(a * v * v)}; ${S(b)}·${P(v)} = ${S(b * v)}; sərbəst hədd ${S(c)}. Cəm: ${S(a * v * v)} + ${P(b * v)} + ${P(c)} = ${S(ans)}.` };
        }
        if (kind === "iki") {
          const k = nz(-4, 4), m = nz(-6, 6), n = nz(-9, 9), A = nz(-5, 5), B = nz(-5, 5), ans = k * A * A + m * A * B + n * B;
          return { text: `${poly([[k, "a²"], [m, "ab"], [n, "b"]])} ifadəsinin a = ${S(A)}, b = ${S(B)} olanda qiymətini tap.`, answer: ans, show: S(ans), tol: 0.01,
            solution: `a² = ${P(A)}² = ${A * A}, ab = ${P(A)}·${P(B)} = ${S(A * B)}. ${S(k)}·${A * A} = ${S(k * A * A)}; ${S(m)}·${P(A * B)} = ${S(m * A * B)}; ${S(n)}·${P(B)} = ${S(n * B)}. Cəm: ${S(ans)}.` };
        }
        const p = nz(-7, 7), q = nz(-7, 7), c = nz(-6, 6), v = nz(-6, 6), ans = (v + p) * (v + q) - c * v;
        return { text: `(${poly([[1, "x"], [p, ""]])})(${poly([[1, "x"], [q, ""]])}) ${c > 0 ? "−" : "+"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}x ifadəsinin x = ${S(v)} olanda qiymətini tap.`, answer: ans, show: S(ans), tol: 0.01,
          solution: `Mötərizələr: ${S(v)} ${p < 0 ? "−" : "+"} ${Math.abs(p)} = ${S(v + p)}, ${S(v)} ${q < 0 ? "−" : "+"} ${Math.abs(q)} = ${S(v + q)}; hasil ${P(v + p)}·${P(v + q)} = ${S((v + p) * (v + q))}. Sonra ${poly([[-c, "x"]])} = ${S(-c)}·${P(v)} = ${S(-c * v)}. Cəm: ${S((v + p) * (v + q))} + ${P(-c * v)} = ${S(ans)}.` };
      } },
    { id: "birhedli", ad: "Birhədlinin standart şəkli", izah: "Əmsalları vur, eyni dəyişənin üstlərini topla. Dərəcə — bütün dəyişənlərin üstlərinin cəmi.",
      gen() {
        const ask = pick(["coef", "deg"]), pw = Math.random() < .35;
        let text, c, p, q, steps;
        if (pw) {
          const c0 = nz(-3, 3), p0 = rnd(1, 4), q0 = rnd(1, 3), n = c0 === 1 || c0 === -1 ? rnd(2, 4) : rnd(2, 3);
          c = c0 ** n; p = p0 * n; q = q0 * n;
          text = `(${mono(c0, p0, q0)})${sup(n)}`;
          steps = `Qüvvətə yüksəlt: əmsal ${P(c0)}${sup(n)} = ${S(c)}, üstlər ${n}-ə vurulur: x${sup(p0)} → x${sup(p)}, y${sup(q0)} → y${sup(q)}.`;
        } else {
          const a = nz(-7, 7), b = nz(-6, 6), p1 = rnd(1, 4), p2 = rnd(1, 4), q1 = rnd(0, 3), q2 = rnd(q1 ? 0 : 1, 3);
          c = a * b; p = p1 + p2; q = q1 + q2;
          text = `${br(mono(a, p1, q1))} · ${br(mono(b, p2, q2))}`;
          steps = `Əmsallar: ${S(a)}·${P(b)} = ${S(c)}. Üstlər toplanır: x${sup(p1)}·x${sup(p2)} = x${sup(p)}` + (q ? `, y-in üstü ${q1} + ${q2} = ${q}` : "") + ".";
        }
        const std = mono(c, p, q);
        if (ask === "coef") return { text: `Birhədlini standart şəklə sal: ${text}. Əmsalı neçədir?`, answer: c, show: S(c), tol: 0.01, solution: `${steps} Standart şəkil: ${std}. Əmsal: ${S(c)}.` };
        return { text: `Birhədlini standart şəklə sal: ${text}. Dərəcəsi neçədir?`, answer: p + q, show: String(p + q), tol: 0.01, solution: `${steps} Standart şəkil: ${std}. Dərəcə = üstlərin cəmi: ${p} + ${q} = ${p + q}.` };
      } },
    { id: "oxsar", ad: "Oxşar hədlər", izah: "Hərf hissəsi eyni olan hədlər oxşardır — əmsallarını topla. Hərf hissəsi fərqli olanlar birləşmir.",
      gen() {
        const set = pick([["x", "y", ""], ["a", "b", ""], ["x²", "x", ""], ["ab", "a", "b"]]);
        const terms = [];
        set.forEach(v => { const k = v ? rnd(1, 3) : rnd(0, 1); for (let i = 0; i < k; i++) terms.push([nz(-9, 9), v]); });
        while (terms.length < 5) terms.push([nz(-9, 9), pick(set.slice(0, 2))]);
        shuffle(terms);
        const sum = v => terms.filter(t => t[1] === v).reduce((s, t) => s + t[0], 0);
        const res = set.map(v => [sum(v), v]);
        const grp = set.map(v => { const g = terms.filter(t => t[1] === v); return g.length ? `${poly(g)} = ${poly([[sum(v), v]])}` : null; }).filter(Boolean).join("; ");
        const base = `Oxşar hədləri islah et: ${poly(terms)}.`;
        if (Math.random() < .55) {
          const cand = set.filter(v => v && terms.filter(t => t[1] === v).length >= 2), v = pick(cand.length ? cand : set.filter(Boolean));
          return { text: `${base} Sadələşmiş ifadədə “${v}” həddinin əmsalı neçədir?`,
            answer: sum(v), show: S(sum(v)), tol: 0.01, solution: `Qruplaşdır: ${grp}. Nəticə: ${poly(res)}. “${v}” həddinin əmsalı ${S(sum(v))}.` };
        }
        const letters = [...new Set(set.join("").replace(/²/g, "").split(""))];
        const val = {}; letters.forEach(l => { val[l] = nz(-4, 4); });
        const ev = v => v === "" ? 1 : v === "x²" ? val.x * val.x : v.split("").reduce((s, l) => s * val[l], 1);
        const ans = res.reduce((s, [c, v]) => s + c * ev(v), 0);
        return { text: `${base} Sonra ${letters.map(l => `${l} = ${S(val[l])}`).join(", ")} olanda qiymətini tap.`, answer: ans, show: S(ans), tol: 0.01,
          solution: `Əvvəl sadələşdir: ${grp}. Nəticə: ${poly(res)}. İndi ${letters.map(l => `${l} = ${S(val[l])}`).join(", ")} qoy: ${res.filter(r => r[0]).map(([c, v]) => v ? `${P(c)}·${P(ev(v))}` : P(c)).join(" + ") || "0"} = ${S(ans)}.` };
      } },
    { id: "moterize", ad: "Mötərizələri aç", izah: "Mötərizə qarşısındakı ədədi hər həddə vur. Qarşısında “−” varsa, içindəki bütün işarələr dəyişir.",
      gen() {
        if (Math.random() < .25) { // x(x + p) − (x² + qx + r): x² cancels
          const p = nz(-8, 8), q = nz(-8, 8), r = nz(-9, 9), v = nz(-6, 6), X = p - q, ans = X * v - r;
          return { text: `x(${poly([[1, "x"], [p, ""]])}) − (${poly([[1, "x²"], [q, "x"], [r, ""]])}) ifadəsini sadələşdir və x = ${S(v)} olanda qiymətini tap.`, answer: ans, show: S(ans), tol: 0.01,
            solution: `x(${poly([[1, "x"], [p, ""]])}) = ${poly([[1, "x²"], [p, "x"]])}; −(${poly([[1, "x²"], [q, "x"], [r, ""]])}) = ${poly([[-1, "x²"], [-q, "x"], [-r, ""]])}. x² hədləri silinir: ${poly([[X, "x"], [-r, ""]])}. x = ${S(v)}: ${S(X)}·${P(v)} ${-r < 0 ? "−" : "+"} ${Math.abs(r)} = ${S(ans)}.` };
        }
        const k1 = nz(-6, 6), a1 = nz(-7, 7), b1 = nz(-9, 9), s = pick([-1, -1, 1]), k2 = rnd(1, 6), a2 = nz(-7, 7), b2 = nz(-9, 9);
        const X = k1 * a1 + s * k2 * a2, C = k1 * b1 + s * k2 * b2;
        const expr = `${k1 === 1 ? "" : k1 === -1 ? "−" : S(k1)}(${poly([[a1, "x"], [b1, ""]])}) ${s < 0 ? "−" : "+"} ${k2 === 1 ? "" : k2}(${poly([[a2, "x"], [b2, ""]])})`;
        const open = `${poly([[k1 * a1, "x"], [k1 * b1, ""], [s * k2 * a2, "x"], [s * k2 * b2, ""]])} = ${poly([[X, "x"], [C, ""]])}`;
        const ask = pick(["x", "c", "v"]);
        if (ask === "x") return { text: `${expr} ifadəsini sadələşdir. x-in əmsalı neçədir?`, answer: X, show: S(X), tol: 0.01, solution: `Mötərizələri aç: ${open}. x-in əmsalı: ${S(k1 * a1)} + ${P(s * k2 * a2)} = ${S(X)}.` };
        if (ask === "c") return { text: `${expr} ifadəsini sadələşdir. Sərbəst hədd (x-siz ədəd) neçədir?`, answer: C, show: S(C), tol: 0.01, solution: `Mötərizələri aç: ${open}. Sərbəst hədd: ${S(k1 * b1)} + ${P(s * k2 * b2)} = ${S(C)}.` };
        const v = nz(-5, 5), ans = X * v + C;
        return { text: `${expr} ifadəsini sadələşdir və x = ${S(v)} olanda qiymətini tap.`, answer: ans, show: S(ans), tol: 0.01, solution: `Mötərizələri aç: ${open}. x = ${S(v)}: ${S(X)}·${P(v)} + ${P(C)} = ${S(ans)}.` };
      } },
    { id: "akilli", ad: "Əvvəl sadələşdir", izah: "Dəyişənin qiyməti “narahat” ədəddir. Birbaşa hesablama — əvvəl sadələşdir, çox şey silinəcək.",
      gen() {
        if (Math.random() < .5) {
          const a1 = rnd(1, 6); let a2; do a2 = rnd(1, 6); while (a2 === a1); const t = rnd(1, 2), k1 = a2 * t, k2 = a1 * t;
          const b1 = nz(-9, 9), b2 = nz(-9, 9), ans = k1 * b1 - k2 * b2, x = pick([2027, 1999, 2026, -157, 3.7, -4.3, 12.5, 1001]);
          return { text: `${k1}(${poly([[a1, "x"], [b1, ""]])}) − ${k2}(${poly([[a2, "x"], [b2, ""]])}) ifadəsinin x = ${D(x)} olanda qiymətini tap.`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Mötərizələri aç: ${poly([[k1 * a1, "x"], [k1 * b1, ""], [-k2 * a2, "x"], [-k2 * b2, ""]])}. ${k1 * a1}x − ${k2 * a2}x = 0 — x silinir! Qalır: ${S(k1 * b1)} ${-k2 * b2 < 0 ? "−" : "+"} ${Math.abs(k2 * b2)} = ${S(ans)}. Qiymət x-dən asılı deyil.` };
        }
        const m = rnd(2, 7), n = rnd(1, 6), r = rnd(1, 6), A = pick([2027, 1999, 368, -145, 7.3]), B = nz(-5, 5), ans = m * (n + r) * B;
        return { text: `${m}(a + ${n === 1 ? "" : n}b) − ${m}(a − ${r === 1 ? "" : r}b) ifadəsinin a = ${D(A)}, b = ${S(B)} olanda qiymətini tap.`, answer: ans, show: S(ans), tol: 0.01,
          solution: `Mötərizələri aç: ${m}a + ${m * n}b − ${m}a + ${m * r}b = ${m * (n + r)}b — a silinir. b = ${S(B)}: ${m * (n + r)}·${P(B)} = ${S(ans)}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Sadələşdirmə üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const k = rnd(2, 6), a = rnd(1, 7), b = rnd(1, 9), m = rnd(2, 6), c = rnd(1, 7), d = rnd(1, 9);
        const X = k * a - m * c, C = k * b + m * d;
        const expr = `${k}(${poly([[a, "x"], [b, ""]])}) − ${m}(${poly([[c, "x"], [-d, ""]])})`;
        const steps = [
          `1) ${k}(${poly([[a, "x"], [b, ""]])}) = ${poly([[k * a, "x"], [k * b, ""]])}.`,
          `2) −${m}(${poly([[c, "x"], [-d, ""]])}) = ${poly([[-m * c, "x"], [m * d, ""]])}.`,
          `3) Cəm: ${poly([[X, "x"], [C, ""]])}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `1) ${k}(${poly([[a, "x"], [b, ""]])}) = ${poly([[k * a, "x"], [b, ""]])}.`;
        if (bad === 1) steps[1] = `2) −${m}(${poly([[c, "x"], [-d, ""]])}) = ${poly([[-m * c, "x"], [-m * d, ""]])}.`;
        if (bad === 2) steps[2] = `3) Cəm: ${poly([[k * a + m * c, "x"], [C, ""]])}.`;
        const text = h("div", {}, h("p", {}, `Sadələşdir: ${expr}.`), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st.slice(3)))));
        const why = [`1-ci addım: ${k} hər iki həddə vurulmalıdır: ${k}·${b} = ${k * b}, ${b} yox.`,
          `2-ci addım: “−${m}” ikinci həddə də vurulur: −${m}·(−${d}) = +${m * d}. İşarə dəyişməli idi.`,
          `3-cü addım: x-li hədlər ${k * a}x − ${m * c}x = ${poly([[X, "x"]])}, toplamaq yox, çıxmaq lazımdır. Düz cavab: ${poly([[X, "x"], [C, ""]])}.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Mətndən ifadə qur, sadələşdir, sonra ədədi qoy.",
      gen() {
        const kind = pick(["alis", "yas", "perim", "perimk"]);
        if (kind === "alis") {
          const n = rnd(2, 9), m = rnd(2, 9), a = rnd(1, 3), v = rnd(a + 1, 9), ans = (n + m) * v - m * a;
          return { text: `Bir dəftər x manatdır, qələm isə dəftərdən ${a} manat ucuzdur. Aysel ${n} dəftər və ${m} qələm aldı. Ödənişi ifadə ilə yaz, sadələşdir və x = ${v} olanda hesabla. Neçə manat ödədi?`, answer: ans, unit: "manat", show: String(ans), tol: 0.01,
            solution: `Ödəniş: ${n}x + ${m}(x − ${a}) = ${n}x + ${m}x − ${m * a} = ${n + m}x − ${m * a}. x = ${v}: ${n + m}·${v} − ${m * a} = ${ans} manat.` };
        }
        if (kind === "yas") {
          const k = rnd(3, 4), t = rnd(2, 9), v = rnd(8, 14), ans = (k + 1) * v + 2 * t;
          return { text: `Fikrət x yaşındadır, atası ondan ${k} dəfə böyükdür. ${t} il sonra onların yaşlarının cəmi nə qədər olacaq? İfadə qur və x = ${v} üçün hesabla.`, answer: ans, unit: "yaş", show: String(ans), tol: 0.01,
            solution: `${t} il sonra: Fikrət x + ${t}, atası ${k}x + ${t}. Cəm: (x + ${t}) + (${k}x + ${t}) = ${k + 1}x + ${2 * t}. x = ${v}: ${k + 1}·${v} + ${2 * t} = ${ans}.` };
        }
        const a = rnd(1, 9), b = rnd(1, 5), v = rnd(b + 1, 12), X = 6, C = 2 * a - 2 * b;
        const text = `Düzbucaqlının uzunluğu (x + ${a}) sm, eni (2x − ${b}) sm-dir. `;
        const sol = `P = 2((x + ${a}) + (2x − ${b})) = 2(${poly([[3, "x"], [a - b, ""]])}) = ${poly([[X, "x"], [C, ""]])}`;
        if (kind === "perimk") {
          return { text: text + `Perimetri x-lə ifadə et və sadələşdir. Alınan ifadədə sərbəst hədd neçədir?`, answer: C, show: S(C), tol: 0.01, solution: sol + `. Sərbəst hədd: ${S(C)}.` };
        }
        const ans = X * v + C;
        return { text: text + `x = ${v} olanda perimetr neçə sm-dir?`, answer: ans, unit: "sm", show: String(ans), tol: 0.01, solution: sol + `. x = ${v}: 6·${v} ${C < 0 ? "−" : "+"} ${Math.abs(C)} = ${ans} sm.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "cebri-ifadeler", title: "Cəbri ifadələr, sadələşdirmə", fenn: "riyaziyyat", link: "dersler/cebri-ifadeler.html",
      format: "Cavab ədəddir: tam 14, mənfi −7. Əmsal soruşulursa, işarəsi ilə yaz (−5x-in əmsalı −5). Hədd yoxdursa, əmsalı 0.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["qiymet", "qiymet", "birhedli", "oxsar", "oxsar", "moterize", "moterize", "akilli", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/cebri-ifadeler.html")) b.push("dersler/cebri-ifadeler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
