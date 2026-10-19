// Olimpiada · Funksional tənliklər — game levels.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);
  const R = (n, d = 1) => { if (d === 0) throw new Error("zero denominator"); if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; return [n / g, d / g]; };
  const radd = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const rsub = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const rdiv = (a, b) => R(a[0] * b[1], a[1] * b[0]);
  const rs = a => a[1] === 1 ? S(a[0]) : S(a[0]) + "/" + a[1];
  const rv = a => a[0] / a[1];
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const fin = (text, fr, solution, extra = {}) => Object.assign({ text, answer: rv(fr), show: rs(fr), tol: Number.isInteger(rv(fr)) ? 0.01 : Math.min(0.005, Math.abs(rv(fr)) * 0.01), solution }, extra);
  const inf = (text, n, solution, extra = {}) => fin(text, R(n), solution, extra);   // integer answer

  const levels = [
    { id: "yerine", ad: "Qiymət qoyma üsulu", izah: "Xüsusi qiymətlər qoy: x = 0, x = 1, y = 1, y = x. Əvvəl f(1), f(2), f(3) tap, qanunu gör, sonra f(n).",
      gen() {
        const kind = pick(["A", "B", "C", "D", "E"]);
        if (kind === "A") {
          const a = rnd(1, 6), c = pick([-1, 1]) * rnd(1, 9), n = rnd(5, 30), ans = c * n + a * n * (n - 1) / 2;
          return inf(`Natural x, y üçün f(x + y) = f(x) + f(y) + ${a === 1 ? "" : a}xy və f(1) = ${S(c)}. f(${n}) = ?`, ans,
            `y = 1 qoyaq: f(x + 1) = f(x) + f(1) + ${a === 1 ? "" : a}x = f(x) ${c < 0 ? "−" : "+"} ${Math.abs(c)} + ${a === 1 ? "" : a}x. Deməli f(n) = n·f(1) + ${a}·(1 + 2 + … + (n − 1)) = ${S(c)}·${n} + ${a}·${n * (n - 1) / 2} = ${S(ans)}. (f(2) = ${S(2 * c + a)}, f(3) = ${S(3 * c + 3 * a)}, …)`);
        }
        if (kind === "B") {
          const t = rnd(2, 4), n = rnd(3, 7);
          return inf(`Natural x, y üçün f(x + y) = f(x)·f(y) və f(1) = ${t}. f(${n}) = ?`, t ** n,
            `y = 1 qoysaq f(x + 1) = ${t}·f(x). f(2) = ${t * t}, f(3) = ${t ** 3}, … Qanun: f(n) = ${t}ⁿ. f(${n}) = ${t ** n}.`);
        }
        if (kind === "C") {
          const a = rnd(1, 5), b = rnd(-4, 6), c = rnd(-5, 9), n = rnd(5, 30), ans = c + b * n + a * n * (n - 1) / 2;
          return inf(`f(0) = ${S(c)} və hər tam qeyri-mənfi x üçün f(x + 1) = f(x) + ${poly([[a, "x"], [b, ""]])}. f(${n}) = ?`, ans,
            `x = 0, 1, 2, …, ${n - 1} qoyub toplayaq: f(${n}) − f(0) = ${P(b)}·${n} + ${a}·(0 + 1 + … + ${n - 1}) = ${S(b * n)} + ${a * n * (n - 1) / 2}. f(${n}) = ${S(c)} + ${S(b * n + a * n * (n - 1) / 2)} = ${S(ans)}.`);
        }
        if (kind === "D") {
          const k = pick([-1, 1]) * rnd(1, 6), c = pick([-1, 1]) * rnd(1, 7), n = rnd(4, 25), ans = n * c + (n - 1) * k;
          return inf(`Natural x, y üçün f(x + y) = f(x) + f(y) ${k < 0 ? "−" : "+"} ${Math.abs(k)} və f(1) = ${S(c)}. f(${n}) = ?`, ans,
            `y = 1 qoyaq: f(x + 1) = f(x) + f(1) ${k < 0 ? "−" : "+"} ${Math.abs(k)} = f(x) + ${S(c + k)}. Hər addımda ${S(c + k)} əlavə olunur: f(${n}) = f(1) + ${n - 1}·${P(c + k)} = ${S(c)} + ${S((n - 1) * (c + k))} = ${S(ans)}.`);
        }
        const n = rnd(4, 9); let f = 1; for (let i = 2; i <= n; i++) f *= i;
        return inf(`f(1) = 1 və hər natural x üçün f(x + 1) = (x + 1)·f(x). f(${n}) = ?`, f,
          `f(2) = 2·1 = 2, f(3) = 3·2 = 6, f(4) = 4·6 = 24, … Qanun: f(n) = 1·2·3·…·n = n!. f(${n}) = ${f}.`);
      } },
    { id: "koshi", ad: "Koşi tipli tənliklər", izah: "f(x + y) = f(x) + f(y) rasional ədədlərdə f(x) = cx verir (c = f(1)). f(xy) = f(x)f(y) isə sadə ədədlərin qiymətlərindən qurulur.",
      gen() {
        const kind = pick(["A", "A", "B", "C", "D", "D"]);
        if (kind === "A") {
          const a = rnd(2, 9), b = pick([-1, 1]) * rnd(1, 20), t = rnd(2, 400), N = a * t;
          return inf(`f: ℚ → ℚ funksiyası f(x + y) = f(x) + f(y) şərtini ödəyir və f(${a}) = ${S(b)}. f(${N}) = ?`, b * t,
            `Rasional ədədlərdə belə funksiya f(x) = c·x şəklindədir. f(${a}) = ${a}c = ${S(b)} → c = ${rs(R(b, a))}. f(${N}) = ${rs(R(b, a))}·${N} = ${S(b * t)}. (Və ya: ${N} = ${a}·${t} → f(${N}) = ${t}·f(${a}).)`);
        }
        if (kind === "B") {
          const q = rnd(2, 12), c = pick([-1, 1]) * rnd(1, 20), m = rnd(1, 11), fr = R(m * c, q);
          return fin(`f: ℚ → ℚ funksiyası f(x + y) = f(x) + f(y) şərtini ödəyir və f(1) = ${S(c)}. f(${m}/${q}) = ?`, fr,
            `f(1) = f(1/${q} + … + 1/${q}) (${q} toplanan) = ${q}·f(1/${q}) → f(1/${q}) = ${rs(R(c, q))}. Onda f(${m}/${q}) = ${m}·f(1/${q}) = ${rs(fr)}.`);
        }
        const i = rnd(0, 4), j = rnd(0, 3), k = rnd(0, 2);
        let N = 2 ** i * 3 ** j * 5 ** k; if (N < 6) { return levels[1].gen(); }
        if (kind === "C") {
          const a = rnd(2, 4), b = rnd(2, 4), c = rnd(2, 4), ans = a ** i * b ** j * c ** k;
          return inf(`Natural ədədlər üçün f(xy) = f(x)·f(y), f(2) = ${a}, f(3) = ${b}, f(5) = ${c}. f(${N}) = ?`, ans,
            `${N} = ${[i ? "2^" + i : "", j ? "3^" + j : "", k ? "5^" + k : ""].filter(Boolean).join(" · ")}. f(xy) = f(x)f(y) olduğundan f(${N}) = ${[i ? a + "^" + i : "", j ? b + "^" + j : "", k ? c + "^" + k : ""].filter(Boolean).join(" · ")} = ${ans}.`);
        }
        const a = pick([-1, 1]) * rnd(1, 6), b = pick([-1, 1]) * rnd(1, 6), c = pick([-1, 1]) * rnd(1, 6);
        if (kind === "D" && Math.random() < .5) {
          const ans = i * a - j * b;
          return inf(`Müsbət rasional ədədlər üçün f(xy) = f(x) + f(y), f(2) = ${S(a)}, f(3) = ${S(b)}. f(${2 ** i}/${3 ** j}) = ?`, ans,
            `f(1) = 0 (x = y = 1). f(x)+f(1/x) = f(1) = 0 → f(1/x) = −f(x). f(2^${i}) = ${i}·f(2) = ${S(i * a)}, f(3^${j}) = ${S(j * b)}. f(${2 ** i}/${3 ** j}) = ${S(i * a)} − ${P(j * b)} = ${S(ans)}.`);
        }
        const ans = i * a + j * b + k * c;
        return inf(`Natural ədədlər üçün f(xy) = f(x) + f(y), f(2) = ${S(a)}, f(3) = ${S(b)}, f(5) = ${S(c)}. f(${N}) = ?`, ans,
          `${N} = ${[i ? "2^" + i : "", j ? "3^" + j : "", k ? "5^" + k : ""].filter(Boolean).join(" · ")}. Hasil cəmə çevrilir: f(${N}) = ${i}·${P(a)} + ${j}·${P(b)} + ${k}·${P(c)} = ${S(ans)}.`);
      } },
    { id: "sistem", ad: "f(x) və f(1/x) sistemi", izah: "Tənlikdə x yerinə 1/x (və ya 1 − x, −x) qoy, iki tənlik al, f(x)-i çıxar. 3 üzvlü dövrdə üç tənlik alınır.",
      gen() {
        const kind = pick(["A", "A", "B", "C", "D"]);
        if (kind === "A") {
          const k = pick([2, 3, 4, -2, -3]), sq = Math.random() < .4, a = pick([2, 3, 4, 5, -2, -3]);
          const num = sq ? a ** 4 - k : a * a - k, den = (sq ? a * a : a) * (1 - k * k), fr = R(num, den);
          return fin(`Hər x ≠ 0 üçün f(x) ${k < 0 ? "−" : "+"} ${Math.abs(k)}·f(1/x) = ${sq ? "x²" : "x"}. f(${S(a)}) = ?`, fr,
            `x yerinə 1/x: f(1/x) ${k < 0 ? "−" : "+"} ${Math.abs(k)}·f(x) = ${sq ? "1/x²" : "1/x"}. Birinci tənlikdən ${S(k)}·(ikinci)-ni çıxsaq: (1 − ${k * k})·f(x) = ${sq ? "x²" : "x"} ${k < 0 ? "+" : "−"} ${Math.abs(k)}·${sq ? "1/x²" : "1/x"}. x = ${S(a)}: f(${S(a)}) = (${S(sq ? a * a : a)} ${k < 0 ? "+" : "−"} ${Math.abs(k)}/${sq ? a * a : P(a)}) / (${S(1 - k * k)}) = ${rs(fr)}.`);
        }
        if (kind === "B") {
          const p = rnd(2, 4); let q = pick([-3, -2, -1, 1, 2, 3]); while (p * p === q * q) q = rnd(1, 3);
          const G = pick([{ s: "x²", f: x => x * x }, { s: "x", f: x => x }, { s: "2x + 1", f: x => 2 * x + 1 }]), a = rnd(-3, 5);
          const num = p * G.f(a) - q * G.f(1 - a), den = p * p - q * q, fr = R(num, den);
          return fin(`Hər x üçün ${p}·f(x) ${q < 0 ? "−" : "+"} ${Math.abs(q) === 1 ? "" : Math.abs(q) + "·"}f(1 − x) = ${G.s}. f(${S(a)}) = ?`, fr,
            `x yerinə 1 − x: ${p}·f(1 − x) ${q < 0 ? "−" : "+"} ${Math.abs(q)}·f(x) = ${G.s.replace(/x/g, "(1 − x)")}. İki tənlikdən f(1 − x)-i yox edək: ${p}·(birinci) − ${P(q)}·(ikinci) → ${den}·f(x) = ${p}·(${G.s}) − ${P(q)}·(${G.s.replace(/x/g, "(1 − x)")}). x = ${S(a)}: ${den}·f(${S(a)}) = ${p}·${S(G.f(a))} − ${P(q)}·${S(G.f(1 - a))} = ${S(num)}. f(${S(a)}) = ${rs(fr)}.`);
        }
        if (kind === "C") {
          const a = pick([2, 3, 4, 5, 6, -1, -2, -3, -4]), y = R(1, 1 - a), z = R(a - 1, a), fr = rdiv(radd(rsub(R(a), y), z), R(2));
          return fin(`x ≠ 0, 1 üçün f(x) + f(1/(1 − x)) = x. f(${S(a)}) = ?`, fr,
            `x₁ = ${S(a)}, x₂ = 1/(1 − x₁) = ${rs(y)}, x₃ = 1/(1 − x₂) = ${rs(z)}; 1/(1 − x₃) = ${S(a)} (üç ədəd dövrədir). Üç tənlik: f(x₁) + f(x₂) = ${S(a)}; f(x₂) + f(x₃) = ${rs(y)}; f(x₃) + f(x₁) = ${rs(z)}. 1-ci − 2-ci + 3-cü: 2f(x₁) = ${S(a)} − (${rs(y)}) + (${rs(z)}) → f(${S(a)}) = ${rs(fr)}.`);
        }
        const k = pick([2, 3, -2, -3]), u = rnd(-4, 5), v = rnd(-5, 5), a = rnd(1, 5);
        const g = x => x * x + u * x + v, num = g(a) - k * g(-a), den = 1 - k * k, fr = R(num, den);
        return fin(`Hər x üçün f(x) ${k < 0 ? "−" : "+"} ${Math.abs(k)}·f(−x) = ${poly([[1, "x²"], [u, "x"], [v, ""]])}. f(${a}) = ?`, fr,
          `x yerinə −x: f(−x) ${k < 0 ? "−" : "+"} ${Math.abs(k)}·f(x) = ${poly([[1, "x²"], [-u, "x"], [v, ""]])}. Birinci tənlikdən ${S(k)}·(ikinci)-ni çıxaq: (1 − ${k * k})·f(x) = g(x) − ${P(k)}·g(−x). x = ${a}: g(${a}) = ${S(g(a))}, g(−${a}) = ${S(g(-a))}. ${S(den)}·f(${a}) = ${S(g(a))} − ${P(k)}·${P(g(-a))} = ${S(num)}. f(${a}) = ${rs(fr)}.`);
      } },
    { id: "ardicil", ad: "f(2026) tipli rekurrent", izah: "f(n + 1) = f(n) + ... şəklindəki tənliklərdə ilk qiymətləri yaz, qanunu (cəm, dövr, hasil) gör, sonra böyük n üçün tətbiq et.",
      gen() {
        const kind = pick(["A", "A", "B", "B", "C", "D"]);
        if (kind === "A") {
          const a = rnd(1, 5), b = rnd(-3, 5), c = rnd(-5, 9), N = pick([100, 2026, rnd(30, 500), rnd(30, 3000)]);
          let v = c; for (let n = 1; n < N; n++) v += a * n + b;
          return inf(`f(1) = ${S(c)} və hər natural n üçün f(n + 1) = f(n) + ${poly([[a, "n"], [b, ""]])}. f(${N}) = ?`, v,
            `f(${N}) = f(1) + [f(2) − f(1)] + … + [f(${N}) − f(${N - 1})] = ${S(c)} + Σ(${poly([[a, "n"], [b, ""]])}), n = 1…${N - 1}. Σn = ${(N - 1) * N / 2}, və ${N - 1} dənə ${S(b)}. Cəm: ${a}·${(N - 1) * N / 2} + ${P(b)}·${N - 1} = ${S(a * (N - 1) * N / 2 + b * (N - 1))}. f(${N}) = ${S(v)}.`);
        }
        if (kind === "B") {
          const a = pick([-1, 1]) * rnd(1, 9), b = pick([-1, 1]) * rnd(1, 9), N = pick([2026, rnd(20, 400), rnd(20, 3000)]);
          const seq = [a, b]; for (let i = 3; i <= 6; i++) seq.push(seq[i - 2] - seq[i - 3]);
          const r = (N - 1) % 6, v = seq[r];
          return inf(`f(1) = ${S(a)}, f(2) = ${S(b)} və hər natural n üçün f(n + 2) = f(n + 1) − f(n). f(${N}) = ?`, v,
            `Ardıcıl hesablayaq: f(3) = ${S(seq[2])}, f(4) = ${S(seq[3])}, f(5) = ${S(seq[4])}, f(6) = ${S(seq[5])}, f(7) = ${S(a)}, f(8) = ${S(b)} — ilk iki ədəd qayıtdı, period 6. ${N} = 6·${Math.floor((N - 1) / 6)} + ${r + 1}, ona görə f(${N}) = f(${r + 1}) = ${S(v)}.`);
        }
        if (kind === "C") {
          const a = pick([-1, 1]) * rnd(1, 5), n = rnd(4, 10); let v = a, steps = [a];
          for (let i = 2; i <= n; i++) { v = 2 * v + 1; steps.push(v); }
          return inf(`f(1) = ${S(a)} və hər natural n üçün f(n + 1) = 2f(n) + 1. f(${n}) = ?`, v,
            `Ardıcıl: ${steps.map(S).join(" → ")}. Qanun: f(n) + 1 = 2ⁿ⁻¹·(f(1) + 1). f(${n}) = ${S(v)}.`);
        }
        const c = rnd(1, 9), n = rnd(4, 16), fr = R(2 * c, n * (n + 1));
        return fin(`f(1) = ${c} və hər natural n üçün f(1) + f(2) + … + f(n) = n²·f(n). f(${n}) = ?`, fr,
          `S(n) = n²f(n) və S(n−1) = (n−1)²f(n−1) olsun. f(n) = S(n) − S(n−1) → (n² − 1)f(n) = (n − 1)²f(n − 1) → f(n) = (n − 1)/(n + 1)·f(n − 1). Hasil teleskop olur: f(n) = f(1)·2/(n(n + 1)) = ${2 * c}/${n * (n + 1)} = ${rs(fr)}.`);
      } },
    { id: "evez", ad: "Dəyişən dəyişmə", izah: "Arqumenti yeni dəyişən kimi götür: u = 2x + 1 ⇒ x = (u − 1)/2. Ya da sağ tərəfi arqumentin ifadəsi kimi yaz.",
      gen() {
        const kind = pick(["A", "A", "B", "C"]);
        if (kind === "A") {
          const p = pick([-1, 1]) * rnd(2, 5), q = rnd(-6, 6), c2 = rnd(1, 3), c1 = rnd(-4, 5), c0 = rnd(-5, 5), x0 = rnd(-4, 6), k = p * x0 + q, ans = c2 * x0 * x0 + c1 * x0 + c0;
          return inf(`f(${poly([[p, "x"], [q, ""]])}) = ${poly([[c2, "x²"], [c1, "x"], [c0, ""]])} bütün x üçün. f(${S(k)}) = ?`, ans,
            `${poly([[p, "x"], [q, ""]])} = ${S(k)} olan x-i tapaq: x = ${S(x0)}. Onda f(${S(k)}) = ${c2}·${P(x0)}² + ${P(c1)}·${P(x0)} + ${P(c0)} = ${S(ans)}.`);
        }
        if (kind === "B") {
          const [u, v] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [1, 5]]), c = pick([-3, -2, -1, 1, 2, 3, 4]), x = R(u, v - u), fr = radd(R(x[0] * x[0], x[1] * x[1]), R(c * x[0], x[1]));
          return fin(`f(x/(x + 1)) = ${poly([[1, "x²"], [c, "x"]])} bütün x ≠ −1 üçün. f(${u}/${v}) = ?`, fr,
            `x/(x + 1) = ${u}/${v} → ${v}x = ${u}x + ${u} → x = ${rs(x)}. f(${u}/${v}) = (${rs(x)})² ${c < 0 ? "−" : "+"} ${Math.abs(c)}·${rs(x)} = ${rs(fr)}.`);
        }
        const t = pick(["m", "m", "t"]), a = rnd(2, 9);
        if (t === "m") {
          const sgn = pick([-1, 1]);
          const ans = sgn < 0 ? a * a + 2 : a * a - 2;
          return inf(`f(x ${sgn < 0 ? "−" : "+"} 1/x) = x² + 1/x² bütün x ≠ 0 üçün. f(${a}) = ?`, ans,
            `(x ${sgn < 0 ? "−" : "+"} 1/x)² = x² ${sgn < 0 ? "−" : "+"} 2 + 1/x². Deməli x² + 1/x² = (x ${sgn < 0 ? "−" : "+"} 1/x)² ${sgn < 0 ? "+" : "−"} 2. Onda f(u) = u² ${sgn < 0 ? "+" : "−"} 2, f(${a}) = ${a * a} ${sgn < 0 ? "+" : "−"} 2 = ${ans}.`);
        }
        return inf(`f(x + 1/x) = x³ + 1/x³ bütün x ≠ 0 üçün. f(${a}) = ?`, a ** 3 - 3 * a,
          `u = x + 1/x olsun. u³ = x³ + 3x + 3/x + 1/x³ = x³ + 1/x³ + 3u. Deməli x³ + 1/x³ = u³ − 3u, f(u) = u³ − 3u. f(${a}) = ${a ** 3} − ${3 * a} = ${a ** 3 - 3 * a}.`);
      } },
    { id: "hayat", ad: "Həyatdan", izah: "Real vəziyyətdə funksional tənliyi tap: cəmi hissələrin cəmi (Koşi), hər addımda x dəfə (hasil), pilləkən sayı (rekurrent).",
      gen() {
        const kind = pick(["stairs", "tariff", "bact", "hand"]);
        if (kind === "stairs") {
          const three = Math.random() < .4, n = rnd(6, three ? 12 : 14), f = three ? [0, 1, 2, 4] : [0, 1, 2];
          for (let i = f.length; i <= n; i++) f.push(three ? f[i - 1] + f[i - 2] + f[i - 3] : f[i - 1] + f[i - 2]);
          return { text: `Pilləkəndə ${n} pillə var. Hər dəfə ${three ? "1, 2 və ya 3" : "1 və ya 2"} pillə qalxmaq olar. Pilləkənin başına neçə müxtəlif üsulla çatmaq olar?`, answer: f[n], show: String(f[n]), tol: 0.01,
            solution: `f(n) — n pillə üçün üsulların sayı. Son addım ${three ? "1, 2 və ya 3" : "1 və ya 2"} pillədir: f(n) = ${three ? "f(n−1) + f(n−2) + f(n−3)" : "f(n−1) + f(n−2)"}. ${f.slice(1, n + 1).map((v, i) => `f(${i + 1}) = ${v}`).join(", ")}. Cavab: ${f[n]}.` };
        }
        if (kind === "tariff") {
          const a = rnd(2, 9), b = rnd(3, 40), t = rnd(10, 400), N = a * t;
          return { text: `Su sayğacında qiymət həcmə mütənasibdir: f(V₁ + V₂) = f(V₁) + f(V₂). ${a} litr suyun qiyməti ${b} qəpikdir. ${N} litr suyun qiyməti neçə qəpikdir?`, answer: b * t, show: String(b * t), tol: 0.01, unit: "qəpik",
            solution: `Koşi tənliyi: f(V) = c·V. f(${a}) = ${b} → c = ${b}/${a}. f(${N}) = ${N}·${b}/${a} = ${t}·${b} = ${b * t} qəpik. (${N} = ${a}·${t}: ${t} dəfə ${a} litr.)` };
        }
        if (kind === "bact") {
          const t = rnd(2, 4), n = rnd(3, 7);
          return { text: `Kolbada bakteriyaların sayı hər saat ${t} dəfə artır: f(s + 1) = ${t}·f(s). Başlanğıcda (s = 0) 1 bakteriya var. ${n} saatdan sonra neçə bakteriya olacaq?`, answer: t ** n, show: String(t ** n), tol: 0.01,
            solution: `f(0) = 1, f(1) = ${t}, f(2) = ${t * t}, … Qanun: f(s) = ${t}ˢ. f(${n}) = ${t}^${n} = ${t ** n}.` };
        }
        const n = rnd(8, 60);
        return { text: `${n} nəfər otaqda görüşür və hər kəs qalan hamı ilə bir dəfə əl tutur. Cəmi neçə əl tutma olacaq?`, answer: n * (n - 1) / 2, show: String(n * (n - 1) / 2), tol: 0.01,
          solution: `f(n) — n nəfər üçün say. Yeni gələn n-ci nəfər əvvəlkilərin hamısı ilə (n − 1 nəfər) əl tutur: f(n) = f(n − 1) + (n − 1), f(1) = 0. Cəm: 1 + 2 + … + (n − 1) = n(n − 1)/2. f(${n}) = ${n}·${n - 1}/2 = ${n * (n - 1) / 2}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const k = pick([2, 3, 4, 5]); let a = rnd(2, 9); while (a * a === k) a = rnd(2, 9);
        const fr = R(a * a - k, a * (1 - k * k)), wrong = R(-(a * a - k), a * (1 - k * k));
        const steps = [
          `x yerinə 1/x qoyuruq: f(1/x) + ${k}·f(x) = 1/x.`,
          `Birinci tənlikdən ${k}·(ikinci tənliyi) çıxırıq: (1 − ${k * k})·f(x) = x − ${k}/x.`,
          `x = ${a}: f(${a}) = (${a} − ${k}/${a}) / (1 − ${k * k}) = ${rs(fr)}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `x yerinə 1/x qoyuruq: f(1/x) + ${k}·f(x) = x.`;
        if (bad === 1) steps[1] = `Birinci tənlikdən ${k}·(ikinci tənliyi) çıxırıq: (1 − ${k})·f(x) = x − ${k}/x.`;
        if (bad === 2) steps[2] = `x = ${a}: f(${a}) = (${a} − ${k}/${a}) / (1 − ${k * k}) = ${rs(wrong)}.`;
        const text = h("div", {}, h("p", {}, `Hər x ≠ 0 üçün f(x) + ${k}·f(1/x) = x. f(${a}) = ?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: x yerinə 1/x qoyanda sağ tərəf də 1/x olmalıdır (tənliyin hər yerində x əvəz olunur).`,
          `2-ci addım: f(x)-in əmsalı 1 − ${k}·${k} = 1 − ${k * k}-dir, 1 − ${k} yox.`,
          `3-cü addım: (${a} − ${k}/${a}) = ${rs(R(a * a - k, a))}, bölmə (1 − ${k * k}) = ${S(1 - k * k)}-ə: düz cavab ${rs(fr)}. İşarə səhvdir.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-funksional", title: "Funksional tənliklər", fenn: "olimpiada", link: "dersler/ol-funksional.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 7/2 (onluq 3.5 də olar).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["yerine", "yerine", "koshi", "koshi", "sistem", "sistem", "ardicil", "evez", "hayat", "hayat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-funksional.html")) b.push("dersler/ol-funksional.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
