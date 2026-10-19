// Qrafiklərin çevrilməsi — mastery game levels (f(x) + a, f(x + a), −f(x), f(−x), |f(x)|, parabola vertex shifts,
// recognising a shifted graph, word problems) and the final test. Graph levels draw y = f(x) on an SVG coordinate plane.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n === 0 ? 0 : n);                 // number with a real minus sign
  const D = n => S(Math.round(n * 100) / 100).replace(".", ",");               // decimal with a comma
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  // polynomial from [coef, "x²"|"x"|""] terms: [[1,"x²"],[-5,"x"],[6,""]] → "x² − 5x + 6"
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const lin = p => poly([[1, "x"], [-p, ""]]);                                  // x − p
  const tail = n => n ? (n < 0 ? " − " + (-n) : " + " + n) : "";               // " + 3" / " − 3" / ""
  const P = (a, b) => `(${S(a)}; ${S(b)})`;                                      // point (a; b)
  const NS = "http://www.w3.org/2000/svg";
  // ---- coordinate plane as an SVG string: grid, axes with arrows, ticks, clipped curves, polylines, points, labels ----
  // o = { x:[x0,x1], y:[y0,y1], u?, tx?, ty?, xn?, yn?, f:[{f,a,b,c,w,dash}], pl:[{pts,c,w,dots}], pts:[{x,y,t,c,open,dx,dy}],
  //       hl:[{y,c}], vl:[{x,c}], tl:[{x,y,t,c,a}] }
  let PID = 0;
  function plot(o) {
    const [x0, x1] = o.x, [y0, y1] = o.y;
    const u = o.u || Math.max(14, Math.min(26, Math.floor(280 / (x1 - x0))));
    const pl = x0 >= 0 ? 26 : 16, pr = 16, pt = 16, pb = y0 >= 0 ? 20 : 16;
    const W = (x1 - x0) * u + pl + pr, H = (y1 - y0) * u + pt + pb;
    const X = x => +(pl + (x - x0) * u).toFixed(1), Y = y => +(pt + (y1 - y) * u).toFixed(1);
    const id = "pc" + (++PID) + "x" + Math.floor(Math.random() * 1e6);
    const M = n => n < 0 ? "−" + (-n) : String(n);
    let s = "";
    for (let x = Math.ceil(x0); x <= x1; x++) s += `<line x1="${X(x)}" y1="${Y(y1)}" x2="${X(x)}" y2="${Y(y0)}" stroke="var(--bubble)" stroke-opacity=".4" stroke-width="1"/>`;
    for (let y = Math.ceil(y0); y <= y1; y++) s += `<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" stroke="var(--bubble)" stroke-opacity=".4" stroke-width="1"/>`;
    const ax = Y(0), ay = X(0), xe = X(x1) + 10, ye = Y(y1) - 10;
    s += `<line x1="${X(x0)}" y1="${ax}" x2="${xe}" y2="${ax}" stroke="var(--ink)" stroke-width="1.5"/><path d="M${xe - 7} ${ax - 4}L${xe} ${ax}L${xe - 7} ${ax + 4}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += `<line x1="${ay}" y1="${Y(y0)}" x2="${ay}" y2="${ye}" stroke="var(--ink)" stroke-width="1.5"/><path d="M${ay - 4} ${ye + 7}L${ay} ${ye}L${ay + 4} ${ye + 7}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += `<text x="${xe - 2}" y="${ax - 7}" text-anchor="end" class="lbl">${o.xn || "x"}</text><text x="${ay + 7}" y="${ye + 9}" class="lbl">${o.yn || "y"}</text><text x="${ay - 4}" y="${ax + 12}" text-anchor="end">O</text>`;
    const tx = o.tx || (x1 - x0 > 14 ? 2 : 1), ty = o.ty || (y1 - y0 > 14 ? 2 : 1);
    for (let x = Math.ceil(x0 / tx) * tx; x <= x1; x += tx) if (x !== 0) s += `<line x1="${X(x)}" y1="${ax - 3}" x2="${X(x)}" y2="${ax + 3}" stroke="var(--ink)"/><text x="${X(x)}" y="${ax + 13}" text-anchor="middle">${M(x)}</text>`;
    for (let y = Math.ceil(y0 / ty) * ty; y <= y1; y += ty) if (y !== 0) s += `<line x1="${ay - 3}" y1="${Y(y)}" x2="${ay + 3}" y2="${Y(y)}" stroke="var(--ink)"/><text x="${ay - 5}" y="${Y(y) + 4}" text-anchor="end">${M(y)}</text>`;
    let g = "";
    for (const l of o.hl || []) g += `<line x1="${X(x0)}" y1="${Y(l.y)}" x2="${X(x1)}" y2="${Y(l.y)}" stroke="${l.c || "var(--vec)"}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    for (const l of o.vl || []) g += `<line x1="${X(l.x)}" y1="${Y(y0)}" x2="${X(l.x)}" y2="${Y(y1)}" stroke="${l.c || "var(--vec)"}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    for (const c of o.f || []) {
      const a = c.a ?? x0, b = c.b ?? x1, n = 360; let d = "", pen = false;
      for (let i = 0; i <= n; i++) {
        const x = a + (b - a) * i / n, y = c.f(x);
        if (!isFinite(y) || y < y0 - 3 || y > y1 + 3) { pen = false; continue; }
        d += (pen ? "L" : "M") + X(x) + " " + Y(y); pen = true;
      }
      g += `<path d="${d}" fill="none" stroke="${c.c || "var(--accent)"}" stroke-width="${c.w || 2.5}" stroke-linejoin="round"${c.dash ? ' stroke-dasharray="6 4"' : ""}/>`;
    }
    for (const p of o.pl || []) {
      g += `<path d="${p.pts.map((q, i) => (i ? "L" : "M") + X(q[0]) + " " + Y(q[1])).join("")}" fill="none" stroke="${p.c || "var(--accent)"}" stroke-width="${p.w || 2.5}" stroke-linejoin="round"${p.dash ? ' stroke-dasharray="6 4"' : ""}/>`;
      if (p.dots !== false) for (const q of p.pts) g += `<circle cx="${X(q[0])}" cy="${Y(q[1])}" r="3.2" fill="${p.c || "var(--accent)"}"/>`;
    }
    s += `<defs><clipPath id="${id}"><rect x="${X(x0)}" y="${Y(y1)}" width="${X(x1) - X(x0)}" height="${Y(y0) - Y(y1)}"/></clipPath></defs><g clip-path="url(#${id})">${g}</g>`;
    for (const p of o.pts || []) {
      s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4.5" fill="${p.open ? "var(--sheet)" : (p.c || "var(--vec)")}" stroke="${p.c || "var(--vec)"}" stroke-width="2"/>`;
      if (p.t) s += `<text x="${X(p.x) + (p.dx ?? 7)}" y="${Y(p.y) + (p.dy ?? -7)}" class="lbl"${p.dx < 0 ? ' text-anchor="end"' : ""}>${p.t}</text>`;
    }
    for (const t of o.tl || []) s += `<text x="${X(t.x)}" y="${Y(t.y)}" text-anchor="${t.a || "start"}" style="fill:${t.c || "var(--accent)"};font-weight:700;font-size:12px">${t.t}</text>`;
    return { W, H, body: s };
  }
  const svgEl = (o, label) => { const g = plot(o); const e = document.createElementNS(NS, "svg"); e.setAttribute("viewBox", `0 0 ${g.W} ${g.H}`); e.setAttribute("class", "oy-svg"); e.setAttribute("role", "img"); e.setAttribute("aria-label", label || "Koordinat müstəvisi"); e.innerHTML = g.body; return e; };

  // random piecewise-linear function: integer vertices, no flat pieces (every piece strictly rises or falls)
  function randPL(opt = {}) {
    const { xs = [-6, -3], xe = 5, xm = 7, yl = -4, yh = 4, ok } = opt;
    for (let t = 0; t < 2000; t++) {
      let x = rnd(xs[0], xs[1]), y = rnd(yl, yh); const pts = [[x, y]], n = rnd(3, 5);
      for (let i = 0; i < n && x < xe; i++) {
        const dx = rnd(1, 3); let dy = 0;
        for (let g = 0; g < 40 && (!dy || y + dy < yl || y + dy > yh); g++) dy = rnd(-4, 4);
        if (!dy || y + dy < yl || y + dy > yh) break;
        x += dx; y += dy; pts.push([x, y]);
      }
      if (pts.length < 4 || x > xm) continue;
      if (ok && !ok(pts)) continue;
      return pts;
    }
    return [[-4, -2], [-1, 3], [2, -1], [5, 2]];
  }
  const vAt = (pts, x) => { for (let i = 0; i < pts.length - 1; i++) { const [a, p] = pts[i], [b, q] = pts[i + 1]; if (x >= a && x <= b) return p + (q - p) * (x - a) / (b - a); } return NaN; };
  const solveC = (pts, c) => { const r = []; pts.forEach(([x, y]) => { if (y === c) r.push(x); });
    for (let i = 0; i < pts.length - 1; i++) { const [a, p] = pts[i], [b, q] = pts[i + 1]; if ((p - c) * (q - c) < 0) r.push(a + (c - p) * (b - a) / (q - p)); }
    return r.sort((m, n) => m - n); };
  const mono = pts => { const out = []; for (let i = 0; i < pts.length - 1; i++) { const d = Math.sign(pts[i + 1][1] - pts[i][1]), last = out[out.length - 1];
    if (last && last.d === d) last.b = pts[i + 1][0]; else out.push({ a: pts[i][0], b: pts[i + 1][0], d }); } return out; };
  const ys = pts => pts.map(p => p[1]);
  const seg = (a, b) => `[${S(a)}; ${S(b)}]`;
  // base function for transformations: small, so shifted copies still fit the picture
  const base = ok => randPL({ xs: [-4, -2], xe: 3, xm: 4, yl: -3, yh: 3, ok });
  const fSvg = pts => svgEl({ x: [-7, 7], y: [-5, 5], pl: [{ pts }] }, "y = f(x) funksiyasının qrafiki");
  const GR = "Şəkildə y = f(x) funksiyasının qrafiki verilib.";
  const arg = a => a ? `x ${a > 0 ? "+" : "−"} ${Math.abs(a)}` : "x";          // x + a
  const br = n => n < 0 ? "(" + S(n) + ")" : String(n);
  const sq = (s, m, n) => `${s < 0 ? "−" : ""}${m ? "(" + lin(m) + ")²" : "x²"}${tail(n)}`;    // ±(x − m)² + n
  const md = (s, m, n) => `${s < 0 ? "−" : ""}|${lin(m)}|${tail(n)}`;                         // ±|x − m| + n
  const LR = p => p > 0 ? `${p} vahid sağa` : `${-p} vahid sola`, UD = q => q > 0 ? `${q} vahid yuxarı` : `${-q} vahid aşağı`;

  const levels = [
    { id: "yuxari", ad: "y = f(x) + a", izah: "Bütün qrafik a vahid yuxarı (a > 0) və ya aşağı (a < 0) sürüşür: x-lər eyni, hər y-ə a əlavə olunur.",
      gen() {
        const pts = base(), a = pick([-1, 1]) * rnd(1, 3), g = `g(x) = f(x)${tail(a)}`, kind = pick(["val", "val", "max", "min"]);
        if (kind === "val") { const [x, y] = pick(pts), v = y + a;
          return { text: `${GR} ${g}. g(${S(x)}) = ?`, svg: fSvg(pts), answer: v, show: S(v), tol: 0.01,
            solution: `Qrafikdən f(${S(x)}) = ${S(y)}. g(${S(x)}) = f(${S(x)})${tail(a)} = ${S(y)}${tail(a)} = ${S(v)}. Qrafik ${UD(a)} sürüşüb.` }; }
        const e = kind === "max" ? Math.max(...ys(pts)) : Math.min(...ys(pts)), v = e + a;
        return { text: `${GR} ${g}. g funksiyasının ən ${kind === "max" ? "böyük" : "kiçik"} qiyməti neçədir?`, svg: fSvg(pts), answer: v, show: S(v), tol: 0.01,
          solution: `f-in ən ${kind === "max" ? "böyük" : "kiçik"} qiyməti ${S(e)}. Qrafik ${UD(a)} sürüşür, hər qiymət ${a > 0 ? a + " artır" : -a + " azalır"}: ${S(e)}${tail(a)} = ${S(v)}.` };
      } },
    { id: "saga", ad: "y = f(x + a)", izah: "f(x − a) — a vahid SAĞA, f(x + a) — a vahid SOLA. Mötərizənin içində işarə tərsinə işləyir!",
      gen() {
        const pts = base(), a = pick([-1, 1]) * rnd(1, 3), kind = pick(["val", "val", "comb", "D", "arg"]);
        const g = `g(x) = f(${arg(a)})`, dir = a > 0 ? `${a} vahid sola` : `${-a} vahid sağa`;
        if (kind === "val" || kind === "comb") {
          const [u, y] = pick(pts), x = u - a, b = kind === "comb" ? pick([-1, 1]) * rnd(1, 2) : 0, v = y + b;
          return { text: `${GR} g(x) = f(${arg(a)})${tail(b)}. g(${S(x)}) = ?`, svg: fSvg(pts), answer: v, show: S(v), tol: 0.01,
            solution: `g(${S(x)}) = f(${S(x)}${tail(a)})${tail(b)} = f(${S(u)})${tail(b)}. Qrafikdən f(${S(u)}) = ${S(y)}` + (b ? `, cavab ${S(y)}${tail(b)} = ${S(v)}.` : `. Cavab: ${S(v)}.`) }; }
        if (kind === "D") { const L = pts[0][0], R = pts[pts.length - 1][0], left = Math.random() < .5, v = (left ? L : R) - a;
          return { text: `${GR} ${g}. g funksiyasının təyin oblastının ${left ? "sol" : "sağ"} ucu neçədir?`, svg: fSvg(pts), answer: v, show: S(v), tol: 0.01,
            solution: `D(f) = ${seg(L, R)}. f(${arg(a)}) — qrafik ${dir} sürüşür: D(g) = ${seg(L - a, R - a)}. Cavab: ${S(v)}.` }; }
        const hi = Math.max(...ys(pts)), at = pts.filter(p => p[1] === hi);
        if (at.length === 1) { const v = at[0][0] - a;
          return { text: `${GR} ${g}. g funksiyası ən böyük qiymətini hansı x-də alır?`, svg: fSvg(pts), answer: v, show: S(v), tol: 0.01,
            solution: `f ən böyük qiyməti (${S(hi)}) x = ${S(at[0][0])}-də alır. Qrafik ${dir} sürüşür: x = ${S(at[0][0])}${tail(-a)} = ${S(v)}. Yoxla: g(${S(v)}) = f(${S(v)}${tail(a)}) = f(${S(at[0][0])}).` }; }
        const [u, y] = pick(pts);
        return { text: `${GR} ${g}. g(${S(u - a)}) = ?`, svg: fSvg(pts), answer: y, show: S(y), tol: 0.01,
          solution: `g(${S(u - a)}) = f(${S(u - a)}${tail(a)}) = f(${S(u)}) = ${S(y)}.` };
      } },
    { id: "eks", ad: "−f(x), f(−x), |f(x)|", izah: "−f(x): Ox-a görə əks (y işarəsini dəyişir). f(−x): Oy-a görə əks (x işarəsini dəyişir). |f(x)|: Ox-dan aşağı hissə yuxarı qatlanır.",
      gen() {
        const pts = base(p => p.some(q => q[1] < 0)), kind = pick(["neg", "refl", "abs", "abs", "absmax", "negmax"]), [x, y] = pick(pts), svg = fSvg(pts);
        if (kind === "neg") return { text: `${GR} g(x) = −f(x). g(${S(x)}) = ?`, svg, answer: -y, show: S(-y), tol: 0.01,
          solution: `g(${S(x)}) = −f(${S(x)}) = −(${S(y)}) = ${S(-y)}. Qrafik Ox oxuna nəzərən əks olunur.` };
        if (kind === "refl") return { text: `${GR} g(x) = f(−x). g(${S(-x)}) = ?`, svg, answer: y, show: S(y), tol: 0.01,
          solution: `g(${S(-x)}) = f(−(${S(-x)})) = f(${S(x)}) = ${S(y)}. Qrafik Oy oxuna nəzərən əks olunur.` };
        if (kind === "abs") { const [u, w] = Math.random() < .7 ? pick(pts.filter(q => q[1] < 0)) : [x, y];
          return { text: `${GR} g(x) = |f(x)|. g(${S(u)}) = ?`, svg, answer: Math.abs(w), show: String(Math.abs(w)), tol: 0.01,
            solution: `g(${S(u)}) = |f(${S(u)})| = |${S(w)}| = ${Math.abs(w)}. Ox-dan aşağıdakı hissə yuxarı qatlanır.` }; }
        if (kind === "absmax") { const v = Math.max(...ys(pts).map(Math.abs));
          return { text: `${GR} g(x) = |f(x)|. g funksiyasının ən böyük qiyməti neçədir?`, svg, answer: v, show: String(v), tol: 0.01,
            solution: `|f(x)| — qiymətlərin modulu. f-in ən böyük qiyməti ${S(Math.max(...ys(pts)))}, ən kiçiyi ${S(Math.min(...ys(pts)))}. Modulların ən böyüyü ${v}.` }; }
        const lo = Math.min(...ys(pts));
        return { text: `${GR} g(x) = −f(x). g funksiyasının ən böyük qiyməti neçədir?`, svg, answer: -lo, show: S(-lo), tol: 0.01,
          solution: `Qrafik Ox-a görə çevrilir: f-in ən aşağı nöqtəsi (y = ${S(lo)}) ən yuxarı olur. Ən böyük qiymət −(${S(lo)}) = ${S(-lo)}.` };
      } },
    { id: "teper", ad: "Parabolanın təpəsi", izah: "y = a(x − m)² + n parabolasının təpəsi (m; n). y = x²-ni p sağa, q yuxarı sürüşdür → təpə (p; q).",
      gen() {
        const kind = pick(["form", "shift", "full", "full", "oy", "other"]), ab = Math.random() < .5, W = ab ? "absisi" : "ordinatı";
        const out = (text, m, n, sol) => ({ text: `${text} Təpənin ${W} neçədir?`, answer: ab ? m : n, show: S(ab ? m : n), tol: 0.01, solution: `${sol} Təpə ${P(m, n)}, ${ab ? "absis" : "ordinat"} ${S(ab ? m : n)}.` });
        if (kind === "form") { const a = pick([1, -1, 2, -2, 3, -3]), m = rnd(-6, 6), n = rnd(-9, 9);
          const A = a === 1 ? "" : a === -1 ? "−" : S(a);
          return out(`y = ${A}${m ? "(" + lin(m) + ")²" : "x²"}${tail(n)} parabolası.`, m, n, `y = a(x − m)² + n şəklindədir: mötərizədə ${m ? lin(m) + " → m = " + S(m) : "x → m = 0"}, n = ${S(n)}. a təpəyə təsir etmir.`); }
        if (kind === "shift") { const p = pick([-1, 1]) * rnd(1, 6), q = pick([-1, 1]) * rnd(1, 6);
          return out(`y = x² parabolasını ${LR(p)} və ${UD(q)} sürüşdürdülər.`, p, q, `Təpə (0; 0)-dan ${LR(p)} və ${UD(q)} gedir. Yeni parabola y = ${sq(1, p, q)}.`); }
        if (kind === "full") { const m = pick([-1, 1]) * rnd(1, 4), n = rnd(-6, 6), b = -2 * m, c = m * m + n, p = pick([-1, 1]) * rnd(1, 4), q = pick([-1, 1]) * rnd(1, 4);
          return out(`y = ${poly([[1, "x²"], [b, "x"], [c, ""]])} parabolasını ${LR(p)} və ${UD(q)} sürüşdürdülər. Yeni parabola üçün:`, m + p, n + q,
            `Tam kvadrat: y = (${lin(m)})²${tail(n)}, təpə ${P(m, n)} (m = −b/2 = ${S(m)}). ${LR(p)}: ${S(m)}${tail(p)} = ${S(m + p)}; ${UD(q)}: ${S(n)}${tail(q)} = ${S(n + q)}.`); }
        if (kind === "oy") { const m = pick([-1, 1]) * rnd(1, 5), n = rnd(-9, 9), s = pick([1, -1]), v = s * m * m + n;
          return { text: `y = ${sq(s, m, n)} parabolası Oy oxunu hansı nöqtədə kəsir? Həmin nöqtənin ordinatını yaz.`, answer: v, show: S(v), tol: 0.01,
            solution: `Oy oxunda x = 0: y = ${s < 0 ? "−" : ""}(0${tail(-m)})²${tail(n)} = ${S(s * m * m)}${tail(n)} = ${S(v)}.` }; }
        const m = pick([-1, 1]) * rnd(1, 5), n = rnd(-6, 6), t = pick(["mod", "kok", "hyp"]);
        if (t === "mod") return out(`y = |${lin(m)}|${tail(n)} funksiyasının qrafiki "bucaq"dır (y = |x|-in sürüşməsi).`, m, n, `y = |x| qrafiki ${m ? LR(m) : "sola-sağa getmir"}${n ? " və " + UD(n) : ""} sürüşüb.`);
        if (t === "kok") { const v = ab ? m : n;
          return { text: `y = √(${lin(m)})${tail(n)} funksiyasının qrafiki hansı nöqtədən başlayır? Başlanğıc nöqtənin ${W} neçədir?`, answer: v, show: S(v), tol: 0.01,
            solution: `y = √x qrafiki (0; 0)-dan başlayır. ${m ? LR(m) : ""}${m && n ? " və " : ""}${n ? UD(n) : ""} sürüşmə ilə başlanğıc ${P(m, n)} olur. Cavab: ${S(v)}.` }; }
        const k = pick([-1, 1]) * rnd(1, 6), v = ab ? m : n;
        return { text: `y = ${S(k)}/(${lin(m)})${tail(n)} hiperbolası y = ${S(k)}/x-in sürüşməsidir. Onun ${ab ? "şaquli" : "üfüqi"} asimptotu (qolların yaxınlaşdığı düz xətt) ${ab ? "x" : "y"} = ? `, answer: v, show: S(v), tol: 0.01,
          solution: `y = ${S(k)}/x qolları x = 0 və y = 0 xətlərinə yaxınlaşır. ${m ? LR(m) : ""}${m && n ? " və " : ""}${n ? UD(n) : ""}${m || n ? " sürüşmədən" : "Sürüşmə yoxdur, "} sonra: x = ${S(m)}, y = ${S(n)}. Cavab: ${S(v)}.` };
      } },
    { id: "tani", ad: "Qrafikə görə düstur", izah: "Əvvəl təpəni tap (m; n), sonra yaz: y = ±(x − m)² + n və ya y = ±|x − m| + n. Budaqlar aşağıdırsa — mənfi işarə.",
      gen() {
        const m = pick([-1, 1]) * rnd(1, 3), n = pick([-1, 1]) * rnd(1, 3), s = pick([1, -1]), par = Math.random() < .6, F = par ? sq : md;
        const f = par ? (x => s * (x - m) ** 2 + n) : (x => s * Math.abs(x - m) + n);
        const opts = [[m, n], [-m, n], [m, -n], [-m, -n]].map(([u, v]) => "y = " + F(s, u, v));
        const order = [0, 1, 2, 3].sort(() => Math.random() - .5), choices = order.map(i => opts[i]), correct = order.indexOf(0);
        return { text: "Şəkildə hansı funksiyanın qrafiki verilib?", svg: svgEl({ x: [-7, 7], y: [-5, 5], f: [{ f }], pts: [{ x: m, y: n }] }), choices, correct, show: opts[0],
          solution: `Qrafikin təpəsi ${P(m, n)}: ${LR(m)} və ${UD(n)}. Budaqlar ${s > 0 ? "yuxarı" : "aşağı"}. Düstur: y = ${F(s, m, n)}. Yadda saxla: (x − m) sağa, (x + m) sola aparır.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Parabolanın sürüşdürülməsi üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const m = pick([-1, 1]) * rnd(1, 4), n = rnd(-5, 5), b = -2 * m, c = m * m + n, p = rnd(1, 5), q = rnd(1, 5), right = Math.random() < .5, P2 = right ? p : -p;
        const bad = rnd(0, 2), m1 = bad === 0 ? -m : m, x2 = bad === 1 ? m1 - P2 : m1 + P2, y3 = bad === 2 ? n + q : n - q;   // errors carry forward
        const steps = [
          `Tam kvadrat: y = (${lin(m1)})²${tail(n)}, təpə ${P(m1, n)}.`,
          `${right ? p + " vahid sağa" : p + " vahid sola"}: absis ${S(m1)}${tail(x2 - m1)} = ${S(x2)}.`,
          `${q} vahid aşağı: ordinat ${S(n)} ${bad === 2 ? "+" : "−"} ${q} = ${S(y3)}. Yeni təpə ${P(x2, y3)}.`,
        ];
        const text = h("div", {}, h("p", {}, `y = ${poly([[1, "x²"], [b, "x"], [c, ""]])} parabolasını ${right ? p + " vahid sağa" : p + " vahid sola"} və ${q} vahid aşağı sürüşdürürük:`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x = (${lin(m)})² − ${m * m}, təpənin absisi −b/2 = ${S(m)}, ${S(-m)} yox.`,
          `2-ci addım: ${right ? "sağa — absis artır" : "sola — absis azalır"}: ${S(m)}${tail(P2)} = ${S(m + P2)}.`,
          `3-cü addım: aşağı sürüşmədə ordinat azalır: ${S(n)} − ${q} = ${S(n - q)}.`][bad] + ` Düzgün yeni təpə: ${P(m + P2, n - q)}.`;
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Top, fəvvarə, temperatur: parabolanın təpəsi — ən yüksək nöqtə; qrafikin sürüşməsi — gecikmə və ya artım.",
      gen() {
        const kind = pick(["top", "top", "fevvare", "temp", "temp"]);
        if (kind === "top") { const v = pick([10, 20, 30, 40]), t = v / 10, H = v * v / 20, ask = Math.random() < .5;
          return { text: `Yuxarı atılan topun hündürlüyü h(t) = −5t² + ${v}t düsturu ilə verilir (t — saniyə, h — metr). ${ask ? "Top ən çox neçə metr hündürlüyə qalxır?" : "Top neçə saniyədən sonra ən yüksək nöqtədə olur?"}`,
            answer: ask ? H : t, show: String(ask ? H : t), unit: ask ? "m" : "san", tol: 0.01,
            solution: `Tam kvadrat: h = −5(t² − ${2 * t}t) = −5(t − ${t})² + ${H}. Təpə (${t}; ${H}): ${t} saniyədə ${H} m.` }; }
        if (kind === "fevvare") { const m = rnd(2, 5), n = rnd(4, 12), d = rnd(1, 4), ask = pick(["n", "m", "d"]);
          const head = `Fəvvarənin su şırnağı y = −(x − ${m})² + ${n} parabolası boyunca gedir (x, y — metr).`;
          if (ask === "n") return { text: `${head} Şırnaq ən çox neçə metr hündürlüyə qalxır?`, answer: n, show: String(n), unit: "m", tol: 0.01, solution: `Təpə (${m}; ${n}) — ən yüksək nöqtə: ${n} m.` };
          if (ask === "m") return { text: `${head} Ən yüksək nöqtə fəvvarədən üfüqi istiqamətdə neçə metr uzaqdadır?`, answer: m, show: String(m), unit: "m", tol: 0.01, solution: `Təpə (${m}; ${n}), absis ${m} m.` };
          return { text: `${head} Fəvvarəni ${d} m sağa köçürdülər və şırnağı ${d} m ${d > 2 ? "aşağı" : "yuxarı"} saldılar. Yeni şırnağın ən yüksək nöqtəsi neçə metrdir?`, answer: d > 2 ? n - d : n + d, show: String(d > 2 ? n - d : n + d), unit: "m", tol: 0.01,
            solution: `Sağa köçürmə hündürlüyü dəyişmir. ${d} m ${d > 2 ? "aşağı" : "yuxarı"}: ${n} ${d > 2 ? "−" : "+"} ${d} = ${d > 2 ? n - d : n + d} m.` }; }
        // temperature: yesterday's graph f(t); today g(t) = f(t − 2) + r
        let T = [], y = rnd(-2, 3); for (let x = 0; x <= 10; x += 2) { T.push([x, y]); let d = 0; while (!d || y + d < -3 || y + d > 6) d = rnd(-3, 4); y += d; }
        const r = rnd(1, 3), [u, w] = pick(T), t0 = u + 2;
        return { text: `Qrafikdə dünən saat 0-dan 10-a qədər temperatur verilib: T = f(t) (t — saat, T — °C). Bu gün hər şey 2 saat gec və ${r}° isti oldu: g(t) = f(t − 2) + ${r}. Bu gün saat ${t0}:00-da temperatur neçə dərəcə idi?`,
          svg: svgEl({ x: [0, 12], y: [-4, 8], xn: "t", yn: "T", pl: [{ pts: T }] }, "Dünənki temperaturun qrafiki"), answer: w + r, show: S(w + r), unit: "°C", tol: 0.01,
          solution: `g(${t0}) = f(${t0} − 2) + ${r} = f(${u}) + ${r}. Qrafikdən f(${u}) = ${S(w)}. Cavab: ${S(w)} + ${r} = ${S(w + r)} °C.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "qrafik-cevrilme", title: "Qrafiklərin çevrilməsi", fenn: "riyaziyyat", link: "dersler/qrafik-cevrilme.html",
      format: "Cavab ədəddir: tam 4, mənfi −3. Təpə soruşulanda yalnız istənən koordinatı yaz (absis və ya ordinat).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["yuxari", "saga", "saga", "eks", "eks", "teper", "teper", "teper", "tani", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/qrafik-cevrilme.html")) b.push("dersler/qrafik-cevrilme.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
