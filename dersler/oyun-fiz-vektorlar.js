// Fizika · Vektorlar: proyeksiya və toplanma — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit?}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const S = n => n < 0 ? "−" + (-n) : String(n);
  // √N in simplest form: 50 → "5√2", 49 → "7", 0 → "0"
  const rt = N => { if (N === 0) return "0"; let k = 1, m = N; for (let d = 2; d * d <= m; d++) while (m % (d * d) === 0) { m /= d * d; k *= d; } return m === 1 ? String(k) : (k === 1 ? "" : k) + "√" + m; };
  const eqr = N => "√" + N + (rt(N) !== "√" + N ? " = " + rt(N) : "");      // "√50 = 5√2", but "√65" once
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);
  const sq = n => n < 0 ? "(" + S(n) + ")²" : n + "²";
  const TRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [15, 20, 25], [7, 24, 25]];

  // ---------- SVG ----------
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const f1 = n => (+n).toFixed(1);
  function arrow(g, x1, y1, x2, y2, color, w) {
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    g.append(sv("line", { x1: f1(x1), y1: f1(y1), x2: f1(x2 - 7 * ux), y2: f1(y2 - 7 * uy), stroke: color, "stroke-width": w || 2.5, "stroke-linecap": "round" }));
    const p = [[x2, y2], [x2 - 11 * ux + 4.5 * uy, y2 - 11 * uy - 4.5 * ux], [x2 - 11 * ux - 4.5 * uy, y2 - 11 * uy + 4.5 * ux]];
    g.append(sv("polygon", { points: p.map(q => f1(q[0]) + "," + f1(q[1])).join(" "), fill: color }));
  }
  const label = (g, x, y, t, cls) => g.append(sv("text", { x: f1(x), y: f1(y), "text-anchor": "middle", class: cls || "oy-lbl" }, t));

  // vector of length 72 from the centre at math angle th (deg); arc between the vector and half-axis at angle ax (deg)
  function projPic(th, ax, angText) {
    const g = sv("svg", { viewBox: "0 0 220 220", class: "oy-svg", role: "img", "aria-label": "Koordinat oxları və vektor" });
    const O = 110, P = (deg, r) => [O + r * Math.cos(deg * Math.PI / 180), O - r * Math.sin(deg * Math.PI / 180)];
    arrow(g, 18, O, 204, O, "var(--muted)", 1.5); arrow(g, O, 202, O, 16, "var(--muted)", 1.5);
    label(g, 200, O + 18, "x"); label(g, O + 14, 22, "y");
    const T = P(th, 78);
    g.append(sv("line", { x1: f1(T[0]), y1: f1(T[1]), x2: f1(T[0]), y2: O, stroke: "var(--muted)", "stroke-dasharray": "4 3" }));
    g.append(sv("line", { x1: f1(T[0]), y1: f1(T[1]), x2: O, y2: f1(T[1]), stroke: "var(--muted)", "stroke-dasharray": "4 3" }));
    arrow(g, O, O, T[0], T[1], "var(--vec)", 3);
    let a1 = ax, a2 = th; if (a2 - a1 > 180) a2 -= 360; if (a1 - a2 > 180) a1 -= 360;
    const lo = Math.min(a1, a2), hi = Math.max(a1, a2), A = P(lo, 26), B = P(hi, 26), M = P((lo + hi) / 2, 42);
    g.append(sv("path", { d: `M${f1(A[0])} ${f1(A[1])}A26 26 0 0 0 ${f1(B[0])} ${f1(B[1])}`, fill: "none", stroke: "var(--accent)", "stroke-width": 2 }));
    label(g, M[0], M[1] + 5, angText);
    const E = P(th, 96); label(g, E[0], E[1] + 5, "F");
    return g;
  }

  // ---------- exact projections ----------
  // |F·cos φ| for φ ∈ {30,45,60,90,0} as [coef, root]; F is even
  const cosEx = (F, phi) => ({ 0: [F, 1], 30: [F / 2, 3], 45: [F / 2, 2], 60: [F / 2, 1], 90: [0, 1] })[phi];
  const exStr = (sign, [c, m]) => c === 0 ? "0" : (sign < 0 ? "−" : "") + (m === 1 ? String(c) : (c === 1 ? "" : c) + "√" + m);
  const exVal = (sign, [c, m]) => sign * c * Math.sqrt(m);
  const COS = { 30: "√3/2", 45: "√2/2", 60: "1/2" };

  // ---------- figures ----------
  // [figure, question, N-factor f (answer = √(f·a²)), explanation]
  const FIG = [
    ["kv", "|AB⃗ + AD⃗|", 2, "Paraleloqram qaydası: AB⃗ + AD⃗ = AC⃗ (diaqonal). AC = a√2."],
    ["kv", "|AB⃗ − AD⃗|", 2, "AB⃗ − AD⃗ = DB⃗ (D-dən B-yə). Diaqonaldır: a√2."],
    ["kv", "|AB⃗ + AC⃗ + AD⃗|", 8, "AB⃗ + AD⃗ = AC⃗, ona görə cəm 2·AC⃗. Modulu 2·a√2."],
    ["kv", "|AB⃗ + BC⃗ + CD⃗|", 1, "Zəncir qaydası: AB⃗ + BC⃗ + CD⃗ = AD⃗. Modulu a."],
    ["kv", "|AB⃗ + CD⃗|", 0, "AB⃗ və CD⃗ bərabər uzunluqlu və əks yönəlib — cəmi sıfır vektordur."],
    ["kv", "|AB⃗ + CB⃗|", 2, "AB⃗ sağa yönəlib, CB⃗ (C-dən B-yə) aşağı; ikisinin də uzunluğu a və perpendikulyardır: √(a² + a²) = a√2."],
    ["uc", "|AB⃗ + AC⃗|", 3, "Paraleloqramın diaqonalı: a² + a² + 2a²·cos 60° = 3a² → a√3."],
    ["uc", "|AB⃗ − AC⃗|", 1, "AB⃗ − AC⃗ = CB⃗. Tərəfdir: a."],
    ["uc", "|AB⃗ + BC⃗ + CA⃗|", 0, "Zəncir A → B → C → A başladığı yerə qayıdır: cəm sıfırdır."],
    ["uc", "|AB⃗ + BC⃗|", 1, "Zəncir qaydası: AB⃗ + BC⃗ = AC⃗. Modulu a."],
    ["al", "|AB⃗ + AF⃗|", 1, "ABOF rombdur (O — mərkəz): AB⃗ + AF⃗ = AO⃗. AO = a."],
    ["al", "|AB⃗ + BC⃗ + CD⃗|", 4, "Zəncir: AB⃗ + BC⃗ + CD⃗ = AD⃗. AD — böyük diaqonal, 2a."],
    ["al", "|AB⃗ + BC⃗|", 3, "AB⃗ + BC⃗ = AC⃗. Bucaq B = 120°: AC² = a² + a² + a² = 3a² → a√3."],
    ["al", "|AB⃗ − AF⃗|", 3, "AB⃗ − AF⃗ = FB⃗. FB = a√3 (kiçik diaqonal)."],
    ["al", "|AB⃗ + AC⃗ + AD⃗ + AE⃗ + AF⃗|", 36, "Simmetriya: AB⃗ + AF⃗ = AO⃗ = AD⃗/2, AC⃗ + AE⃗ = 3·AD⃗/2 (hər biri a√3, AD ilə 30°). Cəm: AD⃗/2 + 3AD⃗/2 + AD⃗ = 3·AD⃗ → 3·2a = 6a."],
  ];
  const FIGNAME = { kv: "ABCD kvadratında", uc: "ABC bərabərtərəfli üçbucağında", al: "ABCDEF düzgün altıbucaqlısında" };
  function figPic(kind) {
    const g = sv("svg", { viewBox: "0 0 220 200", class: "oy-svg", role: "img", "aria-label": "Fiqur" });
    let pts;
    if (kind === "kv") pts = [[50, 160], [170, 160], [170, 40], [50, 40]];
    else if (kind === "uc") pts = [[40, 165], [180, 165], [110, 44]];
    else pts = [0, 1, 2, 3, 4, 5].map(i => [110 + 75 * Math.cos((240 + 60 * i) * Math.PI / 180), 100 - 75 * Math.sin((240 + 60 * i) * Math.PI / 180)]);
    g.append(sv("polygon", { points: pts.map(p => f1(p[0]) + "," + f1(p[1])).join(" "), fill: "none", stroke: "var(--ink)", "stroke-width": 2 }));
    const c = pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length], [0, 0]);
    pts.forEach((p, i) => { const d = [p[0] - c[0], p[1] - c[1]], L = Math.hypot(...d); label(g, p[0] + d[0] / L * 14, p[1] + d[1] / L * 14 + 5, "ABCDEF"[i]); });
    if (kind === "al") { g.append(sv("circle", { cx: 110, cy: 100, r: 2.5, fill: "var(--ink)" })); label(g, 118, 96, "O"); }
    return g;
  }

  const DIRS = { E: ["şərqə", 1, 0], W: ["qərbə", -1, 0], N: ["şimala", 0, 1], S: ["cənuba", 0, -1] };

  const levels = [
    { id: "proyeksiya", ad: "Proyeksiya", izah: "Bucaq hansı oxladır? Bucağa bitişik oxa proyeksiya — cos ilə, qarşı oxa — sin ilə. İşarəni istiqamət verir: sola/aşağı — mənfi.",
      gen() {
        const F = 2 * rnd(2, 15), phi = pick([30, 45, 60]), sx = pick([1, -1]), sy = pick([1, -1]);
        const toY = Math.random() < .5, askX = Math.random() < .5;
        const th = Math.atan2(sy * Math.sin(phi * Math.PI / 180), sx * Math.cos(phi * Math.PI / 180)) * 180 / Math.PI;
        const shown = toY ? 90 - phi : phi, axName = toY ? "Oy" : "Ox", axAng = toY ? (sy > 0 ? 90 : 270) : (sx > 0 ? 0 : 180);
        const ex = askX ? cosEx(F, phi) : cosEx(F, 90 - phi), sign = askX ? sx : sy;
        const adj = toY ? !askX : askX; // asked axis is the one the angle is measured from → cos
        const fn = adj ? "cos" : "sin";
        const sol = `Bucaq ${shown}° ${axName} oxu ilədir. ${askX ? "Fx" : "Fy"} ${adj ? "bu oxa bitişikdir → cos" : "qarşı oxdur → sin"}: |${askX ? "Fx" : "Fy"}| = ${F}·${fn} ${shown}° = ${F}·${COS[adj ? shown : 90 - shown]} = ${exStr(1, ex)} N. Vektor ${askX ? (sx > 0 ? "sağa" : "sola") : (sy > 0 ? "yuxarı" : "aşağı")} yönəlib → işarə ${sign > 0 ? "+" : "−"}. Cavab: ${exStr(sign, ex)} N.`;
        return { text: `Qüvvə F = ${F} N ${sx > 0 ? "sağa" : "sola"} və ${sy > 0 ? "yuxarı" : "aşağı"} yönəlib, ${axName} oxu ilə ${shown}° bucaq əmələ gətirir (şəkildə). ${askX ? "Fx" : "Fy"} = ? (işarə ilə)`,
          svg: projPic(th, axAng, shown + "°"), answer: exVal(sign, ex), show: exStr(sign, ex), unit: "N", placeholder: "məs. −5√3", solution: sol };
      } },
    { id: "modul", ad: "Proyeksiyadan modula", izah: "Proyeksiyalar düzbucaqlı üçbucağın katetləri, vektor — hipotenuzdur: |a⃗| = √(ax² + ay²).",
      gen() {
        const kind = pick(["comp", "comp", "other", "points"]);
        if (kind === "comp") {
          let ax, ay;
          if (Math.random() < .5) { const t = pick(TRI); [ax, ay] = Math.random() < .5 ? [t[0], t[1]] : [t[1], t[0]]; ax *= pick([1, -1]); ay *= pick([1, -1]); }
          else { ax = pick([1, -1]) * rnd(1, 9); ay = pick([1, -1]) * rnd(1, 9); }
          const N = ax * ax + ay * ay;
          return { text: `Sürət vektorunun proyeksiyaları: vx = ${S(ax)} m/s, vy = ${S(ay)} m/s. Sürətin modulu nəyə bərabərdir?`, answer: Math.sqrt(N), show: rt(N), unit: "m/s", placeholder: "məs. 13 və ya 2√5",
            solution: `v = √(vx² + vy²) = √(${sq(ax)} + ${sq(ay)}) = ${eqr(N)} m/s. Mənfi işarə kvadratda itir.` };
        }
        if (kind === "other") {
          const [a, b, c] = pick(TRI), k = pick([1, 2]), sw = Math.random() < .5, p = (sw ? b : a) * k, q = (sw ? a : b) * k, s = pick([1, -1]);
          return { text: `Qüvvənin modulu ${c * k} N, x oxuna proyeksiyası ${S(s * p)} N-dur. y oxuna proyeksiyasının modulunu tap.`, answer: q, show: String(q), unit: "N", tol: 0.01,
            solution: `|Fy| = √(F² − Fx²) = √(${c * k}² − ${p}²) = √${q * q} = ${q} N.` };
        }
        const x1 = rnd(-6, 6), y1 = rnd(-6, 6); let dx = 0, dy = 0; while (!dx || !dy) { dx = rnd(-8, 8); dy = rnd(-8, 8); }
        const N = dx * dx + dy * dy;
        return { text: `Cisim A(${S(x1)}; ${S(y1)}) nöqtəsindən B(${S(x1 + dx)}; ${S(y1 + dy)}) nöqtəsinə keçdi (koordinatlar metrlə). Yerdəyişmənin modulu nə qədərdir?`, answer: Math.sqrt(N), show: rt(N), unit: "m", placeholder: "məs. 5 və ya 3√2",
          solution: `sx = ${S(x1 + dx)} − ${x1 < 0 ? "(" + S(x1) + ")" : x1} = ${S(dx)} m, sy = ${S(y1 + dy)} − ${y1 < 0 ? "(" + S(y1) + ")" : y1} = ${S(dy)} m. s = √(${sq(dx)} + ${sq(dy)}) = ${eqr(N)} m.` };
      } },
    { id: "toplama", ad: "Komponentlərlə toplama", izah: "Vektorları toplamaq = x-ləri ayrıca, y-ləri ayrıca toplamaq. Sonra modul: √(x² + y²).",
      gen() {
        const v = () => [rnd(-6, 6), rnd(-6, 6)];
        const kind = pick(["sum", "diff", "three", "lin"]);
        let a = v(), b = v(), c = v(), r, ask, steps;
        const p = u => `(${S(u[0])}; ${S(u[1])})`;
        if (kind === "sum") { r = [a[0] + b[0], a[1] + b[1]]; ask = "|a⃗ + b⃗|"; steps = `a⃗ + b⃗ = (${S(a[0])} + ${b[0] < 0 ? "(" + S(b[0]) + ")" : b[0]}; ${S(a[1])} + ${b[1] < 0 ? "(" + S(b[1]) + ")" : b[1]}) = ${p(r)}.`; }
        else if (kind === "diff") { r = [a[0] - b[0], a[1] - b[1]]; ask = "|a⃗ − b⃗|"; steps = `a⃗ − b⃗ = (${S(a[0])} − ${b[0] < 0 ? "(" + S(b[0]) + ")" : b[0]}; ${S(a[1])} − ${b[1] < 0 ? "(" + S(b[1]) + ")" : b[1]}) = ${p(r)}.`; }
        else if (kind === "three") { r = [a[0] + b[0] + c[0], a[1] + b[1] + c[1]]; ask = "|a⃗ + b⃗ + c⃗|"; steps = `x: ${S(a[0])} + ${P(b[0])} + ${P(c[0])} = ${S(r[0])}; y: ${S(a[1])} + ${P(b[1])} + ${P(c[1])} = ${S(r[1])}.`; }
        else { r = [2 * a[0] - b[0], 2 * a[1] - b[1]]; ask = "|2a⃗ − b⃗|"; steps = `2a⃗ = (${S(2 * a[0])}; ${S(2 * a[1])}); 2a⃗ − b⃗ = ${p(r)}.`; }
        const N = r[0] * r[0] + r[1] * r[1];
        return { text: `a⃗ = ${p(a)}, b⃗ = ${p(b)}${kind === "three" ? ", c⃗ = " + p(c) : ""}. ${ask} = ?`, answer: Math.sqrt(N), show: rt(N), placeholder: "məs. 5 və ya 2√10",
          solution: `${steps} Modul: √(${sq(r[0])} + ${sq(r[1])}) = ${eqr(N)}.` };
      } },
    { id: "bucaq", ad: "Bucaq altında toplama", izah: "|a⃗ + b⃗|² = a² + b² + 2ab·cos θ (θ — vektorlar arasındakı bucaq). Fərq üçün: a² + b² − 2ab·cos θ.",
      gen() {
        const a = rnd(2, 12), b = rnd(2, 12);
        if (Math.random() < .2) {
          const big = Math.random() < .5, ans = big ? a + b : Math.abs(a - b);
          return { text: `Bir nöqtəyə ${a} N və ${b} N qüvvələr təsir edir, aralarındakı bucaq məlum deyil. Əvəzləyicinin ala biləcəyi ən ${big ? "böyük" : "kiçik"} qiymət nə qədərdir?`, answer: ans, show: String(ans), unit: "N", tol: 0.01,
            solution: big ? `Ən böyük — qüvvələr eyni istiqamətdə olanda (θ = 0°): ${a} + ${b} = ${ans} N.` : `Ən kiçik — əks istiqamətdə olanda (θ = 180°): |${a} − ${b}| = ${ans} N.` };
        }
        const th = pick([0, 60, 90, 120, 180]), minus = Math.random() < .35;
        const c2 = { 0: 2, 60: 1, 90: 0, 120: -1, 180: -2 }[th] * (minus ? -1 : 1); // 2·cos θ (with the sign for a difference)
        const N = a * a + b * b + c2 * a * b;
        const cosT = { 0: "1", 60: "1/2", 90: "0", 120: "−1/2", 180: "−1" }[th];
        return { text: `|a⃗| = ${a}, |b⃗| = ${b}, vektorlar arasındakı bucaq ${th}°. |a⃗ ${minus ? "−" : "+"} b⃗| = ?`, answer: Math.sqrt(N), show: rt(N), placeholder: "məs. 7 və ya 4√3",
          solution: `|a⃗ ${minus ? "−" : "+"} b⃗|² = a² + b² ${minus ? "−" : "+"} 2ab·cos ${th}° = ${a * a} + ${b * b} ${minus ? "−" : "+"} 2·${a}·${b}·(${cosT}) = ${N}. Cavab: ${eqr(N)}.` };
      } },
    { id: "fiqur", ad: "Fiqurda vektorlar", izah: "Zəncir qaydası (AB⃗ + BC⃗ = AC⃗), paraleloqram qaydası və simmetriya. Hesabsız, şəkillə həll et.",
      gen() {
        const [kind, q, f, why] = pick(FIG), a = rnd(2, 12), N = f * a * a;
        return { text: `${FIGNAME[kind]} tərəf a = ${a}. ${q} = ?`, svg: figPic(kind), answer: Math.sqrt(N), show: rt(N), placeholder: "məs. 6√3",
          solution: why + ` a = ${a} olduqda: ${rt(N)}.` };
      } },
    { id: "hayat", ad: "Həyatdan", izah: "Yerdəyişmə, sürətin dəyişməsi Δv⃗, tarazlıq: hamısı vektorların toplanmasıdır.",
      gen() {
        const kind = pick(["walk", "turn", "ring"]);
        if (kind === "walk") {
          const n = rnd(2, 4), keys = []; let x = 0, y = 0;
          while (keys.length < n) { const d = pick(["E", "W", "N", "S"]); if (keys.length && keys[keys.length - 1][0] === d) continue; const L = rnd(1, 9) * 100; keys.push([d, L]); x += DIRS[d][1] * L; y += DIRS[d][2] * L; }
          if (!x && !y) return this.gen();
          const N = x * x + y * y, path = keys.reduce((s, k) => s + k[1], 0);
          return { text: `Turist əvvəl ${keys.map(k => k[1] + " m " + DIRS[k[0]][0]).join(", sonra ")} getdi. Onun yerdəyişməsinin modulu nə qədərdir?`, answer: Math.sqrt(N), show: rt(N), unit: "m", placeholder: "məs. 500 və ya 100√5",
            solution: `Ox x — şərqə, y — şimala. sx = ${S(x)} m, sy = ${S(y)} m. s = √(${sq(x)} + ${sq(y)}) = ${rt(N)} m. (Yol isə ${path} m-dir — yol və yerdəyişmə fərqlidir.)` };
        }
        if (kind === "turn") {
          const v = rnd(4, 30), phi = pick([60, 90, 120, 180]), f = { 60: 1, 90: 2, 120: 3, 180: 4 }[phi], N = f * v * v;
          return { text: `Avtomobil ${v} m/s sürətlə gedirdi. Döngədən sonra hərəkət istiqaməti ${phi}° dəyişdi, sürətin modulu isə yenə ${v} m/s qaldı. Sürət vektorunun dəyişməsinin modulu |Δv⃗| nə qədərdir?`,
            answer: Math.sqrt(N), show: rt(N), unit: "m/s", placeholder: "məs. 10√2",
            solution: `Δv⃗ = v⃗₂ − v⃗₁. v⃗₂ və −v⃗₁ arasındakı bucaq ${180 - phi}°: |Δv⃗|² = v² + v² − 2v²·cos ${phi}° = ${f}·${v}² → |Δv⃗| = ${rt(N)} m/s.` + (phi === 180 ? " Geri dönmədə |Δv⃗| = 2v." : "") };
        }
        if (Math.random() < .5) {
          const [p, q, c] = pick(TRI), k = pick([1, 2, 10]);
          return { text: `Halqaya üç qüvvə təsir edir və o, tarazlıqdadır. Birinci qüvvə ${p * k} N şərqə, ikinci ${q * k} N şimala yönəlib. Üçüncü qüvvənin modulu nə qədərdir?`, answer: c * k, show: String(c * k), unit: "N", tol: 0.01,
            solution: `Tarazlıqda F⃗₁ + F⃗₂ + F⃗₃ = 0, yəni F⃗₃ = −(F⃗₁ + F⃗₂). F₁ ⊥ F₂: F₃ = √(${p * k}² + ${q * k}²) = ${c * k} N.` };
        }
        const F = rnd(2, 30) * 10, ang = pick([60, 90, 120]), f = { 60: 3, 90: 2, 120: 1 }[ang], N = f * F * F;
        return { text: `Qayığı sahildən iki ip ilə dartırlar. Hər ipdə qüvvə ${F} N, iplər arasındakı bucaq ${ang}°. İki qüvvənin əvəzləyicisi nə qədərdir?`, answer: Math.sqrt(N), show: rt(N), unit: "N", placeholder: "məs. 100√3",
          solution: `R² = F² + F² + 2F²·cos ${ang}° = ${f === 1 ? "" : f}F² → R = ${f === 1 ? "F" : "F·√" + f} = ${rt(N)} N.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        // F1 = m along Ox; F2 = 2k at 60° to Ox (or, the same, 30° to Oy): F2x = k, F2y = k√3
        const k = rnd(1, 8), m = rnd(2, 15), F2 = 2 * k, toY = Math.random() < .5;
        const ang = toY ? "Oy ilə 30°" : "Ox ilə 60°", fx = toY ? "sin 30°" : "cos 60°", fy = toY ? "cos 30°" : "sin 60°";
        const r3 = exStr(1, [k, 3]), N = (m + k) * (m + k) + 3 * k * k;
        const steps = [
          `F₂x = F₂·${fx} = ${k} N, F₂y = F₂·${fy} = ${r3} N.`,
          `Rx = F₁ + F₂x = ${m + k} N, Ry = F₂y = ${r3} N.`,
          `R = √(Rx² + Ry²) = √(${(m + k) * (m + k)} + ${3 * k * k}) = ${rt(N)} N.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `F₂x = F₂·${toY ? "cos 30°" : "sin 60°"} = ${r3} N, F₂y = F₂·${toY ? "sin 30°" : "cos 60°"} = ${k} N.`;
        if (bad === 1) steps[1] = pick([`Rx = F₁ − F₂x = ${m - k} N, Ry = F₂y = ${r3} N.`, `Rx = F₁ + F₂x = ${m + k} N, Ry = F₁ + F₂y = ${m} + ${r3} N.`]);
        if (bad === 2) steps[2] = pick([`R = Rx + Ry = ${m + k} + ${r3} N.`, `R = √(Rx² + Ry²) = √(${(m + k) * (m + k)} + ${3 * k}) = ${rt((m + k) * (m + k) + 3 * k)} N.`]);
        const text = h("div", {}, h("p", {}, `F₁ = ${m} N qüvvəsi Ox boyunca, F₂ = ${F2} N qüvvəsi ${ang} bucaq altında (birinci rübdə) yönəlib. Əvəzləyicini tap.`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: bucaq ${toY ? "Oy" : "Ox"} iləndir. ${toY ? "Oy-ə bitişik proyeksiya (F₂y) — cos ilə, Ox-ə — sin ilə" : "Ox-ə bitişik proyeksiya (F₂x) — cos ilə, Oy-ə — sin ilə"}: F₂x = ${k}, F₂y = ${r3}.`,
          `2-ci addım: x-lər öz aralarında, y-lər öz aralarında toplanır. F₁ yalnız x üzrədir: Rx = ${m + k}, Ry = ${r3}.`,
          `3-cü addım: modul Pifaqorla tapılır, hər proyeksiya kvadrata yüksəldilir: Ry² = (${r3})² = ${3 * k * k}. R = ${rt(N)} N.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-vektorlar", title: "Vektorlar: proyeksiya və toplanma", fenn: "fizika", link: "dersler/fiz-vektorlar.html",
      format: "Cavab ədəddir: 12, −6, 5√3, 2√10 (vahid xanada yazılıb). Proyeksiyada işarəni unutma.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["proyeksiya", "proyeksiya", "modul", "toplama", "toplama", "bucaq", "bucaq", "fiqur", "hayat", "hayat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-vektorlar.html")) b.push("dersler/fiz-vektorlar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
