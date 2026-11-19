// Kvadrat tənlik, diskriminant — mastery game levels (incomplete equations, D, number of roots, root formula,
// even-coefficient formula, find the error, word problems) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);                 // negative number in brackets
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const nz = (a, b) => { let v = 0; while (!v) v = rnd(a, b); return v; };
  const eq = (a, b, c) => poly([[a, "x²"], [b, "x"], [c, ""]]) + " = 0";
  const isSq = n => n >= 0 && Number.isInteger(Math.sqrt(n));
  // √n simplified: [outer, inner]; 12 → [2, 3]
  const surd = n => { let o = 1, i = n; for (let k = 2; k * k <= i; k++) while (i % (k * k) === 0) { i /= k * k; o *= k; } return [o, i]; };
  const surdS = n => { const [o, i] = surd(n); return i === 1 ? String(o) : (o === 1 ? "" : o) + "√" + i; };
  // a·x² + b·x + c from roots m/a and n:  (ax − m)(x − n) = ax² − (an + m)x + mn
  const fromRoots = (a, m, n) => [a, -(a * n + m), m * n];
  const Dtxt = (a, b, c) => `D = b² − 4ac = ${P(b)}² − 4·${P(a)}·${P(c)} = ${b * b} ${-4 * a * c < 0 ? "−" : "+"} ${Math.abs(4 * a * c)} = ${S(b * b - 4 * a * c)}`;

  const levels = [
    { id: "natamam", ad: "Natamam kvadrat tənlik", izah: "b = 0: ax² = −c. c = 0: x(ax + b) = 0 — bir kök həmişə 0-dır. Kvadrat mənfi ola bilməz!",
      gen() {
        const kind = pick(["c", "c", "b", "b", "irr", "none"]);
        if (kind === "c") {          // ax² − a r² = 0
          const a = rnd(1, 5), r = rnd(1, 9), ask = pick(["pos", "neg", "cnt"]);
          const t = `${eq(a, 0, -a * r * r)}.`, st = `${a === 1 ? "" : a}x² = ${a * r * r}${a === 1 ? "" : ` → x² = ${r * r}`} → x = ${r} və x = −${r}.`;
          if (ask === "cnt") return { text: t + " Tənliyin neçə kökü var?", answer: 2, show: "2", tol: 0.01, solution: st + " İki kök." };
          const v = ask === "pos" ? r : -r;
          return { text: t + ` ${ask === "pos" ? "Müsbət" : "Mənfi"} kökü tap.`, answer: v, show: S(v), tol: 0.01, solution: st + ` Cavab: ${S(v)}.` };
        }
        if (kind === "b") {          // ax² + bx = 0
          const a = rnd(1, 6), b = nz(-15, 15);
          return { text: `${eq(a, b, 0)}. Sıfırdan fərqli kökü tap.`, answer: -b / a, show: frac(-b, a), placeholder: "məs. 5/2",
            solution: `x-i mötərizə xaricinə çıxar: x(${poly([[a, "x"], [b, ""]])}) = 0 → x = 0 və ya ${poly([[a, "x"], [b, ""]])} = 0 → x = ${frac(-b, a)}.` };
        }
        if (kind === "irr") {        // ax² = a·n, n not a square
          let n; do { n = rnd(2, 30); } while (isSq(n));
          const a = rnd(1, 4);
          return { text: `${eq(a, 0, -a * n)}. Müsbət kökü tap.`, answer: Math.sqrt(n), show: surdS(n), placeholder: "məs. 2√3",
            solution: `${a === 1 ? "" : a}x² = ${a * n}${a === 1 ? "" : ` → x² = ${n}`} → x = ±√${n}${surdS(n) !== "√" + n ? " = ±" + surdS(n) : ""}. Müsbət kök: ${surdS(n)}.` };
        }
        const a = rnd(1, 6), c = rnd(1, 40), sg = pick([1, -1]);
        return { text: `${eq(sg * a, 0, sg * c)}. Tənliyin neçə kökü var?`, answer: 0, show: "0", tol: 0.01,
          solution: `${a === 1 ? "" : a}x² = −${c}. Kvadrat mənfi ola bilməz (x² ≥ 0). Kök yoxdur — cavab 0.` };
      } },
    { id: "D", ad: "Diskriminant", izah: "D = b² − 4ac. Mənfi əmsalları mötərizədə yaz — işarə səhvi burada olur.",
      gen() {
        const a = nz(-6, 6), b = rnd(-12, 12), c = nz(-12, 12);
        return { text: `${eq(a, b, c)}. Diskriminantı tap.`, answer: b * b - 4 * a * c, show: S(b * b - 4 * a * c), tol: 0.01,
          solution: `a = ${S(a)}, b = ${S(b)}, c = ${S(c)}. ${Dtxt(a, b, c)}.` };
      } },
    { id: "say", ad: "Köklərin sayı", izah: "D > 0 — iki kök, D = 0 — bir kök, D < 0 — kök yoxdur. Parametrli suallarda D-ni parametrlə yaz.",
      gen() {
        const kind = pick(["cnt", "cnt", "cnt", "one", "maxc"]);
        if (kind === "cnt") {
          const want = rnd(0, 2); let a, b, c;
          if (want === 1) { a = pick([1, 1, 2, 3, 4, -1]); const r = nz(-6, 6); b = -2 * a * r; c = a * r * r; }
          else { do { a = nz(-5, 5); b = rnd(-10, 10); c = nz(-15, 15); } while (Math.sign(b * b - 4 * a * c) !== (want === 2 ? 1 : -1)); }
          const D = b * b - 4 * a * c, n = D > 0 ? 2 : D === 0 ? 1 : 0;
          return { text: `${eq(a, b, c)}. Tənliyin neçə kökü var?`, answer: n, show: String(n), tol: 0.01,
            solution: `${Dtxt(a, b, c)}. ${D > 0 ? "D > 0 — iki kök." : D === 0 ? "D = 0 — bir kök (iki bərabər kök)." : "D < 0 — kök yoxdur, cavab 0."}` };
        }
        if (kind === "one") {
          const form = pick(["c", "a"]);
          if (form === "c") {        // x² + bx + c, b even: c = b²/4
            const k = nz(-9, 9), b = 2 * k;
            return { text: `c-nin hansı qiymətində ${poly([[1, "x²"], [b, "x"]])} + c = 0 tənliyinin yalnız bir kökü var?`, answer: k * k, show: String(k * k), tol: 0.01,
              solution: `Bir kök — D = 0: ${P(b)}² − 4c = 0 → ${b * b} = 4c → c = ${k * k}. Onda tənlik (x ${k < 0 ? "−" : "+"} ${Math.abs(k)})² = 0.` };
          }
          let b, c, a; do { c = nz(-9, 9); b = nz(-12, 12); a = b * b / (4 * c); } while (!Number.isInteger(a) || Math.abs(a) > 12);
          return { text: `a-nın hansı qiymətində ax² ${b < 0 ? "−" : "+"} ${Math.abs(b) === 1 ? "" : Math.abs(b)}x ${c < 0 ? "−" : "+"} ${Math.abs(c)} = 0 kvadrat tənliyinin yalnız bir kökü var?`, answer: a, show: S(a), tol: 0.01,
            solution: `D = 0: ${P(b)}² − 4·a·${P(c)} = 0 → ${b * b} ${c < 0 ? "+" : "−"} ${Math.abs(4 * c)}a = 0 → a = ${S(a)}.` };
        }
        // largest integer c with two roots: x² + bx + c, D = b² − 4c > 0 → c < b²/4
        const b = nz(-11, 11), lim = b * b / 4, ans = Math.ceil(lim) - 1;
        return { text: `c-nin hansı ən böyük tam qiymətində ${poly([[1, "x²"], [b, "x"]])} + c = 0 tənliyinin iki müxtəlif kökü var?`, answer: ans, show: S(ans), tol: 0.01,
          solution: `İki kök — D > 0: ${b * b} − 4c > 0 → c < ${frac(b * b, 4)}${Number.isInteger(lim) ? "" : ` = ${String(lim).replace(".", ",")}`}. Bərabər ola bilməz (onda D = 0). Ən böyük tam c = ${S(ans)}.` };
      } },
    { id: "dustur", ad: "Köklər düsturu", izah: "x = (−b ± √D)/(2a). Əvvəl D-ni tap, sonra iki kökü ayrı-ayrı hesabla.",
      gen() {
        let a, m, n; do { a = pick([1, 2, 2, 3, 3, 4, 5, 6]); m = nz(-9, 9); n = nz(-7, 7); } while (m === a * n || (a === 1 && Math.abs(m) > 9) || Math.abs(a * n + m) > 20);
        let [A, B, C] = fromRoots(a, m, n); if (Math.random() < .3) { A = -A; B = -B; C = -C; }
        const D = B * B - 4 * A * C, s = Math.sqrt(D);
        const R = [[m / a, frac(m, a)], [n, S(n)]].sort((u, w) => u[0] - w[0]);   // exact roots m/a and n
        const ask = pick(["big", "small", "sum"]);
        const [ans, show] = ask === "big" ? R[1] : ask === "small" ? R[0] : [m / a + n, frac(m + a * n, a)];
        return { text: `${eq(A, B, C)}. ${{ big: "Böyük kökü tap.", small: "Kiçik kökü tap.", sum: "Köklərin cəmini tap." }[ask]}`, answer: ans, show, placeholder: "məs. −3 və ya 2/3",
          solution: `${Dtxt(A, B, C)}, √D = ${s}. x = (${S(-B)} ± ${s})/${2 * A === 1 ? "" : P(2 * A)} → x₁ = ${frac(-B + s, 2 * A)}, x₂ = ${frac(-B - s, 2 * A)}. ${ask === "sum" ? `Cəm: ${show}.` : `${ask === "big" ? "Böyüyü" : "Kiçiyi"}: ${show}.`}` };
      } },
    { id: "cut", ad: "Cüt əmsal: b = 2k", izah: "b cüt olanda: D₁ = k² − ac, x = (−k ± √D₁)/a. Ədədlər kiçik qalır.",
      gen() {
        const kind = pick(["D1", "irr", "irr", "rat"]);
        if (kind === "D1") {
          const a = nz(-5, 5), k = nz(-9, 9), c = nz(-12, 12), D1 = k * k - a * c;
          return { text: `${eq(a, 2 * k, c)}. D₁ = k² − ac kəmiyyətini tap.`, answer: D1, show: S(D1), tol: 0.01,
            solution: `b = ${S(2 * k)} = 2·${P(k)}, deməli k = ${S(k)}. D₁ = k² − ac = ${P(k)}² − ${P(a)}·${P(c)} = ${k * k} ${a * c < 0 ? "+" : "−"} ${Math.abs(a * c)} = ${S(D1)}. (Yoxla: D = 4D₁ = ${4 * D1}.)` };
        }
        if (kind === "irr") {        // x² + 2kx + c, D₁ = k² − c not a square
          let k, c, d; do { k = nz(-7, 7); c = rnd(-20, 20); d = k * k - c; } while (d <= 0 || isSq(d));
          const big = Math.random() < .5, sd = surdS(d), r = big ? -k + Math.sqrt(d) : -k - Math.sqrt(d);
          const show = S(-k) + (big ? " + " : " − ") + sd;
          return { text: `${eq(1, 2 * k, c)}. ${big ? "Böyük" : "Kiçik"} kökü tap.`, answer: r, show, placeholder: "məs. 3 + √2",
            solution: `k = ${S(k)}. D₁ = k² − ac = ${k * k} ${c < 0 ? "+" : "−"} ${Math.abs(c)} = ${d}. x = ${S(-k)} ± √${d}${sd !== "√" + d ? ` = ${S(-k)} ± ${sd}` : ""}. ${big ? "Böyüyü" : "Kiçiyi"}: ${show}.` };
        }
        let a, m, n, A, B, C; do { a = rnd(2, 5); m = nz(-9, 9); n = nz(-6, 6); [A, B, C] = fromRoots(a, m, n); } while (m === a * n || B % 2 || m % a === 0 || Math.abs(B) > 24);
        const k = B / 2, D1 = k * k - A * C, s = Math.sqrt(D1), big = Math.random() < .5;
        const R = [[m / a, frac(m, a)], [n, S(n)]].sort((u, w) => u[0] - w[0]), [ans, show] = big ? R[1] : R[0];
        return { text: `${eq(A, B, C)}. ${big ? "Böyük" : "Kiçik"} kökü tap.`, answer: ans, show, placeholder: "məs. 2/3",
          solution: `k = ${S(k)}. D₁ = k² − ac = ${k * k} − ${P(A)}·${P(C)} = ${D1}, √D₁ = ${s}. x = (${S(-k)} ± ${s})/${A} → ${frac(-k + s, A)} və ${frac(-k - s, A)}. ${big ? "Böyüyü" : "Kiçiyi"}: ${show}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let a, m, n, A, B, C; do { a = rnd(1, 3); m = nz(-8, 8); n = nz(-6, 6); [A, B, C] = fromRoots(a, m, n); } while (m === a * n || Math.abs(B) > 15 || !C);
        const D = B * B - 4 * A * C, s = Math.sqrt(D), r1 = frac(-B + s, 2 * A), r2 = frac(-B - s, 2 * A);
        const steps = [
          `1) ${Dtxt(A, B, C)}.`,
          `2) √D = ${s}, x = (${S(-B)} ± ${s})/${2 * A}.`,
          `3) x₁ = ${r1}, x₂ = ${r2}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) { const W = B * B + 4 * A * C; steps[0] = `1) D = b² − 4ac = ${P(B)}² − 4·${P(A)}·${P(C)} = ${B * B} ${4 * A * C < 0 ? "−" : "+"} ${Math.abs(4 * A * C)} = ${S(W)}.`; }
        if (bad === 1) steps[1] = pick([`2) √D = ${s}, x = (${S(B)} ± ${s})/${2 * A}.`, `2) √D = ${s}, x = (${S(-B)} ± ${s})/${A}.`]);
        if (bad === 2) steps[2] = `3) x₁ = ${frac(-B + s, 2 * A)}, x₂ = ${frac(B + s, 2 * A) === r1 ? frac(-B - s - 2 * A, 2 * A) : frac(B + s, 2 * A)}.`;
        const text = h("div", {}, h("p", {}, `Tənlik: ${eq(A, B, C)}.`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st.slice(3)))));
        const why = [`1-ci addım: 4ac = 4·${P(A)}·${P(C)} = ${S(4 * A * C)}, ona görə D = ${B * B} ${4 * A * C < 0 ? "+" : "−"} ${Math.abs(4 * A * C)} = ${D}.`,
          `2-ci addım: düstur x = (−b ± √D)/(2a) = (${S(-B)} ± ${s})/${2 * A} olmalıdır.`,
          `3-cü addım: x₂ = (${S(-B)} − ${s})/${2 * A} = ${r2}. Hesab səhvdir.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Məsələ → kvadrat tənlik. Mənfi kök (mənfi uzunluq, mənfi vaxt, mənfi say) atılır.",
      gen() {
        const kind = pick(["duz", "ard", "top", "el"]);
        if (kind === "duz") {
          const w = rnd(2, 15), d = rnd(1, 9), A = w * (w + d), ask = pick(["en", "uz", "per"]);
          const ans = ask === "en" ? w : ask === "uz" ? w + d : 2 * (2 * w + d);
          return { text: `Düzbucaqlının uzunluğu enindən ${d} m çoxdur, sahəsi ${A} m². ${{ en: "Eni neçə metrdir?", uz: "Uzunluğu neçə metrdir?", per: "Perimetri neçə metrdir?" }[ask]}`, answer: ans, unit: "m", show: String(ans), tol: 0.01,
            solution: `En x, uzunluq x + ${d}: x(x + ${d}) = ${A} → x² + ${d === 1 ? "" : d}x − ${A} = 0. D = ${d * d + 4 * A} = ${2 * w + d}², x = (−${d} ± ${2 * w + d})/2 → x = ${w} (mənfi kök atılır). En ${w} m, uzunluq ${w + d} m${ask === "per" ? `, perimetr 2·(${w} + ${w + d}) = ${ans} m` : ""}.` };
        }
        if (kind === "ard") {
          const n = rnd(3, 25), step = pick([1, 2]), Pr = n * (n + step), big = Math.random() < .5;
          return { text: `Ardıcıl iki ${step === 2 ? (n % 2 ? "tək" : "cüt") : "natural"} ədədin hasili ${Pr} edir. ${big ? "Böyük" : "Kiçik"} ədədi tap.`, answer: big ? n + step : n, show: String(big ? n + step : n), tol: 0.01,
            solution: `Kiçiyi x, böyüyü x + ${step}: x(x + ${step}) = ${Pr} → x² + ${step === 1 ? "" : step}x − ${Pr} = 0. D = ${step * step + 4 * Pr} = ${2 * n + step}² → x = ${n} (mənfi kök natural deyil). Ədədlər ${n} və ${n + step}.` };
        }
        if (kind === "top") {        // h = v t − 5t², h = H at t1 < t2
          const t1 = rnd(1, 3), t2 = t1 + rnd(1, 4), v = 5 * (t1 + t2), H = 5 * t1 * t2, late = Math.random() < .35;
          return { text: `Top yerdən şaquli yuxarı ${v} m/s sürətlə atıldı. Onun t saniyədən sonra hündürlüyü h = ${v}t − 5t² (metr) düsturu ilə verilir. Top ${H} m hündürlükdə ${late ? "ikinci dəfə (enərkən)" : "ilk dəfə"} neçə saniyədən sonra olacaq?`, answer: late ? t2 : t1, unit: "s", show: String(late ? t2 : t1), tol: 0.01,
            solution: `${v}t − 5t² = ${H} → 5t² − ${v}t + ${H} = 0 → t² − ${t1 + t2}t + ${t1 * t2} = 0. D = ${(t1 + t2) ** 2} − ${4 * t1 * t2} = ${(t2 - t1) ** 2} → t = ${t1} və t = ${t2}. Qalxanda ${t1} s, enəndə ${t2} s. Cavab: ${late ? t2 : t1} s.` };
        }
        const n = rnd(4, 20), H = n * (n - 1) / 2;
        return { text: `Görüşdə hər iştirakçı qalanların hər biri ilə bir dəfə əl sıxdı. Cəmi ${H} əl sıxma oldu. Neçə iştirakçı var idi?`, answer: n, show: String(n), tol: 0.01,
          solution: `x nəfər: hər biri x − 1 nəfərlə, amma hər əl sıxma iki dəfə sayılır: x(x − 1)/2 = ${H} → x² − x − ${2 * H} = 0. D = 1 + ${8 * H} = ${2 * n - 1}² → x = (1 + ${2 * n - 1})/2 = ${n} (mənfi kök atılır).` };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (losing the root 0, forgetting ±, sign of b, dividing by a instead of 2a, 4ac → ac, ...).
  const { ae, again } = Oyun;
  const D = x => { const r = Math.round(x * 1e6) / 1e6; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  const ID = x => x;
  // a pair of roots as an option: "−3; 1/2" (ascending); u, v = [value, text]
  const pair = (u, v) => (u[0] <= v[0] ? [u, v] : [v, u]).map(z => z[1]).join("; ");
  const fr = (p, q) => [p / q, frac(p, q)];
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. incomplete equation: ax² + bx = 0 (root 0 lost by dividing by x) or ax² − c = 0 (± forgotten)
    { tip: "qapali", gen: () => again(() => {
      if (Math.random() < .55) {
        const a = nz(-6, 6), b = nz(-15, 15); if (Math.abs(a) < 2 || Math.abs(a) === Math.abs(b)) return null;
        const R = pair([0, "0"], fr(-b, a));
        const w = [frac(-b, a), pair([0, "0"], fr(b, a)), pair([0, "0"], [-b, S(-b)]), pair([0, "0"], fr(-a, b))];
        return mc(ae(R, w, ID), { text: `${eq(a, b, 0)} tənliyinin köklərini tapın.`,
          solution: `x-i mötərizə xaricinə çıxarırıq: x(${poly([[a, "x"], [b, ""]])}) = 0 → x = 0 və ya x = ${frac(-b, a)}. Cavab: ${R}. Tələlər: tənliyi x-ə bölüb x = 0 kökünü itirmək (${frac(-b, a)}), b-nin işarəsi (${frac(b, a)}), a-ya bölməmək (${S(-b)}), tərs bölmək (${frac(-a, b)}).` });
      }
      const a = pick([4, 9]), r = rnd(2, 9), c = a * r * r, q = Math.sqrt(a);
      const R = pair([-r, S(-r)], [r, S(r)]);
      const w = [String(r), pair([-r * r, S(-r * r)], [r * r, S(r * r)]), "kök yoxdur", pair([-q * r, S(-q * r)], [q * r, S(q * r)])];
      return mc(ae(R, w, ID), { text: `${eq(a, 0, -c)} tənliyinin köklərini tapın.`,
        solution: `${a}x² = ${c} → x² = ${r * r} → x = ±${r}. Cavab: ${R}. Tələlər: mənfi kökü unutmaq (${r}), kvadrat kök almamaq (±${r * r}), sərbəst həddi sağa keçirəndə işarəni dəyişməmək ("x² = −${r * r}, kök yoxdur"), əvvəlcə ${a === 4 ? "4-ə" : "9-a"} bölmədən √${c} götürmək (±${q * r}).` });
    }) },
    // 2. discriminant; b negative and even (the D₁ trap)
    { tip: "qapali", gen: () => again(() => {
      const a = nz(-5, 5), k = -rnd(1, 8), b = 2 * k, c = nz(-10, 10), R = b * b - 4 * a * c;
      const w = [b * b + 4 * a * c, -b * b - 4 * a * c, k * k - a * c, b * b - a * c];
      return mc(ae(R, w), { text: `${eq(a, b, c)} tənliyinin diskriminantını tapın.`,
        solution: `a = ${S(a)}, b = ${S(b)}, c = ${S(c)}. ${Dtxt(a, b, c)}. Tələlər: 4ac-nin işarəsi (${S(b * b + 4 * a * c)}), (${S(b)})² yerinə −${b * b} yazmaq (${S(-b * b - 4 * a * c)}), D₁ = k² − ac-ni D kimi yazmaq (${S(k * k - a * c)}), 4-ü unutmaq (${S(b * b - a * c)}).` });
    }) },
    // 3. root formula: wrong options from −b → b, 2a → a, 2a → 2, √D → D
    { tip: "qapali", gen: () => again(() => {
      const a = rnd(2, 5), m = nz(-9, 9), n = nz(-6, 6); if (m === a * n || m % a === 0) return null;
      const [A, B, C] = fromRoots(a, m, n); if (Math.abs(B) > 20 || !C) return null;
      const Dd = B * B - 4 * A * C, s = Math.sqrt(Dd);
      const two = (p, q, den) => pair(fr(p, den), fr(q, den));
      const R = two(-B + s, -B - s, 2 * A);
      const w = [two(B + s, B - s, 2 * A), two(-B + s, -B - s, A), two(-B + s, -B - s, 2), two(-B + Dd, -B - Dd, 2 * A)];
      return mc(ae(R, w, ID), { text: `${eq(A, B, C)} tənliyinin köklərini tapın.`,
        solution: `${Dtxt(A, B, C)}, √D = ${s}. x = (${S(-B)} ± ${s})/${2 * A} → ${R}. Tələlər: −b yerinə b (${w[0]}), 2a yerinə a-ya bölmək (${w[1]}), a-nı unudub 2-yə bölmək (${w[2]}), √D yerinə D (${w[3]}).` });
    }) },
    // 4. parameter: exactly one root (D = 0)
    { tip: "qapali", gen: () => again(() => {
      if (Math.random() < .5) {          // a x² + 2at x + c, c = a t²
        const a = pick([3, 5, 6]), t = nz(-5, 5), b = 2 * a * t, R = a * t * t;
        const w = [-R, 4 * R, 2 * R, a * a * t * t];
        return mc(ae(R, w), { text: `c-nin hansı qiymətində ${poly([[a, "x²"], [b, "x"]])} + c = 0 tənliyinin yalnız bir kökü var?`,
          solution: `Bir kök — D = 0: ${P(b)}² − 4·${a}·c = 0 → ${b * b} = ${4 * a}c → c = ${R}. Tələlər: işarə (${S(-R)}), 4-ü unutmaq: b² − ac = 0 (${4 * R}), 4ac yerinə 2ac (${2 * R}), a-nı unutmaq: c = b²/4 (${a * a * t * t}).` });
      }
      const r = rnd(2, 9), c = r * r;      // x² + px + r²
      const R = `−${2 * r}; ${2 * r}`;
      const w = [String(2 * r), `−${r}; ${r}`, String(4 * c), `−${2 * c}; ${2 * c}`];
      return mc(ae(R, w, ID), { text: `p-nin hansı qiymətlərində x² + px + ${c} = 0 tənliyinin yalnız bir kökü var?`,
        solution: `D = p² − 4·${c} = 0 → p² = ${4 * c} → p = ±${2 * r}. Cavab: ${R}. Tələlər: mənfi qiyməti unutmaq (${2 * r}), 4-ü unutmaq: p² = ${c} (±${r}), kök almamaq (${4 * c}), √${4 * c} yerinə 2·${c} (±${2 * c}).` });
    }) },
    // 5. parameter: no roots / two roots → inequality for c
    { tip: "qapali", gen: () => again(() => {
      const k = nz(-9, 9), b = 2 * k, L = k * k; if (Math.abs(k) < 2) return null;
      const yox = Math.random() < .5, [g, l, ge, le] = yox ? [">", "<", "≥", "≤"] : ["<", ">", "≤", "≥"];
      const R = `c ${g} ${L}`, w = [`c ${l} ${L}`, `c ${ge} ${L}`, `c ${g} ${b * b}`, `c ${g} ${frac(b, 4)}`];
      return mc(ae(R, w, ID), { text: `c-nin hansı qiymətlərində ${poly([[1, "x²"], [b, "x"]])} + c = 0 tənliyinin ${yox ? "kökü yoxdur" : "iki müxtəlif kökü var"}?`,
        solution: `${yox ? "Kök yoxdur — D < 0" : "İki müxtəlif kök — D > 0"}: ${b * b} − 4c ${yox ? "<" : ">"} 0 → 4c ${g} ${b * b} → c ${g} ${L}. Tələlər: bərabərsizliyin istiqaməti (${w[0]}), D = 0-ı daxil etmək (${w[1]}; onda bir kök olur), 4-ə bölməmək (${w[2]}), b-ni kvadrata yüksəltməmək (${w[3]}).` });
    }) },
    // 6. word problem: ball above height H — both roots matter
    { tip: "qapali", gen: () => again(() => {
      const t1 = rnd(1, 5), t2 = t1 + rnd(1, 6), v = 5 * (t1 + t2), H = 5 * t1 * t2, R = t2 - t1;
      const w = [t1, t2, t1 + t2, (t1 + t2) / 2];
      return mc(ae(R, w), { text: `Top yerdən şaquli yuxarı ${v} m/s sürətlə atıldı. Onun t saniyədən sonrakı hündürlüyü h = ${v}t − 5t² (metr) düsturu ilə verilir (hava müqaviməti nəzərə alınmır). Top neçə saniyə ərzində ${H} m-dən yüksəkdə olur?`,
        solution: `${v}t − 5t² = ${H} → t² − ${t1 + t2}t + ${t1 * t2} = 0 → t = ${t1} və t = ${t2}. Top t = ${t1} s anında qalxarkən ${H} m-ə çatır, t = ${t2} s anında enərkən yenə ${H} m-də olur. Aradakı vaxt: ${t2} − ${t1} = ${R} s. Tələlər: köklərdən birini cavab yazmaq (${t1} və ya ${t2}), köklərin cəmi (${t1 + t2}), ən yüksək nöqtəyə çatma anı (${D((t1 + t2) / 2)}).` });
    }) },
    // 7. coded: a root with a decimal value
    { tip: "kod", gen: () => again(() => {
      const a = pick([2, 4, 5]), m = nz(-9, 9), n = nz(-6, 6); if (m % a === 0) return null;
      const [A, B, C] = fromRoots(a, m, n); if (Math.abs(B) > 24 || !C) return null;
      const Dd = B * B - 4 * A * C, s = Math.sqrt(Dd), x1 = m / a, pos = [x1, n].filter(v => v > 0);
      if (!pos.length) return null;
      const one = pos.length === 1, big = one ? x1 > n : Math.random() < .5, x = one ? pos[0] : (big ? Math.max(x1, n) : Math.min(x1, n));
      return { text: `${eq(A, B, C)} tənliyinin ${one ? "müsbət" : big ? "böyük" : "kiçik"} kökünü tapın. Cavabı onluq kəsr şəklində yazın.`,
        answer: x, show: D(x), tol: 1e-6,
        solution: `${Dtxt(A, B, C)}, √D = ${s}. x = (${S(-B)} ± ${s})/${2 * A} → x₁ = ${D(m / a)}, x₂ = ${S(n)}. ${one ? "Müsbət kök" : big ? "Böyüyü" : "Kiçiyi"}: ${D(x)}.` };
    }) },
    // 8. coded: one root is given → coefficient or the other root
    { tip: "kod", gen: () => again(() => {
      if (Math.random() < .5) {
        const a = rnd(1, 3), r = nz(-5, 5), c = nz(-12, 12), p = -(a * r * r + c) / r; if (!Number.isInteger(p) || p <= 0) return null;
        return { text: `${a === 1 ? "" : a}x² + px ${c < 0 ? "−" : "+"} ${Math.abs(c)} = 0 tənliyinin köklərindən biri ${S(r)} ədədidir. p ədədini tapın.`,
          answer: p, show: S(p), tol: 1e-6,
          solution: `x = ${S(r)} tənliyi ödəyir: ${a === 1 ? "" : a + "·"}${P(r)}² + p·${P(r)} ${c < 0 ? "−" : "+"} ${Math.abs(c)} = 0 → ${a * r * r + c} ${r < 0 ? "−" : "+"} ${Math.abs(r) === 1 ? "" : Math.abs(r)}p = 0 → p = ${S(p)}.` };
      }
      const r = nz(-6, 6), s = rnd(1, 8); if (r === s) return null;
      const c = r * s, p = -(r + s);
      return { text: `x² + px ${c < 0 ? "−" : "+"} ${Math.abs(c)} = 0 tənliyinin köklərindən biri ${S(r)} ədədidir. Tənliyin digər kökünü tapın.`,
        answer: s, show: S(s), tol: 1e-6,
        solution: `x = ${S(r)}: ${r * r} ${r < 0 ? "−" : "+"} ${Math.abs(r) === 1 ? "" : Math.abs(r)}p ${c < 0 ? "−" : "+"} ${Math.abs(c)} = 0 → p = ${S(p)}. Tənlik: ${eq(1, p, c)}, D = ${p * p - 4 * c}, kökləri ${S(r)} və ${S(s)}. Digər kök: ${S(s)}.` };
    }) },
    // 9. coded: integer values of the parameter
    { tip: "kod", gen: () => again(() => {
      const kind = pick(["minc", "maxc", "cnt"]), b = nz(-11, 11), L = b * b / 4; if (Math.abs(b) < 3) return null;
      const bx = poly([[1, "x²"], [b, "x"]]);
      if (kind === "minc") { const x = Math.floor(L) + 1;
        return { text: `c-nin hansı ən kiçik tam qiymətində ${bx} + c = 0 tənliyinin kökü yoxdur?`, answer: x, show: S(x), tol: 1e-6,
          solution: `Kök yoxdur — D < 0: ${b * b} − 4c < 0 → c > ${D(L)}. c = ${D(L)} ola bilməz (onda D = 0, bir kök var). Ən kiçik tam c = ${x}.` }; }
      if (kind === "maxc") { const x = Math.ceil(L) - 1;
        return { text: `c-nin hansı ən böyük tam qiymətində ${bx} + c = 0 tənliyinin iki müxtəlif kökü var?`, answer: x, show: S(x), tol: 1e-6,
          solution: `İki müxtəlif kök — D > 0: ${b * b} − 4c > 0 → c < ${D(L)}. Bərabər ola bilməz (onda D = 0). Ən böyük tam c = ${S(x)}.` }; }
      const x = Math.ceil(L) - 1;
      return { text: `c-nin neçə natural qiymətində ${bx} + c = 0 tənliyinin iki müxtəlif kökü var?`, answer: x, show: S(x), tol: 1e-6,
        solution: `D > 0: ${b * b} − 4c > 0 → c < ${D(L)}. Natural c: 1, 2, …, ${x} — cəmi ${x} qiymət.` };
    }) },
    // 10. written: speed problem → quadratic equation, the negative root is rejected
    { tip: "yazili", gen: () => again(() => {
      const v = rnd(8, 18) * 5, d = pick([5, 10, 15, 20, 30]), t = pick([1, 2, 3]), Sd = v * (v + d) * t / d;
      if (!Number.isInteger(Sd) || Sd < 60 || Sd > 500) return null;
      const q = Sd * d / t, Dd = d * d + 4 * q, s = 2 * v + d; const ik = Math.random() < .5, ans = ik ? v + d : v;
      return { text: `İki şəhər arasındakı məsafə ${Sd} km-dir. İkinci avtomobilin sürəti birincinin sürətindən ${d} km/saat çoxdur, ona görə o, bu yolu birincidən ${t} saat tez qət edir. ${ik ? "İkinci" : "Birinci"} avtomobilin sürətini tapın (km/saat). Avtomobillər sabit sürətlə hərəkət edir.`,
        answer: ans, show: String(ans), tol: 1e-6,
        solution: `1) Birincinin sürəti x km/saat, ikincinin x + ${d}. Vaxtlar: ${Sd}/x və ${Sd}/(x + ${d}). 2) ${Sd}/x − ${Sd}/(x + ${d}) = ${t} → ${Sd}·${d} = ${t}·x(x + ${d}) → x² + ${d}x − ${q} = 0. 3) D = ${d * d} + ${4 * q} = ${Dd} = ${s}², x = (−${d} ± ${s})/2 → x = ${v} (x = ${S(-v - d)} atılır — sürət mənfi ola bilməz). 4) Yoxlama: ${Sd}/${v} − ${Sd}/${v + d} = ${D(Sd / v)} − ${D(Sd / (v + d))} = ${t} ✓. Cavab: ${ik ? `ikincinin sürəti ${v} + ${d} = ${ans}` : ans} km/saat.` };
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
      key: "kvadrat-tenlik", title: "Kvadrat tənlik, diskriminant", fenn: "riyaziyyat", link: "dersler/kvadrat-tenlik.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 2/3, kök 3 + √2 (√ yerinə sqrt da olar). Kök yoxdursa və köklərin sayı soruşulursa — 0.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["natamam", "D", "say", "say", "dustur", "dustur", "cut", "cut", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/kvadrat-tenlik.html")) b.push("dersler/kvadrat-tenlik.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
