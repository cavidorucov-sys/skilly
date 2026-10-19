// Üçbucaqda tənbölən və median, Stüart düsturu (olimpiada) — mastery game levels and the final test.
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

  const S = n => n < 0 ? "−" + (-n) : String(n);
  const sq = n => { const r = Math.round(Math.sqrt(n)); return r * r === n ? r : -1; };
  // triangle ABC with BC on the x axis (a = BC, b = AC, c = AB); D on BC with BD = d
  function tri(a, b, c, d) {
    const x = (a * a + c * c - b * b) / (2 * a), y = Math.sqrt(c * c - x * x), P = { B: [0, 0], C: [a, 0], A: [x, y] };
    if (d != null) P.D = [d, 0];
    return P;
  }
  const fig = (P, o) => figure(P, { circ: [], ...o });   // circ: [] → every named point gets a dot
  const alpha = [["A", "B", "D", "α", 22], ["A", "D", "C", "α", 22]];
  // bisector tables: AB : AC = p : q, AB = ps, AC = qs, BD = pr, DC = qr (r < s) — all integers
  const BIS = [], BIS2 = [];
  for (let p = 1; p <= 8; p++) for (let q = 1; q <= 8; q++) {
    if (p === q || gcd(p, q) !== 1) continue;
    for (let s = 2; s <= 9; s++) for (let r = 1; r < s; r++) {
      if (Math.abs(p - q) * s >= (p + q) * r) continue;                 // triangle inequality
      const e = { p, q, s, r, c: p * s, b: q * s, a: (p + q) * r, x: p * r, y: q * r }, v = sq(p * q * (s * s - r * r));
      BIS.push(e); if (v > 0) BIS2.push({ ...e, l: v });                // AD² = bc − xy = pq(s² − r²)
    }
  }
  // integer medians: 2b² + 2c² − a² = (2m)²
  const MED = [];
  for (let a = 2; a <= 30; a++) for (let b = 2; b <= 30; b++) for (let c = b; c <= 30; c++) {
    if (a >= b + c || b >= a + c || c >= a + b) continue;
    const v = sq(2 * b * b + 2 * c * c - a * a); if (v > 0 && v % 2 === 0) MED.push({ a, b, c, m: v / 2 });
  }
  // perpendicular medians from A and B: a² + b² = 5c²
  const ORT = [];
  for (let c = 3; c <= 60; c++) for (let a = 1; a <= 100; a++) { const b = sq(5 * c * c - a * a); if (b > 0 && a <= b && b - a < c && c < a + b) ORT.push({ a, b, c }); }
  // Stewart: D on BC, BD = m, DC = a − m, all integers incl. AD
  const STW = [];
  for (let a = 4; a <= 26; a++) for (let b = 3; b <= 26; b++) for (let c = 3; c <= 26; c++) {
    if (a >= b + c || b >= a + c || c >= a + b) continue;
    for (let m = 1; m < a; m++) { const num = b * b * m + c * c * (a - m); if (num % a) continue; const d = sq(num / a - m * (a - m)); if (d > 0) STW.push({ a, b, c, m, d }); }
  }
  const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [12, 16, 20], [7, 24, 25], [10, 24, 26]];
  const TD = "ABC üçbucağında AD — A bucağının tənböləni, D nöqtəsi BC tərəfindədir. ";

  const levels = [
    { id: "tenbolen", ad: "Tənbölən teoremi", izah: "AD tənböləndirsə, BD : DC = AB : AC. Bölünən parçalar yanındakı tərəflərə mütənasibdir.",
      gen() {
        const e = pick(BIS), { a, b, c, x, y } = e, kind = pick(["bd", "bd", "dc", "ac", "sum"]);
        const P = tri(a, b, c, x), base = { free: true, poly: ["A", "B", "C"], segs: [["A", "D", "acc"]], arcs: alpha, aria: "ABC üçbucağı, AD tənböləni" };
        if (kind === "bd") return { text: TD + `AB = ${c}, AC = ${b}, BC = ${a}. BD-ni tap.`, svg: fig(P, { ...base, lab: { AB: String(c), AC: String(b), BD: "?" } }), answer: x, show: String(x), tol: 0.01,
          solution: `Tənbölən teoremi: BD : DC = AB : AC = ${c} : ${b}. BC = ${a} bu nisbətdə bölünür: BD = ${a} · ${c}/${c + b} = ${x}.` };
        if (kind === "dc") return { text: TD + `AB = ${c}, AC = ${b}, BC = ${a}. DC-ni tap.`, svg: fig(P, { ...base, lab: { AB: String(c), AC: String(b), DC: "?" } }), answer: y, show: String(y), tol: 0.01,
          solution: `BD : DC = AB : AC = ${c} : ${b}. DC = BC · AC/(AB + AC) = ${a} · ${b}/${c + b} = ${y}.` };
        if (kind === "ac") return { text: TD + `AB = ${c}, BD = ${x}, DC = ${y}. AC-ni tap.`, svg: fig(P, { ...base, lab: { AB: String(c), AC: "?", BD: String(x), DC: String(y) } }), answer: b, show: String(b), tol: 0.01,
          solution: `BD : DC = AB : AC → ${x} : ${y} = ${c} : AC → AC = ${c} · ${y}/${x} = ${b}.` };
        return { text: TD + `BD = ${x}, DC = ${y}, AB + AC = ${b + c}. AB-ni tap.`, svg: fig(P, { ...base, lab: { AB: "?", BD: String(x), DC: String(y) } }), answer: c, show: String(c), tol: 0.01,
          solution: `AB : AC = BD : DC = ${x} : ${y}. AB + AC = ${b + c} bu nisbətdə bölünür: AB = ${b + c} · ${x}/${x + y} = ${c}.` };
      } },

    { id: "uzunluq", ad: "Tənbölənin uzunluğu", izah: "AD² = AB · AC − BD · DC. Əvvəl tənbölən teoremi ilə BD və DC-ni tap, sonra düsturu tətbiq et.",
      gen() {
        if (Math.random() < .22) {                                           // bisector from a known angle, by areas
          const A = pick([60, 90, 120]), n = { 60: 3, 90: 2, 120: 1 }[A];
          let b, c, str, val; do { b = rnd(2, 18); c = rnd(2, 18); [str, val] = surd(b * c, b + c, n); } while (b === c || gcd(b * c, b + c) < (b + c) / 6);
          const th = A * Math.PI / 180, PA = { A: [0, 0], B: [c, 0], C: [b * Math.cos(th), b * Math.sin(th)] }; PA.D = [PA.B[0] + (PA.C[0] - PA.B[0]) * c / (b + c), PA.B[1] + (PA.C[1] - PA.B[1]) * c / (b + c)];
          const cs = { 60: "cos 30° = √3/2", 90: "cos 45° = √2/2", 120: "cos 60° = 1/2" }[A];
          return { text: `ABC üçbucağında AB = ${c}, AC = ${b}, ∠A = ${A}°. AD — A bucağının tənböləni (D BC üzərindədir). AD-ni tap.`,
            svg: fig(PA, { free: true, poly: ["A", "B", "C"], segs: [["A", "D", "acc"]], arcs: [["A", "B", "C", A + "°", 20]], lab: { AB: String(c), AC: String(b), AD: ["?", .6] }, aria: "Bucağı məlum üçbucaq və tənbölən" }),
            answer: val, show: str, tol: 0.005,
            solution: `S(ABC) = S(ABD) + S(ADC): 1/2·${b}·${c}·sin ${A}° = 1/2·${c}·l·sin ${A / 2}° + 1/2·${b}·l·sin ${A / 2}°. sin ${A}° = 2·sin ${A / 2}°·cos ${A / 2}° yazıb ixtisar etsək: l = 2·${b}·${c}·cos ${A / 2}°/(${b} + ${c}) (${cs}). l = ${str}.` };
        }
        const e = pick(BIS2), { a, b, c, x, y, l } = e, kind = pick(["formula", "formula", "xy", "prod"]);
        const P = tri(a, b, c, x), base = { free: true, poly: ["A", "B", "C"], segs: [["A", "D", "acc"]], arcs: alpha, aria: "ABC üçbucağı, AD tənböləni" };
        if (kind === "formula") return { text: TD + `AB = ${c}, AC = ${b}, BC = ${a}. AD-ni tap.`, svg: fig(P, { ...base, lab: { AB: String(c), AC: String(b), AD: ["?", .6] } }), answer: l, show: String(l), tol: 0.01,
          solution: `BD = ${a} · ${c}/${b + c} = ${x}, DC = ${a} − ${x} = ${y}. AD² = AB · AC − BD · DC = ${c} · ${b} − ${x} · ${y} = ${b * c - x * y}, AD = ${l}.` };
        if (kind === "xy") return { text: TD + `AB = ${c}, BD = ${x}, DC = ${y}. AD-ni tap.`, svg: fig(P, { ...base, lab: { AB: String(c), BD: String(x), DC: String(y), AD: ["?", .6] } }), answer: l, show: String(l), tol: 0.01,
          solution: `BD : DC = AB : AC → AC = ${c} · ${y}/${x} = ${b}. AD² = AB · AC − BD · DC = ${c} · ${b} − ${x} · ${y} = ${b * c - x * y}, AD = ${l}.` };
        return { text: TD + `AD = ${l}, BD = ${x}, DC = ${y}. AB · AC hasilini tap.`, svg: fig(P, { ...base, lab: { AD: [String(l), .6], BD: String(x), DC: String(y) } }), answer: l * l + x * y, show: String(l * l + x * y), tol: 0.01,
          solution: `AD² = AB · AC − BD · DC → AB · AC = AD² + BD · DC = ${l * l} + ${x * y} = ${l * l + x * y}.` };
      } },

    { id: "median", ad: "Median və ağırlıq mərkəzi", izah: "Median düsturu: AM² = (2AB² + 2AC² − BC²)/4. Medianlar kəsişmə nöqtəsində 2 : 1 nisbətində bölünür. Perpendikulyar medianlarda a² + b² = 5c².",
      gen() {
        const kind = pick(["mlen", "mlen", "side", "ort", "ort", "hyp", "g"]);
        if (kind === "mlen" || kind === "side") {
          const e = pick(MED), { a, b, c, m } = e, sw = Math.random() < .5, B = sw ? c : b, C = sw ? b : c;
          const P = tri(a, B, C); P.M = [a / 2, 0];
          const base = { free: true, poly: ["A", "B", "C"], segs: [["A", "M", "acc"]], aria: "ABC üçbucağı, AM medianı" };
          const T = "ABC üçbucağında AM — median (M — BC-nin orta nöqtəsi). ";
          if (kind === "mlen") return { text: T + `AB = ${C}, AC = ${B}, BC = ${a}. AM-i tap.`, svg: fig(P, { ...base, lab: { AB: String(C), AC: String(B), BC: String(a), AM: ["?", .6] } }), answer: m, show: String(m), tol: 0.01,
            solution: `AM² = (2 · AB² + 2 · AC² − BC²)/4 = (2 · ${C * C} + 2 · ${B * B} − ${a * a})/4 = ${2 * B * B + 2 * C * C - a * a}/4 = ${m * m}. AM = ${m}.` };
          return { text: T + `AB = ${C}, AC = ${B}, AM = ${m}. BC-ni tap.`, svg: fig(P, { ...base, lab: { AB: String(C), AC: String(B), AM: [String(m), .6], BC: "?" } }), answer: a, show: String(a), tol: 0.01,
            solution: `4 · AM² = 2 · AB² + 2 · AC² − BC² → BC² = 2 · ${C * C} + 2 · ${B * B} − 4 · ${m * m} = ${a * a}. BC = ${a}.` };
        }
        if (kind === "ort") {
          const e = pick(ORT), { a, b, c } = e, ask = pick(["c", "c", "a", "b"]);
          const P = tri(a, b, c); P.M = [a / 2, 0]; P.K = [(P.A[0] + a) / 2, P.A[1] / 2]; P.G = [(P.A[0] + a) / 3, P.A[1] / 3];
          const vals = { a, b, c }, NM = { a: "BC", b: "AC", c: "AB" }, lab = {};
          for (const k of ["a", "b", "c"]) lab[NM[k]] = k === ask ? "?" : String(vals[k]);
          const ans = vals[ask], giv = ["a", "b", "c"].filter(k => k !== ask).map(k => `${NM[k]} = ${vals[k]}`).join(", ");
          return { text: `ABC üçbucağında AM və BK medianları G nöqtəsində perpendikulyardır (M — BC-nin, K — AC-nin orta nöqtəsi). ${giv}. ${NM[ask]}-ni tap.`,
            svg: fig(P, { free: true, poly: ["A", "B", "C"], segs: [["A", "M", "acc"], ["B", "K", "acc"]], right: [["G", "A", "B"]], lab, aria: "Perpendikulyar medianlar" }),
            answer: ans, show: String(ans), tol: 0.01,
            solution: `AG = 2/3 · AM, BG = 2/3 · BK və ∠AGB = 90° olduğundan AG² + BG² = AB². Median düsturlarını qoysaq: BC² + AC² = 5 · AB². ` +
              { c: `AB² = (${a * a} + ${b * b})/5 = ${c * c}, AB = ${c}.`, a: `BC² = 5 · ${c * c} − ${b * b} = ${a * a}, BC = ${a}.`, b: `AC² = 5 · ${c * c} − ${a * a} = ${b * b}, AC = ${b}.` }[ask] };
        }
        if (kind === "hyp") {
          const [p, q, h] = pick(TRI), P = { C: [0, 0], B: [p, 0], A: [0, q], M: [p / 2, q / 2] };
          return { text: `Düzbucaqlı ABC üçbucağında ∠C = 90°, AC = ${q}, BC = ${p}. CM — hipotenuza çəkilmiş median. CM-i tap.`,
            svg: fig(P, { free: true, poly: ["A", "B", "C"], segs: [["C", "M", "acc"]], right: [["C", "A", "B"]], lab: { AC: String(q), CB: String(p), CM: ["?", .55] }, aria: "Hipotenuza çəkilmiş median" }),
            answer: h / 2, show: frac(h, 2), tol: 0.01,
            solution: `Median düsturu: CM² = (2 · AC² + 2 · BC² − AB²)/4. Pifaqora görə AC² + BC² = AB², ona görə CM² = AB²/4, yəni CM = AB/2. AB = √(${q * q} + ${p * p}) = ${h}, CM = ${frac(h, 2)}.` };
        }
        const u = rnd(2, 12), ask = pick(["AG", "AM", "GM"]), P = { B: [0, 0], C: [6, 0], A: [2, 5], M: [3, 0], G: [8 / 3, 5 / 3] };
        const val = { AG: 2 * u, AM: 3 * u, GM: u }, giv = pick(["AG", "AM", "GM"].filter(k => k !== ask)), lab = {};
        for (const k of [ask, giv]) lab[k] = [k === ask ? "?" : String(val[k]), k === "AM" ? .12 : .5];
        return { text: `ABC üçbucağında AM — median, G — medianların kəsişmə nöqtəsidir. ${giv} = ${val[giv]}. ${ask}-ni tap.`,
          svg: fig(P, { free: true, poly: ["A", "B", "C"], segs: [["A", "M", "acc"]], lab, aria: "Ağırlıq mərkəzi" }),
          answer: val[ask], show: String(val[ask]), tol: 0.01,
          solution: `Medianlar kəsişmə nöqtəsində təpədən saymaqla 2 : 1 nisbətində bölünür: AG : GM = 2 : 1, AM = 3 · GM. ${giv} = ${val[giv]} olduğundan GM = ${u}, AG = ${2 * u}, AM = ${3 * u}. ${ask} = ${val[ask]}.` };
      } },

    { id: "stuart", ad: "Stüart düsturu", izah: "D nöqtəsi BC üzərindədir: AB² · DC + AC² · BD = BC · (AD² + BD · DC).",
      gen() {
        const kind = pick(["ad", "ad", "ab", "iso", "iso"]);
        if (kind === "iso") {
          const c = rnd(5, 20), m = rnd(1, c), n = rnd(1, 2 * c - 1 - m), a = m + n, v = c * c - m * n, [str, val] = surd(1, 1, v);
          const P = tri(a, c, c, m);
          return { text: `ABC üçbucağında AB = AC = ${c}, BC = ${a}. D nöqtəsi BC üzərindədir, BD = ${m}, DC = ${n}. AD-ni tap.`,
            svg: fig(P, { free: true, poly: ["A", "B", "C"], segs: [["A", "D", "acc"]], lab: { AB: String(c), AC: String(c), BD: String(m), DC: String(n), AD: ["?", .6] }, aria: "Bərabəryanlı üçbucaq, AD parçası" }),
            answer: val, show: str, tol: 0.01,
            solution: `Stüart düsturunda AB = AC = ${c}: ${c}² · (${n} + ${m}) = ${a} · (AD² + ${m * n}) → AD² = ${c * c} − ${m} · ${n} = ${v}. AD = ${str}.` };
        }
        const { a, b, c, m, d } = pick(STW), n = a - m, P = tri(a, b, c, m);
        const base = { free: true, poly: ["A", "B", "C"], segs: [["A", "D", "acc"]], aria: "ABC üçbucağı, D nöqtəsi BC üzərində" };
        const T = `ABC üçbucağında D nöqtəsi BC tərəfi üzərindədir. `, tot = c * c * n + b * b * m;
        if (kind === "ad") return { text: T + `AB = ${c}, AC = ${b}, BC = ${a}, BD = ${m}. AD-ni tap.`, svg: fig(P, { ...base, lab: { AB: String(c), AC: String(b), BD: String(m), DC: String(n), AD: ["?", .6] } }), answer: d, show: String(d), tol: 0.01,
          solution: `DC = ${a} − ${m} = ${n}. Stüart: AB² · DC + AC² · BD = ${c * c} · ${n} + ${b * b} · ${m} = ${tot} = BC · (AD² + BD · DC) = ${a} · (AD² + ${m * n}). Deməli AD² + ${m * n} = ${tot / a}, AD² = ${d * d}, AD = ${d}.` };
        return { text: T + `AC = ${b}, BC = ${a}, BD = ${m}, AD = ${d}. AB-ni tap.`, svg: fig(P, { ...base, lab: { AB: "?", AC: String(b), BD: String(m), DC: String(n), AD: [String(d), .6] } }), answer: c, show: String(c), tol: 0.01,
          solution: `DC = ${a} − ${m} = ${n}. Stüart: AB² · ${n} + ${b * b} · ${m} = ${a} · (${d * d} + ${m * n}) = ${a * (d * d + m * n)}. AB² · ${n} = ${a * (d * d + m * n) - b * b * m}, AB² = ${c * c}, AB = ${c}.` };
      } },

    { id: "merkez", ad: "Daxilə çəkilmiş çevrənin mərkəzi", izah: "I — tənbölənlərin kəsişməsidir. AI : ID = (AB + AC) : BC. I-dən BC-yə paralel xətt AB və AC-ni M, N-də kəsirsə, MN = BM + CN.",
      gen() {
        const kind = pick(["ratio", "ai", "mn", "mn"]);
        const e = kind === "ai" ? pick(BIS2) : pick(BIS), { a, b, c, x } = e;
        const P = tri(a, b, c, x), per = a + b + c;
        const I = [(a * P.A[0] + c * a) / per, (a * P.A[1]) / per];
        const T = `ABC üçbucağında AB = ${c}, AC = ${b}, BC = ${a}. AD — tənbölən (D BC üzərindədir), I — daxilə çəkilmiş çevrənin mərkəzidir. `;
        const sol1 = `BI — B bucağının tənböləni; ABD üçbucağında tənbölən teoremi: AI : ID = AB : BD. BD = ${a} · ${c}/${b + c} = ${x}, deməli AI : ID = ${c} : ${x} = ${b + c} : ${a}.`;
        P.I = I;
        if (kind === "ratio") return { text: T + `AI : ID nisbətini tap (ədəd kimi).`, svg: fig(P, { free: true, poly: ["A", "B", "C"], segs: [["A", "D", "acc"], ["B", "I", "dash"]], lab: { AB: String(c), AC: String(b), BC: String(a) }, aria: "Daxilə çəkilmiş çevrənin mərkəzi I" }),
          answer: (b + c) / a, show: frac(b + c, a), tol: 0.005, solution: sol1 + ` AI/ID = ${frac(b + c, a)}.` };
        if (kind === "ai") { const l = e.l;
          return { text: T + `AI-ni tap.`, svg: fig(P, { free: true, poly: ["A", "B", "C"], segs: [["A", "D", "acc"], ["B", "I", "dash"]], lab: { AB: String(c), AC: String(b), BC: String(a), AI: ["?", .4] }, aria: "Daxilə çəkilmiş çevrənin mərkəzi I" }),
            answer: l * (b + c) / per, show: frac(l * (b + c), per), tol: 0.005,
            solution: `AD² = AB · AC − BD · DC = ${c} · ${b} − ${e.x} · ${e.y} = ${l * l}, AD = ${l}. ` + sol1 + ` AI = AD · (AB + AC)/(AB + AC + BC) = ${l} · ${b + c}/${per} = ${frac(l * (b + c), per)}.` }; }
        const t = I[1] / P.A[1]; P.M = [P.A[0] * t, P.A[1] * t]; P.N = [a + (P.A[0] - a) * t, P.A[1] * t];
        return { text: `ABC üçbucağında AB = ${c}, AC = ${b}, BC = ${a}. I — daxilə çəkilmiş çevrənin mərkəzidir. I-dən BC-yə paralel çəkilmiş düz xətt AB-ni M, AC-ni N nöqtəsində kəsir. MN-i tap.`,
          svg: fig(P, { free: true, poly: ["A", "B", "C"], segs: [["M", "N", "acc"], ["B", "I", "dash"], ["C", "I", "dash"]], lab: { AB: String(c), AC: String(b), BC: String(a), MN: ["?", .5] }, aria: "I-dən BC-yə paralel MN" }),
          answer: a * (b + c) / per, show: frac(a * (b + c), per), tol: 0.005,
          solution: `∠MBI = ∠IBC (BI tənböləndir) və ∠IBC = ∠MIB (MN ∥ BC, çarpaz bucaqlar), deməli MB = MI. Eyni ilə NC = NI. AMN üçbucağının perimetri AM + MI + IN + NA = AM + MB + CN + NA = AB + AC = ${b + c}. AMN ~ ABC (MN ∥ BC), perimetrlər nisbəti oxşarlıq əmsalıdır: MN/BC = ${b + c}/${per}. MN = ${a} · ${b + c}/${per} = ${frac(a * (b + c), per)}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Məsələni üçbucağa çevir: tənbölən, median və ya Stüart düsturu.",
      gen() {
        const kind = pick(["bag", "kabel", "mayak"]);
        if (kind === "bag") { const { a, b, c, x } = pick(BIS);
          return { text: `Üçbucaq formalı bağın künclərinin adları A, B, C-dir: AB = ${c} m, AC = ${b} m, BC = ${a} m. A küncündən BC sərhədinə elə düz cığır çəkilir ki, o, A küncünün bucağını yarıya bölür. Cığır sərhədə B küncündən neçə metr məsafədə çatır?`, answer: x, unit: "m", show: String(x), tol: 0.01,
            solution: `Cığır tənböləndir: BD : DC = AB : AC = ${c} : ${b}. BD = ${a} · ${c}/${b + c} = ${x} m.` }; }
        if (kind === "kabel") { const { a, b, c, m } = pick(MED);
          return { text: `Üçbucaq formalı meydançanın tərəfləri ${a} m, ${b} m və ${c} m-dir. ${a} m-lik tərəfin qarşısındakı təpədən həmin tərəfin orta nöqtəsinə kabel çəkilir. Kabelin uzunluğu neçə metrdir?`, answer: m, unit: "m", show: String(m), tol: 0.01,
            solution: `Kabel medianın özüdür: m² = (2 · ${b}² + 2 · ${c}² − ${a}²)/4 = ${2 * b * b + 2 * c * c - a * a}/4 = ${m * m}. m = ${m} m.` }; }
        const { a, b, c, m, d } = pick(STW);
        return { text: `Düz sahil xətti üzərində B və C limanları var, aralarında ${a} km. Dənizdəki A adasından B-yə qədər ${c} km, C-yə qədər ${b} km-dir. Sahildə B-dən ${m} km aralıda D məntəqəsi yerləşir. Adadan D məntəqəsinə düz məsafə neçə kilometrdir?`, answer: d, unit: "km", show: String(d), tol: 0.01,
          solution: `Stüart düsturu (AB² · DC + AC² · BD = BC · (AD² + BD · DC)): ${c * c} · ${a - m} + ${b * b} · ${m} = ${a} · (AD² + ${m * (a - m)}). Sol tərəf ${c * c * (a - m) + b * b * m}, onda AD² + ${m * (a - m)} = ${(c * c * (a - m) + b * b * m) / a}, AD² = ${d * d}, AD = ${d} km.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2);
        if (Math.random() < .5) {
          const { a, b, c, x } = pick(BIS), per = b + c;
          const st = [`AD tənböləndir: BD : DC = AB : AC = ${c} : ${b}.`, `BD = BC · AB/(AB + AC) = ${a} · ${c}/${per}.`, `BD = ${a * c}/${per} = ${x}.`];
          if (bad === 0) st[0] = `AD tənböləndir: BD : DC = AC : AB = ${b} : ${c}.`;
          if (bad === 1) st[1] = `BD = BC · AB/(AB − AC) = ${a} · ${c}/${Math.abs(c - b)}.`;
          if (bad === 2) st[2] = `BD = ${a * c}/${per} = ${x + pick([-1, 1]) * rnd(1, 2)}.`;
          const why = [`1-ci addım səhvdir: tənbölən teoremində BD : DC = AB : AC (BD B təpəsinə yaxındır, AB ilə nisbətdədir). Düz cavab BD = ${x}.`,
            `2-ci addım səhvdir: BD = BC · AB/(AB + AC), məxrəcdə cəm olmalıdır, fərq yox. Düz cavab BD = ${x}.`,
            `3-cü addım səhvdir: ${a * c} : ${per} = ${x}. Düz cavab BD = ${x}.`][bad];
          return { text: steps(`ABC üçbucağında AB = ${c}, AC = ${b}, BC = ${a}, AD — tənbölən. BD-ni tapırıq.`, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
        }
        const { a, b, c, m } = pick(MED), N = 2 * b * b + 2 * c * c - a * a;
        const st = [`Median düsturu: AM² = (2 · AB² + 2 · AC² − BC²)/4.`, `AM² = (2 · ${c * c} + 2 · ${b * b} − ${a * a})/4 = ${N}/4 = ${m * m}.`, `AM = √${m * m} = ${m}.`];
        if (bad === 0) st[0] = pick([`Median düsturu: AM² = (AB² + AC² − BC²)/4.`, `Median düsturu: AM² = (2 · AB² + 2 · AC² + BC²)/4.`]);
        if (bad === 1) st[1] = `AM² = (2 · ${c * c} + 2 · ${b * b} − ${a * a})/4 = ${N}/4 = ${m * m + pick([-1, 1]) * rnd(1, 3)}.`;
        if (bad === 2) st[2] = pick([`AM = ${m * m}.`, `AM = ${m * m}/2 = ${frac(m * m, 2)}.`]);
        const why = [`1-ci addım səhvdir: düz düstur AM² = (2 · AB² + 2 · AC² − BC²)/4. Düz cavab AM = ${m}.`,
          `2-ci addım səhvdir: ${N} : 4 = ${N / 4}. Düz cavab AM = ${m}.`,
          `3-cü addım səhvdir: AM² = ${m * m} olduğundan kökü almaq lazımdır. Düz cavab AM = ${m}.`][bad];
        return { text: steps(`ABC üçbucağında AB = ${c}, AC = ${b}, BC = ${a}, AM — median. AM-i tapırıq.`, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-tenbolen-median", title: "Üçbucaqda tənbölən və median, Stüart düsturu", fenn: "olimpiada", link: "dersler/ol-tenbolen-median.html",
      format: "Cavab ədəddir: tam 6, kəsr 15/4 (onluq 3.75 də olar), kök √145 və ya 3√5.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["tenbolen","tenbolen","uzunluq","median","median","stuart","stuart","merkez","heyat","sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-tenbolen-median.html")) b.push("dersler/ol-tenbolen-median.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
