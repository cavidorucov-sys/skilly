// Vuruqlara ayırma — mastery game levels (common factor, grouping, formulas, quadratic trinomial, completing the square) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);                       // number with a real minus sign
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);                 // negative number in brackets
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  // polynomial from [coef, "x²"|"x"|""] terms: [[1,"x²"],[-5,"x"],[6,""]] → "x² − 5x + 6"
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const lin = (a, b, v = "x") => poly([[a, v], [b, ""]]);              // ax + b
  const X = n => ["", "x", "x²", "x³", "x⁴"][n];
  const distinct = (n, a, b, not = []) => { const out = []; while (out.length < n) { const v = rnd(a, b); if (!out.includes(v) && !not.includes(v)) out.push(v); } return out; };
  const coprime = (a1, a2, b1, b2) => { for (;;) { const a = rnd(a1, a2), b = rnd(b1, b2); if (gcd(a, b) === 1) return [a, b]; } };
  const pm = n => n < 0 ? " − " + (-n) : " + " + n;                    // " + 5" / " − 5"

  const levels = [
    { id: "ortaq", ad: "Ortaq vuruq", izah: "Əmsalların ƏBOB-u və dəyişənin ən kiçik qüvvəti mötərizə xaricinə çıxır.",
      gen() {
        const kind = pick(["one", "one", "two", "num"]);
        if (kind === "num") {
          const a = rnd(12, 99);
          if (Math.random() < .5) {
            const T = pick([100, 100, 1000]), b = rnd(11, T === 100 ? 89 : 989), c = T - b;
            return { text: `Hesabla: ${a}·${b} + ${a}·${c}.`, answer: a * T, show: String(a * T), tol: 0.01,
              solution: `Ortaq vuruq ${a}: ${a}·(${b} + ${c}) = ${a}·${T} = ${a * T}.` };
          }
          const D = pick([10, 20, 100]), b = rnd(D + 1, D + 89), c = b - D;
          return { text: `Hesabla: ${a}·${b} − ${a}·${c}.`, answer: a * D, show: String(a * D), tol: 0.01,
            solution: `Ortaq vuruq ${a}: ${a}·(${b} − ${c}) = ${a}·${D} = ${a * D}.` };
        }
        const g = rnd(2, 9), [a, b] = coprime(1, 9, 1, 9), s = pick([-1, 1]);
        if (kind === "one") {
          const m = rnd(1, 3), expr = poly([[g * a, X(m + 1)], [s * g * b, X(m)]]), br = lin(a, s * b), out = g + X(m);
          const sol = `ƏBOB(${g * a}; ${g * b}) = ${g}, x-in ən kiçik qüvvəti ${X(m)}. ${expr} = ${out}(${br}).`;
          if (Math.random() < .4)
            return { text: `${expr} ifadəsində ən böyük ortaq vuruğu (müsbət əmsallı) mötərizə xaricinə çıxar. Xaricdəki birhədlinin əmsalı neçədir?`, answer: g, show: String(g), tol: 0.01, solution: sol + ` Əmsal: ${g}.` };
          const t = rnd(2, 6), v = a * t + s * b;
          return { text: `${expr} ifadəsində ən böyük ortaq vuruğu (müsbət əmsallı) mötərizə xaricinə çıxar. Mötərizədə qalan ifadənin x = ${t} olduqda qiymətini tap.`, answer: v, show: S(v), tol: 0.01,
            solution: sol + ` x = ${t}: ${a === 1 ? "" : a + "·"}${t}${pm(s * b)} = ${S(v)}.` };
        }
        const expr = poly([[g * a, "x²y"], [s * g * b, "xy²"]]), br = poly([[a, "x"], [s * b, "y"]]), t = rnd(1, 5), u = rnd(1, 5), v = a * t + s * b * u;
        return { text: `${expr} ifadəsində ən böyük ortaq vuruğu (müsbət əmsallı) mötərizə xaricinə çıxar. Mötərizədə qalan ifadənin x = ${t}, y = ${u} olduqda qiymətini tap.`, answer: v, show: S(v), tol: 0.01,
          solution: `Ortaq vuruq ${g}xy: ${expr} = ${g}xy(${br}). x = ${t}, y = ${u}: ${a === 1 ? "" : a + "·"}${t}${pm(s * b)}·${u} = ${S(v)}.` };
      } },
    { id: "qrup", ad: "Qruplaşdırma", izah: "Dörd həddi cüt-cüt qruplaşdır, hər cütdən ortaq vuruq çıxar — eyni mötərizə alınmalıdır.",
      gen() {
        const kind = pick(["xy", "xy", "cub", "num"]);
        if (kind === "num") {
          const a = rnd(2, 8), b = 10 - a, T = pick([30, 40, 50, 100]), c = rnd(11, T - 11), d = T - c;
          const v = (a + b) * T;
          return { text: `Hesabla: ${a}·${c} + ${a}·${d} + ${b}·${c} + ${b}·${d}.`, answer: v, show: String(v), tol: 0.01,
            solution: `${a}·(${c} + ${d}) + ${b}·(${c} + ${d}) = (${c} + ${d})(${a} + ${b}) = ${T}·10 = ${v}.` };
        }
        if (kind === "cub") {
          const p = pick([-1, 1]) * rnd(1, 9), q = rnd(1, 9);
          const expr = poly([[1, "x³"], [p, "x²"], [q, "x"], [p * q, ""]]), xp = lin(1, p);
          return { text: `${expr} ifadəsini (x + A)(x² + B) şəklində vuruqlara ayır. A + B = ?`, answer: p + q, show: S(p + q), tol: 0.01,
            solution: `x²(${xp})${pm(q)}(${xp}) = (${xp})(x² + ${q}). A = ${S(p)}, B = ${q}, A + B = ${S(p + q)}.` };
        }
        const a = rnd(1, 5), b = pick([-1, 1]) * rnd(1, 9), c = pick([-1, 1]) * rnd(1, 9);
        const ts = [[a, "xy"], [a * c, "x"], [b, "y"], [b * c, ""]];
        if (Math.random() < .5) { const t = ts[1]; ts[1] = ts[2]; ts[2] = t; }
        const yc = lin(1, c, "y"), ax = a === 1 ? "x" : a + "x";
        return { text: `${poly(ts)} ifadəsini (mx + n)(y + k) şəklində vuruqlara ayır (m > 0). m + n + k = ?`, answer: a + b + c, show: S(a + b + c), tol: 0.01,
          solution: `Qruplaşdır: ${ax}(${yc}) ${b < 0 ? "−" : "+"} ${Math.abs(b)}(${yc}) = (${lin(a, b)})(${yc}). m = ${a}, n = ${S(b)}, k = ${S(c)}; cəm ${S(a + b + c)}.` };
      } },
    { id: "duster", ad: "Müxtəsər vurma düsturları", izah: "a² − b², (a ± b)², a³ ± b³ — ifadəni düsturun formasında tanı.",
      gen() {
        const kind = pick(["diff", "sq", "dsq", "cube"]);
        if (kind === "diff") {
          const s = pick([100, 100, 60, 80, 200]), d = rnd(1, s / 2 - 5), a = s / 2 + d, b = s / 2 - d, v = a * a - b * b;
          return { text: `Kalkulyatorsuz hesabla: ${a}² − ${b}².`, answer: v, show: String(v), tol: 0.01,
            solution: `a² − b² = (a − b)(a + b): (${a} − ${b})(${a} + ${b}) = ${a - b}·${s} = ${v}.` };
        }
        if (kind === "sq") {
          const [p, q] = coprime(1, 5, 1, 9), sg = pick([-1, 1]), sum = Math.random() < .6;
          const expr = poly([[p * p, "x²"], [sg * 2 * p * q, "x"], [q * q, ""]]), px = lin(p, 0);
          return { text: `${expr} ifadəsini (mx ${sg < 0 ? "−" : "+"} n)² şəklində yaz (m, n > 0). ${sum ? "m + n" : "m·n"} = ?`, answer: sum ? p + q : p * q, show: String(sum ? p + q : p * q), tol: 0.01,
            solution: `${p * p === 1 ? "x²" : p * p + "x²"} = (${px})², ${q * q} = ${q}², orta hədd 2·${px}·${q} = ${2 * p * q === 1 ? "" : 2 * p * q}x ✓. Deməli ${expr} = (${lin(p, sg * q)})²; m = ${p}, n = ${q}.` };
        }
        if (kind === "dsq") {
          let p, q; do { [p, q] = coprime(1, 6, 1, 9); } while (p === 1 && q === 1);
          const expr = poly([[p * p, "x²"], [-q * q, ""]]);
          return { text: `${expr} ifadəsini (mx − n)(mx + n) şəklində yaz (m, n > 0). m + n = ?`, answer: p + q, show: String(p + q), tol: 0.01,
            solution: `${expr} = (${lin(p, 0)})² − ${q}² = (${lin(p, -q)})(${lin(p, q)}). m = ${p}, n = ${q}; cəm ${p + q}.` };
        }
        const q = rnd(1, 5), minus = Math.random() < .5;
        if (minus)
          return { text: `x³ − ${q ** 3} = (x − a)(x² + bx + c). a + b + c = ?`, answer: 2 * q + q * q, show: String(2 * q + q * q), tol: 0.01,
            solution: `x³ − ${q ** 3} = x³ − ${q}³ = (x − ${q})(${poly([[1, "x²"], [q, "x"], [q * q, ""]])}). a = ${q}, b = ${q}, c = ${q * q}; cəm ${2 * q + q * q}.` };
        return { text: `x³ + ${q ** 3} = (x + a)(x² + bx + c). a + b + c = ?`, answer: q * q, show: String(q * q), tol: 0.01,
          solution: `x³ + ${q ** 3} = x³ + ${q}³ = (x + ${q})(${poly([[1, "x²"], [-q, "x"], [q * q, ""]])}). a = ${q}, b = −${q}, c = ${q * q}; cəm ${q * q}.` };
      } },
    { id: "ucheddli", ad: "Kvadrat üçhədli", izah: "ax² + bx + c = a(x − x₁)(x − x₂): əvvəl kökləri tap (Viyet və ya D), sonra yaz.",
      gen() {
        const kind = pick(["other", "other", "mn", "mn", "ab"]);
        if (kind === "mn") {
          const m = pick([2, 3, 5]); let p; do { p = pick([-1, 1]) * rnd(1, 9); } while (p % m === 0);
          const r = pick([-1, 1]) * rnd(1, 6), b = -(m * r + p), c = p * r, D = b * b - 4 * m * c;
          const expr = poly([[m, "x²"], [b, "x"], [c, ""]]);
          return { text: `${expr} üçhədlisini (mx + n)(x + k) şəklində vuruqlara ayır (m, n, k — tam ədədlər, m > 0). m + n + k = ?`, answer: m - p - r, show: S(m - p - r), tol: 0.01,
            solution: `D = ${P(b)}² − 4·${m}·${P(c)} = ${D} = ${Math.abs(m * r - p)}². Köklər: x₁ = ${frac(p, m)}, x₂ = ${S(r)}. ${expr} = ${m}(x ${p < 0 ? "+" : "−"} ${frac(Math.abs(p), m)})(${lin(1, -r)}) = (${lin(m, -p)})(${lin(1, -r)}). m + n + k = ${m} ${p > 0 ? "−" : "+"} ${Math.abs(p)} ${r > 0 ? "−" : "+"} ${Math.abs(r)} = ${S(m - p - r)}.` };
        }
        const [r1, r2] = distinct(2, -9, 9, [0]), expr = poly([[1, "x²"], [-(r1 + r2), "x"], [r1 * r2, ""]]);
        const vi = `Viyet: x₁ + x₂ = ${S(r1 + r2)}, x₁·x₂ = ${S(r1 * r2)} → köklər ${S(Math.min(r1, r2))} və ${S(Math.max(r1, r2))}.`;
        if (kind === "ab") {
          const B = Math.max(-r1, -r2), A = Math.min(-r1, -r2);
          return { text: `${expr} = (x + A)(x + B), A < B. B = ?`, answer: B, show: S(B), tol: 0.01,
            solution: `${vi} ${expr} = (${lin(1, A)})(${lin(1, B)}). A = ${S(A)}, B = ${S(B)}.` };
        }
        const t = rnd(1, 12), v = t - r2;
        return { text: `${expr} üçhədlisini vuruqlara ayır. Vuruqlardan biri: (${lin(1, -r1)}). O biri vuruğun qiymətini x = ${t} üçün tap.`, answer: v, show: S(v), tol: 0.01,
          solution: `${vi} ${expr} = (${lin(1, -r1)})(${lin(1, -r2)}). O biri vuruq ${lin(1, -r2)}; x = ${t}: ${t}${pm(-r2)} = ${S(v)}.` };
      } },
    { id: "tamkv", ad: "Tam kvadratın ayrılması", izah: "x² + 2px + q = (x + p)² + (q − p²). Kvadrat ≥ 0 — ən kiçik qiymət q − p².",
      gen() {
        const p = pick([-1, 1]) * rnd(1, 8); let q; do { q = rnd(-20, 30); } while (q === p * p);
        const expr = poly([[1, "x²"], [2 * p, "x"], [q, ""]]), n = q - p * p, sq = `(${lin(1, p)})²`;
        const steps = `${expr} = (${poly([[1, "x²"], [2 * p, "x"], [p * p, ""]])}) − ${p * p}${pm(q)} = ${sq}${pm(n)}.`;
        const ask = pick(["mn", "min", "at"]);
        if (ask === "mn")
          return { text: `${expr} ifadəsini (x + m)² + n şəklində yaz. m + n = ?`, answer: p + n, show: S(p + n), tol: 0.01, solution: steps + ` m = ${S(p)}, n = ${S(n)}; cəm ${S(p + n)}.` };
        if (ask === "min")
          return { text: `${expr} ifadəsinin ən kiçik qiymətini tap.`, answer: n, show: S(n), tol: 0.01, solution: steps + ` ${sq} ≥ 0, ona görə ən kiçik qiymət: ${S(n)} (x = ${S(-p)} olduqda).` };
        return { text: `x-in hansı qiymətində ${expr} ifadəsi ən kiçik qiymət alır?`, answer: -p, show: S(-p), tol: 0.01, solution: steps + ` ${sq} = 0 olanda ifadə ən kiçikdir: x = ${S(-p)}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let r1, r2; do { [r1, r2] = distinct(2, -9, 9, [0]); } while (r1 === -r2);
          const lo = Math.min(r1, r2), hi = Math.max(r1, r2), b = -(r1 + r2), c = r1 * r2, D = b * b - 4 * c, expr = poly([[1, "x²"], [b, "x"], [c, ""]]);
          task = `${expr} üçhədlisini vuruqlara ayır.`;
          steps = [`D = ${P(b)}² − 4·${P(c)} = ${D}.`, `x₁ = ${S(lo)}, x₂ = ${S(hi)}.`, `${expr} = (${lin(1, -lo)})(${lin(1, -hi)}).`];
          if (bad === 0) steps[0] = `D = ${P(b)}² + 4·${P(c)} = ${b * b + 4 * c}.`;
          if (bad === 1) steps[1] = `x₁ = ${S(-hi)}, x₂ = ${S(-lo)}.`;
          if (bad === 2) steps[2] = `${expr} = (${lin(1, lo)})(${lin(1, hi)}).`;
          why = [`1-ci addım: D = b² − 4ac, toplama yox: ${b * b} − ${P(4 * c)} = ${D}.`,
            `2-ci addım: Viyet — köklərin cəmi ${S(-b)}, hasili ${S(c)}; köklər: ${S(lo)} və ${S(hi)}.`,
            `3-cü addım: kök x₁ olanda vuruq (x − x₁)-dir: (${lin(1, -lo)})(${lin(1, -hi)}).`][bad];
        } else {
          const a = rnd(1, 8), s = pick([-1, 1]), p = s * a; let q; do { q = rnd(-10, 30); } while (q === a * a);
          const expr = poly([[1, "x²"], [2 * p, "x"], [q, ""]]), n = q - a * a;
          task = `${expr} ifadəsinin ən kiçik qiymətini tap.`;
          steps = [`${expr} = (${poly([[1, "x²"], [2 * p, "x"], [a * a, ""]])}) − ${a * a}${pm(q)}.`,
            `= (${lin(1, p)})²${pm(n)}.`, `(${lin(1, p)})² ≥ 0, ən kiçik qiymət ${S(n)} (x = ${S(-p)} olduqda).`];
          if (bad === 0) steps[0] = `${expr} = (${poly([[1, "x²"], [2 * p, "x"], [a * a, ""]])}) + ${a * a}${pm(q)}.`;
          if (bad === 1) steps[1] = `= (${lin(1, -p)})²${pm(n)}.`;
          if (bad === 2) steps[2] = pick([`(${lin(1, p)})² ≥ 0, ən kiçik qiymət ${S(q)} (x = 0 olduqda).`, `(${lin(1, p)})² ≥ 0, ən kiçik qiymət ${S(n)} (x = ${S(p)} olduqda).`]);
          why = [`1-ci addım: ${a * a} əlavə etdiksə, onu çıxmalıyıq: − ${a * a}, + yox.`,
            `2-ci addım: x² ${p < 0 ? "−" : "+"} ${2 * a}x + ${a * a} = (${lin(1, p)})², işarə orta həddin işarəsi ilə eynidir.`,
            `3-cü addım: kvadrat x = ${S(-p)} olanda sıfırdır, onda ifadənin qiyməti ${S(n)} olur.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "hesab", ad: "Həyatdan", izah: "Sahələr və hesablamalar: vuruqlara ayırsan, hesab qısalır.",
      gen() {
        const kind = pick(["bag", "cerceve", "duzb", "alis"]);
        if (kind === "bag") {
          const a = rnd(20, 99), b = rnd(1, 9), v = a * a - (a - b) * (a - b);
          return { text: `Kvadrat bağın tərəfi ${a} m idi. Hər tərəfi ${b} m qısaldıldı (yenə kvadrat qaldı). Bağın sahəsi neçə m² azaldı?`, answer: v, unit: "m²", show: String(v), tol: 0.01,
            solution: `${a}² − ${a - b}² = (${a} − ${a - b})(${a} + ${a - b}) = ${b}·${2 * a - b} = ${v} m².` };
        }
        if (kind === "cerceve") {
          const s = pick([100, 100, 80, 60]), d = rnd(1, 9), B = s / 2 + d, A = s / 2 - d, v = B * B - A * A;
          return { text: `Kvadrat şəklin tərəfi ${A} sm-dir. Çərçivə ilə birlikdə tərəf ${B} sm olur. Çərçivənin sahəsi neçə sm²-dir?`, answer: v, unit: "sm²", show: String(v), tol: 0.01,
            solution: `${B}² − ${A}² = (${B} − ${A})(${B} + ${A}) = ${B - A}·${s} = ${v} sm².` };
        }
        if (kind === "duzb") {
          const [p, q] = distinct(2, 1, 9), t = rnd(3, 15), expr = poly([[1, "x²"], [p + q, "x"], [p * q, ""]]), v = 2 * (2 * t + p + q);
          return { text: `Düzbucaqlının sahəsi (${expr}) m², eni (x + ${p}) m-dir. x = ${t} olduqda düzbucaqlının perimetri neçə m-dir?`, answer: v, unit: "m", show: String(v), tol: 0.01,
            solution: `${expr} = (x + ${p})(x + ${q}) — uzunluq x + ${q}. x = ${t}: tərəflər ${t + p} və ${t + q}; P = 2·(${t + p} + ${t + q}) = ${v} m.` };
        }
        const pr = rnd(12, 49), a = rnd(11, 89), b = 100 - a, v = pr * 100;
        return { text: `Məktəb bir kitabdan ${a} ədəd, sonra eyni kitabdan daha ${b} ədəd aldı. Bir kitab ${pr} manatdır. Cəmi neçə manat ödənildi?`, answer: v, unit: "manat", show: String(v), tol: 0.01,
          solution: `${pr}·${a} + ${pr}·${b} = ${pr}·(${a} + ${b}) = ${pr}·100 = ${v} manat.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "vuruqlara-ayirma", title: "Vuruqlara ayırma", fenn: "riyaziyyat", link: "dersler/vuruqlara-ayirma.html",
      format: "Cavab ədəddir: tam 12, mənfi −3, kəsr 5/2 (onluq 2.5 də olar). Vuruqlara ayırmanı kağızda yaz, soruşulan ədədi cavab qutusuna.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ortaq", "qrup", "duster", "duster", "ucheddli", "ucheddli", "ucheddli", "tamkv", "hesab", "hesab"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/vuruqlara-ayirma.html")) b.push("dersler/vuruqlara-ayirma.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
