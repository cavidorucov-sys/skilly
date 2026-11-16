// Fizika · Arximed qüvvəsi; kəsilməzlik teoremi — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s², ρ_su = 1000 kq/m³.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");          // 0.04 → "0,04"
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;        // v has at most d decimals
  const R = (v, unit, extra) => { v = +(+v).toFixed(6); return Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra); };
  const g = 10;
  const LIQ = [["su", 1000], ["kerosin", 800], ["benzin", 700], ["bitki yağı", 900], ["duzlu su məhlulu", 1200], ["civə", 13600]];

  const levels = [
    { id: "fa", ad: "F_A = ρ·g·V", izah: "Arximed qüvvəsi = sıxışdırılan mayenin çəkisi: F_A = ρ_maye·g·V_batan. Həcmi m³-ə çevir: 1 dm³ = 0,001 m³, 1 sm³ = 0,000001 m³.",
      gen() {
        const kind = pick(["su", "dm", "dm", "yarim", "V", "rho", "terazi"]);
        if (kind === "su") {
          const V = pick([50, 100, 150, 200, 250, 400, 500, 800, 1000]), Fa = V / 100;
          return R(Fa, "N", { text: `Həcmi ${V} sm³ olan cisim tam suya batırılıb. Ona təsir edən Arximed qüvvəsi nə qədərdir?`,
            solution: `V = ${V} sm³ = ${F(V / 1e6)} m³. F_A = ρgV = 1000·10·${F(V / 1e6)} = ${F(Fa)} N.` });
        }
        if (kind === "dm") {
          const [nm, rho] = pick(LIQ), V = pick([1, 2, 3, 5, 8, 10, 12, 20, 50]), Fa = rho * g * V / 1000;
          return R(Fa, "N", { text: `Həcmi ${V} dm³ olan cisim mayeyə tam batırılıb (maye: ${nm}, ρ = ${rho} kq/m³). Arximed qüvvəsi nə qədərdir?`,
            solution: `V = ${V} dm³ = ${F(V / 1000)} m³. F_A = ρgV = ${rho}·10·${F(V / 1000)} = ${F(Fa)} N.` });
        }
        if (kind === "yarim") {
          const V = pick([2, 4, 6, 8, 10, 20, 40]), [txt, fr] = pick([["yarısı", 1 / 2], ["dörddə biri", 1 / 4], ["dörddə üçü", 3 / 4]]), Fa = g * V * fr;
          if (!nice(Fa, 3)) return levels[0].gen();
          return R(Fa, "N", { text: `Həcmi ${V} dm³ olan taxta blok suda üzür, onun həcminin ${txt} suya batıb. Arximed qüvvəsi nə qədərdir?`,
            solution: `Batan həcm: ${V}·${txt === "yarısı" ? "1/2" : txt === "dörddə biri" ? "1/4" : "3/4"} = ${F(V * fr)} dm³ = ${F(V * fr / 1000)} m³. F_A = 1000·10·${F(V * fr / 1000)} = ${F(Fa)} N.` });
        }
        if (kind === "V") {
          const [nm, rho] = pick(LIQ.slice(0, 5)), V = pick([1, 2, 3, 4, 5, 6, 8, 10, 15, 20, 25]), Fa = rho * g * V / 1000;
          return R(V, "dm³", { text: `Cisim mayeyə tam batırılıb (maye: ${nm}, ρ = ${rho} kq/m³). Ona təsir edən Arximed qüvvəsi ${F(Fa)} N-dur. Cismin həcmi neçə dm³-dir?`,
            solution: `V = F_A/(ρg) = ${F(Fa)}/(${rho}·10) = ${F(V / 1000)} m³ = ${V} dm³.` });
        }
        if (kind === "rho") {
          const rho = pick([700, 800, 900, 1000, 1200, 1500, 2000]), V = pick([2, 4, 5, 10, 20]), Fa = rho * g * V / 1000;
          return R(rho, "kq/m³", { text: `Həcmi ${V} dm³ olan cisim mayeyə tam batırılıb və ona ${F(Fa)} N Arximed qüvvəsi təsir edir. Mayenin sıxlığı nə qədərdir?`,
            solution: `ρ = F_A/(gV) = ${F(Fa)}/(10·${F(V / 1000)}) = ${rho} kq/m³.` });
        }
        const V = pick([100, 200, 250, 400, 500, 1000]), Fa = V / 100;
        return R(Fa, "N", { text: `Su dolu stəkan tərəzinin üstündədir. Stəkanın içinə ipdən asılmış, həcmi ${V} sm³ olan metal kürə salındı; kürə tam batıb, stəkanın dibinə və divarına toxunmur, su daşmır. Tərəzinin göstərdiyi qüvvə neçə N artdı?`,
          solution: `Su kürəyə yuxarı F_A qüvvəsi ilə təsir edir, Nyutonun III qanununa görə kürə də suya aşağı eyni qüvvə ilə təsir edir. Tərəzinin artımı F_A = ρgV = 1000·10·${F(V / 1e6)} = ${F(Fa)} N.` });
      } },
    { id: "cekisu", ad: "Mayedə çəki", izah: "Mayedə cismin çəkisi (dinamometrin göstərişi) P = mg − F_A = mg − ρ_maye·g·V. Havada çəkini mg götür (havanın itələməsi nəzərə alınmır).",
      gen() {
        const kind = pick(["dm", "dm", "rho", "dif", "kerosin", "ip"]);
        if (kind === "dm") {
          let m, V; do { m = rnd(2, 16); V = rnd(1, m - 1); } while (false);
          return R(10 * (m - V), "N", { text: `Kütləsi ${m} kq, həcmi ${V} dm³ olan metal parça ipdən asılıb suya tam batırılıb. İpin dartılma qüvvəsi nə qədərdir?`,
            solution: `mg = ${m * g} N. F_A = 1000·10·${F(V / 1000)} = ${V * g} N. Dartılma: T = mg − F_A = ${m * g} − ${V * g} = ${F(10 * (m - V))} N.` });
        }
        if (kind === "rho") {
          let rho, m, P; do { rho = pick([2000, 2500, 4000, 5000, 8000, 10000]); m = pick([1, 2, 2.5, 4, 5, 8, 10]); P = m * g * (1 - 1000 / rho); } while (!nice(P, 3));
          return R(P, "N", { text: `Sıxlığı ${rho} kq/m³, kütləsi ${F(m)} kq olan bircins cisim dinamometrdən asılıb və suya tam batırılıb. Dinamometrin göstərişi nə qədərdir?`,
            solution: `V = m/ρ = ${F(m)}/${rho} = ${F(m / rho)} m³. F_A = 1000·10·${F(m / rho)} = ${F(1000 * g * m / rho)} N. P = mg − F_A = ${F(m * g)} − ${F(1000 * g * m / rho)} = ${F(P)} N.` });
        }
        if (kind === "dif") {
          const V = pick([50, 100, 150, 200, 250, 400, 500]), P1 = pick([2, 3, 4, 5, 6, 8, 10, 12, 15]) + V / 100, P2 = P1 - V / 100;
          return R(V, "sm³", { text: `Cisim dinamometrdən asılıb: havada ${F(P1)} N, suya tam batırılanda ${F(P2)} N göstərir. Cismin həcmi neçə sm³-dir?`,
            solution: `Çəkinin azalması Arximed qüvvəsidir: F_A = ${F(P1)} − ${F(P2)} = ${F(P1 - P2)} N. V = F_A/(ρg) = ${F(P1 - P2)}/(1000·10) = ${F(V / 1e6)} m³ = ${V} sm³.` });
        }
        if (kind === "kerosin") {
          const [nm, rho] = pick(LIQ.slice(1, 5)), V = pick([2, 4, 5, 10]), m = V + pick([2, 3, 4, 5]), P = m * g - rho * g * V / 1000;
          return R(P, "N", { text: `Kütləsi ${m} kq, həcmi ${V} dm³ olan cisim ipdən asılıb və mayeyə tam batırılıb (maye: ${nm}, ρ = ${rho} kq/m³). İpin dartılma qüvvəsi nə qədərdir?`,
            solution: `mg = ${m * g} N. F_A = ${rho}·10·${F(V / 1000)} = ${F(rho * g * V / 1000)} N. T = ${m * g} − ${F(rho * g * V / 1000)} = ${F(P)} N.` });
        }
        const V = pick([2, 4, 5, 8, 10]), m = V * pick([2, 3, 4]);
        return R(m * g - V * g, "N", { text: `Çaydan ${m} kq kütləli, ${V} dm³ həcmli daşı su altından yuxarı qaldırırlar (daş hələ tam suyun içindədir). Daşı bərabər sürətlə qaldırmaq üçün ən azı nə qədər qüvvə lazımdır?`,
          solution: `Bərabər sürət: qüvvələr tarazdır. F + F_A = mg → F = mg − F_A = ${m * g} − ${V * g} = ${(m - V) * g} N. (Sudan çıxanda F artacaq.)` });
      } },
    { id: "uzme", ad: "Üzmə şərti", izah: "Üzəndə F_A = mg → ρ_cisim·V = ρ_maye·V_batan. Batan hissə: V_batan/V = ρ_cisim/ρ_maye. Cisim yalnız ρ_cisim < ρ_maye olanda üzür.",
      gen() {
        const kind = pick(["pay", "pay", "rho", "buz", "yuk", "sal", "dib", "iki"]);
        if (kind === "pay") {
          const rm = pick([800, 1000, 1000, 1200, 2000]);
          let rc, p; do { rc = pick([200, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500]); p = rc / rm * 100; } while (rc >= rm || !nice(p, 2));
          return R(p, "%", { text: `Sıxlığı ${rc} kq/m³ olan cisim sıxlığı ${rm} kq/m³ olan mayedə üzür. Həcminin neçə faizi mayeyə batıb?`,
            solution: `Üzmə: ρ_cisim·V·g = ρ_maye·V_batan·g → V_batan/V = ${rc}/${rm} = ${F(rc / rm)} = ${F(p)}%.` });
        }
        if (kind === "rho") {
          const [txt, fr] = pick([["1/5", .2], ["2/5", .4], ["3/5", .6], ["3/4", .75], ["1/4", .25], ["9/10", .9], ["7/10", .7], ["1/2", .5]]);
          return R(1000 * fr, "kq/m³", { text: `Cisim suda üzür və onun həcminin ${txt} hissəsi suya batıb. Cismin sıxlığı nə qədərdir?`,
            solution: `ρ_cisim = ρ_su·V_batan/V = 1000·${txt} = ${F(1000 * fr)} kq/m³.` });
        }
        if (kind === "buz") {
          const rc = pick([900, 800, 600, 500, 750]), rm = 1000;
          return R((rm - rc) / rm * 100, "%", { text: `Sıxlığı ${rc} kq/m³ olan cisim suda üzür. Həcminin neçə faizi suyun səthindən yuxarıda qalır?`,
            solution: `Batan hissə ${rc}/1000 = ${F(rc / 10)}%. Yuxarıda qalan: 100% − ${F(rc / 10)}% = ${F((rm - rc) / 10)}%.` });
        }
        if (kind === "yuk") {
          let rc, V, m; do { rc = pick([400, 500, 600, 700, 800, 900]); V = pick([2, 5, 10, 20, 25, 50]); m = (1000 - rc) * V / 1000; } while (!nice(m, 2));
          return R(m, "kq", { text: `Sıxlığı ${rc} kq/m³, həcmi ${V} dm³ olan taxta blok suda üzür. Onun üstünə ən çoxu hansı kütləli yük qoymaq olar ki, blok tam suya batsın, amma batmasın? (Yükün həcmi və suya toxunması nəzərə alınmır.)`,
            solution: `Sərhəd halında blok tam batıb: F_A = (m₀ + m)g. F_A = ρ_suVg → m = ρ_suV − ρ_cismV = (1000 − ${rc})·${F(V / 1000)} = ${F(m)} kq.` });
        }
        if (kind === "sal") {
          let n, V, rc, mp, N; do { n = pick([4, 5, 6, 8, 10]); V = pick([0.1, 0.15, 0.2, 0.25, 0.3]); rc = pick([500, 600, 700, 800]); mp = pick([50, 60, 80, 100]); N = n * V * (1000 - rc) / mp; } while (!Number.isInteger(+N.toFixed(8)));
          return R(N, "nəfər", { text: `Sal ${n} eyni tirdən düzəldilib. Hər tirin həcmi ${F(V)} m³, sıxlığı ${rc} kq/m³-dür. Sal tam batanadək ən çoxu kütləsi ${mp} kq olan neçə nəfər minə bilər?`,
            solution: `Salın ümumi həcmi ${n}·${F(V)} = ${F(n * V)} m³. Yükqaldırma: (ρ_su − ρ_tir)·V = (1000 − ${rc})·${F(n * V)} = ${F((1000 - rc) * n * V)} kq. ${F((1000 - rc) * n * V)}/${mp} = ${F(N)} nəfər.` });
        }
        if (kind === "dib") {
          let H, rc, d; do { H = pick([10, 12, 15, 20, 25, 30, 40]); rc = pick([400, 500, 600, 700, 800, 900]); d = H * rc / 1000; } while (!nice(d, 2));
          return R(d, "sm", { text: `Hündürlüyü ${H} sm olan, sıxlığı ${rc} kq/m³ olan düz silindr (şaquli vəziyyətdə) suda üzür. Onun suya batan hissəsinin hündürlüyü neçə sm-dir?`,
            solution: `Eyni əsas sahəsi: ρ_cisim·S·H = ρ_su·S·d → d = H·${rc}/1000 = ${F(d)} sm.` });
        }
        let rc, x; do { rc = pick([820, 840, 860, 880, 900, 920, 940, 960, 980]); x = (rc - 800) / 2; } while (false);
        return R(x, "%", { text: `Stəkana sıxlığı 800 kq/m³ olan yağ və onun altına su tökülüb (mayelər qarışmır). Sıxlığı ${rc} kq/m³ olan kürə iki mayenin sərhəddində üzür, onun hissəsi suda, hissəsi yağdadır. Kürənin həcminin neçə faizi suya batıb?`,
          solution: `Suda x, yağda (1 − x) hissə. Şərt: ρ_cismV = ρ_suxV + ρ_yağ(1 − x)V → ${rc} = 1000x + 800(1 − x) → 200x = ${rc - 800} → x = ${F((rc - 800) / 200)} = ${F(x)}%.` });
      } },
    { id: "sixliq", ad: "Çəkilərdən sıxlıq", izah: "Havada P₁ = ρVg, suda P₂ = P₁ − ρ_suVg. Buradan V = (P₁ − P₂)/(ρ_su·g), ρ = ρ_su·P₁/(P₁ − P₂). Naməlum mayeni də eyni cismi batırmaqla tapmaq olur.",
      gen() {
        const kind = pick(["rho", "rho", "maye", "boşluq", "erinti"]);
        if (kind === "rho") {
          let rho, V, P1, P2; do { rho = pick([1500, 2000, 2500, 2700, 3000, 4000, 5000, 7800, 8000, 8900, 10500]); V = pick([50, 100, 200, 250, 400, 500]); P1 = rho * V * 1e-5; P2 = P1 - V / 100; } while (!nice(P1, 2) || P2 <= 0);
          return R(rho, "kq/m³", { text: `Metal parça dinamometrdən asılıb: havada ${F(P1)} N, suya tam batırılanda ${F(P2)} N göstərir. Metalın sıxlığı nə qədərdir?`,
            solution: `F_A = ${F(P1)} − ${F(P2)} = ${F(P1 - P2)} N. ρ = ρ_su·P₁/(P₁ − P₂) = 1000·${F(P1)}/${F(P1 - P2)} = ${rho} kq/m³.` });
        }
        if (kind === "maye") {
          let rl, V, P1, P2, P3; do { rl = pick([700, 800, 900, 1200, 1250, 1500]); V = pick([100, 200, 250, 400, 500]); P1 = pick([4, 5, 6, 8, 10]) * V / 100; P2 = P1 - V / 100; P3 = P1 - rl * V * 1e-5; } while (!nice(P3, 3) || P3 <= 0 || P2 <= 0);
          return R(rl, "kq/m³", { text: `Cismi dinamometrdən asıb ölçdülər: havada ${F(P1)} N, suda ${F(P2)} N, naməlum mayedə ${F(P3)} N. Mayenin sıxlığı nə qədərdir? (Cisim hər ikisinə tam batırılıb.)`,
            solution: `Hər iki halda həcm eynidir. Suda çəki itkisi ${F(P1 - P2)} N, mayedə ${F(P1 - P3)} N. Arximed qüvvələri sıxlığa mütənasibdir: ρ_maye = 1000·${F(P1 - P3)}/${F(P1 - P2)} = ${rl} kq/m³.` });
        }
        if (kind === "boşluq") {
          let rho, Vs, Vc, m, P1, P2; do { rho = pick([2700, 7800, 8900]); Vs = pick([100, 200, 300]); Vc = pick([50, 100, 150, 200, 250, 300]); m = rho * Vs * 1e-6; P1 = m * g; P2 = P1 - (Vs + Vc) / 100; } while (!nice(P1, 3) || P2 <= 0);
          return R(Vc, "sm³", { text: `Sıxlığı ${rho} kq/m³ olan metaldan hazırlanmış topun içi boşluqludur. Topun havada çəkisi ${F(P1)} N, suya tam batırılanda dinamometrin göstərişi ${F(P2)} N-dur. Topun içindəki boşluğun həcmi neçə sm³-dir?`,
            solution: `F_A = ${F(P1)} − ${F(P2)} = ${F(P1 - P2)} N → topun tam həcmi V = ${F(P1 - P2)}/(1000·10) = ${F((Vs + Vc) / 1e6)} m³ = ${Vs + Vc} sm³. Metalın həcmi m/ρ = ${F(P1 / g)}/${rho} = ${F(Vs / 1e6)} m³ = ${Vs} sm³. Boşluq: ${Vs + Vc} − ${Vs} = ${Vc} sm³.` });
        }
        let V1, V2, m, P1, P2;
        do { V1 = pick([20, 30, 40, 50, 60, 100]); V2 = pick([10, 20, 30, 40, 50]); m = 2.7 * V1 + 8.9 * V2; P1 = m / 100; P2 = P1 - (V1 + V2) / 100; } while (!nice(P1, 4));
        return R(8.9 * V2, "q", { text: `Alüminium (2,7 q/sm³) və misdən (8,9 q/sm³) ərinti hazırlanıb. Ərinti dinamometrdən asılıb: havada ${F(P1)} N, suya tam batırılanda ${F(P2)} N göstərir. Ərintidəki misin kütləsi neçə qramdır? (Ərintidə həcmlər toplanır.)`,
          solution: `F_A = ${F(P1 - P2)} N → V = ${F((P1 - P2) * 100)} sm³. Kütlə m = P₁/g = ${F(m)} q. V₁ + V₂ = ${V1 + V2}, 2,7V₁ + 8,9V₂ = ${F(m)}. İkinci tənlikdən 2,7·${V1 + V2} = ${F(2.7 * (V1 + V2))} çıx: 6,2V₂ = ${F(m - 2.7 * (V1 + V2))} → V₂ = ${V2} sm³. Misin kütləsi: 8,9·${V2} = ${F(8.9 * V2)} q.` });
      } },
    { id: "kesilmez", ad: "Kəsilməzlik: S₁v₁ = S₂v₂", izah: "Sıxılmayan mayenin borudan axınında hər kəsikdən vahid zamanda eyni həcm keçir: Q = S·v = const. Daralan yerdə sürət artır. Sahə diametrin kvadratı ilə mütənasibdir.",
      gen() {
        const kind = pick(["sah", "d", "d", "nozzle", "Q", "vaxt", "cay"]);
        if (kind === "sah") {
          let S1, S2, v1, v2; do { S1 = pick([2, 4, 5, 10, 20, 25, 40, 50]); S2 = pick([1, 2, 4, 5, 10, 20, 25, 50, 100]); v1 = pick([0.5, 1, 1.5, 2, 3, 4, 5]); v2 = v1 * S1 / S2; } while (S1 === S2 || !nice(v2, 3));
          return R(v2, "m/s", { text: `Boru kəsiyinin sahəsi ${S1} sm²-dən ${S2} sm²-ə dəyişir. Birinci hissədə su ${F(v1)} m/s sürətlə axır. İkinci hissədə sürət nə qədərdir?`,
            solution: `S₁v₁ = S₂v₂ → v₂ = v₁S₁/S₂ = ${F(v1)}·${S1}/${S2} = ${F(v2)} m/s.` });
        }
        if (kind === "d") {
          let d1, d2, v1, v2; do { d1 = pick([2, 3, 4, 5, 6, 8, 10]); d2 = pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 15]); v1 = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]); v2 = v1 * (d1 / d2) ** 2; } while (d1 === d2 || !nice(v2, 3) || v2 > 60);
          return R(v2, "m/s", { text: `Suyun axdığı borunun diametri ${d1} sm-dən ${d2} sm-ə dəyişir. Birinci hissədə sürət ${F(v1)} m/s-dir. İkinci hissədə sürət nə qədərdir?`,
            solution: `Sahə diametrin kvadratına mütənasibdir: v₂ = v₁(d₁/d₂)² = ${F(v1)}·(${d1}/${d2})² = ${F(v1)}·${F((d1 / d2) ** 2)} = ${F(v2)} m/s.` });
        }
        if (kind === "nozzle") {
          let d1, d2, v2, v1; do { d1 = pick([2, 3, 4, 5, 6]); d2 = pick([1, 1.5, 2, 2.5, 3]); v2 = pick([4, 5, 8, 10, 12, 15, 20]); v1 = v2 * (d2 / d1) ** 2; } while (d2 >= d1 || !nice(v1, 3));
          return R(v1, "m/s", { text: `Bağ şlanqının diametri ${d1} sm, ucundakı ucluğun (başlığın) diametri ${F(d2)} sm-dir. Su ucluqdan ${F(v2)} m/s sürətlə çıxır. Şlanqın içində suyun sürəti nə qədərdir?`,
            solution: `S₁v₁ = S₂v₂ → v₁ = v₂(d₂/d₁)² = ${F(v2)}·(${F(d2)}/${d1})² = ${F(v2)}·${F((d2 / d1) ** 2)} = ${F(v1)} m/s.` });
        }
        if (kind === "Q") {
          let S, v, Q; do { S = pick([2, 4, 5, 10, 20, 25, 50]); v = pick([0.5, 1, 1.5, 2, 3, 4, 5]); Q = S * v / 10; } while (!nice(Q, 3));
          return R(Q, "L/s", { text: `Sahəsi ${S} sm² olan borudan su ${F(v)} m/s sürətlə axır. Hər saniyədə borudan neçə litr su keçir? (1 m³ = 1000 L)`,
            solution: `Q = S·v = ${S}·10⁻⁴·${F(v)} = ${F(S / 1e4 * v)} m³/s = ${F(Q)} L/s.` });
        }
        if (kind === "vaxt") {
          let S, v, Vl, t; do { S = pick([5, 10, 20, 25, 40, 50]); v = pick([1, 2, 2.5, 4, 5]); Vl = pick([20, 40, 50, 100, 200, 250]); t = Vl / (S * v / 10); } while (!nice(t, 3) || t > 600);
          return R(t, "s", { text: `Kranın borusunun kəsiyinin sahəsi ${S} sm²-dir, su ${F(v)} m/s sürətlə axır. ${Vl} litrlik çəni doldurmaq üçün neçə saniyə lazımdır?`,
            solution: `Q = S·v = ${S}·10⁻⁴·${F(v)} = ${F(S / 1e4 * v)} m³/s = ${F(S * v / 10)} L/s. t = V/Q = ${Vl}/${F(S * v / 10)} = ${F(t)} s.` });
        }
        let w1, w2, v1, v2; do { w1 = pick([12, 15, 20, 24, 30, 40]); w2 = pick([5, 6, 8, 10, 12, 15]); v1 = pick([0.5, 1, 1.5, 2, 3]); v2 = v1 * w1 / w2; } while (w2 >= w1 || !nice(v2, 3));
        return R(v2, "m/s", { text: `Çayın dərinliyi eynidir. Düz hissədə çayın eni ${w1} m, su ${F(v1)} m/s sürətlə axır. Daralan yerdə çayın eni ${w2} m olur. Orada suyun sürəti nə qədərdir?`,
          solution: `Kəsiyin sahəsi S = en·dərinlik, dərinlik eynidir → sahə enə mütənasibdir. w₁v₁ = w₂v₂ → v₂ = ${w1}·${F(v1)}/${w2} = ${F(v2)} m/s.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let m, V; do { m = rnd(3, 14); V = rnd(1, m - 1); } while (false);
          const Fa = V * g, W = m * g, T = W - Fa;
          task = `Kütləsi ${m} kq, həcmi ${V} dm³ olan cisim dinamometrdən asılıb və suya tam batırılıb. Dinamometrin göstərişi neçə N-dur?`;
          steps = [`Arximed qüvvəsi: F_A = ρgV = 1000·10·${F(V / 1000)} = ${F(Fa)} N.`,
            `Cismin ağırlığı: mg = ${m}·10 = ${W} N.`,
            `Dinamometrin göstərişi: P = mg − F_A = ${W} − ${F(Fa)} = ${F(T)} N.`];
          if (bad === 0) steps[0] = `Arximed qüvvəsi: F_A = ρgV = 1000·10·${F(V / 10000)} = ${F(V / 10)} N.`;
          if (bad === 0) steps[2] = `Dinamometrin göstərişi: P = mg − F_A = ${W} − ${F(V / 10)} = ${F(W - V / 10)} N.`;
          if (bad === 1) { steps[1] = `Cismin ağırlığı: mg = ${m} N.`; steps[2] = `Dinamometrin göstərişi: P = mg − F_A = ${m} − ${F(Fa)} = ${F(m - Fa)} N.`; }
          if (bad === 2) steps[2] = `Dinamometrin göstərişi: P = mg + F_A = ${W} + ${F(Fa)} = ${F(W + Fa)} N.`;
          why = [`1-ci addım: 1 dm³ = 0,001 m³ (0,0001 yox). Düzü: F_A = ${F(Fa)} N, cavab ${F(T)} N.`,
            `2-ci addım: ağırlıq mg = ${m}·10 = ${W} N; g-ni unutmaq olmaz. Düz cavab: ${F(T)} N.`,
            `3-cü addım: Arximed qüvvəsi yuxarı, ağırlıq aşağı yönəlib; dinamometr fərqi göstərir: P = mg − F_A = ${F(T)} N.`][bad];
        } else {
          let d1, d2, v1, v2; do { d1 = pick([4, 6, 8, 10]); d2 = pick([2, 4, 5]); v1 = pick([0.5, 1, 1.5, 2, 2.5]); v2 = v1 * (d1 / d2) ** 2; } while (d2 >= d1 || !nice(v2, 3));
          task = `Suyun axdığı borunun diametri ${d1} sm-dən ${d2} sm-ə daralır. Geniş hissədə sürət ${F(v1)} m/s-dir. Dar hissədə sürət nə qədərdir?`;
          steps = [`Su sıxılmır, hər kəsikdən eyni həcm keçir: S₁v₁ = S₂v₂.`,
            `Sahə diametrin kvadratı ilə mütənasibdir: v₂ = v₁(d₁/d₂)².`,
            `v₂ = ${F(v1)}·(${d1}/${d2})² = ${F(v1)}·${F((d1 / d2) ** 2)} = ${F(v2)} m/s.`];
          if (bad === 0) steps = [`Su sıxılmır, ona görə sürət hər yerdə eynidir: v₂ = v₁.`, `Deməli dar hissədə də sürət ${F(v1)} m/s olmalıdır.`, `v₂ = ${F(v1)} m/s.`];
          if (bad === 1) { steps[1] = `Sahə diametrə mütənasibdir: v₂ = v₁·d₁/d₂.`; steps[2] = `v₂ = ${F(v1)}·${d1}/${d2} = ${F(v1 * d1 / d2)} m/s.`; }
          if (bad === 2) steps[2] = `v₂ = ${F(v1)}/(${d1}/${d2})² = ${F(v1)}/${F((d1 / d2) ** 2)} = ${F(+(v1 / (d1 / d2) ** 2).toFixed(5))} m/s.`;
          why = [`1-ci addım: sürət eyni qalmır, hər saniyə keçən həcm eynidir (S·v = const). Düz cavab: ${F(v2)} m/s.`,
            `2-ci addım: S = πd²/4, yəni sahə diametrin <b>kvadratı</b> ilə mütənasibdir. Düz cavab: ${F(v2)} m/s.`.replace(/<\/?b>/g, ""),
            `3-cü addım: dar yerdə sürət artmalıdır, ona görə vurulur, bölünmür. v₂ = ${F(v2)} m/s.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Gəmi, aysberq, hava şarı, sualtı qayıq, areometr — hamısı Arximed qüvvəsidir.",
      gen() {
        const kind = pick(["gemi", "aysberq", "sar", "qayiq", "areometr", "sualti"]);
        if (kind === "gemi") {
          let L, B, dh, mt; do { L = pick([50, 80, 100, 120, 150]); B = pick([10, 15, 20, 25]); dh = pick([0.1, 0.2, 0.25, 0.4, 0.5]); mt = 1000 * L * B * dh / 1000; } while (!nice(mt, 2));
          return R(mt, "t", { text: `Barja dəniz limanında yüklənir. Onun su xəttindəki en kəsiyi düzbucaqlıdır: ${L} m × ${B} m (batan hissənin yan divarları şaquli). Yükləndikdən sonra barja ${F(dh)} m dərinə batdı. Yükün kütləsi neçə tondur? (ρ_su = 1000 kq/m³, 1 t = 1000 kq)`,
            solution: `Əlavə batan həcm ΔV = ${L}·${B}·${F(dh)} = ${F(L * B * dh)} m³. Yükün çəkisi əlavə Arximed qüvvəsinə bərabərdir: m = ρΔV = 1000·${F(L * B * dh)} = ${F(1000 * L * B * dh)} kq = ${F(mt)} t.` });
        }
        if (kind === "aysberq") {
          const alt = pick([900, 1800, 2700, 3600, 4500, 5400, 8100]), tot = alt / 0.9, up = tot - alt;
          return R(up, "m³", { text: `Aysberqin (ρ = 900 kq/m³) suyun altındakı hissəsinin həcmi ${alt} m³-dir. Suyun üstündə qalan hissəsinin həcmi neçə m³-dir? (ρ_su = 1000 kq/m³)`,
            solution: `Üzmə: ρ_buz·V = ρ_su·V_batan → V = 1000·${alt}/900 = ${F(tot)} m³. Yuxarıda: ${F(tot)} − ${alt} = ${F(up)} m³ (cəmi 10%).` });
        }
        if (kind === "sar") {
          let V, rh, me, m; do { V = pick([1000, 1500, 2000, 2500, 3000]); rh = pick([0.8, 0.9, 1.0]); me = pick([100, 150, 200, 250, 300, 400]); m = (1.2 - rh) * V - me; } while (!nice(m, 2) || m <= 0);
          return R(m, "kq", { text: `Hava şarının (zərfi) həcmi ${V} m³-dir. İçindəki qızdırılmış havanın sıxlığı ${F(rh)} kq/m³, ətraf havanın sıxlığı 1,2 kq/m³-dir. Zərfin və səbətin cəmi kütləsi ${me} kq-dır. Şarın qaldıra biləcəyi yükün (sərnişinlər) maksimal kütləsi nə qədərdir?`,
            solution: `Arximed qüvvəsi ətraf havanın çəkisinə bərabərdir: ρ_hava·V·g = 1,2·${V}·10. Şarın içindəki havanın çəkisi ${F(rh)}·${V}·10. Qaldırma: (1,2 − ${F(rh)})·${V} = ${F((1.2 - rh) * V)} kq-ın çəkisi. Zərf və səbət ${me} kq → yük ${F((1.2 - rh) * V)} − ${me} = ${F(m)} kq.` });
        }
        if (kind === "qayiq") {
          let V, mb, mp, N; do { V = pick([0.8, 1, 1.2, 1.5, 2, 2.5, 3]); mb = pick([20, 30, 40, 50, 60]); mp = pick([50, 60, 70, 80]); N = (1000 * V - mb) / mp; } while (!Number.isInteger(+N.toFixed(8)));
          return R(N, "nəfər", { text: `Rezin qayığın həcmi ${F(V)} m³, kütləsi ${mb} kq-dır. Qayığa ən çoxu kütləsi ${mp} kq olan neçə nəfər minə bilər ki, qayıq bortuna qədər suya batsın, amma dolmasın? (Qayığın bütün həcmi suyun içində sayılır.)`,
            solution: `Qayıq tam batanda Arximed qüvvəsi ρ_suVg = 1000·${F(V)}·10 = ${F(1e4 * V)} N olur, qaldırma gücü 1000·${F(V)} = ${F(1000 * V)} kq. Qayığın özü ${mb} kq → yükə ${F(1000 * V - mb)} kq qalır. ${F(1000 * V - mb)}/${mp} = ${F(N)} nəfər.` });
        }
        if (kind === "areometr") {
          let h1, h2, rho; do { h1 = pick([8, 10, 12, 15, 16, 20]); h2 = pick([5, 6, 8, 10, 12, 16, 20]); rho = 1000 * h1 / h2; } while (h1 === h2 || rho % 10 !== 0 || rho > 2000);
          return R(rho, "kq/m³", { text: `Silindr formalı areometr suda şaquli üzür və ${h1} sm batır. Naməlum mayedə o, ${h2} sm batır. Mayenin sıxlığı nə qədərdir?`,
            solution: `Areometrin çəkisi sabitdir, ona görə F_A eynidir: ρ_su·S·h₁ = ρ·S·h₂ → ρ = 1000·${h1}/${h2} = ${F(rho)} kq/m³.` });
        }
        let M, Vs, mb; do { M = pick([1500, 2000, 2500, 3000]); Vs = pick([2000, 2500, 3000, 3500]); mb = 1000 * Vs / 1000 - M; } while (mb <= 0);
        return R(mb, "t", { text: `Sualtı qayığın boş kütləsi ${M} t, həcmi ${Vs} m³-dir. Suyun içində tam batıb dayanması (üzməməsi və batmaması) üçün balast çənlərinə neçə ton su doldurmaq lazımdır? (ρ_su = 1000 kq/m³; 1 t = 1000 kq)`,
          solution: `Tam batanda Arximed qüvvəsi ρ_suVg, yəni 1000·${Vs} = ${Vs * 1000} kq-ın çəkisidir = ${Vs} t. Qayığın özü ${M} t → balast ${Vs} − ${M} = ${mb} t.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a picture (dynamometers, vessels,
  // floating blocks, pipes), several steps; the wrong options are the answers of typical mistakes. Questions 2 and 9 also use
  // "Təzyiq" (p = ρgh, p = F/S), question 10 uses Newton's III law (Nyuton qanunları).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const f4 = x => F(+x.toFixed(4));
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const fr = (p, q) => { const d = gcd(p, q); return q / d === 1 ? String(p / d) : p / d + "/" + q / d; };
  const K_ = "var(--ink,#17171a)", A_ = "var(--accent,#a32d2d)", V_ = "var(--vec,#0c447c)", M_ = "var(--muted,#6b6b73)", P_ = "var(--paper,#fff)", SO = "var(--accent-soft,#f3e3e3)";
  const r1 = n => +(+n).toFixed(1);
  const Ln = (x1, y1, x2, y2, c = K_, w = 2) => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const Tx = (x, y, s, a = "middle", c = K_, sz = 13) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const Ar = (x1, y1, x2, y2, c = A_) => { const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    return Ln(x1, y1, x2 - ux * 7, y2 - uy * 7, c, 2.5) + `<path d="M${r1(x2)} ${r1(y2)}L${r1(x2 - ux * 11 - uy * 5)} ${r1(y2 - uy * 11 + ux * 5)}L${r1(x2 - ux * 11 + uy * 5)} ${r1(y2 - uy * 11 - ux * 5)}z" fill="${c}"/>`; };
  const Bx = (x, y, w, hh, fill = P_, st = "") => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(hh)}" fill="${fill}" stroke="${K_}" stroke-width="1.5"${st}/>`;
  const hatch = (x1, x2, y, up) => { let o = Ln(x1, y, x2, y); for (let x = x1; x < x2 - 3; x += 8) o += Ln(x, y, x + 6, up ? y - 7 : y + 7, M_, 1.2); return o; };
  const vdim = (x, y1, y2, s, left) => Ln(x, y1, x, y2, M_, 1) + Ln(x - 4, y1, x + 4, y1, M_, 1) + Ln(x - 4, y2, x + 4, y2, M_, 1) + Tx(left ? x - 6 : x + 6, (y1 + y2) / 2 + 4, s, left ? "end" : "start", M_, 12);
  const hdim = (x1, x2, y, s) => Ln(x1, y, x2, y, M_, 1) + Ln(x1, y - 4, x1, y + 4, M_, 1) + Ln(x2, y - 4, x2, y + 4, M_, 1) + Tx((x1 + x2) / 2, y - 5, s, "middle", M_, 12);
  const S = (w, hh, inner, aria) => { const d = document.createElement("div"); d.innerHTML = `<svg viewBox="0 0 ${w} ${hh}" class="oy-svg" role="img" aria-label="${aria}">${inner}</svg>`; return d.firstChild; };
  // open vessel: water (or another liquid) from yW down to yB; the surface is drawn in blue
  const bk = (x0, x1, yT, yB, yW, fill = SO) => `<rect x="${x0}" y="${yW}" width="${x1 - x0}" height="${yB - yW}" fill="${fill}"/>` + Ln(x0, yT, x0, yB, K_, 2.5) + Ln(x0, yB, x1, yB, K_, 2.5) + Ln(x1, yB, x1, yT, K_, 2.5) + Ln(x0, yW, x1, yW, V_, 1.5);
  // spring balance hanging from the ceiling at x; the thread starts at (x, y0 + 46)
  const dyn = (x, y0) => hatch(x - 26, x + 26, y0, true) + Ln(x, y0, x, y0 + 10) + Bx(x - 11, y0 + 10, 22, 36) + [0, 1, 2, 3].map(i => Ln(x - 11, y0 + 17 + i * 8, x - 4, y0 + 17 + i * 8, M_, 1)).join("");

  // the same body on a spring balance in air and under water
  function figDyn(P1, P2) { const xl = 70, xr = 215;
    const o = dyn(xl, 8) + Ln(xl, 54, xl, 104) + Bx(xl - 13, 104, 26, 26, M_) + Tx(xl, 170, "havada", "middle", M_, 12) + Tx(xl, 188, "P₁ = " + F(P1) + " N")
      + bk(150, 280, 66, 150, 88) + dyn(xr, 8) + Ln(xr, 54, xr, 104) + Bx(xr - 13, 104, 26, 26, M_) + Tx(xr, 170, "suda", "middle", M_, 12) + Tx(xr, 188, "P₂ = " + F(P2) + " N");
    return S(300, 196, o, "Eyni cisim dinamometrdən havada asılıb (P₁), sonra suya tam batırılıb (P₂)"); }
  // cylinder on a spring balance, fully under water: the top face is h under the surface
  function figCyl(hh, H, S0, m) { const cx = 170, yW = 70, sc = 100 / (hh + H), yt = yW + hh * sc, yb = yt + H * sc;
    const o = bk(70, 285, 62, 188, yW) + dyn(cx, 10) + Ln(cx, 56, cx, yt) + Bx(cx - 22, yt, 44, yb - yt, M_) + Tx(cx + 16, 40, "m = " + F(m) + " kq", "start", K_, 12)
      + vdim(cx + 32, yW, yt, "h = " + hh + " sm") + vdim(cx + 32, yt, yb, "H = " + H + " sm") + Tx(cx - 28, (yt + yb) / 2 + 4, "S = " + S0 + " sm²", "end", K_, 12);
    return S(300, 196, o, "Silindr dinamometrdən asılıb və suya tam batıb; üst üzü səthdən h dərinlikdədir, hündürlüyü H"); }
  // a block floats in water (fraction fp/fq under), then in another liquid (dashed, unknown)
  function figFloat(fp, fq, rm) { const f = fp / fq, bw = 54, bh = 54, yW = 76, top = yW - (1 - f) * bh;
    const o = bk(15, 135, 46, 166, yW) + bk(165, 285, 46, 166, yW) + Bx(48, top, bw, bh) + Bx(198, yW - bh / 2, bw, bh, "none", ' stroke-dasharray="5 4"') + Tx(225, yW + 5, "?", "middle", M_, 18)
      + Tx(75, 30, "su: ρ = 1000 kq/m³", "middle", K_, 12) + Tx(225, 30, "maye: ρ = " + rm + " kq/m³", "middle", K_, 12)
      + Tx(75, 190, fp + "/" + fq + " hissə batıb", "middle", M_, 12) + Tx(225, 190, "batan hissə = ?", "middle", M_, 12);
    return S(300, 198, o, "Blok suda üzür (həcminin bir hissəsi batıb); sağda eyni blok başqa mayedə"); }
  // block at the border of two liquids, fp/fq of it in the upper one
  function figTwo(r1_, r2_, fp, fq) { const bh = 60, yI = 112, top = yI - fp / fq * bh;
    const o = `<rect x="30" y="52" width="160" height="${yI - 52}" fill="${V_}" fill-opacity="0.14"/><rect x="30" y="${yI}" width="160" height="${178 - yI}" fill="${SO}"/>`
      + Ln(30, 40, 30, 178, K_, 2.5) + Ln(30, 178, 190, 178, K_, 2.5) + Ln(190, 178, 190, 40, K_, 2.5) + Ln(30, yI, 190, yI, M_, 1) + Ln(30, 52, 190, 52, V_, 1.5) + Bx(80, top, 60, bh)
      + Tx(198, 84, "ρ₁ = " + r1_ + " kq/m³", "start", K_, 11) + Tx(198, 152, "ρ₂ = " + r2_ + " kq/m³", "start", K_, 11) + Tx(110, 196, "blokun " + fp + "/" + fq + " hissəsi yuxarı mayedədir", "middle", M_, 11);
    return S(300, 204, o, "Blok iki qarışmayan mayenin sərhədində üzür: yuxarıda yüngül, aşağıda ağır maye"); }
  // block fully under water, tied to the bottom by a thread
  function figTie(m, V) { const yW = 50;
    const o = bk(60, 240, 30, 170, yW) + Ln(150, 124, 150, 170, K_, 1.5) + `<circle cx="150" cy="170" r="3" fill="${K_}"/>` + Bx(130, 84, 40, 40) + Tx(178, 100, "m = " + F(m) + " kq", "start", K_, 12) + Tx(178, 116, "V = " + F(V) + " dm³", "start", K_, 12);
    return S(300, 180, o, "Blok iplə qabın dibinə bağlanıb və tam suyun içindədir"); }
  // floating block with a stone hung under it
  function figBelow(r1_, V1, r2_, V2, fa) { const yW = 62, cx = 190, bt = r1(yW - 48 * fa);
    const o = bk(100, 280, 20, 180, yW) + Bx(cx - 35, bt, 70, 48) + Ln(cx, bt + 48, cx, 130, K_, 1.5) + `<circle cx="${cx}" cy="146" r="16" fill="${M_}" stroke="${K_}" stroke-width="1.5"/>`
      + Tx(94, 38, "ρ₁ = " + r1_ + " kq/m³", "end", K_, 11) + Tx(94, 54, "V₁ = " + F(V1) + " dm³", "end", K_, 11) + Tx(94, 142, "ρ₂ = " + r2_ + " kq/m³", "end", K_, 11) + Tx(94, 158, "V₂ = " + F(V2) + " dm³", "end", K_, 11);
    return S(300, 190, o, "Üzən taxta blokun altından iplə daş asılıb; daş tam suyun içindədir"); }
  // pipe of diameter d1 splitting into two pipes of diameter d2
  function figBranch(d1, v1, d2) { const k = 7, h1 = d1 * k, h2 = d2 * k, yc = 85, ya = 45, yb = 125, WP = SO;
    const o = Bx(20, yc - h1 / 2, 80, h1, WP) + Bx(100, ya - h2 / 2, 18, yb - ya + h2, WP) + Bx(118, ya - h2 / 2, 137, h2, WP) + Bx(118, yb - h2 / 2, 137, h2, WP)
      + `<rect x="99" y="${r1(yc - h1 / 2 + 1)}" width="2.5" height="${r1(h1 - 2)}" fill="${WP}"/><rect x="117" y="${r1(ya - h2 / 2 + 1)}" width="2.5" height="${r1(h2 - 2)}" fill="${WP}"/><rect x="117" y="${r1(yb - h2 / 2 + 1)}" width="2.5" height="${r1(h2 - 2)}" fill="${WP}"/>`
      + Ar(32, yc, 80, yc, V_) + Ar(135, ya, 200, ya, V_) + Ar(135, yb, 200, yb, V_)
      + Tx(60, yc - h1 / 2 - 8, "d₁ = " + d1 + " sm", "middle", K_, 12) + Tx(60, yc + h1 / 2 + 18, "v₁ = " + F(v1) + " m/s", "middle", K_, 12)
      + Tx(190, ya - h2 / 2 - 8, "d₂ = " + d2 + " sm", "middle", K_, 12) + Tx(190, yb + h2 / 2 + 16, "d₂ = " + d2 + " sm", "middle", K_, 12) + Tx(260, ya + 4, "v₂ = ?", "start", K_, 12) + Tx(260, yb + 4, "v₂ = ?", "start", K_, 12);
    return S(300, 170, o, "Diametri d₁ olan boru diametri d₂ olan iki eyni boruya ayrılır"); }
  // pipe of two sections: length l1 diameter d1, then length l2 diameter d2
  function figTime(l1, d1, l2, d2, v1) { const k = 6, x0 = 20, x2 = 280, xs = x0 + (x2 - x0) * Math.min(0.7, Math.max(0.3, l1 / (l1 + l2))), yc = 62;
    const o = Bx(x0, yc - d1 * k / 2, xs - x0, d1 * k, SO) + Bx(xs, yc - d2 * k / 2, x2 - xs, d2 * k, SO) + `<rect x="${r1(xs - 1)}" y="${r1(yc - Math.min(d1, d2) * k / 2 + 1)}" width="2.5" height="${r1(Math.min(d1, d2) * k - 2)}" fill="${SO}"/>`
      + Ar(x0 + 10, yc, x0 + 50, yc, V_) + Ar(xs + 12, yc, xs + 50, yc, V_)
      + Tx((x0 + xs) / 2, yc - d1 * k / 2 - 8, "d₁ = " + d1 + " sm", "middle", K_, 12) + Tx((xs + x2) / 2, yc - d2 * k / 2 - 8, "d₂ = " + d2 + " sm", "middle", K_, 12)
      + Tx(x0 + 8, yc + d1 * k / 2 + 16, "v₁ = " + F(v1) + " m/s", "start", K_, 12)
      + hdim(x0, xs, 128, "l₁ = " + F(l1) + " m") + hdim(xs, x2, 128, "l₂ = " + F(l2) + " m");
    return S(300, 140, o, "İki hissədən ibarət boru: birinci hissənin uzunluğu l₁ diametri d₁, ikincinin l₂ və d₂"); }
  // two vessels: water of height h1; the same vessel with a floating block
  function figVessel(h1, S0, m, rc) { const yb = 170, dh = m * 1000 / S0, sc = 100 / (h1 + dh), yl = r1(yb - h1 * sc), yr = r1(yb - (h1 + dh) * sc), bt = r1(yr - 28 * (1 - rc / 1000));
    const o = bk(20, 120, 50, yb, yl) + vdim(48, yl, yb, "h₁", false) + Tx(70, 190, "h₁ = " + h1 + " sm", "middle", K_, 12)
      + Ar(128, 110, 160, 110, M_) + bk(170, 270, 50, yb, yr) + Bx(195, bt, 50, 28) + Tx(220, 190, "m = " + F(m) + " kq", "middle", K_, 12) + Tx(150, 207, "en kəsiyinin sahəsi S = " + S0 + " sm²", "middle", M_, 12);
    return S(300, 214, o, "Su dolu stəkan; sağda eyni stəkanda üzən taxta blok"); }
  // a glass of water on a scale, a ball on a spring balance dipped into it
  function figScale(M, m, V) { const cx = 150;
    const o = bk(100, 200, 66, 170, 96) + dyn(cx, 10) + Ln(cx, 56, cx, 115) + `<circle cx="${cx}" cy="130" r="15" fill="${M_}" stroke="${K_}" stroke-width="1.5"/>` + Bx(70, 170, 160, 14)
      + Tx(94, 128, "m = " + F(m) + " kq", "end", K_, 11) + Tx(94, 144, "V = " + V + " sm³", "end", K_, 11) + Tx(cx, 203, "tərəzi: " + F(M) + " kq (kürə batırılmamışdan əvvəl)", "middle", M_, 12);
    return S(300, 210, o, "Su dolu stəkan tərəzidədir; dinamometrdən asılmış kürə suya tam batırılır"); }

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. density of a metal from the spring-balance readings in air and in water
    { tip: "qapali", gen: () => again(() => {
      const rho = pick([2000, 2500, 2700, 3000, 4000, 5000, 7800, 8000, 8900]), V = pick([50, 100, 150, 200, 250, 400, 500]), P1 = +(rho * V * 1e-5).toFixed(4), P2 = +(P1 - V / 100).toFixed(4);
      if (!nice(P1, 2) || P2 <= 0) return null;
      const w = [rho - 1000, 2 * rho - 1000, rho / 10, rho * 10];
      return mc(ae(rho, w, U_("kq/m³")), { svg: figDyn(P1, P2), text: `Metal parça dinamometrdən asılıb: havada ${F(P1)} N, suya tam batırılanda ${F(P2)} N göstərir (şəkil). Metalın sıxlığı nə qədərdir? (g = 10 m/s², ρ_su = 1000 kq/m³; havanın itələməsi nəzərə alınmır.)`,
        solution: `Çəkinin azalması Arximed qüvvəsidir: F_A = P₁ − P₂ = ${F(P1)} − ${F(P2)} = ${F(P1 - P2)} N. F_A = ρ_su·g·V → V = ${F(P1 - P2)}/(1000·10) = ${F(V / 1e6)} m³ = ${V} sm³. Kütlə m = P₁/g = ${F(P1)}/10 = ${F(P1 / 10)} kq. ρ = m/V = ${F(P1 / 10)}/${F(V / 1e6)} = ${rho} kq/m³ (qısa: ρ = ρ_su·P₁/(P₁ − P₂)). Tələlər: P₂-ni P₁ əvəzinə götürmək (${rho - 1000} kq/m³), P₁ əvəzinə P₁ + P₂ götürmək (${2 * rho - 1000} kq/m³), g-ni unutmaq (${F(rho / 10)} və ${F(rho * 10)} kq/m³).` });
    }) },
    // 2. cylinder at depth: F_A = F_bottom − F_top = ρgSH (does not depend on h)
    { tip: "qapali", birlesik: "fiz-tezyiq", gen: () => again(() => {
      const m = pick([1, 1.5, 2, 2.5, 3, 4]), S0 = pick([10, 20, 25, 40, 50]), H = pick([5, 10, 15, 20]), hh = pick([10, 20, 30, 40, 50]);
      const FA = S0 * H / 100, Fu = S0 * hh / 100, Fl = S0 * (hh + H) / 100, W = m * g, P = W - FA;
      const w = [W - Fl, W - Fu, W, W + FA]; if (![P, ...w].every(x => ok2(x, 2))) return null;
      return mc(ae(P, w, U_("N")), { svg: figCyl(hh, H, S0, m), text: `Kütləsi ${F(m)} kq, hündürlüyü ${H} sm, əsasının sahəsi ${S0} sm² olan bircins silindr dinamometrdən şaquli asılıb və suya tam batırılıb (şəkil). Silindr dibə toxunmur, üst üzü suyun səthindən ${hh} sm dərindədir. Dinamometr neçə N göstərir? (g = 10 m/s², ρ_su = 1000 kq/m³; atmosfer təzyiqi nəzərə alınmır.)`,
        solution: `Üst üz ${hh} sm dərindədir: p₁ = ρgh = 1000·10·${F(hh / 100)} = ${100 * hh} Pa, F₁ = p₁S = ${100 * hh}·${F(S0 / 1e4)} = ${F(Fu)} N (aşağı). Alt üz ${hh + H} sm dərindədir: p₂ = ${100 * (hh + H)} Pa, F₂ = ${F(Fl)} N (yuxarı). Arximed qüvvəsi F_A = F₂ − F₁ = ${F(Fl)} − ${F(Fu)} = ${F(FA)} N (= ρgSH, dərinlikdən asılı deyil). Dinamometr P = mg − F_A = ${F(W)} − ${F(FA)} = ${F(P)} N. Tələlər: alt üzün qüvvəsini Arximed qüvvəsi saymaq (${F(W - Fl)} N), üst üzün qüvvəsini saymaq (${F(W - Fu)} N), suyu unutmaq (${F(W)} N), F_A-nı əlavə etmək (${F(W + FA)} N).` });
    }) },
    // 3. a floating block: the part under water in another liquid
    { tip: "qapali", gen: () => again(() => {
      const rc = pick([400, 500, 600, 700, 800]), rm = pick([800, 900, 1200, 1250, 1500, 2000]); if (rm <= rc) return null;
      const f = rc / 1000, p = fr(rc, 1000).split("/"), right = 100 * rc / rm, w = [rc * rm / 1e4, 100 * f, 100 - right, 100 - 100 * f];
      if (![right, ...w].every(x => ok2(x, 2) && x < 100)) return null;
      return mc(ae(right, w, U_("%")), { svg: figFloat(+p[0], +p[1], rm), text: `Bircins blok suda üzür və həcminin ${fr(rc, 1000)} hissəsi suya batıb (şəkil). Eyni blok sıxlığı ${rm} kq/m³ olan mayeyə salınsa və orada da üzsə, həcminin neçə faizi mayeyə batar? (ρ_su = 1000 kq/m³)`,
        solution: `Üzmə şərti: ρ_cisim·V = ρ_maye·V_batan. Suda: ρ_cisim = 1000·${fr(rc, 1000)} = ${rc} kq/m³. Mayedə: V_batan/V = ρ_cisim/ρ_m = ${rc}/${rm} = ${F(rc / rm)} = ${F(right)}%. Tələlər: nisbəti çevirmək (${F(100 * rc * rm / 1e6)}%), suda batan hissəni olduğu kimi saxlamaq (${F(100 * f)}%), yuxarıda qalan hissəni cavab yazmaq (${F(100 - right)}%).` });
    }) },
    // 4. block between two liquids: the density from the fractions
    { tip: "qapali", gen: () => again(() => {
      const [r1_, r2_] = pick([[800, 1000], [700, 1000], [900, 1000], [1000, 1200], [800, 1200], [900, 1200], [700, 900]]), [fp, fq] = pick([[1, 4], [1, 2], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10]]);
      const f = fp / fq, rho = r1_ * f + r2_ * (1 - f), w = [(r1_ + r2_) / 2, r1_ * (1 - f) + r2_ * f, r1_ * f, r2_ * (1 - f)];
      if (![rho, ...w].every(x => ok2(x, 0))) return null;
      return mc(ae(rho, w, U_("kq/m³")), { svg: figTwo(r1_, r2_, fp, fq), text: `Stəkanda sıxlığı ${r2_} kq/m³ olan mayenin üstündə sıxlığı ${r1_} kq/m³ olan, onunla qarışmayan yüngül maye var. Bircins blok onların sərhədində üzür: həcminin ${fr(fp, fq)} hissəsi yuxarı mayedə, qalanı aşağı mayedədir (şəkil). Blokun sıxlığı nə qədərdir?`,
        solution: `Blok üzür: mg = F₁ + F₂, yəni ρVg = ρ₁g·(${fr(fp, fq)})V + ρ₂g·(${fr(fq - fp, fq)})V. ρ = ${r1_}·${fr(fp, fq)} + ${r2_}·${fr(fq - fp, fq)} = ${F(r1_ * f)} + ${F(r2_ * (1 - f))} = ${F(rho)} kq/m³. Tələlər: iki sıxlığın ortasını götürmək (${F((r1_ + r2_) / 2)}), hissələri dəyişmək (${F(w[1])}), yalnız bir mayeni saymaq (${F(w[2])} və ${F(w[3])}).` });
    }) },
    // 5. block tied to the bottom: tension of the thread
    { tip: "qapali", gen: () => again(() => {
      const V = pick([3, 4, 5, 6, 8, 10]), m = pick([1, 1.5, 2, 2.5, 3, 4, 5, 6]); if (m >= V) return null;
      const FA = 10 * V, W = 10 * m, T = FA - W, w = [FA, W, FA + W, V - m]; if (![T, ...w].every(x => ok2(x, 2))) return null;
      return mc(ae(T, w, U_("N")), { svg: figTie(m, V), text: `Kütləsi ${F(m)} kq, həcmi ${V} dm³ olan blok suyun dibinə nazik iplə bağlanıb və tam suyun içindədir (şəkil). İpin dartılma qüvvəsi nə qədərdir? (g = 10 m/s², ρ_su = 1000 kq/m³; ipin çəkisi nəzərə alınmır.)`,
        solution: `Blokun üç qüvvəsi: yuxarı F_A, aşağı mg və aşağı T (ip bloku dibə çəkir). Tarazlıq: F_A = mg + T. F_A = ρgV = 1000·10·${F(V / 1000)} = ${F(FA)} N; mg = ${F(m)}·10 = ${F(W)} N. T = F_A − mg = ${F(FA)} − ${F(W)} = ${F(T)} N. Tələlər: yalnız F_A-nı götürmək (${F(FA)} N), yalnız mg (${F(W)} N), qüvvələri toplamaq (${F(FA + W)} N), V və m-in ədədlərini g-siz çıxmaq (${F(V - m)} N).` });
    }) },
    // 6. a floating block with a stone hung under it: the part above the water
    { tip: "qapali", gen: () => again(() => {
      const r1_ = pick([400, 500, 600, 700, 800]), V1 = pick([8, 10, 12, 16, 20, 24]), r2_ = pick([2000, 2500, 3000, 4000, 5000, 8000]), V2 = pick([0.5, 1, 2]);
      const m1 = r1_ * V1 / 1000, m2 = r2_ * V2 / 1000, Vb = m1 + m2 - V2, up = 100 * (1 - Vb / V1);
      const x = Vb2 => 100 * (1 - Vb2 / V1), w = [x(m1), x(m1 + m2), x(m1 - (m2 - V2)), x(m1 + m2 + V2)];
      if (Vb <= 0 || up <= 5 || ![up, ...w].every(y => ok2(y, 2) && y < 100)) return null;
      return mc(ae(up, w, U_("%")), { svg: figBelow(r1_, V1, r2_, V2, up / 100), text: `Sıxlığı ${r1_} kq/m³, həcmi ${F(V1)} dm³ olan taxta blok suda üzür. Onun altından nazik, çəkisiz iplə sıxlığı ${r2_} kq/m³, həcmi ${F(V2)} dm³ olan daş asılıb; daş tam suyun içindədir və dibə toxunmur (şəkil). Blokun həcminin neçə faizi suyun səthindən yuxarıdadır? (ρ_su = 1000 kq/m³; 1 dm³ suyun kütləsi 1 kq-dır.)`,
        solution: `Blok və daş birlikdə bir sistemdir: ümumi çəki = blokun və daşın Arximed qüvvələri. Kütlələr: m₁ = ${r1_}·${F(V1 / 1000)} = ${F(m1)} kq, m₂ = ${r2_}·${F(V2 / 1000)} = ${F(m2)} kq. Daş tam batıb: V₂ = ${F(V2)} dm³. (m₁ + m₂)g = ρ_su·g·(V_b + V₂) → V_b = ${F(m1)} + ${F(m2)} − ${F(V2)} = ${F(Vb)} dm³ (blokun batan hissəsi). Yuxarıda: ${F(V1)} − ${F(Vb)} = ${F(V1 - Vb)} dm³, bu ${F(V1 - Vb)}/${F(V1)}·100 = ${F(up)}%. Tələlər: daşı unutmaq (${F(w[0])}%), daşın çəkisini saymaq, onun Arximed qüvvəsini unutmaq (${F(w[1])}%), daşın təsirini əks işarə ilə götürmək (${F(w[2])}%), Arximed qüvvəsini çıxmaq əvəzinə əlavə etmək (${F(w[3])}%).` });
    }) },
    // 7. continuity: a pipe splits into two equal pipes
    { tip: "qapali", gen: () => again(() => {
      const d1 = pick([4, 6, 8, 10]), d2 = pick([2, 3, 4, 5]), v1 = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]); if (d2 >= d1) return null;
      const v2 = v1 * d1 * d1 / (2 * d2 * d2), w = [v1 * d1 * d1 / (d2 * d2), v1 * d1 / (2 * d2), v1 * d1 / d2, 2 * v1 * d1 * d1 / (d2 * d2)];
      if (![v2, ...w].every(x => ok2(x, 2))) return null;
      return mc(ae(v2, w, U_("m/s")), { svg: figBranch(d1, v1, d2), text: `Diametri ${d1} sm olan boru diametri ${d2} sm olan iki eyni boruya ayrılır (şəkil). Əsas boruda su ${F(v1)} m/s sürətlə axır. Hər qol boruda suyun sürəti nə qədərdir? (Su sıxılmır, axın stasionardır, su qollar arasında bərabər bölünür.)`,
        solution: `Hər saniyə keçən həcm: Q = S₁v₁. Qollarda hər birindən Q/2 keçir: S₁v₁ = 2·S₂v₂. Sahə diametrin kvadratı ilə mütənasibdir: v₂ = v₁·d₁²/(2d₂²) = ${F(v1)}·${d1}²/(2·${d2}²) = ${F(v1)}·${d1 * d1}/${2 * d2 * d2} = ${F(v2)} m/s. Tələlər: axının ikiyə bölündüyünü unutmaq (${F(w[0])} m/s), sahəni diametrlə mütənasib saymaq (${F(w[1])} və ${F(w[2])} m/s), 2-yə bölmək əvəzinə vurmaq (${F(w[3])} m/s).` });
    }) },
    // 8. continuity: the time for water to pass through a pipe of two sections
    { tip: "qapali", gen: () => again(() => {
      const d1 = pick([4, 6, 8, 10]), d2 = pick([2, 3, 4, 5]), v1 = pick([0.25, 0.5, 1, 1.5, 2]), l1 = pick([1, 2, 3, 4, 5, 6]), l2 = pick([1, 2, 3, 4, 5, 6]); if (d2 >= d1) return null;
      const v2 = v1 * d1 * d1 / (d2 * d2), t = l1 / v1 + l2 / v2, w = [l1 / v1 + l2 / (v1 * d1 / d2), (l1 + l2) / v1, (l1 + l2) / v2, (l1 + l2) / ((v1 + v2) / 2)];
      if (![t, ...w].every(x => ok2(x, 2))) return null;
      return mc(ae(t, w, U_("s")), { svg: figTime(l1, d1, l2, d2, v1), text: `Boru iki hissədən ibarətdir: birincisinin uzunluğu ${l1} m, diametri ${d1} sm; ikincisinin uzunluğu ${l2} m, diametri ${d2} sm (şəkil). Birinci hissədə su ${F(v1)} m/s sürətlə axır. Suyun bütün boruda keçmə vaxtı nə qədərdir? (Su sıxılmır, axın stasionardır.)`,
        solution: `İkinci hissədə sürət: v₂ = v₁(d₁/d₂)² = ${F(v1)}·(${d1}/${d2})² = ${F(v2)} m/s. Vaxt hissələrə görə toplanır: t₁ = l₁/v₁ = ${l1}/${F(v1)} = ${F(l1 / v1)} s, t₂ = l₂/v₂ = ${l2}/${F(v2)} = ${F(l2 / v2)} s. t = ${F(l1 / v1)} + ${F(l2 / v2)} = ${F(t)} s. Tələlər: sahəni diametrlə mütənasib saymaq (${F(w[0])} s), bütün boruda eyni sürət götürmək (${F(w[1])} s), bütün boruda ikinci sürəti götürmək (${F(w[2])} s), sürətlərin ortasını götürmək (${F(w[3])} s).` });
    }) },
    // 9. pressure on the bottom of a vessel after a block is put in
    { tip: "qapali", birlesik: "fiz-tezyiq", gen: () => again(() => {
      const S0 = pick([20, 25, 40, 50, 100]), h1 = pick([10, 15, 20, 25, 30]), m = pick([0.1, 0.2, 0.3, 0.4, 0.5]), rc = pick([500, 600, 800]);
      const dp = m * 1e5 / S0, p = 100 * h1 + dp, Vs = m / rc * 1e6, w = [100 * h1, 100 * (h1 + Vs / S0), 100 * h1 - dp, 100 * h1 + 10 * m];
      if (![p, ...w].every(x => ok2(x, 2))) return null;
      return mc(ae(p, w, U_("Pa")), { svg: figVessel(h1, S0, m, rc), text: `Stəkanın divarları şaquli, en kəsiyinin sahəsi isə bütün hündürlüyü boyunca ${S0} sm²-dir. Stəkanda suyun hündürlüyü ${h1} sm-dir. Suya kütləsi ${F(m)} kq, sıxlığı ${rc} kq/m³ olan taxta blok salındı: blok üzür, su daşmır (şəkil). Stəkanın dibinə suyun təzyiqi neçə Pa olur? (g = 10 m/s², ρ_su = 1000 kq/m³; atmosfer təzyiqi nəzərə alınmır.)`,
        solution: `Blok üzür, yəni sıxışdırdığı suyun çəkisi blokun çəkisinə bərabərdir: ρ_su·g·ΔV = mg → ΔV = m/ρ_su = ${F(m)}/1000 = ${F(m / 1000)} m³. Su səviyyəsi qalxır: Δh = ΔV/S = ${F(m / 1000)}/${F(S0 / 1e4)} = ${F(m * 10 / S0)} m = ${F(m * 1000 / S0)} sm. (Eyni nəticə: dibə əlavə təzyiq Δp = mg/S = ${F(m)}·10/${F(S0 / 1e4)} = ${F(dp)} Pa.) Yeni təzyiq p = ρgh₁ + Δp = 1000·10·${F(h1 / 100)} + ${F(dp)} = ${F(100 * h1)} + ${F(dp)} = ${F(p)} Pa. Tələlər: bloku unutmaq (${F(100 * h1)} Pa), blokun bütün həcmini (${F(Vs)} sm³) suya salınmış saymaq (${F(w[1])} Pa), Δp-ni çıxmaq (${F(w[2])} Pa), mg-ni S-ə bölməmək (${F(w[3])} Pa).` });
    }) },
    // 10. scale under a glass of water, a ball dipped from a spring balance (Newton's III law)
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const M = pick([1, 1.2, 1.5, 2, 2.5]), V = pick([100, 200, 250, 400, 500]), rho = pick([2500, 4000, 5000, 8000]), m = rho * V * 1e-6, dm = V / 1000, right = M + dm;
      const w = [M + m, M + m - dm, M - dm, M]; if (![right, ...w].every(x => ok2(x, 2))) return null;
      return mc(ae(right, w, U_("kq")), { svg: figScale(M, +m.toFixed(4), V), text: `Su dolu stəkan tərəzidədir, tərəzi ${F(M)} kq göstərir. Dinamometrdən asılmış, kütləsi ${F(+m.toFixed(4))} kq, həcmi ${V} sm³ olan metal kürə suya tam batırıldı: kürə dibə və divara toxunmur, su daşmır (şəkil). Tərəzi indi neçə kq göstərir? (ρ_su = 1000 kq/m³)`,
        solution: `Su kürəyə yuxarı F_A qüvvəsi ilə təsir edir: F_A = ρ_su·g·V = 1000·10·${F(V / 1e6)} = ${F(10 * dm)} N. Nyutonun III qanununa görə kürə də suya aşağı eyni F_A qüvvəsi ilə təsir edir. Bu qüvvə stəkanın dibinə ötürülür və tərəzi əlavə ${F(10 * dm)} N, yəni ${F(dm)} kq göstərir: ${F(M)} + ${F(dm)} = ${F(right)} kq. Kürənin kütləsi (${F(+m.toFixed(4))} kq) cavaba daxil deyil: onu dinamometr saxlayır. Tələlər: kürəni stəkana qoyulmuş saymaq (${F(M + m)} kq), dinamometrin göstərişini əlavə etmək (${F(+(M + m - dm).toFixed(4))} kq), əlavəni çıxmaq (${F(M - dm)} kq), tərəzinin dəyişmədiyini düşünmək (${F(M)} kq).` });
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
      key: "fiz-arximed", title: "Arximed qüvvəsi; kəsilməzlik teoremi", fenn: "fizika", link: "dersler/fiz-arximed.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: N, kq/m³, m/s). Onluq kəsr vergül və ya nöqtə ilə: 0,5. g = 10 m/s², ρ_su = 1000 kq/m³.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["fa", "fa", "cekisu", "cekisu", "uzme", "uzme", "sixliq", "kesilmez", "kesilmez", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-arximed.html")) b.push("dersler/fiz-arximed.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
