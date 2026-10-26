// Xətti bərabərsizliklər — mastery game levels (intervals, linear inequalities, sign flip, double inequalities,
// systems and unions, word problems) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
// Answers are always computed by brute force over integers (exact integer arithmetic), not by formula.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const FLIP = { "<": ">", ">": "<", "≤": "≥", "≥": "≤" };
  const cmp = (a, op, b) => op === "<" ? a < b : op === ">" ? a > b : op === "≤" ? a <= b : a >= b;
  const ints = (f, a = -400, b = 400) => { const o = []; for (let x = a; x <= b; x++) if (f(x)) o.push(x); return o; };
  const sum = a => a.reduce((s, v) => s + v, 0);
  const list = a => a.length <= 8 ? a.map(S).join("; ") : a.slice(0, 3).map(S).join("; ") + "; …; " + a.slice(-2).map(S).join("; ");
  const nz = (a, b) => { let v = 0; while (!v) v = rnd(a, b); return v; };
  // x op p/q as an interval
  const ray = (op, r) => op === ">" ? `(${r}; +∞)` : op === "≥" ? `[${r}; +∞)` : op === "<" ? `(−∞; ${r})` : `(−∞; ${r}]`;
  // halves: value A means A/2, shown with a decimal comma
  const D = A => A % 2 === 0 ? S(A / 2) : (A < 0 ? "−" : "") + Math.floor(Math.abs(A) / 2) + ",5";
  const IV = (lo, li, hi, hi_) => (lo === -Infinity ? "(−∞" : (li ? "[" : "(") + D(lo)) + "; " + (hi === Infinity ? "+∞)" : D(hi) + (hi_ ? "]" : ")"));
  const inIV = (I, x) => (I.lo === -Infinity || (I.li ? 2 * x >= I.lo : 2 * x > I.lo)) && (I.hi === Infinity || (I.hi_ ? 2 * x <= I.hi : 2 * x < I.hi));
  const ivTxt = I => IV(I.lo, I.li, I.hi, I.hi_);

  // A·x + B op C·x + D  →  k·x op c  →  x op2 p/q
  function solve(A, B, C, Dd, op) {
    const k = A - C, c = Dd - B, op2 = k < 0 ? FLIP[op] : op;
    return { k, c, op2, r: frac(c, k), txt: k === 1 ? `x ${op} ${S(c)}` : `${poly([[k, "x"]])} ${op} ${S(c)} → hər tərəfi ${S(k)} ədədinə bölürük${k < 0 ? " (mənfi ədəd — işarə dəyişir!)" : ""} → x ${op2} ${frac(c, k)}` };
  }
  // ask for the end of a one-sided solution set that exists
  function oneSide(op2, xs, steps) {
    const small = op2 === ">" || op2 === "≥", ans = small ? xs[0] : xs[xs.length - 1];
    return { q: small ? "Ən kiçik tam həlli tap." : "Ən böyük tam həlli tap.", answer: ans, show: S(ans), tol: 0.01,
      solution: steps + ` ${small ? "Ən kiçik" : "Ən böyük"} tam həll: ${S(ans)}.` };
  }
  // linear inequality with a chosen sign of the x-coefficient (after collecting): +1 or −1
  function linear(sign) {
    const op = pick(["<", ">", "≤", "≥"]);
    if (Math.random() < .55) { // m(x + u) + v op C x + D   or   v − m(x + u) op C x + D
      const m = rnd(2, 5), u = nz(-6, 6), v = rnd(-9, 9), Dd = rnd(-15, 15);
      const C = sign > 0 ? rnd(-3, m - 1) : rnd(-m + 1, 3);
      const A = sign > 0 ? m : -m, B = sign > 0 ? m * u + v : v - m * u;
      const br = `(${poly([[1, "x"], [u, ""]])})`;
      const left = sign > 0 ? `${m}${br}${v ? (v < 0 ? " − " : " + ") + Math.abs(v) : ""}` : `${v ? S(v) + " − " : "−"}${m}${br}`;
      const right = poly([[C, "x"], [Dd, ""]]), so = solve(A, B, C, Dd, op);
      const xs = ints(x => cmp(A * x + B, op, C * x + Dd));
      const r = oneSide(so.op2, xs, `Mötərizəni aç: ${poly([[A, "x"], [B, ""]])} ${op} ${right}. x-li hədləri sola, ədədləri sağa keçir: ${so.txt}.`);
      return { text: `${left} ${op} ${right}. ${r.q}`, answer: r.answer, show: r.show, tol: r.tol, solution: r.solution };
    }
    // (x − a)/d1 ± (x + b)/d2 op c
    let d1, d2, s;
    do { d1 = pick([2, 3, 4, 5, 6]); d2 = pick([2, 3, 4, 5, 6]); s = pick([1, -1]); }
    while (d1 === d2 || (sign > 0 ? (s < 0 && d1 > d2) : !(s < 0 && d1 > d2)) || (d1 * d2 / gcd(d1, d2)) > 20);
    const M = d1 * d2 / gcd(d1, d2), L = M / d1, R = M / d2, a = nz(-7, 7), b = nz(-7, 7), c = rnd(-4, 4);
    const A = L + s * R, B = -L * a + s * R * b, so = solve(A, B, 0, M * c, op);
    const expr = `(${poly([[1, "x"], [-a, ""]])})/${d1} ${s > 0 ? "+" : "−"} (${poly([[1, "x"], [b, ""]])})/${d2}`;
    const xs = ints(x => cmp(L * (x - a) + s * R * (x + b), op, M * c));
    const r = oneSide(so.op2, xs, `Ortaq məxrəc ${M}: hər tərəfi ${M} ədədinə vur → ${L === 1 ? "" : L}(${poly([[1, "x"], [-a, ""]])}) ${s > 0 ? "+" : "−"} ${R === 1 ? "" : R}(${poly([[1, "x"], [b, ""]])}) ${op} ${S(M * c)} → ${poly([[A, "x"], [B, ""]])} ${op} ${S(M * c)} → ${so.txt}.`);
    return { text: `${expr} ${op} ${S(c)}. ${r.q}`, answer: r.answer, show: r.show, tol: r.tol, solution: r.solution };
  }
  // k·x + b op c that solves to "x OP t" (t = integer, sometimes a fraction)
  function mk(OP) {
    const t = rnd(-8, 8), k = nz(-5, 5), b = rnd(-9, 9), off = Math.abs(k) > 1 && Math.random() < .35 ? rnd(1, Math.abs(k) - 1) : 0;
    const c = k * t + b + off, op = k > 0 ? OP : FLIP[OP];
    const s = (k < 0 && b && Math.random() < .5 ? poly([[b, ""], [k, "x"]]) : poly([[k, "x"], [b, ""]])) + ` ${op} ${S(c)}`;
    return { s, f: x => cmp(k * x + b, op, c), sol: `x ${OP} ${frac(c - b, k)}`, v: (c - b) / k, OP };
  }

  const levels = [
    { id: "araliq", ad: "Aralıqlar və xassələr", izah: "Kvadrat mötərizə — uc daxildir, dairəvi — daxil deyil. Mənfi ədədə vuranda bərabərsizliyin işarəsi dəyişir.",
      gen() {
        const kind = pick(["say", "say", "kes", "kes", "bir", "xasse", "xasse"]);
        const iv = () => { const lo = rnd(-18, 8), hi = lo + rnd(3, 18); return { lo, li: Math.random() < .5, hi, hi_: Math.random() < .5 }; };
        const ends = I => `${I.lo === -Infinity ? "" : `${D(I.lo)} ${I.li ? "daxildir" : "daxil deyil"}`}${I.lo !== -Infinity && I.hi !== Infinity ? ", " : ""}${I.hi === Infinity ? "" : `${D(I.hi)} ${I.hi_ ? "daxildir" : "daxil deyil"}`}`;
        if (kind === "say") {
          const I = iv(), xs = ints(x => inIV(I, x));
          return { text: `${ivTxt(I)} aralığında neçə tam ədəd var?`, answer: xs.length, show: String(xs.length), tol: 0.01,
            solution: `${ends(I)}. Tam ədədlər: ${list(xs)} — cəmi ${xs.length}.` };
        }
        if (kind === "kes") {
          const I = iv(); let J;
          const t = pick(["sag", "sol", "parca"]);
          if (t === "sag") J = { lo: rnd(I.lo - 4, I.hi + 2), li: Math.random() < .5, hi: Infinity };
          else if (t === "sol") J = { lo: -Infinity, hi: rnd(I.lo - 2, I.hi + 4), hi_: Math.random() < .5 };
          else J = iv();
          const xs = ints(x => inIV(I, x) && inIV(J, x));
          const lo = Math.max(I.lo, J.lo), hi = Math.min(I.hi, J.hi);
          if (xs.length && hi > lo && Math.random() < .4) {
            return { text: `${ivTxt(I)} ∩ ${ivTxt(J)} kəsişməsinin uzunluğunu tap.`, answer: (hi - lo) / 2, show: frac(hi - lo, 2), tol: 0.01,
              solution: `Kəsişmə — hər iki aralığa düşən ədədlər: sol uc ${D(lo)} (böyük olan sol uc), sağ uc ${D(hi)} (kiçik olan sağ uc). Uzunluq: ${D(hi)} − ${lo < 0 ? "(" + D(lo) + ")" : D(lo)} = ${frac(hi - lo, 2)}.` };
          }
          return { text: `${ivTxt(I)} ∩ ${ivTxt(J)} kəsişməsində neçə tam ədəd var?`, answer: xs.length, show: String(xs.length), tol: 0.01,
            solution: `Kəsişmə — hər iki aralığa düşən ədədlər. ` + (xs.length ? `Ortaq tam ədədlər: ${list(xs)} — cəmi ${xs.length}.` : "Ortaq tam ədəd yoxdur — cavab 0.") };
        }
        if (kind === "bir") {
          const I = iv(), J = iv(), xs = ints(x => inIV(I, x) || inIV(J, x));
          return { text: `${ivTxt(I)} ∪ ${ivTxt(J)} birləşməsində neçə tam ədəd var?`, answer: xs.length, show: String(xs.length), tol: 0.01,
            solution: `Birləşmə — ən azı bir aralığa düşən ədədlər (ortaq olanlar bir dəfə sayılır). Tam ədədlər: ${list(xs)} — cəmi ${xs.length}.` };
        }
        // properties: m < a < n  →  range of k·a + b
        const m = rnd(-6, 5), n = m + rnd(2, 6), k = pick([-4, -3, -2, -1, 2, 3, 4, -2, -3]), b = rnd(-9, 9), inc = Math.random() < .3;
        const o = inc ? "≤" : "<", lo = Math.min(k * m, k * n) + b, hi = Math.max(k * m, k * n) + b;
        const xs = ints(v => inc ? v >= lo && v <= hi : v > lo && v < hi);
        const e = k < 0 && b ? poly([[b, ""], [k, "a"]]) : poly([[k, "a"], [b, ""]]);
        return { text: `${S(m)} ${o} a ${o} ${S(n)}. ${e} ifadəsi neçə müxtəlif tam qiymət ala bilər?`, answer: xs.length, show: String(xs.length), tol: 0.01,
          solution: `Hər tərəfi ${S(k)} ədədinə vur${k < 0 ? " — mənfi ədəddir, işarələr dönür" : ""}: ${k < 0 ? `${S(k * n)} ${o} ${poly([[k, "a"]])} ${o} ${S(k * m)}` : `${S(k * m)} ${o} ${poly([[k, "a"]])} ${o} ${S(k * n)}`}. ${b ? (b > 0 ? `${b} əlavə et: ` : `${-b} çıx: `) : ""}${S(lo)} ${o} ${e} ${o} ${S(hi)}. Tam qiymətlər: ${list(xs)} — cəmi ${xs.length}.` };
      } },
    { id: "xetti", ad: "Xətti bərabərsizlik", izah: "Mötərizəni aç (və ya ortaq məxrəcə vur), x-li hədləri bir tərəfə topla, əmsala böl.",
      gen() { return linear(1); } },
    { id: "menfi", ad: "İşarə dəyişir", izah: "x-in əmsalı mənfi alınır. Mənfi ədədə bölərkən > işarəsi <, ≥ işarəsi ≤ olur (və əksinə).",
      gen() { return linear(-1); } },
    { id: "ikiqat", ad: "İkiqat bərabərsizlik", izah: "Hər üç hissə ilə eyni əməli et: ədədi çıx, əmsala böl. Mənfiyə bölürsənsə — hər iki işarə dönür.",
      gen() {
        const d = pick([1, 1, 1, 2, 3, 4]), k = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]), b = rnd(-9, 9);
        let lo, hi, o1, o2, xs, n = 0;
        do { lo = rnd(-8, 4); hi = lo + rnd(1, 7); o1 = pick(["<", "≤"]); o2 = pick(["<", "≤"]);
          xs = ints(x => cmp(lo * d, o1, k * x + b) && cmp(k * x + b, o2, hi * d)); } while (!xs.length && ++n < 8);
        const midE = k < 0 && b && Math.random() < .5 ? poly([[b, ""], [k, "x"]]) : poly([[k, "x"], [b, ""]]);
        const mid = d === 1 ? midE : `(${midE})/${d}`;
        const A = lo * d - b, B = hi * d - b; // A o1 k·x o2 B
        const xr = k > 0 ? `${frac(A, k)} ${o1} x ${o2} ${frac(B, k)}` : `${frac(B, k)} ${o2} x ${o1} ${frac(A, k)}`;
        const steps = (d > 1 ? `Hər hissəni ${d} ədədinə vur: ${S(lo * d)} ${o1} ${midE} ${o2} ${S(hi * d)}. ` : "") +
          (b ? `${b > 0 ? `Hər hissədən ${b} çıx` : `Hər hissəyə ${-b} əlavə et`}: ${S(A)} ${o1} ${poly([[k, "x"]])} ${o2} ${S(B)}. ` : "") +
          (k !== 1 ? `Hər hissəni ${S(k)} ədədinə böl${k < 0 ? " (işarələr dönür)" : ""}: ` : "") + xr + ".";
        const ask = pick(xs.length ? ["count", "count", "sum", "len", "min", "max"] : ["count"]);
        const base = `${S(lo)} ${o1} ${mid} ${o2} ${S(hi)}. `;
        if (ask === "count") return { text: base + "Bərabərsizliyin neçə tam həlli var?", answer: xs.length, show: String(xs.length), tol: 0.01,
          solution: steps + (xs.length ? ` Tam həllər: ${list(xs)} — cəmi ${xs.length}.` : " Bu aralıqda tam ədəd yoxdur — cavab 0.") };
        if (ask === "sum") return { text: base + "Tam həllərinin cəmini tap.", answer: sum(xs), show: S(sum(xs)), tol: 0.01, solution: steps + ` Tam həllər: ${list(xs)}. Cəmi: ${S(sum(xs))}.` };
        if (ask === "len") { const L = (B - A) / Math.abs(k); return { text: base + "Həll aralığının uzunluğunu tap.", answer: L, show: frac(B - A, Math.abs(k)), tol: 0.01, solution: steps + ` Uzunluq: böyük uc − kiçik uc = ${frac(B - A, Math.abs(k))}.` }; }
        const v = ask === "min" ? xs[0] : xs[xs.length - 1];
        return { text: base + (ask === "min" ? "Ən kiçik tam həlli tap." : "Ən böyük tam həlli tap."), answer: v, show: S(v), tol: 0.01, solution: steps + ` ${ask === "min" ? "Ən kiçik" : "Ən böyük"} tam həll: ${S(v)}.` };
      } },
    { id: "sistem", ad: "Sistem və heyət", izah: "Sistem — hər iki bərabərsizlik ödənir (kəsişmə). Heyət — ən azı biri ödənir (birləşmə).",
      gen() {
        const kind = pick(["parca", "parca", "parca", "sua", "bos", "heyet"]);
        const GE = () => pick([">", "≥"]), LE = () => pick(["<", "≤"]);
        let e1, e2, tries = 0;
        for (;;) {
          tries++;
          if (kind === "parca") { e1 = mk(GE()); e2 = mk(LE()); if (e2.v - e1.v >= 1 && e2.v - e1.v <= 9) break; }
          else if (kind === "sua") { const o = pick([GE, LE]); e1 = mk(o()); e2 = mk(o()); if (Math.abs(e1.v - e2.v) >= 1) break; }
          else if (kind === "bos") { e1 = mk(GE()); e2 = mk(LE()); if (e1.v - e2.v >= 1) break; }
          else { e1 = mk(LE()); e2 = mk(GE()); if (e2.v - e1.v >= 1 && e2.v - e1.v <= 9) break; }
          if (tries > 500) break;
        }
        const [p, q] = Math.random() < .5 ? [e1, e2] : [e2, e1];
        const each = `Birinci: ${p.s} → ${p.sol}. İkinci: ${q.s} → ${q.sol}.`;
        if (kind === "heyet") {
          const xs = ints(x => !(p.f(x) || q.f(x)));
          return { text: `Heyət (ən azı biri ödənməlidir): ${p.s} və ya ${q.s}. Neçə tam ədəd bu heyətin həlli deyil?`, answer: xs.length, show: String(xs.length), tol: 0.01,
            solution: `${each} Heyətin həlli — iki şüanın birləşməsi; aralarında qalan ədədlər həll deyil. Onlar: ${list(xs)} — cəmi ${xs.length}.` };
        }
        const xs = ints(x => p.f(x) && q.f(x)), txt = `Sistem (hər ikisi ödənməlidir): ${p.s} və ${q.s}. `;
        if (kind === "bos") return { text: txt + "Sistemin neçə tam həlli var?", answer: 0, show: "0", tol: 0.01,
          solution: `${each} Bu iki şüanın ortaq nöqtəsi yoxdur — sistemin həlli yoxdur, tam həllərin sayı 0.` };
        if (kind === "sua") {
          const small = e1.OP === ">" || e1.OP === "≥", v = small ? xs[0] : xs[xs.length - 1];
          return { text: txt + (small ? "Ən kiçik tam həlli tap." : "Ən böyük tam həlli tap."), answer: v, show: S(v), tol: 0.01,
            solution: `${each} Hər ikisi eyni istiqamətdədir — kəsişmə "daha sərt" olan şərtdir. ${small ? "Ən kiçik" : "Ən böyük"} tam həll: ${S(v)}.` };
        }
        const ask = pick(xs.length ? ["count", "count", "sum", "min", "max"] : ["count"]);
        const fin = `${each} Kəsişmə: ${xs.length ? list(xs) : "tam ədəd yoxdur"}.`;
        if (ask === "count") return { text: txt + "Sistemin neçə tam həlli var?", answer: xs.length, show: String(xs.length), tol: 0.01, solution: `${fin} Cəmi ${xs.length} tam həll.` };
        if (ask === "sum") return { text: txt + "Sistemin tam həllərinin cəmini tap.", answer: sum(xs), show: S(sum(xs)), tol: 0.01, solution: `${fin} Cəmi: ${S(sum(xs))}.` };
        const v = ask === "min" ? xs[0] : xs[xs.length - 1];
        return { text: txt + (ask === "min" ? "Ən kiçik tam həlli tap." : "Ən böyük tam həlli tap."), answer: v, show: S(v), tol: 0.01, solution: `${fin} Cavab: ${S(v)}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində ilk səhv var. Hansında?",
      gen() {
        const k = rnd(2, 6), t = rnd(-7, 7), b = nz(-9, 9), OP = pick(["<", ">", "≤", "≥"]), c = b - k * t;
        // b − k·x OP c  →  −k·x OP c − b  →  x FLIP t
        const left = b ? `${S(b)} − ${k}x` : `−${k}x`;
        const st = [`−${k}x ${OP} ${S(c - b)}`, `x ${FLIP[OP]} ${S(t)}`, `Cavab: ${ray(FLIP[OP], S(t))}`];
        const bad = rnd(0, 2);
        if (bad === 0) { st[0] = `−${k}x ${OP} ${S(c + b)}`; st[1] = `x ${FLIP[OP]} ${frac(c + b, -k)}`; st[2] = `Cavab: ${ray(FLIP[OP], frac(c + b, -k))}`; }
        if (bad === 1) { st[1] = `x ${OP} ${S(t)}`; st[2] = `Cavab: ${ray(OP, S(t))}`; }
        if (bad === 2) { const wrong = { "<": "≤", ">": "≥", "≤": "<", "≥": ">" }[FLIP[OP]]; st[2] = `Cavab: ${ray(wrong, S(t))}`; }
        const text = h("div", {}, h("p", {}, `Bərabərsizlik: ${left} ${OP} ${S(c)}.`),
          h("ol", { class: "oy-steps" }, h("li", {}, `${S(b)} ədədini sağa keçir: ` + st[0]), h("li", {}, `Hər tərəfi −${k} ədədinə böl: ` + st[1]), h("li", {}, st[2])));
        const why = [`1-ci addım: ${S(b)} sağa keçəndə işarəsini dəyişir: ${S(c)} − (${S(b)}) = ${S(c - b)}.`,
          `2-ci addım: mənfi ədədə (−${k}) bölərkən işarə dönməlidir: ${OP} → ${FLIP[OP]}. Düzü: x ${FLIP[OP]} ${S(t)}.`,
          `3-cü addım: x ${FLIP[OP]} ${S(t)} üçün ${S(t)} ${OP === "≤" || OP === "≥" ? "daxildir — kvadrat mötərizə" : "daxil deyil — dairəvi mötərizə"}: ${ray(FLIP[OP], S(t))}.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Məsələ → bərabərsizlik. \"Ən azı\" — ≥, \"ən çox\", \"keçməsin\" — ≤. Cavab tam ədəddir: düzgün tərəfə yuvarlaqlaşdır.",
      gen() {
        const kind = pick(["taksi", "bal", "tarif", "yigim", "ucbucaq"]);
        if (kind === "taksi") {
          const F = rnd(1, 3), p = pick([4, 5, 6, 8]), M = rnd(F + 5, 25), ans = Math.floor(10 * (M - F) / p);
          return { text: `Taksidə minmə haqqı ${F} manat, hər kilometr isə 0,${p} manatdır. Elvinin ${M} manatı var. O, taksi ilə ən çox neçə tam kilometr gedə bilər?`, answer: ans, unit: "km", show: String(ans), tol: 0.01,
            solution: `${F} + 0,${p}x ≤ ${M} → 0,${p}x ≤ ${M - F} → x ≤ ${frac(10 * (M - F), p)}${(10 * (M - F)) % p ? " ≈ " + String(Math.round(100 * (M - F) / p) / 10).replace(".", ",") : ""}. Ən böyük tam x: ${ans}.` };
        }
        if (kind === "bal") {
          let s, T, need, sc;
          do { sc = [rnd(60, 98), rnd(60, 98), rnd(60, 98), rnd(60, 98)]; s = sum(sc); T = rnd(75, 92); need = 5 * T - s; } while (need < 40 || need > 100);
          return { text: `Elvin 4 testdən ${sc.join(", ")} bal aldı (hər test 100 ballıqdır). 5 testin orta balı ən azı ${T} olsun deyə 5-ci testdən ən azı neçə bal almalıdır?`, answer: need, show: String(need), tol: 0.01,
            solution: `(${sc.join(" + ")} + x)/5 ≥ ${T} → ${s} + x ≥ ${5 * T} → x ≥ ${need}. Ən az: ${need} bal.` };
        }
        if (kind === "tarif") {
          const a = pick([3, 4, 5, 6, 8, 10]), p = rnd(1, 4), q = p + rnd(2, 7), ans = Math.floor(100 * a / (q - p)) + 1;
          return { text: `Birinci tarif: aylıq abunə ${a} manat və hər dəqiqə ${p} qəpik. İkinci tarif: abunə yoxdur, hər dəqiqə ${q} qəpik. Ayda ən azı neçə tam dəqiqə danışanda birinci tarif ikincidən ucuz olur?`, answer: ans, unit: "dəq", show: String(ans), tol: 0.01,
            solution: `Qəpiklə: ${100 * a} + ${p}x < ${q}x → ${100 * a} < ${q - p}x → x > ${frac(100 * a, q - p)}. Ən kiçik tam x: ${ans}.` };
        }
        if (kind === "yigim") {
          const N = rnd(8, 30) * 10, H = rnd(1, 9) * 5, w = rnd(6, 15), ans = Math.ceil((N - H) / w);
          return { text: `Velosiped ${N} manatdır. Elvinin ${H} manatı var və hər həftə ${w} manat yığır. Ən azı neçə həftədən sonra pulu velosipedə çatacaq?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${H} + ${w}x ≥ ${N} → ${w}x ≥ ${N - H} → x ≥ ${frac(N - H, w)}. Ən kiçik tam x: ${ans}.` };
        }
        const a = rnd(3, 15), b = rnd(3, 15), lo = Math.abs(a - b), hi = a + b, xs = ints(x => x > lo && x < hi);
        if (Math.random() < .5) return { text: `Üçbucağın iki tərəfi ${a} sm və ${b} sm-dir, üçüncü tərəfin uzunluğu tam ədəddir (sm). Üçüncü tərəf neçə müxtəlif qiymət ala bilər?`, answer: xs.length, show: String(xs.length), tol: 0.01,
          solution: `Üçbucaq bərabərsizliyi: ${S(lo)} < x < ${hi} (tərəflərin fərqindən böyük, cəmindən kiçik). Tam qiymətlər: ${list(xs)} — cəmi ${xs.length}.` };
        const P = a + b + xs[xs.length - 1];
        return { text: `Üçbucağın iki tərəfi ${a} sm və ${b} sm-dir, üçüncü tərəfin uzunluğu tam ədəddir (sm). Üçbucağın perimetri ən çox neçə sm ola bilər?`, answer: P, unit: "sm", show: String(P), tol: 0.01,
          solution: `Üçbucaq bərabərsizliyi: ${S(lo)} < x < ${hi}. Ən böyük tam x = ${hi - 1}. Perimetr: ${a} + ${b} + ${hi - 1} = ${P} sm.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "xetti-berabersizlik", title: "Xətti bərabərsizliklər", fenn: "riyaziyyat", link: "dersler/xetti-berabersizlik.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 7/2 (onluq 3.5 də olar). Tam həll yoxdursa və say soruşulursa — 0.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["araliq", "xetti", "xetti", "menfi", "menfi", "ikiqat", "ikiqat", "sistem", "sistem", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/xetti-berabersizlik.html")) b.push("dersler/xetti-berabersizlik.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
