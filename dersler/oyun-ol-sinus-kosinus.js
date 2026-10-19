// Olimpiada · Sinuslar və kosinuslar teoremi — oyun səviyyələri.
// `answer` Math ilə müstəqil hesablanır, `show` düsturla çıxan dəqiq formadır (harness ikisini tutuşdurur).
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const D = Math.PI / 180;
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; p /= g; q /= g; return (p < 0 ? "−" : "") + (q === 1 ? Math.abs(p) : Math.abs(p) + "/" + q); };
  const sqf = n => { let k = 1, m = n; for (let f = 2; f * f <= m; f++) while (m % (f * f) === 0) { m /= f * f; k *= f; } return [k, m]; };
  const fm = n => String(Math.round(n * 100) / 100).replace(".", ",");

  // Dəqiq ədədlər: {r: [n, d]} = Σ (n/d)·√r
  const rat = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return [n / g, d / g]; };
  const eMul = (A, B) => { const R = {}; for (const r1 in A) for (const r2 in B) { const [k, m] = sqf(r1 * r2); const n = A[r1][0] * B[r2][0] * k, d = A[r1][1] * B[r2][1]; const c = R[m] || [0, 1]; R[m] = rat(c[0] * d + n * c[1], c[1] * d); } for (const m in R) if (!R[m][0]) delete R[m]; return R; };
  const eScale = (A, n, d = 1) => eMul(A, { 1: [n, d] });
  const eInv = B => { const r = Object.keys(B)[0], [n, d] = B[r]; return { [r]: rat(d, n * r) }; }; // 1/(c√r) = (d/(n r))·√r
  const sqrtE = N => { const [k, m] = sqf(N); return { [m]: [k, 1] }; };
  function fmtE(E) {
    const ks = Object.keys(E).map(Number).sort((a, b) => a - b);
    if (!ks.length) return "0"; if (ks.length > 2) return null;
    return ks.map((r, i) => { const [n, d] = E[r], an = Math.abs(n);
      const body = r === 1 ? (d === 1 ? "" + an : an + "/" + d) : (an === 1 ? "" : an) + "√" + r + (d === 1 ? "" : "/" + d);
      return (n < 0 ? (i ? " − " : "−") : (i ? " + " : "")) + body; }).join("");
  }
  const BASE = { 30: { 1: [1, 2] }, 45: { 2: [1, 2] }, 60: { 3: [1, 2] }, 90: { 1: [1, 1] } };
  const sinE = deg => { if (deg > 90) deg = 180 - deg; if (!(deg in BASE)) throw new Error("not special"); return BASE[deg]; };
  const NA = [30, 45, 60, 90, 120, 135, 150];
  const par = s => /[\s+−]/.test(s.slice(1)) || s.includes("/") ? "(" + s + ")" : s;

  // Üçbucaq şəkli: ang — bucaqlar (dərəcə), lab — yazılar: {a,b,c} tərəflər, {A,B,C} bucaqlar
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  function tri(ang, lab) {
    const names = ["A", "B", "C"], r0 = rnd(0, 2), o = [names[r0], names[(r0 + 1) % 3], names[(r0 + 2) % 3]], fl = Math.random() < .5 ? -1 : 1;
    const len = v => Math.sin(ang[v] * D), P = {};
    P[o[0]] = [0, 0]; P[o[1]] = [len(o[2]), 0]; P[o[2]] = [len(o[1]) * Math.cos(ang[o[0]] * D), -len(o[1]) * Math.sin(ang[o[0]] * D)];
    for (const k in P) P[k] = [P[k][0] * fl, P[k][1]];
    const W = 280, H = 200, pad = 38, xs = names.map(k => P[k][0]), ys = names.map(k => P[k][1]);
    const w = Math.max(...xs) - Math.min(...xs), hh = Math.max(...ys) - Math.min(...ys), s = Math.min((W - 2 * pad) / w, (H - 2 * pad) / hh);
    const ox = (W - s * w) / 2 - s * Math.min(...xs), oy = (H - s * hh) / 2 - s * Math.min(...ys);
    for (const k in P) P[k] = [ox + s * P[k][0], oy + s * P[k][1]];
    const cen = [(P.A[0] + P.B[0] + P.C[0]) / 3, (P.A[1] + P.B[1] + P.C[1]) / 3];
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Üçbucaq" });
    const out = (p, d) => { const v = [p[0] - cen[0], p[1] - cen[1]], L = Math.hypot(...v) || 1; return [p[0] + v[0] / L * d, p[1] + v[1] / L * d]; };
    g.append(sv("path", { d: `M${P.A[0]} ${P.A[1]}L${P.B[0]} ${P.B[1]}L${P.C[0]} ${P.C[1]}Z`, fill: "none", stroke: "#17171a", "stroke-width": 2, "stroke-linejoin": "round" }));
    for (const v of names) {
      const q = out(P[v], 15); g.append(sv("text", { x: q[0], y: q[1] + 5, "text-anchor": "middle", class: "oy-lbl" }, v));
      const [u, w2] = names.filter(n => n !== v);
      const m = [(P[u][0] + P[w2][0]) / 2, (P[u][1] + P[w2][1]) / 2];
      if (lab[v.toLowerCase()]) { const t = out(m, 15); g.append(sv("text", { x: t[0], y: t[1] + 5, "text-anchor": "middle", class: "oy-lbl" }, lab[v.toLowerCase()])); }
      if (lab[v]) {
        const V = P[v], an = p => Math.atan2(P[p][1] - V[1], P[p][0] - V[0]);
        let t1 = an(u), t2 = an(w2); if (Math.abs(t2 - t1) > Math.PI) t2 += t2 < t1 ? 2 * Math.PI : -2 * Math.PI;
        const R = 20, pts = Array.from({ length: 9 }, (_, i) => { const t = t1 + (t2 - t1) * i / 8; return (V[0] + R * Math.cos(t)) + " " + (V[1] + R * Math.sin(t)); });
        g.append(sv("path", { d: "M" + pts.join("L"), fill: "none", stroke: "#534ab7", "stroke-width": 2 }));
        const tm = (t1 + t2) / 2, rr = ang[v] < 50 ? 44 : 34;
        g.append(sv("text", { x: V[0] + rr * Math.cos(tm), y: V[1] + rr * Math.sin(tm) + 4, "text-anchor": "middle", class: "oy-alpha", style: "font-size:13px" }, lab[v]));
      }
    }
    return g;
  }
  // üç tərəfdən bucaqlar (a = BC, b = CA, c = AB)
  const angs = (a, b, c) => ({ A: Math.acos((b * b + c * c - a * a) / (2 * b * c)) / D, B: Math.acos((a * a + c * c - b * b) / (2 * a * c)) / D, C: Math.acos((a * a + b * b - c * c) / (2 * a * b)) / D });

  const E60 = [[3, 8, 7], [5, 8, 7], [7, 15, 13], [8, 15, 13], [5, 21, 19]], E120 = [[3, 5, 7], [7, 8, 13], [5, 16, 19], [11, 24, 31]];
  function twoSides(C) { // iki tərəf + aralarındakı C (60 və ya 120) → [a, b, N=c²]
    let a, b;
    if (Math.random() < .65) { const t = pick(C === 60 ? E60 : E120), k = pick([1, 1, 2]); a = t[0] * k; b = t[1] * k; if (Math.random() < .5) [a, b] = [b, a]; }
    else { a = rnd(2, 12); b = rnd(2, 12); }
    return [a, b, a * a + b * b + (C === 60 ? -a * b : a * b)];
  }
  const rootTxt = N => { const [k, m] = sqf(N); return m === 1 ? String(k) : (k > 1 ? k : "") + "√" + m; };
  const HERON = [[13, 14, 15], [5, 5, 6], [10, 13, 13], [10, 17, 21], [9, 10, 17], [6, 25, 29], [7, 15, 20], [16, 17, 17], [11, 13, 20], [3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];

  const levels = [
    { id: "sinus", ad: "Sinuslar teoremi: tərəfi tap", izah: "a/sin A = b/sin B. İki bucaq və bir tərəf verilib. Cavabı ədəd və ya k√n kimi yaz.",
      gen() {
        let A, B; do { A = pick(NA); B = pick(NA); } while (A + B >= 180 || A === B);
        const a = rnd(2, 14), E = eScale(eMul(sinE(B), eInv(sinE(A))), a);
        return { text: `ABC üçbucağında a = BC = ${a}, ∠A = ${A}°, ∠B = ${B}°. b = CA = ?`, svg: tri({ A, B, C: 180 - A - B }, { a: String(a), b: "?", A: A + "°", B: B + "°" }),
          answer: a * Math.sin(B * D) / Math.sin(A * D), show: fmtE(E), placeholder: "məs. 6√2",
          solution: `Sinuslar teoremi: a/sin A = b/sin B. Buradan b = a·sin B/sin A = ${a}·${par(fmtE(sinE(B)))} / ${par(fmtE(sinE(A)))} = ${fmtE(E)}.` };
      } },
    { id: "r", ad: "Çevrəxarici çevrənin radiusu", izah: "a/sin A = 2R. R-i tap, ya da R-dən tərəfi. Obtuz bucaq olanda da sin A müsbətdir.",
      gen() {
        let A, B; do { A = pick(NA); B = pick([30, 45, 60]); } while (A + B >= 180);
        const ang = { A, B, C: 180 - A - B };
        if (Math.random() < .65) {
          const a = rnd(2, 15), E = eScale(eInv(sinE(A)), a, 2);
          return { text: `ABC üçbucağında a = BC = ${a}, ∠A = ${A}°. Üçbucağın çevrəxarici çevrəsinin radiusu R = ?`, svg: tri(ang, { a: String(a), A: A + "°" }),
            answer: a / (2 * Math.sin(A * D)), show: fmtE(E), placeholder: "məs. 5√3/3",
            solution: `a/sin A = 2R, buradan R = a/(2 sin A) = ${a}/(2·${par(fmtE(sinE(A)))}) = ${fmtE(E)}.${A > 90 ? ` (∠A obtuzdur, amma sin ${A}° = sin ${180 - A}°.)` : ""}` };
        }
        const R = rnd(2, 12), E = eScale(sinE(A), 2 * R);
        return { text: `ABC üçbucağının çevrəxarici çevrəsinin radiusu R = ${R}, ∠A = ${A}°. a = BC = ?`, svg: tri(ang, { a: "?", A: A + "°" }),
          answer: 2 * R * Math.sin(A * D), show: fmtE(E), placeholder: "məs. 6√3",
          solution: `a = 2R·sin A = 2·${R}·${par(fmtE(sinE(A)))} = ${fmtE(E)}.` };
      } },
    { id: "kosinus", ad: "Kosinuslar teoremi: tərəfi tap", izah: "c² = a² + b² − 2ab·cos C. İki tərəf və aralarındakı 60° ya da 120° bucaq verilib. Cavab tam ədəd və ya k√n.",
      gen() {
        const C = pick([60, 120]), [a, b, N] = twoSides(C), c = Math.sqrt(N), an = angs(a, b, c);
        return { text: `ABC üçbucağında BC = ${a}, CA = ${b}, ∠C = ${C}°. AB = ?`, svg: tri(an, { a: String(a), b: String(b), c: "?", C: C + "°" }),
          answer: Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * D)), show: fmtE(sqrtE(N)), placeholder: "məs. 7 və ya 2√19",
          solution: `c² = a² + b² − 2ab·cos C = ${a * a} + ${b * b} − 2·${a}·${b}·(${C === 60 ? "1/2" : "−1/2"}) = ${a * a} + ${b * b} ${C === 60 ? "−" : "+"} ${a * b} = ${N}. c = √${N}${rootTxt(N) === "√" + N ? "" : " = " + rootTxt(N)}.` };
      } },
    { id: "burucu", minVariety: 25, ad: "Üç tərəfdən bucaq", izah: "cos C = (a² + b² − c²)/(2ab). Ya bucağın kosinusunu (kəsr), ya da bucağın özünü (dərəcə) tap.",
      gen() {
        if (Math.random() < .45) {
          const C = pick([60, 120]), t = pick(C === 60 ? E60 : E120), k = pick([1, 1, 2]);
          let a = t[0] * k, b = t[1] * k; const c = t[2] * k; if (Math.random() < .5) [a, b] = [b, a];
          const num = a * a + b * b - c * c, den = 2 * a * b;
          return { text: `Üçbucağın tərəfləri ${a}, ${b} və ${c}-dir. ${c} uzunluqlu tərəfin qarşısındakı bucaq neçə dərəcədir?`, svg: tri(angs(a, b, c), { a: String(a), b: String(b), c: String(c), C: "?" }),
            answer: Math.acos((a * a + b * b - c * c) / (2 * a * b)) / D, unit: "°", tol: 0.01, show: C + "°",
            solution: `cos C = (a² + b² − c²)/(2ab) = (${a * a} + ${b * b} − ${c * c})/(2·${a}·${b}) = ${num}/${den} = ${frac(num, den)}. cos C = ${C === 60 ? "1/2" : "−1/2"} olan bucaq ${C}°-dir.` };
        }
        let a, b, c;
        do { a = rnd(3, 9); b = rnd(3, 9); c = rnd(Math.abs(a - b) + 1, a + b - 1); } while (c < Math.max(a, b) || c === a || c === b);
        const num = a * a + b * b - c * c, den = 2 * a * b;
        return { text: `Üçbucağın tərəfləri ${a}, ${b} və ${c}-dir (${c} ən böyük tərəfdir). ${c} uzunluqlu tərəfin qarşısındakı bucağın kosinusu nəyə bərabərdir?`, svg: tri(angs(a, b, c), { a: String(a), b: String(b), c: String(c), C: "?" }),
          answer: Math.cos(angs(a, b, c).C * D), show: frac(num, den), placeholder: "məs. −1/4",
          solution: `cos C = (a² + b² − c²)/(2ab) = (${a * a} + ${b * b} − ${c * c})/(2·${a}·${b}) = ${num}/${den}${frac(num, den) === num + "/" + den ? "" : " = " + frac(num, den)}.${num < 0 ? " Mənfidir — bucaq obtuzdur." : ""}` };
      } },
    { id: "sahe", ad: "Üçbucağın sahəsi və R", izah: "S = ½ab·sin C = abc/(4R). Bucaq verilib, ya da üç tərəfdən əvvəl cos C, sonra sin C tap. Kəsr ola bilər (məs. 65/8).",
      gen() {
        if (Math.random() < .4) {
          const C = pick([30, 45, 60, 120, 135, 150]), a = rnd(2, 14), b = rnd(2, 14), c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C * D));
          const E = eScale(sinE(C), a * b, 2);
          return { text: `ABC üçbucağında BC = ${a}, CA = ${b}, ∠C = ${C}°. Üçbucağın sahəsi S = ?`, svg: tri(angs(a, b, c), { a: String(a), b: String(b), C: C + "°" }),
            answer: 0.5 * a * b * Math.sin(C * D), show: fmtE(E), placeholder: "məs. 12√3",
            solution: `S = ½·a·b·sin C = ½·${a}·${b}·${par(fmtE(sinE(C)))} = ${fmtE(E)}.${C > 90 ? ` (sin ${C}° = sin ${180 - C}°.)` : ""}` };
        }
        const t = pick(HERON), k = pick([1, 1, 2]), sides = t.map(x => x * k), [x, y, z] = sides.slice().sort((p, q) => p - q);
        const s = (x + y + z) / 2, S2 = s * (s - x) * (s - y) * (s - z), S = Math.round(Math.sqrt(S2));
        if (S * S !== S2) return this.gen();
        const num = x * x + y * y - z * z, den = 2 * x * y, sinC = frac(2 * S, x * y);
        const wantR = Math.random() < .5, sh = [x, y, z].sort(() => Math.random() - .5);
        const steps = `Ən böyük tərəfin (${z}) qarşısındakı C bucağını tap: cos C = (${x * x} + ${y * y} − ${z * z})/(2·${x}·${y}) = ${frac(num, den)}. sin C = √(1 − cos²C) = ${sinC}. S = ½·${x}·${y}·${sinC} = ${S}.`;
        const an = angs(x, y, z);
        return wantR
          ? { text: `Üçbucağın tərəfləri ${sh.join(", ")}-dir. Çevrəxarici çevrənin radiusu R = ?`, svg: tri(an, { a: String(x), b: String(y), c: String(z) }), answer: x * y * z / (4 * S), show: frac(x * y * z, 4 * S), placeholder: "məs. 65/8",
            solution: steps + ` R = abc/(4S) = ${x}·${y}·${z}/(4·${S}) = ${frac(x * y * z, 4 * S)}.` }
          : { text: `Üçbucağın tərəfləri ${sh.join(", ")}-dir. Sahəsi S = ?`, svg: tri(an, { a: String(x), b: String(y), c: String(z) }), answer: S, show: String(S), placeholder: "tam ədəd",
            solution: steps };
      } },
    { id: "heyat", minVariety: 25, ad: "Həyatdan: məsafə və yol", izah: "Çətin ölçülən məsafəni teoremlə tap. Cavabı ədəd ya k√n kimi yaz.",
      gen() {
        if (Math.random() < .5) {
          let B, C, A; do { B = pick([30, 45, 60, 120, 135, 150]); C = pick([30, 45, 60, 120, 135, 150]); A = 180 - B - C; } while (A <= 0 || A === 90);
          const d = pick([20, 40, 60, 80, 100, 120, 150, 200]), E = eScale(eMul(sinE(B), eInv(sinE(C))), d);
          return { text: `Göl yolunun iki ucu A və B nöqtələridir, AB = ${d} m. Qarşı sahildəki C ağacına A nöqtəsindən baxanda ∠CAB = ${A}°, B nöqtəsindən baxanda ∠CBA = ${B}°. A nöqtəsindən ağaca qədər məsafə (AC) neçə metrdir?`,
            svg: tri({ A, B, C }, { c: String(d), A: A + "°", B: B + "°" }), answer: d * Math.sin(B * D) / Math.sin(C * D), unit: "m", show: fmtE(E) + " m", placeholder: "məs. 40√6",
            solution: `∠C = 180° − ${A}° − ${B}° = ${C}°. Sinuslar teoremi: AC/sin B = AB/sin C. AC = ${d}·sin ${B}°/sin ${C}° = ${d}·${par(fmtE(sinE(B)))} / ${par(fmtE(sinE(C)))} = ${fmtE(E)} m.` };
        }
        const C = pick([60, 120]), [u, v, N] = twoSides(C), c = Math.sqrt(N);
        return { text: `Limandan iki gəmi eyni anda yola çıxır, yolları arasındakı bucaq ${C}°-dir. Müəyyən vaxtdan sonra birinci gəmi ${u} km, ikinci gəmi ${v} km gedib. Aralarındakı məsafə neçə kilometrdir?`,
          svg: tri(angs(u, v, c), { a: String(u), b: String(v), c: "?", C: C + "°" }),
          answer: Math.sqrt(u * u + v * v - 2 * u * v * Math.cos(C * D)), unit: "km", show: fmtE(sqrtE(N)) + " km", placeholder: "məs. 13 km",
          solution: `Kosinuslar teoremi: d² = u² + v² − 2uv·cos ${C}° = ${u * u} + ${v * v} ${C === 60 ? "−" : "+"} ${u * v} = ${N}. d = √${N}${rootTxt(N) === "√" + N ? "" : " = " + rootTxt(N)} km.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Kosinuslar teoremi ilə üçüncü tərəfi tapan üç addımlı həll. Birində səhv var. Hansında?",
      gen() {
        const C = pick([60, 120]), [a, b, N] = twoSides(C), cs = C === 60 ? "1/2" : "−1/2", Nw = a * a + b * b + (C === 60 ? a * b : -a * b);
        const root = n => { const [k, m] = sqf(n); return `c = √${n}` + (m === 1 ? ` = ${k}` : k > 1 ? ` = ${k}√${m}` : ""); };
        const s = [`c² = a² + b² − 2ab·cos C`, `cos ${C}° = ${cs}, ona görə c² = ${a * a} + ${b * b} ${C === 60 ? "−" : "+"} ${a * b} = ${N}`, root(N)];
        const bad = rnd(0, 2);
        if (bad === 0) { s[0] = `c² = a² + b² + 2ab·cos C`; s[1] = `cos ${C}° = ${cs}, ona görə c² = ${a * a} + ${b * b} ${C === 60 ? "+" : "−"} ${a * b} = ${Nw}`; s[2] = root(Nw); }
        if (bad === 1) { s[1] = `cos ${C}° = ${C === 60 ? "−1/2" : "1/2"}, ona görə c² = ${a * a} + ${b * b} ${C === 60 ? "+" : "−"} ${a * b} = ${Nw}`; s[2] = root(Nw); }
        if (bad === 2) s[2] = `c = ${N}/2 = ${fm(N / 2)}`;
        const text = h("div", {}, h("p", {}, `Məsələ: üçbucağın iki tərəfi a = ${a}, b = ${b}, aralarındakı bucaq C = ${C}°. Üçüncü tərəf c = ?`), h("ol", { class: "oy-steps" }, ...s.map(x => h("li", {}, x))));
        const why = ["1-ci addımda düstur səhvdir: kosinuslar teoremində 2ab·cos C çıxılır: c² = a² + b² − 2ab·cos C.", `2-ci addımda cos ${C}° = ${cs} olmalıdır (${C === 60 ? "60° kəskindir, cos müsbətdir" : "120° obtuzdur, cos mənfidir"}).`, `3-cü addımda səhv var: c² = ${N} olduqda c = √${N} (kök alınır, ikiyə bölünmür).`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci", "2-ci", "3-cü"][bad] + " addım", solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-sinus-kosinus", title: "Sinuslar və kosinuslar teoremi", fenn: "olimpiada", link: "dersler/ol-sinus-kosinus.html",
      format: "Cavab ədəddir: tam 7, kəsr 65/8, kök 6√2 və ya 5√3/3, bucaq üçün dərəcə 120.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["sinus", "sinus", "r", "kosinus", "kosinus", "burucu", "sahe", "sahe", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-sinus-kosinus.html")) b.push("dersler/ol-sinus-kosinus.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
