// Daxilə və xaricə çəkilmiş çevrələr (üçbucaq, düzgün çoxbucaqlı, dördbucaqlı) — mastery game levels and the final test.
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
  // triangle by sides: a = BC, b = CA, c = AB; B at the origin, C on the x-axis
  const tri = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a); return { A: [x, Math.sqrt(c * c - x * x)], B: [0, 0], C: [a, 0] }; };
  const inC = (P, a, b, c) => [0, 1].map(i => (a * P.A[i] + b * P.B[i] + c * P.C[i]) / (a + b + c));
  const outC = P => { const a = P.C[0], [x, y] = P.A; return [a / 2, ((a / 2 - x) ** 2 + y * y - a * a / 4) / (2 * y)]; };
  const foot = (O, X, Y) => { const d = [Y[0] - X[0], Y[1] - X[1]], t = ((O[0] - X[0]) * d[0] + (O[1] - X[1]) * d[1]) / (d[0] ** 2 + d[1] ** 2); return [X[0] + t * d[0], X[1] + t * d[1]]; };
  const area = P => Math.abs((P.B[0] - P.A[0]) * (P.C[1] - P.A[1]) - (P.C[0] - P.A[0]) * (P.B[1] - P.A[1])) / 2;
  // integer-area triangles [a, b, c, S]
  const HERON = [[5, 5, 6, 12], [5, 5, 8, 12], [13, 14, 15, 84], [10, 13, 13, 60], [13, 13, 24, 60], [9, 10, 17, 36], [6, 25, 29, 60], [7, 15, 20, 42], [11, 13, 20, 66],
    [10, 17, 21, 84], [13, 20, 21, 126], [12, 17, 25, 90], [17, 25, 28, 210], [4, 13, 15, 24], [14, 25, 25, 168], [16, 17, 17, 120], [12, 10, 10, 48]];
  const ABC = ["A", "B", "C"];
  const half = c => c % 2 ? `${c}/2` : `${c} / 2 = ${c / 2}`;          // "17/2" or "16 / 2 = 8"
  const sq = x => String(x).includes("/") ? `(${x})²` : `${x}²`;
  const eqs = (a, b) => a === b ? a : `${a} = ${b}`;
  // incircle figure for sides a, b, c
  function inFig(a, b, c, lab, extra = {}) {
    const P = tri(a, b, c), I = inC(P, a, b, c), r = 2 * area(P) / (a + b + c);
    P.O = I; P.K = foot(I, P.A, P.B); P.L = foot(I, P.B, P.C); P.M = foot(I, P.C, P.A);
    return figure(P, { poly: ABC, names: extra.names || ABC, circ: [["O", r, "acc"]], segs: extra.segs || [], right: extra.right || [], lab, rot: [0, 1, 2, 3], ...extra.o });
  }
  function outFig(P, lab, extra = {}) {
    P.O = outC(P);
    const R = Math.hypot(P.A[0] - P.O[0], P.A[1] - P.O[1]);
    return figure(P, { poly: ABC, names: ["A", "B", "C", "O"], circ: [["O", R, "acc"]], cen: "O", segs: extra.segs || [], right: extra.right || [], arcs: extra.arcs || [], lab, free: true });
  }

  const levels = [
    { id: "daxili", ad: "Üçbucağa daxil çəkilmiş çevrə", izah: "Mərkəz — tənbölənlərin kəsişməsi. r = S / p (p — yarımperimetr). Düzbucaqlı üçbucaqda r = (a + b − c) / 2.",
      gen() {
        const kind = pick(["duz", "duz", "sp", "sp", "isos", "tp", "rp"]);
        if (kind === "duz") {
          const [p, q, c] = triple(50), r = (p + q - c) / 2, sub = pick(["leg", "leg", "hip"]);
          const svg = inFig(q, c, p, sub === "leg" ? { AB: String(p), BC: String(q) } : { AB: String(p), CA: String(c) }, { o: { right: [["B", "A", "C"]] } });
          if (sub === "leg") return { text: `Düzbucaqlı üçbucağın katetləri ${p} və ${q}. Daxilə çəkilmiş çevrənin radiusunu tap.`, svg, answer: r, show: String(r), tol: 0.01,
            solution: `Hipotenuz c = √(${p}² + ${q}²) = ${c}. r = (a + b − c) / 2 = (${p} + ${q} − ${c}) / 2 = ${r}.` };
          return { text: `Düzbucaqlı üçbucağın hipotenuzu ${c}, bir kateti ${p}. Daxilə çəkilmiş çevrənin radiusunu tap.`, svg, answer: r, show: String(r), tol: 0.01,
            solution: `O biri katet = √(${c}² − ${p}²) = ${q}. r = (${p} + ${q} − ${c}) / 2 = ${r}.` };
        }
        if (kind === "sp") {
          const [a, b, c, S] = pick(HERON), k = pick([1, 1, 2]), A = a * k, B = b * k, C = c * k, SS = S * k * k, p = (A + B + C) / 2;
          return { text: `Üçbucağın tərəfləri ${A}, ${B}, ${C}, sahəsi ${SS}. Daxilə çəkilmiş çevrənin radiusunu tap.`, svg: inFig(A, B, C, { BC: String(A), CA: String(B), AB: String(C) }),
            answer: SS / p, show: frac(SS, p), placeholder: "məs. 4 və ya 12/5",
            solution: `p = (${A} + ${B} + ${C}) / 2 = ${p}. r = S / p = ${SS} / ${p} = ${frac(SS, p)}.` };
        }
        if (kind === "isos") {
          const [x, y, c] = triple(30), S = x * y, p = c + x;
          return { text: `Bərabəryanlı üçbucağın yan tərəfləri ${c}, oturacağı ${2 * x}. Daxilə çəkilmiş çevrənin radiusunu tap.`, svg: inFig(2 * x, c, c, { BC: String(2 * x), CA: String(c), AB: String(c) }),
            answer: S / p, show: frac(S, p), placeholder: "məs. 3 və ya 8/3",
            solution: `Oturacağa çəkilmiş hündürlük onu yarıya bölür: h = √(${c}² − ${x}²) = ${y}. S = ${2 * x} · ${y} / 2 = ${S}. p = (${c} + ${c} + ${2 * x}) / 2 = ${p}. r = S / p = ${frac(S, p)}.` };
        }
        if (kind === "tp") {
          let a, b, c; do { a = rnd(4, 18); b = rnd(4, 18); c = rnd(4, 18); } while (a >= b + c || b >= a + c || c >= a + b || (b + c - a) % 2 || new Set([a, b, c]).size < 3);
          const ak = (b + c - a) / 2;
          return { text: `ABC üçbucağında AB = ${c}, BC = ${a}, AC = ${b}. Daxilə çəkilmiş çevrə AB tərəfinə K nöqtəsində toxunur. AK-nı tap.`,
            svg: inFig(a, b, c, { AB: String(c), BC: String(a), CA: String(b) }, { names: ["A", "B", "C", "K", "L", "M"], o: { place: { K: ["O", "out"] } } }), answer: ak, show: String(ak), tol: 0.01,
            solution: `Toxunan parçaları: AK = AM = x, BK = BL = ${c} − x, CL = CM = ${b} − x. BL + LC = BC: (${c} − x) + (${b} − x) = ${a} → x = (${b} + ${c} − ${a}) / 2 = ${ak}.` };
        }
        const r = rnd(2, 9), P = 2 * rnd(8, 30);
        return { text: `Üçbucağın perimetri ${P}, daxilə çəkilmiş çevrənin radiusu ${r}. Üçbucağın sahəsini tap.`, answer: P * r / 2, show: String(P * r / 2), tol: 0.01,
          solution: `S = r · p, p — yarımperimetr: p = ${P} / 2 = ${P / 2}. S = ${r} · ${P / 2} = ${P * r / 2}.` };
      } },

    { id: "xarici", ad: "Üçbucağa xaric çəkilmiş çevrə", izah: "Mərkəz — orta perpendikulyarların kəsişməsi. Düzbucaqlı üçbucaqda R = c / 2. Ümumi hal: R = abc / (4S).",
      gen() {
        const kind = pick(["duz", "duz", "isos", "sp", "bucaq", "bucaq"]);
        if (kind === "duz") {
          const [p, q, c] = triple(50), sub = pick(["R", "leg", "med"]), P = tri(q, c, p);
          if (sub === "R") return { text: `Düzbucaqlı üçbucağın katetləri ${p} və ${q}. Xaricə çəkilmiş çevrənin radiusunu tap.`, svg: outFig(P, { AB: String(p), BC: String(q) }, { right: [["B", "A", "C"]] }),
            answer: c / 2, show: frac(c, 2), placeholder: "məs. 5 və ya 13/2",
            solution: `Düzbucaqlı üçbucaqda xaricə çəkilmiş çevrənin mərkəzi hipotenuzun ortasıdır. c = √(${p}² + ${q}²) = ${c}, R = ${half(c)}.` };
          const k = c % 2 ? 2 : 1;
          if (sub === "leg") return { text: `Düzbucaqlı üçbucağa xaricə çəkilmiş çevrənin radiusu ${c * k / 2}, bir kateti ${p * k}. O biri kateti tap.`, svg: outFig(P, { AB: String(p * k), BC: "?" }, { right: [["B", "A", "C"]] }),
            answer: q * k, show: String(q * k), tol: 0.01,
            solution: `Hipotenuz diametrdir: c = 2 · ${c * k / 2} = ${c * k}. Katet = √(${c * k}² − ${p * k}²) = ${q * k}.` };
          return { text: `Düzbucaqlı üçbucağın katetləri ${p} və ${q}. Hipotenuza çəkilmiş medianı tap.`, answer: c / 2, show: frac(c, 2), placeholder: "məs. 5 və ya 13/2",
            solution: `Hipotenuzun ortası xaricə çəkilmiş çevrənin mərkəzidir, median isə radiusdur: m = c / 2 = √(${p * p} + ${q * q}) / 2 = ${half(c)}.` };
        }
        if (kind === "isos") {
          const [x, y, c] = triple(30);
          return { text: `Bərabəryanlı üçbucağın yan tərəfləri ${c}, oturacağı ${2 * x}. Xaricə çəkilmiş çevrənin radiusunu tap.`, svg: outFig(tri(2 * x, c, c), { BC: String(2 * x), CA: String(c), AB: String(c) }),
            answer: c * c / (2 * y), show: frac(c * c, 2 * y), placeholder: "məs. 5 və ya 25/8",
            solution: `h = √(${c}² − ${x}²) = ${y}, S = ${2 * x} · ${y} / 2 = ${x * y}. R = abc / (4S) = ${c} · ${c} · ${2 * x} / (4 · ${x * y}) = ${frac(c * c, 2 * y)}.` };
        }
        if (kind === "sp") {
          const [a, b, c, S] = pick(HERON), num = a * b * c, den = 4 * S;
          return { text: `Üçbucağın tərəfləri ${a}, ${b}, ${c}, sahəsi ${S}. Xaricə çəkilmiş çevrənin radiusunu tap.`, svg: outFig(tri(a, b, c), { BC: String(a), CA: String(b), AB: String(c) }),
            answer: num / den, show: frac(num, den), placeholder: "məs. 65/8",
            solution: `R = abc / (4S) = ${a} · ${b} · ${c} / (4 · ${S}) = ${num} / ${den} = ${frac(num, den)}.` };
        }
        // angle C and side AB: central angle over AB
        const Cd = pick([30, 45, 60, 90, 120, 135, 150]), k = rnd(2, 12), n = { 30: 1, 150: 1, 45: 2, 135: 2, 60: 3, 120: 3, 90: 4 }[Cd];
        const ab = surd(k, 1, n), psi = 2 * Cd, a0 = rnd(0, 359);
        const P = { A: on(a0), B: on(a0 + psi), C: on(a0 + psi + rnd(15, 345 - psi)), O: [0, 0] };
        const cen = Cd > 90 ? 360 - 2 * Cd : 2 * Cd;
        const why = { 60: "AOB bərabəryanlıdır və bucağı 60° — deməli bərabərtərəflidir: AB = R.", 90: "AOB düzbucaqlı bərabəryanlı üçbucaqdır: AB = R√2.", 120: "AOB-da O-dan AB-yə hündürlük çəksək, 30°-li bucaq qarşısında R/2 alınır, AB = 2 · (R√3/2) = R√3.", 180: "AB diametrdir: AB = 2R." }[cen];
        const svg = figure(P, { poly: ABC, polyFill: false, circ: [["O", 1, "acc"]], cen: "O", segs: [["O", "A", "dash"], ["O", "B", "dash"]], arcs: [["C", "A", "B", Cd + "°", 16]], free: true });
        const ask = Math.random() < .5;
        const Rv = n === 4 ? k / 2 : k, Rs = n === 4 ? frac(k, 2) : String(k), abS = n === 4 ? String(k) : ab[0], abV = n === 4 ? k : ab[1];
        if (ask) return { text: `ABC üçbucağında ∠C = ${Cd}°, AB = ${abS}. Xaricə çəkilmiş çevrənin radiusunu tap.`, svg, answer: Rv, show: Rs, placeholder: "məs. 6 və ya 7/2",
          solution: `O — mərkəz. AB-yə söykənən mərkəzi bucaq ∠AOB = ${cen}°${Cd > 90 ? ` (C kiçik qövsdədir: 360° − 2 · ${Cd}°)` : ` (2 · ${Cd}°)`}. OA = OB = R. ${why} Deməli R = ${Rs}.` };
        const abA = n === 4 ? [String(2 * k), 2 * k] : surd(k, 1, n);
        return { text: `ABC üçbucağında ∠C = ${Cd}°, xaricə çəkilmiş çevrənin radiusu ${k}. AB-ni tap.`, svg, answer: abA[1], show: abA[0], placeholder: "məs. 6√3",
          solution: `∠AOB = ${cen}° (AB-yə söykənən mərkəzi bucaq). ${why} R = ${k} olduğundan AB = ${abA[0]}.` };
      } },

    { id: "duzgun", ad: "Düzgün çoxbucaqlılar", izah: "Bərabərtərəfli üçbucaq: R = a√3/3, r = a√3/6, R = 2r. Kvadrat: R = a√2/2, r = a/2. Düzgün altıbucaqlı: R = a, r = a√3/2.",
      gen() {
        const shape = pick(["uc", "uc", "kv", "alti"]), k = rnd(1, 12) * (shape === "uc" ? 1 : 1);
        const reg = n => { const P = { O: [0, 0] }, names = []; for (let i = 0; i < n; i++) { const L = "ABCDEF"[i]; P[L] = on(90 + 360 * i / n); names.push(L); } P.H = [(P.A[0] + P.B[0]) / 2, (P.A[1] + P.B[1]) / 2]; return [P, names]; };
        const fig = n => { const [P, names] = reg(n); const r = Math.cos(Math.PI / n);
          return figure(P, { poly: names, polyFill: false, names: [...names, "O"], circ: [["O", 1, "fill"], ["O", r, "acc"]], cen: "O", segs: [["O", "A", "dash"], ["O", "H", "dash"]], right: [["H", "O", "A"]], rot: [0], place: { O: ["B", "out"] } }); };
        const T = shape === "uc" ? "Bərabərtərəfli üçbucağın" : shape === "kv" ? "Kvadratın" : "Düzgün altıbucaqlının";
        const opts = {
          uc: [
            () => { const [rs, rv] = surd(k, 3, 3); return [`tərəfi ${k}. Xaricə çəkilmiş çevrənin radiusunu tap.`, rs, rv, `R = a√3/3 = ${eqs((k === 1 ? "" : k) + "√3/3", rs)}.`]; },
            () => [`tərəfi ${surd(k, 1, 3)[0]}. Xaricə çəkilmiş çevrənin radiusunu tap.`, String(k), k, `R = a√3/3 = ${surd(k, 1, 3)[0]} · √3 / 3 = ${3 * k}/3 = ${k}.`],
            () => [`tərəfi ${surd(2 * k, 1, 3)[0]}. Daxilə çəkilmiş çevrənin radiusunu tap.`, String(k), k, `r = a√3/6 = ${surd(2 * k, 1, 3)[0]} · √3 / 6 = ${6 * k}/6 = ${k}.`],
            () => { const [rs, rv] = surd(k, 6, 3); return [`tərəfi ${k}. Daxilə çəkilmiş çevrənin radiusunu tap.`, rs, rv, `r = a√3/6 = ${eqs((k === 1 ? "" : k) + "√3/6", rs)}.`]; },
            () => [`daxilinə çəkilmiş çevrənin radiusu ${k}. Xaricə çəkilmiş çevrənin radiusunu tap.`, String(2 * k), 2 * k, `Bərabərtərəfli üçbucaqda mərkəz medianı 2 : 1 bölür: R = 2r = ${2 * k}.`],
            () => [`xaricinə çəkilmiş çevrənin radiusu ${k}. Daxilə çəkilmiş çevrənin radiusunu tap.`, frac(k, 2), k / 2, `R = 2r → r = ${k} / 2 = ${frac(k, 2)}.`],
            () => { const [s, v] = surd(2 * k, 1, 3); return [`daxilinə çəkilmiş çevrənin radiusu ${k}. Üçbucağın tərəfini tap.`, s, v, `r = a√3/6 → a = 6r/√3 = 2√3 · r = ${s}.`]; },
            () => { const [s, v] = surd(k, 1, 3); return [`xaricinə çəkilmiş çevrənin radiusu ${k}. Üçbucağın tərəfini tap.`, s, v, `R = a√3/3 → a = 3R/√3 = R√3 = ${s}.`]; },
            () => [`hündürlüyü ${3 * k}. Xaricə çəkilmiş çevrənin radiusunu tap.`, String(2 * k), 2 * k, `Mərkəz həm də medianların kəsişməsidir və hündürlüyü 2 : 1 bölür: R = 2/3 · ${3 * k} = ${2 * k}.`],
          ],
          kv: [
            () => { const [s, v] = surd(k, 2, 2); return [`tərəfi ${k}. Xaricə çəkilmiş çevrənin radiusunu tap.`, s, v, `R — diaqonalın yarısıdır: R = a√2/2 = ${eqs((k === 1 ? "" : k) + "√2/2", s)}.`]; },
            () => [`tərəfi ${surd(k, 1, 2)[0]}. Xaricə çəkilmiş çevrənin radiusunu tap.`, String(k), k, `Diaqonal = a√2 = ${surd(k, 1, 2)[0]} · √2 = ${2 * k}, R = ${2 * k} / 2 = ${k}.`],
            () => [`tərəfi ${k}. Daxilə çəkilmiş çevrənin radiusunu tap.`, frac(k, 2), k / 2, `Daxilə çəkilmiş çevrənin diametri tərəfə bərabərdir: r = a/2 = ${frac(k, 2)}.`],
            () => { const [s, v] = surd(k, 1, 2); return [`xaricinə çəkilmiş çevrənin radiusu ${k}. Kvadratın tərəfini tap.`, s, v, `Diaqonal = 2R = ${2 * k}. a = d/√2 = ${2 * k}/√2 = ${s}.`]; },
            () => { const [s, v] = surd(k, 1, 2); return [`daxilinə çəkilmiş çevrənin radiusu ${k}. Xaricə çəkilmiş çevrənin radiusunu tap.`, s, v, `a = 2r = ${2 * k}. R = a√2/2 = ${s}.`]; },
            () => [`xaricinə çəkilmiş çevrənin radiusu ${k}. Kvadratın sahəsini tap.`, String(2 * k * k), 2 * k * k, `Diaqonal = 2R = ${2 * k}. Kvadratın sahəsi = d²/2 = ${4 * k * k}/2 = ${2 * k * k}.`],
          ],
          alti: [
            () => [`tərəfi ${k}. Xaricə çəkilmiş çevrənin radiusunu tap.`, String(k), k, `Düzgün altıbucaqlı 6 bərabərtərəfli üçbucaqdan ibarətdir: R = a = ${k}.`],
            () => { const [s, v] = surd(k, 2, 3); return [`tərəfi ${k}. Daxilə çəkilmiş çevrənin radiusunu tap.`, s, v, `r — bərabərtərəfli üçbucağın hündürlüyüdür: r = a√3/2 = ${eqs((k === 1 ? "" : k) + "√3/2", s)}.`]; },
            () => [`daxilinə çəkilmiş çevrənin radiusu ${surd(k, 1, 3)[0]}. Altıbucaqlının tərəfini tap.`, String(2 * k), 2 * k, `r = a√3/2 → a = 2r/√3 = 2 · ${surd(k, 1, 3)[0]} / √3 = ${2 * k}.`],
            () => [`xaricinə çəkilmiş çevrənin radiusu ${k}. Böyük diaqonalını tap.`, String(2 * k), 2 * k, `Böyük diaqonal mərkəzdən keçir — diametrdir: 2R = ${2 * k}.`],
            () => [`xaricinə çəkilmiş çevrənin radiusu ${k}. Perimetrini tap.`, String(6 * k), 6 * k, `a = R = ${k}, P = 6a = ${6 * k}.`],
          ],
        }[shape];
        const [q, s, v, sol] = pick(opts)();
        return { text: `${T} ${q}`, svg: fig({ uc: 3, kv: 4, alti: 6 }[shape]), answer: v, show: s, placeholder: "məs. 4√3 və ya √2/2", solution: sol };
      } },

    { id: "daxdord", ad: "Dördbucaqlıya daxil çəkilmiş çevrə", izah: "Dördbucaqlıya çevrə daxil etmək olar ⇔ qarşı tərəflərin cəmləri bərabərdir: a + c = b + d. Sahə S = r · p.",
      gen() {
        const kind = pick(["teref", "teref", "perim", "trap", "trap", "romb", "sr"]);
        if (kind === "teref") {
          let ab, bc, cd, ad; do { ab = rnd(3, 20); bc = rnd(3, 20); cd = rnd(3, 20); ad = ab + cd - bc; } while (ad < 3 || ad > 25 || new Set([ab, bc, cd, ad]).size < 3);
          return { text: `ABCD dördbucaqlısına çevrə daxil edilib. AB = ${ab}, BC = ${bc}, CD = ${cd}. AD-ni tap.`, answer: ad, show: String(ad), tol: 0.01,
            solution: `Çevrə daxil edilibsə, qarşı tərəflərin cəmləri bərabərdir: AB + CD = BC + AD → ${ab} + ${cd} = ${bc} + AD → AD = ${ad}.` };
        }
        if (kind === "perim") {
          const s = rnd(8, 40), sub = Math.random() < .5;
          if (sub) return { text: `ABCD dördbucaqlısına çevrə daxil edilib, AB + CD = ${s}. Dördbucaqlının perimetrini tap.`, answer: 2 * s, show: String(2 * s), tol: 0.01,
            solution: `AB + CD = BC + AD = ${s}. P = ${s} + ${s} = ${2 * s}.` };
          const ab = rnd(2, s - 2);
          return { text: `ABCD dördbucaqlısına çevrə daxil edilib, perimetri ${2 * s}, AB = ${ab}. CD-ni tap.`, answer: s - ab, show: String(s - ab), tol: 0.01,
            solution: `AB + CD = BC + AD, ikisi birlikdə ${2 * s}, deməli AB + CD = ${s}. CD = ${s} − ${ab} = ${s - ab}.` };
        }
        if (kind === "trap") {
          let m, n, kk; do { kk = rnd(1, 4); m = rnd(1, 4); n = rnd(m + 1, 6); } while (kk * n * n > 40 || gcd(m, n) > 1);
          const a = kk * m * m, b = kk * n * n, leg = (a + b) / 2, hh = kk * m * n, ask = pick(["leg", "h", "r", "S"]);
          const P = { A: [0, 0], B: [(b - a) / 2, hh], C: [(b + a) / 2, hh], D: [b, 0], O: [b / 2, hh / 2] };
          const svg = figure(P, { poly: ["A", "B", "C", "D"], names: ["A", "B", "C", "D"], circ: [["O", hh / 2, "acc"]], lab: { BC: String(a), AD: String(b) }, rot: [0, 2] });
          const legS = frac(a + b, 2), base = `Çevrə daxil edilib: AB + CD = BC + AD = ${a + b}. Trapesiya bərabəryanlıdır, yan tərəf = ${legS}.`;
          const hsol = ` Hündürlük: yan tərəfin oturacaqdakı proyeksiyası (${b} − ${a}) / 2 = ${frac(b - a, 2)}, h = √(${sq(legS)} − ${sq(frac(b - a, 2))}) = ${hh}.`;
          const T = { leg: ["Trapesiyanın yan tərəfini", leg, legS, base], h: ["Trapesiyanın hündürlüyünü", hh, String(hh), base + hsol], r: ["Çevrənin radiusunu", hh / 2, frac(hh, 2), base + hsol + ` Çevrənin diametri hündürlüyə bərabərdir: r = ${frac(hh, 2)}.`],
            S: ["Trapesiyanın sahəsini", leg * hh, frac((a + b) * hh, 2), base + hsol + ` S = (${a} + ${b}) / 2 · ${hh} = ${frac((a + b) * hh, 2)}.`] }[ask];
          return { text: `Bərabəryanlı trapesiyaya çevrə daxil edilib, oturacaqları ${a} və ${b}. ${T[0]} tap.`, svg, answer: T[1], show: T[2], placeholder: "məs. 6 və ya 13/2", solution: T[3] };
        }
        if (kind === "romb") {
          const [p, q, c] = triple(30), r2 = 2 * p * q;
          return { text: `Rombun diaqonalları ${2 * p} və ${2 * q}. Rombun daxilinə çəkilmiş çevrənin radiusunu tap.`, answer: p * q / c, show: frac(p * q, c), placeholder: "məs. 12/5",
            solution: `Tərəf = √(${p}² + ${q}²) = ${c}. S = d₁ · d₂ / 2 = ${r2}. Rombun hündürlüyü h = S / a = ${frac(r2, c)}, çevrənin diametri hündürlüyə bərabərdir: r = h / 2 = ${frac(p * q, c)}.` };
        }
        const r = rnd(2, 9), P = 2 * rnd(8, 30);
        return { text: `Dördbucaqlıya çevrə daxil edilib. Dördbucaqlının perimetri ${P}, çevrənin radiusu ${r}. Dördbucaqlının sahəsini tap.`, answer: P * r / 2, show: String(P * r / 2), tol: 0.01,
          solution: `Mərkəzi təpələrlə birləşdirsək, 4 üçbucaq alınır, hər birinin hündürlüyü r-dir: S = r · p = ${r} · ${P / 2} = ${P * r / 2}.` };
      } },

    { id: "xardord", ad: "Dördbucaqlıya xaric çəkilmiş çevrə", izah: "Dördbucaqlıya xaricə çevrə çəkmək olar ⇔ qarşı bucaqların cəmi 180°. Belə trapesiya bərabəryanlıdır, belə paraleloqram — düzbucaqlı.",
      gen() {
        const kind = pick(["qarsi", "qarsi", "nisbet", "xarici", "trap", "duzb"]);
        if (kind === "qarsi" || kind === "xarici") {
          const x = pick(range(40, 140, 5)), pair = pick([["A", "C"], ["C", "A"], ["B", "D"], ["D", "B"]]);
          // build the inscribed quadrilateral with the given angle at pair[0]
          const order = ["A", "B", "C", "D"], i = order.indexOf(pair[0]), arcOpp = 2 * x; // arc not containing the vertex
          const a0 = rnd(0, 359), u = rnd(30, arcOpp - 30), w = rnd(30, 360 - arcOpp - 30), P = { O: [0, 0] };
          // neighbours of the vertex lie at a0 and a0 + arcOpp; the opposite vertex between them, the vertex itself on the other arc
          P[order[(i + 1) % 4]] = on(a0); P[order[(i + 2) % 4]] = on(a0 + u); P[order[(i + 3) % 4]] = on(a0 + arcOpp); P[pair[0]] = on(a0 + arcOpp + w);
          const svg = figure(P, { poly: order, names: order, polyFill: false, circ: [["O", 1, "fill"]], cen: "O", arcs: [[pair[0], order[(i + 1) % 4], order[(i + 3) % 4], x + "°", 18], [pair[1], order[(i + 3) % 4], order[(i + 1) % 4], kind === "qarsi" ? "?" : "", 18]], free: true });
          if (kind === "qarsi") return { text: `ABCD dördbucaqlısı çevrəyə daxil edilib, ∠${pair[0]} = ${x}°. ∠${pair[1]}-ni tap.`, svg, answer: 180 - x, show: (180 - x) + "°", ...deg,
            solution: `Çevrəyə daxil edilmiş dördbucaqlının qarşı bucaqlarının cəmi 180°-dir: ∠${pair[1]} = 180° − ${x}° = ${180 - x}°.` };
          return { text: `ABCD dördbucaqlısı çevrəyə daxil edilib, ∠${pair[0]} = ${x}°. ${pair[1]} təpəsindəki xarici bucağı tap.`, svg, answer: x, show: x + "°", ...deg,
            solution: `∠${pair[1]} = 180° − ${x}° = ${180 - x}°. Xarici bucaq = 180° − ${180 - x}° = ${x}° — yəni qarşı daxili bucağa bərabərdir.` };
        }
        if (kind === "nisbet") {
          let k, m, n; do { k = rnd(1, 9); m = rnd(1, 9); n = rnd(1, 9); } while (180 % (k + n) || m * 180 / (k + n) >= 180 || k === n);
          const uu = 180 / (k + n), B = m * uu, D = 180 - B;
          return { text: `ABCD dördbucaqlısı çevrəyə daxil edilib, ∠A : ∠B : ∠C = ${k} : ${m} : ${n}. ∠D-ni tap.`, answer: D, show: D + "°", ...deg,
            solution: `∠A + ∠C = 180°, ${k} + ${n} = ${k + n} hissə, bir hissə = 180° : ${k + n} = ${uu}°. ∠B = ${m} · ${uu}° = ${B}°. ∠D = 180° − ${B}° = ${D}°.` };
        }
        if (kind === "trap") {
          const x = pick([...range(40, 85, 5), ...range(95, 140, 5)]), big = Math.random() < .5, ans = big ? Math.max(x, 180 - x) : Math.min(x, 180 - x);
          return { text: `Çevrəyə daxil edilmiş trapesiyanın bir bucağı ${x}°. Trapesiyanın ən ${big ? "böyük" : "kiçik"} bucağını tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Çevrəyə daxil edilmiş trapesiya bərabəryanlıdır: bucaqları ${Math.min(x, 180 - x)}°, ${Math.min(x, 180 - x)}°, ${Math.max(x, 180 - x)}°, ${Math.max(x, 180 - x)}° (yan tərəfə bitişik bucaqların cəmi 180°). Ən ${big ? "böyük" : "kiçik"}: ${ans}°.` };
        }
        const [p, q, c] = triple(50);
        return { text: `Düzbucaqlının tərəfləri ${p} və ${q}. Ona xaricə çəkilmiş çevrənin radiusunu tap.`, answer: c / 2, show: frac(c, 2), placeholder: "məs. 5 və ya 13/2",
          solution: `Düzbucaqlının diaqonalı xaricə çəkilmiş çevrənin diametridir: d = √(${p}² + ${q}²) = ${c}, R = ${frac(c, 2)}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Mətnli məsələ: daxilə çəkilmiş çevrə — fiqurun içinə sığan ən böyük dairə; xaricə çəkilmiş — hamısını əhatə edən ən kiçik dairə (və ya hər təpədən eyni məsafə).",
      gen() {
        const t = pick(["fevvare", "qulle", "qayka", "nisan", "lovhe"]);
        if (t === "fevvare") {
          const [p, q, c] = triple(60), r = (p + q - c) / 2;
          return { text: `Bağ düzbucaqlı üçbucaq şəklindədir: katetləri ${p} m və ${q} m. Bağın içinə tərəflərin üçünə də toxunan dairəvi gül sahəsi salınır. Onun radiusu neçə metrdir?`, answer: r, show: r + " m", unit: "m", tol: 0.01,
            solution: `Bu, daxilə çəkilmiş çevrədir. Hipotenuz √(${p}² + ${q}²) = ${c} m. r = (${p} + ${q} − ${c}) / 2 = ${r} m.` };
        }
        if (t === "qulle") {
          const [p, q, c] = triple(60);
          return { text: `Üç kənd düzbucaqlı üçbucağın təpələrindədir, katetlər ${p} km və ${q} km. Hər üç kənddən eyni məsafədə su qülləsi tikilir. Qüllədən hər kəndə qədər neçə km-dir?`, answer: c / 2, show: frac(c, 2), unit: "km", placeholder: "məs. 13/2",
            solution: `Üç təpədən eyni məsafədə olan nöqtə xaricə çəkilmiş çevrənin mərkəzidir. Düzbucaqlı üçbucaqda o, hipotenuzun ortasıdır: R = √(${p}² + ${q}²) / 2 = ${c} / 2 = ${frac(c, 2)} km.` };
        }
        if (t === "qayka") {
          const a = rnd(4, 24), [s, v] = surd(a, 1, 3);
          return { text: `Qayka düzgün altıbucaqlı şəklindədir, tərəfi ${a} mm. Açarın ağzı qarşı tərəflər arasındakı məsafəyə bərabər olmalıdır. Bu məsafə neçə mm-dir?`, answer: v, show: s, unit: "mm", placeholder: "məs. 8√3",
            solution: `Qarşı tərəflər arasındakı məsafə daxilə çəkilmiş çevrənin diametridir: 2r = 2 · a√3/2 = a√3 = ${s} mm.` };
        }
        if (t === "nisan") {
          const k = rnd(2, 15), a = 6 * k, [s, v] = surd(k, 1, 3);
          return { text: `Yol nişanı bərabərtərəfli üçbucaq şəklindədir, tərəfi ${a} sm. Onun içinə tərəflərə toxunan dairəvi işıqqaytaran yapışdırılır. Dairənin radiusu neçə sm-dir?`, answer: v, show: s, unit: "sm", placeholder: "məs. 5√3",
            solution: `r = a√3/6 = ${a}√3/6 = ${s} sm.` };
        }
        const a = rnd(3, 30), [s, v] = surd(a, 1, 2);
        return { text: `Kvadrat şəkilli lövhənin tərəfi ${a} sm. Lövhəni tam örtən ən kiçik dairəvi örtüyün diametri neçə sm-dir?`, answer: v, show: s, unit: "sm", placeholder: "məs. 10√2",
          solution: `Ən kiçik dairə kvadrata xaricə çəkilmiş çevrədir, onun diametri kvadratın diaqonalıdır: a√2 = ${s} sm.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const t = pick(["rduz", "Rduz", "dord", "xard"]), bad = rnd(0, 2);
        let task, st, wrong, why;
        if (t === "rduz") {
          const [p, q, c] = triple(50), r = (p + q - c) / 2;
          task = `Məsələ: düzbucaqlı üçbucağın katetləri ${p} və ${q}. Daxilə çəkilmiş çevrənin radiusunu tap.`;
          st = [`Hipotenuz: c = √(${p}² + ${q}²) = ${c}.`, `Düzbucaqlı üçbucaqda r = (a + b − c) / 2.`, `r = (${p} + ${q} − ${c}) / 2 = ${r}.`];
          wrong = [`Hipotenuz: c = ${p} + ${q} = ${p + q}.`, `Düzbucaqlı üçbucaqda r = (a + b + c) / 2.`, `r = (${p} + ${q} − ${c}) / 2 = ${p + q - c}.`];
          why = [`1-ci addımda səhv var: hipotenuz Pifaqorla tapılır: √(${p * p} + ${q * q}) = ${c}.`, `2-ci addımda səhv var: düstur r = (a + b − c) / 2-dir; (a + b + c) / 2 yarımperimetrdir.`, `3-cü addımda səhv var: ${p + q - c}-i 2-yə bölmək unudulub: r = ${r}.`];
        } else if (t === "Rduz") {
          const [p, q, c] = triple(50);
          task = `Məsələ: düzbucaqlı üçbucağın katetləri ${p} və ${q}. Xaricə çəkilmiş çevrənin radiusunu tap.`;
          st = [`Xaricə çəkilmiş çevrənin mərkəzi hipotenuzun ortasıdır.`, `Hipotenuz = √(${p}² + ${q}²) = ${c}.`, `R = ${half(c)}.`];
          wrong = [`Xaricə çəkilmiş çevrənin mərkəzi düz bucağın təpəsidir.`, `Hipotenuz = √(${p}² + ${q}²) = ${c * c}.`, `R = ${c}.`];
          why = [`1-ci addımda səhv var: mərkəz hipotenuzun ortasıdır (diametrə söykənən bucaq 90°-dir).`, `2-ci addımda səhv var: √${c * c} = ${c}, kökü almaq unudulub.`, `3-cü addımda səhv var: hipotenuz diametrdir, radius onun yarısıdır: ${frac(c, 2)}.`];
        } else if (t === "dord") {
          let ab, bc, cd, ad; do { ab = rnd(3, 20); bc = rnd(3, 20); cd = rnd(3, 20); ad = ab + cd - bc; } while (ad < 3 || ad > 25 || bc === cd || ab === bc);
          task = `Məsələ: ABCD dördbucaqlısına çevrə daxil edilib, AB = ${ab}, BC = ${bc}, CD = ${cd}. AD-ni tap.`;
          st = [`Çevrə daxil edilibsə, qarşı tərəflərin cəmləri bərabərdir.`, `AB + CD = BC + AD.`, `AD = ${ab} + ${cd} − ${bc} = ${ad}.`];
          wrong = [`Çevrə daxil edilibsə, qarşı bucaqların cəmi 180°-dir.`, `AB + BC = CD + AD.`, `AD = ${ab} + ${cd} + ${bc} = ${ab + cd + bc}.`];
          why = [`1-ci addımda səhv var: qarşı bucaqların cəmi 180° — xaricə çəkilmiş çevrənin şərtidir. Daxilə çəkilmiş çevrə üçün tərəflərin cəmləri bərabərdir.`, `2-ci addımda səhv var: qarşı tərəflər AB və CD, BC və AD-dir.`, `3-cü addımda səhv var: BC çıxılmalıdır: AD = ${ab} + ${cd} − ${bc} = ${ad}.`];
        } else {
          const x = pick(range(50, 130, 5)), y = pick(range(50, 130, 5));
          task = `Məsələ: ABCD çevrəyə daxil edilib, ∠A = ${x}°, ∠B = ${y}°. ∠C və ∠D-ni tap.`;
          st = [`Çevrəyə daxil edilmiş dördbucaqlıda qarşı bucaqların cəmi 180°-dir.`, `∠C = 180° − ${x}° = ${180 - x}°.`, `∠D = 180° − ${y}° = ${180 - y}°.`];
          wrong = [`Çevrəyə daxil edilmiş dördbucaqlıda qarşı bucaqlar bərabərdir.`, `∠C = 360° − ${x}° = ${360 - x}°.`, `∠D = 180° − ${x}° = ${180 - x}°.`];
          why = [`1-ci addımda səhv var: qarşı bucaqlar bərabər deyil, cəmi 180°-dir.`, `2-ci addımda səhv var: ∠C = 180° − ∠A = ${180 - x}°.`, `3-cü addımda səhv var: ∠D ∠B-nin qarşısındadır: ∠D = 180° − ${y}° = ${180 - y}°.`];
        }
        st[bad] = wrong[bad];
        return { text: steps(task, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: why[bad] };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "daxili-xarici-cevre", title: "Daxilə və xaricə çəkilmiş çevrələr", fenn: "riyaziyyat", link: "dersler/daxili-xarici-cevre.html",
      format: "Cavab — ədəd: radius, tərəf, bucaq (° yazmaq lazım deyil). Kəsr: 13/2, kök: 4√3, √2/2.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["daxili", "daxili", "xarici", "xarici", "duzgun", "duzgun", "daxdord", "daxdord", "xardord", "heyat"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/daxili-xarici-cevre.html")) b.push("dersler/daxili-xarici-cevre.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
