// Bərabərsizliklərin isbatı, orta qiymətlər (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nz = (a, b) => { let v = 0; while (!v) v = rnd(a, b); return v; };
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const B = n => n < 0 ? "(" + S(n) + ")" : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const sg = n => n < 0 ? " − " + (-n) : " + " + n;
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = n => String(n).split("").map(d => SUP[+d]).join("");
  const xp = e => e === 0 ? "" : e === 1 ? "x" : "x" + sup(e);
  const poly = ts => { let o = ""; for (const [c, e] of ts) { if (!c) continue; const a = Math.abs(c), body = e ? (a === 1 ? xp(e) : a + xp(e)) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const arr = cs => poly(cs.map((c, i) => [c, cs.length - 1 - i]));
  const ax = a => a === 1 ? "x" : a + "x";                                  // 3x, x
  const sq = h0 => h0 === 0 ? "x²" : "(x " + (h0 < 0 ? "+ " : "− ") + Math.abs(h0) + ")²";
  const root = n => Math.round(Math.sqrt(n));

  // pairs (v1, v2) of speeds whose harmonic mean is an integer
  const speeds = []; for (let a = 10; a <= 90; a += 5) for (let b = a + 5; b <= 100; b += 5) if ((2 * a * b) % (a + b) === 0) speeds.push([a, b]);

  const levels = [
    { id: "kvadrat", ad: "Tam kvadrat: min / max", izah: "ax² + bx + c = a(x − h)² + k. a > 0: ən kiçik qiymət k, x = h-da. a < 0: ən böyük qiymət k, x = h-da.",
      gen() {
        const a = pick([1, 1, 2, 3]), s = pick([1, -1]), h0 = nz(-5, 5), k = rnd(-9, 9), A = s * a;
        const cs = [A, -2 * A * h0, A * h0 * h0 + k], ask = pick(["val", "val", "x"]);
        const kind = s > 0 ? "kiçik" : "böyük";
        const ans = ask === "val" ? k : h0;
        return { text: `${arr(cs)} ifadəsinin ən ${kind} qiymətini ${ask === "val" ? "tap." : "hansı x-də alır? x = ?"}`, answer: ans, show: S(ans), tol: 0.01,
          solution: `Tam kvadrat ayır: ${arr(cs)} = ${A === 1 ? "" : A === -1 ? "−" : S(A)}${sq(h0)}${sg(k)}. ${s > 0 ? "Kvadrat ≥ 0, ona görə ifadə ≥ " + S(k) : "Kvadrat ≥ 0 və əmsal mənfidir, ona görə ifadə ≤ " + S(k)}. Bərabərlik x = ${S(h0)} olduqda. ${ask === "val" ? "Ən " + kind + " qiymət: " + S(k) + "." : "Cavab: x = " + S(h0) + "."}` };
      } },
    { id: "xk", ad: "x + k/x tipli ifadələr", izah: "x > 0: x + k/x ≥ 2√k, bərabərlik x = √k. Sürüşmə: x − c = t. x < 0 olduqda x + k/x ≤ −2√k (maksimum).",
      gen() {
        const t = pick(["A", "A", "B", "C", "E"]);
        if (t === "A") { const m = rnd(2, 9); return { text: `x > 0 olduqda x + ${m * m}/x ifadəsinin ən kiçik qiymətini tap.`, answer: 2 * m, show: String(2 * m), tol: 0.01, solution: `AM-GM: x + ${m * m}/x ≥ 2√(x · ${m * m}/x) = 2√${m * m} = ${2 * m}. Bərabərlik x = ${m * m}/x → x = ${m}-də alınır.` }; }
        if (t === "B") { const m = rnd(1, 6), c = rnd(1, 5); return { text: `x > ${c} olduqda x + ${m * m}/(x − ${c}) ifadəsinin ən kiçik qiymətini tap.`, answer: 2 * m + c, show: String(2 * m + c), tol: 0.01, solution: `x = (x − ${c}) + ${c}. İfadə = (x − ${c}) + ${m * m}/(x − ${c}) + ${c}. x − ${c} > 0, AM-GM: ≥ 2√${m * m} + ${c} = ${2 * m} + ${c} = ${2 * m + c}. Bərabərlik x − ${c} = ${m}, yəni x = ${m + c}-də.` }; }
        if (t === "C") { const a = rnd(2, 4), s = rnd(2, 5), b = a * s * s, m = a * s; return { text: `x > 0 olduqda ${a}x + ${b}/x ifadəsinin ən kiçik qiymətini tap.`, answer: 2 * m, show: String(2 * m), tol: 0.01, solution: `AM-GM: ${a}x + ${b}/x ≥ 2√(${a}x · ${b}/x) = 2√${a * b} = 2 · ${m} = ${2 * m}. Bərabərlik ${a}x = ${b}/x → x² = ${s * s} → x = ${s}-də.` }; }
        const m = rnd(2, 8); return { text: `x < 0 olduqda x + ${m * m}/x ifadəsinin ən böyük qiymətini tap.`, answer: -2 * m, show: S(-2 * m), tol: 0.01, solution: `u = −x > 0 qoy. x + ${m * m}/x = −(u + ${m * m}/u) ≤ −2√${m * m} = −${2 * m}. Bərabərlik u = ${m}, yəni x = −${m}-də. Maksimum: ${S(-2 * m)}.` };
      } },
    { id: "cemhasil", ad: "Cəm sabit → hasil, hasil sabit → cəm", izah: "Cəm sabit: hasil ən çox (cəm/2)². Hasil sabit: cəm ən azı 2√hasil. a + b = S: a² + b² ≥ S²/2. px + qy = S: xy ≤ S²/(4pq).",
      gen() {
        const t = pick(["a", "b", "c", "d", "e"]);
        if (t === "a") { const s = rnd(3, 20); return { text: `a, b > 0 və a + b = ${s}. ab hasilinin ən böyük qiyməti neçədir?`, answer: s * s / 4, show: frac(s * s, 4), tol: 0.01, placeholder: "tam ədəd və ya kəsr", solution: `AM-GM: √(ab) ≤ (a + b)/2 = ${frac(s, 2)} → ab ≤ ${frac(s * s, 4)}. Bərabərlik a = b = ${frac(s, 2)}.` }; }
        if (t === "b") { const m = rnd(2, 12); return { text: `a, b > 0 və ab = ${m * m}. a + b cəminin ən kiçik qiyməti neçədir?`, answer: 2 * m, show: String(2 * m), tol: 0.01, solution: `AM-GM: a + b ≥ 2√(ab) = 2√${m * m} = ${2 * m}. Bərabərlik a = b = ${m}.` }; }
        if (t === "c") { const s = rnd(2, 15); return { text: `a + b = ${s} (a, b həqiqi ədədlərdir). a² + b² ifadəsinin ən kiçik qiyməti neçədir?`, answer: s * s / 2, show: frac(s * s, 2), tol: 0.01, placeholder: "tam ədəd və ya kəsr", solution: `QM ≥ AM: (a² + b²)/2 ≥ ((a + b)/2)² = ${frac(s * s, 4)} → a² + b² ≥ ${frac(s * s, 2)}. Bərabərlik a = b = ${frac(s, 2)}.` }; }
        if (t === "d") { const p = rnd(1, 4), q = rnd(1, 4), s = rnd(3, 12) * 2; return { text: `x, y > 0 və ${p === 1 ? "" : p}x + ${q === 1 ? "" : q}y = ${s}. xy hasilinin ən böyük qiyməti neçədir?`, answer: s * s / (4 * p * q), show: frac(s * s, 4 * p * q), tol: 0.01, placeholder: "tam ədəd və ya kəsr", solution: `xy = (1/${p * q}) · (${ax(p)})(${ax(q).replace("x", "y")}) ≤ (1/${p * q}) · ((${ax(p)} + ${ax(q).replace("x", "y")})/2)² = (1/${p * q}) · ${frac(s * s, 4)} = ${frac(s * s, 4 * p * q)}. Bərabərlik ${p === 1 ? "" : p}x = ${q === 1 ? "" : q}y = ${s / 2}.` }; }
        const m = rnd(2, 6); return { text: `a, b, c > 0 və a + b + c = ${3 * m}. abc hasilinin ən böyük qiyməti neçədir?`, answer: m ** 3, show: String(m ** 3), tol: 0.01, solution: `Üç ədədin AM-GM: ∛(abc) ≤ (a + b + c)/3 = ${m} → abc ≤ ${m}³ = ${m ** 3}. Bərabərlik a = b = c = ${m}.` };
      } },
    { id: "ortalar", ad: "HM, GM, AM, QM", izah: "HM = 2ab/(a + b), GM = √(ab), AM = (a + b)/2, QM = √((a² + b²)/2). HM ≤ GM ≤ AM ≤ QM. GM² = AM · HM.",
      gen() {
        const t = pick(["hm", "gm", "qm"]);
        if (t === "hm") { let a, b; do { a = rnd(1, 24); b = rnd(1, 24); } while (a === b); const hm = frac(2 * a * b, a + b); return { text: `${a} və ${b} ədədlərinin harmonik ortası (HM) neçədir?`, answer: 2 * a * b / (a + b), show: hm, tol: 0.01, placeholder: "tam ədəd və ya kəsr", solution: `HM = 2ab/(a + b) = 2 · ${a} · ${b} / ${a + b} = ${2 * a * b}/${a + b} = ${hm}.` }; }
        if (t === "gm") { const s = rnd(1, 3); let p, q; do { p = rnd(1, 4); q = rnd(1, 4); } while (p === q); const a = s * p * p, b = s * q * q, am = frac(a + b, 2), hm = frac(2 * a * b, a + b), gm = s * p * q;
          return { text: `İki müsbət ədədin ədədi ortası (AM) = ${am}, harmonik ortası (HM) = ${hm}. Həndəsi ortası (GM) neçədir?`, answer: gm, show: String(gm), tol: 0.01, solution: `GM² = AM · HM = ${am} · ${hm} = ${gm * gm}. GM = √${gm * gm} = ${gm}. (Doğrudan da ədədlər ${Math.min(a, b)} və ${Math.max(a, b)}-dir: √(${a} · ${b}) = ${gm}.)` }; }
        const [a0, b0] = pick([[1, 7], [7, 17], [17, 31]]), k = rnd(1, 3), a = a0 * k, b = b0 * k, qm = root((a * a + b * b) / 2);
        return { text: `${a} və ${b} ədədlərinin kvadratik ortası (QM) neçədir?`, answer: qm, show: String(qm), tol: 0.01, solution: `QM = √((a² + b²)/2) = √((${a * a} + ${b * b})/2) = √${(a * a + b * b) / 2} = ${qm}.` };
      } },
    { id: "berabarlik", ad: "Bərabərlik halı və çəkili AM-GM", izah: "ax + b/x ≥ 2√(ab), bərabərlik ax = b/x. Üç hədli: x/2 + x/2 + k/x² ≥ 3∛(k/4). Bərabərlik şərti: bütün hədlər bərabər.",
      gen() {
        const t = pick(["i", "ii", "iii", "iv"]);
        if (t === "i") { const a = rnd(1, 4), x0 = rnd(1, 6), b = a * x0 * x0, ask = pick(["min", "x"]);
          return { text: `x > 0 olduqda ${ax(a)} + ${b}/x ifadəsinin ${ask === "min" ? "ən kiçik qiymətini tap." : "ən kiçik qiymətini hansı x-də alır? x = ?"}`, answer: ask === "min" ? 2 * a * x0 : x0, show: String(ask === "min" ? 2 * a * x0 : x0), tol: 0.01,
            solution: `AM-GM: ${ax(a)} + ${b}/x ≥ 2√(${ax(a)} · ${b}/x) = 2√${a * b} = ${2 * a * x0}. Bərabərlik ${ax(a)} = ${b}/x → x² = ${x0 * x0} → x = ${x0}. Cavab: ${ask === "min" ? 2 * a * x0 : x0}.` }; }
        if (t === "ii") { const c = rnd(1, 3), k = 4 * c ** 3, ask = pick(["min", "x"]);
          return { text: `x > 0 olduqda x + ${k}/x² ifadəsinin ${ask === "min" ? "ən kiçik qiymətini tap." : "ən kiçik qiymətini hansı x-də alır? x = ?"}`, answer: ask === "min" ? 3 * c : 2 * c, show: String(ask === "min" ? 3 * c : 2 * c), tol: 0.01,
            solution: `x = x/2 + x/2 və üç hədli AM-GM: x/2 + x/2 + ${k}/x² ≥ 3∛((x/2)(x/2) · ${k}/x²) = 3∛${k / 4} = ${3 * c}. Bərabərlik x/2 = ${k}/x² → x³ = ${2 * k} → x = ${2 * c}. Cavab: ${ask === "min" ? 3 * c : 2 * c}.` }; }
        if (t === "iii") { const m = rnd(2, 6);
          return { text: `x, y, z > 0 və xyz = ${m ** 3}. x + y + z cəminin ən kiçik qiyməti neçədir?`, answer: 3 * m, show: String(3 * m), tol: 0.01,
            solution: `Üç ədədin AM-GM: x + y + z ≥ 3∛(xyz) = 3∛${m ** 3} = ${3 * m}. Bərabərlik x = y = z = ${m}-də alınır.` }; }
        const m = rnd(2, 7);
        return { text: `x ≠ 0 olduqda x² + ${m * m}/x² ifadəsinin ən kiçik qiymətini tap.`, answer: 2 * m, show: String(2 * m), tol: 0.01,
          solution: `x² > 0, AM-GM: x² + ${m * m}/x² ≥ 2√(x² · ${m * m}/x²) = 2√${m * m} = ${2 * m}. Bərabərlik x⁴ = ${m * m}-də alınır (x² = ${m}).` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "ax + b/x ifadəsinin minimumunu AM-GM ilə tapan üç addımlı həll. Hər addımı yoxla: 2 vuruğu, bərabərlik şərti, hesab.",
      gen() {
        const a = rnd(1, 4), x0 = rnd(2, 5), b = a * x0 * x0, m = a * x0, bad = rnd(0, 2);
        const s1 = bad === 0 ? `AM-GM (x > 0): ${ax(a)} + ${b}/x ≥ √(${ax(a)} · ${b}/x) = √${a * b}.` : `AM-GM (x > 0): ${ax(a)} + ${b}/x ≥ 2√(${ax(a)} · ${b}/x) = 2√${a * b}.`;
        const s2 = bad === 1 ? `Bərabərlik: ${ax(a)} = ${b}/x ⇒ x = ${b}/${a} = ${x0 * x0}.` : `Bərabərlik: ${ax(a)} = ${b}/x ⇒ x² = ${b / a} ⇒ x = ${x0}.`;
        const val = bad === 0 ? m : bad === 2 ? 2 * m + pick([-2, -1, 1, 2]) : 2 * m;
        const s3 = bad === 0 ? `√${a * b} = ${m}. Minimum ${m}.` : `√${a * b} = ${m}. Minimum 2 · ${m} = ${val}.`;
        const text = h("div", {}, h("p", {}, `Fikrət x > 0 olduqda ${ax(a)} + ${b}/x ifadəsinin ən kiçik qiymətini tapır. Birinci səhv hansı addımdadır?`),
          h("ol", { class: "oy-steps" }, ...[s1, s2, s3].map(st => h("li", {}, st))));
        const why = [`1-ci addım: AM-GM-də iki toplananın cəmi ≥ 2√(hasil) olur, √(hasil) yox. Düz cavab: ${2 * m}.`,
          `2-ci addım: ${ax(a)} = ${b}/x-dən x² = ${b / a}, yəni x = ${x0}. (Fikrət kvadrat kökü almağı unutub.) Düz minimum ${2 * m} (x = ${x0}).`,
          `3-cü addım: 2 · ${m} = ${2 * m}, ${val} deyil.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Hasar: cəm (perimetr) sabit → sahə ən çox kvadratda. Orta sürət (eyni yol) = HM. Gəlir p(a − bp) — kvadrat funksiyanın maksimumu.",
      gen() {
        const t = pick(["a", "b", "c", "d"]);
        if (t === "a") { const s = rnd(3, 30), P = 4 * s; return { text: `Uzunluğu ${P} m olan hasarla düzbucaqlı sahə hasarlayırlar. Sahə ən çox neçə kvadrat metr ola bilər?`, answer: s * s, show: String(s * s), tol: 0.01, unit: "m²", solution: `Tərəflər x və y: x + y = ${P / 2}. AM-GM: xy ≤ ((x + y)/2)² = ${s}² = ${s * s}. Bərabərlik x = y = ${s} (kvadrat).` }; }
        if (t === "b") { const k = rnd(2, 15), L = 4 * k, ar = 2 * k * k; return { text: `Bir tərəfi divar olan düzbucaqlı bağı hasarlamaq üçün ${L} m hasar var (divar boyu hasar çəkilmir). Bağın sahəsi ən çox neçə kvadrat metr ola bilər?`, answer: ar, show: String(ar), tol: 0.01, unit: "m²", solution: `Divara perpendikulyar tərəflər x, divara paralel tərəf y: 2x + y = ${L}. xy = (1/2) · (2x) · y ≤ (1/2) · ((2x + y)/2)² = (1/2) · ${2 * k}² = ${ar}. Bərabərlik 2x = y = ${2 * k}, yəni x = ${k}, y = ${2 * k}.` }; }
        if (t === "c") { const [v1, v2] = pick(speeds), hm = 2 * v1 * v2 / (v1 + v2); return { text: `Avtomobil A şəhərindən B şəhərinə ${v1} km/saat sürətlə gedir, eyni yolla geri ${v2} km/saat sürətlə qayıdır. Bütün səfərdə orta sürət (km/saat ilə) neçədir?`, answer: hm, show: String(hm), tol: 0.01, solution: `Yol S olsun. Vaxt: S/${v1} + S/${v2}. Orta sürət = 2S / (S/${v1} + S/${v2}) = 2 · ${v1} · ${v2} / (${v1} + ${v2}) = ${2 * v1 * v2}/${v1 + v2} = ${hm} (HM).` }; }
        const b = rnd(2, 6), m = rnd(3, 12), a = 2 * b * m, g = b * m * m;
        return { text: `Bilet qiyməti p manatdırsa, gündə ${a} − ${b}p bilet satılır. Gündəlik gəlir (qiymət · satılan bilet sayı) ən çox neçə manat ola bilər?`, answer: g, show: String(g), tol: 0.01, solution: `Gəlir p(${a} − ${b}p) = ${b} · p · (${2 * m} − p). AM-GM: p(${2 * m} − p) ≤ ((p + ${2 * m} − p)/2)² = ${m}² = ${m * m}. Gəlir ≤ ${b} · ${m * m} = ${g}. Bərabərlik p = ${m}-də alınır.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-berabersizlik", title: "Bərabərsizliklərin isbatı, orta qiymətlər", fenn: "olimpiada", link: "dersler/ol-berabersizlik.html",
      format: "Cavab ədəddir: tam 20, kəsr 81/4, mənfi −6. Ən kiçik/ən böyük qiyməti və ya bərabərlik alınan x-i yaz.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["kvadrat", "xk", "xk", "cemhasil", "cemhasil", "ortalar", "berabarlik", "berabarlik", "sehv", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-berabersizlik.html")) b.push("dersler/ol-berabersizlik.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
