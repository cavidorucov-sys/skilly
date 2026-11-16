// Fizika · Üfüqi və bucaq altında atılan cisim — mastery game levels and the final test. g = 10 m/s².
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit?}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const D = x => { const r = Math.round(x * 1000) / 1000; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); }; // 2.5 → "2,5"
  const rt = N => { if (N === 0) return "0"; let k = 1, m = N; for (let d = 2; d * d <= m; d++) while (m % (d * d) === 0) { m /= d * d; k *= d; } return m === 1 ? String(k) : (k === 1 ? "" : k) + "√" + m; };
  const eqr = N => "√" + N + (rt(N) !== "√" + N ? " = " + rt(N) : "");
  const frac = (p, q) => { const g = gcd(p, q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  // exact number n·√r/d (r = 1 or 3); integers and terminating decimals without the root
  const Q = (n, d, r) => ({ n, d, r: r || 1 });
  const qv = q => q.n * Math.sqrt(q.r) / q.d;
  const qs = q => { const g = gcd(q.n, q.d) || 1, n = q.n / g, d = q.d / g; if (q.r === 1) return D(n / d); return (n === 1 ? "" : n) + "√" + q.r + (d > 1 ? "/" + d : ""); };

  // ---------- SVG ----------
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const f1 = n => (+n).toFixed(1);
  function arrow(g, x1, y1, x2, y2, color, w) {
    const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L;
    g.append(sv("line", { x1: f1(x1), y1: f1(y1), x2: f1(x2 - 7 * ux), y2: f1(y2 - 7 * uy), stroke: color, "stroke-width": w || 2.5, "stroke-linecap": "round" }));
    const p = [[x2, y2], [x2 - 11 * ux + 4.5 * uy, y2 - 11 * uy - 4.5 * ux], [x2 - 11 * ux - 4.5 * uy, y2 - 11 * uy + 4.5 * ux]];
    g.append(sv("polygon", { points: p.map(q => f1(q[0]) + "," + f1(q[1])).join(" "), fill: color }));
  }
  const label = (g, x, y, t) => g.append(sv("text", { x: f1(x), y: f1(y), "text-anchor": "middle", class: "oy-lbl" }, t));
  // angled throw from the ground at angle a (deg): parabola, v0 arrow, H and L marks
  function angPic(a, aText) {
    const g = sv("svg", { viewBox: "0 0 260 190", class: "oy-svg", role: "img", "aria-label": "Bucaq altında atılan cismin trayektoriyası" });
    const x0 = 24, x1 = 236, y0 = 160, H = Math.min(125, (x1 - x0) * Math.tan(a * Math.PI / 180) / 4), xm = (x0 + x1) / 2;
    g.append(sv("line", { x1: 8, y1: y0, x2: 252, y2: y0, stroke: "var(--ink)", "stroke-width": 1.5 }));
    g.append(sv("path", { d: `M${x0} ${y0}Q${xm} ${f1(y0 - 2 * H)} ${x1} ${y0}`, fill: "none", stroke: "var(--muted)", "stroke-width": 2, "stroke-dasharray": "5 4" }));
    const ar = a * Math.PI / 180; arrow(g, x0, y0, x0 + 58 * Math.cos(ar), y0 - 58 * Math.sin(ar), "var(--vec)", 3);
    label(g, x0 + 66 * Math.cos(ar) + 8, y0 - 66 * Math.sin(ar), "v₀");
    g.append(sv("path", { d: `M${x0 + 26} ${y0}A26 26 0 0 0 ${f1(x0 + 26 * Math.cos(ar))} ${f1(y0 - 26 * Math.sin(ar))}`, fill: "none", stroke: "var(--accent)", "stroke-width": 2 }));
    label(g, x0 + 44 * Math.cos(ar / 2) + 8, y0 - 44 * Math.sin(ar / 2) + 5, aText);
    g.append(sv("line", { x1: xm, y1: y0, x2: xm, y2: f1(y0 - H), stroke: "var(--accent)", "stroke-dasharray": "3 3" }));
    label(g, xm + 12, y0 - H / 2 + 5, "H"); label(g, xm, y0 + 20, "L");
    return g;
  }
  // horizontal throw from a height
  function horPic() {
    const g = sv("svg", { viewBox: "0 0 260 190", class: "oy-svg", role: "img", "aria-label": "Hündürlükdən üfüqi atılan cisim" });
    g.append(sv("rect", { x: 10, y: 40, width: 46, height: 130, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 1.5 }));
    g.append(sv("line", { x1: 10, y1: 170, x2: 252, y2: 170, stroke: "var(--ink)", "stroke-width": 1.5 }));
    g.append(sv("path", { d: "M56 40Q146 40 236 170", fill: "none", stroke: "var(--muted)", "stroke-width": 2, "stroke-dasharray": "5 4" }));
    arrow(g, 56, 40, 112, 40, "var(--vec)", 3); label(g, 90, 30, "v₀");
    label(g, 70, 110, "h"); label(g, 146, 186, "L");
    return g;
  }

  // angled-throw cases: v0 text, angle text, vx and vy as exact numbers [coef, root]
  function throwCase() {
    const kind = pick(["30", "60", "45", "37", "53"]), m = rnd(1, 6);
    if (kind === "30") return { v0: `${10 * m} m/s`, ang: "30°", a: 30, vx: [5 * m, 3], vy: [5 * m, 1], how: `vx = ${10 * m}·cos 30° = ${5 * m}√3, vy = ${10 * m}·sin 30° = ${5 * m}` };
    if (kind === "60") return { v0: `${10 * m} m/s`, ang: "60°", a: 60, vx: [5 * m, 1], vy: [5 * m, 3], how: `vx = ${10 * m}·cos 60° = ${5 * m}, vy = ${10 * m}·sin 60° = ${5 * m}√3` };
    if (kind === "45") return { v0: `${10 * m}√2 m/s`, ang: "45°", a: 45, vx: [10 * m, 1], vy: [10 * m, 1], how: `vx = vy = v₀·√2/2 = ${10 * m}` };
    const k = rnd(2, 10), v0 = 5 * k;
    if (kind === "37") return { v0: `${v0} m/s`, ang: "α (sin α = 0,6)", a: 37, vx: [4 * k, 1], vy: [3 * k, 1], how: `cos α = 0,8; vx = ${v0}·0,8 = ${4 * k}, vy = ${v0}·0,6 = ${3 * k}` };
    return { v0: `${v0} m/s`, ang: "α (sin α = 0,8)", a: 53, vx: [3 * k, 1], vy: [4 * k, 1], how: `cos α = 0,6; vx = ${v0}·0,6 = ${3 * k}, vy = ${v0}·0,8 = ${4 * k}` };
  }

  const levels = [
    { id: "ufuqi", ad: "Üfüqi atılma", izah: "Şaquli üzrə — sərbəst düşmə: h = 5t². Üfüqi üzrə — sabit sürət: L = v₀·t. Vaxt yalnız hündürlükdən asılıdır!",
      gen() {
        const k = rnd(1, 6), hh = 5 * k * k, v0 = rnd(2, 25), L = v0 * k, kind = pick(["t", "L", "L", "v0", "h"]);
        if (kind === "t") return { text: `Daş ${hh} m hündürlükdən ${v0} m/s sürətlə üfüqi atıldı. O, neçə saniyəyə yerə düşər?`, svg: horPic(), answer: k, show: String(k), unit: "s", tol: 0.01,
          solution: `h = gt²/2 → t = √(2h/g) = √(${2 * hh}/10) = √${k * k} = ${k} s. Üfüqi sürət vaxta təsir etmir.` };
        if (kind === "L") return { text: `Daş ${hh} m hündürlükdən ${v0} m/s sürətlə üfüqi atıldı. Atılma nöqtəsinin altından nə qədər uzağa düşər?`, svg: horPic(), answer: L, show: String(L), unit: "m", tol: 0.01,
          solution: `t = √(2h/g) = ${k} s. L = v₀·t = ${v0}·${k} = ${L} m.` };
        if (kind === "v0") return { text: `${hh} m hündürlükdən üfüqi atılan daş atılma nöqtəsinin altından ${L} m uzağa düşdü. Başlanğıc sürət nə qədər idi?`, svg: horPic(), answer: v0, show: String(v0), unit: "m/s", tol: 0.01,
          solution: `t = √(2·${hh}/10) = ${k} s. v₀ = L/t = ${L}/${k} = ${v0} m/s.` };
        return { text: `Hündürlükdən ${v0} m/s sürətlə üfüqi atılan daş ${L} m uzağa düşdü. Hündürlük nə qədər idi?`, svg: horPic(), answer: hh, show: String(hh), unit: "m", tol: 0.01,
          solution: `t = L/v₀ = ${L}/${v0} = ${k} s. h = gt²/2 = 5·${k * k} = ${hh} m.` };
      } },
    { id: "ufuqi-v", ad: "Üfüqi atılma: sürət", izah: "vx = v₀ dəyişmir, |vy| = g·t artır. Sürət: v = √(vx² + vy²); üfüqlə bucaq: tg β = vy/vx.",
      gen() {
        const k = rnd(1, 6), hh = 5 * k * k, v0 = rnd(2, 30), kind = pick(["land", "land", "tg", "mid"]);
        if (kind === "land") { const N = v0 * v0 + 100 * k * k;
          return { text: `Cisim ${hh} m hündürlükdən ${v0} m/s sürətlə üfüqi atıldı. Yerə dəyən anda sürətinin modulu nə qədərdir?`, svg: horPic(), answer: Math.sqrt(N), show: rt(N), unit: "m/s", placeholder: "məs. 25 və ya 5√13",
            solution: `t = √(2h/g) = ${k} s. vx = ${v0}, vy = g·t = ${10 * k} m/s. v = √(${v0}² + ${10 * k}²) = ${eqr(N)} m/s.` }; }
        if (kind === "tg") return { text: `Cisim ${hh} m hündürlükdən ${v0} m/s sürətlə üfüqi atıldı. Yerə dəyən anda sürət vektoru üfüqlə β bucağı əmələ gətirir. tg β = ?`, svg: horPic(), answer: 10 * k / v0, show: frac(10 * k, v0), placeholder: "məs. 4/3",
          solution: `t = ${k} s, vy = ${10 * k} m/s, vx = ${v0} m/s. tg β = vy/vx = ${10 * k}/${v0} = ${frac(10 * k, v0)}.` };
        const t = rnd(1, 4), N = v0 * v0 + 100 * t * t;
        return { text: `Cisim hündür qayadan ${v0} m/s sürətlə üfüqi atıldı. Atıldıqdan ${t} s sonra (hələ havadadır) sürətinin modulu nə qədərdir?`, answer: Math.sqrt(N), show: rt(N), unit: "m/s", placeholder: "məs. 10√5",
          solution: `vx = ${v0} m/s, vy = 10·${t} = ${10 * t} m/s. v = √(${v0 * v0} + ${100 * t * t}) = ${eqr(N)} m/s.` };
      } },
    { id: "bucaq", ad: "Bucaq altında: T, H, L", izah: "Əvvəl başlanğıc sürəti komponentlərə ayır: vx = v₀cos α, vy = v₀sin α. Sonra: qalxma vaxtı vy/g, uçuş T = 2vy/g, H = vy²/(2g), L = vx·T.",
      gen() {
        const c = throwCase(), ask = pick(["up", "T", "H", "L", "L"]);
        const vx = Q(c.vx[0], 1, c.vx[1]), vy = Q(c.vy[0], 1, c.vy[1]);
        let ans, unit, step;
        if (ask === "up") { ans = Q(vy.n, 10, vy.r); unit = "s"; step = `Qalxma vaxtı: t = vy/g = ${qs(vy)}/10 = ${qs(ans)} s.`; }
        if (ask === "T") { ans = Q(vy.n, 5, vy.r); unit = "s"; step = `Uçuş vaxtı: T = 2vy/g = 2·${qs(vy)}/10 = ${qs(ans)} s.`; }
        if (ask === "H") { ans = Q(vy.n * vy.n * vy.r, 20, 1); unit = "m"; step = `H = vy²/(2g) = (${qs(vy)})²/20 = ${vy.n * vy.n * vy.r}/20 = ${qs(ans)} m.`; }
        if (ask === "L") { const r = vx.r * vy.r; ans = Q(vx.n * vy.n, 5, r); unit = "m"; step = `T = 2vy/g = ${qs(Q(vy.n, 5, vy.r))} s. L = vx·T = ${qs(vx)}·${qs(Q(vy.n, 5, vy.r))} = ${qs(ans)} m.`; }
        const word = { up: "neçə saniyəyə ən yüksək nöqtəyə qalxar?", T: "neçə saniyə havada olar?", H: "ən çox hansı hündürlüyə qalxar (H)?", L: "nə qədər uzağa düşər (L)?" }[ask];
        return { text: `Daş yerdən v₀ = ${c.v0} sürətlə üfüqlə ${c.ang} bucaq altında atıldı. Daş ${word}`, svg: angPic(c.a, c.a === 37 || c.a === 53 ? "α" : c.ang), answer: qv(ans), show: qs(ans), unit, placeholder: "məs. 2,4 və ya 5√3",
          solution: `${c.how} m/s. ${step}` };
      } },
    { id: "noqte", ad: "Uçuşun istənilən anında", izah: "vx = const, vy = v₀y − g·t (qalxanda müsbət, düşəndə mənfi). Hündürlükdə: v² = v₀² − 2gh.",
      gen() {
        const vx = 5 * rnd(1, 6), vy0 = 10 * rnd(1, 5), T = vy0 / 5, N0 = vx * vx + vy0 * vy0;
        const give = Math.random() < .5 ? `başlanğıc sürətinin proyeksiyaları v₀x = ${vx} m/s, v₀y = ${vy0} m/s` : `başlanğıc sürəti ${rt(N0)} m/s, üfüqi proyeksiyası ${vx} m/s`;
        const kind = pick(["v", "v", "vy", "min", "h", ...(vy0 > vx ? ["45"] : [])]);
        const pre = `Top yerdən atıldı, ${give}.`;
        const vyFrom = give.includes("v₀y") ? "" : ` v₀y = √(${N0} − ${vx * vx}) = ${vy0} m/s.`;
        if (kind === "v" || kind === "vy") {
          const t = rnd(1, T - 1 || 1), vy = vy0 - 10 * t, N = vx * vx + vy * vy;
          if (kind === "vy") return { text: `${pre} ${t} s sonra sürətin şaquli proyeksiyası vy nəyə bərabərdir? (yuxarı — müsbət)`, answer: vy, show: S(vy), unit: "m/s", tol: 0.01,
            solution: `${vyFrom} vy = v₀y − g·t = ${vy0} − 10·${t} = ${S(vy)} m/s.` + (vy < 0 ? " Mənfi — top artıq düşür." : vy === 0 ? " Sıfır — top ən yüksək nöqtədədir." : " Müsbət — top hələ qalxır.") };
          return { text: `${pre} ${t} s sonra sürətinin modulu nə qədərdir?`, answer: Math.sqrt(N), show: rt(N), unit: "m/s", placeholder: "məs. 5√5",
            solution: `${vyFrom} vy = ${vy0} − 10·${t} = ${S(vy)} m/s, vx = ${vx} m/s. v = √(${vx * vx} + ${vy * vy}) = ${eqr(N)} m/s.` };
        }
        if (kind === "min") return { text: `${pre} Uçuş zamanı sürətin ən kiçik qiyməti nə qədərdir?`, answer: vx, show: String(vx), unit: "m/s", tol: 0.01,
          solution: `vx dəyişmir, |vy| isə ən yüksək nöqtədə sıfırdır. Ən kiçik sürət ən yüksək nöqtədədir: v = vx = ${vx} m/s.` };
        if (kind === "45") { const t = (vy0 - vx) / 10;
          return { text: `${pre} Neçə saniyə sonra sürət vektoru ilk dəfə üfüqlə 45° bucaq əmələ gətirər?`, answer: t, show: D(t), unit: "s",
            solution: `45°-də |vy| = vx. Qalxarkən: ${vy0} − 10t = ${vx} → t = ${D(t)} s.${vyFrom}` }; }
        // speed at height hh: v² = v0² − 2g·hh, hh ≤ H
        const H = vy0 * vy0 / 20; let hh = 5 * rnd(1, Math.floor(H / 5));
        const N = N0 - 20 * hh;
        return { text: `${pre} ${hh} m hündürlükdə topun sürəti nə qədərdir?`, answer: Math.sqrt(N), show: rt(N), unit: "m/s", placeholder: "məs. 5√7",
          solution: `vy² = v₀y² − 2gh, vx dəyişmir → v² = v₀² − 2gh = ${N0} − 20·${hh} = ${N}. v = ${eqr(N)} m/s (qalxanda da, düşəndə də eyni).` };
      } },
    { id: "hesab", ad: "Həyatdan", izah: "Məsələni şəklə çevir: hansı hissə sərbəst düşmədir, hansı bərabərsürətli hərəkət?",
      gen() {
        const kind = pick(["plane", "table", "ball", "cliff"]);
        if (kind === "plane") { const k = rnd(4, 10), hh = 5 * k * k, j = rnd(5, 20), v = 10 * j, L = v * k;
          return { text: `Təyyarə ${hh} m hündürlükdə ${36 * j} km/saat sürətlə üfüqi uçur. Yük hədəfdən üfüqi istiqamətdə nə qədər məsafədə buraxılmalıdır ki, düz hədəfə düşsün?`, answer: L, show: String(L), unit: "m", tol: 0.01,
            solution: `${36 * j} km/saat = ${v} m/s. Düşmə vaxtı t = √(2h/g) = √${k * k} = ${k} s. Bu müddətdə yük üfüqi ${v}·${k} = ${L} m gedir.` }; }
        if (kind === "table") { const t = pick([0.2, 0.3, 0.4, 0.5, 0.6]), hh = 5 * t * t, v0 = pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5]), L = v0 * t;
          return { text: `Kürəcik masanın kənarından ${D(v0)} m/s sürətlə yuvarlanıb düşür. Masanın hündürlüyü ${D(hh)} m-dir. Kürəcik masanın ayağından nə qədər uzağa düşər?`, answer: L, show: D(L), unit: "m",
            solution: `t = √(2h/g) = √(${D(2 * hh)}/10) = ${D(t)} s. L = ${D(v0)}·${D(t)} = ${D(L)} m.` }; }
        if (kind === "ball") { const j = rnd(1, 4), L = 10 * j * j;
          return { text: `Futbolçu topu yerdən üfüqlə 45° bucaq altında vurdu, top ${L} m uzağa düşdü. Topun başlanğıc sürəti nə qədər idi? (hava müqaviməti nəzərə alınmır)`, answer: 10 * j, show: String(10 * j), unit: "m/s", tol: 0.01,
            solution: `L = v₀²·sin 2α/g, 45°-də sin 90° = 1: L = v₀²/g → v₀ = √(gL) = √${10 * L} = ${10 * j} m/s.` }; }
        const k = rnd(2, 6), hh = 5 * k * k, v0 = rnd(3, 20), N = v0 * v0 + 100 * k * k;
        return { text: `Oğlan ${hh} m hündürlükdəki sahil qayasından dənizə daşı ${v0} m/s sürətlə üfüqi atdı. Daş suya hansı sürətlə düşər?`, answer: Math.sqrt(N), show: rt(N), unit: "m/s", placeholder: "məs. 5√41",
          solution: `t = √(2h/g) = ${k} s, vy = ${10 * k} m/s, vx = ${v0} m/s. v = √(${v0 * v0} + ${100 * k * k}) = ${eqr(N)} m/s.` };
      } },
    { id: "olimp", ad: "Olimpiada", izah: "Hazır nisbətlər: L = v₀²sin 2α/g (45°-də ən böyük), H/L = tg α/4, tamamlayıcı bucaqlarda L eynidir.",
      gen() {
        const kind = pick(["lmax", "lmax", "h45", "tg", "hor45", "dH"]);
        if (kind === "lmax") { const L0 = 2 * rnd(5, 60), a = pick([15, 75, 30, 60]), half = a === 15 || a === 75;
          const ans = half ? Q(L0, 2, 1) : Q(L0, 2, 3);
          return { text: `Daşı müəyyən sürətlə atanda ən böyük uçuş məsafəsi ${L0} m olur. Eyni sürətlə üfüqlə ${a}° bucaq altında atılan daş nə qədər uzağa düşər?`, answer: qv(ans), show: qs(ans), unit: "m", placeholder: "məs. 30√3",
            solution: `Ən böyük məsafə 45°-dədir: Lmax = v₀²/g = ${L0} m. L = Lmax·sin 2α = ${L0}·sin ${2 * a}° = ${L0}·${half ? "1/2" : "√3/2"} = ${qs(ans)} m.` }; }
        if (kind === "h45") { const L = 4 * rnd(2, 30);
          return { text: `Üfüqlə 45° bucaq altında atılan daş ${L} m uzağa düşdü. Daş ən çox hansı hündürlüyə qalxdı?`, answer: L / 4, show: String(L / 4), unit: "m", tol: 0.01,
            solution: `H/L = tg α/4. 45°-də tg α = 1 → H = L/4 = ${L / 4} m.` }; }
        if (kind === "tg") { const [p, q] = pick([[1, 1], [1, 2], [1, 4], [3, 4], [1, 3], [2, 3], [3, 8], [1, 8], [1, 6], [2, 1], [3, 1]]);
          return { text: `Bucaq altında atılan daşın maksimal qalxma hündürlüyü uçuş məsafəsinin ${p === q ? "özünə bərabərdir" : q === 1 ? "özündən " + p + " dəfə böyükdür" : p + "/" + q + " hissəsinə bərabərdir"}. Atılma bucağının tangensi tg α = ?`, answer: 4 * p / q, show: frac(4 * p, q), placeholder: "məs. 4/3",
            solution: `H = vy²/(2g), L = 2vx·vy/g → H/L = vy/(4vx) = tg α/4. tg α = 4·H/L = 4·${frac(p, q)} = ${frac(4 * p, q)}.` }; }
        if (kind === "hor45") { const hh = rnd(2, 60);
          return { text: `${hh} m hündürlükdən üfüqi atılan daş yerə üfüqlə 45° bucaq altında dəydi. Daş atılma nöqtəsinin altından nə qədər uzağa düşdü?`, answer: 2 * hh, show: String(2 * hh), unit: "m", tol: 0.01,
            solution: `45°-də vy = vx = v₀. Şaquli orta sürət vy/2 = v₀/2, ona görə h = (v₀/2)·t, L = v₀·t → L = 2h = ${2 * hh} m.` }; }
        const m = rnd(1, 6), v0 = 10 * m, d = 2.5 * m * m;
        return { text: `İki daş eyni ${v0} m/s sürətlə yerdən atıldı: biri üfüqlə 60°, digəri 30° bucaq altında. Onların maksimal qalxma hündürlüklərinin fərqi nə qədərdir?`, answer: d, show: D(d), unit: "m",
          solution: `H = v₀²·sin²α/(2g). H₆₀ = ${v0 * v0}·(3/4)/20 = ${D(3.75 * m * m)} m, H₃₀ = ${v0 * v0}·(1/4)/20 = ${D(1.25 * m * m)} m. Fərq: ${D(d)} m (nisbət isə həmişə 3).` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const m = rnd(1, 6), v0 = 10 * m, a = pick([30, 60]);
        const vx = a === 30 ? `${5 * m}√3` : `${5 * m}`, vy = a === 30 ? `${5 * m}` : `${5 * m}√3`;
        const T = a === 30 ? `${m}` : `${m === 1 ? "" : m}√3`, L = `${5 * m * m}√3`;
        const steps = [
          `vx = v₀·cos ${a}° = ${vx} m/s, vy = v₀·sin ${a}° = ${vy} m/s.`,
          `Uçuş vaxtı T = 2vy/g = ${T} s.`,
          `L = vx·T = ${L} m.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `vx = v₀·sin ${a}° = ${vy} m/s, vy = v₀·cos ${a}° = ${vx} m/s.`;
        if (bad === 1) steps[1] = pick([`Uçuş vaxtı T = vy/g = ${a === 30 ? D(m / 2) : qs(Q(5 * m, 10, 3))} s.`, `Uçuş vaxtı T = 2v₀/g = ${2 * m} s.`]);
        if (bad === 2) steps[2] = pick([`L = v₀·T = ${a === 30 ? 10 * m * m : 10 * m * m + "√3"} m.`, `L = vy·T = ${a === 30 ? 5 * m * m : 15 * m * m} m.`]);
        const text = h("div", {}, h("p", {}, `Daş yerdən ${v0} m/s sürətlə üfüqlə ${a}° bucaq altında atıldı. Uçuş məsafəsini tap (g = 10 m/s²).`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: bucaq üfüqlədir — üfüqi proyeksiya cos ilə, şaquli sin ilə: vx = ${vx}, vy = ${vy}.`,
          `2-ci addım: uçuş vaxtını yalnız şaquli hərəkət təyin edir və o, qalxma vaxtının iki mislidir: T = 2vy/g = ${T} s.`,
          `3-cü addım: üfüqi yol üfüqi sürətlə gedilir: L = vx·T = ${L} m.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a picture and several steps;
  // the wrong options are the answers of typical mistakes. Questions 5–8 also use an earlier topic (birlesik).
  const { ae, again, num } = Oyun;
  const nice = (x, d) => isFinite(x) && Math.abs(x * 10 ** d - Math.round(x * 10 ** d)) < 1e-6;
  const okN = (x, d = 2) => x > 0 && nice(x, d);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => num(x) + " " + u;
  const box = (w, hh, aria) => sv("svg", { viewBox: `0 0 ${w} ${hh}`, class: "oy-svg", role: "img", "aria-label": aria });
  const ln = (g, x1, y1, x2, y2, c, w, dash) => { const a = { x1: f1(x1), y1: f1(y1), x2: f1(x2), y2: f1(y2), stroke: c || "var(--ink)", "stroke-width": w || 1.5 }; if (dash) a["stroke-dasharray"] = dash; g.append(sv("line", a)); };
  const pth = (g, d, c, w, dash) => { const a = { d, fill: "none", stroke: c || "var(--muted)", "stroke-width": w || 2 }; if (dash) a["stroke-dasharray"] = dash; g.append(sv("path", a)); };
  const txt = (g, x, y, t, anchor, size) => { const a = { x: f1(x), y: f1(y), "text-anchor": anchor || "middle", class: "oy-lbl" }; if (size) a["font-size"] = size; g.append(sv("text", a, t)); };
  const rad = a => a * Math.PI / 180;
  const arc = (g, cx, cy, r, a0, a1) => pth(g, `M${f1(cx + r * Math.cos(rad(a0)))} ${f1(cy - r * Math.sin(rad(a0)))}A${r} ${r} 0 0 0 ${f1(cx + r * Math.cos(rad(a1)))} ${f1(cy - r * Math.sin(rad(a1)))}`, "var(--accent)", 2);
  // tower: horizontal throw, the landing velocity drawn
  function picTower() {
    const g = box(260, 215, "Qüllədən üfüqi atılan cisim; yerə dəyən anda sürət vektoru");
    g.append(sv("rect", { x: 10, y: 40, width: 46, height: 130, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 1.5 }));
    ln(g, 8, 170, 252, 170); pth(g, "M56 40Q136 40 206 170", "var(--muted)", 2, "5 4");
    arrow(g, 56, 40, 106, 40, "var(--vec)", 3); txt(g, 82, 30, "v₀");
    arrow(g, 206, 170, 228, 207, "var(--vec)", 3); txt(g, 242, 205, "v");
    txt(g, 70, 110, "h", "start");
    return g;
  }
  // two towers, the same flight distance L
  function picTwo(a, b) {
    const g = box(280, 190, "İki qüllədən üfüqi atılan daşlar eyni L məsafəsinə düşür"), y0 = 170, mx = Math.max(a, b);
    ln(g, 6, y0, 274, y0);
    [[a, 14, "1"], [b, 150, "2"]].forEach(([k, x, n]) => {
      const top = y0 - (30 + 110 * k * k / (mx * mx));
      g.append(sv("rect", { x, y: f1(top), width: 30, height: f1(y0 - top), fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 1.5 }));
      pth(g, `M${x + 30} ${f1(top)}Q${x + 65} ${f1(top)} ${x + 100} ${y0}`, "var(--muted)", 2, "5 4");
      arrow(g, x + 30, top, x + 62, top, "var(--vec)", 2.5); txt(g, x + 48, top - 8, "v" + (n === "1" ? "₁" : "₂"));
      txt(g, x + 15, y0 - 8, "h" + (n === "1" ? "₁" : "₂"));
      ln(g, x + 30, y0 + 8, x + 100, y0 + 8, "var(--accent)", 1.5); txt(g, x + 65, y0 + 20, "L", "middle", 12);
    });
    return g;
  }
  // vy(t) graph of a body thrown from the ground (it lands at t = 2n)
  function picVy(n) {
    const g = box(260, 200, "Sürətin şaquli proyeksiyasının zamandan asılılıq qrafiki"), X = t => 46 + t * 180 / (2 * n), Y = v => 100 - v * 70 / (10 * n);
    ln(g, 46, 188, 46, 12); ln(g, 46, 100, 248, 100);
    txt(g, 248, 92, "t, s", "end", 12); txt(g, 52, 16, "vy, m/s", "start", 12);
    for (let t = 1; t <= 2 * n; t++) { ln(g, X(t), Y(10 * n), X(t), Y(-10 * n), "var(--muted)", 0.6, "2 3"); txt(g, X(t), t <= n ? 114 : 94, String(t), "middle", 11); }
    ln(g, 46, Y(10 * n), X(2 * n), Y(10 * n), "var(--muted)", 0.6, "2 3"); ln(g, 46, Y(-10 * n), X(2 * n), Y(-10 * n), "var(--muted)", 0.6, "2 3");
    txt(g, 40, Y(10 * n) + 4, String(10 * n), "end", 11); txt(g, 40, Y(-10 * n) + 4, "−" + 10 * n, "end", 11);
    ln(g, X(0), Y(10 * n), X(2 * n), Y(-10 * n), "var(--accent)", 2.5);
    return g;
  }
  // plasticine ball hits a block on the table edge
  function picHit() {
    const g = box(260, 205, "Plastilin kürəcik masanın kənarındakı brusa dəyir, brus masadan uçur");
    g.append(sv("rect", { x: 10, y: 100, width: 110, height: 8, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 1.5 }));
    ln(g, 20, 108, 20, 180, "var(--ink)", 3); ln(g, 110, 108, 110, 180, "var(--ink)", 3); ln(g, 6, 180, 254, 180);
    g.append(sv("rect", { x: 96, y: 80, width: 24, height: 20, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 1.5 })); txt(g, 108, 74, "M", "middle", 12);
    g.append(sv("circle", { cx: 40, cy: 90, r: 6, fill: "var(--accent)" })); txt(g, 40, 76, "m", "middle", 12);
    arrow(g, 48, 90, 86, 90, "var(--vec)", 2.5); txt(g, 66, 82, "u", "middle", 12);
    pth(g, "M120 90Q170 90 220 180", "var(--muted)", 2, "5 4");
    ln(g, 130, 100, 130, 180, "var(--accent)", 1, "3 3"); txt(g, 138, 145, "h", "start");
    ln(g, 120, 192, 220, 192, "var(--accent)", 1.5); txt(g, 170, 203, "L", "middle", 12);
    return g;
  }
  // block slides on a rough platform, then flies off the edge
  function picSlide() {
    const g = box(260, 205, "Brus kələ-kötür platformada s yol gedir və kənardan uçur");
    g.append(sv("rect", { x: 10, y: 90, width: 140, height: 90, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 1.5 }));
    ln(g, 6, 180, 254, 180);
    g.append(sv("rect", { x: 14, y: 72, width: 24, height: 18, fill: "var(--paper)", stroke: "var(--ink)", "stroke-width": 1.5 }));
    arrow(g, 40, 81, 72, 81, "var(--vec)", 2.5); txt(g, 56, 72, "u", "middle", 12);
    ln(g, 26, 56, 150, 56, "var(--accent)", 1.5); ln(g, 26, 51, 26, 61, "var(--accent)"); ln(g, 150, 51, 150, 61, "var(--accent)"); txt(g, 88, 50, "s, μ", "middle", 12);
    pth(g, "M150 82Q190 82 232 180", "var(--muted)", 2, "5 4");
    txt(g, 140, 140, "h", "end");
    ln(g, 150, 192, 232, 192, "var(--accent)", 1.5); txt(g, 191, 203, "L", "middle", 12);
    return g;
  }
  // balcony: thrown upward at angle a from a height
  function picBalcony(a) {
    const g = box(260, 215, "Balkondan bucaq altında atılan daş; yerə dəyən anda sürət");
    g.append(sv("rect", { x: 10, y: 80, width: 44, height: 100, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 1.5 }));
    ln(g, 6, 180, 254, 180); ln(g, 54, 80, 100, 80, "var(--muted)", 1, "3 3");
    const cx = 54 + 70, cy = 80 - 70 * Math.tan(rad(Math.min(a, 60))) * 0.9;
    pth(g, `M54 80Q${f1(cx)} ${f1(cy)} 220 180`, "var(--muted)", 2, "5 4");
    arrow(g, 54, 80, 54 + 48 * Math.cos(rad(a)), 80 - 48 * Math.sin(rad(a)), "var(--vec)", 3); txt(g, 54 + 56 * Math.cos(rad(a)) + 8, 80 - 56 * Math.sin(rad(a)), "v₀");
    arc(g, 54, 80, 24, 0, a); txt(g, 54 + 36 * Math.cos(rad(a / 2)) + 4, 80 - 36 * Math.sin(rad(a / 2)) + 5, "α", "middle", 12);
    ln(g, 30, 80, 30, 180, "var(--accent)", 1, "3 3"); txt(g, 24, 135, "h", "end");
    const dx = 220 - cx, dy = 180 - cy, L = Math.hypot(dx, dy);
    arrow(g, 220, 180, 220 + 30 * dx / L, 180 + 30 * dy / L, "var(--vec)", 3); txt(g, 220 + 30 * dx / L + 10, 180 + 30 * dy / L, "v", "start");
    return g;
  }
  // two throws with the same speed at different angles from the same point
  function picTwoAngles(a1, a2) {
    const g = box(260, 190, "Eyni sürətlə iki müxtəlif bucaq altında atılan daşların trayektoriyaları"), x0 = 24, y0 = 170;
    ln(g, 8, y0, 252, y0);
    [[a1, "var(--accent)", a1 + "°", 48], [a2, "var(--vec)", a2 + "°", 76]].forEach(([a, c, t, lr]) => {
      const L = 220 * Math.sin(rad(2 * a)), H = 110 * Math.sin(rad(a)) ** 2;
      pth(g, `M${x0} ${y0}Q${f1(x0 + L / 2)} ${f1(y0 - 2 * H)} ${f1(x0 + L)} ${y0}`, c, 2, "5 4");
      arrow(g, x0, y0, x0 + 40 * Math.cos(rad(a)), y0 - 40 * Math.sin(rad(a)), c, 2.5);
      txt(g, x0 + lr * Math.cos(rad(a)) + 12, y0 - lr * Math.sin(rad(a)) + 4, t, "middle", 12);
    });
    return g;
  }
  // stone thrown horizontally from the top of a slope (tg α = p/q)
  function picSlope(tg) {
    const g = box(260, 200, "Maili səthin yuxarısından üfüqi atılan daş səthə düşür"), x0 = 30, y0 = tg < 1 ? 30 : 20;
    const dx = tg < 1 ? 200 : 120, dy = dx * tg, x1 = x0 + dx, y1 = y0 + dy;
    g.append(sv("polygon", { points: `${x0},${y0} ${f1(x1)},${f1(y1)} ${x0},${f1(y1)}`, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 1.5 }));
    const px = x0 + 0.85 * dx, py = y0 + 0.85 * dy;
    pth(g, `M${x0} ${y0 - 4}Q${f1(x0 + 0.425 * dx)} ${y0 - 4} ${f1(px)} ${f1(py)}`, "var(--muted)", 2, "5 4");
    arrow(g, x0, y0 - 4, x0 + 44, y0 - 4, "var(--vec)", 3); txt(g, x0 + 24, y0 - 12, "v₀");
    g.append(sv("circle", { cx: f1(px), cy: f1(py), r: 3.5, fill: "var(--accent)" }));
    const ang = Math.atan(tg) * 180 / Math.PI;
    arc(g, x1, y1, 26, 180 - ang, 180); txt(g, x1 - 40, y1 - 6, "α", "middle", 12);
    txt(g, x0 + 0.45 * dx + 14, y0 + 0.45 * dy - 8, "s", "start");
    return g;
  }

  const TOWER = [[24, 1], [15, 2], [21, 2], [40, 3], [16, 3], [30, 4], [9, 4], [42, 4], [25, 6], [45, 6], [11, 6]]; // v0, t: v0² + (10t)² is a square
  const VYG = [[1, 24], [2, 15], [2, 21], [3, 40], [3, 16], [4, 30], [4, 9], [4, 42]]; // n, vx: vx² + (10n)² is a square
  const ENE = [[6, 8], [8, 6], [9, 12], [12, 9], [12, 16], [16, 12], [15, 20], [20, 15], [5, 12], [12, 5], [10, 24], [24, 10], [8, 15], [15, 8], [20, 21], [21, 20], [18, 24], [24, 18], [7, 24], [24, 7]]; // v0, √(2gh)
  const TT = [[0.8, 0.4], [1.25, 0.5], [0.45, 0.3], [1.8, 0.6], [0.2, 0.2]]; // h, t = √(2h/g)
  const sin37 = () => { const s = pick([0.6, 0.8]); return { s, c: s === 0.6 ? 0.8 : 0.6, give: pick([`sin α = ${num(s)}`, `cos α = ${num(s === 0.6 ? 0.8 : 0.6)}`]) }; };

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. horizontal throw: launch and landing speeds known → height
    { tip: "qapali", gen: () => again(() => {
      const [v0, t] = pick(TOWER), vy = 10 * t, v = Math.round(Math.hypot(v0, vy)), hh = 5 * t * t;
      const w = [v * v / 20, (v - v0) * (v - v0) / 20, vy * vy / 10, v0 * t]; if (![hh, ...w].every(x => okN(x))) return null;
      return mc(ae(hh, w, U_("m")), { svg: picTower(), text: `Daş qüllədən v₀ = ${v0} m/s sürətlə üfüqi atıldı və yerə v = ${v} m/s sürətlə dəydi. Qüllənin hündürlüyü h nə qədərdir? (g = 10 m/s², hava müqaviməti nəzərə alınmır.)`,
        solution: `Üfüqi proyeksiya dəyişmir: vx = ${v0} m/s. Şaquli: vy = √(v² − v₀²) = √(${v * v} − ${v0 * v0}) = ${vy} m/s. h = vy²/(2g) = ${vy * vy}/20 = ${num(hh)} m (t = vy/g = ${t} s). Tələlər: h = v²/(2g) — tam sürəti şaquli saymaq (${num(w[0])} m); modulları çıxmaq v − v₀ (${num(w[1])} m); 2-ni unutmaq vy²/g (${num(w[2])} m); L = v₀t-ni cavab yazmaq (${num(w[3])} m).` });
    }) },
    // 2. two towers, the same distance → ratio of speeds
    { tip: "qapali", gen: () => again(() => {
      const a = rnd(1, 6), b = rnd(1, 6); if (a === b) return null;
      const right = frac(b, a), w = [frac(b * b, a * a), frac(a, b), frac(a * a, b * b), "1"];
      return mc(ae(right, w, x => x), { svg: picTwo(a, b), text: `İki daş h₁ = ${5 * a * a} m və h₂ = ${5 * b * b} m hündürlükdəki qüllələrdən üfüqi atıldı və hər biri öz qülləsinin dibindən eyni L məsafəsinə düşdü. Başlanğıc sürətlərin nisbəti v₁/v₂ nəyə bərabərdir? (Hava müqaviməti nəzərə alınmır.)`,
        solution: `Düşmə vaxtı t = √(2h/g): t₁ = √(${10 * a * a}/10) = ${a} s, t₂ = ${b} s. L = v₁t₁ = v₂t₂ → v₁/v₂ = t₂/t₁ = ${right}. Tələlər: hündürlüklərin nisbəti (${w[0]}) — vaxt kök altındadır; nisbəti tərsinə yazmaq (${w[1]}); "eyni L → eyni sürət" (1).` });
    }) },
    // 3. angled throw from the ground → flight distance
    { tip: "qapali", gen: () => again(() => {
      const { s, c, give } = sin37(), k = rnd(2, 8), v0 = 5 * k, vx = v0 * c, vy = v0 * s, T = 2 * vy / 10, L = vx * T;
      const w = [v0 * T, vx * vy / 10, vy * T, v0 * v0 / 10]; if (![L, ...w].every(x => okN(x))) return null;
      return mc(ae(L, w, U_("m")), { svg: angPic(s === 0.6 ? 37 : 53, "α"), text: `Daş yerdən v₀ = ${v0} m/s sürətlə üfüqlə α bucağı altında atıldı (${give}). Daş atıldığı nöqtədən nə qədər uzağa düşər? (g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `${give.startsWith("sin") ? `cos α = ${num(c)}` : `sin α = ${num(s)}`}. vx = ${v0}·${num(c)} = ${num(vx)} m/s, vy = ${v0}·${num(s)} = ${num(vy)} m/s. T = 2vy/g = ${num(T)} s. L = vx·T = ${num(vx)}·${num(T)} = ${num(L)} m. Tələlər: L = v₀·T (${num(w[0])} m); T əvəzinə qalxma vaxtı vy/g (${num(w[1])} m); vx əvəzinə vy (${num(w[2])} m); 45° düsturu L = v₀²/g (${num(w[3])} m).` });
    }) },
    // 4. vy(t) graph + vx → flight distance
    { tip: "qapali", gen: () => again(() => {
      const [n, vx] = pick(VYG), vy0 = 10 * n, v0 = Math.round(Math.hypot(vx, vy0)), L = vx * 2 * n;
      const w = [vx * n, v0 * 2 * n, vy0 * 2 * n, 5 * n * n];
      return mc(ae(L, w, U_("m")), { svg: picVy(n), text: `Qrafikdə yerdən bucaq altında atılıb yenə yerə düşən cismin sürətinin şaquli proyeksiyasının (vy) zamandan asılılığı verilib. Sürətin üfüqi proyeksiyası vx = ${vx} m/s. Cismin uçuş məsafəsi nə qədərdir? (Hava müqaviməti yoxdur.)`,
        solution: `Qrafikdən: v₀y = ${vy0} m/s, cisim t = ${2 * n} s-də yerə düşür (vy = −${vy0}). Üfüqi hərəkət bərabərsürətlidir: L = vx·T = ${vx}·${2 * n} = ${L} m. Tələlər: qalxma vaxtını (${n} s) götürmək (${num(w[0])} m); v₀ = √(vx² + v₀y²) = ${v0} m/s ilə vurmaq (${num(w[1])} m); vy ilə vurmaq (${num(w[2])} m); qrafikin altındakı üçbucağın sahəsi — bu, H-dır (${num(w[3])} m).` });
    }) },
    // 5. inelastic hit (momentum), then horizontal throw from the table
    { tip: "qapali", birlesik: "fiz-impuls", gen: () => again(() => {
      const [a, b] = pick([[1, 3], [1, 8], [4, 5], [1, 15], [9, 16], [4, 21], [1, 24], [9, 7], [16, 9]]), sc = pick([10, 20, 50, 100]), m = a * sc, M = b * sc;
      const V = pick([1, 1.5, 2, 2.5, 3, 4, 5]), u = V * (a + b) / a, Ve = V * Math.sqrt((a + b) / a), [hh, t] = pick(TT);
      if (!nice(u, 1) || u > 120 || m > 1000 || M > 2000) return null;
      const L = V * t, w = [u * t, u * a / b * t, V * 2 * hh / 10, Ve * t]; if (![L, ...w].every(x => okN(x, 3))) return null;
      return mc(ae(L, w, U_("m")), { svg: picHit(), text: `Kütləsi m = ${m} q olan plastilin kürəcik u = ${num(u)} m/s sürətlə üfüqi uçaraq hündürlüyü h = ${num(hh)} m olan masanın lap kənarında duran M = ${M} q kütləli brusa dəyir və ona yapışır. Brus kürəciklə birlikdə masadan üfüqi uçur. Brus döşəmədə masanın kənarından üfüqi istiqamətdə nə qədər məsafəyə düşər? (Kürəcik və brus maddi nöqtə sayılır, toqquşma ani baş verir, hava müqaviməti yoxdur, g = 10 m/s².)`,
        solution: `İmpulsun saxlanması (qeyri-elastik zərbə): m·u = (m + M)·V → V = ${m}·${num(u)}/${m + M} = ${num(V)} m/s. Düşmə vaxtı t = √(2h/g) = √(${num(2 * hh)}/10) = ${num(t)} s. L = V·t = ${num(V)}·${num(t)} = ${num(L)} m. Tələlər: zərbəni unutmaq, u ilə hesablamaq (${num(w[0])} m); m·u = M·V — kürəciyin kütləsini unutmaq (${num(w[1])} m); kökü unutmaq t = 2h/g (${num(w[2])} m); zərbədə kinetik enerjini saxlamaq (${num(w[3])} m) — yapışma zamanı kinetik enerji saxlanmır (bir hissəsi istiliyə keçir).` });
    }) },
    // 6. sliding with friction, then off the edge
    { tip: "qapali", birlesik: "fiz-surtunme-maili", gen: () => again(() => {
      const [p, q, r] = pick([[7, 1, 5], [17, 7, 13]]), k = pick([0.5, 1, 1.5, 2]), u = p * k, v = q * k, vf = r * k, mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
      const s = (u * u - v * v) / (20 * mu), [hh, t] = pick(TT); if (!nice(s, 2) || s > 30 || s < 1) return null;
      const L = v * t, w = [u * t, (u + v) / 2 * t, v * 2 * hh / 10, vf * t]; if (![L, ...w].every(x => okN(x, 3))) return null;
      return mc(ae(L, w, U_("m")), { svg: picSlide(), text: `Brus h = ${num(hh)} m hündürlükdəki üfüqi platformanın üzərində u = ${num(u)} m/s sürətlə sürüşməyə başlayır, s = ${num(s)} m yol gedib platformanın kənarından düşür. Brusla platforma arasında sürtünmə əmsalı μ = ${num(mu)}. Brus platformanın kənarından üfüqi istiqamətdə nə qədər uzağa düşər? (Brusun ölçüləri və hava müqaviməti nəzərə alınmır, g = 10 m/s².)`,
        solution: `Sürtünmə təcili a = μg = ${num(10 * mu)} m/s². Kənarda: v² = u² − 2μgs = ${num(u * u)} − ${num(20 * mu * s)} = ${num(v * v)} → v = ${num(v)} m/s. t = √(2h/g) = ${num(t)} s. L = v·t = ${num(L)} m. Tələlər: sürtünməni unutmaq (${num(w[0])} m); platformadakı orta sürəti (u + v)/2 götürmək (${num(w[1])} m); kökü unutmaq t = 2h/g (${num(w[2])} m); v² = u² − μgs — 2-ni unutmaq (v = ${num(vf)} m/s, ${num(w[3])} m).` });
    }) },
    // 7. energy: landing speed from a balcony does not depend on the angle
    { tip: "qapali", birlesik: "fiz-enerji-saxlanma", gen: () => again(() => {
      const [v0, wv] = pick(ENE), v = Math.round(Math.hypot(v0, wv)), hh = wv * wv / 20, a = pick([30, 45, 60]);
      const w = [wv, v0 + wv, v0, Math.abs(v0 - wv)]; if (![v, ...w].every(x => okN(x))) return null;
      return mc(ae(v, w, U_("m/s")), { svg: picBalcony(a), text: `Daş h = ${num(hh)} m hündürlükdəki balkondan v₀ = ${v0} m/s sürətlə üfüqlə ${a}° bucaq altında yuxarı atıldı. Daş yerə hansı sürətlə dəyər? (Hava müqaviməti yoxdur, g = 10 m/s².)`,
        solution: `Mexaniki enerji saxlanır: mv₀²/2 + mgh = mv²/2 → v = √(v₀² + 2gh) = √(${v0 * v0} + ${num(20 * hh)}) = ${v} m/s. Bucaq lazım deyil — cavab ondan asılı deyil. Tələlər: v₀-ı unutmaq √(2gh) (${num(w[0])} m/s); sürətlərin modullarını toplamaq (${num(w[1])} m/s); "yerə atıldığı sürətlə qayıdır" — bu yalnız eyni səviyyədə doğrudur (${num(w[2])} m/s); modulları çıxmaq (${num(w[3])} m/s).` });
    }) },
    // 8. curvature radius at the top of the trajectory (a = v²/R)
    { tip: "qapali", birlesik: "fiz-cevre-herekat", gen: () => again(() => {
      const { s, c, give } = sin37(), k = rnd(2, 8), v0 = 5 * k, vx = v0 * c, vy = v0 * s, R = vx * vx / 10;
      const w = [v0 * v0 / 10, vy * vy / 10, vx * vx / 20, vy * vy / 20]; if (![R, ...w].every(x => okN(x))) return null;
      const g = angPic(s === 0.6 ? 37 : 53, "α"), Hp = Math.min(125, 212 * Math.tan(rad(s === 0.6 ? 37 : 53)) / 4), rr = 28;
      g.append(sv("circle", { cx: 130, cy: f1(160 - Hp + rr), r: rr, fill: "none", stroke: "var(--vec)", "stroke-width": 1.2, "stroke-dasharray": "3 3" }));
      ln(g, 130, 160 - Hp + rr, 130, 160 - Hp, "var(--vec)", 1.2); txt(g, 130 - rr - 6, 160 - Hp + rr / 2 + 4, "R", "end");
      return mc(ae(R, w, U_("m")), { svg: g, text: `Daş yerdən v₀ = ${v0} m/s sürətlə üfüqlə α bucağı altında atıldı (${give}). Trayektoriyanın ən yüksək nöqtəsində əyrilik radiusu R nə qədərdir? (g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `Ən yüksək nöqtədə sürət üfüqidir: v = vx = ${v0}·${num(c)} = ${num(vx)} m/s, təcil g isə ona perpendikulyardır — mərkəzəqaçma təcilidir: g = v²/R. R = vx²/g = ${num(vx * vx)}/10 = ${num(R)} m. Tələlər: v₀ ilə hesablamaq (${num(w[0])} m); sin və cos-u qarışdırmaq (${num(w[1])} m); 2g-yə bölmək (${num(w[2])} m); ən yüksək nöqtənin hündürlüyü H-ı yazmaq (${num(w[3])} m).` });
    }) },
    // 9. the same speed, another angle: L = v0²·sin 2α/g
    { tip: "qapali", gen: () => again(() => {
      const a1 = pick([15, 75]), L = 5 * rnd(2, 16), a2 = pick([45, 30, 60]);
      const sv2 = { 90: "1", 30: "1/2", 150: "1/2", 60: "√3/2", 120: "√3/2" }[2 * a2];
      const right = a2 === 45 ? num(2 * L) + " m" : num(L) + "√3 m";
      const forgot = a2 === 45 ? num(L) + " m" : num(L / 2) + "√3 m"; // L taken as v0²/g
      const cand = [num(L * a2 / a1) + " m", forgot, num(L) + " m", num(2 * L) + " m", num(L) + "√3 m", num(L / 2) + " m"].filter(x => x !== right).filter((x, i, A) => A.indexOf(x) === i).slice(0, 4);
      return mc(ae(right, cand, x => x), { svg: picTwoAngles(a1, a2), text: `Daş yerdən üfüqlə ${a1}° bucaq altında atılanda ${L} m uzağa düşür. Eyni sürətlə üfüqlə ${a2}° bucaq altında atılsa, nə qədər uzağa düşər? (Daş atıldığı səviyyəyə düşür, hava müqaviməti yoxdur.)`,
        solution: `L = v₀²·sin 2α/g. ${a1}°-də sin ${2 * a1}° = 1/2 → v₀²/g = 2·${L} = ${2 * L} m. ${a2}°-də sin ${2 * a2}° = ${sv2} → L₂ = ${2 * L}·${sv2} = ${right}. Tələlər: məsafəni bucağa mütənasib saymaq (${num(L * a2 / a1)} m); ${L} m-i v₀²/g sanmaq — ${a1}°-dəki sin ${2 * a1}° = 1/2-ni unutmaq (${L}·${sv2} = ${forgot}).` });
    }) },
    // 10. horizontal throw from the top of a slope, landing on the slope
    { tip: "qapali", gen: () => again(() => {
      const tg = pick([0.75, 4 / 3]), cs = tg < 1 ? 0.8 : 0.6, sn = tg < 1 ? 0.6 : 0.8, v0 = tg < 1 ? pick([4, 6, 8, 10, 12, 14, 16, 20]) : pick([3, 6, 9, 12, 15]);
      const t = 2 * v0 * tg / 10, x = v0 * t, y = 5 * t * t, s = x / cs;
      const w = [x, s / 2, y, x / sn]; if (![s, t, ...w].every(z => okN(z))) return null;
      return mc(ae(s, w, U_("m")), { svg: picSlope(tg), text: `Üfüqlə α bucağı əmələ gətirən maili səthin (tg α = ${tg < 1 ? "3/4" : "4/3"}) yuxarı nöqtəsindən daş v₀ = ${v0} m/s sürətlə üfüqi atıldı və həmin maili səthə düşdü. Atılma və düşmə nöqtələri arasındakı məsafə s nə qədərdir? (g = 10 m/s², hava müqaviməti yoxdur.)`,
        solution: `Düşmə nöqtəsində y/x = tg α: (gt²/2)/(v₀t) = tg α → t = 2v₀·tg α/g = ${num(t)} s. x = v₀t = ${num(x)} m, y = gt²/2 = ${num(y)} m. s = x/cos α = ${num(x)}/${num(cs)} = ${num(s)} m (yoxla: √(x² + y²)). Tələlər: üfüqi məsafə x-i cavab yazmaq (${num(w[0])} m); 2-ni unutmaq t = v₀tg α/g (${num(w[1])} m); şaquli düşmə y (${num(w[2])} m); cos əvəzinə sin-ə bölmək (${num(w[3])} m).` });
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
      key: "fiz-atilan-cisim", title: "Üfüqi və bucaq altında atılan cisim", fenn: "fizika", link: "dersler/fiz-atilan-cisim.html",
      format: "Cavab ədəddir (vahid xanada yazılıb): 20, 2,4, 5√3, 4/3. Hər yerdə g = 10 m/s², hava müqaviməti yoxdur.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ufuqi", "ufuqi", "ufuqi-v", "bucaq", "bucaq", "bucaq", "noqte", "noqte", "hesab", "olimp"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-atilan-cisim.html")) b.push("dersler/fiz-atilan-cisim.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
