// Çoxluqlar, Eyler-Venn diaqramı — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, svg?, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const sum = a => a.reduce((x, y) => x + y, 0);
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs, text) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (text != null) e.textContent = text; return e; };
  const setS = a => "{" + a.join("; ") + "}";
  const divisors = n => { const d = []; for (let i = 1; i <= n; i++) if (n % i === 0) d.push(i); return d; };
  const sample = (n, lo, hi) => { const out = new Set(); while (out.size < n) out.add(rnd(lo, hi)); return [...out].sort((a, b) => a - b); };

  // Two-set Venn: regions [only A, A∩B, only B, outside]; values are numbers or "?"
  function venn2(v, names = ["A", "B"]) {
    const g = sv("svg", { viewBox: "0 0 260 172", class: "oy-svg", role: "img", "aria-label": `Eyler-Venn diaqramı: ${names[0]} və ${names[1]} çoxluqları` });
    g.append(sv("rect", { x: 4, y: 4, width: 252, height: 164, rx: 6, fill: "none", stroke: "var(--ink)", "stroke-width": 1.5 }));
    g.append(sv("text", { x: 238, y: 24, class: "oy-lbl", "font-style": "italic" }, "U"));
    g.append(sv("circle", { cx: 100, cy: 88, r: 60, fill: "var(--accent-soft)", "fill-opacity": .6, stroke: "var(--accent)", "stroke-width": 2.5 }));
    g.append(sv("circle", { cx: 160, cy: 88, r: 60, fill: "var(--accent-soft)", "fill-opacity": .6, stroke: "var(--vec)", "stroke-width": 2.5 }));
    g.append(sv("text", { x: 42, y: 32, class: "oy-lbl", "font-style": "italic" }, names[0]));
    g.append(sv("text", { x: 210, y: 32, class: "oy-lbl", "font-style": "italic" }, names[1]));
    [[70, 93], [130, 93], [190, 93], [228, 154]].forEach(([x, y], i) => g.append(sv("text", { x, y, "text-anchor": "middle", class: "oy-lbl" }, String(v[i]))));
    return g;
  }
  // Three-set Venn: regions [only A, only B, only C, A∩B only, A∩C only, B∩C only, A∩B∩C, outside]
  function venn3(v) {
    const g = sv("svg", { viewBox: "0 0 260 222", class: "oy-svg", role: "img", "aria-label": "Eyler-Venn diaqramı: A, B və C çoxluqları" });
    g.append(sv("rect", { x: 4, y: 4, width: 252, height: 214, rx: 6, fill: "none", stroke: "var(--ink)", "stroke-width": 1.5 }));
    g.append(sv("text", { x: 238, y: 24, class: "oy-lbl", "font-style": "italic" }, "U"));
    [[100, 85, "var(--accent)"], [160, 85, "var(--vec)"], [130, 137, "var(--ink)"]].forEach(([cx, cy, c]) =>
      g.append(sv("circle", { cx, cy, r: 55, fill: "var(--accent-soft)", "fill-opacity": .45, stroke: c, "stroke-width": 2.2 })));
    g.append(sv("text", { x: 34, y: 40, class: "oy-lbl", "font-style": "italic" }, "A"));
    g.append(sv("text", { x: 216, y: 40, class: "oy-lbl", "font-style": "italic" }, "B"));
    g.append(sv("text", { x: 196, y: 196, class: "oy-lbl", "font-style": "italic" }, "C"));
    [[78, 76], [182, 76], [130, 170], [130, 62], [100, 124], [160, 124], [130, 103], [236, 206]].forEach(([x, y], i) =>
      g.append(sv("text", { x, y, "text-anchor": "middle", class: "oy-lbl" }, String(v[i]))));
    return g;
  }

  const CTX = [
    { yer: "Sinifdə", kim: "şagird", A: "şahmat dərnəyinə", B: "futbol bölməsinə", f: "gedir", yox: "heç birinə getmir", Aq: "yalnız şahmat dərnəyinə gedir", hq: "hər ikisinə gedir" },
    { yer: "Turist qrupunda", kim: "nəfər", A: "ingilis dilini", B: "rus dilini", f: "bilir", yox: "bu dillərin heç birini bilmir", Aq: "yalnız ingilis dilini bilir", hq: "hər iki dili bilir" },
    { yer: "Sorğu keçirilən qrupda", kim: "nəfər", A: "çay", B: "qəhvə", f: "içir", yox: "nə çay, nə qəhvə içir", Aq: "yalnız çay içir", hq: "həm çay, həm qəhvə içir" },
    { yer: "Yay düşərgəsində", kim: "uşaq", A: "üzgüçülüyə", B: "tennisə", f: "yazılıb", yox: "heç birinə yazılmayıb", Aq: "yalnız üzgüçülüyə yazılıb", hq: "hər ikisinə yazılıb" },
  ];

  const levels = [
    { id: "element", ad: "Çoxluğun elementləri", izah: "Elementləri sadala və say. n elementli çoxluğun 2ⁿ alt çoxluğu var (boş çoxluq və özü daxil).",
      gen() {
        const kind = pick(["div", "range", "abs", "sq", "sub", "sub", "mult"]);
        if (kind === "div") {
          const N = pick([12, 18, 20, 24, 28, 30, 36, 40, 42, 45, 48, 50, 54, 60, 64, 72, 84, 90, 96, 100]), d = divisors(N);
          return { text: `A — ${N} ədədinin natural bölənləri çoxluğudur. n(A) = ?`, answer: d.length, show: String(d.length), tol: 0.01,
            solution: `A = ${setS(d)}. Elementlərin sayı: ${d.length}.` };
        }
        if (kind === "range") {
          const a = rnd(-8, 5), b = a + rnd(3, 12), L = pick(["≤", "<"]), Rr = pick(["≤", "<"]);
          const xs = []; for (let x = a; x <= b; x++) if ((L === "≤" ? x >= a : x > a) && (Rr === "≤" ? x <= b : x < b)) xs.push(x);
          return { text: `A = {x ∈ Z | ${S(a)} ${L} x ${Rr} ${S(b)}}. A çoxluğunun neçə elementi var?`, answer: xs.length, show: String(xs.length), tol: 0.01,
            solution: `Tam ədədlər: ${xs.map(S).join("; ")} — cəmi ${xs.length}. ${L === "<" ? S(a) + " daxil deyil" : S(a) + " daxildir"}, ${Rr === "<" ? S(b) + " daxil deyil" : S(b) + " daxildir"}.` };
        }
        if (kind === "abs") {
          const k = rnd(2, 9), le = Math.random() < .5, c = le ? 2 * k + 1 : 2 * k - 1, m = le ? k : k - 1;
          return { text: `A = {x ∈ Z | |x| ${le ? "≤" : "<"} ${k}}. n(A) = ?`, answer: c, show: String(c), tol: 0.01,
            solution: `${le ? "−" + k + " ≤ x ≤ " + k : "−" + k + " < x < " + k}: tam ədədlər ${m <= 3 ? Array.from({ length: 2 * m + 1 }, (_, t) => S(t - m)).join("; ") : "−" + m + "; …; −1; 0; 1; …; " + m} — ${m} mənfi, ${m} müsbət və 0. Cəmi ${c}.` };
        }
        if (kind === "sq") {
          const k = rnd(5, 120), xs = []; for (let x = 1; x * x < k; x++) xs.push(x);
          return { text: `A = {x ∈ N | x² < ${k}}. n(A) = ?`, answer: xs.length, show: String(xs.length), tol: 0.01,
            solution: `Natural ədədlər 1-dən başlayır. x² < ${k}: ${xs.map(x => x + "² = " + x * x).slice(-2).join(", ")}` + `, ${xs.length + 1}² = ${(xs.length + 1) ** 2} artıq ≥ ${k}. A = ${setS(xs)}, ${xs.length} element.` };
        }
        if (kind === "sub") {
          const n = rnd(2, 6), els = pick([["a", "b", "c", "d", "e", "f"], ["1", "2", "3", "4", "5", "6"], ["k", "l", "m", "n", "p", "q"], ["2", "4", "6", "8", "10", "12"]]).slice(0, n);
          const v = pick(["all", "all", "proper", "nonempty"]), c = v === "all" ? 2 ** n : 2 ** n - 1;
          const q = { all: "neçə alt çoxluğu var?", proper: "özündən fərqli neçə alt çoxluğu var?", nonempty: "boş çoxluqdan fərqli neçə alt çoxluğu var?" }[v];
          return { text: `A = ${setS(els)}. A çoxluğunun ${q}`, answer: c, show: String(c), tol: 0.01,
            solution: `n(A) = ${n}, bütün alt çoxluqların sayı 2${"⁰¹²³⁴⁵⁶"[n]} = ${2 ** n}` + (v === "all" ? `.` : v === "proper" ? `. A-nın özünü çıxırıq: ${2 ** n} − 1 = ${c}.` : `. Boş çoxluğu çıxırıq: ${2 ** n} − 1 = ${c}.`) };
        }
        const k = rnd(3, 13), two = Math.random() < .5;
        if (two) { const c = Math.floor(99 / k) - Math.floor(9 / k);
          return { text: `A — ${k} ədədinə bölünən ikirəqəmli natural ədədlər çoxluğudur. n(A) = ?`, answer: c, show: String(c), tol: 0.01,
            solution: `1, 2, …, 99 ədədləri arasında ${k} ədədinə bölünənlər: ${Math.floor(99 / k)}, birrəqəmlilər: ${Math.floor(9 / k)}. ${Math.floor(99 / k)} − ${Math.floor(9 / k)} = ${c}.` }; }
        const M = rnd(30, 120), c = Math.floor(M / k);
        return { text: `A = {x ∈ N | x ≤ ${M}, x ədədi ${k} ədədinə bölünür}. n(A) = ?`, answer: c, show: String(c), tol: 0.01,
          solution: `${k}, ${2 * k}, …, ${k * c}: ${M} : ${k} = ${c}${M % k ? " (qalıq " + (M % k) + ")" : ""}. Cəmi ${c} element.` };
      } },
    { id: "emel", ad: "Birləşmə, kəsişmə, fərq", izah: "A ∪ B — ən azı birində olanlar; A ∩ B — hər ikisində olanlar; A \\ B — A-da olub B-də olmayanlar.",
      gen() {
        const kind = pick(["list", "list", "list", "div", "mult", "int"]);
        if (kind === "list") {
          let A, B, I; do { A = sample(rnd(4, 7), 1, 20); B = sample(rnd(4, 7), 1, 20); I = A.filter(x => B.includes(x)); } while (!I.length || I.length === A.length || I.length === B.length);
          const U = [...new Set([...A, ...B])].sort((a, b) => a - b), AB = A.filter(x => !B.includes(x)), BA = B.filter(x => !A.includes(x));
          const ask = pick(["u", "i", "ab", "ba", "isum", "imax"]);
          const T = `A = ${setS(A)}, B = ${setS(B)}.`;
          const r = {
            u: [`n(A ∪ B) = ?`, U.length, `A ∪ B = ${setS(U)} — ${U.length} element (ortaq elementləri bir dəfə sayırıq).`],
            i: [`n(A ∩ B) = ?`, I.length, `A ∩ B = ${setS(I)} — ${I.length} element.`],
            ab: [`n(A \\ B) = ?`, AB.length, `A \\ B = ${setS(AB)} — A-da olub B-də olmayanlar, ${AB.length} element.`],
            ba: [`n(B \\ A) = ?`, BA.length, `B \\ A = ${setS(BA)} — B-də olub A-da olmayanlar, ${BA.length} element.`],
            isum: [`A ∩ B çoxluğunun elementlərinin cəmini tap.`, sum(I), `A ∩ B = ${setS(I)}. Cəm: ${I.join(" + ")} = ${sum(I)}.`],
            imax: [`A ∪ B çoxluğunun ən kiçik və ən böyük elementlərinin cəmini tap.`, U[0] + U[U.length - 1], `A ∪ B = ${setS(U)}. ${U[0]} + ${U[U.length - 1]} = ${U[0] + U[U.length - 1]}.`],
          }[ask];
          return { text: `${T} ${r[0]}`, answer: r[1], show: String(r[1]), tol: 0.01, solution: r[2] };
        }
        if (kind === "div") {
          let m, n; do { m = pick([12, 18, 20, 24, 30, 36, 40, 42, 45, 48, 60]); n = pick([8, 12, 15, 16, 18, 20, 27, 28, 30, 32, 36]); } while (m === n || gcd(m, n) === 1);
          const A = divisors(m), B = divisors(n), I = A.filter(x => B.includes(x)), un = Math.random() < .4;
          if (un) { const c = A.length + B.length - I.length;
            return { text: `A — ${m} ədədinin natural bölənləri, B — ${n} ədədinin natural bölənləri çoxluğudur. n(A ∪ B) = ?`, answer: c, show: String(c), tol: 0.01,
              solution: `A = ${setS(A)} (${A.length}), B = ${setS(B)} (${B.length}), A ∩ B = ${setS(I)} (${I.length}). n(A ∪ B) = ${A.length} + ${B.length} − ${I.length} = ${c}.` }; }
          return { text: `A — ${m} ədədinin natural bölənləri, B — ${n} ədədinin natural bölənləri çoxluğudur. n(A ∩ B) = ?`, answer: I.length, show: String(I.length), tol: 0.01,
            solution: `Ortaq bölənlər — ƏBOB(${m}; ${n}) = ${gcd(m, n)} ədədinin bölənləridir: ${setS(I)}. Cəmi ${I.length}.` };
        }
        if (kind === "mult") {
          let p, q; do { p = rnd(2, 6); q = rnd(2, 7); } while (p >= q || gcd(p, q) !== 1);
          const M = rnd(30, 100), a = Math.floor(M / p), b = Math.floor(M / q), c = Math.floor(M / (p * q)), ask = pick(["i", "u", "ab"]);
          const head = `A = {x ∈ N | x ≤ ${M}, x ədədi ${p} ədədinə bölünür}, B = {x ∈ N | x ≤ ${M}, x ədədi ${q} ədədinə bölünür}.`;
          const base = `n(A) = ${M} : ${p} → ${a}, n(B) = ${M} : ${q} → ${b}. A ∩ B — ${p * q} ədədinə bölünənlər (${p} və ${q} qarşılıqlı sadədir): ${c}.`;
          if (ask === "i") return { text: `${head} n(A ∩ B) = ?`, answer: c, show: String(c), tol: 0.01, solution: base };
          if (ask === "u") return { text: `${head} n(A ∪ B) = ?`, answer: a + b - c, show: String(a + b - c), tol: 0.01, solution: `${base} n(A ∪ B) = ${a} + ${b} − ${c} = ${a + b - c}.` };
          return { text: `${head} n(A \\ B) = ?`, answer: a - c, show: String(a - c), tol: 0.01, solution: `${base} n(A \\ B) = ${a} − ${c} = ${a - c}.` };
        }
        // integer points of interval operations
        const a = rnd(-9, 2), b = a + rnd(4, 10), c = rnd(a + 1, b - 1), d = c + rnd(3, 10);
        const br = () => pick([["[", "]"], ["(", ")"], ["[", ")"], ["(", "]"]]);
        const [la, ra] = br(), [lc, rc] = br();
        const inA = x => (la === "[" ? x >= a : x > a) && (ra === "]" ? x <= b : x < b), inB = x => (lc === "[" ? x >= c : x > c) && (rc === "]" ? x <= d : x < d);
        const op = pick(["i", "u"]), xs = []; for (let x = a - 1; x <= d + 1; x++) if (op === "i" ? inA(x) && inB(x) : inA(x) || inB(x)) xs.push(x);
        return { text: `A = ${la}${S(a)}; ${S(b)}${ra}, B = ${lc}${S(c)}; ${S(d)}${rc}. A ${op === "i" ? "∩" : "∪"} B çoxluğuna neçə tam ədəd daxildir?`, answer: xs.length, show: String(xs.length), tol: 0.01,
          solution: `Kvadrat mötərizə — uc daxildir, dairəvi — daxil deyil. A ${op === "i" ? "∩" : "∪"} B-dəki tam ədədlər: ${xs.length ? "ən kiçiyi " + S(xs[0]) + ", ən böyüyü " + S(xs[xs.length - 1]) : "yoxdur"} — ${xs.length} ədəd.` };
      } },
    { id: "venn", ad: "Eyler-Venn diaqramı", izah: "Diaqramda hər hissədə neçə element olduğu yazılıb. Lazım olan hissələri topla.",
      gen() {
        const v = [rnd(1, 15), rnd(1, 12), rnd(1, 15), rnd(0, 12)], [a, i, b, o] = v;
        const ask = pick(["A", "B", "u", "ab", "ba", "U", "sym", "notA"]);
        const r = {
          A: [`n(A) = ?`, a + i, `A çevrəsinin hər iki hissəsi: ${a} + ${i} = ${a + i}.`],
          B: [`n(B) = ?`, b + i, `B çevrəsinin hər iki hissəsi: ${i} + ${b} = ${b + i}.`],
          u: [`n(A ∪ B) = ?`, a + i + b, `Çevrələrin içindəki bütün hissələr: ${a} + ${i} + ${b} = ${a + i + b}.`],
          ab: [`n(A \\ B) = ?`, a, `A-da olub B-də olmayan hissə: ${a}.`],
          ba: [`n(B \\ A) = ?`, b, `B-də olub A-da olmayan hissə: ${b}.`],
          U: [`Universal çoxluq U-nun neçə elementi var?`, a + i + b + o, `Bütün hissələr, çevrələrdən kənardakı da: ${a} + ${i} + ${b} + ${o} = ${a + i + b + o}.`],
          sym: [`Yalnız bir çoxluğa daxil olan elementlər neçədir?`, a + b, `Yalnız A: ${a}, yalnız B: ${b}. ${a} + ${b} = ${a + b}. Ortaq hissə (${i}) sayılmır.`],
          notA: [`U-nun A-ya daxil olmayan elementləri neçədir?`, b + o, `A-dan kənar: yalnız B hissəsi və çevrələrdən kənar: ${b} + ${o} = ${b + o}.`],
        }[ask];
        return { text: `Diaqramda A və B çoxluqlarının hər hissəsindəki elementlərin sayı yazılıb. ${r[0]}`, svg: venn2(v), answer: r[1], show: String(r[1]), tol: 0.01, solution: r[2] };
      } },
    { id: "dustur", ad: "n(A ∪ B) düsturu", izah: "n(A ∪ B) = n(A) + n(B) − n(A ∩ B). Dörd ədəddən üçü verilib — dördüncünü tap.",
      gen() {
        const i = rnd(1, 20), oa = rnd(1, 30), ob = rnd(1, 30), A = oa + i, B = ob + i, U = oa + i + ob;
        const ask = pick(["u", "i", "i", "A", "ab"]);
        if (ask === "u") return { text: `n(A) = ${A}, n(B) = ${B}, n(A ∩ B) = ${i}. n(A ∪ B) = ?`, answer: U, show: String(U), tol: 0.01,
          solution: `${A} + ${B} − ${i} = ${U}. Ortaq elementlər iki dəfə sayılmasın deyə bir dəfə çıxırıq.` };
        if (ask === "i") return { text: `n(A) = ${A}, n(B) = ${B}, n(A ∪ B) = ${U}. n(A ∩ B) = ?`, answer: i, show: String(i), tol: 0.01,
          solution: `${U} = ${A} + ${B} − n(A ∩ B) → n(A ∩ B) = ${A + B} − ${U} = ${i}.` };
        if (ask === "A") return { text: `n(A ∪ B) = ${U}, n(B) = ${B}, n(A ∩ B) = ${i}. n(A) = ?`, answer: A, show: String(A), tol: 0.01,
          solution: `${U} = n(A) + ${B} − ${i} → n(A) = ${U} − ${B} + ${i} = ${A}.` };
        return { text: `n(A ∪ B) = ${U}, n(B) = ${B}, n(A) = ${A}. n(A \\ B) = ?`, answer: oa, show: String(oa), tol: 0.01,
          solution: `n(A ∩ B) = ${A} + ${B} − ${U} = ${i}. n(A \\ B) = n(A) − n(A ∩ B) = ${A} − ${i} = ${oa}.` };
      } },
    { id: "uc", ad: "Üç çoxluq", izah: "Üç çevrə 8 hissə yaradır. Sualdakı şərtə uyğun hissələri seç və topla.",
      gen() {
        const v = [rnd(1, 12), rnd(1, 12), rnd(1, 12), rnd(1, 9), rnd(1, 9), rnd(1, 9), rnd(1, 7), rnd(0, 10)];
        const [a, b, c, ab, ac, bc, abc, o] = v;
        const ask = pick(["A", "AB", "U3", "one", "two", "onlyA", "ABuC", "BC"]);
        const r = {
          A: [`n(A) = ?`, a + ab + ac + abc, `A çevrəsinin 4 hissəsi: ${a} + ${ab} + ${ac} + ${abc} = ${a + ab + ac + abc}.`],
          AB: [`n(A ∩ B) = ?`, ab + abc, `A və B-nin ortaq hissəsi iki parçadır (C-yə daxil olan və olmayan): ${ab} + ${abc} = ${ab + abc}.`],
          BC: [`n(B ∩ C) = ?`, bc + abc, `B və C-nin ortaq hissəsi: ${bc} + ${abc} = ${bc + abc}.`],
          U3: [`n(A ∪ B ∪ C) = ?`, a + b + c + ab + ac + bc + abc, `Çevrələrin içindəki 7 hissə: ${[a, b, c, ab, ac, bc, abc].join(" + ")} = ${a + b + c + ab + ac + bc + abc}.`],
          one: [`Yalnız bir çoxluğa daxil olan elementlər neçədir?`, a + b + c, `Yalnız A, yalnız B, yalnız C: ${a} + ${b} + ${c} = ${a + b + c}.`],
          two: [`Ən azı iki çoxluğa daxil olan elementlər neçədir?`, ab + ac + bc + abc, `Düz iki çoxluğa: ${ab} + ${ac} + ${bc}, üçünə də: ${abc}. Cəmi ${ab + ac + bc + abc}.`],
          onlyA: [`n(A \\ (B ∪ C)) = ?`, a, `A-da olub nə B-də, nə C-də olmayan hissə: ${a}.`],
          ABuC: [`n((A ∪ B) ∩ C) = ?`, ac + bc + abc, `C-nin A və ya B ilə ortaq hissələri: ${ac} + ${bc} + ${abc} = ${ac + bc + abc}.`],
        }[ask];
        return { text: `Diaqramda A, B, C çoxluqlarının hər hissəsindəki elementlərin sayı yazılıb. ${r[0]}`, svg: venn3(v), answer: r[1], show: String(r[1]), tol: 0.01, solution: r[2] };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Məsələni Venn diaqramına köçür: əvvəl ortaq hissəni tap, sonra qalanları.",
      gen() {
        const C = pick(CTX), kind = pick(["both", "both", "onlyA", "none", "three"]);
        if (kind === "three") {
          const v = [rnd(1, 8), rnd(1, 8), rnd(1, 8), rnd(1, 5), rnd(1, 5), rnd(1, 5), rnd(1, 4)], [a, b, c, ab, ac, bc, abc] = v;
          const nA = a + ab + ac + abc, nB = b + ab + bc + abc, nC = c + ac + bc + abc, AB = ab + abc, AC = ac + abc, BC = bc + abc, T = sum(v);
          return { text: `Sinifdəki hər şagird ən azı bir dərnəyə gedir. Rəsm dərnəyinə ${nA}, musiqiyə ${nB}, rəqsə ${nC} şagird gedir. Rəsm və musiqiyə ${AB}, rəsm və rəqsə ${AC}, musiqi və rəqsə ${BC}, hər üçünə ${abc} şagird gedir. Sinifdə neçə şagird var?`,
            answer: T, unit: "şagird", show: String(T), tol: 0.01,
            solution: `n(A ∪ B ∪ C) = n(A) + n(B) + n(C) − n(A∩B) − n(A∩C) − n(B∩C) + n(A∩B∩C) = ${nA} + ${nB} + ${nC} − ${AB} − ${AC} − ${BC} + ${abc} = ${T}.` };
        }
        const both = rnd(2, 12), oa = rnd(2, 15), ob = rnd(2, 15), no = rnd(1, 8), A = oa + both, B = ob + both, N = oa + both + ob + no;
        const head = `${C.yer} ${N} ${C.kim} var. Onlardan ${A} nəfər ${C.A}, ${B} nəfər ${C.B} ${C.f}`;
        if (kind === "both") return { text: `${head}, ${no} nəfər ${C.yox}. Neçə nəfər ${C.hq}?`,
          answer: both, show: String(both), tol: 0.01,
          solution: `Ən azı birinə aid olanlar: ${N} − ${no} = ${N - no}. n(A ∩ B) = ${A} + ${B} − ${N - no} = ${both}.` };
        if (kind === "onlyA") return { text: `${head}, ${no} nəfər ${C.yox}. Neçə nəfər ${C.Aq}?`,
          answer: oa, show: String(oa), tol: 0.01,
          solution: `Ən azı birinə aid olanlar: ${N} − ${no} = ${N - no}. Hər ikisi: ${A} + ${B} − ${N - no} = ${both}. Yalnız birinci: ${A} − ${both} = ${oa}.` };
        return { text: `${head}, ${both} nəfər isə ${C.hq}. Neçə nəfər ${C.yox}?`,
          answer: no, show: String(no), tol: 0.01,
          solution: `Ən azı birinə aid olanlar: ${A} + ${B} − ${both} = ${A + B - both}. Heç birinə aid olmayanlar: ${N} − ${A + B - both} = ${no}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const both = rnd(2, 10), oa = rnd(3, 12), ob = rnd(3, 12), no = rnd(2, 7), A = oa + both, B = ob + both, N = oa + both + ob + no, L = N - no;
        const head = `Sinifdə ${N} şagird var. ${A} nəfər şahmat dərnəyinə, ${B} nəfər futbol bölməsinə gedir, ${no} nəfər heç birinə getmir. Neçə şagird yalnız şahmata gedir?`;
        const steps = [`Ən azı birinə gedənlər: ${N} − ${no} = ${L}.`, `Hər ikisinə gedənlər: ${A} + ${B} − ${L} = ${both}.`, `Yalnız şahmata: ${A} − ${both} = ${oa}.`];
        const bad = rnd(0, 2);
        if (bad === 0) steps[0] = `Ən azı birinə gedənlər: ${N} + ${no} = ${N + no}.`;
        if (bad === 1) steps[1] = `Hər ikisinə gedənlər: ${A} + ${B} − ${N} = ${S(A + B - N)}.`;
        if (bad === 2) steps[2] = pick([`Yalnız şahmata: ${A} + ${both} = ${A + both}.`, `Yalnız şahmata: ${A} − ${B} = ${A - B}.`.replace(`= ${A - B}.`, `= ${S(A - B)}.`)]);
        const why = [`1-ci addım: heç birinə getməyənlər çıxılmalıdır: ${N} − ${no} = ${L}.`,
          `2-ci addım: ${N} yox, ən azı birinə gedənlərin sayı (${L}) götürülməlidir: ${A} + ${B} − ${L} = ${both}.`,
          `3-cü addım: şahmata gedənlərdən hər ikisinə gedənlər çıxılır: ${A} − ${both} = ${oa}.`][bad];
        const text = h("div", {}, h("p", {}, head), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
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
      key: "coxluqlar", title: "Çoxluqlar, Eyler-Venn diaqramı", fenn: "riyaziyyat", link: "dersler/coxluqlar.html",
      format: "Cavab ədəddir — adətən elementlərin sayı: 7, 12, 0.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["element", "emel", "emel", "venn", "venn", "dustur", "dustur", "uc", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/coxluqlar.html")) b.push("dersler/coxluqlar.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
