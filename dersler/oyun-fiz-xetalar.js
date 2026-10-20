// Fizika · Ölçmələr və xətalar: xəta hesabı, xətti reqressiya, qrafik — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s², 4π² = 39,5 where stated.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const shuffle = a => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = rnd(0, i); [b[i], b[j]] = [b[j], b[i]]; } return b; };
  const r6 = v => +(+v).toFixed(6);
  const F = v => String(r6(v)).replace("-", "−").replace(".", ",");                   // 0.04 → "0,04", −2 → "−2"
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;       // v has at most d decimals
  const Fd = (v, d) => v.toFixed(d).replace(".", ",");                              // fixed decimals: 9 → "9,00"
  const dec = v => { const s = String(r6(v)), i = s.indexOf("."); return i < 0 ? 0 : s.length - i - 1; };
  // exact numeric answer: tolerance well below the last digit
  const X = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: dec(v) === 0 ? Math.max(0.05, Math.abs(v) * 0.003) : 0.4 * 10 ** -dec(v) }, extra);
  const FOUR_PI2 = 39.5;

  // ---------- figure: scatter plot with grid, fitted line(s) and marked points (SVG string, also used for the lesson pictures) ----------
  const PAL = { ink: "#17171a", acc: "#534ab7", red: "#a32d2d", mut: "#6b6b73", grid: "#d8d4c4", cls: "oy-lbl" };
  const wrap = s => { const d = document.createElement("div"); d.innerHTML = s; return d; };
  // g: {xmax, ymax, gx, gy (grid steps), lx, ly (label steps), xlab, ylab, pts:[[x,y]], lines:[{p:[[x0,y0],[x1,y1]], color?, dash?}], marks:[{x, y, label?, dx?, dy?, anchor?}], alt}
  function graph(g, pal = PAL) {
    const W = 330, H = 250, L = 58, Rm = 16, T = 26, B = 46, PW = W - L - Rm, PH = H - T - B;
    const X = x => +(L + PW * x / g.xmax).toFixed(2), Y = y => +(T + PH * (1 - y / g.ymax)).toFixed(2);
    let s = `<svg viewBox="0 0 ${W} ${H}" class="oy-svg" role="img" aria-label="${g.alt || "Qrafik"}">`;
    for (let i = 0; i <= Math.round(g.xmax / g.gx); i++) { const x = X(r6(i * g.gx)); s += `<line x1="${x}" y1="${T}" x2="${x}" y2="${T + PH}" stroke="${pal.grid}" stroke-width="0.9"/>`; }
    for (let i = 0; i <= Math.round(g.ymax / g.gy); i++) { const y = Y(r6(i * g.gy)); s += `<line x1="${L}" y1="${y}" x2="${L + PW}" y2="${y}" stroke="${pal.grid}" stroke-width="0.9"/>`; }
    for (let i = 0; i <= Math.round(g.xmax / g.lx); i++) { const v = r6(i * g.lx); s += `<text x="${X(v)}" y="${T + PH + 16}" text-anchor="middle" class="${pal.cls}" style="font-size:12px">${F(v)}</text>`; }
    for (let i = 0; i <= Math.round(g.ymax / g.ly); i++) { const v = r6(i * g.ly); s += `<text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end" class="${pal.cls}" style="font-size:12px">${F(v)}</text>`; }
    s += `<line x1="${L}" y1="${T}" x2="${L}" y2="${T + PH}" stroke="${pal.ink}" stroke-width="1.8"/><line x1="${L}" y1="${T + PH}" x2="${L + PW}" y2="${T + PH}" stroke="${pal.ink}" stroke-width="1.8"/>`;
    s += `<text x="${L + PW / 2}" y="${H - 8}" text-anchor="middle" class="${pal.cls}" style="font-size:13px">${g.xlab}</text><text x="${L - 40}" y="16" text-anchor="start" class="${pal.cls}" style="font-size:13px">${g.ylab}</text>`;
    for (const ln of g.lines || []) s += `<line x1="${X(ln.p[0][0])}" y1="${Y(ln.p[0][1])}" x2="${X(ln.p[1][0])}" y2="${Y(ln.p[1][1])}" stroke="${ln.color || pal.acc}" stroke-width="2.2"${ln.dash ? ' stroke-dasharray="6 4"' : ""}/>`;
    for (const p of g.pts || []) s += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="3.6" fill="${pal.ink}"/>`;
    for (const m of g.marks || []) {
      const x = X(m.x), y = Y(m.y);
      if (!m.noGuide) s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${T + PH}" stroke="${pal.red}" stroke-width="1.2" stroke-dasharray="4 3"/><line x1="${x}" y1="${y}" x2="${L}" y2="${y}" stroke="${pal.red}" stroke-width="1.2" stroke-dasharray="4 3"/>`;
      s += `<circle cx="${x}" cy="${y}" r="5.5" fill="none" stroke="${pal.red}" stroke-width="2"/>`;
      if (m.label) s += `<text x="${x + (m.dx ?? 10)}" y="${y + (m.dy ?? 18)}" text-anchor="${m.anchor || "start"}" class="${pal.cls}" style="font-size:12px;fill:${pal.red}">${m.label}</text>`;
    }
    return s + `</svg>`;
  }

  // ---------- helpers ----------
  const nTerm = (name, e) => e === 1 ? name : name + ["", "", "²", "³"][e];

  // physical contexts for "y = k·x" graphs: names, units, slope unit and what the slope means
  const CTX = [
    { id: "huk", xl: "x, m", yl: "F, N", u: "N/m", cx: [0.02, 0.05, 0.1], cy: [1, 2, 5], what: "yayın sərtliyi k", km: [20, 400] },
    { id: "cent", xl: "ω², rad²/s²", yl: "a, m/s²", u: "m", cx: [1, 2, 4, 5], cy: [0.2, 0.5, 1, 2], what: "R", km: [0.05, 0.5] },
    { id: "pend", xl: "l, m", yl: "T², s²", u: "s²/m", cx: [0.1, 0.2], cy: [0.2, 0.4, 0.8, 1], what: "T²/l", km: [2, 8] },
    { id: "om", xl: "I, A", yl: "U, V", u: "Ω", cx: [0.1, 0.2, 0.5], cy: [1, 2, 5], what: "R", km: [2, 100] },
  ];

  const levels = [
    { id: "mutleq", ad: "Orta və mütləq xəta", izah: "Orta x̄ = (x₁ + … + xₙ)/n. Mütləq xəta: Δxᵢ = |xᵢ − x̄|, onların ortası Δx̄. Nisbi xəta ε = Δx̄/x̄·100 %. Cihaz xətası bölgü qiymətinin yarısıdır və təsadüfi xətaya əlavə olunur.",
      gen() {
        const ct = pick([
          { w: "rəqqasın 20 rəqsinin vaxtını t", u: "s", step: 0.1, lo: 200, hi: 600 },
          { w: "fırlanan telefonun bucaq sürətini ω", u: "rad/s", step: 0.01, lo: 150, hi: 900 },
          { w: "rəqqasın uzunluğunu l", u: "sm", step: 0.1, lo: 800, hi: 1050 },
          { w: "məftilin diametrini d", u: "mm", step: 0.01, lo: 20, hi: 90 },
        ]);
        const n = pick([4, 5]), ds = [];
        let sum;
        do { ds.length = 0; for (let i = 0; i < n - 1; i++) ds.push(rnd(-3, 3)); sum = ds.reduce((a, b) => a + b, 0); ds.push(-sum); } while (Math.abs(ds[n - 1]) > 4 || ds.every(d => d === 0) || ds.filter(d => d !== 0).length < 3);
        const M = rnd(ct.lo, ct.hi), d = dec(ct.step), u = ct.step, m0 = r6(M * u), vals = shuffle(ds).map(di => r6((M + di) * u)), list = vals.map(v => Fd(v, d)).join("; ");
        const Dm = r6(ds.reduce((a, b) => a + Math.abs(b), 0) / n * u);
        const base = `Fikrət ${ct.w} ${n} dəfə ölçdü: ${list} ${ct.u}. `;
        const sumS = F(r6(vals.reduce((a, b) => a + b, 0)));
        const meanSol = `x̄ = (${vals.map(v => Fd(v, d)).join(" + ")})/${n} = ${sumS}/${n} = ${F(m0)} ${ct.u}.`;
        const devs = vals.map(v => F(r6(Math.abs(v - m0)))).join(" + ");
        const devSol = ` Sapmalar |xᵢ − x̄|: ${vals.map(v => F(r6(Math.abs(v - m0)))).join("; ")}. Δx̄ = (${devs})/${n} = ${F(Dm)} ${ct.u}.`;
        const kind = pick(["orta", "mut", "mut", "eps", "bir", "alt", "cem"]);
        if (kind === "orta") return X(m0, ct.u, { text: base + "Ədədi ortanı x̄ tap.", solution: meanSol });
        if (kind === "mut") return X(Dm, ct.u, { text: base + "Ölçmənin mütləq xətasını (sapmaların ortasını) Δx̄ tap.", solution: meanSol + devSol });
        if (kind === "eps") {
          const e = r6(Dm / m0 * 100);
          if (!nice(e, 1)) return levels[0].gen();
          return X(e, "%", { text: base + "Ölçmənin nisbi xətasını ε neçə faizdir?", solution: meanSol + devSol + ` ε = Δx̄/x̄·100 % = ${F(Dm)}/${F(m0)}·100 % = ${F(e)} %.` });
        }
        if (kind === "bir") {
          const j = rnd(0, n - 1), dj = r6(Math.abs(vals[j] - m0));
          if (dj === 0) return levels[0].gen();
          return X(dj, ct.u, { text: base + `Orta qiymətə görə ${j + 1}-ci ölçmənin (${Fd(vals[j], d)} ${ct.u}) mütləq xətası Δxᵢ neçədir?`, solution: meanSol + ` Δx = |${Fd(vals[j], d)} − ${Fd(m0, d)}| = ${F(dj)} ${ct.u}.` });
        }
        if (kind === "alt") return X(r6(m0 - Dm), ct.u, { text: base + "Nəticəni x̄ ± Δx̄ kimi yazanda intervalın aşağı sərhədi (x̄ − Δx̄) neçədir?", solution: meanSol + devSol + ` Aşağı sərhəd: ${F(m0)} − ${F(Dm)} = ${F(r6(m0 - Dm))} ${ct.u}.` });
        const tot = r6(Dm + u / 2);
        return X(tot, ct.u, { text: base + `Cihazın bölgü qiyməti ${F(u)} ${ct.u}-dir. Cəmi mütləq xəta = təsadüfi xəta Δx̄ + cihaz xətası (bölgü qiymətinin yarısı). Cəmi xəta neçədir?`,
          solution: meanSol + devSol + ` Cihaz xətası ${F(u)}/2 = ${F(u / 2)}. Cəmi: ${F(Dm)} + ${F(u / 2)} = ${F(tot)} ${ct.u}.` });
      } },

    { id: "nisbi", ad: "Dolayı ölçmənin xətası", izah: "Cəm və fərqdə mütləq xətalar toplanır. Hasil və nisbətdə nisbi xətalar toplanır. Qüvvətdə nisbi xəta üstə vurulur: ε(xⁿ) = n·ε(x).",
      gen() {
        const kind = pick(["has", "has", "has", "cem", "kok", "sahe", "g", "a"]);
        if (kind === "has") {
          const names = shuffle(["x", "y", "z"]).slice(0, rnd(2, 3));
          let ex, tot, num, den, es;
          do {
            ex = names.map(() => rnd(1, 3)); es = names.map(() => rnd(1, 6));
            const side = names.map(() => Math.random() < 0.5); if (!side.some(Boolean)) side[0] = true;
            num = names.filter((_, i) => side[i]).map((nm, _, a) => nTerm(nm, ex[names.indexOf(nm)])); den = names.filter((_, i) => !side[i]).map(nm => nTerm(nm, ex[names.indexOf(nm)]));
            tot = ex.reduce((a, e, i) => a + e * es[i], 0);
          } while (tot > 30);
          const expr = num.join("·") + (den.length ? "/" + (den.length > 1 ? "(" + den.join("·") + ")" : den[0]) : "");
          const parts = names.map((nm, i) => `${ex[i] === 1 ? "" : ex[i] + "·"}${es[i]}`);
          return X(tot, "%", { text: `${names.map((nm, i) => `ε_${nm} = ${es[i]} %`).join(", ")}. w = ${expr} kəmiyyətinin nisbi xətası ε_w neçə faizdir?`,
            solution: `Hasil və nisbətdə nisbi xətalar toplanır, üstlər vurulur (bölmə xətanı azaltmır): ε_w = ${names.map((nm, i) => `${ex[i]}·ε_${nm}`).join(" + ")} = ${parts.join(" + ")} = ${tot} %.` });
        }
        if (kind === "cem") {
          const minus = Math.random() < 0.6, a = rnd(100, 400) / 10, b = rnd(50, 99) / 10, da = pick([0.1, 0.2, 0.3, 0.5]), db = pick([0.1, 0.2, 0.3, 0.4]);
          const v = minus ? r6(a - b) : r6(a + b), dd = r6(da + db);
          return X(dd, "sm", { text: `Cismin iki hündürlüyü ölçülüb: h₁ = (${F(a)} ± ${F(da)}) sm, h₂ = (${F(b)} ± ${F(db)}) sm. ${minus ? "Fərq h₁ − h₂" : "Cəm h₁ + h₂"} = ${F(v)} sm. Bu ${minus ? "fərqin" : "cəmin"} mütləq xətası Δ neçə sm-dir?`,
            solution: `Cəmdə də, fərqdə də mütləq xətalar toplanır: Δ = Δh₁ + Δh₂ = ${F(da)} + ${F(db)} = ${F(dd)} sm.${minus ? " (Fərq kiçilir, xəta isə azalmır — yaxın ədədləri çıxmaq nisbi xətanı böyüdür.)" : ""}` });
        }
        if (kind === "kok") {
          const e = 2 * rnd(1, 6), root = Math.random() < 0.5;
          return X(root ? e / 2 : e, "%", { text: root ? `x kəmiyyətinin nisbi xətası ${e} %-dir. √x kəmiyyətinin nisbi xətası neçə faizdir?` : `T kəmiyyətinin nisbi xətası ${e} %-dir. 1/T kəmiyyətinin nisbi xətası neçə faizdir?`,
            solution: root ? `√x = x^(1/2): nisbi xəta üstə vurulur: ½·${e} = ${e / 2} %.` : `1/T = T^(−1): nisbi xəta üstün moduluna vurulur: 1·${e} = ${e} % (tərs almaq nisbi xətanı dəyişmir).` });
        }
        if (kind === "sahe") {
          let l, dl, w, dw, S, el, ew, dS;
          do { l = pick([10, 12, 20, 25, 40, 50]); w = pick([4, 5, 8, 10, 20]); dl = pick([0.1, 0.2, 0.25, 0.5]); dw = pick([0.05, 0.1, 0.2]); el = dl / l * 100; ew = dw / w * 100; S = l * w; dS = r6(S * (el + ew) / 100); } while (!nice(el, 2) || !nice(ew, 2) || !nice(dS, 2) || dw >= w);
          return X(dS, "sm²", { text: `Düzbucaqlının uzunluğu l = (${F(l)} ± ${F(dl)}) sm, eni w = (${F(w)} ± ${F(dw)}) sm-dir. S = l·w sahəsinin mütləq xətası ΔS neçə sm²-dir?`,
            solution: `ε_l = ${F(dl)}/${F(l)}·100 % = ${F(el)} %, ε_w = ${F(dw)}/${F(w)}·100 % = ${F(ew)} %. ε_S = ε_l + ε_w = ${F(el + ew)} %. S = ${F(S)} sm², ΔS = S·ε_S = ${F(S)}·${F((el + ew) / 100)} = ${F(dS)} sm².` });
        }
        if (kind === "g") {
          let l, dl, T, dT, el, eT, eg;
          do { l = pick([0.5, 0.64, 0.8, 1, 1.25, 1.6, 2]); dl = pick([0.002, 0.004, 0.005, 0.01]); T = pick([1.25, 1.5, 1.6, 2, 2.5]); dT = pick([0.005, 0.01, 0.02]); el = dl / l * 100; eT = dT / T * 100; eg = el + 2 * eT; } while (!nice(el, 2) || !nice(eT, 2) || dl >= l / 10 || dT >= T / 10);
          return X(r6(eg), "%", { text: `Pendulum-lab layihəsində l = (${F(l)} ± ${F(dl)}) m, T = (${F(T)} ± ${F(dT)}) s ölçüldü. g = 4π²l/T² qiymətinin nisbi xətası ε_g neçə faizdir?`,
            solution: `ε_l = ${F(dl)}/${F(l)}·100 % = ${F(el)} %, ε_T = ${F(dT)}/${F(T)}·100 % = ${F(eT)} %. g ~ l/T², deməli ε_g = ε_l + 2ε_T = ${F(el)} + 2·${F(eT)} = ${F(r6(eg))} %.` });
        }
        let w, dw, R, dR, ew, eR, ea;
        do { w = pick([2, 2.5, 4, 5, 8]); dw = pick([0.02, 0.04, 0.05, 0.1]); R = pick([0.1, 0.2, 0.25, 0.4, 0.5]); dR = pick([0.002, 0.004, 0.005, 0.01]); ew = dw / w * 100; eR = dR / R * 100; ea = 2 * ew + eR; } while (!nice(ew, 2) || !nice(eR, 2) || !nice(ea, 2) || dw >= w / 10 || dR >= R / 10);
        return X(r6(ea), "%", { text: `Fırlanan telefonun bucaq sürəti ω = (${F(w)} ± ${F(dw)}) rad/s, oxdan məsafə R = (${F(R)} ± ${F(dR)}) m-dir. a = ω²R təcilinin nisbi xətası ε_a neçə faizdir?`,
          solution: `ε_ω = ${F(dw)}/${F(w)}·100 % = ${F(ew)} %, ε_R = ${F(dR)}/${F(R)}·100 % = ${F(eR)} %. a = ω²R: ε_a = 2ε_ω + ε_R = 2·${F(ew)} + ${F(eR)} = ${F(r6(ea))} %.` });
      } },

    { id: "reqres", ad: "Xətti reqressiya", izah: "Başlanğıcdan keçən xətt y = kx üçün ən kiçik kvadratlar üsulu: k = Σxy/Σx². Xətt y = kx + b olarsa, b = y₁ − k·x₁ (xətt üzərindəki nöqtədən).",
      gen() {
        const kind = pick(["sxy", "sxy", "sxy", "b"]);
        const ct = pick([
          { xn: "l, m", yn: "T², s²", u: "s²/m", kk: [3.8, 3.9, 4, 4.1, 4.2], xs: 0.2, es: 0.02, bs: [0.04, 0.08, 0.12], ctx: "Rəqqasın T² və l qiymətləri" },
          { xn: "x, m", yn: "F, N", u: "N/m", kk: [50, 80, 100, 120, 150, 200, 250], xs: 0.02, es: 0.1, bs: [0.5, 1, 1.5], ctx: "Yayın dartılma qüvvəsi F və uzanması x" },
          { xn: "ω², rad²/s²", yn: "a, m/s²", u: "m", kk: [0.15, 0.18, 0.2, 0.22, 0.25], xs: 2, es: 0.05, bs: [0.05, 0.1, 0.15], ctx: "Fırlanan telefon: ω² və a" },
          { xn: "I, A", yn: "U, V", u: "Ω", kk: [5, 8, 10, 12, 15, 20], xs: 0.1, es: 0.1, bs: [0.5, 1, 2], ctx: "Dövrənin cərəyanı I və gərginliyi U" },
        ]);
        const k = pick(ct.kk);
        if (kind === "b") {
          const b = pick(ct.bs), x1 = r6(ct.xs * rnd(1, 3)), x2 = r6(ct.xs * rnd(5, 9)), y1 = r6(k * x1 + b), y2 = r6(k * x2 + b), bu = ct.yn.split(", ")[1];
          return X(b, bu, { text: `${ct.ctx} üçün düz xətt çəkildi (x: ${ct.xn}; y: ${ct.yn}). Xətt (${F(x1)}; ${F(y1)}) və (${F(x2)}; ${F(y2)}) nöqtələrindən keçir. Xəttin ordinat oxunu kəsdiyi nöqtə (x = 0 olanda y) neçədir?`,
            solution: `k = (${F(y2)} − ${F(y1)})/(${F(x2)} − ${F(x1)}) = ${F(r6(y2 - y1))}/${F(r6(x2 - x1))} = ${F(k)} ${ct.u}. y = kx + b → b = y₁ − k·x₁ = ${F(y1)} − ${F(k)}·${F(x1)} = ${F(b)} ${bu}.` });
        }
        const n = rnd(3, 5), idx = Array.from({ length: n }, (_, i) => i + 1);
        let m;
        do { m = idx.map(() => rnd(-2, 2)); } while (m.every(v => v === 0) || m.reduce((a, v, i) => a + v * idx[i], 0) !== 0);
        const xs = idx.map(i => r6(i * ct.xs)), ys = idx.map((i, j) => r6(k * xs[j] + m[j] * ct.es));
        if (ys.some(y => y <= 0)) return levels[2].gen();
        const sxy = r6(xs.reduce((a, x, i) => a + x * ys[i], 0)), sxx = r6(xs.reduce((a, x) => a + x * x, 0));
        const text = h("div", {}, h("p", {}, `${ct.ctx} ölçüldü. Düz xəttin başlanğıcdan keçdiyini bilirik (y = kx). Ən kiçik kvadratlar üsulu ilə k = Σxy/Σx² tap.`),
          h("p", {}, `${ct.xn}: ${xs.map(F).join("; ")}`), h("p", {}, `${ct.yn}: ${ys.map(F).join("; ")}`));
        return X(k, ct.u, { text, solution: `Σxy = ${xs.map((x, i) => `${F(x)}·${F(ys[i])}`).join(" + ")} = ${F(sxy)}. Σx² = ${xs.map(x => F(r6(x * x))).join(" + ")} = ${F(sxx)}. k = ${F(sxy)}/${F(sxx)} = ${F(k)} ${ct.u}.` });
      } },

    { id: "qrafik", ad: "Qrafikdən maillik və g", izah: "Maillik k = (y₂ − y₁)/(x₂ − x₁): xətt üzərindəki iki uzaq nöqtədən götürülür (ölçmə nöqtələrindən yox). Rəqqas: T² = (4π²/g)·l, maillik k = 4π²/g, g = 4π²/k.",
      gen() {
        const kind = pick(["oxu", "oxu", "oxu", "g", "g", "R"]);
        if (kind === "oxu") {
          const ct = pick(CTX);
          let cx, cy, p, q, j0, i1, i2, j1, j2, k;
          do {
            cx = pick(ct.cx); cy = pick(ct.cy); p = pick([1, 2]); q = pick([1, 1, 2, 3]); j0 = pick([0, 0, 1]);
            i1 = p * rnd(1, 3); i2 = p * rnd(2, 5); j1 = q * i1 / p + j0; j2 = q * i2 / p + j0; k = r6((j2 - j1) / (i2 - i1) * cy / cx);
          } while (i2 - i1 < 4 || i2 > 10 || j2 > 10 || j1 < 1 || !nice(k, 2) || q / p > 3 || k < ct.km[0] || k > ct.km[1]);
          const pts = [];
          for (let i = 1; i <= 9; i++) if (Math.random() < 0.85) pts.push([r6(i * cx), r6(Math.min(10, Math.max(0.2, q * i / p + j0 + (Math.random() - 0.5) * 0.7)) * cy)]);
          const iEnd = Math.min(10, (10 - j0) * p / q), P1 = [r6(i1 * cx), r6(j1 * cy)], P2 = [r6(i2 * cx), r6(j2 * cy)];
          const svg = wrap(graph({ xmax: r6(10 * cx), ymax: r6(10 * cy), gx: cx, gy: cy, lx: r6(2 * cx), ly: r6(2 * cy), xlab: ct.xl, ylab: ct.yl, pts,
            lines: [{ p: [[0, r6(j0 * cy)], [r6(iEnd * cx), r6((q * iEnd / p + j0) * cy)]] }], marks: [{ x: P1[0], y: P1[1] }, { x: P2[0], y: P2[1] }], alt: `${ct.yl} – ${ct.xl} qrafiki` }));
          return X(k, ct.u, { svg, text: `Qrafikdə ${ct.yl.split(",")[0]} – ${ct.xl.split(",")[0]} asılılığının düz xətti çəkilib, xətt üzərində iki nöqtə qırmızı ilə qeyd olunub. Xəttin mailliyi (${ct.what}) neçədir?`,
            solution: `Qırmızı nöqtələrin koordinatları: (${F(P1[0])}; ${F(P1[1])}) və (${F(P2[0])}; ${F(P2[1])}). k = (${F(P2[1])} − ${F(P1[1])})/(${F(P2[0])} − ${F(P1[0])}) = ${F(r6(P2[1] - P1[1]))}/${F(r6(P2[0] - P1[0]))} = ${F(k)} ${ct.u}.` });
        }
        if (kind === "g") {
          let k, b, x1, x2, y1, y2;
          do { k = pick([3.8, 3.9, 4, 4.1, 4.2]); b = pick([0, 0, 0.1, 0.2]); x1 = pick([0.2, 0.3, 0.4]); x2 = pick([0.9, 1, 1.1, 1.2]); y1 = r6(k * x1 + b); y2 = r6(k * x2 + b); } while (!nice(y1, 2) || !nice(y2, 2) || y1 <= 0);
          const xmax = Math.ceil(x2 * 5) / 5 + (Math.ceil(x2 * 5) / 5 - x2 < 0.05 ? 0.2 : 0), ymax = Math.ceil(y2 + 0.3), pts = [];
          for (let x = 0.2; x <= xmax - 0.1; x = r6(x + 0.2)) pts.push([x, r6(Math.max(0.05, k * x + b + (Math.random() - 0.5) * 0.16))]);
          const svg = wrap(graph({ xmax: r6(xmax), ymax, gx: 0.2, gy: 1, lx: 0.2, ly: 1, xlab: "l, m", ylab: "T², s²", pts, lines: [{ p: [[0, b], [r6(Math.min(xmax, (ymax - b) / k)), r6(Math.min(k * xmax + b, ymax))]] }],
            marks: [{ x: x1, y: y1, label: `A (${F(x1)}; ${F(y1)})`, dx: 10, dy: 20 }, { x: x2, y: y2, label: `B (${F(x2)}; ${F(y2)})`, dx: -10, dy: -10, anchor: "end" }], alt: "T² – l qrafiki" }));
          const g = Math.round(FOUR_PI2 / k * 100) / 100;
          return X(g, "m/s²", { svg, tol: g * 0.008, text: `Rəqqasın T² – l qrafikinin düz xətti şəkildəki A və B nöqtələrindən keçir (l metrlə, T² s²-lə). T² = (4π²/g)·l olduğunu bilirik, 4π² = 39,5 götür. g neçə m/s²-dir?`,
            solution: `Maillik k = (${F(y2)} − ${F(y1)})/(${F(x2)} − ${F(x1)}) = ${F(r6(y2 - y1))}/${F(r6(x2 - x1))} = ${F(k)} s²/m. g = 4π²/k = 39,5/${F(k)} = ${F(g)} m/s².` + (b !== 0 ? ` Xətt başlanğıcdan keçmir (kəsmə ${F(b)} s²): g-ni tək nöqtədən 4π²l/T² ilə tapmaq düzgün olmazdı, yalnız maillikdən.` : "") });
        }
        let k, b, x1, x2, y1, y2;
        do { k = pick([0.15, 0.18, 0.2, 0.22, 0.25, 0.3]); b = pick([0, 0, 0.05, 0.1]); x1 = pick([2, 3, 4, 5]); x2 = pick([14, 16, 18, 20]); y1 = r6(k * x1 + b); y2 = r6(k * x2 + b); } while (!nice(y1, 2) || !nice(y2, 2));
        const ymax = Math.ceil(y2 + 0.3), xmax = 20, pts = [];
        for (let x = 2; x <= 20; x += 3) pts.push([x, r6(Math.max(0.05, k * x + b + (Math.random() - 0.5) * 0.25))]);
        const svg = wrap(graph({ xmax, ymax, gx: 2, gy: 1, lx: 4, ly: 1, xlab: "ω², rad²/s²", ylab: "a, m/s²", pts, lines: [{ p: [[0, b], [r6(Math.min(xmax, (ymax - b) / k)), r6(Math.min(k * xmax + b, ymax))]] }],
          marks: [{ x: x1, y: y1, label: `A (${x1}; ${F(y1)})`, dx: 10, dy: 20 }, { x: x2, y: y2, label: `B (${x2}; ${F(y2)})`, dx: -10, dy: -10, anchor: "end" }], alt: "a – ω² qrafiki" }));
        const cm = Math.random() < 0.5;
        return X(cm ? r6(k * 100) : k, cm ? "sm" : "m", { svg, text: `Fırlanan telefonun a – ω² qrafikinin düz xətti şəkildəki A və B nöqtələrindən keçir (a = ω²R, maillik R-dir). Xəttin mailliyi neçə ${cm ? "santimetrdir" : "metrdir"}?`,
          solution: `k = (${F(y2)} − ${F(y1)})/(${x2} − ${x1}) = ${F(r6(y2 - y1))}/${x2 - x1} = ${F(k)} m${cm ? ` = ${F(k * 100)} sm` : ""}.` });
      } },

    { id: "eksen", ad: "Oxları seç", izah: "Qrafik düz xətt olsun deyə düsturu y = kx şəklinə sal: T² = (4π²/g)·l, a = R·ω², E = (k/2)·x². Qüvvətdə y və x-in üstlərini ayrı-ayrı vurğula.",
      gen() {
        const kind = pick(["ox", "ox", "ox", "ox", "mas", "mas", "Tl"]);
        if (kind === "ox") {
          const E = pick([
            { law: "T = 2π√(l/g) (rəqqas, g sabit)", ok: "T² – l", bad: ["T – l", "T – l²", "l – T"] },
            { law: "a = ω²R (R sabit)", ok: "a – ω²", bad: ["a – ω", "a – √ω", "ω – a"] },
            { law: "a = v²/R (v sabit)", ok: "a – 1/R", bad: ["a – R", "a – R²", "a – √R"] },
            { law: "E = kx²/2 (yayın enerjisi)", ok: "E – x²", bad: ["E – x", "E – √x", "x – E"] },
            { law: "T = 2π√(m/k) (yaylı rəqqas)", ok: "T² – m", bad: ["T – m", "T – m²", "T – 1/m"] },
            { law: "F = kQq/r² (Kulon qanunu)", ok: "F – 1/r²", bad: ["F – r", "F – 1/r", "F – r²"] },
            { law: "I = U/R (R sabit)", ok: "I – U", bad: ["I – U²", "I – 1/U", "U – 1/I"] },
          ]);
          const opts = shuffle([E.ok, ...E.bad]), c = opts.indexOf(E.ok);
          return { text: `${E.law}. Ölçmə nöqtələrindən düz xətt almaq üçün qrafiki hansı koordinatlarda çəkmək lazımdır? (y – x yazılışında y şaquli, x üfüqi oxdur.)`, choices: opts, correct: c, show: E.ok,
            solution: `Düsturu y = k·x şəklinə sal. Düz xətt verən cüt: ${E.ok}. Digər cütlərdə asılılıq əyri olur.` };
        }
        if (kind === "mas") {
          const t = pick(["T", "a", "ar", "E"]), n = rnd(2, 4);
          if (t === "T") return X(n, "", { unit: "dəfə", text: `Rəqqasın uzunluğu ${n * n} dəfə artırıldı. Period T neçə dəfə artar? (T ~ √l)`, solution: `T ~ √l: √${n * n} = ${n} dəfə.` });
          if (t === "a") return X(n * n, "", { unit: "dəfə", text: `Fırlanma bucaq sürəti ω ${n} dəfə artırıldı (R sabit). Mərkəzəqaçma təcili a neçə dəfə artar? (a = ω²R)`, solution: `a ~ ω²: ${n}² = ${n * n} dəfə.` });
          if (t === "ar") { const m = rnd(2, 3), r = rnd(2, 4); return X(m * m * r, "", { unit: "dəfə", text: `ω ${m} dəfə, R isə ${r} dəfə artırıldı. a = ω²R neçə dəfə artar?`, solution: `a ~ ω²·R: ${m}²·${r} = ${m * m * r} dəfə.` }); }
          return X(n * n, "", { unit: "dəfə", text: `Yayın deformasiyası x ${n} dəfə artırıldı. Elastiklik enerjisi E = kx²/2 neçə dəfə artar?`, solution: `E ~ x²: ${n}² = ${n * n} dəfə.` });
        }
        const Ts = pick([1, 1.2, 1.4, 1.6, 1.8, 2]), k = 4, l = r6(Ts * Ts / k);
        if (!nice(l, 3)) return levels[4].gen();
        return X(Ts, "s", { text: `T² – l qrafikinin düz xətti başlanğıcdan keçir, mailliyi k = 4 s²/m-dir. l = ${F(l)} m olanda period T neçə saniyədir?`, solution: `T² = k·l = 4·${F(l)} = ${F(Ts * Ts)} s², T = √${F(Ts * Ts)} = ${F(Ts)} s.` });
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < 0.5) {
          let l, dls, T, dT, el, eT, eg;
          do { l = pick([0.5, 0.8, 1, 1.25]); dls = pick([0.1, 0.2, 0.25, 0.4, 0.5]); T = pick([1.25, 1.6, 2, 2.5]); dT = pick([0.005, 0.01, 0.02]); el = r6(dls / l); eT = r6(dT / T * 100); eg = r6(el + 2 * eT); } while (!nice(el, 3) || !nice(eT, 3) || !nice(eg, 3) || dT >= T / 10);
          task = `Rəqqas üçün l = ${F(l)} m, Δl = ${F(dls)} sm, T = ${F(T)} s, ΔT = ${F(dT)} s ölçülüb. g = 4π²l/T² qiymətinin nisbi xətasını tapırlar.`;
          steps = [`Δl = ${F(dls)} sm = ${F(dls / 100)} m. ε_l = Δl/l·100 % = ${F(dls / 100)}/${F(l)}·100 % = ${F(el)} %.`, `ε_T = ΔT/T·100 % = ${F(dT)}/${F(T)}·100 % = ${F(eT)} %.`, `g ~ l/T², ona görə ε_g = ε_l + 2ε_T = ${F(el)} + 2·${F(eT)} = ${F(eg)} %.`];
          if (bad === 0) steps[0] = `ε_l = Δl/l·100 % = ${F(dls)}/${F(l)}·100 % = ${F(r6(dls / l * 100))} %.`;
          if (bad === 1) steps[1] = `ε_T = ΔT·100 % = ${F(dT)}·100 % = ${F(r6(dT * 100))} %.`;
          if (bad === 2) steps[2] = `ε_g = ε_l + ε_T = ${F(el)} + ${F(eT)} = ${F(r6(el + eT))} %.`;
          why = [`1-ci addım: Δl sm-lə, l metrlə verilib — əvvəl Δl-i metrə çevir (${F(dls / 100)} m). Düz: ε_l = ${F(el)} %.`,
            `2-ci addım: nisbi xəta ΔT-ni T-yə bölməklə tapılır. Düz: ε_T = ${F(dT)}/${F(T)}·100 % = ${F(eT)} %.`,
            `3-cü addım: g ~ l/T², T kvadratdadır, ona görə ε_T iki dəfə sayılır: ε_g = ${F(el)} + 2·${F(eT)} = ${F(eg)} %.`][bad];
        } else {
          let k, x1, x2, y1, y2, g;
          do { k = pick([3.8, 3.9, 4, 4.1, 4.2]); x1 = pick([0.2, 0.3, 0.4]); x2 = pick([0.9, 1, 1.1, 1.2]); y1 = r6(k * x1); y2 = r6(k * x2); g = Math.round(FOUR_PI2 / k * 100) / 100; } while (!nice(y1, 2) || !nice(y2, 2) || k === 1);
          task = `T² – l qrafikinin xətti A (${F(x1)}; ${F(y1)}) və B (${F(x2)}; ${F(y2)}) nöqtələrindən keçir (l metrlə, T² s²-lə). 4π² = 39,5 götürüb g-ni tapırlar.`;
          steps = [`Maillik k = (T₂² − T₁²)/(l₂ − l₁) = ${F(r6(y2 - y1))}/${F(r6(x2 - x1))} = ${F(k)} s²/m.`, `T² = (4π²/g)·l olduğundan k = 4π²/g, yəni g = 4π²/k.`, `g = 39,5/${F(k)} = ${F(g)} m/s².`];
          if (bad === 0) steps[0] = `Maillik k = (l₂ − l₁)/(T₂² − T₁²) = ${F(r6(x2 - x1))}/${F(r6(y2 - y1))} = ${F(r6((x2 - x1) / (y2 - y1)))}.`;
          if (bad === 1) steps[1] = `T² = (4π²/g)·l olduğundan k = 4π²/g, yəni g = k/(4π²).`;
          if (bad === 2) steps[2] = `g = 39,5·${F(k)} = ${F(r6(39.5 * k))} m/s².`;
          why = [`1-ci addım: maillik şaquli dəyişmənin üfüqi dəyişməyə nisbətidir: Δ(T²)/Δl = ${F(k)} s²/m.`,
            `2-ci addım: k = 4π²/g-dən g = 4π²/k alınır, k/(4π²) yox.`,
            `3-cü addım: g = 4π²/k bölmədir: 39,5/${F(k)} = ${F(g)} m/s² (vurma yox).`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Pendulum-lab (T² – l qrafiki) və fırlanan telefon (a – ω² qrafiki): hər nəticənin xətası və qrafikin mənası.",
      gen() {
        const kind = pick(["orta", "g", "kes", "fark", "pay"]);
        if (kind === "orta") {
          const n = 5, M = rnd(240, 400);
          let d; do { d = Array.from({ length: n - 1 }, () => rnd(-3, 3)); d.push(-d.reduce((a, b) => a + b, 0)); } while (Math.abs(d[n - 1]) > 4 || d.every(v => v === 0));
          const vals = shuffle(d).map(v => r6((M + v) * 0.1)), tm = r6(M * 0.1), T = r6(tm / 20);
          return X(T, "s", { text: `Pendulum-lab layihəsində Fikrət 20 rəqsin vaxtını 5 dəfə ölçdü: ${vals.map(v => Fd(v, 1)).join("; ")} s. Periodun ədədi ortası T neçə saniyədir?`,
            solution: `Orta vaxt t̄ = (${vals.map(v => Fd(v, 1)).join(" + ")})/5 = ${F(tm)} s. T = t̄/20 = ${F(tm)}/20 = ${F(T)} s.` });
        }
        if (kind === "g") {
          let l, T, g;
          do { T = pick([1, 1.2, 1.5, 2, 2.5]); l = rnd(20, 160) * 0.01; g = r6(40 * l / (T * T)); l = r6(l); } while (!nice(g, 2) || g < 9 || g > 11);
          return X(g, "m/s²", { text: `Rəqqasın uzunluğu l = ${F(l)} m, periodu T = ${F(T)} s ölçüldü. g = 4π²l/T² düsturu ilə g-ni tap (4π² = 40 götür).`, solution: `g = 40·l/T² = 40·${F(l)}/${F(r6(T * T))} = ${F(g)} m/s².` });
        }
        if (kind === "kes") {
          const k = 4, r = pick([1, 1.5, 2, 2.5, 3]), b = r6(k * r / 100);
          return X(r, "sm", { text: `Fikrət T² – L qrafikini çəkdi, burada L ipin uzunluğudur (topun mərkəzinə qədər yox, ipin ucuna qədər). Düz xətt T² oxunu ${F(b)} s²-də kəsir, mailliyi ${k} s²/m-dir. Rəqqasın uzunluğu l = L + r olduğunu (r — topun radiusu) nəzərə alıb r-i tap.`,
            solution: `T² = k·l = k·(L + r) = k·L + k·r. Deməli xətt T² oxunu b = k·r nöqtəsində kəsir. r = b/k = ${F(b)}/${k} = ${F(r / 100)} m = ${F(r)} sm.` });
        }
        if (kind === "fark") {
          let Rm, dl, sl;
          do { Rm = r6(rnd(30, 50) * 0.005); dl = pick([0.005, 0.01, 0.015, 0.02]); sl = r6(Rm + dl); } while (!nice(Rm, 3));
          return X(r6(dl * 100), "sm", { text: `Fikrət a – ω² qrafikinin mailliyini ${F(sl)} m tapdı, xətkeşlə ölçülmüş məsafə isə R = ${F(Rm)} m-dir. a = ω²R olduğundan maillik akselerometrin oxdan həqiqi məsafəsidir. Akselerometr R-in ölçüldüyü nöqtədən oxdan neçə sm artıq uzaqdadır?`,
            solution: `Maillik = akselerometrin məsafəsi = ${F(sl)} m. Fərq: ${F(sl)} − ${F(Rm)} = ${F(dl)} m = ${F(dl * 100)} sm.` });
        }
        const el = pick([0.1, 0.2, 0.25, 0.4, 0.5]), eT = pick([0.2, 0.25, 0.4, 0.5, 0.8, 1]);
        return X(r6(2 * eT), "%", { text: `Pendulum-lab-da ε_l = ${F(el)} %, ε_T = ${F(eT)} %. g = 4π²l/T² qiymətinin xətasına T ölçməsinin payı (2ε_T) neçə faizdir?`,
          solution: `g ~ l/T²: T-nin payı iki dəfə sayılır, 2·${F(eT)} = ${F(2 * eT)} %. l-in payı ${F(el)} %-dir. Ümumi ε_g = ${F(el)} + ${F(2 * eT)} = ${F(r6(el + 2 * eT))} %.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-xetalar", title: "Ölçmələr və xətalar", fenn: "fizika", link: "dersler/fiz-xetalar.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (%, s, m, sm, s²/m, N/m, Ω, m/s²). Onluq kəsr vergül və ya nöqtə ilə: 0,25. 4π² = 39,5 (yalnız qeyd olunanda).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["mutleq", "mutleq", "nisbi", "nisbi", "reqres", "qrafik", "qrafik", "eksen", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-xetalar.html")) b.push("dersler/fiz-xetalar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
