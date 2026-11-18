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

  // FIGS-BEGIN
  const FG = (() => {
    const INK = "var(--ink,#17171a)", ACC = "var(--accent,#a32d2d)", MUT = "var(--muted,#6b6b73)", PAP = "var(--paper,#fff)", VEC = "var(--vec,#0c447c)", GL = "rgba(42,93,176,.13)", GL2 = "rgba(42,93,176,.26)";
    const D2R = Math.PI / 180, f = n => +(+n).toFixed(1);
    const line = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
    const dsh = (x1, y1, x2, y2, c = MUT, w = 1.4) => line(x1, y1, x2, y2, c, w, ` stroke-dasharray="5 4"`);
    const text = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${f(x)}" y="${f(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
    const dot = (x, y, r = 3.2, c = INK) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${c}"/>`;
    const head = (x, y, dx, dy, c = INK, s = 9) => { const L = Math.hypot(dx, dy); dx /= L; dy /= L; const bx = x - dx * s, by = y - dy * s;
      return `<polygon points="${f(x)},${f(y)} ${f(bx - dy * s * .45)},${f(by + dx * s * .45)} ${f(bx + dy * s * .45)},${f(by - dx * s * .45)}" fill="${c}"/>`; };
    const arrow = (x1, y1, x2, y2, c = ACC, w = 2.5) => line(x1, y1, x2, y2, c, w) + head(x2, y2, x2 - x1, y2 - y1, c);
    const ray = (x1, y1, x2, y2, c = ACC, w = 2.5) => line(x1, y1, x2, y2, c, w) + head(x1 + (x2 - x1) * .6, y1 + (y2 - y1) * .6, x2 - x1, y2 - y1, c, 8);
    const dim = (x1, y1, x2, y2, c = MUT) => line(x1, y1, x2, y2, c, 1.3) + head(x2, y2, x2 - x1, y2 - y1, c, 7) + head(x1, y1, x1 - x2, y1 - y2, c, 7);
    const arc = (cx, cy, r, a1, a2, c = INK, w = 1.5) => { const p = a => [cx + r * Math.cos(a * D2R), cy + r * Math.sin(a * D2R)], [x1, y1] = p(a1), [x2, y2] = p(a2);
      return `<path d="M${f(x1)} ${f(y1)}A${r} ${r} 0 ${Math.abs(a2 - a1) > 180 ? 1 : 0} ${a2 > a1 ? 1 : 0} ${f(x2)} ${f(y2)}" fill="none" stroke="${c}" stroke-width="${w}"/>`; };
    const arcA = (cx, cy, r, a1, a2, c = INK, w = 1.8) => { const t = (a2 > a1 ? a2 + 90 : a2 - 90) * D2R; return arc(cx, cy, r, a1, a2, c, w) + head(cx + r * Math.cos(a2 * D2R), cy + r * Math.sin(a2 * D2R), Math.cos(t), Math.sin(t), c, 8); };
    const lab = (cx, cy, r, a, s, c = INK, sz = 13) => text(cx + r * Math.cos(a * D2R), cy + r * Math.sin(a * D2R) + 4.5, s, "middle", c, sz);
    const svg = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${aria}">${inner}</svg>`;
    const man = (x, yb, hp, c = INK, dsha = "") => { const k = hp / 60, e = ` stroke-dasharray="${dsha}"`;
      return `<circle cx="${f(x)}" cy="${f(yb - hp + 7 * k)}" r="${f(7 * k)}" fill="none" stroke="${c}" stroke-width="2"${dsha ? e : ""}/>` + line(x, yb - hp + 14 * k, x, yb - 24 * k, c, 2, dsha ? e : "")
        + line(x - 10 * k, yb - 42 * k, x + 10 * k, yb - 42 * k, c, 2, dsha ? e : "") + line(x, yb - 24 * k, x - 8 * k, yb, c, 2, dsha ? e : "") + line(x, yb - 24 * k, x + 8 * k, yb, c, 2, dsha ? e : ""); };
    const wallH = (x, y1, y2, side) => { let s = line(x, y1, x, y2, INK, 4); for (let y = y1 + 8; y < y2; y += 12) s += line(x, y, x + side * 9, y - 9, INK, 1.2); return s; };

    // Q1: a person walks towards a plane mirror, the mirror moves away (v, u)
    const mirror = () => { const mx = 190; let s = wallH(mx, 14, 134, 1);
      s += man(70, 134, 62) + man(310, 134, 62, MUT, "4 3") + arrow(76, 58, 120, 58, ACC) + text(98, 50, "v", "middle", ACC, 14);
      s += arrow(mx + 14, 100, mx + 52, 100, VEC) + text(mx + 33, 92, "u", "middle", VEC, 14);
      s += text(mx - 14, 10, "güzgü", "end", INK, 12) + text(70, 152, "Elvin", "middle", INK, 12) + text(310, 152, "xəyal", "middle", MUT, 12);
      return svg(340, 160, s, "Şaquli düz güzgü; solda sürəti v olan adam güzgüyə yaxınlaşır, güzgü sürəti u ilə sağa çəkilir; sağda xəyal"); };

    // Q2: object moves at angle theta to the mirror plane (theta in degrees)
    const vec = th => { const mx = 170, ox = 70, oy = 132, L = 62, s = Math.sin(th * D2R), c = Math.cos(th * D2R);
      let r = wallH(mx, 12, 176, 1) + dsh(ox, oy, ox, 40) + dot(ox, oy, 5, ACC) + arrow(ox, oy, ox + L * s, oy - L * c, ACC) + arc(ox, oy, 30, -90, -90 + th)
        + lab(ox, oy, 44, -90 + th / 2, "θ") + text(ox + L * s + 8, oy - L * c + 4, "v", "start", ACC, 14);
      const ix = 2 * mx - ox; r += `<circle cx="${ix}" cy="${oy}" r="5" fill="none" stroke="${MUT}" stroke-width="1.6" stroke-dasharray="3 2"/>` + line(ix, oy, ix - L * s, oy - L * c, MUT, 2, ` stroke-dasharray="5 4"`)
        + head(ix - L * s, oy - L * c, -s, -c, MUT) + text(mx - 8, 10, "güzgü", "end", INK, 12) + text(ox, oy + 20, "cisim", "middle", INK, 12) + text(ix, oy + 20, "xəyal", "middle", MUT, 12);
      return svg(320, 190, r, "Şaquli güzgü, cisim güzgünün müstəvisi ilə θ bucağı altında yaxınlaşır; xəyal güzgünün o biri tərəfindədir"); };

    // Q3: fixed laser beam, rotating mirror (omega), spot on the wall; wall is perpendicular to the reflected beam
    const rot = () => { const mx = 150, my = 150; let s = line(70, 30, 250, 30, INK, 4);
      for (let x = 78; x <= 250; x += 12) s += line(x, 30, x - 8, 20, INK, 1.2);
      s += `<rect x="16" y="141" width="26" height="18" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + text(29, 135, "lazer", "middle", INK, 11);
      s += ray(42, my, mx, my, ACC) + ray(mx, my, mx, 30, VEC) + line(125, 175, 175, 125, INK, 4);
      for (let t = 0; t <= 1.001; t += .125) { const x = 125 + 50 * t, y = 175 - 50 * t; s += line(x, y, x + 7, y + 7, INK, 1.2); }
      s += dot(mx, 30, 4.5, ACC) + text(262, 34, "divar", "start", INK, 12) + arcA(mx, my, 46, 25, 75, ACC) + text(mx + 60, my + 42, "ω", "middle", ACC, 15);
      s += dim(212, my, 212, 30) + text(224, 94, "L", "start", MUT, 14) + dsh(mx, my, 216, my) + dsh(mx, 30, 216, 30);
      s += dim(42, 190, mx, 190) + text(96, 184, "a", "middle", MUT, 14);
      return svg(300, 200, s, "Sabit lazer şüası dönən güzgüyə düşür; əks olunmuş şüa divara perpendikulyardır; L güzgüdən divara, a lazerdən güzgüyə məsafədir"); };

    // Q4: a ball drops from the level of a point lamp; its shadow on a wall (distances d and D from the lamp)
    const fall = (d, D) => { const lx = 30, ly = 30, wx = 252, xb = lx + (wx - lx) * d / D, drop = 22, ys = ly + drop * D / d;
      let s = wallH(wx, 12, 150, 1) + `<circle cx="${lx}" cy="${ly}" r="6" fill="${ACC}"/>` + text(lx, ly + 22, "mənbə", "middle", INK, 12);
      s += dsh(lx, ly, wx, ly) + `<circle cx="${f(xb)}" cy="${ly}" r="6" fill="none" stroke="${MUT}" stroke-width="1.5" stroke-dasharray="3 2"/>`;
      s += line(lx, ly, wx, ys, ACC, 1.6) + `<circle cx="${f(xb)}" cy="${ly + drop}" r="6" fill="${INK}"/>` + arrow(xb + 14, ly + 2, xb + 14, ly + drop + 16, VEC, 2) + text(xb + 22, ly + 14, "g", "start", VEC, 13);
      s += dot(wx, ys, 4.5, ACC) + text(wx - 8, ys + 16, "kölgə", "end", ACC, 12);
      s += dim(lx, 18, xb, 18) + text((lx + xb) / 2, 13, "d", "middle", MUT, 13) + dim(lx, 150, wx, 150) + text((lx + wx) / 2, 144, "D", "middle", MUT, 13);
      return svg(280, 162, s, "Nöqtəvi mənbə, ondan d məsafədə düşən kürə və D məsafədə divar; kürənin kölgəsi divarda"); };

    // Q5: lamp on a pole of height H, a person of height h walks away; the shadow of the head on the ground
    const lamp = (H, h) => { const px = 34, gy = 166, hp = 134, x = 112, hh = hp * h / H, tx = px + (x - px) * H / (H - h);
      let s = line(10, gy, 294, gy, INK, 2) + line(px, gy, px, gy - hp, INK, 3) + `<circle cx="${px}" cy="${gy - hp}" r="6" fill="${ACC}"/>`;
      s += line(px, gy - hp, tx, gy, ACC, 1.6) + line(x, gy, tx, gy, INK, 6, ` opacity=".45"`) + man(x, gy, hh) + dot(tx, gy, 4, ACC);
      s += arrow(x - 16, gy - hh - 14, x + 22, gy - hh - 14, VEC) + text(x + 3, gy - hh - 21, "v", "middle", VEC, 14);
      s += dim(16, gy - hp, 16, gy) + text(22, gy - hp / 2 + 4, "H", "start", MUT, 13) + dim(x + 20, gy - hh, x + 20, gy) + text(x + 26, gy - hh / 2 + 4, "h", "start", MUT, 13);
      s += text(tx, gy + 16, "kölgənin ucu", tx > 215 ? "end" : "middle", ACC, 12);
      return svg(300, 186, s, "Yerdən H hündürlükdə lampa; boyu h olan adam uzaqlaşır; başın kölgəsi yerdədir"); };

    // Q6: optical fibre — a ray enters the end face from air at angle alpha
    const fibre = () => { const ex = 70, ey = 80, a = 35 * D2R, b = 24 * D2R, x2 = ex + 22 / Math.tan(b), x3 = x2 + 44 / Math.tan(b), x4 = 282, y4 = 102 - (x4 - x3) * Math.tan(b);
      let s = `<rect x="${ex}" y="44" width="222" height="14" fill="${GL2}"/><rect x="${ex}" y="102" width="222" height="14" fill="${GL2}"/><rect x="${ex}" y="58" width="222" height="44" fill="${GL}"/>`
        + line(ex, 58, ex + 222, 58, INK, 2) + line(ex, 102, ex + 222, 102, INK, 2) + line(ex, 44, ex, 116, INK, 3) + dsh(24, ey, ex + 222, ey);
      s += ray(ex - 55 * Math.cos(a), ey + 55 * Math.sin(a), ex, ey, ACC) + `<polyline points="${ex},${ey} ${f(x2)},58 ${f(x3)},102 ${x4},${f(y4)}" fill="none" stroke="${ACC}" stroke-width="2.5" stroke-linejoin="round"/>`
        + head(ex + 26, ey - 26 * Math.tan(b), Math.cos(b), -Math.sin(b), ACC, 8) + head((x2 + x3) / 2 + 6, 80 + 3, Math.cos(b), Math.sin(b), ACC, 8) + dot(ex, ey, 3.5);
      s += arc(ex, ey, 30, 180 - 35, 180) + lab(ex, ey, 44, 180 - 17.5, "α") + arc(ex, ey, 34, -24, 0) + lab(ex, ey, 48, -12, "β");
      s += text(98, 98, "n₁", "middle", INK, 13) + text(250, 54, "n₂", "middle", INK, 12) + text(250, 112, "n₂", "middle", INK, 12) + text(34, 42, "hava", "middle", MUT, 12) + text(34, 56, "n = 1", "middle", MUT, 12);
      return svg(300, 150, s, "Optik lif: özək n₁, örtük n₂; şüa lifin ucuna havadan α bucağı ilə düşür, özəkdə β bucağı ilə sınır və yan sərhəddə tam qayıdır"); };

    // Q7: plane-parallel plate in air, thickness d, sin α = sa, sin β = sb
    const plate = (sa, sb) => { const al = Math.asin(sa), be = Math.asin(sb), y1 = 72, y2 = 132, x1 = 120, x2 = x1 + (y2 - y1) * Math.tan(be), ux = Math.sin(al), uy = Math.cos(al);
      const t = (x2 - x1) * ux + (y2 - y1) * uy, fx = x1 + t * ux, fy = y1 + t * uy;
      let s = `<rect x="24" y="${y1}" width="252" height="${y2 - y1}" fill="${GL}" stroke="${INK}" stroke-width="2"/>` + dsh(x1, 36, x1, 176) + dsh(x2, 36, x2, 176);
      s += ray(x1 - 70 * ux, y1 - 70 * uy, x1, y1, ACC) + line(x1, y1, x2, y2, ACC, 2.5) + head(x1 + (x2 - x1) * .6, y1 + (y2 - y1) * .6, x2 - x1, y2 - y1, ACC, 8) + ray(x2, y2, x2 + 70 * ux, y2 + 70 * uy, ACC);
      s += dsh(x1, y1, fx + 22 * ux, fy + 22 * uy, VEC, 1.5) + line(x2, y2, fx, fy, VEC, 2.5) + dot(x1, y1, 3.2) + dot(x2, y2, 3.2);
      s += arc(x1, y1, 30, -90 - al / D2R, -90) + lab(x1, y1, 44, -90 - al / D2R / 2, "α") + arc(x1, y1, 26, 90 - be / D2R, 90) + lab(x1, y1, 40, 90 - be / D2R / 2, "β");
      s += dim(40, y1, 40, y2) + text(48, (y1 + y2) / 2 + 4, "d", "start", MUT, 14) + text(262, y1 + 20, "n", "end", INK, 13) + text(262, y1 - 8, "hava", "end", MUT, 12);
      s += text((x2 + fx) / 2 + 8, (y2 + fy) / 2 + 16, "x", "start", VEC, 14);
      return svg(290, 190, s, "Paralel üzlü lövhə: şüa α bucağı ilə düşür, β bucağı ilə sınır və düşən şüaya paralel çıxır; x iki paralel şüa arasındakı məsafədir"); };

    // Q8: disc source (diameter a), opaque disc (b) at distance l, screen at L (cm)
    const discs = (a, b, l, L) => { const m = (L - l) / l, U = b - (a - b) * m, P = b + (a + b) * m, X0 = 40, X1 = 250, kx = (X1 - X0) / L, ky = Math.min(kx, 72 / (P / 2)), cy = 84;
      const X = t => X0 + kx * t, Y = u => cy - ky * u;
      let s = line(X0, Y(a / 2), X0, Y(-a / 2), ACC, 6) + line(X(l), Y(b / 2), X(l), Y(-b / 2), INK, 6) + dsh(X0 - 14, cy, X1 + 4, cy) + wallH(X1, 10, 160, 1);
      s += line(X1, Y(P / 2), X1, Y(-P / 2), MUT, 8, ` opacity=".55"`) + line(X1, Y(U / 2), X1, Y(-U / 2), INK, 8);
      s += line(X0, Y(a / 2), X1, Y(U / 2), ACC, 1.4) + line(X0, Y(-a / 2), X1, Y(-U / 2), ACC, 1.4) + line(X0, Y(-a / 2), X1, Y(P / 2), VEC, 1.3, ` stroke-dasharray="5 4"`) + line(X0, Y(a / 2), X1, Y(-P / 2), VEC, 1.3, ` stroke-dasharray="5 4"`);
      s += text(X0 - 10, cy + 4, "a", "end", MUT, 14) + text(X(l) + 8, Y(b / 2) - 4, "b", "start", MUT, 14) + text(X1 + 14, cy - 2, "tam", "start", INK, 11) + text(X1 + 14, cy + 11, "kölgə", "start", INK, 11);
      s += text(X1 + 14, Math.max(14, Y(P / 2) - 4), "yarımkölgə", "start", MUT, 11);
      s += dim(X0, 172, X(l), 172) + text((X0 + X(l)) / 2, 166, "l", "middle", MUT, 14) + dim(X0, 192, X1, 192) + text((X0 + X1) / 2, 186, "L", "middle", MUT, 14);
      return svg(348, 200, s, "Disk şəkilli mənbə (a), qeyri-şəffaf disk (b) və ekran; tam kölgə və yarımkölgə"); };

    // Q9: prism with apex angle phi (deg); a ray enters the left face along the normal
    const prism = (phi, n) => { const h = phi / 2 * D2R, ax = 140, ay = 18, by = 160, len = (by - ay) / Math.cos(h), ex = ax - len * Math.sin(h), fx = ax + len * Math.sin(h);
      const P0 = [ax - 0.5 * len * Math.sin(h), ay + 0.5 * len * Math.cos(h)], dx = Math.cos(h), dy = Math.sin(h), ex2 = Math.sin(h), ey2 = Math.cos(h);
      // P0 + t·d = A + s·e2
      const det = dx * -ey2 - -ex2 * dy, rx = ax - P0[0], ry = ay - P0[1], t = (rx * -ey2 - -ex2 * ry) / det, P1 = [P0[0] + t * dx, P0[1] + t * dy];
      const be = Math.asin(Math.min(.999, n * Math.sin(phi * D2R))) / D2R, oa = (-phi / 2 + be) * D2R, ox = Math.cos(oa), oy = Math.sin(oa);
      let s = `<polygon points="${f(ax)},${ay} ${f(ex)},${by} ${f(fx)},${by}" fill="${GL}" stroke="${INK}" stroke-width="2.5" stroke-linejoin="round"/>`;
      s += ray(P0[0] - 62 * dx, P0[1] - 62 * dy, P0[0], P0[1], ACC) + line(P0[0], P0[1], P1[0], P1[1], ACC, 2.5) + head(P0[0] + (P1[0] - P0[0]) * .55, P0[1] + (P1[1] - P0[1]) * .55, dx, dy, ACC, 8) + ray(P1[0], P1[1], P1[0] + 70 * ox, P1[1] + 70 * oy, ACC);
      s += dsh(P1[0] - 22 * Math.cos(h), P1[1] + 22 * Math.sin(h), P1[0] + 52 * Math.cos(h), P1[1] - 52 * Math.sin(h)) + dot(P0[0], P0[1], 3.2) + dot(P1[0], P1[1], 3.2);
      s += arc(ax, ay, 30, 90 - phi / 2, 90 + phi / 2) + text(ax, ay + 52, "φ", "middle", INK, 14) + arc(P1[0], P1[1], 34, -phi / 2, -phi / 2 + be) + lab(P1[0], P1[1], 50, -phi / 2 + be / 2, "β₂");
      s += text(ax - 4, by - 18, "n", "middle", INK, 14) + text(14, 70, "hava", "start", MUT, 12);
      return svg(300, 180, s, "Üçüzlü prizma, sındırıcı bucaq φ; şüa birinci üzə perpendikulyar düşür, ikinci üzdə β₂ bucağı ilə çıxır"); };

    // Q10: two mirrors, first perpendicular, the second turned by gam (deg); the exit ray is compared with the old one
    const two = gam => { const ox = 120, oy = 150, psi = (90 + gam) * D2R, e2 = [Math.cos(psi), -Math.sin(psi)], nn = [Math.sin(psi), Math.cos(psi)], a0 = 35 * D2R, d0 = [-Math.cos(a0), Math.sin(a0)], d1 = [d0[0], -d0[1]];
      const P = [192, oy]; // M1 is the line y = oy; M2: O + r·e2
      const det = d1[0] * -e2[1] - -e2[0] * d1[1], rx = ox - P[0], ry = oy - P[1], sP = (rx * -e2[1] - -e2[0] * ry) / det, Q = [P[0] + sP * d1[0], P[1] + sP * d1[1]];
      const dn = d1[0] * nn[0] + d1[1] * nn[1], d2 = [d1[0] - 2 * dn * nn[0], d1[1] - 2 * dn * nn[1]], ref = [-d0[0], -d0[1]];
      const aR = Math.atan2(ref[1], ref[0]) / D2R, aN = Math.atan2(d2[1], d2[0]) / D2R;
      let s = line(ox - 8, oy, 280, oy, INK, 4);
      for (let x = ox; x < 280; x += 12) s += line(x, oy, x - 7, oy + 8, INK, 1.2);
      s += dsh(ox, oy, ox, 22, MUT, 1.4) + line(ox, oy, ox + 128 * e2[0], oy + 128 * e2[1], INK, 4);
      for (let r = 14; r < 120; r += 12) s += line(ox + r * e2[0], oy + r * e2[1], ox + r * e2[0] + 8 * nn[0] * -1, oy + r * e2[1] + 8 * nn[1] * -1, INK, 1.2);
      s += arc(ox, oy, 40, -(90 + gam), -90) + lab(ox, oy, 54, -90 - gam / 2, "γ");
      s += ray(P[0] - d0[0] * 95, P[1] - d0[1] * 95, P[0], P[1], ACC) + line(P[0], P[1], Q[0], Q[1], ACC, 2.5) + head(P[0] + (Q[0] - P[0]) * .55, P[1] + (Q[1] - P[1]) * .55, d1[0], d1[1], ACC, 8) + ray(Q[0], Q[1], Q[0] + d2[0] * 72, Q[1] + d2[1] * 72, ACC);
      s += dsh(Q[0], Q[1], Q[0] + ref[0] * 72, Q[1] + ref[1] * 72, MUT, 1.5) + arc(Q[0], Q[1], 46, Math.min(aR, aN), Math.max(aR, aN), VEC, 1.8) + lab(Q[0], Q[1], 62, (aR + aN) / 2, "?", VEC, 15);
      s += dot(P[0], P[1], 3.2) + dot(Q[0], Q[1], 3.2) + text(ox - 12, oy + 20, "M₁", "end", INK, 12) + text(ox + 128 * e2[0] - 10, oy + 128 * e2[1] + 4, "M₂", "end", INK, 12);
      return svg(300, 180, s, "Bir-birinə perpendikulyar iki güzgü; ikinci güzgü γ bucağı qədər döndürülüb; çıxan şüanın istiqaməti ilkin istiqamətlə müqayisə olunur"); };

    return { mirror, vec, rot, fall, lamp, fibre, plate, discs, prism, two };
  })();
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; const e = d.firstChild; if (e && e.setAttribute) e.setAttribute("class", "oy-svg"); return e; };
  // FIGS-END
  // IMT-BEGIN
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + (u ? " " + u : "");
  const sinDeg = x => Math.sin(x * DEG);
  // pick 4 distinct, "nice" wrong values from candidates [value, trap text] (first ones have priority); null when fewer than 4
  const wrongs = (right, cands, fmt, dp = 2) => {
    const seen = new Set([fmt(right)]), out = [];
    for (const [v, t] of cands) { if (!ok2(v, dp)) continue; const k = fmt(v); if (seen.has(k)) continue; seen.add(k); out.push([v, t]); if (out.length === 4) break; }
    return out.length === 4 ? out : null;
  };
  const traps = w => w.map(x => x[1]).join("; ");
  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a figure, several steps; the wrong options are the
  // answers of typical mistakes. Questions 1, 2, 4, 6, 7 also use "Kinematika", "Vektorlar", "Çevrə üzrə hərəkət", "Sərbəst düşmə".
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. a person walks to a plane mirror that moves away (kinematics)
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const v = pick([1.5, 2, 2.5, 3, 4, 5]), u = pick([0.5, 1, 1.5, 2]); if (u >= v) return null;
      const right = 2 * (v - u), w = [v - u, 2 * v, 2 * (v + u), v + u]; if (![right, ...w].every(x => ok2(x))) return null;
      return mc(ae(right, w, U_("m/s")), { svg: svgEl(FG.mirror()), text: `Elvin düz güzgüyə perpendikulyar istiqamətdə ${F(v)} m/s sürətlə yaxınlaşır. Güzgü isə eyni istiqamətdə, yəni Elvinin hərəkət istiqamətində ${F(u)} m/s sürətlə uzaqlaşır (sürətlər Yerə nəzərəndir). Elvinlə onun xəyalı arasındakı məsafə hansı sürətlə azalır?`,
        solution: `Elvinlə güzgü arasındakı məsafə hər saniyə ${F(v)} − ${F(u)} = ${F(v - u)} m azalır. Xəyal güzgünün o biri tərəfində, güzgüdən eyni məsafədədir, ona görə Elvinlə xəyal arasındakı məsafə güzgüyə qədər məsafənin 2 mislidir: 2·${F(v - u)} = ${F(right)} m/s. Tələlər: 2 mislini unutmaq (${F(v - u)} m/s), güzgünün hərəkətini nəzərə almamaq (${F(2 * v)} m/s), güzgünün sürətini əks işarə ilə götürmək (${F(2 * (v + u))} m/s), hər iki səhvi birlikdə etmək (${F(v + u)} m/s).` });
    }) },
    // 2. velocity at an angle to the mirror: components (vectors)
    { tip: "qapali", birlesik: "fiz-vektorlar", gen: () => again(() => {
      const th = pick([37, 53]), s = th === 37 ? 0.6 : 0.8, c = th === 37 ? 0.8 : 0.6, v = pick([5, 10, 15, 20, 25, 30]);
      const right = 2 * v * s, w = [v * s, 2 * v * c, 2 * v, v * c]; if (![right, ...w].every(x => ok2(x))) return null;
      return mc(ae(right, w, U_("m/s")), { svg: svgEl(FG.vec(th)), text: `Cisim düz güzgünün müstəvisi ilə θ = ${th}° bucaq əmələ gətirən istiqamətdə ${v} m/s sürətlə bərabərsürətli hərəkət edərək güzgüyə yaxınlaşır (güzgü hərəkətsizdir). Cisimlə onun xəyalı arasındakı məsafə hansı sürətlə azalır? (sin ${th}° = ${F(s)}; cos ${th}° = ${F(c)})`,
        solution: `Sürəti güzgüyə perpendikulyar və paralel toplananlara ayırırıq: perpendikulyar toplanan v sin θ = ${v}·${F(s)} = ${F(v * s)} m/s, paralel toplanan v cos θ = ${F(v * c)} m/s. Xəyal paralel istiqamətdə cisimlə birlikdə hərəkət edir, perpendikulyar toplanan isə əksinə çevrilir. Ona görə cisimlə xəyal arasındakı məsafə yalnız perpendikulyar toplananla dəyişir və 2 dəfə sürətlə: 2v sin θ = ${F(right)} m/s. Tələlər: sin ilə cos-u qarışdırmaq (${F(2 * v * c)} m/s), 2 mislini unutmaq (${F(v * s)} m/s), bütün sürəti götürmək (${F(2 * v)} m/s), paralel toplananı götürmək (${F(v * c)} m/s).` });
    }) },
    // 3. two perpendicular mirrors, the second one is turned
    { tip: "qapali", gen: () => again(() => {
      const g = pick([5, 10, 15, 20, 25, 30]), right = 2 * g, w = [g, 4 * g, 180 - 2 * g, 90 - g];
      return mc(ae(right, w, x => F(x) + "°"), { svg: svgEl(FG.two(g)), text: `İki müstəvi güzgü bir-birinə perpendikulyardır. Güzgülərin kəsişmə xəttinə perpendikulyar müstəvidə yayılan şüa ardıcıl olaraq hər iki güzgüdən əks olunur və düşən şüaya əks istiqamətdə paralel çıxır. Birinci güzgünü yerində saxlayıb ikinci güzgünü kəsişmə xətti ətrafında γ = ${g}° döndərdilər (düşən şüa dəyişməyib). Çıxan şüanın istiqaməti əvvəlki çıxan şüanın istiqamətinə nəzərən neçə dərəcə dəyişir?`,
        solution: `Birinci güzgü yerində qalıb, ondan əks olunan şüanın istiqaməti dəyişmir. İkinci güzgü γ = ${g}° dönəndə ondan əks olunan şüa 2γ = ${right}° dönür (güzgü φ dönəndə əks olunmuş şüa 2φ dönür). Tələlər: 2 mislini unutmaq (${g}°), iki güzgüdən hər biri üçün 2 dəfə saymaq (${4 * g}°), şüalar arasındakı bucağı düz xətt kimi götürmək (${180 - 2 * g}°), γ-nı 90°-dən çıxmaq (${90 - g}°).` });
    }) },
    // 4. rotating mirror: the spot on the wall (circular motion)
    { tip: "qapali", birlesik: "fiz-cevre-herekat", gen: () => again(() => {
      const w = pick([0.5, 1, 1.5, 2, 2.5, 3]), L = pick([2, 3, 4, 5]), a = pick([1, 2, 3, 4]), right = 2 * w * L, wr = [w * L, 4 * w * L, 2 * w * (L + a), w * (L + a)]; if (![right, ...wr].every(x => ok2(x))) return null;
      return mc(ae(right, wr, U_("m/s")), { svg: svgEl(FG.rot()), text: `Sabit lazer şüası düz güzgüyə düşür. Güzgü düşmə nöqtəsindən keçən və şüaların müstəvisinə perpendikulyar ox ətrafında ω = ${F(w)} rad/s bucaq sürəti ilə bərabər fırlanır. Güzgüdən divara qədər məsafə L = ${F(L)} m, lazerdən güzgüyə qədər məsafə a = ${F(a)} m-dir. Əks olunmuş şüanın divara perpendikulyar olduğu anda işıq ləkəsinin divar boyunca sürəti nə qədərdir?`,
        solution: `Güzgü ω bucaq sürəti ilə dönəndə əks olunmuş şüa 2ω bucaq sürəti ilə dönür (güzgü φ dönəndə şüa 2φ dönür). Şüa divara perpendikulyar olan anda ləkənin sürəti v = (2ω)·L = 2·${F(w)}·${F(L)} = ${F(right)} m/s. Yalnız güzgüdən divara qədər məsafə lazımdır; a verilənlərdə artıqdır. Tələlər: 2 mislini unutmaq (${F(w * L)} m/s), 2-ni iki dəfə saymaq (${F(4 * w * L)} m/s), məsafəyə a-nı da əlavə etmək (${F(2 * w * (L + a))} m/s və ${F(w * (L + a))} m/s).` });
    }) },
    // 5. umbra / penumbra of a disc between a disc source and a screen
    { tip: "qapali", minVariety: 12, gen: () => again(() => {
      const a = pick([4, 6, 8, 10, 12]), b = pick([2, 3, 4, 5, 6]), l = pick([10, 20, 30, 40]), m = pick([0.5, 1, 1.5, 2]), L = l * (1 + m); if (!Number.isInteger(L) || a === b) return null;
      const U = b - (a - b) * m, P = b + (a + b) * m, kind = pick(["U", "P"]); if (U <= 0) return null;
      const right = kind === "U" ? U : P, c = kind === "U"
        ? [[P, "yarımkölgənin xarici diametrini cavab yazmaq"], [b * L / l, "nöqtəvi mənbə düsturu H = b·L/l (mənbənin ölçüsünü unutmaq)"], [b + (a - b) * m, "(a − b)·m-in işarəsini səhv götürmək"], [b - (a - b) * L / l, "m = (L − l)/l əvəzinə L/l götürmək"]]
        : [[U, "tam kölgənin diametrini cavab yazmaq"], [b * L / l, "nöqtəvi mənbə düsturu H = b·L/l"], [b + (a + b) * L / l, "m = (L − l)/l əvəzinə L/l götürmək"], [(a + b) * m, "diskin öz diametrini (b-ni) əlavə etməmək"]];
      const w = wrongs(right, c, U_("sm")); if (!w) return null;
      return mc(ae(right, w.map(x => x[0]), U_("sm")), { svg: svgEl(FG.discs(a, b, l, L)), text: `Diametri a = ${a} sm olan disk şəkilli işıq mənbəyindən ${l} sm məsafədə diametri b = ${b} sm olan qeyri-şəffaf disk yerləşir. Mənbənin və diskin mərkəzləri ortaq oxdadır, hər ikisinin müstəvisi oxa perpendikulyardır. Mənbədən L = ${L} sm məsafədə, oxa perpendikulyar ekran yerləşdirilib. Ekranda ${kind === "U" ? "tam kölgənin diametri" : "yarımkölgənin xarici diametri"} neçə santimetrdir?`,
        solution: `Disklərin ortası oxdadır, ona görə simmetriya var, oxşar üçbucaqlardan iş görürük. Diskdən ekrana qədər məsafənin diskə qədər məsafəyə nisbəti m = (L − l)/l = (${L} − ${l})/${l} = ${F(m)}. Tam kölgənin sərhədi mənbənin və diskin eyni tərəfli kənarlarından keçən şüalarla alınır: U = b − (a − b)·m = ${b} − (${a} − ${b})·${F(m)} = ${F(U)} sm. Yarımkölgənin xarici sərhədi çarpaz kənarlardan keçən şüalarla alınır: P = b + (a + b)·m = ${b} + ${a + b}·${F(m)} = ${F(P)} sm. Cavab: ${F(right)} sm. Tələlər: ${traps(w)}.` });
    }) },
    // 6. lamp, a person walks away: speed of the shadow of the head (kinematics)
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const [H, h] = pick([[3, 1], [3, 1.5], [4.5, 1.5], [5, 1], [2.4, 1.6], [4.8, 1.8], [3.6, 1.2]]), v = pick([1, 1.2, 1.5, 2, 2.4, 3, 4]);
      const right = v * H / (H - h), c = [[v * h / (H - h), "kölgənin uzunluğunun artma sürətini cavab yazmaq"], [v * h / H, "h/H nisbətini götürmək"], [v * H / h, "H/h nisbətini götürmək"], [v, "kölgənin ucunun sürətini adamın sürəti saymaq"]];
      const w = wrongs(right, c, U_("m/s")); if (!ok2(right) || !w) return null;
      return mc(ae(right, w.map(x => x[0]), U_("m/s")), { svg: svgEl(FG.lamp(H, h)), text: `Yerdən H = ${F(H)} m hündürlükdə nöqtəvi lampa asılıb. Boyu h = ${F(h)} m olan adam yerdə düz xətt üzrə lampanın altından uzaqlaşır, sürəti ${F(v)} m/s-dir. Başın kölgəsi (kölgənin ucu) yerdə hansı sürətlə hərəkət edir? (Sürətlər Yerə nəzərəndir.)`,
        solution: `Adam lampanın altından x məsafədədir, kölgənin ucu isə x_k məsafədədir. Oxşar üçbucaqlardan h/H = (x_k − x)/x_k, yəni x_k = x·H/(H − h). Hər iki tərəf eyni vaxtda dəyişir, ona görə sürətlər də həmin nisbətdədir: v_k = v·H/(H − h) = ${F(v)}·${F(H)}/${F(+(H - h).toFixed(4))} = ${F(right)} m/s. Tələlər: ${traps(w)}.` });
    }) },
    // 7. a ball dropped next to a point lamp: the speed of its shadow on a wall (free fall)
    { tip: "qapali", birlesik: "fiz-serbest-dusme", gen: () => again(() => {
      const [d, D] = pick([[1, 2], [1, 3], [1, 4], [2, 3], [2, 5], [2, 6], [0.5, 2], [0.5, 1.5], [1.5, 3]]), t = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1]), gt = 10 * t, right = gt * D / d;
      const c = [[gt, "kölgənin sürətini kürənin sürəti saymaq"], [gt * d / D, "D/d əvəzinə d/D götürmək"], [gt * (D - d) / d, "D əvəzinə D − d götürmək"], [gt * D / (D - d), "nisbəti səhv qurmaq: D/(D − d)"]];
      const w = wrongs(right, c, U_("m/s")); if (!ok2(right) || !w) return null;
      return mc(ae(right, w.map(x => x[0]), U_("m/s")), { svg: svgEl(FG.fall(d, D)), text: `Nöqtəvi işıq mənbəyindən üfüqi istiqamətdə d = ${F(d)} m məsafədə kiçik kürə mənbə ilə eyni hündürlükdə saxlanılır və t = 0 anında başlanğıc sürətsiz buraxılır. Mənbədən D = ${F(D)} m məsafədə şaquli divar var, kürənin kölgəsi divarda görünür. t = ${F(t)} s anında kölgənin divar boyunca sürəti nə qədərdir? (g = 10 m/s²; hava müqaviməti yoxdur; kürə divara çatmayıb; kürəni nöqtə hesab et.)`,
        solution: `Kürə ${F(t)} s-də s = gt²/2 = 10·${F(t)}²/2 = ${F(+(5 * t * t).toFixed(4))} m düşür. Mənbə, kürə və kölgə bir düz xətt üzərindədir; oxşar üçbucaqlardan kölgənin yerdəyişməsi S = s·D/d. Deməli kölgə də sabit təcillə hərəkət edir (təcil g·D/d), onun sürəti v = (D/d)·gt = ${F(+(D / d).toFixed(4))}·${F(gt)} = ${F(right)} m/s. Tələlər: ${traps(w)}.` });
    }) },
    // 8. plane-parallel plate: sideways shift of the ray
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const [sa, nT, sb, cb, ca] = [0.8, "4/3", 0.6, 0.8, 0.6], d = pick([6, 12, 18, 24, 30, 36, 42, 48, 54, 60]);
      const sd = sa * cb - ca * sb, right = d * sd / cb, ta = sa / ca, tb = sb / cb;
      const c = [[d * (ta - tb), "lövhə üzü boyunca sürüşməni götürmək: d(tg α − tg β)"], [d * sd, "sin(α − β)-nı cos β-ya bölməmək"], [d * (sa - sb), "sin α − sin β götürmək"], [d * tb, "yalnız lövhədaxili üfüqi proyeksiyanı götürmək: d·tg β"], [d * ta, "sınmanı nəzərə almamaq: d·tg α"]];
      const w = wrongs(right, c, U_("sm"), 1); if (!ok2(right, 1) || !w) return null;
      return mc(ae(right, w.map(x => x[0]), U_("sm")), { svg: svgEl(FG.plate(sa, sb)), text: `Havada yerləşən, qalınlığı d = ${d} sm və sındırma əmsalı n = ${nT} olan paralel üzlü şəffaf lövhəyə şüa düşür, düşmə bucağının sinusu ${F(sa)}-dir. Lövhədən çıxan şüa ilə düşən şüanın davamı arasındakı məsafə (paralel şüalar arasındakı məsafə) neçə santimetrdir?`,
        solution: `Sınma qanunu: sin β = sin α/n = ${F(sa)}/(${nT}) = ${F(sb)}, buradan cos β = ${F(cb)}, cos α = ${F(ca)}. Lövhədən çıxan şüa düşənə paraleldir. Sürüşmə x = d·sin(α − β)/cos β. sin(α − β) = sin α cos β − cos α sin β = ${F(sa)}·${F(cb)} − ${F(ca)}·${F(sb)} = ${F(+sd.toFixed(4))}. x = ${d}·${F(+sd.toFixed(4))}/${F(cb)} = ${F(right)} sm. Tələlər: ${traps(w)}.` });
    }) },
    // 9. prism, ray normal to the first face
    { tip: "qapali", gen: () => again(() => {
      const n = pick([1.2, 1.25, 1.3, 1.4, 1.5, 1.6]), right = 0.6 * n;
      const c = [[0.8 * n, "sin və cos-u qarışdırmaq: n cos φ"], [0.6 / n, "sınma qanununu çevirmək: sin φ/n"], [0.6, "ikinci üzdə sınmanı unutmaq: sin φ"], [0.75 * n, "tg φ götürmək"], [0.8 / n, "cos φ/n götürmək"]];
      const w = wrongs(right, c, U_("")); if (!w) return null;
      return mc(ae(right, w.map(x => x[0]), U_("")), { svg: svgEl(FG.prism(37, n)), text: `Sındırıcı bucağı φ = 37° olan şüşə prizmanın (sındırma əmsalı n = ${F(n)}) birinci üzünə şüa üzə perpendikulyar düşür. Prizma havadadır, şüa ikinci üzdən havaya çıxır. İkinci üzdə sınma bucağının sinusu nə qədərdir? (sin 37° = 0,6; cos 37° = 0,8)`,
        solution: `Birinci üzdə şüa üzə perpendikulyar düşür, sınmır: β₁ = 0. İkinci üzə düşmə bucağı α₂ = φ − β₁ = 37° (üzlərin normalları arasındakı bucaq prizmanın sındırıcı bucağına bərabərdir). Sınma qanunu: n sin α₂ = sin β₂ → sin β₂ = ${F(n)}·0,6 = ${F(+right.toFixed(4))} (1-dən kiçikdir, şüa çıxır). Tələlər: ${traps(w)}.` });
    }) },
    // 10. optical fibre: the largest sine of the entrance angle (refraction + total internal reflection)
    { tip: "qapali", minVariety: 12, gen: () => again(() => {
      const [n1, n2] = pick([[1.5, 1.2], [1.25, 1], [1.4, 1.12], [1.3, 1.04], [1.6, 1.28], [1.3, 1.2], [1.7, 1.5]]), s = Math.sqrt(n1 * n1 - n2 * n2); if (!nice(s, 2) || s >= 1) return null;
      const c = [[s / n1, "lifin içindəki sınma bucağının sinusunu (sin β = s/n₁) cavab yazmaq, ucdakı sınmanı unutmaq"], [n2 / n1, "həddi bucağın sinusunu cavab yazmaq"], [n1 - n2, "indekslərin fərqini götürmək"], [s * s, "kökü almamaq: n₁² − n₂²"], [n2, "β əvəzinə α₀-ı götürmək (n₁ sin α₀ = n₂)"]];
      const w = wrongs(s, c, U_("")); if (!w) return null;
      return mc(ae(s, w.map(x => x[0]), U_("")), { svg: svgEl(FG.fibre()), text: `Düz, ideal optik lifin özəyinin sındırma əmsalı n₁ = ${F(n1)}, örtüyün sındırma əmsalı: n₂ = ${F(n2)}. İşıq lifin oxundan keçən müstəvidə yayılır; lifin düz kəsilmiş ucuna havadan (n = 1) α bucağı ilə düşür və özək–örtük sərhəddində tam daxili qayıtma ilə yayılır. Bunun üçün sin α-nın yuxarı həddi nə qədərdir?`,
        solution: `Tam daxili qayıtma üçün özək–örtük sərhəddində düşmə bucağı həddi bucaqdan böyük olmalıdır: sin α₀ = n₂/n₁. Ucda sınma bucağı β olsun: sərhəddə düşmə bucağı 90° − β-dır, sərhəd hal 90° − β = α₀ (həddi qiymət; ona istənilən qədər yaxınlaşmaq olar), yəni sin β = cos α₀ = √(1 − (n₂/n₁)²). Ucda: sin α = n₁ sin β = n₁ cos α₀ = √(n₁² − n₂²) = √(${F(+(n1 * n1).toFixed(4))} − ${F(+(n2 * n2).toFixed(4))}) = ${F(+s.toFixed(4))}. Tələlər: ${traps(w)}.` });
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT));
  window.__imtahan = IMT;
  // IMT-END

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-isiq", title: "İşığın qayıtması və sınması", fenn: "fizika", link: "dersler/fiz-isiq.html",
      format: "Cavab ədəddir (bucaq dərəcə ilə, sürət m/s, məsafə m). Onluq kəsr vergül və ya nöqtə ilə: 0,6. c = 3·10⁸ m/s. Sinus və sındırma əmsalı vahidsizdir.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["qayit", "qayit", "donme", "donme", "sinma", "sinma", "tam", "tam", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-isiq.html")) b.push("dersler/fiz-isiq.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
