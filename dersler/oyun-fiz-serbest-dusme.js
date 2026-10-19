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
    s.append(sv("circle", { cx: 70, cy: 20, r: 6, fill: "var(--accent)" })); s.append(sv("text", { x: 20, y: 24, class: "oy-lbl" }, "A"));
    s.append(sv("polygon", { points: "70,56 64,44 76,44", fill: "var(--accent)" }));
    s.append(sv("circle", { cx: 110, cy: 164, r: 6, fill: "var(--vec)" })); s.append(sv("text", { x: 122, y: 168, class: "oy-lbl" }, "B"));
    s.append(sv("line", { x1: 110, y1: 150, x2: 110, y2: 120, stroke: "var(--vec)", "stroke-width": 3 })); s.append(sv("polygon", { points: "110,114 104,126 116,126", fill: "var(--vec)" }));
    s.append(sv("text", { x: 122, y: 128, class: "oy-lbl" }, "v₀ = " + v0 + " m/s"));
    s.append(sv("text", { x: 130, y: 80, class: "oy-lbl" }, "H = " + H + " m"));
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
          return R(v, "m/s", { text: `Daş ${v0} m/s sürətlə şaquli yuxarı atılıb. Ox yuxarı yönəlib. ${t} s-dən sonra sürətin proyeksiyasını tap.`, solution: `vₓ = v₀ − gt = ${v0} − 10·${t} = ${F(v)} m/s. ${v < 0 ? "Mənfi — daş artıq düşür." : v === 0 ? "Daş ən yuxarı nöqtədədir." : "Müsbət — daş hələ qalxır."}` }); }
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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-serbest-dusme", title: "Sərbəst düşmə", fenn: "fizika", link: "dersler/fiz-serbest-dusme.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: m, s, m/s). Sürət proyeksiyası mənfi ola bilər: −10. Onluq kəsr vergül və ya nöqtə ilə: 1,25. g = 10 m/s².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["dusme", "dusme", "yuxari", "yuxari", "asagi", "asagi", "son", "iki", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-serbest-dusme.html")) b.push("dersler/fiz-serbest-dusme.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
