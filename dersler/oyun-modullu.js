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
          `${pre} Sərhədlər: ${e} = ${c} → x = ${frac(a + b - c, 2)} və x = ${frac(a + b + c, 2)}. Həll: ${frac(a + b - c, 2)} ${op} x ${op} ${frac(a + b + c, 2)}.` + (c === d && op === "<" ? ` (Cəm heç vaxt ${d} ədədindən kiçik olmur — həll yoxdur.)` : ""));
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
            return { text: `Fikrət natural ədəd fikirləşdi. Bu ədəd ilə ${a} ədədinin fərqinin modulu ${b} ədədinə bərabərdir. Fikrətin fikirləşə biləcəyi ədədlərin cəmini tap.`, answer: 2 * a, show: String(2 * a), tol: 0.01,
              solution: `|x − ${a}| = ${b} → x = ${a + b} və ya x = ${a - b}. İkisi də naturaldır. Cəm: ${a + b} + ${a - b} = ${2 * a}.` };
          }
          const b = rnd(a, a + 12);
          return { text: `Fikrət natural ədəd fikirləşdi. Bu ədəd ilə ${a} ədədinin fərqinin modulu ${b} ədədinə bərabərdir. Fikrət hansı ədədi fikirləşib?`, answer: a + b, show: String(a + b), tol: 0.01,
            solution: `|x − ${a}| = ${b} → x = ${a + b} və ya x = ${S(a - b)}. ${S(a - b)} natural deyil. Cavab: ${a + b}.` };
        }
        let a, b, c; do { [a, b] = distinct(2, 10, 60).sort((u, v) => u - v); c = (b - a) + 2 * rnd(1, 8) + (Math.random() < .5 ? 1 : 0); } while (a + b - c < 0);
        const xs = ints(x => Math.abs(x - a) + Math.abs(x - b) <= c, 0, 200);
        return { text: `Yolda kilometr nişanları ${a} və ${b} olan yerlərdə avtobus dayanacaqları var. Kafe yol kənarında elə tam kilometr nişanında tikilməlidir ki, ondan iki dayanacağa qədər məsafələrin cəmi ${c} km-dən çox olmasın. Neçə yer uyğundur?`, answer: xs.length, show: String(xs.length), tol: 0.01,
          solution: `|x − ${a}| + |x − ${b}| ≤ ${c}. Dayanacaqlar arasındakı hər nöqtədə cəm ${b - a} km olur (uyğundur). Sərhədlər: 2x − ${a + b} = ${c} → x = ${frac(a + b + c, 2)}; ${a + b} − 2x = ${c} → x = ${frac(a + b - c, 2)}. Tam nişanlar: ${xs[0]}; …; ${xs[xs.length - 1]} — cəmi ${xs.length}.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "modullu", title: "Modullu tənliklər və bərabərsizliklər", fenn: "riyaziyyat", link: "dersler/modullu.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 7/2 (onluq 3.5 də olar). Kök (həll) yoxdursa və say soruşulursa — 0.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["sade", "sade", "iki", "iki", "kicik", "kicik", "boyuk", "cem", "cem", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/modullu.html")) b.push("dersler/modullu.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
