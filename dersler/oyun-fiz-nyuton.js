// Fizika · Nyuton qanunları, bağlı cisimlər — mastery game levels (F = ma, lift, blocks on a string, table + hanging load, Atwood machine) and the final test.
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
  const arrow = (s, x1, y1, x2, y2, color, w) => {
    const L = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / L, uy = (y2 - y1) / L, bx = x2 - ux * 9, by = y2 - uy * 9;
    s.append(sv("line", { x1, y1, x2: bx, y2: by, stroke: color, "stroke-width": w || 2.8 }));
    s.append(sv("polygon", { points: `${x2},${y2} ${bx - uy * 5},${by + ux * 5} ${bx + uy * 5},${by - ux * 5}`, fill: color }));
  };
  const box = (s, x, y, w, hh, label) => { s.append(sv("rect", { x, y, width: w, height: hh, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 })); s.append(sv("text", { x: x + w / 2, y: y + hh / 2 + 5, "text-anchor": "middle", class: "oy-lbl" }, label)); };

  // blocks on a smooth floor connected by strings; pulled by F at the right end. masses = left-to-right labels.
  function blocksPic(labels, Ftxt, push) {
    const s = sv("svg", { viewBox: "0 0 300 130", class: "oy-svg", role: "img", "aria-label": push ? "Yan-yana qutular" : "İplə bağlı cisimlər" });
    const n = labels.length, bw = n === 2 ? 70 : 54, gap = push ? 0 : n === 2 ? 40 : 30, total = n * bw + (n - 1) * gap, x0 = push ? 55 : 15;
    s.append(sv("line", { x1: 5, y1: 100, x2: 295, y2: 100, stroke: "var(--ink)", "stroke-width": 1.8 }));
    for (let i = 0; i < n; i++) {
      const x = x0 + i * (bw + gap); box(s, x, 56, bw, 44, labels[i]);
      if (i < n - 1 && !push) s.append(sv("line", { x1: x + bw, y1: 78, x2: x + bw + gap, y2: 78, stroke: "var(--ink)", "stroke-width": 1.8 }));
    }
    if (Ftxt && push) { arrow(s, x0 - 40, 78, x0, 78, "var(--vec)", 3.2); s.append(sv("text", { x: x0 - 34, y: 68, class: "oy-lbl" }, Ftxt)); }
    else if (Ftxt) { const xe = x0 + total; arrow(s, xe, 78, xe + 34, 78, "var(--vec)", 3.2); s.append(sv("text", { x: xe + 6, y: 68, class: "oy-lbl" }, Ftxt)); }
    return s;
  }
  // table with a block, a rope over a pulley at the edge and a hanging load
  function tablePic(lx, ly) {
    const s = sv("svg", { viewBox: "0 0 260 190", class: "oy-svg", role: "img", "aria-label": "Masa üstündəki cisim və asılmış yük" });
    s.append(sv("rect", { x: 10, y: 60, width: 170, height: 12, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 2 }));
    s.append(sv("line", { x1: 30, y1: 72, x2: 30, y2: 180, stroke: "var(--ink)", "stroke-width": 2 }));
    box(s, 40, 28, 70, 32, lx);
    s.append(sv("line", { x1: 110, y1: 44, x2: 186, y2: 44, stroke: "var(--ink)", "stroke-width": 1.8 }));
    s.append(sv("circle", { cx: 186, cy: 54, r: 10, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 2 }));
    s.append(sv("line", { x1: 196, y1: 54, x2: 196, y2: 112, stroke: "var(--ink)", "stroke-width": 1.8 }));
    box(s, 166, 112, 62, 40, ly);
    return s;
  }
  function atwoodPic(l1, l2) {
    const s = sv("svg", { viewBox: "0 0 260 190", class: "oy-svg", role: "img", "aria-label": "Atvud maşını" });
    s.append(sv("line", { x1: 70, y1: 8, x2: 190, y2: 8, stroke: "var(--ink)", "stroke-width": 3 }));
    s.append(sv("line", { x1: 130, y1: 8, x2: 130, y2: 28, stroke: "var(--ink)", "stroke-width": 2 }));
    s.append(sv("circle", { cx: 130, cy: 46, r: 18, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 2 }));
    s.append(sv("line", { x1: 112, y1: 46, x2: 112, y2: 120, stroke: "var(--ink)", "stroke-width": 1.8 }));
    s.append(sv("line", { x1: 148, y1: 46, x2: 148, y2: 90, stroke: "var(--ink)", "stroke-width": 1.8 }));
    box(s, 86, 120, 52, 36, l1); box(s, 122, 84, 52, 36, l2);
    return s;
  }

  const LIFT = [
    { d: "yuxarı qalxmağa başlayır (sürəti artır)", s: 1 },
    { d: "yuxarı sabit sürətlə qalxır", s: 0 },
    { d: "yuxarı qalxır və dayanmaq üçün yavaşıyır", s: -1 },
    { d: "aşağı enməyə başlayır (sürəti artır)", s: -1 },
    { d: "aşağı enir və dayanmaq üçün yavaşıyır", s: 1 },
  ];
  const why = { 1: "təcil yuxarıdır", 0: "təcil sıfırdır", "-1": "təcil aşağıdır" };

  const levels = [
    { id: "ii", ad: "F = ma", izah: "Əvəzləyici qüvvə: istiqamətləri nəzərə alıb topla, sonra F_əv = m·a. Kütlə kiloqramla, qüvvə nyutonla. Eyni qüvvə: kütlə neçə dəfə böyükdürsə, təcil o qədər kiçikdir.",
      gen() {
        const kind = pick(["a", "a", "m", "F", "v", "oran", "qaldir", "qaldir"]);
        if (kind === "a") { const m = rnd(1, 10), a = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), F2 = rnd(0, 12), F1 = m * a + F2; return R(a, "m/s²", { text: `Hamar üfüqi masada ${m} kq kütləli cismə üfüqi istiqamətdə sağa ${F(F1)} N və sola ${F2} N qüvvə təsir edir. Cismin təcili nə qədərdir?`, solution: `Əvəzləyici: F_əv = ${F(F1)} − ${F2} = ${F(F1 - F2)} N (sağa). a = F_əv/m = ${F(F1 - F2)}/${m} = ${F(a)} m/s².` }); }
        if (kind === "m") { const m = rnd(1, 12), a = pick([0.5, 1, 2, 2.5, 3, 4, 5]), Fv = m * a; return R(m, "kq", { text: `Cismə ${F(Fv)} N sabit qüvvə təsir edir və o, ${F(a)} m/s² təcillə hərəkət edir. Cismin kütləsi nə qədərdir? (Başqa qüvvə yoxdur.)`, solution: `m = F/a = ${F(Fv)}/${F(a)} = ${m} kq.` }); }
        if (kind === "F") { const m = rnd(1, 15), a = pick([0.5, 1, 1.5, 2, 3, 4]); return R(m * a, "N", { text: `${m} kq kütləli cismə ${F(a)} m/s² təcil vermək üçün hansı əvəzləyici qüvvə lazımdır?`, solution: `F = ma = ${m}·${F(a)} = ${F(m * a)} N.` }); }
        if (kind === "v") { const m = pick([2, 4, 5, 8, 10]), a = pick([1, 2, 2.5, 3, 4, 5]), t = rnd(2, 8), w = pick(["v", "s"]); const Fv = m * a; if (w === "v") return R(a * t, "m/s", { text: `Sükunətdə olan ${m} kq kütləli cismə hamar səthdə ${F(Fv)} N sabit üfüqi qüvvə təsir edir. ${t} s-dən sonra sürəti nə qədərdir?`, solution: `a = F/m = ${F(Fv)}/${m} = ${F(a)} m/s². v = at = ${F(a)}·${t} = ${F(a * t)} m/s.` });
          return R(a * t * t / 2, "m", { text: `Sükunətdə olan ${m} kq kütləli cismə hamar səthdə ${F(Fv)} N sabit üfüqi qüvvə təsir edir. ${t} s-də hansı yolu gedər?`, solution: `a = F/m = ${F(Fv)}/${m} = ${F(a)} m/s². s = at²/2 = ${F(a)}·${t * t}/2 = ${F(a * t * t / 2)} m.` }); }
        if (kind === "oran") { const m1 = pick([2, 3, 4, 5, 6]), m2 = pick([1, 2, 3, 4, 5, 6, 8, 10, 12]), a1 = pick([2, 3, 4, 5, 6, 8, 10]), a2 = a1 * m1 / m2; if (m1 === m2 || !nice(a2, 2)) return this.gen(); return R(a2, "m/s²", { text: `Eyni qüvvə ${m1} kq kütləli cismə ${a1} m/s² təcil verir. Həmin qüvvə ${m2} kq kütləli cismə nə qədər təcil verər?`, solution: `F = ${m1}·${a1} = ${m1 * a1} N. a = F/m = ${m1 * a1}/${m2} = ${F(a2)} m/s². (Kütlə neçə dəfə böyükdürsə, təcil o qədər kiçikdir.)` }); }
        const m = pick([1, 2, 3, 4, 5, 8]), a = pick([0.5, 1, 2, 2.5, 3, 4, 5]), T = m * (g + a);
        return R(T, "N", { text: `${m} kq yükü ipdən yuxarı ${F(a)} m/s² təcillə qaldırırlar. İpin gərilmə qüvvəsi nə qədərdir?`, solution: `Yükə yuxarı T, aşağı mg təsir edir, təcil yuxarıdır: T − mg = ma → T = m(g + a) = ${m}·${F(g + a)} = ${F(T)} N. (Sakit duranda T = mg = ${m * g} N olardı.)` });
      } },
    { id: "lift", ad: "Lift, çəki", izah: "Tərəziyə (dayağa) basan qüvvə — çəki — dayağın reaksiya qüvvəsi N-ə bərabərdir. N − mg = ma (ox yuxarı). Təcil yuxarıdırsa N > mg, aşağıdırsa N < mg.",
      gen() {
        const kind = pick(["N", "N", "N", "a", "m", "sert"]);
        const L = pick(LIFT), m = pick([40, 45, 50, 55, 60, 70, 80]), a = L.s === 0 ? pick([1, 2, 3]) : pick([1, 2, 2.5, 4, 5]);
        if (kind === "N") { const N = m * (g + L.s * a); return R(N, "N", { text: `${m} kq kütləli adam liftdə tərəzinin üstündə durur. Lift ${L.d}${L.s === 0 ? "" : `, təcilinin modulu ${F(a)} m/s²`}. Tərəzi adamın çəkisini neçə nyuton göstərir?`, solution: `${L.s === 0 ? "Sabit sürət" : "Təcil"}: ${why[L.s]}. N − mg = ma_x, ox yuxarı: N = m(g + a_x) = ${m}·(${g} ${L.s >= 0 ? "+" : "−"} ${L.s === 0 ? 0 : F(a)}) = ${F(N)} N. (Hərəkətsiz: ${m * g} N.)` }); }
        if (kind === "a") { const a2 = pick([1, 2, 2.5, 4, 5]), up = Math.random() < .5, N = m * (g + (up ? a2 : -a2)); return R(a2, "m/s²", { text: `${m} kq kütləli adam liftdə tərəzinin üstündədir. Tərəzi ${F(N)} N göstərir (hərəkətsiz liftdə ${m * g} N göstərərdi). Liftin təcilinin modulu nə qədərdir?`, solution: `${F(N)} ${up ? ">" : "<"} ${m * g} → təcil ${up ? "yuxarıdır" : "aşağıdır"}. |N − mg| = ma → a = ${F(Math.abs(N - m * g))}/${m} = ${F(a2)} m/s².` }); }
        if (kind === "m") { const N = m * (g + L.s * a); if (L.s === 0) return this.gen(); return R(m, "kq", { text: `Lift ${L.d}, təcilinin modulu ${F(a)} m/s². Adam tərəziyə ${F(N)} N qüvvə ilə basır. Adamın kütləsi nə qədərdir?`, solution: `N = m(g ${L.s > 0 ? "+" : "−"} a) → m = N/(g ${L.s > 0 ? "+" : "−"} a) = ${F(N)}/${F(g + L.s * a)} = ${m} kq.` }); }
        const k = pick([50, 100, 200, 400, 500, 1000]), mm = pick([0.5, 1, 2, 3, 4, 5]), a3 = pick([2, 2.5, 4, 5]), x = mm * (g + a3) / k;
        if (!nice(x, 4)) return this.gen();
        return R(x, "m", { text: `Yuxarı ${F(a3)} m/s² təcillə qalxan liftin tavanından sərtliyi ${k} N/m olan yayla ${F(mm)} kq yük asılıb. Yay neçə metr uzanıb?`, solution: `Yükə yuxarı kx, aşağı mg, təcil yuxarı: kx − mg = ma → x = m(g + a)/k = ${F(mm)}·${F(g + a3)}/${k} = ${F(x)} m.` });
      } },
    { id: "ip", ad: "İplə bağlı cisimlər", izah: "İp uzanmırsa, hamısı eyni a ilə gedir: a = F/(m₁ + m₂ + …). İpin gərilməsini tapmaq üçün onun dartdığı cisimləri fikrən ayır: T = (arxadakı kütlələrin cəmi)·a.",
      gen() {
        const kind = pick(["a", "T", "T", "T3", "T3", "itele", "itele"]);
        if (kind === "a" || kind === "T") {
          const m1 = rnd(1, 6), m2 = rnd(1, 6), a = pick([1, 2, 2.5, 3, 4, 5]), Fv = (m1 + m2) * a;
          const pic = blocksPic(["m₁ = " + m1, "m₂ = " + m2], "F");
          const base = `Hamar üfüqi masada m₁ = ${m1} kq və m₂ = ${m2} kq kütləli iki cisim iplə bağlıdır. m₂ cismini ${F(Fv)} N üfüqi qüvvə ilə (ipin istiqamətində) dartırlar.`;
          if (kind === "a") return R(a, "m/s²", { svg: pic, text: base + " Cisimlərin təcili nə qədərdir?", solution: `Cisimlər eyni təcillə gedir, ona görə birlikdə bir cisim kimi baxırıq: a = F/(m₁ + m₂) = ${F(Fv)}/${m1 + m2} = ${F(a)} m/s².` });
          return R(m1 * a, "N", { svg: pic, text: base + " İpin gərilmə qüvvəsi nə qədərdir?", solution: `a = F/(m₁ + m₂) = ${F(Fv)}/${m1 + m2} = ${F(a)} m/s². İp yalnız m₁ cismini dartır: T = m₁a = ${m1}·${F(a)} = ${F(m1 * a)} N.` });
        }
        if (kind === "T3") {
          const m1 = rnd(1, 4), m2 = rnd(1, 4), m3 = rnd(1, 4), a = pick([1, 2, 3, 4, 5]), Fv = (m1 + m2 + m3) * a, w = pick(["12", "23"]);
          const pic = blocksPic(["m₁ = " + m1, "m₂ = " + m2, "m₃ = " + m3], "F");
          const base = `Hamar masada m₁ = ${m1} kq, m₂ = ${m2} kq, m₃ = ${m3} kq kütləli üç cisim ardıcıl iplə bağlıdır. m₃ cismini ${Fv} N üfüqi qüvvə ilə dartırlar (şəkildə sağdadır).`;
          return w === "12" ? R((m1) * a, "N", { svg: pic, text: base + " m₁ ilə m₂ arasındakı ipin gərilməsi nə qədərdir?", solution: `a = F/(m₁ + m₂ + m₃) = ${Fv}/${m1 + m2 + m3} = ${a} m/s². Soldakı ip yalnız m₁-i dartır: T₁₂ = m₁a = ${m1}·${a} = ${m1 * a} N.` })
            : R((m1 + m2) * a, "N", { svg: pic, text: base + " m₂ ilə m₃ arasındakı ipin gərilməsi nə qədərdir?", solution: `a = ${Fv}/${m1 + m2 + m3} = ${a} m/s². Sağdakı ip m₁ və m₂-ni birlikdə dartır: T₂₃ = (m₁ + m₂)a = ${m1 + m2}·${a} = ${(m1 + m2) * a} N.` });
        }
        const m1 = rnd(1, 6), m2 = rnd(1, 6), a = pick([1, 2, 2.5, 3, 4]), Fv = (m1 + m2) * a, w = pick(["N", "a"]);
        const pic = blocksPic(["m₁ = " + m1, "m₂ = " + m2], "F", true);
        return w === "N" ? R(m2 * a, "N", { svg: pic, text: `Hamar masada yan-yana duran m₁ = ${m1} kq və m₂ = ${m2} kq kütləli iki qutunun soldakını (m₁) ${F(Fv)} N qüvvə ilə itələyirlər; o, m₂-ni itələyir. Qutular arasındakı qarşılıqlı təsir qüvvəsi nə qədərdir?`, solution: `a = F/(m₁ + m₂) = ${F(Fv)}/${m1 + m2} = ${F(a)} m/s². m₂ qutusunu yalnız m₁-in itələməsi tərpədir: N = m₂a = ${m2}·${F(a)} = ${F(m2 * a)} N.` })
          : R(a, "m/s²", { svg: pic, text: `Hamar masada yan-yana duran m₁ = ${m1} kq və m₂ = ${m2} kq kütləli iki qutunu ${F(Fv)} N qüvvə ilə itələyirlər. Hər ikisinin təcili nə qədərdir?`, solution: `Qutular birlikdə hərəkət edir: a = F/(m₁ + m₂) = ${F(Fv)}/${m1 + m2} = ${F(a)} m/s².` });
      } },
    { id: "masa", ad: "Masa üstündə cisim + asılan yük", izah: "Hərəkətə gətirən yalnız asılan yükün ağırlığıdır (m_y·g), sürətlənən kütlə m_x + m_y. a = m_y·g/(m_x + m_y); T = m_x·a. Sürtünmə yoxdur.",
      gen() {
        const kind = pick(["a", "T", "T", "my", "t"]);
        const mx = rnd(1, 8), my = rnd(1, 6), a = my * g / (mx + my);
        if (kind === "my") { for (let i = 0; i < 100; i++) { const mx2 = rnd(1, 8), my2 = rnd(1, 6), a2 = my2 * g / (mx2 + my2); if (!nice(a2, 2)) continue; return R(my2, "kq", { svg: tablePic("m = " + mx2, "m_y"), text: `Hamar masada ${mx2} kq kütləli cisim iplə, masanın kənarındakı blokdan aşan ipin o biri ucundan asılmış yüklə bağlıdır. Sistem ${F(a2)} m/s² təcillə hərəkət edir. Asılan yükün kütləsi nə qədərdir?`, solution: `a = m_y·g/(m_x + m_y) → a·m_x = m_y(g − a) → m_y = a·m_x/(g − a) = ${F(a2)}·${mx2}/${F(g - a2)} = ${my2} kq.` }); } return this.gen(); }
        if (!nice(a, 2)) return this.gen();
        const pic = tablePic("m_x = " + mx, "m_y = " + my);
        const base = `Hamar masada m_x = ${mx} kq kütləli cisim iplə bağlıdır, ip masanın kənarındakı blokdan aşıb ucunda m_y = ${my} kq kütləli yük asılıb.`;
        if (kind === "a") return R(a, "m/s²", { svg: pic, text: base + " Sistemin təcili nə qədərdir?", solution: `Hərəkətə gətirən qüvvə m_y·g = ${my * g} N, sürətlənən kütlə m_x + m_y = ${mx + my} kq. a = ${my * g}/${mx + my} = ${F(a)} m/s².` });
        if (kind === "T") return R(mx * a, "N", { svg: pic, text: base + " İpin gərilmə qüvvəsi nə qədərdir?", solution: `a = m_y·g/(m_x + m_y) = ${my * g}/${mx + my} = ${F(a)} m/s². Masadakı cismi yalnız ip dartır: T = m_x·a = ${mx}·${F(a)} = ${F(mx * a)} N. (Yoxla: yük üçün m_y g − T = ${my * g} − ${F(mx * a)} = ${F(my * g - mx * a)} = m_y a ✓.)` });
        const hh = pick([0.5, 1, 1.5, 2, 2.5]), t2 = 2 * hh / a, tt = Math.sqrt(t2); if (!nice(tt, 2)) return this.gen();
        return R(tt, "s", { svg: pic, text: base + ` Sistemi sükunətdən buraxırlar. Yük ${F(hh)} m enəndə nə qədər vaxt keçər?`, solution: `a = ${my * g}/${mx + my} = ${F(a)} m/s². h = at²/2 → t = √(2h/a) = √(${F(2 * hh)}/${F(a)}) = √${F(t2)} = ${F(tt)} s.` });
      } },
    { id: "atvud", ad: "Atvud maşını", izah: "İki yük blokdan aşan iplə: ağır yük düşür, yüngül qalxır, a eynidir, T eynidir. a = (m₂ − m₁)g/(m₁ + m₂); T = 2m₁m₂g/(m₁ + m₂). Blokun asqısına 2T qüvvə təsir edir.",
      gen() {
        const kind = pick(["a", "a", "T", "T", "blok", "m2", "t"]);
        for (let i = 0; i < 200; i++) {
          const m1 = rnd(1, 8), m2 = rnd(m1 + 1, 10), a = (m2 - m1) * g / (m1 + m2), T = 2 * m1 * m2 * g / (m1 + m2);
          if (!nice(a, 2) || !nice(T, 2)) continue;
          const pic = atwoodPic("m₁ = " + m1, "m₂ = " + m2), base = `Yüngül, çəkisiz blokdan aşan çəkisiz iplə m₁ = ${m1} kq və m₂ = ${m2} kq kütləli iki yük asılıb (Atvud maşını). Sistemi sərbəst buraxırlar.`;
          if (kind === "a") return R(a, "m/s²", { svg: pic, text: base + " Yüklərin təcili nə qədərdir?", solution: `m₁ qalxır: T − m₁g = m₁a. m₂ düşür: m₂g − T = m₂a. Toplayaq: (m₂ − m₁)g = (m₁ + m₂)a → a = ${m2 - m1}·10/${m1 + m2} = ${F(a)} m/s².` });
          if (kind === "T") return R(T, "N", { svg: pic, text: base + " İpin gərilmə qüvvəsi nə qədərdir?", solution: `a = (m₂ − m₁)g/(m₁ + m₂) = ${F(a)} m/s². m₁ üçün: T − m₁g = m₁a → T = m₁(g + a) = ${m1}·${F(g + a)} = ${F(T)} N. (Yoxla m₂: m₂(g − a) = ${m2}·${F(g - a)} = ${F(m2 * (g - a))} ✓.) T = 2m₁m₂g/(m₁ + m₂).` });
          if (kind === "blok") return R(2 * T, "N", { svg: pic, text: base + " Blokun asıldığı çubuğa (tavana) təsir edən qüvvə nə qədərdir? Blokun kütləsi yoxdur.", solution: `a = ${F(a)} m/s², T = m₁(g + a) = ${F(T)} N. Blokdan aşan ipin hər iki tərəfi blokdan aşağı T qüvvəsi ilə dartır, blokun kütləsi yoxdur → tavan 2T = ${F(2 * T)} N qüvvə ilə saxlayır. (Hərəkətsiz olsaydı (m₁ + m₂)g = ${(m1 + m2) * g} N olardı — fərqlidir, çünki yüklər sürətlənir.)` });
          if (kind === "m2") { return R(m2, "kq", { svg: atwoodPic("m₁ = " + m1, "m₂"), text: `Atvud maşınında m₁ = ${m1} kq yük var, ikinci yük daha ağırdır. Sistem ${F(a)} m/s² təcillə hərəkət edir. İkinci yükün kütləsi nə qədərdir?`, solution: `a = (m₂ − m₁)g/(m₁ + m₂) → a(m₁ + m₂) = (m₂ − m₁)g → m₂(g − a) = m₁(g + a) → m₂ = ${m1}·${F(g + a)}/${F(g - a)} = ${m2} kq.` }); }
          const hh = pick([1, 2, 2.5, 4, 5]), tt2 = 2 * hh / a, tt = Math.sqrt(tt2); if (!nice(tt, 2)) continue;
          return R(tt, "s", { svg: pic, text: base + ` Başlanğıcda yüklər eyni səviyyədədir. Hansı vaxtdan sonra yüklər arasında şaquli məsafə ${F(2 * hh)} m olar?`, solution: `a = ${F(a)} m/s². Hər yük ${F(hh)} m yol getməlidir (biri yuxarı, biri aşağı). h = at²/2 → t = √(2h/a) = √(${F(2 * hh)}/${F(a)}) = ${F(tt)} s.` });
        }
        return this.gen();
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why2;
        if (Math.random() < .5) {
          const m1 = rnd(1, 5), m2 = rnd(1, 5), a = pick([2, 3, 4, 5]), Fv = (m1 + m2) * a, T = m1 * a;
          task = `Hamar masada m₁ = ${m1} kq və m₂ = ${m2} kq kütləli cisimlər iplə bağlıdır. m₂-ni ${Fv} N üfüqi qüvvə ilə dartırlar (m₂ ipin sağındadır). İpin gərilməsi nə qədərdir?`;
          const aU = bad === 0 ? Fv / m2 : a, TU = bad === 1 ? (m1 + m2) * a : bad === 2 ? Fv : m1 * aU;
          steps = [
            bad === 0 ? `Təcil: a = F/m₂ = ${Fv}/${m2} = ${F(aU)} m/s².` : `Təcil: a = F/(m₁ + m₂) = ${Fv}/${m1 + m2} = ${a} m/s².`,
            bad === 1 ? `İpin gərilməsini bütün sistemin təcilindən tapırıq: T = (m₁ + m₂)·a = ${m1 + m2}·${a} = ${(m1 + m2) * a} N.` : bad === 2 ? `İp qüvvəni cisimdən cisimə ötürür.` : `İp yalnız m₁-i dartır: T = m₁·a = ${m1}·${F(aU)}.`,
            bad === 2 ? `Deməli, T = F = ${Fv} N.` : `T = ${F(TU)} N.`,
          ];
          why2 = [`1-ci addım: ipin bağladığı bütün sistemi (m₁ + m₂) təcilləndirmək lazımdır: a = F/(m₁ + m₂) = ${a} m/s². Düz T = ${T} N.`,
            `2-ci addım: ip yalnız m₁ kütləsini dartır, ona görə T = m₁a, (m₁ + m₂)a deyil. Düz T = ${T} N.`,
            `3-cü addım: T = F olmaz: F ikisini birlikdə sürətləndirir, ip isə yalnız m₁-i. Düz T = ${T} N.`][bad];
        } else {
          let m1, m2, a, T; for (;;) { m1 = rnd(1, 6); m2 = rnd(m1 + 1, 8); a = (m2 - m1) * g / (m1 + m2); T = 2 * m1 * m2 * g / (m1 + m2); if (nice(a, 2) && nice(T, 2)) break; }
          task = `Atvud maşınında m₁ = ${m1} kq və m₂ = ${m2} kq kütləli yüklər var. İpin gərilməsi nə qədərdir?`;
          const aU = bad === 0 ? (m2 - m1) * g / m2 : a, TU = bad === 1 ? m1 * (g - a) : bad === 2 ? m2 * g : m1 * (g + aU);
          steps = [
            bad === 0 ? `Təcil: a = (m₂ − m₁)g/m₂ = ${m2 - m1}·10/${m2} = ${F(aU)} m/s².` : `Təcil: a = (m₂ − m₁)g/(m₁ + m₂) = ${m2 - m1}·10/${m1 + m2} = ${F(a)} m/s².`,
            bad === 1 ? `Yüngül yük qalxır: T − m₁g = m₁a → T = m₁(g − a) = ${m1}·${F(g - a)}.` : bad === 2 ? `Ağır yük düşür, ona görə T-ni onun ağırlığına bərabər götürürük.` : `Yüngül yük qalxır: T − m₁g = m₁a → T = m₁(g + a) = ${m1}·${F(g + aU)}.`,
            bad === 2 ? `T = m₂g = ${m2}·10 = ${m2 * g} N.` : `T = ${F(TU)} N.`,
          ];
          why2 = [`1-ci addım: təcil bütün sistemin kütləsinə bölünür: m₁ + m₂ = ${m1 + m2} kq, ${m2} kq deyil. Düz T = ${F(T)} N.`,
            `2-ci addım: qalxan yükdə təcil yuxarıdır, T > m₁g: T = m₁(g + a). Düz T = ${F(T)} N.`,
            `3-cü addım: yük sürətlə düşürsə, T < m₂g. T = m₂g yalnız tarazlıqda doğrudur. Düz T = ${F(T)} N.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why2 };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Vaqonlar, treyler, lift, dinamometr — şəkil çək, hər cisim üçün ayrıca F_əv = ma yaz.",
      gen() {
        const kind = pick(["vaqon", "vaqon", "treyler", "lift", "dinam", "aks", "lift2"]);
        if (kind === "vaqon") { const m = pick([20, 30, 40, 50]), n = rnd(3, 5), a = pick([0.2, 0.25, 0.4, 0.5]), k = rnd(1, n - 1), Fk = (n - k) * m * 1000 * a; if (!nice(Fk, 1)) return this.gen(); const Fl = n * m * 1000 * a;
          return R(Fk, "N", { text: `Lokomotiv ${n} eyni vaqonu (hər biri ${m} t) sürətləndirir, vaqonların təcili ${F(a)} m/s²-dir. Sürtünməni nəzərə almasaq, lokomotivdən sayanda ${k}-ci və ${k + 1}-ci vaqonlar arasındakı qoşqu hansı qüvvə ilə dartılır?`, solution: `${k}-ci vaqondan sonra ${n - k} vaqon qalır, qoşqu onları sürətləndirir: T = (${n - k})·${m * 1000} kq·${F(a)} = ${F(Fk)} N. (Lokomotivin birinci qoşqusu bütün ${n} vaqonu dartır: ${F(Fl)} N.)` }); }
        if (kind === "treyler") { const M = pick([1000, 1200, 1500, 2000]), mt = pick([200, 300, 400, 500, 600]), a = pick([0.5, 1, 1.5, 2]), Tt = mt * a; return R(Tt, "N", { text: `${M} kq kütləli avtomobil ${mt} kq kütləli treyleri ${F(a)} m/s² təcillə dartır (sürtünmə yoxdur). Avtomobil ilə treyler arasındakı qoşquda gərilmə nə qədərdir?`, solution: `Qoşqu yalnız treyleri sürətləndirir: T = m_treyler·a = ${mt}·${F(a)} = ${F(Tt)} N. (Avtomobilin mühərriki isə (${M} + ${mt})·${F(a)} = ${F((M + mt) * a)} N yaradır.)` }); }
        if (kind === "lift") { const M = pick([500, 800, 1000]), a = pick([1, 2, 2.5]), T = M * (g + a); return R(T, "N", { text: `Kütləsi ${M} kq olan lift kabinəsi trosla ${F(a)} m/s² təcillə yuxarı qaldırılır. Trosun gərilməsi nə qədərdir?`, solution: `T − Mg = Ma → T = M(g + a) = ${M}·${F(g + a)} = ${F(T)} N. (Hərəkətsiz olanda ${M * g} N.)` }); }
        if (kind === "lift2") { const mk = pick([800, 1000, 1200]), mc = mk - pick([200, 400]), a = (mk - mc) * g / (mk + mc), T = 2 * mk * mc * g / (mk + mc); if (!nice(a, 3) || !nice(T, 1)) return this.gen(); return R(a, "m/s²", { text: `Liftin kabinəsinin kütləsi ${mk} kq, əks yükün kütləsi ${mc} kq-dır; onlar blokdan aşan trosla bağlıdır (Atvud maşını kimi). Kabinə aşağı enir. Kabinənin təcili nə qədərdir?`, solution: `a = (m₂ − m₁)g/(m₁ + m₂) = ${mk - mc}·10/${mk + mc} = ${F(a)} m/s². Əks yük kabinəni "tarazlayır", ona görə mühərrik yalnız fərqi qaldırır.` }); }
        if (kind === "dinam") { const f = pick([20, 30, 40, 50, 60, 80, 100]); return R(f, "N", { text: `Dinamometrin hər iki ucundan əks tərəflərə ${f} N qüvvə ilə dartırlar (dinamometr hərəkətsizdir). Dinamometr neçə nyuton göstərir?`, solution: `Nyutonun III qanunu: dinamometr bir ucundan ${f} N ilə dartılır, o biri ucu da ${f} N ilə. Yay ${f} N-ə uyğun uzanır, göstəriş ${f} N-dir, ikisinin cəmi (${2 * f} N) yox.` }); }
        const m = pick([2, 3, 5, 10]), a = pick([2, 3, 4, 5]), Fv = m * a; return R(a, "m/s²", { text: `Koldan arabaya ${F(Fv)} N qüvvə ilə təsir göstərirlər, arabanın kütləsi ${m} kq-dır, sürtünmə yoxdur. Arabanın təcili nə qədərdir? (Nyutonun III qanunu: araba da kola eyni qüvvə ilə təsir edir, amma bu qüvvə başqa cisimə tətbiq olunub.)`, solution: `Arabaya təsir edən qüvvə ${F(Fv)} N-dir: a = F/m = ${F(Fv)}/${m} = ${a} m/s². Reaksiya qüvvəsi kola tətbiq olunur və arabanın təcilinə təsir etmir.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-nyuton", title: "Nyuton qanunları, bağlı cisimlər", fenn: "fizika", link: "dersler/fiz-nyuton.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: N, kq, m/s²). Onluq kəsr vergül və ya nöqtə ilə: 2,5. g = 10 m/s².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ii", "lift", "ip", "ip", "masa", "masa", "atvud", "atvud", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-nyuton.html")) b.push("dersler/fiz-nyuton.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
