// Olimpiada · [x] və {x} funksiyaları — game levels.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const lcm = (a, b) => a / gcd(a, b) * b;
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);
  const R = (n, d = 1) => { if (d === 0) throw new Error("zero denominator"); if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; return [n / g, d / g]; };
  const rs = a => a[1] === 1 ? S(a[0]) : S(a[0]) + "/" + a[1];
  const rv = a => a[0] / a[1];
  const fl = (n, d) => Math.floor(n / d);                                  // floor of n/d (exact for small integers)
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const fin = (text, fr, solution, extra = {}) => Object.assign({ text, answer: rv(fr), show: rs(fr), tol: Number.isInteger(rv(fr)) ? 0.01 : Math.min(0.005, Math.abs(rv(fr)) * 0.01), solution }, extra);
  const distinct = (n, a, b) => { const out = []; while (out.length < n) { const v = rnd(a, b); if (!out.includes(v)) out.push(v); } return out; };
  const lead = (c, v) => c === 0 ? "" : (c < 0 ? "− " : "+ ") + (Math.abs(c) === 1 && v ? "" : Math.abs(c)) + (v || "");

  const levels = [
    { id: "tam-kesr", ad: "[x] və {x} hesabla", izah: "[x] — x-dən böyük olmayan ən böyük tam ədəd (mənfi ədədlərdə aşağı yuvarlaq!). {x} = x − [x], həmişə 0 ilə 1 arasında.",
      gen() {
        const kind = pick(["A", "A", "B", "B", "C", "D", "E"]);
        const q = rnd(2, 9); let p = rnd(1, 60); while (p % q === 0) p++; if (Math.random() < .5) p = -p;
        const x = R(p, q), xs = rs(x), f = fl(p, q), fr = R(p - q * f, q), mx = rs(R(-p, q)), fm = fl(-p, q);
        if (kind === "A") return fin(`[${xs}] = ?`, R(f), `${xs} ədədi ${S(f)} ilə ${S(f + 1)} arasındadır: ${S(f)} < ${xs} < ${S(f + 1)}. [x] bunlardan kiçik olandır: ${S(f)}.`);
        if (kind === "B") return fin(`{${xs}} = ?`, fr, `[${xs}] = ${S(f)}. {x} = x − [x] = ${xs} − ${P(f)} = ${rs(fr)}.`);
        if (kind === "C") return fin(`[${xs}] + [${mx}] = ?`, R(f + fm), `[${xs}] = ${S(f)}, [${mx}] = ${S(fm)}. Cəm: ${S(f + fm)}. (Tam olmayan x üçün [x] + [−x] = −1.)`);
        if (kind === "D") { const frm = R(-p - q * fm, q); return fin(`{${xs}} + {${mx}} = ?`, R(1), `{${xs}} = ${rs(fr)}, {${mx}} = ${rs(frm)}. Cəm: 1. (Tam olmayan x üçün {x} + {−x} = 1.)`); }
        return fin(`${q}·{${xs}} + [${xs}] = ?`, R(p - q * f + f), `{${xs}} = ${rs(fr)}, ona görə ${q}·${rs(fr)} = ${S(p - q * f)}. [${xs}] = ${S(f)}. Cəm: ${S(p - q * f + f)}.`);
      } },
    { id: "tenlik-1", ad: "[ ] işarəli tənliklər", izah: "[u] = n ⇔ n ≤ u < n + 1. Tam hissəni bərabərsizliyə çevir, sonra x-i tap.",
      gen() {
        const kind = pick(["A", "B", "C", "D", "E"]);
        if (kind === "A") {
          const a = rnd(2, 9), b = rnd(-6, 8);
          return fin(`[x/${a}] = ${S(b)} tənliyini ödəyən neçə tam x var?`, R(a),
            `${S(b)} ≤ x/${a} < ${S(b + 1)} → ${S(a * b)} ≤ x < ${S(a * b + a)}. Tam x: ${S(a * b)}, …, ${S(a * b + a - 1)} — cəmi ${a}.`);
        }
        if (kind === "B") {
          const q = rnd(2, 7), p = rnd(-9, 9), m = rnd(-5, 8), big = Math.random() < .5, lo = q * m - p, ans = big ? lo + q - 1 : lo;
          return fin(`[(${poly([[1, "x"], [p, ""]])})/${q}] = ${S(m)} tənliyinin ən ${big ? "böyük" : "kiçik"} tam həllini tap.`, R(ans),
            `${S(m)} ≤ (${poly([[1, "x"], [p, ""]])})/${q} < ${S(m + 1)} → ${S(q * m)} ≤ ${poly([[1, "x"], [p, ""]])} < ${S(q * m + q)} → ${S(lo)} ≤ x < ${S(lo + q)}. Ən ${big ? "böyük" : "kiçik"} tam x = ${S(ans)}.`);
        }
        if (kind === "C") {
          const [n1, n2] = distinct(2, -5, 7), s = n1 + n2, t = n1 * n2, sum = Math.random() < .5;
          const eq = `[x]² ${s === 0 ? "" : (s > 0 ? "− " : "+ ") + (Math.abs(s) === 1 ? "" : Math.abs(s)) + "[x] "}${t === 0 ? "" : (t < 0 ? "− " : "+ ") + Math.abs(t) + " "}= 0`;
          const ans = sum ? n1 + n2 : Math.min(n1, n2);
          return fin(`${eq} tənliyinin ${sum ? "tam həllərinin cəmini" : "ən kiçik həllini"} tap.`, R(ans),
            `[x] = n yazsaq, n² ${lead(-s, "n")} ${lead(t)} = 0 → n = ${S(Math.min(n1, n2))} və ya n = ${S(Math.max(n1, n2))} (Viyet: cəm ${S(s)}, hasil ${S(t)}). [x] = n olan x-lər [n; n+1) aralığındadır. ${sum ? `Tam x üçün [x] = x, yəni tam həllər ${S(Math.min(n1, n2))} və ${S(Math.max(n1, n2))}; cəm ${S(ans)}.` : `Ən kiçik həll x = ${S(ans)}.`}`.replace("  ", " "));
        }
        if (kind === "D") {
          const a = rnd(2, 5), b = rnd(-5, 5), n = rnd(-6, 9), ans = R(n - b, a);
          return fin(`[${poly([[a, "x"], [b, ""]])}] = ${S(n)} tənliyinin ən kiçik həllini tap.`, ans,
            `${S(n)} ≤ ${poly([[a, "x"], [b, ""]])} < ${S(n + 1)} → ${S(n - b)} ≤ ${a}x < ${S(n - b + 1)} → ${rs(ans)} ≤ x < ${rs(R(n - b + 1, a))}. Ən kiçik həll: ${rs(ans)}.`);
        }
        const k = rnd(2, 5), r = pick([-1, 1]) * rnd(1, 8), m = (k - 1) * r;
        return fin(`[x] = (x ${m < 0 ? "−" : "+"} ${Math.abs(m)})/${k} tənliyini həll et.`, R(r),
          `Sağ tərəf tam ədəddir (sol tərəf [x]). (x ${m < 0 ? "−" : "+"} ${Math.abs(m)})/${k} = n → x = ${k}n ${m < 0 ? "+" : "−"} ${Math.abs(m)} tam ədəddir. Tam x üçün [x] = x. Onda x = (x ${m < 0 ? "−" : "+"} ${Math.abs(m)})/${k} → ${k - 1}x = ${S(m)} → x = ${S(r)}.`);
      } },
    { id: "tenlik-2", ad: "{x} ilə tənliklər", izah: "x = n + f yaz (n = [x] tam, f = {x}, 0 ≤ f < 1). Tənliyi n və f üçün həll et, sonra 0 ≤ f < 1 şərtini yoxla.",
      gen() {
        const kind = pick(["A", "A", "B", "B", "C", "C"]);
        if (kind === "A") {
          const k = rnd(3, 9), sum = Math.random() < .5, ans = sum ? R(k * (k - 2), 2) : R(k - 1);
          return fin(`{x} = x/${k} tənliyinin ${sum ? "bütün həllərinin cəmini" : "neçə həlli olduğunu"} tap.`, ans,
            `x = n + f, f = x/${k} → n + f = ${k}f → f = n/${k - 1}. 0 ≤ f < 1 olduğundan n = 0, 1, …, ${k - 2} (cəmi ${k - 1} həll). x = ${k}n/${k - 1}. Həllər: ${Array.from({ length: k - 1 }, (_, n) => rs(R(k * n, k - 1))).join("; ")}. ${sum ? "Cəm: " + rs(ans) + "." : "Həllərin sayı: " + (k - 1) + "."}`);
        }
        if (kind === "B") {
          const c = rnd(2, 4), q = rnd(1, 4), p = rnd(-20, 30), t = R(p, q), n = fl(p, q);
          // [x] + c{x} = t  →  n + c f = t, n in (t−c, t], largest n = [t]
          const ans = R((c - 1) * n * q + p, c * q);
          return fin(`[x] + ${c}·{x} = ${rs(t)} tənliyinin ən böyük həllini tap.`, ans,
            `[x] = n, {x} = f olsun: n + ${c}f = ${rs(t)} → f = (${rs(t)} − n)/${c}. 0 ≤ f < 1 ⇒ ${rs(t)} − ${c} < n ≤ ${rs(t)}. Ən böyük n = [${rs(t)}] = ${S(n)}. f = ${rs(R(p - n * q, c * q))}, x = n + f = ${rs(ans)}.`);
        }
        const k = rnd(1, 4), n = rnd(-6, 8), fq = rnd(2, 7), fp = rnd(0, fq - 1), f = R(fp, fq), t = R((k + 1) * n * fq + fp, fq);
        const x = R(n * fq + fp, fq), tn = fl(t[0], (k + 1) * t[1]);
        if (tn !== n) throw new Error("bad t");
        return fin(`x + ${k === 1 ? "" : k + "·"}[x] = ${rs(t)} tənliyini həll et (x = ?).`, x,
          `x = n + f yazsaq: n + f + ${k}·n = ${rs(t)} → ${k + 1}n + f = ${rs(t)}. 0 ≤ f < 1 olduğundan ${k + 1}n ≤ ${rs(t)} < ${k + 1}n + 1, yəni n = [${rs(t)}/${k + 1}] = ${S(n)}. f = ${rs(t)} − ${S((k + 1) * n)} = ${rs(f)}. x = ${rs(x)}.`);
      } },
    { id: "sayma", ad: "Tam hissə ilə saymaq", izah: "1-dən N-ə qədər m-ə bölünən ədədlərin sayı [N/m]-dir. Ortaq bölünmələr üçün ƏKOB, faktorialda sıfırlar və qüvvətlər üçün Lejandr düsturu.",
      gen() {
        const kind = pick(["A", "B", "C", "D", "D", "E", "F"]);
        if (kind === "A") { const m = rnd(3, 19), N = rnd(60, 2100); return fin(`1-dən ${N}-ə qədər (daxil) neçə natural ədəd ${m}-ə bölünür?`, R(fl(N, m)), `Say [${N}/${m}] = ${fl(N, m)}. (${m}, ${2 * m}, …, ${m * fl(N, m)}.)`); }
        if (kind === "B") {
          let m = rnd(2, 9), n = rnd(2, 9); while (m === n) n = rnd(2, 9);
          const N = rnd(60, 1500), L = lcm(m, n), ans = fl(N, m) + fl(N, n) - fl(N, L);
          return fin(`1-dən ${N}-ə qədər neçə natural ədəd ${m}-ə və ya ${n}-ə (heç olmasa birinə) bölünür?`, R(ans),
            `${m}-ə bölünən: [${N}/${m}] = ${fl(N, m)}. ${n}-ə bölünən: [${N}/${n}] = ${fl(N, n)}. İkisinə də bölünən (ƏKOB-a, ${L}-ə): [${N}/${L}] = ${fl(N, L)}, onlar iki dəfə sayılıb. Cavab: ${fl(N, m)} + ${fl(N, n)} − ${fl(N, L)} = ${ans}.`);
        }
        if (kind === "C") {
          let m = rnd(2, 8), n = rnd(2, 9); while (m === n || n % m === 0 || m % n === 0) n = rnd(2, 9);
          const N = rnd(60, 1500), L = lcm(m, n), ans = fl(N, m) - fl(N, L);
          return fin(`1-dən ${N}-ə qədər neçə natural ədəd ${m}-ə bölünür, amma ${n}-ə bölünmür?`, R(ans),
            `${m}-ə bölünənlər: [${N}/${m}] = ${fl(N, m)}. Bunların içində ${n}-ə də bölünənlər, yəni ${L}-ə bölünənlər: [${N}/${L}] = ${fl(N, L)}. Cavab: ${fl(N, m)} − ${fl(N, L)} = ${ans}.`);
        }
        if (kind === "D") {
          const N = rnd(25, 400); let z = 0, parts = [], pw = 5;
          while (pw <= N) { z += fl(N, pw); parts.push(`[${N}/${pw}] = ${fl(N, pw)}`); pw *= 5; }
          return fin(`${N}! (1·2·…·${N}) ədədi sonunda neçə sıfırla bitir?`, R(z),
            `Sıfır = 10 = 2·5 vuruğu. 2-lər çoxdur, say 5-lərlə təyin olunur: ${parts.join("; ")}. Cəmi ${z}.`);
        }
        if (kind === "E") {
          const k = rnd(2, 40);
          return fin(`Neçə natural n üçün [√n] = ${k}?`, R(2 * k + 1),
            `[√n] = ${k} ⇔ ${k} ≤ √n < ${k + 1} ⇔ ${k * k} ≤ n < ${(k + 1) * (k + 1)}. Say: ${(k + 1) * (k + 1)} − ${k * k} = ${2 * k + 1}.`);
        }
        const p = pick([2, 3, 5, 7]), N = rnd(p === 2 ? 20 : 30, 150); let e = 0, parts = [], pw = p;
        while (pw <= N) { e += fl(N, pw); parts.push(`[${N}/${pw}] = ${fl(N, pw)}`); pw *= p; }
        return fin(`${N}! ədədi ${p}-nin ən çoxu neçənci qüvvətinə bölünür? (${N}! = ${p}ᵉ · M, M ${p}-yə bölünmür; e = ?)`, R(e),
          `Lejandr düsturu: ${parts.join("; ")}. Cəmi ${e}. (${p}-ə, ${p * p}-na, … bölünənlər ardıcıl sayılır.)`);
      } },
    { id: "cem", ad: "Cəmlər və Ermit eyniliyi", izah: "Σ[k/m]: hər qiymət m dəfə təkrarlanır. Ermit: [x] + [x + 1/m] + … + [x + (m−1)/m] = [mx].",
      gen() {
        const kind = pick(["A", "A", "B", "C", "C", "D"]);
        if (kind === "A") {
          const m = rnd(2, 7), n = rnd(3 * m, 70); let sum = 0; for (let k = 1; k <= n; k++) sum += fl(k, m);
          const q = fl(n, m), r = n % m;
          return fin(`[1/${m}] + [2/${m}] + [3/${m}] + … + [${n}/${m}] = ?`, R(sum),
            `1, 2, …, ${q - 1} qiymətlərinin hər biri ${m} dəfə, ${q} isə ${r + 1} dəfə təkrarlanır (k = ${r === 0 ? n : m * q + ", …, " + n}); 0 cəmə təsir etmir. Cəm: ${m}·(1 + 2 + … + ${q - 1}) + ${q}·${r + 1} = ${m}·${q * (q - 1) / 2} + ${q * (r + 1)} = ${sum}.`);
        }
        if (kind === "B") {
          const q = rnd(3, 8); let sum = 0, parts = [];
          for (let j = 1; j < q; j++) { sum += j * (2 * j + 1); parts.push(`${j}·${2 * j + 1}`); }
          return fin(`[√1] + [√2] + [√3] + … + [√${q * q - 1}] = ?`, R(sum),
            `[√k] = j olan k-lar: ${"j²"}-dən (j+1)²−1-ə qədər, yəni 2j + 1 ədəd. Cəm: ${parts.join(" + ")} = ${sum}.`);
        }
        if (kind === "C") {
          const m = rnd(2, 5), q = rnd(2, 9), p = rnd(1, 80); let sum = 0;
          for (let k = 0; k < m; k++) sum += fl(p * m + k * q, m * q);
          const ident = fl(m * p, q); if (sum !== ident) throw new Error("hermite fail");
          const x = R(p, q), terms = Array.from({ length: m }, (_, k) => k === 0 ? "[x]" : `[x + ${k}/${m}]`).join(" + ");
          return fin(`x = ${rs(x)} üçün ${terms} cəmini hesabla.`, R(sum),
            `Ermit eyniliyi: ${terms} = [${m}x]. [${m}·${rs(x)}] = [${rs(R(m * p, q))}] = ${sum}.`);
        }
        const m = rnd(3, 9), qq = rnd(2, 12), n = m * qq, ans = R(qq * (m - 1), 2);
        return fin(`{1/${m}} + {2/${m}} + {3/${m}} + … + {${n}/${m}} = ? (${n} toplanan)`, ans,
          `Hər ${m} ardıcıl toplanan bir blokdur: 1/${m} + 2/${m} + … + (${m - 1})/${m} + 0 = ${rs(R(m - 1, 2))}. Blokların sayı ${qq}. Cəm: ${qq}·${rs(R(m - 1, 2))} = ${rs(ans)}.`);
      } },
    { id: "hayat", ad: "Həyatdan", izah: "\"Neçə tam\" — tam hissədir. \"Heç olmasa neçə\" — yuxarı yuvarlaqlamadır (a, b müsbət tam ədədlər olduqda): ⌈a/b⌉ = [(a − 1)/b] + 1.",
      gen() {
        const kind = pick(["bus", "ceil", "rest", "week"]);
        if (kind === "bus") {
          const a = rnd(6, 25), T = rnd(100, 900), ans = fl(T, a) + 1;
          return { text: `Avtobuslar dayanacaqdan hər ${a} dəqiqədən bir çıxır. İlk avtobus saat 8:00-da (0-cı dəqiqədə) çıxıb. 8:00-dan sonrakı ${T} dəqiqənin sonuna qədər (həmin an daxil) neçə avtobus çıxıb?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Çıxış vaxtları: 0, ${a}, ${2 * a}, …, ${a}k (${a}k ≤ ${T}). k = [${T}/${a}] = ${fl(T, a)}. Sıfırıncı avtobusu da əlavə et: ${fl(T, a)} + 1 = ${ans}.` };
        }
        if (kind === "ceil") {
          const k = rnd(4, 45); let N = rnd(60, 900); while (N % k === 0) N++;
          const ans = fl(N - 1, k) + 1;
          return { text: `${N} nəfəri maşınlarla aparmaq lazımdır, hər maşına ${k} nəfər sığır. Heç olmasa neçə maşın lazımdır?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `[${N}/${k}] = ${fl(N, k)} tam maşın doludur, ${N - k * fl(N, k)} nəfər qalır — onlar üçün bir maşın da lazımdır. Cavab: ${fl(N, k)} + 1 = ${ans}. (Düstur: [(${N} − 1)/${k}] + 1.)` };
        }
        if (kind === "rest") {
          const p = rnd(7, 45), N = rnd(100, 900), c = fl(N, p), ans = N - p * c;
          return { text: `Kitab ${p} manatdır, ${N} manatın var. Maksimum neçə kitab ala bilərsən və pulun neçə manat qalar? Qalan pulu yaz.`, answer: ans, show: String(ans), tol: 0.01, unit: "manat",
            solution: `[${N}/${p}] = ${c} kitab. ${p}·${c} = ${p * c} manat xərclənir. Qalan: ${N} − ${p * c} = ${ans} manat.` };
        }
        const N = rnd(40, 400), day = rnd(1, 7), names = ["bazar ertəsi", "çərşənbə axşamı", "çərşənbə", "cümə axşamı", "cümə", "şənbə", "bazar"];
        const wk = fl(N, 7), left = N % 7, nd = (day - 1 + N) % 7 + 1;
        return { text: `Bu gün ${names[day - 1]} günüdür (həftənin ${day}-ci günü; bazar ertəsi 1, bazar 7). ${N} gün sonra həftənin neçənci günü olacaq?`, answer: nd, show: String(nd), tol: 0.01,
          solution: `${N} gün = [${N}/7] = ${wk} tam həftə və ${left} gün. Tam həftələr günü dəyişmir. ${day} + ${left} = ${day + left}${day + left > 7 ? ", 7-dən çıxırıq: " + (day + left - 7) : ""}. Cavab: ${nd}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const a = rnd(2, 5), b = pick([-1, 1]) * rnd(1, 5), n = rnd(-6, 9), ans = R(n - b, a), alt = R(n - b + 1, a);
        const L = poly([[a, "x"], [b, ""]]);
        const steps = [
          `${S(n)} ≤ ${L} < ${S(n + 1)}.`,
          `${S(n - b)} ≤ ${a}x < ${S(n - b + 1)}.`,
          `${rs(ans)} ≤ x < ${rs(alt)}. Ən kiçik həll: ${rs(ans)}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `${S(n)} < ${L} ≤ ${S(n + 1)}.`;
        if (bad === 1) steps[1] = `${S(n - b)} ≤ ${a}x < ${S(n + 1)}.`;
        if (bad === 2) steps[2] = `${rs(ans)} ≤ x < ${rs(alt)}. Ən kiçik həll: ${rs(alt)}.`;
        const text = h("div", {}, h("p", {}, `[${L}] = ${S(n)} tənliyinin ən kiçik həllini tapırıq.`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: [u] = n ⇔ n ≤ u < n + 1 (sol ucu daxildir, sağ ucu yox). Bərabərsizliyin işarələri düz verilməyib.`,
          `2-ci addım: ${S(b)} sabitini bütün hissələrdən çıxmaq lazımdır, sağ hissə də ${S(n + 1 - b)} olmalıdır.`,
          `3-cü addım: aralıq [${rs(ans)}; ${rs(alt)}) — sol uc daxildir, ən kiçik həll sol ucdur: ${rs(ans)}.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-tam-hisse", title: "[x] və {x} funksiyaları", fenn: "olimpiada", link: "dersler/ol-tam-hisse.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 7/2 (onluq 3.5 də olar).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["tam-kesr", "tam-kesr", "tenlik-1", "tenlik-1", "tenlik-2", "tenlik-2", "sayma", "sayma", "cem", "hayat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-tam-hisse.html")) b.push("dersler/ol-tam-hisse.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
