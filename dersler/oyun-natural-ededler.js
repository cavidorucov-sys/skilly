// Natural ədədlər — bölünmə əlamətləri, qalıqlı bölmə, sadə vuruqlar, ƏBOB/ƏKOB. Mastery levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const lcm = (a, b) => a / gcd(a, b) * b;
  const isPrime = n => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
  // Azerbaijani case suffixes after a numeral, by the last spoken word (3-ə, 6-ya, 9-un, 40-dan, 7-ci)
  const W = n => { if (n === 0) return "sıfır"; if (n % 1000 === 0) return "min"; if (n % 100 === 0) return "yüz"; if (n % 10 === 0) return ["", "on", "iyirmi", "otuz", "qırx", "əlli", "altmış", "yetmiş", "səksən", "doxsan"][(n / 10) % 10]; return ["", "bir", "iki", "üç", "dörd", "beş", "altı", "yeddi", "səkkiz", "doqquz"][n % 10]; };
  const VW = "aıoueəiöü";
  const sfx = (n, kind) => { const w = W(Math.abs(n)), vs = [...w].filter(c => VW.includes(c)), v = vs[vs.length - 1], endV = VW.includes(w[w.length - 1]), back = "aıou".includes(v);
    const four = "aı".includes(v) ? "ı" : "ou".includes(v) ? "u" : "eəi".includes(v) ? "i" : "ü";
    return n + "-" + ({ a: (endV ? "y" : "") + (back ? "a" : "ə"), in: (endV ? "n" : "") + four + "n", i: (endV ? "n" : "") + four, dan: back ? "dan" : "dən", ci: "c" + four })[kind]; };
  const D = n => sfx(n, "a"), Gn = n => sfx(n, "in"), Ac = n => sfx(n, "i"), Ab = n => sfx(n, "dan"), Or = n => sfx(n, "ci");
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const sup = k => k === 1 ? "" : String(k).split("").map(c => SUP[+c]).join("");
  // n → [[p, k], ...] sorted by p
  const factor = n => { const f = []; for (let p = 2; p * p <= n; p++) { let k = 0; while (n % p === 0) { n /= p; k++; } if (k) f.push([p, k]); } if (n > 1) f.push([n, 1]); return f; };
  const fstr = f => f.map(([p, k]) => p + sup(k)).join(" · ");
  const list = a => a.join(", ");
  const eq = v => { const f = fstr(factor(v)); return f === String(v) ? String(v) : f + " = " + v; }; // "2³ · 3 = 24", or just "7"

  // divisibility rules for the "missing digit" level
  const RULES = {
    3: "3-ə bölünmə: rəqəmlərin cəmi 3-ə bölünməlidir",
    9: "9-a bölünmə: rəqəmlərin cəmi 9-a bölünməlidir",
    4: "4-ə bölünmə: son iki rəqəmdən düzələn ədəd 4-ə bölünməlidir",
    6: "6-ya bölünmə = 2-yə və 3-ə: son rəqəm cüt, rəqəmlərin cəmi 3-ə bölünür",
    12: "12-yə bölünmə = 3-ə və 4-ə: rəqəmlərin cəmi 3-ə, son iki rəqəm 4-ə bölünür",
    15: "15-ə bölünmə = 3-ə və 5-ə: son rəqəm 0 və ya 5, rəqəmlərin cəmi 3-ə bölünür",
    18: "18-ə bölünmə = 2-yə və 9-a: son rəqəm cüt, rəqəmlərin cəmi 9-a bölünür",
    45: "45-ə bölünmə = 5-ə və 9-a: son rəqəm 0 və ya 5, rəqəmlərin cəmi 9-a bölünür",
  };

  const PRIMES = [53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251];
  const TRICKY = [49, 51, 57, 87, 91, 93, 111, 117, 119, 121, 133, 143, 161, 169, 187, 203, 209, 217, 221, 247, 253, 259, 287, 289, 299, 301, 319, 323, 341, 361, 377, 391];
  const smallest = n => { for (let d = 2; d * d <= n; d++) if (n % d === 0) return d; return n; };
  const why = n => isPrime(n) ? `${n} sadədir (√${Ab(n)} kiçik heç bir sadə ədədə bölünmür)` : `${n} = ${smallest(n)} · ${n / smallest(n)}`;

  const levels = [
    { id: "elamet", ad: "Bölünmə əlamətləri", izah: "Ədəddə bir rəqəm a hərfi ilə gizlədilib (ədədin üstündə xətt). Əlamətlə tap: hansı rəqəmlər yazıla bilər?",
      gen() {
        for (;;) {
          const d = pick([3, 9, 4, 6, 12, 15, 18, 45]), len = rnd(3, 5);
          const digits = Array.from({ length: len }, (_, i) => i === 0 ? rnd(1, 9) : rnd(0, 9));
          const pos = rnd(0, len - 1);
          const ok = [];
          for (let x = pos === 0 ? 1 : 0; x <= 9; x++) { digits[pos] = x; if (+digits.join("") % d === 0) ok.push(x); }
          if (!ok.length || ok.length > 5) continue;
          const shown = digits.map((x, i) => i === pos ? "a" : x).join("");
          const known = digits.reduce((s, x, i) => i === pos ? s : s + x, 0);
          const usesSum = ![4].includes(d);
          const base = `${RULES[d]}.` + (usesSum ? ` Məlum rəqəmlərin cəmi ${known}.` : "") + ` Uyğun rəqəmlər: ${list(ok)}.` + (pos === 0 ? " (Birinci rəqəm 0 ola bilməz.)" : "");
          const kind = ok.length === 1 ? "one" : pick(["sum", "count", "max"]);
          if (kind === "one") return { text: h("span", {}, `${len}-rəqəmli `, h("span", { class: "ov" }, shown), ` ədədi ${D(d)} qalıqsız bölünür. a yerində hansı rəqəm durur?`), answer: ok[0], show: String(ok[0]), tol: 0.01, solution: base };
          if (kind === "sum") { const s = ok.reduce((a, b) => a + b, 0); return { text: h("span", {}, `${len}-rəqəmli `, h("span", { class: "ov" }, shown), ` ədədi ${D(d)} qalıqsız bölünür. a yerinə yazıla bilən bütün rəqəmlərin cəmini tap.`), answer: s, show: String(s), tol: 0.01, solution: base + ` Cəmi: ${s}.` }; }
          if (kind === "count") return { text: h("span", {}, `${len}-rəqəmli `, h("span", { class: "ov" }, shown), ` ədədi ${D(d)} qalıqsız bölünür. a yerinə neçə müxtəlif rəqəm yazmaq olar?`), answer: ok.length, show: String(ok.length), tol: 0.01, solution: base + ` Sayı: ${ok.length}.` };
          const m = Math.max(...ok);
          return { text: h("span", {}, `${len}-rəqəmli `, h("span", { class: "ov" }, shown), ` ədədi ${D(d)} qalıqsız bölünür. a yerinə yazıla bilən ən böyük rəqəm hansıdır?`), answer: m, show: String(m), tol: 0.01, solution: base + ` Ən böyüyü: ${m}.` };
        }
      } },
    { id: "qaliq", ad: "Qalıqlı bölmə", izah: "a = b · q + r, qalıq həmişə böləndən kiçikdir: 0 ≤ r < b.",
      gen() {
        const kind = pick(["find", "dividend", "linear", "nine", "maxr"]);
        if (kind === "find") {
          const b = rnd(6, 25), q = rnd(12, 80), r = rnd(1, b - 1), a = b * q + r;
          return { text: `${a} ədədini ${D(b)} böləndə qalıq neçə olar?`, answer: r, show: String(r), tol: 0.01,
            solution: `${b} · ${q} = ${b * q}, ${a} − ${b * q} = ${r}. Qalıq ${r} (${r} < ${b}).` };
        }
        if (kind === "dividend") {
          const b = rnd(5, 19), q = rnd(6, 40), r = rnd(1, b - 1), a = b * q + r;
          return { text: `Bir ədədi ${D(b)} böldükdə qismət ${q}, qalıq ${r} alındı. Bu ədədi tap.`, answer: a, show: String(a), tol: 0.01,
            solution: `a = b · q + r = ${b} · ${q} + ${r} = ${a}.` };
        }
        if (kind === "maxr") {
          const b = rnd(5, 16), q = rnd(4, 25), a = b * q + b - 1;
          return { text: `Natural ədədi ${D(b)} böldükdə qismət ${q} alındı. Qalıq mümkün olan ən böyük qiymət olarsa, bölünən neçədir?`, answer: a, show: String(a), tol: 0.01,
            solution: `Qalıq böləndən kiçikdir, ən böyük qalıq ${b - 1}. a = ${b} · ${q} + ${b - 1} = ${a}.` };
        }
        if (kind === "nine") {
          const len = rnd(7, 9); let s = String(rnd(1, 9)); while (s.length < len) s += rnd(0, 9);
          const ds = s.split("").reduce((x, c) => x + +c, 0), r = ds % 9;
          return { text: `${s} ədədini 9-a böləndə qalıq neçə olar?`, answer: r, show: String(r), tol: 0.01,
            solution: `9-a bölmədə qalıq rəqəmlər cəminin qalığına bərabərdir. Rəqəmlərin cəmi ${ds}, ${ds} = 9 · ${Math.floor(ds / 9)} + ${r}. Qalıq ${r}.` };
        }
        const d = rnd(5, 12), r = rnd(1, d - 1), k = rnd(2, 6), m = rnd(0, 9), ans = (k * r + m) % d;
        const expr = m ? `${k}n + ${m}` : `${k}n`;
        return { text: `n natural ədədini ${D(d)} böləndə qalıq ${r} alınır. ${expr} ədədini ${D(d)} böləndə qalıq neçə olar?`, answer: ans, show: String(ans), tol: 0.01,
          solution: `n = ${d}q + ${r} yaz. ${expr} = ${d}·(…) + ${k} · ${r}${m ? " + " + m : ""} = ${d}·(…) + ${k * r + m}. ${Ac(k * r + m)} ${D(d)} böləndə qalıq ${ans}.` };
      } },
    { id: "sade", ad: "Sadə, yoxsa mürəkkəb?", izah: "Tələ ədədlər: 51, 87, 91… Yoxlama: √n-ə qədər olan sadə ədədlərə böl.",
      gen() {
        const wantPrime = Math.random() < .6;
        let opts;
        if (wantPrime) opts = [pick(PRIMES), ...shuffle(TRICKY).slice(0, 3)];
        else opts = [pick(TRICKY), ...shuffle(PRIMES).slice(0, 3)];
        const ch = shuffle(opts), target = opts[0], correct = ch.indexOf(target);
        return { text: wantPrime ? "Bu ədədlərdən hansı sadədir?" : "Bu ədədlərdən hansı mürəkkəbdir?", choices: ch.map(String), correct, show: String(target),
          solution: ch.map(why).join("; ") + "." };
      } },
    { id: "vuruq", ad: "Sadə vuruqlar", izah: "Ədədi sadə vuruqlara ayır: bölənlərin sayı = (üst + 1)-lərin hasili.",
      gen() {
        let f, n;
        for (;;) {
          const ps = shuffle([2, 3, 5, 7, 11, 13]).slice(0, rnd(2, 3)).sort((a, b) => a - b);
          f = ps.map(p => [p, p <= 3 ? rnd(1, 4) : p <= 7 ? rnd(1, 2) : 1]);
          n = f.reduce((s, [p, k]) => s * p ** k, 1);
          if (n >= 40 && n <= 3000 && f.some(([, k]) => k > 1)) break;
        }
        const kind = pick(["count", "count", "sum", "max"]);
        const fs = `${n} = ${fstr(f)}.`;
        if (kind === "count") {
          const c = f.reduce((s, [, k]) => s * (k + 1), 1);
          return { text: `${n} ədədinin neçə natural böləni var?`, answer: c, show: String(c), tol: 0.01,
            solution: `${fs} Bölənlərin sayı = ${f.map(([, k]) => "(" + k + " + 1)").join(" · ")} = ${c}.` };
        }
        if (kind === "sum") {
          const s = f.reduce((a, [p]) => a + p, 0);
          return { text: `${n} ədədinin müxtəlif sadə bölənlərinin cəmini tap.`, answer: s, show: String(s), tol: 0.01,
            solution: `${fs} Müxtəlif sadə bölənlər: ${list(f.map(([p]) => p))}; cəmi ${s}.` };
        }
        const m = f[f.length - 1][0];
        return { text: `${n} ədədinin ən böyük sadə böləni neçədir?`, answer: m, show: String(m), tol: 0.01,
          solution: `${fs} Ən böyük sadə bölən ${m}.` };
      } },
    { id: "ebob", ad: "ƏBOB və ƏKOB", izah: "ƏBOB — ortaq vuruqlar kiçik üstlə; ƏKOB — bütün vuruqlar böyük üstlə. ƏBOB · ƏKOB = a · b.",
      gen() {
        let g, m, n;
        do { g = rnd(2, 18); m = rnd(2, 9); n = rnd(2, 9); } while (m === n || gcd(m, n) !== 1);
        const a = g * m, b = g * n, L = g * m * n;
        const fa = `${a} = ${fstr(factor(a))}, ${b} = ${fstr(factor(b))}.`;
        const kind = pick(["gcd", "lcm", "lcm", "back", "three"]);
        if (kind === "gcd") return { text: `ƏBOB(${a}; ${b}) = ?`, answer: g, show: String(g), tol: 0.01, solution: `${fa} Ortaq vuruqlar kiçik üstlə: ƏBOB = ${eq(g)}.` };
        if (kind === "lcm") return { text: `ƏKOB(${a}; ${b}) = ?`, answer: L, show: String(L), tol: 0.01, solution: `${fa} Bütün vuruqlar böyük üstlə: ƏKOB = ${eq(L)}. (Yoxla: ƏBOB · ƏKOB = ${g} · ${L} = ${a} · ${b}.)` };
        if (kind === "back") return { text: `a = ${a}, ƏBOB(a; b) = ${g}, ƏKOB(a; b) = ${L}. b = ?`, answer: b, show: String(b), tol: 0.01,
          solution: `a · b = ƏBOB · ƏKOB, ona görə b = ${g} · ${L} : ${a} = ${b}.` };
        // three numbers, lcm
        let x, y, z;
        do { [x, y, z] = shuffle([4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 24]).slice(0, 3); } while (lcm(lcm(x, y), z) > 600);
        const L3 = lcm(lcm(x, y), z);
        return { text: `ƏKOB(${x}; ${y}; ${z}) = ?`, answer: L3, show: String(L3), tol: 0.01,
          solution: `${x} = ${fstr(factor(x))}, ${y} = ${fstr(factor(y))}, ${z} = ${fstr(factor(z))}. Hər sadə vuruq ən böyük üstlə: ƏKOB = ${eq(L3)}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Əvvəl qərar ver: ƏBOB-mu, ƏKOB-mu? \"Ən çox, bərabər böl\" → ƏBOB; \"yenidən birlikdə, ən az\" → ƏKOB.",
      gen() {
        const kind = pick(["bus", "gift", "giftEach", "tile", "rows", "gear"]);
        if (kind === "bus") {
          let a, b; do { [a, b] = shuffle([6, 8, 9, 10, 12, 15, 18, 20, 24]).slice(0, 2); } while (gcd(a, b) === 1);
          const L = lcm(a, b);
          return { text: `Dayanacaqdan bir avtobus hər ${a} dəqiqədən bir, digəri hər ${b} dəqiqədən bir yola düşür. Saat 8:00-da ikisi birlikdə yola düşdü. Ən azı neçə dəqiqədən sonra yenə birlikdə yola düşəcəklər?`, answer: L, show: String(L), unit: "dəq", tol: 0.01,
            solution: `Vaxt həm ${D(a)}, həm ${D(b)} bölünməlidir və ən kiçik olmalıdır: ƏKOB(${a}; ${b}) = ${L} dəqiqə.` };
        }
        if (kind === "gift" || kind === "giftEach") {
          let g, m, n; do { g = rnd(4, 15); m = rnd(2, 9); n = rnd(2, 9); } while (m === n || gcd(m, n) !== 1);
          const x = g * m, y = g * n;
          if (kind === "gift") return { text: `${x} konfet və ${y} alma var. Hər hədiyyədə eyni sayda konfet və eyni sayda alma olmaqla, hamısını qalıqsız paylamaq üçün ən çox neçə hədiyyə düzəltmək olar?`, answer: g, show: String(g), tol: 0.01,
            solution: `Hədiyyələrin sayı həm ${Gn(x)}, həm ${Gn(y)} böləni olmalıdır və ən böyük olmalıdır: ƏBOB(${x}; ${y}) = ${g}.` };
          return { text: `${x} qələm və ${y} dəftər mümkün qədər çox eyni hədiyyəyə qalıqsız paylandı. Hər hədiyyədə neçə qələm var?`, answer: m, show: String(m), tol: 0.01,
            solution: `Hədiyyələrin sayı ƏBOB(${x}; ${y}) = ${g}. Hər hədiyyədə ${x} : ${g} = ${m} qələm (və ${n} dəftər).` };
        }
        if (kind === "tile") {
          let g, m, n; do { g = rnd(3, 12); m = rnd(2, 7); n = rnd(2, 7); } while (m === n || gcd(m, n) !== 1);
          const a = g * m, b = g * n;
          return { text: `Ölçüləri ${a} sm × ${b} sm olan düzbucaqlı kağızı qalıqsız olaraq mümkün qədər böyük, bərabər kvadratlara kəsirlər. Neçə kvadrat alınar?`, answer: m * n, show: String(m * n), tol: 0.01,
            solution: `Kvadratın tərəfi ƏBOB(${a}; ${b}) = ${g} sm. Uzununa ${a} : ${g} = ${m}, eninə ${b} : ${g} = ${n}; cəmi ${m} · ${n} = ${m * n} kvadrat.` };
        }
        if (kind === "gear") {
          let a, b; do { [a, b] = shuffle([12, 16, 18, 20, 24, 30, 36, 40, 45]).slice(0, 2); } while (gcd(a, b) === 1 || lcm(a, b) === Math.max(a, b));
          const big = Math.max(a, b), L = lcm(a, b), t = L / big;
          return { text: `İki dişli çarx bir-birinə keçir: birinin ${a}, digərinin ${b} dişi var. Hər iki çarxın yenidən başlanğıc vəziyyətə gəlməsi üçün böyük çarx ən azı neçə tam dövr etməlidir?`, answer: t, show: String(t), tol: 0.01,
            solution: `Keçən dişlərin sayı həm ${D(a)}, həm ${D(b)} bölünməlidir: ƏKOB(${a}; ${b}) = ${L}. Böyük çarx: ${L} : ${big} = ${t} dövr.` };
        }
        const SETS = [[4, 5, 6], [3, 4, 5], [6, 8], [4, 6, 9], [5, 6], [8, 12], [6, 9, 12], [4, 6, 10]];
        const s = pick(SETS), L = s.reduce(lcm), r = rnd(1, Math.min(...s) - 1), k = rnd(2, 6), ans = k * L + r;
        const lo = ans - rnd(1, L - 1), hi = ans + rnd(1, L - 1);
        return { text: `Şagirdləri ${s.slice(0, -1).map(x => x + "-" + x).join(", ")} və ya ${s[s.length - 1]}-${s[s.length - 1]} qruplara böləndə hər dəfə ${r} nəfər artıq qalır. Şagirdlərin sayı ${Ab(lo)} çox, ${Ab(hi)} azdır. Neçə şagird var?`, answer: ans, show: String(ans), tol: 0.01,
          solution: `Sayı − ${r} hamısına bölünür: ƏKOB(${s.join("; ")}) = ${L}. Uyğun ədədlər ${L}k + ${r}: aralıqda yalnız ${k} · ${L} + ${r} = ${ans}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "ƏBOB və ƏKOB üç addımda tapılıb, birində səhv var. Hansında?",
      gen() {
        let a, b, fa, fb;
        for (;;) {
          const x1 = rnd(1, 3), x2 = rnd(1, 3), y1 = rnd(0, 2), y2 = rnd(0, 2);
          if (x1 === x2 || (y1 === 0 && y2 === 0)) continue;
          a = 2 ** x1 * 3 ** y1 * pick([1, 5]); b = 2 ** x2 * 3 ** y2 * pick([1, 7]);
          if (a > 400 || b > 400 || a === b || a < 12 || b < 12) continue;
          fa = factor(a); fb = factor(b); break;
        }
        const G = gcd(a, b), L = lcm(a, b);
        // wrong gcd: common primes with the BIGGER exponent
        const ea = new Map(fa), eb = new Map(fb);
        const wrongG = [...ea.keys()].filter(p => eb.has(p)).reduce((s, p) => s * p ** Math.max(ea.get(p), eb.get(p)), 1);
        const steps = [
          `${a} = ${fstr(fa)}, ${b} = ${fstr(fb)}.`,
          `ƏBOB = ortaq vuruqlar ən kiçik üstlə = ${eq(G)}.`,
          `ƏKOB = bütün vuruqlar ən böyük üstlə = ${eq(L)}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) { const wf = fa.map(([p, k]) => p === 2 ? [p, k + 1] : [p, k]); steps[0] = `${a} = ${fstr(wf)}, ${b} = ${fstr(fb)}.`; }
        if (bad === 1) steps[1] = `ƏBOB = ortaq vuruqlar ən kiçik üstlə = ${eq(wrongG)}.`;
        if (bad === 2) steps[2] = `ƏKOB = ${a} · ${b} = ${a * b}.`;
        const text = h("div", {}, h("p", {}, `Məsələ: ƏBOB(${a}; ${b}) və ƏKOB(${a}; ${b}) tapılsın.`),
          h("ol", { class: "oy-steps" }, ...steps.map(s => h("li", {}, s))));
        const reason = [
          `1-ci addımda ayırma səhvdir: ${fstr(fa.map(([p, k]) => p === 2 ? [p, k + 1] : [p, k]))} = ${2 * a}, ${a} yox. Düzü: ${a} = ${fstr(fa)}.`,
          `2-ci addımda ƏBOB üçün böyük üstlər götürülüb. Kiçik üst lazımdır: ƏBOB = ${G}.`,
          `3-cü addımda ƏKOB a · b götürülüb — bu yalnız qarşılıqlı sadə ədədlərdə doğrudur. ƏBOB = ${G} ≠ 1, düzü ƏKOB = ${L}.`,
        ][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: reason };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "natural-ededler", title: "Natural ədədlər", fenn: "riyaziyyat", link: "dersler/natural-ededler.html",
      format: "Cavab — natural ədəd (məs. 12). Seçimli suallarda variantı seç.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["elamet", "elamet", "qaliq", "qaliq", "sade", "vuruq", "ebob", "ebob", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/natural-ededler.html")) b.push("dersler/natural-ededler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
