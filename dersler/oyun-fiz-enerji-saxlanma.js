// Fizika · Enerjinin saxlanması — mastery game levels (free fall and throws, pendulum, slides and loops, springs, losses to friction) and the final test.
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

  // pendulum released from angle al (degrees) with string length L (metres)
  function pend(L, al) {
    const W = 260, H = 150, px = 130, py = 14, len = 100, a = al * Math.PI / 180, bx = px + len * Math.sin(a), by = py + len * Math.cos(a);
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Rəqqas: ip və kürə" });
    g.append(sv("line", { x1: px - 40, y1: py, x2: px + 40, y2: py, stroke: INK, "stroke-width": 3 }));
    g.append(sv("line", { x1: px, y1: py, x2: px, y2: py + len + 16, stroke: "#888", "stroke-dasharray": "4 3" }));
    g.append(sv("line", { x1: px, y1: py, x2: bx, y2: by, stroke: INK, "stroke-width": 2 }));
    g.append(sv("circle", { cx: bx, cy: by, r: 9, fill: RED }));
    g.append(sv("circle", { cx: px, cy: py + len, r: 9, fill: "none", stroke: "#888", "stroke-dasharray": "3 3" }));
    g.append(sv("text", { x: px + 14, y: py + 44, class: "oy-lbl" }, "α = " + al + "°"));
    g.append(sv("text", { x: (px + bx) / 2 + (al > 0 ? 8 : -8), y: (py + by) / 2 - 6, class: "oy-lbl" }, "L = " + F(L) + " m"));
    return g;
  }

  const levels = [
    { id: "dusme", ad: "Düşmə və atma", izah: "Havanın müqaviməti yoxdursa mexaniki enerji saxlanır: mgh₁ + mv₁²/2 = mgh₂ + mv₂²/2. Kütlə hər yerdə ixtisar olur.",
      gen() {
        const kind = pick(["v", "h", "yuxari", "yuxariV", "asagi", "yarim", "dord"]);
        const VS = [2, 4, 5, 6, 8, 10, 12, 14, 15, 20, 24, 25, 30];
        if (kind === "v") {
          let v, hh; do { v = pick(VS); hh = v * v / 20; } while (!nice(hh, 2));
          return R(v, "m/s", { text: `Cisim ${F(hh)} m hündürlükdən sərbəst düşür (havanın müqaviməti yoxdur). Yerə çatanda sürəti nə qədərdir?`,
            solution: `mgh = mv²/2 → v = √(2gh) = √(20·${F(hh)}) = √${v * v} = ${v} m/s.` });
        }
        if (kind === "h") {
          let v, hh; do { v = pick(VS); hh = v * v / 20; } while (!nice(hh, 2));
          return R(hh, "m", { text: `Cisim sərbəst düşür və yerə ${v} m/s sürətlə çatır. O, hansı hündürlükdən düşüb? Havanın müqaviməti yoxdur.`,
            solution: `mgh = mv²/2 → h = v²/(2g) = ${v * v}/20 = ${F(hh)} m.` });
        }
        if (kind === "yuxari") {
          let v, hh; do { v = pick(VS); hh = v * v / 20; } while (!nice(hh, 2));
          return R(hh, "m", { text: `Top yerdən şaquli yuxarı ${v} m/s sürətlə atılır. Havanın müqavimətini nəzərə almasaq, maksimal qalxma hündürlüyü nə qədərdir?`,
            solution: `Ən yüksək nöqtədə sürət 0-dır: mv²/2 = mgh → h = v²/(2g) = ${v * v}/20 = ${F(hh)} m.` });
        }
        if (kind === "yuxariV") {
          let v0, v, hh; do { v0 = pick([10, 12, 15, 20, 25, 30]); v = pick([0, 2, 4, 5, 6, 8, 10, 12, 15]); hh = (v0 * v0 - v * v) / 20; } while (v >= v0 || !nice(hh, 2) || hh <= 0);
          return R(v, "m/s", { text: `Daş yerdən şaquli yuxarı ${v0} m/s sürətlə atılıb. Yerdən ${F(hh)} m hündürlükdə daşın sürətinin modulu nə qədərdir? (Daş hələ yuxarı qalxır. Havanın müqaviməti yoxdur.)`,
            solution: `v₀²/2 = gh + v²/2 → v² = v₀² − 2gh = ${v0 * v0} − 20·${F(hh)} = ${v * v} → v = ${v} m/s.` });
        }
        if (kind === "asagi") {
          let v0, hh, v; do { v0 = pick([3, 4, 5, 6, 8, 10, 12]); hh = pick([2, 3, 5, 10, 12, 15, 20, 25, 30]); v = Math.sqrt(v0 * v0 + 20 * hh); } while (!Number.isInteger(v));
          return R(v, "m/s", { text: `Top ${hh} m hündürlükdən üfüqi istiqamətdə ${v0} m/s sürətlə atılır. Yerə çatanda sürətinin modulu nə qədərdir? Havanın müqaviməti yoxdur.`,
            solution: `Enerji saxlanır (istiqamət fərqi yoxdur): mv²/2 = mv₀²/2 + mgh → v² = ${v0 * v0} + 20·${hh} = ${v * v} → v = ${v} m/s.` });
        }
        if (kind === "yarim") {
          const H = pick([2, 4, 6, 8, 10, 12, 16, 20, 40]);
          return R(H / 2, "m", { text: `Cisim ${H} m hündürlükdən sərbəst düşür. Yerdən hansı hündürlükdə onun kinetik enerjisi potensial enerjisinə bərabər olar?`,
            solution: `Tam enerji mgH sabitdir. Ek = Ep olanda hər biri mgH/2-dir: mgh = mgH/2 → h = H/2 = ${F(H / 2)} m.` });
        }
        const H = pick([4, 8, 12, 16, 20, 40, 80]);
        return R(3 * H / 4, "m", { text: `Cisim ${H} m hündürlükdən sərbəst düşür. Düşmə zamanı onun sürəti yerə çatanda alacağı sürətin yarısı olur. Bu an cisim yerdən neçə metr hündürlükdədir?`,
          solution: `v = √(2g·(düşdüyü yol)). Sürət yarı olsa, düşdüyü yol 2² = 4 dəfə az olur: ${H}/4 = ${F(H / 4)} m. Yerdən hündürlük: ${H} − ${F(H / 4)} = ${F(3 * H / 4)} m.` });
      } },
    { id: "sarkac", ad: "Rəqqas", izah: "İpin dartılma qüvvəsi hərəkət istiqamətinə perpendikulyardır, iş görmür — enerji saxlanır. Hündürlük: h = L(1 − cos α). Ən aşağı nöqtədə T = mg + mv²/L.",
      gen() {
        const kind = pick(["v", "v", "hmax", "T"]);
        if (kind === "v") {
          let al, v, L; do { al = pick([60, 90]); v = pick([2, 3, 4, 5, 6, 8]); L = al === 60 ? v * v / 10 : v * v / 20; } while (!nice(L, 2) || L < 0.1);
          const hh = al === 60 ? L / 2 : L;
          return R(v, "m/s", { text: `Uzunluğu ${F(L)} m olan ipdən asılmış kürə ipin şaquliyə ${al === 60 ? "60°" : "90° (ip üfüqi)"} meyl etdiyi vəziyyətdən başlanğıc sürətsiz buraxılır. Ən aşağı nöqtədə kürənin sürəti nə qədərdir?`, svg: pend(L, al),
            solution: `Başlanğıc hündürlük (ən aşağı nöqtədən): h = L(1 − cos ${al}°) = ${F(L)}·${al === 60 ? "0,5" : "1"} = ${F(hh)} m. mgh = mv²/2 → v = √(2gh) = √(20·${F(hh)}) = √${v * v} = ${v} m/s.` });
        }
        if (kind === "hmax") {
          const v = pick([1, 2, 3, 4]), L = pick([1, 1.5, 2, 3]), hh = v * v / 20;
          return R(hh, "m", { text: `Uzunluğu ${F(L)} m olan ipdən asılmış kürə tarazlıq vəziyyətindən ${v} m/s sürətlə keçir. Kürə tarazlıq vəziyyətindən (ən aşağı nöqtədən) neçə metr yuxarı qalxır?`,
            solution: `Ən yüksək nöqtədə sürət 0: mv²/2 = mgh → h = v²/(2g) = ${v * v}/20 = ${F(hh)} m. (İpin uzunluğu məsələni dəyişmir — ${F(hh)} < ${F(L)}.)` });
        }
        const al = pick([60, 90]), m = pick([0.1, 0.2, 0.5, 1, 2]), c = al === 60 ? 2 : 3, T = m * g * c;
        return R(T, "N", { text: `Kütləsi ${F(m)} kq olan kürə uzunluğu L olan ipdən asılıb. İp şaquliyə ${al === 60 ? "60°" : "90°"} meyl etdirilib və kürə başlanğıc sürətsiz buraxılır. Ən aşağı nöqtədə ipin dartılma qüvvəsi neçə nyutondur?`,
          solution: `Enerji: v² = 2gL(1 − cos ${al}°) = ${al === 60 ? "gL" : "2gL"}. Ən aşağı nöqtədə T − mg = mv²/L → T = mg + m·${al === 60 ? "g" : "2g"} = ${c}mg = ${c}·${F(m)}·10 = ${F(T)} N. (L ixtisar olur.)` });
      } },
    { id: "surusme", ad: "Sürüşkə və döngə", izah: "Hamar sürüşkədə sürət yalnız hündürlük fərqindən asılıdır: v = √(2g·Δh), sürüşkənin şəklindən yox. Döngənin yuxarı nöqtəsində keçmək üçün v² ≥ gR olmalıdır.",
      gen() {
        const kind = pick(["tepe", "tepe", "tepe2", "donge", "donge", "dongeV"]);
        if (kind === "tepe") {
          let h1, h2, v; do { h1 = pick([3, 5, 8, 10, 12, 15, 20, 25]); h2 = pick([1, 2, 3, 4, 5, 8, 10, 15]); v = Math.sqrt(20 * (h1 - h2)); } while (h2 >= h1 || !Number.isInteger(v));
          return R(v, "m/s", { text: `Hamar sürüşkə şəklindəki yoldan xizəkçi ${h1} m hündürlükdən başlanğıc sürətsiz sürüşür. Yolun ${h2} m hündürlüyündəki nöqtəsindən keçəndə sürəti nə qədər olar? Sürtünmə yoxdur.`,
            solution: `mg(h₁ − h₂) = mv²/2 → v² = 2g(h₁ − h₂) = 20·${h1 - h2} = ${v * v} → v = ${v} m/s. Yolun şəkli əhəmiyyətli deyil.` });
        }
        if (kind === "tepe2") {
          let v0, h2, v; do { v0 = pick([10, 12, 15, 20, 25]); h2 = pick([2, 3, 5, 8, 10, 12, 15, 20]); v = Math.sqrt(v0 * v0 - 20 * h2); } while (v0 * v0 <= 20 * h2 || !Number.isInteger(v) || v < 1);
          return R(v, "m/s", { text: `Dağ yolunda motosiklet mühərriki söndürülmüş halda aşağıdan ${v0} m/s sürətlə yoxuşa çıxır. Yoxuşun ${h2} m hündürlüyündəki nöqtədə sürəti nə qədər olar? Sürtünməni nəzərə alma.`,
            solution: `mv₀²/2 = mgh + mv²/2 → v² = v₀² − 2gh = ${v0 * v0} − 20·${h2} = ${v * v} → v = ${v} m/s.` });
        }
        if (kind === "donge") {
          const R0 = pick([0.4, 0.8, 1, 1.2, 2, 3, 4, 5]);
          return R(2.5 * R0, "m", { text: `Cisim hamar sürüşkənin müəyyən hündürlüyündən başlanğıc sürətsiz buraxılır və radiusu ${F(R0)} m olan şaquli dairəvi döngəyə daxil olur. Döngənin yuxarı nöqtəsindən düşmədən keçmək üçün buraxılma hündürlüyü (döngənin dibindən ölçülür) ən azı neçə metr olmalıdır?`,
            solution: `Yuxarı nöqtədə ən kiçik sürət: mg = mv²/R → v² = gR. Enerji: mgh = mg·2R + mv²/2 = 2mgR + mgR/2 = 2,5mgR. h = 2,5R = 2,5·${F(R0)} = ${F(2.5 * R0)} m.` });
        }
        let R0, v, hh; do { R0 = pick([0.4, 0.5, 0.8, 1, 1.5, 2, 2.5]); v = pick([2, 3, 4, 5, 6, 8]); hh = 2 * R0 + v * v / 20; } while (!nice(hh, 2) || v * v < 10 * R0);
        return R(v, "m/s", { text: `Hamar sürüşkənin ${F(hh)} m hündürlüyündən cisim başlanğıc sürətsiz buraxılır. Cisim radiusu ${F(R0)} m olan şaquli döngənin ən yuxarı nöqtəsindən keçir. Orada sürəti nə qədərdir? (Döngənin dibini sıfır səviyyəsi götür.)`,
          solution: `Yuxarı nöqtənin hündürlüyü 2R = ${F(2 * R0)} m. mgh = mg·2R + mv²/2 → v² = 2g(h − 2R) = 20·(${F(hh)} − ${F(2 * R0)}) = ${v * v} → v = ${v} m/s.` });
      } },
    { id: "yay", ad: "Yay və enerji", izah: "Yayın enerjisi kx²/2 kinetik və ya potensial enerjiyə çevrilir. Şaquli məsələdə cismin yerdəyişməsi boyu ağırlıq da iş görür.",
      gen() {
        const kind = pick(["ufuqi", "yuxari", "dusen", "dusen", "sur"]);
        if (kind === "ufuqi") {
          let r, m, k, x, v; do { r = pick([100, 400, 900, 1600, 2500, 3600]); m = pick([0.01, 0.02, 0.05, 0.1, 0.2, 0.5]); k = r * m; x = pick([0.01, 0.02, 0.03, 0.05, 0.1]); v = x * Math.sqrt(r); } while (!Number.isInteger(k) || k < 10 || !nice(v, 2));
          return R(v, "m/s", { text: `Sərtliyi ${k} N/m olan üfüqi yayı ${F(x * 100)} sm sıxıb kütləsi ${F(m)} kq olan kürəni atırlar (sürtünmə yoxdur). Kürə yaydan hansı sürətlə ayrılır?`,
            solution: `kx²/2 = mv²/2 → v = x√(k/m) = ${F(x)}·√(${k}/${F(m)}) = ${F(x)}·${Math.sqrt(r)} = ${F(v)} m/s.` });
        }
        if (kind === "yuxari") {
          let k, x, m, hh; do { k = pick([100, 200, 400, 500, 800, 1000, 2000]); x = pick([0.05, 0.1, 0.2]); m = pick([0.1, 0.2, 0.25, 0.4, 0.5, 1]); hh = k * x * x / (2 * m * g); } while (!nice(hh, 2) || hh < 0.2 || hh > 30);
          return R(hh, "m", { text: `Şaquli yaydan (k = ${k} N/m) kütləsi ${F(m)} kq olan kürə yuxarı atılır: yayı ${F(x * 100)} sm sıxıb buraxırlar. Kürə yayın sıxılmış vəziyyətindən hesablanmış hansı maksimal hündürlüyə qalxar? Havanın müqaviməti yoxdur.`,
            solution: `Yayın enerjisi ağırlığa qarşı işə çevrilir: kx²/2 = mgh → h = kx²/(2mg) = ${k}·${F(x * x)}/(2·${F(m)}·10) = ${F(hh)} m.` });
        }
        if (kind === "dusen") {
          let k, m, x, H; do { k = pick([100, 200, 250, 400, 500, 800, 1000, 2000]); m = pick([0.5, 1, 2, 4, 5]); x = pick([0.05, 0.1, 0.15, 0.2, 0.25, 0.3]); H = k * x * x / (2 * m * g) - x; } while (!nice(H, 2) || H <= 0 || H > 5);
          return R(x, "m", { text: `Sərtliyi ${k} N/m olan şaquli yayın yuxarı ucundan ${F(H)} m hündürlükdə ${F(m)} kq cisim dayanıb. Cismi buraxırlar, o yayın üstünə düşür. Yayın maksimal sıxılması neçə metr olar? (Yayın kütləsi yoxdur.)`,
            solution: `Ən aşağı nöqtədə cisim anlıq dayanır. Ağırlığın işi mg(H + x) yayın enerjisinə gedir: mg(H + x) = kx²/2. Yoxlayaq: x = ${F(x)}: ${F(m)}·10·(${F(H)} + ${F(x)}) = ${F(m * g * (H + x))} J, ${k}·${F(x * x)}/2 = ${F(k * x * x / 2)} J — bərabərdir. x = ${F(x)} m.` });
        }
        if (kind === "sur") {
          let k, m, x, hh, v; do { k = pick([200, 400, 500, 800, 1000, 2000]); m = pick([0.1, 0.2, 0.5, 1]); x = pick([0.05, 0.1, 0.2]); hh = pick([0.1, 0.2, 0.5, 1]); const v2 = k * x * x / m - 2 * g * hh; v = v2 > 0 ? Math.sqrt(v2) : 0; } while (v <= 0 || !nice(v, 2));
          return R(v, "m/s", { text: `Şaquli yaydan (k = ${k} N/m) kürə yuxarı atılır: ${F(m)} kq kürə yayı ${F(x * 100)} sm sıxıb buraxılır. Kürə yayın sıxılmış vəziyyətindən ${F(hh)} m yuxarıdan keçəndə sürəti nə qədərdir? Havanın müqaviməti yoxdur.`,
            solution: `kx²/2 = mgh + mv²/2 → v² = kx²/m − 2gh = ${k}·${F(x * x)}/${F(m)} − 20·${F(hh)} = ${F(k * x * x / m)} − ${F(2 * g * hh)} = ${F(v * v)} → v = ${F(v)} m/s.` });
        }
      } },
    { id: "itki", ad: "Sürtünmə və itki", izah: "Sürtünmə varsa mexaniki enerji azalır: itki = istilik = sürtünmənin işi (Q = F_sürt·yol). Qum, qar və ya bərk zəmin də enerjini udur.",
      gen() {
        const kind = pick(["isti", "qum", "qum", "sicrama", "sicramaV", "surt"]);
        if (kind === "isti") {
          let m, hh, v, Q; do { m = pick([1, 2, 3, 5, 10, 20]); hh = pick([2, 3, 5, 8, 10, 12]); v = pick([2, 3, 4, 5, 6, 7, 8]); Q = m * g * hh - m * v * v / 2; } while (Q <= 0 || !nice(Q, 2));
          return R(Q, "J", { text: `Kütləsi ${m} kq olan cisim ${hh} m hündürlükdən kobud sürüşkə ilə başlanğıc sürətsiz enir və aşağıda ${v} m/s sürətlə çıxır. Sürtünmə zamanı neçə coul enerji istiliyə çevrilib?`,
            solution: `Başlanğıcda Ep = mgh = ${m}·10·${hh} = ${m * g * hh} J. Sonda Ek = mv²/2 = ${F(m * v * v / 2)} J. İtki Q = ${m * g * hh} − ${F(m * v * v / 2)} = ${F(Q)} J.` });
        }
        if (kind === "qum") {
          let m, H, d, f; do { m = pick([0.5, 1, 2, 5]); H = pick([1, 1.5, 2, 3, 5]); d = pick([2, 5, 10, 20]); f = m * g * (H + d / 100) / (d / 100); } while (!nice(f, 1));
          return R(f, "N", { text: `Kütləsi ${F(m)} kq olan yük ${F(H)} m hündürlükdən qumun üstünə düşür və qumda ${d} sm batıb dayanır. Qumun orta müqavimət qüvvəsi nə qədərdir? (Yükün yolun sonuna qədər bütün hərəkətini nəzərə al.)`,
            solution: `Ümumi yol H + d = ${F(H + d / 100)} m (ağırlıq bu yolda iş görür). Müqavimət yalnız qumda təsir edir (d = ${F(d / 100)} m). Əvvəl və sonda sürət 0: mg(H + d) − F·d = 0 → F = ${F(m * g)}·${F(H + d / 100)}/${F(d / 100)} = ${F(f)} N.` });
        }
        if (kind === "sicrama") {
          let H, hh; do { H = pick([1, 1.25, 2, 4, 5, 10]); hh = pick([0.25, 0.5, 0.8, 1, 1.25, 2, 3, 4]); } while (hh >= H || !nice((H - hh) / H * 100, 1));
          const p = (H - hh) / H * 100;
          return R(p, "%", { text: `Top ${F(H)} m hündürlükdən yerə düşür və ${F(hh)} m hündürlüyə sıçrayır. İlkin mexaniki enerjisinin neçə faizi itirilib?`,
            solution: `Enerji hündürlüklə mütənasibdir (Ep = mgh, sürət 0 olan nöqtələrdə). İtki (${F(H)} − ${F(hh)})/${F(H)} = ${F(H - hh)}/${F(H)} = ${F(p / 100)} = ${F(p)}%.` });
        }
        if (kind === "sicramaV") {
          let H, hh, v1, v2; do { H = pick([1.8, 3.2, 5, 7.2, 20, 45]); hh = pick([0.2, 0.45, 0.8, 1.25, 1.8, 3.2, 5, 11.25]); v1 = Math.sqrt(20 * H); v2 = Math.sqrt(20 * hh); } while (hh >= H || !Number.isInteger(v1) || !Number.isInteger(v2));
          return R(v1 - v2, "m/s", { text: `Top ${F(H)} m hündürlükdən düşür, yerə çarpır və ${F(hh)} m hündürlüyə sıçrayır. Çarpmadan əvvəl və sonrakı sürətlərin modulları fərqi (v₁ − v₂) nə qədərdir?`,
            solution: `Çarpmadan əvvəl v₁ = √(2gH) = √${20 * H} = ${v1} m/s. Sonra v₂ = √(2gh) = √${20 * hh} = ${v2} m/s. Fərq ${v1} − ${v2} = ${v1 - v2} m/s.` });
        }
        let m, mu, s, Q; do { m = pick([1, 2, 4, 5, 10]); mu = pick([0.1, 0.2, 0.25, 0.4, 0.5]); s = pick([2, 3, 4, 5, 8, 10]); Q = mu * m * g * s; } while (!nice(Q, 2));
        return R(Q, "J", { text: `Kütləsi ${m} kq olan yeşik kobud döşəmədə ${s} m sürüşərək dayanır, sürtünmə əmsalı ${F(mu)} qədərdir. Bu zaman nə qədər mexaniki enerji istiliyə çevrilib?`,
          solution: `Q = sürtünmənin işinin modulu = μmg·s = ${F(mu)}·${m}·10·${s} = ${F(Q)} J.` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let v, L; do { v = pick([2, 3, 4, 5, 6, 8]); L = v * v / 10; } while (!nice(L, 2));
          const hh = L / 2, v2 = v * v;
          task = `Uzunluğu ${F(L)} m olan ipdən asılmış kürə ipin şaquliyə 60° meyl etdiyi vəziyyətdən başlanğıc sürətsiz buraxılır. Ən aşağı nöqtədə sürəti neçə m/s-dir? (cos 60° = 0,5)`;
          steps = [`Başlanğıc hündürlük (ən aşağı nöqtədən): h = L(1 − cos 60°) = ${F(L)}·0,5 = ${F(hh)} m.`, `Enerjinin saxlanması: mgh = mv²/2, buradan v² = 2gh = 20·${F(hh)} = ${v2}.`, `v = √${v2} = ${v} m/s.`];
          const wr = Math.sqrt(20 * L);
          if (bad === 0) steps = [`Başlanğıc hündürlük: h = L = ${F(L)} m (ipin uzunluğu).`, `Enerjinin saxlanması: mgh = mv²/2, buradan v² = 2gh = 20·${F(L)} = ${F(20 * L)}.`, `v = √${F(20 * L)} ≈ ${F(+wr.toFixed(1))} m/s.`];
          if (bad === 1) { const w2 = 10 * hh; steps[1] = `Enerjinin saxlanması: mgh = mv², buradan v² = gh = 10·${F(hh)} = ${F(w2)}.`; steps[2] = `v = √${F(w2)} ≈ ${F(+Math.sqrt(w2).toFixed(1))} m/s.`; }
          if (bad === 2) steps[2] = `v = ${v2}/2 = ${F(v2 / 2)} m/s.`;
          why = [`1-ci addım: kürə ən aşağı nöqtəyə ipin uzunluğu qədər yox, L(1 − cos 60°) = L/2 qədər enir. Düz cavab ${v} m/s.`,
            `2-ci addım: kinetik enerji mv²/2-dir, 1/2 itirilib. Düz: v² = 2gh = ${v2}, v = ${v} m/s.`,
            `3-cü addım: kvadrat kök v²-nin yarısı deyil. √${v2} = ${v} m/s.`][bad];
        } else {
          let m, H, d, f; do { m = pick([0.5, 1, 2, 5]); H = pick([1, 1.5, 2, 3, 5]); d = pick([2, 5, 10, 20]); f = m * g * (H + d / 100) / (d / 100); } while (!nice(f, 1));
          const dm = d / 100;
          task = `Kütləsi ${F(m)} kq olan yük ${F(H)} m hündürlükdən qumun üstünə düşür və qumda ${d} sm batıb dayanır. Qumun orta müqavimət qüvvəsi neçə nyutondur?`;
          steps = [`Ağırlıq bütün H + d = ${F(H + dm)} m yolda iş görür: A₁ = mg(H + d) = ${F(m * g * (H + dm))} J.`, `Müqavimət yalnız qumda (d = ${F(dm)} m) təsir edir: A₂ = −F·d. Əvvəl və sonda sürət 0 olduğundan A₁ + A₂ = 0.`, `F = A₁/d = ${F(m * g * (H + dm))}/${F(dm)} = ${F(f)} N.`];
          if (bad === 0) { const fw = m * g * H / dm; steps[0] = `Ağırlıq H = ${F(H)} m yolda iş görür: A₁ = mgH = ${F(m * g * H)} J.`; steps[2] = `F = A₁/d = ${F(m * g * H)}/${F(dm)} = ${F(fw)} N.`; }
          if (bad === 1) { steps[1] = `Müqavimət bütün yolda (H + d) təsir edir: A₂ = −F(H + d). Əvvəl və sonda sürət 0 olduğundan A₁ + A₂ = 0.`; steps[2] = `F = A₁/(H + d) = ${F(m * g * (H + dm))}/${F(H + dm)} = ${F(m * g)} N.`; }
          if (bad === 2) steps[2] = `F = A₁·d = ${F(m * g * (H + dm))}·${F(dm)} = ${F(+(m * g * (H + dm) * dm).toFixed(4))} N.`;
          why = [`1-ci addım: yük qumda da d qədər enir, ağırlıq bütün H + d yolunda iş görür. Düz cavab ${F(f)} N.`,
            `2-ci addım: qumun müqaviməti yalnız qumun içində, d məsafəsində təsir edir. Düz cavab ${F(f)} N.`,
            `3-cü addım: A₂ = −F·d-dən F = A₁/d (bölmə, vurma yox). Düz cavab ${F(f)} N.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Sürüşkə, velosiped, bungi — enerjinin saxlanması hər yerdədir. Sürtünmə olanda: başlanğıc enerji = son enerji + istilik.",
      gen() {
        const kind = pick(["sur", "ustan", "yox", "bungi", "bungi"]);
        if (kind === "sur") {
          let hh, v; do { hh = pick([2, 3.2, 5, 7.2, 8, 12.8, 20]); v = Math.sqrt(20 * hh); } while (!Number.isInteger(v));
          return R(v, "m/s", { text: `Aqua-parkda su sürüşkəsinin başlanğıcı hovuzun suyundan ${F(hh)} m yuxarıdadır. Sürüşkə o qədər sürüşkəndir ki, sürtünməni nəzərə almamaq olar. Uşaq başlanğıc sürətsiz sürüşəndə suya hansı sürətlə daxil olur?`,
            solution: `mgh = mv²/2 → v = √(2gh) = √(20·${F(hh)}) = √${v * v} = ${v} m/s (≈ ${F(v * 3.6)} km/saat).` });
        }
        if (kind === "ustan") {
          let v, hh; do { v = pick([6, 7, 8, 9, 10]); hh = v * v / 20; } while (!nice(hh, 2));
          return R(hh, "m", { text: `Qısa məsafəyə qaçan tullanan idmançı yerdən ${v} m/s şaquli sürətlə ayrılır. Kütlə mərkəzi maksimum neçə metr qalxır? Havanın müqavimətini nəzərə alma.`,
            solution: `mv²/2 = mgh → h = v²/(2g) = ${v * v}/20 = ${F(hh)} m.` });
        }
        if (kind === "yox") {
          let m, hh, v, L, f; do { m = pick([60, 70, 80, 90]); hh = pick([10, 15, 20, 25, 30]); v = pick([6, 8, 10, 12]); L = pick([100, 150, 200, 250, 300, 400, 500]); f = (m * g * hh - m * v * v / 2) / L; } while (f <= 0 || !nice(f, 1));
          return R(f, "N", { text: `Velosipedçi (velosipedlə birlikdə kütləsi ${m} kq) ${hh} m hündürlüyündəki yoxuşun başından pedalı çevirmədən enir. Yolun uzunluğu ${L} metrdir, aşağıda sürəti ${v} m/s olur. Yol boyu orta müqavimət qüvvəsi nə qədərdir?`,
            solution: `Enerji itkisi = müqavimətin işi: mgh − mv²/2 = ${m * g * hh} − ${F(m * v * v / 2)} = ${F(m * g * hh - m * v * v / 2)} J. F = itki/yol = ${F(m * g * hh - m * v * v / 2)}/${L} = ${F(f)} N.` });
        }
        let m, k, x, L0; do { m = pick([50, 60, 70, 80]); k = pick([100, 200, 250, 300, 400, 500, 600, 800, 1000]); x = rnd(4, 30); L0 = k * x * x / (2 * m * g) - x; } while (!nice(L0, 1) || L0 <= 2 || L0 > 60);
        return R(x, "m", { text: `Bungi tullanışı: kütləsi ${m} kq olan adam ipin bağlandığı nöqtədən sürətsiz tullanır. Dartılmamış ipin uzunluğu ${F(L0)} m, ip yay kimi davranır, sərtliyi ${k} N/m-dir. İpin maksimal uzanması neçə metr olar? (Tullanan nöqtəvi hesab edilir, ipin kütləsi yoxdur.)`,
          solution: `Ən aşağı nöqtədə adam anlıq dayanır. Enmə yolu L₀ + x, ağırlığın işi mg(L₀ + x) ipin enerjisinə keçir: mg(L₀ + x) = kx²/2. Yoxlama: x = ${x}: ${m * g}·(${F(L0)} + ${x}) = ${F(m * g * (L0 + x))} J; ${k}·${x * x}/2 = ${F(k * x * x / 2)} J. x = ${x} m.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a picture, several steps;
  // the wrong options are the answers of typical mistakes. Joined topics: 2, 3 — "Çevrə üzrə hərəkət" (T − mg = mv²/L);
  // 5 — "Sürtünmə, maili müstəvi"; 7 — "Huk qanunu" (k from an F–x graph); 10 — "İş və güc" (P = A/t, FİƏ).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const F4 = x => F(+(+x).toFixed(4));
  const U_ = u => x => F4(x) + " " + u;
  const uniq = (right, pool, n = 4) => pool.filter(x => ok2(x) && F4(x) !== F4(right))
    .filter((x, i, a) => a.findIndex(y => F4(y) === F4(x)) === i).slice(0, n);
  // small SVG kit (DOM nodes, so it works in the game and in tools/oyun-test.js)
  const C = { ink: "var(--ink,#17171a)", acc: "var(--accent,#a32d2d)", mut: "var(--muted,#6b6b73)", vec: "var(--vec,#0c447c)", pap: "var(--paper,#fff)", soft: "var(--accent-soft,#e8eef8)" };
  const r1 = v => +(+v).toFixed(1);
  const Sv = (W, H, aria, kids) => { const s = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": aria }); kids.flat(3).forEach(k => k && s.append(k)); return s; };
  const L_ = (x1, y1, x2, y2, c = C.ink, w = 2, dash) => sv("line", Object.assign({ x1: r1(x1), y1: r1(y1), x2: r1(x2), y2: r1(y2), stroke: c, "stroke-width": w, "stroke-linecap": "round" }, dash ? { "stroke-dasharray": dash } : {}));
  const T_ = (x, y, s, a = "middle", c = C.ink, sz = 13) => sv("text", { x: r1(x), y: r1(y), "text-anchor": a, "font-size": sz, "font-weight": 700, fill: c }, s);
  const P_ = (d, c = C.ink, w = 2, fill = "none") => sv("path", { d, stroke: c, "stroke-width": w, fill, "stroke-linejoin": "round" });
  const head = (x, y, ang, c) => { const a = 0.45, s = 9; return P_(`M${r1(x)} ${r1(y)}L${r1(x - s * Math.cos(ang - a))} ${r1(y - s * Math.sin(ang - a))}L${r1(x - s * Math.cos(ang + a))} ${r1(y - s * Math.sin(ang + a))}Z`, c, 1, c); };
  const Ar = (x1, y1, x2, y2, c = C.acc, w = 2.5) => [L_(x1, y1, x2, y2, c, w), head(x2, y2, Math.atan2(y2 - y1, x2 - x1), c)];
  // two-headed dimension line with a label
  const Dim = (x1, y1, x2, y2, lab, lx, ly, a = "start") => { const ang = Math.atan2(y2 - y1, x2 - x1); return [L_(x1, y1, x2, y2, C.vec, 1.5), head(x2, y2, ang, C.vec), head(x1, y1, ang + Math.PI, C.vec), lab ? T_(lx, ly, lab, a, C.vec) : null]; };
  const ground = (x1, x2, y) => [L_(x1, y, x2, y, C.ink, 2), ...Array.from({ length: Math.floor((x2 - x1) / 14) }, (_, i) => L_(x1 + 8 + i * 14, y + 2, x1 + i * 14, y + 9, C.mut, 1))];
  const spring = (x, yBot, yTop, n = 6, w = 11) => { const st = (yBot - yTop - 10) / n; let d = `M${x} ${yBot}L${x} ${r1(yBot - 5)}`; for (let i = 0; i < n; i++) d += `L${r1(x + (i % 2 ? -w : w))} ${r1(yBot - 5 - st * (i + 0.5))}`; d += `L${x} ${r1(yTop + 5)}L${x} ${yTop}`; return P_(d, C.ink, 1.8); };
  const ball = (x, y, r = 8) => sv("circle", { cx: r1(x), cy: r1(y), r, fill: C.acc });
  const box = (x, y, w, h, lab) => [sv("rect", { x: r1(x), y: r1(y), width: w, height: h, fill: C.pap, stroke: C.ink, "stroke-width": 2 }), lab ? T_(x + w / 2, y + h / 2 + 5, lab) : null];

  // 1. a stone thrown from a balcony in some direction
  function figBalcony(dir, H) { const yG = 170, yB = 50, sx = 92, sy = yB - 9;
    const ang = { yuxari: -Math.PI / 2, ufuqi: 0, bucaq: -Math.PI / 4, asagi: Math.PI / 2 }[dir];
    const ex = sx + 34 * Math.cos(ang), ey = sy + 34 * Math.sin(ang);
    return Sv(260, 190, "Bina, H hündürlükdə balkon, daş v₀ sürətlə atılır", [ground(10, 250, yG), box(20, yB, 50, yG - yB), L_(70, yB, 104, yB, C.ink, 3),
      ball(sx, sy, 7), Ar(sx, sy, ex, ey), T_(ex + (dir === "ufuqi" ? 4 : 8), ey + (dir === "ufuqi" ? -6 : dir === "asagi" ? 0 : 10), "v₀", "start", C.acc),
      Dim(170, yB, 170, yG, "H = " + F(H) + " m", 178, (yB + yG) / 2 + 5)]); }
  // 2. pendulum released at angle α
  function figPend(deg, lab) { const px = 130, py = 16, len = 110, a = deg * Math.PI / 180, bx = px + len * Math.sin(a), by = py + len * Math.cos(a);
    return Sv(260, 150, "Rəqqas: ip şaquliyə α bucağı qədər meyl etdirilib", [L_(px - 45, py, px + 45, py, C.ink, 3), L_(px, py, px, py + len + 12, C.mut, 1.2, "4 3"),
      L_(px, py, bx, by, C.ink, 2), ball(bx, by, 9), sv("circle", { cx: px, cy: py + len, r: 9, fill: "none", stroke: C.mut, "stroke-dasharray": "3 3" }),
      P_(`M${px} ${py + 32}A32 32 0 0 0 ${r1(px + 32 * Math.sin(a))} ${r1(py + 32 * Math.cos(a))}`, C.ink, 1.2), T_(px + 6, py + 52, lab, "start"),
      T_((px + bx) / 2 + 12, (py + by) / 2 + 4, "L", "start")]); }
  // 3. smooth slide into a vertical loop
  function figLoop() { const yG = 175, cx = 195, R = 42, cy = yG - R, top = 30;
    return Sv(260, 190, "Hamar nov: h hündürlükdən buraxılır, radiusu R olan şaquli döngə", [ground(10, 250, yG),
      P_(`M40 ${top}C50 ${top + 120} 110 ${yG} ${cx} ${yG}`, C.ink, 2.5), sv("circle", { cx, cy, r: R, fill: "none", stroke: C.ink, "stroke-width": 2.5 }),
      ball(41, top - 7, 7), L_(cx, cy, cx + R * 0.7071, cy - R * 0.7071, C.vec, 1.5), T_(cx + 8, cy + 6, "R", "start", C.vec),
      sv("circle", { cx, cy: cy - R, r: 3.5, fill: C.acc }), Dim(18, top, 18, yG, "h", 24, (top + yG) / 2)]); }
  // 4. a body above a vertical spring; on the right the spring is compressed by x
  function figDrop() { const yG = 170, x = 60, yTop = 92;
    return Sv(260, 190, "Yayın boş ucundan H hündürlükdə cisim; sağda yay x qədər sıxılıb", [ground(10, 250, yG), spring(x, yG, yTop), box(x - 18, 20, 36, 26, "m"),
      Dim(100, 46, 100, yTop, "H", 106, 74), spring(180, yG, 120), box(162, 94, 36, 26, "m"),
      L_(130, yTop, 220, yTop, C.mut, 1.2, "4 3"), Dim(228, yTop, 228, 120, "x", 234, 111)]); }
  // 6. vertical spring gun
  function figGun() { const yG = 170, x = 70, yFree = 92, yC = 125;
    return Sv(260, 190, "Şaquli yay x qədər sıxılıb, üstündə kürə; H yayın boş ucundan ölçülür", [ground(10, 250, yG), spring(x, yG, yC), L_(x - 16, yC, x + 16, yC, C.ink, 3), ball(x, yC - 9, 9),
      L_(30, yFree, 230, yFree, C.mut, 1.2, "4 3"), T_(236, yFree - 5, "boş uc", "end", C.mut, 11), Dim(110, yFree, 110, yC, "x", 116, 114),
      sv("circle", { cx: 170, cy: 28, r: 9, fill: "none", stroke: C.acc, "stroke-dasharray": "3 3" }), Dim(170, 38, 170, yFree, "H = ?", 176, 70), Ar(x, yC - 24, x, yC - 54)]); }
  // 5 and 9. incline with its height and length
  function figIncline(labH, labL, extra) { const x0 = 30, yG = 160, x1 = 210, yT = 52;
    return Sv(290, 185, "Maili müstəvi: hündürlük və uzunluq", [ground(10, 280, yG), P_(`M${x0} ${yG}L${x1} ${yG}L${x1} ${yT}Z`, C.ink, 2, C.soft),
      Dim(x1 + 16, yT, x1 + 16, yG, labH, x1 + 22, (yT + yG) / 2 + 5), T_((x0 + x1) / 2 - 14, (yT + yG) / 2 - 10, labL, "end", C.vec), extra ? extra(x0, yG, x1, yT) : []]); }
  // 7. F–x graph of a spring: a straight line through the origin and a marked point
  function figFx(x1, F1) { const X = s => 40 + s * 18, Fm = F1 * 10 / x1, Y = f => 160 - f / Fm * 135;
    const k = []; for (let s = 1; s <= 10; s++) k.push(L_(X(s), 160, X(s), 25, C.mut, 0.5), T_(X(s), 176, String(s), "middle", C.mut, 11));
    return Sv(260, 190, "Yayın elastiklik qüvvəsinin deformasiyadan asılılıq qrafiki", [k, L_(40, 160, 235, 160), L_(40, 160, 40, 15), T_(250, 150, "x, sm", "end", C.ink, 12), T_(46, 16, "F, N", "start", C.ink, 12),
      L_(40, 160, X(10), Y(Fm), C.acc, 2.5), L_(40, Y(F1), X(x1), Y(F1), C.vec, 1.2, "4 3"), L_(X(x1), Y(F1), X(x1), 160, C.vec, 1.2, "4 3"),
      sv("circle", { cx: r1(X(x1)), cy: r1(Y(F1)), r: 3.5, fill: C.acc }), T_(34, Y(F1) + 4, F(F1), "end", C.vec, 12)]); }
  // 8. load above sand
  function figSand() { const yS = 140;
    return Sv(260, 190, "Yük H hündürlükdən qumun üstünə düşür və qumda d qədər batır", [sv("rect", { x: 20, y: yS, width: 220, height: 40, fill: C.soft, stroke: C.ink, "stroke-width": 1.5 }), T_(28, 174, "qum", "start", C.mut, 12),
      box(70, 20, 30, 22, "m"), Dim(120, 42, 120, yS, "H", 126, 95), box(160, yS + 10, 30, 22, ""),
      Dim(205, yS, 205, yS + 32, "d", 212, yS + 22), Ar(85, 52, 85, 82, C.mut, 1.5)]); }
  // 10. dam and turbine
  function figDam() { const yT = 50, yB = 160;
    return Sv(260, 190, "Bənd: su v₀ sürətlə axır, h qədər aşağıdakı turbinə düşür", [ground(10, 250, 175), sv("rect", { x: 10, y: yT - 14, width: 76, height: 14, fill: C.soft, stroke: "none" }),
      P_(`M86 ${yT}L100 ${yT}L130 ${yB + 15}L86 ${yB + 15}Z`, C.ink, 2, C.pap), P_(`M100 ${yT - 6}C122 ${yT} 138 ${yT + 50} 152 ${yB - 26}`, C.vec, 3),
      Ar(20, yT - 26, 60, yT - 26, C.acc), T_(40, yT - 32, "v₀", "middle", C.acc), sv("circle", { cx: 160, cy: yB - 12, r: 14, fill: C.pap, stroke: C.ink, "stroke-width": 2 }), T_(160, yB - 7, "T", "middle"),
      L_(104, yT - 7, 232, yT - 7, C.mut, 1.2, "4 3"), Dim(222, yT - 7, 222, yB - 12, "h", 228, (yT + yB) / 2)]); }

  const DIRS = { yuxari: "şaquli yuxarı", ufuqi: "üfüqi istiqamətdə", bucaq: "üfüqə 45° bucaq altında yuxarı", asagi: "şaquli aşağı" };
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. kinetic energy on reaching the ground: does not depend on the direction of the throw
    { tip: "qapali", gen: () => again(() => {
      const m = pick([0.1, 0.2, 0.4, 0.5, 1, 2]), v0 = pick([2, 4, 5, 6, 8, 10]), H = pick([5, 10, 12, 15, 20, 25, 30, 40]), dir = pick(Object.keys(DIRS));
      const Ek0 = m * v0 * v0 / 2, Ep = m * g * H, right = Ek0 + Ep, w = [Ep, Ep - Ek0, 2 * Ek0 + Ep, Ek0];
      if (![right, ...w].every(x => ok2(x))) return null;
      return mc(ae(right, w, U_("J")), { svg: figBalcony(dir, H), text: `Kütləsi ${F(m)} kq olan daşı yerdən ${H} m hündürlükdəki balkondan ${DIRS[dir]} ${v0} m/s sürətlə atırlar. Daş yerə çatanda onun kinetik enerjisi nə qədərdir? Havanın müqaviməti nəzərə alınmır, g = 10 m/s².`,
        solution: `Yalnız ağırlıq iş görür, mexaniki enerji saxlanır (sıfır səviyyəsi — yer): Ek = mv₀²/2 + mgH = ${F4(Ek0)} + ${F4(Ep)} = ${F4(right)} J. Atılma istiqaməti cavabı dəyişmir. Tələlər: v₀-ı unutmaq (${F4(Ep)} J), «yuxarı atılıb, deməli çıxmaq lazımdır» (${F4(Ep - Ek0)} J), mv₀²/2-də 1/2-ni unutmaq (${F4(2 * Ek0 + Ep)} J), hündürlüyü unutmaq (${F4(Ek0)} J).` });
    }) },
    // 2. pendulum: string tension at the lowest point (energy + circular motion)
    { tip: "qapali", birlesik: "fiz-cevre-herekat", gen: () => again(() => {
      const m = pick([0.1, 0.2, 0.5, 1, 2]), c = pick([0.5, 0.6, 0.8]), L = pick([0.5, 0.8, 1, 1.2, 1.6, 2]), mg = m * g, right = mg * (3 - 2 * c);
      const w = uniq(right, [mg, mg * (2 - c), 2 * mg * (1 - c), 3 * mg, mg * (3 - c)]); if (w.length < 4 || !ok2(right)) return null;
      const deg = Math.acos(c) * 180 / Math.PI, ang = c === 0.5 ? "60°" : `α bucağı qədər (cos α = ${F(c)})`, v2 = 2 * g * L * (1 - c);
      return mc(ae(right, w, U_("N")), { svg: figPend(deg, c === 0.5 ? "60°" : "α"), text: `Kütləsi ${F(m)} kq olan kiçik kürə uzunluğu ${F(L)} m olan yüngül, uzanmayan ipdən asılıb. İpi şaquliyə ${ang} meyl etdirib kürəni başlanğıc sürətsiz buraxırlar. Kürə ən aşağı nöqtədən keçəndə ipin dartılma qüvvəsi nə qədərdir? Havanın müqaviməti yoxdur, g = 10 m/s².`,
        solution: `Hündürlük fərqi h = L(1 − cos α) = ${F(L)}·${F4(1 - c)} = ${F4(L * (1 - c))} m; enerji: v² = 2gh = ${F4(v2)} m²/s². Ən aşağı nöqtədə T − mg = mv²/L → T = ${F4(mg)} + ${F(m)}·${F4(v2)}/${F(L)} = ${F4(right)} N, yəni T = mg(3 − 2cos α); L ixtisar olur. Tələlər: T = mg (${F4(mg)} N), h = L götürmək (${F4(3 * mg)} N), mg-ni unutmaq (${F4(2 * mg * (1 - c))} N), v² = gh yazmaq (${F4(mg * (2 - c))} N).` });
    }) },
    // 3. loop: normal force at the top point
    { tip: "qapali", birlesik: "fiz-cevre-herekat", gen: () => again(() => {
      const m = pick([0.1, 0.2, 0.5, 1, 2]), R0 = pick([0.4, 0.5, 0.8, 1, 2]), k = pick([3.5, 4, 4.5, 5]), hh = k * R0, mg = m * g, right = mg * (2 * k - 5);
      const w = [mg * (2 * k - 4), mg * (2 * k - 3), mg * (2 * k - 1), mg * (k - 3)];
      if (![right, ...w].every(x => ok2(x)) || !nice(hh, 2)) return null;
      const v2 = 2 * g * (hh - 2 * R0);
      return mc(ae(right, w, U_("N")), { svg: figLoop(), text: `Kütləsi ${F(m)} kq olan kiçik şayba hamar novun h = ${F(hh)} m hündürlüyündən başlanğıc sürətsiz buraxılır və radiusu R = ${F(R0)} m olan şaquli dairəvi döngəyə daxil olur (h döngənin ən aşağı nöqtəsindən ölçülür). Döngənin ən yuxarı nöqtəsində novun şaybaya göstərdiyi normal reaksiya qüvvəsi nə qədərdir? Sürtünmə yoxdur, g = 10 m/s².`,
        solution: `Yuxarı nöqtə dibdən 2R = ${F4(2 * R0)} m hündürlükdədir: v² = 2g(h − 2R) = 20·${F4(hh - 2 * R0)} = ${F4(v2)} m²/s². Yuxarıda həm N, həm mg mərkəzə (aşağı) yönəlib: N + mg = mv²/R → N = ${F(m)}·${F4(v2)}/${F(R0)} − ${F4(mg)} = ${F4(right)} N. Tələlər: mg-ni nəzərə almamaq (${F4(mg * (2 * k - 4))} N), mg-ni toplamaq (${F4(mg * (2 * k - 3))} N), yuxarı nöqtənin hündürlüyünü unutmaq (${F4(mg * (2 * k - 1))} N), v²-da 2-ni unutmaq (${F4(mg * (k - 3))} N).` });
    }) },
    // 4. a body falls onto a spring: find the stiffness from the maximal compression
    { tip: "qapali", gen: () => again(() => {
      const m = pick([0.5, 1, 2, 4, 5]), H = pick([0.1, 0.15, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1]), x = pick([0.05, 0.1, 0.2, 0.25]), mg = m * g;
      const right = 2 * mg * (H + x) / (x * x), w = [2 * mg * H / (x * x), mg * (H + x) / (x * x), mg / x, 2 * mg * (H + x) / x];
      if (!nice(right, 0) || ![right, ...w].every(y => ok2(y))) return null;
      return mc(ae(right, w, U_("N/m")), { svg: figDrop(), text: `Kütləsi ${F(m)} kq olan cisim yüngül şaquli yayın yuxarı ucundan H = ${F(H)} m hündürlükdən başlanğıc sürətsiz buraxılır. Cisim yayın üstünə düşür; yayın maksimal sıxılması ${F4(x * 100)} sm olur. Yayın sərtliyi nə qədərdir? Havanın müqaviməti və enerji itkisi yoxdur, g = 10 m/s².`,
        solution: `Ən aşağı nöqtədə cisim anlıq dayanır. Cisim H + x = ${F4(H + x)} m enib: mg(H + x) = kx²/2 → k = 2mg(H + x)/x² = 2·${F4(mg)}·${F4(H + x)}/${F4(x * x)} = ${F4(right)} N/m. Tələlər: x-i enmə yoluna qatmamaq (${F4(w[0])} N/m), 1/2-ni unutmaq (${F4(w[1])} N/m), tarazlıqdakı kimi mg = kx yazmaq (${F4(w[2])} N/m), x-i kvadrata yüksəltməmək (${F4(w[3])} N/m).` });
    }) },
    // 5. sliding down a rough incline (friction on an incline)
    { tip: "qapali", birlesik: "fiz-surtunme-maili", gen: () => again(() => {
      const a = pick([0.5, 1, 1.5, 2, 3, 4]), mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]), m = pick([0.5, 1, 2, 4, 5]), mg = m * g, hh = 3 * a, Ll = 5 * a, b = 4 * a;
      const right = mg * (hh - mu * b), w = [mg * hh, mg * (hh - mu * Ll), mg * (hh - mu * hh), mu * mg * b];
      if (![right, ...w].every(x => ok2(x))) return null;
      return mc(ae(right, w, U_("J")), { svg: figIncline("h = " + F(hh) + " m", "L = " + F(Ll) + " m"), text: `Kütləsi ${F(m)} kq olan kiçik cisim maili müstəvinin ən yuxarı nöqtəsindən başlanğıc sürətsiz sürüşür. Müstəvinin hündürlüyü ${F(hh)} m, uzunluğu ${F(Ll)} m-dir. Cisimlə müstəvi arasında sürtünmə əmsalı μ = ${F(mu)}. Müstəvinin aşağı ucunda cismin kinetik enerjisi nə qədərdir? g = 10 m/s².`,
        solution: `Müstəvinin üfüqi proyeksiyası √(L² − h²) = ${F(b)} m, cos α = ${F(b)}/${F(Ll)} = 0,8. Sürtünmə qüvvəsi μmg·cos α; istilik onun işinin moduludur: Q = μmg·cos α·L = μmg·${F(b)} = ${F4(mu * mg * b)} J. Ek = mgh − Q = ${F4(mg * hh)} − ${F4(mu * mg * b)} = ${F4(right)} J. Tələlər: sürtünməni unutmaq (${F4(mg * hh)} J), sürtünmə qüvvəsini μmg yazmaq (${F4(w[1])} J), cos α əvəzinə sin α (${F4(w[2])} J), istiliyi cavab yazmaq (${F4(mu * mg * b)} J).` });
    }) },
    // 6. vertical spring gun: height above the free end of the spring
    { tip: "qapali", gen: () => again(() => {
      const k = pick([100, 200, 400, 500, 800, 1000]), x = pick([0.05, 0.1, 0.2]), m = pick([0.05, 0.1, 0.2, 0.25, 0.5]), E = k * x * x / 2, h0 = E / (m * g);
      const right = h0 - x, w = [h0, 2 * h0 - x, h0 + x, 2 * h0];
      if (![right, ...w].every(y => ok2(y)) || right < 0.2 || right > 20) return null;
      return mc(ae(right, w, U_("m")), { svg: figGun(), text: `Yüngül şaquli yayın üstündə kütləsi ${F(m)} kq olan kürə durur. Yayın sərtliyi ${k} N/m-dir. Yayı kürə ilə birlikdə deformasiya olunmamış vəziyyətdən ${F4(x * 100)} sm sıxıb buraxırlar; kürə şaquli yuxarı atılır. Kürə yayın boş (deformasiya olunmamış) ucundan ən çox nə qədər yuxarı qalxar? Havanın müqaviməti yoxdur, g = 10 m/s².`,
        solution: `Sıfır səviyyəsi — sıxılmış vəziyyət. kx²/2 = mg(x + H) → x + H = ${F4(E)}/${F4(m * g)} = ${F4(h0)} m, H = ${F4(h0)} − ${F4(x)} = ${F4(right)} m. Tələlər: hündürlüyü sıxılmış vəziyyətdən saymaq (${F4(h0)} m), 1/2-ni unutmaq (${F4(w[1])} m), x-i çıxmaq əvəzinə toplamaq (${F4(w[2])} m).` });
    }) },
    // 7. stiffness from an F–x graph (Hooke's law), then spring energy → height on a smooth hill
    { tip: "qapali", birlesik: "fiz-huk", gen: () => again(() => {
      const x1 = pick([2, 4, 5]), k = pick([100, 200, 250, 400, 500, 1000]), F1 = k * x1 / 100, x0 = pick([2, 4, 5, 6, 8, 10]), m = pick([0.02, 0.05, 0.1, 0.2, 0.5]);
      const right = k * (x0 / 100) ** 2 / (2 * m * g), w = [2 * right, 10 * right, 100 * right, right / 2];
      if (!nice(F1, 0) || ![right, ...w].every(y => ok2(y)) || right < 0.05 || right > 20) return null;
      return mc(ae(right, w, U_("m")), { svg: figFx(x1, F1), text: `Qrafikdə yayın elastiklik qüvvəsinin deformasiyadan asılılığı verilib. Bu yayı ${x0} sm sıxıb kütləsi ${F(m)} kq olan kürəni hamar üfüqi səth boyunca atırlar, sonra kürə hamar təpəyə qalxır. Kürə ən çox hansı hündürlüyə qalxar? Yay yüngüldür, sürtünmə və havanın müqaviməti yoxdur, g = 10 m/s².`,
        solution: `Qrafikdən k = F/x = ${F(F1)} N / ${F(x1 / 100)} m = ${k} N/m. kx₀²/2 = mgh → h = kx₀²/(2mg) = ${k}·${F4((x0 / 100) ** 2)}/(2·${F4(m * g)}) = ${F4(right)} m. Tələlər: enerjini F·x kimi (1/2-siz) götürmək (${F4(2 * right)} m), g-ni unutmaq (${F4(10 * right)} m), santimetri metrə çevirməmək (${F4(100 * right)} m), 1/2-ni iki dəfə yazmaq (${F4(right / 2)} m).` });
    }) },
    // 8. a load falls into sand: average resistance force
    { tip: "qapali", gen: () => again(() => {
      const m = pick([0.2, 0.5, 1, 2, 5]), H = pick([0.5, 1, 1.5, 2, 3, 5]), d = pick([2, 4, 5, 10, 20]) / 100, mg = m * g;
      const right = mg * (H + d) / d, w = [mg * H / d, mg, mg * H / d - mg, mg * (H + d * 100) / (d * 100)];
      if (![right, ...w].every(x => ok2(x))) return null;
      return mc(ae(right, w, U_("N")), { svg: figSand(), text: `Kütləsi ${F(m)} kq olan kiçik yük qumun səthindən ${F(H)} m hündürlükdən başlanğıc sürətsiz düşür və qumda ${F4(d * 100)} sm batıb dayanır. Qumun yükə göstərdiyi orta müqavimət qüvvəsi (batma yolu üzrə orta) nə qədərdir? Havanın müqaviməti yoxdur, g = 10 m/s².`,
        solution: `Əvvəl və sonda sürət 0-dır. Ağırlıq bütün H + d = ${F4(H + d)} m yolda iş görür, qum isə yalnız d = ${F4(d)} m-də: mg(H + d) − F·d = 0 → F = ${F4(mg)}·${F4(H + d)}/${F4(d)} = ${F4(right)} N. Tələlər: ağırlığın qumdakı işini unutmaq (${F4(w[0])} N), ağırlığın qumdakı işini mənfi götürmək: mgH − mgd = Fd (${F4(w[2])} N), d-ni santimetrlə yazmaq (${F4(w[3])} N), "yük dayandı, deməli F = mg" (${F4(mg)} N).` });
    }) },
    // 9. a skier on a slope: the average resistance force from the energy loss
    { tip: "qapali", gen: () => again(() => {
      const m = pick([40, 50, 60, 80]), hh = pick([5, 8, 10, 12, 15, 20]), v0 = pick([2, 4, 5, 6]), v = pick([4, 5, 6, 8, 10, 12]), Ll = pick([20, 25, 40, 50, 80, 100, 125, 200]);
      const Q = m * g * hh + m * v0 * v0 / 2 - m * v * v / 2, right = Q / Ll, w = [(m * g * hh - m * v * v / 2) / Ll, Q / hh, (m * g * hh + m * v0 * v0 / 2 + m * v * v / 2) / Ll, Q];
      if (v <= v0 || Ll < 2 * hh || ![Q, right, ...w].every(x => ok2(x, 1))) return null;
      const arrows = (x0, yG, x1, yT) => { const ux = (x1 - x0), uy = (yT - yG), n = Math.hypot(ux, uy), dx = -ux / n, dy = -uy / n;
        return [Ar(x1 - 30, yT + 4 - 18, x1 - 30 + 34 * dx, yT + 4 - 18 + 34 * dy), T_(x1 - 26 + 34 * dx, yT - 22 + 34 * dy, "v₀", "start", C.acc),
          Ar(x0 + 46, yG - 26, x0 + 46 + 30 * dx, yG - 26 + 30 * dy), T_(x0 + 40, yG - 34, "v", "end", C.acc)]; };
      return mc(ae(right, w, U_("N")), { svg: figIncline("h = " + hh + " m", "L = " + Ll + " m", arrows),
        text: `Xizəkçi (xizəklə birlikdə kütləsi ${m} kq) uzunluğu ${Ll} m, hündürlüyü ${hh} m olan yamacın başından ${v0} m/s sürətlə enməyə başlayır. Yamacın aşağısında onun sürəti ${v} m/s olur. Yamac boyu xizəkçiyə təsir edən orta müqavimət qüvvəsi (sürtünmə və hava birlikdə, hərəkətə əks yönəlib, yamac boyunca yol üzrə orta) nə qədərdir? g = 10 m/s².`,
        solution: `Mexaniki enerjinin itkisi müqavimətin işinin moduluna bərabərdir: Q = mgh + mv₀²/2 − mv²/2 = ${m * g * hh} + ${F4(m * v0 * v0 / 2)} − ${F4(m * v * v / 2)} = ${F4(Q)} J. Müqavimət bütün L yolunda təsir edir: F = Q/L = ${F4(Q)}/${Ll} = ${F4(right)} N. Tələlər: başlanğıc sürəti unutmaq (${F4(w[0])} N), L əvəzinə h-a bölmək (${F4(w[1])} N), son Ek-ni toplamaq (${F4(w[2])} N), istiliyi (${F4(Q)} J) qüvvə kimi yazmaq.` });
    }) },
    // 10. hydro power station: P = η·(m/t)·(gh + v₀²/2) (work and power, efficiency)
    { tip: "qapali", birlesik: "fiz-is-guc", gen: () => again(() => {
      const V = pick([2, 5, 10, 20, 50]), hh = pick([10, 20, 25, 40, 50, 80]), v0 = pick([2, 4, 5, 6, 10]), eta = pick([0.5, 0.6, 0.75, 0.8, 0.9]), mt = 1000 * V, e = g * hh + v0 * v0 / 2;
      const kW = x => x / 1000, right = kW(eta * mt * e), w = [kW(eta * mt * g * hh), kW(mt * e), kW(eta * mt * (g * hh + v0 * v0)), kW(mt * e / eta)];
      if (![right, ...w].every(x => ok2(x, 1))) return null;
      return mc(ae(right, w, U_("kW")), { svg: figDam(), text: `Çayın suyu bəndin üstündən ${v0} m/s sürətlə axır və ${hh} m aşağıdakı turbinə düşür. Hər saniyədə turbindən ${V} m³ su keçir (suyun sıxlığı 1000 kq/m³). Stansiya suyun turbinə çatdığı andakı mexaniki enerjisinin ${F(eta * 100)}%-ni elektrik enerjisinə çevirir (FİƏ = ${F(eta * 100)}%). Potensial enerjinin sıfır səviyyəsi turbinin səviyyəsidir. Stansiyanın elektrik gücü nə qədərdir? Suyun turbindən çıxış sürətini və havanın müqavimətini nəzərə alma, g = 10 m/s².`,
        solution: `Hər saniyədə m = ρV = ${mt} kq su keçir. 1 kq suyun turbinə çatanda enerjisi: gh + v₀²/2 = ${g * hh} + ${F4(v0 * v0 / 2)} = ${F4(e)} J. Saniyədə ${mt}·${F4(e)} = ${F4(mt * e)} J; P = η·${F4(mt * e)} W = ${F4(right)} kW. Tələlər: suyun başlanğıc kinetik enerjisini unutmaq (${F4(w[0])} kW), FİƏ-ni unutmaq (${F4(w[1])} kW), v₀²/2-də 1/2-ni unutmaq (${F4(w[2])} kW), FİƏ-yə bölmək (${F4(w[3])} kW).` });
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
      key: "fiz-enerji-saxlanma", title: "Enerjinin saxlanması", fenn: "fizika", link: "dersler/fiz-enerji-saxlanma.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: m/s, m, J, N). Onluq kəsr vergül və ya nöqtə ilə: 0,25. g = 10 m/s², havanın müqaviməti yoxdur (başqa halda məsələdə yazılır).",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["dusme", "dusme", "sarkac", "surusme", "surusme", "yay", "yay", "itki", "itki", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-enerji-saxlanma.html")) b.push("dersler/fiz-enerji-saxlanma.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
