// Olimpiada: qalıqlar, modul arifmetikası — oyun səviyyələri (cəm/hasilin qalığı, son rəqəm, böyük qüvvətlər, kvadratlar, həyatdan, səhvi tap) və yekun sınaq.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const mod = (a, m) => ((a % m) + m) % m;
  const pw = (a, n, m) => { let r = 1 % m; a = mod(a, m); while (n > 0) { if (n & 1) r = r * a % m; a = a * a % m; n >>= 1; } return r; };
  // Azerbaijani case suffixes after a numeral, by the last spoken word (3-ə, 6-ya, 9-a, 40-a)
  const W = n => { if (n === 0) return "sıfır"; if (n % 1000 === 0) return "min"; if (n % 100 === 0) return "yüz"; if (n % 10 === 0) return ["", "on", "iyirmi", "otuz", "qırx", "əlli", "altmış", "yetmiş", "səksən", "doxsan"][(n / 10) % 10]; return ["", "bir", "iki", "üç", "dörd", "beş", "altı", "yeddi", "səkkiz", "doqquz"][n % 10]; };
  const VW = "aıoueəiöü";
  const D = n => { const w = W(Math.abs(n)), vs = [...w].filter(c => VW.includes(c)), v = vs[vs.length - 1], endV = VW.includes(w[w.length - 1]); return n + "-" + (endV ? "y" : "") + ("aıou".includes(v) ? "a" : "ə"); };
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = k => String(k).split("").map(c => SUP[+c]).join("");
  // powers of r mod m until the value 1 (r coprime to m): [r¹, r², …, rᵏ ≡ 1]
  const cyc = (r, m) => { const out = []; let v = mod(r, m); do { out.push(v); v = v * r % m; } while (out[out.length - 1] !== 1 % m && out.length < 50); return out; };
  // last-digit cycle of digit d: d, d², … until it repeats
  const ldc = d => { const out = [d]; let v = d * d % 10; while (v !== d) { out.push(v); v = v * d % 10; } return out; };
  const powStep = (a, n, m) => { // text: a^n mod m via the cycle of a mod m
    const r = mod(a, m), c = cyc(r, m), k = c.length, s = n % k, ans = pw(a, n, m);
    return { ans, txt: `${a} ≡ ${r} (mod ${m}). ${r} ədədinin qüvvətləri: ${c.join(", ")} — ${r}${sup(k)} ≡ 1. ${n} = ${k} · ${Math.floor(n / k)} + ${s} → ${a}${sup(n)} ≡ ${s ? `${r}${sup(s)} ≡ ${ans}` : "1"}.` };
  };
  const DAYS = ["bazar ertəsi", "çərşənbə axşamı", "çərşənbə", "cümə axşamı", "cümə", "şənbə", "bazar"];
  const DAYS_IS = ["bazar ertəsidir", "çərşənbə axşamıdır", "çərşənbədir", "cümə axşamıdır", "cümədir", "şənbədir", "bazardır"];

  const levels = [
    { id: "modsum", ad: "Cəm və hasilin qalığı", izah: "Hər ədədi öz qalığı ilə əvəz et: (a + b) və a · b-nin qalığı qalıqların cəmi/hasilinin qalığıdır.",
      gen() {
        const kind = pick(["hasil", "verilib", "quvvet"]);
        if (kind === "hasil") {
          const m = pick([4, 5, 6, 7, 8, 9, 11, 12, 13]), A = rnd(100, 9999), B = rnd(100, 9999), C = rnd(100, 9999);
          const ra = A % m, rb = B % m, rc = C % m, ans = ra * rb * rc % m;
          return { text: `${A} · ${B} · ${C} hasilini ${D(m)} böldükdə qalıq neçədir?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Qalıqlar: ${A} ≡ ${ra}, ${B} ≡ ${rb}, ${C} ≡ ${rc} (mod ${m}). ${ra} · ${rb} · ${rc} = ${ra * rb * rc} ≡ ${ans}. Cavab: ${ans}.` };
        }
        if (kind === "verilib") {
          const m = pick([5, 7, 9, 11, 13]), ra = rnd(1, m - 1), rb = rnd(1, m - 1);
          const F = pick([["a² + b", (x, y) => x * x + y, (x, y) => `${x}² + ${y}`], ["a · b", (x, y) => x * y, (x, y) => `${x} · ${y}`], ["a² + b²", (x, y) => x * x + y * y, (x, y) => `${x}² + ${y}²`],
            ["2a + 3b", (x, y) => 2 * x + 3 * y, (x, y) => `2 · ${x} + 3 · ${y}`], ["a³ − b", (x, y) => x ** 3 - y, (x, y) => `${x}³ − ${y}`], ["a · b + a", (x, y) => x * y + x, (x, y) => `${x} · ${y} + ${x}`]]);
          const v = F[1](ra, rb), ans = mod(v, m);
          return { text: `a ədədini ${D(m)} böldükdə qalıq ${ra}, b ədədini ${D(m)} böldükdə qalıq ${rb} alınır. ${F[0]} ifadəsini ${D(m)} böldükdə qalıq neçədir?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `a ≡ ${ra}, b ≡ ${rb} (mod ${m}) → ${F[0]} ≡ ${F[2](ra, rb)} = ${S(v)} ≡ ${ans}. Cavab: ${ans}.` };
        }
        const m = pick([3, 4, 5, 7, 9, 11]), X = rnd(1000, 9999), Y = rnd(1000, 9999), p = rnd(2, 4), q = rnd(2, 4);
        const rx = X % m, ry = Y % m, ans = (pw(rx, p, m) + pw(ry, q, m)) % m;
        return { text: `${X}${sup(p)} + ${Y}${sup(q)} ədədini ${D(m)} böldükdə qalıq neçədir?`, answer: ans, show: S(ans), tol: 0.01,
          solution: `${X} ≡ ${rx}, ${Y} ≡ ${ry} (mod ${m}). ${rx}${sup(p)} + ${ry}${sup(q)} = ${rx ** p + ry ** q} ≡ ${ans}. Cavab: ${ans}.` };
      } },
    { id: "sonreqem", ad: "Son rəqəm", izah: "Son rəqəm = 10-a bölmədə qalıq. Son rəqəmlərin dövrü 1, 2 və ya 4 uzunluqdadır: üstü 4-ə böl.",
      gen() {
        const one = (a, n) => { const d = a % 10, c = ldc(d), k = c.length, s = n % k, v = c[(s + k - 1) % k];
          return { v, txt: `${a}${sup(n)}: son rəqəmlər dövrü ${c.join(", ")} (uzunluq ${k}); ${n} = ${k} · ${Math.floor(n / k)} + ${s} → ${s ? ["", "1-ci", "2-ci", "3-cü"][s] + " element" : "dövrün sonuncusu"}: ${v}` }; };
        const a = (() => { let x; do { x = rnd(2, 99); } while ([0, 1, 5, 6].includes(x % 10) && Math.random() < .85); return x; })();
        const n = rnd(10, 2100);
        if (Math.random() < .6) { const r = one(a, n);
          return { text: `${a}${sup(n)} ədədinin son rəqəmi neçədir?`, answer: r.v, show: S(r.v), tol: 0.01, solution: r.txt + ". Cavab: " + r.v + "." }; }
        const b = rnd(2, 99), m2 = rnd(10, 2100), r1 = one(a, n), r2 = one(b, m2), ans = (r1.v + r2.v) % 10;
        return { text: `${a}${sup(n)} + ${b}${sup(m2)} ədədinin son rəqəmi neçədir?`, answer: ans, show: S(ans), tol: 0.01,
          solution: `${r1.txt}. ${r2.txt}. ${r1.v} + ${r2.v} = ${r1.v + r2.v} → son rəqəm ${ans}.` };
      } },
    { id: "quvvet", ad: "Böyük qüvvətin qalığı", izah: "aᵏ ≡ 1 olan ən kiçik k-nı tap. Sonra üstü k-ya böl: aⁿ ≡ a^(qalıq).",
      gen() {
        const m = pick([4, 5, 7, 7, 9, 11, 13]);
        let a; do { a = rnd(2, 40); } while (gcd(a, m) !== 1 || a % m === 1);
        const n = rnd(20, 2100);
        if (Math.random() < .65) { const r = powStep(a, n, m);
          return { text: `${a}${sup(n)} ədədini ${D(m)} böldükdə qalıq neçədir?`, answer: r.ans, show: S(r.ans), tol: 0.01, solution: r.txt + ` Cavab: ${r.ans}.` }; }
        let b; do { b = rnd(2, 40); } while (gcd(b, m) !== 1 || b === a || b % m === 1);
        const r1 = powStep(a, n, m), r2 = powStep(b, n, m), ans = (r1.ans + r2.ans) % m;
        return { text: `${a}${sup(n)} + ${b}${sup(n)} ədədini ${D(m)} böldükdə qalıq neçədir?`, answer: ans, show: S(ans), tol: 0.01,
          solution: `${r1.txt} ${r2.txt} ${r1.ans} + ${r2.ans} = ${r1.ans + r2.ans} ≡ ${ans}. Cavab: ${ans}.` };
      } },
    { id: "kvadrat", ad: "Kvadratların qalıqları", izah: "n² mod 3 və mod 4: yalnız 0 və 1. Tək ədədin kvadratı mod 8: həmişə 1. p > 3 sadə → p² ≡ 1 (mod 24).",
      gen() {
        if (Math.random() < .55) {
          const PAIRS = [[3, 3], [4, 4], [5, 5], [6, 6], [7, 7], [9, 9], [4, 8], [6, 12], [8, 16], [10, 20], [6, 9], [12, 24]].filter(([m, M]) => (2 * m) % M === 0 && (m * m) % M === 0);
          const [m, M] = pick(PAIRS), r = rnd(1, m - 1), ans = r * r % M;
          return { text: `n natural ədədi ${m}k + ${r} şəklindədir (k — natural ədəd). n² ədədini ${D(M)} böldükdə qalıq neçədir?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `n² = ${m * m}k² + ${2 * m * r}k + ${r * r}. ${m * m}k² və ${2 * m * r}k ${M} ədədinə bölünür, ona görə qalıq ${r * r} ədədinin qalığıdır: ${r * r} = ${M} · ${Math.floor(r * r / M)} + ${ans}. Cavab: ${ans}.` };
        }
        const k = rnd(1, 40);
        if (Math.random() < .5) { const M = pick([24, 12, 8, 3]), ans = (1 + k) % M;
          return { text: `p — 3-dən böyük sadə ədəddir. p² + ${k} ədədini ${D(M)} böldükdə qalıq neçədir?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `p² − 1 = (p − 1)(p + 1): p tək olduğu üçün 8-ə, p 3-ə bölünmədiyi üçün 3-ə bölünür → 24-ə bölünür. Deməli p² ≡ 1 (mod ${M}), p² + ${k} ≡ ${1 + k} ≡ ${ans}. Cavab: ${ans}.` }; }
        const ans = (1 + k) % 8;
        return { text: `n — tək natural ədəddir. n² + ${k} ədədini 8-ə böldükdə qalıq neçədir?`, answer: ans, show: S(ans), tol: 0.01,
          solution: `n = 2t + 1 → n² = 4t(t + 1) + 1; t(t + 1) cütdür, ona görə n² ≡ 1 (mod 8). n² + ${k} ≡ ${1 + k} ≡ ${ans}. Cavab: ${ans}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Təkrarlanan hər şey — həftənin günləri, saat, naxış — qalıqlarla hesablanır.",
      gen() {
        const kind = pick(["gun", "saat", "naxis"]);
        if (kind === "gun") {
          const d = rnd(1, 7), a = pick([2, 3, 4, 5, 9, 10]), n = rnd(10, 200), r = powStep(a, n, 7), ans = (d - 1 + r.ans) % 7 + 1;
          return { text: `Bu gün ${DAYS_IS[d - 1]}. ${a}${sup(n)} gün sonra həftənin neçənci günü olacaq? (1 — bazar ertəsi, 2 — çərşənbə axşamı, …, 7 — bazar)`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Həftə 7 gündür — 7-yə bölmədə qalıq lazımdır. ${r.txt} Bugünün nömrəsi ${d}; ${d} + ${r.ans} = ${d + r.ans}${d + r.ans > 7 ? ` → ${d + r.ans} − 7 = ${ans}` : ""}. Cavab: ${ans} (${DAYS[ans - 1]}).` };
        }
        if (kind === "saat") {
          const hh = rnd(0, 23), N = rnd(100, 9999), ans = (hh + N) % 24;
          return { text: `Elektron saat indi ${String(hh).padStart(2, "0")}:00 göstərir. ${N} saat sonra saat neçəni göstərəcək? (0-dan 23-ə qədər tam ədəd yaz)`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Sutka 24 saatdır: ${N} = 24 · ${Math.floor(N / 24)} + ${N % 24}. Tam sutkalar heç nə dəyişmir: ${hh} + ${N % 24} = ${hh + N % 24}${hh + N % 24 >= 24 ? ` → ${hh + N % 24} − 24 = ${ans}` : ""}. Cavab: ${ans}:00.` };
        }
        const k = rnd(3, 9), N = rnd(100, 3000), ans = (N - 1) % k + 1;
        return { text: `Muncuqlar ${k} rəngdə düzülüb: rənglər 1, 2, …, ${k} nömrələri ilə növbə ilə təkrarlanır (1, 2, …, ${k}, 1, 2, …). Sıradakı nömrəsi ${N} olan muncuq hansı nömrəli rəngdədir?`, answer: ans, show: S(ans), tol: 0.01,
          solution: `Rəng nömrəsi ${k} ədədinə bölmədə qalıqla təyin olunur: ${N} = ${k} · ${Math.floor(N / k)} + ${N % k}. ${N % k ? `Qalıq ${N % k} → rəng ${ans}` : `Qalıq 0 → dövrün sonuncusu, rəng ${k}`}. Cavab: ${ans}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Son rəqəm üç addımda tapılıb, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const d = pick([2, 3, 7, 8]), a = rnd(1, 9) * 10 + d, c = ldc(d);
        let n; do { n = rnd(100, 2099); } while (n % 4 === ((n % 10) % 4));
        const s = n % 4, v = c[(s + 3) % 4];
        const steps = [`${a} ədədinin qüvvətlərinin son rəqəmləri: ${c.join(", ")}, sonra təkrar.`,
          `${n} ədədini 4-ə böldükdə qalıq ${s}.`,
          `Deməli ${a}${sup(n)} ədədinin son rəqəmi ${v}.`];
        const bad = rnd(0, 2);
        if (bad === 0) { const w = c.slice(); [w[1], w[2]] = [w[2], w[1]]; steps[0] = `${a} ədədinin qüvvətlərinin son rəqəmləri: ${w.join(", ")}, sonra təkrar.`; steps[2] = `Deməli ${a}${sup(n)} ədədinin son rəqəmi ${w[(s + 3) % 4]}.`; }
        if (bad === 1) { const s2 = (n % 10) % 4; steps[1] = `${n} ədədini 4-ə böldükdə qalıq ${s2}.`; steps[2] = `Deməli ${a}${sup(n)} ədədinin son rəqəmi ${c[(s2 + 3) % 4]}.`; }
        if (bad === 2) steps[2] = `Deməli ${a}${sup(n)} ədədinin son rəqəmi ${c[s % 4]}.`;
        const text = h("div", {}, h("p", {}, `${a}${sup(n)} ədədinin son rəqəmi tapılır:`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: ${d}, ${d}² … ədədlərinin son rəqəmləri ${c.join(", ")} olmalıdır (məs. ${d}² = ${d * d}, ${d}³ = ${d ** 3}).`,
          `2-ci addım: 4-ə bölmədə son İKİ rəqəmə baxılır: ${n % 100} → qalıq ${s}, ${(n % 10) % 4} yox.`,
          `3-cü addım: qalıq ${s} dövrün ${s ? ["", "1-ci", "2-ci", "3-cü"][s] : "sonuncu (4-cü)"} elementidir: ${v}.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-qaliqlar", title: "Qalıqlar, modul arifmetikası", fenn: "olimpiada", link: "dersler/ol-qaliqlar.html",
      format: "Cavab ədəddir: qalıq (0, 1, 2, …), son rəqəm və ya nömrə.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["modsum", "modsum", "sonreqem", "sonreqem", "quvvet", "quvvet", "kvadrat", "kvadrat", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-qaliqlar.html")) b.push("dersler/ol-qaliqlar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
