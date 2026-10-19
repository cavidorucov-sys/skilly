// Kvadrat və rasional bərabərsizliklər (intervallar üsulu) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
// One engine (analyze) handles every product/quotient of linear factors: critical points, signs, solution set.
// Integer answers come from brute force with exact integer arithmetic; lengths from exact fractions.
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
  const OPS = ["<", ">", "≤", "≥"];
  const cmp = (a, op, b) => op === "<" ? a < b : op === ">" ? a > b : op === "≤" ? a <= b : a >= b;
  const sum = a => a.reduce((s, v) => s + v, 0);
  const list = a => a.length <= 8 ? a.map(S).join("; ") : a.slice(0, 3).map(S).join("; ") + "; …; " + a.slice(-2).map(S).join("; ");
  // exact fractions [p, q], q > 0
  const R = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return [p / g, q / g]; };
  const val = r => r[0] / r[1];
  const radd = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const rsub = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const rf = r => frac(r[0], r[1]);

  // factor {k, p, m, d}: (k·x − p)^m, d — in the denominator
  const root = f => R(f.p, f.k);
  const fTxt = f => { const body = f.k < 0 ? poly([[-f.p, ""], [f.k, "x"]]) : poly([[f.k, "x"], [-f.p, ""]]); const t = body === "x" ? "x" : "(" + body + ")"; return f.m === 2 ? t + "²" : t; };
  function expr(F, lead = 1) {
    const num = F.filter(f => !f.d).map(fTxt).join(""), den = F.filter(f => f.d).map(fTxt);
    const pre = lead === -1 ? "−" : lead !== 1 ? S(lead) : "";
    if (!den.length) return pre + num;
    return pre + (num || "1") + "/" + (den.length === 1 ? den[0] : "(" + den.join("") + ")");
  }

  function analyze(F, lead, op) {
    const pts = [];
    for (const f of F) { const r = root(f); let P = pts.find(z => z.r[0] === r[0] && z.r[1] === r[1]); if (!P) { P = { r, den: false }; pts.push(P); } if (f.d) P.den = true; }
    pts.sort((a, b) => val(a.r) - val(b.r));
    const sign = x => { let s = lead; for (const f of F) s *= Math.sign(f.k * x - f.p) ** f.m; return s; };
    const satX = x => { for (const f of F) if (f.d && f.k * x - f.p === 0) return false; return cmp(sign(x), op, 0); };
    const n = pts.length, v = pts.map(P => val(P.r));
    const tests = n ? [v[0] - 1, ...v.slice(1).map((x, i) => (x + v[i]) / 2), v[n - 1] + 1] : [0];
    const signs = tests.map(sign), intSat = signs.map(s => cmp(s, op, 0));
    const ptSat = pts.map(P => !P.den && (op === "≤" || op === "≥"));
    // union of runs over the sequence I0, P0, I1, P1, …, In
    const items = []; for (let i = 0; i <= n; i++) { items.push({ t: "I", i, ok: intSat[i] }); if (i < n) items.push({ t: "P", i, ok: ptSat[i] }); }
    const parts = []; let st = null;
    items.forEach((it, j) => { if (it.ok && st === null) st = j; if ((!it.ok || j === items.length - 1) && st !== null) { const en = it.ok ? j : j - 1; parts.push([items[st], items[en]]); st = null; } });
    const L = it => it.t === "P" ? "[" + rf(pts[it.i].r) : it.i === 0 ? "(−∞" : "(" + rf(pts[it.i - 1].r);
    const Rr = it => it.t === "P" ? rf(pts[it.i].r) + "]" : it.i === n ? "+∞)" : rf(pts[it.i].r) + ")";
    const union = parts.length ? parts.map(([a, b]) => a === b && a.t === "P" ? "{" + rf(pts[a.i].r) + "}" : L(a) + "; " + Rr(b)).join(" ∪ ") : "∅ (həll yoxdur)";
    const ints = []; for (let x = -300; x <= 300; x++) if (satX(x)) ints.push(x);
    let len = [0, 1], nInt = 0; for (let i = 1; i < n; i++) if (intSat[i]) { len = radd(len, rsub(pts[i].r, pts[i - 1].r)); nInt++; }
    return { pts, signs, intSat, ptSat, union, ints, satX, satL: intSat[0], satR: intSat[n], bounded: !intSat[0] && !intSat[n], len, nInt, op };
  }
  const signTxt = A => A.signs.map(s => s > 0 ? "+" : "−").join("  ");
  const ptsTxt = A => A.pts.map(P => rf(P.r) + (P.den ? " (məxrəcin sıfırı — həmişə çıxarılır)" : "")).join("; ");
  const engineSol = A => `Kritik nöqtələr: ${ptsTxt(A)}. İşarələr soldan sağa: ${signTxt(A)}. Həll: ${A.union}.`;

  // choose a question that has a finite numeric answer
  function ask(A) {
    const xs = A.ints;
    if (!xs.length && A.bounded) return { q: "Bərabərsizliyin neçə tam həlli var?", answer: 0, show: "0", ex: "Tam həll yoxdur — cavab 0." };
    const o = [];
    if (A.bounded) { o.push("count", "count", "sum", "min", "max"); if (A.len[0] > 0) o.push("len"); }
    else { if (!A.satL) o.push("min"); if (!A.satR) o.push("max"); if (A.satL && A.satR) o.push("not", "not", "negmax", "posmin"); }
    const k = pick(o);
    if (k === "count") return { q: "Bərabərsizliyin neçə tam həlli var?", answer: xs.length, show: String(xs.length), ex: `Tam həllər: ${list(xs)} — cəmi ${xs.length}.` };
    if (k === "sum") return { q: "Tam həllərinin cəmini tap.", answer: sum(xs), show: S(sum(xs)), ex: `Tam həllər: ${list(xs)}. Cəmi: ${S(sum(xs))}.` };
    if (k === "min") return { q: "Ən kiçik tam həllini tap.", answer: xs[0], show: S(xs[0]), ex: `Ən kiçik tam həll: ${S(xs[0])}.` };
    if (k === "max") return { q: "Ən böyük tam həllini tap.", answer: xs[xs.length - 1], show: S(xs[xs.length - 1]), ex: `Ən böyük tam həll: ${S(xs[xs.length - 1])}.` };
    if (k === "len") return { q: A.nInt > 1 ? "Həll aralıqlarının uzunluqlarının cəmini tap." : "Həll aralığının uzunluğunu tap.", answer: val(A.len), show: rf(A.len), ex: `Uzunluq${A.nInt > 1 ? "ların cəmi" : ""}: ${rf(A.len)}.` };
    if (k === "negmax") { const v = xs.filter(x => x < 0).pop(); return { q: "Ən böyük mənfi tam həllini tap.", answer: v, show: S(v), ex: `Ən böyük mənfi tam həll: ${S(v)}.` }; }
    if (k === "posmin") { const v = xs.find(x => x > 0); return { q: "Ən kiçik müsbət tam həllini tap.", answer: v, show: S(v), ex: `Ən kiçik müsbət tam həll: ${S(v)}.` }; }
    const non = []; for (let x = -300; x <= 300; x++) if (!A.satX(x)) non.push(x);
    return { q: "Neçə tam ədəd bu bərabərsizliyin həlli deyil?", answer: non.length, show: String(non.length), ex: non.length ? `Həll olmayan tam ədədlər: ${list(non)} — cəmi ${non.length}.` : "Bütün ədədlər həlldir — cavab 0." };
  }
  const out = (text, A, pre, svg) => { const a = ask(A); return { text: text + " " + a.q, svg, answer: a.answer, show: a.show, tol: 0.01, solution: (pre ? pre + " " : "") + engineSol(A) + " " + a.ex }; };

  // SVG sign chart (points evenly spaced, not to scale): ● — zero, ○ — excluded
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  function chart(A) {
    const n = A.pts.length, W = 300, y = 40, X = i => n === 1 ? 150 : 40 + i * 220 / (n - 1);
    const g = sv("svg", { viewBox: `0 0 ${W} 72`, class: "oy-svg", role: "img", "aria-label": "İşarə sxemi" });
    g.append(sv("line", { x1: 6, y1: y, x2: W - 6, y2: y, stroke: "var(--ink)", "stroke-width": 2 }));
    g.append(sv("path", { d: `M${W - 6} ${y}l-9 -5v10z`, fill: "var(--ink)" }));
    const mids = [ (6 + X(0)) / 2, ...A.pts.slice(1).map((_, i) => (X(i) + X(i + 1)) / 2), (X(n - 1) + W - 10) / 2 ];
    A.signs.forEach((s, i) => g.append(sv("text", { x: mids[i], y: y - 10, "text-anchor": "middle", class: "oy-lbl", style: "font-size:20px" }, s > 0 ? "+" : "−")));
    A.pts.forEach((P, i) => {
      g.append(sv("circle", { cx: X(i), cy: y, r: 5.5, fill: P.den ? "var(--sheet)" : "var(--accent)", stroke: "var(--accent)", "stroke-width": 2.5 }));
      g.append(sv("text", { x: X(i), y: y + 24, "text-anchor": "middle", class: "oy-lbl" }, rf(P.r)));
    });
    return g;
  }

  const levels = [
    { id: "kvadrat", ad: "Kvadrat bərabərsizlik", izah: "Kökləri tap. a > 0 olanda üçhədli köklər arasında mənfi, kənarlarda müsbətdir (a < 0 olanda — əksinə).",
      gen() {
        const op = pick(OPS);
        let F, lead = 1, txt;
        if (Math.random() < .7) {
          const [r1, r2] = distinct(2, -8, 8); lead = Math.random() < .3 ? -1 : 1;
          F = [{ k: 1, p: r1, m: 1 }, { k: 1, p: r2, m: 1 }];
          txt = poly([[lead, "x²"], [-lead * (r1 + r2), "x"], [lead * r1 * r2, ""]]);
        } else {
          const a = pick([2, 3]), r1 = rnd(-6, 6); let p; do p = rnd(-9, 9); while (p % a === 0);
          F = [{ k: a, p, m: 1 }, { k: 1, p: r1, m: 1 }];
          txt = poly([[a, "x²"], [-(p + a * r1), "x"], [p * r1, ""]]);
        }
        const A = analyze(F, lead, op), rs = A.pts.map(P => rf(P.r));
        const pre = `${txt} = 0 → x₁ = ${rs[0]}, x₂ = ${rs[1]}. ${lead < 0 ? "a < 0 — parabolanın qolları aşağı: köklər arasında müsbət, kənarlarda mənfi." : "a > 0 — parabolanın qolları yuxarı: köklər arasında mənfi, kənarlarda müsbət."}`;
        return out(`${txt} ${op} 0.`, A, pre);
      } },
    { id: "isare", ad: "İntervallar üsulu", izah: "Hər vuruğun sıfırını ədəd oxunda qeyd et, ən sağ intervalda işarəni tap, sonra işarələri növbələ.",
      gen() {
        const op = pick(OPS), F = [], used = [];
        while (F.length < 3) {
          const t = pick(["a", "a", "b", "c"]); let f;
          if (t === "c") { let p; do p = rnd(-13, 13); while (p % 2 === 0); f = { k: 2, p, m: 1 }; }
          else { const r = rnd(-7, 7), k = t === "a" ? 1 : -1; if (k < 0 && r === 0) continue; f = { k, p: k * r, m: 1 }; }
          const v = val(root(f)); if (used.includes(v)) continue; used.push(v); F.push(f);
        }
        const A = analyze(F, 1, op), neg = F.filter(f => f.k < 0);
        const pre = neg.length ? (neg.length > 1 ? `Diqqət: ${neg.map(fTxt).join(", ")} vuruqlarında x mənfi işarə ilə gəlir — ən sağ intervalda bu vuruqlar mənfidir.` : `Diqqət: ${fTxt(neg[0])} vuruğunda x mənfi işarə ilə gəlir — ən sağ intervalda bu vuruq mənfidir.`) : "Ən sağ intervalda bütün vuruqlar müsbətdir.";
        return out(`${expr(F)} ${op} 0.`, A, pre);
      } },
    { id: "rasional", ad: "Rasional bərabərsizlik", izah: "Məxrəcə vurma! Hər şeyi bir tərəfə keçir, kəsri sıfırla müqayisə et. Məxrəcin sıfırları həmişə boş nöqtədir.",
      gen() {
        const op = pick(OPS), kind = pick(["11", "21", "12", "move", "move"]);
        if (kind === "move") {
          const b = rnd(-6, 6), c = pick([-3, -2, -1, 1, 2, 3]), a = c * nz(-6, 6);
          const den = { k: 1, p: b, m: 1, d: true }, F = [{ k: -c, p: -(a + c * b), m: 1 }, den];
          const A = analyze(F, 1, op);
          const pre = `Məxrəcə vurmaq olmaz — onun işarəsi məlum deyil. ${S(c)} ədədini sola keçir, ortaq məxrəcə gətir: (${S(a)} ${c < 0 ? "+" : "−"} ${Math.abs(c) === 1 ? "" : Math.abs(c)}${fTxt(den)})/${fTxt(den)} ${op} 0 → ${expr(F)} ${op} 0.`;
          return out(`${S(a)}/${fTxt(den)} ${op} ${S(c)}.`, A, pre);
        }
        const nNum = kind === "21" ? 2 : 1, nDen = kind === "12" ? 2 : 1, rs = distinct(nNum + nDen, -7, 7);
        const F = rs.map((r, i) => { const k = Math.random() < .25 && r !== 0 ? -1 : 1; return { k, p: k * r, m: 1, d: i >= nNum }; });
        const A = analyze(F, 1, op);
        return out(`${expr(F)} ${op} 0.`, A, "Məxrəcin sıfırları həmişə boş dairədir (orada kəsrin mənası yoxdur).");
      } },
    { id: "cut", ad: "Cüt dərəcəli vuruq", izah: "(x − a)² vuruğunun nöqtəsindən keçəndə işarə dəyişmir. D ≤ 0 olan üçhədliyə də diqqət.",
      gen() {
        const op = pick(OPS), kind = pick(["sq1", "sq2", "sqd", "d0", "dneg"]);
        if (kind === "dneg") {
          const b = rnd(-6, 6), c = Math.floor(b * b / 4) + rnd(1, 6), txt = poly([[1, "x²"], [b, "x"], [c, ""]]), D = b * b - 4 * c;
          const pre = `D = ${b * b} − ${4 * c} = ${S(D)} < 0 — kök yoxdur, a = 1 > 0, ona görə ${txt} həmişə müsbətdir.`;
          if (op === "<" || op === "≤") return { text: `${txt} ${op} 0. Bərabərsizliyin neçə tam həlli var?`, answer: 0, show: "0", tol: 0.01, solution: pre + " Həll yoxdur — cavab 0." };
          return Math.random() < .5
            ? { text: `${txt} ${op} 0. Neçə tam ədəd bu bərabərsizliyin həlli deyil?`, answer: 0, show: "0", tol: 0.01, solution: pre + " Bütün ədədlər həlldir — həll olmayan tam ədəd yoxdur, cavab 0." }
            : { text: `${txt} ${op} 0. Ən böyük mənfi tam həllini tap.`, answer: -1, show: "−1", tol: 0.01, solution: pre + " Bütün ədədlər həlldir, ona görə ən böyük mənfi tam həll −1." };
        }
        let F, txt;
        if (kind === "d0") {
          const a = nz(-7, 7); F = [{ k: 1, p: a, m: 2 }]; txt = poly([[1, "x²"], [-2 * a, "x"], [a * a, ""]]);
          const A = analyze(F, 1, op);
          return out(`${txt} ${op} 0.`, A, `${txt} = ${fTxt(F[0])} — tam kvadrat (D = 0). O, həmişə ≥ 0-dır və yalnız x = ${S(a)} olanda sıfırdır.`);
        }
        if (kind === "sq1") { const [a, b] = distinct(2, -6, 6); F = [{ k: 1, p: a, m: 2 }, { k: 1, p: b, m: 1 }]; }
        else if (kind === "sq2") { const [a, b, c] = distinct(3, -6, 6); F = [{ k: 1, p: a, m: 2 }, { k: 1, p: b, m: 1 }, { k: 1, p: c, m: 1 }]; }
        else { const [a, b] = distinct(2, -6, 6), top = Math.random() < .5; F = [{ k: 1, p: a, m: 2, d: !top }, { k: 1, p: b, m: 1, d: top }]; }
        const sq = F.find(f => f.m === 2), A = analyze(F, 1, op);
        return out(`${expr(F)} ${op} 0.`, A, `${fTxt(sq)} cüt dərəcəlidir: x = ${rf(root(sq))} nöqtəsindən keçəndə işarə dəyişmir.`);
      } },
    { id: "sxem", ad: "Sxemi oxu", izah: "Sxemdə f(x)-in işarələri verilib. ● — f(x) = 0 (≥, ≤ olanda daxildir), ○ — f(x)-in mənası yoxdur (heç vaxt daxil deyil).",
      gen() {
        const n = rnd(2, 4), rs = distinct(n, -6, 6).sort((a, b) => a - b), op = pick(OPS);
        const F = rs.map(r => ({ k: 1, p: r, m: Math.random() < .25 ? 2 : 1, d: Math.random() < .3 }));
        if (F.every(f => f.d)) F[rnd(0, n - 1)].d = false;
        const A = analyze(F, pick([1, -1]), op), a = ask(A);
        return { text: `Şəkildə f(x) funksiyasının işarə sxemi verilib (● — f(x) = 0, ○ — f(x)-in mənası yoxdur). f(x) ${op} 0 bərabərsizliyinə baxırıq. ${a.q}`, svg: chart(A), answer: a.answer, show: a.show, tol: 0.01,
          solution: `${op === "<" || op === "≤" ? "“−”" : "“+”"} olan intervalları götürürük${op === "≤" || op === "≥" ? ", dolu nöqtələri də əlavə edirik" : ", nöqtələr daxil deyil"}; boş nöqtələr heç vaxt daxil deyil. Həll: ${A.union}. ${a.ex}` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində ilk səhv var. Hansında?",
      gen() {
        let a, b; do { [a, b] = distinct(2, -7, 7); } while (a === 0 || -a === b);
        const op = pick(["≥", "≤"]), ft = r => fTxt({ k: 1, p: r, m: 1 });
        // solution set for numerator root u (closed) and denominator root w (open), signs "+−+" or "−+−"
        const set = (u, w, sg, wClosed) => {
          const lo = Math.min(u, w), hi = Math.max(u, w), cl = v => v === u || (v === w && wClosed);
          const outside = (op === "≥") === (sg === "+");
          return outside ? `(−∞; ${S(lo)}${cl(lo) ? "]" : ")"} ∪ ${cl(hi) ? "[" : "("}${S(hi)}; +∞)` : `${cl(lo) ? "[" : "("}${S(lo)}; ${S(hi)}${cl(hi) ? "]" : ")"}`;
        };
        const st = [`Kritik nöqtələr: x = ${S(a)} (surət sıfırdır), x = ${S(b)} (məxrəc sıfırdır).`, "İşarələr soldan sağa: +  −  +.", `Cavab: ${set(a, b, "+")}.`];
        const bad = rnd(0, 2);
        if (bad === 0) { st[0] = `Kritik nöqtələr: x = ${S(-a)} (surət sıfırdır), x = ${S(b)} (məxrəc sıfırdır).`; st[2] = `Cavab: ${set(-a, b, "+")}.`; }
        if (bad === 1) { st[1] = "İşarələr soldan sağa: −  +  −."; st[2] = `Cavab: ${set(a, b, "−")}.`; }
        if (bad === 2) st[2] = `Cavab: ${set(a, b, "+", true)}.`;
        const text = h("div", {}, h("p", {}, `Bərabərsizlik: ${ft(a)}/${ft(b)} ${op} 0.`), h("ol", { class: "oy-steps" }, ...st.map(s => h("li", {}, s))));
        const why = [`1-ci addım: ${ft(a)} = 0 → x = ${S(a)}, ${S(-a)} yox.`,
          `2-ci addım: ən sağ intervalda (x çox böyük) həm surət, həm məxrəc müsbətdir — işarə +. Düzü: +  −  +.`,
          `3-cü addım: x = ${S(b)} məxrəci sıfır edir — o nöqtə heç vaxt daxil deyil, mötərizə dairəvi olmalıdır. Düzü: ${set(a, b, "+")}.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Məsələ → kvadrat bərabərsizlik → köklər arası aralıq. Cavab: müddət və ya tam qiymətlərin sayı.",
      gen() {
        const kind = pick(["top", "hasar", "qiymet"]);
        if (kind === "top") {
          const [t1, t2] = distinct(2, 1, 6).sort((a, b) => a - b), v = 5 * (t1 + t2), H = 5 * t1 * t2;
          return { text: `Top yerdən ${v} m/s sürətlə şaquli yuxarı atılıb. t saniyədən sonra onun hündürlüyü h = ${v}t − 5t² metrdir. Top neçə saniyə ərzində ${H} m-dən aşağı olmayan hündürlükdə olur?`, answer: t2 - t1, unit: "s", show: (t2 - t1) + " s", tol: 0.01,
            solution: `${v}t − 5t² ≥ ${H} → 5t² − ${v}t + ${H} ≤ 0 → t² − ${t1 + t2}t + ${t1 * t2} ≤ 0 → (t − ${t1})(t − ${t2}) ≤ 0 → ${t1} ≤ t ≤ ${t2}. Müddət: ${t2} − ${t1} = ${t2 - t1} s.` };
        }
        let r1, r2; do { r1 = rnd(1, 9); r2 = rnd(r1 + 1, 16); } while (r2 - r1 > 10);
        if (kind === "hasar") {
          const s = r1 + r2, A = r1 * r2;
          return { text: `Uzunluğu ${2 * s} m olan hasarla düzbucaqlı sahə hasarlanır. Sahənin bir tərəfi x m-dir (x — tam ədəd). Sahənin sahəsi ən azı ${A} m² olmalıdır. x neçə müxtəlif qiymət ala bilər?`, answer: r2 - r1 + 1, show: String(r2 - r1 + 1), tol: 0.01,
            solution: `O biri tərəf ${s} − x. x(${s} − x) ≥ ${A} → x² − ${s}x + ${A} ≤ 0 → (x − ${r1})(x − ${r2}) ≤ 0 → ${r1} ≤ x ≤ ${r2}. Tam qiymətlər: ${r1}; …; ${r2} — cəmi ${r2 - r1 + 1}.` };
        }
        const k = pick([1, 2, 5]), N = k * (r1 + r2), Rv = k * r1 * r2;
        return { text: `Məhsulun qiyməti x manat olanda gündə ${N} − ${k === 1 ? "" : k}x ədəd satılır. Gündəlik gəlir ən azı ${Rv} manat olsun deyə qiymət (tam manat) neçə müxtəlif qiymət ala bilər?`, answer: r2 - r1 + 1, show: String(r2 - r1 + 1), tol: 0.01,
          solution: `Gəlir = qiymət · say: x(${N} − ${k === 1 ? "" : k}x) ≥ ${Rv} → ${poly([[k, "x²"], [-N, "x"], [Rv, ""]])} ≤ 0${k === 1 ? "" : ` → x² − ${r1 + r2}x + ${r1 * r2} ≤ 0`} → (x − ${r1})(x − ${r2}) ≤ 0 → ${r1} ≤ x ≤ ${r2}. Tam qiymətlər: ${r2 - r1 + 1}.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "intervallar-usulu", title: "Kvadrat və rasional bərabərsizliklər", fenn: "riyaziyyat", link: "dersler/intervallar-usulu.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 7/2 (onluq 3.5 də olar). Tam həll yoxdursa və say soruşulursa — 0.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["kvadrat", "kvadrat", "isare", "isare", "rasional", "rasional", "cut", "cut", "sxem", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/intervallar-usulu.html")) b.push("dersler/intervallar-usulu.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
