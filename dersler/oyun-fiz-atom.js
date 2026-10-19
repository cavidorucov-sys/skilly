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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-atom", title: "Atomun və nüvənin quruluşu", fenn: "fizika", link: "dersler/fiz-atom.html",
      format: "Cavab ədəddir. Hissəciklərin sayını sadəcə ədədlə yaz (məs. 143). Vahid varsa yanında göstərilib. Kəsr: 1/8, onluq: 12,5.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["terkib", "terkib", "izotop", "alfabeta", "zencir", "zencir", "yarim", "yarim", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-atom.html")) b.push("dersler/fiz-atom.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
