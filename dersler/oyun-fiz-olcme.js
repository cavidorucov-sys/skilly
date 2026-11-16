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
    { id: "oxu", ad: "Şkala və cihaz", izah: "Bölgü qiyməti c = (iki bitişik rəqəmli işarənin fərqi) / (aralarındakı bölgü sayı). Bölgüləri say, xətləri yox. Başqa məlumat verilməyibsə, analoq şkalada oxuma xətası Δ = c/2.",
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
          return X(T, "s", { text: `Elvin rəqqasın ${N} tam rəqsinin vaxtını ${F(t)} s ölçdü. Bir rəqsin periodu T neçə saniyədir?`, solution: `T = t/N = ${F(t)}/${N} = ${F(T)} s.` });
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
          return X(e, "%", { text: `Rəqqasın ${N} rəqsinin vaxtı t = ${F(t)} s ölçüldü, vaxtın xətası Δt = ${F(dt)} s. Periodun nisbi xətası ε = ΔT/T neçə faizdir?`,
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
        return X(a, "m/s²", { text: `Telefon fırlanan oturacaqda oxdan R = ${R} sm məsafədədir, giroskop ω = ${w} rad/s göstərir. Mərkəzəyönlü təcil a = ω²R neçə m/s²-dir?`,
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
          task = `Rəqqas ${N} tam rəqsi ${F(t)} s-də edir, saniyəölçənlə ölçmə xətası Δt = ${F(dt)} s-dir. Periodun nisbi xətasını tapırlar.`;
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

    { id: "heyat", ad: "Həyatdan", izah: "Rəqqas (pendulum-lab) və fırlanan telefon təcrübələrində ölçülənlər: ip uzunluğu, R, rəqs vaxtı, ω.",
      gen() {
        const kind = pick(["l", "R", "N", "a", "T"]);
        if (kind === "l") {
          let L, d, l; do { L = pick([80, 85.5, 90, 92.5, 95.5, 98, 100, 105]); d = pick([2, 3, 4, 5]); l = r6((L + d / 2) / 100); } while (!nice(l, 4));
          return X(l, "m", { text: `Laboratoriya işində Elvin rəqqasın ipinin uzunluğunu ${F(L)} sm, topun diametrini ${d} sm ölçdü (ip topun üstündən bərkidilib). Rəqqasın uzunluğu l — asılma nöqtəsindən topun mərkəzinə qədər — neçə metrdir?`,
            solution: `Topun mərkəzi ipin ucundan radius qədər aşağıdadır: l = ${F(L)} + ${d}/2 = ${F(L + d / 2)} sm = ${F(l)} m.` });
        }
        if (kind === "R") {
          let x, w, R; do { x = pick([9, 10, 11.5, 12, 13.5, 14, 15, 16.5, 18]); w = pick([7, 7.4, 7.6, 7.8, 8]); R = r6((x + w / 2) / 100); } while (!nice(R, 4));
          return X(R, "m", { text: `Fırlanan oturacaqda ox işarəsindən telefonun yaxın kənarına qədər ${F(x)} sm, telefonun eni ${F(w)} sm-dir. Telefonun mərkəzinə qədər R neçə metrdir?`,
            solution: `R = ${F(x)} + ${F(w)}/2 = ${F(x + w / 2)} sm = ${F(R)} m.` });
        }
        if (kind === "N") {
          const dT = pick([0.01, 0.005, 0.004, 0.002]), N = r6(0.2 / dT);
          return X(N, "rəqs", { text: `Laboratoriya işində Elvin periodu ΔT ≤ ${F(dT)} s dəqiqliklə tapmaq istəyir. Əllə start-stopun xətası Δt = 0,2 s-dir. Ən azı neçə rəqsin vaxtını ölçməlidir?`,
            solution: `ΔT = Δt/N ≤ ${F(dT)} → N ≥ 0,2/${F(dT)} = ${N}.` });
        }
        if (kind === "a") {
          let w, R, a; do { w = pick([2, 3, 4, 5, 6]); R = pick([12, 15, 16, 18, 20, 24, 25]); a = r6(w * w * R / 100); } while (!nice(a, 2));
          return X(a, "m/s²", { text: `Phyphox giroskopu ω = ${w} rad/s göstərir, telefonun mərkəzi oxdan R = ${R} sm məsafədədir. Düstura görə a = ω²R təcili neçə m/s²-dir?`,
            solution: `R = ${F(R / 100)} m. a = ${w}²·${F(R / 100)} = ${F(a)} m/s².` });
        }
        let N, T, t; do { N = pick([10, 20, 25, 30]); T = r6(rnd(18, 50) * 0.05); t = r6(N * T); } while (!nice(t, 1));
        return X(T, "s", { text: `Pendulum-lab-da rəqqas ${N} rəqsi ${F(t)} s-də edir. Period T neçə saniyədir?`, solution: `T = t/N = ${F(t)}/${N} = ${F(T)} s.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a picture of an instrument or a graph, several steps;
  // the wrong options are the answers of typical mistakes. Questions 2, 3, 5, 6 and 9 also use an earlier topic (Huk, Arximed, Om, çevrə üzrə hərəkət, istilik).
  const { ae, again } = Oyun;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const ok2 = x => isFinite(x) && x > 0 && nice(x, 2);
  const ok3 = x => isFinite(x) && x > 0 && nice(x, 3);
  const Gn = x => { const t = Oyun.num(+(+x).toFixed(4), 4), p = t.split(","); return (Math.abs(x) >= 10000 ? p[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ") : p[0]) + (p[1] ? "," + p[1] : ""); };
  const U_ = u => x => Gn(x) + " " + u;
  const PALW = Object.assign({}, PAL, { wat: "#cfe3f5", soft: "#dcd8f3", gry: "#9a968a" });
  // stack several figures into one picture: items {s, w, h}
  function pair(items, aria, pal = PALW) {
    const W = Math.max(...items.map(i => i.w)); let y = 0, s = "";
    items.forEach(i => { s += i.s.replace(/^<svg[^>]*>/, `<svg x="${(W - i.w) / 2}" y="${y}" width="${i.w}" height="${i.h}" viewBox="0 0 ${i.w} ${i.h}">`); y += i.h + 6; });
    return `<svg viewBox="0 0 ${W} ${y - 6}" class="oy-svg" role="img" aria-label="${aria}">${s}</svg>`;
  }
  // ruler with a bar (the body) between ticks j1 and j2
  function ruler(c, j1, j2, pal = PALW) {
    const x0 = 24, x1 = 296, y0 = 52, xp = i => +(x0 + (x1 - x0) * i / c.N).toFixed(2), a = xp(j1), b = xp(j2);
    let s = linScale({ lo: c.lo, c: c.c, major: c.major, N: c.N, unit: c.unit }, pal).replace("</svg>", "");
    s += `<rect x="${a}" y="${y0 - 28}" width="${+(b - a).toFixed(2)}" height="28" fill="${pal.soft}" stroke="${pal.acc}" stroke-width="1.4"/><text x="${+((a + b) / 2).toFixed(2)}" y="${y0 - 10}" text-anchor="middle" class="${pal.cls}" style="font-size:12px">cisim</text>`;
    return s + `</svg>`;
  }
  // two measuring cylinders: only water at V1 (left), water and a body at V2 (right); c = {hi, c, major}
  function cyl(c, V1, V2, pal = PALW) {
    const W = 320, H = 240, yb = 206, yt = 26, py = v => +(yb - (yb - yt) * v / c.hi).toFixed(2), N = Math.round(c.hi / c.c);
    let s = `<svg viewBox="0 0 ${W} ${H}" class="oy-svg" role="img" aria-label="İki ölçü silindri: solda su, sağda su və cisim">`;
    [[88, V1, false, "su"], [232, V2, true, "su və cisim"]].forEach(([cx, V, body, cap]) => {
      s += `<rect x="${cx - 30}" y="${yt - 8}" width="60" height="${yb - yt + 14}" fill="${pal.body}" stroke="${pal.ink}" stroke-width="1.5"/>`;
      s += `<rect x="${cx - 29}" y="${py(V)}" width="58" height="${+(yb + 5 - py(V)).toFixed(2)}" fill="${pal.wat}"/><line x1="${cx - 29}" y1="${py(V)}" x2="${cx + 29}" y2="${py(V)}" stroke="${pal.acc}" stroke-width="1.5"/>`;
      if (body) s += `<rect x="${cx - 12}" y="${yb - 24}" width="24" height="28" fill="${pal.gry}" stroke="${pal.ink}" stroke-width="1.2"/>`;
      for (let i = 0; i <= N; i++) {
        const maj = i % c.major === 0, y = py(i * c.c);
        s += `<line x1="${cx - 30}" y1="${y}" x2="${cx - 30 + (maj ? 18 : 10)}" y2="${y}" stroke="${pal.ink}" stroke-width="${maj ? 1.6 : 1}"/>`;
        if (maj) s += `<text x="${cx - 34}" y="${+(y + 4).toFixed(2)}" text-anchor="end" class="${pal.cls}" style="font-size:12px">${F(i * c.c)}</text>`;
      }
      s += `<text x="${cx}" y="${H - 6}" text-anchor="middle" class="${pal.cls}" style="font-size:12px">${cap}</text>`;
    });
    s += `<text x="160" y="14" text-anchor="middle" class="${pal.cls}" style="font-size:12px">mL</text>`;
    return s + `</svg>`;
  }
  // spring balance (dinamometr) at x-offset ox: scale 0 … N·c downward, pointer at tick j, a body on the hook; liq → in a beaker of water. c = {c, major, N}
  function dynG(ox, c, j, pal, liq) {
    const L = 120, y0 = 44, py = i => +(y0 + L * i / c.N).toFixed(2), xl = ox + 55, xr = ox + 105;
    let s = `<circle cx="${ox + 80}" cy="20" r="7" fill="none" stroke="${pal.ink}" stroke-width="2"/><line x1="${ox + 80}" y1="27" x2="${ox + 80}" y2="34" stroke="${pal.ink}" stroke-width="2"/>`;
    s += `<rect x="${xl}" y="34" width="50" height="142" rx="5" fill="${pal.body}" stroke="${pal.ink}" stroke-width="1.6"/>`;
    for (let i = 0; i <= c.N; i++) {
      const maj = i % c.major === 0, y = py(i);
      s += `<line x1="${xr}" y1="${y}" x2="${xr - (maj ? 18 : 10)}" y2="${y}" stroke="${pal.ink}" stroke-width="${maj ? 1.6 : 1}"/>`;
      if (maj) s += `<text x="${xr - 22}" y="${+(y + 4).toFixed(2)}" text-anchor="end" class="${pal.cls}" style="font-size:12px;paint-order:stroke;stroke:${pal.body};stroke-width:3px">${F(i * c.c)}</text>`;
    }
    s += `<text x="${xl + 5}" y="46" class="${pal.cls}" style="font-size:12px">N</text>`;
    s += `<line x1="${ox + 80}" y1="176" x2="${ox + 80}" y2="194" stroke="${pal.ink}" stroke-width="2"/><rect x="${ox + 66}" y="194" width="28" height="26" fill="${pal.gry}" stroke="${pal.ink}" stroke-width="1.2"/>`;
    if (liq) s += `<rect x="${ox + 29}" y="188" width="102" height="54" fill="${pal.wat}" fill-opacity="0.75"/><polyline points="${ox + 28},180 ${ox + 28},242 ${ox + 132},242 ${ox + 132},180" fill="none" stroke="${pal.ink}" stroke-width="1.6"/>`;
    const p = py(j);
    s += `<line x1="${xl - 4}" y1="${p}" x2="${xr + 3}" y2="${p}" stroke="${pal.red}" stroke-width="2.2"/><path d="M${xl - 4} ${p}L${xl - 16} ${+(p - 6).toFixed(2)}L${xl - 16} ${+(p + 6).toFixed(2)}Z" fill="${pal.red}"/>`;
    return s;
  }
  const dynOne = (c, j, pal = PALW) => `<svg viewBox="0 0 200 232" class="oy-svg" role="img" aria-label="Dinamometr, yükü asılıb">${dynG(20, c, j, pal, false)}</svg>`;
  const dynTwo = (c, j1, j2, pal = PALW) => `<svg viewBox="0 0 320 262" class="oy-svg" role="img" aria-label="Eyni cisim dinamometrdə: solda havada, sağda suda">${dynG(0, c, j1, pal, false)}${dynG(160, c, j2, pal, true)}<text x="80" y="258" text-anchor="middle" class="${pal.cls}" style="font-size:12px">havada</text><text x="240" y="258" text-anchor="middle" class="${pal.cls}" style="font-size:12px">suda</text></svg>`;
  // graph m(V): grid 10 mL × 10 q, line m = m0 + ρV, two marked points
  function mvGraph(V1, m1, V2, m2, m0, rho, pal = PALW) {
    const X = v => 46 + 4 * v, Y = m => +(190 - 1.1 * m).toFixed(2);
    let s = `<svg viewBox="0 0 310 224" class="oy-svg" role="img" aria-label="Qab və mayenin birgə kütləsinin mayenin həcmindən asılılıq qrafiki">`;
    for (let v = 5; v <= 60; v += 5) s += `<line x1="${X(v)}" y1="190" x2="${X(v)}" y2="${Y(150)}" stroke="${pal.grid}" stroke-width="0.8"/>` + (v % 10 === 0 ? `<text x="${X(v)}" y="204" text-anchor="middle" class="${pal.cls}" style="font-size:11px">${v}</text>` : "");
    for (let m = 10; m <= 150; m += 10) s += `<line x1="46" y1="${Y(m)}" x2="${X(60)}" y2="${Y(m)}" stroke="${pal.grid}" stroke-width="0.8"/>` + (m % 20 === 0 ? `<text x="40" y="${+(Y(m) + 4).toFixed(2)}" text-anchor="end" class="${pal.cls}" style="font-size:11px">${m}</text>` : "");
    s += `<line x1="46" y1="190" x2="${X(60) + 8}" y2="190" stroke="${pal.ink}" stroke-width="1.6"/><line x1="46" y1="190" x2="46" y2="${Y(150) - 6}" stroke="${pal.ink}" stroke-width="1.6"/>`;
    s += `<text x="${X(60) + 8}" y="220" text-anchor="end" class="${pal.cls}" style="font-size:12px">V, mL</text><text x="50" y="14" class="${pal.cls}" style="font-size:12px">m, q</text>`;
    s += `<line x1="${X(0)}" y1="${Y(m0)}" x2="${X(60)}" y2="${Y(m0 + 60 * rho)}" stroke="${pal.acc}" stroke-width="2.4"/>`;
    [[V1, m1], [V2, m2]].forEach(([v, m]) => { s += `<circle cx="${X(v)}" cy="${Y(m)}" r="4" fill="${pal.red}"/>`; });
    return s + `</svg>`;
  }

  // Azerbaijani suffixes: ordinal (k-ci/-cı/-cu/-cü) for a digit 1-9, and dative / ablative of a number
  const ordT = k => k === 0 ? "sıfır" : `${k}-${["", "ci", "ci", "cü", "cü", "ci", "cı", "ci", "ci", "cu"][k]}`;
  const lastW = n => { const t = n % 100; if (t === 0) return "sıfır"; return n % 10 === 0 ? [, "on", "iyirmi", "otuz", "qırx", "əlli", "altmış", "yetmiş", "səksən", "doxsan"][(t / 10) | 0] : ["", "bir", "iki", "üç", "dörd", "beş", "altı", "yeddi", "səkkiz", "doqquz"][n % 10]; };
  const back = w => /[aıou][^aıouəeiöü]*$/.test(w);
  const dat = n => `${n}-${/[aıouəeiöü]$/.test(lastW(n)) ? (back(lastW(n)) ? "ya" : "yə") : (back(lastW(n)) ? "a" : "ə")}`;
  const abl = n => `${n}-${back(lastW(n)) ? "dan" : "dən"}`;
  const RHO = [2.5, 2.7, 4, 5, 7.8, 8, 8.9, 10, 11.3, 7.2];
  const CYL = [{ hi: 100, c: 2, major: 5 }, { hi: 100, c: 5, major: 2 }, { hi: 60, c: 2, major: 5 }, { hi: 200, c: 5, major: 4 }, { hi: 250, c: 10, major: 5 }];
  const DYN = [{ c: 0.2, major: 5, N: 25 }, { c: 0.1, major: 10, N: 30 }, { c: 0.5, major: 2, N: 20 }, { c: 1, major: 5, N: 20 }];
  const cText = (lo, hi, n, c, unit) => `${F(lo)} və ${F(hi)} ${unit} arasında ${n} bölgü var: c = (${F(hi)} − ${F(lo)})/${n} = ${F(c)} ${unit}.`;
  const THERM = [{ c: 0.5, major: 10, m: [3, 4] }, { c: 1, major: 5, m: [4, 6] }, { c: 2, major: 5, m: [3, 4] }];

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. two measuring cylinders: volume of a body from the two levels, then density
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const cf = pick(CYL), N = cf.hi / cf.c, j1 = rnd(Math.ceil(0.2 * N), Math.floor(0.5 * N)), j2 = j1 + rnd(Math.ceil(0.1 * N), Math.floor(0.3 * N));
      if (j2 > Math.floor(0.85 * N)) return null;
      const V1 = r6(j1 * cf.c), V2 = r6(j2 * cf.c), V = r6(V2 - V1), rho = pick(RHO), m = r6(rho * V);
      if (!nice(m, 1) || m > 900) return null;
      const w = [m / V2 * 1000, m / V1 * 1000, m / (V1 + V2) * 1000, m / V]; if (![rho * 1000, ...w].every(ok2)) return null;
      return mc(ae(rho * 1000, w, U_("kq/m³")), { svg: wrap(cyl(cf, V1, V2)), text: `Şəkildə ölçü silindri iki dəfə göstərilib: solda yalnız su, sağda suya salınmış bircins cisimlə birlikdə. Cismin kütləsi ${F(m)} q-dır. Cismin sıxlığı neçə kq/m³-dir? (1 mL = 1 sm³)`,
        solution: `Şkala: ${cText(0, cf.major * cf.c, cf.major, cf.c, "mL")} Su səviyyəsi: solda ${F(V1)} mL, sağda ${F(V2)} mL. Cismin həcmi səviyyələrin fərqidir: V = ${F(V2)} − ${F(V1)} = ${F(V)} mL = ${F(V)} sm³. ρ = m/V = ${F(m)}/${F(V)} = ${F(rho)} q/sm³ = ${F(rho * 1000)} kq/m³. Tələlər: həcm yerinə sağ səviyyəni götürmək (${F(+(m / V2 * 1000).toFixed(2))}), sol səviyyəni götürmək (${F(+(m / V1 * 1000).toFixed(2))}), iki səviyyəni toplamaq (${F(+(m / (V1 + V2) * 1000).toFixed(2))}), q/sm³-i kq/m³-ə çevirməmək (${F(rho)}).` });
    }, 3000) },
    // 2. spring balance reading, then the spring constant (Huk)
    { tip: "qapali", birlesik: "fiz-huk", minVariety: 8, gen: () => again(() => {
      const cf = pick(DYN), j = tick(cf.N, cf.major), Fv = r6(j * cf.c), x = pick([2, 2.5, 4, 5, 8, 10]), k = 100 * Fv / x;
      const w = [Fv / x, 1000 * Fv / x, 10 * Fv / x, Fv * x / 100]; if (![k, ...w].every(ok3)) return null;
      return mc(ae(k, w, U_("N/m")), { svg: wrap(dynOne(cf, j)), text: `Dinamometrdən yük asılıb (şəkil). Yükün təsirindən dinamometrin yayı ${F(x)} sm uzanıb. Yayın sərtliyi k neçə N/m-dir? (Yük sükunətdədir; g = 10 m/s².)`,
        solution: `Şkala: ${cText(0, cf.major * cf.c, cf.major, cf.c, "N")} Əqrəb 0-dan ${j} bölgü aşağıdadır: F = ${j}·${F(cf.c)} = ${F(Fv)} N (yükün çəkisi). Huk qanunu F = kx, x = ${F(x)} sm = ${F(x / 100)} m: k = ${F(Fv)}/${F(x / 100)} = ${F(k)} N/m. Tələlər: sm-i metrə çevirməmək (${F(+(Fv / x).toFixed(4))}), sm-i mm saymaq (${F(+(1000 * Fv / x).toFixed(4))}), F-i kütlə kimi götürüb g-yə bölmək (${F(+(10 * Fv / x).toFixed(4))}), k = F·x yazmaq (${F(+(Fv * x / 100).toFixed(4))}).` });
    }, 3000) },
    // 3. the same body in air and in water on a spring balance: density of the body (Arximed)
    { tip: "qapali", birlesik: "fiz-arximed", minVariety: 8, gen: () => again(() => {
      const cf = pick(DYN), r = pick([1.25, 1.5, 3, 5, 6, 9]), a = rnd(2, 12), j1 = r6(r * a), j2 = j1 - a; if (!Number.isInteger(j1) || j2 < 2 || j1 > cf.N - 1) return null;
      const F1 = r6(j1 * cf.c), F2 = r6(j2 * cf.c), FA = r6(F1 - F2), rho = 1000 * r;
      const w = [1000 * F2 / FA, 1000 * F1 / F2, 1000 * FA / F2, r]; if (![rho, ...w].every(ok2)) return null;
      return mc(ae(rho, w, U_("kq/m³")), { svg: wrap(dynTwo(cf, j1, j2)), text: `Eyni bircins cisim dinamometrdən əvvəl havada (sol şəkil), sonra tam suya batırılmış halda (sağ şəkil) asılıb; cisim qabın dibinə və divarlarına toxunmur. Suyun sıxlığı 1000 kq/m³-dir. Cismin sıxlığı neçə kq/m³-dir? (Havanın qaldırıcı qüvvəsini nəzərə almayın.)`,
        solution: `Şkala: ${cText(0, cf.major * cf.c, cf.major, cf.c, "N")} Havada F₁ = ${j1}·${F(cf.c)} = ${F(F1)} N, suda F₂ = ${j2}·${F(cf.c)} = ${F(F2)} N. Arximed qüvvəsi göstərişlərin fərqidir: F_A = ${F(F1)} − ${F(F2)} = ${F(FA)} N. F_A = ρ_su·g·V, F₁ = ρ·g·V: ρ/ρ_su = F₁/F_A = ${F(F1)}/${F(FA)} = ${F(r)}, ρ = ${F(r)}·1000 = ${F(rho)} kq/m³. Tələlər: F₂-ni çəki saymaq (${F(+(1000 * F2 / FA).toFixed(2))}), F₁/F₂ nisbəti (${F(+(1000 * F1 / F2).toFixed(2))}), Arximed qüvvəsini suda göstərişə bölmək (${F(+(1000 * FA / F2).toFixed(2))}), 1000-ə vurmağı unutmaq (${F(+r.toFixed(2))}).` });
    }, 3000) },
    // 4. wall of a pipe from two caliper readings (D outside, d inside)
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const M2 = rnd(10, 30), k2 = rnd(0, 9), M1 = M2 + rnd(2, 12), k1 = rnd(0, 9), D = r6(M1 + k1 / 10), d = r6(M2 + k2 / 10);
      const t = (D - d) / 2, w = [D - d, (D + d) / 2, D / 2, d / 2]; if (![t, ...w].every(ok2)) return null;
      return mc(ae(t, w, U_("mm")), { svg: wrap(pair([{ s: vernier(M1, k1), w: 296, h: 122 }, { s: vernier(M2, k2), w: 296, h: 122 }], "İki ştangenzirkul oxunuşu: yuxarıda borunun xarici, aşağıda daxili diametri")),
        text: `Ştangenzirkulla borunun ölçüləri tapılır (hər iki şəkildə əsas şkalanın bölgüsü 1 mm, nonius 10 bölgülüdür). Yuxarıdakı şəkil xarici diametr D-nin, aşağıdakı daxili diametr d-nin ölçülməsidir. Borunun en kəsiyi konsentrik çevrələrdən ibarətdir. Borunun divarının qalınlığı neçə mm-dir?`,
        solution: `Yuxarı şəkil: noniusun sıfırından solda ${M1} mm qalır, noniusun ${ordT(k1)} cizgisi əsas şkalanın bir cizgisi ilə üst-üstə düşür: D = ${M1} + ${k1}·0,1 = ${F(D)} mm. Aşağı şəkil: d = ${M2} + ${k2}·0,1 = ${F(d)} mm. Divar diametrlərin fərqinin yarısıdır (hər iki tərəfdə bir divar): h = (D − d)/2 = (${F(D)} − ${F(d)})/2 = ${F(t)} mm. Tələlər: 2-yə bölməyi unutmaq (${F(r6(D - d))}), diametrlərin ortası (${F(r6((D + d) / 2))}), xarici radius (${F(r6(D / 2))}), daxili radius (${F(r6(d / 2))}).` });
    }, 3000) },
    // 5. milliammeter and voltmeter: resistance (Om qanunu)
    { tip: "qapali", birlesik: "fiz-om", minVariety: 8, gen: () => again(() => {
      const a = pick(DIAL.slice(6)), v = pick(DIAL.slice(3, 6)), Na = Math.round(a.hi / a.c), Nv = Math.round(v.hi / v.c), ja = tick(Na, a.major), jv = tick(Nv, v.major);
      const I = r6(ja * a.c), U = r6(jv * v.c), R = 1000 * U / I, w = [U / I, I / (1000 * U), U * I / 1000, R / 10];
      if (![R, ...w].every(ok3) || R > 5000) return null;
      return mc(ae(R, w, U_("Ω")), { svg: wrap(pair([{ s: dial({ hi: a.hi, c: a.c, major: a.major, N: Na, unit: a.unit, j: ja }, PALW), w: 320, h: 190 }, { s: dial({ hi: v.hi, c: v.c, major: v.major, N: Nv, unit: v.unit, j: jv }, PALW), w: 320, h: 190 }], "Miliampermetr (yuxarıda) və voltmetr (aşağıda)")),
        text: `Rezistora ardıcıl miliampermetr, ona paralel voltmetr qoşulub (cihazlar idealdır). Yuxarıdakı şəkil miliampermetrin, aşağıdakı voltmetrin göstərişidir. Rezistorun müqaviməti neçə Ω-dur?`,
        solution: `Miliampermetr: 0 ilə ${F(a.major * a.c)} mA arasında ${a.major} bölgü, c = ${F(a.c)} mA; əqrəb ${ja} bölgüdədir: I = ${ja}·${F(a.c)} = ${F(I)} mA = ${F(I / 1000)} A. Voltmetr: 0 ilə ${F(v.major * v.c)} V arasında ${v.major} bölgü, c = ${F(v.c)} V; əqrəb ${jv} bölgüdədir: U = ${jv}·${F(v.c)} = ${F(U)} V. R = U/I = ${F(U)}/${F(I / 1000)} = ${F(R)} Ω. Tələlər: milliamperi amperə çevirməmək (${F(+(U / I).toFixed(4))}), I/U (${F(+(I / (1000 * U)).toFixed(4))}), hasil U·I (${F(+(U * I / 1000).toFixed(4))}), çevirmədə bir sıfır səhvi (${F(+(R / 10).toFixed(4))}).` });
    }, 3000) },
    // 6. stopwatch scale for N revolutions, then the linear speed (çevrə üzrə hərəkət)
    { tip: "qapali", birlesik: "fiz-cevre-herekat", minVariety: 8, gen: () => again(() => {
      const N = pick([5, 10, 20]), T = pick([0.5, 1, 1.5, 2, 2.5, 4]), t = r6(N * T); if (t > 40 || Math.abs(t / 0.2 - Math.round(t / 0.2)) > 1e-9) return null;
      const Rcm = pick([10, 20, 25, 40, 50, 80, 100]), Rm = Rcm / 100, lo = Math.max(0, Math.floor(t) - rnd(0, 3)), j = Math.round((t - lo) / 0.2), v = 2 * PI * Rm / T;
      const w = [2 * PI * Rm / t, 2 * PI * Rcm / T, PI * Rm / T, 2 * PI / T]; if (![v, ...w].every(ok3)) return null;
      return mc(ae(v, w, U_("m/s")), { svg: wrap(linScale({ lo, c: 0.2, major: 5, N: 25, unit: "s", j }, PALW)), text: `Fırlanan platformada cisim radiusu ${Rcm} sm olan çevrə üzrə bərabərsürətli hərəkət edir. Cisim ${N} tam dövrü saniyəölçənin şəkildə göstərilən qeydinə qədər edib (şəkildə saniyəölçən şkalasının bir parçası var, qırmızı işarə dayanma anıdır; saniyəölçən hərəkətin əvvəlində 0-dan işə salınıb). Cismin xətti sürəti neçə m/s-dir? (π = 3,14)`,
        solution: `Şkala: ${cText(lo, lo + 1, 5, 0.2, "s")} Göstərici ${lo} s-dən ${j} bölgü sağdadır: t = ${F(lo)} + ${j}·0,2 = ${F(t)} s. Bir dövrün vaxtı T = t/N = ${F(t)}/${N} = ${F(T)} s. R = ${Rcm} sm = ${F(Rm)} m. v = 2πR/T = 6,28·${F(Rm)}/${F(T)} = ${F(v)} m/s. Tələlər: T yerinə ${N} dövrün vaxtını götürmək (${F(+(2 * PI * Rm / t).toFixed(4))}), sm-i metrə çevirməmək (${F(+(2 * PI * Rcm / T).toFixed(4))}), 2-ni unutmaq (${F(+(PI * Rm / T).toFixed(4))}), bucaq sürətini (2π/T = ${F(+(2 * PI / T).toFixed(4))} rad/s) cavab saymaq.` });
    }, 3000) },
    // 7. a body against a ruler: its length in mm
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const cf = pick([{ c: 0.1, major: 10, m: [3, 5], unit: "sm" }, { c: 0.5, major: 2, m: [6, 12], unit: "sm" }]), N = cf.major * rnd(cf.m[0], cf.m[1]), lo = r6(cf.major * cf.c * rnd(0, 3));
      const j1 = rnd(2, Math.floor(N / 2) - 1), j2 = j1 + rnd(Math.ceil(N / 5), Math.floor(N / 2)); if (j2 > N - 1) return null;
      const x1 = r6(lo + j1 * cf.c), x2 = r6(lo + j2 * cf.c), L = r6(x2 - x1), w = [L, x2 * 10, (x1 + x2) * 10, (L + cf.c) * 10];
      if (![L * 10, ...w].every(ok2)) return null;
      return mc(ae(L * 10, w, U_("mm")), { svg: wrap(ruler({ lo, c: cf.c, major: cf.major, N, unit: cf.unit }, j1, j2)), text: `Şəkildə xətkeşin şkalası və ona yaxın qoyulmuş cisim göstərilib (cismin sol və sağ uclarının xətkeşin cizgilərinə uyğun gəldiyi qəbul edilir). Cismin uzunluğu neçə mm-dir?`,
        solution: `Şkala: ${cText(lo, r6(lo + cf.major * cf.c), cf.major, cf.c, "sm")} Sol ucun oxunuşu x₁ = ${F(lo)} + ${j1}·${F(cf.c)} = ${F(x1)} sm, sağ ucun x₂ = ${F(lo)} + ${j2}·${F(cf.c)} = ${F(x2)} sm. Cismin uzunluğu ucların oxunuşlarının fərqidir: L = ${F(x2)} − ${F(x1)} = ${F(L)} sm = ${F(L * 10)} mm. Tələlər: sol ucu 0 saymaq (${F(r6(x2 * 10))}), oxunuşları toplamaq (${F(r6((x1 + x2) * 10))}), sm-i mm-ə çevirməmək (${F(L)}), ucların cizgilərini sayıb bir bölgü artıq götürmək (${F(r6((L + cf.c) * 10))}).` });
    }, 3000) },
    // 8. m(V) graph of a liquid in a beaker: the density is the slope, not m/V
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const rho = pick([0.8, 1, 1.2, 1.5]), m0 = pick([20, 30, 40, 50, 60]), Va = pick([10, 15, 20, 25, 30]), Vb = pick([40, 45, 50, 55, 60]);
      const ma = m0 + rho * Va, mb = m0 + rho * Vb; if (!nice(ma / 10, 0) || !nice(mb / 10, 0) || m0 + 60 * rho > 148) return null;
      const w = [mb / Vb * 1000, ma / Va * 1000, rho, rho * 1e6]; if (![rho * 1000, ...w].every(ok2)) return null;
      return mc(ae(rho * 1000, w, U_("kq/m³")), { svg: wrap(mvGraph(Va, ma, Vb, mb, m0, rho)), text: `Ölçü stakanına müxtəlif həcmdə maye tökülür və stakanla mayenin birgə kütləsi ölçülür. Qrafik birgə kütlənin mayenin həcmindən asılılığıdır (qırmızı nöqtələr tor xətlərinin kəsişməsindədir). Mayenin sıxlığı neçə kq/m³-dir? (1 mL = 1 sm³)`,
        solution: `Qrafikdən: V = ${Va} mL olanda m = ${F(ma)} q, V = ${Vb} mL olanda m = ${F(mb)} q. Düz xəttin başlanğıcı 0-dan yuxarıdadır (stakanın kütləsi ${m0} q), ona görə m/V götürmək olmaz: sıxlıq maillikdir. ρ = Δm/ΔV = (${F(mb)} − ${F(ma)})/(${Vb} − ${Va}) = ${F(mb - ma)}/${Vb - Va} = ${F(rho)} q/sm³ = ${F(rho * 1000)} kq/m³. Tələlər: bir nöqtədə m/V (${F(r6(mb / Vb * 1000))}, ${F(r6(ma / Va * 1000))} — stakanın kütləsi də daxil olur), q/sm³-i çevirməmək (${F(rho)}), g-ı kq-a çevirmədən sm³-i m³-ə çevirmək (${F(rho * 1e6)}).` });
    }, 3000) },
    // 9. two thermometers: heat absorbed by water (istilik)
    { tip: "qapali", birlesik: "fiz-istilik", minVariety: 8, gen: () => again(() => {
      const cf = pick(THERM), step = cf.major * cf.c, mult = rnd(cf.m[0], cf.m[1]), N = cf.major * mult;
      const lo1 = r6(step * rnd(2, 4)), lo2 = r6(lo1 + step * rnd(2, 6)), j1 = tick(N, cf.major), j2 = tick(N, cf.major), t1 = r6(lo1 + j1 * cf.c), t2 = r6(lo2 + j2 * cf.c), dt = r6(t2 - t1);
      const mg = pick([100, 200, 250, 400, 500, 1000, 2000]), m = mg / 1000, Q = 4200 * m * dt; if (dt < 5 || t2 > 95) return null;
      const w = [4200 * mg * dt, 4200 * m * t2, 4200 * m * (t1 + t2), m * dt]; if (![Q, ...w].every(ok2)) return null;
      return mc(ae(Q, w, U_("J")), { svg: wrap(pair([{ s: linScale({ lo: lo1, c: cf.c, major: cf.major, N, unit: "°C", j: j1 }, PALW), w: 320, h: 112 }, { s: linScale({ lo: lo2, c: cf.c, major: cf.major, N, unit: "°C", j: j2 }, PALW), w: 320, h: 112 }], "İki termometr şkalası: qızmadan əvvəl və sonra")),
        text: `${mg} q suyu qızdırırlar. Yuxarıdakı termometr şkalası qızmadan əvvəlki, aşağıdakı qızdıqdan sonrakı temperaturu göstərir. Suyun udduğu istilik miqdarı neçə J-dur? (Suyun xüsusi istilik tutumu 4200 J/(kq·°C); istilik itkisi yoxdur.)`,
        solution: `Şkala: ${cText(lo1, r6(lo1 + step), cf.major, cf.c, "°C")} Qızmadan əvvəl: t₁ = ${F(lo1)} + ${j1}·${F(cf.c)} = ${F(t1)} °C. Qızdıqdan sonra (ikinci şkala ${abl(lo2)} başlayır): t₂ = ${F(lo2)} + ${j2}·${F(cf.c)} = ${F(t2)} °C. Δt = ${F(t2)} − ${F(t1)} = ${F(dt)} °C. m = ${mg} q = ${F(m)} kq. Q = c·m·Δt = 4200·${F(m)}·${F(dt)} = ${F(Q)} J. Tələlər: q-ı kq-a çevirməmək (${F(4200 * mg * dt)}), yalnız son temperaturu götürmək (${F(4200 * m * t2)}), temperaturları toplamaq (${F(4200 * m * (t1 + t2))}), c-ni unutmaq (${F(m * dt)}).` });
    }, 3000) },
    // 10. caliper with a zero error: the thickness of one plate of a stack
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const n = pick([4, 5, 8, 10, 20, 25]), z = pick([0.1, 0.2, 0.3, 0.4, -0.1, -0.2, -0.3]), T = r6(rnd(80, 300) / 10), x = r6(T + z), M = Math.floor(x), k = Math.round((x - M) * 10), d = T / n;
      const w = [x / n, (T + 2 * z) / n, T, T * n]; if (![d, ...w].every(ok3) || T > 40) return null;
      const zt = z > 0 ? `çənələr tam sıxılanda cihaz 0 yox, +${F(z)} mm göstərir` : `çənələr tam sıxılanda cihaz 0 yox, −${F(-z)} mm göstərir`;
      return mc(ae(d, w, U_("mm")), { svg: wrap(vernier(M, k)), text: `${n} eyni lövhə üst-üstə yığılıb və ştangenzirkulla ölçülür (şəkil; əsas şkalanın bölgüsü 1 mm, nonius 10 bölgülüdür). Cihazın sıfır xətası var: ${zt}. Bir lövhənin qalınlığı neçə mm-dir?`,
        solution: `Oxunuş: noniusun sıfırından solda ${M} mm qalır, noniusun ${ordT(k)} cizgisi əsas şkalanın bir cizgisi ilə üst-üstə düşür: x = ${M} + ${k}·0,1 = ${F(x)} mm. Sıfır xətası ${z > 0 ? "+" : "−"}${F(Math.abs(z)).replace("−", "")} mm: ${z > 0 ? "cihaz həmişə o qədər çox göstərir, düzəliş çıxılır" : "cihaz həmişə o qədər az göstərir, düzəliş toplanır"}. Yığının qalınlığı ${F(x)} ${z > 0 ? "−" : "+"} ${F(Math.abs(z))} = ${F(T)} mm. Bir lövhə: ${F(T)}/${n} = ${F(d)} mm. Tələlər: sıfır xətasını nəzərə almamaq (${F(+(x / n).toFixed(4))}), düzəlişi əks işarə ilə tətbiq etmək (${F(+((T + 2 * z) / n).toFixed(4))}), ${dat(n)} bölməyi unutmaq (${F(T)}), ${dat(n)} vurmaq (${F(r6(T * n))}).` });
    }, 3000) },
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
      key: "fiz-olcme", title: "Ölçmə cihazları və ölçmə metodları", fenn: "fizika", link: "dersler/fiz-olcme.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI və sm, mm, mL, %). Onluq kəsr vergül və ya nöqtə ilə: 0,25. g = 10 m/s², π = 3,14.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["oxu", "oxu", "nonius", "periyod", "periyod", "dolayi", "dolayi", "reqem", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-olcme.html")) b.push("dersler/fiz-olcme.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
