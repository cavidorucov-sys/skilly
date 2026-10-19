// Oxşarlıq və homotetiya (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const range = (a, b, s = 1) => { const r = []; for (let x = a; x <= b; x += s) r.push(x); return r; };
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const frac = (p, q) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : (p / g) + "/" + (q / g); };
  const rad = d => d * Math.PI / 180;
  const fmt = n => String(Math.round(n * 100) / 100).replace(".", ",");
  // p·√n / q in simplest form → [text, value]
  function surd(p, q, n) {
    let s = 1; for (let i = 2; i * i <= n; i++) while (n % (i * i) === 0) { n /= i * i; s *= i; }
    p *= s; const g = gcd(p, q); p /= g; q /= g;
    const str = n === 1 ? (q === 1 ? String(p) : p + "/" + q) : (p === 1 ? "" : p) + "√" + n + (q === 1 ? "" : "/" + q);
    return [str, p * Math.sqrt(n) / q];
  }
  const on = (d, R = 1, c = [0, 0]) => [c[0] + R * Math.cos(rad(d)), c[1] + R * Math.sin(rad(d))];
  const BASE = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
  function triple(maxC) {
    const opts = [];
    for (const [p, q, c] of BASE) for (let k = 1; c * k <= maxC; k++) opts.push([p * k, q * k, c * k]);
    const [p, q, c] = pick(opts);
    return Math.random() < .5 ? [p, q, c] : [q, p, c];
  }

  // ---- figure: points in math coordinates (y up); random rotation and mirror
  // o: { circ:[[center, r, "fill"|"acc"]], poly?, segs:[[p,q,"dash"|"acc"|"ink"]], lab:{PQ:text}, right:[[v,p,q]], arcs:[[v,p,q,text,r]],
  //      names?, place?:{name:[toward,"in"|"out"]}, cen?, free? (any rotation), rot? }
  const INK = "#17171a", ACC = "#534ab7", RED = "#a32d2d", SOFT = "#eeedfe";
  function figure(P, o) {
    const W = 280, H = 210, pad = 30;
    const t = o.free ? Math.random() * 2 * Math.PI : pick(o.rot || [0, 1, 2, 3]) * Math.PI / 2, flip = Math.random() < .5 ? -1 : 1;
    const Q = {};
    for (const k in P) { const x = P[k][0] * flip, y = P[k][1]; Q[k] = [x * Math.cos(t) - y * Math.sin(t), -(x * Math.sin(t) + y * Math.cos(t))]; }
    const ext = Object.values(Q).slice();
    for (const [c, rr] of o.circ || []) ext.push([Q[c][0] - rr, Q[c][1] - rr], [Q[c][0] + rr, Q[c][1] + rr]);
    const xs = ext.map(p => p[0]), ys = ext.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min((W - 2 * pad) / ((x1 - x0) || 1), (H - 2 * pad) / ((y1 - y0) || 1));
    const ox = (W - s * (x1 - x0)) / 2 - s * x0, oy = (H - s * (y1 - y0)) / 2 - s * y0;
    for (const k in Q) Q[k] = [ox + s * Q[k][0], oy + s * Q[k][1]];
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": o.aria || "Çevrə" });
    const circle = ([c, rr, st]) => g.append(sv("circle", { cx: Q[c][0], cy: Q[c][1], r: s * rr, fill: st === "fill" ? SOFT : "none", stroke: st === "acc" ? ACC : INK, "stroke-width": 2 }));
    (o.circ || []).filter(c => c[2] === "fill").forEach(circle);
    if (o.poly) g.append(sv("polygon", { points: o.poly.map(k => Q[k].join(",")).join(" "), fill: o.polyFill === false ? "none" : SOFT, stroke: INK, "stroke-width": 2, "stroke-linejoin": "round" }));
    (o.circ || []).filter(c => c[2] !== "fill").forEach(circle);
    for (const [p, q, st] of o.segs || []) {
      const a = { x1: Q[p][0], y1: Q[p][1], x2: Q[q][0], y2: Q[q][1], stroke: st === "acc" ? ACC : st === "red" ? RED : INK, "stroke-width": st === "dash" ? 1.5 : 2, "stroke-linecap": "round" };
      if (st === "dash") a["stroke-dasharray"] = "5 4";
      g.append(sv("line", a));
    }
    for (const [v, p, q] of o.right || []) {
      const u = k => { const d = [Q[k][0] - Q[v][0], Q[k][1] - Q[v][1]], L = Math.hypot(...d); return [d[0] / L * 9, d[1] / L * 9]; };
      const a = u(p), b = u(q), V = Q[v];
      g.append(sv("path", { d: `M${V[0] + a[0]} ${V[1] + a[1]}L${V[0] + a[0] + b[0]} ${V[1] + a[1] + b[1]}L${V[0] + b[0]} ${V[1] + b[1]}`, fill: "none", stroke: INK, "stroke-width": 1.3 }));
    }
    for (const [v, p, q, tx, rr] of o.arcs || []) {
      const V = Q[v], R = rr || 18, ang = k => Math.atan2(Q[k][1] - V[1], Q[k][0] - V[0]);
      let t1 = ang(p), t2 = ang(q); if (Math.abs(t2 - t1) > Math.PI) t2 += t2 < t1 ? 2 * Math.PI : -2 * Math.PI;
      const pts = Array.from({ length: 11 }, (_, i) => { const tt = t1 + (t2 - t1) * i / 10; return (V[0] + R * Math.cos(tt)) + " " + (V[1] + R * Math.sin(tt)); });
      g.append(sv("path", { d: "M" + pts.join("L"), fill: "none", stroke: ACC, "stroke-width": 2 }));
      if (tx) { const tm = (t1 + t2) / 2; g.append(sv("text", { x: V[0] + (R + 15) * Math.cos(tm), y: V[1] + (R + 15) * Math.sin(tm) + 4, "text-anchor": "middle", class: "oy-lbl", style: "fill:" + ACC + ";font-size:12px" }, tx)); }
    }
    const named = o.names || Object.keys(P).filter(k => /^[A-Z]$/.test(k));
    const avg = ks => [0, 1].map(i => ks.reduce((t2, k) => t2 + Q[k][i], 0) / ks.length);
    const cen = o.cen ? Q[o.cen] : avg(o.poly || named);
    for (const key in o.lab || {}) {
      const v = o.lab[key], txt = Array.isArray(v) ? v[0] : v, tp = Array.isArray(v) ? v[1] : .5; // [text, position along the segment]
      const [p, q] = key.split(""), m = [Q[p][0] + (Q[q][0] - Q[p][0]) * tp, Q[p][1] + (Q[q][1] - Q[p][1]) * tp];
      const d = [Q[q][0] - Q[p][0], Q[q][1] - Q[p][1]], L = Math.hypot(...d) || 1;
      let n = [-d[1] / L, d[0] / L];
      const out = [m[0] - cen[0], m[1] - cen[1]];
      if (Math.hypot(...out) > 6 ? n[0] * out[0] + n[1] * out[1] < 0 : n[1] > 0) n = [-n[0], -n[1]];
      g.append(sv("text", { x: m[0] + n[0] * 13, y: m[1] + n[1] * 13 + 5, "text-anchor": "middle", class: "oy-lbl" }, txt));
    }
    if (o.circ) for (const k of named) g.append(sv("circle", { cx: Q[k][0], cy: Q[k][1], r: 2.6, fill: INK }));
    const unit = v => { const L = Math.hypot(...v) || 1; return [v[0] / L, v[1] / L]; };
    for (const k of named) {
      let d = [Q[k][0] - cen[0], Q[k][1] - cen[1]], L = Math.hypot(...d);
      if (L < 4) { d = [1, -1]; L = Math.SQRT2; }
      const pl = (o.place || {})[k];
      const bi = (o.bis || {})[k]; // letter on the bisector of two rays from the point
      if (bi) { const u1 = unit([Q[bi[0]][0] - Q[k][0], Q[bi[0]][1] - Q[k][1]]), u2 = unit([Q[bi[1]][0] - Q[k][0], Q[bi[1]][1] - Q[k][1]]); d = [u1[0] + u2[0], u1[1] + u2[1]]; L = Math.hypot(...d) || 1; }
      if (pl) { const tt = unit([Q[pl[0]][0] - Q[k][0], Q[pl[0]][1] - Q[k][1]]), r = unit(pl[1] === "in" ? [-d[0], -d[1]] : d); d = [tt[0] + r[0], tt[1] + r[1]]; L = Math.hypot(...d) || 1; }
      g.append(sv("text", { x: Q[k][0] + d[0] / L * 14, y: Q[k][1] + d[1] / L * 14 + 5, "text-anchor": "middle", class: "oy-lbl", style: "fill:#5f5e5a;font-style:italic" }, k));
    }
    return g;
  }
  const deg = { unit: "°", tol: 0.01 };
  const steps = (task, list) => h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...list.map(s => h("li", {}, s))));
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];
  const C1 = [["O", 1]];
  // tangent points from M = (d, 0) to the unit circle: above and below the axis
  const tang = d => { const f = Math.acos(1 / d) * 180 / Math.PI; return [on(f), on(-f)]; };

  const fig = (P, o) => figure(P, { circ: [], ...o });   // circ: [] → every named point gets a dot
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const ks = (p, q) => { const g = gcd(Math.abs(p), q) || 1; p /= g; q /= g; return q === 1 ? S(p) : (p < 0 ? "−" : "") + Math.abs(p) + "/" + q; };     // ratio p/q in lowest terms
  const pt = (x, y) => `(${S(x)}; ${S(y)})`;
  // ---- tables (all-integer data)
  const KS = [[2, 1], [3, 1], [4, 1], [-1, 1], [-2, 1], [-3, 1], [1, 2], [-1, 2], [3, 2], [-3, 2], [1, 3], [2, 3], [-2, 3]];
  const HAR = [], SQB = [], SQR = [], LEG = [];
  for (let a = 1; a <= 40; a++) for (let b = a + 1; b <= 40; b++) if ((2 * a * b) % (a + b) === 0) HAR.push([a, b, 2 * a * b / (a + b)]);
  for (let a = 2; a <= 36; a++) for (let h = 2; h <= 36; h++) if ((a * h) % (a + h) === 0) SQB.push([a, h, a * h / (a + h)]);
  for (let p = 2; p <= 40; p++) for (let q = p; q <= 40; q++) if ((p * q) % (p + q) === 0) SQR.push([p, q, p * q / (p + q)]);
  for (let l = 2; l <= 12; l++) for (let a = 2; a <= 15; a++) for (let b = a + 1; b <= 20; b++) if ((l * a) % (b - a) === 0 && l * a / (b - a) >= 2) LEG.push([l, a, b, l * a / (b - a)]);
  // Euler line data from a fixed random-ish acute triangle
  function euler() {
    const A = [rnd(0, 2) / 2, 0], B = [6 + rnd(0, 4) / 2, rnd(0, 2) / 2], C = [2.5 + rnd(0, 6) / 2, 4.5 + rnd(0, 4) / 2];
    const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
    const f = P => P[0] * P[0] + P[1] * P[1];
    const O = [(f(A) * (B[1] - C[1]) + f(B) * (C[1] - A[1]) + f(C) * (A[1] - B[1])) / d, (f(A) * (C[0] - B[0]) + f(B) * (A[0] - C[0]) + f(C) * (B[0] - A[0])) / d];
    const G = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3], H = [A[0] + B[0] + C[0] - 2 * O[0], A[1] + B[1] + C[1] - 2 * O[1]];
    return { A, B, C, O, G, H, R: Math.hypot(A[0] - O[0], A[1] - O[1]) };
  }

  const levels = [
    { id: "homotetiya", ad: "Homotetiya: obraz, əmsal, mərkəz", izah: "O mərkəzli, əmsalı k olan homotetiya: OX' = k · OX (vektor kimi). k > 0 — eyni şüada, k < 0 — O-nun əks tərəfində. Parçanın uzunluğu |k| dəfə dəyişir.",
      gen() {
        const kind = pick(["img", "img", "centre", "k", "de", "de", "cevre", "cevre"]);
        if (kind === "img" || kind === "centre") {
          const [p, q] = pick(KS), ox = rnd(-5, 5), oy = rnd(-5, 5);
          let u = 0, v = 0; while (!u && !v) { u = rnd(-4, 4); v = rnd(-4, 4); }
          const X = [ox + q * u, oy + q * v], Y = [ox + p * u, oy + p * v], kk = ks(p, q), kb = p < 0 ? `(${kk})` : kk;
          if (kind === "img") {
            const ask = pick(["x", "y", "cəm"]), ans = ask === "x" ? Y[0] : ask === "y" ? Y[1] : Y[0] + Y[1];
            return { text: `Mərkəzi O${pt(ox, oy)}, əmsalı k = ${kk} olan homotetiyada M${pt(...X)} nöqtəsinin obrazı M' nöqtəsidir. M' nöqtəsinin ${ask === "x" ? "absisini" : ask === "y" ? "ordinatını" : "absisi ilə ordinatının cəmini"} tap.`,
              answer: ans, show: S(ans), tol: 0.01,
              solution: `OM' = k · OM, yəni M' = O + k · (M − O). M − O = ${pt(q * u, q * v)}; k · (M − O) = ${pt(p * u, p * v)}. M' = ${pt(...Y)}. ${ask === "x" ? "Absis" : ask === "y" ? "Ordinat" : "Cəm"}: ${S(ans)}.` };
          }
          const ask = pick(["x", "y", "cəm"]), ans = ask === "x" ? ox : ask === "y" ? oy : ox + oy;
          return { text: `Əmsalı k = ${kk} olan homotetiya A${pt(...X)} nöqtəsini D${pt(...Y)} nöqtəsinə çevirir. Homotetiya mərkəzinin ${ask === "x" ? "absisini" : ask === "y" ? "ordinatını" : "absisi ilə ordinatının cəmini"} tap.`,
            answer: ans, show: S(ans), tol: 0.01,
            solution: `O + k · (A − O) = D → O · (1 − k) = D − k · A → O = (D − k · A)/(1 − k). Absis: (${S(Y[0])} − ${kb} · ${S(X[0])})/(1 − ${kb}) = ${S(ox)}; ordinat: (${S(Y[1])} − ${kb} · ${S(X[1])})/(1 − ${kb}) = ${S(oy)}. Mərkəz O${pt(ox, oy)}. ${ask === "cəm" ? "Cəm: " + S(ans) + "." : ""}` };
        }
        if (kind === "cevre") {
          const r1 = rnd(3, 12); let r2 = rnd(2, 12); while (r2 === r1) r2 = rnd(2, 12);
          const d = r1 + r2 + rnd(1, 12), ext = Math.random() < .55, num = d * r1, dn = ext ? Math.abs(r1 - r2) : r1 + r2;
          const xo = ext ? (r1 > r2 ? d * r1 / (r1 - r2) : -d * r1 / (r2 - r1)) : d * r1 / (r1 + r2);       // X on the line O(0) — Q(d)
          const P = { O: [0, 0], Q: [d, 0], X: [xo, 0] }, ans = Math.abs(xo), shw = frac(num, dn);
          return { text: `Mərkəzləri O və Q olan çevrələrin radiusları ${r1} və ${r2}-dir, OQ = ${d}. Çevrələrin ümumi ${ext ? "xarici" : "daxili"} toxunanları X nöqtəsində kəsişir. XO-nu tap.`,
            svg: fig(P, { circ: [["O", r1], ["Q", r2, "acc"]], free: true, segs: [["O", "X", "dash"]], lab: {}, aria: "İki çevrə və homotetiya mərkəzi X" }),
            answer: ans, show: shw, tol: 0.005,
            solution: `X — çevrələrin homotetiya mərkəzidir (toxunanlar X-dən keçir), əmsal = r₂/r₁ = ${r2}/${r1} (modulca). ` + (ext
              ? `Xarici toxunanlar: X iki mərkəzin eyni tərəfindədir, ona görə |XO − XQ| = OQ = ${d} və XO : XQ = ${r1} : ${r2}. XO = ${d} · ${r1}/|${r1} − ${r2}| = ${shw}.`
              : `Daxili toxunanlar: X mərkəzlər arasındadır, XO + XQ = OQ = ${d} və XO : XQ = ${r1} : ${r2}. XO = ${d} · ${r1}/(${r1} + ${r2}) = ${shw}.`) };
        }
        // k / de : points A, B and images D, E
        const [p, q] = pick([[2, 1], [3, 1], [3, 2], [4, 3], [5, 2], [1, 2], [1, 3], [2, 3], [3, 4], [5, 3]]), neg = Math.random() < .35, kv = (neg ? -1 : 1) * p / q;
        const A = [2.4, 1.6], B = [3.6, -0.6], P = { O: [0, 0], A, B, D: [kv * A[0], kv * A[1]], E: [kv * B[0], kv * B[1]] };
        const u = rnd(1, 4), v = rnd(1, 4), w = rnd(1, 3);
        const base = { free: true, segs: [["A", "B"], ["D", "E"], ["O", "A", "dash"], ["O", "B", "dash"], ["O", "D", "dash"], ["O", "E", "dash"]], aria: "Homotetiya: A, B nöqtələri və obrazları D, E" };
        const T = `O mərkəzli homotetiyada A və B nöqtələrinin obrazları uyğun olaraq D və E nöqtələridir${neg ? " (O nöqtəsi A ilə D arasındadır)" : ""}. `;
        if (kind === "k") return { text: T + `OA = ${q * w}, OD = ${p * w}. Homotetiyanın əmsalını tap.`, svg: fig(P, { ...base, lab: { OA: String(q * w), OD: [String(p * w), .6] } }),
          answer: kv, show: ks(neg ? -p : p, q), tol: 0.005,
          solution: `|k| = OD/OA = ${p * w}/${q * w} = ${ks(p, q)}. ${neg ? "O nöqtəsi A və D arasındadır, yəni obraz əks tərəfdədir: k mənfidir." : "D, A ilə O-ya nəzərən eyni tərəfdədir: k müsbətdir."} k = ${ks(neg ? -p : p, q)}.` };
        return { text: T + `OA = ${q * w}, OD = ${p * w}, AB = ${q * v}. DE-ni tap.`, svg: fig(P, { ...base, lab: { OA: String(q * w), OD: [String(p * w), .6], AB: String(q * v), DE: ["?", .5] } }),
          answer: p * v, show: String(p * v), tol: 0.01,
          solution: `|k| = OD/OA = ${p * w}/${q * w} = ${ks(p, q)}. Homotetiyada parçanın uzunluğu |k| dəfə dəyişir: DE = |k| · AB = ${ks(p, q)} · ${q * v} = ${p * v}.` };
      } },

    { id: "oxsar", ad: "Oxşar üçbucaqlar və sahələr", izah: "Paralel xəttə görə oxşar üçbucaqlar. Oxşarlıq əmsalı k: uzunluqlar, perimetrlər k dəfə, sahələr k² dəfə dəyişir.",
      gen() {
        const kind = pick(["A", "A", "X", "dar", "dar", "area"]);
        if (kind === "A") {
          const p = rnd(1, 4), q = rnd(p + 1, 6), u = rnd(1, 4), v = rnd(1, 4), w = rnd(1, 4), ask = pick(["DE", "AE", "EC"]);
          const A = [1.6, 4], B = [0, 0], C = [6, 0], t = p / q, D = [A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t], E = [A[0] + (C[0] - A[0]) * t, A[1] + (C[1] - A[1]) * t];
          const P = { A, B, C, D, E }, base = { free: true, poly: ["A", "B", "C"], segs: [["D", "E", "acc"]], aria: "ABC üçbucağı, DE ∥ BC" };
          const T = "ABC üçbucağında D nöqtəsi AB, E nöqtəsi AC tərəfi üzərindədir, DE ∥ BC. ";
          if (ask === "DE") return { text: T + `AD = ${p * u}, AB = ${q * u}, BC = ${q * v}. DE-ni tap.`, svg: fig(P, { ...base, lab: { AD: String(p * u), AB: [String(q * u), .8], BC: String(q * v), DE: "?" } }), answer: p * v, show: String(p * v), tol: 0.01,
            solution: `DE ∥ BC olduğundan ADE ~ ABC, əmsal AD/AB = ${p * u}/${q * u} = ${ks(p, q)}. DE = BC · AD/AB = ${q * v} · ${ks(p, q)} = ${p * v}.` };
          if (ask === "AE") return { text: T + `AB = ${q * u}, AD = ${p * u}, AC = ${q * w}. AE-ni tap.`, svg: fig(P, { ...base, lab: { AD: String(p * u), AB: [String(q * u), .8], AC: [String(q * w), .8], AE: "?" } }), answer: p * w, show: String(p * w), tol: 0.01,
            solution: `ADE ~ ABC (DE ∥ BC): AE/AC = AD/AB → AE = AC · AD/AB = ${q * w} · ${p * u}/${q * u} = ${p * w}.` };
          return { text: T + `AD = ${p * u}, DB = ${(q - p) * u}, AE = ${p * w}. EC-ni tap.`, svg: fig(P, { ...base, lab: { AD: String(p * u), DB: String((q - p) * u), AE: String(p * w), EC: "?" } }), answer: (q - p) * w, show: String((q - p) * w), tol: 0.01,
            solution: `Fales teoremi (DE ∥ BC): AD/DB = AE/EC → EC = AE · DB/AD = ${p * w} · ${(q - p) * u}/${p * u} = ${(q - p) * w}.` };
        }
        if (kind === "X") {
          const p = rnd(1, 4), q = rnd(1, 5), u = rnd(1, 3), w = rnd(1, 3), z = rnd(1, 3), ask = pick(["CD", "OD", "AB"]);
          const t = q / p, A = [-1.5, 1.4], B = [1.1, 1.4], P = { A, B, C: [-t * A[0], -t * A[1]], D: [-t * B[0], -t * B[1]], O: [0, 0] };
          if (p === q) return this.gen();
          const base = { free: true, segs: [["A", "B"], ["C", "D"], ["A", "C", "acc"], ["B", "D", "acc"]], aria: "AB ∥ CD, AC və BD O-da kəsişir" };
          const T = "AB ∥ CD, AC və BD parçaları O nöqtəsində kəsişir. ";
          if (ask === "CD") return { text: T + `AB = ${p * u}, OA = ${p * w}, OC = ${q * w}. CD-ni tap.`, svg: fig(P, { ...base, lab: { AB: String(p * u), OA: String(p * w), OC: String(q * w), CD: "?" } }), answer: q * u, show: String(q * u), tol: 0.01,
            solution: `AB ∥ CD → OAB ~ OCD (çarpaz bucaqlar bərabərdir), OA/OC = AB/CD. CD = AB · OC/OA = ${p * u} · ${q * w}/${p * w} = ${q * u}.` };
          if (ask === "OD") return { text: T + `AB = ${p * u}, CD = ${q * u}, OB = ${p * z}. OD-ni tap.`, svg: fig(P, { ...base, lab: { AB: String(p * u), CD: String(q * u), OB: String(p * z), OD: "?" } }), answer: q * z, show: String(q * z), tol: 0.01,
            solution: `OAB ~ OCD: OB/OD = AB/CD → OD = OB · CD/AB = ${p * z} · ${q * u}/${p * u} = ${q * z}.` };
          return { text: T + `CD = ${q * u}, OC = ${q * w}, OA = ${p * w}. AB-ni tap.`, svg: fig(P, { ...base, lab: { CD: String(q * u), OA: String(p * w), OC: String(q * w), AB: "?" } }), answer: p * u, show: String(p * u), tol: 0.01,
            solution: `OAB ~ OCD: AB/CD = OA/OC → AB = CD · OA/OC = ${q * u} · ${p * w}/${q * w} = ${p * u}.` };
        }
        if (kind === "dar") {
          const p = rnd(1, 4), q = rnd(p + 1, 6), t = rnd(1, 6), s = p * p * t, big = q * q * t, trap = big - s, ask = pick(["ABC", "DBCE", "ADE"]);
          const A = [1.6, 4], B = [0, 0], C = [6, 0], tt = p / q, D = [A[0] + (B[0] - A[0]) * tt, A[1] + (B[1] - A[1]) * tt], E = [A[0] + (C[0] - A[0]) * tt, A[1] + (C[1] - A[1]) * tt];
          const P = { A, B, C, D, E }, base = { free: true, poly: ["A", "B", "C"], segs: [["D", "E", "acc"]], aria: "ABC üçbucağı, DE ∥ BC" };
          const T = `ABC üçbucağında D nöqtəsi AB, E nöqtəsi AC tərəfi üzərindədir, DE ∥ BC, AD : AB = ${p} : ${q}. `;
          const why = `ADE ~ ABC, əmsal k = AD/AB = ${p}/${q}. Sahələr nisbəti k² = ${p * p}/${q * q}.`;
          if (ask === "ABC") return { text: T + `ADE üçbucağının sahəsi ${s}-dir. ABC üçbucağının sahəsini tap.`, svg: fig(P, base), answer: big, show: String(big), tol: 0.01, solution: `${why} S(ABC) = ${s} · ${q * q}/${p * p} = ${big}.` };
          if (ask === "DBCE") return { text: T + `ADE üçbucağının sahəsi ${s}-dir. DBCE trapesiyasının sahəsini tap.`, svg: fig(P, base), answer: trap, show: String(trap), tol: 0.01, solution: `${why} S(ABC) = ${s} · ${q * q}/${p * p} = ${big}. S(DBCE) = ${big} − ${s} = ${trap}.` };
          return { text: T + `DBCE trapesiyasının sahəsi ${trap}-dir. ADE üçbucağının sahəsini tap.`, svg: fig(P, base), answer: s, show: String(s), tol: 0.01, solution: `${why} S(ADE) : S(ABC) = ${p * p} : ${q * q}, deməli S(ADE) : S(DBCE) = ${p * p} : ${q * q - p * p}. S(ADE) = ${trap} · ${p * p}/${q * q - p * p} = ${s}.` };
        }
        const p = rnd(1, 5), q = rnd(p + 1, 8), t = rnd(1, 6), ask = pick(["S", "S", "P"]), u = rnd(1, 3);
        if (ask === "S") return { text: `ABC ~ A₁B₁C₁. AB = ${q * u}, A₁B₁ = ${p * u}. S(ABC) = ${q * q * t} olarsa, S(A₁B₁C₁)-i tap.`, answer: p * p * t, show: String(p * p * t), tol: 0.01,
          solution: `Oxşarlıq əmsalı k = A₁B₁/AB = ${p * u}/${q * u} = ${p}/${q}. Sahələr nisbəti k² = ${p * p}/${q * q}. S(A₁B₁C₁) = ${q * q * t} · ${p * p}/${q * q} = ${p * p * t}.` };
        return { text: `ABC ~ A₁B₁C₁. AB = ${q * u}, A₁B₁ = ${p * u}. P(ABC) = ${q * t} olarsa, P(A₁B₁C₁)-i tap (P — perimetr).`, answer: p * t, show: String(p * t), tol: 0.01,
          solution: `Oxşarlıq əmsalı k = ${p}/${q}. Perimetrlər k dəfə dəyişir (sahə yox, k² dəfə). P(A₁B₁C₁) = ${q * t} · ${p}/${q} = ${p * t}.` };
      } },

    { id: "trapesiya", ad: "Trapesiya və homotetiya", izah: "Trapesiyada diaqonalların kəsişməsi və yan tərəflərin davamı oxşar üçbucaqlar verir. Oturacaqlara paralel xətt: 2ab/(a + b). Oturacaqlardakı üçbucaqların sahələri S₁, S₂ olarsa, trapesiyanın sahəsi (√S₁ + √S₂)².",
      gen() {
        const kind = pick(["harm", "orta", "orta", "sahe", "sahe", "yan"]);
        const trap = (a, b) => { const A = [0, 0], D = [b, 0], B = [(b - a) / 2 + 0.3, 3], C = [(b - a) / 2 + 0.3 + a, 3]; return { A, D, B, C }; };
        if (kind === "harm") {
          const [a, b, ans] = pick(HAR), T = trap(a, b), O = [T.A[0] + (T.C[0] - T.A[0]) * b / (a + b), T.A[1] + (T.C[1] - T.A[1]) * b / (a + b)], f = O[1] / 3;
          const P = { ...T, O, E: [T.A[0] + (T.B[0] - T.A[0]) * f, O[1]], F: [T.D[0] + (T.C[0] - T.D[0]) * f, O[1]] };
          return { text: `ABCD trapesiyasında BC ∥ AD, BC = ${a}, AD = ${b}. Diaqonallar O nöqtəsində kəsişir. O-dan oturacaqlara paralel çəkilmiş düz xətt AB və CD yan tərəflərini E və F nöqtələrində kəsir. EF-i tap.`,
            svg: fig(P, { free: true, poly: ["A", "B", "C", "D"], segs: [["A", "C", "dash"], ["B", "D", "dash"], ["E", "F", "acc"]], lab: { BC: String(a), AD: String(b), EF: "?" }, aria: "Trapesiya, diaqonallar və EF" }),
            answer: ans, show: String(ans), tol: 0.01,
            solution: `BOC ~ DOA: AO : OC = AD : BC = ${b} : ${a}. AEO ~ ABC üçbucaqlarından (EO ∥ BC) EO = BC · AO/AC = ${a} · ${b}/${a + b}. Eyni ilə OF = ${a} · ${b}/${a + b}. EF = 2ab/(a + b) = 2 · ${a} · ${b}/${a + b} = ${ans}.` };
        }
        if (kind === "orta") {
          const a = rnd(2, 12), b = rnd(a + 1, 16), w = rnd(1, 4), T = trap(a, b), O = [T.A[0] + (T.C[0] - T.A[0]) * b / (a + b), T.A[1] + (T.C[1] - T.A[1]) * b / (a + b)];
          const M = [(T.B[0] + T.C[0]) / 2, 3], N = [(T.A[0] + T.D[0]) / 2, 0], P = { ...T, M, N, Q: O }, ask = pick(["QM", "QN"]);
          return { text: `ABCD trapesiyasında BC ∥ AD, BC = ${a}, AD = ${b}. M — BC-nin, N — AD-nin orta nöqtəsidir. Diaqonallar Q nöqtəsində kəsişir və Q nöqtəsi MN parçası üzərindədir. MN = ${(a + b) * w} olarsa, ${ask}-ni tap.`,
            svg: fig(P, { free: true, poly: ["A", "B", "C", "D"], segs: [["A", "C", "dash"], ["B", "D", "dash"], ["M", "N", "acc"]], lab: { MN: [String((a + b) * w), .15], [ask]: ["?", .5] }, aria: "Trapesiya, orta nöqtələr M, N" }),
            answer: ask === "QM" ? a * w : b * w, show: String(ask === "QM" ? a * w : b * w), tol: 0.01,
            solution: `Q mərkəzli əmsalı −BC/AD olan homotetiya AD-ni BC-yə, N-i M-ə aparır. Deməli Q nöqtəsi MN üzərindədir və QM : QN = BC : AD = ${a} : ${b}. ${a + b} hissə = ${(a + b) * w}, bir hissə ${w}. QM = ${a * w}, QN = ${b * w}. ${ask} = ${ask === "QM" ? a * w : b * w}.` };
        }
        if (kind === "sahe") {
          const p = rnd(1, 7), q = rnd(1, 7), ask = pick(["total", "lat", "S2"]);
          const a = p, b = q === p ? q + 1 : q, S1 = a * a, S2 = b * b;
          const T = trap(a, b), P = { ...T, O: [T.A[0] + (T.C[0] - T.A[0]) * b / (a + b), T.A[1] + (T.C[1] - T.A[1]) * b / (a + b)] };
          const base = { free: true, poly: ["A", "B", "C", "D"], segs: [["A", "C", "acc"], ["B", "D", "acc"]], aria: "Trapesiya, diaqonallar O-da kəsişir" };
          const Tx = `ABCD trapesiyasında BC ∥ AD, diaqonallar O nöqtəsində kəsişir. `;
          const lat = a * b, tot = (a + b) * (a + b), why = `BOC ~ DOA, oxşarlıq əmsalı k = √(S₁/S₂) = ${a}/${b}. AOB və AOD üçbucaqları A-dan çəkilmiş eyni hündürlüyə malikdir, ona görə S(AOB)/S(AOD) = BO/OD = k. Deməli S(AOB) = k · S(AOD) = ${a}/${b} · ${S2} = ${lat}; eyni ilə S(COD) = ${lat}.`;
          if (ask === "total") return { text: Tx + `S(BOC) = ${S1}, S(AOD) = ${S2}. Trapesiyanın sahəsini tap.`, svg: fig(P, base), answer: tot, show: String(tot), tol: 0.01, solution: why + ` Sahə = ${S1} + ${S2} + 2 · ${lat} = ${tot} = (√${S1} + √${S2})² = (${a} + ${b})².` };
          if (ask === "lat") return { text: Tx + `S(BOC) = ${S1}, S(AOD) = ${S2}. S(AOB)-ni tap.`, svg: fig(P, base), answer: lat, show: String(lat), tol: 0.01, solution: why + ` S(AOB) = ${lat}.` };
          return { text: Tx + `S(BOC) = ${S1}, trapesiyanın sahəsi ${tot}-dir. S(AOD)-ni tap.`, svg: fig(P, base), answer: S2, show: String(S2), tol: 0.01,
            solution: `Trapesiyanın sahəsi (√S₁ + √S₂)² (yan üçbucaqlar hər biri √(S₁S₂) sahəlidir). √${tot} = ${a + b} = √${S1} + √S₂ = ${a} + √S₂ → √S₂ = ${b}, S(AOD) = ${S2}.` };
        }
        const [l, a, b, ans] = pick(LEG), T = trap(a, b);
        const k = a / b, Pp = [T.A[0] + (T.B[0] - T.A[0]) / (1 - k), T.A[1] + (T.B[1] - T.A[1]) / (1 - k)];
        const P = { ...T, P: Pp };
        return { text: `ABCD trapesiyasında BC ∥ AD, BC = ${a}, AD = ${b}, AB = ${l}. AB və DC yan tərəflərinin davamları P nöqtəsində kəsişir (B nöqtəsi A ilə P arasındadır). PB-ni tap.`,
          svg: fig(P, { free: true, poly: ["A", "B", "C", "D"], segs: [["B", "P", "dash"], ["C", "P", "dash"]], lab: { BC: String(a), AD: String(b), AB: String(l), PB: "?" }, aria: "Yan tərəflərin davamları P-də kəsişir" }),
          answer: ans, show: String(ans), tol: 0.01,
          solution: `P mərkəzli homotetiya BC-ni AD-yə çevirir, əmsal = AD/BC = ${b}/${a}. PA = PB · ${b}/${a}. PA − PB = AB = ${l}: PB · (${b}/${a} − 1) = ${l} → PB = ${l} · ${a}/(${b} − ${a}) = ${ans}.` };
      } },

    { id: "kvadrat", ad: "Üçbucağa daxil edilmiş kvadrat və düzbucaqlı", izah: "Oturacağa paralel xətt kəsik üçbucağı verir (A mərkəzli homotetiya). Oturacağı a, hündürlüyü h olan üçbucaqda kvadratın tərəfi ah/(a + h).",
      gen() {
        const kind = pick(["base", "base", "right", "right", "rect", "max"]);
        const sqFig = (a, h, x, ax) => {
          const A = [ax, h], B = [0, 0], C = [a, 0], s = x, xl = ax * s / h, xr = a + (ax - a) * s / h;
          return { A, B, C, D: [xl, 0], E: [xr, 0], F: [xr, s], G: [xl, s] };
        };
        if (kind === "base") {
          const [a, h, x] = pick(SQB), ax = a * (0.2 + Math.random() * 0.6), P = sqFig(a, h, x, ax);
          return { text: `ABC üçbucağının BC oturacağı ${a}, ona çəkilmiş hündürlük ${h}-dir. Üçbucağa kvadrat daxil edilib: kvadratın bir tərəfi BC üzərindədir, qarşı təpələri AB və AC üzərindədir. Kvadratın tərəfini tap.`,
            svg: fig(P, { free: true, poly: ["A", "B", "C"], segs: [["D", "G", "acc"], ["G", "F", "acc"], ["F", "E", "acc"]], aria: "Üçbucağa daxil edilmiş kvadrat" }),
            answer: x, show: String(x), tol: 0.01,
            solution: `Kvadratın tərəfi x olsun. GF ∥ BC olduğundan AGF ~ ABC; onların hündürlükləri h − x və h: GF/BC = (h − x)/h → x/${a} = (${h} − x)/${h}. Buradan x · (${a} + ${h}) = ${a} · ${h}, x = ${a} · ${h}/${a + h} = ${x}.` };
        }
        if (kind === "right") {
          const [p, q, x] = pick(SQR), P = { C: [0, 0], B: [p, 0], A: [0, q], D: [x, 0], E: [0, x], F: [x, x] };
          return { text: `Düzbucaqlı ABC üçbucağında ∠C = 90°, BC = ${p}, AC = ${q}. Üçbucağa kvadrat daxil edilib: kvadratın bir təpəsi C-dir, qarşı təpəsi AB hipotenuzu üzərindədir. Kvadratın tərəfini tap.`,
            svg: fig(P, { free: true, poly: ["A", "B", "C"], segs: [["C", "D", "acc"], ["D", "F", "acc"], ["F", "E", "acc"], ["E", "C", "acc"]], right: [["C", "A", "B"]], aria: "Düzbucaqlı üçbucaqda kvadrat" }),
            answer: x, show: String(x), tol: 0.01,
            solution: `Kvadratın tərəfi x. F nöqtəsi AB üzərindədir; AEF ~ ACB: EF/CB = AE/AC → x/${p} = (${q} − x)/${q} → x · (${p} + ${q}) = ${p} · ${q}. x = ${p * q}/${p + q} = ${x}.` };
        }
        if (kind === "rect") {
          const h = rnd(4, 20), t = rnd(1, h - 1), g = gcd(h, h - t), a = rnd(1, 8) * (h / g), w = a * (h - t) / h, P = sqFig(a, h, t, a * .4);
          return { text: `ABC üçbucağının BC oturacağı ${a}, ona çəkilmiş hündürlük ${h}-dir. Üçbucağa düzbucaqlı daxil edilib: bir tərəfi BC üzərindədir, yuxarı təpələri AB və AC üzərindədir. Düzbucaqlının hündürlüyü ${t}-dir. Onun eni (BC-yə paralel tərəfi) neçədir?`,
            svg: fig(P, { free: true, poly: ["A", "B", "C"], segs: [["D", "G", "acc"], ["G", "F", "acc"], ["F", "E", "acc"]], aria: "Üçbucağa daxil edilmiş düzbucaqlı" }),
            answer: w, show: frac(a * (h - t), h), tol: 0.005,
            solution: `Yuxarı tərəf GF ∥ BC, ona görə AGF ~ ABC. Onların hündürlükləri ${h} − ${t} = ${h - t} və ${h}: GF = BC · ${h - t}/${h} = ${a} · ${h - t}/${h} = ${frac(a * (h - t), h)}.` };
        }
        const h = rnd(2, 16), aa = h % 2 === 0 ? rnd(1, 10) * 2 : rnd(1, 6) * 4, ar = aa * h / 4;
        return { text: `ABC üçbucağının BC oturacağı ${aa}, ona çəkilmiş hündürlük ${h}-dir. Üçbucağa düzbucaqlı daxil edilir (bir tərəfi BC üzərində, yuxarı təpələri AB və AC üzərində). Belə düzbucaqlıların ən böyük sahəsini tap.`,
          answer: ar, show: String(ar), tol: 0.01,
          solution: `Düzbucaqlının hündürlüyü t olsun. Eni ${aa} · (${h} − t)/${h} (oxşarlıq). Sahə = ${aa} · t · (${h} − t)/${h}. t · (${h} − t) hasili cəmi ${h} olan iki ədədin hasilidir, ən böyük qiyməti t = ${h} − t, yəni t = ${h}/2 olanda alınır: (${h}/2)² = ${h}²/4. Ən böyük sahə = ${aa} · (${h}²/4)/${h} = ${aa} · ${h}/4 = ${ar} (üçbucaq sahəsinin yarısı).` };
      } },

    { id: "eyler", ad: "Eyler düz xətti", izah: "O (xaricə çəkilmiş çevrənin mərkəzi), G (ağırlıq mərkəzi), H (hündürlüklərin kəsişməsi) bir düz xətt üzərindədir və HG = 2 · GO. AH = 2 · OM (M — BC-nin orta nöqtəsi).",
      gen() {
        const kind = pick(["og", "gh", "oh", "ah", "ah", "r9", "sah"]), u = rnd(1, 12), e = euler();
        const P = { A: e.A, B: e.B, C: e.C, O: e.O, G: e.G, H: e.H };
        if (kind === "og" || kind === "gh" || kind === "oh") {
          const given = pick(["OG", "GH", "OH"].filter(k => k !== (kind === "og" ? "OG" : kind === "gh" ? "GH" : "OH"))), val = { OG: u, GH: 2 * u, OH: 3 * u };
          const ask = kind === "og" ? "OG" : kind === "gh" ? "GH" : "OH";
          return { text: `ABC üçbucağında O — xaricə çəkilmiş çevrənin mərkəzi, G — medianların kəsişməsi, H — hündürlüklərin kəsişməsidir. ${given} = ${val[given]}. ${ask}-ni tap.`,
            svg: fig(P, { free: true, poly: ["A", "B", "C"], polyFill: false, segs: [["O", "H", "acc"]], lab: { [given]: String(val[given]) }, aria: "Eyler düz xətti: O, G, H", circ: [["O", e.R]] }),
            answer: val[ask], show: String(val[ask]), tol: 0.01,
            solution: `O, G, H bir düz xətt üzərindədir (Eyler düz xətti), G onların arasındadır və GH = 2 · OG. Deməli OG = ${u}, GH = ${2 * u}, OH = ${3 * u}. ${ask} = ${val[ask]}.` };
        }
        if (kind === "ah") {
          const d = rnd(1, 15), toAH = Math.random() < .6, M = [(e.B[0] + e.C[0]) / 2, (e.B[1] + e.C[1]) / 2];
          return { text: `ABC üçbucağında O — xaricə çəkilmiş çevrənin mərkəzi, H — hündürlüklərin kəsişməsi, M — BC-nin orta nöqtəsidir. ${toAH ? `OM = ${d}. AH-ı tap.` : `AH = ${2 * d}. OM-i tap.`}`,
            svg: fig({ ...P, M }, { free: true, poly: ["A", "B", "C"], polyFill: false, segs: [["A", "H", "acc"], ["O", "M", "acc"]], lab: { [toAH ? "OM" : "AH"]: String(toAH ? d : 2 * d) }, aria: "AH və OM", circ: [["O", e.R]], names: ["A", "B", "C", "O", "H", "M"] }),
            answer: toAH ? 2 * d : d, show: String(toAH ? 2 * d : d), tol: 0.01,
            solution: `G mərkəzli, əmsalı −1/2 olan homotetiya A-nı M-ə, H-ı O-ya aparır. Deməli OM = (1/2) · AH, yəni AH = 2 · OM. ${toAH ? `AH = 2 · ${d} = ${2 * d}.` : `OM = ${2 * d} : 2 = ${d}.`}` };
        }
        if (kind === "r9") {
          const R = rnd(2, 30), ask = pick(["r9", "rmed"]);
          return { text: `ABC üçbucağının xaricinə çəkilmiş çevrənin radiusu ${R}-dir. ${ask === "r9" ? "Doqquz nöqtə çevrəsinin (tərəflərin orta nöqtələrindən keçən çevrə) radiusunu tap." : "Tərəflərinin orta nöqtələri A₁, B₁, C₁ olan A₁B₁C₁ üçbucağının xaricinə çəkilmiş çevrənin radiusunu tap."}`,
            answer: R / 2, show: R % 2 ? frac(R, 2) : String(R / 2), tol: 0.005,
            solution: `Orta üçbucaq ABC üçbucağının G mərkəzli, əmsalı −1/2 olan homotetiyada obrazıdır. Homotetiyada çevrə çevrəyə keçir, radius |k| = 1/2 dəfə dəyişir: ${R} · 1/2 = ${R % 2 ? frac(R, 2) : R / 2}. (Orta üçbucağın xaricinə çəkilmiş çevrə doqquz nöqtə çevrəsidir.)` };
        }
        const s = 4 * rnd(1, 40), askP = Math.random() < .4;
        if (askP) { const per = 2 * rnd(3, 30); return { text: `ABC üçbucağının perimetri ${per}-dir. Tərəflərinin orta nöqtələrini birləşdirən üçbucağın perimetrini tap.`, answer: per / 2, show: String(per / 2), tol: 0.01,
          solution: `Orta üçbucaq ABC-nin G mərkəzli, əmsalı −1/2 olan homotetiyada obrazıdır (tərəfləri yarı qədərdir). Perimetr ${per} : 2 = ${per / 2}.` }; }
        return { text: `ABC üçbucağının sahəsi ${s}-dir. Tərəflərinin orta nöqtələrini birləşdirən üçbucağın sahəsini tap.`, answer: s / 4, show: String(s / 4), tol: 0.01,
          solution: `Orta üçbucaq ABC-nin G mərkəzli, əmsalı −1/2 olan homotetiyada obrazıdır. Sahə k² = 1/4 dəfə dəyişir: ${s} : 4 = ${s / 4}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Oxşar üçbucaqlar və homotetiya həyatda: kölgə, proyektor, plan miqyası.",
      gen() {
        const kind = pick(["kolge", "proyektor", "plan", "kolge2"]);
        if (kind === "kolge") {
          let h1, s1, s2, H; do { h1 = rnd(1, 3); s1 = rnd(1, 4); s2 = rnd(4, 24); H = h1 * s2 / s1; } while (!Number.isInteger(H) || H > 40 || H < 2);
          return { text: `${h1} m hündürlüyündə şaquli dirəyin kölgəsi ${s1} m-dir. Eyni anda ağacın kölgəsi ${s2} m-dir. Ağacın hündürlüyü neçə metrdir?`, answer: H, unit: "m", show: String(H), tol: 0.01,
            solution: `Günəş şüaları paraleldir, ona görə dirək və ağac oxşar düzbucaqlı üçbucaqlar yaradır: H/${s2} = ${h1}/${s1}. H = ${s2} · ${h1}/${s1} = ${H} m.` };
        }
        if (kind === "kolge2") {
          const d1 = rnd(2, 6), d2 = d1 * rnd(2, 4), h = rnd(1, 5);
          return { text: `Divardan ${d2} m aralıda nöqtəvi lampa yanır. Lampa ilə divar arasında, lampadan ${d1} m məsafədə, divara paralel ${h} m hündürlüyündə lövhə qoyulub. Lövhənin divara saldığı kölgənin hündürlüyü neçə metrdir?`, answer: h * d2 / d1, unit: "m", show: frac(h * d2, d1), tol: 0.005,
            solution: `Lampa homotetiya mərkəzidir: kölgə lövhənin obrazıdır. Əmsal = lampadan divara məsafə / lampadan lövhəyə məsafə = ${d2}/${d1}. Kölgənin hündürlüyü = ${h} · ${d2}/${d1} = ${frac(h * d2, d1)} m.` };
        }
        if (kind === "proyektor") {
          const w = rnd(2, 6) * 2, d1 = rnd(2, 5) * 2, d2 = d1 * rnd(2, 6) / 2;
          return { text: `Proyektorun lampası slaydın ${d1} sm qarşısındadır; slaydın eni ${w} sm-dir. Ekran lampadan ${d2} sm məsafədədir və slayda paraleldir. Ekrandakı təsvirin eni neçə santimetrdir?`, answer: w * d2 / d1, unit: "sm", show: frac(w * d2, d1), tol: 0.005,
            solution: `Lampa homotetiya mərkəzidir, təsvir slaydın obrazıdır: k = ${d2}/${d1}. Eni = ${w} · ${d2}/${d1} = ${frac(w * d2, d1)} sm.` };
        }
        const k = pick([50, 100, 200, 500]), sp = rnd(2, 20), real = sp * k * k / 10000;
        return { text: `Torpaq sahəsinin planı 1 : ${k} miqyasdadır. Plandakı sahəsi ${sp} sm²-dir. Sahənin həqiqi sahəsi neçə kvadrat metrdir? (1 m² = 10 000 sm²)`, answer: real, unit: "m²", show: Number.isInteger(real) ? String(real) : frac(sp * k * k, 10000), tol: 0.005,
          solution: `Uzunluqlar ${k} dəfə böyüyür, sahə isə ${k}² = ${k * k} dəfə. Həqiqi sahə = ${sp} · ${k * k} = ${sp * k * k} sm² = ${sp * k * k}/10000 m² = ${Number.isInteger(real) ? real : frac(sp * k * k, 10000)} m².` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2);
        if (Math.random() < .6) {
          const p = rnd(1, 4), q = rnd(p + 1, 6), t = rnd(1, 6), s = p * p * t, big = q * q * t;
          const st = [`ADE ~ ABC (DE ∥ BC), oxşarlıq əmsalı k = AD/AB = ${p}/${q}.`, `Sahələr nisbəti k² = ${p * p}/${q * q}.`, `S(ABC) = ${s} · ${q * q}/${p * p} = ${big}.`];
          if (bad === 0) st[0] = `ADE ~ ABC (DE ∥ BC), oxşarlıq əmsalı k = AD/DB = ${p}/${q - p}.`;
          if (bad === 1) st[1] = `Sahələr nisbəti k = ${p}/${q}.`;
          if (bad === 2) st[2] = pick([`S(ABC) = ${s} · ${p * p}/${q * q} = ${ks(s * p * p, q * q)}.`, `S(ABC) = ${s} · ${q}/${p} = ${ks(s * q, p)}.`]);
          const why = [`1-ci addım səhvdir: oxşarlıq əmsalı AD/AB = ${p}/${q} (bütün tərəfə nisbət), AD/DB deyil. Düz cavab ${big}.`,
            `2-ci addım səhvdir: sahələrin nisbəti əmsalın kvadratıdır: k² = ${p * p}/${q * q}. Düz cavab ${big}.`,
            `3-cü addım səhvdir: böyük üçbucağın sahəsi kiçiyin sahəsinin ${q * q}/${p * p} mislidir: ${s} · ${q * q}/${p * p} = ${big}. Düz cavab ${big}.`][bad];
          return { text: steps(`ABC üçbucağında D ∈ AB, E ∈ AC, DE ∥ BC, AD : AB = ${p} : ${q}, S(ADE) = ${s}. S(ABC)-ni tapırıq.`, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
        }
        const [p, q] = pick(KS), ox = rnd(1, 5) * pick([-1, 1]), oy = rnd(-5, 5); let u = 0, v = 0; while (!u && !v) { u = rnd(-4, 4); v = rnd(-4, 4); }
        const X = [ox + q * u, oy + q * v], Y = [ox + p * u, oy + p * v], kk = ks(p, q);
        const st = [`Homotetiyada M' = O + k · (M − O).`, `M − O = ${pt(q * u, q * v)}, k = ${kk}, k · (M − O) = ${pt(p * u, p * v)}.`, `M' = O + ${pt(p * u, p * v)} = ${pt(...Y)}.`];
        if (bad === 0) st[0] = `Homotetiyada M' = k · M (mərkəzdən asılı olmayaraq).`;
        if (bad === 1) st[1] = `M − O = ${pt(q * u, q * v)}, k = ${kk}, k · (M − O) = ${pt(p * u, p * v + 1)}.`;
        if (bad === 2) st[2] = `M' = M + ${pt(p * u, p * v)} = ${pt(X[0] + p * u, X[1] + p * v)}.`;
        const why = [`1-ci addım səhvdir: düz düstur M' = O + k · (M − O). Mərkəz koordinat başlanğıcı deyilsə, M' = k · M doğru deyil. Düz cavab M'${pt(...Y)}.`,
          `2-ci addım səhvdir: k · (M − O) = ${pt(p * u, p * v)} olmalıdır. Düz cavab M'${pt(...Y)}.`,
          `3-cü addım səhvdir: obraz O-ya vektoru əlavə etməklə tapılır, M-ə yox: M' = O + k · (M − O). Düz cavab M'${pt(...Y)}.`][bad];
        return { text: steps(`Mərkəzi O${pt(ox, oy)}, əmsalı k = ${kk} olan homotetiyada M${pt(...X)} nöqtəsinin obrazı M'-ü tapırıq.`, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-homotetiya", title: "Oxşarlıq və homotetiya", fenn: "olimpiada", link: "dersler/ol-homotetiya.html",
      format: "Cavab ədəddir: tam 6, mənfi −3, kəsr 15/4 (onluq 3.75 də olar).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["homotetiya","homotetiya","oxsar","oxsar","trapesiya","trapesiya","kvadrat","eyler","heyat","sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-homotetiya.html")) b.push("dersler/ol-homotetiya.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
