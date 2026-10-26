// Çoxhədlilərin bölünməsi, Bezu teoremi, qeyri-müəyyən əmsallar (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nz = (a, b) => { let v = 0; while (!v) v = rnd(a, b); return v; };
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);                       // number with a real minus sign
  const B = n => n < 0 ? "(" + S(n) + ")" : String(n);                  // negative number in brackets
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = n => String(n).split("").map(d => SUP[+d]).join("");
  const xp = e => e === 0 ? "" : e === 1 ? "x" : "x" + sup(e);
  // polynomial from [coef, exponent] terms: [[1,3],[-2,1],[5,0]] → "x³ − 2x + 5"
  const poly = ts => { let o = ""; for (const [c, e] of ts) { if (!c) continue; const a = Math.abs(c), body = e ? (a === 1 ? xp(e) : a + xp(e)) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const arr = cs => poly(cs.map((c, i) => [c, cs.length - 1 - i]));    // [1,-2,0,5] → x³ − 2x² + 5
  const lin = a => poly([[1, 1], [-a, 0]]);                             // x − a
  const br = a => a === 0 ? "x" : "(" + lin(a) + ")";                   // (x − a), or plain x when a = 0
  const ev = (cs, x) => cs.reduce((s, c) => s * x + c, 0);
  const sum = ts => ts.map((t, i) => i ? (t < 0 ? " − " + (-t) : " + " + t) : S(t)).join("");   // "−8 + 12 − 10 + 1"
  const kx = (m, v) => m === 1 ? v : m === -1 ? "−" + v : S(m) + v;     // 4k, −k
  const pq = a => (a === 0 ? "" : a === 1 ? "p + " : a === -1 ? "−p + " : S(a) + "p + ") + "q";

  const levels = [
    { id: "bolme", ad: "Bucaqlı bölmə və Horner", izah: "P(x) = (x − a)·Q(x) + r. Horner sxemi: əmsalları yaz (buraxılan dərəcələr üçün 0), birincini endir, sonra hər dəfə «əvvəlki · a + növbəti əmsal».",
      gen() {
        const a = nz(-4, 4), deg = pick([3, 3, 4]);
        const q = [1]; for (let i = 1; i < deg; i++) q.push(rnd(-6, 6));
        const r = rnd(-9, 9);
        const P = []; for (let i = 0; i <= deg; i++) P.push((i < deg ? q[i] : 0) - a * (i > 0 ? q[i - 1] : 0));
        P[deg] += r;
        const steps = []; let prev = P[0];
        for (let i = 1; i <= deg; i++) { const v = prev * a + P[i]; steps.push(`${S(prev)}·${B(a)} + ${B(P[i])} = ${S(v)}`); prev = v; }
        const ask = pick(["r", "r", "q0", "q1", "qs"]);
        const word = { r: "Qalıq neçədir?", q0: "Qismətin sərbəst həddi neçədir?", q1: "Qismətdə x-in əmsalı neçədir?", qs: "Qismətin bütün əmsallarının cəmi neçədir?" }[ask];
        const ans = ask === "r" ? r : ask === "q0" ? q[deg - 1] : ask === "q1" ? q[deg - 2] : q.reduce((s, v) => s + v, 0);
        return { text: `${arr(P)} çoxhədlisini ${lin(a)} ikihədlisinə bölürük. ${word}`, answer: ans, show: S(ans), tol: 0.01,
          solution: `Horner (a = ${S(a)}), əmsallar: ${P.map(S).join("; ")}. Birinci 1 endirilir, sonra: ${steps.join(", ")}. Qismət Q(x) = ${arr(q)}, qalıq ${S(r)}.` + (ask === "qs" ? ` Əmsallar cəmi: ${sum(q)} = ${S(ans)}.` : ` Cavab: ${S(ans)}.`) };
      } },
    { id: "bezu", ad: "Bezu teoremi: qalıq = P(a)", izah: "P(x)-i x − a-ya böldükdə qalıq P(a)-dır. x + a üçün P(−a), 2x − 1 üçün P(1/2) hesabla.",
      gen() {
        const kind = pick(["big", "big", "small", "half"]);
        if (kind === "big") {
          const a = pick([1, -1]), n = rnd(20, 120), m = rnd(2, 19), k = nz(-6, 6), l = nz(-6, 6), c = rnd(-9, 9);
          const ts = [[1, n], [k, m], [l, 1], [c, 0]], vals = ts.map(([co, e]) => co * (a === 1 || e % 2 === 0 ? 1 : -1)), ans = vals.reduce((s, v) => s + v, 0);
          return { text: `${poly(ts)} çoxhədlisini ${lin(a)} ikihədlisinə böldükdə qalıq neçədir?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Bezu teoremi: qalıq = P(${S(a)}). ` + (a === 1 ? "1-in istənilən qüvvəti 1-dir. " : "(−1)-in cüt qüvvəti 1, tək qüvvəti −1-dir. ") + `P(${S(a)}) = ${sum(vals.filter((v, i) => v || i === 0))} = ${S(ans)}.` };
        }
        if (kind === "small") {
          const deg = rnd(3, 5), a = pick([2, -2, 3, -3]), cs = [nz(-3, 3)];
          for (let i = 1; i <= deg; i++) cs.push(rnd(-5, 5));
          const vals = cs.map((c, i) => c * a ** (deg - i)), ans = ev(cs, a);
          return { text: `${arr(cs)} çoxhədlisini ${lin(a)} ikihədlisinə böldükdə qalıq neçədir?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Bezu: qalıq = P(${S(a)}). Hər həddi hesabla: ${sum(vals.filter(v => v))} = ${S(ans)}. (Horner sxemi də eyni cavabı verir.)` };
        }
        const p = pick([2, 3]), s = pick([1, -1]), deg = 3, cs = [nz(-4, 4)];
        for (let i = 1; i <= deg; i++) cs.push(rnd(-6, 6));
        const num = cs.reduce((t, c, i) => t + c * s ** (deg - i) * p ** i, 0), den = p ** deg;
        const parts = cs.map((c, i) => [c * s ** (deg - i), p ** (deg - i)]).filter(([u]) => u).map(([u, w]) => frac(u, w));
        return { text: `${arr(cs)} çoxhədlisini ${poly([[p, 1], [-s, 0]])} ikihədlisinə böldükdə qalıq neçədir?`, answer: num / den, show: frac(num, den), tol: 0.01, placeholder: "məs. 15/4",
          solution: `${poly([[p, 1], [-s, 0]])} = ${p}(x ${s > 0 ? "−" : "+"} 1/${p}), kökü x = ${frac(s, p)}. Qalıq = P(${frac(s, p)}) = ${parts.join(" + ").replace(/\+ −/g, "− ")} = ${frac(num, den)}.` };
      } },
    { id: "parametr", ad: "Bölünmədən parametr", izah: "Bölünürsə — P(a) = 0; qalıq r-dirsə — P(a) = r. İki bölən varsa, iki tənlik və ya P(x) = (x − a)(x − b)(x − t) yaz.",
      gen() {
        if (Math.random() < .55) {
          const a = nz(-3, 3), hide = rnd(1, 3), r = Math.random() < .6 ? 0 : nz(-9, 9);
          const cs = [1, rnd(-6, 6), rnd(-9, 9), 0]; cs[3] = r - (a ** 3 + cs[1] * a * a + cs[2] * a);
          const k = cs[hide], m = a ** (3 - hide);
          const known = cs.reduce((t, c, i) => i === hide ? t : t + c * a ** (3 - i), 0);
          let o = ""; cs.forEach((c, i) => { const e = 3 - i; if (i === hide) { o += " + k" + xp(e); return; } if (!c) return; const ab = Math.abs(c), body = e ? (ab === 1 ? xp(e) : ab + xp(e)) : String(ab); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; });
          return { text: `${o} çoxhədlisi ${lin(a)} ikihədlisinə ${r ? `bölünəndə qalıq ${S(r)} olur` : "qalıqsız bölünür"}. k = ?`, answer: k, show: S(k), tol: 0.01,
            solution: `Bezu: P(${S(a)}) = ${S(r)}. Yerinə qoy: ${kx(m, "k")} ${known < 0 ? "−" : "+"} ${Math.abs(known)} = ${S(r)} → ${kx(m, "k")} = ${S(r - known)}` + (m === 1 ? "." : ` → k = ${S(k)}.`) };
        }
        let a, b; do { a = nz(-4, 4); b = nz(-4, 4); } while (a === b);
        const t = rnd(-5, 5), m = -(a + b + t), n = a * b + a * t + b * t, C = -a * b * t;
        const ask = pick(["m", "n", "mn"]), ans = ask === "m" ? m : ask === "n" ? n : m + n;
        const div = poly([[1, 2], [-(a + b), 1], [a * b, 0]]);
        return { text: `x³ + mx² + nx${C ? (C < 0 ? " − " : " + ") + Math.abs(C) : ""} çoxhədlisi ${div} üçhədlisinə qalıqsız bölünür. ${ask === "mn" ? "m + n" : ask} = ?`, answer: ans, show: S(ans), tol: 0.01,
          solution: `${div} = (${lin(a)})(${lin(b)}). Baş əmsal 1 olduğundan P(x) = (${lin(a)})(${lin(b)})(x − t). Sərbəst hədləri müqayisə et: ${kx(-a * b, "t")} = ${S(C)} → t = ${S(t)}. Açsaq: P(x) = ${arr([1, m, n, C])}, yəni m = ${S(m)}, n = ${S(n)}.` + (ask === "mn" ? ` m + n = ${S(ans)}.` : "") };
      } },
    { id: "qaliq2", ad: "(x − a)(x − b)-yə bölmədə qalıq", izah: "Bölən ikinci dərəcəlidir → qalıq R(x) = px + q. x = a və x = b qoy: P(a) = pa + q, P(b) = pb + q. Sistemi həll et.",
      gen() {
        let a, b, A, B2, p, q, intro, div;
        if (Math.random() < .5) {
          do { a = rnd(-4, 5); b = rnd(-4, 5); } while (a === b);
          p = nz(-6, 6); q = rnd(-9, 9); A = p * a + q; B2 = p * b + q;
          intro = `P(x) çoxhədlisini ${lin(a)} ikihədlisinə böldükdə qalıq ${S(A)}, ${lin(b)} ikihədlisinə böldükdə isə qalıq ${S(B2)} alınır.`;
          div = br(a) + br(b);
        } else {
          [a, b] = pick([[1, -1], [1, -1], [0, 1], [0, -1], [1, 2]]);
          const n = a * b === 2 ? rnd(4, 10) : rnd(20, 99), mm = rnd(2, n - 1), k = nz(-5, 5), c = rnd(-6, 6);
          const ts = [[1, n], [k, mm], [c, 0]];
          const P = x => ts.reduce((s, [co, e]) => s + co * x ** e, 0);
          A = P(a); B2 = P(b); p = (A - B2) / (a - b); q = A - p * a;
          intro = `P(x) = ${poly(ts)}.`;
          div = poly([[1, 2], [-(a + b), 1], [a * b, 0]]);
        }
        const ask = pick(["p", "q", "R"]), c0 = (() => { let c; do { c = rnd(2, 10); } while (c === a || c === b); return c; })();
        const ans = ask === "p" ? p : ask === "q" ? q : p * c0 + q;
        const askT = ask === "R" ? `R(${c0}) = ?` : ask + " = ?";
        return { text: `${intro} P(x)-i ${div} ifadəsinə böldükdə qalıq R(x) = px + q olur. ${askT}`, answer: ans, show: S(ans), tol: 0.01,
          solution: (intro.startsWith("P(x) =") ? `${div} = ${br(a) + br(b)}. ` : "") + `P(x) = ${br(a) + br(b)}·Q(x) + px + q. x = ${S(a)}: ${pq(a)} = ${S(A)}; x = ${S(b)}: ${pq(b)} = ${S(B2)}. ` +
            `Çıxsaq: p = (${S(A)} − ${B(B2)}) : (${S(a)} − ${B(b)}) = ${S(p)}, q = ${S(q)}. R(x) = ${poly([[p, 1], [q, 0]])}.` + (ask === "R" ? ` R(${c0}) = ${S(ans)}.` : "") };
      } },
    { id: "qeyri", ad: "Qeyri-müəyyən əmsallar", izah: "Naməlum əmsallı şəkil yaz, mötərizələri aç, eyni dərəcəli hədlərin əmsallarını bərabərləşdir.",
      gen() {
        const kind = pick(["kvadrat", "ikiqat", "fark"]);
        if (kind === "kvadrat") {
          const m = nz(-4, 4), n = nz(-5, 5), A = 2 * m, B2 = m * m + 2 * n, a = 2 * m * n, b = n * n;
          const ask = pick(["a", "b", "ab"]), ans = ask === "a" ? a : ask === "b" ? b : a + b;
          return { text: `${poly([[1, 4], [A, 3], [B2, 2]])} + ax + b çoxhədlisi x² + mx + n şəklindəki üçhədlinin tam kvadratıdır. ${ask === "ab" ? "a + b" : ask} = ?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `(x² + mx + n)² = x⁴ + 2m·x³ + (m² + 2n)x² + 2mn·x + n². Müqayisə: 2m = ${S(A)} → m = ${S(m)}; m² + 2n = ${S(B2)} → n = ${S(n)}. Onda a = 2mn = ${S(a)}, b = n² = ${b}.` + (ask === "ab" ? ` a + b = ${S(ans)}.` : "") };
        }
        if (kind === "ikiqat") {
          const r = nz(-4, 4), a = -3 * r * r, b = 2 * r ** 3, ask = pick(["a", "b", "ab"]), ans = ask === "a" ? a : ask === "b" ? b : a + b;
          return { text: `x³ + ax + b çoxhədlisi (${lin(r)})² ifadəsinə qalıqsız bölünür. ${ask === "ab" ? "a + b" : ask} = ?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `P(x) = (${lin(r)})²(x + c) = (${poly([[1, 2], [-2 * r, 1], [r * r, 0]])})(x + c). x²-nın əmsalı: c ${r > 0 ? "−" : "+"} ${Math.abs(2 * r)} = 0 (P-də x² yoxdur) → c = ${S(2 * r)}. ` +
              `Açsaq: (${poly([[1, 2], [-2 * r, 1], [r * r, 0]])})(${poly([[1, 1], [2 * r, 0]])}) = ${arr([1, 0, a, b])}. a = ${S(a)}, b = ${S(b)}.` + (ask === "ab" ? ` a + b = ${S(ans)}.` : "") };
        }
        const A = rnd(1, 3), B0 = rnd(-5, 5), C0 = rnd(-5, 9), k = rnd(2, 6), ans = A * k * k + B0 * k + C0;
        return { text: `P(x) — kvadrat üçhədlidir. P(x + 1) − P(x) = ${poly([[2 * A, 1], [A + B0, 0]])} və P(0) = ${S(C0)}. P(${k}) = ?`, answer: ans, show: S(ans), tol: 0.01,
          solution: `P(x) = ax² + bx + c. P(x + 1) − P(x) = a(2x + 1) + b = 2a·x + (a + b). Müqayisə: 2a = ${2 * A} → a = ${A}; a + b = ${S(A + B0)} → b = ${S(B0)}; c = P(0) = ${S(C0)}. ` +
            `P(x) = ${arr([A, B0, C0])}, P(${k}) = ${sum([A * k * k, B0 * k, C0].filter((v, i) => v || i === 0))} = ${S(ans)}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Qalığı Bezu ilə tapan üç addımlı həll. Hər addımı yoxla: hansı ədəd yerinə qoyulur, işarələr, hesab.",
      gen() {
        let a, c; do { a = rnd(1, 4); c = nz(-6, 6); } while (c === -a * a);
        const b = nz(-5, 5), d = rnd(-9, 9), P = [1, b, c, d];
        const bad = rnd(0, 2), x = bad === 0 ? a : -a;
        let t = [x ** 3, b * x * x, c * x, d];
        if (bad === 1) t = [a ** 3, b * a * a, -c * a, d];
        let val = t.reduce((s, v) => s + v, 0); const right = ev(P, -a);
        if (bad === 2) val = right + pick([-2, -1, 1, 2]);
        const steps = [
          `Bezu teoreminə görə qalıq = P(${S(x)}).`,
          `P(${S(x)}) = ${sum(t)}.`,
          `= ${S(val)}. Cavab: ${S(val)}.`,
        ];
        const text = h("div", {}, h("p", {}, `Elvin ${arr(P)} çoxhədlisini x + ${a} ikihədlisinə böldükdə alınan qalığı tapır. Birinci səhv hansı addımdadır?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: x + ${a} = x − (−${a}), ona görə qalıq = P(−${a}), P(${a}) yox. Düz cavab: ${S(right)}.`,
          `2-ci addım: (−${a})³ = ${S(-(a ** 3))}, ${S(a ** 3)} deyil. Düzü: P(−${a}) = ${sum([-(a ** 3), b * a * a, -c * a, d])} = ${S(right)}.`,
          `3-cü addım: ${sum([-(a ** 3), b * a * a, -c * a, d])} = ${S(right)}, ${S(val)} yox.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Qutunun ölçüləri — çoxhədlilərin bölünməsi; ədədin 9-a, 11-ə qalığı — Bezu: N = P(10), qalıq P(1) və ya P(−1) ilə eynidir.",
      gen() {
        if (Math.random() < .5) {
          const p = rnd(1, 6), q = rnd(1, 6), s = rnd(1, 8), k = rnd(2, 10);
          const V = [1, p + q + s, p * q + p * s + q * s, p * q * s], base = [1, p + q, p * q];
          return { text: `Düzbucaqlı qutunun həcmi V(x) = ${arr(V)} sm³, oturacağının sahəsi isə ${arr(base)} sm²-dir. x = ${k} olduqda qutunun hündürlüyü neçə sm olar?`,
            answer: k + s, unit: "sm", show: String(k + s), tol: 0.01,
            solution: `Hündürlük = V(x) : (${arr(base)}). Qismət x + c şəklindədir (baş əmsallar 1). Sərbəst hədlər: ${p * q}·c = ${p * q * s} → c = ${s}. Yoxla, x²-nın əmsalı: ${p + q} + ${s} = ${p + q + s} ✓. Hündürlük x + ${s}; x = ${k} olduqda ${k + s} sm.` };
        }
        const len = rnd(6, 7), ds = [rnd(1, 9)]; for (let i = 1; i < len; i++) ds.push(rnd(0, 9));
        const N = ds.join(""), m = pick([9, 11, 11]);
        if (m === 9) {
          const s = ds.reduce((t, v) => t + v, 0), ans = s % 9;
          return { text: `Kassir ${N} qəpiyi 9 nəfər arasında bərabər paylayır, hər kəsə mümkün qədər çox düşsün. Neçə qəpik artıq qalar?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `N = P(10), burada P-nin əmsalları N-in rəqəmləridir. P(10) − P(1) fərqi 10 − 1 = 9-a bölünür, deməli qalıq P(1) = rəqəmlər cəmi ilə eynidir: ${ds.join(" + ")} = ${s}; ${s} : 9 → qalıq ${ans}.` };
        }
        const rev = ds.slice().reverse(), alt = rev.reduce((t, v, i) => t + (i % 2 ? -v : v), 0), ans = ((alt % 11) + 11) % 11;
        return { text: `Kassir ${N} qəpiyi 11 nəfər arasında bərabər paylayır, hər kəsə mümkün qədər çox düşsün. Neçə qəpik artıq qalar?`, answer: ans, show: String(ans), tol: 0.01,
          solution: `N = P(10), P-nin əmsalları N-in rəqəmləridir. P(10) − P(−1) fərqi 10 − (−1) = 11-ə bölünür, deməli qalıq P(−1) ilə eynidir. Sondan başlayaraq rəqəmləri növbə ilə + və − ilə topla: ${sum(rev.map((v, i) => i % 2 ? -v : v))} = ${S(alt)}` +
            (alt !== ans ? ` ≡ ${ans} (mod 11)` : "") + `. Qalıq: ${ans}.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-bezu", title: "Çoxhədlilərin bölünməsi, Bezu teoremi", fenn: "riyaziyyat", link: "dersler/ol-bezu.html",
      format: "Cavab ədəddir: tam −7, kəsr 15/4. Qalıq px + q soruşulanda p, q və ya R(c) ədədini yaz.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["bolme", "bezu", "bezu", "parametr", "parametr", "qaliq2", "qaliq2", "qeyri", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-bezu.html")) b.push("dersler/ol-bezu.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
