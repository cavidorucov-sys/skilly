// Viyet teoremi — mastery game levels (sum and product, converse theorem, symmetric expressions of the roots,
// one root known, parameter problems, find the error, word problems) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const Pf = (p, q) => { const f = frac(p, q); return f.includes("/") || f.startsWith("−") ? "(" + f + ")" : f; };   // fraction in brackets
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const nz = (a, b) => { let v = 0; while (!v) v = rnd(a, b); return v; };
  const eq = (a, b, c) => poly([[a, "x²"], [b, "x"], [c, ""]]) + " = 0";
  const distinct = (n, a, b, not = []) => { const out = []; while (out.length < n) { const v = rnd(a, b); if (!out.includes(v) && !not.includes(v)) out.push(v); } return out; };
  // random equation ax² + bx + c = 0 with D > 0
  const randEq = (aMax = 1, cNonZero = true) => { for (;;) { const a = aMax === 1 ? 1 : pick([1, 1, ...Array.from({ length: aMax - 1 }, (_, i) => i + 2)]), b = rnd(-12, 12), c = cNonZero ? nz(-15, 15) : rnd(-15, 15); if (b * b - 4 * a * c > 0) return [a, b, c]; } };
  const Dchk = (a, b, c) => `D = ${P(b)}² − 4·${P(a)}·${P(c)} = ${b * b - 4 * a * c} > 0, köklər var.`;

  const levels = [
    { id: "cem-hasil", ad: "Cəm və hasil", izah: "ax² + bx + c = 0: x₁ + x₂ = −b/a, x₁·x₂ = c/a. Əvvəl D > 0 olduğuna əmin ol.",
      gen() {
        const [a, b, c] = randEq(6), sum = Math.random() < .5;
        const ans = sum ? -b / a : c / a, show = sum ? frac(-b, a) : frac(c, a);
        return { text: `${eq(a, b, c)}. Tənliyi həll etmədən köklərin ${sum ? "cəmini" : "hasilini"} tap.`, answer: ans, show, placeholder: "məs. −7 və ya 5/3",
          solution: (() => { const raw = (sum ? S(-b) : S(c)) + (a === 1 ? "" : "/" + a); return `${Dchk(a, b, c)} ${sum ? "x₁ + x₂ = −b/a" : "x₁·x₂ = c/a"} = ${raw}${raw === show ? "" : " = " + show}.`; })() };
      } },
    { id: "terse", ad: "Tərs teorem", izah: "x₁ + x₂ = −p, x₁·x₂ = q olan ədədlər x² + px + q = 0 tənliyinin kökləridir. Kökləri ağılda seç, tənliyi köklərdən qur.",
      gen() {
        const kind = pick(["pq", "pq", "guess", "frac"]);
        if (kind === "pq") {
          const [r1, r2] = distinct(2, -9, 9, [0]), askP = Math.random() < .5, p = -(r1 + r2), q = r1 * r2;
          return { text: `Kökləri ${S(r1)} və ${S(r2)} olan gətirilmiş kvadrat tənlik x² + px + q = 0 şəklindədir. ${askP ? "p" : "q"} = ?`, answer: askP ? p : q, show: S(askP ? p : q), tol: 0.01,
            solution: askP ? `x₁ + x₂ = −p → ${S(r1)} + ${P(r2)} = ${S(r1 + r2)} = −p → p = ${S(p)}.` : `x₁·x₂ = q → q = ${S(r1)}·${P(r2)} = ${S(q)}.` };
        }
        if (kind === "guess") {
          const [r1, r2] = distinct(2, -12, 12, [0]), big = Math.random() < .5, ans = big ? Math.max(r1, r2) : Math.min(r1, r2);
          return { text: `${eq(1, -(r1 + r2), r1 * r2)}. Viyet teoremi ilə kökləri seç. ${big ? "Böyük" : "Kiçik"} kökü yaz.`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Cəmi ${S(r1 + r2)}, hasili ${S(r1 * r2)} olan iki ədəd axtarırıq: ${S(Math.min(r1, r2))} və ${S(Math.max(r1, r2))} (${S(Math.min(r1, r2))} + ${P(Math.max(r1, r2))} = ${S(r1 + r2)}, ${S(Math.min(r1, r2))}·${P(Math.max(r1, r2))} = ${S(r1 * r2)}). ${big ? "Böyüyü" : "Kiçiyi"}: ${S(ans)}.` };
        }
        // roots m/a and n → a x² + bx + c with given a
        let a, m, n; do { a = rnd(2, 5); m = nz(-7, 7); n = nz(-6, 6); } while (m % a === 0 || m === a * n);
        const B = -(a * n + m), C = m * n, askB = Math.random() < .5;
        return { text: `Kökləri ${frac(m, a)} və ${S(n)} olan ${a}x² + bx + c = 0 tənliyində ${askB ? "b" : "c"} = ?`, answer: askB ? B : C, show: S(askB ? B : C), tol: 0.01,
          solution: askB ? `x₁ + x₂ = −b/${a} → ${frac(m, a)} + ${P(n)} = ${frac(m + a * n, a)} = −b/${a} → b = ${S(B)}.` : `x₁·x₂ = c/${a} → ${frac(m, a)}·${P(n)} = ${frac(m * n, a)} = c/${a} → c = ${S(C)}.` };
      } },
    { id: "ifade", ad: "Köklərin ifadələri", izah: "Kökləri tapma! İfadəni x₁ + x₂ və x₁·x₂ ilə yaz: x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂, 1/x₁ + 1/x₂ = (x₁ + x₂)/(x₁x₂).",
      gen() {
        const [a, b, c] = randEq(Math.random() < .25 ? 3 : 1);
        const s = frac(-b, a), p = frac(c, a), A2 = a * a;
        const kind = pick(a === 1 ? ["kv", "kv", "ters", "ters", "ferq", "nisbet", "kub", "qarisiq"] : ["kv", "kv", "ters", "ferq", "qarisiq"]);   // cubes only for a = 1 (keeps numbers sane)
        const base = `${Dchk(a, b, c)} x₁ + x₂ = ${s}, x₁·x₂ = ${p}. `;
        const T = {
          kv: ["x₁² + x₂²", b * b - 2 * a * c, A2, `(x₁ + x₂)² − 2x₁x₂ = ${Pf(-b, a)}² − 2·${Pf(c, a)}`],
          ters: ["1/x₁ + 1/x₂", -b, c, `(x₁ + x₂)/(x₁x₂) = ${Pf(-b, a)} : ${Pf(c, a)}`],
          ferq: ["(x₁ − x₂)²", b * b - 4 * a * c, A2, `(x₁ + x₂)² − 4x₁x₂ = ${Pf(-b, a)}² − 4·${Pf(c, a)}`],
          nisbet: ["x₁/x₂ + x₂/x₁", b * b - 2 * a * c, a * c, `(x₁² + x₂²)/(x₁x₂) = ${frac(b * b - 2 * a * c, A2)} : ${Pf(c, a)}`],
          kub: ["x₁³ + x₂³", -b * b * b + 3 * a * b * c, A2 * a, `(x₁ + x₂)³ − 3x₁x₂(x₁ + x₂) = ${Pf(-b, a)}³ − 3·${Pf(c, a)}·${Pf(-b, a)}`],
          qarisiq: ["x₁²x₂ + x₁x₂²", -b * c, A2, `x₁x₂(x₁ + x₂) = ${Pf(c, a)}·${Pf(-b, a)}`],
        }[kind];
        const [name, num, den, how] = T, show = frac(num, den);
        return { text: `${eq(a, b, c)} tənliyinin kökləri x₁ və x₂-dir. ${name} ifadəsinin qiymətini tap.`, answer: num / den, show, placeholder: "məs. 29 və ya −5/6",
          solution: base + `${name} = ${how} = ${show}.` };
      } },
    { id: "bir-kok", ad: "Bir kök məlumdur", izah: "Bir kök verilib: ikincisini hasildən (və ya cəmdən) tap, sonra naməlum əmsalı.",
      gen() {
        const kind = pick(["c-diger", "b", "c", "a2"]);
        const [r1, r2] = distinct(2, -9, 9, [0]);
        if (kind === "c-diger") {
          return { text: `${poly([[1, "x²"], [1, "bx"], [r1 * r2, ""]])} = 0 tənliyinin bir kökü x₁ = ${S(r1)}. İkinci kökü tap.`, answer: r2, show: S(r2), tol: 0.01,
            solution: `x₁·x₂ = ${S(r1 * r2)} → x₂ = ${S(r1 * r2)} : ${P(r1)} = ${S(r2)}. (b = −(x₁ + x₂) = ${S(-(r1 + r2))}.)` };
        }
        if (kind === "b") {
          return { text: `${poly([[1, "x²"], [1, "bx"], [r1 * r2, ""]])} = 0 tənliyinin bir kökü x₁ = ${S(r1)}. b = ?`, answer: -(r1 + r2), show: S(-(r1 + r2)), tol: 0.01,
            solution: `x₁·x₂ = ${S(r1 * r2)} → x₂ = ${S(r2)}. x₁ + x₂ = −b → ${S(r1)} + ${P(r2)} = ${S(r1 + r2)} → b = ${S(-(r1 + r2))}.` };
        }
        if (kind === "c") {
          const b = -(r1 + r2);
          return { text: `${poly([[1, "x²"], [b, "x"]])} + c = 0 tənliyinin bir kökü x₁ = ${S(r1)}. c = ?`, answer: r1 * r2, show: S(r1 * r2), tol: 0.01,
            solution: `x₁ + x₂ = ${S(-b)} → x₂ = ${S(-b)} − ${P(r1)} = ${S(r2)}. c = x₁·x₂ = ${S(r1)}·${P(r2)} = ${S(r1 * r2)}.` };
        }
        // a ≠ 1: ax² + bx + c, c known, one root r1 → other = c/(a r1)
        let a, c, ans; do { a = rnd(2, 5); c = nz(-12, 12); } while (c % r1 !== 0 || c / r1 % a === 0);
        ans = c / (a * r1);
        return { text: `${a}x² + bx ${c < 0 ? "−" : "+"} ${Math.abs(c)} = 0 tənliyinin bir kökü x₁ = ${S(r1)}. İkinci kökü tap.`, answer: ans, show: frac(c, a * r1), placeholder: "məs. −3/2",
          solution: `x₁·x₂ = c/a = ${frac(c, a)} → x₂ = ${frac(c, a)} : ${P(r1)} = ${frac(c, a * r1)}.` };
      } },
    { id: "parametr", ad: "Parametrli məsələlər", izah: "Şərti x₁ + x₂ və x₁·x₂ ilə yaz, parametr üçün tənlik al. Sonda D ≥ 0 olduğunu yoxla!",
      gen() {
        const kind = pick(["ferq", "defe", "kv", "ters"]);
        if (kind === "ferq") {       // x² − s x + q, x₁ − x₂ = d
          const [r1, r2] = distinct(2, -8, 10), s = r1 + r2, d = Math.abs(r1 - r2), q = r1 * r2;
          return { text: `${poly([[1, "x²"], [-s, "x"]])} + q = 0 tənliyinin kökləri üçün x₁ − x₂ = ${d}. q = ?`, answer: q, show: S(q), tol: 0.01,
            solution: `x₁ + x₂ = ${S(s)}, x₁ − x₂ = ${d} → x₁ = ${S(Math.max(r1, r2))}, x₂ = ${S(Math.min(r1, r2))}. q = x₁·x₂ = ${S(q)}. (Və ya: (x₁ − x₂)² = (x₁ + x₂)² − 4q → ${d * d} = ${s * s} − 4q.)` };
        }
        if (kind === "defe") {       // x² − s x + q, x₁ = k x₂
          const k = rnd(2, 5), r2 = nz(-5, 5), r1 = k * r2, s = r1 + r2, q = r1 * r2;
          return { text: `${poly([[1, "x²"], [-s, "x"]])} + q = 0 tənliyinin kökləri üçün x₁ = ${k}x₂. q = ?`, answer: q, show: S(q), tol: 0.01,
            solution: `x₁ = ${k}x₂. Cəm: ${k}x₂ + x₂ = ${S(s)} → ${k + 1}x₂ = ${S(s)} → x₂ = ${S(r2)}, x₁ = ${S(r1)}. q = x₁·x₂ = ${S(q)}.` };
        }
        if (kind === "kv") {         // x² + px + q, x₁² + x₂² = T, p > 0
          let r1, r2; do { [r1, r2] = distinct(2, -7, 7, [0]); } while (r1 + r2 === 0);
          const q = r1 * r2, T = r1 * r1 + r2 * r2, p = Math.abs(r1 + r2);
          return { text: `x² + px ${q < 0 ? "−" : "+"} ${Math.abs(q)} = 0 tənliyinin köklərinin kvadratları cəmi ${T} olarsa, p-nin müsbət qiymətini tap.`, answer: p, show: String(p), tol: 0.01,
            solution: `x₁ + x₂ = −p, x₁x₂ = ${S(q)}. x₁² + x₂² = p² − 2·${P(q)} = ${T} → p² = ${T + 2 * q} → p = ±${p}. Müsbəti ${p}. Yoxla: D = ${p * p} − 4·${P(q)} = ${p * p - 4 * q} ≥ 0 ✓` };
        }
        // x² − s x + q, 1/x₁ + 1/x₂ = s/q
        let r1, r2; do { [r1, r2] = distinct(2, -8, 8, [0]); } while (r1 + r2 === 0);
        const s = r1 + r2, q = r1 * r2;
        return { text: `${poly([[1, "x²"], [-s, "x"]])} + q = 0 tənliyinin kökləri üçün 1/x₁ + 1/x₂ = ${frac(s, q)}. q = ?`, answer: q, show: S(q), tol: 0.01,
          solution: `1/x₁ + 1/x₂ = (x₁ + x₂)/(x₁x₂) = ${S(s)}/q = ${frac(s, q)} → q = ${S(q)}. Yoxla: D = ${s * s} − 4·${P(q)} = ${(r1 - r2) ** 2} ≥ 0 ✓` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let r1, r2; do { [r1, r2] = distinct(2, -7, 7, [0]); } while (r1 + r2 === 0);
        const b = -(r1 + r2), c = r1 * r2, s = r1 + r2, kv = Math.random() < .5;
        const name = kv ? "x₁² + x₂²" : "1/x₁ + 1/x₂";
        const val = kv ? frac(s * s - 2 * c, 1) : frac(s, c);
        const steps = [
          `1) Viyet: x₁ + x₂ = ${S(s)}, x₁·x₂ = ${S(c)}.`,
          kv ? `2) x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂.` : `2) 1/x₁ + 1/x₂ = (x₁ + x₂)/(x₁x₂).`,
          kv ? `3) ${P(s)}² − 2·${P(c)} = ${val}.` : `3) ${S(s)}/${P(c)} = ${val}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = kv ? `1) Viyet: x₁ + x₂ = ${S(s)}, x₁·x₂ = ${S(-c)}.` : `1) Viyet: x₁ + x₂ = ${S(-s)}, x₁·x₂ = ${S(c)}.`;
        if (bad === 1) steps[1] = kv ? pick([`2) x₁² + x₂² = (x₁ + x₂)² − x₁x₂.`, `2) x₁² + x₂² = (x₁ + x₂)² + 2x₁x₂.`]) : `2) 1/x₁ + 1/x₂ = (x₁x₂)/(x₁ + x₂).`;
        if (bad === 2) steps[2] = kv ? `3) ${P(s)}² − 2·${P(c)} = ${S(s * s - 2 * c + pick([-4, -2, 2, 4]))}.` : `3) ${S(s)}/${P(c)} = ${frac(-s, c)}.`;
        const text = h("div", {}, h("p", {}, `Tənlik: ${eq(1, b, c)}. ${name} = ?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st.slice(3)))));
        const why = [kv ? `1-ci addım: x₁·x₂ = c = ${S(c)}, işarə dəyişmir. (Cəmdə işarə dəyişir: x₁ + x₂ = −b = ${S(s)}.)` : `1-ci addım: x₁ + x₂ = −b = ${S(s)}. b-nin işarəsi dəyişməlidir.`,
          kv ? `2-ci addım: (x₁ + x₂)² = x₁² + 2x₁x₂ + x₂², ona görə x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂.` : `2-ci addım: 1/x₁ + 1/x₂ = (x₂ + x₁)/(x₁x₂) — cəm surətdə, hasil məxrəcdədir.`,
          `3-cü addım: hesab səhvdir, düzü ${val}.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "İki ədədin cəmi və hasili məlumdursa, onlar x² − (cəm)x + (hasil) = 0 tənliyinin kökləridir.",
      gen() {
        const kind = pick(["eded", "duz", "kvcem"]);
        if (kind === "eded") {
          const [r1, r2] = distinct(2, 2, 30), big = Math.random() < .5, ans = big ? Math.max(r1, r2) : Math.min(r1, r2);
          return { text: `İki natural ədədin cəmi ${r1 + r2}, hasili ${r1 * r2} edir. ${big ? "Böyük" : "Kiçik"} ədədi tap.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Tərs Viyet: ədədlər x² − ${r1 + r2}x + ${r1 * r2} = 0 tənliyinin kökləridir. D = ${(r1 + r2) ** 2} − ${4 * r1 * r2} = ${(r1 - r2) ** 2} → x = ${Math.min(r1, r2)} və ${Math.max(r1, r2)}. Cavab: ${ans}.` };
        }
        if (kind === "duz") {
          const [a, b] = distinct(2, 2, 20), big = Math.random() < .5, ans = big ? Math.max(a, b) : Math.min(a, b);
          return { text: `Düzbucaqlının perimetri ${2 * (a + b)} sm, sahəsi isə ${a * b} sm². ${big ? "Böyük" : "Kiçik"} tərəfi neçə santimetrdir?`, answer: ans, unit: "sm", show: String(ans), tol: 0.01,
            solution: `Tərəflərin cəmi ${a + b} (perimetrin yarısı), hasili ${a * b}. Onlar x² − ${a + b}x + ${a * b} = 0 tənliyinin kökləridir: ${Math.min(a, b)} və ${Math.max(a, b)}. Cavab: ${ans} sm.` };
        }
        const [r1, r2] = distinct(2, 1, 15);
        return { text: `İki ədədin cəmi ${r1 + r2}, kvadratları cəmi ${r1 * r1 + r2 * r2} edir. Bu ədədlərin hasilini tap.`, answer: r1 * r2, show: String(r1 * r2), tol: 0.01,
          solution: `(x + y)² = x² + y² + 2xy → ${(r1 + r2) ** 2} = ${r1 * r1 + r2 * r2} + 2xy → xy = ${r1 * r2}. (Ədədlər ${Math.min(r1, r2)} və ${Math.max(r1, r2)}.)` };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (not dividing by a, the sign of b, a forgotten 2x₁x₂, (x₁ − x₂)² instead of x₁² + x₂², ...).
  const { ae, again, num } = Oyun;
  const nice = (x, dp = 2) => isFinite(x) && Math.abs(Math.round(x * 10 ** dp) - x * 10 ** dp) < 1e-7;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const nb = x => x < 0 ? "(" + num(x) + ")" : num(x);
  const par = s => s.includes(" ") ? "(" + s + ")" : s;
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. closed: x₁ + x₂ + x₁x₂ with a ≠ 1 (a forgotten, sign of b)
    { tip: "qapali", gen: () => again(() => {
      const a = pick([2, 3, 4, 5, 6, 8]), b = nz(-15, 15), c = nz(-15, 15); if (b * b - 4 * a * c <= 0) return null;
      const s = -b / a, p = c / a, R = s + p, w = [-s + p, s + c, -b + c, s - p];
      if (![s, p, R, ...w].every(x => nice(x))) return null;
      return mc(ae(R, w), { text: `${eq(a, b, c)} tənliyinin kökləri x₁ və x₂-dir. x₁ + x₂ + x₁·x₂ ifadəsinin qiymətini tapın.`,
        solution: `${Dchk(a, b, c)} x₁ + x₂ = −b/a = ${num(s)}, x₁·x₂ = c/a = ${num(p)}. Cəm: ${num(s)} + ${nb(p)} = ${num(R)}. Tələlər: b-nin işarəsini dəyişməmək (${num(-s + p)}), hasildə a-ya bölməyi unutmaq (${num(s + c)}), hasili çıxmaq (${num(s - p)}), cəmi və hasili a-ya bölmədən −b + c götürmək (${num(-b + c)}).` });
    }) },
    // 2. closed: x₁² + x₂²
    { tip: "qapali", gen: () => again(() => {
      const a = pick([1, 1, 2, 3, 4]), b = nz(-12, 12), c = nz(-12, 12); if (b * b - 4 * a * c <= 0) return null;
      const s = -b / a, p = c / a, R = s * s - 2 * p, w = [s * s + 2 * p, s * s - 4 * p, s * s, a === 1 ? s * s - p : b * b - 2 * c];
      if (![s, p, R, ...w].every(x => nice(x))) return null;
      return mc(ae(R, w), { text: `${eq(a, b, c)} tənliyinin kökləri x₁ və x₂-dir. x₁² + x₂² ifadəsinin qiymətini tapın.`,
        solution: `${Dchk(a, b, c)} x₁ + x₂ = ${num(s)}, x₁·x₂ = ${num(p)}. x₁² + x₂² = (x₁ + x₂)² − 2x₁x₂ = ${nb(s)}² − 2·${nb(p)} = ${num(R)}. Tələlər: 2x₁x₂-ni çıxmamaq (${num(s * s)}), toplamaq (${num(s * s + 2 * p)}), (x₁ − x₂)² düsturu (${num(s * s - 4 * p)}), ${a === 1 ? "x₁x₂-nin əmsalı 2-ni unudub (x₁ + x₂)² − x₁x₂ yazmaq" : "cəmi və hasili a-ya bölməmək, yəni b² − 2c"} (${num(a === 1 ? s * s - p : b * b - 2 * c)}).` });
    }) },
    // 3. closed: 1/x₁ + 1/x₂ = S/P
    { tip: "qapali", gen: () => again(() => {
      const a = pick([1, 1, 2, 4, 5]), b = nz(-12, 12), c = nz(-20, 20); if (b * b - 4 * a * c <= 0) return null;
      const s = -b / a, p = c / a, R = s / p, w = [p / s, -s / p, 1 / s, 1 / p];
      if (![s, p, R, ...w].every(x => nice(x))) return null;
      return mc(ae(R, w), { text: `${eq(a, b, c)} tənliyinin kökləri x₁ və x₂-dir. 1/x₁ + 1/x₂ ifadəsinin qiymətini tapın.`,
        solution: `${Dchk(a, b, c)} 1/x₁ + 1/x₂ = (x₁ + x₂)/(x₁x₂) = ${num(s)} : ${nb(p)} = ${num(R)}. Tələlər: cəmlə hasili tərsinə yazmaq (${num(p / s)}), işarəni dəyişmək (${num(-R)}), cəmin tərsini (${num(1 / s)}) və ya hasilin tərsini (${num(1 / p)}) götürmək.` });
    }) },
    // 4. closed: the other root when one root is known (a ≠ 1)
    { tip: "qapali", gen: () => again(() => {
      const a = pick([2, 3, 4, 5]), r1 = nz(-6, 6), k = nz(-8, 8), c = r1 * k, b = -a * r1 - k, R = k / a;
      if (!nice(c / a) || !nice(R)) return null;
      const w = [k, c * r1 / a, -R, c / a - r1];
      if (![R, ...w].every(x => nice(x))) return null;
      return mc(ae(R, w), { text: `${poly([[a, "x²"], [b, "x"], [c, ""]])} = 0 tənliyinin kökü x₁ = ${S(r1)}. İkinci kökü tapın.`,
        solution: `Hasil: x₁·x₂ = c/a = ${num(c / a)} → x₂ = ${num(c / a)} : ${P(r1)} = ${num(R)}. (Yoxlama: x₁ + x₂ = ${num(r1 + R)} = −b/a.) Tələlər: a-ya bölməyi unutmaq (${S(c)} : ${P(r1)} = ${S(k)}), bölmək əvəzinə vurmaq (${num(c * r1 / a)}), cəmlə hasili qarışdırmaq (${num(c / a)} − ${P(r1)} = ${num(c / a - r1)}), cavabın işarəsini dəyişmək (${num(-R)}).` });
    }) },
    // 5. closed: the equation whose roots are x₁ + t and x₂ + t
    { tip: "qapali", gen: () => again(() => {
      const p = nz(-8, 8), q = nz(-8, 8), t = pick([-3, -2, -1, 1, 2, 3]); if (p * p - 4 * q <= 0) return null;
      const s = -p, S2 = s + 2 * t, P2 = q + t * s + t * t; if (!S2 || !P2) return null;
      const tx = n => (n > 0 ? "+ " : "− ") + Math.abs(n), fm = ([b, c]) => eq(1, b, c);
      return mc(ae([-S2, P2], [[-(s + t), P2], [-S2, q + t * t], [S2, P2], [p, P2]], fm), {
        text: `x₁ və x₂ ədədləri ${eq(1, p, q)} tənliyinin kökləridir. Kökləri x₁ ${tx(t)} və x₂ ${tx(t)} olan gətirilmiş kvadrat tənliyi seçin.`,
        solution: `x₁ + x₂ = ${S(s)}, x₁·x₂ = ${S(q)}. Yeni köklərin cəmi: ${S(s)} ${t > 0 ? "+" : "−"} 2·${Math.abs(t)} = ${S(S2)}. Yeni hasil: x₁x₂ + t(x₁ + x₂) + t² = ${S(q)} ${s * t < 0 ? "−" : "+"} ${Math.abs(s * t)} + ${t * t} = ${S(P2)}. Tənlik: ${eq(1, -S2, P2)}. Tələlər: t-ni cəmə bir dəfə əlavə etmək, hasildə t(x₁ + x₂)-ni unutmaq, cəmin işarəsini dəyişməmək, cəmi dəyişməmək.` });
    }) },
    // 6. closed: parameter, two different real roots (D > 0, not D ≥ 0)
    { tip: "qapali", gen: () => again(() => {
      const p = pick([-14, -12, -10, -8, -6, -4, 4, 6, 8, 10, 12, 14]), q4 = p * p / 4, R = q4 - 1, w = [q4, p * p, p * p / 2, q4 + 1];
      return mc(ae(R, w), { text: `${poly([[1, "x²"], [p, "x"]])} + m = 0 tənliyinin iki müxtəlif həqiqi kökü olması üçün m-in ən böyük tam qiyməti neçədir?`,
        solution: `İki müxtəlif kök: D > 0. D = ${P(p)}² − 4m = ${p * p} − 4m > 0 → m < ${q4}. Ən böyük tam qiymət: ${R} (m = ${q4} olduqda D = 0, kök təkdir). Tələlər: bərabərliyi daxil etmək (${q4}), D = ${P(p)}² − 4m-də 4-ü unutmaq (${p * p}), D = ${P(p)}² − 2m yazmaq (${p * p / 2}), “kök yoxdur” halını həll etmək (${q4 + 1}).` });
    }) },
    // 7. coded: (x₁ − x₂)² without the roots (irrational roots allowed)
    { tip: "kod", gen: () => again(() => {
      const a = pick([1, 1, 2, 3]), b = nz(-9, 9), c = nz(-9, 9), d = b * b - 4 * a * c; if (d <= 0 || d % (a * a)) return null;
      const R = d / (a * a);
      return { text: `${eq(a, b, c)} tənliyinin kökləri x₁ və x₂-dir. (x₁ − x₂)² ifadəsinin qiymətini tapın.`,
        answer: R, show: String(R), tol: 1e-6,
        solution: `${Dchk(a, b, c)} x₁ + x₂ = ${frac(-b, a)}, x₁·x₂ = ${frac(c, a)}. (x₁ − x₂)² = (x₁ + x₂)² − 4x₁x₂ = ${Pf(-b, a)}² − 4·${Pf(c, a)} = ${R}.` };
    }) },
    // 8. coded: rectangle by perimeter and diagonal → area, or the longer side (x + y and x² + y² → xy → x, y)
    { tip: "kod", gen: () => again(() => {
      const [a0, b0, d0] = pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41], [12, 35, 37], [11, 60, 61], [16, 63, 65]]), k = pick([1, 1, 2, 3, 4]), a = a0 * k, b = b0 * k, d = d0 * k;
      if (a + b > 80) return null;
      const base = `Tərəflər x və y: x + y = ${a + b} (yarım perimetr), x² + y² = ${d}² = ${d * d}. (x + y)² = x² + y² + 2xy → ${(a + b) ** 2} = ${d * d} + 2xy → xy = ${a * b}.`;
      if (Math.random() < .5) return { text: `Düzbucaqlının perimetri ${2 * (a + b)} sm, diaqonalı ${d} sm-dir. Düzbucaqlının sahəsi neçə kvadrat santimetrdir?`,
        answer: a * b, show: String(a * b), tol: 1e-6, unit: "sm²", solution: `${base} Sahə xy-dir: ${a * b} sm². (Tərəflər ${a} və ${b}.) Tələ: perimetri tərəflərin cəmi saymaq.` };
      return { text: `Düzbucaqlının perimetri ${2 * (a + b)} sm, diaqonalı ${d} sm-dir. Düzbucaqlının böyük tərəfi neçə santimetrdir?`,
        answer: b, show: String(b), tol: 1e-6, unit: "sm", solution: `${base} Tərəflər t² − ${a + b}t + ${a * b} = 0 tənliyinin kökləridir: D = ${(a + b) ** 2} − ${4 * a * b} = ${(b - a) ** 2}, t = ${a} və ${b}. Böyük tərəf ${b} sm. Tələ: perimetri tərəflərin cəmi saymaq.` };
    }) },
    // 9. coded: reciprocal roots, a parameter in a and c
    { tip: "kod", gen: () => again(() => {
      const m0 = rnd(2, 7), al = pick([-1, 0, 1, 2]), k = pick([2, 3]), be = al - (k - 1) * m0, a0 = m0 + al; if (a0 < 1) return null;
      const B = 2 * a0 + rnd(1, 6), sg = pick([-1, 1]);
      const aS = poly([[1, "m"], [al, ""]]), cS = poly([[k, "m"], [be, ""]]);
      return { text: `${par(aS)}x² ${sg < 0 ? "−" : "+"} ${B}x + ${par(cS)} = 0 tənliyinin kökləri qarşılıqlı tərs ədədlərdirsə, m-in qiymətini tapın.`,
        answer: m0, show: String(m0), tol: 1e-6,
        solution: `Qarşılıqlı tərs ədədlər: x₁·x₂ = 1. Viyet: x₁·x₂ = c/a → ${par(cS)} : ${par(aS)} = 1 → ${cS} = ${aS} → ${k - 1 === 1 ? "" : k - 1}m = ${al - be} → m = ${m0}. Yoxlama: a = c = ${a0}, D = ${B}² − 4·${a0}² = ${B * B - 4 * a0 * a0} > 0 ✓.` };
    }) },
    // 10. written: x₁² + x₂² = T with a parameter in b and c; one of the two m values fails D > 0
    { tip: "yazili", gen: () => again(() => {
      const q0 = pick([-3, -2, -1, 1, 2, 3]), m1 = rnd(-9, 9), m2 = 2 * q0 - m1, c = nz(-12, 12), T = -m1 * m2 - 2 * c; if (m1 === m2 || T < 3) return null;
      const Dm = m => m * m - 4 * (q0 * m + c), ok = [m1, m2].filter(m => Dm(m) > 0), bad = [m1, m2].filter(m => Dm(m) < 0);
      if (ok.length !== 1 || bad.length !== 1 || ok[0] <= 0) return null;
      const m = ok[0], x = bad[0], cS = q0 < 0 ? poly([[c, ""], [q0, "m"]]) : poly([[q0, "m"], [c, ""]]);
      return { text: `x² − mx + (${cS}) = 0 tənliyinin kökləri üçün x₁² + x₂² = ${T} şərti ödənir. m-in qiymətini tapın.`,
        answer: m, show: String(m), tol: 1e-6,
        solution: `1) Viyet: x₁ + x₂ = m, x₁·x₂ = ${cS}. 2) x₁² + x₂² = m² − 2(${cS}) = ${T} → ${poly([[1, "m²"], [-2 * q0, "m"], [-(2 * c + T), ""]])} = 0 → m = ${S(Math.min(m1, m2))} və ya m = ${S(Math.max(m1, m2))}. 3) D yoxlaması: D = m² − 4(${cS}). m = ${S(x)}: D = ${S(Dm(x))} < 0, kök yoxdur, atılır. m = ${S(m)}: D = ${S(Dm(m))} > 0 ✓. Cavab: m = ${m}. Həll yazılmadan yalnız cavab — bal verilmir.` };
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
      key: "viyet", title: "Viyet teoremi", fenn: "riyaziyyat", link: "dersler/viyet.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 5/2 (onluq 2.5 də olar).",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["cem-hasil", "cem-hasil", "terse", "ifade", "ifade", "ifade", "bir-kok", "parametr", "parametr", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/viyet.html")) b.push("dersler/viyet.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
