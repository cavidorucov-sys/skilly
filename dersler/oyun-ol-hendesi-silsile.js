// Həndəsi silsilə (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const SUB = "₀₁₂₃₄₅₆₇₈₉", sub = n => String(n).split("").map(d => SUB[+d]).join("");
  const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", n: "ⁿ", "−": "⁻", "-": "⁻" }, sup = n => String(n).split("").map(d => SUP[d]).join("");
  const sg = n => n < 0 ? "−" + (-n) : String(n);          // number with a real minus sign
  const par = n => n < 0 ? "(" + sg(n) + ")" : String(n);   // number inside a product
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? sg(p / g) : sg(p / g) + "/" + (q / g); };
  const b_ = k => "b" + sub(k), S_ = k => "S" + sub(k);
  const INT = 0.01;
  const ord = n => { const L = { 1: "ci", 2: "ci", 3: "cü", 4: "cü", 5: "ci", 6: "cı", 7: "ci", 8: "ci", 9: "cu" }, T = { 1: "cu", 2: "ci", 3: "cu", 4: "cı", 5: "ci", 6: "cı", 7: "ci", 8: "ci", 9: "cı" }; return n % 1000 === 0 ? n + "-ci" : n % 100 === 0 ? n + "-cü" : n % 10 ? n + "-" + L[n % 10] : n + "-" + T[(n / 10) % 10]; };   // ordinal suffix by pronunciation
  const pw = (q, e) => Math.pow(q, e);
  const gp = (b1, q, k) => Array.from({ length: k }, (_, i) => sg(b1 * pw(q, i))).join("; ") + "; …";
  const chk = (a, b) => { if (Math.abs(a - b) > 1e-9) throw new Error("internal mismatch " + a + " vs " + b); };

  const levels = [
    { id: "bn", ad: "n-ci hədd", izah: "bₙ = b₁·qⁿ⁻¹. Silsilənin məxrəci q = b₂ : b₁. İki hədd verilirsə: bₘ : bₖ = q^(m − k).",
      gen() {
        const kind = pick(["basic", "list", "frac", "two", "two"]);
        if (kind === "basic" || kind === "list") {
          const b1 = pick([1, 2, 3, 4, 5, -1, -2, -3]), q = pick([2, 3, 4, 5, -2, -3]), n = rnd(4, q > 3 || q < -2 ? 6 : 8), bn = b1 * pw(q, n - 1);
          const text = kind === "basic" ? `Həndəsi silsilədə ${b_(1)} = ${sg(b1)}, q = ${sg(q)}. ${b_(n)} = ?` : `${gp(b1, q, 3)} həndəsi silsiləsinin ${ord(n)} həddini tap.`;
          return { text, answer: bn, show: sg(bn), tol: INT,
            solution: (kind === "list" ? `q = ${sg(b1 * q)} : ${par(b1)} = ${sg(q)}. ` : "") + `${b_(n)} = ${sg(b1)}·${par(q)}${sup(n - 1)} = ${sg(b1)}·${par(pw(q, n - 1))} = ${sg(bn)}.` };
        }
        if (kind === "frac") {
          const q = pick([2, 3]), n = rnd(4, q === 2 ? 8 : 6), c = rnd(1, 9) * pick([1, -1]), b1 = c * pw(q, n - 1);
          return { text: `${sg(b1)}; ${sg(b1 / q)}; ${sg(b1 / q / q)}; … həndəsi silsiləsinin ${ord(n)} həddini tap.`, answer: c, show: sg(c), tol: INT,
            solution: `q = ${sg(b1 / q)} : ${par(b1)} = 1/${q}. ${b_(n)} = ${sg(b1)}·(1/${q})${sup(n - 1)} = ${sg(b1)} : ${pw(q, n - 1)} = ${sg(c)}.` };
        }
        // two terms: m − k = 1 or 3 (q unique, any sign), or 2 with all terms positive
        const gap = pick([1, 3, 2]), pos = gap === 2, q = pos ? pick([2, 3]) : pick([2, 3, -2, -3]);
        const b1 = pos ? pick([1, 2, 3, 5]) : pick([1, 2, 3, -1, -2]), k = rnd(1, 3), m = k + gap, n = m + rnd(1, 3);
        const bk = b1 * pw(q, k - 1), bm = b1 * pw(q, m - 1), bn = b1 * pw(q, n - 1);
        chk(bm / bk, pw(q, gap));
        return { text: `Həndəsi silsilədə ${b_(k)} = ${sg(bk)}, ${b_(m)} = ${sg(bm)}${pos ? " və bütün hədlər müsbətdir" : ""}. ${b_(n)} = ?`, answer: bn, show: sg(bn), tol: INT,
          solution: `${b_(m)} : ${b_(k)} = q${sup(gap)} → ${sg(bm)} : ${par(bk)} = ${pw(q, gap)}, ` + (gap === 2 ? `q = ${q} (hədlər müsbətdir)` : gap === 1 ? `q = ${sg(q)}` : `q = ${sg(q)} (tək qüvvət, işarə birqiymətli)`) + `. ${b_(n)} = ${b_(m)}·q${sup(n - m)} = ${sg(bm)}·${par(pw(q, n - m))} = ${sg(bn)}.` };
      } },
    { id: "nomre", ad: "Hədd nömrəsi", izah: "Nömrəni tapmaq üçün b₁·qⁿ⁻¹ = verilən ədəd bərabərliyini qüvvət kimi həll et. 'İlk dəfə aşan' məsələlərdə hədləri ardıcıl yaz.",
      gen() {
        const kind = pick(["which", "count", "first", "first"]);
        if (kind === "which" || kind === "count") {
          const b1 = pick([1, 2, 3, 5, 7]), q = pick([2, 2, 3]), n = rnd(5, q === 2 ? 12 : 8), L = b1 * pw(q, n - 1);
          if (kind === "which") return { text: `${L} ədədi ${gp(b1, q, 3)} həndəsi silsiləsinin neçənci həddidir?`, answer: n, show: String(n), tol: INT,
            solution: `q = ${q}. ${b1}·${q}${sup("n−1")} = ${L} → ${q}${sup("n−1")} = ${L / b1} = ${q}${sup(n - 1)} → n − 1 = ${n - 1}, n = ${n}.` };
          return { text: `${b1}; ${b1 * q}; ${b1 * q * q}; …; ${L} sonlu həndəsi silsiləsində neçə hədd var?`, answer: n, show: String(n), tol: INT,
            solution: `q = ${q}. ${L} : ${b1} = ${L / b1} = ${q}${sup(n - 1)}, deməli son həddin nömrəsi ${n}. Hədlərin sayı ${n}.` };
        }
        const b1 = pick([1, 2, 3, 5]), q = pick([2, 3]), N = rnd(100, 6000);
        let n = 1; while (b1 * pw(q, n - 1) <= N) n++;
        const prev = b1 * pw(q, n - 2), cur = b1 * pw(q, n - 1);
        return { text: `${gp(b1, q, 3)} silsiləsinin hansı nömrəli həddi ilk dəfə ${N}-dən böyük olur?`, answer: n, show: String(n), tol: INT,
          solution: `bₙ = ${b1}·${q}${sup("n−1")}. ${b_(n - 1)} = ${prev} ≤ ${N}, ${b_(n)} = ${cur} > ${N}. Cavab: ${ord(n)} hədd.` };
      } },
    { id: "xasse", ad: "Xarakteristik xassə", izah: "bₙ² = bₙ₋₁·bₙ₊₁. Nömrələrin cəmi bərabərdirsə, hədlərin hasili bərabərdir: m + n = k + l → bₘ·bₙ = bₖ·bₗ.",
      gen() {
        const kind = pick(["mid", "prod", "x", "three", "three"]);
        if (kind === "mid") {
          const c = rnd(2, 40), k = rnd(4, 20), j = rnd(1, 3);
          return { text: `Müsbət hədli həndəsi silsilədə ${b_(k - j)}·${b_(k + j)} = ${c * c}. ${b_(k)} = ?`, answer: c, show: String(c), tol: INT,
            solution: `${k - j} + ${k + j} = 2·${k}, ona görə ${b_(k - j)}·${b_(k + j)} = ${b_(k)}² = ${c * c}. Hədlər müsbətdir → ${b_(k)} = ${c}.` };
        }
        if (kind === "prod") {
          let p, q, r, s; do { p = rnd(1, 12); q = rnd(p + 1, 20); r = rnd(1, p + q - 1); s = p + q - r; } while (r === p || r === q || s < 1 || r >= s);
          const V = rnd(3, 90);
          return { text: `Həndəsi silsilədə ${b_(p)}·${b_(q)} = ${V}. ${b_(r)}·${b_(s)} = ?`, answer: V, show: String(V), tol: INT,
            solution: `${p} + ${q} = ${r} + ${s} = ${p + q}. Nömrələrin cəmi bərabərdir → ${b_(r)}·${b_(s)} = ${b_(p)}·${b_(q)} = ${V}.` };
        }
        if (kind === "x") {
          const q = pick([2, 3, 4, 5, -2, -3]), b1 = rnd(1, 6), t1 = b1, t2 = b1 * q, t3 = b1 * q * q, pos = pick([0, 1, 2]);
          if (pos === 0) return { text: `x; ${sg(t2)}; ${sg(t3)} — həndəsi silsilənin ardıcıl üç həddidir. x = ?`, answer: t1, show: sg(t1), tol: INT,
            solution: `Orta hədd: ${par(t2)}² = x·${par(t3)} → ${t2 * t2} = ${sg(t3)}x → x = ${sg(t1)}. Yoxla: q = ${sg(q)}.` };
          if (pos === 2) return { text: `${sg(t1)}; ${sg(t2)}; x — həndəsi silsilənin ardıcıl üç həddidir. x = ?`, answer: t3, show: sg(t3), tol: INT,
            solution: `q = ${sg(t2)} : ${par(t1)} = ${sg(q)}. x = ${sg(t2)}·${par(q)} = ${sg(t3)}.` };
          const c = rnd(2, 12);
          return { text: `Müsbət həndəsi silsilənin ardıcıl üç həddi: ${c * c}; x; ${c * c * q * q}. x = ?`, answer: Math.abs(c * c * q), show: String(Math.abs(c * c * q)), tol: INT,
            solution: `x² = ${c * c}·${c * c * q * q} = ${pw(c * c * q, 2)} → x = ${Math.abs(c * c * q)} (hədlər müsbətdir).` };
        }
        // three numbers a, aq, aq²: product (aq)³, sum known → largest
        const a = rnd(1, 5), q = pick([2, 3, 4]), m = a * q, P = m * m * m, Sm = a + a * q + a * q * q;
        return { text: `Üç müsbət ədəd artan həndəsi silsilə təşkil edir. Hasilləri ${P}, cəmləri ${Sm} olur. Ən böyük ədədi tap.`, answer: a * q * q, show: String(a * q * q), tol: INT,
          solution: `Ədədlər m/q, m, mq. Hasil m³ = ${P} → m = ${m}. Cəm: ${m}/q + ${m} + ${m}q = ${Sm} → ${m}(q + 1/q) = ${Sm - m}. q = ${q} (artan) yarayır: ${m}/${q} + ${m} + ${m * q} = ${a} + ${m} + ${m * q}. Ədədlər ${a}; ${m}; ${a * q * q}. Ən böyüyü ${a * q * q}.` };
      } },
    { id: "cem", ad: "Sₙ cəmi", izah: "Sₙ = b₁·(qⁿ − 1)/(q − 1) (q ≠ 1). Hissə cəmi üçün onun ilk həddini götür: bₖ + … + bₘ = bₖ·(q^(m−k+1) − 1)/(q − 1).",
      gen() {
        const kind = pick(["basic", "list", "findn", "tail"]);
        if (kind === "basic" || kind === "list") {
          const b1 = pick([1, 2, 3, 4, 5, -1, -2]), q = pick([2, 3, 4, -2, -3]), n = rnd(4, q === 2 ? 10 : q === 3 ? 7 : 6);
          let S = 0, t = b1; for (let i = 0; i < n; i++) { S += t; t *= q; }
          chk(S, b1 * (pw(q, n) - 1) / (q - 1));
          const text = kind === "basic" ? `Həndəsi silsilədə ${b_(1)} = ${sg(b1)}, q = ${sg(q)}. İlk ${n} həddin cəmini tap.` : `${gp(b1, q, 3)} həndəsi silsiləsinin ilk ${n} həddinin cəmini tap.`;
          return { text, answer: S, show: sg(S), tol: INT,
            solution: (kind === "list" ? `q = ${sg(b1 * q)} : ${par(b1)} = ${sg(q)}. ` : "") + `${S_(n)} = ${sg(b1)}·(${par(q)}${sup(n)} − 1)/(${par(q)} − 1) = ${sg(b1)}·${par(pw(q, n) - 1)}/${par(q - 1)} = ${sg(S)}.` };
        }
        if (kind === "findn") {
          const b1 = pick([1, 2, 3, 5]), q = pick([2, 3]), n = rnd(3, q === 2 ? 9 : 6), S = b1 * (pw(q, n) - 1) / (q - 1);
          return { text: `${gp(b1, q, 3)} həndəsi silsiləsinin ilk n həddinin cəmi ${S} olur. n = ?`, answer: n, show: String(n), tol: INT,
            solution: `${b1}·(${q}${sup("n")} − 1)/${q - 1} = ${S} → ${q}${sup("n")} − 1 = ${S * (q - 1) / b1} → ${q}${sup("n")} = ${S * (q - 1) / b1 + 1} = ${q}${sup(n)}. n = ${n}.` };
        }
        const b1 = pick([1, 2, 3, 5, -1]), q = pick([2, 3]), k = rnd(2, 5), m = k + rnd(2, 4);
        let S = 0; for (let i = k; i <= m; i++) S += b1 * pw(q, i - 1);
        const bk = b1 * pw(q, k - 1), c = m - k + 1;
        chk(S, bk * (pw(q, c) - 1) / (q - 1));
        return { text: `Həndəsi silsilədə ${b_(1)} = ${sg(b1)}, q = ${q}. ${b_(k)} + ${b_(k + 1)} + … + ${b_(m)} cəmini tap.`, answer: S, show: sg(S), tol: INT,
          solution: `${b_(k)} = ${sg(b1)}·${q}${sup(k - 1)} = ${sg(bk)}, hədlərin sayı ${m} − ${k} + 1 = ${c}. Cəm: ${sg(bk)}·(${q}${sup(c)} − 1)/(${q} − 1) = ${sg(bk)}·${pw(q, c) - 1} = ${sg(S)}.` };
      } },
    { id: "sonsuz", ad: "Sonsuz azalan silsilə", izah: "|q| < 1 olduqda S = b₁/(1 − q). Dövri onluq kəsr: 0,(ab) = ab/99, 0,(abc) = abc/999 — sonra ixtisar et.",
      gen() {
        const kind = pick(["basic", "b1", "q", "dec", "dec"]);
        const QS = [[1, 2], [1, 3], [-1, 2], [1, 4], [2, 3], [3, 4], [-1, 3], [1, 5], [-2, 3], [2, 5]];
        if (kind === "basic") {
          const [u, v] = pick(QS), b1 = rnd(1, 30) * pick([1, 1, -1]), S = b1 * v / (v - u);
          return { text: `Sonsuz azalan həndəsi silsilədə ${b_(1)} = ${sg(b1)}, q = ${frac(u, v)}. Cəmi S = ?`, answer: S, show: frac(b1 * v, v - u), tol: 0.01,
            solution: `S = ${b_(1)}/(1 − q) = ${sg(b1)}/(1 − ${par(frac(u, v))}) = ${sg(b1)} : (${frac(v - u, v)}) = ${frac(b1 * v, v - u)}.` };
        }
        if (kind === "b1") {
          const [u, v] = pick(QS), S = v * rnd(1, 8) * pick([1, 1, -1]), b1 = S * (v - u) / v;
          return { text: `Sonsuz azalan həndəsi silsilənin cəmi ${sg(S)}, məxrəci q = ${frac(u, v)}. ${b_(1)} = ?`, answer: b1, show: sg(b1), tol: INT,
            solution: `S = ${b_(1)}/(1 − q) → ${b_(1)} = S·(1 − q) = ${sg(S)}·(${frac(v - u, v)}) = ${sg(b1)}.` };
        }
        if (kind === "q") {
          const [u, v] = pick(QS), S = v * rnd(2, 9), b1 = S * (v - u) / v;
          return { text: `Sonsuz azalan həndəsi silsilənin ilk həddi ${sg(b1)}, cəmi ${S} olur. Məxrəci q = ?`, answer: u / v, show: frac(u, v), tol: 0.001,
            solution: `S = ${b_(1)}/(1 − q) → 1 − q = ${b_(1)}/S = ${frac(b1, S)} → q = 1 − ${frac(b1, S)} = ${frac(u, v)}. |q| < 1 ✓.` };
        }
        const L = pick([1, 2, 2, 3]), top = pw(10, L) - 1; let n; do { n = rnd(1, top - 1); } while (n % 10 === 0 && L === 1);
        const g = gcd(n, top), p = n / g, d = top / g, digs = String(n).padStart(L, "0");
        return { text: `0,(${digs}) dövri onluq kəsrini adi kəsr p/q şəklinə sal (ixtisar olunmuş). p + q = ?`, answer: p + d, show: String(p + d), tol: INT,
          solution: `x = 0,(${digs}) olsun. ${pw(10, L)}x − x = ${digs} (dövrü sola sürüşdürürük) → ${top}x = ${n} → x = ${n}/${top}${g > 1 ? ` = ${p}/${d}` : ""}. (Eyni nəticə: sonsuz azalan silsilə b₁ = ${n}/${pw(10, L)}, q = 1/${pw(10, L)}.) p + q = ${p + d}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Hər dəfə eyni dəfə artırsa və ya azaldırsa — həndəsi silsilədir. Əvvəl b₁, q və n-i müəyyən et.",
      gen() {
        const kind = pick(["bact", "interest", "rice", "ball", "ball"]);
        if (kind === "bact") {
          const N0 = rnd(2, 9), k = pick([2, 3]), t = rnd(3, k === 2 ? 9 : 6);
          return { text: `Kolbada ${N0} bakteriya var. Hər saat onların sayı ${k} dəfə artır. ${t} saatdan sonra neçə bakteriya olacaq?`, answer: N0 * pw(k, t), show: String(N0 * pw(k, t)), tol: INT,
            solution: `Hər saat ${k} ilə vurulur: ${N0}·${k}${sup(t)} = ${N0}·${pw(k, t)} = ${N0 * pw(k, t)}.` };
        }
        if (kind === "interest") {
          const P = 1000 * rnd(1, 9), rate = pick([10, 20]), n = rnd(2, 3), fct = (100 + rate) / 100;
          const A = Math.round(P * pw(fct, n)); chk(A, P * pw(fct, n));
          return { text: `Bankda ${P} manat depozit hər il ${rate}% artır (mürəkkəb faiz: hər il artım yeni məbləğə tətbiq olunur). ${n} ildən sonra məbləğ neçə manat olacaq?`, answer: A, show: String(A), tol: INT,
            solution: `Hər il ${fct.toString().replace(".", ",")} dəfə artır: ${P}·${fct.toString().replace(".", ",")}${sup(n)} = ${A} manat.` };
        }
        if (kind === "rice") {
          const k = rnd(5, 14), ask = pick(["cell", "total"]);
          return { text: `Şahmat taxtasının birinci xanasına 1 dən, ikinciyə 2, üçüncüyə 4, … hər sonrakı xanaya əvvəlkindən iki dəfə çox dən qoyurlar. ` + (ask === "cell" ? `${ord(k)} xanada neçə dən var?` : `İlk ${k} xanada cəmi neçə dən var?`),
            answer: ask === "cell" ? pw(2, k - 1) : pw(2, k) - 1, show: String(ask === "cell" ? pw(2, k - 1) : pw(2, k) - 1), tol: INT,
            solution: ask === "cell" ? `b₁ = 1, q = 2: ${b_(k)} = 2${sup(k - 1)} = ${pw(2, k - 1)}.` : `S = 1·(2${sup(k)} − 1)/(2 − 1) = ${pw(2, k)} − 1 = ${pw(2, k) - 1}.` };
        }
        const Q = pick([[1, 2], [1, 3], [2, 3], [3, 5], [3, 4]]), [u, v] = Q, H = rnd(1, 12) * (u === 3 && v === 4 ? 1 : 1), tot = H * (v + u) / (v - u);
        return { text: `Top ${H} m hündürlükdən düşür. Hər yerə dəydikdən sonra əvvəlki hündürlüyün ${u}/${v} hissəsi qədər yuxarı sıçrayır və yenidən düşür (sonsuz dəfə). Topun getdiyi bütün yol neçə metrdir?`,
          answer: tot, unit: "m", show: frac(H * (v + u), v - u) + " m", tol: 0.01,
          solution: `İlk düşmə ${H} m. Sonra hər sıçrayış yuxarı və aşağı: 2·${H}·(${u}/${v} + (${u}/${v})² + …) = 2·${H}·(${u}/${v})/(1 − ${u}/${v}) = ${frac(2 * H * u, v - u)}. Cəmi: ${H} + ${frac(2 * H * u, v - u)} = ${frac(H * (v + u), v - u)} m.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Hər addımı ayrıca yoxla: q-nu necə tapdı, düstur düzgündür, hesab düzdür.",
      gen() {
        let b1, q, n, b2, qw;
        do { b1 = rnd(1, 5); q = pick([2, 3, -2]); n = rnd(5, 8); b2 = b1 * q; qw = b2 - b1; } while (qw === 1 || qw === q || qw === 0);
        const S = b1 * (pw(q, n) - 1) / (q - 1);
        const bad = rnd(0, 2);
        const qq = bad === 0 ? qw : q;
        const ex = bad === 1 ? n - 1 : n;
        const val = b1 * (pw(qq, ex) - 1) / (qq - 1);
        const steps = [`q = ${bad === 0 ? `${b_(2)} − ${b_(1)} = ${sg(b2)} − ${b1} = ${sg(qw)}` : `${b_(2)} : ${b_(1)} = ${sg(b2)} : ${b1} = ${sg(q)}`}.`,
          `${S_(n)} = ${b_(1)}·(q${sup(ex === n ? "n" : "n−1")} − 1)/(q − 1) = ${b1}·(${par(qq)}${sup(ex)} − 1)/(${par(qq)} − 1).`,
          bad === 2 ? `${S_(n)} = ${b1}·${par(pw(qq, ex) - 1)}/${par(qq - 1)} = ${sg(val + pick([-1, 1]) * pick([2, 5, 10]) * b1)}.` : `${S_(n)} = ${b1}·${par(pw(qq, ex) - 1)}/${par(qq - 1)} = ${sg(val)}.`];
        const text = h("div", {}, h("p", {}, `Fikrət ${gp(b1, q, 3)} həndəsi silsiləsinin ilk ${n} həddinin cəmini hesablayır. Hansı addımda səhv var?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: həndəsi silsilədə q = ${b_(2)} : ${b_(1)} (bölmə), fərq yox. Düz: q = ${sg(q)}, cəm ${sg(S)}.`,
          `2-ci addım: düstur ${b_(1)}·(q${sup("n")} − 1)/(q − 1)-dir, qüvvət n-dir, n − 1 yox. Düz cəm ${sg(S)}.`,
          `3-cü addım: hesab səhvdir. ${b1}·${par(pw(q, n) - 1)}/${par(q - 1)} = ${sg(S)}.`][bad];
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
      key: "ol-hendesi-silsile", title: "Həndəsi silsilə", fenn: "olimpiada", link: "dersler/ol-hendesi-silsile.html",
      format: "Cavab ədəddir: hədd (−48), cəm (1093), kəsr 8/3 (onluq 2.67 də olar).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["bn", "nomre", "xasse", "xasse", "cem", "cem", "sonsuz", "sonsuz", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-hendesi-silsile.html")) b.push("dersler/ol-hendesi-silsile.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
