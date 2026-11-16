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
            solution: `Tarazlıq nöqtəsində (x = 0, yerdəyişmə tarazlıqdan ölçülür) kx²/2 = 0 və enerji tam kinetikdir: kA²/2 = mv²/2 → v = A·√(k/m) = ${F(A / 100)}·√${r} = ${F(A / 100 * w)} m/s.` });
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

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a picture (x(t) graph or a sketch), several steps;
  // the wrong options are the answers of typical mistakes. Questions 4, 5, 6, 8 and 9 also use "Huk qanunu", "Qeyri-inersial sistemlər",
  // "Enerjinin saxlanması" and "Cazibə" (g ~ M/R²). π² ≈ 10 and g = 10 m/s² are stated in every text that needs them.
  const { ae, again } = Oyun;
  const ok2 = (x, d = 3) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const fr = (p, q) => { const d = gcd(p, q); return q / d === 1 ? String(p / d) : p / d + "/" + q / d; };
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  // <svg-helpers> (the static examples on the "İmtahanda necə gəlir" tab are drawn with the same functions)
  const INK = "var(--ink,#17171a)", ACC = "var(--accent,#a32d2d)", MUT = "var(--muted,#6b6b73)", PAP = "var(--paper,#fff)", VEC = "var(--vec,#0c447c)";
  const f1 = n => +(+n).toFixed(1);
  const sLn = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const sTx = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit" paint-order="stroke" stroke="${PAP}" stroke-width="3">${s}</text>`;
  const sPl = (pts, c = INK, w = 2, ex = "") => `<polyline points="${pts.map(p => f1(p[0]) + "," + f1(p[1])).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${ex}/>`;
  const sDot = (x, y, r = 3.5, c = INK) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${c}"/>`;
  const sAr = (x1, y1, x2, y2, c = ACC, w = 2.2) => { const d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d, bx = x2 - 9 * ux, by = y2 - 9 * uy;
    return sLn(x1, y1, bx, by, c, w) + `<polygon points="${f1(x2)},${f1(y2)} ${f1(bx - 4.2 * uy)},${f1(by + 4.2 * ux)} ${f1(bx + 4.2 * uy)},${f1(by - 4.2 * ux)}" fill="${c}"/>`; };
  const sDim = (x1, y1, x2, y2, c = VEC) => sAr(x1, y1, x2, y2, c, 1.6) + sAr(x2, y2, x1, y1, c, 1.6);
  const sSvg = (w, h, inner, aria, cls) => `<svg viewBox="0 0 ${w} ${h}"${cls ? ` class="${cls}"` : ""} role="img" aria-label="${aria}">${inner}</svg>`;
  const sHatch = (x1, x2, y) => { let s = sLn(x1, y, x2, y, INK, 2.5); for (let x = x1 + 4; x < x2; x += 9) s += sLn(x, y, x - 6, y - 8, MUT, 1.2); return s; };
  const sSpring = (x, y1, y2, w = 9, n = 7) => { const p = [[x, y1], [x, y1 + 5]]; for (let i = 0; i < n; i++) p.push([x + (i % 2 ? w : -w), y1 + 5 + (y2 - y1 - 10) * (i + 0.5) / n]); p.push([x, y2 - 5], [x, y2]); return sPl(p, INK, 2); };
  const sBox = (cx, y, w, h, lab) => `<rect x="${f1(cx - w / 2)}" y="${f1(y)}" width="${w}" height="${h}" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + (lab ? sTx(cx, y + h / 2 + 5, lab) : "");
  const sNum = v => (v < 0 ? "−" : "") + F(Math.abs(v));
  // x(t) graph: o = { tmax, step, ymax, yt: [{v, c}], curves: [{A, T, ph: "cos" | "sin", c}], P: {t, x}, leg: [[label, color]], xl, yl, aria, cls }
  function sGraph(o) {
    const W = 290, H = 196, L = 46, Rg = 268, Tp = 24, Bt = 160, y0 = (Tp + Bt) / 2, hh = (Bt - Tp) / 2 - 4;
    const X = t => L + (Rg - L) * t / o.tmax, Y = v => y0 - hh * v / o.ymax, op = ` opacity=".4"`;
    let s = "";
    for (let i = 0; i * o.step <= o.tmax + 1e-9; i++) { const t = i * o.step; s += sLn(X(t), Tp, X(t), Bt, MUT, 0.7, op); if (i) s += sTx(X(t), Bt + 15, F(+t.toFixed(4)), "middle", INK, 10.5); }
    (o.yt || []).forEach(k => { s += sLn(L, Y(k.v), Rg, Y(k.v), MUT, 0.7, op) + sTx(L - 6, Y(k.v) + 4, sNum(k.v), "end", k.c || INK, 11); });
    s += sTx(L - 6, y0 + 4, "0", "end", INK, 11) + sAr(L, Bt + 6, L, Tp - 8, INK, 1.5) + sAr(L - 4, y0, Rg + 12, y0, INK, 1.5) + sTx(W - 2, y0 + 17, o.xl || "t, s", "end", INK, 12) + sTx(L + 8, 13, o.yl || "x, sm", "start", INK, 12);
    o.curves.forEach(c => { const pts = []; for (let i = 0; i <= 240; i++) { const t = o.tmax * i / 240, a = 2 * Math.PI * t / c.T; pts.push([X(t), Y(c.A * (c.ph === "sin" ? Math.sin(a) : Math.cos(a)))]); } s += sPl(pts, c.c, 2.4); });
    if (o.P) s += sLn(L, Y(o.P.x), X(o.P.t), Y(o.P.x), VEC, 1.2, ` stroke-dasharray="4 3"`) + sDot(X(o.P.t), Y(o.P.x), 4, VEC) + sTx(X(o.P.t) + 7, Y(o.P.x) - 7, "P", "start", VEC, 13);
    (o.leg || []).forEach((l, i) => { const x = Rg - 70 + i * 36; s += sLn(x, 11, x + 14, 11, l[1], 3) + sTx(x + 19, 15, l[0], "start", l[1], 12); });
    return sSvg(W, H, s, o.aria || "Rəqsin x–t qrafiki", o.cls);
  }
  // Question 4: two springs in series, a weight hangs from the lower one
  function sSeries(k1, k2, m, cls) {
    const x = 70;
    return sSvg(250, 190, sHatch(30, 110, 16) + sSpring(x, 16, 76) + sTx(x + 20, 50, `k₁ = ${F(k1)} N/m`, "start") + sSpring(x, 76, 136) + sTx(x + 20, 110, `k₂ = ${F(k2)} N/m`, "start") + sDot(x, 76, 3.2) + sBox(x, 136, 84, 34, `m = ${F(m)} kq`),
      "İki yay ardıcıl birləşib, aşağı yaydan yük asılıb", cls);
  }
  // Question 5: a pendulum in a lift; v and a arrows
  function sLift(vUp, aUp, cls, nm = "lift") {
    const ar = (x, up, c, lab) => sAr(x, up ? 118 : 68, x, up ? 68 : 118, c, 3) + sTx(x + 12, 98, lab, "start", c, 14);
    return sSvg(250, 176, `<rect x="30" y="18" width="130" height="140" fill="none" stroke="${INK}" stroke-width="2.5"/>` + sHatch(50, 140, 36) + sLn(95, 36, 95, 112) + sDot(95, 118, 9, ACC) + sTx(156, 14, nm, "end", MUT, 12) + ar(185, vUp, VEC, "v") + ar(222, aUp, ACC, "a"),
      `Liftdə riyazi rəqqas; sürət ${vUp ? "yuxarı" : "aşağı"}, təcil ${aUp ? "yuxarı" : "aşağı"} yönəlib`, cls);
  }
  // Question 6: a pendulum drawn aside by α (cos α given), released
  function sPendTension(m, l, c, cls) {
    const px = 170, py = 20, S = 118, al = Math.acos(c), bx = px - S * Math.sin(al), by = py + S * c, arc = [];
    for (let i = 0; i <= 12; i++) { const a = al * i / 12; arc.push([px - 40 * Math.sin(a), py + 40 * Math.cos(a)]); }
    return sSvg(300, 190, sHatch(130, 210, py) + sLn(px, py, px, py + S + 24, MUT, 1.2, ` stroke-dasharray="4 3"`) + sLn(px, py, bx, by, INK, 2) + sDot(bx, by, 10, ACC) + `<circle cx="${px}" cy="${py + S}" r="10" fill="none" stroke="${MUT}" stroke-width="1.5" stroke-dasharray="3 3"/>`
      + sPl(arc, VEC, 1.6) + sTx(px - 56 * Math.sin(al / 2), py + 56 * Math.cos(al / 2) + 4, "α", "end", VEC, 14) + sTx(bx, by + 26, `m = ${F(m)} kq`, "middle") + sTx((px + bx) / 2 - 8, (py + by) / 2 - 8, `l = ${F(l)} m`, "end") + sTx(px + 8, py + 64, `cos α = ${F(c)}`, "start", VEC, 12),
      "Riyazi rəqqas α bucağı qədər kənara çəkilib", cls);
  }
  // Question 8: a spring alone / with the weight at equilibrium (Δl) / pulled down by A
  function sHang(dl, A, cls) {
    const dpx = Math.min(64, 16 + dl * 1.1), apx = 14 + A * 3, y0 = 16, ln = 56, xs = [40, 120, 200], yE = y0 + ln + dpx, yA = yE + apx, g = ` stroke-dasharray="3 3"`;
    return sSvg(300, 236, sHatch(14, 280, y0) + sSpring(xs[0], y0, y0 + ln) + sTx(xs[0], 228, "yüksüz", "middle", MUT, 12)
      + sSpring(xs[1], y0, yE) + sBox(xs[1], yE, 34, 24, "m") + sDim(xs[1] - 24, y0 + ln, xs[1] - 24, yE) + sTx(xs[1] - 30, y0 + ln + dpx / 2 + 5, `Δl = ${F(dl)} sm`, "end", VEC, 12) + sLn(xs[1] - 28, y0 + ln, xs[1] + 4, y0 + ln, MUT, 1, g) + sTx(xs[1], 228, "tarazlıq", "middle", MUT, 12)
      + sSpring(xs[2], y0, yA) + sBox(xs[2], yA, 34, 24, "m") + sLn(xs[2] - 26, yE + 12, xs[2] + 30, yE + 12, MUT, 1, g) + sDim(xs[2] + 26, yE + 12, xs[2] + 26, yA + 12) + sTx(xs[2] + 32, yE + 12 + apx / 2 + 5, `A = ${F(A)} sm`, "start", VEC, 12) + sTx(xs[2], 228, "buraxılır", "middle", MUT, 12),
      "Yay yüksüz, yüklə tarazlıqda (Δl) və yük A qədər aşağı çəkilib", cls);
  }
  // Question 9: the Earth and a planet drawn to the radius ratio; labels give the radius and the mass
  function sPlanet(pR, qR, pM, qM, cls) {
    const re = 18, rp = Math.max(6, Math.min(80, re * pR / qR)), cxE = 56, cxP = cxE + re + 30 + rp, cy = 78;
    const lab = (sym, p, q) => p === q ? sym : q === 1 ? `${p}${sym}` : p === 1 ? `${sym}/${q}` : `${p}${sym}/${q}`;
    return sSvg(Math.max(260, Math.round(cxP + rp + 20)), 176, `<circle cx="${cxE}" cy="${cy}" r="${re}" fill="${PAP}" stroke="${INK}" stroke-width="2.5"/><circle cx="${f1(cxP)}" cy="${cy}" r="${f1(rp)}" fill="${PAP}" stroke="${ACC}" stroke-width="2.5"/>`
      + sTx(cxE, cy - re - 8, "Yer: R, M", "middle", INK, 13) + sTx(cxP, cy + rp + 20, `Planet: ${lab("R", pR, qR)}, ${lab("M", pM, qM)}`, "middle", ACC, 13),
      "Yer və planetin ölçüləri (radius və kütlə nisbətləri)", cls);
  }
  // Question 10: a pendulum whose string catches on a nail below the pivot (small swings; the arcs are drawn for a visible angle)
  function sNail(l, d, cls) {
    const px = 110, py = 20, S = 108, dp = S * d / l, ny = py + dp, by = py + S, th = 0.5, k2 = Math.acos(Math.max(-1, 1 - (l / (l - d)) * (1 - Math.cos(0.5)))) / 0.5, g = ` stroke-dasharray="4 3"`, lf = [], rt = [];
    for (let i = 0; i <= 14; i++) { const a = th * i / 14; lf.push([px - S * Math.sin(a), py + S * Math.cos(a)]); rt.push([px + (S - dp) * Math.sin(a * k2), ny + (S - dp) * Math.cos(a * k2)]); }
    const a = lf[14], b = rt[14];
    return sSvg(310, 150, sHatch(70, 150, py) + sLn(px, py, px, by, INK, 2) + sPl(lf, MUT, 1.4, g) + sPl(rt, MUT, 1.4, g) + sLn(px, py, a[0], a[1], MUT, 1.2, g) + sLn(px, ny, b[0], b[1], MUT, 1.2, g) + sDot(a[0], a[1], 6, MUT) + sDot(b[0], b[1], 6, MUT) + sDot(px, by, 9, INK)
      + sDot(px, ny, 4.5, ACC) + sTx(px - 9, ny + 4, "mismar", "end", ACC, 12) + sDim(px + 42, py, px + 42, ny) + sTx(px + 48, py + dp / 2 + 5, `d = ${F(d)} m`, "start", VEC, 12) + sDim(px + 120, py, px + 120, by) + sTx(px + 126, (py + by) / 2 + 5, `l = ${F(l)} m`, "start", VEC, 12),
      "Riyazi rəqqas: ip tarazlıq vəziyyətindən keçəndə mismara toxunur", cls);
  }
  // </svg-helpers>
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. x(t) graph: the path in a given time (A and T are read from the graph)
    { tip: "qapali", gen: () => again(() => {
      const A = pick([2, 3, 4, 5, 6, 8, 10]), T = pick([0.2, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]), n = rnd(3, 9), t = n * T / 2;
      if (!nice(t, 1)) return null;
      const right = 2 * A * n, w = [4 * A * n, A * n, n % 2 ? 2 * A : 0, A * n / 2]; if (![right, A * n / 2].every(x => nice(x, 1))) return null;
      const o = ae(right, w, U_("sm"));
      return mc(o, { svg: svgEl(sGraph({ tmax: 2 * T, step: T / 2, ymax: A, yt: [{ v: A }, { v: -A }], curves: [{ A, T, ph: "cos", c: ACC }], aria: "Cismin x–t qrafiki: kosinus əyrisi" })),
        text: `Qrafikdə cismin yerdəyişməsi x (sm-lə) zamandan asılı verilib. Cisim t = ${F(t)} s ərzində neçə sm yol gedir?`,
        solution: `Qrafikdən: amplituda A = ${A} sm; əyri ${F(T)} s-dən sonra başlanğıc vəziyyətə qayıdır, deməli period T = ${F(T)} s (${F(T / 2)} s yalnız yarım perioddur). Keçən periodların sayı N = t/T = ${F(t)}/${F(T)} = ${F(n / 2)}. Bir tam rəqsdə yol 4A = ${4 * A} sm, deməli yol = 4A·N = ${4 * A}·${F(n / 2)} = ${right} sm. Tələlər: yarım periodu period saymaq (${4 * A * n} sm), hər yarım periodda A yol hesab etmək (${F(A * n)} sm), yolla yerdəyişməni qarışdırmaq (${n % 2 ? 2 * A : 0} sm), 4-ü unutmaq (${F(A * n / 2)} sm).` });
    }) },
    // 2. x(t) graph + the mass: the stiffness of the spring (T read from the graph)
    { tip: "qapali", gen: () => again(() => {
      const A = pick([2, 3, 4, 5, 6, 8]), T = pick([0.4, 0.6, 0.8, 1, 1.2, 1.5, 2]), m = pick([0.1, 0.2, 0.25, 0.4, 0.5, 1, 2]), k = 40 * m / (T * T);
      if (!nice(k, 1) || k > 2000) return null;
      const w = [40 * m / T, 160 * m / (T * T), 10 * m / (T * T), 40 * T * T / m]; if (![k, ...w].every(x => ok2(x, 2))) return null;
      return mc(ae(k, w, U_("N/m")), { svg: svgEl(sGraph({ tmax: 2 * T, step: T / 2, ymax: A, yt: [{ v: A }, { v: -A }], curves: [{ A, T, ph: "sin", c: ACC }], aria: "Yaylı rəqqasın x–t qrafiki: sinus əyrisi" })),
        text: `Yaylı rəqqasın rəqsinin x–t qrafiki verilib (x sm-lə, t saniyə ilə). Yükün kütləsi m = ${F(m)} kq-dır. Yayın sərtliyi nə qədərdir? (π² ≈ 10.)`,
        solution: `Qrafikdən: əyri ${F(T)} s-dən sonra eyni vəziyyətə eyni istiqamətlə qayıdır, T = ${F(T)} s (A = ${A} sm bu sualda lazım deyil). T = 2π√(m/k) → k = 4π²m/T² = 40m/T² = 40·${F(m)}/${F(T * T)} = ${F(k)} N/m. Tələlər: T-ni kvadrata yüksəltməmək (${F(+(40 * m / T).toFixed(4))} N/m), yarım periodu period götürmək (${F(+(160 * m / (T * T)).toFixed(4))} N/m), 4-ü unutmaq: k = π²m/T² = 10m/T² (${F(+(10 * m / (T * T)).toFixed(4))} N/m), düsturu tərsinə çevirmək (${F(+(40 * T * T / m).toFixed(4))} N/m).` });
    }) },
    // 3. two x(t) graphs: the ratio of the pendulum lengths (l ~ T²)
    { tip: "qapali", gen: () => again(() => {
      const [p, q] = pick([[2, 1], [3, 1], [3, 2], [4, 3], [5, 2], [5, 3], [4, 1], [1, 2], [1, 3], [2, 3], [3, 4], [2, 5], [3, 5], [1, 4]]), u = pick([0.8, 1, 1.2]);
      const A1 = pick([1, 2, 3]), A2 = pick([1, 2, 3]); if (A1 === A2) return null;
      const T1 = p * u, T2 = q * u, tmax = Math.ceil(1.25 * Math.max(p, q)) * u, right = fr(p * p, q * q);
      const o = ae(right, [fr(p, q), fr(q, p), fr(q * q, p * p), fr(A1, A2)], x => x); if (!o) return null;
      return mc(o, { svg: svgEl(sGraph({ tmax, step: u, ymax: Math.max(A1, A2), yt: [{ v: A1, c: ACC }, { v: A2, c: VEC }, { v: -A1, c: ACC }, { v: -A2, c: VEC }], curves: [{ A: A1, T: T1, ph: "cos", c: ACC }, { A: A2, T: T2, ph: "cos", c: VEC }], leg: [["1", ACC], ["2", VEC]], aria: "İki rəqqasın x–t qrafikləri bir koordinat sistemində: 1 və 2" })),
        text: `Eyni yerdə rəqs edən iki riyazi rəqqasın x–t qrafikləri bir koordinat sistemində verilib (x sm-lə). Rəqslər kiçikdir (amplitudalar ip uzunluğundan çox kiçikdir). 1-ci və 2-ci rəqqasların ip uzunluqlarının l₁/l₂ nisbəti nə qədərdir?`,
        solution: `Qrafikdən: T₁ = ${F(T1)} s, T₂ = ${F(T2)} s (amplitudalar A₁ = ${A1} sm, A₂ = ${A2} sm, period üçün əhəmiyyəti yoxdur). T = 2π√(l/g) → l ~ T². l₁/l₂ = (T₁/T₂)² = (${F(T1)}/${F(T2)})² = (${fr(p, q)})² = ${right}. Tələlər: kvadratı unutmaq (${fr(p, q)}), nisbəti tərsinə yazmaq (${fr(q * q, p * p)}, ${fr(q, p)}), amplitudaların nisbətini götürmək (${fr(A1, A2)}).` });
    }) },
    // 4. two springs in series (Hooke's law: the stiffness of the combination), the period
    { tip: "qapali", birlesik: "fiz-huk", gen: () => again(() => {
      const c = pick([5, 10, 15, 20, 25]), sw = Math.random() < 0.5, ka = 16 * c, kb = 9 * c, k1 = sw ? kb : ka, k2 = sw ? ka : kb, k = k1 * k2 / (k1 + k2), T = pick([0.5, 1, 1.5, 2, 2.5]), m = k * T * T / 40;
      if (!nice(m, 3)) return null;
      const Tp = 0.48 * T, Ta = 0.6 * T, Tb = 0.8 * T, Ts = 1.4 * T, T1 = sw ? Tb : Ta, T2 = sw ? Ta : Tb;
      const w = [Tp, T1, T2, Ts]; if (![T, ...w].every(x => ok2(x, 2))) return null;
      return mc(ae(T, w, U_("s")), { svg: svgEl(sSeries(k1, k2, m)),
        text: `Sərtlikləri k₁ = ${k1} N/m və k₂ = ${k2} N/m olan iki yay şəkildəki kimi ardıcıl birləşdirilib, aşağı ucundan kütləsi ${F(m)} kq olan yük asılıb. Yükü şaquli istiqamətdə bir az dartıb buraxsaq, rəqs periodu nə qədər olar? (π² ≈ 10; yayların kütləsi yoxdur.)`,
        solution: `Ardıcıl birləşmədə hər iki yayın uzanması toplanır: 1/k = 1/k₁ + 1/k₂, k = k₁k₂/(k₁+k₂) = ${k1}·${k2}/${k1 + k2} = ${F(k)} N/m. T = 2π√(m/k) = 2√(10m/k) = 2√(10·${F(m)}/${F(k)}) = 2·${F(T / 2)} = ${F(T)} s. Tələlər: yayları paralel hesab etmək, k = ${k1 + k2} N/m (T = ${F(+Tp.toFixed(4))} s), yalnız bir yayı götürmək (k₁ ilə ${F(+T1.toFixed(4))} s, k₂ ilə ${F(+T2.toFixed(4))} s), periodları toplamaq (${F(+Ts.toFixed(4))} s).` });
    }) },
    // 5. a pendulum in an accelerating lift / rocket (effective g)
    { tip: "qapali", birlesik: "fiz-qeyri-inersial", gen: () => again(() => {
      const [ge, a, up] = pick([[40, 30, true], [22.5, 12.5, true], [14.4, 4.4, true], [90, 80, true], [2.5, 7.5, false], [6.4, 3.6, false], [3.6, 6.4, false], [1.6, 8.4, false]]), r = Math.sqrt(10 / ge);
      const T0 = pick([0.6, 0.9, 1.2, 1.5, 1.8, 2.4, 3]), T = T0 * r;
      const w = [T0, T0 * 10 / ge, T0 * ge / 10, T0 / r]; if (![T, ...w].every(x => ok2(x, 2))) return null;
      const vUp = Math.random() < 0.5, mov = (ge > 10) === vUp ? "sürəti artır" : "sürəti azalır", obj = a >= 10 ? "raket" : "lift", Ob = obj[0].toUpperCase() + obj.slice(1), dirw = vUp ? "yuxarı qalxır" : "aşağı enir", ad = ge > 10 ? "yuxarı" : "aşağı", rs = fr(Math.round(r * 60), 60);
      return mc(ae(T, w, U_("s")), { svg: svgEl(sLift(vUp, ge > 10, undefined, obj)),
        text: `${Ob} ${dirw}, ${mov}; təcilinin modulu a = ${F(a)} m/s²-dir (şəkildə sürət v, təcil a ilə göstərilib). ${Ob} sakit olanda içindəki riyazi rəqqasın periodu T₀ = ${F(T0)} s idi. Hərəkət zamanı kiçik rəqslərin periodu nə qədərdir? (g = 10 m/s², ip uzunluğu dəyişmir.)`,
        solution: `${Ob}in sürəti ${mov === "sürəti artır" ? "artdığı" : "azaldığı"} üçün təcil ${ad} yönəlib (şəkildə a oxu ${ad}dır). Effektiv sərbəstdüşmə təcili: g' = g ${ge > 10 ? "+" : "−"} a = 10 ${ge > 10 ? "+" : "−"} ${F(a)} = ${F(ge)} m/s². T ~ 1/√g' olduğundan T/T₀ = √(g/g') = √(10/${F(ge)}) = ${rs}. T = ${F(T0)}·${rs} = ${F(+T.toFixed(4))} s. Tələlər: periodu dəyişməz saymaq (${F(T0)} s), kökü unutmaq (${F(+(T0 * 10 / ge).toFixed(4))} s), nisbəti tərsinə yazmaq (${F(+(T0 / r).toFixed(4))} s və ${F(+(T0 * ge / 10).toFixed(4))} s). Təcilin istiqaməti sürətin yox, sürət dəyişməsinin istiqamətidir.` });
    }) },
    // 6. pendulum released at angle α: the tension at the lowest point (energy conservation + circular motion)
    { tip: "qapali", birlesik: "fiz-enerji-saxlanma", gen: () => again(() => {
      const m = pick([0.2, 0.25, 0.4, 0.5, 1, 2]), l = pick([0.5, 1, 1.5, 2, 2.5, 3]), c = pick([0.5, 0.6, 0.8]), mg = m * 10, right = mg * (3 - 2 * c);
      const w = [mg, 2 * mg * (1 - c), mg * (3 - c), 3 * mg]; if (![right, ...w].every(x => ok2(x, 3))) return null;
      return mc(ae(right, w, U_("N")), { svg: svgEl(sPendTension(m, l, c)),
        text: `Kütləsi ${F(m)} kq olan yük uzunluğu ${F(l)} m olan yüngül, uzanmayan ipdən asılıb. İpi şaquli ilə α bucağı qədər (cos α = ${F(c)}) kənara çəkib başlanğıc sürətsiz buraxırlar. Yük ən aşağı nöqtədən keçəndə ipin dartılma qüvvəsi nə qədərdir? (Müqavimət yoxdur, g = 10 m/s².)`,
        solution: `Enerjinin saxlanması: ən aşağı nöqtədə yük h = l(1 − cos α) = ${F(l)}·${F(+(1 - c).toFixed(4))} = ${F(+(l * (1 - c)).toFixed(4))} m enir, mv²/2 = mgh → v² = 2gl(1 − cos α) = ${F(+(20 * l * (1 - c)).toFixed(4))} m²/s². Ən aşağı nöqtədə yük çevrə üzrə hərəkət edir: T − mg = mv²/l → T = mg + 2mg(1 − cos α) = mg(3 − 2cos α) = ${F(mg)}·${F(+(3 - 2 * c).toFixed(4))} = ${F(right)} N (uzunluq ixtisar olur). Tələlər: mg (${F(mg)} N, yük sakit asılıdır), yalnız mv²/l (${F(+(2 * mg * (1 - c)).toFixed(4))} N, mg-ni unutmaq), 2-ni unutmaq: mg(3 − cos α) = ${F(+(mg * (3 - c)).toFixed(4))} N, 3mg (${F(3 * mg)} N; cos α = 0 götürmək).` });
    }) },
    // 7. x(t) graph with a marked point P: the kinetic energy there (E = kA²/2 = E_k + kx²/2)
    { tip: "qapali", gen: () => again(() => {
      const [A, x, d] = pick([[5, 3, 4], [5, 4, 3], [10, 6, 8], [10, 8, 6], [13, 5, 12], [15, 9, 12], [15, 12, 9], [20, 12, 16]]), k = pick([20, 40, 50, 80, 100, 200, 250, 400]), T = pick([0.4, 0.5, 0.8, 1, 1.2, 2]);
      const Ek = k * (d / 100) ** 2 / 2, w = [k * (A / 100) ** 2 / 2, k * (x / 100) ** 2 / 2, k * (d / 100) ** 2, k * ((A - x) / 100) ** 2 / 2];
      if (![Ek, ...w].every(v => ok2(v, 4))) return null;
      const tp = T * Math.acos(x / A) / (2 * Math.PI);
      return mc(ae(Ek, w, U_("J")), { svg: svgEl(sGraph({ tmax: 2 * T, step: T / 2, ymax: A, yt: [{ v: A }, { v: -A }, { v: x, c: VEC }], curves: [{ A, T, ph: "cos", c: ACC }], P: { t: tp, x }, aria: "Yaylı rəqqasın x–t qrafiki; P nöqtəsində x yerdəyişməsi göstərilib" })),
        text: `Sərtliyi k = ${k} N/m olan yayda yükün rəqs qrafiki (x sm-lə) verilib. Qrafikdəki P nöqtəsinə uyğun anda yükün kinetik enerjisi nə qədərdir? (Müqavimət yoxdur.)`,
        solution: `Qrafikdən: A = ${A} sm, P nöqtəsində x = ${x} sm (T = ${F(T)} s bu sualda lazım deyil). Tam enerji E = kA²/2 = ${k}·${F((A / 100) ** 2)}/2 = ${F(+(k * (A / 100) ** 2 / 2).toFixed(5))} J; P nöqtəsində yayda E_p = kx²/2 = ${k}·${F((x / 100) ** 2)}/2 = ${F(+(k * (x / 100) ** 2 / 2).toFixed(5))} J. Kinetik enerji: E_k = E − E_p = k(A² − x²)/2 = ${k}·(${F((A / 100) ** 2)} − ${F((x / 100) ** 2)})/2 = ${F(+Ek.toFixed(5))} J. Tələlər: tam enerjini götürmək (${F(+w[0].toFixed(5))} J), yalnız potensialı götürmək (${F(+w[1].toFixed(5))} J), 2-yə bölməyi unutmaq (${F(+w[2].toFixed(5))} J), (A − x)² yazmaq (${F(+w[3].toFixed(5))} J).` });
    }) },
    // 8. the spring stretched by Δl under the weight (Hooke's law), pulled down by A: the maximum speed
    { tip: "qapali", birlesik: "fiz-huk", gen: () => again(() => {
      const dl = pick([2.5, 10, 16, 40]), w0 = Math.sqrt(10 / (dl / 100)), A = pick([2, 3, 4, 5, 6, 8]), v = A / 100 * w0;
      const w = [A / 100 / w0, A / 100 * w0 * w0, dl / 100 * w0, (A + dl) / 100 * w0]; if (![v, ...w].every(x => ok2(x, 4))) return null;
      return mc(ae(v, w, U_("m/s")), { svg: svgEl(sHang(dl, A)),
        text: `Yaydan yük asılanda yay Δl = ${F(dl)} sm uzanıb tarazlıqda qalır. Yükü tarazlıq vəziyyətindən A = ${F(A)} sm aşağı çəkib başlanğıc sürətsiz buraxırlar. Yükün maksimal sürəti nə qədərdir? (g = 10 m/s², yayın kütləsi yoxdur, rəqs harmonikdir.)`,
        solution: `Tarazlıqda kΔl = mg → k/m = g/Δl = 10/${F(dl / 100)} = ${F(+(10 / (dl / 100)).toFixed(4))} s⁻² (Δl = ${F(dl)} sm = ${F(dl / 100)} m). ω = √(k/m) = ${F(w0)} rad/s. Amplituda tarazlıqdan ölçülür: A = ${F(A)} sm = ${F(A / 100)} m. v_max = Aω = ${F(A / 100)}·${F(w0)} = ${F(+v.toFixed(5))} m/s. Tələlər: ω-nı tərsinə yazmaq (${F(+w[0].toFixed(5))} m/s), Aω² götürmək (${F(+w[1].toFixed(5))}, bu təcildir), Δl-i amplituda saymaq (${F(+w[2].toFixed(5))} m/s), amplitudanı A + Δl götürmək (${F(+w[3].toFixed(5))} m/s).` });
    }) },
    // 9. a pendulum on another planet (g ~ M/R², T ~ 1/√g)
    { tip: "qapali", birlesik: "fiz-cazibe", gen: () => again(() => {
      const [pM, qM] = pick([[1, 4], [4, 1], [1, 9], [9, 1], [1, 16], [16, 1], [9, 4], [4, 9]]), [pR, qR] = pick([[1, 2], [2, 1], [1, 3], [3, 1], [3, 2], [2, 3], [4, 3]]);
      const a = pM / qM, b = pR / qR, sa = Math.sqrt(a), Te = pick([0.6, 0.9, 1.2, 1.5, 1.8, 2, 2.4, 3]), T = Te * b / sa;
      const w = [Te * b / a, Te * b * sa, Te * sa / b, Te * b * b / a]; if (![T, ...w].every(x => ok2(x, 2))) return null;
      const lab = (sym, p, q) => p === q ? sym : q === 1 ? `${p}${sym}` : p === 1 ? `${sym}/${q}` : `${p}${sym}/${q}`, gr = fr(pM * qR * qR, qM * pR * pR);
      return mc(ae(T, w, U_("s")), { svg: svgEl(sPlanet(pR, qR, pM, qM)),
        text: `Planetin radiusu Yerin radiusunun ${fr(pR, qR)} mislinə, kütləsi isə Yerin kütləsinin ${fr(pM, qM)} mislinə bərabərdir. Yer səthində periodu ${F(Te)} s olan riyazi rəqqas bu planetin səthində neçə saniyə periodla rəqs edər? (Rəqqasın uzunluğu eynidir, hər iki yerdə rəqslər kiçikdir.)`,
        solution: `g = GM/R² olduğundan g_pl/g = (M_pl/M)/(R_pl/R)² = (${fr(pM, qM)}) : (${fr(pR, qR)})² = ${gr}. T ~ 1/√g → T_pl = T·√(g/g_pl) = ${F(Te)}·√(${fr(qM * pR * pR, pM * qR * qR)}) = ${F(Te)}·${fr(Math.round(b / sa * 360), 360)} = ${F(+T.toFixed(4))} s. Tələlər: kütlə nisbətinin kökünü götürməmək (${F(+w[0].toFixed(4))} s), kütləni tərsinə götürmək (${F(+w[1].toFixed(4))} s), nisbəti tərsinə yazmaq (${F(+w[2].toFixed(4))} s), T-ni 1/g ilə mütənasib saymaq (${F(+w[3].toFixed(4))} s).` });
    }) },
    // 10. a pendulum whose string catches on a nail: half a period on each side
    { tip: "qapali", gen: () => again(() => {
      const T1 = pick([1.2, 1.6, 1.8, 2, 2.4, 3]), T2 = pick([0.6, 0.8, 1, 1.2, 1.4, 1.8]); if (T2 >= T1 || 2 * T2 < T1) return null;
      const l = T1 * T1 / 4, l2 = T2 * T2 / 4, d = l - l2, right = (T1 + T2) / 2;
      const w = [T1, T2, T1 + T2, T1 - T2]; if (![l, d, right, ...w].every(x => ok2(x, 3))) return null;
      return mc(ae(right, w, U_("s")), { svg: svgEl(sNail(+l.toFixed(4), +d.toFixed(4))),
        text: `Riyazi rəqqasın ipinin uzunluğu l = ${F(l)} m-dir. Asılma nöqtəsindən d = ${F(+d.toFixed(4))} m aşağıda, şaquli üzərində mismar var: rəqqas tarazlıq vəziyyətindən keçəndə ip mismara toxunur. Rəqqasın kiçik rəqslərinin periodu nə qədərdir? (Şəkildə bucaq aydınlıq üçün böyük çəkilib; π² ≈ 10, g = 10 m/s².)`,
        solution: `Rəqqas rəqsinin bir yarısını uzunluğu l = ${F(l)} m olan rəqqas kimi, digər yarısını uzunluğu l − d = ${F(l)} − ${F(+d.toFixed(4))} = ${F(+l2.toFixed(4))} m olan rəqqas kimi edir. T = 2√l (π² ≈ 10): T₁ = 2√${F(l)} = ${F(T1)} s, T₂ = 2√${F(+l2.toFixed(4))} = ${F(T2)} s. Period = T₁/2 + T₂/2 = ${F(T1 / 2)} + ${F(T2 / 2)} = ${F(+right.toFixed(4))} s. Tələlər: yalnız uzun ipin periodu (${F(T1)} s), yalnız qısa ipin periodu (${F(T2)} s), periodları tam toplamaq (${F(+(T1 + T2).toFixed(4))} s), onları çıxmaq (${F(+(T1 - T2).toFixed(4))} s).` });
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
      key: "fiz-reqsler", title: "Rəqslər: riyazi və yaylı rəqqas", fenn: "fizika", link: "dersler/fiz-reqsler.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: s, Hz, rad/s, m, J). Onluq kəsr vergül və ya nöqtə ilə: 0,4. g = 10 m/s², lazım olanda π² ≈ 10.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["temel", "temel", "riyazi", "riyazi", "yayli", "yayli", "oxsar", "enerji", "enerji", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-reqsler.html")) b.push("dersler/fiz-reqsler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
