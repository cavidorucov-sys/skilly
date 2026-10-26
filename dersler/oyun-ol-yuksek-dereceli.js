// Yüksəkdərəcəli tənliklər, rasional köklər (olimpiada) — mastery game levels and the final test.
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
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = n => String(n).split("").map(d => SUP[+d]).join("");
  const xp = e => e === 0 ? "" : e === 1 ? "x" : "x" + sup(e);
  const poly = ts => { let o = ""; for (const [c, e] of ts) { if (!c) continue; const a = Math.abs(c), body = e ? (a === 1 ? xp(e) : a + xp(e)) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const arr = cs => poly(cs.map((c, i) => [c, cs.length - 1 - i]));
  const lin = a => poly([[1, 1], [-a, 0]]);                // x − a
  const sg = n => n < 0 ? " − " + (-n) : " + " + n;
  const qt = (b, c) => "t²" + (b ? sg(b) + "t" : "") + (c ? sg(c) : "");
  const divs = n => { const r = []; for (let d = 1; d <= Math.abs(n); d++) if (n % d === 0) r.push(d); return r; };
  const mul = (p, q) => { const r = Array(p.length + q.length - 1).fill(0); p.forEach((a, i) => q.forEach((b, j) => { r[i + j] += a * b; })); return r; };
  const byRoots = rs => rs.reduce((p, r) => mul(p, [1, -r]), [1]);

  const levels = [
    { id: "namized", ad: "Kök namizədləri", izah: "Tam əmsallı çoxhədlidə rasional kök p/q (azalmaz) olarsa: p sərbəst həddi, q baş əmsalı bölür. Namizədlər: ±p/q.",
      gen() {
        const an = pick([1, 2, 3, 4, 6]); let a0 = nz(-12, 12); while (Math.abs(a0) < 2) a0 = nz(-12, 12);
        const deg = pick([3, 3, 4]), cs = [an]; for (let i = 1; i < deg; i++) cs.push(rnd(-7, 7)); cs.push(a0);
        const ps = divs(a0), qs = divs(an), fr = [];
        for (const p of ps) for (const q of qs) if (gcd(p, q) === 1) fr.push(frac(p, q));
        const ans = 2 * fr.length;
        return { text: `${arr(cs)} = 0 tənliyinin mümkün rasional köklərinin (namizədlərin) sayı neçədir? Həm müsbət, həm mənfi işarəli namizədləri say.`, answer: ans, show: String(ans), tol: 0.01,
          solution: `p bölür ${Math.abs(a0)}-i: ${ps.join(", ")}. q bölür ${an}-i: ${qs.join(", ")}. Azalmaz kəsrlər p/q: ${fr.join(", ")} — ${fr.length} dənə. Hər birinin mənfisi də var: 2 · ${fr.length} = ${ans}.` };
      } },
    { id: "kok", ad: "Rasional kökü tap", izah: "Namizədləri yaz, yerinə qoyub yoxla. Kökü tapınca Horner ilə vuruqlara ayır, qalan kvadrat üçhədlinin diskriminantına bax.",
      gen() {
        const m = pick([1, 2, 3]); let p; do { p = nz(-6, 6); } while (gcd(m, Math.abs(p)) !== 1);
        let b, c; do { b = rnd(-4, 4); c = rnd(1, 6); } while (b * b >= 4 * c);
        const cs = mul([m, -p], [1, b, c]);
        const root = frac(p, m);
        return { text: `${arr(cs)} = 0 tənliyinin yeganə həqiqi kökünü tap.`, answer: p / m, show: root, tol: 0.01, placeholder: "tam ədəd və ya kəsr, məs. −3/2",
          solution: `Namizədlər p/q: p bölür ${Math.abs(cs[3])}-i, q bölür ${m}-i. x = ${root} yerinə qoyanda ifadə 0 olur. Vuruqlara ayırsaq: ${arr(cs)} = (${poly([[m, 1], [-p, 0]])})(${arr([1, b, c])}). İkinci vuruğun D = ${S(b * b - 4 * c)} < 0, başqa həqiqi kök yoxdur. Cavab: ${root}.` };
      } },
    { id: "vuruq", ad: "Vuruqlara ayır, kökləri tap", izah: "Sərbəst həddin bölənlərini sına, kökü tapınca Horner ilə dərəcəni aşağı sal. Bütün kökləri tapandan sonra istənilən kəmiyyəti hesabla.",
      gen() {
        const k = pick([3, 4, 4]), rs = []; while (rs.length < k) { const r = nz(-5, 5); if (!rs.includes(r)) rs.push(r); }
        const cs = byRoots(rs), srt = rs.slice().sort((a, b) => a - b);
        const ask = pick(["fark", "kv"]);
        const ans = ask === "fark" ? srt[k - 1] - srt[0] : rs.reduce((s, r) => s + r * r, 0);
        const q = ask === "fark" ? "Ən böyük kökün ən kiçik kökdən fərqi neçədir?" : "Köklərin kvadratları cəmi neçədir?";
        return { text: `${arr(cs)} = 0 tənliyinin bütün kökləri tam ədəddir. ${q}`, answer: ans, show: String(ans), tol: 0.01,
          solution: `Baş əmsal 1 olduğundan kök ${Math.abs(cs[k])}-in bölənidir. Sınaqla və Hornerlə tapırıq: ${srt.map(S).join("; ")} (${arr(cs)} = ${srt.map(r => r === 0 ? "x" : "(" + lin(r) + ")").join("")}). ` + (ask === "fark" ? `Fərq: ${S(srt[k - 1])} − ${B(srt[0])} = ${ans}.` : `Kvadratlar cəmi: ${rs.map(r => r * r).join(" + ")} = ${ans}.`) };
      } },
    { id: "qarsiliq", ad: "Qarşılıqlı tənliklər", izah: "Əmsallar simmetrikdir → x²-na böl, t = x + 1/x qoy: x² + 1/x² = t² − 2. Həqiqi x üçün |t| ≥ 2 olmalıdır. Və ya xⁿ + 1/xⁿ üçün Sₙ₊₁ = t·Sₙ − Sₙ₋₁.",
      gen() {
        if (Math.random() < .55) {
          const ts = [-5, -4, -3, -1, 0, 1, 3, 4, 5];
          const t1 = pick(ts), t2 = pick(ts), k = pick([1, 1, 2]);
          const cs = mul([1, -t1, 1], [1, -t2, 1]).map(v => v * k);
          const uq = [...new Set([t1, t2])], real = uq.filter(t => Math.abs(t) > 2);
          const ask = pick(["say", "cem"]), ans = ask === "say" ? 2 * real.length : real.reduce((s, t) => s + t, 0);
          const q = ask === "say" ? "Tənliyin neçə müxtəlif həqiqi kökü var?" : "Müxtəlif həqiqi köklərinin cəmi neçədir?";
          return { text: `${arr(cs)} = 0. ${q}`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Əmsallar simmetrikdir. x²-na bölüb t = x + 1/x qoyuruq: ${k === 1 ? "" : k + "·"}(t² − 2)${sg(cs[1])}t${sg(cs[2])} = 0, sadələşdirsək ${qt(-(t1 + t2), t1 * t2)} = 0. t = ${uq.map(S).join(", t = ")}. ` +
              `x + 1/x = t tənliyinin həqiqi kökü üçün |t| ≥ 2 lazımdır` + (real.length ? `: t = ${real.map(S).join(", ")} yararlıdır (hər biri 2 kök, cəmi t), ` : ": heç bir t yararlı deyil, ") + `qalanlar yox. ` + (ask === "say" ? `Köklərin sayı: 2 · ${real.length} = ${ans}.` : `Cəm: ${real.length ? real.map(S).join(" + ").replace(/\+ −/g, "− ") : "0"} = ${S(ans)}.`) };
        }
        const t = pick([3, 4, 5, 6, 7, -3, -4]), n = pick([3, 4, 5]), Sv = [2, t];
        for (let i = 2; i <= n; i++) Sv.push(t * Sv[i - 1] - Sv[i - 2]);
        const ans = Sv[n];
        const lines = []; for (let i = 2; i <= n; i++) lines.push(`S${i} = ${B(t)}·${B(Sv[i - 1])} − ${B(Sv[i - 2])} = ${S(Sv[i])}`);
        return { text: `x + 1/x = ${S(t)} olarsa, x${sup(n)} + 1/x${sup(n)} = ?`, answer: ans, show: S(ans), tol: 0.01,
          solution: `Sₙ = xⁿ + 1/xⁿ qoyaq: S₀ = 2, S₁ = ${S(t)}, Sₙ₊₁ = ${S(t)}·Sₙ − Sₙ₋₁. ${lines.join("; ")}. Cavab: ${S(ans)}.` };
      } },
    { id: "evez", ad: "Əvəzləmə", izah: "Təkrarlanan ifadəni t ilə əvəz et: (x² + bx)(x² + bx + d), yaxud (x − a)⁴ + (x − b)⁴ üçün y = x − (a+b)/2. Sonra x-ə qayıt.",
      gen() {
        if (Math.random() < .5) {
          let b, d, x0, t1, t2;
          do { b = nz(-6, 6); d = rnd(1, 6); x0 = nz(-4, 4); t1 = x0 * x0 + b * x0; t2 = -d - t1; } while (t1 === 0 || t2 === 0);
          const K = t1 * (t1 + d), sumReal = [...new Set([t1, t2])].reduce((s, t) => { const D = b * b + 4 * t; return s + (D > 0 ? -b : D === 0 ? -b / 2 : 0); }, 0);
          const parts = [...new Set([t1, t2])].map(t => { const D = b * b + 4 * t; return `t = ${S(t)}: x² ${b < 0 ? "−" : "+"} ${Math.abs(b)}x ${t > 0 ? "−" : "+"} ${Math.abs(t)} = 0, D = ${S(D)}` + (D > 0 ? ` > 0, kökləri cəmi ${S(-b)}` : D === 0 ? `, ikiqat kök ${frac(-b, 2)}` : " < 0, həqiqi kök yoxdur"); });
          return { text: `(${poly([[1, 2], [b, 1]])})(${poly([[1, 2], [b, 1], [d, 0]])}) = ${K}. Müxtəlif həqiqi köklərinin cəmi neçədir?`, answer: sumReal, show: frac(2 * sumReal, 2), tol: 0.01,
            solution: `t = ${poly([[1, 2], [b, 1]])} qoyaq: t(t + ${d}) = ${K}, yəni t² + ${d}t${sg(-K)} = 0 → t = ${S(t1)} və t = ${S(t2)}. ${parts.join("; ")}. Cəm: ${S(sumReal) === "0" ? "0" : frac(2 * sumReal, 2)}.` };
        }
        const e = rnd(1, 3), y0 = rnd(1, 3), c = rnd(-4, 4), a = c - e, bb = c + e;
        const K = 2 * y0 ** 4 + 12 * e * e * y0 * y0 + 2 * e ** 4, ask = pick(["max", "fark"]);
        const ans = ask === "max" ? c + y0 : 2 * y0, q = ask === "max" ? "Ən böyük kökü tap." : "İki həqiqi kökün fərqi (böyük − kiçik) neçədir?";
        return { text: `(x ${a < 0 ? "+" : "−"} ${Math.abs(a)})⁴ + (x ${bb < 0 ? "+" : "−"} ${Math.abs(bb)})⁴ = ${K}. Tənliyin yalnız iki həqiqi kökü var. ${q}`.replace(/\(x − 0\)/g, "x"), answer: ans, show: S(ans), tol: 0.01,
          solution: `Ortanı götür: y = x ${c < 0 ? "+" : "−"} ${Math.abs(c)} (a və b-nin ortası ${S(c)}). Onda (y + ${e})⁴ + (y − ${e})⁴ = 2y⁴ + ${12 * e * e}y² + ${2 * e ** 4} = ${K}. Y = y² qoy: Y² + ${6 * e * e}Y − ${y0 ** 4 + 6 * e * e * y0 * y0} = 0 → (Y − ${y0 * y0})(Y + ${y0 * y0 + 6 * e * e}) = 0. Y = ${y0 * y0} (mənfi Y yararsızdır) → y = ±${y0} → x = ${S(c)} ± ${y0}, yəni ${S(c - y0)} və ${S(c + y0)}. ` + (ask === "max" ? `Ən böyüyü ${S(ans)}.` : `Fərq: ${ans}.`) };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Kubik tənliyin köklərini tapan üç addımlı həll. Hər addımı yoxla: namizədlər qaydası, Horner nəticəsi, kvadrat üçhədlinin kökləri.",
      gen() {
        let a, b, c; do { a = nz(-4, 4); b = nz(-5, 5); c = nz(-5, 5); } while (b === c || a === b || a === c || b + c === 0);
        const cs = byRoots([a, b, c]), [, Bc, Cc, Dc] = cs;
        const v1 = Bc + a, v2 = Cc + a * v1, bad = rnd(0, 2);
        const dv = divs(Dc).flatMap(d => [d, -d]).map(S).join(", ");
        const s1 = bad === 0 ? `Baş əmsal 1 olduğundan rasional kök yalnız ±1 ola bilər (baş əmsalın bölənləri).` : `Baş əmsal 1 olduğundan rasional kök tamdır və ${Math.abs(Dc)}-i bölür. Namizədlər: ${dv}.`;
        const w1 = bad === 1 ? -v1 : v1, r1 = bad === 1 ? [-b, -c] : [b, c];
        const s2 = `P(${S(a)}) = 0, deməli ${S(a)} kökdür. Horner sxemi (a = ${S(a)}): ikinci ədəd ${S(Bc)} + ${B(a)}·1 = ${S(w1)}, qalıq 0. Qismət: ${poly([[1, 2], [w1, 1], [v2, 0]])}.`;
        const tot = r1[0] + r1[1] + a, shown = bad === 2 ? tot + pick([-2, -1, 1, 2]) : tot;
        const s3 = `${poly([[1, 2], [w1, 1], [v2, 0]])} = (${lin(r1[0])})(${lin(r1[1])}). Köklər: ${S(a)}; ${S(r1[0])}; ${S(r1[1])}. Cəmi: ${S(shown)}.`;
        const why = [`1-ci addım: baş əmsal 1-dirsə, rasional kök sərbəst həddin (${S(Dc)}) bölənidir, ±1 yox. Düz namizədlər: ${dv}.`,
          `2-ci addım: Horner-də ikinci ədəd ${S(Bc)} + ${B(a)} = ${S(v1)}, ${S(w1)} deyil. Düz qismət: ${poly([[1, 2], [v1, 1], [v2, 0]])}, kökləri ${S(b)} və ${S(c)}. Düz cavab: ${S(a + b + c)}.`,
          `3-cü addım: ${S(a)} + ${B(b)} + ${B(c)} = ${S(a + b + c)}, ${S(shown)} deyil.`][bad];
        const text = h("div", {}, h("p", {}, `Elvin ${arr(cs)} = 0 tənliyinin köklərinin cəmini tapır. Birinci səhv hansı addımdadır?`),
          h("ol", { class: "oy-steps" }, ...[s1, s2, s3].map(st => h("li", {}, st))));
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Ölçülər və ədədlər haqqında məsələlər kubik tənliyə gətirilir. Kökü sərbəst həddin bölənləri arasında axtar (baş əmsal 1).",
      gen() {
        if (Math.random() < .5) {
          const n = rnd(2, 12), V = n * (n + 1) * (n + 2), ans = 3 * n + 3;
          return { text: `Düzbucaqlı paralelepipedin ölçüləri ardıcıl üç natural ədəddir. Həcmi ${V} sm³. Ölçülərin cəmi neçə sm-dir?`, answer: ans, unit: "sm", show: String(ans), tol: 0.01,
            solution: `Ölçülər x, x + 1, x + 2: x³ + 3x² + 2x − ${V} = 0. Baş əmsal 1, müsbət kök ${V}-in bölənidir. x = ${n}: ${n ** 3} + ${3 * n * n} + ${2 * n} = ${V} ✓. Ölçülər ${n}, ${n + 1}, ${n + 2}; cəmi ${ans} sm.` };
        }
        let p, q; do { p = rnd(1, 6); q = rnd(1, 7); } while (p === q);
        const x = rnd(2, 7), V = x * (x + p) * (x + q), cs = byRoots([0, -p, -q]);
        return { text: `Düzbucaqlı qutunun eni x sm, uzunluğu enindən ${p} sm, hündürlüyü enindən ${q} sm artıqdır. Həcmi ${V} sm³. Qutunun eni neçə sm-dir?`, answer: x, unit: "sm", show: String(x), tol: 0.01,
          solution: `x(x + ${p})(x + ${q}) = ${V} → ${arr([...cs.slice(0, 3), -V])} = 0. Müsbət kök ${V}-in bölənidir. x = ${x} yoxlanır: ${x}·${x + p}·${x + q} = ${V} ✓. (x > 0 üçün sol tərəf artır, başqa müsbət kök yoxdur.) Cavab: ${x} sm.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-yuksek-dereceli", title: "Yüksəkdərəcəli tənliklər, rasional köklər", fenn: "olimpiada", link: "dersler/ol-yuksek-dereceli.html",
      format: "Cavab ədəddir: tam −7, kəsr 15/4, mənfi −3/2. Köklərin cəmi, sayı, fərqi kimi ədədi kəmiyyəti yaz.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["namized", "kok", "vuruq", "vuruq", "qarsiliq", "qarsiliq", "evez", "evez", "sehv", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-yuksek-dereceli.html")) b.push("dersler/ol-yuksek-dereceli.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
