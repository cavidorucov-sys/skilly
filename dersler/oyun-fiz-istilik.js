// Fizika olimpiadası · Temperatur, istidən genişlənmə, istilik miqdarı — mastery game levels and the final test.
// Every generator returns a new problem with random numbers. SI units; T(K) = t(°C) + 273; c and α are always given in the text.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);

  // specific heat capacities J/(kg·°C)
  const MAT = [
    { n: "su", c: 4200 }, { n: "buz", c: 2100 }, { n: "alüminium", c: 900 }, { n: "mis", c: 400 },
    { n: "polad", c: 500 }, { n: "qurğuşun", c: 130 }, { n: "kerosin", c: 2100 }, { n: "qum", c: 800 },
  ];
  // linear expansion coefficients, in 10⁻⁶ °C⁻¹
  const ALF = [{ n: "polad", a: 12 }, { n: "alüminium", a: 24 }, { n: "mis", a: 17 }, { n: "şüşə", a: 9 }, { n: "beton", a: 12 }, { n: "latun", a: 19 }];
  const cm = (c, m) => c * m;

  const levels = [
    { id: "skala", ad: "Temperatur şkalaları", izah: "T(K) = t(°C) + 273. Fahrenheit: t_F = 1,8·t_C + 32. Dəyişmə Δt Selsidə və Kelvində eynidir. Sınıq termometr: bölgüləri mütənasib çevir.",
      gen() {
        const kind = pick(["CK", "KC", "CF", "FC", "dT", "sinik", "sinik"]);
        if (kind === "CK") {
          const t = pick([-73, -23, 0, 7, 27, 37, 57, 77, 100, 127, 227, 327]);
          return R(t + 273, "K", { text: `Temperatur ${F(t)} °C-dir. Kelvin şkalasında nə qədərdir? (T = t + 273)`, solution: `T = t + 273 = ${F(t)} + 273 = ${t + 273} K.` });
        }
        if (kind === "KC") {
          const T = pick([173, 223, 253, 273, 293, 300, 323, 373, 423, 473, 573]);
          return R(T - 273, "°C", { text: `Qazın temperaturu ${T} K-dir. Selsi şkalasında neçə dərəcədir? (t = T − 273)`, solution: `t = T − 273 = ${T} − 273 = ${F(T - 273)} °C.` });
        }
        if (kind === "CF") {
          const t = pick([-40, -10, 0, 5, 10, 15, 20, 25, 30, 35, 40, 50, 100]), f = 1.8 * t + 32;
          return R(f, "°F", { text: `Temperatur ${F(t)} °C-dir. Fahrenheit şkalasında neçə dərəcədir? (t_F = 1,8·t_C + 32)`, solution: `t_F = 1,8·${F(t)} + 32 = ${F(1.8 * t)} + 32 = ${F(f)} °F.` });
        }
        if (kind === "FC") {
          const k = rnd(-8, 20), f = 32 + 9 * k;
          return R(5 * k, "°C", { text: `Termometr ${F(f)} °F göstərir. Selsi şkalasında temperatur neçə dərəcədir? (t_F = 1,8·t_C + 32)`, solution: `t_C = (t_F − 32)/1,8 = (${F(f)} − 32)/1,8 = ${F(f - 32)}/1,8 = ${F(5 * k)} °C.` });
        }
        if (kind === "dT") {
          const t1 = rnd(-20, 40), d = rnd(5, 60);
          return R(d, "K", { text: `Temperatur ${F(t1)} °C-dən ${F(t1 + d)} °C-yə qalxdı. Kelvin şkalasında temperatur neçə kelvin artdı?`, solution: `Temperaturun dəyişməsi Selsidə və Kelvində eynidir: Δt = ${F(t1 + d)} − (${F(t1)}) = ${d} K. (Hər iki qiymətə 273 əlavə etsək, fərq dəyişməz.)` });
        }
        // faulty thermometer: reads a in melting ice and b in boiling water
        let a, b, x, real;
        do { a = pick([-4, -2, 0, 2, 4, 5]); b = a + pick([80, 90, 100, 110, 120]); const q = (b - a) / 100; x = a + q * 5 * rnd(1, 18); real = (x - a) / q; } while (!nice(x, 1) || !nice(real, 1));
        return R(real, "°C", { text: `Sınıq termometr əriyən buzda ${F(a)}°, qaynayan suda ${F(b)}° göstərir (şkala bərabər bölünüb). Bu termometr ${F(x)}° göstərəndə həqiqi temperatur neçə °C-dir?`,
          solution: `0 °C ↔ ${F(a)}°, 100 °C ↔ ${F(b)}°: ${b - a} bölgü = 100 °C. Həqiqi temperatur = 100·(${F(x)} − ${F(a)})/${b - a} = ${F(real)} °C.` });
      } },
    { id: "miqdar", ad: "Q = cmΔt", izah: "Q = c·m·Δt. Kütləni kq-la, c-ni J/(kg·°C)-lə götür. Qızanda Q > 0 (alınır), soyuyanda cisim Q qədər verir.",
      gen() {
        const mat = pick(MAT), c = mat.c, kind = pick(["isit", "isit", "soy", "kq"]);
        let m, t1, t2, Q;
        for (;;) { m = pick([0.1, 0.2, 0.25, 0.5, 1, 1.5, 2, 3, 4, 5, 10]); t1 = pick([0, 5, 10, 15, 20, 25, 30, 40, 60, 80]); t2 = t1 + pick([10, 20, 30, 40, 50, 60, 70, 80]); if (t2 > 100 && mat.n === "su") continue; Q = c * m * (t2 - t1); if (nice(Q / 1000, 3)) break; }
        if (kind === "isit") return R(Q / 1000, "kJ", { text: `${F(m)} kq ${mat.n} ${t1} °C-dən ${t2} °C-yə qədər qızdırılır. Xüsusi istilik tutumu c = ${c} J/(kq·°C). Alınan istilik miqdarı neçə kJ-dur?`,
          solution: `Q = cmΔt = ${c}·${F(m)}·(${t2} − ${t1}) = ${F(Q)} J = ${F(Q / 1000)} kJ.` });
        if (kind === "soy") return R(Q / 1000, "kJ", { text: `${F(m)} kq ${mat.n} ${t2} °C-dən ${t1} °C-yə qədər soyuyur. c = ${c} J/(kq·°C). Cisim ətrafa neçə kJ istilik verir?`,
          solution: `Q = cmΔt = ${c}·${F(m)}·(${t2} − ${t1}) = ${F(Q)} J = ${F(Q / 1000)} kJ.` });
        const mq = m * 1000;
        return R(Q / 1000, "kJ", { text: `${F(mq)} q ${mat.n} ${t1} °C-dən ${t2} °C-yə qədər qızdırılır (c = ${c} J/(kq·°C)). Nə qədər istilik lazımdır? Cavabı kJ-la yaz.`,
          solution: `m = ${F(mq)} q = ${F(m)} kq. Q = cmΔt = ${c}·${F(m)}·${t2 - t1} = ${F(Q)} J = ${F(Q / 1000)} kJ.` });
      } },
    { id: "tersine", ad: "m, Δt və c-ni tap", izah: "Q = cmΔt düsturundan lazım olanı çıxar: m = Q/(cΔt), Δt = Q/(cm), c = Q/(mΔt). Sonra son temperatur = başlanğıc + Δt.",
      gen() {
        const kind = pick(["m", "dt", "t2", "c"]);
        const mat = pick(MAT.slice(0, 6)), c = mat.c;
        let m, dt, Q, t1;
        for (;;) { m = pick([0.2, 0.25, 0.5, 1, 1.5, 2, 3, 4, 5]); dt = pick([5, 10, 15, 20, 25, 30, 40, 50, 60]); Q = c * m * dt; t1 = pick([10, 15, 20, 25, 30]); if (Q <= 2e6 && nice(Q / 1000, 2) && t1 + dt <= 100) break; }
        const nm = mat.n[0].toUpperCase() + mat.n.slice(1);
        if (kind === "m") return R(m, "kq", { text: `Maddə: ${mat.n}, xüsusi istilik tutumu c = ${c} J/(kq·°C). Cismə ${F(Q)} J istilik verəndə onun temperaturu ${dt} °C artır. Cismin kütləsi nə qədərdir?`,
          solution: `m = Q/(cΔt) = ${F(Q)}/(${c}·${dt}) = ${F(Q)}/${c * dt} = ${F(m)} kq.` });
        if (kind === "dt") return R(dt, "°C", { text: `${F(m)} kq ${mat.n} cisminə ${F(Q)} J istilik verirlər (c = ${c} J/(kq·°C)). Cismin temperaturu neçə °C yüksələr?`,
          solution: `Δt = Q/(cm) = ${F(Q)}/(${c}·${F(m)}) = ${F(Q)}/${F(c * m)} = ${dt} °C.` });
        if (kind === "t2") return R(t1 + dt, "°C", { text: `${t1} °C temperaturlu ${F(m)} kq ${mat.n} cisminə ${F(Q)} J istilik verirlər (c = ${c} J/(kq·°C)). Cismin son temperaturu neçə °C olar?`,
          solution: `Δt = Q/(cm) = ${F(Q)}/${F(c * m)} = ${dt} °C. Son temperatur = ${t1} + ${dt} = ${t1 + dt} °C.` });
        return R(c, "J/(kq·°C)", { text: `${F(m)} kq kütləli cismin temperaturunu ${dt} °C artırmaq üçün ${F(Q)} J istilik sərf olunub. Maddənin xüsusi istilik tutumu nə qədərdir?`,
          solution: `c = Q/(mΔt) = ${F(Q)}/(${F(m)}·${dt}) = ${F(Q)}/${F(m * dt)} = ${c} J/(kq·°C).` });
      } },
    { id: "guc", ad: "Qızdırıcının gücü", izah: "Qızdırıcı Pt qədər enerji verir. Faydalı hissə η·Pt istiliyə (cmΔt) gedir: cmΔt = η·P·t. Vaxt saniyə ilə, güc vatt ilə.",
      gen() {
        const kind = pick(["t", "t", "P", "dt", "eta"]);
        let m, dt, P, eta, t, Q;
        for (;;) {
          m = pick([0.5, 1, 1.5, 2, 2.5, 3]); dt = pick([20, 40, 50, 60, 70, 80]); P = pick([500, 800, 1000, 1200, 1500, 2000, 2500, 3000]); eta = pick([0.5, 0.6, 0.75, 0.8, 0.9, 1]);
          Q = 4200 * m * dt; t = Q / (eta * P);
          if (Number.isInteger(t) && t >= 30 && t <= 1800) break;
        }
        const e = Math.round(eta * 100), pr = eta === 1 ? "İstilik itkisi yoxdur." : `Qızdırıcının faydalı iş əmsalı ${e}%-dir.`;
        const base = `${F(m)} kq suyu ${dt} °C qızdırmaq lazımdır (c = 4200 J/(kq·°C)).`;
        if (kind === "t") return R(t, "s", { text: `${base} Elektrik qızdırıcının gücü ${P} W-dir. ${pr} Neçə saniyə lazımdır?`,
          solution: `Suyun aldığı istilik: Q = cmΔt = 4200·${F(m)}·${dt} = ${F(Q)} J. ${eta === 1 ? "" : "Qızdırıcı t vaxtda ηPt verir, "}ηPt = Q → t = Q/(ηP) = ${F(Q)}/${F(eta * P)} = ${t} s.` });
        if (kind === "P") return R(P, "W", { text: `${base} Qızdırıcı bunu ${t} s-də edir. ${pr} Qızdırıcının gücü nə qədərdir?`,
          solution: `Q = cmΔt = 4200·${F(m)}·${dt} = ${F(Q)} J. ηPt = Q → P = Q/(ηt) = ${F(Q)}/(${F(eta)}·${t}) = ${P} W.` });
        if (kind === "dt") return R(dt, "°C", { text: `${F(m)} kq suyu gücü ${P} W olan qızdırıcı ${t} s qızdırır (c = 4200 J/(kq·°C)). ${pr} Suyun temperaturu neçə °C yüksəlir?`,
          solution: `ηPt = ${F(eta)}·${P}·${t} = ${F(eta * P * t)} J = cmΔt → Δt = ${F(eta * P * t)}/(4200·${F(m)}) = ${dt} °C.` });
        let eta2 = Math.round(eta * 100);
        if (eta === 1) return levels[3].gen();
        return R(eta2, "%", { text: `${base} Gücü ${P} W olan qızdırıcı bunu ${t} s-də edir. Qızdırıcının faydalı iş əmsalı neçə faizdir?`,
          solution: `Faydalı istilik: cmΔt = ${F(Q)} J. Verilən enerji: Pt = ${P}·${t} = ${P * t} J. η = ${F(Q)}/${P * t} = ${F(eta)} = ${eta2}%.` });
      } },
    { id: "genislenme", ad: "İstidən genişlənmə", izah: "Δl = α·l₀·Δt. α adətən 10⁻⁶ °C⁻¹ tərtibindədir: polad 12·10⁻⁶ deməkdir ki, 1 m polad 1 °C-də 0,012 mm uzanır.",
      gen() {
        const kind = pick(["dl", "dl", "dt", "l0", "ferq", "bosluq"]);
        const mat = pick(ALF), a = mat.a;
        let l0, dt, dl;
        for (;;) { l0 = pick([1, 2, 4, 5, 10, 20, 25, 40, 50, 100, 200]); dt = pick([10, 20, 25, 30, 40, 50, 60, 80, 100]); dl = a * l0 * dt / 1000; if (nice(dl, 2) && dl >= 0.1) break; }
        const nm = mat.n;
        if (kind === "dl") return R(dl, "mm", { text: `Uzunluğu ${l0} m olan ${nm} çubuq (α = ${a}·10⁻⁶ °C⁻¹) ${dt} °C qızdırılır. Çubuğun uzunluğu neçə millimetr artar?`,
          solution: `Δl = α·l₀·Δt = ${a}·10⁻⁶·${l0}·${dt} = ${F(dl / 1000)} m = ${F(dl)} mm.` });
        if (kind === "dt") return R(dt, "°C", { text: `Uzunluğu ${l0} m olan ${nm} çubuq (α = ${a}·10⁻⁶ °C⁻¹) qızdırılanda ${F(dl)} mm uzandı. Çubuq neçə °C qızdırılıb?`,
          solution: `Δt = Δl/(α·l₀) = ${F(dl / 1000)}/(${a}·10⁻⁶·${l0}) = ${dt} °C.` });
        if (kind === "l0") return R(l0, "m", { text: `${nm.charAt(0).toUpperCase() + nm.slice(1)} çubuq (α = ${a}·10⁻⁶ °C⁻¹) ${dt} °C qızdırılanda ${F(dl)} mm uzanır. Çubuğun başlanğıc uzunluğu neçə metrdir?`,
          solution: `l₀ = Δl/(α·Δt) = ${F(dl / 1000)}/(${a}·10⁻⁶·${dt}) = ${l0} m.` });
        if (kind === "ferq") {
          let a1, a2, l2, l1, d;
          do { const p = pick([[12, 24], [12, 17], [9, 12], [12, 19], [9, 24], [17, 24]]); a1 = p[0]; a2 = p[1]; d = pick([6, 10, 12, 15, 20, 30, 60]); l2 = a1 * d / (a2 - a1); l1 = l2 + d; } while (!nice(l2, 1) || l2 <= 0 || a2 <= a1);
          const n1 = ALF.find(x => x.a === a1).n, n2 = ALF.find(x => x.a === a2).n;
          return R(l1, "sm", { text: `${n1[0].toUpperCase() + n1.slice(1)} (α = ${a1}·10⁻⁶ °C⁻¹) və ${n2} (α = ${a2}·10⁻⁶ °C⁻¹) çubuqlardan birincisi ikincidən ${d} sm uzundur. Hər temperaturda uzunluqlar fərqi eyni qalır. Birinci çubuğun uzunluğu neçə sm-dir?`,
            solution: `Fərq sabit qalsın deyə eyni Δt-də eyni uzanma lazımdır: ${a1}·l₁ = ${a2}·l₂. l₁ = l₂ + ${d}. ${a1}(l₂ + ${d}) = ${a2}·l₂ → l₂ = ${a1}·${d}/${a2 - a1} = ${F(l2)} sm, l₁ = ${F(l1)} sm.` });
        }
        let gap, dt2, rl;
        do { rl = pick([10, 20, 25, 40, 50]); dt2 = pick([30, 40, 50, 60, 80]); gap = a * rl * dt2 / 1000; } while (!nice(gap, 1) || gap < 1);
        return R(dt2, "°C", { text: `Quraşdırma zamanı ${nm} relslərin ucları arasında ${F(gap)} mm boşluq buraxılıb. Relsin uzunluğu ${rl} m-dir (α = ${a}·10⁻⁶ °C⁻¹). Rels quraşdırma temperaturundan neçə °C isinəndə boşluq bağlanar? (Boşluq bu relsin genişlənməsinə bərabər qəbul edilir.)`,
          solution: `Boşluq bağlananda relsin uzanması boşluğa bərabər olur: Δl = ${F(gap)} mm = ${F(gap / 1000)} m. Δt = Δl/(αl₀) = ${F(gap / 1000)}/(${a}·10⁻⁶·${rl}) = ${dt2} °C.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let mq, t1, t2, Q;
          do { mq = pick([200, 250, 400, 500, 600, 800]); t1 = pick([10, 15, 20, 25, 30]); t2 = t1 + pick([20, 30, 40, 50, 60]); Q = 4200 * mq / 1000 * (t2 - t1); } while (!nice(Q, 2));
          task = `${mq} q suyu ${t1} °C-dən ${t2} °C-yə qədər qızdırmaq üçün nə qədər istilik lazımdır? (c = 4200 J/(kq·°C))`;
          steps = [`Kütlə: m = ${mq} q = ${F(mq / 1000)} kq.`, `Temperaturun dəyişməsi: Δt = ${t2} − ${t1} = ${t2 - t1} °C.`, `Q = cmΔt = 4200·${F(mq / 1000)}·${t2 - t1} = ${F(Q)} J.`];
          if (bad === 0) { const m2 = mq / 100, Q2 = 4200 * m2 * (t2 - t1); steps = [`Kütlə: m = ${mq} q = ${F(m2)} kq.`, steps[1], `Q = cmΔt = 4200·${F(m2)}·${t2 - t1} = ${F(Q2)} J.`]; }
          if (bad === 1) { const d2 = t1 + t2, Q2 = 4200 * mq / 1000 * d2; steps[1] = `Temperaturun dəyişməsi: Δt = ${t2} + ${t1} = ${d2} °C.`; steps[2] = `Q = cmΔt = 4200·${F(mq / 1000)}·${d2} = ${F(Q2)} J.`; }
          if (bad === 2) steps[2] = `Q = cmΔt = 4200·${F(mq / 1000)}·${t2 - t1} = ${F(Q / 10)} J.`;
          why = [`1-ci addım: 1 kq = 1000 q, ${mq} q = ${F(mq / 1000)} kq. Düz cavab ${F(Q)} J.`,
            `2-ci addım: Δt = son − başlanğıc = ${t2} − ${t1}, toplamaq olmaz. Düz cavab ${F(Q)} J.`,
            `3-cü addım: hesablamada vuruq səhvi var: 4200·${F(mq / 1000)}·${t2 - t1} = ${F(Q)} J.`][bad];
        } else {
          let l0, dt, a, dl;
          do { a = pick([12, 24, 17]); l0 = pick([10, 20, 25, 40, 50]); dt = pick([20, 30, 40, 50, 60]); dl = a * l0 * dt / 1000; } while (!nice(dl, 2));
          const t1 = pick([-20, -10, 0, 5, 10]), t2 = t1 + dt;
          task = `Uzunluğu ${l0} m olan metal çubuq ${F(t1)} °C-dən ${t2} °C-yə qədər qızdırılır, α = ${a}·10⁻⁶ °C⁻¹. Çubuq neçə mm uzanır?`;
          steps = [`Temperaturun dəyişməsi: Δt = ${t2} − (${F(t1)}) = ${dt} °C.`, `Δl = α·l₀·Δt = ${a}·10⁻⁶·${l0}·${dt} = ${F(dl / 1000)} m.`, `1 m = 1000 mm, deməli Δl = ${F(dl)} mm.`];
          if (bad === 0) { const d2 = t2 + t1; steps = [`Temperaturun dəyişməsi: Δt = ${t2} + (${F(t1)}) = ${F(d2)} °C.`, `Δl = α·l₀·Δt = ${a}·10⁻⁶·${l0}·${F(d2)} = ${F(a * l0 * d2 / 1e6)} m.`, `1 m = 1000 mm, deməli Δl = ${F(a * l0 * d2 / 1000)} mm.`]; }
          if (bad === 1) { steps[1] = `Δl = α·l₀/Δt = ${a}·10⁻⁶·${l0}/${dt} = ${F(+(a * l0 / dt / 1e6).toFixed(9))} m.`; steps[2] = `1 m = 1000 mm, deməli Δl = ${F(+(a * l0 / dt / 1000).toFixed(6))} mm.`; }
          if (bad === 2) steps[2] = `1 m = 100 mm, deməli Δl = ${F(dl / 10)} mm.`;
          why = [`1-ci addım: Δt = ${t2} − (${F(t1)}) = ${dt} °C, toplamaq yox, çıxmaq lazımdır. Düz cavab ${F(dl)} mm.`,
            `2-ci addım: Δl = α·l₀·Δt — Δt vurulur, bölünmür. Düz cavab ${F(dl)} mm.`,
            `3-cü addım: 1 m = 1000 mm (100 yox). ${F(dl / 1000)} m = ${F(dl)} mm.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Rels aralıqları, körpü, vanna, çay stəkanı, hərarət.",
      gen() {
        const kind = pick(["rels", "korpu", "naqil", "vanna", "caystekan", "ates"]);
        if (kind === "rels") {
          let l0, t1, t2, dl; do { l0 = pick([12.5, 20, 25, 40]); t1 = pick([-30, -25, -20, -10]); t2 = pick([30, 35, 40, 45]); dl = 12 * l0 * (t2 - t1) / 1000; } while (!nice(dl, 2));
          return R(dl, "mm", { text: `Polad relsin uzunluğu ${F(l0)} m-dir (α = 12·10⁻⁶ °C⁻¹). Qışda temperatur ${F(t1)} °C, yayda ${t2} °C ola bilər. Relsin uzunluğu bu fəsillər arasında neçə mm dəyişir?`,
            solution: `Δt = ${t2} − (${F(t1)}) = ${t2 - t1} °C. Δl = α·l₀·Δt = 12·10⁻⁶·${F(l0)}·${t2 - t1} = ${F(dl / 1000)} m = ${F(dl)} mm. Relslər arasında bu qədər boşluq lazımdır.` });
        }
        if (kind === "korpu") {
          let l0, dt, dl; do { l0 = pick([50, 100, 150, 200, 300]); dt = pick([40, 50, 60, 70]); dl = 12 * l0 * dt / 1000; } while (!nice(dl, 1));
          return R(dl, "mm", { text: `Polad körpünün uzunluğu ${l0} m-dir (α = 12·10⁻⁶ °C⁻¹). Qışdan yaya temperatur ${dt} °C yüksəlir. Körpünün uzunluğu neçə mm artır?`,
            solution: `Δl = α·l₀·Δt = 12·10⁻⁶·${l0}·${dt} = ${F(dl / 1000)} m = ${F(dl)} mm. Buna görə körpülərdə genişlənmə birləşmələri qoyulur.` });
        }
        if (kind === "naqil") {
          let l0, dt, dl; do { l0 = pick([100, 200, 250, 400, 500]); dt = pick([30, 40, 50, 60]); dl = 24 * l0 * dt / 1000; } while (!nice(dl, 1));
          return R(dl / 10, "sm", { text: `İki dirək arasındakı alüminium naqilin uzunluğu ${l0} m-dir (α = 24·10⁻⁶ °C⁻¹). Qışdan yaya temperatur ${dt} °C artır. Naqil neçə santimetr uzanır? (Yayda naqil ona görə daha çox sallanır.)`,
            solution: `Δl = α·l₀·Δt = 24·10⁻⁶·${l0}·${dt} = ${F(dl / 1000)} m = ${F(dl / 10)} sm.` });
        }
        if (kind === "vanna") {
          let m, t1, t2; do { m = pick([60, 80, 100, 120, 150]); t1 = pick([10, 12, 15, 20]); t2 = pick([35, 37, 40]); } while (!nice(4200 * m * (t2 - t1) / 1e6, 3));
          return R(4200 * m * (t2 - t1) / 1e6, "MJ", { text: `Vannaya ${m} kq (yəni ${m} litr) su doldurulur. Su ${t1} °C-dən ${t2} °C-yə qədər qızdırılmalıdır (c = 4200 J/(kq·°C)). Nə qədər istilik lazımdır? Cavabı meqajoullarla (1 MJ = 10⁶ J) yaz.`,
            solution: `Q = cmΔt = 4200·${m}·${t2 - t1} = ${F(4200 * m * (t2 - t1))} J = ${F(4200 * m * (t2 - t1) / 1e6)} MJ.` });
        }
        if (kind === "caystekan") {
          let m, t1, t2; do { m = pick([0.15, 0.2, 0.25, 0.3]); t1 = pick([80, 90, 95, 100]); t2 = pick([40, 50, 60]); } while (!nice(4200 * m * (t1 - t2) / 1000, 2));
          return R(4200 * m * (t1 - t2) / 1000, "kJ", { text: `${F(m)} kq çay ${t1} °C-dən ${t2} °C-yə qədər soyudu. Çayı su kimi qəbul et (c = 4200 J/(kq·°C)). Çay ətrafa neçə kJ istilik verdi?`,
            solution: `Q = cmΔt = 4200·${F(m)}·(${t1} − ${t2}) = ${F(4200 * m * (t1 - t2))} J = ${F(4200 * m * (t1 - t2) / 1000)} kJ.` });
        }
        const t = pick([35.5, 36.6, 37, 37.5, 38.2, 39.4, 40]);
        return R(t + 273, "K", { text: `Xəstənin bədən temperaturu ${F(t)} °C-dir. Bunu kelvinlə ifadə et (T = t + 273).`, solution: `T = ${F(t)} + 273 = ${F(t + 273)} K.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a graph or a picture and
  // several steps; the wrong options are the answers of typical mistakes. Questions 2 and 8 also use "İş və güc"
  // (Q = P·τ), 6 uses "Enerjinin saxlanması" (mgh + mv²/2), 7 uses "Enerji" (mv²/2).
  const { ae, again } = Oyun;
  const ok = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const fr = (p, q) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : p / g + "/" + q / g; };
  // @fig-start — SVG helpers (string based)
  const INK = "var(--ink,#17171a)", ACC = "var(--accent,#a32d2d)", MUT = "var(--muted,#6b6b73)", PAP = "var(--paper,#fff)", VEC = "var(--vec,#0c447c)";
  const f1 = n => +(+n).toFixed(1);
  const Ln = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const Tx = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const Ar = (x1, y1, x2, y2, c = ACC, w = 2.5) => Ln(x1, y1, x2, y2, c, w, ` marker-end="url(#ti-ar)"`);
  const Ar2 = (x1, y1, x2, y2, c = INK, w = 1.5) => Ln(x1, y1, x2, y2, c, w, ` marker-start="url(#ti-ar)" marker-end="url(#ti-ar)"`);
  const Dash = (x1, y1, x2, y2) => Ln(x1, y1, x2, y2, MUT, 1.2, ` stroke-dasharray="4 3"`);
  const Rc = (x, y, w, h, fill = PAP, c = INK, sw = 2) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}" stroke="${c}" stroke-width="${sw}"/>`;
  const hatch = (x1, y, x2, down = true) => { let s = Ln(x1, y, x2, y, INK, 2); for (let x = x1 + 6; x <= x2; x += 10) s += Ln(x, y, x - 7, y + (down ? 8 : -8), MUT, 1.2); return s; };
  const vhatch = (x, y1, y2, left = true) => { let s = Ln(x, y1, x, y2, INK, 2); for (let y = y1 + 6; y <= y2; y += 10) s += Ln(x, y, x + (left ? -8 : 8), y - 7, MUT, 1.2); return s; };
  const svgStr = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" class="oy-svg" role="img" aria-label="${aria}"><defs><marker id="ti-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  // graph: origin (0; 0), lines [{ p: [[x, y], [x, y]], c, n }], marks [[x, y]] with dashed projections and their values on the axes
  function graphStr(o) {
    const L = 46, R = 262, Tp = 22, B = 172, xMax = o.xMax, yMax = o.yMax;
    const X = x => L + (R - L - 18) * x / xMax, Y = y => B - (B - Tp - 12) * y / yMax;
    let s = Ar(L, B, R, B, INK, 1.6) + Ar(L, B, L, Tp - 8, INK, 1.6) + Tx(R, B + 30, o.xLab, "end", INK, 12) + Tx(L + 6, Tp - 6, o.yLab, "start", INK, 12) + Tx(L - 6, B + 15, "0", "end", MUT, 11);
    (o.marks || []).forEach(([x, y]) => {
      if (y) s += Dash(L, Y(y), X(x), Y(y)) + Tx(L - 6, Y(y) + 4, F(y), "end", MUT, 11);
      if (x) s += Dash(X(x), B, X(x), Y(y)) + Tx(X(x), B + 15, F(x), "middle", MUT, 11);
    });
    (o.lines || []).forEach(l => { const [[a, b], [c, d]] = l.p; s += Ln(X(a), Y(b), X(c), Y(d), l.c || ACC, 2.5); if (l.n) s += Tx(X(c) + 6, Y(d) + 4, l.n, "start", l.c || ACC); });
    (o.marks || []).forEach(([x, y]) => { s += `<circle cx="${f1(X(x))}" cy="${f1(Y(y))}" r="3.5" fill="${INK}"/>`; });
    return svgStr(280, 210, s, o.aria);
  }
  const ringStr = () => svgStr(310, 150, `<circle cx="80" cy="72" r="44" fill="none" stroke="${MUT}" stroke-width="12"/>` + Ar2(43, 72, 117, 72) + Tx(80, 65, "d")
    + Tx(80, 140, "halqa", "middle", MUT, 12) + Rc(160, 30, 80, 84, PAP) + Ar2(252, 30, 252, 114) + Tx(258, 77, "d + δ", "start", INK, 12) + Tx(200, 140, "val (yan görünüş)", "middle", MUT, 12),
    "Halqa (daxili diametri d) və diametri d + δ olan val");
  const ballStr = () => svgStr(260, 200, hatch(30, 180, 230) + `<circle cx="90" cy="34" r="10" fill="${ACC}"/>` + Ar(90, 50, 90, 96, VEC) + Tx(98, 82, "v₀", "start", VEC)
    + Ar2(170, 34, 170, 178) + Dash(100, 34, 170, 34) + Tx(178, 112, "h", "start"), "Kürəcik h hündürlükdən v₀ sürətlə şaquli aşağı atılır");
  const bulletStr = () => svgStr(290, 150, Rc(132, 20, 24, 110, MUT, INK, 2) + `<ellipse cx="50" cy="75" rx="12" ry="5" fill="${ACC}"/>` + Ar(66, 75, 122, 75, VEC) + Tx(92, 66, "v₁", "middle", VEC)
    + `<ellipse cx="190" cy="75" rx="12" ry="5" fill="${ACC}"/>` + Ar(206, 75, 236, 75, VEC) + Tx(222, 66, "v₂", "middle", VEC) + Tx(144, 145, "lövhə", "middle", MUT, 12), "Güllə v₁ sürətlə lövhəyə girir, v₂ sürətlə çıxır");
  const potStr = () => svgStr(280, 190, `<path d="M70 95L70 150L210 150L210 95" fill="${VEC}" fill-opacity=".18" stroke="none"/>` + `<path d="M70 50L70 150L210 150L210 50" fill="none" stroke="${INK}" stroke-width="3"/>`
    + Ln(70, 95, 210, 95, VEC, 1.5) + Tx(140, 128, "su, m₂", "middle", VEC) + Tx(222, 70, "qab, m₁", "start", INK, 12) + Rc(55, 154, 170, 14, ACC, INK, 1.5) + Tx(140, 186, "qızdırıcı, P", "middle", ACC, 12),
    "Alüminium qabda su; qab qızdırıcının üstündədir");
  function rodsStr(l1, l2, n1, n2) { const W = 200, g = 18, w1 = (W - g) * l1 / (l1 + l2), w2 = W - g - w1, xa = 40, xb = xa + w1, xc = xb + g;
    const cl = x => Math.min(Math.max(x, xa + 45), xa + W - 45);
    return svgStr(280, 150, vhatch(xa, 30, 120, true) + vhatch(xa + W, 30, 120, false) + Rc(xa, 68, w1, 16, MUT) + Rc(xc, 68, w2, 16, PAP) + Tx(cl(xa + w1 / 2), 106, n1 + ", l₁", "middle", INK, 12) + Tx(cl(xc + w2 / 2), 140, n2 + ", l₂", "middle", INK, 12) + Ln(cl(xc + w2 / 2), 128, xc + w2 / 2, 88, MUT, 1)
      + Ln(cl(xa + w1 / 2), 95, xa + w1 / 2, 84, MUT, 1)
      + Ln(xb, 62, xb, 44, MUT, 1) + Ln(xc, 62, xc, 44, MUT, 1) + Ar2(xb, 50, xc, 50, INK, 1.2) + Tx((xb + xc) / 2, 40, "δ"), "Divarlar arasında iki çubuq, uclarının arasında δ boşluq"); }
  const cubeStr = () => svgStr(260, 170, `<path d="M60 70L130 70L130 140L60 140Z" fill="${PAP}" stroke="${INK}" stroke-width="2"/><path d="M60 70L90 45L160 45L130 70Z" fill="${PAP}" stroke="${INK}" stroke-width="2"/><path d="M130 70L160 45L160 115L130 140Z" fill="${PAP}" stroke="${INK}" stroke-width="2"/>`
    + Ar2(60, 154, 130, 154) + Tx(95, 168, "a") + Ar(225, 95, 172, 95) + Tx(232, 100, "Q", "start"), "Tili a olan kub; ona Q istilik verilir");
  // @fig-end
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. a scale X given by a graph against Celsius; the answer in kelvins
    { tip: "qapali", gen: () => again(() => {
      const a = pick([10, 20, 25, 30, 40]), s = pick([50, 80, 120, 150, 200, 250]), b = a + s, real = 5 * rnd(1, 19), x = a + s * real / 100;
      if (!nice(x, 1)) return null;
      const T = real + 273, w = [real, x - a + 273, x * 100 / s + 273, (x - a) * s / 100 + 273]; if (![T, ...w].every(v => ok(v, 1))) return null;
      return mc(ae(T, w, U_("K")), { svg: svgEl(graphStr({ xMax: 120, yMax: b * 1.2, xLab: "t_C, °C", yLab: "t_X, °X", lines: [{ p: [[0, a], [115, a + s * 1.15]] }], marks: [[0, a], [100, b]], aria: "X şkalasının Selsi şkalasından asılılıq qrafiki" })),
        text: `Qrafikdə X termometrinin göstərişinin (t_X) Selsi temperaturundan (t_C) asılılığı verilib. X termometri ${F(x)}° göstərəndə temperatur Kelvin şkalasında nə qədərdir? (T = t_C + 273 götür.)`,
        solution: `Qrafikdən: 0 °C ↔ ${a}°X, 100 °C ↔ ${b}°X, yəni 100 °C = ${s} bölgü. t_C = 100·(${F(x)} − ${a})/${s} = ${real} °C. T = ${real} + 273 = ${T} K. Tələlər: 273-ü əlavə etməmək (${real}), şkala fərqini nəzərə almamaq (${F(x - a + 273)}), sıfırın sürüşməsini unutmaq (${F(x * 100 / s + 273)}), nisbəti tərsinə götürmək (${F((x - a) * s / 100 + 273)}).` });
    }) },
    // 2. specific heat from a heating graph t(τ) and the heater power (Q = P·τ)
    { tip: "qapali", birlesik: "fiz-is-guc", gen: () => again(() => {
      const c = pick([400, 900, 1200, 1800, 2100, 2400, 4200]), m = pick([0.5, 2, 3, 4, 5]), k = pick([2, 4, 5, 10]), t0 = pick([10, 15, 20]), r1 = rnd(1, 3), r2 = r1 + rnd(2, 5);
      const t1 = t0 + k * r1, t2 = t0 + k * r2, P = c * m * k / 60; if (t2 > 100 || !Number.isInteger(P) || P < 100 || P > 3000) return null;
      const w = [c / 60, c * r2 / (r2 - r1), c * (t2 - t1) / t2, c * m]; if (![c, ...w].every(v => ok(v, 1))) return null;
      return mc(ae(c, w, U_("J/(kq·°C)")), { svg: svgEl(graphStr({ xMax: r2 * 1.3, yMax: Math.max(t2 * 1.25, 20), xLab: "τ, dəq", yLab: "t, °C", lines: [{ p: [[0, t0], [r2 * 1.2, t0 + k * r2 * 1.2]] }], marks: [[r1, t1], [r2, t2]], aria: "Cismin temperaturunun zamandan asılılıq qrafiki" })),
        text: `Gücü ${P} W olan qızdırıcı ${F(m)} kq kütləli cismi qızdırır. Qrafikdə cismin temperaturunun zamandan asılılığı verilib. Qızdırıcının bütün istiliyi cismə verilir. Cismin maddəsinin xüsusi istilik tutumu nə qədərdir?`,
        solution: `Qrafikdən: τ₁ = ${r1} dəq və τ₂ = ${r2} dəq anları arasında Δτ = ${r2 - r1} dəq = ${60 * (r2 - r1)} s, Δt = ${t2} − ${t1} = ${t2 - t1} °C. Q = P·Δτ = ${P}·${60 * (r2 - r1)} = ${P * 60 * (r2 - r1)} J. c = Q/(mΔt) = ${P * 60 * (r2 - r1)}/(${F(m)}·${t2 - t1}) = ${c} J/(kq·°C). Tələlər: dəqiqəni saniyəyə çevirməmək (${F(c / 60)}), vaxt kimi τ₂ = ${r2} dəq götürmək (${F(c * r2 / (r2 - r1))}), Δt yerinə son temperaturu yazmaq (${F(c * (t2 - t1) / t2)}), kütləni unutmaq (${F(c * m)}).` });
    }) },
    // 3. two bodies on one t(Q) graph, masses given: the ratio of specific heats
    { tip: "qapali", gen: () => again(() => {
      const m1 = rnd(1, 4), m2 = rnd(1, 4), t0 = pick([10, 20]), Q = pick([6, 8, 10, 12, 15, 20]), d1 = pick([10, 20, 30, 40, 50]), d2 = pick([10, 20, 30, 40, 50]);
      if (m1 === m2 || Math.abs(d1 - d2) < 20) return null;
      const t1 = t0 + d1, t2 = t0 + d2, right = fr(m2 * d2, m1 * d1);
      const w = [fr(d2, d1), fr(m1 * d1, m2 * d2), fr(m2 * t2, m1 * t1), fr(m1 * d2, m2 * d1)];
      if (right === "1") return null;
      return mc(ae(right, w, x => x), { svg: svgEl(graphStr({ xMax: Q * 1.3, yMax: Math.max(t1, t2) * 1.25, xLab: "Q, kJ", yLab: "t, °C", lines: [{ p: [[0, t0], [Q * 1.15, t0 + d1 * 1.15]], c: ACC, n: "1" }, { p: [[0, t0], [Q * 1.15, t0 + d2 * 1.15]], c: VEC, n: "2" }], marks: [[Q, t1], [Q, t2], [0, t0]], aria: "İki cismin temperaturunun aldığı istilik miqdarından asılılıq qrafiki" })),
        text: `Qrafikdə 1 və 2 cisimlərinin temperaturunun aldıqları istilik miqdarından asılılığı verilib. Cisimlərin kütlələri m₁ = ${m1} kq, m₂ = ${m2} kq-dır. Xüsusi istilik tutumlarının nisbəti c₁/c₂ nə qədərdir?`,
        solution: `Eyni Q = ${Q} kJ-da: Δt₁ = ${t1} − ${t0} = ${d1} °C, Δt₂ = ${t2} − ${t0} = ${d2} °C. c = Q/(mΔt), deməli c₁/c₂ = m₂Δt₂/(m₁Δt₁) = ${m2}·${d2}/(${m1}·${d1}) = ${right}. Tələlər: kütlələri unutmaq (${fr(d2, d1)}), nisbəti tərsinə yazmaq (${fr(m1 * d1, m2 * d2)}), Δt yerinə son temperaturları götürmək (${fr(m2 * t2, m1 * t1)}), kütlələri yanlış tərəfə yazmaq (${fr(m1 * d2, m2 * d1)}).` });
    }) },
    // 4. linear expansion coefficient from a Δl(t) graph
    { tip: "qapali", gen: () => again(() => {
      const k = pick([9, 12, 17, 19, 24]), l0 = pick([0.5, 2, 4, 5, 10]), t1 = pick([10, 20, 25, 30]), d = pick([40, 50, 60, 80, 100, 120, 150, 200]), t2 = t1 + d, dl = k * l0 * d / 1000;
      if (!ok(dl, 2)) return null;
      const A = v => F(+v.toFixed(4)) + "·10⁻⁶ °C⁻¹", w = [F(k) + "·10⁻³ °C⁻¹", A(10 * k), A(k * d / t2), A(k * l0)];
      if (![k * d / t2, k * l0].every(v => ok(v, 1))) return null;
      return mc(ae(A(k), w, x => x), { svg: svgEl(graphStr({ xMax: t2 * 1.25, yMax: dl * 1.3, xLab: "t, °C", yLab: "Δl, mm", lines: [{ p: [[t1, 0], [t2 * 1.15, dl * (t2 * 1.15 - t1) / d]] }], marks: [[t1, 0], [t2, dl]], aria: "Çubuğun uzanmasının temperaturdan asılılıq qrafiki" })),
        text: `Uzunluğu ${F(l0)} m olan metal çubuq qızdırılır. Qrafikdə onun uzanmasının (Δl) temperaturdan asılılığı verilib. Metalın xətti genişlənmə əmsalı nə qədərdir?`,
        solution: `Qrafikdən: ${t1} °C-dən ${t2} °C-yə qədər Δt = ${d} °C, Δl = ${F(dl)} mm = ${F(dl / 1000)} m. α = Δl/(l₀Δt) = ${F(dl / 1000)}/(${F(l0)}·${d}) = ${k}·10⁻⁶ °C⁻¹. Tələlər: millimetri metrə çevirməmək (${k}·10⁻³), 1 m = 100 mm götürmək (${10 * k}·10⁻⁶), Δt yerinə ${t2} °C yazmaq (${F(k * d / t2)}·10⁻⁶), l₀-a bölməyi unutmaq (${F(k * l0)}·10⁻⁶).` });
    }) },
    // 5. a ring heated to slide onto a shaft (the hole expands too)
    { tip: "qapali", gen: () => again(() => {
      const M = pick(ALF.filter(x => x.n !== "şüşə" && x.n !== "beton")), a = M.a, d = pick([5, 8, 10, 20, 25, 40]), dt = pick([100, 125, 150, 200, 250, 300]), t0 = pick([15, 20, 25]), del = dt * a * d / 1e5;
      if (!ok(del, 3)) return null;
      const T = t0 + dt, w = [dt, t0 - dt, t0 + 2 * dt, t0 + dt / 10]; if (!nice(dt / 10, 1)) return null;
      const nm = M.n[0].toUpperCase() + M.n.slice(1);
      return mc(ae(T, w, U_("°C")), { svg: svgEl(ringStr()),
        text: `${nm} halqanın (α = ${a}·10⁻⁶ °C⁻¹) daxili diametri ${t0} °C-də d = ${d} sm-dir. Halqanı diametri ondan δ = ${F(del)} mm böyük olan vala keçirmək lazımdır. Halqanı ən azı hansı temperatura qədər qızdırmaq lazımdır? Valın temperaturu dəyişmir.`,
        solution: `Deşik də genişlənir: Δd = α·d·Δt. Δd = δ = ${F(del)} mm = ${F(del / 10)} sm. Δt = δ/(αd) = ${F(del / 10)}/(${a}·10⁻⁶·${d}) = ${dt} °C. t = ${t0} + ${dt} = ${T} °C. Tələlər: başlanğıc temperaturu əlavə etməmək (${dt}), deşiyin kiçildiyini düşünüb soyutmaq (${F(t0 - dt)}), diametr yerinə radiusa bölmək (${t0 + 2 * dt}), sm-i mm ilə qarışdırmaq (${F(t0 + dt / 10)}).` });
    }) },
    // 6. a ball thrown down hits the ground: part of its mechanical energy heats it (energy conservation)
    { tip: "qapali", birlesik: "fiz-enerji-saxlanma", gen: () => again(() => {
      const M = pick([{ n: "qurğuşun", c: 125 }, { n: "mis", c: 400 }, { n: "polad", c: 500 }]), h0 = pick([10, 20, 25, 30, 40, 50, 60, 80]), v = pick([10, 20, 30, 40]), eta = pick([0.4, 0.5, 0.6, 0.8]);
      const E = 10 * h0 + v * v / 2, right = eta * E / M.c;
      const w = [eta * 10 * h0 / M.c, E / M.c, eta * (10 * h0 + v * v) / M.c, eta * v * v / 2 / M.c]; if (![right, ...w].every(x => ok(x, 2))) return null;
      return mc(ae(right, w, U_("°C")), { svg: svgEl(ballStr()),
        text: `${M.n[0].toUpperCase() + M.n.slice(1)} kürəcik h = ${h0} m hündürlükdən v₀ = ${v} m/s sürətlə şaquli aşağı atılır, yerə dəyib dayanır. Mexaniki enerjinin ${Math.round(eta * 100)}%-i kürəciyin daxili enerjisinə keçir. Kürəciyin temperaturu neçə dərəcə artar? Hava müqaviməti nəzərə alınmır, g = 10 m/s², c = ${M.c} J/(kq·°C).`,
        solution: `1 kq üçün mexaniki enerji: gh + v₀²/2 = ${10 * h0} + ${v * v / 2} = ${E} J/kq. η(gh + v₀²/2)·m = cmΔt, kütlə ixtisar olunur: Δt = ${F(eta)}·${E}/${M.c} = ${F(right)} °C. Tələlər: başlanğıc sürəti unutmaq (${F(eta * 10 * h0 / M.c)}), η-nı unutmaq (${F(E / M.c)}), v₀²/2-də 2-yə bölməmək (${F(eta * (10 * h0 + v * v) / M.c)}), hündürlüyü unutmaq (${F(eta * v * v / 2 / M.c)}).` });
    }) },
    // 7. a bullet goes through a board: part of the lost kinetic energy heats it
    { tip: "qapali", birlesik: "fiz-enerji", gen: () => again(() => {
      const M = pick([{ n: "qurğuşun", c: 125 }, { n: "mis", c: 400 }, { n: "polad", c: 500 }]), v1 = pick([200, 300, 400, 500, 600]), v2 = pick([100, 200, 300, 400]), eta = pick([0.3, 0.4, 0.5, 0.6, 0.8]);
      if (v2 >= v1) return null;
      const dE = (v1 * v1 - v2 * v2) / 2, right = eta * dE / M.c; if (right > 300) return null;
      const w = [eta * (v1 - v2) ** 2 / 2 / M.c, eta * v1 * v1 / 2 / M.c, 2 * right, dE / M.c]; if (![right, ...w].every(x => ok(x, 1))) return null;
      return mc(ae(right, w, U_("°C")), { svg: svgEl(bulletStr()),
        text: `${M.n[0].toUpperCase() + M.n.slice(1)} güllə v₁ = ${v1} m/s sürətlə taxta lövhəyə girir və onu deşib v₂ = ${v2} m/s sürətlə çıxır. İtirilən kinetik enerjinin ${Math.round(eta * 100)}%-i güllənin daxili enerjisinə keçir. Güllənin temperaturu neçə dərəcə artar? c = ${M.c} J/(kq·°C).`,
        solution: `İtirilən kinetik enerji: m(v₁² − v₂²)/2, 1 kq üçün (${v1 * v1} − ${v2 * v2})/2 = ${dE} J. η·m(v₁² − v₂²)/2 = cmΔt → Δt = ${F(eta)}·${dE}/${M.c} = ${F(right)} °C. Tələlər: sürətlər fərqini kvadrata yüksəltmək (${F(eta * (v1 - v2) ** 2 / 2 / M.c)}), çıxış sürətini unutmaq (${F(eta * v1 * v1 / 2 / M.c)}), 2-yə bölməmək (${F(2 * right)}), η-nı unutmaq (${F(dE / M.c)}).` });
    }) },
    // 8. water in an aluminium pot heated to boiling: time (Q = P·τ), the pot takes heat too
    { tip: "qapali", birlesik: "fiz-is-guc", gen: () => again(() => {
      const m1 = pick([0.2, 0.3, 0.4, 0.5, 0.6, 1]), m2 = pick([0.5, 1, 1.5, 2, 3]), t1 = pick([10, 15, 20, 25, 30]), P = pick([500, 600, 800, 1000, 1200, 1500, 2000]), dt = 100 - t1;
      const Qw = 4200 * m2 * dt, Qp = 900 * m1 * dt, tau = (Qw + Qp) / P / 60;
      const w = [Qw / P / 60, Qp / P / 60, tau * 100 / dt, tau * 60]; if (![tau, ...w].every(x => ok(x, 1))) return null;
      return mc(ae(tau, w, U_("dəq")), { svg: svgEl(potStr()),
        text: `Kütləsi m₁ = ${F(m1)} kq olan alüminium qabda m₂ = ${F(m2)} kq su var, onların temperaturu ${t1} °C-dir. Gücü ${P} W olan qızdırıcı qabı və suyu birlikdə qaynama temperaturuna (100 °C) qədər qızdırır. İstilik itkisi yoxdur. Bu neçə dəqiqə çəkər? c_al = 900 J/(kq·°C), c_su = 4200 J/(kq·°C).`,
        solution: `Δt = 100 − ${t1} = ${dt} °C. Su: ${F(Qw)} J, qab: 900·${F(m1)}·${dt} = ${F(Qp)} J, cəmi Q = ${F(Qw + Qp)} J. Pτ = Q → τ = ${F(Qw + Qp)}/${P} = ${F(tau * 60)} s = ${F(tau)} dəq. Tələlər: qabı unutmaq (${F(Qw / P / 60)}), suyu unutmaq (${F(Qp / P / 60)}), Δt yerinə 100 °C götürmək (${F(tau * 100 / dt)}), saniyəni dəqiqəyə çevirməmək (${F(tau * 60)}).` });
    }) },
    // 9. two rods between walls: heating closes the gap (both rods expand)
    { tip: "qapali", gen: () => again(() => {
      const M2 = pick(ALF.filter(x => x.a === 17 || x.a === 24)), l1 = pick([0.5, 1, 1.5, 2, 2.5, 3]), l2 = pick([0.5, 1, 1.5, 2, 2.5, 3]), t0 = pick([10, 15, 20, 25]), dt = pick([20, 25, 30, 40, 50, 60, 75, 80, 100]);
      const sum = 12 * l1 + M2.a * l2, del = dt * sum / 1000; if (!ok(del, 2) || del > 2) return null;
      const T = t0 + dt, w = [dt, t0 + del * 1000 / (12 * l1), t0 + del * 1000 / (M2.a * l2), t0 + 10 * dt]; if (![T, ...w].every(x => ok(x, 1))) return null;
      return mc(ae(T, w, U_("°C")), { svg: svgEl(rodsStr(l1, l2, "polad", M2.n)),
        text: `Divarlar arasında polad (α₁ = 12·10⁻⁶ °C⁻¹, l₁ = ${F(l1)} m) və ${M2.n} (α₂ = ${M2.a}·10⁻⁶ °C⁻¹, l₂ = ${F(l2)} m) çubuqlar bərkidilib. ${t0} °C-də çubuqların sərbəst ucları arasında δ = ${F(del)} mm boşluq var. Çubuqları birlikdə hansı temperatura qədər qızdırmaq lazımdır ki, boşluq bağlansın? Divarlar arasındakı məsafə dəyişmir.`,
        solution: `İki çubuq da uzanır: α₁l₁Δt + α₂l₂Δt = δ. Δt = δ/(α₁l₁ + α₂l₂) = ${F(del / 1000)}/((${12 * l1} + ${F(M2.a * l2)})·10⁻⁶) = ${dt} °C. t = ${t0} + ${dt} = ${T} °C. Tələlər: başlanğıc temperaturu əlavə etməmək (${dt}), yalnız bir çubuğun uzanmasını götürmək (${F(w[1])} və ya ${F(w[2])}), 1 m = 100 mm götürmək, Δt 10 dəfə böyük çıxır (${F(w[3])}).` });
    }) },
    // 10. heat Q given to a metal cube: Δt from Q = cmΔt, then the volume change (β = 3α)
    { tip: "qapali", gen: () => again(() => {
      const M = pick([{ n: "alüminium", c: 900, r: 2700, a: 24 }, { n: "polad", c: 500, r: 7800, a: 12 }, { n: "mis", c: 400, r: 8900, a: 17 }]), a = pick([5, 10, 20]), dt = pick([20, 40, 50, 80, 100]);
      const m = M.r * (a / 100) ** 3, Q = M.c * m * dt / 1000, dV = 3 * M.a * 1e-6 * a ** 3 * dt; if (!nice(m, 4) || !ok(Q, 2)) return null;
      const w = [dV / 3, 2 * dV / 3, 3 * M.a * 1e-6 * a * dt, dV / 1000]; if (![dV, ...w].every(x => ok(x, 5))) return null;
      return mc(ae(dV, w, x => F(+x.toFixed(6)) + " sm³"), { svg: svgEl(cubeStr()),
        text: `Tili a = ${a} sm olan ${M.n} kuba ${F(Q)} kJ istilik verilir. Kubun həcmi neçə sm³ artar? Bütün istilik kubun qızmasına gedir. ρ = ${M.r} kq/m³, c = ${M.c} J/(kq·°C), α = ${M.a}·10⁻⁶ °C⁻¹.`,
        solution: `m = ρa³ = ${M.r}·${F(a / 100)}³ = ${F(m)} kq. Δt = Q/(cm) = ${F(Q * 1000)}/(${M.c}·${F(m)}) = ${dt} °C. Həcm üçün β = 3α: ΔV = 3α·V₀·Δt = 3·${M.a}·10⁻⁶·${a ** 3}·${dt} = ${F(dV)} sm³. Tələlər: β = α götürmək (${F(dV / 3)}), sahə əmsalı 2α-nı götürmək (${F(2 * dV / 3)}), həcm yerinə tili götürmək (${F(+(3 * M.a * 1e-6 * a * dt).toFixed(6))}), kJ-u J-a çevirməmək (${F(+(dV / 1000).toFixed(6))}).` });
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
      key: "fiz-istilik", title: "Temperatur, istidən genişlənmə, istilik miqdarı", fenn: "fizika", link: "dersler/fiz-istilik.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: J, kJ, kq, °C, K, mm). Onluq kəsr vergül və ya nöqtə ilə: 0,5. T(K) = t(°C) + 273. c və α məsələdə verilir.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["skala", "skala", "miqdar", "miqdar", "tersine", "guc", "guc", "genislenme", "genislenme", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-istilik.html")) b.push("dersler/fiz-istilik.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
