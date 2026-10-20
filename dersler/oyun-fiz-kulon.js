// Fizika · Elektrik yükü, Kulon qanunu, elektrik sahəsi — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}.
// k = 9·10⁹ N·m²/Kl², e = 1,6·10⁻¹⁹ Kl. Handy units: 1 mkKl = 10⁻⁶ Kl, 1 nKl = 10⁻⁹ Kl.
// With q in nKl and r in sm:  E = 90·q/r² kV/m.  With q1, q2 in mkKl and r in sm:  F = 90·q1·q2/r² N.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const sup = n => String(n).replace(/-/g, "⁻").replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
  const sg = q => (q < 0 ? "−" : "+") + F(Math.abs(q));
  const INK = "var(--ink,#17171a)", POS = "#a32d2d", NEG = "#1f4e9c";
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const E1 = (q, r) => 90 * Math.abs(q) / (r * r);   // kV/m, q in nKl, r in sm

  // charges on a line (x in sm, q in nKl) and an optional point M
  function lineFig(charges, M) {
    const W = 300, H = 112, pad = 34;
    const xs = charges.map(c => c.x).concat(M == null ? [] : [M]);
    const lo = Math.min(...xs), hi = Math.max(...xs), s = (W - 2 * pad) / (hi - lo), X = x => pad + (x - lo) * s;
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Düz xətt üzərində yüklər" });
    g.append(sv("line", { x1: 8, y1: 46, x2: W - 8, y2: 46, stroke: INK, "stroke-width": 1.5 }));
    for (const c of charges) {
      g.append(sv("circle", { cx: X(c.x), cy: 46, r: 11, fill: c.q > 0 ? POS : NEG }));
      g.append(sv("text", { x: X(c.x), y: 51, "text-anchor": "middle", fill: "#fff", "font-size": 15, "font-weight": 700 }, c.q > 0 ? "+" : "−"));
      g.append(sv("text", { x: X(c.x), y: 22, "text-anchor": "middle", class: "oy-lbl" }, sg(c.q) + " nKl"));
    }
    if (M != null) {
      g.append(sv("circle", { cx: X(M), cy: 46, r: 4, fill: INK }));
      g.append(sv("text", { x: X(M), y: 30, "text-anchor": "middle", class: "oy-lbl" }, "M"));
    }
    const pts = [...new Set(xs)].sort((a, b) => a - b);
    for (let i = 0; i + 1 < pts.length; i++) {
      const a = X(pts[i]), b = X(pts[i + 1]);
      g.append(sv("line", { x1: a, y1: 80, x2: b, y2: 80, stroke: "#6b6b73", "stroke-width": 1.2 }));
      g.append(sv("line", { x1: a, y1: 74, x2: a, y2: 86, stroke: "#6b6b73" })); g.append(sv("line", { x1: b, y1: 74, x2: b, y2: 86, stroke: "#6b6b73" }));
      g.append(sv("text", { x: (a + b) / 2, y: 100, "text-anchor": "middle", class: "oy-lbl" }, F(pts[i + 1] - pts[i]) + " sm"));
    }
    return g;
  }

  const levels = [
    { id: "yuk", ad: "Yük və saxlanma", izah: "q = N·e, e = 1,6·10⁻¹⁹ Kl. Eyni iki metal kürə toxunub ayrılanda yük bərabər bölünür. Yüklərin cəbri cəmi dəyişmir.",
      gen() {
        const kind = pick(["N", "N", "Nq", "toxun", "toxun", "zence"]);
        if (kind === "N") {
          const a = rnd(1, 9), p = pick([10, 11, 12]), q = 1.6 * a * 10 ** (p - 10);
          return R(q, "nKl", { text: `Plastik daraq yun parçasına sürtülərkən ona ${a}·10${sup(p)} ədəd artıq elektron keçdi. Daraqın yükünün modulu neçə nKl-dur? (e = 1,6·10⁻¹⁹ Kl, 1 nKl = 10⁻⁹ Kl)`,
            solution: `q = N·e = ${a}·10${sup(p)}·1,6·10⁻¹⁹ = ${F(1.6 * a)}·10${sup(p - 19)} Kl = ${F(q)}·10⁻⁹ Kl = ${F(q)} nKl.` });
        }
        if (kind === "Nq") {
          const a = rnd(1, 9), p = pick([0, 1]), q = 1.6 * a * 10 ** p, N = a * 10 ** (p + 1);
          return R(N, "milyard", { text: `Cisimdən ${F(q)} nKl mənfi yük götürmək üçün ondan neçə milyard (1 milyard = 10⁹) elektron çıxarmaq lazımdır? (e = 1,6·10⁻¹⁹ Kl)`,
            solution: `N = q/e = ${F(q)}·10⁻⁹/(1,6·10⁻¹⁹) = ${F(q / 1.6)}·10¹⁰ = ${F(N)} milyard.` });
        }
        if (kind === "toxun") {
          let q1, q2; do { q1 = pick([-1, 1]) * rnd(1, 14); q2 = pick([-1, 1]) * rnd(0, 14); } while ((q1 + q2) % 2 !== 0 || q1 === q2);
          return R((q1 + q2) / 2, "nKl", { text: `İki eyni metal kürənin yükləri ${F(q1)} nKl və ${F(q2)} nKl-dur. Kürələri bir-birinə toxundurub ayırdılar. Birinci kürənin yükü neçə nKl oldu? (Mənfi cavab "−" ilə yazılır.)`,
            solution: `Eyni kürələrdə yük bərabər bölünür: q = (q₁ + q₂)/2 = (${F(q1)} + (${F(q2)}))/2 = ${F((q1 + q2) / 2)} nKl.` });
        }
        const q = 4 * rnd(1, 10) * pick([1, 2, 3]);
        return R(q / 4, "nKl", { text: `Eyni üç metal kürədən birincinin yükü ${q} nKl, qalan ikisi neytraldır. Birinci kürəni ikinciyə toxundurub ayırdılar, sonra ikincini üçüncüyə toxundurub ayırdılar. Üçüncü kürənin yükü neçə nKl oldu?`,
          solution: `1 və 2 toxunur: hər biri ${F(q / 2)} nKl. Sonra 2 və 3 toxunur (3-cü neytraldır): üçüncü ${F(q / 2)}/2 = ${F(q / 4)} nKl alır.` });
      } },

    { id: "kulon", ad: "Kulon qanunu", izah: "F = k·|q₁q₂|/r², k = 9·10⁹ N·m²/Kl². Yükləri mkKl-la, məsafəni sm-lə yazsan: F = 90·q₁q₂/r² N. Məsafə 2 dəfə artsa, qüvvə 4 dəfə azalır.",
      gen() {
        const kind = pick(["F", "F", "r", "q", "scale", "scale", "contact"]);
        const sys = pick([["mkKl", "N", 1e-6, 1], ["nKl", "μN", 1e-9, 1]]);   // charge unit, force unit
        const cs = [2, 3, 4, 5, 6, 9, 10, 12, 15, 18, 20, 30];
        if (kind === "F" || kind === "r" || kind === "q") {
          let a, b, c, f; do { a = rnd(1, 12); b = rnd(1, 12); c = pick(cs); f = 90 * a * b / (c * c); } while (!nice(f, 3) || f < 0.01 || f > 3000);
          const unit = sys[1], head = `Nöqtəvi iki yük`;
          if (kind === "F") return R(f, unit, { text: `${head}: q₁ = ${a} ${sys[0]} və q₂ = ${b} ${sys[0]}. Aralarındakı məsafə ${c} sm-dir. Qarşılıqlı təsir qüvvəsi neçə ${unit}-dır? (k = 9·10⁹ N·m²/Kl²)`,
            solution: `F = kq₁q₂/r². ${sys[0] === "mkKl" ? "q = ...·10⁻⁶ Kl" : "q = ...·10⁻⁹ Kl"}, r = ${c} sm = ${F(c / 100)} m. Sadə yol: F = 90·${a}·${b}/${c}² = ${F(f)} ${unit}.` });
          if (kind === "r") return R(c, "sm", { text: `${head}: q₁ = ${a} ${sys[0]} və q₂ = ${b} ${sys[0]}. Onlar bir-birini ${F(f)} ${unit} qüvvə ilə itələyir. Yüklər arasındakı məsafə neçə sm-dir? (k = 9·10⁹ N·m²/Kl²)`,
            solution: `r² = 90·q₁q₂/F = 90·${a}·${b}/${F(f)} = ${c * c} (sm²) → r = ${c} sm.` });
          return R(b, sys[0], { text: `q₁ = ${a} ${sys[0]} yükündən ${c} sm məsafədə q₂ yükü var. Yüklər bir-birini ${F(f)} ${unit} qüvvə ilə itələyir. q₂ neçə ${sys[0]}-dir? (k = 9·10⁹ N·m²/Kl²)`,
            solution: `q₂ = F·r²/(90·q₁) = ${F(f)}·${c}²/(90·${a}) = ${b} ${sys[0]}.` });
        }
        if (kind === "scale") {
          const QF = [["yüklərdən birini 2 dəfə artırıb", 2, "q"], ["yüklərdən birini 3 dəfə artırıb", 3, "q"], ["hər iki yükü 2 dəfə artırıb", 4, "q"], ["hər iki yükü 2 dəfə azaldıb", 1 / 4, "q"], ["yüklərdən birini 4 dəfə azaldıb", 1 / 4, "q"]];
          const DF = [["məsafəni 2 dəfə artırsaq", 1 / 4, "r"], ["məsafəni 3 dəfə artırsaq", 1 / 9, "r"], ["məsafəni 2 dəfə azaltsaq", 4, "r"], ["məsafəni 3 dəfə azaltsaq", 9, "r"]];
          let f1, q, d, f2; do { f1 = pick([1, 2, 3, 4, 6, 8, 9, 12, 16, 18, 24, 32, 36, 48, 72, 144]); q = pick(QF); d = pick(DF); f2 = f1 * q[1] * d[1]; } while (!nice(f2, 2) || f2 > 2000 || f2 < 0.05);
          return R(f2, "N", { text: `İki nöqtəvi yük arasındakı qarşılıqlı təsir qüvvəsi ${f1} N-dur. ${q[0][0].toUpperCase() + q[0].slice(1)}, ${d[0]}, qüvvə neçə N olar?`,
            solution: `F ~ q₁q₂/r². Yükdən çarpan ${F(q[1])}, məsafədən çarpan ${F(d[1])}. F₂ = ${f1}·${F(q[1])}·${F(d[1])} = ${F(f2)} N.` });
        }
        let a, b, s1, s2, c, f; do { a = rnd(1, 12); b = rnd(1, 12); s1 = pick([1, -1]); s2 = pick([1, -1]); c = pick(cs); const q = (s1 * a + s2 * b) / 2; f = 90 * q * q / (c * c); } while ((a + b) % 2 !== 0 || s1 * a + s2 * b === 0 || a === b && s1 === s2 || !nice(f, 3) || f < 0.01 || f > 3000);
        const q1 = s1 * a, q2 = s2 * b;
        return R(f, "N", { text: `Eyni iki metal kürənin yükləri q₁ = ${F(q1)} mkKl və q₂ = ${F(q2)} mkKl-dur, mərkəzləri arasındakı məsafə ${c} sm-dir. Kürələri toxundurub yenə eyni məsafəyə qoydular. Yeni qarşılıqlı təsir qüvvəsinin modulu neçə N-dur? (Kürələr nöqtəvi sayılır, k = 9·10⁹ N·m²/Kl²)`,
          solution: `Toxunandan sonra hər kürənin yükü (q₁ + q₂)/2 = ${F((q1 + q2) / 2)} mkKl. F = 90·q²/r² = 90·${F(((q1 + q2) / 2) ** 2)}/${c * c} = ${F(f)} N.` });
      } },

    { id: "sahe", ad: "Elektrik sahəsi", izah: "E = F/q, nöqtəvi yükün sahəsi E = kq/r². Yük sahədə F = qE qüvvəsi ilə təsirə məruz qalır. nKl və sm-lə: E = 90q/r² kV/m. mkKl·kV/m = mN.",
      gen() {
        const kind = pick(["E", "q", "r", "F", "Ef", "bal", "bal", "acc", "ang"]);
        if (kind === "E" || kind === "q" || kind === "r") {
          let a, c, e; do { a = rnd(1, 20); c = pick([2, 3, 4, 5, 6, 9, 10, 12, 15, 20, 30]); e = E1(a, c); } while (!nice(e, 2) || e < 0.1 || e > 2000);
          if (kind === "E") return R(e, "kV/m", { text: `Nöqtəvi ${a} nKl yükdən ${c} sm məsafədə elektrik sahəsinin intensivliyi neçə kV/m-dir? (k = 9·10⁹ N·m²/Kl²)`,
            solution: `E = kq/r² = 9·10⁹·${a}·10⁻⁹/(${F(c / 100)})² = ${F(9 * a)}/${F((c / 100) ** 2)} = ${F(e * 1000)} V/m = ${F(e)} kV/m.` });
          if (kind === "q") return R(a, "nKl", { text: `Nöqtəvi yükdən ${c} sm məsafədə sahənin intensivliyi ${F(e)} kV/m-dir. Yükün modulu neçə nKl-dur? (k = 9·10⁹ N·m²/Kl²)`,
            solution: `q = Er²/k = ${F(e * 1000)}·${F((c / 100) ** 2)}/(9·10⁹) = ${a}·10⁻⁹ Kl = ${a} nKl.` });
          return R(c, "sm", { text: `${a} nKl nöqtəvi yükün sahəsinin intensivliyi ${F(e)} kV/m olan nöqtə yükdən neçə sm uzaqdadır? (k = 9·10⁹ N·m²/Kl²)`,
            solution: `r² = kq/E = 9·${a}/${F(e * 1000)} = ${F((c / 100) ** 2)} m² → r = ${F(c / 100)} m = ${c} sm.` });
        }
        if (kind === "F" || kind === "Ef") {
          let q, e; do { q = pick([0.5, 1, 2, 2.5, 3, 4, 5, 8, 10]); e = pick([1, 2, 2.5, 4, 5, 10, 20, 50]); } while (!nice(q * e, 2));
          if (kind === "F") return R(q * e, "mN", { text: `${F(q)} mkKl yük intensivliyi ${F(e)} kV/m olan bircins sahəyə daxil olub. Yükə təsir edən qüvvənin modulu neçə mN-dir?`,
            solution: `F = qE = ${F(q)}·10⁻⁶·${F(e)}·10³ = ${F(q * e)}·10⁻³ N = ${F(q * e)} mN.` });
          return R(e, "kV/m", { text: `Sahədə ${F(q)} mkKl yükə ${F(q * e)} mN qüvvə təsir edir. Sahənin intensivliyi neçə kV/m-dir?`,
            solution: `E = F/q = ${F(q * e)}·10⁻³/(${F(q)}·10⁻⁶) = ${F(e * 1000)} V/m = ${F(e)} kV/m.` });
        }
        if (kind === "bal") {
          let c, e, q; do { c = pick([0.1, 0.2, 0.5, 1, 2, 3, 4, 5]); e = pick([1, 2, 4, 5, 10, 20, 25, 50]); q = 10 * c / e; } while (!nice(q, 2));
          const askE = Math.random() < .4;
          const base = `Kütləsi ${F(c)} q olan kiçik kürə şaquli yuxarı yönəlmiş bircins elektrik sahəsində hərəkətsiz asılıb (g = 10 m/s²). `;
          if (askE) return R(e, "kV/m", { text: base + `Kürənin yükü ${F(q)} mkKl-dur (müsbət). Sahənin intensivliyi neçə kV/m-dir?`,
            solution: `Tarazlıq: qE = mg. mg = ${F(c / 1000)}·10 = ${F(c / 100)} N = ${F(10 * c)} mN. E = mg/q = ${F(10 * c)} mN/${F(q)} mkKl = ${F(e)} kV/m.` });
          return R(q, "mkKl", { text: base + `Sahənin intensivliyi ${F(e)} kV/m-dir. Kürənin yükü neçə mkKl-dur?`,
            solution: `Tarazlıq: qE = mg. mg = ${F(c / 1000)}·10 = ${F(c / 100)} N = ${F(10 * c)} mN. q = mg/E = ${F(10 * c)}/${F(e)} = ${F(q)} mkKl.` });
        }
        if (kind === "acc") {
          let q, e, c, a; do { q = pick([1, 2, 3, 4, 5, 6, 10]); e = pick([1, 2, 3, 4, 5, 10, 20]); c = pick([0.5, 1, 2, 4, 5, 10]); a = q * e / c; } while (!nice(a, 2) || a > 500);
          return R(a, "m/s²", { text: `Kütləsi ${F(c)} q, yükü ${q} mkKl olan zərrəcik intensivliyi ${e} kV/m olan üfüqi bircins sahədə sərbəst hərəkət edir (ağırlıq qüvvəsini nəzərə alma). Təcili neçə m/s²-dir?`,
            solution: `F = qE = ${q}·10⁻⁶·${e}·10³ = ${F(q * e / 1000)} N. m = ${F(c)} q = ${F(c / 1000)} kq. a = F/m = ${F(q * e / 1000)}/${F(c / 1000)} = ${F(a)} m/s².` });
        }
        const A = pick([["45°", 1], ["tgα = 0,5", 0.5], ["tgα = 0,75", 0.75], ["tgα = 1,5", 1.5], ["tgα = 2", 2]]);
        let c, q, e; do { c = pick([0.2, 0.4, 0.5, 1, 2, 4, 5]); q = pick([1, 2, 4, 5, 10]); e = 10 * c * A[1] / q; } while (!nice(e, 2) || e > 100);
        return R(e, "kV/m", { text: `Kütləsi ${F(c)} q olan, yükü ${q} mkKl olan kürə nazik sapdan asılıb. Üfüqi bircins sahədə sap şaquldan ${A[0].startsWith("tg") ? "elə bir α bucağı qədər meyl edir ki, " + A[0] : A[0] + " meyl edir"} (g = 10 m/s²). Sahənin intensivliyi neçə kV/m-dir?`,
          solution: `Kürəyə: ağırlıq mg (aşağı), qE (üfüqi), sapın dartması. Tarazlıqda tgα = qE/(mg). mg = ${F(10 * c)} mN. E = mg·tgα/q = ${F(10 * c)}·${F(A[1])}/${q} = ${F(e)} kV/m.` });
      } },

    { id: "superpoz", ad: "Superpozisiya", izah: "Bir neçə yükün sahəsi vektorların cəmidir. Düz xətt üzərində istiqamətlərə bax: eyni yönlüdürsə topla, əks yönlüdürsə çıx. Müsbət yükdən sahə uzaqlaşır, mənfiyə yaxınlaşır.",
      gen() {
        for (;;) {
          const mode = pick(["arada", "arada", "kenar", "sol"]);
          const a = pick([1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 16, 20]), b = pick([1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 16, 20]);
          const sa = pick([1, -1]), sb = pick([1, -1]), d = pick([10, 12, 15, 20, 24, 30, 40]);
          let M; if (mode === "arada") M = rnd(2, d - 2); else if (mode === "kenar") M = d + rnd(2, 20); else M = -rnd(2, 20);
          const r1 = Math.abs(M), r2 = Math.abs(M - d);
          const e1 = E1(a, r1), e2 = E1(b, r2);
          const dir1 = sa * Math.sign(M), dir2 = sb * Math.sign(M - d);
          const e = Math.abs(dir1 * e1 + dir2 * e2);
          if (!nice(e1, 2) || !nice(e2, 2) || !nice(e, 2) || e < 0.05 || e > 3000 || Math.max(r1, r2, d) / Math.min(r1, r2, d) > 6) continue;
          const q1 = sa * a, q2 = sb * b;
          const side = dir1 === dir2 ? "eyni yönlüdür, ona görə toplanır" : "əks yönlüdür, ona görə çıxılır";
          return R(e, "kV/m", { svg: lineFig([{ x: 0, q: q1 }, { x: d, q: q2 }], M),
            text: `Şəkildə q₁ = ${sg(q1)} nKl və q₂ = ${sg(q2)} nKl nöqtəvi yükləri ${d} sm məsafədə yerləşib. M nöqtəsində sahənin intensivliyinin modulu neçə kV/m-dir? (k = 9·10⁹ N·m²/Kl², E = 90q/r² kV/m)`,
            solution: `q₁-dən M-ə ${r1} sm: E₁ = 90·${a}/${r1}² = ${F(e1)} kV/m. q₂-dən M-ə ${r2} sm: E₂ = 90·${b}/${r2}² = ${F(e2)} kV/m. İki sahə ${side}: E = ${dir1 === dir2 ? F(e1) + " + " + F(e2) : F(Math.max(e1, e2)) + " − " + F(Math.min(e1, e2))} = ${F(e)} kV/m.` });
        }
      } },

    { id: "sifir", ad: "Sahənin sıfır nöqtəsi, tarazlıq", izah: "Sahə sıfırdır, harada ki iki yükün sahələri əks yönlü və modulca bərabərdir: q₁/x₁² = q₂/x₂². Eyni işarəli yüklərin arasında, əks işarəlilərdə (modulları fərqli olduqda) kənarda, kiçik yükün tərəfində. Bu nöqtədə üçüncü yük tarazlıqda qalar.",
      gen() {
        const kind = pick(["ara", "ara", "kenar", "uc"]);
        if (kind === "ara") {
          const n = pick([2, 3, 4]), t = rnd(2, 8), d = (1 + n) * t, a = rnd(1, 6), s = pick([1, -1]);
          return R(t, "sm", { svg: lineFig([{ x: 0, q: s * a }, { x: d, q: s * a * n * n }]),
            text: `Eyni işarəli iki nöqtəvi yük (${sg(s * a)} nKl və ${sg(s * a * n * n)} nKl) bir-birindən ${d} sm aralıdadır. Elektrik sahəsinin intensivliyi sıfır olan nöqtə birinci yükdən neçə sm məsafədədir?`,
            solution: `Eyni işarəli yüklərdə sıfır nöqtə aralarındadır. ${a}/x² = ${a * n * n}/(${d} − x)² → (${d} − x)/x = √${n * n} = ${n} → ${d} − x = ${n}x → x = ${d}/${1 + n} = ${t} sm.` });
        }
        if (kind === "kenar") {
          const n = pick([2, 3, 4]), t = rnd(2, 8), d = (n - 1) * t, a = rnd(1, 6), s = pick([1, -1]);
          return R(t, "sm", { svg: lineFig([{ x: 0, q: s * a }, { x: d, q: -s * a * n * n }]),
            text: `İki nöqtəvi yük əks işarəlidir: ${sg(s * a)} nKl və ${sg(-s * a * n * n)} nKl, aralarındakı məsafə ${d} sm-dir. Sahənin intensivliyi sıfır olan nöqtə yüklərdən kənardadır. O, kiçik (modulca) yükdən neçə sm uzaqdadır?`,
            solution: `Sıfır nöqtə kiçik yükün kənarında olur. Kiçik yükdən x məsafədə: ${a}/x² = ${a * n * n}/(x + ${d})² → (x + ${d})/x = ${n} → x = ${d}/${n - 1} = ${t} sm.` });
        }
        let n, Q, d; do { n = pick([1, 2, 3]); Q = rnd(1, 40); d = pick([10, 20, 30, 40]); } while (!nice(Q * n * n / ((1 + n) ** 2), 2));
        const q = Q * n * n / ((1 + n) ** 2);
        return R(q, "nKl", { svg: lineFig([{ x: 0, q: Q }, { x: d, q: Q * n * n }]),
          text: `Bərkidilmiş iki müsbət yük: ${Q} nKl və ${Q * n * n} nKl, aralarında ${d} sm var. Aralarına üçüncü yük (bərkidilməmiş) elə qoymaq lazımdır ki, hər üç yük tarazlıqda qalsın. Üçüncü yükün modulu neçə nKl-dur?`,
          solution: `Üçüncü yük sahənin sıfır nöqtəsində olmalıdır: ${Q}-dən x = ${d}/${1 + n} məsafədə. ${Q} nKl yükünün tarazlığı: kQq/x² = kQ·${Q * n * n}/d² → q = ${Q * n * n}·x²/d² = ${Q * n * n}/${(1 + n) ** 2} (nKl) = ${F(q)} nKl (işarəsi mənfi).` });
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let a, b, c, f; do { a = rnd(1, 9); b = rnd(1, 9); c = pick([2, 3, 4, 5, 6, 9, 10, 12, 15, 20]); f = 90 * a * b / (c * c); } while (!nice(f, 2) || f < 0.05 || f > 1000);
          task = `q₁ = ${a} mkKl və q₂ = ${b} mkKl nöqtəvi yükləri ${c} sm məsafədədir. Qarşılıqlı təsir qüvvəsi neçə N-dur?`;
          steps = [
            `SI-yə çevirək: q₁ = ${a}·10⁻⁶ Kl, q₂ = ${b}·10⁻⁶ Kl, r = ${c} sm = ${F(c / 100)} m.`,
            `Kulon qanunu: F = k·q₁q₂/r² = 9·10⁹·${a * b}·10⁻¹²/(${F(c / 100)})².`,
            `F = ${F(9 * a * b / 1000)}/${F((c / 100) ** 2)} = ${F(f)} N.`,
          ];
          if (bad === 0) steps[0] = `SI-yə çevirək: q₁ = ${a}·10⁻⁶ Kl, q₂ = ${b}·10⁻⁶ Kl, r = ${c} sm = ${F(c / 1000)} m.`;
          if (bad === 1) steps[1] = `Kulon qanunu: F = k·q₁q₂/r = 9·10⁹·${a * b}·10⁻¹²/${F(c / 100)}.`;
          if (bad === 2) steps[2] = `F = ${F(9 * a * b / 1000)}/${F((c / 100) ** 2)} = ${F(f * 10)} N.`;
          if (bad === 1) steps[2] = `F = ${F(9 * a * b / 1000)}/${F(c / 100)} = ${F(9 * a * b / (10 * c))} N.`;
          if (bad === 0) steps[2] = `F = ${F(9 * a * b / 1000)}/${F((c / 1000) ** 2)} = ${F(9 * a * b / 1000 / ((c / 1000) ** 2))} N.`;
          if (bad === 0) steps[1] = `Kulon qanunu: F = k·q₁q₂/r² = 9·10⁹·${a * b}·10⁻¹²/(${F(c / 1000)})².`;
          why = [`1-ci addım: 1 sm = 10⁻² m, ${c} sm = ${F(c / 100)} m (10⁻³ yox). Düz cavab ${F(f)} N.`,
            `2-ci addım: Kulon qanununda məsafənin KVADRATI durur: r². Düz cavab ${F(f)} N.`,
            `3-cü addım: ${F(9 * a * b / 1000)}/${F((c / 100) ** 2)} = ${F(f)} N, ${F(f * 10)} yox.`][bad];
        } else {
          let a, b, r, s; do { a = rnd(1, 20); b = rnd(1, 20); r = pick([3, 5, 6, 10]); } while (a === b || !nice(E1(a, r), 2) || !nice(E1(b, r), 2));
          const e1 = E1(a, r), e2 = E1(b, r), e = Math.abs(e1 - e2);
          task = `Eyni işarəli iki yük (${a} nKl və ${b} nKl) bir-birindən ${2 * r} sm aralıdadır. Onları birləşdirən parçanın ortasında sahənin intensivliyi neçə kV/m-dir?`;
          steps = [
            `Orta nöqtə hər yükdən ${r} sm məsafədədir: E₁ = 90·${a}/${r}² = ${F(e1)} kV/m, E₂ = 90·${b}/${r}² = ${F(e2)} kV/m.`,
            `Eyni işarəli yüklərin sahələri ortada əks yönlüdür, ona görə çıxırıq.`,
            `E = ${F(Math.max(e1, e2))} − ${F(Math.min(e1, e2))} = ${F(e)} kV/m.`,
          ];
          if (bad === 0) steps[0] = `Orta nöqtə hər yükdən ${2 * r} sm məsafədədir: E₁ = 90·${a}/${2 * r}² = ${F(E1(a, 2 * r))} kV/m, E₂ = 90·${b}/${2 * r}² = ${F(E1(b, 2 * r))} kV/m.`;
          if (bad === 0) steps[2] = `E = ${F(Math.max(E1(a, 2 * r), E1(b, 2 * r)))} − ${F(Math.min(E1(a, 2 * r), E1(b, 2 * r)))} = ${F(Math.abs(E1(a, 2 * r) - E1(b, 2 * r)))} kV/m.`;
          if (bad === 1) { steps[1] = `Sahələr cismin yanından keçir, ona görə toplanır.`; steps[2] = `E = ${F(e1)} + ${F(e2)} = ${F(e1 + e2)} kV/m.`; }
          if (bad === 2) steps[2] = `E = ${F(Math.max(e1, e2))} − ${F(Math.min(e1, e2))} = ${F(e + 10)} kV/m.`;
          why = [`1-ci addım: ortaya qədər məsafə ${2 * r}/2 = ${r} sm-dir, ${2 * r} yox. Düz cavab ${F(e)} kV/m.`,
            `2-ci addım: eyni işarəli yüklərdən sahələr ortada əks tərəfə yönəlir, çıxılır. Düz cavab ${F(e)} kV/m.`,
            `3-cü addım: ${F(Math.max(e1, e2))} − ${F(Math.min(e1, e2))} = ${F(e)} kV/m.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Daraq, balon, qığılcım, elektrofiltr — hamısı yük, Kulon qanunu və sahədir.",
      gen() {
        const kind = pick(["daraq", "sicr", "toz", "balon"]);
        if (kind === "daraq") {
          const a = rnd(1, 9), p = pick([10, 11]), q = 1.6 * a * 10 ** (p - 10) * 1e-3;   // in mkKl
          return R(q, "mkKl", { text: `Fikrət plastik daraqla yun şalı sürtdü və daraq yun şaldan ${a}·10${sup(p)} elektron aldı. Şalın yükü neçə mkKl oldu? (e = 1,6·10⁻¹⁹ Kl, 1 mkKl = 10⁻⁶ Kl)`,
            solution: `Şal elektron itirdi, yükü müsbət oldu və modulca daraqın yükünə bərabərdir (yük saxlanır). q = N·e = ${a}·10${sup(p)}·1,6·10⁻¹⁹ = ${F(1.6 * a)}·10${sup(p - 19)} Kl = ${F(q)}·10⁻⁶ Kl = ${F(q)} mkKl.` });
        }
        if (kind === "sicr") {
          const Rr = pick([3, 6, 9, 12, 15]), q = 300 * (Rr / 3) ** 2 / 1000;
          return R(q, "mkKl", { text: `Havada sahənin intensivliyi 3·10⁶ V/m-dən çox olanda qığılcım (boşalma) başlayır. Radiusu ${Rr} sm olan metal kürənin səthində sahə nöqtəvi yükün sahəsi kimidir: E = kq/R². Qığılcım olmadan kürəyə vermək olan ən böyük yük neçə mkKl-dur? (k = 9·10⁹ N·m²/Kl²)`,
            solution: `q = E·R²/k = 3·10⁶·(${F(Rr / 100)})²/(9·10⁹) = ${F(3e6 * (Rr / 100) ** 2)}/(9·10⁹) = ${F(q)}·10⁻⁶ Kl = ${F(q)} mkKl.` });
        }
        if (kind === "toz") {
          let c, e, q; do { c = pick([0.2, 0.5, 1, 2, 4, 5]); e = pick([2, 4, 5, 10, 20, 25]); q = 10 * c / e; } while (!nice(q, 2));
          return R(q, "mkKl", { text: `Elektrofiltr nümayişində yüngül kağız topu (kütləsi ${F(c)} q) şaquli yuxarı yönəlmiş ${e} kV/m sahədə havada dayanıb. Topun yükü neçə mkKl-dur? (g = 10 m/s²)`,
            solution: `Tarazlıq: qE = mg. mg = ${F(c / 1000)}·10 = ${F(c / 100)} N = ${F(10 * c)} mN. q = mg/E = ${F(10 * c)}/${e} = ${F(q)} mkKl.` });
        }
        let a, c, f; do { a = rnd(1, 9); c = pick([3, 5, 6, 10, 15, 30]); f = 90 * a * a / (c * c) * 1000; } while (!nice(f, 2) || f < 1);
        return R(f, "mN", { text: `İki eyni balonu yun parçasına sürtdülər: hər birinin yükü ${a} mkKl-dur. Balonlar bir-birindən ${c} sm aralıda tutulub. Onlar bir-birini neçə mN qüvvə ilə itələyir? (k = 9·10⁹ N·m²/Kl²)`,
          solution: `F = 90·q₁q₂/r² = 90·${a}·${a}/${c}² = ${F(f / 1000)} N = ${F(f)} mN.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-kulon", title: "Elektrik yükü, Kulon qanunu, elektrik sahəsi", fenn: "fizika", link: "dersler/fiz-kulon.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (məs. N, kV/m, nKl, mkKl, sm). Onluq kəsr vergül və ya nöqtə ilə: 0,9. k = 9·10⁹ N·m²/Kl².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["yuk", "kulon", "kulon", "sahe", "sahe", "superpoz", "superpoz", "sifir", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-kulon.html")) b.push("dersler/fiz-kulon.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
