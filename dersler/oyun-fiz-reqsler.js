// Fizika olimpiadası · Rəqslər — mastery game levels (T, ν, ω; riyazi və yaylı rəqqas; oxşarlıq; enerji) and the final test.
// Every generator returns a new problem with random numbers. SI units, g = 10 m/s², π² ≈ 10 (stated in the texts where used).
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const g = 10;
  const KS = [20, 25, 40, 50, 80, 100, 160, 200, 250, 400, 500, 800, 1000];
  const TS = [0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.4, 1.5, 2, 2.5, 3];   // periods that give clean lengths with π² = 10: l = T²/4
  const PI = "π² ≈ 10";

  const levels = [
    { id: "temel", ad: "T, ν, ω, amplituda", izah: "T = t/N, ν = 1/T, ω = 2π/T = 2πν. Bir tam rəqsdə cisim 4 amplituda qədər yol gedir.",
      gen() {
        const kind = pick(["T", "nu", "nuT", "omega", "yol", "wkm"]);
        if (kind === "T") {
          const N = pick([10, 20, 30, 40, 50, 60]), T = pick([0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 4]), t = N * T;
          return R(T, "s", { text: `Rəqs edən cisim ${F(t)} s-də ${N} tam rəqs edir. Rəqs periodu T nə qədərdir?`,
            solution: `T = t/N = ${F(t)}/${N} = ${F(T)} s.` });
        }
        if (kind === "nu") {
          const N = pick([10, 20, 30, 40, 50, 60]), T = pick([0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.25, 2, 2.5, 4]), t = N * T, nu = 1 / T;
          if (!nice(t, 2) || !nice(nu, 3)) return levels[0].gen();
          return R(nu, "Hz", { text: `Sarkaç ${F(t)} s-də ${N} tam rəqs edir. Tezliyi ν hertslə tap.`,
            solution: `Period T = ${F(t)}/${N} = ${F(T)} s. Tezlik ν = 1/T = 1/${F(T)} = ${F(nu)} Hz.` });
        }
        if (kind === "nuT") {
          const nu = pick([0.25, 0.4, 0.5, 1.25, 2, 2.5, 4, 5, 8, 10, 20, 25, 50]);
          return R(1 / nu, "s", { text: `Rəqsin tezliyi ${F(nu)} Hz-dir. Periodu nə qədərdir?`,
            solution: `T = 1/ν = 1/${F(nu)} = ${F(1 / nu)} s.` });
        }
        if (kind === "omega") {
          const n = rnd(1, 12);
          return R(2 * n, "rad/s", { text: `Rəqsin periodu T = π/${n} s-dir. Dairəvi tezlik ω = 2π/T nə qədərdir?`,
            solution: `ω = 2π/T = 2π : (π/${n}) = 2·${n} = ${2 * n} rad/s.` });
        }
        if (kind === "yol") {
          const A = pick([2, 3, 4, 5, 6, 8, 10]), N = rnd(2, 7);
          return R(4 * A * N / 100, "m", { text: `Amplitudu ${A} sm olan cisim ${N} tam rəqs edir. Bu müddətdə getdiyi ümumi yol neçə metrdir?`,
            solution: `Bir tam rəqsdə cisim 4 amplituda qədər yol gedir: 4·${A} = ${4 * A} sm. ${N} rəqsdə ${4 * A * N} sm = ${F(4 * A * N / 100)} m. (Yerdəyişmə isə 0-dır.)` });
        }
        const r = pick([4, 9, 16, 25, 36, 64, 100, 400]), m = pick([0.1, 0.2, 0.25, 0.5, 1, 2, 4]), k = r * m;
        return R(Math.sqrt(r), "rad/s", { text: `Kütləsi ${F(m)} kq olan yük sərtliyi ${F(k)} N/m olan yaydan rəqs edir. Dairəvi tezlik ω = √(k/m) nə qədərdir?`,
          solution: `ω = √(k/m) = √(${F(k)}/${F(m)}) = √${r} = ${Math.sqrt(r)} rad/s.` });
      } },
    { id: "riyazi", ad: "Riyazi rəqqas", izah: `T = 2π√(l/g). Burada π² ≈ 10, g = 10 m/s² qəbul olunur, onda T = 2√l (l metrlə).`,
      gen() {
        const kind = pick(["T", "l", "N", "g"]);
        if (kind === "T") {
          const T = pick(TS), l = T * T / 4;
          return R(T, "s", { text: `Uzunluğu ${F(l)} m olan riyazi rəqqasın periodu nə qədərdir? (${PI}, g = 10 m/s².)`,
            solution: `T = 2π√(l/g). π² ≈ 10 olduqda T = 2√l = 2·√${F(l)} = 2·${F(T / 2)} = ${F(T)} s.` });
        }
        if (kind === "l") {
          const T = pick(TS), l = T * T / 4;
          return R(l, "m", { text: `Riyazi rəqqasın periodu ${F(T)} s-dir. İpinin uzunluğu nə qədərdir? (${PI}, g = 10 m/s².)`,
            solution: `T = 2√l → √l = T/2 = ${F(T / 2)} → l = ${F(l)} m.` });
        }
        if (kind === "N") {
          let T, N, t; do { T = pick(TS); N = pick([10, 15, 20, 25, 30, 40]); t = T * N; } while (!nice(t, 1));
          const l = T * T / 4;
          return R(l, "m", { text: `Riyazi rəqqas ${F(t)} s-də ${N} tam rəqs edir. İpin uzunluğu nə qədərdir? (${PI}, g = 10 m/s².)`,
            solution: `T = t/N = ${F(t)}/${N} = ${F(T)} s. T = 2√l → l = (T/2)² = ${F(T / 2)}² = ${F(l)} m.` });
        }
        let T, gp, l;
        do { T = pick([1, 2, 2.5, 4, 5]); gp = pick([1.6, 4, 5, 8, 10, 16, 25]); l = gp * T * T / 40; } while (!nice(l, 3) || l > 10);
        return R(gp, "m/s²", { text: `Başqa planetdə uzunluğu ${F(l)} m olan riyazi rəqqas ${F(T)} s periodla rəqs edir. Həmin planetdə sərbəstdüşmə təcili nə qədərdir? (${PI}.)`,
          solution: `T = 2π√(l/g) → g = 4π²l/T² = 40·${F(l)}/${F(T * T)} = ${F(gp)} m/s².` });
      } },
    { id: "yayli", ad: "Yaylı rəqqas", izah: `T = 2π√(m/k). π² ≈ 10 olanda T = 2√(10m/k). Yükün asılma istiqaməti (şaquli/üfüqi) periodu dəyişmir.`,
      gen() {
        const kind = pick(["T", "m", "k", "uz", "par"]);
        let T, k, m;
        for (;;) {
          T = pick([0.2, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]); k = pick(KS); m = k * T * T / 40;
          if (nice(m, 3) && m >= 0.02 && m <= 20) break;
        }
        const sol = `T = 2π√(m/k) = 2√(10m/k)`;
        if (kind === "T") return R(T, "s", { text: `Kütləsi ${F(m)} kq olan yük sərtliyi ${k} N/m olan yaydan rəqs edir. Rəqs periodu nə qədərdir? (${PI}.)`,
          solution: `${sol} = 2√(10·${F(m)}/${k}) = 2√${F((T / 2) ** 2)} = 2·${F(T / 2)} = ${F(T)} s.` });
        if (kind === "m") return R(m, "kq", { text: `Sərtliyi ${k} N/m olan yayda asılmış yükün rəqs periodu ${F(T)} s-dir. Yükün kütləsi nə qədərdir? (${PI}.)`,
          solution: `T² = 40m/k → m = kT²/40 = ${k}·${F(T * T)}/40 = ${F(m)} kq.` });
        if (kind === "k") return R(k, "N/m", { text: `Kütləsi ${F(m)} kq olan yük yaydan asılıb və ${F(T)} s periodla rəqs edir. Yayın sərtliyi nə qədərdir? (${PI}.)`,
          solution: `T² = 40m/k → k = 40m/T² = 40·${F(m)}/${F(T * T)} = ${k} N/m.` });
        if (kind === "uz") {
          const x = T * T / 4;
          return R(T, "s", { text: `Yaydan yük asanda yay tarazlıqda ${F(x * 100)} sm uzanır. Yükü bir az dartıb buraxsaq, şaquli rəqsin periodu nə qədər olar? (${PI}, g = 10 m/s².)`,
            solution: `Tarazlıqda kx = mg → m/k = x/g. T = 2π√(m/k) = 2π√(x/g) = 2√x = 2√${F(x)} = ${F(T)} s.` });
        }
        const k1 = Math.round(k * 0.4 / 10) * 10 || 10, k2 = k - k1;
        if (k2 <= 0) return levels[2].gen();
        return R(T, "s", { text: `Sərtlikləri ${k1} N/m və ${k2} N/m olan iki yay paralel birləşib, onlardan ${F(m)} kq yük asılıb. Rəqs periodu nə qədərdir? (${PI}.)`,
          solution: `Paralel: k = ${k1} + ${k2} = ${k} N/m. T = 2√(10m/k) = 2√(10·${F(m)}/${k}) = ${F(T)} s.` });
      } },
    { id: "oxsar", ad: "Periodun dəyişməsi", izah: "T ~ √l, T ~ √m, T ~ 1/√k, T ~ 1/√g. Kvadrat kök var: 4 dəfə artan kəmiyyət periodu 2 dəfə dəyişir.",
      gen() {
        const kind = pick(["l", "m", "k", "g", "N", "l2"]);
        if (kind === "l") { const n = rnd(2, 6);
          return R(n, "dəfə", { text: `Riyazi rəqqasın ipinin uzunluğunu ${n * n} dəfə artırdılar. Rəqs periodu neçə dəfə artdı?`,
            solution: `T ~ √l. Uzunluq ${n * n} dəfə artsa, period √${n * n} = ${n} dəfə artır.` }); }
        if (kind === "m") { const n = rnd(2, 5);
          return R(n, "dəfə", { text: `Yaylı rəqqasın yükünü ${n * n} dəfə ağır etdilər (yay eynidir). Period neçə dəfə artdı?`,
            solution: `T ~ √m → √${n * n} = ${n} dəfə artır.` }); }
        if (kind === "k") { const n = rnd(2, 5);
          return R(n, "dəfə", { text: `Yaylı rəqqasda yayı ${n * n} dəfə sərt yayla əvəz etdilər (yük eynidir). Period neçə dəfə azaldı?`,
            solution: `T ~ 1/√k → period √${n * n} = ${n} dəfə azalır.` }); }
        if (kind === "g") {
          const c = pick([{ a: 30, r: 0.5, d: "yuxarı 30 m/s² təcillə sürətlənən raketdə", w: "g_eff = 10 + 30 = 40; T ~ 1/√g_eff → √(10/40) = 1/2" },
                          { a: 7.5, r: 2, d: "aşağı 7,5 m/s² təcillə sürətlənən liftdə", w: "g_eff = 10 − 7,5 = 2,5; T ~ 1/√g_eff → √(10/2,5) = 2" },
                          { a: 90, r: 0.316, d: "", w: "" }].slice(0, 2));
          return R(c.r, "", { text: `Riyazi rəqqas yerdə periodu T₁ ilə rəqs edir. Həmin rəqqas ${c.d} periodu T₂ olur. T₂/T₁ nisbəti nə qədərdir?`,
            solution: `Rəqqas üçün effektiv təcil g_eff dəyişir: ${c.w}. T₂/T₁ = ${F(c.r)}.` });
        }
        if (kind === "N") {
          const n = pick([2, 3, 4]), N1 = pick([10, 20, 30]);
          return R(n * n, "", { text: `Eyni vaxtda birinci rəqqas ${N1} tam rəqs edir, ikincisi ${N1 * n}. Birinci rəqqasın uzunluğu ikincinin uzunluğundan neçə dəfə böyükdür?`,
            solution: `Rəqs sayı periodla tərs mütənasibdir: T₁/T₂ = ${n}. T ~ √l → l₁/l₂ = ${n}² = ${n * n}.` });
        }
        const q = pick([0.25, 0.36, 0.49, 0.64, 0.81]), n = Math.sqrt(q);
        return R(n, "", { text: `Riyazi rəqqasın ipini elə qısaltdılar ki, yeni uzunluq əvvəlkinin ${F(q)} hissəsi oldu. T₂/T₁ nisbəti nə qədərdir?`,
          solution: `T ~ √l → T₂/T₁ = √${F(q)} = ${F(n)}.` });
      } },
    { id: "enerji", ad: "Rəqslərdə enerji", izah: "E = kA²/2 = mv_max²/2. Yerdəyişməsi x olan nöqtədə kx²/2 + mv²/2 = kA²/2. v_max = Aω, a_max = Aω², ω = √(k/m).",
      gen() {
        const kind = pick(["E", "vmax", "v", "Ek", "amax", "A"]);
        const r = pick([4, 9, 16, 25, 36, 100, 400]), m = pick([0.1, 0.2, 0.25, 0.5, 1, 2]), k = r * m, w = Math.sqrt(r);
        if (kind === "E") {
          let A; do { A = rnd(1, 20); } while (!nice(k * (A / 100) ** 2 / 2, 5));
          const E = k * (A / 100) ** 2 / 2;
          return R(E, "J", { text: `Sərtliyi ${F(k)} N/m olan yaydan asılmış yük amplitudu ${A} sm olan rəqs edir. Rəqsin tam mexaniki enerjisi nə qədərdir?`,
            solution: `E = kA²/2 = ${F(k)}·${F((A / 100) ** 2)}/2 = ${F(E)} J.` });
        }
        if (kind === "vmax") {
          let A; do { A = rnd(1, 20); } while (!nice(A / 100 * w, 3));
          return R(A / 100 * w, "m/s", { text: `${F(m)} kq kütləli yük sərtliyi ${F(k)} N/m yaydan amplitudu ${A} sm olmaqla rəqs edir. Maksimal sürəti nə qədərdir?`,
            solution: `Tarazlıq nöqtəsində enerji tam kinetikdir: kA²/2 = mv²/2 → v = A·√(k/m) = ${F(A / 100)}·√${r} = ${F(A / 100 * w)} m/s.` });
        }
        if (kind === "v") {
          const [A, x, d] = pick([[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [15, 9, 12], [15, 12, 9], [20, 12, 16]]);
          const v = w * d / 100;
          if (!nice(v, 3)) return levels[4].gen();
          return R(v, "m/s", { text: `Yaylı rəqqasın amplitudu ${A} sm, ω = ${w} rad/s-dir. Tarazlıq vəziyyətindən ${x} sm aralıda olduğu anda sürəti nə qədərdir?`,
            solution: `kA²/2 = kx²/2 + mv²/2 → v² = (k/m)(A² − x²) = ω²(A² − x²). A² − x² = ${A}² − ${x}² = ${d}² sm² → v = ${w}·${d} sm/s = ${F(v)} m/s.` });
        }
        if (kind === "Ek") {
          const E = pick([0.4, 0.8, 1.2, 2, 4, 6]);
          return R(0.75 * E, "J", { text: `Rəqs edən yükün tam enerjisi ${F(E)} J-dur. Yerdəyişmə amplitudun yarısına (x = A/2) bərabər olduqda yükün kinetik enerjisi nə qədərdir?`,
            solution: `Potensial enerji kx²/2 = k(A/2)²/2 = E/4. Kinetik enerji = E − E/4 = 3E/4 = ${F(0.75 * E)} J.` });
        }
        if (kind === "amax") {
          const A = pick([2, 4, 5, 10, 20]);
          return R(A / 100 * r, "m/s²", { text: `Yük ω = √(k/m) = ${w} rad/s dairəvi tezliklə ${A} sm amplituda ilə rəqs edir. Maksimal təcili a = Aω² nə qədərdir?`,
            solution: `a_max = Aω² = ${F(A / 100)}·${w}² = ${F(A / 100)}·${r} = ${F(A / 100 * r)} m/s².` });
        }
        let A; do { A = rnd(2, 20); } while (!nice(k * (A / 100) ** 2 / 2, 5));
        const E = k * (A / 100) ** 2 / 2;
        return R(A / 100, "m", { text: `Sərtliyi ${F(k)} N/m olan yaydan asılmış yükün rəqs enerjisi ${F(E)} J-dur. Rəqsin amplitudu neçə metrdir?`,
          solution: `E = kA²/2 → A² = 2E/k = ${F(2 * E)}/${F(k)} = ${F((A / 100) ** 2)} → A = ${F(A / 100)} m.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let T, k, m;
          for (;;) { T = pick([0.4, 0.5, 0.8, 1, 1.2, 2]); k = pick([40, 100, 160, 250, 400, 1000]); m = k * T * T / 40; if (nice(m, 3) && m >= 0.01 && m < 20 && Math.abs(m - k) > 0.5) break; }
          task = `Kütləsi ${F(m)} kq olan yük sərtliyi ${k} N/m yaydan rəqs edir. Periodu tapın (π² ≈ 10).`;
          const q = 10 * m / k;
          steps = [`Yaylı rəqqasın periodu T = 2π√(m/k).`, `π² ≈ 10 olduqda T = 2√(10m/k) = 2√(10·${F(m)}/${k}) = 2√${F(q)}.`, `T = 2·${F(Math.sqrt(q))} = ${F(T)} s.`];
          if (bad === 0) { const w = 10 * k / m; steps = [`Yaylı rəqqasın periodu T = 2π√(k/m).`, `T = 2√(10k/m) = 2√(10·${k}/${F(m)}) = 2√${F(w)}.`, `T = 2·${F(+Math.sqrt(w).toFixed(2))} ≈ ${F(+(2 * Math.sqrt(w)).toFixed(1))} s.`]; }
          if (bad === 1) { const q2 = 10 * m * 1000 / k; steps[1] = `T = 2√(10m/k) = 2√(10·${F(m * 1000)}/${k}) = 2√${F(q2)}.`; steps[2] = `T = 2·${F(+Math.sqrt(q2).toFixed(2))} ≈ ${F(+(2 * Math.sqrt(q2)).toFixed(1))} s.`; }
          if (bad === 2) steps[2] = `T = ${F(Math.sqrt(q))} s.`;
          why = [`1-ci addım: yaylı rəqqasda T = 2π√(m/k), kəsrin üstündə kütlə durur. Düz cavab T = ${F(T)} s.`,
            `2-ci addım: kütləni kiloqramla yazmaq lazımdır (${F(m)} kq, ${F(m * 1000)} yox). Düz cavab T = ${F(T)} s.`,
            `3-cü addım: kökün qarşısındakı 2 vuruğunu unutdun: T = 2·${F(Math.sqrt(q))} = ${F(T)} s.`][bad];
        } else {
          let m, r, k, A, x, d;
          for (;;) { const t = pick([[5, 3, 4], [10, 6, 8], [10, 8, 6], [5, 4, 3]]); A = t[0]; x = t[1]; d = t[2]; r = pick([16, 25, 100, 400]); m = pick([0.1, 0.2, 0.5, 1]); k = r * m; if (nice(Math.sqrt(r) * d / 100, 3)) break; }
          const w = Math.sqrt(r), v = w * d / 100, E = k * (A / 100) ** 2 / 2, Ep = k * (x / 100) ** 2 / 2, Ek = E - Ep;
          task = `${F(m)} kq kütləli yük sərtliyi ${F(k)} N/m yaydan amplitudu ${A} sm olmaqla rəqs edir. Tarazlıq vəziyyətindən ${x} sm aralı nöqtədə sürəti tapın.`;
          steps = [`Tam enerji E = kA²/2 = ${F(k)}·${F((A / 100) ** 2)}/2 = ${F(E)} J.`,
            `x = ${x} sm nöqtəsində potensial enerji kx²/2 = ${F(Ep)} J, deməli kinetik enerji ${F(E)} − ${F(Ep)} = ${F(Ek)} J.`,
            `mv²/2 = ${F(Ek)} → v = √(2·${F(Ek)}/${F(m)}) = ${F(v)} m/s.`];
          if (bad === 0) { const E2 = 2 * E, Ek2 = E2 - Ep; steps = [`Tam enerji E = kA² = ${F(k)}·${F((A / 100) ** 2)} = ${F(E2)} J.`, `x = ${x} sm nöqtəsində potensial enerji kx²/2 = ${F(Ep)} J, deməli kinetik enerji ${F(E2)} − ${F(Ep)} = ${F(+Ek2.toFixed(5))} J.`, `mv²/2 = ${F(+Ek2.toFixed(5))} → v = √(2·${F(+Ek2.toFixed(5))}/${F(m)}) ≈ ${F(+Math.sqrt(2 * Ek2 / m).toFixed(2))} m/s.`]; }
          if (bad === 1) { steps[1] = `Sürət tarazlıq nöqtəsindən keçəndəki enerjiyə uyğun alınır: mv²/2 = E = ${F(E)} J.`; steps[2] = `v = √(2·${F(E)}/${F(m)}) = ${F(+Math.sqrt(2 * E / m).toFixed(2))} m/s.`; }
          if (bad === 2) steps[2] = `v = √(${F(Ek)}/${F(m)}) = ${F(+Math.sqrt(Ek / m).toFixed(2))} m/s.`;
          why = [`1-ci addım: yayın enerjisi kA²/2-dir — 2-yə bölməyi unutdun. Düz cavab v = ${F(v)} m/s.`,
            `2-ci addım: x nöqtəsində enerjinin bir hissəsi yayda qalır (kx²/2). Düzü: mv²/2 = E − kx²/2, v = ${F(v)} m/s.`,
            `3-cü addım: mv²/2 = Ek → v = √(2Ek/m); 2 vuruğunu unutdun. Düz cavab ${F(v)} m/s.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Divar saatı, yellənçək, avtomobilin yayları, rəqqasla g-nin ölçülməsi.",
      gen() {
        const kind = pick(["saat", "yellenceyk", "avto", "tecrube", "tecrube"]);
        if (kind === "saat") {
          let T, t, N; do { T = pick([0.5, 1, 1.5, 2, 2.5, 3]); t = pick([60, 120, 300, 600, 900, 1800]); N = t / T; } while (!Number.isInteger(N));
          const l = T * T / 4;
          return R(N, "", { text: `Divar saatının rəqqası uzunluğu ${F(l)} m olan riyazi rəqqas kimi rəqs edir. ${t >= 120 ? F(t / 60) + " dəqiqədə" : "1 dəqiqədə"} neçə tam rəqs edər? (π² ≈ 10, g = 10 m/s².)`,
            solution: `T = 2√l = 2√${F(l)} = ${F(T)} s. N = t/T = ${t}/${F(T)} = ${N}.` });
        }
        if (kind === "yellenceyk") {
          const T = pick([1.5, 2, 2.5, 3, 4, 5, 6]), l = T * T / 4;
          return R(T, "s", { text: `Yellənçəyin zəncirinin uzunluğu ${F(l)} m-dir. Yellənçəyi rezonansla yelləmək üçün valideyn onu nə qədər aralıqla itələməlidir? Yellənçəyi riyazi rəqqas say (π² ≈ 10, g = 10 m/s²).`,
            solution: `İtələmə tezliyi öz tezliyi ilə üst-üstə düşəndə rezonans olur: itələmə aralığı = T. T = 2√l = 2√${F(l)} = ${F(T)} s.` });
        }
        if (kind === "avto") {
          const M = pick([800, 1000, 1200, 1600, 2000]), T = pick([0.5, 1, 2]), k = 10 * M / (T * T) / 4;
          return R(T, "s", { text: `Kütləsi ${M} kq olan avtomobil dörd eyni yay üzərindədir, hər yayın sərtliyi ${F(k)} N/m. Avtomobili şaquli istiqamətdə yellədəndə rəqs periodu nə qədərdir? (π² ≈ 10.)`,
            solution: `Dörd yay paraleldir: k_ümumi = 4·${F(k)} = ${F(4 * k)} N/m. T = 2√(10M/k) = 2√(10·${M}/${F(4 * k)}) = 2√${F((T / 2) ** 2)} = ${F(T)} s.` });
        }
        let gp, T, N = 20, l, t;
        do { gp = pick([8, 10, 12.5]); t = pick([28, 32, 36, 40, 44]); T = t / N; l = gp * T * T / 40; } while (!nice(l * 100, 1));
        return R(gp, "m/s²", { text: `Rəqqas təcrübəsində (periodu çox rəqsin vaxtından tapırlar) ipin uzunluğu ${F(l * 100)} sm, 20 tam rəqsin vaxtı ${t} s oldu. Bu ölçmələrdən sərbəstdüşmə təcilini tap (π² ≈ 10).`,
          solution: `T = ${t}/20 = ${F(T)} s. T = 2π√(l/g) → g = 4π²l/T² = 40·${F(l)}/${F(T * T)} = ${F(gp)} m/s².` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-reqsler", title: "Rəqslər: riyazi və yaylı rəqqas", fenn: "fizika", link: "dersler/fiz-reqsler.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: s, Hz, rad/s, m, J). Onluq kəsr vergül və ya nöqtə ilə: 0,4. g = 10 m/s², lazım olanda π² ≈ 10.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["temel", "temel", "riyazi", "riyazi", "yayli", "yayli", "oxsar", "enerji", "enerji", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-reqsler.html")) b.push("dersler/fiz-reqsler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
