// Fizika · Maqnit sahəsi, Amper qüvvəsi, yüklü zərrəciyin hərəkəti — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution, unit}. SI units, g = 10 m/s².
(function () {
  const { h } = Oyun;
// Circuit SVG helpers (string based). Shared by lesson build and game files.
const CK = (() => {
  const INK = "var(--ink,#17171a)", ACC = "var(--accent,#a32d2d)", MUT = "var(--muted,#6b6b73)", PAP = "var(--paper,#fff)", VEC = "var(--vec,#0c447c)";
  const f = n => +(+n).toFixed(1);
  const line = (x1, y1, x2, y2, c = INK, w = 2, ex = "") => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${c}" stroke-width="${w}" stroke-linecap="round"${ex}/>`;
  const wire = (pts, c = INK, w = 2) => `<polyline points="${pts.map(p => f(p[0]) + "," + f(p[1])).join(" ")}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const text = (x, y, s, a = "middle", c = INK, sz = 13) => `<text x="${f(x)}" y="${f(y)}" text-anchor="${a}" font-size="${sz}" font-weight="700" fill="${c}" font-family="inherit">${s}</text>`;
  const dot = (x, y) => `<circle cx="${f(x)}" cy="${f(y)}" r="3.2" fill="${INK}"/>`;
  const arrow = (x1, y1, x2, y2, c = ACC, w = 2.5) => line(x1, y1, x2, y2, c, w, ` marker-end="url(#ck-ar)"`);
  const res = (x, y, d, lab) => d === "h"
    ? `<rect x="${f(x - 18)}" y="${f(y - 7)}" width="36" height="14" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + (lab ? text(x, y - 12, lab) : "")
    : `<rect x="${f(x - 7)}" y="${f(y - 16)}" width="14" height="32" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + (lab ? text(x + 12, y + 5, lab, "start") : "");
  // battery with + plate on top; wires are drawn by the caller with a gap between y-5 and y+5
  const bat = (x, y, lab, side = "r") => line(x - 13, y - 5, x + 13, y - 5, INK, 3) + line(x - 7, y + 5, x + 7, y + 5, INK, 3) + (side === "l" ? text(x + 17, y - 8, "+", "start", INK, 12) : text(x - 17, y - 8, "+", "end", INK, 12))
    + (lab ? (side === "r" ? text(x + 20, y + 4, lab, "start") : text(x - 20, y + 4, lab, "end")) : "");
  const lamp = (x, y, lab, pos) => `<circle cx="${f(x)}" cy="${f(y)}" r="11" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + line(x - 7.5, y - 7.5, x + 7.5, y + 7.5, INK, 1.6) + line(x - 7.5, y + 7.5, x + 7.5, y - 7.5, INK, 1.6) + (lab ? (pos === "r" ? text(x + 17, y + 5, lab, "start") : text(x, y - 17, lab)) : "");
  const meter = (x, y, ch) => `<circle cx="${f(x)}" cy="${f(y)}" r="12" fill="${PAP}" stroke="${INK}" stroke-width="2"/>` + text(x, y + 5, ch, "middle", INK, 14);
  // out-of-page (dot) / into-page (cross) symbol
  const sym = (x, y, into, r = 6) => `<circle cx="${f(x)}" cy="${f(y)}" r="${r}" fill="${PAP}" stroke="${INK}" stroke-width="1.6"/>` + (into ? line(x - r * .7, y - r * .7, x + r * .7, y + r * .7, INK, 1.6) + line(x - r * .7, y + r * .7, x + r * .7, y - r * .7, INK, 1.6) : `<circle cx="${f(x)}" cy="${f(y)}" r="2" fill="${INK}"/>`);
  const svg = (w, h, inner, cls, aria) => `<svg viewBox="0 0 ${f(w)} ${f(h)}"${cls ? ` class="${cls}"` : ""} role="img" aria-label="${aria || "Elektrik sxemi"}"><defs><marker id="ck-ar" viewBox="0 0 10 10" refX="9" refY="5" markerUnits="userSpaceOnUse" markerWidth="11" markerHeight="11" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="context-stroke"/></marker></defs>${inner}</svg>`;
  // net: battery + series resistors on the top wire + parallel branches (each branch = list of resistor labels)
  function net(o) {
    const ser = o.ser || [], br = o.br || [], yT = 36, yB = br.length ? 164 : 120, yM = (yT + yB) / 2, bx = 40;
    const sx = ser.map((_, i) => 80 + 60 * i);
    const xs = ser.length ? sx[sx.length - 1] + 50 : 120;
    const bxs = br.map((_, j) => xs + 70 * j);
    const xEnd = br.length ? bxs[bxs.length - 1] : sx[sx.length - 1] + 50;
    let s = wire([[bx, yM - 5], [bx, yT], [xEnd, yT]]) + wire([[bx, yM + 5], [bx, yB], [xEnd, yB]]);
    if (!br.length) s += line(xEnd, yT, xEnd, yB);
    ser.forEach((l, i) => { s += res(sx[i], yT, "h", l); });
    br.forEach((b, j) => {
      const x = bxs[j]; s += line(x, yT, x, yB);
      b.forEach((l, k) => { s += res(x, yT + (yB - yT) * (k + 1) / (b.length + 1), "v", l); });
      if (j < br.length - 1) s += dot(x, yT) + dot(x, yB);
    });
    s += bat(bx, yM, o.U);
    if (o.extra) s += o.extra;
    return svg(xEnd + 40, yB + 34, s, o.cls, o.aria);
  }
  // two-loop circuit: left branch (e1, r1), middle r3, right branch (r2, e2); + plates up
  function twoLoop(o) {
    const yT = 36, yB = 164, x1 = 100, x2 = 190, x3 = 280;
    let s = line(x1, yT, x3, yT) + line(x1, yB, x3, yB) + line(x2, yT, x2, yB) + dot(x2, yT) + dot(x2, yB);
    s += wire([[x1, yT], [x1, 71]]) + wire([[x1, 81], [x1, yB]]) + bat(x1, 76, o.e1, "l") + res(x1, 128, "v", o.r1).replace(/<text[^>]*>.*?<\/text>/, text(x1 - 12, 133, o.r1, "end"));
    s += wire([[x3, yT], [x3, 71]]) + wire([[x3, 81], [x3, yB]]) + bat(x3, 76, o.e2, "r") + res(x3, 128, "v", o.r2);
    s += res(x2, 100, "v", o.r3);
    return svg(x3 + 90, yB + 34, s, o.cls, o.aria || "Ikiconturlu elektrik sxemi");
  }
  return { INK, ACC, MUT, PAP, VEC, f, line, wire, text, dot, arrow, res, bat, lamp, meter, sym, svg, net, twoLoop };
})();

  const svgEl = s => { const d = document.createElement("div"); d.innerHTML = s; return d.firstChild; };
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const F = v => String(+(+v).toFixed(6)).replace("-", "−").replace(".", ",");
  const nice = (v, d) => Math.abs(v * 10 ** d - Math.round(v * 10 ** d)) < 1e-7;
  const R = (v, unit, extra) => Object.assign({ answer: v, show: F(v), unit, tol: v === 0 ? 0.001 : Math.max(1e-6, Math.abs(v) * 0.005) }, extra);
  const g = 10;
  const BS = [0.1, 0.2, 0.25, 0.4, 0.5, 0.8, 1, 1.5, 2];

  // ---- direction questions: x right, y up, z toward the reader. F = q·v×B (cross product) ----
  const DIRS = { "+x": [1, 0, 0], "-x": [-1, 0, 0], "+y": [0, 1, 0], "-y": [0, -1, 0], "+z": [0, 0, 1], "-z": [0, 0, -1] };
  const NAME = { "+x": "sağa", "-x": "sola", "+y": "yuxarı", "-y": "aşağı", "+z": "səhifədən sənə doğru (oxucuya tərəf)", "-z": "səhifənin içinə (oxucudan uzağa)" };
  const key = v => (v[0] > 0 ? "+x" : v[0] < 0 ? "-x" : v[1] > 0 ? "+y" : v[1] < 0 ? "-y" : v[2] > 0 ? "+z" : "-z");
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const symb = (x, y, into, r = 6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="var(--paper,#fff)" stroke="var(--ink,#17171a)" stroke-width="1.6"/>` +
    (into ? CK.line(x - r * .7, y - r * .7, x + r * .7, y + r * .7, CK.INK, 1.6) + CK.line(x - r * .7, y + r * .7, x + r * .7, y - r * .7, CK.INK, 1.6) : `<circle cx="${x}" cy="${y}" r="2" fill="${CK.INK}"/>`);
  function dirFig(a, b, la, lb) {
    let s = "";
    const bv = DIRS[b], av = DIRS[a];
    if (bv[2]) { for (const x of [50, 110, 170, 230]) for (const y of [30, 75, 120]) s += symb(x, y, bv[2] < 0); s += CK.text(262, 20, lb, "end", CK.VEC, 15); }
    else { const px = -bv[1], py = bv[0]; for (const o of [-48, 48]) { const cx = 130 + px * o, cy = 80 - py * o; s += CK.arrow(cx - bv[0] * 55, cy + bv[1] * 55, cx + bv[0] * 55, cy - bv[1] * 55, CK.VEC, 2); s += CK.text(cx + bv[0] * 66 + (bv[0] ? 0 : 10), cy - bv[1] * 66 + (bv[1] ? 0 : 5), lb, bv[0] ? "middle" : "start", CK.VEC, 14); } }
    if (av[2]) s += symb(130, 80, av[2] < 0, 11) + CK.text(150, 70, la, "start", CK.ACC, 15);
    else s += CK.arrow(130, 80, 130 + av[0] * 38, 80 - av[1] * 38, CK.ACC, 3.5) + CK.text(130 + av[0] * 52 + (av[0] ? 0 : 12), 80 - av[1] * 52 + (av[1] ? 4 : 5), la, av[0] ? "middle" : "start", CK.ACC, 15);
    return svgEl(CK.svg(270, 160, s, "oy-svg", "Sürət (və ya cərəyan) və maqnit sahəsi"));
  }
  const selFig = () => svgEl(CK.svg(280, 150,
    CK.line(30, 30, 250, 30, CK.INK, 3) + CK.line(30, 120, 250, 120, CK.INK, 3) + CK.text(262, 34, "+", "start") + CK.text(262, 124, "−", "start") +
    [70, 130, 190, 240].map(x => symb(x, 60, true, 5) + symb(x, 95, true, 5)).join("") +
    CK.arrow(40, 75, 100, 75, CK.ACC, 3) + CK.text(60, 68, "v", "middle", CK.ACC, 15) + CK.arrow(150, 42, 150, 62, CK.VEC, 2.5) + CK.text(166, 56, "E", "start", CK.VEC, 14) + CK.text(30, 146, "B səhifənin içinə", "start", CK.INK, 12), "oy-svg", "Sürət seçici: elektrik və maqnit sahələri"));

  const levels = [
    { id: "amper", ad: "Amper qüvvəsi F = BIl sinα", izah: "Maqnit sahəsində cərəyanlı naqilə təsir edən qüvvə: F = B·I·l·sinα (α — cərəyan ilə B arasındakı bucaq). B-nin vahidi tesla (T). 1 mT = 0,001 T, 1 sm = 0,01 m.",
      gen() {
        const kind = pick(["F", "F", "B", "I", "l", "alfa", "asili", "a"]);
        let B, I, l, Fv, al;
        if (kind === "F") { do { B = pick([0.05, 0.1, 0.2, 0.25, 0.4, 0.5, 1, 1.5, 2]); I = pick([1, 2, 2.5, 4, 5, 8, 10, 20]); l = pick([10, 20, 25, 40, 50, 80, 100]); Fv = B * I * l / 100; } while (!nice(Fv, 4));
          return R(Fv, "N", { text: `Cərəyanı ${F(I)} A olan düz naqil induksiyası ${F(B)} T olan bircins maqnit sahəsinə B xətlərinə perpendikulyar yerləşdirilib. Naqilin sahədəki hissəsinin uzunluğu ${l} sm-dir. Naqilə təsir edən Amper qüvvəsi nə qədərdir?`, solution: `l = ${l} sm = ${F(l / 100)} m. Naqil sahəyə perpendikulyardır (sin 90° = 1): F = B·I·l = ${F(B)}·${F(I)}·${F(l / 100)} = ${F(Fv)} N.` }); }
        if (kind === "B") { let m; do { I = pick([1, 2, 2.5, 4, 5, 10]); l = pick([10, 20, 25, 40, 50, 100]); B = pick(BS); Fv = B * I * l / 100; } while (!nice(Fv, 4));
          return R(B, "T", { text: `Maqnit sahəsinə perpendikulyar yerləşdirilmiş, uzunluğu ${l} sm və cərəyanı ${F(I)} A olan naqilə ${F(Fv)} N qüvvə təsir edir. Maqnit induksiyası nə qədərdir?`, solution: `B = F/(I·l) = ${F(Fv)}/(${F(I)}·${F(l / 100)}) = ${F(B)} T. (Bu, B-nin tərifidir: 1 A cərəyanlı 1 m naqilə 1 N qüvvə təsir edəndə B = 1 T.)` }); }
        if (kind === "I") { do { B = pick(BS); l = pick([10, 20, 25, 40, 50, 100]); I = pick([1, 2, 2.5, 4, 5, 8, 10]); Fv = B * I * l / 100; } while (!nice(Fv, 4));
          return R(I, "A", { text: `B = ${F(B)} T olan sahədə, sahəyə perpendikulyar yerləşən ${l} sm-lik naqilə ${F(Fv)} N qüvvə təsir edir. Naqildəki cərəyan nə qədərdir?`, solution: `I = F/(B·l) = ${F(Fv)}/(${F(B)}·${F(l / 100)}) = ${F(I)} A.` }); }
        if (kind === "l") { do { B = pick(BS); I = pick([1, 2, 4, 5, 10, 20]); l = pick([0.1, 0.2, 0.25, 0.4, 0.5, 1, 2]); Fv = B * I * l; } while (!nice(Fv, 4));
          return R(l, "m", { text: `Maqnit sahəsində (B = ${F(B)} T) sahəyə perpendikulyar olan, ${F(I)} A cərəyanlı naqilin sahədəki hissəsinə ${F(Fv)} N qüvvə təsir edir. Bu hissənin uzunluğu neçə metrdir?`, solution: `l = F/(B·I) = ${F(Fv)}/(${F(B)}·${F(I)}) = ${F(l)} m.` }); }
        if (kind === "alfa") { al = pick([30, 30, 0, 150]); const s = al === 0 ? 0 : 0.5;
          do { B = pick(BS); I = pick([2, 4, 5, 10, 20]); l = pick([0.2, 0.5, 1, 2, 4]); Fv = B * I * l * s; } while (!nice(Fv, 4));
          const dsc = al === 0 ? "B xətlərinə paralel" : `B xətləri ilə ${al}° bucaq əmələ gətirən`;
          return R(Fv, "N", { text: `${F(I)} A cərəyanlı, ${F(l)} m uzunluğunda naqil induksiyası ${F(B)} T olan sahədə ${dsc} yerləşib. Amper qüvvəsi nə qədərdir?`, solution: al === 0 ? "Naqil sahə boyunca yönəlib: α = 0°, sinα = 0 → F = 0. (Paralel naqilə Amper qüvvəsi təsir etmir.)" : `sin ${al}° = 0,5. F = B·I·l·sinα = ${F(B)}·${F(I)}·${F(l)}·0,5 = ${F(Fv)} N.` }); }
        if (kind === "asili") { let m; do { B = pick([0.1, 0.2, 0.25, 0.4, 0.5, 1, 2]); l = pick([0.2, 0.25, 0.4, 0.5, 1]); m = pick([10, 20, 25, 40, 50, 100, 200]); I = m / 1000 * g / (B * l); } while (!nice(I, 3));
          return R(I, "A", { text: `${m} q kütləli üfüqi mis çubuq ${F(l)} m uzunluqda, iki nazik naqildən asılıb. Çubuğa perpendikulyar üfüqi bircins sahə (B = ${F(B)} T) verilib və Amper qüvvəsi yuxarı yönəlib. Naqillərin dartılma qüvvəsi sıfır olması üçün çubuqdan nə qədər cərəyan keçməlidir? (g = 10 m/s²)`, solution: `Tarazlıq: Amper qüvvəsi ağırlığa bərabərdir: BIl = mg. m = ${m} q = ${F(m / 1000)} kq. I = mg/(Bl) = ${F(m / 1000 * g)}/(${F(B)}·${F(l)}) = ${F(I)} A.` }); }
        let m, a; do { B = pick(BS); I = pick([2, 4, 5, 10, 20]); l = pick([0.2, 0.5, 1]); m = pick([0.05, 0.1, 0.2, 0.25, 0.5]); a = B * I * l / m; } while (!nice(a, 3));
        return R(a, "m/s²", { text: `Sürtünməsiz üfüqi relslərin üstündə ${F(m)} kq kütləli, ${F(l)} m uzunluqlu çubuq var. Çubuqdan ${F(I)} A cərəyan keçir, sahə şaquli və çubuğa perpendikulyardır (B = ${F(B)} T). Çubuğun təcili nə qədərdir?`, solution: `Üfüqi istiqamətdə yalnız Amper qüvvəsi təsir edir: F = BIl = ${F(B)}·${F(I)}·${F(l)} = ${F(B * I * l)} N. a = F/m = ${F(B * I * l)}/${F(m)} = ${F(a)} m/s².` });
      } },
    { id: "istiqamet", ad: "Qüvvənin istiqaməti", izah: "Sol əl qaydası: B xətləri ovuca daxil olsun, dörd barmaq müsbət yükün (və ya cərəyanın) hərəkətini göstərsin — açılmış baş barmaq qüvvənin istiqamətidir. Mənfi yüklü zərrəcikdə nəticə əksinə çevrilir.",
      gen() {
        const ax = ["+x", "-x", "+y", "-y", "+z", "-z"];
        let a, b; do { a = pick(ax); b = pick(ax); } while (a[1] === b[1]);
        const wire = Math.random() < .4, neg = !wire && Math.random() < .4;
        let c = cross(DIRS[a], DIRS[b]); if (neg) c = c.map(v => -v);
        const ans = key(c), others = ax.filter(k => k !== ans).sort(() => Math.random() - .5).slice(0, 3);
        const opts = [ans, ...others].sort(() => Math.random() - .5), correct = opts.indexOf(ans);
        const who = wire ? "cərəyanlı naqil (cərəyan şəkildə oxla göstərilib)" : neg ? "mənfi yüklü zərrəcik (məsələn, elektron)" : "müsbət yüklü zərrəcik";
        const fig = dirFig(a, b, wire ? "I" : "v", "B");
        const zn = () => (a[1] === "z" || b[1] === "z") ? ` Rəsm müstəvisinə perpendikulyar istiqamətlər: "⊙" — sənə doğru, "⊗" — səndən uzağa.` : "";
        return { svg: fig, text: `Şəkildə ${wire ? "cərəyan" : "sürət"} ${NAME[a]}, maqnit induksiyası B ${NAME[b]} yönəlib. ${who[0].toUpperCase() + who.slice(1)} üçün qüvvənin istiqaməti hansıdır?${zn()}`, choices: opts.map(k => NAME[k]), correct, show: NAME[ans],
          solution: `Sol əl qaydası: ovuc B xətlərini qəbul edir, dörd barmaq ${wire ? "cərəyanı" : neg ? "müsbət yükün hərəkətini (mənfi yük üçün sürətin əksini)" : "sürəti"} göstərir. Baş barmaq ${neg ? "(mənfi yük üçün əks çevrilir) " : ""}qüvvəni göstərir: ${NAME[ans]}.` };
      } },
    { id: "lorens", ad: "Lorens qüvvəsi F = qvB sinα", izah: "Hərəkət edən yükə maqnit sahəsinin göstərdiyi qüvvə: F = |q|·v·B·sinα. Qüvvə həmişə sürətə perpendikulyardır, ona görə iş görmür. Burada q mikrokulonla (µC), qüvvə isə mikronyutonla (µN) ifadə olunur: 1 µC·1 m/s·1 T = 1 µN.",
      gen() {
        const kind = pick(["F", "F", "v", "B", "q", "alfa", "iki"]);
        let q, v, B, Fv;
        if (kind === "F") { do { q = pick([1, 2, 3, 4, 5, 10, 20]); v = pick([10, 20, 50, 100, 200, 500, 1000]); B = pick(BS); Fv = q * v * B; } while (!nice(Fv, 3));
          return R(Fv, "µN", { text: `${q} µC yüklü zərrəcik induksiyası ${F(B)} T olan maqnit sahəsinə perpendikulyar ${v} m/s sürətlə uçur. Zərrəciyə təsir edən Lorens qüvvəsi neçə mikronyutondur (µN)?`, solution: `F = qvB = ${q}·${v}·${F(B)} = ${F(Fv)} µN (µC·m/s·T = µN).` }); }
        if (kind === "v") { do { q = pick([1, 2, 4, 5, 10]); v = pick([10, 20, 50, 100, 200, 500]); B = pick(BS); Fv = q * v * B; } while (!nice(Fv, 3));
          return R(v, "m/s", { text: `${q} µC yüklü zərrəcik B = ${F(B)} T olan sahəyə perpendikulyar uçur və ona ${F(Fv)} µN qüvvə təsir edir. Zərrəciyin sürəti nə qədərdir?`, solution: `v = F/(qB) = ${F(Fv)}/(${q}·${F(B)}) = ${v} m/s.` }); }
        if (kind === "B") { do { q = pick([1, 2, 4, 5, 10]); v = pick([10, 20, 50, 100, 200, 500]); B = pick(BS); Fv = q * v * B; } while (!nice(Fv, 3));
          return R(B, "T", { text: `${q} µC yüklü zərrəcik ${v} m/s sürətlə maqnit sahəsinə perpendikulyar uçur, ona ${F(Fv)} µN qüvvə təsir edir. Sahənin induksiyası nə qədərdir?`, solution: `B = F/(qv) = ${F(Fv)}/(${q}·${v}) = ${F(B)} T.` }); }
        if (kind === "q") { do { q = pick([1, 2, 4, 5, 10, 20]); v = pick([10, 20, 50, 100, 200, 500]); B = pick(BS); Fv = q * v * B; } while (!nice(Fv, 3));
          return R(q, "µC", { text: `Zərrəcik induksiyası ${F(B)} T olan sahəyə perpendikulyar ${v} m/s sürətlə uçur və ona ${F(Fv)} µN qüvvə təsir edir. Zərrəciyin yükü neçə mikrokulondur (µC)?`, solution: `q = F/(vB) = ${F(Fv)}/(${v}·${F(B)}) = ${q} µC.` }); }
        if (kind === "alfa") { do { q = pick([2, 4, 5, 10, 20]); v = pick([10, 20, 50, 100, 200, 500]); B = pick(BS); Fv = q * v * B * 0.5; } while (!nice(Fv, 3));
          return R(Fv, "µN", { text: `${q} µC yüklü zərrəcik ${v} m/s sürətlə B = ${F(B)} T olan sahədə sürəti B xətləri ilə 30° bucaq əmələ gətirəcək şəkildə uçur. Lorens qüvvəsi neçə µN-dur?`, solution: `F = qvB·sinα = ${q}·${v}·${F(B)}·0,5 = ${F(Fv)} µN (sin 30° = 0,5).` }); }
        do { q = pick([1, 2, 4, 5, 10]); v = pick([10, 20, 50, 100, 200, 500]); B = pick(BS); Fv = q * v * B; } while (!nice(Fv, 3));
        const k = pick([2, 3, 4]);
        return R(Fv * k * k, "µN", { text: `${q} µC yüklü zərrəcik B = ${F(B)} T sahəsinə perpendikulyar ${v} m/s ilə uçanda ona ${F(Fv)} µN qüvvə təsir edir. Sürəti də, sahənin induksiyasını da ${k} dəfə artırsaq qüvvə neçə µN olar?`, solution: `F = qvB: iki vuruğun hər biri ${k} dəfə artır, qüvvə ${k}·${k} = ${k * k} dəfə artır: ${F(Fv)}·${k * k} = ${F(Fv * k * k)} µN.` });
      } },
    { id: "radius", ad: "Dairəvi hərəkət: r = mv/(qB)", izah: "Zərrəcik B-yə perpendikulyar uçanda Lorens qüvvəsi mərkəzəyönlü qüvvənin rolunu oynayır: qvB = mv²/r → r = mv/(qB), ω = qB/m, T = 2πm/(qB) — dövr sürətdən asılı deyil. Burada m mq-la, q µC-la verilir: 1 mq/1 µC = 1 kq/C.",
      gen() {
        const kind = pick(["r", "r", "v", "B", "omega", "Tb", "Tv", "ratio", "ratio2"]);
        let m, q, v, B, r;
        if (kind === "r") { do { m = pick([1, 2, 4, 5, 10]); q = pick([1, 2, 4, 5, 10]); v = pick([10, 20, 50, 100, 200, 500]); B = pick(BS); r = m / q * v / B; } while (!nice(r, 3) || r < 0.002 || r > 100);
          return R(r, "m", { text: `Kütləsi ${m} mq, yükü ${q} µC olan toz zərrəciyi induksiyası ${F(B)} T olan maqnit sahəsinə perpendikulyar ${v} m/s sürətlə daxil olur. Zərrəcik hansı radiuslu çevrə üzrə hərəkət edəcək? Cavabı metrlə yaz.`, solution: `Lorens qüvvəsi mərkəzəyönlü qüvvənin rolunu oynayır: qvB = mv²/r → r = mv/(qB). m/q = ${m} mq/${q} µC = ${F(m / q)} kq/C. r = ${F(m / q)}·${v}/${F(B)} = ${F(r)} m.` }); }
        if (kind === "v") { do { m = pick([1, 2, 4, 5, 10]); q = pick([1, 2, 4, 5, 10]); v = pick([10, 20, 50, 100, 200, 500]); B = pick(BS); r = m / q * v / B; } while (!nice(r, 3) || r < 0.002 || r > 100);
          return R(v, "m/s", { text: `Kütləsi ${m} mq, yükü ${q} µC olan zərrəcik B = ${F(B)} T sahəsində sahəyə perpendikulyar uçaraq ${F(r)} m radiuslu çevrə cızır. Zərrəciyin sürəti nə qədərdir?`, solution: `r = mv/(qB) → v = qBr/m = (${q}/${m})·${F(B)}·${F(r)} = ${v} m/s.` }); }
        if (kind === "B") { do { m = pick([1, 2, 4, 5, 10]); q = pick([1, 2, 4, 5, 10]); v = pick([10, 20, 50, 100, 200, 500]); B = pick(BS); r = m / q * v / B; } while (!nice(r, 3) || r < 0.002 || r > 100);
          return R(B, "T", { text: `Kütləsi ${m} mq, yükü ${q} µC olan zərrəcik ${v} m/s sürətlə maqnit sahəsinə perpendikulyar daxil olur və ${F(r)} m radiuslu çevrə üzrə hərəkət edir. Sahənin induksiyası nə qədərdir?`, solution: `B = mv/(qr) = (${m}/${q})·${v}/${F(r)} = ${F(B)} T.` }); }
        if (kind === "omega") { do { m = pick([1, 2, 4, 5, 10]); q = pick([1, 2, 4, 5, 10, 20]); B = pick(BS); } while (!nice(q / m * B, 3));
          return R(q / m * B, "rad/s", { text: `Kütləsi ${m} mq, yükü ${q} µC olan zərrəcik B = ${F(B)} T olan sahədə sahəyə perpendikulyar çevrə üzrə hərəkət edir. Onun bucaq sürəti ω nə qədərdir?`, solution: `ω = qB/m = (${q}/${m})·${F(B)} = ${F(q / m * B)} rad/s. (q/m = ${q} µC/${m} mq = ${F(q / m)} C/kq.)` }); }
        if (kind === "Tb") { let T1, n; do { T1 = pick([2, 3, 4, 6, 8, 12, 20]); n = pick([2, 3, 4, 5]); } while (!nice(T1 / n, 3));
          return R(T1 / n, "s", { text: `Maqnit sahəsində yüklü zərrəciyin çevrə üzrə dövr müddəti ${T1} s-dir. Sahənin induksiyasını ${n} dəfə artırsaq (sürət eyni qalır), dövr neçə saniyə olar?`, solution: `T = 2πm/(qB): T induksiya ilə tərs mütənasibdir. T' = ${T1}/${n} = ${F(T1 / n)} s.` }); }
        if (kind === "Tv") { const T1 = pick([2, 3, 4, 5, 6, 10]), n = pick([2, 3, 5]);
          return R(T1, "s", { text: `Maqnit sahəsində yüklü zərrəciyin çevrə üzrə dövr müddəti ${T1} s-dir. Zərrəciyin sürətini ${n} dəfə artırsaq (sahə eyni qalır, zərrəcik yenə perpendikulyar uçur), dövr neçə saniyə olar?`, solution: `T = 2πm/(qB) sürətdən asılı deyil. Sürət ${n} dəfə artanda radius ${n} dəfə artır, amma çevrə də ${n} dəfə uzanır. Dövr dəyişmir: ${T1} s.` }); }
        const P = [["proton", 1, 1], ["deyteron", 2, 1], ["alfa-zərrəcik", 4, 2], ["tritium nüvəsi", 3, 1], ["helium-3 nüvəsi", 3, 2]];
        if (kind === "ratio") { let A, Bp, rt; do { A = pick(P); Bp = pick(P); rt = (A[1] / A[2]) / (Bp[1] / Bp[2]); } while (A === Bp || !nice(rt, 3) || rt === 1);
          return R(rt, "dəfə", { text: `İki zərrəcik eyni sürətlə eyni bircins maqnit sahəsinə perpendikulyar daxil olur. Birinci zərrəcik: ${A[0]} (kütlə ədədi ${A[1]}, yükü ${A[2]} elementar yük). İkinci zərrəcik: ${Bp[0]} (kütlə ədədi ${Bp[1]}, yükü ${Bp[2]} elementar yük). Birinci zərrəciyin trayektoriyasının radiusu ikincininkindən neçə dəfə böyükdür?`, solution: `r = mv/(qB) → eyni v və B-də r ∼ m/q. Birinci: m/q = ${A[1]}/${A[2]} = ${F(A[1] / A[2])}; ikinci: ${Bp[1]}/${Bp[2]} = ${F(Bp[1] / Bp[2])}. Nisbət: ${F(A[1] / A[2])}/${F(Bp[1] / Bp[2])} = ${F(rt)}.` }); }
        let A, Bp, rt; do { A = pick(P); Bp = pick(P); rt = Bp[2] / A[2]; } while (A === Bp || A[2] === Bp[2]);
        return R(rt, "dəfə", { text: `İki zərrəcik eyni impulsla (m·v eyni) eyni bircins maqnit sahəsinə perpendikulyar daxil olur. Birinci zərrəcik: ${A[0]}, yükü ${A[2]} elementar yük. İkinci zərrəcik: ${Bp[0]}, yükü ${Bp[2]} elementar yük. Birinci zərrəciyin radiusu ikincininkindən neçə dəfə böyükdür?`, solution: `r = p/(qB) → eyni p və B-də r ∼ 1/q. r₁/r₂ = q₂/q₁ = ${Bp[2]}/${A[2]} = ${F(rt)}.` });
      } },
    { id: "secici", ad: "Sürət seçici", izah: "Elektrik (E) və maqnit (B) sahələri qarşılıqlı perpendikulyardırsa, qüvvələr tarazlaşan zərrəcik düz xətt üzrə keçir: qE = qvB → v = E/B. Sonra yalnız maqnit sahəsində çevrə cızır: r = mv/(qB).",
      gen() {
        const kind = pick(["v", "v", "E", "B", "r"]);
        let E, B, v, m, q, B2, r;
        if (kind === "v") { do { E = pick([100, 200, 400, 500, 1000, 2000, 5000]); B = pick([0.1, 0.2, 0.25, 0.4, 0.5, 1, 2]); v = E / B; } while (!nice(v, 2));
          return R(v, "m/s", { svg: selFig(), text: `Sürət seçicidə elektrik sahəsinin şiddəti E = ${E} V/m, maqnit induksiyası B = ${F(B)} T-dir (sahələr qarşılıqlı perpendikulyardır). Seçicidən düz xətt üzrə keçən zərrəciyin sürəti nə qədərdir?`, solution: `Düz xətt üzrə keçmək üçün elektrik və maqnit qüvvələri bərabər olmalıdır: qE = qvB → v = E/B = ${E}/${F(B)} = ${F(v)} m/s.` }); }
        if (kind === "E") { do { v = pick([10, 20, 50, 100, 200, 500, 1000]); B = pick([0.1, 0.2, 0.25, 0.4, 0.5, 1, 2]); E = v * B; } while (!nice(E, 2));
          return R(E, "V/m", { svg: selFig(), text: `Sürət seçicidə maqnit induksiyası ${F(B)} T-dir. Sürəti ${v} m/s olan zərrəciklərin düz xətt üzrə keçməsi üçün elektrik sahəsinin şiddəti nə qədər olmalıdır?`, solution: `qE = qvB → E = vB = ${v}·${F(B)} = ${F(E)} V/m.` }); }
        if (kind === "B") { do { E = pick([100, 200, 400, 500, 1000, 2000]); v = pick([100, 200, 500, 1000, 2000, 4000]); B = E / v; } while (!nice(B, 3) || B > 5);
          return R(B, "T", { svg: selFig(), text: `Sürət seçicidə E = ${E} V/m. Sürəti ${v} m/s olan zərrəciklər düz xətt üzrə keçir. Maqnit induksiyası nə qədərdir?`, solution: `qE = qvB → B = E/v = ${E}/${v} = ${F(B)} T.` }); }
        do { E = pick([100, 200, 400, 500, 1000, 2000]); B = pick([0.1, 0.2, 0.25, 0.4, 0.5, 1, 2]); B2 = pick([0.1, 0.2, 0.25, 0.4, 0.5, 1, 2]); m = pick([1, 2, 4, 5, 10]); q = pick([1, 2, 4, 5, 10]); v = E / B; r = m / q * v / B2; } while (!nice(v, 2) || !nice(r, 3) || r < 0.002 || r > 200);
        return R(r, "m", { svg: selFig(), text: `Kütləsi ${m} mq, yükü ${q} µC olan zərrəcik sürət seçicidən (E = ${E} V/m, B = ${F(B)} T) düz xətt üzrə keçir, sonra yalnız maqnit sahəsi olan (B₂ = ${F(B2)} T) bölgəyə perpendikulyar daxil olur. Çevrənin radiusu neçə metrdir?`, solution: `Seçicidən: v = E/B = ${E}/${F(B)} = ${F(v)} m/s. İkinci sahədə: r = mv/(qB₂) = ${F(m / q)}·${F(v)}/${F(B2)} = ${F(r)} m. (m/q = ${m} mq/${q} µC = ${F(m / q)} kq/C.)` });
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        let task, steps, why;
        if (Math.random() < .5) {
          let B, I, l, Fv; do { B = pick([0.1, 0.2, 0.25, 0.4, 0.5, 1, 2]); I = pick([2, 4, 5, 10]); l = pick([10, 20, 25, 40, 50]); Fv = B * I * l / 100 * 0.5; } while (!nice(Fv, 4));
          task = `${l} sm uzunluqlu, ${I} A cərəyanlı naqil induksiyası ${F(B)} T olan sahədə B xətləri ilə 30° bucaq altında yerləşib. Amper qüvvəsi neçə nyutondur?`;
          steps = [`Amper qüvvəsi: F = B·I·l·sinα, sin 30° = 0,5.`, `Uzunluq: l = ${l} sm = ${F(l / 100)} m.`, `F = ${F(B)}·${I}·${F(l / 100)}·0,5 = ${F(Fv)} N.`];
          if (bad === 0) { const w = B * I * l / 100 * Math.sqrt(3) / 2; steps = [`Amper qüvvəsi: F = B·I·l·cosα, cos 30° = 0,866.`, `Uzunluq: l = ${l} sm = ${F(l / 100)} m.`, `F = ${F(B)}·${I}·${F(l / 100)}·0,866 = ${F(+w.toFixed(4))} N.`]; }
          if (bad === 1) { const w = B * I * l * 0.5; steps[1] = `Uzunluq: l = ${l} sm (metrə çevirmək lazım deyil).`; steps[2] = `F = ${F(B)}·${I}·${l}·0,5 = ${F(+w.toFixed(4))} N.`; }
          if (bad === 2) steps[2] = `F = ${F(B)}·${I}·${F(l / 100)}·0,5 = ${F(+(Fv * 2).toFixed(4))} N.`;
          why = [`1-ci addım: Amper qüvvəsində sinα durur (α — cərəyan ilə B arasındakı bucaq), cosα yox. Düz cavab: ${F(Fv)} N.`, `2-ci addım: SI-də uzunluq metrlə yazılır: ${l} sm = ${F(l / 100)} m. Düz cavab: ${F(Fv)} N.`, `3-cü addım: ${F(B)}·${I}·${F(l / 100)}·0,5 = ${F(Fv)}, hesablama səhvi var.`][bad];
        } else {
          let m, q, v, B, r; do { m = pick([2, 4, 5, 10]); q = pick([1, 2, 4, 5]); v = pick([20, 50, 100, 200]); B = pick([0.1, 0.2, 0.5, 1, 2]); r = m / q * v / B; } while (!nice(r, 3) || r < 0.01 || r > 100);
          task = `Kütləsi ${m} mq, yükü ${q} µC olan zərrəcik B = ${F(B)} T sahəsinə perpendikulyar ${v} m/s sürətlə daxil olur. Çevrənin radiusu neçə metrdir?`;
          steps = [`Lorens qüvvəsi mərkəzəyönlü qüvvəni yaradır: qvB = mv²/r.`, `Buradan r = mv/(qB).`, `m = ${m}·10⁻⁶ kq, q = ${q}·10⁻⁶ C: r = ${m}·10⁻⁶·${v}/(${q}·10⁻⁶·${F(B)}) = ${F(r)} m.`];
          if (bad === 0) { const w = m / q / B; steps = [`Lorens qüvvəsi mərkəzəyönlü qüvvəni yaradır: qvB = mv/r.`, `Buradan r = m/(qB).`, `m = ${m}·10⁻⁶ kq, q = ${q}·10⁻⁶ C: r = ${m}·10⁻⁶/(${q}·10⁻⁶·${F(B)}) = ${F(+w.toFixed(4))} m.`]; }
          if (bad === 1) { const w = q / m * B / v; steps[1] = `Buradan r = qB/(mv).`; steps[2] = `m = ${m}·10⁻⁶ kq, q = ${q}·10⁻⁶ C: r = ${q}·10⁻⁶·${F(B)}/(${m}·10⁻⁶·${v}) = ${F(+w.toFixed(5))} m.`; }
          if (bad === 2) steps[2] = `m = ${m}·10⁻³ kq, q = ${q}·10⁻⁶ C: r = ${m}·10⁻³·${v}/(${q}·10⁻⁶·${F(B)}) = ${F(r * 1000)} m.`;
          why = [`1-ci addım: mərkəzəyönlü qüvvə mv²/r-dir (v kvadratda). Düz: r = mv/(qB) = ${F(r)} m.`, `2-ci addım: qvB = mv²/r-dən r = mv/(qB) alınır, tərsinə yox. Düz cavab: ${F(r)} m.`, `3-cü addım: 1 mq = 10⁻⁶ kq (1 q = 10⁻³ kq). Düz cavab: ${F(r)} m.`][bad];
        }
        const text = h("div", {}, h("p", {}, task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Dinamik, elektrik mühərriki, Yerin sahəsi, maqnit levitasiyası — hamısında F = BIl.",
      gen() {
        const kind = pick(["dinamik", "yer", "relsli", "levit"]);
        let B, I, l, F0, a, m;
        if (kind === "dinamik") { do { B = pick([0.5, 0.8, 1, 1.2, 1.5]); I = pick([0.1, 0.2, 0.25, 0.5, 1]); l = pick([5, 10, 12, 15, 20]); F0 = B * I * l; } while (!nice(F0, 3));
          return R(F0, "N", { text: `Dinamikin (səsucaldanın) sarğısı maqnitin sahəsində yerləşir: sahənin induksiyası ${F(B)} T, sarğının sahədəki məftilinin ümumi uzunluğu ${l} m, cərəyan ${F(I)} A. Məftil sahəyə perpendikulyardır. Membranı hərəkət etdirən qüvvə nə qədərdir?`, solution: `F = B·I·l = ${F(B)}·${F(I)}·${l} = ${F(F0)} N. (Cərəyan dəyişdikcə qüvvə dəyişir, membran titrəyir və səs yaranır.)` }); }
        if (kind === "yer") { let Bm; do { Bm = pick([40, 50, 60]); I = pick([100, 200, 300, 500]); l = pick([10, 20, 30, 50]); F0 = Bm * I * l / 1e6; } while (!nice(F0, 4));
          return R(F0, "N", { text: `Yerin maqnit induksiyası təxminən ${Bm} µT-dır. Üfüqi, B-yə perpendikulyar yerləşən ${l} m uzunluqlu elektrik naqilindən ${I} A cərəyan keçir. Yerin sahəsinin naqilə göstərdiyi Amper qüvvəsi neçə nyutondur?`, solution: `B = ${Bm} µT = ${F(Bm / 1e6)} T. F = B·I·l = ${F(Bm / 1e6)}·${I}·${l} = ${F(F0)} N. (Çox kiçik qüvvədir: naqilin ağırlığı ilə müqayisədə nəzərə alınmır.)` }); }
        if (kind === "relsli") { do { B = pick([0.5, 1, 2]); I = pick([50, 100, 200, 500]); l = pick([0.1, 0.2, 0.5]); m = pick([0.05, 0.1, 0.2, 0.5]); a = B * I * l / m; } while (!nice(a, 2) || a > 5000);
          return R(a, "m/s²", { text: `Relsotron modelində: sürtünməsiz üfüqi relslərdə ${F(m)} kq kütləli keçirici çubuq (uzunluğu ${F(l)} m) yerləşir, rels ətrafında şaquli sahə B = ${F(B)} T-dir. Çubuqdan ${I} A cərəyan keçirilir. Çubuğun təcili nə qədərdir?`, solution: `F = BIl = ${F(B)}·${I}·${F(l)} = ${F(B * I * l)} N. a = F/m = ${F(B * I * l)}/${F(m)} = ${F(a)} m/s².` }); }
        do { B = pick([0.05, 0.1, 0.2, 0.25, 0.5]); l = pick([0.1, 0.2, 0.25, 0.5]); m = pick([5, 10, 20, 25, 50]); I = m / 1000 * g / (B * l); } while (!nice(I, 3));
        return R(I, "A", { text: `Maqnit levitasiyası modelində: ${F(l)} m uzunluqlu ${m} q kütləli üfüqi çubuq perpendikulyar üfüqi sahədə (B = ${F(B)} T) yuxarı yönəlmiş Amper qüvvəsi hesabına havada asılı qalır. Cərəyan neçə amperdir? (g = 10 m/s²)`, solution: `BIl = mg → I = mg/(Bl) = ${F(m / 1000)}·10/(${F(B)}·${F(l)}) = ${F(I)} A.` });
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "fiz-maqnit", title: "Maqnit sahəsi, Amper qüvvəsi, yüklü zərrəciyin hərəkəti", fenn: "fizika", link: "dersler/fiz-maqnit.html",
      format: "Cavab ədəddir, vahid yanında yazılıb (N, T, A, m, m/s; Lorens qüvvəsi µN ilə). Onluq kəsr vergül və ya nöqtə ilə: 0,25. g = 10 m/s².",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["amper", "amper", "istiqamet", "lorens", "lorens", "radius", "radius", "secici", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/fiz-maqnit.html")) b.push("dersler/fiz-maqnit.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
