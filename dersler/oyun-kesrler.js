// Kəsrlər — adi, onluq və dövri kəsrlər: əməllər, müqayisə, çevirmə, hissə məsələləri. Mastery levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
// Rationals are kept exact as [numerator, denominator]; "show" is always in lowest terms.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const lcm = (a, b) => a / gcd(a, b) * b;
  // Azerbaijani case suffixes after a numeral, by the last spoken word (3-ə, 6-ya, 9-un, 40-dan, 7-ci)
  const W = n => { if (n === 0) return "sıfır"; if (n % 1000 === 0) return "min"; if (n % 100 === 0) return "yüz"; if (n % 10 === 0) return ["", "on", "iyirmi", "otuz", "qırx", "əlli", "altmış", "yetmiş", "səksən", "doxsan"][(n / 10) % 10]; return ["", "bir", "iki", "üç", "dörd", "beş", "altı", "yeddi", "səkkiz", "doqquz"][n % 10]; };
  const VW = "aıoueəiöü";
  const sfx = (n, kind) => { const w = W(Math.abs(n)), vs = [...w].filter(c => VW.includes(c)), v = vs[vs.length - 1], endV = VW.includes(w[w.length - 1]), back = "aıou".includes(v);
    const four = "aı".includes(v) ? "ı" : "ou".includes(v) ? "u" : "eəi".includes(v) ? "i" : "ü";
    return n + "-" + ({ a: (endV ? "y" : "") + (back ? "a" : "ə"), in: (endV ? "n" : "") + four + "n", i: (endV ? "n" : "") + four, dan: back ? "dan" : "dən", ci: "c" + four })[kind]; };
  const Gn = n => sfx(n, "in"), Or = n => sfx(n, "ci");

  // ---- exact rationals
  const R = (n, d) => { if (d < 0) { n = -n; d = -d; } const g = gcd(Math.abs(n), d) || 1; return [n / g, d / g]; };
  const add = (a, b) => R(a[0] * b[1] + b[0] * a[1], a[1] * b[1]);
  const sub = (a, b) => R(a[0] * b[1] - b[0] * a[1], a[1] * b[1]);
  const mul = (a, b) => R(a[0] * b[0], a[1] * b[1]);
  const div = (a, b) => R(a[0] * b[1], a[1] * b[0]);
  const val = r => r[0] / r[1];
  const S = r => (r[0] < 0 ? "−" : "") + (r[1] === 1 ? Math.abs(r[0]) : Math.abs(r[0]) + "/" + r[1]);
  const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹", SUB = "₀₁₂₃₄₅₆₇₈₉";
  const sup = n => String(n).split("").map(c => SUP[+c]).join(""), sub_ = n => String(n).split("").map(c => SUB[+c]).join("");
  const MX = r => { const w = Math.floor(r[0] / r[1]), m = r[0] - w * r[1]; return w && m ? w + sup(m) + "⁄" + sub_(r[1]) : S(r); }; // 7/3 → 2⅓ style
  const dec = r => { // finite decimal string with comma (denominator only 2s and 5s)
    let [n, d] = r, k = 0; while (10 ** k % d !== 0) k++;
    n = n * (10 ** k / d);
    const s = String(Math.abs(n)).padStart(k + 1, "0"); return (n < 0 ? "−" : "") + (k ? s.slice(0, -k) + "," + s.slice(-k) : s);
  };
  const finite = d => { while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5; return d === 1; };
  const EX = 1e-9; // exact answers only (0,58 is not 7/12)

  // a/b ± c/d written out with the common denominator
  const addSteps = (x, y, op) => {
    const L = lcm(x[1], y[1]), p = x[0] * L / x[1], q = y[0] * L / y[1], n = op === "+" ? p + q : p - q, r = R(n, L);
    return `${S(x)} ${op} ${S(y)} = ${p}/${L} ${op} ${q}/${L} = ${n}/${L}` + (r[1] !== L ? ` = ${S(r)}` : "");
  };
  const mulSteps = (x, y) => { const n = x[0] * y[0], d = x[1] * y[1], r = R(n, d); return `${S(x)} · ${S(y)} = ${n}/${d}` + (r[1] !== d ? ` = ${S(r)}` : ""); };
  const divSteps = (x, y) => `${S(x)} : ${S(y)} = ${S(x)} · ${y[1]}/${y[0]} = ` + mulSteps(x, [y[1], y[0]]).split(" = ").slice(1).join(" = ");
  const properFrac = (dmin, dmax) => { const d = rnd(dmin, dmax), n = rnd(1, d - 1), r = R(n, d); return r[1] === 1 ? [1, d] : r; };

  const levels = [
    { id: "emel", ad: "Kəsrlərlə əməllər", izah: "Toplama və çıxma — ortaq məxrəclə; vurma — surət surətə, məxrəc məxrəcə; bölmə — tərsinə vur. Cavabı ixtisar et.",
      gen() {
        const kind = pick(["add", "sub", "mul", "div", "mixAdd", "mixSub", "mixMul", "combo"]);
        if (kind === "add" || kind === "sub") {
          let x, y; do { x = properFrac(2, 12); y = properFrac(2, 12); } while (x[1] === y[1] || (kind === "sub" && val(x) <= val(y)));
          const op = kind === "add" ? "+" : "−", r = kind === "add" ? add(x, y) : sub(x, y);
          return { text: `${S(x)} ${op} ${S(y)} = ?`, answer: val(r), show: S(r), tol: EX, placeholder: "məs. 7/12",
            solution: `Ortaq məxrəc ƏKOB(${x[1]}; ${y[1]}) = ${lcm(x[1], y[1])}. ` + addSteps(x, y, op === "+" ? "+" : "−") + "." };
        }
        if (kind === "mul" || kind === "div") {
          const x = properFrac(2, 15), y = properFrac(2, 15), r = kind === "mul" ? mul(x, y) : div(x, y);
          return { text: `${S(x)} ${kind === "mul" ? "·" : ":"} ${S(y)} = ?`, answer: val(r), show: S(r), tol: EX, placeholder: "məs. 7/12",
            solution: (kind === "mul" ? mulSteps(x, y) : divSteps(x, y)) + "." };
        }
        const mixed = () => { const d = rnd(2, 9), m = rnd(1, d - 1), w = rnd(1, 4), r = R(m, d); return R(w * r[1] + r[0], r[1]); };
        if (kind === "mixAdd" || kind === "mixSub") {
          let x, y; do { x = mixed(); y = mixed(); } while (x[1] === y[1] || (kind === "mixSub" && val(x) <= val(y)));
          const op = kind === "mixAdd" ? "+" : "−", r = op === "+" ? add(x, y) : sub(x, y);
          return { text: `${MX(x)} ${op} ${MX(y)} = ?  (cavabı düzgün olmayan kəsr kimi yaz)`, answer: val(r), show: S(r), tol: EX, placeholder: "məs. 17/12",
            solution: `${MX(x)} = ${S(x)}, ${MX(y)} = ${S(y)}. ` + addSteps(x, y, op) + (r[0] > r[1] && r[1] > 1 ? ` = ${MX(r)}.` : ".") };
        }
        if (kind === "mixMul") {
          const x = mixed(), y = mixed(), r = mul(x, y);
          return { text: `${MX(x)} · ${MX(y)} = ?  (cavabı düzgün olmayan kəsr kimi yaz)`, answer: val(r), show: S(r), tol: EX, placeholder: "məs. 25/4",
            solution: `Əvvəl düzgün olmayan kəsrə çevir: ${MX(x)} = ${S(x)}, ${MX(y)} = ${S(y)}. ` + mulSteps(x, y) + ". Tam hissələri ayrıca vurmaq olmaz." };
        }
        // (x + y) : z
        let x, y, z; do { x = properFrac(2, 8); y = properFrac(2, 8); z = properFrac(2, 9); } while (x[1] === y[1]);
        const s = add(x, y), r = div(s, z);
        return { text: `(${S(x)} + ${S(y)}) : ${S(z)} = ?`, answer: val(r), show: S(r), tol: EX, placeholder: "məs. 7/12",
          solution: `Əvvəl mötərizə: ${addSteps(x, y, "+")}. Sonra bölmə: ${divSteps(s, z)}.` };
      } },
    { id: "muqayise", ad: "Müqayisə", izah: "Ortaq məxrəcə gətir və ya çarpaz vur: a/b > c/d ⇔ a·d > b·c.",
      gen() {
        if (Math.random() < .5) {
          // pick 4 close fractions, find the biggest / smallest
          let fs;
          do {
            fs = []; const seen = new Set();
            while (fs.length < 4) { const d = rnd(3, 15), n = rnd(Math.ceil(d * .4), Math.floor(d * .9)), r = R(n, d); const k = r.join("/"); if (r[1] > 2 && !seen.has(k) && n < d) { seen.add(k); fs.push(r); } }
          } while (Math.max(...fs.map(val)) - Math.min(...fs.map(val)) > .25);
          const big = Math.random() < .5, vals = fs.map(val), t = big ? Math.max(...vals) : Math.min(...vals), ci = vals.indexOf(t);
          return { text: `Bu kəsrlərdən ən ${big ? "böyüyü" : "kiçiyi"} hansıdır?`, choices: fs.map(S), correct: ci, show: S(fs[ci]),
            solution: "Onluğa çevirib müqayisə et: " + fs.map(r => `${S(r)} ≈ ${String(Math.round(val(r) * 1000) / 1000).replace(".", ",")}`).join("; ") + `. Ən ${big ? "böyüyü" : "kiçiyi"} ${S(fs[ci])}.` };
        }
        // a/b < x/n < c/d, count natural x (or the biggest x)
        for (;;) {
          const n = rnd(10, 40), b = rnd(3, 9), d = rnd(3, 9); if (b === d) continue;
          const lo = properFrac(b, b), hi = properFrac(d, d); if (val(lo) >= val(hi) || lo[1] === 1 || hi[1] === 1 || lo[1] === hi[1]) continue;
          const xs = []; for (let x = 1; x < 2 * n; x++) if (x * lo[1] > n * lo[0] && x * hi[1] < n * hi[0]) xs.push(x);
          if (xs.length < 1 || xs.length > 6) continue;
          const askMax = Math.random() < .4, ans = askMax ? Math.max(...xs) : xs.length;
          return { text: `${S(lo)} < x/${n} < ${S(hi)} şərtini ödəyən ${askMax ? "ən böyük natural x ədədini tap" : "neçə natural x var"}?`.replace("tap?", "tap."), answer: ans, show: String(ans), tol: 0.01,
            solution: `x/${n} > ${S(lo)} → x > ${n} · ${S(lo)} = ${S(mul([n, 1], lo))}; x/${n} < ${S(hi)} → x < ${n} · ${S(hi)} = ${S(mul([n, 1], hi))}. Uyğun x: ${xs.join(", ")}` + (askMax ? `; ən böyüyü ${ans}.` : ` — ${ans} ədəd.`) };
        }
      } },
    { id: "onluq", ad: "Onluq kəsrlər", izah: "Onluq ↔ adi çevirmə, sonlu onluq kəsr, yuvarlaqlaşdırma, birgə əməllər.",
      gen() {
        const kind = pick(["toFrac", "finite", "round", "mix", "mix"]);
        if (kind === "toFrac") {
          let r; do { const d = pick([4, 8, 20, 25, 40, 50, 125, 16, 200, 250]), n = rnd(1, 3 * d); r = R(n, d); } while (r[1] < 4 || !finite(r[1]));
          const ask = pick(["sum", "den"]), ds = dec(r), [k] = [ds.split(",")[1].length];
          const ten = 10 ** k, raw = Math.round(val(r) * ten);
          const ans = ask === "sum" ? r[0] + r[1] : r[1];
          return { text: `${ds} onluq kəsrini ixtisar olunmaz adi kəsr şəklində yaz. ${ask === "sum" ? "Surəti ilə məxrəcinin cəmini tap." : "Məxrəci neçədir?"}`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${ds} = ${raw}/${ten} = ${S(r)}` + (ask === "sum" ? `; ${r[0]} + ${r[1]} = ${ans}.` : `; məxrəc ${r[1]}.`) };
        }
        if (kind === "finite") {
          // one fraction gives a finite decimal (often only after reducing), three do not
          const good = (() => { for (;;) { const d0 = pick([4, 5, 8, 16, 20, 25, 40]), k = pick([3, 3, 7, 9, 11]), n0 = rnd(1, d0 - 1); if (gcd(n0, d0) === 1 && gcd(n0, k) === 1) return [n0 * k, d0 * k]; } })();
          const bads = []; while (bads.length < 3) { const d = pick([6, 12, 14, 15, 18, 22, 24, 30, 35, 45, 48]), n = rnd(1, d - 1), r = R(n, d); if (!finite(r[1]) && !bads.some(b => b[0] === n && b[1] === d)) bads.push([n, d]); }
          const ch = shuffle([good, ...bads]), ci = ch.indexOf(good), gr = R(good[0], good[1]);
          return { text: "Bu kəsrlərdən hansı sonlu onluq kəsrə çevrilir?", choices: ch.map(f => f[0] + "/" + f[1]), correct: ci, show: good[0] + "/" + good[1],
            solution: `Əvvəl ixtisar et, sonra məxrəcə bax: yalnız 2 və 5 vuruqları olmalıdır. ${good[0]}/${good[1]} = ${S(gr)} = ${dec(gr)}. ` + bads.map(b => { const r = R(b[0], b[1]); return `${b[0]}/${b[1]}` + (r[1] !== b[1] ? ` = ${S(r)}` : "") + ` — məxrəcdə ${r[1] % 3 === 0 ? 3 : r[1] % 7 === 0 ? 7 : 11} var`; }).join("; ") + "." };
        }
        if (kind === "round") {
          const place = pick([1, 2, 3]), digs = place + rnd(1, 2), whole = rnd(0, 30), fracInt = rnd(0, 10 ** digs - 1);
          const s = String(fracInt).padStart(digs, "0"); const n = whole * 10 ** digs + fracInt; // value = n / 10^digs
          const down = Math.floor(n / 10 ** (digs - place)), next = +s[place], up = next >= 5 ? down + 1 : down, ans = up / 10 ** place;
          const name = ["", "onda birlərə", "yüzdə birlərə", "mində birlərə"][place];
          const shown = (x => { const t = String(x).padStart(place + 1, "0"); return t.slice(0, -place) + "," + t.slice(-place); })(up);
          return { text: `${whole},${s} ədədini ${name} qədər yuvarlaqlaşdır.`, answer: ans, show: shown, tol: EX, placeholder: "məs. 2,35",
            solution: `${name.replace(/ə$/, "")}: vergüldən sonra ${place} rəqəm saxla. Ondan sonrakı rəqəm ${next} ${next >= 5 ? "≥ 5, son saxlanan rəqəm 1 artır" : "< 5, olduğu kimi qalır"}: ${shown}.` };
        }
        // mixed operations: decimal ± fraction · decimal, or (decimal + fraction) : decimal
        const DEC = [[1, 4], [1, 2], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [6, 5], [3, 2], [5, 4], [1, 8], [3, 8], [7, 4], [9, 10], [3, 10], [7, 10], [12, 5], [5, 2]];
        for (;;) {
          const a = R(...pick(DEC)), b = properFrac(2, 9), c = R(...pick(DEC));
          if (Math.random() < .5) {
            const r = add(a, mul(b, c)); if (r[1] > 60) continue;
            return { text: `${dec(a)} + ${S(b)} · ${dec(c)} = ?`, answer: val(r), show: S(r), tol: EX, placeholder: "məs. 7/10 və ya 0,7",
              solution: `Əvvəl vurma: ${dec(c)} = ${S(c)}, ${mulSteps(b, c)}. ${dec(a)} = ${S(a)}; ${addSteps(a, mul(b, c), "+")}.` + (finite(r[1]) && r[1] > 1 ? ` (= ${dec(r)})` : "") };
          }
          const s = add(a, b), r = div(s, c); if (r[1] > 60) continue;
          return { text: `(${dec(a)} + ${S(b)}) : ${dec(c)} = ?`, answer: val(r), show: S(r), tol: EX, placeholder: "məs. 7/10 və ya 0,7",
            solution: `${dec(a)} = ${S(a)}, ${dec(c)} = ${S(c)}. Mötərizə: ${addSteps(a, b, "+")}. Bölmə: ${divSteps(s, c)}.` + (finite(r[1]) && r[1] > 1 ? ` (= ${dec(r)})` : "") };
        }
      } },
    { id: "dovri", ad: "Dövri kəsrlər", izah: "Dövri kəsri adi kəsrə çevir; dövrdə n-ci rəqəmi tap.",
      gen() {
        if (Math.random() < .35) {
          // n-th digit after the comma of p/q, q coprime to 10 (pure period)
          const q = pick([7, 11, 13, 27, 37, 41, 33, 21]); let p; do { p = rnd(1, q - 1); } while (gcd(p, q) !== 1);
          let r = p % q, period = ""; do { r *= 10; period += Math.floor(r / q); r %= q; } while (r !== p % q);
          const L = period.length, n = rnd(L + 4, 99), pos = n % L === 0 ? L : n % L, d = +period[pos - 1];
          return { text: `${p}/${q} kəsrinin onluq yazılışında vergüldən sonra ${Or(n)} rəqəm hansıdır?`, answer: d, show: String(d), tol: 0.01,
            solution: `${p}/${q} = 0,(${period}) — dövrdə ${L} rəqəm var. ${n} = ${L} · ${Math.floor((n - 1) / L)} + ${pos}, deməli bu, dövrün ${Or(pos)} rəqəmidir: ${d}.` };
        }
        for (;;) {
          const I = pick([0, 0, 0, 1, 2, 3]), k = pick([0, 0, 1, 1, 2]), m = k === 2 ? 1 : pick([1, 2, 2]);
          const P = Array.from({ length: k }, () => rnd(0, 9)).join(""), Q = Array.from({ length: m }, () => rnd(0, 9)).join("");
          if (/^9+$/.test(Q) || /^0+$/.test(Q)) continue;                 // 0,(9) = 1 and 0,(0) are not real periods
          if (m === 2 && Q[0] === Q[1]) continue;                          // 0,(33) → write 0,(3)
          if (k && P[k - 1] === Q[m - 1]) continue;                        // 0,3(3) → write 0,(3)
          const all = +(String(I) + P + Q), head = +(String(I) + P), den = (10 ** m - 1) * 10 ** k, r = R(all - head, den);
          if (r[1] === 1) continue;
          const shown = `${I},${P}(${Q})`, ask = pick(["frac", "sum", "den"]);
          const how = `${shown} = ` + (head ? `(${all} − ${head})/${den} = ` : "") + `${all - head}/${den}` + (r[1] !== den ? ` = ${S(r)}` : "") +
            `. (Məxrəc: dövrdə ${m} rəqəm → ${"9".repeat(m)}` + (k ? `, dövrdən əvvəl ${k} rəqəm → ${"0".repeat(k)}` : "") + ".)";
          if (ask === "frac") return { text: `${shown} dövri kəsrini adi kəsrə çevir (cavabı adi kəsr kimi yaz).`, answer: val(r), show: S(r), tol: EX, placeholder: "məs. 5/11", solution: how };
          if (ask === "sum") return { text: `${shown} ədədini ixtisar olunmaz adi kəsr şəklində yaz. Surəti ilə məxrəcinin cəmini tap.`, answer: r[0] + r[1], show: String(r[0] + r[1]), tol: 0.01, solution: how + ` ${r[0]} + ${r[1]} = ${r[0] + r[1]}.` };
          return { text: `${shown} ədədini ixtisar olunmaz adi kəsr şəklində yaz. Məxrəci neçədir?`, answer: r[1], show: String(r[1]), tol: 0.01, solution: how };
        }
      } },
    { id: "hisse", ad: "Hissə məsələləri", izah: "Ədədin hissəsi — vur; hissəsinə görə ədəd — böl.",
      gen() {
        const kind = pick(["of", "from", "from", "diff", "what"]);
        const f = properFrac(2, 12);
        if (kind === "of") {
          const N = f[1] * rnd(2, 15), ans = N * f[0] / f[1];
          return { text: `${N} ədədinin ${S(f)} hissəsini tap.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Ədədin hissəsi — vurma: ${N} · ${S(f)} = ${N} : ${f[1]} · ${f[0]} = ${ans}.` };
        }
        if (kind === "from") {
          const k = rnd(2, 12), A = f[0] * k, N = f[1] * k, dc = Math.random() < .35 && finite(f[1]);
          const fs = dc ? dec(f) : S(f);
          return { text: `Ədədin ${fs} hissəsi ${sfxDir(A)}. Bu ədədi tap.`, answer: N, show: String(N), tol: 0.01,
            solution: `Hissəsinə görə ədəd — bölmə: ${A} : ${fs}` + (dc ? ` = ${A} : ${S(f)}` : "") + ` = ${A} · ${f[1]}/${f[0]} = ${N}.` };
        }
        if (kind === "diff") {
          let a, b; do { a = properFrac(2, 9); b = properFrac(2, 9); } while (val(a) <= val(b) || a[1] === b[1]);
          const d = sub(a, b), x = lcm(a[1], b[1]) * rnd(1, 6), D = x * d[0] / d[1];
          return { text: `Ədədin ${S(a)} hissəsi onun ${S(b)} hissəsindən ${D} çoxdur. Ədədi tap.`, answer: x, show: String(x), tol: 0.01,
            solution: `${S(a)} − ${S(b)} = ${S(d)}. Deməli, ədədin ${S(d)} hissəsi ${sfxDir(D)}: ${D} : ${S(d)} = ${D} · ${d[1]}/${d[0]} = ${x}.` };
        }
        // what part is a of b
        let a, b; do { b = rnd(12, 120); a = rnd(2, b - 1); } while (gcd(a, b) === 1 || R(a, b)[1] > 30);
        const r = R(a, b);
        return { text: `${a} ədədi ${b} ədədinin hansı hissəsidir? (adi kəsr kimi yaz)`, answer: val(r), show: S(r), tol: EX, placeholder: "məs. 3/8",
          solution: `Hansı hissə — bölmə: ${a}/${b} = ${S(r)}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Mətnli məsələ: \"qalanın\" sözünə diqqət — hissə artıq bütövdən yox, qalandan götürülür.",
      gen() {
        const kind = pick(["book", "money", "road", "pipes", "drain", "class", "tape"]);
        if (kind === "book" || kind === "money" || kind === "road") {
          const a = properFrac(2, 6), c = properFrac(2, 5);
          const k = rnd(1, 5), T = a[1] * c[1] * k, rem1 = T - T * a[0] / a[1], day2 = rem1 * c[0] / c[1], left = rem1 - day2;
          const t = {
            book: `Elvin kitabın ${S(a)} hissəsini birinci gün, qalan səhifələrin ${S(c)} hissəsini ikinci gün oxudu. Oxumağa ${left} səhifə qaldı. Kitab neçə səhifədir?`,
            money: `Aysel pulunun ${S(a)} hissəsini kitaba, qalan pulun ${S(c)} hissəsini dəftərlərə xərclədi. Onun ${left} manatı qaldı. Ayselin əvvəlcə neçə manatı var idi?`,
            road: `Turist yolun ${S(a)} hissəsini birinci gün, qalan yolun ${S(c)} hissəsini ikinci gün getdi. Getməyə ${left} km qaldı. Bütün yol neçə km-dir?`,
          }[kind];
          const r1 = sub([1, 1], a), r2 = mul(r1, sub([1, 1], c));
          return { text: t, answer: T, show: String(T), tol: 0.01,
            solution: `Birincidən sonra qalır 1 − ${S(a)} = ${S(r1)}. İkincidə qalanın ${S(c)} hissəsi getdi, qalır ${S(r1)} · ${S(sub([1, 1], c))} = ${S(r2)}. Deməli, bütövün ${S(r2)} hissəsi ${left}: ${left} : ${S(r2)} = ${T}.` };
        }
        if (kind === "pipes" || kind === "drain") {
          for (;;) {
            const a = rnd(2, 12), b = rnd(2, 15); if (a === b) continue;
            if (kind === "pipes") {
              const r = R(a * b, a + b);
              return { text: `Hovuzu birinci boru ${a} saata, ikinci boru ${b} saata doldurur. İki boru birlikdə boş hovuzu neçə saata doldurar?`, answer: val(r), show: S(r), unit: "saat", tol: EX, placeholder: "məs. 12/7",
                solution: `1 saatda: 1/${a} + 1/${b} = ${S(add([1, a], [1, b]))} hovuz. Vaxt = 1 : ${S(add([1, a], [1, b]))} = ${S(r)} saat.` };
            }
            const fill = Math.min(a, b), drain = Math.max(a, b), r = R(fill * drain, drain - fill), per = sub([1, fill], [1, drain]);
            return { text: `Birinci boru boş hovuzu ${fill} saata doldurur, ikinci boru dolu hovuzu ${drain} saata boşaldır. İkisi birlikdə açıq olsa, boş hovuz neçə saata dolar?`, answer: val(r), show: S(r), unit: "saat", tol: EX, placeholder: "məs. 12/7",
              solution: `1 saatda: 1/${fill} − 1/${drain} = ${S(per)} hovuz dolur. Vaxt = 1 : ${S(per)} = ${S(r)} saat.` };
          }
        }
        if (kind === "class") {
          let f; do { f = properFrac(3, 8); } while (f[0] * 2 === f[1]);
          const N = f[1] * rnd(3, 6), girls = N * f[0] / f[1], boys = N - girls, d = Math.abs(boys - girls);
          return { text: `Sinifdə ${N} şagird var, onların ${S(f)} hissəsi qızdır. Oğlanlar və qızların sayı arasındakı fərq neçədir?`, answer: d, show: String(d), tol: 0.01,
            solution: `Qızlar: ${N} · ${S(f)} = ${girls}. Oğlanlar: ${N} − ${girls} = ${boys}. Fərq: ${d}.` };
        }
        // tape: a decimal part is a decimal length
        const f = pick([[2, 5], [3, 5], [4, 5], [1, 4], [3, 4], [3, 8], [5, 8], [7, 10], [3, 10], [9, 10]]), L = rnd(2, 12), part = L * f[0] / f[1];
        return { text: `Lentin ${S(f)} hissəsinin uzunluğu ${String(part).replace(".", ",")} m-dir. Bütün lent neçə metrdir?`, answer: L, show: String(L), unit: "m", tol: 0.01,
          solution: `Hissəsinə görə ədəd — bölmə: ${String(part).replace(".", ",")} : ${S(f)} = ${String(part).replace(".", ",")} · ${f[1]}/${f[0]} = ${L} m.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Hansında?",
      gen() {
        const kind = pick(["add", "period", "part"]), bad = rnd(0, 2);
        let task, steps, why;
        if (kind === "add") {
          let x, y; do { x = properFrac(2, 9); y = properFrac(2, 9); } while (x[1] === y[1] || x[1] % y[1] === 0 || y[1] % x[1] === 0);
          const L = lcm(x[1], y[1]), p = x[0] * L / x[1], q = y[0] * L / y[1], r = R(p + q, L);
          task = `${S(x)} + ${S(y)} = ?`;
          steps = [`Ortaq məxrəc: ƏKOB(${x[1]}; ${y[1]}) = ${L}.`, `${S(x)} = ${p}/${L}, ${S(y)} = ${q}/${L}.`, `${p}/${L} + ${q}/${L} = ${p + q}/${L}` + (r[1] !== L ? ` = ${S(r)}.` : ".")];
          if (bad === 0) steps[0] = `Ortaq məxrəc: ${x[1]} + ${y[1]} = ${x[1] + y[1]}.`;
          if (bad === 1) steps[1] = `${S(x)} = ${x[0]}/${L}, ${S(y)} = ${y[0]}/${L}.`;
          if (bad === 2) steps[2] = `${p}/${L} + ${q}/${L} = ${p + q}/${2 * L}` + (R(p + q, 2 * L)[1] !== 2 * L ? ` = ${S(R(p + q, 2 * L))}.` : ".");
          why = [`1-ci addımda səhv: ortaq məxrəc məxrəclərin cəmi deyil, ƏKOB-dur: ${L}.`, `2-ci addımda yalnız məxrəc dəyişib, surət də eyni ədədə vurulmalıdır: ${p}/${L} və ${q}/${L}.`, `3-cü addımda məxrəclər də toplanıb. Eyni məxrəcli kəsrlərdə yalnız surətlər toplanır: ${p + q}/${L}` + (r[1] !== L ? ` = ${S(r)}` : "") + "."][bad];
        } else if (kind === "period") {
          let a, b; do { a = rnd(1, 9); b = rnd(1, 8); } while (a === b);
          const n = 10 * a + b - a, r = R(n, 90);
          task = `0,${a}(${b}) dövri kəsrini adi kəsrə çevir.`;
          steps = [`Surət: ${a}${b} − ${a} = ${n}.`, `Məxrəc: dövrdə 1 rəqəm, dövrdən əvvəl 1 rəqəm → 90.`, `${n}/90` + (r[1] !== 90 ? ` = ${S(r)}.` : ".")];
          if (bad === 0) steps[0] = `Surət: ${a}${b} − ${b} = ${10 * a}.`;
          if (bad === 1) steps[1] = `Məxrəc: dövrdə 1 rəqəm, dövrdən əvvəl 1 rəqəm → 99.`;
          if (bad === 2) { const w = R(n, 99); if (w[0] === r[0] && w[1] === r[1]) return this.gen(); steps[2] = `${n}/90 = ${S(w)}.`; }
          why = [`1-ci addımda səhv: dövrə qədər olan hissə (${a}) çıxılmalıdır: ${a}${b} − ${a} = ${n}.`, `2-ci addımda səhv: dövrdəki rəqəm — 9, dövrdən əvvəlki rəqəm — 0 verir: 90, 99 yox.`, `3-cü addımda ixtisar səhvdir: ${n}/90 = ${S(r)}.`][bad];
        } else {
          const f = properFrac(3, 9), k = rnd(2, 9), A = f[0] * k, N = f[1] * k;
          task = `Ədədin ${S(f)} hissəsi ${sfxDir(A)}. Ədədi tap.`;
          steps = [`Ədədi x ilə işarə edək: x · ${S(f)} = ${A}.`, `x = ${A} : ${S(f)} = ${A} · ${f[1]}/${f[0]}.`, `x = ${N}.`];
          if (bad === 0) steps[0] = `Ədədi x ilə işarə edək: x = ${A} · ${S(f)}.`;
          if (bad === 1) steps[1] = `x = ${A} : ${S(f)} = ${A} · ${S(f)}.`;
          if (bad === 2) steps[2] = `x = ${N + f[1]}.`;
          why = [`1-ci addımda tənlik səhv qurulub: ədədin ${S(f)} hissəsi x · ${S(f)}-dir, ona görə x · ${S(f)} = ${A}.`, `2-ci addımda səhv: kəsrə bölmək tərs kəsrə vurmaqdır — ${A} · ${f[1]}/${f[0]}, ${A} · ${S(f)} yox.`, `3-cü addımda hesab səhvdir: ${A} · ${f[1]}/${f[0]} = ${N}.`][bad];
        }
        const text = h("div", {}, h("p", {}, "Məsələ: " + task), h("ol", { class: "oy-steps" }, ...steps.map(s => h("li", {}, s))));
        const names = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: names, correct: bad, show: names[bad], solution: why };
      } },
  ];
  // "24-dür", "15-dir", "30-dur", "40-dır" — copula after a numeral
  function sfxDir(n) { const w = sfx(n, "i"), v = w.slice(-1); return n + "-d" + v + "r"; }

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "kesrler", title: "Kəsrlər", fenn: "riyaziyyat", link: "dersler/kesrler.html",
      format: "Cavab yazmaq: kəsr 7/12 (ixtisar etməsən də qəbul olunur), qarışıq ədədi düzgün olmayan kəsr kimi yaz (2⅓ → 7/3), onluq 0,35 və ya 0.35. Dövri kəsri onluqla yazma — adi kəsr yaz.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["emel", "emel", "muqayise", "onluq", "onluq", "dovri", "dovri", "hisse", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"),
      goGame: () => SkillyTab("oyun"),
      goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/kesrler.html")) b.push("dersler/kesrler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
