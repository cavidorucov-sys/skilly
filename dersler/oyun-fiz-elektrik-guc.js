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
    { id: "lampa", ad: "Hansı lampa parlaqdır?", izah: "Lampanın parlaqlığı onun real gücünə görədir. Ardıcıl: cərəyan eynidir, P = I²R — böyük R-li lampa parlaqdır. Paralel: gərginlik eynidir, P = U²/R — kiçik R-li lampa parlaqdır. Lampanın müqaviməti R = U₀²/P₀ (sabit sayırıq).",
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
            solution: `Ardıcılda cərəyan eynidir, P = I²R. Güclər müqavimətlərin nisbəti kimidir: ${F(Math.max(Ra, Rb))}/${F(Math.min(Ra, Rb))} = ${F(Math.max(Ra, Rb) / Math.min(Ra, Rb))}. Böyük müqavimətli lampa parlaq yanır.` });
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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-elektrik-guc", title: "Elektrik işi və gücü, Coul-Lens qanunu", fenn: "fizika", link: "dersler/fiz-elektrik-guc.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: J, W, A, Ω; xüsusi hallarda kWh, qəpik). Onluq kəsr vergül və ya nöqtə ilə: 0,25. c(su) = 4200 J/(kg·°C).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["isguc", "pformul", "pformul", "qizdirici", "qizdirici", "tarif", "lampa", "lampa", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-elektrik-guc.html")) b.push("dersler/fiz-elektrik-guc.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
