// Düzbucaqlı paralelepiped və kub — mastery game levels (surface area, volume, space diagonal, volume units,
// painted cube, word problems, find-the-mistake) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const fmt = n => String(Math.round(n * 1000) / 1000).replace(".", ",");
  const root = n => { let k = 1; for (let d = 2; d * d <= n; d++) while (n % (d * d) === 0) { n /= d * d; k *= d; } return n === 1 ? String(k) : (k === 1 ? "" : k) + "√" + n; };
  const dims = () => [rnd(2, 9), rnd(2, 9), rnd(2, 9)];

  // ---- box in oblique projection: a — length (right), b — width (depth), c — height (up)
  // o: { lab:{a,b,c}, diag:bool, cube:bool }
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  function box(a, b, c, o = {}) {
    const W = 280, H = 190, pad = 30, padL = 54, padR = 58, dx = .42 * b, dy = .42 * b;
    const P = { F0: [0, 0], F1: [a, 0], F2: [a, c], F3: [0, c] };
    P.B0 = [dx, dy]; P.B1 = [a + dx, dy]; P.B2 = [a + dx, c + dy]; P.B3 = [dx, c + dy];
    const xs = Object.values(P).map(p => p[0]), ys = Object.values(P).map(p => p[1]);
    const s = Math.min((W - padL - padR) / Math.max(...xs), (H - 2 * pad) / Math.max(...ys));
    const ox = padL + (W - padL - padR - s * Math.max(...xs)) / 2, oy = (H + s * Math.max(...ys)) / 2;
    const Q = {}; for (const k in P) Q[k] = [ox + s * P[k][0], oy - s * P[k][1]];
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": o.aria || "Düzbucaqlı paralelepiped" });
    g.append(sv("polygon", { points: ["F0", "F1", "F2", "F3"].map(k => Q[k].join(",")).join(" "), fill: "var(--accent-soft)", stroke: "none" }));
    if (!o.open) g.append(sv("polygon", { points: ["F3", "F2", "B2", "B3"].map(k => Q[k].join(",")).join(" "), fill: "var(--accent-soft)", "fill-opacity": .6, stroke: "none" }));
    g.append(sv("polygon", { points: ["F1", "B1", "B2", "F2"].map(k => Q[k].join(",")).join(" "), fill: "var(--accent-soft)", "fill-opacity": .8, stroke: "none" }));
    if (o.under) o.under(g, Q);
    const E = (p, q, hid) => { const at = { x1: Q[p][0], y1: Q[p][1], x2: Q[q][0], y2: Q[q][1], stroke: "var(--ink)", "stroke-width": hid ? 1.3 : 2, "stroke-linecap": "round" }; if (hid) at["stroke-dasharray"] = "5 4"; g.append(sv("line", at)); };
    for (const [p, q] of [["F0", "F1"], ["F1", "F2"], ["F2", "F3"], ["F3", "F0"], ["F1", "B1"], ["B1", "B2"], ["F2", "B2"], ["B2", "B3"], ["F3", "B3"]]) E(p, q);
    for (const [p, q] of [["F0", "B0"], ["B0", "B1"], ["B0", "B3"]]) E(p, q, true);
    if (o.diag) g.append(sv("line", { x1: Q.F0[0], y1: Q.F0[1], x2: Q.B2[0], y2: Q.B2[1], stroke: "var(--accent)", "stroke-width": 2.5 }));
    if (o.over) o.over(g, Q);
    const rects = [];
    const T = (x, y, t, anchor = "middle") => { const w = 8.5 * String(t).length; rects.push([anchor === "end" ? x - w : anchor === "start" ? x : x - w / 2, y - 12, anchor === "end" ? x : anchor === "start" ? x + w : x + w / 2, y + 4]); g.append(sv("text", { x, y, "text-anchor": anchor, class: "oy-lbl" }, t)); };
    const L = o.lab || {};
    if (L.a != null) T((Q.F0[0] + Q.F1[0]) / 2, Q.F0[1] + 18, L.a);
    if (L.c != null) T(Q.F0[0] - 8, (Q.F0[1] + Q.F3[1]) / 2 + 5, L.c, "end");
    if (L.b != null) T((Q.F1[0] + Q.B1[0]) / 2 + 10, (Q.F1[1] + Q.B1[1]) / 2 + 10, L.b, "start");
    if (L.d != null) { // the diagonal label sits beside the line, on whichever side leaves the other labels free
      const w = 8.5 * String(L.d).length, cand = [];
      for (const f of [.35, .5, .65]) { const x = Q.F0[0] + f * (Q.B2[0] - Q.F0[0]), y = Q.F0[1] + f * (Q.B2[1] - Q.F0[1]);
        cand.push([x + 7, y + 14, "start", [x + 7, y + 2, x + 7 + w, y + 18]], [x - 7, y - 7, "end", [x - 7 - w, y - 19, x - 7, y - 3]]); }
      const free = r => rects.every(q => !(r[0] < q[2] && q[0] < r[2] && r[1] < q[3] && q[1] < r[3]));
      const c = cand.find(c => free(c[3])) || cand[0];
      T(c[0], c[1], L.d, c[2]);
    }
    return g;
  }
  const SEHV = ["1-ci addım", "2-ci addım", "3-cü addım"];

  const levels = [
    { id: "sethi", ad: "Səthin sahəsi", izah: "Paralelepiped: S = 2(ab + bc + ac). Kub: S = 6a². Yan səth: 2c(a + b).",
      gen() {
        const kind = pick(["full", "full", "cube", "cubeBack", "side"]);
        if (kind === "full") { const [a, b, c] = dims(), S = 2 * (a * b + b * c + a * c);
          return { text: `Düzbucaqlı paralelepipedin ölçüləri ${a}, ${b} və ${c}-dir. Tam səthinin sahəsini tap.`, svg: box(a, b, c, { lab: { a, b, c } }), answer: S, show: String(S), tol: 0.01,
            solution: `6 üz, qarşı üzlər bərabərdir: S = 2(${a}·${b} + ${b}·${c} + ${a}·${c}) = 2(${a * b} + ${b * c} + ${a * c}) = ${S}.` }; }
        if (kind === "cube") { const a = rnd(2, 15), S = 6 * a * a;
          return { text: `Kubun tili ${a}-dir. Kubun tam səthinin sahəsini tap.`, svg: box(a, a, a, { lab: { a } }), answer: S, show: String(S), tol: 0.01, solution: `Kubun 6 bərabər kvadrat üzü var: S = 6 · ${a}² = 6 · ${a * a} = ${S}.` }; }
        if (kind === "cubeBack") { const a = rnd(2, 12), S = 6 * a * a, V = Math.random() < .5;
          return { text: `Kubun tam səthinin sahəsi ${S}-dir. Kubun ${V ? "həcmini" : "tilini"} tap.`, answer: V ? a ** 3 : a, show: String(V ? a ** 3 : a), tol: 0.01,
            solution: `6a² = ${S} → a² = ${a * a} → a = ${a}.` + (V ? ` V = a³ = ${a ** 3}.` : "") }; }
        const [a, b, c] = dims(), L = 2 * c * (a + b);
        return { text: `Düzbucaqlı paralelepipedin oturacağının ölçüləri ${a} və ${b}, hündürlüyü ${c}-dir. Yan səthinin sahəsini tap.`, svg: box(a, b, c, { lab: { a, b, c } }), answer: L, show: String(L), tol: 0.01,
          solution: `Yan səth — 4 yan üzdür (oturacaqlar daxil deyil): oturacağın perimetri · hündürlük = 2(${a} + ${b}) · ${c} = ${L}.` };
      } },
    { id: "hecm", ad: "Həcm", izah: "Paralelepiped: V = abc. Kub: V = a³. Til k dəfə artanda həcm k³ dəfə artır.",
      gen() {
        const kind = pick(["V", "V", "third", "cube", "scale"]);
        if (kind === "V") { const [a, b, c] = dims(), V = a * b * c;
          return { text: `Düzbucaqlı paralelepipedin ölçüləri ${a}, ${b} və ${c}-dir. Həcmini tap.`, svg: box(a, b, c, { lab: { a, b, c } }), answer: V, show: String(V), tol: 0.01, solution: `V = ${a} · ${b} · ${c} = ${V}.` }; }
        if (kind === "third") { const [a, b, c] = dims(), V = a * b * c;
          return { text: `Düzbucaqlı paralelepipedin həcmi ${V}-dir, oturacağının ölçüləri ${a} və ${b}-dir. Hündürlüyünü tap.`, svg: box(a, b, c, { lab: { a, b, c: "?" } }), answer: c, show: String(c), tol: 0.01,
            solution: `V = a·b·c → c = V : (a·b) = ${V} : ${a * b} = ${c}.` }; }
        if (kind === "cube") { const a = rnd(2, 12), V = a ** 3, S = Math.random() < .5;
          return { text: `Kubun həcmi ${V}-dir. Kubun ${S ? "tam səthinin sahəsini" : "tilini"} tap.`, answer: S ? 6 * a * a : a, show: String(S ? 6 * a * a : a), tol: 0.01,
            solution: `a³ = ${V} → a = ${a}.` + (S ? ` S = 6a² = 6 · ${a * a} = ${6 * a * a}.` : "") }; }
        const k = rnd(2, 5), what = pick(["V", "S"]);
        return { text: `Kubun tilini ${k} dəfə artırdılar. Onun ${what === "V" ? "həcmi" : "tam səthinin sahəsi"} neçə dəfə artar?`, answer: what === "V" ? k ** 3 : k * k, show: String(what === "V" ? k ** 3 : k * k), tol: 0.01,
          solution: what === "V" ? `V = a³: yeni həcm (${k}a)³ = ${k ** 3}a³ — ${k ** 3} dəfə.` : `S = 6a²: yeni sahə 6(${k}a)² = ${k * k} · 6a² — ${k * k} dəfə.` };
      } },
    { id: "diaqonal", ad: "Diaqonal", izah: "Paralelepipedin diaqonalı d = √(a² + b² + c²). Kubun diaqonalı d = a√3.",
      gen() {
        const kind = pick(["nice", "nice", "root", "cube", "cubeBack"]);
        if (kind === "nice" || kind === "root") {
          let a, b, c;
          if (kind === "nice") { [a, b, c] = pick([[1, 2, 2], [2, 3, 6], [1, 4, 8], [2, 6, 9], [4, 4, 7], [6, 6, 7], [2, 10, 11], [3, 4, 12], [2, 5, 14], [4, 8, 8], [6, 9, 2], [3, 6, 6], [4, 4, 2], [8, 9, 12], [12, 4, 3]]).slice().sort(() => Math.random() - .5); }
          else { do { [a, b, c] = dims(); } while (Number.isInteger(Math.sqrt(a * a + b * b + c * c))); }
          const n = a * a + b * b + c * c;
          return { text: `Düzbucaqlı paralelepipedin ölçüləri ${a}, ${b} və ${c}-dir. Diaqonalını tap.`, svg: box(a, b, c, { lab: { a, b, c, d: "?" }, diag: true }), answer: Math.sqrt(n), show: root(n), placeholder: "məs. 7 və ya 3√5",
            solution: `d² = ${a}² + ${b}² + ${c}² = ${a * a} + ${b * b} + ${c * c} = ${n} → d = ${root(n)}.` };
        }
        const a = rnd(2, 12);
        if (kind === "cube") return { text: `Kubun tili ${a}-dir. Kubun diaqonalını tap.`, svg: box(a, a, a, { lab: { a, d: "?" }, diag: true }), answer: a * Math.sqrt(3), show: a + "√3",
          solution: `d = √(a² + a² + a²) = √(3a²) = a√3 = ${a}√3.` };
        const w = pick(["a", "a", "V", "S"]), ans = w === "a" ? a : w === "V" ? a ** 3 : 6 * a * a;
        return { text: `Kubun diaqonalı ${a}√3-dür. Kubun ${{ a: "tilini", V: "həcmini", S: "tam səthinin sahəsini" }[w]} tap.`, answer: ans, show: String(ans), tol: 0.01,
          solution: `d = a√3 = ${a}√3 → a = ${a}.` + (w === "V" ? ` V = a³ = ${ans}.` : w === "S" ? ` S = 6a² = 6 · ${a * a} = ${ans}.` : "") };
      } },
    { id: "vahid", ad: "Həcm vahidləri", izah: "1 m³ = 1000 dm³, 1 dm³ = 1000 sm³. 1 l = 1 dm³ = 1000 sm³. Uzunluq 10 dəfə — həcm 1000 dəfə.",
      gen() {
        const kind = pick(["akv", "akv", "m3l", "lm3", "sm3l", "lsm3"]);
        if (kind === "akv") {
          const [a, b, c] = [pick([20, 30, 40, 50, 60, 80, 100]), pick([20, 25, 30, 40, 50]), pick([20, 30, 40, 50])], L = a * b * c / 1000;
          return { text: `Akvariumun ölçüləri ${a} sm, ${b} sm və ${c} sm-dir. Ona neçə litr su tutar?`, svg: box(a, b, c, { lab: { a: a + " sm", b: b + " sm", c: c + " sm" } }), answer: L, show: fmt(L), unit: "l",
            solution: `V = ${a} · ${b} · ${c} = ${a * b * c} sm³. 1 l = 1000 sm³ → ${a * b * c} : 1000 = ${fmt(L)} l.` };
        }
        if (kind === "m3l") { const v = pick([0.5, 1.2, 2, 2.5, 3, 4.8, 0.25, 6, 0.75]);
          return { text: `${fmt(v)} m³ neçə litrdir?`, answer: v * 1000, show: fmt(v * 1000), unit: "l", solution: `1 m³ = 1000 dm³ = 1000 l → ${fmt(v)} · 1000 = ${fmt(v * 1000)} l.` }; }
        if (kind === "lm3") { const l = pick([500, 1500, 2000, 250, 3200, 750, 12000, 4500]);
          return { text: `${l} l neçə m³-dir?`, answer: l / 1000, show: fmt(l / 1000), unit: "m³", solution: `1000 l = 1 m³ → ${l} : 1000 = ${fmt(l / 1000)} m³.` }; }
        if (kind === "sm3l") { const v = pick([2500, 500, 750, 12000, 3000, 1250, 64000]);
          return { text: `${v} sm³ neçə litrdir?`, answer: v / 1000, show: fmt(v / 1000), unit: "l", solution: `1 l = 1 dm³ = 1000 sm³ → ${v} : 1000 = ${fmt(v / 1000)} l.` }; }
        const v = pick([0.5, 1.5, 2, 3, 0.25, 4, 1.2]);
        return { text: `${fmt(v)} l neçə sm³-dir?`, answer: v * 1000, show: fmt(v * 1000), unit: "sm³", solution: `1 l = 1000 sm³ → ${fmt(v)} · 1000 = ${fmt(v * 1000)} sm³.` };
      } },
    { id: "boya", ad: "Rənglənmiş kub", izah: "n × n × n kub boyanıb n³ kiçik kuba kəsilir. 3 üzü boyalı: 8 (təpələr). 2 üzü: 12(n − 2). 1 üzü: 6(n − 2)². Boyasız: (n − 2)³.",
      gen() {
        const n = rnd(3, 10), t = pick([3, 2, 1, 0, 2, 1, 0]);
        const ans = t === 3 ? 8 : t === 2 ? 12 * (n - 2) : t === 1 ? 6 * (n - 2) ** 2 : (n - 2) ** 3;
        const q = { 3: "üç üzü", 2: "yalnız iki üzü", 1: "yalnız bir üzü", 0: "heç bir üzü" }[t];
        const why = { 3: "Üç üzü boyalı kublar təpələrdədir — kubun 8 təpəsi var.", 2: `İki üzü boyalı kublar tillərin üzərindədir (təpələrdən başqa): hər tildə ${n} − 2 = ${n - 2}, 12 til → 12 · ${n - 2} = ${ans}.`,
          1: `Bir üzü boyalı kublar üzlərin ortasındadır: hər üzdə (${n} − 2)² = ${(n - 2) ** 2}, 6 üz → ${ans}.`, 0: `Boyasız kublar içəridədir: (${n} − 2)³ = ${n - 2}³ = ${ans}.` }[t];
        return { text: `Tili ${n} sm olan kubun bütün səthi rənglənib, sonra o, tili 1 sm olan ${n ** 3} kubcuğa kəsilib. Neçə kubcuğun ${t ? q + " rənglidir" : "heç bir üzü rənglənməyib"}?`, answer: ans, show: String(ans), tol: 0.01, solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Hovuz, otaq, qutu: həcm (V = abc), səth (rəng, kafel) və vahidlərin çevrilməsi.",
      gen() {
        const kind = pick(["hovuz", "otaq", "qutu", "akvdolu"]);
        if (kind === "hovuz") { const a = pick([10, 12, 15, 20, 25]), b = pick([4, 5, 6, 8, 10]), c = pick([1.5, 2, 2.5, 1.2]), V = a * b * c, ton = Math.random() < .5;
          return { text: `Hovuzun uzunluğu ${a} m, eni ${b} m, dərinliyi ${fmt(c)} m-dir. Tam dolu hovuzda neçə ${ton ? "ton" : "kubmetr (m³)"} su var?${ton ? " (1 m³ suyun kütləsi 1 tondur.)" : ""}`,
            answer: V, show: fmt(V), unit: ton ? "ton" : "m³", solution: `V = ${a} · ${b} · ${fmt(c)} = ${fmt(V)} m³${ton ? ` = ${fmt(V)} ton` : ""}.` }; }
        if (kind === "otaq") { const a = rnd(4, 7), b = rnd(3, 5), c = pick([2.5, 3]), w = pick([2, 3, 4]), L = 2 * c * (a + b) - w;
          return { text: `Otağın uzunluğu ${a} m, eni ${b} m, hündürlüyü ${fmt(c)} m-dir. Dörd divarı rəngləmək lazımdır; qapı və pəncərələrin ümumi sahəsi ${w} m²-dir (onlar rənglənmir). Neçə m² rənglənəcək?`,
            answer: L, show: fmt(L), unit: "m²", solution: `Divarlar — yan səthdir: 2(${a} + ${b}) · ${fmt(c)} = ${fmt(2 * c * (a + b))} m². Qapı-pəncərəni çıx: ${fmt(2 * c * (a + b))} − ${w} = ${fmt(L)} m².` }; }
        if (kind === "qutu") { const [x, y, z] = [rnd(2, 5), rnd(2, 5), rnd(1, 4)], [p, q, r] = [pick([10, 20, 30]), pick([10, 20, 25]), pick([10, 20])], n = x * y * z;
          return { text: `Ölçüləri ${x * p} sm × ${y * q} sm × ${z * r} sm olan yeşiyə ölçüləri ${p} sm × ${q} sm × ${r} sm olan qutular eyni istiqamətdə düzülür. Yeşiyə ən çoxu neçə qutu yerləşər?`,
            answer: n, show: String(n), tol: 0.01, solution: `Uzununa ${x * p} : ${p} = ${x}, eninə ${y * q} : ${q} = ${y}, hündürlüyə ${z * r} : ${r} = ${z}. Cəmi ${x} · ${y} · ${z} = ${n}. (Həcmləri bölmək də eyni cavabı verir, çünki ölçülər tam bölünür.)` }; }
        const a = pick([40, 50, 60, 80]), b = pick([20, 25, 30, 40]), L = pick([12, 18, 24, 30, 36, 40, 48]), hh = L * 1000 / (a * b);
        if (!Number.isInteger(hh * 10)) return this.gen();
        return { text: `Akvariumun oturacağı ${a} sm × ${b} sm ölçülü düzbucaqlıdır. Ona ${L} l su tökdülər. Su neçə sm hündürlüyə qalxdı?`, answer: hh, show: fmt(hh), unit: "sm",
          solution: `${L} l = ${L * 1000} sm³. h = V : (a · b) = ${L * 1000} : ${a * b} = ${fmt(hh)} sm.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const [a, b, c] = dims(), bad = rnd(0, 2);
        if (Math.random() < .5) {
          const ab = a * b, bc = b * c, ac = a * c, s = ab + bc + ac;
          const st = [`Üzlərin sahələri: ${a}·${b} = ${ab}, ${b}·${c} = ${bc}, ${a}·${c} = ${ac}.`, `Cəmi: ${ab} + ${bc} + ${ac} = ${s}.`, `Hər üzdən iki dənədir: S = 2 · ${s} = ${2 * s}.`];
          if (bad === 0) { const w = a + b; st[0] = `Üzlərin sahələri: ${a}+${b} = ${w}, ${b}·${c} = ${bc}, ${a}·${c} = ${ac}.`; if (w === ab) return this.gen(); st[1] = `Cəmi: ${w} + ${bc} + ${ac} = ${w + bc + ac}.`; st[2] = `Hər üzdən iki dənədir: S = 2 · ${w + bc + ac} = ${2 * (w + bc + ac)}.`; }
          if (bad === 1) { const w = s + pick([-10, 10, -1, 1]); st[1] = `Cəmi: ${ab} + ${bc} + ${ac} = ${w}.`; st[2] = `Hər üzdən iki dənədir: S = 2 · ${w} = ${2 * w}.`; }
          if (bad === 2) st[2] = pick([`Paralelepipedin 6 üzü var: S = 6 · ${s} = ${6 * s}.`, `Cavab: S = ${s}.`]);
          const text = h("div", {}, h("p", {}, `Ölçüləri ${a}, ${b}, ${c} olan düzbucaqlı paralelepipedin tam səthinin sahəsi:`), h("ol", { class: "oy-steps" }, ...st.map(t => h("li", {}, t))));
          const why = [`1-ci addım: üzün sahəsi tərəflərin hasilidir: ${a} · ${b} = ${ab}.`, `2-ci addım: hesab səhvi. ${ab} + ${bc} + ${ac} = ${s}.`, `3-cü addım: 6 üz cüt-cüt bərabərdir (qarşı üzlər), ona görə üç sahənin cəmi 2-yə vurulur: S = ${2 * s}.`][bad];
          return { text, choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
        }
        const n = a * a + b * b + c * c;
        const st = [`d² = a² + b² + c².`, `d² = ${a * a} + ${b * b} + ${c * c} = ${n}.`, `d = √${n} = ${root(n)}.`];
        if (bad === 0) { st[0] = pick([`d = a + b + c.`, `d² = a² + b².`]); const alt = st[0].startsWith("d =") ? null : a * a + b * b;
          st[1] = alt == null ? `d = ${a} + ${b} + ${c} = ${a + b + c}.` : `d² = ${a * a} + ${b * b} = ${alt}.`; st[2] = alt == null ? `Cavab: ${a + b + c}.` : `d = √${alt} = ${root(alt)}.`; }
        if (bad === 1) { st[1] = `d² = ${2 * a} + ${2 * b} + ${2 * c} = ${2 * (a + b + c)}.`; st[2] = `d = √${2 * (a + b + c)} = ${root(2 * (a + b + c))}.`; if (2 * (a + b + c) === n) return this.gen(); }
        if (bad === 2) st[2] = pick([`d = ${n} : 2 = ${fmt(n / 2)}.`, `d = ${n}.`]);
        const text = h("div", {}, h("p", {}, `Ölçüləri ${a}, ${b}, ${c} olan düzbucaqlı paralelepipedin diaqonalı:`), h("ol", { class: "oy-steps" }, ...st.map(t => h("li", {}, t))));
        const why = [`1-ci addım: fəza diaqonalı üçün düstur d² = a² + b² + c² — üç ölçünün hamısı, kvadratları ilə.`, `2-ci addım: kvadrat 2-yə vurmaq deyil: ${a}² = ${a * a}, ${b}² = ${b * b}, ${c}² = ${c * c}. d² = ${n}.`, `3-cü addım: d² = ${n}-dən kök alınır: d = ${root(n)}.`][bad];
        return { text, choices: SEHV, correct: bad, show: SEHV[bad], solution: why };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (forgetting the factor 2, volume instead of area, k² instead of k³, ...).
  const { ae, again } = Oyun;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const shuffle = a => a.map(x => [Math.random(), x]).sort((p, q) => p[0] - q[0]).map(p => p[1]);
  const mid = (P, R) => [(P[0] + R[0]) / 2, (P[1] + R[1]) / 2];
  const lerp = (P, R, t) => [P[0] + (R[0] - P[0]) * t, P[1] + (R[1] - P[1]) * t];
  const ln = (g, P, R, at) => g.append(sv("line", { x1: P[0], y1: P[1], x2: R[0], y2: R[1], ...at }));
  const TRI = [[1, 2, 2], [2, 3, 6], [1, 4, 8], [2, 6, 9], [4, 4, 7], [6, 6, 7], [3, 4, 12], [2, 10, 11], [4, 8, 8], [2, 5, 14]];
  const PYT = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]];
  // square base a, height h, space diagonal d: 2a² + h² = d²
  const SQB = []; for (let a = 2; a <= 12; a++) for (let h = 2; h <= 24; h++) { const d = Math.sqrt(2 * a * a + h * h); if (Number.isInteger(d) && d <= 27) SQB.push([a, h, d]); }
  // n × n × n cube cut into unit cubes: a thin grid on the three visible faces
  const gridCube = n => (g, Q) => {
    const at = { stroke: "var(--ink)", "stroke-width": 1, "stroke-opacity": .55 };
    for (let i = 1; i < n; i++) { const t = i / n;
      ln(g, lerp(Q.F0, Q.F1, t), lerp(Q.F3, Q.F2, t), at); ln(g, lerp(Q.F0, Q.F3, t), lerp(Q.F1, Q.F2, t), at);
      ln(g, lerp(Q.F3, Q.F2, t), lerp(Q.B3, Q.B2, t), at); ln(g, lerp(Q.F3, Q.B3, t), lerp(Q.F2, Q.B2, t), at);
      ln(g, lerp(Q.F1, Q.B1, t), lerp(Q.F2, Q.B2, t), at); ln(g, lerp(Q.F1, Q.F2, t), lerp(Q.B1, Q.B2, t), at); }
  };
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. surface area: whole box / open box
    { tip: "qapali", gen: () => again(() => {
      const [a, b, c] = dims(); if (new Set([a, b, c]).size < 3) return null;
      const lab = { a: a + " sm", b: b + " sm", c: c + " sm" };
      if (Math.random() < .5) {
        const S = 2 * (a * b + b * c + a * c), w = [a * b + b * c + a * c, a * b * c, 2 * c * (a + b), 4 * (a + b + c)];
        return mc(ae(S, w), { text: `Düzbucaqlı paralelepipedin ölçüləri ${a} sm, ${b} sm və ${c} sm-dir. Onun tam səthinin sahəsi neçə sm²-dir?`, svg: box(a, b, c, { lab }),
          solution: `S = 2(ab + bc + ac) = 2(${a * b} + ${b * c} + ${a * c}) = ${S} sm². Tələlər: 2-yə vurmağı unutmaq (${w[0]}), həcmi yazmaq (${w[1]}), yalnız yan səthi tapmaq (${w[2]}), tillərin cəmini yazmaq (${w[3]}).` });
      }
      const S = a * b + 2 * c * (a + b), w = [2 * a * b + 2 * c * (a + b), 2 * c * (a + b), a * b + c * (a + b), a * b * c];
      return mc(ae(S, w), { text: `Üstü açıq (qapaqsız) düzbucaqlı qutunun oturacağının ölçüləri ${a} sm və ${b} sm, hündürlüyü ${c} sm-dir. Qutunun səthinin sahəsi neçə sm²-dir?`, svg: box(a, b, c, { lab, open: true, aria: "Üstü açıq düzbucaqlı qutu" }),
        solution: `Qapaq yoxdur: bir oturacaq (${a}·${b} = ${a * b}) və 4 yan üz: ${a * b} + 2·${c}·(${a} + ${b}) = ${a * b} + ${2 * c * (a + b)} = ${S} sm². Tələlər: iki oturacağı da saymaq (${w[0]}), yalnız yan səth (${w[1]}), yan üzləri cüt-cüt saymamaq (${w[2]}), həcm (${w[3]}).` });
    }) },
    // 2. ratio + space diagonal -> volume
    { tip: "qapali", gen: () => again(() => {
      const [m, n, p] = pick(TRI), D = Math.round(Math.sqrt(m * m + n * n + p * p)), k = rnd(2, 4), d = D * k, V = m * n * p * k ** 3;
      const [x, y, z] = shuffle([m, n, p]);
      const w = [m * n * p * k * k, m * n * p * k, 2 * k * k * (m * n + n * p + m * p), m * n * p * d];
      return mc(ae(V, w), { text: `Düzbucaqlı paralelepipedin ölçüləri ${x} : ${y} : ${z} nisbətindədir, diaqonalı ${d} sm-dir. Paralelepipedin həcmi neçə sm³-dir?`,
        svg: box(x, y, z, { lab: { a: x + "t", b: y + "t", c: z + "t", d: d + " sm" }, diag: true }),
        solution: `Ölçülər ${x}t, ${y}t, ${z}t olsun. d² = (${x}² + ${y}² + ${z}²)t² = ${D * D}t² = ${d * d} → t = ${k}. Ölçülər: ${x * k}, ${y * k}, ${z * k}; V = ${x * k}·${y * k}·${z * k} = ${V} sm³. Tələlər: t³ əvəzinə t² (${w[0]}) və ya t (${w[1]}) vurmaq, səthin sahəsini yazmaq (${w[2]}), nisbətlərin hasilini diaqonala vurmaq (${w[3]}).` });
    }) },
    // 3. cube given by its diagonal -> surface
    { tip: "qapali", gen: () => again(() => {
      const k = rnd(2, 9), S = 6 * k * k, w = [18 * k * k, 6 * k, 3 * k * k, k ** 3];
      return mc(ae(S, w), { text: `Kubun diaqonalı ${k}√3 sm-dir. Kubun tam səthinin sahəsi neçə sm²-dir?`, svg: box(k, k, k, { lab: { d: k + "√3 sm" }, diag: true, aria: "Kub və onun diaqonalı" }),
        solution: `Kubda d = a√3 → a = ${k}. S = 6a² = 6·${k * k} = ${S} sm². Tələlər: diaqonalı til götürmək (6·(${k}√3)² = ${18 * k * k}), 6a (${6 * k}), d² (${3 * k * k}), həcm (${k ** 3}).` });
    }) },
    // 4. aquarium filled to a fraction: litres
    { tip: "qapali", gen: () => again(() => {
      const a = pick([40, 50, 60, 80, 100]), b = pick([20, 25, 30, 40, 50]), c = pick([30, 40, 50, 60]), [u, v] = pick([[1, 2], [3, 4], [4, 5], [2, 5], [3, 5], [1, 4]]);
      const V = a * b * c; if (V % 1000 !== 0 || (V / 1000 * u) % v !== 0) return null;
      const L = V / 1000 * u / v, w = [V / 1000, V * u / v, V / 1000 * (v - u) / v, V * u / v / 100]; if (![L, ...w].every(Number.isInteger)) return null;
      return mc(ae(L, w), { text: `Akvariumun daxili ölçüləri ${a} sm, ${b} sm və ${c} sm-dir. Akvariumun həcminin ${u}/${v} hissəsinə qədər su töküblər. Akvariumda neçə litr su var?`, svg: box(a, b, c, { lab: { a: a + " sm", b: b + " sm", c: c + " sm" } }),
        solution: `V = ${a}·${b}·${c} = ${V} sm³ = ${V / 1000} l (1 l = 1000 sm³). Suyun həcmi: ${V / 1000} · ${u}/${v} = ${L} l. Tələlər: bütün akvariumu yazmaq (${w[0]}), sm³-i litrə çevirməmək (${w[1]}), boş hissəni tapmaq (${w[2]}), 1 l = 100 sm³ saymaq (${w[3]}).` });
    }) },
    // 5. painted cube
    { tip: "qapali", gen: () => again(() => {
      const n = rnd(4, 9), t = pick([2, 1, 0]), tot = n ** 3;
      const R = [(n - 2) ** 3, 6 * (n - 2) ** 2, 12 * (n - 2)][t], q = ["heç bir üzü rənglənməyib", "yalnız bir üzü rənglənib", "yalnız iki üzü rənglənib"][t];
      const w = [[(n - 1) ** 3, tot - (n - 2) ** 3, (n - 2) ** 2, 6 * (n - 2) ** 2], [6 * n * n, 6 * (n - 1) ** 2, 12 * (n - 2), 6 * (n - 2)], [12 * n, 12 * (n - 1), 6 * (n - 2) ** 2, 12 * (n - 2) + 8]][t];
      const why = [`Boyasız kublar içəridədir: (n − 2)³ = ${n - 2}³ = ${R}. Tələlər: (n − 1)³ (${w[0]}), rənglilərin sayı (${w[1]}), (n − 2)² (${w[2]}), bir üzü rənglilər (${w[3]}).`,
        `Bir üzü rəngli kublar üzlərin ortasındadır: hər üzdə (n − 2)² = ${(n - 2) ** 2}, 6 üz → ${R}. Tələlər: 6n² (${w[0]}), 6(n − 1)² (${w[1]}), tillərdəki kublar (${w[2]}), 6(n − 2) (${w[3]}).`,
        `İki üzü rəngli kublar tillərdədir, təpələrdən başqa: hər tildə n − 2 = ${n - 2}, 12 til → ${R}. Tələlər: 12n (${w[0]}), 12(n − 1) (${w[1]}), bir üzü rənglilər (${w[2]}), təpələri də saymaq (${w[3]}).`][t];
      return mc(ae(R, w), { text: `Tili ${n} sm olan kubun bütün səthi rənglənib, sonra o, tili 1 sm olan ${tot} kubcuğa kəsilib. Neçə kubcuğun ${q}?`, svg: box(n, n, n, { lab: { a: n + " sm" }, over: gridCube(n), aria: "Kiçik kublara bölünmüş kub" }), solution: why });
    }) },
    // 6. diagonal section area -> volume
    { tip: "qapali", gen: () => again(() => {
      const [a, b, p] = pick(PYT), h = rnd(3, 15), Sd = p * h, V = a * b * h;
      const w = [Sd, a * b * p, a * b * h / 2, 2 * (a * b + (a + b) * h)]; if (![V, ...w].every(Number.isInteger)) return null;
      const under = (g, Q) => g.append(sv("polygon", { points: [Q.F0, Q.B1, Q.B2, Q.F3].map(P => P.join(",")).join(" "), fill: "var(--accent)", "fill-opacity": .3, stroke: "var(--accent)", "stroke-width": 1.5 }));
      const over = (g, Q) => { const c = mid(Q.F0, Q.B2); g.append(sv("text", { x: c[0], y: c[1] + 5, "text-anchor": "middle", class: "oy-lbl" }, Sd + " sm²")); };
      return mc(ae(V, w), { text: `Düzbucaqlı paralelepipedin oturacağının tərəfləri ${a} sm və ${b} sm-dir. Diaqonal kəsiyinin (oturacağın diaqonalından keçən şaquli kəsik) sahəsi ${Sd} sm²-dir. Paralelepipedin həcmi neçə sm³-dir?`,
        svg: box(a, b, h, { lab: { a: a + " sm", b: b + " sm" }, under, over, aria: "Düzbucaqlı paralelepiped və diaqonal kəsik" }),
        solution: `Oturacağın diaqonalı √(${a}² + ${b}²) = ${p} sm. Kəsik düzbucaqlıdır: ${p}·h = ${Sd} → h = ${h} sm. V = ${a}·${b}·${h} = ${V} sm³. Tələlər: kəsiyin sahəsini həcm saymaq (${w[0]}), hündürlük yerinə diaqonalı götürmək (${w[1]}), oturacağın yarısını (üçbucağı) götürmək (${w[2]}), səthin sahəsini yazmaq (${w[3]}).` });
    }) },
    // 7. coded: height from the total surface
    { tip: "kod", gen: () => again(() => {
      const [a, b, c] = dims(); if (a === b || a === c || b === c) return null; const S = 2 * (a * b + b * c + a * c);
      return { text: `Düzbucaqlı paralelepipedin oturacağının tərəfləri ${a} sm və ${b} sm, tam səthinin sahəsi ${S} sm²-dir. Paralelepipedin hündürlüyü neçə sm-dir?`,
        svg: box(a, b, c, { lab: { a: a + " sm", b: b + " sm", c: "h" } }), answer: c, show: String(c), tol: 1e-6, unit: "sm",
        solution: `S = 2ab + 2h(a + b) → ${S} = ${2 * a * b} + 2h·${a + b}. 2h·${a + b} = ${S - 2 * a * b}, h = ${S - 2 * a * b} : ${2 * (a + b)} = ${c} sm.` };
    }) },
    // 8. coded: volume from the three face areas
    { tip: "kod", gen: () => again(() => {
      const [a, b, c] = dims(); if (a === b || a === c || b === c) return null; const V = a * b * c;
      return { text: `Düzbucaqlı paralelepipedin ölçüləri a, b, c-dir. a·b = ${a * b} sm², b·c = ${b * c} sm², a·c = ${a * c} sm²-dir. Paralelepipedin həcmi neçə sm³-dir?`,
        svg: box(a, b, c, { lab: { a: "a", b: "b", c: "c" } }), answer: V, show: String(V), tol: 1e-6, unit: "sm³",
        solution: `Üç sahəni vurub kök alırıq: (ab)(bc)(ac) = (abc)². abc = √(${a * b}·${b * c}·${a * c}) = √${V * V} = ${V} sm³. (Ölçüləri ayrıca da tapmaq olar: ${a}, ${b}, ${c}.)` };
    }) },
    // 9. coded: a cube dropped into water in a rectangular tank
    { tip: "kod", gen: () => again(() => {
      const a = pick([10, 15, 20, 25, 30, 40]), b = pick([10, 20, 25, 30, 40, 50]), t = pick([4, 5, 6, 8, 10, 12, 15, 20]), r = t ** 3 / (a * b);
      if (r < 1 || r > 12 || Math.abs(r * 10 - Math.round(r * 10)) > 1e-9) return null;
      return { text: `Oturacağı ${a} sm × ${b} sm olan düzbucaqlı qabda su var. Qaba tili ${t} sm olan kubu tamam batırdılar; su daşmadı və kub tam suyun içindədir. Suyun səviyyəsi neçə sm qalxdı?`,
        svg: box(a, b, Math.round(2 * Math.max(a, b) / 3), { lab: { a: a + " sm", b: b + " sm" }, aria: "Düzbucaqlı qab" }), answer: r, show: fmt(r), tol: 1e-6, unit: "sm",
        solution: `Qalxan suyun həcmi kubun həcminə bərabərdir: ${t}³ = ${t ** 3} sm³. Bu, oturacağı ${a}·${b} = ${a * b} sm² olan təbəqədir: h = ${t ** 3} : ${a * b} = ${fmt(r)} sm.` };
    }) },
    // 10. written: square base + diagonal -> total surface
    { tip: "yazili", gen: () => again(() => {
      const [a, h, d] = pick(SQB), vol = Math.random() < .5, R = vol ? a * a * h : 2 * a * a + 4 * a * h;
      return { text: `Düzbucaqlı paralelepipedin oturacağı kvadratdır, tərəfi ${a} sm; paralelepipedin diaqonalı ${d} sm-dir. Paralelepipedin ${vol ? "həcmini" : "tam səthinin sahəsini"} tapın. Həlli addım-addım yazın.`,
        svg: box(a, a, h, { lab: { a: a + " sm", b: a + " sm", c: "h", d: d + " sm" }, diag: true }), answer: R, show: String(R), tol: 1e-6, unit: vol ? "sm³" : "sm²",
        solution: `1) Diaqonal düsturu: d² = a² + a² + h² → ${d * d} = ${a * a} + ${a * a} + h². 2) h² = ${d * d - 2 * a * a}, h = ${h} sm. 3) ` + (vol ? `V = a²h = ${a * a}·${h} = ${R} sm³.` : `S = 2a² + 4ah = 2·${a * a} + 4·${a}·${h} = ${2 * a * a} + ${4 * a * h} = ${R} sm².`) + ` Həll yazılmadan yalnız cavab — bal verilmir.` };
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
      key: "paralelepiped", title: "Düzbucaqlı paralelepiped və kub", fenn: "riyaziyyat", link: "dersler/paralelepiped.html",
      format: "Cavab ədəddir: tam 148, onluq 2,5, kök 3√5 və ya 4√3.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["sethi", "sethi", "hecm", "hecm", "diaqonal", "diaqonal", "vahid", "boya", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/paralelepiped.html")) b.push("dersler/paralelepiped.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
