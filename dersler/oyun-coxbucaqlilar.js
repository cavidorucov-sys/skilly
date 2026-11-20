// Çoxbucaqlılar — mastery game levels (diagonals, sum of interior angles, exterior angles, regular polygons,
// inscribed/circumscribed circles of regular polygons) and the final test.
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
  const sq = n => { let k = 1; for (let i = 2; i * i <= n; i++) while (n % (i * i) === 0) { n /= i * i; k *= i; } return [k, n]; };
  const rt = n => { const [k, m] = sq(n); return m === 1 ? String(k) : (k === 1 ? "" : k) + "√" + m; };
  const rtF = (n, d) => { const [k, m] = sq(n), g = gcd(k, d); if (m === 1) return frac(k, d); const K = k / g, D = d / g; return (K === 1 ? "" : K) + "√" + m + (D === 1 ? "" : "/" + D); };
  const eqs = (a, b) => a === b ? a : a + " = " + b;
  // polygon names; every name ends in "bucaqlı", so the suffix after it is always "nın / ya / da"
  const NM = { 3: "üçbucaqlı", 4: "dördbucaqlı", 5: "beşbucaqlı", 6: "altıbucaqlı", 7: "yeddibucaqlı", 8: "səkkizbucaqlı", 9: "doqquzbucaqlı", 10: "onbucaqlı", 12: "on ikibucaqlı" };
  const nm = n => NM[n] || n + "-bucaqlı";
  const DIV = [3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40];   // 360/n is whole

  // ---- figure: points in math coordinates (y up); random rotation and mirror
  // o: { poly?, names?, circles:[[centre, R, "bg"|"line"]], segs, lab, right, arcs, dots, cen? }
  const INK = "#17171a", ACC = "#534ab7", RED = "#a32d2d", SOFT = "#eeedfe";
  function figure(P, o) {
    const W = 280, H = 200, pad = 30;
    const r = (o.free ? Math.random() * 2 : pick(o.rot || [0, 1, 2, 3]) / 2) * Math.PI, flip = Math.random() < .5 ? -1 : 1;
    const Q = {};
    for (const k in P) { const x = P[k][0] * flip, y = P[k][1]; Q[k] = [x * Math.cos(r) - y * Math.sin(r), -(x * Math.sin(r) + y * Math.cos(r))]; }
    const ext = Object.values(Q).slice();
    for (const [c, R] of o.circles || []) ext.push([Q[c][0] - R, Q[c][1] - R], [Q[c][0] + R, Q[c][1] + R]);
    const xs = ext.map(p => p[0]), ys = ext.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min((W - 2 * pad) / ((x1 - x0) || 1), (H - 2 * pad) / ((y1 - y0) || 1));
    const ox = (W - s * (x1 - x0)) / 2 - s * x0, oy = (H - s * (y1 - y0)) / 2 - s * y0;
    for (const k in Q) Q[k] = [ox + s * Q[k][0], oy + s * Q[k][1]];
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": o.aria || "Fiqur" });
    const pts = o.poly || o.names || Object.keys(Q);
    const cen = o.cen ? Q[o.cen] : [0, 1].map(i => pts.reduce((t, k) => t + Q[k][i], 0) / pts.length);
    const circ = kind => { for (const [c, R, st] of o.circles || []) if ((st || "line") === kind) g.append(sv("circle", { cx: Q[c][0], cy: Q[c][1], r: R * s, fill: kind === "bg" ? SOFT : "none", stroke: kind === "bg" ? INK : ACC, "stroke-width": 2 })); };
    circ("bg");
    if (o.poly) g.append(sv("polygon", { points: o.poly.map(k => Q[k].join(",")).join(" "), fill: o.circles && o.circles.some(c => c[2] === "bg") ? "none" : SOFT, stroke: INK, "stroke-width": 2, "stroke-linejoin": "round" }));
    circ("line");
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
      const pp = Array.from({ length: 11 }, (_, i) => { const t = t1 + (t2 - t1) * i / 10; return (V[0] + R * Math.cos(t)) + " " + (V[1] + R * Math.sin(t)); });
      g.append(sv("path", { d: "M" + pp.join("L"), fill: "none", stroke: ACC, "stroke-width": 2 }));
      if (t) { const tm = (t1 + t2) / 2; g.append(sv("text", { x: V[0] + (R + 14) * Math.cos(tm), y: V[1] + (R + 14) * Math.sin(tm) + 4, "text-anchor": "middle", class: "oy-lbl", style: "fill:" + ACC + ";font-size:12px" }, t)); }
    }
    for (const key in o.lab || {}) {
      const [p, q] = key.split(""), m = [(Q[p][0] + Q[q][0]) / 2, (Q[p][1] + Q[q][1]) / 2];
      const d = [Q[q][0] - Q[p][0], Q[q][1] - Q[p][1]], L = Math.hypot(...d) || 1;
      let n = [-d[1] / L, d[0] / L];
      const out = [m[0] - cen[0], m[1] - cen[1]];
      if (Math.hypot(...out) > 6 ? n[0] * out[0] + n[1] * out[1] < 0 : n[1] > 0) n = [-n[0], -n[1]];
      g.append(sv("text", { x: m[0] + n[0] * 13, y: m[1] + n[1] * 13 + 5, "text-anchor": "middle", class: "oy-lbl" }, o.lab[key]));
    }
    for (const k of o.dots || []) g.append(sv("circle", { cx: Q[k][0], cy: Q[k][1], r: 3, fill: INK }));
    for (const k of o.names || o.poly || []) {
      let d = [Q[k][0] - cen[0], Q[k][1] - cen[1]], L = Math.hypot(...d);
      if (L < 4) { d = [1, -1]; L = Math.SQRT2; }
      g.append(sv("text", { x: Q[k][0] + d[0] / L * 14, y: Q[k][1] + d[1] / L * 14 + 5, "text-anchor": "middle", class: "oy-lbl", style: "fill:#5f5e5a;font-style:italic" }, k));
    }
    return g;
  }
  const LET = "ABCDEFGHKLMNPQ".split("");
  // regular n-gon with vertex names (letters for n ≤ 10, otherwise V0…), centre O
  function ngon(n) { const P = { O: [0, 0] }, names = []; for (let i = 0; i < n; i++) { const k = n <= 10 ? LET[i] : "V" + i; P[k] = [Math.cos(2 * Math.PI * i / n + Math.PI / 2), Math.sin(2 * Math.PI * i / n + Math.PI / 2)]; names.push(k); } return { P, names }; }
  const deg = { unit: "°", tol: 0.01 };
  const steps = (task, list) => h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...list.map(s => h("li", {}, s))));
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];

  const levels = [
    { id: "diaqonal", ad: "Diaqonallar", izah: "Bir təpədən n − 3 diaqonal çıxır, onlar çoxbucaqlını n − 2 üçbucağa bölür. Bütün diaqonallar: n(n − 3)/2.",
      gen() {
        const kind = pick(["say", "say", "n", "n", "bir", "kat"]);
        if (kind === "say") { const n = rnd(4, 20), D = n * (n - 3) / 2;
          return { text: `Qabarıq ${nm(n)}nın neçə diaqonalı var?`, answer: D, show: String(D), tol: 0.01,
            solution: `Hər təpədən ${n} − 3 = ${n - 3} diaqonal çıxır. Hər diaqonal iki dəfə sayılır: ${n} · ${n - 3} / 2 = ${D}.` }; }
        if (kind === "n") { const n = rnd(5, 20), D = n * (n - 3) / 2;
          return { text: `Qabarıq çoxbucaqlının ${D} diaqonalı var. Onun neçə tərəfi var?`, answer: n, show: String(n), tol: 0.01,
            solution: `n(n − 3)/2 = ${D} → n² − 3n − ${2 * D} = 0 → n = ${n} (ikinci kök mənfidir). Yoxla: ${n} · ${n - 3} / 2 = ${D} ✓.` }; }
        if (kind === "bir") {
          const n = rnd(4, 15), q = pick(["d", "t", "all"]);
          const { P, names } = ngon(n);
          const svg = n <= 10 ? figure(P, { poly: names, names, segs: names.slice(2, n - 1).map(k => [names[0], k, "acc"]), aria: "Bir təpədən çəkilmiş diaqonallar" }) : undefined;
          if (q === "d") return { text: `Qabarıq ${nm(n)}nın bir təpəsindən neçə diaqonal çəkmək olar?`, svg, answer: n - 3, show: String(n - 3), tol: 0.01,
            solution: `Təpə özünə və iki qonşusuna diaqonalla birləşmir: ${n} − 3 = ${n - 3}.` };
          if (q === "t") return { text: `Qabarıq ${nm(n)}nın bir təpəsindən çəkilən bütün diaqonallar onu neçə üçbucağa bölür?`, svg, answer: n - 2, show: String(n - 2), tol: 0.01,
            solution: `${n - 3} diaqonal fiquru ${n - 3} + 1 = ${n - 2} hissəyə bölür, hamısı üçbucaqdır (n − 2 qaydası).` };
          const D = n * (n - 3) / 2;
          return { text: `Qabarıq çoxbucaqlının bir təpəsindən ${n - 3} diaqonal çəkmək olar. Bu çoxbucaqlının cəmi neçə diaqonalı var?`, answer: D, show: String(D), tol: 0.01,
            solution: `Bir təpədən n − 3 = ${n - 3} → n = ${n}. Bütün diaqonallar: ${n} · ${n - 3} / 2 = ${D}.` };
        }
        if (Math.random() < .5) { const k = rnd(1, 8), n = 2 * k + 3;
          return { text: k === 1 ? "Qabarıq çoxbucaqlının diaqonallarının sayı tərəflərinin sayına bərabərdir. Onun neçə tərəfi var?" : `Qabarıq çoxbucaqlının diaqonallarının sayı tərəflərinin sayından ${k} dəfə çoxdur. Onun neçə tərəfi var?`, answer: n, show: String(n), tol: 0.01,
            solution: `n(n − 3)/2 = ${k === 1 ? "" : k}n → (n − 3)/2 = ${k} → n − 3 = ${2 * k} → n = ${n}.` }; }
        const n = rnd(7, 18), m = n * (n - 5) / 2;
        return { text: `Qabarıq çoxbucaqlının diaqonallarının sayı tərəflərinin sayından ${m} çoxdur. Onun neçə tərəfi var?`, answer: n, show: String(n), tol: 0.01,
          solution: `n(n − 3)/2 − n = ${m} → n² − 3n − 2n = ${2 * m} → n² − 5n − ${2 * m} = 0 → n = ${n} (ikinci kök mənfidir). Yoxla: ${n * (n - 3) / 2} − ${n} = ${m} ✓.` };
      } },

    { id: "cem", ad: "Daxili bucaqların cəmi", izah: "Qabarıq n-bucaqlının daxili bucaqlarının cəmi (n − 2) · 180°.",
      gen() {
        const kind = pick(["S", "S", "n", "n", "bucaq", "nisbet"]);
        if (kind === "S") { const n = rnd(3, 20), S = (n - 2) * 180;
          return { text: `Qabarıq ${nm(n)}nın daxili bucaqlarının cəmi neçə dərəcədir?`, answer: S, show: S + "°", ...deg,
            solution: `(n − 2) · 180° = (${n} − 2) · 180° = ${n - 2} · 180° = ${S}°.` }; }
        if (kind === "n") { const n = rnd(4, 22), S = (n - 2) * 180;
          return { text: `Qabarıq çoxbucaqlının daxili bucaqlarının cəmi ${S}°. Onun neçə tərəfi var?`, answer: n, show: String(n), tol: 0.01,
            solution: `(n − 2) · 180° = ${S}° → n − 2 = ${S} : 180 = ${n - 2} → n = ${n}.` }; }
        if (kind === "bucaq") {
          const n = rnd(5, 8), S = (n - 2) * 180; let a, last;
          do { a = Array.from({ length: n - 1 }, () => pick(range(70, 175, 5))); last = S - a.reduce((x, y) => x + y, 0); } while (last < 60 || last > 175);
          return { text: `Qabarıq ${nm(n)}nın ${n - 1} bucağı: ${a.map(x => x + "°").join(", ")}. Qalan bucağı tap.`, answer: last, show: last + "°", ...deg,
            solution: `Bucaqların cəmi (${n} − 2) · 180° = ${S}°. Verilənlərin cəmi ${S - last}°. Qalan bucaq: ${S}° − ${S - last}° = ${last}°.` };
        }
        let n, parts, u;
        do { n = rnd(4, 6); parts = Array.from({ length: n }, () => rnd(1, 7)).sort((x, y) => x - y); const P = parts.reduce((x, y) => x + y, 0); u = (n - 2) * 180 / P; } while (!Number.isInteger(u) || parts[n - 1] * u >= 180 || parts[0] === parts[n - 1]);
        const big = Math.random() < .5, ans = (big ? parts[n - 1] : parts[0]) * u, P = parts.reduce((x, y) => x + y, 0);
        return { text: `Qabarıq ${nm(n)}nın bucaqları ${parts.join(" : ")} nisbətindədir. Ən ${big ? "böyük" : "kiçik"} bucağı tap.`, answer: ans, show: ans + "°", ...deg,
          solution: `Cəm (${n} − 2) · 180° = ${(n - 2) * 180}°. Hissələr: ${parts.join(" + ")} = ${P}. Bir hissə ${(n - 2) * 180}° : ${P} = ${u}°. Ən ${big ? "böyük" : "kiçik"} bucaq ${big ? parts[n - 1] : parts[0]} · ${u}° = ${ans}°.` };
      } },

    { id: "xarici", ad: "Xarici bucaqlar", izah: "Hər təpədə bir xarici bucaq götürsən, qabarıq çoxbucaqlının xarici bucaqlarının cəmi həmişə 360°-dir. Xarici + daxili = 180°.",
      gen() {
        const kind = pick(["qalan", "qalan", "kdefe", "birge", "ferq", "duzgunk"]);
        if (kind === "qalan") {
          const n = rnd(4, 7); let e, last;
          do { e = Array.from({ length: n - 1 }, () => pick(range(20, 110, 5))); last = 360 - e.reduce((x, y) => x + y, 0); } while (last < 15 || last > 120);
          const inner = Math.random() < .5;
          return { text: `Qabarıq ${nm(n)}nın ${n - 1} təpəsindəki xarici bucaqlar: ${e.map(x => x + "°").join(", ")}. Qalan təpədəki ${inner ? "daxili" : "xarici"} bucağı tap.`, answer: inner ? 180 - last : last, show: (inner ? 180 - last : last) + "°", ...deg,
            solution: `Xarici bucaqların cəmi 360°: qalan xarici bucaq 360° − ${360 - last}° = ${last}°.` + (inner ? ` Daxili bucaq 180° − ${last}° = ${180 - last}°.` : "") };
        }
        if (kind === "kdefe") { const k = rnd(1, 9), n = 2 * k + 2;
          return { text: k === 1 ? "Qabarıq çoxbucaqlının daxili bucaqlarının cəmi xarici bucaqlarının cəminə bərabərdir. Onun neçə tərəfi var?" : `Qabarıq çoxbucaqlının daxili bucaqlarının cəmi xarici bucaqlarının cəmindən ${k} dəfə böyükdür. Onun neçə tərəfi var?`, answer: n, show: String(n), tol: 0.01,
            solution: `(n − 2) · 180° = ${k === 1 ? "" : k + " · "}360° = ${k * 360}° → n − 2 = ${2 * k} → n = ${n}.` }; }
        if (kind === "birge") { const n = rnd(4, 20);
          return { text: `Qabarıq çoxbucaqlının bütün daxili bucaqlarının və hər təpədə bir xarici bucağın cəmi ${n * 180}°. Onun neçə tərəfi var?`, answer: n, show: String(n), tol: 0.01,
            solution: `Hər təpədə daxili + xarici = 180°. ${n} təpə: n · 180° = ${n * 180}° → n = ${n}. (Və ya: (n − 2) · 180° + 360° = n · 180°.)` }; }
        if (kind === "ferq") { const n = rnd(5, 20), X = (n - 4) * 180;
          return { text: `Qabarıq çoxbucaqlının daxili bucaqlarının cəmi xarici bucaqlarının cəmindən ${X}° çoxdur. Onun neçə tərəfi var?`, answer: n, show: String(n), tol: 0.01,
            solution: `(n − 2) · 180° − 360° = ${X}° → (n − 2) · 180° = ${X + 360}° → n − 2 = ${(X + 360) / 180} → n = ${n}.` }; }
        const k = rnd(1, 9), n = 2 * (k + 1), e = 180 / (k + 1);
        return { text: k === 1 ? "Düzgün çoxbucaqlının daxili bucağı xarici bucağına bərabərdir. Onun neçə tərəfi var?" : `Düzgün çoxbucaqlının daxili bucağı xarici bucağından ${k} dəfə böyükdür. Onun neçə tərəfi var?`, answer: n, show: String(n), tol: 0.01,
          solution: `Daxili + xarici = 180°: ${k === 1 ? "x" : k + "x"} + x = 180° → x = ${e}° (xarici). n = 360° : ${e}° = ${n}.` };
      } },

    { id: "duzgun", ad: "Düzgün çoxbucaqlı", izah: "Düzgün n-bucaqlı: xarici bucaq 360°/n, daxili bucaq 180° − 360°/n = (n − 2) · 180°/n. Bucaqdan n: n = 360° : xarici.",
      gen() {
        const n = pick(DIV), e = 360 / n, a = 180 - e, kind = pick(["daxili", "daxili", "xarici", "nd", "nd", "nx", "diag", "per"]);
        const { P, names } = ngon(n);
        const fig = t => n <= 12 ? figure(P, { poly: names, names: n <= 6 ? names : [], arcs: [[names[0], names[1], names[n - 1], t]], aria: "Düzgün çoxbucaqlı", free: true }) : undefined;
        if (kind === "daxili") return { text: `Düzgün ${nm(n)}nın daxili bucağı neçə dərəcədir?`, svg: fig("?"), answer: a, show: a + "°", ...deg,
          solution: `Cəm (${n} − 2) · 180° = ${(n - 2) * 180}°, bir bucaq ${(n - 2) * 180}° : ${n} = ${a}°. (Və ya: xarici 360° : ${n} = ${e}°, daxili 180° − ${e}° = ${a}°.)` };
        if (kind === "xarici") return { text: `Düzgün ${nm(n)}nın xarici bucağı neçə dərəcədir?`, answer: e, show: e + "°", ...deg,
          solution: `Xarici bucaqların cəmi 360°, hamısı bərabərdir: 360° : ${n} = ${e}°.` };
        if (kind === "nd") return { text: `Düzgün çoxbucaqlının daxili bucağı ${a}°. Onun neçə tərəfi var?`, svg: fig(a + "°"), answer: n, show: String(n), tol: 0.01,
          solution: `Xarici bucaq 180° − ${a}° = ${e}°. n = 360° : ${e}° = ${n}.` };
        if (kind === "nx") return { text: `Düzgün çoxbucaqlının xarici bucağı ${e}°. Onun neçə tərəfi var?`, answer: n, show: String(n), tol: 0.01,
          solution: `Xarici bucaqların cəmi 360°: n = 360° : ${e}° = ${n}.` };
        if (kind === "diag") { const m = pick(DIV.filter(x => x >= 4 && x <= 20)), em = 360 / m, D = m * (m - 3) / 2;
          return { text: `Düzgün çoxbucaqlının daxili bucağı ${180 - em}°. Onun neçə diaqonalı var?`, answer: D, show: String(D), tol: 0.01,
            solution: `Xarici bucaq 180° − ${180 - em}° = ${em}°, n = 360° : ${em}° = ${m}. Diaqonallar: ${m} · ${m - 3} / 2 = ${D}.` }; }
        const m = pick(DIV.filter(x => x <= 20)), em = 360 / m, side = rnd(2, 12), Pm = m * side;
        return { text: `Düzgün çoxbucaqlının xarici bucağı ${em}°, perimetri ${Pm} sm. Tərəfinin uzunluğunu tap.`, answer: side, unit: "sm", show: String(side), tol: 0.01,
          solution: `n = 360° : ${em}° = ${m}. Bütün tərəflər bərabərdir: ${Pm} : ${m} = ${side} sm.` };
      } },

    { id: "cevreler", ad: "Daxilə və xaricə çəkilmiş çevrələr", izah: "Düzgün üçbucaq: R = a√3/3, r = a√3/6 (R = 2r). Kvadrat: R = a√2/2, r = a/2. Düzgün altıbucaqlı: R = a, r = a√3/2.",
      gen() {
        const shape = pick(["tri", "tri", "sq", "hex"]), give = pick(["a", "a", "R", "r"]);
        const n = shape === "tri" ? 3 : shape === "sq" ? 4 : 6, { P, names } = ngon(n);
        // genitive / dative forms: long (first sentence) and short (question)
        const NG = { tri: "Düzgün üçbucağın", sq: "Kvadratın", hex: "Düzgün altıbucaqlının" }[shape], ND = { tri: "Düzgün üçbucağa", sq: "Kvadrata", hex: "Düzgün altıbucaqlıya" }[shape];
        const SG = { tri: "Üçbucağın", sq: "Kvadratın", hex: "Altıbucaqlının" }[shape], SD = { tri: "Üçbucağa", sq: "Kvadrata", hex: "Altıbucaqlıya" }[shape];
        let v, given, ask, ans, show, sol;
        if (shape === "tri") {
          if (give === "a") { v = rnd(2, 15); given = `${NG} tərəfi ${v}.`; ask = pick(["R", "r"]);
            [ans, show] = ask === "R" ? [v / Math.sqrt(3), rtF(3 * v * v, 3)] : [v / (2 * Math.sqrt(3)), rtF(3 * v * v, 6)];
            sol = `Hündürlük h = ${v}√3/2. Mərkəz hündürlüyü 2 : 1 bölür: R = 2h/3 = a√3/3, r = h/3 = a√3/6. ` + (ask === "R" ? `R = ${v}√3/3 = ${show}.` : `r = ${v}√3/6 = ${show}.`); }
          else if (give === "R") { v = rnd(1, 12); given = `${ND} xaricdən çəkilmiş çevrənin radiusu ${v}.`; ask = pick(["a", "r"]);
            [ans, show] = ask === "a" ? [v * Math.sqrt(3), rt(3 * v * v)] : [v / 2, frac(v, 2)];
            sol = ask === "a" ? `R = a√3/3 → a = R√3 = ${eqs(v + "√3", show)}.` : `Düzgün üçbucaqda R = 2r → r = ${v} : 2 = ${show}.`; }
          else { v = rnd(1, 10); given = `${ND} daxilən çəkilmiş çevrənin radiusu ${v}.`; ask = pick(["a", "R"]);
            [ans, show] = ask === "a" ? [2 * v * Math.sqrt(3), rt(12 * v * v)] : [2 * v, String(2 * v)];
            sol = ask === "a" ? `r = a√3/6 → a = 6r/√3 = 2r√3 = ${show}.` : `Düzgün üçbucaqda R = 2r = ${2 * v}.`; }
        } else if (shape === "sq") {
          if (give === "a") { v = rnd(2, 16); given = `${NG} tərəfi ${v}.`; ask = pick(["R", "r"]);
            [ans, show] = ask === "R" ? [v / Math.SQRT2, rtF(2 * v * v, 2)] : [v / 2, frac(v, 2)];
            sol = ask === "R" ? `Xaricə çəkilmiş çevrənin diametri kvadratın diaqonalıdır: R = a√2/2 = ${eqs(v + "√2/2", show)}.` : `Daxilə çəkilmiş çevrənin diametri kvadratın tərəfidir: r = a/2 = ${show}.`; }
          else if (give === "R") { v = rnd(1, 12); given = `${ND} xaricdən çəkilmiş çevrənin radiusu ${v}.`; ask = pick(["a", "r"]);
            [ans, show] = ask === "a" ? [v * Math.SQRT2, rt(2 * v * v)] : [v / Math.SQRT2, rtF(2 * v * v, 2)];
            sol = `Diaqonal = 2R = ${2 * v}, tərəf a = ${2 * v}/√2 = ${rt(2 * v * v)}.` + (ask === "r" ? ` r = a/2 = ${show}.` : ""); }
          else { v = rnd(1, 10); given = `${ND} daxilən çəkilmiş çevrənin radiusu ${v}.`; ask = pick(["a", "R"]);
            [ans, show] = ask === "a" ? [2 * v, String(2 * v)] : [v * Math.SQRT2, rt(2 * v * v)];
            sol = `Tərəf a = 2r = ${2 * v}.` + (ask === "R" ? ` R = a√2/2 = ${2 * v}√2/2 = ${show}.` : ""); }
        } else {
          if (give === "a") { v = rnd(2, 14); given = `${NG} tərəfi ${v}.`; ask = pick(["R", "r"]);
            [ans, show] = ask === "R" ? [v, String(v)] : [v * Math.sqrt(3) / 2, rtF(3 * v * v, 2)];
            sol = `Altıbucaqlı mərkəzdən 6 bərabərtərəfli üçbucağa bölünür. ` + (ask === "R" ? `R = a = ${v}.` : `r — həmin üçbucağın hündürlüyü: a√3/2 = ${eqs(v + "√3/2", show)}.`); }
          else if (give === "R") { v = rnd(2, 14); given = `${ND} xaricdən çəkilmiş çevrənin radiusu ${v}.`; ask = pick(["P", "r"]);
            [ans, show] = ask === "P" ? [6 * v, String(6 * v)] : [v * Math.sqrt(3) / 2, rtF(3 * v * v, 2)];
            sol = `Düzgün altıbucaqlıda a = R = ${v}. ` + (ask === "P" ? `P = 6a = ${6 * v}.` : `r = a√3/2 = ${eqs(v + "√3/2", show)}.`); }
          else { v = rnd(1, 10); given = `${ND} daxilən çəkilmiş çevrənin radiusu ${v}.`; ask = "a";
            [ans, show] = [2 * v / Math.sqrt(3), rtF(12 * v * v, 3)];
            sol = `r = a√3/2 → a = 2r/√3 = ${2 * v}/√3 = ${eqs(2 * v + "√3/3", show)}.`; }
        }
        const Q = { R: `${SD} xaricdən çəkilmiş çevrənin radiusunu tap.`, r: `${SD} daxilən çəkilmiş çevrənin radiusunu tap.`, a: `${SG} tərəfini tap.`, P: `${SG} perimetrini tap.` }[ask];
        const used = [give, ask], circles = [];
        if (used.includes("R")) circles.push(["O", 1, "bg"]);
        if (used.includes("r")) circles.push(["O", Math.cos(Math.PI / n), "line"]);
        const svg = figure(P, { poly: names, names, circles, dots: ["O"], cen: "O", aria: "Düzgün çoxbucaqlı və çevrə" });
        return { text: `${given} ${Q}`,
          svg, answer: ans, show, solution: sol };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Pətək, yol nişanı, kafel, robotun dönmələri, masa ətrafında əl sıxma — hamısı çoxbucaqlı düsturlarıdır.",
      gen() {
        const kind = pick(["esya", "esya", "robot", "masa", "dosheme", "besedka"]);
        if (kind === "esya") {
          const [obj, n] = pick([["Arı pətəyinin gözü düzgün altıbucaqlıdır", 6], ["\"STOP\" yol nişanı düzgün səkkizbucaqlıdır", 8], ["Futbol topundakı ağ yamaq düzgün altıbucaqlıdır", 6], ["Futbol topundakı qara yamaq düzgün beşbucaqlıdır", 5], ["Pəncərənin vitrajı düzgün onbucaqlıdır", 10], ["Bağdakı çiçək ləki düzgün on ikibucaqlıdır", 12], ["Gəzinti meydançası düzgün doqquzbucaqlıdır", 9]]);
          const q = pick(["daxili", "cem", "diag", "xarici"]);
          const S = (n - 2) * 180, a = S / n;
          const R = { daxili: [a, `Onun daxili bucağı neçə dərəcədir?`, `Cəm (${n} − 2) · 180° = ${S}°, bir bucaq ${S}° : ${n} = ${a}°.`, true],
            cem: [S, `Onun daxili bucaqlarının cəmi neçə dərəcədir?`, `(${n} − 2) · 180° = ${S}°.`, true],
            diag: [n * (n - 3) / 2, `Onun neçə diaqonalı var?`, `${n} · ${n - 3} / 2 = ${n * (n - 3) / 2}.`, false],
            xarici: [360 / n, `Onun xarici bucağı neçə dərəcədir?`, `360° : ${n} = ${360 / n}°.`, true] }[q];
          return { text: `${obj}. ${R[1]}`, answer: R[0], show: R[0] + (R[3] ? "°" : ""), tol: 0.01, solution: R[2] };
        }
        if (kind === "robot") { const n = pick(DIV.filter(x => x <= 36)), e = 360 / n, L = rnd(2, 15), askN = Math.random() < .5;
          return askN ? { text: `Robot düz xətt üzrə gedir və hər küncdə eyni istiqamətə ${e}° dönür. Bir neçə dönmədən sonra o, başlanğıc nöqtəyə qayıdır və düzgün çoxbucaqlı çəkir. Neçə dönmə etdi?`, answer: n, show: String(n), tol: 0.01,
              solution: `Robotun dönmə bucaqları — çoxbucaqlının xarici bucaqlarıdır, cəmi 360°. Dönmə sayı: 360° : ${e}° = ${n}.` }
            : { text: `Robot hər dəfə ${L} m düz gedir, sonra eyni istiqamətə ${e}° dönür. Başlanğıc nöqtəyə qayıdanda neçə metr yol getmiş olur?`, answer: n * L, unit: "m", show: String(n * L), tol: 0.01,
              solution: `Xarici bucaqların cəmi 360°: tərəflərin sayı 360° : ${e}° = ${n}. Yol: ${n} · ${L} = ${n * L} m.` }; }
        if (kind === "masa") { const n = rnd(5, 16), D = n * (n - 3) / 2, inv = Math.random() < .4;
          return inv ? { text: `Dəyirmi masa ətrafında oturanların hər biri yanındakı iki nəfərdən başqa hamı ilə bir dəfə əl sıxdı. Cəmi ${D} əl sıxma oldu. Masada neçə nəfər oturub?`, answer: n, show: String(n), tol: 0.01,
              solution: `Adamlar — çoxbucaqlının təpələri, qonşu olmayanların əl sıxması — diaqonallar. n(n − 3)/2 = ${D} → n² − 3n − ${2 * D} = 0 → n = ${n}.` }
            : { text: `Dəyirmi masa ətrafında ${n} nəfər oturub. Hər biri yanındakı iki nəfərdən başqa hamı ilə bir dəfə əl sıxdı. Cəmi neçə əl sıxma oldu?`, answer: D, show: String(D), tol: 0.01,
              solution: `Adamlar — ${nm(n)}nın təpələri, əl sıxmalar — diaqonallar: ${n} · ${n - 3} / 2 = ${D}.` }; }
        if (kind === "dosheme") { const [k, n] = pick([[3, 6], [4, 4], [6, 3]]), cm = rnd(10, 40);
          return Math.random() < .5 ? { text: `Döşəmə eyni düzgün çoxbucaqlı kafellərlə boşluqsuz örtülüb, hər təpədə ${k} kafel görüşür. Kafelin neçə tərəfi var?`, answer: n, show: String(n), tol: 0.01,
              solution: `Bir təpə ətrafındakı bucaqların cəmi 360°: kafelin daxili bucağı 360° : ${k} = ${360 / k}°. Xarici bucaq 180° − ${360 / k}° = ${180 - 360 / k}°, n = 360° : ${180 - 360 / k}° = ${n}.` }
            : { text: `Döşəmə tərəfi ${cm} sm olan düzgün çoxbucaqlı kafellərlə boşluqsuz örtülüb, hər təpədə ${k} kafel görüşür. Bir kafelin perimetri neçə santimetrdir?`, answer: n * cm, unit: "sm", show: String(n * cm), tol: 0.01,
              solution: `Daxili bucaq 360° : ${k} = ${360 / k}° → bu ${nm(n)}dır (xarici bucaq ${180 - 360 / k}°, n = ${n}). Perimetr ${n} · ${cm} = ${n * cm} sm.` }; }
        const a = rnd(2, 8), r = Math.random() < .5;
        return { text: r ? `Besedkanın döşəməsi tərəfi ${a} m olan düzgün altıbucaqlıdır. Mərkəzdən bir tərəfin ortasına qədər tir vurulur. Tirin uzunluğu neçə metrdir?` : `Besedkanın döşəməsi tərəfi ${a} m olan düzgün altıbucaqlıdır. Mərkəzdən hər küncə tir vurulur. Bütün tirlərin cəmi uzunluğu neçə metrdir?`,
          answer: r ? a * Math.sqrt(3) / 2 : 6 * a, unit: "m", show: r ? rtF(3 * a * a, 2) : String(6 * a),
          solution: r ? `Altıbucaqlı 6 bərabərtərəfli üçbucağa bölünür; mərkəzdən tərəfin ortasına məsafə onların hündürlüyüdür: ${a}√3/2 = ${rtF(3 * a * a, 2)} m.` : `Düzgün altıbucaqlıda mərkəzdən küncə qədər məsafə tərəfə bərabərdir (R = a = ${a} m). 6 tir: 6 · ${a} = ${6 * a} m.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const kind = pick(["n", "bucaq", "cem"]), bad = rnd(0, 2);
        let task, st, why;
        if (kind === "n") {
          const n = pick(DIV.filter(x => x >= 5 && x <= 20)), e = 360 / n, a = 180 - e, D = n * (n - 3) / 2;
          task = `Düzgün çoxbucaqlının daxili bucağı ${a}°. Onun neçə diaqonalı var?`;
          st = [`Xarici bucaq: 180° − ${a}° = ${e}°`, `Tərəflərin sayı: 360° : ${e}° = ${n}`, `Diaqonallar: ${n} · ${n - 3} / 2 = ${D}`];
          if (bad === 0) st[0] = `Xarici bucaq: 360° − ${a}° = ${360 - a}°`;
          if (bad === 1) st[1] = `Tərəflərin sayı: 180° : ${e}° = ${frac(180, e)}`;
          if (bad === 2) st[2] = pick([`Diaqonallar: ${n} · ${n - 3} = ${n * (n - 3)}`, `Diaqonallar: ${n} · ${n - 2} / 2 = ${n * (n - 2) / 2}`]);
          why = [`1-ci addım: daxili və xarici bucaq qonşudur, cəmi 180°: xarici = ${e}°.`, `2-ci addım: xarici bucaqların cəmi 360°-dir: n = 360° : ${e}° = ${n}.`, `3-cü addım: diaqonallar n(n − 3)/2 = ${D}.`][bad];
        } else if (kind === "bucaq") {
          const n = pick(DIV.filter(x => x >= 5 && x <= 20)), S = (n - 2) * 180, a = S / n, e = 180 - a;
          task = `Düzgün ${nm(n)}nın xarici bucağını tap.`;
          st = [`Daxili bucaqların cəmi: (${n} − 2) · 180° = ${S}°`, `Bir daxili bucaq: ${S}° : ${n} = ${a}°`, `Xarici bucaq: 180° − ${a}° = ${e}°`];
          if (bad === 0) st[0] = `Daxili bucaqların cəmi: ${n} · 180° = ${n * 180}°`;
          if (bad === 1) st[1] = `Bir daxili bucaq: ${S}° : ${n - 2} = 180°`;
          if (bad === 2) st[2] = `Xarici bucaq: 360° − ${a}° = ${360 - a}°`;
          why = [`1-ci addım: cəm (n − 2) · 180° = ${S}°, n · 180° deyil.`, `2-ci addım: cəmi bucaqların sayına (${n}) bölmək lazımdır: ${a}°.`, `3-cü addım: xarici bucaq daxili ilə qonşudur: 180° − ${a}° = ${e}° (yoxla: 360° : ${n} = ${e}°).`][bad];
        } else {
          const n = rnd(5, 20), S = (n - 2) * 180;
          task = `Qabarıq çoxbucaqlının daxili bucaqlarının cəmi ${S}°. Onun neçə tərəfi var?`;
          st = [`(n − 2) · 180° = ${S}°`, `n − 2 = ${S} : 180 = ${n - 2}`, `n = ${n - 2} + 2 = ${n}`];
          if (bad === 0) st[0] = `n · 180° = ${S}°`;
          if (bad === 1) st[1] = `n − 2 = ${S} : 360 = ${frac(S, 360)}`;
          if (bad === 2) st[2] = `n = ${n - 2} − 2 = ${n - 4}`;
          why = [`1-ci addım: daxili bucaqların cəmi (n − 2) · 180°-dir.`, `2-ci addım: 180-ə bölmək lazımdır: ${S} : 180 = ${n - 2}.`, `3-cü addım: n − 2 = ${n - 2} → n = ${n}, 2 əlavə olunur.`][bad];
        }
        return { text: steps(task, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (n(n − 3) without /2, n · 180° instead of (n − 2) · 180°, R mixed up with r, ...).
  // Figures are drawn from exact coordinates (lengths and angles in the picture are the real ones).
  const { ae, again } = Oyun;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const dg = x => x + "°";
  // regular n-gon with circumradius R, first vertex at angle a0 (names A, B, C…, centre O)
  function ngonR(n, R, a0 = Math.PI / 2) {
    const P = { O: [0, 0] }, names = [];
    for (let i = 0; i < n; i++) { const k = LET[i]; P[k] = [R * Math.cos(2 * Math.PI * i / n + a0), R * Math.sin(2 * Math.PI * i / n + a0)]; names.push(k); }
    return { P, names };
  }
  // convex polygon from its exterior angles (degrees, sum 360; ext[i] is the angle at vertex i); sides random, the last two
  // are solved so that the polygon closes. Returns points in math coordinates (counter-clockwise).
  function polyExt(ext) {
    const n = ext.length, rad = d => d * Math.PI / 180;
    for (let t = 0; t < 500; t++) {
      const th = [0]; for (let i = 1; i < n; i++) th.push(th[i - 1] + rad(ext[i]));
      const u = th.map(a => [Math.cos(a), Math.sin(a)]), L = [];
      for (let i = 0; i < n - 2; i++) L.push(2 + Math.random() * 1.5);
      let sx = 0, sy = 0; for (let i = 0; i < n - 2; i++) { sx += L[i] * u[i][0]; sy += L[i] * u[i][1]; }
      const a = u[n - 2], b = u[n - 1], det = a[0] * b[1] - a[1] * b[0]; if (Math.abs(det) < 0.2) continue;
      const La = (-sx * b[1] + sy * b[0]) / det, Lb = (-a[0] * sy + a[1] * sx) / det;
      if (La < 2 || La > 4.5 || Lb < 2 || Lb > 4.5) continue;
      L.push(La, Lb);
      const pts = [[0, 0]]; for (let i = 0; i < n - 1; i++) pts.push([pts[i][0] + L[i] * u[i][0], pts[i][1] + L[i] * u[i][1]]);
      return pts;
    }
    return null;
  }
  // true when two labels of the figure would overlap or leave the picture (the generator then draws new numbers)
  const crowded = svg => { const T = Array.from(svg.children).filter(c => c.tagName === "text").map(c => ({ x: +c.getAttribute("x"), y: +c.getAttribute("y"), w: c.textContent.length * 7 + 4 }));
    return T.some((a, i) => a.x < 8 || a.x > 272 || a.y < 10 || a.y > 196 || T.slice(i + 1).some(b => Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < 14)); };
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. all diagonals, the picture shows only the ones from one vertex
    { tip: "qapali", gen: () => again(() => {
      const n = pick([6, 7, 8, 9, 10]), D = n * (n - 3) / 2, { P, names } = ngon(n);
      const w = [n * (n - 3), n * (n - 1) / 2, n - 3, n - 2];
      return mc(ae(D, w), { text: `Şəkildə qabarıq ${nm(n)} və onun A təpəsindən çəkilmiş diaqonallar göstərilib. Çoxbucaqlının bütün diaqonallarının sayını tapın.`,
        svg: figure(P, { poly: names, names, segs: names.slice(2, n - 1).map(k => [names[0], k, "acc"]), aria: "Çoxbucaqlı və bir təpədən çəkilmiş diaqonallar" }),
        solution: `Hər təpədən ${n} − 3 = ${n - 3} diaqonal çıxır, ${n} təpə var, hər diaqonal iki dəfə sayılır: ${n} · ${n - 3} / 2 = ${D}. Tələlər: 2-yə bölməmək (${n * (n - 3)}), tərəfləri də saymaq (${n * (n - 1) / 2}), yalnız şəkildəki diaqonalları saymaq (${n - 3}).` });
    }) },
    // 2. the last angle of a convex polygon from the angles in the picture
    { tip: "qapali", gen: () => again(() => {
      const n = pick([5, 5, 6, 6, 8]), S = (n - 2) * 180, known = Array.from({ length: n - 1 }, () => pick(range(85, 160, 5)));
      const sum = known.reduce((p, q) => p + q, 0), x = S - sum; if (x < 60 || x > 165) return null;
      const u = rnd(0, n - 1), ang = known.slice(); ang.splice(u, 0, x);
      const pts = polyExt(ang.map(a => 180 - a)); if (!pts) return null;
      const P = {}, names = []; pts.forEach((p, i) => { P[LET[i]] = p; names.push(LET[i]); });
      const arcs = names.map((k, i) => [k, names[(i + 1) % n], names[(i + n - 1) % n], i === u ? "x" : dg(ang[i])]);
      const w = [n * 180 - sum, 180 - x, S / n, (n - 1) * 180 - sum];
      const svg = figure(P, { poly: names, arcs, aria: "Qabarıq çoxbucaqlı və bucaqları" }); if (crowded(svg)) return null;
      return mc(ae(x, w, dg), { text: `Şəkildə qabarıq ${nm(n)} verilib, ${n - 1} bucağı göstərilib. ${names[u]} təpəsindəki x bucağını tapın.`, svg,
        solution: `Daxili bucaqların cəmi (${n} − 2) · 180° = ${S}°. Göstərilən bucaqların cəmi ${sum}°. x = ${S}° − ${sum}° = ${x}°. Tələlər: n · 180° götürmək (${n * 180 - sum}°), xarici bucağı tapmaq (${180 - x}°), bucaqların hamısını bərabər saymaq (${S / n}°).` });
    }) },
    // 3. regular polygon from its interior angle → all diagonals
    { tip: "qapali", gen: () => again(() => {
      const n = pick([5, 6, 8, 9, 10, 12, 15, 18, 20]), e = 360 / n, a = 180 - e, D = n * (n - 3) / 2;
      const w = [n * (n - 3), n - 3, n * (n - 1) / 2, n];
      return mc(ae(D, w), { text: `Düzgün çoxbucaqlının daxili bucağı ${a}°-dir. Onun bütün diaqonallarının sayını tapın.`,
        solution: `Xarici bucaq 180° − ${a}° = ${e}°. Tərəflərin sayı n = 360° : ${e}° = ${n}. Diaqonallar: ${n} · ${n - 3} / 2 = ${D}. Tələlər: tərəflərin sayını (${n}) cavab yazmaq, 2-yə bölməmək (${n * (n - 3)}), bir təpədən çıxanları (${n - 3}) saymaq.` });
    }) },
    // 4. R from r: the circles of a regular triangle / square
    { tip: "qapali", gen: () => again(() => {
      const tri = Math.random() < .5, r = rnd(2, 12), n = tri ? 3 : 4, R0 = tri ? 2 * r : r * Math.SQRT2, { P, names } = ngonR(n, R0, tri ? Math.PI / 2 : Math.PI / 4);
      P.M = [(P.A[0] + P.B[0]) / 2, (P.A[1] + P.B[1]) / 2];
      const svg = figure(P, { poly: names, names, circles: [["O", R0, "bg"], ["O", r, "line"]], segs: [["O", "M", "acc"]], right: [["M", "O", "A"]], dots: ["O"], cen: "O", lab: { OM: "r = " + r }, aria: "Çoxbucaqlı, xaricə və daxilə çəkilmiş çevrələr" });
      const Rs = tri ? String(2 * r) : rt(2 * r * r);
      const w = tri ? [frac(r, 2), String(3 * r), rt(12 * r * r), rt(3 * r * r)] : [String(r), String(2 * r), rtF(2 * r * r, 2), rt(8 * r * r)];
      return mc(ae(Rs, w, x => x), { text: `Şəkildə düzgün ${tri ? "üçbucağa" : "kvadrata"} daxilən çəkilmiş çevrənin radiusu r = ${r}. ${tri ? "Üçbucağa" : "Kvadrata"} xaricdən çəkilmiş çevrənin R radiusunu tapın.`, svg,
        solution: tri ? `Düzgün üçbucaqda mərkəz hündürlüyü 2 : 1 bölür, ona görə R = 2r = ${2 * r}. Tələlər: R-i r/2 götürmək (${frac(r, 2)}), hündürlüyü cavab yazmaq (3r = ${3 * r}), tərəfi cavab yazmaq (2r√3 = ${rt(12 * r * r)}).`
          : `Kvadratın tərəfi a = 2r = ${2 * r}. Xaricə çəkilmiş çevrənin diametri diaqonaldır: R = a√2/2 = ${2 * r}√2/2 = ${rt(2 * r * r)}. Tələlər: R = a/2 = ${r} (bu r-dir), tərəfi (${2 * r}) cavab yazmaq, diaqonalı (2R = ${rt(8 * r * r)}) cavab yazmaq.` });
    }) },
    // 5. short diagonal of a regular hexagon
    { tip: "qapali", gen: () => again(() => {
      const a = rnd(2, 12), { P, names } = ngonR(6, a, Math.PI / 6);
      const w = [String(a), String(2 * a), rt(2 * a * a), rtF(3 * a * a, 2)];
      return mc(ae(rt(3 * a * a), w, x => x), { text: `Şəkildə tərəfi ${a} sm olan düzgün altıbucaqlı ABCDEF verilib. AC diaqonalının uzunluğunu (sm) tapın.`,
        svg: figure(P, { poly: names, names, segs: [["A", "C", "acc"]], lab: { AB: a + " sm" }, cen: "O", aria: "Düzgün altıbucaqlı və AC diaqonalı" }),
        solution: `ABC üçbucağında AB = BC = ${a}, ∠B = 120°. B-dən AC-yə hündürlük çəksək, AC-nin yarısı ${a} · sin 60° = ${a}√3/2 olar, AC = ${rt(3 * a * a)}. Tələlər: AC = ${a} (tərəf), AC = ${2 * a} (bu AD-dir, ən uzun diaqonal), ${rt(2 * a * a)} (kvadratdakı kimi), ${rtF(3 * a * a, 2)} (bu r-dir).` });
    }) },
    // 6. diagonals = k · sides → interior angle sum
    { tip: "qapali", gen: () => again(() => {
      const k = rnd(2, 8), n = 2 * k + 3, S = (n - 2) * 180, n2 = k + 3;
      const w = [n * 180, (n2 - 2) * 180, (n - 2) * 360, (n - 1) * 180];
      return mc(ae(S, w, dg), { text: `Qabarıq çoxbucaqlının diaqonallarının sayı tərəflərinin sayından ${k} dəfə çoxdur. Onun daxili bucaqlarının cəmini tapın.`,
        solution: `n(n − 3)/2 = ${k}n → (n − 3)/2 = ${k} → n = ${n}. Cəm (${n} − 2) · 180° = ${S}°. Tələlər: 2-yə bölməyi unutmaq (n − 3 = ${k} → n = ${n2}, cəm ${(n2 - 2) * 180}°), n · 180° götürmək (${n * 180}°).` });
    }) },
    // 7. coded: interior angle from exterior ones in the picture
    { tip: "kod", gen: () => again(() => {
      const n = pick([4, 5, 5, 6]), known = Array.from({ length: n - 1 }, () => pick(range(50, 110, 5)));
      const s = known.reduce((p, q) => p + q, 0), e = 360 - s; if (e < 40 || e > 130) return null;
      const u = rnd(0, n - 1), ext = known.slice(); ext.splice(u, 0, e);
      const pts = polyExt(ext); if (!pts) return null;
      const P = {}, names = [], segs = [], arcs = []; pts.forEach((p, i) => { P[LET[i]] = p; names.push(LET[i]); });
      names.forEach((k, i) => { if (i === u) return; const pr = pts[(i + n - 1) % n], c = pts[i], d = [c[0] - pr[0], c[1] - pr[1]], L = Math.hypot(...d), X = "X" + i;
        P[X] = [c[0] + d[0] / L * 1.1, c[1] + d[1] / L * 1.1]; segs.push([k, X, "dash"]); arcs.push([k, X, names[(i + 1) % n], dg(ext[i]), 20]); });
      const svg = figure(P, { poly: names, segs, arcs, aria: "Qabarıq çoxbucaqlı və xarici bucaqlar" }); if (crowded(svg)) return null;
      return { text: `Şəkildə qabarıq ${nm(n)} verilib, ${names[u]} təpəsindən başqa bütün təpələrdə xarici bucaqlar göstərilib. ${names[u]} təpəsindəki daxili bucağı (dərəcə ilə) tapın.`,
        svg,
        answer: 180 - e, show: String(180 - e), tol: 1e-6, unit: "°",
        solution: `Xarici bucaqların cəmi 360°-dir. ${names[u]} təpəsində xarici bucaq 360° − ${s}° = ${e}°. Daxili bucaq 180° − ${e}° = ${180 - e}°.` };
    }) },
    // 8. coded: perimeter of a regular triangle / square / hexagon from a circle radius in the picture
    { tip: "kod", gen: () => again(() => {
      const kind = pick(["tri", "sq", "hex"]), m = rnd(2, 9), n = { tri: 3, sq: 4, hex: 6 }[kind];
      const a = { tri: 3 * m, sq: 2 * m, hex: 2 * m }[kind], R0 = { tri: m * Math.sqrt(3), sq: m * Math.SQRT2, hex: 2 * m }[kind], r0 = a / (2 * Math.tan(Math.PI / n));
      const { P, names } = ngonR(n, R0, kind === "sq" ? Math.PI / 4 : Math.PI / 2);
      P.M = [(P.A[0] + P.B[0]) / 2, (P.A[1] + P.B[1]) / 2];
      const useR = kind !== "hex", given = useR ? `R = ${m}${kind === "tri" ? "√3" : "√2"}` : `r = ${m}√3`;
      const svg = useR ? figure(P, { poly: names, names, circles: [["O", R0, "bg"]], segs: [["O", "A", "acc"]], dots: ["O"], cen: "O", lab: { OA: given }, aria: "Düzgün çoxbucaqlı və xaricə çəkilmiş çevrə" })
        : figure(P, { poly: names, names, circles: [["O", r0, "line"]], segs: [["O", "M", "acc"]], right: [["M", "O", "A"]], dots: ["O"], cen: "O", lab: { OM: given }, aria: "Düzgün çoxbucaqlı və daxilə çəkilmiş çevrə" });
      const nmz = { tri: "üçbucağa", sq: "kvadrata", hex: "altıbucaqlıya" }[kind], np = { tri: "Üçbucağın", sq: "Kvadratın", hex: "Altıbucaqlının" }[kind];
      return { text: `Şəkildə düzgün ${nmz} ${useR ? "xaricdən" : "daxilən"} çəkilmiş çevrənin ${useR ? "R" : "r"} radiusu ${given.slice(4)} sm-dir. ${np} perimetrini (sm) tapın.`, svg,
        answer: n * a, show: String(n * a), tol: 1e-6, unit: "sm",
        solution: { tri: `R = a√3/3 → a = R√3 = ${m}√3 · √3 = ${3 * m}. P = 3a = ${9 * m}.`, sq: `R = a√2/2 → a = R√2 = ${m}√2 · √2 = ${2 * m}. P = 4a = ${8 * m}.`, hex: `r = a√3/2 → a = 2r/√3 = 2 · ${m}√3/√3 = ${2 * m}. P = 6a = ${12 * m}.` }[kind] };
    }) },
    // 9. coded: regular polygon from a condition on its angles → all diagonals
    { tip: "kod", gen: () => again(() => {
      const form = pick(["k", "k", "ferq", "cem"]); let n, text, why;
      if (form === "k") { const k = pick([2, 3, 4, 5, 8, 9]), e = 180 / (k + 1); n = 360 / e;
        text = `Düzgün çoxbucaqlının daxili bucağı xarici bucağından ${k} dəfə böyükdür.`;
        why = `Daxili + xarici = 180°: ${k}x + x = 180° → x = ${e}° (xarici). n = 360° : ${e}° = ${n}.`; }
      else if (form === "ferq") { const e = pick([18, 20, 24, 30, 36, 40, 45, 60, 72]), d = 180 - 2 * e; n = 360 / e;
        text = `Düzgün çoxbucaqlının daxili bucağı xarici bucağından ${d}° böyükdür.`;
        why = `Daxili + xarici = 180°, daxili − xarici = ${d}° → xarici = (180° − ${d}°) : 2 = ${e}°. n = 360° : ${e}° = ${n}.`; }
      else { n = rnd(7, 20); text = `Qabarıq çoxbucaqlının daxili bucaqlarının cəmi ${(n - 2) * 180}°-dir.`; why = `(n − 2) · 180° = ${(n - 2) * 180}° → n − 2 = ${n - 2} → n = ${n}.`; }
      const D = n * (n - 3) / 2;
      return { text: text + " Onun diaqonallarının sayını tapın.", answer: D, show: String(D), tol: 1e-6,
        solution: why + ` Diaqonallar: ${n} · ${n - 3} / 2 = ${D}.` };
    }) },
    // 10. written: the ring between the circles of a regular hexagon (the answer is k in kπ — the game does not take π)
    { tip: "yazili", gen: () => again(() => {
      const a = pick(range(4, 30, 2)), k = a * a / 4, { P, names } = ngonR(6, a), r = a * Math.sqrt(3) / 2, byR = Math.random() < .4;
      return { text: `${byR ? `Düzgün altıbucaqlıya xaricdən çəkilmiş çevrənin radiusu ${a} sm-dir.` : `Düzgün altıbucaqlının perimetri ${6 * a} sm-dir.`} Ona xaricdən və daxilən çevrələr çəkilib. Çevrələr arasındakı halqanın sahəsi kπ sm²-dir. k-nı tapın.`,
        svg: figure(P, { poly: names, names, circles: [["O", a, "bg"], ["O", r, "line"]], dots: ["O"], cen: "O", aria: "Düzgün altıbucaqlı, xaricə və daxilə çəkilmiş çevrələr" }),
        answer: k, show: String(k), tol: 1e-6,
        solution: `1) Tərəf: ${byR ? `düzgün altıbucaqlıda a = R = ${a} sm` : `a = ${6 * a} : 6 = ${a} sm`}. 2) Xaricə çəkilmiş çevrənin radiusu R = a = ${a}; daxilə çəkilmiş r = a√3/2, r² = 3a²/4 = ${3 * a * a / 4}. 3) Halqanın sahəsi π(R² − r²) = π(${a * a} − ${3 * a * a / 4}) = ${k}π. Cavab: k = ${k}. Həll yazılmadan yalnız cavab — bal verilmir.` };
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
      key: "coxbucaqlilar", title: "Çoxbucaqlılar, bucaqların cəmi, düzgün çoxbucaqlılar", fenn: "riyaziyyat", link: "dersler/coxbucaqlilar.html",
      format: "Cavab — ədəd: bucaq (dərəcə, ° yazmaq lazım deyil), tərəflərin və ya diaqonalların sayı, radius. Kök: 2√3, 5√3/2; kəsr: 3/2.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["diaqonal", "diaqonal", "cem", "cem", "xarici", "duzgun", "duzgun", "cevreler", "cevreler", "heyat"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/coxbucaqlilar.html")) b.push("dersler/coxbucaqlilar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
