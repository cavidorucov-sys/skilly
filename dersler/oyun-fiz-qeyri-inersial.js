// Fizika · Qeyri-inersial sistemlər — mastery game levels (lift: weight and rope, scale reading, inertial force in a car,
// pendulum in an accelerating car, overload and weightlessness) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s².
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const g = 10;
  const cap = s => s[0].toUpperCase() + s.slice(1);

  // s = +1: acceleration up, s = −1: acceleration down
  const LIFT = [
    { d: "yuxarı qalxmağa başlayır (sürəti artır)", s: 1, w: "sürət yuxarı və artır → təcil yuxarıdır" },
    { d: "yuxarı qalxır və dayanmaq üçün yavaşıyır", s: -1, w: "sürət yuxarı, amma azalır → təcil aşağıdır" },
    { d: "aşağı enməyə başlayır (sürəti artır)", s: -1, w: "sürət aşağı və artır → təcil aşağıdır" },
    { d: "aşağı enir və dayanmaq üçün yavaşıyır", s: 1, w: "sürət aşağı, amma azalır → təcil yuxarıdır" },
  ];
  const AS = [0.5, 1, 1.5, 2, 2.5, 3, 4, 5];
  // pendulum in a car: [a, √(g² + a²)] with whole or half values
  const TRI = [[7.5, 12.5], [10.5, 14.5], [24, 26]];

  const levels = [
    { id: "lift", ad: "Liftdə çəki və ip", izah: "Əvvəl təcilin istiqamətini tap (sürətin yox!). Təcil yuxarı: P = m(g + a). Aşağı: P = m(g − a). Sabit sürət: P = mg.",
      gen() {
        const kind = pick(["P", "P", "T", "sabit"]);
        if (kind === "sabit") {
          const m = rnd(40, 90), up = Math.random() < .5;
          return R(m * g, "N", { text: `Kütləsi ${m} kq olan adam liftdədir. Lift sabit ${pick([1, 2, 3])} m/s sürətlə ${up ? "yuxarı qalxır" : "aşağı enir"}. Adamın çəkisi (döşəməyə təzyiq qüvvəsi) nə qədərdir?`,
            solution: `Sürət sabitdir → təcil 0, lift inersial sistem kimidir. P = mg = ${m * g} N. Hərəkətin istiqaməti fərq etmir.` });
        }
        const L = pick(LIFT), a = pick(AS);
        if (kind === "P") {
          const m = rnd(40, 90), P = m * (g + L.s * a);
          return R(P, "N", { text: `Kütləsi ${m} kq olan adam liftdə durur. Lift ${L.d}, təcilinin modulu ${F(a)} m/s². Adamın çəkisi (döşəməyə təzyiq qüvvəsi) nə qədərdir?`,
            solution: `${cap(L.w)}. ${L.s > 0 ? "N − mg = ma → P = N = m(g + a)" : "mg − N = ma → P = N = m(g − a)"} = ${m}·${F(g + L.s * a)} = ${F(P)} N.` });
        }
        const m = pick([0.5, 1, 2, 3, 4, 5, 8, 10]), T = m * (g + L.s * a);
        return R(T, "N", { text: `Liftin tavanından iplə ${F(m)} kq kütləli yük asılıb. Lift ${L.d}, təcilinin modulu ${F(a)} m/s². İpin gərilmə qüvvəsi nə qədərdir?`,
          solution: `${cap(L.w)}. ${L.s > 0 ? "T − mg = ma → T = m(g + a)" : "mg − T = ma → T = m(g − a)"} = ${F(m)}·${F(g + L.s * a)} = ${F(T)} N.` });
      } },
    { id: "terezi", ad: "Liftdə tərəzi", izah: "Tərəzi çəkini (N) g-yə bölüb kq göstərir: göstəriş = m(g ± a)/g. Tərsinə: göstərişdən təcili tap.",
      gen() {
        const kind = pick(["goster", "goster", "a", "m"]);
        const L = pick(LIFT), a = pick(AS), m = rnd(30, 90);
        const M = m * (g + L.s * a) / g;
        if (kind === "goster")
          return R(M, "kq", { text: `Kütləsi ${m} kq olan şagird liftdə döşəmə tərəzisinin üstündə durur. Lift ${L.d}, təcilinin modulu ${F(a)} m/s². Tərəzi neçə kq göstərir?`,
            solution: `${cap(L.w)}. Çəki P = m(g ${L.s > 0 ? "+" : "−"} a) = ${m}·${F(g + L.s * a)} = ${F(m * (g + L.s * a))} N. Tərəzi P/g = ${F(M)} kq göstərir.` });
        if (kind === "a")
          return R(a, "m/s²", { text: `Kütləsi ${m} kq olan şagird liftdə tərəzinin üstündə durur. Lift hərəkət edərkən tərəzi ${F(M)} kq göstərir. Liftin təcilinin modulu nə qədərdir?`,
            solution: `Çəki P = ${F(M)}·10 = ${F(M * g)} N, mg = ${m * g} N. ${L.s > 0 ? `P > mg → təcil yuxarıdır: a = (P − mg)/m` : `P < mg → təcil aşağıdır: a = (mg − P)/m`} = ${F(Math.abs(M * g - m * g))}/${m} = ${F(a)} m/s².` });
        // true mass from the reading
        let mm, MM; do { mm = rnd(20, 90); MM = mm * (g + L.s * a) / g; } while (!nice(MM, 1));
        return R(mm, "kq", { text: `Lift ${L.d}, təcilinin modulu ${F(a)} m/s². Liftdəki tərəzi üstündə duran çanta üçün ${F(MM)} kq göstərir. Çantanın əsl kütləsi nə qədərdir?`,
          solution: `${cap(L.w)}. Göstəriş = m(g ${L.s > 0 ? "+" : "−"} a)/g → m = ${F(MM)}·10/${F(g + L.s * a)} = ${mm} kq.` });
      } },
    { id: "etalet", ad: "Ətalət qüvvəsi", izah: "Təcilli sistemdə hər cismə təcilin əksinə F_in = m·a ətalət qüvvəsi əlavə et, sonra tarazlıq yaz.",
      gen() {
        const kind = pick(["surt", "amax", "oturacaq", "tormoz"]);
        if (kind === "surt") {
          const m = pick([5, 10, 20, 25, 40, 50, 80, 100]), a = pick([0.5, 1, 1.5, 2, 2.5, 3]);
          return R(m * a, "N", { text: `Yük maşınının kuzovunda ${m} kq-lıq qutu durur. Maşın ${F(a)} m/s² təcillə sürətlənir, qutu kuzova görə sürüşmür. Qutuya təsir edən sürtünmə qüvvəsi nə qədərdir?`,
            solution: `Maşınla bağlı sistemdə qutuya geriyə F_in = ma ətalət qüvvəsi təsir edir. Qutu sürüşmürsə, onu sükunətli sürtünmə tarazlayır: F_sür = ma = ${m}·${F(a)} = ${F(m * a)} N.` });
        }
        if (kind === "amax") {
          const mu = pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.5]);
          return R(mu * g, "m/s²", { text: `Yük maşınının kuzovunda qutu durur, qutu ilə döşəmə arasında sürtünmə əmsalı ${F(mu)}. Maşın ən çoxu hansı təcillə sürətlənə bilər ki, qutu sürüşməsin?`,
            solution: `Qutu sürüşmür, əgər ma ≤ μmg → a ≤ μg = ${F(mu)}·10 = ${F(mu * g)} m/s². Kütlə ixtisar olunur.` });
        }
        if (kind === "oturacaq") {
          let m, v, t, a; do { m = rnd(40, 90); v = pick([10, 15, 20, 25, 30]); t = rnd(4, 12); a = v / t; } while (!nice(a, 2));
          const kmh = v * 3.6;
          return R(m * a, "N", { text: `Avtomobil yerindən tərpənib ${t} s-də sürətini ${F(kmh)} km/saata çatdırır (bərabərtəcilli). Kütləsi ${m} kq olan sərnişini oturacağın söykənəcəyi hansı üfüqi qüvvə ilə itələyir?`,
            solution: `${F(kmh)} km/saat = ${v} m/s. a = ${v}/${t} = ${F(a)} m/s². Söykənəcək sərnişinə ma verməlidir (maşın sistemində o, ətalət qüvvəsini tarazlayır): F = ${m}·${F(a)} = ${F(m * a)} N.` });
        }
        const a = pick([1, 2, 2.5, 3, 4, 5, 6]);
        return R(a / g, "", { text: `Avtomobil ${F(a)} m/s² təcillə tormozlayır. Arxa oturacaqdakı çanta sürüşməsin deyə çanta ilə oturacaq arasında sürtünmə əmsalı ən azı neçə olmalıdır?`,
          solution: `Tormozlayanda çantaya irəli F_in = ma təsir edir. Sürüşməmək üçün μmg ≥ ma → μ ≥ a/g = ${F(a)}/10 = ${F(a / g)}.` });
      } },
    { id: "mayatnik", ad: "Təcilli maşında sap", izah: "Sap şaquldan α bucağı qədər geri meyl edir: tg α = a/g. Sapın gərilməsi T = m√(g² + a²).",
      gen() {
        const kind = pick(["tg", "a", "T", "T", "su"]);
        if (kind === "tg") {
          const a = pick([1, 2, 2.5, 3, 4, 5, 6, 7.5, 8]), dec = Math.random() < .5;
          return R(a / g, "", { text: `Maşının tavanından sapla kiçik oyuncaq asılıb. Maşın ${F(a)} m/s² təcillə ${dec ? "tormozlayır" : "sürətlənir"}. Sap şaquldan α bucağı qədər meyl edir. tg α = ?`,
            solution: `Sapın üfüqi hissəsi ma, şaquli hissəsi mg verir: tg α = a/g = ${F(a)}/10 = ${F(a / g)}. Sap ${dec ? "irəli" : "geri"} meyl edir.` });
        }
        if (kind === "a") {
          const opt = pick([["45°", 1], ["tg α = 3/4", 0.75], ["tg α = 1/2", 0.5], ["tg α = 0,2", 0.2], ["tg α = 1/4", 0.25], ["tg α = 0,3", 0.3]]);
          return R(g * opt[1], "m/s²", { text: `Vaqonun tavanından asılmış sap vaqon sürətlənəndə şaquldan meyl edib (${opt[0] === "45°" ? "α = 45°" : opt[0]}). Vaqonun təcili nə qədərdir?`,
            solution: `a = g·tg α = 10·${F(opt[1])} = ${F(g * opt[1])} m/s².` });
        }
        if (kind === "T") {
          const m = pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 2]);
          if (Math.random() < .3) {
            const c = Math.round(m * 10 * 1000) / 1000;
            return { answer: m * 10 * Math.SQRT2, show: (c === 1 ? "" : F(c)) + "√2", unit: "N", tol: m * 10 * Math.SQRT2 * 0.005,
              text: `Maşının tavanından sapla ${F(m)} kq yük asılıb. Maşın 10 m/s² təcillə sürətlənir. Sapın gərilmə qüvvəsi nə qədərdir? (Cavabı k√2 şəklində yaz.)`,
              solution: `T = m√(g² + a²) = ${F(m)}·√(100 + 100) = ${F(m)}·10√2 = ${c === 1 ? "" : F(c)}√2 N (≈ ${F(+(c * Math.SQRT2).toFixed(2))} N). Sap 45° meyl edir.` };
          }
          const [a, s] = pick(TRI), T = m * s;
          return R(T, "N", { text: `Vaqonun tavanından sapla ${F(m)} kq yük asılıb. Vaqon ${F(a)} m/s² təcillə sürətlənir. Sapın gərilmə qüvvəsi nə qədərdir?`,
            solution: `Sap həm mg-ni, həm ma-nı verir, bunlar perpendikulyardır: T = m√(g² + a²) = ${F(m)}·√(100 + ${F(a * a)}) = ${F(m)}·${F(s)} = ${F(T)} N.` });
        }
        let L, a, dh; do { L = pick([0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]); a = pick([0.5, 1, 1.5, 2, 2.5, 3]); dh = L * a / g; } while (!nice(dh, 3));
        return R(dh, "m", { text: `Uzunluğu ${F(L)} m olan akvarium su ilə doludur, maşınla aparılır. Maşın ${F(a)} m/s² təcillə sürətlənəndə su səthi əyilir. Akvariumun arxa və ön divarında suyun hündürlükləri fərqi nə qədərdir?`,
          solution: `Su səthi effektiv ağırlığa (g və geriyə a) perpendikulyar olur: tg α = a/g = ${F(a / g)}. Hündürlüklər fərqi Δh = L·tg α = ${F(L)}·${F(a / g)} = ${F(dh)} m (arxada su yüksəkdir).` });
      } },
    { id: "yuklenme", ad: "Əlavə yüklənmə, çəkisizlik", izah: "Əlavə yüklənmə n = P/(mg) = (g + a)/g. Sərbəst düşmədə P = 0 — çəkisizlik. Qabarıq körpünün təpəsində P = m(g − v²/R).",
      gen() {
        const kind = pick(["n", "a", "P", "kopru", "ceki0", "yelleck", "serbest"]);
        if (kind === "n") {
          const a = pick([5, 10, 15, 20, 25, 30, 40, 50]);
          return R((g + a) / g, "", { text: `Raket yerdən ${a} m/s² təcillə şaquli qalxır. Astronavtın əlavə yüklənməsi n = P/(mg) neçədir?`,
            solution: `Təcil yuxarıdır: P = m(g + a). n = (g + a)/g = ${g + a}/10 = ${F((g + a) / g)}.` });
        }
        if (kind === "a") {
          const n = pick([1.5, 2, 2.5, 3, 4, 5, 6, 8]);
          return R((n - 1) * g, "m/s²", { text: `Təyyarəçi şaquli qalxanda ${F(n)} qat əlavə yüklənmə hiss edir (n = ${F(n)}). Təyyarənin təcili nə qədərdir?`,
            solution: `n = (g + a)/g → a = (n − 1)·g = ${F(n - 1)}·10 = ${F((n - 1) * g)} m/s².` });
        }
        if (kind === "P") {
          const m = rnd(55, 90), n = pick([2, 3, 4, 5, 6]);
          return R(n * m * g, "N", { text: `Kütləsi ${m} kq olan astronavt startda n = ${n} əlavə yüklənmə yaşayır. Onun kresloya təzyiq qüvvəsi (çəkisi) nə qədərdir?`,
            solution: `P = n·mg = ${n}·${m * g} = ${n * m * g} N.` });
        }
        if (kind === "kopru") {
          let m, v, R0, P; do { m = pick([800, 1000, 1200, 1500, 2000]); v = pick([5, 10, 15, 20]); R0 = pick([40, 50, 80, 100, 125, 200]); P = m * (g - v * v / R0); } while (P <= 0 || !nice(v * v / R0, 2));
          return R(P, "N", { text: `${m} kq kütləli avtomobil radiusu ${R0} m olan qabarıq körpünün təpəsindən ${v} m/s sürətlə keçir. Avtomobil körpüyə hansı qüvvə ilə təsir edir?`,
            solution: `Təpədə mərkəzəqaçma təcili aşağıdır: a = v²/R = ${v * v}/${R0} = ${F(v * v / R0)} m/s². mg − N = ma → P = m(g − v²/R) = ${m}·${F(g - v * v / R0)} = ${F(P)} N.` });
        }
        if (kind === "ceki0") {
          const R0 = pick([10, 40, 90, 160, 250, 360, 490, 640, 1000]), v = Math.sqrt(g * R0);
          return R(v, "m/s", { text: `Qabarıq körpünün (və ya təpənin) əyrilik radiusu ${R0} m-dir. Avtomobil təpədən hansı sürətlə keçsə, sürücü tam çəkisizlik hiss edər?`,
            solution: `Çəkisizlik: P = m(g − v²/R) = 0 → v² = gR = ${g * R0} → v = ${F(v)} m/s.` });
        }
        if (kind === "yelleck") {
          let v, R0, n; do { v = pick([2, 3, 4, 5, 6, 8, 10]); R0 = pick([1, 2, 2.5, 4, 5, 8, 10]); n = 1 + v * v / (g * R0); } while (!nice(n, 2) || n > 6);
          return R(n, "", { text: `Uzunluğu ${F(R0)} m olan yelləncək ən aşağı nöqtədən ${v} m/s sürətlə keçir. Uşağın bu andakı əlavə yüklənməsi n neçədir?`,
            solution: `Aşağıda mərkəzəqaçma təcili yuxarıdır: a = v²/R = ${v * v}/${F(R0)} = ${F(v * v / R0)} m/s². n = (g + a)/g = ${F(g + v * v / R0)}/10 = ${F(n)}.` });
        }
        const m = rnd(30, 90);
        const what = pick([
          [`Liftin trosu qırılıb, lift sərbəst düşür (hava müqaviməti yoxdur). İçindəki ${m} kq-lıq adam tərəzinin üstündədir. Tərəzi neçə kq göstərir?`, "kq"],
          [`${m} kq-lıq paraşütçü təyyarədən tullanır, paraşütü hələ açılmayıb, hava müqavimətini nəzərə alma. Onun çəkisi neçə N-dur?`, "N"],
        ]);
        return R(0, what[1], { text: what[0], tol: 0.01, solution: `Sərbəst düşmədə a = g aşağı: P = m(g − g) = 0. Bu, çəkisizlikdir — ağırlıq qüvvəsi (${m * g} N) yox olmur, sadəcə dayaq və asqı daha sıxılmır.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .55) {
          const m = rnd(40, 80), a = pick([1, 2, 2.5, 3, 4]), P = m * (g + a), Pw = m * (g - a);
          task = `Lift aşağı enir və ${F(a)} m/s² təcillə yavaşıyır. İçindəki tərəzidə ${m} kq-lıq adam durur. Tərəzi neçə kq göstərir?`;
          steps = [
            `Lift aşağı gedir, amma yavaşıyır → təcil yuxarıdır.`,
            `N − mg = ma → N = m(g + a) = ${m}·${F(g + a)} = ${F(P)} N.`,
            `Tərəzi N/g = ${F(P / g)} kq göstərir.`,
          ];
          if (bad === 0) steps = [`Lift aşağı gedir → təcil aşağıdır.`, `mg − N = ma → N = m(g − a) = ${m}·${F(g - a)} = ${F(Pw)} N.`, `Tərəzi N/g = ${F(Pw / g)} kq göstərir.`];
          if (bad === 1) { steps[1] = `N − mg = ma → N = m(g − a) = ${m}·${F(g - a)} = ${F(Pw)} N.`; steps[2] = `Tərəzi N/g = ${F(Pw / g)} kq göstərir.`; }
          if (bad === 2) steps[2] = `Tərəzi ${F(P)} kq göstərir.`;
          why = [`1-ci addım: təcilin istiqaməti sürətin dəyişməsinə görə tapılır. Aşağı gedən sürət azalırsa, təcil yuxarıdır. Düz cavab: ${F(P / g)} kq.`,
            `2-ci addım: N − mg = ma-dan N = m(g + a) alınır. Düz cavab: ${F(P / g)} kq.`,
            `3-cü addım: ${F(P)} N qüvvədir; tərəzi bunu g-yə bölür: ${F(P / g)} kq.`][bad];
        } else {
          const m = pick([0.2, 0.4, 0.5, 0.8, 1, 2]), [a, s] = pick(TRI);
          task = `Vaqonun tavanından sapla ${F(m)} kq yük asılıb, vaqon ${F(a)} m/s² təcillə sürətlənir. Sapın gərilməsi nə qədərdir?`;
          steps = [
            `Sapın şaquli hissəsi mg = ${F(m * g)} N, üfüqi hissəsi ma = ${F(m * a)} N-dur.`,
            `Bu iki hissə perpendikulyardır: T = √((mg)² + (ma)²).`,
            `T = ${F(m)}·√(100 + ${F(a * a)}) = ${F(m)}·${F(s)} = ${F(m * s)} N.`,
          ];
          if (bad === 0) { steps[0] = `Sapın şaquli hissəsi mg + ma = ${F(m * (g + a))} N, üfüqi hissəsi isə yoxdur.`; steps[1] = `Deməli sap şaquldur: T = m(g + a).`; steps[2] = `T = ${F(m)}·${F(g + a)} = ${F(m * (g + a))} N.`; }
          if (bad === 1) { steps[1] = `Gərilmə hissələrin cəmidir: T = mg + ma.`; steps[2] = `T = ${F(m * g)} + ${F(m * a)} = ${F(m * (g + a))} N.`; }
          if (bad === 2) steps[2] = `T = √(100 + ${F(a * a)}) = ${F(s)} N.`;
          why = [`1-ci addım: təcil üfüqidir, ona görə ma üfüqi hissədir, mg-yə əlavə olunmur. Düz cavab: ${F(m * s)} N.`,
            `2-ci addım: perpendikulyar hissələr Pifaqor teoremi ilə toplanır, adi cəmlə yox. Düz cavab: ${F(m * s)} N.`,
            `3-cü addım: kütlə ${F(m)} kq unudulub. T = ${F(m)}·${F(s)} = ${F(m * s)} N.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Göydələn lifti, raket, avtobus, attraksion — eyni qayda: təcilin istiqaməti, sonra P = m(g ± a).",
      gen() {
        const kind = pick(["fikret", "raket", "avtobus", "tepe"]);
        if (kind === "fikret") {
          const a = pick([0.5, 1, 1.5, 2, 2.5, 3]), up = Math.random() < .5, M = 46 * (g + (up ? a : -a)) / g;
          return R(a, "m/s²", { text: `Fikrətin kütləsi 46 kq-dır. O, göydələnin liftində tərəzinin üstündə durur. Lift tərpənən kimi tərəzi ${F(M)} kq göstərir. Liftin təcilinin modulu nə qədərdir?`,
            solution: `Çəki P = ${F(M)}·10 = ${F(M * g)} N, mg = 460 N. ${up ? "P > mg → təcil yuxarıdır (lift yuxarı sürətlənir)" : "P < mg → təcil aşağıdır (lift aşağı sürətlənir)"}: a = |P − mg|/m = ${F(Math.abs(M * g - 460))}/46 = ${F(a)} m/s².` });
        }
        if (kind === "raket") {
          const m = rnd(60, 85), a = pick([20, 25, 30, 40]);
          return R(m * (g + a), "N", { text: `Raket startda ${a} m/s² təcillə şaquli qalxır. ${m} kq-lıq astronavt kresloya hansı qüvvə ilə təsir edir?`,
            solution: `Təcil yuxarıdır: P = m(g + a) = ${m}·${g + a} = ${m * (g + a)} N — adi çəkidən ${F((g + a) / g)} dəfə çox (n = ${F((g + a) / g)}).` });
        }
        if (kind === "avtobus") {
          const t = pick([0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5]);
          return R(t * g, "m/s²", { text: `Avtobusun tutacağından asılmış çanta qayışı avtobus sürətlənəndə geri meyl edir, tg α = ${F(t)}. Avtobusun təcili nə qədərdir?`,
            solution: `tg α = a/g → a = g·tg α = 10·${F(t)} = ${F(t * g)} m/s².` });
        }
        const R0 = pick([10, 22.5, 40, 62.5, 90, 160]), v = Math.sqrt(g * R0);
        return R(v, "m/s", { text: `Attraksionda vaqoncuq radiusu ${F(R0)} m olan qövs şəkilli təpənin üstündən keçir. Hansı sürətdə sərnişinlər təpədə çəkisizlik hiss edər?`,
          solution: `Təpədə P = m(g − v²/R) = 0 → v = √(gR) = √${F(g * R0)} = ${F(v)} m/s.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-qeyri-inersial", title: "Qeyri-inersial sistemlər", fenn: "fizika", link: "dersler/fiz-qeyri-inersial.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: N, kq, m/s²). tg α, μ və n vahidsizdir. Onluq kəsr: 0,25. g = 10 m/s².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["lift", "lift", "terezi", "terezi", "etalet", "mayatnik", "mayatnik", "yuklenme", "yuklenme", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-qeyri-inersial.html")) b.push("dersler/fiz-qeyri-inersial.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
