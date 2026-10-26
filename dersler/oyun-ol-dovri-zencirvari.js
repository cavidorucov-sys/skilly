// Dövri və zəncirvari kəsrlər (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (p, q) => { const g = gcd(p, q) || 1; return q / g === 1 ? String(p / g) : (p / g) + "/" + (q / g); };
  const mpow = (a, e, m) => { let r = 1 % m, b = a % m; while (e > 0) { if (e % 2) r = r * b % m; b = b * b % m; e = Math.floor(e / 2); } return r; };
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", sup = n => String(n).split("").map(d => SUP[+d]).join("");
  const p25 = (a, b) => [a ? "2" + (a > 1 ? sup(a) : "") : "", b ? "5" + (b > 1 ? sup(b) : "") : ""].filter(Boolean).join(" · ");
  const SUB = "₀₁₂₃₄₅₆₇₈₉", sub = n => String(n).split("").map(d => SUB[+d]).join("");
  const EXACT = 1e-9;   // fraction answers: a rounded decimal must not pass

  // decimal expansion of m/n (0 < m, any size): integer part, pre-period digits, period digits
  function expand(m, n) {
    const ip = Math.floor(m / n); let r = m % n; const seen = new Map(), ds = [];
    while (r !== 0 && !seen.has(r)) { seen.set(r, ds.length); r *= 10; ds.push(Math.floor(r / n)); r %= n; }
    if (r === 0) return { ip, pre: ds.join(""), per: "" };
    const k = seen.get(r); return { ip, pre: ds.slice(0, k).join(""), per: ds.slice(k).join("") };
  }
  const dec = (e) => e.ip + (e.pre || e.per ? "," + e.pre + (e.per ? "(" + e.per + ")" : "") : "");
  const strip = n => { let a = 0, b = 0; while (n % 2 === 0) { n /= 2; a++; } while (n % 5 === 0) { n /= 5; b++; } return [n, a, b]; };
  const ord10 = n => { let k = 1, v = 10 % n; while (v !== 1) { v = v * 10 % n; k++; } return k; };
  const phi = n => { let r = n; for (let p = 2; p * p <= n; p++) if (n % p === 0) { while (n % p === 0) n /= p; r -= r / p; } if (n > 1) r -= r / n; return r; };
  const divisors = n => { const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; };
  // n coprime to 10 with a period of 1..16
  const PERN = []; for (let n = 3; n < 200; n++) if (gcd(n, 10) === 1 && ord10(n) <= 16) PERN.push(n);
  // why the period of 1/n is k: check the divisors of φ(n)
  const ordWhy = n => { const f = phi(n), k = ord10(n), ds = divisors(f).filter(d => d <= k);
    return `φ(${n}) = ${f}, dövr onun bölənidir. Yoxlayırıq: ` + ds.map(d => `10${d > 1 ? sup(d) : ""} ≡ ${mpow(10, d, n)}`).join(", ") + ` (mod ${n}). İlk dəfə 1 alınan üst: ${k}.`; };

  // continued fractions
  const cfOf = (p, q) => { const a = []; while (q) { a.push(Math.floor(p / q)); [p, q] = [q, p % q]; } return a; };
  const cfVal = a => { let p = 1, q = 0; for (let i = a.length - 1; i >= 0; i--) [p, q] = [a[i] * p + q, p]; return [p, q]; };
  const cfStr = a => "[" + a[0] + (a.length > 1 ? "; " + a.slice(1).join(", ") : "") + "]";
  const nest = a => a.length === 1 ? String(a[0]) : a.length === 2 ? a[0] + " + 1/" + a[1] : a[0] + " + 1/(" + nest(a.slice(1)) + ")";
  const euclid = (p, q) => { const out = []; while (q) { out.push(`${p} = ${Math.floor(p / q)}·${q}` + (p % q ? ` + ${p % q}` : "")); [p, q] = [q, p % q]; } return out.join("; "); };
  const randCF = (len, maxA = 5, a0max = 3) => { const a = [rnd(0, a0max)]; for (let i = 1; i < len; i++) a.push(rnd(1, maxA)); if (a[len - 1] < 2) a[len - 1] = rnd(2, maxA); return a; };
  const convTable = a => { const P = [], Q = []; for (let i = 0; i < a.length; i++) { P.push(a[i] * (i ? P[i - 1] : 1) + (i > 1 ? P[i - 2] : i ? 1 : 0)); Q.push(a[i] * (i ? Q[i - 1] : 0) + (i > 1 ? Q[i - 2] : i ? 0 : 1)); } return [P, Q]; };
  const sqrtCF = (d, len) => { const a0 = Math.floor(Math.sqrt(d)); let m = 0, dd = 1, a = a0; const out = [a0]; while (out.length < len) { m = dd * a - m; dd = (d - m * m) / dd; a = Math.floor((a0 + m) / dd); out.push(a); } return out; };
  const NONSQ = []; for (let d = 2; d <= 40; d++) if (Math.sqrt(d) % 1) NONSQ.push(d);

  const levels = [
    { id: "tip", ad: "Sonlu, yoxsa dövri?", izah: "Kəsri ixtisar et. Məxrəcdə yalnız 2 və 5 qalırsa — sonlu, vergüldən sonra max(a, b) rəqəm. Başqa sadə vuruq varsa — dövri.",
      gen() {
        const kind = pick(["fin", "pre", "count"]);
        if (kind === "fin") {
          let a, b; do { a = rnd(0, 5); b = rnd(0, 4); } while (a + b === 0 || 2 ** a * 5 ** b > 1000);
          const n0 = 2 ** a * 5 ** b; let m0 = rnd(1, 3 * n0); while (gcd(m0, n0) !== 1) m0 = rnd(1, 3 * n0);
          const k = pick([1, 1, 3, 7, 9]), m = m0 * k, n = n0 * k, e = expand(m, n), ans = e.pre.length;
          return { text: `${m}/${n} kəsri sonlu onluq kəsrə çevrilir. Vergüldən sonra neçə rəqəm olacaq?`, answer: ans, show: String(ans), tol: 0.01,
            solution: (k > 1 ? `Əvvəl ixtisar: ${m}/${n} = ${m0}/${n0}. ` : "") + `${n0} = ${p25(a, b)}. Vergüldən sonra max(${a}, ${b}) = ${ans} rəqəm: ${m0}/${n0} = ${dec(e)}.` };
        }
        if (kind === "pre") {
          let a, b; do { a = rnd(0, 3); b = rnd(0, 2); } while (a + b === 0);
          const t = pick([3, 7, 9, 11, 13, 37]), n = 2 ** a * 5 ** b * t; let m = rnd(1, n - 1); while (gcd(m, n) !== 1) m = rnd(1, n - 1);
          const e = expand(m, n), ask = pick(["pre", "per"]), ans = ask === "pre" ? e.pre.length : e.per.length;
          return { text: `${m}/${n} kəsri qarışıq dövri onluq kəsrdir. ${ask === "pre" ? "Vergüldən sonra dövrə qədər neçə rəqəm var?" : "Dövrün uzunluğu (dövrdəki rəqəmlərin sayı) neçədir?"}`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${n} = ${p25(a, b)} · ${t}. ` + (ask === "pre" ? `Dövrə qədər max(${a}, ${b}) = ${ans} rəqəm` : `Dövrün uzunluğu 2 və 5-dən təmizlənmiş hissəyə (${t}) görə: 10ᵏ ≡ 1 (mod ${t}) olan ən kiçik k = ${ans}`) + `. Həqiqətən: ${m}/${n} = ${dec(e)}.` };
        }
        const fr = []; while (fr.length < 5) { const n = rnd(3, 64), m = rnd(1, n - 1); if (!fr.some(x => x[0] * n === m * x[1])) fr.push([m, n]); }
        const info = fr.map(([m, n]) => { const g = gcd(m, n), q = n / g, fin = strip(q)[0] === 1; return { s: `${m}/${n}`, r: frac(m, n), q, fin }; });
        const ans = info.filter(x => x.fin).length;
        return { text: `Bu kəsrlərdən neçəsi sonlu onluq kəsrə çevrilir? ${fr.map(x => x[0] + "/" + x[1]).join(";  ")}`, answer: ans, show: String(ans), tol: 0.01,
          solution: info.map(x => `${x.s}${x.r !== x.s ? " = " + x.r : ""}: məxrəc ${x.q} → ${x.fin ? "sonlu" : "dövri"}`).join("; ") + `. Sonlu olanlar: ${ans}.` };
      } },
    { id: "dovr", ad: "Dövrün uzunluğu və N-ci rəqəm", izah: "1/n-in dövrü (n — 2 və 5-ə bölünmür) 10ᵏ ≡ 1 (mod n) olan ən kiçik k-dır; k ədədi φ(n)-in bölənidir. N-ci rəqəm üçün N-i dövrün uzunluğuna böl.",
      gen() {
        const n = pick(PERN), k = ord10(n);
        if (Math.random() < .5) {
          const two = Math.random() < .35, nn = two ? n * pick([2, 4, 5, 8]) : n; let m = rnd(1, nn - 1); while (gcd(m, nn) !== 1) m = rnd(1, nn - 1);
          const e = expand(m, nn);
          return { text: `${m}/${nn} kəsrini dövri onluq kəsr kimi yazanda dövrün uzunluğu neçə olur?`, answer: k, show: String(k), tol: 0.01,
            solution: (two ? `${nn} = ${nn / n} · ${n}; 2 və 5 vuruqları yalnız dövrə qədərki hissəyə təsir edir, dövr ${n} ədədindən asılıdır. ` : "") + ordWhy(n) + ` Yoxla: ${m}/${nn} = ${dec(e)}.` };
        }
        let m = rnd(1, n - 1); while (gcd(m, n) !== 1) m = rnd(1, n - 1);
        const N = rnd(20, 2026), e = expand(m, n), s = N % k, pos = s === 0 ? k : s, digit = +e.per[pos - 1];
        return { text: `${m}/${n} kəsrini onluq kəsr kimi yazırıq. Vergüldən sonrakı rəqəmləri 1, 2, 3, … deyə nömrələyək. ${N} nömrəli rəqəm hansıdır?`, answer: digit, show: String(digit), tol: 0.01,
          solution: `${m}/${n} = ${dec(e)}, dövr "${e.per}" (uzunluğu ${k}), dövr vergüldən dərhal başlayır. ${N} = ${k}·${Math.floor(N / k)} + ${s}` + (s === 0 ? `, qalıq 0 — dövrün sonuncu rəqəmi` : ` → dövrün ${s} nömrəli rəqəmi`) + `: ${digit}.` };
      } },
    { id: "cevir", ad: "Dövri kəsr → adi kəsr", izah: "0,(ab) = ab/99. 0,a(bc) = (abc − a)/990: surətdə — vergüldən sonra dövrün sonuna qədər olan ədəd çıx dövrə qədərki ədəd; məxrəcdə dövr qədər 9, dövrə qədərki hissə qədər 0.",
      gen() {
        let w, A, B, p, q;
        for (;;) {
          w = pick([0, 0, 0, 1, 2, 3]); const l1 = pick([0, 0, 1, 1, 2]), l2 = l1 ? rnd(1, 2) : rnd(1, 3);
          A = l1 ? String(rnd(0, 10 ** l1 - 1)).padStart(l1, "0") : ""; B = String(rnd(1, 10 ** l2 - 2)).padStart(l2, "0");
          const num = +(A + B) - (A ? +A : 0), den = (10 ** l2 - 1) * 10 ** l1; p = w * den + num; q = den;
          const g = gcd(p, q); p /= g; q /= g;
          const e = expand(p, q); if (e.pre === A && e.per === B && q > 1) break;
        }
        const s = `${w},${A}(${B})`, l1 = A.length, l2 = B.length, num = +(A + B) - (A ? +A : 0), den = (10 ** l2 - 1) * 10 ** l1;
        const how = `0,${A}(${B}) = ${A ? `(${+(A + B)} − ${+A})/${den} = ` : ""}${num}/${den}` + (gcd(num, den) > 1 ? ` = ${frac(num, den)}` : "") + (w ? `; ${s} = ${w} + ${frac(num, den)} = ${p}/${q}` : "");
        if (Math.random() < .35) return { text: `${s} dövri kəsrini ixtisarolunmaz adi kəsr p/q şəklində yaz. p + q = ?`, answer: p + q, show: String(p + q), tol: 0.01,
          solution: `${how}. p + q = ${p} + ${q} = ${p + q}.` };
        return { text: `${s} dövri kəsrini adi kəsr şəklində yaz.`, answer: p / q, show: `${p}/${q}`, tol: EXACT, placeholder: "məs. 4/11",
          solution: `${how}.` };
      } },
    { id: "zencir", ad: "Zəncirvari kəsr", izah: "p/q → [a₀; a₁, a₂, …]: Evklid alqoritminin qismətləri. Geri: sondan başlayıb 'ədəd + 1/…' hesabla.",
      gen() {
        const kind = pick(["ai", "len", "val", "val", "x"]);
        const a = randCF(rnd(3, 5)), [p, q] = cfVal(a);
        if (kind === "ai" || kind === "len") {
          if (kind === "len") return { text: `${p}/${q} kəsrini zəncirvari kəsrə ayır: [a₀; a₁, …, aₙ] (son element 1-dən böyükdür). Bütün elementlərin cəmi neçədir?`, answer: a.reduce((s, x) => s + x, 0), show: String(a.reduce((s, x) => s + x, 0)), tol: 0.01,
            solution: `Evklid alqoritmi: ${euclid(p, q)}. Qismətlər: ${cfStr(a)}. Cəm: ${a.join(" + ")} = ${a.reduce((s, x) => s + x, 0)}.` };
          const i = rnd(1, a.length - 2);
          return { text: `${p}/${q} = [a₀; a₁, a₂, …] zəncirvari kəsrinin a${sub(i)} elementi neçədir?`, answer: a[i], show: String(a[i]), tol: 0.01,
            solution: `Evklid alqoritmi: ${euclid(p, q)}. Qismətlər: ${cfStr(a)}, deməli a${sub(i)} = ${a[i]}.` };
        }
        if (kind === "val") return { text: `Zəncirvari kəsrin qiymətini adi kəsr kimi tap: ${cfStr(a)} = ${nest(a)}`, answer: p / q, show: `${p}/${q}`, tol: EXACT, placeholder: "məs. 43/30",
          solution: `Sondan başlayırıq: ` + (() => { const st = []; let P = a[a.length - 1], Q = 1; for (let i = a.length - 2; i >= 0; i--) { const nP = a[i] * P + Q; st.push(`${a[i]} + ${Q}/${P} = ${nP}/${P}`); [P, Q] = [nP, P]; } return st.join(" → "); })() + `. Cavab: ${p}/${q}.` };
        const b = a.slice(0, 3); if (b[0] < 1) b[0] = rnd(1, 3); if (b[2] < 2) b[2] = rnd(2, 6); const [pp, qq] = cfVal(b);
        return { text: `${b[0]} + 1/(${b[1]} + 1/x) = ${pp}/${qq}. x natural ədəddir. x = ?`, answer: b[2], show: String(b[2]), tol: 0.01,
          solution: `${pp}/${qq} = ${b[0]} + ${pp - b[0] * qq}/${qq} → ${b[1]} + 1/x = ${qq}/${pp - b[0] * qq} = ${b[1]} + ${qq - b[1] * (pp - b[0] * qq)}/${pp - b[0] * qq} → 1/x = 1/${b[2]}, x = ${b[2]}.` };
      } },
    { id: "kok", ad: "√d və yaxınlaşanlar", izah: "√d = [a₀; a₁, a₂, …] (elementlər dövri təkrarlanır). Yaxınlaşanlar: Pₖ = aₖ·Pₖ₋₁ + Pₖ₋₂, Qₖ = aₖ·Qₖ₋₁ + Qₖ₋₂; P₋₁ = 1, Q₋₁ = 0.",
      gen() {
        const d = pick(NONSQ), kind = pick(["a", "conv", "conv", "pell"]), n = rnd(2, 4), a = sqrtCF(d, n + 1), [P, Q] = convTable(a);
        const table = `√${d} = [${a[0]}; ${a.slice(1).join(", ")}, …]. ` + a.map((x, i) => `P${sub(i)}/Q${sub(i)} = ${P[i]}/${Q[i]}`).join(", ");
        if (kind === "a") { const i = rnd(1, 3), b = sqrtCF(d, 4);
          return { text: `√${d} ədədini zəncirvari kəsrə ayır: √${d} = [a₀; a₁, a₂, a₃, …]. a${sub(i)} = ?`, answer: b[i], show: String(b[i]), tol: 0.01,
            solution: `a₀ = ${b[0]} (${b[0]}² < ${d} < ${b[0] + 1}²). Addımlar: x = √${d} → tam hissəni at → 1/(qalıq) → yenə tam hissə. Alınır: √${d} = [${b[0]}; ${b.slice(1).join(", ")}, …], a${sub(i)} = ${b[i]}.` }; }
        if (kind === "conv") return { text: `√${d} = [${a[0]}; ${sqrtCF(d, 6).slice(1).join(", ")}, …]. P${sub(n)}/Q${sub(n)} yaxınlaşanını tap (P₀/Q₀ = ${a[0]}/1).`, answer: P[n] / Q[n], show: `${P[n]}/${Q[n]}`, tol: EXACT, placeholder: "məs. 17/12",
          solution: `${table}. Cavab: ${P[n]}/${Q[n]} ≈ ${(P[n] / Q[n]).toFixed(5).replace(".", ",")}, √${d} ≈ ${Math.sqrt(d).toFixed(5).replace(".", ",")}.` };
        const v = P[n] * P[n] - d * Q[n] * Q[n];
        return { text: `√${d} = [${a[0]}; ${sqrtCF(d, 6).slice(1).join(", ")}, …]. P${sub(n)}/Q${sub(n)} yaxınlaşanı üçün P${sub(n)}² − ${d}·Q${sub(n)}² ifadəsinin qiymətini tap.`, answer: v, show: v < 0 ? "−" + (-v) : String(v), tol: 0.01,
          solution: `${table}. ${P[n]}² − ${d}·${Q[n]}² = ${P[n] * P[n]} − ${d * Q[n] * Q[n]} = ${v < 0 ? "−" + (-v) : v}.` };
      } },
    { id: "heyat", ad: "Həyatdan: kağız kəsmə", izah: "Düzbucaqlıdan hər dəfə ən böyük kvadratı kəsmək — Evklid alqoritmidir. Kvadratların sayı = zəncirvari kəsr elementlərinin cəmi, ən kiçik kvadratın tərəfi = ƏBOB.",
      gen() {
        let a, g, p, q; do { a = randCF(rnd(2, 4), 4, 3); a[0] = rnd(1, 3); g = rnd(1, 6); [p, q] = cfVal(a); p *= g; q *= g; } while (p > 240 || q < 5);
        const ask = pick(["count", "count", "side"]), cnt = a.reduce((s, x) => s + x, 0);
        const steps = (() => { const out = []; let x = p, y = q; while (y) { out.push(`${x}×${y}: ${Math.floor(x / y)} ədəd ${y}×${y} kvadrat`); [x, y] = [y, x % y]; } return out.join("; "); })();
        return { text: `${p} sm × ${q} sm ölçülü kağızdan hər dəfə mümkün olan ən böyük kvadratı kəsirlər, qalan düzbucaqlı ilə də belə davam edirlər, kağız bitənə qədər. ` + (ask === "count" ? "Cəmi neçə kvadrat alınacaq?" : "Ən kiçik kvadratın tərəfi neçə sm olacaq?"),
          answer: ask === "count" ? cnt : g, unit: ask === "count" ? undefined : "sm", show: String(ask === "count" ? cnt : g), tol: 0.01,
          solution: `${steps}. ` + (ask === "count" ? `Bu, Evklid alqoritmidir: ${p}/${q} = ${cfStr(a)}, kvadratların sayı ${a.join(" + ")} = ${cnt}.` : `Son kvadratın tərəfi ƏBOB(${p}, ${q}) = ${g} sm.`) };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "x = 0,a(bc): 10x və 1000x dövrü eyni yerdən başladır, çıxanda dövr yox olur.",
      gen() {
        let a, b, c; do { a = rnd(1, 9); b = rnd(0, 9); c = rnd(0, 9); } while (b === c || a === c);
        const N = 100 * a + 10 * b + c - a, g = gcd(N, 990), right = frac(N, 990);
        const steps = [
          `10x = ${a},(${b}${c}) və 1000x = ${a}${b}${c},(${b}${c}).`,
          `1000x − 10x = 990x = ${a}${b}${c} − ${a} = ${N}.`,
          g > 1 ? `x = ${N}/990 = ${right}.` : `x = ${N}/990, kəsr ixtisar olunmur.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `10x = ${a},(${b}${c}) və 100x = ${a}${b}${c},(${b}${c}).`;
        if (bad === 1) steps[1] = `1000x − 10x = 990x = ${a}${b}${c} − ${10 * b + c} = ${100 * a}.`;
        let wrong = frac(N, 900); if (wrong === right) wrong = frac(N + 1, 990);
        if (bad === 2) steps[2] = `x = ${N}/990 = ${g > 1 ? frac(N, 990).replace(/\/\d+$/, "/" + (990 / g + 10)) : wrong}.`;
        const text = h("div", {}, h("p", {}, `Elvin x = 0,${a}(${b}${c}) dövri kəsrini adi kəsrə çevirir. Hansı addımda səhv var?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: 100x = ${a}${b},${c}(${b}${c}) olur, dövr vergüldən dərhal başlamır. Lazım olan 1000x = ${a}${b}${c},(${b}${c}).`,
          `2-ci addım: ${a}${b}${c},(${b}${c}) − ${a},(${b}${c}) = ${a}${b}${c} − ${a} = ${N}, dövrü yox, dövrə qədərki hissəni çıxırıq.`,
          `3-cü addım: ${N}/990 kəsri ${g > 1 ? `ƏBOB = ${g} ilə ixtisar olunur: ${right}` : `ixtisar olunmur, cavab ${right}`}.`][bad];
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
      key: "ol-dovri-zencirvari", title: "Dövri və zəncirvari kəsrlər", fenn: "riyaziyyat", link: "dersler/ol-dovri-zencirvari.html",
      format: "Cavab ədəddir: say (3), rəqəm (7), kəsr (4/11). Adi kəsr soruşulanda onluq yaxınlaşma qəbul olunmur — kəsri dəqiq yaz.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["tip", "dovr", "dovr", "cevir", "cevir", "zencir", "zencir", "kok", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-dovri-zencirvari.html")) b.push("dersler/ol-dovri-zencirvari.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
