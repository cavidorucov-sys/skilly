// Toxunan və kəsənin xassələri (olimpiada) — mastery game levels and the final test.
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
  const rad = d => d * Math.PI / 180;
  const fmt = n => String(Math.round(n * 100) / 100).replace(".", ",");
  // p·√n / q in simplest form → [text, value]
  function surd(p, q, n) {
    let s = 1; for (let i = 2; i * i <= n; i++) while (n % (i * i) === 0) { n /= i * i; s *= i; }
    p *= s; const g = gcd(p, q); p /= g; q /= g;
    const str = n === 1 ? (q === 1 ? String(p) : p + "/" + q) : (p === 1 ? "" : p) + "√" + n + (q === 1 ? "" : "/" + q);
    return [str, p * Math.sqrt(n) / q];
  }
  const on = (d, R = 1, c = [0, 0]) => [c[0] + R * Math.cos(rad(d)), c[1] + R * Math.sin(rad(d))];
  const BASE = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
  function triple(maxC) {
    const opts = [];
    for (const [p, q, c] of BASE) for (let k = 1; c * k <= maxC; k++) opts.push([p * k, q * k, c * k]);
    const [p, q, c] = pick(opts);
    return Math.random() < .5 ? [p, q, c] : [q, p, c];
  }

  // ---- figure: points in math coordinates (y up); random rotation and mirror
  // o: { circ:[[center, r, "fill"|"acc"]], poly?, segs:[[p,q,"dash"|"acc"|"ink"]], lab:{PQ:text}, right:[[v,p,q]], arcs:[[v,p,q,text,r]],
  //      names?, place?:{name:[toward,"in"|"out"]}, cen?, free? (any rotation), rot? }
  const INK = "#17171a", ACC = "#534ab7", RED = "#a32d2d", SOFT = "#eeedfe";
  function figure(P, o) {
    const W = 280, H = 210, pad = 30;
    const t = o.free ? Math.random() * 2 * Math.PI : pick(o.rot || [0, 1, 2, 3]) * Math.PI / 2, flip = Math.random() < .5 ? -1 : 1;
    const Q = {};
    for (const k in P) { const x = P[k][0] * flip, y = P[k][1]; Q[k] = [x * Math.cos(t) - y * Math.sin(t), -(x * Math.sin(t) + y * Math.cos(t))]; }
    const ext = Object.values(Q).slice();
    for (const [c, rr] of o.circ || []) ext.push([Q[c][0] - rr, Q[c][1] - rr], [Q[c][0] + rr, Q[c][1] + rr]);
    const xs = ext.map(p => p[0]), ys = ext.map(p => p[1]);
    const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const s = Math.min((W - 2 * pad) / ((x1 - x0) || 1), (H - 2 * pad) / ((y1 - y0) || 1));
    const ox = (W - s * (x1 - x0)) / 2 - s * x0, oy = (H - s * (y1 - y0)) / 2 - s * y0;
    for (const k in Q) Q[k] = [ox + s * Q[k][0], oy + s * Q[k][1]];
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": o.aria || "Çevrə" });
    const circle = ([c, rr, st]) => g.append(sv("circle", { cx: Q[c][0], cy: Q[c][1], r: s * rr, fill: st === "fill" ? SOFT : "none", stroke: st === "acc" ? ACC : INK, "stroke-width": 2 }));
    (o.circ || []).filter(c => c[2] === "fill").forEach(circle);
    if (o.poly) g.append(sv("polygon", { points: o.poly.map(k => Q[k].join(",")).join(" "), fill: o.polyFill === false ? "none" : SOFT, stroke: INK, "stroke-width": 2, "stroke-linejoin": "round" }));
    (o.circ || []).filter(c => c[2] !== "fill").forEach(circle);
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
    for (const [v, p, q, tx, rr] of o.arcs || []) {
      const V = Q[v], R = rr || 18, ang = k => Math.atan2(Q[k][1] - V[1], Q[k][0] - V[0]);
      let t1 = ang(p), t2 = ang(q); if (Math.abs(t2 - t1) > Math.PI) t2 += t2 < t1 ? 2 * Math.PI : -2 * Math.PI;
      const pts = Array.from({ length: 11 }, (_, i) => { const tt = t1 + (t2 - t1) * i / 10; return (V[0] + R * Math.cos(tt)) + " " + (V[1] + R * Math.sin(tt)); });
      g.append(sv("path", { d: "M" + pts.join("L"), fill: "none", stroke: ACC, "stroke-width": 2 }));
      if (tx) { const tm = (t1 + t2) / 2; g.append(sv("text", { x: V[0] + (R + 15) * Math.cos(tm), y: V[1] + (R + 15) * Math.sin(tm) + 4, "text-anchor": "middle", class: "oy-lbl", style: "fill:" + ACC + ";font-size:12px" }, tx)); }
    }
    const named = o.names || Object.keys(P).filter(k => /^[A-Z]$/.test(k));
    const avg = ks => [0, 1].map(i => ks.reduce((t2, k) => t2 + Q[k][i], 0) / ks.length);
    const cen = o.cen ? Q[o.cen] : avg(o.poly || named);
    for (const key in o.lab || {}) {
      const v = o.lab[key], txt = Array.isArray(v) ? v[0] : v, tp = Array.isArray(v) ? v[1] : .5; // [text, position along the segment]
      const [p, q] = key.split(""), m = [Q[p][0] + (Q[q][0] - Q[p][0]) * tp, Q[p][1] + (Q[q][1] - Q[p][1]) * tp];
      const d = [Q[q][0] - Q[p][0], Q[q][1] - Q[p][1]], L = Math.hypot(...d) || 1;
      let n = [-d[1] / L, d[0] / L];
      const out = [m[0] - cen[0], m[1] - cen[1]];
      if (Math.hypot(...out) > 6 ? n[0] * out[0] + n[1] * out[1] < 0 : n[1] > 0) n = [-n[0], -n[1]];
      g.append(sv("text", { x: m[0] + n[0] * 13, y: m[1] + n[1] * 13 + 5, "text-anchor": "middle", class: "oy-lbl" }, txt));
    }
    if (o.circ) for (const k of named) g.append(sv("circle", { cx: Q[k][0], cy: Q[k][1], r: 2.6, fill: INK }));
    const unit = v => { const L = Math.hypot(...v) || 1; return [v[0] / L, v[1] / L]; };
    for (const k of named) {
      let d = [Q[k][0] - cen[0], Q[k][1] - cen[1]], L = Math.hypot(...d);
      if (L < 4) { d = [1, -1]; L = Math.SQRT2; }
      const pl = (o.place || {})[k];
      const bi = (o.bis || {})[k]; // letter on the bisector of two rays from the point
      if (bi) { const u1 = unit([Q[bi[0]][0] - Q[k][0], Q[bi[0]][1] - Q[k][1]]), u2 = unit([Q[bi[1]][0] - Q[k][0], Q[bi[1]][1] - Q[k][1]]); d = [u1[0] + u2[0], u1[1] + u2[1]]; L = Math.hypot(...d) || 1; }
      if (pl) { const tt = unit([Q[pl[0]][0] - Q[k][0], Q[pl[0]][1] - Q[k][1]]), r = unit(pl[1] === "in" ? [-d[0], -d[1]] : d); d = [tt[0] + r[0], tt[1] + r[1]]; L = Math.hypot(...d) || 1; }
      g.append(sv("text", { x: Q[k][0] + d[0] / L * 14, y: Q[k][1] + d[1] / L * 14 + 5, "text-anchor": "middle", class: "oy-lbl", style: "fill:#5f5e5a;font-style:italic" }, k));
    }
    return g;
  }
  const deg = { unit: "°", tol: 0.01 };
  const steps = (task, list) => h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...list.map(s => h("li", {}, s))));
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];

  const divisors = n => range(1, n).filter(k => n % k === 0);
  const dist = (X, Y) => Math.hypot(X[0] - Y[0], X[1] - Y[1]);

  // two chords AB, CD crossing at E: AE = a, EB = b, CE = c, ED = e (a·b = c·e)
  function chordFig(a, b, c, e, lab) {
    const dd = Math.max(Math.abs(b - a), Math.abs(e - c)) / 2 + .3 * Math.sqrt(a * b) + .5;
    const cf = (b - a) / (2 * dd), cp = (e - c) / (2 * dd), sf = Math.sqrt(1 - cf * cf), sp = -Math.sqrt(1 - cp * cp);
    const E = [dd, 0], u = [cf, sf], w = [cp, sp];
    const P = { O: [0, 0], E, A: [dd + a * u[0], a * u[1]], B: [dd - b * u[0], -b * u[1]], C: [dd + c * w[0], c * w[1]], D: [dd - e * w[0], -e * w[1]] };
    const R = Math.sqrt(a * b + dd * dd);
    return figure(P, { circ: [["O", R]], cen: "O", names: ["A", "B", "C", "D", "E"], bis: { E: ["B", "D"] }, free: true, segs: [["A", "B", "acc"], ["C", "D", "acc"]], lab });
  }
  // secants / tangent from M (same construction as the angles topic)
  function drawSec(sec, tan, lab) {
    const pw = sec[0][0] * sec[0][1], need = Math.max(...sec.map(s => (s[0] + s[1]) / 2));
    const d = need / Math.cos(rad(rnd(18, 30))), R = Math.sqrt(d * d - pw), P = { O: [0, 0], M: [d, 0] }, segs = [];
    sec.forEach(([n, f, N, F], i) => { const cf = (n + f) / (2 * d), sf = (i ? -1 : 1) * Math.sqrt(1 - cf * cf); P[N] = [d - n * cf, n * sf]; P[F] = [d - f * cf, f * sf]; segs.push(["M", F, "acc"]); });
    if (tan) { const ta = Math.acos(R / d), sgn = sec.length > 1 ? 1 : -1; P.T = [R * Math.cos(ta), sgn * R * Math.sin(ta)]; segs.push(["M", "T", "acc"]); }
    return figure(P, { circ: [["O", R]], cen: "O", names: Object.keys(P).filter(k => k !== "O"), free: true, segs, lab });
  }
  // two circles (centres O, Q; radii R, r; distance d) and their common tangent AB: kind "ext" or "int"
  function twoCircles(R, r, d, kind, lab) {
    const cs = (kind === "ext" ? (R - r) : (R + r)) / d, sn = Math.sqrt(1 - cs * cs), u = [cs, sn];
    const A = [R * u[0], R * u[1]], B = kind === "ext" ? [d + r * u[0], r * u[1]] : [d - r * u[0], -r * u[1]];
    const P = { O: [0, 0], Q: [d, 0], A, B };
    return figure(P, { circ: [["O", R], ["Q", r]], cen: kind === "ext" ? "O" : "O", names: ["O", "Q", "A", "B"], free: true, segs: [["A", "B", "acc"], ["O", "A"], ["Q", "B"], ["O", "Q", "dash"]], lab });
  }

  const levels = [
    { id: "veter", ad: "Kəsişən vətərlər", izah: "Kəsişən vətərlərin parçalarının hasilləri bərabərdir: AE · EB = CE · ED. Diametrə perpendikulyar vətər diametri a və b hissələrinə bölürsə, vətərin yarısı √(a · b)-dir.",
      gen() {
        const kind = pick(["veter", "veter", "nisbet", "perp", "perp", "yari"]);
        if (kind === "veter") {
          let a, b, c, e;
          do { a = rnd(2, 12); b = rnd(2, 12); c = pick(range(2, 15).filter(x => (a * b) % x === 0 && x !== a && x !== b) .concat([0])); e = c ? a * b / c : 0; } while (!c || e > 30 || Math.max(a, b, c, e) > 3.5 * Math.min(a, b, c, e));
          return { text: `AB və CD vətərləri E nöqtəsində kəsişir. AE = ${a}, EB = ${b}, CE = ${c}. ED-ni tap.`,
            svg: chordFig(a, b, c, e, { AE: String(a), EB: String(b), CE: String(c) }), answer: e, show: String(e), tol: 0.01,
            solution: `Kəsişən vətərlərin parçaları: AE · EB = CE · ED → ${a} · ${b} = ${c} · ED → ED = ${a * b} : ${c} = ${e}.` };
        }
        if (kind === "nisbet") {
          let m, n, k, c, e;
          do { m = rnd(1, 5); n = rnd(1, 5); k = rnd(1, 4); c = rnd(2, 20); e = m * n * k * k / c; } while (m === n || e % 1 || e < 1 || e === c || Math.max(m * k, n * k, c, e) > 3.5 * Math.min(m * k, n * k, c, e));
          return { text: `AB və CD vətərləri E nöqtəsində kəsişir. AB = ${(m + n) * k}, AE : EB = ${m} : ${n}, CE = ${c}. ED-ni tap.`,
            svg: chordFig(m * k, n * k, c, e, { AB: [String((m + n) * k), .5], CE: String(c) }), answer: e, show: String(e), tol: 0.01,
            solution: `Bir hissə = ${(m + n) * k} : ${m + n} = ${k}. AE = ${m * k}, EB = ${n * k}. AE · EB = CE · ED → ${m * k} · ${n * k} = ${c} · ED → ED = ${m * n * k * k} : ${c} = ${e}.` };
        }
        if (kind === "yari") {
          let a, b; a = rnd(2, 12); do b = rnd(2, 16); while (b === a || Math.max(a, b) > 3.5 * Math.min(a, b));
          const [hs, hv] = surd(1, 1, a * b), [cs, cv] = surd(2, 1, a * b);
          return { text: `AB və CD vətərləri E nöqtəsində kəsişir, AE = ${a}, EB = ${b}. E nöqtəsi CD vətərini yarıya bölür. CD-ni tap.`,
            svg: chordFig(a, b, hv, hv, { AE: String(a), EB: String(b) }), answer: cv, show: cs, placeholder: "məs. 12 və ya 4√5",
            solution: `CE = ED = x. AE · EB = CE · ED → x² = ${a} · ${b} = ${a * b}, x = ${hs}. CD = 2x = ${cs}.` };
        }
        // chord perpendicular to a diameter
        const ask = pick(["CD", "CD", "R"]);
        let a, b, h;
        do { a = rnd(1, 16); h = rnd(2, 12); b = h * h / a; } while (b % 1 || a === b || a + b > 40 || Math.max(a, b) > 6 * Math.min(a, b));
        const R = (a + b) / 2, P = { O: [0, 0], A: [-R, 0], B: [R, 0], E: [-R + a, 0], C: [-R + a, h], D: [-R + a, -h] };
        const base = { circ: [["O", R]], cen: "O", names: ["A", "B", "C", "D", "E"], free: true, segs: [["A", "B", "acc"], ["C", "D", "acc"]], right: [["E", "A", "C"]] };
        if (ask === "CD") {
          const [cs, cv] = surd(2, 1, a * b);
          return { text: `AB — çevrənin diametridir. CD vətəri AB-yə perpendikulyardır və AB-ni E nöqtəsində kəsir, AE = ${a}, EB = ${b}. CD-ni tap.`,
            svg: figure(P, { ...base, lab: { AE: String(a), EB: String(b) } }), answer: cv, show: cs, placeholder: "məs. 12 və ya 4√5",
            solution: `Diametrə perpendikulyar vətər E nöqtəsində yarıya bölünür: CE = ED = x. AE · EB = CE · ED → x² = ${a} · ${b} = ${a * b}, x = ${surd(1, 1, a * b)[0]}. CD = 2x = ${cs}.` };
        }
        return { text: `AB — çevrənin diametridir. CD = ${2 * h} vətəri AB-yə perpendikulyardır və AB-ni E nöqtəsində kəsir, AE = ${a}. Çevrənin radiusunu tap.`,
          svg: figure(P, { ...base, lab: { AE: String(a), CD: [String(2 * h), .25] } }), answer: R, show: frac(a + b, 2), tol: 0.01,
          solution: `CE = ED = ${2 * h} : 2 = ${h}. AE · EB = CE · ED → ${a} · EB = ${h * h} → EB = ${b}. AB = ${a} + ${b} = ${a + b}, radius = ${a + b} : 2 = ${frac(a + b, 2)}.` };
      } },

    { id: "tk", ad: "Toxunan və kəsən", izah: "Nöqtədən çəkilmiş toxunanın kvadratı kəsənin bütün uzunluğu ilə onun xarici hissəsinin hasilinə bərabərdir: MT² = MA · MB. İki kəsən üçün: MA · MB = MC · MD.",
      gen() {
        const kind = pick(["tk", "tk", "tkr", "centr", "iki", "iki"]);
        if (kind === "tk") {
          const a = rnd(2, 10), c = rnd(2, Math.min(16, 3 * a)), mb = a + c, [ts, tv] = surd(1, 1, a * mb);
          return { text: `M nöqtəsindən çevrəyə MT toxunanı və MAB kəsəni çəkilib (A M-ə yaxındır). MA = ${a}, AB = ${c}. MT-ni tap.`,
            svg: drawSec([[a, mb, "A", "B"]], true, { MA: String(a), AB: String(c), MT: "?" }), answer: tv, show: ts, placeholder: "məs. 6 və ya 2√7",
            solution: `MB = ${a} + ${c} = ${mb}. Toxunan və kəsən teoremi: MT² = MA · MB = ${a} · ${mb} = ${a * mb}, MT = ${ts}.` };
        }
        if (kind === "tkr") {
          let a, c, t; do { a = rnd(2, 12); c = rnd(2, 20); t = Math.sqrt(a * (a + c)); } while (t % 1 || c > 3 * a);
          const ask = pick(["AB", "MA"]);
          if (ask === "AB") return { text: `M nöqtəsindən çevrəyə MT toxunanı və MAB kəsəni çəkilib (A M-ə yaxındır). MT = ${t}, MA = ${a}. AB-ni tap.`,
            svg: drawSec([[a, a + c, "A", "B"]], true, { MA: String(a), MT: String(t), AB: "?" }), answer: c, show: String(c), tol: 0.01,
            solution: `MT² = MA · MB → ${t * t} = ${a} · MB → MB = ${a + c}. AB = MB − MA = ${a + c} − ${a} = ${c}.` };
          return { text: `M nöqtəsindən çevrəyə MT toxunanı və MAB kəsəni çəkilib (A M-ə yaxındır). MT = ${t}, AB = ${c}. MA-nı tap.`,
            svg: drawSec([[a, a + c, "A", "B"]], true, { MT: String(t), AB: String(c), MA: "?" }), answer: a, show: String(a), tol: 0.01,
            solution: `MA = x olsun, MB = x + ${c}. MT² = MA · MB: x(x + ${c}) = ${t * t} → x² + ${c}x − ${t * t} = 0. Müsbət kök x = ${a} (yoxla: ${a} · ${a + c} = ${t * t}).` };
        }
        if (kind === "centr") {
          let a, R; do { a = rnd(1, 12); R = rnd(1, 14); } while (Math.sqrt(a * (a + 2 * R)) % 1 || a === R);
          const d = a + R, t = Math.sqrt(a * (a + 2 * R)), ta = Math.acos(R / d);
          const P = { O: [0, 0], M: [d, 0], A: [R, 0], B: [-R, 0], T: [R * Math.cos(ta), R * Math.sin(ta)] };
          return { text: `M nöqtəsindən çevrəyə MT toxunanı və mərkəzdən keçən MAB kəsəni çəkilib (A M-ə yaxındır). MA = ${a}, çevrənin radiusu ${R}. MT-ni tap.`,
            svg: figure(P, { circ: [["O", R]], cen: "O", names: ["M", "A", "B", "T"], free: true, segs: [["M", "B", "acc"], ["M", "T", "acc"]], lab: { MA: String(a), MT: "?" } }), answer: t, show: String(t), tol: 0.01,
            solution: `Kəsən mərkəzdən keçir, ona görə AB diametrdir: AB = 2 · ${R} = ${2 * R}, MB = ${a} + ${2 * R} = ${a + 2 * R}. MT² = MA · MB = ${a} · ${a + 2 * R} = ${t * t}, MT = ${t}.` };
        }
        let a, b, c, md; do { a = rnd(2, 10); b = rnd(2, 15); c = rnd(2, 12); md = a * (a + b) / c; } while (md % 1 || c === a || md <= c + 1 || md > 40 || b > 3 * a || md > 4 * c || md - c < Math.max(3, c / 2));
        return { text: `M nöqtəsindən çevrəyə MAB və MCD kəsənləri çəkilib (A və C M-ə yaxındır). MA = ${a}, AB = ${b}, MC = ${c}. CD-ni tap.`,
          svg: drawSec([[a, a + b, "A", "B"], [c, md, "C", "D"]], false, { MA: String(a), AB: String(b), MC: String(c), CD: "?" }), answer: md - c, show: String(md - c), tol: 0.01,
          solution: `MA · MB = MC · MD. MB = ${a} + ${b} = ${a + b}. ${a} · ${a + b} = ${c} · MD → MD = ${a * (a + b)} : ${c} = ${md}. CD = ${md} − ${c} = ${md - c}.` };
      } },

    { id: "qucvve", ad: "Nöqtənin qüvvəsi", izah: "P nöqtəsindən O mərkəzli R radiuslu çevrəyə qədər: P-dən keçən hər kəsənin MA · MB hasili eynidir. Xaricdə o d² − R²-dir (d = OP), daxildə R² − d².",
      gen() {
        const kind = pick(["kisa", "hasil", "hasil", "kes", "kes", "yaxin", "xar"]);
        if (kind === "kisa") {
          const [p, q, c] = triple(40);
          const P = { O: [0, 0], P: [p, 0], A: [p, q], B: [p, -q] };
          return { text: `Çevrənin radiusu ${c}, P nöqtəsi çevrənin daxilindədir və O mərkəzindən ${p} məsafədədir. P-dən keçən vətərlər arasında ən qısasının uzunluğunu tap.`,
            svg: figure(P, { circ: [["O", c]], cen: "O", free: true, segs: [["A", "B", "acc"], ["O", "A", "dash"], ["O", "P", "dash"]], right: [["P", "O", "A"]], lab: { OP: String(p) } }), answer: 2 * q, show: String(2 * q), tol: 0.01,
            solution: `P-dən keçən vətərin mərkəzdən məsafəsi h olsa, yarısı √(${c}² − h²)-dir. Ən qısa vətər üçün h ən böyük olmalıdır: h ≤ OP, ona görə ən qısa vətər OP-yə perpendikulyardır. Yarısı = √(${c}² − ${p}²) = √${q * q} = ${q}, vətər = ${2 * q}.` };
        }
        if (kind === "hasil") {
          const [p, q, c] = triple(30); let a, x, tries = 0;
          do { a = pick(divisors(q * q)); x = q * q / a; tries++; } while ((a === x || Math.abs(x - a) > 1.8 * p || Math.max(a, x) > 40) && tries < 50);
          if (Math.abs(x - a) > 1.8 * p || Math.max(a, x) > 40) { a = q; x = q; }
          const co = (x - a) / (2 * p), u = [co, Math.sqrt(1 - co * co)];
          const P = { O: [0, 0], P: [p, 0], A: [p + a * u[0], a * u[1]], B: [p - x * u[0], -x * u[1]] };
          const swap = Math.random() < .5, giv = swap ? x : a, ans = swap ? a : x;
          return { text: `Çevrənin radiusu ${c}, P nöqtəsi O mərkəzindən ${p} məsafədədir (çevrənin daxilində). P-dən keçən AB vətəri P ilə PA və PB hissələrinə bölünür, ${swap ? "PB" : "PA"} = ${giv}. ${swap ? "PA" : "PB"}-ni tap.`,
            svg: figure(P, { circ: [["O", c]], cen: "O", free: true, segs: [["A", "B", "acc"], ["O", "P", "dash"]], lab: { [swap ? "PB" : "PA"]: String(giv) } }), answer: ans, show: String(ans), tol: 0.01,
            solution: `Daxildəki P nöqtəsindən keçən vətərin parçalarının hasili sabitdir: PA · PB = R² − OP² = ${c}² − ${p}² = ${q * q}. ${giv} · ${swap ? "PA" : "PB"} = ${q * q} → ${swap ? "PA" : "PB"} = ${q * q} : ${giv} = ${ans}.` };
        }
        if (kind === "kes") {
          let p, q, c, cand;
          do { [p, q, c] = triple(30); cand = divisors(q * q).filter(k => k < q * q / k && (k + q * q / k) < 1.9 * c); } while (!cand.length);
          const a = pick(cand), b = q * q / a, co = (a + b) / (2 * c), u = [co, Math.sqrt(1 - co * co)];
          const P = { O: [0, 0], M: [c, 0], A: [c - a * u[0], a * u[1]], B: [c - b * u[0], b * u[1]] };
          const ask = pick(["MB", "AB"]);
          return { text: `Çevrənin radiusu ${p}, M nöqtəsi O mərkəzindən ${c} məsafədədir. M-dən çevrəni A və B nöqtələrində kəsən düz xətt çəkilib (A M-ə yaxındır), MA = ${a}. ${ask === "MB" ? "MB-ni" : "AB-ni"} tap.`,
            svg: figure(P, { circ: [["O", p]], cen: "O", free: true, segs: [["M", "B", "acc"], ["O", "M", "dash"]], lab: { MA: String(a) } }), answer: ask === "MB" ? b : b - a, show: String(ask === "MB" ? b : b - a), tol: 0.01,
            solution: `M nöqtəsinin qüvvəsi: MA · MB = MO² − R² = ${c}² − ${p}² = ${q * q}. ${a} · MB = ${q * q} → MB = ${b}.` + (ask === "AB" ? ` AB = MB − MA = ${b} − ${a} = ${b - a}.` : "") };
        }
        if (kind === "yaxin") {
          let s, l; do { s = rnd(1, 12); l = rnd(s + 2, 30); } while ((s + l) % 2);
          const d = (s + l) / 2, R = (l - s) / 2, [ts, tv] = surd(1, 1, s * l);
          const P = { O: [0, 0], M: [d, 0], N: [R, 0], F: [-R, 0] };
          return { text: `M nöqtəsindən çevrənin ən yaxın nöqtəsinə qədər məsafə ${s}, ən uzaq nöqtəsinə qədər ${l}-dir. M-dən çevrəyə çəkilmiş toxunanın uzunluğunu tap.`,
            svg: figure(P, { circ: [["O", R]], cen: "O", names: ["M", "N", "F", "O"], free: true, segs: [["M", "F", "acc"]], lab: {} }), answer: tv, show: ts, placeholder: "məs. 8 və ya 3√5",
            solution: `M-i mərkəzlə birləşdirən düz xətt çevrəni N (yaxın) və F (uzaq) nöqtələrində kəsir: MN = ${s}, MF = ${l}. Toxunan və kəsən: MT² = MN · MF = ${s} · ${l} = ${s * l}, MT = ${ts}.` };
        }
        // product along any secant from outside
        const R = rnd(2, 15), d = rnd(R + 1, R + 12);
        return { text: `Çevrənin radiusu ${R}, M nöqtəsi mərkəzdən ${d} məsafədədir. M-dən çevrəni A və B nöqtələrində kəsən istənilən düz xətt üçün MA · MB hasilini tap.`,
          answer: d * d - R * R, show: String(d * d - R * R), tol: 0.01,
          solution: `Hasil bütün kəsənlər üçün eynidir, deməli toxunanın kvadratına bərabərdir: MA · MB = MT² = MO² − R² = ${d}² − ${R}² = ${d * d - R * R}.` };
      } },

    { id: "ortaq", ad: "Ortaq toxunanın uzunluğu", izah: "Mərkəzləri arası d, radiusları R və r olan çevrələrin ortaq xarici toxunanı √(d² − (R − r)²), ortaq daxili toxunanı √(d² − (R + r)²) olur.",
      gen() {
        const kind = pick(["ext", "ext", "int", "int", "toxun", "dr"]);
        if (kind === "ext" || kind === "int") {
          const [p, q, c] = triple(30), ext = kind === "ext";
          const r = ext ? rnd(1, 6) : rnd(1, q - 1), RR = ext ? r + q : q - r, rr = r;
          const lab = { OA: String(RR), QB: String(rr), OQ: String(c), AB: "?" };
          return ext
            ? { text: `Radiusları ${RR} və ${rr} olan iki çevrənin mərkəzləri arasındakı məsafə ${c}-dir. Onların ortaq xarici toxunanının toxunma nöqtələri arasındakı AB parçasının uzunluğunu tap.`,
              svg: twoCircles(RR, rr, c, "ext", lab), answer: p, show: String(p), tol: 0.01,
              solution: `OA ⟂ AB və QB ⟂ AB, deməli OA ∥ QB. Q-dan OA-ya perpendikulyar endir: düzbucaqlı üçbucağın hipotenuzu OQ = ${c}, katetləri AB və OA − QB = ${RR} − ${rr} = ${RR - rr}. AB² = ${c}² − ${RR - rr}² = ${c * c - (RR - rr) ** 2}, AB = ${p}.` }
            : { text: `Radiusları ${RR} və ${rr} olan iki çevrənin mərkəzləri arasındakı məsafə ${c}-dir (çevrələr bir-birindən aralıdır). Onların ortaq daxili toxunanının toxunma nöqtələri arasındakı AB parçasının uzunluğunu tap.`,
              svg: twoCircles(RR, rr, c, "int", lab), answer: p, show: String(p), tol: 0.01,
              solution: `OA ⟂ AB və QB ⟂ AB. Q-dan AB-yə paralel çək, OA-nın davamını K nöqtəsində kəssin: düzbucaqlı OKQ üçbucağının hipotenuzu OQ = ${c}, katetləri KQ = AB və OK = OA + QB = ${RR} + ${rr} = ${RR + rr}. AB² = ${c}² − ${RR + rr}² = ${c * c - (RR + rr) ** 2}, AB = ${p}.` };
        }
        if (kind === "toxun") {
          let R, r; do { R = rnd(1, 20); r = rnd(1, 20); } while (R === r);
          const [ss, sv2] = surd(2, 1, R * r);
          return { text: `Radiusları ${R} və ${r} olan iki çevrə bir-birinə xaricdən toxunur. Onların ortaq xarici toxunanının toxunma nöqtələri arasındakı məsafəni tap.`,
            answer: sv2, show: ss, placeholder: "məs. 12 və ya 4√3",
            solution: `Xaricdən toxunan çevrələrdə d = R + r = ${R + r}. AB² = d² − (R − r)² = (R + r)² − (R − r)² = 4Rr = 4 · ${R} · ${r} = ${4 * R * r}. AB = ${ss}.` };
        }
        // find d from the tangent length
        const [p, q, c] = triple(30), r = rnd(1, 6), ext = Math.random() < .5;
        if (ext) return { text: `Radiusları ${r + q} və ${r} olan iki çevrənin ortaq xarici toxunanının toxunma nöqtələri arasındakı məsafə ${p}-dir. Mərkəzləri arasındakı məsafəni tap.`,
          answer: c, show: String(c), tol: 0.01,
          solution: `d² = AB² + (R − r)² = ${p}² + ${q}² = ${p * p + q * q}, d = ${c}.` };
        const r3 = rnd(1, q - 1), R2 = q - r3;
        return { text: `Radiusları ${R2} və ${r3} olan iki çevrənin (bir-birindən aralı) ortaq daxili toxunanının toxunma nöqtələri arasındakı məsafə ${p}-dir. Mərkəzləri arasındakı məsafəni tap.`,
          answer: c, show: String(c), tol: 0.01,
          solution: `d² = AB² + (R + r)² = ${p}² + ${q}² = ${p * p + q * q}, d = ${c}.` };
      } },

    { id: "tcev", ad: "Toxunan çevrələr", izah: "Xaricdən toxunan çevrələrdə d = R + r, ortaq xarici toxunan 2√(R · r), ortaq daxili toxunan onu yarıya bölür. Üç çevrə cüt-cüt toxunanda mərkəzlər üçbucaq əmələ gətirir: tərəfləri R + r, r + ρ, R + ρ.",
      gen() {
        const kind = pick(["ab", "mt", "mt2", "rho", "rho", "uc", "uc2"]);
        const tangFig = (R, r, lab, withM) => {
          const x = 2 * Math.sqrt(R * r), P = { O: [0, R], Q: [x, r], A: [0, 0], B: [x, 0], T: [x * R / (R + r), 2 * R * r / (R + r)] };
          if (withM) P.M = [x / 2, 0];
          const segs = [["A", "B", "acc"], ["O", "A"], ["Q", "B"], ["O", "Q", "dash"]];
          if (withM) segs.push(["M", "T", "acc"]);
          return figure(P, { circ: [["O", R], ["Q", r]], cen: "T", names: withM ? ["O", "Q", "A", "B", "M", "T"] : ["O", "Q", "A", "B"], rot: [0], segs, lab });
        };
        if (kind === "ab") {
          let R, r; do { R = rnd(1, 25); r = rnd(1, 25); } while (R === r || R * r > 400);
          const [ss, sv2] = surd(2, 1, R * r);
          return { text: `Radiusları ${R} və ${r} olan iki çevrə bir-birinə xaricdən toxunur, AB — ortaq xarici toxunanın toxunma nöqtələri arasındakı parçadır. AB-ni tap.`,
            svg: tangFig(R, r, { OA: String(R), QB: String(r), AB: "?" }, false), answer: sv2, show: ss, placeholder: "məs. 12 və ya 4√3",
            solution: `OQ = R + r = ${R + r}, OA − QB = ${Math.abs(R - r)}. AB² = (R + r)² − (R − r)² = 4Rr = ${4 * R * r}. AB = ${ss}.` };
        }
        if (kind === "mt" || kind === "mt2") {
          let a, b; do { a = rnd(1, 9); b = rnd(1, 9); } while (a === b);
          const R = a * a, r = b * b, mt = a * b;
          if (kind === "mt") return { text: `Radiusları ${R} və ${r} olan iki çevrə T nöqtəsində xaricdən toxunur. T-dən keçən ortaq daxili toxunan ortaq xarici toxunanı (AB) M nöqtəsində kəsir. MT-ni tap.`,
            svg: tangFig(R, r, {}, true), answer: mt, show: String(mt), tol: 0.01,
            solution: `Bir nöqtədən çevrəyə çəkilmiş toxunan parçaları bərabərdir: MA = MT (birinci çevrə), MB = MT (ikinci çevrə). Deməli M — AB-nin ortasıdır, MT = AB : 2. AB = 2√(${R} · ${r}) = 2 · ${mt}, MT = ${mt}.` };
          return { text: `İki çevrə T nöqtəsində xaricdən toxunur. T-dən keçən ortaq daxili toxunan ortaq xarici toxunanı (AB) M nöqtəsində kəsir, MT = ${mt}. AB-ni tap.`,
            svg: tangFig(R, r, {}, true), answer: 2 * mt, show: String(2 * mt), tol: 0.01,
            solution: `MA = MT və MB = MT (bir nöqtədən çəkilmiş toxunanlar). AB = MA + MB = 2 · ${mt} = ${2 * mt}.` };
        }
        if (kind === "rho") {
          let a, b; do { a = rnd(1, 7); b = rnd(1, 7); } while (a === b);
          const R = a * a, r = b * b, p = a * b, s = a + b, rho = p * p / (s * s);
          const xB = 2 * a * b, xc = 2 * Math.sqrt(R * rho);
          const P = { O: [0, R], Q: [xB, r], K: [xc, rho], A: [0, 0], B: [xB, 0] };
          return { text: `Radiusları ${R} və ${r} olan iki çevrə bir-birinə xaricdən toxunur və ikisi də eyni düz xəttə toxunur. İkisinin arasındakı boşluğa elə üçüncü çevrə yerləşdirilib ki, o, hər iki çevrəyə və həmin düz xəttə toxunur. Üçüncü çevrənin radiusunu tap.`,
            svg: figure(P, { circ: [["O", R], ["Q", r], ["K", rho, "acc"]], cen: "K", names: ["O", "Q", "K"], rot: [0], segs: [["A", "B"]], lab: {} }),
            answer: rho, show: frac(p * p, s * s),
            solution: `Üç çevrənin düz xətdəki toxunma nöqtələri arasında: 2√(${R} · ${r}) = 2√(${R} · ρ) + 2√(${r} · ρ). Yəni ${p} = ${a}√ρ + ${b}√ρ = ${s}√ρ, √ρ = ${p}/${s}, ρ = ${frac(p * p, s * s)}.` };
        }
        if (kind === "uc") {
          let a, b, c; do { a = rnd(1, 12); b = rnd(1, 12); c = rnd(1, 12); } while (a === b || b === c || a === c);
          const per = 2 * (a + b + c);
          return { text: `Radiusları ${a}, ${b} və ${c} olan üç çevrə cüt-cüt bir-birinə xaricdən toxunur. Çevrələrin mərkəzlərini birləşdirən üçbucağın perimetrini tap.`,
            answer: per, show: String(per), tol: 0.01,
            solution: `Xaricdən toxunan çevrələrin mərkəzləri arasındakı məsafə radiusların cəmidir: ${a} + ${b} = ${a + b}, ${b} + ${c} = ${b + c}, ${a} + ${c} = ${a + c}. Perimetr = ${a + b} + ${b + c} + ${a + c} = ${per}.` };
        }
        let a, b, c; do { a = rnd(1, 12); b = rnd(1, 12); c = rnd(1, 12); } while (a === b || b === c || a === c);
        const x = a + b, y = b + c, z = a + c, ask = pick([0, 1, 2]), kk = [a, b, c], nm = ["A", "B", "C"][ask];
        const cx = (x * x + z * z - y * y) / (2 * x), P = { A: [0, 0], B: [x, 0], C: [cx, Math.sqrt(z * z - cx * cx)] };
        return { text: `Üç çevrə cüt-cüt bir-birinə xaricdən toxunur. Mərkəzləri A, B, C üçbucağın təpələridir: AB = ${x}, BC = ${y}, CA = ${z}. ${nm} mərkəzli çevrənin radiusunu tap.`,
          svg: figure(P, { circ: [["A", a], ["B", b], ["C", c]], cen: "A", free: true, lab: {}, segs: [["A", "B", "dash"], ["B", "C", "dash"], ["C", "A", "dash"]] }), answer: kk[ask], show: String(kk[ask]), tol: 0.01,
          solution: `Radiusları a, b, c ilə işarə edək (A, B, C mərkəzli çevrələr). a + b = ${x}, b + c = ${y}, a + c = ${z}. Cəm: 2(a + b + c) = ${x + y + z}, a + b + c = ${(x + y + z) / 2}. a = ${(x + y + z) / 2} − ${y} = ${a}, b = ${(x + y + z) / 2} − ${z} = ${b}, c = ${(x + y + z) / 2} − ${x} = ${c}. Cavab: ${kk[ask]}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Mətnli məsələ: hansı nöqtənin qüvvəsi, hansı toxunan, hansı kəsən? Sxem çək, sonra teoremi seç.",
      gen() {
        const t = pick(["kemer", "korpu", "cigir", "yol", "carpayi"]);
        if (t === "kemer") {
          const [p, q, c] = triple(60), r = rnd(1, 8);
          return { text: `İki çarxın radiusları ${r + q} sm və ${r} sm, oxlarının arası ${c} sm-dir. Onları bürüyən kəmərin düz hissəsinin (çarxlara toxunan hissənin) uzunluğu neçə santimetrdir?`,
            answer: p, show: p + " sm", unit: "sm", tol: 0.01,
            solution: `Kəmərin düz hissəsi çarxlara ortaq xarici toxunandır. Uzunluğu √(d² − (R − r)²) = √(${c}² − ${q}²) = √${p * p} = ${p} sm.` };
        }
        if (t === "korpu") {
          let a, hh, R; do { hh = rnd(1, 8); a = rnd(hh + 1, 24); R = (a * a + hh * hh) / (2 * hh); } while (R % 1);
          return { text: `Körpünün tağı çevrə qövsüdür. Tağın uclarının arası ${2 * a} m, tağın ən yüksək nöqtəsi bu düz xəttdən ${hh} m yuxarıdadır. Tağın çevrəsinin radiusu neçə metrdir?`,
            answer: R, show: R + " m", unit: "m", tol: 0.01,
            solution: `Uclar arasındakı vətər hündürlük xətti ilə yarıya bölünür: ${a} və ${a}. Hündürlük xətti diametrin bir hissəsidir: ${hh} və 2R − ${hh}. Kəsişən vətərlər: ${a} · ${a} = ${hh} · (2R − ${hh}) → 2R − ${hh} = ${a * a / hh} → R = ${R} m.` };
        }
        if (t === "cigir") {
          const [p, q, c] = triple(60);
          return { text: `Dairəvi gölün radiusu ${p} m. Gölün mərkəzindən ${c} m aralıdakı ağacdan sahilə toxunan düz cığır çəkilib. Ağacdan toxunma nöqtəsinə qədər cığırın uzunluğu neçə metrdir?`,
            answer: q, show: q + " m", unit: "m", tol: 0.01,
            solution: `Toxunan radiusa perpendikulyardır: mərkəz, toxunma nöqtəsi və ağac düzbucaqlı üçbucaq əmələ gətirir. Cığır = √(${c}² − ${p}²) = √${q * q} = ${q} m.` };
        }
        if (t === "yol") {
          let a, b; do { a = rnd(2, 16); b = rnd(2, 16); } while (a >= b || Math.sqrt(a * b) % 1);
          const m = Math.sqrt(a * b);
          return { text: `Dairəvi parkın kənarında dayanan Elvin A nöqtəsindədir (A parkın daxilində deyil). A-dan düz yol keçir: yol parka A-dan ${a} m məsafədə girir, ${b} m məsafədə çıxır. Eyni A nöqtəsindən parkın sərhədinə toxunan cığır da çəkilib. Cığırın uzunluğu neçə metrdir?`,
            answer: m, show: m + " m", unit: "m", tol: 0.01,
            solution: `Toxunan və kəsən: cığır² = ${a} · ${b} = ${a * b}, cığır = ${m} m.` };
        }
        let a, b; do { a = rnd(1, 9); b = rnd(1, 9); } while (a >= b);
        const R = a * a, r = b * b;
        return { text: `Bir-birinə toxunan iki dairəvi gül çəmənliyinin radiusları ${R} m və ${r} m-dir. Hər ikisinə toxunan düz ip çəkilib (ortaq xarici toxunan). İpin çəmənliklərə toxunduğu iki nöqtə arasındakı məsafə neçə metrdir?`,
          answer: 2 * a * b, show: 2 * a * b + " m", unit: "m", tol: 0.01,
          solution: `Xaricdən toxunan çevrələr üçün ortaq xarici toxunanın uzunluğu 2√(R · r) = 2√(${R} · ${r}) = 2 · ${a * b} = ${2 * a * b} m.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const t = pick(["tk", "ortaq", "veter", "qucvve"]), bad = rnd(0, 2);
        let task, st, wrong, why;
        if (t === "tk") {
          let a, mb; do { a = rnd(2, 9); mb = rnd(a + 2, 30); } while (Math.sqrt(a * mb) % 1);
          const tt = Math.sqrt(a * mb);
          task = `Məsələ: M-dən çevrəyə MT toxunanı və MAB kəsəni çəkilib, MA = ${a}, MB = ${mb}. MT-ni tap.`;
          st = [`Toxunan və kəsən teoremi: MT² = MA · MB.`, `MT² = ${a} · ${mb} = ${a * mb}.`, `MT = √${a * mb} = ${tt}.`];
          wrong = [`Toxunan və kəsən teoremi: MT² = MA · AB.`, `MT² = ${a} + ${mb} = ${a + mb}.`, `MT = ${a * mb} : 2 = ${fmt(a * mb / 2)}.`];
          why = [`1-ci addımda səhv var: kəsənin bütöv xarici parçası götürülür: MA · MB (AB yox).`, `2-ci addımda səhv var: hasil lazımdır: ${a} · ${mb} = ${a * mb}.`, `3-cü addımda səhv var: MT = √${a * mb} = ${tt}.`];
        } else if (t === "ortaq") {
          const [p, q, c] = triple(30), r = rnd(1, 5);
          task = `Məsələ: radiusları ${r + q} və ${r} olan iki çevrənin mərkəzləri arası ${c}-dir. Ortaq xarici toxunanın toxunma nöqtələri arasındakı AB parçasının uzunluğunu tap.`;
          st = [`Q-dan OA-ya perpendikulyar endir: düzbucaqlı üçbucağın hipotenuzu OQ = ${c}, katetləri AB və OA − QB = ${q}.`, `AB² = ${c}² − ${q}² = ${c * c - q * q}.`, `AB = ${p}.`];
          wrong = [`Q-dan OA-ya perpendikulyar endir: düzbucaqlı üçbucağın hipotenuzu OQ = ${c}, katetləri AB və OA + QB = ${q + 2 * r}.`, `AB² = ${c}² + ${q}² = ${c * c + q * q}.`, `AB = ${c} − ${q} = ${c - q}.`];
          why = [`1-ci addımda səhv var: xarici toxunanda kateti radiusların fərqi yaradır: OA − QB. Cəmi daxili toxunanda götürürlər.`, `2-ci addımda səhv var: hipotenuzun kvadratı katetlərin kvadratları cəmidir, katet tapanda çıxılır: AB² = ${c}² − ${q}² = ${c * c - q * q}.`, `3-cü addımda səhv var: AB = √${c * c - q * q} = ${p}, ${c} − ${q} yox.`];
        } else if (t === "veter") {
          let a, b, c; do { a = rnd(2, 12); b = rnd(2, 12); c = rnd(2, 12); } while ((a * b) % c || c === a || c === b || a === b);
          task = `Məsələ: AB və CD vətərləri E-də kəsişir, AE = ${a}, EB = ${b}, CE = ${c}. ED-ni tap.`;
          st = [`Kəsişən vətərlər üçün AE · EB = CE · ED.`, `${a} · ${b} = ${c} · ED, yəni ${a * b} = ${c} · ED.`, `ED = ${a * b} : ${c} = ${a * b / c}.`];
          wrong = [`Kəsişən vətərlər üçün AE + EB = CE + ED.`, `${a} · ${b} = ${c} + ED, yəni ED = ${a * b} − ${c}.`, `ED = ${a * b} · ${c} = ${a * b * c}.`];
          why = [`1-ci addımda səhv var: vətər parçalarının cəmi yox, hasilləri bərabərdir.`, `2-ci addımda səhv var: sağ tərəf də hasildir: CE · ED, cəm yox.`, `3-cü addımda səhv var: ED-ni tapmaq üçün bölmək lazımdır: ${a * b} : ${c} = ${a * b / c}.`];
        } else {
          const [p, q, c] = triple(30);
          let a; do a = pick(divisors(q * q)); while (a === q * q);
          const bb = q * q / a;
          task = `Məsələ: çevrənin radiusu ${c}, P nöqtəsi mərkəzdən ${p} məsafədədir (çevrənin daxilində). P-dən keçən AB vətərində PA = ${a}. PB-ni tap.`;
          st = [`Daxildəki nöqtə üçün PA · PB = R² − OP².`, `R² − OP² = ${c}² − ${p}² = ${q * q}.`, `PB = ${q * q} : ${a} = ${bb}.`];
          wrong = [`Daxildəki nöqtə üçün PA + PB = R² − OP².`, `R² − OP² = ${c}² − ${p}² = ${c * c - p * 2}.`, `PB = ${q * q} · ${a} = ${q * q * a}.`];
          why = [`1-ci addımda səhv var: vətər parçalarının hasili sabitdir, cəmi yox.`, `2-ci addımda səhv var: kvadratlar çıxılır: ${c * c} − ${p * p} = ${q * q}, ${p}-ni 2-yə vurmaq olmaz.`, `3-cü addımda səhv var: PB-ni tapmaq üçün bölmək lazımdır: ${q * q} : ${a} = ${bb}.`];
        }
        st[bad] = wrong[bad];
        return { text: steps(task, st), choices: SEHV, correct: bad, show: SEHV[bad], solution: why[bad] };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-toxunan-kesen", title: "Toxunan və kəsənin xassələri", fenn: "olimpiada", link: "dersler/ol-toxunan-kesen.html",
      format: "Cavab ədəddir: uzunluq (vahid yazmaq lazım deyil). Kök: 2√7, kəsr: 13/2.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["veter", "veter", "tk", "tk", "qucvve", "ortaq", "ortaq", "tcev", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-toxunan-kesen.html")) b.push("dersler/ol-toxunan-kesen.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
