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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-dalgalar", title: "Dalğalar və səs", fenn: "fizika", link: "dersler/fiz-dalgalar.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: m, s, Hz, m/s). Onluq kəsr vergül və ya nöqtə ilə: 0,5. Havada səsin sürəti 340 m/s.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["dalga", "dalga", "muhit", "ses", "ses", "eks", "eks", "rezonans", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-dalgalar.html")) b.push("dersler/fiz-dalgalar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
