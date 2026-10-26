// Çevrədə bucaqlar, toxunan və kəsən — mastery game levels and the final test.
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

  const levels = [
    { id: "merkezi", ad: "Mərkəzi və daxilə çəkilmiş bucaq", izah: "Daxilə çəkilmiş bucaq eyni qövsə söykənən mərkəzi bucağın yarısıdır. Eyni qövsə söykənən daxilə çəkilmiş bucaqlar bərabərdir.",
      gen() {
        const kind = pick(["ins", "cen", "cen", "big", "oab", "nisbet", "eyni"]);
        const a0 = rnd(0, 359);
        if (kind === "ins" || kind === "cen" || kind === "oab") {
          const x = pick(range(15, 80, 5)), c = a0 + 2 * x + rnd(40, 320 - 2 * x);
          const P = { O: [0, 0], A: on(a0), B: on(a0 + 2 * x), C: on(c) };
          const base = { circ: C1, cen: "O", free: true, segs: [["O", "A", "acc"], ["O", "B", "acc"], ["C", "A"], ["C", "B"]] };
          if (kind === "ins") return { text: `A, B, C nöqtələri O mərkəzli çevrə üzərindədir. ∠ACB = ${x}°. ∠AOB mərkəzi bucağını tap.`,
            svg: figure(P, { ...base, arcs: [["C", "A", "B", x + "°", 22], ["O", "A", "B", "?", 14]] }), answer: 2 * x, show: 2 * x + "°", ...deg,
            solution: `∠ACB və ∠AOB eyni AB qövsünə söykənir. Mərkəzi bucaq daxilə çəkilmiş bucağın iki mislidir: ∠AOB = 2 · ${x}° = ${2 * x}°.` };
          if (kind === "cen") return { text: `A, B, C nöqtələri O mərkəzli çevrə üzərindədir, C böyük AB qövsü üzərindədir. ∠AOB = ${2 * x}°. ∠ACB-ni tap.`,
            svg: figure(P, { ...base, arcs: [["O", "A", "B", 2 * x + "°", 14], ["C", "A", "B", "?", 22]] }), answer: x, show: x + "°", ...deg,
            solution: `Daxilə çəkilmiş ∠ACB eyni AB qövsünə söykənən mərkəzi bucağın yarısıdır: ${2 * x}° : 2 = ${x}°.` };
          return { text: `A, B, C nöqtələri O mərkəzli çevrə üzərindədir, C böyük AB qövsü üzərindədir. ∠ACB = ${x}°. ∠OAB-ni tap.`,
            svg: figure(P, { ...base, segs: [...base.segs, ["A", "B"]], arcs: [["C", "A", "B", x + "°", 22], ["A", "O", "B", "?", 20]] }), answer: 90 - x, show: (90 - x) + "°", ...deg,
            solution: `∠AOB = 2 · ${x}° = ${2 * x}°. OA = OB (radiuslar), AOB bərabəryanlıdır: ∠OAB = (180° − ${2 * x}°) : 2 = ${90 - x}°.` };
        }
        if (kind === "big") {
          const y = pick(range(60, 160, 10)), P = { O: [0, 0], A: on(a0), B: on(a0 + y), C: on(a0 + rnd(15, y - 15)) }, ans = (360 - y) / 2;
          return { text: `A, B, C nöqtələri O mərkəzli çevrə üzərindədir, C kiçik AB qövsü üzərindədir. ∠AOB = ${y}°. ∠ACB-ni tap.`,
            svg: figure(P, { circ: C1, cen: "O", free: true, segs: [["O", "A", "acc"], ["O", "B", "acc"], ["C", "A"], ["C", "B"]], arcs: [["O", "A", "B", y + "°", 14], ["C", "A", "B", "?", 14]] }),
            answer: ans, show: ans + "°", ...deg,
            solution: `C kiçik qövsdədir, ona görə ∠ACB C-ni saxlamayan böyük AB qövsünə söykənir: 360° − ${y}° = ${360 - y}°. ∠ACB = ${360 - y}° : 2 = ${ans}°.` };
        }
        if (kind === "nisbet") {
          let r; do r = [rnd(1, 9), rnd(1, 9), rnd(1, 9)]; while (r.some(k => (180 * k) % (r[0] + r[1] + r[2])) || new Set(r).size < 2);
          const sum = r[0] + r[1] + r[2], big = Math.random() < .5, k = big ? Math.max(...r) : Math.min(...r), ans = 180 * k / sum;
          return { text: `A, B və C nöqtələri çevrəni ${r[0]} : ${r[1]} : ${r[2]} nisbətində üç qövsə bölür. ABC üçbucağının ən ${big ? "böyük" : "kiçik"} bucağını tap.`,
            answer: ans, show: ans + "°", ...deg,
            solution: `Bir hissə = 360° : ${sum} = ${360 / sum}°. Qövslər: ${r.map(k2 => k2 * 360 / sum + "°").join(", ")}. Üçbucağın hər bucağı qarşısındakı qövsün yarısıdır, ona görə ən ${big ? "böyük" : "kiçik"} bucaq = ${k * 360 / sum}° : 2 = ${ans}°.` };
        }
        // same arc: ABCD inscribed, two angles on one arc
        const pairs = [["BAC", "BDC", 1, "BC"], ["ABD", "ACD", 3, "AD"], ["CAD", "CBD", 2, "CD"], ["ADB", "ACB", 0, "AB"]];
        let [g1, g2, ai, an] = pick(pairs); if (Math.random() < .5) [g1, g2] = [g2, g1];
        const x = pick(range(20, 70, 5)), rest = 360 - 2 * x, a = rnd(40, rest - 80), b = rnd(40, rest - a - 40), arcs = [a, b, rest - a - b];
        arcs.splice(ai, 0, 2 * x);
        const ang = [a0, a0 + arcs[0], a0 + arcs[0] + arcs[1], a0 + arcs[0] + arcs[1] + arcs[2]];
        const P = { A: on(ang[0]), B: on(ang[1]), C: on(ang[2]), D: on(ang[3]), O: [0, 0] };
        return { text: `ABCD dördbucaqlısının təpələri çevrə üzərindədir. ∠${g1} = ${x}°. ∠${g2}-ni tap.`,
          svg: figure(P, { circ: C1, cen: "O", names: ["A", "B", "C", "D"], free: true, poly: ["A", "B", "C", "D"], polyFill: false, segs: [["A", "C", "acc"], ["B", "D", "acc"]], arcs: [[g1[1], g1[0], g1[2], x + "°", 20], [g2[1], g2[0], g2[2], "?", 20]] }),
          answer: x, show: x + "°", ...deg,
          solution: `∠${g1} və ∠${g2} eyni ${an} qövsünə söykənir, təpələri qövsün eyni tərəfindədir. Belə daxilə çəkilmiş bucaqlar bərabərdir: ∠${g2} = ${x}°.` };
      } },

    { id: "diametr", ad: "Diametrə söykənən bucaq", izah: "Diametrə söykənən daxilə çəkilmiş bucaq 90°-dir. Diametr — düzbucaqlı üçbucağın hipotenuzu olur.",
      gen() {
        const kind = pick(["hip", "katet", "katet", "rad", "bucaq", "aoc"]);
        const [p, q, c] = triple(40), t0 = rnd(0, 359), phi = 2 * Math.atan2(q, p) * 180 / Math.PI;
        const P = { A: on(t0 + 180), B: on(t0), C: on(t0 + phi), O: [0, 0] };
        const base = { circ: C1, cen: "O", free: true, segs: [["A", "B"], ["A", "C"], ["C", "B"]], right: [["C", "A", "B"]] };
        if (kind === "hip") {
          const R = Math.random() < .5;
          return { text: `AB — çevrənin diametri, C nöqtəsi çevrə üzərindədir. AC = ${p}, BC = ${q}. Çevrənin ${R ? "radiusunu" : "diametrini"} tap.`,
            svg: figure(P, { ...base, lab: { AC: String(p), CB: String(q) } }), answer: R ? c / 2 : c, show: R ? frac(c, 2) : String(c), tol: 0.01,
            solution: `∠ACB diametrə söykənir, ona görə 90°-dir. AB² = ${p}² + ${q}² = ${c * c}, AB = ${c}.` + (R ? ` Radius = ${c} : 2 = ${frac(c, 2)}.` : "") };
        }
        if (kind === "katet") return { text: `AB — çevrənin diametri, AB = ${c}. C nöqtəsi çevrə üzərindədir, AC = ${p}. BC-ni tap.`,
          svg: figure(P, { ...base, lab: { AB: [String(c), .27], AC: String(p), CB: "?" } }), answer: q, show: String(q), tol: 0.01,
          solution: `∠ACB = 90° (diametrə söykənir). BC² = AB² − AC² = ${c * c} − ${p * p} = ${q * q}, BC = ${q}.` };
        if (kind === "rad") {
          const k = c % 2 ? 2 : 1, pp = p * k, qq = q * k, cc = c * k;
          return { text: `Çevrənin radiusu ${cc / 2}. AB — diametr, C çevrə üzərindədir, AC = ${pp}. BC-ni tap.`,
            svg: figure(P, { ...base, segs: [...base.segs, ["O", "C", "dash"]], lab: { AC: String(pp), CB: "?" } }), answer: qq, show: String(qq), tol: 0.01,
            solution: `AB = 2 · ${cc / 2} = ${cc}. ∠ACB = 90°, ona görə BC² = ${cc}² − ${pp}² = ${cc * cc - pp * pp}, BC = ${qq}.` };
        }
        const x = pick(range(15, 75, 5)), Px = { A: on(t0 + 180), B: on(t0), C: on(t0 + 2 * x), O: [0, 0] };
        if (kind === "bucaq") return { text: `AB — çevrənin diametri, C çevrə üzərindədir. ∠CAB = ${x}°. ∠ABC-ni tap.`,
          svg: figure(Px, { ...base, arcs: [["A", "C", "B", x + "°", 26], ["B", "A", "C", "?", 18]] }), answer: 90 - x, show: (90 - x) + "°", ...deg,
          solution: `∠ACB = 90° (diametrə söykənir). ∠ABC = 90° − ${x}° = ${90 - x}°.` };
        return { text: `AB — O mərkəzli çevrənin diametri, C çevrə üzərindədir. ∠CAB = ${x}°. ∠BOC-ni tap.`,
          svg: figure(Px, { ...base, segs: [...base.segs, ["O", "C", "acc"]], right: [], arcs: [["A", "C", "B", x + "°", 26], ["O", "B", "C", "?", 14]] }), answer: 2 * x, show: 2 * x + "°", ...deg,
          solution: `∠CAB daxilə çəkilmiş, ∠BOC mərkəzi bucaqdır, ikisi də BC qövsünə söykənir: ∠BOC = 2 · ${x}° = ${2 * x}°.` };
      } },

    { id: "toxunan", ad: "Toxunan", izah: "Toxunan toxunma nöqtəsinə çəkilmiş radiusa perpendikulyardır. Bir nöqtədən çəkilmiş iki toxunan parçası bərabərdir.",
      gen() {
        const kind = pick(["mt", "mt", "ugol", "ugol", "u60", "perim"]);
        if (kind === "mt") {
          let [p, q, c] = triple(30); if (q < .6 * p) [p, q] = [q, p]; // keep M away from the circle
          const ask = pick(["MT", "MO", "r"]);
          const T = on(Math.acos(p / c) * 180 / Math.PI, p), P = { O: [0, 0], M: [c, 0], T };
          const known = { MT: `MT = ${q}`, MO: `MO = ${c}`, r: `çevrənin radiusu ${p}` };
          const giv = ["r", "MT", "MO"].filter(k => k !== ask).map(k => known[k]).join(", ");
          const ans = { MT: q, MO: c, r: p }[ask];
          const lab = { OT: ask === "r" ? "?" : String(p), TM: ask === "MT" ? "?" : String(q), OM: ask === "MO" ? "?" : String(c) };
          return { text: `MT — M nöqtəsindən O mərkəzli çevrəyə çəkilmiş toxunandır (T — toxunma nöqtəsi). ${giv[0].toUpperCase() + giv.slice(1)}. ${{ MT: "MT-ni", MO: "MO-nu", r: "Radiusu" }[ask]} tap.`,
            svg: figure(P, { circ: [["O", p]], cen: "O", free: true, segs: [["O", "T"], ["T", "M", "acc"], ["O", "M", "dash"]], right: [["T", "O", "M"]], lab }),
            answer: ans, show: String(ans), tol: 0.01,
            solution: `OT ⟂ MT (toxunan radiusa perpendikulyardır), OTM düzbucaqlı üçbucaqdır, MO — hipotenuz. ` +
              { MT: `MT² = ${c}² − ${p}² = ${q * q}, MT = ${q}.`, MO: `MO² = ${p}² + ${q}² = ${c * c}, MO = ${c}.`, r: `OT² = ${c}² − ${q}² = ${p * p}, r = ${p}.` }[ask] };
        }
        if (kind === "ugol") {
          const x = pick(range(30, 140, 10)), d = 1 / Math.cos(rad(90 - x / 2)), [A, B] = tang(d);
          const P = { O: [0, 0], M: [d, 0], A, B }, ask = pick(["AOB", "AOB", "MAB", "OMA", "rev"]);
          const base = { circ: C1, cen: "O", free: true, segs: [["M", "A", "acc"], ["M", "B", "acc"], ["O", "A"], ["O", "B"]], right: [["A", "O", "M"], ["B", "O", "M"]], place: { O: ["M", "out"] } };
          if (ask === "AOB") return { text: `M nöqtəsindən O mərkəzli çevrəyə MA və MB toxunanları çəkilib (A, B — toxunma nöqtələri). ∠AMB = ${x}°. ∠AOB-ni tap.`,
            svg: figure(P, { ...base, arcs: [["M", "A", "B", x + "°", 22], ["O", "A", "B", "?", 14]] }), answer: 180 - x, show: (180 - x) + "°", ...deg,
            solution: `∠OAM = ∠OBM = 90° (toxunan ⟂ radius). OAMB dördbucaqlısının bucaqlarının cəmi 360°: ∠AOB = 360° − 90° − 90° − ${x}° = ${180 - x}°.` };
          if (ask === "rev") return { text: `M nöqtəsindən O mərkəzli çevrəyə MA və MB toxunanları çəkilib. ∠AOB = ${180 - x}°. ∠AMB-ni tap.`,
            svg: figure(P, { ...base, arcs: [["O", "A", "B", (180 - x) + "°", 14], ["M", "A", "B", "?", 22]] }), answer: x, show: x + "°", ...deg,
            solution: `∠OAM = ∠OBM = 90°. ∠AMB = 360° − 90° − 90° − ${180 - x}° = ${x}°.` };
          if (ask === "MAB") return { text: `M nöqtəsindən çevrəyə MA və MB toxunanları çəkilib (A, B — toxunma nöqtələri). ∠AMB = ${x}°. ∠MAB-ni tap.`,
            svg: figure(P, { ...base, segs: [...base.segs, ["A", "B"]], right: [], arcs: [["M", "A", "B", x + "°", 22], ["A", "M", "B", "?", 18]] }), answer: (180 - x) / 2, show: (180 - x) / 2 + "°", ...deg,
            solution: `Bir nöqtədən çəkilmiş toxunan parçaları bərabərdir: MA = MB. MAB bərabəryanlıdır: ∠MAB = (180° − ${x}°) : 2 = ${(180 - x) / 2}°.` };
          return { text: `M nöqtəsindən O mərkəzli çevrəyə MA və MB toxunanları çəkilib. ∠AMB = ${x}°. ∠OMA-nı tap.`,
            svg: figure(P, { ...base, segs: [...base.segs, ["O", "M", "dash"]], arcs: [["M", "A", "B", x + "°", 26], ["M", "O", "A", "?", 16]] }), answer: x / 2, show: x / 2 + "°", ...deg,
            solution: `MO AMB bucağını yarıya bölür (OAM və OBM üçbucaqları bərabərdir: OA = OB, MA = MB, MO ortaq). ∠OMA = ${x}° : 2 = ${x / 2}°.` };
        }
        if (kind === "u60") {
          const k = rnd(2, 12), [A, B] = tang(2), P = { O: [0, 0], M: [2, 0], A, B }, ask = pick(["MA", "MO", "MAr"]);
          const svg = figure(P, { circ: C1, cen: "O", free: true, segs: [["M", "A", "acc"], ["M", "B", "acc"], ["O", "A"], ["O", "B"], ["O", "M", "dash"]], right: [["A", "O", "M"]], arcs: [["M", "A", "B", "60°", 24]], place: { O: ["M", "out"] } });
          const [s3] = surd(k, 1, 3);
          if (ask === "MA") return { text: `M nöqtəsindən radiusu ${k} olan çevrəyə MA və MB toxunanları çəkilib, ∠AMB = 60°. MA-nı tap.`, svg, answer: k * Math.sqrt(3), show: s3, placeholder: "məs. 5√3",
            solution: `MO bucağı yarıya bölür: ∠OMA = 30°. OAM düzbucaqlı üçbucağında 30°-li bucaq qarşısındakı katet OA = ${k}, ona görə MO = ${2 * k}. MA = √(${2 * k}² − ${k}²) = ${s3}.` };
          if (ask === "MO") return { text: `M nöqtəsindən radiusu ${k} olan O mərkəzli çevrəyə MA və MB toxunanları çəkilib, ∠AMB = 60°. MO-nu tap.`, svg, answer: 2 * k, show: String(2 * k), tol: 0.01,
            solution: `∠OMA = 60° : 2 = 30°, ∠OAM = 90°. 30°-li bucaq qarşısındakı katet hipotenuzun yarısıdır: MO = 2 · OA = ${2 * k}.` };
          return { text: `M nöqtəsindən O mərkəzli çevrəyə MA və MB toxunanları çəkilib, ∠AMB = 60°, MO = ${2 * k}. Çevrənin radiusunu tap.`, svg, answer: k, show: String(k), tol: 0.01,
            solution: `∠OMA = 30°, ∠OAM = 90°. OA 30°-li bucaq qarşısındakı katetdir: OA = MO : 2 = ${k}.` };
        }
        // perimeter of the triangle cut off by a third tangent
        const t = rnd(3, 25), d = 1.6 + Math.random() * 1.2, [A, B] = tang(d), f = Math.acos(1 / d) * 180 / Math.PI, psi = (Math.random() * 1.2 - .6) * f, E = on(psi);
        const cut = X => { const cs = Math.cos(rad(psi)), sn = Math.sin(rad(psi)), s = (1 - d * cs) / ((X[0] - d) * cs + X[1] * sn); return [d + s * (X[0] - d), s * X[1]]; };
        const P = { O: [0, 0], M: [d, 0], A, B, E, K: cut(A), L: cut(B) };
        return { text: `M nöqtəsindən çevrəyə MA və MB toxunanları çəkilib, MA = ${t}. Kiçik AB qövsünün E nöqtəsindən çəkilmiş toxunan MA və MB-ni K və L nöqtələrində kəsir. MKL üçbucağının perimetrini tap.`,
          svg: figure(P, { circ: C1, cen: "O", names: ["M", "A", "B", "E", "K", "L"], free: true, segs: [["M", "A", "acc"], ["M", "B", "acc"], ["K", "L", "acc"]], lab: { MA: String(t) } }),
          answer: 2 * t, show: String(2 * t), tol: 0.01,
          solution: `Bir nöqtədən çəkilmiş toxunan parçaları bərabərdir: KE = KA, LE = LB, MB = MA = ${t}. P = MK + KE + EL + LM = (MK + KA) + (LB + LM) = MA + MB = ${2 * t}.` };
      } },

    { id: "veter", ad: "Toxunan, vətər və kəsən bucaqları", izah: "Toxunanla vətər arasındakı bucaq — qövsün yarısı. Daxildə kəsişən vətərlər: (qövs₁ + qövs₂) : 2. Xaricdən iki kəsən: (böyük − kiçik) : 2.",
      gen() {
        const kind = pick(["tc", "tc", "ice", "ice", "xar", "xar"]), a0 = rnd(0, 359);
        if (kind === "tc") {
          const x = pick(range(20, 80, 5)), A = on(a0), dir = [-Math.sin(rad(a0)), Math.cos(rad(a0))];
          const P = { O: [0, 0], A, B: on(a0 + 2 * x), C: on(a0 + 2 * x + rnd(40, 320 - 2 * x)), K: [A[0] + 1.1 * dir[0], A[1] + 1.1 * dir[1]], k: [A[0] - .9 * dir[0], A[1] - .9 * dir[1]] };
          const sub = pick(["arc", "ang", "ins", "cen"]);
          const base = { circ: C1, cen: "O", names: ["A", "B", "K"], free: true, segs: [["k", "K", "acc"], ["A", "B"]] };
          if (sub === "arc") return { text: `AK — A nöqtəsində çevrəyə toxunan, AB — vətər. AB qövsü (KAB bucağının daxilindəki) ${2 * x}°-dir. ∠KAB-ni tap.`,
            svg: figure(P, { ...base, arcs: [["A", "K", "B", "?", 22]] }), answer: x, show: x + "°", ...deg,
            solution: `Toxunanla vətər arasındakı bucaq onların arasındakı qövsün yarısıdır: ${2 * x}° : 2 = ${x}°.` };
          if (sub === "ang") return { text: `AK — A nöqtəsində çevrəyə toxunan, AB — vətər, ∠KAB = ${x}°. Bu bucağın daxilindəki AB qövsü neçə dərəcədir?`,
            svg: figure(P, { ...base, arcs: [["A", "K", "B", x + "°", 22]] }), answer: 2 * x, show: 2 * x + "°", ...deg,
            solution: `∠KAB = AB qövsü : 2, ona görə qövs = 2 · ${x}° = ${2 * x}°.` };
          if (sub === "ins") return { text: `AK — A nöqtəsində çevrəyə toxunan, AB — vətər, ∠KAB = ${x}°. C nöqtəsi böyük AB qövsü üzərindədir. ∠ACB-ni tap.`,
            svg: figure(P, { ...base, names: ["A", "B", "C", "K"], segs: [...base.segs, ["C", "A"], ["C", "B"]], arcs: [["A", "K", "B", x + "°", 22], ["C", "A", "B", "?", 20]] }), answer: x, show: x + "°", ...deg,
            solution: `İkisi də eyni AB qövsünün yarısıdır: ∠KAB = ∠ACB = qövs AB : 2. Deməli ∠ACB = ${x}°.` };
          return { text: `AK — A nöqtəsində O mərkəzli çevrəyə toxunan, AB — vətər, ∠KAB = ${x}°. ∠AOB-ni tap.`,
            svg: figure(P, { ...base, names: ["A", "B", "K", "O"], segs: [...base.segs, ["O", "A", "dash"], ["O", "B", "dash"]], arcs: [["A", "K", "B", x + "°", 22], ["O", "A", "B", "?", 14]] }), answer: 2 * x, show: 2 * x + "°", ...deg,
            solution: `AB qövsü = 2 · ∠KAB = ${2 * x}°. Mərkəzi bucaq qövsə bərabərdir: ∠AOB = ${2 * x}°.` };
        }
        if (kind === "ice") {
          let al, be, ga; do { al = pick(range(30, 160, 10)); be = pick(range(30, 160, 10)); ga = pick(range(40, 120, 10)); } while (360 - al - be - ga < 40);
          // order around the circle: A, C, B, D; arcs AC = al, CB = ga, BD = be
          const P = { O: [0, 0], A: on(a0), C: on(a0 + al), B: on(a0 + al + ga), D: on(a0 + al + ga + be) };
          const xx = P.A, yy = P.B, zz = P.C, ww = P.D, den = (xx[0] - yy[0]) * (zz[1] - ww[1]) - (xx[1] - yy[1]) * (zz[0] - ww[0]);
          const tt = ((xx[0] - zz[0]) * (zz[1] - ww[1]) - (xx[1] - zz[1]) * (zz[0] - ww[0])) / den;
          P.E = [xx[0] + tt * (yy[0] - xx[0]), xx[1] + tt * (yy[1] - xx[1])];
          const ang = (al + be) / 2, sub = pick(["ang", "ang", "arc"]);
          const svg = tx => figure(P, { circ: C1, cen: "O", names: ["A", "B", "C", "D", "E"], bis: { E: ["C", "B"] }, free: true, segs: [["A", "B", "acc"], ["C", "D", "acc"]], arcs: [["E", "A", "C", tx, 16]] });
          if (sub === "ang") return { text: `AB və CD vətərləri E nöqtəsində kəsişir. AC qövsü ${al}°, BD qövsü ${be}° (hər ikisi E bucaqlarının daxilindədir). ∠AEC-ni tap.`,
            svg: svg("?"), answer: ang, show: ang + "°", ...deg,
            solution: `Daxildə kəsişən vətərlər arasındakı bucaq onun və qarşı bucağın söykəndiyi qövslərin cəminin yarısıdır: ∠AEC = (${al}° + ${be}°) : 2 = ${ang}°.` };
          return { text: `AB və CD vətərləri E nöqtəsində kəsişir, ∠AEC = ${ang}°. AC qövsü ${al}°-dir. BD qövsünü tap (∠BED-nin daxilindəki).`,
            svg: svg(ang + "°"), answer: be, show: be + "°", ...deg,
            solution: `∠AEC = (AC + BD) : 2 → ${ang}° = (${al}° + BD) : 2 → BD = ${2 * ang}° − ${al}° = ${be}°.` };
        }
        // two secants from M: near arc AC = be, far arc BD = al
        let al, be, ga, de, P, ok = false;
        while (!ok) {
          be = pick(range(30, 100, 10)); ga = pick(range(50, 110, 10)); de = ga + pick([-10, 0, 10]); al = 360 - be - ga - de;
          if (al - be < 20 || al > 200) continue;
          P = { O: [0, 0], A: on(be / 2), C: on(-be / 2), B: on(be / 2 + ga), D: on(-be / 2 - de) };
          const [A, B, C, D] = [P.A, P.B, P.C, P.D], den = (A[0] - B[0]) * (C[1] - D[1]) - (A[1] - B[1]) * (C[0] - D[0]);
          const tt = ((A[0] - C[0]) * (C[1] - D[1]) - (A[1] - C[1]) * (C[0] - D[0])) / den;
          P.M = [A[0] + tt * (B[0] - A[0]), A[1] + tt * (B[1] - A[1])];
          const dist = (X, Y) => Math.hypot(X[0] - Y[0], X[1] - Y[1]);
          ok = Math.hypot(...P.M) > 1.15 && Math.hypot(...P.M) < 4 && dist(P.M, A) < dist(P.M, B) && dist(P.M, C) < dist(P.M, D);
        }
        const ang = (al - be) / 2, sub = pick(["ang", "ang", "far"]);
        const svg = tx => figure(P, { circ: C1, cen: "O", names: ["A", "B", "C", "D", "M"], free: true, segs: [["M", "B", "acc"], ["M", "D", "acc"]], arcs: [["M", "A", "C", tx, 22]] });
        if (sub === "ang") return { text: `M nöqtəsindən çevrəyə iki kəsən çəkilib: MAB və MCD (A və C M-ə yaxındır). BD qövsü ${al}°, AC qövsü ${be}°. ∠BMD-ni tap.`,
          svg: svg("?"), answer: ang, show: ang + "°", ...deg,
          solution: `Xaricdən çəkilmiş iki kəsən arasındakı bucaq uzaq və yaxın qövslərin fərqinin yarısıdır: (${al}° − ${be}°) : 2 = ${ang}°.` };
        return { text: `M nöqtəsindən çevrəyə iki kəsən çəkilib: MAB və MCD (A və C M-ə yaxındır). ∠BMD = ${ang}°, AC qövsü ${be}°. Uzaq BD qövsünü tap.`,
          svg: svg(ang + "°"), answer: al, show: al + "°", ...deg,
          solution: `∠M = (BD − AC) : 2 → ${ang}° = (BD − ${be}°) : 2 → BD = ${2 * ang}° + ${be}° = ${al}°.` };
      } },

    { id: "uzunluq", ad: "Vətər və kəsən parçaları", izah: "Kəsişən vətərlər: AE · EB = CE · ED. Toxunan və kəsən: MT² = MA · MB. İki kəsən: MA · MB = MC · MD.",
      gen() {
        const kind = pick(["veter", "veter", "yari", "tk", "tk", "tkr", "iki"]);
        if (kind === "veter" || kind === "yari") {
          let a, b, c, e;
          if (kind === "veter") { do { a = rnd(2, 12); b = rnd(2, 12); c = pick(range(2, 15).filter(x => (a * b) % x === 0 && x !== a && x !== b)) || 0; e = c ? a * b / c : 0; } while (!c || e > 30 || Math.max(a, b, c, e) > 3.5 * Math.min(a, b, c, e)); }
          else { a = rnd(2, 12); do b = rnd(2, 16); while (b === a || Math.max(a, b) > 3.5 * Math.min(a, b)); }
          const half = kind === "yari", [hs, hv] = surd(1, 1, a * b);
          if (half) { c = e = hv; }
          const dd = Math.max(Math.abs(b - a), Math.abs(e - c)) / 2 + .3 * Math.sqrt(a * b) + .5;
          const cf = (b - a) / (2 * dd), cp = (e - c) / (2 * dd), sf = Math.sqrt(1 - cf * cf), sp = -Math.sqrt(1 - cp * cp);
          const E = [dd, 0], u = [cf, sf], w = [cp, sp];
          const P = { O: [0, 0], E, A: [dd + a * u[0], a * u[1]], B: [dd - b * u[0], -b * u[1]], C: [dd + c * w[0], c * w[1]], D: [dd - e * w[0], -e * w[1]] };
          const R = Math.sqrt(a * b + dd * dd);
          const svg = lab => figure(P, { circ: [["O", R]], cen: "O", names: ["A", "B", "C", "D", "E"], bis: { E: ["B", "D"] }, free: true, segs: [["A", "B", "acc"], ["C", "D", "acc"]], lab });
          if (!half) return { text: `AB və CD vətərləri E nöqtəsində kəsişir. AE = ${a}, EB = ${b}, CE = ${c}. ED-ni tap.`,
            svg: svg({ AE: String(a), EB: String(b), CE: String(c) }), answer: e, show: String(e), tol: 0.01,
            solution: `Kəsişən vətərlərin parçaları: AE · EB = CE · ED → ${a} · ${b} = ${c} · ED → ED = ${a * b} : ${c} = ${e}.` };
          const [cs, cv] = surd(2, 1, a * b);
          return { text: `AB və CD vətərləri E nöqtəsində kəsişir, AE = ${a}, EB = ${b}. E nöqtəsi CD vətərini yarıya bölür. CD-ni tap.`,
            svg: svg({ AE: String(a), EB: String(b) }), answer: cv, show: cs, placeholder: "məs. 12 və ya 4√5",
            solution: `CE = ED = x. AE · EB = CE · ED → x² = ${a} · ${b} = ${a * b}, x = ${hs}. CD = 2x = ${cs}.` };
        }
        // secant geometry: M = (d, 0), lines towards the circle
        const draw = (sec, tan, lab) => {
          const pw = sec[0][0] * sec[0][1], need = Math.max(...sec.map(s => (s[0] + s[1]) / 2));
          const d = need / Math.cos(rad(rnd(18, 30))), R = Math.sqrt(d * d - pw), P = { O: [0, 0], M: [d, 0] }, segs = [];
          sec.forEach(([n, f, N, F], i) => { const cf = (n + f) / (2 * d), sf = (i ? -1 : 1) * Math.sqrt(1 - cf * cf); P[N] = [d - n * cf, n * sf]; P[F] = [d - f * cf, f * sf]; segs.push(["M", F, "acc"]); });
          if (tan) { const ta = Math.acos(R / d), sgn = sec.length > 1 ? 1 : -1; P.T = [R * Math.cos(ta), sgn * R * Math.sin(ta)]; segs.push(["M", "T", "acc"]); }
          return figure(P, { circ: [["O", R]], cen: "O", names: Object.keys(P).filter(k => k !== "O"), free: true, segs, lab });
        };
        if (kind === "tk") {
          const a = rnd(2, 10), c = rnd(2, Math.min(16, 3 * a)), mb = a + c, [ts, tv] = surd(1, 1, a * mb);
          return { text: `M nöqtəsindən çevrəyə MT toxunanı və MAB kəsəni çəkilib (A M-ə yaxındır). MA = ${a}, AB = ${c}. MT-ni tap.`,
            svg: draw([[a, mb, "A", "B"]], true, { MA: String(a), AB: String(c), MT: "?" }), answer: tv, show: ts, placeholder: "məs. 6 və ya 2√7",
            solution: `MB = ${a} + ${c} = ${mb}. Toxunan və kəsən teoremi: MT² = MA · MB = ${a} · ${mb} = ${a * mb}, MT = ${ts}.` };
        }
        if (kind === "tkr") {
          let a, c, t; do { a = rnd(2, 12); c = rnd(2, 20); t = Math.sqrt(a * (a + c)); } while (t % 1 || c > 3 * a);
          const ask = pick(["AB", "MA"]);
          if (ask === "AB") return { text: `M nöqtəsindən çevrəyə MT toxunanı və MAB kəsəni çəkilib (A M-ə yaxındır). MT = ${t}, MA = ${a}. AB-ni tap.`,
            svg: draw([[a, a + c, "A", "B"]], true, { MA: String(a), MT: String(t), AB: "?" }), answer: c, show: String(c), tol: 0.01,
            solution: `MT² = MA · MB → ${t * t} = ${a} · MB → MB = ${(a + c)}. AB = MB − MA = ${a + c} − ${a} = ${c}.` };
          return { text: `M nöqtəsindən çevrəyə MT toxunanı və MAB kəsəni çəkilib (A M-ə yaxındır). MT = ${t}, AB = ${c}. MA-nı tap.`,
            svg: draw([[a, a + c, "A", "B"]], true, { MT: String(t), AB: String(c), MA: "?" }), answer: a, show: String(a), tol: 0.01,
            solution: `MA = x olsun, MB = x + ${c}. MT² = MA · MB: x(x + ${c}) = ${t * t} → x² + ${c}x − ${t * t} = 0. Müsbət kök x = ${a} (yoxla: ${a} · ${a + c} = ${t * t}).` };
        }
        let a, b, c, md; do { a = rnd(2, 10); b = rnd(2, 15); c = rnd(2, 12); md = a * (a + b) / c; } while (md % 1 || c === a || md <= c + 1 || md > 40 || b > 3 * a || md > 4 * c || md - c < Math.max(3, c / 2));
        return { text: `M nöqtəsindən çevrəyə MAB və MCD kəsənləri çəkilib (A və C M-ə yaxındır). MA = ${a}, AB = ${b}, MC = ${c}. CD-ni tap.`,
          svg: draw([[a, a + b, "A", "B"], [c, md, "C", "D"]], false, { MA: String(a), AB: String(b), MC: String(c), CD: "?" }), answer: md - c, show: String(md - c), tol: 0.01,
          solution: `MA · MB = MC · MD. MB = ${a} + ${b} = ${a + b}. ${a} · ${a + b} = ${c} · MD → MD = ${a * (a + b)} : ${c} = ${md}. CD = ${md} − ${c} = ${md - c}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Mətnli məsələ: çevrəni, diametri, toxunanı tap, sonra uyğun teoremi seç.",
      gen() {
        const t = pick(["korpu", "korpu", "hovuz", "sehne", "gol"]);
        if (t === "korpu") {
          let a, hh, R; do { hh = rnd(1, 8); a = rnd(hh + 1, 24); R = (a * a + hh * hh) / (2 * hh); } while (R % 1);
          return { text: `Körpünün tağı çevrə qövsüdür. Tağın uclarının arası ${2 * a} m, tağın ən yüksək nöqtəsi bu düz xətdən ${hh} m yuxarıdadır. Tağın çevrəsinin radiusu neçə metrdir?`,
            answer: R, show: R + " m", unit: "m", tol: 0.01,
            solution: `Uclar arasındakı vətər hündürlük xətti ilə yarıya bölünür: ${a} və ${a}. Hündürlük xətti diametrin bir hissəsidir: ${hh} və 2R − ${hh}. Kəsişən vətərlər: ${a} · ${a} = ${hh} · (2R − ${hh}) → 2R − ${hh} = ${a * a / hh} → R = ${R} m.` };
        }
        if (t === "hovuz") {
          const [p, q, c] = triple(50);
          return { text: `Dairəvi hovuzun diametri AB = ${c} m. Hovuzun kənarındakı C nöqtəsindən A-ya qədər ${p} m-dir. C-dən B-yə qədər düz xətt üzrə neçə metrdir?`,
            answer: q, show: q + " m", unit: "m", tol: 0.01,
            solution: `∠ACB diametrə söykənir, 90°-dir. CB = √(${c}² − ${p}²) = √${q * q} = ${q} m.` };
        }
        if (t === "sehne") {
          const x = pick(range(15, 80, 5));
          return { text: `Dairəvi meydançanın kənarında səhnə var — onun ucları A və B meydançanın çevrəsi üzərindədir. Böyük AB qövsü üzərində dayanan Elvin səhnəni ${x}° bucaq altında görür. Meydançanın mərkəzindən səhnə neçə dərəcəlik bucaq altında görünür?`,
            answer: 2 * x, show: 2 * x + "°", ...deg,
            solution: `Elvinin bucağı daxilə çəkilmiş bucaqdır, mərkəzdən görünən bucaq — eyni qövsə söykənən mərkəzi bucaq: 2 · ${x}° = ${2 * x}°.` };
        }
        const [p, q, c] = triple(60);
        return { text: `Dairəvi gölün radiusu ${p} m. Gölün mərkəzindən ${c} m aralıdakı ağacdan sahilə toxunan düz cığır çəkilib. Ağacdan toxunma nöqtəsinə qədər cığırın uzunluğu neçə metrdir?`,
          answer: q, show: q + " m", unit: "m", tol: 0.01,
          solution: `Toxunan radiusa perpendikulyardır: mərkəz, toxunma nöqtəsi və ağac düzbucaqlı üçbucaq əmələ gətirir. Cığır = √(${c}² − ${p}²) = √${q * q} = ${q} m.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const t = pick(["ins", "tan", "veter", "tk"]), bad = rnd(0, 2);
        let task, st, wrong, why;
        if (t === "ins") {
          const y = pick(range(40, 160, 10));
          task = `Məsələ: A, B, C çevrə üzərindədir, C böyük AB qövsündədir, O — mərkəz, ∠AOB = ${y}°. ∠ACB və ∠OAB-ni tap.`;
          st = [`∠ACB daxilə çəkilmiş bucaqdır və ∠AOB ilə eyni AB qövsünə söykənir.`, `∠ACB = ${y}° : 2 = ${y / 2}°.`, `OA = OB, ona görə ∠OAB = (180° − ${y}°) : 2 = ${(180 - y) / 2}°.`];
          wrong = [`∠ACB mərkəzi bucaqdır və ∠AOB ilə eyni AB qövsünə söykənir.`, `∠ACB = 2 · ${y}° = ${2 * y}°.`, `OA = OB, ona görə ∠OAB = 180° − ${y}° = ${180 - y}°.`];
          why = [`1-ci addımda səhv var: mərkəzi bucağın təpəsi mərkəzdədir; C çevrə üzərindədir, ∠ACB daxilə çəkilmiş bucaqdır.`, `2-ci addımda səhv var: daxilə çəkilmiş bucaq mərkəzi bucağın yarısıdır: ${y / 2}°.`, `3-cü addımda səhv var: bərabəryanlı üçbucağın oturacaq bucaqları ikisi birlikdə 180° − ${y}° edir, hər biri ${(180 - y) / 2}°.`];
        } else if (t === "tan") {
          const [p, q, c] = triple(30);
          task = `Məsələ: MT — çevrəyə toxunan, radius ${p}, mərkəzdən M-ə qədər ${c}. MT-ni tap.`;
          st = [`OT ⟂ MT, çünki toxunan toxunma nöqtəsinə çəkilmiş radiusa perpendikulyardır.`, `OM hipotenuzdur: MT² = ${c}² − ${p}² = ${q * q}.`, `MT = √${q * q} = ${q}.`];
          wrong = [`OT ∥ MT, çünki toxunan radiusa paraleldir.`, `MT² = ${c}² + ${p}² = ${c * c + p * p}.`, `MT = ${q * q} : 2 = ${fmt(q * q / 2)}.`];
          why = [`1-ci addımda səhv var: toxunan radiusa perpendikulyardır, paralel deyil.`, `2-ci addımda səhv var: OM hipotenuzdur, katet tapılanda kvadratlar çıxılır: ${c * c} − ${p * p} = ${q * q}.`, `3-cü addımda səhv var: kvadrat kök 2-yə bölmək deyil: √${q * q} = ${q}.`];
        } else if (t === "veter") {
          let a, b, c; do { a = rnd(2, 12); b = rnd(2, 12); c = rnd(2, 12); } while ((a * b) % c || c === a || c === b || a === b);
          task = `Məsələ: AB və CD vətərləri E-də kəsişir, AE = ${a}, EB = ${b}, CE = ${c}. ED-ni tap.`;
          st = [`Kəsişən vətərlər üçün AE · EB = CE · ED.`, `${a} · ${b} = ${c} · ED, yəni ${a * b} = ${c} · ED.`, `ED = ${a * b} : ${c} = ${a * b / c}.`];
          wrong = [`Kəsişən vətərlər üçün AE + EB = CE + ED.`, `${a} · ${b} = ${c} + ED, yəni ED = ${a * b} − ${c}.`, `ED = ${a * b} · ${c} = ${a * b * c}.`];
          why = [`1-ci addımda səhv var: vətər parçalarının cəmi yox, hasilləri bərabərdir.`, `2-ci addımda səhv var: sağ tərəf də hasildir: CE · ED, cəm yox.`, `3-cü addımda səhv var: ED-ni tapmaq üçün bölmək lazımdır: ${a * b} : ${c} = ${a * b / c}.`];
        } else {
          let a, mb; do { a = rnd(2, 9); mb = rnd(a + 2, 30); } while (Math.sqrt(a * mb) % 1);
          const tt = Math.sqrt(a * mb);
          task = `Məsələ: M-dən çevrəyə MT toxunanı və MAB kəsəni çəkilib, MA = ${a}, MB = ${mb}. MT-ni tap.`;
          st = [`Toxunan və kəsən teoremi: MT² = MA · MB.`, `MT² = ${a} · ${mb} = ${a * mb}.`, `MT = √${a * mb} = ${tt}.`];
          wrong = [`Toxunan və kəsən teoremi: MT² = MA · AB.`, `MT² = ${a} + ${mb} = ${a + mb}.`, `MT = ${a * mb} : 2 = ${fmt(a * mb / 2)}.`];
          why = [`1-ci addımda səhv var: kəsənin bütöv xarici parçası götürülür: MA · MB (AB yox).`, `2-ci addımda səhv var: hasil lazımdır: ${a} · ${mb} = ${a * mb}.`, `3-cü addımda səhv var: MT = √${a * mb} = ${tt}.`];
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
      key: "cevrede-bucaqlar", title: "Çevrədə bucaqlar, toxunan və kəsən", fenn: "riyaziyyat", link: "dersler/cevrede-bucaqlar.html",
      format: "Cavab — ədəd: bucaq (dərəcə ilə, ° yazmaq lazım deyil) və ya uzunluq. Kök: 2√7, kəsr: 13/2.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["merkezi", "merkezi", "diametr", "toxunan", "toxunan", "veter", "veter", "uzunluq", "uzunluq", "heyat"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/cevrede-bucaqlar.html")) b.push("dersler/cevrede-bucaqlar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
