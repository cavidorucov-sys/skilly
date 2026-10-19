// n-ci dərəcədən kök, rasional üstlü qüvvət, irrasional ifadələr — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const lcm = (a, b) => a / gcd(a, b) * b;
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  const sup = n => String(n).split("").map(c => SUP[c]).join("");
  const fe = (p, q) => q === 1 ? sup(p) : sup(p) + "ᐟ" + sup(q);          // rational exponent: ²ᐟ³
  const sign = n => n === 2 ? "√" : n === 3 ? "∛" : n === 4 ? "∜" : sup(n) + "√";
  const R = (n, x) => sign(n) + (/^\d+$/.test(String(x)) ? x : "(" + x + ")");   // ∛54, ∛(−8)
  const P = (b, k) => Math.pow(b, k);
  const valS = (b, k) => k >= 0 ? S(P(b, k)) : frac(1, P(Math.abs(b), -k) * (b < 0 && k % 2 ? -1 : 1));
  const simp = N => { let k = 1, m = N; for (let d = 2; d * d <= m; d++) while (m % (d * d) === 0) { m /= d * d; k *= d; } return [k, m]; };  // √N = k√m
  const kr = (k, m) => m === 1 ? S(k) : (k === 1 ? "" : k === -1 ? "−" : S(k)) + "√" + m;                  // "3√2", "√5", "−√3"
  const term = (k, body, first) => (first ? (k < 0 ? "−" : "") : (k < 0 ? " − " : " + ")) + (Math.abs(k) === 1 ? "" : Math.abs(k)) + body;
  const SQF = [2, 3, 5, 6, 7, 10, 11];

  const levels = [
    { id: "kok", ad: "n-ci dərəcədən kök", izah: "ⁿ√(aⁿ) = a (cüt n-də |a|). Xassələr: ⁿ√a·ⁿ√b = ⁿ√(ab), ⁿ√(ᵏ√a) = ⁿᵏ√a. DMQ: cüt dərəcəli kökün altı ≥ 0.",
      gen() {
        const kind = pick(["val", "val", "prod", "nest", "abs", "dmq"]);
        if (kind === "val") {
          const n = pick([3, 3, 4, 5]);
          if (Math.random() < .3) {
            let p, q; do { p = rnd(1, n === 3 ? 5 : 3); q = rnd(2, n === 3 ? 5 : 3); } while (gcd(p, q) !== 1);
            const sg = n % 2 && Math.random() < .5 ? -1 : 1, rad = (sg < 0 ? "−" : "") + P(p, n) + "/" + P(q, n);
            return { text: `${R(n, rad)} = ?`, answer: sg * p / q, show: frac(sg * p, q), tol: 1e-6,
              solution: `${P(p, n)} = ${p}${sup(n)}, ${P(q, n)} = ${q}${sup(n)}. ${R(n, rad)} = ${frac(sg * p, q)}` + (sg < 0 ? ` (tək dərəcəli kök mənfi ədəddən də çıxarılır).` : `.`) };
          }
          const b = n === 4 ? rnd(2, 5) : n === 5 ? pick([-3, -2, 2, 3]) : pick([-6, -5, -4, -3, -2, 2, 3, 4, 5, 6, 10]);
          return { text: `${R(n, S(P(b, n)))} = ?`, answer: b, show: S(b), tol: 0.01,
            solution: `${b < 0 ? "(" + S(b) + ")" : b}${sup(n)} = ${S(P(b, n))}` + (b < 0 ? ` (dərəcə tək olduğu üçün kök mənfi ola bilər)` : ``) + `. Cavab: ${S(b)}.` };
        }
        if (kind === "prod") {
          if (Math.random() < .5) {
            const n = pick([3, 3, 4]), b = n === 3 ? rnd(2, 5) : rnd(2, 3), N = P(b, n);
            const ds = []; for (let d = 2; d < N; d++) if (N % d === 0) ds.push(d);
            const x = pick(ds), y = N / x, neg = n === 3 && Math.random() < .35;
            return { text: `${R(n, neg ? "−" + x : x)} · ${R(n, y)} = ?`, answer: neg ? -b : b, show: S(neg ? -b : b), tol: 0.01,
              solution: `Eyni dərəcəli köklər vurulur: ${R(n, (neg ? "−" : "") + x + "·" + y)} = ${R(n, (neg ? "−" : "") + N)} = ${S(neg ? -b : b)}.` };
          }
          const n = pick([2, 3, 3, 4]), x = pick([2, 3, 5, 6, 7]), b = n === 2 ? rnd(2, 9) : n === 3 ? rnd(2, 5) : rnd(2, 3), big = x * P(b, n);
          return { text: `${R(n, big)} : ${R(n, x)} = ?`, answer: b, show: String(b), tol: 0.01,
            solution: `${R(n, big + "/" + x)} = ${R(n, P(b, n))} = ${b}.` };
        }
        if (kind === "nest") {
          const [n, k] = pick([[2, 2], [2, 3], [3, 2], [3, 3]]), m = n * k, b = m === 9 ? 2 : rnd(2, 3), a = P(b, m);
          return { text: `${sign(n)}(${R(k, a)}) = ?`, answer: b, show: String(b), tol: 0.01,
            solution: `Kökdən kök: dərəcələr vurulur: ${n}·${k} = ${m}. ${R(m, a)} = ${b}, çünki ${b}${sup(m)} = ${a}.` };
        }
        if (kind === "abs") {
          const a = rnd(2, 9), b = rnd(2, 9), e = pick([2, 4]), o = pick([3, 5]);
          if (o === 5 && b > 4) return this.gen();
          return { text: `${sign(e)}((−${a})${sup(e)}) + ${sign(o)}((−${b})${sup(o)}) = ?`, answer: a - b, show: S(a - b), tol: 0.01,
            solution: `Cüt dərəcə: ${sign(e)}((−${a})${sup(e)}) = |−${a}| = ${a}. Tək dərəcə: ${sign(o)}((−${b})${sup(o)}) = −${b}. ${a} + (−${b}) = ${S(a - b)}.` };
        }
        const v = pick([0, 1, 2]);
        if (v === 0) {
          const a = rnd(-6, 5), b = a + rnd(2, 9);
          return { text: `√(x ${a < 0 ? "+" : "−"} ${Math.abs(a)}) + ∜(${b} − x) ifadəsinin DMQ-suna neçə tam ədəd daxildir?`.replace("x − 0", "x").replace("x + 0", "x"), answer: b - a + 1, show: String(b - a + 1), tol: 0.01,
            solution: `Cüt dərəcəli köklərin altı ≥ 0: x ≥ ${S(a)} və x ≤ ${b}. [${S(a)}; ${b}] parçasında ${b} − ${a < 0 ? "(" + S(a) + ")" : a} + 1 = ${b - a + 1} tam ədəd var.` };
        }
        if (v === 1) {
          const k = rnd(2, 5), c = rnd(-15, 25), ans = Math.ceil(c / k);
          return { text: `√(${k}x ${c < 0 ? "+" : "−"} ${Math.abs(c)}) ifadəsinin DMQ-suna daxil olan ən kiçik tam ədədi tap.`, answer: ans, show: S(ans), tol: 0.01,
            solution: `${k}x ${c < 0 ? "+" : "−"} ${Math.abs(c)} ≥ 0 → x ≥ ${frac(c, k)}. Ən kiçik tam: ${S(ans)}.` };
        }
        const a = rnd(-9, 9), b = rnd(-5, 12);
        return { text: `∛(x ${a < 0 ? "+" : "−"} ${Math.abs(a)}) + 1/√(${S(b)} − x) ifadəsinin DMQ-suna daxil olan ən böyük tam ədədi tap.`.replace("x − 0", "x").replace("x + 0", "x"), answer: b - 1, show: S(b - 1), tol: 0.01,
          solution: `Kub kök bütün x-lər üçün var. √(${S(b)} − x) məxrəcdədir: ${S(b)} − x > 0 → x < ${S(b)}. Ən böyük tam: ${S(b - 1)}.` };
      } },
    { id: "rasional", ad: "Rasional üstlü qüvvət", izah: "a^(m/n) = ⁿ√(aᵐ), a > 0. Əsası qüvvət kimi yaz: 8 = 2³, sonra üstləri vur.",
      gen() {
        const kind = pick(["basic", "basic", "basic", "prod", "powroot", "mixed"]);
        if (kind === "basic") {
          const b = pick([2, 2, 3, 3, 5, 10]), maxN = { 2: 5, 3: 4, 5: 3, 10: 3 }[b];
          let n, m; do { n = rnd(2, maxN); m = pick([-3, -2, -1, 1, 2, 3]); } while (gcd(Math.abs(m), n) !== 1 || (b === 10 && Math.abs(m) > 2) || P(b, Math.abs(m)) > 1000);
          const A = P(b, n), inv = Math.random() < .25;            // base 1/A
          const k = inv ? -m : m;
          return { text: `${inv ? "(1/" + A + ")" : A}${fe(m, n)} = ?`, answer: P(b, k), show: valS(b, k), tol: 1e-6,
            solution: `${inv ? "1/" + A + " = " + b + sup(-n) : A + " = " + b + sup(n)}. Üstlər vurulur: ${inv ? "(−" + n + ")" : n}·${m < 0 ? "(" + frac(m, n) + ")" : frac(m, n)} = ${S(k)}. ${b}${sup(k)} = ${valS(b, k)}.` };
        }
        if (kind === "prod") {
          const b = rnd(2, 7), q = pick([2, 3, 4, 5]), k = b <= 3 ? rnd(-2, 3) : rnd(-1, 2);
          let p, r; do { p = rnd(-7, 9); r = k * q - p; } while (!p || !r || p % q === 0 || Math.abs(r) > 11);
          const div = Math.random() < .4, r2 = div ? -r : r;     // b^(p/q) : b^(−r/q) = b^(p/q + r/q)
          const g1 = gcd(Math.abs(p), q), g2 = gcd(Math.abs(r2), q);
          return { text: `${b}${fe(p / g1, q / g1)} ${div ? ":" : "·"} ${b}${fe(r2 / g2, q / g2)} = ?`, answer: P(b, k), show: valS(b, k), tol: 1e-6,
            solution: `Əsas eynidir, üstlər ${div ? "çıxılır" : "toplanır"}: ${frac(p, q)} ${div ? "− (" + frac(r2, q) + ")" : "+ " + (r2 < 0 ? "(" + frac(r2, q) + ")" : frac(r2, q))} = ${frac(k * q, q)}. ${b}${sup(k)} = ${valS(b, k)}.` };
        }
        if (kind === "powroot") {
          const q = pick([2, 3, 4, 5]), k = pick([1, 2, 2, 3]), b = pick(k === 3 ? [2, 3, 4] : k === 2 ? [2, 3, 5, 6, 7, 10] : [3, 5, 6, 7, 11]);
          return { text: `(${R(q, b)})${sup(k * q)} = ?`, answer: P(b, k), show: String(P(b, k)), tol: 0.01,
            solution: `${R(q, b)} = ${b}${fe(1, q)}. (${b}${fe(1, q)})${sup(k * q)} = ${b}${sup(k)} = ${P(b, k)}.` };
        }
        const n = pick([2, 3, 4]), k = pick([1, 2]), b = pick(k === 2 ? [2, 3, 5] : [2, 3, 5, 6, 7]), m = k * n - 1;
        return { text: `${R(n, b)} · ${b}${fe(m, n)} = ?`, answer: P(b, k), show: String(P(b, k)), tol: 0.01,
          solution: `${R(n, b)} = ${b}${fe(1, n)}. Üstlər toplanır: 1/${n} + ${m}/${n} = ${k * n}/${n} = ${k}. ${b}${sup(k)} = ${P(b, k)}.` };
      } },
    { id: "cixar", ad: "Kök altından çıxarmaq", izah: "√(a²b) = a√b. Oxşar kökləri (eyni kök altı) topla. Vurmada (a − b)(a + b) = a² − b².",
      gen() {
        const kind = pick(["sum", "sum", "cube", "insert", "prod"]);
        if (kind === "sum") {
          const m = pick([2, 3, 5, 6, 7]), cnt = rnd(2, 3); let terms, c;
          do { terms = []; c = 0; const used = new Set();
            for (let i = 0; i < cnt; i++) { let a; do a = rnd(1, 6); while (used.has(a) || a * a * m > 200); used.add(a); const k = (i ? pick([-1, 1]) : 1) * pick([1, 1, 2, 3]); terms.push([k, a]); c += k * a; }
          } while (!c || terms.every(t => t[1] === 1));
          const txt = terms.map(([k, a], i) => term(k, "√" + a * a * m, !i)).join("");
          const steps = terms.map(([k, a], i) => term(k * a, "√" + m, !i)).join("");
          return { text: `${txt} ifadəsini sadələşdir.`, answer: c * Math.sqrt(m), show: kr(c, m), placeholder: "məs. 4√2",
            solution: terms.filter(t => t[1] > 1).map(([, a]) => `√${a * a * m} = √(${a * a}·${m}) = ${a}√${m}`).join("; ") + `. ${steps} = ${kr(c, m)}.` };
        }
        if (kind === "cube") {
          const m = pick([2, 3]), cnt = rnd(2, 3); let terms, c;
          do { terms = []; c = 0; const used = new Set();
            for (let i = 0; i < cnt; i++) { let a; do a = rnd(1, 4); while (used.has(a) || a * a * a * m > 200); used.add(a); const k = i ? pick([-1, 1]) : 1; terms.push([k, a]); c += k * a; }
          } while (!c || terms.every(t => t[1] === 1));
          const txt = terms.map(([k, a], i) => term(k, "∛" + a * a * a * m, !i)).join("");
          return { text: `${txt} = k∛${m}. k = ?`, answer: c, show: S(c), tol: 0.01,
            solution: terms.filter(t => t[1] > 1).map(([, a]) => `∛${a * a * a * m} = ∛(${a * a * a}·${m}) = ${a}∛${m}`).join("; ") + `. k = ${terms.map(([k, a], i) => (i ? (k < 0 ? " − " : " + ") : (k < 0 ? "−" : "")) + a).join("")} = ${S(c)}.` };
        }
        if (kind === "insert") {
          const cube = Math.random() < .35, a = cube ? rnd(2, 4) : rnd(2, 9), b = pick(cube ? [2, 3, 5] : SQF), N = cube ? a * a * a * b : a * a * b;
          const sg = cube ? "∛" : "√";
          return { text: `${a}${sg}${b} = ${sg}N. N = ?`, answer: N, show: String(N), tol: 0.01,
            solution: `Vuruğu kök altına salanda ${cube ? "kuba" : "kvadrata"} yüksəldirik: ${a}${sg}${b} = ${sg}(${a}${cube ? "³" : "²"}·${b}) = ${sg}${N}.` };
        }
        const v = pick([0, 1, 2]);
        if (v === 0) {
          let m, n; do { m = rnd(2, 15); n = rnd(2, 15); } while (m === n || simp(m)[1] === 1 || simp(n)[1] === 1);
          return { text: `(√${m} − √${n})(√${m} + √${n}) = ?`, answer: m - n, show: S(m - n), tol: 0.01,
            solution: `(a − b)(a + b) = a² − b²: (√${m})² − (√${n})² = ${m} − ${n} = ${S(m - n)}.` };
        }
        if (v === 1) {
          const a = rnd(2, 9), b = pick(SQF);
          return { text: `(${a} + √${b})(${a} − √${b}) = ?`, answer: a * a - b, show: S(a * a - b), tol: 0.01,
            solution: `${a}² − (√${b})² = ${a * a} − ${b} = ${S(a * a - b)}.` };
        }
        let m, n; do { m = rnd(2, 11); n = rnd(2, 11); } while (m >= n || simp(m * n)[0] !== 1 || simp(m)[1] === 1 || simp(n)[1] === 1);
        return { text: `(√${m} + √${n})² ifadəsini sadələşdir.`, answer: m + n + 2 * Math.sqrt(m * n), show: `${m + n}+2√${m * n}`, placeholder: "məs. 8+2√15",
          solution: `(a + b)² = a² + 2ab + b²: ${m} + 2√${m * n} + ${n} = ${m + n} + 2√${m * n}.` };
      } },
    { id: "muqayise", ad: "Kökləri müqayisə et", izah: "Kökləri eyni dərəcəyə gətir (dərəcələrin ƏKOB-u): hamısını həmin qüvvətə yüksəlt və müqayisə et.",
      gen() {
        const RANGE = { 2: [2, 8], 3: [3, 20], 4: [5, 50], 6: [10, 200] };
        const mk = n => { const [lo, hi] = RANGE[n]; let r; do r = rnd(lo, hi); while (Math.round(Math.pow(r, 1 / n)) ** n === r); return { n, r }; };
        const L = 12, pw12 = c => Math.pow(c.r, L / c.n);
        if (Math.random() < .4) {                                // two numbers: first / second / equal
          let a, b; const eq = Math.random() < .25;
          do { const [n1, n2] = pick([[2, 3], [2, 4], [3, 2], [4, 2], [3, 6], [2, 6], [4, 3]]); a = mk(n1);
            if (eq && L / n2 && Number.isInteger(Math.pow(a.r, n2 / n1)) && n2 > n1) b = { n: n2, r: Math.pow(a.r, n2 / n1) }; else b = mk(n2);
          } while (a.n === b.n || (!eq && pw12(a) === pw12(b)) || (eq && pw12(a) !== pw12(b)));
          const l = lcm(a.n, b.n), va = Math.pow(a.r, l / a.n), vb = Math.pow(b.r, l / b.n), ch = ["birinci böyükdür", "ikinci böyükdür", "bərabərdir"];
          const c = va > vb ? 0 : va < vb ? 1 : 2;
          return { text: `Müqayisə et: ${R(a.n, a.r)} və ${R(b.n, b.r)}.`, choices: ch, correct: c, show: ch[c],
            solution: `Hər ikisini ${l}-ci dərəcəyə yüksəlt: (${R(a.n, a.r)})${sup(l)} = ${a.r}${sup(l / a.n)} = ${va}, (${R(b.n, b.r)})${sup(l)} = ${b.r}${sup(l / b.n)} = ${vb}. ${va > vb ? va + " > " + vb + " — birinci böyükdür." : va < vb ? va + " < " + vb + " — ikinci böyükdür." : "Ədədlər bərabərdir."}` };
        }
        let cs; do { cs = [mk(pick([2, 3, 4, 6])), mk(pick([2, 3, 4, 6])), mk(pick([2, 3, 4, 6]))]; }
        while (new Set(cs.map(pw12)).size < 3 || new Set(cs.map(c => c.n)).size < 2);
        const big = Math.random() < .6, vals = cs.map(pw12), best = big ? Math.max(...vals) : Math.min(...vals), idx = vals.indexOf(best);
        const l = cs.reduce((x, c) => lcm(x, c.n), 1), names = cs.map(c => R(c.n, c.r));
        return { text: `Ədədlərdən ${big ? "ən böyüyünü" : "ən kiçiyini"} seç.`, choices: names, correct: idx, show: names[idx],
          solution: `Hamısını ${l}-ci dərəcəyə yüksəlt: ` + cs.map(c => `${R(c.n, c.r)} → ${c.r}${sup(l / c.n)} = ${Math.pow(c.r, l / c.n)}`).join("; ") + `. ${big ? "Ən böyüyü" : "Ən kiçiyi"} ${names[idx]}.` };
      } },
    { id: "irrasional", ad: "Məxrəci irrasionallıqdan azad et", izah: "a/√b — surəti və məxrəci √b-yə vur. a/(√m − √n) — qoşmaya (√m + √n) vur. Sadələşdir.",
      gen() {
        const kind = pick(["one", "one", "conj", "conj", "sum", "cube"]);
        if (kind === "one") {
          const b = pick(SQF), c = rnd(1, 4), a = rnd(1, 12) * (Math.random() < .5 ? b : 1), g = gcd(a, b * c), num = a / g, den = b * c / g;
          const sh = (num === 1 ? "" : num) + "√" + b + (den === 1 ? "" : "/" + den);
          return { text: `${a}/${c === 1 ? "√" + b : "(" + c + "√" + b + ")"} kəsrinin məxrəcini irrasionallıqdan azad et.`, answer: a / (c * Math.sqrt(b)), show: sh, placeholder: "məs. 2√3/3",
            solution: `Surəti və məxrəci √${b}-yə vur: ${a}√${b}/(${c === 1 ? "" : c + "·"}${b}) = ${sh}.` };
        }
        if (kind === "conj") {
          if (Math.random() < .5) {                                 // c/(√m − a)
            let m, a; do { m = pick([2, 3, 5, 6, 7, 10, 11, 13, 14, 15, 17]); a = rnd(1, 4); } while (m === a * a || Math.abs(m - a * a) > 8);
            const d = m - a * a, t = rnd(1, 4), c = Math.abs(d) * t, sg = Math.random() < .5 ? -1 : 1;  // c/(√m + sg·a)
            const k = c / (m - a * a);                               // c/(√m + sg a) = k(√m − sg a)
            const C = -sg * k * a, rad = (Math.abs(k) === 1 ? "" : Math.abs(k)) + "√" + m;
            const sh = k < 0 && C > 0 ? `${C}−${rad}` : `${k < 0 ? "−" : ""}${rad}${C < 0 ? "−" : "+"}${Math.abs(C)}`;
            return { text: `${c}/(√${m} ${sg < 0 ? "−" : "+"} ${a}) kəsrinin məxrəcini irrasionallıqdan azad et.`, answer: c / (Math.sqrt(m) + sg * a), show: sh, placeholder: "məs. 2√5+4",
              solution: `Qoşmaya (√${m} ${sg < 0 ? "+" : "−"} ${a}) vur. Məxrəc: (√${m})² − ${a}² = ${m} − ${a * a} = ${S(d)}. ${c}(√${m} ${sg < 0 ? "+" : "−"} ${a})/${d < 0 ? "(" + S(d) + ")" : d} = ${sh.replace(/([+−])/g, " $1 ").replace(/^ − /, "−")}.` };
          }
          let m, n; do { m = rnd(3, 15); n = rnd(2, 14); } while (m <= n || m - n > 6 || simp(m)[0] !== 1 || simp(n)[0] !== 1);
          const d = m - n, c = d * rnd(1, 3), k = c / d;
          const sh = `${k === 1 ? "" : k}√${m}+${k === 1 ? "" : k}√${n}`;
          return { text: `${c}/(√${m} − √${n}) kəsrinin məxrəcini irrasionallıqdan azad et.`, answer: c / (Math.sqrt(m) - Math.sqrt(n)), show: sh, placeholder: "məs. 2√5+2√3",
            solution: `Qoşmaya (√${m} + √${n}) vur. Məxrəc: ${m} − ${n} = ${d}. ${c}(√${m} + √${n})/${d} = ${sh.replace("+", " + ")}.` };
        }
        if (kind === "sum") {
          let m, n; do { m = rnd(3, 15); n = rnd(1, 14); } while (m <= n || simp(m)[0] !== 1 || simp(m * n)[0] !== 1 && n !== 1);
          return { text: `(√${m} + ${n === 1 ? "1" : "√" + n})/(√${m} − ${n === 1 ? "1" : "√" + n}) + (√${m} − ${n === 1 ? "1" : "√" + n})/(√${m} + ${n === 1 ? "1" : "√" + n}) = ?`,
            answer: 2 * (m + n) / (m - n), show: frac(2 * (m + n), m - n), tol: 1e-6,
            solution: `Ortaq məxrəc: (√${m})² − (${n === 1 ? "1" : "√" + n})² = ${m - n}. Surət: (√${m} + ${n === 1 ? "1" : "√" + n})² + (√${m} − ${n === 1 ? "1" : "√" + n})² = 2(${m} + ${n}) = ${2 * (m + n)} (2√${m * n} hədləri silinir). Cavab: ${frac(2 * (m + n), m - n)}.` };
        }
        const b = pick([2, 3, 5]), t = rnd(1, 6), a = b * t;
        return { text: `${a}/∛${b} = k∛${b * b}. k = ?`, answer: t, show: String(t), tol: 0.01,
          solution: `Surəti və məxrəci ∛${b}² = ∛${b * b}-yə vur: məxrəc ∛${b * b * b} = ${b}. ${a}∛${b * b}/${b} = ${t === 1 ? "" : t}∛${b * b}. k = ${t}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let head, steps, why; const bad = rnd(0, 2);
        if (Math.random() < .5) {
          let m, n; do { m = rnd(3, 11); n = rnd(2, 10); } while (m <= n || simp(m)[0] !== 1 || simp(n)[0] !== 1);
          const d = m - n, c = d * rnd(2, 4), k = c / d;
          head = `${c}/(√${m} − √${n}) kəsrinin məxrəcini irrasionallıqdan azad et.`;
          steps = [`Surəti və məxrəci (√${m} + √${n})-yə vururuq.`, `Məxrəc: (√${m})² − (√${n})² = ${d}.`, `${c}(√${m} + √${n})/${d} = ${k}√${m} + ${k}√${n}.`];
          if (bad === 0) steps[0] = `Surəti və məxrəci (√${m} − √${n})-yə vururuq.`;
          if (bad === 1) steps[1] = `Məxrəc: (√${m})² − (√${n})² = ${m + n}.`;
          if (bad === 2) steps[2] = pick([`${c}(√${m} + √${n})/${d} = ${k}√${m} − ${k}√${n}.`, `${c}(√${m} + √${n})/${d} = ${c * d}√${m} + ${c * d}√${n}.`]);
          why = [`1-ci addım: qoşma ifadəyə — işarəsi əks olana (√${m} + √${n}) vurmaq lazımdır, onda məxrəcdə kök qalmır.`,
            `2-ci addım: (√${m})² − (√${n})² = ${m} − ${n} = ${d}.`,
            `3-cü addım: ${c} : ${d} = ${k}, işarələr dəyişmir. Düzü: ${k}√${m} + ${k}√${n}.`][bad];
        } else {
          const m = pick([2, 3, 5]); let a, b; do { a = rnd(2, 6); b = rnd(2, 6); } while (a === b || a * a * m > 150 || b * b * m > 150);
          head = `√${a * a * m} + √${b * b * m} ifadəsini sadələşdir.`;
          steps = [`√${a * a * m} = √(${a * a}·${m}) = ${a}√${m}`, `√${b * b * m} = √(${b * b}·${m}) = ${b}√${m}`, `${a}√${m} + ${b}√${m} = ${a + b}√${m}`];
          if (bad === 0) steps[0] = `√${a * a * m} = √(${a * a}·${m}) = ${a * a}√${m}`;
          if (bad === 1) steps[1] = `√${b * b * m} = √(${b * b}·${m}) = ${m}√${b * b}`;
          if (bad === 2) steps[2] = pick([`${a}√${m} + ${b}√${m} = ${a + b}√${2 * m}`, `${a}√${m} + ${b}√${m} = ${a * b}√${m}`]);
          why = [`1-ci addım: kök altından ${a * a} yox, √${a * a} = ${a} çıxır: ${a}√${m}.`,
            `2-ci addım: kök altından tam kvadrat ${b * b} çıxarılır: ${b}√${m}.`,
            `3-cü addım: oxşar köklərdə əmsallar toplanır, kök altı dəyişmir: ${a + b}√${m}.`][bad];
        }
        const text = h("div", {}, h("p", {}, head), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Kvadratın tərəfi — sahənin kvadrat kökü, kubun tili — həcmin kub kökü. Cavabı sadələşdir: 5√2.",
      gen() {
        const kind = pick(["side", "diag", "cube", "fall"]);
        if (kind === "side") {
          const a = rnd(2, 9), m = pick([2, 3, 5, 6, 7]), S2 = a * a * m;
          return { text: `Kvadrat şəkilli bağın sahəsi ${S2} m²-dir. Bağın tərəfi neçə metrdir? Cavabı sadələşdirilmiş kök şəklində yaz.`, answer: a * Math.sqrt(m), unit: "m", show: kr(a, m), placeholder: "məs. 4√3",
            solution: `Tərəf = √${S2} = √(${a * a}·${m}) = ${kr(a, m)} m.` };
        }
        if (kind === "diag") {
          const a = rnd(2, 15), [k, m] = simp(2 * a * a);
          return { text: `Kvadrat şəkilli otağın sahəsi ${a * a} m²-dir. Otağın diaqonalı neçə metrdir?`, answer: a * Math.SQRT2, unit: "m", show: kr(k, m), placeholder: "məs. 4√2",
            solution: `Tərəf = √${a * a} = ${a} m. Diaqonal = tərəf·√2 = ${kr(k, m)} m (Pifaqor: √(${a}² + ${a}²) = √${2 * a * a}).` };
        }
        if (kind === "cube") {
          if (Math.random() < .5) {
            const a = rnd(2, 12);
            return { text: `Kub şəkilli su çəninin həcmi ${a * a * a} dm³-dir. Çənin tili neçə dm-dir?`, answer: a, unit: "dm", show: String(a), tol: 0.01,
              solution: `Til = ∛${a * a * a} = ${a} dm, çünki ${a}³ = ${a * a * a}.` };
          }
          const k = rnd(2, 5);
          return { text: `Kubun həcmi ${k * k * k} dəfə artdı. Kubun tili neçə dəfə artdı?`, answer: k, show: String(k), tol: 0.01,
            solution: `V = a³. Til k dəfə artanda həcm k³ dəfə artır: k³ = ${k * k * k} → k = ∛${k * k * k} = ${k}.` };
        }
        const N = rnd(2, 40), hgt = 5 * N, [k, m] = simp(N);
        return { text: `Daş ${hgt} m hündürlükdən sərbəst düşür. Düşmə vaxtı t = √(2h/g), g = 10 m/s². t neçə saniyədir? Cavabı sadələşdirilmiş kök şəklində yaz.`, answer: Math.sqrt(N), unit: "san", show: kr(k, m), placeholder: "məs. 2√3",
          solution: `t = √(2·${hgt}/10) = √${N}` + (m === 1 ? ` = ${k} san.` : k > 1 ? ` = √(${k * k}·${m}) = ${kr(k, m)} san.` : ` san.`) };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "n-ci-kok", title: "n-ci dərəcədən kök, rasional üstlü qüvvət", fenn: "riyaziyyat", link: "dersler/n-ci-kok.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 1/8, kök 3√2, √5/5, 2√5+4. Kub kök cavab olmur — onda k soruşulur.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["kok", "kok", "rasional", "rasional", "cixar", "cixar", "muqayise", "irrasional", "irrasional", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/n-ci-kok.html")) b.push("dersler/n-ci-kok.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
