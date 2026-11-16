// Fizika · Om qanunu, ardıcıl və paralel birləşmə — mastery game levels and the final test.
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
  const Om = v => F(v) + " Ω";
  const RS = [2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 50, 60];
  const PAIRS = [];
  for (let a = 2; a <= 60; a++) for (let b = a; b <= 120; b++) if ((a * b) % (a + b) === 0) PAIRS.push([a, b, a * b / (a + b)]);
  const TRIPS = [];
  for (const a of [2, 3, 4, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60]) for (const b of [3, 4, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60]) for (const c of [4, 6, 8, 12, 15, 20, 24, 30, 60]) {
    if (a <= b && b <= c) { const s = 1 / (1 / a + 1 / b + 1 / c); if (nice(s, 2) && s >= 1) TRIPS.push([a, b, c, s]); }
  }
  const UU = [6, 9, 12, 18, 24, 36, 48, 60, 110, 120, 220];
  const Vl = U => U == null ? "" : F(U) + " V";
  const ser = (labels, U) => svgEl(CK.net({ ser: labels.map(Om), U: Vl(U), cls: "oy-svg", aria: "Ardıcıl birləşmiş rezistorlar" }));
  const par = (labels, U) => svgEl(CK.net({ br: labels.map(l => [Om(l)]), U: Vl(U), cls: "oy-svg", aria: "Paralel birləşmiş rezistorlar" }));
  const mixA = (r1, r2, r3, U) => svgEl(CK.net({ ser: [Om(r1)], br: [[Om(r2)], [Om(r3)]], U: Vl(U), cls: "oy-svg", aria: "R1 ardıcıl, R2 və R3 paralel" }));
  const mixB = (r1, r2, r3, U) => svgEl(CK.net({ br: [[Om(r1), Om(r2)], [Om(r3)]], U: Vl(U), cls: "oy-svg", aria: "R1 və R2 ardıcıl, R3 onlara paralel" }));
  const MAT = [["mis", 0.017], ["alüminium", 0.028], ["volfram", 0.055], ["dəmir", 0.1], ["nixrom", 1.1]];

  const levels = [
    { id: "om", ad: "I = U/R", izah: "Om qanunu: I = U/R, U = I·R, R = U/I. Miliamperi (1 mA = 0,001 A), kiloomu (1 kΩ = 1000 Ω) SI-yə çevir.",
      gen() {
        const kind = pick(["I", "U", "R", "kil", "mA", "prop"]);
        let U, Rv, I;
        if (kind === "I") {
          do { U = pick(UU); Rv = pick([5, 10, 12, 15, 20, 24, 25, 40, 50, 60, 100, 200, 220, 440]); I = U / Rv; } while (!nice(I, 3));
          return R(I, "A", { text: `Müqaviməti ${Rv} Ω olan rezistor ${U} V gərginlikli mənbəyə qoşulub. Rezistordan keçən cərəyan şiddəti nə qədərdir?`, solution: `I = U/R = ${U}/${Rv} = ${F(I)} A.` });
        }
        if (kind === "U") {
          do { I = pick([0.1, 0.2, 0.25, 0.5, 1, 1.5, 2, 2.5, 4, 5]); Rv = pick([4, 6, 8, 10, 12, 15, 20, 24, 30, 40, 50, 100]); U = I * Rv; } while (!nice(U, 2));
          return R(U, "V", { text: `Müqaviməti ${Rv} Ω olan naqildən ${F(I)} A cərəyan keçir. Naqilin uclarındakı gərginlik nə qədərdir?`, solution: `U = I·R = ${F(I)}·${Rv} = ${F(U)} V.` });
        }
        if (kind === "R") {
          do { U = pick(UU); I = pick([0.05, 0.1, 0.2, 0.25, 0.4, 0.5, 1, 1.5, 2, 3, 4, 5]); Rv = U / I; } while (!nice(Rv, 2));
          return R(Rv, "Ω", { text: `Naqilin uclarına ${U} V gərginlik verəndə ondan ${F(I)} A cərəyan keçir. Naqilin müqaviməti nə qədərdir?`, solution: `R = U/I = ${U}/${F(I)} = ${F(Rv)} Ω.` });
        }
        if (kind === "kil") {
          let k; do { k = pick([1, 2, 2.5, 4, 5, 10, 20, 25]); U = pick([5, 10, 12, 20, 40, 50, 100, 220]); I = U / (k * 1000); } while (!nice(I, 4));
          return R(I, "A", { text: `Müqaviməti ${F(k)} kΩ olan rezistora ${U} V gərginlik verilib. Cərəyan şiddəti neçə amperdir?`, solution: `R = ${F(k)} kΩ = ${F(k * 1000)} Ω. I = U/R = ${U}/${F(k * 1000)} = ${F(I)} A.` });
        }
        if (kind === "mA") {
          let ma; do { ma = pick([10, 20, 25, 40, 50, 100, 200, 250, 500]); Rv = pick([20, 40, 60, 100, 120, 200, 400, 500, 1000]); U = ma / 1000 * Rv; } while (!nice(U, 2));
          return R(U, "V", { text: `Müqaviməti ${Rv} Ω olan rezistordan ${ma} mA cərəyan keçir. Gərginlik neçə voltdur?`, solution: `${ma} mA = ${F(ma / 1000)} A. U = I·R = ${F(ma / 1000)}·${Rv} = ${F(U)} V.` });
        }
        let U1, I1, U2, I2; do { U1 = pick([2, 3, 4, 5, 6, 8, 10]); I1 = pick([0.1, 0.2, 0.25, 0.4, 0.5]); U2 = pick([12, 15, 20, 24, 30, 40]); I2 = I1 * U2 / U1; } while (U1 === U2 || !nice(I2, 3));
        return R(I2, "A", { text: `Rezistora ${U1} V gərginlik verəndə ondan ${F(I1)} A cərəyan keçir. Gərginliyi ${U2} V-a qaldırsaq cərəyan nə qədər olar? (Rezistorun müqaviməti dəyişmir.)`,
          solution: `Cərəyan gərginliyə düz mütənasibdir: I₂ = I₁·U₂/U₁ = ${F(I1)}·${U2}/${U1} = ${F(I2)} A.` });
      } },
    { id: "mqv", ad: "Naqilin müqaviməti", izah: "R = ρ·l/S. Naqil uzananda l artır, S azalır (həcm sabitdir). Kəsiyin sahəsi iki dəfə artsa R iki dəfə azalır.",
      gen() {
        const kind = pick(["R", "R", "l", "uz", "kes", "diam"]);
        if (kind === "R" || kind === "l") {
          let m, l, S, Rv; do { m = pick(MAT); l = pick([5, 10, 20, 25, 50, 100, 200, 500]); S = pick([0.5, 1, 1.5, 2, 2.5, 4, 5, 10]); Rv = m[1] * l / S; } while (!nice(Rv, 3) || Rv < 0.05);
          if (kind === "R") return R(Rv, "Ω", { text: `${m[0][0].toUpperCase() + m[0].slice(1)} naqilin (xüsusi müqaviməti ρ = ${F(m[1])} Ω·mm²/m) uzunluğu ${l} m, en kəsiyinin sahəsi ${F(S)} mm²-dır. Naqilin müqaviməti nə qədərdir?`,
            solution: `R = ρ·l/S = ${F(m[1])}·${l}/${F(S)} = ${F(Rv)} Ω (ρ Ω·mm²/m, S mm², l m olduğu üçün vahid birbaşa Ω çıxır).` });
          return R(l, "m", { text: `Xüsusi müqaviməti ρ = ${F(m[1])} Ω·mm²/m olan, en kəsiyi ${F(S)} mm² olan naqilin müqaviməti ${F(Rv)} Ω-dur. Naqilin uzunluğu neçə metrdir?`,
            solution: `R = ρl/S → l = R·S/ρ = ${F(Rv)}·${F(S)}/${F(m[1])} = ${l} m.` });
        }
        let Rv, n, Rn;
        if (kind === "uz") {
          do { n = pick([2, 3, 4]); Rv = pick([1, 2, 2.5, 4, 5, 8, 10, 12.5, 20]); Rn = n * n * Rv; } while (!nice(Rn, 2));
          return R(Rn, "Ω", { text: `Məftilin müqaviməti ${F(Rv)} Ω-dur. Onu həcmi dəyişmədən (nazildərək) ${n} dəfə uzadıblar. Yeni müqavimət nə qədərdir?`,
            solution: `Uzunluq ${n} dəfə artır, kəsik ${n} dəfə azalır: R = ρl/S ${n}·${n} = ${n * n} dəfə artır. R' = ${n * n}·${F(Rv)} = ${F(Rn)} Ω.` });
        }
        if (kind === "kes") {
          do { n = pick([2, 3, 4, 5]); Rv = pick([8, 9, 12, 16, 18, 20, 25, 27, 36, 45, 48, 50, 72, 75, 100, 200]); Rn = Rv / (n * n); } while (!nice(Rn, 3));
          return R(Rn, "Ω", { text: `Müqaviməti ${F(Rv)} Ω olan məftili ${n} bərabər hissəyə kəsib hissələri bir dəstə edərək paralel birləşdirdilər. Alınan sistemin müqaviməti nə qədərdir?`,
            solution: `Hər hissənin müqaviməti ${F(Rv)}/${n} = ${F(Rv / n)} Ω. ${n} eyni rezistor paralel: ${F(Rv / n)}/${n} = ${F(Rn)} Ω (yəni R/${n * n}).` });
        }
        do { n = pick([2, 3, 4]); Rv = pick([8, 9, 12, 16, 18, 20, 36, 48, 72, 100, 144]); Rn = Rv / (n * n); } while (!nice(Rn, 3));
        return R(Rn, "Ω", { text: `Uzunluğu eyni olan iki mis naqildən birincinin müqaviməti ${F(Rv)} Ω-dur, ikincinin diametri birincidən ${n} dəfə böyükdür. İkinci naqilin müqaviməti nə qədərdir?`,
          solution: `Kəsiyin sahəsi diametrin kvadratı ilə mütənasibdir: ${n}² = ${n * n} dəfə böyükdür. R ${n * n} dəfə azalır: ${F(Rv)}/${n * n} = ${F(Rn)} Ω.` });
      } },
    { id: "ardicil", ad: "Ardıcıl birləşmə", izah: "Ardıcıl: cərəyan eynidir, gərginliklər toplanır, müqavimətlər toplanır (R = R₁ + R₂ + …).",
      gen() {
        const kind = pick(["Re", "Re", "I", "U2", "Rx", "lamp"]);
        const n = pick([2, 3, 3]);
        let rs, sum, Us;
        do { rs = []; for (let i = 0; i < n; i++) rs.push(pick(RS)); sum = rs.reduce((a, b) => a + b, 0); Us = UU.filter(u => nice(u / sum, 3)); } while (kind === "I" && !Us.length);
        const list = rs.map(Om).join(", ");
        if (kind === "Re") return R(sum, "Ω", { svg: ser(rs), text: `Şəkildəki ${n} rezistor ardıcıl birləşdirilib: ${list}. Ümumi müqavimət nə qədərdir?`, solution: `Ardıcıl: R = ${rs.join(" + ")} = ${sum} Ω.` });
        if (kind === "I") {
          const U = pick(Us), I = U / sum;
          return R(I, "A", { svg: ser(rs, U), text: `${n} rezistor (${list}) ardıcıl birləşdirilib və ${U} V gərginlikli mənbəyə qoşulub. Dövrədəki cərəyan nə qədərdir?`, solution: `R = ${rs.join(" + ")} = ${sum} Ω. I = U/R = ${U}/${sum} = ${F(I)} A.` });
        }
        if (kind === "U2") {
          let U, I; const r2 = rs[1];
          do { I = pick([0.1, 0.2, 0.25, 0.5, 1, 1.5, 2, 2.5, 3, 4]); } while (!nice(I * sum, 2));
          U = I * sum;
          return R(I * r2, "V", { svg: ser(rs, U), text: `${n} rezistor (${list}) ardıcıl birləşdirilib və ${F(U)} V gərginlikli mənbəyə qoşulub. İkinci rezistorun (${r2} Ω) uclarındakı gərginlik nə qədərdir?`,
            solution: `R = ${sum} Ω, I = ${F(U)}/${sum} = ${F(I)} A. Ardıcılda cərəyan eynidir: U₂ = I·R₂ = ${F(I)}·${r2} = ${F(I * r2)} V.` });
        }
        if (kind === "Rx") {
          let U, I, r1, rx; do { U = pick(UU); I = pick([0.1, 0.2, 0.25, 0.5, 1, 1.5, 2, 3, 4]); r1 = pick(RS); rx = U / I - r1; } while (!nice(U / I, 2) || rx < 1 || !nice(rx, 2));
          return R(rx, "Ω", { svg: svgEl(CK.net({ ser: [Om(r1), "R"], U: U + " V", cls: "oy-svg", aria: "Ardıcıl: məlum rezistor və naməlum R" })),
            text: `Dövrədə ${r1} Ω-luq rezistor naməlum R rezistoru ilə ardıcıl qoşulub. Mənbənin gərginliyi ${U} V, cərəyan ${F(I)} A-dir. R neçə Ω-dur?`, solution: `Ümumi müqavimət: ${U}/${F(I)} = ${F(U / I)} Ω. R = ${F(U / I)} − ${r1} = ${F(rx)} Ω.` });
        }
        let U0, k, Rl, I; do { U0 = pick([12, 24, 110, 220]); k = pick([2, 3, 4, 5]); Rl = pick([4, 6, 8, 10, 12, 20, 22, 44]); I = U0 / (k * Rl); } while (!nice(I, 3));
        const lamps = Array.from({ length: k }, (_, i) => CK.lamp(40 + 210 * (i + 1) / (k + 1), 36)).join("");
        return R(I, "A", { svg: svgEl(CK.svg(290, 160, CK.wire([[40, 75], [40, 36], [250, 36], [250, 120], [40, 120], [40, 85]]) + lamps + CK.bat(40, 80, F(U0) + " V"), "oy-svg", "Ardıcıl lampalar")),
          text: `${k} eyni lampa ardıcıl birləşdirilib və ${U0} V gərginlikli mənbəyə qoşulub. Hər lampanın müqaviməti ${Rl} Ω-dur. Dövrədəki cərəyan nə qədərdir?`, solution: `R = ${k}·${Rl} = ${k * Rl} Ω. I = ${U0}/${k * Rl} = ${F(I)} A.` });
      } },
    { id: "paralel", ad: "Paralel birləşmə", izah: "Paralel: gərginlik eynidir, cərəyanlar toplanır, 1/R = 1/R₁ + 1/R₂ + …; iki rezistor üçün R = R₁R₂/(R₁ + R₂). Nəticə ən kiçik rezistordan da kiçikdir.",
      gen() {
        const kind = pick(["Re2", "Re2", "Re3", "n", "I", "R2"]);
        if (kind === "Re2") { const [a, b, s] = pick(PAIRS); return R(s, "Ω", { svg: par([a, b]), text: `${a} Ω və ${b} Ω müqavimətli iki rezistor paralel birləşdirilib. Ümumi müqavimət nə qədərdir?`,
          solution: a === b ? `Eyni iki rezistor: R = ${a}/2 = ${s} Ω.` : `R = R₁R₂/(R₁ + R₂) = ${a}·${b}/${a + b} = ${a * b}/${a + b} = ${s} Ω. Cavab ${a} Ω-dan kiçikdir — düzdür.` }); }
        if (kind === "Re3") { const [a, b, c, s] = pick(TRIPS); return R(s, "Ω", { svg: par([a, b, c]), text: `${a} Ω, ${b} Ω və ${c} Ω müqavimətli üç rezistor paralel birləşdirilib. Ümumi müqavimət nə qədərdir?`,
          solution: `1/R = 1/${a} + 1/${b} + 1/${c} = ${F(+(1 / a + 1 / b + 1 / c).toFixed(5))} → R = ${F(s)} Ω.` }); }
        if (kind === "n") {
          let n, r, Rn; do { n = pick([2, 3, 4, 5, 6, 8, 10]); r = pick([4, 6, 8, 10, 12, 15, 20, 24, 30, 40, 50, 60, 100]); Rn = r / n; } while (!nice(Rn, 2));
          return R(Rn, "Ω", { svg: par(new Array(Math.min(n, 4)).fill(r)), text: `${n} eyni rezistor (hər biri ${r} Ω) paralel birləşdirilib. Ümumi müqavimət nə qədərdir? (Şəkildə bəzi rezistorlar göstərilməyib.)`, solution: `n eyni rezistor paralel: R = r/n = ${r}/${n} = ${F(Rn)} Ω.` });
        }
        if (kind === "I") {
          let a, b, s, U, I1, I2; do { [a, b, s] = pick(PAIRS); U = pick(UU); I1 = U / a; I2 = U / b; } while (a === b || !nice(I1 + I2, 3) || !nice(I1, 3) || !nice(I2, 3));
          return R(I1 + I2, "A", { svg: par([a, b], U), text: `${a} Ω və ${b} Ω müqavimətli iki rezistor paralel birləşdirilib və ${U} V gərginlikli mənbəyə qoşulub. Mənbədən keçən ümumi cərəyan nə qədərdir?`,
            solution: `Hər rezistorda gərginlik ${U} V. I₁ = ${U}/${a} = ${F(I1)} A, I₂ = ${U}/${b} = ${F(I2)} A. Ümumi cərəyan: ${F(I1)} + ${F(I2)} = ${F(I1 + I2)} A.` });
        }
        let a, b, s; do { [a, b, s] = pick(PAIRS); } while (a === b);
        return R(b, "Ω", { text: `R₁ = ${a} Ω rezistoruna paralel R₂ rezistoru qoşulub. Ümumi müqavimət ${F(s)} Ω olub. R₂ neçə Ω-dur?`,
          solution: `1/R₂ = 1/R − 1/R₁ = 1/${F(s)} − 1/${a} → R₂ = R·R₁/(R₁ − R) = ${F(s)}·${a}/${F(a - s)} = ${b} Ω.` });
      } },
    { id: "qarisiq", ad: "Qarışıq birləşmə", izah: "Sxemi hissə-hissə sadələşdir: əvvəl paralel (və ya ardıcıl) hissəni bir rezistora çevir, sonra qalanı topla. Ümumi cərəyan paralel qrupdan əvvəl bölünür.",
      gen() {
        const kind = pick(["Ra", "Ra", "Ia", "Up", "Ib", "Rb"]);
        if (kind === "Ra" || kind === "Ia" || kind === "Up") {
          let a, b, s, r1, U, I, Re;
          do { [a, b, s] = pick(PAIRS); r1 = pick(RS); Re = r1 + s; U = pick(UU); I = U / Re; } while (a === b || a > 40 || !nice(I, 3));
          if (kind === "Ra") return R(Re, "Ω", { svg: mixA(r1, a, b), text: `Sxemdə ${r1} Ω-luq rezistor ${a} Ω və ${b} Ω-luq paralel birləşmiş rezistorlarla ardıcıl qoşulub. Sxemin ümumi müqaviməti nə qədərdir?`,
            solution: `Paralel hissə: ${a}·${b}/${a + b} = ${s} Ω. Onunla ${r1} Ω ardıcıl: ${r1} + ${s} = ${F(Re)} Ω.` });
          if (kind === "Ia") return R(I, "A", { svg: mixA(r1, a, b, U), text: `Sxemdə ${r1} Ω-luq rezistor ${a} Ω və ${b} Ω-luq paralel birləşmiş rezistorlarla ardıcıl qoşulub, sxem ${U} V-luq mənbəyədir. Mənbədən keçən cərəyan nə qədərdir?`,
            solution: `Paralel hissə: ${a}·${b}/${a + b} = ${s} Ω. R = ${r1} + ${s} = ${F(Re)} Ω. I = ${U}/${F(Re)} = ${F(I)} A.` });
          return R(I * s, "V", { svg: mixA(r1, a, b, U), text: `Sxemdə ${r1} Ω-luq rezistor ${a} Ω və ${b} Ω-luq paralel birləşmiş rezistorlarla ardıcıl qoşulub, sxem ${U} V-luq mənbəyədir. Paralel birləşmiş rezistorların uclarındakı gərginlik nə qədərdir?`,
            solution: `Paralel hissə ${s} Ω, ümumi R = ${F(Re)} Ω. I = ${U}/${F(Re)} = ${F(I)} A. Bu cərəyan paralel hissədən keçir: U = I·${s} = ${F(I * s)} V.` });
        }
        let a, b, s, p, q, U, I;
        do { [a, b, s] = pick(PAIRS); p = rnd(2, Math.max(2, a - 2)); q = a - p; U = pick(UU); I = U / s; } while (a === b || a > 60 || !nice(I, 3) || q < 2);
        // branch 1 = p + q = a (two resistors in series), branch 2 = b
        if (kind === "Rb") return R(s, "Ω", { svg: mixB(p, q, b), text: `Sxemdə ${p} Ω və ${q} Ω-luq ardıcıl rezistorlardan ibarət qola ${b} Ω-luq rezistor paralel qoşulub. Sxemin ümumi müqaviməti nə qədərdir?`,
          solution: `Birinci qol: ${p} + ${q} = ${a} Ω. Onunla ${b} Ω paralel: ${a}·${b}/${a + b} = ${F(s)} Ω.` });
        return R(I, "A", { svg: mixB(p, q, b, U), text: `Sxemdə ${p} Ω və ${q} Ω-luq ardıcıl rezistorlardan ibarət qola ${b} Ω-luq rezistor paralel qoşulub, sxem ${U} V-luq mənbəyədir. Mənbədən keçən cərəyan nə qədərdir?`,
          solution: `Birinci qol: ${p} + ${q} = ${a} Ω. Paralel: ${a}·${b}/${a + b} = ${F(s)} Ω. I = ${U}/${F(s)} = ${F(I)} A.` });
      } },
    { id: "bolgu", ad: "Cərəyan və gərginliyin bölünməsi", izah: "Ardıcılda gərginlik müqavimətlərlə düz mütənasib bölünür: U₁ = U·R₁/(R₁ + R₂). Paralelda cərəyan müqavimətə tərs mütənasib bölünür: I₁ = I·R₂/(R₁ + R₂).",
      gen() {
        const kind = pick(["Us", "Ip", "Ir", "U3"]);
        if (kind === "Us") {
          let r1, r2, U, U1; do { r1 = pick(RS); r2 = pick(RS); U = pick(UU); U1 = U * r1 / (r1 + r2); } while (r1 === r2 || !nice(U1, 2));
          return R(U1, "V", { svg: ser([r1, r2], U), text: `${r1} Ω və ${r2} Ω-luq iki rezistor ardıcıl birləşdirilib, ${U} V-luq mənbəyə qoşulub. ${r1} Ω-luq rezistorun uclarındakı gərginlik nə qədərdir?`,
            solution: `Ardıcılda gərginlik müqavimətlə mütənasib bölünür: U₁ = U·R₁/(R₁ + R₂) = ${U}·${r1}/${r1 + r2} = ${F(U1)} V.` });
        }
        if (kind === "Ip") {
          let r1, r2, I, I1; do { r1 = pick(RS); r2 = pick(RS); I = pick([1, 2, 3, 4, 5, 6, 8, 10, 12]); I1 = I * r2 / (r1 + r2); } while (r1 === r2 || !nice(I1, 3));
          return R(I1, "A", { svg: par([r1, r2]), text: `${r1} Ω və ${r2} Ω-luq iki rezistor paralel birləşdirilib. Mənbədən ümumi ${I} A cərəyan çıxır. ${r1} Ω-luq rezistordan keçən cərəyan nə qədərdir?`,
            solution: `Paralelda cərəyan müqavimətə tərs mütənasib bölünür: I₁ = I·R₂/(R₁ + R₂) = ${I}·${r2}/${r1 + r2} = ${F(I1)} A. (Kiçik müqavimətdən çox cərəyan keçir.)` });
        }
        if (kind === "Ir") {
          let r1, r2, I1, I2; do { r1 = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]); r2 = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 30, 60]); I1 = pick([0.5, 1, 1.5, 2, 3, 4, 5, 6]); I2 = I1 * r1 / r2; } while (r1 === r2 || !nice(I2, 3));
          return R(I1 + I2, "A", { svg: par([r1, r2]), text: `${r1} Ω və ${r2} Ω-luq rezistorlar paralel birləşdirilib. ${r1} Ω-luq rezistordan ${F(I1)} A cərəyan keçir. Mənbədən keçən ümumi cərəyan nə qədərdir?`,
            solution: `Gərginlik: U = ${F(I1)}·${r1} = ${F(I1 * r1)} V. İkinci rezistordan: I₂ = ${F(I1 * r1)}/${r2} = ${F(I2)} A. Ümumi: ${F(I1)} + ${F(I2)} = ${F(I1 + I2)} A.` });
        }
        let r1, r2, r3, U, U2; do { r1 = pick(RS); r2 = pick(RS); r3 = pick(RS); U = pick(UU); U2 = U * r2 / (r1 + r2 + r3); } while (!nice(U2, 2));
        return R(U2, "V", { svg: ser([r1, r2, r3], U), text: `${r1} Ω, ${r2} Ω və ${r3} Ω-luq üç rezistor ardıcıl birləşdirilib, ${U} V-luq mənbəyə qoşulub. Ortadakı (${r2} Ω) rezistorun uclarındakı gərginlik nə qədərdir?`,
          solution: `U₂ = U·R₂/(R₁ + R₂ + R₃) = ${U}·${r2}/${r1 + r2 + r3} = ${F(U2)} V.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let a, b, s, r1, U, I, Re;
          do { [a, b, s] = pick(PAIRS); r1 = pick(RS); Re = r1 + s; U = pick(UU); I = U / Re; } while (a === b || a > 40 || !nice(I, 3));
          task = `${r1} Ω-luq rezistor ${a} Ω və ${b} Ω-luq paralel rezistorlarla ardıcıl qoşulub. Sxem ${U} V-luq mənbəyədir. Mənbədən keçən cərəyan neçə amperdir?`;
          steps = [`Paralel hissə: R₂₃ = ${a}·${b}/(${a} + ${b}) = ${s} Ω.`, `Ümumi müqavimət: R = ${r1} + ${s} = ${F(Re)} Ω.`, `I = U/R = ${U}/${F(Re)} = ${F(I)} A.`];
          if (bad === 0) { const w = a + b, Rw = r1 + w; steps = [`Paralel hissə: R₂₃ = ${a} + ${b} = ${w} Ω.`, `Ümumi müqavimət: R = ${r1} + ${w} = ${Rw} Ω.`, `I = U/R = ${U}/${Rw} = ${F(+(U / Rw).toFixed(4))} A.`]; }
          if (bad === 1) { const w = r1 * s / (r1 + s); steps[1] = `Ümumi müqavimət: R = ${r1}·${F(s)}/(${r1} + ${F(s)}) = ${F(+w.toFixed(4))} Ω.`; steps[2] = `I = U/R = ${U}/${F(+w.toFixed(4))} = ${F(+(U / w).toFixed(4))} A.`; }
          if (bad === 2) steps[2] = `I = R/U = ${F(Re)}/${U} = ${F(+(Re / U).toFixed(4))} A.`;
          why = [`1-ci addım: ${a} + ${b} ardıcıl birləşmənin düsturudur. Paralelda ${a}·${b}/${a + b} = ${s} Ω. Düz cavab: ${F(I)} A.`,
            `2-ci addım: paralel hissə ${r1} Ω-la ardıcıldır, ona görə müqavimətlər toplanır: ${r1} + ${s} = ${F(Re)} Ω. Düz cavab: ${F(I)} A.`,
            `3-cü addım: Om qanunu I = U/R-dir, R/U yox. Düz cavab: ${F(I)} A.`][bad];
        } else {
          let r1, r2, I, I1; do { r1 = pick(RS); r2 = pick(RS); I = pick([2, 3, 4, 5, 6, 8, 10, 12]); I1 = I * r2 / (r1 + r2); } while (r1 === r2 || !nice(I1, 3));
          task = `${r1} Ω və ${r2} Ω-luq iki rezistor paralel birləşdirilib. Ümumi cərəyan ${I} A-dir. ${r1} Ω-luq rezistordan keçən cərəyan neçə amperdir?`;
          const Ib = I * r1 / (r1 + r2);
          steps = [`Paralelda gərginlik eynidir, deməli I₁R₁ = I₂R₂ və I₁/I₂ = R₂/R₁ = ${r2}/${r1}.`, `I₁ = I·R₂/(R₁ + R₂) = ${I}·${r2}/${r1 + r2}.`, `I₁ = ${F(I1)} A.`];
          if (bad === 0) steps = [`Cərəyan müqavimətə düz mütənasibdir: I₁/I₂ = R₁/R₂ = ${r1}/${r2}.`, `I₁ = I·R₁/(R₁ + R₂) = ${I}·${r1}/${r1 + r2}.`, `I₁ = ${F(+Ib.toFixed(4))} A.`];
          if (bad === 1) { steps[1] = `I₁ = I·R₂/R₁ = ${I}·${r2}/${r1}.`; steps[2] = `I₁ = ${F(+(I * r2 / r1).toFixed(4))} A.`; }
          if (bad === 2) steps[2] = `I₁ = ${F(+(I1 + 0.5).toFixed(4))} A.`;
          why = [`1-ci addım: paralelda cərəyan müqavimətə tərs mütənasibdir (gərginlik eynidir). Düz: I₁/I₂ = R₂/R₁, cavab ${F(I1)} A.`,
            `2-ci addım: bütöv cərəyan I = I₁ + I₂ olduğu üçün məxrəc R₁ + R₂-dir, R₁ yox. Düz cavab: ${F(I1)} A.`,
            `3-cü addım: ${I}·${r2}/${r1 + r2} = ${F(I1)}, hesablama səhvi var.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Bayram girlandası, evdəki rozetkalar, uzadıcı — hamısı ardıcıl və paralel birləşmədir.",
      gen() {
        const kind = pick(["girl", "girl2", "ev", "uzad"]);
        if (kind === "girl") {
          let n, I, Rl; do { n = pick([10, 11, 20, 22, 44, 55]); I = pick([0.05, 0.1, 0.2, 0.25, 0.4, 0.5]); Rl = 220 / (I * n); } while (!nice(Rl, 2));
          return R(Rl, "Ω", { text: `Yeni il girlandasında ${n} eyni lampa ardıcıl birləşdirilib və 220 V-luq şəbəkəyə qoşulub. Girlandadan ${F(I)} A cərəyan keçir. Bir lampanın müqaviməti nə qədərdir?`,
            solution: `Ümumi müqavimət: 220/${F(I)} = ${F(220 / I)} Ω. Lampalar eynidir: R = ${F(220 / I)}/${n} = ${F(Rl)} Ω.` });
        }
        if (kind === "girl2") {
          const n = pick([11, 12, 21, 23, 45]);
          return R(220 / (n - 1), "V", { text: `Girlandada ${n} eyni lampa ardıcıl birləşdirilib, şəbəkənin gərginliyi 220 V-dur. Bir lampa yanıb, onun yerinə tel parçası qoyublar (lampanın müqaviməti sıfır olub). Qalan lampaların hər birində gərginlik neçə volt olar?`,
            solution: `Qalan ${n - 1} lampa eynidir və ardıcıldır, 220 V onlar arasında bərabər bölünür: 220/${n - 1} = ${F(220 / (n - 1))} V. (Əvvəl hər birində 220/${n} idi, yəni lampalar daha parlaq yanır.)` });
        }
        if (kind === "ev") {
          const C = [[22, "çaydan"], [44, "ütü"], [55, "qızdırıcı"], [110, "fen"], [220, "lampa"], [440, "televizor"]];
          const k = rnd(2, 3); let c1, c2, c3;
          do { c1 = pick(C); c2 = pick(C); c3 = pick(C); } while (c1[1] === c2[1] || (k === 3 && (c3[1] === c1[1] || c3[1] === c2[1])));
          const cs = k === 2 ? [c1, c2] : [c1, c2, c3], tot = cs.reduce((a, c) => a + 220 / c[0], 0);
          return R(tot, "A", { text: `Evin 220 V-luq şəbəkəsində paralel qoşulmuş cihazlar: ${cs.map(c => `${c[1]} (${c[0]} Ω)`).join(", ")}. Hamısı eyni vaxtda işləyəndə sigortadan keçən cərəyan nə qədərdir?`,
            solution: `Hər cihazda gərginlik 220 V. ${cs.map(c => `${c[1]}: 220/${c[0]} = ${F(220 / c[0])} A`).join("; ")}. Cərəyanlar toplanır: ${F(tot)} A.` });
        }
        let r, Rd, Ud; do { r = 2; Rd = pick([3, 6, 8, 9, 18, 20, 38, 42, 53, 86]); Ud = 220 * Rd / (Rd + r); } while (!nice(Ud, 2));
        return R(Ud, "V", { text: `Müqaviməti ${Rd} Ω olan cihaz 220 V-luq mənbəyə uzadıcı ilə qoşulub. Uzadıcı məftilin müqaviməti ${r} Ω-dur və cihazla ardıcıldır. Cihazın uclarındakı gərginlik nə qədərdir?`,
          solution: `R = ${Rd} + ${r} = ${Rd + r} Ω. I = 220/${Rd + r} = ${F(220 / (Rd + r))} A. U = I·${Rd} = ${F(Ud)} V (220 V-dan az: gərginliyin bir hissəsi uzadıcıda itir).` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a circuit or graph, several steps;
  // the wrong options are the answers of typical mistakes. Questions 5, 7 and 10 also use "Cərəyan, gərginlik,
  // müqavimət" (R = ρl/S, q = I·t).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const fr = (p, q) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : p / g + "/" + q / g; };
  const S = (w, h, inner, aria) => svgEl(CK.svg(w, h, inner, "oy-svg", aria));
  const T = CK.text, Ln = CK.line;
  // circuits with plain labels (values are in the text, as in the RFO papers)
  const fig1 = (A) => svgEl(CK.net({ ser: ["R₃"], br: [["R₁"], ["R₂"]], U: "U", cls: "oy-svg", aria: "R₃ ardıcıl, R₁ və R₂ paralel; ampermetr əsas xətdə",
    extra: A ? CK.meter(85, 164, "A") : "" }));
  const figV = () => { // R1, R2, R3 in series, a voltmeter across R2
    const yT = 36, x = 140; return svgEl(CK.net({ ser: ["R₁", "R₂", "R₃"], U: "U", cls: "oy-svg", aria: "Ardıcıl R₁, R₂, R₃; voltmetr R₂-yə paralel",
      extra: CK.wire([[x - 22, yT], [x - 22, 80], [x - 12, 80]]) + CK.wire([[x + 12, 80], [x + 22, 80], [x + 22, yT]]) + CK.dot(x - 22, yT) + CK.dot(x + 22, yT) + CK.meter(x, 80, "V") })); };
  const figPar = () => svgEl(CK.net({ br: [["R₁"], ["R₂"]], U: "U", cls: "oy-svg", aria: "R₁ və R₂ paralel; ampermetr əsas xətdə", extra: CK.meter(80, 164, "A") }));
  const figK = () => { const x = 200, PAP = CK.PAP; // switch K on the R3 branch
    return svgEl(CK.net({ ser: ["R₁"], br: [["R₂"], ["R₃"]], U: "U", cls: "oy-svg", aria: "R₁ ardıcıl; R₂ və R₃ paralel, R₃ qolunda K açarı",
      extra: Ln(x, 50, x, 72, PAP, 5) + CK.dot(x, 50) + CK.dot(x, 72) + Ln(x, 72, x + 3, 51) + T(x + 12, 66, "K", "start") + CK.meter(85, 164, "A") })); };
  const figBridge = () => svgEl(CK.net({ br: [["R₁", "R₂"], ["R₃", "R₄"]], U: "U", cls: "oy-svg", aria: "İki qol: R₁–R₂ və R₃–R₄; voltmetr qolların orta nöqtələri arasında",
    extra: CK.wire([[120, 100], [143, 100]]) + CK.wire([[167, 100], [190, 100]]) + CK.dot(120, 100) + CK.dot(190, 100) + CK.meter(155, 100, "V") }));
  function figRing(alpha) { const cx = 130, cy = 112, r = 60, a1 = Math.PI, a2 = Math.PI - 2 * Math.PI * alpha;
    const P = a => [cx + r * Math.cos(a), cy - r * Math.sin(a)], [ax, ay] = P(a1), [bx, by] = P(a2), lead = 34;
    return S(260, 215, `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${CK.INK}" stroke-width="2.5"/>` + Ln(ax, ay, ax - lead, ay) + CK.dot(ax, ay) + T(ax - lead - 4, ay + 5, "A", "end")
      + Ln(bx, by, bx + lead * Math.cos(a2), by - lead * Math.sin(a2)) + CK.dot(bx, by) + T(bx + (lead + 12) * Math.cos(a2), Math.max(14, by - (lead + 12) * Math.sin(a2) + 5), "B"), "Naqildən halqa; A və B nöqtələri"); }
  // I–U graph: two lines through the origin, each through a marked grid point
  function figGraph(p1, p2) { const X = u => 40 + u * 15, Y = i => 160 - i * 22;
    let s = Ln(40, 160, 235, 160) + Ln(40, 160, 40, 15) + T(240, 176, "U, V") + T(34, 16, "I, A", "end");
    for (let u = 2; u <= 12; u += 2) s += Ln(X(u), 160, X(u), 22, CK.MUT, 0.6) + T(X(u), 176, u, "middle", CK.MUT, 11);
    for (let i = 1; i <= 6; i++) s += Ln(40, Y(i), 220, Y(i), CK.MUT, 0.6) + T(32, Y(i) + 4, i, "end", CK.MUT, 11);
    [[p1, CK.ACC, "1"], [p2, CK.VEC, "2"]].forEach(([[u, i], c, n]) => { const k = Math.min(12 / u, 6.5 / i); s += Ln(40, 160, X(u * k), Y(i * k), c, 2.5) + `<circle cx="${X(u)}" cy="${Y(i)}" r="3.5" fill="${c}"/>` + T(X(u * k) + 4, Y(i * k) - 4, n, "start", c); });
    return S(260, 190, s, "Cərəyan şiddətinin gərginlikdən asılılıq qrafiki: 1 və 2 rezistorları"); }

  // a wire cut into n parts, the parts joined side by side
  function figCut(n) { let s = Ln(20, 40, 240, 40, CK.INK, 4) + T(130, 24, "R");
    for (let k = 1; k < n; k++) { const x = 20 + 220 * k / n; s += Ln(x - 4, 31, x + 4, 49, CK.ACC, 2); }
    s += CK.arrow(130, 58, 130, 84) + T(140, 76, "kəsib, paralel", "start", CK.MUT, 11);
    const y0 = 100, gap = Math.min(18, 80 / n);
    for (let k = 0; k < n; k++) s += Ln(90, y0 + k * gap, 170, y0 + k * gap, CK.INK, 3);
    s += Ln(90, y0, 90, y0 + (n - 1) * gap) + Ln(170, y0, 170, y0 + (n - 1) * gap) + CK.dot(90, y0) + CK.dot(170, y0) + Ln(60, y0, 90, y0) + Ln(170, y0, 200, y0);
    return S(260, y0 + (n - 1) * gap + 20, s, "Naqil " + n + " bərabər hissəyə kəsilib, hissələr paralel birləşdirilib"); }
  // ammeter with a shunt in parallel
  function figShunt() { const yT = 50, yB = 120;
    const s = Ln(20, 85, 70, 85) + Ln(70, yT, 70, yB) + Ln(70, yT, 190, yT) + Ln(70, yB, 190, yB) + Ln(190, yT, 190, yB) + Ln(190, 85, 240, 85)
      + CK.dot(70, 85) + CK.dot(190, 85) + CK.meter(130, yT, "A") + CK.res(130, yB, "h", "") + T(130, yB + 25, "R_ş") + T(148, yT - 12, "r_A", "start")
      + CK.arrow(24, 75, 56, 75) + T(40, 68, "I") ;
    return S(260, 160, s, "Ampermetr və ona paralel şunt R_ş"); }
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. ammeter in a mixed circuit
    { tip: "qapali", gen: () => again(() => {
      const [r1, r2, r12] = pick(PAIRS.filter(p => p[1] <= 60)), r3 = pick(RS), I = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), U = I * (r3 + r12);
      if (!nice(U, 1)) return null;
      const w = [U / (r1 + r2 + r3), U / r12, U / r3, U * (1 / r1 + 1 / r2 + 1 / r3)]; if (!w.every(x => ok2(x))) return null;
      return mc(ae(I, w, U_("A")), { svg: fig1(true), text: `Sxemdə R₁ = ${r1} Ω, R₂ = ${r2} Ω, R₃ = ${r3} Ω, mənbənin gərginliyi U = ${F(U)} V. Ampermetr nəyi göstərir? (Ampermetr idealdır.)`,
        solution: `R₁ və R₂ paraleldir: R₁₂ = ${r1}·${r2}/(${r1}+${r2}) = ${F(r12)} Ω. Ümumi müqavimət R = R₃ + R₁₂ = ${F(r3 + r12)} Ω. I = U/R = ${F(U)}/${F(r3 + r12)} = ${F(I)} A. Tələlər: hamısını ardıcıl saymaq (${F(+(U / (r1 + r2 + r3)).toFixed(2))} A), R₃-ü unutmaq (${F(+(U / r12).toFixed(2))} A).` });
    }) },
    // 2. voltmeter across one of three series resistors
    { tip: "qapali", gen: () => again(() => {
      const a = pick(RS), b = pick(RS), c = pick(RS), U = pick(UU), sum = a + b + c, U2 = U * b / sum;
      if (a === b && b === c) return null;
      const w = [U / 3, U / sum, U - U2, U * b / (a + c)]; if (![U2, ...w].every(x => ok2(x))) return null;
      return mc(ae(U2, w, U_("V")), { svg: figV(), text: `Sxemdə R₁ = ${a} Ω, R₂ = ${b} Ω, R₃ = ${c} Ω, U = ${U} V. İdeal voltmetr nəyi göstərir?`,
        solution: `Ardıcıl dövrədə cərəyan hər yerdə eynidir: I = U/(R₁+R₂+R₃) = ${U}/${sum} = ${F(+(U / sum).toFixed(4))} A. Voltmetr R₂-dədir: U₂ = I·R₂ = ${F(U2)} V. Tələlər: gərginliyi bərabər bölmək (U/3), cərəyanı cavab yazmaq.` });
    }) },
    // 3. current division between parallel branches
    { tip: "qapali", gen: () => again(() => {
      const [r1, r2] = pick(PAIRS.filter(p => p[0] !== p[1] && p[1] <= 60)), I = rnd(1, 12), I1 = I * r2 / (r1 + r2);
      const w = [I * r1 / (r1 + r2), I / 2, I * r1 / r2, I]; if (![I1, ...w].every(x => ok2(x))) return null;
      return mc(ae(I1, w, U_("A")), { svg: figPar(), text: `Ampermetr ${I} A göstərir. R₁ = ${r1} Ω, R₂ = ${r2} Ω. R₁ rezistorundan keçən cərəyan şiddəti nə qədərdir?`,
        solution: `Paralel qollarda gərginlik eynidir: I₁R₁ = I₂R₂, I₁ + I₂ = ${I}. I₁ = I·R₂/(R₁+R₂) = ${I}·${r2}/${r1 + r2} = ${F(I1)} A. Kiçik müqavimətdən böyük cərəyan keçir. Tələ: R₁-i surətə yazmaq (${F(+(I * r1 / (r1 + r2)).toFixed(4))} A).` });
    }) },
    // 4. opening a switch: how the ammeter reading changes
    { tip: "qapali", gen: () => again(() => {
      const [r2, r3, r23] = pick(PAIRS.filter(p => p[1] <= 60)), r1 = pick(RS), Ro = r1 + r2, Rc = r1 + r23;
      if (!Number.isInteger(Rc)) return null;
      const K = fr(Ro, Rc), K2 = fr(r2 + r3, r3); if (K === "1") return null;
      const o = ae(K + " dəfə azalar", [K + " dəfə artar", "dəyişməz", "2 dəfə azalar", K2 + " dəfə azalar"], x => x);
      return mc(o, { svg: figK(), text: `Sxemdə R₁ = ${r1} Ω, R₂ = ${r2} Ω, R₃ = ${r3} Ω. K açarı qapalıdır. Açarı açsaq, ampermetrin göstərişi necə dəyişər?`,
        solution: `Qapalı: R = R₁ + R₂R₃/(R₂+R₃) = ${r1} + ${F(r23)} = ${Rc} Ω. Açıq: R₃ qolu kəsilir, R = R₁ + R₂ = ${Ro} Ω. Gərginlik eynidir, I = U/R: I_q/I_a = ${Ro}/${Rc} = ${K}. Müqavimət artır, cərəyan ${K} dəfə azalır. Tələ: R₁-i unutmaq (${K2}).` });
    }) },
    // 5. a wire cut into n equal parts, the parts joined in parallel (R = ρl/S)
    { tip: "qapali", birlesik: "fiz-cereyan", gen: () => again(() => {
      const n = rnd(2, 6), Rr = n * n * pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 20]), right = Rr / n / n;
      const o = ae(right, [Rr / n, Rr * n, Rr, Rr * n * n], U_("Ω"));
      return mc(o, { svg: figCut(n), text: `Müqaviməti ${Rr} Ω olan bircins naqil (en kəsiyi hər yerdə eyni) ${n} bərabər hissəyə kəsildi və hissələr paralel birləşdirildi. Alınan birləşmənin müqaviməti nə qədərdir?`,
        solution: `Hər hissə ${n} dəfə qısadır: R₀ = ${Rr}/${n} = ${F(Rr / n)} Ω (R = ρl/S). ${n} eyni rezistor paralel: R = R₀/${n} = ${F(right)} Ω, yəni ${Rr}/${n}² . Tələ: müqaviməti yalnız ${n} dəfə azaltmaq (${F(Rr / n)} Ω).` });
    }) },
    // 6. two resistors from an I–U graph, then joined in parallel
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const pts = [[2, 4], [2, 2], [4, 2], [6, 2], [6, 3], [12, 6], [12, 4], [12, 3], [10, 2], [8, 4], [9, 3], [4, 4], [6, 4], [8, 2], [12, 2]];
      const p1 = pick(pts), p2 = pick(pts), R1 = p1[0] / p1[1], R2 = p2[0] / p2[1]; if (R1 === R2) return null;
      const r = R1 * R2 / (R1 + R2), w = [R1 + R2, 1 / R1 + 1 / R2, (R1 + R2) / 2, Math.abs(R1 - R2)]; if (![r, ...w].every(x => ok2(x))) return null;
      return mc(ae(r, w, U_("Ω")), { svg: figGraph(p1, p2), text: `Qrafikdə 1 və 2 rezistorlarından keçən cərəyanın gərginlikdən asılılığı verilib. Bu rezistorları paralel birləşdirsək, ümumi müqavimət nə qədər olar?`,
        solution: `Qrafikdən: R₁ = ${p1[0]}/${p1[1]} = ${F(R1)} Ω, R₂ = ${p2[0]}/${p2[1]} = ${F(R2)} Ω. Paralel: R = R₁R₂/(R₁+R₂) = ${F(r)} Ω. Tələ: 1/R₁ + 1/R₂ = ${F(+(1 / R1 + 1 / R2).toFixed(4))} tapıb tərsinə çevirməyi unutmaq.` });
    }) },
    // 7. charge through one branch in t seconds (q = I·t)
    { tip: "qapali", birlesik: "fiz-cereyan", gen: () => again(() => {
      const [r2, r3, r23] = pick(PAIRS.filter(p => p[0] !== p[1] && p[1] <= 60)), r1 = pick(RS), I = pick([0.5, 1, 1.5, 2, 3, 4]), U = I * (r1 + r23), t = pick([10, 20, 30, 60]);
      const I2 = I * r3 / (r2 + r3), q = I2 * t; if (!nice(U, 1)) return null;
      const w = [I * t, U * t / r2, I2, I * t / 2]; if (![q, ...w].every(x => ok2(x))) return null;
      return mc(ae(q, w, U_("Kl")), { svg: fig1(false), text: `Sxemdə R₁ = ${r2} Ω, R₂ = ${r3} Ω, R₃ = ${r1} Ω, U = ${F(U)} V. R₁ rezistorundan ${t} s ərzində nə qədər yük keçir?`,
        solution: `R₁₂ = ${r2}·${r3}/${r2 + r3} = ${F(r23)} Ω; I = U/(R₃ + R₁₂) = ${F(U)}/${F(r1 + r23)} = ${F(I)} A. R₁-dən: I₁ = I·R₂/(R₁+R₂) = ${F(I2)} A. q = I₁·t = ${F(I2)}·${t} = ${F(q)} Kl. Tələlər: ümumi cərəyanla hesablamaq (${F(I * t)} Kl), cərəyanı cavab yazmaq.` });
    }) },
    // 8. voltmeter between the midpoints of two branches (unbalanced bridge)
    { tip: "qapali", gen: () => again(() => {
      const r1 = pick(RS), r2 = pick(RS), r3 = pick(RS), r4 = pick(RS), U = pick(UU);
      const f1 = U * r2 / (r1 + r2), f2 = U * r4 / (r3 + r4), V = Math.abs(f1 - f2); if (V < 0.01) return null;
      if (![V, f1, f2].every(x => ok2(x))) return null;
      const o = ae(V, [f1, f1 + f2, U / 2, 0], U_("V")); // f1: one branch only; 0: the bridge taken as balanced
      return mc(o, { svg: figBridge(), text: `Sxemdə R₁ = ${r1} Ω, R₂ = ${r2} Ω, R₃ = ${r3} Ω, R₄ = ${r4} Ω, U = ${U} V. İdeal voltmetr nəyi göstərir?`,
        solution: `Hər qolda gərginlik müqavimətlərə mütənasib bölünür. Aşağı ucun potensialı 0 olsun: sol orta nöqtə φ₁ = U·R₂/(R₁+R₂) = ${F(+f1.toFixed(4))} V, sağ φ₂ = U·R₄/(R₃+R₄) = ${F(+f2.toFixed(4))} V. Voltmetr fərqi göstərir: ${F(+V.toFixed(4))} V. Körpü ancaq R₁/R₂ = R₃/R₄ olanda balansdadır (0).` });
    }) },
    // 9. shunt for an ammeter
    { tip: "qapali", gen: () => again(() => {
      const n = pick([2, 3, 4, 5, 10, 20, 25, 50, 100]), sh = pick([0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1]), rA = sh * (n - 1), IA = pick([0.01, 0.05, 0.1, 0.5, 1, 2]);
      if (!nice(rA, 3)) return null;
      const o = ae(sh, [rA / n, rA * (n - 1), rA * n, rA / (n + 1)], U_("Ω"));
      return mc(o, { svg: figShunt(), text: `Ampermetrin daxili müqaviməti ${F(+rA.toFixed(4))} Ω-dur, ən çox ${F(IA)} A ölçür. Onunla ${F(+(IA * n).toFixed(4))} A-ə qədər cərəyan ölçmək üçün ampermetrə paralel hansı müqavimətli şunt qoşulmalıdır?`,
        solution: `Ampermetrdən ən çox ${F(IA)} A, şuntdan qalan ${F(+(IA * (n - 1)).toFixed(4))} A keçməlidir. Gərginlik eynidir: ${F(IA)}·r_A = ${F(+(IA * (n - 1)).toFixed(4))}·R_ş, R_ş = r_A/(n − 1) = ${F(+rA.toFixed(4))}/${n - 1} = ${F(sh)} Ω (n = ${n}). Tələ: r_A/n.` });
    }) },
    // 10. ring of wire: resistance between two points (R ∝ l)
    { tip: "qapali", birlesik: "fiz-cereyan", minVariety: 10, gen: () => again(() => {
      const [p, q] = pick([[1, 2], [1, 3], [1, 4], [1, 6], [1, 5], [2, 5]]), al = p / q, Rr = pick([36, 72, 100, 144, 180, 200, 300, 360]);
      const right = Rr * al * (1 - al); if (!nice(right, 2)) return null;
      const cand = [Rr * al, Rr * (1 - al), Rr / 4, Rr / 2, Rr, 2 * Rr].filter(x => F(x) !== F(right)).filter((x, i, a) => a.findIndex(y => F(y) === F(x)) === i).slice(0, 4);
      return mc(ae(right, cand, U_("Ω")), { svg: figRing(al), text: `Müqaviməti ${Rr} Ω olan bircins naqildən (en kəsiyi hər yerdə eyni) halqa düzəldilib. A və B nöqtələri halqanı ${p === 1 && q === 2 ? "iki bərabər hissəyə bölür (diametrin ucları)" : `${p}/${q} və ${q - p}/${q} hissələrə bölür`}. A və B arasında müqavimət nə qədərdir?`,
        solution: `R ∝ l: qövslərin müqaviməti ${F(Rr * al)} Ω və ${F(Rr * (1 - al))} Ω. Onlar A və B arasında paraleldir: R = ${F(Rr * al)}·${F(Rr * (1 - al))}/${Rr} = ${F(right)} Ω. Tələ: yalnız qısa qövsü götürmək (${F(Rr * al)} Ω).` });
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
      key: "fiz-om", title: "Om qanunu, ardıcıl və paralel birləşmə", fenn: "fizika", link: "dersler/fiz-om.html",
      format: "Cavab ədəddir (SI: A, V, Ω). Onluq kəsr vergül və ya nöqtə ilə: 0,25.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["om", "om", "mqv", "ardicil", "paralel", "paralel", "qarisiq", "qarisiq", "bolgu", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-om.html")) b.push("dersler/fiz-om.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
