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
    const k = 90 / Math.max(r1, r2), a = r1 * k, b = r2 * k, x1 = 20 + a + 6, x2 = 280 - 20 - b - 6, y = 80;
    s.append(sv("circle", { cx: x1, cy: y, r: f1(a), fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 }));
    s.append(sv("circle", { cx: x2, cy: y, r: f1(b), fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 }));
    s.append(sv("line", { x1, y1: y - a, x2, y2: y - b, stroke: "var(--ink)", "stroke-width": 2 }));
    s.append(sv("line", { x1, y1: y + a, x2, y2: y + b, stroke: "var(--ink)", "stroke-width": 2 }));
    s.append(sv("text", { x: x1 - 12, y: y + 5, class: "oy-lbl" }, "R₁"));
    s.append(sv("text", { x: x2 - 12, y: y + 5, class: "oy-lbl" }, "R₂"));
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
        if (kind === "N") { for (;;) { const w = pick([3, 6, 9, 12, 15, 18, 24]), t = rnd(2, 20), N = w * t / 6; if (nice(N, 2)) return R(N, "dövr", { text: `Cisim ${w} rad/s bucaq sürəti ilə ${t} s fırlanır. Neçə tam dövr edər? (π = 3)`, solution: `φ = ωt = ${w}·${t} = ${w * t} rad. Bir dövr 2π = 6 rad: N = ${w * t}/6 = ${F(N)}.` }); } }
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
        return R(Fv, "N", { text: `Gürz atan atlet ${m} kq kütləli gürzü ${F(Rr)} m radiuslu çevrə üzrə saniyədə ${nu} dövr sürətlə fırladır. Buraxmazdan əvvəl gürzü saxlayan qüvvə nə qədərdir? (π = 3, üfüqi çevrə kimi götür.)`, solution: `ω = 6ν = ${6 * nu} rad/s. F = mω²R = ${m}·${36 * nu * nu}·${F(Rr)} = ${F(Fv)} N.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-cevre-herekat", title: "Çevrə üzrə hərəkət", fenn: "fizika", link: "dersler/fiz-cevre-herekat.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: m, s, m/s, rad/s, m/s²). Onluq kəsr vergül və ya nöqtə ilə: 0,25. π = 3, g = 10 m/s².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["dovr", "sur", "bucaq", "tecil", "tecil", "muqayise", "muqayise", "heyat", "heyat", "bucaq"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-cevre-herekat.html")) b.push("dersler/fiz-cevre-herekat.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
