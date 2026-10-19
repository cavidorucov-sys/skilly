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
            text = `Hamar (sürtünməsiz) masada ${F(m)} kq kütləli taxta tini sərtliyi ${k} N/m olan yayla dartırlar. Tin ${F(a)} m/s² təcillə hərəkət edir. Yay nə qədər uzanıb?`;
            solution = `Üfüqi istiqamətdə tinə yalnız yay təsir edir: kx = ma → x = ${F(m)}·${F(a)}/${k} = ${F(x)} m.`;
          } else if (kind === "surt") {
            const mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]); x = mu * m * g / k;
            text = `${F(m)} kq kütləli tini masa üzərində sərtliyi ${k} N/m olan yayla bərabər sürətlə dartırlar. Sürtünmə əmsalı ${F(mu)}. Yay nə qədər uzanıb?`;
            solution = `Bərabər sürət → qüvvələr tarazdır: kx = μmg = ${F(mu)}·${F(m)}·10 = ${F(mu * m * g)} N → x = ${F(mu * m * g)}/${k} = ${F(x)} m.`;
          } else {
            const m2 = pick([0.5, 1, 1.5, 2, 3, 4]), Fv = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]), a = Fv / (m + m2), T = m * a; x = T / k;
            if (!nice(a, 2)) continue;
            text = `Hamar masada ${F(m)} kq və ${F(m2)} kq kütləli iki tin sərtliyi ${k} N/m olan yayla birləşdirilib. ${F(m2)} kq-lıq tini ${F(Fv)} N qüvvə ilə dartırlar, ${F(m)} kq-lıq tin arxadan gəlir. Yay nə qədər uzanıb?`;
            solution = `Hər iki tin eyni təcillə gedir: a = F/(m₁ + m₂) = ${F(Fv)}/${F(m + m2)} = ${F(+a.toFixed(4))} m/s². Arxadakı tini yalnız yay dartır: kx = m·a = ${F(+T.toFixed(4))} N → x = ${F(x)} m.`;
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
          return R(Fv, "N", { text: `Fikrət məşqdə espander dartır: espanderdə ${n} eyni yay paralel bərkidilib, hər birinin sərtliyi ${k} N/m. Espanderi ${s} sm dartmaq üçün nə qədər qüvvə lazımdır?`,
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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-huk", title: "Elastiklik, Huk qanunu", fenn: "fizika", link: "dersler/fiz-huk.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: N, N/m, m, J). Onluq kəsr vergül və ya nöqtə ilə: 0,04. g = 10 m/s².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["huk", "huk", "uzunluq", "birlesme", "birlesme", "yuk", "yuk", "enerji", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-huk.html")) b.push("dersler/fiz-huk.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
