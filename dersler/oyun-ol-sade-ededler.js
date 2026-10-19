// Olimpiada: sadə ədədlər, bölənlərin sayı və cəmi — game levels (τ(n), σ(n), Legendre / trailing zeros of n!, sieve and φ, primes of a given form, smallest n with k divisors).
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (p, q) => { const g = gcd(p, q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const D1 = ["", "ə", "yə", "ə", "ə", "ə", "ya", "yə", "ə", "a"], D10 = ["", "a", "yə", "a", "a", "yə", "a", "ə", "ə", "a"];
  const dat = n => { const a = Math.abs(n); const s = a === 0 ? "a" : a % 10 ? D1[a % 10] : a % 100 ? D10[(a / 10) % 10] : a % 1e6 ? "ə" : "a"; return S(n) + "-" + s; };
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", sup = n => String(n).split("").map(d => SUP[+d]).join("");
  const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  const factor = n => { const f = []; for (let p = 2; p * p <= n; p++) if (n % p === 0) { let e = 0; while (n % p === 0) { n /= p; e++; } f.push([p, e]); } if (n > 1) f.push([n, 1]); return f; };
  const fmt = f => f.map(([p, e]) => e > 1 ? p + sup(e) : String(p)).join(" · ");
  const divisors = n => { const a = [], b = []; for (let d = 1; d * d <= n; d++) if (n % d === 0) { a.push(d); if (d * d !== n) b.unshift(n / d); } return a.concat(b); };
  const leg = (n, p) => { let s = 0, q = p; while (q <= n) { s += Math.floor(n / q); q *= p; } return s; };
  const legTerms = (n, p) => { const t = []; let q = p; while (q <= n) { t.push(`⌊${n}/${q}⌋ = ${Math.floor(n / q)}`); q *= p; } return t; };
  const PR = []; for (let p = 2; PR.length < 12; p++) if (isPrime(p)) PR.push(p);
  // build n = Π p^e from a prime set with random exponents, within [lo, hi]
  const build = (sets, maxE, lo, hi) => { for (;;) { const ps = pick(sets), f = ps.map(p => [p, rnd(1, p === 2 ? maxE + 1 : maxE)]); const n = f.reduce((t, [p, e]) => t * p ** e, 1); if (n >= lo && n <= hi) return [n, f]; } };
  // multiplicative partitions of k into factors ≥ 2, non-increasing
  const mparts = (k, max = k) => { if (k === 1) return [[]]; const out = []; for (let d = Math.min(k, max); d >= 2; d--) if (k % d === 0) for (const r of mparts(k / d, d)) out.push([d, ...r]); return out; };
  let TAU = null; const tauSieve = () => { if (TAU) return TAU; const L = 300000; TAU = new Uint16Array(L + 1); for (let d = 1; d <= L; d++) for (let m = d; m <= L; m += d) TAU[m]++; return TAU; };

  const levels = [
    { id: "tau", ad: "Bölənlərin sayı", izah: "n = pᵃ · qᵇ · … → τ(n) = (a + 1)(b + 1)…. Cüt bölən — 2-nin üstü ən azı 1; kvadrat bölən — bütün üstlər cüt.",
      gen() {
        const [n, f] = build([[2, 3], [2, 3, 5], [2, 3, 7], [2, 5, 7], [3, 5, 7], [2, 3, 5, 7], [2, 3, 11], [2, 5, 11], [3, 5, 11], [2, 7, 13]], 4, 200, 2000000);
        const ask = pick(["tau", "tau2", "even", "odd", "sq", "divby"]);
        const D = divisors(n), fs = fmt(f);
        if (ask === "tau2") { const ans = f.reduce((t, [, e]) => t * (2 * e + 1), 1); const n2 = f.map(([p, e]) => [p, 2 * e]);
          return { text: `${n}² ədədinin neçə natural böləni var?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${n} = ${fs} → ${n}² = ${fmt(n2)}. τ = ${n2.map(([, e]) => `(${e} + 1)`).join("")} = ${ans}.` }; }
        if (ask === "even" && f[0][0] === 2) { const a = f[0][1], rest = f.slice(1), ans = a * rest.reduce((t, [, e]) => t * (e + 1), 1);
          if (D.filter(d => d % 2 === 0).length !== ans) throw new Error("even");
          return { text: `${n} ədədinin neçə cüt böləni var?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${n} = ${fs}. Cüt bölən 2-ni 1, 2, …, ${a} dəfə götürür (${a} seçim), qalan vuruqlar adi qaydada: ${a} · ${rest.map(([, e]) => `(${e} + 1)`).join("")} = ${ans}.` }; }
        if (ask === "odd" || ask === "even") { const rest = f.filter(([p]) => p !== 2), ans = rest.reduce((t, [, e]) => t * (e + 1), 1);
          if (D.filter(d => d % 2).length !== ans) throw new Error("odd");
          return { text: `${n} ədədinin neçə tək böləni var?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${n} = ${fs}. Tək bölənlərdə 2 iştirak etmir — ${f[0][0] === 2 ? "2-ni atırıq, " : ""}qalan hissə ${fmt(rest)}: ${rest.map(([, e]) => `(${e} + 1)`).join("")} = ${ans}.` }; }
        if (ask === "sq") { const ans = f.reduce((t, [, e]) => t * (Math.floor(e / 2) + 1), 1);
          if (D.filter(d => Number.isInteger(Math.sqrt(d))).length !== ans) throw new Error("sq");
          return { text: `${n} ədədinin bölənlərindən neçəsi tam kvadratdır?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${n} = ${fs}. Kvadrat böləndə hər üst cütdür: ${f.map(([p, e]) => `${p} üçün ${Math.floor(e / 2) + 1} seçim (0${e >= 2 ? ", 2" : ""}${e >= 4 ? ", 4" : ""}${e >= 6 ? ", 6" : ""})`).join("; ")}. Cəmi ${ans}.` }; }
        if (ask === "divby" && f.length >= 2) { const i = rnd(0, f.length - 2), q = f[i][0] * f[i + 1][0], m = n / q, ans = factor(m).reduce((t, [, e]) => t * (e + 1), 1);
          if (D.filter(d => d % q === 0).length !== ans) throw new Error("divby");
          return { text: `${n} ədədinin bölənlərindən neçəsi ${dat(q)} bölünür?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${q} ədədinə bölünən bölən d = ${q} · t şəklindədir, burada t — ${n} : ${q} = ${m} ədədinin bölənidir. ${m} = ${fmt(factor(m))} → ${factor(m).map(([, e]) => `(${e} + 1)`).join("")} = ${ans}.` }; }
        const ans = f.reduce((t, [, e]) => t * (e + 1), 1);
        if (D.length !== ans) throw new Error("tau");
        return { text: `${n} ədədinin neçə natural böləni var?`, answer: ans, show: String(ans), tol: 0.01,
          solution: `${n} = ${fs} → τ = ${f.map(([, e]) => `(${e} + 1)`).join("")} = ${ans}.` };
      } },
    { id: "sigma", ad: "Bölənlərin cəmi və hasili", izah: "σ(pᵃqᵇ) = (1 + p + … + pᵃ)(1 + q + … + qᵇ). Bölənlərin hasili = n^(τ/2). Tərslərin cəmi = σ(n)/n.",
      gen() {
        const [n, f] = build([[2, 3], [2, 5], [2, 3, 5], [2, 7], [3, 5], [2, 3, 7], [3, 7], [2, 11]], 3, 12, 3000);
        const D = divisors(n), sig = D.reduce((a, b) => a + b, 0), tau = D.length;
        const geo = ([p, e]) => `(${Array.from({ length: e + 1 }, (_, i) => p ** i).join(" + ")})`;
        const geoV = ([p, e]) => (p ** (e + 1) - 1) / (p - 1);
        const ask = pick(["sum", "sum", "odd", "recip", "prod"]);
        if (ask === "odd" && f[0][0] === 2 && f.length > 1) { const rest = f.slice(1), ans = rest.reduce((t, x) => t * geoV(x), 1);
          if (ans !== D.filter(d => d % 2).reduce((a, b) => a + b, 0)) throw new Error("oddsum");
          return { text: `${n} ədədinin tək bölənlərinin cəmini tap.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${n} = ${fmt(f)}. Tək bölənlər ${fmt(rest)} ədədinin bölənləridir: ${rest.map(geo).join(" · ")} = ${rest.map(geoV).join(" · ")} = ${ans}.` }; }
        if (ask === "recip") return { text: `${n} ədədinin bütün natural bölənlərinin tərs qiymətlərinin cəmini tap (1/d-lərin cəmi). Cavabı ixtisar olunmuş kəsr kimi yaz.`, answer: sig / n, show: frac(sig, n), tol: 1e-6, placeholder: "məs. 7/3",
          solution: `d bölən olanda n/d də böləndir, ona görə Σ 1/d = Σ (n/d)/n = σ(n)/n. σ(${n}) = ${f.map(geo).join(" · ")} = ${sig}. Cavab: ${sig}/${n}${gcd(sig, n) > 1 ? " = " + frac(sig, n) : ""}.` };
        if (ask === "prod") return { text: `${n} ədədinin bütün natural bölənlərinin hasili ${n}ᵏ şəklində yazılır. k = ?`, answer: tau / 2, show: frac(tau, 2), tol: 0.001,
          solution: `Bölənləri cüt-cüt qruplaşdır: d və ${n}/d — hər cütün hasili ${n}. τ(${n}) = ${f.map(([, e]) => `(${e} + 1)`).join("")} = ${tau} bölən → ${frac(tau, 2)} cüt${tau % 2 ? " (n kvadratdır, ortadakı bölən √n-dir)" : ""}. k = ${tau}/2 = ${frac(tau, 2)}.` };
        if (sig !== f.reduce((t, x) => t * geoV(x), 1)) throw new Error("sigma");
        return { text: `${n} ədədinin bütün natural bölənlərinin cəmini tap.`, answer: sig, show: String(sig), tol: 0.01,
          solution: `${n} = ${fmt(f)}. Hasili açanda hər bölən düz bir dəfə alınır: σ = ${f.map(geo).join(" · ")} = ${f.map(geoV).join(" · ")} = ${sig}.` };
      } },
    { id: "lejandr", ad: "Lejandr: n! ədədində sadə vuruqlar", izah: "n! ədədində p-nin üstü = ⌊n/p⌋ + ⌊n/p²⌋ + ⌊n/p³⌋ + …  Sonundakı sıfırlar = 5-in üstü.",
      gen() {
        const ask = pick(["zero", "zero", "vp", "comp", "min", "max"]);
        if (ask === "zero") { const n = rnd(20, 2000), z = leg(n, 5);
          return { text: `${n}! ədədi neçə sıfırla bitir?`, answer: z, show: String(z), tol: 0.01,
            solution: `Hər sıfır bir 10 = 2 · 5 vuruğudur; 2-lər 5-lərdən çoxdur, ona görə sıfırların sayı = ${n}! ədədində 5-in üstü: ${legTerms(n, 5).join("; ")}. Cəmi ${z}.` }; }
        if (ask === "vp") { const p = pick([2, 3, 7, 11]), n = rnd(p * 3, 500), v = leg(n, p);
          return { text: `${n}! ədədi ${p}ᵏ-ya bölünür. k-nın ən böyük qiyməti neçədir?`.replace(`${p}ᵏ-ya`, `${p}ᵏ ədədinə`), answer: v, show: String(v), tol: 0.01,
            solution: `Lejandr düsturu: ${n}! ədədində ${p}-nin üstü = ${legTerms(n, p).join(" + ").replace(/ = \d+/g, "")} = ${legTerms(n, p).map(t => t.split(" = ")[1]).join(" + ")} = ${v}.`.replace(`${p}-nin`, `${p} vuruğunun`) }; }
        if (ask === "comp") { const k = pick([6, 12, 10, 15, 18, 20, 24, 14]), n = rnd(10, 300), fk = factor(k);
          const parts = fk.map(([p, e]) => ({ p, e, v: leg(n, p), q: Math.floor(leg(n, p) / e) })), ans = Math.min(...parts.map(x => x.q));
          return { text: `${n}! ədədi ${k}ᵐ ədədinə bölünür. m-in ən böyük qiyməti neçədir?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${k} = ${fmt(fk)}. ${parts.map(x => `${n}! ədədində ${x.p} vuruğunun üstü ${x.v}` + (x.e > 1 ? ` → ${x.p}${sup(x.e)} vuruğu ⌊${x.v}/${x.e}⌋ = ${x.q} dəfə` : "")).join("; ")}. Hər ${k} vuruğu üçün ${fmt(fk)} lazımdır, ona görə m bu ədədlərin ən kiçiyidir: m = ${ans}.` }; }
        const n = rnd(10, 1500), z = leg(n, 5), lo = 5 * Math.floor(n / 5), hi = lo + 4;
        const why = `n! ədədinin sonundakı sıfırların sayı yalnız n 5-ə bölünən ədəddən keçəndə artır, ona görə ${lo}!, ${lo + 1}!, …, ${hi}! eyni sayda sıfırla bitir, ${lo - 1}! isə daha az. ${lo}!: ${legTerms(lo, 5).join("; ")} → ${z} sıfır.`;
        if (ask === "min") return { text: `n! ədədi düz ${z} sıfırla bitir. n-in ən kiçik qiyməti neçədir?`, answer: lo, show: String(lo), tol: 0.01, solution: why + ` Ən kiçik n = ${lo}.` };
        return { text: `n! ədədi düz ${z} sıfırla bitir. n-in ən böyük qiyməti neçədir?`, answer: hi, show: String(hi), tol: 0.01, solution: why + ` Ən böyük n = ${hi}.` };
      } },
    { id: "sade", ad: "Ələk və sadə ədədin forması", izah: "Eratosfen ələyi; daxilolma–xaricolma; φ(n) = n(1 − 1/p)(1 − 1/q)…; p > 3 sadə ədəd 6k ± 1 şəklindədir; tək cəmdə sadələrdən biri 2-dir.",
      gen() {
        const kind = pick(["count", "phi", "none", "forma", "forma", "two"]);
        if (kind === "count") { const a = rnd(1, 250), b = a + rnd(20, 50), ps = []; for (let x = a; x <= b; x++) if (isPrime(x)) ps.push(x);
          return { text: `${a} ilə ${b} arasında (ikisi də daxil) neçə sadə ədəd var?`, answer: ps.length, show: String(ps.length), tol: 0.01,
            solution: `√${b} < ${Math.floor(Math.sqrt(b)) + 1}, ona görə yalnız ${PR.filter(p => p * p <= b).join(", ")} ədədlərinə bölünməni yoxlayırıq (ələk). Sadələr: ${ps.join(", ") || "yoxdur"} — ${ps.length} dənə.` }; }
        if (kind === "phi") { const [N, f] = build([[2, 3], [2, 5], [3, 5], [2, 3, 5], [2, 7], [3, 7], [2, 3, 7], [5, 7], [2, 11], [3, 11]], 2, 30, 1000);
          let c = 0; for (let x = 1; x <= N; x++) if (gcd(x, N) === 1) c++;
          const ps = f.map(([p]) => p), phi = ps.reduce((t, p) => t / p * (p - 1), N);
          if (phi !== c) throw new Error("phi");
          return { text: `1, 2, …, ${N} ədədlərindən neçəsi ${N} ilə qarşılıqlı sadədir (ƏBOB = 1)?`, answer: c, show: String(c), tol: 0.01,
            solution: `${N} = ${fmt(f)}. Eyler funksiyası: φ(${N}) = ${N} · ${ps.map(p => `(1 − 1/${p})`).join(" · ")} = ${N} · ${ps.map(p => `${p - 1}/${p}`).join(" · ")} = ${c}. (Hər sadə vuruq üçün ona bölünənləri ələyirik.)` }; }
        if (kind === "none") { const [p, q, r] = pick([[2, 3, 5], [2, 3, 7], [3, 5, 7], [2, 5, 7]]), N = rnd(50, 1000); const F = d => Math.floor(N / d);
          let c = 0; for (let x = 1; x <= N; x++) if (x % p && x % q && x % r) c++;
          const v = N - F(p) - F(q) - F(r) + F(p * q) + F(p * r) + F(q * r) - F(p * q * r); if (v !== c) throw new Error("none");
          return { text: `1-dən ${dat(N)} qədər olan ədədlərdən neçəsi nə ${dat(p)}, nə ${dat(q)}, nə də ${dat(r)} bölünür?`, answer: c, show: String(c), tol: 0.01,
            solution: `Daxilolma–xaricolma: ${N} − (${F(p)} + ${F(q)} + ${F(r)}) + (${F(p * q)} + ${F(p * r)} + ${F(q * r)}) − ${F(p * q * r)} = ${c}. Burada ⌊${N}/${p}⌋ = ${F(p)} — ${dat(p)} bölünənlər, ⌊${N}/${p * q}⌋ = ${F(p * q)} — həm ${dat(p)}, həm ${dat(q)} bölünənlər (iki dəfə çıxılıb, bir dəfə qaytarılır) və s.` }; }
        if (kind === "forma") {
          if (Math.random() < .5) { const c = pick([2, 8, 14, 20, 32, 38, 44, 50]);
            const ok = []; for (let p = 2; p < 2000; p++) if (isPrime(p) && isPrime(p * p + c)) ok.push(p);
            if (ok.length !== 1 || ok[0] !== 3) throw new Error("forma1 " + c);
            return { text: `p və p² + ${c} ədədlərinin ikisi də sadədir. p² + ${c} = ?`, answer: 9 + c, show: String(9 + c), tol: 0.01,
              solution: `p = 2: 4 + ${c} = ${4 + c} cütdür, sadə deyil. p 3-ə bölünmürsə, p² 3-ə bölmədə 1 qalıq verir, ${c} isə 2 qalıq → p² + ${c} 3-ə bölünür və 3-dən böyükdür — sadə deyil. Qalır p = 3: 9 + ${c} = ${9 + c} — sadədir.` }; }
          for (;;) { const a = pick([4, 10, 16, 28]), b = pick([2, 8, 14, 20, 26]); if (!isPrime(3 + a) || !isPrime(3 + b)) continue;
            const ok = []; for (let p = 2; p < 2000; p++) if (isPrime(p) && isPrime(p + a) && isPrime(p + b)) ok.push(p);
            if (ok.length !== 1 || ok[0] !== 3) throw new Error("forma2");
            const [x, y] = a < b ? [a, b] : [b, a];
            return { text: `p, p + ${x} və p + ${y} ədədlərinin üçü də sadədir. Bu üç ədədin cəmini tap.`, answer: 9 + a + b, show: String(9 + a + b), tol: 0.01,
              solution: `p = 2 olsa, p + ${a % 2 ? b : a} cüt olar. 3-ə bölmədə p, p + ${x}, p + ${y} müxtəlif qalıqlar verir (${x} və ${y} qalıqları ${x % 3} və ${y % 3}), deməli biri 3-ə bölünür. O, 3 olmalıdır → p = 3. Ədədlər 3, ${3 + x}, ${3 + y}; cəmi ${9 + a + b}.` }; }
        }
        const qs = []; for (let q = 5; q < 1000; q++) if (isPrime(q)) qs.push(q); const q = pick(qs), N = q + 2;
        let cnt = 0; for (let p = 2; p <= N / 2; p++) if (isPrime(p) && isPrime(N - p)) cnt++; if (cnt !== 1) throw new Error("two");
        return { text: `İki sadə ədədin cəmi ${N}-dir. Onlardan böyüyünü tap.`.replace(`${N}-dir`, `${N} ədədinə bərabərdir`), answer: q, show: String(q), tol: 0.01,
          solution: `${N} təkdir. İki tək ədədin cəmi cüt olardı, deməli toplananlardan biri cüt sadə ədəddir — 2. O biri ${N} − 2 = ${q} (sadədir).` };
      } },
    { id: "minbolen", ad: "Verilmiş sayda böləni olan ədəd", izah: "k = (a + 1)(b + 1)… şəklində yaz; böyük üstü kiçik sadə ədədə ver; bütün variantları müqayisə et. τ(n) = 3 ⇔ n = p².",
      gen() {
        if (Math.random() < .25) { const M = rnd(50, 5000); const ps = []; for (let p = 2; p * p <= M; p++) if (isPrime(p)) ps.push(p);
          const T = tauSieve(); let c = 0; for (let x = 1; x <= M; x++) if (T[x] === 3) c++; if (c !== ps.length) throw new Error("t3");
          return { text: `1-dən ${dat(M)} qədər olan ədədlərdən neçəsinin düz 3 natural böləni var?`, answer: c, show: String(c), tol: 0.01,
            solution: `τ(n) = 3 → (a + 1)(b + 1)… = 3 → n = p² (p sadə). p² ≤ ${M} → p ≤ ${Math.floor(Math.sqrt(M))}: ${ps.join(", ")} — ${c} dənə.` }; }
        const odd = Math.random() < .3, k = odd ? pick([4, 6, 8, 9, 10, 12, 16]) : pick([4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 18, 20, 24, 28, 30, 32, 36]);
        const P = odd ? PR.slice(1) : PR, cands = mparts(k).map(fs => { const f = fs.map((d, i) => [P[i], d - 1]); return { f, n: f.reduce((t, [p, e]) => t * p ** e, 1) }; });
        const best = cands.reduce((m, c) => c.n < m.n ? c : m);
        const T = tauSieve(); let bn = 0; for (let x = 1; x < T.length; x++) if (T[x] === k && (!odd || x % 2)) { bn = x; break; }
        if (bn !== best.n) throw new Error("minbolen " + k + " " + bn + " " + best.n);
        const shown = cands.sort((a, b) => a.n - b.n).slice(0, 5).map(c => `${fmt(c.f)} = ${c.n}`).join("; ");
        return { text: `Düz ${k} natural böləni olan ən kiçik ${odd ? "tək " : ""}natural ədədi tap.`, answer: best.n, show: String(best.n), tol: 0.01,
          solution: `${k} ədədini (a + 1)(b + 1)… hasili kimi yazmağın yolları: ${mparts(k).map(p => p.join(" · ")).join("; ")}. Hər variantda böyük üstü ən kiçik ${odd ? "tək " : ""}sadə ədədə veririk: ${shown}${cands.length > 5 ? "; …" : ""}. Ən kiçiyi ${best.n}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Lampa neçə dəfə çevrilir = nömrəsinin bölənlərinin sayı; tək sayda bölən yalnız tam kvadratlarda olur. Düzbucaqlılar və qruplar da bölənlərlə sayılır.",
      gen() {
        const kind = pick(["lamp", "lamp", "rect", "group"]);
        if (kind === "lamp") { const N = rnd(30, 2000), r = Math.floor(Math.sqrt(N));
          if (Math.random() < .4) { const A = rnd(2, N - 20), B = rnd(A + 10, N); const c = Math.floor(Math.sqrt(B)) - Math.floor(Math.sqrt(A - 1));
            return { text: `Dəhlizdə 1-dən ${dat(N)} qədər nömrələnmiş ${N} lampa var, hamısı sönükdür. ${N} nəfər növbə ilə keçir: k-cı adam nömrəsi k-ya bölünən bütün lampaların düyməsini basır (yanan sönür, sönən yanır). Sonda nömrəsi ${A} ilə ${B} arasında olan (ikisi də daxil) neçə lampa yanır?`, answer: c, show: String(c), tol: 0.01,
              solution: `n nömrəli lampanın düyməsi n-in hər böləni üçün bir dəfə basılır — τ(n) dəfə. Yanılı qalır ⇔ τ(n) tək ⇔ n tam kvadratdır (bölənlər d və n/d cütləşir, yalnız √n cütsüz qalır). ${A}…${B} arasında kvadratlar: ${Math.floor(Math.sqrt(A - 1)) + 1}² … ${Math.floor(Math.sqrt(B))}² — ${c} dənə.` }; }
          return { text: `Dəhlizdə 1-dən ${dat(N)} qədər nömrələnmiş ${N} lampa var, hamısı sönükdür. ${N} nəfər növbə ilə keçir: k-cı adam nömrəsi k-ya bölünən bütün lampaların düyməsini basır (yanan sönür, sönən yanır). Sonda neçə lampa yanır?`, answer: r, show: String(r), tol: 0.01,
            solution: `n nömrəli lampanın düyməsi τ(n) dəfə basılır. Yanılı qalır ⇔ τ(n) tək ⇔ n tam kvadratdır (bölənlər d və n/d cütləşir, yalnız √n cütsüz qalır). ${N}-ə qədər kvadratlar: 1², 2², …, ${r}² — ${r} dənə.`.replace(`${N}-ə qədər`, `${dat(N)} qədər`) }; }
        if (kind === "rect") { const [A, f] = build([[2, 3], [2, 5], [2, 3, 5], [2, 7], [3, 5], [2, 3, 7]], 3, 24, 1000), t = divisors(A).length, ans = Math.ceil(t / 2);
          return { text: `Sahəsi ${A} m² olan düzbucaqlı otaq planlaşdırılır, tərəfləri tam metrlə olmalıdır. Neçə müxtəlif forma mümkündür? (a × b ilə b × a eyni formadır.)`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Hər forma bir a · b = ${A}, a ≤ b cütüdür; a — ${A} ədədinin a ≤ √${A} olan bölənidir. ${A} = ${fmt(f)}, τ = ${t}. Bölənlər cüt-cüt düzülür: ${t % 2 ? `(${t} − 1)/2 + 1 (kvadrat forma da var)` : `${t}/2`} = ${ans}.` }; }
        const [N, f] = build([[2, 3], [2, 5], [2, 3, 5], [2, 7], [3, 5], [2, 3, 7]], 3, 24, 600), t = divisors(N).length;
        return { text: `${N} şagirdi bərabər qruplara bölmək lazımdır: hər qrupda ən azı 2 nəfər olmalı, qrupların sayı da ən azı 2 olmalıdır. Neçə müxtəlif bölgü mümkündür?`, answer: t - 2, show: String(t - 2), tol: 0.01,
          solution: `Qrupların sayı ${N} ədədinin bölənidir. ${N} = ${fmt(f)} → τ = ${t}. 1 qrup (hamı bir yerdə) və ${N} qrup (hərə tək) uyğun deyil: ${t} − 2 = ${t - 2}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const C = ["1-ci addım", "2-ci addım", "3-cü addım"], bad = rnd(0, 2);
        if (Math.random() < .5) {
          const n = rnd(130, 620), a = Math.floor(n / 5), b = Math.floor(n / 25), c = Math.floor(n / 125);
          const steps = [`${n}! ədədində 5-lərin sayı: ⌊${n}/5⌋ = ${a}.`, `Əlavə 5-lər: ⌊${n}/25⌋ = ${b}, ⌊${n}/125⌋ = ${c}.`, `Sıfırların sayı: ${a} + ${b} + ${c} = ${a + b + c}.`];
          let why;
          if (bad === 0) { steps[0] = `${n}! ədədində 10-ların sayı: ⌊${n}/10⌋ = ${Math.floor(n / 10)}.`; steps[2] = `Sıfırların sayı: ${Math.floor(n / 10)} + ${b} + ${c} = ${Math.floor(n / 10) + b + c}.`; why = `1-ci addım: sıfırı 10 = 2 · 5 verir, 5-lər azdır — ⌊${n}/5⌋ = ${a} sayılmalıdır (məs. 5 və 12 hasili də sıfır verir). Düz cavab ${a + b + c}.`; }
          if (bad === 1) { steps[1] = `Əlavə 5-lər: ⌊${n}/25⌋ = ${b + 1}, ⌊${n}/125⌋ = ${c}.`; steps[2] = `Sıfırların sayı: ${a} + ${b + 1} + ${c} = ${a + b + c + 1}.`; why = `2-ci addım: ${n} : 25 = ${(n / 25).toFixed(2).replace(".", ",")}, tam hissəsi ${b}, ${b + 1} yox. Düz cavab ${a + b + c}.`; }
          if (bad === 2) { steps[2] = `Sıfırların sayı: ${a} + ${b} = ${a + b}.`; why = `3-cü addım: 125-ə bölünən ədədlərin üçüncü 5-i (${c} dənə) unudulub. Düz cavab ${a} + ${b} + ${c} = ${a + b + c}.`; }
          const text = h("div", {}, h("p", {}, `Tapşırıq: ${n}! neçə sıfırla bitir?`), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
          return { text, choices: C, correct: bad, show: C[bad], solution: why };
        }
        let n, f; do { [n, f] = build([[2, 3], [2, 5], [2, 3, 5], [3, 5], [2, 7], [2, 3, 7]], 3, 60, 5000); } while (f.every(([, e]) => e === 2));
        const f2 = f.map(([p, e]) => [p, 2 * e]), ans = f2.reduce((t, [, e]) => t * (e + 1), 1);
        const steps = [`${n} = ${fmt(f)}.`, `${n}² = ${fmt(f2)}.`, `τ = ${f2.map(([, e]) => `(${e} + 1)`).join("")} = ${ans}.`];
        let why;
        if (bad === 0) { const i = rnd(0, f.length - 1), g = f.map(([p, e], j) => [p, j === i ? e + 1 : e]); steps[0] = `${n} = ${fmt(g)}.`; why = `1-ci addım: ${fmt(g)} = ${g.reduce((t, [p, e]) => t * p ** e, 1)}, ${n} deyil. Düzü: ${n} = ${fmt(f)}.`; }
        if (bad === 1) { const g = f.map(([p, e]) => [p, e + 2]); steps[1] = `${n}² = ${fmt(g)}.`; steps[2] = `τ = ${g.map(([, e]) => `(${e} + 1)`).join("")} = ${g.reduce((t, [, e]) => t * (e + 1), 1)}.`; why = `2-ci addım: kvadratda üstlər 2-yə VURULUR, 2 əlavə olunmur: (pᵃ)² = p²ᵃ. Düzü: ${n}² = ${fmt(f2)}, τ = ${ans}.`; }
        if (bad === 2) { const w = f2.reduce((t, [, e]) => t * e, 1); steps[2] = `τ = ${f2.map(([, e]) => e).join(" · ")} = ${w}.`; why = `3-cü addım: hər üstə 1 əlavə edilməlidir: ${f2.map(([, e]) => `(${e} + 1)`).join("")} = ${ans}.`; }
        const text = h("div", {}, h("p", {}, `Tapşırıq: ${n}² ədədinin neçə natural böləni var?`), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: C, correct: bad, show: C[bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-sade-ededler", title: "Sadə ədədlər, bölənlərin sayı və cəmi", fenn: "olimpiada", link: "dersler/ol-sade-ededler.html",
      format: "Cavab ədəddir: say, cəm və ya ədədin özü. Kəsr cavab ixtisar olunmuş şəkildə: 7/3.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["tau", "tau", "sigma", "lejandr", "lejandr", "sade", "sade", "minbolen", "minbolen", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-sade-ededler.html")) b.push("dersler/ol-sade-ededler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
