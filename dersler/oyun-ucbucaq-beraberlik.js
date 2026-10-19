// Üçbucaqlar, konqruyentlik əlamətləri — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const range = (a, b, s = 1) => { const r = []; for (let x = a; x <= b; x += s) r.push(x); return r; };
  const rad = d => d * Math.PI / 180;
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const deg = { unit: "°", tol: 0.01 };
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
  // random triangle angles (all ≥ min), multiples of 5
  const angles3 = (min = 30) => { let a, b; do { a = rnd(min / 5, 24) * 5; b = rnd(min / 5, 24) * 5; } while (180 - a - b < min); return [a, b, 180 - a - b]; };

  // ---- congruence criteria
  const CRIT = ["TBT (iki tərəf və onlar arasındakı bucaq)", "BTB (tərəf və ona bitişik iki bucaq)", "TTT (üç tərəf)", "Bu məlumatla konqruyentlik isbat olunmur"];
  const sideNm = (p, q) => [p, q].sort().join("");

  const levels = [
    { id: "cem", ad: "Bucaqların cəmi", izah: "Üçbucağın daxili bucaqlarının cəmi 180°-dir. Düzbucaqlı üçbucaqda iki iti bucağın cəmi 90°.",
      gen() {
        const kind = pick(["iki", "iki", "nisbet", "ifade", "duz"]);
        if (kind === "iki") {
          const [a, b, c] = angles3(25), ask = pick(ABC), val = { A: a, B: b, C: c }, kn = ABC.filter(x => x !== ask);
          return { text: `ABC üçbucağında ∠${kn[0]} = ${val[kn[0]]}°, ∠${kn[1]} = ${val[kn[1]]}°. ∠${ask} neçə dərəcədir?`,
            svg: figure(tri(a, b), { polys: [ABC], names: ABC, arcs: [[...ARC[kn[0]], val[kn[0]] + "°"], [...ARC[kn[1]], val[kn[1]] + "°"], [...ARC[ask], "?"]] }),
            answer: val[ask], show: val[ask] + "°", ...deg,
            solution: `∠${ask} = 180° − (${val[kn[0]]}° + ${val[kn[1]]}°) = 180° − ${val[kn[0]] + val[kn[1]]}° = ${val[ask]}°.` };
        }
        if (kind === "nisbet") {
          let k, m, n; do { [k, m, n] = [rnd(1, 9), rnd(1, 9), rnd(1, 9)]; } while (180 % (k + m + n) || k === m && m === n);
          const u = 180 / (k + m + n), big = Math.random() < .5, ans = (big ? Math.max(k, m, n) : Math.min(k, m, n)) * u;
          return { text: `Üçbucağın bucaqları ${k} : ${m} : ${n} nisbətindədir. Ən ${big ? "böyük" : "kiçik"} bucağı tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Bucaqların cəmi 180°. Bir hissə = 180° : ${k + m + n} = ${u}°. Bucaqlar ${k * u}°, ${m * u}°, ${n * u}°.` };
        }
        if (kind === "ifade") {
          let d, k, x; do { d = pick(range(-40, 60, 10).filter(v => v)); k = rnd(2, 4); x = (180 - d) / (k + 2); } while (x !== Math.round(x) || x + d < 10 || x < 10);
          const ask = pick(["A", "B", "C"]), val = { A: x, B: x + d, C: k * x };
          return { text: `ABC üçbucağında ∠B ∠A-dan ${Math.abs(d)}° ${d > 0 ? "böyük" : "kiçik"}, ∠C isə ∠A-dan ${k} dəfə böyükdür. ∠${ask} neçə dərəcədir?`, answer: val[ask], show: val[ask] + "°", ...deg,
            solution: `∠A = x olsun: ∠B = x ${d > 0 ? "+" : "−"} ${Math.abs(d)}°, ∠C = ${k}x. x + (x ${d > 0 ? "+" : "−"} ${Math.abs(d)}°) + ${k}x = 180° → ${k + 2}x = ${180 - d}° → x = ${x}°. Bucaqlar: ∠A = ${x}°, ∠B = ${x + d}°, ∠C = ${k * x}°.` };
        }
        const a = rnd(15, 75);
        return { text: `ABC üçbucağında ∠C = 90°, ∠A = ${a}°. ∠B neçə dərəcədir?`,
          svg: figure({ A: [0, 0], C: [Math.cos(rad(a)), 0], B: [Math.cos(rad(a)), Math.sin(rad(a))] }, { polys: [ABC], names: ABC, right: [["C", "A", "B"]], arcs: [["A", "C", "B", a + "°"], ["B", "A", "C", "?"]] }),
          answer: 90 - a, show: (90 - a) + "°", ...deg,
          solution: `Düzbucaqlı üçbucaqda iti bucaqların cəmi 90°: ∠B = 90° − ${a}° = ${90 - a}°.` };
      } },

    { id: "xarici", ad: "Xarici bucaq", izah: "Xarici bucaq ona qonşu olmayan iki daxili bucağın cəminə bərabərdir. Hər təpədə bir xarici bucaq götürsək, cəmi 360°.",
      gen() {
        const kind = pick(["tap", "tap", "daxili", "nisbet", "cem360"]);
        const [a, b, c] = angles3(30), ext = a + b;
        const P = tri(a, b); const ex = 0.6; P.D = [P.C[0] + (P.C[0] - P.B[0]) * ex, P.C[1] + (P.C[1] - P.B[1]) * ex];
        if (kind === "tap") return { text: `ABC üçbucağında ∠A = ${a}°, ∠B = ${b}°. BC tərəfinin C-dən o yana uzantısında D nöqtəsi götürülüb. ∠ACD neçə dərəcədir?`,
          svg: figure(P, { polys: [ABC], segs: [["C", "D"]], names: ["A", "B", "C", "D"], place: { C: [["A", "D"], -1] }, arcs: [[...ARC.A, a + "°"], [...ARC.B, b + "°"], ["C", "D", "A", "?", 16]] }),
          answer: ext, show: ext + "°", ...deg,
          solution: `∠ACD — C təpəsindəki xarici bucaqdır. O, qonşu olmayan iki daxili bucağın cəminə bərabərdir: ${a}° + ${b}° = ${ext}°. (Yoxla: ∠ACB = ${c}°, 180° − ${c}° = ${ext}°.)` };
        if (kind === "daxili") return { text: `ABC üçbucağının C təpəsindəki xarici bucağı ${ext}°, ∠A = ${a}°. ∠B neçə dərəcədir?`,
          svg: figure(P, { polys: [ABC], segs: [["C", "D"]], names: ["A", "B", "C", "D"], place: { C: [["A", "D"], -1] }, arcs: [[...ARC.A, a + "°"], [...ARC.B, "?"], ["C", "D", "A", ext + "°", 16]] }),
          answer: b, show: b + "°", ...deg,
          solution: `Xarici bucaq = ∠A + ∠B → ∠B = ${ext}° − ${a}° = ${b}°.` };
        if (kind === "nisbet") {
          const [k, m] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5], [3, 5], [4, 5]]), u = rnd(Math.ceil(30 / (k + m)), Math.floor(170 / (k + m))), E = (k + m) * u, big = Math.random() < .5, ans = big ? m * u : k * u;
          return { text: `Üçbucağın xarici bucağı ${E}°-dir. Ona qonşu olmayan daxili bucaqlar ${k} : ${m} nisbətindədir. Bu iki bucaqdan ${big ? "böyüyünü" : "kiçiyini"} tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Xarici bucaq qonşu olmayan iki daxili bucağın cəminə bərabərdir: onların cəmi ${E}°. Bir hissə = ${E}° : ${k + m} = ${u}°. Bucaqlar ${k * u}° və ${m * u}°.` };
        }
        const e1 = 180 - a, e2 = 180 - b;
        return { text: `Üçbucağın iki təpəsindəki xarici bucaqlar ${e1}° və ${e2}°-dir. Üçüncü təpədəki xarici bucağı tap.`, answer: 180 - c, show: (180 - c) + "°", ...deg,
          solution: `Hər təpədə bir xarici bucaq götürsək, onların cəmi 360°-dir: 360° − ${e1}° − ${e2}° = ${180 - c}°. (Və ya: daxili bucaqlar ${a}°, ${b}°, deməli üçüncü ${c}°, xarici 180° − ${c}° = ${180 - c}°.)` };
      } },

    { id: "elamet", ad: "Konqruyentlik əlaməti", izah: "Üç əlamət: TBT (iki tərəf və aralarındakı bucaq), BTB (tərəf və ona bitişik iki bucaq), TTT (üç tərəf). Üç bucaq və ya bucağı arada olmayan iki tərəf kifayət etmir.",
      gen() {
        const kind = pick(["TBT", "TBT", "BTB", "BTB", "TTT", "TTB", "BBB"]);
        const T2 = pick(["KLM", "DEF", "MNP", "PQR"]), MAP = { A: T2[0], B: T2[1], C: T2[2] };
        const sideNm2 = (p, q) => [MAP[p], MAP[q]].sort((x, y) => T2.indexOf(x) - T2.indexOf(y)).join("");
        const [a, b] = angles3(35), P = tri(a, b);
        // copy KLM: rotate and maybe mirror, then shift to the right
        const ph = rad(rnd(0, 11) * 30), mir = Math.random() < .5 ? -1 : 1;
        const cx = (P.A[0] + P.B[0] + P.C[0]) / 3, cy = (P.A[1] + P.B[1] + P.C[1]) / 3;
        for (const k of ABC) { const x = (P[k][0] - cx) * mir, y = P[k][1] - cy; P[MAP[k]] = [2.0 + x * Math.cos(ph) - y * Math.sin(ph), x * Math.sin(ph) + y * Math.cos(ph)]; }
        for (const k of ABC) P[k] = [P[k][0] - cx, P[k][1] - cy];
        const order = pick([["A", "B", "C"], ["B", "C", "A"], ["C", "A", "B"]]);
        const [v, x, y] = order;
        const ticks = [], arcs = [], eq = [];
        const side = (p, q, n) => { ticks.push([p, q, n], [MAP[p], MAP[q], n]); eq.push(`${sideNm(p, q)} = ${sideNm2(p, q)}`); };
        const ang = (p, n) => { arcs.push([...ARC[p], "", 13, n], [...ARC[p].map(k => MAP[k]), "", 13, n]); eq.push(`∠${p} = ∠${MAP[p]}`); };
        let correct;
        if (kind === "TBT") { side(v, x, 1); ang(v, 1); side(v, y, 2); correct = 0; }
        else if (kind === "BTB") { ang(x, 1); side(x, y, 1); ang(y, 2); correct = 1; }
        else if (kind === "TTT") { side(v, x, 1); side(x, y, 2); side(y, v, 3); correct = 2; }
        else if (kind === "TTB") { side(v, x, 1); side(x, y, 2); ang(v, 1); correct = 3; }
        else { ang(v, 1); ang(x, 2); ang(y, 3); correct = 3; }
        const why = [
          `${eq.join(", ")}: iki tərəf və onların arasındakı bucaq (∠${v} həm ${sideNm(v, x)}, həm ${sideNm(v, y)} tərəfinə bitişikdir). Birinci əlamət — TBT.`,
          `${eq.join(", ")}: ${sideNm(x, y)} tərəfi və ona bitişik iki bucaq (∠${x}, ∠${y}). İkinci əlamət — BTB.`,
          `${eq.join(", ")}: üç tərəf uyğun olaraq bərabərdir. Üçüncü əlamət — TTT.`,
          kind === "TTB" ? `${eq.join(", ")}: bərabər bucaq ∠${v} bərabər tərəflərin arasında deyil (o, ${sideNm(x, y)} tərəfinə bitişik deyil). Belə iki tərəf və bucaq konqruyentliyə zəmanət vermir.`
            : `${eq.join(", ")}: yalnız bucaqlar bərabərdir. Eyni formalı, amma müxtəlif ölçülü üçbucaqlar ola bilər — konqruyentlik isbat olunmur.`][correct];
        return { text: `ABC və ${T2} üçbucaqlarında ${eq.join(", ")} (şəkildə bərabər elementlər eyni işarə ilə göstərilib). Konqruyentlik hansı əlamətlə isbat olunur?`,
          svg: figure(P, { polys: [ABC, T2.split("")], names: [...ABC, ...T2.split("")], ticks, arcs, rot: [0, 180], noflip: true, aria: "ABC və " + T2 + " üçbucaqları, bərabər elementlər işarələnib" }),
          choices: CRIT, correct, show: CRIT[correct], solution: why };
      } },

    { id: "uygun", ad: "Konqruyent üçbucaqların elementləri", izah: "Konqruyent üçbucaqlarda uyğun tərəflər və uyğun bucaqlar bərabərdir. △ABC ≅ △KLM yazılışında hərflərin sırası uyğunluğu göstərir: A↔K, B↔L, C↔M.",
      gen() {
        const kind = pick(["yazilis", "yazilis", "kesisme", "kesisme", "tenbolen"]);
        if (kind === "yazilis") {
          const perm = pick([["K", "L", "M"], ["L", "M", "K"], ["M", "K", "L"], ["K", "M", "L"], ["L", "K", "M"], ["M", "L", "K"]]), mp = { A: perm[0], B: perm[1], C: perm[2] };
          const [a, b, c] = angles3(30), ang = { A: a, B: b, C: c }, sd = { AB: rnd(4, 15), BC: rnd(4, 15) };
          while (sd.AB === sd.BC) sd.BC = rnd(4, 15);
          const sub = pick(["teref", "bucaq", "bucaq"]);
          const nm2 = (p, q) => [mp[p], mp[q]].sort().join("");
          if (sub === "teref") {
            const which = pick(["AB", "BC"]);
            return { text: `△ABC ≅ △${perm.join("")}. AB = ${sd.AB}, BC = ${sd.BC}. ${nm2(which[0], which[1])} tərəfinin uzunluğunu tap.`, answer: sd[which], show: String(sd[which]), tol: 0.01,
              solution: `Yazılışda hərflərin sırası: A↔${mp.A}, B↔${mp.B}, C↔${mp.C}. ${nm2(which[0], which[1])} tərəfi ${which}-yə uyğundur: ${sd[which]}.` };
          }
          const kn = pick([["A", "B"], ["A", "C"], ["B", "C"]]), ask = ABC.find(x => !kn.includes(x));
          return { text: `△ABC ≅ △${perm.join("")}. ∠${kn[0]} = ${ang[kn[0]]}°, ∠${kn[1]} = ${ang[kn[1]]}°. ∠${mp[ask]} neçə dərəcədir?`, answer: ang[ask], show: ang[ask] + "°", ...deg,
            solution: `Uyğunluq: A↔${mp.A}, B↔${mp.B}, C↔${mp.C}. ∠${mp[ask]} = ∠${ask} = 180° − ${ang[kn[0]]}° − ${ang[kn[1]]}° = ${ang[ask]}°.` };
        }
        if (kind === "kesisme") {
          let p, q, r, s2; do { p = rnd(15, 30) / 10; q = rnd(3, 12) / 10; r = rnd(10, 25) / 10; s2 = rnd(5, 15) / 10; } while (Math.abs(p * s2 - q * r) < .8);
          const P = { O: [0, 0], A: [-p, q], B: [p, -q], C: [-r, -s2], D: [r, s2] };
          const sub = pick(["teref", "bucaq"]);
          const base = { polys: [["A", "O", "C"], ["B", "O", "D"]], segs: [["A", "B"], ["C", "D"]], names: ["A", "B", "C", "D", "O"], place: { O: [["A", "C"], -1] }, ticks: [["A", "O", 1], ["O", "B", 1], ["C", "O", 2], ["O", "D", 2]] };
          if (sub === "teref") {
            const ac = rnd(4, 20);
            return { text: `AB və CD parçaları O nöqtəsində kəsişir, AO = OB, CO = OD. AC = ${ac}. BD-ni tap.`, svg: figure(P, { ...base, lab: { AC: String(ac), BD: "?" } }), answer: ac, show: String(ac), tol: 0.01,
              solution: `△AOC və △BOD-də: AO = OB, CO = OD, ∠AOC = ∠BOD (qarşılıqlı bucaqlar). TBT əlamətinə görə △AOC ≅ △BOD, deməli BD = AC = ${ac}.` };
          }
          const x = rnd(25, 75), o = rnd(35, 150 - x), ans = 180 - x - o;
          return { text: `AB və CD parçaları O nöqtəsində kəsişir, AO = OB, CO = OD. ∠OAC = ${x}°, ∠AOC = ${o}°. ∠ODB neçə dərəcədir?`, svg: figure(P, { ...base, arcs: [["A", "O", "C", x + "°", 16], ["D", "B", "O", "?", 16]] }), answer: ans, show: ans + "°", ...deg,
            solution: `TBT əlamətinə görə △AOC ≅ △BOD (AO = OB, CO = OD, ∠AOC = ∠BOD — qarşılıqlı). C ilə D uyğundur: ∠ODB = ∠OCA = 180° − ${x}° − ${o}° = ${ans}°.` };
        }
        const be = pick(range(30, 140, 10)), half = rnd(3, 15), al = (180 - be) / 2;
        const P = { B: [0, Math.cos(rad(be / 2))], A: [-Math.sin(rad(be / 2)), 0], C: [Math.sin(rad(be / 2)), 0], D: [0, 0] };
        const sub = pick(["AC", "bucaq"]);
        if (sub === "AC") return { text: `ABC üçbucağında AB = BC. ∠ABC-nin tənböləni AC tərəfini D nöqtəsində kəsir, AD = ${half}. AC-ni tap.`,
          svg: figure(P, { polys: [ABC], segs: [["B", "D", "acc"]], names: ["A", "B", "C", "D"], ticks: [["A", "B", 1], ["B", "C", 1]], arcs: [["B", "A", "D", "", 20], ["B", "D", "C", "", 24]], lab: { AD: String(half) } }),
          answer: 2 * half, show: String(2 * half), tol: 0.01,
          solution: `△ABD və △CBD-də: AB = CB, ∠ABD = ∠CBD (tənbölən), BD — ortaq tərəf. TBT: △ABD ≅ △CBD, deməli DC = AD = ${half}. AC = ${half} + ${half} = ${2 * half}.` };
        return { text: `ABC üçbucağında AB = BC, ∠ABC = ${be}°. ∠ABC-nin tənböləni AC-ni D nöqtəsində kəsir. ∠BAD neçə dərəcədir?`,
          svg: figure(P, { polys: [ABC], segs: [["B", "D", "acc"]], names: ["A", "B", "C", "D"], ticks: [["A", "B", 1], ["B", "C", 1]], arcs: [["B", "A", "C", be + "°", 16], ["A", "C", "B", "?"]] }),
          answer: al, show: al + "°", ...deg,
          solution: `TBT: △ABD ≅ △CBD (AB = CB, ∠ABD = ∠CBD, BD ortaq), deməli ∠A = ∠C. Onların cəmi 180° − ${be}° = ${180 - be}°, ∠BAD = ${180 - be}° : 2 = ${al}°.` };
      } },

    { id: "beraberyanli", ad: "Bərabəryanlı üçbucaq", izah: "Oturacaq bucaqları bərabərdir. Oturacağa çəkilmiş median həm tənbölən, həm hündürlükdür. Bərabərtərəfli üçbucağın bütün bucaqları 60°.",
      gen() {
        const kind = pick(["tepe", "oturacaq", "xarici", "kor", "perimetr", "perimetr", "median", "duzgun"]);
        const isoFig = (v, arcs, extra = {}) => { const s = Math.sin(rad(v / 2)), c = Math.cos(rad(v / 2)); return figure({ B: [0, c], A: [-s, 0], C: [s, 0], D: [0, 0] }, { polys: [ABC], names: extra.names || ABC, ticks: [["A", "B", 1], ["B", "C", 1]], arcs, ...extra }); };
        if (kind === "tepe") {
          const v = pick(range(30, 150, 2)), ans = (180 - v) / 2;
          return { text: `ABC bərabəryanlı üçbucağında AB = BC, ∠B = ${v}°. ∠A neçə dərəcədir?`, svg: isoFig(v, [[...ARC.B, v + "°"], [...ARC.A, "?"]]), answer: ans, show: ans + "°", ...deg,
            solution: `Oturacaq bucaqları bərabərdir: ∠A = ∠C = (180° − ${v}°) : 2 = ${ans}°.` };
        }
        if (kind === "oturacaq") {
          const b = rnd(30, 80), ans = 180 - 2 * b;
          return { text: `ABC bərabəryanlı üçbucağında AB = BC, ∠A = ${b}°. ∠B neçə dərəcədir?`, svg: isoFig(ans, [[...ARC.A, b + "°"], [...ARC.B, "?"]]), answer: ans, show: ans + "°", ...deg,
            solution: `∠C = ∠A = ${b}° (oturacaq bucaqları). ∠B = 180° − 2 · ${b}° = ${ans}°.` };
        }
        if (kind === "xarici") {
          if (Math.random() < .5) {
            const b = rnd(20, 85), e = 180 - b, ans = 180 - 2 * b;
            return { text: `Bərabəryanlı üçbucağın oturacağındakı xarici bucaq ${e}°-dir. Təpə bucağını tap.`, answer: ans, show: ans + "°", ...deg,
              solution: `Oturacaq bucağı = 180° − ${e}° = ${b}°. İki oturacaq bucağı bərabərdir, təpə bucağı = 180° − 2 · ${b}° = ${ans}°.` };
          }
          const e = pick(range(40, 170, 2)), ans = e / 2;
          return { text: `Bərabəryanlı üçbucağın təpəsindəki xarici bucaq ${e}°-dir. Oturacaq bucağını tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `Xarici bucaq qonşu olmayan iki daxili bucağın — iki bərabər oturacaq bucağının — cəminə bərabərdir: ${e}° : 2 = ${ans}°.` };
        }
        if (kind === "kor") {
          const x = pick(range(92, 170, 2)), ans = (180 - x) / 2;
          return { text: `Bərabəryanlı üçbucağın bir bucağı ${x}°-dir. Onun ən kiçik bucağını tap.`, answer: ans, show: ans + "°", ...deg,
            solution: `${x}° > 90°, iki belə bucaq ola bilməz (cəmi 180°-dən çox olardı). Deməli, ${x}° — təpə bucağıdır, oturacaq bucaqları (180° − ${x}°) : 2 = ${ans}°.` };
        }
        if (kind === "perimetr") {
          let a, b; do { a = rnd(3, 20); b = rnd(2, 30); } while (b >= 2 * a || a === b);
          const P = 2 * a + b, sub = pick(["yan", "oturacaq", "ferq"]);
          if (sub === "yan") return { text: `Bərabəryanlı üçbucağın perimetri ${P}, oturacağı ${b}. Yan tərəfini tap.`, answer: a, show: String(a), tol: 0.01,
            solution: `Yan tərəflər bərabərdir: 2x + ${b} = ${P} → 2x = ${P - b} → x = ${a}.` };
          if (sub === "oturacaq") return { text: `Bərabəryanlı üçbucağın perimetri ${P}, yan tərəfi ${a}. Oturacağını tap.`, answer: b, show: String(b), tol: 0.01,
            solution: `Oturacaq = ${P} − 2 · ${a} = ${b}.` };
          const d = a - b;
          return { text: `Bərabəryanlı üçbucağın perimetri ${P}. Yan tərəf oturacaqdan ${Math.abs(d)} ${d > 0 ? "uzundur" : "qısadır"}. Oturacağı tap.`, answer: b, show: String(b), tol: 0.01,
            solution: `Oturacaq x olsun, yan tərəf x ${d > 0 ? "+" : "−"} ${Math.abs(d)}. x + 2(x ${d > 0 ? "+" : "−"} ${Math.abs(d)}) = ${P} → 3x = ${P - 2 * d} → x = ${b}.` };
        }
        if (kind === "median") {
          const v = pick(range(30, 150, 2)), sub = pick(["ABD", "AD"]);
          if (sub === "ABD") return { text: `ABC üçbucağında AB = BC, BD — oturacağa çəkilmiş mediandır. ∠ABC = ${v}°. ∠ABD neçə dərəcədir?`,
            svg: isoFig(v, [[...ARC.B, v + "°", 14], ["B", "A", "D", "?", 26]], { names: ["A", "B", "C", "D"], segs: [["B", "D", "acc"]] }), answer: v / 2, show: v / 2 + "°", ...deg,
            solution: `Bərabəryanlı üçbucaqda oturacağa çəkilmiş median həm də tənböləndir: ∠ABD = ${v}° : 2 = ${v / 2}°.` };
          const ac = 2 * rnd(3, 15);
          return { text: `ABC üçbucağında AB = BC, BD — oturacağa çəkilmiş hündürlükdür, AC = ${ac}. AD-ni tap.`,
            svg: isoFig(pick(range(40, 120, 10)), [], { names: ["A", "B", "C", "D"], segs: [["B", "D", "acc"]], right: [["D", "C", "B"]] }), answer: ac / 2, show: String(ac / 2), tol: 0.01,
            solution: `Bərabəryanlı üçbucaqda oturacağa çəkilmiş hündürlük həm də mediandır: AD = DC = ${ac} : 2 = ${ac / 2}.` };
        }
        const a = rnd(2, 30), sub = pick(["P", "a", "bucaq"]);
        if (sub === "P") return { text: `Bərabərtərəfli üçbucağın tərəfi ${a}. Perimetrini tap.`, answer: 3 * a, show: String(3 * a), tol: 0.01, solution: `Bütün tərəflər bərabərdir: P = 3 · ${a} = ${3 * a}.` };
        if (sub === "a") return { text: `Bərabərtərəfli üçbucağın perimetri ${3 * a}. Tərəfini tap.`, answer: a, show: String(a), tol: 0.01, solution: `Tərəf = ${3 * a} : 3 = ${a}.` };
        const e = pick(["median", "hündürlük"]);
        return { text: `Bərabərtərəfli ABC üçbucağında BD — ${e === "median" ? "mediandır" : "hündürlükdür"}. ∠ABD neçə dərəcədir?`, answer: 30, show: "30°", ...deg,
          solution: `Bərabərtərəfli üçbucağın bütün bucaqları 60°-dir. ${e === "median" ? "Median" : "Hündürlük"} həm də tənböləndir: ∠ABD = 60° : 2 = 30°.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Konqruyent üçbucaqlarla əlçatmaz məsafəni ölçmək, dam və körpü çərçivələri — hamısı bu mövzudur.",
      gen() {
        const t = pick(["cay", "cay", "dam", "lek", "bayraq"]);
        if (t === "cay") {
          const w = rnd(15, 80), d = rnd(10, 40);
          return { text: `Çayın enini ölçmək üçün sahildə A nöqtəsi qarşı sahildəki B ağacının düz qarşısında seçildi (AB ⊥ sahil). Sahil boyunca A-dan ${d} m gedib O nöqtəsinə dirək basdılar, daha ${d} m gedib C nöqtəsində dayandılar. C-dən sahilə perpendikulyar istiqamətdə çaydan uzaqlaşdılar və D nöqtəsində dirək ilə ağac bir düz xətt üzərinə düşdü. CD = ${w} m. Çayın eni (AB) neçə metrdir?`,
            answer: w, show: w + " m", unit: "m", tol: 0.01,
            solution: `△ABO və △CDO-da: AO = OC = ${d} m, ∠A = ∠C = 90°, ∠AOB = ∠COD (qarşılıqlı). BTB əlamətinə görə üçbucaqlar konqruyentdir, deməli AB = CD = ${w} m.` };
        }
        if (t === "dam") {
          const v = pick(range(70, 150, 2)), ans = (180 - v) / 2;
          return { text: `Damın üçbucaq çərçivəsində iki maili tir bərabərdir, onlar arasındakı təpə bucağı ${v}°. Maili tir üfüqi tirlə hansı bucağı əmələ gətirir?`, answer: ans, show: ans + "°", ...deg,
            solution: `Çərçivə bərabəryanlı üçbucaqdır, oturacaq bucaqları bərabərdir: (180° − ${v}°) : 2 = ${ans}°.` };
        }
        if (t === "lek") {
          let a, b; do { a = rnd(3, 12); b = rnd(2, 15); } while (b >= 2 * a || b === a);
          const pr = pick([2, 3, 4, 5]);
          return { text: `Gül ləki bərabəryanlı üçbucaq formasındadır: yan tərəfləri ${a} m, oturacağı ${b} m. Ləkin ətrafına çəkilən hasarın 1 metri ${pr} manatdır. Hasar neçə manata başa gələr?`, answer: pr * (2 * a + b), show: String(pr * (2 * a + b)), unit: "manat", tol: 0.01,
            solution: `Perimetr = ${a} + ${a} + ${b} = ${2 * a + b} m. Qiymət = ${2 * a + b} · ${pr} = ${pr * (2 * a + b)} manat.` };
        }
        const a = rnd(25, 70);
        return { text: `Üçbucaq formalı bayrağın iki bucağı bərabərdir və hər biri ${a}°-dir. Bayrağın üçüncü bucağına qonşu olan xarici bucaq neçə dərəcədir?`, answer: 2 * a, show: 2 * a + "°", ...deg,
          solution: `Xarici bucaq qonşu olmayan iki daxili bucağın cəminə bərabərdir: ${a}° + ${a}° = ${2 * a}°. (Üçüncü bucaq ${180 - 2 * a}°, 180° − ${180 - 2 * a}° = ${2 * a}°.)` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const t = pick(["kor", "xarici", "kesisme", "nisbet"]), bad = rnd(0, 2);
        let task, st, wrong, whyS;
        if (t === "kor") {
          const x = pick(range(92, 170, 2)), b = (180 - x) / 2;
          task = `Məsələ: bərabəryanlı üçbucağın bir bucağı ${x}°. Qalan bucaqları tap.`;
          st = [`${x}° > 90°, deməli bu, təpə bucağıdır.`, `Oturacaq bucaqları bərabərdir, cəmi 180° − ${x}° = ${180 - x}°.`, `Hər biri ${180 - x}° : 2 = ${b}°.`];
          wrong = [`${x}° — oturacaq bucağıdır, ikinci oturacaq bucağı da ${x}°.`, `Oturacaq bucaqları bərabərdir, cəmi 360° − ${x}° = ${360 - x}°.`, `Hər biri ${180 - x}° : 3 = ${String(Math.round((180 - x) / 3 * 10) / 10).replace(".", ",")}°.`];
          whyS = [`1-ci addımda səhv var: iki ${x}°-lik bucaq ola bilməz — cəmləri 180°-dən çoxdur.`, `2-ci addımda səhv var: qalan iki bucağın cəmi 180° − ${x}° = ${180 - x}°-dir.`, `3-cü addımda səhv var: iki bərabər bucaq var, 2-yə bölmək lazımdır: ${b}°.`];
        } else if (t === "xarici") {
          const [a, b, c] = angles3(30);
          task = `Məsələ: ABC üçbucağında ∠A = ${a}°, ∠B = ${b}°. C təpəsindəki xarici bucağı tap.`;
          st = [`C-dəki xarici bucaq A və B-dəki daxili bucaqların cəminə bərabərdir.`, `Xarici bucaq = ${a}° + ${b}°.`, `Xarici bucaq = ${a + b}°.`];
          wrong = [`C-dəki xarici bucaq ∠C-yə bərabərdir.`, `Xarici bucaq = 180° − (${a}° + ${b}°).`, `Xarici bucaq = ${a + b + pick([10, -10])}°.`];
          whyS = [`1-ci addımda səhv var: xarici bucaq ∠C-yə qonşudur (cəmləri 180°), bərabər deyil.`, `2-ci addımda səhv var: 180° − (${a}° + ${b}°) = ${c}° — bu daxili ∠C-dir, xarici yox.`, `3-cü addımda hesab səhvdir: ${a}° + ${b}° = ${a + b}°.`];
        } else if (t === "kesisme") {
          const ac = rnd(4, 20);
          task = `Məsələ: AB və CD O nöqtəsində kəsişir, AO = OB, CO = OD, AC = ${ac}. BD-ni tap.`;
          st = [`∠AOC = ∠BOD, çünki qarşılıqlı bucaqlardır.`, `TBT əlamətinə görə △AOC ≅ △BOD.`, `Uyğun tərəflər bərabərdir: BD = AC = ${ac}.`];
          wrong = [`∠AOC = ∠BOD, çünki qonşu bucaqlardır.`, `TTT əlamətinə görə △AOC ≅ △BOD.`, `Uyğun tərəflər bərabərdir: BD = AO = ${ac}.`];
          whyS = ["1-ci addımda səhv var: ∠AOC və ∠BOD qarşılıqlı bucaqlardır (qonşu bucaqlar bərabər olmur, cəmi 180°).", "2-ci addımda səhv var: üçüncü tərəflər (AC və BD) haqqında heç nə bilmirik — iki tərəf və aralarındakı bucaq bərabərdir, bu TBT-dir.", "3-cü addımda səhv var: BD-yə uyğun tərəf AC-dir (BD O-ya qarşı durur, AC də), AO yox."];
        } else {
          let k, m, n; do { [k, m, n] = [rnd(1, 6), rnd(1, 6), rnd(1, 6)]; } while (180 % (k + m + n) || k === m || m === n || k === n);
          const u = 180 / (k + m + n), mx = Math.max(k, m, n);
          task = `Məsələ: üçbucağın bucaqları ${k} : ${m} : ${n} nisbətindədir. Ən böyük bucağı tap.`;
          st = [`Üçbucağın bucaqlarının cəmi 180°-dir.`, `Bir hissə = 180° : ${k + m + n} = ${u}°.`, `Ən böyük bucaq = ${mx} · ${u}° = ${mx * u}°.`];
          wrong = [`Üçbucağın bucaqlarının cəmi 360°-dir.`, `Bir hissə = 180° : 3 = 60°.`, `Ən böyük bucaq = ${Math.min(k, m, n)} · ${u}° = ${Math.min(k, m, n) * u}°.`];
          whyS = ["1-ci addımda səhv var: üçbucağın bucaqlarının cəmi 180°-dir (360° dördbucaqlıdadır).", `2-ci addımda səhv var: 180° hissələrin ümumi sayına (${k} + ${m} + ${n}) bölünür, 3-ə yox: ${u}°.`, `3-cü addımda səhv var: ən böyük bucaq ${mx} hissədir: ${mx * u}°.`];
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
      key: "ucbucaq-beraberlik", title: "Üçbucaqlar: konqruyentlik əlamətləri", fenn: "riyaziyyat", link: "dersler/ucbucaq-beraberlik.html",
      format: "Cavab — ədəd: bucaq dərəcə ilə (° yazmaq lazım deyil), tərəf, perimetr. Əlamət sualında variantı seç.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["cem", "cem", "xarici", "xarici", "elamet", "uygun", "uygun", "beraberyanli", "beraberyanli", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ucbucaq-beraberlik.html")) b.push("dersler/ucbucaq-beraberlik.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
