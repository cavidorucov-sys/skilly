// Çeva və Menelay teoremləri (olimpiada) — mastery game levels and the final test.
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

  // ---- triangle ABC with points F ∈ AB, D ∈ BC, E ∈ CA (all as vectors in math coordinates)
  const lerp = (X, Y, t) => [X[0] + t * (Y[0] - X[0]), X[1] + t * (Y[1] - X[1])];
  const meet = (a, b, c, d) => { const den = (a[0] - b[0]) * (c[1] - d[1]) - (a[1] - b[1]) * (c[0] - d[0]); const t = ((a[0] - c[0]) * (c[1] - d[1]) - (a[1] - c[1]) * (c[0] - d[0])) / den; return [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]; };
  const randTri = () => ({ A: [0, 0], B: [6, 0], C: [rnd(15, 45) / 10, rnd(35, 50) / 10] });
  const fr = (p, q) => frac(p, q);
  const TF = (P, extra) => figure(P, { free: true, poly: ["A", "B", "C"], ...extra });
  // ratio "p : q" in lowest terms
  const rt = (p, q) => { const g = gcd(p, q); return `${p / g} : ${q / g}`; };

  const levels = [
    { id: "menelay", ad: "Menelay teoremi", izah: "Düz xətt ABC üçbucağının AB və CA tərəflərini F və E nöqtələrində, BC tərəfinin davamını D nöqtəsində kəsir. Onda (AF/FB) · (BD/DC) · (CE/EA) = 1.",
      gen() {
        const T = randTri(), m1 = rnd(1, 5), n1 = rnd(1, 5), m3 = rnd(1, 5), n3 = rnd(1, 5), r = (n1 * n3) / (m1 * m3);
        if (r === 1 || n1 * n3 > 25 || m1 * m3 > 25) return levels[0].gen();
        const F = lerp(T.A, T.B, m1 / (m1 + n1)), E = lerp(T.C, T.A, m3 / (m3 + n3)), t = r > 1 ? r / (r - 1) : -r / (1 - r), D = lerp(T.B, T.C, t);
        const P = { ...T, F, E, D };
        // draw the line through its two extreme points
        const pts = [F, E, D], key = ["F", "E", "D"], s = pts.map(p => (p[0] - F[0]) * (D[0] - F[0]) + (p[1] - F[1]) * (D[1] - F[1]));
        const lo = s.indexOf(Math.min(...s)), hi = s.indexOf(Math.max(...s));
        const svg = TF(P, { segs: [[key[lo], key[hi], "acc"]], names: ["A", "B", "C", "D", "E", "F"] });
        const p = n1 * n3, q = m1 * m3, g = gcd(p, q);
        const ask = pick(["D", "F", "E"]);
        const stA = `AF : FB = ${m1} : ${n1}`, stB = `BD : DC = ${rt(p, q)}`, stC = `CE : EA = ${m3} : ${n3}`;
        const head = `Düz xətt ABC üçbucağının AB və CA tərəflərini F və E nöqtələrində, BC tərəfinin davamını D nöqtəsində kəsir.`;
        const formula = `Menelay: (AF/FB) · (BD/DC) · (CE/EA) = 1.`;
        if (ask === "D") return { text: `${head} ${stA}, ${stC}. BD / DC nisbətini tap.`, svg, answer: r, show: fr(p, q),
          solution: `${formula} (${m1}/${n1}) · (BD/DC) · (${m3}/${n3}) = 1 → BD/DC = ${n1} · ${n3} / (${m1} · ${m3}) = ${p}/${q}${g > 1 ? " = " + fr(p, q) : ""}.` };
        if (ask === "F") return { text: `${head} ${stB}, ${stC}. AF / FB nisbətini tap.`, svg, answer: m1 / n1, show: fr(m1, n1),
          solution: `${formula} (AF/FB) · (${p / g}/${q / g}) · (${m3}/${n3}) = 1 → AF/FB = (${q / g} · ${n3}) / (${p / g} · ${m3}) = ${q / g * n3}/${p / g * m3} = ${fr(m1, n1)}.` };
        return { text: `${head} ${stA}, ${stB}. CE / EA nisbətini tap.`, svg, answer: m3 / n3, show: fr(m3, n3),
          solution: `${formula} (${m1}/${n1}) · (${p / g}/${q / g}) · (CE/EA) = 1 → CE/EA = (${n1} · ${q / g}) / (${m1} · ${p / g}) = ${n1 * q / g}/${m1 * p / g} = ${fr(m3, n3)}.` };
      } },

    { id: "ceva", ad: "Çeva teoremi", izah: "AD, BE, CF bir nöqtədə kəsişərsə (AF/FB) · (BD/DC) · (CE/EA) = 1. Tərsi də doğrudur: bərabərlik ödənərsə, üç düz xətt bir nöqtədə kəsişir.",
      gen() {
        const kind = pick(["ratio", "ratio", "ratio", "param"]), T = randTri();
        if (kind === "param") {
          let m1, n1, m3, n3, n2, x, tries = 0;
          do { m1 = rnd(1, 5); n1 = rnd(1, 5); m3 = rnd(1, 5); n3 = rnd(1, 5); n2 = rnd(1, 6); x = n1 * n2 * n3 / (m1 * m3); tries++; } while ((x % 1 || x < 1 || x > 12 || x === n2) && tries < 500);
          if (x % 1 || x < 1 || x > 12) return levels[1].gen();
          const F = lerp(T.A, T.B, m1 / (m1 + n1)), D = lerp(T.B, T.C, x / (x + n2)), E = lerp(T.C, T.A, m3 / (m3 + n3));
          const P = { ...T, F, D, E };
          return { text: `ABC üçbucağının AB, BC, CA tərəfləri üzərində F, D, E nöqtələri götürülüb: AF : FB = ${m1} : ${n1}, BD : DC = x : ${n2}, CE : EA = ${m3} : ${n3}. AD, BE, CF düz xətləri bir nöqtədə kəsişirsə, x-i tap.`,
            svg: TF(P, { segs: [["A", "D", "acc"], ["B", "E", "acc"], ["C", "F", "acc"]], names: ["A", "B", "C", "D", "E", "F"] }), answer: x, show: String(x), tol: 0.01,
            solution: `Çevanın tərsi: bir nöqtədə kəsişmə üçün (AF/FB) · (BD/DC) · (CE/EA) = 1. (${m1}/${n1}) · (x/${n2}) · (${m3}/${n3}) = 1 → x = ${n1} · ${n2} · ${n3} / (${m1} · ${m3}) = ${x}.` };
        }
        let m1, n1, m2, n2;
        do { m1 = rnd(1, 5); n1 = rnd(1, 5); m2 = rnd(1, 5); n2 = rnd(1, 5); } while (n1 * n2 > 25 || m1 * m2 > 25);
        const p = n1 * n2, q = m1 * m2, g = gcd(p, q), pp = p / g, qq = q / g;
        const F = lerp(T.A, T.B, m1 / (m1 + n1)), D = lerp(T.B, T.C, m2 / (m2 + n2)), E = lerp(T.C, T.A, pp / (pp + qq));
        const P = { ...T, F, D, E, O: meet(T.A, D, T.B, E) };
        const svg = TF(P, { segs: [["A", "D", "acc"], ["B", "E", "acc"], ["C", "F", "acc"]], names: ["A", "B", "C", "D", "E", "F", "O"] });
        const s1 = `AF : FB = ${m1} : ${n1}`, s2 = `BD : DC = ${m2} : ${n2}`, s3 = `CE : EA = ${pp} : ${qq}`, ask = pick([0, 1, 2]);
        const head = `ABC üçbucağında AD, BE, CF düz xətləri bir nöqtədə kəsişir (F ∈ AB, D ∈ BC, E ∈ CA).`;
        if (ask === 2) return { text: `${head} ${s1}, ${s2}. CE / EA nisbətini tap.`, svg, answer: pp / qq, show: fr(pp, qq),
          solution: `Çeva: (AF/FB) · (BD/DC) · (CE/EA) = 1. (${m1}/${n1}) · (${m2}/${n2}) · (CE/EA) = 1 → CE/EA = ${n1} · ${n2} / (${m1} · ${m2}) = ${p}/${q}${g > 1 ? " = " + fr(p, q) : ""}.` };
        if (ask === 1) return { text: `${head} ${s1}, ${s3}. BD / DC nisbətini tap.`, svg, answer: m2 / n2, show: fr(m2, n2),
          solution: `Çeva: (${m1}/${n1}) · (BD/DC) · (${pp}/${qq}) = 1 → BD/DC = ${n1} · ${qq} / (${m1} · ${pp}) = ${n1 * qq}/${m1 * pp} = ${fr(m2, n2)}.` };
        return { text: `${head} ${s2}, ${s3}. AF / FB nisbətini tap.`, svg, answer: m1 / n1, show: fr(m1, n1),
          solution: `Çeva: (AF/FB) · (${m2}/${n2}) · (${pp}/${qq}) = 1 → AF/FB = ${n2} · ${qq} / (${m2} · ${pp}) = ${n2 * qq}/${m2 * pp} = ${fr(m1, n1)}.` };
      } },

    { id: "iki", ad: "İki çevianın kəsişməsi", izah: "AD və BE kəsişəndə AP : PD və BP : PE nisbətlərini Menelay ilə (və ya kütlə nöqtələri ilə) tapırlar. BD : DC = m : n, AE : EC = k : l olarsa, AP / PD = k(m + n) / (m · l).",
      gen() {
        const T = randTri();
        let m, n, k, l; do { m = rnd(1, 5); n = rnd(1, 5); k = rnd(1, 5); l = rnd(1, 5); } while (m === n && k === l);
        const D = lerp(T.B, T.C, m / (m + n)), E = lerp(T.A, T.C, k / (k + l)), P0 = meet(T.A, D, T.B, E);
        const svg = TF({ ...T, D, E, P: P0 }, { segs: [["A", "D", "acc"], ["B", "E", "acc"]], names: ["A", "B", "C", "D", "E", "P"] });
        const head = `ABC üçbucağında D nöqtəsi BC üzərindədir, BD : DC = ${m} : ${n}; E nöqtəsi AC üzərindədir, AE : EC = ${k} : ${l}. AD və BE parçaları P nöqtəsində kəsişir.`;
        const ask = pick(["AP", "AP", "BP"]);
        if (ask === "AP") { const p = k * (m + n), q = m * l, g = gcd(p, q);
          return { text: `${head} AP : PD nisbətini (AP / PD kəsr kimi) tap.`, svg, answer: p / q, show: fr(p, q),
            solution: `ADC üçbucağına B, P, E düz xətti ilə Menelay: (AP/PD) · (DB/BC) · (CE/EA) = 1. DB/BC = ${m}/${m + n}, CE/EA = ${l}/${k}. AP/PD = (${m + n}/${m}) · (${k}/${l}) = ${p}/${q}${g > 1 ? " = " + fr(p, q) : ""}.` }; }
        const p = m * (k + l), q = n * k, g = gcd(p, q);
        return { text: `${head} BP : PE nisbətini (BP / PE kəsr kimi) tap.`, svg, answer: p / q, show: fr(p, q),
          solution: `BEC üçbucağına A, P, D düz xətti ilə Menelay: (BP/PE) · (EA/AC) · (CD/DB) = 1. EA/AC = ${k}/${k + l}, CD/DB = ${n}/${m}. BP/PE = ((${k + l})/${k}) · (${m}/${n}) = ${p}/${q}${g > 1 ? " = " + fr(p, q) : ""}.` };
      } },

    { id: "aubel", ad: "Van Aubel nisbəti", izah: "AD, BE, CF bir nöqtədə (O) kəsişirsə: AO / OD = AF/FB + AE/EC. Tənbölənlər üçün AO / OD = (b + c) / a.",
      gen() {
        const kind = pick(["ao", "ao", "ters", "tenbol", "tenbol"]);
        if (kind === "tenbol") {
          let a, b, c; do { a = rnd(4, 14); b = rnd(4, 14); c = rnd(4, 14); } while (a + b <= c + 1 || b + c <= a + 1 || a + c <= b + 1 || (a === b && b === c));
          const x = (a * a + c * c - b * b) / (2 * a), P = { B: [0, 0], C: [a, 0], A: [x, Math.sqrt(c * c - x * x)] };
          const D = lerp(P.B, P.C, c / (b + c)), E = lerp(P.C, P.A, a / (a + c)), F = lerp(P.A, P.B, b / (a + b)), O = meet(P.A, D, P.B, E);
          const p = b + c;
          return { text: `ABC üçbucağında BC = ${a}, CA = ${b}, AB = ${c}. Tənbölənlər AD, BE, CF bir nöqtədə (O) kəsişir. AO : OD nisbətini (AO / OD kəsr kimi) tap.`,
            svg: TF({ ...P, D, E, F, O }, { segs: [["A", "D", "acc"], ["B", "E", "acc"], ["C", "F", "acc"]], names: ["A", "B", "C", "D", "E", "F", "O"] }), answer: p / a, show: fr(p, a),
            solution: `Tənbölənin xassəsi: AF : FB = CA : CB = ${b} : ${a}, AE : EC = AB : BC = ${c} : ${a}. Van Aubel: AO/OD = AF/FB + AE/EC = ${b}/${a} + ${c}/${a} = ${p}/${a}${gcd(p, a) > 1 ? " = " + fr(p, a) : ""}.` };
        }
        let a, b, c, d; do { a = rnd(1, 6); b = rnd(1, 6); c = rnd(1, 6); d = rnd(1, 6); } while (a / b + c / d > 12 || (a === b && c === d));
        const T = randTri(), F = lerp(T.A, T.B, a / (a + b)), E = lerp(T.A, T.C, c / (c + d)), D = lerp(T.B, T.C, (b * c) / (b * c + a * d)), O = meet(T.A, D, T.B, E);
        const svg = TF({ ...T, D, E, F, O }, { segs: [["A", "D", "acc"], ["B", "E", "acc"], ["C", "F", "acc"]], names: ["A", "B", "C", "D", "E", "F", "O"] });
        const num = a * d + b * c, den = b * d;
        if (kind === "ao") return { text: `ABC üçbucağında AD, BE, CF bir O nöqtəsində kəsişir. AF : FB = ${a} : ${b}, AE : EC = ${c} : ${d}. AO : OD nisbətini (AO / OD kəsr kimi) tap.`, svg, answer: num / den, show: fr(num, den),
          solution: `Van Aubel: AO/OD = AF/FB + AE/EC = ${a}/${b} + ${c}/${d} = ${a * d}/${den} + ${b * c}/${den} = ${num}/${den}${gcd(num, den) > 1 ? " = " + fr(num, den) : ""}.\n(Sübut: ABD üçbucağına C, O, F düz xətti ilə Menelay və Çeva.)` };
        return { text: `ABC üçbucağında AD, BE, CF bir O nöqtəsində kəsişir. AO : OD = ${rt(num, den)}, AF : FB = ${a} : ${b}. AE : EC nisbətini (AE / EC kəsr kimi) tap.`, svg, answer: c / d, show: fr(c, d),
          solution: `Van Aubel: AO/OD = AF/FB + AE/EC. ${fr(num, den)} = ${fr(a, b)} + AE/EC → AE/EC = ${fr(num, den)} − ${fr(a, b)} = ${fr(c, d)}.` };
      } },

    { id: "sahe", ad: "Sahələr və nisbətlər", izah: "Çevianlar O nöqtəsində kəsişir və hər təpədəki \"çəki\" w olarsa: AF : FB = wB : wA, BD : DC = wC : wB, CE : EA = wA : wC. O nöqtəsi ilə yaranan üçbucaqların sahələri çəkilərə mütənasibdir: S(BOC) : S(COA) : S(AOB) = wA : wB : wC.",
      gen() {
        let wa, wb, wc; do { wa = rnd(1, 5); wb = rnd(1, 5); wc = rnd(1, 5); } while (wa === wb && wb === wc);
        const W = wa + wb + wc, T = randTri(), A = T.A, B = T.B, C = T.C;
        const F = lerp(A, B, wb / (wa + wb)), D = lerp(B, C, wc / (wb + wc)), E = lerp(C, A, wa / (wc + wa)), O = meet(A, D, B, E);
        const svg = TF({ ...T, D, E, F, O }, { segs: [["A", "D", "acc"], ["B", "E", "acc"], ["C", "F", "acc"]], names: ["A", "B", "C", "D", "E", "F", "O"] });
        const head = `ABC üçbucağında AD, BE, CF bir O nöqtəsində kəsişir (F ∈ AB, D ∈ BC, E ∈ CA). AF : FB = ${wb} : ${wa}, BD : DC = ${wc} : ${wb}.`;
        const hint = `Çevanın tərsi: CE/EA = ${wa}/${wc}. Çəkilər wA = ${wa}, wB = ${wb}, wC = ${wc}, cəmi ${W}.`;
        const kind = pick(["area", "area", "ratio"]);
        if (kind === "area") {
          const k = rnd(1, 6), S = W * k, which = pick(["AOB", "BOC", "COA"]), w = { AOB: wc, BOC: wa, COA: wb }[which];
          return { text: `${head} ABC üçbucağının sahəsi ${S}. ${which} üçbucağının sahəsini tap.`, svg, answer: w * k, show: String(w * k), tol: 0.01,
            solution: `AF/FB = ${wb}/${wa}, BD/DC = ${wc}/${wb}, Çeva ilə CE/EA = ${wa}/${wc}. Çəkilər wA = ${wa}, wB = ${wb}, wC = ${wc} götür (cəmi ${W}). S(BOC) : S(COA) : S(AOB) = ${wa} : ${wb} : ${wc}. Bir hissə = ${S} : ${W} = ${k}. S(${which}) = ${w} · ${k} = ${w * k}.` };
        }
        let x, y; do { x = pick(["AOB", "BOC", "COA"]); y = pick(["AOB", "BOC", "COA"]); } while (x === y);
        const wv = { AOB: wc, BOC: wa, COA: wb };
        return { text: `${head} S(${x}) / S(${y}) nisbətini kəsr kimi tap.`, svg, answer: wv[x] / wv[y], show: fr(wv[x], wv[y]),
          solution: `${hint} Sahələr çəkilərə mütənasibdir: S(BOC) : S(COA) : S(AOB) = ${wa} : ${wb} : ${wc}. S(${x}) / S(${y}) = ${wv[x]}/${wv[y]}${gcd(wv[x], wv[y]) > 1 ? " = " + fr(wv[x], wv[y]) : ""}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Mətnli məsələ: çevianlar, yollar, düz hasar. Əvvəl hansı teoremin (Çeva, Menelay) şərtinin ödəndiyini müəyyən et.",
      gen() {
        const t = pick(["yol", "yol", "hasar", "sahe", "fevvare"]);
        if (t === "yol") {
          let m1, n1, m2, n2; do { m1 = rnd(1, 5); n1 = rnd(1, 5); m2 = rnd(1, 5); n2 = rnd(1, 5); } while (n1 * n2 > 25 || m1 * m2 > 25);
          const p = n1 * n2, q = m1 * m2;
          return { text: `Üçbucaq şəklində ABC parkında hər təpədən qarşı tərəfə düz yol çəkilib: AD, BE, CF. Üç yol bir fəvvarədə kəsişir. F nöqtəsi AB tərəfini AF : FB = ${m1} : ${n1} nisbətində, D nöqtəsi BC tərəfini BD : DC = ${m2} : ${n2} nisbətində bölür. E nöqtəsi CA tərəfini CE : EA nisbətində bölür. CE / EA nisbəti neçədir?`,
            answer: p / q, show: fr(p, q), solution: `Üç yol bir nöqtədə kəsişir, Çeva: (AF/FB) · (BD/DC) · (CE/EA) = 1. (${m1}/${n1}) · (${m2}/${n2}) · (CE/EA) = 1 → CE/EA = ${p}/${q}${gcd(p, q) > 1 ? " = " + fr(p, q) : ""}.` };
        }
        if (t === "hasar") {
          let m1, n1, m3, n3; do { m1 = rnd(1, 5); n1 = rnd(1, 5); m3 = rnd(1, 5); n3 = rnd(1, 5); } while ((n1 * n3) === (m1 * m3) || n1 * n3 > 25 || m1 * m3 > 25);
          const p = n1 * n3, q = m1 * m3;
          return { text: `Üçbucaq şəklində ABC meydançasının AB tərəfi F nöqtəsində, CA tərəfi E nöqtəsində, BC tərəfinin davamı isə D nöqtəsində düz bir hasarla kəsişir. AF : FB = ${m1} : ${n1}, CE : EA = ${m3} : ${n3}. BD / DC nisbəti neçədir?`,
            answer: p / q, show: fr(p, q), solution: `F, E, D bir düz xətt üzərindədir, Menelay: (AF/FB) · (BD/DC) · (CE/EA) = 1. (${m1}/${n1}) · (BD/DC) · (${m3}/${n3}) = 1 → BD/DC = ${n1} · ${n3} / (${m1} · ${m3}) = ${p}/${q}${gcd(p, q) > 1 ? " = " + fr(p, q) : ""}.` };
        }
        if (t === "sahe") {
          let wa, wb, wc; do { wa = rnd(1, 5); wb = rnd(1, 5); wc = rnd(1, 5); } while (wa === wb && wb === wc);
          const W = wa + wb + wc, k = rnd(2, 8), S = W * k, w = wc;
          return { text: `Üçbucaq şəklində ABC parkının sahəsi ${S} m². Üç yol AD, BE, CF bir O nöqtəsində kəsişir. AF : FB = ${wb} : ${wa}, BD : DC = ${wc} : ${wb}. AOB üçbucağının sahəsi neçə kvadrat metrdir?`,
            answer: w * k, show: (w * k) + " m²", unit: "m²", tol: 0.01,
            solution: `Çevanın tərsi: CE/EA = ${wa}/${wc}. Çəkilər ${wa}, ${wb}, ${wc} (cəmi ${W}); S(AOB) çəkisi wC = ${wc}. Bir hissə = ${S} : ${W} = ${k}. S(AOB) = ${wc} · ${k} = ${wc * k} m².` };
        }
        let a, b, c, d; do { a = rnd(1, 6); b = rnd(1, 6); c = rnd(1, 6); d = rnd(1, 6); } while (a / b + c / d > 12 || (a === b && c === d));
        const num = a * d + b * c, den = b * d;
        return { text: `Üçbucaq şəklində ABC bağında AD, BE, CF yolları fəvvarə O nöqtəsində kəsişir. AF : FB = ${a} : ${b}, AE : EC = ${c} : ${d}. A-dan fəvvarəyə qədər olan AO məsafəsinin fəvvarədən D-yə qədər OD məsafəsinə nisbəti (AO / OD) neçədir?`,
          answer: num / den, show: fr(num, den), solution: `Van Aubel: AO/OD = AF/FB + AE/EC = ${a}/${b} + ${c}/${d} = ${num}/${den}${gcd(num, den) > 1 ? " = " + fr(num, den) : ""}.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const t = pick(["ceva", "menelay", "aubel", "iki"]), bad = rnd(0, 2);
        let task, st, wrong, why;
        if (t === "ceva") {
          let m1, n1, m2, n2; do { m1 = rnd(1, 5); n1 = rnd(1, 5); m2 = rnd(1, 5); n2 = rnd(1, 5); } while (n1 * n2 === m1 * m2 || n1 * n2 > 25 || m1 * m2 > 25 || (m1 + m2) * (n1 * n2) === (n1 + n2) * (m1 * m2));
          const p = n1 * n2, q = m1 * m2;
          task = `Məsələ: ABC-də AD, BE, CF bir nöqtədə kəsişir. AF : FB = ${m1} : ${n1}, BD : DC = ${m2} : ${n2}. CE / EA = ?`;
          st = [`Çeva: (AF/FB) · (BD/DC) · (CE/EA) = 1.`, `(${m1}/${n1}) · (${m2}/${n2}) · x = 1, yəni (${q}/${p}) · x = 1.`, `x = ${p}/${q}${gcd(p, q) > 1 ? " = " + fr(p, q) : ""}.`];
          wrong = [`Çeva: (AF/FB) + (BD/DC) + (CE/EA) = 1.`, `(${m1}/${n1}) · (${m2}/${n2}) · x = 1, yəni (${m1 + m2}/${n1 + n2}) · x = 1.`, `x = ${q}/${p}${gcd(p, q) > 1 ? " = " + fr(q, p) : ""}.`];
          why = [`1-ci addımda səhv var: Çevada nisbətlərin hasili 1-ə bərabərdir, cəmi yox.`, `2-ci addımda səhv var: kəsrlər vurulanda surətlər və məxrəclər ayrıca vurulur: ${m1 * m2}/${n1 * n2}.`, `3-cü addımda səhv var: (${q}/${p}) · x = 1 → x = ${p}/${q} (tərs kəsr), ${q}/${p} yox.`];
        } else if (t === "menelay") {
          let m1, n1, m3, n3; do { m1 = rnd(1, 5); n1 = rnd(1, 5); m3 = rnd(1, 5); n3 = rnd(1, 5); } while (n1 * n3 === m1 * m3 || n1 * n3 > 25 || m1 * m3 > 25 || m1 * n3 === n1 * m3);
          const p = n1 * n3, q = m1 * m3;
          task = `Məsələ: düz xətt ABC-nin AB, CA tərəflərini F, E nöqtələrində, BC-nin davamını D nöqtəsində kəsir. AF : FB = ${m1} : ${n1}, CE : EA = ${m3} : ${n3}. BD / DC = ?`;
          st = [`Menelay: (AF/FB) · (BD/DC) · (CE/EA) = 1.`, `(${m1}/${n1}) · (BD/DC) · (${m3}/${n3}) = 1, yəni (${q}/${n1 * n3}) · (BD/DC) = 1.`, `BD/DC = ${p}/${q}${gcd(p, q) > 1 ? " = " + fr(p, q) : ""}.`];
          wrong = [`Menelay: (AF/FB) · (BD/DC) · (EA/CE) = 1.`, `(${m1}/${n1}) · (BD/DC) · (${m3}/${n3}) = 1, yəni (${m1 + m3}/${n1 + n3}) · (BD/DC) = 1.`, `BD/DC = ${q}/${p}${gcd(p, q) > 1 ? " = " + fr(q, p) : ""}.`];
          why = [`1-ci addımda səhv var: nisbətlər eyni dövrü sırada yazılır: AF/FB, BD/DC, CE/EA. Üçüncünü çevirmək olmaz.`, `2-ci addımda səhv var: surətlər ayrıca vurulur: ${m1} · ${m3} = ${q}, məxrəclər: ${n1} · ${n3} = ${n1 * n3}.`, `3-cü addımda səhv var: (${q}/${n1 * n3}) · (BD/DC) = 1 → BD/DC = ${p}/${q} (tərs kəsr).`];
        } else if (t === "aubel") {
          let a, b, c, d; do { a = rnd(1, 6); b = rnd(1, 6); c = rnd(1, 6); d = rnd(1, 6); } while (a / b + c / d > 12 || a * d + b * c === b * d || a === b || c === d || (a + c) * (b * d) === (b + d) * (a * d + b * c));
          const num = a * d + b * c, den = b * d;
          task = `Məsələ: AD, BE, CF bir O nöqtəsində kəsişir, AF : FB = ${a} : ${b}, AE : EC = ${c} : ${d}. AO / OD = ?`;
          st = [`Van Aubel: AO/OD = AF/FB + AE/EC.`, `AO/OD = ${a}/${b} + ${c}/${d} = ${a * d}/${den} + ${b * c}/${den}.`, `AO/OD = ${num}/${den}${gcd(num, den) > 1 ? " = " + fr(num, den) : ""}.`];
          wrong = [`Van Aubel: AO/OD = (AF/FB) · (AE/EC).`, `AO/OD = ${a}/${b} + ${c}/${d} = ${a + c}/${b + d}.`, `AO/OD = ${num + 1}/${den}.`];
          why = [`1-ci addımda səhv var: Van Aubel düsturunda nisbətlər toplanır, vurulmur.`, `2-ci addımda səhv var: kəsrlər toplananda ortaq məxrəcə gətirilir: ${a * d}/${den} + ${b * c}/${den}.`, `3-cü addımda səhv var: ${a * d} + ${b * c} = ${num}, ${num + 1} yox.`];
        } else {
          let m, n, k, l; do { m = rnd(1, 5); n = rnd(1, 5); k = rnd(1, 5); l = rnd(1, 5); } while (m === n || k === l || k * (m + n) === m * l || m + n === m);
          const p = k * (m + n), q = m * l;
          task = `Məsələ: BC üzərində D: BD : DC = ${m} : ${n}; AC üzərində E: AE : EC = ${k} : ${l}. AD və BE P-də kəsişir. AP / PD = ?`;
          st = [`ADC üçbucağı və B, P, E düz xətti üçün Menelay: (AP/PD) · (DB/BC) · (CE/EA) = 1.`, `DB/BC = ${m}/${m + n}, CE/EA = ${l}/${k}.`, `AP/PD = (${m + n}/${m}) · (${k}/${l}) = ${p}/${q}${gcd(p, q) > 1 ? " = " + fr(p, q) : ""}.`];
          wrong = [`ADC üçbucağı və B, P, E düz xətti üçün Menelay: (AP/PD) + (DB/BC) + (CE/EA) = 1.`, `DB/BC = ${m}/${n}, CE/EA = ${l}/${k}.`, `AP/PD = (${m + n}/${m}) · (${l}/${k}) = ${(m + n) * l}/${m * k}.`];
          why = [`1-ci addımda səhv var: Menelayda üç nisbətin hasili 1-dir, cəmi yox.`, `2-ci addımda səhv var: DB/BC — bütün BC-yə nisbətdir, BC = ${m} + ${n}: DB/BC = ${m}/${m + n}.`, `3-cü addımda səhv var: CE/EA = ${l}/${k} olduğundan AP/PD = (${m + n}/${m}) · (${k}/${l}).`];
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
      key: "ol-ceva-menelay", title: "Çeva və Menelay teoremləri", fenn: "olimpiada", link: "dersler/ol-ceva-menelay.html",
      format: "Cavab — nisbət, kəsr kimi: 5/4 (AP : PD = 5 : 4 üçün AP/PD). Tam ədəd də ola bilər: 6. Sahə — ədəd.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["menelay", "menelay", "ceva", "ceva", "iki", "aubel", "sahe", "sahe", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-ceva-menelay.html")) b.push("dersler/ol-ceva-menelay.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
