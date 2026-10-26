// Ədədi silsilə (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nz = (a, b) => { let x; do { x = rnd(a, b); } while (x === 0); return x; };
  const SUB = "₀₁₂₃₄₅₆₇₈₉", sub = n => String(n).split("").map(d => SUB[+d]).join("");
  const sg = n => n < 0 ? "−" + (-n) : String(n);          // number with a real minus sign
  const par = n => n < 0 ? "(" + sg(n) + ")" : String(n);   // number inside a product
  const pm = n => n < 0 ? " − " + (-n) : " + " + n;          // "+ 3" / "− 3"
  const a_ = k => "a" + sub(k), S_ = k => "S" + sub(k);
  const INT = 0.01;
  const ord = n => { const L = { 1: "ci", 2: "ci", 3: "cü", 4: "cü", 5: "ci", 6: "cı", 7: "ci", 8: "ci", 9: "cu" }, T = { 1: "cu", 2: "ci", 3: "cu", 4: "cı", 5: "ci", 6: "cı", 7: "ci", 8: "ci", 9: "cı" }; return n % 1000 === 0 ? n + "-ci" : n % 100 === 0 ? n + "-cü" : n % 10 ? n + "-" + L[n % 10] : n + "-" + T[(n / 10) % 10]; };   // ordinal suffix by pronunciation
  const seqStr = (a1, d, k) => Array.from({ length: k }, (_, i) => sg(a1 + i * d)).join("; ") + "; …";

  const levels = [
    { id: "an", ad: "n-ci hədd", izah: "aₙ = a₁ + (n − 1)·d. İki hədd verilirsə: aₘ − aₖ = (m − k)·d — əvvəl d-ni tap.",
      gen() {
        const kind = pick(["basic", "list", "two", "two"]);
        const a1 = rnd(-20, 30), d = nz(-9, 9);
        if (kind === "basic" || kind === "list") {
          const n = rnd(12, 80), an = a1 + (n - 1) * d;
          const text = kind === "basic" ? `Ədədi silsilədə ${a_(1)} = ${sg(a1)}, d = ${sg(d)}. ${a_(n)} = ?`
            : `${seqStr(a1, d, 3)} ədədi silsiləsinin ${ord(n)} həddini tap.`;
          return { text, answer: an, show: sg(an), tol: INT,
            solution: (kind === "list" ? `d = ${sg(a1 + d)} − ${par(a1)} = ${sg(d)}. ` : "") + `${a_(n)} = ${sg(a1)} + ${n - 1}·${par(d)} = ${sg(an)}.` };
        }
        let k, m, n; do { k = rnd(1, 20); m = rnd(2, 30); n = rnd(5, 60); } while (k >= m || n === k || n === m);
        const ak = a1 + (k - 1) * d, am = a1 + (m - 1) * d, an = a1 + (n - 1) * d;
        return { text: `Ədədi silsilədə ${a_(k)} = ${sg(ak)}, ${a_(m)} = ${sg(am)}. ${a_(n)} = ?`, answer: an, show: sg(an), tol: INT,
          solution: `${a_(m)} − ${a_(k)} = ${m - k}·d → ${sg(am)} − ${par(ak)} = ${sg(am - ak)}, d = ${sg(d)}. ${a_(n)} = ${a_(k)} + (${n} − ${k})·d = ${sg(ak)} + ${n - k >= 0 ? n - k : "(" + sg(n - k) + ")"}·${par(d)} = ${sg(an)}.` };
      } },
    { id: "nomre", ad: "Hədd nömrəsi", izah: "Nömrəni tapmaq üçün aₙ = a₁ + (n − 1)d bərabərliyindən n-i tap. Saymaq üçün: (son − ilk)/d + 1.",
      gen() {
        const kind = pick(["which", "count", "neg", "mult"]);
        if (kind === "which") {
          const a1 = rnd(-30, 40), d = nz(-12, 12), n = rnd(15, 120), x = a1 + (n - 1) * d;
          return { text: `${sg(x)} ədədi ${seqStr(a1, d, 3)} ədədi silsiləsinin neçənci həddidir?`, answer: n, show: String(n), tol: INT,
            solution: `d = ${sg(d)}. ${sg(a1)} + (n − 1)·${par(d)} = ${sg(x)} → n − 1 = ${sg(x - a1)} : ${par(d)} = ${n - 1}, n = ${n}.` };
        }
        if (kind === "count") {
          const a1 = rnd(-20, 30), d = rnd(2, 9), n = rnd(10, 90), L = a1 + (n - 1) * d;
          return { text: `${sg(a1)}; ${sg(a1 + d)}; ${sg(a1 + 2 * d)}; …; ${sg(L)} sonlu ədədi silsiləsində neçə hədd var?`, answer: n, show: String(n), tol: INT,
            solution: `d = ${d}. Hədlərin sayı: (${sg(L)} − ${par(a1)}) : ${d} + 1 = ${(L - a1) / d} + 1 = ${n}.` };
        }
        if (kind === "neg") {
          let a1, d; do { a1 = rnd(20, 150); d = -rnd(3, 13); } while (a1 % d === 0);
          let n = 1; while (a1 + (n - 1) * d >= 0) n++;
          const ask = pick(["first", "pos"]), ans = ask === "first" ? n : n - 1;
          return { text: `${seqStr(a1, d, 3)} ədədi silsiləsinin ` + (ask === "first" ? "ilk mənfi həddi neçənci həddir?" : "neçə müsbət həddi var?"), answer: ans, show: String(ans), tol: INT,
            solution: `aₙ = ${a1} − ${-d}(n − 1) < 0 → n − 1 > ${a1}/${-d} ≈ ${(a1 / -d).toFixed(2).replace(".", ",")} → n − 1 ≥ ${n - 1}, n ≥ ${n}. ${a_(n - 1)} = ${a1 + (n - 2) * d} > 0, ${a_(n)} = ${sg(a1 + (n - 1) * d)} < 0. ` + (ask === "first" ? `İlk mənfi hədd: ${ord(n)}.` : `Müsbət hədlər: 1-ci … ${ord(n - 1)}, cəmi ${n - 1}.`) };
        }
        const k = rnd(3, 19), A = pick([10, 20, 50, 100, 100, 200]), B = A * pick([3, 5, 10]) + rnd(0, 9);
        const f = Math.ceil(A / k) * k, l = Math.floor(B / k) * k, c = (l - f) / k + 1;
        return { text: `${A} ilə ${B} arasında (hər ikisi daxil) ${k} ədədinə bölünən neçə natural ədəd var?`, answer: c, show: String(c), tol: INT,
          solution: `Belə ədədlər d = ${k} olan ədədi silsilədir: ilk ${f}, son ${l}. Say: (${l} − ${f}) : ${k} + 1 = ${c}.` };
      } },
    { id: "xasse", ad: "Xarakteristik xassə", izah: "aₙ = (aₙ₋₁ + aₙ₊₁)/2. Nömrələrin cəmi bərabərdirsə, hədlərin cəmi də bərabərdir: m + n = k + l → aₘ + aₙ = aₖ + aₗ.",
      gen() {
        const kind = pick(["mid", "sum", "sn", "x", "three"]);
        if (kind === "mid" || kind === "sum" || kind === "sn") {
          const a1 = rnd(-15, 25), d = nz(-6, 6);
          const a = k => a1 + (k - 1) * d;
          if (kind === "mid") {
            const k = rnd(4, 20), j = rnd(1, k - 1), s = a(k - j) + a(k + j);
            return { text: `Ədədi silsilədə ${a_(k - j)} + ${a_(k + j)} = ${sg(s)}. ${a_(k)} = ?`, answer: s / 2, show: sg(s / 2), tol: INT,
              solution: `${k - j} + ${k + j} = 2·${k}, ona görə ${a_(k - j)} + ${a_(k + j)} = 2${a_(k)}. ${a_(k)} = ${sg(s)} : 2 = ${sg(s / 2)}.` };
          }
          if (kind === "sum") {
            let p, q, r, s; do { p = rnd(1, 15); q = rnd(p + 1, 25); r = rnd(1, p + q - 1); s = p + q - r; } while (r === p || r === q || s < 1 || r >= s);
            const v = a(p) + a(q);
            return { text: `Ədədi silsilədə ${a_(p)} + ${a_(q)} = ${sg(v)}. ${a_(r)} + ${a_(s)} = ?`, answer: v, show: sg(v), tol: INT,
              solution: `${p} + ${q} = ${r} + ${s} = ${p + q}. Nömrələrin cəmi bərabərdir → ${a_(r)} + ${a_(s)} = ${a_(p)} + ${a_(q)} = ${sg(v)}.` };
          }
          let p, q; do { p = rnd(1, 12); q = rnd(p + 1, 20); } while ((p + q - 1) < 3);
          const n = p + q - 1, v = a(p) + a(q), S = v * n / 2;
          return { text: `Ədədi silsilədə ${a_(p)} + ${a_(q)} = ${sg(v)}. İlk ${n} həddin cəmi ${S_(n)} = ?`, answer: S, show: sg(S), tol: INT,
            solution: `${S_(n)} = (${a_(1)} + ${a_(n)})·${n}/2. 1 + ${n} = ${p} + ${q}, ona görə ${a_(1)} + ${a_(n)} = ${a_(p)} + ${a_(q)} = ${sg(v)}. ${S_(n)} = ${sg(v)}·${n}/2 = ${sg(S)}.` };
        }
        if (kind === "x") {
          let p1, p2, p3, x, v1, e;
          do { x = nz(-9, 9); p1 = rnd(1, 4); p2 = rnd(1, 5); p3 = rnd(1, 6); v1 = rnd(-15, 15); e = nz(-8, 8); } while (2 * p2 - p1 - p3 === 0);
          const q1 = v1 - p1 * x, q2 = v1 + e - p2 * x, q3 = v1 + 2 * e - p3 * x;
          const ex = (p, q) => (p === 1 ? "" : p) + "x" + (q ? pm(q) : "");
          const A = 2 * p2 - p1 - p3, B = q1 + q3 - 2 * q2;
          return { text: `${ex(p1, q1)};  ${ex(p2, q2)};  ${ex(p3, q3)} — ədədi silsilənin ardıcıl üç həddidir. x = ?`, answer: x, show: sg(x), tol: INT,
            solution: `Orta hədd qonşuların ədədi ortasıdır: 2(${ex(p2, q2)}) = (${ex(p1, q1)}) + (${ex(p3, q3)}) → ${A === 1 ? "" : A === -1 ? "−" : sg(A)}x = ${sg(B)} → x = ${sg(x)}. Hədlər: ${sg(v1)}; ${sg(v1 + e)}; ${sg(v1 + 2 * e)}.` };
        }
        let m, d; do { m = nz(-8, 12); d = rnd(1, 9); } while (d === Math.abs(m));
        const S = 3 * m, P = (m - d) * m * (m + d);
        return { text: `Üç ədəd artan ədədi silsilə təşkil edir. Onların cəmi ${sg(S)}, hasili ${sg(P)} olur. Ən böyük ədədi tap.`, answer: m + d, show: sg(m + d), tol: INT,
          solution: `Ədədləri m − d, m, m + d kimi yaz. Cəm 3m = ${sg(S)} → m = ${sg(m)}. Hasil: ${sg(m)}·(${sg(m * m)} − d²) = ${sg(P)} → d² = ${d * d}, artan → d = ${d}. Ən böyük: ${sg(m)} + ${d} = ${sg(m + d)}.` };
      } },
    { id: "cem", ad: "Sₙ cəmi", izah: "Sₙ = (a₁ + aₙ)·n/2 = (2a₁ + (n − 1)d)·n/2. Hissə cəmi: aₖ + … + aₘ = (aₖ + aₘ)·(m − k + 1)/2.",
      gen() {
        const kind = pick(["basic", "list", "mult", "part"]);
        if (kind === "basic" || kind === "list") {
          const a1 = rnd(-20, 30), d = nz(-7, 9), n = rnd(10, 60), an = a1 + (n - 1) * d, S = (a1 + an) * n / 2;
          const text = kind === "basic" ? `Ədədi silsilədə ${a_(1)} = ${sg(a1)}, d = ${sg(d)}. İlk ${n} həddin cəmini tap.` : `${seqStr(a1, d, 3)} ədədi silsiləsinin ilk ${n} həddinin cəmini tap.`;
          return { text, answer: S, show: sg(S), tol: INT,
            solution: `${a_(n)} = ${sg(a1)} + ${n - 1}·${par(d)} = ${sg(an)}. ${S_(n)} = (${sg(a1)} + ${par(an)})·${n}/2 = ${sg(S)}.` };
        }
        if (kind === "mult") {
          const k = rnd(3, 19); let A, B; do { A = pick([1, 10, 50, 100, 100]); B = pick([100, 200, 300, 500, 999]); } while (B <= A * 2);
          const f = Math.ceil(A / k) * k, l = Math.floor(B / k) * k, c = (l - f) / k + 1, S = (f + l) * c / 2;
          return { text: `${A} ilə ${B} arasında (hər ikisi daxil) ${k} ədədinə bölünən bütün natural ədədlərin cəmini tap.`, answer: S, show: String(S), tol: INT,
            solution: `İlk ${f}, son ${l}, d = ${k}. Say: (${l} − ${f}) : ${k} + 1 = ${c}. Cəm: (${f} + ${l})·${c}/2 = ${S}.` };
        }
        const a1 = rnd(-10, 20), d = nz(-5, 7), k = rnd(3, 15), m = rnd(k + 5, 40), ak = a1 + (k - 1) * d, am = a1 + (m - 1) * d, c = m - k + 1, S = (ak + am) * c / 2;
        return { text: `Ədədi silsilədə ${a_(1)} = ${sg(a1)}, d = ${sg(d)}. ${a_(k)} + ${a_(k + 1)} + … + ${a_(m)} cəmini tap.`, answer: S, show: sg(S), tol: INT,
          solution: `${a_(k)} = ${sg(ak)}, ${a_(m)} = ${sg(am)}, hədlərin sayı ${m} − ${k} + 1 = ${c}. Cəm: (${sg(ak)} + ${par(am)})·${c}/2 = ${sg(S)}.` };
      } },
    { id: "sn", ad: "Sₙ-dən geri", izah: "aₙ = Sₙ − Sₙ₋₁. Sₙ = pn² + qn olarsa, silsilə ədədidir və d = 2p. n-i tapmaq üçün Sₙ düsturundan kvadrat tənlik qur.",
      gen() {
        const kind = pick(["formula", "formula", "findn", "equal"]);
        if (kind === "formula") {
          const p = nz(-4, 5), q = rnd(-9, 9), k = rnd(5, 40), ask = pick(["ak", "d", "a1"]);
          const Sk = p * k * k + q * k, Sk1 = p * (k - 1) * (k - 1) + q * (k - 1), ak = Sk - Sk1;
          const f = `Sₙ = ${p === 1 ? "" : p === -1 ? "−" : sg(p)}n²${q ? pm(q) + "n" : ""}`;
          if (ask === "ak") return { text: `Ədədi silsilənin ilk n həddinin cəmi ${f}. ${a_(k)} = ?`, answer: ak, show: sg(ak), tol: INT,
            solution: `${a_(k)} = ${S_(k)} − ${S_(k - 1)} = ${sg(Sk)} − ${par(Sk1)} = ${sg(ak)}. (Ümumi: aₙ = ${sg(2 * p)}n${pm(q - p)}.)` };
          if (ask === "d") return { text: `Ədədi silsilənin ilk n həddinin cəmi ${f}. Silsilənin fərqi d = ?`, answer: 2 * p, show: sg(2 * p), tol: INT,
            solution: `${a_(1)} = ${S_(1)} = ${sg(p + q)}, ${S_(2)} = ${sg(4 * p + 2 * q)}, ${a_(2)} = ${S_(2)} − ${S_(1)} = ${sg(3 * p + q)}. d = ${a_(2)} − ${a_(1)} = ${sg(2 * p)} (həmişə d = 2p).` };
          return { text: `Ədədi silsilənin ilk n həddinin cəmi ${f}. ${a_(1)} = ?`, answer: p + q, show: sg(p + q), tol: INT,
            solution: `${a_(1)} = ${S_(1)} = ${sg(p)} + ${par(q)} = ${sg(p + q)}.` };
        }
        if (kind === "findn") {
          for (;;) {
            const a1 = rnd(-15, 20), d = nz(-4, 6), n = rnd(5, 40), S = (2 * a1 + (n - 1) * d) * n / 2;
            // other root of d·n² + (2a₁ − d)·n − 2S = 0
            const other = -(2 * a1 - d) / d - n;
            if (other > 0 && Math.abs(other - Math.round(other)) < 1e-9) continue;
            return { text: `${seqStr(a1, d, 3)} ədədi silsiləsinin ilk neçə həddini toplamaq lazımdır ki, cəm ${sg(S)} olsun?`, answer: n, show: String(n), tol: INT,
              solution: `(2·${par(a1)} + (n − 1)·${par(d)})·n/2 = ${sg(S)} → ${d === 1 ? "" : d === -1 ? "−" : sg(d)}n²${2 * a1 - d ? pm(2 * a1 - d) + "n" : ""} = ${sg(2 * S)}. Natural kök: n = ${n}` + (Number.isInteger(other) || other <= 0 ? ` (ikinci kök ${Number.isInteger(other) ? sg(other) : "natural deyil"}).` : `.`) };
          }
        }
        let m, n, a1, K; do { m = rnd(3, 20); n = rnd(m + 1, 30); K = m + n - 1; a1 = K * nz(-4, 4); } while ((2 * a1) % K !== 0);
        const d = -2 * a1 / K;
        return { text: `Ədədi silsilədə ${a_(1)} = ${sg(a1)} və ${S_(m)} = ${S_(n)}. d = ?`, answer: d, show: sg(d), tol: INT,
          solution: `${S_(n)} − ${S_(m)} = ${a_(m + 1)} + … + ${a_(n)} = 0. Bu ${n - m} həddin cəmi (${a_(m + 1)} + ${a_(n)})·${n - m}/2 = 0 → ${a_(m + 1)} + ${a_(n)} = 2${a_(1)} + ${K}d = 0 → d = −2·${par(a1)}/${K} = ${sg(d)}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Hər dəfə eyni ədəd qədər artırsa — ədədi silsilədir. Əvvəl a₁, d və n-i müəyyən et, sonra düsturu yaz.",
      gen() {
        const kind = pick(["seats", "fall", "logs", "save", "clock"]);
        if (kind === "seats") {
          const r = rnd(10, 30), d = rnd(1, 4), n = rnd(8, 25), last = r + (n - 1) * d, S = (r + last) * n / 2, ask = pick(["S", "last"]);
          return { text: `Amfiteatrın birinci sırasında ${r} yer var, hər növbəti sırada ${d} yer artıqdır. Cəmi ${n} sıra var. ` + (ask === "S" ? "Amfiteatrda neçə yer var?" : "Sonuncu sırada neçə yer var?"),
            answer: ask === "S" ? S : last, show: String(ask === "S" ? S : last), tol: INT,
            solution: `${a_(1)} = ${r}, d = ${d}, n = ${n}. ${a_(n)} = ${r} + ${n - 1}·${d} = ${last}.` + (ask === "S" ? ` ${S_(n)} = (${r} + ${last})·${n}/2 = ${S}.` : "") };
        }
        if (kind === "fall") {
          const t = rnd(3, 12), k = rnd(2, t), ask = pick(["total", "kth"]);
          return { text: `Sərbəst düşən cisim birinci saniyədə 5 m, hər növbəti saniyədə əvvəlkindən 10 m artıq yol gedir. ` + (ask === "total" ? `İlk ${t} saniyədə neçə metr yol gedir?` : `${ord(k)} saniyədə neçə metr yol gedir?`),
            answer: ask === "total" ? 5 * t * t : 5 + 10 * (k - 1), unit: "m", show: (ask === "total" ? 5 * t * t : 5 + 10 * (k - 1)) + " m", tol: INT,
            solution: ask === "total" ? `${a_(1)} = 5, d = 10. ${a_(t)} = 5 + ${t - 1}·10 = ${5 + 10 * (t - 1)}. ${S_(t)} = (5 + ${5 + 10 * (t - 1)})·${t}/2 = ${5 * t * t} m.` : `${a_(k)} = 5 + ${k - 1}·10 = ${5 + 10 * (k - 1)} m.` };
        }
        if (kind === "logs") {
          const b = rnd(10, 30), t = rnd(1, b - 4), n = b - t + 1, S = (b + t) * n / 2;
          return { text: `Kötüklər qalaq şəklində yığılıb: ən alt sırada ${b} kötük, hər yuxarı sırada bir kötük az, ən üst sırada ${t} kötük. Qalaqda neçə kötük var?`, answer: S, show: String(S), tol: INT,
            solution: `Sıraların sayı ${b} − ${t} + 1 = ${n}. Cəm: (${b} + ${t})·${n}/2 = ${S}.` };
        }
        if (kind === "save") {
          const a1 = rnd(1, 10), d = rnd(1, 5), n = rnd(6, 30), S = (2 * a1 + (n - 1) * d) * n / 2;
          return { text: `Elvin birinci həftə ${a1} manat yığır, hər növbəti həftə əvvəlkindən ${d} manat çox. Neçə həftəyə cəmi ${S} manat yığmış olacaq?`, answer: n, show: String(n), tol: INT,
            solution: `(2·${a1} + (n − 1)·${d})·n/2 = ${S} → ${d === 1 ? "" : d}n²${2 * a1 - d ? pm(2 * a1 - d) + "n" : ""} − ${2 * S} = 0. Müsbət kök n = ${n}. Yoxla: ${a_(n)} = ${a1 + (n - 1) * d}, (${a1} + ${a1 + (n - 1) * d})·${n}/2 = ${S}.` };
        }
        // a clock strikes the hour: 1 + 2 + … + 12 per half-day
        const from = rnd(1, 6), to = rnd(from + 3, 12), S = (from + to) * (to - from + 1) / 2;
        return { text: `Saat hər tam saatda saatın sayı qədər zəng vurur (1-də 1 dəfə, 2-də 2 dəfə, …, 12-də 12 dəfə). Saat ${from}:00-dan ${to}:00-a qədər (hər ikisi daxil) neçə zəng vurur?`, answer: S, show: String(S), tol: INT,
          solution: `${from} + ${from + 1} + … + ${to}: ${to - from + 1} hədd, cəm (${from} + ${to})·${to - from + 1}/2 = ${S}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Hər addımı ayrıca yoxla: düstur (n − 1 yoxsa n?), /2 unudulubmu, hesab düzdürmü.",
      gen() {
        const a1 = rnd(-10, 15), d = nz(-5, 7), n = 2 * rnd(5, 20), an = a1 + (n - 1) * d, S = (a1 + an) * n / 2;
        const steps = [`${a_(n)} = ${a_(1)} + (n − 1)d = ${sg(a1)} + ${n - 1}·${par(d)} = ${sg(an)}.`,
          `${S_(n)} = (${a_(1)} + ${a_(n)})·n/2 = (${sg(a1)} + ${par(an)})·${n}/2.`,
          `${S_(n)} = ${sg(a1 + an)}·${n}/2 = ${sg(S)}.`];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `${a_(n)} = ${a_(1)} + n·d = ${sg(a1)} + ${n}·${par(d)} = ${sg(a1 + n * d)}.`;
        if (bad === 1) steps[1] = `${S_(n)} = (${a_(1)} + ${a_(n)})·n = (${sg(a1)} + ${par(an)})·${n}.`;
        if (bad === 2) { let w = S + pick([-1, 1]) * pick([10, 2 * n, n]); steps[2] = `${S_(n)} = ${sg(a1 + an)}·${n}/2 = ${sg(w)}.`; }
        if (bad === 0) { const an2 = a1 + n * d; steps[1] = `${S_(n)} = (${a_(1)} + ${a_(n)})·n/2 = (${sg(a1)} + ${par(an2)})·${n}/2.`; steps[2] = `${S_(n)} = ${sg(a1 + an2)}·${n}/2 = ${sg((a1 + an2) * n / 2)}.`; }
        if (bad === 1) steps[2] = `${S_(n)} = ${sg(a1 + an)}·${n} = ${sg((a1 + an) * n)}.`;
        const text = h("div", {}, h("p", {}, `Elvin ${a_(1)} = ${sg(a1)}, d = ${sg(d)} olan ədədi silsilənin ilk ${n} həddinin cəmini hesablayır. Hansı addımda səhv var?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: ${a_(n)} = ${a_(1)} + (n − 1)d, n·d yox. Düzü: ${a_(n)} = ${sg(an)}, ${S_(n)} = ${sg(S)}.`,
          `2-ci addım: cəm düsturunda 2-yə bölmək unudulub. Düzü: ${S_(n)} = (${sg(a1)} + ${par(an)})·${n}/2 = ${sg(S)}.`,
          `3-cü addım: hesab səhvdir. ${sg(a1 + an)}·${n}/2 = ${sg(S)}.`][bad];
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
      key: "ol-ededi-silsile", title: "Ədədi silsilə", fenn: "olimpiada", link: "dersler/ol-ededi-silsile.html",
      format: "Cavab ədəddir: hədd (−17), nömrə (25), cəm (1240).",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["an", "nomre", "xasse", "xasse", "cem", "cem", "sn", "nomre", "heyat", "sehv"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-ededi-silsile.html")) b.push("dersler/ol-ededi-silsile.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
