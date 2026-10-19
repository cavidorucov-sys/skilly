// Olimpiada: Viyet teoremi — game levels (symmetric expressions, power sums by recurrence, cubic Vieta, parameter problems, new equations, word problems).
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const distinct = (n, a, b, not = []) => { const out = []; while (out.length < n) { const v = rnd(a, b); if (!out.includes(v) && !not.includes(v)) out.push(v); } return out; };
  const SUPM = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹" };
  const sup = n => String(n).split("").map(c => SUPM[c]).join("");
  // rationals as [p, q]
  const R = (p, q = 1) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return [p / g, q / g]; };
  const add = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const mul = (a, b) => R(a[0] * b[0], a[1] * b[1]);
  const div = (a, b) => R(a[0] * b[1], a[1] * b[0]);
  const neg = a => R(-a[0], a[1]);
  const fs = a => frac(a[0], a[1]);
  const fv = a => a[0] / a[1];
  const P = a => (a[0] < 0 || a[1] !== 1) ? "(" + fs(a) + ")" : fs(a);        // bracket negatives and fractions
  // √n simplified: k√m
  const sqs = n => { let k = 1, m = n; for (let d = 2; d * d <= m; d++) while (m % (d * d) === 0) { m /= d * d; k *= d; } return m === 1 ? String(k) : (k === 1 ? "" : k) + "√" + m; };
  const pb = x => x < 0 ? "(" + S(x) + ")" : String(x);
  const C = ["1-ci addım", "2-ci addım", "3-cü addım"];

  const levels = [
    { id: "simm", ad: "Simmetrik ifadələr", izah: "Kökləri tapma! s = x₁ + x₂ = −b/a, p = x₁x₂ = c/a; ifadəni s və p ilə yaz.",
      gen() {
        let a, b, c; do { a = pick([1, 1, 1, 2, 3]); b = rnd(-9, 9); c = pick([-1, 1]) * rnd(1, 12); } while (b * b - 4 * a * c <= 0);
        const s = R(-b, a), p = R(c, a), s2 = add(mul(s, s), mul(R(-2), p));
        const E = [
          ["x₁² + x₂²", s2, `x₁² + x₂² = s² − 2p = ${P(s)}² − 2·${P(p)} = ${fs(s2)}`],
          ["x₁³ + x₂³", add(mul(s, mul(s, s)), mul(R(-3), mul(p, s))), null],
          ["1/x₁ + 1/x₂", div(s, p), `1/x₁ + 1/x₂ = (x₁ + x₂)/(x₁x₂) = s/p = ${P(s)}/${P(p)}`],
          ["x₁/x₂ + x₂/x₁", div(s2, p), `x₁/x₂ + x₂/x₁ = (x₁² + x₂²)/(x₁x₂) = (s² − 2p)/p = ${P(s2)}/${P(p)}`],
          ["(x₁ − x₂)²", add(mul(s, s), mul(R(-4), p)), `(x₁ − x₂)² = s² − 4p = ${P(s)}² − 4·${P(p)}`],
          ["x₁²x₂ + x₁x₂²", mul(p, s), `x₁²x₂ + x₁x₂² = x₁x₂(x₁ + x₂) = p·s = ${P(p)}·${P(s)}`],
          ["1/x₁² + 1/x₂²", div(s2, mul(p, p)), `1/x₁² + 1/x₂² = (x₁² + x₂²)/(x₁x₂)² = (s² − 2p)/p² = ${P(s2)}/${P(p)}²`],
          ["x₁⁴ + x₂⁴", add(mul(s2, s2), mul(R(-2), mul(p, p))), `x₁⁴ + x₂⁴ = (x₁² + x₂²)² − 2(x₁x₂)² = ${P(s2)}² − 2·${P(p)}²`],
        ];
        const [name, val, how0] = pick(E);
        const how = how0 || `x₁³ + x₂³ = s³ − 3ps = ${P(s)}³ − 3·${P(p)}·${P(s)}`;
        const ans = fs(val);
        return { text: `x₁ və x₂ — ${poly([[a, "x²"], [b, "x"], [c, ""]])} = 0 tənliyinin kökləridir. ${name} = ?`, answer: fv(val), show: ans, placeholder: "məs. 7/2",
          solution: `Viyet: s = x₁ + x₂ = ${fs(s)}, p = x₁x₂ = ${fs(p)}. ${how}${how.endsWith(ans) ? "" : " = " + ans}.` };
      } },
    { id: "rekur", ad: "Qüvvətlərin cəmi", izah: "Sₙ = x₁ⁿ + x₂ⁿ. Köklər x² = sx − p ödədiyi üçün Sₙ = s·Sₙ₋₁ − p·Sₙ₋₂, S₀ = 2, S₁ = s.",
      gen() {
        const kind = pick(["inv", "eq", "root"]);
        let s, p, n, text, intro;
        if (kind === "inv") {
          s = pick([3, 4, 5, 6, -3, -4]); p = 1; n = rnd(3, 6);
          text = `x + 1/x = ${S(s)}. x${sup(n)} + 1/x${sup(n)} = ?`;
          intro = `x və 1/x — t² ${s < 0 ? "+" : "−"} ${Math.abs(s)}t + 1 = 0 tənliyinin kökləridir (cəm ${S(s)}, hasil 1).`;
        } else if (kind === "eq") {
          do { s = pick([-1, 1]) * rnd(1, 4); p = pick([-3, -2, -1, 1, 2, 3]); } while (s * s - 4 * p <= 0);
          n = rnd(4, 6);
          text = `x₁ və x₂ — ${poly([[1, "x²"], [-s, "x"], [p, ""]])} = 0 tənliyinin kökləridir. x₁${sup(n)} + x₂${sup(n)} = ?`;
          intro = `Viyet: s = ${S(s)}, p = ${S(p)}.`;
        } else {
          let a, d; do { a = rnd(1, 3); d = pick([2, 3, 5, 6, 7]); } while (d === a * a);
          s = 2 * a; p = a * a - d; n = rnd(3, 6);
          text = `(${a} + √${d})${sup(n)} + (${a} − √${d})${sup(n)} = ?`;
          intro = `${a} ± √${d} — cəmi ${s}, hasili ${a * a} − ${d} = ${S(p)} olan ədədlərdir, yəni ${poly([[1, "x²"], [-s, "x"], [p, ""]])} = 0 tənliyinin kökləri.`;
        }
        const Sq = [2, s]; for (let i = 2; i <= n; i++) Sq.push(s * Sq[i - 1] - p * Sq[i - 2]);
        return { text, answer: Sq[n], show: S(Sq[n]), tol: 0.01,
          solution: `${intro} Sₙ = ${S(s)}·Sₙ₋₁ ${p < 0 ? "+ " + (-p) : "− " + p}·Sₙ₋₂: ${Sq.map((v, i) => "S" + "₀₁₂₃₄₅₆"[i] + " = " + S(v)).join(", ")}. Cavab: ${S(Sq[n])}.` };
      } },
    { id: "kub", ad: "Kub tənlik üçün Viyet", izah: "ax³ + bx² + cx + d = 0: x₁ + x₂ + x₃ = −b/a, x₁x₂ + x₂x₃ + x₃x₁ = c/a, x₁x₂x₃ = −d/a.",
      gen() {
        const kind = pick(["sq", "inv", "cub", "val", "ap", "gp"]);
        if (kind === "ap") {
          const m = pick([-3, -2, -1, 1, 2, 3, 4, 5]), d = rnd(1, 4), e1 = 3 * m, e2 = 3 * m * m - d * d, e3 = m * (m * m - d * d);
          return { text: `${poly([[1, "x³"], [-e1, "x²"], [e2, "x"]])} + k = 0 tənliyinin üç kökü ədədi silsilə təşkil edir. k = ?`, answer: -e3, show: S(-e3), tol: 0.01,
            solution: `Köklər a − d, a, a + d olsun: cəm 3a = ${S(e1)} → orta kök a = ${S(m)}. O, tənliyi ödəyir: ${pb(m)}³ − ${pb(e1)}·${pb(m)}² + ${pb(e2)}·${pb(m)} + k = 0 → ${S(m ** 3 - e1 * m * m + e2 * m)} + k = 0 → k = ${S(-e3)}. (Köklər: ${S(m - d)}, ${S(m)}, ${S(m + d)}.)` };
        }
        if (kind === "gp") {
          let b0, q; do { b0 = pick([-3, -2, -1, 1, 2, 3]); q = pick([2, 3, -2]); } while (Math.abs(b0 * q * q) > 12);
          const r = [b0, b0 * q, b0 * q * q], m = b0 * q, e1 = r[0] + r[1] + r[2], e2 = m * e1;
          return { text: `${poly([[1, "x³"], [-e1, "x²"], [e2, "x"]])} + k = 0 tənliyinin üç kökü həndəsi silsilə təşkil edir. k = ?`, answer: -m * m * m, show: S(-m * m * m), tol: 0.01,
            solution: `Orta kök x₂ olsun: x₁x₃ = x₂². Onda x₁x₂ + x₂x₃ + x₁x₃ = x₂(x₁ + x₂ + x₃) → ${e2} = x₂ · ${e1} → x₂ = ${S(m)}. Hasil x₁x₂x₃ = x₂³ = −k → k = −(${S(m)})³ = ${S(-m * m * m)}. (Köklər: ${r.map(S).join(", ")}.)` };
        }
        const a = pick([1, 1, 2]);
        const r = kind === "inv" ? distinct(3, -5, 6, [0]) : distinct(3, -5, 6);
        const e1 = r[0] + r[1] + r[2], e2 = r[0] * r[1] + r[1] * r[2] + r[2] * r[0], e3 = r[0] * r[1] * r[2];
        const eq = `${poly([[a, "x³"], [-a * e1, "x²"], [a * e2, "x"], [-a * e3, ""]])} = 0`;
        const vi = `Viyet: x₁ + x₂ + x₃ = ${S(e1)}, x₁x₂ + x₂x₃ + x₃x₁ = ${S(e2)}, x₁x₂x₃ = ${S(e3)}.`;
        const pre = `x₁, x₂, x₃ — ${eq} tənliyinin kökləridir. `;
        if (kind === "sq") { const v = e1 * e1 - 2 * e2;
          return { text: pre + "x₁² + x₂² + x₃² = ?", answer: v, show: S(v), tol: 0.01, solution: `${vi} x₁² + x₂² + x₃² = (x₁ + x₂ + x₃)² − 2(x₁x₂ + x₂x₃ + x₃x₁) = ${pb(e1)}² − 2·${pb(e2)} = ${S(v)}.` }; }
        if (kind === "inv") { const v = R(e2, e3);
          return { text: pre + "1/x₁ + 1/x₂ + 1/x₃ = ?", answer: fv(v), show: fs(v), solution: `${vi} 1/x₁ + 1/x₂ + 1/x₃ = (x₂x₃ + x₁x₃ + x₁x₂)/(x₁x₂x₃) = ${S(e2)}/${pb(e3)} = ${fs(v)}.` }; }
        if (kind === "cub") { const v = e1 ** 3 - 3 * e1 * e2 + 3 * e3;
          return { text: pre + "x₁³ + x₂³ + x₃³ = ?", answer: v, show: S(v), tol: 0.01, solution: `${vi} x₁³ + x₂³ + x₃³ = e₁³ − 3e₁e₂ + 3e₃ (e₁ — cəm, e₂ — cüt hasillərin cəmi, e₃ — hasil) = ${pb(e1)}³ − 3·${pb(e1)}·${pb(e2)} + 3·${pb(e3)} = ${S(v)}.` }; }
        const t = pick([1, 2, -1, 3]), v = t ** 3 - e1 * t * t + e2 * t - e3;
        return { text: pre + `(${S(t)} − x₁)(${S(t)} − x₂)(${S(t)} − x₃) = ?`, answer: v, show: S(v), tol: 0.01,
          solution: `Fənd: ${a === 1 ? "" : a}(x − x₁)(x − x₂)(x − x₃) = ${poly([[a, "x³"], [-a * e1, "x²"], [a * e2, "x"], [-a * e3, ""]])}. x = ${S(t)} qoy: hasil = P(${S(t)})${a === 1 ? "" : "/" + a} = ${S(v)}.` };
      } },
    { id: "param", ad: "Parametr və köklər", izah: "Şərti s və p ilə yaz, parametri tap. Sonda mütləq yoxla: D ≥ 0 (köklər həqiqidir)?",
      gen() {
        const kind = pick(["trap", "trap", "eks", "ratio", "ferq"]);
        if (kind === "trap") {
          let c1, q, k1, k2, T, D; const Df = k => k * k - 4 * (c1 * k + q);
          do { c1 = pick([1, 2, -1, -2]); q = rnd(-8, 8); k1 = rnd(-6, 8); k2 = 2 * c1 - k1; T = k1 * k1 - 2 * c1 * k1 - 2 * q; D = [Df(k1), Df(k2)]; }
          while (k1 === k2 || T <= 0 || (D[0] >= 0) === (D[1] >= 0));
          const good = D[0] >= 0 ? k1 : k2, bad = good === k1 ? k2 : k1;
          const lk = poly([[c1, "k"], [q, ""]]);
          return { text: `x² + kx + ${lk.startsWith("−") ? "(" + lk + ")" : lk} = 0 tənliyinin x₁, x₂ həqiqi kökləri üçün x₁² + x₂² = ${T}. k = ?`, answer: good, show: S(good), tol: 0.01,
            solution: `x₁ + x₂ = −k, x₁x₂ = ${lk}. x₁² + x₂² = k² − 2(${lk}) = ${T} → ${poly([[1, "k²"], [-2 * c1, "k"], [-2 * q - T, ""]])} = 0 → k = ${S(Math.min(k1, k2))} və ya k = ${S(Math.max(k1, k2))}. Yoxla: D = k² − 4(${lk}). k = ${S(good)}: D = ${S(Df(good))} ≥ 0 ✓. k = ${S(bad)}: D = ${S(Df(bad))} < 0 — həqiqi kök yoxdur, atılır. Cavab: ${S(good)}.` };
        }
        if (kind === "eks") {
          const m = rnd(2, 6), q = rnd(-m + 1, m - 1), lk = poly([[1, "k"], [q, ""]]);
          return { text: `x² + (k² − ${m * m})x + ${lk} = 0 tənliyinin kökləri qarşılıqlı əks ədədlərdir (x₁ = −x₂ ≠ 0). k = ?`, answer: -m, show: S(-m), tol: 0.01,
            solution: `x₁ + x₂ = 0 → k² − ${m * m} = 0 → k = ±${m}. Onda tənlik x² + (${lk}) = 0, həqiqi əks köklər üçün ${lk} < 0 lazımdır. k = ${m}: ${m + q} > 0 — kök yoxdur, atılır. k = −${m}: ${S(q - m)} < 0 ✓. Cavab: −${m}.` };
        }
        if (kind === "ratio") {
          const r = pick([-1, 1]) * rnd(1, 6), l = rnd(2, 4), s = r * (1 + l), k = l * r * r;
          return { text: `${poly([[1, "x²"], [-s, "x"]])} + k = 0 tənliyinin kökləri üçün x₁ = ${l}x₂. k = ?`, answer: k, show: S(k), tol: 0.01,
            solution: `x₂ = t, x₁ = ${l}t. Cəm: ${l + 1}t = ${S(s)} → t = ${S(r)}. Hasil: k = ${l}t² = ${l}·${r * r} = ${k}. (Köklər ${S(l * r)} və ${S(r)}.)` };
        }
        let b, d; do { b = rnd(-10, 10); d = rnd(1, 8); } while ((b - d) % 2 !== 0);
        const k = (b * b - d * d) / 4;
        return { text: `${poly([[1, "x²"], [b, "x"]])} + k = 0 tənliyinin kökləri üçün x₁ − x₂ = ${d}. k = ?`, answer: k, show: S(k), tol: 0.01,
          solution: `(x₁ − x₂)² = (x₁ + x₂)² − 4x₁x₂ = ${b * b} − 4k = ${d * d} → 4k = ${b * b - d * d} → k = ${S(k)}. (D = ${d * d} > 0 ✓.)` };
      } },
    { id: "yeni", ad: "Yeni tənlik qur", izah: "Yeni köklərin cəmini və hasilini s və p ilə hesabla; y² + py + q = 0-da p = −(cəm), q = hasil.",
      gen() {
        let b, c; do { b = rnd(-8, 8); c = pick([-1, 1]) * rnd(1, 8); } while (b * b - 4 * c <= 0);
        const s = R(-b), p = R(c), kind = pick(["sq", "shift", "inv", "mul", "mix"]);
        let name, sum, prod, how;
        if (kind === "sq") { name = "x₁² və x₂²"; sum = add(mul(s, s), mul(R(-2), p)); prod = mul(p, p); how = `cəm = s² − 2p = ${fs(sum)}, hasil = p² = ${fs(prod)}`; }
        if (kind === "shift") { const t = pick([-3, -2, -1, 1, 2, 3]); name = `x₁ ${t < 0 ? "−" : "+"} ${Math.abs(t)} və x₂ ${t < 0 ? "−" : "+"} ${Math.abs(t)}`; sum = add(s, R(2 * t)); prod = add(add(p, mul(R(t), s)), R(t * t));
          how = `cəm = s ${t < 0 ? "−" : "+"} ${Math.abs(2 * t)} = ${fs(sum)}, hasil = x₁x₂ ${t < 0 ? "−" : "+"} ${Math.abs(t) === 1 ? "" : Math.abs(t)}(x₁ + x₂) + ${t * t} = ${fs(prod)}`; }
        if (kind === "inv") { name = "1/x₁ və 1/x₂"; sum = div(s, p); prod = div(R(1), p); how = `cəm = s/p = ${fs(sum)}, hasil = 1/p = ${fs(prod)}`; }
        if (kind === "mul") { const t = pick([2, 3, -1, -2]); name = `${t === -1 ? "−" : S(t)}x₁ və ${t === -1 ? "−" : S(t)}x₂`; sum = mul(R(t), s); prod = mul(R(t * t), p); how = `cəm = ${t === -1 ? "−" : S(t)}s = ${fs(sum)}, hasil = ${t * t === 1 ? "" : t * t}p = ${fs(prod)}`; }
        if (kind === "mix") { name = "x₁ + 1/x₂ və x₂ + 1/x₁"; sum = add(s, div(s, p)); prod = add(add(p, R(2)), div(R(1), p));
          how = `cəm = s + s/p = ${fs(sum)}, hasil = x₁x₂ + 2 + 1/(x₁x₂) = p + 2 + 1/p = ${fs(prod)}`; }
        const pp = neg(sum), qq = prod, ask = pick(["p", "q", "pq"]);
        const val = ask === "p" ? pp : ask === "q" ? qq : add(pp, qq);
        return { text: `x₁, x₂ — ${poly([[1, "x²"], [b, "x"], [c, ""]])} = 0 tənliyinin kökləridir. Kökləri ${name} olan tənlik y² + py + q = 0-dır. ${ask === "pq" ? "p + q" : ask} = ?`,
          answer: fv(val), show: fs(val), placeholder: "məs. −5/2",
          solution: `s = ${fs(s)}, p₀ = x₁x₂ = ${fs(p)}. Yeni köklər üçün ${how}. Deməli p = −(cəm) = ${fs(pp)}, q = hasil = ${fs(qq)}.${ask === "pq" ? ` p + q = ${fs(val)}.` : ""}` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let b, c; do { b = pick([-1, 1]) * rnd(1, 7); c = pick([-1, 1]) * rnd(1, 9); } while (b * b - 4 * c <= 0);
        const s = -b, p = c, V = s * s - 2 * p, ans = s * (V - p);
        const steps = [
          `Viyet: x₁ + x₂ = ${S(s)}, x₁x₂ = ${S(p)}.`,
          `x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = ${pb(s)}² − 2·${pb(p)} = ${S(V)}.`,
          `x₁³ + x₂³ = (x₁ + x₂)(x₁² − x₁x₂ + x₂²) = ${pb(s)}·(${S(V)} − ${pb(p)}) = ${S(ans)}.`,
        ];
        const bad = rnd(0, 2);
        let why;
        if (bad === 0) { steps[0] = `Viyet: x₁ + x₂ = ${S(-s)}, x₁x₂ = ${S(p)}.`; steps[1] = `x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = ${pb(-s)}² − 2·${pb(p)} = ${S(V)}.`; steps[2] = `x₁³ + x₂³ = (x₁ + x₂)(x₁² − x₁x₂ + x₂²) = ${pb(-s)}·(${S(V)} − ${pb(p)}) = ${S(-ans)}.`; why = `1-ci addım: x₁ + x₂ = −b = ${S(s)}, işarə səhvdir. Düz cavab: ${S(ans)}.`; }
        if (bad === 1) { const W = s * s + 2 * p; steps[1] = `x₁² + x₂² = (x₁ + x₂)² + 2x₁x₂ = ${pb(s)}² + 2·${pb(p)} = ${S(W)}.`; steps[2] = `x₁³ + x₂³ = (x₁ + x₂)(x₁² − x₁x₂ + x₂²) = ${pb(s)}·(${S(W)} − ${pb(p)}) = ${S(s * (W - p))}.`;
          why = `2-ci addım: (x₁ + x₂)² = x₁² + 2x₁x₂ + x₂², ona görə x₁² + x₂² = s² − 2p = ${S(V)}. Düz cavab: ${S(ans)}.`; }
        if (bad === 2) { steps[2] = `x₁³ + x₂³ = (x₁ + x₂)(x₁² + x₂²) = ${pb(s)}·${pb(V)} = ${S(s * V)}.`;
          why = `3-cü addım: a³ + b³ = (a + b)(a² − ab + b²) — −x₁x₂ unudulub. Düz: ${pb(s)}·(${S(V)} − ${pb(p)}) = ${S(ans)}.`; }
        const text = h("div", {}, h("p", {}, `Tapşırıq: ${poly([[1, "x²"], [b, "x"], [c, ""]])} = 0 tənliyinin kökləri üçün x₁³ + x₂³-u tap.`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: C, correct: bad, show: C[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Ölçüləri tapmağa ehtiyac yoxdur: cəm və hasil (və ya cüt hasillərin cəmi) bəs edir.",
      gen() {
        const kind = pick(["rect", "box", "tri"]);
        if (kind === "rect") {
          const [a, b] = distinct(2, 2, 15), d2 = a * a + b * b;
          return { text: `Düzbucaqlı formalı bağın perimetri ${2 * (a + b)} m, sahəsi ${a * b} m²-dir. Bağın diaqonalı neçə metrdir?`, answer: Math.sqrt(d2), show: sqs(d2), unit: "m",
            solution: `Tərəflər a, b: a + b = ${a + b}, ab = ${a * b}. d² = a² + b² = (a + b)² − 2ab = ${(a + b) ** 2} − ${2 * a * b} = ${d2} → d = ${sqs(d2)} m.` };
        }
        if (kind === "tri") {
          let a, b; do { [a, b] = distinct(2, 2, 16); } while ((a * b) % 2);
          const c2 = a * a + b * b;
          return { text: `Düzbucaqlı üçbucaq formalı sahənin katetlərinin cəmi ${a + b} m, sahəsi ${a * b / 2} m²-dir. Hipotenuz neçə metrdir?`, answer: Math.sqrt(c2), show: sqs(c2), unit: "m",
            solution: `a + b = ${a + b}, ab/2 = ${a * b / 2} → ab = ${a * b}. c² = a² + b² = (a + b)² − 2ab = ${(a + b) ** 2} − ${2 * a * b} = ${c2} → c = ${sqs(c2)} m.` };
        }
        const [a, b, c] = distinct(3, 1, 9), e1 = a + b + c, e2 = a * b + b * c + c * a, d2 = a * a + b * b + c * c;
        return { text: `Düzbucaqlı paralelepiped formalı qutunun bütün 12 tilinin uzunluqları cəmi ${4 * e1} sm, tam səthinin sahəsi ${2 * e2} sm²-dir. Qutunun diaqonalı neçə sm-dir?`, answer: Math.sqrt(d2), show: sqs(d2), unit: "sm",
          solution: `Tillər a, b, c: 4(a + b + c) = ${4 * e1} → a + b + c = ${e1}; 2(ab + bc + ca) = ${2 * e2} → ab + bc + ca = ${e2}. d² = a² + b² + c² = ${e1}² − 2·${e2} = ${d2} → d = ${sqs(d2)} sm.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-viyet", title: "Viyet teoremi (olimpiada məsələləri)", fenn: "olimpiada", link: "dersler/ol-viyet.html",
      format: "Cavab ədəddir: tam 14, mənfi −3, kəsr 7/2, kök 2√13.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["simm", "simm", "rekur", "rekur", "kub", "kub", "param", "param", "yeni", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-viyet.html")) b.push("dersler/ol-viyet.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
