// Oxşar üçbucaqlar — mastery game levels (corresponding sides, criteria, perimeter/area ratio, line parallel to a side,
// right-triangle altitude, shadow problems, find-the-mistake) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (p, q) => { const g = gcd(p, q) || 1; return q / g === 1 ? String(p / g) : (p / g) + "/" + (q / g); };
  const fmt = n => String(Math.round(n * 100) / 100).replace(".", ",");
  // √n simplified: 12 → "2√3", 16 → "4", 7 → "√7"
  const root = n => { let k = 1; for (let d = 2; d * d <= n; d++) while (n % (d * d) === 0) { n /= d * d; k *= d; } return n === 1 ? String(k) : (k === 1 ? "" : k) + "√" + n; };
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const INK = "var(--ink)", ACC = "var(--accent)", SOFT = "var(--accent-soft)", MUT = "var(--muted)";

  // ---- figure: points in math coordinates (y up), random mirror; polys get a soft fill
  // o: { polys:[[names]], segs:[[p,q,"acc"|"dash"]], lab:[[p,q,text]], right:[[v,p,q]], arcs:[[v,p,q,text,r]], names:[...], W, H }
  function figure(P, o) {
    const W = o.W || 300, H = o.H || 190, pad = 30, flip = o.noflip ? 1 : (Math.random() < .5 ? -1 : 1);
    const Q = {};
    for (const k in P) Q[k] = [P[k][0] * flip, -P[k][1]];
    const xs = Object.values(Q).map(p => p[0]), ys = Object.values(Q).map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min((W - 2 * pad) / ((x1 - x0) || 1), (H - 2 * pad) / ((y1 - y0) || 1));
    const ox = (W - s * (x1 - x0)) / 2 - s * x0, oy = (H - s * (y1 - y0)) / 2 - s * y0;
    for (const k in Q) Q[k] = [ox + s * Q[k][0], oy + s * Q[k][1]];
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": o.aria || "Üçbucaqlar" });
    const polys = o.polys || [];
    const cenOf = names => [0, 1].map(i => names.reduce((t, k) => t + Q[k][i], 0) / names.length);
    const owner = (p, q) => polys.find(pl => pl.includes(p) && (q == null || pl.includes(q))) || Object.keys(Q);
    for (const pl of polys) g.append(sv("polygon", { points: pl.map(k => Q[k].join(",")).join(" "), fill: SOFT, stroke: INK, "stroke-width": 2, "stroke-linejoin": "round" }));
    for (const [p, q, st] of o.segs || []) {
      const a = { x1: Q[p][0], y1: Q[p][1], x2: Q[q][0], y2: Q[q][1], stroke: st === "acc" ? ACC : INK, "stroke-width": st === "dash" ? 1.5 : 2.5, "stroke-linecap": "round" };
      if (st === "dash") a["stroke-dasharray"] = "5 4";
      g.append(sv("line", a));
    }
    for (const [v, p, q] of o.right || []) {
      const u = k => { const d = [Q[k][0] - Q[v][0], Q[k][1] - Q[v][1]], L = Math.hypot(...d); return [d[0] / L * 9, d[1] / L * 9]; };
      const a = u(p), b = u(q), V = Q[v];
      g.append(sv("path", { d: `M${V[0] + a[0]} ${V[1] + a[1]}L${V[0] + a[0] + b[0]} ${V[1] + a[1] + b[1]}L${V[0] + b[0]} ${V[1] + b[1]}`, fill: "none", stroke: INK, "stroke-width": 1.3 }));
    }
    for (const [v, p, q, t, rr] of o.arcs || []) {
      const V = Q[v], R = rr || 16, ang = k => Math.atan2(Q[k][1] - V[1], Q[k][0] - V[0]);
      let t1 = ang(p), t2 = ang(q); if (Math.abs(t2 - t1) > Math.PI) t2 += t2 < t1 ? 2 * Math.PI : -2 * Math.PI;
      const pts = Array.from({ length: 11 }, (_, i) => { const t = t1 + (t2 - t1) * i / 10; return (V[0] + R * Math.cos(t)) + " " + (V[1] + R * Math.sin(t)); });
      g.append(sv("path", { d: "M" + pts.join("L"), fill: "none", stroke: ACC, "stroke-width": 2 }));
      if (t) { const tm = (t1 + t2) / 2; g.append(sv("text", { x: V[0] + (R + 14) * Math.cos(tm), y: V[1] + (R + 14) * Math.sin(tm) + 4, "text-anchor": "middle", class: "oy-lbl", style: "fill:var(--accent);font-size:12px" }, t)); }
    }
    for (const [p, q, t, ofs] of o.lab || []) {
      const m = [(Q[p][0] + Q[q][0]) / 2, (Q[p][1] + Q[q][1]) / 2], d = [Q[q][0] - Q[p][0], Q[q][1] - Q[p][1]], L = Math.hypot(...d) || 1;
      let n = [-d[1] / L, d[0] / L];
      const c = cenOf(owner(p, q)), out = [m[0] - c[0], m[1] - c[1]];
      if (n[0] * out[0] + n[1] * out[1] < 0) n = [-n[0], -n[1]];
      const off = ofs || (o.farShort && L < 40 ? 28 : 13); // opt-in: a short side puts its length farther out, away from the point letters
      g.append(sv("text", { x: m[0] + n[0] * off, y: m[1] + n[1] * off + 5, "text-anchor": "middle", class: "oy-lbl" }, t));
    }
    for (const k of o.names || Object.keys(P)) {
      const c = cenOf((o.nameIn || {})[k] || owner(k)); let d = [Q[k][0] - c[0], Q[k][1] - c[1]], L = Math.hypot(...d);
      if (L < 4) { d = [1, -1]; L = Math.SQRT2; }
      g.append(sv("text", { x: Q[k][0] + d[0] / L * 14, y: Q[k][1] + d[1] / L * 14 + 5, "text-anchor": "middle", class: "oy-lbl", style: "fill:" + MUT + ";font-style:italic" }, k));
    }
    return g;
  }
  // triangle from sides: a = BC, b = AC, c = AB; A at origin, B on the x axis
  const triXY = (a, b, c, s = 1, dx = 0) => { const x = (b * b + c * c - a * a) / (2 * c), y = Math.sqrt(Math.max(b * b - x * x, .01)); return [[dx, 0], [dx + c * s, 0], [dx + x * s, y * s]]; };
  const SHAPES = [[3, 4, 5], [4, 5, 6], [5, 6, 7], [2, 3, 4], [3, 5, 7], [4, 6, 7], [5, 7, 8], [3, 4, 6], [6, 7, 9], [4, 7, 9], [5, 5, 6], [5, 8, 9]];
  const PAIRS = [[2, 3], [3, 2], [2, 5], [5, 2], [3, 4], [4, 3], [3, 5], [5, 3], [4, 5], [5, 4], [2, 4], [4, 2], [1, 2], [2, 1], [1, 3], [3, 1], [4, 6], [6, 4]];
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];

  const levels = [
    { id: "teref", ad: "Uyğun tərəflər", izah: "ΔABC ~ ΔKLM: hərflərin sırası uyğunluğu göstərir (A↔K, B↔L, C↔M). Uyğun tərəflərin nisbəti eynidir — k.",
      gen() {
        const sh = pick(SHAPES).slice().sort(() => Math.random() - .5), [u, v] = pick(PAIRS);
        const [a, b, c] = sh; // BC, AC, AB of the base shape
        const AB = [["AB", "KL", c], ["BC", "LM", a], ["AC", "KM", b]];
        const i = rnd(0, 2); let j = rnd(0, 2); while (j === i) j = rnd(0, 2);
        const giv = AB[i], ask = AB[j], third = AB[3 - i - j];
        const showThird = Math.random() < .5;
        const [A, B, C] = triXY(a * u, b * u, c * u), w = c * u * 1.25;
        const [K, L, M] = triXY(a * v, b * v, c * v, 1, w + c * u * .2);
        const lab = [[giv[0][0], giv[0][1], String(giv[2] * u)], [giv[1][0], giv[1][1], String(giv[2] * v)], [ask[0][0], ask[0][1], String(ask[2] * u)], [ask[1][0], ask[1][1], "?"]];
        if (showThird) lab.push([third[0][0], third[0][1], String(third[2] * u)]);
        return { text: `ΔABC ~ ΔKLM. ${giv[0]} = ${giv[2] * u}, ${giv[1]} = ${giv[2] * v}, ${ask[0]} = ${ask[2] * u}${showThird ? `, ${third[0]} = ${third[2] * u}` : ""}. ${ask[1]} = ?`,
          svg: figure({ A, B, C, K, L, M }, { polys: [["A", "B", "C"], ["K", "L", "M"]], lab, noflip: true }),
          answer: ask[2] * v, show: String(ask[2] * v), tol: 0.01,
          solution: `Uyğun tərəflər: ${giv[0]} ↔ ${giv[1]}, ${ask[0]} ↔ ${ask[1]}. k = ${giv[1]}/${giv[0]} = ${giv[2] * v}/${giv[2] * u} = ${frac(v, u)}. ${ask[1]} = ${ask[2] * u} · ${frac(v, u)} = ${ask[2] * v}.` };
      } },
    { id: "elamet", ad: "Oxşarlıq əlaməti", izah: "Verilənlərə bax: iki bucaq bərabərdir (I), iki tərəf mütənasib və aralarındakı bucaq bərabərdir (II), üç tərəf mütənasibdir (III). Heç biri ödənmirsə — oxşar deyil.",
      gen() {
        const CH = ["I əlamət (iki bucaq)", "II əlamət (iki tərəf və aralarındakı bucaq)", "III əlamət (üç tərəf)", "Oxşar deyil"];
        const kind = rnd(0, 2), broken = Math.random() < .3;
        const [u, v] = pick(PAIRS.filter(p => p[0] !== p[1]));
        let text, sol, correct = broken ? 3 : kind;
        if (kind === 0) {
          const al = rnd(5, 16) * 5, be = rnd(5, 16) * 5, ga = 180 - al - be;
          if (ga < 20) return this.gen();
          const shown = broken ? ga + pick([-10, -5, 5, 10]) : ga;
          if (broken && [al, 180 - al - shown, shown].sort((x, y) => x - y).join() === [al, be, ga].sort((x, y) => x - y).join()) return this.gen();
          text = `ΔABC-də ∠A = ${al}°, ∠B = ${be}°. ΔKLM-də ∠K = ${al}°, ∠M = ${shown}°. Üçbucaqlar oxşardırmı? Əgər oxşardırsa, hansı əlamətlə?`;
          sol = `ΔABC-də ∠C = 180° − ${al}° − ${be}° = ${ga}°. ` + (broken ? `ΔKLM-də ∠M = ${shown}° ≠ ${ga}°, ∠L = ${180 - al - shown}° ≠ ${be}°. Bucaqlar uyğun gəlmir — oxşar deyil.` : `∠K = ∠A və ∠M = ∠C — iki bucaq bərabərdir. I əlamət.`);
        } else if (kind === 1) {
          const [p, q] = [rnd(2, 7), rnd(2, 9)], al = rnd(4, 24) * 5, al2 = broken && Math.random() < .5 ? al + pick([-10, 10, 15]) : al;
          const q2 = broken && al2 === al ? q * v + 1 : q * v;
          text = `ΔABC-də AB = ${p * u}, AC = ${q * u}, ∠A = ${al}°. ΔKLM-də KL = ${p * v}, KM = ${q2}, ∠K = ${al2}°. Üçbucaqlar oxşardırmı? Əgər oxşardırsa, hansı əlamətlə?`;
          sol = `KL/AB = ${frac(p * v, p * u)}, KM/AC = ${frac(q2, q * u)}. ` + (!broken ? `Nisbətlər bərabərdir və ∠K = ∠A (bu bucaq həmin tərəflərin arasındadır). II əlamət.` : al2 !== al ? `Nisbətlər bərabərdir, amma ∠K = ${al2}° ≠ ∠A = ${al}°. Oxşar deyil.` : `Nisbətlər fərqlidir — tərəflər mütənasib deyil. Oxşar deyil.`);
        } else {
          const sh = pick(SHAPES), bad = broken ? rnd(0, 2) : -1, s2 = sh.map((x, i) => x * v + (i === bad ? 1 : 0));
          text = `ΔABC-nin tərəfləri ${sh.map(x => x * u).join(", ")}; ΔKLM-in tərəfləri ${s2.join(", ")}. Üçbucaqlar oxşardırmı? Əgər oxşardırsa, hansı əlamətlə?`;
          sol = `Kiçikdən böyüyə uyğun tərəfləri böl: ${sh.map((x, i) => `${s2[i]}/${x * u} = ${frac(s2[i], x * u)}`).join("; ")}. ` + (broken ? `Nisbətlər eyni deyil — oxşar deyil.` : `Üç nisbət eynidir — III əlamət.`);
        }
        return { text, choices: CH, correct, show: CH[correct], solution: sol };
      } },
    { id: "sahe", ad: "Perimetr k, sahə k²", izah: "Oxşarlıq əmsalı k olanda perimetrlərin nisbəti k, sahələrin nisbəti k²-dir.",
      gen() {
        const [u, v] = pick(PAIRS), a = rnd(1, 4), kind = pick(["P", "S", "S", "side", "ratio"]);
        if (kind === "P") {
          const p = rnd(3, 12);
          return { text: `ΔABC ~ ΔKLM, AB = ${a * u}, KL = ${a * v}. ΔABC-nin perimetri ${p * u}-dir. ΔKLM-in perimetrini tap.`, answer: p * v, show: String(p * v), tol: 0.01,
            solution: `k = KL/AB = ${frac(v, u)}. Perimetrlərin nisbəti k-dır: P = ${p * u} · ${frac(v, u)} = ${p * v}.` };
        }
        if (kind === "S") {
          const s = rnd(1, 6);
          return { text: `ΔABC ~ ΔKLM, AB = ${a * u}, KL = ${a * v}. ΔABC-nin sahəsi ${s * u * u}-dir. ΔKLM-in sahəsini tap.`, answer: s * v * v, show: String(s * v * v), tol: 0.01,
            solution: `k = KL/AB = ${frac(v, u)}. Sahələrin nisbəti k²-dir: S = ${s * u * u} · ${frac(v * v, u * u)} = ${s * v * v}. (k ilə vursan ${fmt(s * u * v)} alınardı — səhvdir.)` };
        }
        if (kind === "side") {
          const s = rnd(1, 5);
          return { text: `İki oxşar üçbucağın sahələri ${s * u * u} və ${s * v * v}-dir. Birincinin bir tərəfi ${a * u}-dir. İkincinin ona uyğun tərəfini tap.`, answer: a * v, show: String(a * v), tol: 0.01,
            solution: `k² = ${s * v * v}/${s * u * u} = ${frac(v * v, u * u)} → k = ${frac(v, u)}. Tərəf = ${a * u} · ${frac(v, u)} = ${a * v}.` };
        }
        const m = rnd(1, 3);
        return { text: `İki oxşar üçbucağın sahələrinin nisbəti ${m * u * u} : ${m * v * v} kimidir. Onların perimetrlərinin nisbətini tap (birincinin ikinciyə nisbəti).`, answer: u / v, show: frac(u, v), placeholder: "məs. 2/3",
          solution: `k² = ${frac(u * u, v * v)} → k = √(${frac(u * u, v * v)}) = ${frac(u, v)}. Perimetrlərin nisbəti k-dır: ${frac(u, v)}.` };
      } },
    { id: "paralel", ad: "Tərəfə paralel düz xətt", izah: "MN ∥ AC olsa, ΔMBN ~ ΔABC. Diqqət: k = BM/BA (bütöv tərəf!), BM/MA yox.",
      gen() {
        let m = rnd(1, 5), n = rnd(1, 5); const g = gcd(m, n); m /= g; n /= g;
        const t = rnd(2, 5), kind = pick(["MN", "MN", "NC", "MA"]);
        const P = { A: [0, 0], C: [6, 0], B: [rnd(15, 40) / 10, 4.2] };
        const f = m / (m + n), M = [P.B[0] + (P.A[0] - P.B[0]) * f, P.B[1] + (P.A[1] - P.B[1]) * f], N = [P.B[0] + (P.C[0] - P.B[0]) * f, P.B[1] + (P.C[1] - P.B[1]) * f];
        const fig = lab => figure({ ...P, M, N }, { polys: [["A", "B", "C"]], segs: [["M", "N", "acc"]], lab, nameIn: { M: ["A", "B", "C"], N: ["A", "B", "C"] } });
        if (kind === "MN") {
          const AC = (m + n) * t;
          return { text: `ΔABC-də M ∈ AB, N ∈ BC və MN ∥ AC. BM = ${m}, MA = ${n}, AC = ${AC}. MN = ?`, svg: fig([["B", "M", String(m)], ["M", "A", String(n)], ["A", "C", String(AC)], ["M", "N", "?"]]),
            answer: m * t, show: String(m * t), tol: 0.01,
            solution: `ΔMBN ~ ΔABC (∠B ortaq, ∠BMN = ∠BAC — uyğun bucaqlar). BA = ${m} + ${n} = ${m + n}, k = BM/BA = ${frac(m, m + n)}. MN = ${AC} · ${frac(m, m + n)} = ${m * t}.` };
        }
        if (kind === "NC") {
          const BN = m * t;
          return { text: `ΔABC-də M ∈ AB, N ∈ BC və MN ∥ AC. BM = ${m}, MA = ${n}, BN = ${BN}. NC = ?`, svg: fig([["B", "M", String(m)], ["M", "A", String(n)], ["B", "N", String(BN)], ["N", "C", "?"]]),
            answer: n * t, show: String(n * t), tol: 0.01,
            solution: `Paralel düz xətt tərəfləri mütənasib bölür: BM/MA = BN/NC → ${m}/${n} = ${BN}/NC → NC = ${BN} · ${n}/${m} = ${n * t}.` };
        }
        const s = rnd(2, 4), BM = m * s, MN = m * t, AC = (m + n) * t;
        return { text: `ΔABC-də M ∈ AB, N ∈ BC və MN ∥ AC. BM = ${BM}, MN = ${MN}, AC = ${AC}. MA = ?`, svg: fig([["B", "M", String(BM)], ["M", "N", String(MN)], ["A", "C", String(AC)], ["M", "A", "?"]]),
          answer: n * s, show: String(n * s), tol: 0.01,
          solution: `ΔMBN ~ ΔABC: BA/BM = AC/MN = ${AC}/${MN} = ${frac(m + n, m)}. BA = ${BM} · ${frac(m + n, m)} = ${(m + n) * s}. MA = BA − BM = ${(m + n) * s} − ${BM} = ${n * s}.` };
      } },
    { id: "duzbucaqli", ad: "Düzbucaqlı üçbucaq: hündürlük", izah: "∠C = 90°, CH — hipotenuza hündürlük. CH² = AH · HB, AC² = AH · AB, BC² = HB · AB.",
      gen() {
        const kind = pick(["CH", "AC", "HB", "AB"]);
        let p, q; // AH = p, HB = q
        if (kind === "CH") { const k = rnd(1, 3), a = rnd(1, 4); let b = rnd(1, 4); while (b === a) b = rnd(1, 5); p = k * a * a; q = k * b * b; }
        else { p = rnd(1, 9); q = rnd(1, 12); }
        const c = p + q, hx = p, hy = Math.sqrt(p * q);
        const P = { A: [0, 0], B: [c, 0], C: [hx, hy], H: [hx, 0] };
        const fig = lab => figure(P, { polys: [["A", "B", "C"]], segs: [["C", "H", "acc"]], right: [["C", "A", "B"], ["H", "B", "C"]], lab, nameIn: { H: ["A", "B", "C"] } });
        if (kind === "CH") {
          const ans = root(p * q);
          return { text: `ΔABC-də ∠C = 90°, CH — hipotenuza çəkilmiş hündürlükdür. AH = ${p}, HB = ${q}. CH = ?`, svg: fig([["A", "H", String(p)], ["H", "B", String(q)], ["C", "H", "?"]]),
            answer: Math.sqrt(p * q), show: ans, solution: `ΔACH ~ ΔCBH → CH² = AH · HB = ${p} · ${q} = ${p * q}. CH = ${ans}.` };
        }
        if (kind === "AC") {
          const ans = root(p * c);
          return { text: `ΔABC-də ∠C = 90°, CH — hipotenuza çəkilmiş hündürlükdür. AH = ${p}, AB = ${c}. AC = ?`, svg: fig([["A", "H", String(p)], ["A", "B", String(c)], ["A", "C", "?"]]),
            answer: Math.sqrt(p * c), show: ans, solution: `ΔACH ~ ΔABC → AC² = AH · AB = ${p} · ${c} = ${p * c}. AC = ${ans}.` };
        }
        if (kind === "HB") {
          let a = rnd(1, 4), r = rnd(2, 6); const AH = a * a, CH = a * r; // HB = CH²/AH = r²
          const P2 = { A: [0, 0], B: [AH + r * r, 0], C: [AH, CH], H: [AH, 0] };
          return { text: `ΔABC-də ∠C = 90°, CH — hipotenuza çəkilmiş hündürlükdür. CH = ${CH}, AH = ${AH}. HB = ?`,
            svg: figure(P2, { polys: [["A", "B", "C"]], segs: [["C", "H", "acc"]], right: [["C", "A", "B"], ["H", "B", "C"]], lab: [["C", "H", String(CH)], ["A", "H", String(AH)], ["H", "B", "?"]], nameIn: { H: ["A", "B", "C"] } }),
            answer: r * r, show: String(r * r), tol: 0.01, solution: `CH² = AH · HB → ${CH * CH} = ${AH} · HB → HB = ${CH * CH}/${AH} = ${r * r}.` };
        }
        // AB from AC and AH: AB = AC²/AH; pick AH | AC²
        const AH = pick([1, 2, 3, 4, 5]), m = rnd(2, 5) * AH, AC = m, AB = AC * AC / AH;
        if (AB <= AH + 1 || AB > 80) return this.gen();
        const P3 = { A: [0, 0], B: [AB, 0], C: [AH, Math.sqrt(AH * (AB - AH))], H: [AH, 0] };
        return { text: `ΔABC-də ∠C = 90°, CH — hipotenuza çəkilmiş hündürlükdür. AC = ${AC}, AH = ${AH}. AB = ?`,
          svg: figure(P3, { polys: [["A", "B", "C"]], segs: [["C", "H", "acc"]], right: [["C", "A", "B"], ["H", "B", "C"]], lab: [["A", "C", String(AC)], ["A", "H", String(AH)], ["A", "B", "?"]], nameIn: { H: ["A", "B", "C"] } }),
          answer: AB, show: String(AB), tol: 0.01, solution: `AC² = AH · AB → ${AC * AC} = ${AH} · AB → AB = ${AC * AC}/${AH} = ${AB}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Günəş şüaları paraleldir: dirək və onun kölgəsi, ağac və onun kölgəsi oxşar düzbucaqlı üçbucaqlar yaradır.",
      gen() {
        const kind = pick(["kolge", "kolge", "fener", "foto"]);
        if (kind === "kolge") {
          const h0 = pick([1.2, 1.5, 1.6, 1.8, 2, 2.5, 3]), s = pick([1, 2, 3, 4]), t = rnd(3, 9), S = s * t, H = h0 * t;
          return { text: `Hündürlüyü ${fmt(h0)} m olan dirəyin kölgəsi ${s} m-dir. Eyni vaxtda ağacın kölgəsi ${S} m-dir. Ağacın hündürlüyü neçə metrdir?`, answer: H, show: fmt(H), unit: "m",
            solution: `Oxşar üçbucaqlar: hündürlük/kölgə nisbəti eynidir. H/${S} = ${fmt(h0)}/${s} → H = ${fmt(h0)} · ${S}/${s} = ${fmt(H)} m.` };
        }
        if (kind === "fener") {
          const h0 = pick([1.5, 1.6, 1.8, 2]), x = rnd(1, 4), t = rnd(1, 4), d = x * t, H = h0 * (1 + t);
          return { text: `Boyu ${fmt(h0)} m olan oğlan fənər dirəyindən ${d} m aralıda dayanıb. Onun kölgəsinin uzunluğu ${x} m-dir. Fənər neçə metr hündürlükdədir?`, answer: H, show: fmt(H), unit: "m",
            solution: `Kölgənin ucundan fənər dirəyinin dibinə qədər ${x} + ${d} = ${x + d} m. Oxşar üçbucaqlar: H/${x + d} = ${fmt(h0)}/${x} → H = ${fmt(h0)} · ${x + d}/${x} = ${fmt(H)} m.` };
        }
        const [a, b] = pick([[10, 15], [9, 13], [10, 16], [12, 18], [6, 9], [8, 12], [13, 18], [15, 20]]), k = pick([2, 3, 4, 1.5, 2.5]);
        const A = a * k, B = b * k;
        return { text: `${a} × ${b} sm ölçülü fotoşəkli oxşar formada böyütdülər: qısa tərəfi ${fmt(A)} sm oldu. Uzun tərəfi neçə sm olacaq?`, answer: B, show: fmt(B), unit: "sm",
          solution: `Oxşarlıq əmsalı k = ${fmt(A)}/${a} = ${fmt(k)}. Uzun tərəf: ${b} · ${fmt(k)} = ${fmt(B)} sm.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let m = rnd(1, 4), n = rnd(1, 5); while (n === m) n = rnd(1, 5); const g = gcd(m, n); m /= g; n /= g;
        const t = rnd(2, 4), AC = (m + n) * t, MN = m * t, bad = rnd(0, 2);
        const steps = [
          `ΔMBN ~ ΔABC, çünki ∠B ortaqdır və ∠BMN = ∠BAC (MN ∥ AC, uyğun bucaqlar).`,
          `k = BM/BA = ${m}/(${m} + ${n}) = ${frac(m, m + n)}.`,
          `MN = AC · k = ${AC} · ${frac(m, m + n)} = ${MN}.`,
        ];
        if (bad === 0) steps[0] = pick([`ΔMBN ~ ΔABC, çünki ∠B ortaqdır və ∠BMN = ∠BCA.`, `ΔMBN ~ ΔABC III əlamətə görə (üç tərəf mütənasibdir).`]);
        if (bad === 1) { steps[1] = `k = BM/MA = ${m}/${n}.`; steps[2] = `MN = AC · k = ${AC} · ${m}/${n} = ${fmt(AC * m / n)}.`; }
        if (bad === 2) steps[2] = pick([`MN = AC : k = ${AC} : ${frac(m, m + n)} = ${fmt(AC * (m + n) / m)}.`, `MN = AC · k² = ${AC} · ${frac(m * m, (m + n) * (m + n))} = ${fmt(AC * m * m / (m + n) / (m + n))}.`]);
        const text = h("div", {}, h("p", {}, `ΔABC-də MN ∥ AC (M ∈ AB, N ∈ BC). BM = ${m}, MA = ${n}, AC = ${AC}. MN = ?`),
          h("ol", { class: "oy-steps" }, ...steps.map(s => h("li", {}, s))));
        const why = [`1-ci addım: oxşarlıq I əlamətlə (iki bucaq) alınır: ∠B ortaqdır, ∠BMN = ∠BAC (uyğun bucaqlar). ∠BMN ∠BCA-ya bərabər deyil, üç tərəf isə verilməyib.`,
          `2-ci addım: k = BM/BA olmalıdır, BA = ${m + n}. BM/MA iki parçanın nisbətidir, oxşarlıq əmsalı deyil.`,
          `3-cü addım: kiçik üçbucağın tərəfi = böyüyün tərəfi · k. k² sahələr üçündür. Düz cavab MN = ${MN}.`][bad];
        return { text, choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (k instead of k², inverted k, BM/MA instead of BM/BA, missing root, ...).
  const { ae, again, num } = Oyun;
  const D = x => num(x);
  const nice = (x, dp = 2) => isFinite(x) && x > 0 && Math.abs(Math.round(x * 10 ** dp) - x * 10 ** dp) < 1e-7;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const shuf = a => a.slice().sort(() => Math.random() - .5);
  const r6 = x => Math.round(x * 1e6) / 1e6;
  // triangle ABC with MN ∥ AC (M ∈ AB, N ∈ BC, BM : MA = m : n); the trapezoid AMNC is shaded
  function parFig(m, n, lab, P0, W) {
    const P = P0 || { A: [0, 0], C: [6, 0], B: [rnd(15, 40) / 10, 4.2] }, f = m / (m + n);
    const at = X => [P.B[0] + (P[X][0] - P.B[0]) * f, P.B[1] + (P[X][1] - P.B[1]) * f];
    return figure({ ...P, M: at("A"), N: at("C") }, { polys: [["A", "M", "N", "C"]], segs: [["M", "B"], ["B", "N"], ["M", "N", "acc"]], lab, farShort: true, W });
  }
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. closed: perimeters give k; the corresponding side (the letters decide which one)
    { tip: "qapali", gen: () => again(() => {
      const [x1, x2, x3] = shuf(pick(SHAPES)), [u, v] = pick(PAIRS.filter(p => p[0] !== p[1])), AB = x1 * u, BC = x2 * u, AC = x3 * u, P1 = AB + BC + AC, P2 = (x1 + x2 + x3) * v;
      const R = x1 * v, w = [AB * u / v, BC * v / u, AB + P2 - P1, AB * v * v / (u * u)];
      if (![R, ...w].every(x => nice(x, 1))) return null;
      return mc(ae(R, w), { text: `ΔABC ~ ΔKLM, AB = ${AB}, BC = ${BC}, AC = ${AC}. ΔKLM-in perimetri ${P2} olsun. KL tərəfini tapın.`,
        solution: `P(ABC) = ${P1}. Perimetrlərin nisbəti k-dır: k = ${P2}/${P1} = ${frac(v, u)}. KL ↔ AB (hərflərin sırası): KL = ${AB} · ${frac(v, u)} = ${D(R)}. Tələlər: k-nı tərsinə götürmək (${D(w[0])}), KL-i BC-yə uyğun saymaq (${D(w[1])}), perimetrlərin fərqini tərəfə əlavə etmək (${D(w[2])}), k² ilə vurmaq (${D(w[3])}).` });
    }) },
    // 2. closed: area ratio is k²
    { tip: "qapali", gen: () => again(() => {
      const [u, v] = pick(PAIRS.filter(p => p[0] !== p[1])), a = rnd(1, 4), s = rnd(1, 6), S1 = s * u * u, R = s * v * v, k = v / u;
      const w = [S1 * k, S1 / k, S1 / (k * k), S1 + a * (v - u)];
      if (![R, ...w].every(x => nice(x, 1))) return null;
      return mc(ae(R, w), { text: `ΔABC ~ ΔKLM, AB = ${a * u}, KL = ${a * v}. ΔABC-nin sahəsi ${S1} olsun. ΔKLM-in sahəsini tapın.`,
        solution: `k = KL/AB = ${frac(v, u)}. Sahələrin nisbəti k²-dir: ${S1} · ${frac(v * v, u * u)} = ${D(R)}. Tələlər: sahəni k ilə vurmaq (${D(w[0])}), k-nı tərsinə götürüb kvadrata yüksəltməmək (${D(w[1])}), k-nı tərsinə götürmək, yəni (1/k)² ilə vurmaq (${D(w[2])}), tərəfin artımını sahəyə əlavə etmək (${D(w[3])}).` });
    }) },
    // 3. closed: MN ∥ AC, the area of the trapezoid AMNC
    { tip: "qapali", gen: () => again(() => {
      const m = rnd(1, 5), n = rnd(1, 5), t = rnd(1, 3), s = rnd(1, 6), T = m + n; if (m === n) return null;
      const S = s * T * T, R = s * (T * T - m * m), w = [s * m * m, s * n * T, s * (T * T - n * n), s * m * T];
      return mc(ae(R, w), { text: `ΔABC-də M ∈ AB, N ∈ BC və MN ∥ AC. BM = ${m * t}, MA = ${n * t}, ΔABC-nin sahəsi ${S} olsun. AMNC trapesiyasının sahəsini tapın.`,
        svg: parFig(m, n, [["B", "M", String(m * t)], ["M", "A", String(n * t)]]),
        solution: `ΔMBN ~ ΔABC, k = BM/BA = ${m * t}/${T * t} = ${frac(m, T)}. S(MBN) = ${S} · ${frac(m * m, T * T)} = ${s * m * m}. Trapesiya = ${S} − ${s * m * m} = ${R}. Tələlər: kiçik üçbucağın sahəsini cavab yazmaq (${s * m * m}), k-nı kvadrata yüksəltməmək: ${S} − ${S} · ${frac(m, T)} (${s * n * T}), k = MA/BA götürmək (${S} − ${s * n * n} = ${s * (T * T - n * n)}), kiçik üçbucağın sahəsini k ilə tapıb cavab yazmaq (${s * m * T}).` });
    }) },
    // 4. closed: ∠ACD = ∠ABC gives ΔACD ~ ΔABC, AC² = AD · AB
    { tip: "qapali", gen: () => again(() => {
      const [m, n] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]]), k = rnd(1, 4), a = m * m * k, c = n * n * k, d = c - a, R = m * n * k; if (c > 40) return null;
      const w = [c, a * c, a * d, d];
      const al = rnd(56, 74) * Math.PI / 180, b = Math.sqrt(a * c), P = { A: [0, 0], B: [c, 0], C: [b * Math.cos(al), b * Math.sin(al)], D: [a, 0] };
      return mc(ae(R, w), { text: `ΔABC-də D nöqtəsi AB tərəfi üzərindədir və ∠ACD = ∠ABC. AD = ${a}, DB = ${d}. AC tərəfini tapın.`,
        svg: figure(P, { polys: [["A", "B", "C"]], segs: [["C", "D", "acc"]], arcs: [["C", "A", "D", "α", 16], ["B", "A", "C", "α", 18]], lab: [["A", "D", String(a)], ["D", "B", String(d)]], farShort: true }),
        solution: `∠A ortaqdır, ∠ACD = ∠ABC → ΔACD ~ ΔABC (AC ↔ AB, AD ↔ AC). AC/AB = AD/AC → AC² = AD · AB. AB = ${a} + ${d} = ${c}, AC² = ${a} · ${c} = ${a * c}, AC = ${R}. Tələlər: AB-ni cavab yazmaq (${c}), kökü unutmaq (${a * c}), yanlış düsturla AC² = AD · DB yazıb kökü unutmaq (${a * d}), DB-ni götürmək (${d}).` });
    }) },
    // 5. closed: shadows, the ratio height : shadow is the same
    { tip: "qapali", gen: () => again(() => {
      const h0 = pick([1.2, 1.5, 1.6, 1.8, 2, 2.5]), s = pick([2, 3, 4, 5]), t = rnd(3, 9), S = s * t, R = r6(h0 * t);
      const w = [s * S / h0, h0 + S - s, h0 * S, S / s], f = x => D(x) + " m";
      if (![R, ...w].every(x => nice(x, 1))) return null;
      return mc(ae(R, w, f), { text: `Yer üfüqidir, dirək və ağac yerə şaquli dayanıb. Günəş şüalarını paralel sayın. Hündürlüyü ${D(h0)} m olan dirəyin kölgəsi ${s} m-dir. Eyni anda ağacın kölgəsi ${S} m-dir. Ağacın hündürlüyü neçə metrdir?`,
        solution: `Günəş şüaları paraleldir, düzbucaqlı üçbucaqlar oxşardır: H/${S} = ${D(h0)}/${s}. H = ${D(h0)} · ${S}/${s} = ${D(R)} m. Tələlər: nisbəti tərsinə yazmaq (${D(w[0])}), kölgələrin fərqini hündürlüyə əlavə etmək (${D(w[1])}), hündürlüyü kölgəyə vurmaq (${D(w[2])}), yalnız kölgələrin nisbətini yazmaq (${D(w[3])}).` });
    }) },
    // 6. closed: altitude to the hypotenuse, CH² = AH · HB
    { tip: "qapali", gen: () => again(() => {
      const k = rnd(1, 3), a = rnd(1, 4), b = rnd(1, 5); if (a === b) return null;
      const p = k * a * a, q = k * b * b, R = k * a * b, w = [p * q, (p + q) / 2, p + q, Math.abs(q - p)];
      if (![R, ...w].every(x => nice(x, 1))) return null;
      return mc(ae(R, w), { text: `ΔABC-də ∠C = 90°, CH — hipotenuza çəkilmiş hündürlükdür. AH = ${p}, HB = ${q}. CH-ı tapın.`,
        svg: figure({ A: [0, 0], B: [p + q, 0], C: [p, Math.sqrt(p * q)], H: [p, 0] }, { polys: [["A", "B", "C"]], segs: [["C", "H", "acc"]], right: [["C", "A", "B"], ["H", "B", "C"]], lab: [["A", "H", String(p)], ["H", "B", String(q)]], farShort: true, nameIn: { H: ["A", "B", "C"] } }),
        solution: `ΔACH ~ ΔCBH → CH² = AH · HB = ${p} · ${q} = ${p * q}, CH = ${R}. Tələlər: kökü unutmaq (${D(p * q)}), ədədi ortanı götürmək (${D((p + q) / 2)}), hipotenuzu AB = ${p + q} cavab yazmaq, parçaların fərqini götürmək (${D(Math.abs(q - p))}).` });
    }) },
    // 7. coded: ratio of segments gives k, perimeters
    { tip: "kod", gen: () => again(() => {
      const m = rnd(1, 5), n = rnd(1, 5), t = rnd(1, 4), r = rnd(Math.ceil(2.2 * t), 4 * t), p = m * r, R = (m + n) * r; if (m === n) return null; // P(MBN) = m·r > 2·BM = 2·m·t: the triangle exists
      return { text: `ΔABC-də M ∈ AB, N ∈ BC və MN ∥ AC. BM = ${m * t}, MA = ${n * t}. ΔMBN-in perimetri ${p} olsun. ΔABC-nin perimetrini tapın.`,
        svg: parFig(m, n, [["B", "M", String(m * t)], ["M", "A", String(n * t)]]),
        answer: R, show: String(R), tol: 1e-6, solution: `ΔMBN ~ ΔABC, k = BM/BA = ${m * t}/${(m + n) * t} = ${frac(m, m + n)} (MA-ya yox, bütün AB-yə bölünür). Perimetrlərin nisbəti k-dır: P(ABC) = ${p} : ${frac(m, m + n)} = ${R}.` };
    }) },
    // 8. coded: areas give k, perimeters
    { tip: "kod", gen: () => again(() => {
      const [u, v] = pick(PAIRS.filter(p => p[0] !== p[1])), [P0, S0] = pick([[12, 6], [30, 30], [16, 12], [24, 24], [40, 60], [18, 12], [42, 84]]), S1 = S0 * u * u, S2 = S0 * v * v, P1 = P0 * u, R = P0 * v; // sides (3,4,5), (5,12,13), (5,5,6), (6,8,10), (8,15,17), (5,5,8), (13,14,15)
      return { text: `İki oxşar üçbucağın sahələri ${S1} və ${S2} olsun. Sahəsi ${S1} olan üçbucağın perimetri ${P1} olsun. Digər üçbucağın perimetrini tapın.`,
        answer: R, show: String(R), tol: 1e-6, solution: `k² = ${S2}/${S1}${frac(S2, S1) === S2 + "/" + S1 ? "" : " = " + frac(S2, S1)} → k = ${frac(v, u)}. Perimetr uzunluq olduğuna görə k ilə vurulur: ${P1} · ${frac(v, u)} = ${R}. (k² ilə vursaydın səhv olardı.)` };
    }) },
    // 9. coded: lamp post, the shadow of the boy and the distance to the post
    { tip: "kod", gen: () => again(() => {
      const h0 = pick([1.5, 1.6, 1.8, 2]), x = rnd(1, 4), t = rnd(2, 5), d = x * t, R = r6(h0 * (1 + t));
      return { text: `Boyu ${D(h0)} m olan oğlan fənər dirəyindən ${d} m aralıda dayanıb. Onun kölgəsinin uzunluğu ${x} m-dir (kölgə dirəkdən uzağa düşür). Yer üfüqidir; oğlan və fənər dirəyi yerə şaquli dayanıb, fənər dirəyin zirvəsində nöqtəvi işıq mənbəyidir. Fənər neçə metr hündürlükdədir?`,
        answer: R, show: D(R), tol: 1e-6, unit: "m", solution: `Kölgənin ucundan dirəyin dibinə qədər ${x} + ${d} = ${x + d} m. Oxşar düzbucaqlı üçbucaqlar: H/${x + d} = ${D(h0)}/${x} → H = ${D(h0)} · ${x + d}/${x} = ${D(R)} m. Tələ: ${d} m-i kölgəyə əlavə etməyi unutmaq.` };
    }) },
    // 10. written: perimeter of the trapezoid AMNC (k, MN, NC, sum)
    { tip: "yazili", gen: () => again(() => {
      const T = pick([3, 4, 5]), m = rnd(1, T - 1), n = T - m, [a, b, c] = shuf(pick(SHAPES)), AM = n * a, MN = m * c, NC = n * b, AC = T * c, R = AM + MN + NC + AC;
      const [A, C, B] = triXY(T * b, T * a, T * c);
      return { text: `ΔABC-də BC = ${T * b}, AC = ${AC}. M ∈ AB, N ∈ BC və MN ∥ AC; BM = ${m * a}, MA = ${n * a}. AMNC trapesiyasının perimetrini tapın. Həlli ətraflı yazın.`,
        svg: parFig(m, n, [["B", "M", String(m * a)], ["M", "A", String(n * a)], ["B", "C", String(T * b), 30], ["A", "C", String(AC)]], { A, B, C }, 340),
        answer: R, show: String(R), tol: 1e-6,
        solution: `1) ΔMBN ~ ΔABC (∠B ortaqdır, ∠BMN = ∠BAC — uyğun bucaqlar). 2) BA = ${m * a} + ${n * a} = ${T * a}, k = BM/BA = ${frac(m, T)}. 3) MN = ${AC} · ${frac(m, T)} = ${MN}; BN = ${T * b} · ${frac(m, T)} = ${m * b}, NC = ${T * b} − ${m * b} = ${NC}. 4) P(AMNC) = AM + MN + NC + AC = ${AM} + ${MN} + ${NC} + ${AC} = ${R}. Həll yazılmadan yalnız cavab — bal verilmir.` };
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT));
  window.__imtahan = IMT;

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "oxsar-ucbucaqlar", title: "Oxşar üçbucaqlar", fenn: "riyaziyyat", link: "dersler/oxsar-ucbucaqlar.html",
      format: "Cavab ədəddir: tam 12, onluq 4,5, kəsr 2/3, kök 2√6.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["teref", "teref", "elamet", "sahe", "sahe", "paralel", "paralel", "duzbucaqli", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/oxsar-ucbucaqlar.html")) b.push("dersler/oxsar-ucbucaqlar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
