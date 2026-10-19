// Fizika · Cərəyan, gərginlik, müqavimət — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}.
// Resistivity ρ is given in Ω·mm²/m (1 Ω·mm²/m = 10⁻⁶ Ω·m), so  R = ρ·l/S  with l in m and S in mm² gives Ω directly. e = 1,6·10⁻¹⁹ Kl.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const sup = n => String(n).replace(/-/g, "⁻").replace(/\d/g, d => "⁰¹²³⁴⁵⁶⁷⁸⁹"[d]);
  const INK = "var(--ink,#17171a)";
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const MAT = [["mis", 0.017], ["alüminium", 0.028], ["dəmir", 0.1], ["konstantan", 0.5], ["nixrom", 1.1]];

  // ---- circuit symbols ----
  const ln = (g, x1, y1, x2, y2) => g.append(sv("line", { x1, y1, x2, y2, stroke: INK, "stroke-width": 1.8 }));
  const dot = (g, x, y) => g.append(sv("circle", { cx: x, cy: y, r: 3, fill: INK }));
  const lbl = (g, x, y, t, anchor) => g.append(sv("text", { x, y, "text-anchor": anchor || "middle", class: "oy-lbl" }, t));
  function meter(g, x, y, letter) {
    g.append(sv("circle", { cx: x, cy: y, r: 13, fill: "var(--sheet,#fff)", stroke: INK, "stroke-width": 2 }));
    g.append(sv("text", { x, y: y + 5, "text-anchor": "middle", "font-size": 14, "font-weight": 700, fill: INK }, letter));
  }
  function resH(g, cx, y, label, above) {         // horizontal resistor, centre cx
    g.append(sv("rect", { x: cx - 24, y: y - 8, width: 48, height: 16, fill: "var(--sheet,#fff)", stroke: INK, "stroke-width": 2 }));
    lbl(g, cx, above ? y - 13 : y + 24, label);
  }
  function resV(g, x, cy, label) {                 // vertical resistor
    g.append(sv("rect", { x: x - 8, y: cy - 22, width: 16, height: 44, fill: "var(--sheet,#fff)", stroke: INK, "stroke-width": 2 }));
    lbl(g, x + 14, cy + 4, label, "start");
  }
  function batteryV(g, x, cy, label) {             // vertical wire, battery (long line = +) at centre
    ln(g, x - 14, cy - 5, x + 14, cy - 5); g.append(sv("line", { x1: x - 8, y1: cy + 5, x2: x + 8, y2: cy + 5, stroke: INK, "stroke-width": 4 }));
    lbl(g, x + 20, cy - 10, "+", "start"); lbl(g, x + 20, cy + 8, label, "start");
  }
  function seriesFig(U, R1, R2) {                  // battery, R1 (top), ammeter (right), R2 (bottom); voltmeter across R2
    const g = sv("svg", { viewBox: "0 0 300 200", class: "oy-svg", role: "img", "aria-label": "Ardıcıl sxem: mənbə, iki rezistor, ampermetr, R₂-yə paralel voltmetr" });
    ln(g, 40, 30, 125, 30); resH(g, 150, 30, `R₁ = ${R1} Ω`, true); ln(g, 175, 30, 260, 30);
    ln(g, 260, 30, 260, 62); meter(g, 260, 75, "A"); ln(g, 260, 88, 260, 120);
    ln(g, 260, 120, 175, 120); resH(g, 150, 120, `R₂ = ${R2} Ω`, true); ln(g, 125, 120, 40, 120);
    ln(g, 40, 30, 40, 65); ln(g, 40, 75, 40, 120); batteryV(g, 40, 70, `${U} V`);
    ln(g, 125, 120, 125, 165); ln(g, 125, 165, 137, 165); ln(g, 175, 120, 175, 165); ln(g, 175, 165, 163, 165); meter(g, 150, 165, "V"); dot(g, 125, 120); dot(g, 175, 120);
    return g;
  }
  function parallelFig(U, R1, R2, pos) {           // battery; R1, R2 in parallel; ammeter in the main line or in the R1 branch; voltmeter on the right rail
    const g = sv("svg", { viewBox: "0 0 300 180", class: "oy-svg", role: "img", "aria-label": "Paralel sxem: mənbə, iki paralel rezistor, ampermetr, voltmetr" });
    if (pos === "main") { ln(g, 40, 30, 67, 30); meter(g, 80, 30, "A"); ln(g, 93, 30, 250, 30); } else ln(g, 40, 30, 250, 30);
    ln(g, 40, 140, 250, 140); ln(g, 40, 30, 40, 70); ln(g, 40, 80, 40, 140); batteryV(g, 40, 75, `${U} V`);
    if (pos === "branch") { ln(g, 120, 30, 120, 48); resV(g, 120, 70, `R₁ = ${R1} Ω`); ln(g, 120, 92, 120, 102); meter(g, 120, 115, "A"); ln(g, 120, 128, 120, 140); }
    else { ln(g, 120, 30, 120, 48); resV(g, 120, 70, `R₁ = ${R1} Ω`); ln(g, 120, 92, 120, 140); }
    ln(g, 190, 30, 190, 48); resV(g, 190, 70, `R₂ = ${R2} Ω`); ln(g, 190, 92, 190, 140);
    ln(g, 250, 30, 250, 72); meter(g, 250, 85, "V"); ln(g, 250, 98, 250, 140);
    [[120, 30], [190, 30], [250, 30], [120, 140], [190, 140], [250, 140]].forEach(p => dot(g, p[0], p[1]));
    return g;
  }
  const PAIRS = []; for (let a = 1; a <= 60; a++) for (let b = a; b <= 60; b++) if (nice(a * b / (a + b), 2) && a * b / (a + b) >= 1) PAIRS.push([a, b]);

  const levels = [
    { id: "cereyan", ad: "Cərəyan şiddəti I = q/t", izah: "Cərəyan şiddəti — naqilin en kəsiyindən 1 saniyədə keçən yükdür: I = q/t. Vahidi Amper (A = Kl/san). 1 mA = 10⁻³ A. Zamanı saniyəyə çevir!",
      gen() {
        const kind = pick(["I", "q", "t", "mA", "N", "N"]);
        if (kind === "I") {
          let q, t; do { q = pick([2, 3, 4.5, 6, 9, 12, 15, 24, 30, 45, 60]); t = pick([2, 3, 4, 5, 6, 10, 15, 20, 30]); } while (!nice(q / t, 3));
          return R(q / t, "A", { text: `Naqilin en kəsiyindən ${t} san ərzində ${F(q)} Kl yük keçir. Cərəyan şiddəti neçə amperdir?`, solution: `I = q/t = ${F(q)}/${t} = ${F(q / t)} A.` });
        }
        if (kind === "q") {
          const i = pick([0.2, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), tm = pick([1, 2, 3, 5, 10]);
          return R(i * tm * 60, "Kl", { text: `Lampadan ${F(i)} A cərəyan ${tm} dəqiqə axır. Bu müddətdə naqilin en kəsiyindən keçən yük neçə Kl-dur?`, solution: `t = ${tm} dəq = ${tm * 60} san. q = I·t = ${F(i)}·${tm * 60} = ${F(i * tm * 60)} Kl.` });
        }
        if (kind === "t") {
          let i, q; do { i = pick([0.5, 1, 2, 2.5, 4, 5, 8]); q = pick([10, 20, 30, 40, 50, 60, 100, 120]); } while (!nice(q / i, 2));
          return R(q / i, "san", { text: `Cərəyan şiddəti ${F(i)} A olan naqildən ${q} Kl yük neçə saniyəyə keçər?`, solution: `t = q/I = ${q}/${F(i)} = ${F(q / i)} san.` });
        }
        if (kind === "mA") {
          const a = pick([5, 10, 20, 25, 40, 50, 100, 200]), t = pick([2, 4, 5, 10, 20, 30, 60]);
          return R(a * t, "mKl", { text: `Ölçü cihazında cərəyan ${a} mA-dir. ${t} saniyədə naqildən neçə milliKulon (1 mKl = 10⁻³ Kl) yük keçir?`, solution: `I = ${a} mA = ${F(a / 1000)} A. q = It = ${F(a / 1000)}·${t} = ${F(a * t / 1000)} Kl = ${F(a * t)} mKl.` });
        }
        const k = rnd(1, 10), i = 0.16 * k;
        return R(k, "10¹⁸", { text: `Naqildə cərəyan şiddəti ${F(i)} A-dir. Naqilin en kəsiyindən hər saniyə neçə ədəd elektron keçir? Cavabı 10¹⁸ vahidi ilə yaz. (e = 1,6·10⁻¹⁹ Kl)`,
          solution: `1 saniyədə q = I·1 = ${F(i)} Kl. N = q/e = ${F(i)}/(1,6·10⁻¹⁹) = ${F(k)}·10¹⁸.` });
      } },

    { id: "om", ad: "Om qanunu, rezistorlar", izah: "I = U/R (Om qanunu). Ardıcıl: R = R₁ + R₂, cərəyan eyni. Paralel: 1/R = 1/R₁ + 1/R₂, gərginlik eyni. kΩ və mA ilə: V/kΩ = mA.",
      gen() {
        const kind = pick(["I", "U", "Rr", "kOm", "ser", "par", "pari"]);
        if (kind === "I" || kind === "U" || kind === "Rr") {
          let u, r, i; do { u = pick([3, 4.5, 6, 9, 12, 24, 36, 110, 220]); r = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 22, 30, 44, 55, 110]); i = u / r; } while (!nice(i, 3) || i < 0.02);
          if (kind === "I") return R(i, "A", { text: `Rezistorun müqaviməti ${r} Ω-dur, ona ${F(u)} V gərginlik verilib. Cərəyan şiddəti neçə amperdir?`, solution: `I = U/R = ${F(u)}/${r} = ${F(i)} A.` });
          if (kind === "U") return R(u, "V", { text: `Müqaviməti ${r} Ω olan naqildən ${F(i)} A cərəyan axır. Naqilin uclarındakı gərginlik neçə voltdur?`, solution: `U = I·R = ${F(i)}·${r} = ${F(u)} V.` });
          return R(r, "Ω", { text: `Naqilin uclarına ${F(u)} V gərginlik verəndə ondan ${F(i)} A cərəyan axır. Naqilin müqaviməti neçə Ω-dur?`, solution: `R = U/I = ${F(u)}/${F(i)} = ${r} Ω.` });
        }
        if (kind === "kOm") {
          let u, r, i; do { u = pick([3, 5, 6, 9, 12, 15, 24]); r = pick([1, 2, 3, 4, 5, 6, 10, 12, 15]); i = u / r; } while (!nice(i, 2));
          return R(i, "mA", { text: `Rezistorun müqaviməti ${r} kΩ (1 kΩ = 1000 Ω), ona ${u} V gərginlik verilib. Cərəyan neçə mA-dir?`, solution: `R = ${r}·1000 Ω. I = U/R = ${u}/${r * 1000} = ${F(i / 1000)} A = ${F(i)} mA. (Qısa yol: V/kΩ = mA.)` });
        }
        if (kind === "ser") {
          let u, r1, r2, i; do { u = pick([6, 9, 12, 24, 36, 48, 60, 110, 220]); r1 = rnd(2, 40); r2 = rnd(2, 40); i = u / (r1 + r2); } while (!nice(i, 3));
          return R(i, "A", { text: `${r1} Ω və ${r2} Ω rezistorları ardıcıl birləşdirilib və ${u} V-a qoşulub. Cərəyan şiddəti neçə amperdir?`, solution: `Ardıcıl: R = ${r1} + ${r2} = ${r1 + r2} Ω. I = U/R = ${u}/${r1 + r2} = ${F(i)} A (hər iki rezistordan eyni).` });
        }
        if (kind === "par") {
          const [a, b] = pick(PAIRS), r = a * b / (a + b);
          return R(r, "Ω", { text: `${a} Ω və ${b} Ω müqavimətli iki rezistor paralel birləşdirilib. Ümumi müqavimət neçə Ω-dur?`, solution: `Paralel: R = R₁R₂/(R₁ + R₂) = ${a}·${b}/${a + b} = ${F(r)} Ω. Cavab hər birindən kiçikdir.` });
        }
        let a, b, i, i1; do { [a, b] = pick(PAIRS); i = pick([1, 2, 3, 4, 5, 6, 8, 10]); i1 = i * b / (a + b); } while (a === b || !nice(i1, 2));
        return R(i1, "A", { text: `${a} Ω və ${b} Ω rezistorları paralel birləşdirilib. Ümumi cərəyan ${i} A-dir. ${a} Ω-luq rezistordan neçə amper axır?`, solution: `Paralel: gərginlik eynidir, cərəyan müqavimətə tərs bölünür. I₁ = I·R₂/(R₁ + R₂) = ${i}·${b}/${a + b} = ${F(i1)} A. (Kiçik müqavimətdən çox cərəyan axır.)` });
      } },

    { id: "cihaz", ad: "Ampermetr və voltmetr", izah: "Ampermetr ölçülən hissəyə ardıcıl qoşulur (müqaviməti çox kiçik), voltmetr paralel (müqaviməti çox böyük). Cihazları ideal sayırıq.",
      gen() {
        const kind = pick(["ser", "ser", "par", "par", "teor"]);
        if (kind === "ser") {
          let u, r1, r2, i; do { u = pick([6, 9, 12, 18, 24, 36, 48]); r1 = rnd(1, 20); r2 = rnd(1, 20); i = u / (r1 + r2); } while (!nice(i, 3));
          const askA = Math.random() < .5;
          return R(askA ? i : i * r2, askA ? "A" : "V", { svg: seriesFig(u, r1, r2), text: `Sxemdə mənbənin gərginliyi ${u} V-dur, cihazlar idealdır (ampermetrin müqaviməti 0, voltmetrinki sonsuz). ${askA ? "Ampermetr" : "Voltmetr"} neçə ${askA ? "amper" : "volt"} göstərir?`,
            solution: `Ampermetr dövrəyə ardıcıl qoşulub, voltmetr isə R₂-yə paralel. R = ${r1} + ${r2} = ${r1 + r2} Ω, I = ${u}/${r1 + r2} = ${F(i)} A (ampermetr). Voltmetr R₂-nin gərginliyini göstərir: U₂ = I·R₂ = ${F(i)}·${r2} = ${F(i * r2)} V.` });
        }
        if (kind === "par") {
          let u, r1, r2, i1, i2; do { u = pick([6, 12, 24, 36, 48, 60]); r1 = pick([2, 3, 4, 6, 8, 10, 12, 15, 20, 24, 30]); r2 = pick([2, 3, 4, 6, 8, 10, 12, 15, 20, 24, 30]); i1 = u / r1; i2 = u / r2; } while (!nice(i1 + i2, 3));
          const pos = pick(["main", "branch"]);
          return R(pos === "main" ? i1 + i2 : i1, "A", { svg: parallelFig(u, r1, r2, pos), text: `Sxemdə mənbənin gərginliyi ${u} V-dur, cihazlar idealdır. Ampermetr neçə amper göstərir?`,
            solution: pos === "main" ? `Rezistorlar paraleldir: hər birində gərginlik ${u} V. I₁ = ${u}/${r1} = ${F(i1)} A, I₂ = ${u}/${r2} = ${F(i2)} A. Ampermetr ümumi cərəyanı ölçür: ${F(i1 + i2)} A.` : `Rezistorlar paraleldir: hər birində gərginlik ${u} V. Ampermetr yalnız R₁ qolundadır: I₁ = U/R₁ = ${u}/${r1} = ${F(i1)} A.` });
        }
        const Q = [
          ["Ampermetr cərəyanı ölçmək üçün dövrəyə necə qoşulur?", "ardıcıl", ["paralel", "hər ikisi mümkündür"], "Cərəyan ampermetrdən keçməlidir ki, onu ölçsün; ona görə o, ölçülən hissəyə ardıcıl qoşulur."],
          ["Voltmetr gərginliyi ölçmək üçün elementə necə qoşulur?", "paralel", ["ardıcıl", "hər ikisi mümkündür"], "Gərginlik elementin iki ucu arasındakı fərqdir; voltmetr bu iki nöqtəyə, yəni elementə paralel qoşulur."],
          ["İdeal ampermetrin müqaviməti necə olmalıdır?", "çox kiçik (sıfıra yaxın)", ["çox böyük (sonsuzluğa yaxın)", "dövrənin müqavimətinə bərabər"], "Ampermetr dövrəyə ardıcıl qoşulur. Müqaviməti böyük olsaydı, dövrədəki cərəyanı azaldardı və səhv ölçərdi."],
          ["İdeal voltmetrin müqaviməti necə olmalıdır?", "çox böyük (sonsuzluğa yaxın)", ["çox kiçik (sıfıra yaxın)", "dövrənin müqavimətinə bərabər"], "Voltmetr elementə paralel qoşulur. Müqaviməti kiçik olsaydı, özündən böyük cərəyan keçirib dövrəni dəyişərdi."],
          ["Ampermetri rezistora (R₁) paralel qoşsaq, nə baş verər?", "ampermetr rezistoru qısa qapayır, cərəyan ampermetrdən keçir", ["ampermetr düzgün göstərir", "dövrədə cərəyan olmur"], "İdeal ampermetrin müqaviməti 0-dır. Paralel qoşulanda cərəyanın hamısı müqaviməti sıfır olan yoldan keçir, rezistor şuntlanır (qısa qapanma)."],
          ["Voltmetri rezistora ardıcıl qoşsaq nə olar (sadə dövrə)?", "dövrədə cərəyan demək olar yoxdur", ["voltmetr rezistorun gərginliyini göstərir", "dövrədə cərəyan artır"], "Voltmetrin müqaviməti çox böyükdür. Ardıcıl qoşulanda ümumi müqavimət çox böyük olur və cərəyan demək olar yox olur."],
        ];
        const q = pick(Q), ch = shuffle([q[1], ...q[2]]);
        return { text: q[0], choices: ch, correct: ch.indexOf(q[1]), show: q[1], solution: q[3] };
      } },

    { id: "muqavimet", ad: "Naqilin müqaviməti R = ρl/S", izah: "R = ρ·l/S. Burada ρ Ω·mm²/m vahidindədir, uzunluq metrlə, en kəsik mm²-lə: nəticə birbaşa Ω-dur. Cədvəl: mis 0,017; alüminium 0,028; dəmir 0,1; konstantan 0,5; nixrom 1,1.",
      gen() {
        const kind = pick(["R", "R", "l", "S", "rho"]);
        let m, l, s, r, tries = 0;
        do { m = pick(MAT); l = pick([2, 5, 10, 20, 25, 40, 50, 100, 200, 500, 1000]); s = pick([0.1, 0.2, 0.25, 0.5, 1, 1.5, 2, 2.5, 4, 5, 6, 10]); r = m[1] * l / s; tries++; } while ((!nice(r, 3) || r < 0.05 || r > 5000) && tries < 5000);
        const mat = m[0];
        if (kind === "R") return R(r, "Ω", { text: `${l} m uzunluğunda, en kəsiyi ${F(s)} mm² olan ${mat} naqilin müqaviməti neçə Ω-dur? (${mat} üçün ρ = ${F(m[1])} Ω·mm²/m)`, solution: `R = ρl/S = ${F(m[1])}·${l}/${F(s)} = ${F(r)} Ω.` });
        if (kind === "l") return R(l, "m", { text: `En kəsiyi ${F(s)} mm² olan ${mat} naqilin müqaviməti ${F(r)} Ω-dur. Naqilin uzunluğu neçə metrdir? (ρ = ${F(m[1])} Ω·mm²/m)`, solution: `l = R·S/ρ = ${F(r)}·${F(s)}/${F(m[1])} = ${l} m.` });
        if (kind === "S") return R(s, "mm²", { text: `${l} m uzunluğunda ${mat} naqilin müqaviməti ${F(r)} Ω-dur. Naqilin en kəsik sahəsi neçə mm²-dir? (ρ = ${F(m[1])} Ω·mm²/m)`, solution: `S = ρl/R = ${F(m[1])}·${l}/${F(r)} = ${F(s)} mm².` });
        return R(m[1], "Ω·mm²/m", { text: `${l} m uzunluğunda, en kəsiyi ${F(s)} mm² olan naqilin müqaviməti ${F(r)} Ω-dur. Naqilin materialının xüsusi müqaviməti ρ neçə Ω·mm²/m-dir?`, solution: `ρ = R·S/l = ${F(r)}·${F(s)}/${l} = ${F(m[1])} Ω·mm²/m (${mat}).` });
      } },

    { id: "deyisme", ad: "Naqili dəyişəndə", izah: "R ~ l/S. Uzunluq n dəfə artsa R n dəfə artır; sahə n dəfə artsa R n dəfə azalır. Naqili uzadanda həcm V = lS sabit qalır: l ×n → S ÷n → R ×n². Diametr n dəfə artsa, S n² dəfə artır.",
      gen() {
        const kind = pick(["l", "S", "d", "uz", "uz", "kes", "qat", "mat"]);
        const r0 = pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 30, 36, 40, 60]);
        if (kind === "l") { const n = pick([2, 3, 4, 5, 10]), up = Math.random() < .5, r = up ? r0 * n : r0 / n; if (!nice(r, 2)) return levels.find(l => l.id === "deyisme").gen();
          return R(r, "Ω", { text: `Naqilin müqaviməti ${r0} Ω-dur. Eyni materialdan, eyni en kəsikli naqilin uzunluğunu ${n} dəfə ${up ? "artırsaq" : "azaltsaq"} müqavimət neçə Ω olar?`, solution: `R ~ l. Uzunluq ${n} dəfə ${up ? "artdı, R də artır" : "azaldı, R də azalır"}: R = ${r0}${up ? "·" : "/"}${n} = ${F(r)} Ω.` }); }
        if (kind === "S") { const n = pick([2, 3, 4, 5]), up = Math.random() < .5, r = up ? r0 / n : r0 * n; if (!nice(r, 2)) return levels.find(l => l.id === "deyisme").gen();
          return R(r, "Ω", { text: `Naqilin müqaviməti ${r0} Ω-dur. Eyni uzunluqda, eyni materialdan olan, lakin en kəsik sahəsi ${n} dəfə ${up ? "böyük" : "kiçik"} naqilin müqaviməti neçə Ω-dur?`, solution: `R ~ 1/S (tərs mütənasib). Sahə ${n} dəfə ${up ? "artdı → R azalır" : "azaldı → R artır"}: R = ${r0}${up ? "/" : "·"}${n} = ${F(r)} Ω.` }); }
        if (kind === "d") { const n = pick([2, 3, 4]), r = r0 / (n * n); if (!nice(r, 2)) return levels.find(l => l.id === "deyisme").gen();
          return R(r, "Ω", { text: `Müqaviməti ${r0} Ω olan naqili eyni materialdan və eyni uzunluqda, lakin diametri ${n} dəfə böyük olan naqillə əvəz etdilər. Yeni müqavimət neçə Ω-dur?`, solution: `S ~ d² → S ${n * n} dəfə artdı. R ~ 1/S: R = ${r0}/${n * n} = ${F(r)} Ω.` }); }
        if (kind === "uz") { const n = pick([2, 3, 4, 5]), r = r0 * n * n;
          return R(r, "Ω", { text: `Müqaviməti ${r0} Ω olan naqili uzunluğu ${n} dəfə artana qədər dartıb uzatdılar (məftilin həcmi dəyişmir). Yeni müqavimət neçə Ω-dur?`, solution: `Həcm V = l·S sabitdir: l ${n} dəfə artdı → S ${n} dəfə azaldı. R ~ l/S → R ${n}·${n} = ${n * n} dəfə artır: ${r0}·${n * n} = ${F(r)} Ω.` }); }
        if (kind === "kes") { const n = pick([2, 3, 4, 5]), r = r0 / (n * n); if (!nice(r, 2)) return levels.find(l => l.id === "deyisme").gen();
          return R(r, "Ω", { text: `Müqaviməti ${r0} Ω olan məftili ${n} bərabər hissəyə kəsib hissələri yan-yana (paralel) birləşdirdilər və uclarını bir-birinə qaynaq etdilər. Alınan naqilin müqaviməti neçə Ω-dur?`, solution: `Hər hissənin müqaviməti ${r0}/${n}. ${n} eyni hissə paralel: (${r0}/${n})/${n} = ${r0}/${n * n} = ${F(r)} Ω. (Uzunluq ${n} dəfə azaldı, sahə ${n} dəfə artdı.)` }); }
        if (kind === "qat") { const r = r0 / 4; if (!nice(r, 2)) return levels.find(l => l.id === "deyisme").gen();
          return R(r, "Ω", { text: `Müqaviməti ${r0} Ω olan məftili ortadan ikiqat bükdülər və iki ucu bir-birinə qoşdular (iki qat naqil). Alınan naqilin müqaviməti neçə Ω-dur?`, solution: `Uzunluq 2 dəfə azaldı, en kəsik 2 dəfə artdı: R = ${r0}/(2·2) = ${F(r)} Ω.` }); }
        const P = [[["dəmir", 0.1], ["konstantan", 0.5]], [["dəmir", 0.1], ["nixrom", 1.1]], [["konstantan", 0.5], ["nixrom", 1.1]]];
        const [a, b] = pick(P); const r = r0 * b[1] / a[1]; if (!nice(r, 2) || r > 5000) return levels.find(l => l.id === "deyisme").gen();
        return R(r, "Ω", { text: `Eyni ölçülü (uzunluğu və en kəsiyi eyni) ${a[0]} naqilin müqaviməti ${r0} Ω-dur (ρ = ${F(a[1])} Ω·mm²/m). ${b[0][0].toUpperCase() + b[0].slice(1)}dan (ρ = ${F(b[1])} Ω·mm²/m) eyni ölçülü naqilin müqaviməti neçə Ω-dur?`, solution: `R ~ ρ (l və S eynidir). R = ${r0}·${F(b[1])}/${F(a[1])} = ${F(r)} Ω.` });
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let u, r1, r2, i; do { u = pick([6, 12, 18, 24, 36]); r1 = rnd(2, 15); r2 = rnd(2, 15); i = u / (r1 + r2); } while (r1 === r2 || !nice(i, 3) || !nice(i * r2, 3) || !nice(r1 * r2 / (r1 + r2), 3));
          task = `${r1} Ω və ${r2} Ω rezistorları ardıcıl birləşdirilib və ${u} V-a qoşulub. İkinci rezistorun uclarındakı gərginlik (voltmetrin göstərişi) neçə voltdur?`;
          const rp = r1 * r2 / (r1 + r2);
          steps = [
            `Ardıcıl birləşmə: R = R₁ + R₂ = ${r1} + ${r2} = ${r1 + r2} Ω.`,
            `Cərəyan şiddəti: I = U/R = ${u}/${r1 + r2} = ${F(i)} A.`,
            `İkinci rezistorun gərginliyi: U₂ = I·R₂ = ${F(i)}·${r2} = ${F(i * r2)} V.`,
          ];
          if (bad === 0) { steps = [`Ardıcıl birləşmə: R = R₁R₂/(R₁ + R₂) = ${r1}·${r2}/${r1 + r2} = ${F(rp)} Ω.`, `Cərəyan şiddəti: I = U/R = ${u}/${F(rp)} = ${F(u / rp)} A.`, `İkinci rezistorun gərginliyi: U₂ = I·R₂ = ${F(u / rp)}·${r2} = ${F(u / rp * r2)} V.`]; }
          if (bad === 1) { steps[1] = `Cərəyan şiddəti: I = R/U = ${r1 + r2}/${u} = ${F((r1 + r2) / u)} A.`; steps[2] = `İkinci rezistorun gərginliyi: U₂ = I·R₂ = ${F((r1 + r2) / u)}·${r2} = ${F((r1 + r2) / u * r2)} V.`; }
          if (bad === 2) steps[2] = `İkinci rezistorun gərginliyi: U₂ = I·R₁ = ${F(i)}·${r1} = ${F(i * r1)} V.`;
          why = [`1-ci addım: R₁R₂/(R₁ + R₂) paralel birləşmənin düsturudur. Ardıcılda R = ${r1 + r2} Ω, düz cavab ${F(i * r2)} V.`,
            `2-ci addım: Om qanunu I = U/R-dir (tərsi yox). Düz cavab ${F(i * r2)} V.`,
            `3-cü addım: ikinci rezistorun gərginliyi I·R₂-dir (R₂ = ${r2} Ω). Düz cavab ${F(i * r2)} V.`][bad];
        } else {
          const r0 = pick([2, 3, 4, 5, 6, 10, 12]), n = pick([2, 3, 4]);
          const rr = r0 * n * n;
          task = `Müqaviməti ${r0} Ω olan məftili (həcmi dəyişmədən) ${n} dəfə uzadıblar. Yeni müqavimət neçə Ω-dur?`;
          steps = [
            `Həcm V = l·S sabitdir: l ${n} dəfə artdı, deməli S ${n} dəfə azalır.`,
            `R = ρl/S: surətdə l ${n} dəfə artır, məxrəcdə S ${n} dəfə azalır → R ${n}·${n} = ${n * n} dəfə artır.`,
            `R₂ = ${n * n}·${r0} = ${F(rr)} Ω.`,
          ];
          if (bad === 0) { steps[0] = `Naqil uzananda en kəsiyi dəyişmir (S sabitdir).`; steps[1] = `R = ρl/S: yalnız l ${n} dəfə artır → R ${n} dəfə artır.`; steps[2] = `R₂ = ${n}·${r0} = ${F(n * r0)} Ω.`; }
          if (bad === 1) { steps[1] = `R = ρl/S: l ${n} dəfə artdı, S ${n} dəfə azaldı, ikisi bir-birini kompensasiya edir → R dəyişmir.`; steps[2] = `R₂ = ${r0} Ω.`; }
          if (bad === 2) steps[2] = `R₂ = ${n * n}·${r0} = ${F(rr + r0)} Ω.`;
          why = [`1-ci addım: uzananda məftil nazikləşir, həcm sabit qalır → S ${n} dəfə azalır. Düz cavab ${F(rr)} Ω.`,
            `2-ci addım: l artır (surətdə), S azalır (məxrəcdə) — ikisi eyni istiqamətdə təsir edir, R ${n * n} dəfə artır. Düz cavab ${F(rr)} Ω.`,
            `3-cü addım: ${n * n}·${r0} = ${F(rr)}, ${F(rr + r0)} deyil.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Telefon batareyası, yıldırım, elektrik kabeli, qızdırıcı — hamısı I = q/t, Om qanunu və R = ρl/S-dir.",
      gen() {
        const kind = pick(["bat", "ildirim", "kabel", "qiz"]);
        if (kind === "bat") {
          let a, b, t; do { a = pick([2, 3, 4, 5, 6]); b = pick([0.5, 1, 1.5, 2, 3]); t = a / b; } while (!nice(t, 2));
          return R(t, "saat", { text: `Telefon batareyasının tutumu ${a * 1000} mA·saatdır (1 saat ərzində ${a * 1000} mA cərəyan verə bilər). Onu ${F(b)} A cərəyanla boş vəziyyətdən doldururlar. Dolmaq neçə saat çəkər? (İtkiləri nəzərə alma.)`,
            solution: `q = ${a * 1000} mA·saat = ${a} A·saat. t = q/I = ${a}/${F(b)} = ${F(t)} saat.` });
        }
        if (kind === "ildirim") {
          let q, t; do { q = pick([5, 10, 15, 20, 25, 30, 40]); t = pick([1, 2, 4, 5, 10]); } while (!nice(q / t, 2));
          return R(q / t, "kA", { text: `Yıldırım boşalması zamanı ${t} millisaniyə (1 ms = 10⁻³ san) ərzində buluddan yerə ${q} Kl yük keçir. Orta cərəyan şiddəti neçə kiloamperdir (1 kA = 10³ A)?`,
            solution: `I = q/t = ${q}/(${t}·10⁻³) = ${F(q / t * 1000)} A = ${F(q / t)} kA.` });
        }
        if (kind === "kabel") {
          let s, l, r; do { s = pick([1, 1.5, 2.5, 4, 6, 10, 17, 25]); l = pick([10, 50, 100, 200, 500, 1000]); r = 0.017 * l / s; } while (!nice(r, 2) || r < 0.05);
          return R(r, "Ω", { text: `Mis kabelin (ρ = 0,017 Ω·mm²/m) uzunluğu ${l} m, en kəsiyi ${F(s)} mm²-dir. Kabelin müqaviməti neçə Ω-dur?`, solution: `R = ρl/S = 0,017·${l}/${F(s)} = ${F(r)} Ω.` });
        }
        let i, s, l, r; do { i = pick([2, 4, 5, 10]); s = pick([0.1, 0.2, 0.25, 0.5, 1, 1.5, 2]); r = 220 / i; l = r * s / 1.1; } while (!nice(l, 2));
        return R(l, "m", { text: `Elektrik qızdırıcısı 220 V şəbəkədən ${i} A cərəyan alır. Onun spirali en kəsiyi ${F(s)} mm² olan nixrom məftildir (ρ = 1,1 Ω·mm²/m). Məftilin uzunluğu neçə metrdir?`,
          solution: `Spiralin müqaviməti R = U/I = 220/${i} = ${F(r)} Ω. R = ρl/S → l = RS/ρ = ${F(r)}·${F(s)}/1,1 = ${F(l)} m.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-cereyan", title: "Cərəyan, gərginlik, müqavimət", fenn: "fizika", link: "dersler/fiz-cereyan.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (A, V, Ω, m, mm², saat və s.). Onluq kəsr vergül və ya nöqtə ilə: 0,5. ρ-lar Ω·mm²/m vahidindədir.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["cereyan", "cereyan", "om", "cihaz", "muqavimet", "muqavimet", "deyisme", "deyisme", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-cereyan.html")) b.push("dersler/fiz-cereyan.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
