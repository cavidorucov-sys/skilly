// Tam üstlü qüvvət, ədədin standart şəkli — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const SUP = { "-": "⁻", "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹" };
  const sup = n => String(n).split("").map(c => SUP[c]).join("");
  const pw = (b, e) => b + sup(e);                                    // "2⁻³"
  const val = (a, k) => k >= 0 ? Math.pow(a, k) : 1 / Math.pow(a, -k);
  const valS = (a, k) => k >= 0 ? S(Math.pow(a, k)) : frac(1, Math.pow(a, -k));
  const ex = (e) => e < 0 ? "(" + S(e) + ")" : String(e);              // exponent inside a sum: 3 − (−2)

  // Numbers as integer pairs (M, E): value M·10^E, so nothing is lost to floating point.
  const norm = (M, E) => { while (M % 10 === 0 && M !== 0) { M /= 10; E++; } return [M, E]; };
  const order = (M, E) => { [M, E] = norm(M, E); return E + String(M).length - 1; };       // n in a·10ⁿ
  const mant = (M) => { M = norm(M, 0)[0]; const d = String(M); return d.length === 1 ? d : d[0] + "," + d.slice(1); };
  const mantV = (M) => { M = norm(M, 0)[0]; return M / Math.pow(10, String(M).length - 1); };
  const std = (M, E) => mant(M) + "·10" + sup(order(M, E));
  const group = s => s.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  function plain(M, E, grp = true) {                                    // decimal writing with comma
    [M, E] = norm(M, E); const d = String(M);
    if (E >= 0) return grp ? group(d + "0".repeat(E)) : d + "0".repeat(E);
    const L = d.length + E;
    return L > 0 ? (grp ? group(d.slice(0, L)) : d.slice(0, L)) + "," + d.slice(L) : "0," + "0".repeat(-L) + d;
  }
  const num = (M, E) => Number(plain(M, E, false).replace(",", "."));
  const relTol = v => Math.max(Math.abs(v) * 1e-6, 1e-12);
  const randM = () => { const s = pick([0, 1, 1, 2]); let M = rnd(1, 9); for (let i = 0; i < s; i++) M = M * 10 + (i === s - 1 ? rnd(1, 9) : rnd(0, 9)); return M; };

  const levels = [
    { id: "menfi", ad: "Mənfi və sıfır üst", izah: "a⁰ = 1, a⁻ⁿ = 1/aⁿ. Kəsrin mənfi üstü — kəsri çevir. Qiyməti tap.",
      gen() {
        const kind = pick(["int", "int", "frac", "neg", "dec", "combo", "zero"]);
        if (kind === "int") {
          const a = pick([2, 3, 4, 5, 10]), n = a <= 3 || a === 10 ? rnd(1, 4) : rnd(1, 3);
          return { text: `${pw(a, -n)} = ?`, answer: val(a, -n), show: valS(a, -n), placeholder: "məs. 1/8", tol: 1e-6,
            solution: `Mənfi üst — tərs ədəd: ${pw(a, -n)} = 1/${pw(a, n)} = 1/${Math.pow(a, n)}.` };
        }
        if (kind === "frac") {
          let p, q; do { p = rnd(1, 5); q = rnd(2, 6); } while (p === q || gcd(p, q) !== 1);
          const n = rnd(1, p === 1 ? 3 : 2);
          return { text: `(${p}/${q})${sup(-n)} = ?`, answer: Math.pow(q / p, n), show: frac(Math.pow(q, n), Math.pow(p, n)), tol: 1e-6,
            solution: `Kəsri çeviririk, üst müsbət olur: (${p}/${q})${sup(-n)} = (${q}/${p})${sup(n)} = ${frac(Math.pow(q, n), Math.pow(p, n))}.` };
        }
        if (kind === "neg") {
          const a = rnd(2, 5), n = rnd(2, 3), sg = n % 2 ? -1 : 1;
          return { text: `(−${a})${sup(-n)} = ?`, answer: sg / Math.pow(a, n), show: frac(sg, Math.pow(a, n)), tol: 1e-6,
            solution: `(−${a})${sup(-n)} = 1/(−${a})${sup(n)} = 1/${S(sg * Math.pow(a, n))}. Üst ${n % 2 ? "tək" : "cüt"}dir — işarə ${n % 2 ? "mənfi" : "müsbət"}. Cavab: ${frac(sg, Math.pow(a, n))}.` };
        }
        if (kind === "dec") {
          const [b, inv, f] = pick([["0,5", 2, "1/2"], ["0,2", 5, "1/5"], ["0,25", 4, "1/4"], ["0,1", 10, "1/10"]]), n = rnd(1, inv === 10 ? 3 : inv === 4 ? 3 : 4);
          return { text: `(${b})${sup(-n)} = ?`, answer: Math.pow(inv, n), show: String(Math.pow(inv, n)), tol: 0.01,
            solution: `${b} = ${f}. (${f})${sup(-n)} = ${inv}${sup(n)} = ${Math.pow(inv, n)}.` };
        }
        if (kind === "zero") {
          const a = rnd(2, 9), b = rnd(2, 9), c = rnd(2, 9), v = pick([0, 1, 2]);
          if (v === 0) return { text: `−${pw(a, 0)} + (−${b})${sup(0)} + ${c} = ?`, answer: c, show: String(c), tol: 0.01,
            solution: `−${pw(a, 0)} = −(${pw(a, 0)}) = −1, (−${b})${sup(0)} = 1. −1 + 1 + ${c} = ${c}.` };
          if (v === 1) return { text: `${c}·${pw(a, 0)} − ${pw(b, 0)} = ?`, answer: c - 1, show: String(c - 1), tol: 0.01,
            solution: `${pw(a, 0)} = 1, ${pw(b, 0)} = 1. ${c}·1 − 1 = ${c - 1}.` };
          return { text: `(1/${a})${sup(-2)} − ${pw(b, 0)} = ?`, answer: a * a - 1, show: String(a * a - 1), tol: 0.01,
            solution: `(1/${a})${sup(-2)} = ${a}² = ${a * a}, ${pw(b, 0)} = 1. ${a * a} − 1 = ${a * a - 1}.` };
        }
        let a, b; do { a = rnd(2, 6); b = rnd(2, 6); } while (a === b);
        const c = rnd(2, 9);
        return { text: `${pw(c, 0)} + ${pw(a, -1)} + ${pw(b, -1)} = ?`, answer: 1 + 1 / a + 1 / b, show: frac(a * b + a + b, a * b), tol: 1e-6,
          solution: `${pw(c, 0)} = 1, ${pw(a, -1)} = 1/${a}, ${pw(b, -1)} = 1/${b}. 1 + 1/${a} + 1/${b} = ${frac(a * b + a + b, a * b)}.` };
      } },
    { id: "xasse", ad: "Xassələr: qiyməti tap", izah: "Əsasları eyni et, üstləri topla/çıx/vur, sonra qiyməti hesabla.",
      gen() {
        const kind = pick(["same", "same", "powpow", "mix", "prod"]);
        if (kind === "same") {
          const a = pick([2, 3, 5, 10]), K = { 2: [-4, 5], 3: [-3, 4], 5: [-2, 3], 10: [-3, 4] }[a], k = rnd(K[0], K[1]);
          let p, q, r; do { p = rnd(-9, 9); q = rnd(-9, 9); r = p + q - k; } while (!p || !q || !r || Math.abs(r) > 12 || p === q);
          return { text: `${pw(a, p)} · ${pw(a, q)} : ${pw(a, r)} = ?`, answer: val(a, k), show: valS(a, k), tol: 1e-6,
            solution: `Əsas eynidir: ${S(p)} + ${ex(q)} − ${ex(r)} = ${S(k)}. ${pw(a, k)} = ${valS(a, k)}.` };
        }
        if (kind === "powpow") {
          const a = pick([2, 3, 10]), k = a === 2 ? rnd(-4, 5) : rnd(-3, 3);
          let p, q, r; do { p = rnd(-3, 3); q = rnd(-3, 3); r = k - p * q; } while (!p || !q || !r || Math.abs(r) > 12 || q === 1);
          return { text: `(${pw(a, p)})${sup(q)} · ${pw(a, r)} = ?`, answer: val(a, k), show: valS(a, k), tol: 1e-6,
            solution: `(${pw(a, p)})${sup(q)} = ${pw(a, p * q)} (üstlər vurulur). ${S(p * q)} + ${ex(r)} = ${S(k)}. ${pw(a, k)} = ${valS(a, k)}.` };
        }
        if (kind === "mix") {
          const two = Math.random() < .6, a = two ? 2 : 3;
          const B = two ? [["4", 2], ["8", 3], ["16", 4], ["(1/2)", -1], ["(1/4)", -2]] : [["9", 2], ["27", 3], ["(1/3)", -1], ["(1/9)", -2]];
          const k = two ? rnd(-3, 5) : rnd(-2, 3);
          let b1, b2, m, n, r; do { b1 = pick(B); b2 = pick(B); m = pick([-3, -2, -1, 2, 3]); n = pick([-2, -1, 1, 2, 3]); r = b1[1] * m + b2[1] * n - k; } while (b1 === b2 || !r || Math.abs(r) > 12);
          return { text: `${b1[0]}${sup(m)} · ${b2[0]}${sup(n)} : ${pw(a, r)} = ?`, answer: val(a, k), show: valS(a, k), tol: 1e-6,
            solution: `Hamısını ${a}-nin qüvvəti kimi yaz: ${b1[0]} = ${pw(a, b1[1])}, ${b2[0]} = ${pw(a, b2[1])}. Üst: ${S(b1[1] * m)} + ${ex(b2[1] * n)} − ${ex(r)} = ${S(k)}. ${pw(a, k)} = ${valS(a, k)}.` };
        }
        if (Math.random() < .5) {
          const [a, b] = pick([[2, 5], [4, 25], [20, 5], [2, 50], [25, 4]]), p = a * b, n = p === 100 ? rnd(-2, 2) : rnd(-3, 3), nn = n || 2;
          return { text: `${pw(a, nn)} · ${pw(b, nn)} = ?`, answer: val(p, nn), show: valS(p, nn), tol: 1e-9,
            solution: `Üstlər eynidir: aⁿ · bⁿ = (ab)ⁿ. ${pw(a, nn)} · ${pw(b, nn)} = ${pw(p, nn)} = ${valS(p, nn)}.` };
        }
        const q = rnd(2, 4), d = rnd(2, 5), c = q * d, n = pick([-3, -2, -1, 2, 3]);
        return { text: `${pw(c, n)} : ${pw(d, n)} = ?`, answer: val(q, n), show: valS(q, n), tol: 1e-6,
          solution: `aⁿ : bⁿ = (a/b)ⁿ. ${c}/${d} = ${q}, ${pw(q, n)} = ${valS(q, n)}.` };
      } },
    { id: "uslu", ad: "Üstü tap", izah: "Hər şeyi bir əsasa gətir və üstləri müqayisə et. k (və ya x) = ?",
      gen() {
        const kind = pick(["var", "base", "eq", "eq"]);
        if (kind === "var") {
          let p, q, r, s; do { p = rnd(-8, 8); q = rnd(-8, 8); r = rnd(-4, 4); s = pick([-3, -2, -1, 2, 3]); } while (!p || !q || !r);
          const k = p + q - r * s, v = pick(["x", "a", "b", "y"]);
          return { text: `${pw(v, p)} · ${pw(v, q)} : (${pw(v, r)})${sup(s)} = ${v}ᵏ (${v} ≠ 0). k = ?`, answer: k, show: S(k), tol: 0.01,
            solution: `(${pw(v, r)})${sup(s)} = ${pw(v, r * s)}. k = ${S(p)} + ${ex(q)} − ${ex(r * s)} = ${S(k)}.` };
        }
        if (kind === "base") {
          const m = rnd(-3, 4), n = rnd(-3, 3), r = pick([-2, -1, 1, 2, 3]), k = 2 * m + 3 * n - 4 * r;
          if (!m || !n) return this.gen();
          return { text: `${pw(4, m)} · ${pw(8, n)} : ${pw(16, r)} = 2ᵏ. k = ?`, answer: k, show: S(k), tol: 0.01,
            solution: `4 = 2², 8 = 2³, 16 = 2⁴. k = 2·${ex(m)} + 3·${ex(n)} − 4·${ex(r)} = ${S(2 * m)} + ${ex(3 * n)} − ${ex(4 * r)} = ${S(k)}.` };
        }
        const [a, R] = pick([[2, "1/2"], [3, "1/3"], [5, "1/5"], [10, "1/10"]]), k = rnd(-4, 4) || -2;
        const flip = Math.random() < .4;                         // base 1/a instead of a
        const right = a === 10 && k < 0 ? plain(1, k) : valS(a, k);
        const x = flip ? -k : k;
        return { text: `${flip ? "(" + R + ")" : a}ˣ = ${right}. x = ?`, answer: x, show: S(x), tol: 0.01,
          solution: `${right} = ${pw(a, k)}` + (flip ? `, (${R})ˣ = ${a}${sup("-")}ˣ. −x = ${S(k)}` : "") + `. x = ${S(x)}.` };
      } },
    { id: "standart", ad: "Standart şəkil", izah: "a·10ⁿ, burada 1 ≤ a < 10. Vergülü sürüşdür, neçə yer getdiyini say.",
      gen() {
        const kind = pick(["n", "n", "n", "a", "geri", "duzelt"]);
        if (kind === "geri") {
          const M = randM(), L = String(M).length, n = rnd(-4, 4) || 3, E = n - (L - 1), v = num(M, E);
          return { text: `${std(M, E)} ədədini onluq kəsr (və ya tam ədəd) kimi yaz.`, answer: v, show: plain(M, E, false), tol: relTol(v), placeholder: "məs. 0,035",
            solution: `10${sup(n)}-ə vurmaq — vergülü ${Math.abs(n)} yer ${n > 0 ? "sağa" : "sola"} sürüşdürməkdir: ${plain(M, E)}.` };
        }
        if (kind === "duzelt") {
          const M = randM(), L = String(M).length, n = rnd(-8, 9) || 5, E = n - (L - 1);
          const sh = pick([-3, -2, -1, 1, 2, 3]);                 // written as (a·10^sh)·10^(n−sh)
          const shown = plain(M, E - (n - sh)), m = n - sh;
          return { text: `${shown}·10${sup(m)} ədədini standart şəkildə yaz: a·10ⁿ. n = ?`, answer: n, show: S(n), tol: 0.01,
            solution: `${shown} = ${mant(M)}·10${sup(sh)} (1 ≤ a < 10 olsun). Sonra ${pw("10", sh)}·${pw("10", m)} = 10${sup(n)}. Cavab: ${std(M, E)}, n = ${S(n)}.` };
        }
        const M = randM(), L = String(M).length, n = pick([rnd(-9, -1), rnd(1, 10)]), E = n - (L - 1);
        const p = plain(M, E);
        const move = n > 0 ? `Vergül ${n} yer sola getdi (ədəd böyükdür) → n = ${n}.` : `Vergül ${-n} yer sağa getdi (ədəd 1-dən kiçikdir) → n = ${S(n)}.`;
        if (kind === "a") return { text: `${p} ədədini standart şəkildə yaz: a·10ⁿ. a = ?`, answer: mantV(M), show: mant(M), tol: 0.001,
          solution: `1 ≤ a < 10 olmalıdır: a = ${mant(M)}. ${move} ${p} = ${std(M, E)}.` };
        return { text: `${p} ədədini standart şəkildə yaz: a·10ⁿ. n = ?`, answer: n, show: S(n), tol: 0.01,
          solution: `a = ${mant(M)} (1 ≤ a < 10). ${move} ${p} = ${std(M, E)}.` };
      } },
    { id: "std-emel", ad: "Standart şəkildə əməllər", izah: "a-ları ayrıca, 10-un qüvvətlərini ayrıca hesabla, sonra nəticəni standart şəklə sal (1 ≤ a < 10).",
      gen() {
        const kind = pick(["mul", "mul", "div", "div", "sq", "sum"]), askA = Math.random() < .4;
        const fin = (text, M, E, steps) => {
          const n = order(M, E), r = std(M, E);
          return askA ? { text: text + " Nəticəni a·10ⁿ şəklində yaz. a = ?", answer: mantV(M), show: mant(M), tol: 0.001, solution: steps + ` Cavab: ${r}, a = ${mant(M)}.` }
            : { text: text + " Nəticəni a·10ⁿ şəklində yaz. n = ?", answer: n, show: S(n), tol: 0.01, solution: steps + ` Cavab: ${r}, n = ${S(n)}.` };
        };
        if (kind === "mul") {
          const M1 = norm(rnd(11, 99), 0)[0], M2 = pick([2, 3, 4, 5, 6, 8, 12, 15, 25]), n1 = rnd(-9, 12), n2 = rnd(-12, 9);
          const E1 = n1 - (String(norm(M1, 0)[0]).length - 1), E2 = n2 - (String(M2).length - 1);
          return fin(`(${std(M1, E1)}) · (${std(M2, E2)}).`, M1 * M2, E1 + E2,
            `${mant(M1)} · ${mant(M2)} = ${plain(M1 * M2, -(String(norm(M1, 0)[0]).length - 1) - (String(M2).length - 1))}, 10${sup(n1)} · 10${sup(n2)} = 10${sup(n1 + n2)}.`);
        }
        if (kind === "div") {
          const R = norm(rnd(11, 99), 0)[0], M2 = pick([2, 3, 4, 5, 6, 8, 12, 15, 25]), M1 = R * M2, n = rnd(-9, 9), n2 = rnd(-10, 10);
          const E2 = n2 - (String(M2).length - 1), ER = n - (String(norm(R, 0)[0]).length - 1), E1 = ER + E2;
          const n1 = order(M1, E1);
          return fin(`(${std(M1, E1)}) : (${std(M2, E2)}).`, R, ER,
            `${mant(M1)} : ${mant(M2)} = ${plain(R, -(String(norm(M1, 0)[0]).length - 1) + (String(M2).length - 1))}, 10${sup(n1)} : 10${sup(n2)} = 10${sup(n1 - n2)}.`);
        }
        if (kind === "sq") {
          const M = pick([2, 3, 4, 5, 6, 7, 8, 9, 12, 15, 25]), n = rnd(-6, 6) || 4, E = n - (String(M).length - 1), p = Math.random() < .7 ? 2 : 3;
          const MP = Math.pow(M, p), Ef = E * p;
          return fin(`(${std(M, E)})${sup(p)}.`, MP, Ef, `(${mant(M)})${sup(p)} = ${plain(MP, -(String(M).length - 1) * p)}, (10${sup(n)})${sup(p)} = 10${sup(n * p)}.`);
        }
        const a = rnd(1, 9), b = rnd(1, 9), n = rnd(-6, 8) || 3;
        return fin(`${a}·10${sup(n)} + ${b}·10${sup(n - 1)}.`, 10 * a + b, n - 1,
          `${a}·10${sup(n)} = ${10 * a}·10${sup(n - 1)}. ${10 * a} + ${b} = ${10 * a + b}, yəni ${10 * a + b}·10${sup(n - 1)}.`);
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let steps, why, bad = rnd(0, 2), head;
        if (Math.random() < .55) {
          const a = pick([2, 3]); let p, q, r, k;
          do { p = rnd(-5, -2); q = rnd(4, 7); r = rnd(-3, -1); k = p + q - r; } while (k < 1 || k > (a === 2 ? 5 : 3));
          head = `${pw(a, p)} · ${pw(a, q)} : ${pw(a, r)} ifadəsinin qiymətini tap.`;
          steps = [`${pw(a, p)} · ${pw(a, q)} = ${pw(a, p + q)}`, `${pw(a, p + q)} : ${pw(a, r)} = ${pw(a, k)}`, `${pw(a, k)} = ${Math.pow(a, k)}`];
          if (bad === 0) steps[0] = `${pw(a, p)} · ${pw(a, q)} = ${pw(a, p * q)}`;
          if (bad === 1) steps[1] = `${pw(a, p + q)} : ${pw(a, r)} = ${pw(a, p + q + r)}`;
          if (bad === 2) steps[2] = `${pw(a, k)} = 1/${Math.pow(a, k)}`;
          why = [`1-ci addım: vurmada üstlər toplanır: ${S(p)} + ${q} = ${p + q}, vurulmur.`,
            `2-ci addım: bölmədə üstlər çıxılır: ${p + q} − (${S(r)}) = ${k}.`,
            `3-cü addım: üst müsbətdir, ${pw(a, k)} = ${Math.pow(a, k)}. Düz cavab ${Math.pow(a, k)}.`][bad];
        } else {
          let M; do M = rnd(11, 99); while (M % 10 === 0); const n = rnd(-7, -2), E = n - 1, p = plain(M, E);
          head = `${p} ədədini standart şəkildə yaz.`;
          steps = [`a = ${mant(M)}, çünki 1 ≤ a < 10.`, `Vergül ${-n} yer sağa getdi, ədəd 1-dən kiçikdir → n = ${S(n)}.`, `${p} = ${std(M, E)}`];
          if (bad === 0) steps[0] = `a = ${M}, çünki rəqəmlər ${M}-dir.`;
          if (bad === 1) steps[1] = pick([`Vergül ${-n} yer sağa getdi → n = ${-n}.`, `Vergül ${-n + 1} yer sağa getdi → n = ${S(n - 1)}.`]);
          if (bad === 2) steps[2] = `${p} = ${mant(M)}·10${sup(-n)}`;
          why = [`1-ci addım: a = ${M} ola bilməz, 1 ≤ a < 10 lazımdır: a = ${mant(M)}.`,
            `2-ci addım: vergül ${-n} yer sağa gedir və ədəd 1-dən kiçikdir — üst mənfidir: n = ${S(n)}.`,
            `3-cü addım: n = ${S(n)} tapılıb, amma yazılışda üst müsbət olub. Düzü: ${std(M, E)}.`][bad];
        }
        const text = h("div", {}, h("p", {}, head), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Böyük və kiçik ədədlər standart şəkildə: a-ları ayrıca, 10-un qüvvətlərini ayrıca hesabla.",
      gen() {
        const kind = pick(["signal", "cell", "budget", "count"]);
        if (kind === "signal") {
          const t = rnd(2, 1500), M = 3 * t, E = 5;
          return { text: `Kosmik zond Yerdən ${std(M, E)} km uzaqdadır. Radio siqnalı 3·10⁵ km/s sürətlə gedir. Siqnal zonddan Yerə neçə saniyəyə çatar?`, answer: t, unit: "san", show: String(t), tol: 0.01,
            solution: `Vaxt = yol ÷ sürət = ${std(M, E)} : (3·10⁵) = ${plain(M, E)} : 300${" "}000 = ${t} saniyə.` };
        }
        if (kind === "cell") {
          const d = rnd(2, 9), e = pick([-6, -5]), c = rnd(2, 9), k = rnd(-2 - e, 2 - e), L = d * c, LE = e + k, v = num(L, LE);
          return { text: `Hüceyrənin diametri ${d}·10${sup(e)} m-dir. ${c}·10${sup(k)} belə hüceyrə bir sıraya yan-yana düzülüb. Sıranın uzunluğu neçə metrdir?`, answer: v, unit: "m", show: plain(L, LE, false), tol: relTol(v),
            solution: `${d}·10${sup(e)} · ${c}·10${sup(k)} = ${d * c}·10${sup(e + k)} m = ${plain(L, LE)} m.` };
        }
        if (kind === "budget") {
          const p = rnd(2, 9), per = rnd(2, 80) * 50, B = per * p;
          return { text: `Ölkənin illik büdcəsi ${std(B, 6)} manatdır, əhalisi ${p}·10⁶ nəfərdir. Hər sakinə orta hesabla neçə manat düşür?`, answer: per, unit: "manat", show: String(per), tol: 0.01,
            solution: `${std(B, 6)} : (${p}·10⁶) = ${plain(B, 6)} : ${plain(p, 6)} = ${per} manat.` };
        }
        const c = rnd(2, 9), j = rnd(20, 26), mm = rnd(2, 9), k = rnd(23, 26), MM = c * mm, ME = j - k, o = order(MM, ME), mass = o >= -3 && o <= 4 ? plain(MM, ME) : std(MM, ME);
        return { text: `Bir molekulun kütləsi ${mm}·10${sup(-k)} kq-dır. Qabdakı maddənin kütləsi ${mass} kq-dır. Qabda neçə molekul var? Cavabı a·10ⁿ şəklində yaz. n = ?`, answer: j, show: String(j), tol: 0.01,
          solution: `Say = ümumi kütlə ÷ bir molekulun kütləsi = ${std(MM, ME)} : (${mm}·10${sup(-k)}) = ${c}·10${sup(j)}. n = ${j}.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "tam-uslu-quvvet", title: "Tam üstlü qüvvət, ədədin standart şəkli", fenn: "riyaziyyat", link: "dersler/tam-uslu-quvvet.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 1/8, onluq 0,035 (vergül və ya nöqtə). Standart şəkil soruşulanda yalnız a və ya n-i yaz.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["menfi", "xasse", "xasse", "uslu", "standart", "standart", "std-emel", "std-emel", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/tam-uslu-quvvet.html")) b.push("dersler/tam-uslu-quvvet.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
