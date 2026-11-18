// Fizika · Çevrə üzrə hərəkət — mastery game levels (period / frequency, linear speed, angular speed, centripetal acceleration, comparisons, forces) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s², π = 3 where π is used.
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
  const arrow = (s, x1, y1, x2, y2, color) => {
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, bx = x2 - ux * 10, by = y2 - uy * 10;
    s.append(sv("line", { x1, y1, x2: bx, y2: by, stroke: color, "stroke-width": 3 }));
    s.append(sv("polygon", { points: `${x2},${y2} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`, fill: color }));
  };
  const f1 = v => +v.toFixed(1);

  // circle with the point at a random angle: v along the tangent, a to the centre, R as a radius label
  function circPic(Rtxt, show) {
    const s = sv("svg", { viewBox: "0 0 260 200", class: "oy-svg", role: "img", "aria-label": "Çevrə üzrə hərəkət" });
    const cx = 120, cy = 100, r = 70, th = rnd(0, 359) * Math.PI / 180, px = cx + r * Math.cos(th), py = cy - r * Math.sin(th);
    s.append(sv("circle", { cx, cy, r, fill: "none", stroke: "var(--muted)", "stroke-width": 1.6 }));
    s.append(sv("circle", { cx, cy, r: 3, fill: "var(--ink)" }));
    s.append(sv("line", { x1: cx, y1: cy, x2: f1(px), y2: f1(py), stroke: "var(--muted)", "stroke-dasharray": "4 3" }));
    s.append(sv("circle", { cx: f1(px), cy: f1(py), r: 6, fill: "var(--ink)" }));
    const tx = -Math.sin(th), ty = -Math.cos(th);   // tangent (counter-clockwise)
    if (show.v) { arrow(s, f1(px), f1(py), f1(px + tx * 46), f1(py + ty * 46), "var(--accent)"); s.append(sv("text", { x: f1(px + tx * 58 - 6), y: f1(py + ty * 58 + 4), class: "oy-lbl" }, show.v)); }
    if (show.a) { arrow(s, f1(px), f1(py), f1(px + (cx - px) * 0.45), f1(py + (cy - py) * 0.45), "var(--vec)"); s.append(sv("text", { x: f1(px + (cx - px) * 0.3 + 8), y: f1(py + (cy - py) * 0.3 - 6), class: "oy-lbl" }, show.a)); }
    s.append(sv("text", { x: f1((cx + px) / 2 - 24), y: f1((cy + py) / 2 + 14), class: "oy-lbl" }, "R = " + Rtxt));
    return s;
  }
  // two pulleys connected by a belt
  function belt(r1, r2) {
    const s = sv("svg", { viewBox: "0 0 280 160", class: "oy-svg", role: "img", "aria-label": "Qayışla bağlı iki çarx" });
    const k = Math.min(60 / Math.max(r1, r2), 100 / (r1 + r2)), a = r1 * k, b = r2 * k, x1 = 30 + a, x2 = 250 - b, y = 80, D = x2 - x1, nx = (a - b) / D, ny = Math.sqrt(1 - nx * nx);
    s.append(sv("circle", { cx: f1(x1), cy: y, r: f1(a), fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 }));
    s.append(sv("circle", { cx: f1(x2), cy: y, r: f1(b), fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 }));
    for (const sg of [-1, 1]) s.append(sv("line", { x1: f1(x1 + a * nx), y1: f1(y + sg * a * ny), x2: f1(x2 + b * nx), y2: f1(y + sg * b * ny), stroke: "var(--ink)", "stroke-width": 2 }));
    s.append(sv("text", { x: f1(x1 - 8), y: y + 5, class: "oy-lbl" }, "R₁"));
    s.append(sv("text", { x: f1(x2 - 8), y: y + 5, class: "oy-lbl" }, "R₂"));
    return s;
  }

  const levels = [
    { id: "dovr", ad: "Period və tezlik", izah: "T — bir dövr neçə saniyə, ν — bir saniyədə neçə dövr. T = t/N, ν = N/t, T = 1/ν. Dəqiqəni saniyəyə çevir.",
      gen() {
        const kind = pick(["T", "T", "nu", "nu", "Tn", "N", "saat"]);
        if (kind === "T") { for (;;) { const t = pick([10, 20, 30, 60, 120]), N = rnd(2, 300), T = t / N; if (nice(T, 3)) return R(T, "s", { text: `Təkər ${t} s-də ${N} dövr edir. Fırlanma periodunu tap.`, solution: `T = t/N = ${t}/${N} = ${F(T)} s.` }); } }
        if (kind === "nu") { const n = pick([60, 90, 120, 150, 180, 300, 600, 1200, 1500, 3000]), nu = n / 60; return R(nu, "1/s", { text: `Elektrik mühərrikinin valı dəqiqədə ${n} dövr edir. Fırlanma tezliyi (1/s ilə) nə qədərdir?`, solution: `ν = ${n}/60 = ${F(nu)} 1/s (1 dəq = 60 s).` }); }
        if (kind === "Tn") { const nu = pick([0.5, 2, 4, 5, 10, 20, 25, 50, 100]); return R(1 / nu, "s", { text: `Diskin fırlanma tezliyi ${F(nu)} 1/s-dir. Periodu nə qədərdir?`, solution: `T = 1/ν = 1/${F(nu)} = ${F(1 / nu)} s.` }); }
        if (kind === "N") { const T = pick([0.2, 0.25, 0.4, 0.5, 2, 4]), t = pick([10, 20, 30, 60]), N = t / T; if (!nice(N, 2)) return this.gen(); return R(N, "dövr", { text: `Dişli çarxın fırlanma periodu ${F(T)} s-dir. O, ${t} s-də neçə dövr edər?`, solution: `N = t/T = ${t}/${F(T)} = ${F(N)}.` }); }
        const w = pick([["Dəqiqə əqrəbinin", 3600, "1 saat = 3600 s"], ["Saat əqrəbinin", 43200, "12 saat = 12·3600 = 43200 s"], ["Yerin öz oxu ətrafında fırlanmasının", 86400, "24 saat = 24·3600 = 86400 s"]]);
        return R(w[1], "s", { text: `${w[0]} fırlanma periodu neçə saniyədir?`, solution: `Period — bir tam dövrün vaxtı: ${w[2]}.` });
      } },
    { id: "sur", ad: "Xətti sürət v = 2πR/T", izah: "Bir dövrdə cisim çevrənin uzunluğu 2πR qədər yol gedir. v = 2πR/T = 2πRν. Burada π = 3 götür. Radiusu metrlə yaz.",
      gen() {
        const kind = pick(["v", "v", "R", "T", "n", "stadion"]);
        const Rs = [0.5, 1, 1.5, 2, 3, 5, 10, 15, 20, 30, 50, 60], Ts = [2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60];
        const Rv = pick(Rs), T = pick(Ts), v = 6 * Rv / T;
        if (kind === "v") { if (!nice(v, 2)) return this.gen(); return R(v, "m/s", { text: `Cisim radiusu ${F(Rv)} m olan çevrə üzrə ${T} s periodla bərabərsürətli hərəkət edir. Sürətini tap (π = 3).`, solution: `v = 2πR/T = 2·3·${F(Rv)}/${T} = ${F(6 * Rv)}/${T} = ${F(v)} m/s.` }); }
        if (kind === "R") { if (!nice(v, 2)) return this.gen(); return R(Rv, "m", { text: `Cisim çevrə üzrə ${F(v)} m/s sürətlə ${T} s periodla hərəkət edir. Çevrənin radiusu nə qədərdir? (π = 3)`, solution: `v = 2πR/T → R = vT/(2π) = ${F(v)}·${T}/6 = ${F(Rv)} m.` }); }
        if (kind === "T") { if (!nice(v, 2)) return this.gen(); return R(T, "s", { text: `Cisim radiusu ${F(Rv)} m olan çevrə üzrə ${F(v)} m/s sürətlə hərəkət edir. Fırlanma periodunu tap. (π = 3)`, solution: `T = 2πR/v = 6·${F(Rv)}/${F(v)} = ${F(6 * Rv)}/${F(v)} = ${T} s.` }); }
        if (kind === "n") { const n = pick([60, 120, 180, 300, 600]), Rr = pick([0.1, 0.2, 0.25, 0.5, 1]), nu = n / 60, vv = 6 * Rr * nu; if (!nice(vv, 2)) return this.gen(); return R(vv, "m/s", { text: `Radiusu ${F(Rr)} m olan çarx dəqiqədə ${n} dövr edir. Çarxın kənarındakı nöqtənin sürəti nə qədərdir? (π = 3)`, solution: `ν = ${n}/60 = ${F(nu)} 1/s. v = 2πRν = 6·${F(Rr)}·${F(nu)} = ${F(vv)} m/s.` }); }
        const Rt = pick([30, 50, 60, 100]), vs = pick([3, 4, 5, 6, 10]), Tt = 6 * Rt / vs; if (!nice(Tt, 2)) return this.gen();
        return R(Tt, "s", { text: `Dairəvi yolun radiusu ${Rt} m-dir. Qaçışçı ${vs} m/s sabit sürətlə qaçır. Bir dövrə nə qədər vaxt çəkir? (π = 3)`, solution: `Çevrənin uzunluğu 2πR = 6·${Rt} = ${6 * Rt} m. T = ${6 * Rt}/${vs} = ${F(Tt)} s.` });
      } },
    { id: "bucaq", ad: "Bucaq sürəti ω", izah: "ω = φ/t = 2π/T = 2πν (rad/s), v = ωR. Dövr = 2π radian. π = 3 götür.",
      gen() {
        const kind = pick(["T", "nu", "vR", "v", "phi", "N", "der"]);
        if (kind === "T") { const T = pick([0.25, 0.5, 1, 1.5, 2, 3, 4, 6, 12]), w = 6 / T; return R(w, "rad/s", { text: `Fırlanma periodu ${F(T)} s-dir. Bucaq sürətini tap (π = 3).`, solution: `ω = 2π/T = 6/${F(T)} = ${F(w)} rad/s.` }); }
        if (kind === "nu") { const nu = pick([0.5, 1, 2, 2.5, 4, 5, 10, 20]), w = 6 * nu; return R(w, "rad/s", { text: `Diskin fırlanma tezliyi ${F(nu)} 1/s-dir. Bucaq sürəti nə qədərdir? (π = 3)`, solution: `ω = 2πν = 6·${F(nu)} = ${F(w)} rad/s.` }); }
        if (kind === "vR") { const Rr = pick([0.2, 0.5, 2, 4, 5, 10]), w = rnd(1, 12), v = w * Rr; if (!nice(v, 2)) return this.gen(); return R(w, "rad/s", { text: `Çevrə üzrə hərəkət edən cismin sürəti ${F(v)} m/s, çevrənin radiusu ${F(Rr)} m-dir. Bucaq sürətini tap.`, solution: `ω = v/R = ${F(v)}/${F(Rr)} = ${w} rad/s.` }); }
        if (kind === "v") { const Rr = pick([0.2, 0.5, 2, 4, 5, 10]), w = rnd(1, 12), v = w * Rr; if (!nice(v, 2)) return this.gen(); return R(v, "m/s", { text: `Cismin bucaq sürəti ${w} rad/s, çevrənin radiusu ${F(Rr)} m-dir. Xətti sürəti tap.`, solution: `v = ωR = ${w}·${F(Rr)} = ${F(v)} m/s.` }); }
        if (kind === "phi") { const w = pick([0.5, 1, 2, 3, 4, 5]), t = rnd(2, 12), phi = w * t; return R(phi, "rad", { text: `Cisim ${F(w)} rad/s bucaq sürəti ilə ${t} s fırlanır. Hansı bucaq qədər dönər?`, solution: `φ = ωt = ${F(w)}·${t} = ${F(phi)} rad.` }); }
        if (kind === "N") { for (;;) { const w = pick([3, 6, 9, 12, 15, 18, 24]), t = rnd(2, 20), N = w * t / 6; if (nice(N, 2)) return R(N, "dövr", { text: `Cisim ${w} rad/s bucaq sürəti ilə ${t} s fırlanır. Neçə dövr edər? (π = 3)`, solution: `φ = ωt = ${w}·${t} = ${w * t} rad. Bir dövr 2π = 6 rad: N = ${w * t}/6 = ${F(N)}.` }); } }
        const ang = pick([30, 45, 60, 90, 120, 180, 270, 360]), rad = ang * 3 / 180; return R(rad, "rad", { text: `${ang}° neçə radiandır? (π = 3)`, solution: `180° = π = 3 rad. ${ang}° = ${ang}·3/180 = ${F(rad)} rad.` });
      } },
    { id: "tecil", ad: "Mərkəzəqaçma təcili", izah: "a = v²/R = ω²R = 4π²R/T². Təcil çevrənin mərkəzinə yönəlib, sürətin modulu sabit olsa da var.",
      gen() {
        const kind = pick(["v2", "v2", "w2", "v", "Rr", "w", "T", "dehf"]);
        if (kind === "v2") { for (;;) { const v = rnd(2, 30), Rr = pick([0.5, 1, 2, 4, 5, 10, 20, 25, 40, 50, 100]), a = v * v / Rr; if (nice(a, 2) && a <= 800) return R(a, "m/s²", { svg: circPic(F(Rr) + " m", { v: "v", a: "a" }), text: `Cisim radiusu ${F(Rr)} m olan çevrə üzrə ${v} m/s sürətlə bərabərsürətli hərəkət edir. Mərkəzəqaçma təcilini tap.`, solution: `a = v²/R = ${v * v}/${F(Rr)} = ${F(a)} m/s².` }); } }
        if (kind === "w2") { for (;;) { const w = pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 20]), Rr = pick([0.1, 0.2, 0.25, 0.5, 1, 2, 4, 5]), a = w * w * Rr; if (nice(a, 2)) return R(a, "m/s²", { svg: circPic(F(Rr) + " m", { v: "v", a: "a" }), text: `Cisim radiusu ${F(Rr)} m olan çevrə üzrə ${w} rad/s bucaq sürəti ilə hərəkət edir. Mərkəzəqaçma təcilini tap.`, solution: `a = ω²R = ${w * w}·${F(Rr)} = ${F(a)} m/s².` }); } }
        if (kind === "v") { const v = rnd(2, 20), Rr = pick([1, 2, 4, 5, 10, 20, 25]), a = v * v / Rr; if (!nice(a, 2)) return this.gen(); return R(v, "m/s", { text: `Radiusu ${Rr} m olan çevrə üzrə hərəkət edən cismin mərkəzəqaçma təcili ${F(a)} m/s²-dir. Sürəti nə qədərdir?`, solution: `a = v²/R → v² = aR = ${F(a)}·${Rr} = ${v * v} → v = ${v} m/s.` }); }
        if (kind === "Rr") { const v = rnd(2, 20), Rr = pick([1, 2, 4, 5, 10, 20, 25, 50]), a = v * v / Rr; if (!nice(a, 2)) return this.gen(); return R(Rr, "m", { text: `Cisim ${v} m/s sürətlə çevrə üzrə hərəkət edir, mərkəzəqaçma təcili ${F(a)} m/s²-dir. Çevrənin radiusu nə qədərdir?`, solution: `a = v²/R → R = v²/a = ${v * v}/${F(a)} = ${Rr} m.` }); }
        if (kind === "w") { const w = rnd(1, 12), Rr = pick([0.25, 0.5, 1, 2, 4, 9]), a = w * w * Rr; if (!nice(a, 2)) return this.gen(); return R(w, "rad/s", { text: `Radiusu ${F(Rr)} m olan disk elə fırlanır ki, kənardakı nöqtənin təcili ${F(a)} m/s² olur. Bucaq sürəti nə qədərdir?`, solution: `a = ω²R → ω² = a/R = ${F(a)}/${F(Rr)} = ${w * w} → ω = ${w} rad/s.` }); }
        if (kind === "T") { const T = pick([1, 2, 3, 4, 6]), Rr = pick([0.25, 0.5, 1, 2, 3]), a = 36 * Rr / (T * T); if (!nice(a, 2)) return this.gen(); return R(a, "m/s²", { text: `Cisim radiusu ${F(Rr)} m olan çevrə üzrə ${T} s periodla hərəkət edir. Mərkəzəqaçma təcilini tap (π = 3).`, solution: `a = 4π²R/T² = 36·${F(Rr)}/${T * T} = ${F(a)} m/s². (Və ya: ω = 6/${T} = ${F(6 / T)} rad/s, a = ω²R.)` }); }
        const v = rnd(2, 10), Rr = pick([2, 4, 5, 10, 20]), a = v * v / Rr; if (!nice(a, 2)) return this.gen(); const k = pick([2, 3]);
        return R(k * k * a, "m/s²", { text: `Cisim çevrə üzrə ${v} m/s sürətlə hərəkət edəndə mərkəzəqaçma təcili ${F(a)} m/s²-dir. Eyni çevrə üzrə sürəti ${k} dəfə artırsaq, təcil nə qədər olar?`, solution: `a = v²/R, R eynidir: təcil sürətin kvadratı ilə artır, yəni ${k}² = ${k * k} dəfə: ${k * k}·${F(a)} = ${F(k * k * a)} m/s².` });
      } },
    { id: "muqayise", ad: "Müqayisə, ötürmə", izah: "Bir diskin nöqtələri — eyni ω (a = ω²R, v = ωR). Qayışla və ya zəncirlə bağlı çarxların kənarı — eyni v (a = v²/R). Dişlilərdə dişlərin sayı hasilə uyğun gəlir.",
      gen() {
        const kind = pick(["qayis", "qayis", "disk", "disk", "dishli", "enlik", "saat", "saat2"]);
        if (kind === "qayis") {
          for (;;) {
            const r1 = pick([5, 10, 15, 20, 30, 40]), r2 = pick([5, 10, 15, 20, 30, 40]); if (r1 === r2 || !nice(r1 / r2, 2)) continue;
            const nu1 = pick([2, 3, 4, 5, 6, 10, 12, 15, 20]), nu2 = nu1 * r1 / r2, w = pick(["nu", "a"]);
            if (!nice(nu2, 2)) continue;
            if (w === "nu") return R(nu2, "1/s", { svg: belt(r1, r2), text: `Qayışla bağlı iki çarxın radiusları R₁ = ${r1} sm və R₂ = ${r2} sm-dir. Birinci çarx saniyədə ${nu1} dövr edir. İkinci çarxın tezliyi nə qədərdir? (Qayış sürüşmür.)`, solution: `Qayışın sürəti hər iki çarxın kənarında eynidir: 2πR₁ν₁ = 2πR₂ν₂ → ν₂ = ν₁R₁/R₂ = ${nu1}·${r1}/${r2} = ${F(nu2)} 1/s. (Kiçik çarx tez fırlanır.)` });
            return R(r1 / r2, "", { svg: belt(r1, r2), text: `Qayışla bağlı iki çarxın radiusları R₁ = ${r1} sm və R₂ = ${r2} sm-dir. Çarxların kənarındakı nöqtələrin təcillərinin nisbəti a₂/a₁ neçədir? (Qayış sürüşmür.)`, tol: 0.005, solution: `Kənarda sürət eynidir, a = v²/R → a₂/a₁ = R₁/R₂ = ${r1}/${r2} = ${F(r1 / r2)}.` });
          }
        }
        if (kind === "disk") {
          for (;;) {
            const r1 = pick([5, 10, 15, 20]), r2 = pick([10, 20, 30, 40, 50, 60]); if (r2 <= r1) continue;
            const v1 = rnd(2, 12), v2 = v1 * r2 / r1, w = pick(["v", "a"]);
            if (!nice(v2, 2)) continue;
            if (w === "v") return R(v2, "m/s", { text: `Disk fırlanır. Mərkəzdən ${r1} sm məsafədə nöqtənin sürəti ${v1} m/s-dir. Mərkəzdən ${r2} sm məsafədə nöqtənin sürəti nə qədərdir?`, solution: `Diskin bütün nöqtələri eyni ω ilə fırlanır, v = ωR → v₂ = v₁R₂/R₁ = ${v1}·${r2}/${r1} = ${F(v2)} m/s.` });
            const a1 = pick([2, 3, 4, 5, 6, 8]), a2 = a1 * r2 / r1; if (!nice(a2, 2)) continue;
            return R(a2, "m/s²", { text: `Disk fırlanır. Mərkəzdən ${r1} sm məsafədə nöqtənin təcili ${a1} m/s²-dir. Mərkəzdən ${r2} sm məsafədə nöqtənin təcili nə qədərdir?`, solution: `Eyni ω: a = ω²R → a₂ = a₁R₂/R₁ = ${a1}·${r2}/${r1} = ${F(a2)} m/s².` });
          }
        }
        if (kind === "dishli") {
          for (;;) {
            const z1 = pick([12, 15, 18, 20, 24, 30, 36, 40]), z2 = pick([10, 12, 15, 18, 20, 24, 30, 36, 40, 60]); if (z1 === z2) continue;
            const N1 = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 20]), N2 = N1 * z1 / z2; if (!nice(N2, 2)) continue;
            return R(N2, "dövr", { text: `Bir-birinə keçən iki dişli çarxdan birincinin ${z1}, ikincinin ${z2} dişi var. Birinci ${N1} dövr edəndə ikinci neçə dövr edər?`, solution: `Hər dövrdə eyni sayda diş sürüşür: ${z1}·${N1} = ${z2}·N₂ → N₂ = ${z1 * N1}/${z2} = ${F(N2)} dövr.` });
          }
        }
        if (kind === "enlik") {
          const w = pick(["a", "v"]);
          if (w === "v") return R(2, "", { text: `Yerin oxu ətrafında fırlanması zamanı 60° enlikdəki nöqtənin xətti sürəti ekvatordakı nöqtənin sürətindən neçə dəfə kiçikdir? (cos 60° = 0,5)`, tol: 0.01, solution: `İki nöqtənin ω-si eynidir. 60° enlikdə fırlanma radiusu R·cos 60° = R/2-dir. v = ωr → sürət 2 dəfə kiçikdir.` });
          const ae = pick([0.02, 0.034, 0.03, 0.04]); return R(ae / 2, "m/s²", { text: `Yerin fırlanmasına görə ekvatordakı nöqtənin mərkəzəqaçma təcili ${F(ae)} m/s²-dir. 60° enlikdəki nöqtənin təcili nə qədərdir? (cos 60° = 0,5)`, solution: `ω eynidir, fırlanma radiusu r = R·cos 60° = R/2. a = ω²r → a yarıya düşür: ${F(ae)}/2 = ${F(ae / 2)} m/s².` });
        }
        if (kind === "saat") {
          const L = pick([6, 9, 12, 15, 18]), vv = L / 60; if (!nice(vv, 2)) return this.gen();
          return R(vv, "mm/s", { text: `Dəqiqə əqrəbinin uzunluğu ${L} sm-dir. Əqrəbin ucunun sürəti neçə mm/s-dir? (π = 3)`, solution: `T = 3600 s, R = ${L} sm = ${L * 10} mm. v = 2πR/T = 6·${L * 10}/3600 = ${F(vv)} mm/s.` });
        }
        const L = pick([2, 3, 4, 5, 6]); return R(L, "mm/s", { text: `Saniyə əqrəbinin uzunluğu ${L} sm-dir. Əqrəbin ucunun sürəti neçə mm/s-dir? (π = 3)`, solution: `T = 60 s, R = ${L} sm = ${L * 10} mm. v = 2πR/T = 6·${L * 10}/60 = ${L} mm/s.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          const n = pick([60, 120, 180, 240]), Rr = pick([0.5, 1, 2, 0.25]), nu = n / 60, w = 6 * nu, a = w * w * Rr;
          task = `Radiusu ${F(Rr)} m olan çarx dəqiqədə ${n} dövr edir. Kənardakı nöqtənin mərkəzəqaçma təcili nə qədərdir? (π = 3)`;
          const nuUse = bad === 0 ? n : nu, wUse = bad === 1 ? 2 * nuUse : 6 * nuUse, aUse = bad === 2 ? wUse * Rr : wUse * wUse * Rr;
          steps = [
            bad === 0 ? `Tezlik ν = ${n} 1/s.` : `Tezlik ν = ${n}/60 = ${F(nu)} 1/s.`,
            bad === 1 ? `Bucaq sürəti ω = 2ν = ${F(wUse)} rad/s.` : `Bucaq sürəti ω = 2πν = 6·${F(nuUse)} = ${F(wUse)} rad/s.`,
            bad === 2 ? `Təcil a = ωR = ${F(wUse)}·${F(Rr)} = ${F(aUse)} m/s².` : `Təcil a = ω²R = ${F(wUse * wUse)}·${F(Rr)} = ${F(aUse)} m/s².`,
          ];
          why = [`1-ci addım: dəqiqədə ${n} dövr = saniyədə ${n}/60 = ${F(nu)} dövr. Düz cavab: ${F(a)} m/s².`,
            `2-ci addım: ω = 2πν (π = 3 olduqda 6ν). 2π çarpanı unudulub. Düz cavab: ${F(a)} m/s².`,
            `3-cü addım: mərkəzəqaçma təcili ω²R-dir, ωR sürətdir. Düz cavab: ${F(a)} m/s².`][bad];
        } else {
          const [kmh, v] = pick([[36, 10], [54, 15], [72, 20]]), mu = pick([0.2, 0.3, 0.4, 0.5]), Rr = v * v / (10 * mu);
          if (!nice(Rr, 1)) return this.gen();
          task = `Avtomobil ${kmh} km/saat sürətlə radiusu ${F(Rr)} m olan üfüqi döngəni dönür. Təkərlərlə yol arasında sürtünmə əmsalı ən azı nə qədər olmalıdır?`;
          const vUse = bad === 0 ? kmh : v, aUse = bad === 1 ? vUse / Rr : vUse * vUse / Rr, muUse = bad === 2 ? 10 / aUse : aUse / 10;
          steps = [
            bad === 0 ? `Sürət v = ${kmh} (bu ədədi götürürük).` : `Sürət v = ${kmh}/3,6 = ${v} m/s.`,
            bad === 1 ? `Mərkəzəqaçma təcili a = v/R = ${vUse}/${F(Rr)} = ${F(aUse)} m/s².` : `Mərkəzəqaçma təcili a = v²/R = ${vUse * vUse}/${F(Rr)} = ${F(aUse)} m/s².`,
            bad === 2 ? `Sürtünmə qüvvəsi təcil yaradır: μmg = ma → μ = g/a = 10/${F(aUse)} = ${F(muUse)}.` : `Sürtünmə qüvvəsi təcil yaradır: μmg = ma → μ = a/g = ${F(aUse)}/10 = ${F(muUse)}.`,
          ];
          why = [`1-ci addım: km/saat 3,6-ya bölünüb m/s-ə çevrilməlidir: ${v} m/s. Düz cavab μ = ${F(mu)}.`,
            `2-ci addım: mərkəzəqaçma təcili v²/R-dir (v/R yox). Düz cavab μ = ${F(mu)}.`,
            `3-cü addım: μmg = ma-dan μ = a/g, g/a deyil. Düz cavab μ = ${F(mu)}.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Dönmə, çarx, paltaryuyan maşın, telefon təcrübəsi. Çevrədə cismi saxlayan qüvvə mərkəzə yönəlir: F = ma = mv²/R = mω²R.",
      gen() {
        const kind = pick(["fer", "don", "don", "yuyan", "ip", "tel", "tel", "gurz"]);
        if (kind === "fer") { for (;;) { const Rr = pick([5, 10, 15, 20, 25, 30, 40]), T = pick([10, 12, 15, 20, 30, 60, 120]), v = 6 * Rr / T; if (!nice(v, 2)) continue; const w = pick(["v", "a"]); const a = v * v / Rr; if (w === "a" && !nice(a, 3)) continue;
          return w === "v" ? R(v, "m/s", { text: `Lunaparkda "Şeytan çarxı"nın radiusu ${Rr} m-dir, bir dövrü ${T} s-dir. Kabinənin sürəti nə qədərdir? (π = 3)`, solution: `v = 2πR/T = 6·${Rr}/${T} = ${F(v)} m/s.` })
            : R(a, "m/s²", { text: `Lunaparkda "Şeytan çarxı"nın radiusu ${Rr} m-dir, bir dövrü ${T} s-dir. Kabinənin mərkəzəqaçma təcili nə qədərdir? (π = 3)`, solution: `v = 2πR/T = 6·${Rr}/${T} = ${F(v)} m/s. a = v²/R = ${F(v * v)}/${Rr} = ${F(a)} m/s².` }); } }
        if (kind === "don") {
          const w = pick(["vmax", "Rmin", "mu"]), mu = pick([0.4, 0.5, 0.8]), v = pick([10, 15, 20, 25]), Rr = v * v / (10 * mu);
          if (!nice(Rr, 1)) return this.gen();
          if (w === "vmax") return R(v, "m/s", { text: `Avtomobil radiusu ${F(Rr)} m olan üfüqi döngəni dönür. Təkərlərlə yol arasında sürtünmə əmsalı ${F(mu)}-dir. Sürüşmədən dönə biləcəyi ən böyük sürət nə qədərdir?`, solution: `Dönməni sürtünmə qüvvəsi təmin edir: μmg = mv²/R → v = √(μgR) = √(${F(mu)}·10·${F(Rr)}) = √${v * v} = ${v} m/s. (Kütlə ixtisar olunur.)` });
          if (w === "Rmin") return R(Rr, "m", { text: `Avtomobil ${v} m/s sürətlə üfüqi döngəni dönür. Sürtünmə əmsalı ${F(mu)}-dir. Sürüşmədən dönə biləcəyi ən kiçik radius nə qədərdir?`, solution: `μmg = mv²/R → R = v²/(μg) = ${v * v}/(${F(mu)}·10) = ${F(Rr)} m.` });
          return R(mu, "", { text: `Avtomobil ${v} m/s sürətlə radiusu ${F(Rr)} m olan üfüqi döngəni dönür və sürüşmə həddindədir. Sürtünmə əmsalı nə qədərdir?`, tol: 0.005, solution: `μmg = mv²/R → μ = v²/(gR) = ${v * v}/(10·${F(Rr)}) = ${F(mu)}.` });
        }
        if (kind === "yuyan") { const n = pick([600, 900, 1200]), Rr = pick([0.2, 0.25]), nu = n / 60, w = 6 * nu, a = w * w * Rr; if (!nice(a, 2)) return this.gen(); return R(a, "m/s²", { text: `Paltaryuyan maşının barabanı sıxanda dəqiqədə ${n} dövr edir. Barabanın radiusu ${F(Rr)} m-dir. Kənardakı paltarın mərkəzəqaçma təcilini tap (π = 3).`, solution: `ν = ${n}/60 = ${F(nu)} 1/s, ω = 6ν = ${F(w)} rad/s. a = ω²R = ${F(w * w)}·${F(Rr)} = ${F(a)} m/s² (təxminən ${Math.round(a / 10)} dəfə g).` }); }
        if (kind === "ip") { const m = pick([0.1, 0.2, 0.25, 0.5]), v = pick([2, 3, 4, 5, 6]), Rr = pick([0.5, 1, 2]), T = m * v * v / Rr; if (!nice(T, 2)) return this.gen(); return R(T, "N", { text: `${F(m)} kq kütləli kürə uzunluğu ${F(Rr)} m olan iplə hamar üfüqi masada çevrə üzrə ${v} m/s sürətlə fırlanır. İpin gərilmə qüvvəsi nə qədərdir?`, solution: `Kürəyə üfüqi istiqamətdə yalnız ipin gərilməsi təsir edir, o, mərkəzəqaçma təcilini yaradır: T = mv²/R = ${F(m)}·${v * v}/${F(Rr)} = ${F(T)} N.` }); }
        if (kind === "tel") { const nu = pick([0.5, 1, 1.5, 2]), Rr = pick([0.1, 0.15, 0.2, 0.25, 0.3]), a = 36 * nu * nu * Rr; if (!nice(a, 2)) return this.gen(); return R(a, "m/s²", { text: `Elvin telefonu fırlanan platformanın mərkəzindən ${F(Rr)} m məsafədə yapışdırıb. Platforma saniyədə ${F(nu)} dövr edir. Telefonun akselerometri mərkəzəqaçma təcili üçün hansı qiyməti göstərməlidir? (π = 3)`, solution: `ω = 2πν = 6·${F(nu)} = ${F(6 * nu)} rad/s. a = ω²R = ${F(36 * nu * nu)}·${F(Rr)} = ${F(a)} m/s². Təcrübədə bu düsturla ölçməni yoxlayırıq.` }); }
        const m = pick([2, 4, 5]), nu = pick([1, 2]), Rr = pick([1, 1.5, 2]), Fv = m * 36 * nu * nu * Rr; if (!nice(Fv, 2)) return this.gen();
        return R(Fv, "N", { text: `Gürz atan atlet ${m} kq kütləli gürzü ${F(Rr)} m radiuslu çevrə üzrə saniyədə ${nu} dövr sürətlə fırladır. Buraxmazdan əvvəl gürzü saxlayan qüvvənin mərkəzə yönəlmiş (üfüqi) toplananı nə qədərdir? (π = 3, üfüqi çevrə kimi götür.)`, solution: `ω = 6ν = ${6 * nu} rad/s. F = mω²R = ${m}·${36 * nu * nu}·${F(Rr)} = ${F(Fv)} N.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a figure and several steps;
  // the wrong options are the answers of typical mistakes. Questions 3, 4, 5, 6 also use an earlier topic (birlesik).
  // string-based SVG helpers (the lesson tab's figures are produced by the same code)
  const FIG = (() => {
    const INK = "var(--ink,#1c2433)", MUT = "var(--muted,#5b6578)", ACC = "var(--accent,#2c4a8a)", VEC = "var(--vec,#b4561b)", SOFT = "var(--accent-soft,#e6ecf7)", PAP = "var(--paper,#f6f7f9)";
    const q = n => +(+n).toFixed(1), DSH = ' stroke-dasharray="4 3"';
    const sL = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${q(x1)}" y1="${q(y1)}" x2="${q(x2)}" y2="${q(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
    const sT = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${q(x)}" y="${q(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
    const sC = (cx, cy, r, fill = "none", c = INK, w = 2, ex = "") => `<circle cx="${q(cx)}" cy="${q(cy)}" r="${q(r)}" fill="${fill}" stroke="${c}" stroke-width="${w}"${ex}/>`;
    const head = (x, y, ux, uy, c) => `<polygon points="${q(x)},${q(y)} ${q(x - ux * 9 - uy * 4.5)},${q(y - uy * 9 + ux * 4.5)} ${q(x - ux * 9 + uy * 4.5)},${q(y - uy * 9 - ux * 4.5)}" fill="${c}"/>`;
    const sA = (x1, y1, x2, y2, c = ACC, w = 2.5) => { const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L; return sL(x1, y1, x2 - ux * 8, y2 - uy * 8, c, w) + head(x2, y2, ux, uy, c); };
    const sub = (b, s) => `${b}<tspan dy="3" font-size="10">${s}</tspan>`;
    const sS = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" class="oy-svg" role="img" aria-label="${aria}">${inner}</svg>`;
    const rad = d => d * Math.PI / 180;

    // top view of a circle, the point at angle deg (counter-clockwise): v along the tangent; string = solid radius with tension arrow T
    function circ(Rt, o, deg) {
      const cx = 140, cy = 110, r = 70, th = rad(deg), px = cx + r * Math.cos(th), py = cy - r * Math.sin(th), tx = -Math.sin(th), ty = -Math.cos(th);
      let s = sC(cx, cy, r, "none", MUT, 1.6, o.string ? DSH : "") + sC(cx, cy, 3, INK, INK, 1);
      s += o.string ? sL(cx, cy, px, py, INK, 2.5) + sC(px, py, 8, INK, INK, 1) : sL(cx, cy, px, py, MUT, 1.4, DSH) + sC(px, py, 6, INK, INK, 1);
      const nx = -(py - cy) / r, ny = (px - cx) / r;   // unit normal of the radius: the label goes beside it
      s += sT((cx + px) / 2 + nx * 11, (cy + py) / 2 + ny * 11 + 4, "R", "middle", INK, 13) + sT(8, 214, "R = " + Rt, "start", INK, 13);
      if (o.v) s += sA(px, py, px + tx * 46, py + ty * 46, ACC) + sT(px + tx * 60, py + ty * 60 + 5, "v", "middle", ACC);
      if (o.T) s += sA(px, py, px + (cx - px) * 0.5, py + (cy - py) * 0.5, VEC) + sT(px + (cx - px) * 0.25 - nx * 12, py + (cy - py) * 0.25 - ny * 12 + 4, "T", "middle", VEC);
      return sS(280, 220, s, o.string ? "Üfüqi çevrə üzrə fırlanan kürə, üstdən görünüş" : "Çevrə üzrə hərəkət, üstdən görünüş");
    }
    // two pulleys joined by a belt (exact external tangents)
    function belt(r1, r2) {
      const k = Math.min(70 / Math.max(r1, r2), 100 / (r1 + r2)), a = r1 * k, b = r2 * k, x1 = 30 + a, x2 = 250 - b, y = 90, D = x2 - x1, nx = (a - b) / D, ny = Math.sqrt(1 - nx * nx);
      let s = sC(x1, y, a, SOFT) + sC(x2, y, b, SOFT);
      for (const sg of [-1, 1]) s += sL(x1 + a * nx, y + sg * a * ny, x2 + b * nx, y + sg * b * ny, INK, 2.5);
      s += sC(x1, y, 3, INK, INK, 1) + sC(x2, y, 3, INK, INK, 1) + sT(x1, y - 9, "R₁", "middle", INK, 13) + sT(x2, y - 9, "R₂", "middle", INK, 13);
      return sS(280, 180, s, "Qayışla bağlı iki çarx: R₁ və R₂");
    }
    // convex (hump) bridge or concave (dip): a car in the middle, radius to the centre O
    function bridge(convex) {
      const cx = 130, r = 100, an = rad(40), dx = r * Math.sin(an), dy = r * Math.cos(an), top = convex ? 62 : 138, cy = convex ? top + r : top - r, yE = convex ? cy - dy : cy + dy, y0 = top - 18;
      let s = `<path d="M${q(cx - dx)} ${q(yE)} A${r} ${r} 0 0 ${convex ? 1 : 0} ${q(cx + dx)} ${q(yE)}" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
      s += sL(cx, top, cx, cy, MUT, 1.4, DSH) + sC(cx, cy, 3, INK, INK, 1) + sT(cx + 10, (top + cy) / 2 + 4, "R", "start", INK, 13) + sT(cx - 10, cy + (convex ? 15 : -8), "O", "end", MUT, 12);
      s += `<rect x="${cx - 19}" y="${y0}" width="38" height="14" rx="3" fill="${SOFT}" stroke="${INK}" stroke-width="2"/>` + sC(cx - 10, top - 3.5, 3.5, INK, INK, 1) + sC(cx + 10, top - 3.5, 3.5, INK, INK, 1) + sT(cx, y0 + 11, "m", "middle", INK, 11);
      s += sA(cx + 26, y0 + 7, cx + 70, y0 + 7, ACC) + sT(cx + 79, y0 + 12, "v", "middle", ACC);
      return sS(260, 190, s, convex ? "Qabarıq körpü: avtomobil ən yuxarı nöqtədə, əyrilik radiusu R" : "Çökək yol: avtomobil ən aşağı nöqtədə, əyrilik radiusu R");
    }
    // top view of a turntable: a block at distance r from the axis, friction toward the axis, rotation arrow
    function turn() {
      const cx = 120, cy = 100, bx = cx + 52, a1 = rad(30), a2 = rad(150), r0 = 26, [x1, y1] = [cx + r0 * Math.cos(a1), cy - r0 * Math.sin(a1)], [x2, y2] = [cx + r0 * Math.cos(a2), cy - r0 * Math.sin(a2)];
      let s = sC(cx, cy, 80, SOFT, INK, 2.5) + sC(cx, cy, 3, INK, INK, 1) + sL(cx, cy, bx, cy, MUT, 1.4, DSH) + sT(cx + 26, cy + 17, "r", "middle", INK, 13);
      s += `<rect x="${bx - 10}" y="${cy - 10}" width="20" height="20" rx="2" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + sA(bx - 12, cy - 15, cx + 14, cy - 15, VEC) + sT(cx + 38, cy - 22, sub("F", "s"), "middle", VEC, 13);
      s += `<path d="M${q(x1)} ${q(y1)} A${r0} ${r0} 0 0 0 ${q(x2)} ${q(y2)}" fill="none" stroke="${ACC}" stroke-width="2.2"/>` + head(x2, y2, -Math.sin(a2), -Math.cos(a2), ACC) + sT(cx, cy - 34, "ω", "middle", ACC, 14);
      return sS(260, 200, s, "Üfüqi dönən disk, mərkəzdən r məsafədə cisim");
    }
    // two runners start at one point of a circular track
    function run(same) {
      const cx = 130, cy = 117, r = 72, top = cy - r;
      let s = sC(cx, cy, r, "none", MUT, 7, ' opacity=".35"') + sC(cx, cy, r, "none", INK, 1.6) + sC(cx, top, 4.5, INK, INK, 1) + sT(cx, top + 21, "Başlanğıc", "middle", INK, 12);
      s += sL(cx, cy, cx + r * 0.7, cy + r * 0.71, MUT, 1.3, DSH) + sC(cx, cy, 3, INK, INK, 1) + sT(cx + 30, cy + 30, "R", "middle", MUT, 13);
      if (same) s += sA(cx + 4, 28, cx + 64, 28, ACC) + sT(cx + 76, 33, sub("v", "1"), "middle", ACC) + sA(cx + 4, 14, cx + 44, 14, VEC) + sT(cx + 56, 19, sub("v", "2"), "middle", VEC);
      else s += sA(cx + 4, 24, cx + 64, 24, ACC) + sT(cx + 76, 29, sub("v", "1"), "middle", ACC) + sA(cx - 4, 24, cx - 44, 24, VEC) + sT(cx - 56, 29, sub("v", "2"), "middle", VEC);
      return sS(260, 200, s, "Dairəvi yol: iki qaçışçı eyni nöqtədən " + (same ? "eyni" : "əks") + " istiqamətdə qaçır");
    }
    // top view: the string is cut at P, the ball flies along the tangent to the landing point L; d = distance from the axis point O
    function release() {
      const ox = 90, oy = 126, r = 70, py = oy - r, lx = 205;
      let s = sC(ox, oy, r, "none", MUT, 1.6, DSH) + sL(ox, oy, ox, py, INK, 2.5) + sC(ox, py, 6, INK, INK, 1) + sC(ox, oy, 3, INK, INK, 1) + sT(ox - 10, oy + 16, "O", "end", MUT, 12);
      s += sA(ox + 8, py, lx - 8, py, ACC) + sT(ox + 60, py - 9, "v", "middle", ACC) + `<path d="M${ox} ${py + 9} L${ox + 9} ${py + 9} L${ox + 9} ${py}" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
      s += sL(ox, oy, lx, py, VEC, 2, DSH) + sC(lx, py, 4.5, VEC, VEC, 1) + sT(ox - 8, (oy + py) / 2 + 4, "R", "end", INK, 13) + sT(ox + 78, (oy + py) / 2 + 30, "d = ?", "start", VEC, 13);
      return sS(280, 200, s, "Üstdən görünüş: ip qırılır, kürə toxunan boyunca uçub yerə düşür; d — düşmə nöqtəsinin O nöqtəsindən məsafəsi");
    }
    // a disk with two points A and B on one radius, the speed of A
    function disk() {
      const cx = 110, cy = 100, xa = cx + 36, xb = cx + 68;
      let s = sC(cx, cy, 82, SOFT, INK, 2.5) + sL(cx, cy, cx + 82, cy, MUT, 1.4, DSH) + sC(cx, cy, 3, INK, INK, 1) + sT(cx - 6, cy + 17, "O", "end", MUT, 12);
      s += sC(xa, cy, 4.5, INK, INK, 1) + sC(xb, cy, 4.5, INK, INK, 1) + sT(xa, cy + 19, "A", "middle", INK, 13) + sT(xb, cy + 19, "B", "middle", INK, 13);
      s += sA(xa, cy - 6, xa, cy - 46, ACC) + sT(xa + 8, cy - 40, sub("v", "A"), "start", ACC);
      return sS(260, 200, s, "Fırlanan disk: A və B nöqtələri bir radius üzərindədir, A nöqtəsinin sürəti göstərilib");
    }
    // clock face; the hour hand is drawn in the proportion L2/L1
    function clock(L1, L2, hh, mm) {
      const cx = 110, cy = 110, tip = (d, l) => [cx + l * Math.sin(rad(d)), cy - l * Math.cos(rad(d))];
      let s = sC(cx, cy, 92, PAP, INK, 2.5);
      for (let i = 0; i < 12; i++) { const [a, b] = tip(i * 30, 92), [c, d] = tip(i * 30, 82); s += sL(a, b, c, d, INK, i % 3 ? 1.4 : 2.6); }
      const dm = 6 * mm, dh = 30 * (hh % 12) + mm / 2, lm = 76, lh = 76 * L2 / L1, [mx, my] = tip(dm, lm), [hx, hy] = tip(dh, lh);
      s += sL(cx, cy, mx, my, ACC, 3.2) + sL(cx, cy, hx, hy, VEC, 4.6) + sC(cx, cy, 4, INK, INK, 1);
      const lab = (d, l, t, c) => { const [x, y] = tip(d, l); return sT(x + 11 * Math.cos(rad(d)), y + 11 * Math.sin(rad(d)) + 4, t, "middle", c, 13); };
      s += lab(dm, lm * 0.55, "L₁", ACC) + lab(dh, lh * 0.6, "L₂", VEC);
      return sS(220, 220, s, "Saat: dəqiqə əqrəbi L₁, saat əqrəbi L₂");
    }
    // the planet in section: axis, equator, the point P at latitude 60°
    function earth() {
      const cx = 110, cy = 100, r = 76, an = rad(60), px = cx + r * Math.cos(an), py = cy - r * Math.sin(an), ra = 22;
      let s = sC(cx, cy, r, SOFT, INK, 2.5) + sL(cx, 10, cx, 190, INK, 1.6, DSH) + sT(cx - 8, 20, "ox", "end", INK, 12) + sL(cx - r - 14, cy, cx + r + 14, cy, MUT, 1.3, DSH);
      s += `<ellipse cx="${cx}" cy="${q(py)}" rx="${q(px - cx)}" ry="9" fill="none" stroke="${MUT}" stroke-width="1.3"${DSH}/>` + sL(cx, cy, px, py, ACC, 2.5) + sL(cx, py, px, py, VEC, 2.2) + sC(cx, cy, 3, INK, INK, 1) + sC(px, py, 4.5, VEC, VEC, 1);
      s += `<path d="M${cx + ra} ${cy} A${ra} ${ra} 0 0 0 ${q(cx + ra * Math.cos(an))} ${q(cy - ra * Math.sin(an))}" fill="none" stroke="${INK}" stroke-width="1.6"/>` + sT(cx + 36, cy - 6, "φ", "middle", INK, 14);
      s += sT((cx + px) / 2 - 6, (cy + py) / 2 + 12, "R", "end", ACC, 13) + sT((cx + px) / 2, py - 15, "r", "middle", VEC, 13) + sT(px + 8, py - 4, "P", "start", INK, 12);
      return sS(240, 200, s, "Planetin kəsiyi: fırlanma oxu, ekvator və P nöqtəsi (enlik φ); r — P-nin oxdan məsafəsi");
    }
    return { circ, belt, bridge, turn, run, release, disk, clock, earth };
  })();
  const IMT = (() => {
    const { ae, again } = Oyun;
    const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
    const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
    const U_ = u => x => F(+x.toFixed(4)) + " " + u;
    const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
    const Fx = x => F(+x.toFixed(4));
    return { fenn: "fizika", vaxt: 60, suallar: [
      // 1. linear speed from revolutions per minute (unit trap, 2π trap)
      { tip: "qapali", gen: () => again(() => {
        const Rr = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8, 1, 1.5, 2]), n = pick([60, 90, 120, 150, 180, 240, 300, 600]), v = Rr * n / 10;
        const w = [6 * Rr * n, Rr * n / 60, Rr * n / 20, n / 10]; if (![v, ...w].every(x => ok2(x))) return null;
        return mc(ae(v, w, U_("m/s")), { svg: svgEl(FIG.circ(F(Rr) + " m", { v: true }, rnd(0, 359))),
          text: `Çarxın radiusu ${F(Rr)} m-dir, o, dəqiqədə ${n} dövr edir. Çarxın kənarındakı nöqtənin xətti sürəti nə qədərdir? (π = 3)`,
          solution: `ν = ${n}/60 = ${F(n / 60)} 1/s (1 dəq = 60 s). v = 2πRν = 6·${F(Rr)}·${F(n / 60)} = ${F(v)} m/s. Tələlər: dəqiqəni saniyəyə çevirməmək (${F(w[0])}), 2π-ni unutmaq (${F(w[1])}), 2π əvəzinə yalnız π yazmaq (${F(w[2])}), R-i vurmamaq — bu bucaq sürətidir (${F(w[3])}).` });
      }) },
      // 2. belt drive: same v at the rims, then a = v²/R
      { tip: "qapali", gen: () => again(() => {
        const r1 = pick([10, 15, 20, 25, 30, 40]), r2 = pick([10, 15, 20, 25, 30, 40, 50]), nu = pick([2, 3, 4, 5, 6, 8, 10]); if (r1 === r2) return null;
        const R1 = r1 / 100, R2 = r2 / 100, v = 6 * R1 * nu, a = v * v / R2, w = [v * v / R1, (6 * nu) ** 2 * R2, v / R2, v * v / (2 * R2)];
        if (![a, ...w].every(x => ok2(x))) return null;
        return mc(ae(a, w, U_("m/s²")), { svg: svgEl(FIG.belt(r1, r2)),
          text: `Qayışla bağlı çarxların radiusları R₁ = ${r1} sm və R₂ = ${r2} sm-dir. Birinci çarx saniyədə ${nu} dövr edir. İkinci çarxın kənarındakı nöqtənin mərkəzəqaçma təcili nə qədərdir? (Qayış sürüşmür, π = 3.)`,
          solution: `Qayış sürüşmür — çarxların kənarında xətti sürət eynidir: v = 2πR₁ν₁ = 6·${F(R1)}·${nu} = ${F(v)} m/s. a₂ = v²/R₂ = ${F(v * v)}/${F(R2)} = ${F(a)} m/s². Tələlər: birinci çarxın təcili (${F(w[0])}), ω-nı eyni saymaq (${F(w[1])}), a = v/R yazmaq (${F(w[2])}), R əvəzinə diametri götürmək (${F(w[3])}).` });
      }) },
      // 3. (+ Newton's laws) car on a hump bridge / in a dip
      { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
        const convex = Math.random() < 0.5, m = pick([500, 600, 800, 1000, 1200, 1500, 2000]), Rr = pick([20, 25, 40, 50, 60, 80, 100]), v = pick([5, 8, 10, 12, 15, 20]), a = v * v / Rr;
        if (convex && a >= g) return null;
        const N = m * (convex ? g - a : g + a), w = convex ? [m * g, m * (g + a), m * a, m * (g - a / 2)] : [m * g, m * (g - a), m * a, m * (g + a / 2)];
        if (![N, ...w].every(x => ok2(x, 0))) return null;
        return mc(ae(N, w, U_("N")), { svg: svgEl(FIG.bridge(convex)),
          text: `Kütləsi ${m} kq olan avtomobil ${convex ? "qabarıq körpünün ən yuxarı nöqtəsindən" : "çökək yolun ən aşağı nöqtəsindən"} ${v} m/s sürətlə keçir. ${convex ? "Körpünün" : "Yolun"} əyrilik radiusu ${Rr} m-dir. Avtomobil ${convex ? "körpüyə" : "yola"} nə qədər qüvvə ilə təzyiq edir? (g = 10 m/s²)`,
          solution: convex
            ? `a = v²/R = ${v * v}/${Rr} = ${F(a)} m/s² (mərkəzə, yəni aşağı). Nyutonun II qanunu (aşağı istiqamət müsbət): mg − N = ma → N = m(g − a) = ${m}·${F(g - a)} = ${F(N)} N. III qanuna görə avtomobil körpüyə eyni qüvvə ilə təzyiq edir. Tələlər: mərkəzəqaçma təcilini unutmaq (mg = ${m * g} N), işarəni səhv qoymaq (m(g + a) = ${F(w[1])} N — bu çökək yolda düzdür), N = ma (${F(w[2])} N), R əvəzinə diametri götürmək (${F(w[3])} N).`
            : `a = v²/R = ${v * v}/${Rr} = ${F(a)} m/s² (mərkəzə, yəni yuxarı). Nyutonun II qanunu (yuxarı istiqamət müsbət): N − mg = ma → N = m(g + a) = ${m}·${F(g + a)} = ${F(N)} N. III qanuna görə avtomobil yola eyni qüvvə ilə təzyiq edir. Tələlər: mərkəzəqaçma təcilini unutmaq (mg = ${m * g} N), işarəni səhv qoymaq (m(g − a) = ${F(w[1])} N — bu qabarıq körpüdə düzdür), N = ma (${F(w[2])} N), R əvəzinə diametri götürmək (${F(w[3])} N).` });
      }) },
      // 4. (+ friction) a block on a turntable: friction is the centripetal force
      { tip: "qapali", birlesik: "fiz-surtunme-maili", gen: () => again(() => {
        const nu = pick([0.25, 0.5, 0.75, 1, 1.25, 1.5, 2]), rcm = pick([10, 12, 15, 16, 20, 24, 25, 30, 32, 36, 40, 45, 50, 60, 75, 80]), rm = rcm / 100, mu = 36 * nu * nu * rm / g;
        const w = [nu * nu * rm / g, 6 * nu * rm / g, 9 * nu * nu * rm / g, 36 * nu * nu * rm];
        if (!ok2(mu, 3) || mu > 1.2 || ![...w].every(x => ok2(x, 4))) return null;
        const how = pick([0, 1, 2]), rot = how === 0 || nu * 60 % 1 || (how === 2 && ![0.25, 0.5, 1, 2].includes(nu)) ? `saniyədə ${F(nu)} dövr edir` : how === 1 ? `dəqiqədə ${F(nu * 60)} dövr edir` : `${F(1 / nu)} s periodla fırlanır`;
        return mc(ae(mu, w, Fx), { svg: svgEl(FIG.turn()),
          text: `Üfüqi disk bərabərsürətlə ${rot}. Diskin üzərində, onun mərkəzindən ${rcm} sm məsafədə kiçik cisim yerləşir. Cismin sürüşməməsi üçün cisimlə disk arasındakı sükunət sürtünmə əmsalı ən azı nə qədər olmalıdır? (π = 3, g = 10 m/s²)`,
          solution: `Üfüqi istiqamətdə cismə yalnız sürtünmə qüvvəsi təsir edir, o, cismi çevrədə saxlayır: μmg = mω²r (kütlə ixtisar olunur). ν = ${F(nu)} 1/s, ω = 2πν = 6·${F(nu)} = ${F(6 * nu)} rad/s, r = ${F(rm)} m. μ = ω²r/g = ${F(36 * nu * nu)}·${F(rm)}/10 = ${F(mu)}. Tələlər: 2π-ni unutmaq (${Fx(w[0])}), ω² əvəzinə ω götürmək (${Fx(w[1])}), 2π əvəzinə π (${Fx(w[2])}), g-yə bölməmək — bu təcildir, əmsal deyil (${Fx(w[3])}).` });
      }) },
      // 5. (+ kinematics) two runners on a circular track
      { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
        const same = Math.random() < 0.5, Rr = pick([10, 20, 25, 30, 40, 50, 60, 100]), L = 6 * Rr, v1 = rnd(3, 12), v2 = rnd(2, 11); if (v2 >= v1) return null;
        const t = same ? L / (v1 - v2) : L / (v1 + v2), w = same ? [L / (v1 + v2), Rr / (v1 - v2), L / v1, L / v2] : [L / (v1 - v2), Rr / (v1 + v2), L / v1, L / v2];
        if (![t, ...w].every(x => ok2(x, 1))) return null;
        return mc(ae(t, w, U_("s")), { svg: svgEl(FIG.run(same)),
          text: `Radiusu ${Rr} m olan dairəvi yolun eyni nöqtəsindən iki qaçışçı eyni anda ${same ? "eyni" : "əks"} istiqamətdə qaçmağa başlayır. Birinci qaçışçının sürəti ${v1} m/s, ikincinin sürəti ${v2} m/s-dir. Onlar ilk dəfə nə vaxt yenidən yanaşı olacaqlar? (π = 3)`,
          solution: `Dairənin uzunluğu L = 2πR = 6·${Rr} = ${L} m. ` + (same
            ? `Eyni istiqamətdə sürətli qaçışçı hər saniyə ${v1 - v2} m qazanır; o, yavaşı bir tam dövr qədər (L) qabaqlayanda yanaşı olurlar: t = L/(v₁ − v₂) = ${L}/${v1 - v2} = ${F(t)} s. Tələlər: sürətləri toplamaq (${F(w[0])} s — bu əks istiqamətdədir), L əvəzinə R (${F(w[1])} s), yalnız bir qaçışçının dövrü (${F(w[2])} s və ${F(w[3])} s).`
            : `Əks istiqamətdə məsafə hər saniyə ${v1 + v2} m azalır; birlikdə bir tam dövr (L) qət edəndə görüşürlər: t = L/(v₁ + v₂) = ${L}/${v1 + v2} = ${F(t)} s. Tələlər: sürətləri çıxmaq (${F(w[0])} s — bu eyni istiqamətdədir), L əvəzinə R (${F(w[1])} s), yalnız bir qaçışçının dövrü (${F(w[2])} s və ${F(w[3])} s).`) });
      }) },
      // 6. (+ free fall) the string breaks: horizontal throw from the circle, distance from the axis (Pythagoras)
      { tip: "qapali", birlesik: "fiz-serbest-dusme", gen: () => again(() => {
        const [Rr, s] = pick([[3, 4], [4, 3], [6, 8], [8, 6], [5, 12], [12, 5], [9, 12], [12, 9], [1.5, 2], [2, 1.5], [0.6, 0.8], [0.8, 0.6]]), t = pick([0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1]), v = s / t, h = 5 * t * t;
        if (!(nice(v, 1) && v >= 1 && v <= 20 && nice(h, 2))) return null;
        const d = Math.hypot(Rr, s), w = [s, Rr + s, Math.abs(s - Rr), Rr]; if (![d, ...w].every(x => ok2(x, 1))) return null;
        return mc(ae(d, w, U_("m")), { svg: svgEl(FIG.release()),
          text: `Hamar üfüqi dairəvi lövhə yerdən ${F(h)} m hündürlükdədir, lövhənin radiusu ${F(Rr)} m-dir. Kürə lövhənin kənarı boyunca, uzunluğu ${F(Rr)} m olan iplə mərkəzə bağlı halda ${F(v)} m/s sürətlə fırlanır. İp qırılır, kürə lövhədən uçub yerə düşür. Düşmə nöqtəsi lövhənin mərkəzinin düz altındakı O nöqtəsindən nə qədər məsafədədir? (Havanın müqaviməti yoxdur, g = 10 m/s².)`,
          solution: `Qırılan anda sürət toxunan boyunca, üfüqi yönəlib: kürə üfüqi atılır. h = gt²/2 → t = √(2h/g) = √(${F(2 * h)}/10) = ${F(t)} s. Toxunan boyunca məsafə s = vt = ${F(v)}·${F(t)} = ${F(s)} m. Toxunan radiusa perpendikulyardır: d² = R² + s² = ${F(Rr * Rr)} + ${F(s * s)} = ${F(d * d)} → d = ${F(d)} m. Tələlər: yalnız s (${F(w[0])} m), R + s toplamaq (${F(w[1])} m), |s − R| (${F(w[2])} m), "kürə düz aşağı düşür" — yalnız R (${F(w[3])} m).` });
      }) },
      // 7. one disk: the same ω, the speed of A → the acceleration of B
      { tip: "qapali", gen: () => again(() => {
        const rA = pick([10, 15, 20, 25, 30]), rB = pick([20, 30, 40, 50, 60, 75]), vA = pick([0.5, 1, 1.5, 2, 3, 4, 5]); if (rB <= rA) return null;
        const Am = rA / 100, Bm = rB / 100, om = vA / Am, a = om * om * Bm, w = [vA * vA / Bm, vA * rB / rA, vA * vA / Am, om * om * Bm * Bm];
        if (![a, ...w].every(x => ok2(x))) return null;
        return mc(ae(a, w, U_("m/s²")), { svg: svgEl(FIG.disk()),
          text: `Disk oxu ətrafında bərabərsürətli fırlanır. A nöqtəsi oxdan ${rA} sm, B nöqtəsi ${rB} sm məsafədədir. A nöqtəsinin sürəti ${F(vA)} m/s-dir. B nöqtəsinin mərkəzəqaçma təcili nə qədərdir?`,
          solution: `Diskin bütün nöqtələrinin bucaq sürəti eynidir: ω = v_A/r_A = ${F(vA)}/${F(Am)} = ${F(om)} rad/s. a_B = ω²r_B = ${F(om * om)}·${F(Bm)} = ${F(a)} m/s². Tələlər: sürəti eyni saymaq (${F(w[0])}), B-nin sürətini tapıb təcil yazmaq (${F(w[1])} — bu v_B-dir), A-nın təcili (${F(w[2])}), a = ω²r² yazmaq (${F(w[3])}).` });
      }) },
      // 8. a ball on a string on a smooth table: tension = centripetal force
      { tip: "qapali", gen: () => again(() => {
        const m = pick([0.1, 0.2, 0.25, 0.5, 1, 2]), nu = pick([0.5, 1, 1.5, 2, 2.5]), Rr = pick([0.2, 0.25, 0.4, 0.5, 1, 2]), T = 36 * m * nu * nu * Rr;
        const w = [m * nu * nu * Rr, 6 * m * nu * Rr, m * g, 9 * m * nu * nu * Rr]; if (![T, ...w].every(x => ok2(x))) return null;
        return mc(ae(T, w, U_("N")), { svg: svgEl(FIG.circ(F(Rr) + " m", { string: true, T: true }, rnd(0, 359))),
          text: `Kütləsi ${F(m)} kq olan kürə uzunluğu ${F(Rr)} m olan iplə hamar üfüqi masada saniyədə ${F(nu)} dövr edir. İpin gərilmə qüvvəsi nə qədərdir? (π = 3, g = 10 m/s²)`,
          solution: `Üfüqi istiqamətdə kürəyə yalnız ipin gərilməsi təsir edir, o, mərkəzəqaçma təcilini yaradır; mg şaquli tarazlıqdadır. ω = 2πν = 6·${F(nu)} = ${F(6 * nu)} rad/s. T = mω²R = ${F(m)}·${F(36 * nu * nu)}·${F(Rr)} = ${F(T)} N. Tələlər: 2π-ni unutmaq (${F(w[0])} N), təcil əvəzinə sürəti götürmək — T = mv (${F(w[1])} N), "gərilmə ağırlığa bərabərdir" (${F(w[2])} N), 2π əvəzinə π (${F(w[3])} N).` });
      }) },
      // 9. clock hands: the speed ratio from the lengths and the periods
      { tip: "qapali", gen: () => again(() => {
        const L1 = pick([8, 9, 10, 12, 15, 18, 20, 24, 25, 30]), L2 = pick([4, 5, 6, 8, 9, 10, 12, 15, 16, 20]); if (L2 >= L1) return null;
        const k = 12 * L1 / L2, w = [L1 / L2, 12, 60 * L1 / L2, 12 * L2 / L1]; if (![k, ...w].every(x => ok2(x))) return null;
        const hh = rnd(1, 12), mm = pick([5, 10, 15, 20, 25, 35, 40, 45, 50, 55]);
        if (Math.abs(((6 * mm - 30 * (hh % 12) - mm / 2) % 360 + 540) % 360 - 180) < 70) return null;   // hands far enough apart for the labels
        return mc(ae(k, w, x => Fx(x) + " dəfə"), { svg: svgEl(FIG.clock(L1, L2, hh, mm)),
          text: `Saatın dəqiqə əqrəbinin uzunluğu ${L1} sm, saat əqrəbinin uzunluğu ${L2} sm-dir. Dəqiqə əqrəbinin ucunun xətti sürəti saat əqrəbinin ucunun xətti sürətindən neçə dəfə böyükdür?`,
          solution: `Dəqiqə əqrəbi 1 saata, saat əqrəbi 12 saata bir dövr edir: T₁ = 1 saat, T₂ = 12 saat. v = 2πL/T → v₁/v₂ = (L₁/L₂)·(T₂/T₁) = (${L1}/${L2})·12 = ${F(k)}. Tələlər: yalnız uzunluqların nisbəti (${F(w[0])}), yalnız bucaq sürətlərinin nisbəti (12), saat əqrəbinin dövrünü 60 saat saymaq (${F(w[2])}), yalnız uzunluqların nisbətini tərsinə yazmaq (${F(w[3])}).` });
      }) },
      // 10. Earth rotation: the radius of the latitude circle is R·cos φ
      { tip: "qapali", gen: () => again(() => {
        const yer = Math.random() < 0.3, Rr = yer ? 6400 : pick([2000, 3000, 4000, 4800, 5000, 6000, 8000]), T = yer ? 24 : pick([10, 12, 15, 16, 20, 24, 30, 40, 48]);
        const v = 3 * Rr / T, w = [6 * Rr / T, 12 * Rr / T, 1.5 * Rr / T, 6 / T]; if (![v, ...w].every(x => ok2(x))) return null;
        return mc(ae(v, w, U_("km/saat")), { svg: svgEl(FIG.earth()),
          text: `${yer ? "Yer kürəsinin" : "Planetin"} radiusu ${Rr} km-dir, o, öz oxu ətrafında ${T} saat periodla fırlanır. 60° enlikdəki P nöqtəsinin xətti sürəti neçə km/saatdır? (π = 3, cos 60° = 0,5)`,
          solution: `P nöqtəsi fırlanma oxundan r = R·cos 60° = ${F(Rr / 2)} km məsafədə olan çevrə üzrə hərəkət edir (R yox!). v = 2πr/T = 6·${F(Rr / 2)}/${T} = ${F(v)} km/saat. Tələlər: cos-u unutmaq — bu ekvatorun sürətidir (${F(w[0])}), cos-a vurmaq əvəzinə bölmək (${F(w[1])}), 2π əvəzinə π (${F(w[2])}), bucaq sürətini (rad/saat) cavab yazmaq (${F(w[3])}).` });
      }) },
    ] };
  })();
  levels.push(Oyun.imtLevel(IMT));
  window.__imtahan = IMT;

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-cevre-herekat", title: "Çevrə üzrə hərəkət", fenn: "fizika", link: "dersler/fiz-cevre-herekat.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: m, s, m/s, rad/s, m/s²). Onluq kəsr vergül və ya nöqtə ilə: 0,25. π = 3, g = 10 m/s².",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["dovr", "sur", "bucaq", "tecil", "tecil", "muqayise", "muqayise", "heyat", "heyat", "bucaq"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-cevre-herekat.html")) b.push("dersler/fiz-cevre-herekat.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
