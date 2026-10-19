// Dördbucaqlılar (paraleloqram, düzbucaqlı, kvadrat, romb) — mastery game levels and the final test.
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
  const fmt = n => String(Math.round(n * 100) / 100).replace(".", ",");
  const rad = d => d * Math.PI / 180;
  // Pythagorean triple scaled by k, hypotenuse ≤ maxC; legs randomly swapped
  const BASE = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
  function triple(maxC) {
    const opts = [];
    for (const [p, q, c] of BASE) for (let k = 1; c * k <= maxC; k++) opts.push([p * k, q * k, c * k]);
    const [p, q, c] = pick(opts);
    return Math.random() < .5 ? [p, q, c] : [q, p, c];
  }

  // ---- figure: points in math coordinates (y up); random quarter-turn rotation and mirror
  // o: { poly:[names], names?:[names to letter], segs:[[p,q,"dash"|"acc"|"ink"]], lab:{PQ:text}, right:[[v,p,q]], arcs:[[v,p,q,text]], rot:[quarter turns] }
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
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": o.aria || "Dördbucaqlı" });
    const cen = [0, 1].map(i => o.poly.reduce((t, k) => t + Q[k][i], 0) / o.poly.length);
    g.append(sv("polygon", { points: o.poly.map(k => Q[k].join(",")).join(" "), fill: "#eeedfe", stroke: INK, "stroke-width": 2, "stroke-linejoin": "round" }));
    for (const [p, q, st] of o.segs || []) {
      const a = { x1: Q[p][0], y1: Q[p][1], x2: Q[q][0], y2: Q[q][1], stroke: st === "acc" ? ACC : st === "red" ? RED : INK, "stroke-width": st === "dash" ? 1.5 : st === "red" ? 4 : 2, "stroke-linecap": "round" };
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
    for (const k of o.names || o.poly) {
      let d = [Q[k][0] - cen[0], Q[k][1] - cen[1]], L = Math.hypot(...d);
      if (L < 4) { d = [1, -1]; L = Math.SQRT2; }
      g.append(sv("text", { x: Q[k][0] + d[0] / L * 15, y: Q[k][1] + d[1] / L * 15 + 5, "text-anchor": "middle", class: "oy-lbl", style: "fill:#5f5e5a;font-style:italic" }, k));
    }
    return g;
  }
  const ABCD = ["A", "B", "C", "D"];
  // parallelogram: AD = a along x, AB = b at angle al
  const para = (a, b, al) => { const c = Math.cos(rad(al)), s = Math.sin(rad(al)); return { A: [0, 0], B: [b * c, b * s], C: [a + b * c, b * s], D: [a, 0] }; };
  const ARC = { A: ["A", "D", "B"], B: ["B", "A", "C"], C: ["C", "B", "D"], D: ["D", "C", "A"] };
  const deg = { unit: "°", tol: 0.01 };
  const steps = (task, list) => h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...list.map(s => h("li", {}, s))));
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];

  const levels = [
    { id: "bucaq", ad: "Bucaqlar", izah: "Paraleloqramda qarşı bucaqlar bərabərdir, qonşu bucaqların cəmi 180°. Dördbucaqlının bucaqlarının cəmi 360°.",
      gen() {
        const kind = pick(["qonsu", "qonsu", "nisbet", "ferq", "cem", "dord"]);
        if (kind === "qonsu") {
          const al = pick([...range(35, 85, 5), ...range(95, 145, 5)]), ask = pick(["B", "C", "D"]), ans = ask === "C" ? al : 180 - al;
          return { text: `ABCD paraleloqramında ∠A = ${al}°. ∠${ask} neçə dərəcədir?`, svg: figure(para(7, 4.5, al), { poly: ABCD, arcs: [[...ARC.A, al + "°"], [...ARC[ask], "?"]] }),
            answer: ans, show: ans + "°", ...deg,
            solution: ask === "C" ? `Paraleloqramın qarşı bucaqları bərabərdir: ∠C = ∠A = ${al}°.` : `∠${ask} ilə ∠A qonşu bucaqlardır, cəmi 180°: ∠${ask} = 180° − ${al}° = ${ans}°.` };
        }
        const big = Math.random() < .5, W = big ? "böyük" : "kiçik";
        if (kind === "nisbet") {
          const [k, m] = pick([[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [4, 5], [2, 7], [5, 7], [7, 11], [4, 11], [1, 8], [3, 7]]), u = 180 / (k + m), ans = big ? m * u : k * u;
          return { text: `Paraleloqramın iki bucağının nisbəti ${k} : ${m} kimidir. Paraleloqramın ${W} bucağını tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Bucaqlar bərabər deyil, deməli qonşu bucaqlardır və cəmi 180°. Bir hissə = 180° : ${k + m} = ${u}°. Kiçik bucaq ${k * u}°, böyük bucaq ${m * u}°.` };
        }
        if (kind === "ferq") {
          const d = pick(range(20, 120, 10)), sm = (180 - d) / 2, ans = big ? sm + d : sm;
          return { text: `Paraleloqramın iki bucağından biri digərindən ${d}° böyükdür. Paraleloqramın ${W} bucağını tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Bərabər olmayan bucaqlar qonşudur: x + (x + ${d}°) = 180°, 2x = ${180 - d}°, x = ${sm}°. Kiçik bucaq ${sm}°, böyük bucaq ${sm + d}°.` };
        }
        if (kind === "cem") {
          const x = pick([...range(35, 80, 5), ...range(100, 145, 5)]), S = 2 * x, ans = big ? Math.max(x, 180 - x) : Math.min(x, 180 - x);
          return { text: `Paraleloqramın iki bucağının cəmi ${S}°-dir. Paraleloqramın ${W} bucağını tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Qonşu bucaqların cəmi 180° olardı, burada isə ${S}°. Deməli, bunlar qarşı bucaqlardır və bərabərdir: hər biri ${S}° : 2 = ${x}°. Qonşu bucaq 180° − ${x}° = ${180 - x}°. ${big ? "Böyük" : "Kiçik"} bucaq ${ans}°.` };
        }
        let a, b, c, d;
        do { a = pick(range(50, 150, 5)); b = pick(range(50, 150, 5)); c = pick(range(50, 150, 5)); d = 360 - a - b - c; } while (d < 40 || d > 170);
        return { text: `Qabarıq dördbucaqlının üç bucağı: ${a}°, ${b}°, ${c}°. Dördüncü bucaq neçə dərəcədir?`, answer: d, show: d + "°", ...deg,
          solution: `Qabarıq dördbucaqlının bucaqlarının cəmi 360°-dir: 360° − (${a}° + ${b}° + ${c}°) = 360° − ${a + b + c}° = ${d}°.` };
      } },

    { id: "perimetr", ad: "Tərəflər və perimetr", izah: "Paraleloqramın qarşı tərəfləri bərabərdir: P = 2(a + b). Tənbölən bərabəryanlı üçbucaq kəsir.",
      gen() {
        const kind = pick(["teref", "ferq", "nisbet", "tenbolen", "tenbolen"]);
        if (kind === "teref") {
          const a = rnd(3, 20); let b; do b = rnd(3, 20); while (b === a);
          const P = 2 * (a + b);
          return { text: `Paraleloqramın perimetri ${P}, bir tərəfi ${a}. Ona qonşu olan tərəfi tap.`, svg: figure(para(Math.max(a, b), Math.min(a, b) * .8 + 1, 60), { poly: ABCD, lab: a >= b ? { AD: String(a), AB: "?" } : { AB: String(a), AD: "?" } }),
            answer: b, show: String(b), tol: 0.01,
            solution: `P = 2(a + b), deməli qonşu iki tərəfin cəmi ${P} : 2 = ${P / 2}. Axtarılan tərəf ${P / 2} − ${a} = ${b}.` };
        }
        if (kind === "ferq") {
          const b = rnd(3, 15), d = rnd(1, 9), a = b + d, P = 2 * (a + b), big = Math.random() < .5, ans = big ? a : b;
          return { text: `Paraleloqramın perimetri ${P}. Qonşu tərəflərindən biri digərindən ${d} uzundur. ${big ? "Böyük" : "Kiçik"} tərəfi tap.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Qonşu tərəflərin cəmi ${P} : 2 = ${P / 2}. x + (x + ${d}) = ${P / 2} → 2x = ${P / 2 - d} → x = ${b}. Tərəflər ${b} və ${a}.` };
        }
        if (kind === "nisbet") {
          const [k, m] = pick([[1, 2], [2, 3], [3, 4], [3, 5], [1, 3], [4, 5], [2, 5], [5, 7]]), u = rnd(2, 6), P = 2 * (k + m) * u, big = Math.random() < .5, ans = big ? m * u : k * u;
          return { text: `Paraleloqramın qonşu tərəflərinin nisbəti ${k} : ${m}, perimetri ${P}. ${big ? "Böyük" : "Kiçik"} tərəfi tap.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Qonşu tərəflərin cəmi ${P} : 2 = ${P / 2}. Bir hissə = ${P / 2} : ${k + m} = ${u}. Tərəflər ${k}·${u} = ${k * u} və ${m}·${u} = ${m * u}.` };
        }
        const x = rnd(3, 10), y = rnd(2, 9), al = rnd(50, 75), c = Math.cos(rad(al)), s = Math.sin(rad(al)), ans = 4 * x + 2 * y;
        const P = { A: [0, 0], B: [x * c, x * s], C: [x * c + x + y, x * s], D: [x + y, 0], E: [x * c + x, x * s] };
        return { text: `ABCD paraleloqramında A bucağının tənböləni BC tərəfini E nöqtəsində kəsir. BE = ${x}, EC = ${y}. Paraleloqramın perimetrini tap.`,
          svg: figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "E"], segs: [["A", "E", "acc"]], arcs: [["A", "D", "E", "", 20], ["A", "E", "B", "", 26]], lab: { BE: String(x), EC: String(y) } }),
          answer: ans, show: String(ans), tol: 0.01,
          solution: `∠BAE = ∠EAD (tənbölən) və ∠EAD = ∠AEB (AD ∥ BC, çarpaz bucaqlar). Deməli ABE bərabəryanlı üçbucaqdır: AB = BE = ${x}. BC = ${x} + ${y} = ${x + y}. P = 2 · (${x} + ${x + y}) = ${ans}.` };
      } },

    { id: "diaqonal", ad: "Diaqonallar", izah: "Paraleloqramın diaqonalları kəsişmə nöqtəsində yarıya bölünür. Düzbucaqlının diaqonalları bərabərdir: d² = a² + b².",
      gen() {
        const kind = pick(["duz", "duz", "aob", "bucaq", "k60", "kv"]);
        if (kind === "duz") {
          const [p, q, c] = triple(40), sub = pick(["d", "teref", "sahe"]);
          const P = { A: [0, 0], B: [0, p], C: [q, p], D: [q, 0] };
          const lab = sub === "d" ? { AB: String(p), AD: String(q), AC: "?" } : sub === "teref" ? { AB: String(p), AC: String(c), AD: "?" } : { AB: String(p), AC: String(c) };
          const svg = figure(P, { poly: ABCD, segs: [["A", "C", "acc"]], right: [["A", "B", "D"]], lab });
          if (sub === "d") return { text: `ABCD düzbucaqlısında AB = ${p}, AD = ${q}. Diaqonal AC-ni tap.`, svg, answer: c, show: String(c), tol: 0.01,
            solution: `ACD düzbucaqlı üçbucaqdır (∠D = 90°), CD = AB = ${p}. AC² = AD² + CD² = ${q * q} + ${p * p} = ${c * c}, AC = ${c}.` };
          if (sub === "teref") return { text: `ABCD düzbucaqlısında AB = ${p}, diaqonal AC = ${c}. AD tərəfini tap.`, svg, answer: q, show: String(q), tol: 0.01,
            solution: `ACD düzbucaqlı üçbucaqdır (∠D = 90°), CD = AB = ${p}. AD² = AC² − CD² = ${c * c} − ${p * p} = ${q * q}, AD = ${q}.` };
          return { text: `ABCD düzbucaqlısında AB = ${p}, diaqonal AC = ${c}. Düzbucaqlının sahəsini tap.`, svg, answer: p * q, show: String(p * q), tol: 0.01,
            solution: `Əvvəl AD: AD² = ${c * c} − ${p * p} = ${q * q}, AD = ${q}. S = AB · AD = ${p} · ${q} = ${p * q}.` };
        }
        if (kind === "aob") {
          let p, q, c, cf;
          do { p = rnd(3, 12); q = rnd(3, 12); c = rnd(Math.abs(p - q) + 1, p + q - 1); cf = (p * p + q * q - c * c) / (2 * p * q); } while (Math.abs(cf) > Math.cos(rad(25)));
          const sn = Math.sqrt(1 - cf * cf), ans = p + q + c;
          const P = { A: [-p, 0], B: [-q * cf, -q * sn], C: [p, 0], D: [q * cf, q * sn], O: [0, 0] };
          return { text: `ABCD paraleloqramının diaqonalları O nöqtəsində kəsişir. AC = ${2 * p}, BD = ${2 * q}, AB = ${c}. AOB üçbucağının perimetrini tap.`,
            svg: figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "O"], segs: [["A", "C", "acc"], ["B", "D", "acc"]], lab: { AB: String(c) } }),
            answer: ans, show: String(ans), tol: 0.01,
            solution: `Diaqonallar kəsişmə nöqtəsində yarıya bölünür: AO = ${2 * p} : 2 = ${p}, BO = ${2 * q} : 2 = ${q}. P(AOB) = ${p} + ${q} + ${c} = ${ans}.` };
        }
        if (kind === "bucaq") {
          const be = pick([40, 50, 60, 70, 80, 100, 110, 120, 130, 140]), ask = pick(["OAB", "CAD"]), oab = (180 - be) / 2, ans = ask === "OAB" ? oab : be / 2;
          const w = Math.cos(rad(be / 2)), hh = Math.sin(rad(be / 2));
          const P = { A: [0, 0], B: [0, hh], C: [w, hh], D: [w, 0], O: [w / 2, hh / 2] };
          return { text: `ABCD düzbucaqlısının diaqonalları O nöqtəsində kəsişir, ∠AOB = ${be}°. ∠${ask} = ?`,
            svg: figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "O"], segs: [["A", "C", "acc"], ["B", "D", "acc"]], arcs: [["O", "A", "B", be + "°", 14], ask === "OAB" ? ["A", "O", "B", "?", 22] : ["A", "D", "O", "?", 22]] }),
            answer: ans, show: ans + "°", ...deg,
            solution: `Düzbucaqlının diaqonalları bərabərdir və yarıya bölünür, ona görə OA = OB və AOB bərabəryanlı üçbucaqdır: ∠OAB = (180° − ${be}°) : 2 = ${oab}°.` + (ask === "CAD" ? ` ∠BAD = 90°, ona görə ∠CAD = 90° − ${oab}° = ${ans}°.` : "") };
        }
        if (kind === "k60") {
          const d = 2 * rnd(3, 15);
          return { text: `Düzbucaqlının diaqonalı ${d}, diaqonallar arasındakı bucaq 60°. Düzbucaqlının kiçik tərəfini tap.`, answer: d / 2, show: String(d / 2), tol: 0.01,
            solution: `Diaqonallar yarıya bölünür: OA = OB = ${d / 2}. Kiçik tərəfin qarşısında 60°-li bucaq durur, AOB üçbucağı bərabəryanlıdır və təpə bucağı 60° — deməli bərabərtərəflidir. Kiçik tərəf = ${d / 2}.` };
        }
        const sub = pick(["ad", "ds", "dp"]);
        if (sub === "ad") { const a = rnd(2, 15); return { text: `Kvadratın tərəfi ${a}. Diaqonalını tap.`, answer: a * Math.SQRT2, show: a + "√2", placeholder: "məs. 5√2",
          solution: `d² = ${a}² + ${a}² = ${2 * a * a}, d = √${2 * a * a} = ${a}√2 (≈ ${fmt(a * Math.SQRT2)}).` }; }
        if (sub === "ds") { const d = rnd(4, 20); return { text: `Kvadratın diaqonalı ${d}. Kvadratın sahəsini tap.`, answer: d * d / 2, show: frac(d * d, 2), placeholder: "məs. 18 və ya 49/2",
          solution: `Kvadrat da romb kimi diaqonallarla hesablanır: S = d² / 2 = ${d * d} / 2 = ${frac(d * d, 2)}. (Və ya a√2 = ${d} → a² = ${frac(d * d, 2)}.)` }; }
        const k = rnd(2, 12);
        return { text: `Kvadratın diaqonalı ${k}√2. Kvadratın perimetrini tap.`, answer: 4 * k, show: String(4 * k), tol: 0.01,
          solution: `Kvadratın diaqonalı d = a√2. a√2 = ${k}√2 → a = ${k}. P = 4 · ${k} = ${4 * k}.` };
      } },

    { id: "sahe", ad: "Paraleloqramın sahəsi", izah: "S = a · h (tərəf və ona çəkilmiş hündürlük) və ya S = a · b · sin α. Cavab √ ilə ola bilər (məs. 12√3).",
      gen() {
        const kind = pick(["ah", "ah", "absin", "absin"]);
        if (kind === "ah") {
          const [p, q, c] = triple(20), sub = pick(["S", "h", "hb"]);
          let a = p + rnd(2, 12);
          if (sub === "hb") { a = c * rnd(1, 3); while (a <= p + 1) a += c; }
          const S = a * q, P = { A: [0, 0], B: [p, q], C: [a + p, q], D: [a, 0], H: [p, 0] };
          const base = { poly: ABCD, names: ["A", "B", "C", "D", "H"], segs: [["B", "H", "dash"]], right: [["H", "D", "B"]] };
          if (sub === "S") return { text: `ABCD paraleloqramında AD = ${a}, AB = ${c}, BH = ${q} — AD tərəfinə çəkilmiş hündürlük. Paraleloqramın sahəsini tap.`,
            svg: figure(P, { ...base, lab: { AD: String(a), AB: String(c), BH: String(q) } }), answer: S, show: String(S), tol: 0.01,
            solution: `S = tərəf · ona çəkilmiş hündürlük = AD · BH = ${a} · ${q} = ${S}. AB = ${c} lazım deyil — o, BH-a perpendikulyar deyil.` };
          if (sub === "h") return { text: `Paraleloqramın sahəsi ${S}, AD = ${a}. AD tərəfinə çəkilmiş BH hündürlüyünü tap.`,
            svg: figure(P, { ...base, lab: { AD: String(a), BH: "?" } }), answer: q, show: String(q), tol: 0.01,
            solution: `S = AD · BH → BH = S : AD = ${S} : ${a} = ${q}.` };
          const hb = a * q / c;
          return { text: `ABCD paraleloqramında AD = ${a}, AB = ${c}, AD-yə çəkilmiş hündürlük BH = ${q}. AB tərəfinə çəkilmiş hündürlüyü tap.`,
            svg: figure(P, { ...base, lab: { AD: String(a), AB: String(c), BH: String(q) } }), answer: hb, show: frac(a * q, c), placeholder: "məs. 12 və ya 48/5",
            solution: `Sahə bir dənədir: S = AD · BH = ${a} · ${q} = ${S}. AB-yə çəkilmiş hündürlük = S : AB = ${S} : ${c} = ${frac(S, c)}.` };
        }
        let a, b; do { a = rnd(4, 14); b = rnd(3, 12); } while ((a * b) % 2);
        const al = pick([30, 150, 45, 135, 60, 120]), root = { 30: 1, 150: 1, 45: 2, 135: 2, 60: 3, 120: 3 }[al], half = a * b / 2;
        const sinS = { 1: "1/2", 2: "√2/2", 3: "√3/2" }[root], show = root === 1 ? String(half) : half + "√" + root;
        return { text: `Paraleloqramın qonşu tərəfləri ${a} və ${b}, aralarındakı bucaq ${al}°. Sahəsini tap.`,
          svg: figure(para(a, b, al), { poly: ABCD, arcs: [[...ARC.A, al + "°"]], lab: { AD: String(a), AB: String(b) } }),
          answer: half * Math.sqrt(root), show, placeholder: root === 1 ? "cavab" : "məs. 12√3",
          solution: `S = a · b · sin α = ${a} · ${b} · sin ${al}° = ${a * b} · ${sinS} = ${show}.` + (al > 90 ? ` (sin ${al}° = sin ${180 - al}°.)` : "") };
      } },

    { id: "romb", ad: "Romb", izah: "Rombun diaqonalları perpendikulyardır, yarıya bölünür və bucaqları yarıya bölür. S = d₁ · d₂ / 2.",
      gen() {
        const kind = pick(["diag", "diag", "teref", "teref", "bucaq", "x", "b60", "ph"]);
        const rombD = (p, q) => ({ A: [-p, 0], B: [0, -q], C: [p, 0], D: [0, q], O: [0, 0] });
        const dfig = (p, q) => figure(rombD(p, q), { poly: ABCD, names: ["A", "B", "C", "D", "O"], segs: [["A", "C", "acc"], ["B", "D", "acc"]], right: [["O", "C", "D"]] });
        if (kind === "diag") {
          const [p, q, c] = triple(26), d1 = 2 * p, d2 = 2 * q, S = d1 * d2 / 2, ask = pick(["a", "a", "P", "S", "h"]);
          const base = `Diaqonallar yarıya bölünür: ${d1} : 2 = ${p}, ${d2} : 2 = ${q}. Diaqonallar perpendikulyardır, ona görə tərəf = √(${p}² + ${q}²) = √${c * c} = ${c}.`;
          const T = { a: ["tərəfini", c, base], P: ["perimetrini", 4 * c, base + ` P = 4 · ${c} = ${4 * c}.`], S: ["sahəsini", S, `S = d₁ · d₂ / 2 = ${d1} · ${d2} / 2 = ${S}.`],
            h: ["hündürlüyünü", S / c, base + ` S = ${d1} · ${d2} / 2 = ${S}. Romb həm də paraleloqramdır: S = a · h → h = ${S} : ${c} = ${frac(S, c)}.`] }[ask];
          return { text: `Rombun diaqonalları ${d1} və ${d2}. Rombun ${T[0]} tap.`, svg: dfig(p, q), answer: T[1], show: ask === "h" ? frac(S, c) : String(T[1]), tol: ask === "h" ? undefined : 0.01, solution: T[2] };
        }
        if (kind === "teref") {
          const [p, q, c] = triple(26);
          return { text: `Rombun tərəfi ${c}, diaqonallarından biri ${2 * p}. O biri diaqonalı tap.`, svg: dfig(p, q), answer: 2 * q, show: String(2 * q), tol: 0.01,
            solution: `Diaqonallar perpendikulyardır və yarıya bölünür: AOB düzbucaqlı üçbucaqdır, AB = ${c}, AO = ${p}. BO = √(${c * c} − ${p * p}) = ${q}. İkinci diaqonal = 2 · ${q} = ${2 * q}.` };
        }
        const rombA = al => { const c = Math.cos(rad(al)), s = Math.sin(rad(al)); return { A: [0, 0], B: [c, s], C: [1 + c, s], D: [1, 0], O: [(1 + c) / 2, s / 2] }; };
        if (kind === "bucaq") {
          const al = pick([40, 50, 70, 80, 100, 110, 130, 140]), ask = pick(["ABD", "BAC", "ABC"]);
          const segs = [["A", "C", "acc"], ["B", "D", "acc"]], names = ["A", "B", "C", "D", "O"];
          if (ask === "ABD") { const ans = (180 - al) / 2; return { text: `ABCD rombunda ∠A = ${al}°. ∠ABD = ?`, svg: figure(rombA(al), { poly: ABCD, names, segs, arcs: [[...ARC.A, al + "°"], ["B", "A", "D", "?"]] }), answer: ans, show: ans + "°", ...deg,
            solution: `AB = AD, ona görə ABD bərabəryanlı üçbucaqdır: ∠ABD = (180° − ${al}°) : 2 = ${ans}°.` }; }
          if (ask === "BAC") { const ans = al / 2; return { text: `ABCD rombunda ∠C = ${al}°. ∠BAC = ?`, svg: figure(rombA(al), { poly: ABCD, names, segs, arcs: [[...ARC.C, al + "°"], ["A", "B", "C", "?", 24]] }), answer: ans, show: ans + "°", ...deg,
            solution: `Rombun qarşı bucaqları bərabərdir: ∠A = ∠C = ${al}°. Diaqonal AC A bucağını yarıya bölür: ∠BAC = ${al}° : 2 = ${ans}°.` }; }
          const ans = 180 - al;
          return { text: `ABCD rombunda ∠A = ${al}°. ∠ABC = ?`, svg: figure(rombA(al), { poly: ABCD, arcs: [[...ARC.A, al + "°"], [...ARC.B, "?"]] }), answer: ans, show: ans + "°", ...deg,
            solution: `Romb paraleloqramdır: qonşu bucaqların cəmi 180°. ∠ABC = 180° − ${al}° = ${ans}°.` };
        }
        if (kind === "x") {
          const x = pick([20, 25, 30, 35, 40, 50, 55, 60, 65, 70]), ans = Math.max(2 * x, 180 - 2 * x);
          return { text: `Rombun diaqonalı onun tərəfi ilə ${x}° bucaq əmələ gətirir. Rombun böyük bucağını tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Diaqonal rombun bucağını yarıya bölür, deməli həmin bucaq 2 · ${x}° = ${2 * x}°. Qonşu bucaq 180° − ${2 * x}° = ${180 - 2 * x}°. Böyüyü ${ans}°.` };
        }
        if (kind === "b60") {
          const a = 2 * rnd(2, 10), al = pick([60, 120]), ask = pick(["kicik", "kicik", "boyuk", "S"]);
          const svg = figure(rombA(al), { poly: ABCD, segs: [["A", "C", "acc"], ["B", "D", "acc"]], arcs: [[...ARC.A, al + "°"]], lab: { AD: String(a) } });
          const why = `Bucağı 60° olan təpədən çıxan iki tərəf və kiçik diaqonal bərabərtərəfli üçbucaq əmələ gətirir, kiçik diaqonal = ${a}.`;
          if (ask === "kicik") return { text: `Rombun tərəfi ${a}, bir bucağı ${al}°. Rombun kiçik diaqonalını tap.`, svg, answer: a, show: String(a), tol: 0.01, solution: why };
          if (ask === "boyuk") return { text: `Rombun tərəfi ${a}, bir bucağı ${al}°. Rombun böyük diaqonalını tap.`, svg, answer: a * Math.sqrt(3), show: a + "√3", placeholder: "məs. 6√3",
            solution: why + ` Yarım diaqonallar ${a / 2} və x: x = √(${a}² − ${a / 2}²) = ${a / 2}√3. Böyük diaqonal = ${a}√3.` };
          return { text: `Rombun tərəfi ${a}, bir bucağı ${al}°. Rombun sahəsini tap.`, svg, answer: a * a / 2 * Math.sqrt(3), show: (a * a / 2) + "√3", placeholder: "məs. 8√3",
            solution: `S = a² · sin α = ${a * a} · √3/2 = ${a * a / 2}√3. (sin 60° = sin 120° = √3/2.)` };
        }
        const a = rnd(4, 15), hh = rnd(2, a - 1);
        return { text: `Rombun perimetri ${4 * a}, hündürlüyü ${hh}. Rombun sahəsini tap.`, answer: a * hh, show: String(a * hh), tol: 0.01,
          solution: `Rombun bütün tərəfləri bərabərdir: a = ${4 * a} : 4 = ${a}. S = a · h = ${a} · ${hh} = ${a * hh}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Mətnli məsələ: əvvəl fiquru tanı (düzbucaqlı, kvadrat, romb, paraleloqram), sonra düsturu seç.",
      gen() {
        const t = pick(["otaq", "pencere", "hasar", "kafel", "torpaq", "meydanca"]);
        if (t === "otaq") {
          const a = rnd(3, 8), b = rnd(3, 6), pr = pick([8, 10, 12, 15, 20]), ans = a * b * pr;
          return { text: `Otağın döşəməsi düzbucaqlıdır: ${a} m × ${b} m. 1 m² laminat ${pr} manatdır. Bütün döşəməyə laminat neçə manata başa gələr?`, answer: ans, show: String(ans), unit: "manat", tol: 0.01,
            solution: `Sahə = ${a} · ${b} = ${a * b} m². Qiymət = ${a * b} · ${pr} = ${ans} manat.` };
        }
        if (t === "pencere") {
          const [p, q, c] = pick([[30, 40, 50], [60, 80, 100], [50, 120, 130], [90, 120, 150], [45, 60, 75], [80, 150, 170]]);
          return { text: `Düzbucaqlı pəncərənin eni ${p} sm, hündürlüyü ${q} sm. Pəncərənin diaqonalı neçə sm-dir?`, answer: c, show: c + " sm", unit: "sm", tol: 0.01,
            solution: `Diaqonal düzbucaqlı üçbucağın hipotenuzudur: √(${p}² + ${q}²) = √${c * c} = ${c} sm.` };
        }
        if (t === "hasar") {
          const a = rnd(10, 30), b = rnd(8, 25), S = a * b, ans = 2 * (a + b);
          return { text: `Düzbucaqlı bağın sahəsi ${S} m², bir tərəfi ${a} m. Bağın ətrafına hasar çəkmək üçün neçə metr tor lazımdır?`, answer: ans, show: ans + " m", unit: "m", tol: 0.01,
            solution: `O biri tərəf = ${S} : ${a} = ${b} m. Hasar = perimetr = 2 · (${a} + ${b}) = ${ans} m.` };
        }
        if (t === "kafel") {
          const [p, q, c] = pick([[15, 20, 25], [6, 8, 10], [9, 12, 15], [12, 16, 20], [5, 12, 13], [10, 24, 26]]), side = Math.random() < .5;
          if (side) return { text: `Romb şəkilli kafelin diaqonalları ${2 * p} sm və ${2 * q} sm. Kafelin tərəfi neçə sm-dir?`, answer: c, show: c + " sm", unit: "sm", tol: 0.01,
            solution: `Diaqonallar yarıya bölünür və perpendikulyardır: tərəf = √(${p}² + ${q}²) = ${c} sm.` };
          const S = 2 * p * q;
          return { text: `Romb şəkilli kafelin diaqonalları ${2 * p} sm və ${2 * q} sm. Bir kafelin sahəsi neçə sm²-dir?`, answer: S, show: S + " sm²", unit: "sm²", tol: 0.01,
            solution: `S = d₁ · d₂ / 2 = ${2 * p} · ${2 * q} / 2 = ${S} sm².` };
        }
        if (t === "torpaq") {
          let a, b; do { a = rnd(20, 60); b = rnd(10, 40); } while ((a * b) % 2);
          return { text: `Paraleloqram şəkilli torpaq sahəsinin qonşu tərəfləri ${a} m və ${b} m, aralarındakı bucaq 30°. Torpaq sahəsinin sahəsi neçə m²-dir?`, answer: a * b / 2, show: (a * b / 2) + " m²", unit: "m²", tol: 0.01,
            solution: `S = a · b · sin 30° = ${a} · ${b} · 1/2 = ${a * b / 2} m².` };
        }
        const a = rnd(5, 30);
        if (Math.random() < .5) return { text: `Kvadrat meydançanın perimetri ${4 * a} m. Meydançanın sahəsi neçə m²-dir?`, answer: a * a, show: a * a + " m²", unit: "m²", tol: 0.01,
          solution: `Tərəf = ${4 * a} : 4 = ${a} m. S = ${a}² = ${a * a} m².` };
        return { text: `Kvadrat meydançanın tərəfi ${a} m. Uşaq bir küncdən qarşı küncə düz xətt üzrə qaçır. Neçə metr qaçır? (√ ilə və ya onluq kəsrlə yaz.)`, answer: a * Math.SQRT2, show: a + "√2", unit: "m", placeholder: "məs. 10√2",
          solution: `Yol — kvadratın diaqonalıdır: d = a√2 = ${a}√2 ≈ ${fmt(a * Math.SQRT2)} m.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const t = pick(["romb", "sahe", "tenbolen", "duz"]), bad = rnd(0, 2);
        let task, st, why;
        if (t === "romb") {
          const [p, q, c] = triple(26);
          task = `Məsələ: rombun diaqonalları ${2 * p} və ${2 * q}. Tərəfini tap.`;
          st = [`AO = ${2 * p} : 2 = ${p}, BO = ${2 * q} : 2 = ${q} — diaqonallar yarıya bölünür.`, `Rombun diaqonalları perpendikulyardır, ona görə ∠AOB = 90°.`, `AB = √(${p}² + ${q}²) = √${c * c} = ${c}.`];
          const wrong = [`AO = BO = ${p} — rombun diaqonalları bərabərdir.`, `Rombun diaqonalları perpendikulyardır, ona görə ∠OAB = 90°.`, `AB = AO + BO = ${p} + ${q} = ${p + q}.`];
          st[bad] = wrong[bad];
          why = ["1-ci addımda səhv var: rombun diaqonalları bərabər deyil (bərabər diaqonallar düzbucaqlıda olur).", "2-ci addımda səhv var: düz bucaq O nöqtəsindədir (∠AOB), A-da deyil.", `3-cü addımda səhv var: hipotenuz katetlərin cəmi deyil, Pifaqorla tapılır: √(${p * p} + ${q * q}) = ${c}.`][bad];
        } else if (t === "sahe") {
          let a, b; do { a = rnd(4, 14); b = rnd(4, 12); } while ((a * b) % 2);
          task = `Məsələ: paraleloqramın tərəfləri ${a} və ${b}, aralarındakı bucaq 30°. Sahəsini tap.`;
          st = [`S = a · b · sin α.`, `sin 30° = 1/2.`, `S = ${a} · ${b} · 1/2 = ${a * b / 2}.`];
          const wrong = [`S = a · b · cos α.`, `sin 30° = √3/2.`, `S = ${a} · ${b} · 1/2 = ${a * b}.`];
          st[bad] = wrong[bad];
          why = ["1-ci addımda səhv var: paraleloqramın sahəsi S = a · b · sin α-dır, cos yox.", "2-ci addımda səhv var: sin 30° = 1/2 (√3/2 — sin 60°-dir).", `3-cü addımda hesab səhvdir: ${a * b} · 1/2 = ${a * b / 2}.`][bad];
        } else if (t === "tenbolen") {
          const x = rnd(3, 10), y = rnd(2, 9);
          task = `Məsələ: ABCD paraleloqramında A bucağının tənböləni BC-ni E nöqtəsində kəsir, BE = ${x}, EC = ${y}. Perimetri tap.`;
          st = [`∠BAE = ∠EAD, çünki AE tənböləndir.`, `∠EAD = ∠AEB (AD ∥ BC), deməli ABE bərabəryanlıdır: AB = BE = ${x}.`, `P = 2 · (${x} + ${x + y}) = ${4 * x + 2 * y}.`];
          const wrong = [`∠BAE = ∠ABE, çünki AE tənböləndir.`, `∠EAD = ∠AEB (AD ∥ BC), deməli ABE bərabəryanlıdır: AB = AE = ${x}.`, `P = 2 · (${x} + ${y}) = ${2 * (x + y)}.`];
          st[bad] = wrong[bad];
          why = ["1-ci addımda səhv var: tənbölən A bucağını iki bərabər hissəyə bölür: ∠BAE = ∠EAD.", "2-ci addımda səhv var: bərabər bucaqlar A və E təpələrindədir, onların qarşısındakı tərəflər BE və AB bərabərdir (AE yox).", `3-cü addımda səhv var: BC = BE + EC = ${x + y}, ona görə P = 2 · (${x} + ${x + y}) = ${4 * x + 2 * y}.`][bad];
        } else {
          const [p, q, c] = triple(40);
          task = `Məsələ: düzbucaqlının tərəfləri ${p} və ${q}. Diaqonalını tap.`;
          st = [`Diaqonal düzbucaqlını iki düzbucaqlı üçbucağa bölür.`, `d² = ${p}² + ${q}² = ${p * p + q * q}.`, `d = √${c * c} = ${c}.`];
          const lo = Math.min(p, q), hi = Math.max(p, q);
          const wrong = [`Diaqonal düzbucaqlını iki bərabərtərəfli üçbucağa bölür.`, `d² = ${hi}² − ${lo}² = ${hi * hi - lo * lo}.`, `d = ${c * c} : 2 = ${c * c / 2}.`];
          st[bad] = wrong[bad];
          why = ["1-ci addımda səhv var: üçbucaqlar düzbucaqlıdır (bucaq 90°), bərabərtərəfli deyil.", "2-ci addımda səhv var: diaqonal hipotenuzdur, kvadratlar toplanır.", `3-cü addımda səhv var: kvadrat kök 2-yə bölmək deyil: √${c * c} = ${c}.`][bad];
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
      key: "dordbucaqlilar", title: "Dördbucaqlılar: paraleloqram, romb, düzbucaqlı", fenn: "riyaziyyat", link: "dersler/dordbucaqlilar.html",
      format: "Cavab — ədəd: tərəf, bucaq (dərəcə ilə, ° yazmaq lazım deyil), perimetr, sahə. Kök: 5√2, kəsr: 48/5, onluq: 9,6.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["bucaq", "perimetr", "diaqonal", "diaqonal", "sahe", "sahe", "romb", "romb", "romb", "heyat"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/dordbucaqlilar.html")) b.push("dersler/dordbucaqlilar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
