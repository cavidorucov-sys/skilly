// Fizika · Huk qanunu — mastery game levels (F = kx, two lengths, spring systems, spring + load, energy kx²/2) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s².
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");          // 0.04 → "0,04", −2 → "−2"
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;        // v has at most d decimals
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const g = 10;
  const KS = [20, 25, 40, 50, 80, 100, 120, 150, 200, 250, 300, 400, 500, 600, 800, 1000];

  // spring pairs whose series stiffness k₁k₂/(k₁ + k₂) is a whole number
  const PAIRS = [];
  for (let a = 20; a <= 600; a += 10) for (let b = a; b <= 900; b += 10) if ((a * b) % (a + b) === 0) PAIRS.push([a, b, a * b / (a + b)]);

  const LIFT = [
    { d: "yuxarı qalxmağa başlayır (sürəti artır)", s: 1, w: "sürət yuxarı və artır → təcil yuxarıdır" },
    { d: "yuxarı qalxır və dayanmaq üçün yavaşıyır", s: -1, w: "sürət yuxarı, amma azalır → təcil aşağıdır" },
    { d: "aşağı enməyə başlayır (sürəti artır)", s: -1, w: "sürət aşağı və artır → təcil aşağıdır" },
    { d: "aşağı enir və dayanmaq üçün yavaşıyır", s: 1, w: "sürət aşağı, amma azalır → təcil yuxarıdır" },
  ];

  const levels = [
    { id: "huk", ad: "F = kx", izah: "Huk qanunu: F = k·x. Santimetri metrə, qramı kiloqrama çevirməyi unutma.",
      gen() {
        const kind = pick(["k", "F", "x", "q", "mut"]);
        if (kind === "k") {
          const k = pick(KS), xs = rnd(1, 12), Fv = k * xs / 100;
          return R(k, "N/m", { text: `Yayı ${F(Fv)} N qüvvə ilə dartanda o, ${xs} sm uzanır. Yayın sərtliyi k nə qədərdir?`,
            solution: `x = ${xs} sm = ${F(xs / 100)} m. k = F/x = ${F(Fv)}/${F(xs / 100)} = ${k} N/m.` });
        }
        if (kind === "F") {
          const k = pick(KS), xs = rnd(1, 15), Fv = k * xs / 100;
          return R(Fv, "N", { text: `Sərtliyi ${k} N/m olan yayı ${xs} sm dartıblar. Yayın elastiklik qüvvəsinin modulu nə qədərdir?`,
            solution: `x = ${xs} sm = ${F(xs / 100)} m. F = k·x = ${k}·${F(xs / 100)} = ${F(Fv)} N.` });
        }
        if (kind === "x") {
          const k = pick(KS), xs = rnd(1, 12), Fv = k * xs / 100;
          return R(xs / 100, "m", { text: `Sərtliyi ${k} N/m olan yaya ${F(Fv)} N qüvvə ilə təsir edirlər. Yay nə qədər uzanar? Cavabı metrlə yaz.`,
            solution: `x = F/k = ${F(Fv)}/${k} = ${F(xs / 100)} m (${xs} sm).` });
        }
        if (kind === "q") {
          let mg, xs, k; do { mg = pick([50, 100, 150, 200, 250, 300, 400, 500, 600]); xs = rnd(1, 10); k = mg / xs; } while (!nice(k, 1));
          return R(k, "N/m", { text: `Yaydan ${mg} q kütləli yük asanda yay ${xs} sm uzanır. Yayın sərtliyi nə qədərdir?`,
            solution: `Tarazlıqda kx = mg. m = ${mg} q = ${F(mg / 1000)} kq → mg = ${F(mg / 100)} N; x = ${F(xs / 100)} m. k = ${F(mg / 100)}/${F(xs / 100)} = ${F(k)} N/m.` });
        }
        // proportional: the same spring, another load
        let m1, m2, x1, x2; do { m1 = pick([0.2, 0.5, 1, 2, 3, 4, 5]); m2 = pick([0.3, 0.5, 1, 1.5, 2, 3, 6, 8]); x1 = rnd(1, 8); x2 = x1 * m2 / m1; } while (m1 === m2 || !nice(x2, 1) || x2 > 30);
        return R(x2 / 100, "m", { text: `${F(m1)} kq yük yayı ${x1} sm uzadır. Eyni yaydan ${F(m2)} kq yük assaq, yay nə qədər uzanar? Cavabı metrlə yaz.`,
          solution: `Uzanma qüvvəyə (yəni kütləyə) düz mütənasibdir: x₂ = x₁·m₂/m₁ = ${x1}·${F(m2)}/${F(m1)} = ${F(x2)} sm = ${F(x2 / 100)} m.` });
      } },
    { id: "uzunluq", ad: "İki uzunluq → l₀ və k", izah: "Bilinən: iki qüvvə və yayın iki uzunluğu. Deformasiya x = l − l₀ (dartılma) və ya l₀ − l (sıxılma). Tənlikləri çıx.",
      gen() {
        const l0 = rnd(8, 30), k = pick([50, 100, 200, 250, 400, 500]);
        const comp = Math.random() < .35;
        let x1 = rnd(1, 10), x2 = rnd(1, 10); while (x2 === x1 || (comp && x2 > l0 - 3)) x2 = rnd(1, 10);
        const F1 = k * x1 / 100, F2 = k * x2 / 100, l1 = l0 + x1, l2 = comp ? l0 - x2 : l0 + x2;
        const askL = Math.random() < .5;
        const text = `Yayı ${F(F1)} N qüvvə ilə dartanda uzunluğu ${l1} sm, ${F(F2)} N qüvvə ilə ${comp ? "sıxanda" : "dartanda"} ${l2} sm olur. ` +
          (askL ? "Yayın deformasiyasız uzunluğu l₀ neçə metrdir?" : "Yayın sərtliyi k nə qədərdir?");
        const kStep = comp
          ? `Dartanda: ${l1} − l₀ = F₁/k, sıxanda: l₀ − ${l2} = F₂/k. Toplasaq: ${l1 - l2} sm = (${F(F1)} + ${F(F2)})/k → k = ${F(F1 + F2)}/${F((l1 - l2) / 100)} = ${k} N/m.`
          : `${l1} − l₀ = F₁/k, ${l2} − l₀ = F₂/k. Çıxsaq: ${Math.abs(l2 - l1)} sm = ${F(Math.abs(F2 - F1))}/k → k = ${F(Math.abs(F2 - F1))}/${F(Math.abs(l2 - l1) / 100)} = ${k} N/m.`;
        const lStep = ` x₁ = F₁/k = ${F(F1)}/${k} = ${F(x1 / 100)} m = ${x1} sm → l₀ = ${l1} − ${x1} = ${l0} sm = ${F(l0 / 100)} m.`;
        return askL ? R(l0 / 100, "m", { text, solution: kStep + lStep }) : R(k, "N/m", { text, solution: kStep });
      } },
    { id: "birlesme", ad: "Ardıcıl və paralel", izah: "Paralel: k = k₁ + k₂. Ardıcıl: 1/k = 1/k₁ + 1/k₂. Yayı n bərabər hissəyə kəssən, hər hissənin sərtliyi n·k olur.",
      gen() {
        const kind = pick(["ard", "ard", "par", "kes", "kespar", "qarisiq", "yuk"]);
        if (kind === "ard") {
          const [a, b, s] = pick(PAIRS);
          return R(s, "N/m", { text: `Sərtlikləri ${a} N/m və ${b} N/m olan iki yay ardıcıl birləşdirilib. Sistemin sərtliyi nə qədərdir?`,
            solution: a === b ? `Eyni iki yay ardıcıl: k = ${a}/2 = ${s} N/m.` : `Ardıcıl: k = k₁k₂/(k₁ + k₂) = ${a}·${b}/${a + b} = ${a * b}/${a + b} = ${s} N/m. Cavab hər iki yaydan kiçikdir — düzdür.` });
        }
        if (kind === "par") {
          const a = pick(KS), b = pick(KS);
          return R(a + b, "N/m", { text: `Sərtlikləri ${a} N/m və ${b} N/m olan iki yay paralel birləşdirilib (yük ikisindən birlikdən asılıb). Sistemin sərtliyi nə qədərdir?`,
            solution: `Paralel birləşmədə uzanma eynidir, qüvvələr toplanır: k = k₁ + k₂ = ${a} + ${b} = ${a + b} N/m.` });
        }
        if (kind === "kes") {
          const k = pick(KS), n = rnd(2, 5);
          return R(n * k, "N/m", { text: `Sərtliyi ${k} N/m olan yayı ${n} bərabər hissəyə kəsdilər. Bir hissənin sərtliyi nə qədərdir?`,
            solution: `Qısa yay eyni qüvvədən ${n} dəfə az uzanır, deməli ${n} dəfə sərtdir: ${n}·${k} = ${n * k} N/m.` });
        }
        if (kind === "kespar") {
          const k = pick([20, 25, 40, 50, 100, 120, 150, 200]), n = rnd(2, 4);
          return R(n * n * k, "N/m", { text: `Sərtliyi ${k} N/m olan yayı ${n} bərabər hissəyə kəsib hissələri paralel birləşdirdilər. Alınan sistemin sərtliyi nə qədərdir?`,
            solution: `Hər hissə: ${n}·${k} = ${n * k} N/m. ${n} hissə paralel: ${n}·${n * k} = ${n * n * k} N/m (${n}² dəfə artdı).` });
        }
        if (kind === "qarisiq") {
          let a, b, s, k1; do { [a, b, s] = pick(PAIRS); k1 = 10 * rnd(1, a / 10 - 1); } while (a < 30);
          const k2 = a - k1;
          return R(s, "N/m", { text: `Sərtlikləri ${k1} N/m və ${k2} N/m olan iki yay paralel birləşdirilib, sonra bu cütə ardıcıl olaraq sərtliyi ${b} N/m olan üçüncü yay qoşulub. Sistemin sərtliyi nə qədərdir?`,
            solution: `Paralel cüt: ${k1} + ${k2} = ${a} N/m. Bunu ${b} N/m ilə ardıcıl: ${a}·${b}/(${a} + ${b}) = ${s} N/m.` });
        }
        let a, b, s, m, x; do { [a, b, s] = pick(PAIRS); m = pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]); x = m * g / s; } while (!nice(x, 4) || x > 0.5);
        return R(x, "m", { text: `Sərtlikləri ${a} N/m və ${b} N/m olan iki yay ardıcıl birləşdirilib, aşağı ucdan ${F(m)} kq yük asılıb. Sistem nə qədər uzanar? Cavabı metrlə yaz.`,
          solution: `Ardıcıl: k = ${a}·${b}/${a + b} = ${s} N/m. x = mg/k = ${F(m * g)}/${s} = ${F(x)} m.` });
      } },
    { id: "yuk", ad: "Yay və yük", izah: "Yükə təsir edən qüvvələri yaz: kx, mg, sürtünmə. Təcil varsa, F_əv = m·a. Cavab — uzanma, metrlə.",
      gen() {
        const kind = pick(["tar", "lift", "lift", "ufuqi", "surt", "iki"]);
        const K = [50, 80, 100, 125, 200, 250, 400, 500, 800, 1000];
        let x, k, m, text, solution;
        for (;;) {
          k = pick(K); m = pick([0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.5, 2, 2.5, 3, 4, 5]);
          if (kind === "tar") {
            x = m * g / k;
            text = `Sərtliyi ${k} N/m olan yaydan ${F(m)} kq kütləli yük asılıb. Tarazlıqda yay nə qədər uzanıb?`;
            solution = `Tarazlıq: kx = mg → x = ${F(m)}·10/${k} = ${F(x)} m.`;
          } else if (kind === "lift") {
            const a = pick([1, 2, 2.5, 4, 5]), L = pick(LIFT); x = m * (g + L.s * a) / k;
            text = `Liftin tavanından sərtliyi ${k} N/m olan yayla ${F(m)} kq yük asılıb. Lift ${L.d}, təcilinin modulu ${F(a)} m/s². Yay nə qədər uzanıb?`;
            solution = `${L.w[0].toUpperCase() + L.w.slice(1)}. ${L.s > 0 ? "kx − mg = ma → x = m(g + a)/k" : "mg − kx = ma → x = m(g − a)/k"} = ${F(m)}·${F(g + L.s * a)}/${k} = ${F(x)} m.`;
          } else if (kind === "ufuqi") {
            const a = pick([0.5, 1, 2, 2.5, 3, 4, 5, 6]); x = m * a / k;
            text = `Hamar (sürtünməsiz) masada ${F(m)} kq kütləli taxta bloku sərtliyi ${k} N/m olan yayla dartırlar. Blok ${F(a)} m/s² təcillə hərəkət edir. Yay nə qədər uzanıb?`;
            solution = `Üfüqi istiqamətdə bloka yalnız yay təsir edir: kx = ma → x = ${F(m)}·${F(a)}/${k} = ${F(x)} m.`;
          } else if (kind === "surt") {
            const mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]); x = mu * m * g / k;
            text = `${F(m)} kq kütləli bloku masa üzərində sərtliyi ${k} N/m olan yayla bərabər sürətlə dartırlar. Sürtünmə əmsalı ${F(mu)}. Yay nə qədər uzanıb?`;
            solution = `Bərabər sürət → qüvvələr tarazdır: kx = μmg = ${F(mu)}·${F(m)}·10 = ${F(mu * m * g)} N → x = ${F(mu * m * g)}/${k} = ${F(x)} m.`;
          } else {
            const m2 = pick([0.5, 1, 1.5, 2, 3, 4]), Fv = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]), a = Fv / (m + m2), T = m * a; x = T / k;
            if (!nice(a, 2)) continue;
            text = `Hamar masada ${F(m)} kq və ${F(m2)} kq kütləli iki blok sərtliyi ${k} N/m olan yayla birləşdirilib (yayın uzanması sabitləşib, hər iki blok eyni təcillə gedir). ${F(m2)} kq-lıq bloku ${F(Fv)} N qüvvə ilə dartırlar, ${F(m)} kq-lıq blok arxadan gəlir. Yay nə qədər uzanıb?`;
            solution = `Hər iki blok eyni təcillə gedir: a = F/(m₁ + m₂) = ${F(Fv)}/${F(m + m2)} = ${F(+a.toFixed(4))} m/s². Arxadakı bloku yalnız yay dartır: kx = m·a = ${F(+T.toFixed(4))} N → x = ${F(x)} m.`;
          }
          if (nice(x, 4) && x > 0 && x <= 0.5) break;
        }
        return R(x, "m", { text, solution });
      } },
    { id: "enerji", ad: "Enerji kx²/2", izah: "Dartılmış yayın enerjisi E = kx²/2 (F–x qrafikinin altındakı üçbucağın sahəsi). Yaydan atılan kürə: kx²/2 = mv²/2.",
      gen() {
        const kind = pick(["E", "E", "x", "k", "is", "v"]);
        if (kind === "E") {
          let k, xs, E; do { k = pick(KS); xs = rnd(1, 20); E = k * (xs / 100) ** 2 / 2; } while (!nice(E, 4));
          return R(E, "J", { text: `Sərtliyi ${k} N/m olan yay ${xs} sm dartılıb. Yayın elastiklik enerjisi nə qədərdir?`,
            solution: `x = ${F(xs / 100)} m. E = kx²/2 = ${k}·${F((xs / 100) ** 2)}/2 = ${F(E)} J.` });
        }
        if (kind === "x") {
          let k, xs, E; do { k = pick(KS); xs = rnd(1, 20); E = k * (xs / 100) ** 2 / 2; } while (!nice(E, 4));
          return R(xs / 100, "m", { text: `Sərtliyi ${k} N/m olan yayın enerjisi ${F(E)} J-dur. Yay nə qədər deformasiya olunub? Cavabı metrlə yaz.`,
            solution: `x² = 2E/k = ${F(2 * E)}/${k} = ${F((xs / 100) ** 2)} → x = ${F(xs / 100)} m.` });
        }
        if (kind === "k") {
          let k, xs, E; do { k = pick(KS); xs = rnd(1, 20); E = k * (xs / 100) ** 2 / 2; } while (!nice(E, 4));
          return R(k, "N/m", { text: `Yayı ${xs} sm sıxanda onda ${F(E)} J enerji toplanır. Yayın sərtliyi nə qədərdir?`,
            solution: `k = 2E/x² = ${F(2 * E)}/${F((xs / 100) ** 2)} = ${k} N/m.` });
        }
        if (kind === "is") {
          let k, a, b, A; do { k = pick(KS); a = rnd(1, 10); b = rnd(a + 1, 20); A = k * ((b / 100) ** 2 - (a / 100) ** 2) / 2; } while (!nice(A, 4));
          return R(A, "J", { text: `Sərtliyi ${k} N/m olan yay ${a} sm dartılıb. Onu ${b} sm-ə qədər dartmaq üçün nə qədər iş görmək lazımdır?`,
            solution: `İş = enerjinin artımı: A = k(x₂² − x₁²)/2 = ${k}·(${F((b / 100) ** 2)} − ${F((a / 100) ** 2)})/2 = ${F(A)} J. Diqqət: k(x₂ − x₁)²/2 yazmaq səhvdir.` });
        }
        let m, r, k, xs, v; do { r = pick([100, 400, 900, 1600, 2500, 3600, 10000]); m = pick([0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.25, 0.5]); k = r * m; xs = rnd(1, 10); v = xs / 100 * Math.sqrt(r); } while (!Number.isInteger(k) || k < 10 || !nice(v, 2));
        return R(v, "m/s", { text: `Oyuncaq tapançanın yayının sərtliyi ${k} N/m-dir. Yayı ${xs} sm sıxıb ${m * 1000} q kütləli kürəciyi atırlar. Kürəcik hansı sürətlə çıxar? Sürtünmə yoxdur.`,
          solution: `Yayın enerjisi kürəciyin hərəkət enerjisinə keçir: kx²/2 = mv²/2 → v = x·√(k/m) = ${F(xs / 100)}·√(${k}/${F(m)}) = ${F(xs / 100)}·${Math.sqrt(r)} = ${F(v)} m/s.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let k, m, a, x; do { k = pick([100, 200, 250, 400, 500]); m = pick([0.5, 1, 2, 2.5, 4, 5]); a = pick([1, 2, 4, 5]); x = m * (g + a) / k; } while (!nice(x * 100, 2));
          task = `Liftin tavanından sərtliyi ${k} N/m olan yayla ${F(m)} kq yük asılıb. Lift ${F(a)} m/s² təcillə yuxarı sürətlənir. Yay neçə sm uzanıb?`;
          const xw0 = m * g / k;
          steps = [
            `Yükə yuxarı kx, aşağı mg təsir edir, təcil yuxarıdır: kx − mg = ma.`,
            `x = m(g + a)/k = ${F(m)}·${g + a}/${k} = ${F(x)} m.`,
            `Santimetrlə: x = ${F(x * 100)} sm.`,
          ];
          if (bad === 0) steps = [`Yük liftə görə tərpənmir, deməli tarazlıqdadır: kx = mg.`, `x = mg/k = ${F(m * g)}/${k} = ${F(xw0)} m.`, `Santimetrlə: x = ${F(xw0 * 100)} sm.`];
          if (bad === 1) { const xw = m * (g - a) / k; steps[1] = `x = m(g − a)/k = ${F(m)}·${g - a}/${k} = ${F(xw)} m.`; steps[2] = `Santimetrlə: x = ${F(xw * 100)} sm.`; }
          if (bad === 2) steps[2] = `Santimetrlə: x = ${F(x * 10)} sm.`;
          why = [`1-ci addım: yük liftlə birlikdə sürətlənir, tarazlıqda deyil. Düzü: kx − mg = ma, x = ${F(x * 100)} sm.`,
            `2-ci addım: kx − mg = ma-dan x = m(g + a)/k alınır, mənfi yox. Düz cavab: ${F(x * 100)} sm.`,
            `3-cü addım: 1 m = 100 sm, 10 yox. ${F(x)} m = ${F(x * 100)} sm.`][bad];
        } else {
          let a, b, s, mq, x; do { [a, b, s] = pick(PAIRS); mq = pick([100, 200, 300, 400, 500, 600, 800]); x = mq / 100 / s; } while (a === b || !nice(x, 4) || x > 0.5);
          task = `Sərtlikləri ${a} N/m və ${b} N/m olan iki yay ardıcıl birləşdirilib, ucundan ${mq} q yük asılıb. Sistem neçə metr uzanar?`;
          const Fv = mq / 100;
          steps = [
            `Ardıcıl birləşmə: k = k₁k₂/(k₁ + k₂) = ${a * b}/${a + b} = ${s} N/m.`,
            `Yükün ağırlığı: F = mg = ${F(mq / 1000)}·10 = ${F(Fv)} N.`,
            `x = F/k = ${F(Fv)}/${s} = ${F(x)} m.`,
          ];
          if (bad === 0) { steps[0] = `Ardıcıl birləşmə: k = k₁ + k₂ = ${a} + ${b} = ${a + b} N/m.`; steps[2] = `x = F/k = ${F(Fv)}/${a + b} = ${F(+(Fv / (a + b)).toFixed(5))} m.`; }
          if (bad === 1) { steps[1] = `Yükün ağırlığı: F = mg = ${mq}·10 = ${mq * 10} N.`; steps[2] = `x = F/k = ${mq * 10}/${s} = ${F(+(mq * 10 / s).toFixed(4))} m.`; }
          if (bad === 2) steps[2] = `x = F·k = ${F(Fv)}·${s} = ${F(Fv * s)} m.`;
          why = [`1-ci addım: k₁ + k₂ paralel birləşmənin düsturudur. Ardıcılda k = ${s} N/m, x = ${F(x)} m.`,
            `2-ci addım: ${mq} q = ${F(mq / 1000)} kq, ona görə mg = ${F(Fv)} N. Düz cavab: ${F(x)} m.`,
            `3-cü addım: F = kx-dən x = F/k. Düz cavab: ${F(x)} m.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Avtomobilin amortizatoru, espander, bezmen — hamısı Huk qanunudur.",
      gen() {
        const kind = pick(["avto", "espander", "bezmen", "trambolin"]);
        if (kind === "avto") {
          let M, k, x; do { M = pick([800, 1000, 1200, 1500, 1600, 2000]); k = pick([20000, 25000, 40000, 50000]); x = M * g / (4 * k); } while (!nice(x, 4));
          return R(x, "m", { text: `${M} kq kütləli avtomobil dörd eyni yay (amortizator) üzərində durur, hər yayın sərtliyi ${k} N/m. Yaylar nə qədər sıxılıb? Cavabı metrlə yaz.`,
            solution: `Dörd yay paralel işləyir: k = 4·${k} = ${4 * k} N/m. x = Mg/k = ${M * g}/${4 * k} = ${F(x)} m.` });
        }
        if (kind === "espander") {
          const n = rnd(2, 5), k = pick([100, 150, 200, 250, 300]), s = pick([20, 25, 30, 40, 50]), Fv = n * k * s / 100;
          return R(Fv, "N", { text: `Elvin məşqdə espander dartır: espanderdə ${n} eyni yay paralel bərkidilib, hər birinin sərtliyi ${k} N/m. Espanderi ${s} sm dartmaq üçün nə qədər qüvvə lazımdır?`,
            solution: `Paralel: k = ${n}·${k} = ${n * k} N/m. F = kx = ${n * k}·${F(s / 100)} = ${F(Fv)} N.` });
        }
        if (kind === "bezmen") {
          let m1, x1, x2, m2; do { m1 = pick([2, 4, 5, 8, 10]); x1 = rnd(1, 5); x2 = rnd(1, 12); m2 = m1 * x2 / x1; } while (x1 === x2 || !nice(m2, 2) || m2 > 40);
          return R(m2, "kq", { text: `Bazarda bezmenlə (yaylı tərəzi) çəkirlər. ${m1} kq-lıq çəki daşı yayı ${x1} sm uzadır. Kartof torbası yayı ${x2} sm uzadır. Torbanın kütləsi nə qədərdir?`,
            solution: `Uzanma kütləyə düz mütənasibdir: m = ${m1}·${x2}/${x1} = ${F(m2)} kq. (k-nı tapmağa ehtiyac yoxdur.)` });
        }
        let m, k, x; do { m = pick([30, 40, 46, 50, 60]); k = pick([2000, 2500, 4000, 5000, 8000, 10000]); x = m * g / k; } while (!nice(x, 3));
        return R(x, "m", { text: `Batut torunun bütün yaylarını birlikdə sərtliyi ${k} N/m olan bir yay kimi götürmək olar. Kütləsi ${m} kq olan uşaq batutun ortasında hərəkətsiz durur. Tor nə qədər əyilib? Cavabı metrlə yaz.`,
          solution: `Tarazlıq: kx = mg → x = ${m * g}/${k} = ${F(x)} m.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a figure (springs, graphs, incline), several steps;
  // the wrong options are the answers of typical mistakes. Questions 5, 6, 7, 9 and 10 also use "Nyuton qanunları",
  // "Sürtünmə və maili müstəvi" and "Sərbəstdüşmə" (the topics that come before this one in the plan).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  // SVG helpers (strings; every figure is turned into an <svg> element by svgEl)
  const INK = "var(--ink,#17171a)", ACC = "var(--accent,#a32d2d)", MUT = "var(--muted,#6b6b73)", PAP = "var(--paper,#fff)", VEC = "var(--vec,#0c447c)", SOFT = "var(--accent-soft,#f3dede)";
  const f1 = n => +(+n).toFixed(1);
  const ln = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const pl = (pts, c = INK, w = 2, ex = "") => `<polyline points="${pts.map(p => f1(p[0]) + "," + f1(p[1])).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${ex}/>`;
  const pg = (pts, fill = PAP, c = INK, w = 2) => `<polygon points="${pts.map(p => f1(p[0]) + "," + f1(p[1])).join(" ")}" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linejoin="round"/>`;
  const tx = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const dsh = (x1, y1, x2, y2, c = MUT) => ln(x1, y1, x2, y2, c, 1.2, ' stroke-dasharray="4 3"');
  const arw = (x1, y1, x2, y2, c = ACC, w = 2.5) => ln(x1, y1, x2, y2, c, w, ' marker-end="url(#hk-ar)"');
  const dim = (x1, y1, x2, y2) => ln(x1, y1, x2, y2, INK, 1.4, ' marker-start="url(#hk-ar)" marker-end="url(#hk-ar)"');
  const dot = (x, y, c = INK, r = 3.5) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${c}"/>`;
  const rect = (x, y, w, h, fill = PAP) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
  const hatch = (x1, x2, y, dir = 1) => { let s = ln(x1, y, x2, y, INK, 3); for (let x = x1 + 8; x <= x2; x += 10) s += ln(x, y, x - 6, y + 8 * dir, INK, 1.4); return s; };
  const svgS = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" class="oy-svg" role="img" aria-label="${aria}"><defs><marker id="hk-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  // a spring (zigzag) from (x1, y1) to (x2, y2) with straight leads at both ends
  function spr(x1, y1, x2, y2, n = 7, amp = 8, c = INK, w = 2) {
    const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux, lead = Math.min(14, L * .15), body = L - 2 * lead;
    const pts = [[x1, y1], [x1 + ux * lead, y1 + uy * lead]];
    for (let i = 0; i < n; i++) { const t = lead + body * (i + .5) / n, s = (i % 2 ? -1 : 1) * amp; pts.push([x1 + ux * t + nx * s, y1 + uy * t + ny * s]); }
    pts.push([x2 - ux * lead, y2 - uy * lead], [x2, y2]);
    return pl(pts, c, w);
  }
  // axes with optional ticks and grid; returns the markup and the scale functions X(u), Y(v)
  function frame(o) {
    const X = u => o.x0 + o.pw * u / o.xmax, Y = v => o.y0 - o.ph * v / o.ymax;
    let s = "";
    (o.xt || []).forEach(u => { s += (o.grid ? ln(X(u), o.y0, X(u), Y(o.ymax), MUT, .6) : "") + tx(X(u), o.y0 + 16, F(u), "middle", MUT, 11); });
    (o.yt || []).forEach(v => { s += (o.grid ? ln(o.x0, Y(v), X(o.xmax), Y(v), MUT, .6) : "") + tx(o.x0 - 7, Y(v) + 4, F(v), "end", MUT, 11); });
    s += arw(o.x0, o.y0, X(o.xmax) + 14, o.y0, INK, 1.6) + arw(o.x0, o.y0, o.x0, Y(o.ymax) - 14, INK, 1.6)
      + tx(X(o.xmax) + 20, o.y0 + 4, o.xl, "start") + tx(o.x0 + 8, Y(o.ymax) - 12, o.yl, "start");
    return { s, X, Y };
  }
  // 1: F–x lines of two springs through marked points (x in sm, F in N)
  function figKF(p1, p2) {
    const fr = frame({ x0: 40, y0: 165, pw: 204, ph: 140, xmax: 12, ymax: 10, xt: [2, 4, 6, 8, 10, 12], yt: [2, 4, 6, 8, 10], grid: true, xl: "x, sm", yl: "F, N" });
    let s = fr.s;
    [[p1, ACC, "1"], [p2, VEC, "2"]].forEach(([p, c, n]) => { const k = Math.min(12 / p[0], 10 / p[1]);
      s += ln(fr.X(0), fr.Y(0), fr.X(p[0] * k), fr.Y(p[1] * k), c, 2.5) + dot(fr.X(p[0]), fr.Y(p[1]), c) + tx(fr.X(p[0] * k) + 7, fr.Y(p[1] * k) - 4, n, "start", c); });
    return svgEl(svgS(310, 192, s, "Qrafik: iki yayın elastiklik qüvvəsinin deformasiyadan asılılığı, 1 və 2 düz xətləri"));
  }
  // 2: spring length against the stretching force
  function figLF(l0, l1, F1) {
    const Fm = F1 * 1.5, lm = l1 * 1.3, fr = frame({ x0: 52, y0: 165, pw: 190, ph: 135, xmax: Fm, ymax: lm, xl: "F, N", yl: "l, sm" }), X = fr.X, Y = fr.Y, sl = (l1 - l0) / F1, Fe = Fm * .95;
    const s = fr.s + ln(X(0), Y(l0), X(Fe), Y(l0 + sl * Fe), ACC, 2.5) + dsh(X(F1), Y(l1), X(F1), Y(0)) + dsh(X(0), Y(l1), X(F1), Y(l1))
      + dot(X(0), Y(l0)) + dot(X(F1), Y(l1), ACC) + tx(X(F1), Y(0) + 16, F(F1), "middle", INK, 12) + tx(X(0) - 7, Y(l1) + 4, F(l1), "end", INK, 12) + tx(X(0) - 7, Y(l0) + 4, F(l0), "end", INK, 12);
    return svgEl(svgS(310, 192, s, "Qrafik: yayın uzunluğunun dartıcı qüvvədən asılılığı, düz xətt"));
  }
  // 3: two springs in series under a load
  function figSer() {
    const s = hatch(60, 160, 22, -1) + spr(110, 22, 110, 92, 6, 9) + spr(110, 92, 110, 162, 6, 9) + dot(110, 92) + rect(88, 162, 44, 32) + tx(110, 183, "m", "middle", INK, 14)
      + tx(132, 60, "k₁", "start") + tx(132, 130, "k₂", "start");
    return svgEl(svgS(220, 205, s, "Tavandan ardıcıl asılmış iki yay: k₁ və k₂, aşağıda m kütləli yük"));
  }
  // 4: a spring cut in the ratio a : b, the pieces joined in parallel
  function figCut(a, b) {
    const t = a + b, xc = 40 + 200 * a / t, n1 = Math.max(2, Math.min(8, Math.round(10 * a / t))), n2 = Math.max(2, Math.min(8, Math.round(10 * b / t)));
    const s = spr(40, 34, xc, 34, n1, 8) + spr(xc, 34, 240, 34, n2, 8) + ln(xc - 6, 46, xc + 6, 20, ACC, 2.5)
      + tx((40 + xc) / 2, 14, F(a)) + tx((xc + 240) / 2, 14, F(b))
      + arw(140, 56, 140, 82) + tx(152, 74, "paralel", "start", MUT, 11)
      + ln(60, 94, 60, 168, INK, 4) + ln(220, 94, 220, 168, INK, 4)
      + spr(60, 115, 220, 115, n1, 8) + spr(60, 148, 220, 148, n2, 8) + tx(140, 100, F(a)) + tx(140, 133, F(b));
    return svgEl(svgS(280, 180, s, `Yay ${a} : ${b} nisbətində kəsilir; hissələr ortaq lövhələrə paralel bərkidilir`));
  }
  // 5: a lift with a spring and a load; up = the lift moves upwards (the arrow shows the velocity)
  function figLift(up) {
    const s = rect(70, 20, 100, 180, "none") + hatch(70, 170, 20, -1) + spr(120, 20, 120, 100, 6, 9) + `<circle cx="120" cy="120" r="19" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + tx(120, 125, "m", "middle", INK, 14)
      + tx(138, 62, "k", "start") + (up ? arw(206, 150, 206, 80) : arw(206, 80, 206, 150)) + tx(220, 118, "v", "start", ACC, 14);
    return svgEl(svgS(250, 212, s, `Lift: tavandan yayla yük asılıb; lift ${up ? "yuxarı" : "aşağı"} hərəkət edir`));
  }
  // 6: a block pulled up an incline by a spring (sin α, cos α given)
  function figIncline(sn, cs) {
    const hyp = 190, A = [36, 182], u = [cs, -sn], nr = [-sn, -cs], P = (t, n) => [A[0] + u[0] * t + nr[0] * n, A[1] + u[1] * t + nr[1] * n];
    const B = [A[0] + hyp * cs, A[1]], C = [B[0], A[1] - hyp * sn], al = Math.atan2(sn, cs), t0 = 34, bw = 42, bh = 26;
    let s = pg([A, B, C], SOFT) + hatch(10, B[0] + 30, 182, 1)
      + pg([P(t0, 0), P(t0 + bw, 0), P(t0 + bw, bh), P(t0, bh)]) + tx(P(t0 + bw / 2, bh / 2)[0], P(t0 + bw / 2, bh / 2)[1] + 5, "m", "middle", INK, 14)
      + spr(...P(t0 + bw, bh / 2), ...P(t0 + bw + 70, bh / 2), 6, 7) + arw(...P(t0 + bw + 70, bh / 2), ...P(t0 + bw + 102, bh / 2))
      + tx(P(t0 + bw + 35, bh + 12)[0], P(t0 + bw + 35, bh + 12)[1], "k", "middle", INK, 13) + tx(P(t0 + bw + 112, bh / 2 + 16)[0], P(t0 + bw + 112, bh / 2 + 16)[1], "v", "middle", ACC, 14);
    s += `<path d="M${f1(A[0] + 38)} ${A[1]} A38 38 0 0 0 ${f1(A[0] + 38 * cs)} ${f1(A[1] - 38 * sn)}" fill="none" stroke="${INK}" stroke-width="1.6"/>` + tx(A[0] + 56 * Math.cos(al / 2), A[1] - 56 * Math.sin(al / 2) + 5, "α", "middle", INK, 14);
    return svgEl(svgS(260, 200, s, "Maili müstəvi: üzərindəki blok müstəvi boyunca yayla yuxarı dartılır"));
  }
  // 7: two blocks joined by a spring on a smooth table, the force pulls the right one
  function figBlocks() {
    const s = hatch(10, 290, 100) + rect(40, 60, 50, 40) + tx(65, 85, "m₁", "middle", INK, 14) + spr(90, 80, 150, 80, 6, 8) + tx(120, 62, "k", "middle")
      + rect(150, 60, 60, 40) + tx(180, 85, "m₂", "middle", INK, 14) + arw(210, 80, 262, 80) + tx(240, 70, "F", "middle", ACC, 14);
    return svgEl(svgS(300, 120, s, "Hamar masada iki blok yayla birləşib; ikinci bloka F qüvvəsi təsir edir"));
  }
  // 8: F–x graph with the working point marked
  function figWork(x2, F2, ymax) {
    const fr = frame({ x0: 44, y0: 165, pw: 200, ph: 140, xmax: 12, ymax, xt: [2, 4, 6, 8, 10, 12], yt: [1, 2, 3, 4, 5].map(i => i * ymax / 5), grid: true, xl: "x, sm", yl: "F, N" }), k = Math.min(12 / x2, ymax / F2);
    const s = fr.s + ln(fr.X(0), fr.Y(0), fr.X(x2 * k), fr.Y(F2 * k), ACC, 2.5) + dot(fr.X(x2), fr.Y(F2), ACC);
    return svgEl(svgS(310, 192, s, "Qrafik: yayın elastiklik qüvvəsinin deformasiyadan asılılığı, düz xətt"));
  }
  // 9: a toy gun on the edge of a table, the ball falls to the floor
  function figGun() {
    const traj = []; for (let i = 0; i <= 12; i++) { const x = 150 + 110 * i / 12; traj.push([x, 90 + 80 * Math.pow((x - 150) / 110, 2)]); }
    const s = hatch(10, 310, 180) + ln(20, 100, 150, 100, INK, 4) + ln(30, 100, 30, 180) + ln(140, 100, 140, 180) + ln(40, 64, 40, 100, INK, 4)
      + spr(40, 90, 78, 90, 5, 7) + `<circle cx="88" cy="90" r="10" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + tx(59, 74, "k", "middle") + tx(88, 72, "m", "middle")
      + pl(traj, ACC, 2, ' stroke-dasharray="5 4"') + `<circle cx="260" cy="170" r="10" fill="none" stroke="${MUT}" stroke-width="1.6"/>`
      + dsh(150, 100, 296, 100) + dim(290, 102, 290, 178) + tx(300, 144, "H", "start")
      + dsh(150, 104, 150, 196) + dsh(260, 182, 260, 196) + dim(152, 194, 258, 194) + tx(205, 212, "s = ?", "middle", INK, 14);
    return svgEl(svgS(320, 220, s, "Masanın kənarındakı oyuncaq tapança: kürəcik üfüqi atılır və yerə düşür; H masanın hündürlüyü, s üfüqi məsafə"));
  }
  // 10: spring elongation against time: grows until the block starts, then drops and stays constant
  function figXT(xs, xk) {
    const ym = xs * 1.25, fr = frame({ x0: 50, y0: 165, pw: 200, ph: 140, xmax: 10, ymax: ym, xl: "t", yl: "x, sm" }), X = fr.X, Y = fr.Y;
    const s = fr.s + pl([[X(0), Y(0)], [X(5), Y(xs)], [X(5.6), Y(xk)], [X(9.5), Y(xk)]], ACC, 2.5) + dsh(X(0), Y(xs), X(5), Y(xs)) + dsh(X(0), Y(xk), X(9.5), Y(xk))
      + tx(X(0) - 7, Y(xs) + 4, F(xs), "end", INK, 12) + tx(X(0) - 7, Y(xk) + 4, F(xk), "end", INK, 12);
    return svgEl(svgS(310, 192, s, "Qrafik: yayın uzanması düz artır, sonra tez azalır və sabit qalır"));
  }

  const KFP = []; for (let x = 2; x <= 12; x++) for (let Fv = 1; Fv <= 10; Fv++) { const k = 100 * Fv / x; if (Number.isInteger(k)) KFP.push([x, Fv, k]); }
  const SER3 = []; PAIRS.filter(p => p[0] !== p[1] && p[1] <= 600).forEach(([a, b]) => [0.5, 1, 1.5, 2, 2.5, 3, 4, 5].forEach(m => { const W = m * g, x = W * (1 / a + 1 / b) * 100, w = [W / (a + b) * 100, W / a * 100, W / b * 100, 2 * W / (a + b) * 100]; if (x <= 60 && [x, ...w].every(v => ok2(v, 1))) SER3.push([a, b, m]); }));
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. F–x graph of two springs → their parallel stiffness
    { tip: "qapali", gen: () => again(() => {
      const a = pick(KFP), b = pick(KFP), k1 = a[2], k2 = b[2];
      if (Math.max(k1, k2) < 1.4 * Math.min(k1, k2)) return null;
      const e = p => { const s = Math.min(12 / p[0], 10 / p[1]); return [p[0] * s, p[1] * s]; }, e1 = e(a), e2 = e(b);
      if (Math.hypot(17 * (e1[0] - e2[0]), 14 * (e1[1] - e2[1])) < 22) return null;
      const sum = k1 + k2, ser = k1 * k2 / sum, w = [sum / 100, ser, sum / 2, Math.abs(k1 - k2)];
      if (![sum, ...w].every(v => ok2(v))) return null;
      return mc(ae(sum, w, U_("N/m")), { svg: figKF(a, b),
        text: `Qrafikdə iki yayın elastiklik qüvvəsinin deformasiyadan asılılığı verilib (deformasiya santimetrlə, qüvvə nyutonla). Bu yayları paralel birləşdirsək, sistemin sərtliyi nə qədər olar?`,
        solution: `Qrafikdən: 1-ci yay ${a[0]} sm = ${F(a[0] / 100)} m-də ${a[1]} N verir: k₁ = F/x = ${a[1]}/${F(a[0] / 100)} = ${k1} N/m. 2-ci yay: k₂ = ${b[1]}/${F(b[0] / 100)} = ${k2} N/m. Paralel birləşmədə sərtliklər toplanır: k = k₁ + k₂ = ${sum} N/m. Tələlər: santimetri metrə çevirməmək (${F(sum / 100)}), ardıcıl düsturu yazmaq (${F(+ser.toFixed(4))}), orta ədədi tapmaq (${F(sum / 2)}), fərqi götürmək (${F(Math.abs(k1 - k2))}).` });
    }) },
    // 2. length–force graph: l₀ must be subtracted
    { tip: "qapali", gen: () => again(() => {
      const l0 = rnd(10, 40), k = pick([25, 40, 50, 80, 100, 125, 160, 200, 250, 400, 500, 800, 1000]), x1 = rnd(3, 12), F1 = k * x1 / 100, l1 = l0 + x1;
      if (!nice(F1, 1)) return null;
      const w = [F1 / (l1 / 100), F1 / x1, F1 / (l0 / 100), 10 * k];
      if (![k, ...w].every(v => ok2(v))) return null;
      const lm = l1 * 1.3, sy = 135 / lm; if (sy * x1 < 18) return null;
      return mc(ae(k, w, U_("N/m")), { svg: figLF(l0, l1, F1),
        text: `Qrafikdə yayın uzunluğunun ona təsir edən dartıcı qüvvədən asılılığı verilib. Yayın sərtliyi k nə qədərdir?`,
        solution: `Qrafikdən: F = 0 olanda l₀ = ${l0} sm — bu deformasiyasız uzunluqdur. ${F(F1)} N qüvvədə l = ${l1} sm, deməli x = l − l₀ = ${l1} − ${l0} = ${x1} sm = ${F(x1 / 100)} m. k = F/x = ${F(F1)}/${F(x1 / 100)} = ${k} N/m. Tələlər: x əvəzinə bütün uzunluğu götürmək (${F(+w[0].toFixed(4))}), santimetri metrə çevirməmək (${F(+w[1].toFixed(4))}), l₀-ı deformasiya saymaq (${F(+w[2].toFixed(4))}), santimetri milimetr saymaq (${F(+w[3].toFixed(4))}).` });
    }) },
    // 3. two springs in series under a load: the elongations add up
    { tip: "qapali", gen: () => again(() => {
      const [a, b, m] = pick(SER3), W = m * g, x = W * (1 / a + 1 / b) * 100, w = [W / (a + b) * 100, W / a * 100, W / b * 100, 2 * W / (a + b) * 100];
      return mc(ae(x, w, U_("sm")), { svg: figSer(),
        text: `Tavandan sərtlikləri k₁ = ${a} N/m (yuxarıdakı) və k₂ = ${b} N/m olan iki yay ardıcıl asılıb, aşağı ucdan ${F(m)} kq kütləli yük asılıb. Sistem tarazlıqdadır, yayların kütləsi nəzərə alınmır. İki yayın ümumi uzanması neçə santimetrdir? (g = 10 m/s²)`,
        solution: `Hər iki yayı eyni qüvvə dartır — yükün ağırlığı: F = mg = ${F(W)} N. Üst yay: x₁ = F/k₁ = ${F(W)}/${a} = ${F(+(W / a).toFixed(4))} m = ${F(+(W / a * 100).toFixed(4))} sm, alt yay: x₂ = ${F(W)}/${b} = ${F(+(W / b).toFixed(4))} m = ${F(+(W / b * 100).toFixed(4))} sm. Uzanmalar toplanır: ${F(+x.toFixed(4))} sm. Tələlər: paralel düsturu k₁ + k₂ (${F(+w[0].toFixed(4))} sm), yalnız bir yayı hesablamaq (${F(+w[1].toFixed(4))} və ${F(+w[2].toFixed(4))} sm), sərtliklərin orta ədədini götürmək (${F(+w[3].toFixed(4))} sm).` });
    }) },
    // 4. a spring cut in the ratio a : b, the pieces joined in parallel
    { tip: "qapali", gen: () => again(() => {
      const [a, b] = pick([[1, 2], [1, 3], [2, 3], [1, 4], [1, 5], [2, 5]]), t = a + b, k0 = pick([60, 120, 180, 240, 300, 360, 600]), k1 = k0 * t / a, k2 = k0 * t / b, sum = k1 + k2;
      if (![sum, k0, 4 * k0, k1, k2].every(v => ok2(v))) return null;
      return mc(ae(sum, [k0, 4 * k0, k1, k2], U_("N/m")), { svg: figCut(a, b),
        text: `Sərtliyi k₀ = ${k0} N/m olan bircins yayı uzunluğuna görə ${a} : ${b} nisbətində iki hissəyə kəsdilər. Hər iki hissənin ucları ortaq lövhələrə bərkidilərək paralel birləşdirildi. Alınan sistemin sərtliyi nə qədərdir?`,
        solution: `Yayın sərtliyi uzunluğa tərs mütənasibdir: qısa hissə sərtdir. Uzunluğu bütöv yayın uzunluğunun ${a}/${t} hissəsinə bərabər olan parçanın sərtliyi k₁ = k₀·${t}/${a} = ${F(k1)} N/m, ${b}/${t} hissəsinə bərabər olan parçanın sərtliyi k₂ = k₀·${t}/${b} = ${F(k2)} N/m. Paralel birləşmədə sərtliklər toplanır: k = ${F(k1)} + ${F(k2)} = ${F(sum)} N/m. Tələlər: kəsib yenidən birləşdirsək yay dəyişməz saymaq (${k0}), hissələri bərabər saymaq (4k₀ = ${4 * k0}), yalnız bir hissəni götürmək (${F(k1)} və ${F(k2)}).` });
    }) },
    // 5. spring in a lift (Newton's second law) → elongation in cm
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const k = pick([100, 200, 250, 400, 500, 800]), m = pick([0.5, 1, 1.5, 2, 2.5, 4]), a = pick([1, 2, 2.5, 4, 5]), L = pick(LIFT), up = L.d.startsWith("yuxarı");
      const x = m * (g + L.s * a) / k * 100, w = [m * g / k * 100, m * (g - L.s * a) / k * 100, m * a / k * 100, x / 100];
      if (![x, ...w.slice(0, 3)].every(v => ok2(v, 1)) || !ok2(w[3], 3)) return null;
      return mc(ae(x, w, U_("sm")), { svg: figLift(up),
        text: `Liftin tavanından sərtliyi ${k} N/m olan yayla ${F(m)} kq kütləli yük asılıb. Lift ${L.d}, təcilinin modulu ${F(a)} m/s²-dir. Yük liftə nəzərən tərpənmir. Yay neçə santimetr uzanıb? (g = 10 m/s²)`,
        solution: `${L.w[0].toUpperCase() + L.w.slice(1)}. ${L.s > 0 ? "kx − mg = ma, deməli x = m(g + a)/k" : "mg − kx = ma, deməli x = m(g − a)/k"} = ${F(m)}·${F(g + L.s * a)}/${k} = ${F(+(x / 100).toFixed(4))} m = ${F(+x.toFixed(4))} sm. Tələlər: təcili unutmaq, yük tarazlıqdadır saymaq (${F(+w[0].toFixed(4))} sm), təcilin işarəsini səhv götürmək (${F(+w[1].toFixed(4))} sm), yalnız ma-nı götürmək (${F(+w[2].toFixed(4))} sm), cavabı metrlə yazmaq (${F(+w[3].toFixed(4))}).` });
    }) },
    // 6. a block pulled up an incline by a spring, with friction
    { tip: "qapali", birlesik: "fiz-surtunme-maili", gen: () => again(() => {
      const [sn, cs] = pick([[0.6, 0.8], [0.8, 0.6]]), m = pick([1, 2, 2.5, 4, 5]), mu = pick([0.1, 0.2, 0.25, 0.3, 0.5]), k = pick([100, 200, 250, 400, 500, 800]), W = m * g;
      const x = W * (sn + mu * cs) / k * 100, w = [W * sn / k * 100, W * (sn - mu * cs) / k * 100, W * (sn + mu) / k * 100, W * (cs + mu * sn) / k * 100];
      if (![x, ...w].every(v => ok2(v, 1))) return null;
      return mc(ae(x, w, U_("sm")), { svg: figIncline(sn, cs),
        text: `${F(m)} kq kütləli blok maili müstəvi üzərində sərtliyi ${k} N/m olan yayla müstəvi boyunca bərabər sürətlə yuxarı dartılır. Müstəvinin bucağı α-dır (sin α = ${F(sn)}, cos α = ${F(cs)}), sürtünmə əmsalı: ${F(mu)}. Yay neçə santimetr uzanıb? (g = 10 m/s²)`,
        solution: `Sürət sabitdir — qüvvələr müstəvi boyunca tarazdır: kx = mg·sin α + f. Sürtünmə qüvvəsi f = μN, N = mg·cos α = ${F(W * cs)} N, f = ${F(mu)}·${F(W * cs)} = ${F(+(mu * W * cs).toFixed(4))} N. mg·sin α = ${F(+(W * sn).toFixed(4))} N. kx = ${F(+(W * (sn + mu * cs)).toFixed(4))} N → x = ${F(+(x / 100).toFixed(4))} m = ${F(+x.toFixed(4))} sm. Tələlər: sürtünməni unutmaq (${F(+w[0].toFixed(4))} sm), sürtünməni əks yönə yazmaq (${F(+w[1].toFixed(4))} sm), N = mg götürmək (${F(+w[2].toFixed(4))} sm), sin ilə cos-u dəyişmək (${F(+w[3].toFixed(4))} sm).` });
    }) },
    // 7. two blocks joined by a spring, force on one of them
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const m1 = pick([1, 2, 3, 4]), m2 = pick([1, 2, 3, 4, 6]), Fv = pick([6, 8, 10, 12, 15, 20, 24, 30]), k = pick([50, 100, 120, 150, 200, 250, 400, 500]);
      if (m1 === m2) return null;
      const a = Fv / (m1 + m2), T = m1 * a, x = T / k * 100, w = [Fv / k * 100, m2 * Fv / ((m1 + m2) * k) * 100, Fv / (2 * k) * 100, m1 * Fv / (m2 * k) * 100];
      if (![x, ...w].every(v => ok2(v, 1))) return null;
      return mc(ae(x, w, U_("sm")), { svg: figBlocks(),
        text: `Hamar (sürtünməsiz) masada kütlələri m₁ = ${m1} kq və m₂ = ${m2} kq olan iki blok sərtliyi ${k} N/m olan yayla birləşib. İkinci bloku üfüqi ${Fv} N qüvvə ilə dartırlar, birinci blok yayla arxadan gəlir. Yayın uzanması sabitləşib. Yay neçə santimetr uzanıb?`,
        solution: `Sabit uzanmada hər iki blok eyni təcillə gedir: a = F/(m₁ + m₂) = ${Fv}/${m1 + m2} = ${F(+a.toFixed(4))} m/s². Birinci bloku yalnız yay dartır: kx = m₁a = ${F(m1)}·${F(+a.toFixed(4))} = ${F(+T.toFixed(4))} N → x = ${F(+(T / k).toFixed(4))} m = ${F(+x.toFixed(4))} sm. Tələlər: yay bütün qüvvəni daşıyır saymaq (${F(+w[0].toFixed(4))} sm), kütlələri dəyişmək (${F(+w[1].toFixed(4))} sm), yayın ucundakı qüvvəni yarı bölmək (${F(+w[2].toFixed(4))} sm), təcili F/m₂ götürmək (${F(+w[3].toFixed(4))} sm).` });
    }) },
    // 8. work to stretch a spring further, from a graph
    { tip: "qapali", gen: () => again(() => {
      const k = pick([50, 100, 200, 250, 400, 500, 800]), x1 = rnd(1, 9), x2 = rnd(x1 + 1, 12), F1 = k * x1 / 100, F2 = k * x2 / 100, ymax = [10, 20, 25, 30, 40, 50, 60, 80, 100].find(v => v >= F2 * 1.1);
      if (!ymax || !nice(F2, 1) || !nice(F1, 1)) return null;
      const A = k * (x2 * x2 - x1 * x1) / 20000, w = [k * (x2 - x1) ** 2 / 20000, F2 * (x2 - x1) / 100, F2 * x2 / 200, (F1 + F2) * (x2 - x1) / 100];
      if (![A, ...w].every(v => ok2(v, 3))) return null;
      return mc(ae(A, w, U_("J")), { svg: figWork(x2, F2, ymax),
        text: `Qrafikdə yayın elastiklik qüvvəsinin deformasiyadan asılılığı verilib (deformasiya santimetrlə, qüvvə nyutonla). Yay ${x1} sm dartılmış vəziyyətdən ${x2} sm-ə qədər yavaş-yavaş dartılsa, bunun üçün nə qədər iş görülməlidir?`,
        solution: `Qrafikdən k = F/x = ${F(F2)}/${F(x2 / 100)} = ${k} N/m. İş = enerjilərin fərqi: A = k(x₂² − x₁²)/2 = ${k}·(${F(x2 / 100)}² − ${F(x1 / 100)}²)/2 = ${k}·${F(+((x2 * x2 - x1 * x1) / 10000).toFixed(6))}/2 = ${F(+A.toFixed(6))} J. Tələlər: k(x₂ − x₁)²/2 (${F(+w[0].toFixed(6))} J), düzbucaqlının sahəsi F₂·(x₂ − x₁) (${F(+w[1].toFixed(6))} J), sıfırdan x₂-yə qədər enerji (${F(+w[2].toFixed(6))} J), trapesiyanı yarıya bölməmək (${F(+w[3].toFixed(6))} J).` });
    }) },
    // 9. toy gun on a table: spring energy → speed, then the fall time
    { tip: "qapali", birlesik: "fiz-serbest-dusme", gen: () => again(() => {
      const r = pick([100, 400, 900, 1600, 2500, 3600, 10000]), m = pick([0.01, 0.02, 0.04, 0.05, 0.1, 0.2, 0.25]), k = Math.round(r * m), xs = rnd(1, 10), H = pick([0.45, 0.8, 1.25, 1.8, 3.2, 5, 2.45]);
      if (k < 10 || k > 2000) return null;
      const v = xs / 100 * Math.sqrt(r), t = Math.sqrt(2 * H / g), s = v * t, w = [v * t * t, 100 * s, s + xs / 100, v * H];
      if (!nice(v, 2) || !nice(t, 2) || ![s, ...w].every(q => ok2(q, 2))) return null;
      return mc(ae(s, w, U_("m")), { svg: figGun(),
        text: `Üfüqi masanın kənarındakı oyuncaq tapançanın yayının sərtliyi ${k} N/m-dir. Yayı ${xs} sm sıxıb ${F(m * 1000)} q kütləli kürəciyi atırlar; kürəcik masanın kənarından üfüqi istiqamətdə uçur. Masanın hündürlüyü ${F(H)} m-dir. Kürəcik yerə masanın kənarından üfüqi istiqamətdə neçə metr məsafədə düşər? Sürtünmə və havanın müqaviməti yoxdur, g = 10 m/s².`,
        solution: `Yayın enerjisi kürəciyin enerjisinə keçir: kx²/2 = mv²/2 → v = x·√(k/m) = ${F(xs / 100)}·√(${k}/${F(m)}) = ${F(xs / 100)}·${Math.sqrt(r)} = ${F(+v.toFixed(4))} m/s. Şaquli istiqamətdə sərbəst düşmə: H = gt²/2 → t = √(2H/g) = √(${F(+(2 * H / g).toFixed(4))}) = ${F(+t.toFixed(4))} s. Üfüqi istiqamətdə sürət sabitdir: s = v·t = ${F(+v.toFixed(4))}·${F(+t.toFixed(4))} = ${F(+s.toFixed(4))} m. Tələlər: t əvəzinə t² götürmək (${F(+w[0].toFixed(4))} m), sm-i metrə çevirməmək (${F(+w[1].toFixed(4))} m), sıxılmanı məsafəyə əlavə etmək (${F(+w[2].toFixed(4))} m), vaxt əvəzinə hündürlüyü vurmaq (${F(+w[3].toFixed(4))} m).` });
    }) },
    // 10. spring elongation against time: static and sliding friction
    { tip: "qapali", birlesik: "fiz-surtunme-maili", gen: () => again(() => {
      const m = pick([1, 2, 4, 5]), k = pick([100, 200, 250, 400, 500]), xs = rnd(4, 12), xk = rnd(2, xs - 1);
      if (xk > 0.8 * xs) return null;
      const mus = k * xs / (1000 * m), muk = k * xk / (1000 * m), d = mus - muk;
      if (mus > 1 || ![mus, muk, d].every(v => ok2(v, 2))) return null;
      const w = [mus, muk, mus + muk, 100 * d];
      if (!w.every(v => ok2(v, 2))) return null;
      const f = x => F(+x.toFixed(4));
      return mc(ae(d, w, f), { svg: figXT(xs, xk),
        text: `Kütləsi ${F(m)} kq olan blok üfüqi masada durur və sərtliyi ${k} N/m olan yayla dartılır; yayı masaya paralel (üfüqi) istiqamətdə yavaş-yavaş dartırlar. Qrafikdə yayın uzanmasının zamandan asılılığı verilib: blok tərpəndikdən və qısa keçid prosesindən sonra bərabər sürətlə hərəkət edir. Sükunət sürtünmə əmsalı μ_s (blok tərpənən anda sükunət sürtünməsi maksimumdur), sürüşmə sürtünmə əmsalı isə μ_k-dır. μ_s − μ_k fərqi nə qədərdir? (g = 10 m/s²)`,
        solution: `Blok tərpənən anda uzanma ən böyükdür (${xs} sm) və sükunət sürtünməsi maksimumdur: kx_s = μ_s·mg → μ_s = ${k}·${F(xs / 100)}/${F(m * g)} = ${f(mus)}. Keçiddən sonra, bərabər hərəkətdə yayın uzanması ${xk} sm-dir: kx_k = μ_k·mg → μ_k = ${k}·${F(xk / 100)}/${F(m * g)} = ${f(muk)}. Fərq: ${f(mus)} − ${f(muk)} = ${f(d)}. Tələlər: yalnız μ_s (${f(mus)}) və ya yalnız μ_k (${f(muk)}), əmsalları toplamaq (${f(mus + muk)}), santimetri metrə çevirməmək (${f(100 * d)}).` });
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
      key: "fiz-huk", title: "Elastiklik, Huk qanunu", fenn: "fizika", link: "dersler/fiz-huk.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: N, N/m, m, J). Onluq kəsr vergül və ya nöqtə ilə: 0,04. g = 10 m/s².",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["huk", "huk", "uzunluq", "birlesme", "birlesme", "yuk", "yuk", "enerji", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-huk.html")) b.push("dersler/fiz-huk.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
