// y = k/x, y = √x, y = |x|, y = x³ — mastery game levels (recognising graphs, k from a point, values, largest/smallest
// values on a segment, intersections, word problems) and the final test. Graph levels draw an SVG coordinate plane.
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
  const hyp = k => [{ f: x => k / x, a: -8, b: -0.02 }, { f: x => k / x, a: 0.02, b: 8 }];
  const rad = n => { let k = 1, r = n; for (let d = 2; d * d <= r; d++) while (r % (d * d) === 0) { r /= d * d; k *= d; } return r === 1 ? String(k) : (k === 1 ? "" : k) + "√" + r; };
  const cubes = [1, 2, 3, 4, 5];

  const levels = [
    { id: "tani", minVariety: 5, ad: "Qrafiki tanı", izah: "Hiperbola — iki qol; √x — yarım-parabola (0-dan sağa); |x| — bucaq (V hərfi); x³ — mərkəzdən keçən S-ə bənzər əyri; x² — parabola.",
      gen() {
        const names = ["y = k/x", "y = √x", "y = |x|", "y = x³", "y = x²"], i = rnd(0, 4), k = pick([-1, 1]) * rnd(1, 4);
        const f = [hyp(k), [{ f: Math.sqrt, a: 0, b: 7 }], [{ f: Math.abs }], [{ f: x => x * x * x, a: -2.2, b: 2.2 }], [{ f: x => x * x, a: -3, b: 3 }]][i];
        const why = [`İki ayrı qol, oxlara yaxınlaşır, amma onları kəsmir — hiperbola (burada k ${k > 0 ? "> 0: I və III rüb" : "< 0: II və IV rüb"}).`,
          "Qrafik (0; 0)-dan başlayır, yalnız sağa gedir və getdikcə yatır: (1; 1), (4; 2) — bu y = √x-dir.",
          "İki düz şüa, (0; 0)-da bucaq — y = |x|. Parabola hamar olardı, bucaq olmazdı.",
          "Sol tərəfdə aşağı, sağ tərəfdə yuxarı, (0; 0)-dan keçir və həmişə artır — kub parabola y = x³.",
          "Hamar, simmetrik, təpəsi (0; 0) — parabola y = x². y = |x|-dən fərqi: aşağıda bucaq yoxdur."][i];
        return { text: "Şəkildə hansı funksiyanın qrafiki verilib?", svg: svgEl({ x: [-6, 6], y: [-5, 5], f }), choices: names, correct: i, show: names[i], solution: why };
      } },
    { id: "k", ad: "k-nı tap", izah: "y = k/x qrafiki A(a; b)-dən keçirsə, b = k/a, yəni k = a·b. Sonra istənilən x üçün y = k/x.",
      gen() {
        let a, b; do { a = pick([-1, 1]) * rnd(1, 5); b = pick([-1, 1]) * rnd(1, 5); } while (Math.abs(a * b) < 2 || Math.abs(a * b) > 12);
        const k = a * b, kind = pick(["graph", "graph", "val", "find"]);
        if (kind === "graph") return { text: "Şəkildə y = k/x funksiyasının qrafiki verilib, A nöqtəsi qrafikə aiddir. k = ?", svg: svgEl({ x: [-7, 7], y: [-6, 6], f: hyp(k), pts: [{ x: a, y: b, t: "A" }] }), answer: k, show: S(k), tol: 0.01,
          solution: `Qrafikdən A${P(a, b)}. k = x·y = ${S(a)}·${b < 0 ? "(" + S(b) + ")" : b} = ${S(k)}.` };
        let t; do { t = pick([-1, 1]) * rnd(1, 12); } while (t === a);
        if (kind === "val") return { text: `y = k/x funksiyasının qrafiki A${P(a, b)} nöqtəsindən keçir. x = ${S(t)} olduqda y = ?`, answer: k / t, show: frac(k, t), tol: 0.01, placeholder: "məs. −3/2",
          solution: `k = ${S(a)}·${b < 0 ? "(" + S(b) + ")" : b} = ${S(k)}. y = ${S(k)}/x, x = ${S(t)}: y = ${S(k)}/${t < 0 ? "(" + S(t) + ")" : t} = ${frac(k, t)}.` };
        const ks = pick([12, 18, 24, 30, 36]) * pick([-1, 1]), ds = [1, 2, 3, 4, 6].filter(d => ks % d === 0), x = pick(ds) * pick([-1, 1]), y = ks / x;
        let m; do { m = pick(ds) * pick([-1, 1]); } while (m === x);
        return { text: `y = k/x qrafiki A${P(x, y)} nöqtəsindən keçir. B(${S(m)}; c) nöqtəsi də bu qrafikə aiddir. c = ?`, answer: ks / m, show: S(ks / m), tol: 0.01,
          solution: `k = ${S(x)}·${y < 0 ? "(" + S(y) + ")" : y} = ${S(ks)}. c = ${S(ks)}/${m < 0 ? "(" + S(m) + ")" : m} = ${S(ks / m)}.` };
      } },
    { id: "kok", ad: "√x, |x|, x³: qiymətlər", izah: "√x ≥ 0 və x ≥ 0; |x| = c-nin iki kökü ±c; x³-ün işarəsi x-in işarəsi ilədir.",
      gen() {
        const kind = pick(["sqA", "sqY", "modP", "cub", "cubX"]);
        if (kind === "sqA") { const c = rnd(2, 12);
          return { text: `A(m; ${c}) nöqtəsi y = √x funksiyasının qrafikinə aiddir. m = ?`, answer: c * c, show: String(c * c), tol: 0.01,
            solution: `√m = ${c} → m = ${c}² = ${c * c}.` }; }
        if (kind === "sqY") { const r = pick([1, 2, 3, 5, 6, 7]), n = rnd(1, 6), x = n * n * r;
          return { text: `y = √x qrafikində absisi ${x} olan nöqtənin ordinatı nədir? (Kökü sadələşdir, məs. 2√3.)`, answer: Math.sqrt(x), show: rad(x), placeholder: "məs. 2√3",
            solution: `y = √${x}` + (r > 1 && n > 1 ? ` = √(${n * n}·${r}) = ${rad(x)}.` : ` = ${rad(x)}.`) }; }
        if (kind === "modP") { const c = rnd(2, 9), ask = pick(["hasil", "fərq"]);
          return { text: `y = |x| qrafikində ordinatı ${c} olan nöqtələrin absislərinin ${ask === "hasil" ? "hasilini" : "fərqini (böyükdən kiçiyi)"} tap.`, answer: ask === "hasil" ? -c * c : 2 * c, show: ask === "hasil" ? S(-c * c) : String(2 * c), tol: 0.01,
            solution: `|x| = ${c} → x = ${c} və x = −${c}. ${ask === "hasil" ? `Hasil: ${c}·(−${c}) = ${S(-c * c)}.` : `Fərq: ${c} − (−${c}) = ${2 * c}.`}` }; }
        if (kind === "cub") { const a = pick([-1, 1]) * pick(cubes), b = pick([-1, 1]) * pick(cubes), v = a ** 3 + b ** 3;
          return { text: `f(x) = x³. f(${S(a)}) + f(${S(b)}) = ?`, answer: v, show: S(v), tol: 0.01,
            solution: `(${S(a)})³ = ${S(a ** 3)}, (${S(b)})³ = ${S(b ** 3)}. Cəm: ${S(v)}.` }; }
        const t = pick([-1, 1]) * pick(cubes);
        return { text: `B(m; ${S(t ** 3)}) nöqtəsi y = x³ funksiyasının qrafikinə aiddir. m = ?`, answer: t, show: S(t), tol: 0.01,
          solution: `m³ = ${S(t ** 3)} → m = ${S(t)}, çünki (${S(t)})³ = ${S(t ** 3)}. Kubda işarə qalır.` };
      } },
    { id: "minmax", ad: "Parçada ən böyük, ən kiçik", izah: "Artan funksiyada ən kiçik qiymət — sol ucda, ən böyük — sağ ucda. Azalanda tərsinə. |x| — 0-a qədər azalır, sonra artır.",
      gen() {
        const kind = pick(["sq", "mod", "cub", "hyp"]), big = Math.random() < .5, w = big ? "ən böyük" : "ən kiçik";
        if (kind === "sq") { const a = rnd(0, 4), b = rnd(a + 1, 9), v = big ? b : a;
          return { text: `y = √x funksiyasının [${a * a}; ${b * b}] parçasında ${w} qiymətini tap.`, answer: v, show: String(v), tol: 0.01,
            solution: `√x artandır: ən kiçik qiymət sol ucda √${a * a} = ${a}, ən böyük sağ ucda √${b * b} = ${b}. Cavab: ${v}.` }; }
        if (kind === "mod") {
          if (Math.random() < .6) { const a = rnd(1, 8), b = rnd(1, 8), v = big ? Math.max(a, b) : 0;
            return { text: `y = |x| funksiyasının [−${a}; ${b}] parçasında ${w} qiymətini tap.`, answer: v, show: String(v), tol: 0.01,
              solution: `Parçaya 0 daxildir: |0| = 0 — ən kiçik qiymət. Ən böyük — uclardan biri: |−${a}| = ${a}, |${b}| = ${b}. Cavab: ${v}.` }; }
          const a = rnd(2, 6), b = rnd(a + 1, 9), v = big ? b : a;
          return { text: `y = |x| funksiyasının [−${b}; −${a}] parçasında ${w} qiymətini tap.`, answer: v, show: String(v), tol: 0.01,
            solution: `x < 0 olanda |x| = −x — azalandır. Ən böyük qiymət sol ucda: |−${b}| = ${b}, ən kiçik sağ ucda: |−${a}| = ${a}. Cavab: ${v}.` };
        }
        if (kind === "cub") { const a = rnd(1, 4), b = rnd(1, 4), v = big ? b ** 3 : -(a ** 3);
          return { text: `y = x³ funksiyasının [−${a}; ${b}] parçasında ${w} qiymətini tap.`, answer: v, show: S(v), tol: 0.01,
            solution: `x³ artandır: ən kiçik qiymət (−${a})³ = ${S(-(a ** 3))}, ən böyük ${b}³ = ${b ** 3}. Cavab: ${S(v)}.` }; }
        const K = pick([12, 24, 36, 60]), ds = [1, 2, 3, 4, 6, 12].filter(d => K % d === 0), [p, q] = (() => { let u, v; do { u = pick(ds); v = pick(ds); } while (u === v); return [Math.min(u, v), Math.max(u, v)]; })(), sg = pick([-1, 1]), k = sg * K;
        const at = (k > 0) === big ? p : q, v = k / at;
        return { text: `y = ${S(k)}/x funksiyasının [${p}; ${q}] parçasında ${w} qiymətini tap.`, answer: v, show: S(v), tol: 0.01,
          solution: `k ${k > 0 ? "> 0 — x > 0 olanda funksiya azalır" : "< 0 — x > 0 olanda funksiya artır"}. ${w[0].toUpperCase() + w.slice(1)} qiymət x = ${at}-də: ${S(k)}/${at} = ${S(v)}.` };
      } },
    { id: "kesisme", ad: "Kəsişmə nöqtələri", izah: "İki qrafikin kəsişməsi — tənlik: f(x) = g(x). Kökü tap, yoxla (√ olan tənlikdə kənar kök çıxa bilər).",
      gen() {
        const kind = pick(["hypC", "hypL", "hypL", "sqL", "modL", "cub"]);
        if (kind === "hypC") { const r = pick([-1, 1]) * rnd(1, 6), c = pick([-1, 1]) * rnd(1, 4), k = r * c;
          return { text: `y = ${S(k)}/x və y = ${S(c)} qrafiklərinin kəsişmə nöqtəsinin absisini tap.`, answer: r, show: S(r), tol: 0.01,
            svg: svgEl({ x: [-7, 7], y: [-5, 5], f: hyp(k), hl: [{ y: c }] }),
            solution: `${S(k)}/x = ${S(c)} → x = ${S(k)}/${c < 0 ? "(" + S(c) + ")" : c} = ${S(r)}.` }; }
        if (kind === "hypL") {
          let r1, r2, m; do { r1 = pick([-1, 1]) * rnd(1, 4); r2 = pick([-1, 1]) * rnd(1, 4); m = pick([-1, 1]); } while (r1 === r2);
          const b = -m * (r1 + r2), k = -m * r1 * r2, ask = pick(["sum", "big", "ysum"]);
          const ans = ask === "sum" ? r1 + r2 : ask === "big" ? Math.max(r1, r2) : k / r1 + k / r2;
          const line = poly([[m, "x"], [b, ""]]), q = ask === "sum" ? "kəsişmə nöqtələrinin absislərinin cəmini" : ask === "big" ? "kəsişmə nöqtəsinin ən böyük absisini" : "kəsişmə nöqtələrinin ordinatlarının cəmini";
          return { text: `Şəkildə y = ${S(k)}/x və y = ${line} funksiyalarının qrafikləri verilib. ${q[0].toUpperCase() + q.slice(1)} tap.`, answer: ans, show: S(ans), tol: 0.01,
            svg: svgEl({ x: [-7, 7], y: [-6, 6], f: [...hyp(k), { f: x => m * x + b, c: "var(--vec)" }] }),
            solution: `${S(k)}/x = ${line} → x-ə vur: ${poly([[m, "x²"], [b, "x"], [-k, ""]])} = 0 → x = ${S(Math.min(r1, r2))} və x = ${S(Math.max(r1, r2))}.` +
              (ask === "ysum" ? ` Ordinatlar: ${S(k)}/${r1 < 0 ? "(" + S(r1) + ")" : r1} = ${S(k / r1)}, ${S(k)}/${r2 < 0 ? "(" + S(r2) + ")" : r2} = ${S(k / r2)}. Cəm: ${S(ans)}.` : ` Cavab: ${S(ans)}.`) }; }
        if (kind === "sqL") { const t = pick([2, 3, 4]), m = t * t - t, ab = Math.random() < .6;
          return { text: `y = √x və y = x − ${m} qrafiklərinin kəsişmə nöqtəsinin ${ab ? "absisini" : "ordinatını"} tap.`, answer: ab ? t * t : t, show: String(ab ? t * t : t), tol: 0.01,
            svg: svgEl({ x: [-1, t * t + 2], y: [-4, 5], f: [{ f: Math.sqrt, a: 0 }, { f: x => x - m, c: "var(--vec)" }] }),
            solution: `√x = x − ${m}. Kvadrata yüksəlt: x = (x − ${m})² → x² − ${2 * m + 1}x + ${m * m} = 0 → x = ${t * t} və x = ${(t - 1) ** 2}. Yoxla: x = ${(t - 1) ** 2}-də √x = ${t - 1}, amma x − ${m} = ${S((t - 1) ** 2 - m)} — kənar kök. Kəsişmə (${t * t}; ${t}).` }; }
        if (kind === "modL") { const c = 2 * rnd(1, 4), ab = Math.random() < .5;
          return { text: `y = |x| və y = x + ${c} qrafiklərinin kəsişmə nöqtəsinin ${ab ? "absisini" : "ordinatını"} tap.`, answer: ab ? -c / 2 : c / 2, show: ab ? S(-c / 2) : String(c / 2), tol: 0.01,
            svg: svgEl({ x: [-6, 6], y: [-2, 7], f: [{ f: Math.abs }, { f: x => x + c, c: "var(--vec)" }] }),
            solution: `x ≥ 0 olanda |x| = x: x = x + ${c} — həll yoxdur (paralel xətlər). x < 0 olanda |x| = −x: −x = x + ${c} → x = ${S(-c / 2)}, y = ${c / 2}. Nöqtə (${S(-c / 2)}; ${c / 2}).` }; }
        const n = rnd(1, 3), kk = n * n, cnt = Math.random() < .4;
        return cnt
          ? { text: `y = x³ və y = ${kk === 1 ? "" : kk}x qrafikləri neçə nöqtədə kəsişir?`, answer: 3, show: "3", tol: 0.01,
              solution: `x³ = ${kk === 1 ? "" : kk}x → x(x² − ${kk}) = 0 → x = 0, x = ${n}, x = −${n}. Üç nöqtə.` }
          : { text: `y = x³ və y = ${kk === 1 ? "" : kk}x qrafiklərinin müsbət absisli kəsişmə nöqtəsinin ordinatını tap.`, answer: n ** 3, show: String(n ** 3), tol: 0.01,
              solution: `x³ = ${kk === 1 ? "" : kk}x → x(x² − ${kk}) = 0 → x = 0, ±${n}. Müsbət: x = ${n}, y = ${n}³ = ${n ** 3}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let a, b; do { a = pick([-1, 1]) * rnd(2, 6); b = pick([-1, 1]) * rnd(1, 6); } while (Math.abs(a * b) < 4 || Math.abs(a) === Math.abs(b));
        const k = a * b; let t; do { t = pick([-1, 1]) * rnd(2, 6); } while (t === a);
        const br = n => n < 0 ? "(" + S(n) + ")" : String(n);
        const steps = [`b = k/a olduğundan k = ${S(a)}·${br(b)} = ${S(k)}.`, `Funksiya: y = ${S(k)}/x.`, `x = ${S(t)}: y = ${S(k)}/${br(t)}${S(k) + "/" + br(t) === frac(k, t) ? "" : " = " + frac(k, t)}.`];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `b = k/a olduğundan k = ${br(b)} : ${br(a)} = ${frac(b, a)}.`;
        if (bad === 1) steps[1] = `Funksiya: y = ${S(k)}x.`;
        if (bad === 2) steps[2] = `x = ${S(t)}: y = ${S(k)}·${br(t)} = ${S(k * t)}.`;
        const text = h("div", {}, h("p", {}, `y = k/x qrafiki A${P(a, b)} nöqtəsindən keçir. x = ${S(t)} olduqda y-i tapırıq:`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: ${S(b)} = k/${br(a)} → k = ${S(a)}·${br(b)} = ${S(k)} (bölmə yox, vurma).`,
          `2-ci addım: tərs mütənasiblikdə x məxrəcdədir: y = ${S(k)}/x.`,
          `3-cü addım: y = ${S(k)}/x-də x-ə bölmək lazımdır: ${S(k)}/${br(t)} = ${frac(k, t)}.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Tərs mütənasiblik (y = k/x), kvadratın tərəfi (√), kubun həcmi (x³).",
      gen() {
        const kind = pick(["yol", "isci", "kub", "kubV", "kv"]);
        if (kind === "yol") { const s = pick([120, 180, 240, 360]), vs = [20, 30, 40, 45, 60, 80, 90, 120].filter(v => s % v === 0), v = pick(vs);
          return { text: `${s} km yol üçün lazım olan vaxt t = ${s}/v düsturu ilə hesablanır (v — km/saat). Sürət ${v} km/saat olsa, yol neçə saat çəkər?`, answer: s / v, show: String(s / v), unit: "saat", tol: 0.01,
            solution: `t = ${s}/${v} = ${s / v} saat. Sürət artanda vaxt azalır — tərs mütənasiblik.` }; }
        if (kind === "isci") { let n, T, m; do { n = rnd(2, 8); T = rnd(3, 15); m = rnd(2, 12); } while (m === n || (n * T) % m);
          return { text: `${n} usta işi ${T} günə görür. Eyni sürətlə işləyən ${m} usta həmin işi neçə günə görər?`, answer: n * T / m, show: String(n * T / m), unit: "gün", tol: 0.01,
            solution: `İş həcmi: ${n}·${T} = ${n * T} "usta-gün". Gün sayı y = ${n * T}/x (x — usta sayı). x = ${m}: ${n * T}/${m} = ${n * T / m} gün.` }; }
        if (kind === "kub") { const a = rnd(2, 10);
          return { text: `Kub formalı akvariumun tili ${a} dm-dir. Həcmi V = a³. Akvariuma neçə litr su yerləşər? (1 dm³ = 1 litr)`, answer: a ** 3, show: String(a ** 3), unit: "litr", tol: 0.01,
            solution: `V = ${a}³ = ${a ** 3} dm³ = ${a ** 3} litr.` }; }
        if (kind === "kubV") { const a = rnd(2, 10);
          return { text: `Kubun həcmi ${a ** 3} sm³-dir. Tilinin uzunluğu neçə sm-dir?`, answer: a, show: String(a), unit: "sm", tol: 0.01,
            solution: `a³ = ${a ** 3} → a = ${a}, çünki ${a}·${a}·${a} = ${a ** 3}.` }; }
        const a = rnd(4, 30);
        return { text: `Kvadrat formalı otağın sahəsi ${a * a} m²-dir. Tərəfi a = √S. Otağın tərəfi neçə metrdir?`, answer: a, show: String(a), unit: "m", tol: 0.01,
          solution: `a = √${a * a} = ${a} m.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "esas-funksiyalar", title: "y = k/x, y = √x, y = |x|, y = x³ funksiyaları", fenn: "riyaziyyat", link: "dersler/esas-funksiyalar.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr −3/2, kök 2√3.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["tani", "k", "k", "kok", "minmax", "minmax", "kesisme", "kesisme", "kesisme", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/esas-funksiyalar.html")) b.push("dersler/esas-funksiyalar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
