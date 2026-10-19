// Binom açılışı, aⁿ ± bⁿ və bölünmə (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nz = (a, b) => { let v = 0; while (!v) v = rnd(a, b); return v; };
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const B = n => n < 0 ? "(" + S(n) + ")" : String(n);
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = n => String(n).split("").map(d => SUP[+d]).join("");
  const pw = (b, e) => e === 1 ? String(b) : b + sup(e);                 // a³, a
  const pwn = (n, e) => e === 1 ? S(n) : B(n) + sup(e);                  // (−2)³
  const xp = e => e === 0 ? "" : e === 1 ? "x" : "x" + sup(e);
  const poly = ts => { let o = ""; for (const [c, e] of ts) { if (!c) continue; const a = Math.abs(c), body = e ? (a === 1 ? xp(e) : a + xp(e)) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const C = (n, k) => { if (k < 0 || k > n) return 0; let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
  const Cw = (n, k) => { const j = Math.min(k, n - k); if (j === 0) return `C(${n}, ${k}) = 1`; if (j === 1) return `C(${n}, ${k}) = ${n}`;
    const up = [], dn = []; for (let i = 0; i < j; i++) { up.push(n - i); dn.push(i + 1); } return `C(${n}, ${k}) = ${up.join("·")}/(${dn.join("·")}) = ${C(n, k)}`; };
  const mpow = (a, e, m) => { let r = 1 % m, b = ((a % m) + m) % m; while (e > 0) { if (e % 2) r = r * b % m; b = b * b % m; e = Math.floor(e / 2); } return r; };
  const mod = (a, m) => ((a % m) + m) % m;
  const DAYS = ["bazar ertəsi", "çərşənbə axşamı", "çərşənbə", "cümə axşamı", "cümə", "şənbə", "bazar"];

  // b^e = m + s (s = ±1), e ≥ 2: b^N mod m via (m ± 1)^q
  const QB = [];
  for (let b = 2; b <= 15; b++) for (let e = 2; e <= 6; e++) for (const s of [1, -1]) { const m = b ** e - s; if (m >= 6 && m <= 400) QB.push([b, e, s, m]); }

  const levels = [
    { id: "paskal", ad: "Paskal üçbucağı, C(n, k)", izah: "(a + b)ⁿ açılışında aⁿ⁻ᵏbᵏ həddinin əmsalı C(n, k) = n·(n − 1)·…/(1·2·…·k). Hər ədəd üstündəki iki ədədin cəmidir.",
      gen() {
        const kind = pick(["C", "C", "row", "max", "rule"]);
        if (kind === "C") {
          const n = rnd(5, 12), k = rnd(2, n - 2), ans = C(n, k);
          return { text: `(a + b)${sup(n)} açılışında ${pw("a", n - k)}${pw("b", k)} həddinin əmsalı neçədir?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `n = ${n} mötərizədən ${k} dənəsində b seçilir: ${Cw(n, k)}.` };
        }
        if (kind === "row") {
          const n = rnd(5, 15), ans = 2 ** n;
          return { text: `Paskal üçbucağının 1, ${n}, … ədədləri ilə başlayan sətrindəki bütün ədədlərin cəmi neçədir?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Bu sətir (a + b)${sup(n)} açılışının əmsallarıdır. a = b = 1 qoysaq, əmsalların cəmi (1 + 1)${sup(n)} = 2${sup(n)} = ${ans}.` };
        }
        if (kind === "max") {
          const n = rnd(6, 14), k = Math.floor(n / 2), ans = C(n, k);
          return { text: `(a + b)${sup(n)} açılışında ən böyük əmsal neçədir?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Paskal sətrində ədədlər ortaya qədər artır, sonra simmetrik azalır. Ən böyüyü ortadadır: ${Cw(n, k)}.` };
        }
        const n = rnd(6, 13), k = rnd(2, n - 3), X = C(n, k), Y = C(n, k + 1);
        return { text: `C(${n}, ${k}) = ${X} və C(${n}, ${k + 1}) = ${Y}. C(${n + 1}, ${k + 1}) = ?`, answer: X + Y, show: String(X + Y), tol: 0.01,
          solution: `Paskal qaydası: C(n + 1, k + 1) = C(n, k) + C(n, k + 1) (hər ədəd üstündəki iki ədədin cəmidir). ${X} + ${Y} = ${X + Y}.` };
      } },
    { id: "emsal", ad: "Konkret həddin əmsalı", izah: "Ümumi hədd: C(n, k)·Aⁿ⁻ᵏ·Bᵏ. x-in lazım olan qüvvətini verən k-nı tap, sonra hesabla. Mənfi işarəni unutma!",
      gen() {
        if (Math.random() < .5) {
          let p, q; do { p = pick([1, 2, 3, -1, -2]); q = pick([1, 2, 3, -1, -2, -3]); } while (p === 1 && q === 1);
          const n = rnd(4, 8), k = rnd(1, n - 1), ans = C(n, k) * p ** k * q ** (n - k);
          return { text: `(${poly([[p, 1], [q, 0]])})${sup(n)} açılışında ${xp(k)} həddinin əmsalı neçədir?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Ümumi hədd: C(${n}, j)·${p === 1 ? "x" : "(" + poly([[p, 1]]) + ")"}${sup(n)}⁻ʲ·${B(q)}ʲ. ${xp(k)} üçün ${n} − j = ${k} → j = ${n - k}. ` +
              `Əmsal: C(${n}, ${n - k})·${pwn(p, k)}·${pwn(q, n - k)} = ${C(n, k)}·${B(p ** k)}·${B(q ** (n - k))} = ${S(ans)}.` };
        }
        let al, be, n, k, c, ans;
        do {
          [al, be] = pick([[1, 1], [2, 1], [1, 2], [3, 1], [1, 3], [3, 2], [2, 3]]);
          const step = (al + be); n = step * rnd(1, Math.floor(12 / step)); k = al * n / (al + be);
          c = pick([1, 2, -1, -2, 3, -3]); ans = C(n, k) * c ** k;
        } while (n < 3 || Math.abs(c ** k) > 1000 || k === 0 || k === n);
        const xa = xp(al), xb = xp(be);
        return { text: `(${xa} ${c < 0 ? "−" : "+"} ${Math.abs(c)}/${xb})${sup(n)} açılışında x-dən asılı olmayan həddi (sərbəst həddi) tap.`, answer: ans, show: S(ans), tol: 0.01,
          solution: `Ümumi hədd: C(${n}, k)·(${xa})${sup(n)}⁻ᵏ·(${S(c)}/${xb})ᵏ = C(${n}, k)·${B(c)}ᵏ·x üstü ${al === 1 ? "" : al + "·"}(${n} − k) − ${be === 1 ? "" : be}k. ` +
            `Üst 0 olmalıdır: ${al === 1 ? "" : al + "·"}(${n} − k) = ${be === 1 ? "" : be}k → k = ${k}. Hədd: C(${n}, ${k})·${pwn(c, k)} = ${C(n, k)}·${B(c ** k)} = ${S(ans)}, burada ${Cw(n, k)}.` };
      } },
    { id: "cem", ad: "Əmsalların cəmi: P(1), P(0), P(−1)", izah: "Bütün əmsalların cəmi — P(1). Sərbəst hədd — P(0). Cüt qüvvətlərin əmsalları cəmi — (P(1) + P(−1))/2, tək qüvvətlərinki — (P(1) − P(−1))/2.",
      gen() {
        const kind = pick(["all", "all", "free", "even"]);
        if (kind === "all") {
          const s = pick([-1, 1, -1, 1, 2, -2, 3]), n = Math.abs(s) === 1 ? rnd(2000, 2030) : Math.abs(s) === 2 ? rnd(3, 10) : rnd(3, 6);
          let a, b, c; do { a = nz(-5, 5); b = nz(-7, 7); c = s - a - b; } while (!c);
          const ans = s ** n;
          return { text: `(${poly([[a, 2], [b, 1], [c, 0]])})${sup(n)} ifadəsinin açılışında bütün əmsalların cəmi neçədir?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Əmsalların cəmi = P(1). x = 1: (${S(a)} ${b < 0 ? "−" : "+"} ${Math.abs(b)} ${c < 0 ? "−" : "+"} ${Math.abs(c)})${sup(n)} = ${pwn(s, n)} = ${S(ans)}.` };
        }
        if (kind === "free") {
          const c = nz(-3, 3), n = Math.abs(c) === 3 ? rnd(2, 6) : rnd(3, 9), a = nz(-5, 5), b = nz(-6, 6), ans = c ** n;
          return { text: `(${poly([[a, 2], [b, 1], [c, 0]])})${sup(n)} ifadəsinin açılışında sərbəst hədd neçədir?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Sərbəst hədd = P(0). x = 0 qoysaq yalnız ${S(c)} qalır: ${pwn(c, n)} = ${S(ans)}.` };
        }
        const p = rnd(1, 3), q = nz(-3, 3), n = rnd(3, 7), P1 = (p + q) ** n, Pm = (q - p) ** n, even = Math.random() < .55;
        const ans = even ? (P1 + Pm) / 2 : (P1 - Pm) / 2;
        return { text: `(${poly([[p, 1], [q, 0]])})${sup(n)} ifadəsinin açılışında x-in ${even ? "cüt qüvvətlərindəki (sərbəst hədd də daxil)" : "tək qüvvətlərindəki"} əmsalların cəmi neçədir?`, answer: ans, show: S(ans), tol: 0.01,
          solution: `P(1) = ${pwn(p + q, n)} = ${S(P1)} — bütün əmsallar; P(−1) = ${pwn(q - p, n)} = ${S(Pm)} — cüt qüvvətlərdəkilər «+», tək qüvvətlərdəkilər «−» işarə ilə. ` +
            (even ? `Toplayıb 2-yə bölürük: (${S(P1)} + ${B(Pm)})/2 = ${S(ans)}.` : `Çıxıb 2-yə bölürük: (${S(P1)} − ${B(Pm)})/2 = ${S(ans)}.`) };
      } },
    { id: "anbn", ad: "aⁿ − bⁿ, aⁿ + bⁿ bölünür", izah: "aⁿ − bⁿ həmişə a − b-yə bölünür. n təkdirsə aⁿ + bⁿ bölünür a + b-yə; n cütdürsə aⁿ − bⁿ bölünür a + b-yə.",
      gen() {
        const kind = pick(["diff", "sum", "pm1"]);
        if (kind === "diff") {
          const m = rnd(3, 12), b = rnd(2, 20), a = b + m, N = rnd(50, 2030), c = rnd(m + 1, 80), ans = c % m;
          return { text: `Qalığı tap: (${a}ᴺ − ${b}ᴺ + ${c}) mod ${m} = ?, burada N = ${N}.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${a} − ${b} = ${m}, aⁿ − bⁿ isə həmişə a − b-yə bölünür: ${a}ᴺ − ${b}ᴺ ≡ 0 (mod ${m}). Qalıq ${c} ədədinin qalığı ilə eynidir: ${c} = ${m}·${Math.floor(c / m)} + ${ans}. Cavab: ${ans}.` };
        }
        if (kind === "sum") {
          const a = rnd(3, 25), b = rnd(2, a - 1), m = a + b, N = rnd(50, 2030), c = rnd(m + 1, 90), ans = c % m, odd = N % 2 === 1;
          return { text: `Qalığı tap: (${a}ᴺ ${odd ? "+" : "−"} ${b}ᴺ + ${c}) mod ${m} = ?, burada N = ${N}.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${a} + ${b} = ${m}. N = ${N} ${odd ? "təkdir, ona görə aᴺ + bᴺ" : "cütdür, ona görə aᴺ − bᴺ"} ədədi a + b-yə bölünür (${a} ≡ −${b} (mod ${m})). Qalıq ${c} ədədinin qalığı ilə eynidir: ${c} = ${m}·${Math.floor(c / m)} + ${ans}. Cavab: ${ans}.` };
        }
        const a = rnd(3, 30), plus = Math.random() < .6, N = rnd(50, 2030), c = rnd(0, 9);
        if (plus) {
          const m = a + 1, ans = mod((N % 2 ? a : 1) + c, m);
          return { text: `Qalığı tap: (${a}ᴺ + ${c}) mod ${m} = ?, burada N = ${N}.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${a} = ${m} − 1 ≡ −1 (mod ${m}), deməli ${a}ᴺ ≡ (−1)ᴺ = ${N % 2 ? "−1" : "1"} (N ${N % 2 ? "tək" : "cüt"}). ${N % 2 ? `−1 + ${c}` : `1 + ${c}`} = ${(N % 2 ? -1 : 1) + c}` + ((N % 2 ? -1 : 1) + c !== ans ? ` ≡ ${ans}` : "") + ` (mod ${m}). Cavab: ${ans}.` };
        }
        const m = a - 1, ans = mod(1 + c, m);
        return { text: `Qalığı tap: (${a}ᴺ + ${c}) mod ${m} = ?, burada N = ${N}.`, answer: ans, show: String(ans), tol: 0.01,
          solution: `${a}ᴺ − 1ᴺ ədədi ${a} − 1 = ${m} ədədinə bölünür, yəni ${a}ᴺ ≡ 1 (mod ${m}). 1 + ${c} = ${1 + c}` + (1 + c !== ans ? ` ≡ ${ans}` : "") + ` (mod ${m}). Cavab: ${ans}.` };
      } },
    { id: "qaliq", ad: "Binomla qalıq", izah: "Qüvvəti m ± 1 şəklinə sal: (m + 1)^q ≡ 1, (m − 1)^q ≡ (−1)^q (mod m) — açılışda sonuncudan başqa bütün hədlər m-ə bölünür.",
      gen() {
        if (Math.random() < .3) {
          const k = rnd(1, 9), b = 10 * k + 1, N = rnd(10, 999), big = 1 + 10 * k * N, ans = big % 100;
          return { text: `${b}${sup(N)} ədədinin son iki rəqəmindən əmələ gələn ədəd neçədir? (məs. …07 olarsa, 7 yaz)`, answer: ans, show: String(ans), tol: 0.01,
            solution: `(${10 * k} + 1)${sup(N)} = 1 + ${N}·${10 * k} + C(${N}, 2)·${10 * k}² + … — üçüncü həddən başlayaraq hamısı 100-ə bölünür. Deməli son iki rəqəm 1 + ${N}·${10 * k} = ${big} ədədinin son iki rəqəmidir: ${String(ans).padStart(2, "0")}. Cavab: ${ans}.` };
        }
        const [b, e, s, m] = pick(QB), N = rnd(20, 999), q = Math.floor(N / e), r = N % e, br = b ** r, sg = s < 0 && q % 2 ? -1 : 1, ans = mpow(b, N, m);
        return { text: `Qalığı tap: ${b}${sup(N)} mod ${m} = ?`, answer: ans, show: String(ans), tol: 0.01, placeholder: "qalıq",
          solution: `${pw(b, e)} = ${b ** e} = ${m} ${s > 0 ? "+" : "−"} 1, yəni ${pw(b, e)} ≡ ${S(s)} (mod ${m}) (binom: (${m} ${s > 0 ? "+" : "−"} 1)^q açılışında sonuncudan başqa bütün hədlərdə ${m} vuruğu var). ` +
            `${N} = ${e}·${q} + ${r} → ${b}${sup(N)} = (${pw(b, e)})${sup(q)}${r ? "·" + pw(b, r) : ""} ≡ ${s > 0 ? "1" : `(−1)${sup(q)}`}${r ? "·" + br : ""} = ${S(sg * br)}` + (sg * br !== ans ? ` ≡ ${ans}` : "") + ` (mod ${m}). Cavab: ${ans}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "(x + c)ⁿ açılışında əmsal tapılır. Yoxla: ümumi hədd düzdürmü, k düz seçilibmi, hesab düzdürmü.",
      gen() {
        let n, k; do { n = rnd(5, 9); k = rnd(2, n - 2); } while (2 * k === n);
        const c = pick([2, 3, -2, -3]), j = n - k, Cn = C(n, j), right = Cn * c ** j, bad = rnd(0, 2);
        let s1 = `Ümumi hədd: C(${n}, j)·x${sup(n)}⁻ʲ·${B(c)}ʲ.`, s2 = `x${sup(k)} üçün ${n} − j = ${k} → j = ${j}.`, s3 = `Əmsal: C(${n}, ${j})·${pwn(c, j)} = ${Cn}·${B(c ** j)} = ${S(right)}.`;
        if (bad === 0) { s1 = `Ümumi hədd: ${n}·x${sup(n)}⁻ʲ·${B(c)}ʲ.`; s3 = `Əmsal: ${n}·${pwn(c, j)} = ${n}·${B(c ** j)} = ${S(n * c ** j)}.`; }
        if (bad === 1) { s2 = `x${sup(k)} üçün j = ${k}.`; s3 = `Əmsal: C(${n}, ${k})·${pwn(c, k)} = ${C(n, k)}·${B(c ** k)} = ${S(C(n, k) * c ** k)}.`; }
        if (bad === 2) { const w = right + pick([-1, 1]) * Cn; s3 = `Əmsal: C(${n}, ${j})·${pwn(c, j)} = ${Cn}·${B(c ** j)} = ${S(w)}.`; }
        const text = h("div", {}, h("p", {}, `Fikrət (x ${c < 0 ? "−" : "+"} ${Math.abs(c)})${sup(n)} açılışında x${sup(k)} həddinin əmsalını tapır. Birinci səhv hansı addımdadır?`),
          h("ol", { class: "oy-steps" }, h("li", {}, s1), h("li", {}, s2), h("li", {}, s3)));
        const why = [`1-ci addım: həddin əmsalı ${n} yox, C(${n}, j)-dir. Düz cavab: ${S(right)}.`,
          `2-ci addım: x-in üstü ${n} − j-dir, ona görə ${n} − j = ${k} → j = ${j}. Düz cavab: ${S(right)}.`,
          `3-cü addım: ${Cn}·${B(c ** j)} = ${S(right)}.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Ən qısa yolların sayı və komanda seçmək — C(n, k); təqvim — qalıq, 7 ± 1 kimi ədədlərlə.",
      gen() {
        const kind = pick(["yol", "komanda", "gun"]);
        if (kind === "yol") {
          const m = rnd(2, 7), n = rnd(2, 7), ans = C(m + n, m);
          return { text: `Şəhərin küçələri dama-dama torudur. Fikrət evdən məktəbə getmək üçün ${m} məhəllə şərqə və ${n} məhəllə şimala getməlidir (yalnız şərqə və şimala hərəkət edir). Neçə müxtəlif ən qısa yol var?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Hər yol ${m + n} addımdır; onlardan hansı ${m} addımın şərqə olduğunu seçmək kifayətdir: ${Cw(m + n, m)}.` };
        }
        if (kind === "komanda") {
          const n = rnd(6, 15), k = rnd(2, 4), ans = C(n, k);
          return { text: `Sinifdə ${n} şagird var. Olimpiadaya ${k} nəfərlik komanda neçə üsulla seçilə bilər?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Sıra önəmli deyil, ${n} nəfərdən ${k} nəfər seçirik: ${Cw(n, k)}.` };
        }
        const b = pick([6, 8, 13, 15, 20, 22, 27, 29]), N = rnd(10, 999), st = rnd(0, 6), r = mpow(b, N, 7), d = (st + r) % 7, s = b % 7 === 1 ? 1 : -1;
        return { text: `Bu gün — ${DAYS[st]}. ${b}${sup(N)} gündən sonra həftənin hansı günü olacaq? Günü nömrə ilə yaz: bazar ertəsi — 1, çərşənbə axşamı — 2, …, bazar — 7.`, answer: d + 1, show: String(d + 1), tol: 0.01,
          solution: `Həftə 7 gündür, lazım olan ${b}${sup(N)} mod 7. ${b} = 7·${Math.round((b - s) / 7)} ${s > 0 ? "+" : "−"} 1 ≡ ${S(s)} (mod 7), deməli ${b}${sup(N)} ≡ ${s > 0 ? "1" : `(−1)${sup(N)} = ${N % 2 ? "−1 ≡ 6" : "1"}`} (mod 7). Başlanğıc gündən ${r} gün irəli: ${DAYS[st]} → ${DAYS[d]} (${d + 1}).` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-binom", title: "Binom açılışı, aⁿ ± bⁿ və bölünmə", fenn: "riyaziyyat", link: "dersler/ol-binom.html",
      format: "Cavab ədəddir: əmsal (mənfi də ola bilər, məs. −720), qalıq (0, 1, 2, …), yolların sayı. Qalıq heç vaxt mənfi olmur.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["paskal", "emsal", "emsal", "cem", "cem", "anbn", "qaliq", "qaliq", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-binom.html")) b.push("dersler/ol-binom.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
