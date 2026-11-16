// Müxtəsər vurma düsturları — mastery game levels ((a ± b)², a² − b², cubes, quick computation, perfect square
// and a + b / ab tricks, find the mistake, word problems) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nz = (a, b) => { let v; do v = rnd(a, b); while (!v); return v; };
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const sg = n => n < 0 ? "−" : "+";
  const big = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");          // 10 609 → readable; parse() ignores spaces

  const levels = [
    { id: "kvadrat", ad: "Cəmin və fərqin kvadratı", izah: "(a ± b)² = a² ± 2ab + b². Ortadakı 2ab-ni unutma!",
      gen() {
        const kind = pick(["ac", "ac", "xy", "tam"]);
        if (kind === "ac") {
          const a = rnd(1, 6), b = nz(-9, 9), r = [b * b, 2 * a * b, a * a];
          const k = pick([0, 1, 1, 2]), names = ["Sərbəst hədd neçədir?", "“x” həddinin əmsalı neçədir?", "“x²” həddinin əmsalı neçədir?"];
          const ax = a === 1 ? "x" : a + "x";
          return { text: `(${ax} ${sg(b)} ${Math.abs(b)})² ifadəsini çoxhədli şəklində yaz. ${names[k]}`, answer: r[k], show: S(r[k]), tol: 0.01,
            solution: `${a === 1 ? "x²" : `(${ax})²`} ${sg(b)} 2·${ax}·${Math.abs(b)} + ${Math.abs(b)}² = ${poly([[a * a, "x²"], [2 * a * b, "x"], [b * b, ""]])}. Cavab: ${S(r[k])}.` };
        }
        if (kind === "xy") {
          const a = rnd(1, 5), b = nz(-6, 6), ax = a === 1 ? "x" : a + "x", by = Math.abs(b) === 1 ? "y" : Math.abs(b) + "y";
          return { text: `(${ax} ${sg(b)} ${by})² ifadəsini açanda “xy” həddinin əmsalı neçə olur?`, answer: 2 * a * b, show: S(2 * a * b), tol: 0.01,
            solution: `Orta hədd: ${sg(b) === "−" ? "−" : ""}2·${ax}·${by} = ${poly([[2 * a * b, "xy"]])}. Tam: ${poly([[a * a, "x²"], [2 * a * b, "xy"], [b * b, "y²"]])}. Cavab: ${S(2 * a * b)}.` };
        }
        // tam kvadrat: x² ± kx + c = (x ± m)²
        const m = rnd(2, 12), s = pick([1, -1]);
        if (Math.random() < .5) return { text: `x² ${sg(s)} ${2 * m}x + c ifadəsi tam kvadrat olsun. c = ?`, answer: m * m, show: String(m * m), tol: 0.01,
          solution: `2·x·m = ${2 * m}x → m = ${m}. Deməli (x ${sg(s)} ${m})² = x² ${sg(s)} ${2 * m}x + ${m * m}. c = ${m * m}.` };
        return { text: `x² − kx + ${m * m} ifadəsi tam kvadratdır və k > 0. k = ?`, answer: 2 * m, show: String(2 * m), tol: 0.01,
          solution: `${m * m} = ${m}², deməli (x − ${m})² = x² − 2·${m}·x + ${m * m} = x² − ${2 * m}x + ${m * m}. k = ${2 * m}.` };
      } },
    { id: "ferq", ad: "Kvadratlar fərqi", izah: "a² − b² = (a − b)(a + b). Mötərizələr yalnız işarə ilə fərqlənirsə — hasil kvadratlar fərqidir.",
      gen() {
        const kind = pick(["ac", "xy", "xy", "dord"]);
        if (kind === "ac") {
          const a = rnd(1, 7), b = rnd(1, 9), ax = a === 1 ? "x" : a + "x", v = nz(-4, 4), ans = a * a * v * v - b * b;
          if (Math.random() < .5) return { text: `(${ax} − ${b})(${ax} + ${b}) ifadəsini çoxhədli şəklində yaz. Sərbəst hədd neçədir?`, answer: -b * b, show: S(-b * b), tol: 0.01,
            solution: `Kvadratlar fərqi: ${a === 1 ? "x²" : `(${ax})²`} − ${b}² = ${poly([[a * a, "x²"], [-b * b, ""]])}. Orta hədd yoxdur. Sərbəst hədd: ${S(-b * b)}.` };
          return { text: `(${ax} − ${b})(${ax} + ${b}) ifadəsinin x = ${S(v)} olanda qiymətini tap.`, answer: ans, show: S(ans), tol: 0.01,
            solution: `= ${poly([[a * a, "x²"], [-b * b, ""]])}. x² = ${v * v}: ${a * a}·${v * v} − ${b * b} = ${S(ans)}. (Yoxla: ${S(a * v - b)}·${S(a * v + b)} = ${S(ans)}.)` };
        }
        if (kind === "xy") { // x − y and x² − y² given
          const d = nz(-9, 9), sm = nz(-15, 15), ask = Math.random() < .5;
          if (ask) return { text: `x − y = ${S(d)} və x² − y² = ${S(d * sm)}. x + y = ?`, answer: sm, show: S(sm), tol: 0.01,
            solution: `x² − y² = (x − y)(x + y) → ${S(d * sm)} = ${S(d)}·(x + y) → x + y = ${S(d * sm)} : ${P(d)} = ${S(sm)}.` };
          return { text: `x + y = ${S(sm)} və x − y = ${S(d)}. x² − y² = ?`, answer: d * sm, show: S(d * sm), tol: 0.01,
            solution: `x² − y² = (x − y)(x + y) = ${S(d)}·${P(sm)} = ${S(d * sm)}.` };
        }
        const a = rnd(1, 4), v = rnd(2, 4), ans = v ** 4 - a ** 4;
        return { text: `(x − ${a})(x + ${a})(x² + ${a * a}) ifadəsinin x = ${v} olanda qiymətini tap.`, answer: ans, show: String(ans), tol: 0.01,
          solution: `(x − ${a})(x + ${a}) = x² − ${a * a}; (x² − ${a * a})(x² + ${a * a}) = x⁴ − ${a ** 4}. x = ${v}: ${v ** 4} − ${a ** 4} = ${ans}.` };
      } },
    { id: "kub", ad: "Kublar", izah: "(a ± b)³ = a³ ± 3a²b + 3ab² ± b³;  a³ ± b³ = (a ± b)(a² ∓ ab + b²).",
      gen() {
        const kind = pick(["kub", "kub", "cem", "st"]);
        if (kind === "kub") {
          const b = nz(-5, 5), r = [b ** 3, 3 * b * b, 3 * b, 1], k = rnd(0, 2), names = ["Sərbəst hədd neçədir?", "“x” həddinin əmsalı neçədir?", "“x²” həddinin əmsalı neçədir?"];
          return { text: `(x ${sg(b)} ${Math.abs(b)})³ ifadəsini çoxhədli şəklində yaz. ${names[k]}`, answer: r[k], show: S(r[k]), tol: 0.01,
            solution: `(a ${sg(b)} b)³ = a³ ${sg(b)} 3a²b + 3ab² ${sg(b)} b³, a = x, b = ${Math.abs(b)}: ${poly([[1, "x³"], [3 * b, "x²"], [3 * b * b, "x"], [b ** 3, ""]])}. Cavab: ${S(r[k])}.` };
        }
        if (kind === "cem") { // x³ ± b³ = (x ± b)(x² ∓ bx + b²)
          const b = rnd(1, 6), s = pick([1, -1]), askX = Math.random() < .5;
          const text = `x³ ${sg(s)} ${b ** 3} = (x ${sg(s)} ${b})(x² + kx + m). ${askX ? "k" : "m"} = ?`;
          const ans = askX ? -s * b : b * b;
          return { text, answer: ans, show: S(ans), tol: 0.01,
            solution: `${b ** 3} = ${b}³. Kubların ${s > 0 ? "cəmi" : "fərqi"}: x³ ${sg(s)} ${b}³ = (x ${sg(s)} ${b})(x² ${sg(-s)} ${b === 1 ? "" : b}x + ${b * b}). k = ${S(-s * b)}, m = ${b * b}. Cavab: ${S(ans)}.` };
        }
        // a + b = s, ab = p → a³ + b³ = s³ − 3ps
        let x, y; do { x = nz(-6, 6); y = nz(-6, 6); } while (x + y === 0); const s = x + y, p = x * y, ans = x ** 3 + y ** 3;
        return { text: `a + b = ${S(s)}, ab = ${S(p)}. a³ + b³ = ?`, answer: ans, show: S(ans), tol: 0.01,
          solution: `(a + b)³ = a³ + b³ + 3ab(a + b), deməli a³ + b³ = (a + b)³ − 3ab(a + b) = ${P(s)}³ − 3·${P(p)}·${P(s)} = ${S(s ** 3)} − ${P(3 * p * s)} = ${S(ans)}.` };
      } },
    { id: "tez", ad: "Tez hesabla", izah: "Ədədi “dəyirmi ədəd ± kiçik ədəd” şəklində yaz və düsturu tətbiq et. Kalkulyator yoxdur!",
      gen() {
        const kind = pick(["kv", "kv", "hasil", "fərq"]);
        if (kind === "kv") {
          const B = pick([20, 30, 40, 50, 60, 70, 80, 90, 100, 100, 200, 300, 1000]), d = rnd(1, B >= 100 ? 9 : 3), s = pick([1, -1]), N = B + s * d, ans = N * N;
          return { text: `Düsturla hesabla: ${N}².`, answer: ans, show: big(ans), tol: 0.01,
            solution: `${N} = ${B} ${sg(s)} ${d}. (${B} ${sg(s)} ${d})² = ${big(B * B)} ${sg(s)} 2·${B}·${d} + ${d * d} = ${big(B * B)} ${sg(s)} ${big(2 * B * d)} + ${d * d} = ${big(ans)}.` };
        }
        if (kind === "hasil") {
          const B = pick([20, 30, 40, 50, 60, 70, 80, 100, 200, 1000]), d = rnd(1, B >= 100 ? 9 : 4), ans = B * B - d * d;
          return { text: `Düsturla hesabla: ${B - d}·${B + d}.`, answer: ans, show: big(ans), tol: 0.01,
            solution: `${B - d}·${B + d} = (${B} − ${d})(${B} + ${d}) = ${B}² − ${d}² = ${big(B * B)} − ${d * d} = ${big(ans)}.` };
        }
        const T = pick([100, 100, 200, 50, 60]); let a; do a = rnd(T / 2 + 1, T - 1); while (a === T / 2); const b = T - a, ans = a * a - b * b;
        return { text: `Düsturla hesabla: ${a}² − ${b}².`, answer: ans, show: big(ans), tol: 0.01,
          solution: `${a}² − ${b}² = (${a} − ${b})(${a} + ${b}) = ${a - b}·${T} = ${big(ans)}.` };
      } },
    { id: "tamkv", ad: "Tam kvadrat və hiylələr", izah: "Düsturu tərsinə oxu: x² − 2ax + a² = (x − a)². a² + b² = (a + b)² − 2ab.",
      gen() {
        const kind = pick(["yigil", "yigil", "s2", "d2", "f2", "min"]);
        if (kind === "yigil") {
          const a = rnd(2, 15), s = pick([1, -1]), R = pick([10, 20, 100, 100, 1000]), v = s < 0 ? a + R : R - a, ans = R * R;
          return { text: `x² ${s < 0 ? "−" : "+"} ${2 * a}x + ${a * a} ifadəsinin x = ${S(v)} olanda qiymətini tap.`, answer: ans, show: big(ans), tol: 0.01,
            solution: `Bu tam kvadratdır: x² ${s < 0 ? "−" : "+"} ${2 * a}x + ${a * a} = (x ${s < 0 ? "−" : "+"} ${a})². x = ${S(v)}: (${S(v)} ${s < 0 ? "−" : "+"} ${a})² = ${R}² = ${big(ans)}.` };
        }
        const x = nz(-9, 9); let y; do y = nz(-9, 9); while (y === x);
        if (kind === "s2") return { text: `a + b = ${S(x + y)}, ab = ${S(x * y)}. a² + b² = ?`, answer: x * x + y * y, show: String(x * x + y * y), tol: 0.01,
          solution: `(a + b)² = a² + 2ab + b² → a² + b² = (a + b)² − 2ab = ${P(x + y)}² − 2·${P(x * y)} = ${(x + y) ** 2} ${sg(-x * y)} ${Math.abs(2 * x * y)} = ${x * x + y * y}.` };
        if (kind === "d2") return { text: `a − b = ${S(x - y)}, ab = ${S(x * y)}. a² + b² = ?`, answer: x * x + y * y, show: String(x * x + y * y), tol: 0.01,
          solution: `(a − b)² = a² − 2ab + b² → a² + b² = (a − b)² + 2ab = ${P(x - y)}² + 2·${P(x * y)} = ${(x - y) ** 2} ${sg(x * y)} ${Math.abs(2 * x * y)} = ${x * x + y * y}.` };
        if (kind === "f2") return { text: `a + b = ${S(x + y)}, ab = ${S(x * y)}. (a − b)² = ?`, answer: (x - y) ** 2, show: String((x - y) ** 2), tol: 0.01,
          solution: `(a − b)² = (a + b)² − 4ab = ${P(x + y)}² − 4·${P(x * y)} = ${(x + y) ** 2} ${sg(-x * y)} ${Math.abs(4 * x * y)} = ${(x - y) ** 2}.` };
        // minimum of x² + 2mx + c via (x + m)² + (c − m²)
        const m = nz(-7, 7), q = rnd(-9, 12), c = m * m + q;
        return { text: `x² ${sg(m)} ${2 * Math.abs(m)}x ${sg(c)} ${Math.abs(c)} ifadəsinin ən kiçik qiyməti neçədir?`, answer: q, show: S(q), tol: 0.01,
          solution: `Tam kvadratı ayır: x² ${sg(m)} ${2 * Math.abs(m)}x + ${m * m} ${sg(q)} ${Math.abs(q)} = (x ${sg(m)} ${Math.abs(m)})² ${sg(q)} ${Math.abs(q)}. Kvadrat ≥ 0, ən kiçiyi 0 (x = ${S(-m)} olanda). Ən kiçik qiymət: ${S(q)}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Tez hesablama üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const B = pick([100, 200, 1000, 50, 30]), d = rnd(1, B >= 100 ? 9 : 4), s = pick([1, -1]), N = B + s * d, ans = N * N;
        const steps = [
          `1) ${N} = ${B} ${sg(s)} ${d}.`,
          `2) (${B} ${sg(s)} ${d})² = ${B}² ${sg(s)} 2·${B}·${d} + ${d}².`,
          `3) = ${big(B * B)} ${sg(s)} ${big(2 * B * d)} + ${d * d} = ${big(ans)}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `1) ${N} = ${B} ${sg(-s)} ${d}.`;
        if (bad === 1) steps[1] = pick([`2) (${B} ${sg(s)} ${d})² = ${B}² ${sg(s)} ${d}².`, `2) (${B} ${sg(s)} ${d})² = ${B}² ${sg(s)} ${B}·${d} + ${d}².`]);
        if (bad === 2) steps[2] = pick([`3) = ${big(B * B)} ${sg(s)} ${big(B * d)} + ${d * d} = ${big(B * B + s * B * d + d * d)}.`, `3) = ${big(B * B)} ${sg(s)} ${big(2 * B * d)} = ${big(B * B + s * 2 * B * d)}.`]);
        const text = h("div", {}, h("p", {}, `Hesabla: ${N}².`), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st.slice(3)))));
        const why = [`1-ci addım: ${B} ${sg(-s)} ${d} = ${B - s * d}, ${N} deyil. Düzü: ${N} = ${B} ${sg(s)} ${d}.`,
          `2-ci addım: (a ${sg(s)} b)² = a² ${sg(s)} 2ab + b² — ortadakı 2ab tam yazılmalıdır.`,
          `3-cü addım: 2·${B}·${d} = ${2 * B * d} və ${d}² = ${d * d} hər ikisi yazılmalıdır. Düz cavab: ${big(ans)}.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Sahə dəyişməsi, iki kvadrat, tez qiymət — düsturlar burada vaxt qazandırır.",
      gen() {
        const kind = pick(["art", "azal", "iki", "pul"]);
        if (kind === "art") {
          const x = rnd(4, 30), b = rnd(1, 6), A = 2 * b * x + b * b;
          return { text: `Kvadrat meydançanın tərəfini ${b} m artırdılar, sahəsi ${A} m² artdı. Meydançanın ilk tərəfi neçə metrdir?`, answer: x, unit: "m", show: String(x), tol: 0.01,
            solution: `(x + ${b})² − x² = ${2 * b}x + ${b * b} = ${A} → ${2 * b}x = ${A - b * b} → x = ${x} m.` };
        }
        if (kind === "azal") {
          const b = rnd(1, 5), x = rnd(b + 3, 30), A = 2 * b * x - b * b;
          return { text: `Kvadrat bağçanın tərəfini ${b} m azaltdılar, sahəsi ${A} m² azaldı. Bağçanın ilk tərəfi neçə metrdir?`, answer: x, unit: "m", show: String(x), tol: 0.01,
            solution: `x² − (x − ${b})² = ${2 * b}x − ${b * b} = ${A} → ${2 * b}x = ${A + b * b} → x = ${x} m.` };
        }
        if (kind === "iki") {
          const y = rnd(3, 20), d = rnd(1, 6), x = y + d, A = x * x - y * y;
          return { text: `İki kvadrat kafelin tərəfləri ${d} sm fərqlənir, sahələri isə ${A} sm² fərqlənir. Böyük kafelin tərəfi neçə sm-dir?`, answer: x, unit: "sm", show: String(x), tol: 0.01,
            solution: `x² − y² = (x − y)(x + y) → ${A} = ${d}·(x + y) → x + y = ${A / d}. x − y = ${d}, deməli x = (${A / d} + ${d}) : 2 = ${x} sm.` };
        }
        const B = pick([50, 100, 100, 200]), d = rnd(1, 9), price = B - d, n = B + d, ans = price * n;
        return { text: `Bir dəftər ${price} qəpikdir. Məktəb ${n} dəftər aldı. Düsturla tez hesabla: cəmi neçə qəpik ödənildi?`, answer: ans, unit: "qəpik", show: String(ans), tol: 0.01,
          solution: `${price}·${n} = (${B} − ${d})(${B} + ${d}) = ${big(B * B)} − ${d * d} = ${ans} qəpik.` };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (no 2ab in the middle, (a − b)² = a² − b², wrong sign in a³ ± b³, ...).
  // The 15 Nov mock exam had a written a³ − b³ question left blank: #4, #5 and #10 train the short ways.
  const { ae, again, num } = Oyun;
  const id = x => x;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const mono = (c, v) => (c === 1 ? "" : c) + v;                                   // 1·x → x, 3·x → 3x
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. (Ax ± By)² as a polynomial
    { tip: "qapali", gen: () => again(() => {
      const A = rnd(1, 5), B = rnd(1, 7), s = pick([1, -1]); if (A === B || A * B === 1) return null;
      const useY = Math.random() < .6, v = useY ? "y" : "", vv = useY ? "y²" : "";
      const ax = mono(A, "x"), by = useY ? mono(B, "y") : String(B);
      const T = (a, m, c) => poly([[a, "x²"], [m, useY ? "xy" : "x"], [c, vv]]);
      const R = T(A * A, 2 * s * A * B, B * B);
      const w = [T(A * A, 0, s * B * B), T(A * A, s * A * B, B * B), T(A * A, -2 * s * A * B, B * B), T(A, 2 * s * A * B, B)];
      return mc(ae(R, w, id), { text: `(${ax} ${sg(s)} ${by})² ifadəsini çoxhədli şəklində yazın.`,
        solution: `(a ${sg(s)} b)² = a² ${sg(s)} 2ab + b²: ${A === 1 ? "x" : `(${ax})`}² ${sg(s)} 2·${ax}·${by} + ${B === 1 && useY ? "y" : `(${by})`}² = ${R}. Tələlər: ${s < 0 ? `(a − b)²-ni kvadratlar fərqi a² − b² saymaq` : "ortadakı 2ab-ni atmaq"} (${w[0]}), 2-ni unutmaq (${w[1]}), əmsalları kvadrata yüksəltməmək (${w[3]}).` });
    }) },
    // 2. quick square of a number near a round one
    { tip: "qapali", gen: () => again(() => {
      const B = pick([100, 100, 1000, 200, 50]), d = rnd(1, B >= 100 ? 9 : 4), s = pick([1, -1]), N = B + s * d;
      const R = N * N, w = s < 0
        ? [B * B - d * d, B * B - 2 * B * d - d * d, B * B - B * d + d * d, B * B - 2 * B * d]
        : [B * B + d * d, B * B + B * d + d * d, B * B + 2 * B * d, B * B - 2 * B * d + d * d];
      return mc(ae(R, w, big), { text: `Hesablayın: ${N}².`,
        solution: `${N}² = (${B} ${sg(s)} ${d})² = ${big(B * B)} ${sg(s)} ${big(2 * B * d)} + ${d * d} = ${big(R)}. Tələlər: ${s < 0 ? `${B}² − ${d}² (${big(w[0])}) — (a − b)² kvadratlar fərqi deyil` : `${B}² + ${d}² (${big(w[0])}) — ortadakı 2ab unudulub`}; 2-siz orta hədd (${big(s < 0 ? w[2] : w[1])}).` });
    }) },
    // 3. difference of squares: x − y and x² − y² given, find x
    { tip: "qapali", gen: () => again(() => {
      const y = rnd(2, 20), d = rnd(1, 8), x = y + d, sm = x + y, Q = x * x - y * y;
      return mc(ae(x, [sm, y, 2 * x, 2 * y]), { text: `x − y = ${d} və x² − y² = ${Q} olarsa, x ədədini tapın.`,
        solution: `x² − y² = (x − y)(x + y) → x + y = ${Q} : ${d} = ${sm}. Sistemi topla: 2x = ${sm} + ${d} = ${2 * x}, x = ${x}. Tələlər: x + y-ni cavab yazmaq (${sm}), y-ni tapmaq (${y}), 2-yə bölməyi unutmaq (${2 * x}).` });
    }) },
    // 4. factor a sum / difference of cubes
    { tip: "qapali", gen: () => again(() => {
      const k = rnd(1, 3), b = rnd(1, 5), s = pick([1, -1]); if (k === b) return null;
      const A = mono(k, "x"), sq = (m, c) => `${poly([[k * k, "x²"], [m, "x"], [c, ""]])}`;
      const f = (sign, m, c) => `(${A} ${sg(sign)} ${b})(${sq(m, c)})`;
      const R = f(s, -s * k * b, b * b);
      const w = [f(s, s * k * b, b * b), f(s, -s * 2 * k * b, b * b), `(${A} ${sg(s)} ${b})³`, f(-s, s * k * b, b * b)];
      return mc(ae(R, w, id), { text: `${poly([[k ** 3, "x³"], [s * b ** 3, ""]])} ifadəsini vuruqlara ayırın.`,
        solution: `${k === 1 ? "" : `${k ** 3}x³ = (${A})³, `}${b ** 3} = ${b}³. a³ ${sg(s)} b³ = (a ${sg(s)} b)(a² ${sg(-s)} ab + b²): ${R}. Tələlər: ikinci mötərizədə işarəni səhv qoymaq (${w[0]}), tam kvadrat yazmaq — 2ab ilə (${w[1]}), (a ${sg(s)} b)³ yazmaq, kubların ${s > 0 ? "fərqi" : "cəmi"} düsturunu götürmək (${w[3]}). Yoxlama: x = 1 qoy, iki tərəf bərabər olmalıdır.` });
    }) },
    // 5. a + b, ab given → a³ + b³ (short way, no a and b)
    { tip: "qapali", gen: () => again(() => {
      const x = nz(-6, 6), y = nz(-6, 6), s = x + y, p = x * y; if (!s || x === y) return null;
      const R = s ** 3 - 3 * p * s, w = [s ** 3 + 3 * p * s, s ** 3, s ** 3 - p * s, s ** 3 - 2 * p * s];
      return mc(ae(R, w), { text: `a + b = ${S(s)} və ab = ${S(p)} olarsa, a³ + b³ ifadəsinin qiymətini tapın.`,
        solution: `a³ + b³ = (a + b)(a² − ab + b²), a² + b² = (a + b)² − 2ab, deməli a² − ab + b² = (a + b)² − 3ab = ${s * s} ${sg(-p)} ${Math.abs(3 * p)} = ${s * s - 3 * p}. a³ + b³ = ${S(s)}·${P(s * s - 3 * p)} = ${S(R)}. Tələlər: 3ab-ni toplamaq (${S(w[0])}), yalnız (a + b)³-u yazmaq (${S(w[1])}), a² − ab + b²-ni (a + b)² − ab saymaq (${S(w[2])}).` });
    }) },
    // 6. simplify (kx ± a)² − (kx − a)(kx + a)
    { tip: "qapali", gen: () => again(() => {
      const k = rnd(1, 4), a = rnd(1, 6), s = pick([1, -1]); if (k === a) return null;
      const kx = mono(k, "x"), L = (c2, c1, c0) => poly([[c2, "x²"], [c1, "x"], [c0, ""]]);
      const R = L(0, 2 * s * k * a, 2 * a * a), w = [L(0, 2 * s * k * a, 0), L(0, s * k * a, 2 * a * a), L(0, 0, 2 * a * a), L(2 * k * k, 2 * s * k * a, 0)];
      return mc(ae(R, w, id), { text: `İfadəni sadələşdirin: (${kx} ${sg(s)} ${a})² − (${kx} − ${a})(${kx} + ${a}).`,
        solution: `(${kx} ${sg(s)} ${a})² = ${L(k * k, 2 * s * k * a, a * a)}; (${kx} − ${a})(${kx} + ${a}) = ${L(k * k, 0, -a * a)}. Fərq: ${L(k * k, 2 * s * k * a, a * a)} − ${k * k === 1 ? "x²" : k * k + "x²"} + ${a * a} = ${R}. Tələlər: mötərizə qarşısındakı minusu sərbəst həddə tətbiq etməmək (${w[0]}), kvadratda 2-ni unutmaq (${w[1]}), orta həddi atmaq (${w[2]}), minusu ümumiyyətlə unutmaq (${w[3]}).` });
    }) },
    // 7. coded: (a² − 2ab + b²) : (a² − b²) with numbers → (a − b)/(a + b)
    { tip: "kod", gen: () => again(() => {
      const T = pick([20, 25, 40, 50, 50, 100]), a = rnd(Math.floor(T / 2) + 1, T - 1), b = T - a, r = (a - b) / T;
      if (Math.abs(Math.round(r * 100) - r * 100) > 1e-9 || a === b) return null;
      return { text: `Hesablayın: (${a}² − 2·${a}·${b} + ${b}²) : (${a}² − ${b}²).`, answer: r, show: num(r), tol: 1e-6,
        solution: `Surət (${a} − ${b})², məxrəc (${a} − ${b})(${a} + ${b}). İxtisar: (${a} − ${b}) : (${a} + ${b}) = ${a - b} : ${T} = ${num(r)}.` };
    }) },
    // 8. coded: x² + y² − 2mx − 2ny + (m² + n²) = 0 → x = m, y = n
    { tip: "kod", gen: () => again(() => {
      const m = nz(-6, 6), n = nz(-6, 6), sum = Math.random() < .5, ans = sum ? m + n : m * n; if (!ans) return null;
      return { text: `x² + y² ${sg(-m)} ${2 * Math.abs(m)}x ${sg(-n)} ${2 * Math.abs(n)}y + ${m * m + n * n} = 0 olarsa, ${sum ? "x + y" : "x·y"} ifadəsinin qiymətini tapın.`,
        answer: ans, show: S(ans), tol: 1e-6,
        solution: `${m * m + n * n} = ${m * m} + ${n * n}: (x² ${sg(-m)} ${2 * Math.abs(m)}x + ${m * m}) + (y² ${sg(-n)} ${2 * Math.abs(n)}y + ${n * n}) = (x ${sg(-m)} ${Math.abs(m)})² + (y ${sg(-n)} ${Math.abs(n)})² = 0. İki kvadratın cəmi 0 → hər biri 0: x = ${S(m)}, y = ${S(n)}. ${sum ? "x + y" : "x·y"} = ${S(ans)}.` };
    }) },
    // 9. coded: a ± 1/a = t → a² + 1/a²
    { tip: "kod", gen: () => again(() => {
      const minus = Math.random() < .4, t = minus ? nz(-7, 7) : rnd(3, 15), ans = minus ? t * t + 2 : t * t - 2;
      return { text: `a ${minus ? "−" : "+"} 1/a = ${S(t)} olarsa, a² + 1/a² ifadəsinin qiymətini tapın.`, answer: ans, show: String(ans), tol: 1e-6,
        solution: `Hər tərəfi kvadrata yüksəlt: (a ${minus ? "−" : "+"} 1/a)² = a² ${minus ? "−" : "+"} 2·a·(1/a) + 1/a² = a² + 1/a² ${minus ? "−" : "+"} 2. Deməli a² + 1/a² = ${t * t} ${minus ? "+" : "−"} 2 = ${ans}. Tələ: 2-ni unutmaq (${t * t}).` };
    }) },
    // 10. written: a³ − b³ without finding a and b (the 15 Nov written question had this form)
    { tip: "yazili", gen: () => again(() => {
      const a = rnd(2, 9), b = nz(-6, 7); if (a <= b) return null;
      const d = a - b, p = a * b, q = a * a + b * b, R = a ** 3 - b ** 3, viaQ = Math.random() < .4;
      if (viaQ) return { text: `a − b = ${d} və a² + b² = ${q} olarsa, a³ − b³ ifadəsinin qiymətini tapın. Həlli addım-addım yazın.`,
        answer: R, show: S(R), tol: 1e-6,
        solution: `1) (a − b)² = a² + b² − 2ab → ${d * d} = ${q} − 2ab → ab = ${S(p)}. 2) a³ − b³ = (a − b)(a² + ab + b²). 3) a² + ab + b² = ${q} ${sg(p)} ${Math.abs(p)} = ${q + p}. 4) a³ − b³ = ${d}·${P(q + p)} = ${S(R)}.` };
      return { text: `a − b = ${d} və ab = ${S(p)} olarsa, a³ − b³ ifadəsinin qiymətini tapın. Həlli addım-addım yazın.`,
        answer: R, show: S(R), tol: 1e-6,
        solution: `1) a³ − b³ = (a − b)(a² + ab + b²). 2) a² + b² = (a − b)² + 2ab = ${d * d} ${sg(p)} ${Math.abs(2 * p)} = ${q}. 3) a² + ab + b² = ${q} ${sg(p)} ${Math.abs(p)} = ${q + p}. 4) a³ − b³ = ${d}·${P(q + p)} = ${S(R)}. (Qısa yol: (a − b)³ + 3ab(a − b) = ${d ** 3} ${sg(p)} ${Math.abs(3 * p * d)} = ${S(R)}.)` };
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
      key: "muxteser-vurma", title: "Müxtəsər vurma düsturları", fenn: "riyaziyyat", link: "dersler/muxteser-vurma.html",
      format: "Cavab ədəddir: 10609 (boşluqla 10 609 da olar), mənfi −36, onluq kəsr vergüllə 0,48. Əmsal işarəsi ilə yazılır (−6x-in əmsalı −6).",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["kvadrat", "kvadrat", "ferq", "kub", "kub", "tez", "tez", "tamkv", "tamkv", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/muxteser-vurma.html")) b.push("dersler/muxteser-vurma.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
