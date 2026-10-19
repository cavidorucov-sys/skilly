// Fizika · İmpuls və onun saxlanması, toqquşmalar — mastery game levels (p = mv, force impulse, recoil, inelastic and elastic 1D collisions, energy lost) and the final test.
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

  // two bodies before the collision: body 1 on the left moves right (v1 > 0); body 2 on the right moves right (v2 > 0), left (v2 < 0) or stands (v2 = 0)
  function col(m1, v1, m2, v2) {
    const W = 260, H = 110, g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Toqquşmadan əvvəl iki cisim" });
    const arrow = (x1, x2, y, label, anchor) => {
      g.append(sv("line", { x1, y1: y, x2, y2: y, stroke: RED, "stroke-width": 3 }));
      const d = x2 > x1 ? -1 : 1;
      g.append(sv("polygon", { points: `${x2},${y} ${x2 + 9 * d},${y - 5} ${x2 + 9 * d},${y + 5}`, fill: RED }));
      g.append(sv("text", { x: anchor, y: y - 9, "text-anchor": "middle", class: "oy-lbl" }, label));
    };
    g.append(sv("line", { x1: 8, y1: 88, x2: W - 8, y2: 88, stroke: INK, "stroke-width": 2 }));
    g.append(sv("rect", { x: 20, y: 56, width: 44, height: 32, fill: SOFT, stroke: INK, "stroke-width": 2 }));
    g.append(sv("text", { x: 42, y: 77, "text-anchor": "middle", class: "oy-lbl" }, F(m1) + " kq"));
    g.append(sv("rect", { x: 176, y: 56, width: 44, height: 32, fill: SOFT, stroke: INK, "stroke-width": 2 }));
    g.append(sv("text", { x: 198, y: 77, "text-anchor": "middle", class: "oy-lbl" }, F(m2) + " kq"));
    arrow(66, 106, 40, F(v1) + " m/s", 86);
    if (v2 > 0) arrow(222, 252, 40, F(v2) + " m/s", 237);
    else if (v2 < 0) arrow(174, 134, 40, F(-v2) + " m/s", 154);
    return g;
  }

  const levels = [
    { id: "impuls", ad: "İmpuls və qüvvə impulsu", izah: "p = mv (vektor, vahidi kq·m/s). Qüvvənin impulsu F·Δt = Δp = mv₂ − mv₁. Əks istiqamətdə sıçrayanda Δp = m(v₁ + v₂).",
      gen() {
        const kind = pick(["p", "v", "dp", "dp2", "F", "F2", "pEk", "pEk2", "t"]);
        if (kind === "p") {
          let m, v, p; do { m = pick([0.2, 0.5, 1, 2, 5, 60, 1000]); v = pick([1, 2, 3, 5, 10, 15, 20]); p = m * v; } while (!nice(p, 2));
          return R(p, "kq·m/s", { text: `Kütləsi ${F(m)} kq olan cisim ${v} m/s sürətlə gedir. Cismin impulsunun modulu nə qədərdir?`, solution: `p = mv = ${F(m)}·${v} = ${F(p)} kq·m/s.` });
        }
        if (kind === "v") {
          let m, v, p; do { m = pick([0.2, 0.5, 2, 4, 5, 10, 60]); v = rnd(2, 25); p = m * v; } while (!nice(p, 2));
          return R(v, "m/s", { text: `Kütləsi ${F(m)} kq olan cismin impulsu ${F(p)} kq·m/s-dir. Cismin sürəti nə qədərdir?`, solution: `p = mv → v = p/m = ${F(p)}/${F(m)} = ${v} m/s.` });
        }
        if (kind === "dp") {
          const m = pick([0.1, 0.2, 0.4, 0.5, 1]), v = pick([2, 5, 10, 15, 20]);
          return R(2 * m * v, "kq·m/s", { text: `Kütləsi ${F(m)} kq olan top divara perpendikulyar ${v} m/s sürətlə dəyir və eyni sürətlə geri sıçrayır. İmpulsun dəyişməsinin modulu nə qədərdir?`,
            solution: `Sürət əks istiqamətə dönüb: Δp = m·v − (−m·v) = 2mv = 2·${F(m)}·${v} = ${F(2 * m * v)} kq·m/s. (Δp ≠ 0: sürət işarəsini dəyişdi, ona görə sürətlər cəmlənir.)` });
        }
        if (kind === "dp2") {
          let m, v1, v2; do { m = pick([0.1, 0.2, 0.4, 0.5, 1]); v1 = pick([5, 8, 10, 15, 20]); v2 = pick([2, 4, 6, 8, 10]); } while (v2 >= v1);
          return R(m * (v1 + v2), "kq·m/s", { text: `Kütləsi ${F(m)} kq olan top divara perpendikulyar ${v1} m/s sürətlə dəyir və ${v2} m/s sürətlə geri sıçrayır. İmpulsun dəyişməsinin modulu nə qədərdir?`,
            solution: `Hərəkət istiqamətini dəyişib: Δp = m(v₁ + v₂) = ${F(m)}·(${v1} + ${v2}) = ${F(m * (v1 + v2))} kq·m/s.` });
        }
        if (kind === "F") {
          let m, v, dt, f; do { m = pick([0.1, 0.2, 0.4, 0.45, 0.5]); v = pick([10, 15, 20, 25, 30]); dt = pick([0.005, 0.01, 0.02, 0.05]); f = m * v / dt; } while (!nice(f, 0));
          return R(f, "N", { text: `Futbolçu dayanan ${F(m)} kq kütləli topa vurur. Ayaqla təmas ${F(dt)} saniyə çəkir və top ${v} m/s sürət alır. Ayağın topa orta təsir qüvvəsi nə qədərdir?`,
            solution: `F·Δt = mv − 0 → F = mv/Δt = ${F(m)}·${v}/${F(dt)} = ${F(f)} N.` });
        }
        if (kind === "F2") {
          let m, v1, v2, dt, f; do { m = pick([0.1, 0.2, 0.4, 0.5]); v1 = pick([10, 15, 20, 25]); v2 = pick([5, 10, 15, 20]); dt = pick([0.005, 0.01, 0.02, 0.05]); f = m * (v1 + v2) / dt; } while (v2 > v1 || !nice(f, 0));
          return R(f, "N", { text: `Kütləsi ${F(m)} kq olan top divara ${v1} m/s sürətlə perpendikulyar dəyir və ${v2} m/s sürətlə geri sıçrayır. Təmas müddəti ${F(dt)} saniyədir. Divarın topa orta təsir qüvvəsi nə qədərdir?`,
            solution: `Δp = m(v₁ + v₂) = ${F(m)}·${v1 + v2} = ${F(m * (v1 + v2))} kq·m/s. F = Δp/Δt = ${F(m * (v1 + v2))}/${F(dt)} = ${F(f)} N.` });
        }
        if (kind === "pEk") {
          let m, p, E; do { m = pick([0.5, 1, 2, 4, 5, 10]); p = pick([2, 4, 6, 8, 10, 12, 20, 30]); E = p * p / (2 * m); } while (!nice(E, 2));
          return R(E, "J", { text: `Kütləsi ${F(m)} kq olan cismin impulsu ${p} kq·m/s-dir. Cismin kinetik enerjisi nə qədərdir?`,
            solution: `Ek = p²/(2m) = ${p * p}/(2·${F(m)}) = ${F(E)} J. (Yoxlama: v = p/m = ${F(p / m)} m/s, Ek = mv²/2 = ${F(E)} J.)` });
        }
        if (kind === "pEk2") {
          let m, p, E; do { m = pick([0.5, 1, 2, 4, 5, 8]); p = pick([2, 4, 6, 8, 10, 12, 20]); E = p * p / (2 * m); } while (!nice(E, 2));
          return R(p, "kq·m/s", { text: `Kütləsi ${F(m)} kq olan cismin kinetik enerjisi ${F(E)} J-dur. Cismin impulsu nə qədərdir?`,
            solution: `p² = 2m·Ek = 2·${F(m)}·${F(E)} = ${p * p} → p = ${p} kq·m/s.` });
        }
        let m, v, f, t; do { m = pick([800, 1000, 1200, 1500, 2000]); v = pick([10, 15, 20, 25, 30]); f = pick([2000, 3000, 4000, 5000, 6000, 8000, 10000]); t = m * v / f; } while (!nice(t, 2) || t < 0.5 || t > 15);
        return R(t, "s", { text: `Kütləsi ${m} kq olan avtomobil ${v} m/s sürətlə gedir. Sabit ${f} N tormozlayıcı qüvvə onu neçə saniyəyə saxlayar?`,
          solution: `F·Δt = mv → Δt = mv/F = ${m}·${v}/${f} = ${F(t)} s.` });
      } },
    { id: "saxlanma", ad: "İmpulsun saxlanması, geri təpmə", izah: "Qapalı sistemdə impulsların vektor cəmi saxlanır. Əvvəl hərəkətsiz idisə: 0 = m₁v₁ + m₂v₂ — hissələr əks istiqamətə uçur, sürətlər kütlələrlə tərs mütənasibdir.",
      gen() {
        const kind = pick(["tufeng", "tufeng", "qayiq", "qayiqNis", "skate", "partlayis", "top"]);
        if (kind === "tufeng") {
          let M, mq, v, V; do { M = pick([3, 4, 5, 8, 10]); mq = pick([8, 10, 20, 50]); v = pick([300, 400, 500, 600, 800]); V = mq / 1000 * v / M; } while (!nice(V, 2) || V < 0.1);
          return R(V, "m/s", { text: `Kütləsi ${M} kq olan tüfəngdən ${mq} qram kütləli güllə üfüqi istiqamətdə ${v} m/s sürətlə atılır. Tüfəng sərbəst tutulub. Geri təpmənin sürəti nə qədərdir?`,
            solution: `Atışdan əvvəl impuls 0: 0 = m·v − M·V → V = m·v/M = ${F(mq / 1000)}·${v}/${M} = ${F(V)} m/s.` });
        }
        if (kind === "qayiq") {
          let m, M, v, V; do { m = pick([40, 50, 60, 70]); M = pick([100, 150, 200, 250, 300]); v = pick([2, 3, 4, 5]); V = m * v / M; } while (!nice(V, 2));
          return R(V, "m/s", { text: `Sakit suda durmuş kütləsi ${M} kq olan qayıqdan kütləsi ${m} kq olan oğlan sahilə doğru üfüqi tullanır; sahilə nəzərən sürəti ${v} m/s-dir. Qayıq hansı sürətlə geri gedər? Suyun müqavimətini nəzərə alma.`,
            solution: `Sistemin başlanğıc impulsu 0: 0 = m·v − M·V → V = m·v/M = ${m}·${v}/${M} = ${F(V)} m/s.` });
        }
        if (kind === "qayiqNis") {
          let m, M, u, V; do { m = pick([40, 50, 60, 80]); M = pick([40, 60, 100, 120, 160, 220]); u = pick([2, 3, 4, 5]); V = m * u / (m + M); } while (!nice(V, 3));
          return R(V, "m/s", { text: `Sakit suda durmuş qayığın kütləsi ${M} kq-dır. Kütləsi ${m} kq olan insan qayıqdan üfüqi tullanır; qayığa nəzərən sürəti ${u} m/s-dir. Qayıq (sahilə nəzərən) hansı sürətlə geri gedər? Suyun müqavimətini nəzərə alma.`,
            solution: `Qayıq V sürətlə geri gedir, insanın sahilə nəzərən sürəti u − V. İmpuls: 0 = m(u − V) − M·V → V = m·u/(m + M) = ${m}·${u}/${m + M} = ${F(V)} m/s.` });
        }
        if (kind === "skate") {
          let m1, m2, v1, v2, t, d; do { m1 = pick([40, 50, 60, 80]); m2 = pick([20, 30, 40, 50, 60]); v1 = pick([0.5, 1, 1.5, 2]); v2 = m1 * v1 / m2; t = pick([2, 3, 4, 5, 10]); d = (v1 + v2) * t; } while (!nice(v2, 2) || m1 === m2 || !nice(d, 2));
          return R(d, "m", { text: `Konkidə sürüşən iki dost bir-birini itələyir və əks istiqamətlərdə ayrılır. Kütlələri ${m1} kq və ${m2} kq-dır. Birinci (${m1} kq) ${F(v1)} m/s sürət alır. İtələmədən ${t} saniyə sonra aralarındakı məsafə nə qədər olar? (Sürtünmə yoxdur, itələmə qısa müddətdədir.)`,
            solution: `m₁v₁ = m₂v₂ → v₂ = ${m1}·${F(v1)}/${m2} = ${F(v2)} m/s. Əks istiqamətdə ayrılırlar, yaxınlaşma sürəti toplanır: (v₁ + v₂)·t = (${F(v1)} + ${F(v2)})·${t} = ${F(d)} m.` });
        }
        if (kind === "partlayis") {
          let m1, m2, v, v1, v2; do { m1 = pick([1, 2, 3, 4]); m2 = pick([1, 2, 3, 4]); v = pick([10, 20, 30, 40, 50]); v1 = pick([0, 10, 20, 40, 50, 60, 80, 100]); v2 = ((m1 + m2) * v - m1 * v1) / m2; } while (!nice(v2, 2) || v2 === v);
          return R(v2, "m/s", { text: `Üfüqi uçan, ${m1 + m2} kq kütləli mərmi ${v} m/s sürətlə gedərkən partlayıb iki hissəyə ayrılır: ${m1} kq-lıq hissə eyni istiqamətdə ${v1} m/s sürətlə uçur. İkinci (${m2} kq-lıq) hissənin sürəti nə qədərdir? Mərminin əvvəlki hərəkət istiqamətini müsbət götür, mənfi cavab olarsa − işarəsini yaz.`,
            solution: `Partlayış zamanı impuls saxlanır: (${m1} + ${m2})·${v} = ${m1}·${v1} + ${m2}·v₂ → ${(m1 + m2) * v} = ${m1 * v1} + ${m2}v₂ → v₂ = ${F(v2)} m/s${v2 < 0 ? " (mənfi: ikinci hissə geriyə uçur)" : ""}.` });
        }
        let M, mq, v, V; do { M = pick([200, 400, 500, 800, 1000, 2000]); mq = pick([2, 4, 5, 10, 20]); v = pick([100, 200, 400, 500]); V = mq * v * 0.5 / M; } while (!nice(V, 3) || V < 0.05);
        return R(V, "m/s", { text: `Hamar relsdə dayanan, kütləsi ${M} kq olan (mərmi xaric) arabadakı topdan kütləsi ${mq} kq olan mərmi üfüqə 60° bucaq altında ${v} m/s sürətlə atılır (cos 60° = 0,5). Araba hansı sürətlə geri gedir?`,
          solution: `Üfüqi istiqamətdə impuls saxlanır (şaquli reaksiya relsdədir). Mərminin üfüqi sürəti v·cos 60° = ${v / 2} m/s. 0 = mq·${v / 2} − M·V → V = ${mq}·${v / 2}/${M} = ${F(V)} m/s.` });
      } },
    { id: "qeyri", ad: "Qeyri-elastik toqquşma", izah: "İki cisim yapışıb birlikdə gedirsə: m₁v₁ + m₂v₂ = (m₁ + m₂)V. İstiqaməti müsbət/mənfi seç: əks istiqamətli sürətin işarəsi mənfi olur.",
      gen() {
        const kind = pick(["ard", "ard", "qarsi", "qarsi", "sicray", "gulle", "qar"]);
        if (kind === "ard") {
          let m1, m2, v1, v2, V; do { m1 = pick([1, 2, 3, 4, 5, 6]); m2 = pick([1, 2, 3, 4, 5, 6]); v1 = pick([4, 6, 8, 10, 12, 15, 20]); v2 = pick([0, 1, 2, 3, 4, 5]); V = (m1 * v1 + m2 * v2) / (m1 + m2); } while (v2 >= v1 || !nice(V, 2));
          return R(V, "m/s", { text: `Hamar relsdə ${F(m1)} kq kütləli araba ${v1} m/s sürətlə irəliyə gedir${v2 ? ` və eyni istiqamətdə ${v2} m/s sürətlə gedən` : " və qarşıda dayanan"} ${F(m2)} kq-lıq arabaya çatıb ona yapışır. Birləşmiş arabaların sürəti nə qədər olur?`,
            svg: col(m1, v1, m2, v2), solution: `m₁v₁ + m₂v₂ = (m₁ + m₂)V → V = (${F(m1)}·${v1} + ${F(m2)}·${v2})/(${F(m1)} + ${F(m2)}) = ${F(m1 * v1 + m2 * v2)}/${F(m1 + m2)} = ${F(V)} m/s.` });
        }
        if (kind === "qarsi") {
          let m1, m2, v1, v2, V; do { m1 = pick([1, 2, 3, 4, 5, 6]); m2 = pick([1, 2, 3, 4, 5, 6]); v1 = pick([2, 3, 4, 5, 6, 8, 10]); v2 = pick([2, 3, 4, 5, 6, 8, 10]); V = (m1 * v1 - m2 * v2) / (m1 + m2); } while (m1 * v1 === m2 * v2 || !nice(V, 2));
          return R(V, "m/s", { text: `Hamar relsdə bir-birinə doğru gedən iki araba toqquşub yapışır: ${F(m1)} kq-lıq araba sağa ${v1} m/s, ${F(m2)} kq-lıq araba sola ${v2} m/s sürətlə gəlirdi. Birləşmiş arabaların sürəti nə qədərdir? Sağa istiqaməti müsbət götür; cavab mənfi olarsa − işarəsini yaz.`,
            svg: col(m1, v1, m2, -v2), solution: `Sağ istiqamət müsbət: m₁v₁ − m₂v₂ = (m₁ + m₂)V → V = (${F(m1)}·${v1} − ${F(m2)}·${v2})/${F(m1 + m2)} = ${F(m1 * v1 - m2 * v2)}/${F(m1 + m2)} = ${F(V)} m/s${V < 0 ? " (mənfi: sola gedirlər)" : ""}.` });
        }
        if (kind === "sicray") {
          let m, M, u, v0, V; do { m = pick([40, 50, 60, 80]); M = pick([60, 100, 120, 160, 200, 240]); u = pick([2, 3, 4, 5, 6]); v0 = pick([0, 0, 1, 2]); V = (m * u + M * v0) / (m + M); } while (!nice(V, 3));
          return R(V, "m/s", { text: `Kütləsi ${m} kq olan oğlan ${u} m/s sürətlə qaçıb ${v0 ? `eyni istiqamətdə ${v0} m/s sürətlə gedən` : "yerində dayanan"} kütləsi ${M} kq olan xizəyin üstünə tullanır və üstündə qalır. Xizəyin (oğlanla birgə) sürəti nə qədər olur? Sürtünməni nəzərə alma.`,
            solution: `Üfüqi impuls saxlanır: m·u + M·v₀ = (m + M)V → V = (${m}·${u} + ${M}·${v0})/${m + M} = ${m * u + M * v0}/${m + M} = ${F(V)} m/s.` });
        }
        if (kind === "gulle") {
          let m, M, v, V, T; do { m = pick([10, 20, 25, 50]); T = pick([1, 2, 4, 5]); M = +(T - m / 1000).toFixed(3); v = pick([100, 200, 300, 400, 500]); V = m / 1000 * v / T; } while (!nice(V, 3) || V < 0.05);
          return R(V, "m/s", { text: `Hamar masa üzərində duran kütləsi ${M} kq olan taxta bruska ${m} qram kütləli güllə ${v} m/s sürətlə üfüqi dəyir və bruskada ilişib qalır. Bruskanın (güllə ilə birlikdə) sürəti nə qədər olur?`,
            solution: `m = ${F(m / 1000)} kq. mv = (m + M)V → V = ${F(m / 1000)}·${v}/(${F(m / 1000)} + ${M}) = ${F(m / 1000 * v)}/${F(m / 1000 + M)} = ${F(V)} m/s.` });
        }
        let M, mq, v, V; do { M = pick([200, 300, 400, 500, 600]); mq = pick([50, 100, 150, 200, 300]); v = pick([2, 3, 4, 5, 6]); V = M * v / (M + mq); } while (!nice(V, 3));
        return R(V, "m/s", { text: `Üstü açıq vaqon (kütləsi ${M} kq) ${v} m/s sürətlə hamar relsdə gedir. Yuxarıdan şaquli düşən qar ${mq} kq qədər vaqona yığılır. Vaqonun sürəti nə qədər olur?`,
          solution: `Üfüqi istiqamətdə qarın başlanğıc impulsu 0-dır. M·v = (M + m)V → V = ${M}·${v}/${M + mq} = ${F(V)} m/s.` });
      } },
    { id: "elastik", ad: "Elastik toqquşma", izah: "Elastik toqquşmada impuls də, kinetik enerji də saxlanır. Düstur: v₁' = ((m₁ − m₂)v₁ + 2m₂v₂)/(m₁ + m₂). Bərabər kütlələr sürətləri dəyişir. Nisbi sürət işarəsini dəyişir: v₂' − v₁' = −(v₂ − v₁).",
      gen() {
        const kind = pick(["tarazli", "ele", "ele", "yungul", "agir", "ikihereket", "raket"]);
        const M2 = [1, 2, 3, 4, 5, 6, 9];
        if (kind === "tarazli") {
          const m = pick([1, 2, 3, 5, 0.5]), v = pick([2, 3, 4, 5, 6, 8, 10]);
          return R(v, "m/s", { text: `Hamar masada ${F(m)} kq kütləli bilyard topu ${v} m/s sürətlə eyni kütləli dayanan topa mərkəzi elastik zərbə ilə dəyir. Zərbədən sonra ikinci topun sürəti nə qədərdir?`,
            svg: col(m, v, m, 0), solution: `Kütlələr bərabər və ikinci top dayanır: toplar sürətlərini dəyişir. Birinci dayanır, ikinci ${v} m/s ilə gedir.` });
        }
        if (kind === "ele") {
          let m1, m2, v, w, first; do { m1 = pick(M2); m2 = pick(M2); v = pick([2, 3, 4, 5, 6, 8, 10, 12]); first = Math.random() < .5; w = first ? (m1 - m2) * v / (m1 + m2) : 2 * m1 * v / (m1 + m2); } while (m1 === m2 || !nice(w, 2));
          return R(w, "m/s", { text: `Hamar masada ${F(m1)} kq kütləli cisim ${v} m/s sürətlə sağa gedərək dayanan ${F(m2)} kq-lıq cismə mərkəzi elastik zərbə ilə dəyir. Zərbədən sonra ${first ? "birinci" : "ikinci"} cismin sürəti nə qədərdir? Sağa istiqaməti müsbət götür; cavab mənfi olarsa − işarəsini yaz.`,
            svg: col(m1, v, m2, 0), solution: first ? `v₁' = (m₁ − m₂)v₁/(m₁ + m₂) = (${F(m1)} − ${F(m2)})·${v}/${F(m1 + m2)} = ${F(w)} m/s${w < 0 ? " (mənfi: birinci cisim geri sıçrayır)" : ""}.` : `v₂' = 2m₁v₁/(m₁ + m₂) = 2·${F(m1)}·${v}/${F(m1 + m2)} = ${F(w)} m/s.` });
        }
        if (kind === "yungul") {
          let m1, m2, v, w; do { m1 = pick([1, 2, 3]); m2 = pick([3, 4, 5, 9, 15]); v = pick([2, 4, 5, 6, 8, 10]); w = (m1 - m2) * v / (m1 + m2); } while (m2 <= m1 || !nice(w, 2));
          return R(w, "m/s", { text: `${F(m1)} kq kütləli yüngül top ${v} m/s sürətlə sağa gedərək dayanan ağır ${F(m2)} kq-lıq cismə elastik zərbə ilə dəyir. Zərbədən sonra yüngül topun sürəti nə qədərdir? (Sağa müsbət; mənfi olarsa − işarəsini yaz.)`,
            svg: col(m1, v, m2, 0), solution: `v₁' = (m₁ − m₂)v₁/(m₁ + m₂) = (${m1} − ${m2})·${v}/${m1 + m2} = ${F(w)} m/s. Yüngül cisim ağırdan geri sıçrayır.` });
        }
        if (kind === "agir") {
          let m1, m2, v, w; do { m1 = pick([3, 4, 5, 9, 15]); m2 = pick([1, 2, 3]); v = pick([2, 4, 5, 6, 8, 10]); w = 2 * m1 * v / (m1 + m2); } while (m1 <= m2 || !nice(w, 2));
          return R(w, "m/s", { text: `${F(m1)} kq kütləli ağır cisim ${v} m/s sürətlə gedərək dayanan yüngül ${F(m2)} kq-lıq cismə elastik zərbə ilə dəyir. Zərbədən sonra yüngül cismin sürəti nə qədərdir?`,
            svg: col(m1, v, m2, 0), solution: `v₂' = 2m₁v₁/(m₁ + m₂) = 2·${m1}·${v}/${m1 + m2} = ${F(w)} m/s. Yüngül cisim ağırdan 2 dəfəyə qədər sürətli uça bilər (burada ${F(w / v)} dəfə).` });
        }
        if (kind === "ikihereket") {
          let m1, m2, v1, v2, w; do { m1 = pick([1, 2, 3, 4]); m2 = pick([1, 2, 3, 4]); v1 = pick([2, 3, 4, 5, 6]); v2 = pick([-6, -5, -4, -3, -2]); w = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2); } while (!nice(w, 2));
          return R(w, "m/s", { text: `Hamar masada ${F(m1)} kq-lıq cisim sağa ${v1} m/s, ${F(m2)} kq-lıq cisim sola ${-v2} m/s sürətlə gəlib mərkəzi elastik zərbə ilə toqquşur. Zərbədən sonra ikinci cismin sürəti nə qədərdir? Sağa istiqaməti müsbət götür; cavab mənfi olarsa − işarəsini yaz.`,
            svg: col(m1, v1, m2, v2), solution: `v₂' = ((m₂ − m₁)v₂ + 2m₁v₁)/(m₁ + m₂) = ((${m2} − ${m1})·(${F(v2)}) + 2·${m1}·${v1})/${m1 + m2} = ${F(w)} m/s.` });
        }
        const v = pick([5, 10, 15, 20, 25, 30]), u = pick([2, 4, 5, 8, 10, 15]);
        return R(v + 2 * u, "m/s", { text: `Tennisçi raketlə topu qarşılayır: top ${v} m/s sürətlə uçur, raket ona doğru ${u} m/s sürətlə hərəkət edir. Topun kütləsi raketin kütləsindən çox kiçikdir və zərbə elastikdir. Zərbədən sonra topun sürəti (Yerə nəzərən) nə qədərdir?`,
          solution: `Raketin sistemində (ağır cisim) top ${v + u} m/s sürətlə yaxınlaşır və eyni sürətlə geri sıçrayır. Yerə nəzərən: ${v + u} + ${u} = ${v + 2 * u} m/s. (Qayda: v' = v + 2u.)` });
      } },
    { id: "itki", ad: "Toqquşmada enerji itkisi", izah: "Qeyri-elastik toqquşmada impuls saxlanır, kinetik enerji yox: itki = Ek əvvəl − Ek sonra. m₂ dayanırsa itirilən hissə m₂/(m₁ + m₂). Ballistik rəqqas: əvvəl toqquşma, sonra enerji saxlanması.",
      gen() {
        const kind = pick(["itkiJ", "itkiJ", "faiz", "ballistik", "ballistik", "bufer"]);
        if (kind === "itkiJ") {
          let m1, m2, v, Q; do { m1 = pick([1, 2, 3, 4, 5, 6]); m2 = pick([1, 2, 3, 4, 5, 6]); v = pick([2, 3, 4, 5, 6, 8, 10]); Q = m1 * v * v / 2 * m2 / (m1 + m2); } while (!nice(Q, 2));
          const V = m1 * v / (m1 + m2);
          return R(Q, "J", { text: `Kütləsi ${m1} kq olan plastilin top ${v} m/s sürətlə hamar masada dayanan ${m2} kq-lıq plastilin topa dəyib ona yapışır. Toqquşmada nə qədər mexaniki enerji istiliyə çevrilir?`,
            solution: `V = m₁v/(m₁ + m₂) = ${m1}·${v}/${m1 + m2} = ${F(V)} m/s. Əvvəl: ${m1}·${v * v}/2 = ${F(m1 * v * v / 2)} J. Sonra: ${m1 + m2}·${F(V * V)}/2 = ${F((m1 + m2) * V * V / 2)} J. İtki ${F(Q)} J.` });
        }
        if (kind === "faiz") {
          let m1, m2, p; do { m1 = pick([1, 2, 3, 4, 5, 6, 8]); m2 = pick([1, 2, 3, 4, 5, 6, 8, 12]); p = m2 / (m1 + m2) * 100; } while (!nice(p, 1));
          return R(p, "%", { text: `Kütləsi ${m1} kq olan cisim dayanan ${m2} kq-lıq cismə yapışaraq qeyri-elastik toqquşur. İlkin kinetik enerjinin neçə faizi istiliyə çevrilir?`,
            solution: `V = m₁v/(m₁ + m₂). Ek sonra / Ek əvvəl = m₁/(m₁ + m₂). İtirilən hissə = m₂/(m₁ + m₂) = ${m2}/${m1 + m2} = ${F(p / 100)} = ${F(p)}%.` });
        }
        if (kind === "ballistik") {
          let m, M, hh, v; do { m = pick([0.01, 0.02, 0.05, 0.1]); M = pick([1, 2, 4, 5]); hh = pick([0.05, 0.2, 0.45, 0.8, 1.25, 1.8]); v = (m + M) / m * Math.sqrt(2 * g * hh); } while (!nice(v, 1));
          return R(v, "m/s", { text: `Ballistik rəqqas: ipdən asılmış ${M} kq kütləli qum yeşiyinə ${F(m * 1000)} qram kütləli güllə üfüqi dəyib ilişir. Yeşik (güllə ilə birlikdə) ${F(hh)} m hündürlüyə qalxır. Güllənin sürəti nə qədər idi?`,
            solution: `Qalxma: (m + M)V²/2 = (m + M)g·h → V = √(2gh) = √${F(2 * g * hh)} = ${F(Math.sqrt(2 * g * hh))} m/s. Toqquşma: m·v = (m + M)V → v = (${F(m)} + ${M})·${F(Math.sqrt(2 * g * hh))}/${F(m)} = ${F(v)} m/s.` });
        }
        let m1, m2, v, k, x; do { m1 = pick([1, 2, 3, 4, 6]); m2 = pick([1, 2, 3, 4, 6]); v = pick([2, 4, 6, 8, 10]); k = pick([100, 200, 400, 800, 1000, 2000, 3600, 5000]); x = Math.sqrt(m1 * m2 * v * v / ((m1 + m2) * k)); } while (!nice(x, 3) || x < 0.02 || x > 1);
        return R(x, "m", { text: `Hamar relsdə ${m1} kq kütləli araba ${v} m/s sürətlə gəlib dayanan ${m2} kq-lıq arabaya çatır. İkinci arabada sərtliyi ${k} N/m olan yay bufer var. Yayın maksimal sıxılması neçə metr olar?`,
          svg: col(m1, v, m2, 0), solution: `Ən çox sıxılanda arabaların sürəti eynidir: V = m₁v/(m₁ + m₂) = ${F(m1 * v / (m1 + m2))} m/s. Enerji itkisi yayda toplanır: kx²/2 = m₁v²/2 − (m₁ + m₂)V²/2 = ${F(m1 * m2 * v * v / (2 * (m1 + m2)))} J → x² = ${F(m1 * m2 * v * v / ((m1 + m2) * k))} → x = ${F(x)} m.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let m1, m2, v1, v2, V; do { m1 = pick([2, 3, 4, 5]); m2 = pick([1, 2, 3, 4, 6]); v1 = pick([4, 5, 6, 8, 10]); v2 = pick([2, 3, 4, 5, 6]); V = (m1 * v1 - m2 * v2) / (m1 + m2); } while (m1 === m2 || m1 * v1 === m2 * v2 || !nice(V, 2));
          task = `${m1} kq-lıq araba sağa ${v1} m/s, ${m2} kq-lıq araba sola ${v2} m/s sürətlə gəlib toqquşur və yapışır. Birləşmiş arabaların sürəti neçə m/s-dir? (Sağ istiqaməti müsbət götür.)`;
          steps = [`İmpulslar: p₁ = ${m1}·${v1} = ${m1 * v1}, p₂ = −${m2}·${v2} = ${F(-m2 * v2)} kq·m/s.`, `Saxlanma: ${m1 * v1} − ${m2 * v2} = (${m1} + ${m2})·V.`, `V = ${m1 * v1 - m2 * v2}/${m1 + m2} = ${F(V)} m/s.`];
          if (bad === 0) { const Vw = (m1 * v1 + m2 * v2) / (m1 + m2); steps = [`İmpulslar: p₁ = ${m1}·${v1} = ${m1 * v1}, p₂ = ${m2}·${v2} = ${m2 * v2} kq·m/s.`, `Saxlanma: ${m1 * v1} + ${m2 * v2} = (${m1} + ${m2})·V.`, `V = ${m1 * v1 + m2 * v2}/${m1 + m2} = ${F(+Vw.toFixed(3))} m/s.`]; }
          if (bad === 1) { const Vw = (m1 * v1 - m2 * v2) / m1; steps[1] = `Saxlanma: ${m1 * v1} − ${m2 * v2} = ${m1}·V.`; steps[2] = `V = ${m1 * v1 - m2 * v2}/${m1} = ${F(+Vw.toFixed(3))} m/s.`; }
          if (bad === 2) { const Vw = (m1 * v1 - m2 * v2) / (m1 - m2); steps[2] = `V = ${m1 * v1 - m2 * v2}/(${m1} − ${m2}) = ${F(+Vw.toFixed(3))} m/s.`; }
          why = [`1-ci addım: ikinci araba əks istiqamətdə gəlir, impulsu mənfidir: p₂ = −${m2 * v2}. Düz cavab ${F(V)} m/s.`,
            `2-ci addım: yapışandan sonra hər iki araba hərəkət edir, kütlə m₁ + m₂ olmalıdır. Düz cavab ${F(V)} m/s.`,
            `3-cü addım: məxrəc kütlələrin cəmidir (${m1} + ${m2}), fərqi yox. Düz cavab ${F(V)} m/s.`][bad];
        } else {
          let m, M, u, V; do { m = pick([40, 50, 60, 80]); M = pick([40, 60, 100, 120, 160, 220]); u = pick([2, 3, 4, 5]); V = m * u / (m + M); } while (!nice(V, 3));
          task = `Sakit suda durmuş qayığın kütləsi ${M} kq-dır. Kütləsi ${m} kq olan insan qayıqdan üfüqi tullanır, onun qayığa nəzərən sürəti ${u} m/s-dir. Qayıq sahilə nəzərən hansı sürətlə geri gedir (m/s)?`;
          steps = [`Qayıq V sürətlə geri gedir, insanın sahilə nəzərən sürəti u − V = ${u} − V.`, `İmpulsun saxlanması: ${m}·(${u} − V) = ${M}·V.`, `${m * u} = (${m} + ${M})·V → V = ${m * u}/${m + M} = ${F(V)} m/s.`];
          if (bad === 0) { const Vw = m * u / M; steps = [`İnsanın sahilə nəzərən sürəti ${u} m/s-dir.`, `İmpulsun saxlanması: ${m}·${u} = ${M}·V.`, `V = ${m * u}/${M} = ${F(+Vw.toFixed(3))} m/s.`]; }
          if (bad === 1) { const Vw = m * u / (M + 2 * m); steps[1] = `İmpulsun saxlanması: ${m}·(${u} − V) = (${M} + ${m})·V.`; steps[2] = `${m * u} = (${M} + 2·${m})·V → V = ${m * u}/${M + 2 * m} = ${F(+Vw.toFixed(3))} m/s.`; }
          if (bad === 2) { const Vw = m * u / (M - m); steps[2] = `${m * u} = (${M} − ${m})·V → V = ${m * u}/${M - m} = ${F(+Vw.toFixed(3))} m/s.`; }
          why = [`1-ci addım: qayıq geri getdiyindən insanın sahilə nəzərən sürəti ${u} deyil, ${u} − V olur. Düz cavab ${F(V)} m/s.`,
            `2-ci addım: qayığın kütləsi M-dir, M + m yox (insan artıq qayıqda deyil). Düz cavab ${F(V)} m/s.`,
            `3-cü addım: ${m}V + ${M}V = (${m} + ${M})V — kütlələr toplanır. Düz cavab ${F(V)} m/s.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Təhlükəsizlik yastığı, raket, kosmonavt, balıq — hamısı impulsun saxlanması və F·Δt = Δp.",
      gen() {
        const kind = pick(["yastiq", "yastiq", "kosmos", "raket", "baliq", "hokey"]);
        if (kind === "yastiq") {
          let m, kmh, t1, t2, v, d; do { m = pick([60, 70, 80]); kmh = pick([36, 54, 72]); t1 = pick([0.02, 0.05, 0.1]); t2 = pick([0.1, 0.2, 0.25, 0.4]); v = kmh / 3.6; d = m * v / t1 - m * v / t2; } while (t2 <= t1 || !nice(d, 0));
          return R(d, "N", { text: `Kütləsi ${m} kq olan sərnişin saatda ${kmh} kilometr sürətlə gedən avtomobildə qəzaya düşür. Yastıqsız onu ${F(t1)} saniyəyə saxlayırlar, təhlükəsizlik yastığı ilə isə ${F(t2)} saniyəyə. Yastıq orta qüvvəni neçə nyuton azaldır?`,
            solution: `v = ${kmh}/3,6 = ${v} m/s, Δp = mv = ${F(m * v)} kq·m/s. F₁ = Δp/${F(t1)} = ${F(m * v / t1)} N, F₂ = Δp/${F(t2)} = ${F(m * v / t2)} N. Fərq ${F(d)} N.` });
        }
        if (kind === "kosmos") {
          let M, m, u, V; do { M = pick([80, 100, 120]); m = pick([2, 4, 5, 8]); u = pick([5, 10, 15, 20]); V = m * u / M; } while (!nice(V, 3));
          return R(V, "m/s", { text: `Açıq kosmosda hərəkətsiz dayanan kosmonavtın (alət olmadan) kütləsi ${M} kq-dır. O, ${m} kq-lıq aləti özünə nəzərən yox, başlanğıc vəziyyətinə nəzərən ${u} m/s sürətlə tullayır. Kosmonavt hansı sürətlə əks tərəfə gedir?`,
            solution: `Başlanğıc impuls 0: 0 = m·u − M·V → V = m·u/M = ${m}·${u}/${M} = ${F(V)} m/s.` });
        }
        if (kind === "raket") {
          let M, m, u, V; do { M = pick([20, 50, 100, 200, 400]); m = pick([1, 2, 4, 5]); u = pick([200, 400, 500, 800, 1000]); V = m * u / M; } while (!nice(V, 2));
          return R(V, "m/s", { text: `Kosmosda hərəkətsiz duran raketdən (qalan hissənin kütləsi ${M} kq) ${m} kq yanacaq qazı ${u} m/s sürətlə arxaya atılır. Raket hansı sürət alır?`,
            solution: `0 = m·u − M·V → V = m·u/M = ${m}·${u}/${M} = ${F(V)} m/s. (Kütlə dəyişməsi rolunu oynayır; real raket qazı davamlı atır.)` });
        }
        if (kind === "baliq") {
          let M, m, v, u, V; do { M = pick([2, 3, 4, 6]); m = pick([1, 2, 3]); v = pick([1, 2, 3]); u = pick([1, 2, 4, 6]); V = (M * v - m * u) / (M + m); } while (!nice(V, 3) || M * v === m * u);
          return R(V, "m/s", { text: `${M} kq-lıq balıq ${v} m/s sürətlə üzərkən qarşıdan ${u} m/s sürətlə üzən ${m} kq-lıq balığı uddu. Böyük balığın sürəti nə qədər olur? Böyük balığın hərəkət istiqamətini müsbət götür; mənfi olarsa − işarəsini yaz. Suyun müqavimətini nəzərə alma.`,
            solution: `M·v − m·u = (M + m)V → V = (${M}·${v} − ${m}·${u})/${M + m} = ${M * v - m * u}/${M + m} = ${F(V)} m/s${V < 0 ? " (mənfi: istiqamət dəyişdi)" : ""}.` });
        }
        let a, b, w, W; do { a = pick([0.16, 0.2, 0.4, 0.5]); b = pick([0.04, 0.05, 0.1, 0.2]); w = pick([10, 20, 30]); W = a * w / (a + b); } while (!nice(W, 2));
        return R(W, "m/s", { text: `Hokkey şaybası (${F(b * 1000)} qram) hamar buzda dayanır. Kütləsi ${F(a * 1000)} qram olan plastilin kürə ${w} m/s sürətlə şaybaya dəyib yapışır. Birgə sürətləri nə qədərdir?`,
          solution: `a·w = (a + b)V → V = ${F(a)}·${w}/${F(a + b)} = ${F(W)} m/s.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-impuls", title: "İmpuls və onun saxlanması, toqquşmalar", fenn: "fizika", link: "dersler/fiz-impuls.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: kq·m/s, m/s, N, J). Onluq kəsr vergül və ya nöqtə ilə: 0,25. Mənfi cavabda − işarəsini yaz. g = 10 m/s².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["impuls", "impuls", "saxlanma", "saxlanma", "qeyri", "qeyri", "elastik", "itki", "itki", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-impuls.html")) b.push("dersler/fiz-impuls.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
