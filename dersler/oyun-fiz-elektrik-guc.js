// Fizika · Elektrik işi və gücü, Coul-Lens qanunu — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units, c(su) = 4200 J/(kg·°C).
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
  const c = 4200;
  const PL = [9, 12, 16, 18, 24, 36, 48, 72, 144];            // 12 V lamps: R = 144/P is a whole number or simple fraction
  // two lamps in series / parallel (figure)
  const lampsSer = (a, b, U) => svgEl(CK.svg(260, 160, CK.wire([[40, 75], [40, 36], [220, 36], [220, 120], [40, 120], [40, 85]]) + CK.lamp(100, 36, F(a) + " Ω") + CK.lamp(170, 36, F(b) + " Ω") + CK.bat(40, 80, U + " V"), "oy-svg", "Ardıcıl iki lampa"));
  const lampsPar = (a, b, U) => svgEl(CK.svg(260, 170, CK.wire([[40, 85], [40, 150], [200, 150]]) + CK.wire([[40, 75], [40, 36], [200, 36]]) + CK.line(100, 36, 100, 150) + CK.line(200, 36, 200, 150) + CK.dot(100, 36) + CK.dot(100, 150) + CK.lamp(100, 93, F(a) + " Ω", "r") + CK.lamp(200, 93, F(b) + " Ω", "r") + CK.bat(40, 80, U + " V"), "oy-svg", "Paralel iki lampa"));

  const levels = [
    { id: "isguc", ad: "A = UIt, P = UI", izah: "Cərəyanın işi A = U·I·t (J). Güc P = A/t = U·I (W). 1 dəq = 60 s, 1 kW = 1000 W, 1 kJ = 1000 J.",
      gen() {
        const kind = pick(["A", "P", "I", "t", "Ap", "Pm"]);
        let U, I, t, P, A;
        if (kind === "A") {
          do { U = pick([6, 12, 24, 36, 110, 220]); I = pick([0.5, 1, 1.5, 2, 2.5, 4, 5]); t = pick([10, 20, 30, 60, 120, 300]); A = U * I * t; } while (!nice(A, 1));
          return R(A, "J", { text: `Gərginliyi ${U} V olan şəbəkədə ${F(I)} A cərəyanla işləyən cihaz ${t} s ərzində nə qədər iş görür?`, solution: `A = U·I·t = ${U}·${F(I)}·${t} = ${F(A)} J.` });
        }
        if (kind === "Pm") {
          let tm; do { U = pick([12, 24, 220]); I = pick([0.5, 1, 2, 2.5, 4, 5]); tm = pick([1, 2, 3, 5, 10]); A = U * I * tm * 60; } while (!nice(A, 1));
          return R(A, "J", { text: `${U} V-luq mənbədən ${F(I)} A cərəyan alan elektrik mühərriki ${tm} dəqiqə işləyir. Cərəyanın işi neçə coul olar?`, solution: `t = ${tm} dəq = ${tm * 60} s. A = U·I·t = ${U}·${F(I)}·${tm * 60} = ${F(A)} J.` });
        }
        if (kind === "P") {
          do { U = pick([6, 12, 24, 36, 110, 220]); I = pick([0.25, 0.5, 1, 1.5, 2, 2.5, 4, 5, 10]); P = U * I; } while (!nice(P, 2));
          return R(P, "W", { text: `Cihaz ${U} V-luq şəbəkədən ${F(I)} A cərəyan çəkir. Onun gücü nə qədərdir?`, solution: `P = U·I = ${U}·${F(I)} = ${F(P)} W.` });
        }
        if (kind === "I") {
          let k; do { U = pick([12, 24, 110, 220]); P = pick([60, 100, 220, 440, 550, 880, 1100, 2200, 120, 240, 480]); I = P / U; } while (!nice(I, 3));
          return R(I, "A", { text: `${P} W gücündə cihaz ${U} V-luq şəbəkəyə qoşulub. Cihazdan keçən cərəyan nə qədərdir?`, solution: `P = U·I → I = P/U = ${P}/${U} = ${F(I)} A.` });
        }
        if (kind === "t") {
          let kj; do { P = pick([100, 200, 250, 400, 500, 1000, 1500, 2000]); kj = pick([20, 30, 50, 60, 100, 120, 300, 600]); t = kj * 1000 / P; } while (!nice(t, 1) || t < 5);
          return R(t, "s", { text: `${P} W gücündə cihaz ${kj} kJ iş görməlidir. Bu neçə saniyə çəkər?`, solution: `A = ${kj} kJ = ${kj * 1000} J. P = A/t → t = A/P = ${kj * 1000}/${P} = ${F(t)} s.` });
        }
        let tm; do { P = pick([60, 100, 200, 500, 800, 1000, 1500, 2000]); tm = pick([1, 2, 3, 5, 10, 15]); A = P * tm * 60; } while (!nice(A, 1));
        return R(A, "J", { text: `${P} W gücündə cihaz ${tm} dəqiqə işləyir. Cərəyanın gördüyü iş neçə coul olar?`, solution: `t = ${tm} dəq = ${tm * 60} s. A = P·t = ${P}·${tm * 60} = ${F(A)} J.` });
      } },
    { id: "pformul", ad: "P = I²R = U²/R, Q = I²Rt", izah: "Rezistor üçün P = UI = I²R = U²/R. Coul–Lens qanunu: ayrılan istilik Q = I²Rt = (U²/R)·t = UIt.",
      gen() {
        const kind = pick(["I2R", "U2R", "Rp", "Ip", "Q", "Q", "tQ", "Rq", "k"]);
        let I, Rv, U, P, t, Q;
        if (kind === "I2R") { do { I = pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]); Rv = pick([4, 8, 10, 12, 20, 25, 40, 50, 100]); P = I * I * Rv; } while (!nice(P, 2));
          return R(P, "W", { text: `Müqaviməti ${Rv} Ω olan rezistordan ${F(I)} A cərəyan keçir. Rezistorda ayrılan güc nə qədərdir?`, solution: `P = I²R = ${F(I)}²·${Rv} = ${F(I * I)}·${Rv} = ${F(P)} W.` }); }
        if (kind === "U2R") { do { U = pick([6, 12, 24, 36, 110, 220]); Rv = pick([6, 8, 10, 12, 20, 22, 24, 40, 44, 55, 110]); P = U * U / Rv; } while (!nice(P, 2));
          return R(P, "W", { text: `Müqaviməti ${Rv} Ω olan qızdırıcı ${U} V-luq şəbəkəyə qoşulub. Onun gücü nə qədərdir?`, solution: `P = U²/R = ${U}²/${Rv} = ${U * U}/${Rv} = ${F(P)} W.` }); }
        if (kind === "Rp") { do { U = pick([12, 24, 110, 220]); P = pick([60, 100, 200, 240, 400, 500, 1000, 1100, 2000, 2200, 880, 550, 120, 480]); Rv = U * U / P; } while (!nice(Rv, 2));
          return R(Rv, "Ω", { text: `Qızdırıcı ${U} V-luq şəbəkədə ${P} W güc sərf edir. Onun müqaviməti nə qədərdir?`, solution: `P = U²/R → R = U²/P = ${U * U}/${P} = ${F(Rv)} Ω.` }); }
        if (kind === "Ip") { do { I = pick([0.5, 1, 2, 3, 4, 5, 10]); Rv = pick([4, 6, 8, 10, 16, 24, 25, 40, 100]); P = I * I * Rv; } while (!nice(P, 2));
          return R(I, "A", { text: `Müqaviməti ${Rv} Ω olan rezistorda ${F(P)} W güc ayrılır. Rezistordan keçən cərəyan nə qədərdir?`, solution: `P = I²R → I² = P/R = ${F(P)}/${Rv} = ${F(I * I)} → I = ${F(I)} A.` }); }
        if (kind === "Q") { let tm, ts; do { I = pick([0.5, 1, 2, 2.5, 3, 4, 5]); Rv = pick([4, 10, 20, 24, 40, 50, 100]); tm = pick([1, 2, 3, 5, 10]); Q = I * I * Rv * tm * 60; } while (!nice(Q, 1));
          return R(Q, "J", { text: `Qızdırıcı spiralının müqaviməti ${Rv} Ω-dur. Ondan ${F(I)} A cərəyan ${tm} dəqiqə keçir. Spiralda neçə coul istilik ayrılır?`, solution: `t = ${tm} dəq = ${tm * 60} s. Q = I²Rt = ${F(I * I)}·${Rv}·${tm * 60} = ${F(Q)} J.` }); }
        if (kind === "tQ") { do { I = pick([1, 2, 3, 4, 5]); Rv = pick([5, 10, 20, 25, 50]); t = pick([10, 20, 30, 50, 100]); Q = I * I * Rv * t; } while (Q % 100 !== 0);
          return R(t, "s", { text: `Müqaviməti ${Rv} Ω olan naqildən ${I} A cərəyan keçir. Naqildə ${F(Q)} J istilik ayrılması üçün neçə saniyə lazımdır?`, solution: `Q = I²Rt → t = Q/(I²R) = ${F(Q)}/(${I * I}·${Rv}) = ${F(Q)}/${I * I * Rv} = ${t} s.` }); }
        if (kind === "Rq") { do { I = pick([1, 2, 3, 4, 5]); Rv = pick([4, 5, 8, 10, 20, 25]); t = pick([10, 20, 30, 60, 100]); Q = I * I * Rv * t; } while (!nice(Q, 0));
          return R(Rv, "Ω", { text: `Naqildən ${I} A cərəyan ${t} s keçəndə onda ${F(Q)} J istilik ayrılır. Naqilin müqaviməti nə qədərdir?`, solution: `Q = I²Rt → R = Q/(I²t) = ${F(Q)}/(${I * I}·${t}) = ${F(Q)}/${I * I * t} = ${Rv} Ω.` }); }
        // proportional change
        const m = pick([2, 3, 4]), which = pick(["I", "R", "U"]);
        const Q0 = pick([100, 200, 300, 400, 500, 800, 1000, 1200, 1500, 2000, 3600]);
        if (which === "I") return R(Q0 * m * m, "J", { text: `Spiraldan bir müddətdə ${F(Q0)} J istilik ayrılır. Cərəyan ${m} dəfə artırılsa (müqavimət və vaxt eyni), eyni müddətdə nə qədər istilik ayrılar?`, solution: `Q = I²Rt: cərəyan ${m} dəfə artanda Q ${m}² = ${m * m} dəfə artır: ${F(Q0)}·${m * m} = ${F(Q0 * m * m)} J.` });
        if (which === "R") return R(Q0 * m, "J", { text: `Spiral gərginliyi sabit olan mənbəyə qoşulub və eyni müddətdə ${F(Q0)} J istilik ayırır. Spiralın müqavimətini ${m} dəfə azaldıb eyni müddət saxlasaq, istilik nə qədər olar?`, solution: `Gərginlik sabitdir, ona görə Q = U²t/R. R ${m} dəfə azalanda Q ${m} dəfə artır: ${F(Q0)}·${m} = ${F(Q0 * m)} J.` });
        return R(Q0 * m * m, "J", { text: `Qızdırıcı ${F(Q0)} J istilik ayırır. Gərginliyi ${m} dəfə artırsaq (müqavimət və vaxt eyni), eyni müddətdə nə qədər istilik ayrılar?`, solution: `Q = U²t/R: gərginlik ${m} dəfə artanda Q ${m * m} dəfə artır: ${F(Q0)}·${m * m} = ${F(Q0 * m * m)} J.` });
      } },
    { id: "qizdirici", ad: "Suyun qızdırılması", izah: "Su qızanda alınan istilik Q = c·m·ΔT (c = 4200 J/(kg·°C)). Qızdırıcının verdiyi iş A = P·t. Faydalı iş əmsalı η = Q/A.",
      gen() {
        const kind = pick(["t", "t", "dT", "P", "spiral"]);
        let m, dT, P, eta, t;
        if (kind === "t") {
          do { m = pick([0.5, 1, 1.5, 2, 2.5, 3]); dT = pick([20, 30, 40, 50, 60, 70, 80]); P = pick([500, 700, 1000, 1050, 1400, 1500, 2000, 2100, 2500]); eta = pick([1, 0.8, 0.75, 0.7, 0.6, 0.5, 0.9]); t = c * m * dT / (P * eta); } while (!nice(t, 1) || t > 1500);
          return R(t, "s", { text: `Elektrik çaydanın gücü ${P} W, faydalı iş əmsalı ${F(eta * 100)}%-dir. ${F(m)} kq suyu ${dT} °C qızdırmaq üçün neçə saniyə lazımdır? (c = 4200 J/(kg·°C))`,
            solution: `Suyun aldığı istilik: Q = c·m·ΔT = 4200·${F(m)}·${dT} = ${F(c * m * dT)} J. Çaydanın verməli olduğu iş: A = Q/η = ${F(c * m * dT)}/${F(eta)} = ${F(c * m * dT / eta)} J. t = A/P = ${F(c * m * dT / eta)}/${P} = ${F(t)} s.` });
        }
        if (kind === "dT") {
          do { m = pick([0.5, 1, 2, 3, 4]); P = pick([500, 1000, 1400, 2000, 2100]); t = pick([60, 120, 150, 180, 240, 300, 420, 600]); eta = pick([1, 0.8, 0.75, 0.9, 0.5]); dT = P * eta * t / (c * m); } while (!nice(dT, 1) || dT > 90 || dT < 5);
          return R(dT, "°C", { text: `${P} W-lıq qızdırıcı ${F(m)} kq suyu ${t} s qızdırır. Qızdırıcının faydalı iş əmsalı ${F(eta * 100)}%-dir. Suyun temperaturu neçə dərəcə artar? (c = 4200 J/(kg·°C))`,
            solution: `Qızdırıcının işi: A = P·t = ${P}·${t} = ${P * t} J. Suya gedən: Q = η·A = ${F(eta)}·${P * t} = ${F(eta * P * t)} J. ΔT = Q/(c·m) = ${F(eta * P * t)}/(4200·${F(m)}) = ${F(dT)} °C.` });
        }
        if (kind === "P") {
          do { m = pick([1, 2, 3, 5]); dT = pick([20, 40, 50, 60, 80]); t = pick([100, 200, 300, 400, 420, 600]); eta = pick([1, 0.8, 0.7, 0.5, 0.75, 0.6]); P = c * m * dT / (eta * t); } while (!nice(P, 1) || P > 4000 || P < 200);
          return R(P, "W", { text: `${m} kq suyu ${dT} °C qızdırmaq üçün çaydan ${t} s işləyib. Faydalı iş əmsalı ${F(eta * 100)}%-dir. Çaydanın gücü nə qədərdir? (c = 4200 J/(kg·°C))`,
            solution: `Q = c·m·ΔT = 4200·${m}·${dT} = ${c * m * dT} J. A = Q/η = ${F(c * m * dT / eta)} J. P = A/t = ${F(c * m * dT / eta)}/${t} = ${F(P)} W.` });
        }
        let U, Rs;
        do { U = pick([110, 220]); Rs = pick([22, 24.2, 44, 48.4, 55, 60.5, 110]); m = pick([0.5, 1, 2]); dT = pick([20, 40, 50, 60, 80]); eta = pick([1, 0.8, 0.5, 0.75]); t = c * m * dT / (U * U / Rs * eta); } while (!nice(t, 0) || t > 1200 || t < 30);
        return R(t, "s", { text: `Qızdırıcı spiralının müqaviməti ${F(Rs)} Ω-dur, ${U} V-luq şəbəkəyə qoşulub. Enerjinin ${F(eta * 100)}%-i suya keçir. ${F(m)} kq suyu ${dT} °C qızdırmaq üçün neçə saniyə lazımdır? (c = 4200 J/(kg·°C))`,
          solution: `P = U²/R = ${U * U}/${F(Rs)} = ${F(U * U / Rs)} W. Suyun aldığı istilik: Q = c·m·ΔT = 4200·${F(m)}·${dT} = ${F(c * m * dT)} J. Qızdırıcının işi A = Q/η = ${F(c * m * dT / eta)} J. t = A/P = ${F(c * m * dT / eta)}/${F(U * U / Rs)} = ${F(t)} s.` });
      } },
    { id: "tarif", ad: "kWh və xərc", izah: "Enerji kWh ilə: E = P(kW)·t(saat). 1 kWh = 3 600 000 J. Xərc = enerji × tarif. 100 qəpik = 1 manat.",
      gen() {
        const kind = pick(["cost", "cost", "kwh", "led", "jul", "gun"]);
        let P, hrs, days, E, tar;
        if (kind === "cost") {
          do { P = pick([60, 100, 200, 500, 800, 1000, 1500, 2000]); hrs = pick([1, 2, 3, 4, 5, 6, 8]); days = pick([10, 20, 30]); tar = pick([8, 10, 12, 15, 20]); E = P / 1000 * hrs * days; } while (!nice(E, 2) || !nice(E * tar, 1));
          return R(E * tar, "qəpik", { text: `${P} W-lıq cihaz gündə ${hrs} saat, ${days} gün işləyir. Elektrik enerjisinin tarifi 1 kWh üçün ${tar} qəpikdir. Cihazın işləməsinə neçə qəpik pul gedir?`,
            solution: `E = P·t = ${F(P / 1000)} kW · ${hrs * days} saat = ${F(E)} kWh. Xərc: ${F(E)}·${tar} = ${F(E * tar)} qəpik.` });
        }
        if (kind === "kwh") {
          do { P = pick([100, 250, 400, 500, 800, 1000, 1200, 1500, 2000, 2500]); hrs = pick([0.5, 1, 2, 3, 4, 5]); E = P / 1000 * hrs; } while (!nice(E, 3));
          return R(E, "kWh", { text: `${P} W-lıq cihaz ${F(hrs)} saat işləyib. Sərf olunan enerji neçə kWh-dir?`, solution: `E = P·t = ${F(P / 1000)} kW · ${F(hrs)} saat = ${F(E)} kWh.` });
        }
        if (kind === "led") {
          let P1, P2; do { P1 = pick([40, 60, 75, 100]); P2 = pick([5, 8, 10, 12]); hrs = pick([2, 4, 5, 6]); days = pick([20, 30]); tar = pick([8, 10, 12, 15, 20]); E = (P1 - P2) / 1000 * hrs * days; } while (!nice(E, 2) || !nice(E * tar, 1));
          return R(E * tar, "qəpik", { text: `${P1} W-lıq közərmə lampasını ${P2} W-lıq LED lampa ilə əvəz etdilər. Lampa gündə ${hrs} saat, ${days} gün yanır. Tarif 1 kWh üçün ${tar} qəpikdir. Bu müddətdə neçə qəpik qənaət olunur?`,
            solution: `Güc fərqi: ${P1} − ${P2} = ${P1 - P2} W = ${F((P1 - P2) / 1000)} kW. Vaxt: ${hrs}·${days} = ${hrs * days} saat. Enerji qənaəti: ${F(E)} kWh. Pul: ${F(E)}·${tar} = ${F(E * tar)} qəpik.` });
        }
        if (kind === "jul") {
          const k = pick([0.5, 1, 1.5, 2, 3, 5]);
          return R(k * 3.6, "MJ", { text: `Ev ${F(k)} kWh elektrik enerjisi sərf edib. Bu neçə meqajouldur? (1 kWh = 3,6 MJ)`, solution: `1 kWh = 1000 W · 3600 s = 3 600 000 J = 3,6 MJ. ${F(k)} kWh = ${F(k)}·3,6 = ${F(k * 3.6)} MJ.` });
        }
        let bud; do { P = pick([1000, 1500, 2000]); hrs = pick([1, 2, 4]); tar = pick([8, 10, 12, 15, 20]); bud = pick([100, 150, 200, 240, 300, 400, 600]); days = bud / (P / 1000 * hrs * tar); } while (!Number.isInteger(days) || days > 60);
        return R(days, "gün", { text: `${P} W-lıq elektrik qızdırıcısı gündə ${hrs} saat işləyir. 1 kWh ${tar} qəpikdir. ${bud} qəpiklik pulla bu qızdırıcıdan neçə gün istifadə etmək olar?`,
          solution: `Bir günün enerjisi: ${F(P / 1000)}·${hrs} = ${F(P / 1000 * hrs)} kWh. Bir günün xərci: ${F(P / 1000 * hrs)}·${tar} = ${F(P / 1000 * hrs * tar)} qəpik. Gün sayı: ${bud}/${F(P / 1000 * hrs * tar)} = ${days}.` });
      } },
    { id: "lampa", ad: "Hansı lampa parlaqdır?", izah: "Sadə modeldə lampanın parlaqlığını onda ayrılan real elektrik gücü ilə müqayisə edirik. Ardıcıl: cərəyan eynidir, P = I²R — böyük R-li lampa parlaqdır. Paralel: gərginlik eynidir, P = U²/R — kiçik R-li lampa parlaqdır. Lampanın müqaviməti R = U₀²/P₀ (sabit sayırıq).",
      gen() {
        const kind = pick(["ser", "ser", "par", "ned", "rat", "R"]);
        if (kind === "R") {
          let U0, P0; do { U0 = pick([6, 12, 24, 110, 220]); P0 = pick([6, 9, 12, 24, 36, 60, 100, 110, 220, 440]); } while (!nice(U0 * U0 / P0, 2));
          return R(U0 * U0 / P0, "Ω", { text: `Lampada "${U0} V, ${P0} W" yazılıb. Normal yanma rejimində lampanın müqaviməti nə qədərdir?`, solution: `P = U²/R → R = U₀²/P₀ = ${U0 * U0}/${P0} = ${F(U0 * U0 / P0)} Ω.` });
        }
        if (kind === "ned") {
          let U0, P0, k, U; do { U0 = pick([12, 24, 110, 220]); P0 = pick([20, 40, 60, 100, 200, 400]); k = pick([0.5, 0.6, 0.75, 0.8, 0.25, 0.9]); U = U0 * k; } while (!nice(U, 2) || !nice(P0 * k * k, 2));
          return R(P0 * k * k, "W", { text: `"${U0} V, ${P0} W" lampanı ${F(U)} V-luq mənbəyə qoşdular. Lampanın müqavimətini sabit sayaraq onun real gücünü tap.`,
            solution: `R = U₀²/P₀ sabitdir. P = U²/R = P₀·(U/U₀)² = ${P0}·(${F(U)}/${U0})² = ${P0}·${F(k * k)} = ${F(P0 * k * k)} W.` });
        }
        let a, b, U, Ra, Rb, I, Pa, Pb;
        const pool = []; for (const x of PL) for (const y of PL) if (x !== y) pool.push([x, y]);
        if (kind === "ser" || kind === "rat") {
          do { [a, b] = pick(pool); Ra = 144 / a; Rb = 144 / b; U = pick([12, 18, 24, 36]); I = U / (Ra + Rb); Pa = I * I * Ra; Pb = I * I * Rb; } while (!nice(Pa, 2) || !nice(Pb, 2) || !nice(Ra, 2) || !nice(Rb, 2));
          const svg = lampsSer(Ra, Rb, U);
          if (kind === "rat") return R(Math.max(Ra, Rb) / Math.min(Ra, Rb), "dəfə", { svg, text: `Müqavimətləri ${F(Ra)} Ω və ${F(Rb)} Ω olan iki lampa ardıcıl qoşulub. Parlaq yanan lampanın gücü zəif yanan lampanın gücündən neçə dəfə böyükdür?`,
            solution: `Ardıcılda cərəyan eynidir, P = I²R. Güclər müqavimətlərin nisbəti kimidir: ${F(Math.max(Ra, Rb))}/${F(Math.min(Ra, Rb))} = ${F(Math.max(Ra, Rb) / Math.min(Ra, Rb))}. Böyük müqavimətli lampada daha çox güc ayrılır (daha parlaq sayılır).` });
          return R(Math.max(Pa, Pb), "W", { svg, text: `Müqavimətləri ${F(Ra)} Ω və ${F(Rb)} Ω olan iki lampa ${U} V-luq mənbəyə ardıcıl qoşulub. Parlaq yanan lampanın gücü nə qədərdir?`,
            solution: `I = ${U}/(${F(Ra)} + ${F(Rb)}) = ${F(I)} A. Ardıcılda böyük müqavimətli lampa parlaqdır: P = I²R = ${F(I * I)}·${F(Math.max(Ra, Rb))} = ${F(Math.max(Pa, Pb))} W.` });
        }
        do { [a, b] = pick(pool); Ra = 144 / a; Rb = 144 / b; U = pick([6, 12, 18, 24]); Pa = U * U / Ra; Pb = U * U / Rb; } while (!nice(Pa, 2) || !nice(Pb, 2) || !nice(Ra, 2) || !nice(Rb, 2));
        return R(Math.max(Pa, Pb), "W", { svg: lampsPar(Ra, Rb, U), text: `Müqavimətləri ${F(Ra)} Ω və ${F(Rb)} Ω olan iki lampa ${U} V-luq mənbəyə paralel qoşulub. Parlaq yanan lampanın gücü nə qədərdir?`,
          solution: `Paralelda gərginlik eynidir, P = U²/R: kiçik müqavimətli lampa parlaqdır. P = ${U * U}/${F(Math.min(Ra, Rb))} = ${F(Math.max(Pa, Pb))} W.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          const I = pick([2, 3, 4, 5]), Rv = pick([5, 10, 20, 25]), tm = pick([2, 3, 5]), Q = I * I * Rv * tm * 60;
          task = `Spiralın müqaviməti ${Rv} Ω-dur, ondan ${I} A cərəyan ${tm} dəqiqə keçir. Spiralda neçə coul istilik ayrılır?`;
          steps = [`Coul–Lens qanunu: Q = I²Rt.`, `Vaxt: t = ${tm} dəq = ${tm * 60} s.`, `Q = ${I}²·${Rv}·${tm * 60} = ${F(Q)} J.`];
          if (bad === 0) { const w = I * Rv * tm * 60; steps = [`Coul–Lens qanunu: Q = I·R·t.`, `Vaxt: t = ${tm} dəq = ${tm * 60} s.`, `Q = ${I}·${Rv}·${tm * 60} = ${F(w)} J.`]; }
          if (bad === 1) { const w = I * I * Rv * tm; steps[1] = `Vaxt: t = ${tm} dəq (saniyəyə çevirmək lazım deyil).`; steps[2] = `Q = ${I}²·${Rv}·${tm} = ${F(w)} J.`; }
          if (bad === 2) steps[2] = `Q = ${I}²·${Rv}·${tm * 60} = ${F(I * Rv * tm * 60 * I + 600)} J.`;
          why = [`1-ci addım: istilik cərəyanın kvadratı ilə mütənasibdir: Q = I²Rt. Düz cavab: ${F(Q)} J.`, `2-ci addım: SI-də vaxt saniyə ilə verilir: ${tm} dəq = ${tm * 60} s. Düz cavab: ${F(Q)} J.`, `3-cü addım: ${I * I}·${Rv}·${tm * 60} = ${F(Q)}, hesablama səhvi var.`][bad];
        } else {
          let m, dT, P, eta, t; do { m = pick([1, 2, 3]); dT = pick([20, 40, 50, 60, 80]); P = pick([1000, 1500, 2000, 2100]); eta = pick([0.8, 0.75, 0.5, 0.6, 0.7]); t = c * m * dT / (P * eta); } while (!nice(t, 1) || t > 1200);
          const Q = c * m * dT, A = Q / eta;
          task = `${P} W-lıq qızdırıcının faydalı iş əmsalı ${F(eta * 100)}%-dir. ${m} kq suyu ${dT} °C qızdırmaq üçün neçə saniyə lazımdır? (c = 4200 J/(kg·°C))`;
          steps = [`Suyun aldığı istilik: Q = c·m·ΔT = 4200·${m}·${dT} = ${F(Q)} J.`, `Qızdırıcının görməli işi: A = Q/η = ${F(Q)}/${F(eta)} = ${F(A)} J.`, `t = A/P = ${F(A)}/${P} = ${F(t)} s.`];
          if (bad === 0) { const T2 = 20 + dT; steps[0] = `Suyun aldığı istilik: Q = c·m·T = 4200·${m}·${T2} = ${F(c * m * T2)} J (son temperatur ${T2} °C götürülüb).`; steps[1] = `Qızdırıcının görməli işi: A = Q/η = ${F(c * m * T2)}/${F(eta)} = ${F(c * m * T2 / eta)} J.`; steps[2] = `t = A/P = ${F(c * m * T2 / eta)}/${P} = ${F(+(c * m * T2 / eta / P).toFixed(3))} s.`; }
          if (bad === 1) { steps[1] = `Qızdırıcının görməli işi: A = Q·η = ${F(Q)}·${F(eta)} = ${F(Q * eta)} J.`; steps[2] = `t = A/P = ${F(Q * eta)}/${P} = ${F(+(Q * eta / P).toFixed(3))} s.`; }
          if (bad === 2) steps[2] = `t = P/A = ${P}/${F(A)} = ${F(+(P / A).toFixed(5))} s.`;
          why = [`1-ci addım: ΔT = temperaturun dəyişməsidir (burada ${dT} °C), son temperatur yox. Düz cavab: ${F(t)} s.`, `2-ci addım: faydalı iş əmsalı η < 1 olduğu üçün qızdırıcı daha çox iş görməlidir: A = Q/η, Q·η yox. Düz cavab: ${F(t)} s.`, `3-cü addım: P = A/t → t = A/P, tərsinə yox. Düz cavab: ${F(t)} s.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Çaydan, ütü, uzadıcı, elektromobil — hamısı P = UI və A = Pt-dir.",
      gen() {
        const kind = pick(["utu", "sigorta", "uzadici", "cay", "avto"]);
        if (kind === "utu") { let P, U = 220, I; do { P = pick([1100, 1500, 1650, 2200, 2000, 880, 440]); I = P / U; } while (!nice(I, 3));
          return R(I, "A", { text: `Ütünün üzərində "220 V, ${P} W" yazılıb. İşləyəndə ütüdən keçən cərəyan nə qədərdir?`, solution: `I = P/U = ${P}/220 = ${F(I)} A.` }); }
        if (kind === "sigorta") { const I = pick([10, 16, 20, 25, 32]);
          return R(220 * I, "W", { text: `Mənzilin 220 V-luq xəttində ${I} A-lik sigorta var. Eyni anda paralel işləyə biləcək cihazların ümumi gücü ən çox nə qədər ola bilər?`, solution: `P = U·I = 220·${I} = ${220 * I} W (paralel cihazların cərəyanları toplanır, sigorta ümumi cərəyanı kəsir).` }); }
        if (kind === "uzadici") { let I, r, t; do { I = pick([5, 8, 10, 12, 15]); r = pick([0.1, 0.2, 0.25, 0.5]); t = pick([10, 20, 30, 60]); } while (!nice(I * I * r * t, 1));
          return R(I * I * r * t, "J", { text: `Uzadıcı məftilin müqaviməti ${F(r)} Ω-dur. Ondan ${I} A cərəyan ${t} s keçir. Məftildə neçə coul istilik ayrılır?`, solution: `Q = I²Rt = ${I * I}·${F(r)}·${t} = ${F(I * I * r * t)} J. (Məftil nə qədər nazik olsa, r böyükdür, istilik çoxdur.)` }); }
        if (kind === "cay") { let P, tm, E; do { P = pick([1000, 1500, 2000, 2200, 2500]); tm = pick([3, 4, 5, 6, 9, 12]); E = P / 1000 * tm / 60; } while (!nice(E, 3));
          return R(E, "kWh", { text: `${P} W-lıq çaydan suyu ${tm} dəqiqəyə qaynadır. Bu müddətdə sayğac neçə kWh göstərəcək?`, solution: `t = ${tm} dəq = ${F(tm / 60)} saat. E = ${F(P / 1000)} kW · ${F(tm / 60)} saat = ${F(E)} kWh.` }); }
        let C, P, t; do { C = pick([40, 60, 75, 80]); P = pick([2, 4, 5, 8, 10, 20]); t = C / P; } while (!nice(t, 1));
        return R(t, "saat", { text: `Elektromobilin akkumulyatorunun tutumu ${C} kWh-dir. Onu ${P} kW gücündə stansiya ilə tam boşdan dolduranda neçə saat çəkər? (Enerji itkisi yoxdur.)`, solution: `t = E/P = ${C} kWh / ${P} kW = ${F(t)} saat.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a figure (circuit, graph,
  // meter, wires, motor), several steps; the wrong options are the answers of typical mistakes. Joined topics:
  // fiz-om (2, 5), fiz-istilik (3), fiz-cereyan (9: R = ρl/S), fiz-is-guc (10: P = Fv).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const fr = ([p, q]) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : p / g + "/" + q / g; };
  const S = (w, hh, inner, aria) => svgEl(CK.svg(w, hh, inner, "oy-svg", aria));
  const T = CK.text, Ln = CK.line, INK = CK.INK, MUT = CK.MUT;
  const RS = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40];
  const PAIRS = []; for (let a = 2; a <= 40; a++) for (let b = a + 1; b <= 60; b++) if ((a * b) % (a + b) === 0) PAIRS.push([a, b, a * b / (a + b)]);
  const NOM = []; for (const u of [6, 12, 24]) for (const p of [3, 6, 9, 12, 18, 24, 36, 48]) if (nice(u * u / p, 2)) NOM.push([u, p]);
  const term = (x, y) => `<circle cx="${x}" cy="${y}" r="3.5" fill="${CK.PAP}" stroke="${INK}" stroke-width="2"/>`;
  // two lamps in series, nominal values written above them
  const figLamps = (l1, l2, uLab) => CK.svg(300, 150, CK.wire([[40, 70], [40, 40], [260, 40], [260, 120], [40, 120], [40, 80]])
    + CK.lamp(110, 40) + CK.lamp(200, 40) + T(110, 22, l1, "middle", INK, 12) + T(200, 22, l2, "middle", INK, 12) + T(110, 66, "L₁") + T(200, 66, "L₂")
    + CK.bat(40, 75, uLab), "oy-svg", "Ardıcıl iki lampa: L₁ " + l1 + ", L₂ " + l2 + "; mənbə " + uLab);
  // R1 in series, R2 and R3 in parallel; names and values in the figure
  const figMixed = (r1, r2, r3, U) => CK.net({ ser: ["R₁"], br: [["R₂"], ["R₃"]], U: U + " V", cls: "oy-svg", aria: `R₁ = ${r1} Ω ardıcıl; R₂ = ${r2} Ω və R₃ = ${r3} Ω paralel; U = ${U} V`,
    extra: T(80, 60, r1 + " Ω", "middle", MUT, 12) + T(142, 121, r2 + " Ω", "start", MUT, 12) + T(212, 121, r3 + " Ω", "start", MUT, 12) });
  // water temperature against time (a straight line from (0, T0) to (tm, T1))
  function figTT(T0, T1, tm) { const X = t => 45 + t * 200 / (tm + 1), Y = v => 170 - v * 1.4, st = tm > 6 ? 2 : 1;
    let s = Ln(45, 170, 265, 170) + Ln(45, 170, 45, 20) + T(270, 186, "t, dəq", "end", INK, 12) + T(40, 16, "T, °C", "end", INK, 12);
    for (let t = st; t <= tm; t += st) s += Ln(X(t), 170, X(t), 30, MUT, 0.6) + T(X(t), 185, t, "middle", MUT, 11);
    for (let v = 10; v <= 100; v += 10) s += Ln(45, Y(v), 255, Y(v), MUT, 0.6) + T(39, Y(v) + 4, v, "end", MUT, 11);
    s += T(39, 174, 0, "end", MUT, 11) + Ln(X(0), Y(T0), X(tm), Y(T1), CK.ACC, 2.5) + `<circle cx="${CK.f(X(0))}" cy="${CK.f(Y(T0))}" r="3.5" fill="${CK.ACC}"/><circle cx="${CK.f(X(tm))}" cy="${CK.f(Y(T1))}" r="3.5" fill="${CK.ACC}"/>`
      + Ln(X(tm), Y(T1), X(tm), 170, CK.ACC, 1.2, ` stroke-dasharray="4 3"`) + Ln(45, Y(T1), X(tm), Y(T1), CK.ACC, 1.2, ` stroke-dasharray="4 3"`);
    return CK.svg(280, 195, s, "oy-svg", `Suyun temperaturunun zamandan asılılığı: ${T0} °C-dən ${T1} °C-yə ${tm} dəqiqəyə`); }
  // two spirals: alone, in series, in parallel (the same mains voltage each time)
  function figSpirals(t1, ts) { const y = 60;
    let s = Ln(20, y, 90, y) + term(20, y) + term(90, y) + CK.res(55, y, "h", "R₁") + T(55, 112, `t₁ = ${t1} dəq`, "middle", INK, 12);
    s += Ln(115, y, 235, y) + term(115, y) + term(235, y) + CK.res(148, y, "h", "R₁") + CK.res(202, y, "h", "R₂") + T(175, 112, `ardıcıl: ${ts} dəq`, "middle", INK, 12);
    s += Ln(250, y, 262, y) + Ln(318, y, 330, y) + term(250, y) + term(330, y) + Ln(262, 45, 262, 80) + Ln(318, 45, 318, 80) + Ln(262, 45, 318, 45) + Ln(262, 80, 318, 80)
      + CK.dot(262, y) + CK.dot(318, y) + CK.res(290, 45, "h", "R₁") + CK.res(290, 80, "h", "R₂") + T(290, 112, "paralel: ?", "middle", CK.ACC, 12);
    return CK.svg(345, 125, s, "oy-svg", `Spirallar: yalnız R₁ — ${t1} dəq, ardıcıl R₁ və R₂ — ${ts} dəq, paralel — ?`); }
  // I–U graph: two lines through the origin, each through a marked grid point
  function figGraph(p1, p2) { const X = u => 40 + u * 15, Y = i => 160 - i * 22;
    let s = Ln(40, 160, 235, 160) + Ln(40, 160, 40, 15) + T(240, 176, "U, V") + T(34, 16, "I, A", "end");
    for (let u = 2; u <= 12; u += 2) s += Ln(X(u), 160, X(u), 22, MUT, 0.6) + T(X(u), 176, u, "middle", MUT, 11);
    for (let i = 1; i <= 6; i++) s += Ln(40, Y(i), 220, Y(i), MUT, 0.6) + T(32, Y(i) + 4, i, "end", MUT, 11);
    [[p1, CK.ACC, "1"], [p2, CK.VEC, "2"]].forEach(([[u, i], col, n]) => { const k = Math.min(12 / u, 6.5 / i); s += Ln(40, 160, X(u * k), Y(i * k), col, 2.5) + `<circle cx="${X(u)}" cy="${Y(i)}" r="3.5" fill="${col}"/>` + T(X(u * k) + 4, Y(i * k) - 4, n, "start", col); });
    return CK.svg(260, 190, s, "oy-svg", `Cərəyanın gərginlikdən asılılığı: 1 — (${p1[0]} V; ${p1[1]} A), 2 — (${p2[0]} V; ${p2[1]} A)`); }
  // electricity meter readings before and after
  const kwh = x => x.toFixed(1).replace(".", ",");
  function figMeter(E1, E2, tm) { const box = (x, lab, v) => `<rect x="${x}" y="40" width="120" height="40" rx="4" fill="${CK.PAP}" stroke="${INK}" stroke-width="2"/>` + T(x + 60, 30, lab, "middle", MUT, 12)
      + T(x + 52, 67, kwh(v), "middle", INK, 18) + T(x + 116, 76, "kWh", "end", MUT, 9);
    return CK.svg(300, 95, box(20, "əvvəl", E1) + box(160, `${tm} dəq sonra`, E2) + CK.arrow(142, 60, 158, 60), "oy-svg", `Sayğac: əvvəl ${kwh(E1)} kWh, ${tm} dəq sonra ${kwh(E2)} kWh`); }
  // L1 in series, L2 and L3 in parallel
  const figThree = () => CK.svg(270, 200, CK.wire([[40, 95], [40, 36], [230, 36]]) + CK.wire([[40, 105], [40, 164], [230, 164]]) + Ln(160, 36, 160, 164) + Ln(230, 36, 230, 164)
    + CK.dot(160, 36) + CK.dot(160, 164) + CK.lamp(95, 36, "L₁") + CK.lamp(160, 100, "L₂", "r") + CK.lamp(230, 100, "L₃", "r") + CK.bat(40, 100, "U"), "oy-svg", "L₁ ardıcıl; L₂ və L₃ paralel; üç eyni lampa");
  // two wires of the same material, thickness ∝ diameter
  function figWires(par, l1, d1, l2, d2) { let s = "";
    if (!par) { s = Ln(15, 60, 30, 60) + term(15, 60) + Ln(30, 60, 140, 60, INK, 3 * d1) + Ln(140, 60, 160, 60) + CK.dot(150, 60) + Ln(160, 60, 270, 60, INK, 3 * d2) + Ln(270, 60, 285, 60) + term(285, 60)
      + T(85, 36, `l₁ = ${l1} m`, "middle", INK, 12) + T(85, 92, `d₁ = ${d1} mm`, "middle", INK, 12) + T(215, 36, `l₂ = ${l2} m`, "middle", INK, 12) + T(215, 92, `d₂ = ${d2} mm`, "middle", INK, 12) + T(85, 112, "1", "middle", CK.ACC) + T(215, 112, "2", "middle", CK.ACC);
      return CK.svg(300, 120, s, "oy-svg", `Ardıcıl iki məftil: 1 — ${l1} m, ${d1} mm; 2 — ${l2} m, ${d2} mm`); }
    s = Ln(15, 85, 40, 85) + term(15, 85) + Ln(260, 85, 285, 85) + term(285, 85) + Ln(40, 45, 40, 125) + Ln(260, 45, 260, 125) + CK.dot(40, 85) + CK.dot(260, 85)
      + Ln(40, 45, 260, 45, INK, 3 * d1) + Ln(40, 125, 260, 125, INK, 3 * d2)
      + T(150, 28, `1:  l₁ = ${l1} m,  d₁ = ${d1} mm`, "middle", INK, 12) + T(150, 108, `2:  l₂ = ${l2} m,  d₂ = ${d2} mm`, "middle", INK, 12);
    return CK.svg(300, 140, s, "oy-svg", `Paralel iki məftil: 1 — ${l1} m, ${d1} mm; 2 — ${l2} m, ${d2} mm`); }
  // motor lifting a load at constant speed
  const figMotor = () => CK.svg(260, 190, CK.wire([[40, 80], [40, 40], [134, 40]]) + CK.wire([[40, 90], [40, 130], [110, 130], [110, 52], [139, 52]])
    + `<circle cx="150" cy="40" r="16" fill="${CK.PAP}" stroke="${INK}" stroke-width="2"/>` + T(150, 45, "M") + Ln(150, 56, 150, 140, INK, 1.5)
    + `<rect x="132" y="140" width="36" height="28" fill="var(--accent-soft,#f3dede)" stroke="${INK}" stroke-width="2"/>` + T(150, 159, "m")
    + CK.arrow(190, 165, 190, 125) + T(198, 148, "v", "start", CK.ACC) + CK.bat(40, 85, "U"), "oy-svg", "Elektrik mühərriki yükü sabit sürətlə qaldırır");

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. two lamps in series: the real power of one of them (not the nominal one)
    { tip: "qapali", gen: () => again(() => {
      const [U1, P1] = pick(NOM), [U2, P2] = pick(NOM), R1 = U1 * U1 / P1, R2 = U2 * U2 / P2, U = pick([6, 9, 12, 15, 16, 18, 20, 24, 30, 36]);
      if (R1 === R2) return null;
      const I = U / (R1 + R2), right = I * I * R1, w = [P1, U * U / R1, U * U / 4 / R1, I * I * R2];
      if (!nice(I, 3) || I > Math.min(P1 / U1, P2 / U2) + 1e-9 || ![right, ...w].every(x => ok2(x))) return null; // neither lamp above its nominal power
      const l1 = `${U1} V, ${P1} W`, l2 = `${U2} V, ${P2} W`;
      return mc(ae(right, w, U_("W")), { svg: svgEl(figLamps(l1, l2, U + " V")), text: `Lampalarda nominal qiymətlər yazılıb: L₁ — "${l1}", L₂ — "${l2}". Lampalar ${U} V-luq mənbəyə ardıcıl qoşulub. Lampaların müqavimətini sabit sayaraq L₁-də ayrılan gücü tap. (Mənbənin daxili müqaviməti yoxdur.)`,
        solution: `Şəkildən: L₁ "${l1}", L₂ "${l2}", U = ${U} V. R₁ = U₁²/P₁ = ${U1 * U1}/${P1} = ${F(R1)} Ω, R₂ = ${U2 * U2}/${P2} = ${F(R2)} Ω. Ardıcılda cərəyan eynidir: I = U/(R₁+R₂) = ${U}/${F(R1 + R2)} = ${F(I)} A. P₁ = I²R₁ = ${F(I * I)}·${F(R1)} = ${F(right)} W. Tələlər: nominal gücü yazmaq (${P1} W), lampanı mənbəyə tək qoşulmuş saymaq U²/R₁ (${F(w[1])} W), gərginliyi yarı bölmək (${F(w[2])} W), L₂-nin gücü (${F(w[3])} W).` });
    }) },
    // 2. power in one parallel branch of a mixed circuit
    { tip: "qapali", birlesik: "fiz-om", gen: () => again(() => {
      const [r2, r3, r23] = pick(PAIRS), r1 = pick(RS), I = pick([0.5, 1, 1.5, 2, 3, 4]), U = I * (r1 + r23);
      if (!Number.isInteger(U) || U > 240) return null;
      const U23 = I * r23, right = U23 * U23 / r2, w = [U * U / r2, I * I * r2, U * I, U23 * U23 / r3];
      if (![right, ...w].every(x => ok2(x))) return null;
      return mc(ae(right, w, U_("W")), { svg: svgEl(figMixed(r1, r2, r3, U)), text: `Sxemdə R₁ = ${r1} Ω, R₂ = ${r2} Ω, R₃ = ${r3} Ω, mənbənin gərginliyi U = ${U} V (mənbə ideal, naqillərin müqaviməti yoxdur). R₂ rezistorunda ayrılan güc nə qədərdir?`,
        solution: `R₂ və R₃ paraleldir: R₂₃ = ${r2}·${r3}/(${r2}+${r3}) = ${F(r23)} Ω. Ümumi müqavimət R = R₁ + R₂₃ = ${F(r1 + r23)} Ω, I = U/R = ${U}/${F(r1 + r23)} = ${F(I)} A. Qolların gərginliyi U₂₃ = I·R₂₃ = ${F(U23)} V. P₂ = U₂₃²/R₂ = ${F(U23 * U23)}/${r2} = ${F(right)} W. Tələlər: bütün U-nu R₂-yə vermək (${F(w[0])} W), ümumi cərəyanla I²R₂ (${F(w[1])} W), bütün dövrənin gücü UI (${F(w[2])} W), R₃-ün gücü (${F(w[3])} W).` });
    }) },
    // 3. kettle power from a temperature–time graph and the efficiency
    { tip: "qapali", birlesik: "fiz-istilik", gen: () => again(() => {
      const m = pick([0.5, 1, 1.5, 2, 2.5, 3]), T0 = pick([10, 20, 30]), T1 = pick([60, 70, 80, 90, 100]), tm = pick([2, 3, 4, 5, 6, 8, 10]), eta = pick([0.5, 0.6, 0.7, 0.75, 0.8, 0.84, 0.9]);
      const Q = c * m * (T1 - T0), t = tm * 60, right = Q / (eta * t);
      if (!nice(right, 0) || right < 300 || right > 3000) return null;
      const w = [c * m * T1 / (eta * t), Q * eta / t, Q / (eta * tm), Q / t];
      if (!w.every(x => ok2(x, 1))) return null;
      return mc(ae(right, w, U_("W")), { svg: svgEl(figTT(T0, T1, tm)), text: `Elektrik çaydanındakı ${F(m)} kq suyun temperaturunun zamandan asılılıq qrafiki şəkildədir. Çaydanın faydalı iş əmsalı ${F(eta * 100)}%-dir. Çaydanın gücü nə qədərdir? (c = 4200 J/(kg·°C))`,
        solution: `Qrafikdən: ${tm} dəqiqədə su ${T0} °C-dən ${T1} °C-yə qızır, ΔT = ${T1 - T0} °C, t = ${tm} dəq = ${t} s. Q = c·m·ΔT = 4200·${F(m)}·${T1 - T0} = ${F(Q)} J. η = Q/(P·t) → P = Q/(η·t) = ${F(Q)}/(${F(eta)}·${t}) = ${F(right)} W. Tələlər: ΔT əvəzinə son temperatur (${F(+w[0].toFixed(1))} W), η-ya bölmək əvəzinə vurmaq (${F(+w[1].toFixed(1))} W), dəqiqəni saniyəyə çevirməmək (${F(+w[2].toFixed(1))} W), η-nı unutmaq (${F(+w[3].toFixed(1))} W).` });
    }) },
    // 4. two spirals of a kettle: alone, in series → in parallel
    { tip: "qapali", gen: () => again(() => {
      const t1 = rnd(3, 30), t2 = rnd(3, 40), ts = t1 + t2, tp = t1 * t2 / ts;
      if (t1 === t2 || !nice(tp, 1)) return null;
      const w = [t2, ts / 4, ts / 2, t1 / 2];
      if (![tp, ...w].every(x => ok2(x))) return null;
      return mc(ae(tp, w, U_("dəq")), { svg: svgEl(figSpirals(t1, ts)), text: `Elektrik çaydanının iki spiralı var. Hər təcrübədə eyni kütləli su eyni başlanğıc temperaturdan qaynama temperaturunadək qızdırılır. Yalnız birinci spiral qoşulanda su ${t1} dəqiqəyə qaynayır, iki spiral ardıcıl qoşulanda — ${ts} dəqiqəyə. Spiralları paralel qoşsaq, eyni su neçə dəqiqəyə qaynayar? (Şəbəkənin gərginliyi hər dəfə eynidir, spiralların müqaviməti sabitdir, istilik itkisi yoxdur.)`,
        solution: `Şəkildən: t₁ = ${t1} dəq, ardıcıl ${ts} dəq. Lazım olan istilik eynidir: Q = U²t/R, yəni t ∝ R. Ardıcıl: R₁ + R₂ → t₁ + t₂ = ${ts}, deməli t₂ = ${ts} − ${t1} = ${t2} dəq. Paralel: R = R₁R₂/(R₁+R₂) → t = t₁t₂/(t₁+t₂) = ${t1}·${t2}/${ts} = ${F(tp)} dəq. Tələlər: t₂-ni tapıb dayanmaq (${t2} dəq), spiralları eyni saymaq (${F(w[1])} dəq və ${F(w[3])} dəq), "orta" vaxt (${F(w[2])} dəq).` });
    }) },
    // 5. two resistors from an I–U graph, joined in series: power of the first one
    { tip: "qapali", birlesik: "fiz-om", minVariety: 10, gen: () => again(() => {
      const pts = [[2, 4], [2, 2], [4, 2], [6, 2], [6, 3], [12, 6], [12, 4], [12, 3], [10, 2], [8, 4], [9, 3], [4, 4], [6, 4], [8, 2], [12, 2]];
      const p1 = pick(pts), p2 = pick(pts), R1 = p1[0] / p1[1], R2 = p2[0] / p2[1], U = pick([6, 9, 12, 18, 24, 36]);
      if (R1 === R2) return null;
      const I = U / (R1 + R2), right = I * I * R1, w = [U * U / R1, U * U / (R1 + R2), I * I * R2, U * U / 4 / R1];
      if (![right, ...w].every(x => ok2(x))) return null;
      return mc(ae(right, w, U_("W")), { svg: svgEl(figGraph(p1, p2)), text: `Qrafikdə 1 və 2 rezistorlarından keçən cərəyanın gərginlikdən asılılığı verilib. Bu rezistorlar ${U} V-luq mənbəyə ardıcıl qoşulub (mənbə ideal). 1 nömrəli rezistorda ayrılan güc nə qədərdir?`,
        solution: `Qrafikdən: 1 xətti (${p1[0]} V; ${p1[1]} A) nöqtəsindən keçir → R₁ = ${p1[0]}/${p1[1]} = ${F(R1)} Ω; 2 xətti (${p2[0]} V; ${p2[1]} A) → R₂ = ${p2[0]}/${p2[1]} = ${F(R2)} Ω. I = U/(R₁+R₂) = ${U}/${F(R1 + R2)} = ${F(+I.toFixed(4))} A. P₁ = I²R₁ = ${F(right)} W. Tələlər: bütün U-nu R₁-ə vermək (${F(w[0])} W), bütün dövrənin gücü (${F(w[1])} W), 2-nin gücü (${F(w[2])} W), gərginliyi yarı bölmək (${F(w[3])} W).` });
    }) },
    // 6. power of a device from the meter readings
    { tip: "qapali", gen: () => again(() => {
      const dE = pick([1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15]) / 10, tm = pick([6, 12, 15, 18, 24, 30, 36, 45]), E1 = rnd(10000, 79999) / 10, E2 = E1 + dE;
      const right = dE * 1000 / (tm / 60); if (!nice(right, 0) || right < 200 || right > 3000) return null;
      const w = [dE * 1000 / tm, right / 1000, right * 60, dE * 1000];
      if (![right, ...w].every(x => ok2(x, 3))) return null;
      return mc(ae(right, w, U_("W")), { svg: svgEl(figMeter(E1, E2, tm)), text: `Evdə yalnız elektrik qızdırıcısı işləyir və sabit güclə fasiləsiz çalışır. Şəkildə elektrik sayğacının ${tm} dəqiqə fərqlə iki göstərişi verilib. Qızdırıcının gücü nə qədərdir?`,
        solution: `Şəkildən: ${kwh(E1)} kWh və ${kwh(E2)} kWh. Sərf olunan enerji: E = ${kwh(E2)} − ${kwh(E1)} = ${F(dE)} kWh. Vaxt: ${tm} dəq = ${F(tm / 60)} saat. P = E/t = ${F(dE)}/${F(tm / 60)} = ${F(right / 1000)} kW = ${F(right)} W. Tələlər: dəqiqəni saata çevirməmək (${F(+w[0].toFixed(3))} W), kW-ı W kimi yazmaq (${F(w[1])} W), vaxtı unutmaq (${F(w[3])} W), J-u dəqiqəyə bölmək (${F(w[2])} W).` });
    }) },
    // 7. three identical lamps: L1 in series with L2 ∥ L3
    { tip: "qapali", gen: () => again(() => {
      const kind = pick(["cem", "L1"]);
      if (kind === "cem") { const P1 = pick([4, 6, 8, 10, 12, 16, 20, 24, 30, 36, 40, 48, 60, 80]);
        return mc(ae(1.5 * P1, [3 * P1, P1, 1.25 * P1, 2 * P1], U_("W")), { svg: svgEl(figThree()), text: `Üç eyni lampa şəkildəki kimi qoşulub (lampaların müqaviməti sabitdir). L₁ lampasında ${P1} W güc ayrılır. Üç lampada birlikdə ayrılan güc nə qədərdir?`,
          solution: `L₂ və L₃ eynidir, paraleldir: L₁-in cərəyanı onlara yarı bölünür, I₂ = I₁/2. P = I²R: P₂ = P₃ = P₁/4 = ${F(P1 / 4)} W. Cəmi: ${P1} + 2·${F(P1 / 4)} = ${F(1.5 * P1)} W. Tələlər: cərəyan yarıya düşəndə gücü də yarıya salmaq (${F(2 * P1)} W), lampaları eyni güclü saymaq (${3 * P1} W), L₃-ü unutmaq (${F(1.25 * P1)} W).` }); }
      const P2 = pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25]);
      return mc(ae(4 * P2, [2 * P2, P2, P2 / 4, 6 * P2], U_("W")), { svg: svgEl(figThree()), text: `Üç eyni lampa şəkildəki kimi qoşulub (lampaların müqaviməti sabitdir). L₂ lampasında ${P2} W güc ayrılır. L₁ lampasında nə qədər güc ayrılır?`,
        solution: `L₁-in cərəyanı L₂ və L₃ arasında yarı bölünür: I₁ = 2I₂. P = I²R, R eyni: P₁ = 2²·P₂ = 4·${P2} = ${4 * P2} W. Tələlər: cərəyan 2 dəfə → güc 2 dəfə (${2 * P2} W), nisbəti tərsinə yazmaq (${F(P2 / 4)} W), üç lampanın cəmi (${6 * P2} W).` });
    }) },
    // 8. two lamps in series: the largest voltage so that none is overloaded
    { tip: "qapali", gen: () => again(() => {
      const [U1, P1] = pick(NOM), [U2, P2] = pick(NOM), I1 = P1 / U1, I2 = P2 / U2, R1 = U1 * U1 / P1, R2 = U2 * U2 / P2;
      if (I1 === I2) return null;
      const Im = Math.min(I1, I2), right = Im * (R1 + R2), w = [U1 + U2, Math.max(I1, I2) * (R1 + R2), (I1 + I2) * (R1 + R2), Math.min(U1, U2)];
      if (![right, ...w].every(x => ok2(x))) return null;
      const l1 = `${U1} V, ${P1} W`, l2 = `${U2} V, ${P2} W`;
      return mc(ae(right, w, U_("V")), { svg: svgEl(figLamps(l1, l2, "U")), text: `"${l1}" və "${l2}" lampaları ardıcıl qoşulub. Heç bir lampa nominal rejimdən artıq yüklənməsin deyə onlara ən çox hansı gərginliyi vermək olar? (Lampaların müqaviməti sabitdir.)`,
        solution: `Şəkildən: "${l1}", "${l2}". Nominal cərəyanlar: I₁ = ${P1}/${U1} = ${F(I1)} A, I₂ = ${P2}/${U2} = ${F(I2)} A. Müqavimətlər: R₁ = ${U1 * U1}/${P1} = ${F(R1)} Ω, R₂ = ${U2 * U2}/${P2} = ${F(R2)} Ω. Ardıcılda cərəyan eynidir, kiçik nominal cərəyanı aşmamalıdır: I = ${F(Im)} A. U = I(R₁+R₂) = ${F(Im)}·${F(R1 + R2)} = ${F(right)} V. Tələlər: nominal gərginlikləri toplamaq (${U1 + U2} V), böyük cərəyanı götürmək (${F(w[1])} V), cərəyanları toplamaq (${F(w[2])} V), paralel kimi kiçik gərginlik (${Math.min(U1, U2)} V).` });
    }) },
    // 9. two wires of one material: heat ratio (R = ρl/S, S ∝ d²)
    { tip: "qapali", birlesik: "fiz-cereyan", gen: () => again(() => {
      const par = Math.random() < .5, l1 = rnd(1, 6), l2 = rnd(1, 6), d1 = rnd(1, 3), d2 = rnd(1, 3);
      if (d1 === d2) return null;
      const s = [l1 * d2 * d2, l2 * d1 * d1], inv = x => [x[1], x[0]], un = [l1 * d2, l2 * d1], dd = [d2 * d2, d1 * d1];
      const right = par ? inv(s) : s, w = par ? [s, inv(un), un, inv(dd)] : [inv(s), un, inv(un), dd];
      if (fr(right) === "1") return null;
      const o = ae(fr(right), w.map(fr), x => x);
      return mc(o, { svg: svgEl(figWires(par, l1, d1, l2, d2)), text: `Eyni materialdan olan iki bircins məftil (müqavimətin temperaturdan asılılığını nəzərə almayın) dövrəyə ${par ? "paralel" : "ardıcıl"} qoşulub: birincinin uzunluğu ${l1} m, diametri ${d1} mm; ikincinin uzunluğu ${l2} m, diametri ${d2} mm. Eyni müddətdə məftillərdə ayrılan istilik miqdarlarının nisbəti Q₁/Q₂ nəyə bərabərdir?`,
        solution: `Şəkildən: l₁ = ${l1} m, d₁ = ${d1} mm; l₂ = ${l2} m, d₂ = ${d2} mm. R = ρl/S, S = πd²/4, deməli R ∝ l/d²: R₁/R₂ = (${l1}/${l2})·(${d2}/${d1})² = ${fr(s)}. ${par ? `Paralel: gərginlik eynidir, Q = U²t/R → Q₁/Q₂ = R₂/R₁ = ${fr(right)}.` : `Ardıcıl: cərəyan eynidir, Q = I²Rt → Q₁/Q₂ = R₁/R₂ = ${fr(right)}.`} Tələlər: diametri kvadrata yüksəltməmək (${fr(w[1])}), ${par ? "ardıcıl kimi Q ∝ R yazmaq" : "paralel kimi Q ∝ 1/R yazmaq"} (${fr(w[0])}), uzunluğu nəzərə almamaq (${fr(w[3])}).` });
    }) },
    // 10. motor: mass lifted at constant speed (UI = I²r + mgv)
    { tip: "qapali", birlesik: "fiz-is-guc", gen: () => again(() => {
      const U = pick([12, 24, 36, 110, 220]), I = pick([1, 2, 4, 5, 10]), r = pick([0.5, 1, 2, 4]), v = pick([0.1, 0.2, 0.4, 0.5, 1, 2]), g = 10;
      const Pm = U * I - I * I * r; if (Pm <= 0 || I * I * r < 0.1 * U * I) return null;
      const right = Pm / (g * v), w = [U * I / (g * v), Pm / v, I * I * r / (g * v), (U * I - I * r) / (g * v)];
      if (right < 1 || right > 2000 || ![right, ...w].every(x => ok2(x))) return null;
      return mc(ae(right, w, U_("kq")), { svg: svgEl(figMotor()), text: `Elektrik mühərriki ${U} V gərginlikdə ${I} A cərəyan alır, sarğısının müqaviməti ${F(r)} Ω-dur. Mühərrik yükü sabit ${F(v)} m/s sürətlə qaldırır. Yükün kütləsi nə qədərdir? (Enerji itkisi yalnız sarğıda ayrılan istilikdən ibarətdir, ip yüngüldür, g = 10 m/s².)`,
        solution: `Mühərrikin aldığı güc UI = ${U}·${I} = ${U * I} W. Sarğıda istiliyə gedən: I²r = ${I * I}·${F(r)} = ${F(I * I * r)} W. Mexaniki güc: ${U * I} − ${F(I * I * r)} = ${F(Pm)} W. Sabit sürətdə F = mg, P = Fv = mgv → m = P/(gv) = ${F(Pm)}/(10·${F(v)}) = ${F(right)} kq. Tələlər: istilik itkisini unutmaq (${F(w[0])} kq), g-ni unutmaq (${F(w[1])} kq), istilik gücünü faydalı saymaq (${F(w[2])} kq), I²r əvəzinə I·r (${F(w[3])} kq).` });
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
      key: "fiz-elektrik-guc", title: "Elektrik işi və gücü, Coul-Lens qanunu", fenn: "fizika", link: "dersler/fiz-elektrik-guc.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: J, W, A, Ω; xüsusi hallarda kWh, qəpik). Onluq kəsr vergül və ya nöqtə ilə: 0,25. c(su) = 4200 J/(kg·°C).",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["isguc", "pformul", "pformul", "qizdirici", "qizdirici", "tarif", "lampa", "lampa", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-elektrik-guc.html")) b.push("dersler/fiz-elektrik-guc.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
