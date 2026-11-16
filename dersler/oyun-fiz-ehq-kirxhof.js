// Fizika · EHQ, tam dövr üçün Om qanunu, Kirxhof qaydaları, ölçü cihazları — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units.
(function () {
  const { h } = Oyun;
// Circuit SVG helpers (string based). Shared by lesson build and game files.
const CK = (() => {
  const INK = "var(--ink,#17171a)", ACC = "var(--accent,#a32d2d)", MUT = "var(--muted,#6b6b73)", PAP = "var(--paper,#fff)", VEC = "var(--vec,#0c447c)";
  const f = n => +(+n).toFixed(1);
  const line = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const wire = (pts, c = INK, w = 2) => `<polyline points="${pts.map(p => f(p[0]) + "," + f(p[1])).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const text = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${f(x)}" y="${f(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const dot = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="3.2" fill="${INK}"/>`;
  const arrow = (x1, y1, x2, y2, c = ACC, w = 2.5) => line(x1, y1, x2, y2, c, w, ` marker-end="url(#ck-ar)"`);
  const res = (x, y, d, lab) => d === "h"
    ? `<rect x="${f(x - 18)}" y="${f(y - 7)}" width="36" height="14" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + (lab ? text(x, y - 12, lab) : "")
    : `<rect x="${f(x - 7)}" y="${f(y - 16)}" width="14" height="32" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + (lab ? text(x + 12, y + 5, lab, "start") : "");
  // battery with + plate on top; wires are drawn by the caller with a gap between y-5 and y+5
  const bat = (x, y, lab, side = "r") => line(x - 13, y - 5, x + 13, y - 5, INK, 3) + line(x - 7, y + 5, x + 7, y + 5, INK, 3) + (side === "l" ? text(x + 17, y - 8, "+", "start", INK, 12) : text(x - 17, y - 8, "+", "end", INK, 12))
    + (lab ? (side === "r" ? text(x + 20, y + 4, lab, "start") : text(x - 20, y + 4, lab, "end")) : "");
  const lamp = (x, y, lab, pos) => `<circle cx="${f(x)}" cy="${f(y)}" r="11" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + line(x - 7.5, y - 7.5, x + 7.5, y + 7.5, INK, 1.6) + line(x - 7.5, y + 7.5, x + 7.5, y - 7.5, INK, 1.6) + (lab ? (pos === "r" ? text(x + 17, y + 5, lab, "start") : text(x, y - 17, lab)) : "");
  const meter = (x, y, ch) => `<circle cx="${f(x)}" cy="${f(y)}" r="12" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + text(x, y + 5, ch, "middle", INK, 14);
  // out-of-page (dot) / into-page (cross) symbol
  const sym = (x, y, into, r = 6) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${PAP}" stroke="${INK}" stroke-width="1.6"/>` + (into ? line(x - r * .7, y - r * .7, x + r * .7, y + r * .7, INK, 1.6) + line(x - r * .7, y + r * .7, x + r * .7, y - r * .7, INK, 1.6) : `<circle cx="${f(x)}" cy="${f(y)}" r="2" fill="${INK}"/>`);
  const svg = (w, h, inner, cls, aria) => `<svg viewBox="0 0 ${f(w)} ${f(h)}"${cls ? ` class="${cls}"` : ""} role="img" aria-label="${aria || "Elektrik sxemi"}"><defs><marker id="ck-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  // net: battery + series resistors on the top wire + parallel branches (each branch = list of resistor labels)
  function net(o) {
    const ser = o.ser || [], br = o.br || [], yT = 36, yB = br.length ? 164 : 120, yM = (yT + yB) / 2, bx = 40;
    const sx = ser.map((_, i) => 80 + 60 * i);
    const xs = ser.length ? sx[sx.length - 1] + 50 : 120;
    const bxs = br.map((_, j) => xs + 70 * j);
    const xEnd = br.length ? bxs[bxs.length - 1] : sx[sx.length - 1] + 50;
    let s = wire([[bx, yM - 5], [bx, yT], [xEnd, yT]]) + wire([[bx, yM + 5], [bx, yB], [xEnd, yB]]);
    if (!br.length) s += line(xEnd, yT, xEnd, yB);
    ser.forEach((l, i) => { s += res(sx[i], yT, "h", l); });
    br.forEach((b, j) => {
      const x = bxs[j]; s += line(x, yT, x, yB);
      b.forEach((l, k) => { s += res(x, yT + (yB - yT) * (k + 1) / (b.length + 1), "v", l); });
      if (j < br.length - 1) s += dot(x, yT) + dot(x, yB);
    });
    s += bat(bx, yM, o.U);
    if (o.extra) s += o.extra;
    return svg(xEnd + 40, yB + 34, s, o.cls, o.aria);
  }
  // two-loop circuit: left branch (e1, r1), middle r3, right branch (r2, e2); + plates up
  function twoLoop(o) {
    const yT = 36, yB = 164, x1 = 100, x2 = 190, x3 = 280;
    let s = line(x1, yT, x3, yT) + line(x1, yB, x3, yB) + line(x2, yT, x2, yB) + dot(x2, yT) + dot(x2, yB);
    s += wire([[x1, yT], [x1, 71]]) + wire([[x1, 81], [x1, yB]]) + bat(x1, 76, o.e1, "l") + res(x1, 128, "v", o.r1).replace(/<text[^>]*>.*?<\/text>/, text(x1 - 12, 133, o.r1, "end"));
    s += wire([[x3, yT], [x3, 71]]) + wire([[x3, 81], [x3, yB]]) + bat(x3, 76, o.e2, "r") + res(x3, 128, "v", o.r2);
    s += res(x2, 100, "v", o.r3);
    return svg(x3 + 90, yB + 34, s, o.cls, o.aria || "Ikiconturlu elektrik sxemi");
  }
  return { INK, ACC, MUT, PAP, VEC, f, line, wire, text, dot, arrow, res, bat, lamp, meter, sym, svg, net, twoLoop };
})();

  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const EPS = [1.5, 3, 4.5, 6, 9, 12, 18, 24, 36, 48];
  const RR = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 20];
  const RI = [0.1, 0.2, 0.25, 0.5, 1, 1.5, 2, 3, 4];
  // source (inside a dashed box with its internal resistance r) + external resistor R
  const loop = (eps, r, Rl) => svgEl(CK.svg(290, 170,
    '<rect x="8" y="50" width="164" height="92" rx="6" fill="none" stroke="var(--muted,#6b6b73)" stroke-width="1.5" stroke-dasharray="5 4"/>' +
    CK.wire([[40, 65], [40, 36], [250, 36], [250, 150], [40, 150], [40, 131]]) + CK.line(40, 99, 40, 75) +
    CK.bat(40, 70, "ε = " + eps) + CK.res(40, 115, "v", "r = " + r) + CK.res(180, 36, "h", "R = " + Rl), "oy-svg", "Mənbə daxili müqavimətlə və xarici rezistor R"));
  const shuntFig = (RA, Rsh) => svgEl(CK.svg(280, 150,
    CK.wire([[30, 85], [60, 85]]) + CK.wire([[60, 85], [60, 45], [98, 45]]) + CK.wire([[122, 45], [200, 45], [200, 125], [60, 125], [60, 85]]) + CK.wire([[200, 85], [250, 85]]) +
    CK.meter(110, 45, "A") + CK.text(110, 22, "R_A = " + RA) + CK.res(130, 125, "h", "R_ş = " + Rsh) + CK.dot(60, 85) + CK.dot(200, 85) +
    '<circle cx="30" cy="85" r="4" fill="none" stroke="var(--ink,#17171a)" stroke-width="2"/><circle cx="250" cy="85" r="4" fill="none" stroke="var(--ink,#17171a)" stroke-width="2"/>', "oy-svg", "Ampermetr və paralel şunt"));
  const multFig = (RV, Rd) => svgEl(CK.svg(290, 110,
    CK.wire([[30, 60], [250, 60]]) + CK.meter(100, 60, "V") + CK.res(185, 60, "h", "R_ə = " + Rd) + CK.text(100, 34, "R_V = " + RV) +
    '<circle cx="30" cy="60" r="4" fill="var(--paper,#fff)" stroke="var(--ink,#17171a)" stroke-width="2"/><circle cx="250" cy="60" r="4" fill="var(--paper,#fff)" stroke="var(--ink,#17171a)" stroke-width="2"/>', "oy-svg", "Voltmetr və ardıcıl əlavə müqavimət"));

  const levels = [
    { id: "tamdovre", ad: "I = ε/(R + r)", izah: "Tam dövrə üçün Om qanunu: I = ε/(R + r). R — xarici, r — mənbənin daxili müqavimətidir. Ardıcıl n eyni element: ε-lar və r-lər toplanır; paralel m eyni element: ε eyni, daxili müqavimət r/m.",
      gen() {
        const kind = pick(["I", "I", "eps", "r", "Rx", "ser", "par"]);
        let eps, r, Rv, I;
        if (kind === "I") { do { eps = pick(EPS); r = pick(RI); Rv = pick(RR); I = eps / (Rv + r); } while (!nice(I, 3));
          return R(I, "A", { svg: loop(F(eps) + " V", F(r) + " Ω", F(Rv) + " Ω"), text: `EHQ-si ${F(eps)} V, daxili müqaviməti ${F(r)} Ω olan mənbə ${F(Rv)} Ω-luq rezistora qoşulub. Dövrədəki cərəyan nə qədərdir?`, solution: `I = ε/(R + r) = ${F(eps)}/(${F(Rv)} + ${F(r)}) = ${F(eps)}/${F(Rv + r)} = ${F(I)} A.` }); }
        if (kind === "eps") { do { I = pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]); r = pick(RI); Rv = pick(RR); eps = I * (Rv + r); } while (!nice(eps, 2));
          return R(eps, "V", { svg: loop("?", F(r) + " Ω", F(Rv) + " Ω"), text: `Mənbənin daxili müqaviməti ${F(r)} Ω-dur, ${F(Rv)} Ω-luq rezistora qoşulanda dövrədə ${F(I)} A cərəyan olur. Mənbənin EHQ-si nə qədərdir?`, solution: `ε = I(R + r) = ${F(I)}·(${F(Rv)} + ${F(r)}) = ${F(eps)} V.` }); }
        if (kind === "r") { do { eps = pick(EPS); Rv = pick(RR); r = pick(RI); I = eps / (Rv + r); } while (!nice(I, 3));
          return R(r, "Ω", { text: `EHQ-si ${F(eps)} V olan mənbə ${F(Rv)} Ω-luq rezistora qoşulanda cərəyan ${F(I)} A olur. Mənbənin daxili müqaviməti nə qədərdir?`, solution: `R + r = ε/I = ${F(eps)}/${F(I)} = ${F(eps / I)} Ω. r = ${F(eps / I)} − ${F(Rv)} = ${F(r)} Ω.` }); }
        if (kind === "Rx") { do { eps = pick(EPS); r = pick(RI); Rv = pick(RR); I = eps / (Rv + r); } while (!nice(I, 3));
          return R(Rv, "Ω", { text: `EHQ-si ${F(eps)} V, daxili müqaviməti ${F(r)} Ω olan mənbəyə naməlum rezistor qoşulub, cərəyan ${F(I)} A-dir. Rezistorun müqaviməti nə qədərdir?`, solution: `R + r = ε/I = ${F(eps)}/${F(I)} = ${F(eps / I)} Ω. R = ${F(eps / I)} − ${F(r)} = ${F(Rv)} Ω.` }); }
        if (kind === "ser") { let n; do { n = pick([2, 3, 4]); eps = pick([1.5, 3, 4.5, 6, 2, 1.2]); r = pick([0.1, 0.2, 0.25, 0.5, 1]); Rv = pick(RR); I = n * eps / (Rv + n * r); } while (!nice(I, 3));
          return R(I, "A", { text: `${n} eyni element ardıcıl birləşdirilib: hər birinin EHQ-si ${F(eps)} V, daxili müqaviməti ${F(r)} Ω. Batareya ${F(Rv)} Ω-luq rezistora qoşulub. Cərəyan nə qədərdir?`, solution: `Ardıcılda ε = ${n}·${F(eps)} = ${F(n * eps)} V, r = ${n}·${F(r)} = ${F(n * r)} Ω. I = ${F(n * eps)}/(${F(Rv)} + ${F(n * r)}) = ${F(I)} A.` }); }
        let m; do { m = pick([2, 3, 4, 5]); eps = pick([1.5, 3, 4.5, 6, 12]); r = pick([1, 2, 3, 4, 5, 6]); Rv = pick(RR); I = eps / (Rv + r / m); } while (!nice(I, 3) || !nice(r / m, 3));
        return R(I, "A", { text: `${m} eyni element paralel birləşdirilib: hər birinin EHQ-si ${F(eps)} V, daxili müqaviməti ${F(r)} Ω. Batareya ${F(Rv)} Ω-luq rezistora qoşulub. Cərəyan nə qədərdir?`, solution: `Paralelda ε = ${F(eps)} V qalır, daxili müqavimət r/${m} = ${F(r / m)} Ω. I = ${F(eps)}/(${F(Rv)} + ${F(r / m)}) = ${F(I)} A.` });
      } },
    { id: "gerginlik", ad: "Gərginlik, qısa qapanma", izah: "Mənbənin qütblərindəki gərginlik U = ε − Ir = IR. Açıq dövrədə U = ε. Qısa qapanmada R = 0 və I = ε/r. Daxili müqaviməti iki rejimdən tapmaq olar.",
      gen() {
        const kind = pick(["Uq", "UR", "qisa", "r2", "eps2", "Ur"]);
        let eps, r, Rv, I;
        if (kind === "Uq") { do { eps = pick(EPS); r = pick(RI); I = pick([0.5, 1, 2, 2.5, 3, 4, 5]); } while (!nice(eps - I * r, 2) || eps - I * r <= 0);
          return R(eps - I * r, "V", { text: `Mənbənin EHQ-si ${F(eps)} V, daxili müqaviməti ${F(r)} Ω-dur. Dövrədən ${F(I)} A cərəyan keçəndə mənbənin qütblərindəki gərginlik nə qədərdir?`, solution: `U = ε − I·r = ${F(eps)} − ${F(I)}·${F(r)} = ${F(eps)} − ${F(I * r)} = ${F(eps - I * r)} V.` }); }
        if (kind === "UR") { do { eps = pick(EPS); r = pick(RI); Rv = pick(RR); } while (!nice(eps * Rv / (Rv + r), 3));
          return R(eps * Rv / (Rv + r), "V", { text: `EHQ-si ${F(eps)} V, daxili müqaviməti ${F(r)} Ω olan mənbə ${F(Rv)} Ω-luq rezistora qoşulub. Rezistorun uclarındakı gərginlik (mənbənin qütblərindəki gərginlik) nə qədərdir?`, solution: `I = ${F(eps)}/(${F(Rv)} + ${F(r)}) = ${F(eps / (Rv + r))} A. U = I·R = ${F(eps / (Rv + r))}·${F(Rv)} = ${F(eps * Rv / (Rv + r))} V.` }); }
        if (kind === "qisa") { do { eps = pick([1.5, 3, 4.5, 6, 9, 12, 24]); r = pick([0.05, 0.1, 0.2, 0.25, 0.5, 1, 1.5, 2]); I = eps / r; } while (!nice(I, 2));
          return R(I, "A", { text: `EHQ-si ${F(eps)} V, daxili müqaviməti ${F(r)} Ω olan mənbənin qütblərini müqaviməti sıfır olan məftillə birləşdirdilər (qısa qapanma). Dövrədəki cərəyan nə qədərdir?`, solution: `Qısa qapanmada R = 0: I = ε/r = ${F(eps)}/${F(r)} = ${F(I)} A.` }); }
        if (kind === "r2" || kind === "eps2") {
          let R1, R2, I1, I2; do { eps = pick([3, 6, 9, 12, 24]); r = pick([0.5, 1, 2]); R1 = pick([1, 2, 3, 4, 5, 6, 8]); R2 = pick([3, 4, 5, 6, 8, 10, 12, 15]); I1 = eps / (R1 + r); I2 = eps / (R2 + r); } while (R1 >= R2 || !nice(I1, 3) || !nice(I2, 3));
          const base = `Mənbəyə ${R1} Ω-luq rezistor qoşanda dövrədəki cərəyan ${F(I1)} A, ${R2} Ω-luq rezistor qoşanda ${F(I2)} A olur. `;
          const sol = `ε = I₁(R₁ + r) = I₂(R₂ + r) → ${F(I1)}(${R1} + r) = ${F(I2)}(${R2} + r) → ${F(I1 * R1)} + ${F(I1)}r = ${F(I2 * R2)} + ${F(I2)}r → r = (${F(I2 * R2)} − ${F(I1 * R1)})/(${F(I1)} − ${F(I2)}) = ${F(r)} Ω.`;
          if (kind === "r2") return R(r, "Ω", { text: base + "Mənbənin daxili müqaviməti nə qədərdir?", solution: sol });
          return R(eps, "V", { text: base + "Mənbənin EHQ-si nə qədərdir?", solution: sol + ` ε = ${F(I1)}·(${R1} + ${F(r)}) = ${F(eps)} V.` });
        }
        let U; do { eps = pick([1.5, 3, 4.5, 6, 9, 12]); r = pick([0.2, 0.25, 0.5, 1, 1.5, 2]); I = pick([0.5, 1, 2, 3, 4]); U = eps - I * r; } while (!nice(U, 2) || U <= 0);
        return R(r, "Ω", { text: `Açıq dövrədə voltmetr mənbənin qütblərində ${F(eps)} V göstərir. Mənbəyə yük qoşulanda cərəyan ${F(I)} A, voltmetr isə ${F(U)} V göstərir. Mənbənin daxili müqaviməti nə qədərdir?`, solution: `Açıq dövrədə U = ε = ${F(eps)} V. Yüklə: U = ε − I·r → r = (ε − U)/I = (${F(eps)} − ${F(U)})/${F(I)} = ${F(r)} Ω.` });
      } },
    { id: "guc", ad: "Güc və FİƏ", izah: "Xarici rezistorda güc P = I²R. Maksimum güc R = r olanda: P_max = ε²/(4r), FİƏ isə 50%. Mənbənin tam gücü εI, daxildə itkisi I²r, FİƏ η = R/(R + r).",
      gen() {
        const kind = pick(["P", "Pmax", "eta", "eq", "Rsr", "Pin", "Ptot"]);
        let eps, r, Rv, I;
        if (kind === "P") { do { eps = pick(EPS); r = pick(RI); Rv = pick(RR); I = eps / (Rv + r); } while (!nice(I, 3) || !nice(I * I * Rv, 2));
          return R(I * I * Rv, "W", { text: `EHQ-si ${F(eps)} V, daxili müqaviməti ${F(r)} Ω olan mənbə ${F(Rv)} Ω-luq rezistora qoşulub. Rezistorda ayrılan güc nə qədərdir?`, solution: `I = ε/(R + r) = ${F(I)} A. P = I²R = ${F(I * I)}·${F(Rv)} = ${F(I * I * Rv)} W.` }); }
        if (kind === "Pmax") { do { eps = pick([6, 9, 12, 18, 24, 36]); r = pick([1, 2, 3, 4, 6, 9]); } while (!nice(eps * eps / (4 * r), 2));
          return R(eps * eps / (4 * r), "W", { text: `EHQ-si ${eps} V, daxili müqaviməti ${r} Ω olan mənbəyə dəyişən müqavimətli rezistor (reostat) qoşulub. Reostatda ayrıla biləcək ən böyük güc nə qədərdir?`, solution: `Maksimum güc R = r = ${r} Ω olanda alınır: I = ε/(2r) = ${F(eps / (2 * r))} A, P_max = ε²/(4r) = ${eps * eps}/${4 * r} = ${F(eps * eps / (4 * r))} W.` }); }
        if (kind === "eta") { do { Rv = pick([1, 2, 3, 4, 5, 6, 8, 9, 12, 15, 19, 24, 49]); r = pick([1, 2, 3, 4, 6, 1, 1]); } while (!nice(100 * Rv / (Rv + r), 1));
          return R(100 * Rv / (Rv + r), "%", { text: `Daxili müqaviməti ${r} Ω olan mənbə ${Rv} Ω-luq rezistora qoşulub. Mənbənin faydalı iş əmsalı (xarici rezistorda ayrılan gücün tam gücə nisbəti) neçə faizdir?`, solution: `η = P_xarici/P_tam = I²R/(I²(R + r)) = R/(R + r) = ${Rv}/${Rv + r} = ${F(Rv / (Rv + r))} = ${F(100 * Rv / (Rv + r))}%.` }); }
        if (kind === "eq") { const pr = pick([[1, 4], [2, 8], [4, 9], [1, 9], [3, 12], [2, 18], [5, 20], [1, 16], [4, 16], [9, 16]]);
          return R(Math.sqrt(pr[0] * pr[1]), "Ω", { text: `Mənbəyə ${pr[0]} Ω-luq rezistor qoşulanda da, ${pr[1]} Ω-luq rezistor qoşulanda da rezistorlarda eyni güc ayrılır. Mənbənin daxili müqaviməti nə qədərdir?`,
            solution: `P = ε²R/(R + r)². Güclər bərabərdirsə: R₁/(R₁ + r)² = R₂/(R₂ + r)². Sadələşdirsək r² = R₁R₂. r = √(${pr[0]}·${pr[1]}) = √${pr[0] * pr[1]} = ${Math.sqrt(pr[0] * pr[1])} Ω.` }); }
        if (kind === "Rsr") { let R0; do { r = pick([1, 2, 3, 4, 5]); R0 = pick([1, 2, 3, 4, 6]); } while (false);
          return R(r + R0, "Ω", { text: `Daxili müqaviməti ${r} Ω olan mənbəyə ardıcıl olaraq ${R0} Ω-luq rezistor və dəyişən reostat qoşulub. Reostatda ayrılan güc ən böyük olması üçün onun müqaviməti nə qədər olmalıdır?`, solution: `Reostata nəzərən mənbənin ümumi daxili müqaviməti r + R₀ = ${r} + ${R0} = ${r + R0} Ω-dur. Maksimum güc R = r + R₀ = ${r + R0} Ω olanda alınır.` }); }
        if (kind === "Pin") { do { eps = pick(EPS); r = pick(RI); Rv = pick(RR); I = eps / (Rv + r); } while (!nice(I, 3) || !nice(I * I * r, 3));
          return R(I * I * r, "W", { text: `EHQ-si ${F(eps)} V, daxili müqaviməti ${F(r)} Ω olan mənbə ${F(Rv)} Ω-luq rezistora qoşulub. Mənbənin daxilində (r üzərində) istilik kimi itən güc nə qədərdir?`, solution: `I = ε/(R + r) = ${F(I)} A. P_daxili = I²r = ${F(I * I)}·${F(r)} = ${F(I * I * r)} W.` }); }
        do { eps = pick(EPS); r = pick(RI); Rv = pick(RR); I = eps / (Rv + r); } while (!nice(I, 3) || !nice(eps * I, 3));
        return R(eps * I, "W", { text: `EHQ-si ${F(eps)} V, daxili müqaviməti ${F(r)} Ω olan mənbə ${F(Rv)} Ω-luq rezistora qoşulub. Mənbənin tam gücü (ε·I) nə qədərdir?`, solution: `I = ${F(eps)}/(${F(Rv)} + ${F(r)}) = ${F(I)} A. P_tam = ε·I = ${F(eps)}·${F(I)} = ${F(eps * I)} W.` });
      } },
    { id: "kirxhof", ad: "Kirxhof qaydaları", izah: "Düyün qaydası: düyünə daxil olan cərəyanların cəmi çıxanların cəminə bərabərdir. Kontur qaydası: konturu gəzəndə EHQ-lərin cəbri cəmi = IR-lərin cəbri cəmi. Aşağıdakı sxemdə hər iki elementin müsbət qütbü yuxarıdır; I₁ və I₂ yuxarı, I₃ aşağı axır.",
      gen() {
        const kind = pick(["I3", "I3", "I1", "U3", "duyun", "P3", "neg"]);
        if (kind === "duyun") { let a, b, c; do { a = rnd(1, 8); b = rnd(1, 8); c = rnd(1, 6); } while (a + b - c <= 0);
          return R(a + b - c, "A", { text: `Düyünə iki naqil daxil olur: onlarda ${a} A və ${b} A cərəyan var. Düyündən iki naqil çıxır, birində ${c} A cərəyan var. İkinci çıxan naqildə cərəyan nə qədərdir?`, solution: `Daxil olan cərəyanların cəmi çıxanların cəminə bərabərdir: ${a} + ${b} = ${c} + I → I = ${a + b} − ${c} = ${a + b - c} A.` }); }
        let r1, r2, r3, I1, I2, e1, e2, I3;
        do { r1 = rnd(1, 8); r2 = rnd(1, 8); r3 = rnd(1, 8); I1 = rnd(1, 5); I2 = rnd(1, 5); if (kind === "neg") { I1 = rnd(3, 6); I2 = -rnd(1, 2); } I3 = I1 + I2; e1 = I1 * r1 + I3 * r3; e2 = I2 * r2 + I3 * r3; } while (e1 > 60 || e2 > 60 || e1 <= 0 || e2 <= 0 || e1 === e2 || (r1 === r2 && I1 === I2));
        const svg = svgEl(CK.twoLoop({ e1: "ε₁ = " + e1 + " V", e2: "ε₂ = " + e2 + " V", r1: "R₁ = " + r1 + " Ω", r2: "R₂ = " + r2 + " Ω", r3: "R₃ = " + r3 + " Ω", cls: "oy-svg" }));
        const base = `Sxemdə elementlərin daxili müqaviməti yoxdur: ε₁ = ${e1} V, ε₂ = ${e2} V, R₁ = ${r1} Ω, R₂ = ${r2} Ω, R₃ = ${r3} Ω. Hər iki elementin müsbət qütbü yuxarıdır. `;
        const sol = `Düyün: I₃ = I₁ + I₂. Sol kontur: ε₁ = I₁R₁ + I₃R₃. Sağ kontur: ε₂ = I₂R₂ + I₃R₃. Əvəz edib həll edəndə: I₁ = ${I1} A, I₂ = ${I2} A, I₃ = ${I3} A. Yoxla: ${I1}·${r1} + ${I3}·${r3} = ${e1} ✓, ${I2}·${r2} + ${I3}·${r3} = ${e2} ✓.`;
        if (kind === "neg") return R(I2, "A", { svg, text: base + "I₁ və I₂ yuxarı, I₃ aşağı istiqamətdə qəbul olunub. Sağ qoldakı (R₂ üzərindən keçən) I₂ cərəyanını işarəsi ilə yaz. Mənfi cavab nəyi göstərir?", solution: sol + ` I₂ = ${I2} A < 0: bu cərəyan seçilmiş (yuxarı) istiqamətin əksinə, yəni aşağı axır; element ε₂ bu halda doldurulur.` });
        if (kind === "I1") return R(I1, "A", { svg, text: base + "Sol qoldakı (R₁ üzərindən keçən) cərəyan nə qədərdir?", solution: sol });
        if (kind === "U3") return R(I3 * r3, "V", { svg, text: base + "Orta qolda R₃ rezistorunun uclarındakı gərginlik nə qədərdir?", solution: sol + ` U₃ = I₃R₃ = ${I3}·${r3} = ${I3 * r3} V.` });
        if (kind === "P3") return R(I3 * I3 * r3, "W", { svg, text: base + "Orta qolda R₃ rezistorunda ayrılan güc nə qədərdir?", solution: sol + ` P₃ = I₃²R₃ = ${I3 * I3}·${r3} = ${I3 * I3 * r3} W.` });
        return R(I3, "A", { svg, text: base + "Orta qoldan (R₃ üzərindən) keçən cərəyan nə qədərdir?", solution: sol });
      } },
    { id: "olcu", ad: "Ampermetr, voltmetr, şunt", izah: "Ampermetrin diapazonunu genişləndirmək üçün ona paralel şunt qoşulur: R_ş = R_A/(n − 1), n = I/I_A. Voltmetrin diapazonu üçün ona ardıcıl əlavə müqavimət: R_ə = R_V(n − 1), n = U/U_V.",
      gen() {
        const kind = pick(["sh1", "sh2", "mul1", "mul2", "mA", "mV"]);
        if (kind === "sh1") { let RA, n, Rs; do { RA = pick([0.5, 1, 1.2, 2, 3, 4.5, 5, 9]); n = pick([2, 3, 4, 5, 6, 10, 11]); Rs = RA / (n - 1); } while (!nice(Rs, 3));
          return R(Rs, "Ω", { svg: shuntFig(F(RA) + " Ω", "?"), text: `Ampermetrin müqaviməti ${F(RA)} Ω-dur. Onun ölçmə diapazonunu ${n} dəfə artırmaq üçün ampermetrə paralel hansı müqavimətli şunt qoşmaq lazımdır?`, solution: `Şuntdan (n − 1) dəfə çox cərəyan keçməlidir, ona görə müqavimət (n − 1) dəfə kiçikdir: R_ş = R_A/(n − 1) = ${F(RA)}/${n - 1} = ${F(Rs)} Ω.` }); }
        if (kind === "sh2") { let RA, IA, I, Rs; do { RA = pick([1, 2, 3, 4.5, 5, 9, 10]); IA = pick([0.01, 0.02, 0.05, 0.1, 0.2, 0.5]); I = pick([0.5, 1, 2, 5, 10]); Rs = IA * RA / (I - IA); } while (I <= IA || !nice(Rs, 3) || Rs < 0.001);
          return R(Rs, "Ω", { svg: shuntFig(F(RA) + " Ω", "?"), text: `Ampermetr ən çox ${F(IA)} A ölçür, müqaviməti ${F(RA)} Ω-dur. Onunla ${F(I)} A-ə qədər cərəyan ölçmək üçün şuntun müqaviməti nə qədər olmalıdır?`, solution: `Şuntdan keçən cərəyan I − I_A = ${F(I)} − ${F(IA)} = ${F(I - IA)} A. Gərginlik eynidir: I_A·R_A = (I − I_A)·R_ş → R_ş = ${F(IA)}·${F(RA)}/${F(I - IA)} = ${F(Rs)} Ω.` }); }
        if (kind === "mul1") { let RV, n, Rd; do { RV = pick([1000, 2000, 3000, 5000, 10000, 20000]); n = pick([2, 3, 4, 5, 10, 15, 20]); Rd = RV * (n - 1); } while (false);
          return R(Rd, "Ω", { svg: multFig(F(RV) + " Ω", "?"), text: `Voltmetrin müqaviməti ${F(RV)} Ω-dur. Onun ölçmə diapazonunu ${n} dəfə artırmaq üçün voltmetrə ardıcıl hansı müqavimət qoşmaq lazımdır?`, solution: `Ümumi müqavimət n·R_V olmalıdır (cərəyan eyni, gərginlik n dəfə çox). R_ə = (n − 1)R_V = ${n - 1}·${F(RV)} = ${F(Rd)} Ω.` }); }
        if (kind === "mul2") { let RV, UV, U, Rd; do { RV = pick([500, 1000, 2000, 3000, 5000, 10000]); UV = pick([1, 1.5, 2, 3, 5, 6]); U = pick([6, 10, 12, 15, 30, 60, 100]); Rd = RV * (U / UV - 1); } while (U <= UV || !nice(Rd, 2));
          return R(Rd, "Ω", { svg: multFig(F(RV) + " Ω", "?"), text: `Voltmetr ən çox ${F(UV)} V ölçür, müqaviməti ${F(RV)} Ω-dur. Onunla ${F(U)} V-a qədər gərginlik ölçmək üçün ardıcıl qoşulan əlavə müqavimət nə qədər olmalıdır?`, solution: `Voltmetrdən ən çox I = U_V/R_V = ${F(UV)}/${F(RV)} = ${F(UV / RV)} A keçə bilər. Ümumi müqavimət U/I = ${F(U)}/${F(UV / RV)} = ${F(U / (UV / RV))} Ω. R_ə = ${F(U / (UV / RV))} − ${F(RV)} = ${F(Rd)} Ω.` }); }
        if (kind === "mA") { let RA, Rs, IA, I; do { RA = pick([1, 2, 3, 4, 5, 9]); Rs = pick([0.1, 0.25, 0.5, 1, 0.5]); IA = pick([0.1, 0.2, 0.25, 0.5, 1, 2]); I = IA * (1 + RA / Rs); } while (!nice(I, 3));
          return R(I, "A", { svg: shuntFig(F(RA) + " Ω", F(Rs) + " Ω"), text: `Müqaviməti ${F(RA)} Ω olan ampermetrə ${F(Rs)} Ω-luq şunt qoşulub. Ampermetr ${F(IA)} A göstərir. Əsas dövrədəki ümumi cərəyan nə qədərdir?`, solution: `Gərginlik: U = I_A·R_A = ${F(IA)}·${F(RA)} = ${F(IA * RA)} V. Şuntdan: ${F(IA * RA)}/${F(Rs)} = ${F(IA * RA / Rs)} A. Ümumi: ${F(IA)} + ${F(IA * RA / Rs)} = ${F(I)} A.` }); }
        let RV, Rd, UV, U; do { RV = pick([1000, 2000, 3000, 5000, 10000]); Rd = pick([1000, 2000, 4000, 9000, 12000, 20000]); UV = pick([1, 1.5, 2, 3, 4, 5]); U = UV * (1 + Rd / RV); } while (!nice(U, 2));
        return R(U, "V", { svg: multFig(F(RV) + " Ω", F(Rd) + " Ω"), text: `Müqaviməti ${F(RV)} Ω olan voltmetrə ardıcıl ${F(Rd)} Ω-luq əlavə müqavimət qoşulub. Voltmetr ${F(UV)} V göstərir. Bütün qola verilən gərginlik nə qədərdir?`, solution: `I = ${F(UV)}/${F(RV)} = ${F(UV / RV)} A. U = I·(R_V + R_ə) = ${F(UV / RV)}·${F(RV + Rd)} = ${F(U)} V.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let eps, r, Rv, I; do { eps = pick(EPS); r = pick([0.5, 1, 2]); Rv = pick([3, 4, 5, 6, 8, 9, 10]); I = eps / (Rv + r); } while (!nice(I, 3));
          task = `EHQ-si ${F(eps)} V, daxili müqaviməti ${F(r)} Ω olan mənbə ${Rv} Ω-luq rezistora qoşulub. Mənbənin qütblərindəki gərginlik neçə voltdur?`;
          const U = I * Rv;
          steps = [`Tam dövrə üçün Om qanunu: I = ε/(R + r) = ${F(eps)}/(${Rv} + ${F(r)}) = ${F(I)} A.`, `Qütblərdəki gərginlik xarici rezistorun gərginliyidir: U = I·R.`, `U = ${F(I)}·${Rv} = ${F(U)} V.`];
          if (bad === 0) { const w = eps / Rv; steps = [`Om qanunu: I = ε/R = ${F(eps)}/${Rv} = ${F(+w.toFixed(4))} A.`, `Qütblərdəki gərginlik xarici rezistorun gərginliyidir: U = I·R.`, `U = ${F(+w.toFixed(4))}·${Rv} = ${F(eps)} V.`]; }
          if (bad === 1) { steps[1] = `Qütblərdəki gərginlik EHQ-yə bərabərdir: U = ε.`; steps[2] = `U = ${F(eps)} V.`; }
          if (bad === 2) steps[2] = `U = ${F(I)}·${Rv} = ${F(+(U + I).toFixed(4))} V.`;
          why = [`1-ci addım: daxili müqavimət də dövrədədir, məxrəc R + r-dir. Düz: I = ${F(I)} A, U = ${F(U)} V.`, `2-ci addım: U = ε yalnız açıq dövrədə (I = 0) doğrudur. Yük olanda U = ε − Ir = IR. Düz cavab: ${F(U)} V.`, `3-cü addım: ${F(I)}·${Rv} = ${F(U)}, hesablama səhvi var.`][bad];
        } else {
          let IA, RA, I, Rs; do { IA = pick([0.05, 0.1, 0.2, 0.25, 0.5]); RA = pick([2, 3, 4, 5, 9, 10, 15]); I = pick([1, 2, 5]); Rs = IA * RA / (I - IA); } while (!nice(Rs, 3) || Rs < 0.01);
          task = `Ampermetr ən çox ${F(IA)} A ölçür, müqaviməti ${RA} Ω-dur. Onunla ${I} A-ə qədər cərəyan ölçmək üçün ona paralel şunt qoşulur. Şuntun müqaviməti neçə Ω olmalıdır?`;
          const Ish = I - IA;
          steps = [`Şuntdan keçən cərəyan: I_ş = I − I_A = ${I} − ${F(IA)} = ${F(Ish)} A.`, `Paralelda gərginlik eynidir: I_A·R_A = I_ş·R_ş.`, `R_ş = I_A·R_A/I_ş = ${F(IA)}·${RA}/${F(Ish)} = ${F(Rs)} Ω.`];
          if (bad === 0) { const w = IA * RA / I; steps = [`Şuntdan keçən cərəyan: I_ş = I = ${I} A.`, `Paralelda gərginlik eynidir: I_A·R_A = I_ş·R_ş.`, `R_ş = I_A·R_A/I = ${F(IA)}·${RA}/${I} = ${F(+w.toFixed(4))} Ω.`]; }
          if (bad === 1) { const w = Ish * RA / IA; steps[1] = `Paralelda cərəyanlar bərabərdir: I_A·R_ş = I_ş·R_A.`; steps[2] = `R_ş = I_ş·R_A/I_A = ${F(Ish)}·${RA}/${F(IA)} = ${F(+w.toFixed(4))} Ω.`; }
          if (bad === 2) steps[2] = `R_ş = I_A·R_A/I_ş = ${F(IA)}·${RA}/${F(Ish)} = ${F(+(Rs * 2).toFixed(4))} Ω.`;
          why = [`1-ci addım: ampermetrdən I_A keçir, şuntdan qalan hissə: I − I_A. Düz cavab: ${F(Rs)} Ω.`, `2-ci addım: paralelda eyni olan şey gərginlikdir (cərəyanlar yox): I_A·R_A = I_ş·R_ş. Düz cavab: ${F(Rs)} Ω.`, `3-cü addım: ${F(IA)}·${RA}/${F(Ish)} = ${F(Rs)}, hesablama səhvi var.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Avtomobil akkumulyatoru, fənər, qısa qapanma — hamısı tam dövrə üçün Om qanunudur.",
      gen() {
        const kind = pick(["avto", "qisa", "fener", "ters"]);
        let eps, r, Rv, I;
        if (kind === "avto") { do { eps = 12; r = pick([0.02, 0.04, 0.05, 0.1]); Rv = pick([0.06, 0.08, 0.1, 0.16, 0.2, 0.3, 0.46]); I = eps / (Rv + r); } while (!nice(I, 2));
          return R(I, "A", { text: `Avtomobil akkumulyatorunun EHQ-si 12 V, daxili müqaviməti ${F(r)} Ω-dur. Mühərriki işə salan starterin müqaviməti ${F(Rv)} Ω-dur. Starterdən keçən cərəyan nə qədərdir?`, solution: `I = ε/(R + r) = 12/(${F(Rv)} + ${F(r)}) = 12/${F(Rv + r)} = ${F(I)} A. (Böyük cərəyan: ona görə akkumulyator çox “güclü” olmalıdır.)` }); }
        if (kind === "qisa") { do { eps = 12; r = pick([0.01, 0.02, 0.025, 0.04, 0.05]); I = eps / r; } while (!nice(I, 1));
          return R(I, "A", { text: `Avtomobil akkumulyatorunun EHQ-si 12 V, daxili müqaviməti ${F(r)} Ω-dur. Onun qütblərini qalın mis açarla (müqaviməti ≈ 0) birləşdirdilər. Cərəyan nə qədər olar?`, solution: `Qısa qapanma: I = ε/r = 12/${F(r)} = ${F(I)} A. Belə cərəyan açarı qızdırıb əridə, yanğın törədə bilər, ona görə akkumulyatorun qütblərini qısa qapamaq olmaz.` }); }
        if (kind === "fener") { do { eps = pick([3, 4.5, 6, 9]); r = pick([0.5, 1, 1.5, 2]); Rv = pick([4, 5, 6, 8, 10, 12]); } while (!nice(eps * Rv / (Rv + r), 2) || !nice(eps / (Rv + r), 3));
          const U = eps * Rv / (Rv + r);
          return R(r, "Ω", { text: `Fənərin batareyası açıq dövrədə ${F(eps)} V göstərir. ${F(Rv)} Ω müqavimətli lampanı qoşanda voltmetr batareyanın qütblərində ${F(U)} V göstərir. Batareyanın daxili müqaviməti nə qədərdir?`, solution: `Lampadan I = U/R = ${F(U)}/${F(Rv)} = ${F(U / Rv)} A keçir. Daxildə itən gərginlik ε − U = ${F(eps - U)} V. r = (ε − U)/I = ${F(eps - U)}/${F(U / Rv)} = ${F(r)} Ω.` }); }
        let n; do { n = pick([4, 5, 6, 8]); eps = pick([1.5, 3, 2]); r = pick([0.5, 1, 0.25, 0.2]); Rv = pick([2, 3, 4, 5, 6, 8, 10]); I = (n - 2) * eps / (Rv + n * r); } while (!nice(I, 3));
        return R(I, "A", { text: `${n} eyni element ardıcıl birləşdirilib (hər birinin EHQ-si ${F(eps)} V, daxili müqaviməti ${F(r)} Ω), amma bunlardan biri səhvən tərs qoşulub (qütbləri dəyişib). Batareya ${F(Rv)} Ω-luq rezistora qoşulub. Cərəyan nə qədərdir?`, solution: `Tərs qoşulmuş element EHQ-ni azaldır: ε_ümumi = (${n} − 1)·${F(eps)} − ${F(eps)} = ${n - 2}·${F(eps)} = ${F((n - 2) * eps)} V. Daxili müqavimətlər isə hamısı toplanır: ${n}·${F(r)} = ${F(n * r)} Ω. I = ${F((n - 2) * eps)}/(${F(Rv)} + ${F(n * r)}) = ${F(I)} A.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a circuit or graph, several steps;
  // the wrong options are the answers of typical mistakes. Questions 1 and 8–10 also use the earlier topics
  // "Om qanunu, birləşmələr" (fiz-om) and "Elektrik işi və gücü" (fiz-elektrik-guc).
  const { ae } = Oyun, again = f => Oyun.again(f, 5000); // strict filters: Q4 needs ~30 tries on average, give it room
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const kO = x => F(x / 1000) + " kΩ";
  const S = (w, h, inner, aria) => svgEl(CK.svg(w, h, inner, "oy-svg", aria));
  const T = CK.text, Ln = CK.line;
  // source (ε with internal resistance r, dashed box) + series resistors on the top wire + parallel branches
  function figSrc(o) {
    const yT = 36, yB = 164, yM = 100, bx = 40, ser = o.ser || [], br = o.br || [];
    const sx = ser.map((_, i) => 165 + 60 * i), xs = ser.length ? sx[sx.length - 1] + 50 : 165;
    const bxs = br.map((_, j) => xs + 70 * j), xEnd = br.length ? bxs[bxs.length - 1] : xs;
    let s = CK.wire([[bx, yM - 5], [bx, yT], [xEnd, yT]]) + CK.wire([[bx, yM + 5], [bx, yB], [xEnd, yB]]);
    if (!br.length) s += Ln(xEnd, yT, xEnd, yB);
    s += `<rect x="12" y="70" width="96" height="110" rx="6" fill="none" stroke="${CK.MUT}" stroke-width="1.5" stroke-dasharray="5 4"/>`;
    s += CK.res(84, yB, "h", "r") + CK.bat(bx, yM, "ε");
    ser.forEach((l, i) => { s += CK.res(sx[i], yT, "h", l); });
    br.forEach((b, j) => { const x = bxs[j]; s += Ln(x, yT, x, yB);
      b.forEach((l, k) => { s += CK.res(x, yT + (yB - yT) * (k + 1) / (b.length + 1), "v", l); });
      if (j < br.length - 1) s += CK.dot(x, yT) + CK.dot(x, yB); });
    if (o.volt) s += CK.wire([[125, yT], [125, 82]]) + CK.wire([[125, 106], [125, yB]]) + CK.dot(125, yT) + CK.dot(125, yB) + CK.meter(125, 94, "V");
    if (o.extra) s += o.extra(sx, yT, yB);
    return S(xEnd + 40, yB + 34, s, o.aria);
  }
  // voltmeter of finite resistance R_V across R₂ (series R₁, R₂ and an ideal source)
  const figRealV = () => { const x = 140, yT = 36;
    return svgEl(CK.net({ ser: ["R₁", "R₂"], U: "U", cls: "oy-svg", aria: "Ardıcıl R₁ və R₂; real voltmetr (müqaviməti R_V) R₂-yə paralel",
      extra: CK.wire([[x - 22, yT], [x - 22, 80], [x - 12, 80]]) + CK.wire([[x + 12, 80], [x + 22, 80], [x + 22, yT]]) + CK.dot(x - 22, yT) + CK.dot(x + 22, yT) + CK.meter(x, 80, "V") + T(x, 112, "R_V", "middle", CK.MUT, 12) })); };
  // ammeter with a shunt in parallel
  function figShunt() { const yT = 50, yB = 120;
    const s = Ln(20, 85, 70, 85) + Ln(70, yT, 70, yB) + Ln(70, yT, 190, yT) + Ln(70, yB, 190, yB) + Ln(190, yT, 190, yB) + Ln(190, 85, 240, 85)
      + CK.dot(70, 85) + CK.dot(190, 85) + CK.meter(130, yT, "A") + CK.res(130, yB, "h", "") + T(130, yB + 25, "R_ş") + T(148, yT - 12, "R_A", "start")
      + CK.arrow(24, 75, 56, 75) + T(40, 68, "I");
    return S(260, 160, s, "Ampermetr və ona paralel şunt R_ş"); }
  // U–I graph of a source: a line from (0, ε) to (I_qq, 0)
  const STEPS = [1, 2, 3, 4, 5, 6, 8, 10, 12], st = m => STEPS.find(s => m % s === 0 && m / s <= 6);
  function figUI(eps, Isc) {
    const X = i => 40 + i * 190 / Isc, Y = u => 160 - u * 135 / eps;
    let s = Ln(40, 160, 238, 160) + Ln(40, 160, 40, 18) + T(242, 176, "I, A", "start") + T(34, 14, "U, V", "end");
    for (let i = st(Isc); i <= Isc; i += st(Isc)) s += Ln(X(i), 160, X(i), 22, CK.MUT, 0.6) + T(X(i), 176, i, "middle", CK.MUT, 11);
    for (let u = st(eps); u <= eps; u += st(eps)) s += Ln(40, Y(u), 232, Y(u), CK.MUT, 0.6) + T(32, Y(u) + 4, u, "end", CK.MUT, 11);
    s += Ln(X(0), Y(eps), X(Isc), Y(0), CK.ACC, 2.5) + `<circle cx="${X(0)}" cy="${Y(eps)}" r="3.5" fill="${CK.ACC}"/><circle cx="${X(Isc)}" cy="${Y(0)}" r="3.5" fill="${CK.ACC}"/>`;
    return S(280, 190, s, "Mənbənin qütblərindəki gərginliyin cərəyandan asılılıq qrafiki"); }
  const rheo = (x, yT) => CK.arrow(x - 16, yT + 14, x + 16, yT - 8);
  const lp = () => svgEl(CK.twoLoop({ e1: "ε₁", e2: "ε₂", r1: "R₁", r2: "R₂", r3: "R₃", cls: "oy-svg", aria: "İki konturlu sxem: iki mənbə və üç rezistor" }));

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. source with internal resistance, two parallel resistors: current through one of them (fiz-om)
    { tip: "qapali", birlesik: "fiz-om", gen: () => again(() => {
      const [r1, r2] = pick([[3, 6], [6, 3], [2, 2], [4, 12], [12, 4], [6, 12], [12, 6], [4, 4], [6, 6], [2, 6], [6, 2], [3, 3], [4, 6], [6, 4], [12, 12]]), r = pick([0.5, 1, 2]), I = pick([1, 2, 3, 4, 5, 6]);
      const r12 = r1 * r2 / (r1 + r2), eps = I * (r12 + r), I1 = I * r2 / (r1 + r2); if (!nice(eps, 1) || !nice(r12, 2)) return null;
      const w = [I, eps / r1, I * r1 / (r1 + r2), eps / (r1 + r)]; if (![I1, ...w].every(x => ok2(x))) return null;
      return mc(ae(I1, w, U_("A")), { svg: figSrc({ br: [["R₁"], ["R₂"]], aria: "Mənbə daxili müqavimətlə (r); R₁ və R₂ paralel" }),
        text: `Sxemdə ε = ${F(eps)} V, r = ${F(r)} Ω, R₁ = ${r1} Ω, R₂ = ${r2} Ω. R₁ rezistorundan keçən cərəyan şiddəti nə qədərdir?`,
        solution: `R₁ və R₂ paraleldir: R₁₂ = ${r1}·${r2}/${r1 + r2} = ${F(+r12.toFixed(4))} Ω. Tam dövrə: I = ε/(R₁₂ + r) = ${F(eps)}/${F(+(r12 + r).toFixed(4))} = ${F(I)} A. Paralel qollarda gərginlik eynidir, cərəyan müqavimətlərlə tərs mütənasib bölünür: I₁ = I·R₂/(R₁ + R₂) = ${F(I)}·${r2}/${r1 + r2} = ${F(I1)} A. Tələlər: ümumi cərəyanı cavab yazmaq (${F(I)} A), daxili müqaviməti unutmaq: R₁-də gərginlik ε sayılır (${F(+(eps / r1).toFixed(4))} A), qolları dəyişmək (${F(+(I * r1 / (r1 + r2)).toFixed(4))} A), R₁ qoluna tək özü kimi baxmaq (${F(+(eps / (r1 + r)).toFixed(4))} A).` });
    }) },
    // 2. terminal voltage with a voltmeter at the source
    { tip: "qapali", gen: () => again(() => {
      const r1 = rnd(1, 8), r2 = rnd(1, 8), r = pick([0.5, 1, 2]), I = rnd(1, 5), eps = I * (r1 + r2 + r), U = I * (r1 + r2);
      if (!nice(eps, 1)) return null;
      const w = [eps, I * r, I * r1, eps + I * r]; if (![U, ...w].every(x => ok2(x))) return null;
      return mc(ae(U, w, U_("V")), { svg: figSrc({ ser: ["R₁", "R₂"], volt: true, aria: "Mənbə (ε, r), ardıcıl R₁ və R₂; ideal voltmetr mənbənin qütblərində" }),
        text: `Sxemdə ε = ${F(eps)} V, r = ${F(r)} Ω, R₁ = ${r1} Ω, R₂ = ${r2} Ω. İdeal voltmetr mənbənin qütblərində nəyi göstərir?`,
        solution: `Cərəyan: I = ε/(R₁ + R₂ + r) = ${F(eps)}/${F(r1 + r2 + r)} = ${F(I)} A. Qütblərdəki gərginlik U = ε − I·r = ${F(eps)} − ${F(I * r)} = ${F(U)} V (həm də I·(R₁ + R₂) = ${F(U)} V). Tələlər: U = ε yazmaq (r > 0 olanda yalnız açıq dövrədə doğrudur), daxili müqavimətdəki düşməni cavab yazmaq (${F(I * r)} V), yalnız bir rezistorun gərginliyi (${F(I * r1)} V), ε + I·r (işarə səhvi).` });
    }) },
    // 3. U–I graph of a source: power in a resistor
    { tip: "qapali", gen: () => again(() => {
      const eps = pick([6, 8, 9, 10, 12, 15, 16, 18, 20, 24]), Isc = pick([3, 4, 5, 6, 8, 9, 10, 12]), r = eps / Isc, Rl = pick([1, 2, 3, 4, 5, 6, 8, 10, 12]);
      if (!nice(r, 2) || !st(eps) || !st(Isc)) return null;
      const I = eps / (Rl + r), P = I * I * Rl; if (!nice(I, 3)) return null;
      const w = [eps * eps / Rl, eps * I, I * I * r, Isc * Isc * Rl]; if (![P, ...w].every(x => ok2(x))) return null;
      return mc(ae(P, w, U_("W")), { svg: figUI(eps, Isc), text: `Qrafikdə mənbənin qütblərindəki gərginliyin cərəyandan asılılığı verilib. Mənbə ${Rl} Ω-luq rezistora qoşulur. Rezistorda ayrılan güc nə qədərdir?`,
        solution: `Qrafikdən: cərəyan 0 olanda U = ε = ${eps} V; U = 0 olanda (qısa qapanma) I = ${Isc} A, deməli r = ε/I_qq = ${eps}/${Isc} = ${F(r)} Ω. Rezistorla: I = ε/(R + r) = ${eps}/${F(Rl + r)} = ${F(+I.toFixed(4))} A. P = I²R = ${F(+(I * I).toFixed(4))}·${Rl} = ${F(P)} W. Tələlər: r-i unutmaq (ε²/R = ${F(+(eps * eps / Rl).toFixed(4))} W), tam güc ε·I (${F(+(eps * I).toFixed(4))} W), daxildəki itki I²r (${F(+(I * I * r).toFixed(4))} W), qısa qapanma cərəyanını rezistora tətbiq etmək (${F(Isc * Isc * Rl)} W).` });
    }) },
    // 4. two-loop circuit (Kirxhof): current through the middle resistor
    { tip: "qapali", gen: () => again(() => {
      const r1 = rnd(1, 8), r2 = rnd(1, 8), r3 = rnd(1, 8), I1 = rnd(1, 5), I2 = rnd(1, 5), I3 = I1 + I2, e1 = I1 * r1 + I3 * r3, e2 = I2 * r2 + I3 * r3;
      if (e1 > 60 || e2 > 60 || e1 === e2 || I1 === I2) return null;
      const w = [Math.abs(I1 - I2), e1 / (r1 + r3), e2 / (r2 + r3), (e1 + e2) / (r1 + r2 + r3)]; if (![I3, ...w].every(x => ok2(x))) return null;
      return mc(ae(I3, w, U_("A")), { svg: lp(),
        text: `Sxemdə mənbələrin daxili müqaviməti yoxdur: ε₁ = ${e1} V, ε₂ = ${e2} V, R₁ = ${r1} Ω, R₂ = ${r2} Ω, R₃ = ${r3} Ω. Hər iki mənbənin müsbət qütbü yuxarıdadır. R₃ rezistorundan keçən cərəyan şiddəti nə qədərdir?`,
        solution: `Cərəyanlar: mənbələr cərəyanı yuxarı itələyir, ona görə I₁ və I₂ aşağıdan yuxarı (öz qollarında), I₃ orta qolla yuxarıdan aşağı qəbul edilir. Düyün qaydası: I₃ = I₁ + I₂. Kontur qaydası: ε₁ = I₁R₁ + I₃R₃ və ε₂ = I₂R₂ + I₃R₃. I₁ = (${e1} − ${r3}·I₃)/${r1}, I₂ = (${e2} − ${r3}·I₃)/${r2} yazıb düyündə yerinə qoysaq I₃ = ${I3} A alınır. Yoxla: I₁ = ${I1} A, I₂ = ${I2} A, ${I1} + ${I2} = ${I3} ✓. Tələlər: düyündə cərəyanları çıxmaq (${F(Math.abs(I1 - I2))} A), digər mənbəni unutmaq (${F(+(e1 / (r1 + r3)).toFixed(4))} A və ${F(+(e2 / (r2 + r3)).toFixed(4))} A), bütün rezistorları ardıcıl saymaq (${F(+((e1 + e2) / (r1 + r2 + r3)).toFixed(4))} A).` });
    }) },
    // 5. ammeter with a shunt: total current
    { tip: "qapali", gen: () => again(() => {
      const RA = pick([1, 2, 3, 4, 5, 6, 9]), Rs = pick([0.1, 0.2, 0.25, 0.5, 1, 1.5, 2]), IA = pick([0.1, 0.2, 0.25, 0.5, 1, 2, 3]), I = IA * (1 + RA / Rs);
      if (!nice(I, 3)) return null;
      const w = [IA, IA * RA / Rs, IA * (1 + Rs / RA), IA * (RA / Rs - 1)]; if (![I, ...w].every(x => ok2(x, 3))) return null;
      return mc(ae(I, w, U_("A")), { svg: figShunt(), text: `Ampermetrin müqaviməti R_A = ${F(RA)} Ω-dur, ona paralel R_ş = ${F(Rs)} Ω-luq şunt qoşulub. Ampermetr ${F(IA)} A göstərir. Əsas dövrədəki ümumi cərəyan şiddəti nə qədərdir?`,
        solution: `Ampermetrin və şuntun uclarında gərginlik eynidir: U = I_A·R_A = ${F(IA)}·${F(RA)} = ${F(+(IA * RA).toFixed(4))} V. Şuntdan I_ş = U/R_ş = ${F(+(IA * RA).toFixed(4))}/${F(Rs)} = ${F(+(IA * RA / Rs).toFixed(4))} A keçir. Ümumi cərəyan I = I_A + I_ş = ${F(+I.toFixed(4))} A. Tələlər: yalnız şkaladakını cavab yazmaq (${F(IA)} A), yalnız şuntun cərəyanı (${F(+(IA * RA / Rs).toFixed(4))} A), müqavimətləri çevirmək (${F(+(IA * (1 + Rs / RA)).toFixed(4))} A), cəm əvəzinə fərq (${F(+(IA * (RA / Rs - 1)).toFixed(4))} A).` });
    }) },
    // 6. real voltmeter across one of two series resistors
    { tip: "qapali", gen: () => again(() => {
      const U = pick([6, 9, 12, 15, 18, 24, 30]), a = pick([1000, 2000, 3000, 4000, 6000]), b = pick([1000, 2000, 3000, 4000, 6000]), v = pick([1000, 2000, 3000, 6000, 12000]);
      const Rp = b * v / (b + v), Vd = U * Rp / (a + Rp); if (!nice(Rp, 2)) return null;
      const w = [U * b / (a + b), U - Vd, U * v / (a + b + v), U / 2]; if (![Vd, ...w].every(x => ok2(x))) return null;
      return mc(ae(Vd, w, U_("V")), { svg: figRealV(), text: `Mənbənin gərginliyi U = ${U} V, R₁ = ${kO(a)}, R₂ = ${kO(b)}. R₂ rezistoruna müqaviməti R_V = ${kO(v)} olan voltmetr paralel qoşulub. Voltmetr nəyi göstərir?`,
        solution: `Voltmetr R₂-yə paraleldir: R_p = R₂R_V/(R₂ + R_V) = ${kO(b)}·${kO(v)}/${kO(b + v)} = ${kO(Rp)}. Ümumi müqavimət R₁ + R_p = ${kO(a + Rp)}. Göstəriş U_V = U·R_p/(R₁ + R_p) = ${U}·${kO(Rp)}/${kO(a + Rp)} = ${F(Vd)} V. Tələlər: voltmetri ideal saymaq (${F(+(U * b / (a + b)).toFixed(4))} V), digər rezistorun gərginliyi (${F(+(U - Vd).toFixed(4))} V), voltmetri ardıcıl saymaq (${F(+(U * v / (a + b + v)).toFixed(4))} V), gərginliyi yarı bölmək (${F(U / 2)} V).` });
    }) },
    // 7. two regimes: find the EMF
    { tip: "qapali", gen: () => again(() => {
      const eps = pick([3, 6, 9, 12, 18, 24]), r = pick([0.5, 1, 2]), R1 = pick([1, 2, 3, 4, 5, 6, 8]), R2 = pick([3, 4, 5, 6, 8, 10, 12, 15]), I1 = eps / (R1 + r), I2 = eps / (R2 + r);
      if (R1 >= R2 || !nice(I1, 3) || !nice(I2, 3)) return null;
      const w = [I1 * R1, I2 * R2, (I1 * R1 + I2 * R2) / 2, I1 * R1 + I2 * R2]; if (![eps, ...w].every(x => ok2(x))) return null;
      const svg = figSrc({ ser: ["R"], aria: "Mənbə (ε, r), ardıcıl rezistor R və ampermetr", extra: () => CK.meter(165, 164, "A") });
      return mc(ae(eps, w, U_("V")), { svg, text: `Mənbə R rezistoruna qoşulub, ampermetr dövrədəki cərəyanı göstərir. R = ${R1} Ω olanda ampermetr ${F(I1)} A, R = ${R2} Ω olanda ${F(I2)} A göstərir. Mənbənin EHQ-si nə qədərdir? (Ampermetr idealdır.)`,
        solution: `Hər iki rejimdə ε = I(R + r): ${F(I1)}·(${R1} + r) = ${F(I2)}·(${R2} + r). Buradan r = (${F(+(I2 * R2).toFixed(4))} − ${F(+(I1 * R1).toFixed(4))})/(${F(I1)} − ${F(I2)}) = ${F(r)} Ω. ε = ${F(I1)}·(${R1} + ${F(r)}) = ${F(eps)} V. Tələlər: daxili müqaviməti unutmaq (I₁R₁ = ${F(+(I1 * R1).toFixed(4))} V və ya I₂R₂ = ${F(+(I2 * R2).toFixed(4))} V), iki gərginliyin ortası (${F(+((I1 * R1 + I2 * R2) / 2).toFixed(4))} V), cəmi (${F(+(I1 * R1 + I2 * R2).toFixed(4))} V).` });
    }) },
    // 8. heat in the external resistor over t minutes (fiz-elektrik-guc)
    { tip: "qapali", birlesik: "fiz-elektrik-guc", gen: () => again(() => {
      const eps = pick([6, 9, 12, 18, 24, 36]), r = pick([1, 2, 3, 4]), R = pick([2, 3, 4, 5, 6, 8, 10, 12, 20]), t = pick([1, 2, 3, 5, 10]), I = eps / (R + r);
      if (!nice(I, 3)) return null;
      const Q = I * I * R * t * 60, w = [eps * eps / R * t * 60, eps * I * t * 60, I * I * r * t * 60, I * I * R * t]; if (![Q, ...w].every(x => ok2(x, 1))) return null;
      return mc(ae(Q, w, U_("J")), { svg: figSrc({ ser: ["R"], aria: "Mənbə (ε, r) və ardıcıl rezistor R" }), text: `Sxemdə ε = ${eps} V, r = ${r} Ω, R = ${R} Ω. Dövrə ${t} dəqiqə qoşulu qalarsa, R rezistorunda nə qədər istilik ayrılır?`,
        solution: `Cərəyan: I = ε/(R + r) = ${eps}/${R + r} = ${F(+I.toFixed(4))} A. Zaman SI-də: t = ${t}·60 = ${t * 60} s. Coul–Lens: Q = I²Rt = ${F(+(I * I).toFixed(4))}·${R}·${t * 60} = ${F(Q)} J. Tələlər: r-i unutmaq (${F(+(eps * eps / R * t * 60).toFixed(4))} J), mənbənin tam işi ε·I·t (${F(+(eps * I * t * 60).toFixed(4))} J), daxildə itən istilik (${F(+(I * I * r * t * 60).toFixed(4))} J), dəqiqəni saniyəyə çevirməmək (${F(+(I * I * R * t).toFixed(4))} J).` });
    }) },
    // 9. rheostat in series with a fixed resistor: the largest power (fiz-elektrik-guc)
    { tip: "qapali", birlesik: "fiz-elektrik-guc", gen: () => again(() => {
      const eps = pick([6, 12, 18, 24, 30, 36, 48]), r = pick([1, 2, 3, 4]), R0 = pick([1, 2, 3, 5, 6, 8]), P = eps * eps / (4 * (r + R0));
      const w = [eps * eps / (4 * r), eps * eps / (4 * R0), eps * eps / (2 * (r + R0)), eps * eps / (r + R0)]; if (![P, ...w].every(x => ok2(x))) return null;
      return mc(ae(P, w, U_("W")), { svg: figSrc({ ser: ["R₀", "R"], aria: "Mənbə (ε, r), ardıcıl sabit R₀ və reostat R", extra: (sx, yT) => rheo(sx[1], yT) }),
        text: `Sxemdə ε = ${eps} V, r = ${r} Ω, R₀ = ${R0} Ω sabit rezistordur, R isə dəyişən müqavimətli reostatdır. Reostatın müqavimətini dəyişdikdə onda ayrılan ən böyük güc nə qədər ola bilər?`,
        solution: `Reostata nəzərən mənbənin ümumi daxili müqaviməti r + R₀ = ${r} + ${R0} = ${r + R0} Ω-dur. Güc R = r + R₀ = ${r + R0} Ω olanda maksimumdur: P_max = ε²/(4(r + R₀)) = ${eps * eps}/${4 * (r + R0)} = ${F(P)} W. Tələlər: R₀-ı unutmaq (${F(+(eps * eps / (4 * r)).toFixed(4))} W), r-i unutmaq (${F(+(eps * eps / (4 * R0)).toFixed(4))} W), tam gücü cavab yazmaq (${F(+(eps * eps / (2 * (r + R0))).toFixed(4))} W: onun yarısı reostatda ayrılır), ε²/(r + R₀) (${F(+(eps * eps / (r + R0)).toFixed(4))} W).` });
    }) },
    // 10. two-loop circuit: power in R₂ (the current may flow against the chosen direction) (fiz-elektrik-guc)
    { tip: "qapali", birlesik: "fiz-elektrik-guc", gen: () => again(() => {
      const r1 = rnd(1, 8), r2 = rnd(1, 8), r3 = rnd(1, 8), I1 = rnd(3, 6), I2 = pick([-1, -2, 1, 2, 3]), I3 = I1 + I2, e1 = I1 * r1 + I3 * r3, e2 = I2 * r2 + I3 * r3;
      if (e1 > 60 || e2 > 60 || e1 <= 0 || e2 <= 0 || e1 === e2 || Math.abs(I2) === I3) return null;
      const P = I2 * I2 * r2, w = [e2 * e2 / r2, Math.pow(e2 / (r2 + r3), 2) * r2, I3 * I3 * r2, Math.abs(I2) * e2]; if (![P, ...w].every(x => ok2(x))) return null;
      return mc(ae(P, w, U_("W")), { svg: lp(),
        text: `Sxemdə mənbələrin daxili müqaviməti yoxdur: ε₁ = ${e1} V, ε₂ = ${e2} V, R₁ = ${r1} Ω, R₂ = ${r2} Ω, R₃ = ${r3} Ω. Hər iki mənbənin müsbət qütbü yuxarıdadır. R₂ rezistorunda ayrılan güc nə qədərdir?`,
        solution: `I₁ və I₂ aşağıdan yuxarı (öz qollarında), I₃ orta qolla yuxarıdan aşağı qəbul edək. Düyün: I₃ = I₁ + I₂. Kontur: ε₁ = I₁R₁ + I₃R₃, ε₂ = I₂R₂ + I₃R₃. Həll: I₁ = ${I1} A, I₂ = ${I2} A, I₃ = ${I3} A (yoxla: ${I1}·${r1} + ${I3}·${r3} = ${e1} ✓, ${I2}·${r2} + ${I3}·${r3} = ${e2} ✓).${I2 < 0 ? ` I₂ < 0: cərəyan həqiqətdə əks istiqamətdə (yuxarıdan aşağı) axır, amma güc işarədən asılı deyil.` : ""} P₂ = I₂²R₂ = ${I2 * I2}·${r2} = ${F(P)} W. Tələlər: ε₂²/R₂ (${F(+(e2 * e2 / r2).toFixed(4))} W: bütün EHQ rezistora düşmür), digər mənbəni unutmaq (${F(+(Math.pow(e2 / (r2 + r3), 2) * r2).toFixed(4))} W), I₃-ü götürmək (${F(I3 * I3 * r2)} W), mənbənin gücü ε₂·|I₂| (${F(Math.abs(I2) * e2)} W).` });
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
      key: "fiz-ehq-kirxhof", title: "EHQ, tam dövr üçün Om qanunu, Kirxhof qaydaları, ölçü cihazları", fenn: "fizika", link: "dersler/fiz-ehq-kirxhof.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: A, V, Ω, W; FİƏ faizlə). Onluq kəsr vergül və ya nöqtə ilə: 0,25.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["tamdovre", "tamdovre", "gerginlik", "gerginlik", "guc", "kirxhof", "kirxhof", "olcu", "olcu", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-ehq-kirxhof.html")) b.push("dersler/fiz-ehq-kirxhof.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
