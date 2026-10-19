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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "kvadrat-kok", title: "Kvadrat kök, hesabi kökün xassələri", fenn: "riyaziyyat", link: "dersler/kvadrat-kok.html",
      format: "Cavab ədəddir: tam 12, mənfi −3, kəsr 5/4, onluq 0,7 (və ya 0.7), kök: 3√2 (yaz: 3√2 və ya 3sqrt2), √7.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["hesabi", "hesabi", "xasse", "xasse", "cixar", "cixar", "cevir", "irr", "irr", "hesab"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/kvadrat-kok.html")) b.push("dersler/kvadrat-kok.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
