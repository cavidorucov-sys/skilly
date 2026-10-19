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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "kvadrat-tenlik", title: "Kvadrat tənlik, diskriminant", fenn: "riyaziyyat", link: "dersler/kvadrat-tenlik.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 2/3, kök 3 + √2 (√ yerinə sqrt da olar). Kök yoxdursa və köklərin sayı soruşulursa — 0.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["natamam", "D", "say", "say", "dustur", "dustur", "cut", "cut", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/kvadrat-tenlik.html")) b.push("dersler/kvadrat-tenlik.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
