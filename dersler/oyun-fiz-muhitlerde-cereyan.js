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


  // ======== exam format (father, 15 Nov 2026): RFO / lisey A–E questions with figures; wrong options are typical mistakes ========
  const { ae, again } = Oyun;
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  const K = (() => {
    const INK = "var(--ink,#17171a)", ACC = "var(--accent,#a32d2d)", MUT = "var(--muted,#6b6b73)", PAP = "var(--paper,#fff)", SOFT = "var(--accent-soft,#f3dede)";
    const f = n => +(+n).toFixed(1);
    const line = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
    const wire = (pts, c = INK, w = 2) => `<polyline points="${pts.map(p => f(p[0]) + "," + f(p[1])).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
    const text = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${f(x)}" y="${f(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
    const dot = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="3.2" fill="${INK}"/>`;
    const res = (x, y, d, lab) => d === "h"
      ? `<rect x="${f(x - 18)}" y="${f(y - 7)}" width="36" height="14" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + (lab ? text(x, y - 12, lab) : "")
      : `<rect x="${f(x - 7)}" y="${f(y - 16)}" width="14" height="32" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + (lab ? text(x + 12, y + 5, lab, "start") : "");
    // thermistor: a resistor box crossed by a slanted line
    const therm = (x, y, lab) => res(x, y, "h", "") + line(x - 22, y + 14, x + 22, y - 14, INK, 2) + (lab ? text(x, y - 20, lab) : "");
    // battery on a vertical wire: long plate (+) on top
    const bat = (x, y, lab) => line(x - 13, y - 5, x + 13, y - 5, INK, 3) + line(x - 7, y + 5, x + 7, y + 5, INK, 3) + text(x - 17, y - 8, "+", "end", INK, 12) + (lab ? text(x + 20, y + 4, lab, "start") : "");
    const meter = (x, y, ch) => `<circle cx="${f(x)}" cy="${f(y)}" r="12" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + text(x, y + 5, ch, "middle", INK, 14);
    // ideal diode, the triangle points to the conducting direction: r, d, l, u
    const diode = (x, y, dir) => `<g transform="translate(${f(x)} ${f(y)}) rotate(${{ r: 0, d: 90, l: 180, u: 270 }[dir]})"><polygon points="-9,-9 -9,9 9,0" fill="${INK}"/><line x1="9" y1="-9" x2="9" y2="9" stroke="${INK}" stroke-width="3" stroke-linecap="round"/></g>`;
    // electrolysis bath on a horizontal wire at y: electrodes dip from the wire into the beaker; left = anode (+), right = cathode (−)
    const bath = (cx, y, o = {}) => `<rect x="${f(cx - 26)}" y="${f(y + 18)}" width="52" height="22" fill="${SOFT}"/>` + wire([[cx - 26, y + 8], [cx - 26, y + 40], [cx + 26, y + 40], [cx + 26, y + 8]], INK, 2)
      + line(cx - 15, y, cx - 15, y + 34, INK, 5) + line(cx + 15, y, cx + 15, y + 34, INK, 5)
      + (o.plate ? `<rect x="${f(cx + 11)}" y="${f(y + 9)}" width="8" height="28" fill="none" stroke="${ACC}" stroke-width="2.5"/>` : "")
      + text(cx - 15, y - 6, "+", "middle", INK, 13) + text(cx + 15, y - 6, "−", "middle", INK, 13);
    const svg = (w, h, inner, aria) => `<svg viewBox="0 0 ${f(w)} ${f(h)}" class="oy-svg" role="img" aria-label="${aria}">${inner}</svg>`;
    // graph frame: ox,oy origin; grid lines at the given tick values
    const frame = (ox, oy, w, h, xt, yt, xl, yl) => {
      let s = "";
      xt.forEach(([px, lab]) => { s += line(px, oy, px, oy - h, MUT, 0.6) + text(px, oy + 15, lab, "middle", MUT, 11); });
      yt.forEach(([py, lab]) => { s += line(ox, py, ox + w, py, MUT, 0.6) + text(ox - 6, py + 4, lab, "end", MUT, 11); });
      return s + line(ox, oy, ox + w + 8, oy, INK, 2) + line(ox, oy, ox, oy - h - 8, INK, 2) + text(ox + w + 8, oy + 30, xl, "end") + text(ox + 6, oy - h - 12, yl, "start");
    };
    return { INK, ACC, MUT, PAP, SOFT, f, line, wire, text, dot, res, therm, bat, meter, diode, bath, svg, frame };
  })();
  const { line: Ln, wire: Wr, text: Tx, dot: Dt } = K;
  const SUP = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", "-": "⁻" };
  const sup = n => String(n).split("").map(c => SUP[c]).join("");
  // value written as m·10^e (v16 = the value in units of 10¹⁶)
  const sci = v16 => { let m = v16, e = 16; while (m >= 10) { m /= 10; e++; } while (m < 1) { m *= 10; e--; } return { m, e, s: `${F(+m.toFixed(4))}·10${sup(e)}` }; };
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const RSm = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 50, 60];
  const UUm = [6, 9, 12, 18, 24, 36, 48, 60, 110, 120, 220];
  const kTxt = mt => `${mt.ad} üçün k = ${F(mt.k)} mq/C`;

  // ---- figures (all coordinates checked in node) ----
  // two electrolysis baths in parallel, ammeter in the main wire
  const figBaths = () => svgEl(K.svg(310, 200, Wr([[40, 95], [40, 30], [110, 30]]) + Wr([[40, 105], [40, 186], [270, 186]]) + Ln(110, 30, 110, 136) + Ln(270, 62, 270, 186)
    + [[62, "R₁"], [136, "R₂"]].map(([y, l]) => Wr([[110, y], [175, y]]) + Wr([[205, y], [270, y]]) + K.bath(190, y) + Tx(190, y - 18, l)).join("")
    + Dt(110, 62) + Dt(270, 136) + K.meter(75, 30, "A") + K.bat(40, 100, "U"), "Paralel qoşulmuş iki elektroliz hamamı R₁ və R₂; ampermetr əsas xəttdə"));
  // one bath with the part to be plated at the cathode
  const figPlate = () => svgEl(K.svg(300, 180, Wr([[40, 85], [40, 36], [170, 36]]) + Wr([[200, 36], [260, 36], [260, 150], [40, 150], [40, 95]]) + K.meter(100, 36, "A") + K.bath(185, 36, { plate: true }) + K.bat(40, 90, "U")
    + Tx(222, 76, "detal", "start", K.ACC, 12), "Elektroliz hamamı: katodda qat çəkilən detal; ampermetr"));
  // bath and rheostat in series
  const figBathR = () => svgEl(K.svg(330, 170, Wr([[40, 80], [40, 36], [205, 36]]) + Wr([[235, 36], [300, 36], [300, 140], [40, 140], [40, 90]]) + K.res(120, 36, "h", "R") + K.bath(220, 36) + Tx(220, 108, "R_h") + K.bat(40, 85, "U"), "Reostat R və elektroliz hamamı ardıcıl qoşulub"));
  // bath with a voltmeter across it
  const figBathV = () => svgEl(K.svg(300, 170, Wr([[40, 95], [40, 60], [135, 60]]) + Wr([[165, 60], [260, 60], [260, 140], [40, 140], [40, 105]]) + K.bath(150, 60) + Dt(110, 60) + Dt(190, 60)
    + Wr([[110, 60], [110, 22], [138, 22]]) + Wr([[162, 22], [190, 22], [190, 60]]) + K.meter(150, 22, "V") + K.bat(40, 100, "U"), "Elektroliz hamamı; voltmetr hamama paralel qoşulub"));
  // two parallel branches, each: diode + resistor (dirs: 'd' conducts downwards, from + to −)
  const figDiodes = (d1, d2) => svgEl(K.svg(300, 190, Wr([[40, 90], [40, 34], [230, 34]]) + Wr([[40, 100], [40, 156], [230, 156]]) + Ln(120, 34, 120, 156) + Ln(230, 34, 230, 156) + Dt(120, 34) + Dt(120, 156)
    + K.diode(120, 70, d1) + K.res(120, 118, "v", "R₁") + K.diode(230, 70, d2) + K.res(230, 118, "v", "R₂") + K.bat(40, 95, "U"), "İki paralel qol: hər birində diod və rezistor"));
  // R1 in the main wire, then R2 | (diode + R3); ammeter in the main wire
  const figSwap = d => svgEl(K.svg(330, 190, Wr([[40, 90], [40, 34], [250, 34]]) + Wr([[40, 100], [40, 156], [250, 156]]) + Ln(190, 34, 190, 156) + Ln(250, 34, 250, 156) + Dt(190, 34) + Dt(190, 156)
    + K.res(140, 34, "h", "R₁") + K.meter(80, 34, "A") + K.res(190, 95, "v", "R₂") + K.diode(250, 70, d) + K.res(250, 118, "v", "R₃") + K.bat(40, 95, "U"), "R₁ əsas xəttdə; R₂ və (diod + R₃) paralel; ampermetr əsas xəttdə"));
  // thermistor in series with R; voltmeter across R
  const figTherm = () => svgEl(K.svg(310, 160, Wr([[40, 100], [40, 64], [270, 64], [270, 140], [40, 140], [40, 110]]) + K.res(110, 64, "h", "R") + K.therm(200, 64, "R_t") + Dt(80, 64) + Dt(140, 64)
    + Wr([[80, 64], [80, 24], [98, 24]]) + Wr([[122, 24], [140, 24], [140, 64]]) + K.meter(110, 24, "V") + K.bat(40, 105, "U"), "R rezistoru və termistor ardıcıl; voltmetr R-ə paralel"));
  // vacuum diode I–U characteristic: rising part, then saturation at Is (mA)
  function figVak(Is, Us) {
    const ox = 48, oy = 176, X = u => ox + u * 0.9, Y = i => oy - i * 10.5;
    const xt = [50, 100, 150, 200, 250].map(u => [X(u), u]), yt = []; for (let i = 2; i <= 14; i += 2) yt.push([Y(i), i]);
    let pts = []; for (let k = 0; k <= 20; k++) { const u = Us * k / 20; pts.push([X(u), Y(Is * (1 - (1 - u / Us) ** 2))]); } pts.push([X(250), Y(Is)]);
    return svgEl(K.svg(300, 210, K.frame(ox, oy, 230, 148, xt, yt, "U, V", "I, mA") + Wr(pts, K.ACC, 2.5), "Vakuum diodunun volt-amper xarakteristikası: cərəyan artır, sonra doyur"));
  }
  // metal resistance versus temperature: straight line from R0 at 0 °C, marked point (t1, R1 = n·R0)
  function figRt(R0, n) {
    const ox = 50, oy = 172, X = t => ox + t * 0.22, Y = r => oy - r * 140 / (6 * R0), t1 = 200 * (n - 1), R1 = n * R0;
    const xt = [200, 400, 600, 800, 1000].map(t => [X(t), t]), yt = []; for (let k = 1; k <= 6; k++) yt.push([Y(k * R0), k * R0]);
    return svgEl(K.svg(300, 206, K.frame(ox, oy, 230, 140, xt, yt, "t, °C", "R, Ω") + Ln(X(0), Y(R0), X(1000), Y(6 * R0), K.ACC, 2.5) + `<circle cx="${K.f(X(0))}" cy="${K.f(Y(R0))}" r="3.5" fill="${K.ACC}"/><circle cx="${K.f(X(t1))}" cy="${K.f(Y(R1))}" r="3.5" fill="${K.ACC}"/>`,
      "Metal naqilin müqavimətinin temperaturdan asılılıq qrafiki: düz xətt"));
  }
  // current in time: rises linearly, constant, falls linearly (t in min)
  function figIt(I0, t1, t2, t3) {
    const ox = 44, oy = 172, X = t => ox + t * 20, Y = i => oy - i * 22, T = t1 + t2 + t3;
    const xt = []; for (let t = 1; t <= 12; t++) xt.push([X(t), t]); const yt = []; for (let i = 1; i <= 6; i++) yt.push([Y(i), i]);
    const p = [[0, 0], [t1, I0], [t1 + t2, I0], [T, 0]].map(([t, i]) => K.f(X(t)) + "," + K.f(Y(i))).join(" ");
    return svgEl(K.svg(300, 205, K.frame(ox, oy, 240, 132, xt, yt, "t, dəq", "I, A") + `<polygon points="${p}" fill="${K.SOFT}" stroke="${K.ACC}" stroke-width="2.5" stroke-linejoin="round"/>`, "Elektroliz zamanı cərəyan şiddətinin zamandan asılılıq qrafiki: artır, sabit qalır, azalır"));
  }

  // ---- plating cases whose answer and the wrong options are clean numbers ----
  const PL2 = [...PL.ag, ...PL.cr].filter(c => c.t % 60 === 0 && c.h <= 120 && [c.h / 60, c.h * 1000, c.h / 1000, c.h * 10].every(x => nice(x, 4) && x > 0));
  const METn = ["cu", "ag", "ni", "zn"];
  // question 8: (U, R1, R2, R3) with every option a clean number (a random draw almost never hits one)
  const SW8 = [];
  for (const U of UUm) for (const r1 of RSm) for (const r2 of RSm) for (const r3 of RSm) {
    const w = [U / (r1 + r2 * r3 / (r2 + r3)), U / (r1 + r2), U / (r1 + r2 + r3), U / (r1 + r3), U / r2, U / (r2 * r3 / (r2 + r3))];
    if (w.every(x => ok2(x)) && new Set(w.slice(0, 5).map(x => x.toFixed(4))).size === 5 && new Set([w[0], w[1], w[2], w[3], w[5]].map(x => x.toFixed(4))).size === 5) SW8.push([U, r1, r2, r3]);
  }

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. two baths in parallel (Ohm) + Faraday
    { tip: "qapali", birlesik: "fiz-om", gen: () => again(() => {
      const r1 = pick(RSm), r2 = pick(RSm), mt = MET[pick(METn)], I = pick([1, 2, 3, 4, 5, 6, 8, 9, 10, 12]), tm = pick([2, 3, 5, 10, 15, 20, 30]), t = tm * 60;
      if (r1 === r2) return null;
      const I1 = I * r2 / (r1 + r2), m = mt.k * I1 * t;
      const w = [mt.k * I * t, mt.k * I * r1 / (r1 + r2) * t, m / 60, mt.k * I / 2 * t]; if (![I1, m, ...w].every(x => ok2(x))) return null;
      return mc(ae(m, w, U_("mq")), { svg: figBaths(), text: `İki hamamın hər birində ${mt.ad} duzunun məhlulu var, hamamlar paralel qoşulub. Elektrolitlərin müqaviməti R₁ = ${r1} Ω və R₂ = ${r2} Ω, elektrodların müqaviməti sıfırdır. İdeal ampermetr ${I} A göstərir və cərəyan ${tm} dəq keçir. Birinci hamamın katodunda neçə mq ${mt.ad} ayrılır? (${kTxt(mt)}.)`,
        solution: `Paralel qollarda gərginlik eynidir: I₁R₁ = I₂R₂, I₁ + I₂ = ${I}. I₁ = I·R₂/(R₁+R₂) = ${I}·${r2}/${r1 + r2} = ${F(+I1.toFixed(4))} A. t = ${tm} dəq = ${t} s. m = k·I₁·t = ${F(mt.k)}·${F(+I1.toFixed(4))}·${t} = ${F(+m.toFixed(4))} mq. Tələlər: ümumi cərəyanla hesablamaq (${F(+w[0].toFixed(4))} mq), cərəyanı tərs bölmək (${F(+w[1].toFixed(4))} mq), dəqiqəni saniyəyə çevirməmək (${F(+w[2].toFixed(4))} mq), cərəyanı bərabər bölmək (${F(+w[3].toFixed(4))} mq).` });
    }) },
    // 2. plating thickness: m = kIt, m = ρSh, units
    { tip: "qapali", gen: () => again(() => {
      const c = pick(PL2), mt = MET[c.key], tm = c.t / 60, m = mt.k * c.I * c.t;
      const o = ae(c.h, [c.h / 60, c.h * 1000, c.h / 1000, c.h * 10], U_("mkm")); if (!o) return null;
      return mc(o, { svg: figPlate(), text: `Səthinin sahəsi ${c.S} sm² olan metal detal ${mt.ad} duzunun məhlulunda katoddur. Hamamdan ${c.I} A cərəyan ${tm} dəq keçir (${kTxt(mt)}, ρ = ${mt.rho} kq/m³). Detalın bütün səthində bərabər ${mt.ad} qatı çökür. Qatın qalınlığı neçə mkm olar?`,
        solution: `t = ${tm} dəq = ${c.t} s. q = I·t = ${c.I * c.t} C. m = k·q = ${F(mt.k)}·${c.I * c.t} = ${F(m)} mq = ${F(m / 1000)} q. ρ = ${mt.rho} kq/m³ = ${F(mt.rho / 1000)} q/sm³. m = ρ·S·h → h = ${F(m / 1000)}/(${F(mt.rho / 1000)}·${c.S}) = ${F(c.h / 1e4)} sm = ${F(c.h)} mkm (1 sm = 10⁴ mkm). Tələlər: dəqiqəni saniyəyə çevirməmək (${F(+(c.h / 60).toFixed(4))}), mq-ı q götürmək (${F(c.h * 1000)}), ρ-nu çevirməmək (${F(+(c.h / 1000).toFixed(4))}), sm → mkm çevirməsində səhv (${F(c.h * 10)}).` });
    }) },
    // 3. vacuum diode: read the saturation current, count electrons
    { tip: "qapali", gen: () => again(() => {
      const Is = pick([4, 6, 8, 10, 12]), Us = pick([50, 100]), U = pick([100, 150, 200].filter(u => u > Us)), t = pick([2, 3, 4, 5, 10]), v = Is * t * 0.625;
      const r = sci(v), ws = [sci(v * 1000), sci(v / 1000), sci(v / t), sci(v * U / Us)];
      if (![r, ...ws].every(x => nice(x.m, 2))) return null;
      return mc(ae(r.s, ws.map(x => x.s)), { svg: figVak(Is, Us), text: `Qrafikdə vakuum diodunun volt-amper xarakteristikası verilib (katodun temperaturu sabitdir). Anod gərginliyi ${U} V olanda katoddan ${t} s ərzində neçə elektron çıxır? Elektronun yükü e = 1,6·10⁻¹⁹ C. Katoddan çıxan bütün elektronlar anoda çatır.`,
        solution: `${Us} V-dan sonra cərəyan artmır: doyma. ${U} V > ${Us} V olduğundan I = I_s = ${Is} mA = ${F(Is * 1e-3)} A (qrafikdən). Yük q = I·t = ${F(Is * 1e-3)}·${t} = ${F(+(Is * 1e-3 * t).toFixed(5))} C. N = q/e = ${F(+(Is * 1e-3 * t).toFixed(5))}/(1,6·10⁻¹⁹) = ${r.s}. Tələlər: mA-i A-ə çevirməmək (${ws[0].s}), çevirməni iki dəfə etmək (${ws[1].s}), vaxtı vurmamaq (${ws[2].s}), cərəyanı gərginliyə mütənasib götürmək (${ws[3].s}).` });
    }) },
    // 4. two parallel diode branches: only the conducting one works; Joule heat (fiz-elektrik-guc)
    { tip: "qapali", birlesik: "fiz-elektrik-guc", gen: () => again(() => {
      const r1 = pick(RSm), r2 = pick(RSm), U = pick(UUm), t = pick([10, 20, 30, 60]), d1 = pick(["d", "u"]), d2 = d1 === "d" ? "u" : "d";
      const rf = d1 === "d" ? r1 : r2, ro = d1 === "d" ? r2 : r1; if (r1 === r2) return null;
      const Q = U * U * t / rf, w = [U * U * t / ro, Q + U * U * t / ro, (U / rf) ** 2 * ro * t, U * U * t / (r1 + r2)];
      if (![Q, ...w].every(x => ok2(x))) return null;
      return mc(ae(Q, w, U_("J")), { svg: figDiodes(d1, d2), text: `Sxemdə R₁ = ${r1} Ω, R₂ = ${r2} Ω, mənbənin gərginliyi U = ${U} V. Diodlar idealdır (düz istiqamətdə müqavimət 0, əks istiqamətdə sonsuz). Dövrədə ${t} s ərzində neçə J istilik ayrılır?`,
        solution: `Cərəyan + qütbdən çıxır, yuxarıdan aşağı gedir. Diodun üçbucağı ${d1 === "d" ? "birinci qolda aşağı, ikinci qolda yuxarı" : "birinci qolda yuxarı, ikinci qolda aşağı"} baxır: yalnız ${d1 === "d" ? "1-ci" : "2-ci"} qol açıqdır (R = ${rf} Ω), o biri qolda cərəyan yoxdur. Q = U²·t/R = ${U}²·${t}/${rf} = ${F(+Q.toFixed(4))} J. Tələlər: bağlı qolu götürmək (${F(+w[0].toFixed(4))} J), diodları nəzərə almayıb iki qolu toplamaq (${F(+w[1].toFixed(4))} J), cərəyanı bir qoldan, müqaviməti o biri qoldan götürmək (${F(+w[2].toFixed(4))} J), rezistorları ardıcıl saymaq (${F(+w[3].toFixed(4))} J).` });
    }) },
    // 5. lamp filament: R(t) graph is a straight line; current at a given temperature
    { tip: "qapali", gen: () => again(() => {
      const R0 = pick([10, 20, 25, 40, 50]), n = pick([2, 3, 4, 5]), t1 = 200 * (n - 1), R1 = n * R0, j = rnd(1, t1 / 100 - 1), t2 = 100 * j, R2 = R0 * (1 + 0.5 * j), U = pick(UUm);
      if (t2 === t1) return null;
      const I = U / R2, w = [U / R0, U / R1, U / (R1 * t2 / t1), U / (R2 - R0)]; if (![I, ...w].every(x => ok2(x))) return null;
      return mc(ae(I, w, U_("A")), { svg: figRt(R0, n), text: `Qrafikdə volfram spiralının müqavimətinin temperaturdan asılılığı verilib. Lampa ${U} V gərginliyə qoşulub və spiralın temperaturu ${t2} °C-dir. Lampadan neçə amper cərəyan keçir?`,
        solution: `Qrafik düz xəttdir. Qrafikdən R(0 °C) = ${R0} Ω, R(${t1} °C) = ${R1} Ω: hər 100 °C-də müqavimət ${F((R1 - R0) / t1 * 100)} Ω artır. ${t2} °C-də R = ${R0} + ${F((R1 - R0) / t1 * 100)}·${j} = ${F(R2)} Ω. I = U/R = ${U}/${F(R2)} = ${F(+I.toFixed(4))} A. Tələlər: soyuq müqavimətlə hesablamaq (${F(+w[0].toFixed(4))} A), qrafikdəki nöqtənin müqavimətini götürmək (${F(+w[1].toFixed(4))} A), R-i temperatura mütənasib saymaq (${F(+w[2].toFixed(4))} A), müqavimətin artımını götürmək (${F(+w[3].toFixed(4))} A).` });
    }) },
    // 6. thermistor in series with R, voltmeter across R: heated thermistor
    { tip: "qapali", birlesik: "fiz-om", gen: () => again(() => {
      const U = pick([6, 9, 12, 18, 24, 36]), R = pick([10, 20, 30, 40, 50, 60, 100]), Ra = pick([20, 30, 40, 60, 80, 100, 120, 150, 200, 300]), Rb = pick([5, 10, 15, 20, 30, 40, 50, 60]);
      if (Rb >= Ra) return null;
      const V1 = U * R / (R + Ra), V2 = U * R / (R + Rb), w = [V1, U - V2, V1 * Ra / Rb, U / 2];
      if (![V2, ...w].every(x => ok2(x))) return null;
      return mc(ae(V2, w, U_("V")), { svg: figTherm(), text: `Sxemdə U = ${U} V, R = ${R} Ω. Termistorun soyuq halda müqaviməti ${Ra} Ω-dur; qızdırılanda ${Rb} Ω oldu. Qızdırılandan sonra ideal voltmetr nəyi göstərir? (Mənbənin daxili müqaviməti sıfırdır.)`,
        solution: `R və termistor ardıcıldır: I = U/(R + R_t) = ${U}/(${R} + ${Rb}) = ${F(+(U / (R + Rb)).toFixed(4))} A. Voltmetr R-dədir: U_R = I·R = ${F(+V2.toFixed(4))} V. Tələlər: soyuq halın göstərişi (${F(+w[0].toFixed(4))} V), termistordakı gərginlik (${F(+w[1].toFixed(4))} V), "müqavimət n dəfə azalır, gərginlik n dəfə artır" (${F(+w[2].toFixed(4))} V), gərginliyi yarı bölmək (${F(+w[3].toFixed(4))} V).` });
    }) },
    // 7. bath and rheostat in series: Ohm for the whole loop, then Faraday
    { tip: "qapali", birlesik: "fiz-om", gen: () => again(() => {
      const mt = MET[pick(METn)], U = pick(UUm), Rh = pick(RSm), R = pick(RSm), tm = pick([2, 3, 5, 10, 15, 20, 30]), t = tm * 60;
      const I = U / (Rh + R), m = mt.k * I * t;
      const w = [mt.k * U / R * t, mt.k * U / Rh * t, m / 60, mt.k * U / (Rh * R / (Rh + R)) * t]; if (![I, m, ...w].every(x => ok2(x))) return null;
      return mc(ae(m, w, U_("mq")), { svg: figBathR(), text: `Mənbənin gərginliyi U = ${U} V, reostatın müqaviməti R = ${R} Ω, hamamdakı elektrolitin müqaviməti R_h = ${Rh} Ω (${mt.ad} duzunun məhlulu; mənbənin və naqillərin müqaviməti sıfırdır). Dövrə ${tm} dəq qapalı qalır. Katodda neçə mq ${mt.ad} ayrılır? (${kTxt(mt)}.)`,
        solution: `Hamam və reostat ardıcıldır: R_üm = ${Rh} + ${R} = ${Rh + R} Ω. I = U/R_üm = ${U}/${Rh + R} = ${F(+I.toFixed(4))} A. t = ${tm} dəq = ${t} s. m = k·I·t = ${F(mt.k)}·${F(+I.toFixed(4))}·${t} = ${F(+m.toFixed(4))} mq. Tələlər: hamamı unutmaq (${F(+w[0].toFixed(4))} mq), reostatı unutmaq (${F(+w[1].toFixed(4))} mq), dəqiqəni çevirməmək (${F(+w[2].toFixed(4))} mq), ardıcıl əvəzinə paralel hesablamaq (${F(+w[3].toFixed(4))} mq).` });
    }) },
    // 8. switching the battery polarity in a circuit with an ideal diode
    { tip: "qapali", gen: () => again(() => {
      const [U, r1, r2, r3] = pick(SW8), d = pick(["d", "u"]);
      const r23 = r2 * r3 / (r2 + r3), If = U / (r1 + r23), Ib = U / (r1 + r2), after = d === "d" ? Ib : If, same = d === "d" ? If : Ib;
      const w = [same, U / (r1 + r2 + r3), U / (r1 + r3), d === "d" ? U / r2 : U / (r2 * r3 / (r2 + r3))]; if (![after, ...w].every(x => ok2(x))) return null;
      return mc(ae(after, w, U_("A")), { svg: figSwap(d), text: `Sxemdə U = ${U} V, R₁ = ${r1} Ω, R₂ = ${r2} Ω, R₃ = ${r3} Ω; diod və ampermetr idealdır, mənbənin daxili müqaviməti sıfırdır. Mənbənin qütblərini dəyişdilər (+ və − yer dəyişdi). Ampermetrin yeni göstərişi nə qədərdir?`,
        solution: `Sxemdə diodun üçbucağı ${d === "d" ? "aşağı baxır: indi cərəyan yuxarıdan aşağı axır və diod açıqdır. Qütblər dəyişəndən sonra cərəyan aşağıdan yuxarı axmalıdır, diod isə yalnız aşağı keçirir: bağlanır" : "yuxarı baxır: indi cərəyan yuxarıdan aşağı axır və diod bağlıdır. Qütblər dəyişəndən sonra cərəyan aşağıdan yuxarı axır: diod açılır"}. ${d === "d" ? `Diod bağlı: R₃ qolu işləmir, R = R₁ + R₂ = ${r1 + r2} Ω, I = ${U}/${r1 + r2} = ${F(+Ib.toFixed(4))} A.` : `Diod açıq (müqaviməti 0): R₂ və R₃ paraleldir, R = R₁ + R₂R₃/(R₂+R₃) = ${r1} + ${F(+r23.toFixed(4))} = ${F(+(r1 + r23).toFixed(4))} Ω, I = ${U}/${F(+(r1 + r23).toFixed(4))} = ${F(+If.toFixed(4))} A.`} Tələlər: qütbləri dəyişməyi nəzərə almamaq (${F(+same.toFixed(4))} A), hamısını ardıcıl saymaq (${F(+w[1].toFixed(4))} A), ${d === "d" ? "R₂ qolunu atmaq" : "R₂ qolunu atmaq (yalnız R₃ qolu)"} (${F(+w[2].toFixed(4))} A), R₁-i unutmaq (${F(+w[3].toFixed(4))} A).` });
    }) },
    // 9. current–time graph: charge is the area (trapezoid), then Faraday
    { tip: "qapali", gen: () => again(() => {
      const mt = MET[pick(METn)], I0 = rnd(1, 5), t1 = rnd(1, 3), t2 = rnd(2, 5), t3 = rnd(1, 3), T = t1 + t2 + t3, qm = I0 * 60 * (t1 / 2 + t2 + t3 / 2), m = mt.k * qm;
      const w = [mt.k * I0 * T * 60, mt.k * I0 * t2 * 60, m / 60, mt.k * I0 * T * 60 / 2]; if (![m, ...w].every(x => ok2(x))) return null;
      return mc(ae(m, w, U_("mq")), { svg: figIt(I0, t1, t2, t3), text: `Elektroliz zamanı cərəyan şiddəti qrafikdəki kimi dəyişir (${mt.ad} duzunun məhlulu, ${kTxt(mt)}). Bütün ${T} dəq ərzində katodda neçə mq ${mt.ad} ayrılır?`,
        solution: `Yük qrafikin altındakı sahəyə bərabərdir (trapesiya): sabit hissə ${I0}·${t2} = ${I0 * t2} A·dəq, iki üçbucaq ${F(I0 * t1 / 2)} + ${F(I0 * t3 / 2)} = ${F(I0 * (t1 + t3) / 2)} A·dəq; cəmi ${F(qm / 60)} A·dəq = ${F(qm)} C (1 dəq = 60 s). m = k·q = ${F(mt.k)}·${F(qm)} = ${F(+m.toFixed(4))} mq. Tələlər: maksimal cərəyanı bütün müddətə vurmaq (${F(+w[0].toFixed(4))} mq), yalnız sabit hissəni götürmək (${F(+w[1].toFixed(4))} mq), dəqiqəni çevirməmək (${F(+w[2].toFixed(4))} mq), maksimumun yarısını bütün vaxta vurmaq (${F(+w[3].toFixed(4))} mq).` });
    }) },
    // 10. energy spent to deposit a given mass (A = U·q, q = m/k) (fiz-elektrik-guc)
    { tip: "qapali", birlesik: "fiz-elektrik-guc", gen: () => again(() => {
      const mt = MET[pick(METn)], q = pick([1000, 2000, 2500, 4000, 5000, 8000, 10000]), U = pick([2, 3, 4, 5, 6, 8, 10, 12]), m = mt.k * q / 1000, A = U * q / 1000;
      const w = [U * m, U * m * mt.k, A / 1000, A * 1000]; if (![m, A, ...w].every(x => ok2(x, 4))) return null;
      return mc(ae(A, w, U_("kJ")), { svg: figBathV(), text: `Elektroliz hamamına qoşulmuş ideal voltmetr elektroliz boyunca sabit ${U} V göstərir. Katodda ${F(+m.toFixed(4))} q ${mt.ad} ayrılıb (${kTxt(mt)}). Mənbənin hamamda gördüyü iş neçə kJ-dur?`,
        solution: `m = ${F(+m.toFixed(4))} q = ${F(+(m * 1000).toFixed(4))} mq. m = k·q → q = m/k = ${F(+(m * 1000).toFixed(4))}/${F(mt.k)} = ${q} C. İş A = U·q = ${U}·${q} = ${U * q} J = ${F(A)} kJ. Tələlər: k-nı unutmaq (${F(+w[0].toFixed(4))}), k-nı bölmək əvəzinə vurmaq (${F(+w[1].toFixed(4))}), qramı mq-a çevirməmək (${F(+w[2].toFixed(4))}), J-u kJ-a çevirməmək (${F(+w[3].toFixed(4))}).` });
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
      key: "fiz-muhitlerde-cereyan", title: "Müxtəlif mühitlərdə cərəyan", fenn: "fizika", link: "dersler/fiz-muhitlerde-cereyan.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (A, mq, mkm, Ω, W, °C ...). Onluq kəsr vergül və ya nöqtə ilə: 0,33. Seçimli suallarda variantı seç.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["faraday", "faraday", "qalin", "qaz", "diod", "diod", "temp", "temp", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-muhitlerde-cereyan.html")) b.push("dersler/fiz-muhitlerde-cereyan.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
