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
    const s = sv("svg", { viewBox: "0 0 300 170", class: "oy-svg", role: "img", "aria-label": "Çay, axın və qayığın sürət vektorları" });
    s.append(sv("rect", { x: 0, y: 30, width: 300, height: 110, fill: "var(--accent-soft)", opacity: 0.5 }));
    s.append(sv("line", { x1: 0, y1: 30, x2: 300, y2: 30, stroke: INK, "stroke-width": 2 }));
    s.append(sv("line", { x1: 0, y1: 140, x2: 300, y2: 140, stroke: INK, "stroke-width": 2 }));
    label(s, 270, 90, "axın →");
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
    { id: "cay", ad: "Çayı keçmək", izah: "Qayığın sahilə nəzərən sürəti = suya nəzərən sürət + axının sürəti (vektor cəmi). Sahilə perpendikulyar yalnız qayığın öz sürətinin perpendikulyar hissəsi təsir edir.",
      gen() {
        const kind = pick(["vaxt", "surus", "net", "duz", "duzT", "bucaq", "gedgel"]);
        if (kind === "vaxt" || kind === "surus") {
          const v = rnd(2, 8), u = rnd(1, 6), t = rnd(5, 40), d = v * t;
          const base = `Çayın eni ${d} m, qayığın suya nəzərən sürəti ${v} m/s, axının sürəti ${u} m/s. Qayığın burnu sahilə perpendikulyar yönəlib.`;
          if (kind === "vaxt") return R(t, "s", { svg: river("perp"), text: base + " Qayıq qarşı sahilə neçə saniyəyə çatar?",
            solution: `Sahilə perpendikulyar istiqamətdə qayığı yalnız onun öz sürəti (${v} m/s) aparır; axın bu istiqamətdə sürət vermir. t = d/v = ${d}/${v} = ${t} s.` });
          return R(u * t, "m", { svg: river("perp"), text: base + " Qayıq qarşı sahilə çatanda axın onu başlanğıc nöqtənin düz qarşısından neçə metr aşağı aparır?",
            solution: `t = d/v = ${d}/${v} = ${t} s. Bu müddətdə qayıq axınla ${u} m/s sürətlə sürüşür: s = u·t = ${u}·${t} = ${u * t} m.` });
        }
        if (kind === "net") {
          const [a, b, c] = triple(5), swap = Math.random() < .5, v = swap ? a : b, u = swap ? b : a;
          return R(c, "m/s", { svg: river("perp"), text: `Qayığın suya nəzərən sürəti ${v} m/s-dir və o, axına perpendikulyar üzür. Axının sürəti ${u} m/s-dir. Qayığın sahilə nəzərən sürəti nə qədərdir?`,
            solution: `Sürətlər perpendikulyardır, Pifaqor: v_nəticə = √(${v}² + ${u}²) = √${v * v + u * u} = ${c} m/s.` });
        }
        if (kind === "duz" || kind === "duzT") {
          const [a, b, c] = triple(4), t = rnd(5, 30), d = b * t, u = a, v = c;
          const base = `Çayın eni ${d} m, axının sürəti ${u} m/s, qayığın suya nəzərən sürəti ${v} m/s. Qayıq elə yönəldilib ki, düz qarşı nöqtəyə çatır (axın aparmır).`;
          if (kind === "duz") return R(b, "m/s", { svg: river("straight"), text: base + " Qayığın sahilə nəzərən sürəti nə qədərdir?",
            solution: `Axının ${u} m/s sürətini kompensasiya etmək üçün qayığın sürətinin bir hissəsi axına qarşı sərf olunur. Qalan: √(${v}² − ${u}²) = √${v * v - u * u} = ${b} m/s.` });
          return R(t, "s", { svg: river("straight"), text: base + " Qayıq qarşı sahilə neçə saniyəyə çatar?",
            solution: `Sahilə perpendikulyar sürət √(${v}² − ${u}²) = ${b} m/s. t = ${d}/${b} = ${t} s.` });
        }
        if (kind === "bucaq") {
          const u = rnd(1, 5);
          return R(30, "°", { svg: river("straight"), tol: 0.01, text: `Axının sürəti ${u} m/s, qayığın suya nəzərən sürəti ${2 * u} m/s. Qayıq düz qarşı nöqtəyə çatmaq istəyir. Qayığın burnunu sahilə perpendikulyar istiqamətdən axına qarşı neçə dərəcə döndərmək lazımdır?`,
            solution: `Axını kompensasiya etmək üçün v·sin α = u → sin α = ${u}/${2 * u} = 1/2 → α = 30°.` });
        }
        let v, u, L, t; do { v = rnd(3, 10); u = rnd(1, v - 1); L = 10 * rnd(1, 30); t = 2 * L * v / (v * v - u * u); } while (!nice(t, 1) || t > 400);
        return R(t, "s", { text: `Çayda qayığın suya nəzərən sürəti ${v} m/s, axının sürəti ${u} m/s. Qayıq axınla ${L} m üzür, sonra geri qayıdır (eyni mühərrik rejimi). Bütün yolun vaxtı nə qədərdir?`,
          solution: `Axınla: sürət ${v} + ${u} = ${v + u} m/s, vaxt ${L}/${v + u} = ${F(L / (v + u))} s. Əks: sürət ${v} − ${u} = ${v - u} m/s, vaxt ${L}/${v - u} = ${F(L / (v - u))} s. Cəmi ${F(t)} s.` });
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
          task = `Çayın eni ${d} m, qayığın suya nəzərən sürəti ${v} m/s, axının sürəti ${u} m/s. Qayıq burnu sahilə perpendikulyar üzür. Qayığın qarşı sahiyə qədər getdiyi yol (sahilə nəzərən) nə qədərdir?`;
          const tw = d / c, sw = (v + u) * t, Lw = d + s;
          steps = [`Sahilə perpendikulyar istiqamətdə sürət v-dir: t = d/v = ${d}/${v} = ${t} s.`,
            `Axın qayığı yana aparır: s = u·t = ${u}·${t} = ${s} m.`,
            `Yol: L = √(d² + s²) = √(${d}² + ${s}²) = ${L} m.`];
          if (bad === 0) { steps[0] = `Qayığın sahilə nəzərən sürəti c = √(${v}² + ${u}²) = ${c} m/s, t = d/c = ${d}/${c} = ${F(tw)} s.`; steps[1] = `s = u·t = ${u}·${F(tw)} = ${F(u * tw)} m.`; steps[2] = `Yol: L = √(${d}² + ${F(u * tw)}²) = ${F(Math.hypot(d, u * tw))} m.`; }
          if (bad === 1) { steps[1] = `Qayıq axınla birlikdə sürüşür: s = (v + u)·t = ${v + u}·${t} = ${sw} m.`; steps[2] = `Yol: L = √(${d}² + ${sw}²) = ${F(Math.hypot(d, sw))} m.`; }
          if (bad === 2) steps[2] = `Yol: L = d + s = ${d} + ${s} = ${Lw} m.`;
          why = [`1-ci addım: sahilə perpendikulyar yerdəyişməni yalnız qayığın öz sürəti (${v} m/s) yaradır; nəticəvi sürətə bölmək olmaz. t = ${t} s. Düz cavab: ${L} m.`,
            `2-ci addım: yana sürüşməni yalnız axın yaradır: s = u·t = ${s} m. Düz cavab: ${L} m.`,
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
          return R(t, "s", { text: `Eskalatorda dayanıb qalxanda yuxarı çatmaq ${t1} s çəkir. Dayanmış eskalatorda Elvin eyni sürətlə yeriyərək ${t2} s-ə qalxır. Eskalator işləyərkən Elvin yeriyərək neçə saniyəyə qalxar?`,
            solution: `Uzunluğu L götürək. Eskalatorun sürəti L/${t1}, Elvinin sürəti L/${t2}. Eyni istiqamətdə sürətlər toplanır: L/t = L/${t1} + L/${t2} → t = ${t1}·${t2}/(${t1} + ${t2}) = ${F(t)} s.` });
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
          return R(t, "dəq", { text: `Motorlu qayıq A pristanından B pristanına axınla ${t1} dəqiqəyə, B-dən A-ya axına qarşı ${t2} dəqiqəyə gedir (mühərrik eyni rejimdə). Sal A-dan B-yə yalnız axınla neçə dəqiqəyə çatar?`,
            solution: `L məsafəsini götürək. v + u = L/${t1}, v − u = L/${t2}. Çıxsaq: 2u = L(1/${t1} − 1/${t2}) = L·${t2 - t1}/${t1 * t2} → u = L·${t2 - t1}/${2 * t1 * t2}. Sal: t = L/u = ${2 * t1 * t2}/${t2 - t1} = ${F(t)} dəq.` });
        }
        let L, v1, v2, t; do { v1 = rnd(10, 30); v2 = rnd(8, 30); t = rnd(3, 12); L = (v1 + v2) * t; } while (false);
        return R(L, "m", { text: `Elvin qatar pəncərəsindən baxır. Onun qatarı ${v1} m/s sürətlə gedir. Qarşıdan gələn digər qatar ${v2} m/s sürətlə gedir və pəncərənin yanından ${t} s ərzində keçdi. Qarşıdan gələn qatarın uzunluğu nə qədərdir?`,
          solution: `Elvinə nəzərən qarşıdan gələn qatarın sürəti ${v1} + ${v2} = ${v1 + v2} m/s. Keçmə vaxtında o, öz uzunluğu qədər yol gedir: L = ${v1 + v2}·${t} = ${L} m.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a figure, several steps;
  // the wrong options are the answers of typical mistakes. Questions 5, 7, 8 and 9 also use "Kinematika",
  // "Sərbəst düşmə" and "Atılan cisim" (relative acceleration is zero when both bodies feel only g).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const fm = x => F(+x.toFixed(4));
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  // <<kit  (string-based SVG helpers; the lesson tab figures are built from the same code)
  const FIG = (() => {
    const INK = "var(--ink,#17171a)", ACC = "var(--accent,#a32d2d)", MUT = "var(--muted,#6b6b73)", PAP = "var(--paper,#fff)", VEC = "var(--vec,#0c447c)", WAT = "var(--accent-soft,#f3dede)";
    const f = n => +(+n).toFixed(1);
    const ln = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
    const dash = (x1, y1, x2, y2, c = MUT) => ln(x1, y1, x2, y2, c, 1.5, ` stroke-dasharray="4 3"`);
    const tx = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${f(x)}" y="${f(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
    const ar = (x1, y1, x2, y2, c = ACC, w = 2.5) => ln(x1, y1, x2, y2, c, w, ` marker-end="url(#nh-ar)"`);
    const dot = (x, y, c = INK, r = 3.2) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${c}"/>`;
    const box = (x, y, w, h, fill = PAP) => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" fill="${fill}" stroke="${INK}" stroke-width="2"/>`;
    const svg = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" class="oy-svg" role="img" aria-label="${aria}"><defs><marker id="nh-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
    const river = (y1, y2) => `<rect x="0" y="${y1}" width="280" height="${y2 - y1}" fill="${WAT}" opacity="0.5"/>` + ln(0, y1, 280, y1) + ln(0, y2, 280, y2);
    const tick = (x1, y1, x2, y2) => ln(x1, y1, x2, y2, MUT, 1.5);
    const FIG = {};
    // boat aimed perpendicular: d across, s downstream, t crossing time
    FIG.drift = (d, s, t) => svg(280, 172, river(34, 140) + dash(100, 34, 100, 140) + ar(100, 138, 100, 78, ACC) + ar(100, 140, 228, 36, INK)
      + tick(100, 27, 230, 27) + tick(100, 22, 100, 32) + tick(230, 22, 230, 32) + tx(165, 17, `s = ${F(s)} m`)
      + tx(92, 92, `d = ${F(d)} m`, "end") + tx(92, 122, "burun", "end", ACC) + tx(190, 112, `t = ${F(t)} s`, "start")
      + ar(170, 158, 250, 158, MUT, 2) + tx(162, 162, "axın", "end", MUT), "Çay: qayığın burnu sahilə perpendikulyardır, axın qayığı aşağı aparır");
    // boat aimed upstream so that it reaches the point straight opposite
    FIG.straight = (d, u, v) => svg(280, 172, river(34, 140) + ar(160, 140, 160, 64, INK) + ar(160, 140, 98, 62, ACC) + ar(98, 62, 158, 62, VEC)
      + tx(112, 108, `v = ${F(v)} m/s`, "end", ACC) + tx(128, 54, `u = ${F(u)} m/s`, "middle", VEC)
      + tick(262, 34, 262, 140) + tick(257, 34, 267, 34) + tick(257, 140, 267, 140) + tx(254, 92, `d = ${F(d)} m`, "end")
      + ar(190, 124, 240, 124, MUT, 2) + tx(215, 116, "axın", "middle", MUT), "Çay: axının sürəti u, qayığın suya nəzərən sürəti v, qayıq düz qarşı nöqtəyə çatır");
    // rain trails at 45° for the car speed a; second car speed b
    FIG.rain = (a, b) => svg(300, 172, ar(190, 24, 190, 114, ACC) + ar(190, 24, 100, 24, VEC) + ar(190, 24, 100, 114, INK) + dash(100, 24, 100, 114) + dash(100, 114, 190, 114)
      + `<path d="M190 48A24 24 0 0 1 173 41" fill="none" stroke="${MUT}" stroke-width="1.5"/>` + tx(180, 68, "45°", "end", MUT)
      + tx(198, 72, "v_yağış", "start", ACC) + tx(145, 14, "−v_avto", "middle", VEC) + tx(96, 66, "v_nisbi", "end", INK)
      + tx(10, 148, `1-ci hal: v_avto = ${F(a)} m/s, izlər şaquli ilə 45°`, "start", INK, 12) + tx(10, 166, `2-ci hal: v_avto = ${F(b)} m/s, v_nisbi = ?`, "start", INK, 12),
      "Yağışın sürəti, avtomobilin sürəti və nisbi sürət vektorları; birinci halda iz şaquli ilə 45° bucaq əmələ gətirir");
    // plane heading west of north so that the ground track is due north
    FIG.plane = (u, v, L) => svg(280, 172, ar(150, 140, 150, 42, INK) + ar(150, 140, 92, 44, ACC) + ar(92, 44, 148, 44, VEC)
      + tx(100, 100, `v = ${F(v)} m/s`, "end", ACC) + tx(102, 34, `külək u = ${F(u)} m/s`, "middle", VEC) + tx(158, 62, "şimal", "start", MUT)
      + tick(254, 42, 254, 140) + tick(249, 42, 259, 42) + tick(249, 140, 259, 140) + tx(246, 94, `L = ${F(L)} m`, "end") + tx(150, 160, "yerə nəzərən yol", "middle", MUT, 12),
      "Təyyarənin havaya nəzərən sürəti, küləyin sürəti və şimala yönəlmiş yerə nəzərən yol");
    // x(t) graph of two bodies: x1 = p1 + v1 t, x2 = p2 − w t, 0 ≤ t ≤ 8 s
    FIG.xt = (p1, v1, p2, w) => { const X = t => 40 + t * 25, Y = x => 160 - x * 2.2;
      let s = ln(40, 160, 245, 160) + ln(40, 160, 40, 22) + tx(252, 181, "t, s", "start") + tx(34, 16, "x, m", "end");
      for (let t = 2; t <= 8; t += 2) s += ln(X(t), 160, X(t), 28, MUT, 0.6) + tx(X(t), 176, t, "middle", MUT, 11);
      for (let x = 10; x <= 60; x += 10) s += ln(40, Y(x), 240, Y(x), MUT, 0.6) + tx(32, Y(x) + 4, x, "end", MUT, 11);
      const e1 = p1 + 8 * v1, e2 = p2 - 8 * w;
      s += ln(X(0), Y(p1), X(8), Y(e1), ACC, 2.5) + dot(X(0), Y(p1), ACC, 3.5) + dot(X(8), Y(e1), ACC, 3.5) + tx(X(8) + 6, Y(e1) + 4, `1 (${e1} m)`, "start", ACC)
        + ln(X(0), Y(p2), X(8), Y(e2), VEC, 2.5) + dot(X(0), Y(p2), VEC, 3.5) + dot(X(8), Y(e2), VEC, 3.5) + tx(X(8) + 6, Y(e2) + 4, `2 (${e2} m)`, "start", VEC);
      return svg(330, 186, s, "İki cismin koordinatının zamandan asılılıq qrafiki: 1 və 2 düz xətləri"); };
    // fast train (L1) overtaking a slow one (L2)
    FIG.trains = (L1, L2, v2, t) => { const k = Math.min(0.5, 110 / L1, 130 / L2), x0 = 120, r = x0 + L2 * k;
      return svg(320, 178, dash(x0, 54, x0, 132) + box(x0, 52, L2 * k, 18) + box(x0 - L1 * k, 112, L1 * k, 18)
        + tx(x0 + L2 * k / 2, 44, `L₂ = ${F(L2)} m`) + tx(x0 - L1 * k / 2, 150, `L₁ = ${F(L1)} m`)
        + ar(r + 6, 61, r + 38, 61, VEC) + tx(r + 22, 84, `v₂ = ${F(v2)} m/s`, "middle", VEC, 12)
        + ar(x0 + 6, 121, x0 + 38, 121, ACC) + tx(x0 + 22, 108, "v₁ = ?", "middle", ACC, 12)
        + tx(160, 172, `ötmə vaxtı t = ${F(t)} s`, "middle", MUT, 12), "Sürətli qatar (uzunluğu L₁) yük qatarını (uzunluğu L₂) ötür"); };
    // two stones dropped from the same point, the second one tau later
    FIG.stones = (tau, t) => svg(280, 196, ln(60, 22, 140, 22, INK, 4) + dash(100, 22, 100, 160) + `<circle cx="100" cy="132" r="8" fill="${ACC}"/><circle cx="100" cy="72" r="8" fill="${VEC}"/>`
      + tx(86, 136, "1-ci daş", "end", ACC) + tx(86, 76, "2-ci daş", "end", VEC)
      + tick(146, 72, 146, 132) + tick(141, 72, 151, 72) + tick(141, 132, 151, 132) + tx(154, 106, "d = ?", "start")
      + tx(140, 176, `1-ci daş sükunətdən, 2-ci τ = ${F(tau)} s sonra`, "middle", MUT, 12) + tx(140, 192, `2-ci daş buraxıldıqdan t = ${F(t)} s sonra`, "middle", MUT, 12),
      "Eyni nöqtədən τ fərqi ilə buraxılan iki daş; aralarındakı məsafə d");
    // v(t) of a truck (constant) and a car from rest; the speeds are equal at t = v/a
    FIG.vt = (v, a) => { const T = v / a, X = q => 40 + q / (2 * T) * 200, Y = w => 160 - w / (2 * v) * 130;
      return svg(280, 190, ln(40, 160, 245, 160) + ln(40, 160, 40, 20) + tx(250, 164, "t, s", "start") + tx(40, 14, "v, m/s", "middle")
        + dash(X(T), Y(v), X(T), 160) + dash(40, Y(v), X(T), Y(v)) + ln(40, Y(v), X(2 * T), Y(v), VEC, 2.5) + ln(40, 160, X(2 * T), Y(2 * v), ACC, 2.5) + dot(X(T), Y(v), INK, 3.5)
        + tx(X(T), 176, F(T), "middle", INK, 11) + tx(34, Y(v) + 4, F(v), "end", INK, 11)
        + tx(236, Y(v) - 6, "yük maşını", "end", VEC, 12) + tx(46, 34, "avtomobil: sükunətdən", "start", ACC, 12) + tx(46, 50, `a = ${F(a)} m/s²`, "start", ACC, 12),
        "Yük maşınının və avtomobilin sürət–zaman qrafikləri"); };
    // two velocity vectors from one point and their difference
    FIG.vec = (a, b, t) => { const k = 100 / Math.max(a, b), ox = 100, oy = 140, x1 = ox + a * k, y2 = oy - b * k;
      return svg(280, 180, ar(ox, oy, x1, oy, VEC) + ar(ox, oy, ox, y2, ACC) + ar(x1, oy, ox, y2, INK, 2) + dot(ox, oy)
        + tx(ox + a * k / 2, 158, `v₁ = ${F(a)} m/s`, "middle", VEC) + tx(ox - 8, oy - b * k / 2 + 4, `v₂ = ${F(b)} m/s`, "end", ACC)
        + tx((ox + x1) / 2 + 10, (oy + y2) / 2 - 6, "v_nisbi", "start", INK) + tx(272, 26, `t = ${F(t)} s`, "end", MUT),
        "Eyni nöqtədən atılan iki daşın başlanğıc sürətləri: biri üfüqi, o biri şaquli, və onların fərqi"); };
    // hat lost from a boat: boat turns after t1 and meets the hat d below the place where it fell
    FIG.hat = (d, t1) => svg(300, 158, `<rect x="0" y="56" width="300" height="54" fill="${WAT}" opacity="0.5"/>` + ln(0, 56, 300, 56) + ln(0, 110, 300, 110)
      + ar(122, 78, 48, 78, VEC) + ln(47, 78, 47, 100, VEC, 2.5) + ar(47, 100, 232, 100, VEC) + ar(136, 88, 230, 88, ACC, 2)
      + dot(130, 88, ACC, 4) + dot(236, 88, ACC, 4)
      + tx(130, 48, "papaq düşdü", "middle", ACC, 12) + tx(44, 48, "qayıq döndü", "middle", INK, 12) + tx(236, 48, "papaq tutuldu", "middle", ACC, 12)
      + tx(88, 71, `t₁ = ${F(t1)} s`, "middle", VEC, 12) + tx(140, 124, "qayıq geri qayıdır", "middle", VEC, 12)
      + tick(130, 134, 236, 134) + tick(130, 129, 130, 139) + tick(236, 129, 236, 139) + tx(183, 152, `d = ${F(d)} m`) + tx(292, 124, "axın →", "end", MUT, 12),
      "Çay: papaq qayıqdan düşür, qayıq t₁ sonra dönür və papağı düşdüyü yerdən d aşağıda tutur");
    return FIG;
  })();
  // kit>>
  const TRI = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20], [15, 20, 25]];
  const tri = () => { const [a, b, c] = pick(TRI); return Math.random() < .5 ? [a, b, c] : [b, a, c]; };
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. river, boat aimed perpendicular: the shore speed from the drift and the width
    { tip: "qapali", gen: () => again(() => {
      const [v, u, c] = tri(), t = pick([10, 15, 20, 25, 30, 40]), d = v * t, s = u * t;
      const w = [v + u, v, u, Math.abs(v - u)]; if (![c, ...w].every(x => ok2(x))) return null;
      return mc(ae(c, w, U_("m/s")), { svg: svgEl(FIG.drift(d, s, t)), text: `Axının sürəti çayın bütün enində və zamanca sabitdir, qayığın suya nəzərən sürəti də sabitdir. Qayığın burnu sahilə perpendikulyar yönəlib: qayıq qarşı sahilə ${t} s-ə çatır, bu müddətdə axın onu ${s} m aşağı aparır, çayın eni ${d} m-dir. Qayığın sahilə nəzərən sürəti nə qədərdir?`,
        solution: `Sahilə perpendikulyar istiqamətdə qayığı yalnız onun öz sürəti aparır: v = d/t = ${d}/${t} = ${v} m/s. Sahil boyu yalnız axın aparır: u = s/t = ${s}/${t} = ${u} m/s. Bu sürətlər perpendikulyardır, ona görə c = √(${v}² + ${u}²) = ${c} m/s. Tələlər: sürətləri toplamaq (${v + u} m/s), yalnız bir komponenti cavab yazmaq (${v} və ya ${u} m/s), çıxmaq (${Math.abs(v - u)} m/s).` });
    }) },
    // 2. river: perpendicular crossing against the straight one (two times, difference)
    { tip: "qapali", gen: () => again(() => {
      const [a, b, c] = tri(), m = pick([1, 2]), j = rnd(1, 6), U = a * m, V = c * m, B = b * m, d = V * B * j / m;
      if (d < 40 || d > 800) return null;
      const t1 = d / V, t2 = d / B, right = t2 - t1, w4 = d / (V - U) - t1, w = [t2, t1, t1 + t2, w4];
      if (![right, ...w].every(x => ok2(x))) return null;
      return mc(ae(right, w, U_("s")), { svg: svgEl(FIG.straight(d, U, V)), text: `Çayın eni ${d} m, axının sürəti ${U} m/s, qayığın suya nəzərən sürəti ${V} m/s; hər iki sürət sabit və çayın bütün enində eynidir. Qayıq qarşı sahilə iki yolla keçir: 1) burnu sahilə perpendikulyar yönəldərək (axın onu aşağı aparır); 2) axına qarşı elə bucaq altında üzərək ki, düz qarşı nöqtəyə çatsın. İkinci yolun vaxtı birincinin vaxtından neçə saniyə çoxdur?`,
        solution: `1) Perpendikulyar üzəndə qarşı sahilə doğru hərəkətin sürəti qayığın suya nəzərən sürətinə bərabərdir: t₁ = d/v = ${d}/${V} = ${fm(t1)} s. 2) Düz qarşıya çatmaq üçün axın kompensasiya olunur, sahilə perpendikulyar sürət √(${V}² − ${U}²) = ${B} m/s olur: t₂ = ${d}/${B} = ${fm(t2)} s. Fərq: ${fm(t2)} − ${fm(t1)} = ${fm(right)} s. Tələlər: t₂ özünü yazmaq (${fm(t2)} s), t₁ (${fm(t1)} s), toplamaq (${fm(t1 + t2)} s), perpendikulyar sürəti ${V} − ${U} = ${V - U} m/s götürmək (${fm(w4)} s).` });
    }) },
    // 3. rain trails at 45° → rain speed → relative speed at another car speed
    { tip: "qapali", gen: () => again(() => {
      const [a, b, c0] = tri(), m = pick([1, 2, 3].filter(q => c0 * q <= 30)), A = a * m, B = b * m, c = c0 * m;
      const w = [A + B, A, B, Math.abs(A - B)]; if (![c, ...w].every(x => ok2(x))) return null;
      return mc(ae(c, w, U_("m/s")), { svg: svgEl(FIG.rain(A, B)), text: `Şaquli düşən yağışın damcıları avtomobil ${A} m/s sürətlə gedəndə yan şüşədə şaquli ilə 45° bucaq əmələ gətirən iz buraxır. Avtomobil ${B} m/s sürətlə gedəndə damcıların avtomobilə nəzərən sürəti nə qədər olar?`,
        solution: `1-ci hal: iz nisbi sürətin istiqamətidir. 45° olanda tg 45° = v_avto/v_yağış = 1, deməli v_yağış = ${A} m/s (yerə nəzərən). 2-ci hal: damcılar şaquli ${A} m/s ilə düşür və avtomobil ${B} m/s ilə gedir; nisbi sürətin komponentləri perpendikulyardır: √(${A}² + ${B}²) = ${c} m/s. Tələlər: toplamaq (${A + B} m/s), yalnız ${A} və ya ${B} m/s yazmaq, çıxmaq (${Math.abs(A - B)} m/s).` });
    }) },
    // 4. plane and a crosswind: time to fly due north
    { tip: "qapali", gen: () => again(() => {
      const [a, b, c] = tri(), m = pick([2, 5, 10]), U = a * m, B = b * m, V = c * m, t = pick([5, 10, 15, 20, 25, 30, 40, 45, 60, 75, 90, 100, 120, 130]), L = B * t;
      const w = [L / V, L / (V - U), L / (V + U), L / U]; if (![t, ...w].every(x => ok2(x))) return null;
      return mc(ae(t, w, U_("s")), { svg: svgEl(FIG.plane(U, V, L)), text: `Külək yerə nəzərən qərbdən şərqə ${U} m/s sürətlə əsir. Təyyarənin havaya nəzərən sürəti ${V} m/s-dir. Pilot təyyarəni elə yönəldir ki, yerə nəzərən düz şimala uçsun. Təyyarə şimala ${L} m yolu neçə saniyəyə uçar?`,
        solution: `Yerə nəzərən sürət şimala yönəlməlidir: v_yerə = v_hava + u. Küləyin şərq komponentini kompensasiya etmək üçün təyyarənin burnu qərbə çevrilir; şimal komponenti √(${V}² − ${U}²) = ${B} m/s olur. t = L/v_yerə = ${L}/${B} = ${t} s. Tələlər: ${V} m/s-ə bölmək (${fm(L / V)} s), ${V} − ${U} (${fm(L / (V - U))} s), ${V} + ${U} (${fm(L / (V + U))} s), yalnız küləyin sürəti ${U} m/s (${fm(L / U)} s).` });
    }) },
    // 5. x(t) graph of two bodies: the approach speed (kinematics + relative motion)
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const p1 = pick([0, 10, 20]), v1 = pick([2, 3, 4, 5]), p2 = pick([30, 40, 50, 60]), w = pick([2, 3, 4, 5]), e1 = p1 + 8 * v1, e2 = p2 - 8 * w;
      if (e2 < 0 || e1 - e2 < 10) return null;
      const r = v1 + w, ws = [Math.abs(v1 - w), v1, w, r / 2]; if (![r, ...ws].every(x => ok2(x))) return null;
      return mc(ae(r, ws, U_("m/s")), { svg: svgEl(FIG.xt(p1, v1, p2, w)), text: `Şəkildə düz xətt boyunca hərəkət edən iki cismin koordinatının zamandan asılılıq qrafiki verilib. İkinci cismin birinci cismə nəzərən sürətinin modulu nə qədərdir?`,
        solution: `Qrafikdən: 1-ci cisim 8 s-də ${p1} m-dən ${e1} m-ə gedir: v₁ = (${e1} − ${p1})/8 = ${v1} m/s. 2-ci cisim ${p2} m-dən ${e2} m-ə gəlir: v₂ = (${e2} − ${p2})/8 = −${w} m/s (koordinat azalır, cisim əks istiqamətdə gedir). Nisbi sürət v₂ − v₁ = −${w} − ${v1} = −${r} m/s, modulu ${r} m/s. Əks istiqamətlərdə sürətlər toplanır. Tələlər: çıxmaq (${Math.abs(v1 - w)} m/s), tək cismin sürəti (${v1} və ya ${w} m/s), yarıya bölmək (${fm(r / 2)} m/s).` });
    }) },
    // 6. a fast train overtakes a slow one: find the fast train's speed
    { tip: "qapali", gen: () => again(() => {
      const L1 = 50 * rnd(2, 8), L2 = 50 * rnd(2, 8), t = pick([10, 20, 25, 40, 50]), v2 = pick([10, 12, 15, 16, 20]), q = (L1 + L2) / t, v1 = v2 + q;
      if (L1 === L2) return null;
      const w = [q, v2 + L1 / t, v2 + L2 / t, q - v2]; if (![v1, ...w].every(x => ok2(x))) return null;
      return mc(ae(v1, w, U_("m/s")), { svg: svgEl(FIG.trains(L1, L2, v2, t)), text: `Uzunluğu ${L1} m olan sürətli qatar uzunluğu ${L2} m olan yük qatarını ötür; yük qatarı ${v2} m/s sürətlə gedir. Sürətli qatarın başı yük qatarının quyruğuna çatandan öz quyruğu yük qatarının başını keçənədək ${t} s keçir. Sürətli qatarın sürəti nə qədərdir?`,
        solution: `Yük qatarını durğun sayaq. Sürətli qatar ona nəzərən L₁ + L₂ = ${L1} + ${L2} = ${L1 + L2} m yol gedir (yalnız bir uzunluq yox). Nisbi sürət v₁ − v₂ = ${L1 + L2}/${t} = ${fm(q)} m/s. Deməli v₁ = ${v2} + ${fm(q)} = ${fm(v1)} m/s. Tələlər: nisbi sürəti cavab yazmaq (${fm(q)} m/s), yalnız L₁ və ya yalnız L₂ götürmək (${fm(v2 + L1 / t)} və ${fm(v2 + L2 / t)} m/s), v₂-ni çıxmaq (${fm(q - v2)} m/s).` });
    }) },
    // 7. two stones dropped τ apart: distance after t (free fall + relative motion)
    { tip: "qapali", birlesik: "fiz-serbest-dusme", gen: () => again(() => {
      const tau = pick([0.5, 1, 1.5, 2, 3, 4]), t = pick([0.5, 1, 1.5, 2, 3, 4, 5, 6]), d = 5 * tau * tau + 10 * tau * t;
      const w = [10 * tau * t, 5 * tau * tau, 5 * tau * tau + 5 * tau * t, 10 * tau * (t + tau)]; if (![d, ...w].every(x => ok2(x))) return null;
      return mc(ae(d, w, U_("m")), { svg: svgEl(FIG.stones(tau, t)), text: `Yüksək balkondan daş sükunətdən buraxıldı, ${F(tau)} s sonra eyni nöqtədən ikinci daş da sükunətdən buraxıldı. İkinci daş buraxıldıqdan ${F(t)} s sonra daşlar arasındakı məsafə nə qədərdir? Daşlar hələ yerə düşməyib, havanın müqaviməti yoxdur, g = 10 m/s².`,
        solution: `İkinci daş buraxılanda birinci daş artıq ${F(tau)} s düşüb: yolu gτ²/2 = 5·${F(tau * tau)} = ${fm(5 * tau * tau)} m, sürəti gτ = ${fm(10 * tau)} m/s. İki daşın da təcili g-dir, nisbi təcil 0: birinci daş ikinciyə nəzərən ${fm(10 * tau)} m/s sabit sürətlə uzaqlaşır. d = ${fm(5 * tau * tau)} + ${fm(10 * tau)}·${F(t)} = ${fm(d)} m. Tələlər: başlanğıc məsafəni unutmaq (${fm(10 * tau * t)} m), nisbi sürəti unutmaq (${fm(5 * tau * tau)} m), sürətin yarısını götürmək (${fm(w[2])} m), sürəti ${F(tau + t)} s-ə vurmaq (${fm(w[3])} m).` });
    }) },
    // 8. v(t) graph: the largest gap before the car catches the truck (kinematics + relative motion)
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const v = pick([8, 10, 12, 15, 16, 20, 24, 30, 40]), a = pick([1, 2, 2.5, 4, 5]), T = v / a, d = v * v / (2 * a);
      if (!nice(T, 2)) return null;
      const w = [v * v / a, 2 * v * v / a, v * v / (4 * a), 3 * v * v / (2 * a)]; if (![d, ...w].every(x => ok2(x))) return null;
      return mc(ae(d, w, U_("m")), { svg: svgEl(FIG.vt(v, a)), text: `Yük maşını ${v} m/s sabit sürətlə gedərək dayanmış avtomobilin yanından keçdi. Həmin anda avtomobil sükunətdən ${F(a)} m/s² sabit təcillə eyni istiqamətdə hərəkətə başladı (şəkildə sürət–zaman qrafikləri). Avtomobil yük maşınına yetişənədək aralarındakı ən böyük məsafə nə qədərdir?`,
        solution: `Avtomobil yük maşınından geridədir və sürəti kiçikdir, məsafə artır. Sürətlər bərabərləşəndə (nisbi sürət 0) məsafə ən böyük olur: a·t = v → t = ${v}/${F(a)} = ${F(T)} s (qrafikdə xətlərin kəsişməsi). Bu anda yük maşını v·t = ${v}·${F(T)} = ${fm(v * T)} m, avtomobil a·t²/2 = ${fm(a * T * T / 2)} m gedib. Fərq: ${fm(v * T)} − ${fm(a * T * T / 2)} = ${fm(d)} m. Tələlər: yük maşınının yolu (${fm(v * v / a)} m), yetişmə anındakı yol 2v²/a = ${fm(2 * v * v / a)} m, hər iki yolun cəmi (${fm(3 * v * v / (2 * a))} m), üçbucaq sahəsini ikinci dəfə yarıya bölmək (v²/(4a) = ${fm(v * v / (4 * a))} m).` });
    }) },
    // 9. two stones thrown from one point (horizontal and vertical): distance after t (projectile + relative motion)
    { tip: "qapali", birlesik: "fiz-atilan-cisim", gen: () => again(() => {
      const [a, b, c0] = tri(), m = pick([1, 2].filter(q => c0 * q <= 30)), A = a * m, B = b * m, c = c0 * m, t = rnd(2, 8), d = c * t;
      const w = [(A + B) * t, A * t, B * t, Math.abs(A - B) * t]; if (![d, ...w].every(x => ok2(x))) return null;
      return mc(ae(d, w, U_("m")), { svg: svgEl(FIG.vec(A, B, t)), text: `Eyni nöqtədən eyni anda iki daş atılır: birincisi ${A} m/s sürətlə üfüqi, ikincisi ${B} m/s sürətlə şaquli yuxarı. ${t} s sonra daşlar arasındakı məsafə nə qədərdir? Daşlar yerə düşməyib, havanın müqaviməti yoxdur, g = 10 m/s².`,
        solution: `Hər iki daşın təcili g-dir, nisbi təcil 0: daşlar bir-birinə nəzərən bərabərsürətli hərəkət edir. Nisbi sürət başlanğıc sürətlərin vektor fərqidir: komponentlər ${A} m/s (üfüqi) və ${B} m/s (şaquli) perpendikulyardır, v_nisbi = √(${A}² + ${B}²) = ${c} m/s. d = v_nisbi·t = ${c}·${t} = ${d} m. Tələlər: sürətləri toplamaq (${fm((A + B) * t)} m), nisbi yerdəyişmənin yalnız bir komponentini götürmək (${A * t} və ya ${B * t} m), çıxmaq (${fm(Math.abs(A - B) * t)} m).` });
    }) },
    // 10. a hat falls into the river: the speed of the current from the time and the distance
    { tip: "qapali", gen: () => again(() => {
      const u = pick([0.6, 0.9, 1.2, 1.5, 1.8, 2.1, 2.4]), t1 = pick([60, 120, 180, 300, 600]), v = pick([3, 4, 5, 6]), d = +(2 * u * t1).toFixed(4);
      const w = [d / t1, 2 * d / t1, d / (3 * t1), d / (4 * t1)]; if (![u, ...w].every(x => ok2(x))) return null;
      return mc(ae(u, w, U_("m/s")), { svg: svgEl(FIG.hat(d, t1)), text: `Motorlu qayıq çayda axına qarşı üzür (suya nəzərən sürəti ${v} m/s). Axının sürəti çayın bütün yerində eyni və sabitdir; papaq suya düşən kimi axınla eyni sürətlə sürüklənir. Qayıqdan papaq suya düşür. ${t1} s sonra qayıqçı bunu görüb dərhal dönür (dönmə vaxtı nəzərə alınmır); qayığın suya nəzərən sürəti dönüşdən əvvəl və sonra eynidir. Qayıq papağa yetişir və onu düşdüyü yerdən ${d} m aşağıda tutur. Axının sürəti nə qədərdir?`,
        solution: `Axınla gedən çərçivədə (suya nəzərən) papaq durur, qayıq isə ondan eyni sürətlə uzaqlaşır ${t1} s, sonra eyni sürətlə qayıdır — yenə ${t1} s. Bütün vaxt 2·${t1} = ${2 * t1} s. Bu müddətdə papaq axınla ${d} m aparılıb: u = ${d}/${2 * t1} = ${fm(u)} m/s. Qayığın sürəti (${v} m/s) cavaba təsir etmir. Tələlər: yalnız ${t1} s-ə bölmək (${fm(d / t1)} m/s), ${2 * t1} s əvəzinə ${3 * t1} və ${4 * t1} s götürmək, ikiqat saymaq (${fm(2 * d / t1)} m/s).` });
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
      key: "fiz-nisbi-herekat", title: "Nisbi hərəkət", fenn: "fizika", link: "dersler/fiz-nisbi-herekat.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: m/s, m, s). Onluq kəsr vergül və ya nöqtə ilə: 2,5. g = 10 m/s².",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["sur", "sur", "cay", "cay", "yagis", "gorus", "gorus", "tecil", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-nisbi-herekat.html")) b.push("dersler/fiz-nisbi-herekat.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
