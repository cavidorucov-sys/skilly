// Eynilik çevirmələri, simmetrik çoxhədlilər (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);                                  // real minus sign
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);                            // bracket negatives inside products / powers
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const nz = (a, b) => { let v = 0; while (!v) v = rnd(a, b); return v; };
  // √n simplified: 50 → "5√2", 49 → "7"
  const root = n => { let k = 1, m = n; for (let d = 2; d * d <= m; d++) while (m % (d * d) === 0) { m /= d * d; k *= d; } return m === 1 ? String(k) : (k === 1 ? "" : k) + "√" + m; };
  const EX = 0.01;
  const SUP = { 2: "²", 4: "⁴", 8: "⁸", 16: "¹⁶" };

  const levels = [
    { id: "sp", ad: "a + b və ab", izah: "Hər simmetrik ifadəni s = a + b və p = ab ilə yaz: a² + b² = s² − 2p, a³ + b³ = s³ − 3ps, (a − b)² = s² − 4p.",
      gen() {
        let s, p; do { s = nz(-9, 9); p = nz(-12, 12); } while (s * s < 4 * p);
        const ask = pick(["sq", "sq", "dif2", "cube", "cube", "four", "inv", "mix", "ratio", "abs"]);
        const head = `a + b = ${S(s)}, ab = ${S(p)}.`, q2 = s * s - 2 * p;
        if (ask === "sq") return { text: `${head} a² + b² = ?`, answer: q2, show: S(q2), tol: EX,
          solution: `a² + b² = (a + b)² − 2ab = ${P(s)}² − 2 · ${P(p)} = ${s * s} ${p < 0 ? "+ " + 2 * -p : "− " + 2 * p} = ${S(q2)}.` };
        if (ask === "dif2") { const v = s * s - 4 * p;
          return { text: `${head} (a − b)² = ?`, answer: v, show: S(v), tol: EX,
            solution: `(a − b)² = (a + b)² − 4ab = ${s * s} − 4 · ${P(p)} = ${S(v)}.` }; }
        if (ask === "abs") { if (s * s === 4 * p) p -= 1; const v = s * s - 4 * p;
          return { text: `a + b = ${S(s)}, ab = ${S(p)}. |a − b| = ?`, answer: Math.sqrt(v), show: root(v), placeholder: "məs. 2√7",
            solution: `(a − b)² = (a + b)² − 4ab = ${s * s} − 4 · ${P(p)} = ${v}. |a − b| = √${v} = ${root(v)}.` }; }
        if (ask === "cube") { const v = s ** 3 - 3 * p * s;
          return { text: `${head} a³ + b³ = ?`, answer: v, show: S(v), tol: EX,
            solution: `a³ + b³ = (a + b)³ − 3ab(a + b) = ${P(s)}³ − 3 · ${P(p)} · ${P(s)} = ${S(s ** 3)} ${-3 * p * s < 0 ? "− " + 3 * p * s : "+ " + -3 * p * s} = ${S(v)}.` }; }
        if (ask === "four") { const v = q2 * q2 - 2 * p * p;
          return { text: `${head} a⁴ + b⁴ = ?`, answer: v, show: S(v), tol: EX,
            solution: `a² + b² = ${P(s)}² − 2 · ${P(p)} = ${S(q2)}. a⁴ + b⁴ = (a² + b²)² − 2(ab)² = ${P(q2)}² − 2 · ${P(p)}² = ${q2 * q2} − ${2 * p * p} = ${S(v)}.` }; }
        if (ask === "inv") return { text: `${head} 1/a + 1/b = ?`, answer: s / p, show: frac(s, p), placeholder: "məs. −3/4",
          solution: `1/a + 1/b = (a + b)/(ab) = ${S(s)}/${P(p)} = ${frac(s, p)}.` };
        if (ask === "mix") return { text: `${head} a²b + ab² = ?`, answer: p * s, show: S(p * s), tol: EX,
          solution: `a²b + ab² = ab(a + b) = ${P(p)} · ${P(s)} = ${S(p * s)}.` };
        return { text: `${head} a/b + b/a = ?`, answer: q2 / p, show: frac(q2, p), placeholder: "məs. 7/3",
          solution: `a/b + b/a = (a² + b²)/(ab). a² + b² = ${P(s)}² − 2 · ${P(p)} = ${S(q2)}. ${S(q2)}/${P(p)} = ${frac(q2, p)}.` };
      } },
    { id: "ters", ad: "Başqa verilənlər", izah: "Verilənləri də s və p ilə yaz, s və ya p-ni tap, sonra lazım olan ifadəyə keç. a − b verilibsə: a² + b² = (a − b)² + 2ab.",
      gen() {
        const kind = pick(["sq2p", "sq2cube", "diff", "diffcube", "sumdiff", "q2s"]);
        if (kind === "sq2p" || kind === "sq2cube") { let s, p; do { s = nz(-8, 8); p = nz(-10, 10); } while (s * s < 4 * p); const q = s * s - 2 * p;
          if (kind === "sq2p") return { text: `a + b = ${S(s)}, a² + b² = ${q}. ab = ?`, answer: p, show: S(p), tol: EX,
            solution: `(a + b)² = a² + b² + 2ab → ${s * s} = ${q} + 2ab → ab = (${s * s} − ${q})/2 = ${S(p)}.` };
          const v = s ** 3 - 3 * p * s;
          return { text: `a + b = ${S(s)}, a² + b² = ${q}. a³ + b³ = ?`, answer: v, show: S(v), tol: EX,
            solution: `ab = (${s * s} − ${q})/2 = ${S(p)}. a³ + b³ = (a + b)(a² + b² − ab) = ${P(s)} · (${q} − ${P(p)}) = ${P(s)} · ${q - p} = ${S(v)}.` }; }
        if (kind === "diff" || kind === "diffcube") { let d, p; do { d = rnd(1, 9); p = nz(-12, 12); } while (d * d + 4 * p < 0);
          if (kind === "diff") { const v = d * d + 2 * p;
            return { text: `a − b = ${d}, ab = ${S(p)}. a² + b² = ?`, answer: v, show: S(v), tol: EX,
              solution: `a² + b² = (a − b)² + 2ab = ${d * d} + 2 · ${P(p)} = ${S(v)}.` }; }
          const v = d ** 3 + 3 * p * d;
          return { text: `a − b = ${d}, ab = ${S(p)}. a³ − b³ = ?`, answer: v, show: S(v), tol: EX,
            solution: `a³ − b³ = (a − b)³ + 3ab(a − b) = ${d ** 3} + 3 · ${P(p)} · ${d} = ${S(v)}.` }; }
        if (kind === "sumdiff") { const s = nz(-12, 12); let d; do { d = rnd(1, 12); } while (d === Math.abs(s)); const ab = Math.random() < .5;
          return ab ? { text: `a + b = ${S(s)}, a − b = ${d}. ab = ?`, answer: (s * s - d * d) / 4, show: frac(s * s - d * d, 4), placeholder: "məs. 15/4",
                        solution: `4ab = (a + b)² − (a − b)² = ${s * s} − ${d * d} = ${S(s * s - d * d)}. ab = ${frac(s * s - d * d, 4)}.` }
                    : { text: `a + b = ${S(s)}, a − b = ${d}. a² + b² = ?`, answer: (s * s + d * d) / 2, show: frac(s * s + d * d, 2), placeholder: "məs. 25/2",
                        solution: `(a + b)² + (a − b)² = 2(a² + b²) → a² + b² = (${s * s} + ${d * d})/2 = ${frac(s * s + d * d, 2)}.` }; }
        const p = nz(-10, 10), q = 2 * Math.abs(p) + rnd(0, 20), v = q + 2 * p;
        return { text: `a² + b² = ${q}, ab = ${S(p)}. (a + b)² = ?`, answer: v, show: S(v), tol: EX,
          solution: `(a + b)² = a² + b² + 2ab = ${q} + 2 · ${P(p)} = ${S(v)}.` };
      } },
    { id: "x1x", ad: "x + 1/x", izah: "x · (1/x) = 1 — buna görə x + 1/x = t olanda: x² + 1/x² = t² − 2, x³ + 1/x³ = t³ − 3t. x² − tx + 1 = 0 isə x-ə bölüb x + 1/x = t verir.",
      gen() {
        const kind = pick(["t", "t", "eq", "u", "back"]);
        if (kind === "back") { const q = rnd(3, 40), v = q + 2;
          return { text: `x > 0 və x² + 1/x² = ${q}. x + 1/x = ?`, answer: Math.sqrt(v), show: root(v), placeholder: "məs. 3√2",
            solution: `(x + 1/x)² = x² + 2 + 1/x² = ${q} + 2 = ${v}. x > 0 olduğundan x + 1/x > 0: x + 1/x = √${v} = ${root(v)}.` }; }
        if (kind === "u") { const u = nz(-6, 6), a2 = u * u + 2, ask = pick(["2", "4", "3"]);
          const head = `x − 1/x = ${S(u)}.`;
          if (ask === "2") return { text: `${head} x² + 1/x² = ?`, answer: a2, show: String(a2), tol: EX,
            solution: `(x − 1/x)² = x² − 2 + 1/x² → x² + 1/x² = ${P(u)}² + 2 = ${a2}.` };
          if (ask === "4") return { text: `${head} x⁴ + 1/x⁴ = ?`, answer: a2 * a2 - 2, show: String(a2 * a2 - 2), tol: EX,
            solution: `x² + 1/x² = ${P(u)}² + 2 = ${a2}. x⁴ + 1/x⁴ = (x² + 1/x²)² − 2 = ${a2 * a2} − 2 = ${a2 * a2 - 2}.` };
          const v = u ** 3 + 3 * u;
          return { text: `${head} x³ − 1/x³ = ?`, answer: v, show: S(v), tol: EX,
            solution: `x³ − 1/x³ = (x − 1/x)³ + 3(x − 1/x) = ${S(u ** 3)} + ${P(3 * u)} = ${S(v)}.` }; }
        const t = pick([-1, 1]) * rnd(3, 8), eq = kind === "eq", a2 = t * t - 2, ask = pick(["2", "3", "4", "m"]);
        const head = eq ? `x² ${t < 0 ? "+" : "−"} ${Math.abs(t)}x + 1 = 0.` : `x + 1/x = ${S(t)}.`;
        const pre = eq ? `x ≠ 0, tənliyi x-ə böl: x ${t < 0 ? "+" : "−"} ${Math.abs(t)} + 1/x = 0 → x + 1/x = ${S(t)}. ` : "";
        if (ask === "2") return { text: `${head} x² + 1/x² = ?`, answer: a2, show: String(a2), tol: EX,
          solution: pre + `x² + 1/x² = (x + 1/x)² − 2 = ${t * t} − 2 = ${a2}.` };
        if (ask === "4") return { text: `${head} x⁴ + 1/x⁴ = ?`, answer: a2 * a2 - 2, show: String(a2 * a2 - 2), tol: EX,
          solution: pre + `x² + 1/x² = ${t * t} − 2 = ${a2}. x⁴ + 1/x⁴ = ${a2}² − 2 = ${a2 * a2 - 2}.` };
        if (ask === "m") return { text: `${head} (x − 1/x)² = ?`, answer: t * t - 4, show: String(t * t - 4), tol: EX,
          solution: pre + `(x − 1/x)² = (x + 1/x)² − 4 = ${t * t} − 4 = ${t * t - 4}.` };
        const v = t ** 3 - 3 * t;
        return { text: `${head} x³ + 1/x³ = ?`, answer: v, show: S(v), tol: EX,
          solution: pre + `x³ + 1/x³ = (x + 1/x)³ − 3(x + 1/x) = ${S(t ** 3)} − ${P(3 * t)} = ${S(v)}.` };
      } },
    { id: "uc", ad: "Üç dəyişən", izah: "σ₁ = a + b + c, σ₂ = ab + bc + ca, σ₃ = abc. a² + b² + c² = σ₁² − 2σ₂; a³ + b³ + c³ − 3abc = σ₁(a² + b² + c² − σ₂). a + b + c = 0 ⇒ a³ + b³ + c³ = 3abc.",
      gen() {
        const kind = pick(["sq", "s2", "cube", "zero", "zero4", "inv", "dev"]);
        if (kind === "zero" || kind === "zero4") { let a, b; do { a = nz(-6, 6); b = nz(-6, 6); } while (a + b === 0);
          const c = -a - b, p = a * b * c, k = a * a + a * b + b * b;
          if (kind === "zero") return { text: `a + b + c = 0, abc = ${S(p)}. a³ + b³ + c³ = ?`, answer: 3 * p, show: S(3 * p), tol: EX,
            solution: `a³ + b³ + c³ − 3abc = (a + b + c)(a² + b² + c² − ab − bc − ca) = 0, deməli a³ + b³ + c³ = 3abc = 3 · ${P(p)} = ${S(3 * p)}.` };
          return { text: `a + b + c = 0, ab + bc + ca = ${S(-k)}. a⁴ + b⁴ + c⁴ = ?`, answer: 2 * k * k, show: String(2 * k * k), tol: EX,
            solution: `a² + b² + c² = 0² − 2 · ${P(-k)} = ${2 * k}. a²b² + b²c² + c²a² = (ab + bc + ca)² − 2abc(a + b + c) = ${k * k} − 0 = ${k * k}. a⁴ + b⁴ + c⁴ = ${2 * k}² − 2 · ${k * k} = ${4 * k * k} − ${2 * k * k} = ${2 * k * k}.` }; }
        const a = nz(-5, 5), b = nz(-5, 5), c = nz(-5, 5), s1 = a + b + c, s2 = a * b + b * c + c * a, s3 = a * b * c, q = a * a + b * b + c * c;
        if (kind === "sq") return { text: `a + b + c = ${S(s1)}, ab + bc + ca = ${S(s2)}. a² + b² + c² = ?`, answer: q, show: String(q), tol: EX,
          solution: `(a + b + c)² = a² + b² + c² + 2(ab + bc + ca) → a² + b² + c² = ${s1 * s1} − 2 · ${P(s2)} = ${q}.` };
        if (kind === "s2") return { text: `a + b + c = ${S(s1)}, a² + b² + c² = ${q}. ab + bc + ca = ?`, answer: s2, show: S(s2), tol: EX,
          solution: `ab + bc + ca = ((a + b + c)² − (a² + b² + c²))/2 = (${s1 * s1} − ${q})/2 = ${S(s2)}.` };
        if (kind === "dev") { const v = s1 * s1 - 3 * s2;
          return { text: `a + b + c = ${S(s1)}, ab + bc + ca = ${S(s2)}. a² + b² + c² − ab − bc − ca = ?`, answer: v, show: String(v), tol: EX,
            solution: `a² + b² + c² = ${s1 * s1} − 2 · ${P(s2)} = ${q}. ${q} − ${P(s2)} = ${v}. (Qısa: σ₁² − 3σ₂.)` }; }
        if (kind === "inv") { if (s3 === 0) return levels[3].gen();
          return { text: `ab + bc + ca = ${S(s2)}, abc = ${S(s3)}. 1/a + 1/b + 1/c = ?`, answer: s2 / s3, show: frac(s2, s3), placeholder: "məs. −5/6",
            solution: `Ortaq məxrəc abc: 1/a + 1/b + 1/c = (bc + ca + ab)/(abc) = ${S(s2)}/${P(s3)} = ${frac(s2, s3)}.` }; }
        const v = s1 ** 3 - 3 * s1 * s2 + 3 * s3;
        return { text: `a + b + c = ${S(s1)}, ab + bc + ca = ${S(s2)}, abc = ${S(s3)}. a³ + b³ + c³ = ?`, answer: v, show: S(v), tol: EX,
          solution: `a² + b² + c² = ${s1 * s1} − 2 · ${P(s2)} = ${q}. a³ + b³ + c³ = 3abc + (a + b + c)(a² + b² + c² − σ₂) = ${3 * s3 < 0 ? S(3 * s3) : 3 * s3} + ${P(s1)} · ${P(q - s2)} = ${S(v)}.` };
      } },
    { id: "hesab", ad: "Ağıllı hesablama", izah: "Hesablamağa tələsmə: ifadədə qısa vurma düsturunu, a³ ± b³ və ya \"teleskop\" cəmi gör.",
      gen() {
        const kind = pick(["sqrt4", "pow", "tele1", "tele2", "cubes", "diffsq", "zero", "nk"]);
        if (kind === "sqrt4") { const n = Math.random() < .5 ? rnd(5, 40) : rnd(2020, 2030), v = n * n + 3 * n + 1;
          return { text: `√(${n} · ${n + 1} · ${n + 2} · ${n + 3} + 1) = ?`, answer: v, show: String(v), tol: EX,
            solution: `n(n + 3) · (n + 1)(n + 2) = (n² + 3n)(n² + 3n + 2) = m(m + 2), m = n² + 3n. m(m + 2) + 1 = (m + 1)². Kök = n² + 3n + 1 = ${n * n} + ${3 * n} + 1 = ${v}.` }; }
        if (kind === "pow") { const opts = [[2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [9, 2], [10, 3]], [a, j] = pick(opts);
          const fs = [`(${a} − 1)`, `(${a} + 1)`]; for (let e = 2; e < 2 ** j; e *= 2) fs.push(`(${a}${SUP[e]} + 1)`);
          const v = a ** (2 ** j);
          return { text: `${fs.join("")} + 1 = ?`, answer: v, show: String(v), tol: EX,
            solution: `(a − 1)(a + 1) = a² − 1; (a² − 1)(a² + 1) = a⁴ − 1; … zəncir hər dəfə qüvvəti ikiqat edir. Hasil = ${a}${SUP[2 ** j]} − 1, +1 ilə ${a}${SUP[2 ** j]} = ${v}.` }; }
        if (kind === "tele1") { const n = rnd(5, 99);
          return { text: `1/(1 · 2) + 1/(2 · 3) + 1/(3 · 4) + … + 1/(${n} · ${n + 1}) = ?`, answer: n / (n + 1), show: frac(n, n + 1), placeholder: "məs. 9/10",
            solution: `1/(k(k + 1)) = 1/k − 1/(k + 1). Cəm: 1 − 1/2 + 1/2 − 1/3 + … − 1/${n + 1} = 1 − 1/${n + 1} = ${frac(n, n + 1)}.` }; }
        if (kind === "tele2") { const n = rnd(4, 50);
          return { text: `1/(1 · 3) + 1/(3 · 5) + 1/(5 · 7) + … + 1/(${2 * n - 1} · ${2 * n + 1}) = ?`, answer: n / (2 * n + 1), show: frac(n, 2 * n + 1), placeholder: "məs. 5/11",
            solution: `1/((2k − 1)(2k + 1)) = ½ · (1/(2k − 1) − 1/(2k + 1)). Cəm: ½ · (1 − 1/${2 * n + 1}) = ½ · ${2 * n}/${2 * n + 1} = ${frac(n, 2 * n + 1)}.` }; }
        if (kind === "cubes") { const A = rnd(11, 99); let B; do { B = rnd(11, 99); } while (B === A); const plus = Math.random() < .5;
          return plus ? { text: `(${A}³ + ${B}³)/(${A}² − ${A} · ${B} + ${B}²) = ?`, answer: A + B, show: String(A + B), tol: EX,
                          solution: `a³ + b³ = (a + b)(a² − ab + b²). Kəsr = a + b = ${A} + ${B} = ${A + B}.` }
                      : { text: `(${A}³ − ${B}³)/(${A}² + ${A} · ${B} + ${B}²) = ?`, answer: A - B, show: S(A - B), tol: EX,
                          solution: `a³ − b³ = (a − b)(a² + ab + b²). Kəsr = a − b = ${A} − ${B} = ${S(A - B)}.` }; }
        if (kind === "diffsq") { const B = rnd(1990, 2040), d = rnd(1, 9), A = B + d, v = d * (A + B);
          return { text: `${A}² − ${B}² = ?`, answer: v, show: String(v), tol: EX,
            solution: `a² − b² = (a − b)(a + b) = ${d} · ${A + B} = ${v}.` }; }
        if (kind === "zero") { const Y = rnd(2, 15), Z = rnd(2, 15), X = Y + Z, v = 3 * X * Y * Z;
          return { text: `${X}³ − ${Y}³ − ${Z}³ = ?`, answer: v, show: String(v), tol: EX,
            solution: `a = ${X}, b = −${Y}, c = −${Z}: a + b + c = 0, deməli a³ + b³ + c³ = 3abc = 3 · ${X} · (−${Y}) · (−${Z}) = ${v}.` }; }
        const N = pick([100, 1000, 10000]), k = rnd(1, 9), v = N * N - k * k;
        return { text: `${N + k} · ${N - k} = ?`, answer: v, show: String(v), tol: EX,
          solution: `(${N} + ${k})(${N} − ${k}) = ${N}² − ${k}² = ${N * N} − ${k * k} = ${v}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const t = rnd(3, 9), A = t * t - 2, right = t * (A - 1);
        const steps = [
          `x² + 1/x² = (x + 1/x)² − 2 = ${t * t} − 2 = ${A}.`,
          `x³ + 1/x³ = (x + 1/x)(x² − 1 + 1/x²).`,
          `= ${t} · (${A} − 1) = ${right}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) { const W = pick([t * t + 2, t * t - 1]); steps[0] = `x² + 1/x² = (x + 1/x)² ${W > t * t ? "+ 2" : "− 1"} = ${W}.`; steps[2] = `= ${t} · (${W} − 1) = ${t * (W - 1)}.`; }
        if (bad === 1) { steps[1] = `x³ + 1/x³ = (x + 1/x)(x² + 1 + 1/x²).`; steps[2] = `= ${t} · (${A} + 1) = ${t * (A + 1)}.`; }
        if (bad === 2) steps[2] = `= ${t} · (${A} − 1) = ${pick([t * A - 1, right + t, right - 2 * t])}.`;
        const text = h("div", {}, h("p", {}, `x + 1/x = ${t}. x³ + 1/x³ hesablanır:`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: (x + 1/x)² = x² + 2 + 1/x², ona görə x² + 1/x² = ${t * t} − 2 = ${A}.`,
          `2-ci addım: a³ + b³ = (a + b)(a² − ab + b²), burada ab = x · 1/x = 1 — mötərizədə "− 1" olmalıdır.`,
          `3-cü addım: hesab səhvidir: ${t} · ${A - 1} = ${right}.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Ölçüləri ayrıca tapmağa ehtiyac yoxdur: perimetr cəmi, sahə hasili verir. Diaqonal² = a² + b² = (a + b)² − 2ab.",
      gen() {
        const kind = pick(["diag", "area", "cubes", "box"]);
        if (kind === "diag") { const a = rnd(2, 15), b = rnd(2, 15), v = a * a + b * b;
          return { text: `Düzbucaqlının perimetri ${2 * (a + b)} sm, sahəsi ${a * b} sm²-dir. Diaqonalı neçə sm-dir?`, answer: Math.sqrt(v), show: root(v), placeholder: "məs. 5√2",
            solution: `a + b = ${2 * (a + b)}/2 = ${a + b}, ab = ${a * b}. d² = a² + b² = ${(a + b) ** 2} − 2 · ${a * b} = ${v}. d = ${root(v)} sm.` }; }
        if (kind === "area") { const a = rnd(2, 15), b = rnd(2, 15), d2 = a * a + b * b;
          return { text: `Düzbucaqlının perimetri ${2 * (a + b)} sm, diaqonalı ${root(d2)} sm-dir. Sahəsi neçə sm²-dir?`, answer: a * b, show: String(a * b), tol: EX,
            solution: `a + b = ${a + b}, a² + b² = d² = ${d2}. 2ab = (a + b)² − (a² + b²) = ${(a + b) ** 2} − ${d2} = ${2 * a * b}. Sahə ab = ${a * b} sm².` }; }
        if (kind === "cubes") { const a = rnd(1, 9), b = rnd(1, 9), s = a + b, p = a * b, v = a ** 3 + b ** 3;
          return { text: `İki kubun tillərinin cəmi ${s} sm, hasili ${p} sm²-dir. Kubların həcmləri cəmi neçə sm³-dir?`, answer: v, show: String(v), tol: EX,
            solution: `a³ + b³ = (a + b)³ − 3ab(a + b) = ${s ** 3} − 3 · ${p} · ${s} = ${v} sm³.` }; }
        const a = rnd(1, 9), b = rnd(1, 9), c = rnd(1, 9), E = 4 * (a + b + c), Sf = 2 * (a * b + b * c + c * a), d2 = a * a + b * b + c * c;
        return { text: `Düzbucaqlı paralelepipedin bütün 12 tilinin uzunluqları cəmi ${E} sm, tam səthinin sahəsi ${Sf} sm²-dir. Diaqonalı neçə sm-dir?`, answer: Math.sqrt(d2), show: root(d2), placeholder: "məs. 3√6",
          solution: `a + b + c = ${E}/4 = ${a + b + c}, ab + bc + ca = ${Sf}/2 = ${Sf / 2}. d² = a² + b² + c² = ${(a + b + c) ** 2} − 2 · ${Sf / 2} = ${d2}. d = ${root(d2)} sm.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-eynilikler", title: "Eyniliklər və simmetrik çoxhədlilər", fenn: "olimpiada", link: "dersler/ol-eynilikler.html",
      format: "Cavab ədəddir: tam 47, mənfi −18, kəsr 5/6, kök 3√2.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["sp", "sp", "ters", "x1x", "x1x", "uc", "uc", "hesab", "hesab", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-eynilikler.html")) b.push("dersler/ol-eynilikler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
