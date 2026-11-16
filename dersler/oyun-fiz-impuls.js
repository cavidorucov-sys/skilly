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

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a figure (F–t graph, wall,
  // cannon, carts, pendulum, x–t graph), several steps; the wrong options are the answers of typical mistakes.
  // Joined topics: 2 fiz-vektorlar, 5 and 6 fiz-enerji-saxlanma, 7 fiz-surtunme-maili, 8 fiz-huk, 9 fiz-serbest-dusme, 10 fiz-kinematika.
  const { ae, again } = Oyun;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const fr2 = (p, q) => { const d = gcd(p, q); return q / d === 1 ? String(p / d) : p / d + "/" + q / d; };
  const okn = (xs, d) => xs.every(x => isFinite(x) && x > 0 && nice(x, d));
  const IK = "var(--ink,#17171a)", AC = "var(--accent,#a32d2d)", VC = "var(--vec,#0c447c)", MU = "var(--muted,#6b6b73)", SF = "var(--accent-soft,#e8eef8)", PP = "var(--paper,#fff)";
  const r1 = v => +(+v).toFixed(1);
  const Sx = (W, H, aria) => sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": aria });
  const ln = (el, x1, y1, x2, y2, c = IK, w = 2, dash) => el.append(sv("line", Object.assign({ x1: r1(x1), y1: r1(y1), x2: r1(x2), y2: r1(y2), stroke: c, "stroke-width": w, "stroke-linecap": "round" }, dash ? { "stroke-dasharray": dash } : {})));
  const tx = (el, x, y, s, a = "middle", c = IK, sz = 13) => el.append(sv("text", { x: r1(x), y: r1(y), "text-anchor": a, "font-size": sz, "font-weight": 700, fill: c }, s));
  const ar = (el, x1, y1, x2, y2, c = AC, w = 2.5) => { const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    ln(el, x1, y1, x2 - 6 * ux, y2 - 6 * uy, c, w);
    el.append(sv("polygon", { points: [[x2, y2], [x2 - 10 * ux + 5 * uy, y2 - 10 * uy - 5 * ux], [x2 - 10 * ux - 5 * uy, y2 - 10 * uy + 5 * ux]].map(p => r1(p[0]) + "," + r1(p[1])).join(" "), fill: c })); };
  const bx = (el, x, y, w, h, s, fill = SF, dash) => { el.append(sv("rect", Object.assign({ x: r1(x), y: r1(y), width: w, height: h, fill, stroke: IK, "stroke-width": 2 }, dash ? { "stroke-dasharray": dash } : {}))); if (s) tx(el, x + w / 2, y + h / 2 + 5, s); };
  const hatch = (el, x1, x2, y, up) => { ln(el, x1, y, x2, y); for (let x = x1 + 6; x < x2; x += 12) ln(el, x, y + (up ? -1 : 1), x - 7, y + (up ? -9 : 9), MU, 1.2); };
  const wheels = (el, x, w, y) => { [x + 10, x + w - 10].forEach(c => el.append(sv("circle", { cx: r1(c), cy: r1(y), r: 5, fill: PP, stroke: IK, "stroke-width": 2 }))); };
  const pl = (el, pts, c = AC, w = 2.5, dash) => el.append(sv("polyline", Object.assign({ points: pts.map(p => r1(p[0]) + "," + r1(p[1])).join(" "), fill: "none", stroke: c, "stroke-width": w, "stroke-linejoin": "round" }, dash ? { "stroke-dasharray": dash } : {})));

  // 1. F–t graph: 0 → F0 (t1), F0 until t2, → 0 at t3
  function figFt(F0, t1, t2, t3) { const el = Sx(280, 185, "Qüvvənin zamandan asılılıq qrafiki: trapesiya"), X = t => 40 + t * 32, Y = f => 150 - f / F0 * 100;
    for (let t = 1; t <= 7; t++) { ln(el, X(t), 150, X(t), 40, MU, 0.6, "3 3"); tx(el, X(t), 168, String(t), "middle", MU, 11); }
    ln(el, 40, Y(F0), X(t2), Y(F0), MU, 1, "4 3"); tx(el, 34, Y(F0) + 4, "F₀", "end");
    ar(el, 40, 150, 272, 150, IK, 1.5); ar(el, 40, 150, 40, 20, IK, 1.5); tx(el, 270, 182, "t, s", "end"); tx(el, 46, 18, "F, N", "start");
    pl(el, [[X(0), Y(0)], [X(t1), Y(F0)], [X(t2), Y(F0)], [X(t3), Y(0)]]); return el; }
  // 2. a ball hits a wall at angle α to the normal and bounces off
  function figWall(c) { const el = Sx(260, 180, "Top divara perpendikulyarla α bucağı altında dəyir və əks olunur"), s = Math.sqrt(1 - c * c), L = 105, px = 200, py = 90;
    ln(el, px, 15, px, 165, IK, 3); for (let y = 21; y < 165; y += 12) ln(el, px + 2, y, px + 10, y - 7, MU, 1.2);
    ln(el, px, py, px - 120, py, MU, 1.2, "4 3");
    ar(el, px - L * c, py - L * s, px - 3 * c, py - 3 * s); ar(el, px, py, px - L * c, py + L * s, VC);
    tx(el, px - L * c - 4, py - L * s + 16, "v", "end", AC); tx(el, px - L * c - 4, py + L * s - 6, "v", "end", VC);
    tx(el, px - 34, py - 8, "α", "middle"); tx(el, px - 34, py + 18, "α", "middle"); return el; }
  // 3. cannon on a platform on rails, the shell flies at angle α above the horizon
  function figCannon(c) { const el = Sx(270, 165, "Relslər üzərində platforma, topdan mərmi üfüqlə α bucağı altında atılır"), s = Math.sqrt(1 - c * c), bx0 = 115, by0 = 100, L = 55;
    hatch(el, 10, 260, 145); bx(el, 50, 110, 120, 24, "M"); wheels(el, 50, 120, 140);
    ln(el, bx0, by0 + 10, bx0 + L * c, by0 + 10 - L * s, IK, 7);
    ln(el, bx0 + L * c, by0 + 10 - L * s, bx0 + L * c + 70, by0 + 10 - L * s, MU, 1.2, "4 3");
    ar(el, bx0 + L * c + 4 * c, by0 + 6 - L * s - 4 * s, bx0 + (L + 60) * c, by0 + 10 - (L + 60) * s); tx(el, bx0 + (L + 60) * c + 4, by0 + 6 - (L + 60) * s, "v", "start", AC);
    tx(el, bx0 + L * c + 30, by0 + 4 - L * s - 2, "α", "middle"); ar(el, 46, 124, 12, 124, VC); tx(el, 24, 116, "V", "middle", VC); return el; }
  // 5. ballistic pendulum: a bullet into a box on a string, the box rises by h
  function figBallistic() { const el = Sx(280, 165, "Ballistik rəqqas: güllə ipdən asılmış yeşiyə dəyir, yeşik h hündürlüyə qalxır"), ox = 140, L = 100, th = 1.0;
    hatch(el, 100, 180, 12, true); ln(el, ox, 12, ox, 12 + L); bx(el, ox - 20, 12 + L, 40, 30, "M");
    const qx = ox + L * Math.sin(th), qy = 12 + L * Math.cos(th); ln(el, ox, 12, qx, qy, MU, 1.5, "4 3"); bx(el, qx - 20, qy, 40, 30, "", "none", "4 3");
    ln(el, ox + 20, 12 + L + 30, 262, 12 + L + 30, MU, 1, "3 3"); ln(el, qx + 20, qy + 30, 262, qy + 30, MU, 1, "3 3");
    ar(el, 256, 12 + L + 30, 256, qy + 31, IK, 1.5); ar(el, 256, qy + 30, 256, 12 + L + 29, IK, 1.5); tx(el, 262, (qy + 30 + 12 + L + 30) / 2 + 5, "h", "start");
    bx(el, 30, 12 + L + 12, 12, 6, "", IK); ar(el, 46, 12 + L + 15, 112, 12 + L + 15); tx(el, 36, 12 + L + 6, "m", "middle"); tx(el, 80, 12 + L + 6, "v ?", "middle", AC); return el; }
  // 6. two balls on strings; ball 1 is lifted by h and released
  function figPend() { const el = Sx(260, 160, "İki kürə iplərdən asılıb; birinci kürə h hündürlüyə qaldırılıb buraxılır"), a = 150, b = 174, L = 115, th = 0.85, y0 = 12 + L;
    hatch(el, 60, 230, 12, true); ln(el, a, 12, a, y0, MU, 1, "4 3"); ln(el, b, 12, b, y0);
    const qx = a - L * Math.sin(th), qy = 12 + L * Math.cos(th); ln(el, a, 12, qx, qy);
    el.append(sv("circle", { cx: r1(qx), cy: r1(qy), r: 12, fill: SF, stroke: IK, "stroke-width": 2 })); tx(el, qx, qy + 5, "m₁", "middle", IK, 11);
    el.append(sv("circle", { cx: a, cy: y0, r: 12, fill: "none", stroke: MU, "stroke-width": 1.2, "stroke-dasharray": "3 3" }));
    el.append(sv("circle", { cx: b, cy: y0, r: 12, fill: SF, stroke: IK, "stroke-width": 2 })); tx(el, b, y0 + 5, "m₂", "middle", IK, 11);
    ln(el, 20, qy, qx - 12, qy, MU, 1, "3 3"); ln(el, 20, y0, a - 12, y0, MU, 1, "3 3");
    ar(el, 30, y0, 30, qy + 1, IK, 1.5); ar(el, 30, qy, 30, y0 - 1, IK, 1.5); tx(el, 36, (qy + y0) / 2 + 5, "h", "start"); return el; }
  // 7. a bullet into a block on a rough floor; the block slides s
  function figSlide() { const el = Sx(270, 165, "Güllə kobud səthdə dayanan bruskaya dəyir, bruska s yolu gedib dayanır"), y = 120;
    hatch(el, 10, 260, y); bx(el, 110, y - 34, 50, 34, "M"); bx(el, 210, y - 34, 50, 34, "", "none", "4 3");
    bx(el, 30, y - 20, 12, 6, "", IK); ar(el, 46, y - 17, 104, y - 17); tx(el, 36, y - 26, "m", "middle"); tx(el, 76, y - 26, "v", "middle", AC);
    tx(el, 185, y - 12, "μ", "middle", MU); ar(el, 110, y + 26, 210, y + 26, IK, 1.5); ar(el, 210, y + 26, 110, y + 26, IK, 1.5); tx(el, 160, y + 42, "s ?", "middle"); return el; }
  // 8. a cart runs into a cart with a spring buffer
  function figBuffer() { const el = Sx(270, 130, "Birinci araba yaylı buferli dayanan ikinci arabaya çatır"), y = 110;
    hatch(el, 10, 260, y + 5); bx(el, 20, 64, 56, 36, "m₁"); wheels(el, 20, 56, 105); bx(el, 186, 64, 64, 36, "m₂"); wheels(el, 186, 64, 105);
    const pts = [[140, 82]]; for (let k = 1; k <= 8; k++) pts.push([140 + k * 5, 82 + (k % 2 ? -8 : 8)]); pts.push([186, 82]); pl(el, pts, IK, 1.8); tx(el, 160, 64, "k", "middle");
    ar(el, 80, 50, 124, 50); tx(el, 102, 42, "v", "middle", AC); return el; }
  // 9. a shell explodes at the top point (height H); both parts fly horizontally
  function figBlast() { const el = Sx(270, 190, "Mərmi ən yüksək nöqtədə iki hissəyə partlayır, hissələr üfüqi uçur"), cx = 130, top = 40, y = 170, D1 = 85, D2 = 50;
    hatch(el, 10, 260, y); ln(el, cx, y, cx, top + 6, MU, 1.2, "4 3"); el.append(sv("circle", { cx, cy: top, r: 4, fill: IK }));
    el.append(sv("path", { d: `M${cx} ${top} Q ${cx + D1 / 2} ${top} ${cx + D1} ${y}`, fill: "none", stroke: MU, "stroke-width": 1.2, "stroke-dasharray": "4 3" }));
    el.append(sv("path", { d: `M${cx} ${top} Q ${cx - D2 / 2} ${top} ${cx - D2} ${y}`, fill: "none", stroke: MU, "stroke-width": 1.2, "stroke-dasharray": "4 3" }));
    ar(el, cx + 5, top, cx + 50, top); tx(el, cx + 28, top - 8, "m₁, v₁", "middle", AC); ar(el, cx - 5, top, cx - 42, top, VC); tx(el, cx - 26, top - 8, "m₂", "middle", VC);
    ar(el, 245, y, 245, top + 1, IK, 1.5); ar(el, 245, top, 245, y - 1, IK, 1.5); ln(el, cx + 6, top, 250, top, MU, 1, "3 3"); tx(el, 252, (top + y) / 2, "H", "start");
    ar(el, cx - D2 + 2, y + 12, cx + D1 - 2, y + 12, IK, 1.2); ar(el, cx + D1 - 2, y + 12, cx - D2 + 2, y + 12, IK, 1.2); tx(el, cx + D1 + 6, y + 16, "d ?", "start"); return el; }
  // 10. x–t graph: body 1 runs into body 2 (standing) at t1, then they move together
  function figXt(t1, x0, tE, xE) { const el = Sx(280, 195, "Koordinatın zamandan asılılıq qrafiki: 1 və 2 cisimləri toqquşub yapışır"), X = t => 40 + t * 24, Y = x => 165 - x * 8;
    for (let t = 1; t <= 9; t++) { ln(el, X(t), 165, X(t), 30, MU, 0.6, "3 3"); tx(el, X(t), 180, String(t), "middle", MU, 11); }
    for (let x = 2; x <= 16; x += 2) { ln(el, 40, Y(x), 262, Y(x), MU, 0.6, "3 3"); tx(el, 34, Y(x) + 4, String(x), "end", MU, 11); }
    ar(el, 40, 165, 272, 165, IK, 1.5); ar(el, 40, 165, 40, 18, IK, 1.5); tx(el, 272, 194, "t, s", "end"); tx(el, 46, 16, "x, m", "start");
    pl(el, [[X(0), Y(0)], [X(t1), Y(x0)]], AC); pl(el, [[X(0), Y(x0)], [X(t1), Y(x0)]], VC); pl(el, [[X(t1), Y(x0)], [X(tE), Y(xE)]], IK);
    tx(el, X(t1 / 2) + 6, Y(x0 / 2) + 14, "1", "start", AC); tx(el, X(t1 / 2), Y(x0) - 6, "2", "middle", VC); tx(el, X(tE) - 4, Y(xE) - 8, "1+2", "end", IK); return el; }

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. F–t graph: impulse = area → speed
    { tip: "qapali", gen: () => again(() => {
      const m = pick([2, 3, 4, 5]), F0 = pick([2, 3, 4, 5, 6, 8, 10, 12]), t1 = pick([1, 2]), t2 = t1 + pick([1, 2, 3]), t3 = t2 + pick([1, 2]);
      if (t3 > 6) return null;
      const S = F0 * (t3 + t2 - t1) / 2, v = S / m, w = [F0 * t3 / m, F0 * (t2 - t1) / m, F0 * t3 / (2 * m), S];
      if (!okn([v, ...w], 2)) return null;
      return mc(ae(v, w, U_("m/s")), { svg: figFt(F0, t1, t2, t3), text: `Hamar üfüqi səthdə dayanan ${m} kq kütləli cismə üfüqi qüvvə təsir edir. Qüvvənin zamandan asılılıq qrafiki şəkildədir, F₀ = ${F0} N. t = ${t3} s anında cismin sürəti nə qədərdir?`,
        solution: `Qüvvənin impulsu qrafikin altındakı sahədir (trapesiya): F₀·(${t3} + ${t2 - t1})/2 = ${F0}·${t3 + t2 - t1}/2 = ${F(S)} N·s. Bu, F_orta·Δt = Δp = mv − 0 → v = ${F(S)}/${m} = ${F(v)} m/s. Tələlər: bütün müddətdə F₀ götürmək (${F(w[0])} m/s), yalnız sabit hissəni saymaq (${F(w[1])} m/s), orta qüvvəni F₀/2 götürmək (${F(w[2])} m/s), impulsu sürət kimi yazmaq (${F(S)}).` });
    }) },
    // 2. oblique bounce from a wall: only the normal component turns (vectors)
    { tip: "qapali", birlesik: "fiz-vektorlar", gen: () => again(() => {
      const c = pick([0.6, 0.8]), s = c === 0.6 ? 0.8 : 0.6, m = pick([0.1, 0.2, 0.4, 0.5]), v = pick([5, 10, 15, 20]), dt = pick([0.01, 0.02, 0.05, 0.1]);
      const f = 2 * m * v * c / dt, w = [2 * m * v / dt, m * v * c / dt, 2 * m * v * s / dt];
      if (!okn([f, ...w], 1)) return null;
      return mc(ae(f, [...w, 0], U_("N")), { svg: figWall(c), text: `Kütləsi ${F(m)} kq olan top ${v} m/s sürətlə hamar divara dəyir və eyni modullu sürətlə əks olunur. Sürət divarın perpendikulyarı ilə α bucağı əmələ gətirir, cos α = ${F(c)}. Hərəkət üfüqi müstəvidə baş verir, ağırlıq qüvvəsinin impulsu nəzərə alınmır. Zərbə ${F(dt)} s davam edir. Divarın topa orta təsir qüvvəsi nə qədərdir?`,
        solution: `Sürəti iki toplanana ayır: divar boyu toplanan dəyişmir, perpendikulyar toplanan v·cos α = ${F(v * c)} m/s işarəsini dəyişir. Δp = 2mv·cos α = 2·${F(m)}·${v}·${F(c)} = ${F(2 * m * v * c)} kq·m/s. F = Δp/Δt = ${F(2 * m * v * c)}/${F(dt)} = ${F(f)} N. Tələlər: bucağı nəzərə almamaq (${F(w[0])} N), 2-ni unutmaq (${F(w[1])} N), sin α götürmək (${F(w[2])} N), "sürətin modulu dəyişmədi, deməli Δp = 0".` });
    }) },
    // 3. cannon on a platform fires at an angle: only the horizontal momentum is conserved
    { tip: "qapali", gen: () => again(() => {
      const [m, M] = pick([[2, 200], [4, 400], [5, 500], [10, 1000], [4, 100], [1, 100], [2, 50], [5, 125], [8, 200], [10, 250], [20, 500]]);
      const c = pick([0.6, 0.8]), s = c === 0.6 ? 0.8 : 0.6, v = pick([100, 150, 200, 250, 300, 400, 500]);
      const V = m * v * c / M, w = [m * v / M, m * v * s / M, v * Math.sqrt(m / M), v * c];
      if (!okn([V, ...w], 3) || V > 20) return null;
      return mc(ae(V, w, U_("m/s")), { svg: figCannon(c), text: `Hamar relslər üzərində dayanan platformaya top bərkidilib; platformanın topla birlikdə kütləsi (mərmisiz) ${M} kq-dır. Topdan kütləsi ${m} kq olan mərmi üfüqlə α bucağı altında, Yerə nəzərən ${v} m/s sürətlə atılır, cos α = ${F(c)}. Platforma hansı sürətlə geri gedir?`,
        solution: `Atəş zamanı relslər platformanı şaquli istiqamətdə saxlayır, ona görə yalnız impulsun üfüqi toplananı saxlanır: 0 = m·v·cos α − M·V → V = ${m}·${v}·${F(c)}/${M} = ${F(V)} m/s. Tələlər: tam impulsu saxlamaq (${F(w[0])} m/s), sin α götürmək (${F(w[1])} m/s), mərmi ilə platformanın kinetik enerjilərini bərabər saymaq (${F(w[2])} m/s), mərminin üfüqi sürətini cavab yazmaq (${F(w[3])} m/s).` });
    }) },
    // 4. head-on inelastic collision: heat
    { tip: "qapali", gen: () => again(() => {
      const m1 = rnd(1, 6), m2 = rnd(1, 6), v1 = rnd(1, 6), v2 = rnd(1, 6), Ms = m1 + m2;
      if (m1 * v1 === m2 * v2 || v1 === v2) return null;
      const V = (m1 * v1 - m2 * v2) / Ms, E0 = (m1 * v1 * v1 + m2 * v2 * v2) / 2, E1 = Ms * V * V / 2, Q = E0 - E1;
      const w = [m1 * m2 * (v1 - v2) ** 2 / (2 * Ms), E0, E1, m1 * (v1 * v1 - V * V) / 2];
      if (!okn([Q, ...w], 2)) return null;
      return mc(ae(Q, w, U_("J")), { svg: col(m1, v1, m2, -v2), text: `Hamar üfüqi relsdə ${m1} kq-lıq araba sağa ${v1} m/s, ${m2} kq-lıq araba sola ${v2} m/s sürətlə bir-birinə doğru gəlir. Toqquşmadan sonra arabalar yapışıb birlikdə hərəkət edir. Toqquşmada nə qədər mexaniki enerji istiliyə çevrilir?`,
        solution: `Sağ müsbət: ${m1}·${v1} − ${m2}·${v2} = ${Ms}·V → V = ${F(V)} m/s. Əvvəl: Ek = ${m1}·${v1 * v1}/2 + ${m2}·${v2 * v2}/2 = ${F(E0)} J. Sonra: ${Ms}·${F(V * V)}/2 = ${F(E1)} J. Q = ${F(E0)} − ${F(E1)} = ${F(Q)} J. Tələlər: sürətlərə işarə verməmək (${F(w[0])} J), ilkin enerjini cavab yazmaq (${F(E0)} J), son enerjini yazmaq (${F(E1)} J), yalnız birinci arabanın enerji dəyişməsini götürmək (${F(w[3])} J).` });
    }) },
    // 5. ballistic pendulum (+ energy conservation)
    { tip: "qapali", birlesik: "fiz-enerji-saxlanma", gen: () => again(() => {
      const mg = pick([5, 10, 20, 25, 50]), k = pick([16, 25, 64, 100, 400]), h = pick([0.05, 0.2, 0.45, 0.8, 1.25]), M = mg * (k - 1) / 1000, V = Math.sqrt(2 * g * h), v = k * V;
      if (!nice(M, 3) || v < 50 || v > 1000) return null;
      const w = [Math.sqrt(k) * V, V, (k - 1) * V, k * 2 * g * h];
      if (!okn([v, ...w], 2)) return null;
      return mc(ae(v, w, U_("m/s")), { svg: figBallistic(), text: `Uzun yüngül ipdən asılmış, kütləsi ${F(M)} kq olan qum yeşiyinə ${mg} q kütləli güllə üfüqi dəyib ilişir. Yeşik (güllə ilə birlikdə) ilkin vəziyyətindən ${F(h)} m hündürlüyə qalxır. Güllənin sürəti nə qədər idi? Hava müqavimətini nəzərə alma.`,
        solution: `1) Qalxma (enerji saxlanır): (m + M)V²/2 = (m + M)gh → V = √(2gh) = √${F(2 * g * h)} = ${F(V)} m/s. 2) Toqquşma (impuls saxlanır): mv = (m + M)V → v = (${F(mg / 1000)} + ${F(M)})·${F(V)}/${F(mg / 1000)} = ${k}·${F(V)} = ${F(v)} m/s. Tələlər: bütün prosesə enerji saxlanmasını yazmaq — toqquşmada enerji itir (${F(w[0])} m/s), V-ni cavab yazmaq (${F(V)} m/s), m + M əvəzinə M (${F(w[2])} m/s), kökü almamaq (${F(w[3])} m/s).` });
    }) },
    // 6. pendulum ball → elastic hit → the second ball rises (+ energy conservation)
    { tip: "qapali", birlesik: "fiz-enerji-saxlanma", gen: () => again(() => {
      const m1 = rnd(1, 6), m2 = rnd(1, 6), h = pick([5, 10, 20, 30, 40, 45, 60, 80, 90]);
      if (m1 === m2) return null;
      const q = 2 * m1 / (m1 + m2), H = h * q * q, w = [h, h * q, h * (m1 / (m1 + m2)) ** 2, h * m1 / m2];
      if (!okn([H, ...w], 2)) return null;
      return mc(ae(H, w, U_("sm")), { svg: figPend(), text: `Eyni uzunluqlu iki yüngül ipdən asılmış kürələr bir-birinə toxunur: m₁ = ${m1 * 100} q, m₂ = ${m2 * 100} q. İplər kifayət qədər uzundur və hərəkət boyu gərilidir. Birinci kürəni ${h} sm hündürlüyə qaldırıb buraxırlar; o, dayanan ikinci kürəyə mərkəzi elastik zərbə ilə dəyir. İkinci kürə hansı hündürlüyə qalxar? Hava müqavimətini nəzərə alma.`,
        solution: `1) m₁gh = m₁v²/2 → v = √(2gh). 2) Elastik zərbə, m₂ dayanır: v₂' = 2m₁v/(m₁ + m₂) = ${fr2(2 * m1, m1 + m2)}·v. 3) Qalxma: H = v₂'²/(2g) = h·(${fr2(2 * m1, m1 + m2)})² = ${h}·${fr2((2 * m1) ** 2, (m1 + m2) ** 2)} = ${F(H)} sm. Tələlər: hündürlükləri əsassız bərabər saymaq, H = h (${F(w[0])} sm; bu yalnız m₁ = m₂-də doğrudur), kvadrata yüksəltməmək (${F(w[1])} sm), yapışma düsturunu yazmaq (${F(w[2])} sm), "enerji tam keçir" saymaq: m₁gh = m₂gH → H = h·m₁/m₂ (${F(w[3])} sm).` });
    }) },
    // 7. bullet into a block on a rough floor → sliding distance (+ friction)
    { tip: "qapali", birlesik: "fiz-surtunme-maili", gen: () => again(() => {
      const T = pick([1, 2, 4, 5]), mg = pick([10, 20, 25, 50]), m = mg / 1000, M = +(T - m).toFixed(3), v = pick([200, 300, 400, 500, 600, 800]), mu = pick([0.1, 0.2, 0.25, 0.4, 0.5]);
      const V = m * v / T, s = V * V / (2 * mu * g); if (!nice(V, 2) || s > 20) return null;
      const w = [V * V / (mu * g), s * T / m, V * V / (2 * g), mu * V * V / (2 * g)];
      if (!okn([s, ...w], 3)) return null;
      return mc(ae(s, w, U_("m")), { svg: figSlide(), text: `Üfüqi səthdə dayanan ${F(M)} kq kütləli taxta bruskaya ${mg} q kütləli güllə ${v} m/s sürətlə üfüqi dəyib ilişir. Bruska ilə səth arasında sürtünmə əmsalı μ = ${F(mu)}. Zərbə çox qısadır. Bruska (güllə ilə birlikdə) dayanana qədər nə qədər yol gedər?`,
        solution: `1) Zərbə qısadır, impuls saxlanır: mv = (m + M)V → V = ${F(m)}·${v}/${T} = ${F(V)} m/s. 2) Sürtünmə: a = μg = ${F(mu * g)} m/s², s = V²/(2μg) = ${F(V * V)}/${F(2 * mu * g)} = ${F(s)} m. Tələlər: 2-ni unutmaq (${F(w[0])} m), güllənin enerjisinin hamısını sürtünməyə vermək — zərbədə enerji itir (${F(w[1])} m), μ-ni unutmaq (${F(w[2])} m), μ-yə bölmək əvəzinə vurmaq (${F(w[3])} m).` });
    }) },
    // 8. spring buffer: from the maximal compression to the spring constant (+ Hooke's law, spring energy kx²/2)
    { tip: "qapali", birlesik: "fiz-huk", gen: () => again(() => {
      const m1 = pick([1, 2, 3, 4, 6]), m2 = pick([1, 2, 3, 4, 6]), v = rnd(1, 6), x = pick([0.05, 0.1, 0.2, 0.25, 0.4, 0.5]);
      const Ms = m1 + m2, V = m1 * v / Ms, E = m1 * m2 * v * v / (2 * Ms), k = 2 * E / (x * x);
      const w = [m1 * v * v / (x * x), Ms * V * V / (x * x), 2 * E / x, E / (x * x)];
      if (!okn([V, E], 3) || !okn([k, ...w], 1) || k < 20 || k > 20000) return null;
      return mc(ae(k, w, U_("N/m")), { svg: figBuffer(), text: `Hamar üfüqi relsdə ${m1} kq-lıq araba ${v} m/s sürətlə gəlib dayanan ${m2} kq-lıq arabaya çatır. İkinci arabanın qabağına yüngül yay bərkidilib; toqquşma zamanı yay ən çox ${F(x * 100)} sm sıxılır. Yayın sərtliyi nə qədərdir? Sürtünmə yoxdur.`,
        solution: `1) Yay ən çox sıxılanda arabaların sürəti eynidir (impuls saxlanır): V = m₁v/(m₁ + m₂) = ${m1}·${v}/${Ms} = ${F(V)} m/s. 2) Enerji: m₁v²/2 = (m₁ + m₂)V²/2 + kx²/2 → kx²/2 = ${F(m1 * v * v / 2)} − ${F(Ms * V * V / 2)} = ${F(E)} J. 3) x = ${F(x)} m: k = 2·${F(E)}/${F(x * x)} = ${F(k)} N/m. Tələlər: bütün kinetik enerjini yaya vermək (${F(w[0])} N/m), son enerjini yaya vermək (${F(w[1])} N/m), x-i kvadrata yüksəltməmək (${F(w[2])} N/m), yayın enerjisini kx² yazmaq (${F(w[3])} N/m).` });
    }) },
    // 9. explosion at the top point → distance between landing points (+ free fall)
    { tip: "qapali", birlesik: "fiz-serbest-dusme", gen: () => again(() => {
      const H = pick([5, 20, 45, 80, 125]), t = Math.sqrt(2 * H / g), m1 = rnd(1, 6), m2 = rnd(1, 6), v1 = pick([5, 10, 15, 20, 30, 40]);
      if (m1 === m2) return null;
      const v2 = m1 * v1 / m2, d = (v1 + v2) * t, w = [v1 * t, v2 * t, 2 * v1 * t, Math.abs(v1 - v2) * t];
      if (!okn([v2, d, ...w], 2) || d > 1000) return null;
      return mc(ae(d, w, U_("m")), { svg: figBlast(), text: `Şaquli yuxarı atılan mərmi ən yüksək nöqtədə, yerdən ${H} m hündürlükdə iki hissəyə partlayır. Kütləsi ${m1} kq olan hissə üfüqi istiqamətdə ${v1} m/s sürətlə uçur, ${m2} kq-lıq hissə də üfüqi uçur. Hissələrin yerə düşdüyü nöqtələr arasındakı məsafə nə qədərdir? Şəkil miqyassızdır. Hava müqavimətini nəzərə alma, g = 10 m/s².`,
        solution: `1) Ən yüksək nöqtədə sürət 0: 0 = m₁v₁ − m₂v₂ → v₂ = ${m1}·${v1}/${m2} = ${F(v2)} m/s, əks tərəfə. 2) Hər iki hissə üfüqi atılır, düşmə vaxtı eynidir: t = √(2H/g) = ${F(t)} s. 3) d = (v₁ + v₂)·t = ${F(v1 + v2)}·${F(t)} = ${F(d)} m. Tələlər: yalnız bir hissənin uçuşu (${F(w[0])} m və ya ${F(w[1])} m), sürətləri bərabər saymaq (${F(w[2])} m), hissələri eyni tərəfə göndərmək (${F(w[3])} m).` });
    }) },
    // 10. x–t graph before and after the collision → the second mass (+ kinematics)
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const xtOpts = []; // yalnız qrafikdə dəqiq oxunan (cüt tam x) kombinasiyalar
      for (const t1 of [2, 3, 4]) for (const v1 of [1, 2, 3, 4]) for (const V of [0.5, 1, 1.5, 2]) for (const tE of [6, 7, 8, 9]) {
        const x0 = v1 * t1, xE = x0 + V * (tE - t1);
        if (V < v1 && x0 % 2 === 0 && x0 <= 12 && xE % 2 === 0 && xE <= 16) xtOpts.push([t1, v1, V, tE, x0, xE]);
      }
      const [t1, v1, V, tE, x0, xE] = pick(xtOpts), m1 = rnd(1, 5);
      const Va = xE / tE, m2 = m1 * (v1 - V) / V, w = [m1 * v1 / V, m1 * V / (v1 - V), m1 * (v1 + V) / V, m1 * (v1 - Va) / Va];
      if (!okn([m2, ...w], 2)) return null;
      return mc(ae(m2, w, U_("kq")), { svg: figXt(t1, x0, tE, xE), text: `Hamar üfüqi səthdə iki cisim bir düz xətt boyunca hərəkət edir. Qrafikdə onların koordinatının zamandan asılılığı verilib: 1-ci cisim dayanan 2-ci cismə çatır, onlar yapışır və sonra birlikdə hərəkət edir (1+2). 1-ci cismin kütləsi ${m1} kq-dır. 2-ci cismin kütləsi nə qədərdir?`,
        solution: `Qrafikdən sürətlər (meyl): v₁ = ${x0}/${t1} = ${F(v1)} m/s, birlikdə V = (${F(xE)} − ${x0})/(${tE} − ${t1}) = ${F(V)} m/s. İmpuls: m₁v₁ = (m₁ + m₂)V → m₂ = m₁(v₁ − V)/V = ${m1}·${F(v1 - V)}/${F(V)} = ${F(m2)} kq. Tələlər: sonra yalnız m₂ hərəkət edir saymaq (${F(w[0])} kq), nisbəti tərsinə yazmaq (${F(w[1])} kq), v₁ + V yazmaq (${F(w[2])} kq), birgə sürəti meyl yerinə x/t = ${F(xE)}/${tE} kimi oxumaq (${F(w[3])} kq).` });
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
      key: "fiz-impuls", title: "İmpuls və onun saxlanması, toqquşmalar", fenn: "fizika", link: "dersler/fiz-impuls.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: kq·m/s, m/s, N, J). Onluq kəsr vergül və ya nöqtə ilə: 0,25. Mənfi cavabda − işarəsini yaz. g = 10 m/s².",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["impuls", "impuls", "saxlanma", "saxlanma", "qeyri", "qeyri", "elastik", "itki", "itki", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-impuls.html")) b.push("dersler/fiz-impuls.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
