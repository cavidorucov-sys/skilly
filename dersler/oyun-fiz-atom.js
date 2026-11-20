// Fizika · Atomun və nüvənin quruluşu — mastery game levels (composition, isotopes, α/β decay, decay chains, half-life, real life) and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. Counts are whole numbers; no unit for plain counts.
(function () {
  const { h } = Oyun;
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", SUB = "₀₁₂₃₄₅₆₇₈₉";
  const sup = s => String(s).replace(/\d/g, d => SUP[d]);
  const sub = s => String(s).replace(/\d/g, d => SUB[d]);
  const nuc = (A, Z, s) => sup(A) + sub(Z) + s;                       // ²³⁵₉₂U
  const ionStr = (s, c) => s + (Math.abs(c) > 1 ? sup(Math.abs(c)) : "") + (c > 0 ? "⁺" : "⁻");   // Mg²⁺, Cl⁻
  const pow2 = n => 2 ** n;
  const p2 = n => "2" + sup(n);
  // counts and plain numbers: exact; unit optional
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: 0.01 }, extra);

  const SYM = { H: 1, He: 2, Li: 3, Be: 4, B: 5, C: 6, N: 7, O: 8, F: 9, Ne: 10, Na: 11, Mg: 12, Al: 13, Si: 14, P: 15, S: 16, Cl: 17, Ar: 18, K: 19, Ca: 20, Fe: 26, Co: 27, Ni: 28, Cu: 29, Zn: 30, Sr: 38, Y: 39, Ag: 47, I: 53, Xe: 54, Cs: 55, Ba: 56, Au: 79, Tl: 81, Pb: 82, Bi: 83, Po: 84, Rn: 86, Ra: 88, Ac: 89, Th: 90, Pa: 91, U: 92, Np: 93, Pu: 94, Am: 95 };

  // real nuclides [Z, A, symbol]
  const NUCS = [[1, 2, "H"], [1, 3, "H"], [2, 4, "He"], [3, 7, "Li"], [4, 9, "Be"], [5, 11, "B"], [6, 12, "C"], [6, 14, "C"], [7, 14, "N"], [8, 16, "O"], [9, 19, "F"], [10, 20, "Ne"],
    [11, 23, "Na"], [12, 24, "Mg"], [13, 27, "Al"], [14, 28, "Si"], [15, 31, "P"], [16, 32, "S"], [17, 35, "Cl"], [17, 37, "Cl"], [18, 40, "Ar"], [19, 39, "K"], [20, 40, "Ca"],
    [26, 56, "Fe"], [27, 60, "Co"], [29, 63, "Cu"], [30, 64, "Zn"], [38, 90, "Sr"], [47, 107, "Ag"], [53, 127, "I"], [53, 131, "I"], [55, 137, "Cs"], [79, 197, "Au"],
    [82, 208, "Pb"], [86, 222, "Rn"], [88, 226, "Ra"], [92, 235, "U"], [92, 238, "U"]];
  // ions [Z, A, symbol, charge in e]
  const IONS = [[11, 23, "Na", 1], [12, 24, "Mg", 2], [13, 27, "Al", 3], [19, 39, "K", 1], [20, 40, "Ca", 2], [17, 35, "Cl", -1], [8, 16, "O", -2], [9, 19, "F", -1],
    [16, 32, "S", -2], [7, 14, "N", -3], [26, 56, "Fe", 3], [29, 63, "Cu", 2], [30, 64, "Zn", 2], [47, 107, "Ag", 1], [3, 7, "Li", 1], [4, 9, "Be", 2]];
  // groups of isotopes [symbol, Z, [A...]]
  const ISO = [["H", 1, [1, 2, 3]], ["C", 6, [12, 13, 14]], ["O", 8, [16, 17, 18]], ["Ne", 10, [20, 21, 22]], ["Mg", 12, [24, 25, 26]], ["U", 92, [234, 235, 238]]];
  // decays [parent, A, mode, daughter]  (Z comes from SYM; consistency is checked at generation time)
  const DEC = [["U", 238, "a", "Th"], ["U", 235, "a", "Th"], ["Ra", 226, "a", "Rn"], ["Rn", 222, "a", "Po"], ["Po", 218, "a", "Pb"], ["Po", 210, "a", "Pb"], ["Th", 232, "a", "Ra"],
    ["Pu", 239, "a", "U"], ["Am", 241, "a", "Np"], ["Th", 230, "a", "Ra"], ["U", 234, "a", "Th"], ["Po", 214, "a", "Pb"], ["Bi", 212, "a", "Tl"],
    ["Th", 234, "b", "Pa"], ["C", 14, "b", "N"], ["Pb", 214, "b", "Bi"], ["Bi", 214, "b", "Po"], ["Co", 60, "b", "Ni"], ["Sr", 90, "b", "Y"], ["Cs", 137, "b", "Ba"], ["I", 131, "b", "Xe"],
    ["H", 3, "b", "He"], ["Pb", 210, "b", "Bi"], ["Bi", 210, "b", "Po"], ["Ra", 228, "b", "Ac"], ["Na", 24, "b", "Mg"], ["P", 32, "b", "S"], ["Pa", 234, "b", "U"]];
  // chains [start, A, end, A]
  const CHAINS = [["U", 238, "Pb", 206], ["U", 235, "Pb", 207], ["Th", 232, "Pb", 208], ["Ra", 226, "Pb", 206], ["Rn", 222, "Pb", 206], ["Pu", 239, "Pb", 207], ["Np", 237, "Bi", 209]];
  const STARTS = [["U", 238], ["U", 235], ["Th", 232], ["Ra", 226], ["Pu", 239], ["Rn", 222]];
  // mean atomic mass presets [symbol, A1, A2, % of heavier]
  const MEAN = [["Cl", 35, 37, 25], ["B", 10, 11, 80], ["Br", 79, 81, 50], ["Cu", 63, 65, 30], ["Ag", 107, 109, 50], ["Ne", 20, 22, 10]];
  const UNITS = { "saniyə": [2, 4, 5, 10, 20], "dəqiqə": [3, 5, 10, 15, 20, 30], "saat": [2, 3, 4, 6, 8, 12], "gün": [2, 3, 4, 5, 8, 10, 12], "il": [5, 12, 30, 50, 100] };

  const dec = d => { // parent/daughter with checked Z, A
    const [ps, A, m, ds] = d, Z = SYM[ps], Zd = SYM[ds];
    const Ad = m === "a" ? A - 4 : A, Zdd = m === "a" ? Z - 2 : Z + 1;
    if (Zd !== Zdd) throw new Error("inconsistent decay " + ps + A + " -> " + ds);
    return { ps, ds, m, Z, A, Zd, Ad };
  };

  // N(t) graph: N₀ at t = 0, the point (kT, N₀/2^k) marked
  function decayGraph(N0, k, T, unit) {
    const W = 330, H = 210, x0 = 56, y0 = 172, xw = 248, yh = 150, tmax = 4 * T;
    const X = t => x0 + t / tmax * xw, Y = N => y0 - N / N0 * yh;
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": "Radioaktiv nümunədə qalan nüvələrin sayının zamandan asılılığı" });
    g.append(sv("line", { x1: x0, y1: y0, x2: x0 + xw + 12, y2: y0, stroke: "#17171a", "stroke-width": 1.8 }));
    g.append(sv("line", { x1: x0, y1: y0, x2: x0, y2: 8, stroke: "#17171a", "stroke-width": 1.8 }));
    let d = ""; for (let i = 0; i <= 60; i++) { const t = tmax * i / 60; d += (i ? "L" : "M") + X(t).toFixed(1) + " " + Y(N0 * Math.pow(2, -t / T)).toFixed(1); }
    g.append(sv("path", { d, fill: "none", stroke: "#534ab7", "stroke-width": 2.5 }));
    const tp = k * T, Np = N0 / pow2(k);
    g.append(sv("line", { x1: x0, y1: Y(Np), x2: X(tp), y2: Y(Np), stroke: "#a32d2d", "stroke-dasharray": "4 3" }));
    g.append(sv("line", { x1: X(tp), y1: Y(Np), x2: X(tp), y2: y0, stroke: "#a32d2d", "stroke-dasharray": "4 3" }));
    g.append(sv("circle", { cx: X(tp), cy: Y(Np), r: 4, fill: "#a32d2d" }));
    g.append(sv("circle", { cx: x0, cy: Y(N0), r: 4, fill: "#17171a" }));
    g.append(sv("text", { x: x0 - 6, y: Y(N0) + 5, "text-anchor": "end", class: "oy-lbl" }, String(N0)));
    g.append(sv("text", { x: x0 - 6, y: Y(Np) + 5, "text-anchor": "end", class: "oy-lbl" }, String(Np)));
    g.append(sv("text", { x: X(tp), y: y0 + 18, "text-anchor": "middle", class: "oy-lbl" }, String(tp)));
    g.append(sv("text", { x: x0 - 6, y: y0 + 18, "text-anchor": "end", class: "oy-lbl" }, "0"));
    g.append(sv("text", { x: x0 + 8, y: 14, class: "oy-lbl" }, "N"));
    g.append(sv("text", { x: x0 + xw + 12, y: y0 + 32, "text-anchor": "end", class: "oy-lbl" }, "t, " + unit));
    return g;
  }

  const levels = [
    { id: "terkib", ad: "Proton, neytron, elektron", izah: "ᴬ_Z X: A — nuklonların sayı (kütlə ədədi), Z — protonların sayı (sıra nömrəsi). Neytron sayı N = A − Z. Neytral atomda elektron sayı = Z; ionda elektron sayı Z − (ionun yükü).",
      gen() {
        const kind = pick(["n", "n", "e", "ion", "ion", "ionZ", "q", "A", "Z", "cem"]);
        if (kind === "ion" || kind === "ionZ") {
          const [Z, A, s, c] = pick(IONS), e = Z - c, name = ionStr(s, c);
          if (kind === "ion") return R(e, undefined, { text: `Ion ${name} (nuklid ${nuc(A, Z, s)}: A = ${A}, Z = ${Z}). Bu ionda neçə elektron var?`,
            solution: `Neytral atomda ${Z} elektron var. ${c > 0 ? `Ion ${c} elektron itirib: ${Z} − ${c} = ${e}.` : `Ion ${-c} elektron qəbul edib: ${Z} + ${-c} = ${e}.`}` });
          return R(Z, undefined, { text: `${c > 0 ? "Müsbət" : "Mənfi"} yüklü ionun yükü ${c > 0 ? "+" : "−"}${Math.abs(c)}e, onda ${e} elektron var. Bu ionun nüvəsində neçə proton var?`,
            solution: `Elektronların sayı Z ${c > 0 ? "−" : "+"} ${Math.abs(c)} = ${e}. Deməli Z = ${e} ${c > 0 ? "+" : "−"} ${Math.abs(c)} = ${Z}. Nüvənin yükü dəyişmir, protonlar yerindədir.` });
        }
        if (kind === "Z") {
          const [Z, A, s] = pick(NUCS), N = A - Z;
          return R(Z, undefined, { text: `Nüvənin kütlə ədədi ${A}, onda ${N} neytron var. Nüvədə neçə proton var?`, solution: `A = Z + N → Z = ${A} − ${N} = ${Z}.` });
        }
        if (kind === "A") {
          const [Z, A, s] = pick(NUCS), N = A - Z;
          return R(A, undefined, { text: `Nüvədə ${Z} proton və ${N} neytron var. Nüvənin kütlə ədədi A neçədir?`, solution: `A = Z + N = ${Z} + ${N} = ${A}.` });
        }
        const [Z, A, s] = pick(NUCS), N = A - Z, nu = nuc(A, Z, s);
        if (kind === "n") return R(N, undefined, { text: `Nuklid ${nu} (A = ${A}, Z = ${Z}). Nüvədə neçə neytron var?`, solution: `N = A − Z = ${A} − ${Z} = ${N}.` });
        if (kind === "e") return R(Z, undefined, { text: `Nuklid ${nu} (A = ${A}, Z = ${Z}). Neytral atomda neçə elektron var?`, solution: `Neytral atomda elektronların sayı protonların sayına bərabərdir: ${Z}.` });
        if (kind === "q") return R(Z, undefined, { text: `Nuklid ${nu} (A = ${A}, Z = ${Z}). Nüvənin yükü neçə elementar yük e-dir? (Yalnız ədədi yaz.)`, solution: `Nüvənin yükü protonların yüküdür: +Z·e = +${Z}e. Neytron yüksüzdür.` });
        return R(A + Z, undefined, { text: `Nuklid ${nu} (A = ${A}, Z = ${Z}). Neytral atomda cəmi neçə hissəcik var (proton, neytron və elektron birlikdə)?`,
          solution: `Proton ${Z}, neytron ${A} − ${Z} = ${N}, elektron ${Z}. Cəmi: ${Z} + ${N} + ${Z} = ${A + Z}.` });
      } },

    { id: "izotop", ad: "İzotoplar", izah: "İzotoplar — Z eyni, A müxtəlif nuklidlərdir (neytron sayı fərqlənir). Kimyəvi xassələri eynidir. Elementin atom kütləsi izotopların orta çəkili qiymətidir.",
      gen() {
        const kind = pick(["fark", "say", "say", "mean", "pct", "yar"]);
        if (kind === "fark") {
          const [s, Z, As] = pick(ISO), [a, b] = shuffle(As).slice(0, 2).sort((x, y) => x - y);
          return R(b - a, undefined, { text: `${nuc(a, Z, s)} və ${nuc(b, Z, s)} nuklidləri eyni elementin izotoplarıdır. Ağır izotopun nüvəsində yüngülündən neçə neytron artıqdır?`,
            solution: `Protonlar eynidir (${Z}), buna görə neytron fərqi kütlə ədədlərinin fərqinə bərabərdir: ${b} − ${a} = ${b - a}.` });
        }
        if (kind === "say") {
          const [s, Z, As] = pick(ISO), A = pick(As), others = As.filter(x => x !== A);
          const j = rnd(1, others.length), chosen = shuffle(others).slice(0, j);
          const dist = shuffle(NUCS.filter(n => n[0] !== Z)).slice(0, 3);
          const list = shuffle([...chosen.map(a => nuc(a, Z, s)), ...dist.map(n => nuc(n[1], n[0], n[2]))]);
          return R(j, undefined, { text: `${nuc(A, Z, s)} nuklidinin izotoplarının sayını tap. Siyahı: ${list.join(", ")}.`,
            solution: `İzotoplar eyni Z-li (burada Z = ${Z}, ${s}) nuklidlərdir. Siyahıda belə ${j} nuklid var: ${chosen.sort((x, y) => x - y).map(a => nuc(a, Z, s)).join(", ")}. Qalanlarının Z-i başqadır.` });
        }
        if (kind === "mean") {
          const [s, a, b, pp] = pick(MEAN), m = a + (b - a) * pp / 100;
          return R(m, undefined, { text: `Təbiətdə ${s} elementi iki izotopun qarışığıdır: kütlə ədədi ${a} olan (${100 - pp} %) və ${b} olan (${pp} %). Elementin orta atom kütləsi neçə a.k.v.-dir? (Kütlə ədədi ≈ kütlə a.k.v.-lə.)`,
            solution: `Orta çəkili: ${a}·${F((100 - pp) / 100)} + ${b}·${F(pp / 100)} = ${F(a * (100 - pp) / 100)} + ${F(b * pp / 100)} = ${F(m)}.` });
        }
        if (kind === "pct") {
          const [s, a, b, pp] = pick(MEAN), m = a + (b - a) * pp / 100;
          return R(pp, "%", { text: `${s} elementinin iki izotopu var: kütlə ədədi ${a} və ${b}. Orta atom kütləsi ${F(m)} a.k.v.-dir. Ağır izotop təbiətdə neçə faizdir?`,
            solution: `Ağır izotopun payı x olsun: ${a}(1 − x) + ${b}x = ${F(m)} → ${a} + ${b - a}x = ${F(m)} → x = ${F(m - a)}/${b - a} = ${F(pp / 100)} = ${pp} %.` });
        }
        const A = pick([12, 16, 20, 24, 28, 32, 40]);
        return R(A / 2, undefined, { text: `Nüvədə neytronların sayı protonların sayına bərabərdir, nüvənin kütlə ədədi ${A}-dir. Neytral atomda neçə elektron var?`,
          solution: `Z = N və Z + N = ${A} → Z = ${A}/2 = ${A / 2}. Neytral atomda elektron sayı Z-ə bərabərdir: ${A / 2}.` });
      } },

    { id: "alfabeta", ad: "α və β parçalanma", izah: "α-parçalanma: A azalır 4, Z azalır 2 (nüvə ⁴₂He buraxır). β⁻-parçalanma: A dəyişmir, Z artır 1 (neytron protona çevrilir, elektron çıxır). γ-şüa nüvənin tərkibini dəyişmir.",
      gen() {
        const D = dec(pick(DEC)), alpha = D.m === "a", pn = nuc(D.A, D.Z, D.ps), dn = nuc(D.Ad, D.Zd, D.ds);
        const mode = alpha ? "α-parçalanma" : "β⁻-parçalanma (elektron buraxır)";
        const rule = alpha ? "α-hissəcik ⁴₂He-dur: A azalır 4, Z azalır 2" : "β⁻-də neytron protona çevrilir: A dəyişmir, Z artır 1";
        const kind = pick(["Z", "A", "N", "pZ", "pN"]);
        if (kind === "Z") return R(D.Zd, undefined, { text: `Nüvə ${pn} (A = ${D.A}, Z = ${D.Z}) ${mode} keçirir. Yaranan nüvədə neçə proton var?`, solution: `${rule}. Z = ${D.Z} ${alpha ? "− 2" : "+ 1"} = ${D.Zd} (${D.ds}).` });
        if (kind === "A") return R(D.Ad, undefined, { text: `Nüvə ${pn} (A = ${D.A}, Z = ${D.Z}) ${mode} keçirir. Yaranan nüvənin kütlə ədədi neçədir?`, solution: `${rule}. A = ${D.A}${alpha ? " − 4" : " (dəyişmir)"} = ${D.Ad}.` });
        if (kind === "N") return R(D.Ad - D.Zd, undefined, { text: `Nüvə ${pn} (A = ${D.A}, Z = ${D.Z}) ${mode} keçirir. Yaranan nüvədə neçə neytron var?`,
          solution: `${rule}. Yeni nüvə: A = ${D.Ad}, Z = ${D.Zd} (${D.ds}). N = ${D.Ad} − ${D.Zd} = ${D.Ad - D.Zd}.` });
        if (kind === "pZ") return R(D.Z, undefined, { text: `Naməlum nüvə ${mode} nəticəsində ${dn} (A = ${D.Ad}, Z = ${D.Zd}) nüvəsinə çevrilib. İlkin nüvədə neçə proton olub?`,
          solution: `Geriyə hesabla. ${rule}. Deməli ilkin Z = ${D.Zd} ${alpha ? "+ 2" : "− 1"} = ${D.Z}.` });
        return R(D.A - D.Z, undefined, { text: `Naməlum nüvə ${mode} nəticəsində ${dn} (A = ${D.Ad}, Z = ${D.Zd}) nüvəsinə çevrilib. İlkin nüvədə neçə neytron olub?`,
          solution: `Geriyə hesabla. ${rule}. İlkin nüvə: A = ${D.A}, Z = ${D.Z}. N = ${D.A} − ${D.Z} = ${D.A - D.Z}.` });
      } },

    { id: "zencir", ad: "Parçalanma zənciri", izah: "Hər α: A − 4, Z − 2. Hər β⁻: Z + 1. Əvvəlcə A-nın azalmasından α-ların sayı (ΔA/4), sonra Z-dən β-ların sayı.",
      gen() {
        const kind = pick(["say", "say", "say", "son", "son", "nazal"]);
        if (kind === "say") {
          const [s1, A1, s2, A2] = pick(CHAINS), Z1 = SYM[s1], Z2 = SYM[s2], a = (A1 - A2) / 4, b = Z2 - Z1 + 2 * a;
          if (!Number.isInteger(a) || b < 0) throw new Error("bad chain");
          const ask = pick(["a", "b", "b", "cem"]);
          const head = `Zəncir parçalanma nəticəsində ${nuc(A1, Z1, s1)} nüvəsi sonda ${nuc(A2, Z2, s2)} nüvəsinə çevrilir (yalnız α və β⁻ parçalanma).`;
          const sol1 = `ΔA = ${A1} − ${A2} = ${A1 - A2}; hər α-da A azalır 4 → α sayı = ${A1 - A2}/4 = ${a}. ${a} α Z-i ${2 * a} azaldır: ${Z1} − ${2 * a} = ${Z1 - 2 * a}, lazım olan Z = ${Z2}, deməli β⁻ sayı = ${Z2} − ${Z1 - 2 * a} = ${b}.`;
          if (ask === "a") return R(a, undefined, { text: head + " Neçə α-parçalanma baş verib?", solution: sol1 });
          if (ask === "b") return R(b, undefined, { text: head + " Neçə β⁻-parçalanma baş verib?", solution: sol1 });
          return R(a + b, undefined, { text: head + " Cəmi neçə hissəcik (α və β) buraxılıb?", solution: sol1 + ` Cəmi ${a} + ${b} = ${a + b}.` });
        }
        if (kind === "son") {
          const [s, A0] = pick(STARTS), Z0 = SYM[s], a = rnd(1, 6), b = rnd(0, 4), Af = A0 - 4 * a, Zf = Z0 - 2 * a + b;
          const ask = pick(["A", "Z", "N"]);
          const q = ask === "A" ? "kütlə ədədi neçə olub?" : ask === "Z" ? "neçə proton olub?" : "neçə neytron olub?";
          const ans = ask === "A" ? Af : ask === "Z" ? Zf : Af - Zf;
          return R(ans, undefined, { text: `${nuc(A0, Z0, s)} nüvəsi ardıcıl ${a} α və ${b} β⁻ parçalanma keçirdi. Son nüvədə ${q}`,
            solution: `A = ${A0} − 4·${a} = ${Af}. Z = ${Z0} − 2·${a} + ${b} = ${Zf}. N = ${Af} − ${Zf} = ${Af - Zf}. Cavab: ${ans}.` });
        }
        const a = rnd(1, 6), b = rnd(1, 5);
        return R(2 * a + b, undefined, { text: `Nüvə ${a} α və ${b} β⁻ parçalanma keçirdi. Nüvədəki neytronların sayı neçə vahid azalıb?`,
          solution: `Hər α-da 2 proton və 2 neytron gedir: neytron −${2 * a}. Hər β⁻-də bir neytron protona çevrilir: neytron −${b}. Cəmi: ${2 * a} + ${b} = ${2 * a + b}.` });
      } },

    { id: "yarim", ad: "Yarımparçalanma dövrü", izah: "Hər T müddətində nüvələrin yarısı parçalanır: N = N₀/2ⁿ, n = t/T. Aktivlik və qalan kütlə də eyni qanunla azalır.",
      gen() {
        const kind = pick(["qalan", "qalan", "parc", "kutle", "vaxt", "dovr", "akt", "defe", "ncay", "qrafik", "qrafik"]);
        const u = pick(Object.keys(UNITS)), T = pick(UNITS[u]);
        if (kind === "qrafik") {
          const k = pick([2, 3]), T2 = pick([2, 3, 4, 5, 6, 8, 10]), N0 = pick([50, 100, 150, 200]) * pow2(k), uu = pick(["saat", "gün", "il", "dəqiqə"]);
          return R(T2, uu, { svg: decayGraph(N0, k, T2, uu), text: `Qrafikdə radioaktiv nümunədə qalan nüvələrin sayının zamandan asılılığı verilib. Qrafikə əsasən yarımparçalanma dövrünü tap (cavabı ${uu} ilə).`,
            solution: `İlk anda ${N0} nüvə, ${k * T2} ${uu} sonra ${N0 / pow2(k)}: ${N0}/${N0 / pow2(k)} = ${pow2(k)} = ${p2(k)} dəfə azalıb, yəni ${k} yarımparçalanma dövrü keçib. T = ${k * T2}/${k} = ${T2} ${uu}.` });
        }
        const n = rnd(2, 6);
        if (kind === "qalan" || kind === "parc") {
          const m = pick([5, 10, 25, 50, 100, 125]), N0 = m * pow2(n);
          const rest = `Radioaktiv nümunədə ${N0} nüvə var. Yarımparçalanma dövrü T = ${T} ${u}. ${n * T} ${u} sonra`;
          const sol = `n = ${n * T}/${T} = ${n}. Qalan: N = ${N0}/${p2(n)} = ${N0}/${pow2(n)} = ${m}.`;
          return kind === "qalan" ? R(m, undefined, { text: rest + " neçə nüvə parçalanmamış qalar?", solution: sol })
            : R(N0 - m, undefined, { text: rest + " neçə nüvə parçalanmış olar?", solution: sol + ` Parçalanan: ${N0} − ${m} = ${N0 - m}.` });
        }
        if (kind === "kutle") {
          const nn = rnd(2, 5), g = pick([5, 10, 15, 20, 25, 40]), m0 = g * pow2(nn);
          return R(g, "q", { text: `Radioaktiv izotopun ${m0} q kütləsi var. Yarımparçalanma dövrü T = ${T} ${u}. ${nn * T} ${u} sonra izotopdan neçə qram parçalanmamış qalar?`,
            solution: `n = ${nn * T}/${T} = ${nn}. m = ${m0}/${p2(nn)} = ${m0}/${pow2(nn)} = ${g} q.` });
        }
        if (kind === "vaxt") {
          const m = pick([5, 10, 25, 50, 100]), N0 = m * pow2(n);
          return R(n * T, u, { text: `Nümunədə ilk anda ${N0} radioaktiv nüvə var. Yarımparçalanma dövrü T = ${T} ${u}. Neçə ${u} sonra parçalanmamış nüvələrin sayı ${m} olar?`,
            solution: `${N0}/${m} = ${pow2(n)} = ${p2(n)} → n = ${n} yarımparçalanma dövrü. t = ${n}·${T} = ${n * T} ${u}.` });
        }
        if (kind === "dovr") {
          const nn = rnd(2, 4), left = Math.random() < .5, t = nn * T;
          const fr = left ? `1/${pow2(nn)}` : `${pow2(nn) - 1}/${pow2(nn)}`;
          return R(T, u, { text: `Nümunədə ${t} ${u} ərzində radioaktiv nüvələrin ${left ? "yalnız " + fr + " hissəsi qalıb" : fr + " hissəsi parçalanıb"}. Yarımparçalanma dövrünü tap (cavabı ${u} ilə).`,
            solution: `${left ? "Qalan hissə" : "Parçalanmayan hissə 1 − " + fr + " = 1/" + pow2(nn) + ". Qalan hissə"} 1/${pow2(nn)} = 1/${p2(nn)} → n = ${nn}. T = t/n = ${t}/${nn} = ${T} ${u}.` });
        }
        if (kind === "akt") {
          const nn = rnd(2, 5), m = pick([10, 15, 20, 25, 30, 40]), A0 = m * pow2(nn);
          return R(m, "Bq", { text: `Radioaktiv mənbənin aktivliyi ilk anda ${A0} Bq-dir. Yarımparçalanma dövrü T = ${T} ${u}. ${nn * T} ${u} sonra aktivlik neçə Bq olar?`,
            solution: `Aktivlik nüvələrin sayı ilə mütənasibdir, o da hər T-də yarıya düşür. n = ${nn}. A = ${A0}/${p2(nn)} = ${A0}/${pow2(nn)} = ${m} Bq.` });
        }
        if (kind === "defe") {
          return R(pow2(n), undefined, { text: `Yarımparçalanma dövrü T = ${T} ${u} olan nümunədə ${n * T} ${u} keçdi. Parçalanmamış nüvələrin sayı neçə dəfə azalıb?`,
            solution: `n = ${n * T}/${T} = ${n}. Azalma ${p2(n)} = ${pow2(n)} dəfədir.` });
        }
        return R(n, undefined, { text: `Radioaktiv nümunədə parçalanmamış nüvələrin sayı ${pow2(n)} dəfə azalıb. Neçə yarımparçalanma dövrü keçib?`,
          solution: `${pow2(n)} = ${p2(n)} → n = ${n}.` });
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          const [s1, A1, s2, A2] = pick(CHAINS), Z1 = SYM[s1], Z2 = SYM[s2], a = (A1 - A2) / 4, b = Z2 - Z1 + 2 * a, dA = A1 - A2;
          if (!Number.isInteger(a) || b < 1) throw new Error("bad chain");
          task = `${nuc(A1, Z1, s1)} nüvəsi α və β⁻ parçalanmalar zənciri ilə ${nuc(A2, Z2, s2)} nüvəsinə çevrilir. Neçə β⁻-parçalanma baş verib?`;
          steps = [
            `Kütlə ədədi ${A1} → ${A2}, fərq ${dA}. α-hissəcik 4 vahid aparır: α sayı = ${dA}/4 = ${a}.`,
            `${a} α-dan sonra Z = ${Z1} − 2·${a} = ${Z1 - 2 * a}.`,
            `Lazım olan Z = ${Z2}; β⁻ hər dəfə Z-i 1 artırır: β⁻ sayı = ${Z2} − ${Z1 - 2 * a} = ${b}.`,
          ];
          if (bad === 0) { const a2 = dA / 2; steps = [`Kütlə ədədi ${A1} → ${A2}, fərq ${dA}. α-hissəcik 2 vahid aparır: α sayı = ${dA}/2 = ${a2}.`, `${a2} α-dan sonra Z = ${Z1} − 2·${a2} = ${Z1 - 2 * a2}.`, `Lazım olan Z = ${Z2}; β⁻ sayı = ${Z2} − ${Z1 - 2 * a2} = ${Z2 - Z1 + 2 * a2}.`]; }
          if (bad === 1) steps = [steps[0], `${a} α-dan sonra Z = ${Z1} − ${a} = ${Z1 - a}.`, `Lazım olan Z = ${Z2}; β⁻ sayı = ${Z2} − ${Z1 - a} = ${F(Z2 - Z1 + a)}.`];
          if (bad === 2) steps[2] = `Lazım olan Z = ${Z2}; β⁻ sayı = ${Z1 - 2 * a} − ${Z2} = ${F(Z1 - 2 * a - Z2)}.`;
          why = [`1-ci addım: α-hissəcik ⁴₂He-dur, A-nı 4 azaldır (2 yox). α sayı ${a}, sonra β⁻ = ${b}.`,
            `2-ci addım: hər α Z-i 2 azaldır, 1 yox: Z = ${Z1} − ${2 * a} = ${Z1 - 2 * a}. Düz cavab: ${b}.`,
            `3-cü addım: β⁻ Z-i artırır, ona görə lazım olan Z-dən alınan Z-i çıxırıq: ${Z2} − ${Z1 - 2 * a} = ${b}. Sayı mənfi ola bilməz.`][bad];
        } else {
          const n = pick([3, 4]), k = rnd(1, 5), N0 = 6 * k * pow2(n), N = N0 / pow2(n), T = pick([2, 3, 4, 5, 6, 8]), t = n * T;
          task = `Nümunədə ilk anda ${N0} radioaktiv nüvə var. Yarımparçalanma dövrü T = ${T} saat. ${t} saat sonra neçə nüvə parçalanmış olar?`;
          steps = [
            `n = t/T = ${t}/${T} = ${n}.`,
            `Qalan nüvələr: N = N₀/${p2(n)} = ${N0}/${pow2(n)} = ${N}.`,
            `Parçalanan: N₀ − N = ${N0} − ${N} = ${N0 - N}.`,
          ];
          if (bad === 0) { const N1 = N0 / pow2(n + 1); steps = [`Başlanğıc anı da sayırıq: n = t/T + 1 = ${n + 1}.`, `Qalan nüvələr: N = N₀/${p2(n + 1)} = ${N0}/${pow2(n + 1)} = ${N1}.`, `Parçalanan: N₀ − N = ${N0} − ${N1} = ${N0 - N1}.`]; }
          if (bad === 1) { const N1 = N0 / (2 * n); steps = [steps[0], `Qalan nüvələr: N = N₀/(2·n) = ${N0}/${2 * n} = ${N1}.`, `Parçalanan: N₀ − N = ${N0} − ${N1} = ${N0 - N1}.`]; }
          if (bad === 2) steps[2] = `Parçalanan nüvələr qalan nüvələrə bərabərdir: ${N}.`;
          why = [`1-ci addım: n = t/T = ${n}; başlanğıc anı əlavə saymaq olmaz. Düz cavab: ${N0 - N}.`,
            `2-ci addım: hər dövrdə 2 dəfə azalma → n dəfə 2-yə bölürük, yəni 2ⁿ-ə (${pow2(n)}), 2n-ə yox. Düz cavab: ${N0 - N}.`,
            `3-cü addım: n = ${n} dövrdən sonra yarıdan çoxu parçalanıb, ${N0} − ${N} = ${N0 - N}; qalan ${N}-dir, parçalanan yox.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Karbon-14 ilə yaş təyini, tibbdə izotoplar, tüstü siqnalizatoru, radioaktiv çirklənmə — hamısı yarımparçalanma dövrüdür.",
      gen() {
        const kind = pick(["karbon", "iod", "tc", "co", "tustu", "sezium"]);
        if (kind === "karbon") {
          const n = rnd(1, 4);
          return R(n * 5700, "il", { text: `Arxeoloqlar qədim taxta parçası tapıb. Ondakı karbon-14 nüvələrinin miqdarı canlı ağacdakının 1/${pow2(n)} hissəsidir. Karbon-14-ün yarımparçalanma dövrünü 5700 il götür. Ağac neçə il əvvəl kəsilib?`,
            solution: `1/${pow2(n)} = 1/${p2(n)} → ${n} yarımparçalanma dövrü keçib. Yaş = ${n}·5700 = ${n * 5700} il. (Ağac kəsiləndən sonra yeni karbon-14 qəbul etmir, ona görə “saat” işləməyə başlayır.)` });
        }
        if (kind === "iod") {
          const n = rnd(2, 4), m = pick([5, 10, 15, 20, 25]), m0 = m * pow2(n);
          return R(m, "mkq", { text: `Qalxanabənzər vəzinin müalicəsi üçün xəstəyə ${m0} mikroqram iod-131 verilib. İod-131-in yarımparçalanma dövrü 8 gündür. ${8 * n} gün sonra bədəndə bu izotopdan neçə mikroqram qalar? (Orqanizmin çıxarması nəzərə alınmır.)`,
            solution: `n = ${8 * n}/8 = ${n}. m = ${m0}/${p2(n)} = ${m0}/${pow2(n)} = ${m} mkq.` });
        }
        if (kind === "tc") {
          const n = rnd(2, 4), m = pick([10, 15, 20, 25, 30]), A0 = m * pow2(n);
          return R(m, "MBq", { text: `Diaqnostika üçün texnesium-99m preparatının aktivliyi hazırlanarkən ${A0} MBq olub. Yarımparçalanma dövrü 6 saatdır. ${6 * n} saat sonra aktivlik neçə MBq olar?`,
            solution: `n = ${6 * n}/6 = ${n}. A = ${A0}/${p2(n)} = ${A0}/${pow2(n)} = ${m} MBq. Qısa dövr onu yaxşı edir: izotop tez “sönür”, xəstə az şüalanır.` });
        }
        if (kind === "co") {
          const n = rnd(2, 3), m = pick([5, 10, 20]), A0 = m * pow2(n);
          return R(m, "TBq", { text: `Şüa terapiyası qurğusundakı kobalt-60 mənbəyinin aktivliyi yeni olanda ${A0} TBq-dir. Yarımparçalanma dövrünü 5 il götür. ${5 * n} il sonra aktivlik neçə TBq olar?`,
            solution: `n = ${5 * n}/5 = ${n}. A = ${A0}/${pow2(n)} = ${m} TBq. Buna görə mənbəni bir neçə ildən bir dəyişirlər.` });
        }
        if (kind === "tustu") {
          const n = rnd(1, 4);
          return R(pow2(n), undefined, { text: `Tüstü siqnalizatorunda amerisium-241 mənbəyi var, yarımparçalanma dövrü 432 ildir. ${432 * n} il sonra mənbənin aktivliyi neçə dəfə azalar?`,
            solution: `n = ${432 * n}/432 = ${n}. Azalma ${p2(n)} = ${pow2(n)} dəfədir. (Mənbə onilliklərlə işləyir.)` });
        }
        const n = rnd(2, 4);
        return R(1 / pow2(n), undefined, { show: `1/${pow2(n)}`, tol: 0.0005, text: `Çirklənmiş torpaqda sezium-137 var, yarımparçalanma dövrü 30 ildir. ${30 * n} il sonra ilkin miqdarın neçədə biri qalar? (Kəsr kimi yaz: 1/8 formasında.)`,
          solution: `n = ${30 * n}/30 = ${n}. Qalan hissə 1/${p2(n)} = 1/${pow2(n)}.` });
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): RFO / lyceum mock — 10 A–E questions with a picture, several steps;
  // the wrong options are the answers of typical mistakes. Questions 5, 6, 7 and 10 also use "İmpuls", "Maqnit sahəsi",
  // "Kulon qanunu", "Enerjinin saxlanması".
  const { ae, again } = Oyun;
  const nice2 = x => isFinite(x) && Math.abs(x * 100 - Math.round(x * 100)) < 1e-6;
  const ok2 = x => isFinite(x) && x > 0 && nice2(x);
  const mc = (o, rest) => o && { ...rest, choices: o.choices, correct: o.correct, show: o.choices[o.correct] };
  const U_ = u => x => F(+x.toFixed(4)) + (u ? " " + u : "");
  // right answer + typical-mistake pool [value, name] -> five different options and a "Tələlər" sentence (null when fewer than four different wrong ones)
  const mk = (right, pool, fmt, okf = ok2) => {
    if (!okf(right)) return null;
    const seen = new Set([fmt(right).replace(/\s+/g, "")]), w = [], lab = [];
    for (const [x, nm] of pool) { if (!okf(x)) continue; const k = fmt(x).replace(/\s+/g, ""); if (seen.has(k)) continue; seen.add(k); w.push(x); lab.push(nm + " (" + fmt(x) + ")"); if (w.length === 4) break; }
    if (w.length < 4) return null;
    const o = ae(right, w, fmt);
    return o && { ...o, tr: "Tələlər: " + lab.join(", ") + "." };
  };
  // ratio F₂/F₁ as a small fraction: "2F₁", "F₁/4", "9F₁/8"
  const qOf = x => { for (let q = 1; q <= 64; q++) if (Math.abs(x * q - Math.round(x * q)) < 1e-9) return q; return 0; };
  const okR = x => isFinite(x) && x > 0 && x < 1000 && qOf(x) > 0;
  const rfmt = x => { const q = qOf(x), p = Math.round(x * q); return (p === 1 ? "" : p) + "F₁" + (q === 1 ? "" : "/" + q); };
  const ZSYM = {}; for (const k in SYM) ZSYM[SYM[k]] = k;
  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };

  // <svg-helpers>
  const SI = "var(--ink,#17171a)", SA = "var(--accent,#a32d2d)", SM = "var(--muted,#6b6b73)", SP = "var(--paper,#fff)", SV = "var(--vec,#0c447c)";
  const CP = "#c0392b", CN = "#8a8a93", CE = "#2a6fc9"; // proton red, neutron grey, electron blue (as the text says)
  const g1 = n => +(+n).toFixed(1);
  const sL = (x1, y1, x2, y2, c = SI, w = 2, ex = "") => `<line x1="${g1(x1)}" y1="${g1(y1)}" x2="${g1(x2)}" y2="${g1(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const sT = (x, y, s, a = "middle", c = SI, sz = 13) => `<text x="${g1(x)}" y="${g1(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const sC = (x, y, r, fill = "none", st = SI, w = 2, ex = "") => `<circle cx="${g1(x)}" cy="${g1(y)}" r="${g1(r)}" fill="${fill}" stroke="${st}" stroke-width="${w}"${ex}/>`;
  const sA = (x1, y1, x2, y2, c = SA, w = 2.5) => sL(x1, y1, x2, y2, c, w, ` marker-end="url(#at-ar)"`);
  const sS = (w, h, inner, aria) => `<svg viewBox="0 0 ${w} ${h}" class="oy-svg" role="img" aria-label="${aria}"><defs><marker id="at-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  const DASH = ` stroke-dasharray="4 3"`;

  // ion model: p protons (red), nn neutrons (grey) in the nucleus, e electrons on two shells (blue)
  function atomFig(p, nn, e) {
    const cx = 140, cy = 92, r1 = 44, r2 = 72, GA = 2.39996;
    let s = sC(cx, cy, r1, "none", SM, 1.2, DASH) + sC(cx, cy, r2, "none", SM, 1.2, DASH);
    const types = []; let ip = 0, iq = 0;
    while (ip < p || iq < nn) { if (ip < p && (ip <= iq || iq >= nn)) { types.push("p"); ip++; } else { types.push("n"); iq++; } }
    types.forEach((t, i) => {
      const rad = 6.8 * Math.sqrt(i + 0.5), an = i * GA, x = cx + rad * Math.cos(an), y = cy + rad * Math.sin(an);
      s += sC(x, y, 6.2, t === "p" ? CP : CN, t === "p" ? CP : CN, 1) + (t === "p" ? sT(x, y + 3.4, "+", "middle", "#fff", 10) : "");
    });
    const shell = (cnt, r, off) => { let o = ""; for (let k = 0; k < cnt; k++) { const an = off + 2 * Math.PI * k / cnt; o += sC(cx + r * Math.cos(an), cy + r * Math.sin(an), 4.6, CE, CE, 1); } return o; };
    s += shell(Math.min(e, 2), r1, -0.5) + shell(Math.max(0, e - 2), r2, 0.3);
    s += sC(26, 188, 5, CP, CP, 1) + sT(35, 192, "proton", "start", SI, 11) + sC(104, 188, 5, CN, CN, 1) + sT(113, 192, "neytron", "start", SI, 11) + sC(196, 188, 4.6, CE, CE, 1) + sT(205, 192, "elektron", "start", SI, 11);
    return sS(280, 200, s, "Ionun modeli: nüvədə qırmızı protonlar və boz neytronlar, orbitlərdə mavi elektronlar");
  }
  // isotope abundance: two bars (light isotope a, heavy isotope b)
  function barFig(a, b, pa, pb) {
    const y0 = 150, k = 1.2, X0 = 52;
    let s = sL(X0, y0, 270, y0, SI, 1.8) + sL(X0, y0, X0, 24, SI, 1.8);
    [25, 50, 75, 100].forEach(v => { s += sL(X0, y0 - k * v, 262, y0 - k * v, SM, 0.6) + sT(X0 - 6, y0 - k * v + 4, v, "end", SM, 11); });
    s += sT(X0 - 6, y0 + 4, 0, "end", SM, 11) + sT(X0 + 4, 16, "%", "start", SM, 11);
    [[a, pa, 78, SV], [b, pb, 178, SA]].forEach(([A, pc, x, c]) => {
      s += `<rect x="${x}" y="${g1(y0 - k * pc)}" width="56" height="${g1(k * pc)}" fill="${c}" opacity=".85"/>` + sT(x + 28, y0 - k * pc - 6, pc + " %") + sT(x + 28, y0 + 18, "A = " + A);
    });
    return sS(280, 170, s, "Elementin iki izotopunun təbiətdə faiz payı: sütunlu diaqram");
  }
  // N–Z diagram: start (filled) and end (hollow) nucleus
  function nzFig(Z0, N0, Z1, N1) {
    const x0 = 56, x1 = 268, y0 = 178, y1 = 24, zlo = Z1 - 2, zhi = Z0 + 2, nlo = N1 - 4, nhi = N0 + 4;
    const X = z => x0 + (z - zlo) / (zhi - zlo) * (x1 - x0 - 10), Y = n => y0 - (n - nlo) / (nhi - nlo) * (y0 - y1 - 6);
    let s = sL(x0, y0, x1, y0, SI, 1.8) + sL(x0, y0, x0, y1 - 4, SI, 1.8) + sT(x0 + 8, 14, "N (neytronların sayı)", "start", SI, 11) + sT(x1, y0 + 33, "Z (protonların sayı)", "end", SI, 11);
    [[Z0, N0], [Z1, N1]].forEach(([z, n]) => {
      s += sL(X(z), Y(n), x0, Y(n), SM, 1, DASH) + sL(X(z), Y(n), X(z), y0, SM, 1, DASH) + sT(X(z), y0 + 16, z) + sT(x0 - 6, Y(n) + 4, n, "end");
    });
    s += sC(X(Z0), Y(N0), 5.5, SA, SA, 1) + sT(X(Z0) - 9, Y(N0) - 9, "ilkin", "end", SA, 12);
    s += sC(X(Z1), Y(N1), 5.5, SP, SI, 2.5) + sT(X(Z1) + 10, Y(N1) - 9, "son", "start", SI, 12);
    return sS(290, 215, s, "N–Z diaqramında ilkin və son nüvənin yeri");
  }
  // N(t): N0 at t = 0 and the marked point (kT, N0/2^k)
  function hlFig(N0, k, T, unit) {
    const W = 300, H = 210, x0 = 60, y0 = 170, xw = 220, yh = 148, tmax = (k + 1) * T;
    const X = t => x0 + t / tmax * xw, Y = N => y0 - N / N0 * yh, tp = k * T, Np = N0 / 2 ** k;
    let d = ""; for (let i = 0; i <= 60; i++) { const t = tmax * i / 60; d += (i ? "L" : "M") + g1(X(t)) + " " + g1(Y(N0 * 2 ** (-t / T))); }
    let s = sL(x0, y0, x0 + xw + 14, y0, SI, 1.8) + sL(x0, y0, x0, 12, SI, 1.8) + `<path d="${d}" fill="none" stroke="${SV}" stroke-width="2.5"/>`;
    s += sL(x0, Y(Np), X(tp), Y(Np), SA, 1.4, DASH) + sL(X(tp), Y(Np), X(tp), y0, SA, 1.4, DASH) + sC(X(tp), Y(Np), 4, SA, SA, 1) + sC(x0, Y(N0), 4, SI, SI, 1);
    s += sT(x0 - 6, Y(N0) + 5, N0, "end") + sT(x0 - 6, Y(Np) + 5, Np, "end") + sT(X(tp), y0 + 18, tp) + sT(x0 - 6, y0 + 18, 0, "end") + sT(x0 + 8, 14, "N", "start") + sT(x0 + xw + 14, y0 + 34, "t, " + unit, "end");
    return sS(W, H, s, "Radioaktiv nümunədə qalan nüvələrin sayının zamandan asılılığı");
  }
  // alpha decay of a nucleus at rest: before / after, with a label on each arrow
  function decayFig(top, dn, labD, labA, bot) {
    let s = sT(12, 24, "əvvəl", "start", SM, 12) + sC(150, 40, 16, "none", SI, 2) + sT(176, 38, top, "start", SI, 13) + sT(176, 55, "sükunətdə", "start", SM, 11);
    s += sA(150, 64, 150, 88, SM, 2) + sT(12, 96, "sonra", "start", SM, 12);
    s += sC(100, 128, 14, "none", SI, 2) + sT(100, 162, dn, "middle", SI, 13) + sC(205, 128, 7, SV, SV, 1) + sT(205, 150, "α", "middle", SV, 13);
    s += sA(80, 128, 28, 128) + sT(54, 118, labD, "middle", SA, 12) + sA(216, 128, 270, 128) + sT(243, 118, labA, "middle", SA, 12);
    if (bot) s += sT(150, 190, bot, "middle", SA, 13);
    return sS(300, bot ? 198 : 172, s, "Sükunətdə olan nüvənin α-parçalanması: α-hissəcik bir tərəfə, qalan nüvə əks tərəfə uçur");
  }
  // two positive particles entering a field directed into the page: the force qv×B turns them to the left (not to scale; only "bigger / smaller" is shown)
  function magFig(l1, l2, bigger) {
    const r1 = bigger ? 40 : 70, r2 = bigger ? 70 : 40, arc = (r, c) => `<path d="M230 160 A${r} ${r} 0 0 0 ${230 - 2 * r} 160" fill="none" stroke="${c}" stroke-width="2.6"/>`;
    let s = ""; for (let i = 0; i < 7; i++) for (let j = 0; j < 3; j++) s += sT(30 + 40 * i, 62 + 36 * j, "×", "middle", SV, 17).replace('fill="' + SV + '"', 'fill="' + SV + '" opacity=".45"');
    s += arc(r1, SA) + arc(r2, SI) + sA(230, 192, 230, 166, SI, 2) + sC(230, 160, 3.2, SI, SI, 1) + sT(242, 186, "v", "start");
    const inner = [190, 144], mid = [160, 108];
    s += sT(...(bigger ? inner : mid), "1", "middle", SA, 14) + sT(...(bigger ? mid : inner), "2", "middle", SI, 14);
    s += sT(10, 16, "1 — " + l1, "start", SA, 12) + sT(10, 34, "2 — " + l2, "start", SI, 12) + sT(10, 194, "B ⊗ (şəkil miqyassızdır)", "start", SM, 10);
    return sS(300, 200, s, "Maqnit sahəsində (induksiya xətləri şəkil müstəvisinə perpendikulyar) iki hissəciyin dairəvi trayektoriyası");
  }
  // alpha particle near a nucleus: two cases (distance, force)
  function coulFig(Z1, s1, d1, Z2, s2, d2) {
    const px = d => 20 + 4 * d;
    let s = sL(150, 8, 150, 128, SM, 1, DASH);
    [[0, Z1, s1, d1, "F₁", "1-ci hal"], [150, Z2, s2, d2, "F₂ = ?", "2-ci hal"]].forEach(([ox, Z, sy, d, fl, ttl]) => {
      const nx = ox + 26, ax = nx + px(d), y = 64;
      s += sT(ox + 10, 18, ttl, "start", SM, 12) + sC(nx, y, 14, SA, SA, 1) + sT(nx, y + 4.5, sy, "middle", "#fff", 12) + sT(nx, y + 29, "Z = " + Z, "middle", SI, 11);
      s += sC(ax, y, 6, SV, SV, 1) + sT(ax, y + 22, "α", "middle", SV, 12) + sA(ax + 9, y, ax + 36, y) + sT(ax + 22, y - 12, fl, "middle", SA, 12);
      s += sL(nx, 104, ax, 104, SI, 1.4, ` marker-start="url(#at-ar)" marker-end="url(#at-ar)"`) + sT((nx + ax) / 2, 122, "d = " + d + "·10⁻¹⁴ m", "middle", SI, 11);
    });
    return sS(300, 136, s, "α-hissəcik və nüvə: iki halda məsafə və Kulon itələmə qüvvəsi");
  }
  // atom as a circle with a tiny nucleus; both diameters are given
  function sizeFig(dexp) {
    let s = sC(110, 84, 62, "var(--accent-soft,#f6e3e3)", SM, 1.6) + sC(110, 84, 2.6, SA, SA, 1) + sA(196, 40, 114, 82, SM, 1.4) + sT(200, 36, "nüvə: d = 10" + "⁻" + String(dexp).replace(/\d/g, x => "⁰¹²³⁴⁵⁶⁷⁸⁹"[x]) + " m", "start", SI, 12);
    s += sL(48, 160, 172, 160, SI, 1.6, ` marker-start="url(#at-ar)" marker-end="url(#at-ar)"`) + sT(110, 180, "atom: D = 10⁻¹⁰ m", "middle", SI, 12);
    return sS(300, 190, s, "Atomun diametri 10⁻¹⁰ m, nüvənin diametri daha kiçikdir (miqyassız)");
  }
  // sample of rock: one parent atom (red) and r daughter atoms (blue)
  function rockFig(r) {
    const tot = r + 1, step = 272 / tot, sz = Math.min(30, step - 3);
    let s = sT(14, 20, "Hər kvadrat eyni sayda atomdur", "start", SM, 12);
    for (let i = 0; i < tot; i++) s += `<rect x="${g1(14 + i * step)}" y="38" width="${g1(sz)}" height="${g1(sz)}" fill="${i === 0 ? SA : SV}" opacity=".9"/>`;
    s += `<rect x="14" y="94" width="14" height="14" fill="${SA}"/>` + sT(34, 106, "U (uran)", "start", SI, 12) + `<rect x="120" y="94" width="14" height="14" fill="${SV}"/>` + sT(140, 106, "Pb (qurğuşun)", "start", SI, 12);
    return sS(300, 120, s, "Süxur nümunəsindəki radioaktiv və parçalanma məhsulu atomlarının sayı kvadratlarla");
  }
  // </svg-helpers>

  const ION_IMT = [[2, 4, "He", 1], [3, 7, "Li", 1], [3, 7, "Li", 2], [4, 9, "Be", 2], [4, 9, "Be", 1], [5, 11, "B", 3], [5, 11, "B", 1], [6, 12, "C", 4], [6, 12, "C", 2], [7, 14, "N", -3], [8, 16, "O", -2], [8, 16, "O", -1]];
  const ISOM = [[35, 37], [10, 11], [63, 65], [20, 22], [107, 109], [79, 81], [69, 71], [85, 87]];
  const PART = [["proton ¹₁p", 1, 1], ["deyteron ²₁H", 2, 1], ["triton ³₁H", 3, 1], ["α-hissəcik ⁴₂He", 4, 2], ["³₂He nüvəsi", 3, 2]];
  const ADEC = DEC.filter(d => d[2] === "a");
  const lenFmt = x => x >= 1000 ? F(+(x / 1000).toFixed(4)) + " km" : F(+x.toFixed(4)) + " m";
  const IMT = { fenn: "fizika", vaxt: 60, suallar: [
    // 1. ion model → notation (count p, n, e; charge)
    { tip: "qapali", minVariety: 10, gen: () => again(() => {
      const [Z, A, s, c] = pick(ION_IMT), e = Z - c, N = A - Z, right = nuc(A, Z, ionStr(s, c));
      const w = [nuc(A, Z, ionStr(s, -c)), nuc(A, Z, s), sup(Z) + sub(A) + ionStr(s, c), nuc(Z + e, Z, ionStr(s, c))];
      const o = ae(right, w, x => x); if (!o) return null;
      return mc(o, { svg: svgEl(atomFig(Z, N, e)), text: `Şəkildə ${s} elementinin ionunun modeli verilib (qırmızı — proton, boz — neytron, mavi — elektron; nöqtələrin sayı hissəciklərin sayına bərabərdir). Bu ionun yazılışı hansıdır? (Yazılış: solda yuxarıda A, aşağıda Z, simvolun yanında ionun yükü.)`,
        solution: `Şəkildən sayırıq: proton ${Z}, neytron ${N}, elektron ${e}. A = ${Z} + ${N} = ${A}, Z = ${Z}. Yük = protonlar − elektronlar = ${Z} − ${e} = ${c > 0 ? "+" : "−"}${Math.abs(c)}: ${c > 0 ? "ion elektron itirib" : "ion elektron qəbul edib"}. Düz yazılış: ${right}. Tələlər: işarəni dəyişmək (${w[0]}), yükü unutmaq (${w[1]}), A ilə Z-i yerbəyer yazmaq (${w[2]}), neytronların yerinə elektronları saymaq (${w[3]}).` });
    }) },
    // 2. isotope abundance chart → mean atomic mass
    { tip: "qapali", gen: () => again(() => {
      const [a, b] = pick(ISOM), pb = pick([10, 20, 25, 30, 40, 60, 70, 75, 80, 90]), pa = 100 - pb, m = (a * pa + b * pb) / 100;
      if (!ok2(m)) return null;
      const o = mk(m, [[(a + b) / 2, "çəkini nəzərə almamaq, sadə orta"], [(a * pb + b * pa) / 100, "faizləri yerbəyer etmək"], [pb > pa ? b : a, "ən çox olan izotopun kütləsini götürmək"], [b * pb / 100, "yalnız ağır izotopu hesablamaq"]], U_("a.k.v."));
      return o && mc(o, { svg: svgEl(barFig(a, b, pa, pb)), text: `Tutaq ki, X elementi iki izotopun qarışığıdır; onların atom sayına görə faiz payları diaqramda verilib. X-in orta atom kütləsi neçə a.k.v.-dir? (İzotopun a.k.v. ilə ifadə olunmuş kütləsi kütlə ədədinə bərabər götürülür.)`,
        solution: `Orta kütlə çəkili ortadır: (${a}·${pa} + ${b}·${pb})/100 = ${F(+(a * pa / 100).toFixed(4))} + ${F(+(b * pb / 100).toFixed(4))} = ${F(+m.toFixed(4))} a.k.v. ${o.tr}` });
    }) },
    // 3. N–Z diagram → number of β⁻ (or α) in a chain
    { tip: "qapali", minVariety: 10, gen: () => again(() => {
      const [s1, A1, s2, A2] = pick(CHAINS), Z0 = SYM[s1], Z1 = SYM[s2], N0 = A1 - Z0, N1 = A2 - Z1, a = (A1 - A2) / 4, b = Z1 - Z0 + 2 * a, askA = Math.random() < .35;
      if (!Number.isInteger(a) || b < 1) return null;
      const right = askA ? a : b;
      const pool = askA ? [[b, "α ilə β-nı qarışdırmaq"], [a + b, "cəmi saymaq"], [(Z0 - Z1) / 2, "yalnız Z-in azalmasından α saymaq"], [(N0 - N1) / 2, "yalnız N-in azalmasından α saymaq"]]
        : [[a, "β ilə α-nı qarışdırmaq"], [a + b, "cəmi saymaq"], [Z0 - Z1, "Z-in azalmasını β sayı götürmək"], [(A1 - A2) / 2, "ΔA-nı 4 yox, 2-yə bölmək"]];
      const o = mk(right, pool, x => F(x)); if (!o) return null;
      return mc(o, { svg: svgEl(nzFig(Z0, N0, Z1, N1)), text: `N–Z diaqramında ilkin (●) və son (○) nüvənin yeri göstərilib. İlkin nüvə yalnız α və β⁻ parçalanmalar zənciri ilə sona çevrilib. Neçə ${askA ? "α" : "β⁻"}-parçalanma baş verib?`,
        solution: `Diaqramdan: ΔZ = ${Z1} − ${Z0} = ${F(Z1 - Z0)}, ΔN = ${N1} − ${N0} = ${F(N1 - N0)}. Kütlə ədədi ${A1 - A2} azalıb (ΔA = ΔZ + ΔN); hər α-parçalanmada A 4 vahid azalır: α sayı = ${A1 - A2}/4 = ${a}. ${a} α Z-i ${2 * a} azaldır, Z isə cəmi ${Z0 - Z1} azalıb; fərq ${b} β⁻-lardandır (hər β⁻ Z-i 1 artırır): β⁻ sayı = ${b}. Cavab: ${right}. ${o.tr}` });
    }) },
    // 4. N(t) graph: find T, then the number left later
    { tip: "qapali", gen: () => again(() => {
      const k = pick([2, 3]), m = pick([1, 2]), T = pick([2, 3, 4, 5, 6, 8, 10]), u = pick(["saat", "gün", "dəqiqə", "il"]), c = pick([8, 16, 24, 40, 48]);
      const N0 = c * 2 ** (k + m), N1 = N0 / 2 ** k, t1 = k * T, t2 = (k + m) * T;
      const o = mk(c, [[2 * c, "bir dövr əksik saymaq"], [c / 2, "bir dövr artıq saymaq"], [c * 2 ** k, "yalnız qrafikdən sonrakı " + m + " dövrü saymaq"], [c / 4, "iki dövr artıq saymaq"], [4 * c, "iki dövr əksik saymaq"], [N1 / m, "qrafikdəki nöqtənin qiymətini " + m + "-ə bölmək"]], x => F(x));
      return o && mc(o, { svg: svgEl(hlFig(N0, k, T, u)), text: `Qrafikdə radioaktiv nümunədə parçalanmamış nüvələrin sayının zamandan asılılığı verilib. ${t2} ${u} sonra neçə nüvə parçalanmamış qalacaq?`,
        solution: `Qrafikdən: ${t1} ${u} ərzində ${N0} → ${N1}, yəni ${2 ** k} = 2${sup(k)} dəfə azalma: ${k} yarımparçalanma dövrü keçib, T = ${t1}/${k} = ${T} ${u}. ${t2} ${u} üçün n = ${t2}/${T} = ${k + m}, N = ${N0}/2${sup(k + m)} = ${N0}/${2 ** (k + m)} = ${c}. ${o.tr}` });
    }) },
    // 5. alpha decay of a nucleus at rest (momentum): speed of the alpha particle
    { tip: "qapali", birlesik: "fiz-impuls", gen: () => again(() => {
      const D = dec(pick(ADEC)), w = pick([50, 60, 70, 75, 80]), A = D.A, vd = 4 * w, va = (A - 4) * w;
      const o = mk(va, [[vd, "sürətləri bərabər götürmək"], [A * w, "qalan nüvənin kütləsinə " + A + " yazmaq"], [2 * (A - 4) * w, "α-nın kütləsinə 2 yazmaq"], [4 * (A - 4) * w, "α-nın kütləsinə 1 yazmaq"]], U_("km/s"));
      return o && mc(o, { svg: svgEl(decayFig(nuc(D.A, D.Z, D.ps), nuc(D.Ad, D.Zd, D.ds), "v = " + vd + " km/s", "v_α = ?")), text: `Sükunətdə olan ${nuc(D.A, D.Z, D.ps)} nüvəsi α-parçalanma keçirdi (şəkil). Yaranan ${nuc(D.Ad, D.Zd, D.ds)} nüvəsi ${vd} km/s sürətlə hərəkət edir. α-hissəciyin sürəti nə qədərdir? (Nüvələrin kütlələrini kütlə ədədləri ilə mütənasib götür, γ-şüanın impulsunu nəzərə alma.)`,
        solution: `Sistem qapalıdır, əvvəl impuls 0 idi, deməli m_α·v_α = m_n·v_n. Kütlələr 4 və ${A - 4}: v_α = v_n·${A - 4}/4 = ${vd}·${A - 4}/4 = ${va} km/s. Yüngül hissəcik sürətlidir. ${o.tr}` });
    }) },
    // 6. two particles in a magnetic field: radius ratio (r = mv/(qB))
    { tip: "qapali", birlesik: "fiz-maqnit", gen: () => again(() => {
      const [P1, P2] = shuffle(PART).slice(0, 2), [n1, m1, q1] = P1, [n2, m2, q2] = P2, R0 = pick([6, 12, 18, 24, 30, 36]), r2 = R0 * (m2 / q2) / (m1 / q1);
      if (!ok2(r2) || r2 === R0) return null;
      const o = mk(r2, [[R0 * m2 / m1, "yükü unutmaq (yalnız kütlələrin nisbəti)"], [R0 * m1 * q2 / (m2 * q1), "nisbəti tərsinə yazmaq"], [R0 * m2 * q2 / (m1 * q1), "m·q vurmaq"], [R0 * q2 / q1, "kütləni unudub r ~ q götürmək"], [R0 * q1 / q2, "kütləni unudub r ~ 1/q götürmək"], [R0, "radiusların bərabər olduğunu fərz etmək"]], U_("sm"));
      return o && mc(o, { svg: svgEl(magFig(n1 + ", r₁ = " + R0 + " sm", n2 + ", r₂ = ?", r2 > R0)), text: `Eyni sürətlə bircins maqnit sahəsinə (induksiya xətləri şəkil müstəvisinə perpendikulyardır, sürət sahəyə perpendikulyardır) 1) ${n1} və 2) ${n2} daxil olub. 1-ci hissəciyin trayektoriyasının radiusu ${R0} sm-dir. 2-ci hissəciyin trayektoriyasının radiusu nə qədərdir? (Kütlə kütlə ədədi ilə mütənasibdir, yük Z·e-dir; qravitasiya və hissəciklərin qarşılıqlı təsiri nəzərə alınmır.)`,
        solution: `Lorens qüvvəsi mərkəzəyönlü qüvvə rolunu oynayır: qvB = mv²/r → r = mv/(qB). v və B eynidir, buna görə r ~ m/q. 1-ci: ${m1}/${q1} = ${F(m1 / q1)}, 2-ci: ${m2}/${q2} = ${F(m2 / q2)}. r₂ = ${R0}·${F(m2 / q2)}/${F(m1 / q1)} = ${F(+r2.toFixed(4))} sm. ${o.tr}` });
    }) },
    // 7. Coulomb repulsion of an alpha particle: another nucleus, another distance (ratio only)
    { tip: "qapali", birlesik: "fiz-kulon", gen: () => again(() => {
      const [za, zb] = pick([[6, 12], [6, 18], [10, 20], [13, 26], [7, 14], [8, 16], [3, 6], [4, 8], [2, 8], [5, 10], [10, 30]]), sw = Math.random() < .5, Z1 = sw ? zb : za, Z2 = sw ? za : zb;
      const d1 = pick([2, 3, 4, 6, 8, 12]), d2 = pick([1, 2, 3, 4, 6, 8, 12]);
      if (d1 === d2) return null;
      const zr = Z2 / Z1, dr = d1 / d2, rt = zr * dr * dr;
      const o = mk(rt, [[dr * dr, "nüvənin yükünü unutmaq"], [zr * dr, "məsafəni kvadrata yüksəltməmək"], [zr / (dr * dr), "məsafələrin nisbətini tərsinə yazmaq"], [dr * dr / zr, "yüklərin nisbətini tərsinə yazmaq"]], rfmt, okR);
      return o && mc(o, { svg: svgEl(coulFig(Z1, ZSYM[Z1], d1, Z2, ZSYM[Z2], d2)), text: `α-hissəcik ${ZSYM[Z1]} nüvəsindən (Z = ${Z1}) ${d1}·10⁻¹⁴ m məsafədə olanda onu itələyən Kulon qüvvəsi F₁-dir. α-hissəciyi ${ZSYM[Z2]} nüvəsinin (Z = ${Z2}) ${d2}·10⁻¹⁴ m yaxınlığına gətirsək, qüvvə F₂ nə qədər olar? (Cavabı F₁ ilə ifadə et. Nüvələr nöqtəvi yüklü götürülür, α-nın yükü 2e-dir.)`,
        solution: `Kulon qanunu: F = k·2e·Z·e/d², yəni F ~ Z/d². F₂/F₁ = (Z₂/Z₁)·(d₁/d₂)² = (${Z2}/${Z1})·(${d1}/${d2})² = ${F(+rt.toFixed(4))}. F₂ = ${rfmt(rt)}. ${o.tr}` });
    }) },
    // 8. atom and nucleus size: scale the nucleus up to a grain
    { tip: "qapali", gen: () => again(() => {
      const ne = pick([4, 5]), dm = pick([1, 2, 3, 4, 5, 6, 8]), n = 10 ** ne, right = dm * n / 1000, dx = "10⁻" + sup(10 + ne);
      const o = mk(right, [[right * 10, "mm-i sm kimi götürmək"], [right / 10, "qüvvətlərin fərqində bir vahid səhv (10 dəfə az)"], [right * 1000, "mm-i m kimi götürmək"], [right * 100, "qüvvətlərin fərqində iki vahid səhv (100 dəfə çox)"]], lenFmt);
      return o && mc(o, { svg: svgEl(sizeFig(10 + ne)), text: `Şəkildə atomun və nüvənin diametrləri verilib. Nüvəni diametri ${dm} mm olan dənəyə qədər böyütsək (atomun bütün ölçüləri eyni dəfə böyüyür), atomun diametri nə qədər olar?`,
        solution: `Atomun diametri nüvənin diametrindən 10⁻¹⁰/${dx} = 10${sup(ne)} dəfə böyükdür. Nüvə ${dm} mm olanda atom ${dm} mm·10${sup(ne)} = ${dm * n} mm = ${lenFmt(right)}. ${o.tr}` });
    }) },
    // 9. rock dating: parent : daughter ratio from the picture
    { tip: "qapali", gen: () => again(() => {
      const nn = pick([2, 3, 4]), r = 2 ** nn - 1, T = pick([1, 2, 3, 4, 5]), t = nn * T;
      const o = mk(t, [[r * T, "qurğuşunun urana nisbətini dövrlərin sayı götürmək"], [(r + 1) * T, "ilkin payların sayını dövr saymaq"], [(nn + 1) * T, "başlanğıcı da dövr kimi saymaq"], [(nn - 1) * T, "bir dövr əksik saymaq"], [r * T / 2, "nisbətin yarısını dövr götürmək"], [(r + 1) * T / 2, "ilkin payların sayının yarısını dövr götürmək"]], U_("mlrd il"));
      return o && mc(o, { svg: svgEl(rockFig(r)), text: `Süxur əmələ gələndə onda yalnız radioaktiv uran izotopu (U) olub, qurğuşun (Pb) olmayıb. İndi nümunədəki U və Pb atomlarının nisbəti şəkildəki kimidir (hər kvadrat eyni sayda atomu göstərir). Hər parçalanmış U atomu bir Pb atomuna çevrilir; helium və aralıq məhsullar nəzərə alınmır. Uranın yarımparçalanma dövrü T = ${T} mlrd ildir. Süxurun yaşı nə qədərdir? (Qurğuşun stabildir, nümunədən U və Pb atomu çıxıb-gəlmir.)`,
        solution: `Şəkildə ${r + 1} pay var: 1 pay U və ${r} pay Pb. Əvvəlcə hamısı U idi, yəni ${r + 1} pay; indi onun 1/${r + 1} hissəsi qalıb: ${r + 1} = 2${sup(nn)} → n = ${nn} yarımparçalanma dövrü. t = ${nn}·${T} = ${t} mlrd il. ${o.tr}` });
    }) },
    // 10. alpha decay: total kinetic energy (momentum conservation → E ~ 1/m)
    { tip: "qapali", birlesik: "fiz-enerji-saxlanma", gen: () => again(() => {
      const D = dec(pick(ADEC)), e = pick([0.02, 0.025, 0.03]), A = D.A, Ea = (A - 4) * e, Ed = 4 * e, Q = A * e;
      if (![Ea, Ed, Q].every(ok2)) return null;
      const o = mk(Q, [[Ea, "yalnız α-nın enerjisini götürmək"], [2 * Ea, "enerjiləri bərabər götürmək"], [Ea - Ed, "enerjiləri çıxmaq"], [Ed, "yalnız qalan nüvənin enerjisini götürmək"]], U_("MeV"));
      return o && mc(o, { svg: svgEl(decayFig(nuc(D.A, D.Z, D.ps), nuc(D.Ad, D.Zd, D.ds), "E_n", "E_α = " + F(+Ea.toFixed(4)) + " MeV", "Q = E_α + E_n = ?")), text: `Sükunətdə olan ${nuc(D.A, D.Z, D.ps)} nüvəsi α-parçalanma keçirdi (şəkil). α-hissəciyin kinetik enerjisi ${F(+Ea.toFixed(4))} MeV-dir. Parçalanmada ayrılan ümumi kinetik enerji Q = E_α + E_n (α-hissəcik və ${nuc(D.Ad, D.Zd, D.ds)} nüvəsi birlikdə) nə qədərdir? (Nüvələrin kütlələrini kütlə ədədləri ilə mütənasib götür, γ-şüanı nəzərə alma.)`,
        solution: `Əvvəl impuls 0 idi, deməli p_α = p_n. E = p²/(2m): eyni impulsda enerji kütləyə tərs mütənasibdir. E_n = E_α·m_α/m_n = ${F(+Ea.toFixed(4))}·4/${A - 4} = ${F(+Ed.toFixed(4))} MeV. Ümumi: Q = ${F(+Ea.toFixed(4))} + ${F(+Ed.toFixed(4))} = ${F(+Q.toFixed(4))} MeV. ${o.tr}` });
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
      key: "fiz-atom", title: "Atomun və nüvənin quruluşu", fenn: "fizika", link: "dersler/fiz-atom.html",
      format: "Cavab ədəddir. Hissəciklərin sayını sadəcə ədədlə yaz (məs. 143). Vahid varsa yanında göstərilib. Kəsr: 1/8, onluq: 12,5.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["terkib", "terkib", "izotop", "alfabeta", "zencir", "zencir", "yarim", "yarim", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-atom.html")) b.push("dersler/fiz-atom.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
