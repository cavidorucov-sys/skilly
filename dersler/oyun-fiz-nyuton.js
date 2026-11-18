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

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a picture or graph, several steps;
  // the wrong options are the answers of typical mistakes. Questions 1, 2, 5 and 7 also use "Kinematika" (v–t, F–t graph, v² = 2as),
  // questions 3 and 4 use "Sərbəst düşmə" (free flight after the rope slackens or breaks).
  const { ae, again } = Oyun;
  const ok2 = (x, d = 2) => isFinite(x) && x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + " " + u;
  const Fx = x => F(+x.toFixed(4));
  // <svg-helpers> (string builders; the lesson tab uses the same pictures)
  const C = { ink: "var(--ink,#17171a)", acc: "var(--accent,#2457d6)", vec: "var(--vec,#c2410c)", mut: "var(--muted,#6b6b76)", soft: "var(--accent-soft,#e8eefc)", paper: "var(--paper,#fff)" };
  const q1 = v => +(+v).toFixed(1);
  const sLn = (x1, y1, x2, y2, c = C.ink, w = 1.8, d) => `<line x1="${q1(x1)}" y1="${q1(y1)}" x2="${q1(x2)}" y2="${q1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${d ? ` stroke-dasharray="${d}"` : ""}/>`;
  const sTx = (x, y, t, a = "start", c = C.ink, fs = 13) => `<text x="${q1(x)}" y="${q1(y)}" text-anchor="${a}" font-size="${fs}" font-weight="700" fill="${c}" font-family="inherit">${t}</text>`;
  const sAr = (x1, y1, x2, y2, c = C.ink, w = 2.6) => { const a = Math.atan2(y2 - y1, x2 - x1), L = 10, Wd = 5, bx = x2 - L * Math.cos(a), by = y2 - L * Math.sin(a);
    return sLn(x1, y1, bx, by, c, w) + `<polygon points="${q1(x2)},${q1(y2)} ${q1(bx - Wd * Math.sin(a))},${q1(by + Wd * Math.cos(a))} ${q1(bx + Wd * Math.sin(a))},${q1(by - Wd * Math.cos(a))}" fill="${c}"/>`; };
  const sDim = (x, y1, y2, label) => sLn(x, y1 + 6, x, y2 - 6, C.mut, 1.4) + sAr(x, y1 + 12, x, y1, C.mut, 1.4) + sAr(x, y2 - 12, x, y2, C.mut, 1.4) + sTx(x + 8, (y1 + y2) / 2 + 4, label, "start", C.ink, 12);
  const sDimH = (x1, x2, y, label) => sLn(x1 + 6, y, x2 - 6, y, C.mut, 1.4) + sAr(x1 + 12, y, x1, y, C.mut, 1.4) + sAr(x2 - 12, y, x2, y, C.mut, 1.4) + sTx((x1 + x2) / 2, y + 15, label, "middle", C.ink, 12);
  const sRect = (x, y, w, h, f = C.soft) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}" stroke="${C.ink}" stroke-width="1.5"/>`;
  const sSvg = (w, h, inner, aria, cls = "oy-svg") => `<svg viewBox="0 0 ${w} ${h}"${cls ? ` class="${cls}"` : ""} role="img" aria-label="${aria}">${inner}</svg>`;
  const svEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  // graph through the points pts = [[t, y], …] (non-negative); guides = [[t, y], …] get dashed lines and tick labels; yx = extra y ticks; lab = [[t, y, dx, dy, text], …]
  function figPlot(pts, guides, yx, xl, yl, lab, aria, cls) {
    const x0 = 46, y0 = 160, xm = Math.max(...pts.map(p => p[0])), ym = Math.max(...pts.map(p => p[1])), X = t => x0 + t / xm * 200, Y = v => y0 - v / ym * 118;
    let s = "";
    guides.forEach(([t, v]) => { if (v > 0) s += sLn(X(t), Y(v), X(t), y0, C.mut, 1, "4 3") + sLn(x0, Y(v), X(t), Y(v), C.mut, 1, "4 3"); });
    s += sLn(x0, y0, 250, y0, C.ink, 1.6) + sLn(x0, y0, x0, 24, C.ink, 1.6) + sTx(252, y0 + 4, xl, "start", C.mut, 11) + sTx(x0 + 6, 18, yl, "start", C.mut, 11);
    [...new Set(guides.map(p => p[0]))].filter(t => t > 0).forEach(t => { s += sLn(X(t), y0, X(t), y0 + 4, C.ink, 1.4) + sTx(X(t), y0 + 17, F(t), "middle", C.ink, 11); });
    [...new Set([...guides.map(p => p[1]), ...yx])].filter(v => v > 0).forEach(v => { s += sLn(x0 - 4, Y(v), x0, Y(v), C.ink, 1.4) + sTx(x0 - 7, Y(v) + 4, F(v), "end", C.ink, 11); });
    s += `<polyline points="${pts.map(p => q1(X(p[0])) + "," + q1(Y(p[1]))).join(" ")}" fill="none" stroke="${C.acc}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>`;
    lab.forEach(([t, v, dx, dy, text]) => { s += sTx(X(t) + dx, Y(v) + dy, text, "middle", C.vec, 13); });
    return sSvg(280, 190, s, aria, cls);
  }
  const figVT = (v0, v1, t1, T, cls) => figPlot([[0, v0], [t1, v1], [T, v1]], [[t1, v1], [T, v1]], [v0], "t, s", "v, m/s", [], "Sürətin vaxtdan asılılıq qrafiki: " + F(v0) + " m/s-dən " + F(v1) + " m/s-ə qədər düzxətli artır, sonra sabit qalır", cls);
  const figFT = (Fv, t1, t2, cls) => figPlot([[0, Fv], [t1, Fv], [t1, 0], [t1 + t2, 0]], [[t1, Fv], [t1 + t2, 0]], [], "t, s", "F, N", [], "Qüvvənin vaxtdan asılılıq qrafiki: " + F(Fv) + " N qüvvə " + F(t1) + " s təsir edir, sonra sıfırdır", cls);
  const figLift = (v, t1, t2, t3, cls) => figPlot([[0, 0], [t1, v], [t1 + t2, v], [t1 + t2 + t3, 0]], [[t1, v], [t1 + t2, v], [t1 + t2 + t3, 0]], [], "t, s", "v, m/s",
    [[t1 / 2, v / 2, -12, -4, "1"], [t1 + t2 / 2, v, 0, -9, "2"], [t1 + t2 + t3 / 2, v / 2, 12, -4, "3"]], "Liftin sürətinin qrafiki: üç mərhələ — sürətlənmə, sabit sürət, yavaşıma", cls);
  // Atwood machine: m1 on the floor, m2 held h above it
  const figAtH = (l1, l2, hh, cls) => sSvg(270, 190, sLn(70, 8, 190, 8, C.ink, 3) + sLn(130, 8, 130, 24) + `<circle cx="130" cy="40" r="16" fill="${C.paper}" stroke="${C.ink}" stroke-width="2"/>`
    + sLn(114, 40, 114, 130) + sLn(146, 40, 146, 82) + sRect(89, 130, 50, 30) + sTx(114, 149, l1, "middle", C.ink, 12) + sRect(121, 82, 50, 30) + sTx(146, 101, l2, "middle", C.ink, 12)
    + sLn(60, 160, 240, 160, C.ink, 1.8) + sDim(188, 112, 160, "h = " + F(hh) + " m"), "Atvud maşını: m₁ yerdədir, m₂ yerdən h hündürlükdə tutulub", cls);
  // Atwood machine hung on a dynamometer
  const figAtD = (l1, l2, cls) => sSvg(260, 190, sLn(70, 8, 190, 8, C.ink, 3) + sLn(130, 8, 130, 16) + sRect(115, 16, 30, 18, C.paper) + sTx(130, 29, "D", "middle", C.ink, 12) + sTx(152, 30, "dinamometr", "start", C.mut, 11) + sLn(130, 34, 130, 46)
    + `<circle cx="130" cy="64" r="18" fill="${C.paper}" stroke="${C.ink}" stroke-width="2"/>` + sLn(112, 64, 112, 140) + sLn(148, 64, 148, 100) + sRect(87, 140, 50, 32) + sTx(112, 161, l1, "middle", C.ink, 12) + sRect(123, 100, 50, 32) + sTx(148, 121, l2, "middle", C.ink, 12),
    "Blokdan aşan iplə iki yük; blok dinamometrə asılıb", cls);
  // two blocks joined by a dynamometer, pulled apart by F1 (left) and F2 (right)
  const figDyn = (l1, l2, f1, f2, cls) => sSvg(300, 130, sLn(5, 100, 295, 100, C.ink, 1.8) + sRect(56, 56, 54, 44) + sTx(83, 83, l1, "middle", C.ink, 12) + sRect(190, 56, 54, 44) + sTx(217, 83, l2, "middle", C.ink, 12)
    + `<polyline points="110,78 120,78 128,66 140,90 152,66 164,90 172,78 190,78" fill="none" stroke="${C.ink}" stroke-width="1.8" stroke-linejoin="round"/>` + sTx(150, 118, "dinamometr", "middle", C.mut, 11)
    + sAr(56, 78, 16, 78, C.vec, 3) + sTx(38, 48, "F₁ = " + F(f1) + " N", "middle", C.vec, 11) + sAr(244, 78, 284, 78, C.vec, 3) + sTx(260, 48, "F₂ = " + F(f2) + " N", "middle", C.vec, 11),
    "Dinamometrlə birləşən iki cisim əks tərəflərə dartılır", cls);
  // load on a rope, rising from the ground
  const figRise = (lm, Tn, cls) => sSvg(260, 190, sLn(130, 44, 130, 130) + sAr(130, 44, 130, 12, C.acc, 2.8) + sRect(105, 130, 50, 34) + sTx(130, 152, lm, "middle", C.ink, 12) + sLn(50, 164, 210, 164, C.ink, 1.8)
    + sTx(140, 30, "T = " + F(Tn) + " N", "start", C.vec, 12), "Yük yerdən iplə yuxarı qaldırılır; ip yuxarı T qüvvəsi ilə dartılır", cls);
  // uniform rope on a smooth table pulled at the right end; section A at distance d from the left end
  const figRope = (L, d, Fv, cls) => { const xa = 30 + 200 * d / L;
    return sSvg(300, 156, sRect(30, 70, 200, 14) + sAr(230, 77, 272, 77, C.vec, 3) + sTx(251, 58, "F = " + F(Fv) + " N", "middle", C.vec, 12) + sLn(xa, 60, xa, 96, C.acc, 2, "4 3") + sTx(xa, 52, "A", "middle", C.acc, 13)
      + sDimH(30, xa, 108, "d = " + F(d) + " m") + sDimH(30, 230, 134, "L = " + F(L) + " m"), "Bircins ip üfüqi səthdə sağ ucundan dartılır; A kəsiyi sol ucdan d məsafədədir", cls); };
  // </svg-helpers>
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. v–t graph → resultant force in the first stage
    { tip: "qapali", birlesik: "fiz-kinematika", minVariety: 8, gen: () => again(() => {
      const m = pick([2, 3, 4, 5, 6, 8]), v0 = pick([2, 4, 6, 8]), a = pick([1, 1.5, 2, 2.5, 3, 4]), t1 = pick([2, 3, 4, 5]), v1 = v0 + a * t1, T = t1 + pick([2, 3, 4]);
      if ((v1 - v0) / v1 < 0.25 || !nice(v1, 1)) return null;
      const Fv = m * a, w = [m * v1 / t1, m * (v1 - v0) / T, m * (v1 + v0) / t1, m * (v1 - v0)]; if (![Fv, ...w].every(x => ok2(x))) return null;
      return mc(ae(Fv, w, U_("N")), { svg: svEl(figVT(v0, v1, t1, T)), text: `Kütləsi ${m} kq olan cisim hamar üfüqi səthdə düz xətt boyunca hərəkət edir. Sürətinin vaxtdan asılılıq qrafiki verilib. Cismə 0-dan ${t1} s-ə qədər təsir edən əvəzləyici qüvvənin modulu nə qədərdir?`,
        solution: `Qrafikdən: v₀ = ${v0} m/s, ${t1} s-də v = ${F(v1)} m/s. a = (v − v₀)/t = (${F(v1)} − ${v0})/${t1} = ${F(a)} m/s². F = ma = ${m}·${F(a)} = ${F(Fv)} N. Tələlər: ${Fx(w[0])} N — başlanğıc sürəti unutmaq (m·v/t); ${Fx(w[1])} N — sürət dəyişməsini bütün ${T} s-ə bölmək (sabit sürət hissəsini də qatmaq); ${Fx(w[2])} N — sürətləri toplamaq; ${Fx(w[3])} N — vaxta bölməyi unutmaq.` });
    }) },
    // 2. force acts for t1, then it is removed: total path (F–t graph)
    { tip: "qapali", birlesik: "fiz-kinematika", minVariety: 8, gen: () => again(() => {
      const m = pick([2, 4, 5, 10]), a = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), t1 = pick([2, 3, 4, 5, 6]), t2 = pick([2, 3, 4, 5, 6]), Fv = m * a, v = a * t1, s1 = a * t1 * t1 / 2, s2 = v * t2, s = s1 + s2;
      const w = [a * (t1 + t2) ** 2 / 2, v * (t1 + t2), s2, s1]; if (![s, ...w].every(x => ok2(x))) return null;
      return mc(ae(s, w, U_("m")), { svg: svEl(figFT(Fv, t1, t2)), text: `Sükunətdə olan ${m} kq kütləli cismə hamar üfüqi səthdə üfüqi istiqamətdə qüvvə təsir edir; qüvvənin vaxtdan asılılıq qrafiki verilib. Cisim hərəkətin ilk ${t1 + t2} s-də neçə metr yol gedər?`,
        solution: `Qüvvə ${t1} s təsir edir: a = F/m = ${F(Fv)}/${m} = ${F(a)} m/s². Bu vaxtda yol s₁ = at²/2 = ${F(s1)} m, sürət v = at = ${F(v)} m/s. Sonra qüvvə yoxdur: əvəzləyici qüvvə sıfırdır, cisim sabit v sürətilə hərəkət edir (Nyutonun I qanunu): s₂ = v·${t2} = ${F(s2)} m. Cəmi s = ${F(s1)} + ${F(s2)} = ${F(s)} m. Tələlər: ${Fx(w[0])} m — qüvvənin axıra qədər təsir etdiyini sanmaq (a(t₁+t₂)²/2); ${Fx(w[1])} m — sürəti başdan sabit v saymaq; ${Fx(w[2])} m — yalnız ikinci hissə; ${Fx(w[3])} m — yalnız birinci hissə.` });
    }) },
    // 3. Atwood machine: m2 hits the floor, m1 flies up freely (Newton + free flight)
    { tip: "qapali", birlesik: "fiz-serbest-dusme", minVariety: 8, gen: () => again(() => {
      const m1 = rnd(1, 6), m2 = rnd(m1 + 1, 9), hh = pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), a = (m2 - m1) * g / (m1 + m2), v2 = 2 * a * hh, H = hh + v2 / (2 * g);
      if (!nice(a, 2)) return null;
      const w = [hh, v2 / (2 * g), hh + v2 / g, 2 * hh]; if (![H, ...w].every(x => ok2(x))) return null;
      return mc(ae(H, w, U_("m")), { svg: svEl(figAtH("m₁ = " + m1, "m₂ = " + m2, hh)), text: `Atvud maşınında m₁ = ${m1} kq yük yerdədir, m₂ = ${m2} kq yük isə yerdən ${F(hh)} m hündürlükdə tutulub (ipin hər iki hissəsi şaquli və gərilib). Yükləri sükunətdən buraxırlar. m₂ yerə dəyib dayanır (sıçramır), ip boşalır. m₁ yükü yerdən ən çox neçə metr hündürlüyə qalxar? (Blok və ip çəkisizdir, sürtünmə yoxdur, blok kifayət qədər yuxarıdadır; g = 10 m/s².)`,
        solution: `a = (m₂ − m₁)g/(m₁ + m₂) = ${m2 - m1}·10/${m1 + m2} = ${F(a)} m/s². m₂ ${F(hh)} m düşənə qədər m₁ də ${F(hh)} m qalxır: v² = 2ah = 2·${F(a)}·${F(hh)} = ${Fx(v2)}. İp boşalır, m₁ yalnız ağırlıq qüvvəsinin təsiri ilə, yuxarı atılmış cisim kimi hərəkət edir: əlavə qalxma v²/(2g) = ${Fx(v2)}/20 = ${Fx(v2 / (2 * g))} m. Yerdən hündürlük: h + v²/(2g) = ${F(hh)} + ${Fx(v2 / (2 * g))} = ${Fx(H)} m. Tələlər: ${F(hh)} m — m₂ dayananda m₁ də dayanır sanmaq (ətalət unudulur); ${Fx(w[1])} m — yalnız əlavə qalxmanı götürmək (h-ı unutmaq); ${Fx(w[2])} m — v²/g yazmaq (2-yə bölməyi unutmaq); ${Fx(w[3])} m — m₂-ni sərbəst düşən saymaq (a = g).` });
    }) },
    // 4. a load is lifted with constant tension, the rope breaks: the greatest height
    { tip: "qapali", birlesik: "fiz-serbest-dusme", minVariety: 8, gen: () => again(() => {
      const m = pick([2, 3, 4, 5]), a = pick([1, 2, 2.5, 4, 5]), t = pick([2, 3, 4]), Tn = m * (g + a), H1 = a * t * t / 2, v = a * t, H2 = v * v / (2 * g), H = H1 + H2, ap = Tn / m;
      if (!nice(Tn, 1)) return null;
      const w = [H1, H2, H1 + v * v / g, ap * t * t / 2 + (ap * t) ** 2 / (2 * g)]; if (![H, ...w].every(x => ok2(x))) return null;
      return mc(ae(H, w, U_("m")), { svg: svEl(figRise("m = " + m + " kq", Tn)), text: `${m} kq kütləli yükü yerdən iplə şaquli yuxarı qaldırırlar; ipin gərilmə qüvvəsi sabit ${F(Tn)} N-dur. Hərəkətə başladıqdan ${t} s sonra ip qırılır. Yük yerdən ən çox neçə metr hündürlüyə qalxar? (Başlanğıcda yük yerdə sükunətdədir; g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `Qalxarkən: T − mg = ma → a = T/m − g = ${F(Tn)}/${m} − 10 = ${F(a)} m/s². ${t} s-də: h₁ = at²/2 = ${F(H1)} m, v = at = ${F(v)} m/s. İp qırılandan sonra yalnız ağırlıq qüvvəsi var: yük hələ v sürətilə yuxarı gedir və əlavə h₂ = v²/(2g) = ${F(H2)} m qalxır. H = ${F(H1)} + ${F(H2)} = ${F(H)} m. Tələlər: ${Fx(w[0])} m — ip qırılan an zirvə sanmaq; ${Fx(w[1])} m — yalnız sərbəst uçuş hissəsi; ${Fx(w[2])} m — v²/g yazmaq (2-yə bölməyi unutmaq); ${Fx(w[3])} m — təcili T/m = ${F(ap)} m/s² götürmək (mg-ni çıxmağı unutmaq).` });
    }) },
    // 5. lift: v–t graph → the scale reading in the first or third stage
    { tip: "qapali", birlesik: "fiz-kinematika", minVariety: 8, gen: () => again(() => {
      const m = pick([50, 60, 70, 80]), v = pick([2, 3, 4, 5, 6]), t1 = pick([2, 3, 4, 5]), t2 = pick([2, 3, 4]), t3 = pick([2, 3, 4, 5]), a1 = v / t1, a3 = v / t3, k = pick([1, 3]), T = t1 + t2 + t3;
      if (a1 === a3 || !nice(a1, 2) || !nice(a3, 2)) return null;
      const N = k === 1 ? m * (g + a1) : m * (g - a3), w = k === 1 ? [m * (g - a1), m * g, m * a1, m * (g + a3)] : [m * (g + a3), m * g, m * a3, m * (g - a1)];
      if (![N, ...w].every(x => ok2(x))) return null;
      return mc(ae(N, w, U_("N")), { svg: svEl(figLift(v, t1, t2, t3)), text: `Liftdə kütləsi ${m} kq olan adam tərəzinin üstündə durur. Liftin sürətinin (ox yuxarı) vaxtdan asılılıq qrafiki verilib. ${k === 1 ? "Birinci" : "Üçüncü"} mərhələdə (${k === 1 ? `0 – ${t1} s` : `${t1 + t2} s – ${T} s`}) tərəzi neçə nyuton göstərir? (g = 10 m/s².)`,
        solution: k === 1 ? `Birinci mərhələdə sürət ${t1} s-də 0-dan ${v} m/s-ə artır: a = ${v}/${t1} = ${F(a1)} m/s², təcil yuxarıdır. N − mg = ma → N = m(g + a) = ${m}·${F(g + a1)} = ${F(N)} N. Tələlər: ${Fx(w[0])} N — g − a (təcilin işarəsi səhv); ${m * g} N — hərəkətin çəkini dəyişmədiyini sanmaq; ${Fx(w[2])} N — yalnız ma (mg-ni unutmaq); ${Fx(w[3])} N — üçüncü mərhələnin təcil modulunu götürmək (m(g + a₃)).`
          : `Üçüncü mərhələdə sürət ${t3} s-də ${v} m/s-dən 0-a düşür: a = ${v}/${t3} = ${F(a3)} m/s², lift yuxarı gedir və yavaşıyır, təcil aşağıdır. N − mg = −ma → N = m(g − a) = ${m}·${F(g - a3)} = ${F(N)} N. Tələlər: ${Fx(w[0])} N — g + a (hərəkət yuxarıdır deyə təcili də yuxarı saymaq); ${m * g} N — hərəkətin çəkini dəyişmədiyini sanmaq; ${Fx(w[2])} N — yalnız ma; ${Fx(w[3])} N — birinci mərhələnin təcil modulunu götürmək (m(g − a₁)).` });
    }) },
    // 6. three blocks on strings: the force at which the first string breaks
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const m1 = rnd(1, 5), m2 = rnd(1, 5), m3 = rnd(1, 5), Tm = pick([6, 8, 10, 12, 15, 18, 20, 24, 30]), M = m1 + m2 + m3, Fv = Tm * M / (m1 + m2);
      const w = [Tm, Tm * M / m1, Tm * M / m3, Tm * (m1 + m2) / M]; if (!nice(Fv, 1) || ![Fv, ...w].every(x => ok2(x))) return null;
      return mc(ae(Fv, w, U_("N")), { svg: blocksPic(["m₁ = " + m1, "m₂ = " + m2, "m₃ = " + m3], "F"), text: `Hamar üfüqi masada m₁ = ${m1} kq, m₂ = ${m2} kq, m₃ = ${m3} kq kütləli üç cisim çəkisiz iplə ardıcıl bağlanıb. m₃ cismini sağa üfüqi F qüvvəsi ilə dartırlar. Hər ip ən çox ${Tm} N gərilməyə davam gətirir. F-i tədricən artırsaq, ilk ip hansı F qiymətində qırılar?`,
        solution: `Hamısı eyni a ilə gedir: a = F/(m₁ + m₂ + m₃) = F/${M}. Soldakı ip yalnız m₁-i dartır: T₁₂ = m₁a. Sağdakı ip m₁ və m₂-ni dartır: T₂₃ = (m₁ + m₂)a — o böyükdür, ona görə ilk o qırılır. T₂₃ = ${Tm} N → a = ${Tm}/${m1 + m2} = ${Fx(Tm / (m1 + m2))} m/s², F = ${M}·${Fx(Tm / (m1 + m2))} = ${Fx(Fv)} N. Tələlər: ${Tm} N — F = T sanmaq; ${Fx(w[1])} N — soldakı ipi götürmək (o daha az gərilir); ${Fx(w[2])} N — ipin yalnız özündən sonrakı cismi dartdığını sanmaq (T = m₃a); ${Fx(w[3])} N — nisbəti tərsinə yazmaq.` });
    }) },
    // 7. table + hanging load: from the speed after the path h find the hanging mass
    { tip: "qapali", birlesik: "fiz-kinematika", minVariety: 8, gen: () => again(() => {
      const mx = rnd(1, 8), my = rnd(1, 6), a = my * g / (mx + my), v = pick([1, 1.5, 2, 2.5, 3, 4, 5, 6, 8]), hh = v * v / (2 * a);
      if (!nice(a, 2) || !nice(hh, 2) || hh > 12 || hh < 0.4) return null;
      const w = [mx * a / g, mx * (g - a) / a, mx * a / (g + a), mx * a]; if (![my, ...w].every(x => ok2(x))) return null;
      return mc(ae(my, w, U_("kq")), { svg: tablePic("m_x = " + mx, "m_y = ?"), text: `Hamar masada ${mx} kq kütləli cisim iplə, masanın kənarındakı blokdan aşan ipin ucundan asılmış yüklə bağlıdır. Sistemi sükunətdən buraxırlar; yük ${F(hh)} m aşağı enəndə onun sürəti ${F(v)} m/s olur. Asılan yükün kütləsi nə qədərdir? (Blok və ip çəkisizdir, ip uzanmır, sürtünmə yoxdur; g = 10 m/s².)`,
        solution: `Kinematika: v² = 2ah → a = v²/(2h) = ${Fx(v * v)}/${F(2 * hh)} = ${F(a)} m/s². Hərəkətə gətirən qüvvə m_y·g, sürətlənən kütlə m_x + m_y: m_y·g = (${mx} + m_y)·a → m_y(g − a) = ${mx}·a → m_y = ${mx}·${F(a)}/${F(g - a)} = ${F(my)} kq. Tələlər: ${Fx(w[0])} kq — sürətlənən kütləyə yalnız m_x-i qatmaq (m_y = m_xa/g); ${Fx(w[1])} kq — nisbəti tərsinə yazmaq; ${Fx(w[2])} kq — g − a əvəzinə g + a; ${Fx(w[3])} kq — təcili kütləyə vurmaq (m_x·a).` });
    }) },
    // 8. two bodies joined by a dynamometer, pulled apart by different forces
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const m1 = rnd(1, 6), m2 = rnd(1, 6), a = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), F1 = rnd(2, 12), F2 = F1 + (m1 + m2) * a, Tn = F1 + m1 * a;
      if (m1 === m2) return null;
      const w = [(F1 + F2) / 2, F1, F2, F1 + F2]; if (![Tn, ...w].every(x => ok2(x))) return null;
      return mc(ae(Tn, w, U_("N")), { svg: svEl(figDyn("m₁ = " + m1, "m₂ = " + m2, F1, F2)), text: `Hamar üfüqi masada kütlələri m₁ = ${m1} kq və m₂ = ${m2} kq olan iki cisim çəkisiz dinamometrlə birləşdirilib. Birinci cismə sola ${F(F1)} N, ikinci cismə sağa ${F(F2)} N üfüqi qüvvə təsir edir. Cisimlər birlikdə hərəkət edir. Dinamometr neçə nyuton göstərir?`,
        solution: `Böyük qüvvə sağadır (F₂ > F₁), təcil sağa yönəlib: a = (F₂ − F₁)/(m₁ + m₂) = (${F(F2)} − ${F(F1)})/${m1 + m2} = ${F(a)} m/s². Birinci cisim üçün (ox sağa): T − F₁ = m₁a → T = ${F(F1)} + ${m1}·${F(a)} = ${F(Tn)} N. Yoxla, ikinci cisim: F₂ − T = ${F(F2)} − ${F(Tn)} = ${F(F2 - Tn)} = m₂a = ${m2}·${F(a)} ✓. Tələlər: ${Fx(w[0])} N — orta qiymət (yalnız m₁ = m₂ olanda düzdür); ${F(F1)} N və ${F(F2)} N — yalnız bir qüvvəni götürmək; ${Fx(w[3])} N — qüvvələri toplamaq.` });
    }) },
    // 9. Atwood machine on a dynamometer: reading while the loads move
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const m1 = rnd(1, 8), m2 = rnd(m1 + 1, 10), a = (m2 - m1) * g / (m1 + m2), Tn = 2 * m1 * m2 * g / (m1 + m2), D = 2 * Tn;
      if (!nice(a, 2) || !nice(D, 1)) return null;
      const w = [(m1 + m2) * g, Tn, 2 * m2 * g, (m2 - m1) * g]; if (![D, ...w].every(x => ok2(x))) return null;
      return mc(ae(D, w, U_("N")), { svg: svEl(figAtD("m₁ = " + m1, "m₂ = " + m2)), text: `Çəkisiz blokdan aşan çəkisiz iplə m₁ = ${m1} kq və m₂ = ${m2} kq kütləli yüklər asılıb; blok çəkisiz dinamometrə bərkidilib. Yükləri buraxırlar. Yüklər hərəkət edərkən dinamometr neçə nyuton göstərir? (Sürtünmə yoxdur; g = 10 m/s².)`,
        solution: `a = (m₂ − m₁)g/(m₁ + m₂) = ${F(a)} m/s². m₁ üçün: T − m₁g = m₁a → T = m₁(g + a) = ${m1}·${F(g + a)} = ${F(Tn)} N. Blokdan aşan ipin hər iki hissəsi blokdan aşağı T qüvvəsi ilə dartır, blokun kütləsi yoxdur → dinamometr 2T = ${F(D)} N göstərir. Tələlər: ${F((m1 + m2) * g)} N — yüklərin ağırlıqlarını toplamaq (təcilin təsirini unutmaq); ${F(Tn)} N — yalnız T (2-yə vurmağı unutmaq); ${F(2 * m2 * g)} N — ağır yükün ağırlığının iki qatı; ${F((m2 - m1) * g)} N — ağırlıqların fərqi.` });
    }) },
    // 10. a heavy uniform rope pulled at one end: the tension in a section
    { tip: "qapali", minVariety: 8, gen: () => again(() => {
      const L = rnd(2, 6), d = rnd(1, L - 1), Fv = pick([6, 8, 10, 12, 15, 20, 24, 30]), Tn = Fv * d / L;
      const w = [Fv, Fv * (L - d) / L, Fv / 2, Fv * d / (L - d)]; if (![Tn, ...w].every(x => ok2(x))) return null;
      return mc(ae(Tn, w, U_("N")), { svg: svEl(figRope(L, d, Fv)), text: `Uzunluğu L = ${L} m, kütləsi M olan bircins ip hamar üfüqi səthdə uzanır. İpin sağ ucundan üfüqi ${F(Fv)} N qüvvə ilə dartırlar (ip düz qalır). İpin sol ucundan ${F(d)} m məsafədəki A kəsiyində ipin gərilmə qüvvəsi nə qədərdir?`,
        solution: `Bütün ip eyni təcillə gedir: a = F/M. A kəsiyindən soldakı hissənin kütləsi M·d/L; onu yalnız ipin qalan hissəsi dartır: T = (M·d/L)·a = F·d/L = ${F(Fv)}·${F(d)}/${L} = ${Fx(Tn)} N. Tələlər: ${F(Fv)} N — gərilməni hər yerdə F sanmaq (ipin kütləsini unutmaq); ${Fx(w[1])} N — məsafəni sağ ucdan saymaq; ${Fx(w[2])} N — kəsiyi ortada sanmaq (F/2); ${Fx(w[3])} N — d/L əvəzinə d/(L − d) götürmək.` });
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
      key: "fiz-nyuton", title: "Nyuton qanunları, bağlı cisimlər", fenn: "fizika", link: "dersler/fiz-nyuton.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (SI: N, kq, m/s²). Onluq kəsr vergül və ya nöqtə ilə: 2,5. g = 10 m/s².",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ii", "lift", "ip", "ip", "masa", "masa", "atvud", "atvud", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-nyuton.html")) b.push("dersler/fiz-nyuton.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
