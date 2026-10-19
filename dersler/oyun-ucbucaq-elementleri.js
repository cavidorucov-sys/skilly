// Üçbucağın elementləri (median, tənbölən, hündürlük), üçbucaq bərabərsizliyi, tərəf-bucaq münasibətləri — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const range = (a, b, s = 1) => { const r = []; for (let x = a; x <= b; x += s) r.push(x); return r; };
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const rad = d => d * Math.PI / 180;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const frac = (p, q) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : (p / g) + "/" + (q / g); };
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const deg = { unit: "°", tol: 0.01 };
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const steps = (task, list) => h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...list.map(s => h("li", {}, s))));
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];

  // ---- figure: points in math coordinates (y up); random rotation and mirror
  // o: { polys:[[names]], segs:[[p,q,"ink"|"acc"|"dash"]], names, place:{k:[[p..], ±1]}, ticks:[[p,q,n]], right:[[v,p,q]], arcs:[[v,p,q,text,R,count]], lab:{PQ:text} }
  const INK = "#17171a", ACC = "#534ab7";
  function figure(P, o) {
    const W = 280, H = 200, pad = 30;
    const r = pick(o.rot || [0, 90, 180, 270]) * Math.PI / 180, flip = o.noflip ? 1 : Math.random() < .5 ? -1 : 1;
    const Q = {};
    for (const k in P) { const x = P[k][0] * flip, y = P[k][1]; Q[k] = [x * Math.cos(r) - y * Math.sin(r), -(x * Math.sin(r) + y * Math.cos(r))]; }
    const xs = Object.values(Q).map(p => p[0]), ys = Object.values(Q).map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min((W - 2 * pad) / ((x1 - x0) || 1), (H - 2 * pad) / ((y1 - y0) || 1));
    const ox = (W - s * (x1 - x0)) / 2 - s * x0, oy = (H - s * (y1 - y0)) / 2 - s * y0;
    for (const k in Q) Q[k] = [ox + s * Q[k][0], oy + s * Q[k][1]];
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": o.aria || "Üçbucaq" });
    const polys = o.polys || [];
    const cenOf = list => [0, 1].map(i => list.reduce((t, k) => t + Q[k][i], 0) / list.length);
    const cen = k => cenOf(polys.find(p => p.includes(k)) || polys[0] || Object.keys(Q));
    const unit = v => { const L = Math.hypot(...v) || 1; return [v[0] / L, v[1] / L]; };
    for (const p of polys) g.append(sv("polygon", { points: p.map(k => Q[k].join(",")).join(" "), fill: "#eeedfe", stroke: INK, "stroke-width": 2, "stroke-linejoin": "round" }));
    for (const [p, q, st] of o.segs || []) {
      const a = { x1: Q[p][0], y1: Q[p][1], x2: Q[q][0], y2: Q[q][1], stroke: st === "acc" ? ACC : INK, "stroke-width": st === "dash" ? 1.5 : 2, "stroke-linecap": "round" };
      if (st === "dash") a["stroke-dasharray"] = "5 4";
      g.append(sv("line", a));
    }
    for (const [p, q, n] of o.ticks || []) {
      const m = [(Q[p][0] + Q[q][0]) / 2, (Q[p][1] + Q[q][1]) / 2], d = unit([Q[q][0] - Q[p][0], Q[q][1] - Q[p][1]]), nr = [-d[1] * 6, d[0] * 6];
      for (let i = 0; i < n; i++) { const off = (i - (n - 1) / 2) * 5, c = [m[0] + d[0] * off, m[1] + d[1] * off];
        g.append(sv("line", { x1: c[0] + nr[0], y1: c[1] + nr[1], x2: c[0] - nr[0], y2: c[1] - nr[1], stroke: ACC, "stroke-width": 2 })); }
    }
    for (const [v, p, q] of o.right || []) {
      const u = k => { const d = unit([Q[k][0] - Q[v][0], Q[k][1] - Q[v][1]]); return [d[0] * 9, d[1] * 9]; };
      const a = u(p), b = u(q), V = Q[v];
      g.append(sv("path", { d: `M${V[0] + a[0]} ${V[1] + a[1]}L${V[0] + a[0] + b[0]} ${V[1] + a[1] + b[1]}L${V[0] + b[0]} ${V[1] + b[1]}`, fill: "none", stroke: INK, "stroke-width": 1.3 }));
    }
    for (const [v, p, q, t, rr, cnt] of o.arcs || []) {
      const V = Q[v], R = rr || 18, ang = k => Math.atan2(Q[k][1] - V[1], Q[k][0] - V[0]);
      let t1 = ang(p), t2 = ang(q); if (Math.abs(t2 - t1) > Math.PI) t2 += t2 < t1 ? 2 * Math.PI : -2 * Math.PI;
      for (let j = 0; j < (cnt || 1); j++) {
        const RR = R + 4 * j, pts = Array.from({ length: 13 }, (_, i) => { const t = t1 + (t2 - t1) * i / 12; return (V[0] + RR * Math.cos(t)).toFixed(1) + " " + (V[1] + RR * Math.sin(t)).toFixed(1); });
        g.append(sv("path", { d: "M" + pts.join("L"), fill: "none", stroke: ACC, "stroke-width": 2 }));
      }
      if (t) { const tm = (t1 + t2) / 2, d = R + 4 * ((cnt || 1) - 1) + 15 + Math.max(0, 50 - Math.abs(t2 - t1) * 180 / Math.PI) * .5; g.append(sv("text", { x: V[0] + d * Math.cos(tm), y: V[1] + d * Math.sin(tm) + 4, "text-anchor": "middle", class: "oy-lbl", style: "fill:" + ACC + ";font-size:12px" }, t)); }
    }
    for (const key in o.lab || {}) {
      const [p, q] = key.split(""), m = [(Q[p][0] + Q[q][0]) / 2, (Q[p][1] + Q[q][1]) / 2], c = cen(p);
      const d = unit([Q[q][0] - Q[p][0], Q[q][1] - Q[p][1]]); let n = [-d[1], d[0]];
      if (n[0] * (m[0] - c[0]) + n[1] * (m[1] - c[1]) < 0) n = [-n[0], -n[1]];
      g.append(sv("text", { x: m[0] + n[0] * 14, y: m[1] + n[1] * 14 + 5, "text-anchor": "middle", class: "oy-lbl" }, o.lab[key]));
    }
    for (const k of o.names || []) {
      const c = cen(k); let d = [Q[k][0] - c[0], Q[k][1] - c[1]];
      const pl = (o.place || {})[k];
      if (pl) { d = [0, 0]; for (const p of pl[0]) { const u = unit([Q[p][0] - Q[k][0], Q[p][1] - Q[k][1]]); d[0] += u[0] * pl[1]; d[1] += u[1] * pl[1]; } }
      if (Math.hypot(...d) < 1e-6) d = [1, -1];
      d = unit(d);
      g.append(sv("text", { x: Q[k][0] + d[0] * 14, y: Q[k][1] + d[1] * 14 + 5, "text-anchor": "middle", class: "oy-lbl", style: "fill:#5f5e5a;font-style:italic" }, k));
    }
    return g;
  }
  // triangle with ∠A = al, ∠B = be on AB = 1 (math coords)
  const tri = (al, be) => { const b = Math.sin(rad(be)) / Math.sin(rad(al + be)); return { A: [0, 0], B: [1, 0], C: [b * Math.cos(rad(al)), b * Math.sin(rad(al))] }; };
  const ABC = ["A", "B", "C"];
  const ARC = { A: ["A", "B", "C"], B: ["B", "C", "A"], C: ["C", "A", "B"] };
  // triangle from sides: BC = a on the x-axis, AB = c, AC = b
  const triS = (a, b, c) => { const x = (a * a + c * c - b * b) / (2 * a); return { B: [0, 0], C: [a, 0], A: [x, Math.sqrt(Math.max(c * c - x * x, 1e-6))] }; };
  // acute-ish triangle angles (multiples of step), each in [lo, hi]
  const ang3 = (lo, hi, step = 2) => { let a, b, c; do { a = pick(range(lo, hi, step)); b = pick(range(lo, hi, step)); c = 180 - a - b; } while (c < lo || c > hi); return [a, b, c]; };
  const footOn = (P, v, p, q) => { const [x1, y1] = P[p], [x2, y2] = P[q], [x, y] = P[v], dx = x2 - x1, dy = y2 - y1, t = ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy); return [x1 + t * dx, y1 + t * dy]; };
  const valid = (x, y, z) => x < y + z && y < x + z && z < x + y;

  const levels = [
    { id: "median", ad: "Median", izah: "Median təpəni qarşı tərəfin orta nöqtəsi ilə birləşdirir. Medianlar bir nöqtədə kəsişir və təpədən başlayaraq 2 : 1 nisbətində bölünür.",
      gen() {
        const kind = pick(["teref", "kesisme", "kesisme", "perimetr", "perimetr2"]);
        const [a, b] = ang3(40, 100, 5), P = tri(a, b);
        P.M = [(P.B[0] + P.C[0]) / 2, (P.B[1] + P.C[1]) / 2];
        if (kind === "teref") {
          const x = rnd(3, 20), ask = pick(["BC", "MC"]);
          return { text: `ABC üçbucağında AM — mediandır, BM = ${x}. ${ask} = ?`,
            svg: figure(P, { polys: [ABC], segs: [["A", "M", "acc"]], names: [...ABC, "M"], ticks: [["B", "M", 1], ["M", "C", 1]], lab: { BM: String(x) } }),
            answer: ask === "BC" ? 2 * x : x, show: String(ask === "BC" ? 2 * x : x), tol: 0.01,
            solution: `Median BC-ni yarıya bölür: BM = MC = ${x}.` + (ask === "BC" ? ` BC = 2 · ${x} = ${2 * x}.` : "") };
        }
        if (kind === "kesisme") {
          P.N = [(P.A[0] + P.C[0]) / 2, (P.A[1] + P.C[1]) / 2]; P.O = [(P.A[0] + P.B[0] + P.C[0]) / 3, (P.A[1] + P.B[1] + P.C[1]) / 3];
          const k = rnd(2, 12), sub = pick(["AO", "OM", "AM", "AM2"]);
          const fig = figure(P, { polys: [ABC], segs: [["A", "M", "acc"], ["B", "N", "acc"]], names: [...ABC, "M", "N", "O"], place: { O: [["A", "B"], -1] }, ticks: [["B", "M", 1], ["M", "C", 1], ["A", "N", 2], ["N", "C", 2]] });
          if (sub === "AO") return { text: `ABC üçbucağının AM və BN medianları O nöqtəsində kəsişir. AM = ${3 * k}. AO = ?`, svg: fig, answer: 2 * k, show: String(2 * k), tol: 0.01,
            solution: `Medianlar kəsişmə nöqtəsində təpədən başlayaraq 2 : 1 bölünür: AO = ${3 * k} · 2/3 = ${2 * k}, OM = ${k}.` };
          if (sub === "OM") return { text: `ABC üçbucağının AM və BN medianları O nöqtəsində kəsişir. AM = ${3 * k}. OM = ?`, svg: fig, answer: k, show: String(k), tol: 0.01,
            solution: `AO : OM = 2 : 1, deməli OM medianın üçdə biridir: ${3 * k} : 3 = ${k}.` };
          if (sub === "AM") return { text: `ABC üçbucağının AM və BN medianları O nöqtəsində kəsişir. AO = ${2 * k}. AM = ?`, svg: fig, answer: 3 * k, show: String(3 * k), tol: 0.01,
            solution: `AO : OM = 2 : 1, AO = ${2 * k} → OM = ${k}. AM = ${2 * k} + ${k} = ${3 * k}.` };
          return { text: `ABC üçbucağının AM və BN medianları O nöqtəsində kəsişir. OM = ${k}. AO = ?`, svg: fig, answer: 2 * k, show: String(2 * k), tol: 0.01,
            solution: `AO : OM = 2 : 1 → AO = 2 · ${k} = ${2 * k}.` };
        }
        let c, bb; do { c = rnd(5, 20); bb = rnd(4, 20); } while (c === bb);
        const m = rnd(4, 15), x = rnd(3, 12), d = c - bb;
        if (kind === "perimetr") return { text: `ABC üçbucağında AM — mediandır. AB = ${c}, AC = ${bb}. ABM və ACM üçbucaqlarının perimetrlərinin fərqini tap (böyükdən kiçiyi çıx).`,
          svg: figure(P, { polys: [ABC], segs: [["A", "M", "acc"]], names: [...ABC, "M"], ticks: [["B", "M", 1], ["M", "C", 1]] }), answer: Math.abs(d), show: String(Math.abs(d)), tol: 0.01,
          solution: `P(ABM) = AB + BM + AM, P(ACM) = AC + MC + AM. BM = MC, AM ortaqdır — fərq yalnız AB − AC-dən gəlir: |${c} − ${bb}| = ${Math.abs(d)}.` };
        const p1 = c + x + m, p2 = bb + x + m;
        return { text: `ABC üçbucağında AM — mediandır. ABM üçbucağının perimetri ${p1}, ACM üçbucağının perimetri ${p2}, AB = ${c}. AC-ni tap.`,
          svg: figure(P, { polys: [ABC], segs: [["A", "M", "acc"]], names: [...ABC, "M"], ticks: [["B", "M", 1], ["M", "C", 1]] }), answer: bb, show: String(bb), tol: 0.01,
          solution: `BM = MC və AM ortaqdır, ona görə perimetrlərin fərqi = AB − AC: ${p1} − ${p2} = ${S(d)}. AC = ${c} ${d > 0 ? "− " + d : "+ " + (-d)} = ${bb}.` };
      } },

    { id: "tenbolen", ad: "Tənbölən", izah: "Tənbölən bucağı yarıya bölür. Xassə: tənbölən qarşı tərəfi qonşu tərəflərə mütənasib hissələrə bölür: BD : DC = AB : AC.",
      gen() {
        const kind = pick(["bd", "bd", "ac", "bucaq", "bucaq"]);
        if (kind === "bd" || kind === "ac") {
          let a, b, c; do { a = rnd(4, 18); b = rnd(3, 15); c = rnd(3, 15); } while (!valid(a, b, c) || b === c);
          const P = triS(a, b, c); P.D = [a * c / (b + c), 0];
          const base = { polys: [ABC], segs: [["A", "D", "acc"]], names: [...ABC, "D"], place: { D: [["A"], 1] }, arcs: [["A", "B", "D", "", 18], ["A", "D", "C", "", 22]] };
          if (kind === "bd") {
            const ask = pick(["BD", "DC"]), ans = ask === "BD" ? a * c / (b + c) : a * b / (b + c), sh = ask === "BD" ? frac(a * c, b + c) : frac(a * b, b + c);
            return { text: `ABC üçbucağında AB = ${c}, AC = ${b}, BC = ${a}. AD — A bucağının tənbölənidir (D ∈ BC). ${ask} = ?`,
              svg: figure(P, { ...base, lab: { AB: String(c), AC: String(b), BC: String(a) } }), answer: ans, show: sh, placeholder: "məs. 5 və ya 27/4",
              solution: `BD : DC = AB : AC = ${c} : ${b}. BC ${b + c} hissəyə bölünür: bir hissə ${frac(a, b + c)}. ${ask} = ${ask === "BD" ? c : b} · ${frac(a, b + c)} = ${sh}.` };
          }
          const m = rnd(2, 7), k = rnd(1, 4); let n; do n = rnd(2, 7); while (n === m);
          return { text: `ABC üçbucağında AD — tənbölən, BD : DC = ${m} : ${n}, AB = ${m * k}. AC-ni tap.`,
            svg: figure(P, base), answer: n * k, show: String(n * k), tol: 0.01,
            solution: `Tənbölənin xassəsi: AB : AC = BD : DC = ${m} : ${n}. ${m * k} : AC = ${m} : ${n} → AC = ${m * k} · ${n} : ${m} = ${n * k}.` };
        }
        const [al, be] = ang3(30, 100, 2), P = tri(al, be);
        // D on BC with ∠BAD = ∠DAC: direction at angle al/2 from AB, intersect with BC
        const dir = [Math.cos(rad(al / 2)), Math.sin(rad(al / 2))], B = P.B, C = P.C;
        const t = ((B[0]) * (C[1] - B[1]) - (B[1]) * (C[0] - B[0])) / (dir[0] * (C[1] - B[1]) - dir[1] * (C[0] - B[0]));
        P.D = [dir[0] * t, dir[1] * t];
        const ask = pick(["ADB", "ADC"]), adb = 180 - be - al / 2, ans = ask === "ADB" ? adb : 180 - adb;
        return { text: `ABC üçbucağında ∠A = ${al}°, ∠B = ${be}°. AD — tənbölən (D ∈ BC). ∠${ask} neçə dərəcədir?`,
          svg: figure(P, { polys: [ABC], segs: [["A", "D", "acc"]], names: [...ABC, "D"], place: { D: [["B", "A"], -1] }, arcs: [["A", "B", "D", "", 18], ["A", "D", "C", "", 22], [...ARC.B, be + "°"], ask === "ADB" ? ["D", "A", "B", "?", 14] : ["D", "C", "A", "?", 14]] }),
          answer: ans, show: ans + "°", ...deg,
          solution: `∠BAD = ${al}° : 2 = ${al / 2}°. ABD üçbucağında ∠ADB = 180° − ${be}° − ${al / 2}° = ${adb}°.` + (ask === "ADC" ? ` ∠ADC ona qonşudur: 180° − ${adb}° = ${ans}°.` : "") };
      } },

    { id: "hundurluk", ad: "Hündürlük və bucaqlar", izah: "Hündürlük qarşı tərəfə perpendikulyardır (90°). Tənbölənlər arasındakı bucaq: ∠AOB = 90° + ∠C/2. Hündürlüklər arasındakı: ∠AOB = 180° − ∠C.",
      gen() {
        const kind = pick(["bah", "bah", "had", "tenbolenler", "hundurlukler"]);
        const [al, be, ga] = ang3(30, 84, 2), P = tri(al, be);
        if (kind === "bah") {
          P.H = footOn(P, "A", "B", "C");
          const ask = pick(["BAH", "CAH"]), ans = ask === "BAH" ? 90 - be : 90 - ga, kn = ask === "BAH" ? "B" : "C", v = ask === "BAH" ? be : ga;
          return { text: `ABC itibucaqlı üçbucağında AH — hündürlükdür, ∠${kn} = ${v}°. ∠${ask} neçə dərəcədir?`,
            svg: figure(P, { polys: [ABC], segs: [["A", "H", "acc"]], names: [...ABC, "H"], right: [["H", "C", "A"]], arcs: [[...ARC[kn], v + "°"], ask === "BAH" ? ["A", "B", "H", "?", 20] : ["A", "H", "C", "?", 20]] }),
            answer: ans, show: ans + "°", ...deg,
            solution: `A${kn}H üçbucağı düzbucaqlıdır (∠H = 90°): ∠${ask} = 90° − ${v}° = ${ans}°.` };
        }
        if (kind === "had") {
          let b2 = be, c2 = ga; if (b2 === c2) { b2 += 4; c2 -= 4; }
          const a2 = 180 - b2 - c2, Q = tri(a2, b2); Q.H = footOn(Q, "A", "B", "C");
          const dir = [Math.cos(rad(a2 / 2)), Math.sin(rad(a2 / 2))], B = Q.B, C = Q.C;
          const t = (B[0] * (C[1] - B[1]) - B[1] * (C[0] - B[0])) / (dir[0] * (C[1] - B[1]) - dir[1] * (C[0] - B[0])); Q.D = [dir[0] * t, dir[1] * t];
          const ans = Math.abs(b2 - c2) / 2;
          return { text: `ABC üçbucağında ∠B = ${b2}°, ∠C = ${c2}°. A təpəsindən AH hündürlüyü və AD tənböləni çəkilib. ∠HAD neçə dərəcədir?`,
            svg: figure(Q, { polys: [ABC], segs: [["A", "H", "acc"], ["A", "D", "acc"]], names: [...ABC, "H", "D"], right: [["H", "C", "A"]], arcs: [["A", "H", "D", "?", 34]] }),
            answer: ans, show: ans + "°", ...deg,
            solution: `∠A = 180° − ${b2}° − ${c2}° = ${a2}°, ∠BAD = ${a2 / 2}°. ABH-da ∠BAH = 90° − ${b2}° = ${90 - b2}°. ∠HAD = |${a2 / 2}° − ${90 - b2}°| = ${ans}°.` };
        }
        if (kind === "tenbolenler") {
          const ans = 90 + ga / 2;
          return { text: `ABC üçbucağında ∠C = ${ga}°. A və B bucaqlarının tənbölənləri O nöqtəsində kəsişir. ∠AOB neçə dərəcədir?`, answer: ans, show: ans + "°", ...deg,
            solution: `∠A + ∠B = 180° − ${ga}° = ${180 - ga}°. AOB üçbucağında ∠OAB + ∠OBA = ${180 - ga}° : 2 = ${(180 - ga) / 2}°. ∠AOB = 180° − ${(180 - ga) / 2}° = ${ans}° (= 90° + ∠C/2).` };
        }
        const ans = 180 - ga;
        return { text: `ABC itibucaqlı üçbucağında ∠C = ${ga}°. AH və BK hündürlükləri O nöqtəsində kəsişir. ∠AOB neçə dərəcədir?`, answer: ans, show: ans + "°", ...deg,
          solution: `CHOK dördbucaqlısında ∠H = ∠K = 90°, ∠C = ${ga}°, deməli ∠HOK = 360° − 180° − ${ga}° = ${ans}°. ∠AOB = ∠HOK (qarşılıqlı bucaqlar) = ${ans}°.` };
      } },

    { id: "berabersizlik", ad: "Üçbucaq bərabərsizliyi", izah: "Hər tərəf o biri ikisinin cəmindən kiçik, fərqindən böyükdür: |a − b| < c < a + b.",
      gen() {
        const kind = pick(["say", "say", "max", "min", "beraberyanli", "uclukler"]);
        let a, b; do { a = rnd(2, 20); b = rnd(2, 20); } while (a === b && Math.random() < .7);
        const lo = Math.abs(a - b), hi = a + b;
        if (kind === "say") { const n = hi - lo - 1;
          return { text: `Üçbucağın iki tərəfi: ${a} və ${b}. Üçüncü tərəfin uzunluğu tam ədəddir. Üçüncü tərəf neçə müxtəlif qiymət ala bilər?`, answer: n, show: String(n), tol: 0.01,
            solution: `|${a} − ${b}| < c < ${a} + ${b}, yəni ${lo} < c < ${hi}. Tam qiymətlər: ${lo + 1}, ${lo + 2}, …, ${hi - 1}. Sayı: ${hi - 1} − ${lo + 1} + 1 = ${n}.` }; }
        if (kind === "max") return { text: `Üçbucağın iki tərəfi: ${a} və ${b}. Üçüncü tərəf tam ədəddirsə, onun ən böyük qiyməti neçədir?`, answer: hi - 1, show: String(hi - 1), tol: 0.01,
          solution: `c < ${a} + ${b} = ${hi}. Bərabərsizlik ciddidir (c = ${hi} olsa, üçbucaq "yastılaşar"), ona görə ən böyük tam qiymət ${hi - 1}.` };
        if (kind === "min") return { text: `Üçbucağın iki tərəfi: ${a} və ${b}. Üçüncü tərəf tam ədəddirsə, onun ən kiçik qiyməti neçədir?`, answer: lo + 1, show: String(lo + 1), tol: 0.01,
          solution: `c > |${a} − ${b}| = ${lo}. Ən kiçik tam qiymət ${lo + 1}.` };
        if (kind === "beraberyanli") {
          let p, q; do { p = rnd(2, 12); q = rnd(2 * p, 30); } while (q === 2 * p && Math.random() < .5);
          const [x, y] = Math.random() < .5 ? [p, q] : [q, p], ans = 2 * q + p;
          return { text: `Bərabəryanlı üçbucağın iki tərəfi: ${x} və ${y}. Onun perimetrini tap.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Yan tərəflər ${p} olsaydı: ${p} + ${p} = ${2 * p} ≤ ${q} — üçbucaq bərabərsizliyi pozulur. Deməli yan tərəflər ${q}, oturacaq ${p}: P = ${q} + ${q} + ${p} = ${ans}.` };
        }
        const T = []; for (let i = 0; i < 4; i++) { const t = [rnd(1, 12), rnd(1, 12), rnd(1, 12)].sort((u, v) => u - v); T.push(t); }
        const ok = T.filter(t => t[0] + t[1] > t[2]);
        return { text: `Verilmiş üçlüklərdən neçəsi üçbucağın tərəfləri ola bilər? ${T.map(t => "(" + t.join("; ") + ")").join(", ")}`, answer: ok.length, show: String(ok.length), tol: 0.01,
          solution: `Kifayətdir yoxlayasan: iki kiçik tərəfin cəmi böyük tərəfdən böyükdürmü? ` + T.map(t => `${t[0]} + ${t[1]} = ${t[0] + t[1]} ${t[0] + t[1] > t[2] ? ">" : "≤"} ${t[2]} ${t[0] + t[1] > t[2] ? "✓" : "✗"}`).join("; ") + `. Cavab: ${ok.length}.` };
      } },

    { id: "munasibet", ad: "Tərəflər və bucaqlar", izah: "Böyük tərəfin qarşısında böyük bucaq, böyük bucağın qarşısında böyük tərəf durur. Bərabər tərəflərin qarşısında bərabər bucaqlar.",
      gen() {
        const kind = pick(["bucaq", "bucaq", "teref", "teref", "eded", "beraberyanli"]);
        const OPP = { A: "BC", B: "AC", C: "AB" };
        if (kind === "bucaq") {
          let s; do { s = { BC: rnd(3, 15), AC: rnd(3, 15), AB: rnd(3, 15) }; } while (!valid(s.BC, s.AC, s.AB) || new Set(Object.values(s)).size < 3);
          const big = Math.random() < .5, v = ABC.map(k => s[OPP[k]]), tgt = big ? Math.max(...v) : Math.min(...v), idx = v.indexOf(tgt);
          const opts = ["∠A", "∠B", "∠C"];
          return { text: `ABC üçbucağında AB = ${s.AB}, BC = ${s.BC}, AC = ${s.AC}. Üçbucağın ən ${big ? "böyük" : "kiçik"} bucağı hansıdır?`, choices: opts, correct: idx, show: opts[idx],
            solution: `Ən ${big ? "böyük" : "kiçik"} tərəf ${OPP[ABC[idx]]} = ${tgt}. Onun qarşısında ∠${ABC[idx]} durur (${ABC[idx]} hərfi ${OPP[ABC[idx]]}-də yoxdur).` };
        }
        if (kind === "teref") {
          const [a, b, c] = (() => { let r; do { r = ang3(20, 130, 5); } while (new Set(r).size < 3); return r; })(), A = { A: a, B: b, C: c };
          const big = Math.random() < .5, v = ABC.map(k => A[k]), tgt = big ? Math.max(...v) : Math.min(...v), idx = v.indexOf(tgt);
          const opts = shuffle(["AB", "BC", "AC"]), ans = OPP[ABC[idx]];
          return { text: `ABC üçbucağında ∠A = ${a}°, ∠B = ${b}°. Üçbucağın ən ${big ? "böyük" : "kiçik"} tərəfi hansıdır?`, choices: opts, correct: opts.indexOf(ans), show: ans,
            solution: `∠C = 180° − ${a}° − ${b}° = ${c}°. Ən ${big ? "böyük" : "kiçik"} bucaq ∠${ABC[idx]} = ${tgt}°, onun qarşısındakı tərəf ${ans}.` };
        }
        if (kind === "eded") {
          let a, b, c; do { [a, b, c] = ang3(20, 130, 5); } while (new Set([a, b, c]).size < 3);
          const big = Math.random() < .5, ans = big ? Math.max(a, b, c) : Math.min(a, b, c);
          return { text: `ABC üçbucağında ∠A = ${a}°, ∠B = ${b}°. Üçbucağın ən ${big ? "böyük" : "kiçik"} tərəfinin qarşısındakı bucaq neçə dərəcədir?`, answer: ans, show: ans + "°", ...deg,
            solution: `∠C = 180° − ${a}° − ${b}° = ${c}°. Ən ${big ? "böyük" : "kiçik"} tərəfin qarşısında ən ${big ? "böyük" : "kiçik"} bucaq durur: ${ans}°.` };
        }
        const v = pick([...range(20, 56, 4), 60, 60, ...range(64, 160, 4)]);
        const opts = ["Oturacaq", "Yan tərəflər", "Üç tərəf bərabərdir"], idx = v > 60 ? 0 : v < 60 ? 1 : 2, bs = (180 - v) / 2;
        return { text: `Bərabəryanlı üçbucağın təpə bucağı ${v}°-dir. Onun ən böyük tərəfi hansıdır?`, choices: opts, correct: idx, show: opts[idx],
          solution: `Oturacaq bucaqları (180° − ${v}°) : 2 = ${bs}°. Oturacaq ${v}°-lik təpə bucağının, yan tərəflər ${bs}°-lik bucaqların qarşısındadır. ` + (idx === 0 ? `${v}° > ${bs}° — oturacaq böyükdür.` : idx === 1 ? `${bs}° > ${v}° — yan tərəflər böyükdür.` : `Bütün bucaqlar 60° — üçbucaq bərabərtərəflidir.`) };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Kəndlər arasındakı məsafələr, üçbucaq lövhənin ağırlıq mərkəzi — üçbucaq bərabərsizliyi və median işdədir.",
      gen() {
        const t = pick(["kend", "kend", "lovhe", "yol"]);
        if (t === "kend") {
          let a, b; do { a = rnd(3, 25); b = rnd(3, 25); } while (a === b);
          const sub = pick(["say", "max"]), lo = Math.abs(a - b), hi = a + b;
          if (sub === "say") return { text: `A kəndindən B kəndinə ${a} km, B-dən C kəndinə ${b} km-dir. Kəndlər bir düz xətt üzərində deyil. A ilə C arasındakı məsafə tam kilometrdir. Bu məsafə neçə müxtəlif qiymət ala bilər?`, answer: hi - lo - 1, show: String(hi - lo - 1), tol: 0.01,
            solution: `ABC üçbucaqdır: ${lo} < AC < ${hi}. Tam qiymətlər ${lo + 1}, …, ${hi - 1} — cəmi ${hi - lo - 1}.` };
          return { text: `A kəndindən B kəndinə ${a} km, B-dən C kəndinə ${b} km-dir. Kəndlər bir düz xətt üzərində deyil. A ilə C arasındakı məsafə tam kilometrdirsə, ən çoxu neçə km ola bilər?`, answer: hi - 1, show: hi - 1 + " km", unit: "km", tol: 0.01,
            solution: `Üçbucaq bərabərsizliyi: AC < ${a} + ${b} = ${hi}. Ən böyük tam qiymət ${hi - 1} km.` };
        }
        if (t === "lovhe") {
          const k = rnd(3, 20), ask = pick(["tepe", "teref"]);
          return { text: `Üçbucaq formalı lövhəni barmağın ucunda saxlamaq üçün onu medianların kəsişmə nöqtəsindən tutmaq lazımdır. Lövhənin bir medianı ${3 * k} sm-dir. Bu nöqtə medianın ${ask === "tepe" ? "təpədəki ucundan" : "tərəfdəki ucundan"} neçə sm aralıdır?`,
            answer: ask === "tepe" ? 2 * k : k, show: (ask === "tepe" ? 2 * k : k) + " sm", unit: "sm", tol: 0.01,
            solution: `Medianlar kəsişmə nöqtəsində təpədən başlayaraq 2 : 1 bölünür: təpədən ${2 * k} sm, tərəfdən ${k} sm.` };
        }
        let b, c; do { b = rnd(2, 15); c = rnd(2, 15); } while (b === c);
        return { text: `Evdən məktəbə yol mağazanın yanından keçir: ev → mağaza ${b} km, mağaza → məktəb ${c} km. Ev, mağaza və məktəb bir düz xətt üzərində deyil. Evdən məktəbə düz xətt boyunca məsafə tam kilometrdir. Bu məsafənin ən kiçik qiyməti neçədir?`,
          answer: Math.abs(b - c) + 1, show: Math.abs(b - c) + 1 + " km", unit: "km", tol: 0.01,
          solution: `Üçbucaq bərabərsizliyi: məsafə > |${b} − ${c}| = ${Math.abs(b - c)}. Ən kiçik tam qiymət ${Math.abs(b - c) + 1} km.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const t = pick(["say", "median", "beraberyanli", "munasibet"]), bad = rnd(0, 2);
        let task, st, wrong, whyS;
        if (t === "say") {
          let a, b; do { a = rnd(3, 15); b = rnd(3, 15); } while (a === b);
          const lo = Math.abs(a - b), hi = a + b;
          task = `Məsələ: üçbucağın iki tərəfi ${a} və ${b}. Üçüncü tərəf tam ədəddir. Neçə qiymət ala bilər?`;
          st = [`Üçbucaq bərabərsizliyi: ${lo} < c < ${hi}.`, `Tam qiymətlər: ${lo + 1}, ${lo + 2}, …, ${hi - 1}.`, `Onların sayı ${hi - 1} − ${lo + 1} + 1 = ${hi - lo - 1}.`];
          wrong = [`Üçbucaq bərabərsizliyi: 0 < c < ${hi}.`, `Tam qiymətlər: ${lo}, ${lo + 1}, …, ${hi}.`, `Onların sayı ${hi - 1} − ${lo + 1} = ${hi - lo - 2}.`];
          whyS = [`1-ci addımda səhv var: c tərəflərin fərqindən də böyük olmalıdır: c > ${lo}.`, `2-ci addımda səhv var: bərabərsizliklər ciddidir, ${lo} və ${hi} daxil deyil.`, `3-cü addımda səhv var: ardıcıl tam ədədlərin sayı = son − ilk + 1 = ${hi - 1} − ${lo + 1} + 1 = ${hi - lo - 1}.`];
        } else if (t === "median") {
          const k = rnd(2, 12);
          task = `Məsələ: ABC üçbucağının AM və BN medianları O-da kəsişir, AM = ${3 * k}. AO-nu tap.`;
          st = [`Medianlar bir nöqtədə kəsişir.`, `Kəsişmə nöqtəsi medianı təpədən başlayaraq 2 : 1 nisbətində bölür.`, `AO = ${3 * k} · 2/3 = ${2 * k}.`];
          wrong = [`Medianlar kəsişmir, O — BN-in orta nöqtəsidir.`, `Kəsişmə nöqtəsi medianı yarıya bölür.`, `AO = ${3 * k} · 1/3 = ${k}.`];
          whyS = ["1-ci addımda səhv var: üçbucağın üç medianı bir nöqtədə kəsişir, O ümumiyyətlə BN-in ortası deyil.", "2-ci addımda səhv var: nisbət 1 : 1 deyil, təpədən başlayaraq 2 : 1-dir.", `3-cü addımda səhv var: AO — təpəyə yaxın hissədir, medianın 2/3-si: ${2 * k}.`];
        } else if (t === "beraberyanli") {
          const p = rnd(2, 9), q = rnd(2 * p + 1, 25);
          task = `Məsələ: bərabəryanlı üçbucağın iki tərəfi ${p} və ${q}. Perimetri tap.`;
          st = [`Yan tərəflər ${p} ola bilməz: ${p} + ${p} = ${2 * p} < ${q}.`, `Deməli yan tərəflər ${q}, oturacaq ${p}.`, `P = ${q} + ${q} + ${p} = ${2 * q + p}.`];
          wrong = [`Yan tərəflər ${q} ola bilməz: ${q} + ${q} > ${p}.`, `Deməli yan tərəflər ${p}, oturacaq ${q}.`, `P = ${q} + ${p} + ${p} = ${q + 2 * p}.`];
          whyS = [`1-ci addımda səhv var: ${q} + ${q} > ${p} bərabərsizliyin ödəndiyini göstərir, pozulduğunu yox.`, `2-ci addımda səhv var: ${p}, ${p}, ${q} üçbucaq ola bilməz (${2 * p} < ${q}); yan tərəflər — ${q}.`, `3-cü addımda səhv var: yan tərəf ${q} iki dəfə sayılmalıdır: ${2 * q + p}.`];
        } else {
          let A, B, C; do { [A, B, C] = ang3(20, 130, 5); } while (new Set([A, B, C]).size < 3);
          const mx = Math.max(A, B, C), V = ["A", "B", "C"][[A, B, C].indexOf(mx)], opp = { A: "BC", B: "AC", C: "AB" }[V];
          const wV = ["A", "B", "C"].find(x => x !== V);
          task = `Məsələ: ABC-də ∠A = ${A}°, ∠B = ${B}°. Ən böyük tərəfi tap.`;
          st = [`∠C = 180° − ${A}° − ${B}° = ${C}°.`, `Ən böyük bucaq ∠${V} = ${mx}°.`, `Ən böyük tərəf ∠${V}${{ A: "-nın", B: "-nin", C: "-nin" }[V]} qarşısındakı ${opp} tərəfidir.`];
          wrong = [`∠C = 180° − ${A}° + ${B}° = ${180 - A + B}°.`, `Ən böyük bucaq ∠${wV} = ${({ A, B, C })[wV]}°.`, `Ən böyük tərəf ∠${V}${{ A: "-ya", B: "-yə", C: "-yə" }[V]} bitişik ${V === "A" ? "AB" : V === "B" ? "AB" : "AC"} tərəfidir.`];
          whyS = [`1-ci addımda səhv var: mötərizə açılanda hər iki bucaq çıxılır: 180° − ${A}° − ${B}° = ${C}°.`, `2-ci addımda səhv var: ən böyük bucaq ∠${V} = ${mx}°-dir.`, `3-cü addımda səhv var: böyük bucağın qarşısındakı tərəf böyükdür, bitişik tərəf yox: ${opp}.`];
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
      key: "ucbucaq-elementleri", title: "Üçbucağın elementləri, tərəf-bucaq münasibətləri", fenn: "riyaziyyat", link: "dersler/ucbucaq-elementleri.html",
      format: "Cavab — ədəd: uzunluq, bucaq (° yazmaq lazım deyil), say. Kəsr: 27/4. Seçim sualında variantı seç.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["median", "median", "tenbolen", "hundurluk", "hundurluk", "berabersizlik", "berabersizlik", "munasibet", "munasibet", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ucbucaq-elementleri.html")) b.push("dersler/ucbucaq-elementleri.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
