// Olimpiada · Toplama, ikiqat və yarım bucaq düsturları — oyun səviyyələri.
// Hər generator yeni sual qaytarır. `answer` müstəqil ədədi hesabla (Math.sin/tan/...) alınır,
// `show` isə düsturla çıxan dəqiq formadır — harness ikisinin üst-üstə düşdüyünü yoxlayır.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const D = Math.PI / 180;
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(p, q) || 1; p /= g; q /= g; return (p < 0 ? "−" : "") + (q === 1 ? Math.abs(p) : Math.abs(p) + "/" + q); };
  const TR = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
  const legs = () => { const [a, b, c] = pick(TR); return Math.random() < .5 ? [a, b, c] : [b, a, c]; };

  const levels = [
    { id: "cemfark", ad: "Cəm və fərq düsturları", izah: "sin α və sin β verilib (kəskin bucaqlar). Əvvəl cos-ları tap, sonra düsturu işlət. Kəsr kimi yaz (məs. 63/65, −16/65).",
      gen() {
        let a, b;
        do { a = legs(); b = legs(); } while (a[0] === b[0] && a[2] === b[2]);
        const [P1, Q1, C1] = a, [P2, Q2, C2] = b, den = C1 * C2;
        const al = Math.asin(P1 / C1), be = Math.asin(P2 / C2);
        const T = {
          "sin+": { e: "sin(α + β)", f: "sin α·cos β + cos α·sin β", n: P1 * Q2 + Q1 * P2, ex: `${P1}·${Q2} + ${Q1}·${P2}`, v: Math.sin(al + be) },
          "sin-": { e: "sin(α − β)", f: "sin α·cos β − cos α·sin β", n: P1 * Q2 - Q1 * P2, ex: `${P1}·${Q2} − ${Q1}·${P2}`, v: Math.sin(al - be) },
          "cos+": { e: "cos(α + β)", f: "cos α·cos β − sin α·sin β", n: Q1 * Q2 - P1 * P2, ex: `${Q1}·${Q2} − ${P1}·${P2}`, v: Math.cos(al + be) },
          "cos-": { e: "cos(α − β)", f: "cos α·cos β + sin α·sin β", n: Q1 * Q2 + P1 * P2, ex: `${Q1}·${Q2} + ${P1}·${P2}`, v: Math.cos(al - be) },
        };
        const t = T[pick(Object.keys(T))];
        return { text: `α və β kəskin bucaqlardır, sin α = ${P1}/${C1}, sin β = ${P2}/${C2}. ${t.e} = ?`, answer: t.v, show: frac(t.n, den), placeholder: "məs. 63/65",
          solution: `cos α = ${Q1}/${C1}, cos β = ${Q2}/${C2} (sin² + cos² = 1; ${P1}-${Q1}-${C1} və ${P2}-${Q2}-${C2} Pifaqor üçlükləridir). ${t.e} = ${t.f} = (${t.ex})/${den} = ${frac(t.n, den)}.` };
      } },
    { id: "tg", ad: "Tangens cəmi və bucaqların cəmi", izah: "tg(α ± β) = (tg α ± tg β)/(1 ∓ tg α·tg β). Bəzən sual bucaqların cəmini soruşur — dərəcə ilə yaz.",
      gen() {
        const r = Math.random();
        if (r < .3) { // alpha+beta = 45
          let a, b; do { b = rnd(3, 9); a = rnd(1, b - 1); } while (gcd(a, b) !== 1);
          const c = b - a, d = b + a, g = gcd(c, d);
          const al = Math.atan(a / b), be = Math.atan(c / d);
          return { text: `α və β kəskin bucaqlardır, tg α = ${a}/${b}, tg β = ${frac(c, d)}. α + β neçə dərəcədir?`, answer: (al + be) / D, unit: "°", tol: 0.01, show: "45°",
            solution: `tg(α + β) = (${a}/${b} + ${c / g}/${d / g}) / (1 − ${a}/${b}·${c / g}/${d / g}) = ${frac(a * d + b * c, b * d)} / ${frac(b * d - a * c, b * d)} = 1. α + β kəskin bucaqların cəmi olduğundan 0°–180° arasındadır, tg = 1 olan yeganə bucaq 45°-dir.` };
        }
        if (r < .5) { // alpha+beta = 135
          const m = rnd(2, 7), a = m + 1, b = m - 1, g = gcd(a, b);
          const al = Math.atan(m), be = Math.atan(a / b);
          return { text: `α və β kəskin bucaqlardır, tg α = ${m}, tg β = ${frac(a, b)}. α + β neçə dərəcədir?`, answer: (al + be) / D, unit: "°", tol: 0.01, show: "135°",
            solution: `tg(α + β) = (${m} + ${a / g}/${b / g}) / (1 − ${m}·${a / g}/${b / g}) = ${frac(m * b + a, b)} / ${frac(b - m * a, b)} = −1. Hər ikisinin tangensi 1-dən böyükdür, yəni hər biri 45°-dən böyükdür, cəm 90°-dən böyükdür. tg = −1 və bucaq 90°–180° arasındadır → 135°.` };
        }
        let a, b, c, d, num, dn, plus = Math.random() < .5;
        do { a = rnd(1, 7); b = rnd(1, 7); c = rnd(1, 7); d = rnd(1, 7); num = plus ? a * d + b * c : a * d - b * c; dn = plus ? b * d - a * c : b * d + a * c; } while (dn === 0 || num === 0);
        const t1 = a / b, t2 = c / d, v = Math.tan(plus ? Math.atan(t1) + Math.atan(t2) : Math.atan(t1) - Math.atan(t2));
        return { text: `tg α = ${frac(a, b)}, tg β = ${frac(c, d)}. tg(α ${plus ? "+" : "−"} β) = ?`, answer: v, show: frac(num, dn), placeholder: "məs. 17/11",
          solution: `tg(α ${plus ? "+" : "−"} β) = (tg α ${plus ? "+" : "−"} tg β)/(1 ${plus ? "−" : "+"} tg α·tg β) = (${frac(a, b)} ${plus ? "+" : "−"} ${frac(c, d)})/(1 ${plus ? "−" : "+"} ${frac(a * c, b * d)}) = ${frac(num, b * d)} / ${frac(dn, b * d)} = ${frac(num, dn)}.` };
      } },
    { id: "ikiqat", ad: "İkiqat bucaq", izah: "sin 2α = 2 sin α cos α, cos 2α = cos²α − sin²α. Kəsr kimi yaz.",
      gen() {
        const r = Math.random();
        if (r < .4) {
          const [p, q, c] = legs(); if (p === q) return this.gen();
          const al = Math.asin(p / c), f = pick(["sin", "cos", "tg"]);
          const num = f === "sin" ? 2 * p * q : f === "cos" ? q * q - p * p : 2 * p * q, den = f === "tg" ? q * q - p * p : c * c;
          const v = f === "sin" ? Math.sin(2 * al) : f === "cos" ? Math.cos(2 * al) : Math.tan(2 * al);
          const how = f === "sin" ? `2 sin α cos α = 2·${p}/${c}·${q}/${c}` : f === "cos" ? `cos²α − sin²α = ${q * q}/${c * c} − ${p * p}/${c * c}` : `sin 2α / cos 2α = ${frac(2 * p * q, c * c)} / ${frac(q * q - p * p, c * c)}`;
          return { text: `α kəskin bucaqdır və sin α = ${p}/${c}. ${f} 2α = ?`, answer: v, show: frac(num, den), placeholder: "məs. 24/25",
            solution: `cos α = ${q}/${c}. ${f} 2α = ${how} = ${frac(num, den)}.` };
        }
        if (r < .7) {
          const minus = Math.random() < .35;
          let u, v; do { v = rnd(2, 9); u = rnd(1, 12); } while (u / v > 1.4 || u / v < 0.2 || gcd(u, v) !== 1);
          const s = u / v, al = minus ? Math.asin(s / Math.SQRT2) + Math.PI / 4 : Math.asin(s / Math.SQRT2) - Math.PI / 4;
          const num = minus ? v * v - u * u : u * u - v * v;
          return { text: `sin α ${minus ? "−" : "+"} cos α = ${u}/${v}. sin 2α = ?`, answer: Math.sin(2 * al), show: frac(num, v * v), placeholder: "məs. −3/4",
            solution: `Hər iki tərəfi kvadrata yüksəlt: sin²α ${minus ? "−" : "+"} 2 sin α cos α + cos²α = ${u * u}/${v * v}. Soldakı sin² + cos² = 1, 2 sin α cos α = sin 2α. Deməli ${minus ? "1 − sin 2α" : "1 + sin 2α"} = ${u * u}/${v * v}, sin 2α = ${frac(num, v * v)}.` };
        }
        let a, b; do { a = rnd(1, 8); b = rnd(1, 8); } while (gcd(a, b) !== 1 || a === b);
        const t = a / b, al = Math.atan(t), f = pick(["sin", "cos"]);
        const num = f === "sin" ? 2 * a * b : b * b - a * a, den = a * a + b * b;
        return { text: `tg α = ${a}/${b}. ${f} 2α = ?`, answer: f === "sin" ? Math.sin(2 * al) : Math.cos(2 * al), show: frac(num, den), placeholder: "məs. 4/5",
          solution: f === "sin" ? `sin 2α = 2 sin α cos α = 2 tg α·cos²α = 2 tg α/(1 + tg²α) = 2·${a}/${b} / (1 + ${a * a}/${b * b}) = ${frac(num, den)}.`
            : `cos 2α = cos²α − sin²α = (1 − tg²α)/(1 + tg²α) = (1 − ${a * a}/${b * b}) / (1 + ${a * a}/${b * b}) = ${frac(num, den)}.` };
      } },
    { id: "yarim", minVariety: 18, ad: "Yarım bucaq", izah: "cos²(α/2) = (1 + cos α)/2, sin²(α/2) = (1 − cos α)/2. Kök işarəsi: α/2 kəskindirsə müsbət. Cavabı kəsr, ya da √ ilə yaz.",
      gen() {
        if (Math.random() < .55) {
          const [p, q, c] = legs(); if (p === q) return this.gen();
          const th = Math.atan2(q, p), f = pick(["sin", "cos", "tg"]);
          const X = frac(p * p - q * q, c * c);
          const num = f === "sin" ? q : p, den = f === "tg" ? p : c, nn = f === "tg" ? q : num;
          const v = f === "sin" ? Math.sin(th) : f === "cos" ? Math.cos(th) : Math.tan(th);
          const how = f === "sin" ? `sin²(α/2) = (1 − cos α)/2 = (1 − (${X}))/2 = ${frac(q * q, c * c)}`
            : f === "cos" ? `cos²(α/2) = (1 + cos α)/2 = (1 + (${X}))/2 = ${frac(p * p, c * c)}`
              : `sin²(α/2) = ${frac(q * q, c * c)}, cos²(α/2) = ${frac(p * p, c * c)}; tg(α/2) = sin(α/2)/cos(α/2)`;
          return { text: `0° < α < 180° və cos α = ${X}. ${f}(α/2) = ?`, answer: v, show: frac(nn, den), placeholder: "məs. 3/5",
            solution: `${how}. α/2 kəskin bucaqdır (0° < α/2 < 90°), ona görə ${f}(α/2) = ${frac(nn, den)}.` };
        }
        const T = [
          { t: "4·sin²15°", v: 4 * Math.sin(15 * D) ** 2, s: "2 − √3", w: "sin²15° = (1 − cos 30°)/2 = (1 − √3/2)/2 = (2 − √3)/4. Dördə vur." },
          { t: "4·cos²15°", v: 4 * Math.cos(15 * D) ** 2, s: "2 + √3", w: "cos²15° = (1 + cos 30°)/2 = (2 + √3)/4. Dördə vur." },
          { t: "4·sin²(22,5°)", v: 4 * Math.sin(22.5 * D) ** 2, s: "2 − √2", w: "sin²(22,5°) = (1 − cos 45°)/2 = (2 − √2)/4. Dördə vur." },
          { t: "4·cos²(22,5°)", v: 4 * Math.cos(22.5 * D) ** 2, s: "2 + √2", w: "cos²(22,5°) = (1 + cos 45°)/2 = (2 + √2)/4. Dördə vur." },
          { t: "8·sin²75°", v: 8 * Math.sin(75 * D) ** 2, s: "4 + 2√3", w: "sin²75° = (1 − cos 150°)/2 = (1 + √3/2)/2 = (2 + √3)/4. Səkkizə vur: 4 + 2√3." },
          { t: "tg 15°", v: Math.tan(15 * D), s: "2 − √3", w: "tg(α/2) = (1 − cos α)/sin α, α = 30°: (1 − √3/2)/(1/2) = 2 − √3." },
          { t: "tg 75°", v: Math.tan(75 * D), s: "2 + √3", w: "tg(α/2) = (1 − cos α)/sin α, α = 150°: (1 + √3/2)/(1/2) = 2 + √3." },
          { t: "tg(22,5°)", v: Math.tan(22.5 * D), s: "√2 − 1", w: "tg(α/2) = (1 − cos α)/sin α, α = 45°: (1 − √2/2)/(√2/2) = (2 − √2)/√2 = √2 − 1." },
          { t: "tg(67,5°)", v: Math.tan(67.5 * D), s: "√2 + 1", w: "tg(α/2) = (1 − cos α)/sin α, α = 135°: (1 + √2/2)/(√2/2) = (2 + √2)/√2 = √2 + 1." },
        ];
        const it = pick(T);
        return { text: `${it.t} = ?`, answer: it.v, show: it.s, placeholder: "məs. 2 − √3", solution: it.w };
      } },
    { id: "klassik", minVariety: 20, ad: "Klassik olimpiada qiymətləri", izah: "Hasilləri düsturla sadələşdir. sin 18°, cos 20°·cos 40°·cos 80° və (1 + tg a)(1 + tg b) kimi məşhur nümunələr.",
      gen() {
        const r = Math.random();
        if (r < .3) {
          const k = rnd(1, 15);
          return { text: `${k}·cos 20°·cos 40°·cos 80° = ?`, answer: k * Math.cos(20 * D) * Math.cos(40 * D) * Math.cos(80 * D), show: frac(k, 8), placeholder: "məs. 3/8",
            solution: `P = cos 20°·cos 40°·cos 80°. 8 sin 20°·P = 4 sin 40° cos 40° cos 80° = 2 sin 80° cos 80° = sin 160° = sin 20°. Deməli P = 1/8, cavab ${k}/8 = ${frac(k, 8)}.` };
        }
        if (r < .5) {
          const T = [
            { t: "4·sin 18°", v: 4 * Math.sin(18 * D), s: "√5 − 1", w: "x = 18° üçün 2x + 3x = 90°, yəni sin 2x = cos 3x: 2 sin x cos x = 4cos³x − 3 cos x. cos x-ə böl: 2s = 4(1 − s²) − 3, 4s² + 2s − 1 = 0, s = sin 18° = (√5 − 1)/4. Dördə vur." },
            { t: "4·cos 36°", v: 4 * Math.cos(36 * D), s: "1 + √5", w: "cos 36° = 1 − 2 sin²18° = 1 − 2(6 − 2√5)/16 = (1 + √5)/4. Dördə vur." },
            { t: "(4·sin 18°)²", v: (4 * Math.sin(18 * D)) ** 2, s: "6 − 2√5", w: "4 sin 18° = √5 − 1, kvadratı: 5 − 2√5 + 1 = 6 − 2√5." },
          ];
          const it = pick(T);
          return { text: `${it.t} = ?`, answer: it.v, show: it.s, placeholder: "məs. √5 − 1", solution: it.w };
        }
        if (r < .65) {
          const k = pick([4, 8, 12, 16, 20, 2, 6]);
          return { text: `${k}·sin 18°·cos 36° = ?`, answer: k * Math.sin(18 * D) * Math.cos(36 * D), show: frac(k, 4), placeholder: "məs. 3/2",
            solution: `P = sin 18° cos 36°. cos 18°-ə vurub böl: sin 18° cos 18° = ½ sin 36°, sonra ½ sin 36° cos 36° = ¼ sin 72° = ¼ cos 18°. Deməli P = 1/4, cavab ${k}/4 = ${frac(k, 4)}.` };
        }
        const pairs = rnd(1, 2), used = new Set(), parts = [];
        let txt = "", sol = [];
        for (let i = 0; i < pairs; i++) { let a; do { a = rnd(1, 44); } while (used.has(a) || used.has(45 - a)); used.add(a); used.add(45 - a); parts.push(a, 45 - a); }
        const order = parts.slice(); for (let i = order.length - 1; i > 0; i--) { const j = rnd(0, i); [order[i], order[j]] = [order[j], order[i]]; }
        txt = order.map(a => `(1 + tg ${a}°)`).join("");
        let v = 1; for (const a of parts) v *= 1 + Math.tan(a * D);
        return { text: `${txt} = ?`, answer: v, show: String(2 ** pairs), tol: 0.01,
          solution: `Əgər a + b = 45° olsa, tg(a + b) = 1, yəni tg a + tg b = 1 − tg a·tg b. Onda (1 + tg a)(1 + tg b) = 1 + tg a + tg b + tg a·tg b = 2. Burada ${pairs === 1 ? `${parts[0]}° + ${parts[1]}° = 45°, cavab 2` : `${parts[0]}° + ${parts[1]}° = 45° və ${parts[2]}° + ${parts[3]}° = 45°, hər cüt 2 verir: 2·2 = 4`}.` };
      } },
    { id: "heyat", ad: "Həyatdan: baxış bucağı", izah: "Şəkilə, dirəyə və ya reklam lövhəsinə baxış bucağı θ = β − α. tg θ-nı tap, kəsr kimi yaz.",
      gen() {
        if (Math.random() < .5) {
          const d = rnd(1, 8), h1 = rnd(1, 4), h2 = h1 + rnd(1, 5), num = d * (h2 - h1), den = d * d + h1 * h2;
          return { text: `Divardakı şəklin aşağı kənarı sənin göz səviyyəndən ${h1} m, yuxarı kənarı ${h2} m yuxarıdadır. Divardan ${d} m aralıda dayanmısan. Şəklə baxış bucağı θ-dir. tg θ = ?`,
            answer: Math.tan(Math.atan(h2 / d) - Math.atan(h1 / d)), show: frac(num, den), placeholder: "məs. 3/4",
            solution: `Aşağı kənara bucaq α: tg α = ${h1}/${d}. Yuxarı kənara bucaq β: tg β = ${h2}/${d}. θ = β − α, tg θ = (tg β − tg α)/(1 + tg β·tg α) = (${frac(h2, d)} − ${frac(h1, d)}) / (1 + ${frac(h1 * h2, d * d)}) = ${frac(num, d * d)} / ${frac(den, d * d)} = ${frac(num, den)}.` };
        }
        const d = rnd(2, 12), H = rnd(2, 8), f = rnd(1, 4), num = d * f, den = d * d + H * (H + f);
        return { text: `Hündürlüyü ${H} m olan binanın damında hündürlüyü ${f} m olan dirək var. Binadan ${d} m aralıda, göz səviyyəsində dayanıb dirəyə baxırsan (dirəyin aşağı ucu binanın damındadır). Dirəyi gördüyün bucaq θ-dir. tg θ = ?`,
          answer: Math.tan(Math.atan((H + f) / d) - Math.atan(H / d)), show: frac(num, den), placeholder: "məs. 4/25",
          solution: `Damın hündürlüyünə bucaq α: tg α = ${H}/${d}. Dirəyin ucuna bucaq β: tg β = ${H + f}/${d}. tg θ = tg(β − α) = (${frac(H + f, d)} − ${frac(H, d)}) / (1 + ${frac(H * (H + f), d * d)}) = ${frac(num, d * d)} / ${frac(den, d * d)} = ${frac(num, den)}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "cos 2α-nı tapan üç addımlı həll. Birində səhv var. Hansında?",
      gen() {
        const [p, q, c] = legs(), good = frac(c * c - 2 * p * p, c * c);
        const fr = n => `cos 2α = ${n}/${c * c}` + (frac(n, c * c) === `${n}/${c * c}` ? "" : ` = ${frac(n, c * c)}`);
        const steps = [
          `cos 2α = 1 − 2 sin²α`,
          `sin α = ${p}/${c}, ona görə cos 2α = 1 − 2·(${p}/${c})² = 1 − ${2 * p * p}/${c * c}`,
          fr(c * c - 2 * p * p),
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `cos 2α = 1 − 2 sin α`;
        if (bad === 1) steps[1] = `sin α = ${p}/${c}, ona görə cos 2α = 1 − (2·${p}/${c})² = 1 − ${4 * p * p}/${c * c}`;
        if (bad === 2) steps[2] = fr(c * c - p * p);
        const text = h("div", {}, h("p", {}, `Məsələ: sin α = ${p}/${c}. cos 2α = ?`), h("ol", { class: "oy-steps" }, ...steps.map(s => h("li", {}, s))));
        const why = ["1-ci addımda düstur səhvdir: sin α kvadratda olmalıdır, cos 2α = 1 − 2 sin²α.", "2-ci addımda səhv var: kvadrat yalnız sin α-nındır, 2-nin yox: 2·(sin α)² = 2·" + p * p + "/" + c * c + ".", `3-cü addımda hesab səhvdir: ${c * c} − 2·${p * p} = ${c * c - 2 * p * p}, cavab ${good}.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci", "2-ci", "3-cü"][bad] + " addım", solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-trig-dusturlar", title: "Toplama, ikiqat və yarım bucaq düsturları", fenn: "olimpiada", link: "dersler/ol-trig-dusturlar.html",
      format: "Cavab ədəddir: kəsr 63/65, mənfi −7/25, kök √2 − 1 və ya 2 + √3, bucaq üçün dərəcə 45.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["cemfark", "cemfark", "tg", "ikiqat", "ikiqat", "yarim", "yarim", "klassik", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-trig-dusturlar.html")) b.push("dersler/ol-trig-dusturlar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
