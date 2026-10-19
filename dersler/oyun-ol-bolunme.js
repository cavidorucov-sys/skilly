// Olimpiada: bölünmə əlamətləri — game levels (remainders mod 9/11, 7/13 via 1001, 2ⁿ/5ⁿ, hidden digits, divisibility of expressions).
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const mod = (a, m) => ((a % m) + m) % m;
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const gcdB = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
  // dative suffix after a number written in digits: 7-yə, 9-a, 16-ya, 36-ya, 1000-ə
  const D1 = ["", "ə", "yə", "ə", "ə", "ə", "ya", "yə", "ə", "a"], D10 = ["", "a", "yə", "a", "a", "yə", "a", "ə", "ə", "a"];
  const dat = n => { const a = Math.abs(n); const s = a === 0 ? "a" : a % 10 ? D1[a % 10] : a % 100 ? D10[(a / 10) % 10] : a % 1e6 ? "ə" : "a"; return S(n) + "-" + s; };
  const randDigits = len => { let s = String(rnd(1, 9)); while (s.length < len) s += rnd(0, 9); return s; };
  const dsum = s => [...s].reduce((t, c) => t + +c, 0);
  const modStr = (s, m) => [...s].reduce((r, c) => (r * 10 + +c) % m, 0);
  // digits in odd places from the right (units = 1st place) and in even places
  const places = s => { const A = [], B = []; [...s].reverse().forEach((c, i) => (i % 2 ? B : A).push(+c)); return [A, B]; };
  const sum = a => a.reduce((t, x) => t + x, 0);
  // three-digit blocks from the right: "12345678" → [678, 345, 12]
  const blocks = s => { const out = []; for (let i = s.length; i > 0; i -= 3) out.push(s.slice(Math.max(0, i - 3), i)); return out; };
  const altExpr = bl => bl.map((b, i) => (i ? (i % 2 ? " − " : " + ") : "") + (+b)).join("");
  const altVal = bl => bl.reduce((t, b, i) => t + (i % 2 ? -1 : 1) * (+b), 0);
  const remWords = (x, m) => { const r = mod(x, m); if (x >= 0) return `${x} = ${m} · ${Math.floor(x / m)} + ${r}, qalıq ${r}`; const k = Math.ceil(-x / m); return `${S(x)} + ${m * k} = ${r}, qalıq ${r}`; };
  const RULE = {
    2: "2-yə: son rəqəm cütdür", 3: "3-ə: rəqəmlərin cəmi 3-ə bölünür", 4: "4-ə: son iki rəqəmdən düzələn ədəd 4-ə bölünür", 5: "5-ə: son rəqəm 0 və ya 5",
    8: "8-ə: son üç rəqəmdən düzələn ədəd 8-ə bölünür", 9: "9-a: rəqəmlərin cəmi 9-a bölünür", 11: "11-ə: tək və cüt yerlərdəki rəqəmlərin cəmlərinin fərqi 11-ə bölünür",
    25: "25-ə: son iki rəqəm 00, 25, 50 və ya 75",
  };
  const listNums = a => a.length <= 8 ? a.join(", ") : a.slice(0, 7).join(", ") + ", …";
  const money = p => p % 100 ? Math.floor(p / 100) + "," + String(p % 100).padStart(2, "0") : String(p / 100);

  const levels = [
    { id: "qaliq911", ad: "Qalıq: 3, 9 və 11", izah: "10 ≡ 1 (mod 9) → qalıq = rəqəmlər cəminin qalığı. 10 ≡ −1 (mod 11) → qalıq = (tək yerlər − cüt yerlər)-in qalığı.",
      gen() {
        const kind = pick(["d9", "d9", "d11", "d11", "yan", "rep"]);
        if (kind === "d9") {
          const m = pick([3, 9]), s = randDigits(rnd(8, 12)), t = dsum(s), r = t % m;
          if (r !== modStr(s, m)) throw new Error("d9");
          return { text: `${s} ədədini ${dat(m)} böləndə qalıq neçə olar?`, answer: r, show: String(r), tol: 0.01,
            solution: `10 ≡ 1 (mod ${m}), ona görə ədəd öz rəqəmləri cəmi ilə eyni qalığı verir. Rəqəmlər cəmi ${t}; ${remWords(t, m)}.` };
        }
        if (kind === "d11") {
          const s = randDigits(rnd(7, 11)), [A, B] = places(s), x = sum(A) - sum(B), r = mod(x, 11);
          if (r !== modStr(s, 11)) throw new Error("d11");
          return { text: `${s} ədədini 11-ə böləndə qalıq neçə olar?`, answer: r, show: String(r), tol: 0.01,
            solution: `10 ≡ −1 (mod 11). Sağdan tək yerlərdəki rəqəmlər: ${A.join(" + ")} = ${sum(A)}; cüt yerlərdəki: ${B.join(" + ")} = ${sum(B)}. Fərq ${sum(A)} − ${sum(B)} = ${S(x)}; ${remWords(x, 11)}.` };
        }
        if (kind === "yan") {
          const N = rnd(12, 99), m = pick([3, 9]), T = N * (N + 1) / 2, r = T % m;
          let big = ""; for (let i = 1; i <= N; i++) big += i;
          if (modStr(big, m) !== r) throw new Error("yan");
          return { text: `1-dən ${dat(N)} qədər bütün natural ədədləri ardıcıl yan-yana yazdıq: 123456789101112…${N}. Alınan ədədi ${dat(m)} böləndə qalıq neçə olar?`, answer: r, show: String(r), tol: 0.01,
            solution: `Hər ədəd ${dat(m)} bölmədə öz rəqəmləri cəmi kimi qalıq verir, ona görə böyük ədədin qalığı = 1 + 2 + … + ${N} cəminin qalığı. 1 + 2 + … + ${N} = ${N} · ${N + 1} / 2 = ${T}; ${remWords(T, m)}.` };
        }
        // rep: digit d written k times
        const d = rnd(1, 9), k = rnd(10, 2030), m = pick([9, 11, 11, 3]);
        const r = m === 11 ? (k % 2 ? d % 11 : 0) : (d * k) % m;
        if (modStr(String(d).repeat(k), m) !== r) throw new Error("rep");
        const why = m === 11
          ? `11-ə əlamət: tək yerlərdə ${Math.ceil(k / 2)} dənə ${d}, cüt yerlərdə ${Math.floor(k / 2)} dənə ${d}. Fərq ${k % 2 ? d : 0}` + (k % 2 ? ` (k tək olduğu üçün bir ${d} artıq qalır) → qalıq ${r}.` : ` → qalıq 0.`)
          : `Rəqəmlər cəmi ${d} · ${k} = ${d * k}; ${remWords(d * k, m)}.`;
        return { text: `${d} rəqəmini ${k} dəfə yan-yana yazdıq: ${String(d).repeat(4)}…${d}. Bu ədədi ${dat(m)} böləndə qalıq neçə olar?`, answer: r, show: String(r), tol: 0.01, solution: why };
      } },
    { id: "qaliq7", ad: "7, 11, 13 və 1001", izah: "1001 = 7 · 11 · 13 və 1000 ≡ −1. Ədədi sağdan üçrəqəmli dəstələrə böl, dəstələri növbə ilə + və − ilə topla.",
      gen() {
        if (Math.random() < .75) {
          const m = pick([7, 13, 7, 13, 11]), s = randDigits(rnd(7, 12)), bl = blocks(s), x = altVal(bl), r = mod(x, m);
          if (r !== modStr(s, m)) throw new Error("blk");
          return { text: `${s} ədədini ${dat(m)} böləndə qalıq neçə olar?`, answer: r, show: String(r), tol: 0.01,
            solution: `1001 = 7 · 11 · 13, deməli 1000 ≡ −1 (mod ${m}). Sağdan dəstələr: ${bl.slice().reverse().join(" | ")}. Növbə ilə: ${altExpr(bl)} = ${S(x)}. ${remWords(x, m)}.` };
        }
        const abc = rnd(101, 999), N = abc * 1001, dv = pick([7, 11, 13, 77, 91, 143]), q = N / dv;
        const parts = { 7: "7", 11: "11", 13: "13", 77: "7 · 11", 91: "7 · 13", 143: "11 · 13" }[dv];
        return { text: `${N} ədədini ${dat(dv)} böl. Qismət neçədir?`, answer: q, show: String(q), tol: 0.01,
          solution: `${N} = ${abc} · 1001 = ${abc} · 7 · 11 · 13 (abcabc şəkilli ədəd). ${dv} = ${parts}, qalan vuruqlar: ${N} : ${dv} = ${abc} · ${1001 / dv} = ${q}.` };
      } },
    { id: "uslu", ad: "2ⁿ və 5ⁿ: son rəqəmlər", izah: "10ⁿ həm 2ⁿ-ə, həm 5ⁿ-ə bölünür — qalığı yalnız son n rəqəm müəyyən edir.",
      gen() {
        const [m, k] = pick([[4, 2], [8, 3], [16, 4], [32, 5], [25, 2], [125, 3], [16, 4], [8, 3]]);
        const pow = m === 25 || m === 125 ? `5${["", "", "²", "³"][k]}` : `2${["", "", "²", "³", "⁴", "⁵"][k]}`;
        if (Math.random() < .55) {
          const s = randDigits(rnd(8, 11)), tail = s.slice(-k), r = +tail % m;
          if (r !== modStr(s, m)) throw new Error("uslu");
          return { text: `${s} ədədini ${dat(m)} böləndə qalıq neçə olar?`, answer: r, show: String(r), tol: 0.01,
            solution: `${m} = ${pow}, 10${["", "", "²", "³", "⁴", "⁵"][k]} isə ${dat(m)} bölünür. Ona görə yalnız son ${k} rəqəm vacibdir: ${+tail} = ${m} · ${Math.floor(+tail / m)} + ${r}. Qalıq ${r}.` };
        }
        // one hidden digit among the last k places
        for (;;) {
          const len = rnd(k + 2, k + 4), s = randDigits(len).split(""), pos = len - 1 - rnd(0, k - 1);
          const ok = []; for (let d = 0; d <= 9; d++) { s[pos] = String(d); if (modStr(s.join(""), m) === 0) ok.push(d); }
          if (!ok.length) continue;
          s[pos] = "*"; const shown = s.join(""), tailT = shown.slice(-k);
          const one = ok.length === 1;
          return { text: `${shown} ədədi ${dat(m)} bölünür (* — bir rəqəmdir). ` + (one ? "* = ?" : "* yerinə yazıla bilən bütün rəqəmlərin cəmini tap."),
            answer: one ? ok[0] : sum(ok), show: String(one ? ok[0] : sum(ok)), tol: 0.01,
            solution: `${m} = ${pow} — yalnız son ${k} rəqəm (${tailT}) ${dat(m)} bölünməlidir. Yoxlayanda uyğun rəqəmlər: ${ok.join(", ")}` + (one ? `. Cavab: ${ok[0]}.` : `; cəmi ${ok.join(" + ")} = ${sum(ok)}.`) };
        }
      } },
    { id: "reqem", ad: "Gizli rəqəmlər", izah: "36 = 4 · 9, 45 = 5 · 9, 72 = 8 · 9, 99 = 9 · 11 … Bölən qarşılıqlı sadə vuruqlara ayrılır, hər vuruğun əlaməti ayrıca yoxlanır.",
      gen() {
        if (Math.random() < .25) {
          // smallest number written only with 0 and 1, divisible by D = 3^c · 2^x · 5^y
          const [D, c, z] = pick([[12, 1, 2], [15, 1, 1], [18, 2, 1], [24, 1, 3], [36, 2, 2], [45, 2, 1], [72, 2, 3], [75, 1, 2], [225, 2, 2], [48, 1, 4], [120, 1, 3], [360, 2, 3], [150, 1, 2], [90, 2, 1], [60, 1, 2]]);
          const ans = "1".repeat(c === 1 ? 3 : 9) + "0".repeat(z);
          // BFS check: smallest 0/1 number divisible by D
          const seen = new Set([1 % D]); let q = ["1"], found = null;
          while (!found) { const nq = []; for (const t of q) for (const d of "01") { const u = t + d, r = modStr(u, D); if (r === 0) { found = found || u; } else if (!seen.has(r)) { seen.add(r); nq.push(u); } } if (found) break; q = nq; }
          if (found !== ans) throw new Error("01 " + D);
          const ones = c === 1 ? 3 : 9, tw = D / (c === 1 ? 3 : 9);
          return { text: `Rəqəmləri yalnız 0 və 1 olan, ${dat(D)} bölünən ən kiçik natural ədədi tap.`, answer: +ans, show: ans, tol: 0.01,
            solution: `${D} = ${ones === 3 ? 3 : 9} · ${tw}. ${ones === 3 ? "3" : "9"}-${ones === 3 ? "ə" : "a"} bölünmə üçün rəqəmlər cəmi, yəni birlərin sayı ${ones === 3 ? "3" : "9"}-${ones === 3 ? "ə" : "a"} bölünməlidir — ən azı ${ones} dənə 1. ${tw} yalnız 2 və 5 vuruqlarından ibarətdir: 0 və 1 rəqəmləri ilə buna bölünmə yalnız ədəd ${z} sıfırla bitəndə mümkündür (son rəqəm 1 olsa, ədəd tək olar və 5-ə bölünməz; sıfırı atıb eyni mühakiməni təkrarlayırıq). Ən kiçik: ${ones} bir, sonra ${z} sıfır — ${ans}.` };
        }
        const [D, p, q] = pick([[36, 4, 9], [45, 5, 9], [72, 8, 9], [99, 9, 11], [88, 8, 11], [24, 3, 8], [18, 2, 9], [75, 3, 25], [44, 4, 11], [36, 4, 9], [72, 8, 9], [45, 5, 9]]);
        for (;;) {
          const len = rnd(4, 6), s = randDigits(len).split("");
          let ia = rnd(0, len - 1), ib = rnd(0, len - 1); if (ia === ib) continue;
          if (Math.random() < .7 && ib < len - 3) ib = len - 1 - rnd(0, 1); if (ia === ib) continue;
          if (ia > ib) [ia, ib] = [ib, ia];
          const sols = [];
          for (let a = 0; a <= 9; a++) for (let b = 0; b <= 9; b++) {
            if ((ia === 0 && a === 0)) continue;
            s[ia] = String(a); s[ib] = String(b); const t = s.join("");
            if (modStr(t, D) === 0) sols.push({ a, b, t });
          }
          if (!sols.length || sols.length > 10) continue;
          s[ia] = "a"; s[ib] = "b"; const tmpl = s.join("");
          const ask = sols.length === 1 ? pick(["ab", "num"]) : pick(["count", "max", "min"]);
          const nums = sols.map(x => +x.t).sort((x, y) => x - y);
          const ans = { ab: sols[0].a + sols[0].b, num: nums[0], count: sols.length, max: nums[nums.length - 1], min: nums[0] }[ask];
          const Q = { ab: "a + b = ?", num: "Bu ədədi tap.", count: "Belə neçə ədəd var?", max: "Belə ədədlərin ən böyüyünü tap.", min: "Belə ədədlərin ən kiçiyini tap." }[ask];
          return { text: `${tmpl} ədədində a və b rəqəmlərdir (eyni ola bilər, ədəd 0 ilə başlamır). Ədəd ${dat(D)} bölünür. ${Q}`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${D} = ${p} · ${q}, vuruqlar qarşılıqlı sadədir — ədəd hər ikisinə bölünməlidir. ${RULE[p]}; ${RULE[q]}. Hər iki şərti ödəyən ədədlər: ${listNums(nums)} (cəmi ${nums.length}). Cavab: ${ans}.` };
        }
      } },
    { id: "ifade", ad: "İfadələrin bölünməsi", izah: "n³ − n = (n − 1)n(n + 1); k ardıcıl ədədin hasili k!-a bölünür; aⁿ − bⁿ ədədi a − b-yə bölünür. Ən böyük bölən: kiçik n-də yoxla.",
      gen() {
        const P = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
        const kind = pick(["cube", "five", "seven", "lin", "lin", "cons", "cons", "pow", "pow", "powp", "odd", "p2", "p4", "n4", "sq"]);
        let F;
        if (kind === "cube") F = { e: "n³ − n", f: n => n ** 3n - n, ns: "all", ans: 6, why: "n³ − n = (n − 1)n(n + 1) — üç ardıcıl ədəd: biri cüt, biri 3-ə bölünür → 6-ya bölünür. n = 2-də ifadə 6-dır, daha böyük ortaq bölən ola bilməz." };
        if (kind === "five") F = { e: "n⁵ − n", f: n => n ** 5n - n, ns: "all", ans: 30, why: "n⁵ − n = (n − 1)n(n + 1)(n² + 1). Üç ardıcıl ədəd → 6. 5-ə: n ≡ 0, ±1 (mod 5) olsa — ilk üç vuruqdan biri; n ≡ ±2 olsa n² + 1 ≡ 5 ≡ 0. Cəmi 30. n = 2-də 30 alınır." };
        if (kind === "seven") F = { e: "n⁷ − n", f: n => n ** 7n - n, ns: "all", ans: 42, why: "n⁷ − n = n(n⁶ − 1) içində (n − 1)n(n + 1) var → 6-ya bölünür; Ferma teoremi: n⁷ ≡ n (mod 7) → 7-yə bölünür. Cəmi 42. n = 2: 126, n = 3: 2184, ƏBOB(126; 2184) = 42." };
        if (kind === "lin") { const a = pick([5, 11, 17, 23, 29, 35, 41, 47]); F = { e: `n³ + ${a}n`, f: n => n ** 3n + BigInt(a) * n, ns: "all", ans: 6, why: `n³ + ${a}n = (n³ − n) + ${a + 1}n. n³ − n = (n − 1)n(n + 1) 6-ya bölünür, ${a + 1} də 6-ya bölünür. n = 1-də ifadə ${a + 1}, n = 2-də ${8 + 2 * a}; ƏBOB-ları 6-dır.` }; }
        if (kind === "cons") { const k = rnd(3, 6), fact = [1, 1, 2, 6, 24, 120, 720][k]; F = { e: Array.from({ length: k }, (_, i) => i ? `(n + ${i})` : "n").join(""), f: n => { let p = 1n; for (let i = 0n; i < BigInt(k); i++) p *= n + i; return p; }, ns: "all", ans: fact,
          why: `${k} ardıcıl ədədin hasili ${k}! = ${fact}-ə bölünür: hasil/${k}! = C(n + ${k - 1}; ${k}) — seçimlərin sayıdır, tam ədəddir. n = 1-də hasil düz ${fact}-dir, daha böyük ortaq bölən yoxdur.` }; }
        if (kind === "pow") { const b = rnd(2, 9), a = b + rnd(2, 14); F = { e: `${a}ⁿ − ${b}ⁿ`, f: n => BigInt(a) ** n - BigInt(b) ** n, ns: "all", ans: a - b,
          why: `aⁿ − bⁿ = (a − b)(aⁿ⁻¹ + aⁿ⁻²b + … + bⁿ⁻¹), deməli həmişə ${a} − ${b} = ${a - b}-ə bölünür. n = 1-də ifadə düz ${a - b}-dir — daha böyük ortaq bölən yoxdur.` }; }
        if (kind === "powp") { const b = rnd(2, 9), a = b + rnd(1, 12); F = { e: `${a}ⁿ + ${b}ⁿ`, f: n => BigInt(a) ** n + BigInt(b) ** n, ns: "odd", ans: a + b,
          why: `Tək n üçün aⁿ + bⁿ = (a + b)(aⁿ⁻¹ − aⁿ⁻²b + … + bⁿ⁻¹), deməli ${a} + ${b} = ${a + b}-ə bölünür. n = 1-də ifadə düz ${a + b}-dir.` }; }
        if (kind === "odd") F = { e: "n² − 1", f: n => n * n - 1n, ns: "odd", ans: 8, why: "n² − 1 = (n − 1)(n + 1) — iki ardıcıl cüt ədəd, onlardan biri 4-ə bölünür → 2 · 4 = 8. n = 3-də ifadə 8-dir." };
        if (kind === "p2") F = { e: "p² − 1", f: n => n * n - 1n, ns: "p3", ans: 24, why: "(p − 1)(p + 1): iki ardıcıl cüt ədəd → 8-ə bölünür; p − 1, p, p + 1 içində biri 3-ə bölünür, p deyil → 3-ə bölünür. 8 · 3 = 24; p = 5-də 24 alınır." };
        if (kind === "p4") F = { e: "p⁴ − 1", f: n => n ** 4n - 1n, ns: "p5", ans: 240, why: "p⁴ − 1 = (p − 1)(p + 1)(p² + 1): ilk ikisi ardıcıl cütlər (8), p² + 1 də cüt → 16; 3-ə — p − 1 və ya p + 1; 5-ə — Ferma: p⁴ ≡ 1 (mod 5). 16 · 3 · 5 = 240. p = 7: 2400, p = 11: 14640, ƏBOB = 240." };
        if (kind === "n4") F = { e: "n⁴ − n²", f: n => n ** 4n - n * n, ns: "all", ans: 12, why: "n⁴ − n² = n · (n − 1)n(n + 1). 3-ə: ardıcıl üçlük. 4-ə: n cütsə n² 4-ə bölünür, təksə (n − 1)(n + 1) 8-ə bölünür. n = 2-də 12 alınır." };
        if (kind === "sq") F = { e: "n(n + 1)(2n + 1)", f: n => n * (n + 1n) * (2n * n + 1n), ns: "all", ans: 6, why: "2-yə: n(n + 1) cütdür. 3-ə: n ≡ 0 → n, n ≡ 2 → n + 1, n ≡ 1 → 2n + 1 = 3-ün misli. n = 1-də ifadə 6-dır." };
        // check: gcd over the allowed n equals the stated answer
        const ns = F.ns === "all" ? Array.from({ length: 30 }, (_, i) => i + 1) : F.ns === "odd" ? Array.from({ length: 15 }, (_, i) => 2 * i + 1) : P.filter(p => F.ns === "p3" || p > 5);
        let g = 0n; for (const n of ns) g = gcdB(g, F.f(BigInt(n)));
        if (Number(g) !== F.ans) throw new Error("ifade " + F.e + " " + g);
        const cond = { all: "Bütün natural n üçün", odd: "Bütün tək natural n üçün", p3: "3-dən böyük bütün sadə p üçün", p5: "5-dən böyük bütün sadə p üçün" }[F.ns];
        return { text: `${cond} ${F.e} ifadəsinin bölündüyü ən böyük natural ədədi tap.`, answer: F.ans, show: String(F.ans), tol: 0.01, solution: F.why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Silinmiş rəqəmlər, \"hər dəfə 1 artıq qalır\" — bölünmə əlamətləri və ƏKOB işləyir.",
      gen() {
        if (Math.random() < .5) {
          const [K, p1, q1] = pick([[72, 8, 9], [88, 8, 11], [99, 9, 11], [44, 4, 11], [72, 8, 9], [88, 8, 11]]);
          for (;;) {
            const p = rnd(110, 1399), T = K * p; if (T < 10000 || T > 99999) continue;
            const s = String(T); let cnt = 0;
            for (let x = 1; x <= 9; x++) for (let y = 0; y <= 9; y++) if (modStr(x + s.slice(1, 4) + y, K) === 0) cnt++;
            if (cnt !== 1) continue;
            return { text: `${K} eyni dəftər alındı. Qəbzdə məbləğin birinci və sonuncu rəqəmi silinib: *${s[1]}${s[2]},${s[3]}* manat. Bir dəftər neçə manatdır?`, answer: p / 100, show: money(p), unit: "manat", tol: 0.001,
              solution: `Məbləği qəpiklə yazaq: x${s.slice(1, 4)}y — beşrəqəmli ədəd ${dat(K)} bölünür. ${K} = ${p1} · ${q1}: ${RULE[p1]}; ${RULE[q1]}. Hər iki şərti yalnız ${T} ödəyir. ${T} : ${K} = ${p} qəpik = ${money(p)} manat.` };
          }
        }
        const sets = [[2, 3, 4, 5, 6], [2, 3, 4], [3, 4, 5], [2, 3, 4, 5], [4, 5, 6], [3, 4], [2, 5, 9], [4, 6, 9], [3, 5, 6], [2, 3, 5]];
        for (;;) {
          const M = pick(sets), L = M.reduce((a, b) => a * b / gcd(a, b)), q = pick([7, 11, 13, 17]); if (L % q === 0) continue;
          const lack = Math.random() < .35, r = lack ? -1 : rnd(1, Math.min(...M) - 1);
          let x = 1; while (!(x % q === 0 && M.every(m => mod(x - r, m) === 0) && x > Math.max(...M))) x++;
          const k = (x - r) / L;
          const cond = lack ? "hər dəfə sonuncu dəstəyə 1 nəfər çatmır" : `hər dəfə ${r} nəfər artıq qalır`;
          return { text: `Şagirdləri ${M.join(", ")} nəfərlik dəstələrə bölmək istəyəndə ${cond}. ${q} nəfərlik dəstələrə isə tam bölünürlər. Ən azı neçə şagird var?`, answer: x, show: String(x), unit: "şagird", tol: 0.01,
            solution: `Şagirdlərin sayı x olsun. x ${lack ? "+ 1" : "− " + r} ədədi ${M.join(", ")} ədədlərinin hamısına, deməli onların ƏKOB-una bölünür. ƏKOB = ${L}, x = ${L}k ${lack ? "− 1" : "+ " + r}. k = 1, 2, … yoxlayırıq: ${dat(q)} bölünən ilk ədəd k = ${k}-də alınır, x = ${x}. Yoxla: ${x} = ${q} · ${x / q}.` };
        }
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Qalıq üç addımda tapılıb, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const C = ["1-ci addım", "2-ci addım", "3-cü addım"];
        const bad = rnd(0, 2);
        if (Math.random() < .5) {
          // mod 11 of an 8-digit number with A − B < 0
          let s, A, B; do { s = randDigits(8); [A, B] = places(s); } while (sum(A) - sum(B) >= 0 || mod(sum(A) - sum(B), 11) === 0);
          let a = sum(A), b = sum(B);
          if (bad === 0) a += pick([1, 2, -1]); if (bad === 1) b += pick([1, 2, -1]);
          const x = a - b; let r = mod(x, 11); if (bad === 2) r = (-x) % 11;
          const steps = [`Sağdan tək yerlərdəki rəqəmlər: ${A.join(" + ")} = ${a}.`, `Cüt yerlərdəki rəqəmlər: ${B.join(" + ")} = ${b}.`, `Fərq ${a} − ${b} = ${S(x)}, deməli qalıq ${r}.`];
          const why = [`1-ci addım: ${A.join(" + ")} = ${sum(A)}, ${a} yox.`, `2-ci addım: ${B.join(" + ")} = ${sum(B)}, ${b} yox.`, `3-cü addım: mənfi fərqdə qalıq ${S(x)} + ${11 * Math.ceil(-x / 11)} = ${mod(x, 11)}-dir; ${r} deyil (qalıq mənfi ədədin modulu deyil).`][bad];
          const text = h("div", {}, h("p", {}, `Tapşırıq: ${s} ədədini 11-ə böləndə qalığı tap.`), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
          return { text, choices: C, correct: bad, show: C[bad], solution: why };
        }
        // mod 7 of an 8-digit number via 1001
        const s = randDigits(8), good = blocks(s);
        const bl = bad === 0 ? [s.slice(6), s.slice(3, 6), s.slice(0, 3)] : good; // bad 0: blocks cut from the left
        const leftSplit = [s.slice(0, 3), s.slice(3, 6), s.slice(6)];
        let x = bad === 1 ? bl.reduce((t, b) => t + +b, 0) : altVal(bl);
        let r = mod(x, 7); if (bad === 2) r = (r + rnd(1, 6)) % 7;
        const shownBl = bad === 0 ? leftSplit.join(" | ") : good.slice().reverse().join(" | ");
        const expr = bad === 1 ? bl.map(b => +b).join(" + ") : altExpr(bl);
        const steps = [`Sağdan üçrəqəmli dəstələr: ${shownBl}.`, `Dəstələri növbə ilə toplayırıq: ${expr} = ${S(x)}.`, `${S(x)} ədədini 7-yə böləndə qalıq ${r}.`];
        const why = [`1-ci addım: dəstələr sağdan kəsilir: ${good.slice().reverse().join(" | ")}. Soldan kəsmək olmaz — 1000 ≡ −1 yalnız sağdan sayılan dəstələr üçün işləyir.`,
          `2-ci addım: 1000 ≡ −1 olduğu üçün işarələr növbələşir: ${altExpr(bl)}; hamısını toplamaq olmaz.`,
          `3-cü addım: ${remWords(x, 7)}; ${r} deyil.`][bad];
        const text = h("div", {}, h("p", {}, `Tapşırıq: ${s} ədədini 7-yə böləndə qalığı tap.`), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
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
      key: "ol-bolunme", title: "Bölünmə əlamətləri (olimpiada)", fenn: "olimpiada", link: "dersler/ol-bolunme.html",
      format: "Cavab ədəddir: qalıq 0-dan böləndən 1 əskiyə qədər; rəqəm, say və ya ədədin özü. Pul məbləği onluq kəsrlə: 5,11.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["qaliq911", "qaliq911", "qaliq7", "qaliq7", "uslu", "reqem", "reqem", "ifade", "ifade", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-bolunme.html")) b.push("dersler/ol-bolunme.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
