// Çevrədə bucaqlar (olimpiada səviyyəsi) (olimpiada) — mastery game levels and the final test.
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
  const dg = n => n + "°";
  // line intersection of p1p2 and p3p4
  const ix = (p1, p2, p3, p4) => {
    const a = p2[0] - p1[0], b = p2[1] - p1[1], c = p4[0] - p3[0], e = p4[1] - p3[1], det = a * e - b * c;
    const t = ((p3[0] - p1[0]) * e - (p3[1] - p1[1]) * c) / det;
    return [p1[0] + t * a, p1[1] + t * b];
  };
  // four arcs (multiples of 10) with sum 360, each in [lo, hi]
  function arcs4(lo = 40, hi = 140) {
    for (;;) { const p = 10 * rnd(lo / 10, hi / 10), q = 10 * rnd(lo / 10, hi / 10), r = 10 * rnd(lo / 10, hi / 10), s = 360 - p - q - r; if (s >= lo && s <= hi) return [p, q, r, s]; }
  }
  // triangle from angles A, B, C (degrees), circumradius 1/2: B = (0,0), C = (a,0)
  function triA(A, B, C) {
    const a = Math.sin(rad(A)), b = Math.sin(rad(B)), c = Math.sin(rad(C)), Bp = [0, 0], Cp = [a, 0], Ap = [c * Math.cos(rad(B)), c * Math.sin(rad(B))];
    const d = 2 * (Ap[0] * (Bp[1] - Cp[1]) + Bp[0] * (Cp[1] - Ap[1]) + Cp[0] * (Ap[1] - Bp[1])), f = P => P[0] * P[0] + P[1] * P[1];
    const O = [(f(Ap) * (Bp[1] - Cp[1]) + f(Bp) * (Cp[1] - Ap[1]) + f(Cp) * (Ap[1] - Bp[1])) / d, (f(Ap) * (Cp[0] - Bp[0]) + f(Bp) * (Ap[0] - Cp[0]) + f(Cp) * (Bp[0] - Ap[0])) / d];
    const per = a + b + c, I = [(a * Ap[0] + b * Bp[0] + c * Cp[0]) / per, (a * Ap[1] + b * Bp[1] + c * Cp[1]) / per];
    const w = -a + b + c, J = [(-a * Ap[0] + b * Bp[0] + c * Cp[0]) / w, (-a * Ap[1] + b * Bp[1] + c * Cp[1]) / w];
    const H = [Ap[0] + Bp[0] + Cp[0] - 2 * O[0], Ap[1] + Bp[1] + Cp[1] - 2 * O[1]];
    const foot = (P, U, V) => { const dx = V[0] - U[0], dy = V[1] - U[1], t = ((P[0] - U[0]) * dx + (P[1] - U[1]) * dy) / (dx * dx + dy * dy); return [U[0] + t * dx, U[1] + t * dy]; };
    return { A: Ap, B: Bp, C: Cp, O, I, J, H, R: Math.hypot(Ap[0] - O[0], Ap[1] - O[1]), foot };
  }
  // three angles, all acute, A even
  function angles3(evenA = true) {
    for (;;) { let A = rnd(20, 40) * 2; if (!evenA) A = rnd(40, 80); const B = rnd(40, 80), C = 180 - A - B; if (C >= 40 && C <= 80 && A >= 40 && A <= 80) return [A, B, C]; }
  }

  const levels = [
    { id: "ichde", ad: "İki vətər arasındakı bucaq", izah: "Daxilə çəkilmiş bucaq söykəndiyi qövsün yarısıdır. İki vətər çevrə daxilində kəsişəndə bucaq = (üzərinə və şaquli bucağın üzərinə söykəndiyi qövslərin cəmi)/2.",
      gen() {
        const kind = pick(["ab", "ab", "cd", "bc", "perp", "tri"]);
        let [p, q, r, s] = arcs4(), x = 0;
        if (kind === "perp") { p = 10 * rnd(4, 14); r = 180 - p; q = 10 * rnd(4, 14); s = 180 - q; }
        const a0 = rnd(0, 359), A = on(a0), B = on(a0 + p), C = on(a0 + p + q), D = on(a0 + p + q + r), E = ix(A, C, B, D), P = { O: [0, 0], A, B, C, D, E };
        const base = { circ: C1, names: ["A", "B", "C", "D", "E"], cen: "O", free: true, poly: ["A", "B", "C", "D"], polyFill: false, segs: [["A", "C", "acc"], ["B", "D", "acc"]] };
        const T = "A, B, C, D nöqtələri çevrə üzərindədir (bu ardıcıllıqla). AC və BD vətərləri E nöqtəsində kəsişir. ";
        const why = `∠AEB iki vətər arasındakı bucaqdır: o, AB qövsünə və şaquli ∠CED-in söykəndiyi CD qövsünə əsaslanır, ∠AEB = (AB qövsü + CD qövsü)/2.`;
        if (kind === "ab") return { text: T + `AB qövsü ${p}°, CD qövsü ${r}°. ∠AEB-ni tap.`, svg: figure(P, { ...base, arcs: [["E", "A", "B", "?", 14]] }), answer: (p + r) / 2, show: dg((p + r) / 2), ...deg,
          solution: `${why} ∠AEB = (${p}° + ${r}°)/2 = ${(p + r) / 2}°.` };
        if (kind === "cd") return { text: T + `∠AEB = ${(p + r) / 2}°, AB qövsü ${p}°. CD qövsünü tap.`, svg: figure(P, { ...base, arcs: [["E", "A", "B", dg((p + r) / 2), 14]] }), answer: r, show: dg(r), ...deg,
          solution: `${why} ${(p + r) / 2}° = (${p}° + CD)/2 → CD = ${p + r}° − ${p}° = ${r}°.` };
        if (kind === "bc") return { text: T + `BC qövsü ${q}°, DA qövsü ${s}°. ∠BEC-ni tap.`, svg: figure(P, { ...base, arcs: [["E", "B", "C", "?", 14]] }), answer: (q + s) / 2, show: dg((q + s) / 2), ...deg,
          solution: `∠BEC BC qövsünə və şaquli ∠DEA-nın söykəndiyi DA qövsünə əsaslanır: ∠BEC = (${q}° + ${s}°)/2 = ${(q + s) / 2}°.` };
        if (kind === "perp") return { text: T + `AC ⟂ BD. AB qövsü ${p}°. CD qövsünü tap.`, svg: figure(P, { ...base, right: [["E", "A", "B"]] }), answer: r, show: dg(r), ...deg,
          solution: `∠AEB = 90° = (AB + CD)/2 → AB + CD = 180°. CD = 180° − ${p}° = ${r}°.` };
        return { text: T + `∠ACB = ${p / 2}°, ∠CBD = ${r / 2}°. ∠AEB-ni tap.`, svg: figure(P, { ...base, arcs: [["C", "A", "B", dg(p / 2), 22], ["B", "D", "C", dg(r / 2), 22], ["E", "A", "B", "?", 12]] }), answer: (p + r) / 2, show: dg((p + r) / 2), ...deg,
          solution: `∠AEB — EBC üçbucağının xarici bucağıdır: ∠AEB = ∠ECB + ∠EBC = ∠ACB + ∠CBD = ${p / 2}° + ${r / 2}° = ${(p + r) / 2}°.` };
      } },

    { id: "xaricde", ad: "Kəsən, toxunan: çevrədən kənar bucaq", izah: "Çevrədən kənar nöqtədəki bucaq = (uzaq qövs − yaxın qövs)/2. İki toxunan arasındakı bucaq 180° − kiçik qövs. Toxunan–vətər bucağı qövsün yarısıdır.",
      gen() {
        const kind = pick(["sec", "sec", "tsec", "tsec", "tt", "tt", "tchord"]);
        const a0 = rnd(0, 359);
        if (kind === "sec" || kind === "tsec") {
          const n = 10 * rnd(3, 12), f = n + 10 * rnd(3, 15), rest = 360 - n - f;
          if (rest < 40) return this.gen();
          const s1 = 10 * rnd(2, Math.floor((rest - 20) / 10)), s2 = rest - s1, ask = pick(["ang", "ang", "far", "near"]), ang = (f - n) / 2;
          if (kind === "sec") {
            const A = on(a0), Cc = on(a0 + n), D = on(a0 + n + s1), B = on(a0 + n + s1 + f), Pp = ix(A, B, Cc, D), P = { O: [0, 0], A, B, C: Cc, D, P: Pp };
            const base = { circ: C1, names: ["A", "B", "C", "D", "P"], cen: "O", free: true, segs: [["P", "B", "acc"], ["P", "D", "acc"]] };
            const T = "P nöqtəsindən çevrəyə iki kəsən çəkilib: biri çevrəni A və B (A, P-yə yaxındır), digəri C və D (C yaxındır) nöqtələrində kəsir. ";
            const why = `P çevrədən kənardadır: ∠P = (uzaq BD qövsü − yaxın AC qövsü)/2.`;
            if (ask === "ang") return { text: T + `AC qövsü ${n}°, BD qövsü ${f}°. ∠APC-ni tap.`, svg: figure(P, { ...base, arcs: [["P", "A", "C", "?", 20]] }), answer: ang, show: dg(ang), ...deg, solution: `${why} ∠P = (${f}° − ${n}°)/2 = ${ang}°.` };
            if (ask === "far") return { text: T + `AC qövsü ${n}°, ∠APC = ${ang}°. BD qövsünü tap.`, svg: figure(P, { ...base, arcs: [["P", "A", "C", dg(ang), 20]] }), answer: f, show: dg(f), ...deg, solution: `${why} ${ang}° = (BD − ${n}°)/2 → BD = 2 · ${ang}° + ${n}° = ${f}°.` };
            return { text: T + `BD qövsü ${f}°, ∠APC = ${ang}°. AC qövsünü tap.`, svg: figure(P, { ...base, arcs: [["P", "A", "C", dg(ang), 20]] }), answer: n, show: dg(n), ...deg, solution: `${why} ${ang}° = (${f}° − AC)/2 → AC = ${f}° − 2 · ${ang}° = ${n}°.` };
          }
          const T0 = on(a0), A = on(a0 + n), B = on(a0 + n + rest), tdir = [-Math.sin(rad(a0)), Math.cos(rad(a0))];
          const Pp = ix(T0, [T0[0] + tdir[0], T0[1] + tdir[1]], A, B), P = { O: [0, 0], T: T0, A, B, P: Pp };
          const base = { circ: C1, names: ["T", "A", "B", "P"], cen: "O", free: true, segs: [["P", "T", "acc"], ["P", "B", "acc"], ["O", "T", "dash"]], right: [["T", "O", "P"]] };
          const T = "P nöqtəsindən çevrəyə PT toxunanı (T — toxunma nöqtəsi) və PAB kəsəni çəkilib (A, P-yə yaxın kəsişmə nöqtəsidir). ";
          const why = `Toxunan kəsənin xüsusi halıdır: ∠P = (uzaq TB qövsü − yaxın TA qövsü)/2.`;
          if (ask === "far") return { text: T + `TA qövsü ${n}°, ∠TPA = ${ang}°. TB qövsünü tap (T-ni A-dan ayıran qövsü saxlamayan qövs).`, svg: figure(P, { ...base, arcs: [["P", "T", "A", dg(ang), 20]] }), answer: f, show: dg(f), ...deg, solution: `${why} ${ang}° = (TB − ${n}°)/2 → TB = ${f}°.` };
          return { text: T + `TA qövsü ${n}°, TB qövsü ${f}°. ∠TPA-nı tap.`, svg: figure(P, { ...base, arcs: [["P", "T", "A", "?", 20]] }), answer: ang, show: dg(ang), ...deg, solution: `${why} ∠P = (${f}° − ${n}°)/2 = ${ang}°.` };
        }
        if (kind === "tt") {
          const m = 10 * rnd(3, 16), ask = pick(["ang", "arc", "cen"]), A = on(a0), B = on(a0 + m), Pp = on(a0 + m / 2, 1 / Math.cos(rad(m / 2))), P = { O: [0, 0], A, B, P: Pp };
          const base = { circ: C1, names: ["A", "B", "P"], cen: "O", free: true, segs: [["P", "A", "acc"], ["P", "B", "acc"], ["O", "A", "dash"], ["O", "B", "dash"]], right: [["A", "O", "P"], ["B", "O", "P"]] };
          const T = "P nöqtəsindən çevrəyə PA və PB toxunanları çəkilib (A, B — toxunma nöqtələri). ";
          const why = `OA ⟂ PA, OB ⟂ PB. OAPB dördbucaqlısında ∠AOB + ∠APB = 360° − 90° − 90° = 180°.`;
          if (ask === "ang") return { text: T + `Kiçik AB qövsü ${m}°. ∠APB-ni tap.`, svg: figure(P, { ...base, arcs: [["P", "A", "B", "?", 20]] }), answer: 180 - m, show: dg(180 - m), ...deg, solution: `${why} Mərkəzi bucaq kiçik qövsə bərabərdir: ∠AOB = ${m}°. ∠APB = 180° − ${m}° = ${180 - m}°.` };
          if (ask === "arc") return { text: T + `∠APB = ${180 - m}°. Kiçik AB qövsünü tap.`, svg: figure(P, { ...base, arcs: [["P", "A", "B", dg(180 - m), 20]] }), answer: m, show: dg(m), ...deg, solution: `${why} ∠AOB = 180° − ${180 - m}° = ${m}°, bu da kiçik AB qövsüdür.` };
          return { text: T + `∠APB = ${180 - m}°. ∠AOB mərkəzi bucağını tap.`, svg: figure(P, { ...base, arcs: [["P", "A", "B", dg(180 - m), 20], ["O", "A", "B", "?", 14]] }), answer: m, show: dg(m), ...deg, solution: `${why} ∠AOB = 180° − ${180 - m}° = ${m}°.` };
        }
        // tangent–chord
        const m = 10 * rnd(3, 16), ask = pick(["ang", "arc", "cen"]), A = on(a0), B = on(a0 + m), td = [-Math.sin(rad(a0)), Math.cos(rad(a0))], Pp = [A[0] + 1.1 * td[0], A[1] + 1.1 * td[1]], P = { O: [0, 0], A, B, P: Pp };
        const base = { circ: C1, names: ["A", "B", "P"], cen: "O", free: true, segs: [["A", "P", "acc"], ["A", "B"], ["O", "A", "dash"]], right: [["A", "O", "P"]] };
        const T = "AP — çevrəyə A nöqtəsində toxunandır, AB — vətərdir. ";
        const why = `Toxunan–vətər bucağı onun daxilindəki qövsün yarısıdır: ∠PAB = AB qövsü/2.`;
        if (ask === "ang") return { text: T + `AB qövsü (∠PAB-nin daxilindəki) ${m}°. ∠PAB-ı tap.`, svg: figure(P, { ...base, arcs: [["A", "P", "B", "?", 20]] }), answer: m / 2, show: dg(m / 2), ...deg, solution: `${why} ∠PAB = ${m}°/2 = ${m / 2}°.` };
        if (ask === "arc") return { text: T + `∠PAB = ${m / 2}°. ∠PAB-ın daxilindəki AB qövsünü tap.`, svg: figure(P, { ...base, arcs: [["A", "P", "B", dg(m / 2), 20]] }), answer: m, show: dg(m), ...deg, solution: `${why} AB qövsü = 2 · ${m / 2}° = ${m}°.` };
        return { text: T + `∠PAB = ${m / 2}°. O — çevrənin mərkəzidir. ∠AOB-ni tap.`, svg: figure(P, { ...base, segs: [...base.segs, ["O", "B", "dash"]], arcs: [["A", "P", "B", dg(m / 2), 20], ["O", "A", "B", "?", 14]] }), answer: m, show: dg(m), ...deg,
          solution: `${why} AB qövsü = 2 · ${m / 2}° = ${m}°, mərkəzi bucaq qövsə bərabərdir: ∠AOB = ${m}°.` };
      } },

    { id: "dord", ad: "Çevrəyə daxil olan dördbucaqlı", izah: "Qarşı bucaqların cəmi 180°-dir; xarici bucaq daxili qarşı bucağa bərabərdir; eyni qövsə söykənən bucaqlar bərabərdir. Tərsi də doğrudur: bu şərtlərdən biri ödənirsə, 4 nöqtə bir çevrədədir.",
      gen() {
        const kind = pick(["opp", "opp", "ext", "trap", "crit", "mix", "same"]);
        let [p, q, r, s] = arcs4(40, 130);
        if (kind === "trap") { p = r = 10 * rnd(4, 11); q = 10 * rnd(5, 14); s = 360 - 2 * p - q; if (s < 40) return this.gen(); }
        const a0 = rnd(0, 359), A = on(a0), B = on(a0 + p), C = on(a0 + p + q), D = on(a0 + p + q + r), P = { O: [0, 0], A, B, C, D };
        const base = { circ: C1, names: ["A", "B", "C", "D"], cen: "O", free: true, poly: ["A", "B", "C", "D"], polyFill: false };
        const T = "ABCD dördbucaqlısı çevrəyə daxil edilib. ";
        const angBC = (r + s) / 2, angADC = (p + q) / 2, angBAD = (q + r) / 2, angBCD = (p + s) / 2;
        if (kind === "opp") { const ask = pick(["ADC", "BCD"]);
          return ask === "ADC"
            ? { text: T + `∠ABC = ${angBC}°. ∠ADC-ni tap.`, svg: figure(P, { ...base, arcs: [["B", "A", "C", dg(angBC), 22], ["D", "A", "C", "?", 22]] }), answer: angADC, show: dg(angADC), ...deg, solution: `Çevrəyə daxil olan dördbucaqlıda qarşı bucaqların cəmi 180°-dir: ∠ADC = 180° − ${angBC}° = ${angADC}°.` }
            : { text: T + `∠BAD = ${angBAD}°. ∠BCD-ni tap.`, svg: figure(P, { ...base, arcs: [["A", "B", "D", dg(angBAD), 22], ["C", "B", "D", "?", 22]] }), answer: angBCD, show: dg(angBCD), ...deg, solution: `Qarşı bucaqların cəmi 180°-dir (${(q + r) / 2}° + ∠BCD = 180°): ∠BCD = 180° − ${angBAD}° = ${angBCD}°.` }; }
        if (kind === "ext") { const ask = Math.random() < .5;
          const M = [A[0] + (A[0] - B[0]) * .45, A[1] + (A[1] - B[1]) * .45];
          return { text: T + (ask ? `BA şüası A-dan o yana M nöqtəsinə qədər uzadılıb. ∠BCD = ${angBCD}°. ∠DAM xarici bucağını tap.` : `BA şüası A-dan o yana M nöqtəsinə qədər uzadılıb. ∠DAM = ${angBCD}°. ∠BCD-ni tap.`),
            svg: figure({ ...P, M }, { ...base, names: ["A", "B", "C", "D", "M"], segs: [["A", "M", "dash"]], arcs: [["A", "D", "M", ask ? "?" : dg(angBCD), 20], ["C", "B", "D", ask ? dg(angBCD) : "?", 22]] }),
            answer: angBCD, show: dg(angBCD), ...deg, solution: `Xarici bucaq ∠DAM = 180° − ∠BAD, çevrəyə daxil olan dördbucaqlıda ∠BCD = 180° − ∠BAD. Deməli xarici bucaq daxili qarşı bucağa bərabərdir: ${angBCD}°.` }; }
        if (kind === "trap") { const x = angBC;                       // BC ∥ AD isosceles trapezoid: ∠ABC = ∠BCD, ∠BAD = ∠ADC = 180 − ∠ABC
          const ask = pick(["BCD", "BAD", "ADC"]), ans = ask === "BCD" ? x : 180 - x;
          return { text: `ABCD trapesiyası çevrəyə daxil edilib, BC ∥ AD. ∠ABC = ${x}°. ∠${ask}-ni tap.`, svg: figure(P, { ...base, arcs: [["B", "A", "C", dg(x), 22]] }), answer: ans, show: dg(ans), ...deg,
            solution: ask === "BCD" ? `BC ∥ AD → ∠ABC + ∠BAD = 180°, daxil olan dördbucaqlıda ∠BAD + ∠BCD = 180°. Deməli ∠BCD = ∠ABC = ${x}° (daxil olan trapesiya bərabəryanlıdır).` : `BC ∥ AD → ∠BAD = 180° − ∠ABC = ${180 - x}° (birtərəfli bucaqlar). ${ask === "ADC" ? "Daxil olan trapesiya bərabəryanlıdır: ∠ADC = ∠BAD = " + (180 - x) + "°." : ""}` }; }
        if (kind === "crit") {
          if (Math.random() < .5) { const a = angBAD, b = angBC, d = angADC;
            return { text: `ABCD dördbucaqlısında ∠A = ${a}°, ∠B = ${b}°, ∠D = ${d}°. ∠C neçə dərəcə olanda ABCD çevrəyə daxil olar?`, answer: 180 - a, show: dg(180 - a), ...deg,
              solution: `Dördbucaqlı çevrəyə daxil olmaq üçün qarşı bucaqların cəmi 180° olmalıdır: ∠C = 180° − ∠A = ${180 - a}°. (Yoxlama: ∠B + ∠D = ${b + d}° = 180° ✓.)` }; }
          const x = angBAD, sz = pick(["ACD", "BDC"]);
          return { text: `ABCD dördbucaqlısında diaqonallar çəkilib. ∠ABD = ${s / 2}°. ∠ACD neçə dərəcə olanda A, B, C, D nöqtələri bir çevrə üzərində yerləşər?`, answer: s / 2, show: dg(s / 2), ...deg,
            solution: `B və C nöqtələri AD parçasına eyni tərəfdədir. Onlar AD-ni eyni bucaq altında görəndə (∠ABD = ∠ACD) dörd nöqtə bir çevrədədir. ∠ACD = ${s / 2}°.` }; }
        if (kind === "mix") { const x = s / 2, y = q / 2;
          return { text: T + `Diaqonallar E nöqtəsində kəsişir. ∠ABD = ${x}°, ∠BDC = ${y}°. ∠AEB-ni tap.`, svg: figure({ ...P, E: ix(A, C, B, D) }, { ...base, names: ["A", "B", "C", "D", "E"], segs: [["A", "C", "acc"], ["B", "D", "acc"]], arcs: [["B", "A", "D", dg(x), 22], ["D", "B", "C", dg(y), 22], ["E", "A", "B", "?", 12]] }),
            answer: 180 - x - y, show: dg(180 - x - y), ...deg,
            solution: `∠BAC = ∠BDC = ${y}° (eyni BC qövsünə söykənir). ABE üçbucağında: ∠AEB = 180° − ∠ABE − ∠BAE = 180° − ${x}° − ${y}° = ${180 - x - y}°.` }; }
        // same arc
        const w = pick([["ABD", "ACD", s / 2, "AD"], ["BAC", "BDC", q / 2, "BC"], ["CAD", "CBD", r / 2, "CD"], ["ACB", "ADB", p / 2, "AB"]]);
        return { text: T + `∠${w[0]} = ${w[2]}°. ∠${w[1]}-nı tap.`, svg: figure(P, { ...base, segs: [["A", "C", "acc"], ["B", "D", "acc"]], arcs: [[w[0][1], w[0][0], w[0][2], dg(w[2]), 22], [w[1][1], w[1][0], w[1][2], "?", 22]] }), answer: w[2], show: dg(w[2]), ...deg,
          solution: `∠${w[0]} və ∠${w[1]} eyni ${w[3]} qövsünə söykənir və təpələri qövsün eyni tərəfindədir. Belə bucaqlar bərabərdir: ${w[2]}°.` };
      } },

    { id: "noqteler", ad: "Üçbucağın nöqtələrində bucaqlar", izah: "∠BIC = 90° + A/2 (I — daxili mərkəz), ∠BHC = 180° − A (H — hündürlüklərin kəsişməsi), ∠BOC = 2A (O — xarici çevrənin mərkəzi), ∠HAO = |B − C|.",
      gen() {
        const kind = pick(["bic", "bic", "bhc", "boc", "hao", "hao", "kont", "orth", "bjc"]);
        const [A, B, C] = angles3(kind !== "hao"), tr = triA(A, B, C), sw = Math.random() < .5;
        const Aa = sw ? [A, B, C] : [A, C, B];
        const P0 = { A: tr.A, B: tr.B, C: tr.C };
        const sides = { poly: ["A", "B", "C"], free: true };
        const give = x => `ABC üçbucağında ∠A = ${x}°`;
        if (kind === "bic") { const rev = Math.random() < .3, P = { ...P0, I: tr.I }, ang = 90 + A / 2;
          return { text: rev ? `ABC üçbucağında I — daxilə çəkilmiş çevrənin mərkəzidir (BI və CI tənbölənlərdir). ∠BIC = ${ang}°. ∠A-nı tap.` : `ABC üçbucağında I — daxilə çəkilmiş çevrənin mərkəzidir (BI və CI tənbölənlərdir). ∠A = ${A}°. ∠BIC-ni tap.`,
            svg: fig(P, { ...sides, segs: [["B", "I", "acc"], ["C", "I", "acc"]], arcs: [["I", "B", "C", rev ? dg(ang) : "?", 16], ["A", "B", "C", rev ? "?" : dg(A), 24]], aria: "Daxili mərkəz I" }),
            answer: rev ? A : ang, show: dg(rev ? A : ang), ...deg,
            solution: `BI, CI tənbölənlərdir: ∠IBC + ∠ICB = (∠B + ∠C)/2 = (180° − ∠A)/2 = 90° − ∠A/2. BIC üçbucağında ∠BIC = 180° − (90° − ∠A/2) = 90° + ∠A/2. ` + (rev ? `${ang}° = 90° + A/2 → A = ${A}°.` : `∠BIC = 90° + ${A}°/2 = ${ang}°.`) }; }
        if (kind === "bjc") { const P = { ...P0, J: tr.J }, ang = 90 - A / 2;
          return { text: `ABC üçbucağında J nöqtəsi BC tərəfinə toxunan və AB, AC tərəflərinin davamlarına toxunan çevrənin mərkəzidir (A bucağı qarşısındakı xaric mərkəz). ∠A = ${A}°. ∠BJC-ni tap.`,
            svg: fig(P, { ...sides, segs: [["B", "J", "acc"], ["C", "J", "acc"]], arcs: [["J", "B", "C", "?", 16], ["A", "B", "C", dg(A), 24]], aria: "Xaric mərkəz J" }), answer: ang, show: dg(ang), ...deg,
            solution: `BJ və CJ — B və C təpələrindəki xarici bucaqların tənbölənləridir: ∠JBC = (180° − ∠B)/2, ∠JCB = (180° − ∠C)/2. Cəmi 180° − (∠B + ∠C)/2 = 180° − (180° − ${A}°)/2 = ${90 + A / 2}°. ∠BJC = 180° − ${90 + A / 2}° = ${ang}°.` }; }
        if (kind === "bhc") { const P = { ...P0, H: tr.H }, ang = 180 - A;
          return { text: `Kəskinbucaqlı ABC üçbucağında H — hündürlüklərin kəsişmə nöqtəsidir. ∠A = ${A}°. ∠BHC-ni tap.`, svg: fig(P, { ...sides, segs: [["B", "H", "acc"], ["C", "H", "acc"]], arcs: [["H", "B", "C", "?", 16], ["A", "B", "C", dg(A), 24]], aria: "Hündürlüklərin kəsişməsi H" }), answer: ang, show: dg(ang), ...deg,
            solution: `BH ⟂ AC və CH ⟂ AB. AEHF dördbucaqlısında (E, F — hündürlüklərin ayaqları) iki düz bucaq var: ∠EHF = 360° − 90° − 90° − ${A}° = ${ang}°. ∠BHC = ∠EHF (şaquli) = ${ang}°.` }; }
        if (kind === "boc") { const P = { ...P0, O: tr.O };
          return { text: `Kəskinbucaqlı ABC üçbucağında O — xaricə çəkilmiş çevrənin mərkəzidir. ∠A = ${A}°. ∠BOC-ni tap.`, svg: fig(P, { ...sides, circ: [["O", tr.R]], segs: [["O", "B", "acc"], ["O", "C", "acc"]], arcs: [["O", "B", "C", "?", 16], ["A", "B", "C", dg(A), 24]], aria: "Xarici çevrənin mərkəzi O" }), answer: 2 * A, show: dg(2 * A), ...deg,
            solution: `∠A daxilə çəkilmiş bucaqdır, ∠BOC eyni BC qövsünə söykənən mərkəzi bucaqdır: ∠BOC = 2 · ${A}° = ${2 * A}°.` }; }
        if (kind === "hao") { const F = tr.foot(tr.A, tr.B, tr.C), P = { ...P0, H: tr.H, O: tr.O, K: F }, ans = Math.abs(B - C);
          if (ans === 0) return this.gen();
          return { text: `Kəskinbucaqlı ABC üçbucağında AK — BC-yə hündürlük, O — xaricə çəkilmiş çevrənin mərkəzidir. ∠B = ${B}°, ∠C = ${C}°. AK və AO arasındakı bucağı (∠KAO) tap.`,
            svg: fig(P, { ...sides, circ: [["O", tr.R]], names: ["A", "B", "C", "K", "O"], segs: [["A", "K", "acc"], ["A", "O", "acc"]], right: [["K", "A", "B"]], aria: "AK hündürlüyü və AO" }), answer: ans, show: dg(ans), ...deg,
            solution: `ABK düzbucaqlıdır: ∠BAK = 90° − ∠B = ${90 - B}°. OAB bərabəryanlıdır, ∠AOB = 2∠C = ${2 * C}°, ∠OAB = (180° − ${2 * C}°)/2 = ${90 - C}°. Hər ikisi B tərəfindən sayılır: ∠KAO = |(${90 - B}°) − (${90 - C}°)| = ${ans}°.` }; }
        // contact / orthic triangles
        if (kind === "kont") { const D = tr.foot(tr.I, tr.B, tr.C), E = tr.foot(tr.I, tr.A, tr.C), Fp = tr.foot(tr.I, tr.A, tr.B), P = { ...P0, I: tr.I, D, E, F: Fp }, ang = 90 - A / 2;
          return { text: `ABC üçbucağının daxilinə çəkilmiş çevrə BC, CA, AB tərəflərinə D, E, F nöqtələrində toxunur. ∠A = ${A}°. ∠EDF-i tap.`,
            svg: fig(P, { ...sides, circ: [["I", Math.hypot(D[0] - tr.I[0], D[1] - tr.I[1])]], names: ["A", "B", "C", "D", "E", "F"], cen: "I", segs: [["D", "E", "acc"], ["D", "F", "acc"], ["E", "F", "acc"]], arcs: [["D", "E", "F", "?", 14]], aria: "Daxilə çəkilmiş çevrənin toxunma nöqtələri" }), answer: ang, show: dg(ang), ...deg,
            solution: `IE ⟂ AC, IF ⟂ AB. AEIF dördbucaqlısında ∠EIF = 360° − 90° − 90° − ${A}° = ${180 - A}°. ∠EDF daxilə çəkilmiş bucaqdır və eyni EF qövsünə söykənir: ∠EDF = ${180 - A}°/2 = ${ang}°.` }; }
        const D = tr.foot(tr.A, tr.B, tr.C), E = tr.foot(tr.B, tr.A, tr.C), Fp = tr.foot(tr.C, tr.A, tr.B), P = { ...P0, H: tr.H, D, E, F: Fp }, ang = 180 - 2 * A;
        return { text: `Kəskinbucaqlı ABC üçbucağında AD, BE, CF hündürlükləri H nöqtəsində kəsişir. ∠A = ${A}°. ∠EDF-i tap (D, E, F hündürlüklərin ayaqlarıdır).`,
          svg: fig(P, { ...sides, names: ["A", "B", "C", "D", "E", "F", "H"], segs: [["A", "D", "dash"], ["B", "E", "dash"], ["C", "F", "dash"], ["D", "E", "acc"], ["D", "F", "acc"], ["E", "F", "acc"]], arcs: [["D", "E", "F", "?", 14]], aria: "Hündürlüklərin ayaqlarından üçbucaq" }), answer: ang, show: dg(ang), ...deg,
          solution: `BDHF dördbucaqlısında ∠BDH = ∠BFH = 90° → çevrəyə daxildir: ∠FDH = ∠FBH = 90° − ∠A = ${90 - A}°. Eyni ilə CDHE-də ∠EDH = ∠ECH = 90° − ∠A = ${90 - A}°. ∠EDF = ∠FDH + ∠HDE = 2 · ${90 - A}° = ${ang}°.` };
      } },

    { id: "lemma", ad: "Daxili–xarici mərkəz lemması", izah: "AI tənböləni xarici çevrəni W nöqtəsində kəsir. Onda WB = WC = WI (W-ni mərkəz götürsək, B, C, I nöqtələri bir çevrə üzərindədir). W nöqtəsi I və I_a xaric mərkəzinin orta nöqtəsidir.",
      gen() {
        const kind = pick(["ang", "ang", "len", "len", "prod", "prod", "xaric"]);
        let [A, B, C] = angles3(true); while (kind === "ang" && (A + B) % 2) [A, B, C] = angles3(true);
        const tr = triA(A, B, C);
        // W: second intersection of AI with the circumcircle
        const u = [tr.I[0] - tr.A[0], tr.I[1] - tr.A[1]], tt = -2 * (u[0] * (tr.A[0] - tr.O[0]) + u[1] * (tr.A[1] - tr.O[1])) / (u[0] * u[0] + u[1] * u[1]);
        const W = [tr.A[0] + tt * u[0], tr.A[1] + tt * u[1]], D = ix(tr.A, W, tr.B, tr.C), P = { A: tr.A, B: tr.B, C: tr.C, I: tr.I, W, D };
        const base = { free: true, poly: ["A", "B", "C"], polyFill: false, circ: [["O", tr.R]], names: ["A", "B", "C", "I", "W"], cen: "O", segs: [["A", "W", "acc"], ["B", "W", "dash"], ["C", "W", "dash"], ["B", "I", "dash"]] };
        P.O = tr.O;
        const T = "ABC üçbucağında I — daxilə çəkilmiş çevrənin mərkəzidir, AI şüası xaricə çəkilmiş çevrəni W nöqtəsində kəsir. ";
        const lem = `Lemma: WB = WC = WI. (∠WBI = ∠WBC + ∠CBI = ∠WAC + ∠B/2 = ∠A/2 + ∠B/2, ∠WIB isə ABI üçbucağının xarici bucağıdır: ∠A/2 + ∠B/2. Bərabər bucaqlar → WB = WI.)`;
        if (kind === "ang") { const x = (A + B) / 2;
          return { text: T + `∠A = ${A}°, ∠B = ${B}°. ∠WBI-ni tap.`, svg: fig(P, { ...base, arcs: [["B", "W", "I", "?", 20]] }), answer: x, show: dg(x), ...deg,
            solution: `∠WBI = ∠WBC + ∠CBI = ∠WAC + ∠B/2 = ∠A/2 + ∠B/2 = (${A}° + ${B}°)/2 = ${x}°.` }; }
        if (kind === "len") { const v = rnd(3, 30), ask = pick(["WC", "WI", "WB+WC", "WB+WC+WI"]), ans = { WC: v, WI: v, "WB+WC": 2 * v, "WB+WC+WI": 3 * v }[ask];
          const giv2 = ask === "WC" ? pick(["WB", "WI"]) : ask === "WI" ? pick(["WB", "WC"]) : pick(["WB", "WC", "WI"]);
          return { text: T + `${giv2} = ${v}. ${ask.includes("+") ? ask.split("+").join(" + ") + " cəmini" : ask + "-ni"} tap.`, svg: fig(P, { ...base, lab: { [giv2]: String(v) } }), answer: ans, show: String(ans), tol: 0.01,
            solution: `${lem} Deməli WB = WC = WI = ${v}. ${ask.split("+").join(" + ")} = ${ans}.` }; }
        if (kind === "prod") { const wb = rnd(2, 12), dv = []; for (let d = wb + 1; d <= 4 * wb; d++) if ((wb * wb) % d === 0) dv.push(d);
          const WA = dv.length ? pick(dv) : wb + rnd(1, 2 * wb), wd = wb * wb / WA, shw = frac(wb * wb, WA);
          return { text: T + `AW BC tərəfini D nöqtəsində kəsir. WI = ${wb}, AW = ${WA}. WD-ni tap.`, svg: fig(P, { ...base, names: ["A", "B", "C", "I", "W", "D"], lab: { WI: String(wb), AW: [String(WA), .3] } }), answer: wd, show: shw, tol: 0.005,
            solution: `Lemma: WB = WI = ${wb}. WBD və WAB üçbucaqlarında ∠BWD ümumi bucaqdır, ∠WBD = ∠WBC = ∠WAC = ∠WAB. Oxşardır: WB/WA = WD/WB → WD = WB²/WA = ${wb}²/${WA} = ${shw}.` }; }
        const v = rnd(2, 20);
        return { text: T + `J — A bucağı qarşısındakı xaric mərkəzdir (AI şüası üzərindədir). WB = ${v}. IJ parçasının uzunluğunu tap.`, svg: fig(P, { ...base, lab: { WB: String(v) } }), answer: 2 * v, show: String(2 * v), tol: 0.01,
          solution: `BI və BJ — B təpəsindəki daxili və xarici bucaqların tənbölənləridir, ona görə BI ⟂ BJ. IJ hipotenuzu olan IBJ düzbucaqlı üçbucağını W nöqtəsi mərkəz götürən çevrə əhatə edir: W — IJ-nin orta nöqtəsidir. Lemmaya görə WI = WB = ${v}, IJ = 2 · ${v} = ${2 * v}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Çevrənin bir qövsünə söykənən bütün daxili bucaqlar bərabərdir və mərkəzi bucağın yarısına bərabərdir. Əks qövsdə bucaq 180°-ə tamamlanır.",
      gen() {
        const kind = pick(["arena", "arena", "ferris", "saat", "sehne"]);
        if (kind === "arena") { const m = 10 * rnd(4, 16), big = Math.random() < .55;
          return { text: `Dairəvi arenanın kənarında A və B nöqtələrində iki kamera quraşdırılıb. Arenanın mərkəzindən baxanda ∠AOB = ${m}°. Arenanın kənarında, ${big ? "böyük" : "kiçik"} AB qövsü üzərindəki C nöqtəsində duran adam iki kameraya hansı bucaq altında baxır (∠ACB)?`,
            answer: big ? m / 2 : 180 - m / 2, unit: "°", tol: 0.01, show: dg(big ? m / 2 : 180 - m / 2),
            solution: big ? `C böyük qövs üzərindədir: ∠ACB daxilə çəkilmiş bucaqdır, kiçik AB qövsünə söykənir, ∠ACB = ${m}°/2 = ${m / 2}°.` : `C kiçik qövs üzərindədir: ∠ACB böyük qövsə (360° − ${m}° = ${360 - m}°) söykənir, ∠ACB = ${360 - m}°/2 = ${180 - m / 2}°.` }; }
        if (kind === "ferris") { const opts = [[12, 3], [12, 2], [18, 3], [18, 4], [20, 3], [20, 5], [24, 4], [24, 5], [30, 4], [36, 5], [36, 7], [40, 3]]; const [n, k] = pick(opts), ang = 180 * k / n, cen = 360 * k / n;
          if (!Number.isInteger(ang)) return this.gen();
          return { text: `Panorama çarxının ${n} kabinası çevrə boyunca bərabər məsafələrlə düzülüb. A və B kabinaları arasında ${k - 1} kabina var (qısa tərəfdən sayanda). C kabinası isə AB-nin uzun qövsü üzərindədir. C-də oturan adam A və B-ni hansı bucaq altında görür (∠ACB)?`,
            answer: ang, unit: "°", tol: 0.01, show: dg(ang),
            solution: `Qonşu kabinalar arasındakı mərkəzi bucaq 360°/${n} = ${360 / n}°-dir. A və B arasında ${k} aralıq olduğundan qısa AB qövsü ${k} · ${360 / n}° = ${cen}°-dir. C böyük qövs üzərindədir: ∠ACB = ${cen}°/2 = ${ang}°.` }; }
        if (kind === "saat") { const a = rnd(1, 6), b = a + rnd(2, 5), c = pick([...Array(12)].map((_, i) => i + 1).filter(i => i < a || i > b)), inside = false;
          const ang = 15 * (b - a);
          return { text: `Dairəvi saat siferblatında ${a} və ${b} rəqəmlərinin yerləri A və B nöqtələridir, ${c} rəqəminin yeri isə C nöqtəsidir. ${a} ilə ${b} arasındakı qövsdə (qısa tərəfdə) C yoxdur. ∠ACB neçə dərəcədir? (Siferblatın bölgüləri bərabərdir.)`,
            answer: ang, unit: "°", tol: 0.01, show: dg(ang),
            solution: `Hər saat bölgüsü 360°/12 = 30°-lik qövsdür. ${a}-dan ${b}-yə qövs ${b - a} · 30° = ${30 * (b - a)}°. C bu qövsün xaricindədir, ∠ACB = ${30 * (b - a)}°/2 = ${ang}°.` }; }
        const x = 10 * rnd(2, 8), opp = Math.random() < .5;
        return { text: `Dairəvi parkın kənarında A və B nöqtələri səhnənin uclarıdır. Parkın kənarındakı C nöqtəsindən səhnə ${x}° bucaq altında görünür. ${opp ? "Səhnənin əks tərəfindəki (C ilə AB-nin müxtəlif tərəflərində) D nöqtəsindən səhnə hansı bucaq altında görünür?" : "AB-yə nəzərən C ilə eyni tərəfdəki D nöqtəsindən səhnə hansı bucaq altında görünür?"}`,
          answer: opp ? 180 - x : x, unit: "°", tol: 0.01, show: dg(opp ? 180 - x : x),
          solution: opp ? `A, B, C, D bir çevrə üzərindədir və C, D AB-nin müxtəlif tərəflərindədir: ACBD çevrəyə daxil olan dördbucaqlıdır, qarşı bucaqların cəmi 180°: ∠ADB = 180° − ${x}° = ${180 - x}°.` : `C və D eyni AB qövsü üzərindədir, eyni qövsə söykənən daxilə çəkilmiş bucaqlar bərabərdir: ∠ADB = ${x}°.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), kind = pick(["xord", "dord", "xaric"]);
        if (kind === "xord") { const [p, , r] = arcs4(), v = (p + r) / 2;
          const st = [`∠AEB iki vətərin kəsişməsində yaranır, o AB və CD qövslərinə əsaslanır.`, `∠AEB = (AB qövsü + CD qövsü)/2.`, `∠AEB = (${p}° + ${r}°)/2 = ${v}°.`];
          if (bad === 0) st[0] = `∠AEB yalnız AB qövsünə əsaslanır (CD-nin ona dəxli yoxdur).`;
          if (bad === 1) st[1] = `∠AEB = (AB qövsü − CD qövsü)/2.`;
          if (bad === 2) st[2] = `∠AEB = (${p}° + ${r}°)/2 = ${v + pick([-10, 10, 20])}°.`;
          const why = [`1-ci addım səhvdir: iki vətər arasındakı bucaq həm AB, həm də şaquli ∠CED-in söykəndiyi CD qövsünə əsaslanır. Düz cavab ${v}°.`,
            `2-ci addım səhvdir: vətərlər çevrənin daxilində kəsişəndə qövslər toplanır, çıxılmır (çıxma çevrədən kənar nöqtə üçündür). Düz cavab ${v}°.`,
            `3-cü addım səhvdir: (${p} + ${r})/2 = ${v}. Düz cavab ${v}°.`][bad];
          return { text: steps(`Çevrənin AC və BD vətərləri E nöqtəsində kəsişir. AB qövsü ${p}°, CD qövsü ${r}°. ∠AEB-ni tapırıq.`, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: why }; }
        if (kind === "dord") { const x = 10 * rnd(6, 12), v = 180 - x;
          const st = [`ABCD çevrəyə daxil olan dördbucaqlıdır, qarşı bucaqların cəmi 180°-dir.`, `∠C = 180° − ∠A.`, `∠C = 180° − ${x}° = ${v}°.`];
          if (bad === 0) st[0] = pick([`ABCD çevrəyə daxil olan dördbucaqlıdır, qonşu bucaqların cəmi 180°-dir.`, `ABCD çevrəyə daxil olan dördbucaqlıdır, qarşı bucaqlar bərabərdir.`]);
          if (bad === 1) st[1] = `∠C = 360° − ∠A.`;
          if (bad === 2) st[2] = `∠C = 180° − ${x}° = ${v + pick([-20, -10, 10, 20])}°.`;
          const why = [`1-ci addım səhvdir: çevrəyə daxil olan dördbucaqlıda <b>qarşı</b> bucaqların cəmi 180°-dir. Düz cavab ${v}°.`.replace(/<\/?b>/g, ""),
            `2-ci addım səhvdir: qarşı bucaqların cəmi 180°-dir, 360° deyil. Düz cavab ${v}°.`,
            `3-cü addım səhvdir: 180 − ${x} = ${v}. Düz cavab ${v}°.`][bad];
          return { text: steps(`ABCD dördbucaqlısı çevrəyə daxil edilib, ∠A = ${x}°. ∠C-ni tapırıq.`, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: why }; }
        const n = 10 * rnd(3, 10), f = n + 10 * rnd(3, 12), v = (f - n) / 2;
        const st = [`P nöqtəsi çevrədən kənardadır, ona görə bucaq iki qövsün fərqinin yarısıdır.`, `∠P = (uzaq qövs − yaxın qövs)/2.`, `∠P = (${f}° − ${n}°)/2 = ${v}°.`];
        if (bad === 0) st[0] = `P nöqtəsi çevrədən kənardadır, ona görə bucaq iki qövsün cəminin yarısıdır.`;
        if (bad === 1) st[1] = `∠P = (yaxın qövs − uzaq qövs)/2.`;
        if (bad === 2) st[2] = `∠P = (${f}° − ${n}°)/2 = ${v + pick([-10, -5, 5, 10])}°.`;
        const why = [`1-ci addım səhvdir: çevrədən kənar nöqtədəki bucaq qövslərin <b>fərqinin</b> yarısıdır, cəminin yox. Düz cavab ${v}°.`.replace(/<\/?b>/g, ""),
          `2-ci addım səhvdir: fərq uzaq qövsdən yaxın qövs çıxılmaqla alınır, bucaq müsbət olmalıdır. Düz cavab ${v}°.`,
          `3-cü addım səhvdir: (${f} − ${n})/2 = ${v}. Düz cavab ${v}°.`][bad];
        return { text: steps(`P nöqtəsindən çevrəyə iki kəsən çəkilib. Yaxın qövs ${n}°, uzaq qövs ${f}°. Kəsənlər arasındakı bucağı tapırıq.`, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-cevrede-bucaqlar", title: "Çevrədə bucaqlar (olimpiada səviyyəsi)", fenn: "olimpiada", link: "dersler/ol-cevrede-bucaqlar.html",
      format: "Cavab ədəddir (bucağı dərəcə ilə yaz, işarəsiz): 70, 37.5; uzunluq və ya nisbət üçün tam və ya kəsr (məs. 15/4).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ichde","ichde","xaricde","xaricde","dord","dord","noqteler","lemma","heyat","sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-cevrede-bucaqlar.html")) b.push("dersler/ol-cevrede-bucaqlar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
