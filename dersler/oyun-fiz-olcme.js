// Fizika · Ölçmə cihazları və ölçmə metodları — mastery game levels (scale reading, caliper/nonius, many oscillations, indirect measurement, significant figures) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s², π = 3,14 where stated.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const r6 = v => +(+v).toFixed(6);
  const F = v => String(r6(v)).replace("-", "−").replace(".", ",");                   // 0.04 → "0,04", −2 → "−2"
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;       // v has at most d decimals
  const dec = v => { const s = String(r6(v)), i = s.indexOf("."); return i < 0 ? 0 : s.length - i - 1; };
  // exact numeric answer: tolerance well below the last digit
  const X = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: dec(v) === 0 ? Math.max(0.05, Math.abs(v) * 0.003) : 0.4 * 10 ** -dec(v) }, extra);
  // answer obtained with π = 3,14: the last digit may differ slightly
  const XR = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: Math.max(0.4 * 10 ** -dec(v), Math.abs(v) * 0.003) }, extra);
  const PI = 3.14;

  // ---------- figures (SVG strings; the same builders are used for the lesson pictures) ----------
  const PAL = { ink: "#17171a", acc: "#534ab7", red: "#a32d2d", mut: "#6b6b73", body: "#efece2", grid: "#d8d4c4", cls: "oy-lbl" };
  const wrap = s => { const d = document.createElement("div"); d.innerHTML = s; return d; };

  // straight scale: {lo, c, major, N, unit, j?}   ticks i = 0..N, value of tick i = lo + i·c, labels on every `major`-th tick, pointer at tick j
  function linScale(c, pal = PAL) {
    const W = 320, H = 112, x0 = 24, x1 = 296, y0 = 52, xp = i => +(x0 + (x1 - x0) * i / c.N).toFixed(2);
    let s = `<svg viewBox="0 0 ${W} ${H}" class="oy-svg" role="img" aria-label="Ölçmə şkalası">`;
    s += `<rect x="8" y="${y0}" width="${W - 16}" height="54" rx="4" fill="${pal.body}" stroke="${pal.ink}" stroke-width="1.5"/>`;
    for (let i = 0; i <= c.N; i++) {
      const maj = i % c.major === 0, x = xp(i);
      s += `<line x1="${x}" y1="${y0}" x2="${x}" y2="${y0 + (maj ? 20 : 10)}" stroke="${pal.ink}" stroke-width="${maj ? 1.8 : 1.1}"/>`;
      if (maj) s += `<text x="${x}" y="${y0 + 38}" text-anchor="middle" class="${pal.cls}">${F(c.lo + i * c.c)}</text>`;
    }
    s += `<text x="${W - 14}" y="${y0 + 51}" text-anchor="end" class="${pal.cls}" style="font-size:12px">${c.unit}</text>`;
    if (c.j != null) { const x = xp(c.j); s += `<path d="M${x} ${y0 - 1}L${x - 7} ${y0 - 17}L${x + 7} ${y0 - 17}Z" fill="${pal.red}"/><line x1="${x}" y1="${y0 - 1}" x2="${x}" y2="${y0 + 22}" stroke="${pal.red}" stroke-width="1.4"/>`; }
    return s + `</svg>`;
  }

  // pointer instrument: {hi, c, major, N = hi/c, unit, j?}  scale from 0 to hi over 110°
  function dial(c, pal = PAL) {
    const W = 320, H = 190, cx = 160, cy = 172, Rr = 130, half = 55, rad = Math.PI / 180;
    const pt = (deg, r) => [+(cx + r * Math.sin(deg * rad)).toFixed(2), +(cy - r * Math.cos(deg * rad)).toFixed(2)];
    const ang = i => -half + 2 * half * i / c.N;
    let s = `<svg viewBox="0 0 ${W} ${H}" class="oy-svg" role="img" aria-label="Əqrəbli ölçü cihazı">`;
    s += `<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="10" fill="${pal.body}" stroke="${pal.ink}" stroke-width="1.5"/>`;
    const a = pt(-half, Rr), b = pt(half, Rr);
    s += `<path d="M${a[0]} ${a[1]}A${Rr} ${Rr} 0 0 1 ${b[0]} ${b[1]}" fill="none" stroke="${pal.ink}" stroke-width="1.6"/>`;
    for (let i = 0; i <= c.N; i++) {
      const maj = i % c.major === 0, p = pt(ang(i), Rr), q = pt(ang(i), Rr - (maj ? 18 : 10));
      s += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="${pal.ink}" stroke-width="${maj ? 1.8 : 1.1}"/>`;
      if (maj) { const t = pt(ang(i), Rr - 33); s += `<text x="${t[0]}" y="${t[1] + 5}" text-anchor="middle" class="${pal.cls}">${F(i * c.c)}</text>`; }
    }
    s += `<text x="26" y="${H - 20}" text-anchor="start" class="${pal.cls}" style="font-size:22px;font-weight:700">${c.unit}</text>`;
    if (c.j != null) { const t = pt(ang(c.j), Rr - 4); s += `<line x1="${cx}" y1="${cy}" x2="${t[0]}" y2="${t[1]}" stroke="${pal.red}" stroke-width="2.6" stroke-linecap="round"/>`; }
    s += `<circle cx="${cx}" cy="${cy}" r="7" fill="${pal.ink}"/>`;
    return s + `</svg>`;
  }

  // caliper with a 10-division vernier (10 divisions = 9 mm): reading x = M + k/10 mm, the k-th vernier tick coincides with a main tick
  function vernier(M, k, pal = PAL) {
    const W = 296, H = 122, pxmm = 16, ox = 8, w0 = M - 3, X = mm => +(ox + (mm - w0) * pxmm).toFixed(2), x = M + k / 10;
    let s = `<svg viewBox="0 0 ${W} ${H}" class="oy-svg" role="img" aria-label="Ştangenzirkulun əsas şkalası və noniusu">`;
    s += `<rect x="1" y="6" width="${W - 2}" height="52" fill="${pal.body}" stroke="${pal.ink}" stroke-width="1.3"/>`;
    for (let m = w0; m <= w0 + 17; m++) {
      const len = m % 10 === 0 ? 22 : m % 5 === 0 ? 15 : 10;
      s += `<line x1="${X(m)}" y1="58" x2="${X(m)}" y2="${58 - len}" stroke="${pal.ink}" stroke-width="1.2"/>`;
      if (m % 10 === 0) s += `<text x="${X(m)}" y="30" text-anchor="middle" class="${pal.cls}" style="font-size:13px">${m}</text>`;
    }
    s += `<text x="${W - 6}" y="20" text-anchor="end" class="${pal.cls}" style="font-size:12px">mm</text>`;
    s += `<rect x="${X(x) - 7}" y="58" width="${9 * pxmm * 1 + 24}" height="52" fill="${pal.body}" stroke="${pal.ink}" stroke-width="1.3"/>`;
    for (let i = 0; i <= 10; i++) {
      const xx = X(x + 0.9 * i);
      s += `<line x1="${xx}" y1="58" x2="${xx}" y2="${58 + (i % 5 === 0 ? 17 : 11)}" stroke="${pal.ink}" stroke-width="1.2"/>`;
      s += `<text x="${xx}" y="${58 + 32}" text-anchor="middle" class="${pal.cls}" style="font-size:10px">${i}</text>`;
    }
    s += `<text x="${X(x) - 2}" y="${58 + 48}" text-anchor="start" class="${pal.cls}" style="font-size:11px">nonius</text>`;
    return s + `</svg>`;
  }

  // ---------- level 1: scales (linear + pointer instruments) ----------
  const LIN = [
    { ad: "xətkeş", unit: "sm", c: 0.1, major: 10, m: [3, 5] },
    { ad: "xətkeş", unit: "sm", c: 0.5, major: 2, m: [6, 12] },
    { ad: "dinamometr", unit: "N", c: 0.2, major: 5, m: [4, 6] },
    { ad: "dinamometr", unit: "N", c: 0.05, major: 10, m: [3, 5] },
    { ad: "termometr", unit: "°C", c: 0.5, major: 10, m: [3, 5] },
    { ad: "termometr", unit: "°C", c: 1, major: 5, m: [4, 8] },
    { ad: "ölçü silindri", unit: "mL", c: 2, major: 5, m: [4, 7] },
    { ad: "ölçü silindri", unit: "mL", c: 1, major: 10, m: [3, 5] },
    { ad: "ölçü silindri", unit: "mL", c: 5, major: 4, m: [5, 7] },
    { ad: "saniyəölçən", unit: "s", c: 0.2, major: 5, m: [4, 6] },
  ];
  const DIAL = [
    { ad: "ampermetr", unit: "A", hi: 3, c: 0.1, major: 10 },
    { ad: "ampermetr", unit: "A", hi: 5, c: 0.2, major: 5 },
    { ad: "ampermetr", unit: "A", hi: 2, c: 0.05, major: 10 },
    { ad: "voltmetr", unit: "V", hi: 10, c: 0.2, major: 10 },
    { ad: "voltmetr", unit: "V", hi: 15, c: 0.5, major: 10 },
    { ad: "voltmetr", unit: "V", hi: 6, c: 0.1, major: 10 },
    { ad: "miliampermetr", unit: "mA", hi: 100, c: 2, major: 10 },
    { ad: "miliampermetr", unit: "mA", hi: 50, c: 1, major: 10 },
  ];
  const tick = (N, major) => { let j; do { j = rnd(1, N - 1); } while (j % major === 0 && Math.random() < 0.75); return j; };

  // ---------- helpers for the "many oscillations" and "indirect" levels ----------
  const NS_ = [10, 15, 20, 25, 30, 40, 50];

  // significant-figure numbers: digits ds, p digits before the comma (0 → "0,00…"), z zeros after "0,"
  const genDigits = n => { const d = [rnd(1, 9)]; for (let i = 1; i < n; i++) d.push(Math.random() < 0.25 ? 0 : rnd(0, 9)); return d; };
  const fmtNum = (ds, p, z) => p === 0 ? "0," + "0".repeat(z) + ds.join("") : p >= ds.length ? ds.join("") : ds.slice(0, p).join("") + "," + ds.slice(p).join("");
  const valOf = s => parseFloat(s.replace(",", "."));
  const comma = (v, d) => v.toFixed(d).replace(".", ",");

  const levels = [
    { id: "oxu", ad: "Şkala və cihaz", izah: "Bölgü qiyməti c = (iki bitişik rəqəmli işarənin fərqi) / (aralarındakı bölgü sayı). Bölgüləri say, xətləri yox. Cihaz xətası Δ = c/2.",
      gen() {
        const kind = pick(["cdiv", "read", "read", "dcdiv", "dread", "dread", "err"]);
        if (kind === "cdiv" || kind === "read" || kind === "err") {
          const cf = pick(LIN), mult = rnd(cf.m[0], cf.m[1]), N = cf.major * mult, lo = r6(cf.major * cf.c * rnd(0, 4)), j = tick(N, cf.major);
          const v = r6(lo + j * cf.c), svg = wrap(linScale({ lo, c: cf.c, major: cf.major, N, unit: cf.unit, j: kind === "read" ? j : null }));
          const c2 = r6(lo + cf.major * cf.c), cs = `Bitişik rəqəmli işarələr ${F(lo)} və ${F(c2)} ${cf.unit}-dir, aralarında ${cf.major} bölgü var (xətləri yox, aralıqları say). c = (${F(c2)} − ${F(lo)})/${cf.major} = ${F(cf.c)} ${cf.unit}.`;
          if (kind === "cdiv") return X(cf.c, cf.unit, { svg, text: `Şəkildə ${cf.ad} şkalası göstərilib. Bölgü qiyməti c neçədir?`, solution: cs });
          if (kind === "err") return X(r6(cf.c / 2), cf.unit, { svg, text: `Şəkildə ${cf.ad} şkalası göstərilib. Cihazın xətası Δ (bölgü qiymətinin yarısı) neçədir?`, solution: cs + ` Δ = c/2 = ${F(cf.c / 2)} ${cf.unit}.` });
          return X(v, cf.unit, { svg, tol: cf.c * 0.4, text: `Şəkildə ${cf.ad} şkalası və qırmızı göstərici var. Göstərici neçəni göstərir?`,
            solution: cs + ` Göstərici ilk rəqəmli işarədən (${F(lo)}) ${j} bölgü sağdadır: ${F(lo)} + ${j}·${F(cf.c)} = ${F(v)} ${cf.unit}.` });
        }
        const d = pick(DIAL), N = Math.round(d.hi / d.c), j = tick(N, d.major), v = r6(j * d.c), svg = wrap(dial({ hi: d.hi, c: d.c, major: d.major, N, unit: d.unit, j: kind === "dread" ? j : null }));
        const cs = `0 ilə ${F(d.major * d.c)} ${d.unit} arasında ${d.major} bölgü var: c = ${F(d.major * d.c)}/${d.major} = ${F(d.c)} ${d.unit}.`;
        if (kind === "dcdiv") return X(d.c, d.unit, { svg, text: `Şəkildə ${d.ad} göstərilib. Bölgü qiyməti c neçədir?`, solution: cs });
        return X(v, d.unit, { svg, tol: d.c * 0.4, text: `Şəkildə ${d.ad} göstərilib. Əqrəb neçəni göstərir?`, solution: cs + ` Əqrəb 0-dan ${j} bölgü sağdadır: ${j}·${F(d.c)} = ${F(v)} ${d.unit}.` });
      } },

    { id: "nonius", ad: "Ştangenzirkul (nonius)", izah: "Oxunuş = noniusun sıfırından solda qalan tam mm + 0,1·(əsas şkalanın bir cizgisi ilə üst-üstə düşən nonius cizgisinin nömrəsi). Dəqiqlik = 1 mm / (nonius bölgülərinin sayı).",
      gen() {
        const kind = pick(["read", "read", "cm", "zero", "acc"]);
        if (kind === "zero") {
          const z = pick([0.1, 0.2, 0.3, 0.4]), neg = Math.random() < 0.4, M = rnd(8, 40), k = rnd(0, 9), rd = r6(M + k / 10), tr = r6(neg ? rd + z : rd - z);
          const zt = neg ? `çənələr sıxılanda cihaz 0 yox, −${F(z)} mm göstərir` : `çənələr sıxılanda cihaz 0 yox, +${F(z)} mm göstərir`;
          return X(tr, "mm", { text: `Ştangenzirkulun sıfır xətası var: ${zt}. Detalı ölçəndə oxunuş ${F(rd)} mm oldu. Detalın düzgün ölçüsü neçə mm-dir?`,
            solution: neg ? `Sıfır xətası −${F(z)} mm: cihaz həmişə ${F(z)} mm az göstərir. Düzəliş: ${F(rd)} + ${F(z)} = ${F(tr)} mm.` : `Sıfır xətası +${F(z)} mm: cihaz həmişə ${F(z)} mm çox göstərir. Düzəliş: ${F(rd)} − ${F(z)} = ${F(tr)} mm.` });
        }
        if (kind === "acc") {
          const n = pick([10, 20, 50]), a = r6(1 / n);
          return X(a, "mm", { text: `Ştangenzirkulun noniusunda ${n} bölgü var, onlar əsas şkalanın ${n - 1} mm-nə bərabərdir (əsas şkalanın bölgüsü 1 mm). Cihazın dəqiqliyi (nonius vasitəsilə oxuna bilən ən kiçik uzunluq) neçə mm-dir?`,
            solution: `Nonius bölgüsü (${n - 1})/${n} mm, əsas bölgü 1 mm: fərq 1 − ${n - 1}/${n} = 1/${n} = ${F(a)} mm. Dəqiqlik = 1 mm / ${n} = ${F(a)} mm.` });
        }
        const M = rnd(5, 40), k = rnd(0, 9), x = r6(M + k / 10), svg = wrap(vernier(M, k));
        const sol = `Noniusun sıfırından solda əsas şkalanın ${M} mm cizgisi qalır. Nonius və əsas şkalanın ${k}-cı cizgisi üst-üstə düşür: oxunuş = ${M} + ${k}·0,1 = ${F(x)} mm.`;
        if (kind === "cm") return X(r6(x / 10), "sm", { svg, tol: 0.004, text: `Ştangenzirkulun oxunuşu neçə santimetrdir? (Əsas şkalanın bölgüsü 1 mm, nonius 10 bölgülüdür.)`, solution: sol + ` Santimetrlə: ${F(x)}/10 = ${F(x / 10)} sm.` });
        return X(x, "mm", { svg, text: `Ştangenzirkulun oxunuşu neçə millimetrdir? (Əsas şkalanın bölgüsü 1 mm, nonius 10 bölgülüdür.)`, solution: sol });
      } },

    { id: "periyod", ad: "Çox rəqs, kiçik xəta", izah: "Tək rəqsin vaxtını ölçsən xəta böyük olur. N rəqsin vaxtını ölç: T = t/N və ΔT = Δt/N. Nisbi xəta ε = Δt/t.",
      gen() {
        const kind = pick(["T", "dT", "N", "eps", "omega", "omega"]);
        if (kind === "T") {
          let N, T, t; do { N = pick(NS_); T = r6(rnd(16, 60) * 0.05); t = r6(N * T); } while (!nice(t, 1) || t > 100);
          return X(T, "s", { text: `Fikrət sarğacın ${N} tam rəqsinin vaxtını ${F(t)} s ölçdü. Bir rəqsin periodu T neçə saniyədir?`, solution: `T = t/N = ${F(t)}/${N} = ${F(T)} s.` });
        }
        if (kind === "dT") {
          const N = pick([10, 20, 25, 40, 50]), dt = pick([0.2, 0.3, 0.4]), dT = r6(dt / N);
          if (!nice(dT, 3)) return levels[2].gen();
          return X(dT, "s", { text: `Saniyəölçəni əllə işə salıb dayandırarkən vaxtın ölçmə xətası Δt = ${F(dt)} s-dir. ${N} rəqsin vaxtı ölçülür və ${N}-ə bölünür. Periodun mütləq xətası ΔT neçə saniyədir?`,
            solution: `ΔT = Δt/N = ${F(dt)}/${N} = ${F(dT)} s. (Tək rəqsi ölçsəydin xəta ${F(dt)} s olardı.)` });
        }
        if (kind === "N") {
          const N = pick([20, 25, 40, 50, 100]), dt = 0.2, dT = r6(dt / N);
          return X(N, "rəqs", { text: `Əllə ölçmədə vaxtın xətası Δt = 0,2 s-dir. Periodun xətası ΔT ≤ ${F(dT)} s olmalıdır. Ən azı neçə rəqsin vaxtını ölçmək lazımdır?`,
            solution: `ΔT = Δt/N ≤ ${F(dT)} → N ≥ Δt/ΔT = 0,2/${F(dT)} = ${N}. Ən azı ${N} rəqs.` });
        }
        if (kind === "eps") {
          let N, t, dt, e; do { N = pick([10, 20, 25, 40]); t = pick([10, 12.5, 15, 16, 20, 24, 25, 30, 32, 40, 50, 60]); dt = pick([0.2, 0.3, 0.4]); e = r6(dt / t * 100); } while (!nice(e, 2));
          return X(e, "%", { text: `Sarğacın ${N} rəqsinin vaxtı t = ${F(t)} s ölçüldü, vaxtın xətası Δt = ${F(dt)} s. Periodun nisbi xətası ε = ΔT/T neçə faizdir?`,
            solution: `ε = ΔT/T = (Δt/N)/(t/N) = Δt/t = ${F(dt)}/${F(t)} = ${F(e / 100)} = ${F(e)} %. (N ixtisar olunur: nisbi xəta ölçülən vaxtın özünə görə təyin olunur.)` });
        }
        let N, T, t; do { N = pick([4, 5, 8, 10]); T = pick([0.4, 0.5, 0.8, 1, 2, 4]); t = r6(N * T); } while (t < 4 || t > 40);
        const w = r6(2 * PI / T);
        return XR(w, "rad/s", { text: `Fırlanan oturacaq ${N} tam dövrü ${F(t)} s-də edir. Bucaq sürəti ω = 2π/T neçə rad/s-dir? π = 3,14 götür.`, solution: `T = t/N = ${F(t)}/${N} = ${F(T)} s. ω = 2π/T = 6,28/${F(T)} = ${F(w)} rad/s.` });
      } },

    { id: "dolayi", ad: "Dolayı ölçmə", izah: "Kiçik kəmiyyəti birbaşa ölçə bilmirsən: çoxunu ölç və böl (vərəq, məftil), ya da düsturdan hesabla. Əvvəl hər şeyi SI-yə çevir.",
      gen() {
        const kind = pick(["vereq", "teli", "sixliq", "sixliq2", "sahe", "a", "w"]);
        if (kind === "vereq") {
          let n, d, hh; do { n = pick([50, 100, 200, 250, 500]); d = pick([0.08, 0.09, 0.1, 0.11, 0.12]); hh = r6(d * n); } while (!nice(hh, 1));
          return X(d, "mm", { text: `Kitabın ${n} vərəqdən ibarət dəstəsinin qalınlığı xətkeşlə ${F(hh)} mm ölçüldü. Bir vərəqin qalınlığı neçə mm-dir?`, solution: `d = h/n = ${F(hh)}/${n} = ${F(d)} mm. (Çox vərəqi ölçmək xətanı ${n} dəfə azaldır.)` });
        }
        if (kind === "teli") {
          let n, d, L; do { n = pick([20, 30, 40, 50, 60, 100]); d = pick([0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8]); L = r6(d * n); } while (!nice(L, 1));
          return X(d, "mm", { text: `Məftili qələmin üstünə sıx-sıx, aralıqsız ${n} dolaq sarıdılar. Sarğının uzunluğu xətkeşlə ${F(L)} mm ölçüldü. Məftilin diametri neçə mm-dir?`, solution: `d = L/n = ${F(L)}/${n} = ${F(d)} mm.` });
        }
        if (kind === "sixliq" || kind === "sixliq2") {
          let V1, V, rho, m; do { V1 = pick([30, 40, 50, 60]); V = pick([10, 12, 15, 20, 25, 30, 40]); rho = pick([2.7, 7.8, 8.9, 11.3, 7.2, 2.5]); m = r6(rho * V); } while (!nice(m, 1));
          const V2 = V1 + V, base = `Ölçü silindrində su var, səviyyə ${V1} mL. Cismi suya saldıqda səviyyə ${V2} mL oldu. Cismin kütləsi ${F(m)} q-dır. `;
          const sol = `Həcm = ${V2} − ${V1} = ${V} mL = ${V} sm³. ρ = m/V = ${F(m)}/${V} = ${F(rho)} q/sm³`;
          if (kind === "sixliq") return X(rho, "q/sm³", { text: base + "Cismin sıxlığı neçə q/sm³-dir? (1 mL = 1 sm³)", solution: sol + "." });
          return X(rho * 1000, "kq/m³", { text: base + "Cismin sıxlığı neçə kq/m³-dir?", solution: sol + ` = ${F(rho * 1000)} kq/m³ (1 q/sm³ = 1000 kq/m³).` });
        }
        if (kind === "sahe") {
          let a, b, cell, A; do { a = rnd(20, 60); b = 2 * rnd(4, 14); cell = pick([1, 0.25, 0.5, 4]); A = r6((a + b / 2) * cell); } while (!nice(A, 2));
          return X(A, "sm²", { text: `Tor kağızı üzərində yarpağın konturu çəkilib. Kontur daxilində ${a} tam xana, ${b} natamam xana var (natamam xanaların cəmini ${b}/2 tam xana say). Bir xananın sahəsi ${F(cell)} sm²-dir. Yarpağın sahəsi neçə sm²-dir?`,
            solution: `Xana sayı = ${a} + ${b}/2 = ${a + b / 2}. S = ${a + b / 2}·${F(cell)} = ${F(A)} sm².` });
        }
        let w, R, a; do { w = pick([2, 3, 4, 5, 6, 8]); R = pick([10, 12, 15, 16, 18, 20, 24, 25]); a = r6(w * w * R / 100); } while (!nice(a, 2));
        if (kind === "w") {
          return X(w, "rad/s", { text: `Telefon fırlanan oturacaqda oxdan R = ${R} sm məsafədədir. Akselerometr a = ${F(a)} m/s² göstərir. ω = √(a/R) bucaq sürəti neçə rad/s-dir?`,
            solution: `R = ${R} sm = ${F(R / 100)} m. ω² = a/R = ${F(a)}/${F(R / 100)} = ${w * w}, ω = ${w} rad/s.` });
        }
        return X(a, "m/s²", { text: `Telefon fırlanan oturacaqda oxdan R = ${R} sm məsafədədir, giroskop ω = ${w} rad/s göstərir. Mərkəzəqaçma təcili a = ω²R neçə m/s²-dir?`,
          solution: `R = ${R} sm = ${F(R / 100)} m. a = ω²R = ${w}²·${F(R / 100)} = ${w * w}·${F(R / 100)} = ${F(a)} m/s².` });
      } },

    { id: "reqem", ad: "Əhəmiyyətli rəqəmlər", izah: "Soldakı sıfırlar sayılmır, sonuncu sıfırlar (vergüldən sonra) sayılır. Vurma-bölmədə nəticə ən az rəqəmli ədədin qədər rəqəm saxlayır. Nəticə xətanın mərtəbəsinə qədər yuvarlaqlanır.",
      gen() {
        const kind = pick(["say", "say", "yuv", "yuv", "vur", "xeta", "xeta2"]);
        if (kind === "say") {
          const n = rnd(2, 5), ds = genDigits(n), p = rnd(0, n); if (p === n && ds[n - 1] === 0) ds[n - 1] = rnd(1, 9);
          const z = p === 0 ? rnd(0, 3) : 0, s = fmtNum(ds, p, z);
          return X(n, "", { unit: "", text: `${s} ədədində neçə əhəmiyyətli rəqəm var?`, solution: `Soldakı sıfırlar sayılmır. İlk sıfırdan fərqli rəqəmdən sona qədər: ${ds.join(" ")} — ${n} rəqəm.` });
        }
        if (kind === "yuv") {
          let k, m, ds, p, z, s; do {
            k = rnd(2, 4); m = k + rnd(1, 2); ds = genDigits(m); p = rnd(0, k); z = p === 0 ? rnd(0, 2) : 0;
          } while (ds[k] === 5 || ds[k - 1] === 9);
          s = fmtNum(ds, p, z);
          const d = p === 0 ? z + k : k - p, rv = Number(ds.slice(0, k).join("")) + (ds[k] >= 5 ? 1 : 0), val = rv / 10 ** d;
          return X(val, "", { unit: "", tol: 0.3 * 10 ** -d, text: `${s} ədədini ${k} əhəmiyyətli rəqəmə qədər yuvarlaqlaşdır.`,
            solution: `İlk ${k} əhəmiyyətli rəqəm: ${ds.slice(0, k).join("")}. Növbəti rəqəm ${ds[k]} ${ds[k] >= 5 ? "≥ 5, ona görə sonuncu saxlanan rəqəm 1 artır" : "< 5, ona görə dəyişmir"}. Nəticə: ${comma(val, d)}.` });
        }
        if (kind === "vur") {
          let n1, n2, s1, s2, v1, v2, pr, sf, r, ok = false;
          do {
            n1 = pick([2, 3]); n2 = pick([3, 4]); s1 = fmtNum(genDigits(n1), rnd(1, n1 - 1 || 1), 0); s2 = fmtNum(genDigits(n2), rnd(1, 2), 0);
            v1 = valOf(s1); v2 = valOf(s2); pr = v1 * v2; sf = Math.min(n1, n2); r = Number(pr.toPrecision(sf));
            ok = Number((pr * 1.0015).toPrecision(sf)) === r && Number((pr * 0.9985).toPrecision(sf)) === r && /,/.test(s1) && v1 !== 0 && v2 !== 0 && Math.floor(Math.log10(Math.abs(r))) <= sf - 1;
          } while (!ok);
          const e = Math.floor(Math.log10(Math.abs(r))), st = 10 ** (e - sf + 1), d = Math.max(0, -(e - sf + 1));
          return X(r, "sm²", { tol: 0.3 * st, text: `Düzbucaqlı lövhənin uzunluğu ${s1} sm (${n1} əhəmiyyətli rəqəm), eni ${s2} sm (${n2} əhəmiyyətli rəqəm) ölçülüb. Sahəsini hesabla, nəticəni düzgün sayda əhəmiyyətli rəqəmlə yaz.`,
            solution: `S = ${s1}·${s2} = ${pr.toFixed(5).replace(".", ",")} sm². Vurmada nəticə ən az rəqəmli ədədin qədər, yəni ${sf} əhəmiyyətli rəqəm saxlayır: ${comma(r, d)} sm².` });
        }
        if (kind === "xeta") {
          let d, a, ip, fr, x, ok = false;
          do {
            d = rnd(1, 3); a = rnd(2, 9); ip = rnd(1, 30); fr = Array.from({ length: d + 2 }, () => rnd(0, 9));
            ok = fr[d] !== 5 && fr[d - 1] !== 9 && !(fr[d] === 4 && fr[d + 1] === 9);
          } while (!ok);
          const xs = ip + "," + fr.join(""), x0 = valOf(xs), val = Number(x0.toFixed(d)), Dl = a / 10 ** d;
          return X(val, "s", { tol: 0.3 * 10 ** -d, text: `Hesablama T = ${xs} s verdi, xətası ΔT = ${F(Dl)} s-dir. T-ni xətanın mərtəbəsinə qədər yuvarlaqlaşdırıb nəticəni yaz (T = ? s).`,
            solution: `Xəta ${d}-ci onluq mərtəbəsindədir (${F(Dl)}), deməli T-ni də ${d} rəqəm vergüldən sonra yaz: T = ${comma(val, d)} ± ${F(Dl)} s. Artıq rəqəmlər yalandan dəqiqlik yaradır.` });
        }
        let f, s2, q, ok2 = false, third;
        do { f = rnd(2, 8); s2 = rnd(0, 9); third = rnd(0, 9); q = rnd(2, 4); ok2 = s2 !== 5; } while (!ok2);
        const raw = (f * 100 + s2 * 10 + third) / 10 ** q, rv = f + (s2 >= 5 ? 1 : 0), val = r6(rv * 10 ** (2 - q)), dd = Math.max(0, q - 2);
        return X(val, "", { unit: "", tol: 0.3 * 10 ** -dd, text: `Hesablamada g üçün xəta Δg = ${raw.toFixed(q).replace(".", ",")} m/s² çıxdı. Xətanı 1 əhəmiyyətli rəqəmə qədər yuvarlaqlaşdır.`,
          solution: `Xətanı həmişə 1 (çox vaxt 1–2) əhəmiyyətli rəqəmlə yazırlar. İlk rəqəm ${f}, növbəti ${s2} ${s2 >= 5 ? "≥ 5 → yuxarı" : "< 5 → aşağı"}: ${comma(val, dd)}.` });
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < 0.5) {
          let N, T, t, dt, dT, e;
          do { N = pick([10, 20, 25, 40, 50]); T = pick([1, 1.25, 1.6, 2, 2.5, 4]); t = r6(N * T); dt = pick([0.2, 0.4]); dT = r6(dt / N); e = r6(dT / T * 100); } while (!nice(t, 1) || !nice(dT, 3) || !nice(e, 3) || t > 100);
          task = `Sarğac ${N} tam rəqsi ${F(t)} s-də edir, saniyəölçənlə ölçmə xətası Δt = ${F(dt)} s-dir. Periodun nisbi xətasını tapırlar.`;
          steps = [`T = t/N = ${F(t)}/${N} = ${F(T)} s.`, `ΔT = Δt/N = ${F(dt)}/${N} = ${F(dT)} s.`, `ε = ΔT/T·100 % = ${F(dT)}/${F(T)}·100 % = ${F(e)} %.`];
          if (bad === 0) steps[0] = `T = N/t = ${N}/${F(t)} = ${F(+(N / t).toFixed(3))} s.`;
          if (bad === 1) steps[1] = `ΔT = Δt·N = ${F(dt)}·${N} = ${F(dt * N)} s.`;
          if (bad === 2) steps[2] = `ε = ΔT/T = ${F(dT)}/${F(T)} = ${F(+(dT / T).toFixed(5))} %.`;
          why = [`1-ci addım: N/t tezlikdir (rəqs/s). Period T = t/N = ${F(T)} s.`,
            `2-ci addım: N rəqsin vaxtını ölçüb N-ə böləndə xəta da N dəfə azalır: ΔT = Δt/N = ${F(dT)} s.`,
            `3-cü addım: ΔT/T ədədi nisbətdir (${F(+(dT / T).toFixed(5))}), faizə keçmək üçün 100-ə vurmaq lazımdır: ε = ${F(e)} %.`][bad];
        } else {
          const [hi, n] = pick([[3, 30], [3, 15], [5, 25], [5, 10], [6, 30], [10, 50], [10, 20], [15, 30]]), c = r6(hi / n);
          let j, U; do { j = rnd(5, n - 2); U = r6(j * c); } while (!nice(U, 2));
          task = `Voltmetrin şkalası 0-dan ${hi} V-a qədərdir, bu aralıqda ${n} bölgü var. Əqrəb ${j}-cı bölgüdədir. Nəticəni U ± ΔU kimi yazırlar (cihaz xətası bölgü qiymətinin yarısıdır).`;
          steps = [`c = ${hi}/${n} = ${F(c)} V.`, `U = j·c = ${j}·${F(c)} = ${F(U)} V.`, `ΔU = c/2 = ${F(c / 2)} V.`];
          if (bad === 0) steps[0] = `c = ${n}/${hi} = ${F(r6(n / hi))} V.`;
          if (bad === 1) steps[1] = `U = j + c = ${j} + ${F(c)} = ${F(r6(j + c))} V.`;
          if (bad === 2) steps[2] = `ΔU = 2c = ${F(2 * c)} V.`;
          why = [`1-ci addım: bölgü qiyməti = diapazon / bölgü sayı = ${hi}/${n} = ${F(c)} V.`,
            `2-ci addım: əqrəb j bölgü sağdadırsa, U = j·c = ${F(U)} V (cəm yox, hasil).`,
            `3-cü addım: cihaz xətası bölgü qiymətinin yarısıdır: ΔU = c/2 = ${F(c / 2)} V.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Sarğac (pendulum-lab) və fırlanan telefon təcrübələrində ölçülənlər: ip uzunluğu, R, rəqs vaxtı, ω.",
      gen() {
        const kind = pick(["l", "R", "N", "a", "T"]);
        if (kind === "l") {
          let L, d, l; do { L = pick([80, 85.5, 90, 92.5, 95.5, 98, 100, 105]); d = pick([2, 3, 4, 5]); l = r6((L + d / 2) / 100); } while (!nice(l, 4));
          return X(l, "m", { text: `Pendulum-lab layihəsində Fikrət sarğacın ipinin uzunluğunu ${F(L)} sm, topun diametrini ${d} sm ölçdü (ip topun üstündən bərkidilib). Sarğacın uzunluğu l — asılma nöqtəsindən topun mərkəzinə qədər — neçə metrdir?`,
            solution: `Topun mərkəzi ipin ucundan radius qədər aşağıdadır: l = ${F(L)} + ${d}/2 = ${F(L + d / 2)} sm = ${F(l)} m.` });
        }
        if (kind === "R") {
          let x, w, R; do { x = pick([9, 10, 11.5, 12, 13.5, 14, 15, 16.5, 18]); w = pick([7, 7.4, 7.6, 7.8, 8]); R = r6((x + w / 2) / 100); } while (!nice(R, 4));
          return X(R, "m", { text: `Fırlanan oturacaqda ox işarəsindən telefonun yaxın kənarına qədər ${F(x)} sm, telefonun eni ${F(w)} sm-dir. Telefonun mərkəzinə qədər R neçə metrdir?`,
            solution: `R = ${F(x)} + ${F(w)}/2 = ${F(x + w / 2)} sm = ${F(R)} m.` });
        }
        if (kind === "N") {
          const dT = pick([0.01, 0.005, 0.004, 0.002]), N = r6(0.2 / dT);
          return X(N, "rəqs", { text: `Pendulum-lab layihəsində Fikrət periodu ΔT ≤ ${F(dT)} s dəqiqliklə tapmaq istəyir. Əllə start-stopun xətası Δt = 0,2 s-dir. Ən azı neçə rəqsin vaxtını ölçməlidir?`,
            solution: `ΔT = Δt/N ≤ ${F(dT)} → N ≥ 0,2/${F(dT)} = ${N}.` });
        }
        if (kind === "a") {
          let w, R, a; do { w = pick([2, 3, 4, 5, 6]); R = pick([12, 15, 16, 18, 20, 24, 25]); a = r6(w * w * R / 100); } while (!nice(a, 2));
          return X(a, "m/s²", { text: `Phyphox giroskopu ω = ${w} rad/s göstərir, telefonun mərkəzi oxdan R = ${R} sm məsafədədir. Düstura görə a = ω²R təcili neçə m/s²-dir?`,
            solution: `R = ${F(R / 100)} m. a = ${w}²·${F(R / 100)} = ${F(a)} m/s².` });
        }
        let N, T, t; do { N = pick([10, 20, 25, 30]); T = r6(rnd(18, 50) * 0.05); t = r6(N * T); } while (!nice(t, 1));
        return X(T, "s", { text: `Pendulum-lab-da sarğac ${N} rəqsi ${F(t)} s-də edir. Period T neçə saniyədir?`, solution: `T = t/N = ${F(t)}/${N} = ${F(T)} s.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-olcme", title: "Ölçmə cihazları və ölçmə metodları", fenn: "fizika", link: "dersler/fiz-olcme.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI və sm, mm, mL, %). Onluq kəsr vergül və ya nöqtə ilə: 0,25. g = 10 m/s², π = 3,14.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["oxu", "oxu", "nonius", "periyod", "periyod", "dolayi", "dolayi", "reqem", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-olcme.html")) b.push("dersler/fiz-olcme.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
