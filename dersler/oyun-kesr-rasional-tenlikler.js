// Kəsr-rasional tənliklər — mastery game levels (DMQ, linear, quadratic, extraneous roots, word problems) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);                       // number with a real minus sign
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  // polynomial from [coef, "x²"|"x"|""] terms: [[1,"x²"],[-5,"x"],[6,""]] → "x² − 5x + 6"
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const lin = p => poly([[1, "x"], [-p, ""]]);                          // x − p
  const den = p => p === 0 ? "x" : "(" + lin(p) + ")";                  // denominator x − p, with brackets when needed
  const distinct = (n, a, b, not = []) => { const out = []; while (out.length < n) { const v = rnd(a, b); if (!out.includes(v) && !not.includes(v)) out.push(v); } return out; };
  const roots = rs => rs.map(S).join(" və ");

  // word-problem tables, built once (only nice numbers)
  const PIPES = [];   // first pipe x h, second x + a h, together T minutes
  for (let x = 2; x <= 12; x++) for (let a = 1; a <= 8; a++) { const m = 60 * x * (x + a); if (m % (2 * x + a) === 0) PIPES.push([x, a, m / (2 * x + a)]); }
  const BOOKS = [];   // N manat, price p, a manat cheaper → k more books
  for (let p = 3; p <= 20; p++) for (let a = 1; a < p; a++) for (let n = 2; n <= 20; n++) { const N = n * p; if (N > 240 || N % (p - a)) continue; const k = N / (p - a) - n; if (k >= 1 && k <= 6) BOOKS.push([N, p, a, k]); }
  const BOATS = [];   // own speed v, current u, distance d each way, total time t
  for (let v = 6; v <= 20; v++) for (let u = 1; u <= 4 && u < v - 1; u++) { const l = (v + u) * (v - u) / gcd(v + u, v - u); for (let d = l; d <= 120; d += l) BOATS.push([v, u, d, d / (v + u) + d / (v - u)]); }
  const hm = m => (Math.floor(m / 60) ? Math.floor(m / 60) + " saat" : "") + (m % 60 ? (m >= 60 ? " " : "") + (m % 60) + " dəqiqə" : "");

  const levels = [
    { id: "dmq", ad: "DMQ: məxrəc ≠ 0", izah: "Hansı x-lərdə ifadənin mənası yoxdur? Hər məxrəci sıfıra bərabər edib həll et.",
      gen() {
        const kind = pick(["lin", "count", "count", "quad"]);
        if (kind === "lin") {
          const k = rnd(2, 6), m = pick([-1, 1]) * rnd(1, 15), a = rnd(-9, 9);
          return { text: `İfadə: (${lin(-a)})/(${poly([[k, "x"], [-m, ""]])}). x-in hansı qiymətində bu ifadənin mənası yoxdur?`, answer: m / k, show: frac(m, k), placeholder: "məs. 5/2",
            solution: `Məxrəc sıfır ola bilməz: ${poly([[k, "x"], [-m, ""]])} = 0 → ${k}x = ${S(m)} → x = ${frac(m, k)}. Surət burada rol oynamır.` };
        }
        if (kind === "quad") {
          const [r1, r2] = distinct(2, -7, 7), big = Math.random() < .5;
          const ans = big ? Math.max(r1, r2) : Math.min(r1, r2);
          return { text: `İfadə: ${rnd(1, 9)}/(${poly([[1, "x²"], [-(r1 + r2), "x"], [r1 * r2, ""]])}). DMQ-ya daxil olmayan x qiymətlərindən ${big ? "ən böyüyünü" : "ən kiçiyini"} tap.`, answer: ans, show: S(ans), tol: 0.01,
            solution: `${poly([[1, "x²"], [-(r1 + r2), "x"], [r1 * r2, ""]])} = 0 → x = ${S(Math.min(r1, r2))} və x = ${S(Math.max(r1, r2))} (Viyet: cəm ${S(r1 + r2)}, hasil ${S(r1 * r2)}). Bu iki qiymət DMQ-ya daxil deyil; ${big ? "böyüyü" : "kiçiyi"} ${S(ans)}.` };
        }
        // count: two fractions, each denominator excludes some x values
        const p = rnd(1, 6), q = pick([-1, 1]) * rnd(1, 7);
        const D = [
          { s: `x² − ${p * p}`, bad: [p, -p], w: `x² − ${p * p} = 0 → x = ±${p}` },
          { s: `x² + ${p * p}`, bad: [], w: `x² + ${p * p} heç vaxt sıfır olmur` },
          { s: lin(q), bad: [q], w: `${lin(q)} = 0 → x = ${S(q)}` },
          { s: "x", bad: [0], w: "x = 0" },
          { s: lin(p), bad: [p], w: `${lin(p)} = 0 → x = ${p}` },
          { s: "5", bad: [], w: "5 — ədəddir, sıfır olmur" },
        ];
        const i = rnd(0, D.length - 1); let j = rnd(0, D.length - 1); while (j === i || (D[i].s === D[j].s)) j = rnd(0, D.length - 1);
        const br = x => /^[x0-9]+$/.test(x) ? x : "(" + x + ")";
        const set = [...new Set([...D[i].bad, ...D[j].bad])];
        return { text: `İfadə: ${rnd(1, 9)}/${br(D[i].s)} + ${rnd(1, 9)}/${br(D[j].s)}. Neçə x qiyməti DMQ-ya daxil deyil?`, answer: set.length, show: String(set.length), tol: 0.01,
          solution: `${D[i].w}; ${D[j].w}. ` + (set.length ? `Qadağan qiymətlər: ${set.sort((a, b) => a - b).map(S).join("; ")} — cəmi ${set.length}.` : "Heç bir qadağan qiymət yoxdur — cavab 0.") };
      } },
    { id: "xetti", ad: "Xətti tənliyə gətir", izah: "DMQ → çarpaz vur və ya ortaq məxrəcə vur → xətti tənlik → kökü DMQ ilə yoxla. x = ?",
      gen() {
        if (Math.random() < .5) {
          const r = rnd(-6, 9), [p, q] = distinct(2, -6, 6, [r]), k = rnd(1, 3);
          let a = k * (r - p), b = k * (r - q); const g = gcd(Math.abs(a), Math.abs(b)); a /= g; b /= g;
          return { text: `${S(a)}/${den(p)} = ${S(b)}/${den(q)}. x = ?`, answer: r, show: S(r), tol: 0.01,
            solution: `DMQ: x ≠ ${S(p)}, x ≠ ${S(q)}. Çarpaz vur: ${S(a)}${den(q)} = ${S(b)}${den(p)} → ${poly([[a - b, "x"]])} = ${S(a * q - b * p)} → x = ${S(r)}. ${S(r)} qadağan deyil — kökdür.` };
        }
        const r = rnd(-6, 10), [b] = distinct(1, -6, 6, [r]), c = pick([2, 3, 4, 5, -1, -2, -3]), a = c * (r - b) - r;
        return { text: `(${lin(-a)})/${den(b)} = ${S(c)}. x = ?`, answer: r, show: S(r), tol: 0.01,
          solution: `DMQ: x ≠ ${S(b)}. Məxrəcə vur: ${lin(-a)} = ${S(c)}${den(b)} → ${lin(-a)} = ${poly([[c, "x"], [-c * b, ""]])} → ${poly([[1 - c, "x"]])} = ${S(-c * b - a)} → x = ${S(r)}. ${S(r)} ≠ ${S(b)} — kökdür.` };
      } },
    { id: "kvadrat", ad: "Kvadrat tənliyə gətir", izah: "Məxrəcə vur, kvadrat tənlik al, həll et, DMQ ilə yoxla.",
      gen() {
        const ask = pick(["big", "small", "sum"]);
        const word = { big: "Böyük kökü tap.", small: "Kiçik kökü tap.", sum: "Köklərin cəmini tap." }[ask];
        const out = (rs, text, steps) => { const ans = ask === "big" ? Math.max(...rs) : ask === "small" ? Math.min(...rs) : rs[0] + rs[1];
          return { text: text + " " + word, answer: ans, show: S(ans), tol: 0.01, solution: steps + ` Köklər: ${roots(rs.slice().sort((a, b) => a - b))} — ikisi də DMQ-dadır. Cavab: ${S(ans)}.` }; };
        if (Math.random() < .5) {
          const [r1, r2] = distinct(2, -8, 8, [0]), t = r1 * r2, s = r1 + r2;
          return out([r1, r2], `x ${t < 0 ? "−" : "+"} ${Math.abs(t)}/x = ${S(s)}.`,
            `DMQ: x ≠ 0. x-ə vur: ${poly([[1, "x²"], [t, ""]])} = ${S(s)}x → ${poly([[1, "x²"], [-s, "x"], [t, ""]])} = 0.`);
        }
        const [r1, r2] = distinct(2, -7, 7), [p] = distinct(1, -6, 6, [r1, r2]), q = r1 + r2 - p, a = (r1 - p) * (r1 - q);
        return out([r1, r2], `${S(a)}/${den(p)} = ${lin(q)}.`,
          `DMQ: x ≠ ${S(p)}. ${den(p)}-ə vur: ${S(a)} = ${den(p)}${den(q)} → ${poly([[1, "x²"], [-(p + q), "x"], [p * q - a, ""]])} = 0.`);
      } },
    { id: "kenar", ad: "Kənar kök", izah: "Kvadrat tənliyin bir kökü məxrəci sıfır edə bilər — onu at! Kök yoxdursa, köklərin sayı 0-dır.",
      gen() {
        const kind = pick(["sq", "frac0", "pair", "pair", "none", "three"]), countQ = Math.random() < .4;
        const fin = (text, valid, steps) => countQ || !valid.length
          ? { text: text + " Tənliyin neçə kökü var?", answer: valid.length, show: String(valid.length), tol: 0.01, solution: steps + ` Köklərin sayı: ${valid.length}.` }
          : { text: text + " Tənliyin kökünü tap.", answer: valid[0], show: S(valid[0]), tol: 0.01, solution: steps + ` Cavab: x = ${S(valid[0])}.` };
        if (kind === "sq") {
          const p = pick([-1, 1]) * rnd(1, 9);
          return fin(`x²/${den(p)} = ${p * p}/${den(p)}.`, [-p], `DMQ: x ≠ ${S(p)}. Məxrəcləri eynidir → x² = ${p * p} → x = ±${Math.abs(p)}. x = ${S(p)} məxrəci sıfır edir — atılır.`);
        }
        if (kind === "frac0") {
          const p = rnd(-7, 7), [r] = distinct(1, -7, 7, [p, -p]), two = Math.random() < .5 && p !== 0;
          const d = two ? `(x² − ${p * p})` : den(p);
          return fin(`(${poly([[1, "x²"], [-(p + r), "x"], [p * r, ""]])})/${d} = 0.`, [r],
            `Kəsr sıfırdırsa, surət sıfırdır, məxrəc yox. DMQ: ${two ? `x ≠ ±${Math.abs(p)}` : `x ≠ ${S(p)}`}. Surət = 0 → x = ${S(p)} və x = ${S(r)}. x = ${S(p)} atılır.`);
        }
        if (kind === "none") {
          const p = rnd(-6, 6), a = rnd(-9, 9);
          return fin(`(${lin(-a)})/${den(p)} = ${S(p + a)}/${den(p)}.`, [], `DMQ: x ≠ ${S(p)}. Surətlər bərabər olmalıdır: ${lin(-a)} = ${S(p + a)} → x = ${S(p)}. Amma x = ${S(p)} qadağandır — kök yoxdur.`);
        }
        if (kind === "three") { // x/(x − p) − r/(x + p) = 2pr/(x² − p²): roots −p (extraneous) and r
          const p = rnd(1, 6), [r] = distinct(1, -8, 8, [0, p, -p]);
          return fin(`x/${den(p)} ${r < 0 ? "+" : "−"} ${Math.abs(r)}/${den(-p)} = ${S(2 * p * r)}/(x² − ${p * p}).`, [r],
            `DMQ: x ≠ ±${p}. (x² − ${p * p})-ə vur: x${den(-p)} ${r < 0 ? "+" : "−"} ${Math.abs(r)}${den(p)} = ${S(2 * p * r)} → ${poly([[1, "x²"], [p - r, "x"], [-p * r, ""]])} = 0 → x = ${S(-p)} və x = ${S(r)}. x = ${S(-p)} atılır.`);
        }
        // pair: x²/(x − p) = (s x − t)/(x − p), x² − s x + t = 0 has roots r1, r2; p may equal one of them
        const [r1, r2] = distinct(2, -7, 7, [0]), hit = Math.random() < .65, p = hit ? r1 : distinct(1, -7, 7, [r1, r2, 0])[0];
        const s = r1 + r2, t = r1 * r2, valid = [r1, r2].filter(x => x !== p).sort((a, b) => a - b);
        const q = { text: `x²/${den(p)} = (${poly([[s, "x"], [-t, ""]])})/${den(p)}.`, steps: `DMQ: x ≠ ${S(p)}. x² = ${poly([[s, "x"], [-t, ""]])} → ${poly([[1, "x²"], [-s, "x"], [t, ""]])} = 0 → x = ${S(r1)} və x = ${S(r2)}.` + (hit ? ` x = ${S(p)} atılır.` : ` İkisi də DMQ-dadır.`) };
        if (valid.length === 2 && !countQ) { const ans = valid[0] + valid[1];
          return { text: q.text + " Köklərin cəmini tap.", answer: ans, show: S(ans), tol: 0.01, solution: q.steps + ` Cəm: ${S(ans)}.` }; }
        return fin(q.text, valid, q.steps);
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const [p, r] = distinct(2, 1, 9), s = p + r, t = p * r;
        const steps = [
          `1) DMQ: ${lin(p)} ≠ 0, yəni x ≠ ${p}.`,
          `2) Məxrəci atırıq: x² = ${s}x − ${t} → x² − ${s}x + ${t} = 0 → x₁ = ${p}, x₂ = ${r}.`,
          `3) x = ${p} DMQ-ya daxil deyil, atılır. Cavab: x = ${r}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = pick([`1) DMQ: ${lin(-p)} ≠ 0, yəni x ≠ −${p}.`, `1) DMQ: x ≠ 0.`]);
        if (bad === 1) steps[1] = `2) Məxrəci atırıq: x² = ${s}x − ${t} → x² − ${s}x + ${t} = 0 → x₁ = −${p}, x₂ = −${r}.`;
        if (bad === 2) steps[2] = pick([`3) Hər iki kök yarayır. Cavab: x = ${p} və x = ${r}.`, `3) x = ${r} atılır. Cavab: x = ${p}.`]);
        const text = h("div", {}, h("p", {}, `Tənlik: x²/(${lin(p)}) = (${s}x − ${t})/(${lin(p)}).`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st.slice(3)))));
        const why = [`1-ci addım: məxrəc ${lin(p)}-dir, ona görə qadağan qiymət x = ${p}-dir.`,
          `2-ci addım: x² − ${s}x + ${t} = 0-ın kökləri ${p} və ${r}-dir (cəm ${s}, hasil ${t}), mənfi deyil.`,
          `3-cü addım: x = ${p} məxrəci sıfır edir, onu atmaq lazımdır. Düz cavab x = ${r}.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
    { id: "hesab", ad: "Həyatdan", izah: "Məsələ → rasional tənlik. Mənfi kök (mənfi sürət, mənfi vaxt, mənfi qiymət) atılır.",
      gen() {
        const kind = pick(["boat", "pipe", "book"]);
        if (kind === "boat") {
          const [v, u, d, t] = pick(BOATS);
          return { text: `Qayıq çayın axını ilə ${d} km, sonra axına qarşı yenə ${d} km üzdü və buna cəmi ${t} saat sərf etdi. Çayın axın sürəti ${u} km/saatdır. Qayığın durğun sudakı sürəti neçə km/saatdır?`,
            answer: v, unit: "km/saat", show: String(v), tol: 0.01,
            solution: `x — qayığın sürəti. ${d}/(x + ${u}) + ${d}/(x − ${u}) = ${t} → ${t}x² − ${2 * d}x − ${t * u * u} = 0. Kökləri ${v} və mənfi ədəd (atılır). Yoxla: ${d}/${v + u} + ${d}/${v - u} = ${d / (v + u)} + ${d / (v - u)} = ${t}. Cavab: ${v} km/saat.` };
        }
        if (kind === "pipe") {
          const [x, a, T] = pick(PIPES), g = gcd(T, 60);
          return { text: `Birinci boru hovuzu ikincidən ${a} saat tez doldurur. İki boru birlikdə hovuzu ${hm(T)}${T % 60 ? "yə" : "a"} doldurur. Birinci boru təkbaşına hovuzu neçə saata doldurar?`,
            answer: x, unit: "saat", show: String(x), tol: 0.01,
            solution: (T % 60 ? `${hm(T)} = ${frac(T, 60)} saat. ` : "") + `x — birincinin vaxtı: 1/x + 1/(x + ${a}) = ${frac(60, T)}. Kvadrat tənliyin kökləri ${x} və mənfi ədəd (atılır). Yoxla: 1/${x} + 1/${x + a} = ${frac(2 * x + a, x * (x + a))} ✓. Cavab: ${x} saat.` };
        }
        const [N, p, a, k] = pick(BOOKS);
        return { text: `${N} manata eyni qiymətli bir neçə kitab alındı. Hər kitab ${a} manat ucuz olsaydı, eyni pula ${k} kitab çox almaq olardı. Bir kitab neçə manatdır?`,
          answer: p, unit: "manat", show: String(p), tol: 0.01,
          solution: `x — kitabın qiyməti. ${N}/(x − ${a}) − ${N}/x = ${k} → ${k}x² − ${k * a}x − ${N * a} = 0. Kökləri ${p} və mənfi ədəd (atılır). Yoxla: ${N}/${p - a} − ${N}/${p} = ${N / (p - a)} − ${N / p} = ${k}. Cavab: ${p} manat.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "kesr-rasional-tenlikler", title: "Kəsr-rasional tənliklər", fenn: "riyaziyyat", link: "dersler/kesr-rasional-tenlikler.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 5/2 (onluq 2.5 də olar). Kök yoxdursa və köklərin sayı soruşulursa — 0.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["dmq", "xetti", "xetti", "kvadrat", "kvadrat", "kenar", "kenar", "kenar", "hesab", "hesab"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/kesr-rasional-tenlikler.html")) b.push("dersler/kesr-rasional-tenlikler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
