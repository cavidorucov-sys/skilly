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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-enerji-saxlanma", title: "Enerjinin saxlanması", fenn: "fizika", link: "dersler/fiz-enerji-saxlanma.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: m/s, m, J, N). Onluq kəsr vergül və ya nöqtə ilə: 0,25. g = 10 m/s², havanın müqaviməti yoxdur (başqa halda məsələdə yazılır).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["dusme", "dusme", "sarkac", "surusme", "surusme", "yay", "yay", "itki", "itki", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-enerji-saxlanma.html")) b.push("dersler/fiz-enerji-saxlanma.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
