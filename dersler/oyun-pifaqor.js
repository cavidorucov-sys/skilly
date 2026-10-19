// Pifaqor teoremi — mastery game levels (theorem, converse and triples, rectangle/square diagonal, heights, projections) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const frac = (p, q) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : (p / g) + "/" + (q / g); };
  const isSq = n => Number.isInteger(Math.sqrt(n));
  // √n → [k, m] with n = k²·m, m square-free
  const sq = n => { let k = 1; for (let i = 2; i * i <= n; i++) while (n % (i * i) === 0) { n /= i * i; k *= i; } return [k, n]; };
  const rt = n => { const [k, m] = sq(n); return m === 1 ? String(k) : (k === 1 ? "" : k) + "√" + m; };          // √n simplified: 2√13
  const rtF = (n, d) => { const [k, m] = sq(n), g = gcd(k, d); if (m === 1) return frac(k, d); const K = k / g, D = d / g; return (K === 1 ? "" : K) + "√" + m + (D === 1 ? "" : "/" + D); }; // √n/d
  const BASE = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  const TRIPLES = []; for (const [p, q, c] of BASE) for (let k = 1; c * k <= 60; k++) TRIPLES.push([p * k, q * k, c * k]);
  // legs a < b, hypotenuse c ≤ maxC; legs randomly swapped when asked
  const triple = (maxC, swap = true) => { const [p, q, c] = pick(TRIPLES.filter(t => t[2] <= maxC)); return swap && Math.random() < .5 ? [q, p, c] : [p, q, c]; };
  const isTriple = (x, y, z) => { const s = [x, y, z].sort((a, b) => a - b); return s[0] * s[0] + s[1] * s[1] === s[2] * s[2]; };
  // leg value → list of [other leg, hypotenuse] (for two obliques from one point)
  const BYLEG = {}; for (const [p, q, c] of TRIPLES) { (BYLEG[p] = BYLEG[p] || []).push([q, c]); (BYLEG[q] = BYLEG[q] || []).push([p, c]); }
  const SHARED = Object.keys(BYLEG).filter(k => BYLEG[k].length >= 2 && +k <= 24).map(Number);
  const eqs = (a, b) => a === b ? a : a + " = " + b;   // "√85 = √85" → "√85"
  const fmt = n => String(Math.round(n * 100) / 100).replace(".", ",");

  // ---- figure: points in math coordinates (y up); random quarter-turn rotation and mirror
  // o: { poly, names?, place?, segs:[[p,q,"dash"|"acc"|"ink"]], lab:{PQ:text}, right:[[v,p,q]], arcs:[[v,p,q,text]] }
  const INK = "#17171a", ACC = "#534ab7", RED = "#a32d2d";
  function figure(P, o) {
    const W = 280, H = 200, pad = 34;
    const r = pick(o.rot || [0, 1, 2, 3]) * Math.PI / 2, flip = Math.random() < .5 ? -1 : 1;
    const Q = {};
    for (const k in P) { const x = P[k][0] * flip, y = P[k][1]; Q[k] = [x * Math.cos(r) - y * Math.sin(r), -(x * Math.sin(r) + y * Math.cos(r))]; }
    const xs = Object.values(Q).map(p => p[0]), ys = Object.values(Q).map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min((W - 2 * pad) / ((x1 - x0) || 1), (H - 2 * pad) / ((y1 - y0) || 1));
    const ox = (W - s * (x1 - x0)) / 2 - s * x0, oy = (H - s * (y1 - y0)) / 2 - s * y0;
    for (const k in Q) Q[k] = [ox + s * Q[k][0], oy + s * Q[k][1]];
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": o.aria || "Fiqur" });
    const cen = [0, 1].map(i => o.poly.reduce((t, k) => t + Q[k][i], 0) / o.poly.length);
    g.append(sv("polygon", { points: o.poly.map(k => Q[k].join(",")).join(" "), fill: "#eeedfe", stroke: INK, "stroke-width": 2, "stroke-linejoin": "round" }));
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
    for (const [v, p, q, t, rr] of o.arcs || []) {
      const V = Q[v], R = rr || 18, ang = k => Math.atan2(Q[k][1] - V[1], Q[k][0] - V[0]);
      let t1 = ang(p), t2 = ang(q); if (Math.abs(t2 - t1) > Math.PI) t2 += t2 < t1 ? 2 * Math.PI : -2 * Math.PI;
      const pts = Array.from({ length: 11 }, (_, i) => { const t = t1 + (t2 - t1) * i / 10; return (V[0] + R * Math.cos(t)) + " " + (V[1] + R * Math.sin(t)); });
      g.append(sv("path", { d: "M" + pts.join("L"), fill: "none", stroke: ACC, "stroke-width": 2 }));
      if (t) { const tm = (t1 + t2) / 2; g.append(sv("text", { x: V[0] + (R + 16) * Math.cos(tm), y: V[1] + (R + 16) * Math.sin(tm) + 4, "text-anchor": "middle", class: "oy-lbl", style: "fill:" + ACC + ";font-size:12px" }, t)); }
    }
    for (const key in o.lab || {}) {
      const [p, q] = key.split(""), m = [(Q[p][0] + Q[q][0]) / 2, (Q[p][1] + Q[q][1]) / 2];
      const d = [Q[q][0] - Q[p][0], Q[q][1] - Q[p][1]], L = Math.hypot(...d) || 1;
      let n = [-d[1] / L, d[0] / L];
      const out = [m[0] - cen[0], m[1] - cen[1]];
      if (Math.hypot(...out) > 6 ? n[0] * out[0] + n[1] * out[1] < 0 : n[1] > 0) n = [-n[0], -n[1]];
      g.append(sv("text", { x: m[0] + n[0] * 14, y: m[1] + n[1] * 14 + 5, "text-anchor": "middle", class: "oy-lbl" }, o.lab[key]));
    }
    const unit = v => { const L = Math.hypot(...v) || 1; return [v[0] / L, v[1] / L]; };
    for (const k of o.names || o.poly) {
      let d = [Q[k][0] - cen[0], Q[k][1] - cen[1]], L = Math.hypot(...d);
      if (L < 4) { d = [1, -1]; L = Math.SQRT2; }
      const pl = (o.place || {})[k];
      if (pl) { const t = unit([Q[pl[0]][0] - Q[k][0], Q[pl[0]][1] - Q[k][1]]), rr = unit(pl[1] === "in" ? [-d[0], -d[1]] : d); d = [t[0] + rr[0], t[1] + rr[1]]; L = Math.hypot(...d) || 1; }
      g.append(sv("text", { x: Q[k][0] + d[0] / L * 15, y: Q[k][1] + d[1] / L * 15 + 5, "text-anchor": "middle", class: "oy-lbl", style: "fill:#5f5e5a;font-style:italic" }, k));
    }
    return g;
  }
  const NAMES = [["A", "B", "C"], ["M", "N", "K"], ["P", "Q", "R"], ["D", "E", "F"]];
  // right triangle: Z — right vertex, legs ZX = b (along x), ZY = a (along y)
  const rightTri = (X, Y, Z, a, b, lab) => figure({ [Z]: [0, 0], [X]: [b, 0], [Y]: [0, a] }, { poly: [X, Y, Z], right: [[Z, X, Y]], lab, aria: "Düzbucaqlı üçbucaq" });
  const steps = (task, list) => h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...list.map(s => h("li", {}, s))));
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];

  const levels = [
    { id: "hipotenuz", ad: "Pifaqor teoremi", izah: "c² = a² + b²: hipotenuzun kvadratı katetlərin kvadratları cəminə bərabərdir. Katet: a² = c² − b². Cavab kök ola bilər (məs. 2√13).",
      gen() {
        const [X, Y, Z] = pick(NAMES), kind = pick(["hip", "hip", "kat", "kat", "kok", "kok"]);
        let a, b, N, ask;            // a = YZ, b = XZ (legs), hypotenuse XY
        if (kind === "hip") { [a, b] = triple(50); ask = "c"; }
        else if (kind === "kat") { const t = triple(50); [a, b] = t; ask = pick(["a", "b"]); }
        else if (Math.random() < .5) { do { a = rnd(1, 12); b = rnd(1, 12); } while (isSq(a * a + b * b)); ask = "c"; }
        else { let c; do { c = rnd(3, 15); b = rnd(1, c - 1); } while (isSq(c * c - b * b)); a = Math.sqrt(c * c - b * b); ask = "a"; return leg(c, b, "a"); }
        if (ask === "c") {
          N = a * a + b * b;
          return { text: `${X}${Y}${Z} üçbucağında ∠${Z} = 90°, ${X}${Z} = ${b}, ${Y}${Z} = ${a}. ${X}${Y} hipotenuzunu tap.`, svg: rightTri(X, Y, Z, a, b, { [X + Z]: String(b), [Y + Z]: String(a), [X + Y]: "?" }),
            answer: Math.sqrt(N), show: rt(N),
            solution: `${X}${Y}² = ${X}${Z}² + ${Y}${Z}² = ${b}² + ${a}² = ${b * b} + ${a * a} = ${N}. ${X}${Y} = ${eqs("√" + N, rt(N))}.` };
        }
        return leg(Math.round(Math.hypot(a, b)), ask === "a" ? b : a, ask);
        // c — hypotenuse, k — known leg; the unknown leg is YZ (ask "a") or XZ (ask "b")
        function leg(c, k, which) {
          const M = c * c - k * k, u = Math.sqrt(M);
          const [kn, un] = which === "a" ? [X + Z, Y + Z] : [Y + Z, X + Z];
          const lab = { [X + Y]: String(c), [kn]: String(k), [un]: "?" };
          const fa = which === "a" ? u : k, fb = which === "a" ? k : u;
          return { text: `${X}${Y}${Z} üçbucağında ∠${Z} = 90°, hipotenuz ${X}${Y} = ${c}, katet ${kn} = ${k}. ${un} katetini tap.`, svg: rightTri(X, Y, Z, fa, fb, lab),
            answer: u, show: rt(M),
            solution: `${un}² = ${X}${Y}² − ${kn}² = ${c}² − ${k}² = ${c * c} − ${k * k} = ${M}. ${un} = ${eqs("√" + M, rt(M))}.` };
        }
      } },

    { id: "ters", ad: "Tərs teorem, üçlüklər", izah: "Ən böyük tərəfin kvadratı qalan ikisinin kvadratları cəminə bərabərdirsə — üçbucaq düzbucaqlıdır. Kiçikdirsə — itibucaqlı, böyükdürsə — korbucaqlı.",
      gen() {
        const kind = pick(["nov", "nov", "x", "hansi"]);
        if (kind === "nov") {
          const NOV = ["Düzbucaqlı", "İtibucaqlı", "Korbucaqlı"];
          let s;
          do {
            const [p, q, c] = triple(30, false), t = rnd(0, 2);
            s = [p, q, t === 0 ? c : t === 1 ? c - rnd(1, 2) : c + rnd(1, 2)].sort((x, y) => x - y);
          } while (s[0] + s[1] <= s[2]);
          const L = s[2] * s[2], R = s[0] * s[0] + s[1] * s[1], correct = L === R ? 0 : L < R ? 1 : 2;
          return { text: `Tərəfləri ${shuffle(s).join(", ")} olan üçbucaq hansı növdür?`, choices: NOV, correct, show: NOV[correct],
            solution: `Ən böyük tərəf ${s[2]}: ${s[2]}² = ${L}. Qalan ikisi: ${s[0]}² + ${s[1]}² = ${s[0] * s[0]} + ${s[1] * s[1]} = ${R}. ${L} ${L === R ? "=" : L < R ? "<" : ">"} ${R} → ${["düzbucaqlı", "itibucaqlı", "korbucaqlı"][correct]} üçbucaq.` };
        }
        if (kind === "x") {
          const [p, q, c] = triple(45, false), d1 = q - p, d2 = c - p, B = 2 * (d2 - d1), C = d2 * d2 - d1 * d1;
          return { text: `Düzbucaqlı üçbucağın katetləri: x və x + ${d1}, hipotenuzu: x + ${d2}. x-i tap.`, answer: p, show: String(p), tol: 0.01,
            solution: `Pifaqor: x² + (x + ${d1})² = (x + ${d2})² → 2x² + ${2 * d1 === 1 ? "" : 2 * d1}x + ${d1 * d1} = x² + ${2 * d2}x + ${d2 * d2} → x² − ${B}x − ${C} = 0. Kökləri ${p} və mənfi ədəd (atılır). Yoxla: ${p}² + ${q}² = ${p * p + q * q} = ${c}² ✓. x = ${p}.` };
        }
        // which triple is Pythagorean
        const good = triple(45, false), opts = [good.slice()];
        while (opts.length < 4) {
          const t = pick(TRIPLES.filter(x => x[2] <= 45)).slice(), i = rnd(0, 2); t[i] += pick([-1, 1]);
          const st = t.slice().sort((x, y) => x - y);
          if (st[0] > 0 && !isTriple(...st) && !opts.some(o => o.join() === st.join())) opts.push(st);
        }
        const sh = shuffle(opts), correct = sh.findIndex(o => o === opts[0]), [p, q, c] = sh[correct];
        return { text: "Hansı üç ədəd düzbucaqlı üçbucağın tərəfləri ola bilər?", choices: sh.map(o => o.join("; ")), correct, show: sh[correct].join("; "),
          solution: `Yoxla: ən kiçik ikisinin kvadratları cəmi ən böyüyünün kvadratına bərabər olmalıdır. ${p}² + ${q}² = ${p * p} + ${q * q} = ${p * p + q * q} = ${c}² ✓. Qalan üçlüklərdə bərabərlik ödənmir.` };
      } },

    { id: "diaqonal", ad: "Düzbucaqlı və kvadrat", izah: "Düzbucaqlının diaqonalı: d² = a² + b². Kvadratın diaqonalı: d = a√2, deməli a = d/√2.",
      gen() {
        const kind = pick(["rd", "rs", "rp", "kd", "ks", "kS"]);
        const R = (a, b, lab) => figure({ A: [0, 0], B: [0, b], C: [a, b], D: [a, 0] }, { poly: ["A", "B", "C", "D"], segs: [["A", "C", "acc"]], right: [["D", "A", "C"]], lab, aria: "Düzbucaqlı və onun diaqonalı" });
        if (kind === "rd" || kind === "rs" || kind === "rp") {
          const [a, b, c] = triple(50);      // AD = a, AB = b, AC = c
          if (kind === "rd") return { text: `ABCD düzbucaqlısında AD = ${a}, AB = ${b}. AC diaqonalını tap.`, svg: R(a, b, { AD: String(a), AB: String(b), AC: "?" }),
            answer: c, show: String(c), tol: 0.01, solution: `ACD düzbucaqlı üçbucaqdır (∠D = 90°): AC² = AD² + DC² = ${a}² + ${b}² = ${a * a + b * b} → AC = ${c}.` };
          if (kind === "rs") return { text: `ABCD düzbucaqlısında AC diaqonalı ${c}, AD tərəfi ${a}. AB tərəfini tap.`, svg: R(a, b, { AD: String(a), AB: "?", AC: String(c) }),
            answer: b, show: String(b), tol: 0.01, solution: `ACD üçbucağında: DC² = AC² − AD² = ${c}² − ${a}² = ${c * c - a * a} → DC = ${b}. AB = DC = ${b}.` };
          const per = Math.random() < .5, ans = per ? 2 * (a + b) : a * b;
          return { text: `Düzbucaqlının diaqonalı ${c}, bir tərəfi ${a}. Düzbucaqlının ${per ? "perimetrini" : "sahəsini"} tap.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `İkinci tərəf: √(${c}² − ${a}²) = √${c * c - a * a} = ${b}. ` + (per ? `P = 2(${a} + ${b}) = ${ans}.` : `S = ${a} · ${b} = ${ans}.`) };
        }
        const K = a => figure({ A: [0, 0], B: [0, 1], C: [1, 1], D: [1, 0] }, { poly: ["A", "B", "C", "D"], segs: [["B", "D", "acc"]], right: [["A", "B", "D"]], lab: a });
        if (kind === "kd") {
          const a = rnd(2, 15);
          return { text: `Kvadratın tərəfi ${a}. Onun diaqonalını tap.`, svg: K({ AD: String(a), BD: "?" }), answer: a * Math.SQRT2, show: rt(2 * a * a),
            solution: `d² = ${a}² + ${a}² = ${2 * a * a} → d = ${a}√2.` };
        }
        if (kind === "ks") {
          if (Math.random() < .5) { const m = rnd(2, 14);
            return { text: `Kvadratın diaqonalı ${m}√2-dir. Kvadratın tərəfini tap.`, svg: K({ AD: "?", BD: m + "√2" }), answer: m, show: String(m), tol: 0.01,
              solution: `d = a√2 → ${m}√2 = a√2 → a = ${m}. (Yoxla: a² + a² = ${2 * m * m} = (${m}√2)² ✓.)` }; }
          const m = rnd(1, 10), d = 2 * m;
          return { text: `Kvadratın diaqonalı ${d}. Kvadratın tərəfini tap.`, svg: K({ AD: "?", BD: String(d) }), answer: m * Math.SQRT2, show: rt(2 * m * m),
            solution: `a² + a² = ${d}² → 2a² = ${d * d} → a² = ${d * d / 2} → a = ${eqs("√" + d * d / 2, rt(2 * m * m))}.` };
        }
        const d = rnd(2, 20);
        return { text: `Kvadratın diaqonalı ${d}. Kvadratın sahəsini tap.`, answer: d * d / 2, show: frac(d * d, 2),
          solution: `a² + a² = d² → 2a² = ${d * d} → S = a² = ${eqs(d * d + "/2", frac(d * d, 2))}. (Qısa yol: kvadratın sahəsi = d²/2.)` };
      } },

    { id: "hundurluk", ad: "Hündürlük və mail", izah: "Bərabəryanlı üçbucağın hündürlüyü oturacağı yarıya bölür: h² = b² − (a/2)². Bərabərtərəfli: h = a√3/2. Mail² = perpendikulyar² + proyeksiya².",
      gen() {
        const kind = pick(["bh", "bb", "bS", "eh", "ea", "eS", "mail", "mail2"]);
        const iso = (half, hh, lab) => figure({ A: [-half, 0], B: [0, hh], C: [half, 0], H: [0, 0] }, { poly: ["A", "B", "C"], names: ["A", "B", "C", "H"], segs: [["B", "H", "dash"]], right: [["H", "C", "B"]], lab, rot: [0, 2] });
        if (kind === "bh" || kind === "bb" || kind === "bS") {
          let hh, half, b;
          if (Math.random() < .7) [hh, half, b] = triple(40); else { do { b = rnd(3, 15); half = rnd(1, b - 1); } while (isSq(b * b - half * half)); hh = Math.sqrt(b * b - half * half); }
          const H2 = b * b - half * half;
          if (kind === "bh") return { text: `ABC üçbucağında AB = BC = ${b}, AC = ${2 * half}. B təpəsindən çəkilmiş BH hündürlüyünü tap.`, svg: iso(half, hh, { AB: String(b), AC: String(2 * half), BH: "?" }),
            answer: hh, show: rt(H2), solution: `Bərabəryanlı üçbucaqda hündürlük həm də mediandır: AH = ${2 * half} : 2 = ${half}. BH² = AB² − AH² = ${b * b} − ${half * half} = ${H2} → BH = ${eqs("√" + H2, rt(H2))}.` };
          if (kind === "bS") { const S2 = half * half * H2; // S = half · h
            return { text: `Bərabəryanlı üçbucağın yan tərəfi ${b}, oturacağı ${2 * half}. Üçbucağın sahəsini tap.`, answer: half * hh, show: rt(S2),
              solution: `h² = ${b}² − ${half}² = ${H2} → h = ${rt(H2)}. S = ${2 * half} · h / 2 = ${half} · ${rt(H2)} = ${rt(S2)}.` }; }
          if (!Number.isInteger(hh)) [hh, half, b] = triple(40);
          return { text: `Bərabəryanlı üçbucağın yan tərəfi ${b}, oturacağa çəkilmiş hündürlüyü ${hh}. Oturacağı tap.`, svg: iso(half, hh, { AB: String(b), AC: "?", BH: String(hh) }),
            answer: 2 * half, show: String(2 * half), tol: 0.01, solution: `AH² = AB² − BH² = ${b * b} − ${hh * hh} = ${half * half} → AH = ${half}. Hündürlük oturacağı yarıya bölür: AC = 2 · ${half} = ${2 * half}.` };
        }
        const eq = (lab) => iso(1, Math.sqrt(3), lab);
        if (kind === "eh") { const a = rnd(2, 16);
          return { text: `Bərabərtərəfli üçbucağın tərəfi ${a}. Onun hündürlüyünü tap.`, svg: eq({ AB: String(a), BH: "?" }), answer: a * Math.sqrt(3) / 2, show: rtF(3 * a * a, 2),
            solution: `Hündürlük tərəfi yarıya bölür: h² = ${a}² − (${frac(a, 2)})² = ${a * a} − ${frac(a * a, 4)} = ${frac(3 * a * a, 4)} → h = ${eqs(a + "√3/2", rtF(3 * a * a, 2))}.` }; }
        if (kind === "ea") {
          if (Math.random() < .6) { const k = rnd(1, 10);
            return { text: `Bərabərtərəfli üçbucağın hündürlüyü ${k === 1 ? "" : k}√3-dür. Onun tərəfini tap.`, svg: eq({ AB: "?", BH: (k === 1 ? "" : k) + "√3" }), answer: 2 * k, show: String(2 * k), tol: 0.01,
              solution: `h = a√3/2 → a = 2h/√3 = 2 · ${k === 1 ? "" : k}√3 / √3 = ${2 * k}.` }; }
          const hh = rnd(2, 12);
          return { text: `Bərabərtərəfli üçbucağın hündürlüyü ${hh}. Onun tərəfini tap.`, svg: eq({ AB: "?", BH: String(hh) }), answer: 2 * hh / Math.sqrt(3), show: rtF(12 * hh * hh, 3),
            solution: `h = a√3/2 → a = 2h/√3 = ${2 * hh}/√3 = ${eqs(2 * hh + "√3/3", rtF(12 * hh * hh, 3))}.` };
        }
        if (kind === "eS") { const a = rnd(2, 12);
          return { text: `Bərabərtərəfli üçbucağın tərəfi ${a}. Onun sahəsini tap.`, answer: a * a * Math.sqrt(3) / 4, show: rtF(3 * a ** 4, 4),
            solution: `h = ${a}√3/2. S = a · h / 2 = ${a} · ${a}√3/2 / 2 = ${eqs(a * a + "√3/4", rtF(3 * a ** 4, 4))}.` }; }
        const M = (p1, d, p2, lab) => figure({ M: [0, d], H: [0, 0], A: [p1, 0], ...(p2 != null ? { B: [-p2, 0] } : {}) }, { poly: p2 != null ? ["M", "A", "B"] : ["M", "H", "A"], names: p2 != null ? ["M", "H", "A", "B"] : ["M", "H", "A"], segs: [["M", "H", "dash"]], right: [["H", "A", "M"]], lab, rot: [0, 2] });
        if (kind === "mail") {
          const [d, p, m] = triple(40), askP = Math.random() < .5;
          return { text: askP ? `M nöqtəsindən düz xəttə MH perpendikulyarı və MA maili çəkilib. MH = ${d}, MA = ${m}. Mailin HA proyeksiyasını tap.`
              : `M nöqtəsindən düz xəttə MH perpendikulyarı və MA maili çəkilib. MH = ${d}, mailin proyeksiyası HA = ${p}. MA mailini tap.`,
            svg: M(p, d, null, { MH: String(d), MA: askP ? String(m) : "?", HA: askP ? "?" : String(p) }), answer: askP ? p : m, show: String(askP ? p : m), tol: 0.01,
            solution: askP ? `MHA düzbucaqlı üçbucaqdır: HA² = MA² − MH² = ${m * m} − ${d * d} = ${p * p} → HA = ${p}.` : `MHA düzbucaqlı üçbucaqdır: MA² = MH² + HA² = ${d * d} + ${p * p} = ${m * m} → MA = ${m}.` };
        }
        const d = pick(SHARED), [[p1, m1], [p2, m2]] = shuffle(BYLEG[d]).slice(0, 2);
        return { text: `M nöqtəsindən düz xəttə MA və MB mailləri çəkilib, MH — perpendikulyardır. MA = ${m1}, proyeksiyalar: HA = ${p1}, HB = ${p2}. MB mailini tap.`,
          svg: M(p1, d, p2, { MA: String(m1), MB: "?", HA: String(p1), HB: String(p2) }), answer: m2, show: String(m2), tol: 0.01,
          solution: `Əvvəl perpendikulyar: MH² = MA² − HA² = ${m1 * m1} − ${p1 * p1} = ${d * d}. Sonra MB² = MH² + HB² = ${d * d} + ${p2 * p2} = ${m2 * m2} → MB = ${m2}.` };
      } },

    { id: "proyeksiya", ad: "Hipotenuza hündürlük", izah: "∠C = 90°, CH — hipotenuza hündürlük. CH² = AH · HB, AC² = AB · AH, BC² = AB · BH, CH = AC · BC / AB.",
      gen() {
        const kind = pick(["h", "p", "kat", "proj", "hab", "c"]);
        // figure from projections p = AH, q = HB
        const fig = (p, q, lab) => { const c = p + q, b = Math.sqrt(p * c), a = Math.sqrt(q * c), t = b * b / (c * c);
          return figure({ C: [0, 0], A: [b, 0], B: [0, a], H: [b * (1 - t), a * t] }, { poly: ["A", "B", "C"], names: ["A", "B", "C", "H"], segs: [["C", "H", "acc"]], right: [["C", "A", "B"], ["H", "C", "B"]], lab, aria: "Düzbucaqlı üçbucaq və hipotenuza çəkilmiş hündürlük" }); };
        const base = "ABC üçbucağında ∠C = 90°, CH — hipotenuza çəkilmiş hündürlükdür. ";
        let t, m, n; do { t = rnd(1, 4); m = rnd(1, 4); n = rnd(1, 5); } while (m === n || t * m * n > 24);
        const p = t * m * m, q = t * n * n, hh = t * m * n;
        if (kind === "h") return { text: base + `AH = ${p}, HB = ${q}. CH hündürlüyünü tap.`, svg: fig(p, q, { AH: String(p), HB: String(q), CH: "?" }), answer: hh, show: String(hh), tol: 0.01,
          solution: `CH² = AH · HB = ${p} · ${q} = ${p * q} → CH = ${hh}.` };
        if (kind === "p") return { text: base + `CH = ${hh}, HB = ${q}. AH parçasını tap.`, svg: fig(p, q, { AH: "?", HB: String(q), CH: String(hh) }), answer: p, show: String(p), tol: 0.01,
          solution: `CH² = AH · HB → ${hh * hh} = AH · ${q} → AH = ${hh * hh} : ${q} = ${p}.` };
        if (kind === "c") return { text: base + `CH = ${hh}, AH = ${p}. AB hipotenuzunu tap.`, svg: fig(p, q, { AH: String(p), CH: String(hh), HB: "?" }), answer: p + q, show: String(p + q), tol: 0.01,
          solution: `HB = CH² : AH = ${hh * hh} : ${p} = ${q}. AB = AH + HB = ${p} + ${q} = ${p + q}.` };
        if (kind === "kat") { const c = p + q, N = c * p;
          return { text: base + `AB = ${c}, AH = ${p}. AC katetini tap.`, svg: fig(p, q, { AH: String(p), AC: "?" }), answer: Math.sqrt(N), show: rt(N),
            solution: `Katet hipotenuzla öz proyeksiyası arasında orta mütənasibdir: AC² = AB · AH = ${c} · ${p} = ${N} → AC = ${eqs("√" + N, rt(N))}.` }; }
        let [a, b, c] = pick(TRIPLES.filter(t => t[2] <= 30 && t[2] % 5 === 0));   // BC = a, AC = b, AB = c (c ⋮ 5 → finite decimals)
        if (Math.random() < .5) [a, b] = [b, a];
        if (kind === "proj") return { text: base + `AC = ${b}, AB = ${c}. AH parçasını tap.`, svg: fig(b * b / c, a * a / c, { AC: String(b), AH: "?" }), answer: b * b / c, show: frac(b * b, c),
          solution: `AC² = AB · AH → AH = AC² : AB = ${eqs(b * b + " : " + c, frac(b * b, c))}.` };
        return { text: base + `AC = ${b}, BC = ${a}. CH hündürlüyünü tap.`, svg: fig(b * b / c, a * a / c, { AC: String(b), BC: String(a), CH: "?" }), answer: a * b / c, show: frac(a * b, c),
          solution: `AB = √(${b}² + ${a}²) = ${c}. Sahəni iki cür yaz: AC · BC / 2 = AB · CH / 2 → CH = ${b} · ${a} / ${c} = ${frac(a * b, c)}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Məsələdə düz bucağı tap (divar və yer, şimal və şərq, ekranın küncü), sonra Pifaqoru yaz.",
      gen() {
        const kind = pick(["nerdivan", "ekran", "masin", "park", "direk"]);
        if (kind === "nerdivan") { const [d, hh, L] = triple(25, false); const lo = Math.random() < .5 ? [d, hh] : [hh, d];
          return { text: `Uzunluğu ${L} m olan nərdivan şaquli divara söykənib. Nərdivanın aşağı ucu divardan ${lo[0]} m aralıdır. Nərdivanın yuxarı ucu yerdən hansı hündürlükdədir?`, answer: lo[1], unit: "m", show: String(lo[1]), tol: 0.01,
            solution: `Divar, yer və nərdivan düzbucaqlı üçbucaqdır, nərdivan — hipotenuz. h² = ${L}² − ${lo[0]}² = ${L * L} − ${lo[0] * lo[0]} = ${lo[1] * lo[1]} → h = ${lo[1]} m.` }; }
        if (kind === "ekran") { const k = pick([4, 6, 8, 10, 12, 14, 16]), [w, hh, d] = [4 * k, 3 * k, 5 * k], askD = Math.random() < .5;
          return askD ? { text: `Televizor ekranının eni ${w} sm, hündürlüyü ${hh} sm-dir. Ekranın diaqonalı neçə santimetrdir?`, answer: d, unit: "sm", show: String(d), tol: 0.01,
              solution: `d² = ${w}² + ${hh}² = ${w * w} + ${hh * hh} = ${d * d} → d = ${d} sm.` }
            : { text: `Ekranın diaqonalı ${d} sm, eni ${w} sm-dir. Ekranın hündürlüyü neçə santimetrdir?`, answer: hh, unit: "sm", show: String(hh), tol: 0.01,
              solution: `h² = ${d}² − ${w}² = ${d * d} − ${w * w} = ${hh * hh} → h = ${hh} sm.` }; }
        if (kind === "masin") { let p, q, c, s, t; do { [p, q, c] = triple(17); s = rnd(2, 12); t = rnd(1, 3); } while (p * s > 120 || q * s > 120 || c * s * t > 300);
          return { text: `İki maşın eyni anda yol ayrıcından çıxdı: biri şimala ${p * s} km/saat, digəri şərqə ${q * s} km/saat sürətlə. ${t} saatdan sonra aralarındakı məsafə neçə km olar?`, answer: c * s * t, unit: "km", show: String(c * s * t), tol: 0.01,
            solution: `${t} saatda biri ${p * s * t} km, digəri ${q * s * t} km gedir; yollar perpendikulyardır. Məsafə = √(${p * s * t}² + ${q * s * t}²) = ${c * s * t} km.` }; }
        if (kind === "park") { const t = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]), k = rnd(2, Math.floor(300 / (t[0] + t[1]))), [a, b, c] = t.map(x => x * k);
          return { text: `Düzbucaqlı parkın tərəfləri ${a} m və ${b} m-dir. Əli küncdən qarşı küncə kənarlarla yox, diaqonal cığırla getdi. O, neçə metr az yol getdi?`, answer: a + b - c, unit: "m", show: String(a + b - c), tol: 0.01,
            solution: `Kənarlarla: ${a} + ${b} = ${a + b} m. Diaqonal: √(${a}² + ${b}²) = ${c} m. Fərq: ${a + b} − ${c} = ${a + b - c} m.` }; }
        const [d, hh, L] = triple(30, Math.random() < .5);
        return { text: `Hündürlüyü ${hh} m olan dirəyin başından yerə dartılmış trosun ucu dirəyin dibindən ${d} m aralıda bərkidilib. Trosun uzunluğu neçə metrdir?`, answer: L, unit: "m", show: String(L), tol: 0.01,
          solution: `Dirək yerə perpendikulyardır. Tros — hipotenuz: √(${hh}² + ${d}²) = √${hh * hh + d * d} = ${L} m.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const kind = pick(["hip", "kat", "proj"]), bad = rnd(0, 2);
        let task, st, why;
        if (kind === "hip") {
          const [a, b, c] = triple(30), N = c * c;
          task = `ABC üçbucağında ∠C = 90°, AC = ${a}, BC = ${b}. AB hipotenuzunu tap.`;
          st = [`AB² = AC² + BC²`, `AB² = ${a}² + ${b}² = ${a * a} + ${b * b} = ${N}`, `AB = √${N} = ${c}`];
          if (bad === 0) st[0] = pick([`AB² = AC² − BC²`, `AB = AC + BC`]);
          if (bad === 1) st[1] = `AB² = ${a}² + ${b}² = ${2 * a} + ${2 * b} = ${2 * a + 2 * b}`;
          if (bad === 2) st[2] = `AB = ${N} : 2 = ${frac(N, 2)}`;
          why = [`1-ci addım: hipotenuzun kvadratı katetlərin kvadratları cəminə bərabərdir: AB² = AC² + BC².`,
            `2-ci addım: kvadrat 2-yə vurmaq deyil: ${a}² = ${a * a}, ${b}² = ${b * b}, cəmi ${N}.`,
            `3-cü addım: AB² = ${N}-dən kvadrat kök almaq lazımdır: AB = √${N} = ${c}.`][bad];
        } else if (kind === "kat") {
          const [a, b, c] = triple(30);
          task = `Düzbucaqlı üçbucağın hipotenuzu ${c}, bir kateti ${a}. O biri kateti tap.`;
          st = [`b² = c² − a²`, `b² = ${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b}`, `b = √${b * b} = ${b}`];
          if (bad === 0) st[0] = `b² = c² + a²`;
          if (bad === 1) st[1] = `b² = ${c}² − ${a}² = (${c} − ${a})² = ${(c - a) ** 2}`;
          if (bad === 2) st[2] = `b = ${b * b} : 2 = ${frac(b * b, 2)}`;
          why = [`1-ci addım: katet hipotenuzdan kiçikdir, ona görə kvadratlar çıxılır: b² = c² − a².`,
            `2-ci addım: c² − a² ≠ (c − a)². Düzü: ${c * c} − ${a * a} = ${b * b}.`,
            `3-cü addım: kökü almaq lazımdır: b = √${b * b} = ${b}.`][bad];
        } else {
          let t, m, n; do { t = rnd(1, 3); m = rnd(1, 4); n = rnd(1, 4); } while (m === n);
          const p = t * m * m, q = t * n * n, hh = t * m * n;
          task = `Düzbucaqlı üçbucaqda hipotenuza çəkilmiş CH hündürlüyü onu AH = ${p} və HB = ${q} parçalarına bölür. CH hündürlüyünü tap.`;
          st = [`CH² = AH · HB`, `CH² = ${p} · ${q} = ${p * q}`, `CH = √${p * q} = ${hh}`];
          if (bad === 0) st[0] = pick([`CH² = AH + HB`, `CH² = AH² + HB²`]);
          if (bad === 1) st[1] = `CH² = ${p} · ${q} = ${p * q + pick([-2, 2, 4])}`;
          if (bad === 2) st[2] = `CH = ${p * q} : 2 = ${frac(p * q, 2)}`;
          why = [`1-ci addım: hipotenuza çəkilmiş hündürlüyün kvadratı parçaların hasilinə bərabərdir: CH² = AH · HB.`,
            `2-ci addım: hesab səhvi: ${p} · ${q} = ${p * q}.`,
            `3-cü addım: CH = √${p * q} = ${hh}.`][bad];
        }
        return { text: steps(task, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "pifaqor", title: "Pifaqor teoremi", fenn: "riyaziyyat", link: "dersler/pifaqor.html",
      format: "Cavab — ədəd: tərəf, hündürlük, sahə. Kök: 2√13, 5√3/2; kəsr: 18/5 (onluq 3,6 də olar).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["hipotenuz", "hipotenuz", "ters", "diaqonal", "hundurluk", "hundurluk", "proyeksiya", "proyeksiya", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/pifaqor.html")) b.push("dersler/pifaqor.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
