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

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a figure (graph, scheme, incline, vectors),
  // several steps; the wrong options are the answers of typical mistakes. Questions 2, 3, 4, 5, 6, 7, 8, 10 also use earlier topics
  // (Huk, vektorlar, Nyuton, sürtünmə-maili, sərbəst düşmə, kinematika).
  // <<exam-figures
  const { ae, again } = Oyun;
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  const IN = "var(--ink,#17171a)", AC = "var(--accent,#a32d2d)", MU = "var(--muted,#6b6b73)", PA = "var(--paper,#fff)", VE = "var(--vec,#0c447c)", SO = "var(--accent-soft,#f3dede)";
  const r1 = n => +(+n).toFixed(1);
  const ln = (x1, y1, x2, y2, c = IN, w = 2, ex = "") => `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const tx = (x, y, s, a = "middle", c = IN, sz = 13) => `<text x="${r1(x)}" y="${r1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const ar = (x1, y1, x2, y2, c = AC, w = 2.5) => ln(x1, y1, x2, y2, c, w, ' marker-end="url(#ik-ar)"');
  const dsh = (x1, y1, x2, y2) => ln(x1, y1, x2, y2, MU, 1, ' stroke-dasharray="4 3"');
  const rc = (x, y, w, h, fill = PA) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" fill="${fill}" stroke="${IN}" stroke-width="2"/>`;
  const svgS = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" class="oy-svg" role="img" aria-label="${aria}"><defs><marker id="ik-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  // graph: series = broken line through [x, y] points; shade = polygons under it; dash = guide segments [x1, y1, x2, y2];
  // xt / yt = labelled ticks [value, text]; dots = marked points
  function plotS(o) {
    const x0 = 46, xr = 262, yt = 24, yb = 160, X = x => x0 + x / o.xmax * (xr - x0), Y = y => yb - (y - o.ymin) / (o.ymax - o.ymin) * (yb - yt);
    let s = "";
    (o.shade || []).forEach(p => { s += `<path d="M${p.map(q => r1(X(q[0])) + " " + r1(Y(q[1]))).join("L")}Z" fill="${SO}" stroke="none"/>`; });
    (o.dash || []).forEach(d => { s += dsh(X(d[0]), Y(d[1]), X(d[2]), Y(d[3])); });
    s += ar(x0, Y(0), xr + 10, Y(0), IN, 1.5) + ar(x0, yb, x0, yt - 8, IN, 1.5);
    s += `<polyline points="${o.series.map(q => r1(X(q[0])) + "," + r1(Y(q[1]))).join(" ")}" fill="none" stroke="${VE}" stroke-width="2.5" stroke-linejoin="round"/>`;
    (o.dots || []).forEach(q => { s += `<circle cx="${r1(X(q[0]))}" cy="${r1(Y(q[1]))}" r="3.8" fill="${VE}"/>`; });
    (o.xt || []).forEach(q => { s += tx(X(q[0]), yb + 15, q[1], "middle", IN, 12); });
    (o.yt || []).forEach(q => { s += tx(x0 - 6, Y(q[0]) + 4, q[1], "end", IN, 12); });
    s += tx(x0 - 6, Y(0) + 15, "0", "end", IN, 12) + tx(xr + 18, yb + 31, o.xl, "end") + tx(x0 + 8, 14, o.yl, "start");
    return svgS(290, 196, s, o.aria);
  }
  const mn = v => "−" + v;
  const figWork = (F, G, s1, s2) => plotS({ xmax: s2, ymin: -G - 10, ymax: F + 10, xl: "s, m", yl: "F, N", aria: "Qüvvənin yola proyeksiyasının yoldan asılılıq qrafiki: əvvəl müsbət, sonra mənfi",
    series: [[0, F], [s1, F], [s1, -G], [s2, -G]], shade: [[[0, 0], [0, F], [s1, F], [s1, 0]], [[s1, 0], [s1, -G], [s2, -G], [s2, 0]]],
    dash: [[s2, -G, s2, 0], [s1, -G, s1, -G - 10], [s2, -G, s2, -G - 10]], xt: [[s1, s1], [s2, s2]], yt: [[F, F], [-G, mn(G)]] });
  const figHooke = (k, xp) => { const Fp = k * xp / 100, Fe = k * 0.5; return plotS({ xmax: 60, ymin: 0, ymax: Fe * 1.12, xl: "x, sm", yl: "F, N", aria: "Yayın qüvvəsinin uzanmadan asılılıq qrafiki: başlanğıcdan keçən düz xətt, bir nöqtə qeyd olunub",
    series: [[0, 0], [50, Fe]], dots: [[xp, Fp]], dash: [[xp, 0, xp, Fp], [0, Fp, xp, Fp]], xt: [[xp, xp]], yt: [[Fp, Fp]] }); };
  const figPt = (P1, t1, t2) => plotS({ xmax: t2, ymin: 0, ymax: P1 * 1.18, xl: "t, s", yl: "P, W", aria: "Mühərrikin gücünün vaxtdan asılılıq qrafiki: əvvəl artır, sonra sabit qalır",
    series: [[0, 0], [t1, P1], [t2, P1], [t2, 0]], shade: [[[0, 0], [t1, P1], [t2, P1], [t2, 0]]], dash: [[t1, 0, t1, P1]], xt: [[t1, t1], [t2, t2]], yt: [[P1, P1]] });
  const figVt = (tp, vp, a) => plotS({ xmax: 10, ymin: 0, ymax: a * 10 * 1.12, xl: "t, s", yl: "v, m/s", aria: "Sürətin vaxtdan asılılıq qrafiki: sükunətdən başlayan düz xətt, bir nöqtə qeyd olunub",
    series: [[0, 0], [10, a * 10]], dots: [[tp, vp]], dash: [[tp, 0, tp, vp], [0, vp, tp, vp]],
    xt: [2, 4, 6, 8, 10, ...(tp % 2 ? [tp] : [])].map(v => [v, v]), yt: [[vp, vp]] });
  // block on the floor: F to the right, friction to the left
  const figFric = () => svgS(290, 120, ln(20, 90, 270, 90) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => ln(26 + i * 21, 90, 18 + i * 21, 100, MU, 1)).join("") + rc(105, 48, 70, 42) + tx(140, 74, "m", "middle", IN, 15)
    + ar(175, 66, 238, 66, AC, 3) + tx(246, 62, "F", "start", AC, 14) + ar(105, 80, 56, 80, VE, 3) + tx(50, 84, "F_sür", "end", VE, 13), "Üfüqi səthdə cisim: sağa F qüvvəsi, sola sürtünmə qüvvəsi");
  // incline sin α = 0,6 (3-4-5): slope A(30,160) → C(190,40)
  const figIncl = () => { const a = Math.atan(0.75) * 180 / Math.PI;
    return svgS(290, 180, `<polygon points="30,160 190,160 190,40" fill="none" stroke="${IN}" stroke-width="2.5" stroke-linejoin="round"/>`
      + `<g transform="translate(86 118) rotate(${-r1(a)})">${rc(-22, -28, 44, 28)}${ar(24, -14, 72, -14, AC, 3)}</g>`
      + tx(77, 112, "m", "middle", IN, 14) + tx(138, 52, "F", "start", AC, 14)
      + `<path d="M62 160A32 32 0 0 0 56 141" fill="none" stroke="${IN}" stroke-width="1.5"/>` + tx(70, 154, "α", "start", IN, 14), "Maili müstəvi: yük müstəvi boyunca yuxarı F qüvvəsi ilə dartılır"); };
  // free fall: the ball at rest at the top, the same ball t seconds later with its weight
  const figFall = () => svgS(290, 180, ln(20, 164, 270, 164) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => ln(26 + i * 21, 164, 18 + i * 21, 174, MU, 1)).join("")
    + `<circle cx="100" cy="34" r="11" fill="${PA}" stroke="${IN}" stroke-width="2"/>` + tx(118, 38, "v₀ = 0", "start", IN, 13) + dsh(100, 47, 100, 94)
    + `<circle cx="100" cy="106" r="11" fill="${PA}" stroke="${IN}" stroke-width="2"/>` + ar(100, 119, 100, 152, AC, 3) + tx(108, 142, "mg", "start", AC, 13) + tx(118, 110, "t s sonra", "start", IN, 13), "Cisim sükunətdən sərbəst düşür; t saniyə sonrakı vəziyyət və ağırlıq qüvvəsi");
  // vectors on two grids: force (N) and displacement (m); one cell = c N / d m
  function figVec(f, s, c, d) {
    const u = 11, cy = 92;
    const panel = (cx, v, col, nm, title, cap) => { let g = "";
      for (let i = -5; i <= 5; i++) g += ln(cx + i * u, cy - 5 * u, cx + i * u, cy + 5 * u, i ? MU : IN, i ? 0.6 : 1.6) + ln(cx - 5 * u, cy + i * u, cx + 5 * u, cy + i * u, i ? MU : IN, i ? 0.6 : 1.6);
      const px = cx + v[0] * u, py = cy - v[1] * u, L = Math.hypot(v[0], v[1]);
      return g + ar(cx, cy, px, py, col, 3) + tx(px + 10 * v[0] / L, py - 10 * v[1] / L + 5, nm, "middle", col, 14) + tx(cx, 14, title) + tx(cx, 178, cap, "middle", MU, 12); };
    return svgS(290, 186, panel(70, f, AC, "F", "Qüvvə", `1 xana = ${c} N`) + panel(220, s, VE, "s", "Yerdəyişmə", `1 xana = ${d} m`), "Qüvvə və yerdəyişmə vektorları koordinat şəbəkəsində"); }
  // table, string over a pulley, hanging load
  const figTable = () => svgS(290, 160, rc(20, 70, 185, 24, SO) + rc(70, 40, 50, 30) + tx(95, 61, "m₂", "middle", IN, 14) + ln(205, 70, 212, 60) + ln(120, 50, 212, 50, IN, 1.5)
    + `<path d="M212 50A10 10 0 0 1 222 60L222 104" fill="none" stroke="${IN}" stroke-width="1.5"/>` + `<circle cx="212" cy="60" r="10" fill="${PA}" stroke="${IN}" stroke-width="2"/>`
    + rc(206, 104, 32, 30) + tx(222, 124, "m₁", "middle", IN, 14) + ar(256, 100, 256, 140, VE, 2) + ar(256, 140, 256, 100, VE, 2) + tx(262, 124, "h", "start", VE, 14), "Stolun üstündə m₂ cismi, ip blokdan keçib asılmış m₁ yükünə bağlıdır; m₁ h qədər enir");
  // crane: load lifted with an upward acceleration
  const figCrane = () => svgS(290, 170, ln(90, 14, 210, 14, IN, 3) + `<circle cx="150" cy="30" r="9" fill="${PA}" stroke="${IN}" stroke-width="2"/>` + ln(150, 39, 150, 100, IN, 1.5) + rc(120, 100, 60, 34) + tx(150, 123, "m", "middle", IN, 15)
    + ar(198, 118, 198, 76, AC, 3) + tx(206, 84, "T", "start", AC, 14) + ar(198, 118, 198, 158, VE, 3) + tx(206, 152, "mg", "start", VE, 13) + ar(104, 132, 104, 94, IN, 3) + tx(96, 114, "a", "end", IN, 14), "Kran yükü yuxarı sürətlə qaldırır: dartı qüvvəsi T yuxarı, ağırlıq mg aşağı, təcil a yuxarı");
  // exam-figures>>
  const pr = x => x < 0 ? `(${D(x)})` : D(x);
  const okv = x => isFinite(x) && x !== 0 && Math.abs(x) < 1e6 && nice(x, 10);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => D(x) + " " + u;
  // question 9: all (P₁, t₁, t₂, m, h) with a whole-percent efficiency and four tidy wrong answers
  const PT9 = [];
  for (const P1 of [200, 400, 500, 600, 800, 1000]) for (const t1 of [2, 4, 6]) for (const d of [2, 4, 6, 8]) for (const m of [20, 40, 50, 60, 80, 100]) for (let h = 2; h <= 10; h++) {
    const t2 = t1 + d, Aq = P1 * (t2 - t1 / 2), Af = m * 10 * h, eta = Af / Aq * 100;
    if (eta < 30 || eta > 95 || !nice(eta, 1)) continue;
    if ([Af / (P1 * t2) * 100, Af / (P1 * (t2 - t1)) * 100, Aq / Af * 100, 2 * Af / (P1 * t2) * 100].every(okv)) PT9.push([P1, t1, t2, m, h]);
  }
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. F(s) graph with a negative part: signed area (pure work)
    { tip: "qapali", gen: () => again(() => {
      const F = pick([20, 30, 40, 50, 60]), G = pick([10, 20, 30]), s1 = rnd(2, 6), d = rnd(1, 4), s2 = s1 + d, A = F * s1 - G * d;
      if (A <= 0) return null;
      const w = [F * s1 + G * d, F * s1, F * s2, -A]; if (![A, ...w].every(okv)) return null;
      return mc(ae(A, w, U_("J")), { svg: svgEl(figWork(F, G, s1, s2)), text: `Qrafikdə hərəkət xətti boyunca qüvvənin proyeksiyasının yoldan asılılığı verilib (mənfi qiymət — qüvvə hərəkətə əks yönəlib). Cisim ${s2} m yol gedərkən bu qüvvənin gördüyü iş nə qədərdir?`,
        solution: `İş qrafikin altındakı işarəli sahədir. 0–${s1} m: düzbucaqlı ${F}·${s1} = ${F * s1} J (müsbət). ${s1}–${s2} m: qüvvə mənfidir, sahə ${G}·${d} = ${G * d} J, iş −${G * d} J. Cəmi: ${F * s1} − ${G * d} = ${D(A)} J. Tələlər: sahələri modulla toplamaq (${F * s1 + G * d} J), yalnız müsbət hissə (${F * s1} J), ilk qüvvəni bütün yola vermək (${F * s2} J), işarəni tərsinə çevirmək (${D(-A)} J).` });
    }) },
    // 2. Hooke: spring constant from a graph, then the work of stretching from x1 to x2 (+ fiz-huk)
    { tip: "qapali", birlesik: "fiz-huk", gen: () => again(() => {
      const k = pick([50, 100, 200, 250, 400, 500]), xp = pick([10, 20, 25, 30, 40, 50]), Fp = k * xp / 100, a = pick([5, 10, 15, 20]), b = a + pick([5, 10, 15, 20]);
      if (!Number.isInteger(Fp) || b > 50) return null;
      const A = k * (b * b - a * a) / 20000, w = [k * (b - a) ** 2 / 20000, k * (b * b - a * a) / 10000, k * b * b / 20000, k * b * (b - a) / 10000];
      if (![A, ...w].every(okv)) return null;
      return mc(ae(A, w, U_("J")), { svg: svgEl(figHooke(k, xp)), text: `Qrafikdə yayın elastiklik qüvvəsinin uzanmadan asılılığı verilib (Huk qanunu). Yayın uzanması ${a} sm-dən ${b} sm-ə qədər artırılır (yay yavaş uzadılır). Bu zaman xarici qüvvənin gördüyü iş nə qədərdir?`,
        solution: `Qrafikdən: k = F/x = ${Fp}/${D(xp / 100)} = ${k} N/m. Yayın deformasiyasını dəyişəndə iş A = k(x₂² − x₁²)/2 = ${k}·(${D(b / 100)}² − ${D(a / 100)}²)/2 = ${D(A)} J (qrafikdə trapesiyanın sahəsi). Tələlər: (x₂ − x₁)² götürmək (${D(w[0])} J), ½-ni unutmaq (${D(w[1])} J), x = 0-dan, yəni deformasiyasız vəziyyətdən hesablamaq (${D(w[2])} J), son qüvvəni bütün yola vermək (${D(w[3])} J).` });
    }) },
    // 3. work as a dot product of two vectors read from grids (+ fiz-vektorlar)
    { tip: "qapali", birlesik: "fiz-vektorlar", gen: () => again(() => {
      const V = [[3, 4], [4, 3], [-3, 4], [3, -4], [-4, 3], [4, -3], [-3, -4], [-4, -3], [5, 0], [0, 5], [-5, 0], [0, -5]];
      const f = pick(V), s = pick(V), c = pick([2, 5, 10]), d = pick([1, 2]), dot = f[0] * s[0] + f[1] * s[1]; if (!dot) return null;
      const A = c * d * dot, w = [25 * c * d, c * d * (f[0] * s[0] - f[1] * s[1]), c * d * (f[0] * s[1] + f[1] * s[0]), c * d * (f[0] + f[1]) * (s[0] + s[1])];
      if (![A, ...w].every(okv)) return null;
      return mc(ae(A, w, U_("J")), { svg: svgEl(figVec(f, s, c, d)), text: `Cismə sabit F qüvvəsi təsir edir, cisim s yerdəyişməsi edir. Hər iki vektor koordinat şəbəkəsində göstərilib (qüvvə üçün 1 xana = ${c} N, yerdəyişmə üçün 1 xana = ${d} m). F qüvvəsinin gördüyü iş nə qədərdir?`,
        solution: `Komponentlər: F = (${D(c * f[0])}; ${D(c * f[1])}) N, s = (${D(d * s[0])}; ${D(d * s[1])}) m. İş skalyar hasildir: A = Fₓ·sₓ + F_y·s_y = ${pr(c * f[0])}·${pr(d * s[0])} + ${pr(c * f[1])}·${pr(d * s[1])} = ${D(A)} J. Tələlər: modulları vurmaq, |F|·|s| = ${5 * c}·${5 * d} = ${25 * c * d} J (bucaq nəzərə alınmır), komponentləri çarpaz vurmaq (${D(w[2])} J), işarəni səhv qoymaq (${D(w[1])} J), cəmləri vurmaq (${D(w[3])} J).` });
    }) },
    // 4. Newton II with friction, then work of the pulling force (+ fiz-nyuton)
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const m = pick([2, 4, 5, 10, 20]), mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]), a = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]), t = pick([2, 3, 4, 5, 6, 10]);
      const Fs = mu * m * 10, F = Fs + m * a, s = a * t * t / 2, A = F * s; if (!nice(F, 10) || !nice(Fs, 10)) return null;
      const w = [F * (F / m) * t * t / 2, F * a * t * t, (F - Fs) * s, Fs * s]; if (![A, ...w].every(okv)) return null;
      return mc(ae(A, w, U_("J")), { svg: svgEl(figFric()), text: `Kütləsi ${m} kq olan cisim üfüqi səthdə sükunətdədir (sürtünmə əmsalı ${D(mu)}; sükunətdə və hərəkətdə eynidir). Ona üfüqi istiqamətdə sabit ${D(F)} N qüvvə tətbiq edildi. Qüvvə tətbiq edildikdən sonrakı ilk ${t} s ərzində bu qüvvənin gördüyü iş nə qədərdir? (g = 10 m/s²)`,
        solution: `Sürtünmə: F_sür = μmg = ${D(mu)}·${m}·10 = ${D(Fs)} N. Nyutonun II qanunu: a = (F − F_sür)/m = (${D(F)} − ${D(Fs)})/${m} = ${D(a)} m/s². Yol: s = at²/2 = ${D(a)}·${t}²/2 = ${D(s)} m. A = F·s = ${D(F)}·${D(s)} = ${D(A)} J. Tələlər: sürtünməni unutmaq (${D(w[0])} J), s = at² (${D(w[1])} J), nəticələyici qüvvənin işi (${D(w[2])} J), sürtünmənin işinin modulu (${D(w[3])} J).` });
    }) },
    // 5. incline with friction, constant speed: power of the pulling force (+ fiz-surtunme-maili)
    { tip: "qapali", birlesik: "fiz-surtunme-maili", gen: () => again(() => {
      const m = pick([10, 20, 25, 30, 40, 50]), mu = pick([0.125, 0.25, 0.5, 0.75]), v = pick([0.5, 1, 1.5, 2, 2.5, 4, 5]);
      const G = m * 10, F = G * 0.6 + mu * G * 0.8, P = F * v, w = [G * 0.6 * v, (G * 0.6 + mu * G) * v, mu * G * 0.8 * v, G * (0.8 + mu * 0.6) * v];
      if (![P, ...w].every(okv)) return null;
      return mc(ae(P, w, U_("W")), { svg: svgEl(figIncl()), text: `Kütləsi ${m} kq olan yük maili müstəvi üzrə yuxarı, müstəviyə paralel qüvvənin təsiri ilə ${D(v)} m/s sabit sürətlə dartılır. Müstəvi üçün sin α = 0,6, cos α = 0,8; sürtünmə əmsalı: ${D(mu)}. Dartı qüvvəsinin gücü nə qədərdir? (g = 10 m/s²)`,
        solution: `Sürət sabitdir, qüvvələrin müstəvi boyunca cəmi sıfırdır: F = mg·sin α + μmg·cos α = ${G}·0,6 + ${D(mu)}·${G}·0,8 = ${D(G * 0.6)} + ${D(mu * G * 0.8)} = ${D(F)} N. P = F·v = ${D(F)}·${D(v)} = ${D(P)} W. Tələlər: sürtünməni unutmaq (${D(w[0])} W), sürtünməni μmg yazmaq (${D(w[1])} W), yalnız sürtünmənin gücünün modulunu götürmək (${D(w[2])} W), sin və cos-u dəyişmək (${D(w[3])} W).` });
    }) },
    // 6. free fall: instantaneous power of gravity after t seconds (+ fiz-serbest-dusme)
    { tip: "qapali", birlesik: "fiz-serbest-dusme", gen: () => again(() => {
      const m = pick([0.5, 1, 2, 3, 4, 5]), t = pick([2, 3, 4, 5, 6]), v = 10 * t, P = m * 10 * v, h = 5 * t * t;
      const w = [P / 2, m * 10 * h, m * 10 * t, m * 10]; if (![P, ...w].every(okv)) return null;
      return mc(ae(P, w, U_("W")), { svg: svgEl(figFall()), text: `Kütləsi ${D(m)} kq olan cisim sükunətdən buraxılıb və sərbəst düşür (havanın müqaviməti yoxdur, g = 10 m/s²). Düşməyə başladıqdan ${t} s sonra ağırlıq qüvvəsinin ani gücü nə qədərdir?`,
        solution: `Ani güc P = F·v. Sərbəst düşmədə v = gt = 10·${t} = ${v} m/s. P = mg·v = ${D(m * 10)}·${v} = ${D(P)} W. Tələlər: orta güc (${D(P / 2)} W), iş mgh = ${D(w[1])} J-u güc saymaq, qüvvə × vaxt mg·t (${D(w[2])}), yalnız qüvvə mg (${D(w[3])}).` });
    }) },
    // 7. v–t graph: acceleration, force, instantaneous power (+ fiz-kinematika)
    { tip: "qapali", birlesik: "fiz-kinematika", gen: () => again(() => {
      const m = pick([2, 4, 5, 10, 20]), [tp, vp] = pick([[2, 4], [4, 4], [2, 6], [5, 10], [3, 6], [4, 8], [5, 5], [2, 2], [4, 12], [5, 15]]), T = rnd(2, 10);
      if (T === tp) return null;
      const a = vp / tp, F = m * a, vT = a * T, P = F * vT, w = [P / 2, F * vp, F * T, m * vT * vT / 2]; if (![P, ...w].every(okv)) return null;
      return mc(ae(P, w, U_("W")), { svg: svgEl(figVt(tp, vp, a)), text: `Kütləsi ${m} kq olan cisim yalnız sabit nəticələyici qüvvənin təsiri ilə düz xətt boyunca hərəkət edir. Sürətin vaxtdan asılılıq qrafiki verilib (hərəkət sükunətdən başlayır). t = ${T} s anında nəticələyici qüvvənin ani gücü nə qədərdir?`,
        solution: `Qrafikin meyli təcildir: a = ${vp}/${tp} = ${D(a)} m/s². F = ma = ${m}·${D(a)} = ${D(F)} N. ${T} s anında v = a·t = ${D(vT)} m/s. P = F·v = ${D(F)}·${D(vT)} = ${D(P)} W. Tələlər: orta güc (${D(P / 2)} W), qrafikdəki nöqtənin sürətini götürmək (${D(w[1])} W), F·t (${D(w[2])}), kinetik enerji (${D(w[3])} J).` });
    }) },
    // 8. table + hanging load: work of the tension on the table body (+ fiz-nyuton)
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const m1 = rnd(1, 8), m2 = rnd(1, 8), h = pick([0.5, 1, 1.5, 2, 3, 4, 5]), a = 10 * m1 / (m1 + m2), T = m2 * a, A = T * h;
      if (!nice(a, 10)) return null;
      const w = [m1 * 10 * h, m2 * 10 * h, m1 * a * h, T * h / 2]; if (![A, ...w].every(okv)) return null;
      return mc(ae(A, w, U_("J")), { svg: svgEl(figTable()), text: `Sürtünməsiz üfüqi stolun üstündə kütləsi ${m2} kq olan cisim durur. Stolun kənarındakı çəkisiz, sürtünməsiz blokdan keçirilmiş yüngül, uzanmayan ip vasitəsilə o, kütləsi ${m1} kq olan asılmış yüklə birləşdirilib. Sistem sükunətdən buraxıldı. Asılmış yük ${D(h)} m aşağı enən zaman ipin dartı qüvvəsinin stoldakı cisim üzərində gördüyü iş nə qədərdir? (g = 10 m/s²)`,
        solution: `Hər iki cismin təcili eynidir: a = m₁g/(m₁ + m₂) = ${m1 * 10}/${m1 + m2} = ${D(a)} m/s². Stoldakı cisim üçün T = m₂a = ${m2}·${D(a)} = ${D(T)} N. Cismin yolu asılmış yükün yoluna bərabərdir: A = T·h = ${D(T)}·${D(h)} = ${D(A)} J. Tələlər: T = m₁g götürmək (${D(w[0])} J), T = m₂g (${D(w[1])} J), T = m₁a (${D(w[2])} J), yolu yarı götürmək (${D(w[3])} J).` });
    }) },
    // 9. P(t) graph: area = total work, then efficiency
    { tip: "qapali", gen: () => again(() => {
      const [P1, t1, t2, m, h] = pick(PT9), Aq = P1 * (t2 - t1 / 2), Af = m * 10 * h, eta = Af / Aq * 100;
      const w = [Af / (P1 * t2) * 100, Af / (P1 * (t2 - t1)) * 100, Aq / Af * 100, 2 * Af / (P1 * t2) * 100];
      return mc(ae(eta, w, x => D(x) + "%"), { svg: svgEl(figPt(P1, t1, t2)), text: `Mühərrikin sərf etdiyi (enerji mənbəyindən aldığı) gücün vaxtdan asılılıq qrafiki verilib. Mühərrik bütün bu müddətdə işləyərək kütləsi ${m} kq olan yükü sükunətdən ${h} m hündürlüyə qaldırıb dayandırıb (yükün sürəti əvvəlcə və sonda sıfırdır). Mühərrikin FİƏ-si nə qədərdir? (g = 10 m/s²)`,
        solution: `Sərf olunan iş qrafikin altındakı sahədir: üçbucaq ½·${P1}·${t1} = ${P1 * t1 / 2} J, düzbucaqlı ${P1}·${t2 - t1} = ${P1 * (t2 - t1)} J, A_tam = ${Aq} J. Faydalı iş A_f = mgh = ${m}·10·${h} = ${Af} J. η = A_f/A_tam·100% = ${D(eta)}%. Tələlər: üçbucağı düzbucaqlı saymaq (${D(w[0])}%), yalnız sabit hissə (${D(w[1])}%), tərsinə bölmək (${D(w[2])}%), bütün qrafiki üçbucaq saymaq (${D(w[3])}%).` });
    }) },
    // 10. crane with acceleration and efficiency (+ fiz-nyuton)
    { tip: "qapali", birlesik: "fiz-nyuton", gen: () => again(() => {
      const t = pick([2, 4, 5, 10]), a = pick([0.5, 1, 1.5, 2, 2.5, 4]), h = a * t * t / 2, m = pick([100, 200, 250, 400, 500, 1000]), eta = pick([50, 60, 75, 80, 90]);
      if (h > 50 || !nice(h, 10)) return null;
      const T = m * (10 + a), Pf = T * h / t, P = Pf / (eta / 100);
      const w = [m * 10 * h / t / (eta / 100), Pf, m * (10 - a) * h / t / (eta / 100), Pf * eta / 100]; if (![P, ...w].every(x => okv(x) && Number.isInteger(x))) return null;
      return mc(ae(P, w, U_("W")), { svg: svgEl(figCrane()), text: `Kran kütləsi ${m} kq olan yükü sükunətdən başlayaraq şaquli yuxarı sabit təcillə (bərabərtəcilli) hərəkət edərək ${t} s ərzində ${D(h)} m hündürlüyə qaldırdı. FİƏ-si ${eta}% olan mühərrikin bu müddətdə orta sərf etdiyi güc nə qədərdir? (g = 10 m/s², kabelin kütləsi nəzərə alınmır, faydalı iş yükə verilən işdir.)`,
        solution: `a = 2h/t² = 2·${D(h)}/${t}² = ${D(a)} m/s². T − mg = ma → T = m(g + a) = ${m}·${D(10 + a)} = ${D(T)} N. A_f = T·h = ${D(T * h)} J, faydalı güc P_f = A_f/t = ${D(Pf)} W. Sərf olunan güc P = P_f/η = ${D(Pf)}/${D(eta / 100)} = ${D(P)} W. Tələlər: təcili unutmaq, T = mg (${D(w[0])} W), η-ya bölməmək (${D(Pf)} W), T = m(g − a) (${D(w[2])} W), η-ya vurmaq (${D(w[3])} W).` });
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
      key: "fiz-is-guc", title: "Mexaniki iş və güc", fenn: "fizika", link: "dersler/fiz-is-guc.html",
      format: "Cavab ədəddir, vahidi sahənin yanında yazılıb (J, W, kW, s, m/s, %). Mənfi iş: −120. Kök olanda: 50√3. Onluq kəsr: 12,5. g = 10 m/s².",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["is", "is", "agirliq", "agirliq", "qrafik", "guc", "guc", "fie", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-is-guc.html")) b.push("dersler/fiz-is-guc.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
