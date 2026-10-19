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
    const unit = v => { const L = Math.hypot(...v) || 1; return [v[0] / L, v[1] / L]; };
    for (const k of o.names || o.poly) {
      let d = [Q[k][0] - cen[0], Q[k][1] - cen[1]], L = Math.hypot(...d);
      if (L < 4) { d = [1, -1]; L = Math.SQRT2; }
      const pl = (o.place || {})[k]; // [toward, "in"|"out"]: letter goes diagonally toward a point, inside or outside the figure
      if (pl) { const t = unit([Q[pl[0]][0] - Q[k][0], Q[pl[0]][1] - Q[k][1]]), r = unit(pl[1] === "in" ? [-d[0], -d[1]] : d); d = [t[0] + r[0], t[1] + r[1]]; L = Math.hypot(...d) || 1; }
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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "trapesiya", title: "Trapesiya, orta xətt", fenn: "riyaziyyat", link: "dersler/trapesiya.html",
      format: "Cavab — ədəd: tərəf, bucaq (dərəcə ilə, ° yazmaq lazım deyil), perimetr, sahə. Onluq: 7,5 (vergül də olar).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
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
