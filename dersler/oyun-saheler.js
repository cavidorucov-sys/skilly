// Sahələr (üçbucaq, paraleloqram, romb, trapesiya, dairə və sektor, mürəkkəb fiqurlar) — mastery game levels and the final test.
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
  // o: { circ:[[center, r, "fill"|"acc"|"hole"]], shapes?, arcLine?, poly?, segs:[[p,q,"dash"|"acc"|"ink"]], lab:{PQ:text}, right:[[v,p,q]], arcs:[[v,p,q,text,r]],
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
    const PAPER = "fill:var(--paper,#faf9f5)";
    const circle = ([c, rr, st]) => g.append(sv("circle", { cx: Q[c][0], cy: Q[c][1], r: s * rr, fill: st === "fill" ? SOFT : "none", ...(st === "hole" ? { style: PAPER } : {}), stroke: st === "acc" ? ACC : INK, "stroke-width": 2 }));
    (o.circ || []).filter(c => c[2] === "fill").forEach(circle);
    // filled regions (sectors, holes) as polygons through named points: [[names], "fill"|"hole"]
    for (const [ks, st] of o.shapes || []) g.append(sv("polygon", { points: ks.map(k => Q[k].join(",")).join(" "), fill: SOFT, ...(st === "hole" ? { style: PAPER } : {}), stroke: "none" }));
    if (o.poly) g.append(sv("polygon", { points: o.poly.map(k => Q[k].join(",")).join(" "), fill: o.polyFill === false ? "none" : SOFT, stroke: INK, "stroke-width": 2, "stroke-linejoin": "round" }));
    (o.circ || []).filter(c => c[2] !== "fill").forEach(circle);
    if (o.arcLine) g.append(sv("polyline", { points: o.arcLine.map(k => Q[k].join(",")).join(" "), fill: "none", stroke: INK, "stroke-width": 2 }));
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
  const HERON = [[5, 5, 6, 12], [5, 5, 8, 12], [13, 14, 15, 84], [10, 13, 13, 60], [13, 13, 24, 60], [9, 10, 17, 36], [6, 25, 29, 60], [7, 15, 20, 42], [11, 13, 20, 66],
    [10, 17, 21, 84], [13, 20, 21, 126], [12, 17, 25, 90], [17, 25, 28, 210], [4, 13, 15, 24], [14, 25, 25, 168], [16, 17, 17, 120], [12, 10, 10, 48]];
  const tri = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a); return { A: [x, Math.sqrt(c * c - x * x)], B: [0, 0], C: [a, 0] }; };
  const ABC = ["A", "B", "C"], ABCD = ["A", "B", "C", "D"];
  const SIN = { 30: [1, 2, 1], 150: [1, 2, 1], 45: [1, 2, 2], 135: [1, 2, 2], 60: [1, 2, 3], 120: [1, 2, 3], 90: [1, 1, 1] }; // sin = p/q·√n
  const sinS = a => ({ 30: "1/2", 150: "1/2", 45: "√2/2", 135: "√2/2", 60: "√3/2", 120: "√3/2", 90: "1" })[a];
  const pi = { tol: 0.01 };
  const kpi = k => String(k).includes("/") ? `(${k})π` : `${k}π`;   // "(121/6)π", "25π"
  // arc points named prefix+i from angle f to angle t (degrees) around c
  function arcPts(P, prefix, c, R, f, t, n = 24) { const ks = []; for (let i = 0; i <= n; i++) { const k = prefix + i; P[k] = on(f + (t - f) * i / n, R, c); ks.push(k); } return ks; }

  const levels = [
    { id: "ucbucaq", ad: "Üçbucağın sahəsi", izah: "S = a · h / 2, S = a · b · sin C / 2, Heron: S = √(p(p − a)(p − b)(p − c)). Düzbucaqlı: katetlərin hasilinin yarısı.",
      gen() {
        const kind = pick(["ah", "ah", "absin", "absin", "heron", "duz", "eq", "med", "ikih"]);
        if (kind === "ah") {
          const a = rnd(3, 20), hh = rnd(2, 16), S2 = a * hh;
          let ax; do ax = a * (Math.random() * 1.3 - .15); while (Math.abs(ax) < .1 * a || Math.abs(ax - a) < .1 * a);
          const P = { A: [ax, hh], B: [0, 0], C: [a, 0], H: [ax, 0] };
          const svg = lab => figure(P, { poly: ABC, names: ["A", "B", "C", "H"], segs: [["A", "H", "dash"], ...(P.H[0] < 0 ? [["H", "B", "dash"]] : P.H[0] > a ? [["C", "H", "dash"]] : [])], right: [["H", "A", P.H[0] > a / 2 ? "B" : "C"]], lab });
          if (Math.random() < .6) return { text: `ABC üçbucağında BC = ${a}, A təpəsindən çəkilmiş hündürlük AH = ${hh}. Sahəsini tap.`, svg: svg({ BC: String(a), AH: String(hh) }),
            answer: S2 / 2, show: frac(S2, 2), placeholder: "məs. 24 və ya 35/2", solution: `S = BC · AH / 2 = ${a} · ${hh} / 2 = ${frac(S2, 2)}.` };
          return { text: `Üçbucağın sahəsi ${frac(S2, 2)}, BC tərəfi ${a}. BC-yə çəkilmiş AH hündürlüyünü tap.`, svg: svg({ BC: String(a), AH: "?" }), answer: hh, show: String(hh), tol: 0.01,
            solution: `S = BC · AH / 2 → AH = 2S / BC = ${S2} / ${a} = ${hh}.` };
        }
        if (kind === "absin") {
          const a = rnd(3, 16), b = rnd(3, 16), C = pick([30, 45, 60, 90, 120, 135, 150]), [sp, sq, sn] = SIN[C], [s, v] = surd(a * b * sp, 2 * sq, sn);
          const P = { C: [0, 0], B: [a, 0], A: on(C, b) };
          return { text: `ABC üçbucağında AC = ${b}, BC = ${a}, ∠C = ${C}°. Sahəsini tap.`, svg: figure(P, { poly: ABC, arcs: [["C", "B", "A", C + "°", 16]], lab: { BC: String(a), CA: String(b) } }),
            answer: v, show: s, placeholder: "məs. 15 və ya 6√3",
            solution: `S = AC · BC · sin C / 2 = ${b} · ${a} · ${sinS(C)} / 2 = ${s}.` + (C > 90 ? ` (sin ${C}° = sin ${180 - C}°.)` : "") };
        }
        if (kind === "heron") {
          const [a, b, c, S] = pick(HERON), k = pick([1, 1, 2]), A = a * k, B = b * k, Cc = c * k, p = (A + B + Cc) / 2;
          return { text: `Üçbucağın tərəfləri ${A}, ${B} və ${Cc}. Sahəsini tap.`, svg: figure(tri(A, B, Cc), { poly: ABC, lab: { BC: String(A), CA: String(B), AB: String(Cc) } }),
            answer: S * k * k, show: String(S * k * k), tol: 0.01,
            solution: `Heron düsturu: p = (${A} + ${B} + ${Cc}) / 2 = ${p}. S = √(${p} · ${p - A} · ${p - B} · ${p - Cc}) = √${p * (p - A) * (p - B) * (p - Cc)} = ${S * k * k}.` };
        }
        if (kind === "duz") {
          const [p, q, c] = triple(40), sub = pick(["S", "S2", "h"]), P = { C: [0, 0], A: [0, p], B: [q, 0] }; P.H = (() => { const t = (p * p) / (c * c); return [q * t, p * (1 - t)]; })();
          if (sub === "S") return { text: `Düzbucaqlı üçbucağın katetləri ${p} və ${q}. Sahəsini tap.`, svg: figure(P, { poly: ABC, right: [["C", "A", "B"]], lab: { CA: String(p), BC: String(q) } }),
            answer: p * q / 2, show: String(p * q / 2), tol: 0.01, solution: `Katetlərdən biri o birinə çəkilmiş hündürlükdür: S = ${p} · ${q} / 2 = ${p * q / 2}.` };
          if (sub === "S2") return { text: `Düzbucaqlı üçbucağın hipotenuzu ${c}, bir kateti ${p}. Sahəsini tap.`, svg: figure(P, { poly: ABC, right: [["C", "A", "B"]], lab: { CA: String(p), AB: String(c) } }),
            answer: p * q / 2, show: String(p * q / 2), tol: 0.01, solution: `O biri katet = √(${c}² − ${p}²) = ${q}. S = ${p} · ${q} / 2 = ${p * q / 2}.` };
          return { text: `Düzbucaqlı üçbucağın katetləri ${p} və ${q}. Hipotenuza çəkilmiş hündürlüyü tap.`, svg: figure(P, { poly: ABC, names: ["A", "B", "C", "H"], segs: [["C", "H", "dash"]], right: [["C", "A", "B"], ["H", "C", "B"]], lab: { CA: String(p), BC: String(q) } }),
            answer: p * q / c, show: frac(p * q, c), placeholder: "məs. 12/5",
            solution: `Hipotenuz = √(${p}² + ${q}²) = ${c}. Sahəni iki cür yaz: ${p} · ${q} / 2 = ${c} · h / 2 → h = ${p * q} / ${c} = ${frac(p * q, c)}.` };
        }
        if (kind === "eq") {
          const a = rnd(2, 16), [s, v] = surd(a * a, 4, 3);
          return { text: `Bərabərtərəfli üçbucağın tərəfi ${a}. Sahəsini tap.`, answer: v, show: s, placeholder: "məs. 9√3",
            solution: `S = a²√3/4 = ${a * a}√3/4 = ${s}. (Və ya S = a · a · sin 60° / 2.)` };
        }
        if (kind === "med") {
          let m, n, S; do { m = rnd(1, 5); n = rnd(1, 6); S = (m + n) * rnd(2, 12); } while (m === n && Math.random() < .7);
          const P = { A: [rnd(1, 4), rnd(3, 5)], B: [0, 0], C: [m + n, 0], D: [m, 0] };
          return { text: `ABC üçbucağının sahəsi ${S}. D nöqtəsi BC tərəfi üzərindədir, BD : DC = ${m} : ${n}. ABD üçbucağının sahəsini tap.`,
            svg: figure(P, { poly: ABC, names: ["A", "B", "C", "D"], segs: [["A", "D", "acc"]], rot: [0], place: { D: ["B", "out"] } }), answer: S * m / (m + n), show: String(S * m / (m + n)), tol: 0.01,
            solution: `ABD və ADC üçbucaqlarının A-dan çəkilmiş hündürlüyü eynidir, sahələri oturacaqlar kimi nisbətdədir: ${m} : ${n}. S(ABD) = ${S} · ${m} / ${m + n} = ${S * m / (m + n)}.` };
        }
        let a, b, ha; do { a = rnd(4, 20); b = rnd(4, 20); ha = rnd(2, 15); } while (a === b || (a * ha) % b || ha >= b);
        return { text: `Üçbucağın iki tərəfi ${a} və ${b}. ${a} olan tərəfə çəkilmiş hündürlük ${ha}-dir. ${b} olan tərəfə çəkilmiş hündürlüyü tap.`, answer: a * ha / b, show: String(a * ha / b), tol: 0.01,
          solution: `Sahə bir dənədir: ${a} · ${ha} / 2 = ${b} · h / 2 → h = ${a * ha} / ${b} = ${a * ha / b}.` };
      } },

    { id: "paralel", ad: "Paraleloqram və romb", izah: "Paraleloqram: S = a · h = a · b · sin α. Romb: S = d₁ · d₂ / 2. Düzbucaqlı: S = a · b, kvadrat: S = a² = d² / 2.",
      gen() {
        const kind = pick(["ah", "absin", "absin", "romb", "romb", "duzb", "kv", "ikih"]);
        const para = (a, b, al) => ({ A: [0, 0], B: on(al, b), C: [a + b * Math.cos(rad(al)), b * Math.sin(rad(al))], D: [a, 0] });
        if (kind === "ah") {
          const a = rnd(4, 20), hh = rnd(2, 15), al = rnd(50, 75), P = para(a, hh / Math.sin(rad(al)), al); P.H = [P.B[0], 0];
          return { text: `Paraleloqramın AD tərəfi ${a}, ona çəkilmiş BH hündürlüyü ${hh}. Sahəsini tap.`, svg: figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "H"], segs: [["B", "H", "dash"]], right: [["H", "D", "B"]], lab: { AD: String(a), BH: String(hh) } }),
            answer: a * hh, show: String(a * hh), tol: 0.01, solution: `S = AD · BH = ${a} · ${hh} = ${a * hh}.` };
        }
        if (kind === "absin") {
          const a = rnd(3, 16), b = rnd(3, 16), al = pick([30, 45, 60, 120, 135, 150]), [sp, sq, sn] = SIN[al], [s, v] = surd(a * b * sp, sq, sn);
          return { text: `Paraleloqramın qonşu tərəfləri ${a} və ${b}, aralarındakı bucaq ${al}°. Sahəsini tap.`, svg: figure(para(Math.max(a, b), Math.min(a, b), al), { poly: ABCD, arcs: [["A", "D", "B", al + "°"]], lab: { AD: String(Math.max(a, b)), AB: String(Math.min(a, b)) } }),
            answer: v, show: s, placeholder: "məs. 40 və ya 12√3", solution: `S = a · b · sin α = ${a} · ${b} · ${sinS(al)} = ${s}.` };
        }
        if (kind === "romb") {
          const sub = pick(["d", "d", "ah", "a60"]);
          if (sub === "d") { const d1 = rnd(3, 20), d2 = rnd(3, 20), P = { A: [-d1 / 2, 0], B: [0, d2 / 2], C: [d1 / 2, 0], D: [0, -d2 / 2] };
            return { text: `Rombun diaqonalları ${d1} və ${d2}. Sahəsini tap.`, svg: figure(P, { poly: ABCD, segs: [["A", "C", "acc"], ["B", "D", "acc"]] }), answer: d1 * d2 / 2, show: frac(d1 * d2, 2), placeholder: "məs. 30 və ya 63/2",
              solution: `S = d₁ · d₂ / 2 = ${d1} · ${d2} / 2 = ${frac(d1 * d2, 2)}.` }; }
          if (sub === "ah") { const a = rnd(3, 15), hh = rnd(2, a);
            return { text: `Rombun perimetri ${4 * a}, hündürlüyü ${hh}. Sahəsini tap.`, answer: a * hh, show: String(a * hh), tol: 0.01, solution: `Tərəf = ${4 * a} : 4 = ${a}. S = a · h = ${a} · ${hh} = ${a * hh}.` }; }
          const a = rnd(2, 14), al = pick([30, 150, 60, 120, 45, 135]), [sp, sq, sn] = SIN[al], [s, v] = surd(a * a * sp, sq, sn);
          return { text: `Rombun tərəfi ${a}, bir bucağı ${al}°. Sahəsini tap.`, svg: figure(para(a, a, al), { poly: ABCD, arcs: [["A", "D", "B", al + "°"]], lab: { AD: String(a) } }), answer: v, show: s, placeholder: "məs. 18 və ya 8√3",
            solution: `Romb paraleloqramdır: S = a² · sin α = ${a * a} · ${sinS(al)} = ${s}.` };
        }
        if (kind === "duzb") {
          const [p, q, c] = triple(50);
          return { text: `Düzbucaqlının diaqonalı ${c}, bir tərəfi ${p}. Sahəsini tap.`, svg: figure({ A: [0, 0], B: [0, p], C: [q, p], D: [q, 0] }, { poly: ABCD, segs: [["A", "C", "acc"]], lab: { AC: String(c), AB: String(p) }, right: [["D", "C", "A"]] }),
            answer: p * q, show: String(p * q), tol: 0.01, solution: `O biri tərəf = √(${c}² − ${p}²) = ${q}. S = ${p} · ${q} = ${p * q}.` };
        }
        if (kind === "kv") {
          const d = rnd(2, 20), sub = Math.random() < .5;
          if (sub) return { text: `Kvadratın diaqonalı ${d}. Sahəsini tap.`, answer: d * d / 2, show: frac(d * d, 2), placeholder: "məs. 18 və ya 49/2", solution: `Kvadrat rombdur: S = d² / 2 = ${d * d} / 2 = ${frac(d * d, 2)}.` };
          return { text: `Kvadratın perimetri ${4 * d}. Sahəsini tap.`, answer: d * d, show: String(d * d), tol: 0.01, solution: `Tərəf = ${4 * d} : 4 = ${d}. S = ${d}² = ${d * d}.` };
        }
        let a, b, ha; do { a = rnd(4, 20); b = rnd(3, 18); ha = rnd(2, b - 1); } while (a === b || (a * ha) % b || ha >= b);
        return { text: `Paraleloqramın tərəfləri ${a} və ${b}. Uzunluğu ${a} olan tərəfə çəkilmiş hündürlük ${ha}-dir. O biri tərəfə çəkilmiş hündürlüyü tap.`, answer: a * ha / b, show: String(a * ha / b), tol: 0.01,
          solution: `S = ${a} · ${ha} = ${a * ha}. O biri hündürlük = S : ${b} = ${a * ha / b}.` };
      } },

    { id: "trapesiya", ad: "Trapesiyanın sahəsi", izah: "S = (a + b) / 2 · h = orta xətt · hündürlük. Hündürlük çox vaxt yan tərəfdən Pifaqorla tapılır.",
      gen() {
        const kind = pick(["esas", "esas", "teref", "beraber", "beraber", "duz45", "orta", "perp"]);
        if (kind === "esas" || kind === "teref") {
          const a = rnd(2, 15), b = rnd(a + 2, 25), hh = rnd(2, 14), S2 = (a + b) * hh, sh = rnd(-2, b - a + 2);
          const P = { A: [0, 0], B: [sh, hh], C: [sh + a, hh], D: [b, 0], H: [sh, 0] };
          const svg = lab => figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "H"], segs: [["B", "H", "dash"], ...(sh < 0 ? [["H", "A", "dash"]] : [])], right: [["H", "B", sh < 0 ? "A" : "D"]], lab, rot: [0, 2] });
          if (kind === "esas") return { text: `Trapesiyanın oturacaqları ${a} və ${b}, hündürlüyü ${hh}. Sahəsini tap.`, svg: svg({ BC: String(a), AD: String(b), BH: String(hh) }),
            answer: S2 / 2, show: frac(S2, 2), placeholder: "məs. 40 və ya 75/2", solution: `S = (${a} + ${b}) / 2 · ${hh} = ${frac(a + b, 2)} · ${hh} = ${frac(S2, 2)}.` };
          return { text: `Trapesiyanın sahəsi ${frac(S2, 2)}, hündürlüyü ${hh}, bir oturacağı ${b}. O biri oturacağı tap.`, svg: svg({ AD: String(b), BH: String(hh), BC: "?" }),
            answer: a, show: String(a), tol: 0.01, solution: `(a + b) / 2 = S / h = ${frac(S2, 2)} : ${hh} = ${frac(a + b, 2)}, a + b = ${a + b}, a = ${a + b} − ${b} = ${a}.` };
        }
        if (kind === "beraber") {
          const [x, y, c] = triple(30), a = rnd(2, 16), b = a + 2 * x, S = (a + b) / 2 * y;
          const P = { A: [0, 0], B: [x, y], C: [x + a, y], D: [b, 0], H: [x, 0] };
          return { text: `Bərabəryanlı trapesiyanın oturacaqları ${a} və ${b}, yan tərəfi ${c}. Sahəsini tap.`, svg: figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "H"], segs: [["B", "H", "dash"]], right: [["H", "D", "B"]], lab: { BC: String(a), AD: String(b), AB: String(c) }, rot: [0, 2] }),
            answer: S, show: String(S), tol: 0.01,
            solution: `AH = (${b} − ${a}) / 2 = ${x}. BH = √(${c}² − ${x}²) = ${y}. S = (${a} + ${b}) / 2 · ${y} = ${a + x} · ${y} = ${S}.` };
        }
        if (kind === "duz45") {
          const a = rnd(2, 14), hh = rnd(2, 12), b = a + hh, S2 = (a + b) * hh;
          const P = { A: [0, 0], B: [0, hh], C: [a, hh], D: [b, 0], H: [a, 0] };
          return { text: `Düzbucaqlı trapesiyanın oturacaqları ${a} və ${b}, iti bucağı 45°. Sahəsini tap.`, svg: figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "H"], segs: [["C", "H", "dash"]], right: [["A", "D", "B"], ["H", "D", "C"]], arcs: [["D", "C", "A", "45°"]], lab: { BC: String(a), AD: String(b) }, rot: [0] }),
            answer: S2 / 2, show: frac(S2, 2), placeholder: "məs. 24 və ya 45/2",
            solution: `C-dən hündürlük CH endir: HD = ${b} − ${a} = ${hh}. CHD düzbucaqlı və bərabəryanlıdır (45°), ona görə CH = HD = ${hh}. S = (${a} + ${b}) / 2 · ${hh} = ${frac(S2, 2)}.` };
        }
        if (kind === "orta") {
          const m = rnd(3, 20), hh = rnd(2, 12);
          return { text: `Trapesiyanın orta xətti ${m}, hündürlüyü ${hh}. Sahəsini tap.`, answer: m * hh, show: String(m * hh), tol: 0.01,
            solution: `Orta xətt = (a + b) / 2, ona görə S = orta xətt · h = ${m} · ${hh} = ${m * hh}.` };
        }
        const m = rnd(3, 20);
        return { text: `Bərabəryanlı trapesiyanın diaqonalları perpendikulyardır, orta xətti ${m}. Sahəsini tap.`, answer: m * m, show: String(m * m), tol: 0.01,
          solution: `Diaqonallar perpendikulyar olan bərabəryanlı trapesiyada hündürlük orta xəttə bərabərdir: h = (a + b) / 2 = ${m}. (Diaqonallar oturacaqlarla 45° əmələ gətirir.) S = ${m} · ${m} = ${m * m}.` };
      } },

    { id: "daire", ad: "Dairə və sektor", izah: "S = πR², sektor: S = πR² · α / 360°. Cavab kπ şəklindədirsə, k-nı yaz. π ≈ 3,14 deyilibsə, onluq kəsrlə hesabla.",
      gen() {
        const kind = pick(["R", "d", "C", "sektor", "sektor", "alfa", "halqa", "pi", "seqment", "nisbet"]);
        const disk = (R, lab) => figure({ O: [0, 0], A: [R, 0] }, { circ: [["O", R, "fill"]], cen: "O", names: ["O"], segs: [["O", "A", "acc"]], lab, free: true, place: { O: ["A", "out"] } });
        if (kind === "R") { const R = rnd(2, 15);
          return { text: `Dairənin radiusu ${R}. Sahəsi kπ-dir. k-nı tap.`, svg: disk(R, { OA: String(R) }), answer: R * R, show: String(R * R), tol: 0.01, solution: `S = πR² = π · ${R}² = ${R * R}π. k = ${R * R}.` }; }
        if (kind === "d") { const d = rnd(2, 24);
          return { text: `Dairənin diametri ${d}. Sahəsi kπ-dir. k-nı tap.`, answer: d * d / 4, show: frac(d * d, 4), placeholder: "məs. 36 və ya 49/4", solution: `R = ${d} / 2 = ${frac(d, 2)}. S = πR² = ${kpi(frac(d * d, 4))}. k = ${frac(d * d, 4)}.` }; }
        if (kind === "C") { const R = rnd(2, 15);
          return { text: `Çevrənin uzunluğu ${2 * R}π. Bu çevrənin hüdudladığı dairənin sahəsi kπ-dir. k-nı tap.`, answer: R * R, show: String(R * R), tol: 0.01, solution: `C = 2πR → 2πR = ${2 * R}π → R = ${R}. S = πR² = ${R * R}π, k = ${R * R}.` }; }
        if (kind === "sektor" || kind === "alfa") {
          const al = pick([30, 45, 60, 72, 90, 120, 135, 150, 180, 240, 270]), R = rnd(2, 12), num = R * R * al, k = frac(num, 360);
          const P = { O: [0, 0] }, ks = arcPts(P, "s", [0, 0], R, 0, al); P.A = [R, 0]; P.B = on(al, R);
          const svg = (tx, lab) => figure(P, { shapes: [[["O", ...ks], "fill"]], circ: [["O", R]], cen: "O", names: ["O", "A", "B"], segs: [["O", "A", "acc"], ["O", "B", "acc"]], arcs: al < 180 ? [["O", "A", "B", tx, 14]] : [], lab, free: true, place: { O: ["A", "out"] } });
          if (kind === "sektor") return { text: `Dairənin radiusu ${R}, sektorun mərkəzi bucağı ${al}°. Sektorun sahəsi kπ-dir. k-nı tap.`, svg: svg(al + "°", { OA: String(R) }),
            answer: num / 360, show: k, placeholder: "məs. 12 və ya 25/4",
            solution: `S = πR² · α / 360° = π · ${R * R} · ${al} / 360 = ${kpi(k)}. k = ${k}.` };
          if (num % 360) return levels[3].gen();
          return { text: `Radiusu ${R} olan dairənin sektorunun sahəsi ${num / 360}π-dir. Sektorun mərkəzi bucağını tap.`, svg: svg("?", { OA: String(R) }),
            answer: al, show: al + "°", ...deg,
            solution: `Bütün dairə ${R * R}π. Sektor onun ${num / 360}/${R * R} hissəsidir: α = 360° · ${num / 360} / ${R * R} = ${al}°.` };
        }
        if (kind === "halqa") { const r = rnd(1, 10), R = r + rnd(1, 8);
          return { text: `Mərkəzləri eyni olan iki çevrənin radiusları ${R} və ${r}. Onların arasındakı halqanın sahəsi kπ-dir. k-nı tap.`,
            svg: figure({ O: [0, 0], A: [R, 0], B: on(130, r) }, { circ: [["O", R, "fill"], ["O", r, "hole"]], cen: "O", names: ["O"], segs: [["O", "A", "acc"], ["O", "B", "acc"]], lab: { OA: String(R), OB: String(r) }, free: true }),
            answer: R * R - r * r, show: String(R * R - r * r), tol: 0.01, solution: `S = πR² − πr² = π(${R * R} − ${r * r}) = ${R * R - r * r}π. k = ${R * R - r * r}.` }; }
        if (kind === "pi") { const R = rnd(2, 20), S = Math.round(3.14 * R * R * 100) / 100;
          return { text: `Dairənin radiusu ${R} sm. Sahəsini tap (π ≈ 3,14 götür).`, answer: S, show: fmt(S) + " sm²", unit: "sm²", ...pi, solution: `S = πR² ≈ 3,14 · ${R * R} = ${fmt(S)} sm².` }; }
        if (kind === "seqment") {
          const R = 2 * rnd(1, 10), sec = Math.round(3.14 * R * R / 4 * 100) / 100, tr = R * R / 2, S = Math.round((sec - tr) * 100) / 100;
          const P = { O: [0, 0] }, ks = arcPts(P, "s", [0, 0], R, 0, 90); P.A = [R, 0]; P.B = [0, R];
          return { text: `Radiusu ${R} olan çevrədə AB vətəri 90°-lik qövsü gərir. Vətərlə bu qövs arasındakı seqmentin sahəsini tap (π ≈ 3,14).`,
            svg: figure(P, { shapes: [[ks, "fill"]], circ: [["O", R]], cen: "O", names: ["O", "A", "B"], segs: [["O", "A", "dash"], ["O", "B", "dash"], ["A", "B", "acc"]], right: [["O", "A", "B"]], lab: { OA: String(R) }, free: true }),
            answer: S, show: fmt(S), ...pi,
            solution: `Seqment = sektor − üçbucaq. Sektor = 3,14 · ${R * R} / 4 = ${fmt(sec)}. AOB üçbucağı = ${R} · ${R} / 2 = ${tr}. Seqment = ${fmt(sec)} − ${tr} = ${fmt(S)}.` };
        }
        const n = rnd(2, 6), up = Math.random() < .5;
        return { text: `Dairənin radiusu ${n} dəfə ${up ? "artırıldı" : "azaldıldı"}. Sahəsi neçə dəfə ${up ? "artar" : "azalar"}?`, answer: n * n, show: String(n * n), tol: 0.01,
          solution: `S = πR². Radius ${n} dəfə ${up ? "artanda" : "azalanda"} R² ${n}² = ${n * n} dəfə dəyişir.` };
      } },

    { id: "murekkeb", ad: "Mürəkkəb fiqurlar", izah: "Fiquru tanış hissələrə böl və ya böyük fiqurdan artıq hissəni çıx. π ≈ 3,14 götürülür (deyilibsə).",
      gen() {
        const kind = pick(["kvdaire", "pencere", "L", "dorddebir", "orta", "kvkv", "dairekv", "kpi"]);
        if (kind === "kvdaire") {
          const a = 2 * rnd(1, 10), S = Math.round((a * a - 3.14 * a * a / 4) * 100) / 100, cS = Math.round(3.14 * a * a / 4 * 100) / 100;
          const P = { A: [0, 0], B: [0, a], C: [a, a], D: [a, 0], O: [a / 2, a / 2] };
          return { text: `Tərəfi ${a} olan kvadratın içinə çevrə çəkilib (tərəflərə toxunur). Kvadratın dairədən kənarda qalan hissəsinin sahəsini tap (π ≈ 3,14).`,
            svg: figure(P, { poly: ABCD, names: ABCD, circ: [["O", a / 2, "hole"]], lab: { AD: String(a) }, rot: [0] }), answer: S, show: fmt(S), ...pi,
            solution: `Kvadrat: ${a}² = ${a * a}. Dairə: r = ${a / 2}, S = 3,14 · ${a * a / 4} = ${fmt(cS)}. Fərq: ${a * a} − ${fmt(cS)} = ${fmt(S)}.` };
        }
        if (kind === "pencere") {
          const b = 2 * rnd(1, 8), a = rnd(2, 12), semi = Math.round(3.14 * (b / 2) ** 2 / 2 * 100) / 100, S = Math.round((a * b + semi) * 100) / 100;
          const P = { A: [0, 0], B: [0, a], C: [b, a], D: [b, 0] }, ks = arcPts(P, "s", [b / 2, a], b / 2, 0, 180);
          return { text: `Fiqur eni ${b}, hündürlüyü ${a} olan düzbucaqlıdan və onun yuxarı tərəfi üzərində qurulmuş yarımdairədən ibarətdir. Fiqurun sahəsini tap (π ≈ 3,14).`,
            svg: figure(P, { shapes: [[ks, "fill"]], poly: ABCD, names: [], arcLine: ks, lab: { AD: String(b), AB: String(a) }, rot: [0] }), answer: S, show: fmt(S), ...pi,
            solution: `Düzbucaqlı: ${b} · ${a} = ${a * b}. Yarımdairə: r = ${b / 2}, S = 3,14 · ${(b / 2) ** 2} / 2 = ${fmt(semi)}. Cəmi: ${a * b} + ${fmt(semi)} = ${fmt(S)}.` };
        }
        if (kind === "L") {
          const W = rnd(6, 16), H = rnd(6, 14), w = rnd(2, W - 3), hh = rnd(2, H - 3), S = W * H - w * hh;
          const P = { A: [0, 0], B: [0, H], C: [W - w, H], D: [W - w, H - hh], E: [W, H - hh], F: [W, 0] };
          return { text: `Şəkildəki fiqurun bütün bucaqları düzdür. Ölçülər: AF = ${W}, AB = ${H}, BC = ${W - w}, EF = ${H - hh}. Sahəsini tap.`,
            svg: figure(P, { poly: ["A", "B", "C", "D", "E", "F"], lab: { AF: String(W), AB: String(H), BC: String(W - w), EF: String(H - hh) }, rot: [0] }), answer: S, show: String(S), tol: 0.01,
            solution: `Bütöv düzbucaqlı ${W} × ${H} = ${W * H}. Kəsilmiş künc: (${W} − ${W - w}) × (${H} − ${H - hh}) = ${w} × ${hh} = ${w * hh}. S = ${W * H} − ${w * hh} = ${S}.` };
        }
        if (kind === "dorddebir") {
          const a = 2 * rnd(1, 10), q = Math.round(3.14 * a * a / 4 * 100) / 100, S = Math.round((a * a - q) * 100) / 100;
          const P = { A: [0, 0], B: [0, a], C: [a, a], D: [a, 0] }, ks = arcPts(P, "s", [0, 0], a, 0, 90);
          return { text: `Tərəfi ${a} olan ABCD kvadratında mərkəzi A, radiusu ${a} olan dörddəbir dairə çəkilib. Kvadratın dörddəbir dairədən kənarda qalan hissəsinin sahəsini tap (π ≈ 3,14).`,
            svg: figure(P, { shapes: [[ABCD, "fill"], [["A", ...ks], "hole"]], poly: ABCD, polyFill: false, lab: { AD: String(a) }, arcLine: ks, rot: [0] }), answer: S, show: fmt(S), ...pi,
            solution: `Kvadrat: ${a * a}. Dörddəbir dairə: 3,14 · ${a * a} / 4 = ${fmt(q)}. Qalan hissə: ${a * a} − ${fmt(q)} = ${fmt(S)}.` };
        }
        if (kind === "orta") {
          const a = rnd(4, 20), b = rnd(3, 15), x = Math.random() * .6 + .2, P = { A: [0, 0], B: [0, b], C: [a, b], D: [a, 0], M: [a * x, b] };
          return { text: `ABCD düzbucaqlısında AD = ${a}, AB = ${b}. M nöqtəsi BC tərəfi üzərində ixtiyari nöqtədir. AMD üçbucağının sahəsini tap.`,
            svg: figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "M"], segs: [["A", "M", "acc"], ["M", "D", "acc"]], lab: { AD: String(a), AB: String(b) }, rot: [0] }), answer: a * b / 2, show: frac(a * b, 2), placeholder: "məs. 24 və ya 35/2",
            solution: `AMD-nin oturacağı AD = ${a}, M-dən AD-yə hündürlük düzbucaqlının hündürlüyüdür: ${b}. S = ${a} · ${b} / 2 = ${frac(a * b, 2)} — düzbucaqlının yarısı, M harada olsa da.` };
        }
        if (kind === "kvkv") {
          const a = rnd(2, 20), P = { A: [0, 0], B: [0, a], C: [a, a], D: [a, 0], K: [0, a / 2], L: [a / 2, a], M: [a, a / 2], N: [a / 2, 0] };
          return { text: `Tərəfi ${a} olan kvadratın qonşu tərəflərinin orta nöqtələri ardıcıl birləşdirilib. Alınan dördbucaqlının sahəsini tap.`,
            svg: figure(P, { poly: ABCD, polyFill: false, shapes: [[["K", "L", "M", "N"], "fill"]], names: ABCD, segs: [["K", "L", "acc"], ["L", "M", "acc"], ["M", "N", "acc"], ["N", "K", "acc"]], lab: { AD: String(a) }, rot: [0] }),
            answer: a * a / 2, show: frac(a * a, 2), placeholder: "məs. 18 və ya 49/2",
            solution: `Kəsilən 4 künc üçbucağın hər biri ${frac(a, 2)} · ${frac(a, 2)} / 2, birlikdə kvadratın yarısı edir. Qalan: ${a * a} / 2 = ${frac(a * a, 2)}.` };
        }
        if (kind === "dairekv") {
          const R = rnd(1, 12), c = Math.round(3.14 * R * R * 100) / 100, S = Math.round((c - 2 * R * R) * 100) / 100;
          const P = { O: [0, 0], A: [R, 0], B: [0, R], C: [-R, 0], D: [0, -R] };
          return { text: `Radiusu ${R} olan dairənin içinə kvadrat çəkilib (təpələri çevrə üzərindədir). Dairənin kvadratdan kənarda qalan hissəsinin sahəsini tap (π ≈ 3,14).`,
            svg: figure(P, { circ: [["O", R, "fill"]], shapes: [[ABCD, "hole"]], poly: ABCD, polyFill: false, names: ABCD, cen: "O", segs: [["O", "A", "dash"]], lab: { OA: String(R) }, free: true }), answer: S, show: fmt(S), ...pi,
            solution: `Dairə: 3,14 · ${R * R} = ${fmt(c)}. Kvadratın diaqonalı 2R = ${2 * R}, sahəsi d² / 2 = ${2 * R * R}. Fərq: ${fmt(c)} − ${2 * R * R} = ${fmt(S)}.` };
        }
        const m = rnd(1, 12), sub = Math.random() < .5;
        if (sub) return { text: `Kvadratın sahəsi ${4 * m * m}. Onun içinə çəkilmiş (tərəflərə toxunan) dairənin sahəsi kπ-dir. k-nı tap.`, answer: m * m, show: String(m * m), tol: 0.01,
          solution: `Tərəf = √${4 * m * m} = ${2 * m}, dairənin radiusu ${m}. S = π · ${m}² = ${m * m}π, k = ${m * m}.` };
        return { text: `Kvadratın tərəfi ${2 * m}. Ona xaricə çəkilmiş dairənin sahəsi kπ-dir. k-nı tap.`, answer: 2 * m * m, show: String(2 * m * m), tol: 0.01,
          solution: `Radius — diaqonalın yarısı: R = ${2 * m}√2 / 2 = ${m === 1 ? "" : m}√2. S = πR² = ${2 * m * m}π, k = ${2 * m * m}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Mətnli məsələ: əvvəl sahəni tap, sonra qiymətə, kafel sayına və s. keç. Vahidlərə diqqət: 1 m² = 10 000 sm².",
      gen() {
        const t = pick(["boya", "torpaq", "pizza", "cigir", "kafel", "uc"]);
        if (t === "boya") {
          let a, b, c, d, k; do { a = rnd(4, 9); b = rnd(3, 4); c = rnd(1, 2); d = 2; k = pick([2, 3, 4, 5]); } while ((a * b - c * d) % k);
          const ans = (a * b - c * d) / k;
          return { text: `Divarın eni ${a} m, hündürlüyü ${b} m. Divarda ${c} m × ${d} m ölçülü qapı var (rənglənmir). 1 litr boya ${k} m² üçün kifayət edir. Neçə litr boya lazımdır?`, answer: ans, show: String(ans), unit: "litr", tol: 0.01,
            solution: `Rənglənən sahə: ${a} · ${b} − ${c} · ${d} = ${a * b} − ${c * d} = ${a * b - c * d} m². Boya: ${a * b - c * d} : ${k} = ${ans} litr.` };
        }
        if (t === "torpaq") {
          let a, b, hh; do { a = 10 * rnd(2, 8); b = a + 10 * rnd(1, 6); hh = 10 * rnd(2, 6); } while (((a + b) * hh / 2) % 100);
          const S = (a + b) * hh / 2;
          return { text: `Torpaq sahəsi trapesiya şəklindədir: paralel tərəfləri ${a} m və ${b} m, aralarındakı məsafə ${hh} m. Sahə neçə sotdur? (1 sot = 100 m².)`, answer: S / 100, show: String(S / 100), unit: "sot", tol: 0.01,
            solution: `S = (${a} + ${b}) / 2 · ${hh} = ${(a + b) / 2} · ${hh} = ${S} m² = ${S / 100} sot.` };
        }
        if (t === "pizza") {
          const d = 2 * rnd(10, 20), n = pick([4, 6, 8]), r2 = d * d / 4;
          return { text: `Diametri ${d} sm olan pizza ${n} bərabər dilimə bölünüb. Bir dilimin sahəsi kπ sm²-dir. k-nı tap.`, answer: r2 / n, show: frac(r2, n), placeholder: "məs. 50 və ya 225/2",
            solution: `R = ${d / 2} sm, bütün pizza π · ${d / 2}² = ${r2}π sm². Bir dilim: ${r2}π : ${n} = ${kpi(frac(r2, n))}. k = ${frac(r2, n)}.` };
        }
        if (t === "cigir") {
          const R = rnd(2, 10), w = rnd(1, 3), S = Math.round(3.14 * ((R + w) ** 2 - R * R) * 100) / 100;
          return { text: `Radiusu ${R} m olan dairəvi gül sahəsinin ətrafında eni ${w} m olan cığır salınıb. Cığırın sahəsi neçə m²-dir? (π ≈ 3,14)`, answer: S, show: fmt(S) + " m²", unit: "m²", ...pi,
            solution: `Cığır — halqadır: böyük radius ${R + w}, kiçik ${R}. S = 3,14 · (${(R + w) ** 2} − ${R * R}) = 3,14 · ${(R + w) ** 2 - R * R} = ${fmt(S)} m².` };
        }
        if (t === "kafel") {
          const [ta, tb] = pick([[20, 20], [25, 25], [20, 25], [25, 40], [50, 50], [20, 50]]);
          let a, b; do { a = rnd(2, 8); b = rnd(2, 6); } while ((a * b * 10000) % (ta * tb));
          const n = a * b * 10000 / (ta * tb);
          return { text: `Döşəmə ${a} m × ${b} m ölçülü düzbucaqlıdır. Onu ${ta} sm × ${tb} sm ölçülü kafellərlə örtmək üçün neçə kafel lazımdır?`, answer: n, show: String(n), unit: "kafel", tol: 0.01,
            solution: `Döşəmə: ${a * b} m² = ${a * b * 10000} sm². Bir kafel: ${ta} · ${tb} = ${ta * tb} sm². Say: ${a * b * 10000} : ${ta * tb} = ${n}.` };
        }
        const [p, q, c] = triple(60), k = pick([2, 3, 5]);
        return { text: `Düzbucaqlı üçbucaq şəklində qazonun katetləri ${p} m və ${q} m. Hər m²-ə ${k} q toxum səpilir. Neçə qram toxum lazımdır?`, answer: p * q / 2 * k, show: String(p * q / 2 * k), unit: "q", tol: 0.01,
          solution: `S = ${p} · ${q} / 2 = ${p * q / 2} m². Toxum: ${p * q / 2} · ${k} = ${p * q / 2 * k} q.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const t = pick(["uc", "trap", "daire", "sektor"]), bad = rnd(0, 2);
        let task, st, wrong, why;
        if (t === "uc") {
          const [p, q, c] = triple(40);
          task = `Məsələ: düzbucaqlı üçbucağın hipotenuzu ${c}, bir kateti ${p}. Sahəsini tap.`;
          st = [`O biri katet: √(${c}² − ${p}²) = ${q}.`, `Düzbucaqlı üçbucaqda S = a · b / 2 (a, b — katetlər).`, `S = ${p} · ${q} / 2 = ${p * q / 2}.`];
          wrong = [`O biri katet: √(${c}² + ${p}²) = √${c * c + p * p}.`, `Düzbucaqlı üçbucaqda S = a · c / 2 (a — katet, c — hipotenuz).`, `S = ${p} · ${q} = ${p * q}.`];
          why = [`1-ci addımda səhv var: katet tapılanda kvadratlar çıxılır: √(${c * c} − ${p * p}) = ${q}.`, `2-ci addımda səhv var: hipotenuz katetə perpendikulyar deyil; sahə katetlərin hasilinin yarısıdır.`, `3-cü addımda səhv var: 2-yə bölmək unudulub: ${p * q} / 2 = ${p * q / 2}.`];
        } else if (t === "trap") {
          const [x, y, c] = triple(30), a = rnd(2, 12), b = a + 2 * x;
          task = `Məsələ: bərabəryanlı trapesiyanın oturacaqları ${a} və ${b}, yan tərəfi ${c}. Sahəsini tap.`;
          st = [`Yan tərəfin proyeksiyası: (${b} − ${a}) / 2 = ${x}.`, `Hündürlük: √(${c}² − ${x}²) = ${y}.`, `S = (${a} + ${b}) / 2 · ${y} = ${(a + b) / 2 * y}.`];
          wrong = [`Yan tərəfin proyeksiyası: ${b} − ${a} = ${2 * x}.`, `Hündürlük yan tərəfə bərabərdir: h = ${c}.`, `S = (${a} + ${b}) · ${y} = ${(a + b) * y}.`];
          why = [`1-ci addımda səhv var: fərq iki yana bərabər bölünür: (${b} − ${a}) / 2 = ${x}.`, `2-ci addımda səhv var: yan tərəf maildir, hündürlük deyil: h = √(${c * c} − ${x * x}) = ${y}.`, `3-cü addımda səhv var: oturacaqların cəmi 2-yə bölünməlidir: ${(a + b) / 2 * y}.`];
        } else if (t === "daire") {
          const d = 2 * rnd(2, 12), R = d / 2;
          task = `Məsələ: dairənin diametri ${d}. Sahəsi kπ-dir, k-nı tap.`;
          st = [`Radius = ${d} / 2 = ${R}.`, `S = πR².`, `S = π · ${R}² = ${R * R}π, k = ${R * R}.`];
          wrong = [`Radius = ${d}.`, `S = 2πR.`, `S = π · ${R}² = ${2 * R}π, k = ${2 * R}.`];
          why = [`1-ci addımda səhv var: radius diametrin yarısıdır: ${R}.`, `2-ci addımda səhv var: 2πR çevrənin uzunluğudur; sahə πR²-dir.`, `3-cü addımda səhv var: ${R}² = ${R * R}, ${2 * R} yox.`];
        } else {
          const R = rnd(2, 12), al = pick([45, 60, 90, 120]), k = frac(R * R * al, 360);
          task = `Məsələ: radiusu ${R} olan dairənin ${al}°-lik sektorunun sahəsi kπ-dir. k-nı tap.`;
          st = [`Bütöv dairə: π · ${R}² = ${R * R}π.`, `Sektor dairənin ${al}/360 hissəsidir.`, `S = ${R * R}π · ${al} / 360 = ${kpi(k)}, k = ${k}.`];
          wrong = [`Bütöv dairə: π · ${R} = ${R}π.`, `Sektor dairənin ${al}/180 hissəsidir.`, `S = ${R * R}π · ${al} / 360 = ${kpi(frac(R * R * al, 180))}, k = ${frac(R * R * al, 180)}.`];
          why = [`1-ci addımda səhv var: radius kvadrata yüksəldilməlidir: ${R * R}π.`, `2-ci addımda səhv var: tam dairə 360°-dir, ona görə hissə ${al}/360.`, `3-cü addımda hesab səhvdir: ${R * R} · ${al} / 360 = ${k}.`];
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
      key: "saheler", title: "Sahələr", fenn: "riyaziyyat", link: "dersler/saheler.html",
      format: "Cavab — ədəd. Kök: 6√3, kəsr: 35/2, onluq (π ≈ 3,14 olanda): 28,26. \"kπ, k-nı tap\" sualında yalnız k-nı yaz.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ucbucaq", "ucbucaq", "paralel", "trapesiya", "trapesiya", "daire", "daire", "murekkeb", "murekkeb", "heyat"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/saheler.html")) b.push("dersler/saheler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
