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

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a picture and several steps;
  // the wrong options are the answers of typical mistakes. Question 1 joins "Kinematika" (charge = area under I(t), as
  // the path is the area under v(t)); question 2 joins "Elektrik yükü, Kulon qanunu" (equal spheres share the charge).
  // Pictures are SVG strings (the numbers that are drawn are also named in the text and in the solution).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 3) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const G = (() => {
    const INK = "var(--ink,#17171a)", ACC = "var(--accent,#a32d2d)", MUT = "var(--muted,#6b6b73)", PAP = "var(--paper,#fff)", VEC = "var(--vec,#0c447c)";
    const f = n => +(+n).toFixed(1);
    const line = (x1, y1, x2, y2, c = INK, w = 2) => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
    const wire = pts => `<polyline points="${pts.map(p => f(p[0]) + "," + f(p[1])).join(" ")}" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
    const text = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${f(x)}" y="${f(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
    const dot = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="3.2" fill="${INK}"/>`;
    const meter = (x, y, ch) => `<circle cx="${f(x)}" cy="${f(y)}" r="12" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + text(x, y + 5, ch, "middle", INK, 14);
    const resH = (x, y, lab) => `<rect x="${f(x - 18)}" y="${f(y - 7)}" width="36" height="14" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + (lab ? text(x, y - 12, lab) : "");
    const resV = (x, y, lab) => `<rect x="${f(x - 7)}" y="${f(y - 16)}" width="14" height="32" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + (lab ? text(x + 12, y + 5, lab, "start") : "");
    const bat = (x, y, lab) => line(x - 13, y - 5, x + 13, y - 5, INK, 3) + line(x - 7, y + 5, x + 7, y + 5, INK, 3) + text(x - 17, y - 8, "+", "end", INK, 12) + (lab ? text(x + 20, y + 4, lab, "start") : "");
    const svg = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" class="oy-svg" role="img" aria-label="${aria}">${inner}</svg>`;
    return { INK, ACC, MUT, PAP, VEC, f, line, wire, text, dot, meter, resH, resV, bat, svg };
  })();
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  const sci = n18 => { let p = 18, m = n18; while (m >= 10 - 1e-9) { m /= 10; p++; } while (m < 1 - 1e-9) { m *= 10; p--; } m = +m.toFixed(6); return (m === 1 ? "" : F(m) + "·") + "10" + sup(p); };
  const sciOk = n18 => { if (!(isFinite(n18) && n18 > 0)) return false; let m = n18; while (m >= 10 - 1e-9) m /= 10; while (m < 1 - 1e-9) m *= 10; return nice(m, 2); };

  // 1. I(t) graph: rise during a, constant during b, fall during c (grid 1 san × 1 A)
  function figIt(a, b, c, I0) { const X = t => 40 + t * 16, Y = i => 160 - i * 20; let s = "";
    for (let t = 1; t <= 12; t++) s += G.line(X(t), 160, X(t), Y(6.5), G.MUT, 0.5) + G.text(X(t), 175, t, "middle", G.MUT, 10);
    for (let i = 1; i <= 6; i++) s += G.line(40, Y(i), X(12.5), Y(i), G.MUT, 0.5) + G.text(33, Y(i) + 4, i, "end", G.MUT, 10);
    s += G.line(40, 160, X(13.2), 160) + G.line(40, 160, 40, Y(7.3)) + G.text(X(13.2) + 4, 164, "t, san", "start") + G.text(46, Y(7.2), "I, A", "start");
    s += `<polyline points="${[[0, 0], [a, I0], [a + b, I0], [a + b + c, 0]].map(p => G.f(X(p[0])) + "," + G.f(Y(p[1]))).join(" ")}" fill="none" stroke="${G.ACC}" stroke-width="2.8" stroke-linejoin="round"/>`;
    return svgEl(G.svg(300, 185, s, `Cərəyan şiddətinin zamandan asılılığı: 0-dan ${a} san-yə qədər 0-dan ${I0} A-ə artır, ${a + b} san-yə qədər sabit, ${a + b + c} san-də 0`)); }
  // 2. two equal metal spheres joined by a wire through a switch K
  function figSph(q1, q2) { const sg = q => (q > 0 ? "+" : "−") + Math.abs(q);
    const s = `<circle cx="60" cy="58" r="30" fill="${G.PAP}" stroke="${G.INK}" stroke-width="2"/><circle cx="220" cy="58" r="30" fill="${G.PAP}" stroke="${G.INK}" stroke-width="2"/>`
      + G.text(60, 63, "q₁") + G.text(220, 63, "q₂") + G.line(90, 58, 125, 58) + G.dot(125, 58) + G.line(125, 58, 151, 42) + G.dot(155, 58) + G.line(155, 58, 190, 58) + G.text(140, 32, "K")
      + G.text(60, 112, `q₁ = ${sg(q1)} nKl`) + G.text(220, 112, `q₂ = ${sg(q2)} nKl`);
    return svgEl(G.svg(280, 125, s, `İki eyni metal kürə, yükləri ${sg(q1)} nKl və ${sg(q2)} nKl, K açarı olan naqillə birləşdirilir`)); }
  // 3. wire before and after it is melted and drawn again (radius k times smaller or larger)
  function figCyl(k, thinner) { const cyl = (x1, x2, y, r, c) => `<rect x="${x1}" y="${y - r}" width="${x2 - x1}" height="${2 * r}" fill="${G.PAP}" stroke="${c}" stroke-width="2"/><ellipse cx="${x1}" cy="${y}" rx="${Math.max(2, r / 3)}" ry="${r}" fill="${G.PAP}" stroke="${c}" stroke-width="2"/><ellipse cx="${x2}" cy="${y}" rx="${Math.max(2, r / 3)}" ry="${r}" fill="${G.PAP}" stroke="${c}" stroke-width="2"/>`;
    const r1 = thinner ? 14 : 14 / k, r2 = thinner ? 14 / k : 14, x2 = thinner ? 250 : 90;
    const s = cyl(60, 170, 36, r1, G.INK) + G.line(60, 36, 60, 36 - r1, G.ACC, 2) + G.text(52, 36 - r1 / 2 + 4, "r", "end") + G.text(180, 40, "R₀", "start")
      + G.text(140, 82, "əridilib, yenidən çəkilir ↓", "middle", G.MUT, 11)
      + cyl(40, x2, 122, r2, G.VEC) + G.line(40, 122, 40, 122 - r2, G.ACC, 2) + G.text(32, 122 - r2 / 2 + 4, thinner ? `r/${k}` : `${k}r`, "end") + G.text(x2 + 10, 126, "R = ?", "start");
    return svgEl(G.svg(300, 150, s, `Naqil: radius r, müqavimət R₀; əridilib radiusu ${thinner ? "r/" + k : k + "r"} olan naqil çəkilir`)); }
  // a loop: battery on the left, elements on the top wire, an ammeter on the right wire
  function figLoop(labs) { const y1 = 36, y2 = 154, n = labs.length, xs = n === 1 ? [145] : [110, 190];
    let s = G.wire([[40, 90], [40, y1], [xs[0] - 18, y1]]);
    for (let i = 1; i < n; i++) s += G.wire([[xs[i - 1] + 18, y1], [xs[i] - 18, y1]]);
    s += G.wire([[xs[n - 1] + 18, y1], [250, y1], [250, 83]]) + G.wire([[250, 107], [250, y2], [40, y2], [40, 100]]);
    labs.forEach((l, i) => s += G.resH(xs[i], y1, l));
    return s + G.bat(40, 95, "U") + G.meter(250, 95, "A"); }
  const figSer2 = () => svgEl(G.svg(280, 175, figLoop(["1", "2"]), "Mənbə, ardıcıl birləşmiş 1 və 2 naqilləri, ampermetr"));
  const figOne = () => svgEl(G.svg(280, 175, figLoop(["R"]), "Mənbə, R naqili və ampermetr ardıcıl"));
  // 5. two wires in parallel (drawn thick or thin), ammeter in the main line
  function figPar2(p, k) { const y1 = 36, y2 = 164;
    const s = G.wire([[40, 95], [40, y1], [220, y1], [220, y2], [112, y2]]) + G.wire([[88, y2], [40, y2], [40, 105]]) + G.line(140, y1, 140, y2, G.INK, 2.5) + G.line(220, y1, 220, y2, G.INK, 2.5 * k)
      + G.dot(140, y1) + G.dot(140, y2) + G.text(148, 95, "1", "start") + G.text(148, 112, "l, d", "start", G.MUT, 11)
      + G.text(222 + 1.25 * k + 6, 95, "2", "start") + G.text(222 + 1.25 * k + 6, 112, `${p === 1 ? "" : p}l, ${k}d`, "start", G.MUT, 11) + G.bat(40, 100, "U") + G.meter(100, y2, "A");
    return svgEl(G.svg(280, 185, s, `Paralel iki naqil: 1 (uzunluq l, diametr d) və 2 (uzunluq ${p === 1 ? "" : p}l, diametr ${k}d); ampermetr əsas xətdə`)); }
  // 6. a wire specimen with an ammeter in series and a voltmeter across it
  function figMeas() { const y1 = 64, y2 = 160;
    const s = G.wire([[40, 108], [40, y1], [90, y1]]) + G.line(90, y1, 210, y1, G.ACC, 4) + G.wire([[210, y1], [250, y1], [250, 100]]) + G.wire([[250, 124], [250, y2], [40, y2], [40, 118]])
      + G.wire([[90, y1], [90, 24], [138, 24]]) + G.wire([[162, 24], [210, 24], [210, y1]]) + G.dot(90, y1) + G.dot(210, y1) + G.meter(150, 24, "V") + G.meter(250, 112, "A")
      + G.text(150, y1 + 20, "l, S", "middle", G.MUT, 12) + G.bat(40, 113, "U");
    return svgEl(G.svg(280, 180, s, "Naqil (uzunluq l, en kəsik S), ona ardıcıl ampermetr və paralel voltmetr")); }
  // 7. a wire bent into a square; A and B adjacent or opposite corners
  function figSq(adj) { const bx = 180, by = adj ? 30 : 130;
    const s = `<rect x="80" y="30" width="100" height="100" fill="none" stroke="${G.INK}" stroke-width="2.5"/>` + G.line(80, 30, 46, 30) + G.dot(80, 30) + G.text(42, 35, "A", "end")
      + G.line(bx, by, 214, by) + G.dot(bx, by) + G.text(218, by + 5, "B", "start");
    return svgEl(G.svg(260, 160, s, `Bircins naqildən kvadrat çərçivə; A və B ${adj ? "qonşu" : "qarşı"} təpələrdir`)); }
  // 8. I–U graph: two lines through the origin, each through a marked grid point
  function figIU(p1, p2) { const X = u => 40 + u * 15, Y = i => 160 - i * 22; let s = G.line(40, 160, 235, 160) + G.line(40, 160, 40, 15) + G.text(228, 164, "U, V", "start") + G.text(34, 16, "I, A", "end");
    for (let u = 2; u <= 12; u += 2) s += G.line(X(u), 160, X(u), 22, G.MUT, 0.6) + G.text(X(u), 176, u, "middle", G.MUT, 11);
    for (let i = 1; i <= 6; i++) s += G.line(40, Y(i), 220, Y(i), G.MUT, 0.6) + G.text(32, Y(i) + 4, i, "end", G.MUT, 11);
    [[p1, G.ACC, "1"], [p2, G.VEC, "2"]].forEach(([[u, i], c, n]) => { const k = Math.min(12 / u, 6.5 / i); s += G.line(40, 160, X(u * k), Y(i * k), c, 2.5) + `<circle cx="${X(u)}" cy="${Y(i)}" r="3.5" fill="${c}"/>` + G.text(X(u * k) + 4, Y(i * k) - 4, n, "start", c); });
    return svgEl(G.svg(270, 190, s, `I(U) qrafiki: 1-ci naqil (${p1[0]} V; ${p1[1]} A) nöqtəsindən, 2-ci naqil (${p2[0]} V; ${p2[1]} A) nöqtəsindən keçir`)); }
  // 9. R1 and R2 in parallel, the ammeter in the R1 branch
  function figBr() { const y1 = 36, y2 = 164;
    const s = G.wire([[40, 95], [40, y1], [210, y1], [210, y2], [40, y2], [40, 105]]) + G.line(130, y1, 130, 114) + G.line(130, 138, 130, y2) + G.resV(130, 72, "R₁") + G.meter(130, 126, "A")
      + G.resV(210, 100, "R₂") + G.dot(130, y1) + G.dot(130, y2) + G.bat(40, 100, "U");
    return svgEl(G.svg(260, 185, s, "R₁ və R₂ paralel; ampermetr R₁ qolunda")); }

  const WIRES = []; // wires with a round length: R = ρl/S
  MAT.forEach(m => [0.1, 0.2, 0.25, 0.5, 1, 2].forEach(S => [1, 2, 3, 4, 5, 6, 8, 10, 11, 12, 15, 20, 22].forEach(Rw => { const l = Rw * S / m[1]; if (nice(l, 1) && l >= 0.5 && l <= 400) WIRES.push({ m, S, R: Rw, l: +l.toFixed(1) }); })));
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. charge = area under I(t)  (Kinematika: path = area under v(t))
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const a = rnd(1, 4), b = rnd(1, 4), c = rnd(1, 4), I0 = rnd(1, 6), T = a + b + c; if (T > 12 || T < 3) return null;
      const t1 = rnd(1, T - 1), acc = pick([2, 4]), s = acc * t1 * t1 / 2;
      const Ar = t => t <= a ? I0 * t * t / (2 * a) : t <= a + b ? I0 * a / 2 + I0 * (t - a) : I0 * (a / 2 + b + c / 2) - I0 * (T - t) * (T - t) / (2 * c);
      const It = t1 <= a ? I0 * t1 / a : t1 <= a + b ? I0 : I0 * (T - t1) / c;
      const q = Ar(t1), w = [Ar(T), It * t1, I0 * t1, I0 * t1 / 2];
      if (![q, ...w].every(x => ok2(x))) return null;
      return mc(ae(q, w, U_("Kl")), { svg: figIt(a, b, c, I0), text: `Araba sükunətdən sabit ${acc} m/s² təcillə düzxətli bərabərtəcilli hərəkətə başlayır. Hərəkət başlayan anda arabadakı qurğunun naqilindən cərəyan axmağa başlayır; onun şiddətinin zamandan asılılığı qrafikdə verilib (bir xana: 1 san və 1 A). Araba ${s} m yol gedənədək naqilin en kəsiyindən nə qədər yük keçib?`,
        solution: `1) Kinematika: s = at²/2 → t = √(2s/a) = √(2·${s}/${acc}) = ${t1} san. 2) Qrafikdən: 0–${a} san aralığında cərəyan 0-dan ${I0} A-ədək bərabər artır, ${a}–${a + b} san aralığında ${I0} A-də sabit qalır, ${a + b}–${T} san aralığında 0-a düşür. Sabit cərəyanda q = I·t — bu, I(t) qrafikinin altındakı düzbucaqlının sahəsidir; dəyişən cərəyanda da yük 0-dan t = ${t1} san anınadək qrafikin altındakı sahədir (kinematikada v(t)-nin altındakı sahə yol olduğu kimi). Həmin sahə: q = ${F(q)} Kl. Tələlər: vaxtı hesablamayıb bütün qrafiki götürmək (${F(w[0])} Kl), ${t1}-ci saniyədəki cərəyanı tapılan vaxta vurmaq (${F(w[1])} Kl), ən böyük cərəyanı tapılan vaxta vurmaq (${F(w[2])} Kl), qrafiki üçbucaq saymaq (${F(w[3])} Kl).` });
    }) },
    // 2. two equal spheres share the charge through a wire: average current  (Kulon: q = (q₁ + q₂)/2 each)
    { tip: "qapali", birlesik: "fiz-kulon", gen: () => again(() => {
      const q1 = pick([2, 4, 5, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20]), q2 = pick([-12, -10, -8, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4]), t = pick([1, 2, 4, 5, 8, 10]);
      if (q1 === q2 || q1 + q2 === 0) return null;
      const fin = (q1 + q2) / 2, dq = Math.abs(q1 - q2) / 2, I = dq / t, w = [Math.abs(q1 + q2) / t, Math.abs(q1 - q2) / t, q1 / t, Math.abs(fin) / t];
      if (![I, ...w].every(x => ok2(x))) return null;
      const sg = q => (q > 0 ? "+" : "−") + Math.abs(q);
      return mc(ae(I, w, U_("mA")), { svg: figSph(q1, q2), text: `Eyni ölçülü iki metal kürənin yükləri q₁ = ${sg(q1)} nKl və q₂ = ${sg(q2)} nKl-dur. Kürələr bir-birindən çox uzaqdadır və xarici yüklərdən təcrid olunub (yük yalnız kürələr arasında bölünür); naqilin öz tutumu nəzərə alınmır. K açarını qapadılar və kürələr nazik naqillə birləşdi; yüklərin bərabərləşməsi ${t} mks çəkdi. Bu müddətdə naqildən keçən orta cərəyan şiddəti nə qədərdir? (1 nKl = 10⁻⁹ Kl, 1 mks = 10⁻⁶ san)`,
        solution: `Eyni kürələr yükü bərabər bölür: hər birində (${sg(q1)} ${q2 > 0 ? "+" : "−"} ${Math.abs(q2)})/2 = ${F(fin)} nKl olur. Naqildən keçən yük — bir kürənin yükünün dəyişməsidir: Δq = |${sg(q1)} − (${F(fin)})| = ${F(dq)} nKl. I = Δq/t = ${F(dq)}·10⁻⁹/(${t}·10⁻⁶) = ${F(I)}·10⁻³ A = ${F(I)} mA. Tələlər: yüklərin cəmini götürmək (${F(w[0])} mA), fərqi yarıya bölməmək (${F(w[1])} mA), q₁-in hamısının keçdiyini sanmaq (${F(w[2])} mA), son yükü götürmək (${F(w[3])} mA).` });
    }) },
    // 3. wire melted and drawn with a k times smaller (larger) radius: R × k⁴ (÷ k⁴)
    { tip: "qapali", gen: () => again(() => {
      const k = pick([2, 3]), thin = Math.random() < 0.6, m = pick([1, 2, 3, 4, 5, 6, 8, 10]), R0 = thin ? m : m * k ** 4;
      const right = thin ? R0 * k ** 4 : R0 / k ** 4, w = thin ? [R0 * k * k, R0 * k, R0 * k ** 3, R0] : [R0 / (k * k), R0 / k, R0 / k ** 3, R0];
      if (![right, ...w].every(x => ok2(x))) return null;
      const dir = thin ? "kiçik" : "böyük";
      return mc(ae(right, w, U_("Ω")), { svg: figCyl(k, thin), text: `Silindrik mis naqilin müqaviməti R₀ = ${R0} Ω-dur (eyni temperaturda; xüsusi müqavimət dəyişmir). Naqili əridib, en kəsiyinin radiusu ${k} dəfə ${dir} olan yeni naqil düzəltdilər (misin həcmi dəyişmir). Yeni naqilin müqaviməti nə qədərdir?`,
        solution: `S = πr²: radius ${k} dəfə ${dir} → S ${k * k} dəfə ${dir}. Həcm V = l·S sabitdir → uzunluq ${k * k} dəfə ${thin ? "artır" : "azalır"}. R = ρl/S: ${thin ? `R = R₀·${k * k}·${k * k} = ${R0}·${k ** 4}` : `R = R₀/(${k * k}·${k * k}) = ${R0}/${k ** 4}`} = ${F(right)} Ω. Tələlər: uzunluğun dəyişməsini unutmaq (${F(w[0])} Ω), radiusu sahə kimi götürüb uzunluğun dəyişməsini unutmaq (${F(w[1])} Ω), uzunluğu radius kimi ${k} dəfə dəyişmək (${F(w[2])} Ω), "həcm eynidirsə, R də eynidir" (${R0} Ω).` });
    }) },
    // 4. two wires of different materials in series: R = ρl/S for each, then Ohm's law
    { tip: "qapali", gen: () => again(() => {
      const A = pick(WIRES), B = pick(WIRES); if (A.R === B.R || A.m === B.m) return null;
      const I = pick([0.25, 0.5, 1, 1.5, 2, 2.5, 3]), Rs = A.R + B.R, U = I * Rs; if (!nice(U, 1) || U > 240) return null;
      const w = [U / A.R, U / B.R, U * Rs / (A.R * B.R), Rs / U]; if (![I, ...w].every(x => ok2(x))) return null;
      const d = (n, X) => `${n}-ci naqil: ${X.m[0]} (ρ = ${F(X.m[1])} Ω·mm²/m), l = ${F(X.l)} m, S = ${F(X.S)} mm²`;
      return mc(ae(I, w, U_("A")), { svg: figSer2(), text: `Sxemdə ${d(1, A)}; ${d(2, B)}. Mənbənin gərginliyi U = ${F(U)} V, ampermetr idealdır, birləşdirici naqillərin müqaviməti nəzərə alınmır. Ampermetr nəyi göstərir?`,
        solution: `R₁ = ρ₁l₁/S₁ = ${F(A.m[1])}·${F(A.l)}/${F(A.S)} = ${A.R} Ω; R₂ = ${F(B.m[1])}·${F(B.l)}/${F(B.S)} = ${B.R} Ω. Naqillər ardıcıldır: R = ${A.R} + ${B.R} = ${Rs} Ω. I = U/R = ${F(U)}/${Rs} = ${F(I)} A. Tələlər: yalnız bir naqili götürmək (${F(w[0])} A və ya ${F(w[1])} A), paralel kimi hesablamaq (${F(w[2])} A), I = R/U yazmaq (${F(w[3])} A).` });
    }) },
    // 5. two wires of one material in parallel: the current divides as 1/R, R ~ l/d²
    { tip: "qapali", gen: () => again(() => {
      const p = pick([1, 2, 3, 4, 6]), k = pick([2, 3]); if (p === k * k) return null;
      const I = rnd(1, 20), right = I * p / (k * k + p), w = [I * k * k / (k * k + p), I * p / (k + p), I / 2, I * k / (k + p)];
      if (![right, ...w].every(x => ok2(x))) return null;
      const L = pick([1, 2, 3, 5]), D = pick([0.2, 0.4, 0.5, 1]);
      return mc(ae(right, w, U_("A")), { svg: figPar2(p, k), text: `Eyni materialdan iki naqil paralel birləşdirilib: 1-cinin uzunluğu ${L} m, diametri ${F(D)} mm; 2-cinin uzunluğu ${F(p * L)} m, diametri ${F(k * D)} mm. İdeal ampermetr ${I} A göstərir. 1-ci naqildən keçən cərəyan şiddəti nə qədərdir?`,
        solution: `R = ρl/S, S ~ d². 2-ci naqil ${p === 1 ? "eyni uzunluqdadır" : p + " dəfə uzundur"} və sahəsi ${k * k} dəfə böyükdür: R₁/R₂ = ${(g => k * k / g + (p / g === 1 ? "" : "/" + p / g))(gcd(k * k, p))}. Paraleldə gərginlik eynidir, cərəyan müqavimətə tərs bölünür: I₁ = I·R₂/(R₁ + R₂) = ${I}·${p}/(${k * k} + ${p}) = ${F(right)} A. Tələlər: R₁ ilə R₂-ni qarışdırmaq (${F(w[0])} A), diametri kvadrata yüksəltməmək (${F(w[1])} A), "yarı-yarı" bölmək (${F(I / 2)} A), hər iki səhv birlikdə (${F(w[3])} A).` });
    }) },
    // 6. specific resistance from the readings of an ammeter and a voltmeter
    { tip: "qapali", gen: () => again(() => {
      const m = pick(MAT), l = pick([0.5, 1, 2, 4, 5, 10, 20]), S = pick([0.1, 0.2, 0.25, 0.5, 1]), Rw = m[1] * l / S; if (!nice(Rw, 3)) return null;
      const I = pick([0.2, 0.25, 0.4, 0.5, 1, 1.5, 2]), U = I * Rw; if (!nice(U, 2) || U < 0.5 || U > 60) return null;
      const w = [U / (I * l), U * l / (I * S), U * S / I, I * S / (U * l)]; if (![m[1], ...w].every(x => ok2(x, 4))) return null;
      return mc(ae(m[1], w, U_("Ω·mm²/m")), { svg: figMeas(), text: `Uzunluğu l = ${F(l)} m, en kəsiyi S = ${F(S)} mm² olan naqil sxemdəki kimi qoşulub. İdeal ampermetr ${F(I)} A, ideal voltmetr ${F(U)} V göstərir. Naqilin materialının xüsusi müqaviməti nə qədərdir?`,
        solution: `Voltmetr naqilin uclarındadır, ampermetr ondan keçən cərəyanı ölçür: R = U/I = ${F(U)}/${F(I)} = ${F(Rw)} Ω. R = ρl/S → ρ = RS/l = ${F(Rw)}·${F(S)}/${F(l)} = ${F(m[1])} Ω·mm²/m (${m[0]}). Tələlər: S-i unutmaq (${F(+w[0].toFixed(4))}), l ilə S-in yerini dəyişmək (${F(+w[1].toFixed(4))}), l-i unutmaq (${F(+w[2].toFixed(4))}), R = I/U yazmaq (${F(+w[3].toFixed(4))}).` });
    }) },
    // 7. a wire bent into a square: resistance between adjacent / opposite corners
    { tip: "qapali", minVariety: 15, gen: () => again(() => {
      const R0 = 16 * rnd(1, 12), adj = Math.random() < 0.6, a = R0 / 4;
      const right = adj ? a * 3 * a / (4 * a) : 2 * a / 2, w = adj ? [a, 3 * a, a / 2, R0] : [2 * a, R0, a / 2, 3 * R0 / 16];
      return mc(ae(right, w, U_("Ω")), { svg: figSq(adj), text: `Müqaviməti ${R0} Ω olan bircins naqildən (en kəsiyi hər yerdə eyni) kvadrat çərçivə düzəldilib. A və B ${adj ? "qonşu" : "qarşı"} təpələrdir (şəkil). A və B arasında müqavimət nə qədərdir?`,
        solution: `R ~ l: hər tərəf ${R0}/4 = ${F(a)} Ω. ${adj ? `A-dan B-yə iki yol: bir tərəf (${F(a)} Ω) və üç tərəf (${F(3 * a)} Ω), onlar paraleldir: R = ${F(a)}·${F(3 * a)}/${F(4 * a)} = ${F(right)} Ω (= 3R/16). Tələlər: yalnız qısa yol (${F(a)} Ω), yalnız uzun yol (${F(3 * a)} Ω), yolları bir tərəf sayıb paralel (${F(a / 2)} Ω), bütün naqil (${R0} Ω).`
          : `A-dan B-yə iki yol, hər biri iki tərəf: ${F(2 * a)} Ω; paralel: R = ${F(2 * a)}/2 = ${F(right)} Ω (= R/4). Tələlər: bir yol (${F(2 * a)} Ω), bütün naqil (${R0} Ω), hər yolu bir tərəf sayıb paralel (${F(a / 2)} Ω), qonşu təpələrin düsturu 3R/16 (${F(3 * R0 / 16)} Ω).`}` });
    }) },
    // 8. I–U graph of two wires of the same material and length: S₂ = S₁·R₁/R₂
    { tip: "qapali", gen: () => again(() => {
      const pts = [[2, 4], [2, 2], [4, 2], [6, 2], [6, 3], [12, 6], [12, 4], [12, 3], [10, 2], [8, 4], [9, 3], [4, 4], [6, 4], [8, 2], [12, 2], [4, 1], [8, 1], [6, 1], [12, 1]];
      const p1 = pick(pts), p2 = pick(pts), R1 = p1[0] / p1[1], R2 = p2[0] / p2[1]; if (R1 === R2) return null;
      const S1 = pick([0.5, 1.5, 2, 2.5, 3, 4]), right = S1 * R1 / R2, w = [S1 * R2 / R1, S1, R1 / R2, S1 * (R1 / R2) ** 2];
      if (![right, ...w].every(x => ok2(x))) return null;
      return mc(ae(right, w, U_("mm²")), { svg: figIU(p1, p2), text: `Qrafikdə eyni materialdan və eyni uzunluqda olan 1 və 2 naqillərindən keçən cərəyanın gərginlikdən asılılığı verilib. 1-ci naqilin en kəsiyi ${F(S1)} mm²-dir. 2-ci naqilin en kəsiyi nə qədərdir?`,
        solution: `Qrafikdən: 1-ci düz xətt (${p1[0]} V; ${p1[1]} A) nöqtəsindən keçir → R₁ = ${p1[0]}/${p1[1]} = ${F(R1)} Ω; 2-ci (${p2[0]} V; ${p2[1]} A) → R₂ = ${p2[0]}/${p2[1]} = ${F(R2)} Ω. ρ və l eynidir: R ~ 1/S → S₂ = S₁·R₁/R₂ = ${F(S1)}·${F(R1)}/${F(R2)} = ${F(right)} mm². Tələlər: tərs mütənasibliyi düz götürmək (${F(w[0])} mm²), yalnız nisbəti yazmaq (${F(w[2])}), nisbəti kvadrata yüksəltmək (diametr kimi) (${F(w[3])} mm²).` });
    }) },
    // 9. electrons through a branch in t seconds: I₁ = U/R₁, q = I₁t, N = q/e
    { tip: "qapali", gen: () => again(() => {
      const U = pick([4, 6, 8, 12, 16, 24, 32, 48]), r1 = pick([2, 4, 5, 8, 10, 16, 20]), r2 = pick([2, 4, 5, 8, 10, 16, 20]), t = pick([2, 4, 5, 10, 20]); if (r1 === r2) return null;
      const I1 = U / r1, I2 = U / r2, N = x => x / 0.16; // number of electrons in 10¹⁸
      const right = N(I1 * t), w = [N((I1 + I2) * t), N(I2 * t), N(I1), N(U * t / (r1 + r2))];
      if (![right, ...w].every(sciOk) || !nice(I1, 3)) return null;
      return mc(ae(right, w, sci), { svg: figBr(), text: `Sxemdə U = ${U} V, R₁ = ${r1} Ω, R₂ = ${r2} Ω; mənbə və ampermetr idealdır. ${t} san ərzində R₁ rezistorunun en kəsiyindən neçə elektron keçir? (e = 1,6·10⁻¹⁹ Kl)`,
        solution: `R₁ və R₂ paraleldir: hər birinin gərginliyi U = ${U} V. I₁ = U/R₁ = ${U}/${r1} = ${F(I1)} A (ampermetr bunu göstərir). q = I₁t = ${F(I1)}·${t} = ${F(I1 * t)} Kl. N = q/e = ${F(I1 * t)}/(1,6·10⁻¹⁹) = ${sci(right)}. Tələlər: ümumi cərəyanla hesablamaq (${sci(w[0])}), R₂-nin qolu (${sci(w[1])}), t-yə vurmamaq (${sci(w[2])}), rezistorları ardıcıl saymaq (${sci(w[3])}).` });
    }) },
    // 10. the wire is stretched n times (volume constant) or cut into n parts joined in parallel; the source is the same
    { tip: "qapali", gen: () => again(() => {
      const U = pick([3, 4, 6, 8, 9, 12, 16, 18, 24, 36, 48]), R0 = pick([1, 2, 3, 4, 6, 8, 9, 12, 16, 18, 24]), n = pick([2, 3, 4]), I0 = U / R0, str = Math.random() < 0.5;
      const right = str ? I0 / (n * n) : I0 * n * n, w = str ? [I0 / n, I0 * n * n, I0 * n, I0] : [I0 * n, I0 / (n * n), I0 / n, I0];
      if (![right, ...w].every(x => ok2(x))) return null;
      return mc(ae(right, w, U_("A")), { svg: figOne(), text: `Sxemdə müqaviməti R = ${R0} Ω olan bircins naqil U = ${U} V gərginlikli ideal mənbəyə qoşulub. Naqili ${str ? `həcmini dəyişmədən dartıb ${n} dəfə uzatdılar (materialın xüsusi müqaviməti dəyişmir)` : `${n} bərabər hissəyə kəsib hissələri paralel birləşdirdilər`} və yenə eyni mənbəyə qoşdular. İndi ideal ampermetr nə göstərir?`,
        solution: `Əvvəl: I₀ = U/R = ${U}/${R0} = ${F(I0)} A. ${str ? `Uzadanda həcm sabitdir: l ${n} dəfə artır, S ${n} dəfə azalır → R ${n * n} dəfə artır: R' = ${R0 * n * n} Ω. I = ${U}/${R0 * n * n} = ${F(right)} A. Tələlər: S-in dəyişməsini unutmaq (${F(w[0])} A), istiqaməti səhv (${F(w[1])} A və ${F(w[2])} A), "naqil eynidir" (${F(I0)} A).`
          : `Hər hissə R/${n}, ${n} hissə paralel: R' = R/${n * n} = ${R0}/${n * n} Ω${Number.isInteger(R0 / (n * n)) ? ` = ${F(R0 / (n * n))} Ω` : ""}. I = U/R' = ${U}·${n * n}/${R0} = ${F(right)} A. Tələlər: R-i yalnız ${n} dəfə azaltmaq (${F(w[0])} A), istiqaməti səhv (${F(w[1])} A və ${F(w[2])} A), "naqil eynidir" (${F(I0)} A).`}` });
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
      key: "fiz-cereyan", title: "Cərəyan, gərginlik, müqavimət", fenn: "fizika", link: "dersler/fiz-cereyan.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (A, V, Ω, m, mm², saat və s.). Onluq kəsr vergül və ya nöqtə ilə: 0,5. ρ-lar Ω·mm²/m vahidindədir.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["cereyan", "cereyan", "om", "cihaz", "muqavimet", "muqavimet", "deyisme", "deyisme", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-cereyan.html")) b.push("dersler/fiz-cereyan.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
