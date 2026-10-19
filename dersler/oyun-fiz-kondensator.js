// Fizika · Potensial, elektrik tutumu, kondensatorlar — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}.
// k = 9·10⁹ N·m²/Kl², ε₀ = 8,85·10⁻¹² F/m. Handy: q in nKl, r in sm → φ = 900·q/r (V); A = q·U (q mkKl, U kV → mJ).
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const INK = "var(--ink,#17171a)";
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const sub = n => String(n).replace(/\d/g, d => "₀₁₂₃₄₅₆₇₈₉"[d]);

  // ---- capacitor circuit drawings ----
  const wire = (g, x1, y1, x2, y2) => g.append(sv("line", { x1, y1, x2, y2, stroke: INK, "stroke-width": 1.8 }));
  const dot = (g, x, y, r) => g.append(sv("circle", { cx: x, cy: y, r: r || 3, fill: INK }));
  function hcap(g, x1, x2, y, label) {            // horizontal branch from x1 to x2 with a capacitor in the middle
    const xc = (x1 + x2) / 2;
    wire(g, x1, y, xc - 4, y); wire(g, xc + 4, y, x2, y);
    g.append(sv("line", { x1: xc - 4, y1: y - 13, x2: xc - 4, y2: y + 13, stroke: INK, "stroke-width": 3 }));
    g.append(sv("line", { x1: xc + 4, y1: y - 13, x2: xc + 4, y2: y + 13, stroke: INK, "stroke-width": 3 }));
    g.append(sv("text", { x: xc, y: y - 19, "text-anchor": "middle", class: "oy-lbl" }, label));
  }
  function circuit(kind, v) {   // v = capacitances in mkF; terminals A and B
    const W = 300, H = 110, g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Kondensatorların birləşməsi, A və B uclarıdır" });
    const L = i => `C${sub(i + 1)} = ${F(v[i])} mkF`;
    if (kind === "ser") {
      const n = v.length, y = 55, x0 = 30, x1 = 270, step = (x1 - x0) / n;
      wire(g, 8, y, x0, y); wire(g, x1, y, W - 8, y);
      for (let i = 0; i < n; i++) hcap(g, x0 + i * step, x0 + (i + 1) * step, y, L(i));
      dot(g, 8, y, 4); dot(g, W - 8, y, 4);
    } else if (kind === "par") {
      const n = v.length, ys = n === 2 ? [32, 78] : [32, 62, 92], ym = n === 2 ? 55 : 62;
      wire(g, 8, ym, 50, ym); wire(g, 250, ym, W - 8, ym); wire(g, 50, ys[0], 50, ys[n - 1]); wire(g, 250, ys[0], 250, ys[n - 1]);
      ys.forEach((y, i) => hcap(g, 50, 250, y, L(i)));
      dot(g, 8, ym, 4); dot(g, W - 8, ym, 4); dot(g, 50, ym, 3); dot(g, 250, ym, 3);
    } else if (kind === "mixA") {     // C1 in series with (C2 ∥ C3)
      wire(g, 8, 55, 30, 55); hcap(g, 30, 100, 55, L(0));
      wire(g, 100, 55, 120, 55); wire(g, 120, 28, 120, 82); wire(g, 250, 28, 250, 82); wire(g, 250, 55, W - 8, 55);
      hcap(g, 120, 250, 28, L(1)); hcap(g, 120, 250, 82, L(2));
      dot(g, 120, 55, 3); dot(g, 250, 55, 3); dot(g, 8, 55, 4); dot(g, W - 8, 55, 4);
    } else {                           // mixB: (C1 series C2) ∥ C3
      wire(g, 8, 55, 40, 55); wire(g, 260, 55, W - 8, 55); wire(g, 40, 28, 40, 82); wire(g, 260, 28, 260, 82);
      hcap(g, 40, 150, 28, L(0)); hcap(g, 150, 260, 28, L(1)); hcap(g, 40, 260, 82, L(2));
      dot(g, 40, 55, 3); dot(g, 260, 55, 3); dot(g, 8, 55, 4); dot(g, W - 8, 55, 4);
    }
    g.append(sv("text", { x: 8, y: 14, class: "oy-lbl" }, "A")); g.append(sv("text", { x: W - 14, y: 14, class: "oy-lbl" }, "B"));
    return g;
  }
  const ser = v => 1 / v.reduce((s, c) => s + 1 / c, 0);
  const par = v => v.reduce((s, c) => s + c, 0);

  // series pairs / triples with nice equivalent capacitance
  const CV = [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30];
  const PAIRS = []; for (const a of CV) for (const b of CV) if (a <= b && nice(a * b / (a + b), 2)) PAIRS.push([a, b]);
  const E0 = 8.85;   // ε₀ = 8,85·10⁻¹² F/m

  const levels = [
    { id: "potensial", ad: "Potensial, iş, gərginlik", izah: "Nöqtəvi yükün potensialı φ = kq/r. Sahənin işi A = q·(φ₁ − φ₂) = qU. Bircins sahədə U = Ed. Yüklü zərrəcik sürətlənəndə qU = mv²/2.",
      gen() {
        const kind = pick(["phi", "dphi", "A", "A", "Ed", "EdE", "v", "e"]);
        if (kind === "phi") {
          let a, c, p; do { a = rnd(1, 20); c = pick([2, 3, 4, 5, 6, 9, 10, 12, 15, 18, 20, 30]); p = 900 * a / c; } while (!nice(p, 2) || p < 5);
          return R(p, "V", { text: `Nöqtəvi ${a} nKl yükdən ${c} sm məsafədə potensial neçə voltdur? (Sonsuzluqda φ = 0, k = 9·10⁹ N·m²/Kl²)`,
            solution: `φ = kq/r = 9·10⁹·${a}·10⁻⁹/${F(c / 100)} = ${F(9 * a)}/${F(c / 100)} = ${F(p)} V.` });
        }
        if (kind === "dphi") {
          let a, r1, r2, u; do { a = rnd(1, 20); r1 = pick([2, 3, 4, 5, 6, 9, 10, 12]); r2 = r1 + pick([1, 2, 3, 4, 6, 10, 15, 20]); u = 900 * a * (1 / r1 - 1 / r2); } while (!nice(u, 2) || u < 5);
          return R(u, "V", { text: `Nöqtəvi ${a} nKl müsbət yükdən ${r1} sm və ${r2} sm məsafədə yerləşən iki nöqtə arasında potensiallar fərqi neçə voltdur? (k = 9·10⁹ N·m²/Kl²)`,
            solution: `φ = 900q/r (V, q nKl, r sm). φ₁ = 900·${a}/${r1} = ${F(900 * a / r1)} V, φ₂ = 900·${a}/${r2} = ${F(900 * a / r2)} V. U = φ₁ − φ₂ = ${F(u)} V.` });
        }
        if (kind === "A") {
          let q, u; do { q = pick([0.5, 1, 2, 2.5, 3, 4, 5, 8, 10]); u = pick([0.5, 1, 2, 2.5, 4, 5, 10, 20]); } while (!nice(q * u, 2));
          return R(q * u, "mJ", { text: `${F(q)} mkKl yükü potensiallar fərqi ${F(u)} kV olan iki nöqtə arasında köçürəndə elektrik sahəsi neçə mJ iş görür?`,
            solution: `A = qU = ${F(q)}·10⁻⁶·${F(u)}·10³ = ${F(q * u)}·10⁻³ J = ${F(q * u)} mJ.` });
        }
        if (kind === "Ed") {
          let e, d; do { e = pick([0.5, 1, 2, 2.5, 4, 5, 10, 20]); d = pick([1, 2, 3, 4, 5, 8, 10, 20]); } while (!nice(10 * e * d, 2));
          return R(10 * e * d, "V", { text: `Bircins elektrik sahəsinin intensivliyi ${F(e)} kV/m-dir. Sahə xətti boyunca ${d} sm məsafədə olan iki nöqtə arasındakı gərginlik neçə voltdur?`,
            solution: `U = E·d = ${F(e * 1000)} V/m · ${F(d / 100)} m = ${F(10 * e * d)} V.` });
        }
        if (kind === "EdE") {
          let u, d; do { u = pick([50, 100, 150, 200, 300, 400, 500, 600, 1000]); d = pick([1, 2, 4, 5, 10, 20, 25]); } while (!nice(u / (10 * d), 2));
          return R(u / (10 * d), "kV/m", { text: `Bir-birindən ${d} sm aralıda yerləşən iki paralel lövhə arasında ${u} V gərginlik var. Aralarındakı sahə bircinsdir. Sahənin intensivliyi neçə kV/m-dir?`,
            solution: `E = U/d = ${u}/${F(d / 100)} = ${F(u / (d / 100))} V/m = ${F(u / (10 * d))} kV/m.` });
        }
        if (kind === "v") {
          let a, b, c, v; do { a = rnd(1, 10); b = pick([0.5, 1, 2, 4, 5, 8, 10]); c = pick([1, 2, 4, 5, 10, 20, 50]); v = Math.sqrt(2000 * a * b / c); } while (!nice(v, 1) || v < 5 || v > 2000);
          return R(v, "m/s", { text: `Kütləsi ${c} mq (1 mq = 10⁻⁶ kq), yükü ${a} mkKl olan tozcuq sükunət halından başlayıb ${F(b)} kV potensiallar fərqində sürətlənir. Son sürəti neçə m/s-dir? (Ağırlıq qüvvəsinə baxma.)`,
            solution: `qU = mv²/2 → v = √(2qU/m). qU = ${a}·10⁻⁶·${F(b)}·10³ = ${F(a * b / 1000)} J, m = ${c}·10⁻⁶ kq. v² = 2·${F(a * b / 1000)}/(${c}·10⁻⁶) = ${F(v * v)} → v = ${F(v)} m/s.` });
        }
        const U = pick([125, 250, 375, 500, 625, 750, 1000, 1250, 2500]), W = 0.016 * U;
        return R(W, "10⁻¹⁷ J", { text: `Elektron (e = 1,6·10⁻¹⁹ Kl) sükunət halından başlayıb ${U} V potensiallar fərqində sürətlənir. Son hərəkət enerjisi neçə 10⁻¹⁷ J-dur?`,
          solution: `Sahənin işi hərəkət enerjisinə çevrilir: W = eU = 1,6·10⁻¹⁹·${U} = ${F(1.6 * U)}·10⁻¹⁹ J = ${F(W)}·10⁻¹⁷ J.` });
      } },

    { id: "tutum", ad: "Tutum C = q/U, yastı kondensator", izah: "C = q/U (Farad). Yastı kondensator: C = ε₀εS/d, ε₀ = 8,85·10⁻¹² F/m. 1 mkF = 10⁻⁶ F, 1 pF = 10⁻¹² F.",
      gen() {
        const kind = pick(["q", "U", "C", "S", "d", "S", "d", "eps"]);
        if (kind === "q" || kind === "U" || kind === "C") {
          let c, u; do { c = pick([0.5, 1, 2, 2.5, 4, 5, 10, 20, 50, 100]); u = pick([5, 10, 12, 20, 50, 100, 120, 220, 300, 400]); } while (!nice(c * u, 2));
          const q = c * u;
          if (kind === "q") return R(q, "mkKl", { text: `Tutumu ${F(c)} mkF olan kondensator ${u} V gərginliyə qoşulub. Lövhələrindəki yük neçə mkKl-dur?`, solution: `q = CU = ${F(c)}·10⁻⁶·${u} = ${F(q)}·10⁻⁶ Kl = ${F(q)} mkKl.` });
          if (kind === "U") return R(u, "V", { text: `Tutumu ${F(c)} mkF olan kondensatora ${F(q)} mkKl yük verilib. Lövhələr arasındakı gərginlik neçə voltdur?`, solution: `U = q/C = ${F(q)}/${F(c)} = ${u} V.` });
          return R(c, "mkF", { text: `Kondensatora ${u} V gərginlik verəndə lövhələrində ${F(q)} mkKl yük toplanır. Kondensatorun tutumu neçə mkF-dır?`, solution: `C = q/U = ${F(q)}·10⁻⁶/${u} = ${F(c)}·10⁻⁶ F = ${F(c)} mkF.` });
        }
        let s, d, e, C; do { s = pick([20, 40, 50, 100, 200, 400, 500, 1000]); d = pick([1, 2, 3, 4, 5, 6, 10]); e = kind === "eps" ? pick([2, 3, 4, 5, 6, 7]) : 1; C = 0.885 * e * s / d; } while (!nice(C, 2) || C > 5000);
        const sol = (extra) => `S = ${s} sm² = ${F(s / 1e4)} m², d = ${d} mm = ${F(d / 1000)} m. C = ε₀${e > 1 ? "ε" : ""}S/d = 8,85·10⁻¹²${e > 1 ? "·" + e : ""}·${F(s / 1e4)}/${F(d / 1000)} = ${F(C)}·10⁻¹² F = ${F(C)} pF.` + (extra || "");
        const diel = e > 1 ? `, lövhələr arasında dielektrik nüfuzluğu ε = ${e} olan dielektrik var` : ", lövhələr arasında hava (ε = 1) var";
        if (kind === "S" || kind === "eps") return R(C, "pF", { text: `Yastı kondensatorun hər lövhəsinin sahəsi ${s} sm², lövhələr arasındakı məsafə ${d} mm-dir${diel}. Tutum neçə pF-dir? (ε₀ = 8,85·10⁻¹² F/m)`, solution: sol() });
        return R(d, "mm", { text: `Havalı yastı kondensatorun lövhəsinin sahəsi ${s} sm²-dir, tutumu ${F(C)} pF-dir. Lövhələr arasındakı məsafə neçə mm-dir? (ε₀ = 8,85·10⁻¹² F/m)`,
          solution: `d = ε₀S/C = 8,85·10⁻¹²·${F(s / 1e4)}/(${F(C)}·10⁻¹²) = ${F(d / 1000)} m = ${d} mm.` });
      } },

    { id: "deyisme", ad: "Lövhələr dəyişəndə", izah: "C ~ εS/d. Mənbəyə qoşulu: U sabit, q və W (= CU²/2) C kimi dəyişir. Mənbədən ayrılıb: q sabit, U = q/C, W = q²/2C — C-yə tərs dəyişir.",
      gen() {
        const conn = Math.random() < .5;
        const CH = [["lövhələr arasındakı məsafəni 2 dəfə artırdılar", 1 / 2], ["lövhələr arasındakı məsafəni 3 dəfə artırdılar", 1 / 3], ["lövhələr arasındakı məsafəni 2 dəfə azaltdılar", 2], ["lövhələrin sahəsini 3 dəfə artırdılar", 3], ["lövhələr arasına ε = 4 olan dielektrik qoydular", 4], ["lövhələr arasına ε = 2 olan dielektrik qoydular", 2], ["lövhələrin sahəsini 2 dəfə azaltdılar", 1 / 2]];
        for (;;) {
          const c = pick([1, 2, 3, 4, 5, 6, 10, 12, 20]), u = pick([60, 100, 120, 150, 200, 300, 400, 500]), ch = pick(CH), f = ch[1];
          const C2 = c * f, q1 = c * u, W1 = c * u * u / 2000;   // mkKl, mJ
          if (!nice(C2, 2)) continue;
          const fx = f < 1 ? `${F(1 / f)} dəfə azaldı` : `${F(f)} dəfə artdı`;
          if (conn) {
            const ask = pick(["q", "W"]);
            const v = ask === "q" ? q1 * f : W1 * f;
            if (!nice(v, 2) || v > 1e5) continue;
            return R(v, ask === "q" ? "mkKl" : "mJ", { text: `Havalı yastı kondensatorun tutumu ${c} mkF-dır, o, ${u} V-luq mənbəyə qoşulub və mənbədən ayrılmayıb. ${ch[0][0].toUpperCase() + ch[0].slice(1)}. ${ask === "q" ? "Lövhələrdəki yük" : "Kondensatorun enerjisi"} neçə ${ask === "q" ? "mkKl" : "mJ"} oldu?`,
              solution: `Mənbəyə qoşulu → U = ${u} V sabit. C ~ εS/d, ona görə tutum ${fx}: C₂ = ${F(C2)} mkF. ${ask === "q" ? `q = C₂U = ${F(C2)}·${u} = ${F(v)} mkKl.` : `W = C₂U²/2 = ${F(C2)}·10⁻⁶·${u}²/2 = ${F(v)} mJ.`}` });
          }
          const ask = pick(["U", "W"]);
          const v = ask === "U" ? u / f : W1 / f;
          if (!nice(v, 2) || v > 1e5) continue;
          return R(v, ask === "U" ? "V" : "mJ", { text: `Havalı yastı kondensatorun tutumu ${c} mkF-dır, ${u} V-a qədər doldurulub və mənbədən ayrılıb. ${ch[0][0].toUpperCase() + ch[0].slice(1)}. ${ask === "U" ? "Lövhələr arasındakı gərginlik" : "Kondensatorun enerjisi"} neçə ${ask === "U" ? "V" : "mJ"} oldu?`,
            solution: `Mənbədən ayrılıb → q = ${F(q1)} mkKl sabit. Tutum ${fx}: C₂ = ${F(C2)} mkF. ${ask === "U" ? `U₂ = q/C₂ = ${F(q1)}/${F(C2)} = ${F(v)} V.` : `W₂ = q²/(2C₂) = (${F(q1)}·10⁻⁶)²/(2·${F(C2)}·10⁻⁶) = ${F(v)} mJ.`}` });
        }
      } },

    { id: "birlesme", ad: "Ardıcıl və paralel", izah: "Paralel: C = C₁ + C₂ (gərginlik eyni, yük toplanır). Ardıcıl: 1/C = 1/C₁ + 1/C₂ (yük eyni, gərginlik toplanır). Rezistorların əksi.",
      gen() {
        const kind = pick(["ser", "ser", "ser3", "par", "mixA", "mixB", "volt", "qpar"]);
        if (kind === "ser") {
          const [a, b] = pick(PAIRS), v = Math.random() < .5 ? [a, b] : [b, a], C = ser(v);
          return R(C, "mkF", { svg: circuit("ser", v), text: `Şəkildəki kondensatorlar ardıcıl qoşulub. A və B uclarının arasında ümumi tutum neçə mkF-dır?`,
            solution: `Ardıcıl: 1/C = 1/${v[0]} + 1/${v[1]} → C = ${v[0]}·${v[1]}/(${v[0]} + ${v[1]}) = ${F(C)} mkF. Cavab hər birindən kiçikdir.` });
        }
        if (kind === "ser3") {
          let v, C; do { v = [pick(CV), pick(CV), pick(CV)]; C = ser(v); } while (!nice(C, 2) || new Set(v).size < 2 || Math.max(...v) > 20);
          return R(C, "mkF", { svg: circuit("ser", v), text: `Üç kondensator ardıcıl qoşulub. A və B uclarının arasında ümumi tutum neçə mkF-dır?`,
            solution: `1/C = 1/${v[0]} + 1/${v[1]} + 1/${v[2]} = ${F(1 / C)} → C = ${F(C)} mkF.` });
        }
        if (kind === "par") {
          const n = pick([2, 3]), v = Array.from({ length: n }, () => pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 20]));
          return R(par(v), "mkF", { svg: circuit("par", v), text: `Şəkildəki kondensatorlar paralel qoşulub. A və B uclarının arasında ümumi tutum neçə mkF-dır?`,
            solution: `Paralel: C = ${v.join(" + ")} = ${par(v)} mkF.` });
        }
        if (kind === "mixA") {
          let v, C; do { v = [pick(CV), pick(CV), pick(CV)]; C = ser([v[0], v[1] + v[2]]); } while (!nice(C, 2) || Math.max(...v) > 20);
          return R(C, "mkF", { svg: circuit("mixA", v), text: `Şəkildəki sxemdə A və B uclarının arasında ümumi tutum neçə mkF-dır?`,
            solution: `C₂ və C₃ paraleldir: ${v[1]} + ${v[2]} = ${v[1] + v[2]} mkF. Bu, C₁ = ${v[0]} mkF ilə ardıcıldır: C = ${v[0]}·${v[1] + v[2]}/(${v[0]} + ${v[1] + v[2]}) = ${F(C)} mkF.` });
        }
        if (kind === "mixB") {
          let v, C; do { v = [pick(CV), pick(CV), pick(CV)]; C = ser([v[0], v[1]]) + v[2]; } while (!nice(C, 2) || Math.max(...v) > 20);
          return R(C, "mkF", { svg: circuit("mixB", v), text: `Şəkildəki sxemdə A və B uclarının arasında ümumi tutum neçə mkF-dır?`,
            solution: `C₁ və C₂ ardıcıldır: ${v[0]}·${v[1]}/(${v[0]} + ${v[1]}) = ${F(ser([v[0], v[1]]))} mkF. Bu, C₃ = ${v[2]} mkF ilə paraleldir: C = ${F(ser([v[0], v[1]]))} + ${v[2]} = ${F(C)} mkF.` });
        }
        if (kind === "volt") {
          let a, b, u, u1; do { [a, b] = pick(PAIRS); u = pick([30, 60, 90, 120, 150, 180, 200, 240, 300]); u1 = u * b / (a + b); } while (a === b || !nice(u1, 2));
          return R(u1, "V", { svg: circuit("ser", [a, b]), text: `C₁ = ${a} mkF və C₂ = ${b} mkF kondensatorları ardıcıl birləşdirilib və A, B uclarına ${u} V gərginlik verilib. Birinci kondensatorun gərginliyi neçə voltdur?`,
            solution: `Ardıcıl: yük eynidir. C = ${a}·${b}/${a + b} = ${F(ser([a, b]))} mkF, q = CU = ${F(ser([a, b]) * u)} mkKl. U₁ = q/C₁ = ${F(ser([a, b]) * u)}/${a} = ${F(u1)} V. (Kiçik tutumda gərginlik böyükdür.)` });
        }
        let v, u; do { v = [pick([1, 2, 3, 4, 5, 6, 10, 20]), pick([1, 2, 3, 4, 5, 6, 10, 20])]; u = pick([10, 12, 20, 50, 100, 120, 220]); } while (!nice(par(v) * u, 2));
        return R(par(v) * u, "mkKl", { svg: circuit("par", v), text: `C₁ = ${v[0]} mkF və C₂ = ${v[1]} mkF kondensatorları paralel qoşulub və A, B uclarına ${u} V gərginlik verilib. Sistemdə toplanan ümumi yük neçə mkKl-dur?`,
          solution: `Paralel: C = ${v[0]} + ${v[1]} = ${par(v)} mkF. q = CU = ${par(v)}·${u} = ${F(par(v) * u)} mkKl.` });
      } },

    { id: "enerji", ad: "Enerji, yüklü kondensatorların birləşməsi", izah: "W = CU²/2 = qU/2 = q²/2C. Yüklü kondensatorları birləşdirəndə yük saxlanır, ümumi gərginlik U = (q₁ + q₂)/(C₁ + C₂); enerjinin bir hissəsi istiliyə çevrilir.",
      gen() {
        const kind = pick(["W", "W", "Wq", "U", "conn", "conn2", "heat", "pull"]);
        if (kind === "W") {
          let c, u, w; do { c = pick([2, 4, 5, 10, 20, 50, 100]); u = pick([20, 50, 100, 150, 200, 300, 400]); w = c * u * u / 2000; } while (!nice(w, 2));
          return R(w, "mJ", { text: `Tutumu ${c} mkF olan kondensator ${u} V-a qədər doldurulub. Onun enerjisi neçə mJ-dur?`, solution: `W = CU²/2 = ${c}·10⁻⁶·${u}²/2 = ${F(w * 1e-3)} J = ${F(w)} mJ.` });
        }
        if (kind === "Wq") {
          let q, c, w; do { q = pick([10, 20, 30, 40, 50, 60, 100, 200]); c = pick([1, 2, 4, 5, 10, 20, 25]); w = q * q / (2 * c); } while (!nice(w, 2) || w > 1e5);
          return R(w, "mkJ", { text: `Tutumu ${c} mkF olan kondensatorun lövhələrində ${q} mkKl yük var. Enerjisi neçə mkJ-dur? (1 mkJ = 10⁻⁶ J)`, solution: `W = q²/(2C) = (${q}·10⁻⁶)²/(2·${c}·10⁻⁶) = ${F(w)}·10⁻⁶ J = ${F(w)} mkJ.` });
        }
        if (kind === "U") {
          let c, u, w; do { c = pick([2, 4, 5, 10, 20, 50]); u = pick([20, 50, 100, 150, 200, 300]); w = c * u * u / 2000; } while (!nice(w, 2));
          return R(u, "V", { text: `Tutumu ${c} mkF olan kondensatorun enerjisi ${F(w)} mJ-dur. Onun gərginliyi neçə voltdur?`, solution: `W = CU²/2 → U² = 2W/C = 2·${F(w)}·10⁻³/(${c}·10⁻⁶) = ${u * u} → U = ${u} V.` });
        }
        if (kind === "conn" || kind === "heat") {
          let c1, c2, u1, u2, e; do { c1 = pick([2, 3, 4, 5, 6, 10, 12, 20]); c2 = pick([1, 2, 3, 4, 5, 6, 10, 20]); u1 = pick([60, 100, 120, 150, 200, 300, 400]); u2 = c1 * u1 / (c1 + c2); e = c1 * u1 * u1 / 2000 * c2 / (c1 + c2); } while (!nice(u2, 2) || !nice(e, 2));
          const t = `Tutumu ${c1} mkF olan kondensator ${u1} V-a qədər doldurulub, sonra mənbədən ayrılıb və yüksüz ${c2} mkF-lıq kondensatora paralel qoşulub.`;
          const sol = `Yük saxlanır: q = C₁U₁ = ${c1 * u1} mkKl. Qoşulandan sonra C = ${c1 + c2} mkF, U = q/C = ${F(u2)} V.`;
          if (kind === "conn") return R(u2, "V", { text: t + " Qoşulandan sonra ortaq gərginlik neçə voltdur?", solution: sol });
          return R(e, "mJ", { text: t + " Qoşulma zamanı neçə mJ enerji istiliyə çevrilir?", solution: sol + ` Əvvəl W₁ = C₁U₁²/2 = ${F(c1 * u1 * u1 / 2000)} mJ, sonra W₂ = (C₁ + C₂)U²/2 = ${F((c1 + c2) * u2 * u2 / 2000)} mJ. Fərq: ${F(e)} mJ.` });
        }
        if (kind === "conn2") {
          let c1, c2, u1, u2, opp, u; do { c1 = pick([2, 3, 4, 5, 6, 10, 12]); c2 = pick([1, 2, 3, 4, 5, 6, 10]); u1 = pick([60, 100, 120, 150, 200, 300]); u2 = pick([20, 40, 50, 60, 100, 120, 150]); opp = Math.random() < .5; u = Math.abs(c1 * u1 + (opp ? -1 : 1) * c2 * u2) / (c1 + c2); } while (!nice(u, 2) || u === 0);
          return R(u, "V", { text: `Tutumları ${c1} mkF və ${c2} mkF olan kondensatorlar ${u1} V və ${u2} V-a qədər doldurulub. Onları ${opp ? "əks işarəli lövhələri (müsbəti mənfiylə)" : "eyni işarəli lövhələri (müsbəti müsbətlə)"} birləşdirib paralel qoşdular. Ortaq gərginlik neçə voltdur?`,
            solution: `Yük saxlanır: q = ${c1}·${u1} ${opp ? "−" : "+"} ${c2}·${u2} = ${F(Math.abs(c1 * u1 + (opp ? -1 : 1) * c2 * u2))} mkKl${opp ? " (əks işarəli yüklər bir-birini azaldır)" : ""}. U = q/(C₁ + C₂) = ${F(Math.abs(c1 * u1 + (opp ? -1 : 1) * c2 * u2))}/${c1 + c2} = ${F(u)} V.` });
        }
        let c, u, n, w; do { c = pick([2, 4, 5, 10, 20, 50]); u = pick([100, 200, 300, 400, 500]); n = pick([2, 3, 4]); w = c * u * u / 2000 * (n - 1); } while (!nice(w, 2));
        return R(w, "mJ", { text: `Havalı yastı kondensator (${c} mkF) ${u} V-a qədər doldurulub və mənbədən ayrılıb. Lövhələr arasındakı məsafəni ${n} dəfə artırmaq üçün xarici qüvvə neçə mJ iş görməlidir?`,
          solution: `Yük sabitdir. C ${n} dəfə azalır, W = q²/2C ${n} dəfə artır. W₁ = CU²/2 = ${F(c * u * u / 2000)} mJ, W₂ = ${n}W₁. İş = W₂ − W₁ = ${n - 1}·${F(c * u * u / 2000)} = ${F(w)} mJ.` });
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let a, b, u, C, q, u1; do { [a, b] = pick(PAIRS); u = pick([60, 90, 120, 150, 180, 240]); C = a * b / (a + b); q = C * u; u1 = q / a; } while (a === b || !nice(q, 2) || !nice(u1, 2));
          task = `C₁ = ${a} mkF və C₂ = ${b} mkF kondensatorları ardıcıl birləşdirilib və ${u} V gərginliyə qoşulub. Birinci kondensatorun gərginliyi neçə voltdur?`;
          steps = [
            `Ardıcıl birləşmə: 1/C = 1/C₁ + 1/C₂ → C = ${a}·${b}/(${a} + ${b}) = ${F(C)} mkF.`,
            `Ardıcıl kondensatorlarda yük eynidir: q = C·U = ${F(C)}·${u} = ${F(q)} mkKl.`,
            `U₁ = q/C₁ = ${F(q)}/${a} = ${F(u1)} V.`,
          ];
          if (bad === 0) { const Cw = a + b; steps = [`Ardıcıl birləşmə: C = C₁ + C₂ = ${a} + ${b} = ${Cw} mkF.`, `Ardıcıl kondensatorlarda yük eynidir: q = C·U = ${Cw}·${u} = ${F(Cw * u)} mkKl.`, `U₁ = q/C₁ = ${F(Cw * u)}/${a} = ${F(Cw * u / a)} V.`]; }
          if (bad === 1) steps[1] = `Ardıcıl kondensatorlarda yük eynidir: q = U/C = ${u}/${F(C)} = ${F(u / C)} mkKl.`, steps[2] = `U₁ = q/C₁ = ${F(u / C)}/${a} = ${F(u / C / a)} V.`;
          if (bad === 2) steps[2] = `U₁ = q/C₂ = ${F(q)}/${b} = ${F(q / b)} V.`;
          why = [`1-ci addım: C₁ + C₂ paralel birləşmənin düsturudur. Ardıcılda C = ${F(C)} mkF, düz cavab ${F(u1)} V.`,
            `2-ci addım: C = q/U-dan q = C·U, bölmə yox. Düz cavab ${F(u1)} V.`,
            `3-cü addım: birinci kondensatorun gərginliyi q/C₁-dir (${a} mkF). Düz cavab ${F(u1)} V.`][bad];
        } else {
          let c, u; do { c = pick([2, 4, 5, 10, 20]); u = pick([100, 200, 300, 400]); } while (!nice(c * u * u / 2000, 2));
          const q = c * u, W1 = c * u * u / 2000;
          task = `Havalı yastı kondensator (${c} mkF) ${u} V-a qədər doldurulub və mənbədən ayrılıb. Lövhələr arasındakı məsafəni 2 dəfə artırdılar. Enerji neçə mJ oldu?`;
          steps = [
            `Mənbədən ayrılıb, ona görə yük sabitdir: q = CU = ${c}·${u} = ${q} mkKl.`,
            `d 2 dəfə artdı → C₂ = C/2 = ${F(c / 2)} mkF, U₂ = q/C₂ = ${F(q / (c / 2))} V.`,
            `W₂ = C₂U₂²/2 = ${F(c / 2)}·10⁻⁶·${F(2 * u)}²/2 = ${F(2 * W1)} mJ.`,
          ];
          if (bad === 0) steps = [`Kondensator ${u} V-luq gərginlikdə qalır (U sabitdir).`, `d 2 dəfə artdı → C₂ = C/2 = ${F(c / 2)} mkF, U₂ = ${u} V.`, `W₂ = C₂U₂²/2 = ${F(c / 2)}·10⁻⁶·${u}²/2 = ${F(W1 / 2)} mJ.`];
          if (bad === 1) steps[1] = `d 2 dəfə artdı → C₂ = 2C = ${2 * c} mkF, U₂ = q/C₂ = ${F(q / (2 * c))} V.`, steps[2] = `W₂ = C₂U₂²/2 = ${2 * c}·10⁻⁶·${F(u / 2)}²/2 = ${F(W1 / 2)} mJ.`;
          if (bad === 2) steps[2] = `W₂ = C₂U₂²/2 = ${F(c / 2)}·10⁻⁶·${F(2 * u)}²/2 = ${F(4 * W1)} mJ.`;
          why = [`1-ci addım: mənbədən ayrılıbsa, sabit olan U yox, q-dur. Düz cavab ${F(2 * W1)} mJ.`,
            `2-ci addım: C ~ 1/d, məsafə artanda tutum azalır: C₂ = C/2. Düz cavab ${F(2 * W1)} mJ.`,
            `3-cü addım: ${F(c / 2)}·10⁻⁶·${F(2 * u)}²/2 = ${F(2 * W1)} mJ, ${F(4 * W1)} deyil. Enerji 2 dəfə artır.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Fotoaparatın blitzi, defibrillyator, klaviatura düyməsi, buludla yer arasındakı kondensator.",
      gen() {
        const kind = pick(["blitz", "defib", "klav", "bulud"]);
        if (kind === "blitz") {
          let c, u, w; do { c = pick([50, 100, 200, 400, 500, 1000]); u = pick([100, 200, 300, 400]); w = c * u * u / 2e6; } while (!nice(w, 2));
          return R(w, "J", { text: `Fotoaparatın blitzində tutumu ${c} mkF olan kondensator ${u} V-a qədər doldurulur və lampa vasitəsilə bir anda boşalır. Ayrılan enerji neçə culdur (J)?`,
            solution: `W = CU²/2 = ${c}·10⁻⁶·${u}²/2 = ${F(w)} J.` });
        }
        if (kind === "defib") {
          const c = pick([20, 40, 50, 60, 70, 100]), u = pick([2, 3, 4, 5]), w = c * u * u / 2;
          return R(w, "J", { text: `Defibrillyatorun kondensatorunun tutumu ${c} mkF-dır, ${u} kV-a qədər doldurulur. Ürəyə verilən enerji neçə culdur (J)? (Bütün enerjinin verildiyini götür.)`,
            solution: `W = CU²/2 = ${c}·10⁻⁶·(${u}·10³)²/2 = ${c}·10⁻⁶·${u * u}·10⁶/2 = ${F(w)} J.` });
        }
        if (kind === "klav") {
          let c1, d1, d2, c2; do { c1 = pick([1, 2, 3, 4, 5, 6]); d1 = pick([2, 3, 4, 5, 6, 8]); d2 = pick([1, 1.5, 2, 2.5, 4]); c2 = c1 * d1 / d2; } while (d2 >= d1 || !nice(c2, 2));
          return R(c2, "pF", { text: `Kompüter klaviaturasının düyməsi yastı kondensator rolunu oynayır: düyməni basanda lövhələr arasındakı məsafə ${d1} mm-dən ${F(d2)} mm-ə qədər azalır. Basmazdan əvvəl tutum ${c1} pF idi. Basılandan sonra tutum neçə pF olur?`,
            solution: `C ~ 1/d: tutum ${F(d1 / d2)} dəfə artır. C₂ = ${c1}·${d1}/${F(d2)} = ${F(c2)} pF. Elektronika bu dəyişməni "basıldı" siqnalına çevirir.` });
        }
        let s, d, c; do { s = pick([2, 4, 5, 10, 20, 50]); d = pick([1, 2, 3, 4, 5]); c = 8.85 * s / d; } while (!nice(c, 2));
        return R(c, "nF", { text: `Tufan buludunu və yeri iri yastı kondensator kimi təsvir etmək olar: bulud lövhəsinin sahəsi ${s} km², yerə qədər məsafə ${d} km-dir, aralarında hava var. Tutum təxminən neçə nF-dır? (ε₀ = 8,85·10⁻¹² F/m, 1 nF = 10⁻⁹ F)`,
          solution: `S = ${s} km² = ${s}·10⁶ m², d = ${d} km = ${d}·10³ m. C = ε₀S/d = 8,85·10⁻¹²·${s}·10⁶/(${d}·10³) = ${F(c)}·10⁻⁹ F = ${F(c)} nF.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-kondensator", title: "Potensial, elektrik tutumu, kondensatorlar", fenn: "fizika", link: "dersler/fiz-kondensator.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (V, kV/m, mkF, mkKl, mJ, J və s.). Onluq kəsr vergül və ya nöqtə ilə: 0,5. k = 9·10⁹ N·m²/Kl², ε₀ = 8,85·10⁻¹² F/m.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["potensial", "potensial", "tutum", "deyisme", "birlesme", "birlesme", "enerji", "enerji", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-kondensator.html")) b.push("dersler/fiz-kondensator.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
