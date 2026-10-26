// Ferma, Eyler, Vilson teoremləri (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = n => String(n).split("").map(d => SUP[+d]).join("");
  const pw = (a, e) => a + sup(e);                                     // 2¹⁰⁰
  const mpow = (a, e, m) => { let r = 1 % m, b = a % m; while (e > 0) { if (e % 2) r = r * b % m; b = b * b % m; e = Math.floor(e / 2); } return r; };
  const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  const factor = n => { const f = []; for (let p = 2; p * p <= n; p++) { let e = 0; while (n % p === 0) { n /= p; e++; } if (e) f.push([p, e]); } if (n > 1) f.push([n, 1]); return f; };
  const phi = n => factor(n).reduce((s, [p, e]) => s * (p - 1) * p ** (e - 1), 1);
  const fstr = f => f.map(([p, e]) => e > 1 ? pw(p, e) : String(p)).join(" · ");
  const PRIMES = []; for (let p = 5; p < 100; p++) if (isPrime(p)) PRIMES.push(p);

  // b^r mod m, written out step by step (small r: every power; big r: squares + binary split)
  function powSteps(b, r, m) {
    const ans = mpow(b, r, m);
    if (r === 0) return `${pw(b, 0)} = 1`;
    if (r === 1) return `${pw(b, 1)} = ${b} ≡ ${ans}`;
    if (r <= 6) { const xs = []; let v = 1; for (let i = 1; i <= r; i++) { v = v * b % m; xs.push(`${pw(b, i)} ≡ ${v}`); } return xs.join(", "); }
    const sq = []; let v = b % m;
    for (let k = 1; k <= r; k *= 2) { sq.push([k, v]); v = v * v % m; }
    const parts = sq.filter(([k]) => r & k);
    return sq.map(([k, x]) => `${pw(b, k)} ≡ ${x}`).join(", ") + `; ${r} = ${parts.map(p => p[0]).join(" + ")} → ${pw(b, r)} ≡ ${parts.map(p => p[1]).join(" · ")} ≡ ${ans}`;
  }

  const DAYS = ["bazar ertəsi", "çərşənbə axşamı", "çərşənbə", "cümə axşamı", "cümə", "şənbə", "bazar"];

  const levels = [
    { id: "ferma", ad: "Kiçik Ferma teoremi", izah: "p sadədirsə və a ədədi p-yə bölünmürsə, aᵖ⁻¹ ≡ 1 (mod p). Üstü p − 1-ə böl, qalığa bax.",
      gen() {
        const p = pick([5, 7, 11, 13, 17, 19, 23]);
        let a = rnd(2, 60); while (a % p === 0) a = rnd(2, 60);
        const N = rnd(50, 3000), q = Math.floor(N / (p - 1)), r = N % (p - 1), b = a % p, ans = mpow(a, N, p);
        return { text: `Qalığı tap: ${pw(a, N)} mod ${p} = ?`, answer: ans, show: String(ans), tol: 0.01, placeholder: "qalıq",
          solution: `${p} sadədir və ${a} ədədi ona bölünmür, Ferma: ${pw(a, p - 1)} ≡ 1 (mod ${p}). ${N} = ${p - 1}·${q} + ${r}, deməli ${pw(a, N)} ≡ ${pw(a, r)} (mod ${p}).` +
            (b !== a ? ` ${a} ≡ ${b} (mod ${p}), ona görə ${pw(b, r)} hesablayırıq: ` : " ") + `${powSteps(b, r, p)} (mod ${p}). Cavab: ${ans}.` };
      } },
    { id: "phi", ad: "Eyler funksiyası φ(n)", izah: "φ(n) — 1-dən n-ə qədər n ilə qarşılıqlı sadə ədədlərin sayı. φ(pᵏ) = pᵏ − pᵏ⁻¹, qarşılıqlı sadə vuruqlarda hasil olur.",
      gen() {
        let n;
        for (;;) {
          const ps = [2, 3, 5, 7, 11, 13].sort(() => Math.random() - .5).slice(0, rnd(1, 3));
          n = ps.reduce((s, p) => s * p ** rnd(1, p < 5 ? 4 : 2), 1);
          if (n >= 12 && n <= 3000 && !isPrime(n)) break;
        }
        const f = factor(n), ans = phi(n);
        const parts = f.map(([p, e]) => e > 1 ? `(${pw(p, e)} − ${pw(p, e - 1)})` : `(${p} − 1)`);
        const text = Math.random() < .5 ? `φ(${n}) = ?` : `1-dən ${n} ədədinə qədər olan natural ədədlərdən neçəsi ${n} ilə qarşılıqlı sadədir?`;
        return { text, answer: ans, show: String(ans), tol: 0.01,
          solution: `${n} = ${fstr(f)}. φ(${n}) = ${parts.join("·")} = ${f.map(([p, e]) => (p - 1) * p ** (e - 1)).join("·")} = ${ans}.` };
      } },
    { id: "eyler", ad: "Eyler teoremi", izah: "ƏBOB(a, m) = 1 olanda a^φ(m) ≡ 1 (mod m). Son rəqəm — mod 10, son iki rəqəm — mod 100.",
      gen() {
        const kind = pick(["d1", "d2", "m", "m"]);
        const m = kind === "d1" ? 10 : kind === "d2" ? 100 : pick([9, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 33, 35]);
        let a = rnd(2, 99); while (gcd(a, m) !== 1 || a % m === 1) a = rnd(2, 99);
        const N = rnd(100, 5000), f = phi(m), q = Math.floor(N / f), r = N % f, b = a % m, ans = mpow(a, N, m);
        const text = kind === "d1" ? `${pw(a, N)} ədədinin son rəqəmi neçədir?` :
          kind === "d2" ? `${pw(a, N)} ədədinin son iki rəqəmindən əmələ gələn ədəd neçədir? (məs. …07 olarsa, 7 yaz)` : `Qalığı tap: ${pw(a, N)} mod ${m} = ?`;
        return { text, answer: ans, show: String(ans), tol: 0.01,
          solution: (kind !== "m" ? `Lazım olan ${pw(a, N)} mod ${m}. ` : "") + `ƏBOB(${a}, ${m}) = 1, φ(${m}) = ${f}, Eyler: ${pw(a, f)} ≡ 1 (mod ${m}). ${N} = ${f}·${q} + ${r} → ${pw(a, N)} ≡ ${pw(a, r)}.` +
            (b !== a ? ` ${a} ≡ ${b} (mod ${m}): ` : " ") + `${powSteps(b, r, m)} (mod ${m}). Cavab: ${ans}.` };
      } },
    { id: "vilson", ad: "Vilson teoremi", izah: "p sadədirsə, (p − 1)! ≡ −1 (mod p). Faktorialın sonundakı vuruqları −1, −2, … kimi yaz.",
      gen() {
        const kind = pick(["a", "b", "c", "d", "e"]);
        if (kind === "d") {
          let n = rnd(6, 60); while (isPrime(n)) n = rnd(6, 60);
          const f = factor(n), x = f.length > 1 || f[0][1] === 1 ? `${f[0][0] ** f[0][1]} · ${n / f[0][0] ** f[0][1]}` : null;
          let why;
          if (f.length > 1) why = `${n} = ${x}, hər iki vuruq fərqlidir və ${n - 1} ədədindən kiçikdir — ikisi də ${n - 1}! hasilində var.`;
          else { const p = f[0][0], e = f[0][1]; why = e === 2 ? `${n} = ${pw(p, 2)}. Hasildə ${p} və ${2 * p} vuruqları var (${2 * p} < ${n}), onların hasili ${2 * p * p} = 2 · ${n}.` : `${n} = ${pw(p, e)}. Hasildə ${p} və ${p ** (e - 1)} vuruqları var (fərqlidir, hər ikisi ${n} ədədindən kiçikdir), hasilləri düz ${n}.`; }
          return { text: `Qalığı tap: ${n - 1}! mod ${n} = ?`, answer: 0, show: "0", tol: 0.01,
            solution: `${n} mürəkkəb ədəddir (və 4 deyil), ona görə ${n - 1}! ona tam bölünür. ${why} Qalıq: 0.` };
        }
        const p = pick(PRIMES);
        if (kind === "a") return { text: `Qalığı tap: ${p - 1}! mod ${p} = ?`, answer: p - 1, show: String(p - 1), tol: 0.01,
          solution: `${p} sadədir. Vilson: ${p - 1}! ≡ −1 (mod ${p}). Qalıq mənfi olmur: −1 + ${p} = ${p - 1}.` };
        if (kind === "b") return { text: `Qalığı tap: ${p - 2}! mod ${p} = ?`, answer: 1, show: "1", tol: 0.01,
          solution: `Vilson: ${p - 1}! = ${p - 1} · ${p - 2}! ≡ −1 (mod ${p}). ${p - 1} ≡ −1, deməli −1 · ${p - 2}! ≡ −1 → ${p - 2}! ≡ 1. Qalıq: 1.` };
        if (kind === "c") { const ans = (p - 1) / 2;
          return { text: `Qalığı tap: ${p - 3}! mod ${p} = ?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Vilson: ${p - 1}! = ${p - 1} · ${p - 2} · ${p - 3}! ≡ −1. ${p - 1} ≡ −1, ${p - 2} ≡ −2, hasilləri 2. Deməli 2 · ${p - 3}! ≡ −1 ≡ ${p - 1} (mod ${p}) → ${p - 3}! ≡ ${ans} (çünki 2 · ${ans} = ${p - 1}). Qalıq: ${ans}.` }; }
        const k = rnd(2, p + 20), ans = ((k - 1) % p + p) % p;
        return { text: `Qalığı tap: (${p - 1}! + ${k}) mod ${p} = ?`, answer: ans, show: String(ans), tol: 0.01,
          solution: `Vilson: ${p - 1}! ≡ −1 (mod ${p}). Deməli ${p - 1}! + ${k} ≡ ${k - 1}` + (k - 1 !== ans ? ` ≡ ${ans}` : "") + ` (mod ${p}). Qalıq: ${ans}.` };
      } },
    { id: "qule", ad: "Qüllə: a üstü (b üstü c)", izah: "Böyük üstü əvvəlcə φ(m)-ə görə kiçilt: aᴺ ≡ aʳ, burada r = N mod φ(m). N özü də qüvvətdirsə, onu mod φ(m) hesabla.",
      gen() {
        const m = pick([7, 10, 11, 13]), f = phi(m);
        let a = rnd(2, 19); while (gcd(a, m) !== 1 || a % m === 1) a = rnd(2, 19);
        const b = rnd(2, 9), c = rnd(2, 5), N = b ** c, r = N % f, ans = mpow(a, N, m);
        const text = m === 10 ? `N = ${pw(b, c)}. ${a}ᴺ ədədinin son rəqəmi neçədir?` : `N = ${pw(b, c)}. Qalığı tap: ${a}ᴺ mod ${m} = ?`;
        return { text, answer: ans, show: String(ans), tol: 0.01,
          solution: `φ(${m}) = ${f}, ƏBOB(${a}, ${m}) = 1 → ${pw(a, f)} ≡ 1 (mod ${m}). Üstün qalığı: ${pw(b, c)} mod ${f}: ${b % f !== b ? `${b} ≡ ${b % f}, ` : ""}${powSteps(b % f, c, f)} (mod ${f}), yəni N = ${f}·k + ${r}. ` +
            `Deməli ${a}ᴺ ≡ ${pw(a % m, r)}: ${powSteps(a % m, r, m)} (mod ${m}). Cavab: ${ans}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Ferma ilə həll üç addımdır. Hər addımı yoxla: teoremin şərti, üstün bölünməsi, son hesablama.",
      gen() {
        const p = pick([7, 11, 13, 17, 19]), a = rnd(2, p - 2), N = rnd(100, 2500), q = Math.floor(N / (p - 1)), r = N % (p - 1), x = mpow(a, N, p);
        let r2 = rnd(0, p - 2); while (r2 === r) r2 = rnd(0, p - 2);
        let x2 = rnd(0, p - 1); while (x2 === x) x2 = rnd(0, p - 1);
        const steps = [
          `${p} sadədir, ${a} isə ${p} ədədinə bölünmür → ${pw(a, p - 1)} ≡ 1 (mod ${p}).`,
          `${N} = ${p - 1}·${q} + ${r} → ${pw(a, N)} ≡ ${pw(a, r)} (mod ${p}).`,
          `${pw(a, r)} ≡ ${x} (mod ${p}). Cavab: ${x}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `${p} sadədir, ${a} isə ${p} ədədinə bölünmür → ${pw(a, p)} ≡ 1 (mod ${p}).`;
        if (bad === 1) steps[1] = `${N} = ${p - 1}·${q} + ${r2} → ${pw(a, N)} ≡ ${pw(a, r2)} (mod ${p}).`;
        if (bad === 2) steps[2] = `${pw(a, r)} ≡ ${x2} (mod ${p}). Cavab: ${x2}.`;
        const text = h("div", {}, h("p", {}, `Elvin ${pw(a, N)} mod ${p} qalığını tapır. Hansı addımda səhv var?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: Ferma teoremi aᵖ ≡ 1 yox, ${pw(a, p - 1)} ≡ 1 deyir (üst p − 1 = ${p - 1}).`,
          `2-ci addım: ${p - 1}·${q} + ${r2} = ${(p - 1) * q + r2}, ${N} deyil. Düzü: ${N} = ${p - 1}·${q} + ${r}.`,
          `3-cü addım: ${powSteps(a, r, p)} (mod ${p}), yəni düz cavab ${x}.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Gün, saat, paylama — hamısı qalıq məsələsidir: həftə mod 7, siferblat mod 12.",
      gen() {
        const kind = pick(["week", "clock", "share"]);
        if (kind === "week") {
          const s = rnd(0, 6), a = rnd(2, 6), N = rnd(20, 600), r6 = N % 6, rem = mpow(a, N, 7), d = (s + rem) % 7;
          return { text: `Bu gün — ${DAYS[s]}. ${pw(a, N)} gündən sonra həftənin hansı günü olacaq? Günü nömrə ilə yaz: bazar ertəsi — 1, çərşənbə axşamı — 2, …, bazar — 7.`,
            answer: d + 1, show: String(d + 1), tol: 0.01,
            solution: `Həftə 7 gündür, lazım olan ${pw(a, N)} mod 7. Ferma: ${pw(a, 6)} ≡ 1, ${N} = 6·${Math.floor(N / 6)} + ${r6} → ${pw(a, r6)} ≡ ${rem} (mod 7). Başlanğıc gündən ${rem} gün irəli: ${DAYS[s]} → ${DAYS[d]} (${d + 1}).` };
        }
        if (kind === "clock") {
          const h0 = rnd(1, 12), a = pick([5, 7, 11, 17, 19, 23]), N = rnd(20, 999), rem = mpow(a, N, 12), pos = (h0 - 1 + rem) % 12 + 1;
          return { text: `Siferblatda saat əqrəbi ${h0} rəqəmini göstərir. ${pw(a, N)} saatdan sonra o hansı rəqəmi göstərəcək? (1-dən 12-yə qədər)`,
            answer: pos, show: String(pos), tol: 0.01,
            solution: `Siferblat 12 saatda dövr edir, lazım olan ${pw(a, N)} mod 12. φ(12) = 4, üstəlik ${a > 12 ? `${a} ≡ ${a % 12}, ` : ""}${pw(a % 12, 2)} = ${(a % 12) ** 2} ≡ 1 (mod 12). ${N} ${N % 2 ? "təkdir" : "cütdür"} → ${pw(a, N)} ≡ ${rem}. ${h0} + ${rem} → ${pos}.` };
        }
        const m = pick([7, 11, 13]); let a = rnd(2, 12); while (a % m === 0 || a % m === 1) a = rnd(2, 12);
        const N = rnd(30, 400), r = N % (m - 1), rem = mpow(a, N, m);
        return { text: `Qutuda ${pw(a, N)} konfet var. Onları ${m} uşağa bərabər paylayırlar, hər uşağa mümkün qədər çox düşsün. Neçə konfet artıq qalacaq?`,
          answer: rem, show: String(rem), tol: 0.01,
          solution: `Artıq qalan = ${pw(a, N)} mod ${m}. Ferma: ${pw(a, m - 1)} ≡ 1, ${N} = ${m - 1}·${Math.floor(N / (m - 1))} + ${r} → ${pw(a, N)} ≡ ${pw(a, r)}. ${a > m ? `${a} ≡ ${a % m}: ` : ""}${powSteps(a % m, r, m)} (mod ${m}). Artıq qalır: ${rem}.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-ferma-eyler", title: "Ferma, Eyler, Vilson teoremləri", fenn: "riyaziyyat", link: "dersler/ol-ferma-eyler.html",
      format: "Cavab ədəddir: qalıq (0, 1, 2, …), son rəqəm, φ(n)-in qiyməti. Qalıq heç vaxt mənfi olmur.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["ferma", "ferma", "phi", "eyler", "eyler", "vilson", "vilson", "qule", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-ferma-eyler.html")) b.push("dersler/ol-ferma-eyler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
