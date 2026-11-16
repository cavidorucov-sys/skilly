// Fizika olimpiadası · Dalğalar və səs — mastery game levels (λ = vT, v = λν; səsin sürəti; əks-səda; rezonans) and the final test.
// Every generator returns a new problem with random numbers. SI units; sound in air 340 m/s unless the text says otherwise.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const VS = 340;   // sound in air, m/s

  const levels = [
    { id: "dalga", ad: "λ = vT, v = λν", izah: "Dalğa bir periodda bir dalğa uzunluğu qədər gedir: v = λ/T = λν. Tezlik ν və period T dalğa mənbəyindən asılıdır.",
      gen() {
        const kind = pick(["v", "lam", "nu", "boat", "T", "crest"]);
        if (kind === "v") {
          const lam = pick([0.5, 1, 1.5, 2, 3, 4, 5, 8, 12]), nu = pick([0.5, 2, 2.5, 4, 5, 10, 20, 50]);
          return R(lam * nu, "m/s", { text: `Dalğanın uzunluğu ${F(lam)} m, tezliyi ${F(nu)} Hz-dir. Dalğanın yayılma sürəti nə qədərdir?`,
            solution: `v = λν = ${F(lam)}·${F(nu)} = ${F(lam * nu)} m/s.` });
        }
        if (kind === "lam") {
          const nu = pick([2, 4, 5, 10, 20, 25, 50, 100]), lam = pick([0.2, 0.5, 1, 1.5, 2, 3, 4, 10]);
          return R(lam, "m", { text: `Dalğa ${F(lam * nu)} m/s sürətlə yayılır, tezliyi ${nu} Hz-dir. Dalğa uzunluğu nə qədərdir?`,
            solution: `λ = v/ν = ${F(lam * nu)}/${nu} = ${F(lam)} m.` });
        }
        if (kind === "nu") {
          const lam = pick([0.5, 1, 2, 2.5, 4, 5, 10]), nu = pick([0.4, 0.5, 2, 4, 5, 8, 10, 20]);
          return R(nu, "Hz", { text: `Dalğanın sürəti ${F(lam * nu)} m/s, dalğa uzunluğu ${F(lam)} m-dir. Tezliyi tap.`,
            solution: `ν = v/λ = ${F(lam * nu)}/${F(lam)} = ${F(nu)} Hz.` });
        }
        if (kind === "boat") {
          let lam, N, t, nu;
          do { lam = pick([2, 3, 4, 5, 6, 8, 10]); nu = pick([0.25, 0.4, 0.5, 1, 2, 2.5]); N = pick([5, 8, 10, 15, 20]); t = N / nu; } while (!nice(t, 1));
          return R(lam * nu, "m/s", { text: `Dənizdə lövbər salmış qayıq ${F(t)} s-də ${N} dəfə qalxıb enir. Qonşu iki dalğa qabarığı arasındakı məsafə ${lam} m-dir. Dalğanın sürəti nə qədərdir?`,
            solution: `Qayıq dalğanın tezliyi ilə rəqs edir: ν = N/t = ${N}/${F(t)} = ${F(nu)} Hz. Qonşu qabarıqlar arası məsafə dalğa uzunluğudur: v = λν = ${lam}·${F(nu)} = ${F(lam * nu)} m/s.` });
        }
        if (kind === "T") {
          const lam = pick([3, 6, 8, 12, 15, 20, 24]), T = pick([2, 3, 4, 5, 6]);
          return R(T, "s", { text: `Dalğa ${F(lam / T)} m/s sürətlə yayılır, dalğa uzunluğu ${lam} m-dir. Dalğanın periodu nə qədərdir?`,
            solution: `T = λ/v = ${lam}/${F(lam / T)} = ${T} s.` });
        }
        const lam = pick([2, 3, 4, 5, 6]), n = rnd(4, 12), T = pick([2, 3, 4, 5]);
        return R(lam / T, "m/s", { text: `Sahilə yaxın bir nöqtədən ${n} dalğa qabarığı ${n * T} s-də keçir (hər qabarıq bir tam periodda bir dəfə keçir). Qonşu qabarıqlar arası ${lam} m-dir. Dalğanın sürəti?`,
          solution: `Bir qabarıq hər T aralığında keçir: T = ${n * T}/${n} = ${T} s. v = λ/T = ${lam}/${T} = ${F(lam / T)} m/s.` });
      } },
    { id: "muhit", ad: "Mühit dəyişəndə", izah: "Dalğa bir mühitdən digərinə keçəndə tezlik ν (mənbəyin tezliyi) dəyişmir. v və λ dəyişir: λ = v/ν.",
      gen() {
        const kind = pick(["lam2", "lam1", "radio"]);
        if (kind === "radio") {
          const nu = pick([60, 100, 150, 300]), c = 3e8, lam = c / (nu * 1e6);
          return R(lam, "m", { text: `Radiostansiya ${nu} MHz tezliklə yayım edir. Radiodalğanın sürəti 3·10⁸ m/s-dir. Dalğa uzunluğu nə qədərdir?`,
            solution: `ν = ${nu}·10⁶ Hz. λ = c/ν = 3·10⁸/(${nu}·10⁶) = ${F(lam)} m.` });
        }
        const nu = pick([250, 340, 500, 850, 1000, 1700]), va = 340, vw = pick([1360, 1700, 1020]);
        const lamA = va / nu, lamW = vw / nu;
        if (!nice(lamA, 3) || !nice(lamW, 3)) return levels[1].gen();
        if (kind === "lam2") return R(lamW, "m", { text: `Mənbə havada ${nu} Hz tezlikli səs yayır. Səsin sürəti havada ${va} m/s, suda ${vw} m/s-dir. Səsin suda dalğa uzunluğu nə qədərdir?`,
          solution: `Mühit dəyişəndə tezlik sabit qalır: ν = ${nu} Hz. λ = v/ν = ${vw}/${nu} = ${F(lamW)} m.` });
        return R(lamA, "m", { text: `Səs havada ${va} m/s, suda ${vw} m/s sürətlə yayılır. Sudakı dalğa uzunluğu ${F(lamW)} m-dir. Eyni səsin havadakı dalğa uzunluğu nə qədərdir?`,
          solution: `Tezlik sabitdir: ν = ${vw}/${F(lamW)} = ${nu} Hz. Havada λ = ${va}/${nu} = ${F(lamA)} m.` });
      } },
    { id: "ses", ad: "Səsin sürəti", izah: "Havada səsin sürəti 340 m/s. Şimşəyin işığı dərhal görünür, gurultu gecikir. Ultrasəs 20 kHz-dən yuxarıdır.",
      gen() {
        const kind = pick(["gur", "gur2", "lam", "us", "rels"]);
        if (kind === "gur") {
          const t = pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 15]);
          return R(VS * t, "m", { text: `Şimşək çaxandan ${t} s sonra gurultu eşidilib. Şimşək neçə metr uzaqda çaxıb? Səsin sürəti 340 m/s, işığın gəlmə vaxtını nəzərə alma.`,
            solution: `s = vt = 340·${t} = ${VS * t} m.` });
        }
        if (kind === "gur2") {
          const s = pick([340, 680, 1020, 1700, 2380, 3400]);
          return R(s / VS, "s", { text: `Ildırım ${F(s)} m məsafədə çaxdı. Gurultu neçə saniyə sonra eşidiləcək? (Səsin sürəti 340 m/s.)`,
            solution: `t = s/v = ${s}/340 = ${F(s / VS)} s.` });
        }
        if (kind === "lam") {
          const nu = pick([34, 68, 85, 170, 340, 425, 680]);
          return R(VS / nu, "m", { text: `Havada ${nu} Hz tezlikli səsin dalğa uzunluğu nə qədərdir? (Səsin sürəti 340 m/s.)`,
            solution: `λ = v/ν = 340/${nu} = ${F(VS / nu)} m.` });
        }
        if (kind === "us") {
          const nu = pick([17000, 34000, 68000, 85000]), lam = VS / nu * 100;
          return R(lam, "sm", { text: `Yarasa ${F(nu)} Hz tezlikli ultrasəs siqnalı göndərir. Siqnalın havada dalğa uzunluğu neçə santimetrdir? (v = 340 m/s.)`,
            solution: `λ = v/ν = 340/${F(nu)} = ${F(VS / nu)} m = ${F(lam)} sm.` });
        }
        const dt = pick([0.14, 0.28, 0.42, 0.7, 1.4]), s = 5100 * dt / 14;
        return R(s, "m", { text: `Uzun polad borunun bir ucuna çəkiclə vurdular. O biri ucda iki səs eşidilir: biri polad boru ilə, o biri hava ilə gəlib. Aralarındakı fərq ${F(dt)} s-dir. Polad borunun uzunluğu nə qədərdir? Polad boruda səsin sürəti 5100 m/s, havada 340 m/s.`,
          solution: `s/340 − s/5100 = ${F(dt)} → s·(15 − 1)/5100 = ${F(dt)} → s = 5100·${F(dt)}/14 = ${F(s)} m.` });
      } },
    { id: "eks", ad: "Əks-səda", izah: "Əks-sədada səs maneəyə gedib qayıdır: 2s = vt. Hərəkətdə olan mənbə üçün yolları ayrıca yaz.",
      gen() {
        const kind = pick(["hava", "sonar", "iki", "avto", "min"]);
        if (kind === "hava") {
          const t = pick([0.5, 1, 1.5, 2, 3, 4, 5, 6]);
          return R(VS * t / 2, "m", { text: `Dağın qarşısında qışqıran adam əks-sədanı ${F(t)} s-dən sonra eşidir. Dağa qədər məsafə nə qədərdir? (v = 340 m/s.)`,
            solution: `Səs dağa gedib qayıdır: 2s = vt = 340·${F(t)} = ${F(VS * t)} m → s = ${F(VS * t / 2)} m.` });
        }
        if (kind === "sonar") {
          const t = pick([0.2, 0.4, 0.6, 0.8, 1, 1.6, 2, 3, 4]);
          return R(1500 * t / 2, "m", { text: `Gəminin exolotu dənizin dibinə ultrasəs siqnalı göndərir. Əks-səda ${F(t)} s-dən sonra qayıdır. Suda səsin sürəti 1500 m/s-dir. Dəniz neçə metr dərindir?`,
            solution: `2h = vt = 1500·${F(t)} = ${F(1500 * t)} m → h = ${F(750 * t)} m.` });
        }
        if (kind === "iki") {
          const t1 = pick([0.5, 1, 1.5, 2, 3]), t2 = pick([2.5, 3, 4, 5, 6]);
          return R(VS * (t1 + t2) / 2, "m", { text: `Dar dərədə iki qaya arasında dayanan alpinist qışqırır. Birinci əks-səda ${F(t1)} s-dən, ikincisi ${F(t2)} s-dən sonra eşidilir. Qayalar arasındakı məsafə nə qədərdir? (v = 340 m/s.)`,
            solution: `Birinci qayaya qədər: ${F(VS * t1 / 2)} m, ikinci qayaya qədər: ${F(VS * t2 / 2)} m. Cəmi (alpinist iki qayanın arasında): ${F(VS * (t1 + t2) / 2)} m.` });
        }
        if (kind === "avto") {
          const u = pick([10, 20, 30]), t = pick([2, 4, 6, 8]), L = (VS + u) * t / 2;
          return R(L, "m", { text: `Avtomobil ${u} m/s sürətlə uçurumun divarına doğru gedir. Siqnal verdikdən ${t} s sonra sürücü əks-sədanı eşidir. Siqnal veriləndə avtomobil divardan nə qədər uzaqda idi? (v = 340 m/s.)`,
            solution: `Siqnal veriləndə məsafə L olsun. ${t} s-də səs gedib qayıdır, avtomobil isə ${u}·${t} = ${u * t} m divara yaxınlaşır. Səsin yolu + avtomobilin yolu = 2L: 340·${t} + ${u * t} = 2L → L = ${F(L)} m.` });
        }
        const tm = pick([0.1, 0.2]);
        return R(VS * tm / 2, "m", { text: `Qulaq iki səsi ancaq aralarındakı fərq ən azı ${F(tm)} s olanda ayırır. Bu halda əks-sədanı ayrıca eşitmək üçün maneə ən azı nə qədər uzaqda olmalıdır? (v = 340 m/s.)`,
          solution: `2s = vt = 340·${F(tm)} = ${F(VS * tm)} m → s = ${F(VS * tm / 2)} m.` });
      } },
    { id: "rezonans", ad: "Rezonans", izah: "Rezonans: məcburi qüvvənin tezliyi sistemin öz tezliyinə bərabərdir. Simdə əsas ton ν₁ = v/(2L), bir ucu qapalı borunun əsas tonu ν₁ = v/(4L).",
      gen() {
        const kind = pick(["sim", "acboru", "qapali", "ton", "korpu", "yellenc"]);
        if (kind === "sim") {
          let v, L, nu; do { v = pick([100, 150, 200, 240, 300, 400, 600]); L = pick([0.25, 0.4, 0.5, 0.6, 0.75, 1]); nu = v / (2 * L); } while (!nice(nu, 2));
          return R(nu, "Hz", { text: `Uzunluğu ${F(L)} m olan gərilmiş simdə dalğanın sürəti ${v} m/s-dir. Simin əsas tonunun tezliyi nə qədərdir? (Simin uzunluğuna yarım dalğa uyğun gəlir.)`,
            solution: `Əsas tonda L = λ/2 → λ = ${F(2 * L)} m. ν = v/λ = ${v}/${F(2 * L)} = ${F(nu)} Hz.` });
        }
        if (kind === "acboru") {
          const L = pick([0.17, 0.34, 0.5, 0.85, 1.7]), nu = VS / (2 * L);
          return R(nu, "Hz", { text: `Hər iki ucu açıq uzunluğu ${F(L)} m olan borunun (fleytanın) əsas tonunun tezliyi nə qədərdir? Havada səsin sürəti 340 m/s. (Boruda yarım dalğa yerləşir.)`,
            solution: `Əsas tonda L = λ/2 → λ = ${F(2 * L)} m. ν = 340/${F(2 * L)} = ${F(nu)} Hz.` });
        }
        if (kind === "qapali") {
          const L = pick([0.085, 0.17, 0.34, 0.425, 0.85]), nu = VS / (4 * L);
          return R(nu, "Hz", { text: `Bir ucu qapalı, uzunluğu ${F(L)} m olan borunun əsas tonunun tezliyi nə qədərdir? Havada səsin sürəti 340 m/s. (Borunun uzunluğuna dalğanın dörddə biri sığır.)`,
            solution: `Əsas tonda L = λ/4 → λ = ${F(4 * L)} m. ν = 340/${F(4 * L)} = ${F(nu)} Hz.` });
        }
        if (kind === "ton") {
          const n = rnd(2, 5), f1 = pick([55, 110, 120, 220, 250]);
          return R(n * f1, "Hz", { text: `Simin əsas tonunun tezliyi ${f1} Hz-dir. Onun ${n}-ci harmonikasının (${n}-ci tonunun) tezliyi nə qədərdir?`,
            solution: `Sim üçün ν_n = n·ν₁ = ${n}·${f1} = ${n * f1} Hz.` });
        }
        if (kind === "korpu") {
          const nu = pick([1.25, 1.5, 2, 2.5]);
          return R(nu * 60, "", { text: `Körpünün şaquli rəqslərinin öz tezliyi ${F(nu)} Hz-dir. Əsgərlər körpüdən eyni addımla keçərsə, rezonans təhlükəsi yaranmaması üçün dəqiqədə neçə addım atmamalıdırlar? (Rezonans addım tezliyi öz tezliyə bərabər olanda başlayır.)`,
            solution: `Rezonans: addım tezliyi = ${F(nu)} Hz = ${F(nu)}·60 = ${F(nu * 60)} addım/dəq. Məhz bu tezlikdən qaçmaq lazımdır.` });
        }
        const T = pick([1.5, 2, 2.5, 3, 4, 5]), per = 60 / T;
        if (!Number.isInteger(per)) return levels[4].gen();
        return R(per, "", { text: `Yellənçəyin periodu ${F(T)} s-dir. Valideyn yellənçəyi rezonansla yelləmək üçün onu 1 dəqiqədə neçə dəfə itələməlidir?`,
          solution: `Rezonansda itələmə tezliyi öz tezliyə bərabərdir: ν = 1/${F(T)} Hz. Dəqiqədə 60/${F(T)} = ${per} dəfə.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          const t = pick([1, 2, 3, 4, 5, 6]), s = VS * t / 2, X = VS * t;
          task = `Dərənin divarına doğru qışqıran şagird əks-sədanı ${t} s-dən sonra eşidir. Divara qədər məsafəni tapın (v = 340 m/s).`;
          steps = [`Səs divara gedib qayıdır, buna görə yol 2s-dir: 2s = vt.`, `2s = 340·${t} = ${X} m.`, `s = ${X}/2 = ${F(s)} m.`];
          if (bad === 0) steps = [`Səs divara çatır, buna görə s = vt.`, `s = 340·${t} = ${X} m.`, `Cavab: s = ${X} m.`];
          if (bad === 1) { const X2 = X + 100; steps[1] = `2s = 340·${t} = ${X2} m.`; steps[2] = `s = ${X2}/2 = ${F(X2 / 2)} m.`; }
          if (bad === 2) steps[2] = `s = ${X}·2 = ${2 * X} m.`;
          why = [`1-ci addım: əks-sədada səs maneəyə gedib qayıdır, yol 2s-dir. Düz cavab ${F(s)} m.`,
            `2-ci addım: 340·${t} = ${X}, ${X + 100} deyil. Düz cavab ${F(s)} m.`,
            `3-cü addım: 2s = ${X} olduğundan s = ${X}/2 (bölünür), ikiyə vurulmur. Düz cavab ${F(s)} m.`][bad];
        } else {
          let lam, N, t, nu;
          do { lam = pick([20, 25, 40, 50, 60, 80, 120, 150]); nu = pick([0.5, 1, 2, 2.5, 4, 5]); N = pick([10, 20, 30, 40]); t = N / nu; } while (!nice(t, 1) || !nice(lam / 100 * nu, 3));
          const v = lam / 100 * nu;
          task = `Gölün suyunda dalğa qabarıqları arasındakı məsafə ${lam} sm-dir. Üzən topu ${F(t)} s-də ${N} dəfə qalxıb enir. Dalğanın sürətini tapın (m/s).`;
          steps = [`Tezlik ν = N/t = ${N}/${F(t)} = ${F(nu)} Hz.`, `Dalğa uzunluğu λ = ${lam} sm = ${F(lam / 100)} m.`, `v = λν = ${F(lam / 100)}·${F(nu)} = ${F(v)} m/s.`];
          if (bad === 0) { const nw = t / N; steps = [`Tezlik ν = t/N = ${F(t)}/${N} = ${F(+nw.toFixed(5))} Hz.`, `Dalğa uzunluğu λ = ${lam} sm = ${F(lam / 100)} m.`, `v = λν = ${F(lam / 100)}·${F(+nw.toFixed(5))} = ${F(+(lam / 100 * nw).toFixed(5))} m/s.`]; }
          if (bad === 1) { steps[1] = `Dalğa uzunluğu λ = ${lam} sm = ${F(lam / 10)} m.`; steps[2] = `v = λν = ${F(lam / 10)}·${F(nu)} = ${F(lam / 10 * nu)} m/s.`; }
          if (bad === 2) steps[2] = `v = λ/ν = ${F(lam / 100)}/${F(nu)} = ${F(+(lam / 100 / nu).toFixed(5))} m/s.`;
          why = [`1-ci addım: tezlik 1 saniyədəki rəqs sayıdır: ν = N/t. Düz cavab ${F(v)} m/s.`,
            `2-ci addım: 1 m = 100 sm, ${lam} sm = ${F(lam / 100)} m. Düz cavab ${F(v)} m/s.`,
            `3-cü addım: v = λν (bölmə yox, vurma). Düz cavab ${F(v)} m/s.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Göy gurultusu, exolot, stadionda səs, radio, yarasa.",
      gen() {
        const kind = pick(["stadion", "yarasa", "radio", "ildirim", "sonarlar"]);
        if (kind === "stadion") {
          const s = pick([34, 68, 102, 170, 340, 510]);
          return R(s / VS, "s", { text: `Stadionda səsucaldan səsi radio ilə eyni anda yayır. Səsucaldandan ${s} m aralı oturan tamaşaçı səsi havadan neçə saniyə gec eşidir? (Radio siqnalının gecikməsini nəzərə alma, v = 340 m/s.)`,
            solution: `t = s/v = ${s}/340 = ${F(s / VS)} s.` });
        }
        if (kind === "yarasa") {
          const t = pick([0.01, 0.02, 0.03, 0.04, 0.05]);
          return R(VS * t / 2, "m", { text: `Yarasa ultrasəs siqnalı göndərir və əks-sədanı ${F(t)} s-dən sonra qəbul edir. Maneə yarasadan nə qədər uzaqdadır? (v = 340 m/s.)`,
            solution: `2s = vt = 340·${F(t)} = ${F(VS * t)} m → s = ${F(VS * t / 2)} m.` });
        }
        if (kind === "radio") {
          const nu = pick([60, 100, 150, 300]);
          return R(3e8 / (nu * 1e6), "m", { text: `FM radiostansiya ${nu} MHz tezlikdə yayım edir. Radiodalğanın sürəti 3·10⁸ m/s-dir. Dalğa uzunluğu nə qədərdir?`,
            solution: `λ = c/ν = 3·10⁸/(${nu}·10⁶) = ${F(300 / nu)} m.` });
        }
        if (kind === "ildirim") {
          const t = pick([3, 6, 9, 12, 15]);
          return R(VS * t / 1000, "km", { text: `Şimşək çaxandan ${t} s sonra göy gurultusu eşidilir. Fırtına neçə kilometr uzaqdadır? (v = 340 m/s.)`,
            solution: `s = vt = 340·${t} = ${VS * t} m = ${F(VS * t / 1000)} km.` });
        }
        const t = pick([0.5, 1, 2, 3, 4]), d = 1500 * t / 2;
        return R(d, "m", { text: `Balıqçı gəmisinin exolotu dibə siqnal göndərir, əks-səda ${F(t)} s-dən sonra qayıdır. Suda səsin sürəti 1500 m/s. Dərinlik nə qədərdir?`,
          solution: `2h = 1500·${F(t)} = ${F(1500 * t)} m → h = ${F(d)} m.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a figure, several steps;
  // the wrong options are the answers of typical mistakes. Questions 8 and 9 also use "Rəqslər" (fiz-reqsler):
  // T = 2π√(m/k), T = 2π√(l/g) with π² ≈ 10, g = 10 m/s².
  const { ae, again } = Oyun;
  const ok = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const G = x => F(+(+x).toFixed(4));
  const U_ = u => x => G(x) + " " + u;
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  const INK = "var(--ink,#17171a)", ACC = "var(--accent,#a32d2d)", MUT = "var(--muted,#6b6b73)", PAP = "var(--paper,#fff)", VEC = "var(--vec,#0c447c)", SOFT = "var(--accent-soft,#f4dede)";
  const r1 = n => +(+n).toFixed(1);
  const Ln = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const Tx = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const Ar = (x1, y1, x2, y2, c = INK, w = 2) => Ln(x1, y1, x2, y2, c, w, ' marker-end="url(#dg-ar)"');
  const Dm = (x1, y1, x2, y2, c = MUT, w = 1.4) => Ln(x1, y1, x2, y2, c, w, ' marker-start="url(#dg-ar)" marker-end="url(#dg-ar)"');
  const Hd = (x1, x2, y, c = MUT) => Ln(x1, y, x2, y, c, 1.4) + Ln(x1, y - 5, x1, y + 5, c, 1.4) + Ln(x2, y - 5, x2, y + 5, c, 1.4);
  const Pt = (d, c = INK, w = 2.2, fill = "none", ex = "") => `<path d="${d}" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${ex}/>`;
  const Rc = (x, y, w, hh, fill = PAP, c = INK, sw = 2, ex = "") => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(hh)}" fill="${fill}" stroke="${c}" stroke-width="${sw}"${ex}/>`;
  const Ci = (x, y, r, fill = PAP, c = INK, sw = 2) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r}" fill="${fill}" stroke="${c}" stroke-width="${sw}"/>`;
  const DASH = ' stroke-dasharray="4 3"';
  const WAT = (x, y, w, hh) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(hh)}" fill="${VEC}" fill-opacity=".12"/>`;
  const Sv = (w, hh, inner, aria) => svgEl(`<svg viewBox="0 0 ${w} ${hh}" class="oy-svg" role="img" aria-label="${aria}"><defs><marker id="dg-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`);
  const wave = (x0, x1, cy, A, per, sin, c = ACC, w = 2.4, ph = 0) => { let p = ""; for (let x = x0; x <= x1 + 0.01; x += 2) { const a = 2 * Math.PI * (x - x0) / per + ph, y = cy - A * (sin ? Math.sin(a) : Math.cos(a)); p += (p ? "L" : "M") + r1(x) + " " + r1(y); } return Pt(p, c, w); };
  const hatchDn = (x1, x2, y) => { let o = Ln(x1, y, x2, y, INK, 2.5); for (let x = x1 + 6; x < x2; x += 10) o += Ln(x, y, x - 6, y + 8, MUT, 1.2); return o; };

  // 1. wave profile on a rope: n crests, distance D between the first and the last (D = (n − 1)λ)
  function figCrests(n, D) { const X0 = 40, X1 = 250, cy = 62, A = 32; let s = Ln(X0 - 14, cy, X1 + 22, cy, MUT, 1.2, ' marker-end="url(#dg-ar)"') + Ln(X0, 12, X0, 104, MUT, 1.2) + Tx(X0 - 8, 18, "y", "end", MUT) + Tx(X1 + 30, cy + 5, "x", "start", MUT);
    s += wave(X0, X1, cy, A, (X1 - X0) / (n - 1), false);
    for (let i = 0; i < n; i++) s += Ci(X0 + i * (X1 - X0) / (n - 1), cy - A, 3.5, ACC, ACC, 1);
    s += Ln(X1, cy - A, X1, 100, MUT, 1, DASH) + Tx(X0 - 8, cy + 16, "0", "end", INK) + Dm(X0, 96, X1, 96) + Tx((X0 + X1) / 2, 114, `${D} m`);
    return Sv(300, 124, s, `Eninə dalğanın profili: ${n} ardıcıl təpə, birinci və axırıncı təpə arası ${D} m`); }
  // 2. sound crossing from air into water: compressions of the air wave λ₁ apart, the water wave has them r times farther
  function figMedium(l1, r, v2) { const B = 110; let s = WAT(B, 34, 180, 62) + Ln(B, 30, B, 100, INK, 3) + Tx(55, 16, "hava, 340 m/s", "middle", INK, 12) + Tx(200, 16, `su, ${v2} m/s`, "middle", INK, 12) + Ar(24, 26, 92, 26, VEC, 2);
    for (let k = 0; k < 6; k++) s += Ln(14 + 16 * k, 36, 14 + 16 * k, 94, INK, 1.8);
    const xs = []; for (let x = B + 8 * r; x <= 286; x += 16 * r) { xs.push(x); s += Ln(x, 36, x, 94, INK, 1.8); }
    s += Hd(46, 62, 108) + Tx(54, 126, `λ₁ = ${l1} sm`) + Hd(xs[0], xs[1], 108) + Tx((xs[0] + xs[1]) / 2, 126, "λ₂ = ?");
    return Sv(300, 134, s, `Səs havadan suya keçir: havada qonşu sıxılmalar ${l1} sm aralıdır, suda dalğa uzunluğu λ₂ soruşulur`); }
  // 3. lightning at height H, observer at distance d from the point under it; the sound goes along the hypotenuse
  function figStorm(H, d, t, askD) { let s = Ln(10, 150, 290, 150, INK, 2.5);
    s += Pt("M20 62a14 14 0 0 1 8-26a18 18 0 0 1 34-4a15 15 0 0 1 22 12a12 12 0 0 1 0 18z", INK, 2, PAP) + Pt("M52 40L45 56L53 56L47 72", ACC, 2.5)
      + Dm(20, 72, 20, 150) + Tx(27, 114, askD ? `H = ${H} m` : "H = ?", "start", INK, 12)
      + Ar(54, 76, 243, 124, VEC, 2, DASH) + Tx(170, 82, `gurultu: t = ${t} s`, "middle", INK, 12)
      + Ci(250, 126, 6) + Ln(250, 132, 250, 146) + Ln(250, 146, 245, 150) + Ln(250, 146, 255, 150)
      + Dm(48, 168, 250, 168) + Tx(149, 187, askD ? "d = ?" : `d = ${d} m`);
    return Sv(300, 196, s, `Şimşək yerdən ${askD ? H + " m" : "H"} hündürlükdə çaxıb, müşahidəçi yerdə ${askD ? "d" : d + " m"} aralıdadır, gurultu ${t} s sonra eşidilir`); }
  // 4. echo sounder: the ship sends a signal; echoes come from a shoal of fish (t₁) and from the seabed (t₂)
  function figSonar(t1, t2) { const sy = 46, bot = 196, fy = sy + (bot - sy) * t1 / t2, x = 71;
    let s = WAT(10, sy, 280, bot - sy) + Ln(10, sy, 290, sy, VEC, 1.5) + hatchDn(10, 290, bot) + Pt("M38 30L104 30L94 46L48 46z", INK, 2, PAP) + Rc(58, 17, 22, 13)
      + Ar(x, 50, x, 191, ACC, 2)
      + `<ellipse cx="${x}" cy="${r1(fy)}" rx="14" ry="7" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + Pt(`M${x + 13} ${r1(fy)}L${x + 23} ${r1(fy - 7)}L${x + 23} ${r1(fy + 7)}z`, INK, 2, PAP) + Ci(x - 7, fy - 1.5, 1.4, INK, INK, 1)
      + Dm(36, fy + 9, 36, bot - 1) + Tx(30, (fy + bot) / 2 + 5, "?", "end")
      + Tx(108, fy - 2, "balıqdan əks-səda:", "start", MUT, 12) + Tx(108, fy + 14, `t₁ = ${F(t1)} s`, "start")
      + Tx(170, bot - 24, "dibdən əks-səda:", "start", MUT, 12) + Tx(170, bot - 7, `t₂ = ${F(t2)} s`, "start");
    return Sv(300, 208, s, `Gəmi dibə ultrasəs siqnalı göndərir; balıq dəstəsindən əks-səda ${F(t1)} s, dibdən ${F(t2)} s sonra qayıdır`); }
  // 5. a car and a cliff: the car at the moment of the signal (solid) and at the moment of the echo (dashed)
  function figCar(u, t, away) { const x1 = away ? 140 : 30, x2 = away ? 40 : 130, road = 95;
    const car = (x, dash) => Rc(x, 72, 34, 14, PAP, INK, 2, dash ? DASH : "") + Rc(x + 8, 64, 18, 8, PAP, INK, 2, dash ? DASH : "") + Ci(x + 8, 90, 4, PAP, INK, 2) + Ci(x + 26, 90, 4, PAP, INK, 2);
    let s = Ln(10, road, 252, road, INK, 2) + Rc(252, 40, 16, 56, PAP, INK, 2);
    for (let y = 48; y < 96; y += 10) s += Ln(252, y + 8, 268, y, MUT, 1.2);
    s += car(x1, false) + car(x2, true) + Ar(x1 + 17, 56, x2 + 17, 56, ACC, 2) + Tx((x1 + x2) / 2 + 17, 47, `u = ${u} m/s`)
      + Dm(away ? x2 + 36 : x2 + 38, 118, 250, 118) + Tx((away ? x2 + 36 + 250 : x2 + 38 + 250) / 2, 112, "d = ?")
      + Tx(x1 + 17, 138, "siqnal verilir", "middle", MUT, 12) + Tx(x2 + 17, 138, "əks-səda eşidilir", "middle", MUT, 12) + Tx(150, 154, `siqnaldan əks-sədaya qədər: t = ${t} s`, "middle", INK, 12);
    return Sv(300, 162, s, `Avtomobil ${u} m/s sürətlə uçurum divarına ${away ? "əks" : "doğru"} gedir; siqnaldan əks-sədaya ${t} s keçir`); }
  // 6. a long steel rail: a hammer blow at one end, the listener at the other end hears two sounds
  function figRail(dt) { let s = Rc(30, 50, 210, 12, SOFT) + Ar(36, 40, 244, 40, ACC, 2) + Tx(140, 32, "polad: 5100 m/s", "middle", INK, 12) + Dm(30, 76, 240, 76) + Tx(135, 94, "s = ?")
      + Ar(36, 108, 244, 108, VEC, 2) + Tx(140, 124, "hava: 340 m/s", "middle", INK, 12) + Tx(150, 144, `iki səsin gəlməsi arasında: Δt = ${F(dt)} s`, "middle", INK, 12)
      + Ln(6, 30, 20, 44, INK, 3) + `<rect x="14" y="30" width="16" height="9" fill="${PAP}" stroke="${INK}" stroke-width="2" transform="rotate(45 22 34)"/>`
      + Ci(272, 48, 7) + Ln(272, 55, 272, 78) + Ln(272, 62, 256, 58) + Ln(272, 78, 266, 92) + Ln(272, 78, 278, 92);
    return Sv(300, 152, s, `Polad relsin bir ucuna çəkiclə vurulur; o biri ucda iki səs eşidilir: relslə və hava ilə, aralarındakı fərq ${F(dt)} s`); }
  // 7. resonance tube: two water levels, both resonate with the same tuning fork
  function figTube(nu, L1, L2) { let s = ""; const top = 50, bot = 180;
    [[70, L1, "1-ci rezonans", "L₁"], [230, L2, "2-ci rezonans", "L₂"]].forEach(([x, L, cap, nm]) => { const yw = top + 100 * L / L2;
      s += WAT(x - 12, yw, 24, bot - yw) + Pt(`M${x - 12} ${top}V${bot}H${x + 12}V${top}`) + Pt(`M${x - 6} 22V34Q${x} 42 ${x + 6} 34V22`, INK, 2.2) + Ln(x, 38, x, 46) + Tx(x, 12, `ν = ${nu} Hz`, "middle", INK, 12)
        + Dm(x + 24, top, x + 24, yw) + Tx(x, 198, cap, "middle", MUT, 12) + Tx(x, 214, `${nm} = ${F(L)} sm`); });
    return Sv(300, 222, s, `İki eyni şaquli boru: kamerton ${nu} Hz; birinci rezonansda hava sütunu ${F(L1)} sm, ikincidə ${F(L2)} sm`); }
  // 8. spring oscillator drives a rope: the load moves the rope's left end up and down
  function figSpring(m, k, v) { let s = Ln(20, 12, 80, 12, INK, 3) + Pt("M50 12V20L41 24L59 32L41 40L59 48L41 56L50 60V66") + Rc(34, 66, 32, 26, SOFT) + wave(66, 282, 79, 12, 54, true, INK, 2)
      + Tx(66, 42, `k = ${F(k)} N/m`, "start") + Tx(50, 112, `m = ${F(m)} kq`) + Ar(150, 126, 230, 126, ACC, 2) + Tx(190, 144, `v = ${F(v)} m/s`);
    return Sv(300, 154, s, `Yaylı rəqqas (k = ${F(k)} N/m, m = ${F(m)} kq) ipin sol ucunu yelləyir; ipdə dalğanın sürəti ${F(v)} m/s`); }
  // 9. a pendulum clock ticks; a wall at distance s returns the echo
  function figPend(l) { let s = Ln(30, 14, 90, 14, INK, 3) + Ln(60, 14, 60, 104, INK, 2) + Ci(60, 112, 9, ACC, INK, 2) + Pt("M30 100Q60 128 90 100", MUT, 1.2, "none", DASH) + Tx(68, 62, `l = ${F(l)} sm`, "start")
      + Rc(262, 36, 12, 100, PAP, INK, 2) + Ar(104, 76, 252, 76, ACC, 2) + Tx(178, 68, "tıq") + Ar(252, 98, 104, 98, VEC, 2) + Tx(178, 116, "əks-səda") + Dm(60, 148, 268, 148) + Tx(164, 166, "s = ?");
    for (let y = 44; y < 136; y += 12) s += Ln(262, y + 8, 274, y, MUT, 1.2);
    return Sv(300, 174, s, `Rəqqasın uzunluğu ${F(l)} sm; saatdan s məsafədə divar var, «tıq» səsinin əks-sədası qayıdır`); }
  // 10. oscilloscope: n full oscillations across 10 divisions; one division = τ ms
  function figScope(n, tau) { let s = Rc(20, 24, 260, 120, PAP, INK, 2);
    for (let k = 1; k < 10; k++) s += Ln(20 + 26 * k, 24, 20 + 26 * k, 144, MUT, 0.6);
    for (let j = 1; j < 6; j++) s += Ln(20, 24 + 20 * j, 280, 24 + 20 * j, MUT, j === 3 ? 1.2 : 0.6);
    s += wave(20, 280, 84, 38, 260 / n, true) + Tx(150, 14, "mikrofonun siqnalı (ossiloqram)", "middle", MUT, 12) + Tx(150, 164, `1 bölgü = ${F(tau)} ms`);
    return Sv(300, 172, s, `Ossiloqram: ekranın 10 bölgüsündə ${n} tam rəqs; 1 bölgü = ${F(tau)} ms`); }

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. a wave profile with n crests: λ = D/(n − 1), v = λν
    { tip: "qapali", gen: () => again(() => {
      const n = pick([3, 4, 5]), lam = pick([2, 3, 4, 5, 6, 8]), nu = pick([2, 5, 10, 20, 25, 50]), D = lam * (n - 1), v = lam * nu;
      const w = [D / n * nu, D * nu, lam / nu, lam * nu / 2]; if (![v, ...w].every(x => ok(x))) return null;
      return mc(ae(v, w, U_("m/s")), { svg: figCrests(n, D), text: `Şəkildə ip boyunca yayılan eninə dalğanın bir andakı profili verilib: ${n} ardıcıl dalğa təpəsi var, birinci və axırıncı təpə arasındakı məsafə ${D} m-dir. Dalğanın tezliyi ${nu} Hz-dir. Dalğanın yayılma sürəti nə qədərdir?`,
        solution: `${n} təpə arasında ${n - 1} dalğa uzunluğu var: λ = ${D}/${n - 1} = ${lam} m. v = λν = ${lam}·${nu} = ${v} m/s. Tələlər: ${D} m-i ${n}-ə bölmək (λ = ${G(D / n)} m → ${G(D / n * nu)} m/s), bütün ${D} m-i dalğa uzunluğu saymaq (${G(D * nu)} m/s), v = λ/ν yazmaq (${G(lam / nu)} m/s), qonşu təpə ilə çökəklik arasını λ saymaq (λ/2 → ${G(lam * nu / 2)} m/s).` });
    }) },
    // 2. sound passes from air into water: ν does not change, λ₂/λ₁ = v₂/v₁
    { tip: "qapali", gen: () => again(() => {
      const r = pick([3, 4, 5]), v2 = 340 * r, l1 = pick([20, 25, 40, 50, 60, 80, 100]), lam2 = l1 * r / 100;
      const w = [l1 / 100, l1 / 100 / r, lam2 - l1 / 100, l1 * r]; if (![lam2, ...w].every(x => ok(x, 3))) return null;
      return mc(ae(lam2, w, U_("m")), { svg: figMedium(l1, r, v2), text: `Şəkildə havada yayılan səs dalğasının qonşu sıxılmaları arasındakı məsafə (${l1} sm) göstərilib. Səs suya keçir. Suda səsin sürəti ${v2} m/s, havada 340 m/s-dir. Səsin suda dalğa uzunluğu neçə metrdir?`,
        solution: `Mühit dəyişəndə tezlik sabit qalır, λ = v/ν dəyişir: λ₂/λ₁ = v₂/v₁ = ${v2}/340 = ${r}. λ₁ = ${l1} sm = ${G(l1 / 100)} m, λ₂ = ${r}·${G(l1 / 100)} = ${G(lam2)} m. Tələlər: dalğa uzunluğunun dəyişmədiyini düşünmək (${G(l1 / 100)} m), nisbəti tərs yazmaq (${G(l1 / 100 / r)} m), λ-nın özünü yox, artımını tapmaq (${G(lam2 - l1 / 100)} m), santimetri metrə çevirməmək (${l1 * r} m).` });
    }) },
    // 3. lightning at height H: the sound runs along the hypotenuse s = vt (Pythagoras)
    { tip: "qapali", minVariety: 20, gen: () => again(() => {
      const [a, b, c, k] = pick([[3, 4, 5, 68], [8, 15, 17, 20]]), t = rnd(1, 5), hyp = 340 * t, legs = [a * k * t, b * k * t].sort(() => Math.random() - 0.5), askD = Math.random() < 0.5;
      const [H, d] = legs; if (hyp !== c * k * t) return null;
      const ask = askD ? d : H, giv = askD ? H : d;
      const w = [hyp, hyp - giv, hyp / 2, giv]; if (![ask, ...w].every(x => ok(x))) return null;
      return mc(ae(ask, w, U_("m")), { svg: figStorm(H, d, t, askD), text: askD
        ? `Şimşək yerdən ${H} m hündürlükdə, buludda çaxdı (şəkil). Müşahidəçi şimşəyin yerə proyeksiyasından d məsafədə dayanır və işığı görəndən ${t} s sonra gurultunu eşidir. d nə qədərdir? (Səsin sürəti 340 m/s, işığın yayılma vaxtı nəzərə alınmır.)`
        : `Müşahidəçi şimşəyin yerə proyeksiyasından ${d} m məsafədə dayanır; işığı görəndən ${t} s sonra gurultunu eşidir (şəkil). Şimşək yerdən neçə metr hündürlükdə, buludda çaxıb? (Səsin sürəti 340 m/s, işığın yayılma vaxtı nəzərə alınmır.)`,
        solution: `Səsin yolu s = vt = 340·${t} = ${hyp} m. Səs şimşəkdən müşahidəçiyə düz xətt boyunca gəlir, bu, düzbucaqlı üçbucağın hipotenuzudur (katetlər: hündürlük H və məsafə d). ${askD ? "d" : "H"} = √(${hyp}² − ${giv}²) = √${hyp * hyp - giv * giv} = ${ask} m. Tələlər: səsin yolunu birbaşa cavab yazmaq (${hyp} m), çıxmaq (${hyp} − ${giv} = ${hyp - giv} m), yarıya bölmək (${G(hyp / 2)} m), verilən katetin özünü yazmaq (${giv} m).` });
    }) },
    // 4. echo sounder with two echoes: fish shoal and seabed (the signal goes there and back)
    { tip: "qapali", gen: () => again(() => {
      const t1 = pick([0.2, 0.4, 0.6, 0.8]), dt = pick([0.2, 0.4, 0.6, 0.8, 1.0, 1.2]), t2 = +(t1 + dt).toFixed(1), q = t1 / t2; if (q < 0.15 || q > 0.6) return null;
      const right = 750 * dt, w = [1500 * dt, 750 * t2, 750 * t1, 750 * (t1 + t2)]; if (![right, ...w].every(x => ok(x))) return null;
      return mc(ae(right, w, U_("m")), { svg: figSonar(t1, t2), text: `Gəmi dibə ultrasəs siqnalı göndərir. Siqnaldan ${F(t1)} s sonra balıq dəstəsindən, ${F(t2)} s sonra dibdən əks-səda qayıdır (şəkil). Balıq dəstəsi dibdən neçə metr yuxarıdadır? (Suda səsin sürəti 1500 m/s.)`,
        solution: `Hər əks-sədada səs gedib qayıdır, buna görə dərinlik vt/2-dir. Balığa qədər: 1500·${F(t1)}/2 = ${G(750 * t1)} m; dibə qədər: 1500·${F(t2)}/2 = ${G(750 * t2)} m. Fərq: ${G(750 * t2)} − ${G(750 * t1)} = ${G(right)} m (və ya 750·(${F(t2)} − ${F(t1)}) = 750·${F(dt)}). Tələlər: yarıya bölməyi unutmaq (${G(1500 * dt)} m), dibin dərinliyini yazmaq (${G(750 * t2)} m), balığın dərinliyini yazmaq (${G(750 * t1)} m), vaxtları toplamaq (${G(750 * (t1 + t2))} m).` });
    }) },
    // 5. a moving car and a cliff: sound path + car path (toward or away)
    { tip: "qapali", gen: () => again(() => {
      const u = pick([10, 15, 20, 25, 30]), t = pick([2, 4, 6, 8, 10]), away = Math.random() < 0.4, ut = u * t;
      const L = away ? (340 * t - ut) / 2 : (340 * t + ut) / 2, end = away ? L + ut : L - ut;
      const w = away ? [L, 170 * t, L - ut, 340 * t - ut] : [L, 170 * t, L + ut, 340 * t - ut];
      if (away) w[3] = 340 * t + ut; if (!away) w[3] = (340 - u) * t; if (![end, ...w].every(x => ok(x, 1))) return null;
      return mc(ae(end, w, U_("m")), { svg: figCar(u, t, away), text: `Avtomobil sabit ${u} m/s sürətlə uçurumun şaquli divarına ${away ? "əks istiqamətdə, divardan uzaqlaşaraq" : "doğru"} gedir. Sürücü siqnal verir və ${t} s sonra əks-sədanı eşidir (şəkil). Əks-səda eşidilən anda avtomobil divardan nə qədər uzaqdadır? (Səsin sürəti 340 m/s, külək yoxdur.)`,
        solution: `Siqnal anında divara qədər məsafə L olsun. ${t} s-də səsin yolu 340·${t} = ${340 * t} m, avtomobilin yolu ${u}·${t} = ${ut} m. ${away ? `Avtomobil uzaqlaşır: səs divara L, geri L + ${ut} gedir: 2L + ${ut} = ${340 * t}, L = ${G(L)} m. Əks-səda eşidilən anda məsafə L + ${ut} = ${G(end)} m.` : `Avtomobil yaxınlaşır: səs divara L, geri L − ${ut} gedir: 2L − ${ut} = ${340 * t}, L = ${G(L)} m. Əks-səda eşidilən anda məsafə L − ${ut} = ${G(end)} m.`} Tələlər: siqnal anındakı məsafəni yazmaq (${G(L)} m), avtomobilin hərəkətini unudub vt/2 götürmək (${G(170 * t)} m), ${away ? "avtomobilin yolunu səhv işarə ilə əlavə etmək" : "avtomobilin yolunu iki dəfə əlavə etmək"} (${G(w[2])} m), səsin yolunu avtomobilin yolu ilə birlikdə yarıya bölməməyin nəticəsi (${G(w[3])} m).` });
    }) },
    // 6. a steel rail: two arrivals of the same blow, s/340 − s/5100 = Δt
    { tip: "qapali", minVariety: 20, gen: () => again(() => {
      const k = pick([1, 2, 3, 4, 5, 6, 8, 10]), dt = +(0.14 * k).toFixed(2), s = 51 * k;
      const w = [340 * dt, 5100 * dt, 4760 * dt, 2720 * dt]; if (![s, ...w].every(x => ok(x, 1))) return null;
      return mc(ae(s, w, U_("m")), { svg: figRail(dt), text: `Uzun polad relsin bir ucuna çəkiclə vurdular. O biri ucda dayanan adam iki səs eşidir: biri relslə, digəri hava ilə gəlir; iki səsin eşidilmə anları arasındakı zaman fərqi ${F(dt)} s-dir (şəkil). Relsdə səsin sürəti 5100 m/s, havada 340 m/s-dir. Relsin uzunluğu nə qədərdir?`,
        solution: `Relsin uzunluğu s olsun. Havada səs s/340, relsdə s/5100 vaxtda gəlir; hava ilə gələn səs gecikir: s/340 − s/5100 = ${F(dt)}. 5100/340 = 15 olduğundan s·(15 − 1)/5100 = ${F(dt)}, s = 5100·${F(dt)}/14 = ${s} m. Tələlər: s = vΔt-ni yalnız havanın sürəti ilə yazmaq (${G(340 * dt)} m), yalnız poladın sürəti ilə yazmaq (${G(5100 * dt)} m), sürətlərin fərqini götürmək (${G(4760 * dt)} m), sürətlərin ortasını götürmək (${G(2720 * dt)} m).` });
    }) },
    // 7. resonance tube: two neighbouring resonances are λ/2 apart (the end correction drops out)
    { tip: "qapali", minVariety: 20, gen: () => again(() => {
      const [nu, v] = pick([[500, 340], [400, 320], [800, 320], [1000, 340], [500, 330], [250, 340], [680, 340], [1000, 320], [500, 320]]), lam = v / nu, e = pick([0.5, 1, 1.5, 2]) / 100;
      const L1 = lam / 4 - e, L2 = 3 * lam / 4 - e, d = L2 - L1; if (!nice(L1 * 100, 1) || !nice(L2 * 100, 1) || L1 <= 0.05 || L1 / L2 < 0.2) return null;
      const w = [nu * d, 4 * nu * L1, 4 * nu * d, nu * L2]; if (![v, ...w].every(x => ok(x, 1))) return null;
      return mc(ae(v, w, U_("m/s")), { svg: figTube(nu, L1 * 100, L2 * 100), text: `Rezonans borusu təcrübəsində ${nu} Hz tezlikli kamerton şaquli borunun üstündə səslənir (şəkil). Boruda suyun səviyyəsini aşağı endirdikdə birinci rezonans hava sütununun uzunluğu L₁ = ${F(+(L1 * 100).toFixed(1))} sm olanda, ikinci rezonans L₂ = ${F(+(L2 * 100).toFixed(1))} sm olanda eşidilir (L — borunun üst ucundan su səthinə qədər; qarın borunun ağzından bir az kənarda yerləşir, ona görə L₁ dəqiq λ/4 deyil). Havada səsin sürəti nə qədərdir?`,
        solution: `Qonşu iki rezonans arasında hava sütunu λ/2 qədər uzanır: λ/2 = L₂ − L₁ = ${G(L2 * 100)} − ${G(L1 * 100)} = ${G(d * 100)} sm, λ = ${G(2 * d * 100)} sm = ${G(2 * d)} m. v = λν = ${G(2 * d)}·${nu} = ${v} m/s. Bu üsulda borunun ağzındakı düzəliş çıxılır. Tələlər: λ/2-ni λ götürmək (${G(nu * d)} m/s), 4νL₁ yazmaq, yəni düzəlişi nəzərə almamaq (${G(4 * nu * L1)} m/s), λ/2 əvəzinə λ/4 götürmək (${G(4 * nu * d)} m/s), L₂-ni dalğa uzunluğu saymaq (${G(nu * L2)} m/s).` });
    }) },
    // 8. (with "Rəqslər") a spring oscillator makes a rope wave: T = 2π√(m/k), λ = vT
    { tip: "qapali", birlesik: "fiz-reqsler", minVariety: 20, gen: () => again(() => {
      const m = pick([0.1, 0.2, 0.4, 0.5, 0.9, 1, 2, 2.5]), k = pick([1, 2, 4, 5, 10, 20, 25, 40, 100]), T = 2 * Math.sqrt(10 * m / k), v = pick([2, 3, 4, 5, 6, 8, 10, 12]);
      if (!nice(T, 1) || T < 0.4 || T > 6) return null; const lam = v * T;
      const w = [v / T, v * T / 2, 2 * v * T, T / v]; if (![lam, ...w].every(x => ok(x))) return null;
      return mc(ae(lam, w, U_("m")), { svg: figSpring(m, k, v), text: `Sərtliyi ${F(k)} N/m olan yaydan asılmış kütləsi ${F(m)} kq yük ipin sol ucuna bərkidilib və şaquli istiqamətdə rəqs edərək ipdə eninə dalğa yaradır (şəkil). Dalğanın ip boyunca yayılma sürəti ${v} m/s-dir. Dalğanın uzunluğu nə qədərdir? (π² ≈ 10; yayın kütləsi, ipin yükə təsiri və rəqslərin sönməsi nəzərə alınmır.)`,
        solution: `Dalğa mənbənin tezliyi ilə yaranır: mənbə yaylı rəqqasdır. T = 2π√(m/k) = 2√(10m/k) = 2√(10·${F(m)}/${F(k)}) = 2√${G(10 * m / k)} = ${G(T)} s. Dalğa uzunluğu λ = vT = ${v}·${G(T)} = ${G(lam)} m. Tələlər: v-ni T-yə bölmək, yəni ν ilə qarışdırmaq (${G(v / T)} m), T-ni yarım götürmək (${G(v * T / 2)} m), iki period götürmək (${G(2 * v * T)} m), düsturu tərs yazmaq λ = T/v (${G(T / v)} m).` });
    }) },
    // 9. (with "Rəqslər") a pendulum clock and an echo: T = 2π√(l/g), the echo comes back after one period: s = vT/2
    { tip: "qapali", birlesik: "fiz-reqsler", minVariety: 20, gen: () => again(() => {
      const l = pick([25, 36, 49, 64, 81, 100, 144, 225]), T = 2 * Math.sqrt(l / 100), s = 170 * T;
      if (!nice(T, 1)) return null; const w = [340 * T, 85 * T, 680 * T, 1700 * T]; if (![s, ...w].every(x => ok(x, 1))) return null;
      return mc(ae(s, w, U_("m")), { svg: figPend(l), text: `Rəqqaslı saat hər periodda bir dəfə «tıq» səsi verir. Saatın rəqqası uzunluğu ${l} sm olan riyazi rəqqas kimi rəqs edir (kiçik bucaqlı rəqslər; şəkil; π² ≈ 10, g = 10 m/s²). Saatdan s məsafədə şaquli divar var; saatın yanında dayanan adam hər «tıq»ın əks-sədasını elə növbəti «tıq» ilə eyni anda eşidir. s nə qədərdir? (Səsin sürəti 340 m/s.)`,
        solution: `l = ${l} sm = ${G(l / 100)} m. T = 2π√(l/g) = 2√l = 2√${G(l / 100)} = ${G(T)} s (π² ≈ 10, g = 10). Əks-səda növbəti «tıq»la, yəni T vaxtından sonra qayıdır; bu vaxtda səs divara gedib qayıdır: 2s = vT = 340·${G(T)} = ${G(340 * T)} m, s = ${G(s)} m. Tələlər: yarıya bölməyi unutmaq (${G(340 * T)} m), «tıq»ı yarım periodda bir dəfə saymaq (${G(85 * T)} m), yolu 2-yə vurmaq (${G(680 * T)} m), l-i santimetrlə qoyub T = 2√${l} = ${G(10 * T)} s tapmaq (${G(1700 * T)} m).` });
    }) },
    // 10. oscilloscope: T from the screen, λ = vT
    { tip: "qapali", gen: () => again(() => {
      const tau = pick([0.5, 1, 2]), n = pick([2, 4, 5, 10]), T = 10 * tau / n / 1000, lam = 340 * T;
      const w = [0.34 * tau, 3.4 * tau, 3.4 * tau * n, 3400 * tau / n]; if (![lam, ...w].every(x => ok(x, 3))) return null;
      return mc(ae(lam, w, U_("m")), { svg: figScope(n, tau), text: `Mikrofon səs siqnalını ossiloqrafın ekranına ötürür (şəkil). Üfüqi miqyas: 1 bölgü = ${F(tau)} ms; ekranın 10 bölgüsündə ${n} tam rəqs yerləşir. Səsin havada dalğa uzunluğu nə qədərdir? (Səsin sürəti 340 m/s.)`,
        solution: `Ekranın eni 10·${F(tau)} = ${G(10 * tau)} ms, burada ${n} tam rəqs var: T = ${G(10 * tau)}/${n} = ${G(10 * tau / n)} ms = ${G(T)} s. λ = vT = 340·${G(T)} = ${G(lam)} m. Tələlər: periodu bir bölgü götürmək (${G(0.34 * tau)} m), rəqslərin sayını nəzərə almamaq (${G(3.4 * tau)} m), ekrandakı ümumi vaxtı n-ə bölmək əvəzinə n-ə vurmaq (${G(3.4 * tau * n)} m), ms-i s-ə çevirməmək (${G(3400 * tau / n)} m).` });
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
      key: "fiz-dalgalar", title: "Dalğalar və səs", fenn: "fizika", link: "dersler/fiz-dalgalar.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: m, s, Hz, m/s). Onluq kəsr vergül və ya nöqtə ilə: 0,5. Havada səsin sürəti 340 m/s.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["dalga", "dalga", "muhit", "ses", "ses", "eks", "eks", "rezonans", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-dalgalar.html")) b.push("dersler/fiz-dalgalar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
