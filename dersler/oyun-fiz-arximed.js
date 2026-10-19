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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-arximed", title: "Arximed qüvvəsi; kəsilməzlik teoremi", fenn: "fizika", link: "dersler/fiz-arximed.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: N, kq/m³, m/s). Onluq kəsr vergül və ya nöqtə ilə: 0,5. g = 10 m/s², ρ_su = 1000 kq/m³.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["fa", "fa", "cekisu", "cekisu", "uzme", "uzme", "sixliq", "kesilmez", "kesilmez", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-arximed.html")) b.push("dersler/fiz-arximed.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
