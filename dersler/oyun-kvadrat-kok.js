// Kvadrat kök, hesabi kökün xassələri — mastery game levels (definition and √(a²) = |a|, product/quotient rules,
// taking a factor out / in, transformations, rationalising denominators, word problems) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const dec = x => String(+x.toFixed(6)).replace(".", ",");            // 0.49 → "0,49"
  const FREE = [2, 3, 5, 6, 7, 10, 11, 13, 14, 15];                     // square-free radicands
  const kr = (k, n) => n === 1 ? S(k) : (k === 1 ? "" : k === -1 ? "−" : S(k)) + "√" + n;   // k√n as text
  const simp = m => { let k = 1; for (let d = 2; d * d <= m; d++) while (m % (d * d) === 0) { m /= d * d; k *= d; } return [k, m]; };   // √m = k√n
  const isNice = (x, dp = 2) => Math.abs(Math.round(x * 10 ** dp) - x * 10 ** dp) < 1e-7;
  const isSq = n => Number.isInteger(Math.sqrt(n));
  const SUP = { 1: "", 2: "²", 3: "³", 4: "⁴", 6: "⁶", 8: "⁸" };

  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37]];

  const levels = [
    { id: "hesabi", ad: "Hesabi kök və √(a²) = |a|", izah: "√a — kvadratı a olan mənfi olmayan ədəd. √(a²) = |a|: kök altından çıxan ədəd mənfi ola bilməz.",
      gen() {
        const kind = pick(["mixed", "decimal", "mod", "mod", "neg"]);
        if (kind === "mixed") {
          let p, q; do { p = rnd(3, 12); q = rnd(2, 9); } while (p <= q || gcd(p, q) !== 1);
          const P = p * p, Q = q * q, w = Math.floor(P / Q), r = P % Q;
          return { text: `Hesabla: √(${w} ${r}/${Q}).`, answer: p / q, show: frac(p, q),
            solution: `Qarışıq ədədi düzgün olmayan kəsrə çevir: ${w} ${r}/${Q} = ${P}/${Q}. √(${P}/${Q}) = √${P}/√${Q} = ${p}/${q}.` };
        }
        if (kind === "decimal") {
          const n = rnd(2, 19), m = rnd(2, 15), A = n * n / 100, B = m * m / 10000, plus = Math.random() < .5;
          const v = plus ? n / 10 + m / 100 : n / 10 - m / 100;
          return { text: `Hesabla: √${dec(A)} ${plus ? "+" : "−"} √${dec(B)}.`, answer: v, show: dec(v),
            solution: `√${dec(A)} = ${dec(n / 10)} (çünki ${dec(n / 10)}² = ${dec(A)}), √${dec(B)} = ${dec(m / 100)}. ${dec(n / 10)} ${plus ? "+" : "−"} ${dec(m / 100)} = ${dec(v)}.` };
        }
        if (kind === "neg") {
          const k = rnd(2, 6), m = pick([-1, 1]) * rnd(1, 7), t = rnd(2, 9), v = k * t - m * t;
          const mx = m === 1 ? "+ x" : m === -1 ? "− x" : (m < 0 ? "− " : "+ ") + Math.abs(m) + "x";
          return { text: `x = −${t} olduqda √(${k * k}x²) ${mx} ifadəsinin qiymətini tap.`, answer: v, show: S(v), tol: 0.01,
            solution: `√(${k * k}x²) = ${k}|x|. x = −${t}: ${k}·${t} ${m < 0 ? "+" : "−"} ${Math.abs(m)}·${t} = ${S(v)}. (${k}x yazsan, mənfi alınar — səhvdir.)` };
        }
        let p; do { p = rnd(2, 60); } while (isSq(p));
        const sq = Math.sqrt(p), fl = Math.floor(sq), q = rnd(Math.max(1, fl - 1), fl + 2);
        const big = q > sq;
        return { text: `Hesabla: √((${q} − √${p})²) ${big ? "+" : "−"} √${p}.`, answer: big ? q : -q, show: S(big ? q : -q), tol: 0.01,
          solution: `√(a²) = |a|. ${q} = √${q * q}, ${big ? `${q * q} > ${p}` : `${q * q} < ${p}`}, ona görə ${q} ${big ? ">" : "<"} √${p}. |${q} − √${p}| = ${big ? `${q} − √${p}` : `√${p} − ${q}`}. ` +
            (big ? `${q} − √${p} + √${p} = ${q}.` : `√${p} − ${q} − √${p} = −${q}.`) };
      } },
    { id: "xasse", ad: "Hasilin və nisbətin kökü", izah: "√(ab) = √a·√b, √(a/b) = √a/√b. Kök altında tam kvadrat yarat.",
      gen() {
        const kind = pick(["prod", "quot", "pow", "diff"]);
        if (kind === "prod") {
          const n = pick([2, 3, 5, 6, 7]); let u, v; do { u = rnd(1, 5); v = rnd(1, 5); } while (u === v);
          const a = n * u * u, b = n * v * v, r = n * u * v;
          return { text: `Hesabla: √${a}·√${b}.`, answer: r, show: String(r), tol: 0.01,
            solution: `√${a}·√${b} = √(${a}·${b}) = √${a * b} = ${r}.` };
        }
        if (kind === "quot") {
          const b = pick([2, 3, 5, 6, 7, 2 * 4, 3 * 4, 5 * 4, 2 * 9]), c = rnd(2, 9), a = b * c * c;
          return { text: `Hesabla: √${a} / √${b}.`, answer: c, show: String(c), tol: 0.01,
            solution: `√${a}/√${b} = √(${a}/${b}) = √${c * c} = ${c}.` };
        }
        if (kind === "pow") {
          const e2 = rnd(1, 3), e3 = rnd(1, 2), e5 = rnd(0, 1), r = 2 ** e2 * 3 ** e3 * 5 ** e5;
          const txt = `2${SUP[2 * e2]}·3${SUP[2 * e3]}` + (e5 ? `·5²` : "");
          return { text: `Hesabla: √(${txt}).`, answer: r, show: String(r), tol: 0.01,
            solution: `Hər vuruqdan ayrıca kök: √(2${SUP[2 * e2]}) = 2${SUP[e2]}, √(3${SUP[2 * e3]}) = 3${SUP[e3]}${e5 ? ", √(5²) = 5" : ""}. Hasil: ${2 ** e2}·${3 ** e3}${e5 ? "·5" : ""} = ${r}.` };
        }
        const [a, b, c] = pick(TRIPLES), k = pick([1, 1, 2, 3]), A = k * a, B = k * b, C = k * c, w = pick([0, 1]);
        const [leg, other] = w ? [B, A] : [A, B];
        return { text: `Kalkulyatorsuz hesabla: √(${C}² − ${leg}²).`, answer: other, show: String(other), tol: 0.01,
          solution: `${C}² − ${leg}² = (${C} − ${leg})(${C} + ${leg}) = ${C - leg}·${C + leg} = ${other * other}. √${other * other} = ${other}.` };
      } },
    { id: "cixar", ad: "Vuruğu kök altından çıxar / sal", izah: "√(a²b) = a√b. Kök altındakı ədəddən ən böyük tam kvadratı ayır. Kök altına salanda a² olur.",
      gen() {
        const kind = pick(["out", "in", "sum", "sum", "cmp"]);
        if (kind === "out") {
          const n = pick(FREE), k = rnd(2, 10), m = k * k * n, sum = Math.random() < .4;
          return { text: `√${m} ifadəsini a√b şəklində yaz (a, b natural, b mümkün qədər kiçik). ${sum ? "a + b" : "a"} = ?`, answer: sum ? k + n : k, show: String(sum ? k + n : k), tol: 0.01,
            solution: `${m} = ${k * k}·${n}, ${k * k} — tam kvadratdır. √${m} = √${k * k}·√${n} = ${k}√${n}. a = ${k}, b = ${n}${sum ? `; a + b = ${k + n}` : ""}.` };
        }
        if (kind === "in") {
          const n = pick(FREE), k = rnd(2, 9);
          return { text: `${k}√${n} ifadəsini √m şəklində yaz. m = ?`, answer: k * k * n, show: String(k * k * n), tol: 0.01,
            solution: `${k} = √${k * k}. ${k}√${n} = √(${k * k}·${n}) = √${k * k * n}.` };
        }
        if (kind === "cmp") {
          const set = new Map();
          while (set.size < 3) { const n = pick([2, 3, 5, 6, 7]), k = rnd(2, 6), m = k * k * n; if (m >= 20 && m <= 200 && ![...set.values()].includes(m)) set.set(kr(k, n), m); }
          const items = [...set.entries()], best = Math.max(...items.map(e => e[1]));
          return { text: `Ədədlər: ${items.map(e => e[0]).join("; ")}. Ən böyüyünü √m şəklində yaz. m = ?`, answer: best, show: String(best), tol: 0.01,
            solution: `Hamısını kök altına sal: ${items.map(e => `${e[0]} = √${e[1]}`).join(", ")}. Ən böyüyü √${best}.` };
        }
        const n = pick([2, 3, 5, 6, 7]); let ks, K; do { ks = [rnd(1, 7), rnd(1, 7), rnd(1, 7)]; K = ks[0] + ks[1] - ks[2]; } while (K <= 0 || ks[0] === ks[1] || ks[2] === ks[0]);
        const xs = ks.map(k => k * k * n);
        return { text: `Sadələşdir: √${xs[0]} + √${xs[1]} − √${xs[2]}.`, answer: K * Math.sqrt(n), show: kr(K, n),
          solution: `${xs.map((x, i) => ks[i] > 1 ? `√${x} = ${kr(ks[i], n)}` : "").filter(Boolean).join(", ")}. ${kr(ks[0], n)} + ${kr(ks[1], n)} − ${kr(ks[2], n)} = (${ks[0]} + ${ks[1]} − ${ks[2]})√${n} = ${kr(K, n)}.` };
      } },
    { id: "cevir", ad: "Köklü ifadələrin çevrilməsi", izah: "(√a)² = a; (√a − √b)(√a + √b) = a − b; (√a ± √b)² = a ± 2√(ab) + b.",
      gen() {
        const kind = pick(["conj", "sq", "dist", "sqval"]);
        if (kind === "conj") {
          const k = rnd(1, 4), [a, b] = [pick(FREE), pick(FREE)], v = k * k * a - b;
          const ka = (k === 1 ? "" : k) + "√" + a;
          return { text: `Hesabla: (${ka} − √${b})(${ka} + √${b}).`, answer: v, show: S(v), tol: 0.01,
            solution: `(x − y)(x + y) = x² − y²: (${ka})² − (√${b})² = ${k === 1 ? "" : k * k + "·"}${a} − ${b} = ${S(v)}.` };
        }
        if (kind === "sq") {
          const n = pick([2, 3, 5, 6, 7]); let u, v; do { u = rnd(1, 4); v = rnd(1, 4); } while (u === v);
          const a = n * u * u, b = n * v * v, minus = Math.random() < .5, r = minus ? n * (u - v) ** 2 : n * (u + v) ** 2;
          return { text: `Hesabla: (√${a} ${minus ? "−" : "+"} √${b})².`, answer: r, show: String(r), tol: 0.01,
            solution: `√${a} = ${kr(u, n)}, √${b} = ${kr(v, n)}. (${kr(u, n)} ${minus ? "−" : "+"} ${kr(v, n)})² = (${kr(minus ? u - v : u + v, n)})² = ${(minus ? u - v : u + v) ** 2}·${n} = ${r}.` };
        }
        if (kind === "dist") {
          const n = pick([2, 3, 5, 6, 7]); let u, v; do { u = rnd(1, 5); v = rnd(1, 5); } while (u === v);
          const minus = Math.random() < .5, r = minus ? n * (u - v) : n * (u + v), a = n * u * u, b = n * v * v;
          return { text: `Hesabla: (√${a} ${minus ? "−" : "+"} √${b})·√${n}.`, answer: r, show: S(r), tol: 0.01,
            solution: `√${a}·√${n} = √${a * n} = ${n * u}, √${b}·√${n} = √${b * n} = ${n * v}. ${n * u} ${minus ? "−" : "+"} ${n * v} = ${S(r)}.` };
        }
        const a = rnd(2, 6), b = pick(FREE), r = a * a + b;
        return { text: `Hesabla: (${a} − √${b})² + ${2 * a}√${b}.`, answer: r, show: String(r), tol: 0.01,
          solution: `(${a} − √${b})² = ${a * a} − 2·${a}·√${b} + ${b} = ${a * a + b} − ${2 * a}√${b}. ${2 * a}√${b} ilə toplayanda kök yox olur: ${r}.` };
      } },
    { id: "irr", ad: "Məxrəci irrasionallıqdan azad et", izah: "k/√n — surəti və məxrəci √n-ə vur. k/(√a − √b) — qoşma ifadəyə (√a + √b) vur.",
      gen() {
        const kind = pick(["one", "one", "conj", "int"]);
        if (kind === "one") {
          const n = pick([2, 3, 5, 6, 7]), m = rnd(2, 6), j = rnd(1, m - 1), k = n * m, K = m - j;
          return { text: `Sadələşdir: ${k}/√${n} − √${n * j * j}.`, answer: K * Math.sqrt(n), show: kr(K, n),
            solution: `${k}/√${n} = ${k}√${n}/(√${n}·√${n}) = ${k}√${n}/${n} = ${kr(m, n)}. √${n * j * j} = ${kr(j, n)}. ${kr(m, n)} − ${kr(j, n)} = ${kr(K, n)}.` };
        }
        if (kind === "conj") {
          let a, b; do { a = pick(FREE); b = pick(FREE); } while (a <= b || a - b > 6);
          const d = a - b, m = rnd(1, 4), c = d * m;
          return { text: `Sadələşdir: ${c}/(√${a} − √${b}) − ${kr(m, a)}.`, answer: m * Math.sqrt(b), show: kr(m, b),
            solution: `Qoşma ifadəyə vur: ${c === 1 ? "" : c}(√${a} + √${b})/((√${a})² − (√${b})²) = ${c === 1 ? "" : c}(√${a} + √${b})/${d} = ${kr(m, a)} + ${kr(m, b)}. ${kr(m, a)}-ni çıxanda qalır: ${kr(m, b)}.` };
        }
        // c/(√n − k) where n − k² = d: = (c/d)(√n + k); minus (c/d)√n leaves (c/d)k
        let n, k; do { k = rnd(1, 5); n = k * k + rnd(1, 4); } while (isSq(n));
        const d = n - k * k, m = rnd(1, 3), c = d * m, r = m * k;
        return { text: `Hesabla: ${c}/(√${n} − ${k}) − ${kr(m, n)}.`, answer: r, show: String(r), tol: 0.01,
          solution: `${c}/(√${n} − ${k}) = ${c}(√${n} + ${k})/(${n} − ${k * k}) = ${m === 1 ? "" : m}(√${n} + ${k}) = ${kr(m, n)} + ${r}. ${kr(m, n)} çıxılır: ${r}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          const n = pick([2, 3, 5, 6, 7]), m = rnd(2, 6), j = rnd(1, m - 1), k = n * m, K = m - j, x = n * j * j;
          task = `Sadələşdir: ${k}/√${n} − √${x}.`;
          steps = [`${k}/√${n} = ${k}√${n}/${n} = ${kr(m, n)}.`, `√${x} = ${kr(j, n)}.`, `${kr(m, n)} − ${kr(j, n)} = ${kr(K, n)}.`];
          if (bad === 0) { const g = gcd(k, n * n); steps[0] = `${k}/√${n} = ${k}√${n}/${n * n} = ` + (n * n / g === 1 ? kr(k / g, n) : `${kr(k / g, n)}/${n * n / g}`) + "."; }
          if (bad === 1) steps[1] = j === 1 ? `√${x} = ${n}.` : `√${x} = ${j * j}√${n}.`;
          if (bad === 2) steps[2] = `${kr(m, n)} − ${kr(j, n)} = ${K}.`;
          why = [`1-ci addım: √${n}·√${n} = ${n}, ${n * n} yox. ${k}/√${n} = ${kr(m, n)}.`,
            `2-ci addım: √${x} = √(${j * j}·${n}) = ${kr(j, n)}.`,
            `3-cü addım: bənzər kökləri çıxanda kök qalır: ${kr(K, n)}.`][bad];
        } else {
          let p; do { p = rnd(3, 60); } while (isSq(p));
          const q = Math.floor(Math.sqrt(p)), q2 = q * q;   // q < √p
          task = `Hesabla: √((${q} − √${p})²) + ${q}.`;
          steps = [`√((${q} − √${p})²) = |${q} − √${p}|.`, `${q2} < ${p}, ona görə ${q} < √${p} və |${q} − √${p}| = √${p} − ${q}.`, `√${p} − ${q} + ${q} = √${p}.`];
          if (bad === 0) steps[0] = `√((${q} − √${p})²) = ${q} − √${p}.`;
          if (bad === 1) steps[1] = `${q2} < ${p}, ona görə |${q} − √${p}| = ${q} + √${p}.`;
          if (bad === 2) steps[2] = `√${p} − ${q} + ${q} = √${p} + ${2 * q}.`;
          why = [`1-ci addım: √(a²) = |a|, modulsuz yazmaq olmaz — ${q} − √${p} mənfidir.`,
            `2-ci addım: mənfi ədədin modulu onun əksidir: |${q} − √${p}| = √${p} − ${q}.`,
            `3-cü addım: −${q} + ${q} = 0, cavab √${p}.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "hesab", ad: "Həyatdan", izah: "Kvadratın tərəfi, diaqonal, nərdivan, sərbəst düşmə — cavab çox vaxt k√n olur.",
      gen() {
        const kind = pick(["fall", "room", "diag", "ladder"]);
        if (kind === "fall") {
          const n = rnd(1, 12), H = 5 * n, [k, m] = simp(n);
          return { text: `Daş ${H} m hündürlükdən sərbəst düşür. Düşmə vaxtı t = √(h/5) düsturu ilə tapılır (g = 10 m/s²). Daş neçə saniyəyə yerə düşər?`, answer: Math.sqrt(n), unit: "s", show: kr(k, m),
            solution: `t = √(${H}/5) = √${n}${k > 1 || m === 1 ? ` = ${kr(k, m)}` : ""} s.` };
        }
        if (kind === "room") {
          const n = pick([2, 3, 5, 6, 7]), k = rnd(2, 9), A = k * k * n;
          return { text: `Kvadrat formalı otağın sahəsi ${A} m²-dir. Otağın tərəfi neçə metrdir?`, answer: k * Math.sqrt(n), unit: "m", show: kr(k, n),
            solution: `Tərəf = √${A} = √(${k * k}·${n}) = ${kr(k, n)} m.` };
        }
        if (kind === "diag") {
          const a = rnd(2, 15);
          return { text: `Kvadratın tərəfi ${a} sm-dir. Onun diaqonalı neçə sm-dir?`, answer: a * Math.SQRT2, unit: "sm", show: kr(a, 2),
            solution: `Pifaqor teoremi: d = √(${a}² + ${a}²) = √(2·${a * a}) = ${kr(a, 2)} sm.` };
        }
        let c, a, r; do { c = rnd(3, 10); a = rnd(1, c - 1); r = c * c - a * a; } while (isSq(r));
        const [k, m] = simp(r);
        return { text: `${c} m uzunluğunda nərdivan divara söykənib. Aşağı ucu divardan ${a} m aralıdır. Yuxarı ucu yerdən neçə m hündürdədir?`, answer: Math.sqrt(r), unit: "m", show: kr(k, m),
          solution: `Pifaqor: √(${c}² − ${a}²) = √${r}${k > 1 ? ` = ${kr(k, m)}` : ""} m.` };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (no modulus, split root of a sum, wrong conjugate, forgotten middle term, ...).
  const { ae, again } = Oyun;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const ex = (c0, c1, n) => { const t = kr(Math.abs(c1), n); return c0 === 0 ? (c1 < 0 ? "−" : "") + t : S(c0) + (c1 < 0 ? " − " : " + ") + t; };   // c0 + c1√n as text
  const id = x => x;
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. √(a²) = |a| with an irrational number inside
    { tip: "qapali", gen: () => again(() => {
      let p; do { p = rnd(3, 60); } while (isSq(p));
      const q = Math.floor(Math.sqrt(p));
      return mc(ae(ex(0, 1, p), [ex(2 * q, -1, p), ex(2 * q, 1, p), ex(-2 * q, 1, p), ex(q, 1, p)], id),
        { text: `√((${q} − √${p})²) + ${q} ifadəsinin qiymətini tapın.`,
          solution: `√(a²) = |a|. ${q} = √${q * q} < √${p}, ona görə ${q} − √${p} mənfidir və |${q} − √${p}| = √${p} − ${q}. Cavab: √${p} − ${q} + ${q} = √${p}. Tələ: modulsuz yazmaq (${q} − √${p} + ${q} = ${ex(2 * q, -1, p)}); modulu açanda işarəni səhv qoymaq (${ex(2 * q, 1, p)}, ${ex(-2 * q, 1, p)}).` });
    }) },
    // 2. several roots → one k√n
    { tip: "qapali", gen: () => again(() => {
      const n = pick([2, 3, 5, 7]), k1 = rnd(2, 9), k2 = rnd(2, 9), k3 = rnd(2, 9), K = k1 - k2 + k3;
      if (K <= 0 || k1 === k2 || k3 === k2 || k1 - k2 - k3 === 0 || k1 * k1 - k2 * k2 + k3 * k3 <= 0) return null;
      const [t, m] = simp(n * (k1 * k1 - k2 * k2 + k3 * k3));
      return mc(ae(kr(K, n), [kr(t, m), kr(k1 + k2 + k3, n), kr(k1 - k2 - k3, n), String(K)], id),
        { text: `√${k1 * k1 * n} − √${k2 * k2 * n} + √${k3 * k3 * n} ifadəsini sadələşdirin.`,
          solution: `√${k1 * k1 * n} = ${kr(k1, n)}, √${k2 * k2 * n} = ${kr(k2, n)}, √${k3 * k3 * n} = ${kr(k3, n)}. Bənzər köklər: (${k1} − ${k2} + ${k3})√${n} = ${kr(K, n)}. Tələ: kök altındakıları birləşdirmək (${k1 * k1 * n} − ${k2 * k2 * n} + ${k3 * k3 * n} kök altında → ${kr(t, m)}), işarəni səhv qoymaq, √${n} vuruğunu atıb yalnız əmsalı yazmaq (${K}).` });
    }) },
    // 3. rationalise k/(√a − √b)
    { tip: "qapali", gen: () => again(() => {
      const a = pick(FREE), b = pick(FREE); if (a <= b || a - b < 2) return null;
      const d = a - b, m = rnd(1, 4), c = d * m;
      return mc(ae(`${kr(m, a)} + ${kr(m, b)}`, [`${kr(m, a)} − ${kr(m, b)}`, `${kr(c, a)} + ${kr(c, b)}`, String(m), `−${kr(m, a)} − ${kr(m, b)}`], id),
        { text: `${c}/(√${a} − √${b}) ifadəsini sadələşdirin.`,
          solution: `Surəti və məxrəci qoşma ifadəyə (√${a} + √${b}) vururuq: ${c}(√${a} + √${b})/((√${a})² − (√${b})²) = ${c}(√${a} + √${b})/${d} = ${kr(m, a)} + ${kr(m, b)}. Tələ: qoşmanı səhv seçmək (${kr(m, a)} − ${kr(m, b)}), alınan məxrəcə (${d}) bölməyi unutmaq (${kr(c, a)} + ${kr(c, b)}), surətə vurmağı unutmaq (${c}/${d} = ${m}), məxrəci b − a kimi yazmaq (−${kr(m, a)} − ${kr(m, b)}).` });
    }) },
    // 4. (a ± √b)² — the middle term
    { tip: "qapali", gen: () => again(() => {
      const a = rnd(2, 7), b = pick(FREE), s = pick([1, -1]);
      return mc(ae(ex(a * a + b, 2 * s * a, b), [String(a * a + b), ex(a * a + b, s * a, b), ex(a * a + b, -2 * s * a, b), ex(a * a, 2 * s * a + 1, b)], id),
        { text: `(${a} ${s > 0 ? "+" : "−"} √${b})² ifadəsini sadələşdirin.`,
          solution: `(x ${s > 0 ? "+" : "−"} y)² = x² ${s > 0 ? "+" : "−"} 2xy + y². ${a}² = ${a * a}, (√${b})² = ${b}, 2·${a}·√${b} = ${kr(2 * a, b)}. Cavab: ${ex(a * a + b, 2 * s * a, b)}. Tələ: orta həddi unutmaq (${a * a + b}), orta həddi 2-siz yazmaq (${ex(a * a + b, s * a, b)}), işarəni dəyişmək (${ex(a * a + b, -2 * s * a, b)}), (√${b})² əvəzinə √${b} yazmaq (${ex(a * a, 2 * s * a + 1, b)}).` });
    }) },
    // 5. √(a² + b²) ≠ a + b
    { tip: "qapali", gen: () => again(() => {
      const [a0, b0, h0] = pick(TRIPLES), [d0, e0, c0] = pick(TRIPLES), k = pick([1, 1, 2]), l = pick([1, 1, 2]);
      const a = k * a0, b = k * b0, h = k * h0, d = l * d0, e = l * e0, c = l * c0;
      if (c > 45 || h > 45 || h <= e) return null;
      const w = [(a + b) - (c - d), h - (c - d), (a + b) - e, h + e];
      return mc(ae(h - e, w), { text: `√(${a}² + ${b}²) − √(${c}² − ${d}²) ifadəsinin qiymətini tapın.`,
        solution: `${a}² + ${b}² = ${a * a + b * b} = ${h}², ona görə √(${a}² + ${b}²) = ${h}. ${c}² − ${d}² = ${c * c - d * d} = ${e}², √(${c}² − ${d}²) = ${e}. Cavab: ${h} − ${e} = ${h - e}. Tələ: cəmin və ya fərqin kökünü ayrıca köklərin cəmi/fərqi kimi yazmaq: √(${a}² + ${b}²) ≠ ${a} + ${b}, √(${c}² − ${d}²) ≠ ${c} − ${d}.` });
    }) },
    // 6. between which natural numbers
    { tip: "qapali", gen: () => again(() => {
      const n = pick([2, 3, 5, 6, 7, 10, 11, 13]), k = rnd(2, 6), m = k * k * n, f = Math.floor(Math.sqrt(m)), fn = Math.floor(Math.sqrt(n));
      const iv = x => `${x} və ${x + 1}`;
      return mc(ae(iv(f), [iv(k * fn), iv(k * (fn + 1)), iv(k + fn), iv(f + 1)], id),
        { text: `${kr(k, n)} ədədi hansı iki ardıcıl natural ədəd arasındadır?`,
          solution: `${kr(k, n)} = √${m}. ${f}² = ${f * f} < ${m} < ${(f + 1) ** 2} = ${f + 1}², ona görə ${f} < ${kr(k, n)} < ${f + 1}. Tələ: yalnız kökü (√${n}) qiymətləndirib əmsala vurmaq (${k}·${fn} = ${k * fn}, ${k}·${fn + 1} = ${k * (fn + 1)}), əmsalı kökün qiymətinə əlavə etmək (${k} + ${fn}).` });
    }) },
    // 7. coded: nested radicals √(a + b + 2m√b) = m + √b  (a = m²)
    { tip: "kod", gen: () => again(() => {
      const m = rnd(2, 6), a = m * m, b = rnd(2, a - 1); if (isSq(b)) return null;
      const S0 = a + b;
      return { text: `√(${S0} + ${2 * m}√${b}) + √(${S0} − ${2 * m}√${b}) ifadəsinin qiymətini tapın.`,
        answer: 2 * m, show: String(2 * m), tol: 1e-6,
        solution: `${S0} = ${a} + ${b}, ${2 * m}√${b} = 2·${m}·√${b}. Ona görə ${S0} + ${2 * m}√${b} = (${m} + √${b})² və ${S0} − ${2 * m}√${b} = (${m} − √${b})². √(x²) = |x|: |${m} + √${b}| + |${m} − √${b}|. ${m} = √${a} > √${b}, ona görə ikinci mötərizə müsbətdir: (${m} + √${b}) + (${m} − √${b}) = ${2 * m}.` };
    }) },
    // 8. coded: x = c/(s − √b), y = c/(s + √b), x² + y²
    { tip: "kod", gen: () => again(() => {
      const s = rnd(2, 6), d = pick([1, 1, 2, 3, 4, 5]), b = s * s - d, c = rnd(1, 6); if (b < 2 || isSq(b)) return null;
      const ans = c * c * (4 * s * s - 2 * d) / (d * d); if (!Number.isInteger(ans)) return null;
      const sum = 2 * c * s / d, prod = c * c / d;
      return { text: `x = ${c}/(${s} − √${b}), y = ${c}/(${s} + √${b}) olduqda x² + y² ifadəsinin qiymətini tapın.`,
        answer: ans, show: String(ans), tol: 1e-6,
        solution: `Qoşma ifadə: ${s}² − (√${b})² = ${d}. x = ${c}(${s} + √${b})/${d}, y = ${c}(${s} − √${b})/${d}. x + y = ${dec(sum)}, x·y = ${c * c}/${d} = ${dec(prod)}. x² + y² = (x + y)² − 2xy = ${dec(sum * sum)} − ${dec(2 * prod)} = ${ans}.` };
    }) },
    // 9. coded: how many integers between two numbers with roots
    { tip: "kod", gen: () => again(() => {
      const mk = () => { const n = pick([2, 3, 5, 6, 7, 10, 11, 13]), k = rnd(1, 6); return { k, n, m: k * k * n, v: k * Math.sqrt(n) }; };
      let x = mk(), y = mk(); if (x.v > y.v) [x, y] = [y, x];
      const cnt = Math.floor(y.v) - Math.floor(x.v); if (cnt < 3 || cnt > 9 || x.m === y.m) return null;
      const fx = Math.floor(Math.sqrt(x.m)), fy = Math.floor(Math.sqrt(y.m));
      const [p, q] = Math.random() < .5 ? [x, y] : [y, x];
      return { text: `${kr(p.k, p.n)} və ${kr(q.k, q.n)} ədədləri arasında neçə tam ədəd var?`, answer: cnt, show: String(cnt), tol: 1e-6,
        solution: `Hər ədədi kök altına sal: ${kr(x.k, x.n)} = √${x.m}, ${kr(y.k, y.n)} = √${y.m}. ${fx}² = ${fx * fx} < ${x.m} < ${(fx + 1) ** 2}, ona görə ${fx} < √${x.m} < ${fx + 1}; ${fy}² = ${fy * fy} < ${y.m} < ${(fy + 1) ** 2}, ona görə ${fy} < √${y.m} < ${fy + 1}. Aralarındakı tam ədədlər: ${fx + 1}, …, ${fy} — cəmi ${cnt} ədəd.` };
    }) },
    // 10. written: difference of two conjugate fractions; √a, √b simplify first
    { tip: "yazili", gen: () => again(() => {
      const n = pick([2, 3, 5, 6, 7, 10, 11]), u = rnd(2, 9), v = rnd(1, u - 1), a = n * u * u, b = n * v * v;
      const val = 4 * u * v / (u * u - v * v); if (!isNice(val, 2)) return null;
      return { text: `Hesablayın: (√${a} + √${b})/(√${a} − √${b}) − (√${a} − √${b})/(√${a} + √${b}).`,
        answer: val, show: dec(val), tol: 1e-6,
        solution: `1) Kökləri sadələşdir: √${a} = ${kr(u, n)}, √${b} = ${kr(v, n)}. 2) √${n} ixtisar olunur: (${u} + ${v})/(${u} − ${v}) − (${u} − ${v})/(${u} + ${v}) = ${u + v}/${u - v} − ${u - v}/${u + v}. 3) Ortaq məxrəc: (${(u + v) ** 2} − ${(u - v) ** 2})/${u * u - v * v} = ${4 * u * v}/${u * u - v * v} = ${dec(val)}. Cavab: ${dec(val)}. (Həll yazılmadan yalnız cavab — bal verilmir.)` };
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
      key: "kvadrat-kok", title: "Kvadrat kök, hesabi kökün xassələri", fenn: "riyaziyyat", link: "dersler/kvadrat-kok.html",
      format: "Cavab ədəddir: tam 12, mənfi −3, kəsr 5/4, onluq 0,7 (və ya 0.7), kök: 3√2 (yaz: 3√2 və ya 3sqrt2), √7.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["hesabi", "hesabi", "xasse", "xasse", "cixar", "cixar", "cevir", "irr", "irr", "hesab"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/kvadrat-kok.html")) b.push("dersler/kvadrat-kok.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
