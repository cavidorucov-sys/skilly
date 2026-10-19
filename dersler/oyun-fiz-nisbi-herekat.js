// Fizika · Nisbi hərəkət (RFO fizika, 8–9-cu sinif) — game levels: velocity addition, river crossing, rain/wind in a moving frame,
// meeting and overtaking, relative acceleration, find-the-error, real life, and the final test.
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

  // Pythagorean triples (legs a, b, hypotenuse c) — scaled by k to give whole-number speeds
  const TR = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];
  const triple = (kmax) => { const [a, b, c] = pick(TR), k = rnd(1, kmax || 5); return [a * k, b * k, c * k]; };

  // river: perpendicular aim (boat drifts) or straight crossing (boat aimed upstream)
  function river(mode) {
    const s = sv("svg", { viewBox: "0 0 300 170", class: "oy-svg", role: "img", "aria-label": "Çay, cərəyan və qayığın sürət vektorları" });
    s.append(sv("rect", { x: 0, y: 30, width: 300, height: 110, fill: "var(--accent-soft)", opacity: 0.5 }));
    s.append(sv("line", { x1: 0, y1: 30, x2: 300, y2: 30, stroke: INK, "stroke-width": 2 }));
    s.append(sv("line", { x1: 0, y1: 140, x2: 300, y2: 140, stroke: INK, "stroke-width": 2 }));
    label(s, 270, 90, "cərəyan →");
    if (mode === "perp") {
      arrow(s, 90, 140, 90, 50, ACC); label(s, 76, 95, "v", "end");
      arrow(s, 90, 140, 190, 140, VEC); label(s, 140, 158, "u");
      arrow(s, 90, 140, 190, 50, INK); label(s, 150, 85, "v_nəticə");
      s.append(sv("line", { x1: 190, y1: 50, x2: 190, y2: 140, stroke: "var(--muted)", "stroke-dasharray": "4 3" }));
    } else {
      arrow(s, 150, 140, 90, 50, ACC); label(s, 108, 108, "v", "end");
      arrow(s, 90, 50, 150, 50, VEC); label(s, 120, 42, "u");
      arrow(s, 150, 140, 150, 55, INK); label(s, 162, 100, "v_nəticə", "start");
    }
    return s;
  }
  // rain seen from the car: relative velocity = rain velocity − car velocity
  function rain(vr, vc) {
    const s = sv("svg", { viewBox: "0 0 300 170", class: "oy-svg", role: "img", "aria-label": "Yağışın sürəti, avtomobilin sürəti və nisbi sürət" });
    const sc = 90 / Math.max(vr, vc), ox = 170, oy = 30;
    arrow(s, ox, oy, ox, oy + vr * sc, ACC); label(s, ox + 8, oy + vr * sc / 2, "v_yağış", "start");
    arrow(s, ox, oy, ox - vc * sc, oy, VEC); label(s, ox - vc * sc / 2, oy - 8, "−v_avto");
    arrow(s, ox, oy, ox - vc * sc, oy + vr * sc, INK); label(s, ox - vc * sc - 4, oy + vr * sc + 16, "v_nisbi", "end");
    s.append(sv("line", { x1: ox - vc * sc, y1: oy, x2: ox - vc * sc, y2: oy + vr * sc, stroke: "var(--muted)", "stroke-dasharray": "4 3" }));
    s.append(sv("line", { x1: ox, y1: oy + vr * sc, x2: ox - vc * sc, y2: oy + vr * sc, stroke: "var(--muted)", "stroke-dasharray": "4 3" }));
    return s;
  }

  const levels = [
    { id: "sur", ad: "Sürətlərin toplanması", izah: "v_yerə = v_nisbi + v_daşıyıcı (vektor kimi). Eyni xətt üzrə: eyni istiqamət — toplanır, əks istiqamət — çıxılır. km/saat → m/s üçün 3,6-ya böl.",
      gen() {
        const kind = pick(["eyni", "eks", "yaxin", "yaxin2", "uzaq", "kmh"]);
        if (kind === "eyni" || kind === "eks") {
          const u = rnd(8, 30), v = rnd(1, 6), same = kind === "eyni", A = same ? u + v : u - v;
          return R(A, "m/s", { text: `Avtobus yerə nəzərən ${u} m/s sürətlə gedir. Sərnişin avtobusun içində ${same ? "gediş istiqamətində" : "gediş istiqamətinin əksinə"}, avtobusa nəzərən ${v} m/s sürətlə yeriyir. Sərnişinin yerə nəzərən sürəti nə qədərdir?`,
            solution: `v_yerə = v_avtobus ${same ? "+" : "−"} v_sərnişin = ${u} ${same ? "+" : "−"} ${v} = ${A} m/s. ${same ? "İstiqamət eynidir — sürətlər toplanır." : "İstiqamətlər əksdir — çıxılır."}` });
        }
        if (kind === "yaxin") {
          const a = rnd(8, 30), b = rnd(8, 30);
          return R(a + b, "m/s", { text: `İki avtomobil bir-birinə doğru gedir: biri ${a} m/s, o biri ${b} m/s sürətlə (yerə nəzərən). Birinci avtomobilin sürücüsü ikincinin ona nəzərən hansı sürətlə yaxınlaşdığını görür?`,
            solution: `Birinciyə nəzərən ikincinin sürəti: ${a} + ${b} = ${a + b} m/s. Üz-üzə hərəkətdə sürətlər toplanır.` });
        }
        if (kind === "yaxin2") {
          const a = rnd(8, 25), b = rnd(8, 25);
          return R(b, "m/s", { text: `Avtomobil yerə nəzərən ${a} m/s sürətlə gedir. Sürücü qarşıdan gələn maşının ona nəzərən ${a + b} m/s sürətlə yaxınlaşdığını görür. Qarşıdan gələn maşının yerə nəzərən sürəti nə qədərdir?`,
            solution: `Üz-üzə hərəkətdə nisbi sürət = ${a} + v. ${a + b} = ${a} + v → v = ${b} m/s.` });
        }
        if (kind === "uzaq") {
          const a = rnd(10, 25), c = rnd(2, 9);
          return R(a + c, "m/s", { text: `Sürücü ${a} m/s sürətlə gedir. O, qabaqdakı maşının ona nəzərən ${c} m/s sürətlə uzaqlaşdığını görür (maşın eyni istiqamətdə gedir). Qabaqdakı maşının yerə nəzərən sürəti nə qədərdir?`,
            solution: `Eyni istiqamətdə nisbi sürət fərqdir: v − ${a} = ${c} → v = ${a + c} m/s.` });
        }
        const P = [18, 36, 54, 72, 90, 108, 126, 144];
        let a, b; do { a = pick(P); b = pick(P); } while (a === b);
        return R((a + b) / 3.6, "m/s", { text: `İki qatar paralel relslərdə bir-birinə doğru gedir: ${a} km/saat və ${b} km/saat sürətlə. Birinci qatardakı sərnişin ikinci qatarın ona nəzərən sürətini m/s ilə nə qədər görür?`,
          solution: `Üz-üzə: ${a} + ${b} = ${a + b} km/saat. m/s-ə: ${a + b}/3,6 = ${F((a + b) / 3.6)} m/s.` });
      } },
    { id: "cay", ad: "Çayı keçmək", izah: "Qayığın sahilə nəzərən sürəti = suya nəzərən sürət + cərəyanın sürəti (vektor cəmi). Sahilə perpendikulyar yalnız qayığın öz sürətinin perpendikulyar hissəsi təsir edir.",
      gen() {
        const kind = pick(["vaxt", "surus", "net", "duz", "duzT", "bucaq", "gedgel"]);
        if (kind === "vaxt" || kind === "surus") {
          const v = rnd(2, 8), u = rnd(1, 6), t = rnd(5, 40), d = v * t;
          const base = `Çayın eni ${d} m, qayığın suya nəzərən sürəti ${v} m/s, cərəyanın sürəti ${u} m/s. Qayığın burnu sahilə perpendikulyar yönəlib.`;
          if (kind === "vaxt") return R(t, "s", { svg: river("perp"), text: base + " Qayıq qarşı sahilə neçə saniyəyə çatar?",
            solution: `Sahilə perpendikulyar istiqamətdə qayığı yalnız onun öz sürəti (${v} m/s) aparır; cərəyan bu istiqamətdə sürət vermir. t = d/v = ${d}/${v} = ${t} s.` });
          return R(u * t, "m", { svg: river("perp"), text: base + " Qayıq qarşı sahilə çatanda cərəyan onu başlanğıc nöqtənin düz qarşısından neçə metr aşağı aparır?",
            solution: `t = d/v = ${d}/${v} = ${t} s. Bu müddətdə qayıq cərəyanla ${u} m/s sürətlə sürüşür: s = u·t = ${u}·${t} = ${u * t} m.` });
        }
        if (kind === "net") {
          const [a, b, c] = triple(5), swap = Math.random() < .5, v = swap ? a : b, u = swap ? b : a;
          return R(c, "m/s", { svg: river("perp"), text: `Qayığın suya nəzərən sürəti ${v} m/s-dir və o, cərəyana perpendikulyar üzür. Cərəyanın sürəti ${u} m/s-dir. Qayığın sahilə nəzərən sürəti nə qədərdir?`,
            solution: `Sürətlər perpendikulyardır, Pifaqor: v_nəticə = √(${v}² + ${u}²) = √${v * v + u * u} = ${c} m/s.` });
        }
        if (kind === "duz" || kind === "duzT") {
          const [a, b, c] = triple(4), t = rnd(5, 30), d = b * t, u = a, v = c;
          const base = `Çayın eni ${d} m, cərəyanın sürəti ${u} m/s, qayığın suya nəzərən sürəti ${v} m/s. Qayıq elə yönəldilib ki, düz qarşı nöqtəyə çatır (cərəyan aparmır).`;
          if (kind === "duz") return R(b, "m/s", { svg: river("straight"), text: base + " Qayığın sahilə nəzərən sürəti nə qədərdir?",
            solution: `Cərəyanın ${u} m/s sürətini kompensasiya etmək üçün qayığın sürətinin bir hissəsi cərəyana qarşı sərf olunur. Qalan: √(${v}² − ${u}²) = √${v * v - u * u} = ${b} m/s.` });
          return R(t, "s", { svg: river("straight"), text: base + " Qayıq qarşı sahilə neçə saniyəyə çatar?",
            solution: `Sahilə perpendikulyar sürət √(${v}² − ${u}²) = ${b} m/s. t = ${d}/${b} = ${t} s.` });
        }
        if (kind === "bucaq") {
          const u = rnd(1, 5);
          return R(30, "°", { svg: river("straight"), tol: 0.01, text: `Cərəyanın sürəti ${u} m/s, qayığın suya nəzərən sürəti ${2 * u} m/s. Qayıq düz qarşı nöqtəyə çatmaq istəyir. Qayığın burnunu sahilə perpendikulyar istiqamətdən cərəyana qarşı neçə dərəcə döndərmək lazımdır?`,
            solution: `Cərəyanı kompensasiya etmək üçün v·sin α = u → sin α = ${u}/${2 * u} = 1/2 → α = 30°.` });
        }
        let v, u, L, t; do { v = rnd(3, 10); u = rnd(1, v - 1); L = 10 * rnd(1, 30); t = 2 * L * v / (v * v - u * u); } while (!nice(t, 1) || t > 400);
        return R(t, "s", { text: `Çayda qayığın suya nəzərən sürəti ${v} m/s, cərəyanın sürəti ${u} m/s. Qayıq cərəyanla ${L} m üzür, sonra geri qayıdır (eyni mühərrik rejimi). Bütün yolun vaxtı nə qədərdir?`,
          solution: `Cərəyanla: sürət ${v} + ${u} = ${v + u} m/s, vaxt ${L}/${v + u} = ${F(L / (v + u))} s. Əks: sürət ${v} − ${u} = ${v - u} m/s, vaxt ${L}/${v - u} = ${F(L / (v - u))} s. Cəmi ${F(t)} s.` });
      } },
    { id: "yagis", ad: "Yağış, külək, hərəkətli sistem", izah: "Hərəkətli cismə nəzərən sürət: v_nisbi = v_cisim − v_sistem (vektor fərqi). Yağış şaquli, avtomobil üfüqi gedirsə — bunlar perpendikulyar vektorlardır.",
      gen() {
        const kind = pick(["rel", "rel2", "tan", "v45", "vc"]);
        if (kind === "rel") {
          const [a, b, c] = triple(5), swap = Math.random() < .5, vr = swap ? a : b, vc = swap ? b : a;
          return R(c, "m/s", { svg: rain(vr, vc), text: `Yağış damcıları şaquli aşağı ${vr} m/s sürətlə düşür. Avtomobil üfüqi yolda ${vc} m/s sürətlə gedir. Damcıların avtomobilə nəzərən sürəti nə qədərdir?`,
            solution: `Avtomobilin içindən baxanda damcılar həm aşağı (${vr} m/s), həm geriyə (${vc} m/s) hərəkət edir. Vektorlar perpendikulyardır: √(${vr}² + ${vc}²) = ${c} m/s.` });
        }
        if (kind === "rel2") {
          const [a, b, c] = triple(4), ctx = pick([
            [`Velosipedçi şimala ${a} m/s sürətlə gedir. Külək yerə nəzərən qərbdən şərqə ${b} m/s sürətlə əsir. Velosipedçinin hiss etdiyi küləyin sürəti nə qədərdir?`, `Hiss olunan külək = külək − velosipedçi. Şərq (${b}) və cənub (${a}) komponentləri perpendikulyardır: √(${a}² + ${b}²) = ${c} m/s.`],
            [`Qayıq şərqə ${b} m/s sürətlə gedir, külək isə yerə nəzərən cənubdan şimala ${a} m/s əsir. Qayıqdakı bayraq hansı sürətli küləyi "hiss edir"?`, `Qayığa nəzərən külək: şimal komponenti ${a} m/s, qərb komponenti ${b} m/s (qayıq şərqə gedir). Pifaqor: √(${a}² + ${b}²) = ${c} m/s.`]]);
          return R(c, "m/s", { text: ctx[0], solution: ctx[1] });
        }
        if (kind === "tan") {
          const vr = pick([4, 5, 8, 10, 12, 20]), q = pick([0.25, 0.5, 0.75, 1.25, 1.5, 2]), vc = q * vr;
          return R(q, "", { text: `Yağış damcıları şaquli aşağı ${vr} m/s sürətlə düşür. Avtomobil ${F(vc)} m/s sürətlə gedir. Yan şüşədə damcıların izi şaquli ilə α bucağı əmələ gətirir. tg α nəyə bərabərdir?`,
            solution: `İz nisbi sürətin istiqamətidir. tg α = (üfüqi komponent)/(şaquli komponent) = v_avto/v_yağış = ${F(vc)}/${vr} = ${F(q)}.` });
        }
        if (kind === "v45") {
          const vc = rnd(3, 25);
          return R(vc, "m/s", { text: `Avtomobil ${vc} m/s sürətlə gedir. Şaquli düşən yağışın damcıları yan şüşədə şaquli ilə 45° bucaq əmələ gətirən iz buraxır. Damcılar yerə nəzərən hansı sürətlə düşür?`,
            solution: `45° olduqda üfüqi və şaquli komponentlər bərabərdir: v_yağış = v_avto = ${vc} m/s.` });
        }
        const vr = pick([4, 8, 12, 16, 20]), q = pick([0.25, 0.5, 0.75, 1.25, 1.5]), vc = q * vr;
        return R(vc, "m/s", { text: `Yağış damcıları şaquli aşağı ${vr} m/s sürətlə düşür. Avtomobilin yan şüşəsindəki izlər üçün tg α = ${F(q)} (α — şaquli ilə bucaq). Avtomobil hansı sürətlə gedir?`,
          solution: `tg α = v_avto/v_yağış → v_avto = ${F(q)}·${vr} = ${F(vc)} m/s.` });
      } },
    { id: "gorus", ad: "Görüş və yetişmə", izah: "Üz-üzə: aralarındakı məsafə v₁ + v₂ sürətlə azalır. Eyni istiqamətdə: |v₁ − v₂| ilə. Qatarların bir-birinin yanından keçməsi: yol = L₁ + L₂.",
      gen() {
        const kind = pick(["vaxt", "yer", "yetis", "qatar", "qatar2", "gec", "milcek"]);
        if (kind === "vaxt" || kind === "yer") {
          const v1 = rnd(2, 15), v2 = rnd(2, 15), t = rnd(2, 40), d = (v1 + v2) * t;
          const base = `A və B şəhərləri arasında məsafə ${d} m-dir (bir düz yol). A-dan B-yə ${v1} m/s, B-dən A-ya ${v2} m/s sürətlə iki nəfər eyni anda yola çıxır.`;
          if (kind === "vaxt") return R(t, "s", { text: base + " Neçə saniyə sonra görüşəcəklər?", solution: `Yaxınlaşma sürəti ${v1} + ${v2} = ${v1 + v2} m/s. t = ${d}/${v1 + v2} = ${t} s.` });
          return R(v1 * t, "m", { text: base + " Görüş A-dan neçə metr məsafədə baş verər?", solution: `t = ${d}/(${v1} + ${v2}) = ${t} s. A-dan çıxan ${t} s-də ${v1}·${t} = ${v1 * t} m gedir.` });
        }
        if (kind === "yetis") {
          let v1, v2, t, d; do { v1 = rnd(3, 20); v2 = rnd(1, v1 - 1); t = rnd(3, 60); d = (v1 - v2) * t; } while (v1 === v2);
          return R(t, "s", { text: `Velosipedçi ${v1} m/s sürətlə gedir. Onun ${d} m qabağında piyada ${v2} m/s sürətlə eyni istiqamətdə gedir. Velosipedçi piyadanı neçə saniyəyə yetişər?`,
            solution: `Yetişmə sürəti ${v1} − ${v2} = ${v1 - v2} m/s. t = ${d}/${v1 - v2} = ${t} s.` });
        }
        if (kind === "qatar") {
          let L1, L2, v1, v2, t; do { L1 = 10 * rnd(5, 30); L2 = 10 * rnd(5, 30); v1 = rnd(10, 30); v2 = rnd(10, 30); t = (L1 + L2) / (v1 + v2); } while (!nice(t, 1) || t > 40);
          return R(t, "s", { text: `Uzunluğu ${L1} m olan qatar ${v1} m/s sürətlə, uzunluğu ${L2} m olan qatar ${v2} m/s sürətlə paralel yollarda bir-birinə doğru gedir. Qatarlar bir-birinin yanından neçə saniyə ərzində keçir (başların qarşılaşmasından quyrucuqların ayrılmasına qədər)?`,
            solution: `Nisbi sürət ${v1} + ${v2} = ${v1 + v2} m/s. Nisbi yol L₁ + L₂ = ${L1 + L2} m. t = ${L1 + L2}/${v1 + v2} = ${F(t)} s.` });
        }
        if (kind === "qatar2") {
          let L1, L2, v1, v2, t; do { L1 = 10 * rnd(5, 30); L2 = 10 * rnd(5, 30); v1 = rnd(12, 35); v2 = rnd(8, 30); t = (L1 + L2) / (v1 - v2); } while (v1 <= v2 || !nice(t, 1) || t > 200);
          return R(t, "s", { text: `Uzunluğu ${L1} m olan sürətli qatar ${v1} m/s sürətlə, uzunluğu ${L2} m olan yük qatarını ${v2} m/s sürətlə eyni istiqamətdə ötür. Ötmə (sürətli qatarın başı yük qatarının quyruğuna çatandan öz quyruğu yük qatarının başını keçənə qədər) neçə saniyə çəkir?`,
            solution: `Nisbi sürət ${v1} − ${v2} = ${v1 - v2} m/s. Nisbi yol L₁ + L₂ = ${L1 + L2} m. t = ${L1 + L2}/${v1 - v2} = ${F(t)} s.` });
        }
        if (kind === "gec") {
          let v1, v2, tau, t; do { v1 = rnd(2, 12); v2 = v1 + rnd(1, 8); tau = rnd(2, 30); t = v1 * tau / (v2 - v1); } while (!nice(t, 1) || t > 200);
          return R(t, "s", { text: `Bir nöqtədən velosipedçi ${v1} m/s sürətlə yola çıxdı. ${tau} s sonra həmin nöqtədən ikinci velosipedçi eyni istiqamətdə ${v2} m/s sürətlə çıxdı. İkinci velosipedçi yola çıxandan neçə saniyə sonra birincini yetişər?`,
            solution: `İkinci çıxanda birinci artıq ${v1}·${tau} = ${v1 * tau} m irəlidədir. Yetişmə sürəti ${v2} − ${v1} = ${v2 - v1} m/s. t = ${v1 * tau}/${v2 - v1} = ${F(t)} s.` });
        }
        let v1, v2, w, t, d; do { v1 = rnd(2, 8); v2 = rnd(2, 8); w = rnd(10, 20); t = rnd(5, 40); d = (v1 + v2) * t; } while (w <= Math.max(v1, v2));
        return R(w * t, "m", { text: `İki velosipedçi arasındakı ${d} m məsafə ilə bir-birinə doğru ${v1} m/s və ${v2} m/s sürətlə yola çıxır. Eyni anda birincinin çıxdığı nöqtədən milçək ${w} m/s sürətlə uçur, ikinci velosipedçiyə çatıb geri qayıdır, birinciyə çatıb yenə qayıdır və s. (dönmə vaxtı sayılmır) — velosipedçilər görüşənə qədər. Milçək cəmi neçə metr uçub?`,
          solution: `Yol-yol yığmağa ehtiyac yoxdur. Velosipedçilər t = ${d}/(${v1} + ${v2}) = ${t} s-dən sonra görüşür. Milçək bu müddət ərzində fasiləsiz uçub: ${w}·${t} = ${w * t} m.` });
      } },
    { id: "tecil", ad: "Nisbi təcil", izah: "a_nisbi = a₁ − a₂ (vektor). Sərbəst düşən iki cismin nisbi təcili 0-dır — onların bir-birinə nəzərən hərəkəti bərabərsürətlidir. Məsafə: x_nisbi = v_nisbi·t + a_nisbi·t²/2.",
      gen() {
        const kind = pick(["dusur", "dusurH", "iki", "ikiX", "yetis", "yetisS", "serbest"]);
        if (kind === "dusur" || kind === "dusurH") {
          let v0, t; do { v0 = pick([10, 15, 20, 25, 30]); t = pick([0.5, 1, 1.5, 2, 2.5]); } while (t > v0 / 5 - 0.5);
          const H = v0 * t, y = v0 * t - 5 * t * t;
          const base = `Yerdən ${H} m hündürlükdəki nöqtədən daş sükunətdən buraxılır. Eyni anda onun düz altından, yerdən ikinci daş ${v0} m/s sürətlə şaquli yuxarı atılır. Havanın müqaviməti yoxdur.`;
          if (kind === "dusur") return R(t, "s", { text: base + " Neçə saniyə sonra daşlar qarşılaşacaq?", solution: `Hər iki daşın təcili g-dir, nisbi təcil sıfırdır. Birinci daşa nəzərən ikinci ${v0} m/s sabit sürətlə yaxınlaşır. t = H/v₀ = ${H}/${v0} = ${F(t)} s. (g nəticəyə təsir etmir.)` });
          return R(y, "m", { text: base + " Qarşılaşma yerdən neçə metr hündürlükdə baş verəcək?", solution: `Nisbi təcil 0 → t = H/v₀ = ${H}/${v0} = ${F(t)} s. İkinci daş qalxır: y = v₀t − gt²/2 = ${v0}·${F(t)} − 5·${F(t * t)} = ${F(y)} m.` });
        }
        if (kind === "iki" || kind === "ikiX") {
          const a1 = rnd(1, 6), a2 = rnd(1, 6), t = pick([2, 3, 4, 5, 6, 8, 10]), d = (a1 + a2) * t * t / 2;
          const base = `Düz yolun iki ucunda — aralarında ${F(d)} m məsafə — iki araba sükunətdən bir-birinə doğru eyni anda hərəkətə başlayır: birinin təcili ${a1} m/s², digərinin ${a2} m/s².`;
          if (kind === "iki") return R(t, "s", { text: base + " Neçə saniyə sonra qarşılaşacaqlar?", solution: `Nisbi təcil ${a1} + ${a2} = ${a1 + a2} m/s² (üz-üzə). d = (a₁ + a₂)t²/2 → t² = 2·${F(d)}/${a1 + a2} = ${t * t} → t = ${t} s.` });
          return R(a1 * t * t / 2, "m", { text: base + " Qarşılaşma ilk arabanın başladığı nöqtədən neçə metr məsafədə baş verəcək?", solution: `d = (a₁ + a₂)t²/2 → t² = 2·${F(d)}/${a1 + a2} = ${t * t}, t = ${t} s. İlk araba keçir: a₁t²/2 = ${a1}·${t * t}/2 = ${F(a1 * t * t / 2)} m.` });
        }
        if (kind === "yetis" || kind === "yetisS") {
          let v, a, t; do { v = rnd(5, 30); a = pick([1, 2, 2.5, 4, 5]); t = 2 * v / a; } while (!nice(t, 1) || t > 40);
          const base = `Yük maşını ${v} m/s sabit sürətlə gedərək dayanmış avtomobilin yanından keçdi. Həmin anda avtomobil sükunətdən ${F(a)} m/s² sabit təcillə maşını yetişməyə başladı.`;
          if (kind === "yetis") return R(t, "s", { text: base + " Avtomobil maşını neçə saniyəyə yetişər?", solution: `Yetişəndə yollar bərabərdir: v·t = a·t²/2 → t = 2v/a = ${2 * v}/${F(a)} = ${F(t)} s.` });
          return R(v * t, "m", { text: base + " Yetişmə başlanğıc nöqtədən neçə metr məsafədə baş verər?", solution: `v·t = a·t²/2 → t = 2v/a = ${F(t)} s. Yol: s = v·t = ${v}·${F(t)} = ${F(v * t)} m.` });
        }
        const u = rnd(2, 15), t = rnd(2, 12);
        return R(u * t, "m", { text: `Eyni hündürlükdən eyni anda iki daş atılır: biri sükunətdən buraxılır, digəri ${u} m/s sürətlə şaquli aşağı atılır. Havanın müqaviməti yoxdur. ${t} s sonra daşlar arasındakı məsafə nə qədər olar (daşlar yerə düşməyib)?`,
          solution: `İkisinin təcili g-dir, nisbi təcil 0. Ona görə birinə nəzərən o biri ${u} m/s sabit sürətlə uzaqlaşır: d = ${u}·${t} = ${u * t} m.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          const [v, u, c] = pick([[4, 3, 5], [8, 6, 10], [12, 5, 13], [3, 4, 5], [5, 12, 13], [6, 8, 10]]), t = rnd(5, 30), d = v * t, s = u * t, L = c * t;
          task = `Çayın eni ${d} m, qayığın suya nəzərən sürəti ${v} m/s, cərəyanın sürəti ${u} m/s. Qayıq burnu sahilə perpendikulyar üzür. Qayığın qarşı sahiyə qədər getdiyi yol (sahilə nəzərən) nə qədərdir?`;
          const tw = d / c, sw = (v + u) * t, Lw = d + s;
          steps = [`Sahilə perpendikulyar istiqamətdə sürət v-dir: t = d/v = ${d}/${v} = ${t} s.`,
            `Cərəyan qayığı yana aparır: s = u·t = ${u}·${t} = ${s} m.`,
            `Yol: L = √(d² + s²) = √(${d}² + ${s}²) = ${L} m.`];
          if (bad === 0) { steps[0] = `Qayığın sahilə nəzərən sürəti c = √(${v}² + ${u}²) = ${c} m/s, t = d/c = ${d}/${c} = ${F(tw)} s.`; steps[1] = `s = u·t = ${u}·${F(tw)} = ${F(u * tw)} m.`; steps[2] = `Yol: L = √(${d}² + ${F(u * tw)}²) = ${F(Math.hypot(d, u * tw))} m.`; }
          if (bad === 1) { steps[1] = `Qayıq cərəyanla birlikdə sürüşür: s = (v + u)·t = ${v + u}·${t} = ${sw} m.`; steps[2] = `Yol: L = √(${d}² + ${sw}²) = ${F(Math.hypot(d, sw))} m.`; }
          if (bad === 2) steps[2] = `Yol: L = d + s = ${d} + ${s} = ${Lw} m.`;
          why = [`1-ci addım: sahilə perpendikulyar yerdəyişməni yalnız qayığın öz sürəti (${v} m/s) yaradır; nəticəvi sürətə bölmək olmaz. t = ${t} s. Düz cavab: ${L} m.`,
            `2-ci addım: yana sürüşməni yalnız cərəyan yaradır: s = u·t = ${s} m. Düz cavab: ${L} m.`,
            `3-cü addım: d və s perpendikulyardır, onlar Pifaqorla birləşir, cəmlənmir. L = √(${d}² + ${s}²) = ${L} m.`][bad];
        } else {
          let v1, v2, t, d; do { v1 = rnd(4, 14); v2 = rnd(2, v1 - 1); t = rnd(3, 40); d = (v1 - v2) * t; } while (v1 === v2);
          task = `Eyni istiqamətdə gedən iki velosipedçidən arxadakı ${v1} m/s, qabaqdakı ${v2} m/s sürətlə hərəkət edir. Aralarında ${d} m məsafə var. Arxadakı qabaqdakını neçə saniyəyə yetişər?`;
          steps = [`İkinci velosipedçini durğun sayırıq: birinci ona nəzərən ${v1} − ${v2} = ${v1 - v2} m/s sürətlə gedir.`,
            `Birincinin nisbi yolu d = ${d} m-dir.`,
            `t = d/v_nisbi = ${d}/${v1 - v2} = ${t} s.`];
          if (bad === 0) steps[0] = `Nisbi sürət ${v1} + ${v2} = ${v1 + v2} m/s (sürətlər toplanır).`, steps[2] = `t = ${d}/${v1 + v2} = ${F(+(d / (v1 + v2)).toFixed(3))} s.`;
          if (bad === 1) steps[1] = `Birinci velosipedçi ${d} m getməlidir, ona görə yetişmə vaxtını onun öz sürəti ilə hesablayırıq.`, steps[2] = `t = ${d}/${v1} = ${F(+(d / v1).toFixed(3))} s.`;
          if (bad === 2) steps[2] = `t = d·v_nisbi = ${d}·${v1 - v2} = ${d * (v1 - v2)} s.`;
          why = [`1-ci addım: eyni istiqamətdə nisbi sürət fərqdir: ${v1} − ${v2} = ${v1 - v2} m/s. Düz cavab: ${t} s.`,
            `2-ci addım: qabaqdakı da hərəkət edir, ona görə yalnız ${v1} m/s ilə ${d} m getməklə yetişmək olmaz. Nisbi sürətlə: ${d}/${v1 - v2} = ${t} s.`,
            `3-cü addım: vaxt = yol/sürət, hasil yox. t = ${d}/${v1 - v2} = ${t} s.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Eskalator, təyyarə və külək, sal, qatar pəncərəsi — hamısında 'nəyə nəzərən?' sualını ver.",
      gen() {
        const kind = pick(["eskalator", "ucus", "ucus2", "sal", "qatar"]);
        if (kind === "eskalator") {
          let t1, t2, t; do { t1 = 5 * rnd(2, 24); t2 = 5 * rnd(2, 24); t = t1 * t2 / (t1 + t2); } while (t1 === t2 || !nice(t, 1));
          return R(t, "s", { text: `Eskalatorda dayanıb qalxanda yuxarı çatmaq ${t1} s çəkir. Dayanmış eskalatorda Fikrət eyni sürətlə yeriyərək ${t2} s-ə qalxır. Eskalator işləyərkən Fikrət yeriyərək neçə saniyəyə qalxar?`,
            solution: `Uzunluğu L götürək. Eskalatorun sürəti L/${t1}, Fikrətin sürəti L/${t2}. Eyni istiqamətdə sürətlər toplanır: L/t = L/${t1} + L/${t2} → t = ${t1}·${t2}/(${t1} + ${t2}) = ${F(t)} s.` });
        }
        if (kind === "ucus") {
          const [a, b, c] = triple(4), swap = Math.random() < .5, v = swap ? b : a, u = swap ? a : b;
          return R(c, "m/s", { text: `Təyyarənin havaya nəzərən sürəti ${v} m/s-dir və o, şimala yönəlib. Külək yerə nəzərən qərbdən şərqə ${u} m/s sürətlə əsir. Təyyarənin yerə nəzərən sürəti nə qədərdir?`,
            solution: `Yerə nəzərən sürət = havaya nəzərən sürət + küləyin sürəti. Vektorlar perpendikulyardır: √(${v}² + ${u}²) = ${c} m/s.` });
        }
        if (kind === "ucus2") {
          const v = pick([50, 60, 80, 100, 120, 150, 200]), u = pick([10, 15, 20, 25, 30]), head = Math.random() < .5, r = head ? v - u : v + u;
          return R(r, "m/s", { text: `Təyyarənin havaya nəzərən sürəti ${v} m/s-dir. Külək təyyarənin uçuş xətti boyunca ${u} m/s sürətlə əsir və ${head ? "təyyarəyə qarşıdır" : "təyyarənin arxasındadır"}. Təyyarənin yerə nəzərən sürəti nə qədərdir?`,
            solution: `${head ? "Qarşı külək: sürətlər çıxılır" : "Arxadan külək: sürətlər toplanır"}: ${v} ${head ? "−" : "+"} ${u} = ${r} m/s.` });
        }
        if (kind === "sal") {
          let t1, t2, t; do { t1 = rnd(5, 40); t2 = rnd(t1 + 1, 60); t = 2 * t1 * t2 / (t2 - t1); } while (!nice(t, 1) || t > 500);
          return R(t, "dəq", { text: `Motorlu qayıq A pristanından B pristanına cərəyanla ${t1} dəqiqəyə, B-dən A-ya cərəyana qarşı ${t2} dəqiqəyə gedir (mühərrik eyni rejimdə). Sal A-dan B-yə yalnız cərəyanla neçə dəqiqəyə çatar?`,
            solution: `L məsafəsini götürək. v + u = L/${t1}, v − u = L/${t2}. Çıxsaq: 2u = L(1/${t1} − 1/${t2}) = L·${t2 - t1}/${t1 * t2} → u = L·${t2 - t1}/${2 * t1 * t2}. Sal: t = L/u = ${2 * t1 * t2}/${t2 - t1} = ${F(t)} dəq.` });
        }
        let L, v1, v2, t; do { v1 = rnd(10, 30); v2 = rnd(8, 30); t = rnd(3, 12); L = (v1 + v2) * t; } while (false);
        return R(L, "m", { text: `Fikrət qatar pəncərəsindən baxır. Onun qatarı ${v1} m/s sürətlə gedir. Qarşıdan gələn digər qatar ${v2} m/s sürətlə gedir və pəncərənin yanından ${t} s ərzində keçdi. Qarşıdan gələn qatarın uzunluğu nə qədərdir?`,
          solution: `Fikrətə nəzərən qarşıdan gələn qatarın sürəti ${v1} + ${v2} = ${v1 + v2} m/s. Keçmə vaxtında o, öz uzunluğu qədər yol gedir: L = ${v1 + v2}·${t} = ${L} m.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-nisbi-herekat", title: "Nisbi hərəkət", fenn: "fizika", link: "dersler/fiz-nisbi-herekat.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: m/s, m, s). Onluq kəsr vergül və ya nöqtə ilə: 2,5. g = 10 m/s².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["sur", "sur", "cay", "cay", "yagis", "gorus", "gorus", "tecil", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-nisbi-herekat.html")) b.push("dersler/fiz-nisbi-herekat.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
