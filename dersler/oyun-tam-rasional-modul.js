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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "tam-rasional-modul", title: "Tam və rasional ədədlər, modul", fenn: "riyaziyyat", link: "dersler/tam-rasional-modul.html",
      format: "Cavab yazmaq: tam −7, kəsr −5/6, onluq 2,5 (vergül də, nöqtə də olar).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
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
