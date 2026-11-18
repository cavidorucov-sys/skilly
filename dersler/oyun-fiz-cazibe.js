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
    { id: "v1", ad: "Birinci kosmik sürət", izah: "Dairəvi orbitdə cazibə qüvvəsi mərkəzəyönlü təcil verir: mg_r = mv²/r. Yer səthinə yaxın: v₁ = √(gR) = 8 km/s. Orbit radiusu r = nR olarsa, v = v₁/√n.",
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
        return R(a, "m/s²", { text: `Peyk radiusu ${fmt(r)} km olan dairəvi orbitdə ${F(v)} km/s sürətlə hərəkət edir. Peykin mərkəzəyönlü təcili (mərkəzə doğru) nə qədərdir?`,
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

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a picture or graph, several steps;
  // the wrong options are the answers of typical mistakes. Questions 3, 5, 6, 8 and 9 also use an earlier topic:
  // Nyuton (lift with a cable), Sərbəst düşmə (fall time), Huk (spring), Sürtünmə və maili müstəvi, Kinematika (v–t graph);
  // question 4 uses circular motion (v²/r, T = 2πr/v).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const Fx = x => F(+x.toFixed(4));
  const Kx = x => { const [i, d] = F(+x.toFixed(4)).split(","); return i.replace(/\B(?=(\d{3})+(?!\d))/g, " ") + (d ? "," + d : "") + " km"; };
  const gp_ = (a, b) => g * a / (b * b);
  // <svg-helpers> (string builders; the lesson tab uses the same pictures)
  const C = { ink: "var(--ink,#17171a)", acc: "var(--accent,#2457d6)", vec: "var(--vec,#c2410c)", mut: "var(--muted,#6b6b76)", soft: "var(--accent-soft,#e8eefc)", paper: "var(--paper,#fff)" };
  const q1 = v => +(+v).toFixed(1);
  const sLn = (x1, y1, x2, y2, c = C.ink, w = 1.8, d) => `<line x1="${q1(x1)}" y1="${q1(y1)}" x2="${q1(x2)}" y2="${q1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${d ? ` stroke-dasharray="${d}"` : ""}/>`;
  const sTx = (x, y, t, a = "start", c = C.ink, fs = 13) => `<text x="${q1(x)}" y="${q1(y)}" text-anchor="${a}" font-size="${fs}" font-weight="700" fill="${c}" font-family="inherit">${t}</text>`;
  const sAr = (x1, y1, x2, y2, c = C.ink, w = 2.6) => { const a = Math.atan2(y2 - y1, x2 - x1), L = 10, Wd = 5, bx = x2 - L * Math.cos(a), by = y2 - L * Math.sin(a);
    return sLn(x1, y1, bx, by, c, w) + `<polygon points="${q1(x2)},${q1(y2)} ${q1(bx - Wd * Math.sin(a))},${q1(by + Wd * Math.cos(a))} ${q1(bx + Wd * Math.sin(a))},${q1(by - Wd * Math.cos(a))}" fill="${c}"/>`; };
  const sDimH = (x1, x2, y, label) => sLn(x1 + 6, y, x2 - 6, y, C.mut, 1.4) + sAr(x1 + 12, y, x1, y, C.mut, 1.4) + sAr(x2 - 12, y, x2, y, C.mut, 1.4) + sTx((x1 + x2) / 2, y + 15, label, "middle", C.ink, 12);
  const sRect = (x, y, w, h, f = C.soft) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="${C.ink}" stroke-width="1.5"/>`;
  const sBall = (x, y, r, f = C.soft) => `<circle cx="${q1(x)}" cy="${q1(y)}" r="${q1(r)}" fill="${f}" stroke="${C.ink}" stroke-width="1.8"/>`;
  const sSvg = (w, h, inner, aria, cls = "oy-svg") => `<svg viewBox="0 0 ${w} ${h}"${cls ? ` class="${cls}"` : ""} role="img" aria-label="${aria}">${inner}</svg>`;
  const svEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  // graph through the points pts = [[t, y], …] (non-negative); guides = [[t, y], …] get dashed lines and tick labels; yx = extra y ticks
  function figPlot(pts, guides, yx, xl, yl, aria, cls) {
    const x0 = 46, y0 = 160, xm = Math.max(...pts.map(p => p[0])), ym = Math.max(...pts.map(p => p[1])), X = t => x0 + t / xm * 200, Y = v => y0 - v / ym * 118;
    let s = "";
    guides.forEach(([t, v]) => { if (v > 0) s += sLn(X(t), Y(v), X(t), y0, C.mut, 1, "4 3") + sLn(x0, Y(v), X(t), Y(v), C.mut, 1, "4 3"); });
    s += sLn(x0, y0, 250, y0, C.ink, 1.6) + sLn(x0, y0, x0, 24, C.ink, 1.6) + sTx(252, y0 + 4, xl, "start", C.mut, 11) + sTx(x0 + 6, 18, yl, "start", C.mut, 11);
    [...new Set(guides.map(p => p[0]))].filter(t => t > 0).forEach(t => { s += sLn(X(t), y0, X(t), y0 + 4, C.ink, 1.4) + sTx(X(t), y0 + 17, F(t), "middle", C.ink, 11); });
    [...new Set([...guides.map(p => p[1]), ...yx])].filter(v => v > 0).forEach(v => { s += sLn(x0 - 4, Y(v), x0, Y(v), C.ink, 1.4) + sTx(x0 - 7, Y(v) + 4, F(v), "end", C.ink, 11); });
    s += `<polyline points="${pts.map(p => q1(X(p[0])) + "," + q1(Y(p[1]))).join(" ")}" fill="none" stroke="${C.acc}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`;
    return sSvg(280, 190, s, aria, cls);
  }
  // two bodies M and k²M, d apart; the point P where the two pulls on a test body are equal lies x = d/(k+1) from M
  const figBal = (k, dl, cls) => { const x1 = 40, x2 = 260, xp = x1 + 220 / (1 + k), r2 = Math.min(28, 14 + 3 * k), y = 70;
    return sSvg(300, 135, sLn(x1, y, x2, y, C.mut, 1, "4 3") + sBall(x1, y, 14) + sTx(x1, y + 5, "M", "middle", C.ink, 12) + sBall(x2, y, r2) + sTx(x2, y + 5, (k * k) + "M", "middle", C.ink, 12)
      + `<circle cx="${q1(xp)}" cy="${y}" r="4" fill="${C.vec}"/>` + sTx(xp, y - 12, "P", "middle", C.vec, 13)
      + sLn(xp, 22, xp, y - 20, C.mut, 1, "3 3") + sLn(x1, 22, x1, y - 16, C.mut, 1, "3 3") + sDimH(x1, xp, 22, "x = ?")
      + sDimH(x1, x2, 108, "d = " + dl), "Kütlələri M və " + (k * k) + "M olan iki cisim, aralarında P nöqtəsi", cls); };
  // the Earth, a body at height h above its surface (R from the centre, h from the surface)
  const figAlt = (hl, cls) => sSvg(300, 150, sBall(70, 62, 40) + sTx(70, 67, "Yer", "middle", C.ink, 13) + sLn(70, 62, 250, 62, C.mut, 1, "4 3") + sBall(250, 62, 8, C.vec) + sTx(250, 46, "m", "middle", C.ink, 13)
    + sDimH(70, 110, 112, "R") + sDimH(110, 250, 112, hl), "Yer və ondan h hündürlükdə cisim: R mərkəzdən səthə, h səthdən cismə qədərdir", cls);
  // circular orbit: satellite on the dashed circle, v tangent
  const figOrb = cls => sSvg(300, 200, `<circle cx="110" cy="100" r="75" fill="none" stroke="${C.mut}" stroke-width="1.5" stroke-dasharray="5 4"/>` + sBall(110, 100, 30) + sTx(110, 121, "Yer", "middle", C.ink, 13)
    + sAr(110, 100, 110, 70, C.mut, 1.6) + sTx(117, 90, "R", "start", C.ink, 12) + sBall(185, 100, 7, C.vec) + sAr(185, 90, 185, 52, C.vec, 2.6) + sTx(193, 62, "v", "start", C.vec, 13)
    + sDimH(140, 185, 125, "h") + sTx(196, 120, "peyk", "start", C.ink, 12), "Peyk Yerin ətrafında dairəvi orbitdə; h — Yer səthindən hündürlük, v — sürət", cls);
  // a lift cabin on a cable on the planet's surface
  const figLift = (al, Ml, cls) => sSvg(300, 190, sLn(30, 168, 270, 168, C.ink, 2) + sTx(150, 186, "planetin səthi", "middle", C.mut, 11) + sRect(110, 84, 60, 66) + sTx(140, 122, Ml, "middle", C.ink, 12)
    + sLn(140, 84, 140, 52) + sAr(140, 52, 140, 14, C.acc, 2.8) + sTx(150, 30, "T = ?", "start", C.acc, 13) + sAr(204, 130, 204, 92, C.vec, 2.8) + sTx(212, 114, "a = " + al + " m/s²", "start", C.vec, 12), "Planetin səthində trosla yuxarı təcillə qalxan lift kabinəsi", cls);
  // two bodies fall from the same height H: on the Earth (M, R) and on a planet (aM, bR)
  const figFall = (a, b, cls) => { const rP = Math.min(46, Math.max(12, 26 * b)), top = 90, y0 = 28;
    const col = (x, r, t1, t2) => sBall(x, top + r, r) + sBall(x, y0, 6, C.vec) + sLn(x, y0 + 8, x, top - 24, C.vec, 1.8, "4 3") + sAr(x, top - 26, x, top - 2, C.vec, 2.2) + sTx(x + 10, 62, "H", "start", C.vec, 13) + sTx(x, 196, t1, "middle", C.ink, 12) + sTx(x, 211, t2, "middle", C.mut, 12);
    return sSvg(300, 218, col(80, 26, "Yer", "M, R") + col(220, rP, "Planet", F(a) + "M, " + F(b) + "R"), "Eyni H hündürlükdən Yerdə və planetdə cisim düşür; planetin kütləsi aM, radiusu bR", cls); };
  // a spring with a load: left on the Earth, right on a planet
  const spring = (x, y1, y2) => { let p = `${x},${y1} ${x},${y1 + 6}`; const n = 6, hh = (y2 - y1 - 12) / n; for (let i = 0; i < n; i++) p += ` ${x + (i % 2 ? -9 : 9)},${q1(y1 + 6 + hh * (i + 0.5))}`; p += ` ${x},${y2 - 6} ${x},${y2}`;
    return `<polyline points="${p}" fill="none" stroke="${C.ink}" stroke-width="1.8" stroke-linejoin="round"/>`; };
  const figSpr = (xl, cls) => { const col = (x, lab, note) => sLn(x - 28, 12, x + 28, 12, C.ink, 3) + spring(x, 12, 78) + sRect(x - 18, 78, 36, 28) + sTx(x, 97, "m", "middle", C.ink, 12) + sLn(x - 50, 132, x + 50, 132, C.ink, 2) + sTx(x, 150, lab, "middle", C.mut, 12) + sTx(x + 24, 48, note, "start", C.vec, 12);
    return sSvg(300, 160, col(80, "Yer", "x₁ = " + xl + " sm") + col(220, "Planet", "x₂ = ?"), "Dinamometrin yayından asılmış yük: solda Yerdə, sağda planetdə", cls); };
  // a block on an incline (sin α = 0,6, cos α = 0,8)
  const figIncl = cls => sSvg(280, 190, `<polygon points="40,160 220,160 40,25" fill="${C.soft}" stroke="${C.ink}" stroke-width="2"/><path d="M190 160A30 30 0 0 1 196 142" fill="none" stroke="${C.ink}" stroke-width="1.5"/>` + sTx(172, 154, "α", "middle", C.ink, 13)
    + `<g transform="translate(112,79) rotate(36.87)"><rect x="-18" y="-26" width="36" height="26" fill="${C.paper}" stroke="${C.ink}" stroke-width="1.8"/></g>` + sTx(120, 73, "m", "middle", C.ink, 13) + sTx(150, 130, "μ", "start", C.vec, 13) + sTx(130, 183, "planetin səthi", "middle", C.mut, 11),
    "Planetin səthində maili müstəvi: üstündə m kütləli cisim, sürtünmə əmsalı μ", cls);
  // ellipse: the focus (Sun / Earth) is rp from the near end and ra from the far end; o: lp, la (end labels), sun (focus label), vp, va (velocity arrows)
  function figEll(rp, ra, o, cls) { o = o || {}; const cx = 158, cy = 100, A = 100, e = (ra - rp) / (ra + rp), c = A * e, B = A * Math.sqrt(1 - e * e), xs = cx + c, xp = cx + A, xa = cx - A;
    let s = `<ellipse cx="${cx}" cy="${cy}" rx="${A}" ry="${q1(B)}" fill="none" stroke="${C.ink}" stroke-width="2"/>` + sLn(xa, cy, xp, cy, C.mut, 1, "4 3")
      + `<circle cx="${q1(xs)}" cy="${cy}" r="${o.sunR || 6}" fill="${o.sunF || C.vec}" stroke="${C.ink}" stroke-width="1.4"/>` + (xp - xs > (o.sunR || 6) + 6 ? sBall(xp, cy, 3.5, C.ink) : "") + sBall(xa, cy, 3.5, C.ink)
      + sTx(xp + 8, cy + 4, o.lp, "start", C.ink, 12) + sTx(xa - 8, cy + 4, o.la, "end", C.ink, 12) + sTx(Math.min(260, Math.max(50, xs)), cy + 40, o.sun || "Günəş", "middle", C.mut, 11);
    if (o.vp) s += sAr(xp, cy, xp, cy - 34, C.acc, 2.6) + sTx(xp + 8, cy - 22, o.vp, "start", C.acc, 12);
    if (o.va) s += sAr(xa, cy, xa, cy + 34, C.acc, 2.6) + sTx(xa - 8, cy + 26, o.va, "end", C.acc, 12);
    return sSvg(320, 200, s, o.aria || "Ellips orbit: ən yaxın və ən uzaq nöqtə, fokusda Günəş", cls); }
  // </svg-helpers>
  // comets: perihelion rp, aphelion ra (AU) so that every answer and every wrong option is a nice number
  // (T = a^(3/2) is a nice number only when a is a perfect square; ra/rp <= 12 keeps the focus marker clear of the perihelion end of the ellipse)
  const TRI = [];
  for (const a of [4, 9, 16, 25, 36]) for (let rp = 0.25; rp < a; rp += 0.25) { const ra = 2 * a - rp;
    if (ra >= 2 * rp && ra <= 12 * rp) TRI.push([rp, ra, a]); }
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. the point where two pulls are equal (picture)
    { tip: "qapali", gen: () => again(() => {
      const k = pick([2, 3, 4, 5]), D = pick([12000, 24000, 30000, 36000, 48000, 60000, 72000, 90000, 96000, 120000, 180000, 240000]), x = D / (1 + k);
      const w = [D / 2, D / (1 + k * k), D * k / (1 + k), D / (k * k)]; if (![x, ...w].every(v => ok2(v))) return null;
      return mc(ae(x, w, Kx), { svg: svEl(figBal(k, fmt(D) + " km")), text: `Kütlələri M və ${k * k}M olan iki cisim bir-birindən d = ${fmt(D)} km məsafədədir (cisimləri nöqtəvi sayın). Onları birləşdirən düz xətt üzərindəki P nöqtəsində yerləşən kiçik sınaq cisminə hər iki cismin cazibə qüvvələri bərabər modula malikdir və əks tərəfə yönəlib. P nöqtəsi M kütləli cisimdən neçə km məsafədədir?`,
        solution: `Sınaq cisminə qüvvələr bərabərdir: GMm/x² = G·${k * k}M·m/(d − x)². Hər iki tərəfdən kök alırıq: (d − x)/x = √${k * k} = ${k}, d = ${k + 1}x, x = ${fmt(D)}/${k + 1} = ${Kx(x)}. Tələlər: ${Kx(w[0])} — orta nöqtə (kütlələr fərqlidir); ${Kx(w[1])} — kökü almamaq, d/(${k * k} + 1); ${Kx(w[2])} — məsafəni böyük kütləli cisimdən ölçmək; ${Kx(w[3])} — d/${k * k}.` });
    }) },
    // 2. force on a body at height h (picture, R and h)
    { tip: "qapali", gen: () => again(() => {
      const n = pick([0.5, 1.5, 2, 3, 4, 9]), m = pick([36, 40, 45, 48, 60, 64, 72, 80, 90, 96, 180]), h = n * RY, Fv = m * g / ((n + 1) ** 2);
      const cand = [[m * g / (n * n), "h-ı r götürmək (məsafə mərkəzdən ölçülür)"], [m * g / (n + 1), "kvadratı unutmaq"], [m * g, "\"qüvvə dəyişmir\" (kosmonavt çəkisiz olsa da, cazibə qüvvəsi azalır, sıfır olmur)"],
        [m * g / (n * n + 1), "r² = R² + h² yazmaq"], [m * g / (n + 1) ** 3, "kvadrat əvəzinə kub götürmək"]].filter(c => ok2(c[0]));
      if (!ok2(Fv) || cand.length < 4) return null;
      const ch = cand.map(c => [Math.random(), c]).sort((p, q) => p[0] - q[0]).slice(0, 4).map(p => p[1]);
      return mc(ae(Fv, ch.map(c => c[0]), U_("N")), { svg: svEl(figAlt("h = " + fmt(h) + " km")), text: `Kütləsi ${m} kq olan kosmonavt Yer səthindən h = ${fmt(h)} km hündürlükdə uçur (şəkildə R — Yerin radiusu, R = ${RY} km). Yer səthində g = 10 m/s²-dir. Kosmonavta təsir edən Yerin cazibə qüvvəsi nə qədərdir?`,
        solution: `Cazibə qüvvəsi Yerin mərkəzindən məsafənin kvadratına tərs mütənasibdir: r = R + h = ${RY} + ${fmt(h)} = ${fmt(RY * (n + 1))} km = ${F(n + 1)}R. F = mg·(R/r)² = ${m}·10/${F(n + 1)}² = ${Fx(Fv)} N. Tələlər: ${ch.map(c => Fx(c[0]) + " N — " + c[1]).join("; ")}.` });
    }) },
    // 3. lift on another planet (Nyuton + cazibə)
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const a = pick([0.5, 2, 4, 8, 9, 16]), b = pick([0.5, 2, 3, 4]), gp = gp_(a, b), M = pick([200, 400, 500, 800, 1000]), al = pick([1, 2, 2.5, 4, 5]), T = M * (gp + al);
      if (gp < 1 || gp > 80) return null;
      const w = [M * (gp - al), M * (g + al), M * gp, M * al]; if (![T, ...w].every(v => ok2(v))) return null;
      return mc(ae(T, w, U_("N")), { svg: svEl(figLift(F(al), "M")), text: `Planetin kütləsi Yerinkinin ${F(a)} misli, radiusu Yerinkinin ${F(b)} mislidir. Planetin səthində kütləsi ${M} kq olan lift kabinəsi şaquli trosla yuxarı ${F(al)} m/s² təcillə qaldırılır. Trosun gərilmə qüvvəsi nə qədərdir? (Yerdə g = 10 m/s²; trosun kütləsi və havanın müqaviməti nəzərə alınmır.)`,
        solution: `Əvvəl planetdə g_p = g·(M_p/M_Y)/(R_p/R_Y)² = 10·${F(a)}/${F(b)}² = ${F(gp)} m/s². Nyutonun II qanunu (ox yuxarı): T − Mg_p = Ma → T = M(g_p + a) = ${M}·(${F(gp)} + ${F(al)}) = ${Fx(T)} N. Tələlər: ${Fx(w[0])} N — təcil yuxarıdır, "−" yox; ${Fx(w[1])} N — Yerdəki g = 10 m/s² qiymətini götürmək; ${Fx(w[2])} N — təcili unutmaq (T = Mg_p); ${Fx(w[3])} N — ağırlıq qüvvəsini unutmaq (T = Ma).` });
    }) },
    // 4. circular orbit: period or speed (circular motion + gravity)
    { tip: "qapali", birlesik: "fiz-cevre-herekat", gen: () => again(() => {
      const spd = Math.random() < .5, N = spd ? pick([2.56, 4, 6.25, 10.24, 16, 25, 64, 100]) : pick([2.25, 4, 6.25, 9, 16, 25]), h = (N - 1) * RY;
      if (!spd) { const T = 84 * N ** 1.5, w = [84 * N, 84 * N * N, N ** 1.5, 84 * N ** 3]; if (![T, ...w].every(v => ok2(v))) return null;
        return mc(ae(T, w, U_("dəq")), { svg: svEl(figOrb()), text: `Peyk Yerin səthindən h = ${fmt(h)} km hündürlükdə dairəvi orbitdə hərəkət edir (R — Yerin radiusu, R = ${RY} km). Yer səthinə çox yaxın dairəvi orbitdə peykin dövr müddəti T₀ = 84 dəq, sürəti isə 8 km/s-dir. Bu peykin dövr müddəti neçə dəqiqədir?`,
          solution: `Orbit radiusu r = R + h = ${RY} + ${fmt(h)} = ${fmt(N * RY)} km = ${F(N)}R. Cazibə mərkəzəyönlü təcil verir: v = v₁/√${F(N)}. T = 2πr/v və T₀ = 2πR/v₁ olduğundan T/T₀ = (r/R)/(v/v₁) = ${F(N)}·${F(Math.sqrt(N))} = ${F(N ** 1.5)}. T = 84·${F(N ** 1.5)} = ${Fx(T)} dəq. Tələlər: ${Fx(w[0])} dəq — T ~ r götürmək; ${Fx(w[1])} dəq — T ~ r²; ${Fx(w[2])} dəq — T₀-ı vurmağı unutmaq; ${Fx(w[3])} dəq — T ~ r³.` }); }
      const v = 8 / Math.sqrt(N), cand = [[8 / N, "v ~ 1/r"], [8 * Math.sqrt(N), "\"yüksəkdə sürət artır\" (əksinə azalır)"], [8 / N ** 1.5, "dövr müddətinin qüvvətini (3/2) götürmək"], [8 / (N * N), "v ~ 1/r²"], [8 * N, "v ~ r"], [8 * N ** 1.5, "v ~ r^(3/2)"]].filter(c => ok2(c[0]));
      if (!ok2(v) || cand.length < 4) return null;
      const ch = cand.map(c => [Math.random(), c]).sort((p, q) => p[0] - q[0]).slice(0, 4).map(p => p[1]), w = ch.map(c => c[0]);
      return mc(ae(v, w, U_("km/s")), { svg: svEl(figOrb()), text: `Peyk Yerin səthindən h = ${fmt(h)} km hündürlükdə dairəvi orbitdə hərəkət edir (R — Yerin radiusu, R = ${RY} km). Yer səthinə çox yaxın dairəvi orbitdə sürət 8 km/s-dir. Bu peykin sürəti nə qədərdir?`,
        solution: `Orbit radiusu r = R + h = ${RY} + ${fmt(h)} = ${fmt(N * RY)} km = ${F(N)}R. Cazibə qüvvəsi mərkəzəyönlü təcil verir: mv²/r = GMm/r² → v ~ 1/√r. v = 8/√${F(N)} = 8/${F(Math.sqrt(N))} = ${Fx(v)} km/s. Tələlər: ${ch.map(c => Fx(c[0]) + " km/s — " + c[1]).join("; ")}.` });
    }) },
    // 5. fall from the same height on a planet (free fall + gravity)
    { tip: "qapali", birlesik: "fiz-serbest-dusme", gen: () => again(() => {
      const a = pick([0.25, 4, 9, 16, 25]), b = pick([0.5, 2, 3, 4, 5]), t1 = pick([1, 2, 3, 4, 5, 6]), t2 = t1 * b / Math.sqrt(a);
      const w = [t1 * b * b / a, t1 * a / (b * b), t1 * Math.sqrt(a) / b, t1 * b / a]; if (![t2, ...w].every(v => ok2(v))) return null;
      return mc(ae(t2, w, U_("s")), { svg: svEl(figFall(a, b)), text: `Yerin səthində H hündürlükdən sərbəst buraxılan cisim ${t1} s-də düşür. Planetin kütləsi Yerinkinin ${F(a)} misli, radiusu Yerinkinin ${F(b)} mislidir. Cisim həmin H hündürlükdən planetin səthində buraxılsa, neçə saniyəyə düşər? (Başlanğıc sürət sıfırdır, atmosfer yoxdur; H hər iki cismin radiusundan çox kiçikdir, g düşmə boyunca sabit sayılır.)`,
        solution: `H = gt²/2 eyni olduğundan t ~ 1/√g. g_p/g = (M_p/M_Y)/(R_p/R_Y)² = ${F(a)}/${F(b)}² = ${F(gp_(a, b) / g)}. t₂ = t₁·√(g/g_p) = ${t1}·${F(Math.sqrt(g / gp_(a, b)))} = ${Fx(t2)} s. Tələlər: ${Fx(w[0])} s — kökü almamaq (t ~ 1/g); ${Fx(w[1])} s — nisbəti tərsinə yazmaq; ${Fx(w[2])} s — √(g/g_p)-ni tərsinə yazmaq; ${Fx(w[3])} s — kütlə nisbətindən kök götürməyi unutmaq (√${F(a)} əvəzinə ${F(a)}; t₁·${F(b)}/${F(a)}).` });
    }) },
    // 6. spring (Huk) on a planet given by density and radius
    { tip: "qapali", birlesik: "fiz-huk", gen: () => again(() => {
      const a = pick([0.5, 2, 3, 4]), b = pick([0.5, 2, 3, 4]), x1 = pick([2, 3, 4, 5, 6, 8, 10, 12]), x2 = x1 * a * b;
      const w = [x1 * a / (b * b), x1 * a * b ** 3, x1 * a * b * b, x1 * a / b]; if (![x2, ...w].every(v => ok2(v))) return null;
      return mc(ae(x2, w, U_("sm")), { svg: svEl(figSpr(x1)), text: `Dinamometrin yayından asılmış yük Yerin səthində yayı ${x1} sm uzadır. Eyni dinamometr və eyni yük kürə şəkilli planetin səthinə gətirilir. Planetin orta sıxlığı Yerinkinin ${F(a)} misli, radiusu Yerinkinin ${F(b)} mislidir. Yük hərəkətsizdir, yay Huk qanununa tabedir. Planetdə yayın uzanması neçə sm olar?`,
        solution: `Yay yükün çəkisi ilə uzanır: kx = mg, deməli x ~ g. Kürə üçün M = ρ·(4/3)πR³, g = GM/R² = (4/3)πGρR, yəni g ~ ρR. g_p/g = ${F(a)}·${F(b)} = ${F(a * b)}. x₂ = x₁·${F(a * b)} = ${Fx(x2)} sm. Tələlər: ${Fx(w[0])} sm — M-i sıxlığa bərabər götürmək (g ~ ρ/R²); ${Fx(w[1])} sm — M ~ ρR³-dən sonra R²-na bölməyi unutmaq (g ~ ρR³); ${Fx(w[2])} sm — g ~ ρR² yazmaq; ${Fx(w[3])} sm — g ~ ρ/R yazmaq.` });
    }) },
    // 7. Kepler III: comet period from the perihelion and aphelion (picture)
    { tip: "qapali", gen: () => again(() => {
      const [rp, ra, a] = pick(TRI), T = a ** 1.5;
      const cand = [[a, "T ~ a götürmək"], [a * a, "T ~ a²"], [a ** 3, "T² = a³-də kvadratı unutmaq (T = a³)"], [Math.sqrt(a), "T ~ √a"], [ra ** 1.5, "afel məsafəsini yarımox götürmək (" + F(ra) + "^(3/2))"], [rp ** 1.5, "perihel məsafəsini yarımox götürmək (" + F(rp) + "^(3/2))"]].filter(c => ok2(c[0]));
      if (!ok2(T) || cand.length < 4) return null;
      const ch = cand.map(c => [Math.random(), c]).sort((p, q) => p[0] - q[0]).slice(0, 4).map(p => p[1]), w = ch.map(c => c[0]);
      return mc(ae(T, w, U_("il")), { svg: svEl(figEll(rp, ra, { lp: "r_p", la: "r_a" })), text: `Kometin orbiti Günəşin fokusda olduğu ellipsdir (şəkildə r_p — Günəşə ən yaxın məsafə, r_a — ən uzaq məsafə). Perihelidə (ən yaxın nöqtədə) Günəşə məsafə r_p = ${F(rp)} AU, afelidə (ən uzaq nöqtədə) r_a = ${F(ra)} AU-dur. Kometin Günəş ətrafında dövr müddəti neçə ildir? (1 AU — Yerin orbit radiusu, Yerin dövr müddəti 1 ildir.)`,
        solution: `Kepler III-də yarımox lazımdır: a = (r_p + r_a)/2 = (${F(rp)} + ${F(ra)})/2 = ${F(a)} AU. T² = a³ → T = ${F(a)}^(3/2) = ${F(a)}·${F(Math.sqrt(a))} = ${Fx(T)} il. Tələlər: ${ch.map(c => Fx(c[0]) + " il — " + c[1]).join("; ")}.` });
    }) },
    // 8. incline on a planet (sürtünmə + cazibə)
    { tip: "qapali", birlesik: "fiz-surtunme-maili", gen: () => again(() => {
      const a = pick([0.5, 2, 4, 8, 9, 16]), b = pick([0.5, 2, 3, 4]), gp = gp_(a, b), mu = pick([0.25, 0.5]), ac = gp * (0.6 - 0.8 * mu);
      if (gp < 1 || gp > 80) return null;
      const w = [gp * 0.6, g * (0.6 - 0.8 * mu), gp * (0.6 + 0.8 * mu), gp * (0.6 - 0.6 * mu)]; if (![ac, ...w].every(v => ok2(v))) return null;
      return mc(ae(ac, w, U_("m/s²")), { svg: svEl(figIncl()), text: `Planetin kütləsi Yerinkinin ${F(a)} misli, radiusu Yerinkinin ${F(b)} mislidir. Planetin səthində maili müstəvinin bucağı α üçün sin α = 0,6, cos α = 0,8-dir; cisimlə müstəvi arasında sürtünmə əmsalı μ = ${F(mu)}. Cisim müstəvi boyunca aşağı sürüşür. Cismin təcili nə qədərdir? (Yerdə g = 10 m/s²; havanın müqaviməti yoxdur.)`,
        solution: `g_p = 10·${F(a)}/${F(b)}² = ${F(gp)} m/s². Müstəvi boyunca: ma = mg_p·sin α − μ·mg_p·cos α → a = g_p(sin α − μ cos α) = ${F(gp)}·(0,6 − ${F(mu)}·0,8) = ${F(gp)}·${F(+(0.6 - 0.8 * mu).toFixed(2))} = ${Fx(ac)} m/s². Tələlər: ${Fx(w[0])} m/s² — sürtünməni unutmaq; ${Fx(w[1])} m/s² — Yerin g-sini götürmək; ${Fx(w[2])} m/s² — sürtünmənin işarəsini səhv yazmaq (sürtünmə hərəkətin əksinədir); ${Fx(w[3])} m/s² — N = mg_p·cos α əvəzinə mg_p·sin α götürmək.` });
    }) },
    // 9. v–t graph of a body thrown up on a planet → mass of the planet (kinematika + cazibə)
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const t1 = pick([2, 2.5, 4, 5, 8]), gp = pick([1.25, 2, 2.5, 4, 5, 8, 12.5, 16, 20, 25, 40]), v0 = gp * t1, b = pick([0.5, 2, 3, 4, 5]), r = gp / g * b * b;
      if (!nice(v0, 1) || v0 > 100) return null;
      const w = [gp / g, gp / g / (b * b), gp / g * b, g / gp * b * b]; if (![r, ...w].every(v => ok2(v))) return null;
      return mc(ae(r, w, x => F(+x.toFixed(4)) + " dəfə"), { svg: svEl(figPlot([[0, v0], [t1, 0]], [[t1, 0]], [v0], "t, s", "v, m/s", "Şaquli yuxarı atılan cismin sürətinin vaxtdan asılılıq qrafiki: " + F(v0) + " m/s-dən " + F(t1) + " s-də sıfıra qədər azalır")),
        text: `Planetin səthindən şaquli yuxarı atılan cismin sürət proyeksiyasının (ox yuxarı) vaxtdan asılılıq qrafiki şəkildə verilib (qalxma hissəsi, atmosfer yoxdur). Planetin radiusu Yerin radiusunun ${F(b)} mislidir. Planetin kütləsi Yerin kütləsinin neçə mislidir? (Yerdə g = 10 m/s².)`,
        solution: `Qrafikdən təcil proyeksiyası: a_y = (0 − ${F(v0)})/${F(t1)} = −${F(gp)} m/s² (sürət azalır); sərbəstdüşmə təcili modulca g_p = |a_y| = ${F(gp)} m/s². g = GM/R² → M ~ gR². M_p/M_Y = (g_p/g)·(R_p/R_Y)² = (${F(gp)}/10)·${F(b)}² = ${F(gp / g)}·${F(b * b)} = ${Fx(r)}. Tələlər: ${Fx(w[0])} — radiusu unutmaq (yalnız g_p/g); ${Fx(w[1])} — R²-nı vurmaq əvəzinə bölmək; ${Fx(w[2])} — R² əvəzinə R götürmək; ${Fx(w[3])} — g nisbətini tərsinə yazmaq.` });
    }) },
    // 10. Kepler II: speed at the farthest point (picture); the central star's mass is "chosen to fit", so the numbers are consistent
    { tip: "qapali", gen: () => again(() => {
      const rp = pick([20, 30, 40, 50, 60, 80]), k = pick([2, 3, 4]), ra = rp * k * k, vp = pick([20, 24, 30, 36, 40, 48, 60, 72, 80, 90, 100, 120]), va = vp / (k * k);
      const w = [vp * k * k, vp / k ** 4, vp / k, vp]; if (![va, ...w].every(v => ok2(v))) return null;
      return mc(ae(va, w, U_("km/s")), { svg: svEl(figEll(rp, ra, { lp: "r_p", la: "r_a", vp: "v_p", va: "v_a", sun: "ulduz", aria: "Ellips orbit: ulduza ən yaxın nöqtədə r_p məsafə və v_p sürət, ən uzaq nöqtədə r_a məsafə və v_a sürət; ulduz fokusdadır" })), text: `Kometin orbiti ulduzun fokusda olduğu ellipsdir. Ulduza ən yaxın nöqtədə məsafə r_p = ${rp} mln km, sürət v_p = ${vp} km/s-dir; ən uzaq nöqtədə məsafə r_a = ${ra} mln km-dir (ulduzun kütləsi bu ədədlərə uyğun seçilib). Ən uzaq nöqtədə kometin sürəti v_a nə qədərdir?`,
        solution: `Ən yaxın və ən uzaq nöqtədə sürət radius-vektora perpendikulyardır; Kepler II (bərabər zamanda bərabər sahə) buradan r_p·v_p = r_a·v_a verir. v_a = v_p·r_p/r_a = ${vp}·${rp}/${ra} = ${Fx(va)} km/s. Tələlər: ${Fx(w[0])} km/s — nisbəti tərsinə yazmaq (uzaqda sürət kiçik olmalıdır); ${Fx(w[1])} km/s — nisbəti kvadrata yüksəltmək; ${Fx(w[2])} km/s — kök almaq; ${Fx(w[3])} km/s — "sürət dəyişmir" (dairəvi orbit üçün doğrudur, ellips üçün yox).` });
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
      key: "fiz-cazibe", title: "Ümumdünya cazibə qanunu, Kepler qanunları, peyklər", fenn: "fizika", link: "dersler/fiz-cazibe.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI və xüsusi: m/s², km/s, km, dəq, il). Onluq kəsr vergül və ya nöqtə ilə: 0,5. g = 10 m/s², R_Yer = 6400 km.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["qanun", "qanun", "g", "g", "v1", "v1", "period", "kepler", "kepler", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-cazibe.html")) b.push("dersler/fiz-cazibe.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
