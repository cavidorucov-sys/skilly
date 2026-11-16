// Fizika · Qüvvə momenti, tarazlıq — mastery game levels (M = F·d, lever, beam on two supports, centre of mass, ladder) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s².
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const g = 10;
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const INK = "var(--ink)", VEC = "var(--vec)", ACC = "var(--accent)";
  function arrow(svg, x1, y1, x2, y2, color) {
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    svg.append(sv("line", { x1, y1, x2: x2 - ux * 6, y2: y2 - uy * 6, stroke: color, "stroke-width": 2.5 }));
    svg.append(sv("path", { d: `M${x2} ${y2}L${x2 - ux * 9 - uy * 5} ${y2 - uy * 9 + ux * 5}L${x2 - ux * 9 + uy * 5} ${y2 - uy * 9 - ux * 5}z`, fill: color }));
  }
  const label = (svg, x, y, t, anchor) => svg.append(sv("text", { x, y, "text-anchor": anchor || "middle", class: "oy-lbl" }, t));

  // beam on supports A (left end) and B (right end); load at x from A; beam weight drawn when mb > 0
  function beam(L, x, mb, M) {
    const s = sv("svg", { viewBox: "0 0 300 150", class: "oy-svg", role: "img", "aria-label": "İki dayaq üzərində tir və yük" });
    const X0 = 40, X1 = 260, px = X0 + (X1 - X0) * x / L;
    s.append(sv("rect", { x: X0, y: 70, width: X1 - X0, height: 10, fill: "var(--accent-soft)", stroke: INK, "stroke-width": 1.5 }));
    for (const X of [X0, X1]) s.append(sv("path", { d: `M${X} 80L${X - 10} 98L${X + 10} 98z`, fill: "none", stroke: INK, "stroke-width": 1.5 }));
    label(s, X0, 114, "A"); label(s, X1, 114, "B");
    s.append(sv("rect", { x: px - 13, y: 44, width: 26, height: 26, fill: "var(--sheet)", stroke: INK, "stroke-width": 1.5 }));
    label(s, px, 38, F(M) + " kq");
    arrow(s, X0 - 18, 98, X0 - 18, 58, ACC); label(s, X0 - 18, 50, "N_A");
    arrow(s, X1 + 18, 98, X1 + 18, 58, ACC); label(s, X1 + 18, 50, "N_B");
    if (mb > 0) { arrow(s, (X0 + X1) / 2, 80, (X0 + X1) / 2, 112, VEC); label(s, (X0 + X1) / 2 + (Math.abs(px - (X0 + X1) / 2) < 40 ? 30 : 0), 126, "m_tir·g"); }
    s.append(sv("line", { x1: X0, y1: 140, x2: px, y2: 140, stroke: "var(--muted)", "stroke-width": 1 }));
    label(s, (X0 + px) / 2, 136, F(x) + " m");
    return s;
  }
  // lever: pivot in the middle, load on the left at d1, unknown on the right at d2
  function lever(d1, d2, lt, rt) {
    const s = sv("svg", { viewBox: "0 0 300 130", class: "oy-svg", role: "img", "aria-label": "Ling: dayaq nöqtəsi və iki qüvvə" });
    const C = 150, sc = 110 / Math.max(d1, d2), xl = C - d1 * sc, xr = C + d2 * sc;
    s.append(sv("line", { x1: Math.min(xl, C - 10) - 10, y1: 60, x2: Math.max(xr, C + 10) + 10, y2: 60, stroke: INK, "stroke-width": 5 }));
    s.append(sv("path", { d: `M${C} 62L${C - 12} 84L${C + 12} 84z`, fill: "var(--accent-soft)", stroke: INK, "stroke-width": 1.5 }));
    arrow(s, xl, 62, xl, 100, VEC); label(s, xl, 114, lt);
    arrow(s, xr, 62, xr, 100, VEC); label(s, xr, 114, rt);
    label(s, (xl + C) / 2, 48, F(d1) + " m"); label(s, (xr + C) / 2, 48, d2 == null ? "?" : F(d2) + " m");
    return s;
  }
  const LAD6 = [[3, 4, 5], [6, 8, 10], [1.5, 2, 2.5], [1.2, 1.6, 2], [2.4, 3.2, 4], [1.8, 2.4, 3], [2.5, 6, 6.5], [1, 2.4, 2.6], [1.6, 3, 3.4], [0.9, 1.2, 1.5]];
  const LADDER = [[3, 4, 5], [6, 8, 10], [1.5, 2, 2.5], [1.2, 1.6, 2], [2.4, 3.2, 4], [1.8, 2.4, 3]];

  const levels = [
    { id: "moment", ad: "Moment M = F·d", izah: "d — fırlanma oxundan qüvvənin təsir xəttinə qədər perpendikulyar məsafə (qol). Qüvvə dəstəyə bucaq altında olsa, d = l·sin α.",
      gen() {
        const kind = pick(["Fd", "Fd", "F", "bucaq", "cem"]);
        if (kind === "Fd") {
          const Fv = pick([5, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 150, 200]), d = rnd(5, 80);
          return R(Fv * d / 100, "N·m", { text: `Qüvvə ${Fv} N, fırlanma oxundan qüvvənin təsir xəttinə qədər məsafə ${d} sm. Qüvvə momenti nə qədərdir?`,
            solution: `d = ${d} sm = ${F(d / 100)} m. M = F·d = ${Fv}·${F(d / 100)} = ${F(Fv * d / 100)} N·m.` });
        }
        if (kind === "F") {
          let Fv, d; do { Fv = rnd(4, 200); d = pick([10, 15, 20, 25, 30, 40, 50, 60, 75, 80]); } while (!nice(Fv * d / 100, 2));
          return R(Fv, "N", { text: `Qaykanı açmaq üçün ${F(Fv * d / 100)} N·m moment lazımdır. Açarın qolu ${d} sm-dir və qüvvə qola perpendikulyar tətbiq olunur. Hansı qüvvə lazımdır?`,
            solution: `F = M/d = ${F(Fv * d / 100)}/${F(d / 100)} = ${Fv} N.` });
        }
        if (kind === "bucaq") {
          const Fv = pick([20, 30, 40, 50, 60, 80, 100]), l = pick([20, 25, 30, 40, 50]), th = pick([90, 30, 150, 0, 30]);
          const d = th === 90 ? l : th === 0 ? 0 : l / 2, M = Fv * d / 100;
          return R(M, "N·m", { text: `Açarın uzunluğu ${l} sm-dir. Onun ucuna ${Fv} N qüvvə tətbiq edirlər, qüvvə açarın dəstəyi ilə ${th}° bucaq əmələ gətirir. Qüvvə momenti nə qədərdir?`,
            solution: th === 0 ? `Qüvvə dəstək boyunca, oxa doğru yönəlib — təsir xətti oxdan keçir, qol d = 0. M = 0 (qayka fırlanmır).`
              : `Qol: d = l·sin ${th}° = ${F(l / 100)}·${th === 90 ? "1" : "1/2"} = ${F(d / 100)} m. M = ${Fv}·${F(d / 100)} = ${F(M)} N·m.` });
        }
        const F1 = pick([10, 20, 30, 40, 50]), F2 = pick([10, 20, 30, 40, 50]), r1 = pick([10, 20, 30, 40, 50]), r2 = pick([10, 20, 30, 40, 50]);
        const M1 = F1 * r1 / 100, M2 = F2 * r2 / 100;
        if (M1 === M2) return R(0, "N·m", { text: `Oxa bərkidilmiş diskə iki qüvvə toxunan boyunca təsir edir: ${F1} N oxdan ${r1} sm məsafədə diski saat əqrəbi istiqamətində, ${F2} N oxdan ${r2} sm məsafədə əks istiqamətdə fırladır. Yekun moment nə qədərdir?`, tol: 0.001,
          solution: `M₁ = ${F1}·${F(r1 / 100)} = ${F(M1)} N·m, M₂ = ${F2}·${F(r2 / 100)} = ${F(M2)} N·m. Əks istiqamətlidir: ${F(M1)} − ${F(M2)} = 0. Disk tarazlıqdadır.` });
        return R(Math.abs(M1 - M2), "N·m", { text: `Oxa bərkidilmiş diskə iki qüvvə toxunan boyunca təsir edir: ${F1} N oxdan ${r1} sm məsafədə diski saat əqrəbi istiqamətində, ${F2} N oxdan ${r2} sm məsafədə əks istiqamətdə fırladır. Yekun momentin modulu nə qədərdir?`,
          solution: `M₁ = ${F1}·${F(r1 / 100)} = ${F(M1)} N·m, M₂ = ${F2}·${F(r2 / 100)} = ${F(M2)} N·m. Əks istiqamətli momentlər çıxılır: |${F(M1)} − ${F(M2)}| = ${F(Math.abs(M1 - M2))} N·m. Disk ${M1 > M2 ? "saat əqrəbi istiqamətində" : "əks istiqamətdə"} fırlanmağa başlayır.` });
      } },
    { id: "ling", ad: "Ling qaydası", izah: "Tarazlıq: saat əqrəbi istiqamətində momentlərin cəmi = əks istiqamətdəkilərin cəmi. Ling: F₁·d₁ = F₂·d₂.",
      gen() {
        const kind = pick(["F", "d", "m", "uc"]);
        if (kind === "F") {
          let F1, d1, d2, F2; do { F1 = pick([20, 30, 40, 50, 60, 80, 100, 120, 150, 200, 300]); d1 = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2, 1.5]); d2 = pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.6, 0.75, 1, 1.5, 2]); F2 = F1 * d1 / d2; } while (d1 === d2 || !nice(F2, 1));
          return R(F2, "N", { svg: lever(d1, d2, F1 + " N", "F₂ = ?"), text: `Lingin sol qolunda dayaq nöqtəsindən ${F(d1)} m məsafədə ${F1} N qüvvə təsir edir. Sağ qolda dayaqdan ${F(d2)} m məsafədə hansı qüvvə tətbiq olunmalıdır ki, ling tarazlıqda olsun? Lingin çəkisini nəzərə alma.`,
            solution: `F₁d₁ = F₂d₂ → F₂ = ${F1}·${F(d1)}/${F(d2)} = ${F(F2)} N.` });
        }
        if (kind === "d") {
          let F1, d1, F2, d2; do { F1 = pick([20, 30, 40, 50, 60, 80, 100, 120, 150, 200]); d1 = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2]); F2 = pick([10, 20, 25, 40, 50, 60, 75, 100, 150]); d2 = F1 * d1 / F2; } while (F1 === F2 || !nice(d2, 3) || d2 > 3);
          const q = R(d2, "m", { text: `Lingin bir qolunda dayaqdan ${F(d1)} m məsafədə ${F1} N qüvvə təsir edir. Digər qolda ${F2} N qüvvə dayaqdan hansı məsafədə olmalıdır ki, ling tarazlıqda olsun? Lingin çəkisini nəzərə alma.`,
            solution: `F₁d₁ = F₂d₂ → d₂ = ${F1}·${F(d1)}/${F2} = ${F(d2)} m.` });
          q.svg = lever(d1, null, F1 + " N", F2 + " N");
          return q;
        }
        if (kind === "m") {
          let m1, d1, m2, d2; do { m1 = rnd(20, 45); d1 = pick([1, 1.2, 1.5, 1.6, 1.8, 2]); m2 = rnd(15, 45); d2 = m1 * d1 / m2; } while (m1 === m2 || !nice(d2, 2) || d2 > 2.5);
          return R(d2, "m", { text: `Yelləncək-taxtanın (ortasından dayağa qoyulub) bir ucunda dayaqdan ${F(d1)} m məsafədə ${m1} kq-lıq uşaq oturub. ${m2} kq-lıq ikinci uşaq o biri tərəfdə dayaqdan hansı məsafədə oturmalıdır ki, taxta tarazlıqda olsun?`,
            solution: `m₁g·d₁ = m₂g·d₂ (g ixtisar olunur) → d₂ = ${m1}·${F(d1)}/${m2} = ${F(d2)} m.` });
        }
        let a, b, c, da, db, x; do { a = pick([1, 2, 3, 4, 5]); b = pick([1, 2, 3, 4, 5]); c = pick([2, 3, 4, 5, 6, 8, 10]); da = pick([0.1, 0.2, 0.3, 0.4]); db = pick([0.2, 0.3, 0.4, 0.5]); x = (a * da + b * db) / c; } while (da === db || !nice(x, 3) || x > 0.6 || x < 0.05);
        return R(x, "m", { text: `Yüngül çubuq ortasından asılıb. Sol tərəfdə ortadan ${F(da)} m məsafədə ${a} kq, ${F(db)} m məsafədə ${b} kq yük asılıb. Sağ tərəfdə ${c} kq-lıq yük ortadan hansı məsafədə asılmalıdır ki, çubuq üfüqi qalsın?`,
          solution: `Sol tərəfin momentləri toplanır: ${a}g·${F(da)} + ${b}g·${F(db)} = ${c}g·x → x = (${F(a * da)} + ${F(b * db)})/${c} = ${F(x)} m.` });
      } },
    { id: "dayaq", ad: "İki dayaqlı tir", izah: "Momentləri bir dayağa nəzərən yaz — onun reaksiyası tənlikdən düşür. Sonra N_A + N_B = bütün ağırlıqların cəmi.",
      gen() {
        for (;;) {
          const L = pick([2, 4, 5, 8, 10, 3, 6]), mb = pick([0, 0, 10, 20, 40, 50, 100]), M = pick([10, 20, 30, 40, 50, 60, 80, 100, 150, 200]);
          const x = pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6]); if (x >= L) continue;
          const NB = (mb * g * L / 2 + M * g * x) / L, NA = (mb + M) * g - NB;
          if (!nice(NB, 1)) continue;
          const askA = Math.random() < .5;
          const text = `Uzunluğu ${L} m ${mb ? `və kütləsi ${mb} kq olan bircins` : "olan çəkisiz"} tir uclarından A və B dayaqları üzərində durur. A ucundan ${F(x)} m məsafədə tirin üstünə ${M} kq-lıq yük qoyulub. ${askA ? "A" : "B"} dayağının reaksiya qüvvəsi nə qədərdir?`;
          const sol = `A-ya nəzərən momentlər: N_B·${L} = ${mb ? `${mb * g}·${F(L / 2)} + ` : ""}${M * g}·${F(x)} → N_B = ${F(NB)} N.` + (askA ? ` N_A = ${(mb + M) * g} − ${F(NB)} = ${F(NA)} N.` : "");
          return R(askA ? NA : NB, "N", { text, svg: beam(L, x, mb, M), solution: sol });
        }
      } },
    { id: "kutle", ad: "Kütlə mərkəzi", izah: "x_c = (m₁x₁ + m₂x₂ + …)/(m₁ + m₂ + …). Bircins çubuğun kütləsi onun ortasında toplanmış kimi götürülür.",
      gen() {
        const kind = pick(["iki", "cubuq", "uc", "tap"]);
        if (kind === "iki") {
          let m1, m2, L, x; do { m1 = rnd(1, 9); m2 = rnd(1, 9); L = pick([0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]); x = m2 * L / (m1 + m2); } while (m1 === m2 || !nice(x, 3));
          return R(x, "m", { text: `Uzunluğu ${F(L)} m olan çəkisiz çubuğun uclarına ${m1} kq və ${m2} kq kütləli kürəciklər bərkidilib. Sistemin kütlə mərkəzi ${m1} kq-lıq kürəcikdən hansı məsafədədir?`,
            solution: `x-i ${m1} kq-lıqdan ölç: x_c = (${m1}·0 + ${m2}·${F(L)})/(${m1} + ${m2}) = ${F(m2 * L)}/${m1 + m2} = ${F(x)} m. Mərkəz ağır kürəciyə yaxındır.` });
        }
        if (kind === "cubuq") {
          let mr, mb, L, x; do { mr = rnd(1, 6); mb = rnd(1, 6); L = pick([0.6, 0.8, 1, 1.2, 1.5, 2]); x = (mr * L / 2 + mb * L) / (mr + mb); } while (!nice(x, 3));
          return R(x, "m", { text: `Uzunluğu ${F(L)} m, kütləsi ${mr} kq olan bircins çubuğun bir ucuna ${mb} kq-lıq kürə bərkidilib. Sistemin kütlə mərkəzi çubuğun o biri (boş) ucundan hansı məsafədədir?`,
            solution: `Boş ucdan ölç: çubuğun kütləsi ${F(L / 2)} m-də, kürə ${F(L)} m-də. x_c = (${mr}·${F(L / 2)} + ${mb}·${F(L)})/${mr + mb} = ${F(mr * L / 2 + mb * L)}/${mr + mb} = ${F(x)} m.` });
        }
        if (kind === "uc") {
          let m, xs, xc; do { m = [rnd(1, 5), rnd(1, 5), rnd(1, 5)]; xs = [0, pick([0.2, 0.3, 0.4, 0.5]), pick([0.6, 0.8, 1, 1.2])]; xc = (m[0] * xs[0] + m[1] * xs[1] + m[2] * xs[2]) / (m[0] + m[1] + m[2]); } while (!nice(xc, 3));
          return R(xc, "m", { text: `Ox üzərində üç kiçik kürə var: ${m[0]} kq — x = 0, ${m[1]} kq — x = ${F(xs[1])} m, ${m[2]} kq — x = ${F(xs[2])} m. Sistemin kütlə mərkəzinin koordinatı nədir?`,
            solution: `x_c = (${m[0]}·0 + ${m[1]}·${F(xs[1])} + ${m[2]}·${F(xs[2])})/(${m[0]} + ${m[1]} + ${m[2]}) = ${F(m[1] * xs[1] + m[2] * xs[2])}/${m[0] + m[1] + m[2]} = ${F(xc)} m.` });
        }
        let m1, L, d, m2; do { m1 = rnd(1, 10); L = pick([0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]); d = pick([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.2]); m2 = m1 * d / (L - d); } while (d >= L || !nice(m2, 2) || m2 > 30);
        return R(m2, "kq", { text: `Uzunluğu ${F(L)} m olan çəkisiz çubuğun bir ucunda ${m1} kq-lıq yük var. O biri ucuna hansı kütləli yük bərkidilməlidir ki, kütlə mərkəzi birinci yükdən ${F(d)} m məsafədə olsun?`,
          solution: `Kütlə mərkəzi tarazlıq nöqtəsidir: ${m1}·${F(d)} = m₂·${F(L - d)} → m₂ = ${F(m1 * d)}/${F(L - d)} = ${F(m2)} kq.` });
      } },
    { id: "nerdivan", ad: "Divara söykənən nərdivan", izah: "Divar hamar, döşəmə kələ-kötür. Döşəmənin reaksiyası N₁ = mg. Moment (aşağı uca nəzərən): N₂·h = mg·b/2. Sürtünmə F_sür = N₂.",
      gen() {
        const [b, hh, l] = pick(LADDER), m = pick([5, 8, 10, 12, 15, 16, 20, 24, 25, 30, 40]);
        const N2 = m * g * b / (2 * hh), mu = b / (2 * hh);
        const kind = pick(["Fs", "N2", "N1", "mu", "mu"]);
        const intro = `Uzunluğu ${F(l)} m, kütləsi ${m} kq olan bircins nərdivan hamar şaquli divara söykənib, aşağı ucu divardan ${F(b)} m aralıdır. Döşəmə ilə sürtünmə var.`;
        const base = `Hündürlük: h = √(${F(l)}² − ${F(b)}²) = ${F(hh)} m. Ağırlıq nərdivanın ortasındadır: qolu b/2 = ${F(b / 2)} m. Aşağı uca nəzərən: N₂·${F(hh)} = ${m * g}·${F(b / 2)} → N₂ = ${F(N2)} N.`;
        if (kind === "N1") return R(m * g, "N", { text: intro + " Döşəmənin normal reaksiya qüvvəsi nə qədərdir?", solution: `Şaquli qüvvələr: N₁ = mg = ${m * g} N (divar hamardır, şaquli qüvvə vermir).` });
        if (kind === "N2") return R(N2, "N", { text: intro + " Divarın reaksiya qüvvəsi nə qədərdir?", solution: base });
        if (kind === "Fs") return R(N2, "N", { text: intro + " Döşəmədə nərdivana təsir edən sürtünmə qüvvəsi nə qədərdir?", solution: base + ` Üfüqi qüvvələr: F_sür = N₂ = ${F(N2)} N.` });
        return R(mu, "", { text: `Uzunluğu ${F(l)} m olan bircins nərdivan hamar divara söykənib, aşağı ucu divardan ${F(b)} m aralıdır. Döşəmə ilə sürtünmə əmsalı ən azı neçə olmalıdır ki, nərdivan sürüşməsin?`,
          solution: `h = ${F(hh)} m. F_sür = N₂ = mg·b/(2h), N₁ = mg. μ ≥ F_sür/N₁ = b/(2h) = ${F(b)}/${F(2 * hh)} = ${F(mu)}. Kütlə ixtisar olunur.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let L, mb, M, x, NB, NA;
        do { L = pick([2, 4, 5, 8, 10]); mb = pick([10, 20, 40, 50]); M = pick([20, 30, 40, 50, 60, 80, 100]); x = pick([0.5, 1, 1.5, 2, 3]); NB = (mb * g * L / 2 + M * g * x) / L; NA = (mb + M) * g - NB; } while (x >= L || x === L / 2 || !nice(NB, 1));
        const task = `${L} m uzunluğunda, ${mb} kq kütləli bircins tir uclarından iki dayağa (A və B) qoyulub. A ucundan ${F(x)} m məsafədə ${M} kq yük var. N_A = ?`;
        let steps = [
          `B-yə nəzərən momentlər: N_A·${L} = ${mb * g}·${F(L / 2)} + ${M * g}·${F(L - x)}.`,
          `N_A = (${F(mb * g * L / 2)} + ${F(M * g * (L - x))})/${L} = ${F(NA)} N.`,
          `Yoxlama: N_B = ${(mb + M) * g} − ${F(NA)} = ${F(NB)} N.`,
        ];
        const NAw0 = (mb * g * L / 2 + M * g * x) / L;
        if (bad === 0) steps = [`B-yə nəzərən momentlər: N_A·${L} = ${mb * g}·${F(L / 2)} + ${M * g}·${F(x)}.`, `N_A = (${F(mb * g * L / 2)} + ${F(M * g * x)})/${L} = ${F(NAw0)} N.`, `Yoxlama: N_B = ${(mb + M) * g} − ${F(NAw0)} = ${F((mb + M) * g - NAw0)} N.`];
        if (bad === 1) { const w = M * g * (L - x) / L; steps[1] = `N_A = ${F(M * g * (L - x))}/${L} = ${F(w)} N.`; steps[2] = `Yoxlama: N_B = ${(mb + M) * g} − ${F(w)} = ${F((mb + M) * g - w)} N.`; }
        if (bad === 2) steps[2] = `Yoxlama: N_B = ${M * g} − ${F(NA)} = ${F(M * g - NA)} N.`;
        const why = [`1-ci addım: B-yə nəzərən yükün qolu B-yə qədər məsafədir: ${F(L - x)} m, ${F(x)} m yox. Düz cavab: N_A = ${F(NA)} N.`,
          `2-ci addım: tirin öz ağırlığının momenti (${F(mb * g * L / 2)}) unudulub. Düz cavab: N_A = ${F(NA)} N.`,
          `3-cü addım: dayaqlar tirin də ağırlığını saxlayır: N_A + N_B = (${mb} + ${M})·10 = ${(mb + M) * g} N. N_B = ${F(NB)} N.`][bad];
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Təkərli araba, lom, qapı, yelləncək — hər yerdə momentlər tarazlığı.",
      gen() {
        const kind = pick(["araba", "lom", "qapi", "yellencek"]);
        if (kind === "araba") {
          let M, d, L, Fv; do { M = pick([40, 50, 60, 80, 90, 100, 120]); d = pick([0.3, 0.4, 0.5, 0.6]); L = pick([1.2, 1.4, 1.5, 1.6]); Fv = M * g * d / L; } while (!nice(Fv, 1));
          return R(Fv, "N", { text: `Təkərli arabada ${M} kq yük var. Yükün kütlə mərkəzi təkərin oxundan (üfüqi istiqamətdə) ${F(d)} m, əllə tutulan dəstəklər isə oxdan ${F(L)} m aralıdır. Arabanı qaldırıb saxlamaq üçün dəstəklərə hansı şaquli qüvvə lazımdır? Arabanın çəkisini nəzərə alma.`,
            solution: `Təkərin oxuna nəzərən: F·${F(L)} = ${M * g}·${F(d)} → F = ${F(M * g * d)}/${F(L)} = ${F(Fv)} N. Qüvvə yükün ağırlığından az alınır: qol uzundur.` });
        }
        if (kind === "lom") {
          let P, a, b, Fv; do { P = pick([300, 400, 500, 600, 800, 1000, 1200]); a = pick([0.05, 0.1, 0.15, 0.2]); b = pick([0.8, 1, 1.2, 1.5]); Fv = P * a / b; } while (!nice(Fv, 1));
          return R(Fv, "N", { text: `Lomla ağır daşı qaldırırlar. Daş loma ${P} N qüvvə ilə təsir edir, daşdan dayaq nöqtəsinə qədər ${F(a * 100)} sm, dayaqdan əlin tutduğu yerə qədər ${F(b)} m-dir. Hansı qüvvə lazımdır?`,
            solution: `Ling: F·${F(b)} = ${P}·${F(a)} → F = ${F(P * a)}/${F(b)} = ${F(Fv)} N.` });
        }
        if (kind === "qapi") {
          const M = pick([3, 4, 5, 6, 8, 10, 12]), d1 = pick([0.75, 0.8, 0.9, 1]), d2 = pick([0.1, 0.2, 0.25, 0.4, 0.5]);
          const F1 = M / d1, F2 = M / d2;
          if (!nice(F1, 2) || !nice(F2, 2)) return R(M / d2, "N", { text: `Ağır qapını açmaq üçün ${M} N·m moment lazımdır. Qapını rezədən ${F(d2)} m məsafədə, qapıya perpendikulyar itələsən, hansı qüvvə lazımdır?`,
            solution: `F = M/d = ${M}/${F(d2)} = ${F(M / d2)} N.` });
          return R(F2 / F1, "", { text: `Ağır qapını açmaq üçün ${M} N·m moment lazımdır. Qapının dəstəyi rezədən ${F(d1)} m aralıdır. Rezəyə ${F(d2)} m yaxın yerdən itələsən, dəstəkdən itələməyə nisbətən neçə dəfə böyük qüvvə lazımdır?`,
            solution: `Dəstəkdən: F₁ = ${M}/${F(d1)} = ${F(F1)} N. Yaxından: F₂ = ${M}/${F(d2)} = ${F(F2)} N. Nisbət: ${F(F2)}/${F(F1)} = ${F(d1)}/${F(d2)} = ${F(F2 / F1)}.` });
        }
        const m = pick([40, 45, 50]); let M, d1, d2; do { M = pick([60, 69, 70, 75, 80, 90, 92]); d1 = pick([1, 1.2, 1.5, 2]); d2 = M * d1 / m; } while (!nice(d2, 2) || d2 > 3);
        return R(d2, "m", { text: `Elvin (${m} kq) atası (${M} kq) ilə yelləncək-taxtada oturur. Atası dayaqdan ${F(d1)} m məsafədədir. Elvin o biri tərəfdə dayaqdan hansı məsafədə oturmalıdır ki, taxta tarazlıqda olsun?`,
          solution: `${M}·${F(d1)} = ${m}·d → d = ${F(M * d1)}/${m} = ${F(d2)} m. Yüngül olan uzağa oturur.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a picture (hung rod, lever,
  // beam on supports, ladder, spring, box, mobile), several steps; the wrong options are the answers of typical mistakes.
  // Question 6 also uses "Sürtünmə, maili müstəvi" (F_sür ≤ μN), question 7 "Huk qanunu" (F = kx).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + (u ? " " + u : "");
  const f4 = x => F(+x.toFixed(4));
  const K_ = "var(--ink,#17171a)", A_ = "var(--accent,#a32d2d)", V_ = "var(--vec,#0c447c)", M_ = "var(--muted,#6b6b73)", P_ = "var(--paper,#fff)", SO = "var(--accent-soft,#f3e3e3)";
  const r1 = n => +(+n).toFixed(1);
  const Ln = (x1, y1, x2, y2, c = K_, w = 2) => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
  const Tx = (x, y, s, a = "middle", c = K_, sz = 13) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const Ar = (x1, y1, x2, y2, c = A_) => { const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    return Ln(x1, y1, x2 - ux * 7, y2 - uy * 7, c, 2.5) + `<path d="M${r1(x2)} ${r1(y2)}L${r1(x2 - ux * 11 - uy * 5)} ${r1(y2 - uy * 11 + ux * 5)}L${r1(x2 - ux * 11 + uy * 5)} ${r1(y2 - uy * 11 - ux * 5)}z" fill="${c}"/>`; };
  const Bx = (x, y, w, hh, fill = P_) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(hh)}" fill="${fill}" stroke="${K_}" stroke-width="1.5"/>`;
  const hatch = (x1, x2, y, up) => { let o = Ln(x1, y, x2, y); for (let x = x1; x < x2 - 3; x += 8) o += Ln(x, y, x + 6, up ? y - 7 : y + 7, M_, 1.2); return o; };
  const vhatch = (x, y1, y2) => { let o = Ln(x, y1, x, y2, K_, 3); for (let y = y1; y < y2 - 3; y += 8) o += Ln(x, y, x - 7, y + 6, M_, 1.2); return o; };
  const rod = (x0, y, len, n, fills) => { let o = ""; for (let i = 0; i < n; i++) o += Bx(x0 + i * len / n, y, len / n, 8, fills ? fills[i] : SO); return o; };
  const tri = (x, y, hh = 22, w = 11) => `<path d="M${r1(x)} ${y}L${r1(x - w)} ${y + hh}L${r1(x + w)} ${y + hh}z" fill="${SO}" stroke="${K_}" stroke-width="1.5"/>`;
  const dim = (x1, x2, y, s) => Ln(x1, y, x2, y, M_, 1) + Ln(x1, y - 4, x1, y + 4, M_, 1) + Ln(x2, y - 4, x2, y + 4, M_, 1) + Tx((x1 + x2) / 2, y - 5, s, "middle", M_, 12);
  const S = (w, hh, inner, aria) => { const d = document.createElement("div"); d.innerHTML = `<svg viewBox="0 0 ${w} ${hh}" class="oy-svg" role="img" aria-label="${aria}">${inner}</svg>`; return d.firstChild; };

  // rod of N equal parts hung on a thread p parts from the left end; m_x on the left end, M on the right end
  function figHang(N, p, m, M) { const x0 = 40, x1 = 260, y = 70, xp = x0 + p * (x1 - x0) / N;
    const o = hatch(xp - 40, xp + 40, 16, true) + Ln(xp, 16, xp, y) + Ar(xp + 12, 60, xp + 12, 26) + Tx(xp + 20, 42, "T", "start", A_) + rod(x0, y, x1 - x0, N)
      + Ln(x0, y + 8, x0, 100) + Bx(x0 - 13, 100, 26, 20) + Tx(x0, 136, "m_x") + Ln(x1, y + 8, x1, 100) + Bx(x1 - 13, 100, 26, 20) + Tx(x1, 136, M + " kq")
      + Tx((x0 + x1) / 2, y + 26, m + " kq", "middle", M_, 12);
    return S(300, 148, o, "Bərabər bölmələrə ayrılmış çubuq ipdən asılıb; uclarda iki yük"); }
  // weightless lever, force F1 down on the left, a thread at 30° to the lever on the right
  function figLever30(F1, d1, d2) { const sc = 170 / (d1 + d2), xO = 40 + d1 * sc, xl = 40, xr = xO + d2 * sc;
    const o = dim(xl, xO, 34, F(d1) + " m") + dim(xO, xr, 34, F(d2) + " m") + Ln(30, 60, xr + 10, 60, K_, 5) + tri(xO, 63, 26, 12) + hatch(xO - 20, xO + 20, 89, false) + Tx(xO + 9, 54, "O", "start")
      + Ar(xl, 63, xl, 108, V_) + Tx(xl, 124, F1 + " N", "middle", V_) + Ar(xr, 60, xr + 61, 95, A_) + Tx(xr + 64, 112, "T", "start", A_)
      + `<path d="M${r1(xr + 26)} 60A26 26 0 0 1 ${r1(xr + 22.5)} 73" fill="none" stroke="${M_}" stroke-width="1.3"/>` + Tx(xr + 40, 73, "30°", "start", M_, 11);
    return S(300, 135, o, "Çəkisiz ling: solda şaquli qüvvə, sağda lingə 30° bucaq altında ip"); }
  // beam: support A at the left end, support B c from the right end, load M on the right end
  function figOverhang(L, c, m) { const x0 = 40, x1 = 260, xb = x0 + 220 * (L - c) / L;
    const o = Tx(150, 52, m + " kq", "middle", M_, 12) + Bx(x0, 60, 220, 10, SO) + tri(x0, 70) + tri(xb, 70) + hatch(x0 - 16, x0 + 16, 92, false) + hatch(xb - 16, xb + 16, 92, false)
      + Tx(x0, 116, "A") + Tx(xb, 116, "B") + Ln(x1, 70, x1, 104) + Bx(x1 - 13, 104, 26, 20) + Tx(x1, 140, "M") + dim(xb, x1, 160, F(c) + " m") + dim(x0, x1, 184, L + " m");
    return S(300, 192, o, "Tir iki dayaqda: A sol ucda, B sağ ucdan aralıda; sağ ucdan yük asılıb"); }
  // pipe on two shoulders: 1st at the left end, 2nd c from the right end; load M hung x from the left end
  function figCarry(L, c, x, m, M) { const x0 = 40, x1 = 260, xb = x0 + 220 * (L - c) / L, xl = x0 + 220 * x / L;
    const o = Tx(150, 50, m + " kq", "middle", M_, 12) + Bx(x0, 60, 220, 10, SO) + Ar(x0, 112, x0, 72) + Tx(x0, 128, "1") + Ar(xb, 112, xb, 72) + Tx(xb, 128, "2")
      + Ln(xl, 70, xl, 88) + Bx(xl - 13, 88, 26, 20) + (xl - x0 > xb - xl ? Tx(xl - 17, 103, M + " kq", "end") : Tx(xl + 17, 103, M + " kq", "start")) + dim(x0, xl, 150, F(x) + " m") + dim(xb, x1, 150, F(c) + " m");
    return S(300, 160, o, "Boru iki fəhlənin çiynində; borudan yük asılıb"); }
  // rod of N equal parts, the densities written above the parts
  function figCM(ks, a) { const N = ks.length, x0 = 30, len = 230, w = len / N;
    const fill = k => k === 1 ? `fill="${P_}"` : k === 2 ? `fill="${SO}"` : `fill="${A_}" fill-opacity="0.45"`;
    let o = ""; ks.forEach((k, i) => { o += `<rect x="${r1(x0 + i * w)}" y="50" width="${r1(w)}" height="18" ${fill(k)} stroke="${K_}" stroke-width="1.5"/>` + Tx(x0 + (i + .5) * w, 42, k === 1 ? "ρ" : k + "ρ") + Tx(x0 + (i + .5) * w, 86, a + " sm", "middle", M_, 11); });
    o += Ar(x0, 104, 292, 104, K_) + Ln(x0, 98, x0, 110) + Tx(x0, 122, "O") + Tx(286, 122, "x");
    return S(300, 130, o, "Bərabər bölmələrdən ibarət çubuq; bölmələrin sıxlıqları üstündə yazılıb"); }
  // ladder against a smooth wall, a man on it
  // dashed bracket along the ladder from the foot to the man, labelled "s = ?"
  function sLab(x0, y0, x1, y1) { const dx = x1 - x0, dy = y1 - y0, n = Math.hypot(dx, dy) || 1, nx = dy / n * 14, ny = -dx / n * 14;
    return `<path d="M${r1(x0 + nx)} ${r1(y0 + ny)}L${r1(x1 + nx)} ${r1(y1 + ny)}" fill="none" stroke="${M_}" stroke-width="1.2" stroke-dasharray="4 3"/>` + Tx((x0 + x1) / 2 + nx * 1.9, (y0 + y1) / 2 + ny * 1.9 + 4, "s = ?", "middle", M_, 12); }
  function figLadder(b, hh, l, s, M) { const sc = Math.min(150 / b, 135 / hh), xf = 40 + b * sc, yt = 165 - hh * sc, k = s / l, px = xf + k * (40 - xf), py = 165 + k * (yt - 165);
    const o = vhatch(40, 10, 165) + hatch(40, 280, 165, false) + Ln(40, yt, xf, 165, K_, 5) + `<circle cx="${r1(px)}" cy="${r1(py)}" r="7" fill="${A_}"/>` + Tx(px + 12, py + 4, M + " kq", "start", A_) + sLab(xf, 165, px, py)
      + Tx(50, yt - 7, "l = " + F(l) + " m", "start", M_, 12) + dim(40, xf, 190, F(b) + " m");
    return S(300, 198, o, "Nərdivan hamar divara söykənib, üstündə adam dayanıb"); }
  // rod on a support p parts from the left end, its left end tied to the ground by a spring, a load on the right end
  function figSpring(N, p, m, M) { const x0 = 40, x1 = 260, y = 60, xp = x0 + p * (x1 - x0) / N;
    let z = [[x0, 68], [x0, 78]]; for (let i = 0; i < 8; i++) z.push([x0 + (i % 2 ? -8 : 8), 82 + i * 6.5]); z.push([x0, 134], [x0, 140]);
    const o = rod(x0, y, x1 - x0, N) + tri(xp, 68, 72, 13) + hatch(20, 280, 140, false) + `<polyline points="${z.map(q => r1(q[0]) + "," + r1(q[1])).join(" ")}" fill="none" stroke="${K_}" stroke-width="1.6"/>`
      + Tx(x0 + 14, 110, "k", "start") + Bx(x1 - 13, y - 22, 26, 22) + Tx(x1, y - 28, M + " kq") + Tx((x0 + x1) / 2, y - 8, m + " kq", "middle", M_, 12);
    return S(300, 155, o, "Çubuq dayaq üzərində, sol ucu yayla yerə bərkidilib, sağ ucunda yük"); }
  // box on the floor, horizontal force at the top edge
  function figTip(a, H) { const sc = 120 / H, w = a * sc, xL = 110, yG = 150, top = yG - 120, cx = xL + w / 2;
    const o = Bx(xL, top, w, 120, SO) + hatch(40, 280, yG, false) + Ar(xL - 55, top, xL, top) + Tx(xL - 32, top - 6, "F", "middle", A_)
      + `<circle cx="${r1(xL + w)}" cy="${yG}" r="3.5" fill="${K_}"/>` + Tx(xL + w + 6, yG - 6, "O", "start") + Ar(cx, 90, cx, 128, V_) + Tx(xL - 6, 120, "mg", "end", V_)
      + dim(xL, xL + w, top - 12, F(a) + " m") + Ln(xL + w + 32, top, xL + w + 32, yG, M_, 1) + Tx(xL + w + 36, 94, F(H) + " m", "start", M_, 12);
    return S(300, 165, o, "Döşəmədə düzbucaqlı qutu, yuxarı kənarına üfüqi F qüvvəsi"); }
  // rod hinged to the wall, held horizontal by a thread at 30° to the rod, a load hung s from the hinge
  function figHinge(L, s, m, M) { const xe = 220, xs = 40 + 180 * s / L;
    const o = vhatch(40, 6, 176) + Ln(40, 120, xe, 120, K_, 6) + `<circle cx="40" cy="120" r="5" fill="${P_}" stroke="${K_}" stroke-width="2"/>` + Ln(xe, 120, 40, 120 - 180 * Math.tan(Math.PI / 6), M_, 1.6)
      + Ar(xe, 120, xe - 52, 90) + Tx(172, 80, "T", "start", A_) + `<path d="M${xe - 30} 120A30 30 0 0 1 ${r1(xe - 26)} 105" fill="none" stroke="${M_}" stroke-width="1.3"/>` + Tx(xe - 34, 116, "30°", "end", M_, 11)
      + Tx(100, 112, m + " kq", "middle", M_, 12) + Ln(xs, 123, xs, 145) + Bx(xs - 13, 145, 26, 20) + Tx(xs + 17, 160, M + " kq", "start");
    return S(300, 180, o, "Şarnirlə divara bərkidilmiş üfüqi çubuq, ucundan divara ip, çubuqdan yük asılıb"); }
  // mobile: two weightless rods divided into equal parts
  function figMobile(a, b, c, d, m1) { const v = Math.max(32 / Math.min(c, d), 14), lo = 17 + c * v, hi = 283 - d * v; let X = 150, u = 8, xl, xr;
    search: for (let uu = 40; uu >= 8; uu -= 2) for (let dX = 0; dX <= 140; dX += 2) for (const sg of [1, -1]) { const XX = 150 + sg * dX, l1 = XX - a * uu, r1_ = XX + b * uu; if (l1 >= 20 && r1_ <= 280 && r1_ >= lo && r1_ <= hi) { X = XX; u = uu; break search; } }
    xl = X - a * u; xr = X + b * u; const xl2 = xr - c * v, xr2 = xr + d * v;
    let o = hatch(X - 40, X + 40, 14, true) + Ln(X, 14, X, 44) + Ln(xl, 44, xr, 44, K_, 4) + Ln(xl2, 110, xr2, 110, K_, 4);
    for (let i = 0; i <= a + b; i++) o += Ln(xl + i * u, 39, xl + i * u, 49, K_, 1.2);
    for (let i = 0; i <= c + d; i++) o += Ln(xl2 + i * v, 105, xl2 + i * v, 115, K_, 1.2);
    o += Ln(xl, 44, xl, 70) + Bx(xl - 13, 70, 26, 20) + Tx(xl, 106, m1 + " kq") + Ln(xr, 44, xr, 110)
      + Ln(xl2, 110, xl2, 136) + Bx(xl2 - 13, 136, 26, 20) + Tx(xl2, 172, "m₂") + Ln(xr2, 110, xr2, 136) + Bx(xr2 - 13, 136, 26, 20) + Tx(xr2, 172, "m₃");
    return S(300, 180, o, "İki çəkisiz çubuqdan asma; çubuqlar bərabər bölmələrə ayrılıb"); }

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. rod of equal parts hung on a thread (lyceum mock, Sınaq 8 №7): first m_x from the moments, then T
    { tip: "qapali", gen: () => again(() => {
      const N = pick([4, 5, 6, 8]), p = rnd(1, Math.ceil(N / 2) - 1), m = pick([2, 3, 4, 5, 6, 8, 10]), M = rnd(1, 6), arm = N / 2 - p;
      const mx = (m * arm + M * (N - p)) / p; if (!nice(mx, 1)) return null;
      const T = (m + M + mx) * g, mx1 = M * (N - p) / p, mx2 = (m * N / 2 + M * (N - p)) / p;
      const w = [(m + M + mx1) * g, (m + M) * g, (m + M + mx2) * g, mx * g]; if (![T, ...w].every(x => ok2(x, 1))) return null;
      return mc(ae(T, w, U_("N")), { svg: figHang(N, p, m, M), text: `Kütləsi ${m} kq olan bircins çubuq ${N} bərabər bölməyə ayrılıb və sol ucundan ${p} bölmə aralıdakı nöqtədən iplə asılıb (şəkil). Çubuğun sağ ucundan ${M} kq-lıq, sol ucundan m_x kütləli yük asılıb, çubuq üfüqi tarazlıqdadır. Yuxarıdakı ipin gərilmə qüvvəsi T nə qədərdir? (İplər çəkisizdir, g = 10 m/s².)`,
        solution: `Bölmənin uzunluğu a olsun. İpin bərkidildiyi nöqtəyə nəzərən momentlər (T düşür): m_x·g·${p}a = ${m * g}·${F(arm)}a + ${M * g}·${N - p}a — çubuğun ağırlığı ortasındadır, ipdən ${F(arm)} bölmə sağda. m_x = ${f4(mx)} kq. Şaquli qüvvələr: T = (${m} + ${M} + ${f4(mx)})·10 = ${f4(T)} N. Tələlər: çubuğun öz momentini unutmaq (${f4(w[0])} N), T-yə m_x-i qatmamaq (${f4(w[1])} N), çubuğun ağırlığının qolunu ipdən yox, ucdan ölçmək (${f4(w[2])} N), m_x·g-ni cavab yazmaq (${f4(w[3])} N).` });
    }) },
    // 2. lever with a thread at 30°: the arm of T is d·sin 30°
    { tip: "qapali", gen: () => again(() => {
      const F1 = pick([20, 30, 40, 50, 60, 80, 100, 120]), d1 = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1]), d2 = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1]); if (d1 === d2) return null;
      const T = 2 * F1 * d1 / d2, w = [F1 * d1 / d2, F1 * d1 / (2 * d2), 2 * F1 * d2 / d1, 2 * F1]; if (![T, ...w].every(x => ok2(x, 1))) return null;
      return mc(ae(T, w, U_("N")), { svg: figLever30(F1, d1, d2), text: `Çəkisiz ling O dayağı ətrafında fırlana bilir. Sol qolda O-dan ${F(d1)} m məsafədə lingə şaquli aşağı ${F1} N qüvvə təsir edir. Sağ qolda O-dan ${F(d2)} m məsafədəki nöqtəyə bağlanmış ip lingi lingə 30° bucaq altında dartır (şəkil). Ling üfüqi tarazlıqdadır. İpin gərilmə qüvvəsi nə qədərdir?`,
        solution: `Qüvvənin qolu O-dan onun təsir xəttinə qədər perpendikulyar məsafədir; M = F·d. T-nin qolu ${F(d2)}·sin 30° = ${F(d2 / 2)} m. O-ya nəzərən: ${F1}·${F(d1)} = T·${F(d2 / 2)} → T = ${f4(T)} N. Tələlər: sin 30°-ni unutmaq (${f4(w[0])} N), sin 30°-yə bölmək əvəzinə vurmaq (${f4(w[1])} N), qolların yerini dəyişmək (${f4(w[2])} N).` });
    }) },
    // 3. beam on two supports with an overhang: the largest load before it tips (N_A = 0)
    { tip: "qapali", gen: () => again(() => {
      const L = pick([2, 3, 4, 5, 6, 8]), c = pick([0.5, 1, 1.5, 2]), m = pick([10, 20, 30, 40, 50, 60, 80, 100]); if (c >= L / 2 || c / L < 1 / 8) return null;
      const Mm = m * (L / 2 - c) / c, w = [m * (L - c) / c, m * (L / 2) / c, m * c / (L / 2 - c), m]; if (![Mm, ...w].every(x => ok2(x, 1))) return null;
      return mc(ae(Mm, w, U_("kq")), { svg: figOverhang(L, c, m), text: `Uzunluğu ${L} m, kütləsi ${m} kq olan bircins tir iki dayaq üzərindədir: A dayağı tirin sol ucundadır, B dayağı sağ ucdan ${F(c)} m aralıdadır (şəkil). Tirin sağ ucundan ən çox hansı kütləli yük asmaq olar ki, tir aşmasın?`,
        solution: `Aşma həddində tir A-dan qalxır: N_A = 0, tir yalnız B-yə söykənir. B-yə nəzərən momentlər: M·g·${F(c)} = ${m}·g·${F(L / 2 - c)} — tirin ağırlığı ortasındadır, B-dən ${F(L / 2)} − ${F(c)} = ${F(L / 2 - c)} m solda. M = ${m}·${F(L / 2 - c)}/${F(c)} = ${f4(Mm)} kq. Tələlər: tirin ağırlığını uca qoymaq (${f4(w[0])} kq), qolu B-dən yox, tirin ucundan ölçmək (${f4(w[1])} kq), qolların yerini dəyişmək (${f4(w[2])} kq).` });
    }) },
    // 4. a pipe on two shoulders, one of them not at the end; the pipe's own weight counts
    { tip: "qapali", gen: () => again(() => {
      const L = pick([2, 3, 4, 5, 6]), c = pick([0.5, 1]), m = pick([10, 20, 30, 40, 50]), M = pick([20, 30, 40, 50, 60, 80, 100]), x = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), D = L - c;
      if (c >= L / 2 || x > D - 0.5) return null;
      const N1 = (m * g * (D - L / 2) + M * g * (D - x)) / D, N2 = (m + M) * g - N1;
      const w = [M * g * (D - x) / D, m * g / 2 + M * g * (L - x) / L, N2, (m + M) * g / 2]; if (![N1, ...w].every(x => ok2(x, 1))) return null;
      return mc(ae(N1, w, U_("N")), { svg: figCarry(L, c, x, m, M), text: `Uzunluğu ${L} m, kütləsi ${m} kq olan bircins boru iki fəhlənin çiynindədir: 1-ci fəhlə borunun sol ucunu, 2-ci fəhlə isə sağ ucdan ${F(c)} m aralıdakı nöqtəni saxlayır. Borudan, sol ucdan ${F(x)} m məsafədə ${M} kq-lıq yük asılıb (şəkil). Boru sükunətdə, üfüqi tarazlıqdadır. 1-ci fəhlə boruya hansı qüvvə ilə təsir edir? (g = 10 m/s²)`,
        solution: `Fəhlələr arasındakı məsafə ${L} − ${F(c)} = ${F(D)} m. 2-ci fəhləyə nəzərən momentlər (onun qüvvəsi düşür): F₁·${F(D)} = ${m * g}·${F(D - L / 2)} + ${M * g}·${F(D - x)} — borunun ağırlığı ortada (sol ucdan ${F(L / 2)} m), 2-ci fəhlədən ${F(D - L / 2)} m solda. F₁ = ${f4(N1)} N. Yoxlama: F₂ = ${(m + M) * g} − ${f4(N1)} = ${f4(N2)} N. Tələlər: borunun ağırlığını unutmaq (${f4(w[0])} N), 2-ci fəhləni borunun ucunda saymaq (${f4(w[1])} N), F₂-ni tapmaq (${f4(N2)} N), yükü yarı bölmək (${f4(w[3])} N).` });
    }) },
    // 5. centre of mass of a rod made of parts with different densities (lyceum mock, Sınaq 8 №16)
    { tip: "qapali", gen: () => again(() => {
      const N = rnd(3, 6), a = pick([10, 12, 20, 24, 30]), ks = Array.from({ length: N }, () => pick([1, 1, 2, 3]));
      if (ks.every(k => k === ks[0])) return null;
      const sm = ks.reduce((s, k) => s + k, 0), xc = ks.reduce((s, k, i) => s + k * (i + 0.5) * a, 0) / sm, mx = Math.max(...ks);
      const hv = ks.map((k, i) => k === mx ? (i + 0.5) * a : null).filter(x => x !== null), hav = hv.reduce((s, x) => s + x, 0) / hv.length;
      const w = [N * a / 2, xc - a / 2, xc + a / 2, hav]; if (![xc, ...w].every(x => ok2(x, 1))) return null;
      const dens = ks.map(k => k === 1 ? "ρ" : k + "ρ").join(", ");
      return mc(ae(xc, w, U_("sm")), { svg: figCM(ks, a), text: `Çubuq ${N} bərabər bölmədən ibarətdir, hər bölmənin uzunluğu ${a} sm-dir. Bölmələr soldan sağa ${dens} sıxlıqlı maddələrdən hazırlanıb (şəkil); en kəsiyi hər yerdə eynidir, hər bölmə bircinsdir. Çubuğun kütlə mərkəzi sol ucundan (O) hansı məsafədədir?`,
        solution: `En kəsiyi və uzunluq eynidir, deməli bölmələrin kütlələri sıxlıqlarla mütənasibdir: ${ks.join(" : ")}. Hər bölmənin kütləsi onun ortasındadır: ${ks.map((k, i) => F((i + 0.5) * a)).join(", ")} sm. x_c = (${ks.map((k, i) => k + "·" + F((i + 0.5) * a)).join(" + ")})/${sm} = ${f4(xc)} sm. Tələlər: həndəsi mərkəzi götürmək (${F(N * a / 2)} sm), kütləni bölmənin ortasına yox, sol ucuna qoymaq (${f4(w[1])} sm) və ya sağ ucuna (${f4(w[2])} sm), yalnız ağır bölmələrin ortasını götürmək (${f4(hav)} sm).` });
    }) },
    // 6. ladder: how high can a man climb before it slips (joins "Sürtünmə, maili müstəvi": F_sür ≤ μN)
    { tip: "qapali", birlesik: "fiz-surtunme-maili", gen: () => again(() => {
      const [b, hh, l] = pick(LAD6), m = pick([10, 15, 20, 25, 30, 40]), M = pick([40, 50, 60, 70, 75, 80, 90, 100]), mu = pick([0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.6]);
      const N1 = (m + M) * g, N2 = mu * N1, x = (N2 * hh - m * g * b / 2) / (M * g), s = x * l / b;
      if (!(s > 0.2 && s < l)) return null;
      const w = [mu * N1 * hh / (M * g) * l / b, (mu * M * hh - m * b / 2) * l / (M * b), (mu * (m + M) * b - m * hh / 2) * l / (M * hh), x];
      if (![s, ...w].every(v => ok2(v, 2))) return null;
      return mc(ae(s, w, U_("m")), { svg: figLadder(b, hh, l, s, M), text: `Uzunluğu ${F(l)} m, kütləsi ${m} kq olan bircins nərdivan hamar şaquli divara söykənib, aşağı ucu divardan ${F(b)} m aralıdır. Nərdivanla döşəmə arasında sürtünmə əmsalı μ = ${F(mu)}. Kütləsi ${M} kq olan adam nərdivanla yuxarı qalxır (şəkil). Adam aşağı ucdan nərdivan boyunca ən çox hansı məsafəyə qədər qalxa bilər ki, nərdivan sürüşməsin? (Adamı nöqtəvi cisim say; adam çox yavaş qalxır, hər mövqedə sistemi statik tarazlıqda hesab et; g = 10 m/s².)`,
        solution: `h = √(${F(l)}² − ${F(b)}²) = ${F(hh)} m. Şaquli: N₁ = (${m} + ${M})·10 = ${N1} N. Sürüşmə həddində F_sür = μN₁ = ${f4(N2)} N, üfüqi qüvvələrdən divarın reaksiyası N₂ = F_sür = ${f4(N2)} N. Aşağı uca nəzərən (adamın üfüqi qolu x): N₂·${F(hh)} = ${m * g}·${F(b / 2)} + ${M * g}·x → x = ${f4(x)} m. Nərdivan boyunca: s = x·${F(l)}/${F(b)} = ${f4(s)} m. Tələlər: nərdivanın ağırlığının momentini unutmaq (${f4(w[0])} m), N₁-ə nərdivanın ağırlığını qatmamaq (${f4(w[1])} m), h ilə b-ni dəyişmək (${f4(w[2])} m), üfüqi qolu x-i cavab yazmaq (${f4(w[3])} m).` });
    }, 3000) },
    // 7. rod on a support held by a spring (lyceum mock, Sınaq 8 №12; joins "Huk qanunu")
    { tip: "qapali", birlesik: "fiz-huk", gen: () => again(() => {
      const N = pick([4, 5, 6, 8]), p = rnd(1, Math.ceil(N / 2) - 1), m = pick([2, 3, 4, 5, 6, 8]), M = rnd(1, 5), k = pick([100, 200, 250, 400, 500, 800, 1000]), arm = N / 2 - p;
      const Fy = (m * g * arm + M * g * (N - p)) / p, X = 100 * Fy / k;
      const w = [100 * (m + M) * g / k, 100 * (m + M) * g * (N - p) / (p * k), 100 * (m * g * N / 2 + M * g * N) / (p * k), 100 * M * g * (N - p) / (p * k)];
      if (![X, ...w].every(x => ok2(x, 1))) return null;
      return mc(ae(X, w, U_("sm")), { svg: figSpring(N, p, m, M), text: `Kütləsi ${m} kq olan bircins çubuq ${N} bərabər bölməyə ayrılıb və sol ucundan ${p} bölmə aralıda dayaq üzərinə qoyulub. Çubuğun sol ucu sərtliyi ${k} N/m olan şaquli yayla yerə bərkidilib, sağ ucunda ${M} kq-lıq yük var (şəkil). Çubuq üfüqi tarazlıqdadır. Yayın uzanması nə qədərdir? (Yay çəkisizdir, g = 10 m/s².)`,
        solution: `Bölmə a olsun. Dayağa nəzərən momentlər (dayağın reaksiyası düşür): F_yay·${p}a = ${m * g}·${F(arm)}a + ${M * g}·${N - p}a — çubuğun ağırlığı ortasındadır, dayaqdan ${F(arm)} bölmə sağda. F_yay = ${f4(Fy)} N. Huk qanunu: x = F/k = ${f4(Fy)}/${k} = ${f4(Fy / k)} m = ${f4(X)} sm. Tələlər: momentsiz F = (m + M)g yazmaq (${f4(w[0])} sm), çubuğun ağırlığını uca qoymaq (${f4(w[1])} sm), qolları dayaqdan yox, sol ucdan ölçmək (${f4(w[2])} sm), çubuğun ağırlığını unutmaq (${f4(w[3])} sm).` });
    }) },
    // 8. tipping a box over its lower edge with a horizontal force at the top
    { tip: "qapali", gen: () => again(() => {
      const a = pick([0.2, 0.3, 0.4, 0.5, 0.6]), H = pick([0.5, 0.6, 0.8, 1, 1.2, 1.5]), m = pick([10, 20, 30, 40, 50, 60, 80]); if (a >= H) return null;
      const Fm = m * g * a / (2 * H), w = [m * g * a / H, m * g / 2, 2 * m * g * H / a, m * g]; if (![Fm, ...w].every(x => ok2(x, 1))) return null;
      return mc(ae(Fm, w, U_("N")), { svg: figTip(a, H), text: `Kütləsi ${m} kq, eni ${F(a)} m, hündürlüyü ${F(H)} m olan bircins düzbucaqlı qutu üfüqi döşəmədə durur. Qutunun yuxarı kənarına üfüqi F qüvvəsi tətbiq edirlər (şəkil); sürtünmə qutunun sürüşməsinə imkan vermir. Qutunu O kənarı ətrafında aşırmaq üçün ən kiçik F qüvvəsi nə qədərdir? (g = 10 m/s²)`,
        solution: `Aşma başlayanda döşəmənin qüvvələri yalnız O kənarına təsir edir — O-ya nəzərən onların momenti sıfırdır. F-in qolu H = ${F(H)} m, ağırlığın qolu a/2 = ${F(a / 2)} m (kütlə mərkəzi qutunun ortasındadır). F·${F(H)} = ${m * g}·${F(a / 2)} → F = ${f4(Fm)} N. Tələlər: ağırlığın qolunu a götürmək (${f4(w[0])} N), qolların yerini dəyişmək (${f4(w[2])} N), momentsiz F = mg/2 və ya F = mg yazmaq.` });
    }) },
    // 9. hinged rod held by a thread at 30°, a load hung on it
    { tip: "qapali", gen: () => again(() => {
      const L = pick([1, 1.2, 1.5, 2, 2.4, 3]), m = pick([2, 3, 4, 5, 6, 8, 10]), M = rnd(1, 10), [p, q] = pick([[1, 1], [1, 2], [3, 4], [2, 3], [1, 3]]), s = L * p / q;
      if (!nice(s, 2)) return null;
      const T = (m * g * L / 2 + M * g * s) / (L / 2), w = [m * g / 2 + M * g * s / L, 2 * m * g + 2 * M * g * s / L, 2 * M * g * s / L, (m * g / 2 + M * g * s / L) / 2];
      if (![T, ...w].every(x => ok2(x, 1))) return null;
      return mc(ae(T, w, U_("N")), { svg: figHinge(L, s, m, M), text: `Kütləsi ${m} kq, uzunluğu ${F(L)} m olan bircins çubuq bir ucundan şarnirlə şaquli divara bərkidilib və ip vasitəsilə üfüqi vəziyyətdə saxlanılır. İp çubuğun sərbəst ucunu divarla birləşdirir və çubuqla 30° bucaq əmələ gətirir. Şarnirdən ${F(s)} m məsafədə ${M} kq-lıq yük asılıb (şəkil). İpin gərilmə qüvvəsi nə qədərdir? (İp çəkisizdir, g = 10 m/s².)`,
        solution: `Şarnirə nəzərən momentlər yazırıq — şarnirin reaksiyası (istiqaməti məlum deyil) düşür. T-nin qolu: ${F(L)}·sin 30° = ${F(L / 2)} m. T·${F(L / 2)} = ${m * g}·${F(L / 2)} + ${M * g}·${F(s)} → T = ${f4(T)} N. Tələlər: sin 30°-ni unutmaq (${f4(w[0])} N), çubuğun ağırlığını ucuna qoymaq (${f4(w[1])} N), çubuğun ağırlığını unutmaq (${f4(w[2])} N), sin 30°-yə bölmək əvəzinə vurmaq (${f4(w[3])} N).` });
    }) },
    // 10. a mobile of two weightless rods: the lower rod hangs with its whole load
    { tip: "qapali", gen: () => again(() => {
      const a = rnd(1, 4), b = rnd(1, 4), c = rnd(1, 4), d = rnd(1, 4), m1 = rnd(1, 8); if (a === b || c === d) return null;
      const T = m1 * a / b, m3 = T * c / (c + d), w = [T, T * d / (c + d), m1 * b / a * c / (c + d), m1 * c / (c + d)]; if (![m3, ...w].every(x => ok2(x, 2))) return null;
      return mc(ae(m3, w, U_("kq")), { svg: figMobile(a, b, c, d, m1), text: `Şəkildəki asma tarazlıqdadır. Çubuqlar və iplər çəkisizdir, çubuqlar bərabər bölmələrə ayrılıb. Yuxarı çubuq sol ucundan ${a}, sağ ucundan ${b} bölmə aralıdakı nöqtədən, aşağı çubuq isə sol ucundan ${c}, sağ ucundan ${d} bölmə aralıdakı nöqtədən asılıb. Yuxarı çubuğun sol ucundakı yükün kütləsi ${m1} kq-dır. m₃ kütləsi nə qədərdir?`,
        solution: `Aşağı çubuq yuxarı çubuğun sağ ucunu bütün yükü ilə dartır: (m₂ + m₃)·${b} = ${m1}·${a} → m₂ + m₃ = ${f4(T)} kq. Aşağı çubuq: m₂·${c} = m₃·${d}, deməli m₃ = (m₂ + m₃)·${c}/${c + d} = ${f4(m3)} kq. Tələlər: m₂ + m₃-ü cavab yazmaq (${f4(T)} kq), aşağı çubuqda qolları qarışdırmaq (m₂ = ${f4(w[1])} kq), yuxarı çubuqda qolları qarışdırmaq (${f4(w[2])} kq), yuxarı çubuqda qolları nəzərə almamaq (${f4(w[3])} kq).` });
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
      key: "fiz-moment", title: "Qüvvə momenti, tarazlıq", fenn: "fizika", link: "dersler/fiz-moment.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: N, N·m, m, kq). μ vahidsizdir. Onluq kəsr: 0,25. g = 10 m/s².",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["moment", "moment", "ling", "ling", "dayaq", "dayaq", "kutle", "kutle", "nerdivan", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-moment.html")) b.push("dersler/fiz-moment.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
