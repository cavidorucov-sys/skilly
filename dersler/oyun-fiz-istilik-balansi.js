// Fizika olimpiadası · İstilik balansı, faza keçidləri, istilik mühərrikləri — mastery game levels and the final test.
// Every generator returns a new problem with random numbers. Constants used (always stated in the text):
// c_su = 4200, c_buz = 2100 J/(kq·°C); λ_buz = 3,36·10⁵ J/kq; L_su = 2,3·10⁶ J/kq; fuel q in the table below.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  // run a random-search builder until it returns a problem (builder returns null on a rejected draw)
  const search = f => { for (let i = 0; i < 20000; i++) { const r = f(); if (r) return r; } throw new Error("no valid draw"); };

  const CW = 4200, CI = 2100, LAM = 336000, LV = 2300000;
  const FUELS = [{ n: "benzin", q: 46 }, { n: "dizel yanacağı", q: 42 }, { n: "təbii qaz", q: 44 }, { n: "daş kömür", q: 27 }, { n: "odun", q: 10 }, { n: "spirt", q: 27 }];   // q in MJ/kq
  const METALS = [{ n: "mis", c: 400 }, { n: "alüminium", c: 900 }, { n: "polad", c: 500 }, { n: "qurğuşun", c: 130 }];
  const LAMTXT = "buzun ərimə istiliyi λ = 3,36·10⁵ J/kq";
  const LTXT = "suyun buxarlanma istiliyi L = 2,3·10⁶ J/kq";

  const levels = [
    { id: "balans", ad: "İstilik balansı", izah: "İtki yoxdursa: isti cismin verdiyi istilik = soyuq cismin aldığı istilik. c₁m₁(t₁ − θ) = c₂m₂(θ − t₂).",
      gen() {
        const kind = pick(["eyni", "eyni", "kutle", "metal", "c"]);
        if (kind === "eyni") return search(() => {
          const m1 = pick([0.5, 1, 1.5, 2, 3, 4, 5]), m2 = pick([0.5, 1, 1.5, 2, 3, 4, 5, 6]), t1 = pick([40, 50, 60, 70, 80, 90, 100]), t2 = pick([0, 10, 15, 20, 25, 30]);
          if (t1 <= t2 + 10) return null;
          const th = (m1 * t1 + m2 * t2) / (m1 + m2); if (!nice(th, 1)) return null;
          return R(th, "°C", { text: `${F(m1)} kq ${t1} °C-li suyu ${F(m2)} kq ${t2} °C-li su ilə qarışdırdılar. İstilik itkisi yoxdur. Qarışığın son temperaturu neçə °C olar?`,
            solution: `Isti suyun verdiyi istilik = soyuq suyun aldığı: m₁(t₁ − θ) = m₂(θ − t₂) → ${F(m1)}(${t1} − θ) = ${F(m2)}(θ − ${t2}) → θ = (${F(m1)}·${t1} + ${F(m2)}·${t2})/${F(m1 + m2)} = ${F(th)} °C.` });
        });
        if (kind === "kutle") return search(() => {
          const m1 = pick([1, 2, 3, 4, 5, 6, 10]), t1 = pick([70, 80, 90, 100]), t2 = pick([10, 15, 20]), th = pick([30, 35, 40, 45, 50, 60]);
          if (th >= t1) return null;
          const m2 = m1 * (t1 - th) / (th - t2); if (!nice(m2, 2)) return null;
          return R(m2, "kq", { text: `${F(m1)} kq ${t1} °C-li qaynar suya ${t2} °C-li soyuq su əlavə edib ${th} °C temperatur almaq istəyirlər. İstilik itkisi yoxdur. Neçə kq soyuq su lazımdır?`,
            solution: `m₁(t₁ − θ) = m₂(θ − t₂) → ${F(m1)}·${t1 - th} = m₂·${th - t2} → m₂ = ${F(m1 * (t1 - th))}/${th - t2} = ${F(m2)} kq.` });
        });
        if (kind === "metal") return search(() => {
          const mt = pick(METALS), c1 = mt.c;
          const m1 = pick([0.2, 0.25, 0.4, 0.5, 1, 2]), m2 = pick([0.5, 1, 2]), t2 = pick([10, 15, 20]), th = pick([25, 30, 40, 50]);
          if (th <= t2) return null;
          const t1 = th + CW * m2 * (th - t2) / (c1 * m1); if (!nice(t1, 0) || t1 > 400 || t1 < 80) return null;
          return R(th, "°C", { text: `${F(m1)} kq ${mt.n} cisim (c = ${c1} J/(kq·°C)) ${t1} °C-ə qədər qızdırılıb, ${t2} °C-li ${F(m2)} kq suyun içinə salınıb (c_su = 4200 J/(kq·°C)). İstilik itkisi yoxdur. Son temperatur neçə °C olar?`,
            solution: `Cismin verdiyi istilik = suyun aldığı: ${c1}·${F(m1)}·(${t1} − θ) = 4200·${F(m2)}·(θ − ${t2}). Buradan θ = (${c1}·${F(m1)}·${t1} + 4200·${F(m2)}·${t2})/(${F(c1 * m1)} + ${F(CW * m2)}) = ${F(th)} °C.` });
        });
        return search(() => {
          const mt = pick(METALS), c1 = mt.c;
          const m1 = pick([0.2, 0.25, 0.4, 0.5, 1, 2]), m2 = pick([0.5, 1, 2]), t2 = pick([10, 15, 20]), th = pick([25, 30, 40, 50]);
          if (th <= t2) return null;
          const t1 = th + CW * m2 * (th - t2) / (c1 * m1); if (!nice(t1, 0) || t1 > 400 || t1 < 80) return null;
          return R(c1, "J/(kq·°C)", { text: `${F(m1)} kq kütləli metal cismi ${t1} °C-ə qədər qızdırıb ${t2} °C-li ${F(m2)} kq suyun içinə saldılar. Son temperatur ${th} °C oldu. İstilik itkisi yoxdur (c_su = 4200 J/(kq·°C)). Metalın xüsusi istilik tutumu nə qədərdir?`,
            solution: `Metal verdi: c·${F(m1)}·(${t1} − ${th}). Su aldı: 4200·${F(m2)}·(${th} − ${t2}) = ${F(CW * m2 * (th - t2))} J. c = ${F(CW * m2 * (th - t2))}/(${F(m1)}·${t1 - th}) = ${c1} J/(kq·°C).` });
        });
      } },
    { id: "faza", ad: "Ərimə və buxarlanma", izah: "Ərimə: Q = λm; buxarlanma: Q = Lm. Faza keçidi zamanı temperatur dəyişmir. Qızma mərhələlərini ayrı-ayrı hesabla və topla.",
      gen() {
        const kind = pick(["erime", "buxar", "buz-su", "buz-100", "don", "kond"]);
        if (kind === "erime") { const m = pick([0.1, 0.25, 0.5, 1, 2, 3, 5]);
          return R(LAM * m / 1000, "kJ", { text: `0 °C-li ${F(m)} kq buz tamamilə əridilir (${LAMTXT}). Nə qədər istilik lazımdır? Cavabı kJ-la yaz.`,
            solution: `Ərimə zamanı temperatur dəyişmir: Q = λm = 336 000·${F(m)} = ${F(LAM * m)} J = ${F(LAM * m / 1000)} kJ.` }); }
        if (kind === "buxar") { const m = pick([0.1, 0.2, 0.5, 1, 2, 3]);
          return R(LV * m / 1000, "kJ", { text: `100 °C-li ${F(m)} kq suyu eyni temperaturda tamamilə buxara çevirmək üçün nə qədər istilik lazımdır? (${LTXT}.) Cavabı kJ-la yaz.`,
            solution: `Q = Lm = 2,3·10⁶·${F(m)} = ${F(LV * m)} J = ${F(LV * m / 1000)} kJ.` }); }
        if (kind === "buz-su") { const m = pick([0.2, 0.5, 1, 2, 4]), t = pick([5, 10, 20, 30, 40]), th = pick([10, 20, 30, 50]);
          const Q = CI * m * t + LAM * m + CW * m * th;
          return R(Q / 1000, "kJ", { text: `−${t} °C-li ${F(m)} kq buzu ${th} °C-li suya çevirmək üçün nə qədər istilik lazımdır? (c_buz = 2100, c_su = 4200 J/(kq·°C); ${LAMTXT}.) Cavabı kJ-la yaz.`,
            solution: `1) Buzu 0 °C-ə qədər: ${CI}·${F(m)}·${t} = ${F(CI * m * t)} J. 2) Əritmə: ${LAM}·${F(m)} = ${F(LAM * m)} J. 3) Suyu ${th} °C-ə qədər: ${CW}·${F(m)}·${th} = ${F(CW * m * th)} J. Cəmi ${F(Q)} J = ${F(Q / 1000)} kJ.` }); }
        if (kind === "buz-100") { const m = pick([0.1, 0.2, 0.5, 1]), t = pick([10, 20, 40]);
          const Q = CI * m * t + LAM * m + CW * m * 100;
          return R(Q / 1000, "kJ", { text: `−${t} °C-li ${F(m)} kq buzu qaynama temperaturuna (100 °C) qədər qızdırmaq üçün nə qədər istilik lazımdır? (c_buz = 2100, c_su = 4200 J/(kq·°C); ${LAMTXT}.) Cavabı kJ-la yaz. (Buxarlanma daxil deyil.)`,
            solution: `Buzu 0 °C-ə: ${F(CI * m * t)} J; əritmə: ${F(LAM * m)} J; suyu 0-dan 100 °C-yə: ${F(CW * m * 100)} J. Cəmi ${F(Q)} J = ${F(Q / 1000)} kJ.` }); }
        if (kind === "don") { const m = pick([0.25, 0.5, 1, 2]), t = pick([10, 20, 30, 40]);
          const Q = CW * m * t + LAM * m;
          return R(Q / 1000, "kJ", { text: `Dondurucuda ${t} °C-li ${F(m)} kq su 0 °C-li buza çevrilir. Su ətrafa nə qədər istilik verir? (c_su = 4200 J/(kq·°C); ${LAMTXT}.) Cavabı kJ-la yaz.`,
            solution: `Suyu 0 °C-ə qədər soyutmaq: ${CW}·${F(m)}·${t} = ${F(CW * m * t)} J. Donma (kristallaşma): λm = ${F(LAM * m)} J. Cəmi ${F(Q)} J = ${F(Q / 1000)} kJ.` }); }
        const m = pick([0.1, 0.2, 0.5, 1]), t = pick([20, 40, 60, 80]);
        const Q = LV * m + CW * m * (100 - t);
        return R(Q / 1000, "kJ", { text: `100 °C-li ${F(m)} kq su buxarı kondensasiya olub ${t} °C-li suya çevrilir. Buxar nə qədər istilik verir? (${LTXT}; c_su = 4200 J/(kq·°C).) Cavabı kJ-la yaz.`,
          solution: `Kondensasiya: Lm = ${F(LV * m)} J. Alınan suyu ${t} °C-ə qədər soyutmaq: ${CW}·${F(m)}·${100 - t} = ${F(CW * m * (100 - t))} J. Cəmi ${F(Q)} J = ${F(Q / 1000)} kJ.` });
      } },
    { id: "buzsu", ad: "Buz suya düşəndə", izah: "Əvvəl yoxla: sudan çıxan istilik buzu əritməyə çatır, ya yox? Çatırsa son temperatur 0 °C-dən yuxarıdır; çatmırsa 0 °C qalır və yalnız bir hissəsi əriyir. λ/c_su = 80 °C.",
      gen() {
        const kind = pick(["tam", "tam", "qismen", "mənfi", "metal"]);
        if (kind === "tam") return search(() => {
          const mw = pick([0.5, 1, 1.5, 2, 3, 4, 5]), mi = pick([0.1, 0.2, 0.25, 0.5, 1]), tw = pick([20, 30, 40, 50, 60, 70, 80, 90]);
          const th = (mw * tw - 80 * mi) / (mw + mi); if (th <= 0 || !nice(th, 1)) return null;
          return R(th, "°C", { text: `${tw} °C-li ${F(mw)} kq suya 0 °C-li ${F(mi)} kq buz atdılar. İstilik itkisi yoxdur (c_su = 4200 J/(kq·°C); ${LAMTXT}). Buz tamamilə əridikdən sonra son temperatur neçə °C olar?`,
            solution: `Buzun əriməsi: λm = ${F(LAM * mi)} J; əridikdən sonra o da θ-yə qədər qızır. Balans: 4200·${F(mw)}·(${tw} − θ) = ${LAM}·${F(mi)} + 4200·${F(mi)}·θ. Hər tərəfi 4200-ə bölək (λ/c = 80): ${F(mw)}(${tw} − θ) = ${F(80 * mi)} + ${F(mi)}θ → θ = (${F(mw * tw)} − ${F(80 * mi)})/${F(mw + mi)} = ${F(th)} °C.` });
        });
        if (kind === "qismen") return search(() => {
          const mw = pick([0.5, 1, 1.5, 2, 3, 4]), mi = pick([1, 2, 3, 4]), tw = pick([20, 30, 40, 50, 60, 80]);
          const mm = mw * tw / 80; if (mm >= mi || !nice(mm, 3)) return null;
          return R(mm, "kq", { text: `${tw} °C-li ${F(mw)} kq suya 0 °C-li ${F(mi)} kq buz atdılar. İstilik itkisi yoxdur (c_su = 4200 J/(kq·°C); ${LAMTXT}). Sistem istilik tarazlığına çatdıqda neçə kq buz əriyəcək?`,
            solution: `Su 0 °C-ə qədər soyuyanda verə biləcəyi istilik: 4200·${F(mw)}·${tw} = ${F(CW * mw * tw)} J. Bütün buzu əritmək üçün ${F(LAM * mi)} J lazımdır — çatmır, deməli son temperatur 0 °C-dir. Əriyən buz: m = Q/λ = ${F(CW * mw * tw)}/${LAM} = ${F(mm)} kq.` });
        });
        if (kind === "mənfi") return search(() => {
          const mw = pick([1, 2, 3, 4, 5]), mi = pick([0.25, 0.5, 1]), ti = pick([10, 20, 40]), tw = pick([40, 50, 60, 70, 80, 90]);
          const th = (mw * tw - 0.5 * mi * ti - 80 * mi) / (mw + mi); if (th <= 0 || !nice(th, 1)) return null;
          return R(th, "°C", { text: `${tw} °C-li ${F(mw)} kq suya −${ti} °C-li ${F(mi)} kq buz atdılar. İstilik itkisi yoxdur (c_su = 4200, c_buz = 2100 J/(kq·°C); ${LAMTXT}). Buz tamamilə əridikdən sonra son temperatur neçə °C olar?`,
            solution: `Buz alır: ${CI}·${F(mi)}·${ti} (0 °C-ə qədər) + ${F(LAM * mi)} (əriməyə) + 4200·${F(mi)}·θ. Su verir: 4200·${F(mw)}·(${tw} − θ). 4200-ə bölsək: ${F(mw)}(${tw} − θ) = ${F(0.5 * mi * ti)} + ${F(80 * mi)} + ${F(mi)}θ → θ = (${F(mw * tw)} − ${F(0.5 * mi * ti + 80 * mi)})/${F(mw + mi)} = ${F(th)} °C.` });
        });
        return search(() => {
          const mt = pick(METALS), c1 = mt.c, m1 = pick([0.5, 1, 2, 3, 4, 5]), mm = pick([0.05, 0.1, 0.125, 0.2, 0.25, 0.5, 1]);
          const t1 = LAM * mm / (c1 * m1); if (!nice(t1, 0) || t1 < 60 || t1 > 400) return null;
          return R(mm, "kq", { text: `${t1} °C-ə qədər qızdırılmış ${F(m1)} kq ${mt.n} cismi (c = ${c1} J/(kq·°C)) çoxlu 0 °C-li buzun üzərinə qoyurlar. Cisim 0 °C-ə qədər soyuyur. İstilik itkisi yoxdur (${LAMTXT}). Neçə kq buz əriyər?`,
            solution: `Cismin verdiyi istilik: ${c1}·${F(m1)}·${t1} = ${F(c1 * m1 * t1)} J. Bu istilik buzu əridir: m = Q/λ = ${F(c1 * m1 * t1)}/${LAM} = ${F(mm)} kq.` });
        });
      } },
    { id: "yanacaq", ad: "Yanacağın yanması", izah: "Yanacağın yanma istiliyi q (J/kq): Q = qm. Suyu qızdırmaq üçün sərf olunan yanacaq: ηqm = cmΔt (η — faydalı hissə).",
      gen() {
        const kind = pick(["Q", "m", "su", "su", "kutle2"]);
        const f = pick(FUELS);
        if (kind === "Q") { const m = pick([0.5, 1, 2, 3, 4, 5, 10, 20]);
          return R(f.q * m, "MJ", { text: `${F(m)} kq ${f.n} tam yananda nə qədər istilik ayrılır? ${f.n[0].toUpperCase() + f.n.slice(1)} üçün yanma istiliyi q = ${f.q}·10⁶ J/kq. Cavabı MJ-la yaz.`,
            solution: `Q = qm = ${f.q}·10⁶·${F(m)} = ${F(f.q * m)}·10⁶ J = ${F(f.q * m)} MJ.` }); }
        if (kind === "m") { const m = pick([0.5, 1, 2, 4, 5, 10]), Q = f.q * m;
          return R(m, "kq", { text: `${f.n[0].toUpperCase() + f.n.slice(1)} üçün q = ${f.q}·10⁶ J/kq. ${F(Q)} MJ istilik almaq üçün neçə kq yanacaq yandırmaq lazımdır?`,
            solution: `m = Q/q = ${F(Q)}·10⁶/(${f.q}·10⁶) = ${F(m)} kq.` }); }
        const draw = () => { const mf = pick([0.14, 0.21, 0.28, 0.35, 0.42, 0.7, 1.05, 1.4, 2.1, 2.8, 4.2, 7]), eta = pick([0.25, 0.4, 0.5, 0.6, 0.8, 1]), dt = pick([20, 25, 30, 40, 50, 60, 70, 80]), mw = eta * f.q * 1e6 * mf / (CW * dt); return nice(mw, 1) && mw >= 1 && mw <= 300 ? { mf, eta, dt, mw } : null; };
        if (kind === "su") { const { mf, eta, dt, mw } = search(draw);
          return R(mf, "kq", { text: `${F(mw)} kq suyu ${dt} °C qızdırmaq üçün ${f.n} yandırırlar (q = ${f.q}·10⁶ J/kq, c_su = 4200 J/(kq·°C)). ${eta === 1 ? "İstilik itkisi yoxdur." : "Yanacağın istiliyinin yalnız " + Math.round(eta * 100) + "%-i suya verilir."} Neçə kq yanacaq lazımdır?`,
            solution: `Suyun aldığı istilik: Q = cmΔt = 4200·${F(mw)}·${dt} = ${F(CW * mw * dt)} J. ηqm = Q → m = Q/(ηq) = ${F(CW * mw * dt)}/(${F(eta)}·${f.q}·10⁶) = ${F(mf)} kq.` }); }
        const { mf, eta, dt, mw } = search(draw);
        return R(dt, "°C", { text: `${F(mf)} kq ${f.n} yandırılır (q = ${f.q}·10⁶ J/kq). İstiliyin ${Math.round(eta * 100)}%-i ${F(mw)} kq suya verilir (c_su = 4200 J/(kq·°C)). Suyun temperaturu neçə °C artar?`,
          solution: `Yanacaqdan ayrılan istilik: qm = ${f.q}·10⁶·${F(mf)} = ${F(f.q * 1e6 * mf)} J; suya gedən: ${F(eta * f.q * 1e6 * mf)} J = cmΔt → Δt = ${F(eta * f.q * 1e6 * mf)}/(4200·${F(mw)}) = ${F(dt)} °C.` });
      } },
    { id: "muherrik", ad: "İstilik mühərrikləri", izah: "η = A/Q₁ = (Q₁ − Q₂)/Q₁. İstilik mühərrikinin FİƏ-si həmişə 100%-dən kiçikdir. İdeal (Karno) mühərrik: η = 1 − T₂/T₁ (kelvinlə).",
      gen() {
        const kind = pick(["A", "Q2", "iw", "yanacaq", "avto", "karno"]);
        if (kind === "A") return search(() => {
          const Q1 = pick([100, 200, 250, 400, 500, 800, 1000]), eta = pick([0.2, 0.25, 0.3, 0.35, 0.4, 0.45]);
          const A = eta * Q1; if (!nice(A, 1)) return null;
          return R(eta * 100, "%", { text: `İstilik mühərriki qızdırıcıdan ${Q1} kJ istilik alır və ${F(A)} kJ faydalı iş görür. FİƏ-si neçə faizdir?`,
            solution: `η = A/Q₁ = ${F(A)}/${Q1} = ${F(eta)} = ${F(eta * 100)}%.` });
        });
        if (kind === "Q2") return search(() => {
          const Q1 = pick([100, 200, 250, 400, 500, 800, 1000]), eta = pick([0.2, 0.25, 0.3, 0.4, 0.5]);
          const Q2 = Q1 * (1 - eta); if (!nice(Q2, 1)) return null;
          return R(Q2, "kJ", { text: `İstilik mühərriki qızdırıcıdan ${Q1} kJ istilik alır, FİƏ-si ${F(eta * 100)}%-dir. Soyuducuya neçə kJ istilik verir?`,
            solution: `A = ηQ₁ = ${F(eta)}·${Q1} = ${F(eta * Q1)} kJ. Q₂ = Q₁ − A = ${Q1} − ${F(eta * Q1)} = ${F(Q2)} kJ.` });
        });
        if (kind === "iw") return search(() => {
          const Q1 = pick([200, 300, 400, 500, 800, 1000]), Q2 = pick([100, 150, 200, 240, 300, 350, 600, 700]);
          if (Q2 >= Q1) return null; const eta = (Q1 - Q2) / Q1; if (!nice(eta * 100, 2)) return null;
          return R(eta * 100, "%", { text: `Mühərrik qızdırıcıdan ${Q1} kJ istilik alır və soyuducuya ${Q2} kJ verir. FİƏ-si neçə faizdir?`,
            solution: `A = Q₁ − Q₂ = ${Q1} − ${Q2} = ${Q1 - Q2} kJ. η = A/Q₁ = ${Q1 - Q2}/${Q1} = ${F(eta * 100)}%.` });
        });
        if (kind === "yanacaq") return search(() => {
          const f = pick(FUELS.slice(0, 3)), P = pick([20, 40, 46, 50, 60, 80, 92]), t = pick([1, 2, 3, 5]), eta = pick([0.25, 0.3, 0.4]);
          const mf = P * 1000 * t * 3600 / (eta * f.q * 1e6); if (!nice(mf, 2) || mf < 1 || mf > 100) return null;
          return R(mf, "kq", { text: `Mühərrikin faydalı gücü ${P} kW-dır, FİƏ-si ${Math.round(eta * 100)}%-dir. ${t} saat işləyəndə neçə kq ${f.n} sərf edir? (q = ${f.q}·10⁶ J/kq.)`,
            solution: `Faydalı iş: A = Pt = ${P}·1000·${t}·3600 = ${F(P * 1000 * t * 3600)} J. Yanacaqdan ayrılan istilik Q₁ = A/η = ${F(P * 1000 * t * 3600 / eta)} J. m = Q₁/q = ${F(mf)} kq.` });
        });
        if (kind === "avto") return search(() => {
          const F0 = pick([400, 500, 600, 690, 800, 920, 1000]), s = pick([20, 25, 40, 50, 100]), eta = pick([0.2, 0.25, 0.3]), f = pick(FUELS.slice(0, 3));
          const mf = F0 * s * 1000 / (eta * f.q * 1e6); if (!nice(mf, 2) || mf < 0.5 || mf > 100) return null;
          return R(mf, "kq", { text: `Avtomobilin dartı qüvvəsi ${F0} N-dur. Mühərrikin FİƏ-si ${Math.round(eta * 100)}%-dir. ${s} km yolda neçə kq ${f.n} sərf olunar? (q = ${f.q}·10⁶ J/kq.)`,
            solution: `Faydalı iş: A = F·s = ${F0}·${s * 1000} = ${F(F0 * s * 1000)} J. Q₁ = A/η = ${F(F0 * s * 1000 / eta)} J. m = Q₁/q = ${F(mf)} kq.` });
        });
        return search(() => {
          const t1 = pick([127, 227, 327, 427, 527, 727]), t2 = pick([27, 47, 77, 127]), T1 = t1 + 273, T2 = t2 + 273;
          if (T2 >= T1) return null; const eta = 1 - T2 / T1; if (!nice(eta * 100, 1)) return null;
          return R(eta * 100, "%", { text: `İdeal istilik mühərrikinin qızdırıcısının temperaturu ${t1} °C, soyuducunun temperaturu ${t2} °C-dir. Mümkün olan ən böyük FİƏ neçə faizdir? (η = 1 − T₂/T₁, T kelvinlə, T = t + 273.)`,
            solution: `T₁ = ${t1} + 273 = ${T1} K, T₂ = ${t2} + 273 = ${T2} K. η = 1 − ${T2}/${T1} = ${F(eta)} = ${F(eta * 100)}%.` });
        });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          const m = pick([0.2, 0.5, 1, 2]), t = pick([10, 20, 40]), th = pick([10, 20, 30]);
          const Q1 = CI * m * t, Q2 = LAM * m, Q3 = CW * m * th, Q = Q1 + Q2 + Q3;
          task = `−${t} °C-li ${F(m)} kq buzu ${th} °C-li suya çevirmək üçün nə qədər istilik lazımdır? (c_buz = 2100, c_su = 4200 J/(kq·°C); λ = 3,36·10⁵ J/kq.) Cavab joulla.`;
          steps = [`Buzu 0 °C-ə qədər qızdırmaq: Q₁ = 2100·${F(m)}·${t} = ${F(Q1)} J. Əritmək: Q₂ = λm = 336 000·${F(m)} = ${F(Q2)} J.`,
            `Alınan suyu 0 °C-dən ${th} °C-yə qədər qızdırmaq: Q₃ = 4200·${F(m)}·${th} = ${F(Q3)} J.`,
            `Cəmi: Q = Q₁ + Q₂ + Q₃ = ${F(Q1)} + ${F(Q2)} + ${F(Q3)} = ${F(Q)} J.`];
          if (bad === 0) { const Q1w = CW * m * t, Qw = Q1w + Q2 + Q3; steps[0] = `Buzu 0 °C-ə qədər qızdırmaq: Q₁ = 4200·${F(m)}·${t} = ${F(Q1w)} J. Əritmək: Q₂ = λm = 336 000·${F(m)} = ${F(Q2)} J.`; steps[2] = `Cəmi: Q = Q₁ + Q₂ + Q₃ = ${F(Q1w)} + ${F(Q2)} + ${F(Q3)} = ${F(Qw)} J.`; }
          if (bad === 1) { const Q3w = CW * m * (th + t), Qw = Q1 + Q2 + Q3w; steps[1] = `Alınan suyu −${t} °C-dən ${th} °C-yə qədər qızdırmaq: Q₃ = 4200·${F(m)}·${th + t} = ${F(Q3w)} J.`; steps[2] = `Cəmi: Q = Q₁ + Q₂ + Q₃ = ${F(Q1)} + ${F(Q2)} + ${F(Q3w)} = ${F(Qw)} J.`; }
          if (bad === 2) steps[2] = `Cəmi: Q = Q₁ + Q₃ = ${F(Q1)} + ${F(Q3)} = ${F(Q1 + Q3)} J (ərimə zamanı temperatur dəyişmədiyi üçün Q₂-ni saymırıq).`;
          why = [`1-ci addım: buz üçün c = 2100 götürülür (4200 suyundur). Düz cavab ${F(Q)} J.`,
            `2-ci addım: ərimədən sonra su 0 °C-dir, o ${th} °C-yə qədər qızır: Δt = ${th}. Düz cavab ${F(Q)} J.`,
            `3-cü addım: ərimə zamanı temperatur dəyişməsə də istilik sərf olunur (Q₂ = λm). Düz cavab ${F(Q)} J.`][bad];
        } else {
          const f = FUELS[0], m = pick([2, 4, 5, 8, 10]), eta = pick([0.2, 0.25, 0.3, 0.4]);
          const Q1 = f.q * 1e6 * m, A = eta * Q1;
          task = `Mühərrik ${F(m)} kq benzin (q = 46·10⁶ J/kq) yandırır və ${F(A / 1e6)} MJ faydalı iş görür. FİƏ-ni faizlə tapın.`;
          steps = [`Yanacaqdan ayrılan istilik: Q₁ = qm = 46·10⁶·${F(m)} = ${F(Q1 / 1e6)}·10⁶ J.`, `FİƏ: η = A/Q₁ = ${F(A / 1e6)}/${F(Q1 / 1e6)} = ${F(eta)}.`, `Faizlə: η = ${F(eta)}·100% = ${F(eta * 100)}%.`];
          if (bad === 0) { const Qw = 46 * 1e6 / m; steps[0] = `Yanacaqdan ayrılan istilik: Q₁ = q/m = 46·10⁶/${F(m)} = ${F(+(Qw / 1e6).toFixed(4))}·10⁶ J.`; steps[1] = `FİƏ: η = A/Q₁ = ${F(A / 1e6)}/${F(+(Qw / 1e6).toFixed(4))} ≈ ${F(+(A / Qw).toFixed(3))}.`; steps[2] = `Faizlə: η = ${F(+(A / Qw).toFixed(3))}·100% ≈ ${F(+(A / Qw * 100).toFixed(1))}%.`; }
          if (bad === 1) { const w = Q1 / A; steps[1] = `FİƏ: η = Q₁/A = ${F(Q1 / 1e6)}/${F(A / 1e6)} = ${F(+w.toFixed(4))}.`; steps[2] = `Faizlə: η = ${F(+w.toFixed(4))}·100% = ${F(+(w * 100).toFixed(2))}%.`; }
          if (bad === 2) steps[2] = `Faizlə: η = ${F(eta)}·10% = ${F(eta * 10)}%.`;
          why = [`1-ci addım: yanma istiliyi Q = q·m (vurulur, bölünmür). Düz cavab ${F(eta * 100)}%.`,
            `2-ci addım: FİƏ = faydalı iş / sərf olunan istilik = A/Q₁ (tərsi yox). Düz cavab ${F(eta * 100)}%.`,
            `3-cü addım: faizə keçmək üçün 100-ə vurulur. ${F(eta)} = ${F(eta * 100)}%.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Çaya buz, çaydanın quruması, avtomobilin yanacağı, dondurucu.",
      gen() {
        const kind = pick(["cay", "quru", "avto", "don"]);
        if (kind === "cay") return search(() => {
          const mw = pick([0.2, 0.25, 0.3, 0.4, 0.5]), mi = pick([0.02, 0.025, 0.03, 0.04, 0.05]), tw = pick([60, 70, 80, 90, 100]);
          const th = (mw * tw - 80 * mi) / (mw + mi); if (th <= 0 || !nice(th, 1)) return null;
          return R(th, "°C", { text: `${tw} °C-li ${F(mw)} kq çaya (suya bərabər götür) 0 °C-li ${F(mi)} kq buz parçası saldılar. Buz tam əridi. İstilik itkisi yoxdur (c_su = 4200 J/(kq·°C); ${LAMTXT}). Çayın son temperaturu neçə °C olar?`,
            solution: `4200·${F(mw)}·(${tw} − θ) = ${LAM}·${F(mi)} + 4200·${F(mi)}·θ. 4200-ə bölək (λ/c = 80): ${F(mw)}(${tw} − θ) = ${F(80 * mi)} + ${F(mi)}θ → θ = (${F(mw * tw)} − ${F(80 * mi)})/${F(mw + mi)} = ${F(th)} °C.` });
        });
        if (kind === "quru") return search(() => {
          const m = pick([0.2, 0.5, 1, 1.5]), P = pick([1150, 2300, 1000, 1500, 2000, 2500]);
          const t = LV * m / P; if (!Number.isInteger(t) || t > 3000) return null;
          return R(t, "s", { text: `Qaynayan (100 °C) çaydandakı ${F(m)} kq su tamamilə buxara çevrilməlidir. Çaydanın gücü ${P} W-dır və itki yoxdur. (${LTXT}.) Neçə saniyə lazımdır?`,
            solution: `Q = Lm = 2,3·10⁶·${F(m)} = ${F(LV * m)} J. Pt = Q → t = Q/P = ${F(LV * m)}/${P} = ${t} s.` });
        });
        if (kind === "avto") return search(() => {
          const m = pick([4, 5, 6, 8, 10]), s = pick([50, 100]), eta = pick([0.2, 0.25, 0.3]);
          const Fq = eta * 46e6 * m / (s * 1000); if (!nice(Fq, 1) || Fq < 100) return null;
          return R(Fq, "N", { text: `Avtomobil ${s} km yolda ${F(m)} kq benzin (q = 46·10⁶ J/kq) sərf edir. Mühərrikin FİƏ-si ${Math.round(eta * 100)}%-dir. Orta dartı qüvvəsi nə qədərdir?`,
            solution: `Faydalı iş: A = ηqm = ${F(eta)}·46·10⁶·${F(m)} = ${F(eta * 46e6 * m)} J. A = F·s → F = ${F(eta * 46e6 * m)}/${s * 1000} = ${F(Fq)} N.` });
        });
        const m = pick([0.1, 0.2, 0.25, 0.5, 1]), t = pick([10, 20, 25, 30]);
        const Q = CW * m * t + LAM * m;
        return R(Q / 1000, "kJ", { text: `Soyuducuda buz hazırlamaq üçün ${t} °C-li ${F(m)} kq suyu 0 °C-li buza çevirmək lazımdır. Soyuducu sudan nə qədər istilik almalıdır? (c_su = 4200 J/(kq·°C); ${LAMTXT}.) Cavabı kJ-la yaz.`,
          solution: `Suyu 0 °C-ə qədər soyutmaq: 4200·${F(m)}·${t} = ${F(CW * m * t)} J. Donma: λm = ${F(LAM * m)} J. Cəmi ${F(Q)} J = ${F(Q / 1000)} kJ.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a picture (temperature–time
  // graph, vessel, engine scheme…) and several steps; the wrong options are the answers of typical mistakes.
  // Questions 4 and 8 also use "Temperatur, istidən genişlənmə, istilik miqdarı" (heater power, Δl = αl₀Δt),
  // question 7 uses "Enerji" (kinetic energy E = mv²/2).
  const { ae, again } = Oyun;
  const ok = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  // small SVG kit (colours follow the theme, as in the lesson figures)
  const INK = "var(--ink,#17171a)", ACC = "var(--accent,#a32d2d)", VEC = "var(--vec,#0c447c)", MUT = "var(--muted,#6b6b73)", PAP = "var(--paper,#fff)";
  const r1 = n => +(+n).toFixed(1);
  const Ln = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const Pl = (pts, c = INK, w = 2.5, ex = "") => `<polyline points="${pts.map(p => r1(p[0]) + "," + r1(p[1])).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"${ex}/>`;
  const Tx = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const Ar = (x1, y1, x2, y2, c = ACC, w = 2.5) => Ln(x1, y1, x2, y2, c, w, ` marker-end="url(#ib-ar)"`);
  const Rc = (x, y, w, h, c = INK, fill = PAP, sw = 2) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${fill}" stroke="${c}" stroke-width="${sw}"/>`;
  const SV = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" class="oy-svg" role="img" aria-label="${aria}"><defs><marker id="ib-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="10" markerHeight="10" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  // graph: axes (left, bottom), dashed guides at the ticks, value labels, lines {pts, c, lab:[x, y, text]}
  function plot(o) {
    const W = o.W || 290, H = o.H || 200, L = 48, R = W - 18, T = 22, B = H - 30, [x0, x1] = o.xr, [y0, y1] = o.yr;
    const X = x => L + (x - x0) / (x1 - x0) * (R - L), Y = y => B - (y - y0) / (y1 - y0) * (B - T);
    let s = "";
    (o.xt || []).forEach(([x, lab]) => { s += Ln(X(x), B, X(x), T, MUT, 0.8, ` stroke-dasharray="3 3"`) + Tx(X(x), B + 15, lab, "middle", INK, 12); });
    (o.yt || []).forEach(([y, lab]) => { s += Ln(L, Y(y), R, Y(y), MUT, 0.8, ` stroke-dasharray="3 3"`) + Tx(L - 6, Y(y) + 4, lab, "end", INK, 12); });
    s += Ar(L, B, R + 12, B, INK, 1.5) + Ar(L, B, L, T - 14, INK, 1.5) + Tx(L + 6, T - 6, o.yl || "t, °C", "start", INK, 12) + Tx(R + 12, B + 26, o.xl || "τ, dəq", "end", INK, 12);
    (o.lines || []).forEach(l => { s += Pl(l.pts.map(([x, y]) => [X(x), Y(y)]), l.c || ACC, 2.6); if (l.lab) s += Tx(X(l.lab[0]), Y(l.lab[1]), l.lab[2], l.lab[3] || "middle", l.c || ACC, 12); });
    (o.notes || []).forEach(([x, y, t, a, c]) => { s += Tx(X(x), Y(y), t, a || "middle", c || MUT, 11); });
    return svgEl(SV(W, H, s, o.aria));
  }
  // engine scheme: heater → working body → cooler, work A out
  const figEngine = (top, bot, q1, q2, a) => svgEl(SV(280, 214,
    Rc(70, 8, 140, 40, ACC) + Tx(140, 26, "Qızdırıcı", "middle", ACC, 13) + Tx(140, 42, top, "middle", INK, 12)
    + `<circle cx="140" cy="107" r="27" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + Tx(140, 104, "İşçi", "middle", INK, 11) + Tx(140, 117, "cisim", "middle", INK, 11)
    + Rc(70, 166, 140, 40, VEC) + Tx(140, 184, "Soyuducu", "middle", VEC, 13) + Tx(140, 200, bot, "middle", INK, 12)
    + Ar(140, 50, 140, 78, ACC) + Tx(148, 69, q1, "start") + Ar(140, 136, 140, 164, VEC) + Tx(148, 155, q2, "start")
    + Ar(168, 107, 262, 107, INK) + Tx(214, 99, a), "İstilik mühərrikinin sxemi: qızdırıcıdan Q₁ alır, A işi görür, soyuducuya Q₂ verir"));
  // open vessel with water; inner = what is drawn inside / above
  const vessel = (inner, aria, H = 200) => svgEl(SV(280, H,
    `<rect x="62" y="${H - 120}" width="156" height="100" fill="${VEC}" fill-opacity="0.12"/>` + Ln(62, H - 120, 218, H - 120, VEC, 1.5)
    + Pl([[60, H - 150], [60, H - 18], [220, H - 18], [220, H - 150]], INK, 2.5) + inner, aria));
  const cube = (x, y, a) => `<rect x="${x}" y="${y}" width="22" height="22" fill="${PAP}" stroke="${INK}" stroke-width="1.6" transform="rotate(${a} ${x + 11} ${y + 11})"/>`;
  const figIce = (mw, tw, mi, ti) => vessel(cube(90, 68, -8) + cube(118, 70, 6) + cube(150, 67, -4) + Tx(140, 56, `buz: ${F(mi)} kq, −${ti} °C`)
    + Tx(140, 140, `su: ${F(mw)} kq, ${tw} °C`, "middle", VEC), "Suyun içinə buz parçaları atılıb", 200);
  const figRod = (mt, l0, t1, mw, t2) => vessel(Rc(80, 26, 120, 9, ACC, ACC, 1) + Tx(140, 18, `${mt}, l₀ = ${F(l0)} m, ${t1} °C`) + Ar(140, 40, 140, 70, MUT, 2)
    + Tx(140, 140, `su: ${F(mw)} kq, ${t2} °C`, "middle", VEC), "Qızdırılmış metal çubuq suya salınır", 200);
  const figHammer = (M, v, N, mt, m) => svgEl(SV(280, 214,
    `<path d="M80 150 L200 150 L180 168 L180 186 L100 186 L100 168 Z" fill="${MUT}" fill-opacity="0.35" stroke="${INK}" stroke-width="2"/>` + Rc(122, 136, 36, 14, ACC, ACC, 1)
    + Tx(140, 205, `${mt}, ${F(m)} kq`, "middle", ACC, 12) + Rc(112, 30, 56, 30, INK, MUT, 2) + Ln(168, 45, 240, 30, INK, 5)
    + Ar(140, 68, 140, 126, ACC) + Tx(132, 100, "v", "end", ACC, 14) + Tx(140, 22, `M = ${F(M)} kq`) + Tx(214, 82, `${N} zərbə`, "start", INK, 12),
    "Çəkic zindan üzərindəki metal parçasına zərbə endirir"));

  // question 2: metals and the draws for which all five options are "nice" (found once, at load)
  const METAL2 = [...METALS, { n: "dəmir", c: 460 }, { n: "gümüş", c: 250 }], Q2SET = [];
  for (const { c } of METAL2) for (const mm of [0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 2]) for (const t2 of [10, 15, 20, 25]) for (const th of [20, 25, 30, 35, 40, 45, 50, 60]) for (let t1 = th + 10; t1 <= 200; t1 += 5) {
    const mw = c * mm * (t1 - th) / (CW * (th - t2)), ym = t1 * 1.15;
    if (!(mw > 0) || mw > 2 || !nice(mw, 3) || th - t2 < 0.12 * ym || t1 - th < 0.12 * ym) continue;
    const w = [CW * mw * (t1 - th) / (mm * (th - t2)), CW * (th - t2) / (t1 - th), CW * mw * (th - t2) / (mm * (t1 - t2)), CW * mw * (th - t2) / (mm * t1)];
    if (w.every(x => ok(x, 1))) Q2SET.push([c, mm, mw, t2, th, t1]);
  }
  const LAMK = "λ = 3,36·10⁵ J/kq";
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. heating curve with a plateau: c of the solid from the two time intervals (constant heater power)
    { tip: "qapali", gen: () => again(() => {
      const lam = pick([60, 80, 90, 120, 150, 200, 240]), tm = pick([60, 80, 120, 160, 230]), t0 = pick([10, 20, 30, 40]), a = rnd(1, 6), b = rnd(2, 12);
      const dT = tm - t0, L = lam * 1000, c = L * a / (b * dT);
      if (dT < 30 || c < 100 || c > 3000 || !nice(c, 0)) return null;
      const w = [L * b / (a * dT), L * a / b, L * a / (b * tm), L * a / ((a + b) * dT)]; if (!w.every(x => ok(x, 1))) return null;
      const xe = a + b + 2, ye = Math.min(tm + 2.2 * dT / a, tm * 1.35);
      return mc(ae(c, w, U_("J/(kq·°C)")), {
        svg: plot({ xr: [0, xe + 0.5], yr: [0, tm * 1.4], xt: [[a, a], [a + b, a + b]], yt: [[t0, t0], [tm, tm]],
          lines: [{ pts: [[0, t0], [a, tm], [a + b, tm], [xe, ye]] }], notes: [[a + b / 2, tm + tm * 0.07, "ərimə"]],
          aria: `Temperaturun zamandan asılılığı: ${t0} °C-dən ${tm} °C-yə ${a} dəqiqədə, sonra ${b} dəqiqə ${tm} °C-də üfüqi hissə` }),
        text: `Kristal maddəni sabit güclü qızdırıcı ilə qızdırırlar. Qrafikdə maddənin temperaturunun zamandan asılılığı verilib. Maddənin xüsusi ərimə istiliyi λ = ${lam} kJ/kq. Bərk halda maddənin xüsusi istilik tutumu nə qədərdir? (Qızdırıcının verdiyi bütün istiliyi maddə alır.)`,
        solution: `Güc sabitdir, istilik vaxta mütənasibdir. Qızma (${a} dəq): P·${a} = c·m·(${tm} − ${t0}). Ərimə (üfüqi hissə, ${b} dəq): P·${b} = λm. Bölək: c = λ·${a}/(${b}·${dT}) = ${F(L)}·${a}/${b * dT} = ${F(c)} J/(kq·°C). Tələlər: nisbəti tərsinə çevirmək (${F(w[0])}), Δt-ni unutmaq (${F(w[1])}), Δt əvəzinə ${tm} °C götürmək (${F(w[2])}), ümumi vaxtı ${a + b} dəq götürmək (${F(w[3])}).` });
    }) },
    // 2. two temperature curves meeting at θ: c of the metal from the balance (draws with all five options "nice", listed once)
    { tip: "qapali", gen: () => again(() => { const [c, mm, mw, t2, th, t1] = pick(Q2SET), mt = METAL2.find(x => x.c === c);
      const ym = t1 * 1.15, w = [CW * mw * (t1 - th) / (mm * (th - t2)), CW * (th - t2) / (t1 - th), CW * mw * (th - t2) / (mm * (t1 - t2)), CW * mw * (th - t2) / (mm * t1)];
      const cur = (a, b) => Array.from({ length: 13 }, (_, i) => [i * 0.5, i <= 8 ? b + (a - b) * Math.exp(-i / 2.2) * (1 - i / 8) : b]);
      return mc(ae(c, w, U_("J/(kq·°C)")), {
        svg: plot({ xr: [0, 6.6], yr: [0, ym], yt: [[t2, t2], [th, th], [t1, t1]], lines: [{ pts: cur(t1, th), c: ACC, lab: [1.2, t1 - (t1 - th) * 0.45, "1", "start"] }, { pts: cur(t2, th), c: VEC, lab: [1.2, t2 + (th - t2) * 0.2, "2", "start"] }],
          xl: "τ", aria: `İki cismin temperaturu: 1 — ${t1} °C-dən, 2 — ${t2} °C-dən ${th} °C-yə yaxınlaşır` }),
        text: `Qızdırılmış ${F(mm)} kq kütləli metal cismi ${F(mw)} kq suya saldılar. Qrafikdə metalın (1) və suyun (2) temperaturunun zamandan asılılığı verilib. İstilik yalnız metalla su arasında mübadilə olunur, c_su = 4200 J/(kq·°C). Metalın xüsusi istilik tutumu nə qədərdir?`,
        solution: `Qrafikdən: metal ${t1} °C-dən ${th} °C-yə soyuyur, su ${t2} °C-dən ${th} °C-yə qızır. Balans: c·${F(mm)}·(${t1} − ${th}) = 4200·${F(mw)}·(${th} − ${t2}) → c = ${F(CW * mw * (th - t2))}/(${F(mm)}·${t1 - th}) = ${c} J/(kq·°C) (${mt.n}). Tələlər: temperatur dəyişmələrinin yerini dəyişmək (${F(w[0])}), kütlələri unutmaq (${F(w[1])}), metal üçün t₁ − t₂ götürmək (${F(w[2])}), Δt əvəzinə ${t1} °C (${F(w[3])}).` });
    }) },
    // 3. cold ice into warm water: not all of it melts — how much ice is left
    { tip: "qapali", gen: () => again(() => {
      const mw = pick([0.5, 1, 1.5, 2, 3]), tw = pick([10, 20, 30, 40, 50, 60]), mi = pick([0.5, 1, 1.5, 2, 3]), ti = pick([10, 20, 40]);
      const Qw = CW * mw * tw, Qi = CI * mi * ti; if (Qw <= Qi || Qw - Qi >= LAM * mi) return null;
      const melt = (Qw - Qi) / LAM, rest = mi - melt;
      const w = [mi - Qw / LAM, melt, 0, mi - (Qw - CW * mi * ti) / LAM];
      if (![rest, w[0], w[1], w[3]].every(x => ok(x, 3)) || w[3] > mi) return null;
      return mc(ae(rest, w, U_("kq")), { svg: figIce(mw, tw, mi, ti),
        text: `${tw} °C-li ${F(mw)} kq suya −${ti} °C-li ${F(mi)} kq buz atdılar. İstilik itkisi yoxdur, qabın istilik tutumu nəzərə alınmır. c_su = 4200, c_buz = 2100 J/(kq·°C), ${LAMK}. İstilik tarazlığı yarandıqda qabda neçə kq buz qalar?`,
        solution: `Su 0 °C-yə qədər soyuyanda verə bilər: 4200·${F(mw)}·${tw} = ${F(Qw)} J. Buzu 0 °C-yə qədər qızdırmaq: 2100·${F(mi)}·${ti} = ${F(Qi)} J. Qalan ${F(Qw - Qi)} J əritməyə gedir; hamısını əritmək üçün ${F(LAM * mi)} J lazımdır — çatmır, son temperatur 0 °C. Əriyən: ${F(Qw - Qi)}/336 000 = ${F(melt)} kq, qalan: ${F(mi)} − ${F(melt)} = ${F(rest)} kq. Tələlər: buzun qızmasını unutmaq (${F(w[0])} kq), əriyəni yazmaq (${F(melt)} kq), "hamısı əriyir" (0), buz üçün 4200 götürmək (${F(w[3])} kq).` });
    }) },
    // 4. electric kettle with efficiency: heating to 100 °C, then part of the water boils away (heater power, Q = cmΔt)
    { tip: "qapali", birlesik: "fiz-istilik", gen: () => again(() => {
      const P = pick([1000, 1200, 1500, 2000, 2300, 2500]), eta = pick([0.7, 0.75, 0.8, 0.84, 0.9]), m = pick([0.5, 1, 1.5, 2]), t1 = pick([10, 16, 20, 25, 30]), k = pick([0.1, 0.2, 0.25, 0.5]);
      const Qh = CW * m * (100 - t1), Qb = k * m * LV, T = (Qh + Qb) / (eta * P); if (!nice(T, 0)) return null;
      const w = [(Qh + Qb) / P, Qh / (eta * P), (Qh + m * LV) / (eta * P), Qb / (eta * P)]; if (!w.every(x => ok(x, 1))) return null;
      const th = Qh / (Qh + Qb) * 8;
      return mc(ae(T, w, U_("s")), {
        svg: plot({ xr: [0, 9.2], yr: [0, 125], xt: [[8, "?"]], yt: [[t1, t1], [100, 100]], lines: [{ pts: [[0, t1], [th, 100], [8, 100]] }], notes: [[th + (8 - th) / 2, 108, "qaynama"]],
          xl: "τ, s", aria: `Çaydandakı suyun temperaturu ${t1} °C-dən 100 °C-yə qalxır, sonra qaynama; son an sual işarəsi ilə` }),
        text: `Elektrik çaydanında ${t1} °C-li ${F(m)} kq su var. Çaydanın gücü ${P} W, FİƏ-si ${F(eta * 100)}%-dir (qızdırıcının istiliyinin ${F(eta * 100)}%-i suya gedir). Çaydanı qoşandan neçə saniyə sonra suyun ${F(k * 100)}%-i buxara çevrilər? (c_su = 4200 J/(kq·°C), L = 2,3·10⁶ J/kq, normal təzyiq.)`,
        solution: `Suyu 100 °C-yə qədər: 4200·${F(m)}·${100 - t1} = ${F(Qh)} J. Buxarlanan ${F(k * m)} kq: L·${F(k * m)} = ${F(Qb)} J. Cəmi ${F(Qh + Qb)} J. η·P·t = Q → t = ${F(Qh + Qb)}/(${F(eta)}·${P}) = ${F(T)} s. Tələlər: FİƏ-ni unutmaq (${F(w[0])} s), buxarlanmanı unutmaq (${F(w[1])} s), bütün suyu buxarlandırmaq (${F(w[2])} s), qızmanı unutmaq (${F(w[3])} s).` });
    }) },
    // 5. heat engine: heat given to the cooler in τ minutes
    { tip: "qapali", gen: () => again(() => {
      const P = pick([20, 25, 30, 40, 50, 60, 80, 100]), eta = pick([0.2, 0.25, 0.3, 0.4]), tau = pick([1, 2, 5, 10]);
      const A = P * 1000 * 60 * tau / 1e6, Q1 = A / eta, Q2 = Q1 - A;
      const w = [Q1, A * (1 - eta), A, Q2 / 60]; if (![Q2, ...w].every(x => ok(x, 2))) return null;
      return mc(ae(Q2, w, U_("MJ")), { svg: figEngine("T₁", "T₂", "Q₁", "Q₂ = ?", "A"),
        text: `İstilik mühərrikinin faydalı gücü ${P} kW, FİƏ-si ${F(eta * 100)}%-dir. Mühərrik ${tau} dəqiqədə soyuducuya nə qədər istilik verir?`,
        solution: `Faydalı iş: A = P·t = ${P}·10³·${60 * tau} = ${F(A)} MJ. Qızdırıcıdan alınan: Q₁ = A/η = ${F(A)}/${F(eta)} = ${F(Q1)} MJ. Soyuducuya: Q₂ = Q₁ − A = ${F(Q2)} MJ. Tələlər: Q₁-i yazmaq (${F(Q1)}), Q₂ = (1 − η)·A (${F(w[1])}), Q₂ = A (${F(A)}), dəqiqəni saniyəyə çevirməmək (${F(w[3])}).` });
    }) },
    // 6. ideal (Carnot) engine: η from A and Q₁, then the heater temperature in °C
    { tip: "qapali", gen: () => again(() => {
      const T2 = pick([300, 320, 350, 400]), t2 = T2 - 273, eta = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6]), Q1 = pick([100, 150, 200, 250, 300, 400, 500, 600, 800, 1000]), A = eta * Q1;
      const T1 = T2 / (1 - eta), t1 = T1 - 273; if (!nice(A, 0)) return null;
      const w = [t2 / (1 - eta), T1, T2 * (1 + eta) - 273, T2 / eta - 273]; if (![t1, ...w].every(x => ok(x, 1))) return null;
      return mc(ae(t1, w, U_("°C")), { svg: figEngine("t₁ = ?", `t₂ = ${t2} °C`, `Q₁ = ${Q1} kJ`, "Q₂", `A = ${F(A)} kJ`),
        text: `İdeal istilik mühərriki (Karno tsikli) bir tsikldə qızdırıcıdan ${Q1} kJ istilik alır və ${F(A)} kJ iş görür. Soyuducunun temperaturu ${t2} °C-dir. Qızdırıcının temperaturu neçə °C-dir? (T = t + 273.)`,
        solution: `η = A/Q₁ = ${F(A)}/${Q1} = ${F(eta)}. İdeal mühərrik: η = 1 − T₂/T₁, T₂ = ${t2} + 273 = ${T2} K. T₁ = T₂/(1 − η) = ${T2}/${F(1 - eta)} = ${F(T1)} K, t₁ = ${F(T1)} − 273 = ${F(t1)} °C. Tələlər: °C ilə hesablamaq (${F(w[0])}), kelvini °C kimi yazmaq (${F(T1)}), T₁ = T₂(1 + η) (${F(w[2])}), η = T₂/T₁ (${F(w[3])}).` });
    }) },
    // 7. hammer blows heat a metal piece (kinetic energy → internal energy)
    { tip: "qapali", birlesik: "fiz-enerji", gen: () => again(() => {
      const M = pick([1, 1.5, 2, 4, 5]), v = pick([4, 5, 6, 8, 10]), N = pick([10, 20, 25, 40, 50]), k = pick([0.4, 0.5, 0.6, 0.8]), mt = pick(METALS), m = pick([0.1, 0.2, 0.25, 0.4, 0.5]);
      const E = N * k * M * v * v / 2, dt = E / (mt.c * m); if (!nice(dt, 1) || dt < 1 || dt > 60) return null;
      const w = [dt / k, 2 * dt, dt / N, E / (mt.c * M)]; if (!w.every(x => ok(x, 3))) return null;
      return mc(ae(dt, w, U_("°C")), { svg: figHammer(M, v, N, mt.n, m),
        text: `Kütləsi ${F(M)} kq olan çəkic zindan üzərindəki ${F(m)} kq kütləli ${mt.n} parçasına (c = ${mt.c} J/(kq·°C)) ${N} dəfə vurur. Hər zərbədən əvvəl çəkicin sürəti ${v} m/s-dir, zərbədən sonra çəkic dayanır. Zərbələr müddətində parçanın ətrafa istilik verməsi nəzərə alınmır. Çəkicin kinetik enerjisinin ${F(k * 100)}%-i parçanın qızmasına gedir. Parçanın temperaturu neçə dərəcə artar?`,
        solution: `Bir zərbədə: E = Mv²/2 = ${F(M)}·${v * v}/2 = ${F(M * v * v / 2)} J. ${N} zərbədə parçaya: Q = ${F(k)}·${N}·${F(M * v * v / 2)} = ${F(E)} J. Δt = Q/(cm) = ${F(E)}/(${mt.c}·${F(m)}) = ${F(dt)} °C. Tələlər: faizi unutmaq (${F(w[0])}), E = Mv² (½ yoxdur: ${F(w[1])}), bir zərbə (${F(w[2])}), çəkicin kütləsini götürmək (${F(w[3])}).` });
    }) },
    // 8. a hot steel rod into water: balance gives θ, then the shortening Δl = αl₀(t₁ − θ)
    { tip: "qapali", birlesik: "fiz-istilik", gen: () => again(() => {
      const m1 = pick([0.5, 1, 2, 4]), mw = pick([0.5, 1, 2]), t1 = pick([200, 250, 300, 350, 400, 450, 500]), t2 = pick([10, 15, 20]), l0 = pick([0.5, 1, 2]);
      const c1 = 500, th = (c1 * m1 * t1 + CW * mw * t2) / (c1 * m1 + CW * mw); if (!nice(th, 0) || th >= 90) return null;
      const dl = 0.012 * l0 * (t1 - th), w = [0.012 * l0 * t1, 0.012 * l0 * (th - t2), 0.012 * l0 * (t1 - t2), 0.012 * l0 * th];
      if (![dl, ...w].every(x => ok(x, 3))) return null;
      return mc(ae(dl, w, U_("mm")), { svg: figRod("polad", l0, t1, mw, t2),
        text: `${t1} °C-yə qədər qızdırılmış ${F(m1)} kq kütləli, ${F(l0)} m uzunluqlu polad çubuğu ${t2} °C-li ${F(mw)} kq suya saldılar. Su qaynamır, istilik itkisi yoxdur, qabın istilik tutumu nəzərə alınmır. c_polad = 500, c_su = 4200 J/(kq·°C), poladın xətti genişlənmə əmsalı α = 1,2·10⁻⁵ °C⁻¹. İstilik tarazlığı yarananda çubuq neçə mm qısalar?`,
        solution: `Balans: 500·${F(m1)}·(${t1} − θ) = 4200·${F(mw)}·(θ − ${t2}) → θ = (${F(c1 * m1 * t1)} + ${F(CW * mw * t2)})/(${F(c1 * m1)} + ${F(CW * mw)}) = ${F(th)} °C. Çubuq ${t1 - th} °C soyuyur: Δl = αl₀Δt = 1,2·10⁻⁵·${F(l0 * 1000)} mm·${t1 - th} = ${F(dl)} mm. Tələlər: Δt əvəzinə ${t1} °C (${F(w[0])}), suyun Δt-si (${F(w[1])}), t₁ − t₂ (${F(w[2])}), son temperatur θ (${F(w[3])}).` });
    }) },
    // 9. freezer: cooling to 0 °C takes a minutes; total time until all water is ice (constant heat removal rate)
    { tip: "qapali", gen: () => again(() => {
      const t1 = pick([5, 8, 10, 16, 20, 25, 32, 40]), a = rnd(1, 12), fz = 80 * a / t1, T = a + fz; if (!nice(T, 1) || fz > 200) return null;
      const e = Math.min(0.25 * T, 0.8 * a), dr = 2 * t1 * e / a; // buz suyun yarısı qədər tutumlu: eyni güc → 2t₁/a °C/dəq
      const w = [fz, a + a * t1 / 80, a + 160 * a / t1, 2 * a]; if (!w.every(x => ok(x, 2))) return null;
      return mc(ae(T, w, U_("dəq")), {
        svg: plot({ xr: [0, (a + fz + e) * 1.06], yr: [-dr * 1.15, t1 * 1.35], xt: [[a, a], [a + fz, "?"]], yt: [[t1, t1], [0, 0]],
          lines: [{ pts: [[0, t1], [a, 0], [a + fz, 0], [a + fz + e, -dr]], c: VEC }], notes: [[a + fz / 2, t1 * 0.12, "donma"]],
          aria: `Suyun temperaturu ${a} dəqiqədə ${t1} °C-dən 0 °C-yə düşür, sonra donma; son an sual işarəsi ilə` }),
        text: `${t1} °C-li suyu dondurucuya qoydular. Dondurucu sudan hər dəqiqədə eyni miqdarda istilik alır. Qrafikdə suyun temperaturunun zamandan asılılığı verilib: su ${a} dəqiqədə 0 °C-yə qədər soyudu. Dondurucuya qoyulandan neçə dəqiqə sonra bütün su buza çevrilər? (c_su = 4200 J/(kq·°C), ${LAMK}.)`,
        solution: `İstilik vaxta mütənasibdir: soyuma c·m·${t1} → ${a} dəq, donma λm → x dəq. x = ${a}·λ/(c·${t1}) = ${a}·80/${t1} = ${F(fz)} dəq. Cəmi: ${a} + ${F(fz)} = ${F(T)} dəq. Tələlər: yalnız donma vaxtı (${F(fz)}), nisbəti tərsinə çevirmək (${F(w[1])}), c_buz götürmək (${F(w[2])}), "donma da eyni çəkir" (${F(2 * a)}).` });
    }) },
    // 10. fuel burnt to turn cold ice into water at 100 °C (three stages, efficiency)
    { tip: "qapali", gen: () => again(() => {
      const f = pick(FUELS), mi = pick([0.2, 0.25, 0.5, 1, 2, 4, 5]), ti = pick([10, 20, 30, 40]), eta = pick([0.25, 0.4, 0.5, 0.6, 0.8]);
      const Q1 = CI * mi * ti, Q2 = LAM * mi, Q3 = CW * mi * 100, Q = Q1 + Q2 + Q3, g = Q / (eta * f.q * 1e6) * 1000;
      const w = [(Q1 + Q3) / (eta * f.q * 1e3), Q / (f.q * 1e3), (CW * mi * ti + Q2 + Q3) / (eta * f.q * 1e3), Q * eta / (f.q * 1e3)];
      if (![g, ...w].every(x => ok(x, 1))) return null;
      const q1 = Q1 / Q, q2 = Q2 / Q;
      return mc(ae(g, w, U_("q")), {
        svg: plot({ xr: [0, 1.12], yr: [-ti * 1.6, 135], yt: [[-ti, "−" + ti], [0, 0], [100, 100]], lines: [{ pts: [[0, -ti], [q1, 0], [q1 + q2, 0], [1, 100]] }],
          notes: [[q1 + 0.03, -ti * 0.75, "Q₁", "start", INK], [q1 + q2 / 2, 9, "Q₂", "middle", INK], [q1 + q2 + (1 - q1 - q2) / 2 - 0.06, 62, "Q₃", "end", INK]],
          xl: "Q", aria: `Buzun −${ti} °C-dən 100 °C-li suya çevrilmə qrafiki: qızma, ərimə, suyun qızması` }),
        text: `−${ti} °C-li ${F(mi)} kq buzu 100 °C-li suya çevirmək lazımdır (qrafik). Bunun üçün ${f.n} yandırılır (q = ${f.q}·10⁶ J/kq); yanma istiliyinin ${F(eta * 100)}%-i buza (suya) verilir. Neçə qram yanacaq lazımdır? (c_buz = 2100, c_su = 4200 J/(kq·°C), ${LAMK}.)`,
        solution: `Q₁ = 2100·${F(mi)}·${ti} = ${F(Q1)} J; Q₂ = λm = ${F(Q2)} J; Q₃ = 4200·${F(mi)}·100 = ${F(Q3)} J. Cəmi ${F(Q)} J. η·q·m = Q → m = ${F(Q)}/(${F(eta)}·${f.q}·10⁶) kq = ${F(g)} q. Tələlər: əriməni unutmaq (${F(w[0])} q), FİƏ-ni unutmaq (${F(w[1])} q), buz üçün 4200 (${F(w[2])} q), η-ya bölmək əvəzinə vurmaq (${F(w[3])} q).` });
    }, 3000) },
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
      key: "fiz-istilik-balansi", title: "İstilik balansı, faza keçidləri, mühərriklər", fenn: "fizika", link: "dersler/fiz-istilik-balansi.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: °C, kq, kJ, MJ, %). Onluq kəsr vergül və ya nöqtə ilə: 0,5. c_su = 4200 J/(kq·°C); sabitlər (λ, L, q) məsələdə verilir.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["balans", "balans", "faza", "faza", "buzsu", "yanacaq", "muherrik", "muherrik", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-istilik-balansi.html")) b.push("dersler/fiz-istilik-balansi.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
