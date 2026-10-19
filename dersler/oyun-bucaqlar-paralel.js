// Bucaqlar, paralel və perpendikulyar düz xətlər — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const range = (a, b, s = 1) => { const r = []; for (let x = a; x <= b; x += s) r.push(x); return r; };
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const rad = d => d * Math.PI / 180;
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const deg = { unit: "°", tol: 0.01 };
  const S = n => n < 0 ? "−" + (-n) : String(n);
  // "3x + 15", "x − 20", "2x"
  const lx = (p, q) => (p === 1 ? "" : p) + "x" + (q ? (q < 0 ? " − " + (-q) : " + " + q) : "");
  const steps = (task, list) => h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...list.map(s => h("li", {}, s))));
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];
  const NOT90 = [...range(25, 80, 5), ...range(100, 155, 5)];
  const PARTH = [...range(40, 80, 5), ...range(100, 140, 5)]; // angles readable in the a ∥ b figure

  // ---- figure: points in math coordinates (y up); random quarter-turn rotation and mirror
  // o: { poly?, segs:[[p,q,"ink"|"acc"|"dash"]], names:[...], place:{k:[[p,q..], ±1]}, right:[[v,p,q]], arcs:[[v,p,q,text,R,count,noArc]] }
  const INK = "#17171a", ACC = "#534ab7";
  function figure(P, o) {
    const W = 280, H = 200, pad = 30;
    const r = pick(o.rot || [0, 90, 180, 270]) * Math.PI / 180, flip = Math.random() < .5 ? -1 : 1;
    const Q = {};
    for (const k in P) { const x = P[k][0] * flip, y = P[k][1]; Q[k] = [x * Math.cos(r) - y * Math.sin(r), -(x * Math.sin(r) + y * Math.cos(r))]; }
    const xs = Object.values(Q).map(p => p[0]), ys = Object.values(Q).map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min((W - 2 * pad) / ((x1 - x0) || 1), (H - 2 * pad) / ((y1 - y0) || 1));
    const ox = (W - s * (x1 - x0)) / 2 - s * x0, oy = (H - s * (y1 - y0)) / 2 - s * y0;
    for (const k in Q) Q[k] = [ox + s * Q[k][0], oy + s * Q[k][1]];
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": o.aria || "Şəkil" });
    const ctr = o.center || o.poly || o.names || Object.keys(Q);
    const cen = [0, 1].map(i => ctr.reduce((t, k) => t + Q[k][i], 0) / ctr.length);
    const unit = v => { const L = Math.hypot(...v) || 1; return [v[0] / L, v[1] / L]; };
    if (o.poly) g.append(sv("polygon", { points: o.poly.map(k => Q[k].join(",")).join(" "), fill: "#eeedfe", stroke: INK, "stroke-width": 2, "stroke-linejoin": "round" }));
    for (const [p, q, st] of o.segs || []) {
      const a = { x1: Q[p][0], y1: Q[p][1], x2: Q[q][0], y2: Q[q][1], stroke: st === "acc" ? ACC : INK, "stroke-width": st === "dash" ? 1.5 : 2, "stroke-linecap": "round" };
      if (st === "dash") a["stroke-dasharray"] = "5 4";
      g.append(sv("line", a));
    }
    for (const [v, p, q] of o.right || []) {
      const u = k => { const d = unit([Q[k][0] - Q[v][0], Q[k][1] - Q[v][1]]); return [d[0] * 9, d[1] * 9]; };
      const a = u(p), b = u(q), V = Q[v];
      g.append(sv("path", { d: `M${V[0] + a[0]} ${V[1] + a[1]}L${V[0] + a[0] + b[0]} ${V[1] + a[1] + b[1]}L${V[0] + b[0]} ${V[1] + b[1]}`, fill: "none", stroke: INK, "stroke-width": 1.3 }));
    }
    for (const [v, p, q, t, rr, cnt, noArc] of o.arcs || []) {
      const V = Q[v], R = rr || 18, ang = k => Math.atan2(Q[k][1] - V[1], Q[k][0] - V[0]);
      let t1 = ang(p), t2 = ang(q); if (Math.abs(t2 - t1) > Math.PI) t2 += t2 < t1 ? 2 * Math.PI : -2 * Math.PI;
      if (!noArc) for (let j = 0; j < (cnt || 1); j++) {
        const RR = R + 4 * j, pts = Array.from({ length: 13 }, (_, i) => { const t = t1 + (t2 - t1) * i / 12; return (V[0] + RR * Math.cos(t)).toFixed(1) + " " + (V[1] + RR * Math.sin(t)).toFixed(1); });
        g.append(sv("path", { d: "M" + pts.join("L"), fill: "none", stroke: ACC, "stroke-width": 2 }));
      }
      if (t) { const tm = (t1 + t2) / 2, d = noArc ? R : R + 4 * ((cnt || 1) - 1) + 15 + Math.max(0, 50 - Math.abs(t2 - t1) * 180 / Math.PI) * .5; g.append(sv("text", { x: V[0] + d * Math.cos(tm), y: V[1] + d * Math.sin(tm) + 4, "text-anchor": "middle", class: "oy-lbl", style: "fill:" + ACC + ";font-size:12px" }, t)); }
    }
    for (const k of o.names || []) {
      let d = [Q[k][0] - cen[0], Q[k][1] - cen[1]];
      const pl = (o.place || {})[k];
      if (pl) { d = [0, 0]; for (const p of pl[0]) { const u = unit([Q[p][0] - Q[k][0], Q[p][1] - Q[k][1]]); d[0] += u[0] * pl[1]; d[1] += u[1] * pl[1]; } }
      if (Math.hypot(...d) < 1e-6) d = [1, -1];
      d = unit(d);
      g.append(sv("text", { x: Q[k][0] + d[0] * 14, y: Q[k][1] + d[1] * 14 + 5, "text-anchor": "middle", class: "oy-lbl", style: "fill:#5f5e5a;font-style:italic" }, k));
    }
    return g;
  }

  // two lines AC and BD crossing at O, ∠AOB = al
  const crossP = al => ({ O: [0, 0], A: [-1, 0], C: [1, 0], B: [-Math.cos(rad(al)), Math.sin(rad(al))], D: [Math.cos(rad(al)), -Math.sin(rad(al))] });

  // ---- a ∥ b cut by c: angles 1–4 at a, 5–8 at b; ∠2 = th (between c going "up" and a going "right")
  // 1 upper-left, 2 upper-right, 3 lower-left, 4 lower-right (same at b)
  const angV = (n, th) => [2, 3, 6, 7].includes(n) ? th : 180 - th;
  function parFig(th, hl) {
    const H = 1.4, c = Math.cos(rad(th)), s = Math.sin(rad(th)), k = .6, bx = -H * c / s;
    const xl = Math.min(0, bx) - 1.4, xr = Math.max(0, bx) + 1.4;
    const P = { T: [0, 0], B: [bx, -H], a0: [xl, 0], a: [xr, 0], b0: [xl, -H], b: [xr, -H], c: [1.0 * c, 1.0 * s], c0: [bx - 1.0 * c, -H - 1.0 * s],
      Tr: [k, 0], Tl: [-k, 0], Tu: [k * c, k * s], Td: [-k * c, -k * s], Br: [bx + k, -H], Bl: [bx - k, -H], Bu: [bx + k * c, -H + k * s], Bd: [bx - k * c, -H - k * s] };
    const POS = { 1: ["T", "Tl", "Tu"], 2: ["T", "Tu", "Tr"], 3: ["T", "Tl", "Td"], 4: ["T", "Td", "Tr"], 5: ["B", "Bl", "Bu"], 6: ["B", "Bu", "Br"], 7: ["B", "Bl", "Bd"], 8: ["B", "Bd", "Br"] };
    const arcs = [];
    for (let n = 1; n <= 8; n++) { arcs.push([...POS[n], String(n), 21, 1, true]); if (hl.includes(n)) arcs.push([...POS[n], "", 9]); }
    return figure(P, { segs: [["a0", "a"], ["b0", "b"], ["c0", "c"]], names: ["a", "b", "c"], center: ["T", "B"], arcs, aria: "a və b paralel düz xətləri c kəsəni ilə; bucaqlar 1-dən 8-ə qədər nömrələnib" });
  }
  const PAIRS = [[1, 4, "q"], [2, 3, "q"], [5, 8, "q"], [6, 7, "q"], [1, 2, "k"], [1, 3, "k"], [2, 4, "k"], [3, 4, "k"], [5, 6, "k"], [5, 7, "k"], [6, 8, "k"], [7, 8, "k"],
    [1, 5, "u"], [2, 6, "u"], [3, 7, "u"], [4, 8, "u"], [3, 6, "dc"], [4, 5, "dc"], [1, 8, "xc"], [2, 7, "xc"], [3, 5, "db"], [4, 6, "db"], [1, 7, "xb"], [2, 8, "xb"]];
  const CROSS = PAIRS.filter(p => !["q", "k"].includes(p[2]));
  const TYPE = { q: ["qarşılıqlı", true], k: ["qonşu", false], u: ["uyğun", true], dc: ["daxili çarpaz", true], xc: ["xarici çarpaz", true], db: ["daxili birtərəfli", false], xb: ["xarici birtərəfli", false] };
  const why = (t, i, j) => { const [nm, eq] = TYPE[t], par = ["q", "k"].includes(t) ? "" : " (a ∥ b)";
    return eq ? `∠${i} və ∠${j} ${nm} bucaqlardır${par} — bərabərdir.` : `∠${i} və ∠${j} ${nm} bucaqlardır${par} — cəmi 180°.`; };

  // zigzag: a ∥ b, M between them; ∠(a, AM) = al, ∠(b, BM) = be → ∠AMB = al + be
  function zigFig(al, be, labA, labB, labM) {
    const my = (rnd(-3, 3)) / 10, t = (1 - my) / Math.sin(rad(al)), s = (my + 1) / Math.sin(rad(be));
    const A = [-t * Math.cos(rad(al)), 1], B = [-s * Math.cos(rad(be)), -1];
    const xl = Math.min(A[0], B[0]) - .7, xr = Math.max(A[0], B[0], 0) + 1.3;
    const P = { M: [0, my], A, B, A1: [A[0] + 1, 1], B1: [B[0] + 1, -1], a0: [xl, 1], a: [xr, 1], b0: [xl, -1], b: [xr, -1] };
    return figure(P, { segs: [["a0", "a"], ["b0", "b"], ["A", "M", "acc"], ["M", "B", "acc"]], names: ["A", "B", "M", "a", "b"], center: ["A", "B", "M"],
      place: { M: [["A", "B"], -1], A: [["M", "A1"], -1], B: [["M", "B1"], -1] },
      arcs: [["A", "A1", "M", labA], ["B", "B1", "M", labB], ["M", "A", "B", labM, 16]], rot: [0, 180], aria: "a ∥ b, M nöqtəsi onların arasında, AMB sınıq xətti" });
  }

  const levels = [
    { id: "qonsu", ad: "Qonşu və qarşılıqlı bucaqlar", izah: "Qonşu bucaqların cəmi 180°. Qarşılıqlı bucaqlar bərabərdir. Perpendikulyar düz xətlər arasındakı bucaq 90°-dir.",
      gen() {
        const kind = pick(["bir", "bir", "nisbet", "ferq", "kat", "cem", "uc", "perp", "perp"]), big = Math.random() < .5, W = big ? "böyüyünü" : "kiçiyini";
        if (kind === "bir") {
          const al = pick(NOT90), ask = pick(["BOC", "COD", "DOA"]), ans = ask === "COD" ? al : 180 - al;
          const arc = { BOC: ["O", "B", "C"], COD: ["O", "C", "D"], DOA: ["O", "D", "A"] }[ask];
          return { text: `AC və BD düz xətləri O nöqtəsində kəsişir, ∠AOB = ${al}°. ∠${ask} neçə dərəcədir?`,
            svg: figure(crossP(al), { segs: [["A", "C"], ["B", "D"]], names: ["A", "B", "C", "D", "O"], place: { O: [["A", "D"], 1] }, arcs: [["O", "A", "B", al + "°"], [...arc, "?", 22]] }),
            answer: ans, show: ans + "°", ...deg,
            solution: ask === "COD" ? `∠COD və ∠AOB qarşılıqlı bucaqlardır — bərabərdir: ∠COD = ${al}°.` : `∠${ask} və ∠AOB qonşu bucaqlardır — cəmi 180°: ∠${ask} = 180° − ${al}° = ${ans}°.` };
        }
        if (kind === "nisbet") {
          const [k, m] = pick([[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [4, 5], [1, 8], [2, 7], [3, 7], [5, 7], [7, 11], [4, 11], [1, 9], [3, 5], [5, 13]]), u = 180 / (k + m), ans = big ? m * u : k * u;
          return { text: `Qonşu bucaqların nisbəti ${k} : ${m} kimidir. Bu bucaqlardan ${W} tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Qonşu bucaqların cəmi 180°. Bir hissə = 180° : ${k + m} = ${u}°. Bucaqlar ${k * u}° və ${m * u}°.` };
        }
        if (kind === "ferq") {
          const d = pick(range(10, 140, 10)), sm = (180 - d) / 2, ans = big ? sm + d : sm;
          return { text: `Qonşu bucaqlardan biri digərindən ${d}° böyükdür. Bu bucaqlardan ${W} tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `x + (x + ${d}°) = 180° → 2x = ${180 - d}° → x = ${sm}°. Bucaqlar ${sm}° və ${sm + d}°.` };
        }
        if (kind === "kat") {
          const k = pick([2, 3, 4, 5, 8, 9, 11, 14, 17]), u = 180 / (k + 1), ans = big ? k * u : u;
          return { text: `Qonşu bucaqlardan biri digərindən ${k} dəfə böyükdür. Bu bucaqlardan ${W} tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `x + ${k}x = 180° → ${k + 1}x = 180° → x = ${u}°. Bucaqlar ${u}° və ${k * u}°.` };
        }
        if (kind === "cem") {
          const x = pick(NOT90), Sm = 2 * x, ans = big ? Math.max(x, 180 - x) : Math.min(x, 180 - x);
          return { text: `İki düz xətt kəsişəndə dörd bucaq alındı. Onlardan ikisinin cəmi ${Sm}°-dir. Bu dörd bucaqdan ${W} tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Qonşu bucaqların cəmi 180° olardı, burada ${Sm}°. Deməli, bunlar qarşılıqlı bucaqlardır və bərabərdir: hər biri ${Sm}° : 2 = ${x}°. Qalan iki bucaq 180° − ${x}° = ${180 - x}°.` };
        }
        if (kind === "uc") {
          const y = pick(NOT90), Sm = 360 - y;
          return { text: `İki düz xətt kəsişəndə alınan dörd bucaqdan üçünün cəmi ${Sm}°-dir. Dördüncü bucağı tap.`, answer: y, show: y + "°", ...deg,
            solution: `Dörd bucağın cəmi 360°-dir (iki cüt qonşu bucaq: 180° + 180°). Dördüncü bucaq = 360° − ${Sm}° = ${y}°.` };
        }
        const x = pick(range(100, 160, 5)), ask = pick(["COD", "DOB"]), ans = ask === "COD" ? x - 90 : 180 - x;
        const P = { O: [0, 0], A: [-1, 0], B: [1, 0], C: [0, 1], D: [-Math.cos(rad(x)), Math.sin(rad(x))] };
        return { text: `O nöqtəsi AB düz xəttinin üzərindədir, OC ⊥ AB. OD şüası C və B arasından keçir, ∠AOD = ${x}°. ∠${ask} neçə dərəcədir?`,
          svg: figure(P, { segs: [["A", "B"], ["O", "C"], ["O", "D", "acc"]], names: ["A", "B", "C", "D", "O"], place: { O: [["C"], -1] }, right: [["O", "A", "C"]], arcs: [ask === "COD" ? ["O", "C", "D", "?", 26] : ["O", "D", "B", "?", 26]] }),
          answer: ans, show: ans + "°", ...deg,
          solution: ask === "COD" ? `∠AOC = 90° (OC ⊥ AB). ∠AOD = ∠AOC + ∠COD → ∠COD = ${x}° − 90° = ${ans}°.` : `∠AOD və ∠DOB qonşu bucaqlardır: ∠DOB = 180° − ${x}° = ${ans}°.` };
      } },

    { id: "tenbolen", ad: "Bucağın tənböləni", izah: "Tənbölən bucağı iki bərabər hissəyə bölür. Çox vaxt qonşu bucaqla birlikdə işlənir.",
      gen() {
        const kind = pick(["uzanti", "qonsu", "qonsu", "ic", "teref"]);
        if (kind === "uzanti") {
          const al = pick(range(30, 170, 4)), ans = 180 - al / 2;
          const P = { O: [0, 0], A: [1, 0], D: [-1, 0], B: [Math.cos(rad(al)), Math.sin(rad(al))], C: [Math.cos(rad(al / 2)), Math.sin(rad(al / 2))] };
          return { text: `∠AOB = ${al}°, OC — bu bucağın tənbölənidir. OD şüası OA şüasının uzantısıdır (A, O, D bir düz xətt üzərindədir). ∠COD neçə dərəcədir?`,
            svg: figure(P, { segs: [["D", "A"], ["O", "B"], ["O", "C", "acc"]], names: ["A", "B", "C", "D", "O"], place: { O: [["B"], -1] }, arcs: [["O", "A", "C", "", 16], ["O", "C", "B", "", 16], ["O", "C", "D", "?", 30]] }),
            answer: ans, show: ans + "°", ...deg,
            solution: `Tənbölən: ∠AOC = ${al}° : 2 = ${al / 2}°. ∠AOC və ∠COD qonşu bucaqlardır: ∠COD = 180° − ${al / 2}° = ${ans}°.` };
        }
        if (kind === "qonsu") {
          const al = pick(range(20, 160, 2).filter(v => v !== 90)), ask = pick(["AOM", "COM"]), half = (180 - al) / 2, ans = ask === "AOM" ? al + half : half;
          const P = { O: [0, 0], A: [-1, 0], B: [1, 0], C: [-Math.cos(rad(al)), Math.sin(rad(al))], M: [Math.cos(rad(half)), Math.sin(rad(half))] };
          return { text: `∠AOC və ∠COB qonşu bucaqlardır, ∠AOC = ${al}°. OM — ∠COB-nin tənbölənidir. ∠${ask} neçə dərəcədir?`,
            svg: figure(P, { segs: [["A", "B"], ["O", "C"], ["O", "M", "acc"]], names: ["A", "B", "C", "M", "O"], place: { O: [["C"], -1] }, arcs: [["O", "A", "C", al + "°", 14], ask === "AOM" ? ["O", "A", "M", "?", 34] : ["O", "C", "M", "?", 26]] }),
            answer: ans, show: ans + "°", ...deg,
            solution: `∠COB = 180° − ${al}° = ${180 - al}° (qonşu bucaqlar). Tənbölən: ∠COM = ${180 - al}° : 2 = ${half}°.` + (ask === "AOM" ? ` ∠AOM = ∠AOC + ∠COM = ${al}° + ${half}° = ${ans}°.` : "") };
        }
        if (kind === "ic") {
          const al = pick(range(60, 170, 2)), be = rnd(20, al - 20), ans = al / 2;
          const P = { O: [0, 0], A: [1, 0], C: [Math.cos(rad(be)), Math.sin(rad(be))], B: [Math.cos(rad(al)), Math.sin(rad(al))], M: [.8 * Math.cos(rad(be / 2)), .8 * Math.sin(rad(be / 2))], N: [.8 * Math.cos(rad((al + be) / 2)), .8 * Math.sin(rad((al + be) / 2))] };
          return { text: `OC şüası ∠AOB-nin daxilindən keçir. ∠AOB = ${al}°, ∠AOC = ${be}°. OM — ∠AOC-nin, ON — ∠COB-nin tənbölənidir. ∠MON neçə dərəcədir?`,
            svg: figure(P, { segs: [["O", "A"], ["O", "B"], ["O", "C"], ["O", "M", "acc"], ["O", "N", "acc"]], names: ["A", "B", "C", "M", "N", "O"], place: { O: [["C"], -1] }, arcs: [["O", "M", "N", "?", 20]] }),
            answer: ans, show: ans + "°", ...deg,
            solution: `∠COB = ${al}° − ${be}° = ${al - be}°. ∠MOC = ${be}° : 2 = ${be / 2}°, ∠CON = ${al - be}° : 2 = ${(al - be) / 2}°. ∠MON = ${be / 2}° + ${(al - be) / 2}° = ${ans}° — yəni ∠AOB-nin yarısı.` };
        }
        const x = pick(range(10, 85, 5)), ans = 180 - 2 * x;
        return { text: `Bucağın tənböləni onun tərəfi ilə ${x}° bucaq əmələ gətirir. Bu bucağa qonşu olan bucağı tap.`, answer: ans, show: ans + "°", ...deg,
          solution: `Tənbölən bucağı yarıya bölür: bucaq = 2 · ${x}° = ${2 * x}°. Qonşu bucaq = 180° − ${2 * x}° = ${ans}°.` };
      } },

    { id: "paralel", ad: "Paralel düz xətlər və kəsən", izah: "a ∥ b. Uyğun, daxili çarpaz, xarici çarpaz bucaqlar bərabərdir; daxili və xarici birtərəfli bucaqların cəmi 180°.",
      gen() {
        const th = pick(PARTH);
        if (Math.random() < .3) {
          const [i, j, t] = pick(CROSS), names = Object.keys(TYPE).filter(x => x !== t);
          const opts = shuffle([TYPE[t][0], ...shuffle(names).slice(0, 3).map(x => TYPE[x][0])]);
          return { text: `a ∥ b, c — kəsəndir. ∠${i} və ∠${j} necə bucaqlardır?`, svg: parFig(th, [i, j]), choices: opts, correct: opts.indexOf(TYPE[t][0]), show: TYPE[t][0],
            solution: `∠${i} və ∠${j} ${TYPE[t][0]} bucaqlardır. ` + { u: "Hər ikisi kəsənin eyni tərəfində və öz düz xəttinə nəzərən eyni vəziyyətdədir.", dc: "Hər ikisi a və b arasındadır, kəsənin müxtəlif tərəflərindədir.", xc: "Hər ikisi a və b-dən kənardadır, kəsənin müxtəlif tərəflərindədir.", db: "Hər ikisi a və b arasındadır, kəsənin eyni tərəfindədir.", xb: "Hər ikisi a və b-dən kənardadır, kəsənin eyni tərəfindədir." }[t] };
        }
        let [i, j, t] = pick(Math.random() < .75 ? CROSS : PAIRS); if (Math.random() < .5) [i, j] = [j, i];
        const vi = angV(i, th), vj = angV(j, th);
        return { text: `a ∥ b, c — kəsəndir. ∠${i} = ${vi}°. ∠${j} neçə dərəcədir?`, svg: parFig(th, [i, j]), answer: vj, show: vj + "°", ...deg,
          solution: why(t, i, j) + (TYPE[t][1] ? ` ∠${j} = ${vj}°.` : ` ∠${j} = 180° − ${vi}° = ${vj}°.`) };
      } },

    { id: "tenlik", ad: "Paralellik və tənlik", izah: "Bucaqlar x ilə verilir. Bərabər bucaqlar → bərabərlik; birtərəfli və ya qonşu → cəmi 180°. Tənliyi qur və həll et.",
      gen() {
        const kind = pick(["alg", "alg", "elamet", "nisbet", "ferq", "cem"]);
        if (kind === "alg" || kind === "elamet") {
          let x, p, q, r, s, i, j, t, th;
          do {
            th = pick(PARTH); [i, j, t] = pick(CROSS); x = rnd(4, 30); p = rnd(1, 5); r = rnd(1, 5);
            q = angV(i, th) - p * x; s = angV(j, th) - r * x;
          } while (p === r || Math.abs(q) > 120 || Math.abs(s) > 120 || q === 0 && s === 0);
          const eq = TYPE[t][1], vi = angV(i, th), vj = angV(j, th);
          const eqn = eq ? `${lx(p, q)} = ${lx(r, s)}` : `(${lx(p, q)}) + (${lx(r, s)}) = 180`;
          const cx = c => c === 1 ? "" : c === -1 ? "−" : S(c);
          const solve = eq ? `${cx(p - r)}x = ${S(s - q)} → x = ${x}` : `${cx(p + r)}x = ${S(180 - q - s)} → x = ${x}`;
          if (kind === "elamet") return { text: `a və b düz xətlərini c kəsəni kəsir. ∠${i} = (${lx(p, q)})°, ∠${j} = (${lx(r, s)})°. x-in hansı qiymətində a ∥ b olar?`, svg: parFig(th, [i, j]), answer: x, show: String(x), tol: 0.01,
            solution: `∠${i} və ∠${j} ${TYPE[t][0]} bucaqlardır. Paralellik əlaməti: onlar ${eq ? "bərabər olmalıdır" : "180°-yə tamamlamalıdır"}. ${eqn} → ${solve}.` };
          return { text: `a ∥ b, c — kəsəndir. ∠${i} = (${lx(p, q)})°, ∠${j} = (${lx(r, s)})°. ∠${i} neçə dərəcədir?`, svg: parFig(th, [i, j]), answer: vi, show: vi + "°", ...deg,
            solution: why(t, i, j) + ` ${eqn} → ${solve}. ∠${i} = ${p === 1 ? "" : p + " · "}${x}${q ? (q < 0 ? " − " + (-q) : " + " + q) : ""} = ${vi}°.` + ` (Yoxla: ∠${j} = ${vj}°.)` };
        }
        const big = Math.random() < .5, W = big ? "böyüyünü" : "kiçiyini";
        if (kind === "nisbet") {
          const [k, m] = pick([[1, 2], [1, 3], [1, 4], [1, 5], [2, 3], [4, 5], [2, 7], [3, 7], [5, 7], [4, 11], [1, 9], [3, 5], [7, 13]]), u = 180 / (k + m), ans = big ? m * u : k * u;
          return { text: `İki paralel düz xətti kəsən kəsir. Daxili birtərəfli bucaqların nisbəti ${k} : ${m} kimidir. Bu bucaqlardan ${W} tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Daxili birtərəfli bucaqların cəmi 180°. Bir hissə = 180° : ${k + m} = ${u}°. Bucaqlar ${k * u}° və ${m * u}°.` };
        }
        if (kind === "ferq") {
          const d = pick(range(10, 140, 10)), sm = (180 - d) / 2, ans = big ? sm + d : sm;
          return { text: `İki paralel düz xətti kəsən kəsir. Xarici birtərəfli bucaqlardan biri digərindən ${d}° böyükdür. Bu bucaqlardan ${W} tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Xarici birtərəfli bucaqların cəmi 180°: x + (x + ${d}°) = 180° → x = ${sm}°. Bucaqlar ${sm}° və ${sm + d}°.` };
        }
        const x = pick(NOT90), Sm = 2 * x, ans = Math.max(x, 180 - x);
        return { text: `İki paralel düz xətti kəsən kəsir. Daxili çarpaz bucaqların cəmi ${Sm}°-dir. Alınan səkkiz bucaqdan ən böyüyünü tap.`, answer: ans, show: ans + "°", ...deg,
          solution: `Daxili çarpaz bucaqlar bərabərdir: hər biri ${Sm}° : 2 = ${x}°. Səkkiz bucağın hamısı ya ${x}°, ya da 180° − ${x}° = ${180 - x}°-dir. Ən böyüyü ${ans}°.` };
      } },

    { id: "cem", ad: "Bucaqların cəmi", izah: "Paralel xətlər arasındakı sınıq xətt: M-dən paralel xətt çək. Nöqtə ətrafındakı bucaqların cəmi 360°. Tərəfləri paralel bucaqlar ya bərabərdir, ya cəmi 180°.",
      gen() {
        const kind = pick(["zig", "zig", "zigb", "noqte", "teref", "teref"]);
        if (kind === "zig") {
          const al = pick(range(20, 75, 5)), be = pick(range(20, 75, 5)), ans = al + be;
          return { text: `a ∥ b. M nöqtəsi a və b arasındadır, A ∈ a, B ∈ b. AM ilə a düz xətti arasında bucaq ${al}°, BM ilə b arasında bucaq ${be}° (şəkildəki kimi). ∠AMB neçə dərəcədir?`,
            svg: zigFig(al, be, al + "°", be + "°", "?"), answer: ans, show: ans + "°", ...deg,
            solution: `M-dən a-ya paralel düz xətt çək — o, b-yə də paraleldir. ∠AMB onu iki hissəyə bölür: daxili çarpaz bucaqlara görə hissələr ${al}° və ${be}°. ∠AMB = ${al}° + ${be}° = ${ans}°.` };
        }
        if (kind === "zigb") {
          const al = pick(range(20, 75, 5)), be = pick(range(20, 75, 5)), m = al + be;
          return { text: `a ∥ b. M nöqtəsi a və b arasındadır, A ∈ a, B ∈ b. ∠AMB = ${m}°, AM ilə a arasında bucaq ${al}° (şəkildəki kimi). BM ilə b arasındakı bucağı tap.`,
            svg: zigFig(al, be, al + "°", "?", m + "°"), answer: be, show: be + "°", ...deg,
            solution: `M-dən a-ya paralel düz xətt çəksək, ∠AMB = (AM ilə a arasındakı bucaq) + (BM ilə b arasındakı bucaq). ${m}° − ${al}° = ${be}°.` };
        }
        if (kind === "noqte") {
          let k, m, n; do { [k, m, n] = [rnd(1, 9), rnd(1, 9), rnd(1, 9)]; } while (360 % (k + m + n) || k === m || m === n || k === n);
          const u = 360 / (k + m + n), mx = Math.max(k, m, n) * u;
          return { text: `Bir nöqtədən çıxan üç şüa müstəvini üç bucağa bölür. Bu bucaqlar ${k} : ${m} : ${n} nisbətindədir. Ən böyük bucağı tap.`, answer: mx, show: mx + "°", ...deg,
            solution: `Nöqtə ətrafındakı bucaqların cəmi 360°. Bir hissə = 360° : ${k + m + n} = ${u}°. Bucaqlar ${k * u}°, ${m * u}°, ${n * u}°. Ən böyüyü ${mx}°.` };
        }
        const par = pick(["paralel", "perpendikulyar"]), parD = par === "paralel" ? "paraleldir" : "perpendikulyardır";
        if (Math.random() < .5) {
          const al = pick(range(20, 85, 5)), ans = 180 - al;
          return { text: `∠A və ∠B-nin uyğun tərəfləri ${parD}. ∠A = ${al}°, ∠B isə kor bucaqdır. ∠B neçə dərəcədir?`, answer: ans, show: ans + "°", ...deg,
            solution: `Uyğun tərəfləri ${par} olan bucaqlar ya bərabərdir, ya da cəmi 180°-dir. ∠B kordur, iti ∠A-ya bərabər ola bilməz. ∠B = 180° − ${al}° = ${ans}°.` };
        }
        const k = pick([2, 3, 4, 5, 8, 9, 11]), u = 180 / (k + 1), big = Math.random() < .5, ans = big ? k * u : u;
        return { text: `İki bucağın uyğun tərəfləri ${parD}. Bu bucaqlardan biri o birindən ${k} dəfə böyükdür. ${big ? "Böyük" : "Kiçik"} bucağı tap.`, answer: ans, show: ans + "°", ...deg,
          solution: `Uyğun tərəfləri ${par} olan bucaqlar ya bərabərdir, ya da cəmi 180°. Bərabər deyillər, deməli x + ${k}x = 180° → x = ${u}°. Bucaqlar ${u}° və ${k * u}°.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Saat əqrəbləri, güzgü, yollar — hamısı bucaqlardır. Dəqiqə əqrəbi dəqiqədə 6°, saat əqrəbi dəqiqədə 0,5° dönür.",
      gen() {
        const t = pick(["saat", "saat", "saat", "guzgu", "yol", "deqiqe"]);
        if (t === "saat") {
          const hh = rnd(1, 11), mm = 2 * rnd(0, 29), mA = 6 * mm, hA = 30 * hh + mm / 2, d = Math.abs(hA - mA), ans = d > 180 ? 360 - d : d;
          return { text: `Saat ${hh}:${String(mm).padStart(2, "0")} göstərir. Saat əqrəbi ilə dəqiqə əqrəbi arasındakı kiçik bucaq neçə dərəcədir?`, answer: ans, show: ans + "°", ...deg,
            solution: `12-dən saat istiqamətində ölçürük. Dəqiqə əqrəbi: ${mm} · 6° = ${mA}°. Saat əqrəbi: ${hh} · 30° + ${mm} · 0,5° = ${hA}°. Fərq ${d}°` + (d > 180 ? `, kiçik bucaq 360° − ${d}° = ${ans}°.` : `.`) };
        }
        if (t === "guzgu") {
          const al = pick(range(10, 85, 5)), ans = 180 - 2 * al;
          return { text: `İşıq şüası müstəvi güzgünün səthi ilə ${al}° bucaq altında düşür və səthlə eyni ${al}° bucaq altında əks olunur. Düşən və əks olunan şüalar arasındakı bucaq neçə dərəcədir?`, answer: ans, show: ans + "°", ...deg,
            solution: `Güzgü düz xəttində üç bucaq yanaşı durur: ${al}°, axtarılan bucaq və yenə ${al}°. Cəmi 180°: 180° − 2 · ${al}° = ${ans}°.` };
        }
        if (t === "yol") {
          const al = pick(range(25, 85, 5)), ans = 180 - al;
          return { text: `İki paralel küçəni düz yol kəsir. Yol birinci küçə ilə ${al}° iti bucaq əmələ gətirir. Yolun ikinci küçə ilə əmələ gətirdiyi kor bucaq neçə dərəcədir?`, answer: ans, show: ans + "°", ...deg,
            solution: `Küçələr paralel, yol kəsəndir. İkinci küçədə də iti bucaq ${al}°-dir (uyğun bucaqlar). Kor bucaq ona qonşudur: 180° − ${al}° = ${ans}°.` };
        }
        const m = rnd(3, 59), hand = Math.random() < .5;
        if (hand) return { text: `Dəqiqə əqrəbi ${m} dəqiqədə neçə dərəcə dönür?`, answer: 6 * m, show: 6 * m + "°", ...deg,
          solution: `60 dəqiqədə tam dövrə — 360°, yəni dəqiqədə 6°. ${m} · 6° = ${6 * m}°.` };
        const hrs = rnd(1, 11), mm = 2 * rnd(1, 29), tot = 30 * hrs + mm / 2;
        return { text: `Saat əqrəbi ${hrs} saat ${mm} dəqiqədə neçə dərəcə dönür?`, answer: tot, show: tot + "°", ...deg,
          solution: `12 saatda 360°, yəni saatda 30°, dəqiqədə 0,5°. ${hrs} · 30° + ${mm} · 0,5° = ${30 * hrs}° + ${mm / 2}° = ${tot}°.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const t = pick(["par", "nisbet", "tenbolen", "zig"]), bad = rnd(0, 2);
        let task, st, wrong, whyS;
        if (t === "par") {
          const v = pick(NOT90), ans = 180 - v;
          task = `Məsələ: a ∥ b, c — kəsən. Daxili birtərəfli bucaqlardan biri ${v}°. O birini tap.`;
          st = [`Daxili birtərəfli bucaqların cəmi 180°-dir.`, `x + ${v}° = 180°.`, `x = 180° − ${v}° = ${ans}°.`];
          wrong = [`Daxili birtərəfli bucaqlar bərabərdir.`, `x = ${v}° + 180°.`, `x = 180° − ${v}° = ${ans + pick([10, -10, 20])}°.`];
          whyS = ["1-ci addımda səhv var: bərabər olan çarpaz və uyğun bucaqlardır, daxili birtərəfli bucaqların isə cəmi 180°-dir.", "2-ci addımda səhv var: bucaqlar toplanır və 180° alınır: x + " + v + "° = 180°.", `3-cü addımda hesab səhvdir: 180° − ${v}° = ${ans}°.`];
        } else if (t === "nisbet") {
          const [k, m] = pick([[2, 7], [1, 5], [1, 2], [4, 5], [3, 7], [5, 13], [1, 8]]), u = 180 / (k + m);
          task = `Məsələ: qonşu bucaqların nisbəti ${k} : ${m}. Kiçik bucağı tap.`;
          st = [`Qonşu bucaqların cəmi 180°-dir.`, `Bir hissə = 180° : ${k + m} = ${u}°.`, `Kiçik bucaq = ${k} · ${u}° = ${k * u}°.`];
          wrong = [`Qonşu bucaqların cəmi 90°-dir.`, `Bir hissə = 180° : ${m} = ${String(Math.round(180 / m * 10) / 10).replace(".", ",")}°.`, `Kiçik bucaq = ${m} · ${u}° = ${m * u}°.`];
          whyS = ["1-ci addımda səhv var: cəmi 90° olan qonşu bucaqlar deyil, qonşu bucaqların cəmi 180°-dir.", `2-ci addımda səhv var: 180° hissələrin ümumi sayına bölünür: 180° : (${k} + ${m}) = ${u}°.`, `3-cü addımda səhv var: kiçik bucaq ${k} hissədir: ${k} · ${u}° = ${k * u}°.`];
        } else if (t === "tenbolen") {
          const al = pick(range(30, 170, 4));
          task = `Məsələ: ∠AOB = ${al}°, OC — tənbölən, OD — OA şüasının uzantısı. ∠COD-ni tap.`;
          st = [`∠AOC = ${al}° : 2 = ${al / 2}°.`, `∠AOC və ∠COD qonşu bucaqlardır.`, `∠COD = 180° − ${al / 2}° = ${180 - al / 2}°.`];
          wrong = [`∠AOC = 2 · ${al}° = ${2 * al}°.`, `∠AOC və ∠COD qarşılıqlı bucaqlardır.`, `∠COD = 180° − ${al}° = ${180 - al}°.`];
          whyS = ["1-ci addımda səhv var: tənbölən bucağı yarıya bölür, ikiqat artırmır.", "2-ci addımda səhv var: ∠AOC və ∠COD ortaq OC tərəfinə malikdir, OA və OD isə bir düz xətt əmələ gətirir — onlar qonşudur.", `3-cü addımda səhv var: çıxılmalı olan ∠AOC = ${al / 2}°-dir, ∠AOB yox.`];
        } else {
          const al = pick(range(20, 75, 5)), be = pick(range(20, 75, 5));
          task = `Məsələ: a ∥ b, M onların arasındadır. AM ilə a arasında ${al}°, BM ilə b arasında ${be}°. ∠AMB-ni tap.`;
          st = [`M-dən a-ya paralel düz xətt çəkirik — o, b-yə də paraleldir.`, `Çarpaz bucaqlara görə ∠AMB-nin hissələri ${al}° və ${be}°-dir.`, `∠AMB = ${al}° + ${be}° = ${al + be}°.`];
          wrong = [`M-dən a-ya perpendikulyar düz xətt çəkirik — o, b-yə paraleldir.`, `Çarpaz bucaqlara görə ∠AMB-nin hissələri ${180 - al}° və ${180 - be}°-dir.`, `∠AMB = 180° − (${al}° + ${be}°) = ${180 - al - be}°.`];
          whyS = ["1-ci addımda səhv var: a-ya perpendikulyar düz xətt b-yə də perpendikulyardır, paralel deyil. Paralel düz xətt çəkmək lazımdır.", `2-ci addımda səhv var: çarpaz bucaqlar bərabərdir — hissələr ${al}° və ${be}°.`, `3-cü addımda səhv var: hissələr toplanır: ${al}° + ${be}° = ${al + be}°.`];
        }
        st[bad] = wrong[bad];
        return { text: steps(task, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: whyS[bad] };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "bucaqlar-paralel", title: "Bucaqlar, paralel və perpendikulyar düz xətlər", fenn: "riyaziyyat", link: "dersler/bucaqlar-paralel.html",
      format: "Cavab — bucağın dərəcə ölçüsü (° yazmaq lazım deyil): 65. x soruşulursa — x-in qiyməti.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["qonsu", "qonsu", "tenbolen", "paralel", "paralel", "tenlik", "tenlik", "cem", "cem", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/bucaqlar-paralel.html")) b.push("dersler/bucaqlar-paralel.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
