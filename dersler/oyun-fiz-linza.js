// Fizika · Linzalar və güzgülər — mastery game levels (image kind, thin lens formula, optical power, spherical mirrors, dispersion, real life, find-the-error) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. Distances in cm (sm) unless stated; g not needed.
// Sign convention (real-is-positive): d > 0 real object; f > 0 real image, f < 0 virtual image; F > 0 converging lens / concave mirror, F < 0 diverging lens / convex mirror.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const shuffle = a => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = rnd(0, i); [r[i], r[j]] = [r[j], r[i]]; } return r; };
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const frac = (p, q) => { const g = gcd(p, q); return q / g === 1 ? String(p / g) : (p / g) + "/" + (q / g); };

  // integer triples (F, d, f) with 1/F = 1/d + 1/f
  const FS = [6, 8, 10, 12, 15, 16, 20, 24, 25, 30, 40, 50];
  const REAL = [], VIRT = [], DIV = [];
  for (const Fv of FS) for (let d = 4; d <= 120; d++) {
    if (d > Fv && (d * Fv) % (d - Fv) === 0) { const f = d * Fv / (d - Fv); if (f <= 120) REAL.push({ F: Fv, d, f }); }
    if (d < Fv && (d * Fv) % (Fv - d) === 0) VIRT.push({ F: Fv, d, f: -d * Fv / (Fv - d) });
    if ((d * Fv) % (d + Fv) === 0) DIV.push({ F: -Fv, d, f: -d * Fv / (d + Fv) });
  }

  // ---------- SVG: thin lens with an object, focal marks and (optionally) the three principal rays and the image ----------
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const c1 = v => (+v).toFixed(1);
  function lensSvg(Fv, d, o) {
    o = o || {};
    const W = 420, H = 200, cx = 210, cy = 100, INK = "#17171a", COLS = ["#534ab7", "#c2410c", "#0f766e"];
    const f = d === Fv ? Infinity : d * Fv / (d - Fv);
    const img = !!o.image && isFinite(f);
    const ext = Math.max(d, img ? Math.abs(f) : 0, 2 * Math.abs(Fv));
    const s = Math.min(180 / ext, 8);
    const G = img ? Math.abs(f) / d : 1, hp = img ? Math.min(30, 70 / G) : 30;
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": Fv > 0 ? "Yığıcı linza, cisim və fokuslar" : "Səpici linza, cisim və fokuslar" });
    const L = (x1, y1, x2, y2, a) => g.append(sv("line", Object.assign({ x1: c1(x1), y1: c1(y1), x2: c1(x2), y2: c1(y2), stroke: INK, "stroke-width": 1.6, "stroke-linecap": "round" }, a || {})));
    const T = (x, y, t, a) => g.append(sv("text", Object.assign({ x: c1(x), y: c1(y), "text-anchor": "middle", class: "oy-lbl" }, a || {}), t));
    const arrow = (x, tip, col, dash) => {
      L(x, cy, x, tip, { stroke: col, "stroke-width": 3, "stroke-dasharray": dash || "none" });
      const sg = tip < cy ? 1 : -1;
      g.append(sv("polygon", { points: `${c1(x - 5)},${c1(tip + sg * 9)} ${c1(x + 5)},${c1(tip + sg * 9)} ${c1(x)},${c1(tip)}`, fill: col }));
    };
    L(8, cy, W - 8, cy, { "stroke-width": 1, stroke: "#8a8a93" });
    // lens
    L(cx, cy - 85, cx, cy + 85, { "stroke-width": 2.6 });
    for (const sg of [-1, 1]) {
      const y = cy + sg * 85, yi = cy + sg * 75;
      g.append(sv("polygon", { points: Fv > 0 ? `${cx},${y} ${cx - 6},${yi} ${cx + 6},${yi}` : `${cx - 6},${y} ${cx + 6},${y} ${cx},${yi}`, fill: INK }));
    }
    // focal marks
    for (const sg of [-1, 1]) {
      const x = cx + sg * Math.abs(Fv) * s; L(x, cy - 4, x, cy + 4); T(x, cy + 17, "F");
      if (Fv > 0) { const x2 = cx + sg * 2 * Fv * s; L(x2, cy - 4, x2, cy + 4); T(x2, cy + 17, "2F"); }
    }
    T(cx + 10, cy - 90, "O", { "text-anchor": "start" });
    const xo = cx - d * s, To = cy - hp;
    if (img) {
      const xi = cx + f * s, yi = cy + hp * f / d, virt = f < 0, xr = W - 4;
      const toRight = (x0, y0, dx, dy) => [xr, y0 + (xr - x0) * dy / dx];
      // ray 1: parallel to the axis, then through the far focus
      const sgn = virt ? -1 : 1, d1 = [(xi - cx) * sgn, (yi - To) * sgn], e1 = toRight(cx, To, d1[0], d1[1]);
      L(xo, To, cx, To, { stroke: COLS[0] }); L(cx, To, e1[0], e1[1], { stroke: COLS[0] }); if (virt) L(cx, To, xi, yi, { stroke: COLS[0], "stroke-dasharray": "4 3", "stroke-width": 1.2 });
      // ray 2: through the optical centre
      const e2 = toRight(cx, cy, cx - xo, cy - To);
      L(xo, To, cx, cy, { stroke: COLS[1] }); L(cx, cy, e2[0], e2[1], { stroke: COLS[1] }); if (virt) L(xo, To, xi, yi, { stroke: COLS[1], "stroke-dasharray": "4 3", "stroke-width": 1.2 });
      // ray 3: towards the near focus, then parallel to the axis
      const xf = cx - Fv * s, yL = To + (cx - xo) * (cy - To) / (xf - xo);
      L(xo, To, cx, yL, { stroke: COLS[2] }); L(cx, yL, xr, yL, { stroke: COLS[2] }); if (virt) L(cx, yL, xi, yL, { stroke: COLS[2], "stroke-dasharray": "4 3", "stroke-width": 1.2 });
      arrow(xi, yi, "#a32d2d", virt ? "5 3" : "none");
      T(xi, yi > cy ? yi + 16 : yi - 8, "xəyal", { fill: "#a32d2d" });
      if (o.dl) { const y = 182; L(xo, y, cx, y, { "stroke-width": 1 }); L(xo, y - 4, xo, y + 4, { "stroke-width": 1 }); L(cx, y - 4, cx, y + 4, { "stroke-width": 1 }); T((xo + cx) / 2, y + 13, o.dl); }
      if (o.fl) { const y = 182, a = Math.min(cx, xi), b = Math.max(cx, xi); L(a, y, b, y, { "stroke-width": 1 }); L(a, y - 4, a, y + 4, { "stroke-width": 1 }); L(b, y - 4, b, y + 4, { "stroke-width": 1 }); T((a + b) / 2, y + 13, o.fl); }
    }
    arrow(xo, To, INK); T(xo, To - 8, "cisim");
    return g;
  }

  // ---------- SVG-free helpers ----------
  const DESC = ["həqiqi, tərs, böyüdülmüş", "həqiqi, tərs, kiçildilmiş", "həqiqi, tərs, cismə bərabər ölçüdə", "xəyali, düz, böyüdülmüş", "xəyali, düz, kiçildilmiş", "xəyal alınmır (şüalar paralel çıxır)", "xəyali, düz, cismə bərabər ölçüdə"];
  const PICK = i => ({ choices: DESC, correct: i, show: DESC[i] });

  const RAYS = [
    { q: "Yığıcı linzaya baş optik oxa paralel düşən şüa linzadan keçəndən sonra necə gedir?", ok: "arxa fokusdan keçir", bad: ["optik mərkəzdən keçir", "baş optik oxa paralel qalır", "ön fokusdan keçir"], sol: "Oxa paralel şüalar yığıcı linzada sınıb bir nöqtəyə — arxa fokusa toplanır." },
    { q: "Yığıcı linzanın optik mərkəzindən keçən şüa necə gedir?", ok: "sınmadan, istiqamətini dəyişmədən keçir", bad: ["arxa fokusdan keçir", "baş optik oxa paralel olur", "əks istiqamətdə qayıdır"], sol: "Mərkəzdə nazik linza yastı şüşə lövhəyə bənzəyir; şüa demək olar ki, əyilmir." },
    { q: "Yığıcı linzanın ön fokusundan keçib linzaya düşən şüa linzadan sonra necə gedir?", ok: "baş optik oxa paralel", bad: ["optik mərkəzdən keçir", "arxa fokusdan keçir", "əks istiqamətdə qayıdır"], sol: "Şüanın yolu tərsinə çevrilə bilər: arxa fokusa gedən oxa paralel şüanın əksi budur." },
    { q: "Səpici linzaya baş optik oxa paralel düşən şüa linzadan sonra necə gedir?", ok: "yayılır; geriyə davamı xəyali fokusdan çıxır kimi görünür", bad: ["həqiqətən fokusdan keçir", "baş optik oxa paralel qalır", "optik mərkəzdən keçir"], sol: "Səpici linza şüaları aralayır; sınmış şüanın geri davamı (nöqtəli xətt) cisim tərəfindəki xəyali fokusdan keçir." },
    { q: "Çökək güzgüyə baş optik oxa paralel düşən şüa əks olunandan sonra necə gedir?", ok: "fokusdan keçir", bad: ["əyrilik mərkəzindən keçir", "baş optik oxa paralel qalır", "öz yolu ilə geri qayıdır"], sol: "Çökək güzgü oxa paralel şüaları fokusda toplayır (F = R/2)." },
    { q: "Çökək güzgünün əyrilik mərkəzindən keçən şüa əks olunandan sonra necə gedir?", ok: "öz yolu ilə geri qayıdır", bad: ["fokusdan keçir", "baş optik oxa paralel olur", "güzgüdən keçib gedir"], sol: "Əyrilik mərkəzindən çıxan şüa güzgü səthinə perpendikulyar düşür; düşmə bucağı 0° olduğundan əks olunma bucağı da 0°-dir, şüa geri qayıdır." },
  ];

  const levels = [
    { id: "qur", ad: "Xəyalın qurulması", izah: "Üç əsas şüa: oxa paralel (→ fokus), mərkəzdən keçən (düz), fokusdan keçən (→ oxa paralel). Xəyalın növü cismin d məsafəsinin F və 2F ilə müqayisəsindən asılıdır.",
      gen() {
        const kind = pick(["tip", "tip", "tip", "guzgu", "rey", "svgF"]);
        if (kind === "tip") {
          const Fv = pick([10, 12, 15, 20, 24, 30]);
          if (Math.random() < .3) {
            const d = pick([Math.round(Fv * .5), Fv, Fv * 2, Fv * 3, Fv * 4, Math.round(Fv * 1.5)]);
            return Object.assign({ text: `Səpici linzanın fokus məsafəsi ${Fv} sm-dir. Cisim linzadan ${d} sm məsafədədir. Xəyal necə olacaq?`, svg: lensSvg(-Fv, d),
              solution: "Səpici linza cisim harada olursa olsun yalnız xəyali, düz, kiçildilmiş xəyal verir." }, PICK(4));
          }
          let d; do { d = Fv * pick([0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4]); } while (!Number.isInteger(d));
          let i, why;
          if (d < Fv) { i = 3; why = `d = ${d} sm < F = ${Fv} sm: cisim fokusdan içəridədir → xəyali, düz, böyüdülmüş xəyal (lupa belə işləyir).`; }
          else if (d === Fv) { i = 5; why = `d = F: cisimdən çıxan şüalar linzadan sonra paralel olur, xəyal sonsuzluqdadır (alınmır).`; }
          else if (d < 2 * Fv) { i = 0; why = `F < d < 2F (${Fv} < ${d} < ${2 * Fv}) → həqiqi, tərs, böyüdülmüş xəyal (proyektor).`; }
          else if (d === 2 * Fv) { i = 2; why = `d = 2F = ${2 * Fv} sm → f = 2F, həqiqi, tərs, cismə bərabər ölçüdə.`; }
          else { i = 1; why = `d > 2F (${d} > ${2 * Fv}) → həqiqi, tərs, kiçildilmiş xəyal (fotoaparat).`; }
          return Object.assign({ text: `Yığıcı linzanın fokus məsafəsi ${Fv} sm-dir. Cisim linzadan ${d} sm məsafədədir (şəkildə F və 2F nöqtələri göstərilib). Xəyal necə olacaq?`, svg: lensSvg(Fv, d), solution: why }, PICK(i));
        }
        if (kind === "guzgu") {
          const t = pick(["cokek", "cokek", "qabariq", "duz"]);
          if (t === "qabariq") { const R2 = 2 * pick([10, 15, 20, 30]), d = pick([10, 20, 30, 40, 60]); return Object.assign({ text: `Qabarıq güzgünün əyrilik radiusu ${R2} sm, cisim güzgüdən ${d} sm məsafədədir. Xəyal necə olacaq?`, solution: "Qabarıq güzgü həmişə xəyali, düz, kiçildilmiş xəyal verir (avtomobilin yan güzgüsü belədir)." }, PICK(4)); }
          if (t === "duz") return Object.assign({ text: `Cisim düz güzgüdən ${pick([30, 50, 80, 120])} sm məsafədədir. Xəyal necə olacaq?`, solution: "Düz güzgüdə xəyal xəyali, düz və cismə bərabər ölçüdədir; güzgünün arxasında, cismə simmetrik yerdədir." }, PICK(6));
          const Fv = pick([10, 12, 15, 20, 24, 30]); let d; do { d = Fv * pick([0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4]); } while (!Number.isInteger(d));
          let i, why;
          if (d < Fv) { i = 3; why = `F = R/2 = ${Fv} sm. d = ${d} < F → xəyali, düz, böyüdülmüş xəyal (diş həkimi və qırxılma güzgüsü).`; }
          else if (d === Fv) { i = 5; why = `F = R/2 = ${Fv} sm = d: şüalar əks olunandan sonra paralel çıxır, xəyal alınmır.`; }
          else if (d < 2 * Fv) { i = 0; why = `F = R/2 = ${Fv} sm, F < d < R → həqiqi, tərs, böyüdülmüş xəyal.`; }
          else if (d === 2 * Fv) { i = 2; why = `F = ${Fv} sm, d = R = ${2 * Fv} sm → həqiqi, tərs, cismə bərabər ölçüdə.`; }
          else { i = 1; why = `F = ${Fv} sm, d > R → həqiqi, tərs, kiçildilmiş xəyal.`; }
          return Object.assign({ text: `Çökək güzgünün əyrilik radiusu ${2 * Fv} sm, cisim güzgüdən ${d} sm məsafədədir. Xəyal necə olacaq?`, solution: why }, PICK(i));
        }
        if (kind === "rey") {
          const r = pick(RAYS), ch = shuffle([r.ok, ...r.bad]);
          return { text: r.q, choices: ch, correct: ch.indexOf(r.ok), show: r.ok, solution: r.sol };
        }
        // svgF: the picture shows d, f and the image; ask for F
        const useVirt = Math.random() < .3, T = pick((useVirt ? VIRT : REAL).filter(t => Math.abs(t.f) / t.d <= 3 && t.d >= 6));
        const virt = T.f < 0, Fv = T.F;
        return R(Fv, "sm", { text: `Şəkildə yığıcı linza, cisim və onun xəyalı göstərilib: d = ${T.d} sm, f = ${Math.abs(T.f)} sm${virt ? " (xəyal xəyalidir — nöqtəli ox)" : ""}. Linzanın fokus məsafəsi F neçə santimetrdir?`,
          svg: lensSvg(Fv, T.d, { image: true, dl: `d = ${T.d} sm`, fl: `f = ${Math.abs(T.f)} sm` }), placeholder: "F, sm",
          solution: virt ? `Xəyali xəyal: f = −${Math.abs(T.f)} sm. 1/F = 1/d + 1/f = 1/${T.d} − 1/${Math.abs(T.f)} = ${Math.abs(T.f) - T.d}/${T.d * Math.abs(T.f)} → F = ${Fv} sm.`
            : `Həqiqi xəyal: 1/F = 1/d + 1/f = 1/${T.d} + 1/${T.f} = ${T.d + T.f}/${T.d * T.f} → F = ${Fv} sm.` });
      } },

    { id: "formul", ad: "Linza düsturu və böyütmə", izah: "1/F = 1/d + 1/f. Həqiqi xəyal: f > 0; xəyali xəyal: f < 0. Böyütmə Γ = |f|/d. Cavabları santimetrlə yaz.",
      gen() {
        const kind = pick(["f", "f", "fv", "F", "d", "gamma", "H", "sep", "min", "surus", "iki"]);
        if (kind === "f") {
          const T = pick(REAL);
          return R(T.f, "sm", { text: `Fokus məsafəsi ${T.F} sm olan yığıcı linzadan ${T.d} sm məsafədə cisim yerləşdirilib. Həqiqi xəyal linzadan neçə santimetr məsafədə alınır?`,
            solution: `1/f = 1/F − 1/d = 1/${T.F} − 1/${T.d} = ${T.d - T.F}/${T.F * T.d} → f = ${F(T.f)} sm (d > F olduğundan xəyal həqiqidir).` });
        }
        if (kind === "fv") {
          const T = pick(VIRT);
          return R(T.f, "sm", { text: `Fokus məsafəsi ${T.F} sm olan yığıcı linzadan ${T.d} sm məsafədə cisim var (cisim fokusdan içəridədir). Xəyalın yerini f ilə göstər — işarəsi ilə yaz (həqiqi xəyal +, xəyali xəyal −).`,
            placeholder: "f, sm",
            solution: `1/f = 1/F − 1/d = 1/${T.F} − 1/${T.d} = −${T.F - T.d}/${T.F * T.d} → f = ${F(T.f)} sm. Mənfi işarə xəyalın xəyali olduğunu göstərir (cisimlə eyni tərəfdədir).` });
        }
        if (kind === "F") {
          const T = pick(REAL.filter(t => t.d !== t.f));
          return R(T.F, "sm", { text: `Yığıcı linzadan ${T.d} sm məsafədə qoyulmuş cismin həqiqi xəyalı linzadan ${T.f} sm məsafədə alınıb. Linzanın fokus məsafəsi neçə santimetrdir?`,
            solution: `1/F = 1/d + 1/f = 1/${T.d} + 1/${T.f} = ${T.d + T.f}/${T.d * T.f} → F = ${T.d * T.f}/${T.d + T.f} = ${T.F} sm.` });
        }
        if (kind === "d") {
          const T = pick(REAL.filter(t => t.d !== t.f));
          return R(T.d, "sm", { text: `Fokus məsafəsi ${T.F} sm olan yığıcı linza ekranda cismin həqiqi xəyalını linzadan ${T.f} sm məsafədə verir. Cisim linzadan neçə santimetr məsafədədir?`,
            solution: `1/d = 1/F − 1/f = 1/${T.F} − 1/${T.f} = ${T.f - T.F}/${T.F * T.f} → d = ${T.F * T.f}/${T.f - T.F} = ${T.d} sm.` });
        }
        if (kind === "gamma") {
          const T = pick(REAL.filter(t => nice(t.f / t.d, 3) && t.f !== t.d));
          return R(T.f / T.d, "", { text: `Yığıcı linza cismin həqiqi xəyalını verir: cisim linzadan ${T.d} sm, xəyal isə ${T.f} sm məsafədədir. Xəyal cismdən neçə dəfə böyükdür (Γ)?`,
            solution: `Γ = f/d = ${T.f}/${T.d} = ${F(T.f / T.d)}.` });
        }
        if (kind === "H") {
          let T, hh, H;
          do { T = pick(REAL.filter(t => t.f !== t.d)); hh = pick([1, 2, 3, 4, 5, 6, 8, 10, 12]); H = hh * T.f / T.d; } while (!nice(H, 2) || H > 60);
          return R(H, "sm", { text: `Hündürlüyü ${hh} sm olan cisim yığıcı linzadan ${T.d} sm məsafədədir, fokus məsafəsi ${T.F} sm-dir. Həqiqi xəyalın hündürlüyü neçə santimetrdir?`,
            solution: `1/f = 1/${T.F} − 1/${T.d} → f = ${F(T.f)} sm. Γ = f/d = ${T.f}/${T.d} = ${F(T.f / T.d)}. H = Γ·h = ${F(T.f / T.d)}·${hh} = ${F(H)} sm.` });
        }
        if (kind === "sep") {
          const T = pick(DIV);
          return R(T.f, "sm", { text: `Fokus məsafəsi ${-T.F} sm olan səpici linzadan ${T.d} sm məsafədə cisim var. Xəyalın yerini f ilə işarəsi ilə yaz (xəyali xəyal üçün f < 0).`, placeholder: "f, sm",
            solution: `Səpici linza: F = −${-T.F} sm. 1/f = 1/F − 1/d = −1/${-T.F} − 1/${T.d} = −${T.d - T.F}/${-T.F * T.d} → f = ${F(T.f)} sm. Xəyal xəyalidir, linza ilə cisim arasındadır.` });
        }
        if (kind === "min") {
          const Fv = pick(FS.concat([5, 18, 22]));
          return R(4 * Fv, "sm", { text: `Fokus məsafəsi ${Fv} sm olan yığıcı linza ekranda cismin həqiqi xəyalını verir. Cisim ilə ekran arasındakı məsafə ən azı nə qədər olmalıdır?`,
            solution: `L = d + f, 1/F = 1/d + 1/f. Ən kiçik L-də d = f = 2F (simmetriya). Onda L = 4F = 4·${Fv} = ${4 * Fv} sm. Daha yaxın olarsa, xəyal həqiqi alınmır.` });
        }
        if (kind === "surus") {
          const Fv = pick(FS), arr = REAL.filter(t => t.F === Fv && t.d >= 2 * Fv * 0.6);
          if (arr.length < 2) return levels[1].gen();
          const a = pick(arr); let b; do { b = pick(arr); } while (b.d === a.d);
          return R(Math.abs(a.f - b.f), "sm", { text: `Fokus məsafəsi ${Fv} sm olan yığıcı linzanın qarşısında cisim əvvəl ${a.d} sm, sonra ${b.d} sm məsafədə qoyulur (hər iki halda xəyal həqiqidir). Xəyal nə qədər sürüşür? Cavabı santimetrlə yaz.`,
            solution: `${a.d} sm üçün 1/f = 1/${Fv} − 1/${a.d} → f₁ = ${a.f} sm. ${b.d} sm üçün f₂ = ${b.f} sm. Sürüşmə: |${a.f} − ${b.f}| = ${Math.abs(a.f - b.f)} sm.` });
        }
        // iki: Bessel — two lens positions for a fixed object–screen distance
        const T = pick(REAL.filter(t => t.d !== t.f && t.d + t.f <= 130)), L = T.d + T.f;
        return R(Math.abs(T.f - T.d), "sm", { text: `Cisim ilə ekran arasındakı məsafə ${L} sm-dir. Fokus məsafəsi ${T.F} sm olan yığıcı linzanı onların arasında sürüşdürəndə iki mövqedə ekranda aydın xəyal alınır. Bu iki mövqe arasındakı məsafə neçə santimetrdir?`,
          solution: `d + f = ${L}, 1/d + 1/f = 1/${T.F} → d·f = F·(d + f) = ${T.F}·${L} = ${T.F * L}. d və f kökləri t² − ${L}t + ${T.F * L} = 0 tənliyinin kökləridir: ${T.d} və ${T.f}. Linza ${T.d} sm-dən ${T.f} sm-ə (cismdən hesabla) sürüşür, fərq ${Math.abs(T.f - T.d)} sm.` });
      } },

    { id: "dioptr", ad: "Optik qüvvə, linzalar sistemi", izah: "D = 1/F, F metrlə. Vahidi dioptriya (dptr = m⁻¹). Yığıcı linza D > 0, səpici D < 0. Bir-birinə sıx yapışdırılmış nazik linzalarda D = D₁ + D₂.",
      gen() {
        const kind = pick(["FD", "FD", "DF", "DF", "bD", "bF", "myop", "hyper", "fromdf"]);
        if (kind === "FD") {
          const Fs = pick([4, 5, 8, 10, 12.5, 20, 25, 40, 50]), neg = Math.random() < .3, D = 100 / Fs * (neg ? -1 : 1);
          return R(D, "dptr", { text: `${neg ? "Səpici" : "Yığıcı"} linzanın fokus məsafəsi ${neg ? "−" : ""}${F(Fs)} sm-dir. Linzanın optik qüvvəsi neçə dioptriyadır (işarəsi ilə)?`,
            solution: `F = ${neg ? "−" : ""}${F(Fs)} sm = ${neg ? "−" : ""}${F(Fs / 100)} m. D = 1/F = ${F(D)} dptr.${neg ? " Səpici linzanın optik qüvvəsi mənfidir." : ""}` });
        }
        if (kind === "DF") {
          const Dm = pick([0.5, 1, 1.25, 2, 2.5, 4, 5, 10, 20]), neg = Math.random() < .35, D = Dm * (neg ? -1 : 1), Fs = 100 / D;
          return R(Fs, "sm", { text: `Linzanın optik qüvvəsi ${F(D)} dptr-dir. Fokus məsafəsi neçə santimetrdir (işarəsi ilə)?`, placeholder: "F, sm",
            solution: `F = 1/D = 1/${F(D)} = ${F(Fs / 100)} m = ${F(Fs)} sm.${neg ? " Mənfi işarə: linza səpicidir." : ""}` });
        }
        if (kind === "bD" || kind === "bF") {
          let T, D1, D2;
          do { T = pick([2, 2.5, 4, 5, 10, -2, -2.5, -4, -5]); D1 = pick([1, 2, 3, 4, 5, 6, 8, -1, -2, -3, -4, -5]); D2 = T - D1; } while (Math.abs(D2) > 12 || D2 === 0 || D1 === 0);
          const note = `D = D₁ + D₂ = ${F(D1)} + (${F(D2)}) = ${F(T)} dptr.`;
          if (kind === "bD") return R(T, "dptr", { text: `İki nazik linza bir-birinə sıx yapışdırılıb. Birincinin optik qüvvəsi ${F(D1)} dptr, ikincinin ${F(D2)} dptr-dir. Sistemin optik qüvvəsi neçə dioptriyadır?`, solution: note });
          return R(100 / T, "sm", { text: `İki nazik linza bir-birinə sıx yapışdırılıb. Birincinin optik qüvvəsi ${F(D1)} dptr, ikincinin ${F(D2)} dptr-dir. Sistemin fokus məsafəsi neçə santimetrdir (işarəsi ilə)?`, placeholder: "F, sm",
            solution: `${note} F = 1/D = 1/${F(T)} = ${F(1 / T)} m = ${F(100 / T)} sm.` });
        }
        if (kind === "myop") {
          const a = pick([0.2, 0.4, 0.5, 0.8, 1, 2]), D = -1 / a;
          return R(D, "dptr", { text: `Yaxıngörən şəxs yalnız ${F(a * 100)} sm-dən uzaq olmayan cisimləri aydın görür (uzaq nöqtəsi ${F(a)} m). Sonsuzluqdakı cisimləri görmək üçün eynəyin optik qüvvəsi neçə dioptriya olmalıdır?`,
            solution: `Eynək sonsuzluqdakı cismin xəyalını ${F(a)} m-də (xəyali, f = −${F(a)} m) yaratmalıdır. D = 1/d + 1/f = 0 − 1/${F(a)} = ${F(D)} dptr. Səpici linza lazımdır.` });
        }
        if (kind === "hyper") {
          const a = pick([0.4, 0.5, 0.8, 1, 2]), D = 4 - 1 / a;
          return R(D, "dptr", { text: `Uzaqgörən şəxs kitabı ancaq ${F(a * 100)} sm məsafədən aydın görür. Normal göz kimi 25 sm-dən oxumaq üçün eynəyin optik qüvvəsi neçə dioptriya olmalıdır?`,
            solution: `Kitab eynəkdən d = 0,25 m məsafədədir, xəyal isə şəxsin görə bildiyi ${F(a)} m-də xəyali alınmalıdır (f = −${F(a)} m). D = 1/0,25 − 1/${F(a)} = 4 − ${F(1 / a)} = ${F(D)} dptr. Yığıcı linza.` });
        }
        const T = pick(REAL.concat(VIRT).filter(t => nice(100 / t.F, 2) && Math.abs(t.f) < 100));
        const Dv = 100 / T.F, virt = T.f < 0;
        return R(Dv, "dptr", { text: `Cisim linzadan ${T.d} sm məsafədə qoyulub, ${virt ? "xəyali xəyal" : "həqiqi xəyal"} isə linzadan ${Math.abs(T.f)} sm məsafədə alınıb. Linzanın optik qüvvəsi neçə dioptriyadır?`,
          solution: `1/F = 1/d + 1/f = 1/${F(T.d / 100)} ${virt ? "−" : "+"} 1/${F(Math.abs(T.f) / 100)} m⁻¹ = ${F(100 / T.d)} ${virt ? "−" : "+"} ${F(100 / Math.abs(T.f))} = ${F(Dv)} dptr.` });
      } },

    { id: "guzgu", ad: "Sferik güzgülər", izah: "Çökək güzgü yığıcıdır (F > 0), qabarıq güzgü səpicidir (F < 0). F = R/2. Düstur linzadakı kimidir: 1/F = 1/d + 1/f. Düz güzgüdə xəyal simmetrik yerdədir.",
      gen() {
        const kind = pick(["RF", "FR", "real", "virt", "qab", "duz", "duzv", "gam", "R"]);
        if (kind === "RF") { const R2 = pick([10, 16, 20, 30, 40, 60, 100]); return R(R2 / 2, "sm", { text: `Çökək güzgünün əyrilik radiusu ${R2} sm-dir. Fokus məsafəsi neçə santimetrdir?`, solution: `F = R/2 = ${R2}/2 = ${R2 / 2} sm.` }); }
        if (kind === "FR") { const Fv = pick([5, 8, 12, 15, 20, 25, 40]); return R(2 * Fv, "sm", { text: `Çökək güzgünün fokus məsafəsi ${Fv} sm-dir. Əyrilik radiusu neçə santimetrdir?`, solution: `R = 2F = 2·${Fv} = ${2 * Fv} sm.` }); }
        if (kind === "real") {
          const T = pick(REAL);
          return R(T.f, "sm", { text: `Çökək güzgünün əyrilik radiusu ${2 * T.F} sm-dir. Cisim güzgüdən ${T.d} sm məsafədədir. Həqiqi xəyal güzgüdən neçə santimetr məsafədə alınır?`,
            solution: `F = R/2 = ${T.F} sm. 1/f = 1/F − 1/d = 1/${T.F} − 1/${T.d} = ${T.d - T.F}/${T.F * T.d} → f = ${F(T.f)} sm (güzgünün qarşısında).` });
        }
        if (kind === "virt") {
          const T = pick(VIRT);
          return R(T.f, "sm", { text: `Çökək güzgünün əyrilik radiusu ${2 * T.F} sm-dir, cisim güzgüdən ${T.d} sm məsafədədir. Xəyalın yerini f ilə işarəsi ilə yaz (xəyali xəyal üçün f < 0).`, placeholder: "f, sm",
            solution: `F = R/2 = ${T.F} sm, d = ${T.d} sm < F. 1/f = 1/${T.F} − 1/${T.d} = −${T.F - T.d}/${T.F * T.d} → f = ${F(T.f)} sm. Xəyal xəyalidir (güzgünün arxasındadır), düz və böyüdülmüşdür.` });
        }
        if (kind === "qab") {
          const T = pick(DIV);
          return R(T.f, "sm", { text: `Qabarıq güzgünün əyrilik radiusu ${-2 * T.F} sm-dir. Cisim güzgüdən ${T.d} sm məsafədədir. Xəyalın yerini f ilə işarəsi ilə yaz.`, placeholder: "f, sm",
            solution: `Qabarıq güzgü: F = −R/2 = ${F(T.F)} sm. 1/f = 1/F − 1/d = −1/${-T.F} − 1/${T.d} = −${T.d - T.F}/${-T.F * T.d} → f = ${F(T.f)} sm. Xəyal xəyalidir, güzgünün arxasındadır, kiçilmişdir.` });
        }
        if (kind === "duz") {
          let a, b; do { a = pick([2, 3, 4, 5, 6, 8]); b = rnd(1, a - 1); } while (a - b < 1);
          return R(2 * (a - b), "m", { text: `Fikrət düz güzgüdən ${a} m məsafədə durub. O, güzgüyə doğru ${b} m yeriyir. İndi Fikrətlə onun xəyalı arasındakı məsafə neçə metrdir?`,
            solution: `Xəyal güzgünün arxasında eyni məsafədədir. İndi Fikrət güzgüdən ${a} − ${b} = ${a - b} m məsafədədir, xəyal da ${a - b} m arxadadır. Aralarında 2·${a - b} = ${2 * (a - b)} m.` });
        }
        if (kind === "duzv") {
          const v = pick([1, 2, 3, 4, 5]);
          return R(2 * v, "m/s", { text: `Cisim hərəkətsiz durur, düz güzgü isə ondan perpendikulyar istiqamətdə ${v} m/s sürətlə uzaqlaşır. Xəyal cismə nəzərən hansı sürətlə uzaqlaşır?`,
            solution: `Cisimlə xəyal arasındakı məsafə 2x-dir (x — cisimlə güzgü arasında). x hər saniyə ${v} m artırsa, 2x ${2 * v} m artır → ${2 * v} m/s.` });
        }
        if (kind === "gam") {
          const T = pick(REAL.filter(t => nice(t.f / t.d, 3) && t.f !== t.d));
          return R(T.f / T.d, "", { text: `Çökək güzgünün əyrilik radiusu ${2 * T.F} sm-dir. Cisim güzgüdən ${T.d} sm məsafədədir. Həqiqi xəyal cismdən neçə dəfə böyükdür?`,
            solution: `F = ${T.F} sm. 1/f = 1/${T.F} − 1/${T.d} → f = ${F(T.f)} sm. Γ = f/d = ${T.f}/${T.d} = ${F(T.f / T.d)}.` });
        }
        const T = pick(REAL.filter(t => t.d === 2 * t.F));
        return R(T.f, "sm", { text: `Çökək güzgünün fokus məsafəsi ${T.F} sm-dir. Cisim güzgünün əyrilik mərkəzində qoyulub. Xəyal güzgüdən neçə santimetr məsafədə alınır?`,
          solution: `Əyrilik mərkəzi güzgüdən R = 2F = ${2 * T.F} sm məsafədədir, yəni d = ${T.d} sm. 1/f = 1/${T.F} − 1/${T.d} = 1/${T.d} → f = ${F(T.f)} sm. Xəyal cismin yerində, tərs və cismə bərabərdir.` });
      } },

    { id: "dispers", ad: "Dispersiya və sınma", izah: "Ağ işıq mürəkkəbdir. Sındırma əmsalı n rəngdən asılıdır: bənövşəyi üçün ən böyük, qırmızı üçün ən kiçik. n = c/v, sin α = n·sin β (havadan mühitə).",
      gen() {
        const kind = pick(["qual", "qual", "qual", "v", "nv", "snell"]);
        if (kind === "qual") {
          const Q = [
            { q: "Ağ işıq şüşə prizmadan keçəndə hansı rəng ən çox əyilir?", ok: "bənövşəyi", bad: ["qırmızı", "yaşıl", "sarı"], sol: "Bənövşəyi üçün şüşənin sındırma əmsalı n ən böyükdür, ona görə şüa ən çox əyilir." },
            { q: "Ağ işıq şüşə prizmadan keçəndə hansı rəng ən az əyilir?", ok: "qırmızı", bad: ["bənövşəyi", "göy", "yaşıl"], sol: "Qırmızı üçün n ən kiçikdir, buna görə ən az sınır." },
            { q: "Şüşədə sürəti ən böyük olan rəng hansıdır?", ok: "qırmızı", bad: ["bənövşəyi", "yaşıl", "sürətlər eynidir"], sol: "v = c/n. Qırmızı üçün n ən kiçikdir, deməli v ən böyükdür." },
            { q: "Vakuumda qırmızı və bənövşəyi işıq haqqında nə demək olar?", ok: "eyni sürətlə yayılır (3·10⁸ m/s)", bad: ["qırmızı işıq daha sürətlidir", "bənövşəyi işıq daha sürətlidir", "işıq vakuumda yayıla bilmir"], sol: "Dispersiya yalnız maddi mühitdə olur. Vakuumda bütün rənglərin sürəti c-dir." },
            { q: "Göy qurşağında ən xarici (ən yuxarı) qövsün rəngi hansıdır?", ok: "qırmızı", bad: ["bənövşəyi", "yaşıl", "mavi"], sol: "Yağış damcılarında qırmızı şüalar ən az əyilir, ona görə qırmızı qövs xaricdə görünür." },
            { q: "Göy qurşağını görmək üçün Günəş haradadır?", ok: "müşahidəçinin arxasında, yağış isə qarşıda", bad: ["müşahidəçinin qarşısında, yağışın arxasında", "başın üstündə", "fərqi yoxdur"], sol: "Damcıda işıq sınır, əks olunur və yenə sınır; müşahidəçiyə geri qayıdan şüalar görünür, deməli Günəş arxadadır." },
            { q: "Qırmızı filtrdən keçən ağ işıqla yaşıl yarpağı işıqlandırırlar. Yarpaq necə görünür?", ok: "demək olar ki, qara", bad: ["yaşıl", "qırmızı", "ağ"], sol: "Yarpaq yalnız yaşıl işığı əks etdirir. Qırmızı işıqda yaşıl yoxdur, əks etdiriləcək şey qalmır." },
            { q: "Ağ işıq yığıcı linzadan keçir. Hansı rəngin fokusu linzaya ən yaxındır?", ok: "bənövşəyi", bad: ["qırmızı", "yaşıl", "hamısı eyni nöqtədə toplanır"], sol: "Bənövşəyi daha çox sınır, ona görə daha tez toplanır. Bu hadisəyə xromatik aberrasiya deyilir." },
            { q: "Qırmızı lazer şüası prizmadan keçir. Ekranda nə görünür?", ok: "rəng zolağı yox, yalnız əyilmiş qırmızı nöqtə", bad: ["yeddi rəngli zolaq", "bənövşəyi nöqtə", "heç nə görünməz"], sol: "Lazer işığı demək olar bir rənglidir (monoxromatikdir): ayrılacaq başqa rəng yoxdur. Prizma onu yalnız əyir." },
            { q: "Spektrdə rənglərin düzgün sırası (qırmızıdan bənövşəyiyə) hansıdır?", ok: "qırmızı, narıncı, sarı, yaşıl, mavi, göy, bənövşəyi", bad: ["qırmızı, sarı, narıncı, yaşıl, mavi, göy, bənövşəyi", "qırmızı, narıncı, sarı, mavi, yaşıl, göy, bənövşəyi", "bənövşəyi, qırmızı, narıncı, sarı, yaşıl, mavi, göy"], sol: "Qırmızıdan bənövşəyiyə sındırma əmsalı artır: qırmızı, narıncı, sarı, yaşıl, mavi, göy, bənövşəyi." },
          ];
          const r = pick(Q), ch = shuffle([r.ok, ...r.bad]);
          return { text: r.q, choices: ch, correct: ch.indexOf(r.ok), show: r.ok, solution: r.sol };
        }
        if (kind === "v") {
          const n = pick([1.2, 1.25, 1.5, 2, 2.4, 3]), v = 3 / n;
          return R(v, "·10⁸ m/s", { text: `Mühitin sındırma əmsalı n = ${F(n)}-dir. İşığın bu mühitdə sürəti neçə ·10⁸ m/s-dir? (c = 3·10⁸ m/s)`,
            solution: `v = c/n = 3·10⁸/${F(n)} = ${F(v)}·10⁸ m/s.` });
        }
        if (kind === "nv") {
          const v = pick([1.5, 2, 2.25, 2.4, 2.5, 1.25]), n = 3 / v;
          return R(n, "", { text: `İşıq şəffaf maddədə ${F(v)}·10⁸ m/s sürətlə yayılır. Maddənin sındırma əmsalı n neçədir? (c = 3·10⁸ m/s)`,
            solution: `n = c/v = 3/${F(v)} = ${F(n)}.`, tol: 0.01 });
        }
        const P = pick([[0.6, 0.4, 1.5], [0.8, 0.5, 1.6], [0.6, 0.5, 1.2], [0.5, 0.25, 2], [0.9, 0.6, 1.5], [0.75, 0.5, 1.5], [0.8, 0.64, 1.25], [0.6, 0.48, 1.25]]);
        const w = pick(["n", "sb", "sb"]);
        if (w === "n") return R(P[2], "", { text: `İşıq havadan şəffaf maddəyə düşür: düşmə bucağının sinusu ${F(P[0])}, sınma bucağının sinusu ${F(P[1])}-dir. Maddənin sındırma əmsalı neçədir?`,
          solution: `sin α = n·sin β → n = ${F(P[0])}/${F(P[1])} = ${F(P[2])}.`, tol: 0.01 });
        return R(P[1], "", { text: `İşıq havadan sındırma əmsalı ${F(P[2])} olan maddəyə düşür. Düşmə bucağının sinusu ${F(P[0])}-dir. Sınma bucağının sinusu neçədir?`,
          solution: `sin α = n·sin β → sin β = ${F(P[0])}/${F(P[2])} = ${F(P[1])}.`, tol: 0.001 });
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Proyektor, fotoaparat, lupa, eynək, diş həkiminin güzgüsü — hamısı eyni düsturdur.",
      gen() {
        const kind = pick(["proj", "projH", "foto", "lupa", "lupa2", "eynek", "dis", "avto"]);
        if (kind === "proj") {
          const T = pick(REAL.filter(t => t.f / t.d >= 3));
          return R(T.f, "sm", { text: `Proyektorun obyektivinin fokus məsafəsi ${T.F} sm-dir. Slayd obyektivdən ${T.d} sm məsafədə qoyulub. Ekran obyektivdən neçə santimetr məsafədə olmalıdır ki, şəkil aydın alınsın?`,
            solution: `1/f = 1/F − 1/d = 1/${T.F} − 1/${T.d} = ${T.d - T.F}/${T.F * T.d} → f = ${F(T.f)} sm. (Slayd fokusdan azca kənardadır — şəkil çox böyüdülür.)` });
        }
        if (kind === "projH") {
          let T, a, W; do { T = pick(REAL.filter(t => t.f / t.d >= 3)); a = pick([2.4, 3, 3.6, 4, 5]); W = a * T.f / T.d; } while (!nice(W, 1));
          return R(W, "sm", { text: `Proyektorun obyektivinin fokus məsafəsi ${T.F} sm-dir. Eni ${F(a)} sm olan slayd obyektivdən ${T.d} sm məsafədədir. Ekranda şəklin eni neçə santimetr olur?`,
            solution: `1/f = 1/${T.F} − 1/${T.d} → f = ${F(T.f)} sm. Γ = f/d = ${T.f}/${T.d} = ${F(T.f / T.d)}. En: ${F(a)}·${F(T.f / T.d)} = ${F(W)} sm.` });
        }
        if (kind === "foto") {
          const Fm = pick([50, 100]), opt = Fm === 50 ? [[250, 10], [500, 5], [1000, 2.5], [2500, 1]] : [[500, 20], [1000, 10], [2000, 5], [4000, 2.5]], [dm, D] = pick(opt), d = Fm + dm;
          return R(D, "mm", { text: `Fotoaparatın obyektivinin fokus məsafəsi ${Fm} mm-dir. Obyektiv sonsuzluğa fokuslanıb. Sonra ${F(d / 1000)} m məsafədəki cisim üçün obyektivi nə qədər (mm-lə) plyonkadan uzaqlaşdırmaq lazımdır?`,
            solution: `Sonsuzluqda xəyal fokusdadır: f = F = ${Fm} mm. d = ${d} mm üçün f = dF/(d − F) = ${d}·${Fm}/${dm} = ${F(d * Fm / dm)} mm. Sürüşmə: ${F(d * Fm / dm)} − ${Fm} = ${F(D)} mm.` });
        }
        if (kind === "lupa") {
          const Fs = pick([2.5, 5, 10, 12.5, 1.25]), G = 25 / Fs;
          return R(G, "", { text: `Lupanın fokus məsafəsi ${F(Fs)} sm-dir. Göz gərginliksiz baxanda (xəyal sonsuzluqda) lupa neçə dəfə böyüdür? Normal gözün ən yaxşı görmə məsafəsi 25 sm-dir.`,
            solution: `Gərginliksiz baxanda cisim lupanın fokusundadır, böyütmə Γ = 25/F = 25/${F(Fs)} = ${F(G)}.` });
        }
        if (kind === "lupa2") {
          const Fs = pick([2.5, 5, 10, 12.5, 25]), G = 25 / Fs + 1;
          return R(G, "", { text: `Lupanın fokus məsafəsi ${F(Fs)} sm-dir. Xəyal gözdən 25 sm məsafədə (ən yaxşı görmə məsafəsində, xəyali) alınır. Lupanın böyütməsi neçədir?`,
            solution: `f = −25 sm. 1/d = 1/F − 1/f = 1/${F(Fs)} + 1/25. Γ = 25/d = 25·(1/${F(Fs)} + 1/25) = 25/${F(Fs)} + 1 = ${F(G)}.` });
        }
        if (kind === "eynek") {
          const D = -pick([1, 1.25, 2, 2.5, 4, 5]), a = -1 / D * 100;
          return R(a, "sm", { text: `Fikrətin dostu ${F(D)} dptr optik qüvvəli eynək taxır. Eynək olmadan o, ən çox neçə santimetr məsafəyə qədər cisimləri aydın görür (uzaq nöqtəsi)?`,
            solution: `Sonsuzluqdakı cismi eynək xəyali olaraq uzaq nöqtədə yaratmalıdır: D = −1/a → a = 1/|D| = 1/${F(-D)} = ${F(a / 100)} m = ${F(a)} sm.` });
        }
        if (kind === "dis") {
          let Fv, d, G; do { Fv = pick([10, 12, 15, 20, 24, 30]); d = rnd(2, Fv - 1); G = Fv / (Fv - d); } while (!nice(G, 2));
          return R(G, "", { text: `Diş həkiminin çökək güzgüsünün fokus məsafəsi ${Fv} sm-dir. Güzgü dişdən ${d} sm məsafədə tutulur. Dişin xəyalı neçə dəfə böyükdür?`,
            solution: `1/f = 1/${Fv} − 1/${d} → f = −${F(d * Fv / (Fv - d))} sm (xəyali). Γ = |f|/d = ${Fv}/(${Fv} − ${d}) = ${Fv}/${Fv - d} = ${F(G)}.` });
        }
        let Fa, d, f;
        do { Fa = pick([1, 2, 3]); d = rnd(1, 40); f = d * Fa / (d + Fa); } while (!nice(f, 2));
        return R(f, "m", { text: `Avtomobilin yan güzgüsü qabarıqdır, əyrilik radiusu ${2 * Fa} m-dir. Arxadan gələn maşın güzgüdən ${d} m məsafədədir. Onun xəyalı güzgünün arxasında neçə metr məsafədə yaranır?`,
          solution: `Qabarıq güzgü: F = −R/2 = −${Fa} m. 1/f = 1/F − 1/d = −1/${Fa} − 1/${d} → |f| = ${d}·${Fa}/(${d} + ${Fa}) = ${F(f)} m. Xəyal xəyalidir (güzgünün arxasındadır) və kiçilmişdir.` });
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .6) {
          const T = pick(REAL.filter(t => t.f !== t.d && t.d - t.F !== t.f && nice(t.f / t.d, 3) && t.F !== 6)), f = T.f, Gs = frac(f, T.d);
          task = `Fokus məsafəsi ${T.F} sm olan yığıcı linzadan ${T.d} sm məsafədə cisim var. Həqiqi xəyal cismdən neçə dəfə böyükdür?`;
          steps = [
            `Cisim fokusdan uzaqdır (d > F), xəyal həqiqidir: 1/F = 1/d + 1/f.`,
            `1/f = 1/${T.F} − 1/${T.d} = ${T.d - T.F}/${T.F * T.d} → f = ${f} sm.`,
            `Γ = f/d = ${f}/${T.d} = ${Gs}.`,
          ];
          if (bad === 0) { const f0 = T.d * T.F / (T.d + T.F), s0 = frac(T.d * T.F, T.d + T.F); steps = [`Düstur: 1/f = 1/F + 1/d.`, `1/f = 1/${T.F} + 1/${T.d} = ${T.d + T.F}/${T.F * T.d} → f = ${s0} sm.`, `Γ = f/d = ${s0}/${T.d} = ${frac(T.F, T.d + T.F)}.`]; }
          if (bad === 1) { const f1 = T.d - T.F; steps[1] = `1/f = 1/${T.F} − 1/${T.d} = 1/(${T.d} − ${T.F}) = 1/${f1} → f = ${f1} sm.`; steps[2] = `Γ = f/d = ${f1}/${T.d} = ${frac(f1, T.d)}.`; }
          if (bad === 2) steps[2] = `Γ = d/f = ${T.d}/${f} = ${frac(T.d, f)}.`;
          why = [`1-ci addım: həqiqi xəyalda 1/F = 1/d + 1/f, buradan 1/f = 1/F − 1/d. Düz cavab: Γ = ${Gs}.`,
            `2-ci addım: kəsrləri çıxanda məxrəcləri çıxmaq olmaz: 1/${T.F} − 1/${T.d} = ${T.d - T.F}/${T.F * T.d}. Onda f = ${f} sm, Γ = ${Gs}.`,
            `3-cü addım: böyütmə xəyalın məsafəsinin cismin məsafəsinə nisbətidir: Γ = f/d. Düz cavab: ${Gs}.`][bad];
        } else {
          const Fs = pick([8, 10, 20, 25, 40, 50]), neg = Math.random() < .35, sg = neg ? "−" : "", D = (neg ? -1 : 1) * 100 / Fs;
          task = `${neg ? "Səpici" : "Yığıcı"} linzanın fokus məsafəsi ${sg}${Fs} sm-dir. Linzanın optik qüvvəsi neçə dioptriyadır?`;
          steps = [
            `Optik qüvvə D = 1/F, F metrlə götürülür.`,
            `F = ${sg}${Fs} sm = ${sg}${F(Fs / 100)} m.`,
            `D = 1/F = 1/(${sg}${F(Fs / 100)}) = ${F(D)} dptr.`,
          ];
          if (bad === 0) steps = [`Optik qüvvə D = F: linza nə qədər uzağa fokuslayırsa, o qədər güclüdür.`, `F = ${sg}${Fs} sm = ${sg}${F(Fs / 100)} m.`, `D = F = ${sg}${F(Fs / 100)} dptr.`];
          if (bad === 1) { steps[1] = `F = ${sg}${Fs} sm = ${sg}${F(Fs / 10)} m.`; steps[2] = `D = 1/F = 1/(${sg}${F(Fs / 10)}) = ${F(D / 10)} dptr.`; }
          if (bad === 2) steps[2] = `D = 1/F = 1/(${sg}${F(Fs / 100)}) = ${F(D / 10)} dptr.`;
          why = [`1-ci addım: optik qüvvə D = 1/F; F nə qədər kiçikdirsə, linza o qədər güclüdür. Düz cavab: ${F(D)} dptr.`,
            `2-ci addım: 1 m = 100 sm, ona görə ${Fs} sm = ${F(Fs / 100)} m (${F(Fs / 10)} yox). Düz cavab: ${F(D)} dptr.`,
            `3-cü addım: 1/${F(Fs / 100)} = ${F(100 / Fs)} (kəsrə bölmək tərsinə vurmaqdır). Düz cavab: ${F(D)} dptr.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-linza", title: "Linzalar və güzgülər", fenn: "fizika", link: "dersler/fiz-linza.html",
      format: "Cavab ədəddir. Onluq kəsr vergül və ya nöqtə ilə: 0,5. Məsafələr santimetrlə (sm), optik qüvvə dioptriya ilə (dptr). Xəyali xəyal üçün f mənfi yazılır, məsələn −30.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["qur", "formul", "formul", "formul", "dioptr", "dioptr", "guzgu", "dispers", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-linza.html")) b.push("dersler/fiz-linza.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
