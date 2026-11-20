// Modullu tənliklər və bərabərsizliklər — mastery game levels (|f| = a, |f| = |g|, |f| = g, |f| ≤ a as a distance,
// |f| ≥ a, |x − a| + |x − b|, find the mistake, word problems) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
// Roots come from exact fractions and are re-checked; integer answers come from brute force with integer arithmetic.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const distinct = (n, a, b, not = []) => { const out = []; while (out.length < n) { const v = rnd(a, b); if (!out.includes(v) && !not.includes(v)) out.push(v); } return out; };
  const nz = (a, b) => { let v = 0; while (!v) v = rnd(a, b); return v; };
  const cmp = (a, op, b) => op === "<" ? a < b : op === ">" ? a > b : op === "≤" ? a <= b : a >= b;
  const ints = (f, a = -400, b = 400) => { const o = []; for (let x = a; x <= b; x++) if (f(x)) o.push(x); return o; };
  const sum = a => a.reduce((s, v) => s + v, 0);
  const list = a => a.length <= 8 ? a.map(S).join("; ") : a.slice(0, 3).map(S).join("; ") + "; …; " + a.slice(-2).map(S).join("; ");
  const R = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return [p / g, q / g]; };
  const val = r => r[0] / r[1];
  const radd = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const rf = r => frac(r[0], r[1]);
  const uniq = rs => { const o = []; for (const r of rs) if (!o.some(z => z[0] === r[0] && z[1] === r[1])) o.push(r); return o.sort((a, b) => val(a) - val(b)); };
  const lx = (k, b) => poly([[k, "x"], [-b, ""]]);            // k·x − b
  const M = (k, b) => "|" + lx(k, b) + "|";
  // ask about a finite set of rational roots
  function rootsQ(rs, kinds) {
    const k = rs.length ? pick(kinds) : "count";
    if (k === "count") return { q: "Tənliyin neçə kökü var?", answer: rs.length, show: String(rs.length), ex: `Köklərin sayı: ${rs.length}.` };
    if (k === "sum") { const s = rs.reduce(radd, [0, 1]); return { q: rs.length > 1 ? "Köklərin cəmini tap." : "Tənliyin kökünü tap.", answer: val(s), show: rf(s), ex: rs.length > 1 ? `Cəm: ${rs.map(rf).join(" + ")} = ${rf(s)}.` : `Kök: ${rf(s)}.` }; }
    const r = k === "max" ? rs[rs.length - 1] : rs[0];
    return { q: rs.length > 1 ? (k === "max" ? "Böyük kökü tap." : "Kiçik kökü tap.") : "Tənliyin kökünü tap.", answer: val(r), show: rf(r), ex: `Cavab: ${rf(r)}.` };
  }
  // ask about the integer solutions of a bounded inequality
  function intsQ(xs, lenR) {
    const o = xs.length ? ["count", "count", "sum", "min", "max"] : ["count"]; if (lenR && xs.length) o.push("len");
    const k = pick(o);
    if (k === "count") return { q: "Bərabərsizliyin neçə tam həlli var?", answer: xs.length, show: String(xs.length), ex: xs.length ? `Tam həllər: ${list(xs)} — cəmi ${xs.length}.` : "Tam həll yoxdur — cavab 0." };
    if (k === "sum") return { q: "Tam həllərinin cəmini tap.", answer: sum(xs), show: S(sum(xs)), ex: `Tam həllər: ${list(xs)}. Cəmi: ${S(sum(xs))}.` };
    if (k === "len") return { q: "Həll aralığının uzunluğunu tap.", answer: val(lenR), show: rf(lenR), ex: `Uzunluq: ${rf(lenR)}.` };
    const v = k === "min" ? xs[0] : xs[xs.length - 1];
    return { q: k === "min" ? "Ən kiçik tam həllini tap." : "Ən böyük tam həllini tap.", answer: v, show: S(v), ex: `${k === "min" ? "Ən kiçik" : "Ən böyük"} tam həll: ${S(v)}.` };
  }
  const fin = (text, a, pre) => ({ text: text + " " + a.q, answer: a.answer, show: a.show, tol: 0.01, solution: pre + " " + a.ex });
  const check = (rs, f) => { for (const r of rs) if (Math.abs(f(val(r))) > 1e-9) throw new Error("bad root " + rf(r)); return rs; };

  // number line with a segment [L; R] (both ends filled or both hollow), ticks at integers
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  function segment(L, Rr, closed) {
    const lo = L - 2, hi = Rr + 2, W = 300, y = 34, X = v => 16 + (v - lo) * 264 / (hi - lo);
    const g = sv("svg", { viewBox: `0 0 ${W} 64`, class: "oy-svg", role: "img", "aria-label": "Ədəd oxunda aralıq" });
    g.append(sv("line", { x1: X(L), y1: y, x2: X(Rr), y2: y, stroke: "var(--accent)", "stroke-width": 8, opacity: .45 }));
    g.append(sv("line", { x1: 6, y1: y, x2: W - 6, y2: y, stroke: "var(--ink)", "stroke-width": 2 }));
    g.append(sv("path", { d: `M${W - 6} ${y}l-9 -5v10z`, fill: "var(--ink)" }));
    for (let v = lo; v <= hi; v++) g.append(sv("line", { x1: X(v), y1: y - 4, x2: X(v), y2: y + 4, stroke: "var(--ink)", "stroke-width": 1.2 }));
    for (const v of [L, Rr]) {
      g.append(sv("circle", { cx: X(v), cy: y, r: 5.5, fill: closed ? "var(--accent)" : "var(--sheet)", stroke: "var(--accent)", "stroke-width": 2.5 }));
      g.append(sv("text", { x: X(v), y: y + 24, "text-anchor": "middle", class: "oy-lbl" }, S(v)));
    }
    return g;
  }

  const levels = [
    { id: "sade", ad: "|f(x)| = a", izah: "a > 0 — iki hal: f = a və ya f = −a. a = 0 — bir kök. a < 0 — kök yoxdur (modul mənfi olmur).",
      gen() {
        const kind = pick(["iki", "iki", "say", "ici"]);
        if (kind === "iki") {
          const k = pick([1, 1, 2, 3, 4, 5]), b = rnd(-9, 9), a = rnd(1, 9);
          const rs = check(uniq([R(b + a, k), R(b - a, k)]), x => Math.abs(k * x - b) - a);
          return fin(`${M(k, b)} = ${a}.`, rootsQ(rs, ["sum", "max", "min"]),
            `İki hal: ${lx(k, b)} = ${a} → x = ${rf(R(b + a, k))}; ${lx(k, b)} = −${a} → x = ${rf(R(b - a, k))}.`);
        }
        if (kind === "say") {
          const k = pick([1, 2, 3]), b = rnd(-9, 9), c = rnd(-6, 6), d = c + rnd(-4, 6), a = d - c;
          const rs = a < 0 ? [] : uniq([R(b + a, k), R(b - a, k)]);
          const text = c ? `${M(k, b)} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${S(d)}.` : `${M(k, b)} = ${S(d)}.`;
          return fin(text, { q: "Tənliyin neçə kökü var?", answer: rs.length, show: String(rs.length), ex: `Köklərin sayı: ${rs.length}.` },
            (c ? `${M(k, b)} = ${S(d)} ${c < 0 ? "+" : "−"} ${Math.abs(c)} = ${S(a)}. ` : "") +
            (a < 0 ? "Modul mənfi ədədə bərabər ola bilməz — kök yoxdur." : a === 0 ? `Modul sıfırdırsa, içi sıfırdır: ${lx(k, b)} = 0 — bir kök.` : `${S(a)} > 0 — iki hal, iki kök: ${rs.map(rf).join(" və ")}.`));
        }
        // ||x| − a| = b
        const a = rnd(1, 7), b = rnd(0, 7), vs = [...new Set([a + b, a - b])].filter(v => v >= 0);
        const rs = uniq(vs.flatMap(v => [R(v, 1), R(-v, 1)]));
        check(rs, x => Math.abs(Math.abs(x) - a) - b);
        const text = `||x| − ${a}| = ${b}.`;
        return fin(text, { q: "Tənliyin neçə kökü var?", answer: rs.length, show: String(rs.length), ex: `Köklər: ${rs.length ? rs.map(rf).join("; ") : "yoxdur"} — cəmi ${rs.length}.` },
          b === 0 ? `Xarici modul sıfırdır: |x| − ${a} = 0 → |x| = ${a}.` : `Xarici modulu aç: |x| − ${a} = ${b} və ya |x| − ${a} = −${b}, yəni |x| = ${a + b} və ya |x| = ${S(a - b)}.` + (a - b < 0 ? ` |x| = ${S(a - b)} mümkün deyil.` : a - b === 0 ? " |x| = 0 → bir kök x = 0." : ""));
      } },
    { id: "iki", ad: "|f| = |g| və |f| = g", izah: "|f| = |g| ⇔ f = g və ya f = −g. |f| = g(x) olanda hər kökü yoxla: g(x) ≥ 0 olmalıdır.",
      gen() {
        const kind = pick(["eyni", "ferq", "ferq", "g", "g"]);
        if (kind === "eyni") {
          const [a, b] = distinct(2, -9, 9), r = R(a + b, 2);
          return { text: `${M(1, a)} = ${M(1, b)}. Tənliyin kökünü tap.`, answer: val(r), show: rf(r), tol: 0.01,
            solution: `Ədəd oxunda ${S(a)} və ${S(b)} nöqtələrindən eyni məsafədə olan nöqtə — onların ortası: (${S(a)} + ${S(b)})/2 = ${rf(r)}. (${lx(1, a)} = −(${lx(1, b)}) halından; ${lx(1, a)} = ${lx(1, b)} halının kökü yoxdur.)` };
        }
        if (kind === "ferq") {
          let k1, k2, r1, r2, b1, b2;
          do { [k1, k2] = distinct(2, 1, 5); [r1, r2] = distinct(2, -6, 6); b1 = (r1 * (k1 - k2) + r2 * (k1 + k2)) / 2; b2 = b1 - r1 * (k1 - k2); } while (!Number.isInteger(b1));
          const rs = check(uniq([R(b1 - b2, k1 - k2), R(b1 + b2, k1 + k2)]), x => Math.abs(k1 * x - b1) - Math.abs(k2 * x - b2));
          return fin(`${M(k1, b1)} = ${M(k2, b2)}.`, rootsQ(rs, ["sum", "max", "min", "count"]),
            `${lx(k1, b1)} = ${lx(k2, b2)} → x = ${rf(R(b1 - b2, k1 - k2))}; ${lx(k1, b1)} = −(${lx(k2, b2)}) → ${poly([[k1 + k2, "x"]])} = ${S(b1 + b2)} → x = ${rf(R(b1 + b2, k1 + k2))}.`);
        }
        // |x − a| = k·x + b
        const a = rnd(-6, 6), k = pick([2, 3, -2, -3]), b = rnd(-8, 8);
        const c1 = R(a + b, 1 - k), c2 = R(a - b, 1 + k), ok = r => k * r[0] + b * r[1] >= 0;
        const rs = check(uniq([c1, c2].filter(ok)), x => Math.abs(x - a) - (k * x + b));
        const g = poly([[k, "x"], [b, ""]]), w = r => `${rf(r)}: ${g} = ${rf(R(k * r[0] + b * r[1], r[1]))}${ok(r) ? " ≥ 0 — yarayır" : " < 0 — atılır"}`;
        return fin(`${M(1, a)} = ${g}.`, rootsQ(rs, ["count", "sum"]),
          `Sağ tərəf modula bərabərdir, deməli ${g} ≥ 0 olmalıdır. Hal 1: ${lx(1, a)} = ${g} → x = ${rf(c1)}. Hal 2: ${lx(1, a)} = −(${g}) → x = ${rf(c2)}. Yoxlama — ${w(c1)}; ${w(c2)}.`);
      } },
    { id: "kicik", ad: "|f| ≤ a — məsafə", izah: "|x − a| ≤ b: x nöqtəsi a-dan ən çox b məsafədədir → a − b ≤ x ≤ a + b. |f| < a ⇔ −a < f < a.",
      gen() {
        const kind = pick(["sade", "sade", "mesafe", "halqa", "neg"]);
        if (kind === "mesafe") {
          const L = rnd(-8, 4), Rr = L + rnd(2, 10), closed = Math.random() < .6, wantA = Math.random() < .5;
          const c = R(L + Rr, 2), r = R(Rr - L, 2), ans = wantA ? c : r;
          return { text: `Şəkildəki aralıq |x − a| ${closed ? "≤" : "<"} b bərabərsizliyinin həllidir. ${wantA ? "a" : "b"} = ?`, svg: segment(L, Rr, closed), answer: val(ans), show: rf(ans), tol: 0.01,
            solution: `a — aralığın ortası: (${S(L)} + ${S(Rr)})/2 = ${rf(c)}. b — ortadan uca qədər məsafə (yarım uzunluq): (${S(Rr)} − ${L < 0 ? "(" + S(L) + ")" : S(L)})/2 = ${rf(r)}. Cavab: ${rf(ans)}.` };
        }
        if (kind === "neg") {
          const a = rnd(-8, 8), c = rnd(1, 6), strict = Math.random() < .5;
          if (strict) return { text: `${M(1, a)} < ${Math.random() < .5 ? "−" + c : "0"}. Bərabərsizliyin neçə həlli var?`, answer: 0, show: "0", tol: 0.01, solution: "Modul mənfi ola bilməz, ona görə o, mənfi ədəddən (və ya sıfırdan) kiçik ola bilməz. Həll yoxdur — 0." };
          return { text: `${M(1, a)} ≤ 0. Bərabərsizliyin neçə həlli var?`, answer: 1, show: "1", tol: 0.01, solution: `Modul ≥ 0, ona görə yalnız ${M(1, a)} = 0 ola bilər: x = ${S(a)}. Bir həll.` };
        }
        if (kind === "halqa") {
          const a = rnd(-6, 6), b = rnd(1, 4), c = b + rnd(1, 4), o1 = pick(["<", "≤"]), o2 = pick(["<", "≤"]);
          const xs = ints(x => cmp(b, o1, Math.abs(x - a)) && cmp(Math.abs(x - a), o2, c));
          return fin(`${b} ${o1} ${M(1, a)} ${o2} ${c}.`, intsQ(xs),
            `x ilə ${S(a)} arasındakı məsafə d = ${M(1, a)} üçün ${b} ${o1} d ${o2} ${c}. İki parça: ${S(a - c)} ${o2} x ${o1} ${S(a - b)} və ${S(a + b)} ${o1} x ${o2} ${S(a + c)}.`);
        }
        const k = pick([1, 1, 2, 3, 4]), b = rnd(-9, 9), a = rnd(1, 9), op = pick(["<", "≤"]);
        const xs = ints(x => cmp(Math.abs(k * x - b), op, a));
        return fin(`${M(k, b)} ${op} ${a}.`, intsQ(xs, R(2 * a, k)),
          `−${a} ${op} ${lx(k, b)} ${op} ${a}` + (b ? ` → ${S(b - a)} ${op} ${poly([[k, "x"]])} ${op} ${S(b + a)}` : "") + (k > 1 ? ` → ${rf(R(b - a, k))} ${op} x ${op} ${rf(R(b + a, k))}` : "") + ".");
      } },
    { id: "boyuk", ad: "|f| ≥ a", izah: "|f| > a ⇔ f < −a və ya f > a: iki şüa. Arada qalan ədədlər həll deyil.",
      gen() {
        const k = pick([1, 1, 2, 3]), b = rnd(-9, 9), a = rnd(1, 8), op = pick([">", "≥"]);
        const f = x => cmp(Math.abs(k * x - b), op, a), xs = ints(f), non = ints(x => !f(x));
        const o2 = op === ">" ? "<" : "≤";
        const pre = `${lx(k, b)} ${o2} −${a} və ya ${lx(k, b)} ${op} ${a} → x ${o2} ${rf(R(b - a, k))} və ya x ${op} ${rf(R(b + a, k))}.`;
        const kind = pick(["not", "not", "pos", "neg"]);
        if (kind === "not") return { text: `${M(k, b)} ${op} ${a}. Neçə tam ədəd bu bərabərsizliyin həlli deyil?`, answer: non.length, show: String(non.length), tol: 0.01,
          solution: `${pre} Arada qalan tam ədədlər həll deyil: ${list(non)} — cəmi ${non.length}.` };
        if (kind === "pos") { const v = xs.find(x => x > 0); return { text: `${M(k, b)} ${op} ${a}. Ən kiçik müsbət tam həllini tap.`, answer: v, show: S(v), tol: 0.01, solution: `${pre} Ən kiçik müsbət tam həll: ${S(v)}.` }; }
        const v = xs.filter(x => x < 0).pop();
        return { text: `${M(k, b)} ${op} ${a}. Ən böyük mənfi tam həllini tap.`, answer: v, show: S(v), tol: 0.01, solution: `${pre} Ən böyük mənfi tam həll: ${S(v)}.` };
      } },
    { id: "cem", ad: "|x − a| + |x − b|", izah: "Bu, x-dən a və b nöqtələrinə qədər məsafələrin cəmidir. a ilə b arasında o, sabitdir və |a − b|-yə bərabərdir — bu, ən kiçik qiymətdir.",
      gen() {
        const [a, b] = distinct(2, -8, 8).sort((u, v) => u - v), d = b - a, e = `${M(1, a)} + ${M(1, b)}`, kind = pick(["min", "eq", "eq", "eqd", "ineq", "ineq"]);
        const pre = `${e} — x nöqtəsindən ${S(a)} və ${S(b)} nöqtələrinə qədər məsafələrin cəmi. ${S(a)} ≤ x ≤ ${S(b)} olanda bu cəm sabitdir və ${d} ədədinə bərabərdir, kənarda daha böyükdür.`;
        if (kind === "min") return { text: `${e} ifadəsinin ən kiçik qiymətini tap.`, answer: d, show: String(d), tol: 0.01, solution: `${pre} Ən kiçik qiymət: ${S(b)} − ${a < 0 ? "(" + S(a) + ")" : S(a)} = ${d}.` };
        if (kind === "eqd") {
          const xs = ints(x => Math.abs(x - a) + Math.abs(x - b) === d);
          return { text: `${e} = ${d}. Tənliyin neçə tam kökü var?`, answer: xs.length, show: String(xs.length), tol: 0.01,
            solution: `${pre} Ona görə ${S(a)} ≤ x ≤ ${S(b)} parçasının hər nöqtəsi kökdür (sonsuz sayda kök). Tam köklər: ${list(xs)} — cəmi ${xs.length}.` };
        }
        if (kind === "eq") {
          const c = d + rnd(-3, 8);
          if (c < d) return { text: `${e} = ${c}. Tənliyin neçə kökü var?`, answer: 0, show: "0", tol: 0.01, solution: `${pre} ${c} < ${d} — məsafələrin cəmi bu qədər kiçik ola bilməz. Kök yoxdur — 0.` };
          if (c === d) return { text: `${e} = ${c}. Tənliyin neçə tam kökü var?`, answer: d + 1, show: String(d + 1), tol: 0.01, solution: `${pre} Ona görə [${S(a)}; ${S(b)}] parçasının hər nöqtəsi kökdür. Tam köklər: ${d + 1}.` };
          const rs = check(uniq([R(a + b - c, 2), R(a + b + c, 2)]), x => Math.abs(x - a) + Math.abs(x - b) - c);
          return fin(`${e} = ${c}.`, rootsQ(rs, ["sum", "max", "min", "count"]),
            `${pre} x < ${S(a)} olanda modullar "−" ilə açılır: ${poly([[a + b, ""], [-2, "x"]])} = ${c} → x = ${rf(rs[0])}. x > ${S(b)} olanda "+" ilə: ${poly([[2, "x"], [-(a + b), ""]])} = ${c} → x = ${rf(rs[1])}.`);
        }
        const c = d + rnd(0, 8), op = pick(["<", "≤"]);
        const xs = ints(x => cmp(Math.abs(x - a) + Math.abs(x - b), op, c));
        return fin(`${e} ${op} ${c}.`, intsQ(xs),
          `${pre} ${c === d ? "" : `Sərhədlər: ${e} = ${c} → x = ${frac(a + b - c, 2)} və x = ${frac(a + b + c, 2)}. `}${c === d && op === "<" ? `Cəm heç vaxt ${d} ədədindən kiçik olmur — həll ∅ (boşdur), cavab 0.` : `Həll: ${frac(a + b - c, 2)} ${op} x ${op} ${frac(a + b + c, 2)}.`}`);
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində ilk səhv var. Hansında?",
      gen() {
        const k = rnd(2, 5), c = nz(-9, 9), b = rnd(1, 9), L = R(c - b, k), Rr = R(c + b, k);
        const st = [`−${b} < ${lx(k, c)} < ${b}`, `${S(c - b)} < ${k}x < ${S(c + b)}`, `Cavab: (${rf(L)}; ${rf(Rr)})`];
        const bad = rnd(0, 2);
        if (bad === 0) { st[0] = `${lx(k, c)} < −${b} və ya ${lx(k, c)} > ${b}`; st[1] = `${k}x < ${S(c - b)} və ya ${k}x > ${S(c + b)}`; st[2] = `Cavab: (−∞; ${rf(L)}) ∪ (${rf(Rr)}; +∞)`; }
        if (bad === 1) { st[1] = `${S(-b - c)} < ${k}x < ${S(b - c)}`; st[2] = `Cavab: (${rf(R(-b - c, k))}; ${rf(R(b - c, k))})`; }
        if (bad === 2) st[2] = `Cavab: [${rf(L)}; ${rf(Rr)}]`;
        const text = h("div", {}, h("p", {}, `Bərabərsizlik: ${M(k, c)} < ${b}.`), h("ol", { class: "oy-steps" }, ...st.map(s => h("li", {}, s))));
        const why = [`1-ci addım: "|f| < ${b}" ikiqat bərabərsizlikdir: −${b} < f < ${b}. "Və ya" ilə iki şüa "|f| > ${b}" üçündür.`,
          `2-ci addım: hər hissəyə ${S(c)} əlavə olunmalıdır, çünki ${lx(k, c)} + (${S(c)}) = ${k}x. Düzü: ${S(c - b)} < ${k}x < ${S(c + b)}.`,
          `3-cü addım: bərabərsizlik ciddidir (<), uclar daxil deyil — mötərizələr dairəvi olmalıdır: (${rf(L)}; ${rf(Rr)}).`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "\"Fərq ən çox d\" — |x − a| ≤ d. \"Məsafə\" — modul. Məsafələrin cəmi — |x − a| + |x − b|.",
      gen() {
        const kind = pick(["temp", "eded", "eded", "yol"]);
        if (kind === "temp") {
          const T = rnd(18, 24), d = rnd(2, 5), strict = Math.random() < .4, n = strict ? 2 * d - 1 : 2 * d + 1;
          return { text: `Otaqda temperatur ${T}°C-dən ${strict ? `${d}°-dən az fərqlənməlidir` : `ən çox ${d}° fərqlənə bilər`}. Termometr yalnız tam dərəcələri göstərir. O, neçə müxtəlif qiymət göstərə bilər?`, answer: n, show: String(n), tol: 0.01,
            solution: `|t − ${T}| ${strict ? "<" : "≤"} ${d} → ${T - d} ${strict ? "<" : "≤"} t ${strict ? "<" : "≤"} ${T + d}. Tam qiymətlər: ${strict ? T - d + 1 : T - d}; …; ${strict ? T + d - 1 : T + d} — cəmi ${n}.` };
        }
        if (kind === "eded") {
          const a = rnd(3, 20), both = Math.random() < .5;
          if (both) {
            const b = rnd(1, a - 1);
            return { text: `Elvin natural ədəd fikirləşdi. Bu ədəd ilə ${a} ədədinin fərqinin modulu ${b} ədədinə bərabərdir. Elvinin fikirləşə biləcəyi ədədlərin cəmini tap.`, answer: 2 * a, show: String(2 * a), tol: 0.01,
              solution: `|x − ${a}| = ${b} → x = ${a + b} və ya x = ${a - b}. İkisi də naturaldır. Cəm: ${a + b} + ${a - b} = ${2 * a}.` };
          }
          const b = rnd(a, a + 12);
          return { text: `Elvin natural ədəd fikirləşdi. Bu ədəd ilə ${a} ədədinin fərqinin modulu ${b} ədədinə bərabərdir. Elvin hansı ədədi fikirləşib?`, answer: a + b, show: String(a + b), tol: 0.01,
            solution: `|x − ${a}| = ${b} → x = ${a + b} və ya x = ${S(a - b)}. ${S(a - b)} natural deyil. Cavab: ${a + b}.` };
        }
        let a, b, c; do { [a, b] = distinct(2, 10, 60).sort((u, v) => u - v); c = (b - a) + 2 * rnd(1, 8) + (Math.random() < .5 ? 1 : 0); } while (a + b - c < 0);
        const xs = ints(x => Math.abs(x - a) + Math.abs(x - b) <= c, 0, 200);
        return { text: `Yolda kilometr nişanları ${a} və ${b} olan yerlərdə avtobus dayanacaqları var. Kafe yol kənarında elə tam kilometr nişanında tikilməlidir ki, ondan iki dayanacağa qədər məsafələrin cəmi ${c} km-dən çox olmasın. Neçə yer uyğundur?`, answer: xs.length, show: String(xs.length), tol: 0.01,
          solution: `|x − ${a}| + |x − ${b}| ≤ ${c}. Dayanacaqlar arasındakı hər nöqtədə cəm ${b - a} km olur (uyğundur). Sərhədlər: 2x − ${a + b} = ${c} → x = ${frac(a + b + c, 2)}; ${a + b} − 2x = ${c} → x = ${frac(a + b - c, 2)}. Tam nişanlar: ${xs[0]}; …; ${xs[xs.length - 1]} — cəmi ${xs.length}.` };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): 6 closed (A–E) + 3 coded + 1 written. The wrong options are the answers of
  // typical mistakes (an extraneous root kept, only one case taken, the inequality read as "≤", the point not the distance, ...).
  const { ae, again } = Oyun;
  const D = x => { const r = Math.round(x * 100) / 100; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  const half = x => Number.isFinite(x) && Math.abs(x * 2 - Math.round(x * 2)) < 1e-9;
  const DAT = { 2: "2-yə", 3: "3-ə", 4: "4-ə" };
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const xm = c => c === 0 ? "x" : c < 0 ? "x + " + (-c) : "x − " + c;           // x − c, written with the sign of c
  const barX = (c, op, r) => `|${xm(c)}| ${op} ${r}`;
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. |kx − b| = c, sum of the roots
    { tip: "qapali", gen: () => again(() => {
      const k = pick([2, 3, 4]), [r1, r2] = distinct(2, -7, 7);
      if ((k * (r1 + r2)) % 2 || r1 + r2 === 0) return null;
      const b = k * (r1 + r2) / 2, c = Math.abs(k * (r1 - r2) / 2), hi = Math.max(r1, r2), lo = Math.min(r1, r2);
      return mc(ae(r1 + r2, [hi, lo, 2 * b, hi - lo], S), { text: `${M(k, b)} = ${c} tənliyinin köklərinin cəmini tapın.`,
        solution: `İki hal: ${lx(k, b)} = ${c} → x = ${S(hi)}; ${lx(k, b)} = −${c} → x = ${S(lo)}. Cəm: ${S(hi)} + ${lo < 0 ? `(${S(lo)})` : S(lo)} = ${S(r1 + r2)}. Tələlər: yalnız bir hal (${S(hi)} və ya ${S(lo)}), ${k}x-ə görə cəm (${S(2 * b)}) — ${DAT[k]} bölməyi unutmaq, köklərin fərqi (${S(hi - lo)}).` });
    }) },
    // 2. |x − a| = kx + b: one candidate is extraneous
    { tip: "qapali", gen: () => again(() => {
      const a = rnd(-9, 9), k = pick([2, 3, -2, -3]), b = rnd(-9, 9), c1 = (a + b) / (1 - k), c2 = (a - b) / (1 + k);
      if (!Number.isInteger(c1) || !Number.isInteger(c2) || c1 === c2) return null;
      const ok = c => k * c + b >= 0; if (ok(c1) === ok(c2)) return null;
      const v = ok(c1) ? c1 : c2, bad = ok(c1) ? c2 : c1; if (v === 0) return null;
      const s1 = (a + b) / (1 + k), s2 = (a - b) / (1 - k); if (![s1, s2].every(half)) return null;
      const g = poly([[k, "x"], [b, ""]]);
      return mc(ae(v, [c1 + c2, bad, s1, s2], D), { text: `${M(1, a)} = ${g} tənliyinin köklərinin cəmini tapın.`,
        solution: `Sağ tərəf modula bərabərdir, deməli ${g} ≥ 0 olmalıdır. Hal 1: ${lx(1, a)} = ${g} → x = ${S(c1)}. Hal 2: ${lx(1, a)} = −(${g}) → x = ${S(c2)}. Yoxlama: x = ${S(bad)} üçün ${g} = ${S(k * bad + b)} < 0 — kənar kökdür, atılır. Tək kök ${S(v)}. Tələlər: yoxlamamaq (cəm ${S(c1 + c2)}), kənar kökü cavab yazmaq (${S(bad)}), b-nin işarəsini səhv yazmaq (${D(s1)}; ${D(s2)}).` });
    }) },
    // 3. |kx − b| < a: number of integer solutions
    { tip: "qapali", gen: () => again(() => {
      const k = pick([2, 3, 4]), m = rnd(2, 6), c = rnd(-4, 5), a = k * m, b = k * c, L = c - m, Rr = c + m;
      return mc(ae(2 * m - 1, [2 * m + 1, 2 * k * m - 1, 2 * m, 2 * k * m + 1], S), { text: `${M(k, b)} < ${a} bərabərsizliyinin neçə tam həlli var?`,
        solution: `−${a} < ${lx(k, b)} < ${a} → ${S(b - a)} < ${k}x < ${S(b + a)} → ${S(L)} < x < ${S(Rr)}. Ciddi bərabərsizlik: uclar daxil deyil, tam həllər ${S(L + 1)}; …; ${S(Rr - 1)} — cəmi ${2 * m - 1}. Tələlər: uclarını da saymaq (${2 * m + 1}), ${DAT[k]} bölməmək (${2 * k * m - 1}), ucları çıxmaq əvəzinə fərqi cavab yazmaq (${2 * m}).` });
    }) },
    // 4. |x − a| + |x − b|: the least value
    { tip: "qapali", gen: () => again(() => {
      const s = pick([1, -1]), [u, v] = distinct(2, 1, 9).map(t => s * t), d = Math.abs(u - v), lo = Math.min(u, v), hi = Math.max(u, v);
      if (d % 2) return null;
      return mc(ae(d, [Math.abs(u) + Math.abs(v), 0, Math.max(Math.abs(u), Math.abs(v)), d / 2], S), { text: `${M(1, u)} + ${M(1, v)} ifadəsinin ən kiçik qiymətini tapın.`,
        solution: `Bu, x nöqtəsindən ${S(u)} və ${S(v)} nöqtələrinə qədər məsafələrin cəmidir. ${S(lo)} ilə ${S(hi)} arasında o sabitdir və nöqtələr arasındakı məsafəyə bərabərdir: ${S(hi)} − (${S(lo)}) = ${d}. Tələlər: x = 0 yazmaq (${Math.abs(u) + Math.abs(v)}), "iki modul eyni anda sıfır ola bilər" demək (0), nöqtələrdən birinə qədər olan məsafəni götürmək (${Math.max(Math.abs(u), Math.abs(v))}), məsafənin yarısı (${d / 2}).` });
    }) },
    // 5. |ax + b| = |cx + d|: sum of the roots
    { tip: "qapali", gen: () => again(() => {
      const [a, c] = distinct(2, 1, 5), [r1, r2] = distinct(2, -6, 6), t = (a + c) * r2, u = (a - c) * r1;
      if ((t + u) % 2 || r1 + r2 === 0) return null;
      const b = -(t + u) / 2, d = (-t + u) / 2;
      if (Math.abs(a * r1 + b) !== Math.abs(c * r1 + d) || Math.abs(a * r2 + b) !== Math.abs(c * r2 + d)) return null;
      return mc(ae(r1 + r2, [r1, r2, r1 - r2, -(r1 + r2)], S), { text: `${M(a, -b)} = ${M(c, -d)} tənliyinin köklərinin cəmini tapın.`,
        solution: `Hal 1: ${lx(a, -b)} = ${lx(c, -d)} → x = ${S(r1)}. Hal 2: ${lx(a, -b)} = −(${lx(c, -d)}) → x = ${S(r2)}. Cəm: ${S(r1)} + ${r2 < 0 ? `(${S(r2)})` : S(r2)} = ${S(r1 + r2)}. Tələlər: yalnız bir hal (${S(r1)} və ya ${S(r2)}), köklərin fərqi (${S(r1 - r2)}), cəmin işarəsini dəyişmək (${S(-(r1 + r2))}).` });
    }) },
    // 6. number line → the inequality
    { tip: "qapali", gen: () => again(() => {
      const L = rnd(-9, 4), Rr = L + 2 * rnd(1, 5), cl = Math.random() < .6, c = (L + Rr) / 2, r = (Rr - L) / 2, op = cl ? "≤" : "<", opX = cl ? "<" : "≤", opC = cl ? ">" : "≥";
      if (c === 0) return null;
      return mc(ae(barX(c, op, r), [barX(c, opX, r), barX(-c, op, r), barX(r, op, Math.abs(c)), barX(c, opC, r)], t => t), {
        text: "Ədəd oxunda göstərilmiş aralıq hansı bərabərsizliyin həllidir? (Dolu nöqtə uc nöqtənin daxil olduğunu, boş nöqtə daxil olmadığını göstərir.)", svg: segment(L, Rr, cl),
        solution: `Mərkəz — aralığın ortası: (${S(L)} + ${S(Rr)})/2 = ${S(c)}, deməli ifadə ${xm(c)}. Radius — yarım uzunluq: (${S(Rr)} − (${S(L)}))/2 = ${r}. ${cl ? "Uclar daxildir (dolu nöqtələr) — ≤." : "Uclar daxil deyil (boş nöqtələr) — <."} Tələlər: mərkəzin işarəsini səhv yazmaq (${xm(-c)}), mərkəzlə radiusu qarışdırmaq (${barX(r, op, Math.abs(c))}), ≤ ilə < işarəsini dəyişmək, aralığın kənarını götürmək (${barX(c, opC, r)}).` });
    }) },
    // 7. coded: integers that are NOT solutions of |kx − b| ≥ a
    { tip: "kod", gen: () => again(() => {
      const k = pick([2, 3, 4, 5]), b = rnd(-9, 9), a = rnd(4, 16), op = pick([">", "≥"]);
      const non = ints(x => !cmp(Math.abs(k * x - b), op, a), -50, 50); if (non.length < 3) return null;
      return { text: `${M(k, b)} ${op} ${a} bərabərsizliyinin həlli olmayan neçə tam ədəd var?`, answer: non.length, show: String(non.length), tol: 1e-6,
        solution: `Həll iki şüadır: ${lx(k, b)} ${op === ">" ? "<" : "≤"} −${a} və ya ${lx(k, b)} ${op} ${a}, yəni x ${op === ">" ? "<" : "≤"} ${rf(R(b - a, k))} və ya x ${op} ${rf(R(b + a, k))}. Həll olmayan tam ədədlər — aradakılar: ${list(non)}. Cəmi ${non.length}.` };
    }) },
    // 8. coded: integer solutions of |x − a| + |x − b| ≤ c
    { tip: "kod", gen: () => again(() => {
      const [a, b] = distinct(2, -8, 8).sort((u, v) => u - v), d = b - a, c = d + rnd(1, 7), op = pick(["<", "≤"]);
      const xs = ints(x => cmp(Math.abs(x - a) + Math.abs(x - b), op, c), -60, 60); if (!xs.length) return null;
      return { text: `${M(1, a)} + ${M(1, b)} ${op} ${c} bərabərsizliyinin neçə tam həlli var?`, answer: xs.length, show: String(xs.length), tol: 1e-6,
        solution: `${S(a)} ilə ${S(b)} arasında cəm sabitdir: ${d} < ${c}, yəni bu parçanın hamısı həlldir. Sərhədlər: x = ${frac(a + b - c, 2)} və x = ${frac(a + b + c, 2)}. Həll: ${frac(a + b - c, 2)} ${op} x ${op} ${frac(a + b + c, 2)}. Tam həllər: ${list(xs)} — cəmi ${xs.length}.` };
    }) },
    // 9. coded: ||x − a| − b| = c, the largest root / the number of roots
    { tip: "kod", gen: () => again(() => {
      const a = rnd(-3, 8), b = rnd(1, 9), c = rnd(1, 9), big = b + c, small = b - c, kind = pick(["max", "say"]);
      const rs = [...new Set([a + big, a - big, ...(small >= 0 ? [a + small, a - small] : [])])].sort((u, v) => u - v);
      for (const x of rs) if (Math.abs(Math.abs(x - a) - b) !== c) throw new Error("bad root " + x);
      const hi = rs[rs.length - 1], pre = `Xarici modulu aç: |${xm(a)}| − ${b} = ${c} və ya |${xm(a)}| − ${b} = −${c}, yəni |${xm(a)}| = ${big}${small > 0 ? ` və ya |${xm(a)}| = ${small}` : small === 0 ? ` və ya |${xm(a)}| = 0` : ` və ya |${xm(a)}| = ${S(small)} (mümkün deyil)`}.`;
      if (kind === "max") { if (hi <= 0) return null; return { text: `||${xm(a)}| − ${b}| = ${c} tənliyinin ən böyük kökünü tapın.`, answer: hi, show: String(hi), tol: 1e-6, solution: `${pre} Ən böyük kök: ${S(a)} + ${big} = ${hi}.` }; }
      return { text: `||${xm(a)}| − ${b}| = ${c} tənliyinin neçə kökü var?`, answer: rs.length, show: String(rs.length), tol: 1e-6, solution: `${pre} Kökləri: ${rs.map(S).join("; ")} — cəmi ${rs.length}.` };
    }) },
    // 10. written: |kx − b| + |x − d| = c, the sum of the roots (three parts of the number line)
    { tip: "yazili", gen: () => again(() => {
      const k = pick([2, 3]), b = rnd(-9, 9), d = rnd(-6, 6), c = rnd(5, 15), found = []; if (b === k * d) return null;
      for (const s1 of [1, -1]) for (const s2 of [1, -1]) {
        const coef = s1 * k + s2, rhs = c + s1 * b + s2 * d; if (!coef) { if (!rhs) return null; continue; }
        const r = R(rhs, coef), x = val(r);
        if ((s1 * (k * x - b) >= -1e-12) && (s2 * (x - d) >= -1e-12)) found.push({ s1, s2, r });
      }
      const rs = uniq(found.map(f => f.r)); if (rs.length !== 2 || rs.some(r => r[1] !== 1) || rs[0][0] + rs[1][0] <= 0) return null;
      const sm = rs[0][0] + rs[1][0], z = uniq([R(b, k), R(d, 1)]), zl = val(z[0]), zh = val(z[1]);
      const reg = [[zl - 1, `x < ${rf(z[0])}`], [(zl + zh) / 2, `${rf(z[0])} ≤ x < ${rf(z[1])}`], [zh + 1, `x ≥ ${rf(z[1])}`]];
      const lines = reg.map(([t, nm], n) => {
        const s1 = k * t - b >= 0 ? 1 : -1, s2 = t - d >= 0 ? 1 : -1, coef = s1 * k + s2, rhs = c + s1 * b + s2 * d, r = R(rhs, coef), x = val(r);
        const inside = n === 0 ? x < zl : n === 1 ? x >= zl && x < zh : x >= zh;
        return `${n + 3 - 2}) ${nm}: ${s1 > 0 ? "" : "−"}(${lx(k, b)}) ${s2 > 0 ? "+" : "−"} (${lx(1, d)}) = ${c} → ${coef === 1 ? "" : poly([[coef, "x"]]) + " = " + S(rhs) + " → "}x = ${rf(r)}. ${inside ? "Bu hissəyə aiddir ✓" : "Bu hissəyə aid deyil — atılır."}`;
      });
      return { text: `${M(k, b)} + ${M(1, d)} = ${c} tənliyini həll edin və köklərinin cəmini yazın.`, answer: sm, show: String(sm), tol: 1e-6,
        solution: `Modulların sıfırları: ${lx(k, b)} = 0 → x = ${frac(b, k)}; ${lx(1, d)} = 0 → x = ${S(d)}. Ədəd oxu üç hissəyə bölünür. ${lines.join(" ")} Köklər: ${rs.map(rf).join(" və ")}; yoxlama: x = ${S(rs[0][0])} və x = ${S(rs[1][0])} tənliyi ödəyir. Cəm: ${sm}. Həll yazılmadan yalnız cavab — bal verilmir.` };
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT));
  window.__imtahan = IMT;

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "modullu", title: "Modullu tənliklər və bərabərsizliklər", fenn: "riyaziyyat", link: "dersler/modullu.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 7/2 (onluq 3.5 də olar). Kök (həll) yoxdursa və say soruşulursa — 0.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["sade", "sade", "iki", "iki", "kicik", "kicik", "boyuk", "cem", "cem", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/modullu.html")) b.push("dersler/modullu.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
