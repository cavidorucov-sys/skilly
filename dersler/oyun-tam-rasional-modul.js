// Tam və rasional ədədlər, ədəd oxu, modul — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nz = (a, b) => { let x; do x = rnd(a, b); while (!x); return x; };
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  // number → "−3", "2,5"
  const N = x => { const r = Math.round(x * 1000) / 1000; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  const P = x => x < 0 ? "(" + N(x) + ")" : N(x);
  const red = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; return [p / g, q / g]; };
  const F = (p, q) => { [p, q] = red(p, q); return q === 1 ? N(p) : (p < 0 ? "−" : "") + Math.abs(p) + "/" + q; };
  const FP = (p, q) => p * q < 0 ? "(" + F(p, q) + ")" : F(p, q);
  const lcm = (a, b) => a / gcd(a, b) * b;
  const xm = a => a > 0 ? `x − ${a}` : a < 0 ? `x + ${-a}` : "x"; // "x − a" written nicely
  const SUP = { 2: "²", 3: "³" };
  const ints = (lo, hi) => hi - lo <= 5 ? Array.from({ length: hi - lo + 1 }, (_, i) => N(lo + i)).join("; ") : `${N(lo)}; ${N(lo + 1)}; …; ${N(hi)}`;

  // Number line: ticks from L with the given step, only 0 and 1 are labelled; points {A: value, B: value}
  function numberLine(L, step, count, pts) {
    const W = 320, H = 74, x0 = 16, dx = (W - 2 * x0) / count, y = 40;
    const X = v => x0 + (v - L) / step * dx;
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Ədəd oxu" });
    g.append(sv("line", { x1: 4, y1: y, x2: W - 4, y2: y, stroke: "#17171a", "stroke-width": 2 }));
    g.append(sv("path", { d: `M${W - 4} ${y}l-8 -5v10z`, fill: "#17171a" }));
    for (let i = 0; i <= count; i++) {
      const v = L + i * step, big = Math.abs(v - Math.round(v)) < 1e-9;
      g.append(sv("line", { x1: x0 + i * dx, y1: y - (big ? 6 : 4), x2: x0 + i * dx, y2: y + (big ? 6 : 4), stroke: "#17171a", "stroke-width": big ? 2 : 1.2 }));
      if (Math.abs(v) < 1e-9 || Math.abs(v - 1) < 1e-9) g.append(sv("text", { x: x0 + i * dx, y: y + 24, "text-anchor": "middle", class: "oy-lbl" }, String(Math.round(v))));
    }
    for (const k in pts) {
      g.append(sv("circle", { cx: X(pts[k]), cy: y, r: 5, fill: "#a32d2d" }));
      g.append(sv("text", { x: X(pts[k]), y: y - 14, "text-anchor": "middle", class: "oy-lbl" }, k));
    }
    return g;
  }

  const levels = [
    { id: "isareler", ad: "İşarələr və əməllər", izah: "Əvvəl qüvvət, sonra vurma-bölmə, sonra toplama-çıxma. İşarəyə diqqət.",
      gen() {
        const t = rnd(0, 3);
        if (t === 0) {
          const a = nz(-9, 9), b = nz(-9, 9), c = nz(-9, 9), d = nz(-9, 9), op = pick(["+", "−"]), s = op === "+" ? 1 : -1, v = a * b + s * c * d;
          return { text: `${P(a)} · ${P(b)} ${op} ${P(c)} · ${P(d)} = ?`, answer: v, show: N(v), tol: 0.01,
            solution: `Əvvəl vurma: ${P(a)} · ${P(b)} = ${N(a * b)}, ${P(c)} · ${P(d)} = ${N(c * d)}. Sonra ${N(a * b)} ${op} ${P(c * d)} = ${N(v)}.` };
        }
        if (t === 1) {
          const b = nz(-9, 9), k = nz(-9, 9), a = b * k, c = nz(-15, 15), v = k - c;
          return { text: `${P(a)} : ${P(b)} − ${P(c)} = ?`, answer: v, show: N(v), tol: 0.01,
            solution: `${P(a)} : ${P(b)} = ${N(k)} (işarələr ${a * b > 0 ? "eynidir — nəticə müsbət" : "fərqlidir — nəticə mənfi"}). Sonra ${N(k)} − ${P(c)} = ${N(v)}.` };
        }
        if (t === 2) {
          const n = rnd(2, 6), m = -rnd(2, 5), e = pick([2, 3]), v = -n * n + m ** e;
          return { text: `−${n}² + (${N(m)})${SUP[e]} = ?`, answer: v, show: N(v), tol: 0.01,
            solution: `−${n}² = −(${n} · ${n}) = ${N(-n * n)}: qüvvət minusdan əvvəl hesablanır. (${N(m)})${SUP[e]} = ${N(m ** e)}: mənfi ədədin ${e === 2 ? "cüt qüvvəti müsbətdir" : "tək qüvvəti mənfidir"}. Cəm: ${N(-n * n)} + ${P(m ** e)} = ${N(v)}.` };
        }
        const a = rnd(-20, 20), b = nz(-15, 15), c = rnd(-20, 20), d = nz(-15, 15), s1 = a - b, s2 = c - d, v = s1 - s2;
        return { text: `${N(a)} − ${P(b)} − (${N(c)} − ${P(d)}) = ?`, answer: v, show: N(v), tol: 0.01,
          solution: `Mötərizə: ${N(c)} − ${P(d)} = ${N(s2)}. Sonra ${N(a)} − ${P(b)} = ${N(s1)}. ${N(s1)} − ${P(s2)} = ${N(v)}. Mənfi ədədi çıxmaq — onu toplamaq deməkdir.` };
      } },
    { id: "kesrler", ad: "Rasional ədədlərlə əməllər", izah: "Kəsrləri ixtisar edilmiş şəkildə yaz: −5/6, 3/4, tam ədəd çıxsa — tam.",
      gen() {
        const DEN = [2, 3, 4, 5, 6, 8, 9, 10, 12];
        const fr = () => { const q = pick(DEN); let p; do p = nz(-2 * q + 1, 2 * q - 1); while (p % q === 0 || gcd(p, q) !== 1); return [p, q]; };
        const t = rnd(0, 3);
        if (t === 0) {
          let p1, q1, p2, q2; do { [p1, q1] = fr(); [p2, q2] = fr(); } while (lcm(q1, q2) > 36);
          const op = pick(["+", "−"]), s = op === "+" ? 1 : -1, L = lcm(q1, q2);
          const x = p1 * L / q1, y = p2 * L / q2, z = x + s * y;
          return { text: `${F(p1, q1)} ${op} ${FP(p2, q2)} = ?`, answer: z / L, show: F(z, L), placeholder: "məs. −5/6",
            solution: `Ortaq məxrəc ${L}: ${F(p1, q1)} = ${N(x)}/${L}, ${F(p2, q2)} = ${N(y)}/${L}. Surətlər: ${N(x)} ${op} ${P(y)} = ${N(z)}. Cavab: ${F(z, L) === N(z) + "/" + L ? F(z, L) : N(z) + "/" + L + " = " + F(z, L)}.` };
        }
        if (t === 1) {
          const [p1, q1] = fr(), [p2, q2] = fr(), num = p1 * p2, den = q1 * q2;
          return { text: `${FP(p1, q1)} · ${FP(p2, q2)} = ?`, answer: num / den, show: F(num, den), placeholder: "məs. −2/3",
            solution: `İşarə: ${p1 * p2 > 0 ? "eyni işarələr — müsbət" : "fərqli işarələr — mənfi"}. Surət surətə, məxrəc məxrəcə: ${F(num, den) === N(num) + "/" + den ? F(num, den) : N(num) + "/" + den + " = " + F(num, den)}.` };
        }
        if (t === 2) {
          const [p1, q1] = fr(), [p2, q2] = fr(), num = p1 * q2, den = q1 * p2;
          return { text: `${FP(p1, q1)} : ${FP(p2, q2)} = ?`, answer: num / den, show: F(num, den), placeholder: "məs. −2/3",
            solution: `Bölmək — tərsinə vurmaq: ${FP(p1, q1)} · ${FP(q2 * Math.sign(p2), Math.abs(p2))} = ${F(num, den)}.` };
        }
        const [dn, dd, ds] = pick([[1, 2, "0,5"], [1, 4, "0,25"], [3, 4, "0,75"], [1, 5, "0,2"], [2, 5, "0,4"], [3, 2, "1,5"], [5, 4, "1,25"]]);
        const sg = pick([1, -1]), [p2, q2] = fr(), op = pick(["+", "−"]), s = op === "+" ? 1 : -1;
        const L = lcm(dd, q2), x = sg * dn * L / dd, y = p2 * L / q2, z = x + s * y;
        return { text: `${sg < 0 ? "−" : ""}${ds} ${op} ${FP(p2, q2)} = ?  (cavabı adi kəsrlə yaz)`, answer: z / L, show: F(z, L), placeholder: "məs. 7/12",
          solution: `${sg < 0 ? "−" : ""}${ds} = ${F(sg * dn, dd)}. Ortaq məxrəc ${L}: ${N(x)}/${L} ${op} ${y < 0 ? "(" + N(y) + "/" + L + ")" : y + "/" + L} = ${F(z, L)}.` };
      } },
    { id: "oxda", ad: "Ədəd oxu", izah: "Yalnız 0 və 1 yazılıb. Əvvəl bir bölgünün nəyə bərabər olduğunu tap.",
      gen() {
        const half = Math.random() < .4, step = half ? .5 : 1, count = 12;
        const L = half ? rnd(-5, -1) : rnd(-10, -2);
        const zeroI = Math.round(-L / step), oneI = Math.round((1 - L) / step);
        let i, j; do { i = rnd(0, count); j = rnd(0, count); } while (Math.abs(i - j) < 2 || i === zeroI || i === oneI || j === zeroI || j === oneI);
        const a = L + i * step, b = L + j * step, svg = numberLine(L, step, count, { A: a, B: b });
        const unitTxt = half ? "0 ilə 1 arasında 2 bölgü var — bir bölgü 1/2 = 0,5 vahiddir." : "0 ilə 1 arasında 1 bölgü var — bir bölgü 1 vahiddir.";
        const kinds = half ? ["A", "B", "dist", "cnt"] : ["A", "B", "dist", "mid", "cnt"], k = pick(kinds);
        if (k === "A" || k === "B") {
          const v = k === "A" ? a : b, ii = k === "A" ? i : j;
          return { text: `${k} nöqtəsinin koordinatı nədir?`, svg, answer: v, show: N(v), tol: 0.01,
            solution: `${unitTxt} ${k} nöqtəsi 0-dan ${Math.abs(ii - zeroI)} bölgü ${v < 0 ? "soldadır" : "sağdadır"}: ${N(v)}.` };
        }
        if (k === "dist") {
          const v = Math.abs(a - b);
          return { text: "A və B nöqtələri arasındakı məsafə neçə vahiddir?", svg, answer: v, show: N(v), tol: 0.01,
            solution: `${unitTxt} A(${N(a)}), B(${N(b)}). AB = |${N(a)} − ${P(b)}| = ${N(v)}.` };
        }
        if (k === "mid") {
          const v = (a + b) / 2;
          return { text: "AB parçasının ortasının koordinatı nədir?", svg, answer: v, show: N(v), tol: 0.01,
            solution: `A(${N(a)}), B(${N(b)}). Orta nöqtə = (${N(a)} + ${P(b)}) / 2 = ${N(a + b)} / 2 = ${N(v)}.` };
        }
        const lo = Math.min(a, b), hi = Math.max(a, b); let c = 0; for (let n = Math.floor(lo) + 1; n < hi; n++) if (n > lo) c++;
        return { text: "A ilə B arasında neçə tam ədəd var? (A və B-nin özləri sayılmır)", svg, answer: c, show: String(c), tol: 0.01,
          solution: `A(${N(a)}), B(${N(b)}). Aralarındakı tam ədədlər: ${c ? Array.from({ length: c }, (_, t) => N(Math.floor(lo) + 1 + t)).join("; ") : "yoxdur"} — cəmi ${c}.` };
      } },
    { id: "muqayise", ad: "Müqayisə və sıralama", izah: "Mənfi ədədlərdə: modulu böyük olan kiçikdir. Kəsrləri onluğa çevir.",
      gen() {
        const make = () => {
          const t = rnd(0, 2);
          if (t === 0) { const k = rnd(-3, 2); return { v: k, s: N(k), dec: true }; }
          if (t === 1) { const q = rnd(2, 9); let p; do p = nz(-3 * q + 1, 2 * q - 1); while (p % q === 0 || gcd(p, q) !== 1); return { v: p / q, s: F(p, q) }; }
          const d = nz(-29, 19); if (d % 10 === 0) return null; return { v: d / 10, s: N(d / 10), dec: true };
        };
        const items = [], seen = new Set();
        while (items.length < 4) { const it = make(); if (!it) continue; const key = Math.round(it.v * 1e6); if (seen.has(key)) continue; seen.add(key); items.push(it); }
        const sorted = [...items].sort((x, y) => x.v - y.v);
        const approx = it => it.dec ? it.s : it.s + " ≈ " + N(Math.round(it.v * 100) / 100);
        const order = "Artan sıra: " + sorted.map(approx).join(" < ") + ".";
        const k = rnd(0, 3);
        if (k === 0 || k === 1) {
          const want = k === 0 ? sorted[3] : sorted[0], idx = items.indexOf(want);
          return { text: `Ən ${k === 0 ? "böyük" : "kiçik"} ədəd hansıdır?`, choices: items.map(x => x.s), correct: idx, show: want.s, solution: order };
        }
        if (k === 2) {
          const want = sorted[1], idx = items.indexOf(want);
          return { text: "Ədədləri artan sıra ilə düzsək, 2-ci yerdə hansı olar?", choices: items.map(x => x.s), correct: idx, show: want.s, solution: order };
        }
        let X; do X = pick([[-1, 2], [-1, 1], [0, 1], [-1, 3], [1, 2], [-3, 2], [-2, 1]]); while (seen.has(Math.round(X[0] / X[1] * 1e6)));
        const xv = X[0] / X[1], c = items.filter(it => it.v < xv).length;
        return { text: `${items.map(x => x.s).join(";  ")}. Bu ədədlərdən neçəsi ${F(X[0], X[1])} ədədindən kiçikdir?`, answer: c, show: String(c), tol: 0.01, solution: order + ` ${F(X[0], X[1])} ədədindən kiçik olanların sayı: ${c}.` };
      } },
    { id: "modul", ad: "Modul", izah: "|a| — a-dan 0-a qədər məsafə; |a − b| — a ilə b arasındakı məsafə.",
      gen() {
        const t = rnd(0, 4);
        if (t === 0) {
          const a = nz(-12, 12), b = rnd(-10, 10), c = nz(-10, 10), d = nz(-9, 9), v1 = Math.abs(a), v2 = Math.abs(b - c);
          if (Math.random() < .5) return { text: `|${N(a)}| − |${N(b)} − ${P(c)}| = ?`, answer: v1 - v2, show: N(v1 - v2), tol: 0.01,
            solution: `|${N(a)}| = ${v1}. ${N(b)} − ${P(c)} = ${N(b - c)}, |${N(b - c)}| = ${v2}. ${v1} − ${v2} = ${N(v1 - v2)}.` };
          const v = Math.abs(a) * Math.abs(d) - v2;
          return { text: `|${N(a)}| · |${N(d)}| − |${N(b)} − ${P(c)}| = ?`, answer: v, show: N(v), tol: 0.01,
            solution: `|${N(a)}| · |${N(d)}| = ${v1} · ${Math.abs(d)} = ${v1 * Math.abs(d)}. |${N(b)} − ${P(c)}| = |${N(b - c)}| = ${v2}. ${v1 * Math.abs(d)} − ${v2} = ${N(v)}.` };
        }
        if (t === 1) {
          let a, b; do { a = rnd(-15, 15); b = rnd(-15, 15); } while (a === b || (a >= 0 && b >= 0));
          const v = Math.abs(a - b);
          return { text: `Ədəd oxunda A(${N(a)}) və B(${N(b)}) nöqtələri arasındakı məsafə nədir?`, answer: v, show: String(v), tol: 0.01,
            solution: `AB = |${N(a)} − ${P(b)}| = |${N(a - b)}| = ${v}. Məsafə həmişə müsbətdir (və ya 0).` };
        }
        if (t === 2) {
          const a = nz(-9, 9), r = rnd(0, 3);
          if (r === 3) {
            const b = rnd(-5, 6), n = b > 0 ? 2 : b === 0 ? 1 : 0;
            return { text: `|${xm(a)}| = ${N(b)} tənliyinin neçə kökü var?`, answer: n, show: String(n), tol: 0.01,
              solution: b > 0 ? `x ilə ${N(a)} arasındakı məsafə ${b} vahiddir: x = ${N(a + b)} və ya x = ${N(a - b)} — 2 kök.` : b === 0 ? `Yalnız ${xm(a)} = 0, yəni x = ${N(a)} — 1 kök.` : `Modul mənfi ola bilməz — kök yoxdur (0).` };
          }
          const b = rnd(1, 9), x1 = a + b, x2 = a - b;
          const [q, v] = [["köklərinin cəmini", x1 + x2], ["böyük kökünü", x1], ["kiçik kökünü", x2]][r];
          return { text: `|${xm(a)}| = ${b} tənliyinin ${q} tap.`, answer: v, show: N(v), tol: 0.01,
            solution: `${xm(a)} = ${b} və ya ${xm(a)} = −${b}. Deməli x = ${N(x1)} və ya x = ${N(x2)}. Cavab: ${N(v)}.` };
        }
        if (t === 3) {
          const a = rnd(-6, 6), b = rnd(2, 7), strict = Math.random() < .5, n = strict ? 2 * b - 1 : 2 * b + 1;
          return { text: `|${xm(a)}| ${strict ? "<" : "≤"} ${b} bərabərsizliyinin neçə tam həlli var?`, answer: n, show: String(n), tol: 0.01,
            solution: `x ilə ${N(a)} arasındakı məsafə ${strict ? "" : "ən çox "}${b} vahid${strict ? "dən az" : ""} olmalıdır: ${N(a - b)} ${strict ? "<" : "≤"} x ${strict ? "<" : "≤"} ${N(a + b)}. Tam ədədlər: ${strict ? ints(a - b + 1, a + b - 1) : ints(a - b, a + b)} — cəmi ${n} ədəd (${strict ? `2 · ${b} − 1` : `2 · ${b} + 1`}).` };
        }
        const p = rnd(-8, 2), q = p + rnd(2, 9);
        return { text: `${N(p)} ≤ x ≤ ${N(q)} olduqda |${xm(p)}| + |${xm(q)}| ifadəsinin qiyməti nədir?`, answer: q - p, show: String(q - p), tol: 0.01,
          solution: `|${xm(p)}| — x ilə ${N(p)} arasındakı məsafə, |${xm(q)}| — x ilə ${N(q)} arasındakı məsafə. x onların arasındadırsa, cəm bütün parçanın uzunluğudur: ${N(q)} − ${P(p)} = ${q - p}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Temperatur, dəniz səviyyəsi, bank balansı — hamısı mənfi ədədlərdir.",
      gen() {
        const t = rnd(0, 4);
        if (t === 0) {
          const a = rnd(2, 15), b = rnd(3, 20), v = -a + b;
          return { text: `Səhər hava −${a}° idi. Günortaya qədər temperatur ${b}° qalxdı. Günorta hava neçə dərəcə idi?`, answer: v, unit: "°", show: N(v) + "°", tol: 0.01,
            solution: `−${a} + ${b} = ${N(v)}°.` };
        }
        if (t === 1) {
          const a = rnd(3, 18), b = rnd(2, 15), v = a + b;
          return { text: `Qubada gecə temperatur −${a}°, gündüz isə +${b}° olub. Gündüz gecədən neçə dərəcə isti idi?`, answer: v, unit: "°", show: v + "°", tol: 0.01,
            solution: `Fərq = ${b} − (−${a}) = ${b} + ${a} = ${v}°. Ədəd oxunda −${a} ilə ${b} arasındakı məsafə.` };
        }
        if (t === 2) {
          const a = rnd(1, 8), b = rnd(a + 1, a + 14), v = a - b;
          return { text: `Axşam temperatur ${a}° idi. Gecə ${b}° düşdü. Gecə temperatur neçə dərəcə oldu?`, answer: v, unit: "°", show: N(v) + "°", tol: 0.01,
            solution: `${a} − ${b} = ${N(v)}°.` };
        }
        if (t === 3) {
          const a = rnd(5, 40), b = rnd(50, 300), v = a + b;
          return { text: `Dalğıc dəniz səviyyəsindən ${a} m aşağıdadır (−${a} m). Onun düz üstündə helikopter ${b} m hündürlükdə asılıb. Helikopterlə dalğıc arasındakı məsafə nə qədərdir?`, answer: v, unit: "m", show: v + " m", tol: 0.01,
            solution: `Məsafə = |${b} − (−${a})| = ${b} + ${a} = ${v} m.` };
        }
        const a = rnd(5, 60) * 5, b = rnd(2, 30) * 5, c = rnd(1, 20) * 5, v = -a + b - c;
        return { text: `Kartının balansı −${a} AZN idi (borc). Sonra ${b} AZN yatırdın və ${c} AZN-lik alış etdin. İndi balans neçə AZN-dir?`, answer: v, unit: "AZN", show: N(v), tol: 0.01,
          solution: `−${a} + ${b} − ${c} = ${N(v)} AZN.${v < 0 ? " Mənfi — hələ borcdasan." : ""}` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində ilk səhv var. Hansında?",
      gen() {
        const t = rnd(0, 2), bad = rnd(0, 2);
        let task, steps, why;
        if (t === 0) {
          const n = rnd(2, 6), a = rnd(2, 7), b = rnd(2, 7), c = rnd(2, 9);
          const X = bad === 0 ? n * n : -n * n, Y = bad === 1 ? -a * b : a * b, Z = bad === 2 ? -c : c, R = X + Y - Z;
          task = `−${n}² + (−${a}) · (−${b}) − |−${c}| = ?`;
          steps = [`−${n}² = ${N(X)}`, `(−${a}) · (−${b}) = ${N(Y)}`, `|−${c}| = ${N(Z)}, cavab: ${N(X)} + ${P(Y)} − ${P(Z)} = ${N(R)}`];
          why = [`−${n}² = −${n * n}: əvvəl qüvvət, minus sonra. (−${n})² olsaydı, ${n * n} olardı.`, `İki mənfinin hasili müsbətdir: (−${a}) · (−${b}) = ${a * b}.`, `Modul mənfi olmur: |−${c}| = ${c}.`][bad];
        } else if (t === 1) {
          const a = nz(-7, 7), b = rnd(2, 9);
          let e1 = `${xm(a)} = ${b} və ya ${xm(a)} = −${b}`, r1 = a + b, r2 = a - b;
          if (bad === 0) { e1 = `${xm(a)} = ${b} (modul açılır)`; r2 = null; }
          if (bad === 1) r2 = -(a - b) === r2 ? a - b + 2 : b - a; // sign slip in the second root
          const roots = r2 == null ? `x = ${N(r1)}` : `x = ${N(r1)} və ya x = ${N(r2)}`;
          const small = r2 == null ? r1 : bad === 2 ? Math.max(r1, r2) : Math.min(r1, r2);
          task = `|${xm(a)}| = ${b} tənliyinin kiçik kökünü tap.`;
          steps = [e1, roots, `Kiçik kök: ${N(small)}`];
          why = [`Modul tənliyinin iki halı var: ${xm(a)} = ${b} və ya ${xm(a)} = −${b}.`, `${xm(a)} = −${b} → x = ${N(a - b)}.`, `${N(a - b)} < ${N(a + b)}, deməli kiçik kök: ${N(a - b)}.`][bad];
        } else {
          const a = -rnd(2, 12), b = rnd(1, 12);
          const e1 = bad === 0 ? `AB = |${N(a)} + ${N(b)}|` : `AB = |${N(a)} − ${N(b)}|`;
          const s = bad === 0 || bad === 1 ? a + b : a - b; // bad 1: "a − b" computed as a + b
          const d = bad === 2 ? s : Math.abs(s);
          task = `Ədəd oxunda A(${N(a)}) və B(${N(b)}) arasındakı məsafəni tap.`;
          steps = [e1, `${bad === 0 ? N(a) + " + " + N(b) : N(a) + " − " + N(b)} = ${N(s)}`, `AB = ${N(d)}`];
          why = [`Məsafə fərqin moduludur: AB = |a − b|, cəmin yox.`, `${N(a)} − ${N(b)} = ${N(a - b)}.`, `Məsafə mənfi ola bilməz: |${N(a - b)}| = ${Math.abs(a - b)}.`][bad];
        }
        const text = h("div", {}, h("p", {}, "Məsələ: " + task), h("ol", { class: "oy-steps" }, ...steps.map(s => h("li", {}, s))));
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (−a² read as a², a modulus opened without looking at the sign, |a − b| = a + b, ...).
  // The 15 Nov mock had |a² − 9| + |a² − 16| for 3 < a < 4 and "2a² − 25" was chosen: question 2 drills exactly that.
  const { ae, again } = Oyun;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  // exact fractions [p, q]
  const fadd = (x, y) => red(x[0] * y[1] + y[0] * x[1], x[1] * y[1]);
  const fmul = (x, y) => red(x[0] * y[0], x[1] * y[1]);
  const fdiv = (x, y) => red(x[0] * y[1], x[1] * y[0]);
  const fneg = x => [-x[0], x[1]];
  const FF = x => F(x[0], x[1]);
  // linear expression: coefs over vars (in order) + constant → "2a² − 13", "−2a", "0"
  const lin = (vars, coefs, c0 = 0) => {
    let s = "";
    const add = (k, body) => { if (!k) return; const a = Math.abs(k), t = (a === 1 && body ? "" : String(a)) + body; s += s ? (k < 0 ? " − " : " + ") + t : (k < 0 ? "−" : "") + t; };
    vars.forEach((v, i) => add(coefs[i], v)); add(c0, "");
    return s || "0";
  };
  const uniq = (right, cands) => { const seen = new Set([right]), out = []; for (const c of cands) if (!seen.has(c)) { seen.add(c); out.push(c); } return out; };

  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. signs, powers and a modulus in one expression
    { tip: "qapali", gen: () => again(() => {
      const a = rnd(2, 6), b = rnd(2, 4), c = -rnd(1, 9), d = rnd(1, 9), sq = Math.random() < .5; // sq: (−a)² instead of −a²
      const A = sq ? a * a : -a * a, B = b ** 3, M = d - c;
      const R = A + B + M, w = [-A + B + M, A - B + M, A + B - M, A + B + Math.abs(c) - d];
      const t1 = sq ? `(−${a})²` : `−${a}²`;
      return mc(ae(R, w), { text: `${t1} − (−${b})³ + |${N(c)} − ${d}| ifadəsinin qiymətini tapın.`,
        solution: `${t1} = ${N(A)} (${sq ? "mötərizə var — mənfi ədəd kvadrata yüksəlir" : "əvvəl qüvvət, minus sonra"}); (−${b})³ = ${N(-B)}, deməli −(−${b})³ = ${B}; ${N(c)} − ${d} = ${N(c - d)}, |${N(c - d)}| = ${M}. Cəm: ${N(A)} + ${B} + ${M} = ${N(R)}. Tələlər: ${t1} = ${N(-A)} yazmaq (${N(-A + B + M)}); −(−${b})³ = −${B} yazmaq (${N(A - B + M)}); modulu atmaq — |${N(c - d)}| = ${N(c - d)} (${N(A + B - M)}); |${N(c)} − ${d}| = ${Math.abs(c)} − ${d} yazmaq (${N(A + B + Math.abs(c) - d)}).` });
    }) },
    // 2. opening moduli on an interval (the 15 Nov mistake): |v − P| + |v − Q|
    { tip: "qapali", gen: () => again(() => {
      let v, P, Q, cond, sp, pv, qv, tvs, sqr;
      if (Math.random() < .6) {
        const n = rnd(1, 6), m = n + rnd(1, 2); v = "a²"; sqr = true; P = n * n; Q = m * m; pv = `a² − ${P}`; qv = `a² − ${Q}`;
        const r = n >= 2 ? pick([0, 1, 1, 1, 2]) : pick([1, 1, 2]);
        [cond, sp, tvs] = [[`0 < a < ${n}`, [-1, -1], [n - .5, n / 2]], [`${n} < a < ${m}`, [1, -1], [(n + m) / 2, n + .5, m - .5]], [`a > ${m}`, [1, 1], [m + 1, m + 2]]][r];
      } else {
        const p = rnd(-9, 4), q = rnd(Math.max(p + 2, 1), p + 10); v = "x"; sqr = false; P = p; Q = q; pv = xm(p); qv = xm(q);
        const r = pick([0, 1, 1, 1, 2]);
        [cond, sp, tvs] = [[`x < ${N(p)}`, [-1, -1], [p - 1, p - 2]], [`${N(p)} < x < ${N(q)}`, [1, -1], [...Array.from({ length: q - p - 1 }, (_, j) => p + 1 + j), p + .5]], [`x > ${N(q)}`, [1, 1], [q + 1, q + 2]]][r];
      }
      const E = (t1, t2) => lin([v], [t1 + t2], -t1 * P - t2 * Q), Ev = (t1, t2) => V => t1 * (V - P) + t2 * (V - Q);
      const R = E(sp[0], sp[1]), allPos = lin([v], [2], Math.abs(P) + Math.abs(Q));
      const val = { [E(1, 1)]: Ev(1, 1), [E(-1, -1)]: Ev(-1, -1), [E(1, -1)]: Ev(1, -1), [E(-1, 1)]: Ev(-1, 1), [allPos]: V => 2 * V + Math.abs(P) + Math.abs(Q) };
      const w = uniq(R, [E(1, 1), E(-1, -1), E(1, -1), E(-1, 1), allPos]).slice(0, 4);
      if (w.length < 4) return null;
      // a check value that tells the right option from every wrong one
      const t = tvs.find(z => { const V = sqr ? z * z : z, r0 = Ev(sp[0], sp[1])(V); return w.every(x => Math.abs(val[x](V) - r0) > 1e-9); });
      if (t == null) return null;
      const T = sqr ? t * t : t, rv = Ev(sp[0], sp[1])(T), tv = sqr ? `${N(t)} (a² = ${N(T)})` : N(t);
      const why = { [E(1, 1)]: "hər iki modulu işarəyə baxmadan olduğu kimi açmaq", [E(-1, -1)]: "hər iki modulun işarəsini dəyişmək", [E(1, -1)]: `|${pv}| = ${pv}, |${qv}| = −(${qv}) götürmək`, [E(-1, 1)]: `|${pv}| = −(${pv}), |${qv}| = ${qv} götürmək`, [allPos]: "modul içindəki minusu plyusa çevirmək" };
      const o = (s, e) => s > 0 ? `|${e}| = ${e}` : `|${e}| = −(${e})`;
      return mc(ae(R, w, x => x), { text: `${cond} olduqda |${pv}| + |${qv}| ifadəsini sadələşdirin.`,
        solution: `Hər modulun içinin işarəsini yoxla: ${cond} olduqda ${pv} ${sp[0] > 0 ? "> 0" : "< 0"}, ${qv} ${sp[1] > 0 ? "> 0" : "< 0"}. Deməli ${o(sp[0], pv)}, ${o(sp[1], qv)}. Cəm: ${R}. Yoxlama: ${sqr ? "a" : "x"} = ${tv} olduqda ifadənin qiyməti ${N(rv)} olur — bu qiyməti yalnız düz variant verir (bir ədədlə yoxlama səhv variantları atmağa kömək edir, sadələşdirməni əvəz etmir). Tələlər: ${w.map(x => `${x} — ${why[x]}`).join("; ")}.` });
    }) },
    // 3. number line with a fractional step: only 0 and 1 are labelled
    { tip: "qapali", gen: () => again(() => {
      const k = rnd(2, 4), count = 12, m = rnd(k + 1, count - k), L = -m / k;
      const i = rnd(0, m - 2); if ((i - m) % k === 0) return null; // A is negative and not an integer
      const s = i - m, R = F(s, k), w = [N(s), F(-s, k), F(s, k + 1), F(s - 1, k)];
      return mc(ae(R, w, x => x), { text: "Ədəd oxunda A nöqtəsinin koordinatını tapın.", svg: numberLine(L, 1 / k, count, { A: s / k }),
        solution: `0 ilə 1 arasında ${k} bölgü var — bir bölgü 1/${k}. A nöqtəsi 0-dan ${-s} bölgü soldadır: ${R}. Tələlər: bölgünü 1 vahid saymaq (${N(s)}); işarəni unutmaq (${F(-s, k)}); bölgüləri yox, xətləri saymaq — bölgü 1/${k + 1} (${F(s, k + 1)}); 0-ın xəttini də bölgü kimi saymaq (${F(s - 1, k)}).` });
    }) },
    // 4. operations with rational numbers: (f1 − (f2)) : (f3), f2 and f3 negative
    { tip: "qapali", gen: () => again(() => {
      const fr = () => { const q = rnd(2, 6); let p; do p = rnd(1, 2 * q - 1); while (gcd(p, q) !== 1); return [p, q]; };
      const f1 = Math.random() < .5 ? fr() : fneg(fr()), f2 = fneg(fr()), f3 = fneg(fr());
      const diff = fadd(f1, fneg(f2)), sum = fadd(f1, f2);
      if (!diff[0] || !sum[0]) return null;
      const R = fdiv(diff, f3), naive = red(f1[0] - f2[0], f1[1] + f2[1]); // numerators and denominators added
      const w = [fmul(diff, f3), fdiv(sum, f3), fneg(R), fdiv(naive, f3)];
      if ([R, ...w].some(x => x[1] > 60 || Math.abs(x[0]) > 99)) return null;
      return mc(ae(FF(R), w.map(FF), x => x), { text: `(${FF(f1)} − (${FF(f2)})) : (${FF(f3)}) ifadəsinin qiymətini tapın.`,
        solution: `Mənfi ədədi çıxmaq — onu toplamaqdır: ${FF(f1)} + ${FF(fneg(f2))} = ${FF(diff)}. Bölmək — tərsinə vurmaqdır: ${FF(diff)} · (${F(f3[1], f3[0])}) = ${FF(R)}. Tələlər: tərsinə çevirmədən vurmaq (${FF(w[0])}); "− (−)" işarəsini mənfi saxlamaq (${FF(w[1])}); mənfiyə bölüb işarəni itirmək (${FF(w[2])}); surətləri surətlərlə, məxrəcləri məxrəclərlə toplamaq (${FF(w[3])}).` });
    }) },
    // 5. |kx − a| = b: sum of the roots
    { tip: "qapali", gen: () => again(() => {
      const k = rnd(2, 4), a = nz(-12, 12), b = rnd(1, 12);
      const R = F(2 * a, k), w = [F(a + b, k), N(2 * a), "0", F(-2 * a, k)];
      const e = `${k}x ${a > 0 ? "−" : "+"} ${Math.abs(a)}`;
      return mc(ae(R, w, x => x), { text: `|${e}| = ${b} tənliyinin köklərinin cəmini tapın.`,
        solution: `${e} = ${b} → x = ${F(a + b, k)}; ${e} = −${b} → x = ${F(a - b, k)}. Cəm: ${F(2 * a, k)}. Tələlər: yalnız bir kök götürmək (${F(a + b, k)}); ${k} ədədinə bölməyi unutmaq (${N(2 * a)}); kökləri qarşılıqlı əks saymaq — x = ${F(a + b, k)} və x = ${F(-a - b, k)} (0); ${N(-a)} ədədini o biri tərəfə keçirəndə işarəni dəyişməmək (${F(-2 * a, k)}).` });
    }) },
    // 6. simplify |L1| ± |L2| ± |L3| under a sign condition on a and b
    { tip: "qapali", gen: () => again(() => {
      const FORMS = [["a", [1, 0]], ["b", [0, 1]], ["a − b", [1, -1]], ["b − a", [-1, 1]], ["a + b", [1, 1]]];
      const CONDS = [["a < 0 < b", [-1, 1, -1, 1, 0]], ["a < b < 0", [-1, -1, -1, 1, -1]], ["b < a < 0", [-1, -1, 1, -1, -1]], ["0 < a < b", [1, 1, -1, 1, 1]]];
      const [cond, sg] = pick(CONDS);
      const idx = [0, 1, 2, 3, 4].filter(i => sg[i]).sort(() => Math.random() - .5).slice(0, 3);
      if (idx.includes(2) && idx.includes(3)) return null;
      if (idx.filter(i => sg[i] < 0).length < 2) return null;
      const eps = [1, pick([1, -1]), pick([1, -1])];
      const sum = f => { const c = [0, 0]; idx.forEach((i, t) => { const s = f(i, t); c[0] += eps[t] * s * FORMS[i][1][0]; c[1] += eps[t] * s * FORMS[i][1][1]; }); return c; };
      const ex = c => lin(["a", "b"], c);
      const R = ex(sum(i => sg[i])), asIs = ex(sum(() => 1));
      const flips = idx.filter(i => sg[i] < 0).map(j => [ex(sum(i => i === j ? 1 : sg[i])), `|${FORMS[j][0]}| = ${FORMS[j][0]} götürmək`]);
      const allPos = ex([0, 1].map(j => idx.reduce((acc, i, t) => acc + eps[t] * (FORMS[i][0].includes("−") ? Math.abs(FORMS[i][1][j]) : sg[i] * FORMS[i][1][j]), 0)));
      const cands = [[asIs, "bütün modulları olduğu kimi açmaq"], ...flips, [allPos, "modulun içindəki minusu plyusa çevirmək (" + (idx.filter(i => FORMS[i][0].includes("−")).map(i => `|${FORMS[i][0]}| = ${FORMS[i][0].replace("−", "+")}`)[0] || "|a| = a") + ")"], [ex(sum(i => -sg[i])), "hər modulun işarəsini tərsinə götürmək"]];
      const why = {}; for (const [x, r] of cands) if (!(x in why)) why[x] = r;
      const w = uniq(R, cands.map(c => c[0])); if (w.length < 4) return null;
      const body = idx.map((i, t) => (t ? (eps[t] > 0 ? " + " : " − ") : "") + `|${FORMS[i][0]}|`).join("");
      const opened = idx.map(i => sg[i] > 0 ? `|${FORMS[i][0]}| = ${FORMS[i][0]}` : `|${FORMS[i][0]}| = ${FORMS[i][0].length === 1 ? "−" + FORMS[i][0] : "−(" + FORMS[i][0] + ")"}`).join(", ");
      return mc(ae(R, w.slice(0, 4), x => x), { text: `${cond} olarsa, ${body} ifadəsini sadələşdirin.`,
        solution: `${cond} olduqda: ${opened}. Yerinə qoyub sadələşdir: ${R}. Tələlər: ${w.slice(0, 4).map(x => `${x} — ${why[x]}`).join("; ")}.` });
    }) },
    // 7. coded: integer solutions of |kx − a| < b (or ≤ b): how many / their sum
    { tip: "kod", gen: () => again(() => {
      const k = pick([1, 1, 2]), a = rnd(-8, 8), b = rnd(2, 7), strict = Math.random() < .5, askSum = Math.random() < .4;
      if (k === 2 && !a) return null;
      const sol = []; for (let x = -40; x <= 40; x++) { const v = Math.abs(k * x - a); if (strict ? v < b : v <= b) sol.push(x); }
      if (sol.length < 2) return null;
      if (askSum && sol.reduce((s, x) => s + x, 0) < 0) return null; // coded answers stay non-negative
      const ans = askSum ? sol.reduce((s, x) => s + x, 0) : sol.length, e = k === 1 ? xm(a) : `2x ${a > 0 ? "−" : "+"} ${Math.abs(a)}`;
      const r = strict ? "<" : "≤", lo = k === 1 ? `${N(a - b)} ${r} x ${r} ${N(a + b)}` : `${F(a - b, 2)} ${r} x ${r} ${F(a + b, 2)}`;
      return { text: `|${e}| ${r} ${b} bərabərsizliyinin tam həllərinin ${askSum ? "cəmini" : "sayını"} tapın.`, answer: ans, show: N(ans), tol: 1e-9,
        solution: `−${b} ${r} ${e} ${r} ${b}, yəni ${lo}. Tam həllər: ${sol.length > 6 ? N(sol[0]) + "; " + N(sol[1]) + "; …; " + N(sol[sol.length - 1]) : sol.map(N).join("; ")} — ${sol.length} ədəd${askSum ? `, cəmi ${N(ans)}` : ""}. ${strict ? "Ciddi bərabərsizlik — uclar daxil deyil." : "≤ — uclar da daxildir."}` };
    }) },
    // 8. coded: the point dividing AB in a given ratio
    { tip: "kod", gen: () => again(() => {
      const [m, n] = pick([[1, 2], [2, 1], [1, 3], [3, 1], [2, 3], [3, 2], [3, 4], [1, 4]]), t = rnd(1, 3), a = rnd(-15, 10);
      const d = (m + n) * t * pick([1, -1]), b = a + d, c = a + d * m / (m + n), ac = Math.abs(d) * m / (m + n);
      if (a >= 0 && b >= 0) return null;
      if (c < 0) return null; // coded answers stay non-negative
      return { text: `Ədəd oxunda A(${N(a)}) və B(${N(b)}) nöqtələri verilib. AB parçası üzərindəki C nöqtəsi üçün AC : CB = ${m} : ${n}. C nöqtəsinin koordinatını tapın.`,
        answer: c, show: N(c), tol: 1e-9,
        solution: `AB = |${N(b)} − ${P(a)}| = ${Math.abs(d)}. AB ${m + n} bərabər hissədir, hər hissə ${Math.abs(d) / (m + n)}; AC = ${m} hissə = ${ac}. C nöqtəsi A-dan B-yə doğru (${d > 0 ? "sağa" : "sola"}) gedir: ${N(a)} ${d > 0 ? "+" : "−"} ${ac} = ${N(c)}. Tələ: A-dan yox, B-dən saymaq (${N(b - d * m / (m + n))}).` };
    }) },
    // 9. coded: |x − p| + |x − q| — least value / number of integer x where it is reached / their sum
    { tip: "kod", gen: () => again(() => {
      const p = rnd(-9, 3), q = p + rnd(2, 9), kind = rnd(0, 2), e = `|${xm(p)}| + |${xm(q)}|`;
      const L = q - p, cnt = L + 1, sum = (p + q) * cnt / 2;
      if (kind === 2 && sum < 0) return null; // coded answers stay non-negative
      const base = `${N(p)} ≤ x ≤ ${N(q)} olanda ${e} = ${p ? "(" + xm(p) + ")" : "x"} + (${N(q)} − x) = ${L} — bu, ${N(p)} ilə ${N(q)} arasındakı məsafədir; x bu parçadan kənarda olanda cəm ${L} ədədindən böyükdür.`;
      if (kind === 0) return { text: `${e} ifadəsinin ən kiçik qiymətini tapın.`, answer: L, show: N(L), tol: 1e-9, solution: `${base} Ən kiçik qiymət: ${L}.` };
      if (kind === 1) return { text: `x-in neçə tam qiymətində ${e} = ${L} olar?`, answer: cnt, show: N(cnt), tol: 1e-9,
        solution: `${base} Deməli ${N(p)} ≤ x ≤ ${N(q)}: ${ints(p, q)} — ${cnt} tam ədəd (uclar da daxil). Tələ: "modul tənliyinin iki kökü olur" deyib 2 yazmaq.` };
      return { text: `${e} = ${L} tənliyinin bütün tam həllərinin cəmini tapın.`, answer: sum, show: N(sum), tol: 1e-9,
        solution: `${base} Tam həllər: ${ints(p, q)} (${cnt} ədəd). Cəm: (${N(p)} + ${P(q)}) · ${cnt} : 2 = ${N(sum)}.` };
    }) },
    // 10. written: |x − p| + |x − q| = s (s > q − p) — case analysis on three intervals, product of the roots
    { tip: "yazili", gen: () => again(() => {
      const p = rnd(-8, 3), q = p + rnd(1, 7), s = q - p + 2 * rnd(1, 4);
      const x1 = (p + q - s) / 2, x2 = (p + q + s) / 2, R = x1 * x2;
      if (!R) return null;
      return { text: `|${xm(p)}| + |${xm(q)}| = ${s} tənliyini həll edin. Cavabda köklərin hasilini yazın.`, answer: R, show: N(R), tol: 1e-9,
        solution: `Modulların içi ${N(p)} və ${N(q)} nöqtələrində sıfır olur — bu nöqtələr oxu üç hissəyə bölür. 1) x < ${N(p)}: (${N(p)} − x) + (${N(q)} − x) = ${s} → ${lin(["x"], [-2], p + q)} = ${s} → x = ${N(x1)} (${N(x1)} < ${N(p)} ✓). 2) ${N(p)} ≤ x ≤ ${N(q)}: (${xm(p)}) + (${N(q)} − x) = ${q - p} ≠ ${s} — kök yoxdur. 3) x > ${N(q)}: (${xm(p)}) + (${xm(q)}) = ${s} → ${lin(["x"], [2], -(p + q))} = ${s} → x = ${N(x2)} (${N(x2)} > ${N(q)} ✓). Köklər ${N(x1)} və ${N(x2)}, hasil ${N(x1)} · ${P(x2)} = ${N(R)}.` };
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
      key: "tam-rasional-modul", title: "Tam və rasional ədədlər, modul", fenn: "riyaziyyat", link: "dersler/tam-rasional-modul.html",
      format: "Cavab yazmaq: tam −7, kəsr −5/6, onluq 2,5 (vergül də, nöqtə də olar).",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["isareler", "isareler", "kesrler", "kesrler", "oxda", "muqayise", "modul", "modul", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/tam-rasional-modul.html")) b.push("dersler/tam-rasional-modul.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
