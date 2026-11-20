// Trapesiya, orta xətt (üçbucağın və trapesiyanın orta xətti, bərabəryanlı trapesiya, sahə) — mastery game levels and the final test.
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
  // o: { poly:[names], names?:[names to letter], place?:{name:[toward,"in"|"out"]}, segs:[[p,q,"dash"|"acc"|"ink"]], lab:{PQ:text}, right:[[v,p,q]], arcs:[[v,p,q,text]], rot:[quarter turns] }
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
    if (o.circ) g.append(sv("circle", { cx: Q[o.circ[0]][0], cy: Q[o.circ[0]][1], r: o.circ[1] * s, fill: "none", stroke: ACC, "stroke-width": 1.8 }));
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
      const [pq, fr] = key.split("@"), [p, q] = pq.split(""), f = fr == null ? .5 : +fr, m = [Q[p][0] + (Q[q][0] - Q[p][0]) * f, Q[p][1] + (Q[q][1] - Q[p][1]) * f]; // "PQ@.75": label at 75% of the way from P to Q
      const d = [Q[q][0] - Q[p][0], Q[q][1] - Q[p][1]], L = Math.hypot(...d) || 1;
      let n = [-d[1] / L, d[0] / L];
      const out = [m[0] - cen[0], m[1] - cen[1]];
      if (Math.hypot(...out) > 6 ? n[0] * out[0] + n[1] * out[1] < 0 : n[1] > 0) n = [-n[0], -n[1]];
      if ((o.lin || []).includes(key)) n = [-n[0], -n[1]]; // o.lin: this label goes inside (the outside is taken by a point letter)
      g.append(sv("text", { x: m[0] + n[0] * 14, y: m[1] + n[1] * 14 + 5, "text-anchor": "middle", class: "oy-lbl" }, o.lab[key]));
    }
    const unit = v => { const L = Math.hypot(...v) || 1; return [v[0] / L, v[1] / L]; };
    for (const k of o.names || o.poly) {
      let d = [Q[k][0] - cen[0], Q[k][1] - cen[1]], L = Math.hypot(...d);
      if (L < 4) { d = [1, -1]; L = Math.SQRT2; }
      const pl = (o.place || {})[k]; // [toward, "in"|"out"]: letter goes diagonally toward a point, inside or outside the figure
      if (pl) { const t = unit([Q[pl[0]][0] - Q[k][0], Q[pl[0]][1] - Q[k][1]]), r = unit(pl[1] === "in" ? [-d[0], -d[1]] : d); d = pl[1] === "to" ? t : pl[1] === "inw" ? [-d[0], -d[1]] : [t[0] + r[0], t[1] + r[1]]; L = Math.hypot(...d) || 1; }
      g.append(sv("text", { x: Q[k][0] + d[0] / L * 15, y: Q[k][1] + d[1] / L * 15 + 5, "text-anchor": "middle", class: "oy-lbl", style: "fill:#5f5e5a;font-style:italic" }, k));
    }
    return g;
  }
  const ABCD = ["A", "B", "C", "D"];
  // trapezoid: AD = a (lower base), BC = b (upper base), B = (x1, hh)
  const trap = (a, b, x1, hh) => ({ A: [0, 0], B: [x1, hh], C: [x1 + b, hh], D: [a, 0] });
  const ARC = { A: ["A", "D", "B"], B: ["B", "A", "C"], C: ["C", "B", "D"], D: ["D", "C", "A"] };
  const deg = { unit: "°", tol: 0.01 };
  const steps = (task, list) => h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...list.map(s => h("li", {}, s))));
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];
  const TROT = [0, 2];
  // upper base for a drawn trapezoid with projection x: not too short next to x, so the figure stays readable
  const topBase = x => { const lo = Math.max(3, Math.ceil(x * .6)); return rnd(lo, lo + 9); };
  // triangle with AB = c, BC = a, AC = b (AC on the x axis); null if too flat
  function tri(a, b, c) {
    const bx = (c * c - a * a + b * b) / (2 * b), y2 = c * c - bx * bx;
    if (y2 <= 0 || Math.sqrt(y2) < .3 * b) return null;
    const B = [bx, Math.sqrt(y2)];
    return { A: [0, 0], B, C: [b, 0], M: [B[0] / 2, B[1] / 2], N: [(B[0] + b) / 2, B[1] / 2] };
  }
  function randTri() { for (;;) { const a = rnd(5, 20), b = rnd(5, 20), c = rnd(5, 20); if (a + b > c && a + c > b && b + c > a) { const P = tri(a, b, c); if (P) return { a, b, c, P }; } } }
  const ABC = ["A", "B", "C"];

  const levels = [
    { id: "ucbucaq", ad: "Üçbucağın orta xətti", izah: "Orta xətt iki tərəfin orta nöqtələrini birləşdirir, üçüncü tərəfə paraleldir və onun yarısına bərabərdir.",
      gen() {
        const kind = pick(["m", "m", "teref", "P", "BMN", "cem"]), { a, b, c, P } = randTri();
        const fig = lab => figure(P, { poly: ABC, names: ["A", "B", "C", "M", "N"], segs: [["M", "N", "acc"]], lab, aria: "Üçbucaq və orta xətt MN" });
        const intro = `ABC üçbucağında M və N — AB və BC tərəflərinin orta nöqtələridir.`;
        if (kind === "m") return { text: `${intro} AC = ${b}. MN = ?`, svg: fig({ AC: String(b), MN: "?" }), answer: b / 2, show: fmt(b / 2), tol: 0.01,
          solution: `MN — orta xətdir, AC-yə paraleldir və onun yarısına bərabərdir: MN = ${b} : 2 = ${fmt(b / 2)}.` };
        if (kind === "teref") { const m = rnd(3, 16); return { text: `${intro} MN = ${m}. AC = ?`, svg: fig({ MN: String(m), AC: "?" }), answer: 2 * m, show: String(2 * m), tol: 0.01,
          solution: `Orta xətt üçüncü tərəfin yarısıdır, deməli AC = 2 · MN = 2 · ${m} = ${2 * m}.` }; }
        const p = a + b + c;
        if (kind === "P") return { text: `Üçbucağın tərəfləri ${a}, ${b}, ${c}. Onun üç orta xəttinin əmələ gətirdiyi üçbucağın perimetrini tap.`, answer: p / 2, show: fmt(p / 2), tol: 0.01,
          solution: `Hər orta xətt bir tərəfin yarısıdır: ${fmt(a / 2)}, ${fmt(b / 2)}, ${fmt(c / 2)}. Perimetr = ${p} : 2 = ${fmt(p / 2)} — böyük üçbucağın perimetrinin yarısı.` };
        if (kind === "BMN") return { text: `${intro} AB = ${c}, BC = ${a}, AC = ${b}. BMN üçbucağının perimetrini tap.`, svg: fig({ AC: String(b) }), answer: p / 2, show: fmt(p / 2), tol: 0.01,
          solution: `BM = ${c} : 2 = ${fmt(c / 2)}, BN = ${a} : 2 = ${fmt(a / 2)}, MN = ${b} : 2 = ${fmt(b / 2)} (orta xətt). P = ${fmt(p / 2)}.` };
        const m = rnd(3, 15);
        return { text: `Üçbucağın orta xətti ilə ona paralel olan tərəfin cəmi ${3 * m}. Orta xətti tap.`, answer: m, show: String(m), tol: 0.01,
          solution: `Orta xətt x olsa, tərəf 2x-dir: x + 2x = ${3 * m} → x = ${m}.` };
      } },

    { id: "bucaq", ad: "Trapesiyanın bucaqları", izah: "Yan tərəfə bitişik iki bucağın cəmi 180°. Bərabəryanlı trapesiyada oturacaqdakı bucaqlar bərabərdir.",
      gen() {
        const kind = pick(["yan", "yan", "beraber", "beraber", "ferq", "cem", "duz"]);
        const big = Math.random() < .5, W = big ? "böyük" : "kiçik";
        if (kind === "yan") {
          let al, de, x1, x2;
          do { al = pick([...range(40, 85, 5), ...range(95, 120, 5)]); de = pick(range(40, 85, 5)); x1 = 3 / Math.tan(rad(al)); x2 = 3 / Math.tan(rad(de)); } while (10 - x1 - x2 < 2.5);
          const ask = pick(["B", "C"]), ans = ask === "B" ? 180 - al : 180 - de;
          return { text: `ABCD trapesiyasında AD ∥ BC, ∠A = ${al}°, ∠D = ${de}°. ∠${ask} = ?`, svg: figure(trap(10, 10 - x1 - x2, x1, 3), { poly: ABCD, rot: TROT, arcs: [[...ARC.A, al + "°"], [...ARC.D, de + "°"], [...ARC[ask], "?"]] }),
            answer: ans, show: ans + "°", ...deg,
            solution: `∠${ask} ilə ∠${ask === "B" ? "A" : "D"} bir yan tərəfə (${ask === "B" ? "AB" : "CD"}) bitişikdir, AD ∥ BC olduğu üçün cəmi 180°: ∠${ask} = 180° − ${ask === "B" ? al : de}° = ${ans}°.` };
        }
        if (kind === "beraber") {
          const al = pick(range(40, 85, 5)), x = 3 / Math.tan(rad(al)), giveA = Math.random() < .5, g = giveA ? "A" : "B", gv = giveA ? al : 180 - al;
          const ask = pick(["A", "B", "C", "D"].filter(k => k !== g)), ans = ask === "A" || ask === "D" ? al : 180 - al;
          return { text: `ABCD bərabəryanlı trapesiyasında (AD ∥ BC, AB = CD) ∠${g} = ${gv}°. ∠${ask} = ?`, svg: figure(trap(8 + 2 * x, 8, x, 3), { poly: ABCD, rot: TROT, arcs: [[...ARC[g], gv + "°"], [...ARC[ask], "?"]] }),
            answer: ans, show: ans + "°", ...deg,
            solution: `Bərabəryanlı trapesiyada ∠A = ∠D və ∠B = ∠C; yan tərəfə bitişik bucaqların cəmi 180°. ∠A = ∠D = ${al}°, ∠B = ∠C = ${180 - al}°. Deməli ∠${ask} = ${ans}°.` };
        }
        if (kind === "ferq") {
          const d = pick(range(10, 120, 10)), sm = (180 - d) / 2, ans = big ? sm + d : sm;
          return { text: `Bərabəryanlı trapesiyanın iki bucağının fərqi ${d}°-dir. Trapesiyanın ${W} bucağını tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Bərabəryanlı trapesiyanın bucaqları x, x, 180° − x, 180° − x. Fərqli bucaqlardan biri kiçik, biri böyükdür və cəmi 180°: x + (x + ${d}°) = 180° → x = ${sm}°. Bucaqlar ${sm}° və ${sm + d}°.` };
        }
        if (kind === "cem") {
          const x = pick([...range(35, 85, 5), ...range(95, 145, 5)]), ans = big ? Math.max(x, 180 - x) : Math.min(x, 180 - x);
          return { text: `Bərabəryanlı trapesiyanın iki bucağının cəmi ${2 * x}°-dir. Trapesiyanın ${W} bucağını tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Yan tərəfə bitişik bucaqların cəmi 180° olardı, burada ${2 * x}°. Deməli bunlar bərabər bucaqlardır: hər biri ${x}°. O biri bucaqlar 180° − ${x}° = ${180 - x}°. ${big ? "Böyük" : "Kiçik"} bucaq ${ans}°.` };
        }
        const be = pick(range(100, 160, 5)), x = 3 / Math.tan(rad(180 - be));
        return { text: `Düzbucaqlı trapesiyanın ən böyük bucağı ${be}°-dir. Ən kiçik bucağını tap.`, svg: figure(trap(5 + x, 5, 0, 3), { poly: ABCD, rot: TROT, right: [["A", "D", "B"], ["B", "A", "C"]], arcs: [[...ARC.C, be + "°"], [...ARC.D, "?"]] }),
          answer: 180 - be, show: (180 - be) + "°", ...deg,
          solution: `Düzbucaqlı trapesiyada iki bucaq 90°-dir. Qalan ikisi eyni yan tərəfə bitişikdir, cəmi 180°: 180° − ${be}° = ${180 - be}°.` };
      } },

    { id: "orta", ad: "Trapesiyanın orta xətti", izah: "Orta xətt əsaslara paraleldir və onların cəminin yarısına bərabərdir: m = (a + b) / 2.",
      gen() {
        const kind = pick(["m", "m", "esas", "nisbet", "ferq", "diag", "P", "cevre"]);
        let a = rnd(8, 30), b = rnd(3, a - 3);
        const fig = (lab, extra = {}) => { const x1 = (a - b) * (rnd(20, 80) / 100), P = trap(a, b, x1, Math.max(4, (a + b) / 4)); P.M = [P.B[0] / 2, P.B[1] / 2]; P.N = [(P.C[0] + a) / 2, P.C[1] / 2];
          return figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "M", "N"], rot: TROT, segs: [["M", "N", "acc"], ...(extra.segs || [])], lab }); };
        if (kind === "m") { const m = (a + b) / 2; return { text: `Trapesiyanın əsasları ${a} və ${b}. Orta xəttini tap.`, svg: fig({ AD: String(a), BC: String(b), MN: "?" }), answer: m, show: fmt(m), tol: 0.01,
          solution: `m = (a + b) / 2 = (${a} + ${b}) / 2 = ${fmt(m)}.` }; }
        if (kind === "esas") { if ((a + b) % 2) b--; const m = (a + b) / 2;
          return { text: `Trapesiyanın orta xətti ${m}, böyük əsası ${a}. Kiçik əsası tap.`, svg: fig({ AD: String(a), MN: String(m), BC: "?" }), answer: b, show: String(b), tol: 0.01,
            solution: `a + b = 2m = ${2 * m}, b = ${2 * m} − ${a} = ${b}.` }; }
        if (kind === "nisbet") {
          const [k, l] = pick([[1, 2], [1, 3], [2, 3], [3, 5], [2, 5], [3, 4], [4, 7]]); let u = rnd(2, 6); if (((k + l) * u) % 2) u++;
          const m = (k + l) * u / 2, wantBig = Math.random() < .5;
          return { text: `Trapesiyanın əsasları ${k} : ${l} nisbətindədir, orta xətti ${m}. ${wantBig ? "Böyük" : "Kiçik"} əsası tap.`, answer: wantBig ? l * u : k * u, show: String(wantBig ? l * u : k * u), tol: 0.01,
            solution: `Əsasların cəmi 2m = ${2 * m}. Bir hissə = ${2 * m} : ${k + l} = ${u}. Əsaslar ${k * u} və ${l * u}.` };
        }
        if (kind === "ferq") { if ((a - b) % 2) b--; const d = a - b, m = (a + b) / 2;
          return { text: `Trapesiyanın orta xətti ${m}, əsaslarının fərqi ${d}. Böyük əsası tap.`, answer: a, show: String(a), tol: 0.01,
            solution: `a + b = ${2 * m}, a − b = ${d}. Toplasaq: 2a = ${2 * m + d}, a = ${a}.` }; }
        if (kind === "diag") {
          a = 2 * rnd(5, 15); b = 2 * rnd(2, a / 2 - 2);
          const wantBig = Math.random() < .5, ans = wantBig ? a / 2 : b / 2;
          return { text: `ABCD trapesiyasının əsasları AD = ${a}, BC = ${b}. AC diaqonalı orta xətti iki parçaya bölür. ${wantBig ? "Böyük" : "Kiçik"} parçanın uzunluğunu tap.`, svg: fig({ AD: String(a), BC: String(b) }, { segs: [["A", "C", "dash"]] }),
            answer: ans, show: String(ans), tol: 0.01,
            solution: `AC trapesiyanı ABC və ACD üçbucaqlarına bölür. Orta xəttin parçaları bu üçbucaqların orta xətləridir: BC/2 = ${b / 2} və AD/2 = ${a / 2}. ${wantBig ? "Böyük" : "Kiçik"} parça ${ans}.` };
        }
        if (kind === "P") { const m = rnd(5, 20), c = rnd(4, 15), P = 2 * m + 2 * c;
          return { text: `Bərabəryanlı trapesiyanın orta xətti ${m}, yan tərəfi ${c}. Perimetrini tap.`, answer: P, show: String(P), tol: 0.01,
            solution: `Əsasların cəmi a + b = 2m = ${2 * m}. P = (a + b) + 2c = ${2 * m} + ${2 * c} = ${P}.` }; }
        const c = rnd(4, 20), givP = Math.random() < .5;
        return { text: givP ? `Bərabəryanlı trapesiyanın daxilinə çevrə çəkilib, perimetri ${4 * c}. Orta xəttini tap.` : `Bərabəryanlı trapesiyanın daxilinə çevrə çəkilib, yan tərəfi ${c}. Orta xəttini tap.`, answer: c, show: String(c), tol: 0.01,
          solution: `Daxilinə çevrə çəkilmiş dördbucaqlıda qarşı tərəflərin cəmləri bərabərdir: a + b = 2c` + (givP ? `, deməli P = 4c, c = ${4 * c} : 4 = ${c}.` : ".") + ` m = (a + b) / 2 = c = ${c}.` };
      } },

    { id: "proyeksiya", ad: "Bərabəryanlı: hündürlük", izah: "Hündürlük böyük əsasdan (a − b)/2 parça ayırır — yan tərəfin proyeksiyası. Sonra Pifaqor.",
      gen() {
        const kind = pick(["h", "h", "c", "proj", "a", "b45", "b60"]);
        if (kind === "b45" || kind === "b60") {
          const x = rnd(2, 9), b = topBase(x), a = b + 2 * x, is45 = kind === "b45", hh = is45 ? x : x * Math.sqrt(3);
          const svg = figure({ ...trap(a, b, x, hh), H: [x, 0] }, { poly: ABCD, names: ["A", "B", "C", "D", "H"], place: { H: ["A", "out"] }, rot: TROT, segs: [["B", "H", "dash"]], right: [["H", "D", "B"]], arcs: [[...ARC.A, (is45 ? 45 : 60) + "°"]], lab: { AD: String(a), BC: String(b) } });
          if (is45) return { text: `ABCD bərabəryanlı trapesiyasında AD = ${a}, BC = ${b}, ∠A = 45°. Hündürlüyü tap.`, svg, answer: x, show: String(x), tol: 0.01,
            solution: `AH = (${a} − ${b}) / 2 = ${x}. ABH düzbucaqlı üçbucağında ∠A = 45°, deməli ∠ABH = 45° və BH = AH = ${x}.` };
          return { text: `ABCD bərabəryanlı trapesiyasında AD = ${a}, BC = ${b}, ∠A = 60°. Yan tərəfi tap.`, svg, answer: 2 * x, show: String(2 * x), tol: 0.01,
            solution: `AH = (${a} − ${b}) / 2 = ${x}. ABH-da ∠ABH = 30°, 30°-li bucaq qarşısındakı katet hipotenuzun yarısıdır: AB = 2 · AH = ${2 * x}.` };
        }
        const [x, hh, c] = triple(30), b = topBase(x), a = b + 2 * x;
        const fig = lab => figure({ ...trap(a, b, x, hh), H: [x, 0] }, { poly: ABCD, names: ["A", "B", "C", "D", "H"], place: { H: ["A", "out"] }, rot: TROT, segs: [["B", "H", "dash"]], right: [["H", "D", "B"]], lab });
        const intro = `ABCD bərabəryanlı trapesiyasında AD ∥ BC, BH — hündürlük.`;
        if (kind === "h") return { text: `${intro} AD = ${a}, BC = ${b}, AB = ${c}. BH = ?`, svg: fig({ AD: String(a), BC: String(b), AB: String(c), BH: "?" }), answer: hh, show: String(hh), tol: 0.01,
          solution: `AH = (AD − BC) / 2 = (${a} − ${b}) / 2 = ${x}. ABH düzbucaqlıdır: BH = √(${c}² − ${x}²) = √${hh * hh} = ${hh}.` };
        if (kind === "c") return { text: `${intro} AD = ${a}, BC = ${b}, BH = ${hh}. Yan tərəf AB = ?`, svg: fig({ AD: String(a), BC: String(b), BH: String(hh), AB: "?" }), answer: c, show: String(c), tol: 0.01,
          solution: `AH = (${a} − ${b}) / 2 = ${x}. AB = √(${x}² + ${hh}²) = √${c * c} = ${c}.` };
        if (kind === "proj") { const big = Math.random() < .5, ans = big ? (a + b) / 2 : x;
          return { text: `${intro} AD = ${a}, BC = ${b}. ${big ? "HD" : "AH"} = ?`, svg: fig({ AD: String(a), BC: String(b) }), answer: ans, show: String(ans), tol: 0.01,
            solution: `AH = (AD − BC) / 2 = (${a} − ${b}) / 2 = ${x}.` + (big ? ` HD = AD − AH = ${a} − ${x} = ${ans} (bu, (a + b) / 2 — orta xəttə bərabərdir).` : "") }; }
        return { text: `${intro} BC = ${b}, AB = ${c}, BH = ${hh}. Böyük əsas AD = ?`, svg: fig({ BC: String(b), AB: String(c), BH: String(hh), AD: "?" }), answer: a, show: String(a), tol: 0.01,
          solution: `AH = √(${c}² − ${hh}²) = ${x}. O biri tərəfdə də eyni parça var: AD = ${b} + 2 · ${x} = ${a}.` };
      } },

    { id: "sahe", ad: "Trapesiyanın sahəsi", izah: "S = (a + b) / 2 · h = m · h. Hündürlük yoxdursa, əvvəl onu tap.",
      gen() {
        const kind = pick(["abh", "abh", "mh", "beraber", "beraber", "geri", "duz", "b45"]);
        if (kind === "abh" || kind === "geri") {
          const a = rnd(6, 24), b = rnd(2, a - 2); let hh = rnd(2, 12); if (((a + b) * hh) % 2) hh++;
          const S = (a + b) * hh / 2, x1 = (a - b) * rnd(15, 38) / 100;
          const P = { ...trap(a, b, x1, Math.max(hh, (a + b) / 5)), H: [x1, 0] };
          const o = { poly: ABCD, names: ["A", "B", "C", "D", "H"], place: { H: ["A", "out"] }, rot: TROT, segs: [["B", "H", "dash"]], right: [["H", "D", "B"]] };
          if (kind === "abh") return { text: `Trapesiyanın əsasları ${a} və ${b}, hündürlüyü ${hh}. Sahəsini tap.`, svg: figure(P, { ...o, lab: { AD: String(a), BC: String(b), BH: String(hh) } }), answer: S, show: String(S), tol: 0.01,
            solution: `S = (a + b) / 2 · h = (${a} + ${b}) / 2 · ${hh} = ${fmt((a + b) / 2)} · ${hh} = ${S}.` };
          return { text: `Trapesiyanın sahəsi ${S}, hündürlüyü ${hh}, kiçik əsası ${b}. Böyük əsası tap.`, svg: figure(P, { ...o, lab: { BC: String(b), BH: String(hh), AD: "?" } }), answer: a, show: String(a), tol: 0.01,
            solution: `(a + b) / 2 = S : h = ${S} : ${hh} = ${fmt((a + b) / 2)}, a + b = ${a + b}, a = ${a + b} − ${b} = ${a}.` };
        }
        if (kind === "mh") { const m = rnd(4, 20), hh = rnd(2, 12);
          return { text: `Trapesiyanın orta xətti ${m}, hündürlüyü ${hh}. Sahəsini tap.`, answer: m * hh, show: String(m * hh), tol: 0.01, solution: `S = m · h = ${m} · ${hh} = ${m * hh}.` }; }
        if (kind === "beraber") {
          const [x, hh, c] = triple(26), b = topBase(x), a = b + 2 * x, S = (a + b) * hh / 2;
          return { text: `Bərabəryanlı trapesiyanın əsasları ${a} və ${b}, yan tərəfi ${c}. Sahəsini tap.`,
            svg: figure({ ...trap(a, b, x, hh), H: [x, 0] }, { poly: ABCD, names: ["A", "B", "C", "D", "H"], place: { H: ["A", "out"] }, rot: TROT, segs: [["B", "H", "dash"]], right: [["H", "D", "B"]], lab: { AD: String(a), BC: String(b), AB: String(c) } }),
            answer: S, show: String(S), tol: 0.01,
            solution: `AH = (${a} − ${b}) / 2 = ${x}. h = √(${c}² − ${x}²) = ${hh}. S = (${a} + ${b}) / 2 · ${hh} = ${(a + b) / 2} · ${hh} = ${S}.` };
        }
        if (kind === "duz") {
          const [x, hh, c] = triple(26), b = topBase(x), a = b + x, S = (a + b) * hh / 2;
          return { text: `Düzbucaqlı trapesiyanın əsasları ${a} və ${b}, maili yan tərəfi ${c}. Sahəsini tap.`,
            svg: figure({ ...trap(a, b, 0, hh), H: [b, 0] }, { poly: ABCD, names: ["A", "B", "C", "D", "H"], place: { H: [b > a / 2 ? "D" : "A", "out"] }, rot: TROT, segs: [["C", "H", "dash"]], right: [["A", "D", "B"], ["B", "A", "C"], ["H", "D", "C"]], lab: { AD: String(a), BC: String(b), CD: String(c) } }),
            answer: S, show: fmt(S), tol: 0.01,
            solution: `C-dən CH hündürlüyü endir: HD = ${a} − ${b} = ${x}. h = CH = √(${c}² − ${x}²) = ${hh}. S = (${a} + ${b}) / 2 · ${hh} = ${fmt(S)}.` };
        }
        const x = rnd(2, 8), b = topBase(x), a = b + 2 * x, S = (a + b) / 2 * x;
        return { text: `Bərabəryanlı trapesiyanın əsasları ${a} və ${b}, iti bucağı 45°. Sahəsini tap.`,
          svg: figure({ ...trap(a, b, x, x), H: [x, 0] }, { poly: ABCD, names: ["A", "B", "C", "D", "H"], place: { H: ["A", "out"] }, rot: TROT, segs: [["B", "H", "dash"]], right: [["H", "D", "B"]], arcs: [[...ARC.A, "45°"]], lab: { AD: String(a), BC: String(b) } }),
          answer: S, show: String(S), tol: 0.01,
          solution: `AH = (${a} − ${b}) / 2 = ${x}. ∠A = 45° olduğu üçün ABH bərabəryanlıdır: h = AH = ${x}. S = (${a} + ${b}) / 2 · ${x} = ${(a + b) / 2} · ${x} = ${S}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Mətnli məsələ: trapesiyanı və ya orta xətti tanı, sonra düsturu seç.",
      gen() {
        const t = pick(["bag", "kanal", "nerdivan", "gol", "dam", "divar"]);
        if (t === "bag") {
          const a = rnd(20, 60), b = rnd(10, a - 4); let hh = rnd(8, 30); if (((a + b) * hh) % 2) hh++;
          const S = (a + b) * hh / 2;
          return { text: `Bağ sahəsi trapesiya şəklindədir: paralel tərəfləri ${a} m və ${b} m, onların arasındakı məsafə ${hh} m. Bağın sahəsi neçə m²-dir?`, answer: S, show: S + " m²", unit: "m²", tol: 0.01,
            solution: `Paralel tərəflər — əsaslar, aralarındakı məsafə — hündürlük. S = (${a} + ${b}) / 2 · ${hh} = ${S} m².` };
        }
        if (t === "kanal") {
          const [x, hh, c] = triple(17), b = rnd(2, 8), a = b + 2 * x;
          return { text: `Kanalın en kəsiyi bərabəryanlı trapesiyadır: yuxarıda eni ${a} m, dibinin eni ${b} m, maili divarının uzunluğu ${c} m. Kanalın dərinliyi neçə metrdir?`, answer: hh, show: hh + " m", unit: "m", tol: 0.01,
            solution: `Divarın proyeksiyası (${a} − ${b}) / 2 = ${x} m. Dərinlik = √(${c}² − ${x}²) = ${hh} m.` };
        }
        if (t === "nerdivan") {
          const a = rnd(40, 70); let b = rnd(24, a - 8); if ((a + b) % 2) b++;
          return { text: `Nərdivanın 3 pilləsi var, pillələr bərabər aralıqla düzülüb, yan çubuqlar düzdür. Ən aşağı pillə ${a} sm, ən yuxarı pillə ${b} sm. Ortadakı pillənin uzunluğu neçə sm-dir?`, answer: (a + b) / 2, show: (a + b) / 2 + " sm", unit: "sm", tol: 0.01,
            solution: `Yan çubuqlar və ən aşağı, ən yuxarı pillələr trapesiya yaradır, ortadakı pillə — onun orta xəttidir: (${a} + ${b}) / 2 = ${(a + b) / 2} sm.` };
        }
        if (t === "gol") {
          const m = rnd(15, 90);
          return { text: `Göl A və B nöqtələri arasındadır, AB-ni birbaşa ölçmək olmur. Sahildə C nöqtəsi seçilib, AC və BC-nin orta nöqtələri M və N işarələnib. MN = ${m} m. AB neçə metrdir?`, answer: 2 * m, show: 2 * m + " m", unit: "m", tol: 0.01,
            solution: `MN — ABC üçbucağının orta xəttidir: AB = 2 · MN = 2 · ${m} = ${2 * m} m.` };
        }
        if (t === "dam") {
          const [x, hh, c] = pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13]]), b = rnd(2, 10), a = b + 2 * x, S = (a + b) * hh / 2;
          return { text: `Evin damının bir üzü bərabəryanlı trapesiyadır: aşağı kənarı ${a} m, yuxarı kənarı ${b} m, maili kənarları ${c} m. Bu üzün sahəsi neçə m²-dir?`, answer: S, show: S + " m²", unit: "m²", tol: 0.01,
            solution: `Proyeksiya (${a} − ${b}) / 2 = ${x} m, hündürlük √(${c}² − ${x}²) = ${hh} m. S = (${a} + ${b}) / 2 · ${hh} = ${S} m².` };
        }
        let a, b, hh, S; do { a = rnd(6, 14); b = rnd(2, a - 2); hh = rnd(2, 5); S = (a + b) * hh / 2; } while (S % 1);
        const pr = pick([3, 4, 5, 6]);
        return { text: `Divar trapesiya şəklindədir: aşağı kənarı ${a} m, yuxarı kənarı ${b} m, hündürlüyü ${hh} m. 1 m² rəngləmək ${pr} manatdır. Divarı rəngləmək neçə manata başa gələr?`, answer: S * pr, show: String(S * pr), unit: "manat", tol: 0.01,
          solution: `S = (${a} + ${b}) / 2 · ${hh} = ${S} m². Qiymət = ${S} · ${pr} = ${S * pr} manat.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const t = pick(["proj", "proj", "sahe", "ucbucaq", "bucaq"]), bad = rnd(0, 2);
        let task, st, wrong, why;
        if (t === "proj") {
          const [x, hh, c] = triple(26), b = rnd(2, 12), a = b + 2 * x;
          task = `Məsələ: bərabəryanlı trapesiyanın əsasları ${a} və ${b}, yan tərəfi ${c}. Hündürlüyü tap.`;
          st = [`Yan tərəfin proyeksiyası: (${a} − ${b}) / 2 = ${x}.`, `Düzbucaqlı üçbucaqda: h² = ${c}² − ${x}².`, `h = √(${c * c} − ${x * x}) = √${hh * hh} = ${hh}.`];
          wrong = [`Yan tərəfin proyeksiyası: ${a} − ${b} = ${a - b}.`, `Düzbucaqlı üçbucaqda: h² = ${c}² + ${x}².`, `h = ${c} − ${x} = ${c - x}.`];
          why = [`1-ci addımda səhv var: fərq iki yan tərəfə bərabər paylanır, proyeksiya (${a} − ${b}) / 2 = ${x}.`, "2-ci addımda səhv var: yan tərəf hipotenuzdur, katet tapılanda kvadratlar çıxılır.", `3-cü addımda səhv var: kökün altındakı fərq tərəflərin fərqi deyil: √(${c * c} − ${x * x}) = ${hh}.`][bad];
        } else if (t === "sahe") {
          const a = rnd(6, 24), hh = rnd(2, 10); let b = rnd(2, a - 2); if ((a + b) % 2) b = b > 2 ? b - 1 : b + 1;
          const m = (a + b) / 2;
          task = `Məsələ: trapesiyanın əsasları ${a} və ${b}, hündürlüyü ${hh}. Sahəsini tap.`;
          st = [`Orta xətt: m = (${a} + ${b}) / 2 = ${m}.`, `S = m · h.`, `S = ${m} · ${hh} = ${m * hh}.`];
          wrong = [`Orta xətt: m = (${a} − ${b}) / 2 = ${(a - b) / 2}.`, `S = m · h / 2.`, `S = ${m} · ${hh} = ${m * hh + hh}.`];
          why = ["1-ci addımda səhv var: orta xətt əsasların cəminin yarısıdır, fərqinin yox.", "2-ci addımda səhv var: trapesiyada S = m · h, əlavə 2-yə bölmək lazım deyil (o, artıq m-in içindədir).", `3-cü addımda hesab səhvdir: ${m} · ${hh} = ${m * hh}.`][bad];
        } else if (t === "ucbucaq") {
          const { a, b, c } = randTri(), p = a + b + c;
          task = `Məsələ: üçbucağın tərəfləri ${a}, ${b}, ${c}. Orta xətlərinin əmələ gətirdiyi üçbucağın perimetrini tap.`;
          st = [`Hər orta xətt ona paralel olan tərəfin yarısıdır.`, `Orta xətlər: ${fmt(a / 2)}, ${fmt(b / 2)}, ${fmt(c / 2)}.`, `P = ${fmt(a / 2)} + ${fmt(b / 2)} + ${fmt(c / 2)} = ${fmt(p / 2)}.`];
          wrong = [`Hər orta xətt ona paralel olan tərəfə bərabərdir.`, `Orta xətlər: ${fmt(a / 2)}, ${fmt(b / 2)}, ${c * 2}.`, `P = ${fmt(a / 2)} + ${fmt(b / 2)} + ${fmt(c / 2)} = ${p}.`];
          why = ["1-ci addımda səhv var: orta xətt tərəfin yarısıdır.", `2-ci addımda səhv var: ${c} tərəfinə paralel orta xətt ${fmt(c / 2)}-dir, ${c * 2} yox.`, `3-cü addımda hesab səhvdir: cəm ${fmt(p / 2)}-dir.`][bad];
        } else {
          const al = pick(range(40, 85, 5));
          task = `Məsələ: ABCD bərabəryanlı trapesiyasında (AD ∥ BC) ∠A = ${al}°. ∠C-ni tap.`;
          st = [`Bərabəryanlı trapesiyada ∠D = ∠A = ${al}°.`, `∠C və ∠D CD yan tərəfinə bitişikdir: ∠C + ∠D = 180°.`, `∠C = 180° − ${al}° = ${180 - al}°.`];
          wrong = [`Bərabəryanlı trapesiyada ∠D = 180° − ∠A = ${180 - al}°.`, `∠C və ∠D CD yan tərəfinə bitişikdir: ∠C + ∠D = 90°.`, `∠C = 180° − ${al}° = ${190 - al}°.`];
          why = ["1-ci addımda səhv var: bərabəryanlı trapesiyada böyük əsasdakı bucaqlar bərabərdir: ∠D = ∠A.", "2-ci addımda səhv var: yan tərəfə bitişik bucaqların cəmi 180°-dir.", `3-cü addımda hesab səhvdir: 180 − ${al} = ${180 - al}.`][bad];
        }
        st[bad] = wrong[bad];
        return { text: steps(task, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
      } },
  ];

  // ---- exam format (DİM buraxılış): 6 closed (A–E) + 3 coded + 1 written. Wrong options are typical mistakes.
  const { ae, again } = Oyun;
  const degf = x => Oyun.num(x) + "°";
  // a = p²t, b = q²t: the isosceles trapezoid with an incircle has h = √(ab) = pqt (whole), lateral side (a + b) / 2 (whole)
  const INSC = []; for (let p = 2; p <= 12; p++) for (let q = 1; q < p; q++) for (let t = 1; t <= 20; t++) { const a = p * p * t, b = q * q * t; if ((a + b) % 2 === 0 && b >= 3 && a <= 96 && a / b <= 9 && (a + b) / 2 * p * q * t <= 2500) INSC.push([p, q, t]); }
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. closed: the midline cut by a diagonal
    { tip: "qapali", gen: () => again(() => {
      const a = 2 * rnd(6, 16), b = 2 * rnd(Math.ceil(a * .17), a / 2 - 3), ask = pick(["KN", "MK"]);
      const x1 = (a - b) * rnd(25, 75) / 100, hh = Math.max(5, (a + b) / 4);
      const P = { ...trap(a, b, x1, hh), M: [x1 / 2, hh / 2], N: [(x1 + b + a) / 2, hh / 2], K: [(x1 + b) / 2, hh / 2] };
      const R = ask === "KN" ? a / 2 : b / 2, W = ask === "KN" ? [b / 2, (a + b) / 2, (a - b) / 2, a] : [a / 2, (a + b) / 2, (a - b) / 2, b];
      const o = ae(R, W); if (!o) return null;
      return { text: `ABCD trapesiyasında AD ∥ BC, AD = ${a}, BC = ${b}. M və N — AB və CD yan tərəflərinin orta nöqtələridir. MN orta xətti AC diaqonalını K nöqtəsində kəsir. ${ask} = ?`,
        svg: figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "M", "N", "K"], place: { K: ["B", "to"] }, rot: TROT, segs: [["M", "N", "acc"], ["A", "C", "dash"]], lab: { AD: String(a), BC: String(b) }, aria: "Trapesiya, orta xətt MN və AC diaqonalı" }),
        ...o, show: o.choices[o.correct],
        solution: `Orta xətt AC diaqonalını yarıya bölür: K — AC-nin orta nöqtəsidir. ${ask === "KN" ? `KN — ACD üçbucağının orta xəttidir (AD-yə paraleldir): KN = AD : 2 = ${a} : 2 = ${R}.` : `MK — ABC üçbucağının orta xəttidir (BC-yə paraleldir): MK = BC : 2 = ${b} : 2 = ${R}.`} Tələlər: ${(a + b) / 2} — bütün orta xəttdir (MK + KN); ${(a - b) / 2} — əsasların fərqinin yarısıdır; ${ask === "KN" ? b / 2 : a / 2} — o biri parçadır; ${ask === "KN" ? a : b} — yarıya bölməyi unutmaq.` };
    }) },
    // 2. closed: isosceles trapezoid, the diagonal bisects the angle A → AB = BC
    { tip: "qapali", gen: () => again(() => {
      const b = rnd(6, 14), a = rnd(b + 3, Math.floor(2.7 * b)), x1 = (a - b) / 2, hh = Math.sqrt(b * b - x1 * x1);
      const P = { A: [0, 0], B: [x1, hh], C: [x1 + b, hh], D: [a, 0] };
      const o = ae(a + 3 * b, [a + 2 * b, 3 * a + b, 2 * a + 2 * b, 4 * b]); if (!o) return null;
      return { text: `ABCD bərabəryanlı trapesiyasında (AD ∥ BC, AB = CD) AC diaqonalı ∠A-nın tənbölənidir. AD = ${a}, BC = ${b}. Trapesiyanın perimetrini tap.`,
        svg: figure(P, { poly: ABCD, rot: TROT, segs: [["A", "C", "acc"]], arcs: [["A", "D", "C", "", 20], ["A", "C", "B", "", 28]], lab: { AD: String(a), BC: String(b) }, aria: "Bərabəryanlı trapesiya, AC ∠A-nın tənbölənidir" }),
        ...o, show: o.choices[o.correct],
        solution: `AC tənbölən olduğu üçün ∠BAC = ∠CAD. BC ∥ AD olduğundan ∠BCA = ∠CAD (çarpaz bucaqlar). Deməli ∠BAC = ∠BCA, ABC bərabəryanlıdır: AB = BC = ${b}, CD = AB = ${b}. P = ${a} + ${b} + 2 · ${b} = ${a + 3 * b}. Tələlər: ${a + 2 * b} — yan tərəflərdən birini unutmaq; ${3 * a + b} — yan tərəfi AD-yə bərabər saymaq; ${2 * a + 2 * b} — yan tərəfi orta xətt (${fmt((a + b) / 2)}) saymaq; ${4 * b} — AD = BC saymaq.` };
    }) },
    // 3. closed: a circle inscribed in a trapezoid, AD = AB + CD − BC
    { tip: "qapali", gen: () => again(() => {
      const b = rnd(4, 10), c = rnd(b + 2, 14), d = rnd(b + 2, 14), a = c + d - b, e = a - b;
      const x1 = (e * e + c * c - d * d) / (2 * e), hh = Math.sqrt(c * c - x1 * x1); if (!(hh >= 4)) return null;
      const P = { A: [0, 0], B: [x1, hh], C: [x1 + b, hh], D: [a, 0], O: [(c + x1) / 2, hh / 2] };
      const o = ae(a, [c + d, c + d + b, (c + d) / 2, Math.abs(c - d) + b]); if (!o) return null;
      return { text: `ABCD trapesiyasının (AD ∥ BC) daxilinə çevrə çəkilib. AB = ${c}, BC = ${b}, CD = ${d}. AD = ?`,
        svg: figure(P, { poly: ABCD, names: ABCD, rot: TROT, circ: ["O", hh / 2], lab: { AB: String(c), BC: String(b), CD: String(d), AD: "?" }, aria: "Daxilinə çevrə çəkilmiş trapesiya" }),
        ...o, show: o.choices[o.correct],
        solution: `Daxilinə çevrə çəkilmiş dördbucaqlıda qarşı tərəflərin cəmləri bərabərdir: AD + BC = AB + CD. AD = ${c} + ${d} − ${b} = ${a}. Tələlər: ${c + d} — BC-ni çıxmağı unutmaq; ${c + d + b} — BC-ni çıxmaq əvəzinə əlavə etmək; ${fmt((c + d) / 2)} — yan tərəflərin cəminin yarısını götürmək; ${Math.abs(c - d) + b} — fərqlə qarışdırmaq.` };
    }) },
    // 4. closed: the sides are extended to meet at O
    { tip: "qapali", gen: () => again(() => {
      const al = pick(range(50, 80, 5)), de = pick(range(50, 80, 5)); if (al === de || al + de > 150) return null;
      const ans = 180 - al - de, ta = Math.tan(rad(al)), td = Math.tan(rad(de)), a = 10, ox = a * td / (ta + td), oy = ox * ta, t = pick([.55, .6, .65]);
      const P = { A: [0, 0], D: [a, 0], O: [ox, oy], B: [ox * t, oy * t], C: [a + (ox - a) * t, oy * t] };
      const o = ae(ans, [al + de, 180 - al, 180 - de, Math.abs(al - de)], degf); if (!o) return null;
      return { text: `ABCD trapesiyasında AD ∥ BC, ∠A = ${al}°, ∠D = ${de}°. AB və DC yan tərəflərinin davamları O nöqtəsində kəsişir. ∠AOD = ?`,
        svg: figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "O"], rot: TROT, segs: [["B", "O", "dash"], ["C", "O", "dash"]], arcs: [[...ARC.A, al + "°"], [...ARC.D, de + "°"], ["O", "A", "D", "?", 16]], aria: "Yan tərəflərin davamları O nöqtəsində kəsişir" }),
        ...o, show: o.choices[o.correct],
        solution: `B nöqtəsi AO üzərindədir, C nöqtəsi DO üzərindədir, ona görə AOD üçbucağının A və D bucaqları ${al}° və ${de}°-dir. ∠O = 180° − ${al}° − ${de}° = ${ans}°. Tələlər: ${al + de}° — iki bucağın cəmi; ${180 - al}° və ${180 - de}° — trapesiyanın B və C bucaqlarıdır; ${Math.abs(al - de)}° — fərq.` };
    }) },
    // 5. closed: isosceles trapezoid with perpendicular diagonals: h = m, S = m²
    { tip: "qapali", gen: () => again(() => {
      const m = 2 * rnd(3, 12), b = m * rnd(30, 70) / 100, a = 2 * m - b, x1 = (a - b) / 2;
      const P = { A: [0, 0], B: [x1, m], C: [x1 + b, m], D: [a, 0], O: [a / 2, a / 2], M: [x1 / 2, m / 2], N: [(x1 + b + a) / 2, m / 2] };
      const o = ae(m * m, [m * m / 2, 2 * m * m, 2 * m, m * m / 4]); if (!o) return null;
      return { text: `Bərabəryanlı trapesiyanın diaqonalları qarşılıqlı perpendikulyardır, orta xətti ${m}. Trapesiyanın sahəsini tap.`,
        svg: figure(P, { poly: ABCD, names: ABCD, rot: TROT, segs: [["A", "C", "dash"], ["B", "D", "dash"], ["M", "N", "acc"]], right: [["O", "B", "C"]], aria: "Bərabəryanlı trapesiya, diaqonallar perpendikulyardır" }),
        ...o, show: o.choices[o.correct],
        solution: `Bərabəryanlı trapesiyanın diaqonalları bərabərdir və perpendikulyardır, ona görə (O — diaqonalların kəsişmə nöqtəsi) AOD düzbucaqlı bərabəryanlı üçbucaqdır və ∠CAD = 45°. C-dən AD-yə CK hündürlüyü endir. Bərabəryanlı trapesiyada AK = AD − DK = a − (a − b) / 2 = (a + b) / 2 = ${m} (orta xətt). ∠CAK = 45° olduğundan h = CK = AK = ${m}. S = m · h = ${m} · ${m} = ${m * m}. Tələlər: ${m * m / 2} — əlavə 2-yə bölmək (m · h / 2); ${2 * m * m} — (a + b) · h; ${2 * m} — orta xətti 2-yə vurmaq; ${m * m / 4} — (m / 2)².` };
    }) },
    // 6. closed: the segment joining the midpoints of the diagonals
    { tip: "qapali", gen: () => again(() => {
      const a = 2 * rnd(5, 15), b = 2 * rnd(Math.ceil(a * .13), Math.floor(a * .3)), x1 = (a - b) * rnd(25, 75) / 100, hh = Math.max(5, (a + b) / 4);
      const P = { ...trap(a, b, x1, hh), K: [(x1 + b) / 2, hh / 2], L: [(x1 + a) / 2, hh / 2] };
      const R = (a - b) / 2, o = ae(R, [(a + b) / 2, a - b, a / 2, b / 2]); if (!o) return null;
      return { text: `ABCD trapesiyasında AD ∥ BC, AD = ${a}, BC = ${b}. AC və BD diaqonallarının orta nöqtələri K və L-dir. KL = ?`,
        svg: figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "K", "L"], rot: TROT, segs: [["A", "C", "dash"], ["B", "D", "dash"], ["K", "L", "acc"]], lab: { AD: String(a), BC: String(b) }, aria: "Trapesiya, diaqonalların orta nöqtələri K və L" }),
        ...o, show: o.choices[o.correct],
        solution: `K və L orta xəttin üzərindədir. M — AB-nin orta nöqtəsi olsun. ABD üçbucağında ML = AD : 2 = ${a / 2}, ABC üçbucağında MK = BC : 2 = ${b / 2}. KL = ML − MK = ${a / 2} − ${b / 2} = ${R}. Tələlər: ${(a + b) / 2} — bütün orta xəttdir; ${a - b} — əsasların fərqini yarıya bölməyi unutmaq; ${a / 2} və ${b / 2} — orta xəttin parçalarıdır.` };
    }) },
    // 7. coded: diagonal of an isosceles trapezoid
    { tip: "kod", gen: () => again(() => {
      const [m, hh, d] = triple(26), b = rnd(2, m - 1), a = 2 * m - b, x1 = m - b;
      if (hh < 4 || b < .46 * m || b > .6 * m || a < .6 * hh) return null;
      const P = { A: [0, 0], B: [x1, hh], C: [x1 + b, hh], D: [a, 0], K: [x1 + b, 0] };
      return { text: `ABCD bərabəryanlı trapesiyasının əsasları AD = ${a} sm və BC = ${b} sm, hündürlüyü ${hh} sm-dir. AC diaqonalının uzunluğunu (sm ilə) tap.`,
        svg: figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "K"], place: { K: ["D", "out"] }, rot: TROT, segs: [["C", "K", "dash"], ["A", "C", "acc"]], right: [["K", "D", "C"]], lab: { "AD@.3": String(a), BC: String(b), CK: String(hh) }, aria: "Bərabəryanlı trapesiya, AC diaqonalı və CK hündürlüyü" }),
        answer: d, show: String(d), tol: 1e-6, unit: "sm",
        solution: `C-dən CK hündürlüyü endir. AK = (${a} − ${b}) / 2 + ${b} = (${a} + ${b}) / 2 = ${m}. ACK düzbucaqlıdır: AC = √(${m}² + ${hh}²) = √${d * d} = ${d} sm.` };
    }) },
    // 8. coded: a triangle's midline makes a trapezoid; its perimeter
    { tip: "kod", gen: () => again(() => {
      const { a, b, c } = randTri(); if ((a + b + c) % 2 || Math.min(a, b, c) < 8) return null;
      const T = tri(a, b, c); if (!T) return null;
      const P = { A: T.A, B: T.B, C: T.C, M: T.M, N: [(T.A[0] + T.C[0]) / 2, (T.A[1] + T.C[1]) / 2] };
      const R = (3 * a + b + c) / 2;
      return { text: `ABC üçbucağında AB = ${c}, BC = ${a}, AC = ${b}. M və N — AB və AC tərəflərinin orta nöqtələridir. MBCN trapesiyasının perimetrini tap.`,
        svg: figure(P, { poly: ABC, names: ["A", "B", "C", "M", "N"], segs: [["M", "N", "acc"]], place: { M: ["A", "inw"], N: ["A", "inw"] }, lab: { AB: String(c), BC: String(a), AC: String(b) }, aria: "ABC üçbucağı və MN orta xətti" }),
        answer: R, show: String(R), tol: 1e-6,
        solution: `MN — orta xəttdir: MN = BC : 2 = ${fmt(a / 2)}, MN ∥ BC, MBCN trapesiyadır. MB = AB : 2 = ${fmt(c / 2)}, NC = AC : 2 = ${fmt(b / 2)}. P = MB + BC + CN + NM = ${fmt(c / 2)} + ${a} + ${fmt(b / 2)} + ${fmt(a / 2)} = ${R}.` };
    }) },
    // 9. coded: the bisectors of the angles at the lateral sides cut BC (BM = AB, CK = CD)
    { tip: "kod", gen: () => again(() => {
      const b = rnd(10, 20), c = rnd(Math.ceil(.55 * b), Math.floor(.75 * b)), d = rnd(Math.ceil(.55 * b), Math.floor(.75 * b)); if (c + d < 1.2 * b) return null;
      const ph = rad(rnd(50, 70)), hh = c * Math.sin(ph), sw = hh / d; if (sw > .95) return null;
      const ox = d * Math.sqrt(1 - sw * sw), P = { A: [-c * Math.cos(ph), 0], B: [0, hh], C: [b, hh], D: [b + ox, 0], M: [c, hh], K: [b - d, hh] };
      const R = c + d - b;
      return { text: `ABCD trapesiyasında AD ∥ BC, AB = ${c}, CD = ${d}, BC = ${b}. ∠A və ∠D bucaqlarının tənbölənləri BC tərəfini müvafiq olaraq M və K nöqtələrində kəsir. MK = ?`,
        svg: figure(P, { poly: ABCD, names: ["A", "B", "C", "D", "M", "K"], place: { M: ["C", "out"], K: ["B", "out"] }, rot: TROT, segs: [["A", "M", "acc"], ["D", "K", "acc"]], arcs: [["A", "D", "M", "", 18], ["A", "M", "B", "", 26], ["D", "A", "K", "", 18], ["D", "K", "C", "", 26]], lab: { AB: String(c), CD: String(d), BC: String(b) }, aria: "Trapesiya, A və D bucaqlarının tənbölənləri BC-ni M və K nöqtələrində kəsir" }),
        answer: R, show: String(R), tol: 1e-6,
        solution: `AM tənbölən: ∠BAM = ∠MAD. BC ∥ AD olduğundan ∠AMB = ∠MAD (çarpaz bucaqlar). Deməli ABM bərabəryanlıdır: BM = AB = ${c}. Eyni qayda ilə CK = CD = ${d}. BC üzərində B, K, M, C ardıcıllığı var: BM + CK = BC + MK, MK = ${c} + ${d} − ${b} = ${R}.` };
    }) },
    // 10. written: an isosceles trapezoid with an inscribed circle, bases a and b → area
    { tip: "yazili", gen: () => again(() => {
      const [p, q, t] = pick(INSC), a = p * p * t, b = q * q * t, c = (a + b) / 2, hh = p * q * t;
      const S = c * hh, x1 = (a - b) / 2, P = { A: [0, 0], B: [x1, hh], C: [x1 + b, hh], D: [a, 0], O: [a / 2, hh / 2] };
      return { text: `Bərabəryanlı trapesiyanın daxilinə çevrə çəkilib. Trapesiyanın əsasları ${a} sm və ${b} sm-dir. Trapesiyanın sahəsini (sm² ilə) tap.`,
        svg: figure(P, { poly: ABCD, names: ABCD, rot: TROT, circ: ["O", hh / 2], lab: { AD: String(a), BC: String(b) }, aria: "Daxilinə çevrə çəkilmiş bərabəryanlı trapesiya" }),
        answer: S, show: String(S), tol: 1e-6, unit: "sm²",
        solution: `1) Daxilinə çevrə çəkilmişdir: AD + BC = AB + CD, yan tərəflər bərabərdir (AB = CD), ona görə AB = (${a} + ${b}) / 2 = ${c}. 2) Yan tərəfin proyeksiyası: (${a} − ${b}) / 2 = ${x1}. 3) Hündürlük: h = √(${c}² − ${x1}²) = √${hh * hh} = ${hh}. 4) S = (${a} + ${b}) / 2 · ${hh} = ${c} · ${hh} = ${S} sm². Həll yazılmadan yalnız cavab — bal verilmir.` };
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
      key: "trapesiya", title: "Trapesiya, orta xətt", fenn: "riyaziyyat", link: "dersler/trapesiya.html",
      format: "Cavab — ədəd: tərəf, bucaq (dərəcə ilə, ° yazmaq lazım deyil), perimetr, sahə. Onluq: 7,5 (vergül də olar).",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ucbucaq", "bucaq", "orta", "orta", "proyeksiya", "proyeksiya", "sahe", "sahe", "sahe", "heyat"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/trapesiya.html")) b.push("dersler/trapesiya.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
