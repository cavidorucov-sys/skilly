// Ardıcıllıqlar və sonlu cəmlər (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const SUB = "₀₁₂₃₄₅₆₇₈₉", sub = n => String(n).split("").map(d => SUB[+d]).join("");
  const sg = n => n < 0 ? "−" + (-n) : String(n);
  const par = n => n < 0 ? "(" + sg(n) + ")" : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? sg(p / g) : sg(p / g) + "/" + (q / g); };
  const a_ = k => "a" + sub(k);
  const INT = 0.01;
  const ord = n => { const L = { 1: "ci", 2: "ci", 3: "cü", 4: "cü", 5: "ci", 6: "cı", 7: "ci", 8: "ci", 9: "cu" }, T = { 1: "cu", 2: "ci", 3: "cu", 4: "cı", 5: "ci", 6: "cı", 7: "ci", 8: "ci", 9: "cı" }; return n % 1000 === 0 ? n + "-ci" : n % 100 === 0 ? n + "-cü" : n % 10 ? n + "-" + L[n % 10] : n + "-" + T[(n / 10) % 10]; };   // ordinal suffix by pronunciation
  const chk = (a, b) => { if (Math.abs(a - b) > 1e-9) throw new Error("internal mismatch " + a + " vs " + b); };
  // rational numbers [p, q] (q > 0), exact for small values
  const R = (p, q = 1) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return [p / g, q / g]; };
  const radd = (x, y) => R(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
  const rsub = (x, y) => R(x[0] * y[1] - y[0] * x[1], x[1] * y[1]);
  const rmul = (x, y) => R(x[0] * y[0], x[1] * y[1]);
  const rdiv = (x, y) => R(x[0] * y[1], x[1] * y[0]);
  const rs = x => frac(x[0], x[1]);
  // exact BigInt rational sum, used only to cross-check closed formulas
  const bgcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; };
  const bsum = (m, n, term) => { let p = 0n, q = 1n; for (let k = m; k <= n; k++) { const [tp, tq] = term(BigInt(k)); p = p * tq + tp * q; q = q * tq; const g = bgcd(p, q); p /= g; q /= g; } return [p, q]; };
  const bcheck = (m, n, term, p, q) => { const g = gcd(Math.abs(p), q) || 1; p /= g; q /= g; const [bp, bq] = bsum(m, n, term); if (bp !== BigInt(p) || bq !== BigInt(q)) throw new Error("telescoping mismatch " + bp + "/" + bq + " vs " + p + "/" + q); };
  const FIB = [0, 1]; for (let i = 2; i <= 60; i++) FIB.push(FIB[i - 1] + FIB[i - 2]);
  const F_ = k => "F" + sub(k);

  const levels = [
    { id: "rekur", ad: "Ümumi hədd və rekurrent", izah: "Rekurrent düsturda hədləri bir-bir hesabla. Ümumi hədd düsturunda n-i yerinə qoy; işarənin dəyişməsini kvadrat üçhədlinin köklərindən tap.",
      gen() {
        const kind = pick(["lin", "two", "neg", "min", "tri", "incr"]);
        if (kind === "lin") {
          const p = pick([2, 3, -2, 3]), r = nz(-5, 5), a1 = rnd(-3, 4), k = rnd(5, 7);
          const v = [a1]; for (let i = 1; i < k; i++) v.push(p * v[i - 1] + r);
          return { text: `a₁ = ${sg(a1)}, aₙ₊₁ = ${p}aₙ ${r < 0 ? "−" : "+"} ${Math.abs(r)}. ${a_(k)} = ?`, answer: v[k - 1], show: sg(v[k - 1]), tol: INT,
            solution: v.slice(0, k).map((x, i) => `${a_(i + 1)} = ${sg(x)}`).join("; ") + `. Cavab: ${sg(v[k - 1])}.` };
        }
        if (kind === "two") {
          const p = pick([1, 2, 3]), q = pick([1, 2, -1]), a1 = rnd(1, 3), a2 = rnd(1, 4), k = rnd(6, 8);
          const v = [a1, a2]; for (let i = 2; i < k; i++) v.push(p * v[i - 1] + q * v[i - 2]);
          return { text: `a₁ = ${a1}, a₂ = ${a2}, aₙ₊₂ = ${p === 1 ? "" : p}aₙ₊₁ ${q < 0 ? "−" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q)}aₙ. ${a_(k)} = ?`, answer: v[k - 1], show: sg(v[k - 1]), tol: INT,
            solution: v.slice(0, k).map((x, i) => `${a_(i + 1)} = ${sg(x)}`).join("; ") + `. Cavab: ${sg(v[k - 1])}.` };
        }
        if (kind === "neg") {
          const r1 = rnd(1, 12), r2 = r1 + rnd(3, 14), B = r1 + r2, C = r1 * r2;
          const cnt = r2 - r1 - 1;
          return { text: `aₙ = n² − ${B}n + ${C}. Ardıcıllığın neçə hədd mənfidir?`, answer: cnt, show: String(cnt), tol: INT,
            solution: `n² − ${B}n + ${C} = (n − ${r1})(n − ${r2}) < 0 ⟺ ${r1} < n < ${r2}. Natural n: ${r1 + 1}, …, ${r2 - 1} — cəmi ${cnt}.` };
        }
        if (kind === "min") {
          const B = rnd(4, 30), C = rnd(10, 90), n0 = Math.round(B / 2), best = n0 * n0 - B * n0 + C;
          let m = Infinity; for (let n = 1; n < 60; n++) m = Math.min(m, n * n - B * n + C);
          chk(m, best);
          return { text: `aₙ = n² − ${B}n + ${C}. Ardıcıllığın ən kiçik həddini tap.`, answer: best, show: sg(best), tol: INT,
            solution: `Parabolun təpəsi n = ${B}/2 = ${B / 2}. ` + (B % 2 ? `Natural n üçün ən yaxın ${n0}: ` : `Bu natural ədəddir: `) + `a${sub(n0)} = ${n0 * n0} − ${B * n0} + ${C} = ${sg(best)}.` };
        }
        if (kind === "tri") {
          const n = rnd(8, 40), T = n * (n + 1) / 2;
          return { text: `aₙ = n(n + 1)/2. ${T} ədədi bu ardıcıllığın neçənci həddidir?`, answer: n, show: String(n), tol: INT,
            solution: `n(n + 1) = ${2 * T} → ${n}·${n + 1} = ${2 * T}, n = ${n}. (n² + n − ${2 * T} = 0, müsbət kök.)` };
        }
        const c = rnd(-3, 5), k = rnd(8, 20), v = [c]; for (let i = 1; i < k; i++) v.push(v[i - 1] + i);
        chk(v[k - 1], c + k * (k - 1) / 2);
        return { text: `a₁ = ${sg(c)}, aₙ₊₁ = aₙ + n. ${a_(k)} = ?`, answer: v[k - 1], show: sg(v[k - 1]), tol: INT,
          solution: `${a_(k)} = a₁ + 1 + 2 + … + ${k - 1} = ${sg(c)} + ${k - 1}·${k}/2 = ${sg(c)} + ${k * (k - 1) / 2} = ${sg(v[k - 1])}.` };
      } },
    { id: "dovri", ad: "Dövri ardıcıllıqlar", izah: "Əvvəlcə ilk bir neçə həddi yaz, təkrar başlayan yeri tap (dövr T). Sonra r = (k − 1) mod T + 1 götür: aₖ = aᵣ.",
      gen() {
        const kind = pick(["A", "B", "C", "Csum", "Aprod"]);
        if (kind === "A" || kind === "B" || kind === "Aprod") {
          const t = kind === "B" ? pick([2, 3, 4, 5, -2, -3, -4]) : pick([2, 3, 4, 5, 6, -1, -2, -3, -4]);
          const step = kind === "B" ? a => rdiv(radd(R(1), a), rsub(R(1), a)) : a => rdiv(R(1), rsub(R(1), a));
          const seq = [R(t)]; let T = 0;
          for (let i = 1; i < 12 && !T; i++) { const nx = step(seq[i - 1]); if (nx[0] === t && nx[1] === 1) T = i; else seq.push(nx); }
          if (!T) throw new Error("no period");
          const rule = kind === "B" ? "aₙ₊₁ = (1 + aₙ)/(1 − aₙ)" : "aₙ₊₁ = 1/(1 − aₙ)";
          const list = seq.slice(0, T + 1).map(rs).join("; ");
          if (kind === "Aprod") {
            const N = rnd(20, 90); let p = R(1), cur = R(t); for (let i = 1; i <= N; i++) { p = rmul(p, cur); cur = step(cur); }
            return { text: `a₁ = ${sg(t)}, ${rule}. a₁·a₂·…·a${sub(N)} hasilini tap.`, answer: p[0] / p[1], show: rs(p), tol: INT,
              solution: `${list}; … — dövr ${T}. Hər 3 ardıcıl həddin hasili ${rs(rmul(rmul(seq[0], seq[1]), seq[2]))}. ${N} = 3·${Math.floor(N / 3)} + ${N % 3}: ${Math.floor(N / 3)} üçlüyün hasili ${Math.floor(N / 3) % 2 ? "−1" : "1"}` + (N % 3 ? `, qalan ${N % 3} hədd (${seq.slice(0, N % 3).map(rs).join("; ")}) hasili ${rs(N % 3 === 1 ? seq[0] : rmul(seq[0], seq[1]))}.` : ".") + ` Cavab: ${rs(p)}.` };
          }
          const k = rnd(30, 2030), v = seq[(k - 1) % T];
          return { text: `a₁ = ${sg(t)}, ${rule}. ${a_(k)} = ?`, answer: v[0] / v[1], show: rs(v), tol: 0.001,
            solution: `${list} — dövr ${T}. ${k} = ${T}·${Math.floor((k - 1) / T)} + ${(k - 1) % T + 1}, ona görə ${a_(k)} = ${a_((k - 1) % T + 1)} = ${rs(v)}.` };
        }
        // C: a_{n+2} = a_{n+1} − a_n, period 6
        const a1 = rnd(-6, 9), a2 = rnd(-6, 9), v = [a1, a2]; for (let i = 2; i < 12; i++) v.push(v[i - 1] - v[i - 2]);
        for (let i = 0; i < 6; i++) if (v[i] !== v[i + 6]) throw new Error("not period 6");
        const list = v.slice(0, 6).map(sg).join("; ");
        if (kind === "C") {
          const k = rnd(50, 2030);
          return { text: `a₁ = ${sg(a1)}, a₂ = ${sg(a2)}, aₙ₊₂ = aₙ₊₁ − aₙ. ${a_(k)} = ?`, answer: v[(k - 1) % 6], show: sg(v[(k - 1) % 6]), tol: INT,
            solution: `${list}; sonra təkrar (dövr 6). ${k} = 6·${Math.floor((k - 1) / 6)} + ${(k - 1) % 6 + 1} → ${a_(k)} = ${a_((k - 1) % 6 + 1)} = ${sg(v[(k - 1) % 6])}.` };
        }
        const N = rnd(20, 2030); let S = 0; for (let i = 0; i < N; i++) S += v[i % 6];
        return { text: `a₁ = ${sg(a1)}, a₂ = ${sg(a2)}, aₙ₊₂ = aₙ₊₁ − aₙ. İlk ${N} həddin cəmi S = ?`, answer: S, show: sg(S), tol: INT,
          solution: `${list} — dövr 6, dövrün cəmi 0. ${N} = 6·${Math.floor(N / 6)} + ${N % 6}: tam dövrlər 0 verir, qalır ilk ${N % 6} hədd: ${N % 6 ? v.slice(0, N % 6).map(sg).join(" + ") + " = " : ""}${sg(S)}.` };
      } },
    { id: "teleskop", ad: "Teleskopik cəmlər", izah: "Hədləri fərq kimi yaz: 1/(k(k+1)) = 1/k − 1/(k+1). Qonşu hədlər ixtisar olunur, yalnız ilk və son qalır.",
      gen() {
        const kind = pick(["a", "a", "b", "c", "d", "e", "f", "g"]);
        if (kind === "a") {
          const m = pick([1, 1, 1, 2, 3]), n = rnd(m + 3, 99), p = n + 1 - m, q = m * (n + 1);
          bcheck(m, n, k => [1n, k * (k + 1n)], p, q);
          const head = m === 1 ? "1/(1·2) + 1/(2·3) + … + " : `1/(${m}·${m + 1}) + … + `;
          return { text: `${head}1/(${n}·${n + 1}) = ?`, answer: p / q, show: frac(p, q), tol: 0.0001,
            solution: `1/(k(k + 1)) = 1/k − 1/(k + 1). Cəm = (1/${m} − 1/${m + 1}) + … + (1/${n} − 1/${n + 1}) = 1/${m} − 1/${n + 1} = ${frac(p, q)}.` };
        }
        if (kind === "b") {
          const n = rnd(3, 40), num = 3 * (n + 1) * (n + 2) - 2 * (n + 2) - 2 * (n + 1), den = 4 * (n + 1) * (n + 2), g = gcd(num, den);
          bcheck(1, n, k => [1n, k * (k + 2n)], num / g, den / g);
          return { text: `1/(1·3) + 1/(2·4) + 1/(3·5) + … + 1/(${n}·${n + 2}) = ?`, answer: num / den, show: frac(num, den), tol: 0.0001,
            solution: `1/(k(k + 2)) = (1/2)(1/k − 1/(k + 2)). Ortada ixtisar olur, qalır: (1/2)(1 + 1/2 − 1/${n + 1} − 1/${n + 2}) = ${frac(num, den)}.` };
        }
        if (kind === "c") {
          const n = rnd(3, 60);
          bcheck(1, n, k => [1n, (2n * k - 1n) * (2n * k + 1n)], n, 2 * n + 1);
          return { text: `1/(1·3) + 1/(3·5) + 1/(5·7) + … + 1/(${2 * n - 1}·${2 * n + 1}) = ?`, answer: n / (2 * n + 1), show: frac(n, 2 * n + 1), tol: 0.0001,
            solution: `1/((2k − 1)(2k + 1)) = (1/2)(1/(2k − 1) − 1/(2k + 1)). Cəm = (1/2)(1 − 1/${2 * n + 1}) = (1/2)·${2 * n}/${2 * n + 1} = ${frac(n, 2 * n + 1)}.` };
        }
        if (kind === "d") {
          const s = rnd(3, 13), n = s * s - 1;
          return { text: `1/(√1 + √2) + 1/(√2 + √3) + … + 1/(√${n} + √${n + 1}) = ?`, answer: s - 1, show: String(s - 1), tol: INT,
            solution: `1/(√k + √(k + 1)) = (√(k + 1) − √k)/((k + 1) − k) = √(k + 1) − √k. Cəm = √${n + 1} − √1 = ${s} − 1 = ${s - 1}.` };
        }
        if (kind === "e") {
          const n = rnd(3, 7); let S = 0, f = 1; for (let k = 1; k <= n; k++) { f *= k; S += k * f; }
          let fn = 1; for (let k = 2; k <= n + 1; k++) fn *= k;
          chk(S, fn - 1);
          return { text: `1·1! + 2·2! + 3·3! + … + ${n}·${n}! = ?`, answer: S, show: String(S), tol: INT,
            solution: `k·k! = (k + 1)! − k!. Cəm = (2! − 1!) + (3! − 2!) + … + (${n + 1}! − ${n}!) = ${n + 1}! − 1 = ${fn} − 1 = ${S}.` };
        }
        if (kind === "f") {
          const n = rnd(4, 40), P = n + 1, Q = 2 * n;
          let pr = R(1); for (let k = 2; k <= n; k++) pr = rmul(pr, R(k * k - 1, k * k)); chk(pr[0] * Q, P * pr[1]);
          return { text: `(1 − 1/2²)(1 − 1/3²)(1 − 1/4²)·…·(1 − 1/${n}²) = ?`, answer: P / Q, show: frac(P, Q), tol: 0.0001,
            solution: `1 − 1/k² = (k − 1)(k + 1)/k². Hasil = (1·3/2²)(2·4/3²)(3·5/4²)…((${n - 1})(${n + 1})/${n}²) — surət və məxrəcdəki vuruqlar ixtisar olur: (1/2)·(${n + 1}/${n}) = ${frac(P, Q)}.` };
        }
        const n = rnd(3, 30), num = n * (n + 3) * 1, den = 4 * (n + 1) * (n + 2), g = gcd(num, den);
        bcheck(1, n, k => [1n, k * (k + 1n) * (k + 2n)], num / g, den / g);
        return { text: `1/(1·2·3) + 1/(2·3·4) + … + 1/(${n}·${n + 1}·${n + 2}) = ?`, answer: num / den, show: frac(num, den), tol: 0.0001,
          solution: `1/(k(k + 1)(k + 2)) = (1/2)(1/(k(k + 1)) − 1/((k + 1)(k + 2))). Cəm = (1/2)(1/2 − 1/((${n + 1})(${n + 2}))) = ${frac(num, den)}.` };
      } },
    { id: "kvadrat", ad: "Kvadratlar və kublar cəmi", izah: "Σk² = n(n+1)(2n+1)/6, Σk³ = (n(n+1)/2)². Hissə cəmi: böyük cəm − kiçik cəm.",
      gen() {
        const kind = pick(["sq", "cube", "part", "odd", "kk1", "alt", "findn"]);
        const sq = n => n * (n + 1) * (2 * n + 1) / 6, cu = n => (n * (n + 1) / 2) ** 2;
        if (kind === "sq") { const n = rnd(5, 40); let S = 0; for (let k = 1; k <= n; k++) S += k * k; chk(S, sq(n));
          return { text: `1² + 2² + 3² + … + ${n}² = ?`, answer: S, show: String(S), tol: INT, solution: `${n}·${n + 1}·${2 * n + 1}/6 = ${S}.` }; }
        if (kind === "cube") { const n = rnd(4, 20); let S = 0; for (let k = 1; k <= n; k++) S += k ** 3; chk(S, cu(n));
          return { text: `1³ + 2³ + 3³ + … + ${n}³ = ?`, answer: S, show: String(S), tol: INT, solution: `Σk³ = (1 + 2 + … + ${n})² = (${n * (n + 1) / 2})² = ${S}.` }; }
        if (kind === "part") { const a = rnd(3, 15), b = rnd(a + 4, 35), c3 = Math.random() < .4; let S = 0; for (let k = a; k <= b; k++) S += c3 ? k ** 3 : k * k;
          chk(S, c3 ? cu(b) - cu(a - 1) : sq(b) - sq(a - 1));
          return { text: `${a}${c3 ? "³" : "²"} + ${a + 1}${c3 ? "³" : "²"} + … + ${b}${c3 ? "³" : "²"} = ?`, answer: S, show: String(S), tol: INT,
            solution: `Böyük cəmdən kiçiyi çıx: S${sub(b)} − S${sub(a - 1)} = ${c3 ? cu(b) : sq(b)} − ${c3 ? cu(a - 1) : sq(a - 1)} = ${S}.` }; }
        if (kind === "odd") { const n = rnd(4, 25); let S = 0; for (let k = 1; k <= n; k++) S += (2 * k - 1) ** 2; chk(S, n * (2 * n - 1) * (2 * n + 1) / 3);
          return { text: `1² + 3² + 5² + … + ${2 * n - 1}² = ?`, answer: S, show: String(S), tol: INT,
            solution: `Σ(2k − 1)² = 4Σk² − 4Σk + n = n(2n − 1)(2n + 1)/3 = ${n}·${2 * n - 1}·${2 * n + 1}/3 = ${S}.` }; }
        if (kind === "kk1") { const n = rnd(5, 40); let S = 0; for (let k = 1; k <= n; k++) S += k * (k + 1); chk(S, n * (n + 1) * (n + 2) / 3);
          return { text: `1·2 + 2·3 + 3·4 + … + ${n}·${n + 1} = ?`, answer: S, show: String(S), tol: INT,
            solution: `Σk(k + 1) = Σk² + Σk = n(n + 1)(n + 2)/3 = ${n}·${n + 1}·${n + 2}/3 = ${S}.` }; }
        if (kind === "alt") { const n = 2 * rnd(3, 25); let S = 0; for (let k = 1; k <= n; k++) S += (k % 2 ? 1 : -1) * k * k; chk(S, -n * (n + 1) / 2);
          return { text: `1² − 2² + 3² − 4² + … + ${n - 1}² − ${n}² = ?`, answer: S, show: sg(S), tol: INT,
            solution: `Cütlərlə qruplaşdır: (2k − 1)² − (2k)² = −(4k − 1). ${n / 2} cüt, cəm = −(4(1 + 2 + … + ${n / 2}) − ${n / 2}) = −(2·${n / 2}·${n / 2 + 1} − ${n / 2}) = −${n / 2}·${n + 1} = ${sg(S)}.` }; }
        const n = rnd(4, 25), T = sq(n);
        return { text: `1² + 2² + … + n² = ${T}. n = ?`, answer: n, show: String(n), tol: INT,
          solution: `n(n + 1)(2n + 1)/6 = ${T} → n(n + 1)(2n + 1) = ${6 * T}. n = ${n}: ${n}·${n + 1}·${2 * n + 1} = ${6 * T} ✓. Cəm n-lə artdığı üçün başqa n yoxdur.` };
      } },
    { id: "fib", ad: "Fibonaççi ardıcıllığı", izah: "F₁ = F₂ = 1, Fₙ = Fₙ₋₁ + Fₙ₋₂. Cəmlər: F₁ + … + Fₙ = Fₙ₊₂ − 1; tək nömrələr: F₂ₙ; cütlər: F₂ₙ₊₁ − 1; kvadratlar: Fₙ·Fₙ₊₁.",
      minVariety: 10,
      gen() {
        const kind = pick(["sum", "odd", "even", "sq", "gen", "gensum", "cassini", "cut"]);
        if (kind === "sum") { const n = rnd(8, 28); let S = 0; for (let i = 1; i <= n; i++) S += FIB[i]; chk(S, FIB[n + 2] - 1);
          return { text: `F₁ + F₂ + … + F${sub(n)} cəmini tap (F₁ = F₂ = 1).`, answer: S, show: String(S), tol: INT, solution: `Fₖ = Fₖ₊₂ − Fₖ₊₁ yazıb teleskopla: cəm = F${sub(n + 2)} − F₂ = ${FIB[n + 2]} − 1 = ${S}.` }; }
        if (kind === "odd") { const n = rnd(4, 14); let S = 0; for (let i = 1; i <= n; i++) S += FIB[2 * i - 1]; chk(S, FIB[2 * n]);
          return { text: `F₁ + F₃ + F₅ + … + F${sub(2 * n - 1)} cəmini tap.`, answer: S, show: String(S), tol: INT, solution: `F₁ = F₂, F₃ = F₄ − F₂, F₅ = F₆ − F₄, … Cəm = F${sub(2 * n)} = ${S}.` }; }
        if (kind === "even") { const n = rnd(4, 14); let S = 0; for (let i = 1; i <= n; i++) S += FIB[2 * i]; chk(S, FIB[2 * n + 1] - 1);
          return { text: `F₂ + F₄ + F₆ + … + F${sub(2 * n)} cəmini tap.`, answer: S, show: String(S), tol: INT, solution: `F₁ + … + F${sub(2 * n)} = F${sub(2 * n + 2)} − 1, tək nömrələrin cəmi F${sub(2 * n)} olur. Fərq: F${sub(2 * n + 2)} − F${sub(2 * n)} − 1 = F${sub(2 * n + 1)} − 1 = ${FIB[2 * n + 1]} − 1 = ${S}.` }; }
        if (kind === "sq") { const n = rnd(4, 20); let S = 0; for (let i = 1; i <= n; i++) S += FIB[i] ** 2; chk(S, FIB[n] * FIB[n + 1]);
          return { text: `F₁² + F₂² + … + F${sub(n)}² cəmini tap.`, answer: S, show: String(S), tol: INT, solution: `Σ Fₖ² = Fₙ·Fₙ₊₁ = ${FIB[n]}·${FIB[n + 1]} = ${S}.` }; }
        if (kind === "gen" || kind === "gensum") {
          const x = rnd(1, 6), y = rnd(1, 9), v = [x, y]; for (let i = 2; i < 16; i++) v.push(v[i - 1] + v[i - 2]);
          if (kind === "gen") { const k = rnd(8, 12);
            return { text: `a₁ = ${x}, a₂ = ${y}, aₙ = aₙ₋₁ + aₙ₋₂. ${a_(k)} = ?`, answer: v[k - 1], show: String(v[k - 1]), tol: INT, solution: v.slice(0, k).join("; ") + `. Cavab: ${v[k - 1]}.` }; }
          const n = rnd(6, 12); let S = 0; for (let i = 0; i < n; i++) S += v[i]; chk(S, v[n + 1] - y);
          return { text: `a₁ = ${x}, a₂ = ${y}, aₙ = aₙ₋₁ + aₙ₋₂. a₁ + a₂ + … + ${a_(n)} = ?`, answer: S, show: String(S), tol: INT, solution: `a₁ + … + aₙ = aₙ₊₂ − a₂. ${v.slice(0, n + 2).join("; ")}. Cəm = ${v[n + 1]} − ${y} = ${S}.` };
        }
        if (kind === "cassini") { const n = rnd(10, 30), v = FIB[n - 1] * FIB[n + 1] - FIB[n] ** 2; chk(Math.abs(v), 1);
          if (Math.abs(FIB[n - 1] * FIB[n + 1]) > 9e15) throw new Error("big");
          return { text: `F${sub(n - 1)}·F${sub(n + 1)} − F${sub(n)}² = ?`, answer: v, show: sg(v), tol: INT, solution: `Kassini eyniliyi: Fₙ₋₁Fₙ₊₁ − Fₙ² = (−1)ⁿ. n = ${n} ${n % 2 ? "tək" : "cütdür"} → ${sg(v)}.` }; }
        const m = pick([2, 3, 4, 5]), per = { 2: 3, 3: 4, 4: 6, 5: 5 }[m], N = rnd(20, 200);
        let c = 0, a = 0, b = 1; for (let i = 1; i <= N; i++) { [a, b] = [b, (a + b) % m]; if (a === 0) c++; } chk(c, Math.floor(N / per));
        return { text: `F₁, F₂, …, F${sub(N)} ədədlərindən neçəsi ${m} ədədinə qalıqsız bölünür?`, answer: c, show: String(c), tol: INT,
          solution: `Fibonaççi ədədlərini ${m} ədədinə böləndə qalıqlar dövri təkrarlanır: Fₙ ${m} ədədinə bölünür ⟺ ${per} ədədi n-i bölür. Belə nömrələrin sayı [${N}/${per}] = ${Math.floor(N / per)} (tam hissə).` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Məsələni rekurrentə sal: nəticə əvvəlki halların cəmi və ya əvvəlkinə nə isə əlavədir. İlk 2–3 halı əl ilə say.",
      gen() {
        const kind = pick(["stairs", "lines", "hanoi", "shake", "domino"]);
        if (kind === "stairs") { const n = rnd(4, 14);
          return { text: `Pilləkəndə ${n} pillə var. Fikrət hər addımda ya 1, ya 2 pillə qalxır. Pilləkənin başına neçə müxtəlif yolla çıxa bilər?`, answer: FIB[n + 1], show: String(FIB[n + 1]), tol: INT,
            solution: `Yolların sayı yₙ: son addım 1 pillədirsə yₙ₋₁ yol, 2 pillədirsə yₙ₋₂ yol → yₙ = yₙ₋₁ + yₙ₋₂, y₁ = 1, y₂ = 2. Bu, Fibonaççidir: yₙ = F${sub(n + 1)} = ${FIB[n + 1]}.` }; }
        if (kind === "lines") { const n = rnd(5, 25); let r = 1; for (let i = 1; i <= n; i++) r += i; chk(r, 1 + n * (n + 1) / 2);
          return { text: `Müstəvidə heç ikisi paralel olmayan və heç üçü bir nöqtədən keçməyən ${n} düz xətt çəkilib. Müstəvi neçə hissəyə bölünüb?`, answer: r, show: String(r), tol: INT,
            solution: `n-ci xətt əvvəlki n − 1 xətti n − 1 nöqtədə kəsir və n hissəni ikiyə bölür: Rₙ = Rₙ₋₁ + n, R₀ = 1. Rₙ = 1 + n(n + 1)/2 = 1 + ${n * (n + 1) / 2} = ${r}.` }; }
        if (kind === "hanoi") { const n = rnd(4, 12);
          return { text: `Hanoy qülləsi: ${n} diski birinci çubuqdan üçüncüyə köçürmək üçün (hər dəfə bir disk, böyük disk kiçiyin üstünə qoyulmaz) ən azı neçə gediş lazımdır?`, answer: 2 ** n - 1, show: String(2 ** n - 1), tol: INT,
            solution: `Hₙ = 2Hₙ₋₁ + 1 (əvvəl n − 1 diski çəkirik, böyüyü köçürürük, sonra n − 1 diski qaytarırıq), H₁ = 1. Hₙ = 2ⁿ − 1 = ${2 ** n - 1}.` }; }
        if (kind === "shake") { const n = rnd(8, 40);
          return { text: `${n} nəfər görüşür və hər cüt bir dəfə əl tutur. Cəmi neçə əl tutma olub?`, answer: n * (n - 1) / 2, show: String(n * (n - 1) / 2), tol: INT,
            solution: `Yeni gələn hər kəs əvvəlkilərin hamısı ilə əl tutur: 1 + 2 + … + ${n - 1} = ${n}·${n - 1}/2 = ${n * (n - 1) / 2}.` }; }
        const n = rnd(4, 14);
        return { text: `2×${n} ölçülü düzbucaqlını 1×2 ölçülü dominolarla (üst-üstə düşmədən, boşluqsuz) neçə üsulla örtmək olar?`, answer: FIB[n + 1], show: String(FIB[n + 1]), tol: INT,
          solution: `Sol kənardakı sütun ya şaquli bir domino ilə (qalan 2×${n - 1}), ya iki üfüqi domino ilə (qalan 2×${n - 2}) örtülür: dₙ = dₙ₋₁ + dₙ₋₂, d₁ = 1, d₂ = 2. Cavab F${sub(n + 1)} = ${FIB[n + 1]}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Hər addımı ayrıca yoxla: ayrılış düzgündürmü, ixtisardan sonra nə qalır, son hesab.",
      gen() {
        const n = rnd(8, 98), p = n, q = n + 1;
        const steps = [`1/(k(k + 1)) = 1/k − 1/(k + 1).`,
          `Cəm = (1 − 1/2) + (1/2 − 1/3) + … + (1/${n} − 1/${n + 1}) = 1 − 1/${n + 1}.`,
          `1 − 1/${n + 1} = ${n}/${n + 1}.`];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `1/(k(k + 1)) = 1/k + 1/(k + 1).`;
        if (bad === 1) steps[1] = `Cəm = (1 − 1/2) + (1/2 − 1/3) + … + (1/${n} − 1/${n + 1}) = 1 − 1/${n}.`;
        if (bad === 2) steps[2] = `1 − 1/${n + 1} = ${n + 1}/${n + 2}.`;
        const text = h("div", {}, h("p", {}, `Fikrət 1/(1·2) + 1/(2·3) + … + 1/(${n}·${n + 1}) cəmini hesablayır. Hansı addımda səhv var?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: düz ayrılış 1/k − 1/(k + 1) (yoxla: 1/k − 1/(k + 1) = 1/(k(k + 1)) ✓; "+" ilə cəm ixtisar olunmaz). Düz cavab ${n}/${n + 1}.`,
          `2-ci addım: ixtisardan sonra ilk ədəd 1 və sonuncu − 1/${n + 1} qalır: 1 − 1/${n + 1}, 1/${n} yox. Düz cavab ${n}/${n + 1}.`,
          `3-cü addım: 1 − 1/${n + 1} = ${n}/${n + 1}, çünki (${n + 1} − 1)/${n + 1}.`][bad];
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
      key: "ol-ardicilliqlar", title: "Ardıcıllıqlar və sonlu cəmlər", fenn: "olimpiada", link: "dersler/ol-ardicilliqlar.html",
      format: "Cavab ədəddir: tam (385), mənfi (−45), kəsr 99/100 (onluq 0.99 da olar).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["rekur", "dovri", "dovri", "teleskop", "teleskop", "kvadrat", "kvadrat", "fib", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-ardicilliqlar.html")) b.push("dersler/ol-ardicilliqlar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
