// Olimpiada · Funksiyanın xassələri; tərs və mürəkkəb funksiya — game levels.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const lcm = (a, b) => a / gcd(a, b) * b;
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const sub = n => n < 0 ? "+ " + (-n) : "− " + n;                       // "− n" written for any sign of n
  const P = n => n < 0 ? "(" + S(n) + ")" : String(n);                    // number in brackets when negative
  // exact fractions as [num, den]
  const R = (n, d = 1) => { if (d === 0) throw new Error("zero denominator"); if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; return [n / g, d / g]; };
  const radd = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const rsub = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const rmul = (a, b) => R(a[0] * b[0], a[1] * b[1]);
  const rdiv = (a, b) => R(a[0] * b[1], a[1] * b[0]);
  const rs = a => a[1] === 1 ? S(a[0]) : S(a[0]) + "/" + a[1];
  const rv = a => a[0] / a[1];
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const fin = (text, fr, solution, extra = {}) => Object.assign({ text, answer: rv(fr), show: rs(fr), tol: Number.isInteger(rv(fr)) ? 0.01 : Math.min(0.005, Math.abs(rv(fr)) * 0.01), solution }, extra);

  const levels = [
    { id: "cut-tek", ad: "Cüt və tək funksiya", izah: "Cüt: f(−x) = f(x). Tək: f(−x) = −f(x). Tək hissəni ayır, simmetriyadan istifadə et.",
      gen() {
        const kind = pick(["A", "B", "C", "C", "D"]);
        if (kind === "A") {
          const a = rnd(1, 9), v = pick([-1, 1]) * rnd(1, 12), k = rnd(2, 6), ans = (k - 1) * v;
          return fin(`f tək funksiyadır və f(${a}) = ${S(v)}. f(−${a}) + ${k}·f(${a}) ifadəsinin qiymətini tap.`, R(ans),
            `Tək funksiyada f(−x) = −f(x). Deməli f(−${a}) = ${S(-v)}. İfadə: ${S(-v)} + ${k}·${P(v)} = ${S(ans)}.`);
        }
        if (kind === "B") {
          const a = rnd(1, 9), v = pick([-1, 1]) * rnd(1, 12), m = rnd(2, 5), n = pick([-1, 1]) * rnd(1, 5), ans = (m + n) * v;
          return fin(`f cüt funksiyadır və f(${a}) = ${S(v)}. ${m}·f(−${a}) ${n < 0 ? "−" : "+"} ${Math.abs(n)}·f(${a}) ifadəsinin qiymətini tap.`, R(ans),
            `Cüt funksiyada f(−x) = f(x), yəni f(−${a}) = ${S(v)}. İfadə: ${m}·${P(v)} ${n < 0 ? "−" : "+"} ${Math.abs(n)}·${P(v)} = ${S(ans)}.`);
        }
        if (kind === "C") {
          const t = rnd(1, 5), c = pick([-1, 1]) * rnd(1, 9), m = rnd(-30, 30), ans = 2 * c - m;
          return fin(`f(x) = ax³ + bx ${c < 0 ? "−" : "+"} ${Math.abs(c)} (a və b — naməlum ədədlərdir). f(−${t}) = ${S(m)} olduğunu bilirik. f(${t}) = ?`, R(ans),
            `g(x) = f(x) ${sub(c)} = ax³ + bx tək funksiyadır. g(−${t}) = −g(${t}): ${S(m)} ${sub(c)} = −(f(${t}) ${sub(c)}). Buradan f(${t}) = 2·${P(c)} ${sub(m)} = ${S(ans)}.`);
        }
        const a = rnd(1, 6), u = rnd(-9, 9), w = rnd(-9, 9), ans = 2 * w;
        return fin(`f(${a}) = ${S(u)}, f(−${a}) = ${S(w)}. F(x) = f(x) + f(−x), G(x) = f(x) − f(−x) olsun. F(−${a}) + G(−${a}) = ?`, R(ans),
          `F(−${a}) = f(−${a}) + f(${a}) = ${S(w)} + ${P(u)} = ${S(w + u)}. G(−${a}) = f(−${a}) − f(${a}) = ${S(w)} − ${P(u)} = ${S(w - u)}. Cəm: ${S(ans)}. (F həmişə cütdür, G həmişə tək.)`);
      } },
    { id: "dovr", ad: "Dövrü funksiya", izah: "f(x + T) = f(x) olarsa, qiymətlər T addımdan bir təkrarlanır. Böyük arqumenti T-yə bölməyin qalığına gətir.",
      gen() {
        const kind = pick(["A", "A", "B", "C", "D"]);
        if (kind === "A") {
          const T = rnd(3, 6), vals = Array.from({ length: T }, () => rnd(-9, 15)), N = rnd(40, 3000), r = N % T || T;
          const list = vals.map((v, i) => `f(${i + 1}) = ${S(v)}`).join(", ");
          return fin(`f dövrü funksiyadır, periodu ${T} (f(x + ${T}) = f(x)). ${list}. f(${N}) = ?`, R(vals[r - 1]),
            `${N} = ${T}·${Math.floor((N - 1) / T)} + ${r} qalığına görə ${N} ≡ ${r} (mod ${T}), yəni f(${N}) = f(${r}) = ${S(vals[r - 1])}.`);
        }
        if (kind === "B") {
          const a = rnd(1, 5), x0 = rnd(1, 9), v = pick([-1, 1]) * rnd(1, 12), m = rnd(5, 61);
          const ans = v * (m % 2 ? -1 : 1);
          return fin(`Bütün x üçün f(x + ${a}) = −f(x) və f(${x0}) = ${S(v)}. f(${x0 + m * a}) = ?`, R(ans),
            `Hər ${a} addımdan sonra işarə dəyişir. ${m * a} = ${a}·${m}, yəni ${m} dəfə işarə dəyişir. ${m} ${m % 2 ? "təkdir → işarə tərsinə dönür" : "cütdür → işarə eyni qalır"}: f(${x0 + m * a}) = ${S(ans)}. (Period ${2 * a}-dir.)`);
        }
        if (kind === "C") {
          let m1 = rnd(2, 12), m2 = rnd(2, 12); while (m2 === m1) m2 = rnd(2, 12);
          const L = lcm(m1, m2);
          return fin(`f(x) = sin(2πx/${m1}) + cos(2πx/${m2}). Bu funksiyanın ən kiçik müsbət periodunu tap.`, R(L),
            `sin(2πx/${m1})-in periodu ${m1}, cos(2πx/${m2})-nin periodu ${m2}-dir. Cəmin periodu hər ikisinə bölünməlidir: ƏKOB(${m1}; ${m2}) = ${L}.`);
        }
        const T = rnd(3, 8), a = rnd(1, T - 1), v = pick([-1, 1]) * rnd(1, 15), k = rnd(30, 400), N = k * T - a;
        return fin(`f tək funksiyadır, periodu ${T}-dir. f(${a}) = ${S(v)}. f(${N}) = ?`, R(-v),
          `${N} = ${k}·${T} − ${a}, period ${T} olduğundan f(${N}) = f(−${a}). Tək funksiya: f(−${a}) = −f(${a}) = ${S(-v)}.`);
      } },
    { id: "mono", ad: "Artan və azalan funksiya", izah: "Ciddi monoton funksiya hər qiyməti bir dəfə alır: f(u) = f(v) ⇒ u = v. Artanda bərabərsizliyin istiqaməti qalır, azalanda dönür.",
      gen() {
        const kind = pick(["A", "B", "C", "D", "E"]);
        if (kind === "A") {
          let p = rnd(-3, 6), r = rnd(-3, 6); while (p === r) r = rnd(-3, 6);
          const q = rnd(-9, 9), s = rnd(-9, 9), ans = R(s - q, p - r);
          return fin(`f ciddi artan funksiyadır və f(${poly([[p, "x"], [q, ""]])}) = f(${poly([[r, "x"], [s, ""]])}). x = ?`, ans,
            `Ciddi monoton funksiya bir qiyməti iki arqumentdə almır, ona görə arqumentlər bərabərdir: ${poly([[p, "x"], [q, ""]])} = ${poly([[r, "x"], [s, ""]])} → ${poly([[p - r, "x"]])} = ${S(s - q)}, x = ${rs(ans)}.`);
        }
        if (kind === "B") {
          const n = pick([3, 5]), c = rnd(1, 4), m = pick([-1, 1]) * rnd(1, 5), rhs = m ** n + c * m;
          return fin(`x${n === 3 ? "³" : "⁵"} + ${c === 1 ? "" : c}x = ${S(rhs)} tənliyinin həqiqi kökünü tap.`, R(m),
            `f(x) = x${n === 3 ? "³" : "⁵"} + ${c === 1 ? "" : c}x ciddi artandır, ona görə hər qiyməti yalnız bir dəfə alır. Tapırıq: f(${S(m)}) = ${S(rhs)} → kök yeganədir: x = ${S(m)}.`);
        }
        if (kind === "C") {
          const t = rnd(1, 7);
          return fin(`√x + x = ${t + t * t} tənliyinin kökünü tap.`, R(t * t),
            `√x + x artan funksiyadır (iki artan funksiyanın cəmi), kök yeganədir. √x = ${t} olanda ${t} + ${t * t} = ${t + t * t}. Deməli x = ${t * t}.`);
        }
        if (kind === "D") {
          let p = rnd(2, 7), r = rnd(-2, p - 1); const q = rnd(-9, 9), s = rnd(-9, 9);
          const N = s - q, D = p - r, big = Math.ceil(N / D) - 1;
          return fin(`f ciddi artan funksiyadır. f(${poly([[p, "x"], [q, ""]])}) < f(${poly([[r, "x"], [s, ""]])}) bərabərsizliyini ödəyən ən böyük tam x-i tap.`, R(big),
            `f artandır, ona görə bərabərsizlik arqumentlər üçün eyni istiqamətdədir: ${poly([[p, "x"], [q, ""]])} < ${poly([[r, "x"], [s, ""]])} → ${poly([[D, "x"]])} < ${S(N)} → x < ${rs(R(N, D))}. Ən böyük tam x = ${S(big)}.`);
        }
        let p = rnd(2, 7), r = rnd(-2, p - 1); const q = rnd(-9, 9), s = rnd(-9, 9);
        const N = s - q, D = p - r, small = Math.floor(N / D) + 1;
        return fin(`f ciddi azalan funksiyadır. f(${poly([[p, "x"], [q, ""]])}) < f(${poly([[r, "x"], [s, ""]])}) bərabərsizliyini ödəyən ən kiçik tam x-i tap.`, R(small),
          `f azalandır, ona görə bərabərsizliyin istiqaməti dönür: ${poly([[p, "x"], [q, ""]])} > ${poly([[r, "x"], [s, ""]])} → ${poly([[D, "x"]])} > ${S(N)} → x > ${rs(R(N, D))}. Ən kiçik tam x = ${S(small)}.`);
      } },
    { id: "kompoz", ad: "Mürəkkəb və tərs funksiya", izah: "f(g(x)): əvvəl g, sonra f. Tərs funksiya: y = f(x) tənliyindən x-i tap. Qrafiklər y = x düz xəttinə görə simmetrikdir.",
      gen() {
        const kind = pick(["A", "A", "B", "C", "D", "D", "E", "F"]);
        const lf = (a, b) => poly([[a, "x"], [b, ""]]);
        if (kind === "A") {
          const a = pick([-1, 1]) * rnd(1, 5), b = rnd(-8, 8), c = pick([-1, 1]) * rnd(1, 5), d = rnd(-8, 8), k = rnd(-5, 7);
          const f = x => a * x + b, g = x => c * x + d, which = pick(["fg", "gf", "ff"]);
          if (which === "fg") return fin(`f(x) = ${lf(a, b)}, g(x) = ${lf(c, d)}. f(g(${S(k)})) = ?`, R(f(g(k))), `Əvvəl içəridəki: g(${S(k)}) = ${S(g(k))}. Sonra f(${S(g(k))}) = ${S(f(g(k)))}.`);
          if (which === "gf") return fin(`f(x) = ${lf(a, b)}, g(x) = ${lf(c, d)}. g(f(${S(k)})) = ?`, R(g(f(k))), `Əvvəl f(${S(k)}) = ${S(f(k))}. Sonra g(${S(f(k))}) = ${S(g(f(k)))}.`);
          return fin(`f(x) = ${lf(a, b)}. f(f(${S(k)})) = ?`, R(f(f(k))), `f(${S(k)}) = ${S(f(k))}, sonra f(${S(f(k))}) = ${S(f(f(k)))}.`);
        }
        if (kind === "B") {
          const c = rnd(-6, 6), a = pick([-1, 1]) * rnd(1, 4), b = rnd(-6, 6), k = rnd(-4, 5);
          const f = x => x * x + c, g = x => a * x + b, ans = f(g(k)) - g(f(k));
          return fin(`f(x) = ${poly([[1, "x²"], [c, ""]])}, g(x) = ${lf(a, b)}. f(g(${S(k)})) − g(f(${S(k)})) = ?`, R(ans),
            `g(${S(k)}) = ${S(g(k))}, f(${S(g(k))}) = ${S(f(g(k)))}. f(${S(k)}) = ${S(f(k))}, g(${S(f(k))}) = ${S(g(f(k)))}. Fərq: ${S(f(g(k)))} − ${P(g(f(k)))} = ${S(ans)}.`);
        }
        if (kind === "C") {
          const a = pick([-1, 1]) * rnd(2, 5), b = rnd(-9, 9), y = rnd(-9, 12), ans = R(y - b, a);
          return fin(`f(x) = ${lf(a, b)}. Tərs funksiya üçün f⁻¹(${S(y)}) = ?`, ans,
            `f⁻¹(${S(y)}) = x o deməkdir ki, f(x) = ${S(y)}: ${lf(a, b)} = ${S(y)} → ${poly([[a, "x"]])} = ${S(y - b)} → x = ${rs(ans)}.`);
        }
        if (kind === "D") {
          let a, b, c, d, y, ans, tries = 0;
          do { a = rnd(-3, 3); b = rnd(-4, 4); c = pick([-1, 1]) * rnd(1, 3); d = rnd(-4, 4); y = rnd(-4, 5); tries++; } while ((a * d - b * c === 0 || c * y - a === 0) && tries < 100);
          ans = R(b - d * y, c * y - a);
          return fin(`f(x) = (${lf(a, b)})/(${lf(c, d)}). f⁻¹(${S(y)}) = ?`, ans,
            `f(x) = ${S(y)}: ${lf(a, b)} = ${S(y)}·(${lf(c, d)}) → ${poly([[a - c * y, "x"]])} = ${S(d * y - b)} → x = ${rs(ans)}.`);
        }
        if (kind === "E") {
          let a = pick([-1, 1]) * rnd(2, 5); const b = rnd(-9, 9) || 4, ans = R(b, 1 - a);
          return fin(`f(x) = ${lf(a, b)}. f və f⁻¹ funksiyalarının qrafikləri bir nöqtədə kəsişir. Həmin nöqtənin absisini tap.`, ans,
            `Qrafiklər y = x düz xəttinə görə simmetrikdir, ona görə kəsişmə y = x üzərindədir: f(x) = x. ${lf(a, b)} = x → ${poly([[a - 1, "x"]])} = ${S(-b)} → x = ${rs(ans)}.`);
        }
        const m = pick([-1, 1]) * rnd(1, 5), y = m ** 3 + m;
        return fin(`f(x) = x³ + x. f⁻¹(${S(y)}) = ?`, R(m),
          `f ciddi artandır, tərsi var. f(x) = ${S(y)} tənliyini seçməklə həll edirik: f(${S(m)}) = ${S(m ** 3)} + ${P(m)} = ${S(y)}. Deməli f⁻¹(${S(y)}) = ${S(m)}.`);
      } },
    { id: "ff", ad: "f(f(x)) məsələləri", izah: "f(f(x)) verilibsə, f-in şəklini axtar (xətti: ax + b). Təkrar tətbiqdə dövrü axtar: bir neçə addımdan sonra x qayıdır.",
      gen() {
        const kind = pick(["A", "A", "B", "C", "D"]);
        if (kind === "A") {
          const a = rnd(2, 5), b = pick([-1, 1]) * rnd(1, 6), k = rnd(-5, 10), C = a * a, D = b * (a + 1), ans = a * k + b;
          return fin(`f(x) = ax + b artan xətti funksiyadır (a > 0) və f(f(x)) = ${poly([[C, "x"], [D, ""]])}. f(${S(k)}) = ?`, R(ans),
            `f(f(x)) = a(ax + b) + b = a²x + (a + 1)b. a² = ${C} → a = ${a} (a > 0). (a + 1)b = ${S(D)} → ${a + 1}b = ${S(D)} → b = ${S(b)}. f(${S(k)}) = ${a}·${P(k)} + ${P(b)} = ${S(ans)}.`);
        }
        if (kind === "B") {
          const x0 = pick([2, 3, 4, 5, 6, -1, -2, -3]), n = rnd(20, 3000), r = n % 3;
          const f = x => rdiv(R(1), rsub(R(1), x));
          let cur = R(x0); const path = [rs(cur)];
          for (let i = 0; i < r; i++) { cur = f(cur); path.push(rs(cur)); }
          const f1 = f(R(x0)), f2 = f(f1);
          return fin(`f(x) = 1/(1 − x). f funksiyasını ${S(x0)} ədədinə ${n} dəfə ardıcıl tətbiq etsək (f(f(…f(${S(x0)})…)), cəmi ${n} dəfə) nə alarıq?`, cur,
            `f(${S(x0)}) = ${rs(f1)}, f(f(${S(x0)})) = ${rs(f2)}, üçüncü tətbiqdən sonra yenə ${S(x0)} qayıdır (f(f(f(x))) = x). Dövr 3-dür. ${n} = 3·${Math.floor(n / 3)} + ${r}, ona görə ${r === 0 ? "nəticə başlanğıc ədəddir" : r + " tətbiqlik nəticə"}: ${rs(cur)}.`);
        }
        if (kind === "C") {
          const x0 = pick([2, 3, 4, 5, -2, -3]), n = rnd(20, 3000), r = n % 4;
          const f = x => rdiv(rsub(x, R(1)), radd(x, R(1)));
          const vals = [R(x0)];
          for (let i = 1; i <= 4; i++) vals.push(f(vals[i - 1]));
          const seq = vals.map(rs);
          return fin(`f(x) = (x − 1)/(x + 1). f funksiyasını ${S(x0)} ədədinə ${n} dəfə ardıcıl tətbiq etsək nə alarıq?`, vals[r],
            `Ardıcıl nəticələr: ${seq.join(" → ")}. 4 tətbiqdən sonra başlanğıc qayıdır (f(f(x)) = −1/x, f⁴(x) = x). ${n} = 4·${Math.floor(n / 4)} + ${r}, cavab ${r}-ci nəticədir: ${seq[r]}.`);
        }
        const a = rnd(2, 3), b = rnd(-5, 5) || 1, n = rnd(3, 6), k = rnd(-3, 5);
        let v = k; for (let i = 0; i < n; i++) v = a * v + b;
        return fin(`f(x) = ${poly([[a, "x"], [b, ""]])}. f funksiyasını ${S(k)} ədədinə ${n} dəfə ardıcıl tətbiq et. Nəticə neçədir?`, R(v),
          `Addım-addım: ${(() => { let c = k, o = [S(k)]; for (let i = 0; i < n; i++) { c = a * c + b; o.push(S(c)); } return o.join(" → "); })()}. Cavab: ${S(v)}.`);
      } },
    { id: "hayat", ad: "Həyatdan", izah: "Real vəziyyəti funksiya kimi yaz: tarif f(x) = a + bx (tərs funksiya), endirim və vergi (mürəkkəb funksiya), dövrü proses.",
      gen() {
        const kind = pick(["taxi", "disc", "temp", "wheel"]);
        if (kind === "taxi") {
          const a = rnd(2, 6), b = rnd(1, 4), x = rnd(3, 40), y = a + b * x;
          return { text: `Taksinin tarifi: oturacaq haqqı ${a} manat və hər kilometr üçün ${b} manat. Sərnişin cəmi ${y} manat ödədi. Taksi neçə km getdi?`, answer: x, unit: "km", show: String(x), tol: 0.01,
            solution: `Yol haqqı f(x) = ${a} + ${b}x. Burada f(x) = ${y} olduğundan tərs funksiyadan: x = (${y} − ${a})/${b} = ${x}. Cavab: ${x} km.` };
        }
        if (kind === "disc") {
          const x = rnd(5, 60) * 10, d = rnd(1, 4) * 10, r = pick([10, 20, 25, 50]), ans = R(d * r, 100);
          return { text: `Mağazada ${x} manatlıq malın qiymətinə iki cür hesab var. Birinci: əvvəl ${d} manat endirim, sonra qalan məbləğin üstünə ${r}% əlavə. İkinci: əvvəl ${r}% əlavə, sonra ${d} manat endirim. İkinci hesab birincidən neçə manat çoxdur?`,
            answer: rv(ans), unit: "manat", show: rs(ans), tol: 0.01,
            solution: `Birinci: (${x} − ${d})·${rs(R(100 + r, 100))} = ${rs(R((x - d) * (100 + r), 100))}. İkinci: ${x}·${rs(R(100 + r, 100))} − ${d} = ${rs(R(x * (100 + r) - 100 * d, 100))}. Fərq = ${d}·${r}/100 = ${rs(ans)} manat. (Əməllərin sırası vacibdir: f(g(x)) ≠ g(f(x)).)` };
        }
        if (kind === "temp") {
          const C = 5 * rnd(-6, 20), F = 9 * C / 5 + 32;
          return { text: `Selsi və Farenheyt: F = 1,8·C + 32. Havanın temperaturu ${S(F)}°F-dir. Bu neçə dərəcə Selsidir?`, answer: C, unit: "°C", show: S(C), tol: 0.01,
            solution: `Tərs funksiya: C = (F − 32)/1,8. C = (${P(F)} − 32)/1,8 = ${S(F - 32)}/1,8 = ${S(C)}.` };
        }
        const K = pick([8, 10, 12, 15]), s = pick([10, 15, 20, 30]), N = rnd(100, 3000), ans = Math.floor(N / s) % K + 1;
        return { text: `Fırlanan çarxın ${K} kabini var (1-dən ${K}-ə qədər nömrələnib). 0-cı saniyədə 1-ci kabin aşağıdadır. Hər ${s} saniyədən bir çarx bir kabin qədər irəli fırlanır: aşağıya növbəti nömrəli kabin gəlir, ${K}-cı kabindən sonra yenə 1-ci. ${N} saniyə sonra aşağıda neçənci kabin olacaq?`,
          answer: ans, show: String(ans), tol: 0.01,
          solution: `${N} saniyədə çarx ${Math.floor(N / s)} dəfə tam irəli fırlanır ([${N}/${s}] = ${Math.floor(N / s)}). Hər ${K} dəyişiklikdən sonra vəziyyət təkrarlanır (period ${K}): ${Math.floor(N / s)} ≡ ${Math.floor(N / s) % K} (mod ${K}). Aşağıdakı kabin: ${Math.floor(N / s) % K} + 1 = ${ans}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const t = rnd(1, 5), c = pick([-1, 1]) * rnd(1, 9);
        let m = rnd(-30, 30); while (m === 2 * c || m === c) m = rnd(-30, 30);
        const ans = 2 * c - m, cs = c < 0 ? "−" : "+", ca = Math.abs(c);
        const steps = [
          `g(x) = f(x) ${sub(c)} = ax³ + bx tək funksiyadır.`,
          `g(−${t}) = −g(${t}) → ${S(m)} ${sub(c)} = −(f(${t}) ${sub(c)}).`,
          `f(${t}) = 2·${P(c)} ${sub(m)} = ${S(ans)}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `g(x) = f(x) ${sub(-c)} tək funksiyadır.`;
        if (bad === 1) steps[1] = `g(−${t}) = g(${t}) → ${S(m)} ${sub(c)} = f(${t}) ${sub(c)}.`;
        if (bad === 2) steps[2] = `f(${t}) = ${P(m)} ${sub(2 * c)} = ${S(m - 2 * c)}.`;
        const text = h("div", {}, h("p", {}, `f(x) = ax³ + bx ${cs} ${ca}, f(−${t}) = ${S(m)}. f(${t}) = ?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: f(x) ${sub(c)} tək hissədir (ax³ + bx). f(x) ${sub(-c)} tək olmaz — sabit qalır.`,
          `2-ci addım: g tək funksiyadır, ona görə g(−${t}) = −g(${t}), g(−${t}) = g(${t}) yox.`,
          `3-cü addım: tənlikdən f(${t}) = 2·${P(c)} ${sub(m)} = ${S(ans)} çıxır. İşarələr qarışdırılıb.`][bad];
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
      key: "ol-funksiya-xasse", title: "Funksiyanın xassələri; tərs və mürəkkəb funksiya", fenn: "olimpiada", link: "dersler/ol-funksiya-xasse.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 5/2 (onluq 2.5 də olar).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["cut-tek", "cut-tek", "dovr", "dovr", "mono", "kompoz", "kompoz", "ff", "ff", "hayat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-funksiya-xasse.html")) b.push("dersler/ol-funksiya-xasse.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
