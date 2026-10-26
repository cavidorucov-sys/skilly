// Üstlü ifadələr, sadə üstlü tənliklər və sistemlər (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const nz = (a, b) => { let v = 0; while (!v) v = rnd(a, b); return v; };
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const B = n => n < 0 ? "(" + S(n) + ")" : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const SM = { 0: "⁰", 1: "¹", 2: "²", 3: "³", 4: "⁴", 5: "⁵", 6: "⁶", 7: "⁷", 8: "⁸", 9: "⁹", x: "ˣ", y: "ʸ", n: "ⁿ", "+": "⁺", "-": "⁻", "−": "⁻" };
  const E = s => String(s).split("").map(c => SM[c] || c).join("");          // "2x-1" → "²ˣ⁻¹"
  const sg = n => n < 0 ? " − " + (-n) : " + " + n;
  const lt = (c, k) => (c === 1 ? "x" : c === -1 ? "−x" : S(c) + "x") + (k ? sg(k) : "");   // "3x − 2"
  const ex = (c, k) => lt(c, k).replace(/ /g, "").replace(/−/g, "-");                        // compact for superscripts
  const baseStr = (b, u) => u > 0 ? String(b ** u) : "(1/" + b ** (-u) + ")";
  const sqrtSym = { 2: "√", 3: "∛", 4: "∜", 5: "⁵√", 6: "⁶√" };
  const last = { 2: [2, 4, 8, 6], 3: [3, 9, 7, 1], 4: [4, 6], 7: [7, 9, 3, 1], 8: [8, 4, 2, 6], 9: [9, 1] };
  const tt = c => c === 0 ? "" : (c < 0 ? " − " : " + ") + (Math.abs(c) === 1 ? "" : Math.abs(c)) + "t";   // " − 3t"

  const levels = [
    { id: "qaydalar", ad: "Qüvvət qaydaları", izah: "Əsasları sadə ədədə gətir (4 = 2², 9 = 3²), üstləri topla/çıx. Cəm və fərqdə ortaq vuruğu çıxar. Son rəqəm: qüvvətlərin dövrünü tap.",
      gen() {
        const kind = pick(["k", "k", "big", "kok", "son"]);
        if (kind === "k") {
          const p = pick([2, 3]), us = p === 2 ? [1, 2, 3, 4] : [1, 2, 3], u1 = pick(us), u2 = pick(us), u3 = pick(us);
          let a, b, c, k; do { a = rnd(2, 9); b = rnd(2, 9); c = rnd(1, 5); k = u1 * a + u2 * b - u3 * c; } while (k < 2);
          const bs = u => p ** u;
          return { text: `${bs(u1)}${E(a)} · ${bs(u2)}${E(b)} : ${bs(u3)}${E(c)} = ${p}^k. k = ?`, answer: k, show: String(k), tol: 0.01,
            solution: `Hamısını ${p}-nin qüvvəti kimi yaz: ${bs(u1)}${E(a)} = ${p}${E(u1 * a)}, ${bs(u2)}${E(b)} = ${p}${E(u2 * b)}, ${bs(u3)}${E(c)} = ${p}${E(u3 * c)}. Üstləri topla/çıx: ${u1 * a} + ${u2 * b} − ${u3 * c} = ${k}.` };
        }
        if (kind === "big") {
          const p = pick([2, 3, 5]), N = rnd(2018, 2030), a = rnd(3, 4), b = rnd(1, a - 1), c = rnd(0, b), s = pick([1, -1]);
          const ans = p ** (a - c) + s * p ** (b - c);
          return { text: `(${p}${E(N + a)} ${s > 0 ? "+" : "−"} ${p}${E(N + b)}) : ${p}${E(N + c)} neçədir?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Ortaq vuruğu çıxar: ${p}${E(N + b)}·(${p}${E(a - b)} ${s > 0 ? "+" : "−"} 1) = ${p}${E(N + b)}·${p ** (a - b) + s}. ${p}${E(N + b)} : ${p}${E(N + c)} = ${p}${E(b - c)} = ${p ** (b - c)}. Cavab: ${p ** (b - c)} · ${p ** (a - b) + s} = ${ans}.` };
        }
        if (kind === "kok") {
          const p = pick([2, 3, 5]), ns = [2, 3, 4, 5, 6], m = rnd(2, 3), sel = []; while (sel.length < m) { const n = pick(ns); if (!sel.includes(n)) sel.push(n); }
          sel.sort((x, y) => x - y);
          const num = sel.reduce((s, n) => s + (1 / n), 0), L = sel.reduce((l, n) => l * n / gcd(l, n), 1), top = sel.reduce((s, n) => s + L / n, 0);
          return { text: `${sel.map(n => sqrtSym[n] + p).join(" · ")} = ${p}^q. q = ?`, answer: top / L, show: frac(top, L), tol: 0.01, placeholder: "kəsr, məs. 13/12",
            solution: `${sel.map(n => `${sqrtSym[n]}${p} = ${p}^(1/${n})`).join("; ")}. Üstləri topla: ${sel.map(n => "1/" + n).join(" + ")} = ${frac(top, L)}. Cavab: ${frac(top, L)}.` };
        }
        const a = pick([2, 3, 4, 7, 8, 9]), N = rnd(2005, 2040), cyc = last[a], d = cyc[(N - 1) % cyc.length];
        return { text: `${a}${E(N)} ədədinin son rəqəmi neçədir?`, answer: d, show: String(d), tol: 0.01,
          solution: `${a}-nın qüvvətlərinin son rəqəmləri dövr edir: ${cyc.join(", ")} (dövr ${cyc.length}). ${N} = ${cyc.length}·${Math.floor(N / cyc.length)} + ${N % cyc.length}` + (N % cyc.length ? `, qalıq ${N % cyc.length} → ${N % cyc.length}-ci rəqəm` : `, qalıq 0 → sonuncu rəqəm`) + `: ${d}.` };
      } },
    { id: "eyniesas", ad: "Eyni əsasa gətir", izah: "Hər iki tərəfi eyni əsasın qüvvəti et, sonra üstləri bərabərləşdir. Toplananlar varsa, ortaq vuruğu çıxar.",
      gen() {
        if (Math.random() < .55) {
          const b = pick([2, 3, 5]), us = b === 2 ? [-3, -2, -1, 1, 2, 3, 4] : b === 3 ? [-2, -1, 1, 2, 3] : [-2, -1, 1, 2];
          let u, v, al, ga, be, de, den;
          do { u = pick(us); v = pick(us); al = rnd(1, 3); ga = rnd(1, 3); be = rnd(-4, 4); de = rnd(-4, 4); den = u * al - v * ga; } while (den === 0);
          const num = v * de - u * be, ans = num / den;
          return { text: `${baseStr(b, u)}${E(ex(al, be))} = ${baseStr(b, v)}${E(ex(ga, de))}. x = ?`, answer: ans, show: frac(num, den), tol: 0.01, placeholder: "tam ədəd və ya kəsr",
            solution: `Hər iki tərəfi ${b} əsasına gətir (${baseStr(b, u)} = ${b}^(${u}), ${baseStr(b, v)} = ${b}^(${v})): sol ${b}^(${u}·(${lt(al, be)})) = ${b}^(${lt(u * al, u * be)}), sağ ${b}^(${lt(v * ga, v * de)}). Üstləri bərabərləşdir: ${lt(u * al, u * be)} = ${lt(v * ga, v * de)}. x-ləri bir tərəfə: ${lt(den, 0)} = ${S(num)}, x = ${frac(num, den)}.` };
        }
        const p = pick([2, 3, 5]);
        if (Math.random() < .5) {
          const a = rnd(1, 3), x0 = rnd(0, 4), s = pick([1, -1]), K = p ** x0 * (p ** a + s);
          return { text: `${p}${E("x+" + a)} ${s > 0 ? "+" : "−"} ${p}ˣ = ${K}. x = ?`, answer: x0, show: String(x0), tol: 0.01,
            solution: `${p}${E("x+" + a)} = ${p}${E(a)}·${p}ˣ = ${p ** a}·${p}ˣ. Ortaq vuruq ${p}ˣ: ${p}ˣ·(${p ** a} ${s > 0 ? "+" : "−"} 1) = ${p ** a + s}·${p}ˣ = ${K}. ${p}ˣ = ${p ** x0} → x = ${x0}.` };
        }
        const pp = pick([2, 3]), x0 = rnd(1, 5), K = pp ** (x0 - 1) * (pp * pp + pp + 1);
        return { text: `${pp}${E("x+1")} + ${pp}ˣ + ${pp}${E("x-1")} = ${K}. x = ?`, answer: x0, show: String(x0), tol: 0.01,
          solution: `Ən kiçik üstlü ${pp}${E("x-1")} ortaq vuruqdur: ${pp}${E("x-1")}·(${pp}² + ${pp} + 1) = ${pp * pp + pp + 1}·${pp}${E("x-1")} = ${K}. ${pp}${E("x-1")} = ${pp ** (x0 - 1)} → x − 1 = ${x0 - 1}, x = ${x0}.` };
      } },
    { id: "evez", ad: "t = aˣ əvəzləməsi", izah: "t = aˣ qoy (t > 0): a²ˣ = t², a^(x+k) = aᵏ·t, a⁻ˣ = 1/t. Kvadrat tənliyi həll et, mənfi/sıfır t-ləri at, qalanları üçün aˣ = t həll et.",
      gen() {
        const b = pick([2, 3, 5]);
        if (Math.random() < .6) {
          // roots of t: r = b^m (positive, nice), 1/b, or a negative number
          const kinds = ["pos", "pos", "inv", "neg"], rs = [];
          let m1 = rnd(0, 3), m2;
          rs.push({ t: "p", m: m1 });
          do { const kd = pick(kinds); if (kd === "pos") { m2 = rnd(0, 3); if (m2 === m1) continue; rs.push({ t: "p", m: m2 }); } else if (kd === "inv") { m2 = -1; if (m1 === -1) continue; rs.push({ t: "p", m: -1 }); } else { rs.push({ t: "n", m: rnd(0, 2), c: rnd(1, 9) }); } } while (rs.length < 2);
          // each root as polynomial factor (αt − β): b^m (m≥0) → (t − b^m); b^−1 → (b t − 1); negative −c → (t + c)
          const fac = r => r.t === "n" ? [1, r.c] : r.m >= 0 ? [1, -(b ** r.m)] : [b, -1];
          const facStr = r => r.t === "n" ? `(t + ${r.c})` : r.m >= 0 ? `(t − ${b ** r.m})` : `(${b}t − 1)`;
          const P = [fac(rs[0]), fac(rs[1])].reduce((p, q) => { const r = [0, 0, 0]; p.forEach((x, i) => q.forEach((y, j) => { r[i + j] += x * y; })); return r; });
          const k = pick([1, 1, 2]), c2 = P[0] * k, c1 = P[1] * k, c0 = P[2] * k;
          const t2 = `${b * b}ˣ`, t1 = `${b}ˣ`;
          const term = (c, nm, first) => { const a = Math.abs(c); return (first ? (c < 0 ? "−" : "") : (c < 0 ? " − " : " + ")) + (a === 1 ? nm : a + "·" + nm); };
          let txt = term(c2, t2, true); if (c1) txt += term(c1, t1, false); if (c0) txt += sg(c0);
          const good = rs.filter(r => r.t === "p").map(r => r.m);
          const ask = pick(["say", "cem", "max"]);
          const ans = ask === "say" ? good.length : ask === "cem" ? good.reduce((s, v) => s + v, 0) : Math.max(...good);
          const q = ask === "say" ? "Tənliyin neçə həqiqi kökü var?" : ask === "cem" ? "Həqiqi köklərinin cəmi neçədir?" : "Ən böyük kökü tap.";
          return { text: `${txt} = 0. ${q}`, answer: ans, show: S(ans), tol: 0.01,
            solution: `t = ${b}ˣ (t > 0) qoy, ${t2} = t². Tənlik ${k === 1 ? "" : k + "·"}${rs.map(facStr).join("")} = 0 şəklinə düşür → t = ${rs.map(r => r.t === "n" ? S(-r.c) : r.m >= 0 ? String(b ** r.m) : "1/" + b).join(", t = ")}` + (rs.some(r => r.t === "n") ? `. Mənfi t yararsızdır (${b}ˣ > 0).` : ".") + ` ${good.map(m => `${b}ˣ = ${m >= 0 ? b ** m : "1/" + b} → x = ${S(m)}`).join("; ")}. ` + (ask === "say" ? `Köklərin sayı: ${good.length}.` : ask === "cem" ? `Cəm: ${good.map(S).join(" + ").replace(/\+ −/g, "− ")} = ${S(ans)}.` : `Ən böyüyü: ${S(ans)}.`) };
        }
        let m1, m2; do { m1 = rnd(0, 4); m2 = rnd(0, 4); } while (m1 >= m2);
        const kk = m1 + m2, K = b ** m1 + b ** m2, ask = pick(["max", "cem", "say"]);
        const ans = ask === "max" ? m2 : ask === "cem" ? kk : 2;
        const q = ask === "max" ? "Ən böyük kökü tap." : ask === "cem" ? "Köklərinin cəmi neçədir?" : "Tənliyin neçə həqiqi kökü var?";
        return { text: `${b}ˣ + ${b}${E(kk + "-x")} = ${K}. ${q}`, answer: ans, show: String(ans), tol: 0.01,
          solution: `t = ${b}ˣ qoy, onda ${b}${E(kk + "-x")} = ${b ** kk}/t. t + ${b ** kk}/t = ${K} → t² − ${K}t + ${b ** kk} = 0 → t = ${b ** m1} və t = ${b ** m2} (hasil ${b ** kk}, cəm ${K}). ${b}ˣ = ${b ** m1} → x = ${m1}; ${b}ˣ = ${b ** m2} → x = ${m2}. ` + (ask === "max" ? `Ən böyüyü ${m2}.` : ask === "cem" ? `Cəm: ${m1} + ${m2} = ${kk}.` : "İki kök var.") };
      } },
    { id: "muqayise", ad: "Böyük qüvvətləri müqayisə et", izah: "Üstləri ortaq vuruğa görə qruplaşdır: a^(u·d) = (aᵘ)ᵈ. Sonra əsasları müqayisə et: aᵘ ilə bᵛ.",
      gen() {
        const mk = () => { let a, u, val; do { a = rnd(2, 7); u = rnd(1, 5); val = a ** u; } while (val > 90); return { a, u, val }; };
        const d = pick([10, 20, 25, 30, 40, 50, 100]), kind = pick(["bigger", "bigger", "smallest", "count"]);
        if (kind === "count") {
          let A, Bn; do { A = mk(); Bn = mk(); } while (!(Bn.val - A.val >= 2 && Bn.val - A.val <= 30) || A.a === Bn.a);
          const ans = Bn.val - A.val - 1;
          return { text: `${A.a}${E(A.u * d)} < n${E(d)} < ${Bn.a}${E(Bn.u * d)} bərabərsizliyini ödəyən neçə natural n var?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `${A.a}${E(A.u * d)} = (${A.a}${E(A.u)})${E(d)} = ${A.val}${E(d)}, ${Bn.a}${E(Bn.u * d)} = ${Bn.val}${E(d)}. ${A.val}${E(d)} < n${E(d)} < ${Bn.val}${E(d)} ⇔ ${A.val} < n < ${Bn.val}. Natural n: ${A.val + 1}, …, ${Bn.val - 1} — ${ans} dənə.` };
        }
        const m = kind === "bigger" ? 2 : 3, xs = [];
        while (xs.length < m) { const t = mk(); if (!xs.some(z => z.val === t.val || z.a === t.a)) xs.push(t); }
        const want = kind === "bigger" ? Math.max(...xs.map(z => z.val)) : Math.min(...xs.map(z => z.val));
        const nums = xs.map(z => `${z.a}${E(z.u * d)}`);
        const word = kind === "bigger" ? "ən böyük" : "ən kiçik";
        return { text: `${nums.join(", ")} ədədlərini müqayisə et. Onların ${word} ədədi n${E(d)} şəklində yazılır. n = ?`, answer: want, show: String(want), tol: 0.01,
          solution: `Hamısını ...${E(d)} şəklində yaz: ${xs.map(z => `${z.a}${E(z.u * d)} = (${z.a}${E(z.u)})${E(d)} = ${z.val}${E(d)}`).join("; ")}. ${d} eyni olduğundan əsasları müqayisə et: ${xs.map(z => z.val).join(", ")}. Cavab: n = ${want}.` };
      } },
    { id: "sistem", ad: "Üstlü sistemlər", izah: "Eyni əsasa gətir və xətti sistem qur; ya da tənlikləri vur və böl: 2ˣ·3ʸ = A, 2ʸ·3ˣ = B → 6^(x+y) = A·B, (2/3)^(x−y) = A/B.",
      gen() {
        if (Math.random() < .55) {
          const [p, q] = pick([[2, 3], [2, 5], [3, 5]]); let x, y; do { x = rnd(0, 4); y = rnd(0, 4); } while (x === y);
          const P = p ** x * q ** y, Q = p ** y * q ** x, ask = pick(["x", "y", "xy"]), ans = ask === "x" ? x : ask === "y" ? y : x * y;
          return { text: `${p}ˣ · ${q}ʸ = ${P},  ${p}ʸ · ${q}ˣ = ${Q}. ${ask === "xy" ? "x · y" : ask} = ?`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Vur: ${p * q}${E("x+y")} = ${P}·${Q} = ${P * Q} = ${p * q}${E(x + y)} → x + y = ${x + y}. Böl: (${p}/${q})${E("x-y")} = ${P}/${Q} = (${p}/${q})${E(x - y)} → x − y = ${S(x - y)}. Toplayıb x = ${x}, y = ${y}.` + (ask === "xy" ? ` x · y = ${ans}.` : ` Cavab: ${ans}.`) };
        }
        const p = pick([2, 3]), k = pick([2, 3]); let x, y; do { y = rnd(1, 4); x = y + rnd(1, 4); } while (false);
        const m = x + k * y, n = x - y, q = pick([3, 5, 7]);
        const ask = pick(["x", "y", "cem"]), ans = ask === "x" ? x : ask === "y" ? y : x + y;
        return { text: `${p}ˣ · ${p ** k}ʸ = ${p ** m},  ${q}${E("x-y")} = ${q ** n}. ${ask === "cem" ? "x + y" : ask} = ?`, answer: ans, show: String(ans), tol: 0.01,
          solution: `Birinci: ${p}ˣ · ${p}${E(k + "y")} = ${p}${E("x+" + k + "y")} = ${p}${E(m)} → x + ${k}y = ${m}. İkinci: ${q}${E("x-y")} = ${q}${E(n)} → x − y = ${n}. Çıxsaq: ${k + 1}y = ${m - n} → y = ${y}, x = ${x}.` + (ask === "cem" ? ` x + y = ${ans}.` : ` Cavab: ${ans}.`) };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "t = aˣ əvəzləməsi ilə həll: 1) kvadrat tənliyi düz yaz, 2) t-lərin kökləri, 3) mənfi t-ni at və x-i tap. Hər addımı yoxla.",
      gen() {
        const b = pick([2, 3, 5]); let m1, m2; do { m1 = rnd(0, 3); m2 = rnd(0, 3); } while (m1 === m2);
        const r1 = b ** m1, r2 = b ** m2, mid = r1 - r2, prod = -(r1 * r2);       // (t − r1)(t + r2) = t² − (r1 − r2)t − r1 r2
        const eq = md => `t²${tt(-md)}${sg(prod)} = 0`;
        const orig = `${b * b}ˣ${sg(-mid).replace(/ (\d+)$/, (m0, d) => " " + (d === "1" ? "" : d + "·") + b + "ˣ")}${sg(prod)} = 0`;
        const bad = rnd(0, 2);
        const s1 = `t = ${b}ˣ (t > 0) qoyuruq, ${b * b}ˣ = t². Tənlik: ${bad === 0 ? eq(-mid) : eq(mid)}.`;
        const s2 = bad === 1 ? `Kökləri: t = ${r1} və t = ${r2}.` : `Kökləri: t = ${r1} və t = ${S(-r2)}.`;
        const s3 = bad === 1 ? `Hər iki kök müsbətdir. ${b}ˣ = ${r1} → x = ${m1}; ${b}ˣ = ${r2} → x = ${m2}. Cavab: x = ${m1} və x = ${m2}.`
          : bad === 2 ? `t = ${S(-r2)} mənfidir, yararsızdır (${b}ˣ > 0). ${b}ˣ = ${r1} → x = ${r1}. Cavab: x = ${r1}.`
          : `t = ${S(-r2)} mənfidir, yararsızdır (${b}ˣ > 0). ${b}ˣ = ${r1} → x = ${m1}. Cavab: x = ${m1}.`;
        const text = h("div", {}, h("p", {}, `Elvin ${orig} tənliyini həll edir. Birinci səhv hansı addımdadır?`),
          h("ol", { class: "oy-steps" }, ...[s1, s2, s3].map(st => h("li", {}, st))));
        const why = [`1-ci addım: ${b * b}ˣ = t² olduğundan tənlik ${eq(mid)} olmalıdır (orta əmsalın işarəsi tənlikdəki kimi). Elvin işarəni dəyişdi. Düz cavab: x = ${m1}.`,
          `2-ci addım: ${eq(mid)} ⇔ (t − ${r1})(t + ${r2}) = 0, kökləri ${r1} və ${S(-r2)}, ${r2} yox. Düz cavab: x = ${m1}.`,
          `3-cü addım: ${b}ˣ = ${r1} = ${b}${E(m1)} → x = ${m1} (üst), ${r1} deyil. Qüvvətin qiymətini üstlə qarışdırma.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Hər dövrdə eyni dəfə artma/azalma = üstlü ifadə. Başlanğıc · əmsal^n = son; n-i tapmaq üçün eyni əsasa gətir və ya 2-nin qüvvətlərini say.",
      gen() {
        const kind = pick(["art", "yari", "qat"]);
        if (kind === "art") {
          const k = pick([2, 3]), n = k === 2 ? rnd(3, 9) : rnd(2, 6), A = pick([1, 2, 5, 10]), fin = A * k ** n;
          return { text: `Bakteriya kulturasında başlanğıcda ${A} bakteriya var. Hər saat onların sayı ${k} dəfə artır. Neçə saatdan sonra ${fin} bakteriya olar?`, answer: n, unit: "saat", show: String(n), tol: 0.01,
            solution: `n saatdan sonra ${A}·${k}${E("n")}. ${A}·${k}ⁿ = ${fin} → ${k}ⁿ = ${fin / A} = ${k}${E(n)} → n = ${n}.` };
        }
        if (kind === "yari") {
          const T = pick([2, 3, 5, 10]), n = rnd(2, 6), Mf = pick([5, 10, 20, 25]), M0 = Mf * 2 ** n, ans = n * T;
          return { text: `Radioaktiv maddənin kütləsi hər ${T} gündən bir yarıya düşür. Başlanğıcda kütlə ${M0} q idi, indi ${Mf} q qalıb. Nə qədər gün keçib?`, answer: ans, unit: "gün", show: String(ans), tol: 0.01,
            solution: `Kütlə ${M0} : ${Mf} = ${2 ** n} = 2${E(n)} dəfə azalıb, yəni ${n} dəfə yarıya düşüb. Hər dəfə ${T} gün: ${n} · ${T} = ${ans} gün.` };
        }
        const t0 = pick([1, 2, 5]), n = rnd(3, 8), res = t0 * 2 ** n, f = v => (v / 10).toString().replace(".", ",");
        return { text: `Kağızı hər dəfə yarıya qatlayırıq, hər qatlamada qalınlıq 2 dəfə artır. Bir vərəqin qalınlığı ${f(t0)} mm-dir. Neçə dəfə qatladıqda qalınlıq ${f(res)} mm olar?`, answer: n, show: String(n), tol: 0.01,
          solution: `Qalınlıq ${f(res)} : ${f(t0)} = ${2 ** n} = 2${E(n)} dəfə artıb. Hər qatlama 2 dəfə artırır, deməli ${n} dəfə qatlamaq lazımdır.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-ustlu", title: "Üstlü ifadələr, sadə üstlü tənliklər və sistemlər", fenn: "olimpiada", link: "dersler/ol-ustlu.html",
      format: "Cavab ədəddir: tam −7, kəsr 13/12, mənfi −2/3. Tənlikdə x-in qiymətini, ədədi kəmiyyəti (say, cəm) yaz.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["qaydalar", "eyniesas", "eyniesas", "evez", "evez", "muqayise", "muqayise", "sistem", "sehv", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-ustlu.html")) b.push("dersler/ol-ustlu.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
