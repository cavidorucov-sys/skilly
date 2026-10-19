// Çevrə və dairə — mastery game levels (chord and distance from the centre, intersecting chords, arcs and central angles,
// circumference, arc length, word problems) and the final test.
// π answers: the player types the coefficient k of kπ, or the problem says π = 3,14 explicitly.
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
  const sq = n => { let k = 1; for (let i = 2; i * i <= n; i++) while (n % (i * i) === 0) { n /= i * i; k *= i; } return [k, n]; };
  const rt = n => { const [k, m] = sq(n); return m === 1 ? String(k) : (k === 1 ? "" : k) + "√" + m; };
  const eqs = (a, b) => a === b ? a : a + " = " + b;
  const fmt = n => String(Math.round(n * 1000) / 1000).replace(".", ",");          // 188.4 → "188,4"
  const kpi = k => (k === "1" ? "" : k.includes("/") ? "(" + k + ")" : k) + "π";       // "3/2" → "(3/2)π", "1" → "π"
  const BASE = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29]];
  const TRIPLES = []; for (const [p, q, c] of BASE) for (let k = 1; c * k <= 30; k++) TRIPLES.push([p * k, q * k, c * k]);
  const BYHYP = {}; for (const [p, q, c] of TRIPLES) (BYHYP[c] = BYHYP[c] || []).push([p, q], [q, p]);
  const ALPHA = [30, 36, 40, 45, 60, 72, 90, 120, 135, 144, 150, 180, 210, 240, 270, 300];

  // ---- figure: points in math coordinates (y up); random rotation and mirror
  // o: { circles:[[centre, R]], poly?, names?, segs, lab, right, arcs:[[v,p,q,text]], bold:[[centre,p,q,"long"?]], dots, cen }
  const INK = "#17171a", ACC = "#534ab7", RED = "#a32d2d", SOFT = "#eeedfe";
  function figure(P, o) {
    const W = 280, H = 210, pad = 26;
    const r = Math.random() * 2 * Math.PI, flip = Math.random() < .5 ? -1 : 1;
    const Q = {};
    for (const k in P) { const x = P[k][0] * flip, y = P[k][1]; Q[k] = [x * Math.cos(r) - y * Math.sin(r), -(x * Math.sin(r) + y * Math.cos(r))]; }
    const ext = Object.values(Q).slice();
    for (const [c, R] of o.circles || []) ext.push([Q[c][0] - R, Q[c][1] - R], [Q[c][0] + R, Q[c][1] + R]);
    const xs = ext.map(p => p[0]), ys = ext.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min((W - 2 * pad) / ((x1 - x0) || 1), (H - 2 * pad) / ((y1 - y0) || 1));
    const ox = (W - s * (x1 - x0)) / 2 - s * x0, oy = (H - s * (y1 - y0)) / 2 - s * y0;
    for (const k in Q) Q[k] = [ox + s * Q[k][0], oy + s * Q[k][1]];
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": o.aria || "Çevrə" });
    const cen = o.cen ? Q[o.cen] : [W / 2, H / 2];
    for (const [c, R] of o.circles || []) g.append(sv("circle", { cx: Q[c][0], cy: Q[c][1], r: R * s, fill: SOFT, stroke: INK, "stroke-width": 2 }));
    if (o.poly) g.append(sv("polygon", { points: o.poly.map(k => Q[k].join(",")).join(" "), fill: "none", stroke: INK, "stroke-width": 2, "stroke-linejoin": "round" }));
    for (const [c, p, q, lng] of o.bold || []) {                 // highlighted arc of the circle from p to q (short one, or the long one)
      const C = Q[c], R = Math.hypot(Q[p][0] - C[0], Q[p][1] - C[1]), ang = k => Math.atan2(Q[k][1] - C[1], Q[k][0] - C[0]);
      let t1 = ang(p), t2 = ang(q); if (Math.abs(t2 - t1) > Math.PI) t2 += t2 < t1 ? 2 * Math.PI : -2 * Math.PI;
      if (lng) t2 += t2 > t1 ? -2 * Math.PI : 2 * Math.PI;
      const pp = Array.from({ length: 41 }, (_, i) => { const t = t1 + (t2 - t1) * i / 40; return (C[0] + R * Math.cos(t)) + " " + (C[1] + R * Math.sin(t)); });
      g.append(sv("path", { d: "M" + pp.join("L"), fill: "none", stroke: RED, "stroke-width": 4, "stroke-linecap": "round" }));
    }
    for (const [p, q, st] of o.segs || []) {
      const a = { x1: Q[p][0], y1: Q[p][1], x2: Q[q][0], y2: Q[q][1], stroke: st === "acc" ? ACC : INK, "stroke-width": st === "dash" ? 1.5 : 2, "stroke-linecap": "round" };
      if (st === "dash") a["stroke-dasharray"] = "5 4";
      g.append(sv("line", a));
    }
    for (const [v, p, q] of o.right || []) {
      const u = k => { const d = [Q[k][0] - Q[v][0], Q[k][1] - Q[v][1]], L = Math.hypot(...d); return [d[0] / L * 9, d[1] / L * 9]; };
      const a = u(p), b = u(q), V = Q[v];
      g.append(sv("path", { d: `M${V[0] + a[0]} ${V[1] + a[1]}L${V[0] + a[0] + b[0]} ${V[1] + a[1] + b[1]}L${V[0] + b[0]} ${V[1] + b[1]}`, fill: "none", stroke: INK, "stroke-width": 1.3 }));
    }
    for (const [v, p, q, t, lng] of o.arcs || []) {                // angle mark at v between rays vp and vq (the reflex one with lng)
      const V = Q[v], R = 16, ang = k => Math.atan2(Q[k][1] - V[1], Q[k][0] - V[0]);
      let t1 = ang(p), t2 = ang(q); if (Math.abs(t2 - t1) > Math.PI) t2 += t2 < t1 ? 2 * Math.PI : -2 * Math.PI;
      if (lng) t2 += t2 > t1 ? -2 * Math.PI : 2 * Math.PI;
      const pp = Array.from({ length: 21 }, (_, i) => { const t = t1 + (t2 - t1) * i / 20; return (V[0] + R * Math.cos(t)) + " " + (V[1] + R * Math.sin(t)); });
      g.append(sv("path", { d: "M" + pp.join("L"), fill: "none", stroke: ACC, "stroke-width": 2 }));
      if (t) { const tm = (t1 + t2) / 2; g.append(sv("text", { x: V[0] + (R + 15) * Math.cos(tm), y: V[1] + (R + 15) * Math.sin(tm) + 4, "text-anchor": "middle", class: "oy-lbl", style: "fill:" + ACC + ";font-size:12px" }, t)); }
    }
    for (const key in o.lab || {}) {                              // segment label beside its midpoint, on the side away from cen (or toward it with "^")
      const inward = key[0] === "^", [p, q] = key.replace("^", "").split(""), m = [(Q[p][0] + Q[q][0]) / 2, (Q[p][1] + Q[q][1]) / 2];
      const d = [Q[q][0] - Q[p][0], Q[q][1] - Q[p][1]], L = Math.hypot(...d) || 1;
      let n = [-d[1] / L, d[0] / L];
      const out = [m[0] - cen[0], m[1] - cen[1]];
      if (Math.hypot(...out) > 6 ? (n[0] * out[0] + n[1] * out[1] < 0) !== inward : n[1] > 0) n = [-n[0], -n[1]];
      g.append(sv("text", { x: m[0] + n[0] * 12, y: m[1] + n[1] * 12 + 5, "text-anchor": "middle", class: "oy-lbl", style: "font-size:13px" }, o.lab[key]));
    }
    for (const k of o.dots || []) g.append(sv("circle", { cx: Q[k][0], cy: Q[k][1], r: 3, fill: INK }));
    const C0 = o.circles && o.circles[0] ? Q[o.circles[0][0]] : cen;
    for (const k of o.names || []) {                              // point names outward from the circle centre
      let d = [Q[k][0] - C0[0], Q[k][1] - C0[1]], L = Math.hypot(...d);
      if (L < 4) { d = [1, 1]; L = Math.SQRT2; }
      g.append(sv("text", { x: Q[k][0] + d[0] / L * 13, y: Q[k][1] + d[1] / L * 13 + 5, "text-anchor": "middle", class: "oy-lbl", style: "fill:#5f5e5a;font-style:italic" }, k));
    }
    return g;
  }
  const pol = (R, deg) => [R * Math.cos(deg * Math.PI / 180), R * Math.sin(deg * Math.PI / 180)];
  // chord AB at distance d below O, H — its midpoint
  const chordFig = (R, d, lab) => { const hh = Math.sqrt(R * R - d * d);
    return figure({ O: [0, 0], A: [-hh, -d], B: [hh, -d], H: [0, -d] }, { circles: [["O", R]], segs: [["A", "B", "ink"], ["O", "H", "dash"], ["O", "A", "acc"]], right: [["H", "O", "B"]], lab, dots: ["O"], names: ["O", "A", "B", "H"], cen: "O", aria: "Çevrə, AB vətəri və mərkəzdən vətərə perpendikulyar OH" }); };
  // two chords AB and CD through E with AE = a, EB = b, CE = c, ED = d (a·b = c·d)
  const crossFig = (a, b, c, d, lab) => {
    const P = a * b, R = Math.max(a + b, c + d) / 2 * 1.18, e = Math.sqrt(R * R - P), E = [e, 0];
    const u1 = Math.acos(Math.max(-1, Math.min(1, (b - a) / (2 * e)))), u2 = Math.acos(Math.max(-1, Math.min(1, (d - c) / (2 * e))));
    const U = [Math.cos(u1), Math.sin(u1)], V = [Math.cos(u2), -Math.sin(u2)];
    return figure({ O: [0, 0], E, A: [E[0] + a * U[0], a * U[1]], B: [E[0] - b * U[0], -b * U[1]], C: [E[0] + c * V[0], c * V[1]], D: [E[0] - d * V[0], -d * V[1]] },
      { circles: [["O", R]], segs: [["A", "B", "acc"], ["C", "D", "acc"]], lab, dots: ["O", "E"], names: ["A", "B", "C", "D", "E"], cen: "O", aria: "Çevrədə E nöqtəsində kəsişən AB və CD vətərləri" }); };
  // central angle AOB = al degrees, the arc AB highlighted
  const arcFig = (al, lab) => figure({ O: [0, 0], A: pol(1, 90 - al / 2), B: pol(1, 90 + al / 2) }, { circles: [["O", 1]], segs: [["O", "A", "acc"], ["O", "B", "acc"]], bold: [["O", "A", "B", al > 180 ? "long" : ""]], arcs: [["O", "A", "B", lab, al > 180]], dots: ["O"], names: ["O", "A", "B"], cen: "O", aria: "Çevrə, AOB mərkəzi bucağı və AB qövsü" });
  const steps = (task, list) => h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...list.map(s => h("li", {}, s))));
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];
  const KPI = { placeholder: "k, məs. 12" };

  const levels = [
    { id: "veter", ad: "Vətər və mərkəzdən məsafə", izah: "Mərkəzdən vətərə endirilmiş perpendikulyar vətəri yarıya bölür: R² = d² + (vətər/2)².",
      gen() {
        const kind = pick(["veter", "veter", "mesafe", "mesafe", "radius", "iki"]);
        let d, hh, R;
        if (kind === "iki") {
          const c = pick(Object.keys(BYHYP).map(Number).filter(x => BYHYP[x].length >= 2));
          const [[d1, h1], [d2, h2]] = shuffle(BYHYP[c]).filter((x, i, arr) => arr.findIndex(y => y[0] === x[0]) === i).slice(0, 2);
          const same = Math.random() < .5, ans = same ? Math.abs(d1 - d2) : d1 + d2;
          const svg = figure({ O: [0, 0], A: [-h1, -d1], B: [h1, -d1], C: [-h2, same ? -d2 : d2], D: [h2, same ? -d2 : d2] }, { circles: [["O", c]], segs: [["A", "B", "acc"], ["C", "D", "acc"]], dots: ["O"], names: ["O", "A", "B", "C", "D"], lab: { AB: String(2 * h1), CD: String(2 * h2) }, cen: "O", aria: "Çevrədə iki paralel vətər" });
          return { text: `Radiusu ${c} olan çevrədə uzunluqları ${2 * h1} və ${2 * h2} olan iki paralel vətər çəkilib. Vətərlər mərkəzin ${same ? "eyni tərəfində" : "müxtəlif tərəflərində"} yerləşir. Vətərlər arasındakı məsafəni tap.`, svg, answer: ans, show: String(ans), tol: 0.01,
            solution: `Mərkəzdən vətərlərə qədər məsafələr: √(${c}² − ${h1}²) = ${d1} və √(${c}² − ${h2}²) = ${d2}. ${same ? `Eyni tərəfdə: ${Math.max(d1, d2)} − ${Math.min(d1, d2)} = ${ans}.` : `Müxtəlif tərəflərdə: ${d1} + ${d2} = ${ans}.`}` };
        }
        if (kind === "veter" && Math.random() < .35) {      // irrational chord
          do { R = rnd(3, 15); d = rnd(1, R - 1); } while (isSq(R * R - d * d));
          const N = 4 * (R * R - d * d);
          return { text: `Radiusu ${R} olan çevrədə mərkəzdən ${d} məsafədə vətər çəkilib. Vətərin uzunluğunu tap.`, svg: chordFig(R, d, { OA: String(R), OH: String(d), AB: "?" }), answer: Math.sqrt(N), show: rt(N),
            solution: `OH ⊥ AB, deməli AH = HB. AH² = OA² − OH² = ${R * R} − ${d * d} = ${R * R - d * d} → AH = ${rt(R * R - d * d)}. AB = 2 · AH = ${rt(N)}.` };
        }
        [d, hh, R] = pick(TRIPLES); if (Math.random() < .5) [d, hh] = [hh, d];
        if (kind === "veter") return { text: `Radiusu ${R} olan çevrədə mərkəzdən ${d} məsafədə vətər çəkilib. Vətərin uzunluğunu tap.`, svg: chordFig(R, d, { OA: String(R), OH: String(d), AB: "?" }), answer: 2 * hh, show: String(2 * hh), tol: 0.01,
          solution: `OH ⊥ AB, deməli AH = HB. AH² = OA² − OH² = ${R * R} − ${d * d} = ${hh * hh} → AH = ${hh}. AB = 2 · ${hh} = ${2 * hh}.` };
        if (kind === "mesafe") return { text: `Radiusu ${R} olan çevrədə uzunluğu ${2 * hh} olan AB vətəri çəkilib. Çevrənin mərkəzindən bu vətərə qədər məsafəni tap.`, svg: chordFig(R, d, { OA: String(R), OH: "?", AB: String(2 * hh) }), answer: d, show: String(d), tol: 0.01,
          solution: `Perpendikulyar vətəri yarıya bölür: AH = ${2 * hh} : 2 = ${hh}. OH² = OA² − AH² = ${R * R} − ${hh * hh} = ${d * d} → OH = ${d}.` };
        return { text: `Uzunluğu ${2 * hh} olan vətər çevrənin mərkəzindən ${d} məsafədədir. Çevrənin radiusunu tap.`, svg: chordFig(R, d, { OA: "R = ?", OH: String(d), AB: String(2 * hh) }), answer: R, show: String(R), tol: 0.01,
          solution: `AH = ${2 * hh} : 2 = ${hh}. OAH düzbucaqlı üçbucağında R² = OH² + AH² = ${d * d} + ${hh * hh} = ${R * R} → R = ${R}.` };
      } },

    { id: "kesisen", ad: "Kəsişən vətərlər", izah: "AB və CD vətərləri E nöqtəsində kəsişirsə: AE · EB = CE · ED.",
      gen() {
        const kind = pick(["parca", "parca", "uzunluq", "diametr"]);
        if (kind === "diametr") {
          let m, n; do { m = rnd(1, 16); n = rnd(m + 1, 25); } while (Math.random() < .6 && !isSq(m * n));
          const R = (m + n) / 2, N = 4 * m * n;
          const svg = figure({ O: [0, 0], A: [-R, 0], B: [R, 0], E: [-R + m, 0], C: [-R + m, Math.sqrt(m * n)], D: [-R + m, -Math.sqrt(m * n)] }, { circles: [["O", R]], segs: [["A", "B", "ink"], ["C", "D", "acc"]], right: [["E", "B", "C"]], dots: ["O", "E"], names: ["A", "B", "C", "D", "E"], lab: { AE: String(m), EB: String(n) }, cen: "O", aria: "Diametr və ona perpendikulyar vətər" });
          return { text: `AB — çevrənin diametridir. AB üzərindəki E nöqtəsindən AB-yə perpendikulyar CD vətəri çəkilib. AE = ${m}, EB = ${n}. CD vətərinin uzunluğunu tap.`, svg, answer: Math.sqrt(N), show: rt(N),
            solution: `Diametrə perpendikulyar vətər yarıya bölünür: CE = ED. CE · ED = AE · EB → CE² = ${m} · ${n} = ${m * n} → CE = ${rt(m * n)}. CD = 2 · CE = ${rt(N)}.` };
        }
        // two factorisations of the same product
        let a, b, c, d;
        do { a = rnd(2, 12); b = rnd(2, 12); c = rnd(1, 15); d = a * b / c; } while (!Number.isInteger(d) || c === a || c === b || d > 20 || d < 1 || (kind === "uzunluq" && c === d));
        if (kind === "parca") return { text: `Çevrənin AB və CD vətərləri E nöqtəsində kəsişir. AE = ${a}, EB = ${b}, CE = ${c}. ED parçasını tap.`, svg: crossFig(a, b, c, d, { "^AE": String(a), "^EB": String(b), "^CE": String(c), "^ED": "?" }),
          answer: d, show: String(d), tol: 0.01, solution: `AE · EB = CE · ED → ${a} · ${b} = ${c} · ED → ED = ${a * b} : ${c} = ${d}.` };
        const sm = Math.min(c, d), L = c + d;
        return { text: `Çevrənin AB və CD vətərləri E nöqtəsində kəsişir. AE = ${a}, EB = ${b}, CD = ${L}, CE < ED. CE parçasını tap.`, svg: crossFig(a, b, sm, L - sm, { "^AE": String(a), "^EB": String(b), "^CE": "?" }),
          answer: sm, show: String(sm), tol: 0.01,
          solution: `CE = x, ED = ${L} − x. x(${L} − x) = ${a} · ${b} = ${a * b} → x² − ${L}x + ${a * b} = 0 → x = ${sm} və ya x = ${L - sm}. CE < ED olduğu üçün CE = ${sm}.` };
      } },

    { id: "bucaq", ad: "Qövs və mərkəzi bucaq", izah: "Qövsün dərəcə ölçüsü ona uyğun mərkəzi bucağa bərabərdir. Bütün çevrə 360°, yarımçevrə 180°.",
      gen() {
        const kind = pick(["nisbet", "nisbet", "veterR", "ucbucaq", "ucbucaq", "yarim"]);
        if (kind === "nisbet") {
          let p; do { p = [rnd(1, 9), rnd(1, 9), rnd(1, 9)]; } while (360 % (p[0] + p[1] + p[2]) || new Set(p).size < 2);
          const u = 360 / (p[0] + p[1] + p[2]), big = Math.random() < .5, ans = (big ? Math.max(...p) : Math.min(...p)) * u;
          return { text: `Çevrə üzərindəki üç nöqtə onu nisbəti ${p.join(" : ")} olan üç qövsə bölür. Ən ${big ? "böyük" : "kiçik"} qövs neçə dərəcədir?`, answer: ans, unit: "°", show: ans + "°", tol: 0.01,
            solution: `Bütün çevrə 360°. ${p.join(" + ")} = ${p[0] + p[1] + p[2]} hissə, bir hissə 360° : ${p[0] + p[1] + p[2]} = ${u}°. Ən ${big ? "böyük" : "kiçik"} qövs ${big ? Math.max(...p) : Math.min(...p)} · ${u}° = ${ans}°.` };
        }
        if (kind === "veterR") {
          const R = rnd(2, 15), t = pick(["R", "R", "R2"]), al = t === "R" ? 60 : 90, big = Math.random() < .4, ans = big ? 360 - al : al;
          const ch = t === "R" ? String(R) : R + "√2";
          return { text: `Radiusu ${R} olan çevrədə AB vətərinin uzunluğu ${ch}. ${big ? "Böyük AB qövsü" : "AOB mərkəzi bucağı"} neçə dərəcədir?`, svg: arcFig(al, ""), answer: ans, unit: "°", show: ans + "°", tol: 0.01,
            solution: t === "R" ? `OA = OB = AB = ${R}: AOB bərabərtərəfli üçbucaqdır, ∠AOB = 60°.` + (big ? ` Böyük qövs 360° − 60° = 300°.` : "")
              : `OA² + OB² = ${R * R} + ${R * R} = ${2 * R * R} = AB² (= (${R}√2)²). Tərs Pifaqor teoreminə görə ∠AOB = 90°.` + (big ? ` Böyük qövs 360° − 90° = 270°.` : "") };
        }
        if (kind === "ucbucaq") {
          if (Math.random() < .5) { const al = 2 * rnd(10, 85), ans = (180 - al) / 2;
            return { text: `O — çevrənin mərkəzi, AB — vətər. AB qövsü ${al}°-dir (kiçik qövs). OAB bucağı neçə dərəcədir?`, svg: arcFig(al, al + "°"), answer: ans, unit: "°", show: ans + "°", tol: 0.01,
              solution: `∠AOB = AB qövsü = ${al}°. OA = OB (radiuslar), OAB bərabəryanlıdır: ∠OAB = (180° − ${al}°) : 2 = ${ans}°.` }; }
          const be = rnd(10, 80), ans = 180 - 2 * be;
          return { text: `O — çevrənin mərkəzi, AB — vətər, ∠OAB = ${be}°. Kiçik AB qövsü neçə dərəcədir?`, svg: arcFig(ans, "?"), answer: ans, unit: "°", show: ans + "°", tol: 0.01,
            solution: `OA = OB, ona görə ∠OBA = ∠OAB = ${be}°. ∠AOB = 180° − 2 · ${be}° = ${ans}°. Qövs mərkəzi bucağa bərabərdir: ${ans}°.` };
        }
        const k = 2 * rnd(5, 70), ab = (180 + k) / 2, bc = (180 - k) / 2, big = Math.random() < .5;
        return { text: `AC — çevrənin diametridir, B nöqtəsi çevrə üzərindədir. AB qövsü BC qövsündən ${k}° böyükdür (hər iki qövs B-ni saxlayan yarımçevrədədir). ${big ? "AB" : "BC"} qövsü neçə dərəcədir?`, answer: big ? ab : bc, unit: "°", show: (big ? ab : bc) + "°", tol: 0.01,
          solution: `Diametr çevrəni iki yarımçevrəyə bölür: AB + BC = 180°. x + (x + ${k}°) = 180° → x = ${bc}°. BC = ${bc}°, AB = ${ab}°.` };
      } },

    { id: "uzunluq", ad: "Çevrənin uzunluğu", izah: "C = 2πR = πd. Cavab kπ şəklindədirsə, yalnız k-nı yaz (məs. 12π → 12). π = 3,14 verilibsə — onluq kəsr yaz.",
      gen() {
        const kind = pick(["R", "d", "ters", "artim", "pi", "pi", "kvadrat"]);
        if (kind === "R") { const R = rnd(1, 30);
          return { text: `Çevrənin radiusu ${R}. Onun uzunluğu kπ-dir. k-nı tap.`, answer: 2 * R, show: String(2 * R), tol: 0.01, ...KPI, solution: `C = 2πR = 2π · ${R} = ${2 * R}π. k = ${2 * R}.` }; }
        if (kind === "d") { const d = rnd(2, 40);
          return { text: `Çevrənin diametri ${d}. Onun uzunluğu kπ-dir. k-nı tap.`, answer: d, show: String(d), tol: 0.01, ...KPI, solution: `C = πd = ${d}π. k = ${d}.` }; }
        if (kind === "ters") { const k = rnd(3, 40), dia = Math.random() < .4;
          return { text: `Çevrənin uzunluğu ${k}π-dir. Onun ${dia ? "diametrini" : "radiusunu"} tap.`, answer: dia ? k : k / 2, show: dia ? String(k) : frac(k, 2),
            solution: dia ? `C = πd → d = ${k}π : π = ${k}.` : `2πR = ${k}π → R = ${k} : 2 = ${frac(k, 2)}.` }; }
        if (kind === "artim") { const x = rnd(1, 12);
          return Math.random() < .5 ? { text: `Çevrənin radiusu ${x} vahid artırıldı. Çevrənin uzunluğu kπ qədər artdı. k-nı tap.`, answer: 2 * x, show: String(2 * x), tol: 0.01, ...KPI,
              solution: `2π(R + ${x}) − 2πR = 2π · ${x} = ${2 * x}π. Artım radiusun özündən asılı deyil. k = ${2 * x}.` }
            : { text: `Çevrənin uzunluğu ${2 * x}π artdı. Radiusu neçə vahid artdı?`, answer: x, show: String(x), tol: 0.01,
              solution: `Uzunluğun artımı 2π · (radiusun artımı): 2π · ΔR = ${2 * x}π → ΔR = ${x}.` }; }
        if (kind === "pi") { const R = rnd(1, 25), ask = Math.random() < .5;
          const C = Math.round(6.28 * R * 100) / 100;
          return ask ? { text: `Çevrənin radiusu ${R} sm. π = 3,14 götürərək çevrənin uzunluğunu tap.`, answer: C, unit: "sm", show: fmt(C), solution: `C = 2πR = 2 · 3,14 · ${R} = ${fmt(C)} sm.` }
            : { text: `Çevrənin uzunluğu ${fmt(C)} sm. π = 3,14 götürərək radiusunu tap.`, answer: R, unit: "sm", show: String(R), tol: 0.01, solution: `R = C : (2π) = ${fmt(C)} : 6,28 = ${R} sm.` }; }
        const a = rnd(2, 14), out = Math.random() < .6;
        return { text: `Tərəfi ${a} olan kvadrata ${out ? "xaricdən" : "daxilən"} çevrə çəkilib. Çevrənin uzunluğu kπ-dir. k-nı tap.`, answer: out ? a * Math.SQRT2 : a, show: out ? rt(2 * a * a) : String(a), ...KPI,
          solution: out ? `Xaricdən çəkilmiş çevrənin diametri kvadratın diaqonalıdır: d = ${a}√2. C = πd = ${a}√2 · π. k = ${a}√2.` : `Daxilən çəkilmiş çevrənin diametri kvadratın tərəfinə bərabərdir: d = ${a}. C = ${a}π. k = ${a}.` };
      } },

    { id: "qovs", ad: "Qövsün uzunluğu", izah: "α° qövsün uzunluğu: l = 2πR · α/360 = πRα/180. Cavab kπ-dirsə, k-nı yaz.",
      gen() {
        const kind = pick(["l", "l", "al", "R", "pi", "hisse"]);
        if (kind === "l") { const al = pick(ALPHA), R = rnd(1, 24), kk = frac(R * al, 180);
          return { text: `Radiusu ${R} olan çevrənin ${al}°-li qövsünün uzunluğu kπ-dir. k-nı tap.`, svg: arcFig(al, al + "°"), answer: R * al / 180, show: kk, ...KPI,
            solution: `l = πRα/180 = π · ${R} · ${al}/180 = ${kpi(kk)}. k = ${kk}.` }; }
        let al, R, k; do { al = pick(ALPHA); R = rnd(1, 24); k = R * al / 180; } while (!Number.isInteger(k));
        if (kind === "al") return { text: `Radiusu ${R} olan çevrənin AB qövsünün uzunluğu ${kpi(String(k))}-dir. Bu qövs neçə dərəcədir?`, svg: arcFig(al, "?"), answer: al, unit: "°", show: al + "°", tol: 0.01,
          solution: `πR · α/180 = ${k}π → ${R}α/180 = ${k} → α = ${k} · 180 : ${R} = ${al}°.` };
        if (kind === "R") return { text: `Çevrənin ${al}°-li qövsünün uzunluğu ${kpi(String(k))}-dir. Çevrənin radiusunu tap.`, svg: arcFig(al, al + "°"), answer: R, show: String(R), tol: 0.01,
          solution: `πR · ${al}/180 = ${k}π → R = ${k} · 180 : ${al} = ${R}.` };
        if (kind === "pi") { const l = Math.round(3.14 * k * 100) / 100;
          return { text: `Radiusu ${R} sm olan çevrənin ${al}°-li qövsünün uzunluğunu tap (π = 3,14).`, svg: arcFig(al, al + "°"), answer: l, unit: "sm", show: fmt(l),
            solution: `l = πRα/180 = 3,14 · ${R} · ${al}/180 = 3,14 · ${k} = ${fmt(l)} sm.` }; }
        const m = pick([2, 3, 4, 5, 6, 8, 9, 10, 12, 18, 20, 24, 36]);
        return { text: `Qövsün uzunluğu bütün çevrənin uzunluğunun 1/${m} hissəsidir. Bu qövs neçə dərəcədir?`, answer: 360 / m, unit: "°", show: 360 / m + "°", tol: 0.01,
          solution: `Qövsün uzunluğu onun dərəcəsi ilə mütənasibdir: 360° · 1/${m} = ${360 / m}°.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Təkər, saat əqrəbi, ağac gövdəsi, qaçış zolağı — hamısında çevrənin və ya qövsün uzunluğu. Şərtdə π = 3,14 verilibsə, onu işlət.",
      gen() {
        const kind = pick(["teker", "teker", "saat", "agac", "zolaq", "kendir"]);
        if (kind === "teker") { const r = pick([20, 25, 30, 35, 40, 50]), n = pick([10, 20, 50, 100, 200, 500]);
          const L = Math.round(6.28 * r * n) / 100;                   // metres
          return Math.random() < .5 ? { text: `Velosiped təkərinin radiusu ${r} sm-dir. Təkər ${n} dəfə fırlananda velosiped neçə metr yol gedər? (π = 3,14)`, answer: L, unit: "m", show: fmt(L),
              solution: `Bir dövrədə təkər öz çevrəsinin uzunluğu qədər yol gedir: 2 · 3,14 · ${r} = ${fmt(6.28 * r)} sm. ${n} dövrə: ${fmt(6.28 * r * n)} sm = ${fmt(L)} m.` }
            : { text: `Velosiped təkərinin radiusu ${r} sm-dir. Velosiped ${fmt(L)} m yol getdi. Təkər neçə dəfə fırlandı? (π = 3,14)`, answer: n, show: String(n), tol: 0.01,
              solution: `Bir dövrə: 2 · 3,14 · ${r} = ${fmt(6.28 * r)} sm = ${fmt(6.28 * r / 100)} m. ${fmt(L)} : ${fmt(6.28 * r / 100)} = ${n}.` }; }
        if (kind === "saat") { let L, t, hour = Math.random() < .3, k;
          do { L = rnd(3, 20); t = hour ? rnd(1, 11) : pick([5, 10, 15, 20, 30, 40, 45, 60]); k = hour ? L * t / 6 : L * t / 30; } while (!Number.isInteger(k));
          return { text: `Saatın ${hour ? "saat" : "dəqiqə"} əqrəbinin uzunluğu ${L} sm-dir. ${t} ${hour ? "saatda" : "dəqiqədə"} onun ucu kπ sm yol gedir. k-nı tap.`, answer: k, show: String(k), tol: 0.01, ...KPI,
            solution: hour ? `Saat əqrəbi 12 saatda tam dövrə vurur: ${t} saatda çevrənin ${frac(t, 12)} hissəsi. 2π · ${L} · ${t}/12 = ${k}π. k = ${k}.` : `Dəqiqə əqrəbi 60 dəqiqədə tam dövrə vurur: ${t} dəqiqədə çevrənin ${frac(t, 60)} hissəsi. 2π · ${L} · ${t}/60 = ${k}π. k = ${k}.` }; }
        if (kind === "agac") { const d = rnd(10, 120), C = Math.round(3.14 * d * 100) / 100;
          return { text: `Ağacın gövdəsinin ətrafına lent dolayıb ölçdülər: ${fmt(C)} sm. Gövdəni dairəvi hesab edərək diametrini tap (π = 3,14).`, answer: d, unit: "sm", show: String(d), tol: 0.01,
            solution: `C = πd → d = ${fmt(C)} : 3,14 = ${d} sm.` }; }
        if (kind === "zolaq") { const R = pick([20, 25, 30, 40, 50, 60]), n = rnd(2, 6), L = Math.round(6.28 * R * n * 100) / 100;
          return { text: `Dairəvi qaçış zolağının radiusu ${R} m-dir. Atlet ${n} dövrə qaçdı. O, neçə metr qaçdı? (π = 3,14)`, answer: L, unit: "m", show: fmt(L),
            solution: `Bir dövrə: 2 · 3,14 · ${R} = ${fmt(6.28 * R)} m. ${n} dövrə: ${fmt(L)} m.` }; }
        const hgt = pick([1, 2, 3, 5, 10]), L = Math.round(6.28 * hgt * 100) / 100;
        return { text: `Topun ekvatoru boyunca kəndir sıx dolanıb. Kəndiri ${fmt(L)} m uzadıb, topun ətrafında hər yerdən eyni hündürlükdə qaldırdılar. Kəndir topun səthindən neçə metr yuxarıda olacaq? (π = 3,14)`, answer: hgt, unit: "m", show: String(hgt), tol: 0.01,
          solution: `Yeni radius R + h: 2π(R + h) − 2πR = 2πh = ${fmt(L)} → h = ${fmt(L)} : 6,28 = ${hgt} m. Cavab topun ölçüsündən asılı deyil!` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const kind = pick(["veter", "qovs", "kesisen"]), bad = rnd(0, 2);
        let task, st, why;
        if (kind === "veter") {
          const [d, hh, R] = pick(TRIPLES);
          task = `Radiusu ${R} olan çevrədə uzunluğu ${2 * hh} olan AB vətəri var. Mərkəzdən vətərə qədər OH məsafəsini tap.`;
          st = [`OH ⊥ AB vətəri yarıya bölür: AH = ${2 * hh} : 2 = ${hh}`, `OH² = OA² − AH² = ${R * R} − ${hh * hh} = ${d * d}`, `OH = √${d * d} = ${d}`];
          if (bad === 0) st[0] = `AH = AB = ${2 * hh}`;
          if (bad === 1) st[1] = `OH² = OA² + AH² = ${R * R} + ${hh * hh} = ${R * R + hh * hh}`;
          if (bad === 2) st[2] = `OH = ${d * d} : 2 = ${frac(d * d, 2)}`;
          why = [`1-ci addım: perpendikulyar vətəri yarıya bölür, AH = ${hh}.`, `2-ci addım: OA hipotenuzdur, ona görə çıxırıq: OH² = ${R * R} − ${hh * hh} = ${d * d}.`, `3-cü addım: kök alınmalıdır: OH = ${d}.`][bad];
        } else if (kind === "qovs") {
          let al, R, k; do { al = pick(ALPHA.filter(x => x < 180)); R = rnd(2, 18); k = R * al / 180; } while (!Number.isInteger(k));
          task = `Radiusu ${R} olan çevrənin ${al}°-li qövsünün uzunluğunu tap.`;
          st = [`Çevrənin uzunluğu: C = 2π · ${R} = ${2 * R}π`, `Qövs çevrənin ${al}/360 hissəsidir: l = ${2 * R}π · ${al}/360`, `l = ${kpi(String(k))}`];
          if (bad === 0) st[0] = `Çevrənin uzunluğu: C = π · ${R}² = ${R * R}π`;
          if (bad === 1) st[1] = `Qövs çevrənin ${al}/180 hissəsidir: l = ${2 * R}π · ${al}/180`;
          if (bad === 2) st[2] = `l = ${kpi(String(pick([2 * k, k + 1, k + 2])))}`;
          why = [`1-ci addım: çevrənin uzunluğu 2πR-dir; πR² — dairənin sahəsidir.`, `2-ci addım: tam çevrə 360°-dir, ona görə hissə ${al}/360.`, `3-cü addım: hesab səhvi. ${2 * R} · ${al}/360 = ${k}, l = ${kpi(String(k))}.`][bad];
        } else {
          let a, b, c, d; do { a = rnd(2, 10); b = rnd(2, 10); c = rnd(2, 12); d = a * b / c; } while (!Number.isInteger(d) || c === a || c === b);
          task = `AB və CD vətərləri E nöqtəsində kəsişir. AE = ${a}, EB = ${b}, CE = ${c}. ED parçasını tap.`;
          st = [`AE · EB = CE · ED`, `${a} · ${b} = ${c} · ED → ${a * b} = ${c} · ED`, `ED = ${a * b} : ${c} = ${d}`];
          if (bad === 0) st[0] = `AE + EB = CE + ED`;
          if (bad === 1) st[1] = `${a} · ${b} = ${c} · ED → ${a * b + pick([-2, 2, 3])} = ${c} · ED`;
          if (bad === 2) st[2] = `ED = ${a * b} · ${c} = ${a * b * c}`;
          why = [`1-ci addım: kəsişən vətərlərin parçalarının hasilləri bərabərdir: AE · EB = CE · ED.`, `2-ci addım: hesab səhvi: ${a} · ${b} = ${a * b}.`, `3-cü addım: ED-ni tapmaq üçün bölmək lazımdır: ${a * b} : ${c} = ${d}.`][bad];
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
      key: "cevre-daire", title: "Çevrə və dairə: vətər, qövs, çevrənin uzunluğu", fenn: "riyaziyyat", link: "dersler/cevre-daire.html",
      format: "Cavab — ədəd. Uzunluq kπ şəklindədirsə, yalnız k-nı yaz: 12π → 12, (3/2)π → 3/2, 5√2π → 5√2. π = 3,14 verilibsə, onluq kəsr yaz: 188,4. Bucaq — dərəcə ilə (° yazmaq lazım deyil).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["veter", "veter", "kesisen", "bucaq", "uzunluq", "uzunluq", "qovs", "qovs", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/cevre-daire.html")) b.push("dersler/cevre-daire.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
