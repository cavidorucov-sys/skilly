// Fizika · Kinetik və potensial enerji — mastery game levels (Ek, Ep, work, work–energy theorem with friction) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s².
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");          // 0.04 → "0,04", −2 → "−2"
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;        // v has at most d decimals
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const g = 10;
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const INK = "#17171a", RED = "#a32d2d", SOFT = "#e8eef8";

  // F–s graph: force grows linearly from 0 to F1 on the first s1 metres, then stays constant until s2
  function fsGraph(F1, s1, s2) {
    const W = 260, H = 170, x0 = 46, y0 = 138, sx = (W - x0 - 24) / s2, sy = (y0 - 26) / F1;
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Qüvvənin yoldan asılılıq qrafiki" });
    g.append(sv("polygon", { points: `${x0},${y0} ${x0 + s1 * sx},${y0 - F1 * sy} ${x0 + s2 * sx},${y0 - F1 * sy} ${x0 + s2 * sx},${y0}`, fill: SOFT, stroke: RED, "stroke-width": 2.5, "stroke-linejoin": "round" }));
    g.append(sv("line", { x1: x0, y1: y0, x2: W - 10, y2: y0, stroke: INK, "stroke-width": 1.5 }));
    g.append(sv("line", { x1: x0, y1: y0, x2: x0, y2: 10, stroke: INK, "stroke-width": 1.5 }));
    g.append(sv("line", { x1: x0, y1: y0 - F1 * sy, x2: x0 + s1 * sx, y2: y0 - F1 * sy, stroke: "#888", "stroke-dasharray": "4 3" }));
    g.append(sv("line", { x1: x0 + s1 * sx, y1: y0 - F1 * sy, x2: x0 + s1 * sx, y2: y0, stroke: "#888", "stroke-dasharray": "4 3" }));
    g.append(sv("text", { x: x0 - 6, y: y0 - F1 * sy + 4, "text-anchor": "end", class: "oy-lbl" }, String(F1)));
    g.append(sv("text", { x: x0 + s1 * sx, y: y0 + 16, "text-anchor": "middle", class: "oy-lbl" }, String(s1)));
    g.append(sv("text", { x: x0 + s2 * sx, y: y0 + 16, "text-anchor": "middle", class: "oy-lbl" }, String(s2)));
    g.append(sv("text", { x: x0 - 6, y: 18, "text-anchor": "end", class: "oy-lbl" }, "F, N"));
    g.append(sv("text", { x: W - 12, y: y0 + 16, "text-anchor": "end", class: "oy-lbl" }, "s, m"));
    return g;
  }

  // incline with height hh and base bb
  function incline(hh, bb) {
    const W = 260, H = 150, sc = Math.min(180 / bb, 90 / hh), w = bb * sc, ht = hh * sc, x0 = (W - w) / 2, y0 = 125;
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Maili müstəvi" });
    g.append(sv("polygon", { points: `${x0},${y0 - ht} ${x0},${y0} ${x0 + w},${y0}`, fill: SOFT, stroke: INK, "stroke-width": 2, "stroke-linejoin": "round" }));
    g.append(sv("circle", { cx: x0 + 12, cy: y0 - ht + 12 * ht / w - 8, r: 7, fill: RED }));
    g.append(sv("text", { x: x0 - 8, y: y0 - ht / 2 + 4, "text-anchor": "end", class: "oy-lbl" }, "h = " + F(hh) + " m"));
    g.append(sv("text", { x: x0 + w / 2, y: y0 + 18, "text-anchor": "middle", class: "oy-lbl" }, "b = " + F(bb) + " m"));
    return g;
  }

  const levels = [
    { id: "ek", ad: "Kinetik enerji", izah: "Ek = mv²/2. Sürət kvadrata yüksəlir: sürət 2 dəfə artsa, enerji 4 dəfə artır. km/saat-ı m/s-yə çevirməyi unutma (÷ 3,6).",
      gen() {
        const kind = pick(["E", "E", "v", "m", "dəfə", "d", "kmh"]);
        if (kind === "E") {
          let m, v, E; do { m = pick([0.2, 0.5, 1, 2, 3, 4, 5, 10, 60]); v = rnd(2, 30); E = m * v * v / 2; } while (!nice(E, 2));
          return R(E, "J", { text: `Kütləsi ${F(m)} kq olan cisim ${v} m/s sürətlə hərəkət edir. Cismin kinetik enerjisi nə qədərdir?`,
            solution: `Ek = mv²/2 = ${F(m)}·${v}²/2 = ${F(m)}·${v * v}/2 = ${F(E)} J.` });
        }
        if (kind === "v") {
          let m, v, E; do { m = pick([0.5, 1, 2, 4, 5, 10, 20]); v = rnd(2, 25); E = m * v * v / 2; } while (!nice(E, 2));
          return R(v, "m/s", { text: `Kütləsi ${F(m)} kq olan cismin kinetik enerjisi ${F(E)} J-dur. Cismin sürəti nə qədərdir?`,
            solution: `Ek = mv²/2 → v² = 2Ek/m = 2·${F(E)}/${F(m)} = ${v * v} → v = ${v} m/s.` });
        }
        if (kind === "m") {
          let m, v, E; do { m = pick([0.2, 0.5, 1, 2, 3, 4, 5, 10, 60]); v = rnd(2, 20); E = m * v * v / 2; } while (!nice(E, 2));
          return R(m, "kq", { text: `Sürəti ${v} m/s olan cismin kinetik enerjisi ${F(E)} J-dur. Cismin kütləsi neçə kiloqramdır?`,
            solution: `Ek = mv²/2 → m = 2Ek/v² = 2·${F(E)}/${v * v} = ${F(m)} kq.` });
        }
        if (kind === "dəfə") {
          const a = pick([1, 1, 2, 3, 4, 5]), b = pick([2, 3, 4, 5]);
          const t = a === 1 ? `Cismin sürətini ${b} dəfə artırdılar (kütlə dəyişmir). Kinetik enerji neçə dəfə artdı?`
            : `Cismin kütləsi ${a} dəfə, sürəti ${b} dəfə artdı. Kinetik enerji neçə dəfə artdı?`;
          return R(a * b * b, "dəfə", { text: t, solution: a === 1 ? `Ek = mv²/2: sürət ${b} dəfə → ×${b}² = ${b * b} dəfə.` : `Ek = mv²/2: kütlə ${a} dəfə → ×${a}; sürət ${b} dəfə → ×${b}² = ${b * b}. Cəmi ${a}·${b * b} = ${a * b * b} dəfə.` });
        }
        if (kind === "d") {
          let m, v1, v2, d; do { m = pick([0.5, 1, 2, 4, 10, 50, 1000]); v1 = rnd(1, 15); v2 = rnd(v1 + 1, 25); d = m * (v2 * v2 - v1 * v1) / 2; } while (!nice(d, 2));
          return R(d, "J", { text: `Kütləsi ${F(m)} kq olan cismin sürəti ${v1} m/s idi. Cisim sürətlənib ${v2} m/s sürət aldı. Kinetik enerjisi nə qədər artdı?`,
            solution: `ΔEk = m(v₂² − v₁²)/2 = ${F(m)}·(${v2 * v2} − ${v1 * v1})/2 = ${F(d)} J. Diqqət: (v₂ − v₁)² yox, v₂² − v₁².` });
        }
        let m, kmh, v, E; do { m = pick([800, 1000, 1200, 1500, 2000]); kmh = pick([18, 36, 54, 72, 90, 108]); v = kmh / 3.6; E = m * v * v / 2000; } while (!nice(E, 2));
        return R(E, "kJ", { text: `Kütləsi ${m} kq olan avtomobilin sürəti saatda ${kmh} kilometrdir. Kinetik enerjisi neçə kilojoul (kJ) olar?`,
          solution: `v = ${kmh}/3,6 = ${v} m/s. Ek = mv²/2 = ${m}·${v * v}/2 = ${F(E * 1000)} J = ${F(E)} kJ.` });
      } },
    { id: "ep", ad: "Potensial enerji", izah: "Ep = mgh sıfır səviyyəsindən ölçülür (mənfi də ola bilər). Bircins cismin Ep-si kütlə mərkəzinin hündürlüyü ilə hesablanır. Yay: kx²/2.",
      gen() {
        const kind = pick(["mgh", "mgh", "h", "sifir", "sifir", "delta", "cubuq", "kerpic", "yay"]);
        if (kind === "mgh") {
          let m, hh, E; do { m = pick([0.5, 1, 2, 3, 5, 10, 40, 60]); hh = pick([0.5, 1, 1.5, 2, 3, 5, 8, 10, 20]); E = m * g * hh; } while (!nice(E, 2));
          return R(E, "J", { text: `Kütləsi ${F(m)} kq olan cisim sıfır səviyyəsindən ${F(hh)} m hündürlükdədir. Potensial enerjisi nə qədərdir?`, solution: `Ep = mgh = ${F(m)}·10·${F(hh)} = ${F(E)} J.` });
        }
        if (kind === "h") {
          let m, hh, E; do { m = pick([0.5, 1, 2, 4, 5, 10, 20]); hh = pick([0.5, 1, 1.5, 2, 2.5, 4, 5, 12]); E = m * g * hh; } while (!nice(E, 2));
          return R(hh, "m", { text: `Kütləsi ${F(m)} kq olan cismin potensial enerjisi ${F(E)} J-dur. Cisim sıfır səviyyəsindən neçə metr hündürlükdədir?`, solution: `Ep = mgh → h = Ep/(mg) = ${F(E)}/(${F(m)}·10) = ${F(hh)} m.` });
        }
        if (kind === "sifir") {
          const m = pick([0.5, 1, 2, 3, 5]), hh = pick([1, 2, 3, 4, 5]), d = pick([1, 2, 3, 5, 10]);
          if (Math.random() < .5) return R(-m * g * d, "J", { text: `Kütləsi ${F(m)} kq olan daş yerin səthindən ${d} m dərinlikdəki quyunun dibindədir. Yer səthini sıfır səviyyəsi qəbul etsək, daşın potensial enerjisi nə qədərdir? (İşarəsini də yaz.)`,
            solution: `Daş sıfır səviyyəsindən aşağıdadır: h = −${d} m. Ep = mgh = ${F(m)}·10·(−${d}) = ${F(-m * g * d)} J.` });
          return R(m * g * (hh + d), "J", { text: `Kütləsi ${F(m)} kq olan daş yerin səthindən ${hh} m yuxarıda tutulub. Yerin səthində ${d} m dərinliyində quyu var. Daşın quyunun dibinə nəzərən potensial enerjisi nə qədərdir?`,
            solution: `Quyunun dibindən daşa qədər hündürlük ${hh} + ${d} = ${hh + d} m. Ep = mgh = ${F(m)}·10·${hh + d} = ${F(m * g * (hh + d))} J.` });
        }
        if (kind === "delta") {
          let m, h1, h2; do { m = pick([0.5, 1, 2, 3, 5]); h1 = pick([0.5, 1, 2, 3, 4, 6]); h2 = pick([0.5, 1, 2, 3, 4, 6, 8]); } while (h1 === h2);
          const d = m * g * (h2 - h1);
          return R(d, "J", { text: `Kütləsi ${F(m)} kq olan top yerdən ${F(h1)} m hündürlükdən ${F(h2)} m hündürlüyə keçdi. Potensial enerjisi nə qədər dəyişdi? (Artıbsa müsbət, azalıbsa mənfi yaz.)`,
            solution: `ΔEp = mg(h₂ − h₁) = ${F(m)}·10·(${F(h2)} − ${F(h1)}) = ${F(d)} J.` });
        }
        if (kind === "cubuq") {
          const L = pick([1, 1.2, 1.5, 2, 3, 4]), m = pick([1, 2, 3, 4, 5, 6]), A = m * g * L / 2;
          return R(A, "J", { text: `Uzunluğu ${F(L)} m, kütləsi ${m} kq olan bircins çubuq yerdə üfüqi uzanır. Onu bir ucundan qaldırıb şaquli vəziyyətə gətirirlər. Görülən minimal iş nə qədərdir?`,
            solution: `Çubuq bircinsdir, kütlə mərkəzi ortadadır. Üfüqi halda mərkəz yerdədir (h ≈ 0), şaquli halda L/2 = ${F(L / 2)} m hündürlükdə. A = ΔEp = mg·L/2 = ${m}·10·${F(L / 2)} = ${F(A)} J.` });
        }
        if (kind === "kerpic") {
          let n, d, m, A; do { n = pick([3, 4, 5, 6]); d = pick([5, 10, 20]); m = pick([1, 2, 3, 4]); A = m * g * (d / 100) * n * (n - 1) / 2; } while (!nice(A, 2));
          return R(A, "J", { text: `Yerdə üfüqi uzanmış ${n} eyni kərpicin hər birinin kütləsi ${m} kq, qalınlığı ${d} sm-dir. Kərpiclərin hamısını bir-birinin üstünə qoyub qalaq düzəldirlər (altdakı kərpic yerində qalır). Görülən minimal iş nə qədərdir?`,
            solution: `Kərpiclər ardıcıl olaraq 0, d, 2d və s. (axırıncısı ${n - 1}d) qədər qaldırılır. Cəmi ${n * (n - 1) / 2}d = ${F(n * (n - 1) / 2 * d / 100)} m. A = mg·(bu cəm) = ${m}·10·${F(n * (n - 1) / 2 * d / 100)} = ${F(A)} J.` });
        }
        let k, xs, E; do { k = pick([20, 40, 50, 100, 200, 400, 500, 1000]); xs = rnd(1, 20); E = k * (xs / 100) ** 2 / 2; } while (!nice(E, 3));
        return R(E, "J", { text: `Sərtliyi ${k} N/m olan yay ${xs} sm sıxılıb. Yayın potensial enerjisi nə qədərdir?`, solution: `x = ${F(xs / 100)} m. Ep = kx²/2 = ${k}·${F((xs / 100) ** 2)}/2 = ${F(E)} J.` });
      } },
    { id: "is", ad: "İş və güc", izah: "A = F·s·cos α. Qüvvə yerdəyişmənin əksinədirsə, iş mənfidir; perpendikulyardırsa, sıfırdır. Güc: P = A/t = F·v. F–s qrafikində iş sahədir.",
      gen() {
        const kind = pick(["F", "bucaq", "bucaq", "agirliq", "guc", "guc2", "qrafik", "qrafik"]);
        if (kind === "F") {
          const f = pick([2, 5, 8, 10, 12, 20, 25, 50]), s = pick([2, 3, 4, 5, 10, 15]);
          return R(f * s, "J", { text: `Hamar üfüqi səthdə cismə yerdəyişmə istiqamətində ${f} N sabit qüvvə təsir edir. Cisim ${s} m yol gedir. Qüvvənin işi nə qədərdir?`, solution: `A = F·s = ${f}·${s} = ${f * s} J.` });
        }
        if (kind === "bucaq") {
          const al = pick([0, 60, 90, 120, 180]), c = { 0: 1, 60: .5, 90: 0, 120: -.5, 180: -1 }[al];
          const f = pick([4, 10, 20, 30, 50]), s = pick([2, 3, 4, 5, 10]), A = f * s * c;
          return R(A, "J", { text: `Cisim düz xətt boyunca ${s} m yerini dəyişir. Ona təsir edən ${f} N qüvvə ilə yerdəyişmə arasındakı bucaq ${al} dərəcədir. Qüvvənin gördüyü iş nə qədərdir? (İşarəsini də yaz.)`,
            solution: `A = F·s·cos α = ${f}·${s}·cos ${al}° = ${f * s}·${c < 0 ? "(" + F(c) + ")" : F(c)} = ${F(A)} J.${al === 90 ? " Qüvvə yola perpendikulyardır, iş görmür." : ""}${al >= 120 ? " Bucaq 90°-dən böyükdür — iş mənfidir." : ""}` });
        }
        if (kind === "agirliq") {
          const m = pick([2, 5, 10, 50, 100, 200]), hh = pick([2, 3, 5, 10, 15]), up = Math.random() < .5, A = (up ? -1 : 1) * m * g * hh;
          return R(A, "J", { text: `Kütləsi ${m} kq olan yükü ${hh} m ${up ? "yuxarı qaldırırlar" : "aşağı endirirlər"}. Bu zaman ağırlıq qüvvəsinin işi nə qədərdir? (İşarəsini də yaz.)`,
            solution: `Ağırlıq qüvvəsi aşağı yönəlib. Yük ${up ? "yuxarı" : "aşağı"} getdiyindən iş ${up ? "mənfidir" : "müsbətdir"}: A = ${up ? "−" : ""}mgh = ${up ? "−" : ""}${m}·10·${hh} = ${F(A)} J.` });
        }
        if (kind === "guc") {
          let m, hh, t, P; do { m = pick([100, 200, 300, 500, 1000]); hh = pick([5, 6, 10, 12, 15, 20]); t = pick([5, 10, 15, 20, 25, 30, 40, 60]); P = m * g * hh / t; } while (!nice(P, 2));
          return R(P, "W", { text: `Kran kütləsi ${m} kq olan yükü ${hh} m hündürlüyə bərabər sürətlə ${t} saniyəyə qaldırır. Kranın faydalı gücü nə qədərdir?`,
            solution: `Bərabər sürətdə çəkmə qüvvəsi mg = ${m * g} N. A = mgh = ${m * g}·${hh} = ${m * g * hh} J. P = A/t = ${m * g * hh}/${t} = ${F(P)} W.` });
        }
        if (kind === "guc2") {
          const f = pick([300, 500, 600, 800, 1000, 1200, 1500]), v = pick([10, 15, 20, 25, 30]);
          if (Math.random() < .5) return R(f * v, "W", { text: `Avtomobil ${v} m/s sabit sürətlə gedir, ona təsir edən müqavimət qüvvələrinin cəmi ${f} N-dur. Mühərrikin gücü nə qədərdir?`,
            solution: `Sabit sürətdə çəkmə qüvvəsi müqavimətə bərabərdir: F = ${f} N. P = F·v = ${f}·${v} = ${f * v} W.` });
          return R(f, "N", { text: `Mühərrikin gücü ${f * v} vatt olan avtomobil ${v} m/s sürətlə gedir. Mühərrikin çəkmə qüvvəsi nə qədərdir?`,
            solution: `P = F·v → F = P/v = ${f * v}/${v} = ${f} N.` });
        }
        // area under the F–s graph
        let F1, s1, s2; do { F1 = pick([4, 6, 8, 10, 12, 20]); s1 = pick([2, 4, 6]); s2 = s1 + rnd(1, 5); } while (s2 > 12);
        const A = F1 * s1 / 2 + F1 * (s2 - s1);
        return R(A, "J", { text: `Cismə təsir edən qüvvənin yoldan asılılıq qrafiki şəkildədir. Qrafikə görə qüvvənin bütün ${s2} metr yolda gördüyü iş nə qədərdir?`, svg: fsGraph(F1, s1, s2),
          solution: `İş qrafikin altındakı sahədir. Üçbucaq: ${F1}·${s1}/2 = ${F(F1 * s1 / 2)} J. Düzbucaqlı: ${F1}·${s2 - s1} = ${F1 * (s2 - s1)} J. Cəmi ${F(A)} J.` });
      } },
    { id: "teorem", ad: "İş–enerji teoremi", izah: "Bütün qüvvələrin işi kinetik enerjinin dəyişməsinə bərabərdir: A = Ek₂ − Ek₁. Tormozlanmada sürtünmənin işi mənfidir.",
      gen() {
        const kind = pick(["v", "tormoz", "tormoz", "oran", "F", "gulle"]);
        if (kind === "v") {
          let m, v, s, f; do { m = pick([1, 2, 4, 5, 10]); v = rnd(2, 12); s = pick([2, 4, 5, 10, 20]); f = m * v * v / (2 * s); } while (!nice(f, 1) || f < 1);
          return R(v, "m/s", { text: `Hamar üfüqi səthdə dayanan, kütləsi ${m} kq olan cismə ${F(f)} N üfüqi qüvvə təsir edir. Cisim ${s} m yol getdikdə sürəti nə qədər olar?`,
            solution: `Sürtünmə yoxdur: A = Ek. F·s = mv²/2 → ${F(f)}·${s} = ${F(f * s)} J. v² = 2·${F(f * s)}/${m} = ${v * v} → v = ${v} m/s.` });
        }
        if (kind === "tormoz") {
          let mu, v, s, kmhV, kmh = Math.random() < .5;
          do { mu = pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.8]); kmhV = pick([36, 54, 72, 90, 108]); v = kmh ? kmhV / 3.6 : pick([10, 12, 15, 20, 25, 30]); s = v * v / (2 * mu * g); } while (!nice(s, 3));
          return R(s, "m", { text: `Avtomobil ${kmh ? "saatda " + kmhV + " kilometr" : v + " m/s"} sürətlə gedərkən təkərləri bloklanır və yolda sürüşərək dayanır. Təkərlərin yolla sürtünmə əmsalı ${F(mu)} qədərdir. Tormoz yolu neçə metrdir?`,
            solution: `${kmh ? `v = ${kmhV}/3,6 = ${v} m/s. ` : ""}Sürtünmənin işi −μmg·s, son sürət 0: −μmgs = 0 − mv²/2 → s = v²/(2μg) = ${v * v}/(2·${F(mu)}·10) = ${F(s)} m. (Kütlə ixtisar olur.)` });
        }
        if (kind === "oran") {
          let v1, k, s1, v2; do { v1 = pick([10, 20, 30, 40, 50]); k = pick([2, 3, 1.5]); s1 = pick([2, 3, 4, 5, 6, 8]); v2 = v1 * k; } while (!nice(v2, 0) || !nice(s1 * k * k, 2));
          return R(s1 * k * k, "m", { text: `Avtomobilin sürəti saatda ${v1} kilometr olanda tormoz yolu ${s1} metrdir. Yolun vəziyyəti dəyişmir. Sürət saatda ${v2} kilometr olarsa, tormoz yolu neçə metr olar?`,
            solution: `s = v²/(2μg), yəni s sürətin kvadratı ilə mütənasibdir. Sürət ${F(k)} dəfə artıb → s ${F(k * k)} dəfə artır: ${s1}·${F(k * k)} = ${F(s1 * k * k)} m.` });
        }
        if (kind === "F") {
          let m, v1, v2, s, f; do { m = pick([500, 800, 1000, 1200, 2000]); v1 = pick([10, 15, 20, 25, 30]); v2 = pick([0, 5, 10]); s = pick([20, 25, 40, 50, 100]); f = m * (v1 * v1 - v2 * v2) / (2 * s); } while (v2 >= v1 || !nice(f, 0));
          return R(f, "N", { text: `Kütləsi ${m} kq olan avtomobil ${v1} m/s sürətlə gedirdi. Tormozlayıb ${s} m yol getdikdən sonra sürəti ${v2} m/s oldu. Orta tormozlayıcı qüvvənin modulu nə qədərdir?`,
            solution: `A = Ek₂ − Ek₁ → −F·s = m(v₂² − v₁²)/2 → F = m(v₁² − v₂²)/(2s) = ${m}·(${v1 * v1} − ${v2 * v2})/(2·${s}) = ${F(f)} N.` });
        }
        let mq, v1, v2, d, f; do { mq = pick([8, 9, 10, 20]); v1 = pick([300, 400, 500, 600, 800]); v2 = pick([100, 200, 300, 400]); d = pick([2, 4, 5, 10, 20]); f = mq / 1000 * (v1 * v1 - v2 * v2) / (2 * d / 100); } while (v2 >= v1 || !nice(f, 1));
        return R(f, "N", { text: `Kütləsi ${mq} qram olan güllə ${v1} m/s sürətlə taxta lövhəyə düşür, onu keçib ${v2} m/s sürətlə çıxır. Lövhənin qalınlığı ${d} santimetrdir. Lövhənin orta müqavimət qüvvəsi nə qədərdir?`,
          solution: `m = ${F(mq / 1000)} kq, d = ${F(d / 100)} m. F·d = m(v₁² − v₂²)/2 → F = ${F(mq / 1000)}·(${v1 * v1} − ${v2 * v2})/(2·${F(d / 100)}) = ${F(f)} N.` });
      } },
    { id: "surtunme", ad: "Sürtünmə ilə enerji", izah: "Maili müstəvidə sürtünmənin işi μmg·b-dir (b — əsasın uzunluğu, yəni üfüqi proyeksiya). Ümumi iş = ΔEk: ağırlığın işi + sürtünmənin işi.",
      gen() {
        const kind = pick(["enme", "enme", "kobud", "yay", "qaldirma"]);
        if (kind === "enme") {
          let hh, b, mu, v, m; do { hh = pick([1, 1.5, 2, 3, 4, 5]); b = pick([2, 3, 4, 5, 6, 8]); mu = pick([0.1, 0.2, 0.25, 0.3, 0.5]); const v2 = 2 * g * (hh - mu * b); v = v2 > 0 ? Math.sqrt(v2) : 0; m = pick([1, 2, 3, 5]); } while (v <= 0 || !nice(v, 2));
          return R(v, "m/s", { text: `Şəkildə maili müstəvi göstərilib. Kütləsi ${m} kq olan cisim onun başından sürüşməyə başlayır, sürtünmə əmsalı ${F(mu)} qədərdir. Müstəvinin dibində cismin sürəti nə qədər olar?`, svg: incline(hh, b),
            solution: `Ağırlığın işi mgh. Maili müstəvidə sürtünmənin işi −μmg·cos α·L = −μmg·b (L·cos α = b). mgh − μmgb = mv²/2 → v² = 2g(h − μb) = 20·(${F(hh)} − ${F(mu * b)}) = ${F(v * v)} → v = ${F(v)} m/s. (Kütlə ixtisar olur.)` });
        }
        if (kind === "kobud") {
          let hh, mu, s; do { hh = pick([0.5, 0.8, 1, 1.5, 2, 3, 5]); mu = pick([0.1, 0.2, 0.25, 0.4, 0.5]); s = hh / mu; } while (!nice(s, 2));
          return R(s, "m", { text: `Cisim hamar (sürtünməsiz) sürüşkənin ${F(hh)} m hündürlüyündən sürüşməyə başlayır, sürüşkənin dibindən sonra sürtünmə əmsalı ${F(mu)} olan üfüqi yolla gedib dayanır. Dayanana qədər üfüqi yolda neçə metr gedir?`,
            solution: `Başlanğıcda və sonda cisim hərəkətsizdir, deməli ümumi iş sıfırdır: mgh − μmg·s = 0 → s = h/μ = ${F(hh)}/${F(mu)} = ${F(s)} m.` });
        }
        if (kind === "yay") {
          let k, x, m, mu, s; do { k = pick([100, 200, 400, 500, 800, 1000]); x = pick([0.05, 0.1, 0.2]); m = pick([0.5, 1, 2, 4]); mu = pick([0.1, 0.2, 0.25, 0.4, 0.5]); s = k * x * x / (2 * mu * m * g); } while (!nice(s, 3) || s < 0.1);
          return R(s, "m", { text: `Sərtliyi ${k} N/m olan yayı ${F(x * 100)} sm sıxıb ona kütləsi ${F(m)} kq olan tin söykəyirlər və buraxırlar. Tin yaydan ayrılıb sürtünmə əmsalı ${F(mu)} olan üfüqi səthlə gedib dayanır. Yaydan ayrılandan sonra neçə metr gedir? (Yayın yerləşdiyi hissədə sürtünməni nəzərə alma.)`,
            solution: `Yayın enerjisi sürtünmənin işinə gedir: kx²/2 = μmg·s → s = kx²/(2μmg) = ${k}·${F(x * x)}/(2·${F(mu)}·${F(m)}·10) = ${F(s)} m.` });
        }
        let m, hh, b, mu, A; do { m = pick([2, 5, 10, 20]); hh = pick([1, 1.5, 2, 3]); b = pick([2, 3, 4, 5]); mu = pick([0.1, 0.2, 0.25, 0.5]); A = m * g * hh + mu * m * g * b; } while (!nice(A, 2));
        return R(A, "J", { text: `Kütləsi ${m} kq olan yükü hündürlüyü ${F(hh)} m, əsasının uzunluğu ${b} m olan maili müstəvi ilə bərabər sürətlə yuxarı çəkirlər. Sürtünmə əmsalı ${F(mu)} qədərdir. Çəkən qüvvənin işi nə qədərdir?`,
          solution: `Bərabər sürət: Ek dəyişmir, deməli A_çəkən − mgh − μmg·b = 0. A = mgh + μmgb = ${m}·10·${F(hh)} + ${F(mu)}·${m}·10·${b} = ${F(m * g * hh)} + ${F(mu * m * g * b)} = ${F(A)} J.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let mu, kmh, v, s; do { mu = pick([0.4, 0.5, 0.8, 0.25]); kmh = pick([36, 54, 72, 90, 108]); v = kmh / 3.6; s = v * v / (2 * mu * g); } while (!nice(s, 3));
          task = `Sürəti saatda ${kmh} kilometr olan avtomobil təkərləri bloklanıb sürüşərək dayanır. Sürtünmə əmsalı ${F(mu)} qədərdir. Tormoz yolu neçə metrdir?`;
          const vw = kmh / 3;
          steps = [`Sürəti çevirək: ${kmh} km/saat = ${kmh}/3,6 = ${v} m/s.`, `İş–enerji teoremi: −μmg·s = 0 − mv²/2, buradan s = v²/(2μg).`, `s = ${v * v}/(2·${F(mu)}·10) = ${F(s)} m.`];
          if (bad === 0) { const sw = vw * vw / (2 * mu * g); steps = [`Sürəti çevirək: ${kmh} km/saat = ${kmh}/3 = ${F(+vw.toFixed(3))} m/s.`, steps[1], `s = ${F(+(vw * vw).toFixed(3))}/(2·${F(mu)}·10) = ${F(+sw.toFixed(3))} m.`]; }
          if (bad === 1) steps[1] = `İş–enerji teoremi: −μmg·s = 0 − mv², buradan s = v²/(μg).`, steps[2] = `s = ${v * v}/(${F(mu)}·10) = ${F(2 * s)} m.`;
          if (bad === 2) steps[2] = `s = ${v * v}/(2·${F(mu)}) = ${F(+(v * v / (2 * mu)).toFixed(3))} m.`;
          why = [`1-ci addım: 1 km/saat = 1/3,6 m/s, ona görə ${kmh}/3,6 = ${v} m/s (3-ə bölmək olmaz). Düz cavab ${F(s)} m.`,
            `2-ci addım: Ek = mv²/2 — 1/2 əmsalı itirilib. Düzü: s = v²/(2μg), cavab ${F(s)} m.`,
            `3-cü addım: g = 10 m/s² məxrəcdə qalmalıdır (2μg = 2·${F(mu)}·10). Düz cavab ${F(s)} m.`][bad];
        } else {
          let m, hh, t, P; do { m = pick([100, 200, 300, 500]); hh = pick([5, 6, 10, 12, 15, 20]); t = pick([5, 10, 15, 20, 25, 30, 40]); P = m * g * hh / t; } while (!nice(P, 2));
          task = `Kran kütləsi ${m} kq olan yükü ${hh} m hündürlüyə bərabər sürətlə ${t} saniyəyə qaldırır. Kranın faydalı gücü neçə vattdır?`;
          steps = [`Bərabər sürət: çəkmə qüvvəsi ağırlığa bərabərdir, F = mg = ${m}·10 = ${m * g} N.`, `İş: A = F·h = ${m * g}·${hh} = ${m * g * hh} J.`, `Güc: P = A/t = ${m * g * hh}/${t} = ${F(P)} W.`];
          if (bad === 0) steps = [`Bərabər sürət: çəkmə qüvvəsi kütləyə bərabərdir, F = m = ${m} N.`, `İş: A = F·h = ${m}·${hh} = ${m * hh} J.`, `Güc: P = A/t = ${m * hh}/${t} = ${F(+(m * hh / t).toFixed(4))} W.`];
          if (bad === 1) { steps[1] = `İş: A = F·t = ${m * g}·${t} = ${m * g * t} J.`; steps[2] = `Güc: P = A/t = ${m * g * t}/${t} = ${m * g} W.`; }
          if (bad === 2) steps[2] = `Güc: P = A·t = ${m * g * hh}·${t} = ${m * g * hh * t} W.`;
          why = [`1-ci addım: ağırlıq mg = ${m * g} N (g = 10 unudulub). Düz cavab ${F(P)} W.`,
            `2-ci addım: iş qüvvəni yola vurmaqla tapılır (A = F·h), vaxta yox. Düz cavab ${F(P)} W.`,
            `3-cü addım: güc işin vaxta nisbətidir, P = A/t. Düz cavab ${F(P)} W.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Tormoz yolu, pilləkən, bənd, lift — hamısı iş və enerji hesablarıdır.",
      gen() {
        const kind = pick(["avto", "pillekan", "su", "lift"]);
        if (kind === "avto") {
          let kmh, m1, m2, d; do { kmh = pick([54, 72, 90]); m1 = pick([0.8, 0.5, 0.4]); m2 = pick([0.2, 0.25]); const v = kmh / 3.6; d = v * v / (2 * g) * (1 / m2 - 1 / m1); } while (!nice(d, 2));
          const v = kmh / 3.6;
          return R(d, "m", { text: `Sürəti saatda ${kmh} kilometr olan avtomobil quru asfaltda (sürtünmə əmsalı ${F(m1)}) tormozlayıb dayanır. Yağışdan sonra yol sürüşkən olub (əmsal ${F(m2)}). Tormoz yolu neçə metr uzanır?`,
            solution: `v = ${kmh}/3,6 = ${v} m/s. s = v²/(2μg). Quruda: ${v * v}/(2·${F(m1)}·10) = ${F(v * v / (2 * m1 * g))} m. Yaşda: ${v * v}/(2·${F(m2)}·10) = ${F(v * v / (2 * m2 * g))} m. Fərq ${F(d)} m.` });
        }
        if (kind === "pillekan") {
          let m, n, t, P; do { m = pick([40, 50, 60, 70]); n = pick([2, 3, 4, 5]); t = pick([20, 30, 40, 60]); P = m * g * 3 * n / t; } while (!nice(P, 2));
          return R(P, "W", { text: `Fikrətin kütləsi ${m} kiloqramdır. O, hər mərtəbəsi 3 m hündürlükdə olan binada ${n} mərtəbə yuxarı qalxır və bu ${t} saniyə çəkir. Fikrətin orta gücü nə qədərdir?`,
            solution: `Qalxma hündürlüyü ${n}·3 = ${3 * n} m. A = mgh = ${m}·10·${3 * n} = ${m * g * 3 * n} J. P = A/t = ${m * g * 3 * n}/${t} = ${F(P)} W.` });
        }
        if (kind === "su") {
          let q, hh, eta, P; do { q = pick([1000, 2000, 5000, 10000]); hh = pick([5, 10, 20, 50]); eta = pick([0.5, 0.8, 0.9]); P = q * g * hh * eta / 1000; } while (!nice(P, 2));
          return R(P, "kW", { text: `Bəndin hündürlüyü ${hh} metrdir. Hər saniyə turbinə ${q} kq su düşür. Turbinin faydalı iş əmsalı ${Math.round(eta * 100)} faizdir. Elektrik stansiyasının gücü neçə kilovatt olar?`,
            solution: `Hər saniyə suyun potensial enerjisi azalır: mgh = ${q}·10·${hh} = ${q * g * hh} J. Güc ${q * g * hh} W, faydalısı ${Math.round(eta * 100)}%: ${F(q * g * hh * eta)} W = ${F(P)} kW.` });
        }
        let M, v, P; do { M = pick([300, 400, 500, 800, 1000]); v = pick([0.5, 1, 1.5, 2, 2.5]); P = M * g * v; } while (!nice(P, 2));
        return R(P, "W", { text: `Lift kabinəsi yüklə birlikdə ${M} kiloqramdır və ${F(v)} m/s sabit sürətlə yuxarı qalxır. Sürtünməni nəzərə almasaq, lift mühərrikinin gücü neçə vattdır?`,
          solution: `Sabit sürətdə çəkmə qüvvəsi F = Mg = ${M * g} N. P = F·v = ${M * g}·${F(v)} = ${F(P)} W.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-enerji", title: "Kinetik və potensial enerji", fenn: "fizika", link: "dersler/fiz-enerji.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: J, W, m, m/s, N). Onluq kəsr vergül və ya nöqtə ilə: 0,25. Mənfi cavabda − işarəsini yaz. g = 10 m/s².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ek", "ek", "ep", "ep", "is", "teorem", "teorem", "surtunme", "surtunme", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-enerji.html")) b.push("dersler/fiz-enerji.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
