// Triqonometriya — mastery game levels (one per lesson idea) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const frac = (p, q) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : (p / g) + "/" + (q / g); };

  // Right triangle C (right angle), A, B; legs CA = a (along x), CB = b (along y). α at A or B.
  // Random rotation / mirror so the picture never looks the same. Labels: {CA, CB, AB} text or "".
  function triangle(a, b, alphaAt, labels, highlight) {
    const rot = rnd(0, 3) * Math.PI / 2, flip = Math.random() < .5 ? -1 : 1;
    const raw = { C: [0, 0], A: [a, 0], B: [0, b] };
    const P = {};
    for (const k in raw) { let [x, y] = raw[k]; x *= flip; const X = x * Math.cos(rot) - y * Math.sin(rot), Y = x * Math.sin(rot) + y * Math.cos(rot); P[k] = [X, -Y]; }
    const xs = Object.values(P).map(p => p[0]), ys = Object.values(P).map(p => p[1]);
    const W = 260, H = 190, pad = 30, s = Math.min((W - 2 * pad) / (Math.max(...xs) - Math.min(...xs)), (H - 2 * pad) / (Math.max(...ys) - Math.min(...ys)));
    const ox = (W - s * (Math.max(...xs) - Math.min(...xs))) / 2 - s * Math.min(...xs), oy = (H - s * (Math.max(...ys) - Math.min(...ys))) / 2 - s * Math.min(...ys);
    for (const k in P) P[k] = [ox + s * P[k][0], oy + s * P[k][1]];
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Düzbucaqlı üçbucaq" });
    const cen = [(P.A[0] + P.B[0] + P.C[0]) / 3, (P.A[1] + P.B[1] + P.C[1]) / 3];
    const side = (p, q, key) => {
      const on = highlight === key;
      g.append(sv("line", { x1: P[p][0], y1: P[p][1], x2: P[q][0], y2: P[q][1], stroke: on ? "#a32d2d" : "#17171a", "stroke-width": on ? 5 : 2, "stroke-linecap": "round" }));
      const m = [(P[p][0] + P[q][0]) / 2, (P[p][1] + P[q][1]) / 2], d = [m[0] - cen[0], m[1] - cen[1]], L = Math.hypot(...d) || 1;
      if (labels[key]) g.append(sv("text", { x: m[0] + d[0] / L * 16, y: m[1] + d[1] / L * 16 + 4, "text-anchor": "middle", class: "oy-lbl" }, labels[key]));
    };
    side("C", "A", "CA"); side("C", "B", "CB"); side("A", "B", "AB");
    // right-angle mark at C
    const u = (p) => { const d = [P[p][0] - P.C[0], P[p][1] - P.C[1]], L = Math.hypot(...d); return [d[0] / L * 12, d[1] / L * 12]; };
    const ua = u("A"), ub = u("B");
    g.append(sv("path", { d: `M${P.C[0] + ua[0]} ${P.C[1] + ua[1]}L${P.C[0] + ua[0] + ub[0]} ${P.C[1] + ua[1] + ub[1]}L${P.C[0] + ub[0]} ${P.C[1] + ub[1]}`, fill: "none", stroke: "#17171a", "stroke-width": 1.5 }));
    // α arc at its vertex
    const V = P[alphaAt], other = alphaAt === "A" ? "B" : "A";
    const ang = p => Math.atan2(P[p][1] - V[1], P[p][0] - V[0]);
    let t1 = ang("C"), t2 = ang(other); if (Math.abs(t2 - t1) > Math.PI) t2 += t2 < t1 ? 2 * Math.PI : -2 * Math.PI;
    const pts = Array.from({ length: 9 }, (_, i) => { const t = t1 + (t2 - t1) * i / 8; return (V[0] + 22 * Math.cos(t)) + " " + (V[1] + 22 * Math.sin(t)); });
    g.append(sv("path", { d: "M" + pts.join("L"), fill: "none", stroke: "#534ab7", "stroke-width": 2 }));
    const tm = (t1 + t2) / 2;
    g.append(sv("text", { x: V[0] + 36 * Math.cos(tm), y: V[1] + 36 * Math.sin(tm) + 5, "text-anchor": "middle", class: "oy-alpha" }, "α"));
    return g;
  }
  // which side is what for α at A / B
  const roles = at => at === "A" ? { opp: "CB", adj: "CA", hyp: "AB" } : { opp: "CA", adj: "CB", hyp: "AB" };

  const SPECIAL = {
    sin: { 30: ["1/2", .5], 45: ["√2/2", Math.SQRT2 / 2], 60: ["√3/2", Math.sqrt(3) / 2] },
    cos: { 30: ["√3/2", Math.sqrt(3) / 2], 45: ["√2/2", Math.SQRT2 / 2], 60: ["1/2", .5] },
    tg: { 30: ["√3/3", Math.sqrt(3) / 3], 45: ["1", 1], 60: ["√3", Math.sqrt(3)] },
  };
  const UNIT = { // unit circle values incl. obtuse angles and axes
    0: [0, 1], 30: [.5, Math.sqrt(3) / 2], 45: [Math.SQRT2 / 2, Math.SQRT2 / 2], 60: [Math.sqrt(3) / 2, .5], 90: [1, 0],
    120: [Math.sqrt(3) / 2, -.5], 135: [Math.SQRT2 / 2, -Math.SQRT2 / 2], 150: [.5, -Math.sqrt(3) / 2], 180: [0, -1],
  };
  const SHOW = v => { const m = { "0": "0", "1": "1", "-1": "−1", "0.5": "1/2", "-0.5": "−1/2" }; const r = Math.round(v * 1e6) / 1e6;
    if (m[r] != null) return m[r]; const s2 = Math.SQRT2 / 2, s3 = Math.sqrt(3) / 2; if (Math.abs(Math.abs(v) - s2) < 1e-9) return (v < 0 ? "−" : "") + "√2/2"; if (Math.abs(Math.abs(v) - s3) < 1e-9) return (v < 0 ? "−" : "") + "√3/2"; return String(r); };
  const fmt = n => String(Math.round(n * 100) / 100).replace(".", ",");

  const levels = [
    { id: "terefler", minVariety: 3, ad: "Tərəfləri tanı", izah: "Hipotenuz, qarşı katet, bitişik katet — hamısı α-ya görə.",
      gen() {
        const [a, b] = pick(TRIPLES), at = pick(["A", "B"]), r = roles(at), key = pick(["opp", "adj", "hyp"]);
        const names = ["Hipotenuz", "Qarşı katet", "Bitişik katet"], idx = { hyp: 0, opp: 1, adj: 2 }[key];
        return { text: "Qırmızı tərəf α bucağına görə necə adlanır?", svg: triangle(a, b, at, {}, r[key]), choices: names, correct: idx, show: names[idx],
          solution: "Hipotenuz düz bucağın qarşısındadır və ən uzun tərəfdir. Qarşı katet α-ya toxunmur. Bitişik katet α-ya toxunur, amma hipotenuz deyil." };
      } },
    { id: "nisbet", ad: "sin, cos, tg hesabla", izah: "Tərəflər verilib. Kəsr kimi yaz (məs. 3/5).",
      gen() {
        const [p, q, c] = pick(TRIPLES), k = pick([1, 1, 2, 3]), a = p * k, b = q * k, hy = c * k, at = pick(["A", "B"]), r = roles(at);
        const len = { CA: a, CB: b, AB: hy }, f = pick(["sin", "cos", "tg"]);
        const opp = len[r.opp], adj = len[r.adj];
        const [num, den] = f === "sin" ? [opp, hy] : f === "cos" ? [adj, hy] : [opp, adj];
        return { text: `${f} α = ?`, svg: triangle(a, b, at, { CA: String(a), CB: String(b), AB: String(hy) }, null), answer: num / den, show: frac(num, den), placeholder: "məs. 3/5",
          solution: `${f} α = ${f === "sin" ? "qarşı / hipotenuz" : f === "cos" ? "bitişik / hipotenuz" : "qarşı / bitişik"} = ${num}/${den} = ${frac(num, den)}.` };
      } },
    { id: "xususi", minVariety: 12, ad: "30°, 45°, 60°", izah: "Cədvəli yadda saxla: kəsr və ya √ ilə yaz (√3/2).",
      gen() {
        const f = pick(["sin", "cos", "tg"]), d = pick([30, 45, 60]), [s, v] = SPECIAL[f][d];
        if (Math.random() < .35 && !(f === "tg" && d === 45) && !(s === "√2/2")) {
          return { text: `α kəskin bucaqdır və ${f} α = ${s}. α neçə dərəcədir?`, answer: d, show: d + "°", unit: "°", tol: 0.01,
            solution: `${f} ${d}° = ${s}. Cədvəl: sin 30° = cos 60° = 1/2, sin 60° = cos 30° = √3/2, tg 30° = √3/3, tg 60° = √3.` };
        }
        return { text: `${f} ${d}° = ?`, answer: v, show: s, placeholder: "məs. √3/2",
          solution: `${f} ${d}° = ${s}. Yadda saxlama yolu: sin 30°, 45°, 60° = √1/2, √2/2, √3/2; cos isə tərsinə gedir.` };
      } },
    { id: "teref", ad: "Tərəfi tap", izah: "Bucaq və bir tərəf verilib. Cavabı √ ilə və ya onluq kəsrlə (0.01 dəqiqliklə) yaz.",
      gen() {
        const d = pick([30, 45, 60]), c = pick([4, 6, 8, 10, 12, 14, 16, 20]), kind = pick(["opp", "adj", "life"]);
        if (kind === "life") {
          const t = pick([
            { s: `Uzunluğu ${c} m olan nərdivan divara söykənib və yerlə ${d}° bucaq əmələ gətirir. Nərdivanın yuxarı ucu yerdən hansı hündürlükdədir?`, f: "sin", w: "hündürlük = nərdivan · sin" },
            { s: `Uzunluğu ${c} m olan rampa yerlə ${d}° bucaq əmələ gətirir. Rampanın ayağı divardan nə qədər uzaqdadır (üfüqi məsafə)?`, f: "cos", w: "üfüqi məsafə = rampa · cos" },
          ]);
          const v = c * SPECIAL[t.f][d][1];
          return { text: t.s, answer: v, unit: "m", show: fmt(v) + " m", solution: `${t.w} ${d}° = ${c} · ${SPECIAL[t.f][d][0]} ≈ ${fmt(v)} m.` };
        }
        const f = kind === "opp" ? "sin" : "cos", v = c * SPECIAL[f][d][1];
        const label = kind === "opp" ? "α-nın qarşısındakı katet" : "α-ya bitişik katet";
        return { text: `Hipotenuz ${c}, α = ${d}°. Tap: ${label}.`, answer: v, show: fmt(v),
          solution: `${kind === "opp" ? "qarşı = hipotenuz · sin α" : "bitişik = hipotenuz · cos α"} = ${c} · ${SPECIAL[f][d][0]} ≈ ${fmt(v)}.` };
      } },
    { id: "cevre", minVariety: 15, ad: "Vahid çevrə", izah: "90°-dən böyük bucaqlar da. İşarəyə diqqət: II rübdə cos mənfidir.",
      gen() {
        const d = pick([0, 30, 45, 60, 90, 120, 135, 150, 180, 120, 135, 150]), f = pick(["sin", "cos"]), [sn, cs] = UNIT[d], v = f === "sin" ? sn : cs;
        return { text: `${f} ${d}° = ?`, answer: v, show: SHOW(v), placeholder: "məs. −1/2",
          solution: `Vahid çevrədə ${d}° nöqtəsi (${SHOW(cs)}; ${SHOW(sn)}). cos = x, sin = y, ona görə ${f} ${d}° = ${SHOW(v)}.` + (d > 90 && d < 180 ? ` (${180 - d}°-nin qiymətləri, cos-un işarəsi mənfi.)` : "") };
      } },
    { id: "eynilik", ad: "sin² α + cos² α = 1", izah: "Birini bilirsən — o birini tap. α kəskin bucaqdır.",
      gen() {
        const [p, q, c] = pick(TRIPLES), g = gcd(gcd(p, q), c), P = p / g, Q = q / g, C = c / g;
        const given = pick(["sin", "cos"]), want = pick(given === "sin" ? ["cos", "tg"] : ["sin", "tg"]);
        const sinv = [P, C], cosv = [Q, C];
        const gv = given === "sin" ? sinv : cosv;
        const ans = want === "cos" ? cosv : want === "sin" ? sinv : [P, Q];
        return { text: `α kəskin bucaqdır və ${given} α = ${gv[0]}/${gv[1]}. ${want} α = ?`, answer: ans[0] / ans[1], show: frac(ans[0], ans[1]), placeholder: "məs. 4/5",
          solution: `${given}² α + ${given === "sin" ? "cos" : "sin"}² α = 1 → ${given === "sin" ? "cos" : "sin"} α = √(1 − ${gv[0] ** 2}/${gv[1] ** 2}) = ${frac(given === "sin" ? Q : P, C)}.` + (want === "tg" ? ` tg α = sin α / cos α = ${frac(P, Q)}.` : "") };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const d = pick([30, 60]), c = pick([6, 8, 10, 12]), wantOpp = Math.random() < .5;
        const f = wantOpp ? "sin" : "cos", v = c * SPECIAL[f][d][1];
        const steps = [
          `1) α-${wantOpp ? "nın qarşısındakı" : "ya bitişik"} katet axtarılır, hipotenuz ${c}-dir.`,
          `2) ${wantOpp ? "qarşı" : "bitişik"} = hipotenuz · ${f} α = ${c} · ${f} ${d}°.`,
          `3) ${f} ${d}° = ${SPECIAL[f][d][0]}, ona görə cavab ${fmt(v)}.`,
        ];
        const bad = rnd(0, 2), other = f === "sin" ? "cos" : "sin";
        if (bad === 0) steps[0] = `1) α-${wantOpp ? "ya bitişik" : "nın qarşısındakı"} katet axtarılır, hipotenuz ${c}-dir.`;
        if (bad === 1) steps[1] = `2) ${wantOpp ? "qarşı" : "bitişik"} = hipotenuz · ${other} α = ${c} · ${other} ${d}°.`;
        if (bad === 2) steps[2] = `3) ${f} ${d}° = ${SPECIAL[other][d][0]}, ona görə cavab ${fmt(c * SPECIAL[other][d][1])}.`;
        const text = h("div", {}, h("p", {}, `Məsələ: hipotenuz ${c}, α = ${d}°. α-${wantOpp ? "nın qarşısındakı" : "ya bitişik"} katet = ?`),
          h("ol", { class: "oy-steps" }, ...steps.map(s => h("li", {}, s.slice(3)))));
        const why = ["1-ci addımda tərəf səhv adlandırılıb — məsələ başqa katet soruşur.", `2-ci addımda funksiya səhvdir: ${wantOpp ? "qarşı katet üçün sin" : "bitişik katet üçün cos"} lazımdır.`, `3-cü addımda qiymət səhvdir: ${f} ${d}° = ${SPECIAL[f][d][0]}.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci", "2-ci", "3-cü"][bad] + " addım", solution: why };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (sin/cos swapped, sign in the II quarter, a reciprocal, squares forgotten, ...).
  const { ae, again } = Oyun;
  const isNice = (x, dp = 2) => isFinite(x) && Math.abs(Math.round(x * 10 ** dp) - x * 10 ** dp) < 1e-7;
  const dec = x => { const r = Math.round(x * 1e4) / 1e4; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const neg = s => "−" + s;
  // exact value n·√r / d of sin, cos, tg at 30°, 45°, 60°; rad(c, m) = c · (that value) written as a reduced expression
  const VAL = { sin: { 30: { n: 1, d: 2, r: 1 }, 45: { n: 1, d: 2, r: 2 }, 60: { n: 1, d: 2, r: 3 } },
    cos: { 30: { n: 1, d: 2, r: 3 }, 45: { n: 1, d: 2, r: 2 }, 60: { n: 1, d: 2, r: 1 } },
    tg: { 30: { n: 1, d: 3, r: 3 }, 45: { n: 1, d: 1, r: 1 }, 60: { n: 1, d: 1, r: 3 } } };
  const rad = (c, m) => { const g = gcd(c * m.n, m.d), nu = c * m.n / g, de = m.d / g;
    if (m.r === 1) return de === 1 ? String(nu) : nu + "/" + de;
    const t = (nu === 1 ? "" : nu) + "√" + m.r; return de === 1 ? t : t + "/" + de; };
  const inv = m => m.r === 1 ? { n: m.d, d: m.n, r: 1 } : { n: m.d, d: m.n * m.r, r: m.r };
  const SQ = { sin: { 30: [.25, "1/4"], 45: [.5, "1/2"], 60: [.75, "3/4"] }, cos: { 30: [.75, "3/4"], 45: [.5, "1/2"], 60: [.25, "1/4"] }, tg: { 30: [1 / 3, "1/3"], 45: [1, "1"], 60: [3, "3"] } };
  const REDUCED = TRIPLES.map(([p, q, c]) => { const g = gcd(gcd(p, q), c); return [p / g, q / g, c / g]; }).filter((t, i, a) => a.findIndex(u => u.join() === t.join()) === i);

  // ladder against a wall: the angle with the ground, the ladder length; the asked segment is red and dashed
  function ladder(c, d, ask) {
    const g = sv("svg", { viewBox: "0 0 260 190", class: "oy-svg", role: "img", "aria-label": "Divara söykənmiş nərdivan" });
    const r = d * Math.PI / 180, L = 150, wx = 220, gy = 165, fx = wx - L * Math.cos(r), ty = gy - L * Math.sin(r);
    g.append(sv("line", { x1: 10, y1: gy, x2: 245, y2: gy, stroke: "#17171a", "stroke-width": 2 }));
    g.append(sv("line", { x1: wx, y1: gy, x2: wx, y2: 14, stroke: "#17171a", "stroke-width": 4 }));
    g.append(sv("line", { x1: fx, y1: gy, x2: wx, y2: ty, stroke: "#534ab7", "stroke-width": 3.5, "stroke-linecap": "round" }));
    if (ask === "h") {
      g.append(sv("line", { x1: wx - 8, y1: gy, x2: wx - 8, y2: ty, stroke: "#a32d2d", "stroke-width": 2.5, "stroke-dasharray": "5 4" }));
      g.append(sv("text", { x: wx - 14, y: (gy + ty) / 2 + 4, "text-anchor": "end", class: "oy-lbl" }, "?"));
    } else {
      g.append(sv("line", { x1: fx, y1: gy + 8, x2: wx, y2: gy + 8, stroke: "#a32d2d", "stroke-width": 2.5, "stroke-dasharray": "5 4" }));
      g.append(sv("text", { x: (fx + wx) / 2, y: gy + 22, "text-anchor": "middle", class: "oy-lbl" }, "?"));
    }
    const mx = (fx + wx) / 2, my = (gy + ty) / 2;
    g.append(sv("text", { x: mx - 20 * Math.sin(r), y: my - 20 * Math.cos(r) + 4, "text-anchor": "middle", class: "oy-lbl" }, c + " m"));
    g.append(sv("path", { d: `M${fx + 30} ${gy}A30 30 0 0 0 ${fx + 30 * Math.cos(r)} ${gy - 30 * Math.sin(r)}`, fill: "none", stroke: "#534ab7", "stroke-width": 2 }));
    g.append(sv("text", { x: fx + 52 * Math.cos(r / 2) - 4, y: gy - 52 * Math.sin(r / 2) * .6 + 4, "text-anchor": "middle", class: "oy-alpha" }, d + "°"));
    return g;
  }

  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. ratios of a right triangle from the two legs (the hypotenuse is not given)
    { tip: "qapali", gen: () => again(() => {
      const [p, q, c] = pick(REDUCED), k = pick([1, 1, 2]), a = p * k, b = q * k, hy = c * k, at = pick(["A", "B"]), r = roles(at);
      const len = { CA: a, CB: b }, opp = len[r.opp], adj = len[r.adj], f = pick(["sin", "cos", "tg"]);
      const F = (x, y) => frac(x, y);
      const R = { sin: [F(opp, hy), [F(adj, hy), F(opp, adj), F(hy, opp), F(adj, opp)], "qarşı / hipotenuz", "bitişik / hipotenuz (cos), qarşı / bitişik (tg), nisbəti tərsinə yazmaq"],
        cos: [F(adj, hy), [F(opp, hy), F(opp, adj), F(hy, adj), F(adj, opp)], "bitişik / hipotenuz", "qarşı / hipotenuz (sin), qarşı / bitişik (tg), nisbəti tərsinə yazmaq"],
        tg: [F(opp, adj), [F(adj, opp), F(opp, hy), F(adj, hy), F(hy, adj)], "qarşı / bitişik", "nisbəti tərsinə yazmaq (ctg), hipotenuza bölmək (sin, cos)"] }[f];
      return mc(ae(R[0], R[1], x => x), { text: `Şəkildəki düzbucaqlı üçbucağın katetləri: ${a} və ${b}. α bucağı üçün ${f} α neçəyə bərabərdir?`,
        svg: triangle(a, b, at, { CA: String(a), CB: String(b), AB: "" }, null),
        solution: `Hipotenuz Pifaqordan: √(${a}² + ${b}²) = ${hy}. ${f} α = ${R[2]} = ${R[0]}. Tələlər: ${R[3]}.` });
    }) },
    // 2. special angles inside squares: m·sin²x + n·tg²y − k·cos²z
    { tip: "qapali", gen: () => again(() => {
      const A = [30, 45, 60], x = pick(A), y = pick([30, 60]), z = pick(A), m = rnd(2, 8), n = 3 * rnd(1, 3), k = rnd(2, 8), y2 = 90 - y;
      const s = a => SQ.sin[a][0], t = a => SQ.tg[a][0], c = a => SQ.cos[a][0];
      const val = (sx, ty, cz, sg = -1) => m * sx + n * ty + sg * k * cz;
      const right = val(s(x), t(y), c(z));
      const w = [val(c(x), t(y), s(z)), val(s(x), t(y2), c(z)), val(s(x), t(y), c(z), 1), val(c(x), t(y2), s(z))];
      if (![right, ...w].every(v => isNice(v, 2))) return null;
      return mc(ae(right, w, dec), { text: `Hesablayın: ${m} sin²${x}° + ${n} tg²${y}° − ${k} cos²${z}°`,
        solution: `sin²${x}° = ${SQ.sin[x][1]}, tg²${y}° = ${SQ.tg[y][1]}, cos²${z}° = ${SQ.cos[z][1]}. ${m} · ${SQ.sin[x][1]} + ${n} · ${SQ.tg[y][1]} − ${k} · ${SQ.cos[z][1]} = ${dec(right)}. Tələlər: sin ilə cos-u qarışdırmaq, tg 30° ilə tg 60°-ni dəyişmək, mənfi işarəni itirmək.` });
    }) },
    // 3. obtuse angle: the sign of cos decides the sign of tg
    { tip: "qapali", gen: () => again(() => {
      const [p, q, c] = pick(REDUCED), [sp, cq] = Math.random() < .5 ? [p, q] : [q, p];
      const right = neg(frac(sp, cq)), w = [frac(sp, cq), neg(frac(cq, sp)), frac(cq, sp), frac(sp, c - sp)];
      return mc(ae(right, w, x => x), { text: `α bucağı 90°-dən böyük, 180°-dən kiçikdir və sin α = ${sp}/${c}. tg α = ?`,
        solution: `cos²α = 1 − (${sp}/${c})² = (${cq}/${c})². α II rübdədir, orada cos mənfidir: cos α = −${cq}/${c}. tg α = sin α : cos α = −${frac(sp, cq)}. Tələlər: cos-un işarəsini unutmaq (${frac(sp, cq)}), tərsinə bölmək, cos = 1 − sin yazmaq (${frac(sp, c - sp)}).` });
    }) },
    // 4. a ladder: height or the distance from the wall (30°, 45°, 60°)
    { tip: "qapali", gen: () => again(() => {
      const d = pick([30, 60]), c = pick([4, 6, 8, 10, 12, 14, 16, 18, 20]), ask = pick(["h", "x"]), f = ask === "h" ? "sin" : "cos", o = ask === "h" ? "cos" : "sin";
      const right = rad(c, VAL[f][d]), w = [rad(c, VAL[o][d]), rad(c, inv(VAL[f][d])), rad(c, VAL.tg[d]), rad(c, inv(VAL[o][d]))];
      return mc(ae(right, w, x => x + " m"), { text: `Uzunluğu ${c} m olan nərdivan şəkildəki kimi divara söykənib və yerlə ${d}° bucaq əmələ gətirir. ${ask === "h" ? "Nərdivanın yuxarı ucu yerdən neçə metr hündürlükdədir" : "Nərdivanın aşağı ucu divardan neçə metr məsafədədir"}?`,
        svg: ladder(c, d, ask),
        solution: `${ask === "h" ? "Hündürlük = nərdivan · sin" : "Məsafə = nərdivan · cos"} ${d}° = ${c} · ${SPECIAL[f][d][0]} = ${right} m. Tələlər: sin ilə cos-u qarışdırmaq (${w[0]} m), vurmaq əvəzinə bölmək (${w[1]} m), tg götürmək (${w[2]} m).` });
    }) },
    // 5. unit circle: signs in the II quarter and the axis angle 180°
    { tip: "qapali", gen: () => again(() => {
      const ks = [rnd(2, 9), rnd(2, 9), rnd(2, 9)], sgn = [1, pick([1, -1]), pick([1, -1])];
      const T = [{ t: "cos 120°", v: -.5 }, { t: "sin 150°", v: .5 }, { t: "cos 180°", v: -1 }];
      const order = [0, 1, 2].sort(() => Math.random() - .5);
      const calc = (v120, v180) => order.reduce((s, i, pos) => s + sgn[pos] * ks[pos] * (i === 0 ? v120 : i === 2 ? v180 : .5), 0);
      const right = calc(-.5, -1), w = [calc(.5, -1), calc(-.5, 1), calc(-.5, 0), calc(.5, 1)];
      if (![right, ...w].every(v => isNice(v, 1))) return null;
      const txt = order.map((i, pos) => (pos === 0 ? "" : sgn[pos] < 0 ? " − " : " + ") + ks[pos] + " " + T[i].t).join("");
      return mc(ae(right, w, dec), { text: `Hesablayın: ${txt}`,
        solution: `Vahid çevrədə: cos 120° = −1/2 (II rübdə cos mənfidir), sin 150° = 1/2, cos 180° = −1. Yerinə qoyuruq: ${dec(right)}. Tələlər: cos 120° = +1/2 yazmaq, cos 180° = 1 və ya 0 yazmaq.` });
    }) },
    // 6. (sin α + cos α)² gives the product sin α · cos α
    { tip: "qapali", gen: () => again(() => {
      const [p, q, c] = pick(REDUCED), right = frac(p * q, c * c);
      const w = [frac((p + q) ** 2, c * c), frac(2 * p * q, c * c), frac((p + q) ** 2 + c * c, 2 * c * c), frac(p + q - c, 2 * c)];
      return mc(ae(right, w, x => x), { text: `α iti bucaqdır və sin α + cos α = ${frac(p + q, c)}. sin α · cos α = ?`,
        solution: `Hər iki tərəfi kvadrata yüksəldirik: sin²α + 2 sin α cos α + cos²α = ${frac((p + q) ** 2, c * c)}. sin²α + cos²α = 1, ona görə 2 sin α cos α = ${frac((p + q) ** 2 - c * c, c * c)}, sin α cos α = ${right}. Tələlər: 2-yə bölməyi unutmaq (${w[1]}), kvadratı cavab yazmaq (${w[0]}), 1-i çıxmaq əvəzinə toplamaq (${w[2]}).` });
    }) },
    // 7. coded: tg given, a combination of sin and cos
    { tip: "kod", gen: () => again(() => {
      const [p, q, c] = pick(REDUCED), [sp, cq] = Math.random() < .5 ? [p, q] : [q, p], m1 = rnd(1, 3), m2 = rnd(1, 3), R = m1 * sp + m2 * cq;
      return { text: `α iti bucaqdır və tg α = ${sp}/${cq}. ${m1 * c} sin α + ${m2 * c} cos α ifadəsinin qiymətini tapın.`,
        answer: R, show: String(R), tol: 1e-6,
        solution: `tg α = ${sp}/${cq}: qarşı katet ${sp}, bitişik katet ${cq}, hipotenuz √(${sp}² + ${cq}²) = ${c}. sin α = ${sp}/${c}, cos α = ${cq}/${c}. ${m1 * c} · ${sp}/${c} + ${m2 * c} · ${cq}/${c} = ${m1 * sp} + ${m2 * cq} = ${R}.` };
    }) },
    // 8. coded: a side of a right triangle with 30°, 45° or 60° (an exact answer: the roots cancel)
    { tip: "kod", gen: () => again(() => {
      const a = rnd(2, 15), S3 = a * Math.sqrt(3), form = pick([1, 2, 3, 4]);
      const F = [
        null,
        { adj: a, opp: S3, lab: { CB: a + "√3" }, hl: "AB", ans: 2 * a, q: `α = 60°, α-nın qarşısındakı katetin uzunluğu ${a}√3 santimetrdir. Hipotenuzun uzunluğu neçə santimetrdir?`,
          sol: `sin 60° = qarşı : hipotenuz = √3/2. Deməli hipotenuz = ${a}√3 : (√3/2) = ${a}√3 · 2/√3 = ${2 * a} sm.` },
        { adj: S3, opp: a, lab: { CA: a + "√3" }, hl: "CB", ans: a, q: `α = 30°, α-ya bitişik katetin uzunluğu ${a}√3 santimetrdir. α-nın qarşısındakı katetin uzunluğu neçə santimetrdir?`,
          sol: `tg 30° = qarşı : bitişik = √3/3. Qarşı katet = ${a}√3 · √3/3 = ${a} · 3/3 = ${a} sm.` },
        { adj: a, opp: a, lab: { AB: a + "√2" }, hl: "CA", ans: a, q: `α = 45°, hipotenuzun uzunluğu ${a}√2 santimetrdir. α-ya bitişik katetin uzunluğu neçə santimetrdir?`,
          sol: `cos 45° = bitişik : hipotenuz = √2/2. Bitişik katet = ${a}√2 · √2/2 = ${a} · 2/2 = ${a} sm.` },
        { adj: S3, opp: a, lab: { CA: a + "√3" }, hl: "AB", ans: 2 * a, q: `α = 30°, α-ya bitişik katetin uzunluğu ${a}√3 santimetrdir. Hipotenuzun uzunluğu neçə santimetrdir?`,
          sol: `cos 30° = bitişik : hipotenuz = √3/2. Hipotenuz = ${a}√3 : (√3/2) = ${a}√3 · 2/√3 = ${2 * a} sm.` },
      ][form];
      const labels = { CA: "", CB: "", AB: "", ...F.lab, [F.hl]: "?" };
      return { text: F.q, svg: triangle(F.adj, F.opp, "A", labels, F.hl), answer: F.ans, show: String(F.ans), tol: 1e-6, unit: "sm", solution: F.sol };
    }) },
    // 9. coded: obtuse alpha, the sign of cos
    { tip: "kod", gen: () => again(() => {
      const [p, q, c] = pick(REDUCED), [sp, cq] = Math.random() < .5 ? [p, q] : [q, p], kk = rnd(1, 3), R = kk * (c + cq);
      return { text: `α bucağı 90°-dən böyük, 180°-dən kiçikdir və sin α = ${sp}/${c}. ${kk * c} · (1 − cos α) ifadəsinin qiymətini tapın.`,
        answer: R, show: String(R), tol: 1e-6,
        solution: `cos²α = 1 − ${sp}²/${c}² = ${cq}²/${c}². II rübdə cos mənfidir: cos α = −${cq}/${c}. ${kk * c} · (1 + ${cq}/${c}) = ${kk * c} + ${kk * cq} = ${R}. Tələ: cos-u müsbət götürsən ${kk * (c - cq)} alınar.` };
    }) },
    // 10. written: tg and the perimeter give the hypotenuse
    { tip: "yazili", gen: () => again(() => {
      const [p, q, c] = pick(REDUCED), [sp, cq] = Math.random() < .5 ? [p, q] : [q, p], k = rnd(2, 9), L = (p + q + c) * k, ans = c * k;
      return { text: `Düzbucaqlı üçbucağın iti bucaqlarından biri α-dır, tg α = ${sp}/${cq}. Üçbucağın perimetri: ${L} sm. Hipotenuzun uzunluğunu (sm) tapın.`,
        svg: triangle(cq, sp, "A", { CA: "", CB: "", AB: "" }, null), answer: ans, show: String(ans), tol: 1e-6, unit: "sm",
        solution: `1) tg α = qarşı : bitişik = ${sp}/${cq}, deməli katetlər ${sp}x və ${cq}x olsun. 2) Pifaqor: hipotenuz = √((${sp}x)² + (${cq}x)²) = ${c}x. 3) Perimetr: ${sp}x + ${cq}x + ${c}x = ${p + q + c}x = ${L}, x = ${k}. 4) Hipotenuz = ${c} · ${k} = ${ans} sm. Həll yazılmadan yalnız cavab — bal verilmir.` };
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
      key: "triqonometriya-1", title: "Triqonometriya", fenn: "riyaziyyat", link: "dersler/triqonometriya-1.html",
      format: "Cavab yazmaq: kəsr 3/5, kök 5√3 və ya √3/2, mənfi −1/2, onluq 8.66 (vergül də olar).",
      levels, imtahan: IMT, oyunEl, testEl,
      test: { n: 10, pass: 8, from: ["nisbet", "xususi", "xususi", "teref", "teref", "teref", "cevre", "cevre", "eynilik", "eynilik"] },
      goTest: () => document.getElementById("tb-sinaq").click(),
      goGame: () => document.getElementById("tb-oyun").click(),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/triqonometriya-1.html")) b.push("dersler/triqonometriya-1.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
    window.__trigGame = game; window.__trigLevels = levels;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
