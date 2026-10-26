// Mexaniki iş və güc (RFO fizika, 8–9-cu sinif) — game levels: work A = F·s·cos α, work of gravity and friction, work from an F(s) graph, power, efficiency of motors and pumps, find-the-error, real life.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. g = 10 m/s².
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nice = (x, k = 10) => Math.abs(x * k - Math.round(x * k)) < 1e-9;
  const D = x => { const r = Math.round(x * 1000) / 1000; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };

  // F(s) graph: broken line through pts [[s, F], ...] starting at s = 0; the area under it is shaded.
  function graph(pts) {
    const W = 300, H = 190, x0 = 44, y0 = 160, w = 236, hh = 130;
    const smax = pts[pts.length - 1][0], fmax = Math.max(...pts.map(p => p[1]));
    const X = s => x0 + s / smax * w, Y = f => y0 - f / fmax * hh * 0.9;
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Qüvvənin yoldan asılılıq qrafiki" });
    g.append(sv("path", { d: `M${X(0)} ${y0}` + pts.map(p => `L${X(p[0])} ${Y(p[1])}`).join("") + `L${X(smax)} ${y0}Z`, fill: "var(--accent-soft)", stroke: "none" }));
    g.append(sv("line", { x1: x0, y1: y0, x2: x0 + w + 8, y2: y0, stroke: "var(--ink)", "stroke-width": 1.5 }));
    g.append(sv("line", { x1: x0, y1: y0, x2: x0, y2: y0 - hh - 8, stroke: "var(--ink)", "stroke-width": 1.5 }));
    g.append(sv("text", { x: x0 + w - 6, y: y0 + 26, class: "oy-lbl" }, "s, m"));
    g.append(sv("text", { x: 4, y: y0 - hh - 2, class: "oy-lbl" }, "F, N"));
    const fs = new Set(), ss = new Set();
    for (const [s, f] of pts) {
      if (f > 0 && !fs.has(f)) { fs.add(f); g.append(sv("line", { x1: x0, y1: Y(f), x2: X(s), y2: Y(f), stroke: "var(--muted)", "stroke-dasharray": "3 3" })); g.append(sv("text", { x: x0 - 4, y: Y(f) + 4, "text-anchor": "end" }, D(f))); }
      if (s > 0 && !ss.has(s)) { ss.add(s); g.append(sv("line", { x1: X(s), y1: y0, x2: X(s), y2: Y(f), stroke: "var(--muted)", "stroke-dasharray": "3 3" })); g.append(sv("text", { x: X(s), y: y0 + 14, "text-anchor": "middle" }, D(s))); }
    }
    g.append(sv("polyline", { points: pts.map(p => X(p[0]) + "," + Y(p[1])).join(" "), fill: "none", stroke: "var(--vec)", "stroke-width": 2.5 }));
    g.append(sv("text", { x: x0 - 4, y: y0 + 14, "text-anchor": "end" }, "0"));
    return g;
  }

  // k·cos α as a finished number: 30° → k√3/2, 45° → k√2/2
  function kcos(k, a) {
    if (a === 0) return [k, String(k)]; if (a === 90) return [0, "0"]; if (a === 180) return [-k, D(-k)];
    if (a === 60) return [k / 2, D(k / 2)]; if (a === 120) return [-k / 2, D(-k / 2)];
    const r = a === 30 ? 3 : 2, v = k * Math.sqrt(r) / 2;
    return [v, k % 2 === 0 ? (k / 2 === 1 ? "" : k / 2) + "√" + r : k + "√" + r + "/2"];
  }
  const COS = { 0: "1", 30: "√3/2", 45: "√2/2", 60: "1/2", 90: "0", 120: "−1/2", 180: "−1" };

  const levels = [
    { id: "is", ad: "Mexaniki iş", izah: "A = F·s·cos α, α — qüvvə ilə yerdəyişmə arasındakı bucaq. α = 90° olanda iş sıfırdır, α > 90° olanda mənfidir.",
      gen() {
        const kind = pick(["ip", "ip", "ip", "tərs", "sıfır", "əks"]);
        if (kind === "tərs") {
          const a = pick([0, 60]), F = 10 * rnd(1, 30), s = rnd(2, 25), A = F * s * (a ? 0.5 : 1);
          return { text: `Qutunu ${a ? "üfüqlə 60° bucaq əmələ gətirən" : "üfüqi"} iplə ${F} N qüvvə ilə çəkirlər. Bu qüvvə ${D(A)} J iş gördü. Qutu üfüqi səth üzrə nə qədər yol getdi?`,
            answer: s, show: String(s), unit: "m", tol: 0.01,
            solution: `A = F·s·cos α → s = A/(F·cos α) = ${D(A)}/(${F}·${COS[a]}) = ${s} m.` };
        }
        if (kind === "sıfır") {
          const m = rnd(2, 15), s = rnd(5, 200);
          const ctx = pick([[`Elvin kütləsi ${m} kq olan çantanı əlində tutaraq üfüqi dəhlizdə ${s} m bərabər sürətlə getdi. Əlin çantaya təsir qüvvəsinin gördüyü iş nədir?`, "Əl çantanı yuxarı saxlayır (qüvvə şaquli), çanta isə üfüqi gedir: α = 90°, cos 90° = 0. İş 0-dır. Yorulmaq iş demək deyil!"],
            [`Kütləsi ${m} kq olan top üfüqi döşəmədə ${s} m diyirləndi. Ağırlıq qüvvəsinin işi nədir?`, "Ağırlıq qüvvəsi şaquli aşağı, yerdəyişmə üfüqidir: α = 90°, iş 0-dır."],
            [`Qatar üfüqi relslərdə ${s} m getdi; vaqonların kütləsi ${m} ton. Relslərin normal reaksiya qüvvəsinin işi nədir?`, "Normal reaksiya qüvvəsi səthə perpendikulyardır, yerdəyişmə isə səth boyunca: α = 90°, iş 0-dır."]]);
          return { text: ctx[0], answer: 0, show: "0", unit: "J", tol: 0.01, solution: ctx[1] };
        }
        if (kind === "əks") {
          const F = 5 * rnd(1, 40), s = rnd(2, 30);
          return { text: `Xizəkçi üfüqi qarda ${s} m sürüşdü. Ona ${F} N sürtünmə qüvvəsi təsir edir. Sürtünmə qüvvəsinin işi nədir?`,
            answer: -F * s, show: D(-F * s), unit: "J", tol: 0.01,
            solution: `Sürtünmə hərəkətin əksinə yönəlib: α = 180°, cos 180° = −1. A = −F·s = −${F}·${s} = ${D(-F * s)} J.` };
        }
        const a = pick([0, 30, 45, 60, 60, 120]), F = 10 * rnd(1, 20), s = rnd(2, 20), [A, show] = kcos(F * s, a);
        const obj = pick(["Kirşəni", "Qutunu", "Çamadanı", "Uşaq arabasını"]);
        const text = a === 120
          ? `${obj} ${F} N qüvvə ilə itələyirlər, qüvvə hərəkət istiqaməti ilə 120° bucaq əmələ gətirir (cisim başqa qüvvələrin təsiri ilə hərəkət edir). Cisim ${s} m yerini dəyişdi. Bu qüvvənin işi nədir?`
          : `${obj} üfüqlə ${a}° bucaq əmələ gətirən iplə ${F} N qüvvə ilə çəkirlər. Cisim üfüqi səth üzrə ${s} m yol getdi. İpin dartı qüvvəsinin işi nədir?`;
        return { text, answer: A, show, unit: "J", placeholder: "məs. 50√3",
          solution: `A = F·s·cos α = ${F}·${s}·cos ${a}° = ${F * s}·${COS[a]} = ${show} J.` + (a === 30 || a === 45 ? ` (Təqribən ${D(Math.round(A * 10) / 10)} J.)` : "") };
      } },
    { id: "agirliq", ad: "Ağırlıq və sürtünmənin işi", izah: "Ağırlıq qüvvəsinin işi yalnız hündürlüklər fərqindən asılıdır: A = mg(h₁ − h₂). Sürtünmənin işi mənfidir: A = −F_s·s.",
      gen() {
        const kind = pick(["mərtəbə", "yol", "sürtünmə", "maili", "mailiAğ"]);
        if (kind === "mərtəbə") {
          const m = rnd(35, 80), n = rnd(2, 12), up = Math.random() < .6, A = (up ? -1 : 1) * m * 10 * 3 * (n - 1);
          return { text: `Kütləsi ${m} kq olan Elvin ${up ? `1-ci mərtəbədən ${n}-ci mərtəbəyə pilləkənlə qalxdı` : `${n}-ci mərtəbədən 1-ci mərtəbəyə liftlə endi`}. Mərtəbələr arası hündürlük 3 m. Ağırlıq qüvvəsinin işi nədir?`,
            answer: A, show: D(A), unit: "J", tol: 0.01,
            solution: `Hündürlük fərqi: ${n - 1}·3 = ${3 * (n - 1)} m. ${up ? "Qalxanda ağırlıq qüvvəsi hərəkətin əksinədir — iş mənfidir" : "Enəndə ağırlıq qüvvəsi hərəkət istiqamətindədir — iş müsbətdir"}: A = ${up ? "−" : ""}mgh = ${up ? "−" : ""}${m}·10·${3 * (n - 1)} = ${D(A)} J. Pilləkən və ya lift — fərqi yoxdur.` };
        }
        if (kind === "yol") {
          const m = pick([0.2, 0.5, 1, 2, 3, 5]), h1 = rnd(5, 40), h2 = rnd(0, h1 - 2), L = rnd(h1 + 5, 120), A = m * 10 * (h1 - h2);
          return { text: `Kütləsi ${D(m)} kq olan daş ${h1} m hündürlükdən əyri trayektoriya üzrə uçaraq ${h2 ? h2 + " m hündürlükdəki dama" : "yerə"} düşdü. Trayektoriyanın uzunluğu ${L} m. Ağırlıq qüvvəsinin işi nədir?`,
            answer: A, show: D(A), unit: "J",
            solution: `Ağırlıq qüvvəsinin işi trayektoriyadan asılı deyil (${L} m lazım deyil): A = mg(h₁ − h₂) = ${D(m)}·10·(${h1} − ${h2}) = ${D(A)} J.` };
        }
        if (kind === "sürtünmə") {
          const m = rnd(2, 60), mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]), s = rnd(2, 30), A = -mu * m * 10 * s;
          return { text: `Kütləsi ${m} kq olan qutu üfüqi döşəmə ilə ${s} m sürüşdürüldü. Sürtünmə əmsalı ${D(mu)}. Sürtünmə qüvvəsinin işi nədir?`,
            answer: A, show: D(A), unit: "J",
            solution: `F_s = μmg = ${D(mu)}·${m}·10 = ${D(mu * m * 10)} N. Hərəkətin əksinədir: A = −F_s·s = −${D(mu * m * 10)}·${s} = ${D(A)} J.` };
        }
        // incline with sin α = 0.6, cos α = 0.8 (3-4-5 triangle)
        const m = rnd(2, 40), l = 5 * rnd(1, 8), mu = pick([0.1, 0.2, 0.25, 0.3, 0.5]);
        if (kind === "maili") {
          const A = -mu * m * 10 * 0.8 * l;
          return { text: `Kütləsi ${m} kq olan kirşə uzunluğu ${l} m olan təpədən sürüşüb endi. Təpənin maillik bucağı üçün sin α = 0,6, cos α = 0,8. Sürtünmə əmsalı ${D(mu)}. Sürtünmə qüvvəsinin işi nədir?`,
            answer: A, show: D(A), unit: "J",
            solution: `Maili müstəvidə N = mg·cos α = ${m * 10}·0,8 = ${D(m * 8)} N, F_s = μN = ${D(mu * m * 8)} N. A = −F_s·l = −${D(mu * m * 8)}·${l} = ${D(A)} J.` };
        }
        const A = m * 10 * 0.6 * l;
        return { text: `Kütləsi ${m} kq olan kirşə uzunluğu ${l} m olan təpədən sürüşüb endi. Təpənin maillik bucağı üçün sin α = 0,6. Ağırlıq qüvvəsinin işi nədir?`,
          answer: A, show: D(A), unit: "J",
          solution: `Hündürlük h = l·sin α = ${l}·0,6 = ${D(0.6 * l)} m. A = mgh = ${m}·10·${D(0.6 * l)} = ${D(A)} J.` };
      } },
    { id: "qrafik", ad: "Qrafikdən iş", izah: "Qüvvə dəyişirsə, iş F(s) qrafikinin altındakı sahədir: düzbucaqlılar, üçbucaqlar, trapesiyalar.",
      gen() {
        const kind = pick(["trap", "uc", "pille", "uc3"]);
        let pts;
        if (kind === "trap") { const F0 = 10 * rnd(0, 5), F1 = F0 + 10 * rnd(1, 6), s1 = rnd(1, 6), s2 = s1 + rnd(1, 6); pts = [[0, F0], [s1, F1], [s2, F1]]; }
        else if (kind === "uc") { const F = 10 * rnd(1, 10), s1 = rnd(1, 8); pts = [[0, 0], [s1, F]]; }
        else if (kind === "pille") { const F1 = 10 * rnd(1, 8); let F2; do F2 = 10 * rnd(1, 8); while (F2 === F1); const s1 = rnd(1, 5), s2 = s1 + rnd(1, 5); pts = [[0, F1], [s1, F1], [s1, F2], [s2, F2]]; }
        else { const F = 10 * rnd(1, 8), s1 = rnd(1, 4), s2 = s1 + rnd(1, 5), s3 = s2 + rnd(1, 4); pts = [[0, 0], [s1, F], [s2, F], [s3, 0]]; }
        let A = 0; const parts = [];
        for (let i = 1; i < pts.length; i++) { const [sa, fa] = pts[i - 1], [sb, fb] = pts[i]; if (sb === sa) continue; const a = (fa + fb) / 2 * (sb - sa); A += a;
          parts.push(fa === fb ? `${D(sa)}–${D(sb)} m: düzbucaqlı ${D(fa)}·${D(sb - sa)} = ${D(a)} J` : `${D(sa)}–${D(sb)} m: ${fa && fb ? "trapesiya" : "üçbucaq"} (${D(fa)} + ${D(fb)})/2·${D(sb - sa)} = ${D(a)} J`); }
        return { text: `Cismə hərəkət istiqamətində təsir edən qüvvənin yoldan asılılıq qrafiki verilib. Qüvvə bütün ${D(pts[pts.length - 1][0])} m yolda nə qədər iş görür?`,
          svg: graph(pts), answer: A, show: D(A), unit: "J", tol: 0.01,
          solution: `İş = qrafikin altındakı sahə. ${parts.join("; ")}. Cəmi: ${D(A)} J.` };
      } },
    { id: "guc", ad: "Güc", izah: "P = A/t — saniyədə görülən iş. Bərabər sürətlə hərəkətdə P = F·v. 1 kW = 1000 W, 72 km/saat = 20 m/s.",
      gen() {
        const kind = pick(["qaldır", "Fv", "Fv", "vaxt", "vmax"]);
        if (kind === "qaldır") {
          let m, hh, t, P; do { m = 10 * rnd(1, 50); hh = rnd(2, 30); t = rnd(2, 60); P = m * 10 * hh / t; } while (!nice(P));
          return { text: `Kran kütləsi ${m} kq olan yükü ${t} s ərzində ${hh} m hündürlüyə bərabər sürətlə qaldırdı. Kranın faydalı gücü nədir?`,
            answer: P, show: D(P), unit: "W",
            solution: `A = mgh = ${m}·10·${hh} = ${m * 10 * hh} J. P = A/t = ${m * 10 * hh}/${t} = ${D(P)} W.` };
        }
        if (kind === "Fv") {
          const vk = pick([18, 36, 54, 72, 90, 108]), F = 100 * rnd(2, 40), v = vk / 3.6, P = F * v / 1000;
          return { text: `Avtomobil üfüqi yolda ${vk} km/saat sabit sürətlə gedir. Hərəkətə müqavimət qüvvəsi ${F} N. Mühərrikin gücü neçə kilovatdır?`,
            answer: P, show: D(P), unit: "kW",
            solution: `Sürət sabitdir — dartı qüvvəsi müqavimətə bərabərdir: F = ${F} N. v = ${vk}/3,6 = ${D(v)} m/s. P = F·v = ${F}·${D(v)} = ${D(F * v)} W = ${D(P)} kW.` };
        }
        if (kind === "vaxt") {
          let m, hh, P, t; do { m = 50 * rnd(1, 20); hh = rnd(3, 40); P = 500 * rnd(1, 20); t = m * 10 * hh / P; } while (!nice(t));
          return { text: `Gücü ${D(P / 1000)} kW olan mühərrik kütləsi ${m} kq olan yükü ${hh} m hündürlüyə bərabər sürətlə qaldırır. Bu, nə qədər vaxt aparır? İtki yoxdur.`,
            answer: t, show: D(t), unit: "s",
            solution: `A = mgh = ${m * 10 * hh} J. P = ${P} W. t = A/P = ${m * 10 * hh}/${P} = ${D(t)} s.` };
        }
        let P, F, v; do { P = 5 * rnd(4, 40); F = 100 * rnd(5, 40); v = P * 1000 / F; } while (!nice(v));
        return { text: `Gücü ${P} kW olan motorlu qayıq maksimal sürətlə hərəkət edəndə suyun müqavimət qüvvəsi ${F} N olur. Qayığın maksimal sürəti nədir?`,
          answer: v, show: D(v), unit: "m/s",
          solution: `Maksimal sürətdə dartı qüvvəsi müqavimətə bərabərdir. P = F·v → v = P/F = ${P * 1000}/${F} = ${D(v)} m/s.` };
      } },
    { id: "fie", ad: "Mühərrik və nasosun FİƏ", izah: "η = P_faydalı / P_sərf = A_faydalı / A_tam. Nasos üçün faydalı iş — suyu qaldırmaq: mgh, m = ρV, ρ = 1000 kq/m³.",
      gen() {
        const kind = pick(["nasos", "nasosP", "kran", "kranT", "lift"]);
        if (kind === "nasos" || kind === "nasosP") {
          let V, hh, t, eta, P; do { V = pick([1, 2, 3, 4, 5, 6, 8, 10, 12, 15]); hh = rnd(5, 40); t = 60 * pick([1, 2, 5, 10, 20, 30]); eta = pick([50, 60, 75, 80]); P = 1000 * V * 10 * hh / t / (eta / 100); } while (!nice(P));
          const Af = 1000 * V * 10 * hh;
          if (kind === "nasos") return { text: `Nasos ${t / 60} dəqiqədə ${V} m³ suyu ${hh} m hündürlüyə vurur. Nasosun FİƏ ${eta}%. Mühərrikin sərf etdiyi güc nədir?`,
            answer: P, show: D(P), unit: "W",
            solution: `Suyun kütləsi m = ρV = ${1000 * V} kq. A_f = mgh = ${Af} J. Faydalı güc: ${Af}/${t} = ${D(Af / t)} W. P_sərf = ${D(Af / t)}/${D(eta / 100)} = ${D(P)} W.` };
          return { text: `Mühərrikinin gücü ${D(P)} W olan nasos ${t / 60} dəqiqədə ${V} m³ suyu ${hh} m hündürlüyə vurur. Nasosun FİƏ nədir?`,
            answer: eta, show: String(eta), unit: "%", tol: 0.01,
            solution: `A_f = ρVgh = ${1000 * V}·10·${hh} = ${Af} J. A_tam = P·t = ${D(P)}·${t} = ${D(P * t)} J. η = ${Af}/${D(P * t)}·100% = ${eta}%.` };
        }
        if (kind === "kran" || kind === "kranT") {
          let m, hh, t, P, eta; do { m = 100 * rnd(1, 30); hh = rnd(5, 40); t = rnd(10, 120); P = 1000 * rnd(2, 30); eta = m * 10 * hh / (P * t) * 100; } while (!nice(eta, 1) || eta < 40 || eta > 90);
          if (kind === "kran") return { text: `Gücü ${P / 1000} kW olan kran mühərriki kütləsi ${m} kq olan yükü ${t} s ərzində ${hh} m hündürlüyə qaldırdı. Kranın FİƏ nədir?`,
            answer: eta, show: String(eta), unit: "%", tol: 0.01,
            solution: `A_f = mgh = ${m * 10 * hh} J. A_tam = P·t = ${P}·${t} = ${P * t} J. η = ${m * 10 * hh}/${P * t}·100% = ${eta}%.` };
          return { text: `Gücü ${P / 1000} kW, FİƏ-si ${eta}% olan kran kütləsi ${m} kq olan yükü ${hh} m hündürlüyə qaldırır. Bu, nə qədər vaxt aparır?`,
            answer: t, show: String(t), unit: "s", tol: 0.01,
            solution: `Faydalı güc: η·P = ${D(eta / 100)}·${P} = ${D(eta / 100 * P)} W. A_f = mgh = ${m * 10 * hh} J. t = ${m * 10 * hh}/${D(eta / 100 * P)} = ${t} s.` };
        }
        let m, v, eta, P; do { m = 100 * rnd(3, 12); v = pick([0.5, 1, 1.5, 2, 2.5]); eta = pick([50, 60, 75, 80, 90]); P = m * 10 * v / (eta / 100); } while (!nice(P));
        return { text: `Lift kütləsi ${m} kq olan kabinanı ${D(v)} m/s sabit sürətlə qaldırır. Lift mühərrikinin FİƏ ${eta}%. Mühərrikin sərf etdiyi güc nədir?`,
          answer: P, show: D(P), unit: "W",
          solution: `Faydalı güc: P_f = F·v = mg·v = ${m * 10}·${D(v)} = ${D(m * 10 * v)} W. P_sərf = P_f/η = ${D(m * 10 * v)}/${D(eta / 100)} = ${D(P)} W.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"], bad = rnd(0, 2);
        let task, steps, why;
        if (Math.random() < .5) {
          const vk = pick([36, 54, 72, 90, 108]), F = 100 * rnd(3, 30), v = vk / 3.6, vw = bad === 0 ? vk : v, P = F * vw, Pk = bad === 2 ? P : P / 1000;
          task = `Avtomobil ${vk} km/saat sabit sürətlə gedir, müqavimət qüvvəsi ${F} N. Mühərrikin gücünü (kW) tap.`;
          steps = [bad === 0 ? `Sürəti olduğu kimi götürürük: v = ${vk}.` : `Sürəti m/s-ə çeviririk: v = ${vk}/3,6 = ${D(v)} m/s.`,
            bad === 1 ? `Sürət sabitdir, ona görə dartı qüvvəsi sıfırdır və P = 0 deyil, P = F·v = ${F}·${D(vw)} = ${D(P)} W.` : `Sürət sabitdir — dartı qüvvəsi müqavimətə bərabərdir: P = F·v = ${F}·${D(vw)} = ${D(P)} W.`,
            bad === 2 ? `kW-a çeviririk: P = ${D(Pk)} kW.` : `kW-a çeviririk: P = ${D(P)}/1000 = ${D(Pk)} kW.`];
          if (bad === 1) steps[1] = `Sürət sabitdir — dartı qüvvəsi müqavimətdən iki dəfə çoxdur: P = 2F·v = ${2 * F}·${D(v)} = ${D(2 * F * v)} W.`, steps[2] = `kW-a çeviririk: P = ${D(2 * F * v)}/1000 = ${D(2 * F * v / 1000)} kW.`;
          why = [`1-ci addım: km/saat-ı m/s-ə çevirmək lazımdır: ${vk}/3,6 = ${D(v)} m/s.`,
            `2-ci addım: sabit sürətdə dartı qüvvəsi müqavimətə BƏRABƏRDİR (Nyutonun I qanunu): P = ${F}·${D(v)} = ${D(F * v)} W.`,
            `3-cü addım: vattı kilovata çevirəndə 1000-ə bölmək lazımdır: ${D(F * v / 1000)} kW.`][bad];
        } else {
          let m, hh, t, P, eta; do { m = 100 * rnd(1, 20); hh = rnd(5, 30); t = rnd(10, 60); P = 1000 * rnd(2, 20); eta = m * 10 * hh / (P * t) * 100; } while (!nice(eta, 1) || eta < 40 || eta > 90);
          const Af = bad === 0 ? m * hh : m * 10 * hh, At = bad === 1 ? P / t : P * t, e = bad === 2 ? At / Af * 100 : Af / At * 100;
          task = `Gücü ${P / 1000} kW olan kran ${m} kq yükü ${t} s-də ${hh} m qaldırdı. FİƏ-ni tap.`;
          steps = [bad === 0 ? `Faydalı iş: A_f = m·h = ${m}·${hh} = ${D(Af)} J.` : `Faydalı iş: A_f = mgh = ${m}·10·${hh} = ${D(Af)} J.`,
            bad === 1 ? `Tam iş: A_t = P/t = ${P}/${t} = ${D(At)} J.` : `Tam iş: A_t = P·t = ${P}·${t} = ${D(At)} J.`,
            bad === 2 ? `η = A_t/A_f·100% = ${D(e)}%.` : `η = A_f/A_t·100% = ${D(e)}%.`];
          why = [`1-ci addım: g unudulub — A_f = mgh = ${m * 10 * hh} J.`,
            `2-ci addım: iş = güc × vaxt: A_t = ${P * t} J.`,
            `3-cü addım: faydalı işi tam işə bölmək lazımdır. Düz cavab ${eta}%.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(s => h("li", {}, s))));
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Pilləkənlə qaçış, ürək, yük maşını, su qülləsi: işi və vaxtı tap, sonra gücü.",
      gen() {
        const kind = pick(["pillə", "ürək", "maşın", "şəlalə"]);
        if (kind === "pillə") {
          let m, n, t, P; do { m = rnd(40, 80); n = rnd(3, 10); t = rnd(10, 40); P = m * 10 * 3 * (n - 1) / t; } while (!nice(P));
          return { text: `Kütləsi ${m} kq olan Elvin 1-ci mərtəbədən ${n}-ci mərtəbəyə ${t} saniyəyə qaçaraq qalxdı. Mərtəbələr arası hündürlük 3 m. Onun orta faydalı gücü nədir?`,
            answer: P, show: D(P), unit: "W",
            solution: `h = ${n - 1}·3 = ${3 * (n - 1)} m. A = mgh = ${m}·10·${3 * (n - 1)} = ${m * 30 * (n - 1)} J. P = A/t = ${m * 30 * (n - 1)}/${t} = ${D(P)} W.` };
        }
        if (kind === "ürək") {
          const A = pick([0.8, 1, 1.2, 1.5]), n = pick([60, 66, 72, 75, 80, 90]), P = A * n / 60;
          return { text: `Ürək hər döyüntüdə qanı damarlara vurmaq üçün təqribən ${D(A)} J iş görür. Nəbz dəqiqədə ${n} döyüntüdür. Ürəyin orta gücü nədir?`,
            answer: P, show: D(P), unit: "W",
            solution: `Bir dəqiqədə iş: ${D(A)}·${n} = ${D(A * n)} J. P = A/t = ${D(A * n)}/60 = ${D(P)} W.` };
        }
        if (kind === "maşın") {
          let P, vk, F; do { P = 10 * rnd(3, 30); vk = pick([36, 54, 72, 90]); F = P * 1000 / (vk / 3.6); } while (!nice(F));
          return { text: `Yük maşınının mühərriki ${P} kW güc inkişaf etdirir, maşın ${vk} km/saat sabit sürətlə gedir. Hərəkətə müqavimət qüvvəsi nədir?`,
            answer: F, show: D(F), unit: "N",
            solution: `v = ${vk}/3,6 = ${D(vk / 3.6)} m/s. Sabit sürətdə F_dartı = F_müq. F = P/v = ${P * 1000}/${D(vk / 3.6)} = ${D(F)} N.` };
        }
        let V, hh, P; do { V = pick([2, 5, 10, 20, 50, 100]); hh = rnd(5, 60); P = 1000 * V * 10 * hh / 1000; } while (!nice(P));
        return { text: `Şəlalədən hər saniyə ${V} m³ su ${hh} m hündürlükdən düşür. Suyun hər saniyə ağırlıq qüvvəsinin gördüyü işə uyğun güc neçə kilovatdır? (ρ = 1000 kq/m³)`,
          answer: P, show: D(P), unit: "kW",
          solution: `Hər saniyə m = ρV = ${1000 * V} kq su düşür. P = mgh/t = ${1000 * V}·10·${hh}/1 = ${1000 * V * 10 * hh} W = ${D(P)} kW.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-is-guc", title: "Mexaniki iş və güc", fenn: "fizika", link: "dersler/fiz-is-guc.html",
      format: "Cavab ədəddir, vahidi sahənin yanında yazılıb (J, W, kW, s, m/s, %). Mənfi iş: −120. Kök olanda: 50√3. Onluq kəsr: 12,5. g = 10 m/s².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["is", "is", "agirliq", "agirliq", "qrafik", "guc", "guc", "fie", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-is-guc.html")) b.push("dersler/fiz-is-guc.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
