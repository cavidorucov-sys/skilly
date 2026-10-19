// Olimpiada: ƏBOB/ƏKOB, Evklid alqoritmi — oyun səviyyələri (Evklid, ƏBOB·ƏKOB, ifadələrin ƏBOB-u, Bezu, həyatdan, səhvi tap) və yekun sınaq.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  // Azerbaijani case suffixes after a numeral, by the last spoken word (3-ə, 6-ya, 9-un, 40-dan)
  const W = n => { if (n === 0) return "sıfır"; if (n % 1000 === 0) return "min"; if (n % 100 === 0) return "yüz"; if (n % 10 === 0) return ["", "on", "iyirmi", "otuz", "qırx", "əlli", "altmış", "yetmiş", "səksən", "doxsan"][(n / 10) % 10]; return ["", "bir", "iki", "üç", "dörd", "beş", "altı", "yeddi", "səkkiz", "doqquz"][n % 10]; };
  const VW = "aıoueəiöü";
  const sfx = (n, kind) => { const w = W(Math.abs(n)), vs = [...w].filter(c => VW.includes(c)), v = vs[vs.length - 1], endV = VW.includes(w[w.length - 1]), back = "aıou".includes(v);
    const four = "aı".includes(v) ? "ı" : "ou".includes(v) ? "u" : "eəi".includes(v) ? "i" : "ü";
    return n + "-" + ({ a: (endV ? "y" : "") + (back ? "a" : "ə"), dan: back ? "dan" : "dən" })[kind]; };
  const D = n => sfx(n, "a"), Ab = n => sfx(n, "dan");
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = k => String(k).split("").map(c => SUP[+c]).join("");
  const factor = n => { const f = []; for (let p = 2; p * p <= n; p++) { let k = 0; while (n % p === 0) { n /= p; k++; } if (k) f.push([p, k]); } if (n > 1) f.push([n, 1]); return f; };
  const fstr = f => f.map(([p, k]) => p + (k > 1 ? sup(k) : "")).join(" · ");
  // Euclid: [[a, b, q, r], ...] until remainder 0
  const euclid = (a, b) => { const st = []; while (b) { st.push([a, b, Math.floor(a / b), a % b]); [a, b] = [b, a % b]; } return st; };
  const stepTxt = st => st.map(([a, b, q, r]) => `${a} = ${q} · ${b} + ${r}`).join("; ");
  const coprimePair = (lo, hi) => { for (;;) { const x = rnd(lo, hi), y = rnd(lo, hi); if (x !== y && gcd(x, y) === 1) return [Math.max(x, y), Math.min(x, y)]; } };
  const PR = [2, 3, 5, 7, 11, 13];

  const levels = [
    { id: "evklid", ad: "Evklid alqoritmi", izah: "Böyüyü kiçiyə qalıqla böl, sonra böləni qalığa… Qalıq 0 olanda dayan: son sıfırdan fərqli qalıq — ƏBOB.",
      gen() {
        let a, b, g, st;
        do { g = rnd(3, 60); const [x, y] = coprimePair(8, 90); a = g * x; b = g * y; st = euclid(a, b); } while (a > 9999 || st.length < 3);
        const kind = pick(["ebob", "ebob", "qaliq", "say"]), steps = stepTxt(st);
        if (kind === "ebob")
          return { text: `Evklid alqoritmi ilə tap: ƏBOB(${a}; ${b}) = ?`, answer: g, show: S(g), tol: 0.01,
            solution: `${steps}. Son sıfırdan fərqli qalıq ${g} — ƏBOB budur.` };
        if (kind === "qaliq") { const [x, y, q, r] = st[1];
          return { text: `ƏBOB(${a}; ${b}) Evklid alqoritmi ilə tapılır. İkinci bölmədə alınan qalıq neçədir?`, answer: r, show: S(r), tol: 0.01,
            solution: `1-ci bölmə: ${a} = ${st[0][2]} · ${b} + ${st[0][3]}. 2-ci bölmədə bölünən ${x}, bölən ${y} (əvvəlki qalıq): ${x} = ${q} · ${y} + ${r}. Qalıq ${r}.` }; }
        return { text: `ƏBOB(${a}; ${b}) Evklid alqoritmi ilə tapılır. Cəmi neçə bölmə aparılır (qalığı 0 olan sonuncu bölmə də daxil)?`, answer: st.length, show: S(st.length), tol: 0.01,
          solution: `${steps}. Bölmələrin sayı: ${st.length} (ƏBOB = ${g}).` };
      } },
    { id: "hasil", ad: "ƏBOB · ƏKOB = a · b", izah: "a = d·x, b = d·y, burada d = ƏBOB və ƏBOB(x; y) = 1. Onda ƏKOB = d·x·y.",
      gen() {
        const kind = pick(["b", "ekob", "cut", "cem"]);
        if (kind === "b") {
          const g = rnd(2, 30), [x, y] = coprimePair(2, 20), A = g * pick([x, y]), B = g * x * y * g / A, L = g * x * y;
          return { text: `a = ${A}, ƏBOB(a; b) = ${g}, ƏKOB(a; b) = ${L}. b = ?`, answer: B, show: S(B), tol: 0.01,
            solution: `ƏBOB · ƏKOB = a · b → b = ${g} · ${L} : ${A} = ${g * L} : ${A} = ${B}.` };
        }
        if (kind === "ekob") {
          const g = rnd(2, 20), [x, y] = coprimePair(2, 15), P = g * g * x * y;
          return { text: `İki natural ədədin hasili ${P}, ƏBOB-u ${g}. Onların ƏKOB-u neçədir?`, answer: g * x * y, show: S(g * x * y), tol: 0.01,
            solution: `ƏBOB · ƏKOB = a · b → ƏKOB = ${P} : ${g} = ${g * x * y}.` };
        }
        if (kind === "cut") {
          let k, ps, m;
          do { k = rnd(1, 4); ps = PR.slice().sort(() => Math.random() - .5).slice(0, k).sort((p, q) => p - q); m = ps.reduce((s, p) => s * p ** rnd(1, 2), 1); } while (m > 5000);
          const g = rnd(1, 12), L = g * m, f = factor(m), ans = 2 ** (k - 1);
          return { text: `ƏBOB(a; b) = ${g}, ƏKOB(a; b) = ${L}. Belə neçə (a; b) natural ədəd cütü var (a < b)?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `a = ${g}x, b = ${g}y, ƏBOB(x; y) = 1, x · y = ${L} : ${g} = ${m} = ${fstr(f)}. Hər sadə vuruq (öz qüvvəti ilə) bütövlükdə ya x-ə, ya y-ə gedir: 2${sup(k)} = ${2 ** k} sıralı cüt, a < b olanlar yarısı — ${ans}.` };
        }
        const t = rnd(5, 30), g = rnd(2, 25), s = g * t, xs = [];
        for (let x = 1; 2 * x < t; x++) if (gcd(x, t) === 1) xs.push(x);
        return { text: `a + b = ${s}, ƏBOB(a; b) = ${g}. Belə neçə (a; b) natural ədəd cütü var (a < b)?`, answer: xs.length, show: S(xs.length), tol: 0.01,
          solution: `a = ${g}x, b = ${g}y, x + y = ${t}, ƏBOB(x; y) = 1 (bu, ƏBOB(x; ${t}) = 1 deməkdir), x < y. Uyğun x: ${xs.join(", ")} — cəmi ${xs.length}.` };
      } },
    { id: "ifade", ad: "İfadələrin ƏBOB-u", izah: "Evklid ifadələrlə də işləyir: ƏBOB(n + 3; 2n + 1) = ƏBOB(n + 3; 2n + 1 − 2(n + 3)) = ƏBOB(n + 3; 5).",
      gen() {
        const kind = pick(["max", "say", "iki", "kv"]);
        if (kind === "max") {
          let c, b, d, Dd;
          do { c = rnd(2, 5); b = rnd(1, 9); d = rnd(1, 40); Dd = Math.abs(d - c * b); } while (Dd < 2 || Dd > 40);
          let n0 = ((-b) % Dd + Dd) % Dd; if (n0 === 0) n0 = Dd;
          return { text: `n — natural ədəddir. ƏBOB(n + ${b}; ${c}n + ${d}) ən çox neçə ola bilər?`, answer: Dd, show: S(Dd), tol: 0.01,
            solution: `ƏBOB(n + ${b}; ${c}n + ${d}) = ƏBOB(n + ${b}; ${c}n + ${d} − ${c}(n + ${b})) = ƏBOB(n + ${b}; ${S(d - c * b)}) = ƏBOB(n + ${b}; ${Dd}) — ${Dd} ədədinin bölənidir. n = ${n0} olanda ${n0 + b} və ${c * n0 + d} hər ikisi ${Dd} ədədinə bölünür. Cavab: ${Dd}.` };
        }
        if (kind === "say") {
          const p = pick([3, 5, 7, 11, 13]), c = rnd(2, 5), b = rnd(1, 9);
          let d = c * b + pick([-1, 1]) * p; if (d <= 0) d = c * b + p;
          const N = pick([30, 50, 60, 100]), ns = [];
          for (let n = 1; n <= N; n++) if (gcd(n + b, c * n + d) > 1) ns.push(n);
          return { text: `(n + ${b})/(${c}n + ${d}) kəsri n-in 1-dən ${N} ədədinə qədər olan neçə natural qiymətində ixtisar olunandır?`, answer: ns.length, show: S(ns.length), tol: 0.01,
            solution: `ƏBOB(n + ${b}; ${c}n + ${d}) = ƏBOB(n + ${b}; ${c}n + ${d} − ${c}(n + ${b})) = ƏBOB(n + ${b}; ${p}). ${p} sadədir, deməli kəsr yalnız n + ${b} ədədi ${p} ədədinə bölünəndə ixtisar olunur: n = ${ns.slice(0, 3).join(", ")}, … (addım ${p}). Cəmi ${ns.length}.` };
        }
        if (kind === "iki") {
          let m, n, g;
          do { m = rnd(4, 24); n = rnd(4, 24); g = gcd(m, n); } while (m === n || g < 2 || g > 10);
          const ans = 2 ** g - 1;
          return { text: `ƏBOB(2${sup(m)} − 1; 2${sup(n)} − 1) = ?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `ƏBOB(2ᵐ − 1; 2ⁿ − 1) = 2ᵈ − 1, burada d = ƏBOB(m; n) (üstlərdə Evklid alqoritmi gedir). ƏBOB(${m}; ${n}) = ${g} → 2${sup(g)} − 1 = ${ans}.` };
        }
        const j = rnd(1, 6), k = rnd(1, 12), ans = j * j + k;
        return { text: `n — natural ədəddir. ƏBOB(n² + ${k}; n + ${j}) ən çox neçə ola bilər?`, answer: ans, show: S(ans), tol: 0.01,
          solution: `n² + ${k} − (n − ${j})(n + ${j}) = ${j * j} + ${k} = ${ans}, deməli ƏBOB = ƏBOB(n + ${j}; ${ans}). n = ${ans - j} olanda n + ${j} = ${ans}, n² + ${k} də ${ans} ədədinə bölünür. Cavab: ${ans}.` };
      } },
    { id: "bezu", ad: "Bezu: ax + by = ƏBOB", izah: "Evklid addımlarını geriyə aç: ƏBOB-u a və b ilə ifadə et. x bir həldən digərinə b/ƏBOB qədər dəyişir.",
      gen() {
        let a, b, g;
        do { a = rnd(11, 99); b = rnd(11, 99); g = gcd(a, b); } while (a === b || g > 9 || b / g < 3);
        let x = 1; while ((g - a * x) % b !== 0) x++;
        const y = (g - a * x) / b, askY = Math.random() < .5;
        const base = `${a}x + ${b}y = ${g}`;
        const sol = `ƏBOB(${a}; ${b}) = ${g}. Evklidi geriyə açanda və ya x = 1, 2, 3, … yoxlayanda ${a}x − ${g} ifadəsinin ${b} ədədinə bölündüyü ilk x = ${x} alınır. Onda y = (${g} − ${a} · ${x}) : ${b} = ${S(y)}. Yoxla: ${a} · ${x} + ${b} · (${S(y)}) = ${g}.`;
        return askY
          ? { text: `${base} tənliyinin tam həllərindən x-i ən kiçik natural ədəd olanı götürülüb. Bu həldə y = ?`, answer: y, show: S(y), tol: 0.01, solution: sol }
          : { text: `${base} tənliyinin tam həlləri arasında x-in ən kiçik natural qiyməti neçədir?`, answer: x, show: S(x), tol: 0.01, solution: sol };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Dama kağızı, dişli çarxlar, kvadratlara kəsmə — hamısının arxasında ƏBOB və ya ƏKOB dayanır.",
      gen() {
        const kind = pick(["diaq", "carx", "kvadrat"]);
        if (kind === "diaq") {
          let m, n; do { m = rnd(4, 40); n = rnd(4, 40); } while (m === n || gcd(m, n) < 2 && Math.random() < .6);
          const g = gcd(m, n), ans = m + n - g;
          return { text: `Dama kağızında ${m} × ${n} xanalı düzbucaqlı çəkilib. Onun diaqonalı neçə xananın daxilindən keçir?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Diaqonal ${m - 1} + ${n - 1} daxili xətti kəsir, hər kəsişmədə yeni xanaya keçir; ${g > 1 ? `amma ${g - 1} dəfə düyündən keçir (iki xətti birdən kəsir)` : "düyündən heç vaxt keçmir, çünki ƏBOB = 1"}. Xanalar: ${m} + ${n} − ƏBOB(${m}; ${n}) = ${m} + ${n} − ${g} = ${ans}.` };
        }
        if (kind === "carx") {
          let a, b; do { a = rnd(12, 60); b = rnd(12, 60); } while (a === b || gcd(a, b) < 2);
          const g = gcd(a, b), L = a * b / g, ans = L / a;
          return { text: `İki dişli çarx bir-birinə keçib: birində ${a} diş, digərində ${b} diş var. Başlanğıcda işarələnmiş iki diş toxunur. Birinci çarx ən azı neçə tam dövr etməlidir ki, həmin iki diş yenidən toxunsun?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Keçən dişlərin sayı hər iki çarxın diş sayına bölünməlidir: ƏKOB(${a}; ${b}) = ${a} · ${b} : ${g} = ${L}. Birinci çarx ${L} : ${a} = ${ans} dövr edir.` };
        }
        let a, b, st; do { a = rnd(10, 90); b = rnd(5, 60); st = euclid(Math.max(a, b), Math.min(a, b)); } while (a === b || st.length < 2);
        const sum = st.reduce((s, x) => s + x[2], 0);
        return { text: `${a} × ${b} sm ölçülü kağızdan hər dəfə mümkün olan ən böyük kvadrat kəsilir, qalan düzbucaqlıdan da eyni qayda ilə — ta ki qalan hissə özü kvadrat olsun. Cəmi neçə kvadrat alınar?`, answer: sum, show: S(sum), tol: 0.01,
          solution: `Bu, Evklid alqoritmidir: ${stepTxt(st)}. Hər bölmədə qismət qədər kvadrat kəsilir: ${st.map(x => x[2]).join(" + ")} = ${sum}. (Ən kiçik kvadratın tərəfi ƏBOB = ${st[st.length - 1][1]} sm.)` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Evklid alqoritmi üç addımda yazılıb, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const g = rnd(2, 15), q3 = rnd(2, 5), r1 = q3 * g, q2 = rnd(1, 4), b = q2 * r1 + g, q1 = rnd(2, 5), a = q1 * b + r1;
        const steps = [`${a} = ${q1} · ${b} + ${r1}`, `${b} = ${q2} · ${r1} + ${g}`, `${r1} = ${q3} · ${g} + 0 → ƏBOB = ${g}`];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `${a} = ${q1 - 1} · ${b} + ${r1 + b}`;
        if (bad === 1) steps[1] = `${a} = ${Math.floor(a / r1)} · ${r1} + ${a % r1}`;
        if (bad === 2) steps[2] = `${r1} = ${q3} · ${g} + 0 → ƏBOB = ${q3 !== g && Math.random() < .5 ? q3 : r1}`;
        const text = h("div", {}, h("p", {}, `ƏBOB(${a}; ${b}) Evklid alqoritmi ilə tapılır:`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: qalıq ${r1 + b} böləndən (${b}) böyükdür — qismət ${q1} olmalıdır: ${a} = ${q1} · ${b} + ${r1}.`,
          `2-ci addım: indi bölünən ${b} olmalıdır (əvvəlki bölən), ${a} yox: ${b} = ${q2} · ${r1} + ${g}.`,
          `3-cü addım: ƏBOB son sıfırdan fərqli qalıqdır, yəni ${g}.`][bad];
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
      key: "ol-ebob-evklid", title: "ƏBOB/ƏKOB, Evklid alqoritmi", fenn: "olimpiada", link: "dersler/ol-ebob-evklid.html",
      format: "Cavab ədəddir: tam 21, mənfi −10. Cütlərin sayı soruşulursa — sadəcə say.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["evklid", "evklid", "hasil", "hasil", "ifade", "ifade", "bezu", "bezu", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-ebob-evklid.html")) b.push("dersler/ol-ebob-evklid.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
