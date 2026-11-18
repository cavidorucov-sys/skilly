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
        const k = rnd(2, 8), m = rnd(2, 15), F2 = 2 * k, toY = Math.random() < .5;
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
        const why = [`1-ci addım: bucaq ${toY ? "Oy" : "Ox"} oxu ilədir. ${toY ? "Oy oxuna bitişik proyeksiya (F₂y) cos ilə, Ox oxuna proyeksiya sin ilə" : "Ox oxuna bitişik proyeksiya (F₂x) cos ilə, Oy oxuna proyeksiya sin ilə"}: F₂x = ${k}, F₂y = ${r3}.`,
          `2-ci addım: x-lər öz aralarında, y-lər öz aralarında toplanır. F₁ yalnız x üzrədir: Rx = ${m + k}, Ry = ${r3}.`,
          `3-cü addım: modul Pifaqorla tapılır, hər proyeksiya kvadrata yüksəldilir: Ry² = (${r3})² = ${3 * k * k}. R = ${rt(N)} N.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a figure, several steps; the wrong
  // options are the answers of typical mistakes. Questions 2, 3, 4, 6, 7, 8 and 10 also use an earlier topic
  // (Nyuton, sürtünmə və maili müstəvi, kinematika, çevrə üzrə hərəkət, cazibə, sərbəst düşmə).
  const { ae, again } = Oyun;
  const Fm = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const ok2 = x => isFinite(x) && x > 0 && nice(x, 2);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const Un = u => x => Fm(+x.toFixed(4)) + " " + u;
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  // string SVG helpers (the figures are also pasted into the lesson tab)
  const K = { INK: "var(--ink,#1c2433)", ACC: "var(--accent,#2c4a8a)", MUT: "var(--muted,#5b6578)", VEC: "var(--vec,#b4561b)", PAP: "var(--sheet,#fff)" };
  const q1 = n => +(+n).toFixed(1);
  const Ln = (x1, y1, x2, y2, c = K.INK, w = 2, ex = "") => `<line x1="${q1(x1)}" y1="${q1(y1)}" x2="${q1(x2)}" y2="${q1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const Ar = (x1, y1, x2, y2, c = K.VEC, w = 2.5) => Ln(x1, y1, x2, y2, c, w, ` marker-end="url(#vk-a)"`);
  const Tx = (x, y, s, a = "middle", c = K.INK, sz = 13) => `<text x="${q1(x)}" y="${q1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const Dt = (x, y, r = 3.2, c = K.INK) => `<circle cx="${q1(x)}" cy="${q1(y)}" r="${r}" fill="${c}"/>`;
  const Cr = (x, y, r, fill = K.PAP, c = K.INK, w = 2) => `<circle cx="${q1(x)}" cy="${q1(y)}" r="${r}" fill="${fill}" stroke="${c}" stroke-width="${w}"/>`;
  // arc around (cx, cy) from the math angle a1 to a2 (degrees, counter-clockwise, a1 < a2)
  const Ac = (cx, cy, r, a1, a2, c = K.ACC, w = 2) => { const P = a => [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)], A = P(a1), B = P(a2);
    return `<path d="M${q1(A[0])} ${q1(A[1])}A${r} ${r} 0 ${a2 - a1 > 180 ? 1 : 0} 0 ${q1(B[0])} ${q1(B[1])}" fill="none" stroke="${c}" stroke-width="${w}"/>`; };
  const Sg = (w, h, inner, aria, cls = "oy-svg") => `<svg viewBox="0 0 ${w} ${h}"${cls ? ` class="${cls}"` : ""} role="img" aria-label="${aria}"><defs><marker id="vk-a" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  const hatch = (x1, x2, y, dir) => { let s = ""; for (let x = x1; x <= x2; x += 12) s += Ln(x, y, x - 7, y + 9 * dir, K.MUT, 1); return s; };

  // three forces from one point: arrows [dx, dy, value, label] with unit directions in screen coordinates
  function figForces(arr, cls) { const mx = Math.max(...arr.map(a => a[2])), k = 80 / mx; let s = "";
    arr.forEach(([dx, dy, v, lab]) => { const L = Math.max(v * k, 18); s += Ar(130, 100, 130 + dx * L, 100 + dy * L, lab === "F₂" ? K.ACC : K.VEC) + (dx ? Tx(130 + dx * (L + 16), 105, lab) : Tx(130, 100 + dy * (L + 10) + (dy > 0 ? 8 : 0), lab)); });
    return Sg(260, 200, s + Dt(130, 100, 3.5), "Bir nöqtədən çıxan üç qüvvə: F₁, F₂, F₃", cls); }
  // a body on a smooth floor, a force F lifted by the angle al above the horizontal
  function figLift(al, cls) { const x0 = 140, y0 = 106, L = 92, c = Math.cos(al * Math.PI / 180), n = Math.sin(al * Math.PI / 180);
    return Sg(260, 160, Ln(20, 130, 240, 130) + hatch(30, 240, 130, 1) + `<rect x="70" y="82" width="70" height="48" fill="${K.PAP}" stroke="${K.INK}" stroke-width="2"/>` + Tx(105, 112, "m")
      + Ln(x0, y0, x0 + 100, y0, K.MUT, 1, ' stroke-dasharray="4 3"') + Ar(x0, y0, x0 + L * c, y0 - L * n) + Tx(x0 + L * c + 10, y0 - L * n - 4, "F", "start", K.VEC)
      + Ac(x0, y0, 38, 0, al) + Tx(x0 + 54 * Math.cos(al * Math.PI / 360), y0 - 54 * Math.sin(al * Math.PI / 360) + 5, "α"), "Üfüqi səthdə cisim; F qüvvəsi üfüqlə α bucağı altında yuxarı yönəlib", cls); }
  // a smooth incline of angle al, a block held by a force F along the slope
  function figIncline(al, cls) { const a = al * Math.PI / 180, c = Math.cos(a), n = Math.sin(a), C = [30 + 170 * c, 170 - 170 * n], P = [30 + 72 * c, 170 - 72 * n];
    return Sg(260, 190, `<polygon points="30,170 ${q1(C[0])},170 ${q1(C[0])},${q1(C[1])}" fill="none" stroke="${K.INK}" stroke-width="2" stroke-linejoin="round"/>`
      + `<g transform="translate(${q1(P[0])} ${q1(P[1])}) rotate(${-al})"><rect x="-24" y="-30" width="48" height="30" fill="${K.PAP}" stroke="${K.INK}" stroke-width="2"/>${Tx(0, -10, "m")}${Ar(24, -15, 82, -15)}${Tx(88, -19, "F", "start", K.VEC)}</g>`
      + Ac(30, 170, 36, 0, al) + Tx(30 + 52 * Math.cos(a / 2), 170 - 52 * Math.sin(a / 2) + 5, "α"), "Hamar maili müstəvi, üzərində cisim; F qüvvəsi müstəvi boyunca yuxarı yönəlib", cls); }
  // the walk A → B (east, a) → C (north, b) → D (west, c)
  function figPath(a, b, c, cls) { const k = Math.min(140 / a, 105 / b), A = [40, 158], B = [40 + a * k, 158], C = [B[0], 158 - b * k], D = [C[0] - c * k, C[1]];
    return Sg(260, 190, Ar(A[0], A[1], B[0], B[1], K.VEC) + Ar(B[0], B[1], C[0], C[1], K.VEC) + Ar(C[0], C[1], D[0], D[1], K.VEC)
      + [[A, "A", -12, 5], [B, "B", 12, 16], [C, "C", 12, -4], [D, "D", -12, -4]].map(([p, t, dx, dy]) => Dt(p[0], p[1]) + Tx(p[0] + dx, p[1] + dy, t)).join("")
      + Tx((A[0] + B[0]) / 2, 176, a + " m", "middle", K.MUT, 12) + Tx(B[0] + 8, (B[1] + C[1]) / 2 + 4, b + " m", "start", K.MUT, 12) + Tx((C[0] + D[0]) / 2, C[1] - 8, c + " m", "middle", K.MUT, 12),
      "Yol: A-dan B-yə şərqə, B-dən C-yə şimala, C-dən D-yə qərbə", cls); }
  // a boat across a river: u across, v along the flow
  function figRiver(u, v, cls) { const dr = Math.max(34, Math.min(120, 110 * v / u)), Q = [70 + dr, 40];
    return Sg(260, 190, Ln(20, 40, 240, 40) + hatch(30, 240, 40, -1) + Ln(20, 150, 240, 150) + hatch(30, 240, 150, 1)
      + Ar(130, 95, 200, 95, K.ACC) + Tx(166, 85, "v", "middle", K.ACC) + Ln(70, 150, Q[0], Q[1], K.MUT, 1.5, ' stroke-dasharray="5 4"') + Ar(70, 150, 70, 72, K.VEC) + Tx(58, 118, "u", "middle", K.VEC)
      + Dt(70, 150) + Tx(70, 170, "P") + Dt(Q[0], Q[1]) + Tx(Q[0] + 12, 32, "Q")
      + Ar(28, 46, 28, 144, K.MUT, 1.2) + Ar(28, 144, 28, 46, K.MUT, 1.2) + Tx(16, 100, "d", "middle", K.MUT), "Çay: qayıq P-dən sahilə perpendikulyar üzür, axın onu Q nöqtəsinə aparır", cls); }
  // a lamp on two equal ropes; the angle between the ropes is th
  function figRopes(th, cls) { const h = th / 2 * Math.PI / 180, L = 100, ap = [130, 140], A1 = [ap[0] - L * Math.sin(h), ap[1] - L * Math.cos(h)], A2 = [ap[0] + L * Math.sin(h), A1[1]];
    return Sg(260, 200, Ln(A1[0] - 20, A1[1], A2[0] + 20, A1[1]) + hatch(A1[0] - 14, A2[0] + 24, A1[1], -1) + Ln(A1[0], A1[1], ap[0], ap[1]) + Ln(A2[0], A2[1], ap[0], ap[1]) + Dt(ap[0], ap[1])
      + Cr(130, 156, 15) + Ar(130, 172, 130, 196) + Tx(146, 190, "mg", "start", K.VEC) + Ac(130, 140, 34, 90 - th / 2, 90 + th / 2) + Tx(130, 140 - 46, "θ", "middle", K.ACC), "Lampa tavandan iki ip ilə asılıb; iplər arasında θ bucağı", cls); }
  // uniform motion on a circle: A at the top, B a quarter turn clockwise
  function figCircle(cls) { return Sg(260, 200, Cr(130, 105, 62, "none", K.MUT, 1.5) + `<path d="M130 43A62 62 0 0 1 192 105" fill="none" stroke="${K.ACC}" stroke-width="3"/>`
      + Ln(130, 105, 130, 43, K.MUT, 1, ' stroke-dasharray="4 3"') + Ln(130, 105, 192, 105, K.MUT, 1, ' stroke-dasharray="4 3"') + Dt(130, 105, 2.5) + Tx(120, 122, "O")
      + Ar(130, 43, 182, 43) + Tx(186, 34, "v₁", "start", K.VEC) + Ar(192, 105, 192, 155) + Tx(202, 150, "v₂", "start", K.VEC) + Dt(130, 43) + Tx(118, 38, "A", "end") + Dt(192, 105) + Tx(204, 100, "B", "start"),
      "Çevrə üzrə hərəkət: A nöqtəsində v₁ sağa, çevrənin dörddə biri sonra B nöqtəsində v₂ aşağı", cls); }
  // C at the corner of a right angle, A on the x-axis (rA·r from C), B on the y-axis (rB·r from C)
  function figGrav(mA, mB, rA, rB, cls) { const C = [50, 160], A = [C[0] + 60 * rA, 160], B = [50, C[1] - 60 * rB];
    return Sg(260, 200, Ln(C[0], C[1], A[0], A[1], K.MUT, 1) + Ln(C[0], C[1], B[0], B[1], K.MUT, 1) + Ln(C[0] + 10, C[1], C[0] + 10, C[1] - 10, K.MUT, 1) + Ln(C[0], C[1] - 10, C[0] + 10, C[1] - 10, K.MUT, 1)
      + Ar(C[0] + 4, C[1], C[0] + 40, C[1], K.VEC) + Tx(C[0] + 24, C[1] - 8, "F₁", "middle", K.VEC) + Ar(C[0], C[1] - 4, C[0], C[1] - 40, K.ACC) + Tx(C[0] + 9, C[1] - 30, "F₂", "start", K.ACC)
      + Cr(C[0], C[1], 6, K.INK) + Tx(C[0] - 10, C[1] + 16, "C, m", "end") + Cr(A[0], A[1], 11) + Tx(A[0], A[1] + 4.5, "A", "middle", K.INK, 12) + Tx(A[0], A[1] - 18, mA + "M") + Cr(B[0], B[1], 11) + Tx(B[0], B[1] + 4.5, "B", "middle", K.INK, 12) + Tx(B[0] + 20, B[1] + 5, mB + "M", "start")
      + Tx((C[0] + A[0]) / 2, C[1] + 17, (rA === 1 ? "" : rA) + "r", "middle", K.MUT, 12) + Tx(C[0] - 8, (C[1] + B[1]) / 2 + 4, (rB === 1 ? "" : rB) + "r", "end", K.MUT, 12), "C cismi, A cismi C-dən rA·r, B cismi rB·r məsafədə, ∠ACB = 90°", cls); }
  // coordinate grid 0..8 × 0..6 (1 cell = 1 m) with a displacement A → B
  function figGrid(A, B, cls) { const X = x => 36 + 24 * x, Y = y => 164 - 24 * y, dxs = X(B[0]) - X(A[0]), dys = Y(B[1]) - Y(A[1]), dl = Math.hypot(dxs, dys) || 1, ux = dxs / dl, uy = dys / dl; let s = "";
    for (let x = 0; x <= 8; x++) s += Ln(X(x), Y(0), X(x), Y(6), K.MUT, 0.5) + (x % 2 === 0 && x ? Tx(X(x), Y(0) + 15, x, "middle", K.MUT, 11) : "");
    for (let y = 0; y <= 6; y++) s += Ln(X(0), Y(y), X(8), Y(y), K.MUT, 0.5) + (y % 2 === 0 && y ? Tx(X(0) - 6, Y(y) + 4, y, "end", K.MUT, 11) : "");
    s += Ln(X(0), Y(0), X(8) + 10, Y(0), K.INK, 1.6) + Ln(X(0), Y(0), X(0), Y(6) - 10, K.INK, 1.6) + Tx(X(8) + 14, Y(0) + 4, "x", "start") + Tx(X(0) + 8, Y(6) - 12, "y", "start") + Tx(X(0) - 6, Y(0) + 15, "0", "end", K.MUT, 11);
    return Sg(260, 190, s + Ar(X(A[0]), Y(A[1]), X(B[0]), Y(B[1]), K.VEC, 2.6) + Cr(X(A[0]), Y(A[1]), 3.5, K.INK) + Tx(X(A[0]) - ux * 15, Y(A[1]) - uy * 15 + 5, "A") + Dt(X(B[0]), Y(B[1]), 3.5) + Tx(X(B[0]) + ux * 15, Y(B[1]) + uy * 15 + 5, "B"), "Koordinat şəbəkəsi: cisim A nöqtəsindən B nöqtəsinə keçir", cls); }
  // a ball falls from h, hits the floor, rises with a smaller speed
  function figBounce(n, cls) { const l2 = 70 / n; return Sg(260, 200, Ln(20, 170, 240, 170) + hatch(30, 240, 170, 1) + Cr(80, 38, 10) + Tx(96, 42, "v₀ = 0", "start", K.MUT, 12) + Ln(80, 52, 80, 70, K.MUT, 1, ' stroke-dasharray="4 3"') + Cr(80, 158, 10, "none", K.MUT, 1.5) + Ar(80, 74, 80, 144, K.VEC) + Tx(94, 114, "v₁", "start", K.VEC) + Ar(34, 46, 34, 166, K.MUT, 1.2) + Ar(34, 166, 34, 46, K.MUT, 1.2) + Tx(22, 110, "h", "middle", K.MUT)
      + Cr(180, 158, 10) + Ar(180, 142, 180, 142 - l2, K.ACC) + Tx(194, 146 - l2 / 2, "v₂", "start", K.ACC) + Tx(80, 192, "dəymədən əvvəl", "middle", K.MUT, 11) + Tx(180, 192, "dəymədən sonra", "middle", K.MUT, 11), "Top h hündürlükdən düşür, yerə dəyir və yuxarı qalxır", cls); }
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. three forces from a point, two of them opposite (resultant by the Pythagorean theorem)
    { tip: "qapali", gen: () => again(() => {
      const [p, q, c] = pick(TRI.slice(0, 5)), k = pick([1, 2]), sw = Math.random() < .5, P1 = (sw ? q : p) * k, P2 = (sw ? p : q) * k, R = c * k, F3 = rnd(2, 9), F1 = P1 + F3, F2 = P2;
      const sg = pick([1, -1]), sg2 = pick([1, -1]), onX = Math.random() < .5;
      const arr = onX ? [[sg, 0, F1, "F₁"], [-sg, 0, F3, "F₃"], [0, sg2, F2, "F₂"]] : [[0, sg, F1, "F₁"], [0, -sg, F3, "F₃"], [sg2, 0, F2, "F₂"]];
      const w = [F1 + F2 + F3, P1 + P2, P1, P2]; if (![R, ...w].every(ok2)) return null;
      return mc(ae(R, w, Un("N")), { svg: svgEl(figForces(arr)), text: `Bir nöqtəyə şəkildəki üç qüvvə təsir edir: F₁ = ${F1} N, F₂ = ${F2} N, F₃ = ${F3} N. Əvəzləyici qüvvənin modulu nə qədərdir?`,
        solution: `Qarşı-qarşıya yönəlmiş F₁ və F₃ çıxılır: ${F1} − ${F3} = ${P1} N. F₂ ona perpendikulyardır: ${P2} N. R = √(${P1}² + ${P2}²) = ${R} N. Tələlər: modulları toplamaq (${F1 + F2 + F3} N), proyeksiyaları Pifaqorsuz toplamaq (${P1 + P2} N), yalnız bir proyeksiyanı cavab yazmaq (${P1} və ya ${P2} N).` });
    }) },
    // 2. a force lifted by an angle: the normal reaction (Newton + projection)
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const al = pick([37, 53]), sn = al === 37 ? .6 : .8, cs = al === 37 ? .8 : .6, m = pick([2, 3, 4, 5, 6, 8, 10]), F = pick([5, 10, 15, 20, 25, 30, 40, 50]), Fy = F * sn, Fx = F * cs, mg = 10 * m, N = mg - Fy;
      const w = [mg, mg - Fx, mg + Fy, mg - F]; if (![N, ...w].every(ok2)) return null;
      return mc(ae(N, w, Un("N")), { svg: svgEl(figLift(al)), text: `Kütləsi ${m} kq olan cisim hamar üfüqi səthdə sürüşür. Ona üfüqlə α = ${al}° bucaq əmələ gətirən F = ${F} N qüvvə yuxarı tətbiq olunub (şəkildə); cisim səthdən ayrılmır. Səthin cismə normal reaksiya qüvvəsi nə qədərdir? (g = 10 m/s², sin ${al}° = ${Fm(sn)}, cos ${al}° = ${Fm(cs)})`,
        solution: `F qüvvəsini toplananlara ayır: Fₓ = F·cos ${al}° = ${Fm(Fx)} N, F_y = F·sin ${al}° = ${Fm(Fy)} N (yuxarı). Şaquli istiqamətdə cisim yerdən qalxmır: N + F_y = mg, N = ${mg} − ${Fm(Fy)} = ${Fm(N)} N. Tələlər: F_y-ni nəzərə almamaq (${mg} N), sin ilə cos-u dəyişmək (${Fm(mg - Fx)} N), F_y-ni mg-yə əlavə etmək (${Fm(mg + Fy)} N), bütün F-i çıxmaq (${Fm(mg - F)} N).` });
    }) },
    // 3. weight on a smooth incline: the normal reaction (projection of mg)
    { tip: "qapali", birlesik: "fiz-surtunme-maili", minVariety: 8, gen: () => again(() => {
      const al = pick([37, 53]), sn = al === 37 ? .6 : .8, cs = al === 37 ? .8 : .6, m = pick([3, 6, 9, 12]), mg = 10 * m, N = mg * cs;
      const w = [mg * sn, mg, mg * sn / cs, mg / cs]; if (![N, ...w].every(ok2)) return null;
      return mc(ae(N, w, Un("N")), { svg: svgEl(figIncline(al)), text: `Hamar maili müstəvi üfüqlə α = ${al}° bucaq əmələ gətirir. Kütləsi ${m} kq olan cisim müstəvi boyunca yuxarı yönəlmiş F qüvvəsi ilə tarazlıqda saxlanılır (şəkildə). Müstəvinin cismə normal reaksiya qüvvəsi nə qədərdir? (g = 10 m/s², sin ${al}° = ${Fm(sn)}, cos ${al}° = ${Fm(cs)})`,
        solution: `Ağırlıq qüvvəsi mg = ${mg} N şaquli aşağıdır. Müstəviyə perpendikulyar toplananı mg·cos α: N = ${mg}·${Fm(cs)} = ${Fm(N)} N. (Müstəvi boyunca toplanan mg·sin α = ${Fm(mg * sn)} N-dur — F ona bərabərdir.) Tələlər: sin ilə cos-u dəyişmək (${Fm(mg * sn)} N), N = mg yazmaq (${mg} N), tg ilə vurmaq (${Fm(mg * sn / cs)} N), cos-a bölmək (${Fm(mg / cs)} N).` });
    }) },
    // 4. a three-leg walk: average velocity (modulus of the displacement / time); minutes → seconds
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const [p, q, r] = pick(TRI.slice(0, 5)), v = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), t = pick([1, 2, 3, 4, 5]), s = +(60 * t * v).toFixed(6), u = s / r, sw = Math.random() < .5;
      const dx = (sw ? q : p) * u, dy = (sw ? p : q) * u; if (![dx, dy].every(x => Number.isInteger(+x.toFixed(6)) && x >= 10)) return null;
      const c = pick([20, 30, 40, 50, 60, 80]), a = dx + c, b = dy, l = a + b + c, T = 60 * t, kk = Math.min(140 / a, 105 / b); if (Math.min(a, b, c) * kk < 28) return null;
      const w = [l / T, (dx + dy) / T, (a + b) / T, s / t]; if (![v, ...w].every(ok2)) return null;
      return mc(ae(v, w, Un("m/s")), { svg: svgEl(figPath(a, b, c)), text: `Cisim A nöqtəsindən şəkildəki yolla A → B → C → D hərəkət etdi: AB = ${a} m (şərqə), BC = ${b} m (şimala), CD = ${c} m (qərbə). Bütün hərəkət ${t} dəq çəkdi. Orta sürət vektorunun modulu nə qədərdir? (m/s ilə)`,
        solution: `Orta sürət vektoru yerdəyişmənin vaxta nisbətidir. Şərq üzrə: ${a} − ${c} = ${dx} m, şimal üzrə: ${dy} m. s = √(${dx}² + ${dy}²) = ${s} m. Vaxt ${t} dəq = ${T} s. v = ${s}/${T} = ${Fm(v)} m/s. Tələlər: yerdəyişmə əvəzinə yolu vaxta bölmək (${Fm(l / T)} m/s), proyeksiyaları toplamaq (${Fm((dx + dy) / T)} m/s), CD hissəsini unudub AB + BC-ni vaxta bölmək (${Fm((a + b) / T)} m/s), dəqiqəni saniyəyə çevirməmək (${Fm(s / t)} m/s).` });
    }) },
    // 5. a boat across a river: u across, v along the flow; displacement relative to the bank
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const [u, v, w0] = pick([[0.6, 0.8, 1], [0.8, 0.6, 1], [1.5, 2, 2.5], [2, 1.5, 2.5], [0.5, 1.2, 1.3], [1.2, 0.5, 1.3], [3, 4, 5], [4, 3, 5]]), t = pick([10, 20, 25, 30, 40, 50, 60, 100]);
      const d = +(u * t).toFixed(6), dr = +(v * t).toFixed(6), s = +(w0 * t).toFixed(6); if (![d, dr].every(x => Number.isInteger(x))) return null;
      const w = [d + dr, dr, d, w0]; if (![s, ...w].every(ok2)) return null;
      return mc(ae(s, w, Un("m")), { svg: svgEl(figRiver(u, v)), text: `Çayın eni ${d} m-dir, axının sürəti ${Fm(v)} m/s. Qayıq P nöqtəsindən elə üzür ki, onun suya nəzərən sürəti ${Fm(u)} m/s-dir və sahilə perpendikulyar yönəlib (şəkildə); axının sürəti hər yerdə eynidir. Qayığın sahilə nəzərən yerdəyişməsinin modulu (P-dən qarşı sahildəki Q-yə qədər) nə qədərdir?`,
        solution: `Qarşı sahilə çatma vaxtı yalnız eninə sürətdən asılıdır: t = d/u = ${d}/${Fm(u)} = ${t} s. Bu vaxtda axın qayığı ${Fm(v)}·${t} = ${dr} m aparır. Yerdəyişmə düzbucaqlı üçbucağın hipotenuzudur: s = √(${d}² + ${dr}²) = ${s} m. Tələlər: katetləri toplamaq (${d + dr} m), yalnız axının apardığını götürmək (${dr} m), yalnız eni götürmək (${d} m), sürətlərin Pifaqorunu tapıb vaxta vurmağı unutmaq (${Fm(w0)} m).` });
    }) },
    // 6. a lamp on two ropes: the tension (equilibrium, projection onto the vertical)
    { tip: "qapali", birlesik: "fiz-nyuton", minVariety: 8, gen: () => again(() => {
      const th = pick([74, 106]), hf = th / 2, sn = hf === 37 ? .6 : .8, cs = hf === 37 ? .8 : .6, m = pick([6, 12, 18, 24, 30]), mg = 10 * m, T = mg / (2 * cs);
      const w = [mg / 2, mg / (2 * sn), mg, mg / cs]; if (![T, ...w].every(ok2)) return null;
      return mc(ae(T, w, Un("N")), { svg: svgEl(figRopes(th)), text: `Kütləsi ${m} kq olan lampa eyni uzunluqlu iki ip ilə tavanın eyni hündürlüyündəki iki nöqtəsindən asılıb. İplər arasındakı bucaq ${th}°-dir (şəkildə). Hər ipdəki dartılma qüvvəsi nə qədərdir? (g = 10 m/s², sin ${hf}° = ${Fm(sn)}, cos ${hf}° = ${Fm(cs)})`,
        solution: `Hər ip şaquli ilə ${th}°/2 = ${hf}° bucaq əmələ gətirir. İplər simmetrikdir, lampa tarazlıqdadır: şaquli proyeksiyalarda 2T·cos ${hf}° = mg. T = ${mg}/(2·${Fm(cs)}) = ${Fm(T)} N. Tələlər: bucağı nəzərə almamaq (mg/2 = ${Fm(mg / 2)} N), sin ilə cos-u dəyişmək (${Fm(mg / (2 * sn))} N), "2" əmsalını unutmaq (mg/cos ${hf}° = ${Fm(mg / cs)} N), yükü bir ipin dartılmasına bərabər saymaq: T = mg (${mg} N).` });
    }) },
    // 7. a quarter of a circle at constant speed: the average acceleration
    { tip: "qapali", birlesik: "fiz-cevre-herekat", gen: () => again(() => {
      const x = pick([2, 3, 4, 5, 6, 8, 10, 12]), t = pick([1, 2, 3, 4, 5]), v = x * t, half = x % 2 === 0 ? (x / 2) + "√2" : x + "√2/2";
      const o = ae(Fm(x) + "√2 m/s²", ["0 m/s²", Fm(x) + " m/s²", Fm(2 * x) + " m/s²", half + " m/s²"], z => z);
      return mc(o, { svg: svgEl(figCircle()), text: `Cisim çevrə üzrə sabit v = ${v} m/s sürətlə hərəkət edir. Çevrənin dörddə bir hissəsini (A nöqtəsindən B nöqtəsinə, şəkildə) ${t} s-də keçdi. Bu müddətdə orta təcilin modulu nə qədərdir?`,
        solution: `Sürətin modulu dəyişmir, amma istiqaməti 90° dönür. Δv⃗ = v⃗₂ − v⃗₁; v⃗₁ ⊥ v⃗₂ olduğundan |Δv⃗| = √(v² + v²) = v√2 = ${v}√2 m/s. a_orta = |Δv⃗|/t = ${v}√2/${t} = ${Fm(x)}√2 m/s². Tələlər: "modul sabitdir, deməli təcil 0" (0), Δv-ni v-yə bərabər saymaq (${Fm(x)} m/s²), geri dönmədəki kimi 2v (${Fm(2 * x)} m/s²), (v/t)·cos 45° (${half} m/s²).` });
    }) },
    // 8. two gravity forces on C at a right angle (F ∝ m/r²)
    { tip: "qapali", birlesik: "fiz-cazibe", minVariety: 8, gen: () => again(() => {
      const [mA, mB, rA, rB, pa, pb, pc] = pick([[3, 4, 1, 1, 3, 4, 5], [3, 5, 1, 2, 12, 5, 13], [5, 3, 2, 1, 5, 12, 13], [1, 3, 1, 2, 4, 3, 5], [5, 12, 1, 1, 5, 12, 13]]), u = pick([1, 2, 3, 4, 5, 10]);
      const FA = pa * u, FB = pb * u, R = pc * u, w = [FA + FB, Math.abs(FA - FB), Math.max(FA, FB), Math.min(FA, FB)];
      return mc(ae(R, w, Un("N")), { svg: svgEl(figGrav(mA, mB, rA, rB)), text: `Nöqtəvi A, B və C cisimləri şəkildəki kimi yerləşib: ∠ACB = 90°, CA = ${rA === 1 ? "" : rA}r, CB = ${rB === 1 ? "" : rB}r; A-nın kütləsi ${mA}M, B-nin kütləsi ${mB}M. A cisminin C-yə cazibə qüvvəsi F₁ = ${FA} N-dur. C cisminə təsir edən cazibə qüvvələrinin əvəzləyicisinin modulu nə qədərdir?`,
        solution: `Cazibə qüvvəsi F ∼ m/r². A üçün ${mA}/${rA * rA}, B üçün ${mB}/${rB * rB} → F₁ : F₂ = ${pa} : ${pb}, deməli F₂ = ${FB} N. Qüvvələr perpendikulyardır: R = √(${FA}² + ${FB}²) = ${R} N. Tələlər: modulları toplamaq (${FA + FB} N), çıxmaq (${Math.abs(FA - FB)} N), yalnız bir qüvvəni cavab yazmaq (${FA} və ya ${FB} N).` });
    }) },
    // 9. work of a constant force = the scalar product of F and the displacement read off the grid
    { tip: "qapali", gen: () => again(() => {
      const ri = (a, b) => rnd(a, b), Ax = ri(1, 7), Ay = ri(1, 5), Bx = ri(1, 7), By = ri(1, 5), sx = Bx - Ax, sy = By - Ay, Fx = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]), Fy = pick([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]);
      if (!sx || !sy) return null; const A = Fx * sx + Fy * sy; if (!A) return null;
      const w = [Fx * sx, Fx * sy + Fy * sx, Fx * sx - Fy * sy, (Fx + Fy) * (sx + sy)];
      return mc(ae(A, w, x => Fm(x) + " J"), { svg: svgEl(figGrid([Ax, Ay], [Bx, By])), text: `Cisim A(${Ax}; ${Ay}) nöqtəsindən B(${Bx}; ${By}) nöqtəsinə hərəkət etdi (şəkildə, koordinatlar metrlə). Cismə sabit F⃗ = (${Fm(Fx)}; ${Fm(Fy)}) N qüvvə təsir edir. Sabit qüvvənin işi F⃗ və yerdəyişmə s⃗ vektorlarının skalyar hasilinə bərabərdir. İş nə qədərdir?`,
        solution: `Yerdəyişmə: s⃗ = B − A = (${Bx} − ${Ax < 0 ? "(" + Fm(Ax) + ")" : Ax}; ${By} − ${Ay}) = (${Fm(sx)}; ${Fm(sy)}) m. A = Fₓ·sₓ + F_y·s_y = ${Fm(Fx)}·${sx < 0 ? "(" + Fm(sx) + ")" : sx} + ${Fy < 0 ? "(" + Fm(Fy) + ")" : Fy}·${sy < 0 ? "(" + Fm(sy) + ")" : sy} = ${Fm(Fx * sx)} + ${Fy * sy < 0 ? "(" + Fm(Fy * sy) + ")" : Fy * sy} = ${Fm(A)} J. Tələlər: yalnız x üzrə hesablamaq (${Fm(Fx * sx)} J), komponentləri çarpaz vurub toplamaq Fₓ·s_y + F_y·sₓ (${Fm(w[1])} J), işarə səhvi (${Fm(w[2])} J), cəmləri vurmaq (${Fm(w[3])} J).` });
    }) },
    // 10. a ball hits the floor: the change of the velocity vector (v1 down, v2 up)
    { tip: "qapali", birlesik: "fiz-serbest-dusme", minVariety: 8, gen: () => again(() => {
      const v1 = pick([10, 20, 30, 40, 60]), n = pick([3, 4, 5]), h = v1 * v1 / 20, v2 = v1 / n, D = v1 + v2;
      const w = [v1 - v2, v1, v2, 2 * v1]; if (![D, h, ...w].every(ok2)) return null;
      return mc(ae(D, w, Un("m/s")), { svg: svgEl(figBounce(n)), text: `Top h = ${Fm(h)} m hündürlükdən sərbəst buraxıldı, yerə dəyib sürətinin modulu ${n} dəfə azalmış halda yuxarı atıldı (şəkildə). Zərbə zamanı sürət vektorunun dəyişməsinin modulu nə qədərdir? (g = 10 m/s², havanın müqaviməti yoxdur.)`,
        solution: `Dəyənə qədər v₁ = √(2gh) = √(2·10·${Fm(h)}) = ${v1} m/s (aşağı). Dəyəndən sonra v₂ = v₁/${n} = ${Fm(v2)} m/s (yuxarı). Δv⃗ = v⃗₂ − v⃗₁: istiqamətlər əksdir, ona görə modullar toplanır: |Δv⃗| = ${v1} + ${Fm(v2)} = ${Fm(D)} m/s. Tələlər: sürət modulunun azalmasını götürmək (${v1} − ${Fm(v2)} = ${Fm(v1 - v2)} m/s), yalnız v₁ (${v1} m/s) və ya yalnız v₂ (${Fm(v2)} m/s), tam elastik zərbədəki 2v₁ (${2 * v1} m/s).` });
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
      key: "fiz-vektorlar", title: "Vektorlar: proyeksiya və toplanma", fenn: "fizika", link: "dersler/fiz-vektorlar.html",
      format: "Cavab ədəddir: 12, −6, 5√3, 2√10 (vahid xanada yazılıb). Proyeksiyada işarəni unutma.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["proyeksiya", "proyeksiya", "modul", "toplama", "toplama", "bucaq", "bucaq", "fiqur", "hayat", "hayat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-vektorlar.html")) b.push("dersler/fiz-vektorlar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
