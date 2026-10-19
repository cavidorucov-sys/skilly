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
        if (kind === "N30") { const m = pick([1, 2, 3, 4, 6]); return { svg: pic, text: `${m} kq kütləli cisim bucağı 30° olan hamar maili müstəvi üzərindədir (cos 30° = √3/2). Müstəvinin dayaq reaksiya qüvvəsi N nə qədərdir? Cavabı k√3 şəklində yaz.`, answer: 5 * m * Math.sqrt(3), show: `${5 * m}√3`, unit: "N", solution: `N = mg·cos 30° = ${m * g}·√3/2 = ${5 * m}√3 N (≈ ${F(+(5 * m * Math.sqrt(3)).toFixed(1))} N).` }; }
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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-surtunme-maili", title: "Sürtünmə, maili müstəvi", fenn: "fizika", link: "dersler/fiz-surtunme-maili.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: N, m/s², m/s, m, s). Sürtünmə əmsalı vahidsizdir: 0,25. Bəzi suallarda cavab 5√3 kimi yazılır. g = 10 m/s².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["surtunme", "surtunme", "ufuqi", "ufuqi", "maili0", "maili", "maili", "durur", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-surtunme-maili.html")) b.push("dersler/fiz-surtunme-maili.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
