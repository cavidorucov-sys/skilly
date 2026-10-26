// Fizika · İşığın qayıtması və sınması — mastery game levels (reflection, plane mirror, rotating / two mirrors,
// refraction with given sines, n = c/v, total internal reflection) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units, c = 3·10⁸ m/s.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");          // 0.04 → "0,04"
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;        // v has at most d decimals
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const DEG = Math.PI / 180;
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const INK = "#17171a", RED = "#a32d2d", BLUE = "#2a5db0", MUTE = "#8a8a92";

  // ---------- SVG helpers ----------
  function head(g, x, y, dx, dy, col) {                // arrow head with the tip at (x, y), direction (dx, dy)
    const L = Math.hypot(dx, dy); dx /= L; dy /= L;
    const bx = x - dx * 9, by = y - dy * 9;
    g.append(sv("polygon", { points: `${x},${y} ${bx - dy * 4},${by + dx * 4} ${bx + dy * 4},${by - dx * 4}`, fill: col }));
  }
  function ray(g, x1, y1, x2, y2, col) {               // a ray with an arrow head in the middle
    g.append(sv("line", { x1, y1, x2, y2, stroke: col, "stroke-width": 2.5, "stroke-linecap": "round" }));
    head(g, (x1 + x2) / 2 + (x2 - x1) * .12, (y1 + y2) / 2 + (y2 - y1) * .12, x2 - x1, y2 - y1, col);
  }
  function dash(g, x1, y1, x2, y2) { g.append(sv("line", { x1, y1, x2, y2, stroke: MUTE, "stroke-width": 1.5, "stroke-dasharray": "5 4" })); }
  function txt(g, x, y, s) { g.append(sv("text", { x, y: y + 4, "text-anchor": "middle", class: "oy-lbl" }, s)); }

  // plane mirror at the bottom, normal dashed. theta = angle from the normal. mode "n": α marked from the normal; "s": γ marked from the mirror surface.
  function reflSvg(theta, mode, gamma) {
    const g = sv("svg", { viewBox: "0 0 260 175", class: "oy-svg", role: "img", "aria-label": "Müstəvi güzgüdən şüanın qayıtması" });
    const ox = 130, oy = 130, L = 105, a = Math.random() < .5 ? 1 : -1, st = Math.sin(theta * DEG), ct = Math.cos(theta * DEG);
    g.append(sv("line", { x1: 30, y1: oy, x2: 230, y2: oy, stroke: INK, "stroke-width": 3 }));
    for (let x = 40; x <= 230; x += 12) g.append(sv("line", { x1: x, y1: oy, x2: x - 8, y2: oy + 10, stroke: INK, "stroke-width": 1.2 }));
    dash(g, ox, oy, ox, 22);
    ray(g, ox + a * st * L, oy - ct * L, ox, oy, RED);
    ray(g, ox, oy, ox - a * st * L, oy - ct * L, BLUE);
    const r = 30;
    if (mode === "n") {
      for (const side of [a, -a]) {
        const sw = side > 0 ? 1 : 0;
        g.append(sv("path", { d: `M${ox} ${oy - r}A${r} ${r} 0 0 ${sw} ${ox + side * r * st} ${oy - r * ct}`, fill: "none", stroke: INK, "stroke-width": 1.4 }));
        txt(g, ox + side * 46 * Math.sin(theta * DEG / 2), oy - 46 * Math.cos(theta * DEG / 2), side === a ? "α" : "α′");
      }
    } else {
      const gm = gamma * DEG, sw = a > 0 ? 0 : 1;
      g.append(sv("path", { d: `M${ox + a * r} ${oy}A${r} ${r} 0 0 ${sw} ${ox + a * r * Math.cos(gm)} ${oy - r * Math.sin(gm)}`, fill: "none", stroke: INK, "stroke-width": 1.4 }));
      txt(g, ox + a * 47 * Math.cos(gm / 2), oy - 47 * Math.sin(gm / 2) + (gamma < 25 ? -4 : 0), "γ");
    }
    return g;
  }

  // refraction at a horizontal interface; angles drawn to scale from the given sines
  function refrSvg(sa, sb) {
    const g = sv("svg", { viewBox: "0 0 260 200", class: "oy-svg", role: "img", "aria-label": "Şüanın iki mühitin sərhəddində sınması" });
    const ox = 130, oy = 100, L = 85, a = Math.random() < .5 ? 1 : -1, A = Math.asin(sa), B = Math.asin(sb);
    g.append(sv("rect", { x: 20, y: oy, width: 220, height: 85, fill: "rgba(42,93,176,.10)" }));
    g.append(sv("line", { x1: 20, y1: oy, x2: 240, y2: oy, stroke: INK, "stroke-width": 2.5 }));
    dash(g, ox, 15, ox, 185);
    ray(g, ox + a * Math.sin(A) * L, oy - Math.cos(A) * L, ox, oy, RED);
    ray(g, ox, oy, ox - a * Math.sin(B) * L, oy + Math.cos(B) * L, BLUE);
    txt(g, 38, 30, "n₁"); txt(g, 38, 170, "n₂");
    txt(g, ox + a * 28, oy - 40, "α"); txt(g, ox - a * 22, oy + 52, "β");
    return g;
  }

  // ---------- number pools ----------
  const N = [1, 1.2, 1.25, 1.5, 1.6, 2, 2.4, 2.5, 3];                        // refractive indices with whole-number-ish speeds
  const SPEED = n => +(3 / n).toFixed(6);                                    // in 10⁸ m/s
  const SINS = [0.5, 0.6, 0.8];
  const PAIRS_T = [];                                                         // n₁ > n₂ with a nice critical sine n₂/n₁
  for (const n1 of N) for (const n2 of N) if (n1 > n2 && nice(n2 / n1, 3)) PAIRS_T.push([n1, n2, +(n2 / n1).toFixed(6)]);

  const levels = [
    { id: "qayit", ad: "Qayıtma qanunu və müstəvi güzgü", izah: "Əks olunma bucağı = düşmə bucağı, hər ikisi normaldan ölçülür. Müstəvi güzgüdə xəyal güzgünün arxasında, cisimlə eyni məsafədə olur.",
      gen() {
        const kind = pick(["ang", "surf", "surf", "dist", "approach", "mirmove", "boy", "alt", "ust"]);
        if (kind === "ang") {
          const al = rnd(2, 16) * 5;
          return R(2 * al, "°", { svg: reflSvg(al, "n"), text: `Şüa müstəvi güzgüyə düşmə bucağı α = ${al}° ilə düşür. Düşən və əks olunmuş şüalar arasındakı bucaq neçə dərəcədir?`,
            solution: `Əks olunma bucağı düşmə bucağına bərabərdir: α′ = α = ${al}°. Şüalar arasındakı bucaq α + α′ = ${al} + ${al} = ${2 * al}°.` });
        }
        if (kind === "surf") {
          const ga = rnd(2, 16) * 5, al = 90 - ga;
          if (Math.random() < .5)
            return R(al, "°", { svg: reflSvg(al, "s", ga), text: `Şüa güzgünün səthi ilə γ = ${ga}° bucaq əmələ gətirərək düşür. Əks olunma bucağı (normaldan ölçülür) neçə dərəcədir?`,
              solution: `Düşmə bucağı normaldan ölçülür: α = 90° − ${ga}° = ${al}°. Əks olunma bucağı ona bərabərdir: ${al}°.` });
          return R(2 * al, "°", { svg: reflSvg(al, "s", ga), text: `Şüa güzgünün səthi ilə γ = ${ga}° bucaq əmələ gətirərək düşür. Düşən və əks olunmuş şüalar arasındakı bucaq neçə dərəcədir?`,
            solution: `α = 90° − ${ga}° = ${al}° (normaldan). Əks olunma bucağı da ${al}°-dir. Şüalar arasında 2α = ${2 * al}°.` });
        }
        if (kind === "dist") {
          const d = pick([0.5, 0.8, 1, 1.2, 1.5, 2, 2.5, 3, 4]);
          return R(2 * d, "m", { text: `Cisim müstəvi güzgüdən ${F(d)} m məsafədədir. Cisimlə onun xəyalı arasındakı məsafə neçə metrdir?`,
            solution: `Xəyal güzgünün arxasında, eyni ${F(d)} m məsafədədir. Cisimlə xəyal arasında ${F(d)} + ${F(d)} = ${F(2 * d)} m.` });
        }
        if (kind === "approach") {
          const v = pick([0.5, 1, 1.2, 1.5, 2, 2.5, 3]);
          return R(2 * v, "m/s", { text: `Adam müstəvi güzgüyə ${F(v)} m/s sürətlə yaxınlaşır. Adamla onun xəyalı arasındakı məsafə hansı sürətlə azalır?`,
            solution: `Adam güzgüyə ${F(v)} m/s ilə yaxınlaşır, xəyal da güzgüyə eyni sürətlə yaxınlaşır. Aralarındakı məsafə ${F(v)} + ${F(v)} = ${F(2 * v)} m/s sürətlə azalır.` });
        }
        if (kind === "mirmove") {
          const v = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]);
          return R(2 * v, "m/s", { text: `Güzgü sabit cisimdən öz müstəvisinə perpendikulyar istiqamətdə ${F(v)} m/s sürətlə uzaqlaşır. Cismin xəyalı Yerə nəzərən hansı sürətlə hərəkət edir?`,
            solution: `Cisimdən güzgüyə qədər məsafə d olsa, xəyal cisimdən 2d məsafədədir. d hər saniyə ${F(v)} m artırsa, 2d hər saniyə ${F(2 * v)} m artır. Xəyalın sürəti ${F(2 * v)} m/s.` });
        }
        if (kind === "boy") {
          const H = pick([1.0, 1.2, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9]);
          return R(H / 2, "m", { text: `Boyu ${F(H)} m olan adam divardakı güzgüdə özünü başdan ayağa tam görmək istəyir. Güzgünün minimal hündürlüyü neçə metr olmalıdır?`,
            solution: `Minimal hündürlük adamın boyunun yarısıdır və adamın güzgüdən məsafəsindən asılı deyil: ${F(H)}/2 = ${F(H / 2)} m.` });
        }
        if (kind === "alt") {
          const e = pick([1.2, 1.4, 1.5, 1.6, 1.7]);
          return R(e / 2, "m", { text: `Adamın gözləri yerdən ${F(e)} m hündürlükdədir. Güzgü şaquli divardadır. Adam ayaqlarının xəyalını görmək üçün güzgünün aşağı kənarı yerdən ən çoxu neçə metr hündürlükdə ola bilər?`,
            solution: `Ayaqların xəyalı yerin səviyyəsində, güzgünün arxasındadır. Göz ilə xəyalı birləşdirən düz xətt güzgünü tən ortada, yəni ${F(e)}/2 = ${F(e / 2)} m hündürlükdə kəsir.` });
        }
        const H = pick([1.6, 1.7, 1.8, 1.9]), e = +(H - 0.1).toFixed(2);
        return R((H + e) / 2, "m", { text: `Adamın boyu ${F(H)} m, gözləri yerdən ${F(e)} m hündürlükdədir. Güzgü şaquli divardadır. Başının üst nöqtəsinin xəyalını görmək üçün güzgünün yuxarı kənarı yerdən ən azı neçə metr hündürlükdə olmalıdır?`,
          solution: `Göz ilə başın üstünün xəyalını birləşdirən xətt güzgünü gözlə baş arasının ortasında kəsir: (${F(H)} + ${F(e)})/2 = ${F((H + e) / 2)} m.` });
      } },
    { id: "donme", ad: "Dönən güzgü, iki güzgü", izah: "Güzgü φ dönəndə əks olunmuş şüa 2φ dönür. Bir-biri ilə β bucağı əmələ gətirən iki güzgüdə şüa 2β dönür. Cisim güzgülər arasındakı bucağın tənböləni üzərindədirsə və 360°/β tam ədəddirsə, xəyalların sayı 360°/β − 1.",
      gen() {
        const kind = pick(["d1", "d1", "d2", "d3", "iki", "iki", "betw", "say"]);
        if (kind === "d1") {
          const f = rnd(1, 9) * 5;
          return R(2 * f, "°", { text: `Müstəvi güzgüyə sabit istiqamətli şüa düşür. Güzgünü düşmə nöqtəsindən keçən və şüaların yatdığı müstəviyə perpendikulyar ox ətrafında ${f}° döndərdilər. Əks olunmuş şüa neçə dərəcə dönər?`,
            solution: `Güzgü φ dönəndə normal da φ dönür, düşmə bucağı φ dəyişir. Əks olunma bucağı da φ dəyişir, ona görə əks olunmuş şüa 2φ = 2·${f} = ${2 * f}° dönür.` });
        }
        if (kind === "d2") {
          const f = rnd(1, 9) * 5;
          return R(f, "°", { text: `Müstəvi güzgüyə sabit istiqamətli şüa düşür. Güzgünü oxu ətrafında döndərəndə əks olunmuş şüa ${2 * f}° döndü. Güzgü neçə dərəcə dönüb?`,
            solution: `Əks olunmuş şüa güzgünün dönməsindən 2 dəfə çox dönür. Güzgü ${2 * f}/2 = ${f}° dönüb.` });
        }
        if (kind === "d3") {
          const w = pick([2, 3, 4, 5, 6, 8, 10, 12, 15]);
          return R(2 * w, "°/s", { text: `Müstəvi güzgü bərabər sürətlə fırlanır: hər saniyədə ${w}° dönür. Düşən şüa sabitdir. Əks olunmuş şüa hər saniyədə neçə dərəcə dönür?`,
            solution: `Əks olunmuş şüa güzgüdən 2 dəfə tez dönür: 2·${w} = ${2 * w}° hər saniyə.` });
        }
        if (kind === "iki") {
          const al = rnd(2, 16) * 5, be = 90 - al;
          return R(be, "°", { text: `İki müstəvi güzgü bir-birinə perpendikulyardır. Şüa güzgülərin kəsişmə xəttinə perpendikulyar müstəvidə yayılır, birinci güzgüyə düşmə bucağı ${al}°-dir və sonra şüa ikinci güzgüdən də əks olunur. İkinci güzgüdə düşmə bucağı neçə dərəcədir?`,
            solution: `Birinci güzgünün normalı ikinci güzgüyə paraleldir. Birinci əksolunmadan sonra şüa öz normalı ilə ${al}° əmələ gətirir, deməli ikinci güzgünün səthi ilə də ${al}°. Düşmə bucağı normaldan ölçülür: 90° − ${al}° = ${be}°.` });
        }
        if (kind === "betw") {
          const b = rnd(2, 8) * 10;
          return R(2 * b, "°", { text: `Aralarındakı bucaq ${b}° olan iki müstəvi güzgü var. Güzgülərin kəsişmə xəttinə perpendikulyar müstəvidə yayılan şüa əvvəlcə bir güzgüdən, sonra o birindən əks olunur. Çıxan şüa ilə ilkin şüa arasındakı bucaq neçə dərəcədir?`,
            solution: `İki əksolunmadan sonra şüa güzgülər arasındakı bucağın 2 mislinə bərabər bucaq qədər dönür: 2·${b} = ${2 * b}°.` });
        }
        const b = pick([90, 60, 45, 40, 36, 30, 72, 120]);
        return R(360 / b - 1, "", { text: `Aralarındakı bucaq ${b}° olan iki müstəvi güzgünün arasına kiçik cisim güzgülər arasındakı bucağın tənböləni üzərində qoyulub. Neçə xəyal görünür?`,
          solution: `Xəyalların sayı 360°/β − 1 = 360/${b} − 1 = ${360 / b} − 1 = ${360 / b - 1}.` });
      } },
    { id: "sinma", ad: "Sınma qanunu, sındırma əmsalı", izah: "n₁ sin α = n₂ sin β. n = c/v, c = 3·10⁸ m/s. Sıxlığı böyük mühitə (n böyük) keçəndə şüa normala yaxınlaşır.",
      gen() {
        const kind = pick(["nv", "nv2", "sb", "sb", "n2", "ratio", "perp", "qual"]);
        if (kind === "nv") {
          const n = pick(N.slice(1)), v = SPEED(n);
          return R(v, "·10⁸ m/s", { text: `Mühitin sındırma əmsalı ${F(n)}-dir. İşığın bu mühitdəki sürəti neçə 10⁸ m/s-dir? (c = 3·10⁸ m/s)`,
            solution: `v = c/n = 3·10⁸/${F(n)} = ${F(v)}·10⁸ m/s.` });
        }
        if (kind === "nv2") {
          const n = pick(N.slice(1)), v = SPEED(n);
          return R(n, "", { text: `İşığın şəffaf mühitdəki sürəti ${F(v)}·10⁸ m/s-dir. Mühitin sındırma əmsalı nə qədərdir? (c = 3·10⁸ m/s)`,
            solution: `n = c/v = 3·10⁸/(${F(v)}·10⁸) = 3/${F(v)} = ${F(n)}.` });
        }
        if (kind === "sb" || kind === "n2" || kind === "ratio") {
          for (;;) {
            const n1 = pick(N), n2 = pick(N), sa = pick(SINS), sb = +(n1 * sa / n2).toFixed(6);
            if (n1 === n2 || !nice(sb, 3) || sb >= 0.99 || sb < 0.2) continue;
            if (kind === "sb") {
              return R(sb, "", { svg: refrSvg(sa, sb), text: `Şüa sındırma əmsalı n₁ = ${F(n1)} olan mühitdən sındırma əmsalı n₂ = ${F(n2)} olan mühitə keçir. Düşmə bucağının sinusu sin α = ${F(sa)}. Sınma bucağının sinusu sin β nə qədərdir?`,
                solution: `n₁ sin α = n₂ sin β → sin β = n₁ sin α / n₂ = ${F(n1)}·${F(sa)}/${F(n2)} = ${F(sb)}.` });
            }
            if (kind === "n2") {
              return R(n2, "", { svg: refrSvg(sa, sb), text: `Şüa n₁ = ${F(n1)} olan mühitdən naməlum n₂ olan mühitə keçir. sin α = ${F(sa)}, sin β = ${F(sb)}. n₂ nə qədərdir?`,
                solution: `n₂ = n₁ sin α / sin β = ${F(n1)}·${F(sa)}/${F(sb)} = ${F(n2)}.` });
            }
            const v1 = SPEED(n1), v2 = SPEED(n2);
            return R(sb, "", { svg: refrSvg(sa, sb), text: `Şüa işığın sürəti ${F(v1)}·10⁸ m/s olan mühitdən sürəti ${F(v2)}·10⁸ m/s olan mühitə keçir. Düşmə bucağının sinusu ${F(sa)}-dir. Sınma bucağının sinusu nə qədərdir? (c = 3·10⁸ m/s)`,
              solution: `n = c/v: n₁ = 3/${F(v1)} = ${F(n1)}, n₂ = 3/${F(v2)} = ${F(n2)}. sin β = n₁ sin α / n₂ = ${F(n1)}·${F(sa)}/${F(n2)} = ${F(sb)}.` });
          }
        }
        if (kind === "perp") {
          if (Math.random() < .5)
            return { answer: 4 / 3, show: "4/3", tol: 0.005, placeholder: "məs. 3/5", text: "Şüa havadan (n = 1) şəffaf mayeyə düşür. Əks olunmuş və sınmış şüalar bir-birinə perpendikulyardır, düşmə bucağının sinusu sin α = 0,8. Mayenin sındırma əmsalı nə qədərdir? Cavabı kəsr və ya onluq yaz.",
              solution: `Əks olunma bucağı α, sınma bucağı β: α + 90° + β = 180° → β = 90° − α, sin β = cos α = 0,6 (sin α = 0,8 olduğundan). 1·sin α = n sin β → n = 0,8/0,6 = 4/3.` };
          const s = pick([0.6, 0.8]), c = s === 0.6 ? 0.8 : 0.6;
          return R(c, "", { text: `Şüa iki mühitin sərhəddində həm əks olunur, həm sınır; əks olunmuş və sınmış şüalar bir-birinə perpendikulyardır. Düşmə bucağının sinusu ${F(s)}-dir. Sınma bucağının sinusu nə qədərdir?`,
            solution: `Əks olunma bucağı α, sınma bucağı β: α + 90° + β = 180°, yəni β = 90° − α. Onda sin β = cos α = ${F(c)} (sin α = ${F(s)} olduğundan).` });
        }
        let n1, n2; do { n1 = pick(N); n2 = pick(N); } while (n1 === n2);
        const names = ["Normala yaxınlaşır", "Normaldan uzaqlaşır", "Sınmadan düz keçir"], ok = n2 > n1 ? 0 : 1;
        return { text: `Şüa sındırma əmsalı ${F(n1)} olan mühitdən sındırma əmsalı ${F(n2)} olan mühitə mail bucaq altında keçir. Sınan şüa normala nəzərən necə yerləşir?`,
          choices: names, correct: ok, show: names[ok], solution: `n ${n2 > n1 ? "artır" : "azalır"} (${F(n1)} → ${F(n2)}), deməli sin β ${n2 > n1 ? "sin α-dan kiçikdir" : "sin α-dan böyükdür"}: şüa ${n2 > n1 ? "normala yaxınlaşır" : "normaldan uzaqlaşır"}.` };
      } },
    { id: "tam", ad: "Tam daxili qayıtma, görünən dərinlik", izah: "Həddi bucaq: sin α₀ = n₂/n₁ (n₁ > n₂). Düşmə bucağı α₀-dan böyükdürsə, şüa ikinci mühitə keçmir. Düz yuxarıdan baxanda dərinlik n dəfə az görünür: h′ = h/n.",
      gen() {
        const kind = pick(["sin", "sin", "ang", "n1", "disk", "dep", "dep", "tamqay", "tamqay"]);
        if (kind === "sin") {
          const [n1, n2, s] = pick(PAIRS_T);
          return R(s, "", { text: `İşıq sındırma əmsalı ${F(n1)} olan mühitdən sındırma əmsalı ${F(n2)} olan mühitə keçir. Tam daxili qayıtmanın həddi bucağının sinusu sin α₀ nə qədərdir?`,
            solution: `sin α₀ = n₂/n₁ = ${F(n2)}/${F(n1)} = ${F(s)}.` });
        }
        if (kind === "ang") {
          const [n1, n2] = pick([[2, 1], [2.4, 1.2], [3, 1.5], [2, 1]]);
          return R(30, "°", { text: `İşıq sındırma əmsalı ${F(n1)} olan mühitdən sındırma əmsalı ${F(n2)} olan mühitə keçir. Tam daxili qayıtmanın həddi bucağı neçə dərəcədir?`,
            solution: `sin α₀ = n₂/n₁ = ${F(n2)}/${F(n1)} = 0,5 → α₀ = 30°.` });
        }
        if (kind === "n1") {
          const s = pick([0.5, 0.8, 0.4, 0.25, 0.2, 0.625]), n = +(1 / s).toFixed(6);
          return R(n, "", { text: `Şəffaf maddədən havaya (n = 1) çıxan işığın tam daxili qayıtmasının həddi bucağının sinusu ${F(s)}-dir. Maddənin sındırma əmsalı nə qədərdir?`,
            solution: `sin α₀ = 1/n → n = 1/${F(s)} = ${F(n)}.` });
        }
        if (kind === "disk") {
          const o = pick([{ n: 1.25, nT: "1,25", s: 0.8, c: 0.6, t: "4/3", hs: [0.3, 0.6, 0.9, 1.2, 1.5, 1.8, 2.4, 3], k: 4 / 3 }, { n: 5 / 3, nT: "5/3", s: 0.6, c: 0.8, t: "3/4", hs: [0.4, 0.8, 1.2, 1.6, 2, 2.4, 3.2, 4], k: 0.75 }]);
          const hh = pick(o.hs), r = +(hh * o.k).toFixed(6);
          return R(r, "m", { text: `Sındırma əmsalı ${o.nT} olan mayenin dibində, səthdən ${F(hh)} m dərinlikdə nöqtəvi işıq mənbəyi var. Mayenin üstü havadır (n = 1). Səthdə işığın havaya çıxdığı dairənin radiusu neçə metrdir?`,
            solution: `Dairənin kənarında şüa həddi bucaqla düşür: sin α₀ = 1/n = ${F(o.s)}, cos α₀ = ${F(o.c)}, tg α₀ = ${o.t}. R = h·tg α₀ = ${F(hh)}·${o.t} = ${F(r)} m.` });
        }
        if (kind === "dep") {
          for (;;) {
            const o = pick([["4/3", 4 / 3, "su"], ["1,5", 1.5, "şüşə"], ["2", 2, "maye"], ["1,25", 1.25, "maye"]]), hh = pick([0.6, 0.9, 1.2, 1.5, 1.8, 2, 2.4, 3, 3.6, 4, 4.5, 6]), d = +(hh / o[1]).toFixed(6);
            if (!nice(d, 3)) continue;
            return R(d, "m", { text: `Düz yuxarıdan baxanda ${o[2] === "şüşə" ? "qalınlığı" : "dərinliyi"} ${F(hh)} m olan ${o[2] === "su" ? "su qatının" : o[2] === "şüşə" ? "şüşə lövhənin" : "mayenin"} (n = ${o[0]}) dibi nə qədər dərinlikdə görünür? Cavabı metrlə yaz.`,
              solution: `Normala yaxın şüalar üçün görünən dərinlik h′ = h/n = ${F(hh)}/${o[0]} = ${F(d)} m.` });
          }
        }
        const [n1, n2, s0] = pick(PAIRS_T.filter(p => p[2] >= 0.4 && p[2] <= 0.8));
        let sa = pick([0.5, 0.6, 0.7, 0.8, 0.9]); if (Math.random() < .25) sa = s0;
        const names = ["Tam daxili qayıtma baş verir", "Şüa sınaraq ikinci mühitə keçir", "Şüa sərhəd boyunca sürüşür (sınma bucağı 90°)"], ok = sa > s0 + 1e-9 ? 0 : sa < s0 - 1e-9 ? 1 : 2;
        return { text: `Şüa sındırma əmsalı ${F(n1)} olan mühitdən sındırma əmsalı ${F(n2)} olan mühitə düşür. Düşmə bucağının sinusu ${F(sa)}-dir. Nə baş verir?`,
          choices: names, correct: ok, show: names[ok],
          solution: `Həddi bucağın sinusu sin α₀ = ${F(n2)}/${F(n1)} = ${F(s0)}. Verilmiş sin α = ${F(sa)} ${ok === 0 ? "ondan böyükdür — tam daxili qayıtma." : ok === 1 ? "ondan kiçikdir — şüa sınaraq keçir." : "ona bərabərdir — sərhəd hal: sınma bucağı 90°."}` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .6) {
          let n2, sa, sb; do { n2 = pick([1.2, 1.25, 1.5, 1.6, 2, 2.4, 2.5, 3]); sa = pick([0.6, 0.8, 0.5]); sb = +(sa / n2).toFixed(6); } while (!nice(sb, 3));
          const wrong = +(sa * n2).toFixed(6);
          task = `Şüa havadan (n₁ = 1) sındırma əmsalı n₂ = ${F(n2)} olan şəffaf mühitə düşür, sin α = ${F(sa)}. sin β = ?`;
          steps = [`Sınma qanunu: n₁ sin α = n₂ sin β.`, `Buradan sin β = n₁ sin α / n₂.`, `sin β = 1·${F(sa)}/${F(n2)} = ${F(sb)}.`];
          if (bad === 0) steps = [`Sınma qanunu: n₂ sin α = n₁ sin β.`, `Buradan sin β = n₂ sin α / n₁.`, `sin β = ${F(n2)}·${F(sa)}/1 = ${F(wrong)}.`];
          if (bad === 1) { steps[1] = `Buradan sin β = n₁ sin α · n₂.`; steps[2] = `sin β = 1·${F(sa)}·${F(n2)} = ${F(wrong)}.`; }
          if (bad === 2) steps[2] = `sin β = 1·${F(sa)}/${F(n2)} = ${F(wrong)}.`;
          why = [`1-ci addım: qanun n₁ sin α = n₂ sin β-dir (indeksi olan mühit həmin bucağın sinusu ilə). Düz cavab: ${F(sb)}.`,
            `2-ci addım: n₂ sin β = n₁ sin α-dan sin β = n₁ sin α / n₂ alınır, n₂-yə bölünür. Düz cavab: ${F(sb)}.`,
            `3-cü addım: ${F(sa)}/${F(n2)} = ${F(sb)}, ${F(wrong)} deyil. Mühit sıxdır, şüa normala yaxınlaşır, sin β < sin α olmalıdır.`][bad];
        } else {
          const f = rnd(1, 8) * 5, tw = 2 * f;
          task = `Müstəvi güzgüyə düşən şüanın istiqaməti sabitdir. Güzgünü ${f}° döndərdilər. Əks olunmuş şüa neçə dərəcə dönür?`;
          steps = [`Güzgü ${f}° dönəndə normal da ${f}° dönür, düşmə bucağı ${f}° dəyişir.`, `Əks olunma bucağı da ${f}° dəyişir, şüa ümumilikdə 2φ qədər dönür.`, `2φ = 2·${f} = ${tw}°.`];
          if (bad === 0) steps[0] = `Güzgü ${f}° dönəndə düşən şüa da ${f}° dönür, düşmə bucağı dəyişmir.`;
          if (bad === 1) steps[1] = `Əks olunma bucağı düşmə bucağına bərabərdir, ona görə şüa yalnız φ qədər dönür.`;
          if (bad === 1) steps[2] = `φ = ${f}°.`;
          if (bad === 2) steps[2] = `2φ = 2·${f} = ${tw + 10}°.`;
          why = [`1-ci addım: düşən şüa sabitdir, dönən güzgüdür. Normal dönür, düşmə bucağı ${f}° dəyişir. Düz cavab: ${tw}°.`,
            `2-ci addım: düşmə də, əks olunma da ${f}° dəyişir, şüa 2φ dönür. Düz cavab: ${tw}°.`,
            `3-cü addım: 2·${f} = ${tw}°, ${tw + 10}° deyil.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Güzgü, hovuz, almaz, optik lif, Aya göndərilən lazer — hamısı qayıtma və sınma qanunlarıdır.",
      gen() {
        const kind = pick(["gozgu", "boy", "hovuz", "elmas", "lif", "gunes", "ay", "disk"]);
        if (kind === "gozgu") {
          const v = pick([1, 1.2, 1.5, 2]);
          return R(2 * v, "m/s", { text: `Elvin zalda böyük güzgüyə ${F(v)} m/s sürətlə yaxınlaşır. Özü ilə güzgüdəki xəyalı arasındakı məsafə hansı sürətlə azalır?`,
            solution: `Xəyal Elvinlə eyni sürətlə güzgüyə yaxınlaşır. Aralarındakı məsafə hər saniyə ${F(v)} + ${F(v)} = ${F(2 * v)} m azalır.` });
        }
        if (kind === "boy") {
          const H = pick([1.5, 1.6, 1.7, 1.8, 1.9]);
          return R(H / 2, "m", { text: `Mağazada boyu ${F(H)} m olan alıcı özünü başdan ayağa görmək istəyir. Divara asılacaq güzgünün minimal hündürlüyü neçə metr olmalıdır?`,
            solution: `Müstəvi güzgü üçün kifayət edən hündürlük boyun yarısıdır: ${F(H)}/2 = ${F(H / 2)} m.` });
        }
        if (kind === "hovuz") {
          const hh = pick([1.2, 2.4, 3.6, 4.8]), d = +(hh * 0.75).toFixed(6);
          return R(d, "m", { text: `Hovuzun dərinliyi ${F(hh)} m-dir. Suyun sındırma əmsalı 4/3-dür. Hovuzun kənarında dayanıb düz yuxarıdan suya baxan adama dib nə qədər dərində görünür? Cavabı metrlə yaz.`,
            solution: `Görünən dərinlik h′ = h/n = ${F(hh)}/(4/3) = ${F(hh)}·3/4 = ${F(d)} m. Ona görə hovuz həmişə real dərinlikdən dayaz görünür.` });
        }
        if (kind === "elmas") {
          const o = pick([["Almazın", 2.4], ["Şüşənin", 1.5], ["Plastik linzanın", 1.6], ["Duzlu suyun", 1.2]]), v = SPEED(o[1]);
          return R(v, "·10⁸ m/s", { text: `${o[0]} sındırma əmsalı ${F(o[1])}-dir. İşıq onun içində hansı sürətlə yayılır? Cavabı 10⁸ m/s ilə yaz. (c = 3·10⁸ m/s)`,
            solution: `v = c/n = 3·10⁸/${F(o[1])} = ${F(v)}·10⁸ m/s.` });
        }
        if (kind === "lif") {
          const [n1, n2, s] = pick(PAIRS_T.filter(p => p[0] >= 1.5 && p[1] >= 1.2));
          return R(s, "", { text: `Optik lifin özəyinin sındırma əmsalı ${F(n1)}, örtüyün sındırma əmsalı ${F(n2)}-dir. İşığın özək–örtük sərhəddində tam qayıtması üçün düşmə bucağının sinusu ən azı nə qədər olmalıdır?`,
            solution: `Həddi bucaq: sin α₀ = n₂/n₁ = ${F(n2)}/${F(n1)} = ${F(s)}. Düşmə bucağının sinusu bundan az olmamalıdır.` });
        }
        if (kind === "gunes") {
          const dd = pick([1.5, 1.5, 1.2, 1.8, 0.6]);
          return R(dd * 1e11 / 3e8, "s", { text: `Günəşdən Yerə qədər məsafəni ${F(dd)}·10¹¹ m götür. İşıq bu yolu neçə saniyəyə keçir? (c = 3·10⁸ m/s)`,
            solution: `t = S/c = ${F(dd)}·10¹¹/(3·10⁸) = ${F(dd * 1e11 / 3e8)} s.` });
        }
        if (kind === "ay") {
          const d = pick([3.9, 3.6, 3.0, 3.3]), t = +(2 * d / 3).toFixed(6);
          if (!nice(t, 2)) return levels[levels.length - 1].gen();
          return R(d, "·10⁸ m", { text: `Yerdən Aya göndərilən lazer impulsu Aydan əks olunub ${F(t)} s sonra geri qayıdır. Yerdən Aya qədər məsafə neçə 10⁸ m-dir? (c = 3·10⁸ m/s)`,
            solution: `İşıq iki dəfə yol gedir: 2S = ct = 3·10⁸·${F(t)} = ${F(3 * t)}·10⁸ m. S = ${F(d)}·10⁸ m.` });
        }
        const o = pick([{ n: 1.25, nT: "1,25", s: 0.8, c: 0.6, t: "4/3", hs: [0.3, 0.6, 0.9, 1.2, 1.5, 1.8], k: 4 / 3 }, { n: 5 / 3, nT: "5/3", s: 0.6, c: 0.8, t: "3/4", hs: [0.4, 0.8, 1.2, 1.6, 2, 2.4], k: 0.75 }]);
        const hh = pick(o.hs), r = +(hh * o.k).toFixed(6);
        return R(r, "m", { text: `Sındırma əmsalı ${o.nT} olan göldə sualtı fənər suyun səthindən ${F(hh)} m dərinlikdə yerləşir və hər tərəfə işıq verir. Fənərin düz üstündəki nöqtə ətrafında işığın havaya çıxdığı dairənin radiusu neçə metrdir?`,
          solution: `Dairənin kənarında düşmə bucağı həddi bucaqdır: sin α₀ = 1/n = ${F(o.s)}, tg α₀ = ${o.t}. R = h·tg α₀ = ${F(hh)}·${o.t} = ${F(r)} m.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-isiq", title: "İşığın qayıtması və sınması", fenn: "fizika", link: "dersler/fiz-isiq.html",
      format: "Cavab ədəddir (bucaq dərəcə ilə, sürət m/s, məsafə m). Onluq kəsr vergül və ya nöqtə ilə: 0,6. c = 3·10⁸ m/s. Sinus və sındırma əmsalı vahidsizdir.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["qayit", "qayit", "donme", "donme", "sinma", "sinma", "tam", "tam", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-isiq.html")) b.push("dersler/fiz-isiq.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
