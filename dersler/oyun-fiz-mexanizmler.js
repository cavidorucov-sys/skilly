// Sadə mexanizmlər (RFO fizika, 8–9-cu sinif) — game levels: lever, uniform rod, pulleys, inclined plane and golden rule, efficiency, find-the-error, real-life problems.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. g = 10 m/s².
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nice = (x, k = 10) => Math.abs(x * k - Math.round(x * k)) < 1e-9;               // x has at most one decimal (k = 10)
  const D = x => { const r = Math.round(x * 1000) / 1000; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  const X = x => nice(x, 100) ? D(x) : "təqribən " + D(Math.round(x * 10) / 10);   // ratio for prose
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };

  // A horizontal rod with supports, hanging loads, force arrows and distance marks. Positions in the problem's own units.
  function rodSvg({ from, to, supports = [], loads = [], forces = [], dims = [], centre = null, names = [], aria }) {
    const X = c => 30 + (c - from) / (to - from) * 240;
    const g = sv("svg", { viewBox: "0 0 300 160", class: "oy-svg", role: "img", "aria-label": aria });
    const defs = sv("defs", {}), mk = sv("marker", { id: "fm-ar", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" });
    mk.append(sv("path", { d: "M0 0L10 5L0 10z", fill: "var(--vec)" })); defs.append(mk); g.append(defs);
    g.append(sv("rect", { x: X(from), y: 64, width: X(to) - X(from), height: 7, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 1.5 }));
    for (const p of supports) g.append(sv("path", { d: `M${X(p)} 71L${X(p) - 10} 93L${X(p) + 10} 93Z`, fill: "none", stroke: "var(--ink)", "stroke-width": 2 }));
    for (const N of names) g.append(sv("text", { x: X(N.at), y: 108, "text-anchor": "middle", class: "oy-lbl" }, N.lab));
    for (const L of loads) {
      g.append(sv("line", { x1: X(L.at), y1: 71, x2: X(L.at), y2: 92, stroke: "var(--ink)", "stroke-width": 1.5 }));
      g.append(sv("rect", { x: X(L.at) - 17, y: 92, width: 34, height: 22, fill: "var(--sheet)", stroke: "var(--ink)", "stroke-width": 2 }));
      g.append(sv("text", { x: X(L.at), y: 107, "text-anchor": "middle", class: "oy-lbl" }, L.lab));
    }
    for (const F of forces) {
      const x = X(F.at);
      if (F.dir === "down") g.append(sv("line", { x1: x, y1: 22, x2: x, y2: 61, stroke: "var(--vec)", "stroke-width": 2.5, "marker-end": "url(#fm-ar)" }));
      else g.append(sv("line", { x1: x, y1: 63, x2: x, y2: 22, stroke: "var(--vec)", "stroke-width": 2.5, "marker-end": "url(#fm-ar)" }));
      g.append(sv("text", { x: x + 6, y: 20, class: "oy-lbl" }, F.lab));
    }
    if (centre) {
      const x = X(centre.at);
      g.append(sv("line", { x1: x, y1: 68, x2: x, y2: 96, stroke: "var(--vec)", "stroke-width": 2, "stroke-dasharray": "4 3", "marker-end": "url(#fm-ar)" }));
      g.append(sv("text", { x: x + 5, y: 92, class: "oy-lbl" }, centre.lab));
    }
    dims.forEach(([a, b, t], i) => {
      const y = 130 + 16 * (i % 2), x1 = X(a), x2 = X(b);
      g.append(sv("line", { x1, y1: y, x2, y2: y, stroke: "var(--muted)", "stroke-width": 1 }));
      g.append(sv("line", { x1, y1: y - 4, x2: x1, y2: y + 4, stroke: "var(--muted)" })); g.append(sv("line", { x1: x2, y1: y - 4, x2, y2: y + 4, stroke: "var(--muted)" }));
      g.append(sv("text", { x: (x1 + x2) / 2, y: y - 3, "text-anchor": "middle" }, t));
    });
    return g;
  }

  // ---- precomputed tables of "nice" situations (answers with at most one decimal) ----
  const ROD = [];   // uniform rod L m, mass M, support a m from end A, load m at end A
  for (const Lc of [40, 60, 80, 100, 120, 160, 200]) for (let ac = 5; ac < Lc / 2; ac += 5) for (let M = 1; M <= 12; M++) {
    const m = M * (Lc / 2 - ac) / ac; if (m > 0 && m <= 60 && nice(m)) ROD.push([Lc / 100, M, ac / 100, m]);
  }
  const LIFT = [];  // beam on the ground: L, M, load m at d from lifted end B → F
  for (const L of [2, 3, 4, 5, 6]) for (let d2 = 1; d2 < 2 * L; d2++) for (let M = 4; M <= 40; M += 2) for (const m of [5, 10, 15, 20, 25, 30, 40, 50]) {
    const d = d2 / 2, F = 5 * M + 10 * m * (L - d) / L; if (nice(F)) LIFT.push([L, M, m, d, F]);
  }
  const BRIDGE = []; // plank on two supports: L, M, load m at d from A → N_A, N_B
  for (const L of [2, 3, 4, 5, 6, 8]) for (let d2 = 1; d2 < 2 * L; d2++) for (let M = 10; M <= 60; M += 10) for (const m of [10, 20, 30, 40, 50, 60, 80]) {
    const d = d2 / 2, NB = 5 * M + 10 * m * d / L, NA = 5 * M + 10 * m * (L - d) / L; if (nice(NB) && nice(NA)) BRIDGE.push([L, M, m, d, NA, NB]);
  }

  const levels = [
    { id: "ling", ad: "Lingin tarazlığı", izah: "F₁·l₁ = F₂·l₂: qüvvə × qol hər iki tərəfdə bərabərdir. Ling yüngüldür (çəkisi nəzərə alınmır).",
      gen() {
        const kind = pick(["F", "F", "l", "m3"]);
        if (kind === "F") {
          let l1, l2, m1, F2; do { l1 = 5 * rnd(2, 16); l2 = 5 * rnd(2, 24); m1 = rnd(1, 20); F2 = m1 * 10 * l1 / l2; } while (l1 === l2 || !nice(F2));
          return { text: `Yüngül lingin sol qolunda, dayaqdan ${l1} sm məsafədə kütləsi ${m1} kq olan yük asılıb. Sağ qolu dayaqdan ${l2} sm məsafədə şaquli aşağı hansı qüvvə ilə basmaq lazımdır ki, ling tarazlıqda qalsın?`,
            svg: rodSvg({ from: -l1 - 5, to: l2 + 5, supports: [0], loads: [{ at: -l1, lab: m1 + " kq" }], forces: [{ at: l2, dir: "down", lab: "F" }], dims: [[-l1, 0, l1 + " sm"], [0, l2, l2 + " sm"]], aria: "Ling: solda yük, sağda aşağı qüvvə" }),
            answer: F2, show: D(F2), unit: "N",
            solution: `Yükün çəkisi: F₁ = mg = ${m1}·10 = ${m1 * 10} N. Momentlər bərabərdir: F₁·l₁ = F·l₂ → F = ${m1 * 10}·${l1}/${l2} = ${D(F2)} N. Qolları metrə çevirmək lazım deyil — yalnız nisbət vacibdir.` };
        }
        if (kind === "l") {
          let l1, m1, m2, l2; do { l1 = 5 * rnd(2, 20); m1 = rnd(1, 20); m2 = rnd(1, 20); l2 = m1 * l1 / m2; } while (m1 === m2 || !nice(l2) || l2 > 150 || l2 < 5);
          return { text: `Yüngül lingin sol qolunda, dayaqdan ${l1} sm məsafədə ${m1} kq kütləli yük asılıb. Sağ qola kütləsi ${m2} kq olan yük asmaq lazımdır. Onu dayaqdan neçə santimetr məsafədə asmaq lazımdır ki, ling tarazlıqda olsun?`,
            svg: rodSvg({ from: -l1 - 5, to: Math.max(l2, l1) + 5, supports: [0], loads: [{ at: -l1, lab: m1 + " kq" }, { at: l2, lab: m2 + " kq" }], dims: [[-l1, 0, l1 + " sm"], [0, l2, "x"]], aria: "Ling: iki yük, sağdakının qolu məlum deyil" }),
            answer: l2, show: D(l2), unit: "sm",
            solution: `m₁g·l₁ = m₂g·x → g ixtisar olunur: ${m1}·${l1} = ${m2}·x → x = ${m1 * l1}/${m2} = ${D(l2)} sm. Ağır yük dayağa yaxın, yüngül yük uzaqda olur.` };
        }
        let l1, m1, m2, l2, l3, m3; do { l1 = 10 * rnd(2, 10); m1 = rnd(4, 20); l2 = 10 * rnd(1, 8); m2 = rnd(1, 10); l3 = 10 * rnd(2, 10); m3 = (m1 * l1 - m2 * l2) / l3; } while (l2 === l3 || m3 <= 0 || m3 > 30 || !nice(m3));
        return { text: `Yüngül lingin sol qolunda, dayaqdan ${l1} sm məsafədə ${m1} kq yük asılıb. Sağ qolda iki yük var: dayaqdan ${l2} sm məsafədə ${m2} kq və dayaqdan ${l3} sm məsafədə naməlum yük. Ling tarazlıqdadır. Naməlum yükün kütləsi nədir?`,
          svg: rodSvg({ from: -l1 - 8, to: Math.max(l2, l3) + 8, supports: [0], loads: [{ at: -l1, lab: m1 + " kq" }, { at: l2, lab: m2 + " kq" }, { at: l3, lab: "m" }], dims: [[-l1, 0, l1 + " sm"], [0, Math.min(l2, l3), Math.min(l2, l3) + " sm"], [0, Math.max(l2, l3), Math.max(l2, l3) + " sm"]], aria: "Ling: solda bir yük, sağda iki yük" }),
          answer: m3, show: D(m3), unit: "kq",
          solution: `Saat əqrəbi ilə və əksinə momentlərin cəmi bərabərdir: ${m1}·${l1} = ${m2}·${l2} + m·${l3} (g ixtisar olunur) → ${m1 * l1} = ${m2 * l2} + ${l3}m → m = ${m1 * l1 - m2 * l2}/${l3} = ${D(m3)} kq.` };
      } },
    { id: "cubuq", ad: "Ağır çubuq və tir", izah: "Bircinsli çubuğun çəkisi onun ortasına tətbiq olunur. Momentləri dayağa (və ya fırlanma oxuna) nəzərən yaz.",
      gen() {
        const kind = pick(["rod", "rod", "lift", "bridge"]);
        if (kind === "rod") {
          const [L, M, a, m] = pick(ROD), askM = Math.random() < .35;
          const svg = rodSvg({ from: 0, to: L, supports: [a], loads: [{ at: 0, lab: askM ? m + " kq" : "m" }], centre: { at: L / 2, lab: "Mg" }, dims: [[0, a, D(a) + " m"], [0, L, D(L) + " m"]], aria: "Bircinsli çubuq dayaq üzərində, ucunda yük" });
          const base = `Uzunluğu ${D(L)} m olan bircinsli çubuq dayaq üzərində üfüqi vəziyyətdə tarazlıqdadır. Dayaq çubuğun A ucundan ${D(a)} m məsafədədir, A ucundan yük asılıb.`;
          const sol = `Çubuğun çəkisi onun ortasına — A ucundan ${D(L / 2)} m məsafəyə tətbiq olunur, yəni dayaqdan ${D(L / 2 - a)} m məsafədə. Momentlər: m·g·${D(a)} = M·g·${D(L / 2 - a)}.`;
          if (askM) return { text: base + ` Yükün kütləsi ${D(m)} kq. Çubuğun kütləsi nədir?`, svg, answer: M, show: String(M), unit: "kq", solution: sol + ` M = ${D(m)}·${D(a)}/${D(L / 2 - a)} = ${M} kq.` };
          return { text: base + ` Çubuğun kütləsi ${M} kq. Yükün kütləsi nədir?`, svg, answer: m, show: D(m), unit: "kq", solution: sol + ` m = ${M}·${D(L / 2 - a)}/${D(a)} = ${D(m)} kq.` };
        }
        if (kind === "lift") {
          const [L, M, m, d, F] = pick(LIFT);
          return { text: `Uzunluğu ${D(L)} m, kütləsi ${M} kq olan bircinsli tir yerdə uzanıb. Tirə B ucundan ${D(d)} m məsafədə ${m} kq yük bərkidilib. B ucunu yerdən azca qaldırmaq üçün ona ən azı hansı şaquli qüvvə tətbiq etmək lazımdır?`,
            svg: rodSvg({ from: 0, to: L, supports: [0], loads: [{ at: L - d, lab: m + " kq" }], forces: [{ at: L, dir: "up", lab: "F" }], centre: { at: L / 2, lab: "Mg" }, dims: [[L - d, L, D(d) + " m"], [0, L, D(L) + " m"]], aria: "Yerdə uzanan tir, B ucundan yuxarı çəkilir" }),
            answer: F, show: D(F), unit: "N",
            solution: `Tir A ucu ətrafında fırlanır. A-ya nəzərən momentlər: F·${D(L)} = ${M * 10}·${D(L / 2)} + ${m * 10}·${D(L - d)}. Yükün A-dan məsafəsi ${D(L)} − ${D(d)} = ${D(L - d)} m. F = ${D(M * 5 * L + m * 10 * (L - d))}/${D(L)} = ${D(F)} N.` };
        }
        const [L, M, m, d, NA, NB] = pick(BRIDGE), askA = Math.random() < .5;
        return { text: `Uzunluğu ${D(L)} m, kütləsi ${M} kq olan bircinsli taxta körpü iki ucundan A və B dayaqlarına söykənir. Körpünün üstündə, A ucundan ${D(d)} m məsafədə ${m} kq kütləli uşaq dayanıb. ${askA ? "A" : "B"} dayağı körpüyə hansı qüvvə ilə təsir edir?`,
          svg: rodSvg({ from: 0, to: L, supports: [0, L], loads: [{ at: d, lab: m + " kq" }], centre: { at: L / 2, lab: "Mg" }, dims: [[0, d, D(d) + " m"], [0, L, D(L) + " m"]], aria: "İki dayaq üzərində körpü və yük" }),
          answer: askA ? NA : NB, show: D(askA ? NA : NB), unit: "N",
          solution: askA
            ? `B-yə nəzərən momentlər: N_A·${D(L)} = ${M * 10}·${D(L / 2)} + ${m * 10}·${D(L - d)} → N_A = ${D(NA)} N. (Yoxlama: N_A + N_B = ${M * 10 + m * 10} N.)`
            : `A-ya nəzərən momentlər: N_B·${D(L)} = ${M * 10}·${D(L / 2)} + ${m * 10}·${D(d)} → N_B = ${D(NB)} N. (Yoxlama: N_A + N_B = ${M * 10 + m * 10} N.)` };
      } },
    { id: "blok", ad: "Bloklar", izah: "Tərpənməz blok yalnız istiqaməti dəyişir. Tərpənən bloku n ip parçası saxlayırsa, F = (yük + blok)·g / n, ip isə n dəfə çox çəkilir.",
      gen() {
        const kind = pick(["tek", "tek", "polis", "yol", "arx"]);
        if (kind === "tek") {
          const m = 2 * rnd(3, 40), mb = pick([0, 0, 1, 2, 3, 4, 5]);
          const F = (m + mb) * 5;
          return { text: `Tərpənən blokun köməyi ilə kütləsi ${m} kq olan yük bərabər sürətlə qaldırılır. ${mb ? `Blokun kütləsi ${mb} kq.` : "Blok yüngüldür."} İpin sərbəst ucuna hansı qüvvə tətbiq olunur? Sürtünməni nəzərə alma.`,
            answer: F, show: String(F), unit: "N", tol: 0.01,
            solution: `Tərpənən bloku iki ip parçası saxlayır, hər biri eyni qüvvə ilə çəkir: 2F = (${m}${mb ? " + " + mb : ""})·10 → F = ${(m + mb) * 10}/2 = ${F} N.` };
        }
        if (kind === "polis") {
          let n, m, mb, F; do { n = pick([2, 3, 4, 5, 6]); m = 5 * rnd(2, 40); mb = pick([0, 0, 2, 4, 5, 10]); F = (m + mb) * 10 / n; } while (!nice(F));
          const askM = Math.random() < .35;
          if (askM) return { text: `Polispastın aşağı (tərpənən) blok qrupunu ${n} ip parçası saxlayır. ${mb ? `Tərpənən blokların kütləsi cəmi ${mb} kq.` : "Bloklar yüngüldür."} İpin ucuna ${D(F)} N qüvvə tətbiq edəndə yük bərabər sürətlə qalxır. Yükün kütləsi nədir? Sürtünmə yoxdur.`,
            answer: m, show: String(m), unit: "kq", tol: 0.01,
            solution: `${n}·F = (m + ${mb})·g → m = ${n}·${D(F)}/10 − ${mb} = ${D(n * F / 10)} − ${mb} = ${m} kq.` };
          return { text: `Polispastın aşağı (tərpənən) blok qrupunu ${n} ip parçası saxlayır. Ondan kütləsi ${m} kq olan yük asılıb. ${mb ? `Tərpənən blokların kütləsi cəmi ${mb} kq.` : "Bloklar yüngüldür."} Yükü bərabər sürətlə qaldırmaq üçün ipin ucuna hansı qüvvə tətbiq etmək lazımdır? Sürtünmə yoxdur.`,
            answer: F, show: D(F), unit: "N",
            solution: `Hər ip parçası F qüvvəsi ilə çəkir: ${n}F = (${m}${mb ? " + " + mb : ""})·10 = ${(m + mb) * 10} N → F = ${D(F)} N.` };
        }
        if (kind === "yol") {
          const n = pick([2, 3, 4, 6]), hh = pick([0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 0.8, 1.2]);
          return { text: `Polispastın tərpənən blok qrupunu ${n} ip parçası saxlayır. Yükü ${D(hh)} m qaldırmaq üçün ipin ucunu nə qədər çəkmək lazımdır?`,
            answer: n * hh, show: D(n * hh), unit: "m",
            solution: `Yük h qalxanda saxlayan ${n} ip parçasının hər biri h qədər qısalır, ona görə ipin ucu ${n}h = ${n}·${D(hh)} = ${D(n * hh)} m çəkilir. Qüvvədə ${n} dəfə qazanırıq, yolda ${n} dəfə uduzuruq.` };
        }
        const k = pick([2, 3]), m = (2 ** k) * rnd(2, 15), askS = Math.random() < .4, hh = pick([0.5, 1, 1.5, 2]);
        if (askS) return { text: `Yük ${k} tərpənən blokdan ibarət sistemlə qaldırılır: hər blokun öz ipi var, ipin bir ucu tavana bərkidilib, o biri ucu növbəti tərpənən bloka bağlıdır (sonuncunun ipini insan çəkir). Yük ${D(hh)} m qalxanda insan ipi nə qədər çəkir?`,
          answer: (2 ** k) * hh, show: D((2 ** k) * hh), unit: "m",
          solution: `Hər tərpənən blok yolu 2 dəfə artırır: ${k} blok → 2${k === 2 ? "²" : "³"} = ${2 ** k} dəfə. ${2 ** k}·${D(hh)} = ${D((2 ** k) * hh)} m.` };
        return { text: `Kütləsi ${m} kq olan yük ${k} tərpənən blokdan ibarət sistemlə qaldırılır: hər blokun öz ipi var, ipin bir ucu tavana bərkidilib, o biri ucu növbəti tərpənən bloka bağlıdır (sonuncunun ipini insan çəkir). Bloklar yüngüldür. İnsan hansı qüvvə ilə çəkir?`,
          answer: m * 10 / 2 ** k, show: D(m * 10 / 2 ** k), unit: "N",
          solution: `Hər tərpənən blok qüvvəni 2 dəfə azaldır: ${k} blok → ${2 ** k} dəfə. F = ${m * 10}/${2 ** k} = ${D(m * 10 / 2 ** k)} N.` };
      } },
    { id: "maili", ad: "Maili müstəvi və qızıl qayda", izah: "Sürtünmə yoxdursa: F·l = P·h (maili müstəvi), F₁·s₁ = F₂·s₂ (istənilən mexanizm). Qüvvədə nə qədər qazanırsansa, yolda o qədər uduzursan.",
      gen() {
        const kind = pick(["F", "F", "l", "lingyol", "blokis"]);
        if (kind === "F" || kind === "l") {
          let m, hh, l, F; do { m = 5 * rnd(2, 40); hh = pick([0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.5, 3]); l = pick([2, 2.5, 3, 4, 5, 6, 8, 10]); F = m * 10 * hh / l; } while (l <= 1.5 * hh || !nice(F));
          if (kind === "F") return { text: `Kütləsi ${m} kq olan yükü uzunluğu ${D(l)} m, hündürlüyü ${D(hh)} m olan hamar maili müstəvi boyunca bərabər sürətlə yuxarı çəkirlər. Qüvvə müstəvi boyunca yönəlib. Onun qiyməti nədir? Sürtünmə yoxdur.`,
            answer: F, show: D(F), unit: "N",
            solution: `Qızıl qayda: F·l = mg·h → F = ${m * 10}·${D(hh)}/${D(l)} = ${D(F)} N. Qüvvədə ${X(l / hh)} dəfə qazanırıq.` };
          return { text: `Kütləsi ${m} kq olan yükü ${D(hh)} m hündürlüyə hamar maili müstəvi ilə qaldırmaq lazımdır. Fəhlə müstəvi boyunca ən çoxu ${D(F)} N qüvvə tətbiq edə bilir. Müstəvinin uzunluğu ən azı nə qədər olmalıdır?`,
            answer: l, show: D(l), unit: "m",
            solution: `F·l = mg·h → l = mg·h/F = ${m * 10}·${D(hh)}/${D(F)} = ${D(l)} m.` };
        }
        if (kind === "lingyol") {
          let l1, l2, hh, s; do { l1 = 10 * rnd(1, 6); l2 = 10 * rnd(3, 20); hh = pick([2, 3, 4, 5, 6, 8, 10]); s = hh * l2 / l1; } while (l2 <= l1 || !nice(s));
          return { text: `Lingin qolları: qısa — ${l1} sm, uzun — ${l2} sm. Qısa qolun ucundakı yük ${hh} sm qalxdı. Uzun qolun ucu neçə santimetr yerini dəyişdi?`,
            answer: s, show: D(s), unit: "sm",
            solution: `Ling dönəndə uclar qollarla mütənasib yol gedir: s₂/s₁ = l₂/l₁ → s₂ = ${hh}·${l2}/${l1} = ${D(s)} sm. Qüvvədə ${X(l2 / l1)} dəfə qazandıq — yolda o qədər uduzduq.` };
        }
        let m, F, s, hh; do { m = 5 * rnd(2, 30); F = 10 * rnd(2, 40); s = pick([0.5, 1, 1.5, 2, 2.5, 3, 4]); hh = F * s / (m * 10); } while (F >= m * 10 || !nice(hh, 100));
        return { text: `İdeal mexanizmlə (sürtünmə və çəkisiz hissələr) kütləsi ${m} kq olan yük qaldırılır. İnsan ${F} N qüvvə ilə ipi ${D(s)} m çəkdi. Yük nə qədər qalxdı?`,
          answer: hh, show: D(hh), unit: "m",
          solution: `Qızıl qayda: insanın işi = yükün qaldırılma işi. F·s = mg·h → h = ${F}·${D(s)}/${m * 10} = ${D(hh)} m.` };
      } },
    { id: "fie", ad: "Faydalı iş əmsalı", izah: "η = A_faydalı / A_tam · 100%. Faydalı iş — yükü qaldırmaq (mgh); tam iş — insanın gördüyü iş (F·s). η həmişə 100%-dən kiçikdir.",
      gen() {
        const kind = pick(["mailiEta", "mailiF", "mailiFs", "blokEta", "blokF", "blokMb"]);
        if (kind.startsWith("maili")) {
          let m, hh, l, F, eta; do { m = 5 * rnd(2, 40); hh = pick([0.5, 0.6, 0.8, 1, 1.2, 1.5, 2, 2.5, 3]); l = pick([2, 2.5, 3, 4, 5, 6, 8, 10]); F = 10 * rnd(2, 60); eta = m * 10 * hh / (F * l) * 100; } while (l <= 1.5 * hh || !nice(eta, 1) || eta < 40 || eta > 95);
          const Af = m * 10 * hh, At = F * l;
          const base = `Kütləsi ${m} kq olan yük uzunluğu ${D(l)} m, hündürlüyü ${D(hh)} m olan maili müstəvi boyunca bərabər sürətlə yuxarı çəkilir.`;
          if (kind === "mailiEta") return { text: base + ` Müstəvi boyunca tətbiq olunan qüvvə ${F} N. Maili müstəvinin FİƏ nədir?`, answer: eta, show: String(eta), unit: "%", tol: 0.01,
            solution: `A_f = mgh = ${m * 10}·${D(hh)} = ${D(Af)} J. A_t = F·l = ${F}·${D(l)} = ${D(At)} J. η = ${D(Af)}/${D(At)}·100% = ${eta}%.` };
          if (kind === "mailiF") return { text: base + ` Maili müstəvinin FİƏ ${eta}%. Müstəvi boyunca hansı qüvvə tətbiq olunur?`, answer: F, show: String(F), unit: "N", tol: 0.01,
            solution: `A_f = mgh = ${D(Af)} J. A_t = A_f/η = ${D(Af)}/${D(eta / 100)} = ${D(At)} J. F = A_t/l = ${D(At)}/${D(l)} = ${F} N.` };
          const Fs = F - Af / l;
          return { text: base + ` Müstəvi boyunca tətbiq olunan qüvvə ${F} N. Sürtünmə qüvvəsi nədir?`, answer: Fs, show: D(Fs), unit: "N",
            solution: `Tam iş = faydalı iş + sürtünməyə gedən iş: F·l = mgh + F_s·l → F_s = F − mgh/l = ${F} − ${D(Af)}/${D(l)} = ${D(Fs)} N. Diqqət: çəkinin hamısı (mg) yox, yalnız mgh/l hissəsi çıxılır.` };
        }
        if (kind === "blokMb") {
          let m, eta, mb; do { m = 5 * rnd(2, 30); eta = pick([50, 60, 75, 80, 90]); mb = m * (100 / eta - 1); } while (!nice(mb));
          return { text: `Tərpənən blokla kütləsi ${m} kq olan yük qaldırılır. Sürtünmə yoxdur, itki yalnız blokun özünü qaldırmağa gedir. Qurğunun FİƏ ${eta}%. Blokun kütləsi nədir?`,
            answer: mb, show: D(mb), unit: "kq",
            solution: `Faydalı iş mgh, tam iş (m + m_b)gh. η = m/(m + m_b) → ${D(eta / 100)} = ${m}/(${m} + m_b) → ${m} + m_b = ${D(m * 100 / eta)} → m_b = ${D(mb)} kq.` };
        }
        let m, F, eta; do { m = 2 * rnd(3, 50); F = 10 * rnd(2, 60); eta = m * 10 / (2 * F) * 100; } while (!nice(eta, 1) || eta < 50 || eta > 95);
        if (kind === "blokEta") return { text: `Tərpənən blokla kütləsi ${m} kq olan yük qaldırılır. İpin ucuna ${F} N qüvvə tətbiq olunur. Qurğunun FİƏ nədir?`, answer: eta, show: String(eta), unit: "%", tol: 0.01,
          solution: `Yük h qalxanda ip 2h çəkilir. η = mgh/(F·2h) = ${m * 10}/(2·${F}) ·100% = ${eta}%.` };
        return { text: `Tərpənən blokla kütləsi ${m} kq olan yük qaldırılır. Qurğunun FİƏ ${eta}%. İpin ucuna hansı qüvvə tətbiq olunur?`, answer: F, show: String(F), unit: "N", tol: 0.01,
          solution: `η = mg/(2F) → F = mg/(2η) = ${m * 10}/(2·${D(eta / 100)}) = ${F} N. İdeal blokda ${m * 5} N olardı — FİƏ qüvvəni artırır.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"], bad = rnd(0, 2);
        let task, steps, why;
        if (Math.random() < .5) {
          let m, F, hh, eta; do { m = 2 * rnd(3, 40); F = 10 * rnd(2, 40); hh = pick([1, 2, 3, 4, 5]); eta = m * 10 / (2 * F) * 100; } while (!nice(eta, 1) || eta < 50 || eta > 95);
          const Af = bad === 0 ? m * hh : m * 10 * hh, s = bad === 1 ? hh : 2 * hh, At = F * s, e = bad === 2 ? At / Af * 100 : Af / At * 100;
          task = `Tərpənən blokla ${m} kq yük ${hh} m qaldırıldı, ipə ${F} N qüvvə tətbiq olundu. FİƏ-ni tap.`;
          steps = [bad === 0 ? `Faydalı iş: A_f = m·h = ${m}·${hh} = ${D(Af)} J.` : `Faydalı iş: A_f = mgh = ${m}·10·${hh} = ${D(Af)} J.`,
            bad === 1 ? `İp də ${hh} m çəkilir: A_t = F·s = ${F}·${hh} = ${D(At)} J.` : `İp 2h = ${2 * hh} m çəkilir: A_t = F·s = ${F}·${2 * hh} = ${D(At)} J.`,
            bad === 2 ? `η = A_t/A_f·100% = ${D(e)}%.` : `η = A_f/A_t·100% = ${D(e)}%.`];
          why = [`1-ci addım: faydalı iş mgh-dır, g = 10 unudulub. A_f = ${m * 10 * hh} J.`,
            `2-ci addım: tərpənən blokda ip yükdən 2 dəfə çox yol gedir: s = ${2 * hh} m, A_t = ${F * 2 * hh} J.`,
            `3-cü addım: η = faydalı / tam, tərsinə yox. Düz cavab ${eta}%.`][bad];
        } else {
          let m, hh, l, F, eta; do { m = 5 * rnd(2, 30); hh = pick([0.5, 1, 1.5, 2]); l = pick([2, 3, 4, 5, 6]); F = 10 * rnd(2, 40); eta = m * 10 * hh / (F * l) * 100; } while (l <= 1.5 * hh || !nice(eta, 1) || eta < 40 || eta > 95);
          const Af = bad === 0 ? m * 10 * l : m * 10 * hh, At = bad === 1 ? F * hh : F * l, e = bad === 2 ? (Af / At) : Af / At * 100;
          task = `${m} kq yük uzunluğu ${D(l)} m, hündürlüyü ${D(hh)} m olan maili müstəvi ilə ${F} N qüvvə ilə qaldırıldı. FİƏ-ni (faizlə) tap.`;
          steps = [bad === 0 ? `Faydalı iş: A_f = mg·l = ${m * 10}·${D(l)} = ${D(Af)} J.` : `Faydalı iş: A_f = mg·h = ${m * 10}·${D(hh)} = ${D(Af)} J.`,
            bad === 1 ? `Tam iş: A_t = F·h = ${F}·${D(hh)} = ${D(At)} J.` : `Tam iş: A_t = F·l = ${F}·${D(l)} = ${D(At)} J.`,
            bad === 2 ? `η = A_f/A_t = ${D(e)}%.` : `η = A_f/A_t·100% = ${D(e)}%.`];
          why = [`1-ci addım: yük ${D(hh)} m hündürlüyə qalxır — faydalı iş mgh = ${D(m * 10 * hh)} J, mgl yox.`,
            `2-ci addım: qüvvə bütün müstəvi boyunca (${D(l)} m) təsir edir — A_t = F·l = ${D(F * l)} J.`,
            `3-cü addım: nisbəti 100-ə vurmaq unudulub: ${D(eta / 100)} → ${eta}%.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(s => h("li", {}, s))));
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Lom, əl arabası, kran, yük maşınına taxta: əvvəl mexanizmi tanı (ling, blok, maili müstəvi), sonra qaydanı tətbiq et.",
      gen() {
        const kind = pick(["lom", "araba", "kran", "taxta"]);
        if (kind === "lom") {
          let P, L, a, F; do { P = 100 * rnd(3, 20); L = pick([1, 1.2, 1.5, 1.6, 1.8, 2]); a = pick([0.1, 0.2, 0.25, 0.3]); F = P * a / (L - a); } while (!nice(F));
          return { text: `Ağır daşı yerindən tərpətmək üçün uzunluğu ${D(L)} m olan lomun ucunu daşın altına salıb, daşdan ${D(a)} m aralıda kiçik daşı dayaq qoydular. Daş lomun ucuna ${P} N qüvvə ilə basır. Lomun o biri ucuna hansı qüvvə tətbiq etmək lazımdır?`,
            svg: rodSvg({ from: 0, to: L, supports: [a], forces: [{ at: 0, dir: "down", lab: P + " N" }, { at: L, dir: "down", lab: "F" }], dims: [[0, a, D(a) + " m"], [0, L, D(L) + " m"]], aria: "Lom: qısa qolda daşın qüvvəsi, uzun qolda əl" }),
            answer: F, show: D(F), unit: "N",
            solution: `Lom — ling. Qısa qol ${D(a)} m, uzun qol ${D(L)} − ${D(a)} = ${D(L - a)} m. F = ${P}·${D(a)}/${D(L - a)} = ${D(F)} N.` };
        }
        if (kind === "araba") {
          let m, a, L, F; do { m = 10 * rnd(3, 15); a = pick([0.3, 0.4, 0.5, 0.6]); L = pick([1.2, 1.4, 1.5, 1.6]); F = m * 10 * a / L; } while (!nice(F));
          return { text: `Yüklə birlikdə əl arabasının kütləsi ${m} kq, ağırlıq mərkəzi təkərin oxundan üfüqi istiqamətdə ${D(a)} m aralıdadır. Dəstəklər oxdan ${D(L)} m aralıdadır. Arabanı qaldırıb saxlamaq üçün dəstəklərə hansı şaquli qüvvə tətbiq etmək lazımdır?`,
            answer: F, show: D(F), unit: "N",
            solution: `Araba təkərin oxu ətrafında fırlanan lingdir. F·${D(L)} = ${m * 10}·${D(a)} → F = ${D(m * 10 * a)}/${D(L)} = ${D(F)} N — yükün çəkisindən ${X(L / a)} dəfə az.` };
        }
        if (kind === "kran") {
          let m, n, eta, F; do { m = 50 * rnd(2, 30); n = pick([2, 4, 6]); eta = pick([50, 60, 75, 80, 90]); F = m * 10 / (n * eta / 100); } while (!nice(F));
          return { text: `Tikinti kranının polispastında yükü ${n} ip parçası saxlayır. Kütləsi ${m} kq olan yük bərabər sürətlə qaldırılır, polispastın FİƏ ${eta}%. Bucurqad ipi hansı qüvvə ilə çəkir?`,
            answer: F, show: D(F), unit: "N",
            solution: `İdeal halda F₀ = mg/${n} = ${m * 10}/${n} = ${D(m * 10 / n)} N. İtkilərlə: F = F₀/η = ${D(m * 10 / n)}/${D(eta / 100)} = ${D(F)} N.` };
        }
        let m, hh, l, eta, F; do { m = 10 * rnd(5, 30); hh = pick([1, 1.2, 1.5]); l = pick([3, 4, 5, 6]); eta = pick([60, 75, 80, 90]); F = m * 10 * hh / (l * eta / 100); } while (!nice(F));
        const askA = Math.random() < .4;
        if (askA) { const At = m * 10 * hh / (eta / 100);
          return { text: `Kütləsi ${m} kq olan çəlləyi ${D(hh)} m hündürlükdəki yük maşınının kuzovuna uzunluğu ${D(l)} m olan taxta ilə diyirlədib qaldırırlar. Taxtanın FİƏ ${eta}%. İnsan nə qədər iş görür?`,
            answer: At, show: D(At), unit: "J",
            solution: `Faydalı iş: mgh = ${m * 10}·${D(hh)} = ${D(m * 10 * hh)} J. Tam iş: A = A_f/η = ${D(m * 10 * hh)}/${D(eta / 100)} = ${D(At)} J.` }; }
        return { text: `Kütləsi ${m} kq olan çəlləyi ${D(hh)} m hündürlükdəki yük maşınının kuzovuna uzunluğu ${D(l)} m olan taxta ilə qaldırırlar. Taxtanın FİƏ ${eta}%. Taxta boyunca hansı qüvvə tətbiq olunur?`,
          answer: F, show: D(F), unit: "N",
          solution: `η·F·l = mgh → F = ${m * 10}·${D(hh)}/(${D(eta / 100)}·${D(l)}) = ${D(F)} N.` };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions, each with a figure (lever, rod,
  // pulley system, inclined plane), several steps; the wrong options are the answers of typical mistakes.
  // Questions 6, 7 and 8 also use earlier topics: friction on an incline, power, Hooke's law.
  const { ae, again } = Oyun;
  const ok = (x, k = 10) => isFinite(x) && x > 0 && nice(x, k);
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const U_ = u => x => D(x) + " " + u;
  function fig(w, hh, aria) {
    const g = sv("svg", { viewBox: `0 0 ${w} ${hh}`, class: "oy-svg", role: "img", "aria-label": aria });
    const defs = sv("defs", {}), mk = sv("marker", { id: "fm-ar", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto-start-reverse" });
    mk.append(sv("path", { d: "M0 0L10 5L0 10z", fill: "var(--vec)" })); defs.append(mk); g.append(defs); return g;
  }
  const ln = (g, x1, y1, x2, y2, c = "var(--ink)", w = 1.8) => g.append(sv("line", { x1, y1, x2, y2, stroke: c, "stroke-width": w, "stroke-linecap": "round" }));
  const arr = (g, x1, y1, x2, y2) => g.append(sv("line", { x1, y1, x2, y2, stroke: "var(--vec)", "stroke-width": 2.5, "marker-end": "url(#fm-ar)" }));
  const tx = (g, x, y, t, a = "middle") => g.append(sv("text", { x, y, "text-anchor": a, class: "oy-lbl" }, t));
  const wheel = (g, cx, cy, r) => { g.append(sv("circle", { cx, cy, r, fill: "var(--sheet)", stroke: "var(--ink)", "stroke-width": 2 })); g.append(sv("circle", { cx, cy, r: 2.5, fill: "var(--ink)" })); };
  const box = (g, cx, y, lab, w = 44, hh = 24) => { g.append(sv("rect", { x: cx - w / 2, y, width: w, height: hh, fill: "var(--sheet)", stroke: "var(--ink)", "stroke-width": 2 })); tx(g, cx, y + hh / 2 + 5, lab); };
  const ceil = (g, x1, x2, y = 8) => ln(g, x1, y, x2, y, "var(--muted)", 5);

  // block and tackle: n rope segments between the upper (fixed) and lower (moving) pulleys, the free end goes down
  function figTackle(n, lab) {
    const r = 9, x0 = 50, st = 2 * r, yT = 44, yB = 118, yBar = yB + 18, xs = i => x0 + i * st;
    const up = i => (n - 1 - i) % 2 === 0, g = fig(220, 200, "Polispast: yuxarıda tərpənməz, aşağıda tərpənən bloklar; ipin sərbəst ucu aşağı çəkilir");
    const top = [], bot = [];
    for (let i = 0; i < n; i++) (up(i) ? top : bot).push(xs(i) + r);
    const xEnd = xs(n), tl = Math.min(xs(0), ...top), tr = Math.max(...top);
    ceil(g, 20, 200); ln(g, (tl + tr) / 2, 8, (tl + tr) / 2, 24); ln(g, tl, 24, tr, 24, "var(--ink)", 3);
    top.forEach(c => ln(g, c, 24, c, yT));
    const bl = Math.min(...bot, n % 2 ? xs(0) : Infinity), br = Math.max(...bot);
    ln(g, bl, yBar, br, yBar, "var(--ink)", 3); bot.forEach(c => ln(g, c, yB, c, yBar));
    for (let i = 0; i < n; i++) ln(g, xs(i), i === 0 ? (n % 2 ? yBar : 24) : yT, xs(i), i === 0 ? (n % 2 ? yT : yB) : yB);
    ln(g, xEnd, yT, xEnd, 150); arr(g, xEnd, 150, xEnd, 182); tx(g, xEnd + 8, 180, "F", "start");
    top.forEach(c => wheel(g, c, yT, r)); bot.forEach(c => wheel(g, c, yB, r));
    const cx = (bl + br) / 2; ln(g, cx, yBar, cx, yBar + 10); box(g, cx, yBar + 10, lab, 50, 26);
    return g;
  }
  // Archimedes system: k moving pulleys, each on its own rope; the last rope is pulled up
  function figArch(k, lab) {
    const r = 15, yLow = 30 + 50 * k, cx = i => 50 + r * i, cy = i => yLow - 50 * i;
    const g = fig(cx(k - 1) + r + 60, yLow + r + 44, "Hər blokun öz ipi olan tərpənən bloklar sistemi; sonuncu ipin ucu yuxarı çəkilir");
    ceil(g, 20, cx(k - 1) + 2);
    for (let i = 0; i < k; i++) {
      ln(g, cx(i) - r, 8, cx(i) - r, cy(i));
      if (i < k - 1) ln(g, cx(i) + r, cy(i), cx(i) + r, cy(i + 1));
      else { ln(g, cx(i) + r, cy(i), cx(i) + r, 44); arr(g, cx(i) + r, 44, cx(i) + r, 14); tx(g, cx(i) + r + 8, 26, "F", "start"); }
    }
    for (let i = 0; i < k; i++) wheel(g, cx(i), cy(i), r);
    ln(g, cx(0), cy(0), cx(0), cy(0) + r + 8); box(g, cx(0), cy(0) + r + 8, lab, 50, 26);
    return g;
  }
  // a man on a platform pulls himself up: rope over a fixed pulley, one end on the platform, the other in his hands
  function figMan() {
    const g = fig(240, 175, "Tavandakı tərpənməz blokdan aşırılmış ip: bir ucu taxtaya bağlıdır, o biri ucunu taxtada duran adam çəkir");
    ceil(g, 60, 200); ln(g, 120, 8, 120, 34); ln(g, 104, 34, 104, 150); ln(g, 136, 34, 136, 112); wheel(g, 120, 34, 16);
    g.append(sv("rect", { x: 88, y: 150, width: 90, height: 8, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 }));
    g.append(sv("circle", { cx: 156, cy: 96, r: 8, fill: "none", stroke: "var(--ink)", "stroke-width": 2 }));
    ln(g, 156, 104, 156, 130, "var(--ink)", 2.5); ln(g, 156, 130, 148, 150, "var(--ink)", 2.5); ln(g, 156, 130, 164, 150, "var(--ink)", 2.5); ln(g, 156, 112, 136, 112, "var(--ink)", 2.5);
    tx(g, 172, 100, "m", "start"); tx(g, 133, 172, "M");
    return g;
  }
  // inclined plane (h, l marked); with a pulley at the top the rope goes over it and is pulled down
  function figIncline(pulley) {
    const g = fig(260, 175, pulley ? "Maili müstəvi; ip müstəviyə paralel gedir, başdakı tərpənməz blokdan aşırılıb və şaquli aşağı çəkilir" : "Maili müstəvi: uzunluq l, hündürlük h; yük müstəvi boyunca F qüvvəsi ilə çəkilir");
    g.append(sv("path", { d: "M20 150L220 150L220 70Z", fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 }));
    const grp = sv("g", { transform: "rotate(-21.8 120 110)" });
    grp.append(sv("rect", { x: 105, y: 88, width: 30, height: 22, fill: "var(--sheet)", stroke: "var(--ink)", "stroke-width": 2 }));
    if (!pulley) grp.append(sv("line", { x1: 135, y1: 99, x2: 182, y2: 99, stroke: "var(--vec)", "stroke-width": 2.5, "marker-end": "url(#fm-ar)" }));
    g.append(grp);
    tx(g, 210, 122, "h", "end"); tx(g, 66, 122, "l");
    if (pulley) { ln(g, 220, 70, 224, 58); ln(g, 130, 94, 217, 59); ln(g, 233, 56, 233, 120); arr(g, 233, 120, 233, 150); tx(g, 240, 146, "F", "start"); wheel(g, 224, 56, 9); }
    else tx(g, 176, 74, "F");
    return g;
  }
  // inclined plane drawn as a 3-4-5 triangle (Q6: h/l = 0,6)
  function figIncline345() {
    const g = fig(240, 170, "Maili müstəvi: uzunluq l, hündürlük h; yük müstəvi boyunca F qüvvəsi ilə çəkilir");
    g.append(sv("path", { d: "M40 150L200 150L200 30Z", fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 2 }));
    const grp = sv("g", { transform: "rotate(-36.87 120 90)" });
    grp.append(sv("rect", { x: 105, y: 68, width: 30, height: 22, fill: "var(--sheet)", stroke: "var(--ink)", "stroke-width": 2 }));
    grp.append(sv("line", { x1: 135, y1: 79, x2: 182, y2: 79, stroke: "var(--vec)", "stroke-width": 2.5, "marker-end": "url(#fm-ar)" }));
    g.append(grp);
    tx(g, 192, 100, "h", "end"); tx(g, 78, 108, "l"); tx(g, 172, 44, "F", "start");
    return g;
  }
  // uniform rod with equal divisions on a support; a spring ties the left end to the floor, a load hangs at the right end
  function figSpring(N, p, lab) {
    const X = i => 30 + i * 240 / N, g = fig(300, 170, "Bərabər bölgülü bircins çubuq dayaq üzərində; sol ucu yay ilə yerə bərkidilib, sağ ucundan yük asılıb");
    g.append(sv("rect", { x: 30, y: 56, width: 240, height: 8, fill: "var(--accent-soft)", stroke: "var(--ink)", "stroke-width": 1.5 }));
    for (let i = 1; i < N; i++) ln(g, X(i), 50, X(i), 64, "var(--ink)", 1.5);
    g.append(sv("path", { d: `M${X(p)} 64L${X(p) - 10} 86L${X(p) + 10} 86Z`, fill: "none", stroke: "var(--ink)", "stroke-width": 2 }));
    let d = `M30 64L30 72`; for (let j = 0; j < 8; j++) d += `L${j % 2 ? 22 : 38} ${76 + j * 6}`; d += `L30 122L30 140`;
    g.append(sv("path", { d, fill: "none", stroke: "var(--ink)", "stroke-width": 1.8 }));
    ln(g, 10, 140, 290, 140, "var(--muted)", 4); tx(g, 46, 112, "k", "start");
    ln(g, 270, 64, 270, 88); box(g, 270, 88, lab, 46, 24);
    return g;
  }

  // Q9: incline efficiency η1, pulley efficiency η2 — every option a "nice" number
  const SERIES = [];
  for (const m of [10, 20, 30, 40, 50, 60, 80, 100, 120, 150, 200]) for (const hh of [0.5, 0.6, 0.8, 1, 1.2, 1.5, 2]) for (const l of [2, 2.5, 3, 4, 5, 6])
    for (const e1 of [50, 60, 75, 80, 90]) for (const e2 of [80, 90, 95]) {
      if (l <= 1.5 * hh) continue;
      const P = m * 10 * hh / l, r = P * 1e4 / (e1 * e2), w = [P, P * 100 / e1, P * 100 / e2, P * e1 * e2 / 1e4];
      if ([r, ...w].every(x => ok(x))) SERIES.push([m, hh, l, e1, e2, r, w]);
    }

  // Q3: plank on two supports, child on the overhang — all options with at most two decimals
  const TIP = [];
  for (const L of [2, 3, 4, 5, 6]) for (let d4 = 1; d4 < 2 * L; d4++) for (let M = 10; M <= 80; M += 10) for (let m = 30; m <= 80; m += 10) {
    const d = d4 / 4, b = L / 2 + d, x = M * d / m, w = [m * d / M, M * (L / 2) / m, L - b, M * d / (M + m)];
    if (b < L && x < L - b && [x, ...w].every(v => ok(v, 100))) TIP.push([L, d, M, m, x, w]);
  }

  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. light lever: two loads on one arm, a force on the other
    { tip: "qapali", gen: () => again(() => {
      const l1 = 5 * rnd(4, 16), l2 = 5 * rnd(1, l1 / 5 - 1), l3 = 5 * rnd(4, 24), m1 = rnd(1, 12), m2 = rnd(1, 12);
      if ((l1 - l2) / (l1 + l3 + 16) * 240 < 42 || l2 / (l1 + l3 + 16) * 240 < 30) return null;
      const right = 10 * (m1 * l1 + m2 * l2) / l3, w = [(m1 * l1 + m2 * l2) / l3, 10 * (m1 + m2) * l1 / l3, 10 * m1 * l1 / l3, 10 * (m1 + m2)];
      if (![right, ...w].every(x => ok(x))) return null;
      return mc(ae(right, w, U_("N")), { svg: rodSvg({ from: -l1 - 8, to: l3 + 8, supports: [0], loads: [{ at: -l1, lab: m1 + " kq" }, { at: -l2, lab: m2 + " kq" }], forces: [{ at: l3, dir: "down", lab: "F" }], dims: [[-l1, 0, l1 + " sm"], [-l2, 0, l2 + " sm"], [0, l3, l3 + " sm"]], aria: "Ling: sol qolda iki yük, sağ qolda aşağı yönəlmiş F qüvvəsi" }),
        text: `Yüngül lingin sol qolunda dayaqdan ${l1} sm məsafədə ${m1} kq, ${l2} sm məsafədə ${m2} kq kütləli yük asılıb. Sağ qolda, dayaqdan ${l3} sm məsafədə lingə şaquli aşağı hansı F qüvvəsi tətbiq etmək lazımdır ki, ling üfüqi vəziyyətdə tarazlıqda qalsın? g = 10 m/s².`,
        solution: `Dayağa nəzərən momentlər: F·${l3} = ${m1 * 10}·${l1} + ${m2 * 10}·${l2} = ${10 * (m1 * l1 + m2 * l2)} → F = ${D(right)} N (qolları metrə çevirmək lazım deyil — nisbət vacibdir). Tələlər: g-ni unutmaq — kütləni qüvvə kimi yazmaq (${D(w[0])}); hər iki yükü uzaq nöqtədə saymaq (${D(w[1])}); yaxın yükü unutmaq (${D(w[2])}); qolları nəzərə almamaq, F = (m₁ + m₂)g (${D(w[3])}).` });
    }) },
    // 2. heavy rod hung on a thread: first the unknown load, then the tension
    { tip: "qapali", gen: () => again(() => {
      const N = pick([4, 5, 6, 8, 10]), k = rnd(1, Math.ceil(N / 2) - 1), u = pick([0.1, 0.2, 0.25]), M = rnd(1, 10), m2 = rnd(1, 10);
      const L = N * u, a = k * u, mx = (M * (N / 2 - k) + m2 * (N - k)) / k, T = 10 * (mx + M + m2);
      const mx1 = m2 * (N - k) / k, w = [10 * (mx1 + M + m2), 10 * (mx + m2), 10 * (M + m2), 10 * mx];
      if (!ok(mx) || ![T, ...w].every(x => ok(x))) return null;
      return mc(ae(T, w, U_("N")), { svg: rodSvg({ from: 0, to: L, loads: [{ at: 0, lab: "mₓ" }, { at: L, lab: m2 + " kq" }], forces: [{ at: a, dir: "up", lab: "T" }], centre: { at: L / 2, lab: "Mg" }, dims: [[0, a, D(a) + " m"], [0, L, D(L) + " m"]], aria: "Sapdan asılmış bircins çubuq: sol ucda naməlum yük, sağ ucda məlum yük" }),
        text: `Uzunluğu ${D(L)} m, kütləsi ${M} kq olan bircins çubuğun sol ucundan mₓ kütləli yük, sağ ucundan ${m2} kq kütləli yük asılıb. Çubuq sol ucundan ${D(a)} m məsafədə bağlanmış şaquli sapdan asılaraq üfüqi vəziyyətdə tarazlıqdadır. Sapın gərilmə qüvvəsi T nədir? Saplar yüngüldür, g = 10 m/s².`,
        solution: `1) Sapın bağlandığı nöqtəyə nəzərən momentlər. Çubuğun ağırlıq qüvvəsi ortaya — sapdan ${D(L / 2 - a)} m məsafəyə tətbiq olunur: mₓg·${D(a)} = ${M * 10}·${D(L / 2 - a)} + ${m2 * 10}·${D(L - a)} → mₓ = ${D(mx)} kq. 2) Şaquli qüvvələr: T = (mₓ + M + m)g = (${D(mx)} + ${M} + ${m2})·10 = ${D(T)} N. Tələlər: momentlərdə çubuğun ağırlıq qüvvəsini unutmaq (${D(w[0])}); T-də çubuğun ağırlıq qüvvəsini unutmaq (${D(w[1])}); mₓ-i unutmaq (${D(w[2])}); cavab olaraq mₓg yazmaq (${D(w[3])}).` });
    }) },
    // 3. plank resting on two supports, a child walks onto the overhanging part: when does it tip?
    { tip: "qapali", gen: () => again(() => {
      const [L, d, M, m, x, w] = pick(TIP), b = L / 2 + d;
      return mc(ae(x, w, U_("m")), { svg: rodSvg({ from: 0, to: L, supports: [0, b], names: [{ at: 0, lab: "A" }, { at: b, lab: "B" }], forces: [{ at: (b + L) / 2, dir: "down", lab: "mg" }], centre: { at: L / 2, lab: "Mg" }, dims: [[0, b, D(b) + " m"], [0, L, D(L) + " m"]], aria: "İki dayaq üzərində taxta: A sol ucda, B ortadan sağda; uşaq B-dən sağa gedir" }),
        text: `Uzunluğu ${D(L)} m, kütləsi ${M} kq olan bircins taxta iki dayaq üzərində üfüqi uzanıb: A dayağı taxtanın sol ucundadır, B dayağı sol ucdan ${D(b)} m məsafədədir. Kütləsi ${m} kq olan uşaq taxtanın üstü ilə B-dən sağa, sərbəst uca doğru gedir. Uşaq B dayağından ən çox hansı məsafəyə gedə bilər ki, taxta aşmasın? g = 10 m/s².`,
        solution: `Aşma anında A dayağı taxtaya təsir etmir (N_A = 0), taxta B ətrafında fırlanmağa başlayır. Taxtanın ağırlıq qüvvəsi ortaya — B-dən ${D(b)} − ${D(L / 2)} = ${D(d)} m sola tətbiq olunur. B-yə nəzərən: mg·x = Mg·${D(d)} → x = ${M}·${D(d)}/${m} = ${D(x)} m (sərbəst ucun B-dən məsafəsi ${D(L - b)} m — uşaq oraya çatmamış taxta aşır). Tələlər: kütlələrin nisbətini tərs yazmaq (${D(w[0])}); ağırlıq qüvvəsinin qolunu B-dən yox, sol ucdan götürmək (${D(w[1])}); "taxta dayaqdadır, aşmaz" — sona qədər (${D(w[2])}); kütlələri toplamaq (${D(w[3])}).` });
    }) },
    // 4. block and tackle: count the rope segments in the figure, the lower pulleys have weight
    { tip: "qapali", gen: () => again(() => {
      const n = rnd(3, 6), m = 5 * rnd(4, 40), mb = pick([1, 2, 4, 5, 6, 8, 10]), P = (m + mb) * 10, right = P / n;
      const w = [P / (n + 1), P / (n - 1), m * 10 / n, m * 10 / (n + 1)];
      if (![right, ...w].every(x => ok(x))) return null;
      return mc(ae(right, w, U_("N")), { svg: figTackle(n, m + " kq"),
        text: `Şəkildəki polispastla kütləsi ${m} kq olan yük bərabər sürətlə qaldırılır. Aşağı (tərpənən) blokların kütləsi cəmi ${mb} kq. İp və yuxarı bloklar yüngüldür, sürtünmə yoxdur. İpin sərbəst ucuna hansı F qüvvəsi tətbiq olunur? g = 10 m/s².`,
        solution: `Tərpənən hissəni (yük + aşağı bloklar) xəyalən kəs və onu saxlayan ip parçalarını say: ${n}. Sərbəst uc yuxarı blokdan aşağı gedir — tərpənən hissəni saxlamır, sayılmır. ${n}F = (${m} + ${mb})·10 = ${P} N → F = ${D(right)} N. Tələlər: sərbəst ucu da saymaq (${D(w[0])}); bir parçanı az saymaq (${D(w[1])}); blokların ağırlıq qüvvəsini unutmaq (${D(w[2])}); hər iki səhv birlikdə (${D(w[3])}).` });
    }) },
    // 5. a man on a platform lifts himself over a fixed pulley
    { tip: "qapali", gen: () => again(() => {
      const m = 10 * rnd(4, 9), M = 5 * rnd(1, Math.floor((m - 5) / 5)), right = (m - M) * 5, T = (m + M) * 5;
      const w = [T, m * 10, (m - M) * 10, (m + M) * 10];
      if (![right, ...w].every(x => ok(x))) return null;
      return mc(ae(right, w, U_("N")), { svg: figMan(),
        text: `Kütləsi ${m} kq olan adam kütləsi ${M} kq olan taxtanın üstündə durub. Tavandakı tərpənməz blokdan aşırılmış ipin bir ucu taxtaya bağlanıb, o biri ucunu adam şaquli aşağı çəkir və özünü taxta ilə birlikdə bərabər sürətlə qaldırır. Taxta üfüqi qalır (onu yüngül şaquli istiqamətləndiricilər fırlanmağa qoymur). Adam taxtaya hansı qüvvə ilə basır? İp və blok yüngüldür, sürtünmə yoxdur, g = 10 m/s².`,
        solution: `1) "Adam + taxta" sistemini yuxarı İKİ ip parçası çəkir (biri adamın əlində, biri taxtada), hər biri T: 2T = (${m} + ${M})·10 → T = ${T} N. 2) Adama: yuxarı T (ip əlini çəkir) və N (taxta), aşağı mg: N = ${m * 10} − ${T} = ${right} N. Nyutonun III qanunu: adam taxtaya da ${right} N ilə basır. Tələlər: cavab olaraq T yazmaq (${T}); ipi nəzərə almamaq, N = mg (${m * 10}); ipin gərilməsini taxtanın ağırlıq qüvvəsinə bərabər saymaq, N = mg − Mg (${(m - M) * 10}); sistemin bütün ağırlıq qüvvəsi (${(m + M) * 10}).` });
    }) },
    // 6. inclined plane with friction (3-4-5 triangle): force along the plane or work done
    { tip: "qapali", birlesik: "fiz-surtunme-maili", gen: () => again(() => {
      const u = pick([0.2, 0.4, 0.5, 0.6, 1, 1.2]), hh = 3 * u, dd = 4 * u, l = 5 * u, m = 5 * rnd(2, 30), mu = pick([0.1, 0.2, 0.25, 0.3, 0.4, 0.5]);
      const P = m * 10, F = P * (0.6 + 0.8 * mu), wF = [P * 0.6, P * (0.6 + mu), P * (0.8 + 0.6 * mu), P * 0.8 * mu], askA = Math.random() < .35;
      const right = askA ? F * l : F, w = askA ? wF.map(x => x * l) : wF;
      if (![right, ...w].every(x => ok(x))) return null;
      const base = `Kütləsi ${m} kq olan yük uzunluğu ${D(l)} m, hündürlüyü ${D(hh)} m olan maili müstəvi boyunca müstəviyə paralel F qüvvəsi ilə bərabər sürətlə yuxarı çəkilir. Yük ilə müstəvi arasında sürtünmə əmsalı μ = ${D(mu)}. g = 10 m/s².`;
      const s1 = `Üfüqi tərəf: √(${D(l)}² − ${D(hh)}²) = ${D(dd)} m; sin α = h/l = 0,6, cos α = 0,8. Sürtünmə: F_s = μmg·cos α = ${D(mu)}·${P}·0,8 = ${D(P * 0.8 * mu)} N. F = mg·sin α + F_s = ${D(P * 0.6)} + ${D(P * 0.8 * mu)} = ${D(F)} N.`;
      return mc(ae(right, w, U_(askA ? "J" : "N")), { svg: figIncline345(),
        text: base + (askA ? ` Yük müstəvinin aşağısından yuxarısına qədər çəkiləndə F qüvvəsi nə qədər iş görür?` : ` F qüvvəsi nə qədərdir?`),
        solution: s1 + (askA ? ` A = F·l = ${D(F)}·${D(l)} = ${D(right)} J.` : "") + ` Tələlər (${askA ? "işdə" : "qüvvədə"}): sürtünməni unutmaq — qızıl qayda (${D(w[0])}); təzyiq qüvvəsini mg götürmək, cos α-nı unutmaq (${D(w[1])}); sin və cos-u qarışdırmaq (${D(w[2])}); ${askA ? "yalnız sürtünməyə qarşı görülən iş" : "yalnız sürtünmə qüvvəsi"} (${D(w[3])}).` });
    }) },
    // 7. block and tackle driven by a motor: power = F · rope speed
    { tip: "qapali", birlesik: "fiz-is-guc", gen: () => again(() => {
      const n = rnd(2, 6), F = 10 * rnd(5, 60), eta = pick([0.6, 0.75, 0.8, 0.9]), m = eta * n * F / 10, hh = pick([2, 3, 4, 5, 6, 8, 10, 12]), t = pick([5, 10, 20, 30, 40, 60]);
      if (!Number.isInteger(Math.round(m * 1e6) / 1e6) || m < 10) return null;
      const right = F * n * hh / t, w = [F * hh / t, m * 10 * hh / t, F * n * hh, F * hh / (n * t)];
      if (![right, ...w].every(x => ok(x))) return null;
      return mc(ae(right, w, U_("W")), { svg: figTackle(n, Math.round(m) + " kq"),
        text: `Şəkildəki polispastla kütləsi ${Math.round(m)} kq olan yük ${t} s ərzində bərabər sürətlə ${hh} m hündürlüyə qaldırılır. Mühərrik ipin sərbəst ucunu ${F} N qüvvə ilə çəkir. Mühərrikin ipə verdiyi güc nədir? g = 10 m/s².`,
        solution: `Tərpənən hissəni ${n} ip parçası saxlayır, ona görə ipin ucu ${n}h = ${n}·${hh} = ${n * hh} m çəkilir. Mühərrikin işi: A = F·s = ${F}·${n * hh} = ${F * n * hh} J. Güc: N = A/t = ${F * n * hh}/${t} = ${D(right)} W. (Faydalı güc mgh/t = ${D(w[1])} W, FİƏ = ${D(eta * 100)}%.) Tələlər: ipin yolunu h götürmək (${D(w[0])}); faydalı gücü yazmaq (${D(w[1])}); işi vaxta bölməmək (${D(w[2])}); yolu n-ə bölmək (${D(w[3])}).` });
    }) },
    // 8. heavy rod on a support, held by a spring at one end (Hooke's law)
    { tip: "qapali", birlesik: "fiz-huk", minVariety: 40, gen: () => again(() => {
      const N = pick([4, 5, 6, 8, 10]), p = rnd(1, Math.ceil(N / 2) - 1), M = rnd(1, 10), m2 = rnd(1, 8), k = pick([100, 200, 250, 400, 500, 800, 1000]);
      const x = 1000 * (M * (N / 2 - p) + m2 * (N - p)) / (k * p);
      const w = [1000 * m2 * (N - p) / (k * p), 1000 * (M * N / 2 + m2 * (N - p)) / (k * p), 1000 * (M + m2) / k, x / 100];
      if (!ok(x) || x > 60 || !w.slice(0, 3).every(v => ok(v)) || !ok(w[3], 1000)) return null;
      return mc(ae(x, w, U_("sm")), { svg: figSpring(N, p, m2 + " kq"),
        text: `Kütləsi ${M} kq olan bircins çubuq bərabər bölgülərə ayrılıb və dayaq üzərində üfüqi vəziyyətdə tarazlıqdadır (şəkil). Çubuğun sol ucu sərtliyi ${k} N/m olan şaquli yay ilə yerə bərkidilib, sağ ucundan ${m2} kq kütləli yük asılıb. Yayın uzanması nə qədərdir? g = 10 m/s².`,
        solution: `Şəkildən: çubuq ${N} bölgüdür, dayaq sol ucdan ${p} bölgü aralıdadır. Dayağa nəzərən (qollar bölgü ilə): yay sol ucu aşağı çəkir, qolu ${p}; çubuğun ağırlıq qüvvəsi ortadadır, qolu ${D(N / 2)} − ${p} = ${D(N / 2 - p)}; yük — qolu ${N - p}. k·x·${p} = ${M * 10}·${D(N / 2 - p)} + ${m2 * 10}·${N - p} → kx = ${D(k * x / 100)} N → x = ${D(k * x / 100)}/${k} = ${D(x / 100)} m = ${D(x)} sm. Tələlər: çubuğun ağırlıq qüvvəsini unutmaq (${D(w[0])}); ağırlıq qüvvəsinin qolunu dayaqdan yox, ucdan saymaq (${D(w[1])}); lingi nəzərə almamaq, kx = (M + m)g (${D(w[2])}); metri santimetrə çevirməmək (${D(w[3])}).` });
    }) },
    // 9. two mechanisms in series: inclined plane (η1) and a fixed pulley at its top (η2)
    { tip: "qapali", gen: () => again(() => {
      const [m, hh, l, e1, e2, r, w] = pick(SERIES);
      return mc(ae(r, w, U_("N")), { svg: figIncline(true),
        text: `Kütləsi ${m} kq olan yük uzunluğu ${D(l)} m, hündürlüyü ${D(hh)} m olan maili müstəvi boyunca bərabər sürətlə yuxarı çəkilir. İp müstəviyə paralel gedir, müstəvinin başındakı tərpənməz blokdan aşırılıb və insan onu şaquli aşağı çəkir. Maili müstəvinin FİƏ-si ${e1}%, blokun FİƏ-si ${e2}%. İnsan ipi hansı qüvvə ilə çəkir? g = 10 m/s².`,
        solution: `Ardıcıl mexanizmlərdə FİƏ-lər vurulur: η = ${D(e1 / 100)}·${D(e2 / 100)} = ${D(e1 * e2 / 1e4)}. Tərpənməz blokda ipin ucu da l = ${D(l)} m gedir. η·F·l = mgh → F = ${m * 10}·${D(hh)}/(${D(e1 * e2 / 1e4)}·${D(l)}) = ${D(r)} N. Tələlər: itkiləri unutmaq — ideal qüvvə (${D(w[0])}); yalnız müstəvinin FİƏ-si (${D(w[1])}); yalnız blokun FİƏ-si (${D(w[2])}); FİƏ-yə bölmək əvəzinə vurmaq (${D(w[3])}).` });
    }) },
    // 10. Archimedes system with heavy moving pulleys
    { tip: "qapali", gen: () => again(() => {
      const k = pick([2, 3]), K = 2 ** k, mb = pick([1, 2, 4, 5]), m = 10 * rnd(2, 30), right = 10 * (m + (K - 1) * mb) / K;
      const w = [10 * m / K, 10 * (m + k * mb) / K, 10 * (m + mb) / K, 10 * (m + k * mb) / 2];
      if (![right, ...w].every(x => ok(x))) return null;
      const T = [10 * (m + mb) / 2]; for (let i = 1; i < k; i++) T.push((T[i - 1] + 10 * mb) / 2);
      return mc(ae(right, w, U_("N")), { svg: figArch(k, m + " kq"),
        text: `Kütləsi ${m} kq olan yük şəkildəki sistemlə bərabər sürətlə qaldırılır: ${k} tərpənən blok, hər blokun öz ipi var. Hər tərpənən blokun kütləsi ${mb} kq. İplər yüngüldür, sürtünmə yoxdur. İpin sərbəst ucuna hansı F qüvvəsi tətbiq olunur? g = 10 m/s².`,
        solution: `Aşağıdan yuxarı get. 1-ci blok (yük + blok): 2T₁ = (${m} + ${mb})·10 → T₁ = ${D(T[0])} N.` + T.slice(1).map((v, i) => ` ${["2-ci", "3-cü"][i]} blok (T${["₁", "₂"][i]} + öz ağırlıq qüvvəsi): 2T${["₂", "₃"][i]} = ${D(T[i])} + ${mb * 10} → T${["₂", "₃"][i]} = ${D(v)} N.`).join("") + ` F = ${D(right)} N. Tələlər: blokların ağırlıq qüvvəsini unutmaq, mg/${K} (${D(w[0])}); bütün blokları yükə qatıb ${K}-ə bölmək (${D(w[1])}); yalnız aşağı bloku nəzərə almaq (${D(w[2])}); bir tərpənən blok kimi hesablamaq (${D(w[3])}).` });
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
      key: "fiz-mexanizmler", title: "Sadə mexanizmlər", fenn: "fizika", link: "dersler/fiz-mexanizmler.html",
      format: "Cavab ədəddir, vahidi sahənin yanında yazılıb (N, kq, m, sm, J, %). Onluq kəsr vergül və ya nöqtə ilə: 12,5. g = 10 m/s².",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ling", "ling", "cubuq", "blok", "blok", "maili", "fie", "fie", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-mexanizmler.html")) b.push("dersler/fiz-mexanizmler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
