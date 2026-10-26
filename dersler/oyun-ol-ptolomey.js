// Çevrəyə daxil çəkilmiş dördbucaqlı, Ptolomey teoremi (olimpiada) — mastery game levels and the final test.
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
  // right triangles with the same hypotenuse c: two of them glued along the hypotenuse give a cyclic quadrilateral with integer sides
  const FAM = (() => { const m = {}; for (let p = 3; p <= 100; p++) for (let q = p + 1; q <= 120; q++) { const c = Math.round(Math.hypot(p, q)); if (c * c === p * p + q * q && c <= 100) (m[c] = m[c] || []).push([p, q]); } return Object.entries(m).filter(([c, l]) => l.length >= 2).map(([c, l]) => ({ c: +c, l })); })();
  // AC = c is a diameter; AB = ab, BC = bc, CD = cd, DA = da; BD = (ab·cd + bc·da) / c (an integer here)
  function cyc() {
    for (;;) {
      const f = pick(FAM), i = rnd(0, f.l.length - 1); let j; do j = rnd(0, f.l.length - 1); while (j === i);
      let [p1, q1] = f.l[i], [p2, q2] = f.l[j];
      if (Math.random() < .5) [p1, q1] = [q1, p1]; if (Math.random() < .5) [p2, q2] = [q2, p2];
      const num = p1 * p2 + q1 * q2; if (num % f.c) continue;
      return { c: f.c, ab: p1, bc: q1, cd: p2, da: q2, bd: num / f.c };
    }
  }
  function cycFig(q, lab) {
    const c = q.c, P = { O: [0, 0], A: [-c / 2, 0], C: [c / 2, 0], B: [-c / 2 + q.ab * q.ab / c, q.ab * q.bc / c], D: [-c / 2 + q.da * q.da / c, -q.cd * q.da / c] };
    return figure(P, { circ: [["O", c / 2]], cen: "O", names: ["A", "B", "C", "D"], free: true, poly: ["A", "B", "C", "D"], polyFill: false, segs: [["A", "C", "acc"], ["B", "D", "acc"]], lab });
  }
  // angle phi (degrees) on an arc of size `arc` with sin(phi/2) / sin((arc − phi)/2) = ratio
  function arcPhi(arc, ratio) { let lo = 1e-6, hi = arc - 1e-6; for (let i = 0; i < 100; i++) { const mid = (lo + hi) / 2; if (Math.sin(rad(mid / 2)) / Math.sin(rad((arc - mid) / 2)) < ratio) lo = mid; else hi = mid; } return (lo + hi) / 2; }
  // isosceles trapezoids inscribed in a circle with integer bases a < b, leg c, diagonal d: d² = a·b + c²
  const TRAP = (() => { const r = []; for (let s = 1; s <= 30; s++) for (let m = 1; m <= 20; m++) for (let hh = 1; hh <= 40; hh++) { const c = Math.sqrt(m * m + hh * hh), d = Math.sqrt((s + m) ** 2 + hh * hh); if (c % 1 === 0 && d % 1 === 0 && d <= 60) r.push({ a: s, b: s + 2 * m, c, d, h: hh }); } return r; })();
  // three parts of S, each at least 40
  function split3(S) { let x, y; do { x = rnd(40, S - 80); y = rnd(40, S - x - 40); } while (S - x - y < 40); return [x, y, S - x - y]; }

  const levels = [
    { id: "bucaq", ad: "Daxilə çəkilmiş dördbucaqlı: bucaqlar", izah: "Çevrəyə daxil çəkilmiş dördbucaqlıda qarşı bucaqların cəmi 180°-dir. Xarici bucaq daxili qarşı bucağa bərabərdir. Eyni tərəfə baxan bucaqlar bərabərdir.",
      gen() {
        const kind = pick(["opp", "opp", "ext", "alg", "alg", "nisbet", "trap", "same"]), a0 = rnd(0, 359);
        const IV = { A: 0, B: 1, C: 2, D: 3 }, NB = { A: ["D", "B"], B: ["A", "C"], C: ["B", "D"], D: ["C", "A"] };
        // arcs[i]: AB, BC, CD, DA. Split a sum S into two parts, each at least 40
        const split = S => { const x = rnd(40, S - 40); return [x, S - x]; };
        // quadrilateral in which the angle at vertex v equals x: the two arcs far from v sum to 2x
        function quad(v, x) {
          const i = IV[v], ar = [0, 0, 0, 0], far = split(2 * x), near = split(360 - 2 * x);
          ar[(i + 1) % 4] = far[0]; ar[(i + 2) % 4] = far[1]; ar[(i + 3) % 4] = near[0]; ar[i] = near[1];
          return ar;
        }
        const pts = ar => { const g = [a0, a0 + ar[0], a0 + ar[0] + ar[1], a0 + ar[0] + ar[1] + ar[2]]; return { O: [0, 0], A: on(g[0]), B: on(g[1]), C: on(g[2]), D: on(g[3]) }; };
        const base = { circ: C1, cen: "O", names: ["A", "B", "C", "D"], free: true, poly: ["A", "B", "C", "D"], polyFill: false };
        const ang = (v, tx, r) => [v, NB[v][0], NB[v][1], tx, r || 20];
        if (kind === "opp") {
          const [v, w] = pick([["A", "C"], ["C", "A"], ["B", "D"], ["D", "B"]]), x = pick(range(50, 130, 5)) + pick([0, 0, 5]), P = pts(quad(v, x));
          return { text: `ABCD dördbucaqlısı çevrəyə daxil çəkilib. ∠${v} = ${x}°. ∠${w}-ni tap.`,
            svg: figure(P, { ...base, arcs: [ang(v, x + "°"), ang(w, "?")] }), answer: 180 - x, show: (180 - x) + "°", ...deg,
            solution: `Daxilə çəkilmiş dördbucaqlıda qarşı bucaqların cəmi 180°-dir: ∠${w} = 180° − ${x}° = ${180 - x}°.` };
        }
        if (kind === "ext") {
          const x = pick(range(50, 130, 5)), P = pts(quad("A", x)), K = [P.C[0] + .0, P.C[1]];
          // K lies on the extension of BC beyond C (in math coordinates)
          const Kp = [P.C[0] + .55 * (P.C[0] - P.B[0]), P.C[1] + .55 * (P.C[1] - P.B[1])];
          return { text: `ABCD dördbucaqlısı çevrəyə daxil çəkilib. BC tərəfi C-dən o yana K nöqtəsinə qədər uzadılıb. ∠BAD = ${x}°. C təpəsindəki xarici bucağı (∠DCK) tap.`,
            svg: figure({ ...P, K: Kp }, { ...base, names: ["A", "B", "C", "D", "K"], segs: [["C", "K", "acc"]], arcs: [["A", "D", "B", x + "°", 20], ["C", "D", "K", "?", 18]] }), answer: x, show: x + "°", ...deg,
            solution: `∠BCD = 180° − ${x}° = ${180 - x}° (qarşı bucaqlar). ∠DCK onunla qonşu bucaqdır: ∠DCK = 180° − ${180 - x}° = ${x}°. Yəni xarici bucaq daxili qarşı bucağa bərabərdir.` };
        }
        if (kind === "alg") {
          let a, b, c, d, x;
          do { a = rnd(1, 5); c = rnd(1, 5); x = rnd(10, 40); b = rnd(0, 40); d = 180 - b - (a + c) * x; } while (d < 0 || d > 60 || a * x + b > 135 || c * x + d > 135 || a * x + b < 45 || c * x + d < 45);
          const sh = (k, n) => (k === 1 ? "x" : k + "x") + (n ? " + " + n : "");
          const ask = pick(["x", "A", "C"]), av = a * x + b, cv = c * x + d, res = ask === "x" ? x : ask === "A" ? av : cv;
          return { text: `ABCD çevrəyə daxil çəkilmiş dördbucaqlıdır. ∠A = (${sh(a, b)})°, ∠C = (${sh(c, d)})°. ${ask === "x" ? "x-i" : ask === "A" ? "∠A-nı (dərəcə ilə)" : "∠C-ni (dərəcə ilə)"} tap.`,
            svg: figure(pts(quad("A", av)), { ...base, arcs: [ang("A", "", 20), ang("C", "", 20)] }), answer: res, show: String(res) + (ask === "x" ? "" : "°"), tol: 0.01,
            solution: `Qarşı bucaqların cəmi 180°: ${sh(a, b)} + ${sh(c, d)} = 180 → ${a + c}x + ${b + d} = 180 → x = ${x}. ∠A = ${av}°, ∠C = ${cv}°.` };
        }
        if (kind === "nisbet") {
          let m, n, l, k, B, D;
          do { m = rnd(1, 7); n = rnd(1, 8); l = rnd(1, 7); k = 180 / (m + l); B = n * k; D = 180 - B; } while (m === l || k % 1 || B >= 140 || D >= 140 || m * k < 45 || l * k < 45 || B < 45 || D < 45);
          const ask = pick(["D", "A"]);
          return { text: `Çevrəyə daxil çəkilmiş ABCD dördbucaqlısının A, B, C bucaqları ${m} : ${n} : ${l} nisbətindədir. ∠${ask}-ni tap.`,
            svg: figure(pts(quad("B", B)), base), answer: ask === "D" ? D : m * k, show: (ask === "D" ? D : m * k) + "°", ...deg,
            solution: `∠A + ∠C = 180° (qarşı bucaqlar), ${m} + ${l} = ${m + l} hissə 180°-dir, bir hissə = ${k}°. ∠A = ${m * k}°, ∠B = ${n * k}°, ∠C = ${l * k}°. ∠D = 180° − ∠B = ${D}°.` };
        }
        if (kind === "trap") {
          let x, al, be;
          do { x = pick(range(50, 130, 5)); be = rnd(15, 80); al = be + 2 * x - 180; } while (al < 15 || al > 80);
          const P = { O: [0, 0], A: on(90 + al), D: on(90 - al), B: on(270 - be), C: on(270 + be) };
          return { text: `Trapesiya çevrəyə daxil çəkilib (AD ∥ BC). ∠B = ${x}°. ∠D-ni tap.`,
            svg: figure(P, { ...base, arcs: [ang("B", x + "°"), ang("D", "?")] }), answer: 180 - x, show: (180 - x) + "°", ...deg,
            solution: `B və D qarşı bucaqlardır. Daxilə çəkilmiş dördbucaqlıda cəmləri 180°-dir: ∠D = 180° − ${x}° = ${180 - x}°.` };
        }
        const x = pick(range(20, 70, 5)), pairs = [["BAC", "BDC", "BC", 1], ["ABD", "ACD", "AD", 3], ["CAD", "CBD", "CD", 2], ["ADB", "ACB", "AB", 0]];
        let [g1, g2, an, ai] = pick(pairs); if (Math.random() < .5) [g1, g2] = [g2, g1];
        const rest = split3(360 - 2 * x), ar = [0, 0, 0, 0]; let ri = 0; for (let i = 0; i < 4; i++) ar[i] = i === ai ? 2 * x : rest[ri++];
        return { text: `ABCD dördbucaqlısı çevrəyə daxil çəkilib, ∠${g1} = ${x}°. ∠${g2}-ni tap.`,
          svg: figure(pts(ar), { ...base, segs: [["A", "C", "acc"], ["B", "D", "acc"]], arcs: [[g1[1], g1[0], g1[2], x + "°", 20], [g2[1], g2[0], g2[2], "?", 20]] }), answer: x, show: x + "°", ...deg,
          solution: `∠${g1} və ∠${g2} eyni ${an} qövsünə söykənən daxilə çəkilmiş bucaqlardır, təpələri qövsün eyni tərəfindədir. Onlar bərabərdir: ∠${g2} = ${x}°.` };
      } },

    { id: "ptol1", ad: "Ptolomey teoremi", izah: "Çevrəyə daxil çəkilmiş dördbucaqlıda diaqonalların hasili qarşı tərəflərin hasillərinin cəminə bərabərdir: AC · BD = AB · CD + BC · AD.",
      gen() {
        const q = cyc(), ask = pick(["BD", "BD", "DA", "CD", "AB", "BC"]), { c, ab, bc, cd, da, bd } = q;
        const all = { AB: ab, BC: bc, CD: cd, DA: da, AC: c, BD: bd }, lab = {};
        for (const k in all) lab[k] = k === ask ? "?" : String(all[k]);
        const given = Object.keys(all).filter(k => k !== ask).map(k => `${k} = ${all[k]}`).join(", ");
        const ptol = `AC · BD = AB · CD + BC · DA`;
        const sol = {
          BD: `${ptol}: ${c} · BD = ${ab} · ${cd} + ${bc} · ${da} = ${ab * cd} + ${bc * da} = ${ab * cd + bc * da}. BD = ${ab * cd + bc * da} : ${c} = ${bd}.`,
          DA: `${ptol}: ${c} · ${bd} = ${ab} · ${cd} + ${bc} · DA → ${c * bd} = ${ab * cd} + ${bc} · DA → DA = ${c * bd - ab * cd} : ${bc} = ${da}.`,
          CD: `${ptol}: ${c} · ${bd} = ${ab} · CD + ${bc} · ${da} → ${c * bd} = ${ab} · CD + ${bc * da} → CD = ${c * bd - bc * da} : ${ab} = ${cd}.`,
          AB: `${ptol}: ${c} · ${bd} = AB · ${cd} + ${bc} · ${da} → ${c * bd} = AB · ${cd} + ${bc * da} → AB = ${c * bd - bc * da} : ${cd} = ${ab}.`,
          BC: `${ptol}: ${c} · ${bd} = ${ab} · ${cd} + BC · ${da} → ${c * bd} = ${ab * cd} + BC · ${da} → BC = ${c * bd - ab * cd} : ${da} = ${bc}.`,
        }[ask];
        return { text: `ABCD dördbucaqlısı çevrəyə daxil çəkilib. ${given}. ${ask}-ni tap.`, svg: cycFig(q, lab), answer: all[ask], show: String(all[ask]), tol: 0.01, solution: sol };
      } },

    { id: "ptol2", ad: "Ptolomey: xüsusi hallar", izah: "Bərabərtərəfli üçbucağın çevrəsində PA = PB + PC. Daxilə çəkilmiş bərabəryanlı trapesiyada d² = a · b + c². Düzgün beşbucaqlıda d² = a² + a · d.",
      gen() {
        const kind = pick(["ucb", "ucb", "trap", "trap", "kvadrat", "pent"]);
        if (kind === "ucb") {
          const u = rnd(1, 15), v = rnd(1, 15), ask = pick(["PA", "PA", "PB"]);
          const phi = arcPhi(120, u / v), Rr = u / (2 * Math.sin(rad(phi / 2))), t0 = rnd(0, 359);
          const P = { O: [0, 0], A: on(t0 + 90, Rr), B: on(t0 + 210, Rr), C: on(t0 + 330, Rr), P: on(t0 + 210 + phi, Rr) };
          const lab = { PB: String(u), PC: String(v), PA: String(u + v) }; lab[ask === "PA" ? "PA" : "PB"] = "?";
          const base = { circ: [["O", Rr]], cen: "O", names: ["A", "B", "C", "P"], poly: ["A", "B", "C"], segs: [["P", "A", "acc"], ["P", "B", "acc"], ["P", "C", "acc"]], free: false, rot: [0, 1, 2, 3] };
          if (ask === "PA") return { text: `ABC — bərabərtərəfli üçbucaqdır, P nöqtəsi onun xaricinə çəkilmiş çevrənin BC qövsü (A-nı saxlamayan) üzərindədir. PB = ${u}, PC = ${v}. PA-nı tap.`,
            svg: figure(P, { ...base, lab: { PB: String(u), PC: String(v), PA: "?" } }), answer: u + v, show: String(u + v), tol: 0.01,
            solution: `ABPC dördbucaqlısı çevrəyə daxil çəkilib. Ptolomey: AP · BC = AB · PC + AC · PB. AB = AC = BC (bərabərtərəfli), ona görə AP = PC + PB = ${v} + ${u} = ${u + v}.` };
          return { text: `ABC — bərabərtərəfli üçbucaqdır, P nöqtəsi onun xaricinə çəkilmiş çevrənin BC qövsü (A-nı saxlamayan) üzərindədir. PA = ${u + v}, PC = ${v}. PB-ni tap.`,
            svg: figure(P, { ...base, lab: { PA: String(u + v), PC: String(v), PB: "?" } }), answer: u, show: String(u), tol: 0.01,
            solution: `Ptolomey ABPC dördbucaqlısına: AP · BC = AB · PC + AC · PB. Üçbucaq bərabərtərəflidir, ona görə PA = PB + PC. PB = ${u + v} − ${v} = ${u}.` };
        }
        if (kind === "trap") {
          const t = pick(TRAP), ask = pick(["d", "d", "c", "b"]);
          const P = { B: [0, 0], C: [t.b, 0], A: [(t.b - t.a) / 2, t.h], D: [(t.b + t.a) / 2, t.h] };
          const lab = { AD: String(t.a), BC: String(t.b), AB: String(t.c), CD: String(t.c), AC: String(t.d) };
          const hide = { d: "AC", c: "AB", b: "BC" }[ask]; lab[hide] = "?"; if (ask === "c") lab.CD = "?";
          const info = ask === "d" ? `AD = ${t.a}, BC = ${t.b}, AB = CD = ${t.c}. AC-ni tap.` : ask === "c" ? `AD = ${t.a}, BC = ${t.b}, AC = ${t.d}. AB = CD-ni tap.` : `AD = ${t.a}, AB = CD = ${t.c}, AC = ${t.d}. BC-ni tap.`;
          const sol = ask === "d" ? `Çevrəyə daxil çəkilmiş trapesiya bərabəryanlıdır, diaqonallar bərabərdir: AC = BD = d. Ptolomey: AC · BD = AD · BC + AB · CD → d² = ${t.a} · ${t.b} + ${t.c}² = ${t.a * t.b} + ${t.c * t.c} = ${t.d * t.d}, d = ${t.d}.`
            : ask === "c" ? `Diaqonallar bərabərdir (AC = BD = ${t.d}). Ptolomey: ${t.d}² = ${t.a} · ${t.b} + c² → c² = ${t.d * t.d} − ${t.a * t.b} = ${t.c * t.c}, c = ${t.c}.`
              : `Diaqonallar bərabərdir (AC = BD = ${t.d}). Ptolomey: ${t.d}² = ${t.a} · BC + ${t.c}² → ${t.a} · BC = ${t.d * t.d} − ${t.c * t.c} = ${t.d * t.d - t.c * t.c}, BC = ${t.b}.`;
          return { text: `ABCD — çevrəyə daxil çəkilmiş trapesiyadır (AD ∥ BC). ${info}`, svg: figure(P, { poly: ["A", "B", "C", "D"], names: ["A", "B", "C", "D"], free: true, segs: [["A", "C", "acc"], ["B", "D", "acc"]], lab }),
            answer: { d: t.d, c: t.c, b: t.b }[ask], show: String({ d: t.d, c: t.c, b: t.b }[ask]), tol: 0.01, solution: sol };
        }
        if (kind === "kvadrat") {
          const m = rnd(1, 12), n = rnd(1, 8), ask = pick(["PC", "PC", "PA"]);
          const phi = arcPhi(90, m / (n * Math.SQRT2)), Rr = m / (2 * Math.sin(rad(phi / 2))), t0 = rnd(0, 359);
          const P = { O: [0, 0], A: on(t0, Rr), B: on(t0 + 90, Rr), C: on(t0 + 180, Rr), D: on(t0 + 270, Rr), P: on(t0 + phi, Rr) };
          const base = { circ: [["O", Rr]], cen: "O", names: ["A", "B", "C", "D", "P"], poly: ["A", "B", "C", "D"], free: false, rot: [0, 1, 2, 3] };
          if (ask === "PC") return { text: `ABCD — kvadratdır, P nöqtəsi onun xaricinə çəkilmiş çevrənin AB qövsü (C və D-ni saxlamayan) üzərindədir. PA = ${m}, PB = ${n}√2. PC-ni tap.`,
            svg: figure(P, { ...base, segs: [["P", "A", "acc"], ["P", "B", "acc"], ["P", "C", "acc"]], lab: { PA: String(m) } }), answer: m + 2 * n, show: String(m + 2 * n), tol: 0.01,
            solution: `APBC dördbucaqlısı çevrəyə daxil çəkilib, diaqonalları AB və PC. Ptolomey: AB · PC = AP · BC + PB · AC. BC = AB = a, AC = a√2. Sadələşdir: PC = PA + √2 · PB = ${m} + √2 · ${n}√2 = ${m} + ${2 * n} = ${m + 2 * n}.` };
          return { text: `ABCD — kvadratdır, P nöqtəsi onun xaricinə çəkilmiş çevrənin AB qövsü (C və D-ni saxlamayan) üzərindədir. PC = ${m + 2 * n}, PB = ${n}√2. PA-nı tap.`,
            svg: figure(P, { ...base, segs: [["P", "A", "acc"], ["P", "B", "acc"], ["P", "C", "acc"]], lab: { PC: String(m + 2 * n) } }), answer: m, show: String(m), tol: 0.01,
            solution: `Ptolomey APBC dördbucaqlısına: AB · PC = AP · BC + PB · AC. BC = AB = a, AC = a√2, ona görə PC = PA + √2 · PB. ${m + 2 * n} = PA + √2 · ${n}√2 = PA + ${2 * n}, PA = ${m}.` };
        }
        const k = rnd(1, 12), a = 2 * k, d = k + k * Math.sqrt(5), ds = k === 1 ? "1+√5" : k + "+" + k + "√5";
        const pa = on(90, 1), Pn = range(0, 4).map(i => on(90 + 72 * i, 1)), Pt = { A: Pn[0], B: Pn[1], C: Pn[2], D: Pn[3], E: Pn[4] };
        return { text: `ABCDE — düzgün beşbucaqlıdır, tərəfi ${a}. Onun diaqonalını tap.`,
          svg: figure({ ...Pt, O: [0, 0] }, { circ: [["O", 1]], cen: "O", names: ["A", "B", "C", "D", "E"], poly: ["A", "B", "C", "D", "E"], polyFill: false, segs: [["A", "C", "acc"], ["B", "D", "acc"], ["A", "D", "acc"]], free: true }), answer: d, show: ds, placeholder: "məs. 1+√5",
          solution: `Düzgün beşbucaqlı çevrəyə daxil çəkilib, bütün diaqonallar bərabərdir (d). ABCD dördbucaqlısına Ptolomey: AC · BD = AB · CD + BC · AD → d² = ${a}² + ${a} · d → d² − ${a}d − ${a * a} = 0. Müsbət kök: d = (${a} + √(${a * a} + ${4 * a * a})) : 2 = (${a} + ${a}√5) : 2 = ${ds}.` };
      } },

    { id: "nisbet", ad: "Diaqonalların nisbəti", izah: "Daxilə çəkilmiş dördbucaqlıda AC / BD = (AB · AD + CB · CD) / (AB · BC + AD · DC). Ptolomey ilə birlikdə hər iki diaqonal tapılır.",
      gen() {
        const q = cyc(), { c, ab, bc, cd, da, bd } = q, ask = pick(["ratio", "ratio", "prod", "prod"]);
        if (ask === "ratio") {
          const n = ab * da + bc * cd, m = ab * bc + da * cd, g = gcd(n, m);
          return { text: `ABCD dördbucaqlısı çevrəyə daxil çəkilib: AB = ${ab}, BC = ${bc}, CD = ${cd}, DA = ${da}. AC / BD nisbətini tap (sadə kəsr kimi).`,
            svg: cycFig(q, { AB: String(ab), BC: String(bc), CD: String(cd), DA: String(da) }), answer: n / m, show: frac(n, m),
            solution: `AC / BD = (AB · AD + CB · CD) / (AB · BC + AD · DC) = (${ab} · ${da} + ${bc} · ${cd}) / (${ab} · ${bc} + ${da} · ${cd}) = ${n} / ${m}${g > 1 ? " = " + frac(n, m) : ""}.` };
        }
        return { text: `ABCD dördbucaqlısı çevrəyə daxil çəkilib: AB = ${ab}, BC = ${bc}, CD = ${cd}, DA = ${da}. Diaqonalların hasilini (AC · BD) tap.`,
          svg: cycFig(q, { AB: String(ab), BC: String(bc), CD: String(cd), DA: String(da) }), answer: ab * cd + bc * da, show: String(ab * cd + bc * da), tol: 0.01,
          solution: `Ptolomey: AC · BD = AB · CD + BC · DA = ${ab} · ${cd} + ${bc} · ${da} = ${ab * cd} + ${bc * da} = ${ab * cd + bc * da}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Mətnli məsələ: dairəvi meydança, quyu, ağaclar. Sxem çək: hansı dördbucaqlı çevrəyə daxildir?",
      gen() {
        const t = pick(["ucb", "dort", "dort", "trap", "bucaq"]);
        if (t === "ucb") {
          const u = rnd(3, 14), v = rnd(3, 14);
          return { text: `Dairəvi parkın kənarında bərabərtərəfli üçbucaq təşkil edən A, B, C ağacları var. Parkın sərhədində B və C ağacları arasında (A-nı saxlamayan qövsdə) quyu P var. Quyudan B ağacına ${u} m, C ağacına ${v} m-dir. Quyudan A ağacına neçə metrdir?`,
            answer: u + v, show: (u + v) + " m", unit: "m", tol: 0.01,
            solution: `ABPC dördbucaqlısı çevrəyə daxildir. Ptolomey: PA · BC = AB · PC + AC · PB. AB = AC = BC olduğundan PA = PB + PC = ${u} + ${v} = ${u + v} m.` };
        }
        if (t === "dort") {
          const q = cyc();
          return { text: `Dairəvi gölün sahilində ardıcıl dörd A, B, C, D nöqtəsi var. AB = ${q.ab} m, BC = ${q.bc} m, CD = ${q.cd} m, DA = ${q.da} m, A ilə C arasındakı məsafə ${q.c} m-dir. B ilə D arasındakı məsafə neçə metrdir?`,
            answer: q.bd, show: q.bd + " m", unit: "m", tol: 0.01,
            solution: `Dörd nöqtə çevrə üzərindədir, ABCD daxilə çəkilmiş dördbucaqlıdır. Ptolomey: AC · BD = AB · CD + BC · DA → ${q.c} · BD = ${q.ab} · ${q.cd} + ${q.bc} · ${q.da} = ${q.ab * q.cd + q.bc * q.da}. BD = ${q.bd} m.` };
        }
        if (t === "trap") {
          const tr = pick(TRAP);
          return { text: `Trapesiya şəklində bağın paralel tərəfləri ${tr.a} m və ${tr.b} m, yan tərəfləri bərabərdir və hər biri ${tr.c} m-dir. Bağın bütün küncləri bir dairəvi hasarın üzərindədir. Bağın diaqonalının uzunluğu neçə metrdir?`,
            answer: tr.d, show: tr.d + " m", unit: "m", tol: 0.01,
            solution: `Küncləri çevrə üzərində olan trapesiya daxilə çəkilmiş dördbucaqlıdır, diaqonalları bərabərdir. Ptolomey: d² = ${tr.a} · ${tr.b} + ${tr.c}² = ${tr.a * tr.b} + ${tr.c * tr.c} = ${tr.d * tr.d}, d = ${tr.d} m.` };
        }
        const x = pick(range(50, 130, 2));
        return { text: `Dairəvi meydançanın kənarında A, B, C, D nöqtələri ardıcıl yerləşir. Elvin A nöqtəsindən B və D nöqtələrinə baxanda bucaq ${x}°-dir. C nöqtəsindən B və D nöqtələrinə baxanda bucaq neçə dərəcədir?`,
          answer: 180 - x, show: (180 - x) + "°", ...deg,
          solution: `ABCD çevrəyə daxil çəkilmiş dördbucaqlıdır, ∠A və ∠C qarşı bucaqlardır: 180° − ${x}° = ${180 - x}°.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const t = pick(["ptol", "bucaq", "ucb", "trap"]), bad = rnd(0, 2);
        let task, st, wrong, why;
        if (t === "ptol") {
          const q = cyc(), { c, ab, bc, cd, da, bd } = q, s = ab * cd + bc * da;
          task = `Məsələ: ABCD çevrəyə daxil çəkilib, AB = ${ab}, BC = ${bc}, CD = ${cd}, DA = ${da}, AC = ${c}. BD-ni tap.`;
          st = [`Ptolomey: AC · BD = AB · CD + BC · DA (qarşı tərəflərin hasilləri).`, `${c} · BD = ${ab} · ${cd} + ${bc} · ${da} = ${ab * cd} + ${bc * da} = ${s}.`, `BD = ${s} : ${c} = ${bd}.`];
          wrong = [`Ptolomey: AC · BD = AB · BC + CD · DA (qonşu tərəflərin hasilləri).`, `${c} · BD = ${ab} · ${cd} + ${bc} · ${da} = ${ab * cd} + ${bc * da} = ${s + 10}.`, `BD = ${s} · ${c} = ${s * c}.`];
          why = [`1-ci addımda səhv var: Ptolomey teoremində qarşı tərəflərin hasilləri götürülür: AB · CD və BC · DA.`, `2-ci addımda səhv var: ${ab * cd} + ${bc * da} = ${s}.`, `3-cü addımda səhv var: BD-ni tapmaq üçün ${c}-ə bölmək lazımdır: ${s} : ${c} = ${bd}.`];
        } else if (t === "bucaq") {
          let a, c, x, b, d;
          do { a = rnd(1, 4); c = rnd(1, 4); x = rnd(10, 30); b = rnd(0, 30); d = 180 - b - (a + c) * x; } while (d < 0 || d > 40 || a + c === 2);
          const sh = (k, n) => (k === 1 ? "x" : k + "x") + (n ? " + " + n : "");
          task = `Məsələ: ABCD çevrəyə daxil çəkilib, ∠A = (${sh(a, b)})°, ∠C = (${sh(c, d)})°. x-i tap.`;
          st = [`Daxilə çəkilmiş dördbucaqlıda qarşı bucaqların cəmi 180°-dir.`, `${sh(a, b)} + ${sh(c, d)} = 180, yəni ${a + c}x + ${b + d} = 180.`, `${a + c}x = ${180 - b - d}, x = ${x}.`];
          wrong = [`Daxilə çəkilmiş dördbucaqlıda qarşı bucaqlar bərabərdir.`, `${sh(a, b)} + ${sh(c, d)} = 180, yəni ${a + c}x + ${b + d} = 180 + 10.`, `${a + c}x = ${180 - b - d}, x = ${(180 - b - d)} − ${a + c} = ${180 - b - d - a - c}.`];
          why = [`1-ci addımda səhv var: qarşı bucaqların cəmi 180°-dir, onlar bərabər deyil (bərabərdirlər yalnız 90°-də).`, `2-ci addımda səhv var: tənlik ${a + c}x + ${b + d} = 180.`, `3-cü addımda səhv var: ${a + c}x = ${180 - b - d} → x = ${180 - b - d} : ${a + c} = ${x}, çıxmaq yox, bölmək lazımdır.`];
        } else if (t === "ucb") {
          const u = rnd(2, 14), v = rnd(2, 14);
          task = `Məsələ: ABC bərabərtərəfli üçbucaqdır, P nöqtəsi çevrənin BC qövsü (A-nı saxlamayan) üzərindədir, PB = ${u}, PC = ${v}. PA-nı tap.`;
          st = [`ABPC dördbucaqlısı çevrəyə daxildir, diaqonalları AP və BC.`, `Ptolomey: AP · BC = AB · PC + AC · PB. AB = AC = BC = a olduğundan a · AP = a · PC + a · PB.`, `AP = PB + PC = ${u + v}.`];
          wrong = [`ABPC dördbucaqlısı çevrəyə daxildir, diaqonalları AB və PC.`, `Ptolomey: AP · BC = AB · PC · AC · PB. AB = AC = BC = a olduğundan a · AP = a² · PC · PB.`, `AP = PB · PC = ${u * v}.`];
          why = [`1-ci addımda səhv var: ABPC-də (təpələr ardıcıl: A, B, P, C) diaqonallar AP və BC-dir.`, `2-ci addımda səhv var: Ptolomey teoremində iki hasilin cəmi var: AB · PC + AC · PB.`, `3-cü addımda səhv var: a-ya ixtisar etdikdən sonra AP = PB + PC = ${u} + ${v} = ${u + v}.`];
        } else {
          const tr = pick(TRAP);
          task = `Məsələ: çevrəyə daxil çəkilmiş trapesiyanın əsasları ${tr.a} və ${tr.b}, yan tərəfləri ${tr.c}-dir. Diaqonalı tap.`;
          st = [`Daxilə çəkilmiş trapesiya bərabəryanlıdır, diaqonalları bərabərdir: AC = BD = d.`, `Ptolomey: d · d = ${tr.a} · ${tr.b} + ${tr.c} · ${tr.c} = ${tr.a * tr.b} + ${tr.c * tr.c} = ${tr.d * tr.d}.`, `d = √${tr.d * tr.d} = ${tr.d}.`];
          wrong = [`Daxilə çəkilmiş trapesiya bərabəryanlıdır, diaqonalları isə yan tərəfə bərabərdir: AC = BD = ${tr.c}.`, `Ptolomey: d · d = ${tr.a} · ${tr.b} + ${tr.c} · ${tr.c} = ${tr.a * tr.b} + ${tr.c * tr.c} + 5 = ${tr.d * tr.d + 5}.`, `d = ${tr.d * tr.d} : 2 = ${fmt(tr.d * tr.d / 2)}.`];
          why = [`1-ci addımda səhv var: bərabəryanlı trapesiyada diaqonallar bərabərdir, amma yan tərəfə bərabər deyil; onların ortaq uzunluğunu d ilə işarə et.`, `2-ci addımda səhv var: ${tr.a * tr.b} + ${tr.c * tr.c} = ${tr.d * tr.d}.`, `3-cü addımda səhv var: d = √${tr.d * tr.d} = ${tr.d}; kvadrat kökü 2-yə bölmək olmaz.`];
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
      key: "ol-ptolomey", title: "Çevrəyə daxil çəkilmiş dördbucaqlı, Ptolomey teoremi", fenn: "olimpiada", link: "dersler/ol-ptolomey.html",
      format: "Cavab ədəddir: bucaq (dərəcə ilə, ° yazmaq lazım deyil) və ya uzunluq. Kök: 1+√5, kəsr: 125/117.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["bucaq", "bucaq", "ptol1", "ptol1", "ptol2", "ptol2", "nisbet", "nisbet", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-ptolomey.html")) b.push("dersler/ol-ptolomey.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
