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
    { id: "terefler", ad: "Tərəfləri tanı", izah: "Hipotenuz, qarşı katet, bitişik katet — hamısı α-ya görə.",
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
    { id: "xususi", ad: "30°, 45°, 60°", izah: "Cədvəli yadda saxla: kəsr və ya √ ilə yaz (√3/2).",
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
    { id: "cevre", ad: "Vahid çevrə", izah: "90°-dən böyük bucaqlar da. İşarəyə diqqət: II rübdə cos mənfidir.",
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
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: (bad + 1) + "-ci addım", solution: why };
      } },
  ];

  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "triqonometriya-1", title: "Triqonometriya", fenn: "riyaziyyat", link: "dersler/triqonometriya-1.html",
      format: "Cavab yazmaq: kəsr 3/5, kök 5√3 və ya √3/2, mənfi −1/2, onluq 8.66 (vergül də olar).",
      levels, oyunEl, testEl,
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
