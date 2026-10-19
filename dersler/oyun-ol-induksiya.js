// Riyazi induksiya (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const bgcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; };
  const SUB = "₀₁₂₃₄₅₆₇₈₉", sub = n => String(n).split("").map(d => SUB[+d]).join("");
  const SUPM = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", n: "ⁿ", k: "ᵏ", "+": "⁺", "−": "⁻", "-": "⁻" };
  const sup = n => String(n).split("").map(d => SUPM[d] || d).join("");
  const sg = n => n < 0 ? "−" + (-n) : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? sg(p / g) : sg(p / g) + "/" + (q / g); };
  const INT = 0.01;
  const chk = (a, b) => { if (a !== b && Math.abs(a - b) > 1e-9) throw new Error("internal mismatch " + a + " vs " + b); };
  const fact = n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };

  // ---------- level 1: values from a proven summation formula ----------
  const FORM = [
    { s: "1 + 2 + 3 + … + n", F: n => n * (n + 1) / 2, term: k => k, fs: "n(n + 1)/2", ev: n => `${n}·${n + 1}/2`, tk: "k", n: [20, 200], tx: n => `1 + 2 + … + ${n}` },
    { s: "1 + 3 + 5 + … + (2n − 1)", F: n => n * n, term: k => 2 * k - 1, fs: "n²", ev: n => `${n}²`, tk: "2k − 1", n: [15, 80], tx: n => `1 + 3 + 5 + … + ${2 * n - 1}` },
    { s: "1² + 2² + … + n²", F: n => n * (n + 1) * (2 * n + 1) / 6, term: k => k * k, fs: "n(n + 1)(2n + 1)/6", ev: n => `${n}·${n + 1}·${2 * n + 1}/6`, tk: "k²", n: [8, 30], tx: n => `1² + 2² + … + ${n}²` },
    { s: "1³ + 2³ + … + n³", F: n => (n * (n + 1) / 2) ** 2, term: k => k ** 3, fs: "(n(n + 1)/2)²", ev: n => `(${n}·${n + 1}/2)²`, tk: "k³", n: [6, 20], tx: n => `1³ + 2³ + … + ${n}³` },
    { s: "1·1! + 2·2! + … + n·n!", F: n => fact(n + 1) - 1, term: k => k * fact(k), fs: "(n + 1)! − 1", ev: n => `${n + 1}! − 1`, tk: "k·k!", n: [4, 8], tx: n => `1·1! + 2·2! + … + ${n}·${n}!` },
    { s: "1 + 2 + 4 + … + 2ⁿ⁻¹", F: n => 2 ** n - 1, term: k => 2 ** (k - 1), fs: "2ⁿ − 1", ev: n => `2${sup(n)} − 1`, tk: "2ᵏ⁻¹", n: [6, 18], tx: n => `1 + 2 + 4 + … + 2${sup(n - 1)}` },
    { s: "1·2⁰ + 2·2¹ + … + n·2ⁿ⁻¹", F: n => (n - 1) * 2 ** n + 1, term: k => k * 2 ** (k - 1), fs: "(n − 1)·2ⁿ + 1", ev: n => `${n - 1}·2${sup(n)} + 1`, tk: "k·2ᵏ⁻¹", n: [4, 12], tx: n => `1·1 + 2·2 + 3·4 + … + ${n}·2${sup(n - 1)}` },
    { s: "1·2 + 2·3 + … + n(n + 1)", F: n => n * (n + 1) * (n + 2) / 3, term: k => k * (k + 1), fs: "n(n + 1)(n + 2)/3", ev: n => `${n}·${n + 1}·${n + 2}/3`, tk: "k(k + 1)", n: [8, 40], tx: n => `1·2 + 2·3 + … + ${n}·${n + 1}` },
    { s: "1 + 4 + 7 + … + (3n − 2)", F: n => n * (3 * n - 1) / 2, term: k => 3 * k - 2, fs: "n(3n − 1)/2", ev: n => `${n}·${3 * n - 1}/2`, tk: "3k − 2", n: [10, 60], tx: n => `1 + 4 + 7 + … + ${3 * n - 2}` },
  ];
  FORM.forEach(f => { for (let n = 1; n <= 12; n++) { let S = 0; for (let k = 1; k <= n; k++) S += f.term(k); chk(S, f.F(n)); } });

  const levels = [
    { id: "formul", ad: "Sübut olunmuş düsturdan hesabla", izah: "Düstur induksiya ilə sübut olunub — onu birbaşa tətbiq et. Hissə cəmi: F(b) − F(a − 1). Kəsr cəmdə cavab kəsrdir.",
      gen() {
        const kind = pick(["val", "val", "range", "frac", "findn"]);
        if (kind === "frac") {
          const n = rnd(9, 60), a = pick([1, 1, 1, 3, 5]), b = n, p = b * a - (a - 1) * (b + 1), q = (b + 1) * a;
          // exact check by loop in BigInt
          let P = 0n, Q = 1n; for (let k = a; k <= b; k++) { const K = BigInt(k); P = P * K * (K + 1n) + Q; Q = Q * K * (K + 1n); const g = bgcd(P, Q); P /= g; Q /= g; }
          const g2 = gcd(Math.abs(p), q); if (P !== BigInt(p / g2) || Q !== BigInt(q / g2)) throw new Error("frac mismatch");
          return { text: `Induksiya ilə sübut olunub: 1/(1·2) + 1/(2·3) + … + 1/(n(n + 1)) = n/(n + 1). Bu düsturdan istifadə edib ` + (a === 1 ? `1/(1·2) + … + 1/(${n}·${n + 1})` : `1/(${a}·${a + 1}) + … + 1/(${n}·${n + 1})`) + ` cəmini tap.`,
            answer: p / q, show: frac(p, q), tol: 0.0001,
            solution: a === 1 ? `n = ${n} qoy: ${n}/${n + 1}.` : `Cəm = S(${n}) − S(${a - 1}) = ${n}/${n + 1} − ${a - 1}/${a} = ${frac(p, q)}.` };
        }
        const f = pick(FORM), n = rnd(f.n[0], f.n[1]);
        if (kind === "val") {
          return { text: `Induksiya ilə sübut olunub: ${f.s} = ${f.fs}. n = ${n} üçün ${f.tx(n)} cəmini tap.`, answer: f.F(n), show: String(f.F(n)), tol: INT,
            solution: `n = ${n} üçün: ${f.ev(n)} = ${f.F(n)}.` };
        }
        if (kind === "range") {
          const a = rnd(3, Math.max(4, Math.floor(n / 2))), v = f.F(n) - f.F(a - 1);
          let S = 0; for (let k = a; k <= n; k++) S += f.term(k); chk(S, v);
          return { text: `Düstur (induksiya ilə sübut olunub): ${f.s} = ${f.fs}. Bu düsturdan istifadə edib k = ${a}, ${a + 1}, …, ${n} üçün (${f.tk}) hədlərinin cəmini tap.`, answer: v, show: String(v), tol: INT,
            solution: `Cəm = (k = 1…${n} üzrə cəm) − (k = 1…${a - 1} üzrə cəm) = F(${n}) − F(${a - 1}) = ${f.F(n)} − ${f.F(a - 1)} = ${v}.` };
        }
        // findn: smallest n with F(n) above a threshold (monotone)
        const nn = rnd(f.n[0], Math.min(f.n[1], 25)), T = f.F(nn - 1) + Math.floor((f.F(nn) - f.F(nn - 1)) / 2);
        if (!(f.F(nn - 1) <= T && T < f.F(nn))) throw new Error("threshold");
        return { text: `Induksiya ilə sübut olunub: ${f.s} = ${f.fs}. Cəmin ${T}-dən böyük olması üçün ən azı neçə hədd götürmək lazımdır? (n = ?)`, answer: nn, show: String(nn), tol: INT,
          solution: `F(n) = ${f.fs} artandır. F(${nn - 1}) = ${f.F(nn - 1)} ≤ ${T}, F(${nn}) = ${f.F(nn)} > ${T}. Cavab: n = ${nn}.` };
      } },
    { id: "tapma", ad: "Qanunu tap, sonra induksiya", izah: "İlk 4–5 həddi hesabla, qanunu təxmin et, düsturu yoxla. Təxmin induksiya ilə sübut olunur.",
      gen() {
        const kind = pick(["sq", "geo", "lin", "lin3", "fact", "cube", "tri", "pow"]);
        const seq = (a1, step, k) => { const v = [a1]; for (let n = 1; n < k; n++) v.push(step(v[n - 1], n)); return v; };
        const out = (rule, a1, v, k, guess, why) => ({ text: `a₁ = ${sg(a1)}, ${rule}. a${sub(k)} = ?`, answer: v[k - 1], show: sg(v[k - 1]), tol: INT,
          solution: `a₁…a₅: ${v.slice(0, 5).map(sg).join("; ")}. Təxmin: ${guess}. ${why} Cavab: a${sub(k)} = ${sg(v[k - 1])}.` });
        if (kind === "sq") { const k = rnd(10, 30), v = seq(1, (a, n) => a + 2 * n + 1, k); chk(v[k - 1], k * k);
          return out("aₙ₊₁ = aₙ + 2n + 1", 1, v, k, "aₙ = n²", "İnduksiya addımı: n² + 2n + 1 = (n + 1)²."); }
        if (kind === "geo") { const k = rnd(8, 20), v = seq(1, (a) => 2 * a + 1, k); chk(v[k - 1], 2 ** k - 1);
          return out("aₙ₊₁ = 2aₙ + 1", 1, v, k, "aₙ = 2ⁿ − 1", "İnduksiya addımı: 2(2ⁿ − 1) + 1 = 2ⁿ⁺¹ − 1."); }
        if (kind === "lin") { let d, a1; do { d = rnd(-5, 5) || 3; a1 = rnd(-3, 5); } while (a1 + d === 0); const p = 2, k = rnd(6, 14), v = seq(a1, (a) => p * a + d, k);
          const val = (a1 + d) * 2 ** (k - 1) - d; chk(v[k - 1], val);
          return out(`aₙ₊₁ = 2aₙ ${d < 0 ? "−" : "+"} ${Math.abs(d)}`, a1, v, k, `aₙ ${d < 0 ? "−" : "+"} ${Math.abs(d)} = ${sg(a1 + d)}·2ⁿ⁻¹, yəni aₙ = ${sg(a1 + d)}·2ⁿ⁻¹ ${d < 0 ? "+" : "−"} ${Math.abs(d)}`, `Addım: aₙ₊₁ ${d < 0 ? "−" : "+"} ${Math.abs(d)} = 2(aₙ ${d < 0 ? "−" : "+"} ${Math.abs(d)}).`); }
        if (kind === "lin3") { const e = rnd(1, 4), d = 2 * e, a1 = rnd(1, 5), k = rnd(5, 10), v = seq(a1, (a) => 3 * a + d, k);
          const val = (a1 + e) * 3 ** (k - 1) - e; chk(v[k - 1], val);
          return out(`aₙ₊₁ = 3aₙ + ${d}`, a1, v, k, `aₙ + ${e} = ${a1 + e}·3ⁿ⁻¹`, `Addım: aₙ₊₁ + ${e} = 3(aₙ + ${e}).`); }
        if (kind === "fact") { const k = rnd(6, 10), v = seq(1, (a, n) => (n + 1) * a, k); chk(v[k - 1], fact(k));
          return out("aₙ₊₁ = (n + 1)·aₙ", 1, v, k, "aₙ = n!", "Addım: (n + 1)·n! = (n + 1)!."); }
        if (kind === "cube") { const k = rnd(6, 14), v = seq(1, (a, n) => a + 3 * n * n + 3 * n + 1, k); chk(v[k - 1], k ** 3);
          return out("aₙ₊₁ = aₙ + 3n² + 3n + 1", 1, v, k, "aₙ = n³", "Addım: n³ + 3n² + 3n + 1 = (n + 1)³."); }
        if (kind === "tri") { const k = rnd(8, 25), v = seq(0, (a, n) => a + n * (n + 1), k); chk(v[k - 1], (k - 1) * k * (k + 1) / 3);
          return out("aₙ₊₁ = aₙ + n(n + 1)", 0, v, k, "aₙ = (n − 1)n(n + 1)/3", "Addım: (n − 1)n(n + 1)/3 + n(n + 1) = n(n + 1)(n + 2)/3."); }
        const k = rnd(7, 14), v = seq(2, (a) => 2 * a - 1, k); chk(v[k - 1], 2 ** (k - 1) + 1);
        return out("aₙ₊₁ = 2aₙ − 1", 2, v, k, "aₙ = 2ⁿ⁻¹ + 1", "Addım: 2(2ⁿ⁻¹ + 1) − 1 = 2ⁿ + 1."); } },
    { id: "baza", ad: "Baza: ən kiçik n₀", izah: "Bərabərsizlik kiçik n-də yalan, böyük n-də doğru ola bilər. Baza = ilk n₀ ki, ondan sonra hər n üçün doğrudur (n₀ − 1 isə pozulur).",
      gen() {
        const kind = pick(["a", "b", "c", "d", "e"]);
        let L, R, ls, rs, A, B;
        if (kind === "a") { A = rnd(5, 60); L = n => 2n ** n; R = n => BigInt(A) * n; ls = `2ⁿ`; rs = `${A}n`; }
        else if (kind === "b") { A = rnd(0, 40); L = n => 2n ** n; R = n => n * n + BigInt(A); ls = `2ⁿ`; rs = `n² + ${A}`; }
        else if (kind === "c") { B = rnd(2, 6); L = n => { let f = 1n; for (let i = 2n; i <= n; i++) f *= i; return f; }; R = n => BigInt(B) ** n; ls = `n!`; rs = `${B}ⁿ`; }
        else if (kind === "d") { A = rnd(2, 20); L = n => 2n ** n; R = n => BigInt(A) * n * n; ls = `2ⁿ`; rs = `${A}n²`; }
        else { A = rnd(2, 30); L = n => 3n ** n; R = n => BigInt(A) * n * n; ls = `3ⁿ`; rs = `${A}n²`; }
        let last = 0; for (let n = 1; n <= 90; n++) if (!(L(BigInt(n)) > R(BigInt(n)))) last = n;
        const n0 = last + 1;
        if (n0 > 60) throw new Error("n0 too big");
        const rel = n => L(BigInt(n)) > R(BigInt(n));
        // induction step sanity: once true at n ≥ n0, stays true (checked up to 90)
        const nm = n0 - 1;
        const tail = nm >= 1 ? `n = ${nm}: ${L(BigInt(nm))} ${rel(nm) ? ">" : "≤"} ${R(BigInt(nm))} (pozulur). ` : "";
        return { text: `${ls} > ${rs} bərabərsizliyi bütün n ≥ n₀ üçün doğrudur. Bu şərti ödəyən ən kiçik n₀ natural ədədini tap.`, answer: n0, show: String(n0), tol: INT,
          solution: `Hesabla: ${tail}n = ${n0}: ${L(BigInt(n0))} > ${R(BigInt(n0))} ✓. Bundan sonra hər addımda sol tərəf ${kind === "c" ? "(n + 1) dəfə" : kind === "e" ? "3 dəfə" : "2 dəfə"} artır, sağ tərəf daha yavaş — induksiya addımı işləyir. n₀ = ${n0}.` };
      } },
    { id: "bolunme", ad: "Bölünmə: ən böyük bölən", izah: "f(n) bütün natural n üçün hansı ən böyük ədədə bölünür? f(1), f(2), f(3)-ün EBOB-unu tap, sonra induksiya ilə sübut et.",
      gen() {
        const FAM = [
          () => { const a = rnd(3, 12); return { t: `${a}ⁿ − 1`, f: n => BigInt(a) ** n - 1n, exp: a - 1, step: `f(k + 1) = ${a}·f(k) + ${a - 1}` }; },
          () => { const a = rnd(3, 8); return { t: `${a}ⁿ − ${a - 1}n − 1`, f: n => BigInt(a) ** n - BigInt(a - 1) * n - 1n, exp: (a - 1) * (a - 1), step: `f(k + 1) = ${a}·f(k) + ${(a - 1) * (a - 1)}·k` }; },
          () => ({ t: "n(n + 1)(n + 2)", f: n => n * (n + 1n) * (n + 2n), exp: 6, step: "f(k + 1) − f(k) = 3(k + 1)(k + 2), burada (k + 1)(k + 2) cütdür, deməli fərq 6 ədədinə bölünür" }),
          () => ({ t: "n(n + 1)(n + 2)(n + 3)", f: n => n * (n + 1n) * (n + 2n) * (n + 3n), exp: 24, step: "f(k + 1) − f(k) = 4(k + 1)(k + 2)(k + 3), üç ardıcıl ədədin hasili 6 ədədinə bölünür, deməli fərq 24 ədədinə bölünür" }),
          () => { const c = pick([5, 11, 17]); return { t: `n³ + ${c}n`, f: n => n ** 3n + BigInt(c) * n, exp: 6, step: `f(k + 1) − f(k) = 3k(k + 1) + ${c + 1}, burada k(k + 1) cütdür` }; },
          () => ({ t: "n³ + 2n", f: n => n ** 3n + 2n * n, exp: 3, step: "f(k + 1) − f(k) = 3k² + 3k + 3" }),
          () => ({ t: "3²ⁿ⁺¹ + 2ⁿ⁺²", f: n => 3n ** (2n * n + 1n) + 2n ** (n + 2n), exp: 7, step: "f(k + 1) = 9·f(k) − 7·2ᵏ⁺²" }),
          () => ({ t: "11ⁿ⁺¹ + 12²ⁿ⁻¹", f: n => 11n ** (n + 1n) + 12n ** (2n * n - 1n), exp: 133, step: "f(k + 1) = 11·f(k) + 133·12²ᵏ⁻¹" }),
        ];
        const fam = pick(FAM)(), vals = [];
        let g = 0n; for (let n = 1n; n <= 14n; n++) { const v = fam.f(n); if (n <= 3n) vals.push(v); g = bgcd(g, v); }
        if (g !== BigInt(fam.exp) || bgcd(vals[0], vals[1]) !== BigInt(fam.exp)) throw new Error("gcd mismatch " + fam.t + " " + g);
        return { text: `f(n) = ${fam.t}. Bu ifadə bütün natural n üçün hansı ən böyük natural ədədə bölünür?`, answer: fam.exp, show: String(fam.exp), tol: INT,
          solution: `f(1) = ${vals[0]}, f(2) = ${vals[1]}, f(3) = ${vals[2]}. f(1) və f(2)-nin EBOB-u ${fam.exp}, deməli cavab ${fam.exp}-dən böyük ola bilməz. Bölünməsi induksiya ilə: baza — f(1) bu ədədə bölünür; addım — ${fam.step}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "İnduksiyanın təbii yeri: 'bir addım əlavə etsək nə dəyişir'. Çubuqdan tutmuş turnirə qədər kiçik halı say, sonra addımı tap.",
      gen() {
        const kind = pick(["coin", "coin", "choco", "tourn", "hanoi"]);
        if (kind === "coin") {
          const pr = pick([[3, 4], [3, 5], [3, 7], [4, 5], [5, 7], [2, 5], [4, 7], [5, 6], [3, 8], [2, 7]]), [a, b] = pr, ans = a * b - a - b;
          let best = 0; for (let m = 1; m <= a * b + 20; m++) { let ok = false; for (let i = 0; i * a <= m && !ok; i++) if ((m - i * a) % b === 0) ok = true; if (!ok) best = m; }
          chk(best, ans);
          return { text: `Bankomatda yalnız ${a} manatlıq və ${b} manatlıq əskinaslar var. Neçə manat məbləği bu əskinaslarla vermək mümkün deyil, bunlardan ən böyüyü neçədir?`, answer: ans, show: String(ans), tol: INT,
            solution: `Məbləğ ${a}x + ${b}y. Ardıcıl ${a} məbləği (məs. ${ans + 1}, …, ${ans + a}) mümkündürsə, induksiya (hər məbləğə ${a} əlavə et) ilə sonrakıların hamısı mümkündür. Ən böyük mümkün olmayan: ${a}·${b} − ${a} − ${b} = ${ans}.` };
        }
        if (kind === "choco") {
          const m = rnd(3, 12), n = rnd(3, 12);
          return { text: `${m}×${n} ölçülü şokolad plitəsi var (${m * n} kvadrat). Hər dəfə bir parçanı düz xətt boyunca iki hissəyə sındırırsan. Plitəni ${m * n} ayrı kvadrata ayırmaq üçün ən azı neçə sındırma lazımdır?`, answer: m * n - 1, show: String(m * n - 1), tol: INT,
            solution: `Hər sındırma parçaların sayını düz 1 artırır (induksiya: k parçadan k − 1 sındırma). ${m * n} parça üçün ${m * n} − 1 = ${m * n - 1} sındırma lazımdır, plitənin forması vacib deyil.` };
        }
        if (kind === "tourn") {
          const N = rnd(9, 64);
          return { text: `Turnirdə ${N} oyunçu var, məğlub olan kənarlaşır (bərabərlik yoxdur). Qalibi təyin etmək üçün cəmi neçə oyun keçirilməlidir?`, answer: N - 1, show: String(N - 1), tol: INT,
            solution: `Hər oyunda dəqiq bir oyunçu kənarlaşır. Bir qalib qalmalıdır, yəni ${N} − 1 oyunçu kənarlaşmalıdır: ${N - 1} oyun. (İnduksiya: n oyunçudan n − 1 oyun.)` };
        }
        const n = rnd(5, 12);
        return { text: `Hanoy qülləsi: ${n} diski bir çubuqdan digərinə köçürmək üçün (hər dəfə bir disk, böyük disk kiçiyin üstünə qoyulmaz) minimum gediş sayı Hₙ = 2Hₙ₋₁ + 1, H₁ = 1. H${sub(n)} = ?`, answer: 2 ** n - 1, show: String(2 ** n - 1), tol: INT,
          solution: `H₁ = 1, H₂ = 3, H₃ = 7, H₄ = 15 → Hₙ = 2ⁿ − 1 (induksiya: 2(2ⁿ⁻¹ − 1) + 1 = 2ⁿ − 1). H${sub(n)} = ${2 ** n - 1}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "İnduksiya sübutunun üç hissəsi: baza, addım (P(k) ⟹ P(k + 1)), nəticə. Hansı hissə düzgün deyil?",
      gen() {
        const kind = pick(["odd", "tel", "div", "ar", "ar"]);
        const noBase = `Baza yoxlanılmır: "tutaq ki, P(k) doğrudur" deyib birbaşa addıma keçirik.`;
        const circ = `Addım. P(k + 1)-i doğru qəbul edək və ondan P(k)-nı çıxaraq.`;
        const twoCases = `Nəticə. P(1) və P(2) doğrudur. Deməli, P(n) bütün natural n üçün doğrudur.`;
        const noBaseEnd = `Nəticə. P(k) ⟹ P(k + 1) göstərildi. Deməli, P(n) bütün natural n üçün doğrudur (baza lazım deyil).`;
        let title, good, bads;
        if (kind === "odd") {
          title = "1 + 3 + 5 + … + (2n − 1) = n²";
          good = [`Baza. n = 1: sol tərəf 1, sağ tərəf 1² = 1. Doğrudur.`,
            `Addım. P(k) doğrudur: 1 + 3 + … + (2k − 1) = k². Hər iki tərəfə (2k + 1) əlavə edək: k² + (2k + 1) = (k + 1)². Bu, P(k + 1)-dir.`,
            `Nəticə. P(1) doğrudur və P(k) ⟹ P(k + 1). Deməli, P(n) bütün natural n üçün doğrudur.`];
          bads = [[`Baza. n = 1: sol tərəf 1, sağ tərəf 1² = 2. Bərabərlik doğrudur.`, noBase],
            [`Addım. P(k) doğrudur. Hər iki tərəfə (2k − 1) əlavə edək: k² + (2k − 1) = (k + 1)². Bu, P(k + 1)-dir.`, circ],
            [twoCases, noBaseEnd]];
        } else if (kind === "div") {
          const A = rnd(3, 9), m = A - 1;
          title = `${A}ⁿ − 1 ifadəsi ${m} ədədinə bölünür`;
          good = [`Baza. n = 1: ${A}¹ − 1 = ${m}, bu ${m} ədədinə bölünür.`,
            `Addım. P(k) doğrudur: ${A}ᵏ − 1 = ${m}t. Onda ${A}ᵏ⁺¹ − 1 = ${A}(${A}ᵏ − 1) + ${m} = ${m}(${A}t + 1), yəni ${m} ədədinə bölünür. Bu, P(k + 1)-dir.`,
            `Nəticə. P(1) doğrudur və P(k) ⟹ P(k + 1). Deməli, P(n) bütün natural n üçün doğrudur.`];
          bads = [[`Baza. n = 1: ${A}¹ − 1 = ${A}, bu ${m} ədədinə bölünür.`, noBase],
            [`Addım. P(k) doğrudur: ${A}ᵏ − 1 = ${m}t. Onda ${A}ᵏ⁺¹ − 1 = ${A}(${A}ᵏ − 1) + ${A} = ${m}(${A}t) + ${A}, hər iki toplanan ${m} ədədinə bölünür. Bu, P(k + 1)-dir.`, circ],
            [twoCases, noBaseEnd]];
        } else if (kind === "ar") {
          const a0 = rnd(1, 5), d = rnd(2, 6);
          title = `${a0} + ${a0 + d} + ${a0 + 2 * d} + … + (${a0} + (n − 1)·${d}) = n(${2 * a0} + (n − 1)·${d})/2`;
          good = [`Baza. n = 1: sol tərəf ${a0}, sağ tərəf 1·(${2 * a0} + 0)/2 = ${a0}. Doğrudur.`,
            `Addım. P(k) doğrudur. Hər iki tərəfə (k + 1)-ci hədd olan ${a0} + k·${d} əlavə edək: k(${2 * a0} + (k − 1)·${d})/2 + ${a0} + k·${d} = (k + 1)(${2 * a0} + k·${d})/2. Bu, P(k + 1)-dir.`,
            `Nəticə. P(1) doğrudur və P(k) ⟹ P(k + 1). Deməli, P(n) bütün natural n üçün doğrudur.`];
          bads = [[`Baza. n = 1: sol tərəf ${a0}, sağ tərəf 1·(${2 * a0} + 0)/2 = ${2 * a0}. Bərabərlik doğrudur.`, noBase],
            [`Addım. P(k) doğrudur. Hər iki tərəfə k-cı hədd olan ${a0} + (k − 1)·${d} əlavə edək, nəticədə (k + 1)(${2 * a0} + k·${d})/2 alınır. Bu, P(k + 1)-dir.`, circ],
            [twoCases, noBaseEnd]];
        } else {
          title = "1/(1·2) + 1/(2·3) + … + 1/(n(n + 1)) = n/(n + 1)";
          good = [`Baza. n = 1: sol tərəf 1/(1·2) = 1/2, sağ tərəf 1/(1 + 1) = 1/2. Doğrudur.`,
            `Addım. P(k) doğrudur. Əlavə edək 1/((k + 1)(k + 2)): k/(k + 1) + 1/((k + 1)(k + 2)) = (k(k + 2) + 1)/((k + 1)(k + 2)) = (k + 1)²/((k + 1)(k + 2)) = (k + 1)/(k + 2). Bu, P(k + 1)-dir.`,
            `Nəticə. P(1) doğrudur və P(k) ⟹ P(k + 1). Deməli, P(n) bütün natural n üçün doğrudur.`];
          bads = [[`Baza. n = 1: sol tərəf 1/(1·2) = 1/2, sağ tərəf 1/(1 + 1) = 1. Bərabərlik doğrudur.`, noBase],
            [`Addım. P(k) doğrudur. Əlavə edək 1/(k(k + 1)): k/(k + 1) + 1/(k(k + 1)) = (k² + 1)/(k(k + 1)). Bu, P(k + 1)-dir.`, circ],
            [twoCases, noBaseEnd]];
        }
        const bad = rnd(0, 2), steps = good.slice(); steps[bad] = pick(bads[bad]);
        const text = h("div", {}, h("p", {}, `Fikrət induksiya ilə P(n) iddiasını sübut edir: ${title}. Hansı hissədə səhv var?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci hissə (baza) səhvdir: n = 1 üçün iki tərəf bərabər olmalıdır və baza mütləq yoxlanmalıdır. İnduksiyanın hər iki ayağı lazımdır.`,
          `2-ci hissə (addım) səhvdir: P(k)-dan P(k + 1) alınmalıdır — əlavə olunan hədd (k + 1)-ci hədd olmalıdır və nəticə P(k + 1)-ə uyğun gəlməlidir; P(k + 1)-dən başlamaq dairəvi mühakimədir.`,
          `3-cü hissə (nəticə) səhvdir: baza P(1) və addım P(k) ⟹ P(k + 1) birlikdə lazımdır. Bir neçə halı yoxlamaq və ya bazasız addım sübut deyil.`][bad];
        const ch = ["1-ci hissə", "2-ci hissə", "3-cü hissə"];
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
      key: "ol-induksiya", title: "Riyazi induksiya", fenn: "olimpiada", link: "dersler/ol-induksiya.html",
      format: "Cavab ədəddir: tam (385), mənfi (−45), kəsr 99/100 (onluq 0.99 da olar). Seçimli suallarda variantı seç.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["formul", "formul", "tapma", "tapma", "baza", "baza", "bolunme", "bolunme", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-induksiya.html")) b.push("dersler/ol-induksiya.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
