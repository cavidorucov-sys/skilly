// Rasional ifadələrin çevrilməsi, DMQ — mastery game levels (domain, reducing, adding, multiplying/dividing, identities, word problems) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const lin = p => poly([[1, "x"], [-p, ""]]);                          // x − p
  const den = p => p === 0 ? "x" : "(" + lin(p) + ")";                  // (x − p), bracketed
  const kx = k => k === 1 ? "x" : k + "x";
  const distinct = (n, a, b, not = []) => { const out = []; while (out.length < n) { const v = rnd(a, b); if (!out.includes(v) && !not.includes(v)) out.push(v); } return out; };
  const sumList = xs => xs.map(S).join("; ");
  const eqf = (p, q) => { const f = frac(p, q), raw = S(p) + "/" + q; return f === raw ? raw : raw + " = " + f; };   // "58/46 = 29/23" or just "57/50"
  const c1 = a => a === 1 ? "" : String(a);                          // coefficient 1 is not written

  // average speed (equal distances) and joint work tables — only integer answers
  const SPEEDS = [];
  for (let a = 20; a <= 120; a += 5) for (let b = a + 5; b <= 120; b += 5) if ((2 * a * b) % (a + b) === 0) SPEEDS.push([a, b, 2 * a * b / (a + b)]);
  const WORK = [];
  for (let a = 2; a <= 40; a++) for (let b = a + 1; b <= 60; b++) if ((a * b) % (a + b) === 0) WORK.push([a, b, a * b / (a + b)]);

  const levels = [
    { id: "dmq", ad: "DMQ", izah: "Hər məxrəc ≠ 0. Kəsrə bölürsənsə, onun surəti də ≠ 0 olmalıdır.",
      gen() {
        const kind = pick(["two", "two", "div", "quad"]);
        let text, bad, why;
        if (kind === "div") {
          const [p, q, r] = distinct(3, -7, 7), k = rnd(1, 9);
          text = `İfadə: ${k}/${den(p)} : ${den(q)}/${den(r)}.`;
          bad = [p, q, r];
          why = `Məxrəclər: x ≠ ${S(p)}, x ≠ ${S(r)}. Bölən kəsr sıfır ola bilməz, ona görə onun surəti də: ${lin(q)} ≠ 0 → x ≠ ${S(q)}.`;
        } else if (kind === "quad") {
          if (Math.random() < .75) {
            const [r1, r2] = distinct(2, -7, 7), tr = poly([[1, "x²"], [-(r1 + r2), "x"], [r1 * r2, ""]]);
            text = `İfadə: ${rnd(1, 9)}/(${tr}).`; bad = [r1, r2];
            why = `${tr} = 0 → x = ${S(Math.min(r1, r2))} və x = ${S(Math.max(r1, r2))} (Viyet).`;
          } else {
            const b = 2 * rnd(-3, 3), c = b * b / 4 + rnd(1, 9), tr = poly([[1, "x²"], [b, "x"], [c, ""]]);
            text = `İfadə: ${rnd(1, 9)}/(${tr}).`; bad = [];
            why = `${tr}: D = ${b * b} − ${4 * c} < 0, məxrəc heç vaxt sıfır olmur.`;
          }
        } else {
          const p = rnd(1, 6), q = pick([-1, 1]) * rnd(1, 7);
          const D = [
            { s: `x² − ${p * p}`, bad: [p, -p], w: `x² − ${p * p} = 0 → x = ±${p}` },
            { s: `x² + ${p * p}`, bad: [], w: `x² + ${p * p} heç vaxt sıfır olmur` },
            { s: lin(q), bad: [q], w: `${lin(q)} = 0 → x = ${S(q)}` },
            { s: "x", bad: [0], w: "x = 0" },
            { s: poly([[1, "x²"], [-p, "x"]]), bad: [0, p], w: `x(x − ${p}) = 0 → x = 0, x = ${p}` },
            { s: "7", bad: [], w: "7 — ədəddir, sıfır olmur" },
          ];
          const i = rnd(0, D.length - 1); let j = rnd(0, D.length - 1); while (j === i) j = rnd(0, D.length - 1);
          const br = x => /^[x0-9]+$/.test(x) ? x : "(" + x + ")";
          text = `İfadə: (x + ${rnd(1, 9)})/${br(D[i].s)} − ${rnd(1, 9)}/${br(D[j].s)}.`;
          bad = [...new Set([...D[i].bad, ...D[j].bad])];
          why = `${D[i].w}; ${D[j].w}.`;
        }
        bad.sort((a, b) => a - b);
        const sum = bad.reduce((a, b) => a + b, 0);
        if (bad.length >= 2 && Math.random() < .5)
          return { text: text + " DMQ-ya daxil olmayan x qiymətlərinin cəmini tap.", answer: sum, show: S(sum), tol: 0.01,
            solution: why + ` Qadağan qiymətlər: ${sumList(bad)}; cəm ${S(sum)}.` };
        return { text: text + " Neçə x qiyməti DMQ-ya daxil deyil?", answer: bad.length, show: String(bad.length), tol: 0.01,
          solution: why + (bad.length ? ` Qadağan qiymətlər: ${sumList(bad)} — cəmi ${bad.length}.` : " Qadağan qiymət yoxdur — cavab 0.") };
      } },
    { id: "ixtisar", ad: "Kəsrin ixtisarı", izah: "Surəti və məxrəci vuruqlara ayır, ortaq vuruğu ixtisar et, sonra ədədi yerinə qoy.",
      gen() {
        const kind = pick(["A", "A", "B", "C"]), c = pick([-1, 1]) * rnd(1, 7);
        const t = rnd(10, 60);
        if (kind === "B") {
          const k = rnd(2, 9); let tt = t; while (tt === c) tt++;
          const num = poly([[k, "x"], [-k * c, ""]]), dn = poly([[1, "x²"], [-2 * c, "x"], [c * c, ""]]);
          return { text: `(${num})/(${dn}) kəsrini ixtisar et və x = ${tt} olduqda qiymətini tap.`, answer: k / (tt - c), show: frac(k, tt - c),
            solution: `${num} = ${k}${den(c)}, ${dn} = ${den(c)}². Kəsr = ${k}/${den(c)}. x = ${tt}: ${eqf(k, tt - c)}.` };
        }
        if (kind === "C") {
          const [r] = distinct(1, -9, 9, [c]), m = rnd(2, 6); let tt = t; while (tt === c) tt++;
          const num = poly([[1, "x²"], [-(r + c), "x"], [r * c, ""]]), dn = poly([[m, "x"], [-m * c, ""]]);
          return { text: `(${num})/(${dn}) kəsrini ixtisar et və x = ${tt} olduqda qiymətini tap.`, answer: (tt - r) / m, show: frac(tt - r, m),
            solution: `${num} = ${den(r)}${den(c)}, ${dn} = ${m}${den(c)}. Kəsr = ${den(r)}/${m}. x = ${tt}: ${eqf(tt - r, m)}.` };
        }
        const [r] = distinct(1, -9, 9, [c, -c]); let tt = t; while (tt === c || tt === r || tt === -c) tt++;
        const num = `x² − ${c * c}`, dn = poly([[1, "x²"], [-(c + r), "x"], [c * r, ""]]);
        return { text: `(${num})/(${dn}) kəsrini ixtisar et və x = ${tt} olduqda qiymətini tap.`, answer: (tt + c) / (tt - r), show: frac(tt + c, tt - r),
          solution: `${num} = ${den(c)}${den(-c)}, ${dn} = ${den(c)}${den(r)}. Kəsr = ${den(-c)}/${den(r)}. x = ${tt}: ${eqf(tt + c, tt - r)}.` };
      } },
    { id: "topla", ad: "Toplama və çıxma", izah: "Məxrəcləri vuruqlara ayır, ortaq məxrəcə gətir, surətləri topla, ixtisar et.",
      gen() {
        const kind = pick(["T1", "T2", "T3", "T4"]), p = rnd(1, 9), a = rnd(1, 9);
        const t = rnd(p + 2, 60);
        if (kind === "T1") {
          return { text: `Sadələşdir: x²/(x − ${p}) − ${p * p}/(x − ${p}). Sonra x = ${t} olduqda qiymətini tap.`, answer: t + p, show: String(t + p), tol: 0.01,
            solution: `Məxrəclər eynidir: (x² − ${p * p})/(x − ${p}) = (x − ${p})(x + ${p})/(x − ${p}) = x + ${p}. x = ${t}: ${t + p}.` };
        }
        if (kind === "T2") {
          return { text: `Sadələşdir: ${a}/(x − ${p}) − ${2 * a * p}/(x² − ${p * p}). Sonra x = ${t} olduqda qiymətini tap.`, answer: a / (t + p), show: frac(a, t + p),
            solution: `Ortaq məxrəc (x − ${p})(x + ${p}): (${c1(a)}(x + ${p}) − ${2 * a * p})/(x² − ${p * p}) = (${a === 1 ? "" : a}x − ${a * p})/(x² − ${p * p}) = ${c1(a)}(x − ${p})/((x − ${p})(x + ${p})) = ${a}/(x + ${p}). x = ${t}: ${eqf(a, t + p)}.` };
        }
        if (kind === "T3") {
          return { text: `Sadələşdir: x/(x − ${p}) + ${p}/(x + ${p}) − ${2 * p * p}/(x² − ${p * p}). Sonra x = ${t} olduqda qiymətini tap.`, answer: (t + 3 * p) / (t + p), show: frac(t + 3 * p, t + p),
            solution: `Ortaq məxrəc x² − ${p * p}. Surət: x(x + ${p}) + ${p}(x − ${p}) − ${2 * p * p} = x² + ${2 * p}x − ${3 * p * p} = (x − ${p})(x + ${3 * p}). Nəticə: (x + ${3 * p})/(x + ${p}). x = ${t}: ${eqf(t + 3 * p, t + p)}.` };
        }
        return { text: `Sadələşdir: ${a}/x − ${a}/(x + ${p}). Sonra x = ${t} olduqda qiymətini tap.`, answer: a * p / (t * (t + p)), show: frac(a * p, t * (t + p)),
          solution: `Ortaq məxrəc x(x + ${p}): (${c1(a)}(x + ${p}) − ${c1(a)}x)/(x(x + ${p})) = ${a * p}/(x(x + ${p})). x = ${t}: ${a * p}/(${t}·${t + p}) = ${frac(a * p, t * (t + p))}.` };
      } },
    { id: "vur", ad: "Vurma və bölmə", izah: "Bölmə = tərs kəsrə vurma. Əvvəl hamısını vuruqlara ayır, sonra ixtisar et.",
      gen() {
        const kind = pick(["V1", "V2", "V3"]), p = rnd(1, 9);
        if (kind === "V1") {
          const a = rnd(2, 6), m = rnd(1, 4), b = a * m, t = rnd(p + 1, 20), v = m * t * (t - p);
          return { text: `Sadələşdir: (x² − ${p * p})/(${a}x) · ${b}x²/(x + ${p}). Sonra x = ${t} olduqda qiymətini tap.`, answer: v, show: String(v), tol: 0.01,
            solution: `(x − ${p})(x + ${p})·${b}x² / (${a}x·(x + ${p})) = ${m === 1 ? "" : m}x(x − ${p}). x = ${t}: ${m === 1 ? "" : m + "·"}${t}·${t - p} = ${v}.` };
        }
        if (kind === "V2") {
          const k = rnd(2, 5), m = rnd(2, 6);
          return { text: `${k}(x² − ${p * p})/(x² + ${kx(p)}) : (x − ${p})/(${m}x). Bu ifadənin qiyməti x-dən asılı deyil (DMQ-da). Onu tap.`, answer: k * m, show: String(k * m), tol: 0.01,
            solution: `${k}(x − ${p})(x + ${p})/(x(x + ${p})) · ${m}x/(x − ${p}) = ${k}·${m} = ${k * m}. (DMQ: x ≠ 0, x ≠ ±${p}.)` };
        }
        const q = rnd(1, 7), [r, s] = distinct(2, -8, 8, [q, -q]); let t = rnd(10, 40); while (t === q) t++;
        const num = poly([[1, "x²"], [-(r + s), "x"], [r * s, ""]]);
        return { text: `Sadələşdir: (${num})/(x² − ${q * q}) : ${den(r)}/(x + ${q}). Sonra x = ${t} olduqda qiymətini tap.`, answer: (t - s) / (t - q), show: frac(t - s, t - q),
          solution: `${den(r)}${den(s)}/((x − ${q})(x + ${q})) · (x + ${q})/${den(r)} = ${den(s)}/(x − ${q}). x = ${t}: ${eqf(t - s, t - q)}.` };
      } },
    { id: "deyer", ad: "Sadələşdir və hesabla", izah: "Əvvəl ifadəni sadələşdir, sonra qiyməti yerinə qoy. Nisbət verilirsə — surəti və məxrəci y-ə böl.",
      gen() {
        const kind = pick(["D1", "D2", "D2", "D3"]);
        if (kind === "D1") {
          const p = rnd(1, 9), t = rnd(p + 2, 99);
          return { text: `(x/(x − ${p}) − 1) : ${p}/(x² − ${p * p}) ifadəsini sadələşdir və x = ${t} olduqda qiymətini tap.`, answer: t + p, show: String(t + p), tol: 0.01,
            solution: `x/(x − ${p}) − 1 = (x − x + ${p})/(x − ${p}) = ${p}/(x − ${p}). Bölürük: ${p}/(x − ${p}) · (x − ${p})(x + ${p})/${p} = x + ${p}. x = ${t}: ${t + p}.` };
        }
        if (kind === "D3") {
          const m = rnd(3, 9), plus = Math.random() < .6;
          return plus
            ? { text: `a + 1/a = ${m}. a² + 1/a² = ?`, answer: m * m - 2, show: String(m * m - 2), tol: 0.01,
                solution: `(a + 1/a)² = a² + 2 + 1/a² → a² + 1/a² = ${m}² − 2 = ${m * m - 2}.` }
            : { text: `a − 1/a = ${m}. a² + 1/a² = ?`, answer: m * m + 2, show: String(m * m + 2), tol: 0.01,
                solution: `(a − 1/a)² = a² − 2 + 1/a² → a² + 1/a² = ${m}² + 2 = ${m * m + 2}.` };
        }
        let a, b, m, n, k, l;
        do { [a, b] = distinct(2, 1, 6); m = rnd(1, 5); n = pick([-1, 1]) * rnd(1, 5); k = rnd(1, 5); l = pick([-1, 1]) * rnd(1, 5); } while (gcd(a, b) !== 1 || k * a + l * b === 0);
        const top = m * a + n * b, bot = k * a + l * b;
        return { text: `x/y = ${a}/${b} olarsa, (${poly([[m, "x"], [n, "y"]])})/(${poly([[k, "x"], [l, "y"]])}) = ?`, answer: top / bot, show: frac(top, bot),
          solution: `Surəti və məxrəci y-ə böl: (${m === 1 ? "" : m + "·"}${a}/${b} ${n < 0 ? "−" : "+"} ${Math.abs(n)})/(${k === 1 ? "" : k + "·"}${a}/${b} ${l < 0 ? "−" : "+"} ${Math.abs(l)}). Hər ikisini ${b} ədədinə vur: (${m * a} ${n < 0 ? "−" : "+"} ${Math.abs(n * b)})/(${k * a} ${l < 0 ? "−" : "+"} ${Math.abs(l * b)}) = ${S(top)}/${S(bot)} = ${frac(top, bot)}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          const p = rnd(1, 9), k = rnd(1, 6), K = kx(k), Kb = k === 1 ? "x" : "(" + k + "x)";
          task = `(x² − ${p * p})/(${poly([[k, "x²"], [-k * p, "x"]])}) kəsrini ixtisar et.`;
          steps = [`Surət: x² − ${p * p} = (x − ${p})(x + ${p}).`, `Məxrəc: ${poly([[k, "x²"], [-k * p, "x"]])} = ${K}(x − ${p}).`, `İxtisar: (x + ${p})/${Kb}.`];
          if (bad === 0) steps[0] = `Surət: x² − ${p * p} = (x − ${p})².`;
          if (bad === 1) steps[1] = `Məxrəc: ${poly([[k, "x²"], [-k * p, "x"]])} = ${K}(x + ${p}).`;
          if (bad === 2) steps[2] = `İxtisar: (x + ${p})/${Kb} = ${frac(1 + p, k)}.`;
          why = [`1-ci addım: x² − ${p * p} kvadratların fərqidir: (x − ${p})(x + ${p}).`,
            `2-ci addım: ${K}(x + ${p}) açsan, + ${k * p}x alınır; düzü ${K}(x − ${p}).`,
            `3-cü addım: x + ${p} cəmdir — onun içindəki x-i ixtisar etmək olmaz. Cavab belə qalır: (x + ${p})/${Kb}.`][bad];
        } else {
          const p = rnd(1, 9), [a, b] = distinct(2, 1, 7), A = a + b, B = (a - b) * p;
          const numS = `${A}x ${B < 0 ? "−" : "+"} ${Math.abs(B)}`;
          task = `${a}/(x − ${p}) + ${b}/(x + ${p}) cəmini tap.`;
          steps = [`Ortaq məxrəc: (x − ${p})(x + ${p}) = x² − ${p * p}.`, `Surət: ${c1(a)}(x + ${p}) + ${c1(b)}(x − ${p}) = ${numS}.`, `Cəm: (${numS})/(x² − ${p * p}).`];
          if (bad === 0) steps[0] = `Ortaq məxrəc: (x − ${p})(x + ${p}) = x² + ${p * p}.`;
          if (bad === 1) steps[1] = `Surət: ${c1(a)}(x + ${p}) + ${c1(b)}(x − ${p}) = ${A}x + ${(a + b) * p}.`;
          if (bad === 2) steps[2] = `Cəm: (${numS})/(x − ${p} + x + ${p}) = (${numS})/(2x).`;
          why = [`1-ci addım: (x − ${p})(x + ${p}) = x² − ${p * p} (kvadratların fərqi).`,
            `2-ci addım: ${c1(b)}(x − ${p}) = ${c1(b)}x − ${b * p}, mənfi işarə itib. Düzü: ${numS}.`,
            `3-cü addım: kəsrləri toplayanda məxrəclər toplanmır — ortaq məxrəc x² − ${p * p} qalır.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "hesab", ad: "Həyatdan", izah: "Orta sürət, birgə iş, sahə: kəmiyyətləri hərflə yaz, rasional ifadəni sadələşdir.",
      gen() {
        const kind = pick(["speed", "work", "rect"]);
        if (kind === "speed") {
          const [a, b, v] = pick(SPEEDS), sw = Math.random() < .5;
          return { text: `Maşın A-dan B-yə ${sw ? b : a} km/saat, geri ${sw ? a : b} km/saat sürətlə getdi. Bütün yolda orta sürət neçə km/saat oldu?`, answer: v, unit: "km/saat", show: String(v), tol: 0.01,
            solution: `Yol s olsun. Vaxt: s/${a} + s/${b} = s·${a + b}/${a * b}. Orta sürət = 2s : (s·${a + b}/${a * b}) = 2·${a}·${b}/${a + b} = ${v} km/saat (${String((a + b) / 2).replace(".", ",")} yox!).` };
        }
        if (kind === "work") {
          const [a, b, v] = pick(WORK);
          return { text: `Bir usta işi ${a} günə, digəri ${b} günə görür. Birlikdə bu işi neçə günə görərlər?`, answer: v, unit: "gün", show: String(v), tol: 0.01,
            solution: `Bir gündə: 1/${a} + 1/${b} = ${a + b}/${a * b} hissə. Bütün iş: 1 : ${a + b}/${a * b} = ${a * b}/${a + b} = ${v} gün.` };
        }
        const [p, q] = distinct(2, 1, 9), t = rnd(3, 15), tr = poly([[1, "x²"], [p + q, "x"], [p * q, ""]]), v = t + q;
        return { text: `Düzbucaqlının sahəsi (${tr}) m², eni (x + ${p}) m-dir. x = ${t} olduqda uzunluğu neçə m-dir?`, answer: v, unit: "m", show: String(v), tol: 0.01,
          solution: `Uzunluq = sahə : en = (${tr})/(x + ${p}) = (x + ${p})(x + ${q})/(x + ${p}) = x + ${q}. x = ${t}: ${v} m.` };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (adding numerators and denominators, wrong sign in a factor, forgetting a forbidden
  // value of the divisor, not flipping the right fraction, the lost middle term 2·a·(1/a), ...).
  const { ae, again } = Oyun;
  const D = x => { const r = Math.round(x * 1e4) / 1e4; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  const nice = (x, dp = 2) => isFinite(x) && x > 0 && Math.abs(Math.round(x * 10 ** dp) - x * 10 ** dp) < 1e-7;
  const id = x => x;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. reducing a fraction (answers are expressions)
    { tip: "qapali", gen: () => again(() => {
      const p = rnd(1, 9), k = rnd(2, 6), dn = poly([[k, "x²"], [-k * p, "x"]]);
      const R = `(x + ${p})/(${k}x)`;
      const w = [`(x − ${p})/(${k}x)`, `−(x + ${p})/(${k}x)`, `(x + ${p})/${k}`, `(x + ${p})/x`];
      return mc(ae(R, w, id), { text: `(x² − ${p * p})/(${dn}) kəsrini ixtisar edin.`,
        solution: `Surət: x² − ${p * p} = (x − ${p})(x + ${p}). Məxrəc: ${dn} = ${k}x(x − ${p}). Ortaq vuruq (x − ${p}) ixtisar olunur: ${R}. İlkin ifadənin DMQ-si: x ≠ 0, x ≠ ${p}. Tələlər: kvadratların fərqini (x − ${p})² yazmaq → (x − ${p})/(${k}x); məxrəci ${k}x(${p} − x) yazıb işarəni itirmək → −(x + ${p})/(${k}x); məxrəcdəki x-i və ya ${k} vuruğunu itirmək → (x + ${p})/${k}, (x + ${p})/x.` });
    }) },
    // 2. domain of a quotient: the numerator of the divisor is forbidden too
    { tip: "qapali", gen: () => again(() => {
      const [p, q, s] = distinct(3, -7, 7, [0]), r = -s, a = rnd(1, 9);   // forbidden: p, q, s = −r
      if ([p, q, s].includes(-a)) return null;   // otherwise the trap "also forbid −a" would not add a new value
      const R = p + q + s, w = [p + s, p + q, -R, R - a];
      const xr = poly([[1, "x"], [r, ""]]);
      return mc(ae(R, w), { text: `(x + ${a})/(${lin(p)}) : (${lin(q)})/(${xr}) ifadəsinin mənası olmayan x qiymətlərinin cəmini tapın.`,
        solution: `Məxrəclər: ${lin(p)} ≠ 0 → x ≠ ${S(p)}; ${xr} ≠ 0 → x ≠ ${S(s)}. Bölən kəsr sıfır ola bilməz: ${lin(q)} ≠ 0 → x ≠ ${S(q)}. Cəm: ${S(p)} + ${S(q)} + ${S(s)} = ${S(R)}. Tələlər: bölənin surətini unutmaq (${S(p + s)}); çevirəndən sonra surətə keçən ${xr} ifadəsini unutmaq (${S(p + q)}); x − c = 0 tənliyindən x = −c yazmaq (${S(-R)}); birinci kəsrin surətini (x + ${a}) da qadağan saymaq (${S(R - a)}).` });
    }) },
    // 3. sum of two fractions with denominators x − p and x + p
    { tip: "qapali", gen: () => again(() => {
      const p = rnd(1, 9), [a, b] = distinct(2, 1, 7), dd = `x² − ${p * p}`;
      const R = `(${poly([[a + b, "x"], [(a - b) * p, ""]])})/(${dd})`;
      const w = [`${a + b}/(2x)`, `${a + b}/(${dd})`, `(${poly([[a + b, "x"], [(b - a) * p, ""]])})/(${dd})`, `(${poly([[a + b, "x"], [(a + b) * p, ""]])})/(${dd})`];
      return mc(ae(R, w, id), { text: `${a}/(x − ${p}) + ${b}/(x + ${p}) cəmini tapın.`,
        solution: `Ortaq məxrəc (x − ${p})(x + ${p}) = ${dd}. Surət: ${c1(a)}(x + ${p}) + ${c1(b)}(x − ${p}) = ${poly([[a + b, "x"], [(a - b) * p, ""]])}. Cavab: ${R}. Tələlər: surətləri və məxrəcləri ayrıca toplamaq → ${a + b}/(2x); surətlərə əlavə vuruğu yazmamaq → ${a + b}/(${dd}); əlavə vuruqları qarışdırmaq (${a} ədədini x − ${p} ifadəsinə vurmaq) → ${w[2]}; ${c1(b)}(x − ${p}) açanda mənfini itirmək → ${w[3]}.` });
    }) },
    // 4. division: multiply by the reciprocal of the divisor
    { tip: "qapali", gen: () => again(() => {
      const p = rnd(1, 9), a = rnd(2, 4), m = rnd(2, 5), b = a * m;
      const R = `${m}x(x − ${p})`;
      const w = [`${m}x(x + ${p})`, `1/(${m}x(x − ${p}))`, `${m}(x − ${p})`, `x(x − ${p})/${m}`];
      return mc(ae(R, w, id), { text: `(x² − ${p * p})/(${a}x) : (x + ${p})/(${b}x²) ifadəsini sadələşdirin.`,
        solution: `Bölmə = tərs kəsrə vurma: (x − ${p})(x + ${p})/(${a}x) · ${b}x²/(x + ${p}) = ${b}x²(x − ${p})/(${a}x) = ${R}. İlkin ifadənin DMQ-si: x ≠ 0, x ≠ −${p}. Tələlər: kvadratların fərqini səhv ayırmaq → ${w[0]}; birinci kəsri çevirmək → ${w[1]}; x²/x ixtisarında x-i itirmək → ${w[2]}; əmsalları tərs bölmək (${a}/${b}) → ${w[3]}.` });
    }) },
    // 5. value of a homogeneous fraction from x/y
    { tip: "qapali", gen: () => again(() => {
      const [a, b] = distinct(2, 1, 6), m = rnd(1, 5), n = pick([-1, 1]) * rnd(1, 5), k = rnd(1, 5), l = pick([-1, 1]) * rnd(1, 5);
      if (gcd(a, b) !== 1) return null;
      const P = [[m * a + n * b, k * a + l * b], [m * b + n * a, k * b + l * a], [m * a + n, k * a + l], [m * a + n * b, k * a - l * b], [k * a + l * b, m * a + n * b]];
      if (P.some(([u, v]) => v === 0 || u === 0)) return null;
      const f = P.map(([u, v]) => frac(u, v));
      const top = poly([[m, "x"], [n, "y"]]), bot = poly([[k, "x"], [l, "y"]]);
      return mc(ae(f[0], f.slice(1), id), { text: `x/y = ${a}/${b} olarsa, (${top})/(${bot}) kəsrinin qiymətini tapın.`,
        solution: `x = ${a}t, y = ${b}t götür (t ≠ 0): (${m * a}t ${n < 0 ? "−" : "+"} ${Math.abs(n * b)}t)/(${k * a}t ${l < 0 ? "−" : "+"} ${Math.abs(l * b)}t) = ${eqf(P[0][0], P[0][1])}. Tələlər: nisbəti tərs götürmək (x = ${b}, y = ${a}) → ${f[1]}; y-ə bölüb yalnız x-li həddi ${b} ədədinə vurmaq → ${f[2]}; məxrəcdə ikinci həddin işarəsini tərs götürmək → ${f[3]}; kəsri tərs yazmaq → ${f[4]}.` });
    }) },
    // 6. a ± 1/a = m → a² + 1/a² (sometimes written as (a⁴ + 1)/a²)
    { tip: "qapali", gen: () => again(() => {
      const m = rnd(3, 9), plus = Math.random() < .6, sg = plus ? -1 : 1;
      const R = m * m + 2 * sg, w = [m * m, m * m - 2 * sg, m * m + sg, m + 2 * sg];
      const ask = Math.random() < .5 ? "a² + 1/a²" : "(a⁴ + 1)/a²";
      return mc(ae(R, w), { text: `a ${plus ? "+" : "−"} 1/a = ${m} olarsa, ${ask} ifadəsinin qiymətini tapın.`,
        solution: `${ask === "a² + 1/a²" ? "" : "(a⁴ + 1)/a² = a² + 1/a². "}(a ${plus ? "+" : "−"} 1/a)² = a² ${plus ? "+" : "−"} 2·a·(1/a) + 1/a² = a² + 1/a² ${plus ? "+" : "−"} 2. Deməli, a² + 1/a² = ${m}² ${plus ? "−" : "+"} 2 = ${R}. Tələlər: orta həddi unutmaq (${m * m}); işarəni tərs götürmək (${m * m - 2 * sg}); 2·a·(1/a)-nı 1 saymaq (${m * m + sg}); kvadrata yüksəltməmək (${m + 2 * sg}).` });
    }) },
    // 7. coded: simplify, then substitute
    { tip: "kod", gen: () => again(() => {
      const p = rnd(1, 6), t = rnd(p + 1, 20), k = pick([2, 3, 4, 5, 6, 8, 10]), R = 4 * p * t / k;
      if (!nice(R)) return null;
      return { text: `((x + ${p})/(x − ${p}) − (x − ${p})/(x + ${p})) : ${k}/(x² − ${p * p}) ifadəsinin x = ${t} olduqda qiymətini tapın.`,
        answer: R, show: D(R), tol: 1e-6,
        solution: `Mötərizə: ((x + ${p})² − (x − ${p})²)/(x² − ${p * p}) = ${4 * p}x/(x² − ${p * p}). Bölürük: ${4 * p}x/(x² − ${p * p}) · (x² − ${p * p})/${k} = ${4 * p % k === 0 ? (4 * p / k) + "x" : frac(4 * p, k).replace("/", "x/")}. x = ${t}: ${4 * p}·${t}/${k} = ${D(R)}.` };
    }) },
    // 8. coded: average speed or joint work
    { tip: "kod", gen: () => again(() => {
      if (Math.random() < .5) {
        const [a, b, v] = pick(SPEEDS), sw = Math.random() < .5;
        return { text: `Avtomobil A-dan B-yə ${sw ? b : a} km/saat, eyni yolla B-dən A-ya ${sw ? a : b} km/saat sürətlə qayıtdı. Avtomobilin bütün yoldakı orta sürətini (km/saat) tapın.`,
          answer: v, show: String(v), tol: 1e-6, unit: "km/saat",
          solution: `Yol s olsun. Vaxt: s/${a} + s/${b} = (${a + b}/${a * b})·s. Orta sürət = 2s : ((${a + b}/${a * b})·s) = 2·${a}·${b}/${a + b} = ${v}. Tələ: sürətlərin adi ortası (${D((a + b) / 2)}).` };
      }
      const [a, b, v] = pick(WORK);
      return { text: `Birinci boru boş hovuzu ${a} saata, ikinci boru ${b} saata doldurur (hər birinin sərfi sabitdir). İki boru boş hovuzda eyni anda açılarsa, hovuzu neçə saata doldurar?`,
        answer: v, show: String(v), tol: 1e-6, unit: "saat",
        solution: `1 saatda: 1/${a} + 1/${b} = ${a + b}/${a * b} = ${frac(a + b, a * b)} hovuz. Bütün hovuz: 1 : ${frac(a + b, a * b)} = ${v} saat. Tələ: vaxtların ortası və ya cəmi.` };
    }) },
    // 9. coded: simplify first, then the awkward decimals cancel
    { tip: "kod", gen: () => again(() => {
      const A = rnd(11, 99), B = rnd(11, 99); if (A <= B || A % 10 === 0 || B % 10 === 0) return null;
      const a = A / 10, b = B / 10, minus = Math.random() < .5, R = minus ? (A + B) / 10 : (A - B) / 10;
      const second = minus ? "(1/b − 1/a)" : "(1/a + 1/b)";
      return { text: `a = ${D(a)}, b = ${D(b)} olduqda (a/b − b/a) : ${second} ifadəsinin qiymətini tapın.`,
        answer: R, show: D(R), tol: 1e-6,
        solution: `a/b − b/a = (a² − b²)/(ab); ${second} = ${minus ? "(a − b)" : "(a + b)"}/(ab). Bölürük: (a − b)(a + b)/(ab) · ab/${minus ? "(a − b)" : "(a + b)"} = ${minus ? "a + b" : "a − b"} = ${D(a)} ${minus ? "+" : "−"} ${D(b)} = ${D(R)}. Əvvəl sadələşdirmək hesabı asanlaşdırır.` };
    }) },
    // 10. written: simplify step by step and evaluate
    { tip: "yazili", gen: () => again(() => {
      const p = rnd(1, 6), t = rnd(p + 1, 30), R = 2 * t / (t - p);
      if (!nice(R)) return null;
      return { text: `((x + ${p})/(x² − ${kx(p)}) − (x − ${p})/(x² + ${kx(p)})) : ${2 * p}/(x² + ${kx(p)}) ifadəsini sadələşdirin və x = ${t} olduqda qiymətini tapın.`,
        answer: R, show: D(R), tol: 1e-6,
        solution: `1) Vuruqlara ayır: x² − ${kx(p)} = x(x − ${p}), x² + ${kx(p)} = x(x + ${p}). DMQ: x ≠ 0, x ≠ ±${p}. 2) Ortaq məxrəc x(x − ${p})(x + ${p}): ((x + ${p})² − (x − ${p})²)/(x(x² − ${p * p})) = ${4 * p}x/(x(x² − ${p * p})) = ${4 * p}/(x² − ${p * p}). 3) Bölürük: ${4 * p}/((x − ${p})(x + ${p})) · x(x + ${p})/${2 * p} = 2x/(x − ${p}). 4) x = ${t} (DMQ-dadır): 2·${t}/(${t} − ${p}) = ${2 * t}/${t - p} = ${D(R)}. Həll yazılmadan yalnız cavab — bal verilmir.` };
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
      key: "rasional-ifadeler", title: "Rasional ifadələrin çevrilməsi, DMQ", fenn: "riyaziyyat", link: "dersler/rasional-ifadeler.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 5/2 (onluq da olar). Qadağan qiymət yoxdursa və say soruşulursa — 0.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["dmq", "ixtisar", "ixtisar", "topla", "topla", "vur", "vur", "deyer", "deyer", "hesab"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/rasional-ifadeler.html")) b.push("dersler/rasional-ifadeler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
