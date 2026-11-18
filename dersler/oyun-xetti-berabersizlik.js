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

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are the
  // answers of typical mistakes (sign not flipped, wrong bracket, c not divided by k, strict/closed end, ...), not random numbers.
  const { ae, again, num } = Oyun;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const OPS = ["<", ">", "≤", "≥"];
  const SWC = { "<": "≤", ">": "≥", "≤": "<", "≥": ">" }; // same direction, the other bracket
  const isGt = op => op === ">" || op === "≥", isCl = op => op === "≤" || op === "≥";
  const norm = (p, q) => q < 0 ? [-p, -q] : [p, q];
  const holds = (x, op, p, q) => cmp(x * q, op, p); // x op p/q, q > 0
  const smallest = (op, p, q) => { for (let x = -1000; x <= 1000; x++) if (holds(x, op, p, q)) return x; };
  const largest = (op, p, q) => { for (let x = 1000; x >= -1000; x--) if (holds(x, op, p, q)) return x; };
  const ansOf = so => { const [p, q] = norm(so.c, so.k); return isGt(so.op2) ? smallest(so.op2, p, q) : largest(so.op2, p, q); };
  // A·x + B op C·x + D whose solution is "x fin (D−B)/(A−C)": fin = the wanted final sign (after the flip for k < 0)
  function linFor(fin, k, t, off) {
    const op = k < 0 ? FLIP[fin] : fin, C = rnd(-3, 3), A = C + k, B = rnd(-9, 9), Dd = B + k * t + (off || 0);
    return { A, B, C, Dd, op, so: solve(A, B, C, Dd, op), f: x => cmp(A * x + B, op, C * x + Dd), text: `${poly([[A, "x"], [B, ""]])} ${op} ${poly([[C, "x"], [Dd, ""]])}` };
  }
  // (x − a)/d1 − (x + b)/d2 op c, with the final sign fin
  function fracFor(fin) {
    let d1, d2;
    do { d1 = pick([2, 3, 4, 5, 6]); d2 = pick([2, 3, 4, 5, 6]); } while (d1 === d2 || d1 * d2 / gcd(d1, d2) > 20);
    const M = d1 * d2 / gcd(d1, d2), L = M / d1, R = M / d2, a = nz(-7, 7), b = nz(-7, 7), c = rnd(-4, 4), K = L - R;
    const op = K < 0 ? FLIP[fin] : fin, B = -L * a - R * b;
    return { M, L, R, a, b, c, K, B, op, so: solve(K, B, 0, M * c, op), f: x => cmp(L * (x - a) - R * (x + b), op, M * c),
      text: `(${poly([[1, "x"], [-a, ""]])})/${d1} − (${poly([[1, "x"], [b, ""]])})/${d2} ${op} ${S(c)}` };
  }
  // constraints x > t / x ≥ t / x < t / x ≤ t and their intersection written as an interval
  const cn = (op, t) => ({ gt: isGt(op), t, cl: isCl(op) });
  function inter(cs) {
    let lo = null, hi = null;
    for (const c of cs) {
      if (c.gt) { if (!lo || c.t > lo.t || (c.t === lo.t && !c.cl)) lo = c; }
      else if (!hi || c.t < hi.t || (c.t === hi.t && !c.cl)) hi = c;
    }
    if (lo && hi && (lo.t > hi.t || (lo.t === hi.t && !(lo.cl && hi.cl)))) return "∅";
    if (lo && hi && lo.t === hi.t) return `{${S(lo.t)}}`;
    return (lo ? (lo.cl ? "[" : "(") + S(lo.t) : "(−∞") + "; " + (hi ? S(hi.t) + (hi.cl ? "]" : ")") : "+∞)");
  }

  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. closed: a linear inequality with a negative coefficient, the solution set as an interval
    { tip: "qapali", gen: () => again(() => {
      const fin = pick(OPS), k = -rnd(2, 6), t = nz(-7, 7), E = linFor(fin, k, t, 0);
      if (!E.A || E.so.op2 !== fin) return null;
      const op = E.op, c = E.so.c, right = ray(fin, S(t)), w = [ray(op, S(t)), ray(SWC[fin], S(t)), ray(fin, S(-t)), ray(op, S(c))];
      return mc(ae(right, w, x => x), { text: `${E.text} bərabərsizliyinin həllini göstərin.`,
        solution: `x-li hədləri bir tərəfə, ədədləri o biri tərəfə keçiririk: ${E.so.txt}. Həll: ${right}. Tələlər: mənfi ədədə bölərkən işarəni çevirməmək (${w[0]}); mötərizəni səhv seçmək — ${S(t)} ${isCl(fin) ? "daxildir, kvadrat" : "daxil deyil, dairəvi"} mötərizə (${w[1]}); bölmədə işarə səhvi (${w[2]}); əmsala bölməyi unutmaq (${w[3]}).` });
    }) },
    // 2. closed: a double inequality, how many integer solutions (ends included or not)
    { tip: "qapali", gen: () => again(() => {
      const k = pick([-5, -4, -3, -2]), b = nz(-9, 9), xl = rnd(-6, 2), n = rnd(3, 8), xh = xl + n, o1 = pick(["<", "≤"]), o2 = pick(["<", "≤"]);
      const lo = k > 0 ? k * xl + b : k * xh + b, hi = k > 0 ? k * xh + b : k * xl + b;
      const R = n + 1 - (o1 === "<" ? 1 : 0) - (o2 === "<" ? 1 : 0);
      const mid = Math.random() < .5 ? poly([[b, ""], [k, "x"]]) : poly([[k, "x"], [b, ""]]);
      const w = [n + 1, n, n - 1].filter(v => v !== R);
      w.push(hi - lo + 1 - (o1 === "<" ? 1 : 0) - (o2 === "<" ? 1 : 0), 0);
      const set = `${o2 === "<" ? "(" : "["}${S(xl)}; ${S(xh)}${o1 === "<" ? ")" : "]"}`;
      return mc(ae(R, w), { text: `${S(lo)} ${o1} ${mid} ${o2} ${S(hi)} bərabərsizliyinin neçə tam həlli var?`,
        solution: `${b > 0 ? "Hər üç hissədən " + b + " çıxırıq" : "Hər üç hissəyə " + (-b) + " əlavə edirik"}: ${S(lo - b)} ${o1} ${poly([[k, "x"]])} ${o2} ${S(hi - b)}. ${S(k)} ədədinə bölürük (mənfi ədəd — hər iki işarə dönür): x ∈ ${set}. Tam həllər ${R} dənədir. Tələlər: uc nöqtələrini düzgün seçməmək (${[n + 1, n, n - 1].filter(v => v !== R).join(" və ya ")}); əmsala bölməyi unutmaq və ortadakı ifadənin özünün tam qiymətlərini saymaq (${w[2]}); işarələri çevirməmək — sol hissə sağdan böyük alınır, həll yoxdur (0).` });
    }) },
    // 3. closed: a system of two inequalities, the solution as an interval
    { tip: "qapali", gen: () => again(() => {
      const t1 = rnd(-6, 3), t2 = t1 + rnd(2, 8), k1 = nz(-4, 4), k2 = nz(-4, 4); if (k1 > 0 && k2 > 0) return null;
      const f1 = pick([">", "≥"]), f2 = pick(["<", "≤"]), E1 = linFor(f1, k1, t1, 0), E2 = linFor(f2, k2, t2, 0); if (!E1.A || !E2.A) return null;
      const right = inter([cn(f1, t1), cn(f2, t2)]), E = [[E1, f1, t1, k1], [E2, f2, t2, k2]];
      const w = [inter([cn(SWC[f1], t1), cn(SWC[f2], t2)]), inter(E.map(([e, f, t, k]) => k < 0 ? cn(e.op, t) : cn(f, t))), "(−∞; +∞)", inter(E.map(([e]) => cn(e.op, e.so.c)))];
      return mc(ae(right, w, x => x), { text: `${E1.text} və ${E2.text} bərabərsizliklər sisteminin həllini göstərin.`,
        solution: `Birinci: ${E1.so.txt}. İkinci: ${E2.so.txt}. Sistem — hər ikisi ödənməlidir (kəsişmə): ${right}. Tələlər: mötərizəni səhv seçmək (${w[0]}); mənfi əmsala bölərkən işarəni çevirməmək (${w[1]}); sistemi "və ya" kimi oxumaq (${w[2]}); əmsallara bölməyi unutmaq (${w[3]}).` });
    }) },
    // 4. closed: a fractional inequality, the least / greatest integer solution
    { tip: "qapali", gen: () => again(() => {
      const fin = pick(OPS), F = fracFor(fin), so = F.so;
      const right = ansOf(so), [p, q] = norm(so.c, so.k), lower = isGt(fin), cl = isCl(fin), exact = p % q === 0;
      if (Math.abs(right) > 40) return null;
      const w1 = ansOf(solve(F.K, F.B, 0, F.c, F.op)), w2 = ansOf(solve(F.K, -F.L * F.a + F.R * F.b, 0, F.M * F.c, F.op)), w4 = ansOf(solve(F.K, -F.B, 0, F.M * F.c, F.op));
      const w3 = exact ? (lower ? (cl ? right + 1 : right - 1) : (cl ? right - 1 : right + 1)) : (lower ? Math.floor(p / q) : Math.ceil(p / q));
      return mc(ae(right, [w1, w2, w3, w4]), { text: `${F.text} bərabərsizliyinin ən ${lower ? "kiçik" : "böyük"} tam həllini tapın.`,
        solution: `Hər tərəfi ${F.M} ədədinə vururuq: ${F.L === 1 ? "" : F.L}(${poly([[1, "x"], [-F.a, ""]])}) − ${F.R === 1 ? "" : F.R}(${poly([[1, "x"], [F.b, ""]])}) ${F.op} ${S(F.M * F.c)}. Mötərizəni açırıq (ikinci mötərizənin qarşısında mənfi işarəsi var — onun içindəki hər iki hədd işarəsini dəyişir): ${poly([[F.K, "x"], [F.B, ""]])} ${F.op} ${S(F.M * F.c)} → ${so.txt}. Ən ${lower ? "kiçik" : "böyük"} tam həll: ${S(right)}. Tələlər: sağ tərəfi ${F.M} ədədinə vurmağı unutmaq (${S(w1)}); minusu ikinci həddə yaymamaq (${S(w2)}); ədədi keçirəndə işarəni dəyişməmək (${S(w4)}); ${exact ? "sərhəd ədədini səhv daxil etmək və ya çıxarmaq" : "kəsri əks tərəfə yuvarlaqlaşdırmaq"} (${S(w3)}).` });
    }) },
    // 5. closed: domain of a sum of two square roots, how many integers
    { tip: "qapali", gen: () => again(() => {
      const b = rnd(2, 5), c = rnd(2, 5), p = rnd(-6, 3), q = rnd(1, 9), a = b * q, d = -c * p; if (q - p < 3 || q - p > 12 || p === 0) return null;
      const R = q - p + 1, w = [q - p, q - p - 1, ints(x => x >= -p && x <= q).length, a - p + 1];
      return mc(ae(R, w), { text: `x-in neçə tam qiymətində √(${poly([[a, ""], [-b, "x"]])}) + √(${poly([[c, "x"], [d, ""]])}) ifadəsi mənalıdır?`,
        solution: `Kvadrat kökün altındakı ifadə mənfi olmamalıdır (≥ 0): ${poly([[a, ""], [-b, "x"]])} ≥ 0 → x ≤ ${q}; ${poly([[c, "x"], [d, ""]])} ≥ 0 → x ≥ ${S(p)}. İkisi eyni anda: ${S(p)} ≤ x ≤ ${q}, uclar daxildir. Tam ədədlər: ${q} − (${S(p)}) + 1 = ${R}. Tələlər: kökün altını sıfırdan böyük (>) hesab edib uclardan birini atmaq (${q - p}) və ya ikisini atmaq (${q - p - 1}); ${S(p)} ədədinin işarəsini səhv yazmaq (${w[2]}); əmsala bölməyi unutmaq (${w[3]}).` });
    }) },
    // 6. closed: a word problem, rounding to the correct side
    { tip: "qapali", gen: () => again(() => {
      if (pick([0, 1])) {
        const v = rnd(60, 95), w = pick([12, 15, 18, 20, 25, 30]), L = pick([300, 400, 500, 600, 800]), x = Math.floor((L - v) / w);
        if ((L - v) % w === 0 || x < 3) return null;
        const wr = [x + 1, Math.floor(L / w), Math.floor((L + v) / w), (L - v) - w * x];
        return mc(ae(x, wr), { text: `Liftin yük götürmə həddi ${L} kq-dır. Liftdə kütləsi ${v} kq olan adam və hər biri ${w} kq olan qutular var. Lift ən çoxu neçə qutu apara bilər?`,
          solution: `${v} + ${w}x ≤ ${L} → ${w}x ≤ ${L - v} → x ≤ ${frac(L - v, w)} ≈ ${num((L - v) / w, 2)}. "Ən çox" — aşağı tam hissə: ${x}. Tələlər: yuvarlaqlaşdırmanı əks tərəfə etmək (${x + 1} — lift həddi keçər); adamın kütləsini nəzərə almamaq (${wr[1]}); onu çıxmaq əvəzinə əlavə etmək (${wr[2]}); qalıq kütləni cavab yazmaq (${wr[3]}).` });
      }
      const H = rnd(2, 9) * 10, w = rnd(7, 16), N = rnd(18, 40) * 10, x = Math.ceil((N - H) / w);
      if ((N - H) % w === 0 || x < 3) return null;
      const wr = [x - 1, Math.ceil(N / w), Math.ceil((N + H) / w), x + 1];
      return mc(ae(x, wr), { text: `Velosiped ${N} manatdır. Elvinin ${H} manatı var və hər həftə ${w} manat yığır. Ən azı neçə həftədən sonra pulu velosipedə çatacaq?`,
        solution: `${H} + ${w}x ≥ ${N} → ${w}x ≥ ${N - H} → x ≥ ${frac(N - H, w)} ≈ ${num((N - H) / w, 2)}. "Ən azı" — yuxarı tam hissə: ${x}. Tələlər: aşağı yuvarlaqlaşdırmaq (${x - 1} həftədə pul çatmır); əvvəlki ${H} manatı nəzərə almamaq (${wr[1]}); onu çıxmaq əvəzinə əlavə etmək (${wr[2]}); ehtiyat üçün bir həftə də əlavə etmək (${x + 1}).` });
    }) },
    // 7. coded: how many natural solutions has a system (positive answer)
    { tip: "kod", gen: () => again(() => {
      const k1 = nz(-5, 5), t0 = rnd(-3, 3), off = rnd(0, Math.abs(k1) - 1);
      const E = pick([0, 1]) ? [linFor("<", k1, t0 + rnd(3, 9), off), fracFor(pick([">", "≥"]))] : [linFor(pick([">", "≥"]), k1, t0, off), fracFor(pick(["<", "≤"]))];
      if (!E[0].A) return null;
      if (Math.random() < .5) E.reverse();
      const xs = ints(x => E[0].f(x) && E[1].f(x)), nat = xs.filter(x => x >= 1), n = nat.length;
      if (n < 2 || n > 9 || xs.length > 14) return null;
      return { text: `${E[0].text} və ${E[1].text} bərabərsizliklər sisteminin neçə natural həlli var?`,
        answer: n, show: String(n), tol: 1e-6, solution: `Birinci: ${E[0].so.txt}. İkinci: ${E[1].so.txt}. Kəsişmə (tam ədədlər): ${list(xs)}. Natural həllər (x ≥ 1): ${list(nat)} — cəmi ${n}. Sıfır və mənfi ədədlər natural deyil.` };
    }) },
    // 8. coded: range of an expression from the ranges of a and b (count of integer values)
    { tip: "kod", gen: () => again(() => {
      const m1 = rnd(-5, 3), n1 = m1 + rnd(2, 5), m2 = rnd(-4, 3), n2 = m2 + rnd(2, 4), p = rnd(1, 4), q = rnd(1, 4), ra = pick(["<", "≤"]), rb = pick(["<", "≤"]), minus = pick([0, 1]);
      const l = minus ? p * m1 - q * n2 : p * m1 + q * m2, h = minus ? p * n1 - q * m2 : p * n1 + q * n2, cl = ra === "≤" && rb === "≤";
      const n = h - l + 1 - (cl ? 0 : 2); if (n < 2 || n > 20) return null;
      const vs = []; for (let v = cl ? l : l + 1; v <= (cl ? h : h - 1); v++) vs.push(v);
      const pc = p === 1 ? "" : p, qc = q === 1 ? "" : q;
      return { text: `${S(m1)} ${ra} a ${ra} ${S(n1)} və ${S(m2)} ${rb} b ${rb} ${S(n2)} olarsa, ${pc}a ${minus ? "−" : "+"} ${qc}b ifadəsi neçə müxtəlif tam qiymət ala bilər?`,
        answer: n, show: String(n), tol: 1e-6, solution: `${pc}a: ${S(p * m1)} ${ra} ${pc}a ${ra} ${S(p * n1)}. ${minus ? `${qc}b: ${S(q * m2)} ${rb} ${qc}b ${rb} ${S(q * n2)}; mənfi ilə vuranda sərhədlər dönür: ${S(-q * n2)} ${rb} −${qc}b ${rb} ${S(-q * m2)}` : `${qc}b: ${S(q * m2)} ${rb} ${qc}b ${rb} ${S(q * n2)}`}. Hədbəhəd toplayırıq: ${S(l)} ${cl ? "≤" : "<"} ifadə ${cl ? "≤" : "<"} ${S(h)}${cl ? "" : " (a və ya b-nin ucu daxil deyil — ifadənin uc qiymətləri alınmır)"}. Tam qiymətlər: ${list(vs)} — cəmi ${n}.` };
    }) },
    // 9. coded: triangle inequality, the sum of all possible integer values of the third side
    { tip: "kod", gen: () => again(() => {
      const a = rnd(3, 14), b = rnd(3, 14), lo = Math.abs(a - b), hi = a + b, xs = ints(x => x > lo && x < hi, 0, 60), s = sum(xs);
      return { text: `Üçbucağın iki tərəfi ${a} sm və ${b} sm-dir. Üçüncü tərəfin uzunluğu tam ədəddir (sm). Üçüncü tərəfin mümkün bütün qiymətlərinin cəmi neçədir?`,
        answer: s, show: String(s), tol: 1e-6, solution: `Üçbucaq bərabərsizliyi: ${lo} < x < ${hi} (tərəflərin fərqindən böyük, cəmindən kiçik; uclar daxil deyil). Tam qiymətlər: ${list(xs)}. Cəmi: ${s}.` };
    }) },
    // 10. written: system with a fractional and a linear inequality; the sum of the integer solutions (positive)
    { tip: "yazili", gen: () => again(() => {
      const E1 = fracFor(pick([">", "≥"])), E2 = linFor(pick(["<", "≤"]), nz(-4, 4), rnd(2, 9), 0); if (!E2.A) return null;
      const xs = ints(x => E1.f(x) && E2.f(x)), s = sum(xs), rv = o => ({ "<": ">", ">": "<", "≤": "≥", "≥": "≤" })[o];
      if (xs.length < 3 || xs.length > 9 || s <= 0) return null;
      return { text: `${E1.text} və ${E2.text} bərabərsizliklər sistemini həll edin. Sistemin tam həllərinin cəmini tapın.`,
        answer: s, show: String(s), tol: 1e-6,
        solution: `1) Birinci: hər tərəfi ${E1.M} ədədinə vururuq: ${E1.L === 1 ? "" : E1.L}(${poly([[1, "x"], [-E1.a, ""]])}) − ${E1.R === 1 ? "" : E1.R}(${poly([[1, "x"], [E1.b, ""]])}) ${E1.op} ${S(E1.M * E1.c)}; mötərizələri açırıq (qarşısında mənfi işarəsi olan mötərizədə hər iki hədd işarəsini dəyişir): ${poly([[E1.K, "x"], [E1.B, ""]])} ${E1.op} ${S(E1.M * E1.c)} → ${E1.so.txt}. 2) İkinci: ${E2.so.txt}. 3) Sistemin həlli — kəsişmə: x ${E1.so.op2} ${frac(E1.so.c, E1.so.k)} və x ${E2.so.op2} ${frac(E2.so.c, E2.so.k)}, yəni ${frac(E1.so.c, E1.so.k)} ${rv(E1.so.op2)} x ${E2.so.op2} ${frac(E2.so.c, E2.so.k)}. 4) Bu aralıqdakı tam həllər: ${list(xs)}. Cəmi: ${s}. Həll yazılmadan yalnız cavab — bal verilmir.` };
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
      key: "xetti-berabersizlik", title: "Xətti bərabərsizliklər", fenn: "riyaziyyat", link: "dersler/xetti-berabersizlik.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 7/2 (onluq 3.5 də olar). Tam həll yoxdursa və say soruşulursa — 0.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["araliq", "xetti", "xetti", "menfi", "menfi", "ikiqat", "ikiqat", "sistem", "sistem", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/xetti-berabersizlik.html")) b.push("dersler/xetti-berabersizlik.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
