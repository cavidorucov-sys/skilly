// Koordinat sistemi, funksiya anlayışı — mastery game levels (points, function values, reading graphs, domain/range,
// zeros and monotonicity, word problems) and the final test. Graph levels draw an SVG coordinate plane with integer vertices.
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
  const plSvg = (pts, extra = {}) => svgEl({ x: [-7, 7], y: [-5, 5], pl: [{ pts }], ...extra }, "y = f(x) funksiyasının qrafiki");
  const GR = "Şəkildə y = f(x) funksiyasının qrafiki verilib (qırıq xətt; nöqtələr — sınma və uc nöqtələri).";
  const quad = (a, b) => a > 0 ? (b > 0 ? 1 : 4) : (b > 0 ? 2 : 3);
  const RUB = ["", "I rüb: x > 0, y > 0", "II rüb: x < 0, y > 0", "III rüb: x < 0, y < 0", "IV rüb: x > 0, y < 0"];

  const levels = [
    { id: "noqte", ad: "Nöqtənin koordinatları", izah: "Absis — x, ordinat — y. Rüblər, simmetrik nöqtələr, oxlar üzərindəki nöqtələr.",
      gen() {
        const kind = pick(["read", "read", "quad", "sym", "axis", "dist"]);
        if (kind === "read") {
          const a = pick([-1, 1]) * rnd(1, 6), b = pick([-1, 1]) * rnd(1, 4), ab = Math.random() < .5, v = ab ? a : b;
          return { text: `Şəkildəki A nöqtəsinin ${ab ? "absisi" : "ordinatı"} nədir?`, svg: svgEl({ x: [-7, 7], y: [-5, 5], pts: [{ x: a, y: b, t: "A" }] }), answer: v, show: S(v), tol: 0.01,
            solution: `A-dan Ox oxuna perpendikulyar endir — ${S(a)} alınır (absis). Oy oxuna perpendikulyar — ${S(b)} (ordinat). A${P(a, b)}, ${ab ? "absis" : "ordinat"} ${S(v)}.` };
        }
        if (kind === "quad") {
          const a = pick([-1, 1]) * rnd(1, 40), b = pick([-1, 1]) * rnd(1, 40), q = quad(a, b);
          return { text: `M${P(a, b)} nöqtəsi neçənci rübdədir? (Rübün nömrəsini yaz: 1, 2, 3 və ya 4.)`, answer: q, show: String(q), tol: 0.01,
            solution: `Absis ${a > 0 ? "müsbət" : "mənfi"}, ordinat ${b > 0 ? "müsbət" : "mənfi"}. ${RUB[q]}. Cavab: ${q}.` };
        }
        if (kind === "sym") {
          const a = pick([-1, 1]) * rnd(1, 9), b = pick([-1, 1]) * rnd(1, 9), ax = pick(["Ox", "Oy", "O"]), ab = Math.random() < .5;
          const B = ax === "Ox" ? [a, -b] : ax === "Oy" ? [-a, b] : [-a, -b], v = ab ? B[0] : B[1];
          const name = ax === "O" ? "koordinat başlanğıcına" : ax + " oxuna";
          const rule = ax === "Ox" ? "Ox oxuna nəzərən: absis eyni qalır, ordinatın işarəsi dəyişir" : ax === "Oy" ? "Oy oxuna nəzərən: ordinat eyni qalır, absisin işarəsi dəyişir" : "koordinat başlanğıcına nəzərən: hər iki koordinatın işarəsi dəyişir";
          return { text: `A${P(a, b)} nöqtəsinə ${name} nəzərən simmetrik olan B nöqtəsinin ${ab ? "absisi" : "ordinatı"} nədir?`, answer: v, show: S(v), tol: 0.01,
            solution: `${rule[0].toUpperCase() + rule.slice(1)}. B${P(B[0], B[1])}, ${ab ? "absis" : "ordinat"} ${S(v)}.` };
        }
        if (kind === "axis") {
          const m = pick([-1, 1]) * rnd(1, 6), p = rnd(2, 5), q = p * m, r = pick([-1, 1]) * rnd(1, 9), onY = Math.random() < .5, e = poly([[p, "m"], [-q, ""]]);
          return { text: onY ? `A(${e}; ${S(r)}) nöqtəsi Oy oxu üzərindədir. m = ?` : `A(${S(r)}; ${e}) nöqtəsi Ox oxu üzərindədir. m = ?`, answer: m, show: S(m), tol: 0.01,
            solution: `${onY ? "Oy oxu üzərindəki nöqtənin absisi" : "Ox oxu üzərindəki nöqtənin ordinatı"} 0-dır: ${e} = 0 → ${p}m = ${S(q)} → m = ${S(m)}.` };
        }
        const T = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13]]);
        const a = pick([-1, 1]) * T[0], b = pick([-1, 1]) * T[1], to = pick(["Ox", "Oy", "O"]);
        const v = to === "Ox" ? Math.abs(b) : to === "Oy" ? Math.abs(a) : T[2];
        return { text: `A${P(a, b)} nöqtəsindən ${to === "O" ? "koordinat başlanğıcına" : to + " oxuna"} qədər məsafə neçədir?`, answer: v, show: String(v), tol: 0.01,
          solution: to === "Ox" ? `Ox oxuna qədər məsafə ordinatın moduludur: |${S(b)}| = ${v}.` : to === "Oy" ? `Oy oxuna qədər məsafə absisin moduludur: |${S(a)}| = ${v}.`
            : `Pifaqor teoremi: √(${S(a)}² + ${S(b)}²) = √(${a * a} + ${b * b}) = √${T[2] * T[2]} = ${v}.` };
      } },
    { id: "qiymet", ad: "Funksiyanın qiyməti", izah: "f(a) — düsturda x-in yerinə a yaz. Nöqtə qrafikə aiddirsə, onun koordinatları düsturu ödəyir.",
      gen() {
        const kind = pick(["kv", "kesr", "noqte", "ters"]);
        if (kind === "kv") {
          const a = pick([1, -1, 2, 3, -2]), b = rnd(-5, 5), c = rnd(-9, 9), t = pick([-1, 1]) * rnd(1, 4), v = a * t * t + b * t + c;
          return { text: `f(x) = ${poly([[a, "x²"], [b, "x"], [c, ""]])}. f(${S(t)}) = ?`, answer: v, show: S(v), tol: 0.01,
            solution: `x-in yerinə ${S(t)} yaz (mötərizə ilə!): ${S(a)}·(${S(t)})²${b ? " + (" + S(b) + ")·(" + S(t) + ")" : ""}${c ? " + (" + S(c) + ")" : ""} = ${S(a * t * t)}${b ? " + (" + S(b * t) + ")" : ""}${c ? " + (" + S(c) + ")" : ""} = ${S(v)}.` };
        }
        if (kind === "kesr") {
          const p = rnd(-6, 6), q = rnd(-5, 5); let t = rnd(-6, 6); while (t === q || t + p === 0) t = rnd(-6, 6);
          return { text: `f(x) = (${poly([[1, "x"], [p, ""]])})/(${lin(q)}). f(${S(t)}) = ?`, answer: (t + p) / (t - q), show: frac(t + p, t - q), placeholder: "məs. 3/4",
            solution: `f(${S(t)}) = (${S(t)}${tail(p)})/(${S(t)}${tail(-q)}) = ${S(t + p)}/${t - q < 0 ? "(" + S(t - q) + ")" : t - q} = ${frac(t + p, t - q)}.` };
        }
        if (kind === "noqte") {
          const k = pick([-1, 1]) * rnd(1, 6), b = rnd(-9, 9), t = pick([-1, 1]) * rnd(1, 7), m = k * t + b;
          return { text: `A(${S(t)}; m) nöqtəsi y = ${poly([[k, "x"], [b, ""]])} funksiyasının qrafikinə aiddir. m = ?`, answer: m, show: S(m), tol: 0.01,
            solution: `Nöqtə qrafikə aiddirsə, x = ${S(t)} olanda y = m: m = ${S(k)}·(${S(t)})${tail(b)} = ${S(k * t)}${tail(b)} = ${S(m)}.` };
        }
        const k = pick([-1, 1]) * rnd(2, 6), b = rnd(-9, 9), r = rnd(-7, 7), v = k * r + b;
        return { text: `f(x) = ${poly([[k, "x"], [b, ""]])}. x-in hansı qiymətində f(x) = ${S(v)} olur?`, answer: r, show: S(r), tol: 0.01,
          solution: `${poly([[k, "x"], [b, ""]])} = ${S(v)} → ${S(k)}x = ${S(v)}${tail(-b)} = ${S(v - b)} → x = ${S(r)}.` };
      } },
    { id: "qrafik", ad: "Qrafikdən oxu", izah: "f(a): x = a-dan yuxarı/aşağı qrafikə qədər get, ordinatı oxu. f(x) = c: y = c üfüqi düz xəttini çək, kəsişmələrə bax.",
      gen() {
        const pts = randPL(), kind = pick(["val", "val", "pre", "cnt", "sum"]);
        const svg = plSvg(pts);
        if (kind === "pre") {
          const cand = pts.filter(([x, y]) => solveC(pts, y).length === 1);
          if (cand.length) { const [x, y] = pick(cand);
            return { text: GR + ` f(x) = ${S(y)} olarsa, x = ?`, svg, answer: x, show: S(x), tol: 0.01,
              solution: `y = ${S(y)} üfüqi xətti qrafiki yalnız bir nöqtədə kəsir: ${P(x, y)}. Cavab: x = ${S(x)}.` }; }
        }
        if (kind === "cnt") {
          const lo = Math.min(...ys(pts)), hi = Math.max(...ys(pts)), c = rnd(lo - 1, hi), r = solveC(pts, c);
          return { text: GR + ` f(x) = ${S(c)} tənliyinin neçə həlli var?`, svg, answer: r.length, show: String(r.length), tol: 0.01,
            solution: `y = ${S(c)} üfüqi xəttini çək. Qrafiklə kəsişmə nöqtələrinin sayı = həllərin sayı: ${r.length}.` + (r.length ? "" : ` (Funksiyanın qiymətləri ${S(lo)}-dən ${S(hi)}-ə qədərdir.)`) };
        }
        if (kind === "sum") {
          const [A, B] = [pick(pts), pick(pts)], v = A[1] + B[1];
          return { text: GR + ` f(${S(A[0])}) + f(${S(B[0])}) = ?`, svg, answer: v, show: S(v), tol: 0.01,
            solution: `Qrafikdən: f(${S(A[0])}) = ${S(A[1])}, f(${S(B[0])}) = ${S(B[1])}. Cəm: ${S(v)}.` };
        }
        const [x, y] = pick(pts);
        return { text: GR + ` f(${S(x)}) = ?`, svg, answer: y, show: S(y), tol: 0.01,
          solution: `x = ${S(x)} nöqtəsindən şaquli xətt qrafiki ${P(x, y)} nöqtəsində kəsir. f(${S(x)}) = ${S(y)}.` };
      } },
    { id: "oblast", ad: "Təyin oblastı və qiymətlər çoxluğu", izah: "D(f) — x-in mümkün qiymətləri (√ altı ≥ 0, məxrəc ≠ 0). E(f) — y-in aldığı qiymətlər. Qrafikdə: D — Ox-a, E — Oy-a proyeksiya.",
      gen() {
        const kind = pick(["kok", "iki", "natural", "qD", "qE", "qE", "Eform"]);
        if (kind === "kok") {
          const p = rnd(1, 4), q = rnd(-12, 12), m = Math.ceil(q / p - 1e-9) || 0;
          return { text: `y = √(${poly([[p, "x"], [-q, ""]])}) funksiyasının təyin oblastına daxil olan ən kiçik tam ədəd hansıdır?`, answer: m, show: S(m), tol: 0.01,
            solution: `Kök altı mənfi ola bilməz: ${poly([[p, "x"], [-q, ""]])} ≥ 0 → x ≥ ${frac(q, p)}. Bu şərti ödəyən ən kiçik tam ədəd ${S(m)}.` };
        }
        if (kind === "iki") {
          const b = rnd(-6, 3); let a = b + rnd(2, 8); if (a === 0) a = 1; const n = a - b + 1;
          return { text: `y = √(${S(a)} − x) + √(${lin(b)}) funksiyasının təyin oblastında neçə tam ədəd var?`, answer: n, show: String(n), tol: 0.01,
            solution: `${S(a)} − x ≥ 0 → x ≤ ${S(a)}; ${lin(b)} ≥ 0 → x ≥ ${S(b)}. D(f) = ${seg(b, a)}. Tam ədədlər: ${S(b)}-dən ${S(a)}-ə qədər, ${S(a)} − (${S(b)}) + 1 = ${n}.` };
        }
        if (kind === "natural") {
          const b = rnd(3, 9), a = rnd(-2, b - 1), n = b - (a >= 1 ? 1 : 0);
          return { text: `y = √(${b} − x)/${a ? "(" + lin(a) + ")" : "x"} funksiyasının təyin oblastına neçə natural ədəd daxildir?`, answer: n, show: String(n), tol: 0.01,
            solution: `${b} − x ≥ 0 → x ≤ ${b}; məxrəc ${lin(a)} ≠ 0 → x ≠ ${S(a)}. Natural ədədlər 1, 2, …, ${b} — cəmi ${b}` + (a >= 1 ? `, onlardan ${a} çıxır: ${n}.` : `; ${S(a)} natural deyil, heç nə çıxmır: ${n}.`) };
        }
        const pts = randPL(), lo = Math.min(...ys(pts)), hi = Math.max(...ys(pts)), xa = pts[0][0], xb = pts[pts.length - 1][0];
        if (kind === "qD") {
          const n = xb - xa + 1;
          return { text: GR + " Funksiyanın təyin oblastında neçə tam ədəd var?", svg: plSvg(pts), answer: n, show: String(n), tol: 0.01,
            solution: `Qrafik x = ${S(xa)}-dən x = ${S(xb)}-ə qədərdir: D(f) = ${seg(xa, xb)}. Tam ədədlər: ${S(xb)} − (${S(xa)}) + 1 = ${n}.` };
        }
        if (kind === "qE") {
          const w = pick(["min", "max", "cnt"]), v = w === "min" ? lo : w === "max" ? hi : hi - lo + 1;
          return { text: GR + (w === "cnt" ? " Funksiyanın qiymətlər çoxluğunda neçə tam ədəd var?" : ` Funksiyanın ən ${w === "min" ? "kiçik" : "böyük"} qiyməti neçədir?`), svg: plSvg(pts), answer: v, show: S(v), tol: 0.01,
            solution: `Qrafikin ən aşağı nöqtəsinin ordinatı ${S(lo)}, ən yuxarı nöqtəsininki ${S(hi)}. E(f) = ${seg(lo, hi)}.` + (w === "cnt" ? ` Tam ədədlər: ${S(hi)} − (${S(lo)}) + 1 = ${v}.` : ` Cavab: ${S(v)}.`) };
        }
        const c = rnd(-9, 9), a = pick([-1, 1]) * rnd(1, 5), f = pick(["x²", "−x²", "|x|", "−|x|", "kv", "mod"]);
        const map = {
          "x²": [`x²${tail(c)}`, "min", `x² ≥ 0, ən kiçik qiyməti 0 (x = 0-da). Deməli, y ≥ ${S(c)}`],
          "−x²": [`−x²${tail(c)}`, "max", `−x² ≤ 0, ən böyük qiyməti 0 (x = 0-da). Deməli, y ≤ ${S(c)}`],
          "|x|": [`|x|${tail(c)}`, "min", `|x| ≥ 0. Deməli, y ≥ ${S(c)}`],
          "−|x|": [`−|x|${tail(c)}`, "max", `−|x| ≤ 0. Deməli, y ≤ ${S(c)}`],
          "kv": [`(${lin(a)})²${tail(c)}`, "min", `Kvadrat ≥ 0, x = ${S(a)} olanda 0 olur. Deməli, y ≥ ${S(c)}`],
          "mod": [`|${lin(a)}|${tail(c)}`, "min", `Modul ≥ 0, x = ${S(a)} olanda 0 olur. Deməli, y ≥ ${S(c)}`],
        }[f];
        return { text: `y = ${map[0]} funksiyasının ən ${map[1] === "min" ? "kiçik" : "böyük"} qiyməti neçədir?`, answer: c, show: S(c), tol: 0.01,
          solution: `${map[2]}, E(f) = ${map[1] === "min" ? `[${S(c)}; +∞)` : `(−∞; ${S(c)}]`}. Cavab: ${S(c)}.` };
      } },
    { id: "xasse", ad: "Sıfırlar, artma, azalma", izah: "Sıfır — qrafikin Ox-u kəsdiyi (toxunduğu) nöqtənin absisi. Soldan sağa qrafik qalxırsa — artır, enirsə — azalır.",
      gen() {
        const pts = randPL({ ok: p => { const z = solveC(p, 0); return z.length >= 1 && z.every(Number.isInteger); } });
        const z = solveC(pts, 0), mo = mono(pts), svg = plSvg(pts), kind = pick(["say", "cem", "azal", "art", "artsay", "max"]);
        if (kind === "say") return { text: GR + " Funksiyanın neçə sıfırı var?", svg, answer: z.length, show: String(z.length), tol: 0.01,
          solution: `Qrafik Ox oxunu ${z.length} nöqtədə kəsir (toxunur): x = ${z.map(S).join("; ")}. Sıfırların sayı ${z.length}.` };
        if (kind === "cem") { const v = z.reduce((s, x) => s + x, 0);
          return { text: GR + " Funksiyanın sıfırlarının cəmini tap.", svg, answer: v, show: S(v), tol: 0.01,
            solution: `Sıfırlar — qrafikin Ox ilə ortaq nöqtələrinin absisləri: ${z.map(S).join("; ")}. Cəm: ${S(v)}.` }; }
        if (kind === "azal" || kind === "art") {
          const d = kind === "art" ? 1 : -1, I = mo.filter(m => m.d === d), v = I.reduce((s, m) => s + m.b - m.a, 0);
          return { text: GR + ` Funksiyanın ${kind === "art" ? "artdığı" : "azaldığı"} aralıqların uzunluqlarının cəmini tap.`, svg, answer: v, show: String(v), tol: 0.01,
            solution: (I.length ? `Qrafik ${kind === "art" ? "qalxır" : "enir"}: ${I.map(m => seg(m.a, m.b)).join(", ")}. ${I.length > 1 ? `Uzunluqlar cəmi: ${I.map(m => m.b - m.a).join(" + ")} = ${v}.` : `Uzunluq: ${v}.`}` : `Qrafik heç yerdə ${kind === "art" ? "qalxmır" : "enmir"} — cavab 0.`) };
        }
        if (kind === "artsay") { const I = mo.filter(m => m.d === 1);
          return { text: GR + " Funksiya neçə aralıqda artır? (Ardıcıl artan hissələri bir aralıq say.)", svg, answer: I.length, show: String(I.length), tol: 0.01,
            solution: `Soldan sağa gedirik. Qalxan hissələr: ${I.length ? I.map(m => seg(m.a, m.b)).join(", ") : "yoxdur"}. Aralıqların sayı: ${I.length}.` }; }
        const hi = Math.max(...ys(pts)), at = pts.filter(p => p[1] === hi);
        if (at.length === 1) return { text: GR + " Funksiya ən böyük qiymətini hansı x-də alır?", svg, answer: at[0][0], show: S(at[0][0]), tol: 0.01,
          solution: `Qrafikin ən yuxarı nöqtəsi ${P(at[0][0], hi)}. Ən böyük qiymət ${S(hi)}, x = ${S(at[0][0])}-də alınır.` };
        return { text: GR + " Funksiyanın neçə sıfırı var?", svg, answer: z.length, show: String(z.length), tol: 0.01,
          solution: `Qrafik Ox oxunu ${z.length} nöqtədə kəsir (toxunur): x = ${z.map(S).join("; ")}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Təyin oblastının tapılması üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const a = pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4]); let b = a + rnd(1, 5); if (b === 0) b = a + 6;
        const steps = [
          `Kök altı mənfi ola bilməz: ${lin(a)} ≥ 0, yəni x ≥ ${S(a)}.`,
          `Məxrəc sıfır ola bilməz: ${lin(b)} ≠ 0, yəni x ≠ ${S(b)}.`,
          `D(f) = [${S(a)}; ${S(b)}) ∪ (${S(b)}; +∞).`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = pick([`Kök altı mənfi ola bilməz: ${lin(a)} ≥ 0, yəni x ≤ ${S(a)}.`, `Kök altı mənfi ola bilməz: ${lin(a)} ≥ 0, yəni x ≥ ${S(-a)}.`].filter(s => a !== 0 || s.includes("≤")));
        if (bad === 1) steps[1] = `Məxrəc sıfır ola bilməz: ${lin(b)} ≠ 0, yəni x ≠ ${S(-b)}.`;
        if (bad === 2) steps[2] = pick([`D(f) = (${S(a)}; ${S(b)}) ∪ (${S(b)}; +∞).`, `D(f) = [${S(b)}; +∞).`, `D(f) = [${S(a)}; +∞).`]);
        const text = h("div", {}, h("p", {}, `y = √(${lin(a)})/(${lin(b)}) funksiyasının təyin oblastını tapırıq:`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: ${lin(a)} ≥ 0 → x ≥ ${S(a)} (${S(a)}-ün özü də daxildir).`,
          `2-ci addım: ${lin(b)} = 0 olanda x = ${S(b)}, ona görə x ≠ ${S(b)}.`,
          `3-cü addım: x ≥ ${S(a)} (${S(a)} daxil — kvadrat mötərizə) və x ≠ ${S(b)}. Düzü: [${S(a)}; ${S(b)}) ∪ (${S(b)}; +∞).`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Düstur və ya qrafik həyatdan bir asılılığı göstərir: gediş haqqı, benzin, temperatur.",
      gen() {
        const kind = pick(["taksi", "taksi2", "benzin", "temp", "temp"]);
        if (kind === "taksi" || kind === "taksi2") {
          const a = pick([1, 1.5, 2, 2.5, 3]), b = pick([0.4, 0.5, 0.6, 0.8, 1]), x = rnd(3, 15), y = Math.round((a + b * x) * 100) / 100;
          const head = `Taksidə gediş haqqı y = ${D(a)} + ${D(b)}x düsturu ilə hesablanır (x — kilometr, y — manat).`;
          return kind === "taksi"
            ? { text: `${head} ${x} km yolun haqqı neçə manatdır?`, answer: y, show: D(y), unit: "manat", tol: 0.01,
                solution: `y = ${D(a)} + ${D(b)}·${x} = ${D(a)} + ${D(b * x)} = ${D(y)} manat.` }
            : { text: `${head} Sərnişin ${D(y)} manat ödədi. Neçə kilometr yol getdi?`, answer: x, show: String(x), unit: "km", tol: 0.01,
                solution: `${D(a)} + ${D(b)}x = ${D(y)} → ${D(b)}x = ${D(y - a)} → x = ${x} km.` };
        }
        if (kind === "benzin") {
          const r = rnd(4, 9), t = rnd(2, 6), V0 = r * rnd(t + 2, 10), V1 = V0 - r * t;
          return { text: `Bakda ${V0} litr benzin var, maşın saatda ${r} litr işlədir. Bakdakı benzin y = ${V0} − ${r}x (x — saat). Neçə saatdan sonra bakda ${V1} litr qalar?`, answer: t, show: String(t), unit: "saat", tol: 0.01,
            solution: `${V0} − ${r}x = ${V1} → ${r}x = ${V0 - V1} → x = ${t} saat.` };
        }
        // temperature graph: t = 0..12 hours, vertices every 2 hours
        let T = [], y = rnd(-2, 3); for (let x = 0; x <= 12; x += 2) { T.push([x, y]); let d = 0; while (!d || y + d < -3 || y + d > 7) d = rnd(-3, 4); y += d; }
        const svg = svgEl({ x: [0, 12], y: [-4, 8], xn: "t", yn: "T", pl: [{ pts: T }] }, "Temperaturun qrafiki");
        const head = "Qrafikdə gecə saat 0-dan günorta 12-yə qədər havanın temperaturu verilib (t — saat, T — °C).", w = pick(["val", "art", "max"]);
        if (w === "val") { const [x, v] = pick(T.slice(1));
          return { text: `${head} Saat ${x}:00-da temperatur neçə dərəcə idi?`, svg, answer: v, show: S(v), unit: "°C", tol: 0.01,
            solution: `t = ${x} nöqtəsindən qrafikə qalx (en): T = ${S(v)} °C.` }; }
        if (w === "art") { const I = mono(T).filter(m => m.d > 0), v = I.reduce((s, m) => s + m.b - m.a, 0);
          return { text: `${head} Bu müddətdə temperatur cəmi neçə saat ərzində artıb?`, svg, answer: v, show: String(v), unit: "saat", tol: 0.01,
            solution: `Qrafik qalxan aralıqlar: ${I.length ? I.map(m => seg(m.a, m.b)).join(", ") : "yoxdur"}. Cəmi ${v} saat.` }; }
        const hi = Math.max(...ys(T)), lo = Math.min(...ys(T)), v = hi - lo;
        return { text: `${head} Ən yüksək və ən aşağı temperatur arasındakı fərq neçə dərəcədir?`, svg, answer: v, show: String(v), unit: "°C", tol: 0.01,
          solution: `Ən yüksək nöqtə: ${S(hi)} °C, ən aşağı: ${S(lo)} °C. Fərq: ${S(hi)} − (${S(lo)}) = ${v} °C.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "koordinat-funksiya", title: "Koordinat sistemi, funksiya anlayışı", fenn: "riyaziyyat", link: "dersler/koordinat-funksiya.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 3/4, onluq 8,5. Rüb soruşulursa — onun nömrəsi (1, 2, 3, 4).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["noqte", "qiymet", "qiymet", "qrafik", "qrafik", "oblast", "oblast", "xasse", "xasse", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/koordinat-funksiya.html")) b.push("dersler/koordinat-funksiya.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
