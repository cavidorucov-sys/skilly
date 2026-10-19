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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-istilik", title: "Temperatur, istidən genişlənmə, istilik miqdarı", fenn: "fizika", link: "dersler/fiz-istilik.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: J, kJ, kq, °C, K, mm). Onluq kəsr vergül və ya nöqtə ilə: 0,5. T(K) = t(°C) + 273. c və α məsələdə verilir.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["skala", "skala", "miqdar", "miqdar", "tersine", "guc", "guc", "genislenme", "genislenme", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-istilik.html")) b.push("dersler/fiz-istilik.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
