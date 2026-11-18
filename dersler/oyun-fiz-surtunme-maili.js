// Fizika · Sürtünmə, maili müstəvi — mastery game levels (friction force, motion with friction, frictionless incline, incline with friction, stay or slide) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s².
// Angles with whole-number trig values only: 37° (sin 0,6; cos 0,8), 53° (sin 0,8; cos 0,6), 30° (sin 0,5), 45° (tg 1).
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");          // 0.04 → "0,04", −2 → "−2"
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;        // v has at most d decimals
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const g = 10;
  const TR = { 37: { s: 0.6, c: 0.8 }, 53: { s: 0.8, c: 0.6 } };                          // sin, cos of the two "3-4-5" angles
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const f1 = v => +v.toFixed(1);
  const arrow = (s, x1, y1, x2, y2, color) => {
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, bx = x2 - ux * 9, by = y2 - uy * 9;
    s.append(sv("line", { x1: f1(x1), y1: f1(y1), x2: f1(bx), y2: f1(by), stroke: color, "stroke-width": 2.8 }));
    s.append(sv("polygon", { points: `${f1(x2)},${f1(y2)} ${f1(bx - uy * 5)},${f1(by + ux * 5)} ${f1(bx + uy * 5)},${f1(by - ux * 5)}`, fill: color }));
  };

  // incline of angle deg with a block; forces: mg (down), N (normal), f (along the slope; fdir = +1 up-slope, −1 down-slope), labelled
  function inclinePic(deg, o) {
    o = o || {};
    const a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), Lh = deg > 50 ? 190 : 215, ox = 24, oy = 182;
    const s = sv("svg", { viewBox: "0 0 300 200", class: "oy-svg", role: "img", "aria-label": "Maili müstəvi" });
    s.append(sv("polygon", { points: `${ox},${oy} ${f1(ox + Lh * ca)},${oy} ${f1(ox + Lh * ca)},${f1(oy - Lh * sa)}`, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 2 }));
    s.append(sv("path", { d: `M${ox + 46} ${oy} A46 46 0 0 0 ${f1(ox + 46 * ca)} ${f1(oy - 46 * sa)}`, fill: "none", stroke: "var(--accent)", "stroke-width": 2 }));
    s.append(sv("text", { x: ox + 52, y: oy - 6, class: "oy-lbl" }, "α = " + deg + "°"));
    const sd = Lh * 0.55, P0 = [ox + sd * ca, oy - sd * sa], u = [ca, -sa], n = [-sa, -ca];
    const pt = (du, dn) => [P0[0] + u[0] * du + n[0] * dn, P0[1] + u[1] * du + n[1] * dn];
    s.append(sv("polygon", { points: [pt(-22, 0), pt(22, 0), pt(22, 30), pt(-22, 30)].map(p => f1(p[0]) + "," + f1(p[1])).join(" "), fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 }));
    const C = pt(0, 15);
    if (o.mg !== false) { arrow(s, C[0], C[1], C[0], C[1] + 46, "var(--vec)"); s.append(sv("text", { x: f1(C[0] + 6), y: f1(C[1] + 52), class: "oy-lbl" }, "mg")); }
    if (o.N !== false) { arrow(s, C[0], C[1], C[0] + n[0] * 44, C[1] + n[1] * 44, "var(--accent)"); s.append(sv("text", { x: f1(C[0] + n[0] * 50 - 14), y: f1(C[1] + n[1] * 50), class: "oy-lbl" }, "N")); }
    if (o.f) { const d = o.f; arrow(s, C[0], C[1], C[0] + u[0] * 40 * d, C[1] + u[1] * 40 * d, "var(--ink)"); s.append(sv("text", { x: f1(C[0] + u[0] * 46 * d - 6), y: f1(C[1] + u[1] * 46 * d + (d > 0 ? -2 : 14)), class: "oy-lbl" }, "f")); }
    if (o.L) { const q = [ox + Lh * 0.9 * ca - sa * 10, oy - Lh * 0.9 * sa - ca * 10]; s.append(sv("text", { x: f1(q[0]), y: f1(q[1]), "text-anchor": "end", class: "oy-lbl" }, "L = ?")); }
    if (o.F) { arrow(s, C[0], C[1], C[0] + u[0] * 46, C[1] + u[1] * 46, "var(--vec)"); s.append(sv("text", { x: f1(C[0] + u[0] * 52 - 4), y: f1(C[1] + u[1] * 52 - 6), class: "oy-lbl" }, "F")); }
    return s;
  }
  function flatPic(Ftxt, fric) {
    const s = sv("svg", { viewBox: "0 0 300 130", class: "oy-svg", role: "img", "aria-label": "Üfüqi səthdə cisim" });
    s.append(sv("line", { x1: 5, y1: 100, x2: 295, y2: 100, stroke: "var(--ink)", "stroke-width": 1.8 }));
    s.append(sv("rect", { x: 100, y: 56, width: 90, height: 44, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 }));
    arrow(s, 190, 78, 250, 78, "var(--vec)"); s.append(sv("text", { x: 224, y: 68, class: "oy-lbl" }, Ftxt));
    if (fric) { arrow(s, 100, 92, 50, 92, "var(--ink)"); s.append(sv("text", { x: 54, y: 84, class: "oy-lbl" }, "f")); }
    return s;
  }
  const lbl = deg => deg === 30 ? "sin 30° = 0,5" : `sin ${deg}° = ${F(TR[deg].s)}, cos ${deg}° = ${F(TR[deg].c)}`;

  const levels = [
    { id: "surtunme", ad: "Sürtünmə qüvvəsi", izah: "Sürüşən cisimdə f = μN. Sükunət sürtünməsi tətbiq olunan qüvvəyə bərabərdir, yalnız f_max = μ_s·N-ə qədər. Üfüqi səthdə N = mg (başqa şaquli qüvvə yoxdursa).",
      gen() {
        const kind = pick(["k", "k", "hold", "hold", "mu", "wall", "angle"]);
        if (kind === "k") { const m = rnd(1, 20), mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8]), f = mu * m * g; if (!nice(f, 2)) return this.gen(); return R(f, "N", { text: `${m} kq kütləli cisim üfüqi səthdə sürüşür. Sürtünmə əmsalı ${F(mu)}-dir. Sürtünmə qüvvəsi nə qədərdir?`, solution: `Üfüqi səthdə N = mg = ${m}·10 = ${m * g} N. f = μN = ${F(mu)}·${m * g} = ${F(f)} N.` }); }
        if (kind === "hold") { const m = rnd(2, 15), mus = pick([0.4, 0.5, 0.6, 0.8]), muk = pick([0.2, 0.25, 0.3, 0.4].filter(x => x < mus)), fmax = mus * m * g, move = Math.random() < .5, Fa = move ? Math.round(fmax + rnd(5, 40)) : Math.floor(fmax * pick([0.2, 0.4, 0.6, 0.8])); if (!nice(muk * m * g, 2) || Fa <= 0) return this.gen();
          return R(move ? muk * m * g : Fa, "N", { svg: flatPic("F", true), text: `${m} kq kütləli cisim üfüqi masada durur; sükunət sürtünmə əmsalı ${F(mus)}, sürüşmə sürtünmə əmsalı ${F(muk)}-dir. Cismi üfüqi ${Fa} N qüvvə ilə itələyirlər. Sürtünmə qüvvəsi nə qədərdir?`,
            solution: `Maksimal sükunət sürtünməsi f_max = μ_s·mg = ${F(mus)}·${m * g} = ${F(fmax)} N. ` + (move ? `${Fa} N > ${F(fmax)} N — cisim tərpənir, sürüşmə sürtünməsi: f = μ_k·mg = ${F(muk)}·${m * g} = ${F(muk * m * g)} N.` : `${Fa} N < ${F(fmax)} N — cisim tərpənmir, sürtünmə itələyən qüvvəni tarazlayır: f = ${Fa} N (μN yox!).`) }); }
        if (kind === "mu") { const m = rnd(2, 20), mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]), Fv = mu * m * g; if (!nice(Fv, 2)) return this.gen(); return R(mu, "", { tol: 0.005, text: `${m} kq kütləli cismi üfüqi səthdə sabit sürətlə sürüşdürmək üçün ${F(Fv)} N üfüqi qüvvə lazımdır. Sürtünmə əmsalı nə qədərdir?`, solution: `Sabit sürət → F = f = μmg → μ = F/(mg) = ${F(Fv)}/${m * g} = ${F(mu)}.` }); }
        if (kind === "wall") { const m = pick([0.5, 1, 2, 3, 4, 5]), mu = pick([0.2, 0.25, 0.4, 0.5]), Fv = m * g / mu; if (!nice(Fv, 2)) return this.gen(); return R(Fv, "N", { text: `${F(m)} kq kütləli kitabı şaquli divara üfüqi qüvvə ilə sıxırlar ki, sürüşməsin. Kitab-divar sürtünmə əmsalı ${F(mu)}-dir. Ən azı hansı qüvvə lazımdır?`, solution: `Şaquli: sürtünmə kitabın ağırlığını tarazlayır: f = mg = ${F(m * g)} N. Üfüqi: N = F. f = μN → μF = mg → F = mg/μ = ${F(m * g)}/${F(mu)} = ${F(Fv)} N.` }); }
        const ang = pick([37, 53]), m = pick([2, 4, 5, 10]), Fv = pick([10, 20, 25, 30, 40, 50]), mu = pick([0.2, 0.25, 0.5]), N = m * g - Fv * TR[ang].s, f = mu * N;
        if (N <= 0 || !nice(N, 2) || !nice(f, 2)) return this.gen();
        const w = pick(["N", "f"]);
        return R(w === "N" ? N : f, "N", { text: `${m} kq kütləli cismi üfüqi səthdə üfüqlə ${ang}° bucaq altında yuxarı yönəlmiş ${Fv} N qüvvə ilə dartırlar (${lbl(ang)}). Cisim sürüşür, μ = ${F(mu)}. ${w === "N" ? "Səthin dayaq reaksiya qüvvəsi N nə qədərdir?" : "Sürtünmə qüvvəsi nə qədərdir?"}`,
          solution: `Şaquli: N + F·sin ${ang}° = mg → N = ${m * g} − ${Fv}·${F(TR[ang].s)} = ${F(N)} N (qüvvənin şaquli toplananı cismi yüngülləşdirir).` + (w === "f" ? ` f = μN = ${F(mu)}·${F(N)} = ${F(f)} N.` : "") });
      } },
    { id: "ufuqi", ad: "Üfüqi hərəkət, sürtünmə ilə", izah: "F_əv = F − μmg (qabağa), a = F_əv/m. Əyləcdə yalnız sürtünmə: a = μg, yol s = v₀²/(2μg), vaxt t = v₀/(μg).",
      gen() {
        const kind = pick(["a", "a", "tormoz", "tormoz", "F", "ip", "ip", "bucaq"]);
        if (kind === "a") { const m = pick([2, 4, 5, 10]), mu = pick([0.1, 0.2, 0.25, 0.4, 0.5]), a = pick([0.5, 1, 2, 2.5, 3]), Fv = m * a + mu * m * g; if (!nice(Fv, 2)) return this.gen(); return R(a, "m/s²", { svg: flatPic("F", true), text: `${m} kq kütləli cismi üfüqi səthdə ${F(Fv)} N üfüqi qüvvə ilə dartırlar. Sürtünmə əmsalı ${F(mu)}-dir. Cismin təcili nə qədərdir?`, solution: `f = μmg = ${F(mu)}·${m * g} = ${F(mu * m * g)} N. ma = F − f = ${F(Fv)} − ${F(mu * m * g)} = ${F(m * a)} → a = ${F(a)} m/s².` }); }
        if (kind === "tormoz") { const v = pick([4, 5, 6, 8, 10, 12, 15, 20]), mu = pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.8]), w = pick(["s", "t", "a"]), s = v * v / (2 * mu * g), t = v / (mu * g);
          if (w === "s") { if (!nice(s, 2)) return this.gen(); return R(s, "m", { text: `Buz üzərində hokey şaybasına ${v} m/s sürət verildi. Şayba ilə buz arasında sürtünmə əmsalı ${F(mu)}-dir. Şayba dayanana qədər neçə metr gedər?`, solution: `Yalnız sürtünmə yavaşıdır: a = μg = ${F(mu)}·10 = ${F(mu * g)} m/s². s = v²/(2a) = ${v * v}/${F(2 * mu * g)} = ${F(s)} m.` }); }
          if (w === "t") { if (!nice(t, 2)) return this.gen(); return R(t, "s", { text: `Buz üzərində hokey şaybasına ${v} m/s sürət verildi. Sürtünmə əmsalı ${F(mu)}-dir. Şayba neçə saniyədən sonra dayanır?`, solution: `a = μg = ${F(mu * g)} m/s². t = v/a = ${v}/${F(mu * g)} = ${F(t)} s.` }); }
          return R(mu * g, "m/s²", { text: `Cisim üfüqi səthdə ${v} m/s sürətlə sürüşür və yalnız sürtünmə qüvvəsi ilə yavaşıyır (μ = ${F(mu)}). Yavaşıma təcilinin modulu nə qədərdir?`, solution: `ma = μmg → a = μg = ${F(mu)}·10 = ${F(mu * g)} m/s². Kütlə ixtisar olunur.` }); }
        if (kind === "F") { const m = pick([2, 4, 5, 10, 20]), mu = pick([0.1, 0.2, 0.25, 0.4, 0.5]), a = pick([1, 2, 3]), Fv = m * (a + mu * g); if (!nice(Fv, 2)) return this.gen(); return R(Fv, "N", { text: `${m} kq kütləli cismi üfüqi səthdə (μ = ${F(mu)}) ${a} m/s² təcillə hərəkət etdirmək üçün hansı üfüqi qüvvə lazımdır?`, solution: `F − μmg = ma → F = m(a + μg) = ${m}·(${a} + ${F(mu * g)}) = ${F(Fv)} N.` }); }
        if (kind === "ip") { const m1 = rnd(1, 5), m2 = rnd(1, 5), mu = pick([0.1, 0.2, 0.25, 0.5]), a = pick([0.5, 1, 2]), Fv = (m1 + m2) * (a + mu * g), w = pick(["a", "T"]);
          if (!nice(Fv, 2)) return this.gen(); const pic = flatPic("F", true), T = m1 * (a + mu * g);
          const base = `Üfüqi masada m₁ = ${m1} kq və m₂ = ${m2} kq kütləli cisimlər iplə bağlıdır; hər ikisi üçün sürtünmə əmsalı ${F(mu)}-dir. m₂-ni ip istiqamətində ${F(Fv)} N üfüqi qüvvə ilə dartırlar.`;
          return w === "a" ? R(a, "m/s²", { svg: pic, text: base + " Təcil nə qədərdir?", solution: `Birlikdə: F − μ(m₁ + m₂)g = (m₁ + m₂)a → a = ${F(Fv)}/${m1 + m2} − ${F(mu * g)} = ${F(Fv / (m1 + m2))} − ${F(mu * g)} = ${F(a)} m/s².` })
            : R(T, "N", { svg: pic, text: base + " İpin gərilmə qüvvəsi nə qədərdir?", solution: `Birlikdə a = F/(m₁ + m₂) − μg = ${F(Fv / (m1 + m2))} − ${F(mu * g)} = ${F(a)} m/s². m₁ üçün: T − μm₁g = m₁a → T = m₁(a + μg) = ${m1}·${F(a + mu * g)} = ${F(T)} N.` }); }
        const ang = pick([37, 53]), m = pick([2, 4, 5]), mu = pick([0.2, 0.25, 0.5]), Fv = pick([10, 20, 25, 30, 40]), N = m * g - Fv * TR[ang].s, a = (Fv * TR[ang].c - mu * N) / m;
        if (N <= 0 || !nice(a, 2)) return this.gen();
        return R(a, "m/s²", { text: `${m} kq kütləli cismi üfüqi səthdə üfüqlə ${ang}° bucaq altında yuxarı yönəlmiş ${Fv} N qüvvə ilə dartırlar (${lbl(ang)}). μ = ${F(mu)}. Cismin təcili nə qədərdir?`,
          solution: `Şaquli: N = mg − F sin ${ang}° = ${m * g} − ${F(Fv * TR[ang].s)} = ${F(N)} N. Üfüqi: F cos ${ang}° − μN = ma → ${F(Fv * TR[ang].c)} − ${F(mu * N)} = ${F(m * a)} → a = ${F(a)} m/s².` });
      } },
    { id: "maili0", ad: "Sürtünməsiz maili müstəvi", izah: "Ağırlığı iki hissəyə böl: müstəvi boyu mg·sin α, müstəviyə perpendikulyar mg·cos α. N = mg·cos α, a = g·sin α (kütlədən asılı deyil).",
      gen() {
        const kind = pick(["a", "a", "v", "t", "N", "N30", "yuxari"]), ang = kind === "N" ? pick([37, 53]) : pick([30, 37, 53]);
        const sa = ang === 30 ? 0.5 : TR[ang].s, a = g * sa, pic = inclinePic(ang, { N: true }), trig = lbl(ang);
        if (kind === "a") return R(a, "m/s²", { svg: inclinePic(ang, {}), text: `Hamar (sürtünməsiz) maili müstəvinin bucağı ${ang}°-dir (${trig}). Müstəvi üzərindəki cismin təcili nə qədərdir?`, solution: `Müstəvi boyu yalnız mg·sin α təsir edir: ma = mg·sin ${ang}° → a = g·sin ${ang}° = 10·${F(sa)} = ${F(a)} m/s². Kütlə ixtisar olunur.` });
        if (kind === "v") { for (let i = 0; i < 100; i++) { const L = rnd(1, 40) / 2, v2 = 2 * a * L, v = Math.sqrt(v2); if (Number.isInteger(v)) return R(v, "m/s", { svg: inclinePic(ang, {}), text: `Uzunluğu ${F(L)} m, bucağı ${ang}° olan hamar maili müstəvinin yuxarısından cisim sükunətdən buraxılır (${trig}). Aşağıya çatanda sürəti nə qədərdir?`, solution: `a = g·sin ${ang}° = ${F(a)} m/s². v² = 2aL = 2·${F(a)}·${F(L)} = ${F(v2)} → v = ${v} m/s.` }); } return this.gen(); }
        if (kind === "t") { for (let i = 0; i < 100; i++) { const t = rnd(1, 8) / 2, L = a * t * t / 2; if (nice(L, 2)) return R(t, "s", { svg: inclinePic(ang, {}), text: `Uzunluğu ${F(L)} m, bucağı ${ang}° olan hamar maili müstəvinin yuxarısından cisim sükunətdən buraxılır (${trig}). Aşağıya neçə saniyəyə çatar?`, solution: `a = g·sin ${ang}° = ${F(a)} m/s². L = at²/2 → t² = 2L/a = ${F(2 * L)}/${F(a)} = ${F(t * t)} → t = ${F(t)} s.` }); } return this.gen(); }
        if (kind === "N") { const m = pick([1, 2, 3, 4, 5, 10]); return R(m * g * TR[ang].c, "N", { svg: pic, text: `${m} kq kütləli cisim bucağı ${ang}° olan hamar maili müstəvi üzərindədir (${trig}). Müstəvinin dayaq reaksiya qüvvəsi N nə qədərdir?`, solution: `Müstəviyə perpendikulyar cisim hərəkət etmir: N = mg·cos ${ang}° = ${m * g}·${F(TR[ang].c)} = ${F(m * g * TR[ang].c)} N (mg-dən kiçikdir!).` }); }
        if (kind === "N30") { const m = pick([1, 2, 3, 4, 6]); return { svg: inclinePic(30, { N: true }), text: `${m} kq kütləli cisim bucağı 30° olan hamar maili müstəvi üzərindədir (cos 30° = √3/2). Müstəvinin dayaq reaksiya qüvvəsi N nə qədərdir? Cavabı k√3 şəklində yaz.`, answer: 5 * m * Math.sqrt(3), show: `${5 * m}√3`, unit: "N", solution: `N = mg·cos 30° = ${m * g}·√3/2 = ${5 * m}√3 N (≈ ${F(+(5 * m * Math.sqrt(3)).toFixed(1))} N).` }; }
        for (let i = 0; i < 100; i++) { const v0 = rnd(2, 12), L = v0 * v0 / (2 * a); if (nice(L, 2)) return R(L, "m", { svg: inclinePic(ang, {}), text: `Hamar maili müstəvinin bucağı ${ang}°-dir (${trig}). Cismə müstəvi boyu yuxarı ${v0} m/s başlanğıc sürət verilib. O, müstəvi boyu neçə metr yuxarı qalxar?`, solution: `Yuxarı qalxanda təcil müstəvi boyu aşağıdır: a = g·sin ${ang}° = ${F(a)} m/s². 0 = v₀² − 2aL → L = ${v0 * v0}/${F(2 * a)} = ${F(L)} m.` }); }
        return this.gen();
      } },
    { id: "maili", ad: "Maili müstəvi, sürtünmə ilə", izah: "Aşağı sürüşəndə a = g(sin α − μ cos α). Yuxarı gedəndə a = g(sin α + μ cos α) (yavaşıma). Sabit sürətlə yuxarı dartmaq: F = mg(sin α + μ cos α).",
      gen() {
        const kind = pick(["down", "down", "up", "mu", "F", "t", "s"]), ang = pick([37, 53]), { s: sn, c: cs } = TR[ang], trig = lbl(ang);
        const mus = ang === 37 ? [0.1, 0.25, 0.5, 0.125, 0.3, 0.4, 0.5] : [0.1, 0.25, 0.5, 0.2, 0.4, 0.75, 1];
        const mu = pick(mus), aD = g * (sn - mu * cs), aU = g * (sn + mu * cs);
        if (kind === "down") { if (aD <= 0 || !nice(aD, 2)) return this.gen(); return R(aD, "m/s²", { svg: inclinePic(ang, { f: 1 }), text: `Bucağı ${ang}° olan maili müstəvi boyu cisim aşağı sürüşür, sürtünmə əmsalı ${F(mu)}-dir (${trig}). Cismin təcili nə qədərdir?`, solution: `Müstəvi boyu aşağı: mg·sin α, yuxarı: f = μN = μmg·cos α. ma = mg(sin α − μ cos α) → a = 10·(${F(sn)} − ${F(mu)}·${F(cs)}) = 10·${F(sn - mu * cs)} = ${F(aD)} m/s².` }); }
        if (kind === "up") { if (!nice(aU, 2)) return this.gen(); return R(aU, "m/s²", { svg: inclinePic(ang, { f: -1 }), text: `Cismə maili müstəvi boyu yuxarı başlanğıc sürət verilib; o, yuxarı sürüşərək yavaşıyır. Bucaq ${ang}°, sürtünmə əmsalı ${F(mu)} (${trig}). Yavaşıma təcilinin modulu nə qədərdir?`, solution: `Yuxarı sürüşəndə ağırlığın toplananı da, sürtünmə də aşağıdır: ma = mg·sin α + μmg·cos α → a = 10·(${F(sn)} + ${F(mu)}·${F(cs)}) = ${F(aU)} m/s².` }); }
        if (kind === "mu") { if (aD <= 0 || !nice(aD, 2)) return this.gen(); return R(mu, "", { tol: 0.005, svg: inclinePic(ang, { f: 1 }), text: `Bucağı ${ang}° olan maili müstəvi boyu cisim ${F(aD)} m/s² təcillə aşağı sürüşür (${trig}). Sürtünmə əmsalı nə qədərdir?`, solution: `a = g(sin α − μ cos α) → ${F(aD)} = 10·(${F(sn)} − μ·${F(cs)}) → ${F(aD / g)} = ${F(sn)} − ${F(cs)}μ → μ = (${F(sn)} − ${F(aD / g)})/${F(cs)} = ${F(mu)}.` }); }
        if (kind === "F") { const m = pick([2, 4, 5, 10, 20]), Fv = m * g * (sn + mu * cs); if (!nice(Fv, 2)) return this.gen(); return R(Fv, "N", { svg: inclinePic(ang, { f: -1, F: true }), text: `${m} kq kütləli yükü bucağı ${ang}° olan maili müstəvi boyu yuxarı sabit sürətlə dartırlar (qüvvə müstəvi boyudur, μ = ${F(mu)}, ${trig}). Dartma qüvvəsi nə qədərdir?`, solution: `Sabit sürət → F_əv = 0 müstəvi boyu: F = mg·sin α + μmg·cos α = ${m * g}·(${F(sn)} + ${F(mu * cs)}) = ${m * g}·${F(sn + mu * cs)} = ${F(Fv)} N.` }); }
        if (kind === "t") { if (aD <= 0) return this.gen(); for (let i = 0; i < 100; i++) { const t = rnd(1, 8) / 2, L = aD * t * t / 2; if (nice(L, 2) && L > 0) return R(t, "s", { svg: inclinePic(ang, { f: 1 }), text: `Uzunluğu ${F(L)} m, bucağı ${ang}° olan maili müstəvinin yuxarısından cisim sükunətdən sürüşür. Sürtünmə əmsalı ${F(mu)} (${trig}). Aşağıya neçə saniyəyə çatar?`, solution: `a = g(sin α − μ cos α) = 10·(${F(sn)} − ${F(mu * cs)}) = ${F(aD)} m/s². t² = 2L/a = ${F(2 * L)}/${F(aD)} = ${F(t * t)} → t = ${F(t)} s.` }); } return this.gen(); }
        for (let i = 0; i < 100; i++) { const v0 = rnd(2, 12), L = v0 * v0 / (2 * aU); if (nice(L, 2)) return R(L, "m", { svg: inclinePic(ang, { f: -1 }), text: `Cismə maili müstəvi boyu yuxarı ${v0} m/s başlanğıc sürət verilib. Bucaq ${ang}°, sürtünmə əmsalı ${F(mu)} (${trig}). Cisim müstəvi boyu neçə metr yuxarı qalxar?`, solution: `Yavaşıma təcili a = g(sin α + μ cos α) = ${F(aU)} m/s². L = v₀²/(2a) = ${v0 * v0}/${F(2 * aU)} = ${F(L)} m.` }); }
        return this.gen();
      } },
    { id: "durur", ad: "Durur, yoxsa sürüşür?", izah: "Müqayisə: tg α ≤ μ_s → cisim durur (sürtünmə = mg·sin α, μN yox!). tg α = μ → sabit sürətlə sürüşür. tg α > μ → sürətlənir.",
      gen() {
        const kind = pick(["ev", "ev", "rest", "rest", "sabit", "qerar", "qerar"]);
        if (kind === "ev") { for (;;) { const b = pick([20, 25, 30, 40, 50, 60, 80, 100]), r = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.75, 0.8, 1, 1.2, 1.5]), hh = b * r; if (!Number.isInteger(hh) || hh > 150) continue;
          return R(r, "", { tol: 0.005, text: `Evdə təcrübə: kitabın üstünə sikkə qoyub kitabın bir ucunu qaldırırlar. Sikkə sürüşməyə başlayan anda kitabın qaldırılmış ucu masadan ${hh} sm yuxarıdadır, kitabın üfüqi proyeksiyası (kitabın masadakı izi) ${b} sm-dir. Sikkə ilə kitab arasında sükunət sürtünmə əmsalı μ_s nə qədərdir?`, solution: `Sürüşmə həddində tg α = μ_s. tg α = qarşı/bitişik = ${hh}/${b} = ${F(r)}. Deməli μ_s = ${F(r)}. (Bucağı telefonun Level funksiyası ilə ölçüb tg götürmək də olar.)` }); } }
        if (kind === "rest") { const ang = pick([30, 37, 53]), m = pick([1, 2, 3, 4, 5, 10]), sa = ang === 30 ? 0.5 : TR[ang].s, mus = ang === 30 ? 0.8 : ang === 37 ? 0.9 : 1.6, f = m * g * sa;
          return R(f, "N", { svg: inclinePic(ang, { f: 1 }), text: `${m} kq kütləli cisim bucağı ${ang}° olan maili müstəvi üzərində hərəkətsiz durur (sükunət sürtünmə əmsalı ${F(mus)}, ${lbl(ang)}). Sürtünmə qüvvəsi nə qədərdir?`, solution: `Cisim durur → müstəvi boyu qüvvələr tarazdır: f = mg·sin ${ang}° = ${m * g}·${F(sa)} = ${F(f)} N. (μ_s·N ≈ ${F(+(mus * m * g * (ang === 30 ? 0.866 : TR[ang].c)).toFixed(1))} N ən böyük mümkün qiymətdir — cisim onun hamısını işlətmir.)` }); }
        if (kind === "sabit") { const w = pick([37, 45, 30]); if (w === 30) return { text: "Cisim 30° bucaqlı maili müstəvi boyu sabit sürətlə sürüşür. Sürtünmə əmsalı μ nə qədərdir? (tg 30° = √3/3, cavabı √3/3 şəklində yaz.)", answer: Math.sqrt(3) / 3, show: "√3/3", unit: "", solution: "Sabit sürət → a = 0: sin α = μ cos α → μ = tg 30° = √3/3 ≈ 0,58." };
          const mu = w === 37 ? 0.75 : 1; return R(mu, "", { tol: 0.005, text: `Cisim ${w}° bucaqlı maili müstəvi boyu sabit sürətlə sürüşür (${w === 37 ? "sin 37° = 0,6; cos 37° = 0,8" : "tg 45° = 1"}). Sürtünmə əmsalı μ nə qədərdir?`, solution: `Sabit sürət → a = 0 → sin α = μ cos α → μ = tg ${w}° = ${F(mu)}.` }); }
        const ang = pick([37, 53]), { s: sn, c: cs } = TR[ang], m = pick([1, 2, 3, 4, 5, 10]), tg = sn / cs, mus = pick(ang === 37 ? [0.5, 0.6, 0.9, 1] : [1, 1.2, 1.5, 2]), muk = pick([0.2, 0.25, 0.3, 0.4]);
        const stays = tg <= mus, f = stays ? m * g * sn : muk * m * g * cs;
        if (!nice(f, 2)) return this.gen();
        return R(f, "N", { svg: inclinePic(ang, { f: 1 }), text: `${m} kq kütləli cisim bucağı ${ang}° olan maili müstəvinin üzərinə qoyuldu (${lbl(ang)}). Sükunət sürtünmə əmsalı ${F(mus)}, sürüşmə sürtünmə əmsalı ${F(muk)}-dir. Cismə təsir edən sürtünmə qüvvəsi nə qədərdir?`,
          solution: `tg ${ang}° = ${F(sn)}/${F(cs)} = ${F(+tg.toFixed(4))}. ` + (stays ? `${F(+tg.toFixed(4))} ≤ μ_s = ${F(mus)} → cisim durur. f = mg·sin α = ${m * g}·${F(sn)} = ${F(f)} N.` : `${F(+tg.toFixed(4))} > μ_s = ${F(mus)} → cisim sürüşür. f = μ_k·mg·cos α = ${F(muk)}·${m * g}·${F(cs)} = ${F(f)} N.`) });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .6) {
          const ang = pick([37, 53]), { s: sn, c: cs } = TR[ang], mu = pick([0.25, 0.5, 0.1]), m = pick([2, 4, 5]), aD = g * (sn - mu * cs);
          if (aD <= 0 || !nice(aD, 2)) return this.gen();
          task = `${m} kq kütləli cisim bucağı ${ang}° olan maili müstəvi boyu aşağı sürüşür, μ = ${F(mu)} (${lbl(ang)}). Cismin təcili nə qədərdir?`;
          const N = bad === 0 ? m * g : m * g * cs, f = bad === 1 ? mu * m * g * sn : mu * N, aU = bad === 2 ? g * sn + f / m : (m * g * sn - f) / m;
          steps = [
            bad === 0 ? `Dayaq reaksiyası N = mg = ${m * g} N.` : `Dayaq reaksiyası N = mg·cos ${ang}° = ${m * g}·${F(cs)} = ${F(N)} N.`,
            bad === 1 ? `Sürtünmə f = μ·mg·sin ${ang}° = ${F(mu)}·${m * g}·${F(sn)} = ${F(f)} N.` : `Sürtünmə f = μN = ${F(mu)}·${F(N)} = ${F(f)} N.`,
            bad === 2 ? `Təcil: ma = mg·sin ${ang}° + f → a = (${F(m * g * sn)} + ${F(f)})/${m} = ${F(aU)} m/s².` : `Təcil: ma = mg·sin ${ang}° − f → a = (${F(m * g * sn)} − ${F(f)})/${m} = ${F(aU)} m/s².`,
          ];
          why = [`1-ci addım: maili müstəvidə N = mg·cos α-dır, mg deyil. Düz təcil ${F(aD)} m/s².`,
            `2-ci addım: sürtünmə μN = μ·mg·cos α-dır (cos, sin yox). Düz təcil ${F(aD)} m/s².`,
            `3-cü addım: aşağı sürüşəndə sürtünmə yuxarıdır, aşağı çəkən qüvvədən çıxılır. Düz təcil ${F(aD)} m/s².`][bad];
        } else {
          const m = pick([2, 4, 5]), mu = pick([0.1, 0.2, 0.25, 0.5]), a = pick([1, 2, 3]), Fv = m * (a + mu * g);
          if (!nice(Fv, 2)) return this.gen();
          task = `${m} kq kütləli cismi üfüqi səthdə ${F(Fv)} N üfüqi qüvvə ilə dartırlar, sürtünmə əmsalı ${F(mu)}-dir. Cismin təcili nə qədərdir?`;
          const N = bad === 0 ? m * g + Fv : m * g, f = bad === 1 ? mu * m : mu * N, aU = bad === 2 ? (Fv + f) / m : (Fv - f) / m;
          steps = [
            bad === 0 ? `Dayaq reaksiyası N = mg + F = ${m * g} + ${F(Fv)} = ${F(N)} N.` : `Dayaq reaksiyası N = mg = ${m}·10 = ${m * g} N.`,
            bad === 1 ? `Sürtünmə f = μ·m = ${F(mu)}·${m} = ${F(f)} N.` : `Sürtünmə f = μN = ${F(mu)}·${F(N)} = ${F(f)} N.`,
            bad === 2 ? `Təcil: ma = F + f → a = (${F(Fv)} + ${F(f)})/${m} = ${F(aU)} m/s².` : `Təcil: ma = F − f → a = (${F(Fv)} − ${F(f)})/${m} = ${F(aU)} m/s².`,
          ];
          why = [`1-ci addım: F üfüqidir, şaquli tarazlığa girmir: N = mg = ${m * g} N. Düz təcil ${F(a)} m/s².`,
            `2-ci addım: sürtünmə f = μN = μmg (g unudulub). Düz f = ${F(mu * m * g)} N, a = ${F(a)} m/s².`,
            `3-cü addım: sürtünmə hərəkətin əksinədir, F-dən çıxılır. Düz təcil ${F(a)} m/s².`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Yaş yol, buz, xizək yamacı, pandus, kitab üstündə sikkə — sürtünmə hər yerdədir. Əvvəlcə hansı hal olduğunu müəyyən et: durur, sürüşür, yuxarı gedir.",
      gen() {
        const kind = pick(["yol", "yol", "xizek", "pandus", "pandus", "buz", "kolu"]);
        if (kind === "yol") { for (;;) { const kmh = pick([36, 54, 72, 90, 108]), v = kmh / 3.6, mu = pick([0.1, 0.2, 0.25, 0.4, 0.5, 0.8]), s = v * v / (2 * mu * g); if (nice(s, 2) && s <= 300) return R(s, "m", { text: `Avtomobil ${kmh} km/saat sürətlə gedərkən təkərləri bloklayır (sürüşür). Təkər-yol sürtünmə əmsalı ${F(mu)}-dir. Əyləc yolu nə qədərdir?`, solution: `${kmh} km/saat = ${v} m/s. Yavaşıma a = μg = ${F(mu * g)} m/s². s = v²/(2a) = ${F(v * v)}/${F(2 * mu * g)} = ${F(s)} m. (Kütlə ixtisar olunur.)` }); } }
        if (kind === "xizek") { const ang = pick([37, 53]), { s: sn, c: cs } = TR[ang], mu = pick([0.05, 0.1, 0.125, 0.25]), a = g * (sn - mu * cs); if (!nice(a, 2)) return this.gen(); const L = pick([20, 40, 50, 100, 200]), v2 = 2 * a * L, v = Math.sqrt(v2); if (!Number.isInteger(v) || Math.random() < .5) { return R(a, "m/s²", { svg: inclinePic(ang, { f: 1 }), text: `Xizəkçi bucağı ${ang}° olan yamacda aşağı sürüşür, qar ilə sürtünmə əmsalı ${F(mu)}-dir (${lbl(ang)}). Təcili nə qədərdir?`, solution: `a = g(sin α − μ cos α) = 10·(${F(sn)} − ${F(mu)}·${F(cs)}) = ${F(a)} m/s².` }); }
          return R(v, "m/s", { svg: inclinePic(ang, { f: 1 }), text: `Xizəkçi sükunətdən başlayıb bucağı ${ang}° olan yamacda ${L} m sürüşür, sürtünmə əmsalı ${F(mu)}-dir (${lbl(ang)}). Yamacın sonunda sürəti nə qədərdir?`, solution: `a = g(sin α − μ cos α) = ${F(a)} m/s². v² = 2aL = 2·${F(a)}·${L} = ${F(v2)} → v = ${v} m/s.` }); }
        if (kind === "pandus") { const ang = pick([37, 53]), { s: sn, c: cs } = TR[ang], mu = pick([0.1, 0.25, 0.5, 0.2]), m = pick([20, 30, 40, 50, 60]), Fv = m * g * (sn + mu * cs); if (!nice(Fv, 2)) return this.gen(); return R(Fv, "N", { svg: inclinePic(ang, { f: -1, F: true }), text: `Yük maşınının arxasına ${m} kq-lıq qutunu bucağı ${ang}° olan taxta pandus boyu sabit sürətlə yuxarı dartırlar (qüvvə pandus boyu, μ = ${F(mu)}, ${lbl(ang)}). Dartma qüvvəsi nə qədərdir?`, solution: `F = mg·sin α + μmg·cos α = ${m * g}·(${F(sn)} + ${F(mu)}·${F(cs)}) = ${F(Fv)} N.` }); }
        if (kind === "buz") { const v = pick([5, 8, 10]), mu = pick([0.02, 0.025, 0.04, 0.05]), s = v * v / (2 * mu * g); if (!nice(s, 2) || s > 600) return this.gen(); return R(s, "m", { text: `Hokey şaybası buzda ${v} m/s sürətlə sürüşür. Şayba-buz sürtünmə əmsalı ${F(mu)}-dir. Şayba dayanana qədər neçə metr gedəcək?`, solution: `a = μg = ${F(mu)}·10 = ${F(mu * g)} m/s². s = v²/(2a) = ${v * v}/${F(2 * mu * g)} = ${F(s)} m. (Kiçik μ — çox uzun sürüşmə.)` }); }
        const mu = pick([0.2, 0.25, 0.4, 0.5, 0.8]), v = pick([5, 10, 15, 20]), tt = v / (mu * g); if (!nice(tt, 2)) return this.gen();
        return R(tt, "s", { text: `Qutu yük maşınının üfüqi platformasında yerləşir (μ = ${F(mu)}). Maşın ${v} m/s sürətlə gedərkən kəskin əyləc edir. Qutunun sürüşmədən dayana biləcəyi minimal vaxt nə qədərdir? (Qutunun maksimal yavaşıması yalnız sürtünmə hesabınadır.)`, solution: `Qutunu yalnız sürtünmə yavaşıda bilir: a_max = μg = ${F(mu * g)} m/s². Minimal vaxt t = v/a = ${v}/${F(mu * g)} = ${F(tt)} s. Daha tez əyləc edərsə, qutu platformada irəli sürüşər.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a picture, several steps;
  // the wrong options are the answers of typical mistakes. Questions 2 and 6 also use "Kinematika", 7 "Sərbəst düşmə",
  // 4 and 8 "Nyuton qanunları". Idealisations (weightless inextensible rope, frictionless pulley, g = 10 m/s²) are stated in each text.
  const { ae, again } = Oyun;
  const okN = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => (F(+x.toFixed(4)) + " " + u).trim();
  const T2 = (s, x, y, t, anchor) => s.append(sv("text", Object.assign({ x: f1(x), y: f1(y), class: "oy-lbl" }, anchor ? { "text-anchor": anchor } : {}), t));
  const L2 = (s, x1, y1, x2, y2, color, w, dash) => s.append(sv("line", Object.assign({ x1: f1(x1), y1: f1(y1), x2: f1(x2), y2: f1(y2), stroke: color || "var(--ink)", "stroke-width": w || 2 }, dash ? { "stroke-dasharray": dash } : {})));
  const box = (s, x, y, w, h2, t) => { s.append(sv("rect", { x: f1(x), y: f1(y), width: w, height: h2, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 })); if (t) T2(s, x + w / 2, y + h2 / 2 + 5, t, "middle"); };
  const base = (w, h2, aria) => sv("svg", { viewBox: `0 0 ${w} ${h2}`, class: "oy-svg", role: "img", "aria-label": aria });
  const arcA = (s, cx, cy, r, c, sn, dirLeft) => s.append(sv("path", { d: dirLeft ? `M${f1(cx - r)} ${f1(cy)} A${r} ${r} 0 0 1 ${f1(cx - r * c)} ${f1(cy - r * sn)}` : `M${f1(cx + r)} ${f1(cy)} A${r} ${r} 0 0 0 ${f1(cx + r * c)} ${f1(cy - r * sn)}`, fill: "none", stroke: "var(--accent)", "stroke-width": 2 }));

  // block pulled by a force F at angle α above the horizontal
  function pullPic(ang) {
    const s = base(300, 150, "Üfüqi səthdə cisim; qüvvə üfüqlə bucaq altında yuxarı yönəlib"), a = ang * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), x0 = 150, y0 = 100;
    L2(s, 8, 120, 292, 120, "var(--ink)", 1.8); box(s, 70, 80, 80, 40, "m");
    L2(s, x0, y0, x0 + 96, y0, "var(--muted)", 1.2, "4 3"); arrow(s, x0, y0, x0 + 84 * c, y0 - 84 * sn, "var(--vec)"); T2(s, x0 + 84 * c + 5, y0 - 84 * sn - 3, "F");
    arcA(s, x0, y0, 40, c, sn, false); T2(s, x0 + 8, y0 + 17, "α = " + ang + "°"); return s;
  }
  // block on a table joined over a pulley to a hanging block
  function tablePic() {
    const s = base(300, 190, "Masada m₁ cismi; ip makaradan keçib şaquli asılmış m₂ cisminə bağlanıb");
    s.append(sv("rect", { x: 10, y: 70, width: 226, height: 100, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 2 }));
    box(s, 100, 37, 56, 33, "m₁"); L2(s, 156, 54, 244, 54, "var(--ink)", 1.6);
    s.append(sv("circle", { cx: 244, cy: 62, r: 8, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 2 }));
    L2(s, 252, 62, 252, 128, "var(--ink)", 1.6); box(s, 236, 128, 32, 36, "m₂"); return s;
  }
  // m₁ on a board m₂; force F pulls the lower body
  function stackPic() {
    const s = base(300, 150, "Hamar döşəmədə m₂ lövhəsi, üstündə m₁ cismi; F qüvvəsi alt lövhəyə tətbiq olunub");
    L2(s, 8, 120, 292, 120, "var(--ink)", 1.8); box(s, 80, 86, 130, 34, "m₂"); box(s, 115, 48, 60, 38, "m₁");
    arrow(s, 210, 103, 268, 103, "var(--vec)"); T2(s, 240, 94, "F"); T2(s, 181, 80, "μ", "start"); return s;
  }
  // v–t graph: straight line from v0 down to 0 at time T
  function vtPic(v0, T) {
    const s = base(300, 190, "Sürətin vaxtdan asılılıq qrafiki: v₀ qiymətindən 0-a qədər xətti azalma");
    L2(s, 50, 160, 285, 160, "var(--ink)", 1.8); L2(s, 50, 160, 50, 22, "var(--ink)", 1.8);
    L2(s, 50, 40, 220, 40, "var(--muted)", 1, "4 3"); L2(s, 220, 40, 220, 160, "var(--muted)", 1, "4 3");
    L2(s, 50, 40, 220, 160, "var(--accent)", 3); s.append(sv("circle", { cx: 50, cy: 40, r: 3.5, fill: "var(--accent)" })); s.append(sv("circle", { cx: 220, cy: 160, r: 3.5, fill: "var(--accent)" }));
    T2(s, 44, 45, String(v0), "end"); T2(s, 220, 178, String(T), "middle"); T2(s, 44, 174, "0", "end"); T2(s, 58, 18, "v, m/s"); T2(s, 252, 178, "t, s"); return s;
  }
  // free fall (1) and a smooth incline (2) from the same height h
  function twoPic(ang) {
    const s = base(300, 190, "Eyni h hündürlükdən: 1 şaquli düşür, 2 hamar maili müstəvi boyu sürüşür"), a = ang * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), xe = 130 + 110 / Math.tan(a);
    L2(s, 8, 160, 292, 160, "var(--ink)", 1.8);
    s.append(sv("polygon", { points: `130,50 130,160 ${f1(xe)},160`, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 2 }));
    s.append(sv("circle", { cx: 45, cy: 56, r: 6, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 })); arrow(s, 45, 68, 45, 150, "var(--vec)"); T2(s, 56, 62, "1");
    s.append(sv("circle", { cx: f1(130 + 16 * c + 7 * sn), cy: f1(50 + 16 * sn - 7 * c), r: 6, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 })); T2(s, 130 + 16 * c + 7 * sn + 8, 50 + 16 * sn - 7 * c - 8, "2");
    L2(s, 45, 50, 122, 50, "var(--muted)", 1, "4 3"); arrow(s, 113, 105, 113, 52, "var(--ink)"); arrow(s, 113, 105, 113, 158, "var(--ink)"); T2(s, 100, 108, "h", "end");
    arcA(s, xe, 160, 38, c, sn, true); T2(s, xe - 46, 181, "α = " + ang + "°", "middle"); return s;
  }
  // incline with m₁; rope along the slope, over a pulley at the top, to the hanging m₂
  function pulleyIncPic(deg) {
    const a = deg * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a), Lh = deg > 50 ? 150 : 190, ox = 14, oy = 182, Ax = ox + Lh * ca, Ay = oy - Lh * sa;
    const s = base(300, 200, "Maili müstəvi: m₁ cismi, ip makaradan keçib şaquli asılmış m₂ cisminə bağlanıb");
    s.append(sv("polygon", { points: `${ox},${oy} ${f1(Ax)},${oy} ${f1(Ax)},${f1(Ay)}`, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 2 }));
    arcA(s, ox, oy, 46, ca, sa, false); T2(s, ox + 52, oy - 6, "α = " + deg + "°");
    const sd = Lh * 0.45, P0 = [ox + sd * ca, oy - sd * sa], u = [ca, -sa], n = [-sa, -ca], pt = (du, dn) => [P0[0] + u[0] * du + n[0] * dn, P0[1] + u[1] * du + n[1] * dn];
    s.append(sv("polygon", { points: [pt(-22, 0), pt(22, 0), pt(22, 30), pt(-22, 30)].map(p => f1(p[0]) + "," + f1(p[1])).join(" "), fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 }));
    const C = pt(0, 15); T2(s, C[0] - 8, C[1] + 5, "m₁");
    const dn = 16, du = (Ax + 10 - P0[0] - n[0] * dn) / u[0], Q = pt(du, dn), px = Ax + 10, r = 9;     // the rope runs parallel to the slope and reaches x = px at the top of the pulley
    L2(s, pt(22, dn)[0], pt(22, dn)[1], px, Q[1], "var(--ink)", 1.6);
    L2(s, px, Q[1] + r, Ax, Ay, "var(--ink)", 2);
    s.append(sv("circle", { cx: f1(px), cy: f1(Q[1] + r), r, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 2 }));
    L2(s, px + r, Q[1] + r, px + r, Q[1] + r + 50, "var(--ink)", 1.6); box(s, px + r - 16, Q[1] + r + 50, 32, 36, "m₂"); return s;
  }
  // friction force f against the applied horizontal force F: grows as f = F, then drops to the kinetic value
  function fFPic(fmax, fk) {
    const s = base(300, 190, "Sürtünmə qüvvəsinin tətbiq olunan qüvvədən asılılıq qrafiki"), k = 90 / fmax, yk = 150 - fk * k, xm = 50 + fmax * k;
    L2(s, 50, 150, 285, 150, "var(--ink)", 1.8); L2(s, 50, 150, 50, 24, "var(--ink)", 1.8);
    L2(s, 50, 60, xm, 60, "var(--muted)", 1, "4 3"); L2(s, xm, 60, xm, 150, "var(--muted)", 1, "4 3"); L2(s, 50, yk, xm, yk, "var(--muted)", 1, "4 3");
    s.append(sv("polyline", { points: `50,150 ${f1(xm)},60 ${f1(xm)},${f1(yk)} 262,${f1(yk)}`, fill: "none", stroke: "var(--accent)", "stroke-width": 3 }));
    T2(s, 44, 64, String(fmax), "end"); T2(s, 44, yk + 5, String(fk), "end"); T2(s, xm, 168, String(fmax), "middle"); T2(s, 44, 164, "0", "end"); T2(s, 58, 20, "f, N"); T2(s, 250, 170, "F, N"); return s;
  }

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. pulled at an angle: N shrinks, friction shrinks
    { tip: "qapali", gen: () => again(() => {
      const ang = pick([37, 53]), { s: sn, c: cs } = TR[ang], m = pick([2, 4, 5, 10]), Fv = pick([10, 20, 25, 30, 40, 50]), mu = pick([0.2, 0.25, 0.5]), N = m * g - Fv * sn, a = (Fv * cs - mu * N) / m;
      if (N <= 0 || !okN(a)) return null;
      const w = [(Fv * cs - mu * m * g) / m, (Fv - mu * N) / m, (Fv * cs - mu * (m * g + Fv * sn)) / m, Fv * cs / m]; if (!w.every(x => okN(x))) return null;
      return mc(ae(a, w, U_("m/s²")), { svg: pullPic(ang), text: `${m} kq kütləli cisim üfüqi səthdə durur. Sürtünmə əmsalı μ = ${F(mu)} (sükunət və sürüşmə üçün eynidir). Cismi üfüqlə ${ang}° bucaq altında yuxarı yönəlmiş ${Fv} N qüvvə ilə dartırlar (${lbl(ang)}, g = 10 m/s²). Cismin təcili nə qədərdir?`,
        solution: `Şaquli: N = mg − F·sin ${ang}° = ${m * g} − ${F(Fv * sn)} = ${F(N)} N. Üfüqi: ma = F·cos ${ang}° − μN = ${F(Fv * cs)} − ${F(mu * N)} = ${F(m * a)} → a = ${F(a)} m/s². Tələlər: N = mg yazmaq (${F(+w[0].toFixed(4))}), F-in hamısını üfüqi saymaq (${F(+w[1].toFixed(4))}), qüvvənin şaquli toplananını N-ə əlavə etmək (${F(+w[2].toFixed(4))}), sürtünməni unutmaq (${F(+w[3].toFixed(4))}).` });
    }) },
    // 2. slide down a rough incline from rest for t seconds: length of the incline (+ kinematics)
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const ang = pick([37, 53]), { s: sn, c: cs } = TR[ang], mu = pick([0.1, 0.125, 0.2, 0.25, 0.3, 0.4, 0.5]), t = pick([2, 3, 4, 5, 6, 8, 10]), aD = g * (sn - mu * cs); if (aD <= 0 || !nice(aD, 2)) return null;
      const L = aD * t * t / 2, w = [g * sn * t * t / 2, g * (sn - mu) * t * t / 2, g * (sn + mu * cs) * t * t / 2, aD * t * t]; if (![L, ...w].every(x => okN(x))) return null;
      return mc(ae(L, w, U_("m")), { svg: inclinePic(ang, { L: true }), text: `Cisim maili müstəvinin yuxarısından sükunətdən sürüşməyə başlayır və müstəvinin aşağı ucuna ${t} s-yə çatır. Müstəvinin bucağı ${ang}°, μ = ${F(mu)} (sükunət və sürüşmə üçün eynidir; ${lbl(ang)}, g = 10 m/s²). Müstəvinin uzunluğu L nə qədərdir?`,
        solution: `Təcil: a = g(sin α − μ cos α) = 10·(${F(sn)} − ${F(mu * cs)}) = ${F(aD)} m/s². Kinematika: L = at²/2 = ${F(aD)}·${t * t}/2 = ${F(L)} m. Tələlər: sürtünməni unutmaq (${F(+w[0].toFixed(4))} m), μ·cos α əvəzinə μ yazmaq (${F(+w[1].toFixed(4))} m), sürtünməni aşağıya yönəltmək (${F(+w[2].toFixed(4))} m), düsturda 1/2-ni unutmaq (${F(+w[3].toFixed(4))} m).` });
    }) },
    // 3. a block placed on an incline: does it stay (f = mg sin α) or slide (f = μ_k N)?
    { tip: "qapali", gen: () => again(() => {
      const ang = pick([37, 53]), { s: sn, c: cs } = TR[ang], stays = Math.random() < .55, m = pick([1, 2, 3, 4, 5, 10]), muk = pick([0.2, 0.25, 0.3, 0.4]);
      const mus = stays ? pick(ang === 37 ? [0.8, 0.9, 1] : [1.5, 2]) : pick(ang === 37 ? [0.5, 0.6] : [1, 1.2]);
      const right = stays ? m * g * sn : muk * m * g * cs, w = stays ? [mus * m * g * cs, muk * m * g * cs, m * g * cs, m * g * sn - muk * m * g * cs] : [m * g * sn, mus * m * g * cs, muk * m * g, m * g * sn - muk * m * g * cs];
      if (![right, ...w].every(x => okN(x))) return null;
      return mc(ae(right, w, U_("N")), { svg: inclinePic(ang, { f: 1 }), text: `${m} kq kütləli cismi bucağı ${ang}° olan maili müstəvinin üzərinə qoyub buraxdılar. Cisimlə müstəvi arasında sükunət sürtünmə əmsalı μ_s = ${F(mus)}, sürüşmə sürtünmə əmsalı μ_k = ${F(muk)} (${lbl(ang)}, g = 10 m/s²). Cismə təsir edən sürtünmə qüvvəsi nə qədərdir?`,
        solution: `Əvvəlcə hal: ${nice(sn / cs, 2) ? "tg " + ang + "° = " + F(sn / cs) : "tg " + ang + "° ≈ " + F(+(sn / cs).toFixed(2))}, μ_s = ${F(mus)}. ` + (stays ? `tg α < μ_s → cisim durur, sürtünmə ağırlığın toplananını tarazlayır: f = mg·sin α = ${m * g}·${F(sn)} = ${F(right)} N. Tələlər: μ_s·N (${F(+w[0].toFixed(4))} N) yalnız maksimal mümkün qiymətdir; μ_k·N (${F(+w[1].toFixed(4))} N), mg·cos α (${F(+w[2].toFixed(4))} N) və qüvvələrin fərqi (${F(+w[3].toFixed(4))} N) də düz deyil.` : `tg α > μ_s → cisim sürüşür, sürüşmə sürtünməsi: f = μ_k·mg·cos α = ${F(muk)}·${m * g}·${F(cs)} = ${F(right)} N. Tələlər: durur hesab edib mg·sin α (${F(+w[0].toFixed(4))} N), μ_s götürmək (${F(+w[1].toFixed(4))} N), N = mg yazmaq (${F(+w[2].toFixed(4))} N), qüvvələrin fərqi (${F(+w[3].toFixed(4))} N).`) });
    }) },
    // 4. rough table + hanging block over a pulley: acceleration (+ Newton's laws)
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const m1 = pick([1, 2, 3, 4, 5, 6, 8, 10]), m2 = pick([1, 2, 3, 4, 5, 6, 8, 10]), mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]), a = (m2 * g - mu * m1 * g) / (m1 + m2);
      if (!okN(a)) return null;
      const w = [m2 * g / (m1 + m2), (m2 * g - mu * m1 * g) / m1, (m2 * g - mu * m2 * g) / (m1 + m2), (m2 * g + mu * m1 * g) / (m1 + m2)]; if (!w.every(x => okN(x))) return null;
      return mc(ae(a, w, U_("m/s²")), { svg: tablePic(), text: `Üfüqi masa üzərindəki m₁ = ${m1} kq kütləli cisim ip vasitəsilə şaquli asılmış m₂ = ${m2} kq kütləli cisimlə bağlıdır. Cisim ilə masa arasında sürtünmə əmsalı μ = ${F(mu)} (sükunət və sürüşmə üçün eynidir). İp çəkisiz və uzanmazdır, gərgindir, makara çəkisizdir və sürtünməsizdir. Cisimləri sükunətdən buraxırlar (g = 10 m/s²). Cisimlərin təcili nə qədərdir?`,
        solution: `Cisimlər ip ilə bağlıdır, təcil eynidir. Bütün sistem üçün: (m₁ + m₂)a = m₂g − μm₁g = ${m2 * g} − ${F(mu * m1 * g)} = ${F(m2 * g - mu * m1 * g)} N → a = ${F(m2 * g - mu * m1 * g)}/${m1 + m2} = ${F(a)} m/s². Tələlər: sürtünməni unutmaq (${F(+w[0].toFixed(4))}), yalnız m₁-ə bölmək (${F(+w[1].toFixed(4))}), sürtünməni asılan cismə aid etmək (${F(+w[2].toFixed(4))}), sürtünməni də hərəkət etdirən qüvvəyə əlavə etmək (${F(+w[3].toFixed(4))}).` });
    }) },
    // 5. stacked bodies: the largest force that keeps the top body from slipping
    { tip: "qapali", gen: () => again(() => {
      const m1 = pick([1, 2, 3, 4]), m2 = pick([2, 3, 4, 5, 6]), mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]); if (m2 <= m1) return null;
      const Fv = mu * g * (m1 + m2), w = [mu * g * m1, mu * g * m2, g * (m1 + m2), mu * g * (m2 - m1)]; if (![Fv, ...w].every(x => okN(x))) return null;
      return mc(ae(Fv, w, U_("N")), { svg: stackPic(), text: `Hamar döşəmədə m₂ = ${m2} kq kütləli lövhə, onun üstündə m₁ = ${m1} kq kütləli cisim durur. Cisimlə lövhə arasında sürtünmə əmsalı μ = ${F(mu)} (sükunət və sürüşmə əmsalları eynidir, g = 10 m/s²). Lövhəyə üfüqi F qüvvə tətbiq edirlər. Cismin lövhə üzərində sürüşmədən hərəkət etməsi üçün F-in ən böyük qiyməti nə qədərdir?`,
        solution: `Üst cismi hərəkətə gətirən yalnız sürtünmədir: m₁a = f ≤ μm₁g → a ≤ μg = ${F(mu * g)} m/s². Sürüşmə həddində iki cisim birlikdə bu təcillə gedir: F = (m₁ + m₂)a = ${m1 + m2}·${F(mu * g)} = ${F(Fv)} N. Tələlər: yalnız üst cismi götürmək (${F(+w[0].toFixed(4))}), yalnız lövhəni götürmək (${F(+w[1].toFixed(4))}), μ-ni yazmamaq (${F(+w[2].toFixed(4))}), kütlələrin cəmi əvəzinə fərqini götürmək (${F(+w[3].toFixed(4))}).` });
    }) },
    // 6. v–t graph of a sliding block: friction coefficient (+ kinematics)
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const v0 = pick([4, 5, 6, 8, 10, 12, 15, 20]), T = pick([2, 3, 4, 5, 6, 8, 10]), a = v0 / T, mu = a / g; if (!nice(mu, 3) || mu > 1.2) return null;
      const w = [a, v0 / g, v0 * T / (2 * g), a / (2 * g)]; if (![mu, ...w].every(x => okN(x, 3))) return null;
      return mc(ae(mu, w, x => F(+x.toFixed(4))), { svg: vtPic(v0, T), text: `Üfüqi səthdə sürüşən cismin sürətinin vaxtdan asılılıq qrafiki verilib. Cismi yalnız sürtünmə qüvvəsi yavaşıdır (g = 10 m/s²). Cisimlə səth arasındakı sürtünmə əmsalı nə qədərdir?`,
        solution: `Qrafikdən təcilin modulu (xəttin mailliyi): a = v₀/T = ${v0}/${T} = ${F(a)} m/s². Yalnız sürtünmə yavaşıdır: ma = μmg → μ = a/g = ${F(a)}/10 = ${F(mu)}. Tələlər: təcili əmsal kimi yazmaq (${F(+w[0].toFixed(4))}), vaxtı unutmaq (${F(+w[1].toFixed(4))}), yolu götürmək (${F(+w[2].toFixed(4))}), təcildə 2-yə bölmək (${F(+w[3].toFixed(4))}).` });
    }) },
    // 7. free fall vs. a smooth incline from the same height: time on the incline (+ free fall)
    { tip: "qapali", birlesik: "fiz-serbest-dusme", minVariety: 8, gen: () => again(() => {
      const ang = pick([37, 53]), { s: sn, c: cs } = TR[ang], k = pick([1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8]), tf = +(k * sn).toFixed(4), h0 = +(g * tf * tf / 2).toFixed(4); if (!nice(h0, 2) || !nice(tf, 2)) return null;
      const w = [tf, tf * sn, tf / cs, (tf / sn) ** 2]; if (![k, ...w].every(x => okN(x))) return null;
      return mc(ae(k, w, U_("s")), { svg: twoPic(ang), text: `Eyni h = ${F(h0)} m hündürlükdən iki cisim eyni anda sükunətdən buraxılır: 1-ci sərbəst düşür, 2-ci bucağı ${ang}° olan hamar maili müstəvi boyu sürüşür (${lbl(ang)}, havanın müqaviməti yoxdur, g = 10 m/s²). 2-ci cisim yerə neçə saniyəyə çatar?`,
        solution: `Sərbəst düşmə: h = gt²/2 → t₁ = √(2h/g) = √(${F(2 * h0)}/10) = ${F(tf)} s. Maili müstəvidə a = g·sin α = ${F(g * sn)} m/s², yol L = h/sin α = ${F(+(h0 / sn).toFixed(4))} m: t₂ = √(2L/a) = ${F(k)} s (= t₁/sin α). Tələlər: sürətlər eyni olsa da vaxtlar eyni deyil (${F(+w[0].toFixed(4))} s), sin α-ya vurmaq (${F(+w[1].toFixed(4))} s), cos α-ya bölmək (${F(+w[2].toFixed(4))} s), kökü almamaq (${F(+w[3].toFixed(4))} s).` });
    }) },
    // 8. incline + hanging block over a pulley, with friction: tension (+ Newton's laws)
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const ang = pick([37, 53]), { s: sn, c: cs } = TR[ang], mu = pick([0.1, 0.2, 0.25, 0.5]), m1 = pick([2, 3, 4, 5, 6, 10]), m2 = pick([2, 3, 4, 5, 6, 8, 10]), M = m1 + m2, a = (m2 * g - m1 * g * sn - mu * m1 * g * cs) / M, T = m2 * (g - a);
      if (a <= 0 || !nice(a, 2) || !okN(T)) return null;
      const T0 = m2 * (g - (m2 * g - m1 * g * sn) / M), T1 = m2 * (g - (m2 * g - m1 * g * sn + mu * m1 * g * cs) / M), T3 = m2 * (g - (m2 * g - m1 * g * sn - mu * m1 * g * sn) / M), w = [m2 * g, T0, T1, T3]; if (!w.every(x => okN(x))) return null;
      return mc(ae(T, w, U_("N")), { svg: pulleyIncPic(ang), text: `Bucağı ${ang}° olan maili müstəvi üzərindəki m₁ = ${m1} kq kütləli cisim iplə, makaradan keçməklə, şaquli asılmış m₂ = ${m2} kq kütləli cisimlə bağlıdır. Müstəvi ilə cisim arasında sürtünmə əmsalı μ = ${F(mu)} (sükunət və sürüşmə üçün eynidir). İp çəkisiz və uzanmazdır, gərgindir, makara çəkisizdir və sürtünməsizdir. Sistemi sükunətdən buraxırlar (${lbl(ang)}, g = 10 m/s²). İpin gərilmə qüvvəsi nə qədərdir?`,
        solution: `m₂ aşağı düşür, m₁ müstəvi boyu yuxarı çıxır. Bütün sistem: (m₁ + m₂)a = m₂g − m₁g·sin α − μm₁g·cos α = ${m2 * g} − ${F(m1 * g * sn)} − ${F(mu * m1 * g * cs)} = ${F(M * a)} N → a = ${F(a)} m/s². Asılan cisim: m₂g − T = m₂a → T = m₂(g − a) = ${m2}·${F(g - a)} = ${F(T)} N. Tələlər: T = m₂g yazmaq (${F(m2 * g)} N — bu yalnız a = 0 olanda doğrudur), sürtünməni unutmaq (${F(+T0.toFixed(4))} N), sürtünməni əks istiqamətdə götürmək (${F(+T1.toFixed(4))} N), sürtünməni μ·mg·sin α yazmaq (${F(+T3.toFixed(4))} N).` });
    }) },
    // 9. pulled up an incline with a given acceleration
    { tip: "qapali", gen: () => again(() => {
      const ang = pick([37, 53]), { s: sn, c: cs } = TR[ang], mu = pick([0.1, 0.2, 0.25, 0.5]), m = pick([2, 4, 5, 10]), a = pick([0.5, 1, 2, 3]), Fv = m * (a + g * sn + mu * g * cs);
      const w = [m * (a + g * sn - mu * g * cs), m * (a + g * sn), m * (a + g * sn + mu * g), m * (g * sn + mu * g * cs)]; if (![Fv, ...w].every(x => okN(x))) return null;
      return mc(ae(Fv, w, U_("N")), { svg: inclinePic(ang, { f: -1, F: true }), text: `${m} kq kütləli cismi bucağı ${ang}° olan maili müstəvi boyu yuxarı, ${F(a)} m/s² təcillə dartırlar. Dartma qüvvəsi müstəvi boyu yönəlib, sürtünmə əmsalı μ = ${F(mu)} (${lbl(ang)}, g = 10 m/s²). Dartma qüvvəsi F nə qədərdir?`,
        solution: `Müstəvi boyu yuxarı: F; aşağı: mg·sin α və sürtünmə f = μmg·cos α (cisim yuxarı gedir, sürtünmə aşağıdır). ma = F − mg·sin α − μmg·cos α → F = m(a + g·sin α + μg·cos α) = ${m}·(${F(a)} + ${F(g * sn)} + ${F(mu * g * cs)}) = ${F(Fv)} N. Tələlər: sürtünməni yuxarı götürmək (${F(+w[0].toFixed(4))} N), sürtünməni unutmaq (${F(+w[1].toFixed(4))} N), N = mg yazmaq (${F(+w[2].toFixed(4))} N), təcili unutmaq (${F(+w[3].toFixed(4))} N).` });
    }) },
    // 10. f–F graph: acceleration after the body starts to slide
    { tip: "qapali", gen: () => again(() => {
      const m = pick([2, 4, 5, 10]), mus = pick([0.4, 0.5, 0.6, 0.8]), muk = pick([0.2, 0.25, 0.3, 0.4]), fmax = mus * m * g, fk = muk * m * g; if (muk >= mus || !Number.isInteger(fmax) || !Number.isInteger(fk)) return null;
      const Fv = fmax + pick([5, 10, 15, 20]), a = (Fv - fk) / m;
      const w = [(Fv - fmax) / m, Fv / m, (Fv + fk) / m, (fmax - fk) / m]; if (![a, ...w].every(x => okN(x))) return null;
      return mc(ae(a, w, U_("m/s²")), { svg: fFPic(fmax, fk), text: `${m} kq kütləli cismi üfüqi masa üzərində üfüqi F qüvvə ilə itələyirlər. Qrafikdə sürtünmə qüvvəsinin F-dən asılılığı verilib. F = ${Fv} N olanda cismin təcili nə qədərdir? (g = 10 m/s²)`,
        solution: `Qrafikdən: F = ${fmax} N-a qədər cisim durur (sükunət sürtünməsi F-ə bərabərdir), sonra tərpənir və sürtünmə sürüşmə qiymətinə düşür: f = ${fk} N. ${Fv} N > ${fmax} N → cisim sürüşür: ma = F − f = ${Fv} − ${fk} = ${Fv - fk} N → a = ${F(a)} m/s². Tələlər: maksimal sükunət sürtünməsini çıxmaq (${F(+w[0].toFixed(4))}), sürtünməni unutmaq (${F(+w[1].toFixed(4))}), sürtünməni əlavə etmək (${F(+w[2].toFixed(4))}), yalnız sürtünmələrin fərqini götürmək (${F(+w[3].toFixed(4))}).` });
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
      key: "fiz-surtunme-maili", title: "Sürtünmə, maili müstəvi", fenn: "fizika", link: "dersler/fiz-surtunme-maili.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: N, m/s², m/s, m, s). Sürtünmə əmsalı vahidsizdir: 0,25. Bəzi suallarda cavab 5√3 kimi yazılır. g = 10 m/s².",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["surtunme", "surtunme", "ufuqi", "ufuqi", "maili0", "maili", "maili", "durur", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-surtunme-maili.html")) b.push("dersler/fiz-surtunme-maili.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
