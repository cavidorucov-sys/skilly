// Fizika · Kinematika — mastery game levels (uniform motion, acceleration, coordinate vs displacement, v(t) and x(t) graphs, meeting / catching up) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s².
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");          // 0.04 → "0,04", −2 → "−2"
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;        // v has at most d decimals
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : F(a) + v) : F(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const P = v => v < 0 ? "(" + F(v) + ")" : F(v);
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };

  // piecewise-linear graph through pts [[t, y], ...] (t from 0); axes, grid, vertex labels
  function graph(pts, ylab) {
    const W = 300, H = 210, Lm = 40, Rm = 18, Tm = 18, Bm = 32;
    const tmax = Math.max(...pts.map(p => p[0])), ys = pts.map(p => p[1]);
    const step = span => { for (const s of [1, 2, 5, 10, 20, 50, 100]) if (span / s <= 6) return s; return 200; };
    const ymin0 = Math.min(0, ...ys), ymax0 = Math.max(0, ...ys), ys_ = step(ymax0 - ymin0);
    const ymin = Math.floor(ymin0 / ys_) * ys_, ymax = Math.ceil(ymax0 / ys_) * ys_, ts_ = tmax <= 7 ? 1 : tmax <= 14 ? 2 : 5;
    const tx = t => Lm + t / tmax * (W - Lm - Rm), ty = y => Tm + (ymax - y) / (ymax - ymin) * (H - Tm - Bm);
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Qrafik: " + ylab });
    const small = { style: "font-size:11px", fill: "var(--muted)" };
    for (let y = ymin; y <= ymax + 1e-9; y += ys_) {
      g.append(sv("line", { x1: Lm, y1: ty(y), x2: W - Rm, y2: ty(y), stroke: "var(--line)", "stroke-width": 1 }));
      g.append(sv("text", Object.assign({ x: Lm - 5, y: ty(y) + 4, "text-anchor": "end", class: "oy-lbl" }, small), F(y)));
    }
    for (let t = 0; t <= tmax + 1e-9; t += ts_) {
      g.append(sv("line", { x1: tx(t), y1: Tm, x2: tx(t), y2: H - Bm, stroke: "var(--line)", "stroke-width": 1 }));
      g.append(sv("text", Object.assign({ x: tx(t), y: H - Bm + 14, "text-anchor": "middle", class: "oy-lbl" }, small), F(t)));
    }
    g.append(sv("line", { x1: Lm, y1: ty(0), x2: W - Rm, y2: ty(0), stroke: "var(--ink)", "stroke-width": 1.8 }));
    g.append(sv("line", { x1: Lm, y1: Tm - 6, x2: Lm, y2: H - Bm, stroke: "var(--ink)", "stroke-width": 1.8 }));
    g.append(sv("text", { x: Lm + 6, y: Tm - 4, class: "oy-lbl", style: "font-size:12px" }, ylab));
    g.append(sv("text", { x: W - Rm, y: H - 6, "text-anchor": "end", class: "oy-lbl", style: "font-size:12px" }, "t, s"));
    g.append(sv("polyline", { points: pts.map(p => tx(p[0]).toFixed(1) + "," + ty(p[1]).toFixed(1)).join(" "), fill: "none", stroke: "var(--accent)", "stroke-width": 2.8, "stroke-linejoin": "round" }));
    for (const [t, y] of pts) g.append(sv("circle", { cx: tx(t), cy: ty(y), r: 3.6, fill: "var(--vec)" }));
    return g;
  }
  // displacement and path for piecewise-linear v(t)
  function areas(pts) {
    let disp = 0, path = 0;
    for (let i = 1; i < pts.length; i++) {
      const [t0, a] = pts[i - 1], [t1, b] = pts[i], dt = t1 - t0;
      disp += (a + b) / 2 * dt;
      if (a * b >= 0) path += Math.abs(a + b) / 2 * dt;
      else { const tz = dt * Math.abs(a) / (Math.abs(a) + Math.abs(b)); path += Math.abs(a) * tz / 2 + Math.abs(b) * (dt - tz) / 2; }
    }
    return { disp, path };
  }

  const PAIRS = [];   // v1 < v2 with a whole-number harmonic mean 2·v1·v2/(v1 + v2)
  for (let a = 4; a <= 60; a++) for (let b = a + 1; b <= 120; b++) if ((2 * a * b) % (a + b) === 0) PAIRS.push([a, b, 2 * a * b / (a + b)]);
  const KMH = [[18, 5], [36, 10], [54, 15], [72, 20], [90, 25], [108, 30]];   // km/saat → m/s

  const levels = [
    { id: "beraber", ad: "Bərabərsürətli hərəkət", izah: "x = x₀ + vₓ·t. Sürətin proyeksiyası işarəlidir. Orta sürət = bütün yol / bütün vaxt (sürətlərin orta hesabı deyil!).",
      gen() {
        const kind = pick(["x", "x", "t0", "qraf", "orta", "orta", "yol"]);
        if (kind === "x") {
          const x0 = rnd(-40, 40), v = pick([-1, 1]) * rnd(1, 8), t = rnd(2, 12), x = x0 + v * t;
          return R(x, "m", { text: `Cismin koordinatı x = ${poly([[x0, ""], [v, "t"]])} (m, s) qanunu ilə dəyişir. t = ${t} s anında koordinat nə qədərdir?`,
            solution: `x = ${F(x0)} + (${F(v)})·${t} = ${F(x)} m.` });
        }
        if (kind === "t0") {
          const t0 = rnd(2, 10), v = pick([-1, 1]) * rnd(1, 8), x0 = -v * t0;
          return R(t0, "s", { text: `Cismin koordinatı x = ${poly([[x0, ""], [v, "t"]])} (m, s) qanunu ilə dəyişir. Cisim hansı anda koordinat başlanğıcından keçir?`,
            solution: `x = 0 → ${F(x0)} + (${F(v)})·t = 0 → t = ${F(-x0)}/${F(v)} = ${t0} s. (Mənfi çıxsaydı, bu hal hərəkətdən əvvəl olardı.)` });
        }
        if (kind === "qraf") {
          const v = pick([-1, 1]) * rnd(1, 6), x0 = rnd(-15, 15), t1 = rnd(1, 4), t2 = t1 + rnd(2, 5), t3 = t2 + rnd(2, 6);
          const x1 = x0 + v * t1, x2 = x0 + v * t2, x3 = x0 + v * t3;
          if (Math.random() < .5) return R(v, "m/s", { text: `Düzxətli bərabərsürətli hərəkət edən cismin koordinatı t = ${t1} s-də ${F(x1)} m, t = ${t2} s-də ${F(x2)} m olub. Sürətin proyeksiyasını tap.`,
            solution: `v = (x₂ − x₁)/(t₂ − t₁) = (${F(x2)} − (${F(x1)}))/${t2 - t1} = ${F(v)} m/s.` });
          return R(x3, "m", { text: `Düzxətli bərabərsürətli hərəkət edən cismin koordinatı t = ${t1} s-də ${F(x1)} m, t = ${t2} s-də ${F(x2)} m olub. t = ${t3} s-də koordinat nə qədərdir?`,
            solution: `v = (${F(x2)} − (${F(x1)}))/${t2 - t1} = ${F(v)} m/s. x = x₂ + v·(t − t₂) = ${F(x2)} + (${F(v)})·${t3 - t2} = ${F(x3)} m.` });
        }
        if (kind === "orta") {
          const [a, b, m] = pick(PAIRS);
          if (Math.random() < .8) return R(m, "m/s", { text: `Avtomobil yolun ilk yarısını ${a} m/s, ikinci yarısını ${b} m/s sürətlə getdi. Bütün yol boyu orta sürəti nə qədərdir?`,
            solution: `Yolu 2L götürək. Vaxtlar: L/${a} və L/${b}. Orta sürət = 2L / (L/${a} + L/${b}) = 2·${a}·${b}/(${a} + ${b}) = ${a * b * 2}/${a + b} = ${m} m/s. Sürətlərin orta hesabı (${F((a + b) / 2)}) səhvdir: yavaş hissədə daha çox vaxt keçib.` });
          return R((a + b) / 2, "m/s", { text: `Qatar hərəkət vaxtının ilk yarısında ${a} m/s, ikinci yarısında ${b} m/s sürətlə getdi. Orta sürəti nə qədərdir?`,
            solution: `Hər sürətlə eyni vaxt getdi, buna görə yol: ${a}·t və ${b}·t. Orta sürət = (${a}t + ${b}t)/(2t) = (${a} + ${b})/2 = ${F((a + b) / 2)} m/s. Burada orta hesab doğrudur — çünki bərabər olan vaxtdır, yol yox.` });
        }
        const d1 = rnd(20, 90), d2 = rnd(10, 100); const ask = pick(["yol", "yer"]);
        if (d1 === d2) return this.gen();
        return ask === "yol"
          ? R(d1 + d2, "m", { text: `Ox şərqə yönəlib. Piyada əvvəlcə şərqə ${d1} m, sonra qərbə ${d2} m getdi. O, neçə metr yol gedib?`, solution: `Yol — bütün getdiyi məsafədir, istiqamət əhəmiyyət daşımır: ${d1} + ${d2} = ${d1 + d2} m.` })
          : R(d1 - d2, "m", { text: `Ox şərqə yönəlib. Piyada əvvəlcə şərqə ${d1} m, sonra qərbə ${d2} m getdi. Yerdəyişmənin ox üzrə proyeksiyası nə qədərdir?`, solution: `sₓ = ${d1} − ${d2} = ${F(d1 - d2)} m (mənfi olsa, yerdəyişmə oxun əksinədir).` });
      } },
    { id: "tecil", ad: "Təcil, sürət, yol", izah: "a = (v − v₀)/t; v = v₀ + at; s = v₀t + at²/2 = (v₀ + v)/2·t; v² − v₀² = 2as. km/saat-ı 3,6-ya bölüb m/s et.",
      gen() {
        const kind = pick(["a", "a", "tormoz", "tormoz", "ts", "yola", "vsiz", "nci", "nci"]);
        if (kind === "a") {
          for (;;) {
            const [k0, m0] = pick(KMH), [k1, m1] = pick(KMH); if (k0 === k1) continue;
            const t = pick([2, 4, 5, 8, 10]), a = (m1 - m0) / t; if (!nice(a, 2)) continue;
            return R(a, "m/s²", { text: `Avtomobil ${k0} km/saat sürətlə gedərkən ${t} s ərzində sürətini ${k1} km/saat-a çatdırdı. Təcilin proyeksiyasını tap (SI-də).`,
              solution: `${k0} km/saat = ${m0} m/s, ${k1} km/saat = ${m1} m/s. a = (v − v₀)/t = (${m1} − ${m0})/${t} = ${F(a)} m/s².` });
          }
        }
        if (kind === "tormoz") {
          for (;;) {
            const [k0, v0] = pick(KMH), a = pick([2, 2.5, 4, 5, 6, 8]), s = v0 * v0 / (2 * a), t = v0 / a;
            if (!nice(s, 2) || !nice(t, 2)) continue;
            if (Math.random() < .6) return R(s, "m", { text: `Avtomobil ${k0} km/saat sürətlə gedərkən əyləc edir və ${F(a)} m/s² təcillə yavaşıyaraq dayanır. Əyləc yolu nə qədərdir?`,
              solution: `${k0} km/saat = ${v0} m/s. Dayanır: v = 0 → 0 − ${v0}² = −2·${F(a)}·s → s = ${v0 * v0}/${F(2 * a)} = ${F(s)} m.` });
            return R(t, "s", { text: `Avtomobil ${k0} km/saat sürətlə gedərkən ${F(a)} m/s² təcillə yavaşıyaraq dayanır. Əyləc nə qədər vaxt çəkir?`,
              solution: `${k0} km/saat = ${v0} m/s. 0 = ${v0} − ${F(a)}·t → t = ${v0}/${F(a)} = ${F(t)} s.` });
          }
        }
        if (kind === "ts") {
          const v0 = rnd(2, 12), t = rnd(2, 9), a = pick([1, 2, 3, 4]), v = v0 + a * t, s = (v0 + v) / 2 * t;
          return R(s, "m", { text: `Cisim ${v0} m/s sürətlə hərəkətə başlayıb, ${t} s-dən sonra sürəti ${v} m/s olub. Bu müddətdə hansı yolu gedib? Təcil sabitdir.`,
            solution: `Təcil sabit olduğundan orta sürət = (v₀ + v)/2 = (${v0} + ${v})/2 = ${F((v0 + v) / 2)} m/s. s = ${F((v0 + v) / 2)}·${t} = ${F(s)} m.` });
        }
        if (kind === "yola") {
          const a = pick([1, 2, 3, 4, 5, 0.5, 1.5, 2.5]), t = rnd(2, 10), s = a * t * t / 2, w = pick(["s", "s", "t", "v"]);
          if (!nice(s, 2)) return this.gen();
          if (w === "s") return R(s, "m", { text: `Sükunətdən ${F(a)} m/s² təcillə hərəkətə başlayan cisim ${t} s-də hansı yolu gedir?`, solution: `s = at²/2 = ${F(a)}·${t * t}/2 = ${F(s)} m.` });
          if (w === "t") return R(t, "s", { text: `Sükunətdən ${F(a)} m/s² təcillə hərəkətə başlayan cisim ${F(s)} m yol gedib. Bu nə qədər vaxt çəkib?`, solution: `s = at²/2 → t² = 2s/a = ${F(2 * s)}/${F(a)} = ${t * t} → t = ${t} s.` });
          return R(a * t, "m/s", { text: `Sükunətdən ${F(a)} m/s² təcillə hərəkətə başlayan cisim ${F(s)} m yol getdikdən sonra hansı sürətə çatar?`, solution: `Əvvəl vaxt: t² = 2s/a = ${t * t} → t = ${t} s. Sonra v = at = ${F(a)}·${t} = ${F(a * t)} m/s. (Və ya birbaşa v² = 2as = ${F(2 * a * s)}.)` });
        }
        if (kind === "vsiz") {
          const v0 = rnd(2, 10), a = pick([1, 2, 3, 4]), t = rnd(2, 8), v = v0 + a * t, s = v0 * t + a * t * t / 2;
          return R(v, "m/s", { text: `Cisim ${v0} m/s başlanğıc sürətlə ${a} m/s² təcillə sürətlənir. ${s} m yol gedəndə sürəti nə qədər olur?`,
            solution: `Vaxt verilmir — v² − v₀² = 2as. v² = ${v0 * v0} + 2·${a}·${s} = ${v0 * v0 + 2 * a * s} → v = ${v} m/s.` });
        }
        const n = rnd(2, 8), a = pick([1, 2, 3, 4, 5]), v0 = Math.random() < .5 ? 0 : rnd(1, 6), sn = v0 + a * (2 * n - 1) / 2;
        if (!nice(sn, 2)) return this.gen();
        if (Math.random() < .5) return R(sn, "m", { text: `Cisim ${v0 ? v0 + " m/s başlanğıc sürətlə" : "sükunətdən"} ${a} m/s² təcillə hərəkətə başlayıb. ${n}-ci saniyədə (yəni ${n - 1}-ci saniyənin sonundan ${n}-ci saniyənin sonuna qədər) hansı yolu gedib?`,
          solution: `s(${n}) − s(${n - 1}) = ${v0 ? v0 + "·" + n + " + " : ""}${a}·${n * n}/2 − (${v0 ? v0 + "·" + (n - 1) + " + " : ""}${a}·${(n - 1) ** 2}/2) = ${F(sn)} m. (Qısa: s_n = v₀ + a(2n − 1)/2.)` });
        return R(a, "m/s²", { text: `Sükunətdən bərabərtəcilli hərəkətə başlayan cisim ${n}-ci saniyədə ${F(a * (2 * n - 1) / 2)} m yol gedib. Təcili tap.`,
          solution: `${n}-ci saniyədə yol s_n = a(2n − 1)/2 = a·${2 * n - 1}/2. Buradan a = 2·${F(a * (2 * n - 1) / 2)}/${2 * n - 1} = ${a} m/s².` });
      } },
    { id: "koord", ad: "Koordinat, yerdəyişmə, yol", izah: "x = x₀ + v₀ₓt + aₓt²/2. Koordinat ≠ yerdəyişmə: x = x₀ + sₓ. Cisim dönürsə, yol yerdəyişmədən böyükdür.",
      gen() {
        const kind = pick(["ext", "ext", "ext", "stop", "xt", "vt", "geri", "yol", "yol"]);
        const c = pick([-1, 1]) * rnd(1, 3), ts = rnd(1, 5), a = 2 * c, v0 = -a * ts, x0 = rnd(-10, 10);
        const law = `x = ${poly([[x0, ""], [v0, "t"], [c, "t²"]])}`, head = `Cismin koordinatı ${law} (m, s) qanunu ilə dəyişir.`;
        const stopTxt = `v = v₀ + at = ${F(v0)} + (${F(a)})t = 0 → t = ${ts} s`;
        if (kind === "ext") {
          const xm = x0 - c * ts * ts;
          return R(xm, "m", { text: `${head} Cismin ala biləcəyi ${c < 0 ? "ən böyük" : "ən kiçik"} koordinat nədir?`,
            solution: `Koordinat dönmə anında ekstremuma çatır, orada sürət sıfırdır. Burada v₀ = ${F(v0)}, a = 2·(${F(c)}) = ${F(a)} m/s². ${stopTxt}. x(${ts}) = ${F(x0)} + (${F(v0)})·${ts} + (${F(c)})·${ts * ts} = ${F(xm)} m. Diqqət: yerdəyişmə ${F(-c * ts * ts)} m-dir, ona x₀ = ${F(x0)} əlavə olunur.` });
        }
        if (kind === "stop") {
          return R(-c * ts * ts, "m", { text: `${head} Cisim dayanana qədər hansı yerdəyişməni edir? (Cavab ox üzrə proyeksiyadır.)`,
            solution: `${stopTxt}. sₓ = v₀t + at²/2 = ${F(v0)}·${ts} + (${F(c)})·${ts * ts} = ${F(-c * ts * ts)} m. Koordinatın dəyişməsi — x₀ lazım deyil.` });
        }
        if (kind === "xt") {
          const t = rnd(1, 9), x = x0 + v0 * t + c * t * t;
          return R(x, "m", { text: `${head} t = ${t} s anında koordinat nə qədərdir?`, solution: `x(${t}) = ${F(x0)} + (${F(v0)})·${t} + (${F(c)})·${t * t} = ${F(x)} m.` });
        }
        if (kind === "vt") {
          const t = rnd(1, 9), v = v0 + a * t;
          return R(v, "m/s", { text: `${head} t = ${t} s anında sürətin proyeksiyasını tap.`, solution: `Qanundan: v₀ = ${F(v0)} m/s, a = 2·(${F(c)}) = ${F(a)} m/s². v = ${F(v0)} + (${F(a)})·${t} = ${F(v)} m/s.` });
        }
        if (kind === "geri") {
          return R(2 * ts, "s", { text: `${head} Cisim hansı (sıfırdan fərqli) anda başlanğıc koordinata (x = ${F(x0)} m) qayıdır?`,
            solution: `x = x₀ → v₀t + ct² = 0 → t(${F(v0)} + (${F(c)})t) = 0 → t = ${F(-v0 / c)} s. (Həmçinin: dönmə anı ${ts} s, geri qayıtma ona qədər vaxt çəkir — 2·${ts} = ${2 * ts} s.)` });
        }
        const t = ts + rnd(1, 3), D = c * (t - ts) ** 2 - c * ts * ts, P = Math.abs(c) * (ts * ts + (t - ts) ** 2);
        return R(P, "m", { text: `${head} Cismin ilk ${t} s-də getdiyi yol nə qədərdir?`,
          solution: `${stopTxt} — cisim dönür. Dönməyə qədər: |${F(-c * ts * ts)}| = ${F(Math.abs(c) * ts * ts)} m. Dönmədən sonra ${t - ts} s sükunətdən: |c|·(${t - ts})² = ${F(Math.abs(c) * (t - ts) ** 2)} m. Yol = ${F(P)} m (yerdəyişmə isə ${F(D)} m olardı).` });
      } },
    { id: "qrafik", ad: "Qrafiklər: v(t) və x(t)", izah: "v(t)-də: mailiyyət = təcil, altındakı işarəli sahə = yerdəyişmə (oxdan aşağı sahə mənfidir; yolda isə mütləq qiymətlərlə toplanır). x(t)-də: mailiyyət = sürət.",
      gen() {
        const kind = pick(["S", "S", "a", "yol", "xv", "xS"]);
        if (kind === "xv" || kind === "xS") {
          for (;;) {
            const t1 = rnd(1, 4), t2 = t1 + rnd(1, 4), t3 = t2 + rnd(1, 4), x0 = rnd(-4, 6);
            const pts = [[0, x0], [t1, x0 + rnd(-3, 5) * t1], [t2, 0], [t3, 0]]; pts[2][1] = pts[1][1] + rnd(-4, 4) * (t2 - t1); pts[3][1] = pts[2][1] + rnd(-4, 4) * (t3 - t2);
            if (Math.max(...pts.map(p => Math.abs(p[1]))) > 40) continue;
            const seg = rnd(0, 2), v = (pts[seg + 1][1] - pts[seg][1]) / (pts[seg + 1][0] - pts[seg][0]);
            const picV = (kind === "xv");
            if (picV) { if (v === 0 && Math.random() < .5) continue;
              return R(v, "m/s", { svg: graph(pts, "x, m"), text: `Şəkildə cismin koordinatının zamandan asılılığı verilib (düz parçalar). ${seg === 0 ? `Birinci` : seg === 1 ? "İkinci" : "Üçüncü"} parçada (${pts[seg][0]}–${pts[seg + 1][0]} s) sürətin proyeksiyasını tap.`,
                solution: `x(t) qrafikində sürət mailiyyətdir: v = Δx/Δt = (${F(pts[seg + 1][1])} − (${F(pts[seg][1])}))/${pts[seg + 1][0] - pts[seg][0]} = ${F(v)} m/s.` }); }
            const d = pts[3][1] - pts[0][1];
            return R(d, "m", { svg: graph(pts, "x, m"), text: "Şəkildə cismin koordinatının zamandan asılılığı verilib (düz parçalar). Bütün müddətdə (0–" + pts[3][0] + " s) yerdəyişmənin proyeksiyasını tap.",
              solution: `Yerdəyişmə = son koordinat − ilk koordinat = ${F(pts[3][1])} − (${F(pts[0][1])}) = ${F(d)} m. (Aradakı hərəkət əhəmiyyət daşımır.)` });
          }
        }
        for (;;) {
          const t1 = rnd(1, 4), t2 = t1 + rnd(1, 5), t3 = t2 + rnd(1, 4), v0 = rnd(0, 6), v1 = rnd(-6, 10), v2 = kind === "yol" ? rnd(-8, 8) : rnd(0, 10), v3 = rnd(-6, 8);
          const pts = [[0, v0], [t1, v1], [t2, v2], [t3, v3]];
          if (new Set(pts.map(p => p[1])).size < 3) continue;
          const { disp, path } = areas(pts);
          if (kind === "S") {
            if (!nice(disp, 1) || Math.abs(disp) > 120) continue;
            return R(disp, "m", { svg: graph(pts, "v, m/s"), text: `Şəkildə cismin sürətinin proyeksiyasının zamandan asılılığı verilib (düz parçalar). Bütün müddətdə (0–${t3} s) yerdəyişmənin proyeksiyasını tap.`,
              solution: `Yerdəyişmə = qrafikin altındakı işarəli sahə. Hər parça trapesiyadır: ` + [0, 1, 2].map(i => `(${F(pts[i][1])} + ${P(pts[i + 1][1])})/2·${pts[i + 1][0] - pts[i][0]} = ${F((pts[i][1] + pts[i + 1][1]) / 2 * (pts[i + 1][0] - pts[i][0]))}`).join("; ") + `. Cəmi: ${F(disp)} m (oxdan aşağı hissə mənfi sayılır).` });
          }
          if (kind === "a") {
            const seg = rnd(0, 2), a = (pts[seg + 1][1] - pts[seg][1]) / (pts[seg + 1][0] - pts[seg][0]);
            if (!nice(a, 2)) continue;
            return R(a, "m/s²", { svg: graph(pts, "v, m/s"), text: `Şəkildə cismin sürətinin proyeksiyasının zamandan asılılığı verilib. ${seg === 0 ? "Birinci" : seg === 1 ? "İkinci" : "Üçüncü"} parçada (${pts[seg][0]}–${pts[seg + 1][0]} s) təcilin proyeksiyasını tap.`,
              solution: `v(t) qrafikində təcil mailiyyətdir: a = Δv/Δt = (${F(pts[seg + 1][1])} − (${F(pts[seg][1])}))/${pts[seg + 1][0] - pts[seg][0]} = ${F(a)} m/s².` });
          }
          if (!nice(path, 1) || path > 120 || Math.abs(disp - path) < 1) continue;
          return R(path, "m", { svg: graph(pts, "v, m/s"), text: `Şəkildə cismin sürətinin proyeksiyasının zamandan asılılığı verilib (düz parçalar). Cismin 0–${t3} s-də getdiyi yolu tap.`,
            solution: `Yol üçün oxdan aşağı və yuxarı sahələr mütləq qiymətlə toplanır (cisim dönəndə yol yerdəyişmədən böyük olur). Yol = ${F(path)} m, yerdəyişmə isə ${F(disp)} m olardı.` });
        }
      } },
    { id: "gorus", ad: "Görüş və yetişmə", izah: "İki cismin koordinatını yaz, x₁ = x₂ tənliyini həll et. Bir-birinə doğru: sürətlər toplanır; yetişmə: sürətlər çıxılır.",
      gen() {
        const kind = pick(["gor", "gor", "yet", "yet", "tec", "gec"]);
        if (kind === "gor") {
          const v1 = rnd(2, 12), v2 = rnd(2, 12), t = rnd(2, 10), L = (v1 + v2) * t, w = pick(["t", "x"]);
          const base = `Ox boyu iki cisim bir-birinə doğru hərəkət edir: birinci x = 0 nöqtəsindən müsbət istiqamətdə ${v1} m/s sürətlə, ikinci x = ${L} m nöqtəsindən əks istiqamətdə ${v2} m/s sürətlə eyni anda yola düşüb.`;
          return w === "t" ? R(t, "s", { text: base + " Neçə saniyədən sonra görüşəcəklər?", solution: `x₁ = ${v1}t, x₂ = ${L} − ${v2}t. x₁ = x₂ → ${v1 + v2}t = ${L} → t = ${t} s.` })
            : R(v1 * t, "m", { text: base + " Görüş nöqtəsinin koordinatı nədir?", solution: `x₁ = ${v1}t, x₂ = ${L} − ${v2}t. ${v1 + v2}t = ${L} → t = ${t} s. x = ${v1}·${t} = ${v1 * t} m.` });
        }
        if (kind === "yet") {
          const v1 = rnd(2, 10), v2 = v1 + rnd(1, 6), t = rnd(2, 12), d = (v2 - v1) * t, w = pick(["t", "s"]);
          const base = `Qabaqda ${d} m məsafədə ${v1} m/s sürətlə gedən velosipedçiyə arxadan ${v2} m/s sürətlə gedən motosikletçi yetişir.`;
          return w === "t" ? R(t, "s", { text: base + " Neçə saniyədən sonra yetişəcək?", solution: `Yaxınlaşma sürəti ${v2} − ${v1} = ${v2 - v1} m/s. t = ${d}/${v2 - v1} = ${t} s.` })
            : R(v2 * t, "m", { text: base + " Yetişənə qədər motosikletçi neçə metr gedəcək?", solution: `t = ${d}/(${v2} − ${v1}) = ${t} s. s = ${v2}·${t} = ${v2 * t} m.` });
        }
        if (kind === "tec") {
          const a = pick([1, 2, 2.5, 4, 5]), t = rnd(2, 10), v = a * t / 2, w = pick(["t", "v", "s"]);
          if (!nice(v, 2)) return this.gen();
          const base = `Avtomobil ${F(v)} m/s sabit sürətlə gedərək işıqforu keçir. Həmin anda işıqfordakı polis motosikleti sükunətdən ${F(a)} m/s² təcillə onu qovmağa başlayır.`;
          if (w === "t") return R(t, "s", { text: base + " Neçə saniyədən sonra motosiklet avtomobilə çatacaq?", solution: `v·t = at²/2 → t = 2v/a = 2·${F(v)}/${F(a)} = ${t} s.` });
          if (w === "s") return R(v * t, "m", { text: base + " Çatana qədər motosiklet işıqfordan neçə metr gedəcək?", solution: `t = 2v/a = ${t} s. s = v·t = ${F(v)}·${t} = ${F(v * t)} m.` });
          return R(a * t, "m/s", { text: base + " Motosiklet avtomobilə çatanda sürəti nə qədər olacaq?", solution: `t = 2v/a = ${t} s. Motosikletin sürəti v_m = a·t = ${F(a)}·${t} = ${F(a * t)} m/s (avtomobilin sürətindən 2 dəfə çox).` });
        }
        for (let i = 0; i < 100; i++) {
          const v1 = rnd(2, 10), v2 = v1 + rnd(1, 6), tb = rnd(2, 10), tau = tb * (v2 - v1) / v1;
          if (!Number.isInteger(tau) || tau < 1 || tau > 20) continue;
          return R(tb, "s", { text: `Velosipedçi ${v1} m/s sürətlə yola çıxdı. ${tau} s sonra eyni nöqtədən onun ardınca motosikletçi ${v2} m/s sürətlə yola düşdü. Motosikletçi yola düşəndən neçə saniyə sonra velosipedçiyə yetişəcək?`,
            solution: `Motosikletçi çıxanda velosipedçi ${v1}·${tau} = ${v1 * tau} m irəlidədir. Yaxınlaşma sürəti ${v2} − ${v1} = ${v2 - v1} m/s. t = ${v1 * tau}/${v2 - v1} = ${tb} s.` });
        }
        return this.gen();
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .6) {
          const c = pick([-1, -2, -3]), ts = rnd(2, 5), a = 2 * c, v0 = -a * ts, x0 = rnd(2, 12);
          task = `Cismin koordinatı x = ${poly([[x0, ""], [v0, "t"], [c, "t²"]])} (m, s) qanunu ilə dəyişir. Cismin ala biləcəyi ən böyük koordinat nədir?`;
          const tUse = bad === 0 ? 2 * ts : ts, sUse = v0 * tUse + c * tUse * tUse, sGood = v0 * ts + c * ts * ts;
          const sShow = bad === 1 ? v0 * ts - c * ts * ts : sUse, xFinal = x0 + sShow;
          steps = [
            bad === 0 ? `Ən böyük koordinat sürət sıfır olanda olur. Qanundan a = ${F(c)} m/s², v = ${F(v0)} + (${F(c)})t = 0 → t = ${tUse} s.` : `Ən böyük koordinat sürət sıfır olanda olur. Qanundan a = 2·(${F(c)}) = ${F(a)} m/s², v = ${F(v0)} + (${F(a)})t = 0 → t = ${ts} s.`,
            `Bu müddətdə yerdəyişmə: s = v₀t + ct² = ${F(v0)}·${tUse} + (${F(bad === 1 ? -c : c)})·${tUse * tUse} = ${F(sShow)} m.`,
            bad === 2 ? `Cavab: x_max = ${F(sGood)} m.` : `Koordinat: x = x₀ + s = ${F(x0)} + ${F(sShow)} = ${F(xFinal)} m. Cavab: ${F(xFinal)} m.`,
          ];
          const good = x0 + sGood;
          why = [`1-ci addım: qanundakı t² əmsalı a/2-dir, ona görə a = 2c = ${F(a)} m/s², dönmə anı t = ${ts} s. Düz cavab: ${F(good)} m.`,
            `2-ci addım: s = v₀t + ct², c = ${F(c)} mənfidir — işarəni dəyişmək olmaz. Düz s = ${F(sGood)} m, cavab ${F(good)} m.`,
            `3-cü addım: ${F(sGood)} m yerdəyişmədir, koordinat deyil. x₀ = ${F(x0)} əlavə olunmalıdır: x_max = ${F(x0)} + ${F(sGood)} = ${F(good)} m.`][bad];
        } else {
          const [a, b, m] = pick(PAIRS), gcd = (x, y) => y ? gcd(y, x % y) : x, L = 2 * a * b / gcd(a, b);
          task = `Avtomobil yolun yarısını ${a} m/s, qalan yarısını ${b} m/s sürətlə getdi. Orta sürəti neçədir? (Yolu ${L} m götürək.)`;
          const half = bad === 0 ? L : L / 2, t1 = half / a, t2 = half / b;
          const tTot = bad === 1 ? (t1 + t2) / 2 : t1 + t2;
          steps = [
            `Hər yarının yolu ${F(half)} m. Vaxtlar: t₁ = ${F(half)}/${a} = ${F(t1)} s, t₂ = ${F(half)}/${b} = ${F(t2)} s.`,
            bad === 1 ? `Bütün vaxt: t = (t₁ + t₂)/2 = ${F(tTot)} s.` : `Bütün vaxt: t = t₁ + t₂ = ${F(tTot)} s.`,
            bad === 2 ? `Orta sürət v = (${a} + ${b})/2 = ${F((a + b) / 2)} m/s.` : `Orta sürət v = ${L}/${F(tTot)} = ${F(L / tTot)} m/s.`,
          ];
          why = [`1-ci addım: yarının yolu L/2 = ${F(L / 2)} m-dir, bütün ${L} m deyil. Düz orta sürət ${m} m/s.`,
            `2-ci addım: bütün vaxt iki hissənin cəmidir, orta hesab yox: t = ${F(L / 2 / a + L / 2 / b)} s. Düz orta sürət ${m} m/s.`,
            `3-cü addım: orta sürət = bütün yol / bütün vaxt = ${L}/${F(L / 2 / a + L / 2 / b)} = ${m} m/s. Sürətlərin orta hesabı (${F((a + b) / 2)}) səhvdir.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Metro, lift, qaçışçı, əyləc — hərəkəti hissələrə böl. Hər hissənin sonundakı sürət növbəti hissənin başlanğıcıdır.",
      gen() {
        const kind = pick(["metro", "lift", "qacis", "reaksiya", "mane"]);
        if (kind === "metro" || kind === "lift") {
          for (;;) {
            const a1 = pick([1, 1.5, 2, 2.5]), t1 = pick([4, 5, 6, 8, 10]), v = a1 * t1, t2 = pick(kind === "lift" ? [2, 3, 4, 5, 6] : [20, 30, 40, 60]), a2 = pick([1, 1.5, 2, 2.5, 3]);
            const t3 = v / a2, s = v * t1 / 2 + v * t2 + v * t3 / 2;
            if (!nice(t3, 2) || !nice(s, 2) || (kind === "lift" && s > 150)) continue;
            if (kind === "metro") return R(s, "m", { text: `Metro qatarı stansiyadan sükunətdən ${F(a1)} m/s² təcillə ${t1} s sürətlənir, sonra ${t2} s sabit sürətlə gedir, sonra ${F(a2)} m/s² təcillə yavaşıyaraq növbəti stansiyada dayanır. Stansiyalar arası məsafə nə qədərdir?`,
              solution: `v = a₁t₁ = ${F(a1)}·${t1} = ${F(v)} m/s. 1) ${F(v * t1 / 2)} m (orta sürət ${F(v / 2)}). 2) ${F(v)}·${t2} = ${F(v * t2)} m. 3) yavaşıma ${F(t3)} s çəkir, yol ${F(v * t3 / 2)} m. Cəmi ${F(s)} m.` });
            return R(s, "m", { text: `Lift birinci mərtəbədən sükunətdən ${F(a1)} m/s² təcillə ${t1} s qalxır, sonra ${t2} s sabit sürətlə, sonra ${F(a2)} m/s² təcillə yavaşıyaraq dayanır. Lift neçə metr qalxıb?`,
              solution: `v = ${F(a1)}·${t1} = ${F(v)} m/s. Sürətlənmə: ${F(v * t1 / 2)} m. Sabit sürət: ${F(v)}·${t2} = ${F(v * t2)} m. Yavaşıma: vaxt ${F(t3)} s, yol ${F(v * t3 / 2)} m. Cəmi ${F(s)} m. (v(t) trapesiyasının sahəsi.)` });
          }
        }
        if (kind === "qacis") {
          for (;;) {
            const v = pick([8, 10, 12]), t1 = pick([2, 3, 4, 5]), L = pick([60, 100, 150, 200]), rest = (L - v * t1 / 2) / v;
            if (!nice(rest, 2)) continue;
            return R(t1 + rest, "s", { text: `Qaçışçı start götürüb ${t1} s ərzində sükunətdən ${v} m/s sürətə qədər bərabərtəcilli sürətlənir, sonra bu sürətlə sabit qaçır. ${L} m məsafəni neçə saniyəyə qaçar?`,
              solution: `Sürətlənmə zamanı yol: ${v}/2·${t1} = ${F(v * t1 / 2)} m. Qalan ${F(L - v * t1 / 2)} m sabit sürətlə: ${F(L - v * t1 / 2)}/${v} = ${F(rest)} s. Cəmi ${t1} + ${F(rest)} = ${F(t1 + rest)} s.` });
          }
        }
        if (kind === "reaksiya") {
          for (;;) {
            const [k, v] = pick(KMH.slice(2)), tr = pick([0.5, 0.8, 1, 1.2, 1.5]), a = pick([4, 5, 6, 7.5, 8]), S = v * tr + v * v / (2 * a);
            if (!nice(S, 2)) continue;
            return R(S, "m", { text: `Avtomobil ${k} km/saat sürətlə gedir. Sürücü maneəni görəndən ${F(tr)} s sonra əyləci basır (bu müddətdə sürət dəyişmir), sonra avtomobil ${F(a)} m/s² təcillə yavaşıyır. Maneəni görəndən tam dayanana qədər avtomobil neçə metr gedəcək?`,
              solution: `${k} km/saat = ${v} m/s. Reaksiya yolu: ${v}·${F(tr)} = ${F(v * tr)} m. Əyləc yolu: v²/(2a) = ${v * v}/${F(2 * a)} = ${F(v * v / (2 * a))} m. Cəmi ${F(S)} m.` });
          }
        }
        for (let i = 0; i < 400; i++) {
          const v0 = pick([15, 20, 25, 30]), a = pick([2, 2.5, 4, 5]), d = rnd(10, 150), q = v0 * v0 - 2 * a * d, v = Math.sqrt(q);
          if (q <= 0 || !Number.isInteger(v)) continue;
          return R(v, "m/s", { text: `Avtomobil ${v0} m/s sürətlə gedir. Sürücü ${d} m qabaqda maneə görüb ${F(a)} m/s² təcillə əyləc edir. Avtomobil maneəyə çatanda sürəti nə qədər olacaq?`,
            solution: `Vaxt verilmir: v² = v₀² − 2as = ${v0 * v0} − 2·${F(a)}·${d} = ${q} → v = ${v} m/s. Sürət sıfır deyil — avtomobil maneəyə qədər dayana bilmir.` });
        }
        return this.gen();
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, a picture in each, several steps;
  // the wrong options are the answers of typical mistakes. Questions 2 and 3 also use maths topics passed earlier
  // ("xetti-funksiya": a straight line through two points; "xetti-tenlikler": a linear equation x₁ = x₂).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const okn = (x, d = 2) => isFinite(x) && nice(x, d);
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  const KI = "var(--ink,#17171a)", KA = "var(--accent,#a32d2d)", KM = "var(--muted,#6b6b73)", KP = "var(--paper,#fff)", KV = "var(--vec,#0c447c)", KG = "var(--line,#d9d9de)";
  const f1 = n => +(+n).toFixed(1);
  const kl = (x1, y1, x2, y2, c = KI, w = 2, ex = "") => `<line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const kt = (x, y, s, a = "middle", c = KI, sz = 12) => `<text x="${f1(x)}" y="${f1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const kd = (x, y, c = KI, r = 3.4) => `<circle cx="${f1(x)}" cy="${f1(y)}" r="${r}" fill="${c}"/>`;
  const kr = (x, y, w, h, c = KP, st = KI) => `<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" fill="${c}" stroke="${st}" stroke-width="2"/>`;
  const ka = (x1, y1, x2, y2, c = KA, w = 2.5) => kl(x1, y1, x2, y2, c, w, ` marker-end="url(#kn-ar)"`);
  const kdim = (x1, x2, y, lab) => kl(x1, y, x2, y, KM, 1.6, ` marker-start="url(#kn-ar)" marker-end="url(#kn-ar)"`) + kt((x1 + x2) / 2, y - 6, lab, "middle", KM, 12);
  const ksvg = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" class="oy-svg" role="img" aria-label="${aria}"><defs><marker id="kn-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  // gridded graph through lattice points; series [{pts, nolat}], dots [[t, y, colour, label?]]
  const stepFor = (vals, lo, hi) => { for (const s of [10, 5, 2]) if (vals.every(v => v % s === 0) && (hi - lo) / s >= 3) return s; return 1; };
  function kplot(o) {
    const W = 300, H = 220, Lm = 46, Rm = 20, Tm = 24, Bm = 34;
    const lat = o.series.filter(s => !s.nolat).flatMap(s => s.pts).concat((o.dots || []).map(d => [d[0], d[1]]));
    const xs = lat.map(p => p[0]).concat(o.xhi ? [o.xhi] : []), ys = lat.map(p => p[1]);
    const xst = stepFor(xs, 0, Math.max(...xs)), yst = stepFor(ys, Math.min(0, ...ys), Math.max(0, ...ys));
    const lab = (o.dots || []).filter(d => d[3]);
    let xmax = Math.ceil(Math.max(...xs) / xst) * xst, ymin = Math.floor(Math.min(0, ...ys) / yst) * yst, ymax = Math.ceil(Math.max(0, ...ys) / yst) * yst;
    if (lab.some(d => d[1] === ymax)) ymax += yst; if (lab.some(d => d[1] === ymin && ymin < 0)) ymin -= yst;   // room for a label
    const tx = t => Lm + t / xmax * (W - Lm - Rm), ty = y => Tm + (ymax - y) / (ymax - ymin) * (H - Tm - Bm);
    let s = "";
    for (let y = ymin; y <= ymax; y += yst) s += kl(Lm, ty(y), W - Rm, ty(y), KG, 1) + (y === 0 && ymin === 0 ? "" : kt(Lm - 6, ty(y) + 4, F(y), "end", KM, 11));
    for (let t = 0; t <= xmax; t += xst) s += kl(tx(t), Tm, tx(t), H - Bm, KG, 1) + kt(tx(t), H - Bm + 15, F(t), "middle", KM, 11);
    s += kl(Lm, ty(0), W - Rm, ty(0), KI, 1.8) + kl(Lm, Tm - 6, Lm, H - Bm, KI, 1.8) + kt(Lm + 6, Tm - 9, o.yl, "start") + kt(W - Rm, H - 6, o.xl || "t, s", "end");
    for (const sr of o.series) s += `<polyline points="${sr.pts.map(p => f1(tx(p[0])) + "," + f1(ty(p[1]))).join(" ")}" fill="none" stroke="${KA}" stroke-width="2.8" stroke-linejoin="round" stroke-linecap="round"/>`;
    for (const [t, y, c, lab, pos = "rt"] of o.dots || []) {
      s += kd(tx(t), ty(y), c || KV, 3.8);
      if (lab) { const left = pos[0] === "l"; s += kt(tx(t) + (left ? -8 : 8), ty(y) + (pos[1] === "t" ? -8 : 15), lab, left ? "end" : "start", KI, 11); }
    }
    return ksvg(W, H, s, o.aria);
  }
  // areas under a piecewise-linear v(t): signed (displacement), path, path without splitting at the zero crossing, positive part only
  function vareas(pts) {
    let disp = 0, path = 0, noCross = 0, pos = 0;
    for (let i = 1; i < pts.length; i++) {
      const [t0, a] = pts[i - 1], [t1, b] = pts[i], dt = t1 - t0;
      disp += (a + b) / 2 * dt; noCross += (Math.abs(a) + Math.abs(b)) / 2 * dt;
      if (a * b >= 0) { path += Math.abs(a + b) / 2 * dt; if (a + b > 0) pos += (a + b) / 2 * dt; }
      else { const tz = dt * Math.abs(a) / (Math.abs(a) + Math.abs(b)); path += Math.abs(a) * tz / 2 + Math.abs(b) * (dt - tz) / 2; pos += (a > 0 ? a * tz : b * (dt - tz)) / 2; }
    }
    return { disp, path, noCross, pos };
  }
  const crossOk = pts => pts.slice(1).every((p, i) => { const a = pts[i][1], b = p[1]; return a * b >= 0 || nice((p[0] - pts[i][0]) * Math.abs(a) / (Math.abs(a) + Math.abs(b)), 2); });
  const segTxt = pts => pts.slice(1).map((p, i) => { const [t0, a] = pts[i], [t1, b] = p, dt = t1 - t0;
    if (a * b >= 0) return `${t0}–${t1} s: (${F(Math.abs(a))} + ${F(Math.abs(b))})/2·${dt} = ${F((Math.abs(a) + Math.abs(b)) / 2 * dt)} m`;
    const tz = dt * Math.abs(a) / (Math.abs(a) + Math.abs(b));
    return `${t0}–${t1} s: sürət ${F(t0 + tz)} s anında sıfırdan keçir, iki üçbucaq: ${F(Math.abs(a))}·${F(tz)}/2 + ${F(Math.abs(b))}·${F(dt - tz)}/2 = ${F((Math.abs(a) * tz + Math.abs(b) * (dt - tz)) / 2)} m`; }).join("; ");
  const figMeet = (v1, v2, L) => ksvg(300, 120, kl(20, 66, 280, 66, KI, 2.5) + kd(34, 66) + kd(266, 66) + kt(34, 86, "A") + kt(266, 86, "B")
    + ka(42, 46, 104, 46, KA) + kt(73, 38, "v₁ = " + F(v1) + " m/s", "middle", KA, 11) + ka(258, 46, 196, 46, KV) + kt(227, 38, "v₂ = " + F(v2) + " m/s", "middle", KV, 11) + kdim(34, 266, 108, "L = " + F(L) + " m"), "A və B nöqtələri arasında L məsafə; A-dan v₁, B-dən v₂ sürətlə bir-birinə doğru");
  const figTrap = () => ksvg(300, 175, kl(40, 140, 285, 140, KI, 1.8) + kl(40, 140, 40, 18, KI, 1.8) + kt(46, 16, "v", "start") + kt(284, 160, "t", "end")
    + `<polyline points="40,140 100,52 200,52 255,140" fill="none" stroke="${KA}" stroke-width="2.8" stroke-linejoin="round"/>`
    + kl(100, 52, 100, 140, KM, 1, ` stroke-dasharray="4 3"`) + kl(200, 52, 200, 140, KM, 1, ` stroke-dasharray="4 3"`) + kl(40, 52, 100, 52, KM, 1, ` stroke-dasharray="4 3"`)
    + kt(70, 156, "t₁") + kt(150, 156, "t₂") + kt(228, 156, "t₃ = ?") + kt(54, 98, "a₁", "end", KA) + kt(252, 98, "a₂", "start", KA) + kt(150, 44, "v = sabit", "middle", KA), "Sürətin zamandan asılılığı: sürətlənmə, sabit sürət, yavaşıma");
  const figBrake = (v0, L) => ksvg(300, 130, kl(14, 84, 290, 84, KI, 2.5) + kr(26, 58, 56, 20) + kd(40, 84, KI, 5) + kd(68, 84, KI, 5) + ka(30, 44, 78, 44, KA) + kt(54, 36, "v₀ = " + F(v0) + " m/s", "middle", KA, 11)
    + kr(238, 40, 24, 44, KM, KI) + kt(250, 67, "!", "middle", KP, 18) + kdim(82, 238, 116, "L = " + F(L) + " m"), "Avtomobil, ondan L məsafədə maneə");
  const figChase = (v, d) => ksvg(300, 138, kl(14, 84, 290, 84, KI, 2.5) + kr(24, 58, 44, 20) + kd(36, 84, KI, 5) + kd(58, 84, KI, 5) + kt(20, 104, "motosiklet (v₀ = 0, a)", "start", KA, 11)
    + kr(150, 58, 56, 20) + kd(164, 84, KI, 5) + kd(194, 84, KI, 5) + ka(154, 44, 208, 44, KV) + kt(181, 36, "v = " + F(v) + " m/s", "middle", KV, 11) + kdim(68, 150, 128, "d = " + F(d) + " m"), "Sükunətdəki motosikletdən d məsafədə sabit sürətlə gedən avtomobil");
  const figBridge = (L, l, kmh) => ksvg(300, 130, kl(14, 90, 290, 90, KG, 1) + kr(118, 70, 160, 8, KM, KI) + kl(130, 78, 130, 100, KI, 3) + kl(266, 78, 266, 100, KI, 3)
    + kr(22, 52, 90, 26) + kd(38, 84, KI, 5) + kd(96, 84, KI, 5) + kl(104, 52, 104, 78, KI, 2) + ka(28, 40, 96, 40, KA) + kt(62, 32, "v = " + F(kmh) + " km/saat", "middle", KA, 11)
    + kdim(22, 112, 112, "l = " + F(l) + " m") + kdim(118, 278, 112, "L = " + F(L) + " m"), "Qatar uzunluğu l, körpünün uzunluğu L");
  const Q5 = [];   // parameter sets of question 5 whose answer and wrong options are all neat numbers
  for (const v of [6, 9, 12, 15, 18, 24, 30]) for (const t1 of [3, 4, 5, 6, 8, 10]) for (const t2 of [10, 20, 30, 40, 60]) for (const a2 of [1, 1.5, 2, 2.5, 3, 4, 5]) {
    const a1 = v / t1, t3 = v / a2, s = v * (t1 + 2 * t2 + t3) / 2, avg = s / (t1 + t2 + t3);
    if (a1 <= 5 && nice(a1, 1) && [avg, t3, v / 2, 2 * v / 3, s / (t1 + t2)].every(x => ok2(x))) Q5.push([v, t1, t2, a2]);
  }
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. v(t) with a sign change: the path (not the displacement)
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const t1 = rnd(1, 4), t2 = t1 + rnd(1, 4), t3 = t2 + rnd(1, 4), pts = [[0, rnd(0, 6)], [t1, rnd(-8, 10)], [t2, rnd(-8, 10)], [t3, rnd(-8, 8)]], vs = pts.map(p => p[1]);
      if (t3 > 12 || new Set(vs).size < 3 || !crossOk(pts) || !pts.some((p, i) => i && pts[i - 1][1] * p[1] < 0)) return null;
      if (Math.max(0, ...vs) - Math.min(0, ...vs) > 12) return null;
      const { disp, path, noCross, pos } = vareas(pts), ma = vs.reduce((s, v) => s + Math.abs(v), 0) / 4 * t3;
      const w = [Math.abs(disp), noCross, pos, ma]; if (![path, ...w].every(x => ok2(x))) return null;
      return mc(ae(path, w, U_("m")), { svg: svgEl(kplot({ series: [{ pts }], dots: pts.map(p => [p[0], p[1]]), yl: "v, m/s", aria: "Sürətin proyeksiyasının zamandan asılılıq qrafiki, düz parçalar" })),
        text: `Şəkildə cismin sürətinin proyeksiyasının zamandan asılılığı verilib (düz parçalar). Cismin 0–${t3} s-də getdiyi yolu tap.`,
        solution: `Yol = oxdan yuxarı və aşağı sahələrin mütləq qiymətlərinin cəmi. Parçalar: ${segTxt(pts)}. Cəmi ${F(path)} m. Tələlər: yerdəyişmənin modulu ${F(Math.abs(disp))} m (mənfi sahəni çıxmaq), sıfırdan keçən parçanı bir trapesiya saymaq (${F(noCross)} m), mənfi sahəni atmaq (${F(pos)} m).` });
    }) },
    // 2. (xetti-funksiya) x(t) is a straight line through two marked points: when does x reach X?
    { tip: "qapali", birlesik: "xetti-funksiya", gen: () => again(() => {
      const v = rnd(1, 6), ta = rnd(1, 4), tb = ta + rnd(2, 4), x0 = rnd(-12, 10), xa = x0 + v * ta, xb = x0 + v * tb, tg = tb + rnd(2, 8), X = x0 + v * tg;
      if (Math.max(0, xa, xb) - Math.min(0, xa, xb) > 12 || X > 99 || xa === 0 || xb === 0 || xa === xb) return null;
      const w = [(X - xa) / v, X / v, (X - xb) / v, X * tb / xb]; if (![tg, ...w].every(x => ok2(x))) return null;
      const pts = [[ta, xa], [tb, xb]];
      return mc(ae(tg, w, U_("s")), { svg: svgEl(kplot({ series: [{ pts }], dots: [[ta, xa, KV, `(${ta}; ${F(xa)})`, "rb"], [tb, xb, KV, `(${tb}; ${F(xb)})`, "lt"]], yl: "x, m", aria: "Cismin koordinatının zamandan asılılıq qrafiki: düz xətt, iki nöqtə işarələnib" })),
        text: `Şəkildə bərabərsürətli hərəkət edən cismin x(t) qrafiki (düz xətt) verilib, iki nöqtə işarələnib. Hərəkət qrafikdən sonra da eyni qanunla davam edir. Cisim hansı anda x = ${F(X)} m koordinatından keçəcək?`,
        solution: `Düz xətt: x = x₀ + vt. Sürət mailiyyətdir: v = (${F(xb)} − ${P(xa)})/(${tb} − ${ta}) = ${F(v)} m/s. İlk nöqtədən x₀: ${F(xa)} = x₀ + ${v}·${ta} → x₀ = ${F(x0)} m. Tənlik: ${F(X)} = ${F(x0)} + ${v}t → t = ${F(tg)} s. Tələlər: x₀-ı unutmaq (${F(+(X / v).toFixed(4))} s), işarələnmiş nöqtənin vaxtını əlavə etməmək (${F(+((X - xa) / v).toFixed(4))} s), ikinci nöqtədən saymaq (${F(+((X - xb) / v).toFixed(4))} s), xətti başlanğıcdan keçən saymaq (${F(+(X * tb / xb).toFixed(4))} s).` });
    }) },
    // 3. (xetti-tenlikler) meeting with a delayed start: x₁ = x₂ as a linear equation
    { tip: "qapali", birlesik: "xetti-tenlikler", gen: () => again(() => {
      const v1 = rnd(2, 12), v2 = rnd(2, 12), t = rnd(4, 20), t0 = rnd(2, t - 1), L = (v1 + v2) * t - v2 * t0;
      if (L <= 0 || L > 999) return null;
      const w = [L / (v1 + v2), t - t0, (L - v2 * t0) / (v1 + v2), (L + v1 * t0) / (v1 + v2)]; if (![t, ...w].every(x => ok2(x))) return null;
      return mc(ae(t, w, U_("s")), { svg: svgEl(figMeet(v1, v2, L)), text: `A və B nöqtələri arasındakı məsafə ${L} m-dir. A-dan B-yə doğru ${v1} m/s sürətlə velosipedçi yola düşür. ${t0} s sonra B-dən ona doğru ikinci velosipedçi ${v2} m/s sürətlə çıxır. Birinci yola düşəndən neçə saniyə sonra görüşəcəklər?`,
        solution: `A-dan sayaq, vaxtı birinci yola düşəndən ölçək. x₁ = ${v1}t; ikinci ${t0} s gec çıxıb: x₂ = ${L} − ${v2}(t − ${t0}). Görüş: x₁ = x₂ → ${v1}t = ${L} − ${v2}t + ${v2 * t0} → ${v1 + v2}t = ${L + v2 * t0} → t = ${F(t)} s. Tələlər: gecikməni unutmaq (${F(+(L / (v1 + v2)).toFixed(4))} s), vaxtı ikinci cismin çıxışından saymaq (${F(t - t0)} s), gecikməni səhv cismə aid etmək.` });
    }) },
    // 4. v(t) trapezoid + starting coordinate: x = x₀ + area
    { tip: "qapali", gen: () => again(() => {
      const v = rnd(2, 10), t1 = rnd(1, 4), t2 = t1 + rnd(1, 5), t3 = t2 + rnd(1, 4), x0 = rnd(-20, 20), s = v * (t3 + t2 - t1) / 2, x = x0 + s;
      if (!x0 || t3 > 12) return null;
      const w = [s, x0 + v * t3, x0 + v * t3 / 2, x0 + v * (t2 - t1)]; if (![x, ...w].every(q => okn(q))) return null;
      const pts = [[0, 0], [t1, v], [t2, v], [t3, 0]];
      return mc(ae(x, w, U_("m")), { svg: svgEl(kplot({ series: [{ pts }], dots: pts.slice(1, 3), yl: "v, m/s", aria: "Sürətin zamandan asılılığı: sükunətdən sürətlənmə, sabit sürət, dayanma" })),
        text: `Cisim x₀ = ${F(x0)} m koordinatlı nöqtədən düz xətt boyu hərəkətə başlayıb. Şəkildə sürətinin proyeksiyasının zamandan asılılığı verilib. t = ${t3} s anında cismin koordinatı nə qədərdir?`,
        solution: `Yerdəyişmə = trapesiyanın sahəsi: (${t3} + ${t2 - t1})/2·${v} = ${F(s)} m. Koordinat x = x₀ + sₓ = ${F(x0)} + ${F(s)} = ${F(x)} m. Tələlər: x₀-ı əlavə etməmək (${F(s)} m), trapesiyanı düzbucaqlı saymaq (${F(x0 + v * t3)} m) və ya üçbucaq saymaq (${F(+(x0 + v * t3 / 2).toFixed(4))} m), yalnız sabit sürət hissəsini götürmək (${F(x0 + v * (t2 - t1))} m).` });
    }) },
    // 5. three stages (a₁, constant, a₂): the average speed over the whole way
    { tip: "qapali", gen: () => again(() => {
      const [v, t1, t2, a2] = pick(Q5), a1 = v / t1, t3 = v / a2, s = v * (t1 + 2 * t2 + t3) / 2, T = t1 + t2 + t3, avg = s / T, w = [v / 2, v, s / (t1 + t2), 2 * v / 3];
      return mc(ae(avg, w, U_("m/s")), { svg: svgEl(figTrap()), text: `Qatar stansiyadan sükunətdən ${F(a1)} m/s² təcillə ${t1} s sürətlənir, sonra ${t2} s sabit sürətlə gedir, sonra ${F(a2)} m/s² təcillə yavaşıyaraq növbəti stansiyada dayanır (şəkil). Bütün yol boyu orta sürəti nə qədərdir?`,
        solution: `v = a₁t₁ = ${F(a1)}·${t1} = ${F(v)} m/s. Yavaşıma vaxtı t₃ = v/a₂ = ${F(t3)} s. Yol = trapesiyanın sahəsi: ${F(v)}·(${t1} + 2·${t2} + ${F(t3)})/2 = ${F(s)} m. Bütün vaxt ${t1} + ${t2} + ${F(t3)} = ${F(T)} s. Orta sürət = ${F(s)}/${F(T)} = ${F(avg)} m/s. Tələlər: v/2 (yalnız sürətlənmənin orta sürəti), v (sabit hissə), yolu yavaşıma vaxtsız bölmək (${F(+(s / (t1 + t2)).toFixed(4))} m/s), hissələrin orta sürətlərini orta hesablamaq (2v/3).` });
    }) },
    // 6. reaction time + braking: how far from the obstacle does the car stop
    { tip: "qapali", gen: () => again(() => {
      const [k, v0] = pick([[36, 10], [54, 15], [72, 20], [90, 25], [108, 30]]), tr = pick([0.5, 0.8, 1, 1.2, 1.5]), a = pick([2.5, 4, 5, 6, 8, 10]), L = rnd(30, 200);
      const sr = v0 * tr, sb = v0 * v0 / (2 * a), gap = L - sr - sb;
      const w = [L - sb, L - sr - 2 * sb, sr + sb, sb]; if (gap < 1 || ![gap, ...w].every(x => ok2(x))) return null;
      return mc(ae(gap, w, U_("m")), { svg: svgEl(figBrake(v0, L)), text: `Avtomobil ${k} km/saat sürətlə gedir. Sürücü ${L} m qabaqda maneə görür və ${F(tr)} s sonra əyləci basır (bu müddətdə sürət dəyişmir). Əyləc zamanı təcilin modulu ${F(a)} m/s²-dir. Avtomobil dayananda maneəyə qədər neçə metr qalacaq? (Şəkildə v₀ SI-dədir.)`,
        solution: `${k} km/saat = ${v0} m/s (3,6-ya bölmək). Reaksiya yolu: ${v0}·${F(tr)} = ${F(sr)} m. Əyləc yolu: v₀²/(2a) = ${v0 * v0}/${F(2 * a)} = ${F(sb)} m. Qalan: ${L} − ${F(sr)} − ${F(sb)} = ${F(gap)} m. Tələlər: reaksiyanı unutmaq (${F(L - sb)} m), v₀²/a yazmaq (${F(L - sr - 2 * sb)} m), dayanma yolunu cavab yazmaq (${F(sr + sb)} m).` });
    }) },
    // 7. a motorcycle from rest catches a car that is d ahead: its speed at that moment (x₁ = x₂ is a quadratic)
    { tip: "qapali", gen: () => again(() => {
      const a = pick([1, 2, 2.5, 4, 5]), t = rnd(4, 14), v = rnd(2, 12), d = a * t * t / 2 - v * t;
      if (d < 5 || d > 300) return null;
      const w = [v, 2 * v, a * d / v, a * t / 2]; if (![a * t, ...w].every(x => ok2(x))) return null;
      return mc(ae(a * t, w, U_("m/s")), { svg: svgEl(figChase(v, d)), text: `Motosiklet sükunətdən ${F(a)} m/s² təcillə hərəkətə başlayır. Həmin anda ondan ${F(d)} m qabaqda avtomobil ${v} m/s sabit sürətlə eyni istiqamətdə gedir. Motosiklet avtomobilə çatanda motosikletin sürəti nə qədər olacaq?`,
        solution: `Əvvəl çatma anını tapaq. Motosikletin koordinatı x₁ = ${F(a)}t²/2, avtomobilin x₂ = ${F(d)} + ${v}t. x₁ = x₂ → ${F(a / 2)}t² − ${v}t − ${F(d)} = 0 → t = ${t} s (yoxlama: ${F(a / 2)}·${t * t} = ${F(a * t * t / 2)} = ${F(d)} + ${v * t}). Sonra v_m = at = ${F(a)}·${t} = ${F(a * t)} m/s. Tələlər: "çatanda sürətlər bərabərdir" (${v} m/s), 2v (d = 0 halının cavabı), a·d/v (vaxtı d/v götürmək: motosikletin təcilini hesaba qatmamaq), orta sürət at/2 (${F(a * t / 2)} m/s).` });
    }) },
    // 8. v(t) straight line crossing zero: when does the body come back to its start?
    { tip: "qapali", gen: () => again(() => {
      const v0 = pick([4, 6, 8, 10, 12]), w0 = rnd(2, 8), T = pick([3, 4, 5, 6, 8, 10]), a = (v0 + w0) / T, tb = 2 * v0 / a;
      if (w0 === v0 || v0 + w0 > 12) return null;
      const w = [T, 2 * T, v0 / a, 2 * v0 * T / Math.abs(v0 - w0)]; if (![tb, ...w].every(x => ok2(x))) return null;
      const pts = [[0, v0], [T, -w0]];
      return mc(ae(tb, w, U_("s")), { svg: svgEl(kplot({ series: [{ pts }], dots: pts, yl: "v, m/s", aria: "Sürətin zamandan asılılığı: düz xətt, sürət azalır və işarəsini dəyişir" })),
        text: `Şəkildə cismin sürətinin proyeksiyasının zamandan asılılığı verilib (təcil sabitdir və qrafikdən sonra da eynidir). Cisim başlanğıc nöqtəyə hansı anda qayıdacaq?`,
        solution: `Təcil: a = Δv/Δt = (−${w0} − ${v0})/${T} = ${F(-a)} m/s². Koordinatın dəyişməsi sₓ = v₀t + at²/2 = ${v0}t − ${F(a / 2)}t². Başlanğıca qayıdış: sₓ = 0 → t = 2v₀/|a| = ${F(tb)} s. Tələlər: dönmə anı v₀/|a| = ${F(+(v0 / a).toFixed(4))} s (orada sürət sıfırdır, cisim hələ uzaqdadır), qrafikin sonu ${T} s, təcili v₀/${T} yazmaq (${F(2 * T)} s).` });
    }) },
    // 9. a train crosses a bridge: speed in km/h, lengths in metres
    { tip: "qapali", gen: () => again(() => {
      const [k, v] = pick([[18, 5], [36, 10], [54, 15], [72, 20], [90, 25], [108, 30]]), L = 10 * rnd(10, 50), l = 10 * rnd(4, 30), t = (L + l) / v;
      const c = [L / v, (L + l) / k, l / v, (L - l) / v]; if (![t, ...c].every(x => ok2(x))) return null;
      return mc(ae(t, c, U_("s")), { svg: svgEl(figBridge(L, l, k)), text: `Uzunluğu ${l} m olan qatar ${k} km/saat sabit sürətlə uzunluğu ${L} m olan körpüdən keçir. Qatarın lokomotivi körpüyə girəndən son vaqonu körpüdən çıxana qədər neçə saniyə keçir?`,
        solution: `${k} km/saat = ${v} m/s. Lokomotiv körpüyə girəndən son vaqon çıxana qədər qatar öz uzunluğu + körpünün uzunluğu qədər yol gedir: ${l} + ${L} = ${l + L} m. t = ${l + L}/${v} = ${F(t)} s. Tələlər: yalnız körpünün uzunluğunu götürmək (${F(+(L / v).toFixed(4))} s), vahidi çevirməmək (${F(+((L + l) / k).toFixed(4))} s), yalnız qatarın uzunluğunu götürmək (${F(+(l / v).toFixed(4))} s), uzunluqları çıxmaq (${F(+((L - l) / v).toFixed(4))} s).` });
    }) },
    // 10. x(t) parabola with a marked vertex: the initial velocity (and its sign)
    { tip: "qapali", gen: () => again(() => {
      const [c0, tv] = pick([[1, 2], [1, 3], [2, 2], [3, 2], [1, 4]]), sg = pick([1, -1]), c = sg * c0, xv = rnd(-6, 8), x0 = xv + c * tv * tv, dx = x0 - xv, v0 = -2 * dx / tv;
      if (Math.max(0, x0, xv) - Math.min(0, x0, xv) > 12 || xv === 0) return null;
      const w = [2 * dx / tv, -dx / tv, dx / tv, -4 * dx / tv]; if (![v0, ...w].every(x => okn(x) && x !== 0)) return null;
      const curve = []; for (let i = 0; i <= 40; i++) { const t = 2 * tv * i / 40; curve.push([t, xv + c * (t - tv) ** 2]); }
      return mc(ae(v0, w, U_("m/s")), { svg: svgEl(kplot({ series: [{ pts: curve, nolat: true }], dots: [[0, x0, KV, `(0; ${F(x0)})`, sg > 0 ? "rt" : "rb"], [tv, xv, KV, `(${tv}; ${F(xv)})`, sg > 0 ? "rb" : "rt"]], xhi: 2 * tv, yl: "x, m", aria: "Koordinatın zamandan asılılığı: parabola, təpə nöqtəsi işarələnib" })),
        text: `Şəkildə cismin koordinatının zamandan asılılığı verilib: parabolanın bir hissəsi, təpə nöqtəsi və t = 0 nöqtəsi işarələnib. Təcil sabitdir. Cismin t = 0 anında sürətinin proyeksiyasını tap.`,
        solution: `Təpə nöqtəsində koordinat ${sg > 0 ? "ən kiçik" : "ən böyük"} olur, orada sürət sıfırdır: v(${tv}) = 0. Təpədən sayaq: x − x_təpə = a(t − ${tv})²/2. t = 0-da: ${F(x0)} − ${P(xv)} = a·${tv * tv}/2 → a = ${F(2 * dx / (tv * tv))} m/s². v = v₀ + at = 0 → v₀ = −a·${tv} = ${F(v0)} m/s. İşarə: ${v0 < 0 ? "koordinat azalır, cisim təpəyə doğru oxun əksinə gedir" : "koordinat artır, cisim təpəyə doğru oxun istiqamətində gedir"}. Tələlər: işarəni səhv seçmək (${F(2 * dx / tv)} m/s), orta sürəti başlanğıc sürət saymaq (${F(-dx / tv)} m/s), ikiqat vurmaq (${F(-4 * dx / tv)} m/s).` });
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
      key: "fiz-kinematika", title: "Hərəkət və qrafiklər", fenn: "fizika", link: "dersler/fiz-kinematika.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: m, s, m/s, m/s²). İşarəli kəmiyyətlərdə mənfi cavab mümkündür: −3. Onluq kəsr vergül və ya nöqtə ilə: 2,5.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["beraber", "tecil", "tecil", "koord", "koord", "qrafik", "qrafik", "gorus", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-kinematika.html")) b.push("dersler/fiz-kinematika.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
