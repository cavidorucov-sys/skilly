// Kvadrat funksiya, parabola — mastery game levels (vertex and axis, smallest/largest value, axis intersections,
// reading a parabola from an SVG graph, coefficients from vertex/points, word problems, find-the-mistake) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nz = (a, b) => { let v = 0; while (!v) v = rnd(a, b); return v; };
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n === 0 ? 0 : n);
  const num = v => { const r = Math.round(v * 1e4) / 1e4; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const par = v => v < 0 ? "(" + num(v) + ")" : num(v);
  // ax² + bx + c with decimal-comma coefficients
  const Q = (a, b, c) => { let o = ""; for (const [k, v] of [[a, "x²"], [b, "x"], [c, ""]]) { if (!k) continue; const m = Math.abs(k), body = v ? (m === 1 ? v : num(m) + v) : num(m); o += o ? (k < 0 ? " − " : " + ") + body : (k < 0 ? "−" : "") + body; } return o || "0"; };
  const co = a => a === 1 ? "" : a === -1 ? "−" : num(a);                      // leading coefficient before a bracket
  const sq = m => m === 0 ? "x²" : `(x ${m > 0 ? "−" : "+"} ${num(Math.abs(m))})²`; // (x − m)²
  const lin = p => p === 0 ? "x" : `(x ${p > 0 ? "−" : "+"} ${Math.abs(p)})`;
  const VF = (a, m, n) => co(a) + sq(m) + (n ? (n < 0 ? " − " : " + ") + num(Math.abs(n)) : "");   // a(x − m)² + n
  const FF = (a, p, q) => co(a) + lin(p) + lin(q);                                                // a(x − p)(x − q)
  const P = (a, b) => `(${num(a)}; ${num(b)})`;
  const B = s => h("b", {}, s);
  const T = (...k) => h("span", {}, ...k);
  // parabola from vertex: a, m, n → b, c
  const eqB = x => x === 0 ? "c" : `${x * x} ${x < 0 ? "−" : "+"} ${Math.abs(x) === 1 ? "" : Math.abs(x)}b + c`;   // x² + bx + c at a point
  const fromV = (a, m, n) => ({ a, b: -2 * a * m, c: a * m * m + n });
  const yv = (a, b, c, x) => a * x * x + b * x + c;
  const step = (a, b, c, x) => `${a === 1 ? "" : a === -1 ? "−" : num(a) + "·"}${par(x)}² ${b < 0 ? "−" : "+"} ${num(Math.abs(b))}·${par(x)} ${c < 0 ? "−" : "+"} ${num(Math.abs(c))} = ${num(yv(a, b, c, x))}`;
  const x0txt = (a, b) => `x₀ = −b/(2a) = ${num(-b)}/${par(2 * a)} = ${num(-b / (2 * a))}`;
  // vertex-type parabola written in a random form (standard, reordered, vertex form)
  function vText(a, m, n) {
    const { b, c } = fromV(a, m, n), f = pick(["std", "std", "std", "vf"]);
    if (f === "vf") return { t: "y = " + VF(a, m, n), x0: `Təpə formasıdır: y = a(x − m)² + n → təpə (${num(m)}; ${num(n)}).`, f };
    return { t: "y = " + Q(a, b, c), x0: `${x0txt(a, b)}; y₀ = ${step(a, b, c, m)}.`, f };
  }

  // ---- coordinate plane SVG (same builder as the lesson figures) ----
  const NS = "http://www.w3.org/2000/svg";
  let PID = 0;
  function plot(o) {
    const [x0, x1] = o.x, [y0, y1] = o.y, ux = 22, uy = 22;
    const pl = 16, pr = 16, pt = 16, pb = 16;
    const W = (x1 - x0) * ux + pl + pr, H = (y1 - y0) * uy + pt + pb;
    const X = x => +(pl + (x - x0) * ux).toFixed(1), Y = y => +(pt + (y1 - y) * uy).toFixed(1);
    const id = "kg" + (++PID) + "x" + Math.floor(Math.random() * 1e6);
    const M = n => n < 0 ? "−" + (-n) : String(n);
    let s = "";
    for (let x = x0; x <= x1; x++) s += `<line x1="${X(x)}" y1="${Y(y1)}" x2="${X(x)}" y2="${Y(y0)}" stroke="var(--bubble)" stroke-opacity=".4" stroke-width="1"/>`;
    for (let y = y0; y <= y1; y++) s += `<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" stroke="var(--bubble)" stroke-opacity=".4" stroke-width="1"/>`;
    const ax = Y(0), ay = X(0), xe = X(x1) + 10, ye = Y(y1) - 10;
    s += `<line x1="${X(x0)}" y1="${ax}" x2="${xe}" y2="${ax}" stroke="var(--ink)" stroke-width="1.5"/><path d="M${xe - 7} ${ax - 4}L${xe} ${ax}L${xe - 7} ${ax + 4}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += `<line x1="${ay}" y1="${Y(y0)}" x2="${ay}" y2="${ye}" stroke="var(--ink)" stroke-width="1.5"/><path d="M${ay - 4} ${ye + 7}L${ay} ${ye}L${ay + 4} ${ye + 7}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += `<text x="${xe - 2}" y="${ax - 7}" text-anchor="end" class="lbl">x</text><text x="${ay + 7}" y="${ye + 9}" class="lbl">y</text><text x="${ay - 4}" y="${ax + 12}" text-anchor="end">O</text>`;
    for (let x = x0; x < x1; x++) if (x !== 0) s += `<line x1="${X(x)}" y1="${ax - 3}" x2="${X(x)}" y2="${ax + 3}" stroke="var(--ink)"/><text x="${X(x)}" y="${ax + 13}" text-anchor="middle">${M(x)}</text>`;
    for (let y = y0; y < y1; y++) if (y !== 0) s += `<line x1="${ay - 3}" y1="${Y(y)}" x2="${ay + 3}" y2="${Y(y)}" stroke="var(--ink)"/><text x="${ay - 5}" y="${Y(y) + 4}" text-anchor="end">${M(y)}</text>`;
    let d = "", pen = false;
    for (let i = 0; i <= 300; i++) { const x = x0 + (x1 - x0) * i / 300, y = o.f(x); if (y < y0 - 3 || y > y1 + 3) { pen = false; continue; } d += (pen ? "L" : "M") + X(x) + " " + Y(y); pen = true; }
    s += `<defs><clipPath id="${id}"><rect x="${X(x0)}" y="${Y(y1)}" width="${X(x1) - X(x0)}" height="${Y(y0) - Y(y1)}"/></clipPath></defs><g clip-path="url(#${id})"><path d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.5"/></g>`;
    for (const p of o.pts || []) s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="4.5" fill="var(--vec)"/>`;
    return { W, H, body: s };
  }
  const svgEl = (o, label) => { const g = plot(o); const e = document.createElementNS(NS, "svg"); e.setAttribute("viewBox", `0 0 ${g.W} ${g.H}`); e.setAttribute("class", "oy-svg"); e.setAttribute("role", "img"); e.setAttribute("aria-label", label); e.innerHTML = g.body; return e; };

  const levels = [
    { id: "tepe", ad: "Təpə və simmetriya oxu", izah: "x₀ = −b/(2a), y₀ = y(x₀). y = a(x − m)² + n → təpə (m; n). y = a(x − p)(x − q) → x₀ = (p + q)/2. Simmetriya oxu: x = x₀.",
      gen() {
        const kind = pick(["std", "std", "ff", "half"]);
        const ask = pick(["x0", "y0", "y0", "axis", "sum"]);
        let a, m, n, t, why;
        if (kind === "ff") {
          a = pick([1, -1, 2, -2, 3]); let p, q; do { p = rnd(-6, 6); q = rnd(-6, 6); } while (p === q);
          m = (p + q) / 2; n = a * (m - p) * (m - q);
          t = "y = " + FF(a, p, q);
          if (a !== 1 && a !== -1) why = `Köklər ${S(p)} və ${S(q)} → x₀ = (${S(p)} + ${par(q)})/2 = ${num(m)}; y₀ = ${num(a)}·(${num(m)} − ${par(p)})·(${num(m)} − ${par(q)}) = ${num(n)}.`;
          else why = `Köklər ${S(p)} və ${S(q)} → x₀ = (${S(p)} + ${par(q)})/2 = ${num(m)}; y₀ = ${a < 0 ? "−" : ""}(${num(m)} − ${par(p)})·(${num(m)} − ${par(q)}) = ${num(n)}.`;
        } else if (kind === "half") {
          a = 1; const b = pick([-1, 1]) * pick([1, 3, 5, 7]), c = rnd(-6, 6); m = -b / 2; n = c - b * b / 4;
          t = "y = " + Q(1, b, c); why = `${x0txt(1, b)}; y₀ = ${step(1, b, c, m)}.`;
        } else {
          a = pick([1, -1, 2, -2, 3, -3]); m = nz(-5, 5); n = rnd(-9, 9);
          const v = vText(a, m, n); t = v.t; why = v.x0;
        }
        if (ask === "x0") return { text: T(`${t} parabolasının təpəsinin `, B("absisini (x₀)"), " tap."), answer: m, show: num(m), solution: why + ` Soruşulan x₀ = ${num(m)}.` };
        if (ask === "y0") return { text: T(`${t} parabolasının təpəsinin `, B("ordinatını (y₀)"), " tap."), answer: n, show: num(n), solution: why + ` Soruşulan y₀ = ${num(n)}.` };
        if (ask === "axis") return { text: T(`${t} parabolasının simmetriya oxu `, B("x = ?"), " düz xəttidir. Ədədi yaz."), answer: m, show: num(m), solution: why + ` Simmetriya oxu təpədən keçir: x = ${num(m)}.` };
        return { text: `${t} parabolasının təpəsinin koordinatlarının cəmini tap.`, answer: m + n, show: num(m + n), solution: why + ` Təpə ${P(m, n)}, cəm ${num(m + n)}.` };
      } },

    { id: "minmax", ad: "Ən kiçik / ən böyük qiymət", izah: "a > 0 — ən kiçik qiymət, a < 0 — ən böyük qiymət; o, y₀-dır. 'Hansı x-də alır?' — x₀. Parçada: təpə parçadan kənardırsa, cavab ucdadır.",
      gen() {
        const kind = pick(["val", "val", "where", "range", "seg"]);
        let a, m, n; do { a = pick([1, -1, 2, -2, 3, -3]); m = nz(-5, 5); n = rnd(-9, 9); } while (m === n);
        const up = a > 0, word = up ? "ən kiçik" : "ən böyük", v = vText(a, m, n), { b, c } = fromV(a, m, n);
        const lead = `a = ${num(a)} ${up ? "> 0 → qollar yuxarı, təpə ən aşağı nöqtədir" : "< 0 → qollar aşağı, təpə ən yuxarı nöqtədir"}. `;
        if (kind === "val") return { text: T(`${v.t} funksiyasının `, B(`${word} qiymətini`), " tap."), answer: n, show: S(n), tol: 0.01,
          solution: lead + v.x0 + ` ${word[0].toUpperCase() + word.slice(1)} qiymət — y₀ = ${S(n)} (x₀ = ${S(m)} deyil).` };
        if (kind === "where") return { text: T(`${v.t} funksiyası ${word} qiymətini `, B("x-in hansı qiymətində"), " alır?"), answer: m, show: S(m), tol: 0.01,
          solution: lead + v.x0 + ` Soruşulan — qiymətin alındığı x: x₀ = ${S(m)} (qiymətin özü ${S(n)}-dir).` };
        if (kind === "range") return { text: `${v.t} funksiyasının qiymətlər çoxluğu ${up ? "[A; +∞)" : "(−∞; A]"} şəklindədir. A = ?`, answer: n, show: S(n), tol: 0.01,
          solution: lead + v.x0 + ` Funksiyanın ${word} qiyməti ${S(n)}-dir, ona görə E(y) = ${up ? `[${S(n)}; +∞)` : `(−∞; ${S(n)}]`}. A = ${S(n)}.` };
        // seg: on [s; s + L] the extreme (min for a > 0, max for a < 0)
        const L = rnd(2, 4), inside = Math.random() < .4, s = inside ? m - rnd(1, L - 1) : (Math.random() < .5 ? m + rnd(1, 3) : m - L - rnd(1, 3)), e = s + L;
        const ans = inside ? n : (Math.abs(s - m) < Math.abs(e - m) ? yv(a, b, c, s) : yv(a, b, c, e)), near = Math.abs(s - m) < Math.abs(e - m) ? s : e;
        return { text: T(`y = ${Q(a, b, c)} funksiyasının [${S(s)}; ${S(e)}] parçasında `, B(`${word} qiymətini`), " tap."), answer: ans, show: S(ans), tol: 0.01,
          solution: lead + `${x0txt(a, b)}. ` + (inside ? `x₀ parçanın içindədir → cavab y₀ = ${step(a, b, c, m)}.` : `x₀ = ${S(m)} parçadan kənardadır, parçada funksiya ${(near === s) === up ? "artır" : "azalır"}. ${word[0].toUpperCase() + word.slice(1)} qiymət təpəyə yaxın ucdadır, x = ${S(near)}: y = ${step(a, b, c, near)}.`) };
      } },

    { id: "kesisme", ad: "Oxlarla kəsişmə", izah: "Oy: x = 0 → y = c. Ox: ax² + bx + c = 0. D > 0 — iki nöqtə, D = 0 — toxunur, D < 0 — kəsmir. Köklər təpəyə görə simmetrikdir.",
      gen() {
        const kind = pick(["oy", "zero", "zero", "count", "tangent", "other"]);
        if (kind === "oy") {
          const f = pick(["re", "ff", "vf"]);
          if (f === "ff") { const a = pick([1, -1, 2, -2, 3]), p = nz(-6, 6), q = nz(-6, 6), c = a * p * q;
            return { text: T(`y = ${FF(a, p, q)} parabolası Oy oxunu kəsir. Kəsişmə nöqtəsinin `, B("ordinatını"), " tap."), answer: c, show: S(c), tol: 0.01,
              solution: `Oy oxunda x = 0: y = ${a === 1 ? "" : a === -1 ? "−" : num(a) + "·"}(0 ${p > 0 ? "−" : "+"} ${Math.abs(p)})(0 ${q > 0 ? "−" : "+"} ${Math.abs(q)}) = ${S(c)}. (Kökləri tapmaq lazım deyil.)` }; }
          if (f === "vf") { const a = pick([1, -1, 2, -2]), m = nz(-4, 4), n = rnd(-9, 9), c = a * m * m + n;
            return { text: T(`y = ${VF(a, m, n)} parabolası Oy oxunu kəsir. Kəsişmə nöqtəsinin `, B("ordinatını"), " tap."), answer: c, show: S(c), tol: 0.01,
              solution: `x = 0: y = ${num(a)}·${par(-m)}² ${n < 0 ? "−" : "+"} ${Math.abs(n)} = ${S(a * m * m)} ${n < 0 ? "−" : "+"} ${Math.abs(n)} = ${S(c)}. (Təpənin ordinatı ${S(n)} deyil — təpə Oy üstündə deyil.)` }; }
          const a = nz(-4, 4), b = nz(-9, 9), c = nz(-9, 9);
          return { text: T(`y = ${num(c)} ${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x ${a < 0 ? "−" : "+"} ${Math.abs(a) === 1 ? "" : Math.abs(a)}x² parabolası Oy oxunu kəsir. Kəsişmə nöqtəsinin `, B("ordinatını"), " tap."), answer: c, show: S(c), tol: 0.01,
            solution: `Oy oxunda x = 0 → y = c = ${S(c)}. Nöqtə (0; ${S(c)}).` };
        }
        if (kind === "zero") {
          const a = pick([1, 1, -1, 2, -2, 3]); let r1, r2; do { r1 = rnd(-7, 7); r2 = rnd(-7, 7); } while (r1 >= r2);
          const b = -a * (r1 + r2), c = a * r1 * r2, ask = pick(["big", "small", "dist", "sum"]);
          const word = { big: "Böyük absisi tap.", small: "Kiçik absisi tap.", dist: "Bu iki nöqtə arasındakı məsafəni tap.", sum: "Kəsişmə nöqtələrinin absislərinin cəmini tap." }[ask];
          const ans = { big: r2, small: r1, dist: r2 - r1, sum: r1 + r2 }[ask];
          return { text: `y = ${Q(a, b, c)} parabolası Ox oxunu iki nöqtədə kəsir. ${word}`, answer: ans, show: S(ans), tol: 0.01,
            solution: `y = 0: ${Q(a, b, c)} = 0${a !== 1 ? ` → (${num(a)}-ə böl) ${Q(1, b / a, c / a)} = 0` : ""} → x = ${S(r1)}, x = ${S(r2)} (Viyet: cəm ${S(r1 + r2)}, hasil ${S(r1 * r2)}). Cavab: ${S(ans)}.` };
        }
        if (kind === "count") {
          const t = rnd(0, 2), a = pick([1, -1, 2, -2]); let b, c, m;
          if (t === 2) { let r1, r2; do { r1 = rnd(-6, 6); r2 = rnd(-6, 6); } while (r1 === r2); b = -a * (r1 + r2); c = a * r1 * r2; }
          else { m = nz(-4, 4); const n = t === 1 ? 0 : Math.sign(a) * rnd(1, 6); ({ b, c } = fromV(a, m, n)); }
          const D = b * b - 4 * a * c, cnt = D > 0 ? 2 : D === 0 ? 1 : 0;
          return { text: `y = ${Q(a, b, c)} parabolası Ox oxu ilə neçə ortaq nöqtəyə malikdir?`, answer: cnt, show: String(cnt), tol: 0.01,
            solution: `D = b² − 4ac = ${par(b)}² − 4·${par(a)}·${par(c)} = ${S(b * b)} ${-4 * a * c < 0 ? "−" : "+"} ${Math.abs(4 * a * c)} = ${S(D)}. ${D > 0 ? "D > 0 → 2 nöqtə." : D === 0 ? "D = 0 → toxunur, 1 nöqtə." : "D < 0 → kəsmir, 0 nöqtə."}` };
        }
        if (kind === "tangent") {
          if (Math.random() < .5) { const m = nz(-6, 6), b = -2 * m, k = m * m;
            return { text: `y = ${Q(1, b, 0)} + k parabolası Ox oxuna toxunur. k = ?`, answer: k, show: S(k), tol: 0.01,
              solution: `Toxunur → D = 0: ${par(b)}² − 4·1·k = 0 → ${b * b} − 4k = 0 → k = ${k}. (Onda y = ${sq(m)}.)` }; }
          const m = rnd(1, 7), c = m * m;
          return { text: `y = x² + kx + ${c} parabolası Ox oxuna toxunur. k-nın müsbət qiymətini tap.`, answer: 2 * m, show: String(2 * m), tol: 0.01,
            solution: `D = k² − 4·${c} = 0 → k² = ${4 * c} → k = ±${2 * m}. Müsbəti: ${2 * m}.` };
        }
        // other zero via symmetry / Vieta
        let r1, r2; do { r1 = rnd(-7, 7); r2 = rnd(-7, 7); } while (r1 === r2);
        const b = -(r1 + r2);
        return { text: `y = ${Q(1, b, 0)} + c parabolası Ox oxunu (${S(r1)}; 0) nöqtəsində kəsir. Digər kəsişmə nöqtəsinin absisini tap.`, answer: r2, show: S(r2), tol: 0.01,
          solution: `Viyet: x₁ + x₂ = −b = ${S(r1 + r2)} → x₂ = ${S(r1 + r2)} − ${par(r1)} = ${S(r2)}. (Və ya: x₀ = ${num((r1 + r2) / 2)}, köklər təpədən eyni məsafədədir.)` };
      } },

    { id: "qrafik", ad: "Qrafikdən oxu", izah: "Təpəni tap; təpədən 1 vahid sağa — parabola a qədər qalxır/enir. c — Oy ilə kəsişmə. b = −2a·x₀. Yalnız tor düyünlərinə baxırıq.",
      gen() {
        let a, m, n, d, pts, c, b;
        for (;;) {
          a = pick([1, -1, 2, -2, 0.5, -0.5]); m = rnd(-3, 3); n = a > 0 ? rnd(-5, 1) : rnd(-1, 5); d = Math.abs(a) === 0.5 ? 2 : 1;
          ({ b, c } = fromV(a, m, n));
          const side = n + a * d * d;
          if (side < -6 || side > 6) continue;
          pts = [[m, n], [m - d, side], [m + d, side]];
          if (m !== 0 && Math.abs(c) <= 6 && !pts.some(p => p[0] === 0)) pts.push([0, c]);
          break;
        }
        const f = x => a * (x - m) * (x - m) + n;
        const svg = svgEl({ x: [-6, 6], y: [-6, 6], f, pts }, "y = ax² + bx + c parabolası, təpə və bir neçə nöqtə işarələnib");
        const lead = "Şəkildə y = ax² + bx + c parabolası verilib (işarələnmiş nöqtələr tor düyünlərindədir). ";
        const rd = `Təpə ${P(m, n)}. Təpədən ${d} sağa: ${P(m + d, n + a * d * d)} — ${a > 0 ? "qalxır" : "enir"} ${num(Math.abs(a * d * d))}, deməli a·${d}² = ${num(a * d * d)} → a = ${num(a)}.`;
        const opts = ["x0", "y0", "a", "a", "b", "f", "ext", "cnt"]; if (Math.abs(c) <= 6) opts.push("c", "c");
        const ask = pick(opts);
        if (ask === "x0") return { text: T(lead, "Təpənin ", B("absisi (x₀)"), " = ?"), svg, answer: m, show: S(m), tol: 0.01, solution: `Ən ${a > 0 ? "aşağı" : "yuxarı"} nöqtə — təpə ${P(m, n)}. x₀ = ${S(m)}.` };
        if (ask === "y0") return { text: T(lead, "Təpənin ", B("ordinatı (y₀)"), " = ?"), svg, answer: n, show: S(n), tol: 0.01, solution: `Təpə ${P(m, n)}. y₀ = ${S(n)}.` };
        if (ask === "ext") return { text: T(lead, "Funksiyanın ", B(a > 0 ? "ən kiçik qiyməti" : "ən böyük qiyməti"), " = ?"), svg, answer: n, show: S(n), tol: 0.01,
          solution: `Qollar ${a > 0 ? "yuxarı" : "aşağı"}, təpə ${P(m, n)} ən ${a > 0 ? "aşağı" : "yuxarı"} nöqtədir. Qiymət — y: ${S(n)} (x₀ = ${S(m)} deyil).` };
        if (ask === "a") return { text: T(lead, B("a"), " = ?"), svg, answer: a, show: num(a), solution: rd };
        if (ask === "c") return { text: T(lead, B("c"), " = ?"), svg, answer: c, show: S(c), tol: 0.01, solution: `c — parabolanın Oy oxunu kəsdiyi nöqtənin ordinatı: (0; ${S(c)}) → c = ${S(c)}.` };
        if (ask === "b") return { text: T(lead, B("b"), " = ?"), svg, answer: b, show: num(b), solution: rd + ` x₀ = −b/(2a) → b = −2a·x₀ = −2·${par(a)}·${par(m)} = ${num(b)}.` };
        if (ask === "cnt") { const cnt = n === 0 ? 1 : (a > 0) === (n < 0) ? 2 : 0;
          return { text: T(lead, "f(x) = 0 tənliyinin ", B("neçə kökü"), " var?"), svg, answer: cnt, show: String(cnt), tol: 0.01,
            solution: `Köklər — parabolanın Ox oxu ilə ortaq nöqtələri. Təpə ${P(m, n)}, qollar ${a > 0 ? "yuxarı" : "aşağı"}: ` + (cnt === 2 ? "Ox-u iki nöqtədə kəsir → 2." : cnt === 1 ? "təpə Ox üstündədir, toxunur → 1." : "Ox-a çatmır → 0.") }; }
        let xv; do { xv = m + nz(-4, 4); } while (pts.some(p => p[0] === xv) || Math.abs(xv) > 7);
        const val = f(xv);
        return { text: T(lead, B(`f(${S(xv)})`), " = ?"), svg, answer: val, show: num(val), solution: rd + ` y = ${co(a)}${sq(m)}${n ? (n < 0 ? " − " : " + ") + Math.abs(n) : ""}. f(${S(xv)}) = ${num(a)}·${par(xv - m)}² ${n < 0 ? "−" : "+"} ${Math.abs(n)} = ${num(val)}.` };
      } },

    { id: "emsal", ad: "Əmsalları tap", izah: "Təpə (m; n): b = −2am, c-ni y(m) = n-dən tap; və ya y = a(x − m)² + n. Nöqtə parabolanın üstündədirsə, koordinatları düsturu ödəyir. Eyni y-li nöqtələr oxa görə simmetrikdir.",
      gen() {
        const kind = pick(["vb", "vc", "va", "two", "sym", "axisA"]);
        if (kind === "vb" || kind === "vc") {
          const m = nz(-6, 6), n = rnd(-9, 9), b = -2 * m, c = m * m + n;
          if (kind === "vb") return { text: T(`y = x² + bx + c parabolasının təpəsi ${P(m, n)} nöqtəsidir. `, B("b"), " = ?"), answer: b, show: S(b), tol: 0.01,
            solution: `x₀ = −b/2 = ${S(m)} → b = ${S(b)}.` };
          return { text: T(`y = x² + bx + c parabolasının təpəsi ${P(m, n)} nöqtəsidir. `, B("c"), " = ?"), answer: c, show: S(c), tol: 0.01,
            solution: `x₀ = −b/2 = ${S(m)} → b = ${S(b)}. Təpə parabolanın üstündədir: ${par(m)}² ${b < 0 ? "−" : "+"} ${Math.abs(b)}·${par(m)} + c = ${S(n)} → ${S(m * m + b * m)} + c = ${S(n)} → c = ${S(c)}.` };
        }
        if (kind === "va") {
          const a = nz(-3, 3), m = rnd(-4, 4), n = rnd(-8, 8), dd = nz(-3, 3), x = m + dd, y = n + a * dd * dd;
          return { text: T(`Parabolanın təpəsi ${P(m, n)}, o ${P(x, y)} nöqtəsindən keçir. Parabola y = ax² + bx + c şəklindədir. `, B("a"), " = ?"), answer: a, show: S(a), tol: 0.01,
            solution: `y = a${sq(m)} ${n < 0 ? "−" : "+"} ${Math.abs(n)}. x = ${S(x)}: ${S(y)} = a·${par(dd)}² ${n < 0 ? "−" : "+"} ${Math.abs(n)} → ${dd * dd}a = ${S(y - n)} → a = ${S(a)}.` };
        }
        if (kind === "two") {
          const b = rnd(-8, 8), c = rnd(-9, 9); let x1, x2; do { x1 = rnd(-4, 4); x2 = rnd(-4, 4); } while (x1 >= x2);
          const y1 = yv(1, b, c, x1), y2 = yv(1, b, c, x2), askB = Math.random() < .5;
          return { text: T(`y = x² + bx + c parabolası ${P(x1, y1)} və ${P(x2, y2)} nöqtələrindən keçir. `, B(askB ? "b" : "c"), " = ?"), answer: askB ? b : c, show: S(askB ? b : c), tol: 0.01,
            solution: `${eqB(x1)} = ${S(y1)} və ${eqB(x2)} = ${S(y2)}. İkincidən birincini çıx: ${x2 * x2 - x1 * x1 ? S(x2 * x2 - x1 * x1) + " + " : ""}${x2 - x1 === 1 ? "" : x2 - x1}b = ${S(y2 - y1)} → b = ${S(b)}. Sonra c = ${S(y1)} − ${par(x1 * x1)} − ${par(b * x1)} = ${S(c)}.` };
        }
        if (kind === "sym") {
          const m = rnd(-5, 5), p = m + nz(-6, 6), q = rnd(-9, 9), other = 2 * m - p;
          return { text: `Parabolanın simmetriya oxu x = ${S(m)} düz xəttidir. A${P(p, q)} nöqtəsi parabolanın üzərindədir. Parabolanın ordinatı ${S(q)} olan digər nöqtəsinin absisini tap.`, answer: other, show: S(other), tol: 0.01,
            solution: `A oxdan ${Math.abs(p - m)} vahid ${p < m ? "soldadır" : "sağdadır"}; simmetrik nöqtə oxdan o qədər ${p < m ? "sağdadır" : "soldadır"}: x = 2·${par(m)} − ${par(p)} = ${S(other)}.` };
        }
        // axisA: y = ax² + bx + c with b, axis given → a
        const a = nz(-4, 4), m = nz(-4, 4), b = -2 * a * m, c = rnd(-9, 9);
        return { text: T(`y = ax² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x ${c < 0 ? "−" : "+"} ${Math.abs(c)} parabolasının simmetriya oxu x = ${S(m)} düz xəttidir. `, B("a"), " = ?"), answer: a, show: S(a), tol: 0.01,
          solution: `x₀ = −b/(2a) = ${S(-b)}/(2a) = ${S(m)} → 2a·${par(m)} = ${S(-b)} → a = ${S(a)}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "'Ən çox / ən az' → təpə. Nə vaxt, hansı ölçüdə → x₀. Nə qədər (hündürlük, sahə, hasil) → y₀. Top: h = −5t² + vt + h₀ (g = 10 m/s²).",
      gen() {
        const kind = pick(["ball", "ball", "ball0", "fence", "wall", "prod"]);
        if (kind === "ball") {
          const v = pick([10, 15, 20, 25, 30, 35, 40]), t0 = v / 10, hm = v * v / 20, ask = pick(["t", "h", "h", "land"]);
          const base = `Top yerdən şaquli yuxarı atılıb. Onun hündürlüyü h = −5t² + ${v}t qanunu ilə dəyişir (h — metr, t — saniyə). `;
          if (ask === "t") return { text: T(base, "Top ", B("neçə saniyədən sonra"), " ən yüksək nöqtəyə çatır?"), answer: t0, unit: "s", show: num(t0),
            solution: `t₀ = −b/(2a) = −${v}/(2·(−5)) = ${num(t0)} s. Soruşulan vaxtdır (x₀).` };
          if (ask === "land") return { text: T(base, "Top ", B("neçə saniyədən sonra"), " yerə düşür?"), answer: 2 * t0, unit: "s", show: num(2 * t0),
            solution: `h = 0: −5t² + ${v}t = 0 → t(−5t + ${v}) = 0 → t = 0 (atılan an) və t = ${num(2 * t0)} s.` };
          return { text: T(base, "Top ", B("ən çox neçə metr"), " hündürlüyə qalxır?"), answer: hm, unit: "m", show: num(hm),
            solution: `t₀ = −${v}/(2·(−5)) = ${num(t0)} s. h(${num(t0)}) = −5·${num(t0 * t0)} + ${v}·${num(t0)} = ${num(-5 * t0 * t0)} + ${num(v * t0)} = ${num(hm)} m. Soruşulan hündürlükdür (y₀), vaxt yox.` };
        }
        if (kind === "ball0") {
          const k = rnd(1, 3), t2 = rnd(k + 1, 6), v = 5 * (t2 - k), h0 = 5 * k * t2, t0 = (t2 - k) / 2, hm = h0 + v * v / 20;
          const base = `Top ${h0} m hündürlükdən şaquli yuxarı atılıb: h = −5t² + ${v}t + ${h0} (h — metr, t — saniyə). `;
          if (Math.random() < .5) return { text: T(base, "Top ", B("neçə saniyədən sonra"), " yerə düşür?"), answer: t2, unit: "s", show: String(t2), tol: 0.01,
            solution: `h = 0: −5t² + ${v}t + ${h0} = 0 → (−5-ə böl) t² − ${t2 - k}t − ${k * t2} = 0 → t = ${t2} və t = −${k} (vaxt mənfi olmur, atılır). Cavab: ${t2} s.` };
          return { text: T(base, "Top ", B("ən çox neçə metr"), " hündürlüyə qalxır?"), answer: hm, unit: "m", show: num(hm),
            solution: `t₀ = −${v}/(2·(−5)) = ${num(t0)} s. h(${num(t0)}) = −5·${num(t0 * t0)} + ${v}·${num(t0)} + ${h0} = ${num(hm)} m.` };
        }
        if (kind === "fence") {
          const P4 = 4 * rnd(3, 15), s = P4 / 4, askS = Math.random() < .6;
          return { text: `Uzunluğu ${P4} m olan torla düzbucaqlı formalı sahə hasarlanır. ${askS ? "Sahənin ən böyük qiyməti neçə m²-dir?" : "Sahə ən böyük olanda düzbucaqlının bir tərəfi neçə metrdir?"}`,
            answer: askS ? s * s : s, unit: askS ? "m²" : "m", show: String(askS ? s * s : s), tol: 0.01,
            solution: `Tərəflər x və ${P4 / 2} − x. S = x(${P4 / 2} − x) = −x² + ${P4 / 2}x. x₀ = ${P4 / 2}/2 = ${s} m (kvadrat). ${askS ? `S = ${s}·${s} = ${s * s} m².` : ""}` };
        }
        if (kind === "wall") {
          const L = 4 * rnd(3, 15), x = L / 4, S2 = x * (L - 2 * x), askS = Math.random() < .6;
          return { text: `Uzunluğu ${L} m olan torla düzbucaqlı sahə hasarlanır; sahənin bir tərəfi divardır (ora tor çəkilmir). ${askS ? "Sahənin ən böyük qiyməti neçə m²-dir?" : "Sahə ən böyük olanda divara perpendikulyar tərəf neçə metrdir?"}`,
            answer: askS ? S2 : x, unit: askS ? "m²" : "m", show: String(askS ? S2 : x), tol: 0.01,
            solution: `Divara perpendikulyar tərəflər x, paralel tərəf ${L} − 2x. S = x(${L} − 2x) = −2x² + ${L}x. x₀ = −${L}/(2·(−2)) = ${x} m. ${askS ? `S = ${x}·${L - 2 * x} = ${S2} m².` : ""}` };
        }
        if (Math.random() < .5) { const s = 2 * rnd(4, 20), m = s / 2;
          return { text: `Cəmi ${s} olan iki ədədin hasilinin ən böyük qiymətini tap.`, answer: m * m, show: String(m * m), tol: 0.01,
            solution: `Ədədlər x və ${s} − x. Hasil x(${s} − x) = −x² + ${s}x, x₀ = ${m}. Ən böyük hasil ${m}·${m} = ${m * m}.` }; }
        const d = 2 * rnd(1, 8), m = d / 2;
        return { text: `Fərqi ${d} olan iki ədədin hasilinin ən kiçik qiymətini tap.`, answer: -m * m, show: S(-m * m), tol: 0.01,
          solution: `Ədədlər x və x + ${d}. Hasil x(x + ${d}) = x² + ${d}x, x₀ = −${d}/2 = −${m}. Ədədlər −${m} və ${m}, hasil −${m * m}.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let a, m, n; do { a = pick([1, -1, 2, -2]); m = pick([-4, -3, -2, 2, 3, 4]); n = rnd(-9, 9); } while (n === m || n === -m);
        const { b, c } = fromV(a, m, n), up = a > 0, word = up ? "ən kiçik" : "ən böyük";
        const bad = rnd(0, 2);
        let mm = m, nn = n;
        let s1 = `x₀ = −b/(2a) = ${S(-b)}/${par(2 * a)} = ${S(m)}`;
        if (bad === 0) { mm = -m; nn = yv(a, b, c, mm); s1 = `x₀ = b/(2a) = ${S(b)}/${par(2 * a)} = ${S(mm)}`; }
        let s2 = `y₀ = ${num(a)}·${par(mm)}² ${b < 0 ? "−" : "+"} ${Math.abs(b)}·${par(mm)} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${S(a * mm * mm)} ${b * mm < 0 ? "−" : "+"} ${Math.abs(b * mm)} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${S(nn)}`;
        if (bad === 1) { nn = a * m + b * m + c; s2 = `y₀ = ${num(a)}·${par(m)}² ${b < 0 ? "−" : "+"} ${Math.abs(b)}·${par(m)} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${S(a * m)} ${b * m < 0 ? "−" : "+"} ${Math.abs(b * m)} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = ${S(nn)}`; }
        let s3 = `a ${up ? "> 0" : "< 0"}, ona görə ${word} qiymət y₀-dır: ${S(nn)}`;
        if (bad === 2) s3 = pick([`a ${up ? "> 0" : "< 0"}, ona görə ${word} qiymət x₀-dır: ${S(m)}`, `a ${up ? "> 0" : "< 0"}, ona görə ${up ? "ən böyük" : "ən kiçik"} qiymət y₀-dır, ${word} qiymət yoxdur`]);
        const text = h("div", {}, h("p", {}, `y = ${Q(a, b, c)} funksiyasının ${word} qiymətini tapırıq.`),
          h("ol", { class: "oy-steps" }, h("li", {}, s1), h("li", {}, s2), h("li", {}, s3)));
        const why = [`1-ci addım: düstur x₀ = −b/(2a)-dır, minus unudulub. Düzü x₀ = ${S(-b)}/${par(2 * a)} = ${S(m)}.`,
          `2-ci addım: x₀² unudulub — ${num(a)}·${par(m)}² = ${S(a * m * m)}, ${S(a * m)} yox. Düzü y₀ = ${S(n)}.`,
          `3-cü addım: ${up ? "a > 0 — qollar yuxarı, təpə ən aşağı nöqtədir" : "a < 0 — qollar aşağı, təpə ən yuxarı nöqtədir"}; ${word} qiymət y₀ = ${S(n)}-dir (x₀ = ${S(m)} — qiymətin alındığı yerdir).`][bad];
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
      key: "kvadrat-funksiya", title: "Kvadrat funksiya, parabola", fenn: "riyaziyyat", link: "dersler/kvadrat-funksiya.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 5/2, onluq 2,5 (və ya 2.5). Nöqtə soruşulmur — yalnız sualdakı ədədi (x₀, y₀, qiymət) yaz.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["tepe", "tepe", "minmax", "minmax", "kesisme", "kesisme", "qrafik", "emsal", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/kvadrat-funksiya.html")) b.push("dersler/kvadrat-funksiya.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
