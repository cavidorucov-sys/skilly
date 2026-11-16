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
  function circuit(kind, v, note) {   // v = capacitances in mkF; terminals A and B; note = text under the drawing
    const W = 300, H = note ? 126 : 110, g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Kondensatorların birləşməsi, A və B uclarıdır" });
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
      wire(g, 100, 55, 120, 55); wire(g, 120, 34, 120, 82); wire(g, 250, 34, 250, 82); wire(g, 250, 55, W - 8, 55);
      hcap(g, 120, 250, 34, L(1)); hcap(g, 120, 250, 82, L(2));
      dot(g, 120, 55, 3); dot(g, 250, 55, 3); dot(g, 8, 55, 4); dot(g, W - 8, 55, 4);
    } else {                           // mixB: (C1 series C2) ∥ C3
      wire(g, 8, 55, 40, 55); wire(g, 260, 55, W - 8, 55); wire(g, 40, 34, 40, 82); wire(g, 260, 34, 260, 82);
      hcap(g, 40, 150, 34, L(0)); hcap(g, 150, 260, 34, L(1)); hcap(g, 40, 260, 82, L(2));
      dot(g, 40, 55, 3); dot(g, 260, 55, 3); dot(g, 8, 55, 4); dot(g, W - 8, 55, 4);
    }
    g.append(sv("text", { x: 8, y: 14, class: "oy-lbl" }, "A")); g.append(sv("text", { x: W - 14, y: 14, class: "oy-lbl" }, "B"));
    if (note) g.append(sv("text", { x: W / 2, y: H - 5, "text-anchor": "middle", class: "oy-lbl" }, note));
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

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a drawing, several steps;
  // the wrong options are the answers of typical mistakes. Questions 5, 8, 9 and 10 also use "Kulon qanunu" (fiz-kulon),
  // "Om qanunu" (fiz-om), "Nyuton qanunları" (fiz-nyuton) and "İstilik miqdarı" (fiz-istilik).
  const { ae, again } = Oyun;
  const ok2 = x => isFinite(x) && x > 0 && nice(x, 2);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const Un = u => x => F(x) + " " + u;
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  // string SVG helpers (the same drawings are pasted into the lesson tab "İmtahanda necə gəlir")
  const MUT = "var(--muted,#6b6b73)", ACC = "var(--accent,#a32d2d)", VEC = "var(--vec,#0c447c)", PAP = "var(--paper,#fff)";
  const f1 = n => +(+n).toFixed(1);
  const Ls = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const Ts = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const Ds = (x, y, r = 3.2) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${INK}"/>`;
  const Rs = (x, y, w, h, fill = PAP, ex = "") => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${fill}" stroke="${INK}" stroke-width="2"${ex}/>`;
  const Ar = (x1, y1, x2, y2, c = ACC, w = 2.5, both = false) => Ls(x1, y1, x2, y2, c, w, ` marker-end="url(#kd-ar)"` + (both ? ` marker-start="url(#kd-ar)"` : ""));
  const Sv = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" class="oy-svg" role="img" aria-label="${aria}"><defs><marker id="kd-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  const DASH = ' stroke-dasharray="6 4"';
  // detached plate capacitor, the lower plate is pulled away: d → n·d
  const figPull = n => Sv(290, 190,
    Ls(60, 40, 200, 40, INK, 4) + Ls(60, 90, 200, 90, INK, 4) + Ls(60, 150, 200, 150, MUT, 4, ' stroke-dasharray="7 5"')
    + Ts(52, 46, "+q", "end") + Ts(52, 96, "−q", "end") + Ts(130, 28, "S")
    + Ar(130, 98, 130, 144) + Ts(142, 126, "F", "start", ACC)
    + Ar(228, 40, 228, 90, INK, 1.6, true) + Ts(236, 69, "d", "start") + Ar(262, 40, 262, 150, INK, 1.6, true) + Ts(268, 98, n + "d", "start")
    + Ts(130, 178, "mənbədən ayrılıb (şəkil miqyassızdır)", "middle", MUT, 12), "Mənbədən ayrılmış yastı kondensator, aşağı lövhə d məsafəsindən " + n + "d məsafəsinə çəkilir");
  // a charged ball on a thread between vertical plates; arrows ~ mg and qE
  const figBall = (W, Fe) => { const L = 70, ang = Math.atan2(Fe, W), bx = 145 + L * Math.sin(ang), by = 26 + L * Math.cos(ang), m = Math.max(W, Fe), aw = 18 * W / m, af = 18 * Fe / m;
    return Sv(300, 214, Ls(50, 34, 50, 190, INK, 4) + Ls(250, 34, 250, 190, INK, 4) + Ts(50, 26, "+", "middle", INK, 16) + Ts(250, 26, "−", "middle", INK, 16)
      + Ls(125, 26, 165, 26, INK, 3) + Ls(145, 26, bx, by, INK, 1.6) + Ds(145, 26)
      + Ar(bx, by + 9, bx, by + 9 + aw, ACC, 2.5) + Ts(bx + 7, by + 9 + aw + 2, "mg", "start", ACC)
      + Ar(bx + 9, by, bx + 9 + af, by, VEC, 2.5) + Ts(bx + 9 + af / 2, by - 8, "qE", "middle", VEC)
      + `<circle cx="${f1(bx)}" cy="${f1(by)}" r="8" fill="${INK}"/>`
      + Ar(80, 165, 150, 165, MUT, 1.6) + Ts(115, 157, "E", "middle", MUT)
      + Ar(50, 205, 250, 205, INK, 1.6, true) + Ts(150, 199, "d"), "Yüklü kürə iplə asılıb, şaquli lövhələr arasındadır; ağırlıq qüvvəsi aşağı, elektrik qüvvəsi üfüqi"); };
  // U, R1, R2 in series; C parallel to R2
  const figDC = () => Sv(260, 180,
    Ls(40, 36, 210, 36) + Ls(40, 164, 210, 164) + Ls(40, 36, 40, 95) + Ls(40, 105, 40, 164) + Ls(150, 36, 150, 164) + Ls(210, 36, 210, 96) + Ls(210, 104, 210, 164)
    + Ls(27, 95, 53, 95, INK, 3) + Ls(33, 105, 47, 105, INK, 3) + Ts(61, 93, "+", "start", INK, 12) + Ts(21, 104, "U", "end")
    + Rs(72, 29, 36, 14) + Ts(90, 24, "R₁") + Rs(143, 84, 14, 32) + Ts(138, 104, "R₂", "end")
    + Ls(197, 96, 223, 96, INK, 3) + Ls(197, 104, 223, 104, INK, 3) + Ts(231, 104, "C", "start") + Ds(150, 36) + Ds(150, 164),
    "Mənbə, R₁ və R₂ ardıcıl; kondensator R₂-yə paralel");
  // q–U graph of two capacitors: x grid unit = 10 V, y grid unit = 100 mkKl
  const figQU = (p1, p2) => { const X = u => 40 + u * 15, Y = i => 160 - i * 22;
    let s = Ls(40, 160, 235, 160) + Ls(40, 160, 40, 15) + Ts(240, 176, "U, V", "start", INK, 12) + Ts(46, 10, "q, mkKl", "start", INK, 12);
    for (let u = 2; u <= 12; u += 2) s += Ls(X(u), 160, X(u), 22, MUT, 0.6) + Ts(X(u), 176, u * 10, "middle", MUT, 11);
    for (let i = 1; i <= 6; i++) s += Ls(40, Y(i), 220, Y(i), MUT, 0.6) + Ts(32, Y(i) + 4, i * 100, "end", MUT, 11);
    [[p1, ACC, "1"], [p2, VEC, "2"]].forEach(([[u, i], c, n]) => { const k = Math.min(12 / u, 6 / i); s += Ls(40, 160, X(u * k), Y(i * k), c, 2.5) + `<circle cx="${X(u)}" cy="${Y(i)}" r="3.5" fill="${c}"/>` + Ts(X(u * k) + 4, Y(i * k) - 4, n, "start", c); });
    return Sv(280, 190, s, "İki kondensatorun yükünün gərginlikdən asılılıq qrafiki: 1 və 2"); };
  // two charged capacitors, like or unlike plates joined
  const figConn = (c1, u1, c2, u2, opp) => { const cap = (x, top) => Ls(x - 16, 75, x + 16, 75, INK, 3) + Ls(x - 16, 85, x + 16, 85, INK, 3) + Ts(x - 24, 77, top ? "+" : "−", "end", INK, 14) + Ts(x - 24, 95, top ? "−" : "+", "end", INK, 14);
    return Sv(290, 170, Ls(70, 40, 70, 75) + Ls(70, 85, 70, 120) + Ls(220, 40, 220, 75) + Ls(220, 85, 220, 120)
      + Ls(70, 40, 220, 40, INK, 1.8, DASH) + Ls(70, 120, 220, 120, INK, 1.8, DASH) + Ts(145, 32, "birləşdirilir", "middle", MUT, 12)
      + cap(70, true) + cap(220, !opp) + Ts(70, 143, `C₁ = ${c1} mkF`) + Ts(70, 160, `${u1} V`) + Ts(220, 143, `C₂ = ${c2} mkF`) + Ts(220, 160, `${u2} V`),
      "İki yüklü kondensator: " + (opp ? "müsbət lövhə ilə mənfi lövhə" : "eyni işarəli lövhələr") + " birləşdirilir"); };
  // a charged capacitor discharges through a heater in water
  const figHeat = () => Sv(270, 180,
    Ls(40, 36, 90, 36) + Ls(110, 36, 200, 36) + Ls(200, 36, 200, 95) + Ls(200, 128, 200, 164) + Ls(40, 164, 200, 164) + Ls(40, 36, 40, 95) + Ls(40, 105, 40, 164)
    + Ls(90, 36, 108, 22) + Ds(90, 36) + Ds(110, 36) + Ts(100, 54, "K")
    + Ls(27, 95, 53, 95, INK, 3) + Ls(27, 105, 53, 105, INK, 3) + Ts(61, 104, "C₁, C₂ paralel", "start")
    + `<rect x="150" y="70" width="100" height="80" fill="${VEC}" fill-opacity=".14" stroke="${INK}" stroke-width="2"/>`
    + `<polyline points="200,95 190,101 210,109 190,117 210,125 200,128" fill="none" stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`
    + Ts(218, 114, "R", "start") + Ts(172, 142, "su", "middle", INK, 12), "Kondensator K açarı ilə suya salınmış qızdırıcıya qoşulur");
  // two dielectric layers between the plates (side view)
  const figLayer = (S, d1, e1, d2, e2) => { const H = 104, h1 = H * d1 / (d1 + d2), y0 = 42;
    return Sv(300, 190, `<rect x="50" y="${y0}" width="150" height="${f1(h1)}" fill="${VEC}" fill-opacity=".14"/><rect x="50" y="${f1(y0 + h1)}" width="150" height="${f1(H - h1)}" fill="${ACC}" fill-opacity=".14"/>`
      + Ls(50, 40, 200, 40, INK, 4) + Ls(50, y0 + H + 2, 200, y0 + H + 2, INK, 4) + Ls(50, y0 + h1, 200, y0 + h1, MUT, 1, ' stroke-dasharray="4 3"')
      + Ts(125, y0 + h1 / 2 + 5, "ε₁ = " + e1) + Ts(125, y0 + h1 + (H - h1) / 2 + 5, "ε₂ = " + e2)
      + Ar(222, 42, 222, y0 + h1, INK, 1.6, true) + Ts(230, y0 + h1 / 2 + 4, `d₁ = ${d1} mm`, "start", INK, 12)
      + Ar(222, y0 + h1, 222, y0 + H, INK, 1.6, true) + Ts(230, y0 + h1 + (H - h1) / 2 + 4, `d₂ = ${d2} mm`, "start", INK, 12)
      + Ts(125, 28, "S", "middle", INK, 13) + Ts(125, 172, `hər lövhənin sahəsi S = ${S} sm²`, "middle", MUT, 12), "Yastı kondensatorun lövhələri arasında iki dielektrik təbəqə"); };
  // two point charges on a line and the point M between them
  const figPts = (a, b, r1, r2) => { const x1 = 40, x2 = 260, xm = x1 + (x2 - x1) * Math.min(.75, Math.max(.25, r1 / (r1 + r2)));
    return Sv(300, 120, Ls(x1, 70, x2, 70, INK, 1.6) + `<circle cx="${x1}" cy="70" r="10" fill="${PAP}" stroke="${INK}" stroke-width="2"/><circle cx="${x2}" cy="70" r="10" fill="${PAP}" stroke="${INK}" stroke-width="2"/>`
      + Ts(x1, 75, "+", "middle", INK, 14) + Ts(x2, 75, "−", "middle", INK, 14) + Ds(xm, 70, 4) + Ts(xm, 92, "M")
      + Ar(x1 + 12, 50, xm - 3, 50, INK, 1.6, true) + Ts((x1 + 12 + xm - 3) / 2, 44, `r₁ = ${r1} sm`, "middle", INK, 12)
      + Ar(xm + 3, 50, x2 - 12, 50, INK, 1.6, true) + Ts((xm + 3 + x2 - 12) / 2, 44, `r₂ = ${r2} sm`, "middle", INK, 12)
      + Ts(150, 106, "şəkil miqyassızdır", "middle", MUT, 11) + Ts(x1, 106, `+${a} nKl`) + Ts(x2, 106, `−${b} nKl`), "Müsbət və mənfi nöqtəvi yük, aralarında M nöqtəsi"); };

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. charge on one capacitor of a series–parallel mix (charge of the series part is common; the group splits it by voltage)
    { tip: "qapali", gen: () => again(() => {
      const v = [pick(CV), pick(CV), pick(CV)], U = pick([60, 90, 120, 150, 180, 200, 240, 300]);
      if (Math.max(...v) > 20 || v[1] === v[2] || v[0] === v[1] + v[2]) return null;
      const c23 = v[1] + v[2], C = ser([v[0], c23]), q = C * U, u23 = q / c23, q2 = u23 * v[1];
      const w = [q, v[1] * U, q / 2, v[1] * q / v[0]]; if (!nice(C, 2) || ![q2, ...w].every(ok2)) return null;
      return mc(ae(q2, w, Un("mkKl")), { svg: circuit("mixA", v, `A–B: U = ${U} V`), text: `Şəkildəki sxemin A və B uclarına U = ${U} V gərginlik verilib. Başlanğıcda kondensatorlar yüksüz idi. C₂ kondensatorunun lövhələrindəki yük neçə mkKl-dur?`,
        solution: `C₂ və C₃ paraleldir: ${v[1]} + ${v[2]} = ${c23} mkF. Bu qrup C₁ ilə ardıcıldır: C = ${v[0]}·${c23}/(${v[0]} + ${c23}) = ${F(C)} mkF. Ardıcıl hissələrdə yük eynidir: q = CU = ${F(C)}·${U} = ${F(q)} mkKl (C₁-də də, bütün paralel qrupda cəmi də). Qrupda gərginlik eynidir: U₂₃ = q/(C₂ + C₃) = ${F(q)}/${c23} = ${F(u23)} V. Onda q₂ = C₂U₂₃ = ${v[1]}·${F(u23)} = ${F(q2)} mkKl. Tələlər: bütün yükü C₂-yə yazmaq (${F(q)}), C₂-yə tam U vermək (${F(v[1] * U)}), yükü bərabər bölmək (${F(q / 2)}), C₁-in gərginliyini C₂-yə tətbiq etmək (${F(v[1] * q / v[0])}).` });
    }) },
    // 2. energy of a series–parallel mix
    { tip: "qapali", gen: () => again(() => {
      const v = [pick(CV), pick(CV), pick(CV)], U = pick([20, 40, 50, 60, 100, 120, 150, 200]);
      if (Math.max(...v) > 20) return null;
      const cs = ser([v[0], v[1]]), C = cs + v[2], W = C * U * U / 2000, e = C2 => C2 * U * U / 2000;
      const w = [e(par(v)), e(ser(v)), 2 * W, e(cs)]; if (![W, ...w].every(ok2)) return null;
      return mc(ae(W, w, Un("mJ")), { svg: circuit("mixB", v, `A–B: U = ${U} V`), text: `Şəkildəki sxemin A və B uclarına U = ${U} V gərginlik verilib (kondensatorlar əvvəl yüksüz idi). Kondensatorlar sistemində toplanan enerji neçə mJ-dur?`,
        solution: `C₁ və C₂ ardıcıldır: ${v[0]}·${v[1]}/(${v[0]} + ${v[1]}) = ${F(cs)} mkF. Bu, C₃ = ${v[2]} mkF ilə paraleldir: C = ${F(cs)} + ${v[2]} = ${F(C)} mkF. W = CU²/2 = ${F(C)}·10⁻⁶·${U}²/2 = ${F(W)} mJ. Tələlər: hamısını paralel saymaq (${F(e(par(v)))} mJ), hamısını ardıcıl saymaq (${F(e(ser(v)))} mJ), ½-ni unutmaq (${F(2 * W)} mJ), C₃-ü unutmaq (${F(e(cs))} mJ).` });
    }) },
    // 3. two capacitors from a q–U graph, then joined in series or in parallel
    { tip: "qapali", minVariety: 10, gen: () => again(() => {
      const pts = []; for (const u of [2, 4, 6, 8, 10, 12]) for (const i of [1, 2, 3, 4, 5, 6]) pts.push([u, i]);
      const p1 = pick(pts), p2 = pick(pts), C1 = 10 * p1[1] / p1[0], C2 = 10 * p2[1] / p2[0]; if (C1 === C2) return null;
      const isSer = Math.random() < .5, s = C1 * C2 / (C1 + C2), p = C1 + C2;
      const w = isSer ? [p, 1 / C1 + 1 / C2, p / 2, Math.abs(C1 - C2)] : [s, p / 2, Math.abs(C1 - C2), C1 * C2];
      if (![isSer ? s : p, C1, C2, ...w].every(ok2)) return null;
      return mc(ae(isSer ? s : p, w, Un("mkF")), { svg: svgEl(figQU(p1, p2)), text: `Qrafikdə 1 və 2 kondensatorlarının yükünün gərginlikdən asılılığı verilib. Bu kondensatorları ${isSer ? "ardıcıl" : "paralel"} birləşdirsək, ümumi tutum neçə mkF olar?`,
        solution: `C = q/U. Qrafikdən: C₁ = ${p1[1] * 100}/${p1[0] * 10} = ${F(C1)} mkF, C₂ = ${p2[1] * 100}/${p2[0] * 10} = ${F(C2)} mkF. ${isSer ? `Ardıcıl: C = C₁C₂/(C₁ + C₂) = ${F(s)} mkF. Tələlər: toplamaq (${F(p)}), 1/C₁ + 1/C₂ tapıb tərsinə çevirməyi unutmaq (${F(1 / C1 + 1 / C2)}), ortalama (${F(p / 2)}), fərq (${F(Math.abs(C1 - C2))}).` : `Paralel: C = C₁ + C₂ = ${F(p)} mkF. Tələlər: ardıcıl düstur (${F(s)}), ortalama (${F(p / 2)}), fərq (${F(Math.abs(C1 - C2))}), hasil (${F(C1 * C2)}).`}` });
    }) },
    // 4. capacitance with two dielectric layers (layers in series)
    { tip: "qapali", gen: () => again(() => {
      const S = pick([100, 200, 400, 500, 800, 1000, 2000]), d1 = pick([1, 2, 3, 4, 6]), d2 = pick([1, 2, 3, 4, 6]), e1 = pick([2, 3, 4, 5, 6]), e2 = pick([2, 3, 4, 5, 6]);
      if (e1 === e2 || d1 === d2) return null;
      const k = 0.885 * S, c1 = k * e1 / d1, c2 = k * e2 / d2, C = k / (d1 / e1 + d2 / e2);
      const w = [k * (e1 + e2) / 2 / (d1 + d2), c1 + c2, k * (e1 * e2 / (e1 + e2)) / (d1 + d2), Math.min(c1, c2)];
      if (![C, c1, c2, ...w].every(ok2) || C > 2000) return null;
      return mc(ae(C, w, Un("pF")), { svg: svgEl(figLayer(S, d1, e1, d2, e2)), text: `Yastı kondensatorun lövhələri arasında şəkildəki kimi iki dielektrik təbəqə var (təbəqələr lövhələrin bütün sahəsini örtür, ε₁ və ε₂ nisbi dielektrik nüfuzluqlarıdır, kənar effektlər nəzərə alınmır). Kondensatorun tutumu neçə pF-dır? (ε₀ = 8,85·10⁻¹² F/m)`,
        solution: `Hər təbəqə ayrıca kondensator sayılır, onlar ardıcıldır (yük eynidir). C₁ = ε₀ε₁S/d₁ = ${F(c1)} pF, C₂ = ε₀ε₂S/d₂ = ${F(c2)} pF. 1/C = 1/C₁ + 1/C₂ → C = C₁C₂/(C₁ + C₂) = ${F(C)} pF. (Eyni: C = ε₀S/(d₁/ε₁ + d₂/ε₂).) Tələlər: orta ε götürmək (${F(w[0])} pF), təbəqələri paralel saymaq (${F(w[1])} pF), ε-ları ardıcıl birləşdirib qalınlığı toplamaq (${F(w[2])} pF), ən kiçik tutumu cavab yazmaq (${F(w[3])} pF).` });
    }) },
    // 5. potential of two point charges, work to take a test charge to infinity
    { tip: "qapali", birlesik: "fiz-kulon", gen: () => again(() => {
      const a = pick([1, 2, 3, 4, 5, 6, 8, 10, 12]), b = pick([1, 2, 3, 4, 5, 6, 8, 10, 12]), r1 = pick([2, 3, 4, 5, 6, 10, 12, 15, 20]), r2 = pick([2, 3, 4, 5, 6, 10, 12, 15, 20]), q0 = pick([2, 3, 4, 5, 10]);
      const p1 = 900 * a / r1, p2 = 900 * b / r2, p = p1 - p2, A = q0 * p;
      const w = [q0 * (p1 + p2), q0 * p1, p, q0 * 900 * (a - b) / (r1 + r2)]; if (![A, p1, p2, ...w].every(ok2)) return null;
      return mc(ae(A, w, Un("nJ")), { svg: svgEl(figPts(a, b, r1, r2)), text: `Şəkildə qiymətləri +${a} nKl və −${b} nKl olan nöqtəvi yüklər göstərilib (yüklər yerlərində bərkidilib); M nöqtəsi onları birləşdirən düz xətt üzərindədir. Sonsuzluqda potensial sıfırdır, k = 9·10⁹ N·m²/Kl². Müsbət ${q0} nKl sınaq yükünü M nöqtəsindən sonsuzluğa aparanda elektrik sahəsi neçə nJ iş görür?`,
        solution: `Potensial skalyardır, yüklərin potensialları cəbri toplanır. φ = 900q/r (V, q nKl, r sm). φ₁ = 900·${a}/${r1} = ${F(p1)} V, φ₂ = −900·${b}/${r2} = −${F(p2)} V. φ_M = ${F(p1)} − ${F(p2)} = ${F(p)} V. A = q₀(φ_M − 0) = ${q0}·${F(p)} = ${F(A)} nJ. Tələlər: modulları toplamaq (${F(q0 * (p1 + p2))}), yalnız müsbət yükü nəzərə almaq (${F(q0 * p1)}), q₀-a vurmağı unutmaq (${F(p)}), yüklər arasındakı məsafəni götürmək (${F(w[3])}).` });
    }) },
    // 6. the plates of a detached capacitor are pulled apart: work of the external force
    { tip: "qapali", gen: () => again(() => {
      const S = pick([100, 200, 400, 500, 1000]), d = pick([1, 2, 4, 5]), n = pick([3, 4, 5]), U = pick([100, 200, 300, 400, 500, 1000]);
      const C0 = 0.885 * S / d, W0 = C0 * U * U / 2e6, A = (n - 1) * W0;   // pF·V² → mkJ: ·10⁻¹²·10⁶
      const w = [n * W0, 2 * A, A / n, A / 2]; if (![A, W0, ...w].every(ok2)) return null;
      return mc(ae(A, w, Un("mkJ")), { svg: svgEl(figPull(n)), text: `Havalı yastı kondensatorun hər lövhəsinin sahəsi ${S} sm², lövhələr arasındakı məsafə ${d} mm-dir. Kondensator ${U} V-luq mənbəyə qoşulub doldurulur, sonra mənbədən ayrılır. Lövhələr çox yavaş aralanır (kinetik enerji yaranmır; sürtünmə, kənar effektlər və lövhələrin ağırlığı nəzərə alınmır). Məsafəni ${n} dəfə artırmaq üçün xarici qüvvə neçə mkJ iş görməlidir? (ε₀ = 8,85·10⁻¹² F/m, 1 mkJ = 10⁻⁶ J)`,
        solution: `C₀ = ε₀S/d = 8,85·10⁻¹²·${F(S / 1e4)}/${F(d / 1000)} = ${F(C0)} pF. W₀ = C₀U²/2 = ${F(C0)}·10⁻¹²·${U}²/2 = ${F(W0)} mkJ. Mənbədən ayrılıb → yük sabitdir. C ~ 1/d, tutum ${n} dəfə azalır; W = q²/2C ${n} dəfə artır: W = ${n}·${F(W0)} = ${F(n * W0)} mkJ. İş enerjinin artımına bərabərdir: A = W − W₀ = ${n - 1}·${F(W0)} = ${F(A)} mkJ. Tələlər: son enerjini cavab yazmaq (${F(n * W0)}), ½-ni unutmaq (${F(2 * A)}), U-nu sabit saxlamaq — enerji azalır (${F(A / n)}), ½-ni iki dəfə tətbiq etmək (${F(A / 2)}).` });
    }) },
    // 7. two charged capacitors joined (like or unlike plates)
    { tip: "qapali", minVariety: 10, gen: () => again(() => {
      const c1 = pick([2, 3, 4, 5, 6, 10, 12]), c2 = pick([1, 2, 3, 4, 5, 6, 10]), u1 = pick([60, 100, 120, 150, 200, 300]), u2 = pick([20, 40, 50, 60, 100, 120, 150]), opp = Math.random() < .5;
      const qs = c1 * u1 + (opp ? -1 : 1) * c2 * u2, U = Math.abs(qs) / (c1 + c2), alt = Math.abs(c1 * u1 + (opp ? 1 : -1) * c2 * u2) / (c1 + c2);
      const w = [alt, (u1 + u2) / 2, opp ? Math.abs(u1 - u2) : u1 + u2, Math.abs(qs) / c1];
      if (qs === 0 || ![U, ...w].every(ok2)) return null;
      return mc(ae(U, w, Un("V")), { svg: svgEl(figConn(c1, u1, c2, u2, opp)), text: `C₁ = ${c1} mkF kondensator ${u1} V-a, C₂ = ${c2} mkF kondensator ${u2} V-a qədər doldurulub, sonra mənbələrdən ayrılıb. Şəkildəki kimi ${opp ? "birinin müsbət lövhəsi o birinin mənfi lövhəsi ilə" : "eyni işarəli lövhələri"} birləşdirilir. Birləşdirildikdən sonra kondensatorlardakı gərginlik neçə voltdur?`,
        solution: `Qapalı sistemdə yük saxlanır. q₁ = C₁U₁ = ${c1 * u1} mkKl, q₂ = C₂U₂ = ${c2 * u2} mkKl. ${opp ? `Əks işarəli lövhələr birləşib: yüklər bir-birini azaldır, q = ${Math.max(c1 * u1, c2 * u2)} − ${Math.min(c1 * u1, c2 * u2)} = ${F(Math.abs(qs))} mkKl (böyük yükün işarəsi qalır).` : `Eyni işarəli lövhələr: yüklər toplanır, q = ${c1 * u1} + ${c2 * u2} = ${F(qs)} mkKl.`} Kondensatorlar paraleldir: C = ${c1 + c2} mkF, U = q/C = ${F(Math.abs(qs))}/${c1 + c2} = ${F(U)} V. Tələlər: ${opp ? "yükləri toplamaq" : "yükləri çıxmaq"} (${F(alt)} V), gərginliklərin ortalaması (${F((u1 + u2) / 2)} V), ${opp ? "gərginliklərin fərqi" : "gərginliklərin cəmi"} (${F(opp ? Math.abs(u1 - u2) : u1 + u2)} V), yalnız C₁-ə bölmək (${F(w[3])} V).` });
    }) },
    // 8. direct-current circuit with a capacitor in parallel to R₂ — joins "Om qanunu"
    { tip: "qapali", birlesik: "fiz-om", gen: () => again(() => {
      const r1 = pick([10, 20, 30, 40, 60, 80]), r2 = pick([10, 20, 30, 40, 60, 80]), U = pick([20, 30, 40, 60, 80, 100, 120]), C = pick([1, 2, 3, 4, 5, 10, 20]);
      if (r1 === r2) return null;
      const I = U / (r1 + r2), U2 = I * r2, q = C * U2;
      const w = [C * U, C * U * r1 / (r1 + r2), C * U / 2, C * U * r2 / r1]; if (![q, I, U2, ...w].every(ok2)) return null;
      return mc(ae(q, w, Un("mkKl")), { svg: svgEl(figDC()), text: `Sxemdə ideal mənbənin gərginliyi U = ${U} V, R₁ = ${r1} Ω, R₂ = ${r2} Ω, C = ${C} mkF. Kondensator əvvəlcə yüksüz idi, indi sabit rejim qurulub (dövrədə cərəyan dəyişmir). Kondensatorun yükü neçə mkKl-dur?`,
        solution: `Sabit cərəyanda kondensatordan cərəyan keçmir — onun qolu qırıq kimidir, R₁ və R₂ ardıcıl qalır. I = U/(R₁ + R₂) = ${U}/${r1 + r2} = ${F(I)} A. Kondensator R₂-yə paraleldir, ona görə U_C = IR₂ = ${F(I)}·${r2} = ${F(U2)} V. q = CU_C = ${C}·${F(U2)} = ${F(q)} mkKl. Tələlər: kondensatora mənbənin gərginliyini vermək (${F(C * U)}), səhv rezistorun gərginliyini götürmək (${F(w[1])}), gərginliyi yarı bölmək (${F(C * U / 2)}), müqavimətlərin nisbətini götürmək (${F(w[3])}).` });
    }) },
    // 9. charged ball on a thread between the plates — joins "Nyuton qanunları" (equilibrium of three forces)
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const [a, b, c] = pick([[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [5, 12, 13], [12, 5, 13]]), s = pick([1, 2, 0.5]);
      const Wt = a * s, Fe = b * s, T = c * s, m = Wt / 10, C = pick([2, 4, 5, 10, 20, 50]), d = pick([1, 2, 4, 5, 10]), Q = pick([1, 2, 4, 5, 10, 20]), q = Fe * C * d / (100 * Q);
      const w = [Wt + Fe, Fe, Wt, Math.abs(Fe - Wt)]; if (!nice(m, 2) || !nice(q, 2) || q < 0.5 || ![T, ...w].every(ok2)) return null;
      const Uv = 1000 * Q / C, Ev = Uv / (d / 100);
      return mc(ae(T, w, Un("mkN")), { svg: svgEl(figBall(Wt, Fe)), text: `Tutumu ${C} nF olan havalı yastı kondensatorun şaquli lövhələrinə ${Q} mkKl yük verilib, lövhələr arasındakı məsafə ${d} sm-dir. Lövhələr arasında nazik iplə asılmış, kütləsi ${F(m)} mq (1 mq = 10⁻⁶ kq), yükü ${F(q)} nKl olan müsbət yüklü kürəcik tarazlıqdadır. İpin dartılma qüvvəsi neçə mkN-dur? (g = 10 m/s², sahə bircinsdir, kürəcik sahəni dəyişmir, 1 mkN = 10⁻⁶ N)`,
        solution: `Sahə: U = Q/C = ${Q}·10⁻⁶/(${C}·10⁻⁹) = ${F(Uv)} V, E = U/d = ${F(Uv)}/${F(d / 100)} = ${F(Ev)} V/m. Elektrik qüvvəsi (üfüqi): F = qE = ${F(q)}·10⁻⁹·${F(Ev)} = ${F(Fe)}·10⁻⁶ N = ${F(Fe)} mkN. Ağırlıq (şaquli): mg = ${F(m)}·10⁻⁶·10 = ${F(Wt)} mkN. Tarazlıqda ipin dartılması bu iki qüvvənin əvəzləyicisinə bərabərdir (qüvvələr perpendikulyardır): T = √(${F(Wt)}² + ${F(Fe)}²) = ${F(T)} mkN. Tələlər: qüvvələri cəbri toplamaq (${F(Wt + Fe)}), yalnız elektrik qüvvəsini (${F(Fe)}) və ya yalnız ağırlığı (${F(Wt)}) götürmək, fərqi tapmaq (${F(Math.abs(Fe - Wt))}).` });
    }) },
    // 10. capacitors discharge into a heater in water — joins "İstilik miqdarı"
    { tip: "qapali", birlesik: "fiz-istilik", minVariety: 10, gen: () => again(() => {
      const m = pick([10, 20, 25, 50, 100]), dT = pick([1, 2, 2.5, 4, 5]), U = pick([100, 200, 300, 400, 500, 1000]), Ct = 8.4e6 * m * dT / (U * U);
      if (!Number.isInteger(Ct) || Ct < 20 || Ct > 6000) return null;
      const f = pick([1 / 4, 1 / 3, 2 / 5, 3 / 5, 2 / 3, 3 / 4]), c1 = Ct * f, c2 = Ct - c1; if (!Number.isInteger(c1) || c1 === c2) return null;
      const th = C => C * U * U / (8.4e6 * m), cs = c1 * c2 / Ct;
      const w = [th(cs), 2 * dT, th(c1), th(c2)]; if (![dT, ...w].every(ok2)) return null;
      const W = Ct * U * U / 2e6;
      return mc(ae(dT, w, Un("°C")), { svg: svgEl(figHeat()), text: `Tutumları C₁ = ${F(c1)} mkF və C₂ = ${F(c2)} mkF olan iki kondensator paralel birləşdirilib və ${U} V-a qədər doldurulub. K açarı bağlananda kondensatorların bütün enerjisi qabdakı qızdırıcıdan keçib ${m} q suyu qızdırır (ətrafa itki yoxdur, qızdırıcının və qabın istilik tutumu nəzərə alınmır; c = 4200 J/(kq·°C)). Suyun temperaturu neçə °C artar?`,
        solution: `Paralel: C = C₁ + C₂ = ${F(Ct)} mkF. Enerji: W = CU²/2 = ${F(Ct)}·10⁻⁶·${U}²/2 = ${F(W)} J. Bu enerji suyu qızdırır: W = cmΔt → Δt = W/(cm) = ${F(W)}/(4200·${F(m / 1000)}) = ${F(dT)} °C. Tələlər: kondensatorları ardıcıl saymaq (${F(w[0])} °C), ½-ni unutmaq (${F(2 * dT)} °C), yalnız C₁-in (${F(w[2])} °C) və ya yalnız C₂-nin (${F(w[3])} °C) enerjisini götürmək.` });
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
      key: "fiz-kondensator", title: "Potensial, elektrik tutumu, kondensatorlar", fenn: "fizika", link: "dersler/fiz-kondensator.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (V, kV/m, mkF, mkKl, mJ, J və s.). Onluq kəsr vergül və ya nöqtə ilə: 0,5. k = 9·10⁹ N·m²/Kl², ε₀ = 8,85·10⁻¹² F/m.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["potensial", "potensial", "tutum", "deyisme", "birlesme", "birlesme", "enerji", "enerji", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-kondensator.html")) b.push("dersler/fiz-kondensator.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
