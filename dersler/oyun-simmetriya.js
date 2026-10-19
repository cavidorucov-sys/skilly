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
    for (const [n, x, y] of o.pts || []) {
      g.append(sv("circle", { cx: X(x), cy: Y(y), r: 3.5, fill: n === "M" ? "var(--accent)" : "var(--ink)" }));
      g.append(sv("text", { x: X(x) + 6, y: Y(y) - 6, class: "oy-lbl", style: "font-size:13px;font-style:italic" }, n));
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
        const text = h("div", {}, h("p", {}, `${P("A", x, y)} nöqtəsini əvvəl ${s} oxuna nəzərən simmetrik köçür, sonra ${Math.abs(a)} vahid ${a > 0 ? "sağa" : "sola"} sürüşdür. Alınan nöqtənin koordinatlarının cəmi nədir?`),
          h("ol", { class: "oy-steps" }, ...st.map(t => h("li", {}, t))));
        const why = [`1-ci addım: ${s} oxuna nəzərən ${s === "Ox" ? "absis qalır, ordinatın işarəsi dəyişir" : "ordinat qalır, absisin işarəsi dəyişir"}: A₁(${S(x1)}; ${S(y1)}).`,
          `2-ci addım: sağa/sola köçürmə absisi dəyişir, ordinatı yox: A₂(${S(x2)}; ${S(y2)}).`,
          `3-cü addım: hesab səhvi. ${S(x2)} + ${par(y2)} = ${S(x2 + y2)}.`][bad];
        return { text, choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "simmetriya", title: "Simmetriya, dönmə, fiqurların çevrilməsi", fenn: "riyaziyyat", link: "dersler/simmetriya.html",
      format: "Cavab tam ədəddir: 4, −7, 0. Oxların sayı soruşulursa — ədəd (ox yoxdursa 0).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ox", "ox", "merkez", "merkez", "donme", "donme", "kocurme", "oxlar", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/simmetriya.html")) b.push("dersler/simmetriya.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
