// Koordinatlar üsulu — mastery game levels (distance, midpoint, line through two points, parallel/perpendicular slopes,
// circle equation, map problems, find-the-mistake) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const num = v => (v < 0 ? "−" : "") + String(Math.round(Math.abs(v) * 100) / 100).replace(".", ",");   // −3,5
  const fr = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; p /= g; q /= g; return q === 1 ? S(p) : (p < 0 ? "−" : "") + Math.abs(p) + "/" + q; };
  const root = n => { let k = 1; for (let d = 2; d * d <= n; d++) while (n % (d * d) === 0) { n /= d * d; k *= d; } return n === 1 ? String(k) : (k === 1 ? "" : k) + "√" + n; };
  const pt = (n, x, y) => `${n}(${num(x)}; ${num(y)})`;
  const par = v => v < 0 ? "(" + num(v) + ")" : num(v);                 // bracket negatives inside expressions
  const sq = v => v < 0 ? `(x + ${num(-v)})²` : v === 0 ? "x²" : `(x − ${num(v)})²`;
  const sqy = v => v < 0 ? `(y + ${num(-v)})²` : v === 0 ? "y²" : `(y − ${num(v)})²`;
  const pf = t => t.startsWith("−") ? "(" + t + ")" : t;              // bracket a negative printed number
  const sqn = v => v < 0 ? `(${S(v)})²` : `${v}²`;
  const nz = (a, b) => { let v = rnd(a, b); while (!v) v = rnd(a, b); return v; };
  // "y = kx + b" with k = kp/kq, b = bp/bq
  const lineStr = (kp, kq, bp, bq) => {
    const k = fr(kp, kq), kk = kp / kq; let s = "y = ";
    s += kk === 1 ? "x" : kk === -1 ? "−x" : (k.includes("/") ? (kk < 0 ? "−(" + k.slice(1) + ")" : "(" + k + ")") : k) + "x";
    const b = bp / bq; if (b) s += (b < 0 ? " − " : " + ") + fr(Math.abs(bp), Math.abs(bq)); return s;
  };

  // ---- coordinate plane: o = { pts:[[name,x,y]], segs:[[x1,y1,x2,y2]], circle:[a,b,R], line:[k,b] }
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  function plane(o) {
    const xs = [0], ys = [0];
    for (const [, x, y] of o.pts || []) { xs.push(x); ys.push(y); }
    if (o.circle) { const [a, b, R] = o.circle; xs.push(a - R, a + R); ys.push(b - R, b + R); }
    const xa = Math.floor(Math.min(...xs)) - 1, xb = Math.ceil(Math.max(...xs)) + 1, ya = Math.floor(Math.min(...ys)) - 1, yb = Math.ceil(Math.max(...ys)) + 1;
    const c = Math.min(280 / (xb - xa), 240 / (yb - ya), 26), W = c * (xb - xa) + 20, H = c * (yb - ya) + 20;
    const X = x => 10 + (x - xa) * c, Y = y => 10 + (yb - y) * c;
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": o.aria || "Koordinat müstəvisi" });
    for (let x = xa; x <= xb; x++) g.append(sv("line", { x1: X(x), y1: Y(ya), x2: X(x), y2: Y(yb), stroke: "var(--grid)", "stroke-width": 1 }));
    for (let y = ya; y <= yb; y++) g.append(sv("line", { x1: X(xa), y1: Y(y), x2: X(xb), y2: Y(y), stroke: "var(--grid)", "stroke-width": 1 }));
    g.append(sv("line", { x1: X(xa), y1: Y(0), x2: X(xb), y2: Y(0), stroke: "var(--muted)", "stroke-width": 1.5 }));
    g.append(sv("line", { x1: X(0), y1: Y(ya), x2: X(0), y2: Y(yb), stroke: "var(--muted)", "stroke-width": 1.5 }));
    g.append(sv("text", { x: X(xb) - 8, y: Y(0) - 5, class: "oy-lbl", style: "font-size:12px;fill:var(--muted)" }, "x"));
    g.append(sv("text", { x: X(0) + 5, y: Y(yb) + 12, class: "oy-lbl", style: "font-size:12px;fill:var(--muted)" }, "y"));
    g.append(sv("text", { x: X(0) - 10, y: Y(0) + 13, class: "oy-lbl", style: "font-size:11px;fill:var(--muted)" }, "0"));
    if (o.circle) { const [a, b, R] = o.circle; g.append(sv("circle", { cx: X(a), cy: Y(b), r: R * c, fill: "var(--accent-soft)", "fill-opacity": .5, stroke: "var(--accent)", "stroke-width": 2 })); }
    if (o.line) { const [k, b] = o.line; let t0 = xa, t1 = xb; if (k) { const u = (ya - b) / k, v = (yb - b) / k; t0 = Math.max(xa, Math.min(u, v)); t1 = Math.min(xb, Math.max(u, v)); } g.append(sv("line", { x1: X(t0), y1: Y(k * t0 + b), x2: X(t1), y2: Y(k * t1 + b), stroke: "var(--accent)", "stroke-width": 2 })); }
    for (const [x1, y1, x2, y2] of o.segs || []) g.append(sv("line", { x1: X(x1), y1: Y(y1), x2: X(x2), y2: Y(y2), stroke: "var(--accent)", "stroke-width": 2.5 }));
    for (const [n, x, y, ghost] of o.pts || []) {
      if (ghost) continue;                       // 4th item "g": only widens the frame, no dot
      g.append(sv("circle", { cx: X(x), cy: Y(y), r: 3.5, fill: "var(--ink)" }));
      if (n) g.append(sv("text", { x: X(x) + 6, y: Y(y) - 6, class: "oy-lbl", style: "font-size:13px;font-style:italic" }, n));
    }
    // keep labels inside the frame
    g.setAttribute("style", "overflow:visible");
    g.fx = X; g.fy = Y; g.fw = W; g.fh = H;               // data → pixel maps, for the exam figures (labels in data coordinates)
    return g;
  }
  const PYTH = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [4, 3, 5], [12, 5, 13], [9, 12, 15], [12, 9, 15]];
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];

  const levels = [
    { id: "mesafe", ad: "İki nöqtə arasındakı məsafə", izah: "AB = √((x₂ − x₁)² + (y₂ − y₁)²). Kökü sadələşdir: √50 = 5√2.",
      gen() {
        const kind = pick(["pyth", "pyth", "root", "root", "unknown"]);
        const x1 = rnd(-6, 6), y1 = rnd(-6, 6);
        if (kind === "unknown") {
          const [dx, dy, d] = pick(PYTH.filter(t => t[2] <= 13)), x2 = x1 + dx, y2 = y1 + dy, big = Math.random() < .5;
          const xa = big ? x2 : x1 - dx; // the other possible solution is mirrored
          const [px, qx] = big ? [x2, x1 - dx] : [x1 - dx, x2];
          return { text: `${pt("A", x1, y1)} və B(x; ${num(y2)}) nöqtələri arasındakı məsafə ${d}-dir. x ${big ? ">" : "<"} ${num(x1)} olduğunu bilərək x-i tap.`,
            answer: xa, show: num(xa), tol: 0.01,
            solution: `(x − ${par(x1)})² + (${num(y2)} − ${par(y1)})² = ${d}² → (x − ${par(x1)})² + ${dy * dy} = ${d * d} → (x − ${par(x1)})² = ${dx * dx} → x − ${par(x1)} = ±${dx}. x = ${num(px)} və ya x = ${num(qx)}; şərtə uyğun olan ${num(xa)}.` };
        }
        let dx, dy;
        if (kind === "pyth") { const t = pick(PYTH); dx = t[0] * pick([-1, 1]); dy = t[1] * pick([-1, 1]); }
        else { do { dx = rnd(-7, 7); dy = rnd(-7, 7); } while (!dx || !dy || Number.isInteger(Math.sqrt(dx * dx + dy * dy))); }
        const x2 = x1 + dx, y2 = y1 + dy, n = dx * dx + dy * dy;
        return { text: `${pt("A", x1, y1)} və ${pt("B", x2, y2)} nöqtələri arasındakı məsafəni tap.`, svg: plane({ pts: [["A", x1, y1], ["B", x2, y2]], segs: [[x1, y1, x2, y2]] }),
          answer: Math.sqrt(n), show: root(n), placeholder: "məs. 5 və ya 3√2",
          solution: `x₂ − x₁ = ${num(x2)} − ${par(x1)} = ${S(dx)}, y₂ − y₁ = ${num(y2)} − ${par(y1)} = ${S(dy)}. AB = √(${dx * dx} + ${dy * dy}) = √${n} = ${root(n)}.` };
      } },
    { id: "orta", ad: "Parçanın orta nöqtəsi", izah: "Orta nöqtə: x = (x₁ + x₂)/2, y = (y₁ + y₂)/2. Ucunu tapmaq üçün: x₂ = 2x − x₁.",
      gen() {
        const x1 = rnd(-8, 8), y1 = rnd(-8, 8), x2 = rnd(-8, 8), y2 = rnd(-8, 8);
        if (x1 === x2 && y1 === y2) return this.gen();
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, ax = Math.random() < .5;
        if (Math.random() < .55) {
          const ans = ax ? mx : my;
          return { text: `${pt("A", x1, y1)} və ${pt("B", x2, y2)}. AB parçasının orta nöqtəsi M-in ${ax ? "absisini (x)" : "ordinatını (y)"} tap.`,
            svg: plane({ pts: [["A", x1, y1], ["B", x2, y2]], segs: [[x1, y1, x2, y2]] }), answer: ans, show: num(ans), tol: 0.01,
            solution: ax ? `x = (${num(x1)} + ${par(x2)})/2 = ${S(x1 + x2)}/2 = ${num(mx)}.` : `y = (${num(y1)} + ${par(y2)})/2 = ${S(y1 + y2)}/2 = ${num(my)}.` };
        }
        // endpoint from midpoint: use integer midpoint
        const Mx = rnd(-6, 6), My = rnd(-6, 6), Bx = 2 * Mx - x1, By = 2 * My - y1, ans = ax ? Bx : By;
        return { text: `M — AB parçasının orta nöqtəsidir. ${pt("A", x1, y1)}, ${pt("M", Mx, My)}. B nöqtəsinin ${ax ? "absisini (x)" : "ordinatını (y)"} tap.`,
          answer: ans, show: S(ans), tol: 0.01,
          solution: ax ? `${num(Mx)} = (${num(x1)} + x)/2 → x = 2 · ${par(Mx)} − ${par(x1)} = ${S(Bx)}.` : `${num(My)} = (${num(y1)} + y)/2 → y = 2 · ${par(My)} − ${par(y1)} = ${S(By)}.` };
      } },
    { id: "xett", ad: "İki nöqtədən keçən düz xətt", izah: "y = kx + b. Bucaq əmsalı k = (y₂ − y₁)/(x₂ − x₁); sonra b = y₁ − k·x₁.",
      gen() {
        const q = pick([1, 1, 2, 3]), p = nz(-4, 4), t = pick([1, 2]) * pick([-1, 1]);
        const x1 = rnd(-5, 5), y1 = rnd(-6, 6), x2 = x1 + q * t, y2 = y1 + p * t;
        const kStr = fr(p, q), bp = y1 * q - p * x1; // b = bp/q
        const ask = pick(["k", "b", "b", "y"]);
        const head = `Düz xətt ${pt("A", x1, y1)} və ${pt("B", x2, y2)} nöqtələrindən keçir.`;
        const kSol = `k = (${num(y2)} − ${par(y1)})/(${num(x2)} − ${par(x1)}) = ${S(p * t)}/${pf(S(q * t))} = ${kStr}.`;
        const fig = plane({ pts: [["A", x1, y1], ["B", x2, y2]], line: [p / q, bp / q] });
        if (ask === "k") return { text: head + " Onun bucaq əmsalı k-nı tap.", svg: fig, answer: p / q, show: kStr, solution: kSol };
        const bSol = ` b = y₁ − k·x₁ = ${num(y1)} − ${pf(kStr)} · ${par(x1)} = ${fr(bp, q)}. Tənlik: ${lineStr(p, q, bp, q)}.`;
        if (ask === "b") return { text: head + " Onun tənliyini y = kx + b şəklində yaz və b-ni tap.", svg: fig, answer: bp / q, show: fr(bp, q), solution: kSol + bSol };
        let x3 = rnd(-6, 6); while (x3 === x1 || x3 === x2) x3 = rnd(-6, 6);
        const yp = p * x3 + bp; // y = yp/q
        return { text: head + ` Bu düz xəttin üzərində absisi ${num(x3)} olan nöqtənin ordinatını tap.`, svg: fig, answer: yp / q, show: fr(yp, q),
          solution: kSol + bSol + ` x = ${num(x3)}: y = ${pf(kStr)} · ${par(x3)} + ${pf(fr(bp, q))} = ${fr(yp, q)}.` };
      } },
    { id: "perp", ad: "Paralel və perpendikulyar", izah: "Paralel düz xətlərdə k₁ = k₂. Perpendikulyar düz xətlərdə k₁ · k₂ = −1, yəni k₂ = −1/k₁.",
      gen() {
        const [p, q] = pick([[1, 1], [2, 1], [3, 1], [4, 1], [1, 2], [1, 3], [2, 3], [3, 2], [3, 4], [4, 3], [5, 2]]).map((v, i) => i === 0 ? v * pick([-1, 1]) : v);
        const b = rnd(-6, 6), line = lineStr(p, q, b, 1), kind = pick(["perpk", "parb", "perpb", "perpb"]);
        if (kind === "perpk") return { text: `${line} düz xəttinə perpendikulyar olan düz xəttin bucaq əmsalını tap.`, answer: -q / p, show: fr(-q, p),
          solution: `Verilən düz xəttin k₁ = ${fr(p, q)}. k₁ · k₂ = −1 → k₂ = −1/k₁ = ${fr(-q, p)}.` };
        const x0 = q * rnd(-3, 3) || q, y0 = rnd(-6, 6);
        if (kind === "parb") { const bn = y0 * q - p * x0; // over q
          return { text: `${pt("P", x0, y0)} nöqtəsindən keçən və ${line} düz xəttinə paralel olan düz xəttin tənliyi y = kx + b-dir. b-ni tap.`, answer: bn / q, show: fr(bn, q),
            solution: `Paralel düz xətlərin bucaq əmsalları bərabərdir: k = ${fr(p, q)}. ${num(y0)} = ${pf(fr(p, q))} · ${par(x0)} + b → b = ${fr(bn, q)}.` }; }
        // perpendicular: k2 = −q/p, b = y0 + q·x0/p
        const x1 = p * rnd(-2, 2) || p, bn = y0 * p + q * x1; // b = bn/p
        return { text: `${pt("P", x1, y0)} nöqtəsindən keçən və ${line} düz xəttinə perpendikulyar olan düz xəttin tənliyi y = kx + b-dir. b-ni tap.`, answer: bn / p, show: fr(bn, p),
          solution: `k₂ = −1/k₁ = ${fr(-q, p)}. ${num(y0)} = ${pf(fr(-q, p))} · ${par(x1)} + b → b = ${num(y0)} − ${pf(fr(-q * x1, p))} = ${fr(bn, p)}.` };
      } },
    { id: "cevre", ad: "Çevrənin tənliyi", izah: "(x − a)² + (y − b)² = R²: mərkəz (a; b), radius R. Açılmış tənlikdə tam kvadrat ayır.",
      gen() {
        const a = rnd(-6, 6), b = rnd(-6, 6), kind = pick(["R", "center", "point", "expand", "expand", "touch"]);
        if (kind === "R" || kind === "center") {
          const R = rnd(1, 9), r2 = pick([R * R, R * R, rnd(2, 30)]);
          const eq = `${sq(a)} + ${sqy(b)} = ${r2}`;
          if (kind === "R") return { text: `Çevrənin tənliyi: ${eq}. Radiusu tap.`, svg: plane({ circle: [a, b, Math.sqrt(r2)], pts: [["", a, b]] }), answer: Math.sqrt(r2), show: root(r2),
            solution: `Sağ tərəf R²-dir: R² = ${r2} → R = ${root(r2)}. (R = ${r2} yazmaq səhvdir.)` };
          const ax = Math.random() < .5;
          return { text: `Çevrənin tənliyi: ${eq}. Mərkəzinin ${ax ? "absisini (x)" : "ordinatını (y)"} tap.`, answer: ax ? a : b, show: S(ax ? a : b), tol: 0.01,
            solution: `(x − a)² + (y − b)² = R² şəklində mərkəz (a; b)-dir. Burada mərkəz (${S(a)}; ${S(b)}) — mötərizədəki işarəni tərsinə çevir.` };
        }
        if (kind === "point") {
          let dx, dy; do { dx = rnd(-6, 6); dy = rnd(-6, 6); } while (!dx && !dy);
          const n = dx * dx + dy * dy, x = a + dx, y = b + dy;
          return { text: `Mərkəzi ${pt("O₁", a, b)} nöqtəsində olan çevrə ${pt("A", x, y)} nöqtəsindən keçir. Çevrənin radiusunu tap.`, svg: plane({ circle: [a, b, Math.sqrt(n)], pts: [["O₁", a, b], ["A", x, y]], segs: [[a, b, x, y]] }),
            answer: Math.sqrt(n), show: root(n), solution: `R = O₁A = √((${num(x)} − ${par(a)})² + (${num(y)} − ${par(b)})²) = √(${dx * dx} + ${dy * dy}) = ${root(n)}. Tənlik: ${sq(a)} + ${sqy(b)} = ${n}.` };
        }
        if (kind === "touch") {
          if (!a || !b) return this.gen();
          const ox = Math.random() < .5;
          return { text: `Mərkəzi ${pt("O₁", a, b)} nöqtəsində olan çevrə ${ox ? "Ox" : "Oy"} oxuna toxunur. Çevrənin radiusunu tap.`, svg: plane({ circle: [a, b, Math.abs(ox ? b : a)], pts: [["O₁", a, b]] }),
            answer: Math.abs(ox ? b : a), show: String(Math.abs(ox ? b : a)), tol: 0.01,
            solution: `Toxunma nöqtəsinə çəkilən radius ${ox ? "Ox" : "Oy"} oxuna perpendikulyardır, ona görə R mərkəzdən oxa qədər məsafədir: R = |${ox ? S(b) : S(a)}| = ${Math.abs(ox ? b : a)}.` };
        }
        if (!a && !b) return this.gen();
        const R = rnd(1, 8), D = -2 * a, E = -2 * b, F = a * a + b * b - R * R;
        const terms = [["x²", 1], ["y²", 1], ["x", D], ["y", E], ["", F]];
        let eq = ""; for (const [v, c] of terms) { if (!c) continue; const body = v ? (Math.abs(c) === 1 ? v : Math.abs(c) + v) : String(Math.abs(c)); eq += eq ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; }
        return { text: `Çevrənin tənliyi: ${eq} = 0. Radiusu tap.`, answer: R, show: String(R), tol: 0.01,
          solution: `Tam kvadrat ayır: ` + [D ? `x² ${D < 0 ? "− " + -D : "+ " + D}x = ${sq(a)} − ${a * a}` : "", E ? `y² ${E < 0 ? "− " + -E : "+ " + E}y = ${sqy(b)} − ${b * b}` : ""].filter(Boolean).join(", ") + `. Onda ${sq(a)} + ${sqy(b)} = ${a * a} + ${b * b}${F ? (F > 0 ? " − " + F : " + " + -F) : ""} = ${R * R}. R² = ${R * R}, R = ${R}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Xəritədə koordinat şəbəkəsi: məsafə düsturu, orta nöqtə, çevrə daxilində olmaq.",
      gen() {
        const kind = pick(["yol", "gorus", "wifi"]);
        if (kind === "yol") {
          const [dx, dy, d] = pick(PYTH), sx = pick([-1, 1]), sy = pick([-1, 1]), x1 = rnd(-4, 4), y1 = rnd(-4, 4), u = pick([100, 200, 500]);
          return { text: `Şəhər xəritəsində hər vahid ${u} m-dir. Məktəb ${pt("M", x1, y1)}, Elvinin evi ${pt("E", x1 + sx * dx, y1 + sy * dy)} nöqtəsindədir. Evdən məktəbə düz xətt boyunca məsafə neçə metrdir?`,
            answer: d * u, show: String(d * u), unit: "m", tol: 0.01,
            solution: `ME = √(${dx}² + ${dy}²) = √${dx * dx + dy * dy} = ${d} vahid. ${d} · ${u} = ${d * u} m.` };
        }
        if (kind === "gorus") {
          const x1 = rnd(-8, 8), y1 = rnd(-8, 8), x2 = rnd(-8, 8), y2 = rnd(-8, 8), ax = Math.random() < .5;
          if (x1 === x2 || y1 === y2) return this.gen();
          const ans = ax ? (x1 + x2) / 2 : (y1 + y2) / 2;
          return { text: `İki dost ${pt("A", x1, y1)} və ${pt("B", x2, y2)} nöqtələrindən çıxıb AB parçasının tən ortasında görüşmək istəyir. Görüş nöqtəsinin ${ax ? "absisi" : "ordinatı"} nədir?`,
            answer: ans, show: num(ans), tol: 0.01, solution: `Orta nöqtə: ${ax ? `x = (${num(x1)} + ${par(x2)})/2` : `y = (${num(y1)} + ${par(y2)})/2`} = ${num(ans)}.` };
        }
        const a = rnd(-4, 4), b = rnd(-4, 4), [dx, dy, d] = pick(PYTH.filter(t => t[2] <= 10)), R = d + pick([-2, -1, 1, 2]);
        const x = a + dx * pick([-1, 1]), y = b + dy * pick([-1, 1]);
        return { text: `Wi-Fi ötürücüsü ${pt("O", a, b)} nöqtəsindədir və ${R} m radiusda siqnal verir (1 vahid = 1 m). Elvin ${pt("E", x, y)} nöqtəsində oturub. Elvindən ötürücüyə qədər məsafə neçə metrdir?`,
          svg: plane({ circle: [a, b, R], pts: [["O", a, b], ["E", x, y]] }),
          answer: d, show: String(d), unit: "m", tol: 0.01,
          solution: `OE = √(${dx}² + ${dy}²) = ${d} m. ${d} ${d <= R ? "≤" : ">"} ${R} — Elvin siqnal zonasının ${d <= R ? "daxilindədir" : "xaricindədir"}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2);
        if (Math.random() < .5) { // distance
          const [ux, uy, d] = pick(PYTH), x1 = rnd(-5, 5), y1 = rnd(-5, 5), sx = pick([-1, 1]), sy = pick([-1, 1]);
          const dx = sx * ux, dy = sy * uy, x2 = x1 + dx, y2 = y1 + dy;
          const st = [`x₂ − x₁ = ${num(x2)} − ${par(x1)} = ${S(dx)}, y₂ − y₁ = ${num(y2)} − ${par(y1)} = ${S(dy)}.`, `AB² = ${sqn(dx)} + ${sqn(dy)} = ${dx * dx} + ${dy * dy} = ${d * d}.`, `AB = √${d * d} = ${d}.`];
          if (bad === 0) { const wx = x2 + x1; st[0] = `x₂ − x₁ = ${num(x2)} − ${par(x1)} = ${S(wx)}, y₂ − y₁ = ${num(y2)} − ${par(y1)} = ${S(dy)}.`; if (wx === dx) return this.gen(); st[1] = `AB² = ${sqn(wx)} + ${sqn(dy)} = ${wx * wx} + ${dy * dy} = ${wx * wx + dy * dy}.`; st[2] = `AB = √${wx * wx + dy * dy} = ${root(wx * wx + dy * dy)}.`; }
          if (bad === 1) { st[1] = `AB² = (${S(dx)} + ${par(dy)})² = ${(dx + dy) ** 2}.`; st[2] = `AB = √${(dx + dy) ** 2} = ${Math.abs(dx + dy)}.`; }
          if (bad === 2) st[2] = `AB = ${d * d} : 2 = ${num(d * d / 2)}.`;
          const text = h("div", {}, h("p", {}, `${pt("A", x1, y1)}, ${pt("B", x2, y2)}. AB = ?`), h("ol", { class: "oy-steps" }, ...st.map(s => h("li", {}, s))));
          const why = [`1-ci addım: x₂ − x₁ = ${num(x2)} − ${par(x1)} = ${S(dx)}. Mənfi ədədi çıxanda işarə dəyişir.`,
            `2-ci addım: fərqlərin hər biri ayrıca kvadrata yüksəldilir: ${dx * dx} + ${dy * dy} = ${d * d}.`,
            `3-cü addım: AB² = ${d * d}-dən kvadrat kök alınır: AB = ${d}.`][bad];
          return { text, choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
        }
        // line through two points with integer slope
        const k = nz(-4, 4), x1 = rnd(-4, 4), y1 = rnd(-6, 6), dxl = pick([1, 2, 3]) * pick([-1, 1]), x2 = x1 + dxl, y2 = y1 + k * dxl, b = y1 - k * x1;
        if (Math.abs(k) === 1 && bad === 0) return this.gen();
        const st = [`k = (${num(y2)} − ${par(y1)})/(${num(x2)} − ${par(x1)}) = ${S(k * dxl)}/${pf(S(dxl))} = ${S(k)}.`, `b = y₁ − k·x₁ = ${num(y1)} − ${par(k)} · ${par(x1)} = ${S(b)}.`, `Tənlik: ${lineStr(k, 1, b, 1)}.`];
        if (bad === 0) { st[0] = `k = (${num(x2)} − ${par(x1)})/(${num(y2)} − ${par(y1)}) = ${S(dxl)}/${pf(S(k * dxl))} = ${fr(1, k)}.`; const bw = y1 * k - x1; st[1] = `b = y₁ − k·x₁ = ${num(y1)} − ${pf(fr(1, k))} · ${par(x1)} = ${fr(bw, k)}.`; st[2] = `Tənlik: ${lineStr(1, k, bw, k)}.`; }
        if (bad === 1) { const bw = y1 + k * x1; if (bw === b) return this.gen(); st[1] = `b = y₁ + k·x₁ = ${num(y1)} + ${par(k)} · ${par(x1)} = ${S(bw)}.`; st[2] = `Tənlik: ${lineStr(k, 1, bw, 1)}.`; }
        if (bad === 2) { const bw = -b; if (bw === b) return this.gen(); st[2] = `Tənlik: ${lineStr(k, 1, bw, 1)}.`; }
        const text = h("div", {}, h("p", {}, `${pt("A", x1, y1)} və ${pt("B", x2, y2)} nöqtələrindən keçən düz xəttin tənliyi:`), h("ol", { class: "oy-steps" }, ...st.map(s => h("li", {}, s))));
        const why = [`1-ci addım: k = (y₂ − y₁)/(x₂ − x₁) — y-lərin fərqi surətdə olmalıdır. Düzü: k = ${S(k)}.`,
          `2-ci addım: y₁ = k·x₁ + b-dən b = y₁ − k·x₁ = ${S(b)}.`,
          `3-cü addım: k və b düz tapılıb, amma tənlikdə b-nin işarəsi dəyişib. Düzü: ${lineStr(k, 1, b, 1)}.`][bad];
        return { text, choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (distance without the root, coordinates added instead of subtracted, the sign of the
  // circle centre, the slope turned upside down, ...).
  const { ae, again } = Oyun;
  const P = (x, y) => `(${num(x)}; ${num(y)})`;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const asIs = x => x;
  const dist2 = (a, b) => a * a + b * b;
  // labelled figure: point names with coordinates, drawn on the plane (labels flip to the left near the right edge)
  function fig(o, labels, extra) {
    const g = plane({ ...o, pts: (o.pts || []).map(([n, x, y, f]) => ["", x, y, f]) });
    const boxes = [];
    for (const [n, x, y, dy0 = -7] of labels || []) {
      const px = g.fx(x), right = px > g.fw * .6, w = 6.6 * n.length, x0 = right ? px - 7 - w : px + 7;
      let dy = dy0;
      const hit = d => boxes.some(b => x0 < b[1] && x0 + w > b[0] && Math.abs(g.fy(y) + d - b[2]) < 13);
      for (const d of [dy0, 16, -20, 30, -34]) if (!hit(d)) { dy = d; break; }   // keep labels from covering each other
      boxes.push([x0, x0 + w, g.fy(y) + dy]);
      g.append(sv("text", { x: px + (right ? -7 : 7), y: g.fy(y) + dy, "text-anchor": right ? "end" : "start", class: "oy-lbl", style: "font-size:12px" }, n));
    }
    for (const [x, y, t, dx = 0, dy = 0] of extra || []) g.append(sv("text", { x: g.fx(x) + dx, y: g.fy(y) + dy, class: "oy-lbl", style: "font-size:12px;fill:var(--accent)" }, t));
    g.setAttribute("viewBox", `-45 -6 ${g.fw + 90} ${g.fh + 12}`);   // room on both sides for the coordinate labels
    return g;
  }
  const lbl = (n, x, y, dy) => [n + P(x, y), x, y, dy];
  const TRI = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13]];
  const cross = (ax, ay, bx, by, cx, cy) => (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);

  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. distance between two points (the root is not taken / coordinates added / legs added)
    { tip: "qapali", gen: () => again(() => {
      const dx = nz(-7, 7), dy = nz(-7, 7), x1 = rnd(-6, 6), y1 = rnd(-6, 6), x2 = x1 + dx, y2 = y1 + dy, n = dist2(dx, dy);
      if (Number.isInteger(Math.sqrt(n)) || n < 10) return null;
      const s = dist2(x1 + x2, y1 + y2); if (!s) return null;
      const w = [String(n), String(Math.abs(dx) + Math.abs(dy)), root(s), root(Math.abs(dx) + Math.abs(dy))];
      return mc(ae(root(n), w, asIs), { text: `Koordinat müstəvisində ${pt("A", x1, y1)} və ${pt("B", x2, y2)} nöqtələri verilib (vahid parça 1 sm). AB parçasının uzunluğu neçə sm-dir?`,
        svg: fig({ pts: [["A", x1, y1], ["B", x2, y2]], segs: [[x1, y1, x2, y2]] }, [lbl("A", x1, y1), lbl("B", x2, y2)]),
        solution: `x₂ − x₁ = ${num(x2)} − ${par(x1)} = ${S(dx)}, y₂ − y₁ = ${num(y2)} − ${par(y1)} = ${S(dy)}. AB = √(${dx * dx} + ${dy * dy}) = √${n} = ${root(n)}. Tələlər: kökü çıxmamaq (${n}), katetləri toplamaq (${Math.abs(dx) + Math.abs(dy)}), koordinatları fərq əvəzinə toplamaq (${root(s)}).` });
    }) },
    // 2. end of a segment from its midpoint
    { tip: "qapali", gen: () => again(() => {
      const x1 = rnd(-6, 6), y1 = rnd(-6, 6), mx = rnd(-5, 5), my = rnd(-5, 5), bx = 2 * mx - x1, by = 2 * my - y1;
      if ((mx === x1 && my === y1) || Math.abs(bx) > 12 || Math.abs(by) > 12) return null;
      const w = [P(mx - x1, my - y1), P(2 * mx + x1, 2 * my + y1), P(2 * x1 - mx, 2 * y1 - my), P(by, bx)];
      return mc(ae(P(bx, by), w, asIs), { text: `M nöqtəsi AB parçasının orta nöqtəsidir: ${pt("A", x1, y1)}, ${pt("M", mx, my)}. B nöqtəsinin koordinatlarını tapın.`,
        svg: fig({ pts: [["A", x1, y1], ["M", mx, my], ["B", bx, by, "g"]], segs: [[x1, y1, mx, my]] }, [lbl("A", x1, y1), lbl("M", mx, my)]),
        solution: `${num(mx)} = (${num(x1)} + x)/2 → x = 2 · ${par(mx)} − ${par(x1)} = ${S(bx)}; ${num(my)} = (${num(y1)} + y)/2 → y = 2 · ${par(my)} − ${par(y1)} = ${S(by)}. B${P(bx, by)}. Tələlər: M − A fərqini yazmaq (yarım vektor), işarəni səhv qoymaq, x və y-i dəyişmək.` });
    }) },
    // 3. equation of the line through two points
    { tip: "qapali", gen: () => again(() => {
      const q = pick([1, 1, 2]), p = nz(-4, 4), t = pick([1, 2]) * pick([-1, 1]), x1 = rnd(-5, 5), y1 = rnd(-5, 5), x2 = x1 + q * t, y2 = y1 + p * t;
      const bp = y1 * q - p * x1;                                   // b = bp/q
      if (!bp || Math.abs(bp / q) > 9) return null;
      const w = [lineStr(q, p, y1 * p - q * x1, p), lineStr(-p, q, y1 * q + p * x1, q), lineStr(p, q, -bp, q), lineStr(p, q, y1 * q + p * x1, q)];
      return mc(ae(lineStr(p, q, bp, q), w, asIs), { text: `Düz xətt ${pt("A", x1, y1)} və ${pt("B", x2, y2)} nöqtələrindən keçir. Bu düz xəttin tənliyini yazın.`,
        svg: fig({ pts: [["A", x1, y1], ["B", x2, y2]], line: [p / q, bp / q] }, [lbl("A", x1, y1), lbl("B", x2, y2)]),
        solution: `k = (${num(y2)} − ${par(y1)})/(${num(x2)} − ${par(x1)}) = ${S(p * t)}/${pf(S(q * t))} = ${fr(p, q)}. b = y₁ − k·x₁ = ${num(y1)} − ${pf(fr(p, q))} · ${par(x1)} = ${fr(bp, q)}. ${lineStr(p, q, bp, q)}. Tələlər: k-nı çevirmək (Δx/Δy), k-nın işarəsini dəyişmək, b-ni y₁ + k·x₁ və ya −b kimi yazmaq.` });
    }) },
    // 4. equation of a circle from the centre and a point on it
    { tip: "qapali", gen: () => again(() => {
      const [dx0, dy0, R] = pick(TRI), dx = dx0 * pick([-1, 1]), dy = dy0 * pick([-1, 1]), a = nz(-4, 4), b = nz(-4, 4); if (a === b) return null;
      const x = a + dx, y = b + dy, n = R * R;
      const w = [`${sq(a)} + ${sqy(b)} = ${R}`, `${sq(-a)} + ${sqy(-b)} = ${n}`, `${sq(b)} + ${sqy(a)} = ${n}`, `${sq(a)} + ${sqy(b)} = ${dx0 + dy0}`];
      return mc(ae(`${sq(a)} + ${sqy(b)} = ${n}`, w, asIs), { text: `Mərkəzi ${pt("O₁", a, b)} nöqtəsində olan çevrə ${pt("A", x, y)} nöqtəsindən keçir. Çevrənin tənliyini yazın.`,
        svg: fig({ circle: [a, b, R], pts: [["O₁", a, b], ["A", x, y]], segs: [[a, b, x, y]] }, [lbl("O₁", a, b, 16), lbl("A", x, y)]),
        solution: `R = O₁A = √(${dx * dx} + ${dy * dy}) = ${R}. Tənlik: ${sq(a)} + ${sqy(b)} = ${n}. Tələlər: sağ tərəfə R yazmaq (${R}), mərkəzin işarəsini dəyişmək, a ilə b-ni dəyişmək, katetləri toplayıb R² saymaq (${dx0 + dy0}).` });
    }) },
    // 5. perpendicular through a point: where does it cut the y-axis
    { tip: "qapali", gen: () => again(() => {
      const [p0, q] = pick([[1, 2], [2, 1], [3, 1], [1, 3], [2, 3], [3, 2], [1, 4], [4, 1]]), p = p0 * pick([-1, 1]);
      const L = p0 * q / gcd(p0, q), m = Math.floor(6 / L), x0 = L * nz(-m, m), y0 = rnd(-5, 5), c = rnd(-5, 5);
      const b = y0 + q * x0 / p;
      const w = [y0 - p * x0 / q, y0 + p * x0 / q, y0 - q * x0 / p, c], f = v => `(0; ${num(v)})`;
      return mc(ae(b, w, f), { text: `${pt("P", x0, y0)} nöqtəsindən keçən və ${lineStr(p, q, c, 1)} düz xəttinə perpendikulyar olan düz xətt Oy oxunu hansı nöqtədə kəsir?`,
        svg: fig({ line: [p / q, c], pts: [["P", x0, y0], ["", 0, c]] }, [lbl("P", x0, y0)]),
        solution: `Verilən düz xəttin k₁ = ${fr(p, q)}. Perpendikulyar olduqda k₂ = −1/k₁ = ${fr(-q, p)}. ${num(y0)} = ${pf(fr(-q, p))} · ${par(x0)} + b → b = ${num(b)}. Nöqtə (0; ${num(b)}). Tələlər: paralel götürmək (k₂ = k₁), yalnız işarəni dəyişmək (k₂ = ${fr(-p, q)}), tərsini alıb işarəni dəyişməmək (k₂ = ${fr(q, p)}), verilən düz xəttin b-sini yazmaq (${num(c)}).` });
    }) },
    // 6. fourth vertex of a parallelogram
    { tip: "qapali", gen: () => again(() => {
      const ax = rnd(-5, 5), ay = rnd(-5, 5), bx = rnd(-5, 5), by = rnd(-5, 5), cx = rnd(-5, 5), cy = rnd(-5, 5);
      if (!cross(ax, ay, bx, by, cx, cy)) return null;
      const dx = ax + cx - bx, dy = ay + cy - by; if (Math.abs(dx) > 11 || Math.abs(dy) > 11) return null;
      const w = [P(ax + bx - cx, ay + by - cy), P(bx + cx - ax, by + cy - ay), P((ax + cx) / 2, (ay + cy) / 2), P(ax + cx, ay + cy)];
      return mc(ae(P(dx, dy), w, asIs), { text: `ABCD paraleloqramının üç təpəsi verilib: ${pt("A", ax, ay)}, ${pt("B", bx, by)}, ${pt("C", cx, cy)}. D təpəsinin koordinatlarını tapın.`,
        svg: fig({ pts: [["A", ax, ay], ["B", bx, by], ["C", cx, cy], ["D", dx, dy, "g"]], segs: [[ax, ay, bx, by], [bx, by, cx, cy]] }, [lbl("A", ax, ay), lbl("B", bx, by), lbl("C", cx, cy)]),
        solution: `Paraleloqramda AC və BD diaqonallarının orta nöqtəsi eynidir: ${P((ax + cx) / 2, (ay + cy) / 2)}. Onda D = A + C − B = ${P(dx, dy)}. Tələlər: ${P((ax + cx) / 2, (ay + cy) / 2)} yalnız diaqonalların kəsişmə nöqtəsidir; A + C (B-ni çıxmamaq); B + C − A və ya A + B − C (başqa təpəni qarşı təpə götürmək).` });
    }) },
    // 7. coded: a point on the x-axis equidistant from two points
    { tip: "kod", gen: () => again(() => {
      const R = pick([5, 5, 10]), on = [];
      for (let u = -R; u <= R; u++) for (let v = -R; v <= R; v++) if (u * u + v * v === R * R && v) on.push([u, v]);
      const t = rnd(1, 7), [u1, v1] = pick(on), [u2, v2] = pick(on); if (u1 === u2) return null;
      const bx = t + u1, by = v1, cx = t + u2, cy = v2, sb = dist2(bx, by), sc = dist2(cx, cy);
      return { text: `Ox oxu üzərindəki A(x; 0) nöqtəsi ${pt("B", bx, by)} və ${pt("C", cx, cy)} nöqtələrindən eyni məsafədədir. x-i tapın.`,
        svg: fig({ pts: [["B", bx, by], ["C", cx, cy]] }, [lbl("B", bx, by), lbl("C", cx, cy)]),
        answer: t, show: String(t), tol: 1e-6,
        solution: `AB² = AC²: (${num(bx)} − x)² + ${by * by} = (${num(cx)} − x)² + ${cy * cy}. Mötərizələri açanda x² ixtisar olunur: ${sb} − ${par(2 * bx)}x = ${sc} − ${par(2 * cx)}x → ${S(2 * (cx - bx))}x = ${S(sc - sb)} → x = ${t}.` };
    }) },
    // 8. coded: the chord a circle cuts on the x-axis
    { tip: "kod", gen: () => again(() => {
      const [h0, b0, R] = pick(TRI), a = rnd(-6, 6), b = b0 * pick([-1, 1]);
      return { text: `Çevrənin tənliyi: ${sq(a)} + ${sqy(b)} = ${R * R} (vahid parça 1 sm). Çevrənin Ox oxundan ayırdığı parçanın uzunluğu neçə sm-dir?`,
        svg: fig({ circle: [a, b, R], pts: [["O₁", a, b]] }, [lbl("O₁", a, b, 16)]),
        answer: 2 * h0, show: String(2 * h0), tol: 1e-6, unit: "sm",
        solution: `Ox üzərində y = 0: ${sq(a)} + ${b * b} = ${R * R} → ${sq(a)} = ${R * R - b * b} → x − ${par(a)} = ±${h0}. İki kəsişmə nöqtəsinin absisləri ${num(a - h0)} və ${num(a + h0)}; parçanın uzunluğu ${2 * h0} sm. (Radius ${R}, mərkəzdən Ox-a qədər ${b0}: yarım vətər √(${R}² − ${b0}²) = ${h0}.)` };
    }) },
    // 9. coded: area of a triangle from its vertices
    { tip: "kod", gen: () => again(() => {
      const ax = rnd(-6, 6), ay = rnd(-6, 6), bx = rnd(-6, 6), by = rnd(-6, 6), cx = rnd(-6, 6), cy = rnd(-6, 6), cr = Math.abs(cross(ax, ay, bx, by, cx, cy));
      if (!cr || cr % 2 || cr < 12 || cr > 70) return null;
      const A = cr / 2;
      return { text: `${pt("A", ax, ay)}, ${pt("B", bx, by)}, ${pt("C", cx, cy)} nöqtələri ABC üçbucağının təpələridir (vahid parça 1 sm). Üçbucağın sahəsi neçə sm²-dir?`,
        svg: fig({ pts: [["A", ax, ay], ["B", bx, by], ["C", cx, cy]], segs: [[ax, ay, bx, by], [bx, by, cx, cy], [cx, cy, ax, ay]] }, [lbl("A", ax, ay), lbl("B", bx, by), lbl("C", cx, cy)]),
        answer: A, show: String(A), tol: 1e-6, unit: "sm²",
        solution: `Üçbucağı düzbucaqlı çərçivəyə sal və ya düsturdan istifadə et: S = ½ · |(x_B − x_A)(y_C − y_A) − (y_B − y_A)(x_C − x_A)| = ½ · |${S(bx - ax)} · ${pf(S(cy - ay))} − ${pf(S(by - ay))} · ${pf(S(cx - ax))}| = ½ · ${cr} = ${A} sm².` };
    }) },
    // 10. written: show that a triangle is right-angled and find the circumradius
    { tip: "yazili", gen: () => again(() => {
      const [a, b, m] = pick([[1, 2, 2], [2, 1, 2], [1, 3, 3], [3, 1, 3], [1, 1, 7], [2, 1, 2]]);
      const ux = a * pick([-1, 1]), uy = b * pick([-1, 1]), s = pick([-1, 1]), vx = -uy * m * s, vy = ux * m * s;
      const bx = rnd(-3, 3), by = rnd(-3, 3), ax = bx + ux, ay = by + uy, cx = bx + vx, cy = by + vy;
      if ([ax, ay, cx, cy].some(v => Math.abs(v) > 10)) return null;
      const ab2 = dist2(ux, uy), bc2 = dist2(vx, vy), ac2 = ab2 + bc2, hyp = Math.sqrt(ac2), R = hyp / 2;
      if (!Number.isInteger(hyp)) return null;
      return { text: `${pt("A", ax, ay)}, ${pt("B", bx, by)}, ${pt("C", cx, cy)} nöqtələri ABC üçbucağının təpələridir (vahid parça 1 sm). a) ABC üçbucağının düzbucaqlı olduğunu göstərin. b) Üçbucağın ətrafına çəkilmiş çevrənin radiusunu tapın. Cavabda radiusun qiymətini yazın.`,
        svg: fig({ pts: [["A", ax, ay], ["B", bx, by], ["C", cx, cy]], segs: [[ax, ay, bx, by], [bx, by, cx, cy], [cx, cy, ax, ay]] }, [lbl("A", ax, ay), lbl("B", bx, by), lbl("C", cx, cy)]),
        answer: R, show: num(R), tol: 1e-6, unit: "sm",
        solution: `1) AB² = (${num(ax)} − ${par(bx)})² + (${num(ay)} − ${par(by)})² = ${ab2}; BC² = (${num(cx)} − ${par(bx)})² + (${num(cy)} − ${par(by)})² = ${bc2}; AC² = (${num(cx)} − ${par(ax)})² + (${num(cy)} − ${par(ay)})² = ${ac2}. 2) AB² + BC² = ${ab2} + ${bc2} = ${ac2} = AC² → Pifaqor teoreminin tərsinə görə B bucağı düzdür. 3) Düzbucaqlı üçbucağın ətrafına çəkilmiş çevrənin mərkəzi hipotenuzun orta nöqtəsidir, ona görə R = AC/2 = ${hyp}/2 = ${num(R)} sm. Həll yazılmadan yalnız cavab — bal verilmir.` };
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
      key: "koordinatlar-usulu", title: "Koordinatlar üsulu", fenn: "riyaziyyat", link: "dersler/koordinatlar-usulu.html",
      format: "Cavab ədəddir: tam −3, onluq 2,5, kəsr −2/3, kök 3√5.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["mesafe", "mesafe", "orta", "orta", "xett", "xett", "perp", "cevre", "cevre", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/koordinatlar-usulu.html")) b.push("dersler/koordinatlar-usulu.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
