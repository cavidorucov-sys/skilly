// İkidərəcəli tənliklər sistemi, sistemlə məsələ həlli — mastery game levels (x + y and xy, substitution,
// symmetric expressions, two quadratic equations, two-digit numbers, word problems, find-the-mistake) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);                       // number with a real minus sign
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);                  // bracket negatives
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const cm = k => k === 1 ? "" : k === -1 ? "−" : S(k) + "·";        // coefficient before a substituted value
  const nz = (a, b) => { let v; do v = rnd(a, b); while (!v); return v; };
  const distinct = (n, a, b, not = []) => { const out = []; while (out.length < n) { const v = rnd(a, b); if (!out.includes(v) && !not.includes(v)) out.push(v); } return out; };
  const sys = (e1, e2, ask) => h("div", {}, "Sistem:", h("br"), "⎧ " + e1, h("br"), "⎩ " + e2, h("br"), ask);
  const pair = (x, y) => `(${S(x)}; ${S(y)})`;
  const isq = n => n >= 0 && Number.isInteger(Math.sqrt(n));
  const tq = (s, p, v = "t") => poly([[1, v + "²"], [-s, v], [p, ""]]);   // t² − st + p

  // two-digit numbers: brute-force tables, keep only conditions with exactly one answer
  const uniq = keyf => { const m = new Map(); for (let N = 10; N <= 99; N++) { const a = Math.floor(N / 10), b = N % 10, k = keyf(a, b, N); if (k == null) continue; if (!m.has(k)) m.set(k, []); m.get(k).push(N); } return [...m.entries()].filter(([, v]) => v.length === 1).map(([k, v]) => [k, v[0]]); };
  const D_SP = uniq((a, b) => a > b && b >= 1 ? (a + b) + "," + a * b : null);                       // sum, product, a > b
  const D_KP = uniq((a, b, N) => b >= 1 && N % (a + b) === 0 ? (N / (a + b)) + "," + a * b : null);    // N = k(a + b), ab = p
  const D_SQ = uniq((a, b) => b >= 1 && a !== b ? (a - b) + "," + (a * a + b * b) : null);            // a − b, a² + b²
  // Pythagorean triples (legs a < b, hypotenuse c)
  const TRI = []; for (const [a, b, c] of [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]]) for (let k = 1; k * c <= 50; k++) TRI.push([a * k, b * k, c * k]);

  const levels = [
    { id: "viyet", ad: "x + y və xy", izah: "x + y = s, xy = p olarsa, x və y — t² − st + p = 0 tənliyinin kökləridir (Viyet). Həllər: (t₁; t₂) və (t₂; t₁).",
      gen() {
        if (Math.random() < .6) {
          const [r1, r2] = distinct(2, -6, 9), s = r1 + r2, p = r1 * r2, hi = Math.max(r1, r2), lo = Math.min(r1, r2);
          const ask = pick(["xmax", "ylo", "dif"]);
          const [q, ans] = { xmax: ["x-in ala biləcəyi ən böyük qiymət?", hi], ylo: ["x > y olan həlldə y = ?", lo], dif: ["x > y olan həlldə x − y = ?", hi - lo] }[ask];
          return { text: sys(`x + y = ${S(s)}`, `xy = ${S(p)}`, q), answer: ans, show: S(ans), tol: 0.01,
            solution: `Viyet: x və y — ${tq(s, p)} = 0 tənliyinin kökləri: t = ${S(lo)}, t = ${S(hi)} (cəm ${S(s)}, hasil ${S(p)}). Həllər: ${pair(lo, hi)} və ${pair(hi, lo)}. Cavab: ${S(ans)}.` };
        }
        let x1, d; do { x1 = rnd(-6, 9); d = nz(-6, 6); } while (2 * x1 === d);
        const y1 = x1 - d, p = x1 * y1, x2 = d - x1, y2 = -x1, big = Math.random() < .5;
        const ans = big ? Math.max(x1, x2) : Math.abs(x1 + y1);
        return { text: sys(`x − y = ${S(d)}`, `xy = ${S(p)}`, big ? "x-in ala biləcəyi ən böyük qiymət?" : "x + y-in müsbət qiyməti?"), answer: ans, show: S(ans), tol: 0.01,
          solution: `y = ${poly([[1, "x"], [-d, ""]])} → x(${poly([[1, "x"], [-d, ""]])}) = ${S(p)} → ${tq(d, -p, "x")} = 0 → x = ${S(x1)}, x = ${S(x2)}. Həllər: ${pair(x1, y1)} və ${pair(x2, y2)}. ` + (big ? `Ən böyük x: ${S(ans)}.` : `x + y: ${S(x1 + y1)} və ${S(x2 + y2)}; müsbəti ${S(ans)}.`) };
      } },
    { id: "yerine", ad: "Yerinə qoyma", izah: "Xətti tənlikdən bir dəyişəni ifadə et, ikidərəcəli tənliyə qoy → kvadrat tənlik. D > 0 — iki həll, D = 0 — bir, D < 0 — yoxdur.",
      gen() {
        const kind = pick(["parab", "parab", "dif", "sum"]);
        if (kind === "parab") {
          const cs = pick(["two", "two", "one", "none"]), k = rnd(-3, 3);
          let B, C;
          if (cs === "two") { const [r1, r2] = distinct(2, -5, 5); B = -(r1 + r2); C = r1 * r2; }
          else if (cs === "one") { const r = rnd(-4, 4); B = -2 * r; C = r * r; }
          else { B = rnd(-4, 4); C = Math.floor(B * B / 4) + rnd(1, 6); }
          const b = B + k, c = rnd(-5, 5), m = c - C, D = B * B - 4 * C;
          const sys2 = [`y = ${poly([[1, "x²"], [b, "x"], [c, ""]])}`, `y = ${poly([[k, "x"], [m, ""]])}`];
          const step = `Sağ tərəfləri bərabərləşdir: ${poly([[1, "x²"], [b, "x"], [c, ""]])} = ${poly([[k, "x"], [m, ""]])} → ${poly([[1, "x²"], [B, "x"], [C, ""]])} = 0, D = ${B * B} ${4 * C < 0 ? "+" : "−"} ${Math.abs(4 * C)} = ${S(D)}.`;
          const n = D > 0 ? 2 : D === 0 ? 1 : 0;
          if (cs === "two" && Math.random() < .5) {
            const x1 = (-B - Math.sqrt(D)) / 2, x2 = (-B + Math.sqrt(D)) / 2, ans = x1 + x2;
            return { text: sys(...sys2, "Həllərdə x-lərin cəmini tap."), answer: ans, show: S(ans), tol: 0.01,
              solution: step + ` x = ${S(x1)}, x = ${S(x2)}; cəm ${S(ans)} (Viyetlə də: −(${S(B)}) = ${S(-B)}).` };
          }
          if (cs === "one" && Math.random() < .5) {
            const x0 = -B / 2, y0 = k * x0 + m;
            return { text: sys(...sys2, "Sistemin yeganə həllinin y-i nəyə bərabərdir?"), answer: y0, show: S(y0), tol: 0.01,
              solution: step + ` D = 0 → x = ${S(x0)} (xətt parabolaya toxunur). y = ${k ? cm(k) + P(x0) + (m ? (m < 0 ? " − " : " + ") + Math.abs(m) : "") : S(m)} = ${S(y0)}.` };
          }
          return { text: sys(...sys2, "Sistemin neçə həlli var?"), answer: n, show: String(n), tol: 0.01,
            solution: step + (n === 2 ? " D > 0 — iki kök, hər birinə bir y: 2 həll (xətt parabolanı iki nöqtədə kəsir)." : n === 1 ? " D = 0 — bir kök: 1 həll (xətt parabolaya toxunur)." : " D < 0 — kök yoxdur: 0 həll (xətt parabola ilə kəsişmir).") };
        }
        let x1, s; do { x1 = rnd(-7, 8); s = nz(-7, 8); } while (2 * x1 === s);
        const x2 = s - x1;  // for x + y = s: solutions (x1; s − x1), (x2; s − x2)
        if (kind === "sum") {
          const R = x1 * x1 + (s - x1) * (s - x1), xy = x1 * (s - x1), big = Math.random() < .5, ans = big ? Math.max(x1, x2) : xy;
          return { text: sys(`x + y = ${S(s)}`, `x² + y² = ${R}`, big ? "x-in ala biləcəyi ən böyük qiymət?" : "xy = ?"), answer: ans, show: S(ans), tol: 0.01,
            solution: `y = ${poly([[s, ""], [-1, "x"]])} → x² + (${poly([[s, ""], [-1, "x"]])})² = ${R} → 2x² ${s > 0 ? "−" : "+"} ${Math.abs(2 * s)}x + ${s * s - R < 0 ? "(" + S(s * s - R) + ")" : s * s - R} = 0 → ${tq(s, xy, "x")} = 0 → x = ${S(Math.min(x1, x2))}, x = ${S(Math.max(x1, x2))}. Həllər: ${pair(x1, s - x1)}, ${pair(x2, s - x2)}. ` + (big ? `Cavab: ${S(ans)}.` : `Hər iki həldə xy = ${S(xy)}. (Qısa yol: 2xy = (x + y)² − (x² + y²) = ${s * s} − ${R}.)`) };
        }
        // x − y = d: y1 any, y2 = −y1 − d
        let y1, d; do { y1 = rnd(-7, 7); d = nz(-6, 6); } while (2 * y1 === -d);
        const y2 = -y1 - d, R = (y1 + d) ** 2 + y1 * y1, xy = y1 * (y1 + d), big = Math.random() < .5, ans = big ? Math.max(y1 + d, y2 + d) : xy;
        return { text: sys(`x − y = ${S(d)}`, `x² + y² = ${R}`, big ? "x-in ala biləcəyi ən böyük qiymət?" : "xy = ?"), answer: ans, show: S(ans), tol: 0.01,
          solution: `x = ${poly([[1, "y"], [d, ""]])} → (${poly([[1, "y"], [d, ""]])})² + y² = ${R} → 2y² ${d < 0 ? "−" : "+"} ${Math.abs(2 * d)}y ${d * d - R < 0 ? "−" : "+"} ${Math.abs(d * d - R)} = 0 → ${poly([[1, "y²"], [d, "y"], [-xy, ""]])} = 0 → y = ${S(y1)}, y = ${S(y2)}. x = y ${d < 0 ? "−" : "+"} ${Math.abs(d)}: həllər ${pair(y1 + d, y1)}, ${pair(y2 + d, y2)}. ` + (big ? `Cavab: ${S(ans)}.` : `Hər iki həldə xy = ${S(xy)}. (Qısa yol: 2xy = (x² + y²) − (x − y)² = ${R} − ${d * d}.)`) };
      } },
    { id: "simmetrik", ad: "Simmetrik ifadələr", izah: "x² + y² = (x + y)² − 2xy;  (x − y)² = (x + y)² − 4xy;  x³ + y³ = (x + y)³ − 3xy(x + y). Sistemi həll etmədən hesabla.",
      gen() {
        const r1 = nz(-6, 7), r2 = nz(-6, 7), s = r1 + r2, p = r1 * r2;
        if (Math.random() < .2) { // x − y = d, xy = p → x² + y²
          const d = r1 - r2, v = d * d + 2 * p;
          return { text: `x − y = ${S(d)}, xy = ${S(p)}. x² + y² = ?`, answer: v, show: S(v), tol: 0.01,
            solution: `(x − y)² = x² + y² − 2xy → x² + y² = (x − y)² + 2xy = ${d * d} ${p < 0 ? "−" : "+"} ${Math.abs(2 * p)} = ${S(v)}.` };
        }
        const k = pick(["kv", "kv", "fq", "kub", "x2y", "ters", "nis"]);
        const ss = P(s), pp = P(p);
        const T = {
          kv: ["x² + y²", s * s - 2 * p, `x² + y² = (x + y)² − 2xy = ${ss}² − 2·${pp} = ${s * s} ${p < 0 ? "+" : "−"} ${Math.abs(2 * p)} = ${S(s * s - 2 * p)}.`],
          fq: ["(x − y)²", s * s - 4 * p, `(x − y)² = (x + y)² − 4xy = ${ss}² − 4·${pp} = ${s * s} ${p < 0 ? "+" : "−"} ${Math.abs(4 * p)} = ${S(s * s - 4 * p)}.`],
          kub: ["x³ + y³", s ** 3 - 3 * p * s, `x³ + y³ = (x + y)³ − 3xy(x + y) = ${ss}³ − 3·${pp}·${ss} = ${S(s ** 3)} ${3 * p * s < 0 ? "+" : "−"} ${Math.abs(3 * p * s)} = ${S(s ** 3 - 3 * p * s)}.`],
          x2y: ["x²y + xy²", p * s, `x²y + xy² = xy(x + y) = ${pp}·${ss} = ${S(p * s)}.`],
          ters: ["1/x + 1/y", s / p, `1/x + 1/y = (x + y)/(xy) = ${S(s)}/${pp} = ${frac(s, p)}.`],
          nis: ["x/y + y/x", (s * s - 2 * p) / p, `x/y + y/x = (x² + y²)/(xy) = (${ss}² − 2·${pp})/${pp} = ${S(s * s - 2 * p)}/${pp} = ${frac(s * s - 2 * p, p)}.`],
        }[k];
        const show = k === "ters" ? frac(s, p) : k === "nis" ? frac(s * s - 2 * p, p) : S(T[1]);
        return { text: `x + y = ${S(s)}, xy = ${S(p)}. ${T[0]} = ?`, answer: T[1], show, tol: 0.01, placeholder: k === "ters" || k === "nis" ? "məs. 5/6" : undefined,
          solution: T[2] + ` (Yoxlama: x, y = ${S(r1)} və ${S(r2)}.)` };
      } },
    { id: "ikiq", ad: "İki ikidərəcəli tənlik", izah: "x² və y²-ni naməlum kimi topla/çıx; x² − y² = (x − y)(x + y); x² + y² və xy-dən (x ± y)² tap. Kökaltında ± unutma!",
      gen() {
        const kind = pick(["ferq", "ferq", "kvkv", "kvxy"]);
        if (kind === "ferq") {
          let x0, y0; do { x0 = rnd(-6, 10); y0 = rnd(-6, 10); } while (Math.abs(x0) === Math.abs(y0));
          const minus = Math.random() < .5, B = minus ? x0 - y0 : x0 + y0, C = minus ? x0 + y0 : x0 - y0, A = x0 * x0 - y0 * y0, ax = Math.random() < .5;
          return { text: sys(`x² − y² = ${S(A)}`, `x ${minus ? "−" : "+"} y = ${S(B)}`, ax ? "x = ?" : "y = ?"), answer: ax ? x0 : y0, show: S(ax ? x0 : y0), tol: 0.01,
            solution: `x² − y² = (x − y)(x + y) → ${S(B)}·(x ${minus ? "+" : "−"} y) = ${S(A)} → x ${minus ? "+" : "−"} y = ${S(C)}. Xətti sistem: x − y = ${S(x0 - y0)}, x + y = ${S(x0 + y0)} → 2x = ${S(2 * x0)} → x = ${S(x0)}, y = ${S(y0)}.` };
        }
        if (kind === "kvkv") {
          const cs = pick(["4", "4", "2", "0"]);
          let u, v;
          if (cs === "4") { [u, v] = distinct(2, 1, 9).map(t => t * t); }
          else if (cs === "2") { u = rnd(1, 9) ** 2; v = 0; }
          else { u = rnd(10, 40); v = -rnd(1, 9); }
          const A = u + v, B = u - v, n = +cs, askMax = cs !== "0" && Math.random() < .4;
          const how = cs === "4" ? `x = ±${Math.sqrt(u)}, y = ±${Math.sqrt(v)} — hər x hər y ilə: 2·2 = 4 həll.` : cs === "2" ? `x = ±${Math.sqrt(u)}, y = 0 — 2 həll.` : `y² mənfi ola bilməz — həll yoxdur (0).`;
          return { text: sys(`x² + y² = ${S(A)}`, `x² − y² = ${S(B)}`, askMax ? "x-in ala biləcəyi ən böyük qiymət?" : "Sistemin neçə həlli var?"), answer: askMax ? Math.sqrt(u) : n, show: String(askMax ? Math.sqrt(u) : n), tol: 0.01,
            solution: `Topla: 2x² = ${A + B} → x² = ${u}. Çıx: 2y² = ${S(A - B)} → y² = ${S(v)}. ` + (askMax ? `x = ±${Math.sqrt(u)}; ən böyüyü ${Math.sqrt(u)}.` : how) };
        }
        const [r1, r2] = distinct(2, 1, 9), A = r1 * r1 + r2 * r2, B = r1 * r2, ask = pick(["sum", "max", "n"]);
        const sq = Math.sqrt(A + 2 * B), dq = Math.sqrt(A - 2 * B);
        const steps = `(x + y)² = x² + y² + 2xy = ${A} + ${2 * B} = ${A + 2 * B} → x + y = ±${sq}. (x − y)² = ${A} − ${2 * B} = ${A - 2 * B} → x − y = ±${dq}.`;
        const [q, ans, tail] = { sum: ["x > 0, y > 0 olan həllərdə x + y = ?", sq, ` Müsbət x, y üçün x + y = ${sq}.`], max: ["x-in ala biləcəyi ən böyük qiymət?", Math.max(r1, r2), ` x + y = ${sq}, x − y = ${dq} → x = ${Math.max(r1, r2)} (ən böyük).`],
          n: ["Sistemin neçə həlli var?", 4, ` İşarələrin 4 birləşməsi 4 həll verir: ${pair(r1, r2)}, ${pair(r2, r1)}, ${pair(-r1, -r2)}, ${pair(-r2, -r1)}.`] }[ask];
        return { text: sys(`x² + y² = ${A}`, `xy = ${B}`, q), answer: ans, show: String(ans), tol: 0.01, solution: steps + tail };
      } },
    { id: "reqem", ad: "İkirəqəmli ədəd", izah: "Ədəd 10a + b; rəqəmlər üçün iki şərt → sistem. Rəqəm 0…9 tam ədəddir, onluq rəqəmi 0 deyil.",
      gen() {
        const kind = pick(["sp", "kp", "sq"]);
        if (kind === "sp") {
          const [key, N] = pick(D_SP), [s, p] = key.split(",").map(Number), a = Math.floor(N / 10), b = N % 10;
          return { text: `İkirəqəmli ədədin rəqəmlərinin cəmi ${s}, hasili ${p} olur. Onluq rəqəmi təklik rəqəmindən böyükdür. Ədədi tap.`, answer: N, show: String(N), tol: 0.01,
            solution: `a + b = ${s}, ab = ${p} → a və b — ${tq(s, p)} = 0 tənliyinin kökləri: ${b} və ${a}. a > b → a = ${a}, b = ${b}. Ədəd: ${N}.` };
        }
        if (kind === "kp") {
          const [key, N] = pick(D_KP), [k, p] = key.split(",").map(Number), a = Math.floor(N / 10), b = N % 10;
          return { text: `İkirəqəmli ədəd öz rəqəmlərinin cəmindən ${k} dəfə böyükdür, rəqəmlərinin hasili isə ${p} olur. Ədədi tap.`, answer: N, show: String(N), tol: 0.01,
            solution: `10a + b = ${k}(a + b) → ${poly([[10 - k, "a"]])} = ${poly([[k - 1, "b"]])} → b = ${frac(10 - k, k - 1)}·a. ab = ${p} → ${frac(10 - k, k - 1)}·a² = ${p} → a² = ${a * a} → a = ${a} (rəqəm müsbətdir), b = ${b}. Ədəd: ${N}. Yoxla: ${N} = ${k}·${a + b} ✓.` };
        }
        const [key, N] = pick(D_SQ), [d, Q] = key.split(",").map(Number), a = Math.floor(N / 10), b = N % 10, M = 9 * Math.abs(d), b2 = -b - d;
        return { text: `İkirəqəmli ədədin rəqəmlərinin yerini dəyişsək, ədəd ${M} ${d > 0 ? "azalar" : "artar"}. Rəqəmlərin kvadratları cəmi ${Q} olur. Ədədi tap.`, answer: N, show: String(N), tol: 0.01,
          solution: `ab − ba = 9(a − b) = ${S(9 * d)} → a − b = ${S(d)}, a = ${poly([[1, "b"], [d, ""]])}. (${poly([[1, "b"], [d, ""]])})² + b² = ${Q} → ${poly([[1, "b²"], [d, "b"], [(d * d - Q) / 2, ""]])} = 0 → b = ${b} və b = ${S(b2)}. İkinci halda a = ${S(b2 + d)} — ikirəqəmli ədəd alınmır. Deməli b = ${b}, a = ${a}. Ədəd: ${N}. Yoxla: ${a * a} + ${b * b} = ${Q} ✓.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Düzbucaqlı: x + y = P/2, xy = S, x² + y² = d². Düzbucaqlı üçbucaq: katetlər x, y; x² + y² = c², sahə xy/2.",
      gen() {
        const kind = pick(["ps", "ps", "dp", "sd", "ucb", "eded"]);
        if (kind === "ps") {
          const [a, b] = distinct(2, 2, 20), hi = Math.max(a, b), lo = Math.min(a, b), Pm = 2 * (a + b), Ar = a * b, big = Math.random() < .5;
          return { text: `Düzbucaqlının perimetri ${Pm} sm, sahəsi ${Ar} sm²-dir. ${big ? "Böyük" : "Kiçik"} tərəfinin uzunluğunu tap.`, answer: big ? hi : lo, show: String(big ? hi : lo), tol: 0.01, unit: "sm",
            solution: `x + y = ${Pm}/2 = ${a + b}, xy = ${Ar} → x, y — ${tq(a + b, Ar)} = 0 tənliyinin kökləri: ${lo} və ${hi}. Tərəflər ${lo} sm və ${hi} sm. Yoxla: 2·(${lo} + ${hi}) = ${Pm}, ${lo}·${hi} = ${Ar} ✓.` };
        }
        const [a, b, c] = pick(TRI);
        if (kind === "dp") return { text: `Düzbucaqlının diaqonalı ${c} sm, perimetri ${2 * (a + b)} sm-dir. Düzbucaqlının sahəsini tap.`, answer: a * b, show: String(a * b), tol: 0.01, unit: "sm²",
          solution: `Tərəflər x, y: x + y = ${a + b}, x² + y² = ${c}² = ${c * c}. (x + y)² = x² + y² + 2xy → 2xy = ${(a + b) ** 2} − ${c * c} = ${2 * a * b} → sahə xy = ${a * b}. (Tərəflər ${a} və ${b}.)` };
        if (kind === "sd") return { text: `Düzbucaqlının sahəsi ${a * b} sm², diaqonalı ${c} sm-dir. Perimetrini tap.`, answer: 2 * (a + b), show: String(2 * (a + b)), tol: 0.01, unit: "sm",
          solution: `x² + y² = ${c * c}, xy = ${a * b}. (x + y)² = ${c * c} + 2·${a * b} = ${(a + b) ** 2} → x + y = ${a + b} (uzunluq müsbətdir). Perimetr: 2·${a + b} = ${2 * (a + b)}.` };
        if (kind === "ucb") {
          const Ar = a * b / 2, small = Math.random() < .5;
          return { text: `Düzbucaqlı üçbucağın hipotenuzu ${c} sm, sahəsi ${Ar} sm²-dir. ${small ? "Kiçik katetini tap." : "Perimetrini tap."}`, answer: small ? a : a + b + c, show: String(small ? a : a + b + c), tol: 0.01, unit: "sm",
            solution: `Katetlər x, y: x² + y² = ${c * c}, xy/2 = ${Ar} → xy = ${a * b}. (x + y)² = ${c * c} + ${2 * a * b} = ${(a + b) ** 2} → x + y = ${a + b}; (x − y)² = ${c * c} − ${2 * a * b} = ${(b - a) ** 2} → x − y = ${b - a}. Katetlər ${b} və ${a}. ` + (small ? `Kiçik katet: ${a}.` : `Perimetr: ${a} + ${b} + ${c} = ${a + b + c}.`) };
        }
        const [x, y] = distinct(2, 1, 20), hi = Math.max(x, y), lo = Math.min(x, y), d = hi - lo, Q = x * x + y * y, big = Math.random() < .5;
        return { text: `İki müsbət ədədin fərqi ${d}, kvadratlarının cəmi ${Q} olur. ${big ? "Böyük" : "Kiçik"} ədədi tap.`, answer: big ? hi : lo, show: String(big ? hi : lo), tol: 0.01,
          solution: `x − y = ${d}, x² + y² = ${Q}. x = y + ${d} → (y + ${d})² + y² = ${Q} → ${poly([[1, "y²"], [d, "y"], [(d * d - Q) / 2, ""]])} = 0 → y = ${lo} və y = ${S(-lo - d)} (mənfi — atılır). Ədədlər ${hi} və ${lo}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let r1, r2; do { r1 = nz(-6, 8); r2 = nz(-6, 8); } while (r1 === r2 || r1 === -r2);
        const s = r1 + r2, p = r1 * r2;
        let intro, steps, why;
        if (Math.random() < .5) { // x² + y² from x + y and xy
          intro = `x + y = ${S(s)}, xy = ${S(p)}. x² + y² = ?`;
          steps = ["(x + y)² = x² + 2xy + y².", "Deməli, x² + y² = (x + y)² − 2xy.", `x² + y² = ${P(s)}² − 2·${P(p)} = ${S(s * s - 2 * p)}.`];
          if (bad === 0) { steps = ["(x + y)² = x² + y².", "Deməli, x² + y² = (x + y)².", `x² + y² = ${P(s)}² = ${s * s}.`]; }
          if (bad === 1) { steps[1] = "Deməli, x² + y² = (x + y)² + 2xy."; steps[2] = `x² + y² = ${P(s)}² + 2·${P(p)} = ${S(s * s + 2 * p)}.`; }
          if (bad === 2) steps[2] = `x² + y² = ${P(s)}² − ${P(p)} = ${S(s * s - p)}.`;
          why = [`1-ci addım: (x + y)² = x² + 2xy + y² — ortadakı 2xy həddi itib.`, `2-ci addım: 2xy-ni sağa keçirəndə işarəsi dəyişir: x² + y² = (x + y)² − 2xy.`,
            `3-cü addım: 2xy yerinə 2·${P(p)} yazılmalıdır: ${s * s} ${p < 0 ? "+" : "−"} ${Math.abs(2 * p)} = ${S(s * s - 2 * p)}.`][bad];
        } else { // solve x + y = s, xy = p
          intro = `Sistemi həll et: x + y = ${S(s)}, xy = ${S(p)}.`;
          steps = [`x və y — ${tq(s, p)} = 0 tənliyinin kökləridir.`, `Köklər: ${S(r1)} və ${S(r2)}.`, `Həllər: ${pair(r1, r2)} və ${pair(r2, r1)}.`];
          if (bad === 0) { steps = [`x və y — ${tq(-s, p)} = 0 tənliyinin kökləridir.`, `Köklər: ${S(-r1)} və ${S(-r2)}.`, `Həllər: ${pair(-r1, -r2)} və ${pair(-r2, -r1)}.`]; }
          if (bad === 1) { steps[1] = `Köklər: ${S(-r1)} və ${S(-r2)}.`; steps[2] = `Həllər: ${pair(-r1, -r2)} və ${pair(-r2, -r1)}.`; }
          if (bad === 2) steps[2] = pick([`Həll: yalnız ${pair(r1, r2)}.`, `Həllər: ${pair(r1, r1)} və ${pair(r2, r2)}.`]);
          why = [`1-ci addım: Viyetə görə t² − (x + y)t + xy = 0, yəni ${tq(s, p)} = 0 — orta həddin işarəsi səhvdir.`,
            `2-ci addım: ${tq(s, p)} = 0-ın kökləri ${S(r1)} və ${S(r2)}-dir (cəm ${S(s)}, hasil ${S(p)}).`,
            `3-cü addım: x və y yerlərini dəyişə bilər — iki həll var: ${pair(r1, r2)} və ${pair(r2, r1)}.`][bad];
        }
        const text = h("div", {}, h("p", {}, intro), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
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
      key: "ikidereceli-sistem", title: "İkidərəcəli tənliklər sistemi", fenn: "riyaziyyat", link: "dersler/ikidereceli-sistem.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 5/6. Həllərin sayı soruşulanda — 0, 1, 2 və ya 4. Uzunluq vahidsiz: 12.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["viyet", "viyet", "yerine", "yerine", "simmetrik", "ikiq", "reqem", "reqem", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ikidereceli-sistem.html")) b.push("dersler/ikidereceli-sistem.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
