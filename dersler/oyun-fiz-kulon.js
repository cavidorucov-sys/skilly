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
          return R(q, "mkKl", { text: `Elvin plastik daraqla yun şalı sürtdü və daraq yun şaldan ${a}·10${sup(p)} elektron aldı. Şalın yükü neçə mkKl oldu? (e = 1,6·10⁻¹⁹ Kl, 1 mkKl = 10⁻⁶ Kl)`,
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

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a figure, several steps;
  // the wrong options are the answers of typical mistakes. Questions 4, 5, 7, 8, 9 also use an earlier topic
  // (vectors, Newton's 2nd law, kinematics, Hooke's law). Units: mkKl & sm → F = 90·|q₁q₂|/r² N; nKl & sm → E = 90·|q|/r² kV/m.
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  const MUT = "var(--muted,#6b6b73)", ACC = "var(--accent,#a32d2d)", VEC = "var(--vec,#0c447c)", PAP = "var(--paper,#fff)";
  const f1 = n => +(+n).toFixed(1);
  const Tx = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const Li = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const Ar = (x1, y1, x2, y2, c = ACC, w = 2.5) => Li(x1, y1, x2, y2, c, w, ` marker-end="url(#kq-ar)"`);
  const Ch = (x, y, q, r = 11) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${q > 0 ? POS : NEG}"/>` + Tx(x, y + 5, q > 0 ? "+" : "−", "middle", "#fff", 15);
  const Dim = (x1, x2, y, lab) => Li(x1, y, x2, y, MUT, 1.2) + Li(x1, y - 6, x1, y + 6, MUT, 1.2) + Li(x2, y - 6, x2, y + 6, MUT, 1.2) + Tx((x1 + x2) / 2, y + 17, lab, "middle", INK, 12);
  const svS = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" class="oy-svg" role="img" aria-label="${aria}"><defs><marker id="kq-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  // charges on a line: [{x (sm), q, lab}], optional point M (x in sm); names in the figure, values in the text
  function figLine(cs, M) {
    const W = 300, pad = 40, xs = cs.map(c => c.x).concat(M == null ? [] : [M]);
    const lo = Math.min(...xs), hi = Math.max(...xs), X = x => pad + (x - lo) * (W - 2 * pad) / (hi - lo);
    let s = Li(10, 50, W - 10, 50, INK, 1.5);
    cs.forEach(c => { s += Ch(X(c.x), 50, c.q) + Tx(X(c.x), 28, c.lab); });
    if (M != null) s += `<circle cx="${f1(X(M))}" cy="50" r="4" fill="${INK}"/>` + Tx(X(M), 34, "M");
    const pts = [...new Set(xs)].sort((a, b) => a - b);
    for (let i = 0; i + 1 < pts.length; i++) s += Dim(X(pts[i]), X(pts[i + 1]), 80, F(pts[i + 1] - pts[i]) + " sm");
    return svS(W, 112, s, "Düz xətt üzərində nöqtəvi yüklər" + (M != null ? " və M nöqtəsi" : ""));
  }
  // two identical spheres before and after touching
  function figContact(q1, q2, r, r2) {
    const k = 180 / Math.max(r, r2), qn = (q1 + q2) / 2;
    let s = Ch(60, 34, q1, 12) + Ch(60 + r * k, 34, q2, 12) + Tx(60, 15, "q₁") + Tx(60 + r * k, 15, "q₂") + Dim(60, 60 + r * k, 56, F(r) + " sm");
    s += Ar(26, 70, 26, 102, MUT, 2) + Tx(36, 90, "toxundurub ayırdılar", "start", MUT, 11);
    s += Ch(60, 124, qn, 12) + Ch(60 + r2 * k, 124, qn, 12) + Tx(60, 105, "q′") + Tx(60 + r2 * k, 105, "q′") + Dim(60, 60 + r2 * k, 146, F(r2) + " sm");
    return svS(280, 176, s, "Eyni iki metal kürə: əvvəl q₁ və q₂, toxunub ayrılandan sonra hər biri q′");
  }
  // right triangle ACB, right angle at C; charges at A and B
  function figRight(q1, q2, a, b) {
    const C = [60, 160], A = [60, 30], B = [250, 160];
    const s = Li(A[0], A[1], C[0], C[1], MUT, 1.5) + Li(C[0], C[1], B[0], B[1], MUT, 1.5) + Li(A[0], A[1], B[0], B[1], MUT, 1, ` stroke-dasharray="4 4"`)
      + `<polyline points="60,146 74,146 74,160" fill="none" stroke="${MUT}" stroke-width="1.2"/>`
      + Ch(A[0], A[1], q1) + Tx(A[0] - 16, A[1] + 5, "q₁", "end") + Ch(B[0], B[1], q2) + Tx(B[0], B[1] + 28, "q₂")
      + `<circle cx="60" cy="160" r="4" fill="${INK}"/>` + Tx(50, 178, "C", "end")
      + Tx(52, 100, F(a) + " sm", "end", INK, 12) + Tx(155, 178, F(b) + " sm", "middle", INK, 12);
    return svS(290, 192, s, "Düzbucaqlı üçbucaq: q₁ və q₂ yükləri iti bucaqların təpələrində, C düz bucağın təpəsi");
  }
  // a small charged ball on a thread in a horizontal uniform field
  function figThread(mg, qE) {
    const al = Math.atan2(qE, mg), L = 112, px = 120, py = 22, bx = px + L * Math.sin(al), by = py + L * Math.cos(al);
    let s = Li(80, py, 160, py, INK, 3);
    for (let x = 84; x <= 156; x += 12) s += Li(x, py, x - 8, py - 9, INK, 1.2);
    s += Li(px, py, px, py + L + 8, MUT, 1, ` stroke-dasharray="4 4"`) + Li(px, py, bx, by, INK, 1.6) + Tx(px + 70 * Math.sin(al / 2), py + 70 * Math.cos(al / 2) + 4, "α", "middle", MUT, 13);
    for (const y of [70, 110, 150]) s += Ar(14, y, 62, y, VEC, 2);
    s += Tx(38, 62, "E", "middle", VEC, 14) + `<circle cx="${f1(bx)}" cy="${f1(by)}" r="9" fill="${POS}"/>` + Tx(bx, by + 4, "+", "middle", "#fff", 12);
    return svS(270, 172, s, "Yüklü kürə sapdan asılıb, üfüqi bircins sahədə sap şaquldan α bucağı qədər meyl edib");
  }
  // horizontal plates, the field points up, a droplet in between
  function figDrop() {
    let s = Li(50, 28, 230, 28, INK, 4) + Li(50, 152, 230, 152, INK, 4);
    for (let x = 64; x <= 216; x += 38) s += Tx(x, 20, "−", "middle", NEG, 15) + Tx(x, 172, "+", "middle", POS, 15);
    for (const x of [70, 210]) s += Ar(x, 142, x, 40, VEC, 2);
    s += Tx(222, 92, "E", "start", VEC, 14) + `<circle cx="140" cy="90" r="7" fill="${POS}"/>` + Ar(140, 81, 140, 50, ACC, 2.2) + Tx(148, 62, "qE", "start", ACC, 12)
      + Ar(140, 99, 140, 130, INK, 2.2) + Tx(148, 126, "mg", "start", INK, 12);
    return svS(260, 182, s, "Üfüqi lövhələr arasında yağ damcısı; sahə şaquli yuxarı yönəlib");
  }
  // vertical plates, the field points right, a particle at rest
  function figPart() {
    let s = Li(40, 22, 40, 158, INK, 4) + Li(220, 22, 220, 158, INK, 4);
    for (let y = 34; y <= 150; y += 29) s += Tx(28, y + 5, "+", "middle", POS, 15) + Tx(234, y + 5, "−", "middle", NEG, 15);
    for (const y of [40, 140]) s += Ar(52, y, 206, y, VEC, 2);
    s += Tx(130, 32, "E", "middle", VEC, 14) + `<circle cx="80" cy="90" r="7" fill="${POS}"/>` + Tx(80, 116, "v₀ = 0") + Ar(92, 90, 140, 90, ACC, 2.2) + Tx(116, 82, "qE", "middle", ACC, 12);
    return svS(260, 180, s, "Şaquli lövhələr arasında zərrəcik sükunətdən başlayır; sahə üfüqi yönəlib");
  }
  // two balls joined by a spring: before (no charge) and after (charged)
  function figSpring(L0, L) {
    const k = 190 / L, sp = (x1, x2, y) => { const n = 10, a = x1 + 12, b = x2 - 12; let p = `${f1(x1)},${y} ${f1(a)},${y}`; for (let i = 0; i < n; i++) p += ` ${f1(a + (b - a) * (i + .5) / n)},${y + (i % 2 ? 7 : -7)}`; return `<polyline points="${p} ${f1(b)},${y} ${f1(x2)},${y}" fill="none" stroke="${INK}" stroke-width="1.6"/>`; };
    let s = sp(40, 40 + L0 * k, 36) + `<circle cx="40" cy="36" r="10" fill="${MUT}"/><circle cx="${f1(40 + L0 * k)}" cy="36" r="10" fill="${MUT}"/>` + Dim(40, 40 + L0 * k, 58, "L₀") + Tx(258, 11, "yüksüz", "end", MUT, 11);
    s += sp(40, 40 + L * k, 112) + Ch(40, 112, 1, 10) + Ch(40 + L * k, 112, 1, 10) + Tx(40, 92, "q") + Tx(40 + L * k, 92, "q") + Dim(40, 40 + L * k, 134, F(L) + " sm");
    return svS(270, 166, s, "Yayla birləşdirilmiş iki kürə: yüksüz halda yayın uzunluğu L₀, yük verildikdən sonra mərkəzlər arası L");
  }
  // equilateral triangle ABC, charges at all three vertices
  function figEq(qa, qb, qc, a) {
    const A = [60, 165], B = [220, 165], C = [140, 165 - 80 * Math.sqrt(3)];
    const s = Li(A[0], A[1], B[0], B[1], MUT, 1.5) + Li(B[0], B[1], C[0], C[1], MUT, 1.5) + Li(C[0], C[1], A[0], A[1], MUT, 1.5)
      + Ch(A[0], A[1], qa) + Ch(B[0], B[1], qb) + Ch(C[0], C[1], qc) + Tx(A[0] - 16, A[1] + 5, "A", "end") + Tx(B[0] + 16, B[1] + 5, "B", "start") + Tx(C[0] + 16, C[1] + 5, "C", "start")
      + Tx(140, 186, F(a) + " sm", "middle", INK, 12);
    return svS(280, 196, s, "Bərabərtərəfli üçbucağın A, B, C təpələrində yüklər");
  }
  const dir = f => f > 0 ? "sağa" : "sola";
  const r3 = (k, r) => (k === 1 ? "" : F(k)) + r + " N";   // "6√3 N", "√3 N"
  // right-triangle pool (q in nKl, legs in sm) with a nice resultant field
  const RT = [];
  for (let a1 = 1; a1 <= 30; a1++) for (let a2 = 1; a2 <= 30; a2++) for (const x of [3, 4, 5, 6, 9, 10, 12, 15, 20, 30]) for (const y of [3, 4, 5, 6, 9, 10, 12, 15, 20, 30]) {
    const e1 = E1(a1, x), e2 = E1(a2, y), e = Math.hypot(e1, e2);
    if (ok2(e1) && ok2(e2) && ok2(e) && ok2(e1 * e1 + e2 * e2) && e1 !== e2 && e <= 600 && e >= 1 && Math.max(x, y) / Math.min(x, y) <= 3) RT.push([a1, a2, x, y, e1, e2, e]);
  }
  const TRIP = [[3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [8, 6], [8, 15], [15, 8], [7, 24], [24, 7]];

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. three charges on a line: the net force on the middle one
    { tip: "qapali", gen: () => again(() => {
      const Q = [1, 2, 3, 4, 5, 6, 8, 9, 10], D = [3, 5, 6, 10, 15, 20, 30];
      const a = pick(Q), b = pick(Q), c = pick(Q), s1 = pick([1, -1]), s2 = pick([1, -1]), s3 = pick([1, -1]), d1 = pick(D), d2 = pick(D);
      if (Math.max(d1, d2) / Math.min(d1, d2) > 4) return null;
      const F12 = 90 * a * b / (d1 * d1), F32 = 90 * c * b / (d2 * d2), g1 = s1 * s2 * F12, g3 = -s3 * s2 * F32;   // + = to the right
      const Fr = Math.abs(g1 + g3), Fo = Math.abs(g1 - g3), Ff = Math.abs(g1 - s3 * s2 * 90 * c * b / ((d1 + d2) ** 2));
      if (![F12, F32, Fr, Fo, Ff].every(x => ok2(x)) || Fr > 2000) return null;
      const q1 = s1 * a, q2 = s2 * b, q3 = s3 * c, same = Math.sign(g1) === Math.sign(g3);
      return mc(ae(Fr, [Fo, F12, F32, Ff], U_("N")), { svg: svgEl(figLine([{ x: 0, q: q1, lab: "q₁" }, { x: d1, q: q2, lab: "q₂" }, { x: d1 + d2, q: q3, lab: "q₃" }])),
        text: `Şəkildə üç nöqtəvi yük bir düz xətt üzərindədir: q₁ = ${sg(q1)} mkKl, q₂ = ${sg(q2)} mkKl, q₃ = ${sg(q3)} mkKl. q₁ ilə q₂ arasındakı məsafə ${d1} sm, q₂ ilə q₃ arasındakı məsafə ${d2} sm-dir. q₂ yükünə təsir edən yekun qüvvənin modulu nə qədərdir? (k = 9·10⁹ N·m²/Kl²)`,
        solution: `mkKl və sm ilə: F = 90·|q₁q₂|/r² N. q₁-dən: F₁ = 90·${a}·${b}/${d1}² = ${F(F12)} N, ${s1 === s2 ? "itələmə" : "cəzbetmə"} → ${dir(g1)}. q₃-dən: F₃ = 90·${c}·${b}/${d2}² = ${F(F32)} N, ${s3 === s2 ? "itələmə" : "cəzbetmə"} → ${dir(g3)}. ${same ? "Eyni yönlüdür, toplanır" : "Əks yönlüdür, çıxılır"}: F = ${same ? F(F12) + " + " + F(F32) : F(Math.max(F12, F32)) + " − " + F(Math.min(F12, F32))} = ${F(Fr)} N. Tələlər: istiqamətə baxmamaq (${F(Fo)} N), yalnız bir qüvvə (${F(F12)} N və ya ${F(F32)} N), q₃-ün məsafəsini q₁-dən ölçmək (${d1 + d2} sm → ${F(Ff)} N).` });
    }) },
    // 2. identical spheres touch, then are put at a new distance
    { tip: "qapali", gen: () => again(() => {
      const Q = [1, 2, 3, 4, 5, 6, 8, 10, 12], a = pick(Q), b = pick(Q), s1 = pick([1, -1]), s2 = pick([1, -1]), q1 = s1 * a, q2 = s2 * b;
      const r = pick([3, 5, 6, 10, 15, 20, 30]), c = pick([2, 3, 1 / 2]), r2 = r * c, qn = (q1 + q2) / 2;
      if (qn === 0 || q1 === q2 || !Number.isInteger(r2) || r2 > 60) return null;
      const F1 = 90 * a * b / (r * r), F2 = 90 * qn * qn / (r2 * r2);
      if (!ok2(F1) || !ok2(F2) || F1 > 3000 || F2 > 3000) return null;
      const cand = [[90 * ((a + b) / 2) ** 2 / (r2 * r2), `işarəni nəzərə almamaq ((${a} + ${b})/2 = ${F((a + b) / 2)} mkKl)`], [F1 * qn * qn / (a * b) / c, "məsafəni kvadrata yüksəltməmək"],
        [F1 * qn * qn / (a * b), "məsafənin dəyişdiyini unutmaq"], [F1 / (c * c), "yükün dəyişdiyini unutmaq"], [4 * F2, "cəmi 2-yə bölməmək"]]
        .filter(x => ok2(x[0]) && F(x[0]) !== F(F2)).filter((x, i, A) => A.findIndex(y => F(y[0]) === F(x[0])) === i).slice(0, 4);
      if (cand.length < 4) return null;
      return mc(ae(F2, cand.map(x => x[0]), U_("N")), { svg: svgEl(figContact(q1, q2, r, r2)),
        text: `Eyni iki kiçik metal kürənin yükləri q₁ = ${sg(q1)} mkKl və q₂ = ${sg(q2)} mkKl-dur, aralarındakı məsafə ${r} sm-dir; qarşılıqlı təsir qüvvəsi ${F(F1)} N-dur. Kürələri toxundurub ayırdılar və ${r2} sm məsafəyə qoydular. İndi qarşılıqlı təsir qüvvəsi nə qədərdir? (Kürələr nöqtəvi sayılır.)`,
        solution: `Toxunandan sonra yük bərabər bölünür (işarə ilə!): q′ = (${F(q1)} + ${q2 < 0 ? "(" + F(q2) + ")" : F(q2)})/2 = ${F(qn)} mkKl. F₂ = 90·q′²/r² = 90·${F(qn * qn)}/${r2}² = ${F(F2)} N. Yoxlama nisbətlə: F₂/F₁ = (${F(qn * qn)}/${a * b})·(${r}/${r2})² = ${F(+(F2 / F1).toFixed(4))}. Tələlər: ${cand.map(x => x[1] + " (" + F(+x[0].toFixed(4)) + " N)").join(", ")}.` });
    }) },
    // 3. field of two charges at a point M on the same line
    { tip: "qapali", gen: () => again(() => {
      const Q = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 16, 20], a = pick(Q), b = pick(Q), sa = pick([1, -1]), sb = pick([1, -1]), d = pick([10, 12, 15, 20, 24, 30, 40]);
      const M = Math.random() < .6 ? rnd(2, d - 2) : d + rnd(2, 20), r1 = M, r2 = Math.abs(M - d);
      if (Math.max(r1, r2, d) / Math.min(r1, r2, d) > 4) return null;
      const e1 = E1(a, r1), e2 = E1(b, r2), dir1 = sa, dir2 = sb * Math.sign(M - d), e = Math.abs(dir1 * e1 + dir2 * e2), eo = Math.abs(dir1 * e1 - dir2 * e2);
      const nk = Math.abs(dir1 * 90 * a / r1 + dir2 * 90 * b / r2);
      if (![e1, e2, e, eo, nk].every(x => ok2(x)) || e > 2000) return null;
      const q1 = sa * a, q2 = sb * b, same = dir1 === dir2;
      return mc(ae(e, [eo, e1, e2, nk], U_("kV/m")), { svg: svgEl(figLine([{ x: 0, q: q1, lab: "q₁" }, { x: d, q: q2, lab: "q₂" }], M)),
        text: `Şəkildə q₁ = ${sg(q1)} nKl və q₂ = ${sg(q2)} nKl nöqtəvi yükləri bir-birindən ${d} sm aralıdadır. M nöqtəsi q₁-dən ${r1} sm, q₂-dən ${r2} sm məsafədədir${M > d ? " (yüklərin arasında deyil)" : ""}. M nöqtəsində elektrik sahəsinin intensivliyi nə qədərdir? (k = 9·10⁹ N·m²/Kl²)`,
        solution: `nKl və sm ilə: E = 90·|q|/r² kV/m. E₁ = 90·${a}/${r1}² = ${F(e1)} kV/m, E₂ = 90·${b}/${r2}² = ${F(e2)} kV/m. Müsbət yükün sahəsi ondan uzağa, mənfininki ona doğru yönəlir: burada sahələr ${same ? "eyni yönlüdür → E = " + F(e1) + " + " + F(e2) : "əks yönlüdür → E = " + F(Math.max(e1, e2)) + " − " + F(Math.min(e1, e2))} = ${F(e)} kV/m. Tələlər: istiqamətə baxmamaq (${F(eo)} kV/m), yalnız bir yük (${F(e1)} və ya ${F(e2)} kV/m), r²-ni r yazmaq (${F(nk)}).` });
    }) },
    // 4. two charges at the acute vertices of a right triangle: the field at the right-angle vertex (vectors)
    { tip: "qapali", birlesik: "fiz-vektorlar", gen: () => again(() => {
      const [a1, a2, x, y, e1, e2, e] = pick(RT), s1 = pick([1, -1]), s2 = pick([1, -1]), q1 = s1 * a1, q2 = s2 * a2;
      return mc(ae(e, [e1 + e2, Math.abs(e1 - e2), e1 * e1 + e2 * e2, Math.max(e1, e2)], U_("kV/m")), { svg: svgEl(figRight(q1, q2, x, y)),
        text: `Düzbucaqlı üçbucağın iti bucaqlarının təpələrində q₁ = ${sg(q1)} nKl və q₂ = ${sg(q2)} nKl nöqtəvi yükləri var. Katetlər: q₁-dən C-yə ${x} sm, q₂-dən C-yə ${y} sm (C — düz bucağın təpəsi). C nöqtəsində elektrik sahəsinin intensivliyi nə qədərdir? (k = 9·10⁹ N·m²/Kl²)`,
        solution: `E₁ = 90·${a1}/${x}² = ${F(e1)} kV/m (katet boyunca), E₂ = 90·${a2}/${y}² = ${F(e2)} kV/m (o biri katet boyunca). Katetlər perpendikulyardır, ona görə vektorlar da perpendikulyardır (işarələr yalnız istiqaməti çevirir, bucaq yenə 90°-dir): E = √(E₁² + E₂²) = √(${F(e1 * e1)} + ${F(e2 * e2)}) = ${F(e)} kV/m. Tələlər: modulları toplamaq (${F(e1 + e2)}) və ya çıxmaq (${F(Math.abs(e1 - e2))}), kökü almamaq (${F(e1 * e1 + e2 * e2)}), yalnız bir yükü götürmək.` });
    }) },
    // 5. a ball on a thread in a horizontal field: tension (Newton, vectors)
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const [p, r] = pick(TRIP), k = pick([0.5, 1, 2, 4, 5, 10]), mg = p * k, qE = r * k, T = Math.hypot(p, r) * k, q = pick([1, 2, 4, 5, 10]), E = qE / q, m = mg / 10;
      if (!ok2(E) || !ok2(m) || !ok2(mg) || !ok2(qE)) return null;
      return mc(ae(T, [mg + qE, mg, qE, Math.abs(mg - qE)], U_("mN")), { svg: svgEl(figThread(mg, qE)),
        text: `Kütləsi ${F(m)} q, yükü +${F(q)} mkKl olan kiçik kürə yüngül izolyasiya sapından asılıb. Üfüqi yönəlmiş, intensivliyi ${F(E)} kV/m olan bircins elektrik sahəsində kürə tarazlıqdadır (şəkil). Sapın gərilmə qüvvəsi nə qədərdir? (g = 10 m/s²)`,
        solution: `Kürəyə üç qüvvə təsir edir: mg (aşağı), qE (üfüqi), T (sap boyunca). mg = ${F(m / 1000)} kq·10 = ${F(mg)} mN; qE = ${F(q)} mkKl·${F(E)} kV/m = ${F(qE)} mN (mkKl·kV/m = mN). Tarazlıqda T mg və qE-nin vektor cəmini tarazlaşdırır, onlar perpendikulyardır: T = √(${F(mg)}² + ${F(qE)}²) = ${F(T)} mN. Tələlər: qüvvələri ədəd kimi toplamaq (${F(mg + qE)} mN) və ya çıxmaq (${F(Math.abs(mg - qE))} mN), sahəni unutmaq (T = mg = ${F(mg)}), yalnız qE.` });
    }) },
    // 6. the point where the field is zero
    { tip: "qapali", gen: () => again(() => {
      const same = Math.random() < .5, n = pick([2, 3, 4]), a = rnd(1, 5), s = pick([1, -1]), d = pick([12, 15, 18, 20, 24, 30, 36, 40, 45, 60]);
      const q1 = s * a, q2 = (same ? s : -s) * a * n * n, x = same ? d / (1 + n) : d / (n - 1);
      const w = same ? [d / (1 + n * n), n * d / (1 + n), d / 2, d / (n - 1)] : [d / (n + 1), d / (n * n - 1), n * d / (n - 1), d / 2];
      if (![x, ...w].every(v => ok2(v, 1)) || x > 90) return null;
      return mc(ae(x, w, U_("sm")), { svg: svgEl(figLine([{ x: 0, q: q1, lab: "q₁" }, { x: d, q: q2, lab: "q₂" }])),
        text: `Şəkildə q₁ = ${sg(q1)} nKl və q₂ = ${sg(q2)} nKl nöqtəvi yükləri bir-birindən ${d} sm aralıdadır. Elektrik sahəsinin intensivliyi sıfır olan nöqtə q₁ yükündən nə qədər məsafədədir?`,
        solution: same
          ? `Yüklər eyni işarəlidir → sıfır nöqtə aralarındadır, kiçik yükə (q₁) yaxın. q₁-dən x: ${a}/x² = ${a * n * n}/(${d} − x)² → (${d} − x)/x = √${n * n} = ${n} → x = ${d}/${n + 1} = ${F(x)} sm. Tələlər: kökü almamaq (${d}/${1 + n * n} = ${F(d / (1 + n * n))}), məsafəni böyük yükdən ölçmək (${F(n * d / (1 + n))}), ortanı götürmək (${F(d / 2)}).`
          : `Yüklər əks işarəlidir → arada sahələr eyni yönlüdür, sıfır ola bilməz. Sıfır nöqtə kənardadır, modulca kiçik yükün (q₁) tərəfində. q₁-dən x: ${a}/x² = ${a * n * n}/(x + ${d})² → (x + ${d})/x = ${n} → x = ${d}/${n - 1} = ${F(x)} sm. Tələlər: nöqtəni arada axtarmaq (${F(d / (n + 1))}), kökü almamaq (${F(d / (n * n - 1))}), məsafəni q₂-dən ölçmək (${F(n * d / (n - 1))}).` });
    }) },
    // 7. a droplet at rest between plates; the field is made n times stronger (Newton + kinematics)
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const n = pick([2, 3, 4, 5]), t = pick([0.1, 0.2, 0.3, 0.4, 0.5]), m = pick([0.1, 0.2, 0.4, 0.5]), g = 10, sm = x => x * 100;
      const s = sm((n - 1) * g * t * t / 2);
      const w = [sm(n * g * t * t / 2), sm((n - 1) * g * t * t), sm((n + 1) * g * t * t / 2), sm(g * t * t / 2)];
      if (![s, ...w].every(v => ok2(v, 1))) return null;
      return mc(ae(s, w, U_("sm")), { svg: svgEl(figDrop()),
        text: `Kütləsi ${F(m)} mq olan müsbət yüklü yağ damcısı üfüqi lövhələr arasındakı şaquli yuxarı yönəlmiş bircins sahədə hərəkətsiz asılıb. Damcı bu müddətdə lövhəyə çatmır, sahə hərəkət boyu bircins qalır. Sahənin intensivliyini birdən ${n} dəfə artırdılar. ${F(t)} s ərzində damcı neçə sm yuxarı qalxar? (g = 10 m/s², hava müqaviməti nəzərə alınmır)`,
        solution: `Əvvəl tarazlıq: qE = mg. Sahə ${n} dəfə artanda elektrik qüvvəsi ${n}mg olur, yekun qüvvə ${n}mg − mg = ${n - 1}mg yuxarı: a = ${n - 1}·g = ${(n - 1) * g} m/s² (kütlə ixtisar olunur). Sükunətdən: s = at²/2 = ${(n - 1) * g}·${F(t)}²/2 = ${F(s / 100)} m = ${F(s)} sm. Tələlər: ağırlığı unutmaq (a = ${n}g → ${F(w[0])} sm), ½-ni unutmaq (${F(w[1])} sm), qüvvələri toplamaq (${n + 1}g → ${F(w[2])} sm), sərbəst düşmə kimi (${F(w[3])} sm).` });
    }) },
    // 8. a particle starts from rest in a uniform field: its speed after t (Newton + kinematics)
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const q = pick([1, 2, 4, 5, 10]), E = pick([1, 2, 5, 10, 20, 50]), m = pick([0.1, 0.2, 0.5, 1, 2]), a = q * E / m, t = pick([0.2, 0.4, 0.5, 2, 3, 4]), v = a * t;
      if (!ok2(a) || a > 500 || !ok2(v, 1) || v > 1000) return null;
      const w = [v / 2, a * t * t / 2, a * t * t, v / 1000];
      if (!w.every(x => ok2(x, 4))) return null;
      return mc(ae(v, w, U_("m/s")), { svg: svgEl(figPart()),
        text: `Kütləsi ${F(m)} q, yükü +${q} mkKl olan zərrəcik intensivliyi ${E} kV/m olan bircins elektrik sahəsində sükunətdən hərəkətə başlayır (ağırlıq qüvvəsi və müqavimət nəzərə alınmır). ${F(t)} s sonra zərrəciyin sürəti nə qədər olar?`,
        solution: `F = qE = ${q}·10⁻⁶·${E}·10³ = ${F(q * E / 1000)} N. m = ${F(m)} q = ${F(m / 1000)} kq. a = F/m = ${F(a)} m/s². v = at = ${F(a)}·${F(t)} = ${F(v)} m/s. Tələlər: orta sürəti yazmaq (${F(v / 2)}), yolu tapmaq (at²/2 = ${F(a * t * t / 2)}), at² (${F(a * t * t)}), kütləni kq-a çevirməmək (${F(v / 1000)}).` });
    }) },
    // 9. two charged balls on an insulating spring (Hooke's law)
    { tip: "qapali", birlesik: "fiz-huk", gen: () => again(() => {
      const q = rnd(1, 10), L = pick([3, 5, 6, 10, 12, 15, 20, 30]), x = pick([1, 2, 3, 4, 5, 6]), Fc = 90 * q * q / (L * L), kk = 100 * Fc / x, L0 = L - x;
      if (L0 < 2 || !ok2(Fc) || !ok2(kk) || kk > 5000 || kk < 1) return null;
      const w = [q * x / L, q * L0 / L, q * q, 10 * q];
      if (!w.every(v => ok2(v))) return null;
      return mc(ae(q, w, U_("mkKl")), { svg: svgEl(figSpring(L0, L)),
        text: `Hamar üfüqi izolyator səth üzərində iki eyni kiçik kürə sərtliyi ${F(kk)} N/m olan yüngül izolyasiya yayı ilə birləşdirilib. Kürələrə eyni yük verdikdə kürələr tarazlıqda olur: yay ${x} sm uzanıb və kürələrin mərkəzləri arasındakı məsafə ${L} sm olur. Hər kürənin yükü nə qədərdir? (k = 9·10⁹ N·m²/Kl²)`,
        solution: `Tarazlıqda Kulon qüvvəsi = yayın elastiklik qüvvəsi. F = k·Δl = ${F(kk)}·${F(x / 100)} = ${F(Fc)} N. Kulon qanununda məsafə mərkəzlər arası ${L} sm-dir: 90·q²/${L}² = ${F(Fc)} → q² = ${F(Fc)}·${L * L}/90 = ${q * q} → q = ${q} mkKl. Tələlər: Kulon qanununa uzanmanı (${x} sm → ${F(q * x / L)}) və ya ilkin uzunluğu (${L0} sm → ${F(q * L0 / L)}) qoymaq, kökü almamaq (${q * q}), uzanmanı m-ə çevirməmək (${10 * q}).` });
    }) },
    // 10. three charges at the vertices of an equilateral triangle: the force on one (vectors, 60°/120°)
    { tip: "qapali", birlesik: "fiz-vektorlar", gen: () => again(() => {
      const a = pick([1, 2, 3, 4, 5, 6, 8, 10]), c = pick([1, 2, 3, 4, 5, 6, 8, 10]), sd = pick([3, 5, 6, 10, 15, 20, 30]), F0 = 90 * a * c / (sd * sd);
      if (!ok2(F0) || F0 > 1000) return null;
      const sA = pick([1, -1]), same = Math.random() < .5, sB = same ? sA : -sA, sC = pick([1, -1]);
      const right = same ? r3(F0, "√3") : F(F0) + " N", w = [same ? F(F0) + " N" : r3(F0, "√3"), F(2 * F0) + " N", "0", r3(F0, "√2")];
      return mc(ae(right, w, x => x), { svg: svgEl(figEq(sA * a, sB * a, sC * c, sd)),
        text: `Tərəfi ${sd} sm olan bərabərtərəfli üçbucağın A və B təpələrində q_A = ${sg(sA * a)} mkKl və q_B = ${sg(sB * a)} mkKl, C təpəsində q_C = ${sg(sC * c)} mkKl nöqtəvi yükləri var. C yükünə təsir edən yekun qüvvə nə qədərdir? (k = 9·10⁹ N·m²/Kl²)`,
        solution: `Hər qüvvənin modulu eynidir: F₀ = 90·${a}·${c}/${sd}² = ${F(F0)} N. ${same ? "q_A və q_B eyni işarəlidir: hər ikisi C-ni itələyir (və ya hər ikisi çəkir), qüvvələr arasındakı bucaq 60°-dir: F = 2F₀·cos30° = F₀√3 = " + r3(F0, "√3") : "q_A və q_B əks işarəlidir: biri C-ni itələyir, o biri çəkir, qüvvələr arasındakı bucaq 120°-dir: F = 2F₀·cos60° = F₀ = " + F(F0) + " N"}. Tələlər: modulları toplamaq (${F(2 * F0)} N), bucağı səhv götürmək (${same ? "120° → " + F(F0) + " N" : "60° → " + r3(F0, "√3")}; 90° → ${r3(F0, "√2")}), qüvvələrin bir-birini ləğv etdiyini düşünmək (0).` });
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
      key: "fiz-kulon", title: "Elektrik yükü, Kulon qanunu, elektrik sahəsi", fenn: "fizika", link: "dersler/fiz-kulon.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (məs. N, kV/m, nKl, mkKl, sm). Onluq kəsr vergül və ya nöqtə ilə: 0,9. k = 9·10⁹ N·m²/Kl².",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["yuk", "kulon", "kulon", "sahe", "sahe", "superpoz", "superpoz", "sifir", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-kulon.html")) b.push("dersler/fiz-kulon.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
