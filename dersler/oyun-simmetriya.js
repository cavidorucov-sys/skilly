// Simmetriya, dönmə, fiqurların çevrilməsi — mastery game levels (axial symmetry, central symmetry, rotation about the origin,
// translation, symmetry axes of figures, composite moves, find-the-mistake) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const P = (n, x, y) => `${n}(${S(x)}; ${S(y)})`;
  const par = v => v < 0 ? "(" + S(v) + ")" : S(v);
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const pt = () => { let x, y; do { x = rnd(-8, 8); y = rnd(-8, 8); } while (!x || !y || x === y || x === -y); return [x, y]; };

  // ---- coordinate plane: o = { pts:[[name,x,y]], vx:[c] dashed x = c, hy:[c] dashed y = c, diag:1|-1 dashed y = ±x }
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  function plane(o) {
    const xs = [0, ...(o.vx || [])], ys = [0, ...(o.hy || [])];
    for (const [, x, y] of o.pts || []) { xs.push(x); ys.push(y); }
    for (const s of o.segs || []) { xs.push(s[0], s[2]); ys.push(s[1], s[3]); }
    let xa = Math.min(...xs) - 2, xb = Math.max(...xs) + 2, ya = Math.min(...ys) - 2, yb = Math.max(...ys) + 2;
    if (o.sym) { const m = Math.max(-xa, xb, -ya, yb); xa = ya = -m; xb = yb = m; }   // rotations: show the whole square around 0
    const c = Math.min(280 / (xb - xa), 240 / (yb - ya), 24), W = c * (xb - xa) + 20, H = c * (yb - ya) + 20;
    const X = x => 10 + (x - xa) * c, Y = y => 10 + (yb - y) * c;
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": o.aria || "Koordinat müstəvisi" });
    for (let x = xa; x <= xb; x++) g.append(sv("line", { x1: X(x), y1: Y(ya), x2: X(x), y2: Y(yb), stroke: "var(--grid)", "stroke-width": 1 }));
    for (let y = ya; y <= yb; y++) g.append(sv("line", { x1: X(xa), y1: Y(y), x2: X(xb), y2: Y(y), stroke: "var(--grid)", "stroke-width": 1 }));
    g.append(sv("line", { x1: X(xa), y1: Y(0), x2: X(xb), y2: Y(0), stroke: "var(--muted)", "stroke-width": 1.5 }));
    g.append(sv("line", { x1: X(0), y1: Y(ya), x2: X(0), y2: Y(yb), stroke: "var(--muted)", "stroke-width": 1.5 }));
    g.append(sv("text", { x: X(xb) - 8, y: Y(0) - 5, class: "oy-lbl", style: "font-size:12px;fill:var(--muted)" }, "x"));
    g.append(sv("text", { x: X(0) + 5, y: Y(yb) + 12, class: "oy-lbl", style: "font-size:12px;fill:var(--muted)" }, "y"));
    g.append(sv("text", { x: X(0) - 10, y: Y(0) + 13, class: "oy-lbl", style: "font-size:11px;fill:var(--muted)" }, "0"));
    const dash = { stroke: "var(--accent)", "stroke-width": 2, "stroke-dasharray": "6 4" };
    for (const v of o.vx || []) g.append(sv("line", { x1: X(v), y1: Y(ya), x2: X(v), y2: Y(yb), ...dash }));
    for (const v of o.hy || []) g.append(sv("line", { x1: X(xa), y1: Y(v), x2: X(xb), y2: Y(v), ...dash }));
    if (o.diag) { const lo = Math.max(xa, o.diag > 0 ? ya : -yb), hi = Math.min(xb, o.diag > 0 ? yb : -ya); g.append(sv("line", { x1: X(lo), y1: Y(o.diag * lo), x2: X(hi), y2: Y(o.diag * hi), ...dash })); }
    for (const s of o.segs || []) g.append(sv("line", { x1: X(s[0]), y1: Y(s[1]), x2: X(s[2]), y2: Y(s[3]), stroke: s[4] === "d" ? "var(--vec)" : "var(--ink)", "stroke-width": 1.8, ...(s[4] === "d" ? { "stroke-dasharray": "4 3" } : {}) }));
    for (const [n, x, y] of o.pts || []) {
      g.append(sv("circle", { cx: X(x), cy: Y(y), r: 3.5, fill: n === "M" ? "var(--accent)" : "var(--ink)" }));
      g.append(sv("text", { x: X(x) + 6, y: Y(y) - 6, class: "oy-lbl", style: "font-size:13px;font-style:italic" }, n));
    }
    if (o.arc) {   // rotation arrow around O: from the direction of o.arc.from through span° (dir +1 = counter-clockwise)
      const [fx, fy] = o.arc.from, t0 = Math.atan2(fy, fx), t1 = t0 + o.arc.dir * o.arc.span * Math.PI / 180, r = 1.3, pp = (t, k) => [X(k * Math.cos(t)), Y(k * Math.sin(t))];
      const [x0, y0] = pp(t0, r), [x1, y1] = pp(t1, r);
      g.append(sv("line", { x1: X(0), y1: Y(0), x2: X(fx), y2: Y(fy), stroke: "var(--ink)", "stroke-width": 1.2, "stroke-dasharray": "4 3" }));
      g.append(sv("path", { d: `M ${x0} ${y0} A ${r * c} ${r * c} 0 ${o.arc.span > 180 ? 1 : 0} ${o.arc.dir > 0 ? 0 : 1} ${x1} ${y1}`, fill: "none", stroke: "var(--vec)", "stroke-width": 2 }));
      const tg = [-Math.sin(t1) * o.arc.dir, Math.cos(t1) * o.arc.dir], nm = [Math.cos(t1), Math.sin(t1)], e = [r * Math.cos(t1), r * Math.sin(t1)];   // tangent / normal at the end
      const ah = [[e[0] + tg[0] * .25, e[1] + tg[1] * .25], [e[0] - tg[0] * .1 + nm[0] * .2, e[1] - tg[1] * .1 + nm[1] * .2], [e[0] - tg[0] * .1 - nm[0] * .2, e[1] - tg[1] * .1 - nm[1] * .2]];
      g.append(sv("polygon", { points: ah.map(([u, v]) => X(u) + "," + Y(v)).join(" "), fill: "var(--vec)" }));
      const tm = (t0 + t1) / 2, [lx, ly] = pp(tm, r + .9);
      g.append(sv("text", { x: lx - 9, y: ly + 4, class: "oy-lbl", style: "font-size:12px;fill:var(--vec)" }, o.arc.span + "°"));
    }
    return g;
  }
  // which coordinate is asked
  const askOf = () => pick(["x", "y", "x", "y", "s"]);
  const askTxt = { x: "absisini (x)", y: "ordinatını (y)", s: "koordinatlarının cəmini (x + y)" };
  const val = (k, x, y) => k === "x" ? x : k === "y" ? y : x + y;
  const res = (k, n, x, y) => `${P(n, x, y)}` + (k === "s" ? `, cəm ${S(x)} + ${par(y)} = ${S(x + y)}` : "") + ".";
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];

  const levels = [
    { id: "ox", ad: "Ox simmetriyası", izah: "Ox oxuna nəzərən: (x; y) → (x; −y). Oy oxuna nəzərən: (x; y) → (−x; y). x = c düz xəttinə nəzərən: (2c − x; y).",
      gen() {
        const [x, y] = pt(), kind = pick(["Ox", "Oy", "Ox", "Oy", "vx", "hy", "diag"]); let k = askOf();
        let nx, ny, line, why, fig;
        if (kind === "Ox") { nx = x; ny = -y; line = "Ox oxuna"; why = "Ox oxuna nəzərən absis qalır, ordinatın işarəsi dəyişir"; fig = { hy: [] }; }
        if (kind === "Oy") { nx = -x; ny = y; line = "Oy oxuna"; why = "Oy oxuna nəzərən ordinat qalır, absisin işarəsi dəyişir"; fig = {}; }
        if (kind === "vx") { let c = rnd(-4, 4); while (!c || c === x) c = rnd(-4, 4); nx = 2 * c - x; ny = y; line = `x = ${S(c)} düz xəttinə`; why = `x = ${S(c)} düz xətti şaquli simmetriya oxudur: ordinat qalır, absis üçün ${S(c)} orta nöqtədir → x' = 2 · ${par(c)} − ${par(x)} = ${S(nx)}`; fig = { vx: [c] }; }
        if (kind === "hy") { let c = rnd(-4, 4); while (!c || c === y) c = rnd(-4, 4); nx = x; ny = 2 * c - y; line = `y = ${S(c)} düz xəttinə`; why = `y = ${S(c)} düz xətti üfüqi simmetriya oxudur: absis qalır, ordinat üçün ${S(c)} orta nöqtədir → y' = 2 · ${par(c)} − ${par(y)} = ${S(ny)}`; fig = { hy: [c] }; }
        if (kind === "diag") { nx = y; ny = x; line = "y = x düz xəttinə"; why = "y = x düz xəttinə nəzərən koordinatlar yerini dəyişir"; fig = { diag: 1 }; if (k === "s") return this.gen(); }
        if (((k === "x" && nx === x) || (k === "y" && ny === y)) && Math.random() < .7) k = "s";   // mostly ask the coordinate that changes
        const ans = val(k, nx, ny);
        return { text: `${P("A", x, y)} nöqtəsinə ${line} nəzərən simmetrik olan A' nöqtəsinin ${askTxt[k]} tap.`, svg: plane({ ...fig, pts: [["A", x, y]] }),
          answer: ans, show: S(ans), tol: 0.01, solution: `${why}: A' ${res(k, "", nx, ny).trim()}` };
      } },
    { id: "merkez", ad: "Mərkəzi simmetriya", izah: "O(0; 0)-a nəzərən: (x; y) → (−x; −y). M(a; b)-yə nəzərən: (2a − x; 2b − y). M — AA' parçasının ortasıdır.",
      gen() {
        const [x, y] = pt(), k = pick(["x", "y", "s"]), kind = pick(["O", "M", "M", "find"]);
        if (kind === "O") { const ans = val(k, -x, -y);
          return { text: `${P("A", x, y)} nöqtəsinə koordinat başlanğıcına nəzərən simmetrik olan nöqtənin ${askTxt[k]} tap.`, svg: plane({ pts: [["A", x, y]] }), answer: ans, show: S(ans), tol: 0.01,
            solution: `O(0; 0)-a nəzərən hər iki koordinatın işarəsi dəyişir: ${res(k, "A'", -x, -y)}` }; }
        let a = rnd(-4, 4), b = rnd(-4, 4); if (a === x && b === y) a++;
        if (kind === "M") { const nx = 2 * a - x, ny = 2 * b - y, ans = val(k, nx, ny);
          return { text: `${P("A", x, y)} nöqtəsinə ${P("M", a, b)} nöqtəsinə nəzərən simmetrik olan A' nöqtəsinin ${askTxt[k]} tap.`, svg: plane({ pts: [["A", x, y], ["M", a, b]] }), answer: ans, show: S(ans), tol: 0.01,
            solution: `M — AA' parçasının ortasıdır: x' = 2 · ${par(a)} − ${par(x)} = ${S(nx)}, y' = 2 · ${par(b)} − ${par(y)} = ${S(ny)}. ${res(k, "A'", nx, ny)}` }; }
        const nx = 2 * a - x, ny = 2 * b - y, k2 = pick(["x", "y"]), ans = k2 === "x" ? a : b;
        return { text: `${P("A", x, y)} və ${P("A'", nx, ny)} nöqtələri hansısa M nöqtəsinə nəzərən simmetrikdir. M-in ${askTxt[k2]} tap.`, answer: ans, show: S(ans), tol: 0.01,
          solution: `Simmetriya mərkəzi AA' parçasının ortasıdır: M((${S(x)} + ${par(nx)})/2; (${S(y)} + ${par(ny)})/2) = ${P("M", a, b)}.` };
      } },
    { id: "donme", ad: "Dönmə", izah: "O(0; 0) ətrafında: 90° saat əqrəbinin əksinə (x; y) → (−y; x); 90° saat əqrəbi istiqamətində (x; y) → (y; −x); 180° (x; y) → (−x; −y).",
      gen() {
        const [x, y] = pt(), k = askOf(), kind = pick(["ccw", "ccw", "cw", "cw", "180", "270"]);
        const T = { ccw: [-y, x, "90° saat əqrəbinin əksi istiqamətində", "(x; y) → (−y; x)"], cw: [y, -x, "90° saat əqrəbi istiqamətində", "(x; y) → (y; −x)"],
          "180": [-x, -y, "180°", "(x; y) → (−x; −y), bu, mərkəzi simmetriyadır"], "270": [y, -x, "270° saat əqrəbinin əksi istiqamətində", "270° əksinə = 90° saat əqrəbi istiqamətində: (x; y) → (y; −x)"] }[kind];
        const ans = val(k, T[0], T[1]);
        return { text: `${P("A", x, y)} nöqtəsi koordinat başlanğıcı ətrafında ${T[2]} döndərilir. Alınan nöqtənin ${askTxt[k]} tap.`, svg: plane({ pts: [["A", x, y]], sym: true }),
          answer: ans, show: S(ans), tol: 0.01, solution: `${T[3]}. ${res(k, "A'", T[0], T[1])}` };
      } },
    { id: "kocurme", ad: "Paralel köçürmə", izah: "Paralel köçürmə: (x; y) → (x + a; y + b). Bütün nöqtələr eyni qədər sürüşür.",
      gen() {
        const [x, y] = pt(), a = rnd(-6, 6) || 3, b = rnd(-6, 6) || -2, k = askOf(), kind = pick(["vec", "pair", "pair"]);
        if (kind === "vec") {
          const dir = (v, p, n) => v > 0 ? `${v} vahid ${p}` : `${-v} vahid ${n}`;
          const ans = val(k, x + a, y + b);
          return { text: `${P("A", x, y)} nöqtəsi ${dir(a, "sağa", "sola")} və ${dir(b, "yuxarı", "aşağı")} köçürülür. Alınan nöqtənin ${askTxt[k]} tap.`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Sağa/sola köçürmə absisi, yuxarı/aşağı köçürmə ordinatı dəyişir: (${S(x)} ${a < 0 ? "−" : "+"} ${Math.abs(a)}; ${S(y)} ${b < 0 ? "−" : "+"} ${Math.abs(b)}). ${res(k, "A'", x + a, y + b)}` };
        }
        let [u, v] = pt(); if (u === x && v === y) u++;
        const ans = val(k, u + a, v + b);
        return { text: `Paralel köçürmə ${P("A", x, y)} nöqtəsini ${P("A'", x + a, y + b)} nöqtəsinə keçirir. Bu köçürmə ${P("B", u, v)} nöqtəsini hansı nöqtəyə keçirir? Həmin nöqtənin ${askTxt[k]} tap.`, answer: ans, show: S(ans), tol: 0.01,
          solution: `Köçürmə: a = ${S(x + a)} − ${par(x)} = ${S(a)}, b = ${S(y + b)} − ${par(y)} = ${S(b)}. B' = (${S(u)} + ${par(a)}; ${S(v)} + ${par(b)}) → ${res(k, "B'", u + a, v + b)}` };
      } },
    { id: "oxlar", ad: "Simmetriya oxları və mərkəzi", izah: "Fiqurun neçə simmetriya oxu var? Düzgün n-bucaqlının n oxu var. Simmetriya mərkəzi olan fiqur 180° dönəndə özü ilə üst-üstə düşür.",
      minVariety: 12,
      gen() {
        const AX = [["kvadratın", 4, "hər iki diaqonal və qarşı tərəflərin ortalarından keçən iki düz xətt"], ["kvadrat olmayan düzbucaqlının", 2, "qarşı tərəflərin ortalarından keçən iki düz xətt (diaqonallar ox deyil)"],
          ["kvadrat olmayan rombun", 2, "iki diaqonal"], ["düzbucaqlı və romb olmayan paraleloqramın", 0, "heç bir ox yoxdur (amma simmetriya mərkəzi var — diaqonalların kəsişməsi)"],
          ["bərabərtərəfli üçbucağın", 3, "hər təpədən çəkilən median (o həm də hündürlük və tənböləndir)"], ["bərabərtərəfli olmayan bərabəryanlı üçbucağın", 1, "oturacağa çəkilən median"],
          ["müxtəliftərəfli üçbucağın", 0, "heç bir ox yoxdur"], ["bərabəryanlı trapesiyanın", 1, "oturacaqların ortalarından keçən düz xətt"], ["parçanın", 2, "parçanın özünün üzərindəki düz xətt və orta perpendikulyar"]];
        if (Math.random() < .35) {
          const CEN = [["kvadrat", 1], ["düzbucaqlı", 1], ["romb", 1], ["paraleloqram", 1], ["çevrə", 1], ["düzgün altıbucaqlı", 1], ["parça", 1],
            ["bərabərtərəfli üçbucaq", 0], ["bərabəryanlı trapesiya", 0], ["düzgün beşbucaqlı", 0], ["bərabəryanlı üçbucaq", 0], ["düzgün yeddibucaqlı", 0]];
          const set = shuffle(CEN).slice(0, 5), n = set.filter(f => f[1]).length;
          return { text: `Bu fiqurlardan neçəsinin simmetriya mərkəzi var: ${set.map(f => f[0]).join(", ")}?`, answer: n, show: String(n), tol: 0.01,
            solution: `Simmetriya mərkəzi var: ${set.filter(f => f[1]).map(f => f[0]).join(", ") || "heç biri"}. Yoxdur: ${set.filter(f => !f[1]).map(f => f[0]).join(", ") || "hamısında var"}. Düzgün n-bucaqlının mərkəzi yalnız n cüt olanda var. Cavab: ${n}.` };
        }
        if (Math.random() < .4) {
          const n = rnd(5, 12), NM = { 5: "beş", 6: "altı", 7: "yeddi", 8: "səkkiz", 9: "doqquz", 10: "on", 11: "on bir", 12: "on iki" }[n];
          return { text: `Düzgün ${NM}bucaqlının neçə simmetriya oxu var?`, answer: n, show: String(n), tol: 0.01,
            solution: `Düzgün n-bucaqlının n simmetriya oxu var: ${n % 2 ? "hər ox bir təpədən və qarşı tərəfin ortasından keçir" : "n/2 ox qarşı təpələrdən, n/2 ox qarşı tərəflərin ortalarından keçir"}. Cavab: ${n}.` };
        }
        const f = pick(AX);
        return { text: `${f[0][0].toUpperCase() + f[0].slice(1)} neçə simmetriya oxu var?`, answer: f[1], show: String(f[1]), tol: 0.01, solution: `${f[1]} ox: ${f[2]}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Ardıcıl çevrilmələr: hər addımı növbə ilə tətbiq et, nöqtənin yeni koordinatlarını yaz.",
      gen() {
        const [x, y] = pt(), k = pick(["x", "y"]);
        const kind = pick(["oyun", "qatla", "robot"]);
        if (kind === "qatla") {
          const c = rnd(1, 5) * pick([-1, 1]), nx = 2 * c - x;
          if (c === x) return this.gen();
          return { text: `Dama dəftərində koordinat sistemi çəkilib. ${P("L", x, y)} nöqtəsinə mürəkkəb damlayıb. Vərəqi x = ${S(c)} düz xətti boyunca qatlayıb basdılar — mürəkkəb o biri yarıda iz qoydu. İzin absisini tap.`,
            svg: plane({ vx: [c], pts: [["L", x, y]] }), answer: nx, show: S(nx), tol: 0.01,
            solution: `Qatlama x = ${S(c)} düz xəttinə nəzərən ox simmetriyasıdır: x' = 2 · ${par(c)} − ${par(x)} = ${S(nx)}, ordinat ${S(y)} qalır.` };
        }
        if (kind === "oyun") {
          const a = rnd(-5, 5) || 2, b = rnd(-5, 5) || -3, s = pick(["Ox", "Oy"]);
          const [x1, y1] = [x + a, y + b], [x2, y2] = s === "Ox" ? [x1, -y1] : [-x1, y1], ans = k === "x" ? x2 : y2;
          return { text: `Kompüter oyununda personaj ${P("A", x, y)} nöqtəsindədir. O, əvvəl ${Math.abs(a)} vahid ${a > 0 ? "sağa" : "sola"} və ${Math.abs(b)} vahid ${b > 0 ? "yuxarı" : "aşağı"} hərəkət edir, sonra "güzgü" onu ${s} oxuna nəzərən simmetrik nöqtəyə atır. Personajın son mövqeyinin ${askTxt[k]} tap.`,
            answer: ans, show: S(ans), tol: 0.01, solution: `Köçürmədən sonra: (${S(x1)}; ${S(y1)}). ${s} oxuna nəzərən: (${S(x2)}; ${S(y2)}). ${k === "x" ? "Absis" : "Ordinat"}: ${S(ans)}.` };
        }
        const turns = pick([["ccw", "90° saat əqrəbinin əksinə"], ["cw", "90° saat əqrəbi istiqamətində"], ["180", "180°"]]);
        const [x1, y1] = turns[0] === "ccw" ? [-y, x] : turns[0] === "cw" ? [y, -x] : [-x, -y], a = rnd(-4, 4) || 1, [x2, y2] = [x1 + a, y1], ans = k === "x" ? x2 : y2;
        return { text: `Robot-tozsoran ${P("R", x, y)} nöqtəsindədir. Proqram onu əvvəl koordinat başlanğıcı ətrafında ${turns[1]} döndərir, sonra ${Math.abs(a)} vahid ${a > 0 ? "sağa" : "sola"} köçürür. Robotun son mövqeyinin ${askTxt[k]} tap.`,
          answer: ans, show: S(ans), tol: 0.01, solution: `Dönmədən sonra: (${S(x1)}; ${S(y1)}). Köçürmədən sonra: (${S(x2)}; ${S(y2)}). ${k === "x" ? "Absis" : "Ordinat"}: ${S(ans)}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const [x, y] = pt(), a = rnd(1, 6) * pick([-1, 1]), s = pick(["Ox", "Oy"]), bad = rnd(0, 2);
        const [x1, y1] = s === "Ox" ? [x, -y] : [-x, y], [x2, y2] = [x1 + a, y1];
        const st = [`${s} oxuna nəzərən simmetriya: A₁(${S(x1)}; ${S(y1)}).`, `${Math.abs(a)} vahid ${a > 0 ? "sağa" : "sola"} köçürmə: A₂(${S(x2)}; ${S(y2)}).`, `Koordinatların cəmi: ${S(x2)} + ${par(y2)} = ${S(x2 + y2)}.`];
        if (bad === 0) { const [w1, z1] = s === "Ox" ? [-x, y] : [x, -y]; st[0] = `${s} oxuna nəzərən simmetriya: A₁(${S(w1)}; ${S(z1)}).`; st[1] = `${Math.abs(a)} vahid ${a > 0 ? "sağa" : "sola"} köçürmə: A₂(${S(w1 + a)}; ${S(z1)}).`; st[2] = `Koordinatların cəmi: ${S(w1 + a)} + ${par(z1)} = ${S(w1 + a + z1)}.`; if (w1 + a + z1 === x2 + y2) return this.gen(); }
        if (bad === 1) { st[1] = `${Math.abs(a)} vahid ${a > 0 ? "sağa" : "sola"} köçürmə: A₂(${S(x1)}; ${S(y1 + a)}).`; st[2] = `Koordinatların cəmi: ${S(x1)} + ${par(y1 + a)} = ${S(x1 + y1 + a)}.`; }
        if (bad === 2) { const w = x2 - y2; if (w === x2 + y2) return this.gen(); st[2] = `Koordinatların cəmi: ${S(x2)} + ${par(y2)} = ${S(w)}.`; }
        const text = h("div", {}, h("p", {}, `${P("A", x, y)} nöqtəsini əvvəl ${s} oxuna nəzərən simmetrik əks etdir, sonra ${Math.abs(a)} vahid ${a > 0 ? "sağa" : "sola"} sürüşdür. Alınan nöqtənin koordinatlarının cəmi nədir?`),
          h("ol", { class: "oy-steps" }, ...st.map(t => h("li", {}, t))));
        const why = [`1-ci addım: ${s} oxuna nəzərən ${s === "Ox" ? "absis qalır, ordinatın işarəsi dəyişir" : "ordinat qalır, absisin işarəsi dəyişir"}: A₁(${S(x1)}; ${S(y1)}).`,
          `2-ci addım: sağa/sola köçürmə absisi dəyişir, ordinatı yox: A₂(${S(x2)}; ${S(y2)}).`,
          `3-cü addım: hesab səhvi. ${S(x2)} + ${par(y2)} = ${S(x2 + y2)}.`][bad];
        return { text, choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are the
  // results of typical mistakes (another symmetry, a forgotten factor 2, the wrong axis, the wrong turning direction, ...).
  const { ae, again } = Oyun;
  const fp = p => `(${S(p[0])}; ${S(p[1])})`;
  const mcq = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const TRIP = [[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [9, 12], [12, 9]];   // Pythagorean legs
  const dir = (v, p, n) => v > 0 ? `${v} vahid ${p}` : `${-v} vahid ${n}`;

  // exact figure of a polygon: poly = [[x, y]…] in units, names = vertex letters, lab = [[i, text]] — text written on the side i → i+1
  function shapeFig(poly, names, lab, aria) {
    const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    const c = Math.min(220 / (x1 - x0), 150 / (y1 - y0)), W = c * (x1 - x0) + 80, H = c * (y1 - y0) + 60;
    const X = x => 40 + (x - x0) * c, Y = y => 30 + (y1 - y) * c, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": aria || "Fiqur" });
    g.append(sv("polygon", { points: poly.map(p => X(p[0]) + "," + Y(p[1])).join(" "), fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 }));
    const out = (x, y, k) => { const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1; return [X(x) + dx / d * k, Y(y) - dy / d * k]; };
    poly.forEach((p, i) => { const [lx, ly] = out(p[0], p[1], 13); g.append(sv("text", { x: lx - 4, y: ly + 4, class: "oy-lbl", style: "font-size:13px;font-style:italic" }, names[i])); });
    for (const [i, t] of lab) { const a = poly[i], b = poly[(i + 1) % poly.length], [lx, ly] = out((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 14);
      g.append(sv("text", { x: lx - 4 * String(t).length, y: ly + 4, class: "oy-lbl", style: "font-size:12px;fill:var(--accent)" }, String(t))); }
    return g;
  }
  const regular = (n, a) => { const R = a / (2 * Math.sin(Math.PI / n)); return Array.from({ length: n }, (_, k) => [R * Math.cos(Math.PI / 2 + 2 * Math.PI * k / n), R * Math.sin(Math.PI / 2 + 2 * Math.PI * k / n)]); };
  // r = number of axes, w = [wrong count, the mistake behind it]
  const SHAPES = [
    { r: 2, w: [[4, "diaqonalları da ox saymaq"], [0, "paraleloqramla qarışdırmaq"], [1, "yalnız bir oxu görmək"], [3, "təsadüfi"]],
      mk() { let a, b; do { a = rnd(3, 12); b = rnd(3, 12); } while (a === b);
        return { t: `ABCD düzbucaqlısında AB = ${a}, BC = ${b}.`, why: "Düzbucaqlının (kvadrat olmayan) iki oxu var: qarşı tərəflərin ortalarından keçən düz xətlər. Diaqonallar ox deyil.", f: shapeFig([[0, 0], [a, 0], [a, b], [0, b]], "ABCD", [[0, a], [1, b]], "Düzbucaqlı") }; } },
    { r: 4, w: [[2, "yalnız diaqonalları və ya yalnız orta xətləri saymaq"], [8, "hər oxu iki dəfə saymaq"], [1, "təsadüfi"], [6, "təsadüfi"]],
      mk() { const a = rnd(3, 12); return { t: `ABCD kvadratında AB = ${a}.`, why: "Kvadratın 4 oxu var: 2 diaqonal və qarşı tərəflərin ortalarından keçən 2 düz xətt.", f: shapeFig([[0, 0], [a, 0], [a, a], [0, a]], "ABCD", [[0, a], [1, a]], "Kvadrat") }; } },
    { r: 2, w: [[4, "kvadratla qarışdırmaq"], [0, "paraleloqramla qarışdırmaq"], [1, "yalnız bir diaqonalı saymaq"], [3, "təsadüfi"]],
      mk() { const [p, q] = pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5]]), h = Math.hypot(p, q);
        return { t: `ABCD rombunda AB = ${h}; diaqonalları bərabər deyil.`, why: "Kvadrat olmayan rombun iki oxu var: onun diaqonalları. Qarşı tərəflərin ortalarından keçən düz xətlər ox deyil.", f: shapeFig([[-p, 0], [0, -q], [p, 0], [0, q]], "ABCD", [[0, h], [1, h]], "Romb") }; } },
    { r: 0, w: [[2, "diaqonalları ox saymaq"], [4, "təsadüfi"], [1, "təsadüfi"], [3, "təsadüfi"]],
      mk() { const [s, h, b] = pick([[3, 4, 5], [6, 8, 10]]); let a; do { a = rnd(6, 12); } while (a === b);
        return { t: `ABCD paraleloqramında (düzbucaqlı və romb deyil) AB = ${a}, BC = ${b}.`, why: "Düzbucaqlı və romb olmayan paraleloqramın simmetriya oxu yoxdur (amma simmetriya mərkəzi var). Diaqonallar ox deyil.", f: shapeFig([[0, 0], [a, 0], [a + s, h], [s, h]], "ABCD", [[0, a], [1, b]], "Paraleloqram") }; } },
    { r: 1, w: [[2, "diaqonalları ox saymaq"], [0, "trapesiyada ox olmaz demək"], [3, "təsadüfi"], [4, "təsadüfi"]],
      mk() { const [s, h, L] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]), b = rnd(3, 6), a = b + 2 * s;
        return { t: `ABCD bərabəryanlı trapesiyasında AD = ${a}, BC = ${b}, AB = CD = ${L}.`, why: "Bərabəryanlı trapesiyanın bir oxu var: oturacaqların ortalarından keçən düz xətt.", f: shapeFig([[0, 0], [a, 0], [a - s, h], [s, h]], "ADCB", [[0, a], [1, L], [2, b], [3, L]], "Bərabəryanlı trapesiya") }; } },
    { r: 3, w: [[1, "bərabəryanlı üçbucaqla qarışdırmaq"], [0, "təsadüfi"], [6, "hər oxu iki dəfə saymaq"], [2, "təsadüfi"]],
      mk() { const a = rnd(4, 12) * 2; return { t: `ABC üçbucağında AB = BC = AC = ${a}.`, why: "Bərabərtərəfli üçbucağın 3 oxu var: hər təpədən qarşı tərəfin ortasına çəkilən median-hündürlük.", f: shapeFig([[0, 0], [a, 0], [a / 2, a * Math.sqrt(3) / 2]], "ABC", [[0, a], [1, a], [2, a]], "Bərabərtərəfli üçbucaq") }; } },
    { r: 1, w: [[3, "bərabərtərəflilə qarışdırmaq"], [0, "təsadüfi"], [2, "təsadüfi"], [4, "təsadüfi"]],
      mk() { const [s, h, L] = pick([[3, 4, 5], [6, 8, 10], [5, 12, 13]]);
        return { t: `ABC üçbucağında AB = BC = ${L}, AC = ${2 * s} (üçbucaq bərabərtərəfli deyil).`, why: "Bərabəryanlı (bərabərtərəfli olmayan) üçbucağın bir oxu var: oturacağa çəkilən median.", f: shapeFig([[-s, 0], [0, h], [s, 0]], "ABC", [[0, L], [1, L], [2, 2 * s]], "Bərabəryanlı üçbucaq") }; } },
    { r: 5, w: [[10, "hər oxu iki dəfə saymaq"], [1, "təsadüfi"], [0, "təsadüfi"], [4, "təsadüfi"]],
      mk() { const a = rnd(3, 10); return { t: `ABCDE düzgün beşbucaqlısında AB = ${a}.`, why: "Düzgün n-bucaqlının n oxu var. Beşbucaqlıda hər ox bir təpədən və qarşı tərəfin ortasından keçir.", f: shapeFig(regular(5, a), "ABCDE", [[0, a], [1, a]], "Düzgün beşbucaqlı") }; } },
    { r: 6, w: [[3, "yalnız təpələrdən keçən oxları saymaq"], [12, "hər oxu iki dəfə saymaq"], [1, "təsadüfi"], [0, "təsadüfi"]],
      mk() { const a = rnd(3, 10); return { t: `ABCDEF düzgün altıbucaqlısında AB = ${a}.`, why: "Düzgün altıbucaqlının 6 oxu var: 3-ü qarşı təpələrdən, 3-ü qarşı tərəflərin ortalarından keçir.", f: shapeFig(regular(6, a), "ABCDEF", [[0, a], [1, a]], "Düzgün altıbucaqlı") }; } },
  ];

  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. which image of a point: Ox / Oy / the origin (the other symmetries are the wrong options)
    { tip: "qapali", gen: () => again(() => {
      const [x, y] = pt(), kind = pick(["Ox", "Oy", "O"]);
      const C = { Ox: [x, -y], Oy: [-x, y], O: [-x, -y], d1: [y, x], d2: [-y, -x] };
      const nm = { Ox: "Ox oxuna", Oy: "Oy oxuna", O: "koordinat başlanğıcına", d1: "y = x düz xəttinə", d2: "y = −x düz xəttinə" };
      const short = { Ox: "Ox oxu", Oy: "Oy oxu", O: "başlanğıc", d1: "y = x", d2: "y = −x" };
      const rule = { Ox: "(x; y) → (x; −y)", Oy: "(x; y) → (−x; y)", O: "(x; y) → (−x; −y)" };
      const bad = Object.keys(C).filter(k => k !== kind);
      return mcq(ae(C[kind], bad.map(k => C[k]), fp), { text: `${P("A", x, y)} nöqtəsinin ${nm[kind]} nəzərən simmetrik nöqtəsinin koordinatlarını göstərin.`, svg: plane({ pts: [["A", x, y]] }),
        solution: `${short[kind]}: ${rule[kind]}, A' ${fp(C[kind])}. Qalan variantlar başqa simmetriyaların cavabıdır: ${bad.map(k => short[k] + " — " + fp(C[k])).join("; ")}.` });
    }) },
    // 2. image in the line x = c or y = c
    { tip: "qapali", gen: () => again(() => {
      const [x, y] = pt(), v = pick([0, 1]), c = rnd(-4, 4); if (!c || (v ? c === x : c === y)) return null;
      const right = v ? [2 * c - x, y] : [x, 2 * c - y], wrong = v ? [[-x, y], [c - x, y], [x, 2 * c - y], [2 * c + x, y]] : [[x, -y], [x, c - y], [2 * c - x, y], [x, 2 * c + y]];
      if (wrong.some(w => w[0] === x && w[1] === y)) return null;   // no option may be the point itself
      const ln = v ? `x = ${S(c)}` : `y = ${S(c)}`;
      return mcq(ae(right, wrong, fp), { text: `${P("A", x, y)} nöqtəsinin ${ln} düz xəttinə nəzərən simmetrik nöqtəsinin koordinatlarını göstərin.`, svg: plane({ [v ? "vx" : "hy"]: [c], pts: [["A", x, y]] }),
        solution: v ? `${ln} — şaquli ox: ordinat qalır, absis üçün ${S(c)} orta nöqtədir: x' = 2 · ${par(c)} − ${par(x)} = ${S(2 * c - x)}. A' ${fp(right)}. Tələlər: ${fp(wrong[0])} — Oy oxuna nəzərən; ${fp(wrong[1])} — 2 vuruğunu unutmaq; ${fp(wrong[2])} — koordinatları qarışdırmaq; ${fp(wrong[3])} — işarə səhvi.`
          : `${ln} — üfüqi ox: absis qalır, ordinat üçün ${S(c)} orta nöqtədir: y' = 2 · ${par(c)} − ${par(y)} = ${S(2 * c - y)}. A' ${fp(right)}. Tələlər: ${fp(wrong[0])} — Ox oxuna nəzərən; ${fp(wrong[1])} — 2 vuruğunu unutmaq; ${fp(wrong[2])} — koordinatları qarışdırmaq; ${fp(wrong[3])} — işarə səhvi.` });
    }) },
    // 3. rotation about the origin; the arrow shows the direction
    { tip: "qapali", gen: () => again(() => {
      const [x, y] = pt(), kind = pick(["ccw", "cw", "ccw270"]);
      const R = { ccw: [-y, x], cw: [y, -x], ccw270: [y, -x] }[kind], desc = { ccw: "90° saat əqrəbinin əksinə", cw: "90° saat əqrəbi istiqamətində", ccw270: "270° saat əqrəbinin əksinə" }[kind];
      const U = [[-y, x], [y, -x], [-x, -y], [y, x], [-y, -x]], wrong = U.filter(u => u[0] !== R[0] || u[1] !== R[1]);
      return mcq(ae(R, wrong, fp), { text: `${P("A", x, y)} nöqtəsi koordinat başlanğıcı ətrafında ${desc} döndərilir. Alınan nöqtənin koordinatlarını göstərin.`,
        svg: plane({ pts: [["A", x, y]], sym: true, arc: { from: [x, y], dir: kind === "cw" ? -1 : 1, span: kind === "ccw270" ? 270 : 90 } }),
        solution: `${kind === "ccw" ? "Saat əqrəbinin əksinə 90°: (x; y) → (−y; x)" : kind === "cw" ? "Saat əqrəbi istiqamətində 90°: (x; y) → (y; −x)" : "Saat əqrəbinin əksinə 270° = saat əqrəbi istiqamətində 90°: (x; y) → (y; −x)"}. A' ${fp(R)}. Tələlər: istiqaməti qarışdırmaq — ${fp(kind === "ccw" ? [y, -x] : [-y, x])}; 180° dönmə — ${fp([-x, -y])}; koordinatların yerini dəyişmək (y = x-ə nəzərən simmetriya) — ${fp([y, x])}; y = −x-ə nəzərən simmetriya — ${fp([-y, -x])}.` });
    }) },
    // 4. central symmetry about M
    { tip: "qapali", gen: () => again(() => {
      const [x, y] = pt(), a = rnd(-4, 4), b = rnd(-4, 4); if (a === x && b === y) return null;
      const R = [2 * a - x, 2 * b - y];
      if ([[a - x, b - y], [2 * a - x, y], [-x, -y], [a + x, b + y]].some(w => w[0] === x && w[1] === y)) return null;
      return mcq(ae(R, [[a - x, b - y], [2 * a - x, y], [-x, -y], [a + x, b + y]], fp), { text: `${P("A", x, y)} nöqtəsinin ${P("M", a, b)} nöqtəsinə nəzərən simmetrik nöqtəsinin koordinatlarını göstərin.`,
        svg: plane({ pts: [["A", x, y], ["M", a, b]], segs: [[x, y, a, b, "d"]] }),
        solution: `M — AA' parçasının ortasıdır: x' = 2 · ${par(a)} − ${par(x)} = ${S(R[0])}, y' = 2 · ${par(b)} − ${par(y)} = ${S(R[1])}. A' ${fp(R)}. Tələlər: 2 vuruğunu unutmaq — ${fp([a - x, b - y])}; yalnız absisi çevirmək — ${fp([2 * a - x, y])}; M əvəzinə O-ya nəzərən simmetriya — ${fp([-x, -y])}; toplamaq — ${fp([a + x, b + y])}.` });
    }) },
    // 5. number of symmetry axes of an exactly drawn figure
    { tip: "qapali", gen: () => again(() => {
      const sh = pick(SHAPES), m = sh.mk();
      return mcq(ae(sh.r, sh.w.map(w => w[0]), String), { text: `${m.t} Bu fiqurun neçə simmetriya oxu var?`, svg: m.f,
        solution: `${m.why} Cavab: ${sh.r}. Tələlər: ${sh.w.filter(w => w[1] !== "təsadüfi").map(w => `${w[0]} — ${w[1]}`).join("; ")}.` });
    }) },
    // 6. distance between a point and its image
    { tip: "qapali", gen: () => again(() => {
      const kind = pick(["Ox", "Oy", "O", "O"]); let x, y;
      if (kind === "O") { const [p, q] = pick(TRIP); x = p * pick([-1, 1]); y = q * pick([-1, 1]); } else [x, y] = pt();
      const ax = Math.abs(x), ay = Math.abs(y), r = Math.hypot(x, y);
      const R = kind === "Ox" ? 2 * ay : kind === "Oy" ? 2 * ax : 2 * r, im = kind === "Ox" ? [x, -y] : kind === "Oy" ? [-x, y] : [-x, -y];
      const wrong = kind === "Ox" ? [ay, 2 * ax, ax + ay, 2 * (ax + ay)] : kind === "Oy" ? [ax, 2 * ay, ax + ay, 2 * (ax + ay)] : [r, 2 * (ax + ay), ax + ay, 2 * ax];
      const nm = { Ox: "Ox oxuna", Oy: "Oy oxuna", O: "koordinat başlanğıcına" }[kind];
      return mcq(ae(R, wrong, v => String(v)), { text: `${P("A", x, y)} nöqtəsinin ${nm} nəzərən simmetrik nöqtəsi A' olsun. AA' parçasının uzunluğunu tapın.`,
        svg: plane({ pts: [["A", x, y], ["A'", im[0], im[1]]], segs: [[x, y, im[0], im[1], "d"]] }),
        solution: kind === "O" ? `A' ${fp(im)}. O nöqtəsi AA' parçasının ortasıdır, ona görə AA' = 2 · OA = 2 · √(${ax}² + ${ay}²) = 2 · ${r} = ${R}. Tələlər: OA-nı (${r}) cavab yazmaq, koordinatların modullarının cəmini götürmək (${ax + ay}, ${2 * (ax + ay)}).`
          : `A' ${fp(im)}. AA' parçası ${kind === "Ox" ? "şaquli" : "üfüqi"}dir, uzunluğu ${kind === "Ox" ? `2 · ${ay} = ${R}` : `2 · ${ax} = ${R}`}. Tələlər: yarısını (${kind === "Ox" ? ay : ax}) cavab yazmaq, o biri koordinatı götürmək (${kind === "Ox" ? 2 * ax : 2 * ay}).` });
    }) },
    // 7. coded: shortest broken line A–M–B with M on an axis (reflect B)
    { tip: "kod", gen: () => again(() => {
      const [d, s] = pick(TRIP), ax = pick(["Ox", "Oy"]), sg = pick([1, -1]), v1 = rnd(1, s - 1), v2 = s - v1, u1 = rnd(-6, 6), u2 = u1 + d * pick([-1, 1]);
      const A = ax === "Ox" ? [u1, sg * v1] : [sg * v1, u1], B = ax === "Ox" ? [u2, sg * v2] : [sg * v2, u2], B2 = ax === "Ox" ? [u2, -sg * v2] : [-sg * v2, u2], h = Math.hypot(d, s);
      return { text: `${P("A", A[0], A[1])} və ${P("B", B[0], B[1])} nöqtələri ${ax} oxunun eyni tərəfindədir. M nöqtəsi ${ax} oxu üzərində hərəkət edir. AM + MB cəminin ən kiçik qiymətini tapın.`,
        svg: plane({ pts: [["A", A[0], A[1]], ["B", B[0], B[1]]] }), answer: h, show: String(h), tol: 1e-6,
        solution: `B-ni ${ax} oxuna nəzərən əks etdir: B' ${fp(B2)}. Oxun üzərindəki hər M üçün MB = MB', ona görə AM + MB = AM + MB' ≥ AB' (düz xətt ən qısadır). AB' = √(${d}² + ${s}²) = ${h}.` };
    }) },
    // 8. coded: a rotation followed by a translation
    { tip: "kod", gen: () => again(() => {
      const [x, y] = pt(), kind = pick(["ccw", "cw", "180"]), a = rnd(-6, 6), b = rnd(-6, 6); if (!a || !b) return null;
      const [x1, y1] = kind === "ccw" ? [-y, x] : kind === "cw" ? [y, -x] : [-x, -y], x2 = x1 + a, y2 = y1 + b, R = x2 + y2; if (R <= 0) return null;
      const dsc = { ccw: "90° saat əqrəbinin əksinə", cw: "90° saat əqrəbi istiqamətində", "180": "180°" }[kind];
      return { text: `${P("A", x, y)} nöqtəsi koordinat başlanğıcı ətrafında ${dsc} döndərilir, sonra ${dir(a, "sağa", "sola")} və ${dir(b, "yuxarı", "aşağı")} paralel köçürülür. Alınan nöqtənin koordinatlarının cəmini tapın.`,
        svg: plane({ pts: [["A", x, y]], sym: true }), answer: R, show: String(R), tol: 1e-6,
        solution: `Dönmədən sonra: (${S(x1)}; ${S(y1)}). Köçürmədən sonra: (${S(x1)} ${a < 0 ? "−" : "+"} ${Math.abs(a)}; ${S(y1)} ${b < 0 ? "−" : "+"} ${Math.abs(b)}) = (${S(x2)}; ${S(y2)}). Cəm: ${S(x2)} + ${par(y2)} = ${R}.` };
    }) },
    // 9. coded: the centre of a parallelogram is its centre of symmetry
    { tip: "kod", gen: () => again(() => {
      const [a, b] = pt(), [c, d] = pt(), m = rnd(-3, 3), n = rnd(-3, 3); if (((c - a) * (n - b) - (d - b) * (m - a)) === 0) return null;
      const xC = 2 * m - a, yD = 2 * n - d, R = xC + yD; if (R <= 0) return null;
      return { text: `ABCD paraleloqramının simmetriya mərkəzi ${P("M", m, n)} nöqtəsidir. ${P("A", a, b)}, ${P("B", c, d)}. C təpəsinin absisi ilə D təpəsinin ordinatının cəmini tapın.`,
        svg: plane({ pts: [["A", a, b], ["B", c, d], ["M", m, n]], segs: [[a, b, c, d, ""], [a, b, m, n, "d"], [c, d, m, n, "d"]] }), answer: R, show: String(R), tol: 1e-6,
        solution: `Paraleloqramın simmetriya mərkəzi diaqonalların kəsişməsidir: M — AC və BD-nin ortasıdır. C — A-nın M-ə nəzərən simmetriki: x_C = 2 · ${par(m)} − ${par(a)} = ${S(xC)}. D — B-nin simmetriki: y_D = 2 · ${par(n)} − ${par(d)} = ${S(yD)}. Cəm: ${S(xC)} + ${par(yD)} = ${R}.` };
    }) },
    // 10. written: area of the trapezoid AA'B'B made by reflecting a segment in x = c
    { tip: "yazili", gen: () => again(() => {
      const c = rnd(1, 4), x1 = c - rnd(1, 6), x2 = c - rnd(1, 6), y1 = rnd(-5, 5), y2 = rnd(-5, 5); if (x1 === x2 || y1 === y2 || !x1 || !x2 || !y1 || !y2) return null;
      const bs1 = 2 * (c - x1), bs2 = 2 * (c - x2), ht = Math.abs(y1 - y2), R = (bs1 + bs2) / 2 * ht;
      return { text: `${P("A", x1, y1)} və ${P("B", x2, y2)} nöqtələrinin x = ${c} düz xəttinə nəzərən simmetrik nöqtələri A' və B' olsun. AA'B'B dördbucaqlısının sahəsini tapın (oxlarda vahid parçalar bərabərdir; sahəni kvadrat vahidlə tapın).`,
        svg: plane({ vx: [c], pts: [["A", x1, y1], ["B", x2, y2]] }), answer: R, show: String(R), tol: 1e-6, unit: "kv. vahid",
        solution: `1) A' (${S(2 * c - x1)}; ${S(y1)}), B' (${S(2 * c - x2)}; ${S(y2)}). 2) AA' və BB' üfüqidir (paraleldir), AA'B'B trapesiyadır: AA' = ${bs1}, BB' = ${bs2}. 3) Hündürlük = |${S(y1)} − ${par(y2)}| = ${ht}. 4) S = (${bs1} + ${bs2})/2 · ${ht} = ${R}. Həll yazılmadan yalnız cavab — bal verilmir.` };
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
      key: "simmetriya", title: "Simmetriya, dönmə, fiqurların çevrilməsi", fenn: "riyaziyyat", link: "dersler/simmetriya.html",
      format: "Cavab tam ədəddir: 4, −7, 0. Oxların sayı soruşulursa — ədəd (ox yoxdursa 0).",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ox", "ox", "merkez", "merkez", "donme", "donme", "kocurme", "oxlar", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/simmetriya.html")) b.push("dersler/simmetriya.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
