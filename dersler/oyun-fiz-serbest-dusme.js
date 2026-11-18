// Fizika · Sərbəst düşmə — mastery game levels (drop from rest, throw up, throw down / from a tower, last second, two bodies) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s², no air resistance.
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

  // tower of height H (label), optional initial velocity arrow: dir = "up" | "down" | null
  function tower(H, dir) {
    const s = sv("svg", { viewBox: "0 0 260 190", class: "oy-svg", role: "img", "aria-label": "Hündürlükdən atılan cisim" });
    s.append(sv("rect", { x: 40, y: 40, width: 56, height: 125, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 1.5 }));
    s.append(sv("line", { x1: 10, y1: 165, x2: 250, y2: 165, stroke: "var(--ink)", "stroke-width": 1.8 }));
    s.append(sv("circle", { cx: 110, cy: 40, r: 6, fill: "var(--vec)" }));
    s.append(sv("line", { x1: 128, y1: 40, x2: 128, y2: 165, stroke: "var(--muted)", "stroke-width": 1.5, "stroke-dasharray": "4 3" }));
    s.append(sv("text", { x: 136, y: 108, class: "oy-lbl" }, "H = " + F(H) + " m"));
    if (dir) {
      const y1 = dir === "up" ? 32 : 48, y2 = dir === "up" ? 8 : 74;
      s.append(sv("line", { x1: 110, y1, x2: 110, y2, stroke: "var(--accent)", "stroke-width": 3 }));
      s.append(sv("polygon", { points: dir === "up" ? "110,4 104,14 116,14" : "110,78 104,68 116,68", fill: "var(--accent)" }));
      s.append(sv("text", { x: 122, y: dir === "up" ? 22 : 66, class: "oy-lbl" }, "v₀"));
    }
    return s;
  }
  // two bodies: A dropped from height H, B thrown up from the ground
  function meetPic(H, v0) {
    const s = sv("svg", { viewBox: "0 0 260 190", class: "oy-svg", role: "img", "aria-label": "Üstdən buraxılan və yerdən atılan cisim" });
    s.append(sv("line", { x1: 10, y1: 170, x2: 250, y2: 170, stroke: "var(--ink)", "stroke-width": 1.8 }));
    s.append(sv("line", { x1: 90, y1: 20, x2: 90, y2: 170, stroke: "var(--muted)", "stroke-width": 1.5, "stroke-dasharray": "4 3" }));
    s.append(sv("circle", { cx: 90, cy: 20, r: 6, fill: "var(--accent)" })); s.append(sv("text", { x: 70, y: 24, class: "oy-lbl" }, "A"));
    s.append(sv("polygon", { points: "90,56 84,44 96,44", fill: "var(--accent)" }));
    s.append(sv("circle", { cx: 90, cy: 164, r: 6, fill: "var(--vec)" })); s.append(sv("text", { x: 102, y: 168, class: "oy-lbl" }, "B"));
    s.append(sv("line", { x1: 90, y1: 150, x2: 90, y2: 120, stroke: "var(--vec)", "stroke-width": 3 })); s.append(sv("polygon", { points: "90,114 84,126 96,126", fill: "var(--vec)" }));
    s.append(sv("text", { x: 102, y: 128, class: "oy-lbl" }, "v₀ = " + v0 + " m/s"));
    s.append(sv("text", { x: 102, y: 84, class: "oy-lbl" }, "H = " + H + " m"));
    return s;
  }

  const levels = [
    { id: "dusme", ad: "Sükunətdən düşmə", izah: "h = gt²/2, v = gt, v² = 2gh (g = 10). Ardıcıl saniyələrdə yollar 1 : 3 : 5 : 7 …",
      gen() {
        const kind = pick(["h", "t", "v", "vh", "hv", "nci"]);
        const ts = [1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8];
        const t = pick(ts), H = 5 * t * t;
        if (kind === "h") return R(H, "m", { text: `Cisim sükunətdən sərbəst düşür. ${F(t)} s-də hansı hündürlükdən düşər?`, solution: `h = gt²/2 = 10·${F(t * t)}/2 = ${F(H)} m.` });
        if (kind === "t") return R(t, "s", { text: `Cisim sükunətdən ${F(H)} m hündürlükdən sərbəst düşür. Düşmə vaxtı nə qədərdir?`, solution: `h = gt²/2 → t² = 2h/g = ${F(2 * H)}/10 = ${F(t * t)} → t = ${F(t)} s.` });
        if (kind === "v") return R(10 * t, "m/s", { text: `Cisim sükunətdən sərbəst düşür. ${F(t)} s-dən sonra sürəti nə qədərdir?`, solution: `v = gt = 10·${F(t)} = ${F(10 * t)} m/s.` });
        if (kind === "vh") return R(10 * t, "m/s", { text: `Cisim sükunətdən ${F(H)} m hündürlükdən düşür. Yerə dəyəndə sürəti nə qədərdir?`, solution: `Vaxt lazım deyil: v² = 2gh = 20·${F(H)} = ${F(20 * H)} → v = ${F(10 * t)} m/s.` });
        if (kind === "hv") return R(H, "m", { text: `Cisim sükunətdən sərbəst düşür və yerə ${F(10 * t)} m/s sürətlə dəyir. Hansı hündürlükdən düşüb?`, solution: `v² = 2gh → h = v²/(2g) = ${F(100 * t * t)}/20 = ${F(H)} m.` });
        const n = rnd(2, 8), s1 = 5, sn = s1 * (2 * n - 1);
        return R(sn, "m", { text: `Sükunətdən düşən cisim ilk saniyədə ${s1} m yol gedir. ${n}-ci saniyədə nə qədər yol gedəcək?`, solution: `Sükunətdən ardıcıl saniyələrdə yollar 1 : 3 : 5 : 7 … nisbətindədir. ${n}-ci saniyədə: ${s1}·(2·${n} − 1) = ${s1}·${2 * n - 1} = ${sn} m. (Yoxla: 5·${n * n} − 5·${(n - 1) ** 2} = ${sn}.)` });
      } },
    { id: "yuxari", ad: "Şaquli yuxarı atılma", izah: "v = v₀ − gt, h = v₀t − gt²/2. Qalxma vaxtı v₀/g, hündürlük v₀²/(2g), eyni səviyyədə sürət modulu eynidir.",
      gen() {
        const kind = pick(["H", "tup", "T", "ht", "vt", "iki", "iki", "vh", "v0"]);
        const v0 = pick([10, 15, 20, 25, 30, 35, 40]);
        if (kind === "H") return R(v0 * v0 / 20, "m", { text: `Daş ${v0} m/s sürətlə şaquli yuxarı atılıb. Qalxdığı ən böyük hündürlük nə qədərdir?`, solution: `Ən yuxarıda v = 0: 0 − v₀² = −2gh → h = v₀²/(2g) = ${v0 * v0}/20 = ${F(v0 * v0 / 20)} m.` });
        if (kind === "tup") return R(v0 / 10, "s", { text: `Daş ${v0} m/s sürətlə şaquli yuxarı atılıb. Neçə saniyədən sonra ən yüksək nöqtəyə çatır?`, solution: `Ən yuxarıda v = 0: 0 = v₀ − gt → t = v₀/g = ${v0}/10 = ${F(v0 / 10)} s.` });
        if (kind === "T") return R(v0 / 5, "s", { text: `Daş ${v0} m/s sürətlə şaquli yuxarı atılıb. Atıldığı nöqtəyə qayıtmaq üçün nə qədər vaxt lazımdır?`, solution: `Qalxma vaxtı v₀/g = ${F(v0 / 10)} s, enmə vaxtı da eynidir. Cəmi 2v₀/g = ${F(v0 / 5)} s.` });
        if (kind === "ht") { const T = v0 / 5, t = pick([0.5, 1, 1.5, 2, 2.5, 3]); if (t > T) return this.gen(); const hh = v0 * t - 5 * t * t;
          return R(hh, "m", { text: `Daş ${v0} m/s sürətlə şaquli yuxarı atılıb. ${F(t)} s-dən sonra atıldığı nöqtədən yuxarıda hansı hündürlükdədir?`, solution: `h = v₀t − gt²/2 = ${v0}·${F(t)} − 5·${F(t * t)} = ${F(v0 * t)} − ${F(5 * t * t)} = ${F(hh)} m.` }); }
        if (kind === "vt") { const t = rnd(1, Math.floor(v0 / 5) + 1), v = v0 - 10 * t;
          return R(v, "m/s", { text: `Daş ${v0} m/s sürətlə şaquli yuxarı atılıb. Ox yuxarı yönəlib; daş atıldığı səviyyədən sonra da uçur, aşağıda maneə yoxdur. ${t} s-dən sonra sürətin proyeksiyasını tap.`, solution: `vₓ = v₀ − gt = ${v0} − 10·${t} = ${F(v)} m/s. ${v < 0 ? "Mənfi — daş artıq düşür." : v === 0 ? "Daş ən yuxarı nöqtədədir." : "Müsbət — daş hələ qalxır."}` }); }
        if (kind === "iki") {
          const t1 = pick([0.5, 1, 1.5, 2, 2.5, 3]), t2 = t1 + pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), V0 = 5 * (t1 + t2), hh = 5 * t1 * t2;
          if (!nice(hh, 2) || V0 > 60) return this.gen();
          const first = Math.random() < .5;
          return R(first ? t1 : t2, "s", { text: `Daş ${F(V0)} m/s sürətlə şaquli yuxarı atılıb. Atıldığı nöqtədən ${F(hh)} m yuxarıda daş neçə saniyə sonra ${first ? "ilk dəfə (qalxarkən)" : "ikinci dəfə (düşərkən)"} olacaq?`,
            solution: `${F(hh)} = ${F(V0)}t − 5t² → 5t² − ${F(V0)}t + ${F(hh)} = 0 → t² − ${F(V0 / 5)}t + ${F(hh / 5)} = 0. Viyet: t₁ + t₂ = ${F(V0 / 5)}, t₁t₂ = ${F(hh / 5)} → t₁ = ${F(t1)}, t₂ = ${F(t2)}. ${first ? "Qalxarkən — kiçik kök" : "Düşərkən — böyük kök"}: ${F(first ? t1 : t2)} s.` });
        }
        if (kind === "vh") {
          const vs = [0, 5, 10, 15, 20, 25, 30, 35].filter(x => x < v0), v = pick(vs), hh = (v0 * v0 - v * v) / 20;
          if (!nice(hh, 2) || hh <= 0) return this.gen();
          return R(v, "m/s", { text: `Daş ${v0} m/s sürətlə şaquli yuxarı atılıb. Atıldığı nöqtədən ${F(hh)} m yuxarıda sürətinin modulu nə qədərdir?`, solution: `v² = v₀² − 2gh = ${v0 * v0} − 20·${F(hh)} = ${F(v * v)} → v = ${F(v)} m/s. (Düşərkən həmin hündürlükdə də sürət modulu eynidir.)` });
        }
        return R(v0, "m/s", { text: `Daş şaquli yuxarı atılıb və ən yuxarıda ${F(v0 * v0 / 20)} m hündürlüyə qalxıb. Atılma sürəti nə qədər olub?`, solution: `h = v₀²/(2g) → v₀² = 2gh = 20·${F(v0 * v0 / 20)} = ${v0 * v0} → v₀ = ${v0} m/s.` });
      } },
    { id: "asagi", ad: "Hündürlükdən atılma", izah: "Ox seç: aşağı və ya yuxarı. Düşmədə h = v₀t + gt²/2; yuxarı atılanda yerə düşənə qədər −H = v₀t − gt²/2 (kvadrat tənlik, müsbət kök). Yerə dəyəndə sürət: v² = v₀² + 2gH.",
      gen() {
        const kind = pick(["H", "v", "t", "up", "up", "upv", "eyni"]);
        if (kind === "H" || kind === "v" || kind === "t") {
          const t = rnd(1, 6), v0 = rnd(1, 8) * 5, H = v0 * t + 5 * t * t;
          if (kind === "H") return R(H, "m", { svg: tower(H, "down"), text: `Daş qüllənin başından şaquli aşağı ${v0} m/s sürətlə atıldı və ${t} s-dən sonra yerə düşdü. Qüllənin hündürlüyü nə qədərdir?`, solution: `Aşağı yönəlmiş ox: H = v₀t + gt²/2 = ${v0}·${t} + 5·${t * t} = ${v0 * t} + ${5 * t * t} = ${H} m.` });
          if (kind === "v") return R(v0 + 10 * t, "m/s", { svg: tower(H, "down"), text: `Daş ${H} m hündürlükdən şaquli aşağı ${v0} m/s sürətlə atıldı. Yerə dəyəndə sürəti nə qədərdir?`, solution: `Vaxtı tapa bilərik: ${H} = ${v0}t + 5t² → t = ${t} s. v = v₀ + gt = ${v0} + 10·${t} = ${v0 + 10 * t} m/s. Yoxlama: v² = v₀² + 2gH = ${v0 * v0} + ${20 * H} = ${(v0 + 10 * t) ** 2}.` });
          return R(t, "s", { svg: tower(H, "down"), text: `Daş ${H} m hündürlükdən şaquli aşağı ${v0} m/s sürətlə atıldı. Neçə saniyəyə yerə düşər?`, solution: `${H} = ${v0}t + 5t² → 5t² + ${v0}t − ${H} = 0 → t² + ${v0 / 5}t − ${H / 5} = 0. Kökləri: t = ${t} və t = ${F(-(v0 / 5 + t))}. Vaxt mənfi olmur → t = ${t} s.` });
        }
        const t = rnd(2, 8), s = rnd(1, t - 1), v0 = 5 * (t - s), H = 5 * t * s;
        if (kind === "up") return R(t, "s", { svg: tower(H, "up"), text: `Daş ${H} m hündürlükdəki qüllənin başından şaquli yuxarı ${v0} m/s sürətlə atıldı. O, neçə saniyəyə yerə düşər? (Daş qülləyə dəymir.)`, solution: `Ox yuxarıdır. Yer: 0 = ${H} + ${v0}t − 5t² → t² − ${v0 / 5}t − ${H / 5} = 0. Viyet: t₁ + t₂ = ${v0 / 5}, t₁t₂ = ${F(-H / 5)} → t = ${t} və t = ${F(-s)}. Mənfi kök atılır: ${t} s.` });
        if (kind === "upv") return R(5 * (t + s), "m/s", { svg: tower(H, "up"), text: `Daş ${H} m hündürlükdəki qüllənin başından şaquli yuxarı ${v0} m/s sürətlə atıldı. Yerə dəyəndə sürətinin modulu nə qədərdir?`, solution: `Enerji/kinematika: v² = v₀² + 2gH (qalxıb-enmə sürət modulunu dəyişmir). v² = ${v0 * v0} + 20·${H} = ${v0 * v0 + 20 * H} → v = ${5 * (t + s)} m/s.` });
        return R(5 * (t + s), "m/s", { svg: tower(H, null), text: `${H} m hündürlükdən biri şaquli yuxarı, o biri şaquli aşağı eyni ${v0} m/s sürətlə iki daş atıldı. Aşağı atılan daş yerə dəyəndə sürəti nə qədərdir? (Yuxarı atılanınki ilə müqayisə et.)`, solution: `v² = v₀² + 2gH = ${v0 * v0} + 20·${H} = ${v0 * v0 + 20 * H} → v = ${5 * (t + s)} m/s. Yuxarı atılan daşın da yerə dəymə sürəti eynidir — vaxtlar fərqlidir, sürətlər eyni.` });
      } },
    { id: "son", ad: "Son saniyə, hissələr", izah: "Son saniyədəki yol = bütün yol − (T − 1) saniyədəki yol. Əvvəlcə T-ni tap.",
      gen() {
        const kind = pick(["Hs", "Sh", "dt", "dt", "n"]);
        const T = pick([2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7, 8]), H = 5 * T * T, S = 10 * T - 5;
        if (kind === "Hs") return R(H, "m", { text: `Sükunətdən düşən cisim hərəkətinin son saniyəsində ${F(S)} m yol getdi. Cisim hansı hündürlükdən düşüb?`, solution: `Son saniyə: 5T² − 5(T − 1)² = 10T − 5 = ${F(S)} → T = ${F(T)} s. H = 5T² = 5·${F(T * T)} = ${F(H)} m.` });
        if (kind === "Sh") return R(S, "m", { text: `Cisim ${F(H)} m hündürlükdən sərbəst düşür. Son saniyədə neçə metr yol gedir?`, solution: `T = √(2H/g) = √${F(H / 5)} = ${F(T)} s. İlk ${F(T - 1)} s-də: 5·${F((T - 1) ** 2)} = ${F(5 * (T - 1) ** 2)} m. Son saniyədə: ${F(H)} − ${F(5 * (T - 1) ** 2)} = ${F(S)} m.` });
        if (kind === "n") { const n = Math.floor(T) , sn = 5 * (2 * n - 1); return R(sn, "m", { text: `Cisim sükunətdən sərbəst düşür. ${n}-ci saniyədə nə qədər yol gedər?`, solution: `s(${n}) − s(${n - 1}) = 5·${n * n} − 5·${(n - 1) ** 2} = ${5 * n * n} − ${5 * (n - 1) ** 2} = ${sn} m.` }); }
        for (let i = 0; i < 100; i++) {
          const T2 = pick([2, 3, 4, 5, 6, 8]), Tp = T2 - pick([0.5, 1, 1.5, 2]);
          if (Tp <= 0) continue;
          const Hh = 5 * T2 * T2, d = 5 * (T2 * T2 - Tp * Tp);
          if (!nice(d, 2)) continue;
          return R(T2 - Tp, "s", { text: `Cisim ${F(Hh)} m hündürlükdən sükunətdən düşür. Yolun son ${F(d)} m-ini o, nə qədər vaxta gedir?`, solution: `Yolun əvvəlki ${F(Hh - d)} m-ini düşmə vaxtı: t = √(2·${F(Hh - d)}/10) = ${F(Tp)} s. Bütün düşmə vaxtı: √(2·${F(Hh)}/10) = ${F(T2)} s. Fərq: ${F(T2)} − ${F(Tp)} = ${F(T2 - Tp)} s.` });
        }
        return this.gen();
      } },
    { id: "iki", ad: "İki cisim", izah: "Hər ikisi sərbəst düşürsə, nisbi təcil sıfırdır — biri o birinə görə bərabərsürətli hərəkət edir. Görüş: yollar/koordinatlar bərabər.",
      gen() {
        const kind = pick(["fark", "fark", "gec", "gor", "gor"]);
        if (kind === "fark") {
          const tau = pick([1, 2, 3]), t = tau + rnd(1, 4), D = 5 * tau * (2 * t - tau);
          return R(D, "m", { text: `Eyni nöqtədən iki daş ${tau} s fasilə ilə sükunətdən buraxıldı. Birinci daşın buraxılmasından ${t} s sonra daşlar arasındakı məsafə nə qədərdir?`, solution: `h₁ = 5·${t * t} = ${5 * t * t} m, h₂ = 5·(${t} − ${tau})² = ${5 * (t - tau) ** 2} m. Fərq: ${D} m. (Qısa: Δ = gτ(t − τ/2) = 10·${tau}·${F(t - tau / 2)}.)` });
        }
        if (kind === "gec") {
          const tau = pick([1, 2, 3]), t = tau + rnd(1, 4), D = 5 * tau * (2 * t - tau);
          return R(10 * tau, "m/s", { text: `Eyni nöqtədən iki daş ${tau} s fasilə ilə sükunətdən buraxıldı. İkisi də havadadırsa, birinci daşın ikinciyə görə sürəti nə qədərdir?`, solution: `v₁ = gt, v₂ = g(t − ${tau}). Fərq: v₁ − v₂ = gτ = 10·${tau} = ${10 * tau} m/s — zamandan asılı deyil. (Ona görə məsafə bərabərsürətli artır.)` });
        }
        for (let i = 0; i < 200; i++) {
          const t = pick([1, 1.5, 2, 2.5, 3]), v0 = pick([10, 15, 20, 25, 30, 35, 40]), H = v0 * t, y = v0 * t - 5 * t * t;
          if (y <= 0 || !nice(H, 2) || !nice(y, 2)) continue;
          const w = pick(["t", "y"]);
          const base = `Eyni anda A cismi ${F(H)} m hündürlükdən sükunətdən buraxılır, B cismi yerdən (A-nın düz altından) şaquli yuxarı ${v0} m/s sürətlə atılır.`;
          return w === "t" ? R(t, "s", { svg: meetPic(F(H), v0), text: base + " Neçə saniyədən sonra görüşəcəklər?", solution: `A-nın koordinatı: ${F(H)} − 5t², B-nin: ${v0}t − 5t². Bərabərdir: ${F(H)} = ${v0}t → t = ${F(t)} s. (Nisbi sürət ${v0} m/s-dir, g ixtisar olunur.)` })
            : R(y, "m", { svg: meetPic(F(H), v0), text: base + " Görüş yerdən neçə metr hündürlükdə baş verəcək?", solution: `Görüş anı: ${F(H)} = ${v0}t → t = ${F(t)} s. B-nin hündürlüyü: ${v0}·${F(t)} − 5·${F(t * t)} = ${F(v0 * t)} − ${F(5 * t * t)} = ${F(y)} m.` });
        }
        return this.gen();
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          const tup = rnd(1, 4), v0 = 10 * tup, extra = rnd(1, tup), t = tup + extra, H = v0 * v0 / 20, fall = 5 * extra * extra, path = H + fall;
          task = `Daş ${v0} m/s sürətlə şaquli yuxarı atılıb. Atılmadan ${t} s sonra daşın getdiyi yol nə qədərdir?`;
          const Hw = v0 * v0 / 10;
          steps = [
            bad === 0 ? `Qalxma vaxtı v₀/g = ${tup} s. Qalxma hündürlüyü H = v₀²/g = ${v0 * v0}/10 = ${F(Hw)} m.` : `Qalxma vaxtı v₀/g = ${tup} s. Qalxma hündürlüyü H = v₀²/(2g) = ${v0 * v0}/20 = ${F(H)} m.`,
            bad === 1 ? `Sonra daş ${extra} s düşür: h = g·t² = 10·${extra * extra} = ${10 * extra * extra} m.` : `Sonra daş ${extra} s düşür: h = gt²/2 = 5·${extra * extra} = ${fall} m.`,
            bad === 2 ? `Yol = H − h = ${F(H)} − ${fall} = ${F(H - fall)} m.` : `Yol = H + h = ${F(bad === 0 ? Hw + fall : bad === 1 ? H + 10 * extra * extra : path)} m.`,
          ];
          why = [`1-ci addım: ən yuxarı hündürlük v₀²/(2g) = ${F(H)} m (2-yə bölmə unudulub). Düz yol: ${F(H)} + ${fall} = ${F(path)} m.`,
            `2-ci addım: sükunətdən düşmə yolu gt²/2-dir, g·t² deyil: ${fall} m. Düz yol ${F(path)} m.`,
            `3-cü addım: cisim dönüb düşdükdən sonra yol toplanır: yol = ${F(H)} + ${fall} = ${F(path)} m (${F(H - fall)} m yerdəyişmədir).`][bad];
        } else {
          const tau = rnd(1, 3), t = tau + rnd(2, 4), h1 = 5 * t * t, h2 = 5 * (t - tau) ** 2, D = h1 - h2;
          task = `Eyni nöqtədən iki daş ${tau} s fasilə ilə sükunətdən buraxıldı. Birincidən ${t} s sonra aralarındakı məsafə nə qədərdir?`;
          const h1w = 10 * t * t, Dw = h1w - h2;
          steps = [
            bad === 0 ? `Birinci daş ${t} s düşüb: h₁ = g·t² = 10·${t * t} = ${h1w} m.` : `Birinci daş ${t} s düşüb: h₁ = gt²/2 = 5·${t * t} = ${h1} m.`,
            bad === 1 ? `İkinci daş ${t - tau} s düşüb: h₂ = 5t² − 5τ² = ${5 * t * t} − ${5 * tau * tau} = ${5 * t * t - 5 * tau * tau} m.` : `İkinci daş ${t - tau} s düşüb: h₂ = 5·(${t} − ${tau})² = ${h2} m.`,
            bad === 2 ? `Məsafə sabitdir: Δ = h(τ) = 5·${tau * tau} = ${5 * tau * tau} m.` : `Məsafə: Δ = h₁ − h₂ = ${F(bad === 0 ? Dw : bad === 1 ? h1 - (5 * t * t - 5 * tau * tau) : D)} m.`,
          ];
          why = [`1-ci addım: sükunətdən düşmə yolu gt²/2-dir, g·t² deyil: h₁ = ${h1} m. Düz Δ = ${D} m.`,
            `2-ci addım: (a − b)² ≠ a² − b²: 5(t − τ)² = ${h2} m. Düz Δ = ${D} m.`,
            `3-cü addım: məsafə sabit deyil — o, zamanla artır (sürət fərqi gτ sabitdir, məsafə yox). Düz Δ = ${D} m.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Quyu, tramplin, ovçu topu, basketbolçunun tullanması — hamısı sərbəst düşmədir. Hava müqaviməti nəzərə alınmır.",
      gen() {
        const kind = pick(["quyu", "tramplin", "top", "tullanma", "cekic"]);
        if (kind === "quyu") { const T = pick([1, 1.5, 2, 2.5, 3, 4]); return R(5 * T * T, "m", { text: `Quyuya daş buraxdılar. Daşın suya düşməsini ${F(T)} s-dən sonra gördülər. Səsin yayılma vaxtını nəzərə almasaq, quyunun dərinliyi nə qədərdir?`, solution: `h = gt²/2 = 5·${F(T * T)} = ${F(5 * T * T)} m. (Real quyuda səsin gəlmə vaxtı da var, amma burada onu atırıq.)` }); }
        if (kind === "tramplin") { const H = pick([5, 20, 45, 80]); return R(Math.sqrt(20 * H), "m/s", { text: `Tullanan idmançı ${H} m hündürlükdəki qüllədən sükunətdən suya tullanır. Suya dəyəndə sürəti nə qədərdir?`, solution: `v² = 2gh = 20·${H} = ${20 * H} → v = ${Math.sqrt(20 * H)} m/s (${F(Math.sqrt(20 * H) * 3.6)} km/saat).` }); }
        if (kind === "top") { const T = pick([2, 3, 4, 5, 6]); return R(5 * T * T / 4, "m", { text: `Cüglyor topu şaquli yuxarı atır və o, atıldığı nöqtəyə ${T} s-dən sonra qayıdır. Top ən çox neçə metr qalxıb?`, solution: `Qalxma vaxtı ${T}/2 = ${F(T / 2)} s. h = g·t²/2 = 5·${F(T * T / 4)} = ${F(5 * T * T / 4)} m.` }); }
        if (kind === "tullanma") { const T = pick([0.4, 0.6, 0.8, 1]); return R(1.25 * T * T, "m", { text: `Basketbolçu tullanır və havada (yerdən ayrılandan yerə qayıdana qədər) ${F(T)} s qalır. Tullanma hündürlüyü nə qədərdir?`, solution: `Qalxma vaxtı ${F(T)}/2 = ${F(T / 2)} s. h = g·t²/2 = 5·${F(T * T / 4)} = ${F(1.25 * T * T)} m.` }); }
        const H = pick([5, 20, 45, 80, 125]), T = Math.sqrt(H / 5); return R(T, "s", { text: `Havası çıxarılmış şüşə borunun içində çəkic və quş lələyi ${H} m hündürlükdən eyni anda buraxıldı. Onlar neçə saniyəyə dibə düşər?`, solution: `Hava müqaviməti olmadıqda düşmə vaxtı kütlədən asılı deyil: t = √(2h/g) = √${H / 5} = ${F(T)} s. İkisi eyni anda düşür.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a picture or graph, several steps;
  // the wrong options are the answers of typical mistakes. Questions 1, 2 and 10 also use "Kinematika" (v–t graph, uniform motion).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  // <svg-helpers> (string builders; the lesson tab uses the same pictures)
  const C = { ink: "var(--ink,#17171a)", acc: "var(--accent,#2457d6)", vec: "var(--vec,#c2410c)", mut: "var(--muted,#6b6b76)", soft: "var(--accent-soft,#e8eefc)" };
  const q1 = v => +(+v).toFixed(1);
  const sLn = (x1, y1, x2, y2, c = C.ink, w = 1.8, d) => `<line x1="${q1(x1)}" y1="${q1(y1)}" x2="${q1(x2)}" y2="${q1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${d ? ` stroke-dasharray="${d}"` : ""}/>`;
  const sTx = (x, y, t, a = "start", c = C.ink, fs = 13) => `<text x="${q1(x)}" y="${q1(y)}" text-anchor="${a}" font-size="${fs}" font-weight="700" fill="${c}" font-family="inherit">${t}</text>`;
  const sDot = (x, y, c = C.ink, r = 6) => `<circle cx="${q1(x)}" cy="${q1(y)}" r="${r}" fill="${c}"/>`;
  const sAr = (x1, y1, x2, y2, c = C.ink, w = 2.6) => { const a = Math.atan2(y2 - y1, x2 - x1), L = 10, Wd = 5, bx = x2 - L * Math.cos(a), by = y2 - L * Math.sin(a);
    return sLn(x1, y1, bx, by, c, w) + `<polygon points="${q1(x2)},${q1(y2)} ${q1(bx - Wd * Math.sin(a))},${q1(by + Wd * Math.cos(a))} ${q1(bx + Wd * Math.sin(a))},${q1(by - Wd * Math.cos(a))}" fill="${c}"/>`; };
  const sDim = (x, y1, y2, label, side = "r") => sLn(x, y1 + 6, x, y2 - 6, C.mut, 1.4) + sAr(x, y1 + 12, x, y1, C.mut, 1.4) + sAr(x, y2 - 12, x, y2, C.mut, 1.4) + sTx(side === "r" ? x + 8 : x - 8, (y1 + y2) / 2 + 4, label, side === "r" ? "start" : "end", C.ink, 12);
  const sRect = (x, y, w, h, f = C.soft) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="${C.ink}" stroke-width="1.5"/>`;
  const sSvg = (w, h, inner, aria, cls = "oy-svg") => `<svg viewBox="0 0 ${w} ${h}"${cls ? ` class="${cls}"` : ""} role="img" aria-label="${aria}">${inner}</svg>`;
  const svEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  // graph: axes, a polyline through pts, dashed guides, tick labels (x labels at the bottom, y labels on the left)
  function sPlot({ xmax, ymin, ymax, pts, xt = [], yt = [], xl = "t, s", yl = "v, m/s", guides = [], dots = [], area, aria, cls }) {
    const W = 260, Hh = 200, x0 = 48, x1 = 238, yT = 20, yB = 170;
    const px = x => x0 + x / xmax * (x1 - x0), py = y => yB - (y - ymin) / (ymax - ymin) * (yB - yT), ay = py(0);
    let s = sLn(x0, yT - 6, x0, yB + 4) + sLn(x0 - 4, ay, x1 + 8, ay) + sTx(x0 + 6, yT - 6, yl) + sTx(x1 + 8, ay - 7, xl, "end");
    if (area) s += `<polygon points="${area.map(p => q1(px(p[0])) + "," + q1(py(p[1]))).join(" ")}" fill="${C.soft}" opacity=".9"/>`;
    s += sLn(x0, ay, x1 + 8, ay) + sLn(x0, yT - 6, x0, yB + 4);
    guides.forEach(([x, y]) => { s += sLn(px(x), py(y), px(x), ay, C.mut, 1, "4 3") + sLn(x0, py(y), px(x), py(y), C.mut, 1, "4 3"); });
    xt.forEach(([x, l]) => { s += sLn(px(x), ay, px(x), yB + 2, C.mut, 1, "2 3") + sLn(px(x), ay - 3, px(x), ay + 3, C.ink, 1.5) + sTx(px(x), yB + 17, l, "middle", C.ink, 12); });
    yt.forEach(([y, l]) => { s += sLn(x0 - 3, py(y), x0 + 3, py(y), C.ink, 1.5) + sTx(x0 - 7, py(y) + 4, l, "end", C.ink, 12); });
    s += `<polyline points="${pts.map(p => q1(px(p[0])) + "," + q1(py(p[1]))).join(" ")}" fill="none" stroke="${C.acc}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`;
    dots.forEach(([x, y]) => { s += sDot(px(x), py(y), C.vec, 4); });
    return sSvg(W, Hh, s, aria, cls);
  }
  // v–t graph of a stone thrown up: v0 at t = 0, zero at tp, the line goes on to t
  const figVT1 = (v0, tp, t, cls) => sPlot({ xmax: t + 0.4, ymax: v0 * 1.15, ymin: (v0 - 10 * t) * 1.2, pts: [[0, v0], [t, v0 - 10 * t]], xt: [[tp, F(tp)], [t, F(t)]], yt: [[v0, F(v0)]], guides: [[t, v0 - 10 * t]],
    aria: "Şaquli yuxarı atılan daşın sürətinin vaxtdan asılılıq qrafiki: v₀ başlanğıcda, tp anında sıfır", cls });
  // v–t graph of a stone thrown down: from v0 to vf in t seconds (shaded trapezoid)
  const figVT2 = (v0, t, vf, cls) => sPlot({ xmax: t * 1.12, ymin: 0, ymax: vf * 1.15, pts: [[0, v0], [t, vf]], area: [[0, 0], [0, v0], [t, vf], [t, 0]], xt: [[t, F(t)]], yt: [[v0, F(v0)], [vf, F(vf)]], guides: [[t, vf]],
    aria: "Aşağı atılan daşın sürətinin vaxtdan asılılıq qrafiki: v₀-dan vf-ə qədər", cls });
  // height–time graph of a stone thrown up from the ground: peak (tp, H), back on the ground at 2tp
  function figHT(tp, cls) { const Hm = 5 * tp * tp, pts = []; for (let i = 0; i <= 24; i++) { const t = 2 * tp * i / 24; pts.push([t, 10 * tp * t - 5 * t * t]); }
    return sPlot({ xmax: 2 * tp * 1.06, ymin: 0, ymax: Hm * 1.18, pts, xt: [[tp, F(tp)], [2 * tp, F(2 * tp)]], yt: [[Hm, F(Hm)]], guides: [[tp, Hm]], dots: [[tp, Hm]], xl: "t, s", yl: "h, m",
      aria: "Şaquli yuxarı atılan daşın hündürlüyünün vaxtdan asılılıq qrafiki: zirvə (tp, H)", cls }); }
  // a balloon rising with speed u; a stone falls out at height h
  const figBalloon = (u, h, cls) => sSvg(260, 200, sLn(10, 184, 250, 184) + sDim(60, 110, 184, "h = " + F(h) + " m", "r") + sLn(60, 110, 138, 110, C.mut, 1, "4 3")
    + `<ellipse cx="150" cy="60" rx="20" ry="26" fill="${C.soft}" stroke="${C.ink}" stroke-width="1.8"/>` + sLn(150, 86, 150, 100, C.ink, 1.4) + sRect(143, 100, 14, 8, C.soft) + sDot(150, 114, C.vec, 5)
    + sAr(190, 78, 190, 30, C.acc) + sTx(198, 56, "u = " + F(u) + " m/s", "start", C.acc, 12) + sTx(160, 130, "daş", "start", C.vec, 12), "Hava şarı yuxarı qalxır; yerdən h hündürlükdə daş düşür", cls);
  // last second of a fall (bracket at the bottom)
  const figLast = (S, H, cls) => { const seg = Math.max(34, Math.min(104, 140 * S / H));
    return sSvg(260, 200, sRect(40, 34, 56, 136) + sLn(10, 170, 250, 170) + sDot(68, 24, C.vec, 6) + sAr(116, 30, 116, 64, C.acc) + sTx(124, 52, "g", "start", C.acc, 12)
      + sLn(96, 170 - seg, 150, 170 - seg, C.mut, 1.2, "4 3") + sDim(150, 170 - seg, 170, "son 1 s: " + F(S) + " m", "r") + sTx(68, 106, "H = ?", "middle", C.ink, 13), "Qüllədən sükunətdən düşən daşın son saniyədəki yolu", cls); };
  // two stones released from one point, tau seconds apart; the picture is at the moment t after the first release
  const figTwo = (tau, t, cls) => { const d1 = 5 * t * t, d2 = 5 * (t - tau) * (t - tau), y = d => 26 + 140 * d / d1;
    return sSvg(260, 200, sLn(80, 20, 80, 180, C.mut, 1.2, "4 3") + sDot(80, 26, C.ink, 3) + sTx(90, 30, "buraxılma nöqtəsi", "start", C.mut, 11) + sDot(80, y(d2), C.vec, 6) + sTx(66, y(d2) + 4, "2", "end", C.vec, 13)
      + sDot(80, y(d1), C.acc, 6) + sTx(66, y(d1) + 4, "1", "end", C.acc, 13) + sLn(94, y(d2), 160, y(d2), C.mut, 1, "4 3") + sLn(94, y(d1), 160, y(d1), C.mut, 1, "4 3") + sDim(150, y(d2), y(d1), "Δ = ?", "r"),
      "Bir nöqtədən fasilə ilə buraxılan iki daş: aralarındakı məsafə", cls); };
  // a ball falls from H and rebounds with speed k·v
  const figBounce = (H, k, cls) => sSvg(260, 200, sLn(10, 176, 250, 176) + sDim(34, 30, 176, "H = " + F(H) + " m", "r") + sDot(130, 30, C.acc, 7) + sAr(130, 44, 130, 120, C.acc) + sTx(138, 90, "v", "start", C.acc, 13)
    + sAr(200, 166, 200, 96, C.vec, 2.4) + sTx(210, 140, F(k) + "·v", "start", C.vec, 13) + sTx(210, 76, "h = ?", "start", C.ink, 13) + sLn(194, 96, 206, 96, C.ink, 1.4), "Top yerə dəyib sürətinin bir hissəsi ilə geri qalxır", cls);
  // A is dropped, B is thrown down from the same height H
  const figAB = (H, v0, cls) => sSvg(260, 200, sRect(40, 40, 56, 130) + sLn(10, 170, 250, 170) + sDot(112, 32, C.acc, 6) + sTx(112, 20, "A", "middle", C.acc, 13) + sDot(142, 32, C.vec, 6) + sTx(142, 20, "B", "middle", C.vec, 13)
    + sAr(142, 46, 142, 88, C.vec) + sTx(152, 72, "v₀ = " + F(v0) + " m/s", "start", C.vec, 12) + sDim(240, 32, 170, "H = " + F(H) + " m", "l"), "A daşı sükunətdən buraxılır, B daşı aşağı atılır, eyni hündürlükdən", cls);
  // a stone thrown up from the ground passes the level A at t1 and t2
  const figPass = (t1, t2, cls) => sSvg(260, 200, sLn(10, 176, 250, 176) + sLn(120, 28, 120, 176, C.mut, 1.2, "4 3") + sDot(120, 168, C.vec, 6) + sLn(84, 110, 156, 110, C.ink, 1.6) + sTx(160, 114, "A", "start", C.ink, 13)
    + sAr(98, 160, 98, 122, C.acc) + sTx(92, 152, "t₁ = " + F(t1) + " s", "end", C.acc, 12) + sAr(142, 62, 142, 98, C.vec) + sTx(148, 80, "t₂ = " + F(t2) + " s", "start", C.vec, 12) + sDim(240, 28, 176, "H = ?", "l"),
    "Daş A səviyyəsindən qalxarkən t₁, düşərkən t₂ anında keçir", cls);
  // </svg-helpers>
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. v–t graph of a stone thrown up: path (not displacement) for t seconds
    { tip: "qapali", birlesik: "fiz-kinematika", minVariety: 8, gen: () => again(() => {
      const tp = rnd(2, 6), d = rnd(1, tp - 1), v0 = 10 * tp, t = tp + d, Hm = 5 * tp * tp, fall = 5 * d * d, path = Hm + fall, disp = Hm - fall;
      const w = [disp, Hm, v0 * t, fall]; if (![path, ...w].every(x => ok2(x))) return null;
      return mc(ae(path, w, U_("m")), { svg: svEl(figVT1(v0, tp, t)), text: `Yerdən şaquli yuxarı atılan daşın sürət proyeksiyasının (ox yuxarı) vaxtdan asılılıq qrafiki verilib. Daş atıldığı andan ${t} s ərzində neçə metr yol gedib? (g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `Qrafikdən: v₀ = ${v0} m/s, v = 0 anı t = ${tp} s. Yol = sahələrin modulları cəmi. Qalxma: ${v0}·${tp}/2 = ${Hm} m. Sonrakı ${d} s-də v mənfidir (daş düşür): v = −${10 * d} m/s, düşmə ${d}·${10 * d}/2 = ${fall} m. Yol = ${Hm} + ${fall} = ${path} m. Tələlər: sahələri çıxmaq — yerdəyişmə ${disp} m; yalnız qalxma ${Hm} m; v₀·t = ${v0 * t} m (sürəti sabit saymaq); yalnız düşmə ${fall} m.` });
    }) },
    // 2. a stone falls from a rising balloon (uniform motion + free fall)
    { tip: "qapali", birlesik: "fiz-kinematika", minVariety: 8, gen: () => again(() => {
      const t = rnd(2, 8), s = rnd(1, t - 1), u = 5 * (t - s), h = 5 * t * s;
      const w = [s, (t - s) / 2, t - s, t + s]; if (![t, ...w].every(x => ok2(x))) return null;
      return mc(ae(t, w, U_("s")), { svg: svEl(figBalloon(u, h)), text: `Hava şarı sabit ${u} m/s sürətlə şaquli yuxarı qalxır. Yerdən ${h} m hündürlükdə şardan daş düşür. Daş neçə saniyəyə yerə dəyər? (g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `Düşən anda daşın sürəti şarın sürətidir: ${u} m/s, yuxarı! Ox yuxarı, yer koordinatı 0: 0 = ${h} + ${u}t − 5t² → t² − ${u / 5 === 1 ? "" : u / 5}t − ${h / 5} = 0. Viyet: t₁ + t₂ = ${u / 5}, t₁t₂ = −${h / 5} → t = ${t} və t = −${s}. Müsbət kök: ${t} s. Tələlər: ${s} s — şarın sürətini aşağı saymaq; ${F((t - s) / 2)} s — yalnız qalxma vaxtı u/g; ${t - s} s — daşın düşdüyü səviyyəyə qayıtma vaxtı 2u/g; ${t + s} s — kökün modulunu cavaba əlavə etmək (|t₁| + |t₂|).` });
    }) },
    // 3. A dropped from H, B thrown up from the ground at the same time: height of the meeting
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const t = pick([1, 1.5, 2, 2.5, 3]), v0 = pick([10, 15, 20, 25, 30, 35, 40]), H = v0 * t, y = v0 * t - 5 * t * t;
      const w = [H / 2, 5 * t * t, v0 * v0 / 20, H]; if (![y, ...w].every(x => ok2(x))) return null;
      return mc(ae(y, w, U_("m")), { svg: meetPic(F(H), v0), text: `Eyni anda A cismi ${F(H)} m hündürlükdən sükunətdən buraxılır, B cismi yerdən (A-nın düz altından) şaquli yuxarı ${v0} m/s sürətlə atılır. Görüş yerdən neçə metr hündürlükdə baş verəcək? (g = 10 m/s².)`,
        solution: `A: ${F(H)} − 5t², B: ${v0}t − 5t². Görüşdə bərabərdir: ${F(H)} = ${v0}t → t = ${F(t)} s (g ixtisar olur). Hündürlük: ${v0}·${F(t)} − 5·${F(t * t)} = ${F(v0 * t)} − ${F(5 * t * t)} = ${F(y)} m. Tələlər: ortada görüşmək (${F(H / 2)} m); hündürlüyü yuxarıdan ölçmək — A-nın düşdüyü yol ${F(5 * t * t)} m; B-nin qalxma hündürlüyü ${F(v0 * v0 / 20)} m; cazibəni unudub v₀t (${F(H)} m).` });
    }) },
    // 4. the last second of a fall → height of the tower
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const T = pick([2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7]), H = 5 * T * T, S = 10 * T - 5;
      const w = [5 * (T - 1) ** 2, S * T, 10 * T * T, 5 * (T + 1) ** 2]; if (![H, ...w].every(x => ok2(x))) return null;
      return mc(ae(H, w, U_("m")), { svg: svEl(figLast(S, H)), text: `Daş qüllənin başından sükunətdən sərbəst düşür. Hərəkətinin sonuncu 1 saniyəsində o, ${F(S)} m yol gedir. Qüllənin hündürlüyü nə qədərdir? (g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `Son saniyə: 5T² − 5(T − 1)² = 10T − 5 = ${F(S)} → T = ${F(T)} s. H = 5T² = 5·${F(T * T)} = ${F(H)} m. Tələlər: ${F(5 * (T - 1) ** 2)} m — son saniyədən əvvəlki yol; ${F(S * T)} m — S·T (son saniyənin sürəti bütün müddətdə sabit sanılır); ${F(10 * T * T)} m — gT² (yarıya bölməyi unutmaq); ${F(5 * (T + 1) ** 2)} m — T-ni bir saniyə artıq götürmək.` });
    }) },
    // 5. two stones released τ seconds apart: the distance between them
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const tau = rnd(1, 3), t = tau + rnd(1, 4), D = 10 * tau * t - 5 * tau * tau;
      const w = [5 * tau * tau, 10 * tau * t, 5 * t * t - 5 * tau * tau, 5 * t * t]; if (![D, ...w].every(x => ok2(x))) return null;
      return mc(ae(D, w, U_("m")), { svg: svEl(figTwo(tau, t)), text: `Eyni nöqtədən iki daş ${tau} s fasilə ilə sükunətdən buraxıldı. Birinci daşın buraxılmasından ${t} s sonra (hər iki daş hələ havadadır) daşlar arasındakı məsafə neçə metrdir? (g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `h₁ = 5·${t}² = ${5 * t * t} m, ikinci daş ${t - tau} s düşüb: h₂ = 5·${t - tau}² = ${5 * (t - tau) ** 2} m. Məsafə: ${5 * t * t} − ${5 * (t - tau) ** 2} = ${D} m. Tələlər: ${5 * tau * tau} m — "məsafə həmişə ilk fasilədəki kimi qalır"; ${10 * tau * t} m — 5t² − 5(t − τ)² açanda −5τ²-ni unutmaq; ${5 * t * t - 5 * tau * tau} m — ikinci daşın düşmə vaxtını t − τ əvəzinə τ götürmək; ${5 * t * t} m — yalnız birinci daşın yolu.` });
    }) },
    // 6. rebound: the speed is k·v → height k²H
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const H = pick([5, 20, 45, 80, 125, 180]), k = pick([0.4, 0.6, 0.8]), v = Math.sqrt(20 * H), h2 = k * k * H;
      const w = [k * H, (1 - k) * H, (1 - k * k) * H, H]; if (![h2, ...w].every(x => ok2(x))) return null;
      return mc(ae(h2, w, U_("m")), { svg: svEl(figBounce(H, k)), text: `Top ${H} m hündürlükdən sükunətdən buraxılır, yerə dəyir və toqquşmadan sonra sürətinin modulu toqquşmadan əvvəlki sürətin ${F(k)} hissəsi qədər olur (sürət şaquli yuxarı yönəlir). Top yerdən neçə metr hündürlüyə qalxır? (g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `Yerə dəyəndə: v² = 2gH = 20·${H} = ${20 * H} → v = ${F(+v.toFixed(4))} m/s. Geri: v′ = ${F(k)}·${F(+v.toFixed(4))} = ${F(+(k * v).toFixed(4))} m/s. Qalxma: h = v′²/(2g) = ${F(+(k * k * v * v).toFixed(4))}/20 = ${F(h2)} m (yəni k²·H). Tələlər: ${F(k * H)} m — hündürlüyü sürət kimi k-ya vurmaq; ${F((1 - k) * H)} m və ${F((1 - k * k) * H)} m — itən hissəni tapmaq; ${H} m — itkini nəzərə almamaq.` });
    }) },
    // 7. height–time graph: speed at t1
    { tip: "qapali", minVariety: 8, birlesik: "fiz-kinematika", gen: () => again(() => {
      const tp = rnd(1, 4), t1 = pick([0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5]); if (t1 >= 2 * tp || t1 === tp) return null;
      const Hm = 5 * tp * tp, y1 = 10 * tp * t1 - 5 * t1 * t1, v = Math.abs(10 * (tp - t1));
      const w = [10 * tp, 10 * t1, 5 * tp, y1 / t1]; if (![v, ...w].every(x => ok2(x))) return null;
      return mc(ae(v, w, U_("m/s")), { svg: svEl(figHT(tp)), text: `Yerdən şaquli yuxarı atılan daşın hündürlüyünün vaxtdan asılılıq qrafiki verilib. Atılmadan ${F(t1)} s sonra daşın sürətinin modulu nə qədərdir? (g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `Zirvədə (t = ${tp} s) sürət sıfırdır, deməli v = v₀ − gt ifadəsində v₀ = g·${tp} = ${10 * tp} m/s. ${F(t1)} s-də: v = ${10 * tp} − 10·${F(t1)} = ${F(10 * tp - 10 * t1)} m/s, modulu ${F(v)} m/s. Tələlər: ${10 * tp} m/s — başlanğıc sürət; ${F(10 * t1)} m/s — sükunətdən düşmə gt; ${5 * tp} m/s — qalxmadakı orta sürət ${Hm}/${tp}; ${F(y1 / t1)} m/s — ${F(t1)} s-dəki orta sürətin proyeksiyası h/t — ani sürət deyil.` });
    }) },
    // 8. the stone passes one level at t1 and t2: the greatest height
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const tp = pick([1.5, 2, 2.5, 3, 3.5, 4]), d = pick([0.5, 1, 1.5, 2, 2.5, 3]); if (d >= tp) return null;
      const t1 = tp - d, t2 = tp + d, Hm = 5 * tp * tp;
      const w = [5 * (t2 - t1) ** 2 / 4, 5 * t1 * t2, 5 * t2 * t2, 5 * (t1 + t2) ** 2]; if (![Hm, ...w].every(x => ok2(x))) return null;
      return mc(ae(Hm, w, U_("m")), { svg: svEl(figPass(t1, t2)), text: `Yerdən şaquli yuxarı atılan daş A səviyyəsindən atılma anından ${F(t1)} s sonra qalxarkən, ${F(t2)} s sonra düşərkən keçir. Daş yerdən ən çox neçə metr hündürlüyə qalxıb? (g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `Qalxma və enmə simmetrikdir: zirvə iki keçid anının ortasındadır: t_z = (${F(t1)} + ${F(t2)})/2 = ${F(tp)} s. Zirvədə v = 0 → v₀ = g·t_z = ${F(10 * tp)} m/s; H = g·t_z²/2 = 5·${F(tp * tp)} = ${F(Hm)} m. Tələlər: ${F(5 * (t2 - t1) ** 2 / 4)} m — A-dan yuxarıdakı hissə (iki keçid arasındakı yarım vaxt); ${F(5 * t1 * t2)} m — A-nın hündürlüyü; ${F(5 * t2 * t2)} m — qalxma vaxtını t₂ saymaq; ${F(5 * (t1 + t2) ** 2)} m — t_z əvəzinə t₁ + t₂ (yarıya bölməyi unutmaq).` });
    }) },
    // 9. A dropped, B thrown down from H: height of A when B lands
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const t = rnd(1, 4), v0 = pick([10, 15, 20, 25, 30, 35]), H = v0 * t + 5 * t * t, y = v0 * t; if (v0 <= 5 * t) return null;
      const w = [5 * t * t, H, H / 2, H - 10 * t * t]; if (![y, ...w].every(x => ok2(x))) return null;
      return mc(ae(y, w, U_("m")), { svg: svEl(figAB(H, v0)), text: `Eyni ${H} m hündürlükdən eyni anda A daşı sükunətdən buraxılır, B daşı isə şaquli aşağı ${v0} m/s sürətlə atılır. B yerə dəyən anda A daşı yerdən neçə metr hündürlükdədir? (g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `B üçün: ${H} = ${v0}t + 5t² → t² + ${v0 / 5}t − ${H / 5} = 0 → t = ${t} s (digər kök mənfidir). A bu vaxtda 5t² = ${5 * t * t} m düşüb, yerdən hündürlüyü ${H} − ${5 * t * t} = ${y} m. Tələlər: ${5 * t * t} m — A-nın düşdüyü yolu cavab yazmaq; ${H} m — A-nı yerindən tərpənməmiş saymaq; ${F(H / 2)} m — "görüşdə yarı"; ${F(H - 10 * t * t)} m — A üçün gt² (yarıya bölməyi unutmaq).` });
    }) },
    // 10. v–t graph of a stone thrown down: height of the tower is the area of the trapezoid
    { tip: "qapali", birlesik: "fiz-kinematika", minVariety: 8, gen: () => again(() => {
      const v0 = pick([5, 10, 15, 20]), t = rnd(2, 5), vf = v0 + 10 * t, Hm = (v0 + vf) / 2 * t;
      const w = [v0 * t, vf * t, 5 * t * t, (v0 + vf) * t]; if (![Hm, ...w].every(x => ok2(x))) return null;
      return mc(ae(Hm, w, U_("m")), { svg: svEl(figVT2(v0, t, vf)), text: `Qüllənin başından şaquli aşağı atılan daşın sürətinin vaxtdan asılılıq qrafiki verilib. Daş ${t} s-dən sonra yerə dəyib. Qüllənin hündürlüyü nə qədərdir? (g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `Qrafikdən: v₀ = ${v0} m/s, ${t} s-də v = ${vf} m/s. Yol qrafikin altındakı sahədir — trapesiya: (${v0} + ${vf})/2·${t} = ${F((v0 + vf) / 2)}·${t} = ${Hm} m. Tələlər: ${v0 * t} m — sürəti sabit v₀ saymaq; ${vf * t} m — sürəti sabit son qiymətdə saymaq; ${5 * t * t} m — sükunətdən düşmə gt²/2 (v₀-u unutmaq); ${(v0 + vf) * t} m — trapesiyada 2-yə bölməyi unutmaq.` });
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
      key: "fiz-serbest-dusme", title: "Sərbəst düşmə", fenn: "fizika", link: "dersler/fiz-serbest-dusme.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: m, s, m/s). Sürət proyeksiyası mənfi ola bilər: −10. Onluq kəsr vergül və ya nöqtə ilə: 1,25. g = 10 m/s².",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["dusme", "dusme", "yuxari", "yuxari", "asagi", "asagi", "son", "iki", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-serbest-dusme.html")) b.push("dersler/fiz-serbest-dusme.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
