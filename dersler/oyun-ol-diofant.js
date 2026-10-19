// Olimpiada: Diofant tənlikləri — oyun səviyyələri (ax + by = c natural həllər, ümumi həll, vuruqlara ayırma, x² − y² = n, həyatdan, səhvi tap) və yekun sınaq.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const pairs = ps => ps.map(([x, y]) => `(${x}; ${y})`).join(", ");
  const short = ps => ps.length <= 6 ? pairs(ps) : `${pairs(ps.slice(0, 2))}, …, ${pairs(ps.slice(-1))}`;
  // natural solutions (x, y ≥ lo) of ax + by = c
  const linSols = (a, b, c, lo = 1) => { const out = []; for (let x = lo; a * x <= c - b * lo; x++) if ((c - a * x) % b === 0) out.push([x, (c - a * x) / b]); return out; };
  const divs = n => { const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; };
  const lin = (a, b, c) => `${a === 1 ? "" : a}x + ${b === 1 ? "" : b}y = ${S(c)}`;
  const tl = K => K <= 4 ? Array.from({ length: K }, (_, i) => i).join(", ") : `0, 1, …, ${K - 1}`;
  const coefPair = () => { let a, b; do { a = rnd(2, 13); b = rnd(2, 13); } while (a === b); return [a, b]; };

  const levels = [
    { id: "xetti", ad: "ax + by = c: natural həllər", izah: "Bir həll tap, sonra x-i b/d addımla artır, y-i a/d addımla azalt (d = ƏBOB). x ≥ 1, y ≥ 1 olanları say.",
      gen() {
        const [a, b] = coefPair(), g = gcd(a, b);
        let c = rnd(15, 160); if (g > 1 && Math.random() < .75) c = g * Math.max(2, Math.round(c / g));
        const sol = linSols(a, b, c), n = sol.length;
        let why;
        if (c % g) why = `ƏBOB(${a}; ${b}) = ${g}, ${c} isə ${g} ədədinə bölünmür — tam həll yoxdur.`;
        else if (!n) why = `Tam həllər var, amma x ≥ 1, y ≥ 1 olanda ${a}x + ${b}y ≥ ${a + b}, və yoxlama göstərir ki, heç bir x üçün y natural alınmır.`;
        else why = `Bir həll: x = ${sol[0][0]}, y = ${sol[0][1]}. x hər dəfə ${b / g} artır, y — ${a / g} azalır: ${short(sol)}.`;
        return { text: `${lin(a, b, c)} tənliyinin neçə natural həlli var (x ≥ 1, y ≥ 1)?`, answer: n, show: S(n), tol: 0.01, solution: `${why} Cavab: ${n}.` };
      } },
    { id: "umumi", ad: "Ümumi həll", izah: "x = x₀ + (b/d)t, y = y₀ − (a/d)t. Tam həllərin hamısı belə alınır.",
      gen() {
        const kind = pick(["minx", "maxsum", "aralig"]);
        let a, b, g; do { [a, b] = coefPair(); g = gcd(a, b); } while (g > 3);
        if (kind === "minx") {
          const c = g * pick([-1, 1]) * rnd(1, 40);
          let x = 1; while ((c - a * x) % b !== 0) x++;
          const y = (c - a * x) / b;
          return { text: `${lin(a, b, c)} tənliyinin tam həllərindən (y mənfi də ola bilər) x-in ən kiçik natural qiyməti neçədir?`, answer: x, show: S(x), tol: 0.01,
            solution: `x = 1, 2, … yoxla: ${S(c)} − ${a}x ifadəsi ${b} ədədinə ilk dəfə x = ${x} olanda bölünür, y = ${S(y)}. Növbəti həllər x-i ${b / g} artırır, ona görə ${x} ən kiçikdir. Cavab: ${x}.` };
        }
        if (kind === "maxsum") {
          const c = a * rnd(1, b / g) + b * (a / g + rnd(1, 5)), sol = linSols(a, b, c);   // ≥ 2 natural solutions by construction
          const sums = sol.map(([x, y]) => x + y), best = Math.max(...sums), at = sol[sums.indexOf(best)];
          return { text: `${lin(a, b, c)} tənliyinin natural həllərində (x ≥ 1, y ≥ 1) x + y cəminin ən böyük qiyməti neçədir?`, answer: best, show: S(best), tol: 0.01,
            solution: `Natural həllər: ${pairs(sol)}. ${a < b ? "Kiçik əmsallı x nə qədər böyükdürsə," : "Kiçik əmsallı y nə qədər böyükdürsə,"} cəm o qədər böyükdür: (${at[0]}; ${at[1]}) → ${best}.` };
        }
        const c = g * rnd(-30, 60), M = pick([50, 100]);
        const xs = []; for (let x = 1; x < M; x++) if ((c - a * x) % b === 0) xs.push(x);
        return { text: `${lin(a, b, c)} tənliyinin neçə tam həllində 0 < x < ${M} olur?`, answer: xs.length, show: S(xs.length), tol: 0.01,
          solution: `Uyğun x-lər addımı ${b / g} olan ardıcıllıqdır: ${xs[0]}, ${xs[1]}, …, ${xs[xs.length - 1]}. Sayı: (${xs[xs.length - 1]} − ${xs[0]}) : ${b / g} + 1 = ${xs.length}.` };
      } },
    { id: "vuruq", ad: "Vuruqlara ayırma", izah: "xy + px + qy = c → (x + q)(y + p) = c + pq. Sonra sağ tərəfin bölənlərini yoxla.",
      gen() {
        const kind = pick(["xy", "xy", "kesr", "hasil"]);
        if (kind === "xy") {
          const p = rnd(1, 7), q = rnd(1, 7), x0 = rnd(1, 9), y0 = rnd(1, 9), c = x0 * y0 + p * x0 + q * y0, N = c + p * q, sol = [];
          for (let x = 1; x <= c; x++) { const r = c - p * x; if (r < 0) break; if (r % (x + q) === 0 && r / (x + q) >= 1) sol.push([x, r / (x + q)]); }
          return { text: `xy + ${p === 1 ? "" : p}x + ${q === 1 ? "" : q}y = ${c} tənliyinin neçə natural həlli (x; y) var?`, answer: sol.length, show: S(sol.length), tol: 0.01,
            solution: `(x + ${q})(y + ${p}) = ${c} + ${p * q} = ${N}. x + ${q} ≥ ${q + 1}, y + ${p} ≥ ${p + 1} olan bölən cütləri: ${pairs(sol.map(([x, y]) => [x + q, y + p]))} → (x; y) = ${pairs(sol)}. Cavab: ${sol.length}.` };
        }
        if (kind === "kesr") {
          const k = rnd(2, 30), d = divs(k * k);
          return { text: `1/x + 1/y = 1/${k} tənliyinin neçə natural həlli (x; y) var? ((a; b) və (b; a) ayrı sayılır)`, answer: d.length, show: S(d.length), tol: 0.01,
            solution: `${k}(x + y) = xy → (x − ${k})(y − ${k}) = ${k * k}. x, y > ${k} olmalıdır (yoxsa 1/x > 1/${k}). Hər bölən ${k * k} = d · e bir həll verir; ${k * k} ədədinin bölənləri: ${d.length} dənə. Cavab: ${d.length}.` };
        }
        const c = rnd(2, 70), d = divs(c + 1);
        return { text: `xy − x − y = ${c} tənliyinin neçə natural həlli (x; y) var?`, answer: d.length, show: S(d.length), tol: 0.01,
          solution: `Hər tərəfə 1 əlavə et: (x − 1)(y − 1) = ${c + 1}. x − 1 = 0 olmaz, deməli x − 1 ədədi ${c + 1} ədədinin natural bölənidir: ${d.join(", ")} — ${d.length} həll.` };
      } },
    { id: "kvfferq", ad: "x² − y² = n", izah: "(x − y)(x + y) = n. Vuruqlar eyni cütlükdə olmalıdır; n ≡ 2 (mod 4) olsa, həll yoxdur.",
      gen() {
        let n = rnd(15, 400); if (Math.random() < .2) n = 4 * rnd(4, 99) + 2;
        const sol = []; for (let d = 1; d * d < n; d++) if (n % d === 0 && (d + n / d) % 2 === 0) sol.push([d, n / d]);
        const xy = sol.map(([d, e]) => [(d + e) / 2, (e - d) / 2]);
        const why = sol.length ? `(x − y)(x + y) = ${n}; eyni cütlüklü, x − y < x + y olan cütlər: ${pairs(sol)} → (x; y) = ${pairs(xy)}.`
          : n % 4 === 2 ? `${n} = 4 · ${(n - 2) / 4} + 2. x − y və x + y eyni cütlükdədir: ikisi də təkdirsə hasil tək, ikisi də cütdürsə hasil 4-ə bölünür. ${n} heç biri deyil — həll yoxdur.`
          : `(x − y)(x + y) = ${n}; eyni cütlüklü və x − y < x + y olan cüt yoxdur — həll yoxdur.`;
        if (sol.length && Math.random() < .35) { const big = Math.max(...xy.map(p => p[0]));
          return { text: `x² − y² = ${n} tənliyinin natural həllərində x-in ən böyük qiyməti neçədir?`, answer: big, show: S(big), tol: 0.01, solution: why + ` Ən böyük x = ${big}.` }; }
        return { text: `x² − y² = ${n} tənliyinin neçə natural həlli (x; y) var?`, answer: sol.length, show: S(sol.length), tol: 0.01, solution: why + ` Cavab: ${sol.length}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Əşyaların sayı natural ədəddir — tənlik qur, tam həllərini say.",
      gen() {
        const kind = pick(["pul", "qus", "marka"]);
        if (kind === "pul") {
          let a, b, c, sol; do { [a, b] = [rnd(2, 10), rnd(2, 10)]; c = rnd(20, 120); sol = linSols(a, b, c); } while (a >= b || sol.length < 1);
          return { text: `Kassada yalnız ${a} və ${b} manatlıq əskinaslar var. ${c} manatı neçə müxtəlif yolla ödəmək olar, əgər hər növdən ən azı bir əskinas işlədilməlidir?`, answer: sol.length, show: S(sol.length), tol: 0.01,
            solution: `${a}x + ${b}y = ${c}, x, y ≥ 1. Həllər: ${short(sol)}. Cəmi ${sol.length}.` };
        }
        if (kind === "qus") {
          let p, q, N, sol;
          do { p = rnd(3, 6); q = rnd(2, p - 1); N = pick([60, 80, 90, 100, 120]); sol = []; for (let x = 1; x < N; x++) for (let y = 1; x + y < N; y++) { const z = N - x - y; if (z % 3 === 0 && 3 * p * x + 3 * q * y + z === 3 * N) sol.push([x, y, z]); } } while (!sol.length);
          return { text: `${N} manata ${N} quş alındı: xoruz ${p} manat, toyuq ${q} manat, 3 cücə isə 1 manatdır. Hər növdən ən azı biri alınıb. Neçə müxtəlif alış variantı var?`, answer: sol.length, show: S(sol.length), tol: 0.01,
            solution: `x + y + z = ${N}, ${p}x + ${q}y + z/3 = ${N}. İkincini 3-ə vurub birincini çıx: ${3 * p - 1}x + ${3 * q - 1}y = ${2 * N}. Natural həllər (z = ${N} − x − y ≥ 1): ${sol.map(([x, y, z]) => `(${x}; ${y}; ${z})`).join(", ")}. Cəmi ${sol.length}.` };
        }
        let a, b, c, best; do { a = rnd(3, 12); b = rnd(a + 1, 20); c = rnd(30, 200); best = Infinity; for (let x = 0; a * x <= c; x++) if ((c - a * x) % b === 0) best = Math.min(best, x + (c - a * x) / b); } while (!isFinite(best) || gcd(a, b) > 1);
        const all = linSols(a, b, c, 0);
        return { text: `Poçtda ${a} və ${b} qəpiklik markalar var. Bağlamaya düz ${c} qəpiklik marka yapışdırmaq lazımdır. Ən azı neçə marka lazımdır? (bir növdən heç istifadə etməmək də olar)`, answer: best, show: S(best), tol: 0.01,
          solution: `${a}x + ${b}y = ${c}, x, y ≥ 0. Həllər (x; y): ${short(all)}. Baha marka (${b}) nə qədər çoxdursa, say o qədər azdır: ən azı ${best}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "ax + by = c natural həlləri üç addımda tapılıb, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        let a, b; do { [a, b] = [rnd(2, 9), rnd(2, 9)]; } while (a === b || gcd(a, b) !== 1);
        const x0 = rnd(1, b), y0 = a * rnd(1, 3) + rnd(1, a), c = a * x0 + b * y0, K = Math.floor((y0 - 1) / a) + 1;
        const steps = [`Xüsusi həll: x = ${x0}, y = ${y0} (${a} · ${x0} + ${b} · ${y0} = ${c}).`,
          `Ümumi həll: x = ${x0} + ${b}t, y = ${y0} − ${a}t (t — tam).`,
          `x ≥ 1, y ≥ 1 → t = ${tl(K)}: cəmi ${K} natural həll.`];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `Xüsusi həll: x = ${x0}, y = ${y0 + 1} (${a} · ${x0} + ${b} · ${y0 + 1} = ${c}).`;
        if (bad === 1) steps[1] = `Ümumi həll: x = ${x0} + ${a}t, y = ${y0} − ${b}t (t — tam).`;
        if (bad === 2) { const K2 = K + pick([-1, 1]); steps[2] = `x ≥ 1, y ≥ 1 → t = ${tl(K2)}: cəmi ${K2} natural həll.`; }
        const text = h("div", {}, h("p", {}, `${lin(a, b, c)} tənliyinin natural həlləri:`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: ${a} · ${x0} + ${b} · ${y0 + 1} = ${c + b}, ${c} yox. Düz xüsusi həll: (${x0}; ${y0}).`,
          `2-ci addım: x-ə y-nin əmsalı (${b}t), y-dən x-in əmsalı (${a}t) gedir: x = ${x0} + ${b}t, y = ${y0} − ${a}t. Yoxsa cəm dəyişir.`,
          `3-cü addım: y = ${y0} − ${a}t ≥ 1 → t ≤ ${K - 1}; t = ${tl(K)} — cəmi ${K} həll.`][bad];
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
      key: "ol-diofant", title: "Diofant tənlikləri", fenn: "olimpiada", link: "dersler/ol-diofant.html",
      format: "Cavab ədəddir: həllərin sayı (yoxdursa 0) və ya soruşulan qiymət.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["xetti", "xetti", "umumi", "umumi", "vuruq", "vuruq", "kvfferq", "kvfferq", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-diofant.html")) b.push("dersler/ol-diofant.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
