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
            solution: `Təpədə mərkəzəyönlü təcili aşağıdır: a = v²/R = ${v * v}/${R0} = ${F(v * v / R0)} m/s². mg − N = ma → P = m(g − v²/R) = ${m}·${F(g - v * v / R0)} = ${F(P)} N.` });
        }
        if (kind === "ceki0") {
          const R0 = pick([10, 40, 90, 160, 250, 360, 490, 640, 1000]), v = Math.sqrt(g * R0);
          return R(v, "m/s", { text: `Qabarıq körpünün (və ya təpənin) əyrilik radiusu ${R0} m-dir. Avtomobil təpədən hansı sürətlə keçsə, sürücü tam çəkisizlik hiss edər?`,
            solution: `Çəkisizlik: P = m(g − v²/R) = 0 → v² = gR = ${g * R0} → v = ${F(v)} m/s.` });
        }
        if (kind === "yelleck") {
          let v, R0, n; do { v = pick([2, 3, 4, 5, 6, 8, 10]); R0 = pick([1, 2, 2.5, 4, 5, 8, 10]); n = 1 + v * v / (g * R0); } while (!nice(n, 2) || n > 6);
          return R(n, "", { text: `Uzunluğu ${F(R0)} m olan yelləncək ən aşağı nöqtədən ${v} m/s sürətlə keçir. Uşağın bu andakı əlavə yüklənməsi n neçədir?`,
            solution: `Aşağıda mərkəzəyönlü təcili yuxarıdır: a = v²/R = ${v * v}/${F(R0)} = ${F(v * v / R0)} m/s². n = (g + a)/g = ${F(g + v * v / R0)}/10 = ${F(n)}.` });
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
          const m = pick([40, 45, 50, 55]), a = pick([0.5, 1, 1.5, 2, 2.5, 3]), up = Math.random() < .5, M = m * (g + (up ? a : -a)) / g;
          return R(a, "m/s²", { text: `Elvinin kütləsi ${m} kq-dır. O, göydələnin liftində tərəzinin üstündə durur. Lift tərpənən kimi tərəzi ${F(M)} kq göstərir. Liftin təcilinin modulu nə qədərdir?`,
            solution: `Çəki P = ${F(M)}·10 = ${F(M * g)} N, mg = ${m * g} N. ${up ? "P > mg → təcil yuxarıdır (lift yuxarı sürətlənir)" : "P < mg → təcil aşağıdır (lift aşağı sürətlənir)"}: a = |P − mg|/m = ${F(Math.abs(M * g - m * g))}/${m} = ${F(a)} m/s².` });
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

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a figure, several steps;
  // the wrong options are the answers of typical mistakes. Questions 1, 2, 4, 5, 6, 8 and 10 also use an earlier topic
  // (kinematics, Hooke, incline with friction, Archimedes, circular motion, Newton's laws, free fall).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  // svg:begin
  const INK = "var(--ink,#17171a)", ACC = "var(--accent,#a32d2d)", MUT = "var(--muted,#6b6b73)", PAP = "var(--paper,#fff)", SOFT = "var(--accent-soft,#f3d9d9)", WAT = "rgba(12,68,124,.18)";
  const f1 = n => +(+n).toFixed(1);
  const DASH = ` stroke-dasharray="4 3"`, MK = ` marker-end="url(#qi-ar)"`, MK2 = ` marker-start="url(#qi-ar)" marker-end="url(#qi-ar)"`;
  const ln = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const ar = (x1, y1, x2, y2, c = ACC, w = 2.5) => ln(x1, y1, x2, y2, c, w, MK);
  const pl = (pts, c = INK, w = 2) => `<polyline points="${pts.map(p => f1(p[0]) + "," + f1(p[1])).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const tx = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const rc = (x, y, w, h, fill = "none", c = INK, sw = 2, ex = "") => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}" stroke="${c}" stroke-width="${sw}"${ex}/>`;
  const ci = (x, y, r, fill = PAP, c = INK, sw = 2) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${fill}" stroke="${c}" stroke-width="${sw}"/>`;
  const svg = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" class="oy-svg" role="img" aria-label="${aria}"><defs><marker id="qi-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  const person = (cx, fy) => ci(cx, fy - 55, 8, "none") + ln(cx, fy - 47, cx, fy - 22) + ln(cx, fy - 40, cx - 12, fy - 26) + ln(cx, fy - 40, cx + 12, fy - 26) + ln(cx, fy - 22, cx - 8, fy) + ln(cx, fy - 22, cx + 8, fy);
  // lift cabin (floor at y = 187); o.v / o.a: +1 up, −1 down (arrows outside the cabin)
  const lift = (inner, o, aria) => {
    const arr = (x, d, c, lab) => d ? ar(x, d > 0 ? 135 : 85, x, d > 0 ? 85 : 135, c) + tx(x, 76, lab) : "";
    return svg(260, 200, ln(130, 3, 130, 22, MUT) + rc(55, 22, 150, 165) + inner + arr(28, o.v, INK, "v") + arr(232, o.a, ACC, "a"), aria);
  };
  const spring = (x, y1, y2, n = 7, amp = 10) => { const pts = [[x, y1], [x, y1 + 8]], d = (y2 - y1 - 16) / n; for (let i = 0; i < n; i++) pts.push([x + (i % 2 ? amp : -amp), y1 + 8 + (i + .5) * d]); pts.push([x, y2 - 8], [x, y2]); return pl(pts); };
  // Q1: the cabin before (dashed) and after covering the height h
  const figLiftH = up => { const x = 60, bw = 90, bh = 80, yS = up ? 110 : 10, yE = up ? 10 : 110, fS = yS + bh, fE = yE + bh;
    return svg(260, 200, rc(x, yS, bw, bh, "none", MUT, 1.5, DASH) + tx(x - 6, yS + 44, "t = 0", "end", MUT, 12) + rc(x, yE, bw, bh) + tx(x - 6, yE + 44, "t", "end", INK, 12) + person(x + bw / 2, fE - 2)
      + ln(x + bw, fS, 198, fS, MUT, 1, DASH) + ln(x + bw, fE, 198, fE, MUT, 1, DASH) + ln(190, fS, 190, fE, INK, 1.8, MK) + tx(200, (fS + fE) / 2 + 4, "h", "start"),
      "Lift sükunətdən " + (up ? "yuxarı" : "aşağı") + " tərpənib h hündürlüyü qədər yol gedir"); };
  // Q2: spring with a load in the cabin; x is the elongation
  const figSpring = () => lift(spring(130, 22, 96) + rc(112, 96, 36, 28, SOFT) + tx(130, 115, "m") + tx(152, 40, "k", "start") + ln(122, 66, 182, 66, MUT, 1, DASH) + ln(150, 96, 182, 96, MUT, 1, DASH) + ln(174, 66, 174, 96, INK, 1.8, MK2) + tx(182, 85, "x", "start"), {},
    "Liftin tavanından yaya asılmış yük; x yayın deformasiyasız uzunluğuna (qırıq xətt) nəzərən uzanmasıdır");
  // Q3: car; the ball on a string hangs tilted: dir = +1 accelerating to the right (string tilts back), −1 braking (tilts forward)
  const figSap = dir => { const L = 70, bx = 130 - dir * L * .6, by = 40 + L * .8, ax = 130 - dir * 26 * .6, ay = 40 + 26 * .8;
    return svg(260, 190, `<path d="M40 140V40H185L220 85V140Z" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` + ci(80, 152, 11) + ci(180, 152, 11) + ln(20, 163, 240, 163, MUT)
      + ln(130, 40, 130, 118, MUT, 1.2, DASH) + ln(130, 40, bx, by) + ci(bx, by, 9, SOFT) + `<path d="M130 66A26 26 0 0 ${dir > 0 ? 1 : 0} ${f1(ax)} ${f1(ay)}" fill="none" stroke="${INK}" stroke-width="1.6"/>` + tx(130 - dir * 13, 81, "α", "middle", INK, 12)
      + (dir > 0 ? ar(100, 24, 150, 24) : ar(150, 24, 100, 24)) + tx(125, 14, "a"), "Vaqonun tavanından sapla asılmış kürə şaquldan α bucağı qədər meyl edib; a vaqonun təcilidir"); };
  // Q4: incline (sin α = 0,6) inside the cabin, a block on it
  const figInc = a => lift(`<path d="M65 187H195V89.5Z" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><g transform="translate(113 151) rotate(-36.87)">${rc(-15, -22, 30, 22, SOFT)}</g>` + tx(106.4, 146.6, "m", "middle", INK, 12)
    + `<path d="M93 187A28 28 0 0 0 87.4 170.2" fill="none" stroke="${INK}" stroke-width="1.6"/>` + tx(105, 179, "α", "middle", INK, 12), { a }, "Lift içində maili müstəvi və üstündə cisim; a liftin təcilidir");
  // Q5: a ball tied to the bottom of a vessel with water; the cabin accelerates
  const figWater = a => lift(rc(91, 128, 78, 58, WAT, "none", 0) + ln(91, 128, 169, 128, "var(--accent,#2c4a8a)", 1.5) + `<path d="M90 110V187H170V110" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` + ln(130, 163, 130, 186, INK, 1.5) + ci(130, 152, 11, SOFT)
    + tx(96, 146, "su", "start", "var(--accent,#2c4a8a)", 12) + tx(138, 180, "ip", "start", MUT, 11), { a }, "Liftdə su dolu qabın dibinə iplə bağlanmış şar; a liftin təcilidir");
  // Q6: top of a convex bridge
  const figBridge = () => svg(260, 175, `<path d="M20 128A230 230 0 0 1 240 128" fill="none" stroke="${INK}" stroke-width="5"/>` + rc(106, 78, 48, 14) + ci(118, 95, 5) + ci(142, 95, 5) + ar(165, 62, 205, 62, INK, 2) + tx(185, 54, "v")
    + ln(130, 106, 130, 152, MUT, 1.5, DASH + MK) + tx(138, 130, "R", "start") + tx(130, 168, "mərkəzə doğru", "middle", MUT, 11), "Qabarıq körpünün təpəsində avtomobil; R əyrilik radiusudur");
  // Q7: lorry with a box, braking
  const figLorry = () => svg(260, 150, rc(30, 70, 140, 24) + rc(80, 44, 36, 26, SOFT) + tx(98, 62, "m") + `<path d="M170 94V56H200L218 76V94" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>` + ci(60, 106, 12) + ci(190, 106, 12) + ln(15, 118, 245, 118, MUT)
    + ar(125, 28, 180, 28, INK, 2) + tx(152, 20, "v") + ar(200, 136, 150, 136) + tx(175, 131, "a", "middle", ACC) + tx(125, 143, "tormoz", "end", MUT, 11), "Yük maşınının kuzovunda qutu; maşın sağa gedir və tormozlayır");
  // Q8: Atwood machine on the ceiling of the cabin
  const figAtwood = a => lift(ln(130, 22, 130, 36, MUT) + ci(130, 50, 14) + ln(116, 50, 116, 118) + ln(144, 50, 144, 118) + rc(104, 118, 24, 24, SOFT) + tx(116, 134, "m₁", "middle", INK, 11) + rc(132, 118, 24, 30, SOFT) + tx(144, 137, "m₂", "middle", INK, 11), { a },
    "Liftin tavanından asılmış makaradan keçən ipin ucunda m₁ və m₂ yükləri; a liftin təcilidir");
  // Q9: speed–time graph of the lift (the modulus of the speed)
  const figVT = (v, t1, t2, t3) => { const x0 = 40, y0 = 160, yv = 50, X = t => x0 + t * 180 / t3;
    return svg(260, 190, ln(x0, y0, 250, y0) + ln(x0, y0, x0, 24) + tx(46, 18, "v, m/s", "start") + tx(252, 152, "t, s", "end")
      + ln(x0, yv, X(t1), yv, MUT, 1, DASH) + ln(X(t1), yv, X(t1), y0, MUT, 1, DASH) + ln(X(t2), yv, X(t2), y0, MUT, 1, DASH)
      + pl([[x0, y0], [X(t1), yv], [X(t2), yv], [X(t3), y0]], ACC, 2.5)
      + tx(X(t1), 176, t1, "middle", INK, 12) + tx(X(t2), 176, t2, "middle", INK, 12) + tx(X(t3), 176, t3, "middle", INK, 12) + tx(x0 - 6, yv + 4, v, "end", INK, 12) + tx(x0 - 6, y0 + 14, "0", "end", MUT, 11),
      "Liftin sürətinin modulunun zamandan asılılıq qrafiki: sürət 0-dan " + v + " m/s-ə qədər artır, sabit qalır, sonra 0-a enir"); };
  // Q10: a bolt comes off the ceiling of the cabin
  const figBolt = a => lift(ci(105, 33, 5, SOFT) + tx(97, 37, "bolt", "end", INK, 12) + ln(105, 42, 105, 170, MUT, 1.5, DASH + MK) + ln(172, 24, 172, 185, INK, 1.8, MK2) + tx(180, 108, "h", "start"), { a },
    "Liftin tavanından bolt qopur; h liftin hündürlüyüdür, a liftin təcilidir");
  // svg:end
  const E = s => svgEl(s);
  const SP = [[1, 2], [1, 3], [2, 3], [2, 6], [3, 5], [1, 4]];
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. a lift starts from rest: a from the distance covered, then the weight (kinematics + non-inertial)
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const a = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), t = pick([2, 3, 4, 5, 6]), m = rnd(8, 18) * 5, up = Math.random() < .5, s = up ? 1 : -1, h = a * t * t / 2;
      if (!nice(h, 1)) return null;
      const P = m * (g + s * a), w = [m * (g - s * a), m * g, m * (g + s * h / t / t), m * (g + s * h / t)]; if (![P, ...w].every(x => ok2(x))) return null;
      return mc(ae(P, w, U_("N")), { svg: E(figLiftH(up)), text: `Lift sükunətdən ${up ? "yuxarı" : "aşağı"} tərpənir və sabit təcillə ${t} s-də ${F(h)} m yol gedir (şəkil). Liftdəki kütləsi ${m} kq olan adamın döşəməyə təzyiq qüvvəsi (çəkisi) nə qədərdir? (g = 10 m/s².)`,
        solution: `Sükunətdən bərabərtəcilli hərəkət: h = at²/2 → a = 2h/t² = 2·${F(h)}/${t}² = ${F(a)} m/s². Təcil ${up ? "yuxarıdır (sürət yuxarı və artır)" : "aşağıdır (sürət aşağı və artır)"}: P = m(g ${up ? "+" : "−"} a) = ${m}·${F(g + s * a)} = ${F(P)} N. Tələlər: 2-ni unutmaq (a = h/t² = ${F(h / t / t)} → ${F(w[2])} N), h/t-ni təcil götürmək (${F(w[3])} N), işarəni səhv seçmək (${F(w[0])} N), P = mg (${m * g} N).` });
    }) },
    // 2. spring in a lift: acceleration from two elongations (Hooke + non-inertial)
    { tip: "qapali", birlesik: "fiz-huk", gen: () => again(() => {
      const k0 = pick([4, 5, 8, 10, 12, 20]), j = k0 + rnd(-Math.floor(k0 / 2), Math.floor(k0 / 2)); if (j === k0) return null;
      const up = j > k0, a = g * Math.abs(j - k0) / k0, w2 = g * j / k0, w3 = g * Math.abs(j - k0) / j;
      const o = { v: a, up }, w = [{ v: a, up: !up }, { v: w2, up }, { v: w3, up }, { v: w2, up: !up }]; if (![a, w2, w3].every(x => ok2(x, 1))) return null;
      const fmt = x => F(+x.v.toFixed(4)) + " m/s², " + (x.up ? "yuxarı" : "aşağı");
      return mc(ae(o, w, fmt), { svg: E(figSpring()), text: `Liftin tavanından yaya kütləsi m olan yük asılıb (şəkil). Lift sükunətdə olanda yayın uzanması ${k0} sm-dir. Lift təcillə hərəkət edəndə yük yaya görə sükunətdə qalır və uzanma ${j} sm olur. Liftin təcilinin modulu və istiqaməti necədir? (g = 10 m/s².)`,
        solution: `Sükunətdə: kx₀ = mg, x₀ = ${k0} sm. Hərəkətdə x₁ = ${j} sm: ${up ? "kx₁ − mg = ma (təcil yuxarı, çünki yay daha çox dartılıb)" : "mg − kx₁ = ma (təcil aşağı, çünki yay az dartılıb)"}. İkisini bölək: x₁/x₀ = (g ${up ? "+" : "−"} a)/g → a = g·|x₁ − x₀|/x₀ = 10·${Math.abs(j - k0)}/${k0} = ${F(a)} m/s², ${up ? "yuxarı" : "aşağı"}. Tələlər: g·x₁/x₀ = ${F(w2)} (mg-ni çıxmamaq), x₀ əvəzinə x₁-ə bölmək (${F(w3)}), istiqaməti səhv seçmək. Lift yuxarı da, aşağı da gedə bilər — yalnız təcilin istiqaməti təyin olunur.` });
    }) },
    // 3. ball on a string in a car: T = mg/cos α
    { tip: "qapali", gen: () => again(() => {
      const m = pick([0.2, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]), dir = Math.random() < .5 ? 1 : -1, T = m * g / .8;
      const w = [m * g, m * 7.5, m * (g + 7.5), m * g * .8]; if (![T, ...w].every(x => ok2(x))) return null;
      return mc(ae(T, w, U_("N")), { svg: E(figSap(dir)), text: `Vaqonun tavanından sapla kütləsi ${F(m)} kq olan kürə asılıb (şəkil). Vaqon sağa gedərək ${dir > 0 ? "sürətlənir" : "tormozlayır"}; kürə vaqona görə sükunətdədir və sap şaquldan α bucağı qədər meyl edib: sin α = 0,6, cos α = 0,8. Sapın gərilmə qüvvəsi nə qədərdir? (g = 10 m/s².)`,
        solution: `Vaqonla bağlı sistemdə kürəyə mg (aşağı), T (sap boyu) və ətalət qüvvəsi ma (təcilin əksinə) təsir edir. Şaquli: T·cos α = mg → T = mg/cos α = ${F(m * g)}/0,8 = ${F(T)} N. (Üfüqi: T·sin α = ma → a = g·tg α = 7,5 m/s², ma = ${F(m * 7.5)} N.) Sap ${dir > 0 ? "geri" : "irəli"} meyl edir. Tələlər: sapı şaquli sanmaq (T = mg = ${F(m * g)} N), yalnız ma (${F(m * 7.5)} N), cəm m(g + a) = ${F(m * (g + 7.5))} N (perpendikulyar hissələr toplanmır), T = mg·cos α = ${F(m * g * .8)} N (cos α-ya vurmaq yox, bölmək lazımdır).` });
    }) },
    // 4. incline inside an accelerating lift (friction on an incline + non-inertial)
    { tip: "qapali", birlesik: "fiz-surtunme-maili", gen: () => again(() => {
      const mu = pick([0.25, 0.5]), up = Math.random() < .5, s = up ? 1 : -1, a = pick(up ? [2, 2.5, 4, 5, 10] : [2, 2.5, 4]), ge = g + s * a, gf = g - s * a, k = .6 - mu * .8;
      const A = ge * k, w = [g * k, gf * k, ge * .6, ge * (.6 - mu)]; if (![A, ...w].every(x => ok2(x))) return null;
      return mc(ae(A, w, U_("m/s²")), { svg: E(figInc(s)), text: `Liftin içində maili müstəvi qoyulub (sin α = 0,6, cos α = 0,8) və cisim onun üzərində maili müstəvi boyunca aşağı sürüşür; sürtünmə əmsalı μ = ${F(mu)}. Liftin təcili ${F(a)} m/s², ${up ? "yuxarı" : "aşağı"} yönəlib. Cismin maili müstəviyə nisbətən təcili nə qədərdir? (g = 10 m/s².)`,
        solution: `Liftlə bağlı sistemdə "yeni g" olur: g_ef = g ${up ? "+" : "−"} a = ${F(ge)} m/s² (təcil ${up ? "yuxarı" : "aşağı"}). Maili müstəvidə a' = g_ef(sin α − μ cos α) = ${F(ge)}·(0,6 − ${F(mu)}·0,8) = ${F(ge)}·${F(+k.toFixed(4))} = ${F(A)} m/s². Tələlər: lifti unutmaq (g = 10 ilə: ${F(w[0])}), işarəni səhv seçmək (${F(w[1])}), sürtünməni unutmaq (${F(w[2])}), sürtünmədə cos α-nı unutmaq (${F(w[3])}).` });
    }) },
    // 5. ball tied in water in a lift: buoyancy with g_ef (Archimedes + non-inertial)
    { tip: "qapali", birlesik: "fiz-arximed", gen: () => again(() => {
      const V = pick([200, 250, 400, 500, 800, 1000]), rho = pick([200, 400, 500, 600, 800]), up = Math.random() < .5, s = up ? 1 : -1, a = pick(up ? [2, 2.5, 5, 10] : [2, 2.5, 4, 5]), ge = g + s * a, Vm = V / 1e6;
      const T = Vm * (1000 - rho) * ge, w = [Vm * (1000 - rho) * g, Vm * (1000 - rho) * (g - s * a), Vm * 1000 * ge, Vm * rho * ge]; if (![T, ...w].every(x => ok2(x))) return null;
      return mc(ae(T, w, U_("N")), { svg: E(figWater(s)), text: `Liftdəki su dolu qabın dibinə iplə sıxlığı ${rho} kq/m³, həcmi ${V} sm³ olan şar bağlanıb; şar tam suyun içindədir (şəkil). Suyun sıxlığı 1000 kq/m³-dir. Liftin təcili ${F(a)} m/s², ${up ? "yuxarı" : "aşağı"} yönəlib. Şar suya görə sükunətdədir. İpin gərilmə qüvvəsi nə qədərdir? (g = 10 m/s².)`,
        solution: `Liftdə g əvəzinə g_ef = g ${up ? "+" : "−"} a = ${F(ge)} m/s² götürülür (Arximed qüvvəsi və ağırlıqla ətalət qüvvəsinin nəticəsi bu g_ef ilə hesablanır). Şar suyun içində sükunətdədir: yuxarıya Arximed F_A = ρ_su·V·g_ef = 1000·${F(Vm)}·${F(ge)} = ${F(Vm * 1000 * ge)} N, aşağıya şarın ağırlıq və ətalət qüvvələrinin nəticəsi ρ·V·g_ef = ${F(rho)}·${F(Vm)}·${F(ge)} = ${F(Vm * rho * ge)} N və ip qüvvəsi T. T = F_A − ρVg_ef = ${F(Vm * (1000 - rho))}·${F(ge)} = ${F(T)} N. Tələlər: g = 10 ilə (${F(w[0])} N), işarəni səhv seçmək (${F(w[1])} N), yalnız Arximed qüvvəsini götürmək (${F(w[2])} N), yalnız şarın ρVg_ef qüvvəsini götürmək (${F(w[3])} N).` });
    }) },
    // 6. convex bridge: weight of the car (circular motion + non-inertial)
    { tip: "qapali", birlesik: "fiz-cevre-herekat", gen: () => again(() => {
      const m = pick([800, 1000, 1200, 1500, 2000]), vk = pick([36, 54, 72, 90, 108]), R0 = pick([50, 80, 100, 125, 200, 250, 400, 500]), v = vk / 3.6, ac = v * v / R0;
      if (ac >= g || !nice(ac, 2)) return null;
      const P = m * (g - ac), w = [m * (g + ac), m * g, m * ac, m * (g - v / R0)]; if (![P, ...w].every(x => ok2(x))) return null;
      return mc(ae(P, w, U_("N")), { svg: E(figBridge()), text: `${m} kq kütləli avtomobil əyrilik radiusu ${R0} m olan qabarıq körpünün təpəsindən ${vk} km/saat sürətlə keçir (şəkil). Avtomobilin körpüyə normal təzyiq qüvvəsi nə qədərdir? (g = 10 m/s².)`,
        solution: `${vk} km/saat = ${vk}/3,6 = ${F(v)} m/s. Təpədə mərkəzəyönlü təcil aşağıdır: a = v²/R = ${F(v * v)}/${R0} = ${F(ac)} m/s². mg − N = ma → N = m(g − v²/R) = ${m}·${F(g - ac)} = ${F(P)} N. Newtonun III qanununa görə körpüyə normal təzyiq qüvvəsi N-ə bərabərdir: ${F(P)} N (mg = ${m * g} N-dan azdır). Tələlər: çökək körpü düsturu m(g + a) (${F(w[0])} N), sürəti nəzərə almamaq (${m * g} N), yalnız ma (${F(w[2])} N), v-ni kvadrata yüksəltməmək (${F(w[3])} N).` });
    }) },
    // 7. a box on a lorry: the shortest braking distance without sliding
    { tip: "qapali", gen: () => again(() => {
      const mu = pick([0.2, 0.25, 0.4, 0.5, 0.6]), vk = pick([36, 54, 72, 90, 108]), v = vk / 3.6, s = v * v / (2 * mu * g);
      const w = [v * v / (2 * g), v * v / (mu * g), mu * v * v / (2 * g), vk * vk / (2 * mu * g)]; if (![s, ...w].every(x => ok2(x))) return null;
      return mc(ae(s, w, U_("m")), { svg: E(figLorry()), text: `Yük maşınının kuzovundakı qutu ilə kuzov arasında sürtünmə əmsalı μ = ${F(mu)}. Maşın ${vk} km/saat sürətlə gedir və bərabəryavaşıyaraq tormozlayır (şəkil). Qutu kuzova görə sürüşməsin deyə maşın ən qısa hansı yolda dayana bilər? (g = 10 m/s².)`,
        solution: `${vk} km/saat = ${F(v)} m/s. Maşınla bağlı sistemdə qutuya irəli F_in = ma təsir edir, onu sürtünmə tarazlayır: ma ≤ μmg → a ≤ μg = ${F(mu)}·10 = ${F(mu * g)} m/s². Ən qısa yol maksimum təcilə uyğundur: s = v²/(2a) = ${F(v * v)}/(2·${F(mu * g)}) = ${F(s)} m. Tələlər: μ-nü unutmaq (${F(w[0])} m), 2-yə bölməyi unutmaq (${F(w[1])} m), μ-yə bölmək əvəzinə vurmaq (${F(w[2])} m), km/saatı çevirməmək (${F(w[3])} m).` });
    }) },
    // 8. Atwood machine hung in an accelerating lift (Newton's laws + non-inertial)
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const [m1, m2] = pick(SP), up = Math.random() < .5, s = up ? 1 : -1, a = pick(up ? [2, 2.5, 5, 10] : [2, 2.5, 5]), ge = g + s * a, M = m1 + m2, T = 2 * m1 * m2 * ge / M;
      const w = [2 * m1 * m2 * g / M, 2 * m1 * m2 * (g - s * a) / M, m2 * ge, m1 * ge]; if (![T, ...w].every(x => ok2(x))) return null;
      return mc(ae(T, w, U_("N")), { svg: E(figAtwood(s)), text: `Liftin tavanından ideal makara asılıb; makaradan keçirilmiş çəkisiz, uzanmayan ipin iki ucundan müvafiq olaraq ${m1} kq və ${m2} kq kütləli yüklər asılıb (şəkil). Liftin təcili ${F(a)} m/s², ${up ? "yuxarı" : "aşağı"} yönəlib. İpin gərilmə qüvvəsi nə qədərdir? (Sürtünmə yoxdur, g = 10 m/s².)`,
        solution: `Liftdə g_ef = g ${up ? "+" : "−"} a = ${F(ge)} m/s². Yüklər liftə nisbətən hərəkət edir: m₂g_ef − T = m₂a', T − m₁g_ef = m₁a'. a' = (m₂ − m₁)g_ef/(m₁ + m₂) = ${m2 - m1}·${F(ge)}/${M} = ${F((m2 - m1) * ge / M)} m/s². T = 2m₁m₂g_ef/(m₁ + m₂) = 2·${m1}·${m2}·${F(ge)}/${M} = ${F(T)} N. Tələlər: g = 10 ilə (${F(w[0])} N), işarəni səhv seçmək (${F(w[1])} N), ağır yükü liftə nəzərən sükunətdə qəbul etmək: T = m₂g_ef (${F(w[2])} N), yüngül yükü sükunətdə qəbul etmək: T = m₁g_ef (${F(w[3])} N).` });
    }) },
    // 9. speed–time graph of a lift: weight in the first or the last stage
    { tip: "qapali", minVariety: 10, gen: () => again(() => {
      const v = pick([2, 3, 4, 5, 6]), t1 = pick([2, 3, 4, 5]), tc = pick([3, 4, 5, 6]), td = pick([2, 3, 4, 5]), t2 = t1 + tc, t3 = t2 + td, m = rnd(8, 18) * 5, up = Math.random() < .5, first = Math.random() < .5;
      const dt = first ? t1 : td, a = v / dt, s = (first ? 1 : -1) * (up ? 1 : -1);
      const P = m * (g + s * a), w = [m * (g - s * a), m * g, m * (g + s * v / t3), m * a]; if (![P, ...w].every(x => ok2(x))) return null;
      return mc(ae(P, w, U_("N")), { svg: E(figVT(v, t1, t2, t3)), text: `Qrafikdə liftin sürətinin modulunun zamandan asılılığı verilib. Lift ${up ? "yuxarı qalxır" : "aşağı enir"}. Kütləsi ${m} kq olan adam liftdəki tərəzinin üstündə durur. ${first ? "Hərəkətin sürətlənən mərhələsində (qrafikin birinci hissəsi)" : "Liftin dayanmaq üçün yavaşıyan mərhələsində (qrafikin son hissəsi)"} adamın çəkisi nə qədərdir? (g = 10 m/s².)`,
        solution: `Qrafikdən: ${t1} s-də sürət 0-dan ${v} m/s-ə çatır; ${t1}–${t2} s arasında sabitdir; ${t2}–${t3} s-də ${v} m/s-dən 0-a düşür. ${first ? `Birinci mərhələ: a = ${v}/${t1} = ${F(a)} m/s²` : `Son mərhələ: a = ${v}/(${t3} − ${t2}) = ${v}/${td} = ${F(a)} m/s²`}. Lift ${up ? "yuxarı" : "aşağı"} gedir və ${first ? "sürəti artır" : "sürəti azalır"} → təcil ${s > 0 ? "yuxarıdır" : "aşağıdır"}: P = m(g ${s > 0 ? "+" : "−"} a) = ${m}·${F(g + s * a)} = ${F(P)} N. Tələlər: sürətin istiqaməti ilə təcili qarışdırmaq (${F(w[0])} N), sabit sürət kimi mg (${m * g} N), sürət dəyişməsini bütün hərəkət müddətinə bölmək (${v}/${t3}: ${F(w[2])} N), yalnız ma (${F(w[3])} N).` });
    }) },
    // 10. a bolt falls off the ceiling of a lift: the height from the fall time (free fall + non-inertial)
    { tip: "qapali", birlesik: "fiz-serbest-dusme", gen: () => again(() => {
      const up = Math.random() < .5, s = up ? 1 : -1, a = pick(up ? [2, 2.5, 5, 10] : [2, 2.5, 4, 5]), ge = g + s * a, t = pick([0.4, 0.5, 0.6, 0.8, 1, 1.2]), h = ge * t * t / 2;
      const w = [g * t * t / 2, (g - s * a) * t * t / 2, a * t * t / 2, ge * t * t]; if (h < 0.8 || h > 3.5 || ![h, ...w].every(x => ok2(x))) return null;
      return mc(ae(h, w, U_("m")), { svg: E(figBolt(s)), text: `Liftin tavanından bolt qopur (qopan anda bolt liftə görə sükunətdədir) və ${F(t)} s-dən sonra döşəməyə dəyir (şəkil). Liftin təcili ${F(a)} m/s², ${up ? "yuxarı" : "aşağı"} yönəlib. Liftin hündürlüyü nə qədərdir? (Hava müqaviməti yoxdur, g = 10 m/s².)`,
        solution: `Liftlə bağlı sistemdə bolt döşəməyə doğru g_ef = g ${up ? "+" : "−"} a = ${F(ge)} m/s² təcillə düşür (qopandan sonra bolt yalnız ağırlıq qüvvəsi ilə hərəkət edir, lift isə a təcili ilə gedir; liftə nisbətən fərq g ${up ? "+" : "−"} a olur). h = g_ef·t²/2 = ${F(ge)}·${F(t)}²/2 = ${F(h)} m. Tələlər: lifti unutmaq (${F(w[0])} m), işarəni səhv seçmək (${F(w[1])} m), yalnız a (${F(w[2])} m), yarını unutmaq: g_ef·t² (${F(w[3])} m).` });
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
      key: "fiz-qeyri-inersial", title: "Qeyri-inersial sistemlər", fenn: "fizika", link: "dersler/fiz-qeyri-inersial.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: N, kq, m/s²). tg α, μ və n vahidsizdir. Onluq kəsr: 0,25. g = 10 m/s².",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["lift", "lift", "terezi", "terezi", "etalet", "mayatnik", "mayatnik", "yuklenme", "yuklenme", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-qeyri-inersial.html")) b.push("dersler/fiz-qeyri-inersial.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
