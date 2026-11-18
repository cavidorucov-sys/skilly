// Xətti tənliklər — mastery game levels (ax + b = cx + d, brackets, fractional coefficients, number of roots,
// parameters, find the error, word problems) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  // [[3,"x"],[-5,""]] → "3x − 5"
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const lin = p => poly([[1, "x"], [-p, ""]]);               // x − p
  const nz = (a, b) => { let v = 0; while (!v) v = rnd(a, b); return v; };
  const coefX = k => k === 1 ? "x" : k === -1 ? "−x" : S(k) + "x";
  // k·(inner) as a signed term after another term: " + 3(x − 2)" / " − 4(x + 1)"
  const tail = (k, inner) => (k < 0 ? " − " : " + ") + (Math.abs(k) === 1 ? "" : Math.abs(k)) + "(" + inner + ")";
  const head = (k, inner) => (k === -1 ? "−" : k === 1 ? "" : S(k)) + "(" + inner + ")";

  const levels = [
    { id: "sade", ad: "ax + b = cx + d", izah: "x-li hədləri bir tərəfə, ədədləri o biri tərəfə köçür (köçəndə işarə dəyişir), sonra x-in əmsalına böl.",
      gen() {
        let a, c; do { a = nz(-9, 9); c = rnd(-9, 9); } while (a === c);
        const A = a - c, b = rnd(-20, 20);
        let M;
        if (Math.abs(A) === 1 || Math.random() < .7) M = A * rnd(-10, 10); else { do { M = rnd(-30, 30); } while (M % A === 0); }
        const d = b + M;
        return { text: `${poly([[a, "x"], [b, ""]])} = ${poly([[c, "x"], [d, ""]])}. x = ?`, answer: M / A, show: frac(M, A), placeholder: "məs. −3 və ya 5/2",
          solution: `x-li hədlər sola, ədədlər sağa: ${poly([[a, "x"], [-c, "x"]])} = ${poly([[d, ""], [-b, ""]])} → ${coefX(A)} = ${S(M)} → x = ${frac(M, A)}.` };
      } },
    { id: "moterize", ad: "Mötərizəli tənlik", izah: "Əvvəl mötərizələri aç (mötərizə qarşısında mənfi varsa, içindəki hər işarə dəyişir), sonra oxşar hədləri topla.",
      gen() {
        let a, b, d, r, p, q, k;
        do { a = pick([-1, 1]) * rnd(2, 7); b = pick([-1, 1]) * rnd(1, 6); d = Math.random() < .5 ? 0 : rnd(-5, 5); p = nz(-8, 8); q = nz(-8, 8); r = rnd(-9, 9); k = a + b - d; } while (!k);
        const e = k * r - a * p + b * q;                       // a(x − p) + b(x + q) = dx + e  has root r
        const right = poly([[d, "x"], [e, ""]]);
        return { text: `${head(a, lin(p))}${tail(b, lin(-q))} = ${right}. x = ?`, answer: r, show: S(r), tol: 0.01,
          solution: `Mötərizələri aç: ${poly([[a, "x"], [-a * p, ""], [b, "x"], [b * q, ""]])} = ${right}. Oxşar hədlər: ${poly([[a + b, "x"], [b * q - a * p, ""]])} = ${right} → ${coefX(k)} = ${S(e + a * p - b * q)} → x = ${S(r)}.` };
      } },
    { id: "kesrli", ad: "Kəsr əmsallar", izah: "Hər iki tərəfi bütün məxrəclərin ortaq məxrəcinə vur — kəsrlər yox olur. Kəsrsiz ədədi də vurmağı unutma!",
      gen() {
        const PAIRS = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 6], [4, 5], [6, 4], [3, 2], [5, 2], [6, 9], [2, 7]];
        for (;;) {
          const [m, n] = pick(PAIRS), L = m * n / gcd(m, n), u = L / m, w = L / n;
          if (Math.random() < .55) {           // (x + a)/m ± (x + b)/n = c
            const s = pick([1, -1]), a = rnd(-9, 9), b = rnd(-9, 9), c = rnd(-6, 8), k = u + s * w;
            if (!k || !a || !b) continue;
            const R = c * L - u * a - s * w * b; if (R % k) continue; const r = R / k; if (Math.abs(r) > 25) continue;
            return { text: `(${lin(-a)})/${m} ${s > 0 ? "+" : "−"} (${lin(-b)})/${n} = ${S(c)}. x = ?`, answer: r, show: S(r), tol: 0.01,
              solution: `Ortaq məxrəc ${L}. Hər iki tərəfi ${L} dəfə artır: ${u === 1 ? "" : u}(${lin(-a)}) ${s > 0 ? "+" : "−"} ${w === 1 ? "" : w}(${lin(-b)}) = ${S(c * L)} → ${poly([[u, "x"], [u * a, ""], [s * w, "x"], [s * w * b, ""]])} = ${S(c * L)} → ${coefX(k)} = ${S(R)} → x = ${S(r)}.` };
          }
          // (px + a)/m = (x + b)/n
          const p = rnd(1, 4), a = rnd(-9, 9), b = rnd(-9, 9), k = u * p - w;
          if (!k || !a || !b) continue;
          const R = w * b - u * a; if (R % k) continue; const r = R / k; if (Math.abs(r) > 25) continue;
          return { text: `(${poly([[p, "x"], [a, ""]])})/${m} = (${lin(-b)})/${n}. x = ?`, answer: r, show: S(r), tol: 0.01,
            solution: `Bu, tənasübdür — çarpaz vur: ${n}(${poly([[p, "x"], [a, ""]])}) = ${m}(${lin(-b)}) → ${poly([[n * p, "x"], [n * a, ""]])} = ${poly([[m, "x"], [m * b, ""]])} → ${coefX(n * p - m)} = ${S(m * b - n * a)} → x = ${S(r)}.` };
        }
      } },
    { id: "say", ad: "Neçə kök?", izah: "Sadələşdir və ax = b şəklinə gətir. a ≠ 0 — bir kök; 0·x = 0 — sonsuz sayda kök; 0·x = b (b ≠ 0) — kök yoxdur.",
      gen() {
        const CH = ["Bir kök", "Kök yoxdur", "Sonsuz sayda kök"];
        const kind = rnd(0, 2), k = pick([-1, 1]) * rnd(2, 7), p = nz(-6, 6), m = rnd(-9, 9);
        const left = `${head(k, lin(p))}${m ? (m < 0 ? " − " : " + ") + Math.abs(m) : ""}`, L0 = -k * p + m;   // k(x − p) + m = kx + L0
        let k2 = k, e;
        if (kind === 0) { do { k2 = rnd(-7, 7); } while (k2 === k); e = rnd(-12, 12); }
        else if (kind === 1) { do { e = rnd(-15, 15); } while (e === L0); }
        else e = L0;
        const right = poly([[k2, "x"], [e, ""]]);
        const tailTxt = kind === 0 ? `${coefX(k - k2)} = ${S(e - L0)} — x-in əmsalı sıfır deyil, bir kök var (x = ${frac(e - L0, k - k2)}).`
          : kind === 1 ? `0·x = ${S(e - L0)}. Amma 0·x həmişə sıfırdır, ${S(e - L0)} ola bilməz. Kök yoxdur.`
          : `0·x = 0 — istənilən x yarayır. Sonsuz sayda kök.`;
        return { text: `${left} = ${right}. Bu tənliyin neçə kökü var?`, choices: CH, correct: kind, show: CH[kind],
          solution: `Mötərizəni aç: ${poly([[k, "x"], [L0, ""]])} = ${right}. x-ləri sola: ${tailTxt}` };
      } },
    { id: "parametr", ad: "Parametr", izah: "Tənliyi (…)·x = (…) şəklinə gətir. Kök yoxdur: əmsal 0, sağ tərəf ≠ 0. Sonsuz sayda kök: hər ikisi 0.",
      gen() {
        const kind = pick(["kv", "kv", "lin", "kok"]);
        if (kind === "kv") {           // (a² − p²)x = a ∓ p
          const p = rnd(1, 8), plus = Math.random() < .5, none = Math.random() < .5;
          // right side a + p: a = p → 0x = 2p (none); a = −p → 0x = 0 (infinite).  right side a − p: the other way round.
          const ans = plus ? (none ? p : -p) : (none ? -p : p);
          return { text: `a-nın hansı qiymətində (a² − ${p * p})x = a ${plus ? "+" : "−"} ${p} tənliyinin ${none ? "kökü yoxdur" : "sonsuz sayda kökü var"}?`, answer: ans, show: S(ans), tol: 0.01,
            solution: `Əmsal sıfır olmalıdır: a² − ${p * p} = 0 → a = ${p} və ya a = −${p}. a = ${p}: 0·x = ${plus ? 2 * p : 0}. a = −${p}: 0·x = ${plus ? 0 : "−" + 2 * p}. ${none ? "Kök yoxdur" : "Sonsuz sayda kök"} — a = ${S(ans)} olanda.` };
        }
        if (kind === "lin") {          // a(x − p) = kx + ma + n  →  (a − k)x = a(p + m) + n
          const k = nz(-6, 6), p = nz(-5, 5), m = rnd(-4, 4), none = Math.random() < .5;
          let n; if (none) { do { n = rnd(-9, 9); } while (k * (p + m) + n === 0); } else n = -k * (p + m);
          const right = poly([[k, "x"], [m, "a"], [n, ""]]);
          const R = k * (p + m) + n;
          return { text: `a-nın hansı qiymətində a(${lin(p)}) = ${right} tənliyinin ${none ? "kökü yoxdur" : "sonsuz sayda kökü var"}?`, answer: k, show: S(k), tol: 0.01,
            solution: `Aç və qruplaşdır: ${poly([[1, "ax"], [-p, "a"]])} = ${right} → (a ${k < 0 ? "+ " + (-k) : "− " + k})x = ${poly([[p + m, "a"], [n, ""]])}. Əmsal sıfır: a = ${S(k)}. Onda sağ tərəf ${S(R)}: ${none ? `0·x = ${S(R)} — kök yoxdur` : "0·x = 0 — sonsuz sayda kök"}. Cavab: a = ${S(k)}.` };
        }
        // x = r is a root of ax − b = cx + a  →  a(r − 1) = cr + b
        let r; do { r = rnd(-6, 7); } while (r === 1);
        const a = rnd(-8, 8), c = nz(-6, 6), b = a * (r - 1) - c * r;
        return { text: `a-nın hansı qiymətində x = ${S(r)} ədədi ${poly([[1, "ax"], [-b, ""]])} = ${poly([[c, "x"], [1, "a"]])} tənliyinin köküdür?`, answer: a, show: S(a), tol: 0.01,
          solution: `x = ${S(r)} yaz: ${poly([[r, "·a"], [-b, ""]]).replace(/^(−?)·a/, "$1a").replace(/^(−?\d+)·a/, "$1·a")} = ${S(c * r)} + a → ${r - 1 === 1 ? "" : `${r - 1 === -1 ? "−" : S(r - 1)}a = ${S(c * r + b)} → `}a = ${S(a)}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const PAIRS = [[2, 5], [3, 5], [2, 7], [5, 3], [5, 2], [3, 7], [7, 2]];   // |L/m − L/n| ≥ 2, so step 3 is a real division
        let m, n, L, u, w, a, b, c, k, R;
        do { [m, n] = pick(PAIRS); L = m * n / gcd(m, n); u = L / m; w = L / n; a = rnd(1, 9); b = rnd(1, 9); c = rnd(1, 6); k = u - w; R = c * L - u * a - w * b; } while (R % k || R / k === k / R || Math.abs(R / k) > 30 || R === 0);
        const r = R / k;                                       // (x + a)/m − (x − b)/n = c
        const steps = [
          `1) Hər iki tərəfi ${L} dəfə artırırıq: ${u}(x + ${a}) − ${w}(x − ${b}) = ${c * L}.`,
          `2) ${u}x + ${u * a} − ${w}x + ${w * b} = ${c * L} → ${coefX(k)} = ${S(R)}.`,
          `3) x = ${S(r)}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `1) Hər iki tərəfi ${L} dəfə artırırıq: ${u}(x + ${a}) − ${w}(x − ${b}) = ${c}.`;
        if (bad === 1) steps[1] = `2) ${u}x + ${u * a} − ${w}x − ${w * b} = ${c * L} → ${coefX(k)} = ${S(c * L - u * a + w * b)}.`;
        if (bad === 2) steps[2] = `3) x = ${frac(k, R)}.`;
        const text = h("div", {}, h("p", {}, `Tənlik: (x + ${a})/${m} − (x − ${b})/${n} = ${c}.`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st.slice(3)))));
        const why = [`1-ci addım: sağ tərəfi də ${L} dəfə artırmaq lazımdır: ${c}·${L} = ${c * L}.`,
          `2-ci addım: −${w}(x − ${b}) = −${w}x + ${w * b}. Mənfi mötərizə içindəki işarəni dəyişir.`,
          `3-cü addım: ${coefX(k)} = ${S(R)} → x = ${S(R)} : ${k < 0 ? "(" + S(k) + ")" : k} = ${S(r)}. Bölmə tərsinə aparılıb.`][bad];
        return { text, choices: ["1-ci addım", "2-ci addım", "3-cü addım"], correct: bad, show: ["1-ci addım", "2-ci addım", "3-cü addım"][bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Naməlumu x ilə işarə et, şərti tənlik kimi yaz, həll et və cavabı şərtə qoyub yoxla.",
      gen() {
        const kind = pick(["ard", "yas", "alis", "yol"]);
        if (kind === "ard") {
          const n = rnd(3, 60), cnt = pick([3, 3, 4, 5]), even = Math.random() < .4, st = even ? 2 : 1, x0 = even ? 2 * n : n;
          const sum = cnt * x0 + st * cnt * (cnt - 1) / 2, big = Math.random() < .5, ans = big ? x0 + st * (cnt - 1) : x0;
          const terms = Array.from({ length: cnt }, (_, i) => i ? `(x + ${st * i})` : "x").join(" + ");
          return { text: `Ardıcıl ${cnt} ${even ? "cüt " : ""}natural ədədin cəmi ${sum} edir. Bu ədədlərin ${big ? "ən böyüyünü" : "ən kiçiyini"} tap.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Ən kiçiyi x: ${terms} = ${sum} → ${cnt}x + ${st * cnt * (cnt - 1) / 2} = ${sum} → x = ${x0}. Ədədlər: ${Array.from({ length: cnt }, (_, i) => x0 + st * i).join(", ")}. Cavab: ${ans}.` };
        }
        if (kind === "yas") {
          let s, k, m, t; do { s = rnd(3, 14); k = rnd(3, 6); m = rnd(2, k - 1); t = s * (k - m) / (m - 1); } while (!Number.isInteger(t) || t > 30 || k * s > 60);
          return { text: `Ata oğlundan ${k} dəfə böyükdür. ${t} il sonra ata oğlundan ${m} dəfə böyük olacaq. Oğul indi neçə yaşındadır?`, answer: s, show: String(s), tol: 0.01, unit: "yaş",
            solution: `Oğul x yaşında, ata ${k}x. ${t} il sonra: ${k}x + ${t} = ${m}(x + ${t}) → ${k}x + ${t} = ${m}x + ${m * t} → ${k - m === 1 ? "" : k - m}x = ${m * t - t} → x = ${s}. Yoxla: ata ${k * s}; ${t} il sonra ${k * s + t} və ${s + t}, ${k * s + t} = ${m}·${s + t} ✓` };
        }
        if (kind === "alis") {
          const p = rnd(1, 9), a = rnd(1, 6), A = rnd(2, 6), B = rnd(2, 8), T = A * (p + a) + B * p;
          return { text: `Dəftər qələmdən ${a} manat bahadır. ${A} dəftər və ${B} qələm üçün cəmi ${T} manat ödənildi. Bir qələm neçə manatdır?`, answer: p, show: String(p), tol: 0.01, unit: "manat",
            solution: `Qələm x manat, dəftər x + ${a}. ${A}(x + ${a}) + ${B}x = ${T} → ${A + B}x + ${A * a} = ${T} → ${A + B}x = ${T - A * a} → x = ${p}. Cavab: ${p} manat.` };
        }
        const v = rnd(4, 9) * 10, d = rnd(1, 4) * 10, t = rnd(2, 5), D = t * (2 * v + d);
        return { text: `İki şəhər arasındakı məsafə ${D} km-dir. Bu şəhərlərdən eyni vaxtda bir-birinə doğru iki maşın çıxdı və ${t} saat sonra görüşdü. İkinci maşının sürəti birincininkindən ${d} km/saat çoxdur. Birinci maşının sürəti neçə km/saatdır?`, answer: v, show: String(v), tol: 0.01, unit: "km/saat",
          solution: `Birincinin sürəti x, ikincinin x + ${d}. ${t} saatda birlikdə ${D} km: ${t}(x + x + ${d}) = ${D} → 2x + ${d} = ${D / t} → 2x = ${D / t - d} → x = ${v}. Cavab: ${v} km/saat.` };
      } },
  ];

  // "… → x = 7 → x = 7" (coefficient 1) → "… → x = 7"
  levels.forEach(l => { const g = l.gen; l.gen = () => { const q = g(); q.solution = String(q.solution).replace(/ → x = ([^\s→]+) → x = \1(?![\d/])/g, " → x = $1"); return q; }; });
  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are the
  // answers of typical mistakes (sign of a bracket, forgetting to multiply the right side, swapped factors, ...).
  const { ae, again } = Oyun;
  const D = x => { const r = Math.round(x * 1e4) / 1e4; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  const isNice = (x, dp = 1) => isFinite(x) && Math.abs(Math.round(x * 10 ** dp) - x * 10 ** dp) < 1e-7;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const PAIRS2 = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 6], [6, 4], [3, 2], [5, 2], [2, 7], [6, 9]];
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. closed: brackets with a minus in front of one of them
    { tip: "qapali", gen: () => again(() => {
      const A = rnd(2, 7), B = rnd(1, 6), p = rnd(1, 8), q = rnd(1, 8), r = nz(-9, 9); if (A === B) return null;
      const k = A - B, E = k * r - A * p - B * q, R = E + A * p + B * q;
      const w1 = (E + A * p - B * q) / k, w2 = (E + p + B * q) / k, w3 = (E - A * p - B * q) / k, w4 = (E + A * p + q) / k;
      if (![r, w1, w2, w3, w4].every(x => isNice(x))) return null;
      return mc(ae(r, [w1, w2, w3, w4]), { text: `${head(A, lin(p))}${tail(-B, "x + " + q)} = ${S(E)} tənliyini həll edin.`,
        solution: `Mötərizələri aç: ${poly([[A, "x"], [-A * p, ""], [-B, "x"], [-B * q, ""]])} = ${S(E)} → ${coefX(k)} = ${S(R)}${k === 1 ? "" : " → x = " + S(r)}. Tələlər: mənfi mötərizədə yalnız x-in işarəsini dəyişmək (x = ${D(w1)}); ${A} ədədini ${p} ədədinə vurmağı unutmaq (x = ${D(w2)}); ədədi köçürəndə işarəni dəyişməmək (x = ${D(w3)}); ${B} ədədini ${q} ədədinə vurmamaq (x = ${D(w4)}).` });
    }) },
    // 2. closed: fractions, common denominator
    { tip: "qapali", gen: () => again(() => {
      const [m, n] = pick(PAIRS2), L = m * n / gcd(m, n), u = L / m, w = L / n, k = u - w; if (!k) return null;
      const a = rnd(1, 9), b = rnd(1, 9), c = rnd(1, 6), R = c * L - u * a - w * b; if (R % k) return null; const r = R / k; if (!r || Math.abs(r) > 20) return null;
      const w1 = (c - u * a - w * b) / k, w2 = (c * L - u * a + w * b) / k, w3 = (c * L - w * a - u * b) / (w - u), w4 = R / (u + w);
      if (![r, w1, w2, w3, w4].every(x => isNice(x))) return null;
      return mc(ae(r, [w1, w2, w3, w4]), { text: `(x + ${a})/${m} − (x − ${b})/${n} = ${c} tənliyini həll edin.`,
        solution: `Ortaq məxrəc ${L}: ${u}(x + ${a}) − ${w}(x − ${b}) = ${c * L} → ${coefX(k)} = ${S(R)}${k === 1 ? "" : " → x = " + S(r)}. Tələlər: sağ tərəfdəki ${c} ədədini ${L} ədədinə vurmamaq (x = ${D(w1)}); −${w}(x − ${b}) açanda ${b} ədədinin işarəsini dəyişməmək (x = ${D(w2)}); vuruqları çarpaz səhv qoymaq: ${w}(x + ${a}) − ${u}(x − ${b}) (x = ${D(w3)}); mənfi mötərizədə x-in işarəsini dəyişməmək (x = ${D(w4)}).` });
    }) },
    // 3. closed: the value of an expression in the root
    { tip: "qapali", gen: () => again(() => {
      const a = rnd(2, 9), c = rnd(1, 8), r = nz(-8, 8), b = nz(-15, 15); if (a === c) return null;
      const d = b + (a - c) * r, k = rnd(2, 5), t = nz(-9, 9), xw = (b + d) / (a - c);
      const val = k * r + t, w = [r, k * (r + t), k * r, k * xw + t];
      if (![val, xw, ...w].every(x => isNice(x))) return null;
      return mc(ae(val, w), { text: `${poly([[a, "x"], [b, ""]])} = ${poly([[c, "x"], [d, ""]])} tənliyinin kökü x₀-dır. ${poly([[k, "x₀"], [t, ""]])} ifadəsinin qiymətini tapın.`,
        solution: `${a - c === 1 ? "" : coefX(a - c) + " = " + S(d - b) + " → "}x₀ = ${S(r)}. İfadə: ${k}·${r < 0 ? "(" + S(r) + ")" : r} ${t < 0 ? "−" : "+"} ${Math.abs(t)} = ${S(val)}. Tələlər: kökü cavab yazmaq (${S(r)}); ${Math.abs(t)} ədədini də ${k} ədədinə vurmaq (${S(k * (r + t))}); ${t < 0 ? "−" : "+"}${Math.abs(t)} hissəsini unutmaq (${S(k * r)}); kökü səhv tapmaq — ${S(b)} ədədini köçürəndə işarəni dəyişməmək (x₀ = ${D(xw)}, ifadə ${D(k * xw + t)}).` });
    }) },
    // 4. closed: parameter, no root
    { tip: "qapali", gen: () => again(() => {
      const p = rnd(2, 9), s = pick([1, -1]), ans = s * p;
      const w = [-ans, p * p, 0, 2 * ans];
      return mc(ae(ans, w, S), { text: `a-nın hansı qiymətində (a² − ${p * p})x = a ${s > 0 ? "+" : "−"} ${p} tənliyinin kökü yoxdur?`,
        solution: `x-in əmsalı sıfır olmalıdır: a² − ${p * p} = 0 → a = ${p} və ya a = −${p}. a = ${S(ans)} olanda sağ tərəf ${S(2 * ans)} ≠ 0, yəni 0·x = ${S(2 * ans)} — kök yoxdur. a = ${S(-ans)} olanda sağ tərəf 0, yəni 0·x = 0 — sonsuz sayda kök. Tələlər: ${S(-ans)} (sonsuz sayda kök halı); ${p * p} (a² = ${p * p} sanıb a-nı ${p * p} yazmaq); 0; ${S(2 * ans)} (sağ tərəfin qiyməti).` });
    }) },
    // 5. closed: word problem (transfer of money)
    { tip: "qapali", gen: () => again(() => {
      const k = rnd(2, 5), V = rnd(3, 20) * 2, t = (k - 1) * V / 2, A = k * V; if (!Number.isInteger(t)) return null;
      const w = [V, k * t / (k - 1), (k + 1) * V / 2, (k + 1) * 2 * t / k];
      if (![A, ...w].every(x => isNice(x, 0) && x > 0)) return null;
      return mc(ae(A, w), { text: `Əlinin pulu Vəlinin pulundan ${k} dəfə çoxdur. Əli Vəliyə ${t} manat verəndə onların pulları bərabər oldu. Əlinin əvvəlki pulu neçə manat idi?`,
        solution: `Vəlinin pulu x, Əlinin ${k}x. Verəndən sonra: ${k}x − ${t} = x + ${t} → ${k - 1 === 1 ? "" : k - 1}x = ${2 * t} → x = ${V}. Əlinin pulu ${k}·${V} = ${A} manat. Tələlər: Vəlinin pulunu cavab yazmaq (${V}); Vəlinin aldığı ${t} manatı unutmaq (${D(k * t / (k - 1))}); verəndən sonrakı pulu yazmaq (${D((k + 1) * V / 2)}); "${k} dəfə çox"-u ${k + 1}x yazmaq (${D((k + 1) * 2 * t / k)}).` });
    }) },
    // 6. closed: root given, the parameter is asked
    { tip: "qapali", gen: () => again(() => {
      const r = nz(-6, 7), a = nz(-8, 8), c = nz(-6, 6); if (Math.abs(r) === 1) return null;
      const ca = r - 1 === 1 ? "" : r - 1 === -1 ? "−" : S(r - 1), b = a * (r - 1) - c * r, w = [a * (r - 1) / (r + 1), (c * r - b) / (r - 1), a * (r - 1) / r, -a];
      if (![a, ...w].every(x => isNice(x))) return null;
      return mc(ae(a, w), { text: `x = ${S(r)} ədədi ${poly([[1, "ax"], [-b, ""]])} = ${poly([[c, "x"], [1, "a"]])} tənliyinin köküdür. a-nı tapın.`,
        solution: `x = ${S(r)} yaz: ${S(r)}a ${b < 0 ? "+" : "−"} ${Math.abs(b)} = ${S(c * r)} + a. a-lı hədlər sola: ${S(r)}a − a = ${S(c * r + b)} → ${ca}a = ${S(c * r + b)} → a = ${S(a)}. Tələlər: a-nı köçürəndə işarəni səhv qoymaq (${S(r)}a + a, cavab ${D(w[0])}); ${S(-b)} həddinin işarəsini dəyişmədən köçürmək (${D(w[1])}); sağ tərəfdəki a-nı unutmaq (${D(w[2])}); ${ca}a = ${S(c * r + b)} tənliyində işarəni səhv bölmək (${S(-a)}).` });
    }) },
    // 7. coded: fractions, positive root
    { tip: "kod", gen: () => again(() => {
      const [m, n] = pick(PAIRS2), L = m * n / gcd(m, n), u = L / m, w = L / n, p = rnd(2, 4), k = u * p - w; if (!k) return null;
      const a = nz(-9, 9), b = nz(-9, 9), r = rnd(2, 15), T = k * r + u * a + w * b; if (T % L) return null; const c = T / L;
      return { text: `(${poly([[p, "x"], [a, ""]])})/${m} − (${lin(b)})/${n} = ${S(c)} tənliyini həll edin. x = ?`,
        answer: r, show: String(r), tol: 1e-6, solution: `Ortaq məxrəc ${L}: ${u}(${poly([[p, "x"], [a, ""]])}) − ${w}(${lin(b)}) = ${S(c * L)} → ${poly([[u * p - w, "x"], [u * a + w * b, ""]])} = ${S(c * L)} → ${coefX(k)} = ${S(c * L - u * a - w * b)}${k === 1 ? "" : " → x = " + r}.` };
    }) },
    // 8. coded: parameter, infinitely many roots (positive answer)
    { tip: "kod", gen: () => again(() => {
      const k = rnd(2, 8), p = nz(-5, 5), m = rnd(-4, 4), n = -k * (p + m); if (p + m === 0) return null;
      const right = poly([[k, "x"], [m, "a"], [n, ""]]);
      return { text: `a-nın hansı qiymətində a(${lin(p)}) = ${right} tənliyinin sonsuz sayda kökü var?`,
        answer: k, show: String(k), tol: 1e-6, solution: `Aç və qruplaşdır: ${poly([[1, "ax"], [-p, "a"]])} = ${right} → (a − ${k})x = ${poly([[p + m, "a"], [n, ""]])}. Sonsuz sayda kök üçün x-in əmsalı və sağ tərəf 0 olmalıdır: a = ${k}. Yoxla: sağ tərəf ${S(p + m)}·${k} ${n < 0 ? "−" : "+"} ${Math.abs(n)} = 0 ✓` };
    }) },
    // 9. coded: age problem
    { tip: "kod", gen: () => again(() => {
      const k = rnd(2, 5), m = rnd(k + 1, 9), s = rnd(8, 16), t = s * (m - k) / (m - 1); if (!Number.isInteger(t) || t >= s || k * s < 28 || k * s > 60) return null;
      return { text: `Ata oğlundan ${k} dəfə böyükdür. ${t} il əvvəl ata oğlundan ${m} dəfə böyük idi. Oğul indi neçə yaşındadır?`,
        answer: s, show: String(s), tol: 1e-6, unit: "yaş", solution: `Oğul indi x yaşında, ata ${k}x. ${t} il əvvəl: ${k}x − ${t} = ${m}(x − ${t}) → ${k}x − ${t} = ${m}x − ${m * t} → ${m - k === 1 ? "" : m - k}x = ${m * t - t} → x = ${s}. Yoxla: ata ${k * s}; ${t} il əvvəl ${k * s - t} və ${s - t}, ${k * s - t} = ${m}·${s - t} ✓` };
    }) },
    // 10. written: fractions of the rest (book pages)
    { tip: "yazili", gen: () => again(() => {
      const [a, b] = pick([[1, 4], [1, 5], [2, 5], [1, 3], [3, 8]]), [c, d] = pick([[1, 3], [1, 2], [2, 3], [3, 5], [1, 4]]);
      const x = b * d * rnd(1, 3), day1 = x * a / b, rest1 = x - day1, day2 = rest1 * c / d, R = rest1 - day2;
      if (![x, day1, rest1, day2, R].every(v => Number.isInteger(v)) || R < 10 || x > 300) return null;
      return { text: `Şagird kitabı üç gündə oxudu. Birinci gün kitabın ${a}/${b} hissəsini, ikinci gün qalan səhifələrin ${c}/${d} hissəsini, üçüncü gün isə qalan ${R} səhifəni oxudu. Kitab neçə səhifədir?`,
        answer: x, show: String(x), tol: 1e-6, unit: "səhifə",
        solution: `1) Kitab x səhifədir. Birinci gün ${a}x/${b} oxundu, qaldı x − ${a}x/${b} = ${b - a}x/${b}. 2) İkinci gün qalanın ${c}/${d} hissəsi oxundu, üçüncü gün qalan ${R}: ${b - a}x/${b} · (1 − ${c}/${d}) = ${R}. 3) Hesabla: x = ${R} : (${b - a}/${b} · ${d - c}/${d}) = ${x}. Yoxla: birinci gün ${day1}, qaldı ${rest1}; ikinci gün ${day2}, qaldı ${R} ✓. Həll yazılmadan yalnız cavab — bal verilmir.` };
    }) },
  ] };
  levels.push(Oyun.imtLevel(IMT));
  window.__imtahan = IMT;

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "xetti-tenlikler", title: "Xətti tənliklər", fenn: "riyaziyyat", link: "dersler/xetti-tenlikler.html",
      format: "Cavab ədəddir: tam 4, mənfi −3, kəsr 5/2 (onluq 2.5 də olar).",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["sade", "moterize", "moterize", "kesrli", "kesrli", "parametr", "parametr", "parametr", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/xetti-tenlikler.html")) b.push("dersler/xetti-tenlikler.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
