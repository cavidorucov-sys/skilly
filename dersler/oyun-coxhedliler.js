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

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes. BSİ-2 (15 Nov), q. 66: "(x − 1)(x + 2)(x + 3) çoxhədlisinin qüvvətini tapın" —
  // Fikrət chose 1 instead of 3: DİM says "qüvvət" for the degree, and the degree of a product is the SUM of the degrees.
  const { ae, again, num } = Oyun;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const lin = (a, b) => pa([b, a]);                                         // ax + b
  const fr = v => Number.isInteger(v) ? S(v) : (v < 0 ? "−" : "") + "1/2"; // x values: integers or ±1/2
  // square picture (side x) with a frame of width a on every side
  function frame(a, u) {
    const g = sv("svg", { viewBox: "0 0 260 200", class: "oy-svg", role: "img", "aria-label": `Tərəfi x ${u} olan kvadrat, ətrafında eni ${a} ${u} olan haşiyə` });
    g.append(sv("rect", { x: 50, y: 15, width: 170, height: 170, style: "fill:var(--accent-soft);stroke:var(--ink);stroke-width:2" }));
    g.append(sv("rect", { x: 80, y: 45, width: 110, height: 110, style: "fill:var(--sheet);stroke:var(--ink);stroke-width:2" }));
    g.append(sv("line", { x1: 80, y1: 140, x2: 190, y2: 140, style: "stroke:var(--ink);stroke-width:1;stroke-dasharray:3 3" }));
    g.append(sv("text", { x: 135, y: 136, "text-anchor": "middle", class: "oy-lbl" }, `x ${u}`));
    g.append(sv("line", { x1: 50, y1: 100, x2: 80, y2: 100, style: "stroke:var(--accent);stroke-width:2" }));
    g.append(sv("text", { x: 44, y: 104, "text-anchor": "end", class: "oy-lbl" }, `${a} ${u}`));
    return g;
  }

  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. degree ("qüvvət") of a product: the degrees of the factors add up (BSİ-2, q. 66)
    { tip: "qapali", gen: () => again(() => {
      if (Math.random() < .4) { // only linear factors, as in BSİ-2: (x − 1)(x + 2)(x + 3)
        const k = pick([3, 3, 4]), fs = Array.from({ length: k }, () => [nz(-7, 7), pick([1, 1, 1, 2, 3])]);
        const E = fs.reduce((r, f) => mul(r, f), [1]), T = E.filter(Boolean).length, L = E[k];
        const word = pick(["qüvvətini", "qüvvətini", "dərəcəsini"]);
        const w4 = L === 1 ? k - 1 : L, t4 = L === 1 ? `vurma işarələrinin sayı (${k - 1})` : `baş əmsal (${L})`;
        return mc(ae(k, [1, T, 2 ** k, w4]), { text: `${fs.map(f => "(" + pa(f) + ")").join("")} çoxhədlisinin ${word} tapın.`,
          solution: `“Qüvvət” — çoxhədlinin dərəcəsidir. ${k} birinci dərəcəli vuruq: baş hədlər ${fs.map(f => mono(f[1], 1)).join("·")} = ${mono(L, k)}, dərəcə 1${" + 1".repeat(k - 1)} = ${k}. (Açılmış şəkil: ${pa(E)}.) ` +
            `Tələlər: “hər vuruq birinci dərəcəlidir” (1), hədlərin sayı (${T}), açanda alınan hasillərin sayı (2${sup(k)} = ${2 ** k}), ${t4}.` });
      }
      const k = pick([2, 3, 3]), ds = Array.from({ length: k }, () => k === 2 ? rnd(2, 4) : rnd(1, 2));
      const cs = ds.map(d => d === 1 ? pick([1, 1, 2, 3]) : 1);
      const fs = ds.map((d, i) => "(" + poly([[cs[i], xp(d)], [nz(-7, 7), ""]]) + ")");
      const Sm = ds.reduce((s, d) => s + d, 0), M = Math.max(...ds), Pr = ds.reduce((s, d) => s * d, 1), C = cs.reduce((s, c) => s * c, 1);
      const word = pick(["qüvvətini", "qüvvətini", "dərəcəsini"]);
      return mc(ae(Sm, [M, Pr, k, 1]), { text: `${fs.join("")} çoxhədlisinin ${word} tapın.`,
        solution: `“Qüvvət” — çoxhədlinin dərəcəsidir. Açanda ən böyük hədd vuruqların baş hədlərinin hasilidir: ${ds.map((d, i) => mono(cs[i], d)).join("·")} = ${mono(C, Sm)}, çünki üstlər toplanır: ${ds.join(" + ")} = ${Sm}. ` +
          `Tələlər: ən böyük vuruğun dərəcəsi (${M}), dərəcələri vurmaq (${Pr}), vuruqların sayı (${k}), “hər vuruq birinci dərəcəlidir” (1).` });
    }) },
    // 2. subtraction: every sign of the subtrahend changes
    { tip: "qapali", gen: () => again(() => {
      const a = [nz(-9, 9), nz(-9, 9), nz(-5, 5)], b = [nz(-9, 9), nz(-9, 9), nz(-5, 5)];
      const r = add(a, b, -1); if (r.filter(Boolean).length < 2) return null;
      const w = [[a[0] + b[0], a[1] + b[1], a[2] - b[2]], [a[0] + b[0], a[1] - b[1], a[2] - b[2]], add(a, b, 1), add(b, a, -1)];
      return mc(ae(pa(r), w.map(pa)), { text: `(${pa(a)}) − (${pa(b)}) ifadəsini sadələşdirin.`,
        solution: `Mötərizənin qarşısında “−” var: ikinci çoxhədlinin HƏR həddinin işarəsi dəyişir: ${poly([...a.map((k, i) => [k, xp(i)]).reverse(), ...b.map((k, i) => [-k, xp(i)]).reverse()])} = ${pa(r)}. ` +
          `Tələlər: işarəni yalnız birinci həddə dəyişmək (${pa(w[0])}), sərbəst həddin işarəsini dəyişməmək (${pa(w[1])}), toplamaq (${pa(w[2])}), tərs çıxmaq (${pa(w[3])}).` });
    }) },
    // 3. (ax + b)(cx + d): four products, the middle ones are added
    { tip: "qapali", gen: () => again(() => {
      let a = pick([1, 2, 3]), c = pick([2, 3, 4, 5]); if (pick([0, 1])) [a, c] = [c, a];
      const b = nz(-7, 7), d = nz(-7, 7), mid = a * d + b * c; if (!mid || b + d === mid) return null;
      const r = [b * d, mid, a * c];
      const w = [[b * d, 0, a * c], [b * d, b + d, a * c], [-b * d, mid, a * c], [b * d, a * d - b * c, a * c]];
      return mc(ae(pa(r), w.map(pa)), { text: `(${lin(a, b)})(${lin(c, d)}) hasilini çoxhədli şəklində yazın.`,
        solution: `Dörd hasil: ${mono(a * c, 2)}, ${mono(a * d, 1)}, ${mono(b * c, 1)}, ${S(b * d)}. Orta hədlər: ${S(a * d)}x ${b * c < 0 ? "−" : "+"} ${Math.abs(b * c)}x = ${mono(mid, 1)}. Cavab: ${pa(r)}. ` +
          `Tələlər: orta hədləri itirmək (${pa(w[0])}), (x + m)(x + n) = x² + (m + n)x + mn düsturunu baş əmsal 1 olmayanda işlətmək (${pa(w[1])}), ${P(b)}·${P(d)} hasilinin işarəsi (${pa(w[2])}), orta hasillərdən birinin işarəsi (${pa(w[3])}).` });
    }) },
    // 4. simplify first, then substitute
    { tip: "qapali", gen: () => again(() => {
      const a = rnd(1, 9), b = rnd(1, 9), c = rnd(1, 9), v = pick([-3, -2, -1, 2, 3]); if (a === b) return null;
      const L = b - a + c, R = L * v - a * b; if (!L) return null;
      if (R !== (v - a) * (v + b) - v * (v - c)) return null;
      const w = [(b - a - c) * v - a * b, c * v - a * b, L * v + a * b, (a - b + c) * v - a * b];
      return mc(ae(R, w), { text: `(x − ${a})(x + ${b}) − x(x − ${c}) ifadəsinin x = ${S(v)} olduqda qiymətini tapın.`,
        solution: `(x − ${a})(x + ${b}) = ${pa([-a * b, b - a, 1])}; x(x − ${c}) = x² − ${c}x. Çıxanda işarələr dəyişir: ${pa([-a * b, b - a, 1])} − x² + ${c}x = ${pa([-a * b, L])}. x = ${S(v)}: ${S(L)}·${P(v)} − ${a * b} = ${S(R)}. ` +
          `Tələlər: “− x(x − ${c})” açanda ${c}x-in işarəsini dəyişməmək (${S(w[0])}), orta hədləri itirmək (${S(w[1])}), −${a}·${b} hasilinin işarəsi (${S(w[2])}), orta həddin işarəsi (${S(w[3])}).` });
    }) },
    // 5. division by a negative monomial
    { tip: "qapali", gen: () => again(() => {
      const m = -rnd(2, 6), n = rnd(1, 3), q = [1, nz(-6, 6), nz(-5, 5)], r = mul(Array(n).fill(0).concat([m]), q);
      const w = [pa([0, q[1], q[2]]), pa(q.map(k => -k)), poly(q.map((k, i) => [k, xp(i + n)]).reverse()), pa([-1, q[1], q[2]])];
      return mc(ae(pa(q), w), { text: `(${pa(r)}) : (${mono(m, n)}) qismətini tapın (x ≠ 0).`,
        solution: `Hər hədd ayrıca bölünür, əmsallar bölünür, üstlər çıxılır: ${r.map((k, i) => k ? `${br(mono(k, i))} : (${mono(m, n)}) = ${mono(k / m, i - n)}` : null).filter(Boolean).reverse().join("; ")}. Cavab: ${pa(q)}. ` +
          `Tələlər: ${mono(m, n)} : (${mono(m, n)}) = 0 yazmaq (${w[0]}), bölənin “−” işarəsini unutmaq (${w[1]}), üstləri çıxmamaq (${w[2]}), (−) : (−) = − yazmaq (${w[3]}).` });
    }) },
    // 6. area of a frame around a square picture (with a figure)
    { tip: "qapali", gen: () => again(() => {
      const a = rnd(1, 6), [what, u] = pick([["şəklin", "sm"], ["güzgünün", "sm"], ["hovuzun", "m"], ["xalçanın", "sm"]]);
      const R = [4 * a * a, 4 * a], w = [[4 * a * a, 4 * a, 1], [a * a, 2 * a], [0, 4 * a], [4 * a * a]];
      const [what2, gen2] = { "şəklin": ["haşiyə", "Haşiyənin"], "güzgünün": ["çərçivə", "Çərçivənin"], "hovuzun": ["cığır", "Cığırın"], "xalçanın": ["kənar zolaq", "Kənar zolağın"] }[what];
      return mc(ae(pa(R), w.map(pa)), { svg: frame(a, u),
        text: `Tərəfi x ${u} olan kvadrat ${what} ətrafında hər tərəfdən eni ${a} ${u} olan ${what2} var (şəklə bax). ${gen2} sahəsini ifadə edən çoxhədlini tapın.`,
        solution: `Böyük kvadratın tərəfi x + ${2 * a} (en hər iki tərəfdən: 2·${a}). Sahə fərqi: (x + ${2 * a})² − x² = x² + ${4 * a}x + ${4 * a * a} − x² = ${pa(R)}. ` +
          `Tələlər: bütün sahəni yazmaq (${pa(w[0])}), eni bir dəfə əlavə etmək: (x + ${a})² − x² (${pa(w[1])}), künclərdəki ${a}×${a} kvadratları unutmaq (${pa(w[2])}), (x + ${2 * a})² = x² + ${4 * a * a} yazmaq (${pa(w[3])}).` });
    }) },
    // 7. coded: one coefficient of a product (only the products that give this power)
    { tip: "kod", gen: () => again(() => {
      const p = nz(-4, 4), q = nz(-7, 7), t = pick([1, 1, 2, 3]), r = nz(-6, 6), s = nz(-6, 6);
      const A = [q, p], B = [s, r, t], R = mul(A, B), k = pick([1, 2]);
      if (!R[k]) return null;
      const how = k === 2 ? `${mono(p, 1)}·${br(mono(r, 1))} + ${P(q)}·${br(mono(t, 2))} = ${mono(p * r, 2)} ${q * t < 0 ? "−" : "+"} ${mono(Math.abs(q * t), 2)}` : `${mono(p, 1)}·${P(s)} + ${P(q)}·${br(mono(r, 1))} = ${mono(p * s, 1)} ${q * r < 0 ? "−" : "+"} ${mono(Math.abs(q * r), 1)}`;
      return { text: `(${pa(A)})(${pa(B)}) hasilinin standart şəklində “${xp(k)}” həddinin əmsalını tapın.`, answer: R[k], show: S(R[k]), tol: 1e-6,
        solution: `Bütün hasili açmaq lazım deyil — yalnız ${xp(k)} verən hasilləri götür: ${how}. Əmsal: ${S(R[k])}. (Tam hasil: ${pa(R)}.)` };
    }) },
    // 8. coded: the sum of the coefficients = the value at x = 1
    { tip: "kod", gen: () => again(() => {
      const A = [nz(-6, 6), nz(-6, 6), 1], B = [nz(-7, 7), pick([1, 2, 3])], R = mul(A, B), ans = val(R, 1);
      if (!ans) return null;
      return { text: `(${pa(A)})(${pa(B)}) hasilini standart şəklə saldıqda alınan çoxhədlinin əmsallarının cəmini tapın (sərbəst hədd də daxildir).`, answer: ans, show: S(ans), tol: 1e-6,
        solution: `Əmsalların cəmi = x = 1 olanda çoxhədlinin qiyməti: (${S(val(A, 1))})·(${S(val(B, 1))}) = ${S(ans)}. Açıb yoxla: ${pa(R)} → ${R.slice().reverse().map(S).join(" + ").replace(/\+ −/g, "− ")} = ${S(ans)}. Tələ: işarəsiz cəmləmək.` };
    }) },
    // 9. coded: a parameter from a given coefficient
    { tip: "kod", gen: () => again(() => {
      const a = nz(-8, 8), c = nz(-9, 9), d = nz(-6, 6), R = mul([c, a, 1], [d, 1]);
      if (pick([0, 1])) {
        const K = R[2]; if (!K) return null;
        return { text: `(x² + ax ${c < 0 ? "−" : "+"} ${Math.abs(c)})(${lin(1, d)}) hasilinin standart şəklində x²-nin əmsalı ${S(K)} ədədinə bərabərdir. a-nı tapın.`, answer: a, show: S(a), tol: 1e-6,
          solution: `x² iki hasildən gəlir: x²·${P(d)} və ax·x. Əmsal: ${S(d)} + a = ${S(K)}, a = ${S(a)}. Tələ: yalnız ax·x hasilini görmək (a = ${S(K)}).` };
      }
      const K = R[1];
      return { text: `(x² + ax ${c < 0 ? "−" : "+"} ${Math.abs(c)})(${lin(1, d)}) hasilinin standart şəklində x-in əmsalı ${S(K)} ədədinə bərabərdir. a-nı tapın.`, answer: a, show: S(a), tol: 1e-6,
        solution: `x iki hasildən gəlir: ax·${P(d)} və ${S(c)}·x. Əmsal: ${d === 1 ? "" : d === -1 ? "−" : S(d)}a ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${S(K)}, ${d === 1 ? "" : d === -1 ? "−" : S(d)}a = ${S(K - c)}, a = ${S(a)}.` };
    }) },
    // 10. written: simplify (x² cancels), then substitute
    { tip: "yazili", gen: () => again(() => {
      const a = rnd(1, 9), b = rnd(1, 9), c = rnd(1, 9), d = rnd(1, 9), v = pick([-3, -2, -1, 2, 3, 0.5, -0.5]);
      const L = 2 * b - a - 2 * d + 2 * c, K = 2 * c * d - a * b, R = L * v + K; if (!L) return null;
      if (Math.abs(R - ((2 * v - a) * (v + b) - 2 * (v - c) * (v + d))) > 1e-9) return null;
      const F = [-a * b, 2 * b - a, 2], G = [-2 * c * d, 2 * (d - c), 2];
      return { text: `İfadəni sadələşdirin və x = ${fr(v)} olduqda qiymətini tapın: (2x − ${a})(x + ${b}) − 2(x − ${c})(x + ${d}). Həlli addım-addım yazın.`, answer: R, show: num(R), tol: 1e-6,
        solution: `1) (2x − ${a})(x + ${b}) = 2x² + ${2 * b}x − ${a}x − ${a * b} = ${pa(F)}. 2) 2(x − ${c})(x + ${d}) = 2(${pa([-c * d, d - c, 1])}) = ${pa(G)}. ` +
          `3) Çıxanda bütün işarələr dəyişir: ${pa(F)} ${poly([[-2, "x²"], [-G[1], "x"], [-G[0], ""]]).replace(/^−/, "− ").replace(/^(?=\d|x)/, "+ ")} = ${pa([K, L])}. 4) x = ${fr(v)}: ${S(L)}·${v < 0 ? "(" + fr(v) + ")" : fr(v)} ${K < 0 ? "−" : "+"} ${Math.abs(K)} = ${num(R)}.` };
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT));
  window.__imtahan = IMT;

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "coxhedliler", title: "Çoxhədlilər", fenn: "riyaziyyat", link: "dersler/coxhedliler.html",
      format: "Cavab ədəddir: əmsal işarəsi ilə (−3x²-nin əmsalı −3), dərəcə — tam ədəd. Hədd yoxdursa, onun əmsalı 0.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["standart", "standart", "topla", "topla", "vur1", "vur2", "vur2", "bol", "bol", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/coxhedliler.html")) b.push("dersler/coxhedliler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
