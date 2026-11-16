// Fizika · Təzyiq, hidrostatik təzyiq, Paskal qanunu — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s², p₀ = 100 kPa.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");          // 0.04 → "0,04"
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;        // v has at most d decimals
  const R = (v, unit, extra) => { v = +(+v).toFixed(6); return Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra); };
  const g = 10;
  const LIQ = [["su", 1000], ["kerosin", 800], ["bitki yağı", 900], ["benzin", 700], ["civə", 13600]];
  const lenTxt = cm => cm >= 100 ? `${F(cm / 100)} m` : `${cm} sm`;

  const levels = [
    { id: "pres", ad: "p = F/S", izah: "Təzyiq = qüvvə / sahə. Sahəni həmişə m²-ə çevir: 1 sm² = 0,0001 m², 1 mm² = 0,000001 m². 1 kPa = 1000 Pa.",
      gen() {
        const kind = pick(["pF", "pF", "Fp", "kirpic", "adam", "bicaq", "S"]);
        if (kind === "pF") {
          let Fv, S, p; do { S = pick([5, 10, 20, 25, 40, 50, 100, 200, 250, 400, 500, 800, 1000]); Fv = pick([10, 20, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500, 800, 1000]); p = Fv * 10 / S; } while (!nice(p, 3) || p > 5000);
          return R(p, "kPa", { text: `${Fv} N qüvvə ${S} sm² sahəyə perpendikulyar və bərabər paylanmış təsir edir. Təzyiq nə qədərdir? Cavabı kPa ilə yaz.`,
            solution: `S = ${S} sm² = ${F(S / 1e4)} m². p = F/S = ${Fv}/${F(S / 1e4)} = ${F(p * 1000)} Pa = ${F(p)} kPa.` });
        }
        if (kind === "Fp") {
          let p, S, Fv; do { p = pick([100, 150, 200, 250, 300, 400, 500, 800]); S = pick([10, 20, 25, 40, 50, 80, 100, 200, 400]); Fv = p * S / 10; } while (!nice(Fv, 2));
          return R(Fv, "N", { text: `Porşenin sahəsi ${S} sm²-dir, onu altındakı qaz ${p} kPa təzyiqlə itələyir. Qazın porşenə təsir qüvvəsi nə qədərdir?`,
            solution: `S = ${S} sm² = ${F(S / 1e4)} m², p = ${p} kPa = ${F(p * 1000)} Pa. F = pS = ${F(p * 1000)}·${F(S / 1e4)} = ${F(Fv)} N.` });
        }
        if (kind === "kirpic") {
          const dims = [5, 10, 20], m = pick([2, 3, 4, 5, 6]), small = Math.random() < .5;
          const S = small ? 5 * 10 : 10 * 20, p = m * 100 / S;
          return R(p, "kPa", { text: `Kərpicin kütləsi ${m} kq, ölçüləri 20 sm × 10 sm × 5 sm-dir. Onu ən ${small ? "kiçik" : "böyük"} sahəli üzü üstə stola qoyublar. Stola təzyiq nə qədərdir? Cavabı kPa ilə yaz.`,
            solution: `Ən ${small ? "kiçik" : "böyük"} üz: ${small ? "10 × 5" : "20 × 10"} = ${S} sm² = ${F(S / 1e4)} m². Ağırlıq mg = ${m}·10 = ${m * 10} N. p = ${m * 10}/${F(S / 1e4)} = ${F(p * 1000)} Pa = ${F(p)} kPa.` });
        }
        if (kind === "adam") {
          let m, S, n, p; do { m = pick([40, 45, 50, 60, 64, 70, 80]); S = pick([100, 125, 150, 200, 250, 300, 400]); n = rnd(1, 2); p = m * g / (n * S / 1e4) / 1000; } while (!nice(p, 3));
          return R(p, "kPa", { text: `Kütləsi ${m} kq olan adam ${n === 2 ? "hər birinin tabanının sahəsi " + S + " sm² olan iki ayaq üstündə" : "tabanının sahəsi " + S + " sm² olan bir ayaq üstündə"} durur. Yerə təzyiq nə qədərdir? Cavabı kPa ilə yaz.`,
            solution: `Ağırlıq mg = ${m * g} N. Ümumi sahə = ${n}·${S} = ${n * S} sm² = ${F(n * S / 1e4)} m². p = ${m * g}/${F(n * S / 1e4)} = ${F(p * 1000)} Pa = ${F(p)} kPa.` });
        }
        if (kind === "bicaq") {
          let Fv, S, p; do { Fv = pick([10, 20, 40, 50, 100]); S = pick([1, 2, 4, 5, 10, 20, 25, 50]); p = Fv * 1000 / S; } while (!nice(p, 3));
          return R(p, "kPa", { text: `Bıçağı ${Fv} N qüvvə ilə basırsan. Bıçağın kəsən hissəsinin toxunma sahəsi ${S} mm²-dir. Təzyiq nə qədərdir? Cavabı kPa ilə yaz.`,
            solution: `${S} mm² = ${S} · 10⁻⁶ m² = ${F(S / 1e6)} m². p = ${Fv}/${F(S / 1e6)} = ${F(p * 1000)} Pa = ${F(p)} kPa. (Sahə kiçikdir, ona görə təzyiq çox böyükdür.)` });
        }
        let Fv, p, S; do { Fv = pick([200, 400, 600, 800, 1000, 1200, 2000, 3000]); p = pick([50, 100, 200, 250, 400, 500, 800]); S = 10 * Fv / p; } while (!nice(S, 2));
        return R(S, "sm²", { text: `Çimərlikdə qum ${p} kPa-dan çox təzyiqə tab gətirmir. Ağırlığı ${Fv} N olan yük qumun üstündə batmasın deyə dayağın sahəsi ən azı neçə sm² olmalıdır?`,
          solution: `S = F/p = ${Fv}/${F(p * 1000)} = ${F(Fv / (p * 1000))} m² = ${F(S)} sm².` });
      } },
    { id: "hidro", ad: "p = ρgh", izah: "Maye sütununun təzyiqi p = ρgh. Dərinlik şaquli ölçülür və qabın formasından asılı deyil. Atmosfer təzyiqi ayrıca əlavə olunur: p = p₀ + ρgh.",
      gen() {
        const kind = pick(["p", "p", "h", "rho", "tam", "tam", "F", "iki"]);
        if (kind === "p") {
          const [nm, rho] = pick(LIQ), cm = nm === "civə" ? pick([5, 10, 20, 25, 50, 76]) : pick([10, 20, 25, 30, 40, 50, 60, 80, 100, 150, 200, 300, 500, 1000]);
          const p = rho * g * cm / 100, big = p >= 20000, v = big ? p / 1000 : p;
          return R(v, big ? "kPa" : "Pa", { text: `Qabda ${nm} (ρ = ${rho} kq/m³) ${lenTxt(cm)} hündürlüyündədir. Qabın dibində hidrostatik təzyiq nə qədərdir? Cavabı ${big ? "kPa" : "Pa"} ilə yaz.`,
            solution: `h = ${F(cm / 100)} m. p = ρgh = ${rho}·10·${F(cm / 100)} = ${F(p)} Pa${big ? " = " + F(p / 1000) + " kPa" : ""}.` });
        }
        if (kind === "h") {
          const [nm, rho] = pick(LIQ.slice(0, 4)), hh = pick([0.2, 0.25, 0.4, 0.5, 1, 2, 5, 10, 12.5, 20, 25, 30, 40]), p = rho * g * hh;
          return R(hh, "m", { text: `Maye: ${nm}, ρ = ${rho} kq/m³. Müəyyən dərinlikdə hidrostatik təzyiq ${F(p / 1000)} kPa ölçülüb (atmosfer nəzərə alınmır). Bu dərinlik neçə metrdir?`,
            solution: `h = p/(ρg) = ${F(p)}/(${rho}·10) = ${F(hh)} m.` });
        }
        if (kind === "rho") {
          const rho = pick([600, 700, 800, 900, 1000, 1200, 1500]), cm = pick([20, 25, 40, 50, 60, 80, 100]), p = rho * g * cm / 100;
          return R(rho, "kq/m³", { text: `Qabda ${lenTxt(cm)} hündürlüyündə maye var, onun dibinə hidrostatik təzyiq ${F(p)} Pa-dır. Mayenin sıxlığı nə qədərdir?`,
            solution: `ρ = p/(gh) = ${F(p)}/(10·${F(cm / 100)}) = ${rho} kq/m³.` });
        }
        if (kind === "tam") {
          const [nm, rho] = pick([["su", 1000], ["su", 1000], ["kerosin", 800], ["bitki yağı", 900]]), hh = pick([2, 5, 8, 10, 15, 20, 25, 30, 40]), pl = rho * g * hh / 1000, p = 100 + pl;
          return R(p, "kPa", { text: `Açıq çəndə ${nm} (ρ = ${rho} kq/m³) var. Atmosfer təzyiqi 100 kPa-dır. Səthdən ${hh} m dərinlikdə ümumi təzyiq nə qədərdir? Cavabı kPa ilə yaz.`,
            solution: `Maye sütununun təzyiqi ρgh = ${rho}·10·${hh} = ${F(pl * 1000)} Pa = ${F(pl)} kPa. Ümumi: p = p₀ + ρgh = 100 + ${F(pl)} = ${F(p)} kPa.` });
        }
        if (kind === "F") {
          let rho, hc, S, Fv; do { rho = pick([700, 800, 900, 1000, 1200]); hc = pick([10, 20, 25, 30, 40, 50]); S = pick([50, 100, 200, 250, 400, 500]); Fv = rho * hc * S / 1e5; } while (!nice(Fv, 3));
          return R(Fv, "N", { text: `Silindr formalı qabın dibinin sahəsi ${S} sm²-dir. Qaba sıxlığı ${rho} kq/m³ olan maye ${hc} sm hündürlüyündə tökülüb. Mayenin dibə təsir qüvvəsi nə qədərdir?`,
            solution: `p = ρgh = ${rho}·10·${F(hc / 100)} = ${F(rho * g * hc / 100)} Pa. S = ${F(S / 1e4)} m². F = pS = ${F(rho * g * hc / 100)}·${F(S / 1e4)} = ${F(Fv)} N.` });
        }
        const [n1, r1] = pick([["bitki yağı", 900], ["kerosin", 800], ["benzin", 700]]), h1 = pick([10, 20, 30, 40, 50]), h2 = pick([10, 20, 30, 40, 50, 60]), p = (r1 * h1 + 1000 * h2) * g / 100;
        return R(p, "Pa", { text: `Silindr formalı qabda iki qarışmayan maye var: altda ${lenTxt(h2)} hündürlüyündə su, üstdə ${lenTxt(h1)} hündürlüyündə ${n1} (ρ = ${r1} kq/m³). Atmosfer nəzərə alınmasa, dibə təzyiq nə qədərdir? Cavabı Pa ilə yaz.`,
          solution: `Təzyiqlər toplanır: p = ρ₁gh₁ + ρ₂gh₂ = ${r1}·10·${F(h1 / 100)} + 1000·10·${F(h2 / 100)} = ${F(r1 * g * h1 / 100)} + ${F(1000 * g * h2 / 100)} = ${F(p)} Pa.` });
      } },
    { id: "atm", ad: "Atmosfer təzyiqi", izah: "Torriçelli: civə sütunu atmosferi tarazlayır. 1 mm Hg = ρ_civə·g·0,001 = 13600·10·0,001 = 136 Pa (g = 10 ilə). Normal atmosfer p₀ ≈ 100 kPa.",
      gen() {
        const kind = pick(["mm", "mm", "kpa", "magd", "sutun", "dalgic", "boru"]);
        if (kind === "mm") {
          const hh = pick([700, 710, 720, 730, 740, 750, 760, 770, 780]), p = 0.136 * hh;
          return R(p, "kPa", { text: `Barometr ${hh} mm Hg göstərir. Bu, neçə kPa-dır? (ρ_civə = 13600 kq/m³, g = 10 m/s²)`,
            solution: `p = ρgh = 13600·10·${F(hh / 1000)} = ${F(p * 1000)} Pa = ${F(p)} kPa.` });
        }
        if (kind === "kpa") {
          const hh = pick([600, 650, 700, 720, 740, 750, 760, 780]), p = 0.136 * hh;
          return R(hh, "mm Hg", { text: `Dağda təzyiq ${F(p)} kPa-dır. Bu, civə barometrində neçə mm Hg-dir? (ρ_civə = 13600 kq/m³, g = 10 m/s²)`,
            solution: `h = p/(ρg) = ${F(p * 1000)}/(13600·10) = ${F(hh / 1000)} m = ${hh} mm.` });
        }
        if (kind === "magd") {
          const S = pick([50, 100, 200, 300, 400, 500, 1000]), Fv = 10 * S;
          return R(Fv, "N", { text: `Magdeburq yarımkürələrindən havanı tam sordular (daxildə təzyiq 0). Yarımkürələrin birləşdiyi dairənin sahəsi ${S} sm²-dir, atmosfer təzyiqi 100 kPa. Onları ayırmaq üçün hər tərəfdən nə qədər qüvvə lazımdır?`,
            solution: `Bayırdan atmosfer sıxır, içəridən heç nə: F = p₀S = ${F(1e5)}·${F(S / 1e4)} = ${F(Fv)} N.` });
        }
        if (kind === "sutun") {
          const rho = pick([500, 800, 1000, 1250, 2000]), hh = 1e5 / (rho * g);
          return R(hh, "m", { text: `Civə əvəzinə sıxlığı ${rho} kq/m³ olan maye ilə barometr düzəldiblər. Atmosfer təzyiqi 100 kPa olanda mayenin sütunu neçə metr olar?`,
            solution: `h = p₀/(ρg) = ${F(1e5)}/(${rho}·10) = ${F(hh)} m.` });
        }
        if (kind === "dalgic") {
          const n = pick([2, 3, 4, 5]), hh = (n - 1) * 10;
          return R(hh, "m", { text: `Gölün səthində atmosfer təzyiqi 100 kPa-dır. Suyun içində hansı dərinlikdə ümumi təzyiq ${n * 100} kPa olur? (ρ_su = 1000 kq/m³)`,
            solution: `p = p₀ + ρgh → ρgh = ${n * 100} − 100 = ${(n - 1) * 100} kPa. h = ${F((n - 1) * 1e5)}/(1000·10) = ${hh} m.` });
        }
        const hh = pick([20, 40, 60, 80, 100, 120, 150]), p0 = pick([740, 750, 760]), up = Math.random() < .5, p = up ? p0 + hh : p0 - hh;
        return R(p, "mm Hg", { text: `Bir ucu bağlı şüşə borunun içində ${hh} mm uzunluğunda civə sütunu hava sıxıb saxlayır. Boru ${up ? "açıq ucu yuxarı" : "açıq ucu aşağı"} şaquli durur, atmosfer təzyiqi ${p0} mm Hg-dir. Bağlı ucdakı havanın təzyiqi neçə mm Hg-dir?`,
          solution: up ? `Açıq ucu yuxarı: havanı atmosfer və civə sütunu sıxır. p = ${p0} + ${hh} = ${p} mm Hg.` : `Açıq ucu aşağı: atmosfer civəni yuxarı itələyir, civənin çəkisi isə aşağı. Hava təzyiqi atmosferdən civə sütunu qədər azdır: p = ${p0} − ${hh} = ${p} mm Hg.` });
      } },
    { id: "rabite", ad: "Rabitəli qablar", izah: "Bir mayeli rabitəli qablarda səviyyələr eynidir. İki mayedə ayrılma sərhəddindən ρ₁h₁ = ρ₂h₂ (sərhəd səviyyəsində təzyiqlər bərabərdir).",
      gen() {
        const kind = pick(["iki", "iki", "cive", "ro", "yag"]);
        if (kind === "iki") {
          const [n1, r1] = pick([["kerosin", 800], ["bitki yağı", 900], ["benzin", 700]]), h1 = pick([10, 20, 30, 40, 45, 50, 60]), h2 = r1 * h1 / 1000;
          if (!nice(h2, 2)) return levels[3].gen();
          return R(h2, "sm", { text: `U-şəkilli boruda su və ${n1} (ρ = ${r1} kq/m³) var. Bir qolda ${n1} su ilə sərhədləşir, digər qolda yalnız su var. Sərhəddən yuxarı ${n1} sütununun hündürlüyü ${h1} sm-dir. Digər qolda suyun üst səthi sərhəd səviyyəsindən neçə sm yuxarıdadır?`,
            solution: `Sərhəd səviyyəsində təzyiqlər bərabərdir: ρ_su·g·h_su = ρ·g·h → h_su = ${r1}·${h1}/1000 = ${F(h2)} sm.` });
        }
        if (kind === "cive") {
          const d = rnd(1, 8), hw = 13.6 * d;
          return R(d, "sm", { text: `U-şəkilli borunun hər iki qolunda civə var. Qollardan birinə hündürlüyü ${F(hw)} sm olan su sütunu tökdülər. Qollarda civənin səviyyələri arasındakı fərq neçə sm olar? (ρ_civə = 13600 kq/m³)`,
            solution: `Civənin aşağı səviyyəsində təzyiqlər bərabərdir: ρ_su·h_su = ρ_civə·Δh → Δh = 1000·${F(hw)}/13600 = ${d} sm.` });
        }
        if (kind === "ro") {
          let hw, hx, rho; do { hw = pick([10, 15, 20, 24, 30, 36, 40, 50]); hx = pick([8, 10, 12, 16, 20, 25, 30, 32, 40]); rho = 1000 * hw / hx; } while (hx === hw || rho % 10 !== 0 || rho > 3000);
          return R(rho, "kq/m³", { text: `Rabitəli qabların bir qolunda ayrılma sərhəddindən ${hw} sm hündürlüyündə su, digər qolunda ${hx} sm hündürlüyündə naməlum maye durur. Mayenin sıxlığı nə qədərdir?`,
            solution: `ρ_su·h_su = ρ·h → ρ = 1000·${hw}/${hx} = ${F(rho)} kq/m³.` });
        }
        const [n1, r1] = pick([["bitki yağı", 900], ["kerosin", 800], ["benzin", 700]]);
        let ho, hw, d; do { ho = pick([10, 20, 30, 40, 50, 60]); hw = r1 * ho / 1000; d = ho - hw; } while (!nice(hw, 2));
        return R(d, "sm", { text: `U-şəkilli boruda su var. Qollardan birinə ${ho} sm hündürlüyündə ${n1} (ρ = ${r1} kq/m³) tökdülər. Tökülən mayenin üst səthi digər qolda suyun üst səthindən neçə sm yuxarıdadır?`,
          solution: `Yağın altındakı suyun səviyyəsində təzyiqlər bərabərdir. Digər qolda həmin səviyyədən yuxarı suyun hündürlüyü: h_su = ${r1}·${ho}/1000 = ${F(hw)} sm. Fərq: ${ho} − ${F(hw)} = ${F(d)} sm.` });
      } },
    { id: "press", ad: "Paskal, hidravlik press", izah: "Paskal: qapalı mayedə təzyiq hər istiqamətdə eyni ötürülür. Press: F₁/S₁ = F₂/S₂. Qüvvədə nə qədər qazanırsansa, yolda o qədər itirirsən: S₁l₁ = S₂l₂.",
      gen() {
        const kind = pick(["F2", "F2", "yuk", "yol", "nasos", "d", "lever"]);
        const S1s = [5, 10, 20, 25, 50];
        if (kind === "F2") {
          let S1, S2, F1, F2; do { S1 = pick(S1s); S2 = pick([100, 200, 250, 400, 500, 1000, 2000]); F1 = pick([20, 40, 50, 80, 100, 150, 200, 250]); F2 = F1 * S2 / S1; } while (S2 <= S1 || !nice(F2, 2) || F2 > 100000);
          return R(F2, "N", { text: `Hidravlik pressin kiçik porşeninin sahəsi ${S1} sm², böyüyünün sahəsi ${S2} sm²-dir. Kiçik porşenə ${F1} N qüvvə təsir edir. Böyük porşendə qüvvə nə qədərdir?`,
            solution: `Təzyiq eynidir: F₁/S₁ = F₂/S₂ → F₂ = ${F1}·${S2}/${S1} = ${F(F2)} N.` });
        }
        if (kind === "yuk") {
          let S1, k, m, F1; do { S1 = pick(S1s); k = pick([20, 40, 50, 100, 200, 250, 400]); m = pick([500, 800, 1000, 1200, 1500, 2000, 2500]); F1 = m * g / k; } while (!nice(F1, 2) || F1 > 2000);
          return R(F1, "N", { text: `Avtomobil qaldırıcısında böyük porşenin sahəsi kiçiyinkindən ${k} dəfə çoxdur. ${m} kq kütləli avtomobili qaldırmaq üçün kiçik porşenə ən azı nə qədər qüvvə təsir etməlidir? (Porşenlərin çəkisi nəzərə alınmır.)`,
            solution: `Böyük porşendə lazım olan qüvvə F₂ = mg = ${m * g} N. Qüvvə sahəyə mütənasibdir: F₁ = F₂/${k} = ${F(F1)} N.` });
        }
        if (kind === "yol") {
          let S1, S2, l1, l2; do { S1 = pick(S1s); S2 = pick([100, 200, 250, 500, 1000]); l1 = pick([10, 20, 25, 30, 40, 50]); l2 = l1 * S1 / S2; } while (S2 <= S1 || !nice(l2, 2));
          return R(l2, "sm", { text: `Hidravlik pressin porşenlərinin sahələri ${S1} sm² və ${S2} sm²-dir. Kiçik porşen ${l1} sm aşağı düşəndə böyük porşen neçə sm qalxar?`,
            solution: `Mayenin həcmi saxlanır: S₁l₁ = S₂l₂ → l₂ = ${S1}·${l1}/${S2} = ${F(l2)} sm.` });
        }
        if (kind === "nasos") {
          let S1, S2, l1, n, H; do { S1 = pick(S1s); S2 = pick([100, 200, 250, 500, 1000]); l1 = pick([10, 20, 25, 40, 50]); n = rnd(5, 40); H = n * l1 * S1 / S2; } while (S2 <= S1 || !nice(H, 2) || H > 60);
          return R(n, "dəfə", { text: `Hidravlik qaldırıcının porşenlərinin sahələri ${S1} sm² və ${S2} sm²-dir. Kiçik porşeni hər dəfə ${l1} sm aşağı basırlar (yolda mayenin itkisi yoxdur). Yükü ${F(H)} sm qaldırmaq üçün porşeni neçə dəfə basmaq lazımdır?`,
            solution: `Bir basışda böyük porşen l₂ = l₁S₁/S₂ = ${l1}·${S1}/${S2} = ${F(l1 * S1 / S2)} sm qalxır. Lazım olan basış: ${F(H)}/${F(l1 * S1 / S2)} = ${n}.` });
        }
        if (kind === "d") {
          let d1, k, F1; do { d1 = pick([2, 3, 4, 5]); k = pick([2, 3, 4, 5, 6, 8, 10]); F1 = pick([20, 30, 40, 50, 60, 100]); } while (false);
          const F2 = F1 * k * k;
          return R(F2, "N", { text: `Hidravlik pressin silindrlərinin diametrləri ${d1} sm və ${d1 * k} sm-dir. Kiçik porşenə ${F1} N qüvvə təsir edir. Böyük porşendə qüvvə nə qədərdir?`,
            solution: `Sahə diametrin kvadratı ilə mütənasibdir: S₂/S₁ = (${d1 * k}/${d1})² = ${k * k}. F₂ = ${F1}·${k * k} = ${F(F2)} N.` });
        }
        let a, b, S1, S2, Fh, F2, F1; do { a = pick([1, 2, 3]); b = pick([6, 8, 10, 12]); Fh = pick([20, 30, 40, 50, 60, 100]); S1 = pick(S1s); S2 = pick([100, 200, 250, 500, 1000]); F1 = Fh * b / a; F2 = F1 * S2 / S1; } while (S2 <= S1 || !nice(F2, 2) || F2 > 200000);
        return R(F2, "N", { text: `Qolu olan əl pressində əl qolun uzun ucuna ${Fh} N qüvvə ilə basır; qolun dayaq nöqtəsindən əlin basdığı nöqtəyə qədər məsafə ${b} sm, kiçik porşenin bərkidildiyi nöqtəyə qədər məsafə ${a} sm-dir. Porşenlərin sahələri ${S1} sm² və ${S2} sm²-dir. Böyük porşendə qüvvə nə qədərdir?`,
          solution: `Qolun momentləri: F₁·${a} = ${Fh}·${b} → F₁ = ${F(F1)} N (kiçik porşenə). Press: F₂ = F₁·S₂/S₁ = ${F(F1)}·${S2}/${S1} = ${F(F2)} N.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          const hh = pick([5, 8, 10, 15, 20, 30]);
          task = `Göldə ${hh} m dərinlikdə dalğıca təsir edən ümumi təzyiq neçə kPa-dır? Atmosfer təzyiqi 100 kPa, ρ_su = 1000 kq/m³.`;
          steps = [`Suyun təzyiqi: p_su = ρgh = 1000·10·${hh} = ${F(10000 * hh)} Pa.`,
            `Ümumi təzyiq atmosferi də əhatə edir: p = p₀ + p_su = 100000 + ${F(10000 * hh)} = ${F(100000 + 10000 * hh)} Pa.`,
            `kPa-la: p = ${F(100 + 10 * hh)} kPa.`];
          if (bad === 0) steps = [`Suyun təzyiqi: p_su = ρh = 1000·${hh} = ${F(1000 * hh)} Pa.`, `Ümumi təzyiq atmosferi də əhatə edir: p = p₀ + p_su = 100000 + ${F(1000 * hh)} = ${F(100000 + 1000 * hh)} Pa.`, `kPa-la: p = ${F(100 + hh)} kPa.`];
          if (bad === 1) steps = [steps[0], `Ümumi təzyiq suyun təzyiqinə bərabərdir: p = ${F(10000 * hh)} Pa.`, `kPa-la: p = ${F(10 * hh)} kPa.`];
          if (bad === 2) steps[2] = `kPa-la: p = ${F(100 * (100 + 10 * hh))} kPa.`;
          why = [`1-ci addım: p = ρgh, g = 10 m/s² unudulub. Düzü: ${F(10000 * hh)} Pa və cavab ${F(100 + 10 * hh)} kPa.`,
            `2-ci addım: suyun içində atmosfer təzyiqi də qalır: p = p₀ + ρgh. Düz cavab: ${F(100 + 10 * hh)} kPa.`,
            `3-cü addım: 1 kPa = 1000 Pa, yəni 1000-ə bölürük. ${F(100000 + 10000 * hh)} Pa = ${F(100 + 10 * hh)} kPa.`][bad];
        } else {
          let F1, S1, S2, F2; do { F1 = pick([20, 30, 40, 50, 100, 150]); S1 = pick([5, 10, 20, 25]); S2 = pick([1, 2, 4, 5, 10]); F2 = F1 * 100 * S2 / S1; } while (!nice(F2, 2) || 100 * S2 <= S1);
          task = `Hidravlik pressin kiçik porşeninin sahəsi ${S1} sm², böyüyünün sahəsi ${S2} dm²-dir. Kiçik porşenə ${F1} N qüvvə təsir edir. Böyük porşendə qüvvə nə qədərdir?`;
          steps = [`Paskal qanunu: mayedə təzyiq hər yerdə eynidir, p₁ = p₂.`,
            `F₁/S₁ = F₂/S₂ → F₂ = F₁·S₂/S₁. Sahələri eyni vahidə gətirək: ${S2} dm² = ${100 * S2} sm².`,
            `F₂ = ${F1}·${100 * S2}/${S1} = ${F(F2)} N.`];
          if (bad === 0) steps = [`Paskal qanunu: mayedə qüvvə eyni ötürülür, F₁ = F₂.`, `Deməli böyük porşendə də ${F1} N qüvvə var.`, `F₂ = ${F1} N.`];
          if (bad === 1) steps = [steps[0], `F₁/S₁ = F₂/S₂ → F₂ = F₁·S₁/S₂. Sahələri eyni vahidə gətirək: ${S2} dm² = ${100 * S2} sm².`, `F₂ = ${F1}·${S1}/${100 * S2} = ${F(+(F1 * S1 / (100 * S2)).toFixed(5))} N.`];
          if (bad === 2) steps = [steps[0], `F₁/S₁ = F₂/S₂ → F₂ = F₁·S₂/S₁.`, `F₂ = ${F1}·${S2}/${S1} = ${F(+(F1 * S2 / S1).toFixed(5))} N.`];
          why = [`1-ci addım: bərabər olan qüvvə yox, təzyiqdir. Düzü: F₂ = ${F(F2)} N.`,
            `2-ci addım: böyük porşenin sahəsi böyükdür, qüvvə də çox olmalıdır: F₂ = F₁·S₂/S₁. Düz cavab: ${F(F2)} N.`,
            `3-cü addım: dm² və sm² qarışdırılıb; 1 dm² = 100 sm². Düz cavab: ${F(F2)} N.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Daban, fil, bənd, sualtı gəmi, kokteyl borusu — hamısı təzyiqdir.",
      gen() {
        const kind = pick(["daban", "fil", "bend", "lyuk", "qule", "boru", "qan"]);
        if (kind === "daban") {
          let m, S, p; do { m = pick([48, 50, 55, 60]); S = pick([1, 2, 4, 5]); p = m * g / (S / 1e4) / 1000; } while (!nice(p, 3));
          return R(p, "kPa", { text: `Çəkisi ${m * g} N olan qız yüksək dabanlı ayaqqabıda bir ayaq üstündə dayanıb. Dabanın yerlə toxunma sahəsi ${S} sm²-dir (ağırlığın hamısı dabana düşür). Yerə təzyiq nə qədərdir? Cavabı kPa ilə yaz.`,
            solution: `S = ${S} sm² = ${F(S / 1e4)} m². p = F/S = ${m * g}/${F(S / 1e4)} = ${F(p * 1000)} Pa = ${F(p)} kPa. Bu, filin təzyiqindən dəfələrlə böyükdür!` });
        }
        if (kind === "fil") {
          let m, S, p; do { m = pick([4000, 4800, 5000, 6000, 6400]); S = pick([200, 250, 300, 400, 500]); p = m * g / (4 * S / 1e4) / 1000; } while (!nice(p, 3));
          return R(p, "kPa", { text: `Fil dörd ayaq üstündə durur, kütləsi ${m} kq, hər ayağın sahəsi ${S} sm²-dir. Yerə təzyiq nə qədərdir? Cavabı kPa ilə yaz.`,
            solution: `Ümumi sahə: 4·${S} = ${4 * S} sm² = ${F(4 * S / 1e4)} m². p = mg/S = ${m * g}/${F(4 * S / 1e4)} = ${F(p * 1000)} Pa = ${F(p)} kPa.` });
        }
        if (kind === "bend") {
          const hh = pick([10, 20, 25, 30, 40, 50, 60, 80]), p = hh * 10;
          return R(p, "kPa", { text: `Bəndin arxasındakı su ${hh} m dərinlikdədir. Bəndin dibində suyun təzyiqi (atmosfersiz) nə qədərdir? Cavabı kPa ilə yaz.`,
            solution: `p = ρgh = 1000·10·${hh} = ${F(p * 1000)} Pa = ${F(p)} kPa. Bənd divarının dibi yuxarısından qat-qat qalın olur.` });
        }
        if (kind === "lyuk") {
          let hh, S, Fv; do { hh = pick([20, 30, 40, 50, 80, 100, 150, 200]); S = pick([200, 300, 400, 500, 600, 800, 1000]); Fv = 1000 * g * hh * S / 1e4; } while (!nice(Fv, 2));
          return R(Fv, "N", { text: `Sualtı qayığın lyukunun sahəsi ${S} sm²-dir, o, ${hh} m dərinlikdədir (lyukun ölçüsü dərinliyə nisbətən kiçikdir). Qayığın içində təzyiq atmosfer təzyiqinə bərabərdir. Suyun lyuka təsir edən xalis qüvvəsi nə qədərdir?`,
            solution: `Atmosfer təzyiqi hər iki tərəfdə var və sönür. Xalis təzyiq ρgh = 1000·10·${hh} = ${F(10000 * hh)} Pa. F = pS = ${F(10000 * hh)}·${F(S / 1e4)} = ${F(Fv)} N.` });
        }
        if (kind === "qule") {
          const hh = pick([10, 15, 20, 25, 30, 40]), z = pick([2, 3, 5]), p = (hh + z) * 10;
          return R(p, "kPa", { text: `Su qülləsində suyun səviyyəsi yer səthindən ${hh} m yuxarıdadır. Binanın zirzəmisindəki kran yer səthindən ${z} m aşağıdadır. Kranda su təzyiqi (atmosfersiz) nə qədərdir? Cavabı kPa ilə yaz.`,
            solution: `Kranla qüllədəki su səviyyəsi arasındakı şaquli məsafə: ${hh} + ${z} = ${hh + z} m. p = ρgh = 1000·10·${hh + z} = ${F(p * 1000)} Pa = ${F(p)} kPa.` });
        }
        if (kind === "boru") {
          const hh = pick([0.2, 0.25, 0.3, 0.4, 0.5]), dp = 1000 * g * hh / 1000;
          return R(dp, "kPa", { text: `Kokteyl borusu ilə suyu ${F(hh * 100)} sm hündürlüyə qaldırmaq üçün ağızda təzyiq atmosfer təzyiqindən neçə kPa az olmalıdır? (ρ_su = 1000 kq/m³)`,
            solution: `Atmosfer suyu borunun içində itələyir; təzyiq fərqi ρgh-a bərabər olmalıdır: Δp = 1000·10·${F(hh)} = ${F(dp * 1000)} Pa = ${F(dp)} kPa.` });
        }
        const hh = pick([80, 100, 110, 120, 130, 140]), p = 0.136 * hh;
        return R(p, "kPa", { text: `Həkim qan təzyiqini ölçür: yuxarı (sistolik) təzyiq ${hh} mm Hg-dir. Bu, neçə kPa-dır? (ρ_civə = 13600 kq/m³, g = 10 m/s²)`,
          solution: `p = ρgh = 13600·10·${F(hh / 1000)} = ${F(p * 1000)} Pa = ${F(p)} kPa.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, every one with a figure, several steps;
  // the wrong options are the answers of typical mistakes. Questions 2, 3 and 10 also use "Nyuton qanunları" (force balance, weight),
  // question 7 uses "Moment" (lever), question 8 uses "İş və güc".
  const { ae, again } = Oyun;
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  const ok1 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  // ==figs-begin==
  const INK = "var(--ink,#1c2433)", ACC = "var(--accent,#2c4a8a)", MUT = "var(--muted,#5b6578)", PAP = "var(--sheet,#fff)", VEC = "var(--vec,#b4561b)", WAT = "var(--accent-soft,#e6ecf7)", GRD = "var(--grid,#e3e7ee)";
  const fx = n => +(+n).toFixed(1);
  const Ln = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${fx(x1)}" y1="${fx(y1)}" x2="${fx(x2)}" y2="${fx(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const Tx = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${fx(x)}" y="${fx(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const Pa = (d, fill = "none", c = INK, w = 2, ex = "") => `<path d="${d}" fill="${fill}" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${ex}/>`;
  const Rc = (x, y, w, h, fill = PAP, c = INK, sw = 2, ex = "") => `<rect x="${fx(x)}" y="${fx(y)}" width="${fx(w)}" height="${fx(h)}" fill="${fill}" stroke="${c}" stroke-width="${sw}"${ex}/>`;
  const Ar = (x1, y1, x2, y2, c = VEC, w = 2.5) => Ln(x1, y1, x2, y2, c, w, ` marker-end="url(#tzq-ar)"`);
  const Dm = (x1, y1, x2, y2) => Ln(x1, y1, x2, y2, MUT, 1.5, ` marker-start="url(#tzq-ar)" marker-end="url(#tzq-ar)"`);
  const Ds = (x1, y1, x2, y2) => Ln(x1, y1, x2, y2, MUT, 1.2, ` stroke-dasharray="4 3"`);
  const Fl = (d, a) => `<path d="${d}" ${a} stroke="none"/>`;                       // liquid fill without outline
  const LQ = { su: `fill="${WAT}"`, yağ: `fill="${VEC}" fill-opacity=".3"`, civə: `fill="${MUT}" fill-opacity=".55"` };
  const Sv = (w, hh, inner, aria) => `<svg viewBox="0 0 ${w} ${hh}" class="oy-svg" role="img" aria-label="${aria}"><defs><marker id="tzq-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="9" markerHeight="9" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  // 1. U-tube: oil poured into the left arm, water level in the right arm rises by x
  function figU(nm) { const yO = 40, yI = 108, yR = 54, y0 = 81;
    return Sv(300, 185, Fl(`M101 ${yI} H139 V138 Q139 147 150 147 H170 Q181 147 181 138 V${yR} H219 V156 Q219 171 204 171 H116 Q101 171 101 156 Z`, LQ.su) + Fl(`M101 ${yO} H139 V${yI} H101 Z`, LQ.yağ)
      + Pa("M100 20 V156 Q100 172 116 172 H204 Q220 172 220 156 V20") + Pa("M140 20 V138 Q140 148 150 148 H170 Q180 148 180 138 V20")
      + Ds(6, y0, 245, y0) + Tx(6, y0 + 14, "ilkin səviyyə", "start", MUT, 11)
      + Dm(88, yO, 88, yI) + Ds(88, yO, 100, yO) + Ds(88, yI, 100, yI) + Tx(82, 66, "h", "end")
      + Dm(160, y0, 160, yI) + Ds(140, yI, 165, yI) + Tx(167, 99, "x", "start")
      + Dm(235, yR, 235, y0) + Ds(220, yR, 242, yR) + Tx(243, 73, "x", "start")
      + Tx(120, 62, nm === "bitki yağı" ? "yağ" : nm, "middle", INK, 10) + Tx(200, 120, "su"), `U-şəkilli boru: sol qolda ${nm} sütunu, sağ qolda su; ilkin səviyyə qırıq xətlə göstərilib`); }
  // 2. hydraulic press, the small piston is h higher than the big one
  function figPress2() {
    return Sv(270, 175, Fl("M41 50 H79 V134 H141 V100 H249 V159 H41 Z", LQ.su) + Pa("M40 30 V160 H250 V80") + Pa("M80 30 V135 H140 V80")
      + Rc(41, 44, 38, 6) + Rc(141, 94, 108, 6) + Rc(46, 22, 28, 22) + Tx(60, 38, "m₁", "middle", INK, 12) + Rc(165, 60, 60, 34) + Tx(195, 82, "m₂ = ?", "middle", INK, 12)
      + Ds(80, 50, 124, 50) + Ds(112, 100, 141, 100) + Dm(118, 50, 118, 100) + Tx(112, 80, "h", "end")
      + Tx(60, 95, "S₁") + Tx(195, 130, "S₂"), "Hidravlik press: kiçik porşen böyük porşenə nisbətən h hündürlükdə yuxarıdadır; kiçik porşenin üstündə m₁, böyüyünün üstündə m₂ yükü"); }
  // 3. vertical cylinder: piston of mass m on water, atmosphere on top
  function figCyl(nm) {
    return Sv(260, 200, Fl("M91 72 H179 V181 H91 Z", LQ.su) + Pa("M90 30 V182 H180 V30") + Rc(91, 58, 88, 14) + Tx(135, 69, "m", "middle", INK, 12)
      + Ar(105, 8, 105, 52) + Ar(135, 8, 135, 52) + Ar(165, 8, 165, 52) + Tx(190, 26, "p₀", "start") + Tx(135, 135, nm)
      + Ds(180, 72, 210, 72) + Ds(180, 182, 210, 182) + Dm(205, 72, 205, 182) + Tx(213, 132, "h", "start"), `Şaquli silindr: üstdə kütləsi m olan porşen, altında ${nm}, porşenin üstündə atmosfer təzyiqi p₀`); }
  // 4. graph p(h): straight line from 100 kPa, one grid point marked
  function figGraph(s, h1) { const p1 = 100 + s * h1, X = h => 50 + h * 20, Y = p => 200 - p * 0.85; let g = "";
    for (let h = 0; h <= 10; h += 2) g += Ln(X(h), 200, X(h), Y(200), GRD, 1) + Tx(X(h), 214, h, "middle", MUT, 10);
    for (let p = 0; p <= 200; p += 20) g += Ln(50, Y(p), 250, Y(p), GRD, 1) + Tx(44, Y(p) + 3.5, p, "end", MUT, 10);
    return Sv(300, 235, g + Ln(50, 200, 262, 200) + Ln(50, 200, 50, 22) + Tx(56, 16, "p, kPa", "start") + Tx(266, 204, "h, m", "start")
      + Ln(X(0), Y(100), X(10), Y(100 + 10 * s), ACC, 2.5) + Ds(X(h1), Y(p1), X(h1), 200) + Ds(50, Y(p1), X(h1), Y(p1)) + `<circle cx="${X(h1)}" cy="${fx(Y(p1))}" r="4" fill="${VEC}"/>`,
      "Açıq mayedə təzyiqin dərinlikdən asılılıq qrafiki: düz xətt, başlanğıcda 100 kPa; bir nöqtə işarələnib"); }
  // 5. manometer: sealed left arm with gas, open right arm; levels shifted by x from the initial level
  function figMano(gasLow, liq) { const y0 = 95, d = 20, yL = gasLow ? y0 + d : y0 - d, yR = gasLow ? y0 - d : y0 + d; let dots = "";
    [[100, 44], [116, 40], [110, 58], [122, 52], [102, 70], [120, 72]].forEach(([x, y]) => { if (y < yL - 6) dots += `<circle cx="${x}" cy="${y}" r="1.8" fill="${MUT}"/>`; });
    return Sv(300, 195, Fl(`M91 ${yL} H129 V140 Q129 149 140 149 H160 Q171 149 171 140 V${yR} H209 V152 Q209 169 192 169 H108 Q91 169 91 152 Z`, LQ[liq]) + dots
      + Pa("M90 30 V152 Q90 170 108 170 H192 Q210 170 210 152 V30") + Pa("M130 30 V140 Q130 150 140 150 H160 Q170 150 170 140 V30") + Ln(90, 30, 130, 30, INK, 3)
      + Tx(82, 60, "qaz", "end") + Ar(190, 8, 190, 28) + Tx(198, 18, "p₀", "start")
      + Ds(60, y0, 242, y0) + Tx(244, y0 - 2, "ilkin", "start", MUT, 11) + Tx(244, y0 + 11, "səviyyə", "start", MUT, 11)
      + Dm(70, y0, 70, yL) + Ds(70, yL, 90, yL) + Tx(63, (y0 + yL) / 2 + 4, "x", "end") + Dm(222, y0, 222, yR) + Ds(210, yR, 228, yR) + Tx(229, (y0 + yR) / 2 + 4, "x", "start"),
      "U-şəkilli manometr: sol qol yuxarıdan bağlıdır və qaz var, sağ qol açıqdır; hər qolda maye ilkin səviyyədən x qədər sürüşüb"); }
  // 6. mercury U-tube: water in the left arm, oil in the right arm
  function figThree() { const yL = 130, yR = 108;
    return Sv(280, 215, Fl(`M81 ${yL} H119 V152 Q119 161 130 161 H150 Q161 161 161 152 V${yR} H199 V168 Q199 185 182 185 H98 Q81 185 81 168 Z`, LQ.civə) + Fl(`M81 30 H119 V${yL} H81 Z`, LQ.su) + Fl(`M161 48 H199 V${yR} H161 Z`, LQ.yağ)
      + Pa("M80 20 V168 Q80 186 98 186 H182 Q200 186 200 168 V20") + Pa("M120 20 V152 Q120 162 130 162 H150 Q160 162 160 152 V20")
      + Tx(100, 82, "su") + Tx(180, 84, "kerosin", "middle", INK, 10) + Tx(140, 178, "civə", "middle", INK, 12)
      + Dm(58, 30, 58, yL) + Ds(58, 30, 81, 30) + Ds(58, yL, 81, yL) + Tx(52, 84, "h₁", "end")
      + Dm(222, 48, 222, yR) + Ds(200, 48, 228, 48) + Ds(200, yR, 228, yR) + Tx(230, 82, "h₂", "start")
      + Dm(140, yR, 140, yL) + Ds(119, yL, 140, yL) + Ds(140, yR, 161, yR) + Tx(140, 102, "Δh"), "U-şəkilli boruda civə: sol qolda su sütunu h₁, sağ qolda kerosin sütunu h₂; civənin səviyyələri arasındakı fərq Δh"); }
  // 7. hand lever (pivot at the left wall) pushes the small piston; l₂/l₁ = k
  function figLever(k) { const xf = 25, xh = 270, xa = xf + (xh - xf) / k;
    return Sv(300, 175, Fl(`M${fx(xa - 14)} 100 H${fx(xa + 14)} V149 H196 V100 H284 V164 H${fx(xa - 14)} Z`, LQ.su) + Pa(`M${fx(xa - 15)} 85 V165 H285 V85`) + Pa(`M${fx(xa + 15)} 85 V150 H195 V85`)
      + Rc(xa - 14, 94, 28, 6) + Rc(196, 94, 88, 6) + Rc(215, 66, 50, 28) + Tx(240, 85, "m = ?", "middle", INK, 12)
      + Ln(17, 8, 17, 70, INK, 4) + Ln(xf, 26, xh + 8, 26, INK, 5) + `<circle cx="${xf}" cy="26" r="4" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + Ln(xa, 28, xa, 94, INK, 3)
      + Ar(xh, 2, xh, 22) + Tx(xh + 8, 14, "F", "start")
      + Dm(xf, 40, xa, 40) + Tx((xf + xa) / 2, 54, "l₁") + Ds(xh, 29, xh, 66) + Dm(xf, 62, xh, 62) + Tx(62, 76, "l₂")
      + Tx(xa, 130, "S₁") + Tx(240, 130, "S₂"), "Hidravlik press: əl qolun ucuna F qüvvəsi ilə basır, qol porşenin çubuğunu itələyir; l₁ və l₂ dayaqdan olan məsafələr; böyük porşenin üstündə yük"); }
  // 8. press: force F₁ on the small piston, the load m is raised by H
  function figPress8() {
    return Sv(280, 175, Fl("M51 70 H89 V139 H151 V70 H249 V154 H51 Z", LQ.su) + Pa("M50 50 V155 H250 V50") + Pa("M90 50 V140 H150 V50")
      + Rc(51, 64, 38, 6) + Rc(151, 64, 98, 6) + Rc(175, 34, 50, 30) + Tx(200, 54, "m", "middle", INK, 12)
      + Ar(70, 22, 70, 60) + Tx(78, 36, "F₁", "start") + Ar(264, 64, 264, 30) + Tx(270, 52, "H", "start") + Tx(70, 110, "S₁") + Tx(200, 125, "S₂"),
      "Hidravlik qaldırıcı: kiçik porşenə F₁ qüvvəsi təsir edir, böyük porşenin üstündəki yük H hündürlüyə qalxır"); }
  // 9. vertical wall holding water: pressure grows linearly with depth
  function figWall() {
    let a = ""; [.25, .5, .75, 1].forEach(f => { a += Ar(60 + 70 * f, 40 + 130 * f, 63, 40 + 130 * f, VEC, 2); });
    return Sv(280, 195, Fl("M60 40 H230 V170 H60 Z", LQ.su) + Ln(60, 40, 230, 40, ACC, 2) + Rc(40, 20, 20, 150, PAP, INK, 2) + Ln(36, 170, 240, 170, INK, 3) + a + Ds(60, 40, 130, 170)
      + Tx(190, 110, "su") + Tx(50, 12, "divar", "middle", INK, 11) + Ds(232, 40, 256, 40) + Ds(232, 170, 256, 170) + Dm(250, 40, 250, 170) + Tx(258, 110, "H", "start")
      + Tx(140, 188, "divarın eni b şəklə perpendikulyardır", "middle", MUT, 11), "Şaquli divar və onun arxasındakı su: dərinlik H; divara təsir edən təzyiq dərinliyə görə düz xətlə artır"); }
  // 10. vessel widening upwards (frustum): bottom width 40, top width 40·√r
  function figFlare(r) { const cx = 140, bw = 40, tw = 40 * Math.sqrt(r), tl = cx - tw / 2, tr = cx + tw / 2, bl = cx - bw / 2, br = cx + bw / 2;
    return Sv(280, 200, Fl(`M${fx(tl)} 45 L${bl} 165 H${br} L${fx(tr)} 45 Z`, LQ.su) + Pa(`M${fx(tl)} 45 L${bl} 165 H${br} L${fx(tr)} 45`) + Ln(tl, 45, tr, 45, ACC, 2)
      + Tx(cx, 68, "S₂") + Tx(cx, 112, "su") + Tx(cx, 156, "S₁") + Ds(tr, 45, 258, 45) + Ds(br, 165, 258, 165) + Dm(252, 45, 252, 165) + Tx(260, 110, "h", "start"),
      "Yuxarıya doğru genişlənən qab: dibinin sahəsi S₁, suyun səthinin sahəsi S₂, su qatının hündürlüyü h"); }
  // ==figs-end==
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. U-tube, oil poured into one arm: how far the water rises in the other arm
    { tip: "qapali", gen: () => again(() => {
      const [nm, rho] = pick([["kerosin", 800], ["bitki yağı", 900], ["benzin", 700]]), ho = pick([10, 15, 20, 25, 30, 35, 40, 50, 60]), hw = rho * ho / 1000, x = hw / 2;
      const w = [hw, ho - hw, ho / 2, (ho - hw) / 2]; if (![x, ...w].every(v => ok1(v, 1))) return null;
      return mc(ae(x, w, U_("sm")), { svg: svgEl(figU(nm)), text: `U-şəkilli borunun qollarının en kəsiyi eynidir, boruda su var. Sol qola ${ho} sm hündürlüyündə ${nm} (ρ = ${rho} kq/m³) tökdülər (maye qarışmır, borudan daşmır). Sağ qolda suyun səviyyəsi ilkin səviyyədən neçə sm yuxarı qalxır?`,
        solution: `Maye–su sərhədi səviyyəsində təzyiqlər bərabərdir: ρ_su·h_su = ρ·h, h_su = ${rho}·${ho}/1000 = ${F(hw)} sm. Bu, sağ qolda suyun səthinin sərhəddən yuxarı olma hündürlüyüdür. Sərhəd ilkin səviyyədən x aşağı düşüb, sağ səth x qalxıb (qolların kəsiyi eynidir): 2x = ${F(hw)}, x = ${F(x)} sm. Tələlər: 2-yə bölməyi unutmaq (${F(hw)} sm), sərbəst səthlər arasındakı fərqi suyun qalxması ilə qarışdırmaq (${ho} − ${F(hw)} = ${F(ho - hw)} sm), «yağ sütununun yarısı» — sıxlıqları nəzərə almamaq (${ho}/2 = ${F(ho / 2)} sm), həmin fərqi də yarıya bölmək (${F((ho - hw) / 2)} sm).` });
    }) },
    // 2. two pistons at different levels in equilibrium
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const S1 = pick([10, 20, 25, 50]), k = pick([4, 5, 10]), S2 = S1 * k, m1 = pick([1, 2, 3, 4, 5, 6, 10]), hh = pick([0.2, 0.25, 0.4, 0.5, 1]), rho = pick([800, 900, 1000]);
      const dm = rho * hh * S2 / 1e4, m2 = k * m1 + dm, w = [k * m1, k * m1 - dm, m1 + dm, k * m1 + rho * hh * S1 / 1e4];
      if (![m2, ...w].every(v => ok1(v, 2))) return null;
      return mc(ae(m2, w, U_("kq")), { svg: svgEl(figPress2()), text: `Hidravlik pressin kiçik porşeninin sahəsi ${S1} sm², böyüyünün sahəsi ${S2} sm²-dir. Kiçik porşen böyük porşenə nisbətən h = ${F(hh)} m yuxarıdadır, qabda ρ = ${rho} kq/m³ olan maye var. Kiçik porşenin üstünə ${m1} kq yük qoyulub. Porşenlərin tarazlıqda qalması üçün böyük porşenin üstünə neçə kq yük qoymaq lazımdır? (Porşenlərin kütləsi nəzərə alınmır, g = 10 m/s².)`,
        solution: `Böyük porşenin səviyyəsində mayenin izafi təzyiqi (atmosfer hər iki porşenin üstündə eynidir, sönür): p_izafi = F₁/S₁ + ρgh (kiçik porşen yuxarıdadır, onun altından h qədər maye sütunu əlavə olunur). F₂ = p_izafi·S₂ = m₂g. m₂ = S₂(m₁/S₁ + ρh) = ${F(S2 / 1e4)}·(${m1}/${F(S1 / 1e4)} + ${rho}·${F(hh)}) = ${F(k * m1)} + ${F(dm)} = ${F(m2)} kq. Tələlər: hündürlük fərqini unutmaq (${F(k * m1)} kq), onu çıxmaq (${F(k * m1 - dm)} kq), sahələrin nisbətini yalnız maye hissəsinə tətbiq etmək (${F(m1 + dm)} kq), maye sütununun hissəsini S₂ əvəzinə kiçik porşenin sahəsi ilə hesablamaq (${F(k * m1 + rho * hh * S1 / 1e4)} kq).` });
    }) },
    // 3. pressure at the bottom under a heavy piston, atmosphere on top
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const S = pick([50, 100, 200, 250, 500]), m = pick([2, 4, 5, 10, 20, 25]), hh = pick([0.2, 0.3, 0.5, 1, 2]), [nm, rho] = pick([["su", 1000], ["su", 1000], ["bitki yağı", 900]]);
      const pp = 100 * m / S, pl = rho * g * hh / 1000, p = 100 + pp + pl, w = [pp + pl, 100 + pl, 100 + pp, 100 - pp + pl];
      if (![p, ...w].every(v => ok1(v, 2))) return null;
      return mc(ae(p, w, U_("kPa")), { svg: svgEl(figCyl(nm)), text: `Şaquli silindrdə ${nm} (ρ = ${rho} kq/m³) var, onun üstündə sərbəst hərəkət edən porşen dayanıb. Porşenin kütləsi ${m} kq, sahəsi ${S} sm², maye qatının hündürlüyü ${F(hh)} m-dir. Atmosfer təzyiqi 100 kPa, g = 10 m/s². Silindrin dibində təzyiq neçə kPa-dır?`,
        solution: `Porşen tarazlıqdadır: altındakı mayenin üst təzyiqi p₁ = p₀ + mg/S = 100 kPa + ${m}·10/${F(S / 1e4)} Pa = 100 + ${F(pp)} = ${F(100 + pp)} kPa. Dibə qədər maye sütunu əlavə olunur: ρgh = ${rho}·10·${F(hh)} = ${F(pl * 1000)} Pa = ${F(pl)} kPa. p = ${F(100 + pp)} + ${F(pl)} = ${F(p)} kPa. Tələlər: atmosferi unutmaq (${F(pp + pl)} kPa), porşenin çəkisini unutmaq (${F(100 + pl)} kPa), mayenin təzyiqini unutmaq (${F(100 + pp)} kPa), porşenin çəkisini artırmaq əvəzinə çıxmaq (${F(100 - pp + pl)} kPa).` });
    }) },
    // 4. read p(h) off a graph with an intercept, then extend
    { tip: "qapali", minVariety: 10, gen: () => again(() => {
      const s = pick([4, 5, 8, 10]), h1 = pick([2, 4, 5, 6, 8, 10]); if ((s * h1) % 20 !== 0 || s * h1 > 100) return null;
      const p1 = 100 + s * h1, H = pick([12, 15, 20, 25, 30, 40]), p = 100 + s * H, w = [p1 / h1 * H, s * H, p1 + s * H, 100 + s * (H - h1)];
      return mc(ae(p, w, U_("kPa")), { svg: svgEl(figGraph(s, h1)), text: `Qrafikdə açıq mayedə (bircins) təzyiqin dərinlikdən asılılığı verilib. Eyni mayedə ${H} m dərinlikdə təzyiq neçə kPa olar?`,
        solution: `Qrafikdən: h = 0-da p = 100 kPa (atmosfer). Nöqtə: h = ${h1} m, p = ${p1} kPa. ${h1} m-ə təzyiq artımı ${p1} − 100 = ${s * h1} kPa, yəni hər metrə ${s} kPa. ${H} m-də: p = 100 + ${s}·${H} = ${p} kPa. Tələlər: xətti başlanğıcdan keçən saymaq (${F(p1 / h1 * H)} kPa), atmosferi unutmaq (${s * H} kPa), başlanğıc nöqtəni təkrar saymaq (${F(p1 + s * H)} kPa), artımı atmosferdən yox, işarələnmiş nöqtədən sonrakı hissədən hesablamaq (${F(100 + s * (H - h1))} kPa).` });
    }) },
    // 5. manometer with a sealed arm: both levels shifted by x
    { tip: "qapali", gen: () => again(() => {
      const [nm, rho, key] = pick([["su", 1000, "su"], ["kerosin", 800, "yağ"], ["civə", 13600, "civə"]]), x = pick([2, 3, 4, 5, 6, 8, 10, 15, 20, 25]), low = Math.random() < .5, s = low ? 1 : -1;
      const e = rho * g * x / 100 / 1000, d = 2 * e, p = 100 + s * d, w = [100 + s * e, 100 - s * d, d, 100 - s * e];
      if (![p, ...w].every(v => ok1(v, 2))) return null;
      return mc(ae(p, w, U_("kPa")), { svg: svgEl(figMano(low, key)), text: `U-şəkilli manometrin sol qolu yuxarıdan bağlıdır və orada qaz var, sağ qolu açıqdır; qolların en kəsiyi eynidir. Manometrdə ${nm} (ρ = ${rho} kq/m³) var. Sol qolda maye ilkin səviyyədən ${x} sm ${low ? "aşağı düşüb, sağ qolda eyni qədər qalxıb" : "yuxarı qalxıb, sağ qolda eyni qədər düşüb"}. Atmosfer təzyiqi 100 kPa-dır. Qazın təzyiqi neçə kPa-dır?`,
        solution: `Səviyyələr arasındakı fərq iki dəfə çoxdur: Δh = 2x = ${2 * x} sm = ${F(2 * x / 100)} m. Hidrostatik fərq: ρgΔh = ${rho}·10·${F(2 * x / 100)} = ${F(d * 1000)} Pa = ${F(d)} kPa. ${low ? "Qaz tərəfdə maye aşağıdadır, deməli qazın təzyiqi atmosferdən böyükdür" : "Qaz tərəfdə maye yuxarıdadır, deməli qazın təzyiqi atmosferdən kiçikdir"}: p = 100 ${low ? "+" : "−"} ${F(d)} = ${F(p)} kPa. Tələlər: Δh əvəzinə x götürmək (${F(100 + s * e)} kPa), işarəni səhv seçmək (${F(100 - s * d)} kPa), izafi təzyiqin modulunu mütləq təzyiq saymaq (${F(d)} kPa), həm x götürmək, həm işarəni səhv seçmək (${F(100 - s * e)} kPa).` });
    }) },
    // 6. three liquids in a U-tube: water, kerosene, mercury
    { tip: "qapali", minVariety: 10, gen: () => again(() => {
      const hw = pick([20, 24, 25, 30, 32, 36, 40, 44, 48, 50, 60]), dl = pick([1, 2, 3]), ho = 1.25 * hw - 17 * dl, w = [1.25 * hw, hw - dl, 1.25 * hw + 17 * dl, hw - 17 * dl];
      if (![ho, ...w].every(v => ok1(v, 2))) return null;
      return mc(ae(ho, w, U_("sm")), { svg: svgEl(figThree()), text: `U-şəkilli boruda civə (ρ = 13600 kq/m³) var. Sol qola ${hw} sm hündürlüyündə su, sağ qola kerosin (ρ = 800 kq/m³) tökülüb; sol qolda civənin səviyyəsi sağdakından ${dl} sm aşağıdır. Kerosin sütununun hündürlüyü neçə sm-dir?`,
        solution: `Sol qolda civənin səviyyəsində (ən aşağı sərhəd) təzyiqlər bərabərdir: ρ_su·g·h₁ = ρ_k·g·h₂ + ρ_civə·g·Δh. h₂ = (1000·${hw} − 13600·${dl})/800 = ${F(1.25 * hw)} − ${17 * dl} = ${F(ho)} sm. Tələlər: civəni nəzərə almamaq (${F(1.25 * hw)} sm), civənin işarəsini səhv seçmək (${F(1.25 * hw + 17 * dl)} sm), su sütununun hündürlüyünü sıxlıqlar nisbətinə (1000/800) vurmağı unutmaq (${hw} − ${17 * dl} = ${hw - 17 * dl} sm), sıxlıqları ümumiyyətlə nəzərə almamaq (${hw} − ${dl} = ${hw - dl} sm).` });
    }) },
    // 7. hand lever + hydraulic press: load in equilibrium
    { tip: "qapali", birlesik: "fiz-moment", gen: () => again(() => {
      const k = pick([2, 3, 4, 5]), Fh = pick([10, 20, 25, 30, 40, 50]), S1 = pick([10, 20, 25]), S2 = pick([100, 200, 250, 500]), n = S2 / S1;
      const m = Fh * k * n / g, w = [Fh * n / g, Fh * n / k / g, Fh * k / g, Fh * k / n / g];
      if (![m, ...w].every(v => ok1(v, 2))) return null;
      return mc(ae(m, w, U_("kq")), { svg: svgEl(figLever(k)), text: `Əl qolun ucuna F = ${Fh} N qüvvə ilə basır. Qol dayaqdan l₂ məsafədə basılır, porşenin çubuğu dayaqdan l₁ məsafədədir, l₂ = ${k}·l₁. Porşenlərin sahələri S₁ = ${S1} sm² və S₂ = ${S2} sm²-dir. Sistem tarazlıqdadır. Böyük porşenin üstündəki yükün kütləsi neçə kq-dır? (Qolun və porşenlərin kütləsi nəzərə alınmır, g = 10 m/s².)`,
        solution: `Qolun momentləri dayağa nisbətən: F·l₂ = F₁·l₁ → F₁ = F·${k} = ${F(Fh * k)} N (porşenə). Press: F₂ = F₁·S₂/S₁ = ${F(Fh * k)}·${F(n)} = ${F(Fh * k * n)} N. m = F₂/g = ${F(m)} kq. Tələlər: qolu unutmaq (${F(Fh * n / g)} kq), qolun nisbətini tərsinə yazmaq (${F(Fh * n / k / g)} kq), pressi unutmaq (${F(Fh * k / g)} kq), sahələrin nisbətini tərsinə yazmaq (${F(Fh * k / n / g)} kq).` });
    }) },
    // 8. energy conservation in a hydraulic lift: force on the small piston AND the work (answer pairs; needs the area ratio)
    { tip: "qapali", birlesik: "fiz-is-guc", gen: () => again(() => {
      const k = pick([4, 5, 10, 20, 25]), m = pick([10, 20, 25, 40, 50, 100]), H = pick([0.1, 0.2, 0.25, 0.5]), W = m * g, F1 = W / k, A = W * H, l1 = k * H;
      const w = [[F1, A / k], [W, A], [F1, A * k], [W * k, W * k * H]];
      const pr = ([f, a]) => `F₁ = ${F(f)} N, A = ${F(a)} J`;
      if (![F1, A, ...w.flat()].every(v => ok1(v, 2))) return null;
      return mc(ae([F1, A], w, pr), { svg: svgEl(figPress8()), text: `Hidravlik qaldırıcıda böyük porşenin sahəsi kiçik porşeninkindən ${k} dəfə böyükdür. Böyük porşenin üstündəki ${m} kq kütləli yük çox yavaş (kinetik enerji yoxdur) ${F(H)} m hündürlüyə qaldırılır; kiçik porşenə təsir edən F₁ qüvvəsi bütün hərəkət boyu sabitdir. Sürtünmə və itkilər yoxdur, porşenlərin kütləsi nəzərə alınmır, mayenin potensial enerjisi dəyişmir, g = 10 m/s². F₁ qüvvəsi neçə N-dur və o, bu hərəkətdə neçə J iş görür?`,
        solution: `Paskal qanunu: F₁ = F₂/${k} = mg/${k} = ${F(W)}/${k} = ${F(F1)} N. Maye sıxılmır: S₁l₁ = S₂H, kiçik porşenin yolu l₁ = ${k}·H = ${F(l1)} m. A = F₁·l₁ = ${F(F1)}·${F(l1)} = ${F(A)} J. (Yoxlama: itkisiz, yavaş qaldırmada iş yükün potensial enerjisinin artımına bərabərdir: mgH = ${F(W)}·${F(H)} = ${F(A)} J — qüvvə ${k} dəfə kiçikdir, yol ${k} dəfə böyükdür, işdə qazanc yoxdur.) Tələlər: qüvvəni sahələr nisbətinə bölməyi unutmaq, F₁ = mg (${F(W)} N, ${F(A)} J), kiçik porşenin yolunu H götürmək (${F(F1)} N, ${F(F1 * H)} J), işi də sahə nisbətinə vurmaq (${F(F1)} N, ${F(A * k)} J), qüvvəni nisbətə bölmək əvəzinə vurmaq və kiçik porşenin yolunu da H götürmək (${F(W * k)} N, ${F(W * k * H)} J).` });
    }) },
    // 9. force of water on a vertical wall: average pressure ρgH/2
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const b = pick([1, 2, 3, 4, 5]), H = pick([2, 3, 4, 5, 6]), Fk = 5 * H * H * b, w = [10 * H * H * b, 10 * H * b, 5 * H * b, (100 + 5 * H) * H * b];
      return mc(ae(Fk, w, U_("kN")), { svg: svgEl(figWall()), text: `Çəndə suyun dərinliyi H = ${H} m-dir. Düzbucaqlı şaquli divarın eni (şəklə perpendikulyar) b = ${b} m-dir; divarın bir tərəfində su, o biri tərəfində hava var; suyun üstündə də, divarın arxasında da atmosfer təzyiqi 100 kPa-dır. Su və havanın divara göstərdiyi təzyiq qüvvələrinin əvəzləyicisi (xalis qüvvə) neçə kN-dur? (Divarın üzərinə yalnız bu iki təzyiq təsir edir.) (ρ = 1000 kq/m³, g = 10 m/s².)`,
        solution: `Atmosfer iki tərəfdən sönür. Su təzyiqi dərinliklə sıfırdan ρgH-a qədər xətti artır, orta təzyiq ρgH/2 = 1000·10·${H}/2 = ${F(5 * H)} kPa. Divarın sahəsi H·b = ${H * b} m². F = (ρgH/2)·Hb = ${F(5 * H)}·${H * b} = ${F(Fk)} kN. Tələlər: dibdəki təzyiqi orta təzyiq saymaq (${F(10 * H * H * b)} kN), orta təzyiqi H·b sahəsinə yox, yalnız b-yə vurmaq (${F(5 * H * b)} kN), dibdəki təzyiqi yalnız b-yə vurmaq (${F(10 * H * b)} kN), su tərəfdəki atmosfer təzyiqini nəzərə alıb divarın arxasındakını unutmaq (${F((100 + 5 * H) * H * b)} kN).` });
    }) },
    // 10. vessel widening upwards: force on the bottom is less than the weight of the water
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const r = pick([4, 9, 16]), S1 = pick([20, 25, 40, 50]), S2 = S1 * r, hh = pick([0.2, 0.3, 0.4, 0.5, 0.6]), V = hh * S1 / 1e4 * (1 + r + Math.sqrt(r)) / 3, m = 1000 * V;
      if (!nice(m, 1) || m <= 0) return null;
      const Fb = 1000 * g * hh * S1 / 1e4, W = m * g, w = [W, 1000 * g * hh * S2 / 1e4, 1000 * g * hh * (S1 + S2) / 2 / 1e4, W - Fb];
      if (![Fb, ...w].every(v => ok1(v, 2))) return null;
      return mc(ae(Fb, w, U_("N")), { svg: svgEl(figFlare(r)), text: `Yuxarıya doğru genişlənən qabda ${F(m)} kq su var. Dibinin sahəsi S₁ = ${S1} sm², suyun səthinin sahəsi S₂ = ${S2} sm², su qatının hündürlüyü h = ${F(hh)} m-dir (ρ = 1000 kq/m³, g = 10 m/s², atmosfer nəzərə alınmır). Suyun qabın dibinə təzyiq qüvvəsi neçə N-dur?`,
        solution: `Dibdə təzyiq yalnız ρgh-dan asılıdır: p = 1000·10·${F(hh)} = ${F(1000 * g * hh)} Pa. F = pS₁ = ${F(1000 * g * hh)}·${F(S1 / 1e4)} = ${F(Fb)} N. Bu, suyun çəkisindən (${F(W)} N) kiçikdir: çəkinin bir hissəsini maili divarlar tutur. Tələlər: çəkini cavab yazmaq (${F(W)} N), səthin sahəsini götürmək (${F(1000 * g * hh * S2 / 1e4)} N), sahələrin ortasını götürmək (${F(1000 * g * hh * (S1 + S2) / 2 / 1e4)} N), çəki ilə dib qüvvəsinin fərqini (${F(W - Fb)} N) cavab yazmaq.` });
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
      key: "fiz-tezyiq", title: "Təzyiq, hidrostatik təzyiq, Paskal qanunu", fenn: "fizika", link: "dersler/fiz-tezyiq.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: Pa, kPa, N, m, kq/m³). Onluq kəsr vergül və ya nöqtə ilə: 0,5. g = 10 m/s², atmosfer təzyiqi 100 kPa.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["pres", "pres", "hidro", "hidro", "atm", "rabite", "rabite", "press", "press", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-tezyiq.html")) b.push("dersler/fiz-tezyiq.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
