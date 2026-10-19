// İkidəyişənli xətti tənliklər sistemi — mastery game levels (substitution, addition, graphical meaning,
// number of solutions, parameter, word problems, find-the-mistake) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);                       // number with a real minus sign
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);                  // bracket negatives when substituted
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  // polynomial from [coef, "x"|"y"|""] terms: [[2,"x"],[-3,"y"]] → "2x − 3y"
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const E = (a, b, c) => `${poly([[a, "x"], [b, "y"]])} = ${S(c)}`;   // ax + by = c
  const solve = (c, r, v) => (c === 1 ? "" : `${poly([[c, v]])} = ${S(r)} → `) + `${v} = ${frac(r, c)}`;
  const cm = k => k === 1 ? "" : k === -1 ? "−" : S(k) + "·";        // coefficient before a substituted value
  const cb = k => k === 1 ? "" : k === -1 ? "−" : S(k);              // coefficient before a bracket
  const nz = (a, b) => { let v; do v = rnd(a, b); while (!v); return v; };
  // system on two lines with a brace, then the question
  const sys = (e1, e2, ask) => h("div", {}, "Sistem:", h("br"), "⎧ " + e1, h("br"), "⎩ " + e2, h("br"), ask);
  const ASK = { x: ["x = ?", (x, y) => x], y: ["y = ?", (x, y) => y], s: ["x + y = ?", (x, y) => x + y], p: ["x·y = ?", (x, y) => x * y] };

  const levels = [
    { id: "yerine", ad: "Yerinə qoyma üsulu", izah: "Bir tənlikdən x-i (və ya y-i) ifadə et, o biri tənlikdə yerinə qoy. Birdəyişənli tənlik alınır.",
      gen() {
        const x0 = rnd(-5, 8), y0 = rnd(-5, 8), ask = pick(["x", "y", "s", "p"]), [q, f] = ASK[ask], ans = f(x0, y0);
        if (Math.random() < .5) { // y = kx + m
          let k, a2, b2; do { k = nz(-4, 4); a2 = nz(-6, 6); b2 = nz(-6, 6); } while (a2 + b2 * k === 0);
          const m = y0 - k * x0, c2 = a2 * x0 + b2 * y0, rhs = poly([[k, "x"], [m, ""]]);
          return { text: sys(`y = ${rhs}`, E(a2, b2, c2), q), answer: ans, show: S(ans), tol: 0.01,
            solution: `y-i ikinci tənlikdə yerinə qoy: ${poly([[a2, "x"]])} ${b2 < 0 ? "−" : "+"} ${Math.abs(b2) === 1 ? "" : Math.abs(b2)}(${rhs}) = ${S(c2)} → ${poly([[a2 + b2 * k, "x"], [b2 * m, ""]])} = ${S(c2)} → ${solve(a2 + b2 * k, c2 - b2 * m, "x")}. y = ${cm(k)}${P(x0)}${m ? (m < 0 ? " − " : " + ") + Math.abs(m) : ""} = ${S(y0)}. Həll: (${S(x0)}; ${S(y0)}). Cavab: ${S(ans)}.` };
        }
        let b1, a2, b2; do { b1 = nz(-4, 4); a2 = nz(-6, 6); b2 = nz(-6, 6); } while (b2 - a2 * b1 === 0);
        const c1 = x0 + b1 * y0, c2 = a2 * x0 + b2 * y0, xe = poly([[c1, ""], [-b1, "y"]]);
        return { text: sys(E(1, b1, c1), E(a2, b2, c2), q), answer: ans, show: S(ans), tol: 0.01,
          solution: `Birincidən: x = ${xe}. İkincidə yerinə qoy: ${cb(a2)}(${xe}) ${b2 < 0 ? "−" : "+"} ${poly([[Math.abs(b2), "y"]])} = ${S(c2)} → ${poly([[b2 - a2 * b1, "y"], [a2 * c1, ""]])} = ${S(c2)} → ${solve(b2 - a2 * b1, c2 - a2 * c1, "y")}. x = ${S(c1)} ${-b1 * y0 < 0 ? "−" : "+"} ${Math.abs(b1 * y0)} = ${S(x0)}. Həll: (${S(x0)}; ${S(y0)}). Cavab: ${S(ans)}.` };
      } },
    { id: "toplama", ad: "Toplama üsulu", izah: "Tənlikləri elə ədədlərə vur ki, y-in (və ya x-in) əmsalları əks və ya bərabər olsun; sonra topla və ya çıx.",
      gen() {
        if (Math.random() < .3) { // symmetric: ax + by = c1, bx + ay = c2
          let a, b; do { a = rnd(1, 9); b = rnd(1, 9); } while (a === b);
          const x0 = rnd(-5, 8), y0 = rnd(-5, 8), c1 = a * x0 + b * y0, c2 = b * x0 + a * y0, sum = Math.random() < .5;
          const ans = sum ? x0 + y0 : x0 - y0;
          return { text: sys(E(a, b, c1), E(b, a, c2), sum ? "x + y = ?" : "x − y = ?"), answer: ans, show: S(ans), tol: 0.01,
            solution: sum ? `Tənlikləri topla: ${a + b}x + ${a + b}y = ${S(c1 + c2)} → ${a + b}(x + y) = ${S(c1 + c2)} → x + y = ${S(ans)}. Sistemi tam həll etmək lazım deyil!`
              : `Birincidən ikincini çıx: ${poly([[a - b, "x"], [b - a, "y"]])} = ${S(c1 - c2)} → ${S(a - b)}(x − y) = ${S(c1 - c2)} → x − y = ${S(ans)}. Sistemi tam həll etmək lazım deyil!` };
        }
        let a1, b1, a2, b2; do { a1 = nz(-7, 7); b1 = nz(-7, 7); a2 = nz(-7, 7); b2 = nz(-7, 7); } while (a1 * b2 - a2 * b1 === 0 || Math.abs(b1) === Math.abs(b2) && Math.random() < .5);
        const x0 = rnd(-5, 8), y0 = rnd(-5, 8), c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 + b2 * y0;
        const g = gcd(b1, b2), m1 = Math.abs(b2) / g, m2 = Math.abs(b1) / g, add = (b1 > 0) !== (b2 > 0);
        const A = add ? m1 * a1 + m2 * a2 : m1 * a1 - m2 * a2, C = add ? m1 * c1 + m2 * c2 : m1 * c1 - m2 * c2;
        const ask = pick(["x", "y", "s"]), [q, f] = ASK[ask], ans = f(x0, y0);
        return { text: sys(E(a1, b1, c1), E(a2, b2, c2), q), answer: ans, show: S(ans), tol: 0.01,
          solution: `y-i yox edək. ` + (m1 !== 1 ? `Birinci × ${m1}: ${E(m1 * a1, m1 * b1, m1 * c1)}. ` : "") + (m2 !== 1 ? `İkinci × ${m2}: ${E(m2 * a2, m2 * b2, m2 * c2)}. ` : "") +
            `${add ? "Topla" : "Birincidən ikincini çıx"}: ${solve(A, C, "x")}. Birincidə yerinə qoy: ${cm(a1)}${P(x0)} ${b1 < 0 ? "−" : "+"} ${poly([[Math.abs(b1), "y"]])} = ${S(c1)} → ${solve(b1, c1 - a1 * x0, "y")}. Həll: (${S(x0)}; ${S(y0)}). Cavab: ${S(ans)}.` };
      } },
    { id: "qrafik", ad: "Qrafik məna", izah: "Hər xətti tənliyin qrafiki düz xətdir. Sistemin həlli — xətlərin kəsişmə nöqtəsidir: o, hər iki tənliyi ödəyir.",
      gen() {
        const kind = pick(["kes", "kes", "b", "ox"]);
        if (kind === "kes") {
          let k1, k2; do { k1 = rnd(-4, 4); k2 = rnd(-4, 4); } while (k1 === k2);
          const x0 = rnd(-4, 5), y0 = rnd(-5, 6), m1 = y0 - k1 * x0, m2 = y0 - k2 * x0, ab = Math.random() < .5, ans = ab ? x0 : y0;
          const r1 = poly([[k1, "x"], [m1, ""]]), r2 = poly([[k2, "x"], [m2, ""]]);
          return { text: `y = ${r1} və y = ${r2} xətləri kəsişir. Kəsişmə nöqtəsinin ${ab ? "absisini" : "ordinatını"} tap.`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Kəsişmə nöqtəsi hər iki xəttin üzərindədir, y-lər bərabərdir: ${r1} = ${r2} → ${solve(k1 - k2, m2 - m1, "x")}. y = ${S(y0)}. Nöqtə (${S(x0)}; ${S(y0)}). Cavab: ${S(ans)}.` };
        }
        if (kind === "b") {
          let k1, k2; do { k1 = rnd(-4, 4); k2 = nz(-4, 4); } while (k1 === k2);
          const x0 = nz(-4, 5), m1 = rnd(-6, 6), y0 = k1 * x0 + m1, b = y0 - k2 * x0;
          return { text: `y = ${poly([[k1, "x"], [m1, ""]])} və y = ${poly([[k2, "x"]])} + b xətləri absisi ${S(x0)} olan nöqtədə kəsişir. b = ?`, answer: b, show: S(b), tol: 0.01,
            solution: `x = ${S(x0)} olanda birinci xətt: y = ${k1 ? cm(k1) + P(x0) + (m1 ? (m1 < 0 ? " − " : " + ") + Math.abs(m1) : "") : S(m1)} = ${S(y0)}. Kəsişmə nöqtəsi (${S(x0)}; ${S(y0)}) ikinci xəttin də üzərindədir: ${S(y0)} = ${cm(k2)}${P(x0)} + b → b = ${S(b)}.` };
        }
        const a = nz(-6, 6), b = nz(-6, 6), c = nz(-12, 12), ox = Math.random() < .5;
        return { text: `${E(a, b, c)} xətti ${ox ? "absis (Ox)" : "ordinat (Oy)"} oxunu hansı nöqtədə kəsir? Həmin nöqtənin ${ox ? "absisini" : "ordinatını"} tap.`, answer: ox ? c / a : c / b, show: ox ? frac(c, a) : frac(c, b), tol: 0.01, placeholder: "məs. 5/2",
          solution: ox ? `Ox oxu üzərində y = 0: ${poly([[a, "x"]])} = ${S(c)} → x = ${frac(c, a)}. Nöqtə (${frac(c, a)}; 0).` : `Oy oxu üzərində x = 0: ${poly([[b, "y"]])} = ${S(c)} → y = ${frac(c, b)}. Nöqtə (0; ${frac(c, b)}).` };
      } },
    { id: "say", ad: "Neçə həll var?", izah: "a₁/a₂ ≠ b₁/b₂ — bir həll (xətlər kəsişir). a₁/a₂ = b₁/b₂ ≠ c₁/c₂ — həll yoxdur (paralel). Hamısı bərabər — sonsuz sayda (üst-üstə düşür).",
      gen() {
        const names = ["Bir həll", "Həll yoxdur", "Sonsuz sayda həll"], kind = rnd(0, 2);
        const a1 = nz(-6, 6), b1 = nz(-6, 6), c1 = nz(-9, 9);
        let q1 = [a1, b1, c1], q2;
        if (kind === 0) { let a2, b2; do { a2 = nz(-6, 6); b2 = nz(-6, 6); } while (a1 * b2 === a2 * b1); q2 = [a2, b2, rnd(-9, 9)]; }
        else { const t = pick([2, 3, 4, -1, -2, -3]), d = kind === 1 ? nz(-5, 5) : 0; q2 = [t * a1, t * b1, t * c1 + d]; }
        if (Math.random() < .5) [q1, q2] = [q2, q1];
        const [A1, B1, C1] = q1, [A2, B2, C2] = q2;
        let why = `a₁/a₂ = ${frac(A1, A2)}, b₁/b₂ = ${frac(B1, B2)}`;
        if (kind === 0) why += ` — bərabər deyil. Xətlər kəsişir: bir həll.`;
        else why += ` — bərabərdir. ` + (C2 ? `c₁/c₂ = ${frac(C1, C2)}` : `c₂ = 0, c₁ ≠ 0`) + (kind === 1
          ? ` — fərqlidir. Sol tərəflər mütənasib, sağ tərəflər yox: xətlər paraleldir, həll yoxdur.`
          : ` — o da bərabərdir. Bir tənlik digərinin ${frac(A2, A1)} mislidir — eyni xətt: sonsuz sayda həll.`);
        return { text: sys(E(A1, B1, C1), E(A2, B2, C2), "Sistemin neçə həlli var?"), choices: names, correct: kind, show: names[kind], solution: why };
      } },
    { id: "parametr", ad: "Parametrli sistem", izah: "Həll yoxdur: a₁/a₂ = b₁/b₂ ≠ c₁/c₂. Sonsuz həll: a₁/a₂ = b₁/b₂ = c₁/c₂. Paralel xətlər: bucaq əmsalları bərabər.",
      gen() {
        const kind = pick(["yox", "yox", "sonsuz", "paralel"]);
        if (kind === "yox") {
          let p, q, m, n, c1, c2; do { p = nz(-5, 5); q = nz(-5, 5); m = nz(-4, 4); n = nz(-4, 4); c1 = nz(-9, 9); c2 = nz(-9, 9); } while (c1 * m === c2 * n || m === n);
          const inX = Math.random() < .5, a = inX ? n * p : n * q;   // first: (np)x + (nq)y = c1, second: (mp)x + (mq)y = c2
          const e1 = inX ? `ax ${n * q < 0 ? "−" : "+"} ${poly([[Math.abs(n * q), "y"]])} = ${S(c1)}` : `${poly([[n * p, "x"]])} + ay = ${S(c1)}`;
          const known = inX ? [n * q, m * q] : [n * p, m * p], other = inX ? m * p : m * q;
          return { text: sys(e1, E(m * p, m * q, c2), "a-nın hansı qiymətində sistemin həlli yoxdur?"), answer: a, show: S(a), tol: 0.01,
            solution: `Həll yoxdur ⇔ xətlər paraleldir: ${inX ? "a₁/a₂ = b₁/b₂" : "b₁/b₂ = a₁/a₂"}, amma c₁/c₂ fərqlidir. a/${P(other)} = ${S(known[0])}/${P(known[1])}${`${S(known[0])}/${P(known[1])}` === frac(known[0], known[1]) ? "" : " = " + frac(known[0], known[1])} → a = ${S(a)}. c₁/c₂ = ${frac(c1, c2)} ≠ ${frac(known[0], known[1])} ✓ (bərabər olsaydı, sonsuz həll olardı).` };
        }
        if (kind === "sonsuz") {
          let p, q, r, m, n; do { p = nz(-5, 5); q = nz(-5, 5); r = nz(-6, 6); m = nz(-4, 4); n = nz(-4, 4); } while (m === n);
          const a = m * q, b = m * r;
          return { text: sys(E(n * p, n * q, n * r), `${poly([[m * p, "x"]])} + ay = b`, "a və b-nin hansı qiymətlərində sistemin sonsuz sayda həlli var? a + b = ?"), answer: a + b, show: S(a + b), tol: 0.01,
            solution: `Sonsuz həll ⇔ bütün əmsallar mütənasibdir: ${S(m * p)}/${P(n * p)} = a/${P(n * q)} = b/${P(n * r)}. Nisbət ${frac(m, n)} → a = ${frac(m, n)}·${P(n * q)} = ${S(a)}, b = ${frac(m, n)}·${P(n * r)} = ${S(b)}. a + b = ${S(a + b)}.` };
        }
        let a, p, q, m1, m2; do { a = rnd(-5, 6); p = pick([1, 2, 3, -1, -2]); q = rnd(-6, 6); m1 = nz(-6, 6); m2 = rnd(-6, 6); } while (m1 === m2);
        const k = p * a + q;
        return { text: `y = (${poly([[p, "a"], [q, ""]])})x ${m1 < 0 ? "−" : "+"} ${Math.abs(m1)} və y = ${poly([[k, "x"], [m2, ""]])} xətləri paraleldir. a = ?`, answer: a, show: S(a), tol: 0.01,
          solution: `Paralel xətlərin bucaq əmsalları bərabərdir (sərbəst hədlər ${S(m1)} və ${S(m2)} fərqlidir — üst-üstə düşmür): ${poly([[p, "a"], [q, ""]])} = ${S(k)} → ${solve(p, k - q, "a")}. Belə sistemin həlli yoxdur.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "İki naməlum — iki şərt — iki tənlik. x və y-in nə olduğunu əvvəlcə yaz.",
      gen() {
        const kind = pick(["bilet", "toyuq", "qayiq", "eded"]);
        if (kind === "bilet") {
          let x, y, a1, b1, a2, b2; do { x = rnd(4, 15); y = rnd(2, x - 1); a1 = rnd(1, 5); b1 = rnd(1, 5); a2 = rnd(1, 5); b2 = rnd(1, 5); } while (a1 * b2 === a2 * b1);
          const P1 = a1 * x + b1 * y, P2 = a2 * x + b2 * y, big = Math.random() < .5, ans = big ? x : y;
          const D = a1 * b2 - a2 * b1;
          return { text: `${a1} böyük və ${b1} uşaq bileti ${P1} manat, ${a2} böyük və ${b2} uşaq bileti ${P2} manat edir. ${big ? "Böyük" : "Uşaq"} bileti neçə manatdır?`, answer: ans, show: String(ans), tol: 0.01, unit: "manat",
            solution: `x — böyük, y — uşaq bileti: ${E(a1, b1, P1)}, ${E(a2, b2, P2)}. y-i yox et: birinci × ${b2}, ikinci × ${b1}, çıx: ${solve(D, P1 * b2 - P2 * b1, "x")}. Onda ${b1 === 1 ? "" : b1}y = ${P1} − ${a1 * x} → y = ${y}. Yoxla: ${a2}·${x} + ${b2}·${y} = ${P2} ✓.` };
        }
        if (kind === "toyuq") {
          const x = rnd(3, 30), y = rnd(3, 30), H = x + y, L = 2 * x + 4 * y, r = Math.random() < .5;
          return { text: `Həyətdə toyuqlar və dovşanlar var: cəmi ${H} baş və ${L} ayaq. ${r ? "Dovşanların" : "Toyuqların"} sayını tap.`, answer: r ? y : x, show: String(r ? y : x), tol: 0.01,
            solution: `x — toyuq, y — dovşan: x + y = ${H}, 2x + 4y = ${L}. Birinci × 2: 2x + 2y = ${2 * H}. Çıx: 2y = ${L - 2 * H} → y = ${y}, x = ${H} − ${y} = ${x}. Yoxla: 2·${x} + 4·${y} = ${L} ✓.` };
        }
        if (kind === "qayiq") {
          let v, u; do { v = rnd(8, 25); u = rnd(1, 5); } while (u >= v - 2);
          const t1 = rnd(2, 5), t2 = rnd(2, 5), D1 = (v + u) * t1, D2 = (v - u) * t2, own = Math.random() < .5;
          return { text: `Qayıq axın istiqamətində ${t1} saatda ${D1} km, axına qarşı ${t2} saatda ${D2} km üzür. ${own ? "Qayığın durğun sudakı sürəti" : "Çayın axın sürəti"} neçə km/saatdır?`, answer: own ? v : u, show: String(own ? v : u), tol: 0.01, unit: "km/saat",
            solution: `x — qayığın öz sürəti, y — axın. x + y = ${D1}/${t1} = ${v + u}, x − y = ${D2}/${t2} = ${v - u}. Topla: 2x = ${2 * v} → x = ${v}; y = ${v + u} − ${v} = ${u}.` };
        }
        const y = rnd(2, 40), k = rnd(2, 4), d = rnd(1, 9), x = k * y + d, sm = x + y, big = Math.random() < .5;
        return { text: `İki ədədin cəmi ${sm} olur. Böyük ədəd kiçiyin ${k} mislindən ${d} vahid çoxdur. ${big ? "Böyük" : "Kiçik"} ədədi tap.`, answer: big ? x : y, show: String(big ? x : y), tol: 0.01,
          solution: `x — böyük, y — kiçik: x + y = ${sm}, x = ${k}y + ${d}. Yerinə qoy: ${k}y + ${d} + y = ${sm} → ${k + 1}y = ${sm - d} → y = ${y}, x = ${x}. Yoxla: ${x} + ${y} = ${sm} ✓.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let x0, y0, a1, a2, b1; do { x0 = rnd(-6, 7); y0 = nz(-6, 7); a1 = rnd(1, 6); a2 = rnd(1, 6); b1 = rnd(1, 6); } while (Math.abs(x0) <= 1 || a2 * x0 - b1 * y0 === 0);
        const c1 = a1 * x0 + b1 * y0, c2 = a2 * x0 - b1 * y0, A = a1 + a2, bad = rnd(0, 2);
        const step3 = (xs, xn, xd) => `Birincidə yerinə qoy: ${a1 === 1 ? "" : a1 + "·"}${xd === 1 ? P(xn) : "(" + xs + ")"} + ${poly([[b1, "y"]])} = ${S(c1)} → y = ${frac(c1 * xd - a1 * xn, b1 * xd)}.`;
        const steps = [`Tənlikləri topla (y yox olur): ${A}x = ${S(c1 + c2)}.`, `x = ${S(x0)}.`, step3(S(x0), x0, 1)];
        if (bad === 0) { const n = c1 - c2; steps[0] = `Tənlikləri topla (y yox olur): ${A}x = ${S(n)}.`; const g = gcd(n, A) || 1; steps[1] = `x = ${frac(n, A)}.`; steps[2] = step3(frac(n, A), n / g, A / g); }
        if (bad === 1) { const n = c1 + c2, g = gcd(n, A); steps[1] = `x = ${frac(A, n)}.`; steps[2] = step3(frac(A, n), Math.sign(n) * A / g, Math.abs(n) / g); }
        if (bad === 2) steps[2] = `Birincidə yerinə qoy: ${a1 === 1 ? "" : a1 + "·"}${P(x0)} + ${poly([[b1, "y"]])} = ${S(c1)} → ${poly([[b1, "y"]])} = ${S(c1)} + ${a1 * x0 < 0 ? "(" + S(a1 * x0) + ")" : a1 * x0} → y = ${frac(c1 + a1 * x0, b1)}.`;
        const text = h("div", {}, h("p", {}, "Sistem: ", E(a1, b1, c1), ";  ", E(a2, -b1, c2), "."),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: toplayanda sağ tərəflər də toplanır: ${S(c1)} + ${P(c2)} = ${S(c1 + c2)}.`,
          `2-ci addım: ${A}x = ${S(c1 + c2)} → x = ${S(c1 + c2)}/${A} = ${S(x0)} (bölməni tərsinə etmək olmaz).`,
          `3-cü addım: ${cm(a1)}${P(x0)} həddini sağa keçirəndə onun işarəsi dəyişir: ${poly([[b1, "y"]])} = ${S(c1)} − ${P(a1 * x0)} = ${S(c1 - a1 * x0)} → y = ${S(y0)}.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "xetti-sistem", title: "İkidəyişənli xətti tənliklər sistemi", fenn: "riyaziyyat", link: "dersler/xetti-sistem.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 5/2 (onluq 2.5 də olar). Həllərin sayı soruşulanda variant seç.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["yerine", "yerine", "toplama", "toplama", "qrafik", "say", "parametr", "parametr", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/xetti-sistem.html")) b.push("dersler/xetti-sistem.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
