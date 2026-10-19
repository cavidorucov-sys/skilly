// Xətti funksiya — mastery game levels (k and b, axis intersections, "find x or y?", k and b from points/graph,
// parallel and intersecting lines, word problems, find-the-mistake) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nz = (a, b) => { let v = 0; while (!v) v = rnd(a, b); return v; };               // random non-zero integer
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n === 0 ? 0 : n);                           // integer with a real minus sign
  const num = v => { const r = Math.round(v * 1e4) / 1e4; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); }; // decimal comma
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const kx = k => k === 1 ? "x" : k === -1 ? "−x" : num(k) + "x";
  const L = (k, b) => k === 0 ? num(b) : kx(k) + (b ? (b < 0 ? " − " + num(-b) : " + " + num(b)) : "");   // "2x − 3"
  const Lrev = (k, b) => num(b) + (k < 0 ? " − " : " + ") + (Math.abs(k) === 1 ? "x" : num(Math.abs(k)) + "x"); // "5 − 3x"
  const P = (a, b) => `(${num(a)}; ${num(b)})`;
  const par = v => v < 0 ? "(" + num(v) + ")" : num(v);                                    // bracket negatives in products
  const mlin = p => p === 0 ? "m" : p > 0 ? "m − " + p : "m + " + (-p);                   // m − p
  const ev = (k, x, b) => (typeof k === "string" ? k : num(k)) + "·" + par(x) + (b ? (b < 0 ? " − " : " + ") + num(Math.abs(b)) : ""); // "2·(−3) + 5"
  const B = s => h("b", {}, s);
  const T = (...k) => h("span", {}, ...k);

  // ---- coordinate plane SVG (same builder as the lesson figures) ----
  const NS = "http://www.w3.org/2000/svg";
  let PID = 0;
  function plot(o) {
    const [x0, x1] = o.x, [y0, y1] = o.y;
    const ux = o.u || Math.max(14, Math.min(26, Math.floor(280 / (x1 - x0)))), uy = o.uy || ux;
    const pl = x0 >= 0 ? 26 : 16, pr = 16, pt = 16, pb = y0 >= 0 ? 20 : 16;
    const W = (x1 - x0) * ux + pl + pr, H = (y1 - y0) * uy + pt + pb;
    const X = x => +(pl + (x - x0) * ux).toFixed(1), Y = y => +(pt + (y1 - y) * uy).toFixed(1);
    const id = "xg" + (++PID) + "x" + Math.floor(Math.random() * 1e6);
    const M = n => n < 0 ? "−" + (-n) : String(n);
    let s = "";
    for (let x = Math.ceil(x0); x <= x1; x++) s += `<line x1="${X(x)}" y1="${Y(y1)}" x2="${X(x)}" y2="${Y(y0)}" stroke="var(--bubble)" stroke-opacity=".4" stroke-width="1"/>`;
    for (let y = Math.ceil(y0); y <= y1; y++) s += `<line x1="${X(x0)}" y1="${Y(y)}" x2="${X(x1)}" y2="${Y(y)}" stroke="var(--bubble)" stroke-opacity=".4" stroke-width="1"/>`;
    const ax = Y(0), ay = X(0), xe = X(x1) + 10, ye = Y(y1) - 10;
    s += `<line x1="${X(x0)}" y1="${ax}" x2="${xe}" y2="${ax}" stroke="var(--ink)" stroke-width="1.5"/><path d="M${xe - 7} ${ax - 4}L${xe} ${ax}L${xe - 7} ${ax + 4}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += `<line x1="${ay}" y1="${Y(y0)}" x2="${ay}" y2="${ye}" stroke="var(--ink)" stroke-width="1.5"/><path d="M${ay - 4} ${ye + 7}L${ay} ${ye}L${ay + 4} ${ye + 7}" fill="none" stroke="var(--ink)" stroke-width="1.5"/>`;
    s += `<text x="${xe - 2}" y="${ax - 7}" text-anchor="end" class="lbl">x</text><text x="${ay + 7}" y="${ye + 9}" class="lbl">y</text><text x="${ay - 4}" y="${ax + 12}" text-anchor="end">O</text>`;
    for (let x = Math.ceil(x0); x < x1; x++) if (x !== 0) s += `<line x1="${X(x)}" y1="${ax - 3}" x2="${X(x)}" y2="${ax + 3}" stroke="var(--ink)"/><text x="${X(x)}" y="${ax + 13}" text-anchor="middle">${M(x)}</text>`;
    for (let y = Math.ceil(y0); y < y1; y++) if (y !== 0) s += `<line x1="${ay - 3}" y1="${Y(y)}" x2="${ay + 3}" y2="${Y(y)}" stroke="var(--ink)"/><text x="${ay - 5}" y="${Y(y) + 4}" text-anchor="end">${M(y)}</text>`;
    let g = "";
    for (const c of o.f || []) {
      let d = "", pen = false;
      for (let i = 0; i <= 200; i++) { const x = x0 + (x1 - x0) * i / 200, y = c.f(x); if (y < y0 - 3 || y > y1 + 3) { pen = false; continue; } d += (pen ? "L" : "M") + X(x) + " " + Y(y); pen = true; }
      g += `<path d="${d}" fill="none" stroke="${c.c || "var(--accent)"}" stroke-width="2.5"/>`;
    }
    s += `<defs><clipPath id="${id}"><rect x="${X(x0)}" y="${Y(y1)}" width="${X(x1) - X(x0)}" height="${Y(y0) - Y(y1)}"/></clipPath></defs><g clip-path="url(#${id})">${g}</g>`;
    for (const p of o.pts || []) s += `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="4.5" fill="${p.c || "var(--vec)"}" stroke="${p.c || "var(--vec)"}" stroke-width="2"/>`;
    return { W, H, body: s };
  }
  const svgEl = (o, label) => { const g = plot(o); const e = document.createElementNS(NS, "svg"); e.setAttribute("viewBox", `0 0 ${g.W} ${g.H}`); e.setAttribute("class", "oy-svg"); e.setAttribute("role", "img"); e.setAttribute("aria-label", label); e.innerHTML = g.body; return e; };

  // random line y = kx + b with integer (sometimes ±0,5) k ≠ 0 and integer b
  const randLine = (half = false) => ({ k: half && Math.random() < .25 ? pick([-1.5, -0.5, 0.5, 1.5]) : nz(-5, 5), b: rnd(-9, 9) });
  // the line written in one of several forms; returns text and a note how to read k and b
  function lineForm(k, b) {
    const f = Number.isInteger(k) && b !== 0 ? pick(["std", "std", "rev", "mul"]) : "std";
    if (f === "rev") return { t: "y = " + Lrev(k, b), note: `y = ${L(k, b)} şəklinə sal: ` };
    if (f === "mul") { const c = rnd(2, 4); return { t: `${c}y = ${L(c * k, c * b)}`, note: `Hər tərəfi ${c}-ə böl: y = ${L(k, b)}. ` }; }
    return { t: "y = " + L(k, b), note: "" };
  }

  // word-problem helpers in cents (exact arithmetic)
  const AZN = c => num(c / 100);

  const levels = [
    { id: "kb", ad: "k və b-nin mənası", izah: "y = kx + b: k — x-in əmsalı (işarəsi ilə), b — sərbəst hədd. Əvvəl funksiyanı bu şəklə sal. k > 0 artan, k < 0 azalan, k = 0 sabit.",
      gen() {
        const kind = pick(["read", "read", "step", "origin", "const", "mono"]);
        if (kind === "read") {
          const k = nz(-6, 6), b = nz(-9, 9), f = lineForm(k, b), askK = Math.random() < .5;
          return { text: T(`Funksiya: ${f.t}. `, B(askK ? "k" : "b"), " = ?"), answer: askK ? k : b, show: S(askK ? k : b), tol: 0.01,
            solution: f.note + `y = ${L(k, b)}: k = ${S(k)} (x-in əmsalı), b = ${S(b)}. Soruşulan ${askK ? "k" : "b"}: ${S(askK ? k : b)}.` };
        }
        if (kind === "step") {
          const k = nz(-6, 6), b = nz(-9, 9), d = rnd(1, 5), f = lineForm(k, b);
          return { text: `Funksiya: ${f.t}. x ${d} vahid artanda y neçə vahid dəyişir? (y azalırsa, mənfi ədəd yaz.)`, answer: k * d, show: S(k * d), tol: 0.01,
            solution: f.note + `x 1 artanda y k = ${S(k)} dəyişir. ${d} artanda: ${S(k)}·${d} = ${S(k * d)}.` };
        }
        if (kind === "origin") {
          const k = nz(-5, 5), p = nz(-9, 9);
          return { text: `y = ${kx(k)} + (${mlin(p)}) funksiyasının qrafiki koordinat başlanğıcından keçir. m = ?`, answer: p, show: S(p), tol: 0.01,
            solution: `Qrafik O(0; 0)-dan keçir → b = 0: ${mlin(p)} = 0 → m = ${S(p)}.` };
        }
        if (kind === "const") {
          const p = nz(-9, 9), c = nz(-9, 9);
          return { text: `y = (${mlin(p)})x ${c < 0 ? "−" : "+"} ${Math.abs(c)} funksiyasının qrafiki Ox oxuna paraleldir. m = ?`, answer: p, show: S(p), tol: 0.01,
            solution: `Ox oxuna paralel xətt — y = b, yəni k = 0: ${mlin(p)} = 0 → m = ${S(p)}. Onda y = ${S(c)}.` };
        }
        const p = nz(-8, 8), c = nz(-9, 9), inc = Math.random() < .5, ans = inc ? p + 1 : p - 1;
        return { text: `y = (${mlin(p)})x ${c < 0 ? "−" : "+"} ${Math.abs(c)} funksiyası ${inc ? "artandır" : "azalandır"}. m-in ${inc ? "ən kiçik" : "ən böyük"} tam qiymətini tap.`, answer: ans, show: S(ans), tol: 0.01,
          solution: `${inc ? "Artan → k > 0" : "Azalan → k < 0"}: ${mlin(p)} ${inc ? ">" : "<"} 0 → m ${inc ? ">" : "<"} ${S(p)}. ${S(p)} özü olmaz (onda k = 0). ${inc ? "Ən kiçik" : "Ən böyük"} tam: ${S(ans)}.` };
      } },

    { id: "oxlar", ad: "Oxlarla kəsişmə", izah: "Oy oxunda x = 0 → (0; b). Ox oxunda y = 0 → kx + b = 0. Oxlarla əmələ gələn üçbucağın katetləri — bu nöqtələrə qədər məsafələr.",
      gen() {
        const kind = pick(["oy", "ox", "ox", "area", "area", "dist"]);
        if (kind === "oy") {
          const k = nz(-6, 6), b = nz(-9, 9), f = lineForm(k, b);
          return { text: T(`${f.t} funksiyasının qrafiki Oy oxunu kəsir. Kəsişmə nöqtəsinin `, B("ordinatını (y)"), " tap."), answer: b, show: S(b), tol: 0.01,
            solution: f.note + `Oy oxunda x = 0 → y = ${S(b)}. Nöqtə (0; ${S(b)}), soruşulan y: ${S(b)}.` };
        }
        if (kind === "ox") {
          const k = nz(-6, 6), b = Math.random() < .6 ? k * nz(-5, 5) : nz(-9, 9), f = lineForm(k, b);
          return { text: T(`${f.t} funksiyasının qrafiki Ox oxunu kəsir. Kəsişmə nöqtəsinin `, B("absisini (x)"), " tap."), answer: -b / k, show: frac(-b, k), tol: 0.01,
            solution: f.note + `Ox oxunda y = 0: ${L(k, b)} = 0 → ${kx(k)} = ${S(-b)} → x = ${frac(-b, k)}.` };
        }
        // intercepts p (on Ox) and q (on Oy)
        let p, q, hyp = 0;
        if (kind === "dist") { const [a, c, d] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [4, 3, 5], [8, 6, 10], [12, 5, 13], [9, 12, 15]]); p = a * pick([-1, 1]); q = c * pick([-1, 1]); hyp = d; }
        else { p = nz(-8, 8); q = nz(-9, 9); }
        // line through (p; 0) and (0; q): k = −q/p; written y = kx + q when k is "nice", else qx + py = pq
        const kk = -q / p, nice = Number.isInteger(kk * 2);
        let eq;
        if (nice) eq = "y = " + L(kk, q);
        else { let A = q, Bc = p, C = p * q; const g = gcd(gcd(Math.abs(A), Math.abs(Bc)), Math.abs(C)); A /= g; Bc /= g; C /= g; if (A < 0) { A = -A; Bc = -Bc; C = -C; }
          eq = `${A === 1 ? "" : A}x ${Bc < 0 ? "−" : "+"} ${Math.abs(Bc) === 1 ? "" : Math.abs(Bc)}y = ${S(C)}`; }
        const pts = `x = 0 → y = ${S(q)}, nöqtə (0; ${S(q)}); y = 0 → x = ${S(p)}, nöqtə (${S(p)}; 0).`;
        if (kind === "dist") return { text: `${eq} düz xətti Ox oxunu A, Oy oxunu B nöqtəsində kəsir. AB parçasının uzunluğunu tap.`, answer: hyp, show: String(hyp), tol: 0.01,
          solution: `${pts} AB — katetləri ${Math.abs(p)} və ${Math.abs(q)} olan düzbucaqlı üçbucağın hipotenuzu: √(${p * p} + ${q * q}) = ${hyp}.` };
        const area = Math.abs(p * q) / 2;
        return { text: `${eq} düz xətti koordinat oxları ilə üçbucaq əmələ gətirir. Bu üçbucağın sahəsini tap.`, answer: area, show: num(area), tol: 0.01,
          solution: `${pts} Katetlər ${Math.abs(p)} və ${Math.abs(q)}: S = ½·${Math.abs(p)}·${Math.abs(q)} = ${num(area)}.` };
      } },

    { id: "xy", ad: "x-mi, y-mi?", izah: "Bu səviyyədə suallar qarışıqdır: bəzən x, bəzən y soruşulur. Cavabdan əvvəl sualın sonuna bax: absis — x, ordinat — y, f(a) — y.",
      gen() {
        const kind = pick(["fx", "fy", "Am", "Bm", "fa", "fc", "oxAbs", "oyOrd", "fx", "fy", "Am", "Bm", "trap"]);
        let k, b; do { ({ k, b } = randLine(true)); } while (!b);
        const fn = Math.random() < .5, name = fn ? `f(x) = ${L(k, b)}` : `y = ${L(k, b)}`;
        // integer point (x0; y0) on the line with x0 ≠ y0 (so writing the wrong coordinate is always wrong)
        let x0, y0; do { x0 = Number.isInteger(k) ? rnd(-6, 6) : 2 * rnd(-4, 4); y0 = k * x0 + b; } while (x0 === y0 || !Number.isInteger(y0));
        const ask = (letter, word) => word ? B(word === "ordinat" ? "ordinatını (y)" : "absisini (x)") : B(letter);
        if (kind === "fx" || kind === "fa") {
          const text = kind === "fa" && fn ? T(`${name}. `, B(`f(${S(x0)})`), " = ?  (Bu, y-dir.)") : T(`${name}. x = ${S(x0)} olanda `, ask("y"), "-i tap.");
          return { text, answer: y0, show: S(y0), tol: 0.01, solution: `Verilən x = ${S(x0)}, soruşulan y: y = ${ev(k, x0, b)} = ${S(y0)}.` };
        }
        if (kind === "fy" || kind === "fc") {
          const text = kind === "fc" && fn ? T(`${name}. f(x) = ${S(y0)} olarsa, `, ask("x"), " = ?") : T(`${name}. y = ${S(y0)} olanda `, ask("x"), "-i tap.");
          return { text, answer: x0, show: S(x0), tol: 0.01, solution: `Verilən y = ${S(y0)}, soruşulan x: ${L(k, b)} = ${S(y0)} → ${kx(k)} = ${S(y0 - b)} → x = ${S(x0)}.` };
        }
        if (kind === "Am") return { text: T(`A(${S(x0)}; m) nöqtəsi ${name} funksiyasının qrafiki üzərindədir. m = ?  `, h("i", {}, "(m — nöqtənin ikinci koordinatıdır.)")), answer: y0, show: S(y0), tol: 0.01,
          solution: `m — ordinat, yəni y. x = ${S(x0)}: y = ${ev(k, x0, b)} = ${S(y0)}. m = ${S(y0)}.` };
        if (kind === "Bm") return { text: `B(m; ${S(y0)}) nöqtəsi ${name} funksiyasının qrafiki üzərindədir. m = ?`, answer: x0, show: S(x0), tol: 0.01,
          solution: `m — birinci koordinat, yəni x. y = ${S(y0)} verilib: ${L(k, b)} = ${S(y0)} → x = ${S(x0)}. m = ${S(x0)}.` };
        if (kind === "oyOrd") return { text: T(`${name} funksiyasının qrafiki Oy oxunu kəsir. Kəsişmə nöqtəsinin `, ask("y", "ordinat"), " tap."), answer: b, show: S(b), tol: 0.01,
          solution: `Oy oxunda x = 0 → y = b = ${S(b)}. Soruşulan ordinatdır: ${S(b)}.` };
        if (kind === "trap") {
          const oxOrd = Math.random() < .5;
          return { text: T(`${name} funksiyasının qrafiki ${oxOrd ? "Ox" : "Oy"} oxunu kəsir. Kəsişmə nöqtəsinin `, ask(oxOrd ? "y" : "x", oxOrd ? "ordinat" : "absis"), " tap."), answer: 0, show: "0", tol: 0.01,
            solution: oxOrd ? `Ox oxunun üstündəki hər nöqtədə y = 0. Ordinat soruşulur — cavab 0 (absis ${frac(-b * 2, k * 2)} olardı).` : `Oy oxunun üstündəki hər nöqtədə x = 0. Absis soruşulur — cavab 0 (ordinat ${S(b)} olardı).` };
        }
        // oxAbs: make the root an integer
        if (k === -1) k = pick([-2, -3, 2, 3]);
        const r = Number.isInteger(k) ? nz(-6, 6) : 2 * nz(-4, 4);
        const bb = -k * r;
        const nm = fn ? `f(x) = ${L(k, bb)}` : `y = ${L(k, bb)}`;
        return { text: T(`${nm} funksiyasının qrafiki Ox oxunu kəsir. Kəsişmə nöqtəsinin `, ask("x", "absis"), " tap."), answer: r, show: S(r), tol: 0.01,
          solution: `Ox oxunda y = 0: ${L(k, bb)} = 0 → ${kx(k)} = ${S(-bb)} → x = ${S(r)}. Soruşulan absisdir: ${S(r)} (b = ${S(bb)} Oy ilə kəsişmədir).` };
      } },

    { id: "tap", ad: "k və b-ni tap", izah: "k = (y₂ − y₁)/(x₂ − x₁); b — nöqtəni y = kx + b-yə qoyub tap. Qrafikdə: b — Oy-la görüş, k — tor düyünləri arasında 'yuxarı/sağa'.",
      gen() {
        const kind = pick(["graph", "graph", "graph", "two", "two", "one"]);
        if (kind === "graph") {
          let p, q, b, cand;
          do {
            q = pick([1, 1, 2, 3]); p = nz(-3, 3); if (gcd(p, q) !== 1) continue;
            b = rnd(-4, 4);
            cand = []; for (let x = -6; x <= 6; x++) if (x % q === 0) { const y = b + p * x / q; if (y >= -6 && y <= 6) cand.push([x, y]); }
          } while (!cand || cand.length < 3 || gcd(p, q) !== 1);
          let A = pick(cand), C; do { C = pick(cand); } while (C === A);
          if (Math.random() < .5 && !(A[0] === 0 || C[0] === 0)) A = [0, b];
          const svg = svgEl({ x: [-6, 6], y: [-6, 6], f: [{ f: x => b + p * x / q }], pts: [A, C].map(([x, y]) => ({ x, y })) }, "y = kx + b funksiyasının qrafiki, iki nöqtə işarələnib");
          const lead = "Şəkildə y = kx + b funksiyasının qrafiki verilib (işarələnmiş nöqtələr tor düyünlərindədir). ";
          const kS = frac(p, q), read = `Nöqtələr: ${P(A[0], A[1])} və ${P(C[0], C[1])}. k = (${S(C[1])} − ${par(A[1])})/(${S(C[0])} − ${par(A[0])}) = ${kS}.`;
          const ask = pick(["k", "k", "b", "root", "val"]);
          if (ask === "k") return { text: T(lead, B("k"), " = ?"), svg, answer: p / q, show: kS, tol: 0.01, solution: read };
          if (ask === "b") return { text: T(lead, B("b"), " = ?"), svg, answer: b, show: S(b), tol: 0.01, solution: `Xətt Oy oxunu (0; ${S(b)}) nöqtəsində kəsir → b = ${S(b)}.` };
          if (ask === "root" && p !== 0) return { text: T(lead, "Qrafikin Ox oxu ilə kəsişmə nöqtəsinin ", B("absisini (x)"), " tap."), svg, answer: -b * q / p, show: frac(-b * q, p), tol: 0.01,
            solution: read + ` b = ${S(b)}. y = 0: ${kS}·x ${b < 0 ? "−" : "+"} ${Math.abs(b)} = 0 → x = ${frac(-b * q, p)}.` };
          let xv; do { xv = q * nz(-4, 4); } while (cand.some(c => c[0] === xv) && Math.random() < .7);
          const yv = b + p * xv / q;
          return { text: T(lead, `x = ${S(xv)} olanda `, B("y"), " = ?"), svg, answer: yv, show: S(yv), tol: 0.01,
            solution: read + ` b = ${S(b)}. y = ${ev(kS, xv, b)} = ${S(yv)}.` };
        }
        if (kind === "one") {
          const k = nz(-6, 6), c = nz(-9, 9), x0 = nz(-5, 5), y0 = k * x0 + c;
          if (Math.random() < .5) return { text: T(`y = kx ${c < 0 ? "−" : "+"} ${Math.abs(c)} funksiyasının qrafiki A(${S(x0)}; ${S(y0)}) nöqtəsindən keçir. `, B("k"), " = ?"), answer: k, show: S(k), tol: 0.01,
            solution: `${S(y0)} = k·${par(x0)} ${c < 0 ? "−" : "+"} ${Math.abs(c)} → ${x0 === 1 ? "" : x0 === -1 ? "−" : S(x0)}k = ${S(y0 - c)} → k = ${S(k)}.` };
          return { text: T(`y = ${kx(k)} + b funksiyasının qrafiki A(${S(x0)}; ${S(y0)}) nöqtəsindən keçir. `, B("b"), " = ?"), answer: c, show: S(c), tol: 0.01,
            solution: `${S(y0)} = ${S(k)}·${par(x0)} + b = ${S(k * x0)} + b → b = ${S(c)}.` };
        }
        // two points
        const q = Math.random() < .3 ? 2 : 1, k = q === 2 ? pick([-1.5, -0.5, 0.5, 1.5, 2.5]) : nz(-5, 5), b = rnd(-8, 8);
        const [x1, x2] = (() => { let a, c; do { a = q * rnd(-4, 4); c = q * rnd(-4, 4); } while (a === c); return [a, c]; })();
        const y1 = k * x1 + b, y2 = k * x2 + b;
        const lead = `Düz xətt A${P(x1, y1)} və B${P(x2, y2)} nöqtələrindən keçir. `;
        const sk = `k = (${num(y2)} − ${par(y1)})/(${S(x2)} − ${par(x1)}) = ${num(y2 - y1)}/${par(x2 - x1)} = ${num(k)}.`;
        const sb = ` ${num(y1)} = ${num(k)}·${par(x1)} + b → b = ${S(b)}.`;
        const ask = pick(["k", "b", "val", "inv"]);
        if (ask === "k") return { text: T(lead, B("k"), " = ?"), answer: k, show: num(k), tol: 0.01, solution: sk };
        if (ask === "b") return { text: T(lead, B("b"), " = ?"), answer: b, show: S(b), tol: 0.01, solution: sk + sb };
        let x3; do { x3 = q * rnd(-6, 6); } while (x3 === x1 || x3 === x2 || k * x3 + b === x3);
        const y3 = k * x3 + b;
        if (ask === "val") return { text: T(lead, `Bu xətt üzərində absisi ${S(x3)} olan nöqtənin `, B("ordinatını (y)"), " tap."), answer: y3, show: num(y3), tol: 0.01,
          solution: sk + sb + ` y = ${ev(k, x3, b)} = ${num(y3)}.` };
        return { text: T(lead, `Bu xətt üzərində ordinatı ${num(y3)} olan nöqtənin `, B("absisini (x)"), " tap."), answer: x3, show: S(x3), tol: 0.01,
          solution: sk + sb + ` ${L(k, b)} = ${num(y3)} → x = ${S(x3)}.` };
      } },

    { id: "paralel", ad: "Paralel və kəsişən xətlər", izah: "k₁ = k₂, b₁ ≠ b₂ — paralel. k₁ ≠ k₂ — kəsişir: k₁x + b₁ = k₂x + b₂ → x → y.",
      gen() {
        const kind = pick(["cross", "cross", "sum", "par", "param", "three"]);
        if (kind === "cross" || kind === "sum" || kind === "three") {
          let x0, y0, k1, k2; do { x0 = rnd(-6, 6); y0 = rnd(-8, 8); k1 = nz(-5, 5); k2 = nz(-5, 5); } while (k1 === k2 || x0 === y0);
          const b1 = y0 - k1 * x0, b2 = y0 - k2 * x0;
          const work = `${L(k1, b1)} = ${L(k2, b2)} → ${kx(k1 - k2)} = ${S(b2 - b1)} → x = ${S(x0)}; y = ${ev(k1, x0, b1)} = ${S(y0)}.`;
          const lines = `y = ${L(k1, b1)} və y = ${L(k2, b2)}`;
          if (kind === "sum") return { text: `${lines} düz xətləri kəsişir. Kəsişmə nöqtəsinin koordinatlarının cəmini tap.`, answer: x0 + y0, show: S(x0 + y0), tol: 0.01,
            solution: work + ` Cəm: ${S(x0)} + ${par(y0)} = ${S(x0 + y0)}.` };
          if (kind === "three") { let k3; do { k3 = nz(-5, 5); } while (k3 === k1 || k3 === k2); const m = y0 - k3 * x0;
            return { text: `${lines} və y = ${kx(k3)} + m düz xətləri bir nöqtədə kəsişir. m = ?`, answer: m, show: S(m), tol: 0.01,
              solution: `İlk ikisinin kəsişməsi: ${work} Üçüncü xətt (${S(x0)}; ${S(y0)})-dən keçir: ${S(y0)} = ${S(k3)}·${par(x0)} + m → m = ${S(m)}.` }; }
          const askX = Math.random() < .5;
          return { text: T(`${lines} düz xətləri kəsişir. Kəsişmə nöqtəsinin `, B(askX ? "absisini (x)" : "ordinatını (y)"), " tap."), answer: askX ? x0 : y0, show: S(askX ? x0 : y0), tol: 0.01,
            solution: work + ` Soruşulan ${askX ? "x" : "y"}: ${S(askX ? x0 : y0)}.` };
        }
        if (kind === "par") {
          const k = nz(-5, 5), c = rnd(-9, 9); let p, q, m; do { p = nz(-5, 5); q = rnd(-9, 9); m = q - k * p; } while (m === c);
          return { text: `A(${S(p)}; ${S(q)}) nöqtəsindən keçən və y = ${L(k, c)} düz xəttinə paralel olan düz xətt Oy oxunu hansı nöqtədə kəsir? Ordinatını yaz.`, answer: m, show: S(m), tol: 0.01,
            solution: `Paralel → k eynidir: y = ${kx(k)} + b. ${S(q)} = ${S(k)}·${par(p)} + b → b = ${S(m)}. Oy ilə kəsişmə (0; ${S(m)}).` };
        }
        // param: y = (c·a + s)x + b1 ∥ y = kx + b2
        const c = pick([1, 2, 3]), a0 = nz(-5, 5), s = nz(-6, 6), k = c * a0 + s; let b1, b2; do { b1 = nz(-9, 9); b2 = nz(-9, 9); } while (b1 === b2);
        const coef = `${c === 1 ? "" : c}a ${s < 0 ? "−" : "+"} ${Math.abs(s)}`;
        const word = pick(["düz xətləri paraleldir", "düz xətləri kəsişmir", "düz xətlərinin ortaq nöqtəsi yoxdur"]);
        return { text: `y = (${coef})x ${b1 < 0 ? "−" : "+"} ${Math.abs(b1)} və y = ${L(k, b2)} ${word}. a = ?`, answer: a0, show: S(a0), tol: 0.01,
          solution: `Ortaq nöqtə yoxdur → paraleldir → k-lar bərabərdir (b-lər fərqlidir: ${S(b1)} ≠ ${S(b2)}): ${coef} = ${S(k)} → ${c === 1 ? "" : c}a = ${S(k - s)} → a = ${S(a0)}.` };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "y = (hər vahid üçün dəyişmə)·x + (başlanğıc). Azalırsa k < 0. Sual sonu deyir: x tapılır (km, dəqiqə), yoxsa y (AZN, litr).",
      gen() {
        const kind = pick(["taxi", "taxiX", "tank", "tankY", "tarif", "data", "temp"]);
        if (kind === "taxi" || kind === "taxiX") {
          const b = pick([100, 150, 200, 250, 300]), k = pick([40, 50, 60, 70, 80, 90, 100, 120]), d = rnd(3, 25), F = b + k * d;
          if (kind === "taxi") return { text: `Taksidə minik haqqı ${AZN(b)} AZN, hər kilometr ${AZN(k)} AZN-dir. ${d} km yol neçə AZN olar?`, answer: F / 100, unit: "AZN", show: AZN(F),
            solution: `y = ${AZN(k)}x + ${AZN(b)}. x = ${d}: y = ${AZN(k)}·${d} + ${AZN(b)} = ${AZN(k * d)} + ${AZN(b)} = ${AZN(F)} AZN.` };
          return { text: `Taksidə minik haqqı ${AZN(b)} AZN, hər kilometr ${AZN(k)} AZN-dir. Sərnişin ${AZN(F)} AZN ödədi. O neçə km yol getdi?`, answer: d, unit: "km", show: String(d), tol: 0.01,
            solution: `y = ${AZN(k)}x + ${AZN(b)} = ${AZN(F)} → ${AZN(k)}x = ${AZN(F - b)} → x = ${d} km. Soruşulan km-dir (x), AZN yox.` };
        }
        if (kind === "tank" || kind === "tankY") {
          const r = rnd(2, 12), Tm = rnd(6, 30), V0 = r * Tm, t = rnd(1, Tm - 1), left = V0 - r * t;
          if (kind === "tankY") return { text: `Çəndə ${V0} l su var. Kran açılanda dəqiqədə ${r} l su axıb gedir. ${t} dəqiqədən sonra çəndə neçə litr su qalar?`, answer: left, unit: "l", show: String(left), tol: 0.01,
            solution: `V = ${V0} − ${r}t (azalır → k = −${r}). t = ${t}: V = ${V0} − ${r * t} = ${left} l.` };
          if (Math.random() < .4) return { text: `Çəndə ${V0} l su var, dəqiqədə ${r} l su axıb gedir. Çən neçə dəqiqəyə boşalar?`, answer: Tm, unit: "dəq", show: String(Tm), tol: 0.01,
            solution: `V = ${V0} − ${r}t = 0 → t = ${V0}/${r} = ${Tm} dəqiqə.` };
          return { text: `Çəndə ${V0} l su var. Kran açılanda dəqiqədə ${r} l su axıb gedir. Neçə dəqiqədən sonra çəndə ${left} l su qalar?`, answer: t, unit: "dəq", show: String(t), tol: 0.01,
            solution: `V = ${V0} − ${r}t = ${left} → ${r}t = ${V0 - left} → t = ${t} dəqiqə. Soruşulan vaxtdır (x), litr yox.` };
        }
        if (kind === "tarif") {
          const x = pick([50, 60, 80, 100, 120, 150, 200]), c1 = pick([2, 3, 4, 5]), c2 = c1 + pick([1, 2, 3]), a2 = pick([0, 0, 100, 200]), a1 = a2 + (c2 - c1) * x;
          return { text: `Mobil tarif A: ayda ${AZN(a1)} AZN abunə + hər dəqiqə ${AZN(c1)} AZN. Tarif B: ${a2 ? `ayda ${AZN(a2)} AZN abunə + ` : "abunə yoxdur, "}hər dəqiqə ${AZN(c2)} AZN. Ayda neçə dəqiqə danışanda iki tarif eyni pula başa gəlir?`,
            answer: x, unit: "dəq", show: String(x), tol: 0.01,
            solution: `${AZN(a1)} + ${AZN(c1)}x = ${a2 ? AZN(a2) + " + " : ""}${AZN(c2)}x → ${AZN((c2 - c1))}x = ${AZN(a1 - a2)} → x = ${x} dəqiqə (o an hər biri ${AZN(a1 + c1 * x)} AZN).` };
        }
        if (kind === "data") {
          const b = pick([100, 150, 200, 250, 300]), k = pick([40, 50, 60, 70, 80, 90, 100, 120]); let d1, d2; do { d1 = rnd(2, 8); d2 = rnd(9, 20); } while (d1 === d2);
          const F1 = b + k * d1, F2 = b + k * d2, askB = Math.random() < .5;
          return { text: `Taksi ${d1} km yol üçün ${AZN(F1)} AZN, ${d2} km yol üçün ${AZN(F2)} AZN alır (qiymət y = kx + b qanunu ilə hesablanır). ${askB ? "Minik haqqı (b) neçə AZN-dir?" : "Bir kilometrin qiyməti (k) neçə AZN-dir?"}`,
            answer: (askB ? b : k) / 100, unit: "AZN", show: AZN(askB ? b : k),
            solution: `k = (${AZN(F2)} − ${AZN(F1)})/(${d2} − ${d1}) = ${AZN(F2 - F1)}/${d2 - d1} = ${AZN(k)} AZN/km.` + (askB ? ` ${AZN(F1)} = ${AZN(k)}·${d1} + b → b = ${AZN(b)} AZN.` : "") };
        }
        // temp: −6 °C per km
        const t0 = rnd(10, 30), hk = rnd(1, 6), tv = t0 - 6 * hk;
        if (Math.random() < .5) return { text: `Yer səthində hava ${t0} °C-dir. Hər 1 km hündürlükdə temperatur 6 °C azalır. ${hk} km hündürlükdə temperatur neçə dərəcədir?`, answer: tv, show: S(tv), tol: 0.01,
          solution: `T = ${t0} − 6h. h = ${hk}: T = ${t0} − ${6 * hk} = ${S(tv)} °C.` };
        return { text: `Yer səthində hava ${t0} °C-dir. Hər 1 km hündürlükdə temperatur 6 °C azalır. Hansı hündürlükdə (km) temperatur ${S(tv)} °C olar?`, answer: hk, unit: "km", show: String(hk), tol: 0.01,
          solution: `T = ${t0} − 6h = ${S(tv)} → 6h = ${t0 - tv} → h = ${hk} km. Soruşulan hündürlükdür (x), temperatur yox.` };
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let k, r, x1, x2; do { k = nz(-4, 4); r = nz(-5, 5); x1 = nz(-4, 4); x2 = rnd(-4, 4); } while (x1 === x2);
        const b = -k * r, y1 = k * x1 + b, y2 = k * x2 + b, dy = y2 - y1, dx = x2 - x1;
        const bad = rnd(0, 2);
        let kk = k, bb = b;
        if (bad === 0) kk = -k;                    // sign error in k
        if (bad <= 1) bb = bad === 1 ? y1 + k * x1 : y1 - kk * x1;   // step 2: wrong sign (bad 1) or correct method with wrong k
        const xr = bad === 2 ? r * -1 : null;
        const s1 = bad === 0 ? `k = (${S(y2)} − ${par(y1)})/(${S(x1)} − ${par(x2)}) = ${S(dy)}/${par(-dx)} = ${S(kk)}` : `k = (${S(y2)} − ${par(y1)})/(${S(x2)} − ${par(x1)}) = ${S(dy)}/${par(dx)} = ${S(k)}`;
        const s2 = bad === 1 ? `${S(y1)} = ${S(k)}·${par(x1)} + b → b = ${S(y1)} + ${par(k * x1)} = ${S(bb)}` : `${S(y1)} = ${S(kk)}·${par(x1)} + b → b = ${S(bb)}`;
        const root = bad === 2 ? `x = ${S(b)}/${par(k)} = ${S(xr)}` : `x = ${frac(-bb, kk)}`;
        const s3 = `Ox oxu ilə kəsişmə: ${L(kk, bb)} = 0 → ${root}`;
        const text = h("div", {}, h("p", {}, `Düz xətt A(${S(x1)}; ${S(y1)}) və B(${S(x2)}; ${S(y2)}) nöqtələrindən keçir. Onun Ox oxu ilə kəsişmə nöqtəsinin absisini tapırıq.`),
          h("ol", { class: "oy-steps" }, h("li", {}, s1), h("li", {}, s2), h("li", {}, s3)));
        const why = [`1-ci addım: yuxarıda y₂ − y₁ = ${S(dy)}, aşağıda x₂ − x₁ = ${S(dx)} olmalıdır (eyni sıra ilə). Düzü k = ${S(k)}.`,
          `2-ci addım: ${S(y1)} = ${S(k)}·${par(x1)} + b → b = ${S(y1)} − ${par(k * x1)} = ${S(b)}. ${S(k * x1)}-i o biri tərəfə keçirəndə işarəsi dəyişir.`,
          `3-cü addım: ${kx(k)} ${b < 0 ? "−" : "+"} ${Math.abs(b)} = 0 → ${kx(k)} = ${S(-b)} → x = ${S(r)}. b-ni o biri tərəfə keçirəndə işarə dəyişir.`][bad];
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
      key: "xetti-funksiya", title: "Xətti funksiya", fenn: "riyaziyyat", link: "dersler/xetti-funksiya.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 5/2, onluq 2,5 (və ya 2.5). Nöqtə soruşulmur — yalnız sualdakı koordinatı (x və ya y) yaz.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["kb", "oxlar", "xy", "xy", "tap", "tap", "paralel", "paralel", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/xetti-funksiya.html")) b.push("dersler/xetti-funksiya.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
