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
    { id: "ufuqi-v", ad: "Üfüqi atılma: sürət", izah: "vx = v₀ dəyişmir, vy = g·t artır. Sürət: v = √(vx² + vy²); üfüqlə bucaq: tg β = vy/vx.",
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
    { id: "bucaq", ad: "Bucaq altında: T, H, L", izah: "Əvvəl v₀-ı parçala: vx = v₀cos α, vy = v₀sin α. Sonra: qalxma vaxtı vy/g, uçuş T = 2vy/g, H = vy²/(2g), L = vx·T.",
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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-atilan-cisim", title: "Üfüqi və bucaq altında atılan cisim", fenn: "fizika", link: "dersler/fiz-atilan-cisim.html",
      format: "Cavab ədəddir (vahid xanada yazılıb): 20, 2,4, 5√3, 4/3. Hər yerdə g = 10 m/s², hava müqaviməti yoxdur.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ufuqi", "ufuqi", "ufuqi-v", "bucaq", "bucaq", "bucaq", "noqte", "noqte", "hesab", "olimp"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-atilan-cisim.html")) b.push("dersler/fiz-atilan-cisim.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
