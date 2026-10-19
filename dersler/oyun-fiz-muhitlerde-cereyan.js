// Fizika · Müxtəlif mühitlərdə cərəyan — mastery game levels (Faraday, qalvanoplastika, qaz/vakuum/yarımkeçirici tanıma, diod dövrələri, R(t)) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units (mq/mkm where stated), g = 10 m/s².
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const cap = s => s[0].toUpperCase() + s.slice(1);
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };

  // elektrokimyəvi ekvivalent k (mq/C) və sıxlıq ρ (kq/m³)
  const MET = {
    cu: { ad: "mis", k: 0.33, rho: 8900 }, ag: { ad: "gümüş", k: 1.12, rho: 10500 }, ni: { ad: "nikel", k: 0.30, rho: 8900 },
    zn: { ad: "sink", k: 0.34, rho: 7100 }, cr: { ad: "xrom", k: 0.18, rho: 7200 }, al: { ad: "alüminium", k: 0.093, rho: 2700 },
  };
  const tt = t => (t % 60 === 0 && t >= 300) ? `${t / 60} dəq` : `${t} s`;
  const ttSol = t => (t % 60 === 0 && t >= 300) ? `t = ${t / 60} dəq = ${t} s. ` : "";

  // plating cases whose thickness h = 10·k·I·t/(ρ[q/sm³]·S) (mkm) is a clean number
  const PL = { ag: [], cr: [] };
  for (const key of ["ag", "cr"]) {
    const mt = MET[key];
    for (const I of [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20]) for (const t of [300, 600, 900, 1200, 1800, 2400, 3000, 3600, 5400, 7200]) for (let S = 20; S <= 300; S++) {
      const hh = 10 * mt.k * I * t / (mt.rho / 1000 * S);
      if (hh >= 2 && hh <= 100 && nice(hh, 1)) PL[key].push({ key, I, t, S, h: +hh.toFixed(1) });
    }
  }
  const plPick = key => pick(PL[key || pick(["ag", "cr"])]);

  const platingSol = c => {
    const mt = MET[c.key], m = mt.k * c.I * c.t, rg = mt.rho / 1000;
    return `q = I·t = ${c.I}·${c.t} = ${c.I * c.t} C. m = k·q = ${F(mt.k)}·${c.I * c.t} = ${F(m)} mq = ${F(m / 1000)} q. ρ = ${F(rg)} q/sm³. h = m/(ρ·S) = ${F(m / 1000)}/(${F(rg)}·${c.S}) = ${F(c.h / 1e4)} sm = ${F(c.h)} mkm.`;
  };

  // ---------- diod dövrəsi (SVG) ----------
  // plusTop: batareyanın + qütbü yuxarıdadır; right: diodun üçbucağı sağa baxır; r2: paralel rezistor (və ya 0)
  function circuit(o) {
    const ink = "#17171a", top = 30, bot = 140, xb = 40, xr = 215;
    const g = sv("svg", { viewBox: "0 0 300 170", class: "oy-svg", role: "img", "aria-label": "Diodlu elektrik dövrəsi" });
    const L = (x1, y1, x2, y2, w) => g.append(sv("line", { x1, y1, x2, y2, stroke: ink, "stroke-width": w || 2, "stroke-linecap": "round" }));
    const T = (x, y, s, an) => g.append(sv("text", { x, y, "text-anchor": an || "middle", class: "oy-lbl" }, s));
    // batareya
    const yl = o.plusTop ? 72 : 84, ys = o.plusTop ? 84 : 72;
    L(xb, top, xb, 72); L(xb, 84, xb, bot);
    L(xb - 14, yl, xb + 14, yl, 2); L(xb - 7, ys, xb + 7, ys, 5);
    T(xb + 26, yl + 4, "+"); T(xb + 26, ys + 5, "−");
    T(xb, 162, `U = ${o.U} V`);
    // naqillər və diod
    L(xb, top, 140, top); L(165, top, xr, top); L(xb, bot, xr, bot);
    g.append(sv("polygon", { points: o.right ? "140,18 140,42 165,30" : "165,18 165,42 140,30", fill: ink }));
    L(o.right ? 165 : 140, 18, o.right ? 165 : 140, 42, 3);
    // R1
    L(xr, top, xr, 62); g.append(sv("rect", { x: xr - 10, y: 62, width: 20, height: 46, fill: "none", stroke: ink, "stroke-width": 2 })); L(xr, 108, xr, bot);
    T(xr + 16, 89, `R₁ = ${o.R1} Ω`, "start");
    if (o.R2) {
      L(90, top, 90, 62); g.append(sv("rect", { x: 80, y: 62, width: 20, height: 46, fill: "none", stroke: ink, "stroke-width": 2 })); L(90, 108, 90, bot);
      g.append(sv("circle", { cx: 90, cy: top, r: 3, fill: ink })); g.append(sv("circle", { cx: 90, cy: bot, r: 3, fill: ink }));
      T(104, 89, `R₂ = ${o.R2} Ω`, "start");
    }
    return g;
  }

  // ---------- tanıma bankı ----------
  const BANK = [
    ["Elektrolit məhlulunda cərəyanı hansı hissəciklər daşıyır?", "müsbət və mənfi ionlar", ["yalnız sərbəst elektronlar", "neytral molekullar", "yalnız protonlar"], "Duz suda ionlara parçalanır; cərəyanı ionlar daşıyır."],
    ["Duzun suda müsbət və mənfi ionlara parçalanması necə adlanır?", "elektrolitik dissosiasiya", ["ionlaşma zərbəsi", "kristallaşma", "termoelektron emissiyası"], "Bu proses elektrolitik dissosiasiyadır."],
    ["Elektrolizdə müsbət ionlar hansı elektroda gedir?", "katoda (mənfi elektrod)", ["anoda (müsbət elektrod)", "hər iki elektroda bərabər", "heç birinə"], "Müsbət ionlar mənfi yüklü katoda çəkilir."],
    ["Hansı maye elektrik cərəyanını yaxşı keçirir?", "mis kuporosunun suda məhlulu", ["distillə edilmiş su", "şəkərin suda məhlulu", "təmiz tərəyağı"], "Yalnız ionlara dissosiasiya edən maddələrin məhlulu keçirir."],
    ["Normal şəraitdə qaz niyə cərəyan keçirmir?", "neytral molekullardır, sərbəst yük daşıyıcıları yoxdur", ["molekulları çox ağırdır", "qazda yalnız müsbət ionlar var", "qaz həmişə vakuumdur"], "Qaz əvvəl ionlaşmalıdır, yalnız bundan sonra keçirici olur."],
    ["Qazda yüklü hissəciklərin yaranması necə adlanır?", "ionlaşma", ["dissosiasiya", "kondensasiya", "difuziya"], "Neytral molekuldan elektron qopur — qaz ionlaşır."],
    ["Şimşək hansı qaz boşalmasıdır?", "qığılcım boşalması", ["parıltılı boşalma", "qövs boşalması", "tac boşalması"], "Şimşək — çox yüksək gərginlikdə qısamüddətli qığılcım boşalmasıdır."],
    ["Flüoresan lampada və neon reklamlarda hansı boşalma işləyir?", "parıltılı boşalma", ["qığılcım boşalması", "qövs boşalması", "şimşək"], "Seyrəldilmiş qazda parıltılı boşalma baş verir."],
    ["Elektrik qaynağında hansı boşalmadan istifadə edirlər?", "qövs boşalması", ["parıltılı boşalma", "tac boşalması", "qığılcım boşalması"], "Qövs: böyük cərəyan, çox yüksək temperatur — metalı əridir."],
    ["Yüksək gərginlik naqillərinin sivri ucunda sönük parıltı və xışıltı hansı boşalmadır?", "tac boşalması", ["qövs boşalması", "parıltılı boşalma", "qığılcım boşalması"], "Sivri yerlərdə sahə güclüdür, orada tac boşalması başlayır."],
    ["Termoelektron emissiyası nədir?", "qızdırılmış metaldan elektronların çıxması", ["metalın işıqda əriməsi", "ionların katoda yığılması", "qazın ionlaşması"], "Qızdırılmış katod vakuuma elektron buraxır."],
    ["Vakuum dioduna gərginlik verəndə elektronlar hansı istiqamətdə hərəkət edir?", "qızdırılmış katoddan anoda", ["anoddan katoda", "hər iki istiqamətdə", "hərəkət etmir"], "Yalnız qızdırılmış katod elektron verir, ona görə diod bir tərəfli keçirir."],
    ["Vakuum dioduna elektronlar haradan gəlir?", "qızdırılmış katoddan", ["soyuq anoddan", "vakuumdakı qazdan", "şüşə balondan"], "Vakuumda qaz yoxdur, elektronlar katoddan çıxır."],
    ["Elektron-şüa borusunda (köhnə televizor, osiloskop) elektron dəstəsini nə yönəldir?", "elektrik və ya maqnit sahəsi", ["yalnız qravitasiya", "qaz axını", "mayenin təzyiqi"], "Elektronlar yüklüdür, sahə onların istiqamətini dəyişir."],
    ["Yarımkeçiricinin temperaturu artanda müqaviməti necə dəyişir?", "azalır", ["artır", "dəyişmir", "sıfır olur"], "Qızdırdıqca sərbəst daşıyıcılar çoxalır."],
    ["Metal naqilin temperaturu artanda müqaviməti necə dəyişir?", "artır", ["azalır", "dəyişmir", "əvvəl azalır, sonra sıfır olur"], "İon qəfəsinin rəqsləri güclənir, elektronlara mane olur."],
    ["Elektrolitin temperaturu artanda müqaviməti necə dəyişir?", "azalır", ["artır", "dəyişmir", "sonsuz olur"], "Qızdıqca məhlulun özlülüyü azalır, ionlar sürətlə hərəkət edir."],
    ["n-tip yarımkeçiricidə əsas yük daşıyıcıları hansılardır?", "elektronlar", ["deşiklər", "müsbət ionlar", "neytronlar"], "n — negative: əsas daşıyıcılar elektronlardır."],
    ["p-tip yarımkeçiricidə əsas yük daşıyıcıları hansılardır?", "deşiklər", ["elektronlar", "mənfi ionlar", "protonlar"], "p — positive: əsas daşıyıcılar müsbət deşiklərdir."],
    ["İşıqlandırılanda müqaviməti azalan element hansıdır?", "fotorezistor", ["adi mis naqil", "vakuum diodu", "nikrom spiral"], "Fotorezistor: işıq çox olduqca müqavimət azalır."],
    ["Qızdıranda müqaviməti kəskin azalan yarımkeçirici element hansıdır?", "termistor", ["rezistor (nikrom)", "volfram tel", "mis naqil"], "Termistor temperatur sensorudur, onun müqaviməti qızdıqca azalır."],
    ["p–n keçid hansı halda cərəyanı keçirir?", "p-tərəf mənbənin + qütbünə, n-tərəf − qütbünə qoşulanda", ["p-tərəf − qütbə, n-tərəf + qütbə qoşulanda", "həmişə eyni keçirir", "heç vaxt keçirmir"], "Düz qoşulmada keçid açılır, əks qoşulmada bağlanır."],
    ["Diodun işarəsində üçbucaq hara baxırsa, cərəyan hansı istiqamətdə keçir?", "üçbucağın baxdığı tərəfə (anoddan katoda)", ["üçbucağın əksinə", "hər iki tərəfə", "yalnız xəttdən üçbucağa"], "Üçbucaq — ox: düz cərəyan onun istiqamətindədir."],
  ];

  const levels = [
    { id: "faraday", ad: "Faraday qanunu m = kIt", izah: "Katodda ayrılan kütlə keçən yüklə mütənasibdir: m = k·q = k·I·t. k mq/C ilə verilir. Dəqiqəni saniyəyə çevir (1 dəq = 60 s).",
      gen() {
        const kind = pick(["m", "m", "I", "t", "k", "ard"]);
        if (kind === "ard") {
          const [a, b] = pick([["cu", "ag"], ["ag", "cu"], ["cu", "ni"], ["ni", "ag"], ["zn", "cu"], ["cr", "ag"]]).map(x => MET[x]);
          let q, m1, m2; do { q = pick([200, 300, 500, 1000, 1500, 2000, 2500, 3000]); m1 = a.k * q; m2 = b.k * q; } while (!nice(m1, 2) || !nice(m2, 2));
          return R(m2, "mq", { text: `İki elektroliz hamamı ardıcıl qoşulub. Birində ${a.ad} (k = ${F(a.k)} mq/C), digərində ${b.ad} (k = ${F(b.k)} mq/C) ayrılır. ${cap(a.ad)} hamamının katodunda ${F(m1)} mq ${a.ad} çökdü. ${cap(b.ad)} hamamının katodunda neçə mq ${b.ad} çökər?`,
            solution: `Ardıcıl qoşulmada I və t eynidir, yəni q eynidir. q = m₁/k₁ = ${F(m1)}/${F(a.k)} = ${q} C. m₂ = k₂·q = ${F(b.k)}·${q} = ${F(m2)} mq.` });
        }
        let mt, I, t, m;
        for (;;) { mt = MET[pick(["cu", "cu", "ag", "ni", "zn", "cr", "al"])]; I = pick([1, 2, 3, 4, 5, 6, 8, 10]); t = pick([100, 200, 250, 300, 500, 600, 900, 1000, 1200, 1800, 3600]); m = mt.k * I * t; if (nice(m, 2) && m >= 20 && m <= 9000) break; }
        const q = I * t;
        if (kind === "m") return R(m, "mq", { text: `Elektroliz hamamından ${I} A cərəyan ${tt(t)} keçirilib. Katodda ${mt.ad} ayrılır (k = ${F(mt.k)} mq/C). Katodda neçə mq ${mt.ad} ayrılır?`,
          solution: `${ttSol(t)}q = I·t = ${I}·${t} = ${q} C. m = k·q = ${F(mt.k)}·${q} = ${F(m)} mq.` });
        if (kind === "I") return R(I, "A", { text: `Elektrolizdə ${tt(t)} ərzində katodda ${F(m)} mq ${mt.ad} ayrılıb (k = ${F(mt.k)} mq/C). Cərəyan şiddəti neçə A-dır?`,
          solution: `${ttSol(t)}m = k·I·t → I = m/(k·t) = ${F(m)}/(${F(mt.k)}·${t}) = ${I} A.` });
        if (kind === "t") return R(t, "s", { text: `${I} A cərəyanla elektroliz aparılır, katodda ${mt.ad} ayrılır (k = ${F(mt.k)} mq/C). Katodda ${F(m)} mq ${mt.ad} toplanması üçün nə qədər vaxt lazımdır? Cavabı saniyə ilə yaz.`,
          solution: `m = k·I·t → t = m/(k·I) = ${F(m)}/(${F(mt.k)}·${I}) = ${t} s.` });
        return R(mt.k, "mq/C", { text: `Elektrolizdə ${I} A cərəyanla ${tt(t)} ərzində katodda ${F(m)} mq maddə ayrılıb. Bu maddənin elektrokimyəvi ekvivalenti k neçə mq/C-dir?`,
          solution: `${ttSol(t)}q = I·t = ${q} C. k = m/q = ${F(m)}/${q} = ${F(mt.k)} mq/C.` });
      } },
    { id: "qalin", ad: "Qalvanoplastika: qatın qalınlığı", izah: "Çökən kütlə m = k·I·t və m = ρ·S·h. Buradan h = m/(ρS). 1 mkm = 10⁻⁶ m = 10⁻⁴ sm. ρ-nu q/sm³-ə çevirmək rahatdır: 10 500 kq/m³ = 10,5 q/sm³.",
      gen() {
        const kind = pick(["h", "h", "t", "I", "kutle"]);
        if (kind === "kutle") {
          const mt = MET[pick(["cu", "ag", "ni", "zn", "cr"])];
          let S, hm, m; do { S = pick([20, 25, 40, 50, 100, 200, 250, 300]); hm = pick([5, 10, 20, 25, 40, 50]); m = mt.rho / 1000 * S * hm * 1e-4; } while (!nice(m, 3));
          return R(m, "q", { text: `Metal detalın səthi ${S} sm²-dir. Üzərinə ${hm} mkm qalınlığında ${mt.ad} qatı çəkilib (ρ = ${mt.rho} kq/m³). Bu qatın kütləsi neçə qramdır?`,
            solution: `h = ${hm} mkm = ${F(hm * 1e-4)} sm, ρ = ${F(mt.rho / 1000)} q/sm³. m = ρ·S·h = ${F(mt.rho / 1000)}·${S}·${F(hm * 1e-4)} = ${F(m)} q.` });
        }
        const c = plPick(), mt = MET[c.key], rho = `ρ = ${mt.rho} kq/m³`;
        if (kind === "h") return R(c.h, "mkm", { text: `Səthi ${c.S} sm² olan detal ${mt.ad} duzu məhlulunda katod kimi qoşulub. ${c.I} A cərəyan ${tt(c.t)} keçirilir (${mt.ad} üçün k = ${F(mt.k)} mq/C, ${rho}). Alınan ${mt.ad} qatının qalınlığı neçə mkm-dir? Qat bərabər çökür.`,
          solution: ttSol(c.t) + platingSol(c) });
        if (kind === "t") return R(c.t, "s", { text: `Səthi ${c.S} sm² olan detalın üzərinə ${F(c.h)} mkm qalınlığında ${mt.ad} qatı çəkirlər. Hamamdan ${c.I} A cərəyan keçir (k = ${F(mt.k)} mq/C, ${rho}). Proses neçə saniyə çəkər?`,
          solution: `m = ρ·S·h = ${F(mt.rho / 1000)}·${c.S}·${F(c.h / 1e4)} = ${F(mt.rho / 1000 * c.S * c.h / 1e4)} q = ${F(mt.rho * c.S * c.h / 1e4)} mq. t = m/(k·I) = ${F(mt.rho * c.S * c.h / 1e4)}/(${F(mt.k)}·${c.I}) = ${c.t} s.` });
        return R(c.I, "A", { text: `Səthi ${c.S} sm² olan detalın üzərinə ${tt(c.t)} ərzində ${F(c.h)} mkm qalınlığında ${mt.ad} qatı çəkilib (k = ${F(mt.k)} mq/C, ${rho}). Hamamdan neçə amper cərəyan keçib?`,
          solution: `${ttSol(c.t)}m = ρ·S·h = ${F(mt.rho / 1000)}·${c.S}·${F(c.h / 1e4)} = ${F(mt.rho * c.S * c.h / 1e4 / 1000)} q = ${F(mt.rho * c.S * c.h / 1e4)} mq. I = m/(k·t) = ${F(mt.rho * c.S * c.h / 1e4)}/(${F(mt.k)}·${c.t}) = ${c.I} A.` });
      } },
    { id: "qaz", ad: "Qaz, vakuum, yarımkeçirici", izah: "Qaz əvvəl ionlaşmalıdır; vakuumda yük daşıyıcıları katoddan çıxan elektronlardır; yarımkeçiricilərdə daşıyıcılar elektron və deşiklərdir.",
      gen() {
        if (Math.random() < .3) {
          const kind = pick(["simsek", "qovs", "vak"]);
          if (kind === "simsek") {
            let q, t; do { q = pick([10, 15, 20, 25, 30, 40, 50]); t = pick([0.001, 0.002, 0.004, 0.005, 0.01]); } while (!nice(q / t, 0));
            return R(q / t, "A", { text: `Şimşək zamanı buludla Yer arasından ${q} C yük ${F(t)} s ərzində keçib. Şimşəyin orta cərəyan şiddəti nə qədərdir?`,
              solution: `I = q/t = ${q}/${F(t)} = ${F(q / t)} A.` });
          }
          if (kind === "qovs") {
            const U = pick([30, 40, 50]), I = pick([60, 100, 150, 200]), tm = pick([1, 2, 5]);
            return R(U * I * tm * 60, "J", { text: `Elektrik qaynağının qövsündə gərginlik ${U} V, cərəyan ${I} A-dir. Qövs ${tm} dəq yanır. Qövsdə ayrılan enerji nə qədərdir? Cavabı J ilə yaz.`,
              solution: `P = U·I = ${U}·${I} = ${U * I} W. t = ${tm} dəq = ${tm * 60} s. E = P·t = ${U * I}·${tm * 60} = ${U * I * tm * 60} J.` });
          }
          const Id = pick([4, 6, 8, 10, 12, 20]), U0 = pick([40, 60, 80, 100]), Uq = pick([150, 200, 250, 300]);
          return R(Id, "mA", { text: `Vakuum diodunda gərginlik 0-dan ${U0} V-a qədər artanda cərəyan artır, ${U0} V-da ${Id} mA-ə çatır və sonra artmır (doyma cərəyanı). Katodun qızması dəyişmir. Anod gərginliyi ${Uq} V olanda cərəyan neçə mA-dir?`,
            solution: `${Uq} V > ${U0} V: katodun buraxdığı bütün elektronlar artıq anoda çatır, cərəyan doyma qiymətindədir: ${Id} mA.` });
        }
        const [q, ok, bad, why] = pick(BANK), opts = shuffle([ok, ...bad]);
        return { text: q, choices: opts, correct: opts.indexOf(ok), show: ok, solution: why };
      } },
    { id: "diod", ad: "Diodlu dövrələr", izah: "İdeal diod: cərəyan istiqaməti üçbucağın istiqamətindədirsə, müqavimət 0 (açıq); əksinədirsə, sonsuz (bağlı). Cərəyan batareyanın + qütbündən çıxır.",
      gen() {
        const kind = pick(["tek", "par", "par", "P", "gerg"]);
        let U, R1, R2 = 0;
        for (;;) {
          U = pick([6, 8, 9, 12, 15, 18, 24]); R1 = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]); R2 = kind === "par" ? pick([2, 3, 4, 5, 6, 8, 10, 12]) : 0;
          if (nice(U / R1, 2) && (!R2 || nice(U / R2, 2)) && (kind !== "P" || nice(U * U / R1, 2))) break;
        }
        const plusTop = Math.random() < .5, right = Math.random() < .5, fwd = right === plusTop;
        const svg = circuit({ plusTop, right, U, R1, R2 });
        const how = `Cərəyan + qütbdən çıxır və yuxarı naqildə ${plusTop ? "soldan sağa" : "sağdan sola"} gedir. Diodun üçbucağı ${right ? "sağa" : "sola"} baxır → ` +
          (fwd ? "diod düz qoşulub: açıqdır, müqaviməti 0." : "diod əks qoşulub: bağlıdır, bu qolda cərəyan yoxdur.");
        const base = "Diod idealdır (düz qoşulmada müqaviməti 0, əks qoşulmada sonsuz). ";
        if (kind === "tek") return R(fwd ? U / R1 : 0, "A", { svg, text: base + "Batareyadan çıxan cərəyan neçə amperdir?",
          solution: how + (fwd ? ` I = U/R₁ = ${U}/${R1} = ${F(U / R1)} A.` : " I = 0.") });
        if (kind === "par") { const Q = U / R2 + (fwd ? U / R1 : 0); return R(Q, "A", { svg, text: base + "Batareyadan çıxan ümumi cərəyan neçə amperdir?",
          solution: `R₂ qolu birbaşa mənbəyə qoşulub: U/R₂ = ${U}/${R2} = ${F(U / R2)} A. ` + how + (fwd ? ` R₁ qolunda ${U}/${R1} = ${F(U / R1)} A. Cəmi ${F(Q)} A.` : ` R₁ qolunda 0. Cəmi ${F(Q)} A.`) }); }
        if (kind === "P") return R(fwd ? U * U / R1 : 0, "W", { svg, text: base + "R₁ rezistorunda ayrılan güc neçə vattdır?",
          solution: how + (fwd ? ` P = U²/R₁ = ${U * U}/${R1} = ${F(U * U / R1)} W.` : " Cərəyan yoxdur, P = 0.") });
        const onD = Math.random() < .5;
        return R(onD ? (fwd ? 0 : U) : (fwd ? U : 0), "V", { svg, text: base + `${onD ? "Diodun uclarındakı" : "R₁ rezistorunun uclarındakı"} gərginlik neçə voltdur?`,
          solution: how + (fwd ? ` Diodda gərginlik düşmür (0), bütün ${U} V rezistorda olur.` : ` Cərəyan yoxdur, rezistorda gərginlik 0, bütün ${U} V diodun üzərindədir.`) });
      } },
    { id: "temp", ad: "Müqavimət və temperatur", izah: "Metal: R = R₀(1 + α·Δt), Δt = t − t₀ (temperatur dəyişməsi). Metalda R artır, yarımkeçiricidə və elektrolitdə azalır.",
      gen() {
        const kind = pick(["R", "R", "T", "alfa", "lamp", "lamp2"]);
        const ALF = [["mis", 0.004], ["alüminium", 0.004], ["volfram", 0.005], ["dəmir", 0.006]];
        if (kind === "lamp" || kind === "lamp2") {
          const dt = pick([1000, 1200, 1400, 1600, 1800, 2000, 2200]), r = 1 + 0.005 * dt;
          if (kind === "lamp") return R(r, "dəfə", { text: `Közərmə lampasının volfram tellinin α = 0,005 1/°C-dir. Telin soyuq (20 °C) müqaviməti R₀-dır, işlək temperaturda isə ${20 + dt} °C-dir. Lampanı qoşan anda cərəyan işçi cərəyandan neçə dəfə böyükdür? Gərginlik eynidir.`,
            solution: `Δt = ${20 + dt} − 20 = ${dt} °C. R = R₀(1 + αΔt) = R₀(1 + 0,005·${dt}) = ${F(r)}·R₀. I = U/R olduğundan cərəyan ${F(r)} dəfə fərqlənir: qoşulan anda böyükdür, ${F(r)} dəfə.` });
          let U, R0, I, dt2, r2; do { dt2 = pick([1000, 1400, 1800, 2000, 2200]); r2 = 1 + 0.005 * dt2; U = pick([60, 110, 120, 220]); R0 = pick([5, 10, 12, 20, 22, 24, 40]); I = U / (R0 * r2); } while (!nice(I, 2));
          return R(I, "A", { text: `Volfram telli lampanın soyuq (20 °C) müqaviməti ${R0} Ω-dur, α = 0,005 1/°C. Lampa ${U} V gərginlikdə işləyir, telin işlək temperaturu ${20 + dt2} °C-dir. İşçi cərəyan neçə amperdir?`,
            solution: `Δt = ${dt2} °C. R = ${R0}·(1 + 0,005·${dt2}) = ${R0}·${F(r2)} = ${F(R0 * r2)} Ω. I = U/R = ${U}/${F(R0 * r2)} = ${F(I)} A.` });
        }
        const [mn, al] = pick(ALF), t0 = pick([0, 20]);
        let R0, dt, Rn; do { R0 = pick([10, 20, 25, 40, 50, 100, 200]); dt = pick([10, 20, 25, 40, 50, 75, 100, 150, 200]); Rn = R0 * (1 + al * dt); } while (!nice(Rn, 2));
        if (kind === "R") return R(Rn, "Ω", { text: `${cap(mn)} məftilin ${t0} °C-də müqaviməti ${R0} Ω-dur. α = ${F(al)} 1/°C. ${t0 + dt} °C-də müqavimət nə qədər olar?`,
          solution: `Δt = ${t0 + dt} − ${t0} = ${dt} °C. R = R₀(1 + αΔt) = ${R0}·(1 + ${F(al)}·${dt}) = ${R0}·${F(1 + al * dt)} = ${F(Rn)} Ω.` });
        if (kind === "T") return R(t0 + dt, "°C", { text: `${cap(mn)} məftilin ${t0} °C-də müqaviməti ${R0} Ω-dur (α = ${F(al)} 1/°C). Məftil qızdırılanda müqaviməti ${F(Rn)} Ω oldu. Son temperatur neçə °C-dir?`,
          solution: `R/R₀ = ${F(Rn)}/${R0} = ${F(Rn / R0)} = 1 + αΔt → αΔt = ${F(Rn / R0 - 1)} → Δt = ${F(Rn / R0 - 1)}/${F(al)} = ${dt} °C. t = ${t0} + ${dt} = ${t0 + dt} °C.` });
        return R(al, "1/°C", { text: `Metal məftilin ${t0} °C-də müqaviməti ${R0} Ω, ${t0 + dt} °C-də ${F(Rn)} Ω-dur. Müqavimətin temperatur əmsalı α neçə 1/°C-dir?`,
          solution: `Δt = ${dt} °C. R = R₀(1 + αΔt) → α = (R − R₀)/(R₀·Δt) = (${F(Rn)} − ${R0})/(${R0}·${dt}) = ${F(Rn - R0)}/${R0 * dt} = ${F(al)} 1/°C.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let mt, I, tm, m;
          do { mt = MET[pick(["cu", "ni", "zn", "cr"])]; I = pick([2, 3, 4, 5]); tm = pick([5, 10, 20]); m = mt.k * I * tm * 60; } while (!nice(m, 2));
          const q = I * tm * 60;
          task = `Elektroliz hamamından ${I} A cərəyan ${tm} dəq keçirilib. Maddənin (${mt.ad}) k = ${F(mt.k)} mq/C-dir. Katodda neçə qram ${mt.ad} ayrılır?`;
          steps = [`Vaxtı saniyəyə çeviririk: ${tm} dəq = ${tm * 60} s. Yük q = I·t = ${I}·${tm * 60} = ${q} C.`, `m = k·q = ${F(mt.k)}·${q} = ${F(m)} mq.`, `1 q = 1000 mq olduğundan m = ${F(m)}/1000 = ${F(m / 1000)} q.`];
          if (bad === 0) steps[0] = `Yük q = I·t = ${I}·${tm} = ${I * tm} C.`, steps[1] = `m = k·q = ${F(mt.k)}·${I * tm} = ${F(+(mt.k * I * tm).toFixed(4))} mq.`, steps[2] = `1 q = 1000 mq olduğundan m = ${F(+(mt.k * I * tm / 1000).toFixed(6))} q.`;
          if (bad === 1) { steps[1] = `m = k/q = ${F(mt.k)}/${q} = ${F(+(mt.k / q).toFixed(6))} mq.`; steps[2] = `1 q = 1000 mq olduğundan m = ${F(+(mt.k / q / 1000).toFixed(9))} q.`; }
          if (bad === 2) steps[2] = `1 q = 1000 mq olduğundan m = ${F(m)}·1000 = ${F(m * 1000)} q.`;
          why = [`1-ci addım: ${tm} dəq = ${tm * 60} s, 1 dəq saniyə deyil. q = ${q} C, düz cavab ${F(m / 1000)} q.`,
            `2-ci addım: Faradey qanunu m = k·q (hasil), bölmə yox. Düz cavab: ${F(m / 1000)} q.`,
            `3-cü addım: mq-dan q-a keçəndə 1000-ə bölünür. Düz cavab: ${F(m / 1000)} q.`][bad];
        } else {
          let R0, al, dt, Rn;
          do { R0 = pick([20, 40, 50, 100, 200]); al = pick([0.004, 0.005]); dt = pick([50, 100, 150, 200]); Rn = R0 * (1 + al * dt); } while (!nice(Rn, 2) || al * dt >= 0.9);
          const inc = Rn - R0;
          task = `Metal məftilin 0 °C-də müqaviməti ${R0} Ω-dur, α = ${F(al)} 1/°C. ${dt} °C-yə qədər qızdırılanda müqavimət neçə Ω artır?`;
          steps = [`Metalın müqaviməti qızdıqca artır: R = R₀(1 + α·Δt), Δt = ${dt} °C.`, `R = ${R0}·(1 + ${F(al)}·${dt}) = ${R0}·${F(1 + al * dt)} = ${F(Rn)} Ω.`, `Artım ΔR = R − R₀ = ${F(Rn)} − ${R0} = ${F(inc)} Ω.`];
          if (bad === 0) { steps[0] = `Müqavimət dəyişir: R = R₀(1 − α·Δt), Δt = ${dt} °C.`; steps[1] = `R = ${R0}·(1 − ${F(al)}·${dt}) = ${R0}·${F(1 - al * dt)} = ${F(R0 * (1 - al * dt))} Ω.`; steps[2] = `Dəyişmə ΔR = ${F(R0)} − ${F(R0 * (1 - al * dt))} = ${F(R0 * al * dt)} Ω.`; }
          if (bad === 1) { steps[1] = `R = ${R0}·(1 + ${F(al)}·${dt}) = ${R0}·${F(1 + al * dt)} = ${F(Rn + R0 / 10)} Ω.`; steps[2] = `Artım ΔR = ${F(Rn + R0 / 10)} − ${R0} = ${F(inc + R0 / 10)} Ω.`; }
          if (bad === 2) steps[2] = `Artım ΔR = R/R₀ = ${F(Rn)}/${R0} = ${F(Rn / R0)} Ω.`;
          why = [`1-ci addım: metalda temperatur artanda müqavimət artır, düstur R₀(1 + αΔt). Düz cavab: ${F(inc)} Ω.`,
            `2-ci addım: ${F(al)}·${dt} = ${F(al * dt)}, ${R0}·${F(1 + al * dt)} = ${F(Rn)} Ω. Hesabda səhv var. Düz artım: ${F(inc)} Ω.`,
            `3-cü addım: artım fərqdir (R − R₀), nisbət yox. Düz cavab: ${F(inc)} Ω.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Xromlama, gümüşləmə, mis təmizləmə, alüminium zavodu, közərmə lampası, termometr — hamısı bu mövzudur.",
      gen() {
        const kind = pick(["xrom", "qasiq", "rafin", "alum", "lamp", "termo", "diodtext"]);
        if (kind === "xrom" || kind === "qasiq") {
          const c = plPick(kind === "xrom" ? "cr" : "ag"), mt = MET[c.key];
          const ctx = kind === "xrom" ? `Avtomobilin bamperini (səthi ${c.S} sm²) xromlayırlar.` : `Gümüş qaşığı (səthi ${c.S} sm²) gümüşləyirlər.`;
          return R(c.h, "mkm", { text: `${ctx} Hamamdan ${c.I} A cərəyan ${tt(c.t)} keçir (k = ${F(mt.k)} mq/C, ρ = ${mt.rho} kq/m³). ${cap(mt.ad)} qatının qalınlığı neçə mkm-dir?`, solution: ttSol(c.t) + platingSol(c) });
        }
        if (kind === "rafin") {
          let I, hr, m; do { I = pick([200, 300, 400, 500, 1000]); hr = pick([1, 2, 5, 10, 12, 24]); m = 0.33e-6 * I * 3600 * hr; } while (!nice(m, 3) || m < 0.3);
          return R(m, "kq", { text: `Elektrolitik mis təmizləmə hamamında cərəyan ${I} A-dir və ${hr} saat ərzində dəyişmir. Katodda neçə kiloqram mis çökür? Mis üçün k = 0,33 mq/C = 0,33·10⁻⁶ kq/C.`,
            solution: `t = ${hr} saat = ${hr * 3600} s. q = I·t = ${I}·${hr * 3600} = ${I * hr * 3600} C. m = k·q = 0,33·10⁻⁶·${I * hr * 3600} = ${F(m)} kq.` });
        }
        if (kind === "alum") {
          let I, hr, m; do { I = pick([10000, 20000, 50000, 100000]); hr = pick([1, 2, 5, 10]); m = 0.093e-6 * I * 3600 * hr; } while (!nice(m, 2));
          return R(m, "kq", { text: `Alüminium zavodunun elektroliz vannasından ${I} A cərəyan keçir. ${hr} saatda katodda neçə kq alüminium alınır? Alüminium üçün k = 0,093 mq/C = 0,093·10⁻⁶ kq/C.`,
            solution: `t = ${hr * 3600} s. q = I·t = ${I * hr * 3600} C. m = k·q = 0,093·10⁻⁶·${I * hr * 3600} = ${F(m)} kq.` });
        }
        if (kind === "lamp") {
          let U, R0, I, dt, r; do { dt = pick([1000, 1400, 1800, 2000, 2200]); r = 1 + 0.005 * dt; U = pick([60, 110, 120, 220]); R0 = pick([5, 10, 12, 20, 22, 24, 40]); I = U / (R0 * r); } while (!nice(I, 2) || !nice(U / R0, 2));
          return R(U / R0, "A", { text: `Közərmə lampasının volfram telinin soyuq müqaviməti ${R0} Ω, işlək temperaturda isə ${F(R0 * r)} Ω-dur (temperatur ${dt} °C artıb, α = 0,005 1/°C). Lampa ${U} V şəbəkəyə qoşulduğu ilk anda cərəyan neçə amperdir? Tel hələ soyuqdur.`,
            solution: `İlk anda tel soyuqdur: R = R₀ = ${R0} Ω. I = U/R₀ = ${U}/${R0} = ${F(U / R0)} A. (İşçi cərəyan ${F(I)} A, yəni ${F(r)} dəfə az: ona görə lampalar çox vaxt məhz qoşulan anda yanır.)` });
        }
        if (kind === "termo") {
          let R0, dt, Rn; const al = 0.004; do { R0 = pick([50, 100, 200]); dt = pick([25, 50, 75, 100, 125, 250]); Rn = R0 * (1 + al * dt); } while (!nice(Rn, 2));
          return R(dt, "°C", { text: `Müqavimət termometrinin platin məftili 0 °C-də ${R0} Ω-dur (α = 0,004 1/°C). Soba içində onun müqaviməti ${F(Rn)} Ω ölçülüb. Sobanın temperaturu neçə °C-dir?`,
            solution: `R = R₀(1 + αt) → αt = ${F(Rn)}/${R0} − 1 = ${F(Rn / R0 - 1)} → t = ${F(Rn / R0 - 1)}/0,004 = ${dt} °C.` });
        }
        let U, Rr; do { U = pick([6, 9, 12, 24]); Rr = pick([2, 3, 4, 6, 8, 12]); } while (!nice(U / Rr, 2));
        const fwd = Math.random() < .5;
        return R(fwd ? U / Rr : 0, "A", { text: `Velosiped faranın dövrəsində ${U} V-luq mənbəyə ideal diod və ${Rr} Ω-luq lampa ardıcıl qoşulub. Diod ${fwd ? "düz" : "əks"} istiqamətdə qoşulub. Lampadan keçən cərəyan neçə amperdir?`,
          solution: fwd ? `Diod düz qoşulub, müqaviməti 0. I = U/R = ${U}/${Rr} = ${F(U / Rr)} A.` : "Diod əks qoşulub: bağlıdır, dövrədə cərəyan yoxdur. I = 0." });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-muhitlerde-cereyan", title: "Müxtəlif mühitlərdə cərəyan", fenn: "fizika", link: "dersler/fiz-muhitlerde-cereyan.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (A, mq, mkm, Ω, W, °C ...). Onluq kəsr vergül və ya nöqtə ilə: 0,33. Seçimli suallarda variantı seç.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["faraday", "faraday", "qalin", "qaz", "diod", "diod", "temp", "temp", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-muhitlerde-cereyan.html")) b.push("dersler/fiz-muhitlerde-cereyan.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
