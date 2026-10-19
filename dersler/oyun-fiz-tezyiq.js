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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-tezyiq", title: "Təzyiq, hidrostatik təzyiq, Paskal qanunu", fenn: "fizika", link: "dersler/fiz-tezyiq.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: Pa, kPa, N, m, kq/m³). Onluq kəsr vergül və ya nöqtə ilə: 0,5. g = 10 m/s², atmosfer təzyiqi 100 kPa.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["pres", "pres", "hidro", "hidro", "atm", "rabite", "rabite", "press", "press", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-tezyiq.html")) b.push("dersler/fiz-tezyiq.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
