// Sayma prinsipləri (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
// Counting answers are computed by formula AND by brute force where cheap; a mismatch throws (the self-test catches it).
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const lcm = (a, b) => a / gcd(a, b) * b;
  const fl = Math.floor;
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", sup = n => String(n).split("").map(d => SUP[+d]).join("");
  const C = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = r * (n - k + i) / i; return Math.round(r); };
  const P = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r *= n - i; return r; };        // n·(n−1)·…, k factors
  const chain = (n, k) => k ? Array.from({ length: k }, (_, i) => n - i).join("·") : "1";
  const check = (a, b, what) => { if (a !== b) throw new Error(`formula ${a} ≠ brute ${b} (${what})`); return a; };
  const count = (k, ok) => { let c = 0; for (let x = 10 ** (k - 1); x < 10 ** k; x++) if (ok(String(x))) c++; return c; };
  const distinct = s => new Set(s).size === s.length;
  const WORD = { 2: "iki", 3: "üç", 4: "dörd", 5: "beş", 6: "altı", 7: "yeddi" };

  // grid picture: A bottom-left, B top-right, optional point M
  function grid(m, n, M) {
    const s = Math.min(36, 220 / Math.max(m, n)), W = m * s + 50, H = n * s + 44, ox = 25, oy = 18;
    const g = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "oy-svg", role: "img", "aria-label": `${m}×${n} tor` });
    for (let i = 0; i <= m; i++) g.append(sv("line", { x1: ox + i * s, y1: oy, x2: ox + i * s, y2: oy + n * s, stroke: "#17171a", "stroke-width": 1.2 }));
    for (let j = 0; j <= n; j++) g.append(sv("line", { x1: ox, y1: oy + j * s, x2: ox + m * s, y2: oy + j * s, stroke: "#17171a", "stroke-width": 1.2 }));
    const dot = (x, y, lbl, col) => { g.append(sv("circle", { cx: ox + x * s, cy: oy + (n - y) * s, r: 5, fill: col })); g.append(sv("text", { x: ox + x * s + (x === m ? 9 : -9), y: oy + (n - y) * s + (y === 0 ? 16 : -6), "text-anchor": "middle", class: "oy-lbl" }, lbl)); };
    dot(0, 0, "A", "#17171a"); dot(m, n, "B", "#17171a"); if (M) dot(M[0], M[1], "M", "#a32d2d");
    return g;
  }

  const levels = [
    { id: "hasil", ad: "Cəm və hasil qaydası", izah: "Ardıcıl seçimlər (\"və\") — vurulur. Bir-birini istisna edən hallar (\"və ya\") — toplanır.",
      gen() {
        const kind = pick(["dist", "set", "div", "outfit"]);
        if (kind === "dist") {
          const k = rnd(2, 5), rep = Math.random() < .3;
          const f = rep ? 9 * 10 ** (k - 1) : 9 * P(9, k - 1);
          const ans = k <= 4 ? check(f, count(k, s => rep || distinct(s)), "dist") : f;
          return { text: `Neçə ${WORD[k]}rəqəmli natural ədəd var ki, ${rep ? "rəqəmləri istənilən ola bilər (təkrar olar)" : "bütün rəqəmləri müxtəlifdir"}?`, answer: ans, show: String(ans), tol: 0.01,
            solution: rep ? `Birinci rəqəm 0 ola bilməz: 9 seçim; qalan ${k - 1} yerin hər birinə 10 seçim. 9·10${sup(k - 1)} = ${ans}.`
              : `Birinci rəqəm: 9 seçim (0 olmaz). İkinci: 9 (0 artıq olar, amma birincini təkrarlamaq olmaz)` + (k > 2 ? `, sonra ${chain(8, k - 2)}` : "") + `. Hasil qaydası: 9·${chain(9, k - 1)} = ${ans}.` };
        }
        if (kind === "set") {
          let D; do { D = [...new Set(Array.from({ length: rnd(4, 6) }, () => rnd(0, 9)))].sort((a, b) => a - b); } while (D.length < 4);
          const k = rnd(2, 3), rep = Math.random() < .4, even = Math.random() < .5 && D.some(d => d % 2 === 0);
          const z = D.includes(0), dE = D.filter(d => d % 2 === 0), n = D.length;
          const brute = count(k, s => [...s].every(c => D.includes(+c)) && (rep || distinct(s)) && (!even || +s[k - 1] % 2 === 0));
          let f, why;
          if (!even) {
            f = rep ? (n - (z ? 1 : 0)) * n ** (k - 1) : (n - (z ? 1 : 0)) * P(n - 1, k - 1);
            why = `Birinci rəqəm: ${n - (z ? 1 : 0)} seçim${z ? " (0 olmaz)" : ""}; ` + (rep ? `qalan ${k - 1} yerin hər birinə ${n} seçim` : `sonra ${chain(n - 1, k - 1)} (təkrar olmaz)`) + `. Hasil: ${f}.`;
          } else if (rep) {
            f = dE.length * (n - (z ? 1 : 0)) * n ** (k - 2);
            why = `Son rəqəm cüt: ${dE.length} seçim (${dE.join(", ") || "yoxdur"}); birinci: ${n - (z ? 1 : 0)}${z ? " (0 olmaz)" : ""}` + (k > 2 ? `; ortadakı: ${n}` : "") + `. Hasil: ${f}.`;
          } else {
            // last digit first; then the first digit (non-zero, not the last); then the middle
            let s = 0; const parts = [];
            for (const L of dE) { const first = n - 1 - (z && L !== 0 ? 1 : 0); const t = first * P(n - 2, k - 2); s += t; parts.push(`son ${L}: ${first}${k > 2 ? "·" + chain(n - 2, k - 2) : ""} = ${t}`); }
            f = s; why = `Əvvəl son rəqəmi seçirik (cüt), sonra birincini (0 olmaz və sonuncunu təkrarlamaz)${k > 2 ? ", sonra ortanı" : ""}. ${parts.join("; ") || "cüt rəqəm yoxdur"}. Cəm: ${f}.`;
          }
          const ans = check(f, brute, "set");
          return { text: `${D.join(", ")} rəqəmlərindən ${rep ? "(rəqəmlər təkrarlana bilər)" : "(hər rəqəm ən çoxu bir dəfə)"} neçə ${WORD[k]}rəqəmli ${even ? "cüt " : ""}ədəd düzəltmək olar?`, answer: ans, show: String(ans), tol: 0.01, solution: why };
        }
        if (kind === "div") {
          let f; do { const ps = [2, 3, 5, 7, 11].sort(() => Math.random() - .5).slice(0, rnd(2, 3)); f = ps.map(p => [p, rnd(1, p < 5 ? 4 : 2)]).sort((a, b) => a[0] - b[0]); } while (f.reduce((s, [p, e]) => s * p ** e, 1) > 5000);
          const n = f.reduce((s, [p, e]) => s * p ** e, 1); let br = 0; for (let d = 1; d <= n; d++) if (n % d === 0) br++;
          const ans = check(f.reduce((s, [, e]) => s * (e + 1), 1), br, "div");
          return { text: `${n} ədədinin neçə natural böləni var?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${n} = ${f.map(([p, e]) => e > 1 ? p + sup(e) : p).join(" · ")}. Bölən = ${f.map(([p], i) => p + "ᵃᵇᶜ"[i]).join(" · ")} şəklindədir, hər üst üçün seçim sayı: ${f.map(([p, e]) => `${p} üçün 0…${e} → ${e + 1}`).join(", ")}. Hasil: ${f.map(([, e]) => e + 1).join("·")} = ${ans}.` };
        }
        const a = rnd(2, 6), b = rnd(2, 5), c = rnd(1, 5), d = rnd(2, 4), ans = (a * b + c) * d;
        return { text: `Fikrətin ${a} köynəyi, ${b} şalvarı, ${c} idman kostyumu və ${d} cüt ayaqqabısı var. O, ya köynək + şalvar, ya da idman kostyumu geyinir, üstəlik bir cüt ayaqqabı seçir. Neçə müxtəlif geyim dəsti mümkündür?`,
          answer: ans, show: String(ans), tol: 0.01,
          solution: `Köynək + şalvar: ${a}·${b} = ${a * b} (hasil qaydası). Ya da kostyum: ${c}. Bu hallar birlikdə olmur → cəm: ${a * b} + ${c} = ${a * b + c}. Ayaqqabı ilə: ${a * b + c}·${d} = ${ans}.` };
      } },
    { id: "tamam", ad: "Tamamlayıcı sayma", izah: "\"Ən azı bir\" — çətindir. Hamısını say, \"heç biri\"ni çıx.",
      gen() {
        const kind = pick(["digit", "digit", "even", "pass", "rep"]);
        if (kind === "digit") {
          const k = rnd(3, 4), d = rnd(0, 9), tot = 9 * 10 ** (k - 1), none = d === 0 ? 9 ** k : 8 * 9 ** (k - 1);
          const ans = check(tot - none, count(k, s => s.includes(String(d))), "digit");
          return { text: `Neçə ${WORD[k]}rəqəmli ədədin yazılışında ən azı bir ${d} rəqəmi var?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Hamısı: 9·10${sup(k - 1)} = ${tot}. Heç bir ${d} olmayanlar: ` + (d === 0 ? `hər yerə 9 seçim (1…9): 9${sup(k)} = ${none}` : `birinci rəqəm 8 seçim (0 və ${d} olmaz), qalanlar 9 seçim: 8·9${sup(k - 1)} = ${none}`) + `. Cavab: ${tot} − ${none} = ${ans}.` };
        }
        if (kind === "even") {
          const k = rnd(3, 5), tot = 9 * 10 ** (k - 1), none = 5 ** k;
          const ans = k <= 4 ? check(tot - none, count(k, s => [...s].some(c => +c % 2 === 0)), "even") : tot - none;
          return { text: `Neçə ${WORD[k]}rəqəmli ədədin ən azı bir cüt rəqəmi var?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Hamısı: ${tot}. Cüt rəqəmi olmayanlar — bütün rəqəmləri tək (1, 3, 5, 7, 9): 5${sup(k)} = ${none}. Cavab: ${tot} − ${none} = ${ans}.` };
        }
        if (kind === "rep") {
          const k = rnd(3, 4), tot = 9 * 10 ** (k - 1), dis = 9 * P(9, k - 1);
          const ans = check(tot - dis, count(k, s => !distinct(s)), "rep");
          return { text: `Neçə ${WORD[k]}rəqəmli ədəddə ən azı iki rəqəm eynidir?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Hamısı: ${tot}. Bütün rəqəmləri müxtəlif olanlar: 9·${chain(9, k - 1)} = ${dis}. Cavab: ${tot} − ${dis} = ${ans}.` };
        }
        const L = rnd(2, 4), A = pick([5, 6, 8, 10]), D = pick([3, 4, 5]), ans = (A + D) ** L - A ** L;
        return { text: `Parol ${L} simvoldan ibarətdir. Hər simvol ${A} hərfdən və ya ${D} rəqəmdən biridir (təkrar olar). Parolda ən azı bir rəqəm olmalıdır. Neçə belə parol var?`,
          answer: ans, show: String(ans), tol: 0.01,
          solution: `Hamısı: ${A + D}${sup(L)} = ${(A + D) ** L}. Rəqəmsiz (yalnız hərf): ${A}${sup(L)} = ${A ** L}. Cavab: ${(A + D) ** L} − ${A ** L} = ${ans}.` };
      } },
    { id: "daxil", ad: "Daxiletmə-xaricetmə", izah: "|A ∪ B| = |A| + |B| − |A ∩ B|. Üç çoxluqda: təkləri topla, cütləri çıx, üçlünü əlavə et. a və b-yə bölünənlər — ƏKOB(a, b)-yə bölünənlərdir.",
      gen() {
        const N = rnd(10, 200) * 10 + rnd(0, 9);
        const kind = pick(["or2", "or3", "none3", "only"]);
        const brute = test => { let c = 0; for (let x = 1; x <= N; x++) if (test(x)) c++; return c; };
        if (kind === "or2" || kind === "only") {
          let a, b; do { a = rnd(2, 12); b = rnd(2, 15); } while (a >= b || b % a === 0);
          const l = lcm(a, b), A = fl(N / a), B = fl(N / b), AB = fl(N / l);
          if (kind === "or2") { const ans = check(A + B - AB, brute(x => x % a === 0 || x % b === 0), "or2");
            return { text: `1-dən ${N} ədədinə qədər neçə natural ədəd ${a} ədədinə və ya ${b} ədədinə bölünür?`, answer: ans, show: String(ans), tol: 0.01,
              solution: `${a} ədədinə bölünənlər: [${N}/${a}] = ${A}. ${b} ədədinə: [${N}/${b}] = ${B}. Hər ikisinə — ƏKOB(${a}, ${b}) = ${l} ədədinə: [${N}/${l}] = ${AB}. Cavab: ${A} + ${B} − ${AB} = ${ans}.` }; }
          const ans = check(A - AB, brute(x => x % a === 0 && x % b !== 0), "only");
          return { text: `1-dən ${N} ədədinə qədər neçə natural ədəd ${a} ədədinə bölünür, amma ${b} ədədinə bölünmür?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${a} ədədinə bölünənlər: [${N}/${a}] = ${A}. Onlardan ${b} ədədinə də bölünənlər ƏKOB(${a}, ${b}) = ${l} ədədinə bölünənlərdir: [${N}/${l}] = ${AB}. Cavab: ${A} − ${AB} = ${ans}.` };
        }
        const [a, b, c] = pick([[2, 3, 5], [2, 3, 7], [2, 5, 7], [3, 5, 7], [2, 3, 11], [3, 4, 5], [2, 5, 9], [4, 5, 7]]);
        const s1 = [a, b, c].map(x => fl(N / x)), s2 = [a * b, a * c, b * c].map(x => fl(N / x)), s3 = fl(N / (a * b * c));
        const U = s1[0] + s1[1] + s1[2] - s2[0] - s2[1] - s2[2] + s3;
        const sol = `Təklər: [${N}/${a}] + [${N}/${b}] + [${N}/${c}] = ${s1.join(" + ")}. Cütlər: [${N}/${a * b}] + [${N}/${a * c}] + [${N}/${b * c}] = ${s2.join(" + ")}. Üçlü: [${N}/${a * b * c}] = ${s3}. ` +
          `Birləşmə: ${s1.reduce((x, y) => x + y)} − ${s2.reduce((x, y) => x + y)} + ${s3} = ${U}.`;
        if (kind === "or3") { const ans = check(U, brute(x => x % a === 0 || x % b === 0 || x % c === 0), "or3");
          return { text: `1-dən ${N} ədədinə qədər neçə natural ədəd ${a}, ${b} və ya ${c} ədədlərindən ən azı birinə bölünür?`, answer: ans, show: String(ans), tol: 0.01, solution: sol + ` Cavab: ${ans}.` }; }
        const ans = check(N - U, brute(x => x % a && x % b && x % c), "none3");
        return { text: `1-dən ${N} ədədinə qədər neçə natural ədəd ${a}, ${b}, ${c} ədədlərinin heç birinə bölünmür?`, answer: ans, show: String(ans), tol: 0.01, solution: sol + ` Heç birinə bölünməyənlər: ${N} − ${U} = ${ans}.` };
      } },
    { id: "reqem", ad: "Şərtli ədədlər", izah: "Ən çətin şərtli yerdən başla (çox vaxt son rəqəm), sonra birinci rəqəm (0 olmaz), sonra qalanlar. Şərt hallara bölünürsə — halları topla.",
      gen() {
        const kind = pick(["evenD", "fiveD", "oddD", "allOdd", "pal", "sum"]);
        const k = kind === "pal" ? rnd(3, 7) : kind === "sum" ? 3 : kind === "allOdd" ? rnd(3, 5) : rnd(3, 4);
        if (kind === "evenD") {
          const z = P(9, k - 1), o = 4 * 8 * P(8, k - 2), ans = check(z + o, count(k, s => distinct(s) && +s[k - 1] % 2 === 0), "evenD");
          return { text: `Rəqəmləri müxtəlif olan neçə ${WORD[k]}rəqəmli cüt ədəd var?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Hal 1: son rəqəm 0. Qalan yerlər: ${chain(9, k - 1)} = ${z}. Hal 2: son rəqəm 2, 4, 6 və ya 8 (4 seçim), birinci rəqəm 0 və sonuncu ola bilməz (8 seçim), ortalar: ${chain(8, k - 2)}. 4·8·${chain(8, k - 2)} = ${o}. Cəm: ${z} + ${o} = ${ans}.` };
        }
        if (kind === "fiveD") {
          const z = P(9, k - 1), o = 8 * P(8, k - 2), ans = check(z + o, count(k, s => distinct(s) && +s % 5 === 0), "fiveD");
          return { text: `Rəqəmləri müxtəlif olan neçə ${WORD[k]}rəqəmli ədəd 5-ə bölünür?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `5-ə bölünən ədəd 0 və ya 5 ilə bitir. Son 0: qalanlar ${chain(9, k - 1)} = ${z}. Son 5: birinci rəqəm 0 və 5 ola bilməz (8 seçim), ortalar ${chain(8, k - 2)}: 8·${chain(8, k - 2)} = ${o}. Cəm: ${ans}.` };
        }
        if (kind === "oddD") {
          const f = 5 * 8 * P(8, k - 2), ans = check(f, count(k, s => distinct(s) && +s[k - 1] % 2 === 1), "oddD");
          return { text: `Rəqəmləri müxtəlif olan neçə ${WORD[k]}rəqəmli tək ədəd var?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Son rəqəm tək: 5 seçim. Birinci: 0 və sonuncu olmaz → 8 seçim. Ortalar: ${chain(8, k - 2)}. 5·8·${chain(8, k - 2)} = ${ans}.` };
        }
        if (kind === "allOdd") {
          const even = Math.random() < .5, f = even ? 4 * 5 ** (k - 1) : 5 ** k;
          const ans = k <= 4 ? check(f, count(k, s => [...s].every(c => +c % 2 === (even ? 0 : 1))), "allOdd") : f;
          return { text: `Neçə ${WORD[k]}rəqəmli ədədin bütün rəqəmləri ${even ? "cütdür" : "təkdir"}?`, answer: ans, show: String(ans), tol: 0.01,
            solution: even ? `Cüt rəqəmlər: 0, 2, 4, 6, 8. Birinci rəqəm 0 olmaz → 4 seçim, qalanlar 5 seçim: 4·5${sup(k - 1)} = ${ans}.` : `Tək rəqəmlər: 1, 3, 5, 7, 9 — hər yerə 5 seçim: 5${sup(k)} = ${ans}.` };
        }
        if (kind === "pal") {
          const half = Math.ceil(k / 2), ans = 9 * 10 ** (half - 1);
          if (k <= 4) check(ans, count(k, s => s === [...s].reverse().join("")), "pal");
          return { text: `Palindrom — soldan və sağdan eyni oxunan ədəddir (məs. 12321). Neçə ${WORD[k]}rəqəmli palindrom var?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Palindromu ilk ${half} rəqəmi tam təyin edir (qalanlar güzgü kimi təkrarlanır). Birinci rəqəm: 9 seçim, sonrakı ${half - 1}: 10 seçim. 9·10${sup(half - 1)} = ${ans}.` };
        }
        const S = rnd(3, 25), per = []; let f = 0;
        for (let a = 1; a <= 9; a++) { const t = S - a, c = t < 0 || t > 18 ? 0 : t <= 9 ? t + 1 : 19 - t; if (c) per.push(`a=${a}: ${c}`); f += c; }
        const ans = check(f, count(3, s => +s[0] + +s[1] + +s[2] === S), "sum");
        return { text: `Rəqəmlərinin cəmi ${S} olan neçə üçrəqəmli ədəd var?`, answer: ans, show: String(ans), tol: 0.01,
          solution: `Ədəd abc, a + b + c = ${S}. Hər a üçün b + c = ${S} − a cütlərini sayırıq (b + c = t: t ≤ 9 olanda t + 1 cüt, t ≥ 10 olanda 19 − t cüt). ${per.join(", ")}. Cəm: ${ans}.` };
      } },
    { id: "yol", ad: "Torda yollar", izah: "Yalnız sağa və yuxarı: m sağ + n yuxarı addım. Yolların sayı C(m + n, m). M nöqtəsindən keçən: (A→M)·(M→B). Keçməyən: hamısı − keçənlər.",
      gen() {
        const m = rnd(2, 6), n = rnd(2, 5), kind = pick(["all", "via", "avoid"]), tot = C(m + n, m);
        // DP check
        const dp = (bx, by, block) => { const t = []; for (let x = 0; x <= m; x++) { t.push([]); for (let y = 0; y <= n; y++) t[x].push(block && x === block[0] && y === block[1] ? 0 : x === 0 && y === 0 ? 1 : (x ? t[x - 1][y] : 0) + (y ? t[x][y - 1] : 0)); } return t[bx][by]; };
        if (kind === "all") { const ans = check(tot, dp(m, n), "all");
          return { text: `Şəkildə ${m}×${n} tor var. A nöqtəsindən B nöqtəsinə tor xətləri ilə, hər addımda yalnız sağa və ya yuxarı gedərək neçə müxtəlif yolla getmək olar?`, svg: grid(m, n), answer: ans, show: String(ans), tol: 0.01,
            solution: `Hər yol — ${m} "sağ" və ${n} "yuxarı" addımdan ibarət ${m + n} addımlıq sözdür. "Sağ"ların yerini seçmək kifayətdir: C(${m + n}, ${m}) = ${ans}.` }; }
        let x, y; do { x = rnd(0, m); y = rnd(0, n); } while ((x === 0 && y === 0) || (x === m && y === n));
        const via = C(x + y, x) * C(m - x + n - y, m - x);
        check(via, dp(m, n) - dp(m, n, [x, y]), "via");
        const sol = `A→M: C(${x + y}, ${x}) = ${C(x + y, x)}, M→B: C(${m - x + n - y}, ${m - x}) = ${C(m - x + n - y, m - x)}. M-dən keçənlər: ${C(x + y, x)}·${C(m - x + n - y, m - x)} = ${via}.`;
        if (kind === "via") return { text: `A nöqtəsindən B nöqtəsinə tor xətləri ilə yalnız sağa və yuxarı gedilir (${m}×${n} tor). Neçə yol M nöqtəsindən keçir? (M — A-dan ${x} sağa, ${y} yuxarı)`, svg: grid(m, n, [x, y]), answer: via, show: String(via), tol: 0.01, solution: sol };
        const ans = tot - via;
        return { text: `A nöqtəsindən B nöqtəsinə tor xətləri ilə yalnız sağa və yuxarı gedilir (${m}×${n} tor). M nöqtəsində çala var — oradan keçmək olmaz. Neçə yol qalır? (M — A-dan ${x} sağa, ${y} yuxarı)`, svg: grid(m, n, [x, y]), answer: ans, show: String(ans), tol: 0.01,
          solution: `Hamısı: C(${m + n}, ${m}) = ${tot}. ${sol} Cavab: ${tot} − ${via} = ${ans}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Sorğu məsələləri — Eyler-Venn diaqramı: hər hissəni ayrıca say, ya da daxiletmə-xaricetmə düsturunu işlət.",
      gen() {
        const kind = pick(["two", "two", "three", "plate"]);
        if (kind === "two") {
          const both = rnd(2, 12), oA = rnd(3, 15), oB = rnd(3, 15), none = rnd(0, 8), T = both + oA + oB + none, A = oA + both, B = oB + both;
          const [sa, sb] = pick([["futbol", "şahmat"], ["ingilis dili", "rus dili"], ["üzgüçülük", "tennis"], ["rəsm", "musiqi"]]);
          if (Math.random() < .5) return { text: `Sinifdə ${T} şagird var. ${A} nəfər ${sa}, ${B} nəfər ${sb} ilə məşğul olur, ${both} nəfər hər ikisi ilə. Neçə şagird bunların heç biri ilə məşğul olmur?`,
            answer: none, show: String(none), tol: 0.01, solution: `Ən azı biri ilə: ${A} + ${B} − ${both} = ${A + B - both}. Heç biri ilə: ${T} − ${A + B - both} = ${none}.` };
          return { text: `Sinifdə ${T} şagird var. ${A} nəfər ${sa}, ${B} nəfər ${sb} ilə məşğul olur, ${none} nəfər heç biri ilə. Neçə şagird hər ikisi ilə məşğul olur?`,
            answer: both, show: String(both), tol: 0.01, solution: `Ən azı biri ilə: ${T} − ${none} = ${T - none}. |A ∪ B| = |A| + |B| − |A ∩ B| → ${T - none} = ${A} + ${B} − x → x = ${A + B - (T - none)}.` };
        }
        if (kind === "three") {
          const r = Array.from({ length: 7 }, () => rnd(1, 9)), none = rnd(0, 6); // regions: a, b, c, ab, ac, bc, abc (only)
          const A = r[0] + r[3] + r[4] + r[6], B = r[1] + r[3] + r[5] + r[6], Cc = r[2] + r[4] + r[5] + r[6];
          const AB = r[3] + r[6], AC = r[4] + r[6], BC = r[5] + r[6], ABC = r[6], U = A + B + Cc - AB - AC - BC + ABC, T = U + none;
          check(U, r.reduce((s, x) => s + x, 0), "venn");
          return { text: `Sorğuda ${T} nəfər iştirak etdi. ${A} nəfər çay, ${B} nəfər qəhvə, ${Cc} nəfər kakao sevir. Çay və qəhvəni ${AB}, çay və kakaonu ${AC}, qəhvə və kakaonu ${BC} nəfər sevir; üçünü də ${ABC} nəfər. Neçə nəfər bu içkilərin heç birini sevmir?`,
            answer: none, show: String(none), tol: 0.01,
            solution: `Ən azı birini sevənlər: ${A} + ${B} + ${Cc} − ${AB} − ${AC} − ${BC} + ${ABC} = ${U}. Heç birini: ${T} − ${U} = ${none}.` };
        }
        const L = rnd(1, 3), D = rnd(2, 4), A = pick([20, 24, 26]), ans = A ** L * 10 ** D;
        return { text: `Velosiped nömrəsi ${L} hərf və ondan sonra ${D} rəqəmdən ibarətdir. Hərflər ${A} hərfdən seçilir, rəqəmlər 0–9 (təkrar olar, rəqəm hissəsi 0 ilə başlaya bilər). Neçə müxtəlif nömrə mümkündür?`,
          answer: ans, show: String(ans), tol: 0.01, solution: `Hasil qaydası: ${A}${sup(L)} · 10${sup(D)} = ${A ** L} · ${10 ** D} = ${ans}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "a və ya b-yə bölünənlər: [N/a] + [N/b] − [N/ƏKOB(a, b)]. Diqqət: ƏKOB, a·b yox!",
      gen() {
        const [a, b] = pick([[4, 6], [6, 9], [6, 10], [4, 10], [10, 15], [6, 15], [8, 12], [9, 12], [6, 8], [12, 18]]);
        let N; do { N = rnd(100, 999); } while (N % a === 0);
        const l = lcm(a, b), A = fl(N / a), B = fl(N / b), AB = fl(N / l), ans = A + B - AB;
        const steps = [
          `${a} ədədinə bölünənlər: [${N}/${a}] = ${A}; ${b} ədədinə bölünənlər: [${N}/${b}] = ${B}.`,
          `Hər ikisinə bölünənlər — ${l} ədədinə bölünənlər: [${N}/${l}] = ${AB}.`,
          `Cavab: ${A} + ${B} − ${AB} = ${ans}.`,
        ];
        let bad = rnd(0, 2);
        if (bad === 1 && fl(N / (a * b)) === AB) bad = 0;
        if (bad === 0) steps[0] = `${a} ədədinə bölünənlər: [${N}/${a}] = ${A + 1}; ${b} ədədinə bölünənlər: [${N}/${b}] = ${B}.`;
        if (bad === 1) steps[1] = `Hər ikisinə bölünənlər — ${a * b} ədədinə bölünənlər: [${N}/${a * b}] = ${fl(N / (a * b))}.`;
        if (bad === 2) steps[2] = `Cavab: ${A} + ${B} + ${AB} = ${A + B + AB}.`;
        const text = h("div", {}, h("p", {}, `Sual: 1-dən ${N} ədədinə qədər neçə ədəd ${a} və ya ${b} ədədinə bölünür? Fikrətin həllində hansı addımda səhv var?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: ${a}·${A} = ${a * A} ≤ ${N}, ${a}·${A + 1} = ${a * (A + 1)} > ${N}. Düzü [${N}/${a}] = ${A} — tam hissə yuxarı yuvarlanmır.`,
          `2-ci addım: ${a} və ${b} ədədlərinin hər ikisinə bölünən ədəd ƏKOB(${a}, ${b}) = ${l} ədədinə bölünür, ${a * b} ədədinə yox. Düzü [${N}/${l}] = ${AB}, cavab ${ans}.`,
          `3-cü addım: hər ikisinə bölünənlər iki dəfə sayılıb — onları çıxmaq lazımdır: ${A} + ${B} − ${AB} = ${ans}.`][bad];
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
      key: "ol-sayma", title: "Sayma prinsipləri", fenn: "riyaziyyat", link: "dersler/ol-sayma.html",
      format: "Cavab natural ədəddir (neçə ədəd, neçə yol, neçə nəfər) və ya səhv addımın seçimi.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["hasil", "tamam", "daxil", "daxil", "reqem", "reqem", "yol", "yol", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-sayma.html")) b.push("dersler/ol-sayma.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
