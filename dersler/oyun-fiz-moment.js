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
        let M, d1, d2; do { M = pick([60, 69, 70, 75, 80, 90, 92]); d1 = pick([1, 1.2, 1.5, 2]); d2 = M * d1 / 46; } while (!nice(d2, 2) || d2 > 3);
        return R(d2, "m", { text: `Fikrət (46 kq) atası (${M} kq) ilə yelləncək-taxtada oturur. Atası dayaqdan ${F(d1)} m məsafədədir. Fikrət o biri tərəfdə dayaqdan hansı məsafədə oturmalıdır ki, taxta tarazlıqda olsun?`,
          solution: `${M}·${F(d1)} = 46·d → d = ${F(M * d1)}/46 = ${F(d2)} m. Yüngül olan uzağa oturur.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-moment", title: "Qüvvə momenti, tarazlıq", fenn: "fizika", link: "dersler/fiz-moment.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: N, N·m, m, kq). μ vahidsizdir. Onluq kəsr: 0,25. g = 10 m/s².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["moment", "moment", "ling", "ling", "dayaq", "dayaq", "kutle", "kutle", "nerdivan", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-moment.html")) b.push("dersler/fiz-moment.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
