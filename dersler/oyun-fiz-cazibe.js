// Fizika · Ümumdünya cazibə qanunu, Kepler qanunları, peyklər — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution, unit}.
// Conventions: g = 10 m/s² on Earth's surface, R_Yer = 6400 km, G = 6,67·10⁻¹¹ N·m²/kq², first cosmic velocity 8 km/s, T₀ = 84 dəq.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");          // 0.04 → "0,04"
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;        // v has at most d decimals
  const R = (v, unit, extra) => { v = +(+v).toFixed(6); return Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra); };
  const g = 10, RY = 6400;                                  // km
  const fmt = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const OFS = [1.25, 2, 2.5, 4, 5];                          // r/R values giving a nice g/f²
  const NS = [1.5625, 4, 6.25, 16, 25, 64, 100];            // r/R values with a nice 8/√n (a terminating decimal)

  // planets for the first cosmic velocity: g (m/s²), radius (km), v = √(gR) in km/s is a 2-decimal number
  const PL = [];
  for (const gp of [1.6, 2, 2.5, 3.6, 4, 5, 6.4, 8, 9, 10, 12.5, 16]) for (let r = 1000; r <= 20000; r += 100) { const v = Math.sqrt(gp * r / 1000); if (v >= 1 && Math.abs(v * 100 - Math.round(v * 100)) < 1e-9) PL.push([gp, r, Math.round(v * 100) / 100]); }

  const levels = [
    { id: "qanun", ad: "F = Gm₁m₂/r²", izah: "İki cisim arasındakı cazibə qüvvəsi kütlələrin hasilinə düz, məsafənin kvadratına tərs mütənasibdir. Məsafə n dəfə artsa, F n² dəfə azalır. G = 6,67·10⁻¹¹ N·m²/kq².",
      gen() {
        const kind = pick(["oran", "oran", "oran2", "mikro", "taraz", "taraz", "F2"]);
        if (kind === "oran") {
          const n = pick([2, 3, 4, 5, 10]);
          return R(n * n, "dəfə", { text: `İki cisim arasındakı məsafəni ${n} dəfə artırdılar (kütlələr dəyişmədi). Onların cazibə qüvvəsi neçə dəfə azalır?`,
            solution: `F ~ 1/r². Məsafə ${n} dəfə artsa, F ${n}² = ${n * n} dəfə azalır.` });
        }
        if (kind === "oran2") {
          let a, b, n, up, ratio; do { a = pick([1, 2, 3, 4]); b = pick([1, 2, 3, 4]); n = pick([2, 3, 4]); up = Math.random() < .5; ratio = a * b * (up ? 1 / (n * n) : n * n); } while (!nice(ratio, 3) || ratio === 1);
          return R(ratio, "dəfə", { text: `Birinci cismin kütləsi ${a} dəfə, ikincinin kütləsi ${b} dəfə artırılıb, cisimlərarası məsafə isə ${n} dəfə ${up ? "artırılıb" : "azaldılıb"}. Cazibə qüvvəsi yeni qiymətinin əvvəlkinə nisbəti (F₂/F₁) nə qədərdir?`,
            solution: `F ~ m₁m₂/r². F₂/F₁ = ${a}·${b}/${up ? "" : "(1/"}${n}${up ? "²" : ")²"} = ${a * b}${up ? "/" + n * n : "·" + n * n} = ${F(ratio)}.` });
        }
        if (kind === "mikro") {
          let m1, m2, r, X, Fm; do { m1 = pick([100, 200, 500, 1000, 2000, 5000]); m2 = pick([100, 200, 500, 1000, 2000, 5000]); r = pick([1, 2, 5, 10, 20]); X = m1 * m2 / (r * r); Fm = 6.67e-5 * X; } while (X < 1e3 || !nice(Fm, 3) || Fm > 1000);
          return R(Fm, "µN", { text: `Kütlələri ${m1} kq və ${m2} kq olan iki cisim bir-birindən ${r} m məsafədədir. Onların qarşılıqlı cazibə qüvvəsi neçə mikronyutondur? (G = 6,67·10⁻¹¹ N·m²/kq², 1 µN = 10⁻⁶ N)`,
            solution: `F = Gm₁m₂/r² = 6,67·10⁻¹¹·${m1}·${m2}/${r}² = 6,67·10⁻¹¹·${F(X)} = ${F(Fm)}·10⁻⁶ N = ${F(Fm)} µN.` });
        }
        if (kind === "taraz") {
          const k = pick([2, 3, 4, 5, 9]), u = pick([1000, 2000, 5000, 10000, 20000, 38400]), d = u * (k + 1), x = u;
          return R(x, "km", { text: `Kütlələri M və ${k * k}M olan iki cisim bir-birindən ${fmt(d)} km məsafədədir. Onların arasındakı düz xətt üzərində kiçik sınaq cisminə təsir edən cazibə qüvvələri bərabər olan nöqtə kütləsi kiçik olan cisimdən neçə km məsafədədir?`,
            solution: `Kiçik cisimdən x məsafədə: GM/x² = G·${k * k}M/(${fmt(d)} − x)². Kökaltı: (${fmt(d)} − x)/x = √${k * k} = ${k} → ${fmt(d)} = ${k + 1}x → x = ${fmt(x)} km.` });
        }
        let F1, r1, n, F2; do { F1 = pick([4, 9, 18, 36, 45, 72, 90, 144, 180, 360]); r1 = pick([1, 2, 3, 4, 6]); n = pick([2, 3, 4, 6]); F2 = F1 / (n * n); } while (!nice(F2, 3));
        return R(F2, "N", { text: `İki cismin ${r1} m məsafədə cazibə qüvvəsi ${F1} N-dur (şərti ədəd). Onları bir-birindən ${r1 * n} m məsafəyə uzaqlaşdırsaq, cazibə qüvvəsi nə qədər olar?`,
          solution: `Məsafə ${n} dəfə artdı → F ${n * n} dəfə azalır: ${F1}/${n * n} = ${F(F2)} N.` });
      } },
    { id: "g", ad: "Sərbəstdüşmə təcili g", izah: "Cisim planetin səthində: mg = GMm/R², yəni g = GM/R². Hündürlükdə: g_h = GM/(R + h)² = g·R²/(R + h)². Planet: g_p = g·(M/M_Y)/(R/R_Y)².",
      gen() {
        const kind = pick(["h", "h", "hrev", "planet", "planet", "dens", "agir"]);
        if (kind === "h") {
          const f = pick(OFS), H = (f - 1) * RY, gh = g / (f * f);
          return R(gh, "m/s²", { text: `Yerin radiusu ${RY} km, yer səthində g = 10 m/s²-dir. Yer səthindən ${fmt(H)} km hündürlükdə sərbəstdüşmə təcili nə qədərdir?`,
            solution: `Yerin mərkəzindən məsafə r = R + h = ${RY} + ${fmt(H)} = ${fmt(f * RY)} km = ${F(f)}R. g_h = g·(R/r)² = 10/${F(f)}² = ${F(gh)} m/s².` });
        }
        if (kind === "hrev") {
          const f = pick(OFS), H = (f - 1) * RY, gh = g / (f * f);
          return R(H, "km", { text: `Yerin radiusu ${RY} km, yer səthində g = 10 m/s²-dir. Yer səthindən nə qədər hündürlükdə sərbəstdüşmə təcili ${F(gh)} m/s² olur? Cavabı km ilə yaz.`,
            solution: `g/g_h = 10/${F(gh)} = ${F(f * f)} = (r/R)² → r = ${F(f)}R = ${fmt(f * RY)} km. h = r − R = ${fmt(f * RY)} − ${RY} = ${fmt(H)} km.` });
        }
        if (kind === "planet") {
          let a, b, gp; do { a = pick([0.1, 0.2, 0.5, 2, 4, 8, 9, 16, 25]); b = pick([0.25, 0.5, 2, 3, 4]); gp = g * a / (b * b); } while (!nice(gp, 3) || gp < 0.5 || gp > 80);
          return R(gp, "m/s²", { text: `Planetin kütləsi Yerin kütləsinin ${F(a)} mislidir, radiusu isə Yerin radiusunun ${F(b)} mislidir. Planetin səthində sərbəstdüşmə təcili nə qədərdir? (Yerdə g = 10 m/s²)`,
            solution: `g_p = g·(M_p/M_Y)/(R_p/R_Y)² = 10·${F(a)}/${F(b)}² = ${F(gp)} m/s².` });
        }
        if (kind === "dens") {
          let a, b, gp; do { a = pick([0.5, 2, 3, 4]); b = pick([0.2, 0.25, 0.5, 2, 3, 4]); gp = g * a * b; } while (!nice(gp, 3));
          return R(gp, "m/s²", { text: `Planetin orta sıxlığı Yerinkinin ${F(a)} misli, radiusu Yerin radiusunun ${F(b)} mislidir. Planetin səthində g nə qədərdir? (Planet kürədir, Yerdə g = 10 m/s²)`,
            solution: `M = ρ·(4/3)πR³, g = GM/R² = (4/3)πGρR. Deməli g ~ ρR: g_p = 10·${F(a)}·${F(b)} = ${F(gp)} m/s².` });
        }
        let a, b, gp, m; do { a = pick([0.1, 0.5, 2, 4, 8, 9]); b = pick([0.5, 2, 3, 4]); m = pick([20, 40, 50, 60, 75, 80]); gp = g * a / (b * b); } while (!nice(gp * m, 3) || gp * m > 5000);
        return R(gp * m, "N", { text: `Yerin səthində kütləsi ${m} kq olan cismin çəkisi ${m * g} N-dur. Kütləsi Yerin kütləsinin ${F(a)} misli, radiusu Yerin radiusunun ${F(b)} misli olan planetdə həmin cismin çəkisi nə qədər olar?`,
          solution: `g_p = 10·${F(a)}/${F(b)}² = ${F(gp)} m/s². Çəki P = mg_p = ${m}·${F(gp)} = ${F(gp * m)} N.` });
      } },
    { id: "v1", ad: "Birinci kosmik sürət", izah: "Dairəvi orbitdə cazibə qüvvəsi mərkəzəqaçma təcil verir: mg_r = mv²/r. Yer səthinə yaxın: v₁ = √(gR) = 8 km/s. Orbit radiusu r = nR olarsa, v = v₁/√n.",
      gen() {
        const kind = pick(["pl", "pl", "orb", "orb", "rev", "ratio", "a"]);
        if (kind === "pl") {
          const [gp, r, v] = pick(PL);
          return R(v, "km/s", { text: `Planetin radiusu ${fmt(r)} km, səthində sərbəstdüşmə təcili ${F(gp)} m/s²-dir. Planetin birinci kosmik sürəti neçə km/s-dir?`,
            solution: `v = √(gR) = √(${F(gp)}·${fmt(r * 1000)}) = √${fmt(gp * r * 1000)} = ${F(v * 1000)} m/s = ${F(v)} km/s.` });
        }
        if (kind === "orb") {
          const n = pick(NS), H = (n - 1) * RY, v = 8 / Math.sqrt(n);
          return R(v, "km/s", { text: `Peyk Yerin səthindən ${fmt(H)} km hündürlükdə dairəvi orbitdə hərəkət edir. Yerin radiusu ${RY} km, birinci kosmik sürət 8 km/s-dir. Peykin sürəti nə qədərdir?`,
            solution: `Orbit radiusu r = R + h = ${RY} + ${fmt(H)} = ${fmt(n * RY)} km = ${F(n)}R. v = v₁/√n = 8/√${F(n)} = 8/${F(Math.sqrt(n))} = ${F(v)} km/s.` });
        }
        if (kind === "rev") {
          const n = pick(NS.slice(1)), H = (n - 1) * RY, v = 8 / Math.sqrt(n);
          return R(H, "km", { text: `Dairəvi orbitdə hərəkət edən peykin sürəti ${F(v)} km/s-dir. Peyk Yerin səthindən nə qədər hündürlükdədir? (R_Yer = ${RY} km, birinci kosmik sürət 8 km/s.) Cavabı km ilə yaz.`,
            solution: `v = v₁/√n → √n = 8/${F(v)} = ${F(Math.sqrt(n))} → n = ${F(n)}. r = nR = ${fmt(n * RY)} km, h = r − R = ${fmt(H)} km.` });
        }
        if (kind === "ratio") {
          const k = pick([2, 3, 4, 5, 10]), v1 = pick([k * 1, k * 2, k * 3, k * 4, 6 * k].filter(x => x <= 80));
          const v2 = v1 / k;
          return R(v2, "km/s", { text: `Eyni planetin ətrafında iki peyk dairəvi orbitlərdə hərəkət edir. Birincinin sürəti ${v1} km/s, ikincinin orbit radiusu birincinin orbit radiusundan ${k * k} dəfə böyükdür. İkinci peykin sürəti nə qədərdir?`,
            solution: `v ~ 1/√r. Radius ${k * k} dəfə artıb, deməli sürət √${k * k} = ${k} dəfə azalır: ${v1}/${k} = ${F(v2)} km/s.` });
        }
        const n = pick([4, 6.25, 16, 25]), r = n * RY, v = 8 / Math.sqrt(n), a = v * v / r * 1000;
        if (!nice(a, 4)) return levels[2].gen();
        return R(a, "m/s²", { text: `Peyk radiusu ${fmt(r)} km olan dairəvi orbitdə ${F(v)} km/s sürətlə hərəkət edir. Peykin mərkəzəqaçma təcili (mərkəzə doğru) nə qədərdir?`,
          solution: `a = v²/r = (${F(v * 1000)})²/(${fmt(r * 1000)}) = ${F(a)} m/s². (Bu, orbitdə g_r = g·R²/r² = 10/${F(n * n)} qiymətinə bərabərdir.)` });
      } },
    { id: "period", ad: "Peykin dövr müddəti", izah: "T = 2πr/v. Səthə yaxın T₀ = 84 dəq. Radius r = nR olarsa T = T₀·n√n (r³ ilə T² mütənasibdir). Nisbətlərlə işlə: T₂/T₁ = (r₂/r₁)^(3/2).",
      gen() {
        const kind = pick(["T", "T", "inv", "ratio", "ratio", "gun"]);
        if (kind === "T") {
          const n = pick([2.25, 4, 6.25, 9, 16, 25]), T = 84 * n * Math.sqrt(n);
          return R(T, "dəq", { text: `Yerin səthinə çox yaxın orbitdə peykin dövr müddəti T₀ = 84 dəq-dir. Orbitinin radiusu (Yerin mərkəzindən) Yerin radiusunun ${F(n)} misli olan peykin dövr müddəti neçə dəqiqədir?`,
            solution: `T ~ r^(3/2). T = T₀·n^(3/2) = 84·${F(n)}·√${F(n)} = 84·${F(n)}·${F(Math.sqrt(n))} = 84·${F(n * Math.sqrt(n))} = ${F(T)} dəq.` });
        }
        if (kind === "inv") {
          const n = pick([4, 9, 16, 25]), T = 84 * n * Math.sqrt(n), m = n * Math.sqrt(n);
          return R(n, "dəfə", { text: `Yerin ətrafında dairəvi orbitdə hərəkət edən peykin dövr müddəti ${F(T)} dəq-dir. Səthə yaxın orbitdə T₀ = 84 dəq-dir. Bu peykin orbit radiusu Yerin radiusundan neçə dəfə böyükdür?`,
            solution: `T/T₀ = ${F(T)}/84 = ${F(m)} = n^(3/2). Deməli n = ${F(m)}^(2/3) = ${n}.` });
        }
        if (kind === "ratio") {
          const k = pick([2, 3, 4, 5]), up = Math.random() < .7, r = up ? k * k : 1 / (k * k), ratio = up ? k ** 3 : 1 / (k ** 3);
          return R(ratio, "dəfə", { text: `Eyni planetin ətrafında iki peyk dairəvi orbitlərdə hərəkət edir. İkinci peykin orbit radiusu birincinin orbit radiusunun ${up ? k * k + " mislidir" : "1/" + k * k + " hissəsidir"}. İkinci peykin dövr müddətinin birincinin dövr müddətinə nisbəti (T₂/T₁) nə qədərdir?`,
            solution: `T ~ r^(3/2). T₂/T₁ = (r₂/r₁)^(3/2) = (${up ? k * k : "1/" + k * k})^(3/2) = ${up ? k ** 3 : "1/" + k ** 3} = ${F(ratio)}.` });
        }
        const n = pick([4, 9, 16]), N = Math.round(n * Math.sqrt(n));
        return R(N, "dəfə", { text: `Planetin ətrafında iki peykin orbit radiusları ${n} dəfə fərqlənir (ikinci böyükdür). Birinci peyk ikincidən neçə dəfə sürətli fırlanır, yəni bir tam dövrü neçə dəfə tez edir?`,
          solution: `T₂/T₁ = (r₂/r₁)^(3/2) = ${n}^(3/2) = ${N}. Birinci peykin dövr müddəti ${N} dəfə kiçikdir.` });
      } },
    { id: "kepler", ad: "Kepler qanunları", izah: "I: orbit ellipsdir, Günəş fokusdadır. II: radius-vektor bərabər zamanda bərabər sahə çəkir (apsidlərdə r·v = const). III: T²/a³ = const. Günəş sistemində: T (il)² = a (AU)³.",
      gen() {
        const kind = pick(["T", "a", "ell", "ell", "v", "peyk", "peyk", "ratio"]);
        if (kind === "T") {
          const a = pick([0.25, 2.25, 4, 6.25, 9, 16, 25, 36]), T = a * Math.sqrt(a);
          return R(T, "il", { text: `Günəşdən orta məsafəsi ${F(a)} AU olan planetin Günəş ətrafında dövr müddəti neçə ildir? (1 AU — Yerin orbit radiusu; Yerin dövr müddəti 1 ildir.)`,
            solution: `Kepler III: T²/a³ = const = 1 (il²/AU³). T = a^(3/2) = ${F(a)}·√${F(a)} = ${F(a)}·${F(Math.sqrt(a))} = ${F(T)} il.` });
        }
        if (kind === "a") {
          const a = pick([4, 9, 16, 25, 36]), T = a * Math.sqrt(a);
          return R(a, "AU", { text: `Planet Günəş ətrafında ${T} ilə bir dövr edir. Onun orbit yarımoxu neçə AU-dur? (Yer üçün T = 1 il, a = 1 AU.)`,
            solution: `T² = a³ → a = T^(2/3) = ${T}^(2/3). ${T}² = ${T * T} = ${a}³, deməli a = ${a} AU.` });
        }
        if (kind === "ell") {
          const a = pick([4, 9, 16, 25]), rp = pick([0.5, 1, 1.5, 2, 3]), ra = 2 * a - rp, T = a * Math.sqrt(a);
          return R(T, "il", { text: `Kometin orbiti ellipsdir: Günəşə ən yaxın məsafəsi (perihelii) ${F(rp)} AU, ən uzaq məsafəsi (afelii) ${F(ra)} AU-dur. Kometin dövr müddəti neçə ildir? (Yer üçün T = 1 il, a = 1 AU.)`,
            solution: `Yarımox a = (r_p + r_a)/2 = (${F(rp)} + ${F(ra)})/2 = ${a} AU. Kepler III: T = a^(3/2) = ${a}·${Math.sqrt(a)} = ${T} il.` });
        }
        if (kind === "v") {
          const k = pick([2, 3, 4, 5, 10]), vp = pick([k * 5, k * 8, k * 10, k * 12, 60].filter(x => x % k === 0 && x <= 100)), rp = pick([0.5, 1, 2, 3]), va = vp / k;
          return R(va, "km/s", { text: `Kometin Günəşə ən yaxın nöqtədə (perihelidə) məsafəsi ${F(rp)} AU, sürəti ${vp} km/s-dir. Ən uzaq nöqtədə (afelidə) Günəşə məsafəsi ${F(rp * k)} AU-dur. Afelidə kometin sürəti nə qədərdir?`,
            solution: `Apsidlərdə sürət radius-vektora perpendikulyardır, Kepler II-dən r·v = const: v_a = v_p·r_p/r_a = ${vp}·${F(rp)}/${F(rp * k)} = ${F(va)} km/s.` });
        }
        if (kind === "peyk") {
          const n = pick([2.25, 4, 6.25, 9]), sum = 2 * (n - 1) * RY, h1 = pick([600, 800, 1200, 1600, 2000, 3200]), h2 = sum - h1, T = 84 * n * Math.sqrt(n);
          if (h2 <= h1) return levels[4].gen();
          return R(T, "dəq", { text: `Peyk Yer ətrafında ellips orbitdə hərəkət edir. Yer səthindən ən yaxın hündürlüyü (perigey) ${fmt(h1)} km, ən uzaq hündürlüyü (apogey) ${fmt(h2)} km-dir. Yerin radiusu ${RY} km, səthə yaxın dairəvi orbitdə T₀ = 84 dəq. Peykin dövr müddəti neçə dəqiqədir?`,
            solution: `Yarımox a = R + (h₁ + h₂)/2 = ${RY} + (${fmt(h1)} + ${fmt(h2)})/2 = ${RY} + ${fmt(sum / 2)} = ${fmt(n * RY)} km = ${F(n)}R. Kepler III (yarımoxu a-ya bərabər dairə ilə eyni T): T = T₀·n^(3/2) = 84·${F(n * Math.sqrt(n))} = ${F(T)} dəq.` });
        }
        const q = pick([[8, 4], [27, 9], [64, 16], [1000, 100], [0.125, 0.25]]);
        return R(q[1], "dəfə", { text: `İki planetin Günəş ətrafında dövr müddətlərinin nisbəti T₂/T₁ = ${F(q[0])}-dir. Onların orbit yarımoxlarının nisbəti a₂/a₁ nə qədərdir?`,
          solution: `T²/a³ = const → (T₂/T₁)² = (a₂/a₁)³. (${F(q[0])})² = ${F(q[0] * q[0])} = ${F(q[1])}³ → a₂/a₁ = ${F(q[1])}.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          const f = pick([2, 4, 5]), gh = g / (f * f), H = f - 1;
          task = `Yerin radiusu R, yer səthində g = 10 m/s²-dir. Yer səthindən h = ${H === 1 ? "" : H}R hündürlükdə sərbəstdüşmə təcili neçə m/s²-dir?`;
          steps = [`g_h = GM/r², burada r Yerin <b>mərkəzindən</b> məsafədir: r = R + h.`.replace(/<\/?b>/g, ""),
            `r = R + ${H === 1 ? "" : H}R = ${f}R, deməli g_h = g·R²/r² = g/${f}².`,
            `g_h = 10/${f * f} = ${F(gh)} m/s².`];
          if (bad === 0) steps = [`g_h = GM/h², h Yer səthindən məsafədir.`, `h = ${H === 1 ? "" : H}R, deməli g_h = g·R²/h² = g/${H * H}.`, `g_h = 10/${H * H} = ${F(g / (H * H))} m/s².`];
          if (bad === 1) { steps[1] = `r = R + ${H === 1 ? "" : H}R = ${f}R, deməli g_h = g·R/r = g/${f}.`; steps[2] = `g_h = 10/${f} = ${F(g / f)} m/s².`; }
          if (bad === 2) steps[2] = `g_h = 10·${f * f} = ${f * f * g} m/s².`;
          why = [`1-ci addım: r mərkəzdən ölçülür: r = R + h. h yox. Düz cavab: ${F(gh)} m/s².`,
            `2-ci addım: g məsafənin <b>kvadratı</b> ilə tərs mütənasibdir: g_h = g/${f}², ${f} yox. Düz cavab: ${F(gh)} m/s².`.replace(/<\/?b>/g, ""),
            `3-cü addım: r artıb, g azalmalıdır: 10-u ${f * f}-ə bölürük, vurmuruq. Düz cavab: ${F(gh)} m/s².`][bad];
        } else {
          const a = pick([4, 9, 16, 25, 36, 49]), T = a * Math.sqrt(a);
          task = `Planetin Günəşdən orta məsafəsi Yerin Günəşdən məsafəsinin ${a} mislidir. Planetin Günəş ətrafında dövr müddəti neçə ildir?`;
          steps = [`Kepler III: T²/T₀² = a³/a₀³, burada T₀ = 1 il.`, `T² = ${a}³ = ${a ** 3} il².`, `T = √${a ** 3} = ${F(T)} il.`];
          if (bad === 0) steps = [`Kepler III: T/T₀ = a/a₀.`, `T = ${a} il.`, `T = ${a} il.`];
          if (bad === 1) steps[1] = `T² = ${a}·3 = ${3 * a} il².`, steps[2] = `T = √${3 * a} = ${F(+Math.sqrt(3 * a).toFixed(2))} il.`;
          if (bad === 2) steps[2] = `T = ${a ** 3}/2 = ${F(a ** 3 / 2)} il.`;
          why = [`1-ci addım: Kepler III-də <b>T² ~ a³</b>, T ~ a yox. Düz cavab: ${F(T)} il.`.replace(/<\/?b>/g, ""),
            `2-ci addım: a³ kub deməkdir: ${a}³ = ${a ** 3}, ${a}·3 yox. Düz cavab: ${F(T)} il.`,
            `3-cü addım: T² verilib, T tapmaq üçün kök alınır, 2-yə bölünmür. √${a ** 3} = ${F(T)} il.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Kosmonavt, Mars, Ayda tullanma, peyk — hamısı cazibə qanunudur.",
      gen() {
        const kind = pick(["astro", "mars", "tullan", "peyk", "gemi", "ay"]);
        if (kind === "astro") {
          const f = pick(OFS.filter(x => x !== 1.25)), m = pick([60, 70, 75, 80, 90]), Fv = m * g / (f * f);
          if (!nice(Fv, 3)) return levels[6].gen();
          return R(Fv, "N", { text: `Kütləsi ${m} kq olan kosmonavt Yerin mərkəzindən ${F(f)}R məsafədə orbitdə uçur (R — Yerin radiusu). Ona təsir edən Yerin cazibə qüvvəsi nə qədərdir? (Yer səthində g = 10 m/s²)`,
            solution: `g_r = g/${F(f)}² = ${F(g / (f * f))} m/s². F = mg_r = ${m}·${F(g / (f * f))} = ${F(Fv)} N. (Kosmonavt çəkisizdir, amma cazibə qüvvəsi sıfır deyil: o, kosmonavtı orbitdə saxlayır.)` });
        }
        if (kind === "mars") {
          let a, b, m, P; do { a = pick([0.1, 0.2, 0.5, 4, 9]); b = pick([0.25, 0.5, 2, 3]); m = pick([40, 50, 60, 80]); P = m * g * a / (b * b); } while (!nice(P, 3) || P > 4000);
          return R(P, "N", { text: `Kəşfiyyat roveri Yerdə ${m * g} N çəkiyə malikdir. O, kütləsi Yerinkinin ${F(a)} misli, radiusu Yerinkinin ${F(b)} misli olan planetə göndərilir. Orada roverin çəkisi nə qədər olacaq?`,
            solution: `g_p = 10·${F(a)}/${F(b)}² = ${F(g * a / (b * b))} m/s². Kütlə dəyişmir (${m} kq). P = ${m}·${F(g * a / (b * b))} = ${F(P)} N.` });
        }
        if (kind === "tullan") {
          const hy = pick([0.16, 0.32, 0.48, 0.64, 0.8]), hm = hy * g / 1.6;
          return R(hm, "m", { text: `Yerdə adam şaquli yuxarı tullananda ${F(hy)} m hündürlüyə qalxır. Ayda sərbəstdüşmə təcili 1,6 m/s²-dir. Eyni başlanğıc sürətlə Ayda adam neçə metr qalxar?`,
            solution: `Qalxma hündürlüyü H = v²/(2g) ~ 1/g. Başlanğıc sürət eynidir: H_Ay = ${F(hy)}·10/1,6 = ${F(hm)} m.` });
        }
        if (kind === "peyk") {
          const n = pick(NS), v = 8 / Math.sqrt(n);
          return R(v, "km/s", { text: `Rabitə peyki Yerin mərkəzindən ${F(n * RY)} km məsafədə dairəvi orbitdə hərəkət edir. Peykin sürəti nə qədərdir? (R_Yer = ${RY} km, səthə yaxın orbitdə sürət 8 km/s.)`,
            solution: `r = ${F(n * RY)}/${RY} = ${F(n)}R. v = 8/√${F(n)} = 8/${F(Math.sqrt(n))} = ${F(v)} km/s.` });
        }
        if (kind === "gemi") {
          let m, r, X, Fm; do { m = pick([1, 2, 5, 10, 20, 50]) * 1e5; r = pick([20, 50, 100, 200]); X = m * m / (r * r); Fm = 6.67e-5 * X; } while (!nice(Fm, 3) || Fm > 2000 || Fm < 0.5);
          return R(Fm, "µN", { text: `Dəniz limanında iki eyni gəminin kütləsi ${F(m / 1000)} t-dur, aralarında məsafə ${r} m-dir. Onların qarşılıqlı cazibə qüvvəsi neçə µN-dur? (Gəmiləri nöqtəvi cisim sayın; G = 6,67·10⁻¹¹ N·m²/kq², 1 µN = 10⁻⁶ N)`,
            solution: `m = ${fmt(m)} kq. F = Gm²/r² = 6,67·10⁻¹¹·${fmt(m)}²/${r}² = 6,67·10⁻¹¹·${F(X)} = ${F(Fm)}·10⁻⁶ N = ${F(Fm)} µN.` });
        }
        const n = pick([4, 5, 10, 20]), a = g / (n * n);
        return R(a, "m/s²", { text: `Ayın Yer ətrafında orbitini dairə kimi götürək. Tutaq ki, Ayın Yerin mərkəzindən məsafəsi ${n}R-dir (R — Yerin radiusu; real məsafə təxminən 60R-dir). Ayın olduğu yerdə Yerin cazibəsinin verdiyi təcil nə qədərdir? (Yer səthində g = 10 m/s²)`,
          solution: `g_r = g/${n}² = 10/${n * n} = ${F(a)} m/s².` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-cazibe", title: "Ümumdünya cazibə qanunu, Kepler qanunları, peyklər", fenn: "fizika", link: "dersler/fiz-cazibe.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI və xüsusi: m/s², km/s, km, dəq, il). Onluq kəsr vergül və ya nöqtə ilə: 0,5. g = 10 m/s², R_Yer = 6400 km.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["qanun", "qanun", "g", "g", "v1", "v1", "period", "kepler", "kepler", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-cazibe.html")) b.push("dersler/fiz-cazibe.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
