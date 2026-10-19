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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-istilik-balansi", title: "İstilik balansı, faza keçidləri, mühərriklər", fenn: "fizika", link: "dersler/fiz-istilik-balansi.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: °C, kq, kJ, MJ, %). Onluq kəsr vergül və ya nöqtə ilə: 0,5. c_su = 4200 J/(kq·°C); sabitlər (λ, L, q) məsələdə verilir.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["balans", "balans", "faza", "faza", "buzsu", "yanacaq", "muherrik", "muherrik", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-istilik-balansi.html")) b.push("dersler/fiz-istilik-balansi.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
