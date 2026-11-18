// Nisbət, tənasüb, düz və tərs mütənasiblik — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const lcm = (a, b) => a / gcd(a, b) * b;
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const D = x => { const r = Math.round(x * 1e4) / 1e4; return (r < 0 ? "−" : "") + String(Math.abs(r)).replace(".", ","); };
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const coprime = (lo, hi) => { let p, q; do { p = rnd(lo, hi); q = rnd(lo, hi); } while (p === q || gcd(p, q) !== 1); return [p, q]; };
  const distinct = (n, a, b) => { const o = []; while (o.length < n) { const v = rnd(a, b); if (!o.includes(v)) o.push(v); } return o; };
  const ord = ["Birinci", "İkinci", "Üçüncü"];

  // inverse-proportion pairs n·t = W with a nice new count m (m ≠ n, W divisible by m)
  const WORK = [];
  for (let n = 2; n <= 12; n++) for (let t = 2; t <= 30; t++) for (let m = 2; m <= 15; m++) if (m !== n && (n * t) % m === 0 && (n * t) / m !== t) WORK.push([n, t, m, n * t / m]);

  const levels = [
    { id: "nisbet", ad: "Nisbət", izah: "Nisbət — bölmədir. Əvvəl vahidləri eyniləşdir, sonra ixtisar et. Cavab: nisbətin qiyməti (kəsr).",
      gen() {
        const kind = pick(["simple", "unit", "unit", "chain"]);
        if (kind === "simple") {
          const [p, q] = coprime(1, 9), k = rnd(2, 12);
          return { text: `${p * k} : ${q * k} nisbətinin qiymətini tap (ixtisar olunmuş kəsr kimi).`, answer: p / q, show: frac(p, q), placeholder: "məs. 3/4",
            solution: `${p * k} : ${q * k} = ${p * k}/${q * k}. Hər ikisini ${k}-ə böl: ${frac(p, q)}.` };
        }
        if (kind === "unit") {
          const U = pick([["m", "sm", 100], ["kq", "q", 1000], ["saat", "dəqiqə", 60], ["km", "m", 1000], ["manat", "qəpik", 100]]);
          let B, tot, q, p;
          do { B = rnd(1, 6); tot = B * U[2]; q = pick([2, 3, 4, 5, 6, 8, 10]); } while (tot % q);
          do { p = rnd(1, 2 * q); } while (p === q || gcd(p, q) !== 1);
          const a = p * tot / q;
          return { text: `${a} ${U[1]} : ${B} ${U[0]} nisbətinin qiymətini tap (kəsr kimi).`, answer: p / q, show: frac(p, q), placeholder: "məs. 2/5",
            solution: `Vahidləri eyniləşdir: ${B} ${U[0]} = ${tot} ${U[1]}. ${a} : ${tot} = ${frac(p, q)}.` };
        }
        const [p1, q1] = coprime(1, 7), [p2, q2] = coprime(1, 7);
        return { text: `a : b = ${p1} : ${q1}, b : c = ${p2} : ${q2}. a : c nisbətinin qiymətini tap.`, answer: p1 * p2 / (q1 * q2), show: frac(p1 * p2, q1 * q2), placeholder: "məs. 8/15",
          solution: `a/c = (a/b)·(b/c) = ${p1}/${q1} · ${p2}/${q2} = ${frac(p1 * p2, q1 * q2)}.` };
      } },
    { id: "tenasub", ad: "Tənasübün naməlum həddi", izah: "Kənar hədlərin hasili = orta hədlərin hasili: a : b = c : d → a·d = b·c.",
      gen() {
        const kind = pick(["four", "four", "shift", "terms"]);
        if (kind === "terms") {
          const [a, b] = [rnd(2, 12), rnd(2, 12)], c = rnd(2, 12), P = a * b * c, mid = pick([true, false]);
          // known product of one pair and one member of the other pair
          const known = c, ans = a * b;
          return { text: `Tənasübün ${mid ? "kənar" : "orta"} hədlərinin hasili ${P}-dir. ${mid ? "Orta" : "Kənar"} hədlərdən biri ${known}-dir. O biri ${mid ? "orta" : "kənar"} hədd neçədir?`,
            answer: ans, show: String(ans), tol: 0.01,
            solution: `Tənasübün əsas xassəsi: kənar hədlərin hasili orta hədlərin hasilinə bərabərdir. Deməli, o biri cütün hasili də ${P}-dir: ${P} : ${known} = ${ans}.` };
        }
        const m = rnd(1, 9), n = rnd(1, 9), [p, q] = coprime(1, 9);
        let t = [m * p, m * q, n * p, n * q];
        if (m === n) t = [m * p, m * q, (n + 1) * p, (n + 1) * q];
        const hide = rnd(0, 3), ans = t[hide];
        const show = t.map((v, i) => i === hide ? "x" : String(v));
        const prod = hide === 0 || hide === 3 ? [t[1], t[2], t[3 - hide]] : [t[0], t[3], t[3 - hide]];
        if (kind === "shift") {
          const s = pick([-1, 1]) * rnd(1, 9), x = ans - s;
          show[hide] = "(x " + (s < 0 ? "− " + (-s) : "+ " + s) + ")";
          return { text: `${show[0]} : ${show[1]} = ${show[2]} : ${show[3]}. x = ?`, answer: x, show: S(x), tol: 0.01,
            solution: `Əsas xassə: ${show[hide]} = ${prod[0]} · ${prod[1]} : ${prod[2]} = ${ans}. Onda x = ${ans} ${s < 0 ? "+ " + (-s) : "− " + s} = ${S(x)}.` };
        }
        const frm = Math.random() < .5 ? `${show[0]} : ${show[1]} = ${show[2]} : ${show[3]}` : `${show[0]}/${show[1]} = ${show[2]}/${show[3]}`;
        return { text: `${frm}. x = ?`, answer: ans, show: String(ans), tol: 0.01,
          solution: `Kənar hədlərin hasili = orta hədlərin hasili. x = ${prod[0]} · ${prod[1]} : ${prod[2]} = ${prod[0] * prod[1]} : ${prod[2]} = ${ans}.` };
      } },
    { id: "tani", ad: "Düz, tərs, yoxsa heç biri?", izah: "Düz: y/x sabitdir (biri neçə dəfə artırsa, o biri də). Tərs: x·y sabitdir (biri artanda o biri eyni dəfə azalır).",
      gen() {
        const names = ["Düz mütənasibdir", "Tərs mütənasibdir", "Heç biri"];
        if (Math.random() < .35) {
          const ST = [
            ["Eyni növ almanın kütləsi və onun üçün ödənilən pul", 0], ["Sabit sürətlə gedən avtomobilin yolu və vaxtı", 0],
            ["Kvadratın tərəfi və perimetri", 0], ["Çevrənin radiusu və uzunluğu", 0], ["Eyni dəftərlərin sayı və onların qiyməti", 0],
            ["Eyni işi görən (eyni məhsuldarlıqlı) fəhlələrin sayı və işin vaxtı", 1], ["Eyni yolu gedən avtomobilin sürəti və vaxtı", 1],
            ["Sahəsi 24 sm² olan düzbucaqlının eni və uzunluğu", 1], ["Sabit pula alınan eyni malın qiyməti və sayı", 1], ["Eyni hovuzu dolduran eyni boruların sayı və dolma vaxtı", 1],
            ["Kvadratın tərəfi və sahəsi", 2], ["İnsanın yaşı və boyu", 2], ["Taksidə: oturma haqqı + hər km üçün haqq; məsafə və ödəniş", 2],
            ["Düzbucaqlının perimetri sabitdirsə, eni və uzunluğu", 2], ["Kubun tili və həcmi", 2],
          ];
          const [s, c] = pick(ST);
          return { text: `${s}. Bu kəmiyyətlər necə asılıdır?`, choices: names, correct: c, show: names[c],
            solution: c === 0 ? "Biri neçə dəfə artırsa, o biri də o qədər dəfə artır — nisbət sabitdir: düz mütənasib." :
              c === 1 ? "Biri neçə dəfə artırsa, o biri o qədər dəfə azalır — hasil sabitdir: tərs mütənasib." :
                "Nə nisbət, nə hasil sabit deyil (məs. tərəf 2 dəfə artanda sahə 4 dəfə artır; sabit əlavə haqq da mütənasibliyi pozur): heç biri." };
        }
        const c = rnd(0, 2);
        let xs, ys;
        if (c === 0) { const k = rnd(2, 9); xs = distinct(4, 1, 12).sort((a, b) => a - b); ys = xs.map(x => k * x); }
        else if (c === 1) { const K = pick([12, 24, 36, 48, 60, 72]); const dv = []; for (let d = 1; d <= K; d++) if (K % d === 0 && d <= 24) dv.push(d); xs = []; while (xs.length < 4) { const d = pick(dv); if (!xs.includes(d)) xs.push(d); } xs.sort((a, b) => a - b); ys = xs.map(x => K / x); }
        else { const k = rnd(2, 6), b = rnd(1, 9); xs = distinct(4, 1, 10).sort((a, b) => a - b); ys = Math.random() < .5 ? xs.map(x => k * x + b) : xs.map(x => x * x); }
        const row = (lab, arr) => h("tr", {}, h("th", {}, lab), ...arr.map(v => h("td", {}, String(v))));
        const text = h("div", {}, h("p", {}, "Cədvəldə x və y kəmiyyətlərinin qiymətləri verilib. Onlar necə asılıdır?"),
          h("div", { class: "tbl" }, h("table", {}, row("x", xs), row("y", ys))));
        const why = c === 0 ? `y/x hər sütunda eynidir: ${ys[0]}/${xs[0]} = ${ys[3]}/${xs[3]} = ${ys[0] / xs[0]}. Düz mütənasib.` :
          c === 1 ? `x·y hər sütunda eynidir: ${xs[0]}·${ys[0]} = ${xs[3]}·${ys[3]} = ${xs[0] * ys[0]}. Tərs mütənasib.` :
            `y/x sabit deyil (${ys[0]}/${xs[0]} ≠ ${ys[3]}/${xs[3]}), x·y də sabit deyil (${xs[0] * ys[0]} ≠ ${xs[3] * ys[3]}). Heç biri.`;
        return { text, choices: names, correct: c, show: names[c], solution: why };
      } },
    { id: "duz-ters", ad: "Düz və tərs mütənasib məsələ", izah: "Əvvəl qərar ver: düz, yoxsa tərs? Düz — nisbət saxlanır; tərs — hasil saxlanır.",
      gen() {
        if (Math.random() < .5) {
          const C = pick([
            [[1.5, 2, 2.5, 3, 4], (a, A, b) => `${a} kq alma ${D(A)} manatdır. Eyni almanın ${b} kq-ı neçə manatdır?`],
            [[8, 10, 12, 15], (a, A, b) => `Avtomobil ${a} litr benzinlə ${D(A)} km yol gedir. Eyni sərfiyyatla ${b} litr benzinlə neçə km yol gedər?`],
            [[3, 4, 5, 6, 7, 8], (a, A, b) => `${a} metr parça ${D(A)} manatdır. Eyni parçanın ${b} metri neçə manatdır?`],
            [[12, 15, 18, 20, 25], (a, A, b) => `Usta eyni sürətlə işləyir: ${a} saatda ${D(A)} detal hazırlayır. ${b} saatda neçə detal hazırlayar?`],
            [[0.5, 1.5, 2, 2.5], (a, A, b) => `${a} eyni dəftər ${D(A)} manatdır. Belə ${b} dəftər neçə manatdır?`],
          ]);
          const u = pick(C[0]); let a, b; do { a = rnd(2, 12); b = rnd(2, 15); } while (a === b);
          const A = a * u, B = b * u;
          const t = C[1](a, A, b);
          return { text: t, answer: B, show: D(B), tol: 0.01,
            solution: `Düz mütənasib: ${a} → ${D(A)}, ${b} → x. x = ${D(A)} · ${b} : ${a} = ${D(B)} (1 vahidə ${D(u)} düşür).` };
        }
        const [n, t, m, x] = pick(WORK);
        const C = pick([
          [`${n} fəhlə bir işi ${t} günə görür. Eyni məhsuldarlıqla ${m} fəhlə həmin işi neçə günə görər?`, "fəhlə", "gün"],
          [`Eyni ${n} boru hovuzu ${t} saata doldurur. Belə ${m} boru hovuzu neçə saata doldurar?`, "boru", "saat"],
          [`Yemək ehtiyatı ${n} turist üçün ${t} günə çatır. ${m} turist üçün neçə günə çatar?`, "turist", "gün"],
        ]);
        return { text: C[0], answer: x, show: String(x), tol: 0.01,
          solution: `${C[1][0].toUpperCase() + C[1].slice(1)} çox olduqca ${C[2]} azalır — tərs mütənasib. Hasil saxlanır: ${n} · ${t} = ${m} · x → x = ${n * t} : ${m} = ${x}.` };
      } },
    { id: "bolme", ad: "Mütənasib hissələrə bölmə", izah: "Düz: a : b : c-yə böl → cəm hissəyə böl. Tərs: 1/a : 1/b : 1/c-yə böl (ortaq məxrəclə tam ədədlərə çevir).",
      gen() {
        const inv = Math.random() < .45, three = Math.random() < .6;
        let r = three ? distinct(3, 1, 7) : distinct(2, 1, 9);
        if (inv) r = three ? distinct(3, 2, 6) : distinct(2, 2, 9);
        let parts;
        if (inv) { const L = r.reduce(lcm, 1); parts = r.map(v => L / v); } else parts = r.slice();
        const g = parts.reduce(gcd); parts = parts.map(v => v / g);
        const Ssum = parts.reduce((a, b) => a + b, 0), k = rnd(2, 15), N = Ssum * k;
        const ask = pick(["max", "min", "idx"]), idx = rnd(0, r.length - 1);
        const vals = parts.map(p => p * k);
        const ans = ask === "max" ? Math.max(...vals) : ask === "min" ? Math.min(...vals) : vals[idx];
        const askT = ask === "max" ? "Ən böyük hissəni tap." : ask === "min" ? "Ən kiçik hissəni tap." : inv ? `${ord[idx]} ədədə (${r[idx]}) uyğun hissəni tap.` : `${ord[idx]} hissəni tap.`;
        const lst = r.join(", ");
        const text = inv ? `${N} ədədini ${lst} ədədlərinə tərs mütənasib hissələrə böl. ${askT}` : `${N} ədədini ${r.join(" : ")} nisbətində hissələrə böl. ${askT}`;
        const pre = inv ? `Tərs mütənasib: ${r.map(v => "1/" + v).join(" : ")} = ${parts.join(" : ")} (ortaq məxrəcə vurduq). ` : (g > 1 ? `${r.join(" : ")} = ${parts.join(" : ")}. ` : "");
        return { text, answer: ans, show: String(ans), tol: 0.01,
          solution: pre + `Cəmi ${Ssum} hissə; 1 hissə = ${N} : ${Ssum} = ${k}. Hissələr: ${vals.join(", ")}. Cavab: ${ans}.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Miqyas, resept, ferma, sinif. Hər məsələdə əvvəl soruş: düz, tərs, yoxsa nisbət?",
      gen() {
        const kind = pick(["map", "map", "recipe", "farm", "class"]);
        if (kind === "map") {
          const [M, km] = pick([[25000, .25], [50000, .5], [100000, 1], [200000, 2], [500000, 5], [1000000, 10]]);
          const Ms = M.toLocaleString("en-US").replace(/,/g, " ");
          const sm = rnd(2, 24) / 2, real = sm * km;
          if (Math.random() < .5) return { text: `Xəritənin miqyası 1 : ${Ms}. Xəritədə iki şəhər arasındakı məsafə ${D(sm)} sm-dir. Yerdə bu məsafə neçə km-dir?`,
            answer: real, unit: "km", show: D(real), tol: 0.001,
            solution: `1 : ${Ms} — xəritədə 1 sm yerdə ${Ms} sm = ${D(km)} km deməkdir. ${D(sm)} · ${D(km)} = ${D(real)} km.` };
          return { text: `Xəritənin miqyası 1 : ${Ms}. Yerdə ${D(real)} km olan məsafə xəritədə neçə sm olar?`,
            answer: sm, unit: "sm", show: D(sm), tol: 0.001,
            solution: `Xəritədə 1 sm = yerdə ${D(km)} km. ${D(real)} : ${D(km)} = ${D(sm)} sm.` };
        }
        if (kind === "recipe") {
          const base = pick([2, 3, 4, 5, 6]), per = pick([50, 60, 75, 80, 100, 120, 150]); let n; do { n = rnd(2, 12); } while (n === base);
          return { text: `Plov üçün ${base} nəfərə ${base * per} q düyü götürülür. ${n} nəfərə neçə qram düyü lazımdır?`, answer: n * per, unit: "q", show: String(n * per), tol: 0.01,
            solution: `Düz mütənasib: 1 nəfərə ${base * per} : ${base} = ${per} q. ${n} nəfərə ${n} · ${per} = ${n * per} q.` };
        }
        if (kind === "farm") {
          let n, t, a; do { n = rnd(6, 30); t = rnd(10, 40); a = rnd(2, 10); } while ((n * t) % (n + a));
          return { text: `Fermada olan yem ${n} inəyə ${t} gün çatır. Fermaya daha ${a} inək gətirildi. İndi yem neçə gün çatacaq?`, answer: n * t / (n + a), unit: "gün", show: String(n * t / (n + a)), tol: 0.01,
            solution: `İnək çoxaldı → gün azalır: tərs mütənasib. ${n} · ${t} = ${n + a} · x → x = ${n * t} : ${n + a} = ${n * t / (n + a)}.` };
        }
        const [p, q] = coprime(1, 9), k = rnd(2, 5), boys = Math.random() < .5;
        return { text: `Sinifdə oğlanların sayının qızların sayına nisbəti ${p} : ${q}-dir. Sinifdə cəmi ${(p + q) * k} şagird var. ${boys ? "Oğlanlar" : "Qızlar"} neçə nəfərdir?`,
          answer: (boys ? p : q) * k, show: String((boys ? p : q) * k), tol: 0.01,
          solution: `Cəmi ${p} + ${q} = ${p + q} hissə; 1 hissə = ${(p + q) * k} : ${p + q} = ${k}. ${boys ? "Oğlanlar" : "Qızlar"}: ${boys ? p : q} · ${k} = ${(boys ? p : q) * k}.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const r = distinct(3, 2, 6).sort((a, b) => a - b), L = r.reduce(lcm, 1);
        let parts = r.map(v => L / v); const g = parts.reduce(gcd); parts = parts.map(v => v / g);
        const Ssum = parts.reduce((a, b) => a + b, 0), k = rnd(2, 12), N = Ssum * k, big = parts[0] * k;
        const bad = rnd(0, 2);
        const steps = [
          `Tərs mütənasib bölürük: ${r.map(v => "1/" + v).join(" : ")} = ${parts.join(" : ")}.`,
          `Cəmi ${Ssum} hissə; 1 hissə = ${N} : ${Ssum} = ${k}.`,
          `Ən böyük hissə ən kiçik ədədə (${r[0]}) uyğundur: ${parts[0]} · ${k} = ${big}.`,
        ];
        if (bad === 0) steps[0] = `Tərs mütənasib bölürük: hissələr ${r.join(" : ")} nisbətindədir.`;
        if (bad === 1) { const k2 = k + pick([1, 2]); steps[1] = `Cəmi ${Ssum} hissə; 1 hissə = ${N} : ${Ssum} = ${k2}.`; steps[2] = `Ən böyük hissə ən kiçik ədədə (${r[0]}) uyğundur: ${parts[0]} · ${k2} = ${parts[0] * k2}.`; }
        if (bad === 2) steps[2] = `Ən böyük hissə ən böyük ədədə (${r[2]}) uyğundur: ${parts[2]} · ${k} = ${parts[2] * k}.`;
        const text = h("div", {}, h("p", {}, `${N} ədədini ${r.join(", ")} ədədlərinə tərs mütənasib hissələrə böl və ən böyük hissəni tap.`),
          h("ol", { class: "oy-steps" }, ...steps.map(s => h("li", {}, s))));
        const why = [`1-ci addım: tərs mütənasib bölmədə nisbət ${r.join(" : ")} yox, ${r.map(v => "1/" + v).join(" : ")} = ${parts.join(" : ")} olmalıdır.`,
          `2-ci addım: ${N} : ${Ssum} = ${k}. Hesab səhvi var.`,
          `3-cü addım: tərs mütənasiblikdə ən böyük hissə ən kiçik ədədə (${r[0]}) düşür: ${parts[0]} · ${k} = ${big}.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
  ];

  // ---- exam format (father, 15 Nov 2026): DİM buraxılış — 6 closed (A–E), 3 coded, 1 written. The wrong options are
  // the answers of typical mistakes (units not converted, direct instead of inverse, "n + a" forgotten, sum instead of difference, ...).
  const { ae, again } = Oyun;
  const nice = (x, dp = 2) => isFinite(x) && x > 0 && Math.abs(Math.round(x * 10 ** dp) - x * 10 ** dp) < 1e-7;
  const mc = (o, rest) => o && { ...rest, ...o, show: o.choices[o.correct] };
  const th = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const IMT = { fenn: "riyaziyyat", vaxt: 35, suallar: [
    // 1. ratio of two quantities in different units (the units must be made equal first)
    { tip: "qapali", gen: () => again(() => {
      const [big, small, U] = pick([["m", "sm", 100], ["kq", "q", 1000], ["saat", "dəqiqə", 60], ["km", "m", 1000]]);
      const bigFirst = pick([true, false]), nb = rnd(2, 9), ns = rnd(5, 60);
      const f = bigFirst ? nb : ns, s = bigFirst ? ns : nb, cf = bigFirst ? U : 1, cs = bigFirst ? 1 : U;
      const n1 = f * cf, d1 = s * cs; if (n1 === d1 || [f, s, f * cs, s * cf, n1, d1].some(v => v > 9999)) return null;
      const right = frac(n1, d1), w = [frac(f, s), frac(s, f), frac(f * cs, s * cf), frac(d1, n1)];
      const u1 = bigFirst ? big : small, u2 = bigFirst ? small : big;
      return mc(ae(right, w, x => x), { text: `${f} ${u1} : ${s} ${u2} nisbətinin qiymətini kəsr kimi yazın (ixtisar olunmuş şəkildə).`,
        solution: `Vahidləri eyniləşdir: 1 ${big} = ${U} ${small}. Hər iki kəmiyyəti ${small} vahidində yazsaq: ${n1} : ${d1} = ${right}. Tələlər: vahidləri eyniləşdirmədən bölmək (${frac(f, s)}), onu da tərsinə yazmaq (${frac(s, f)}), çevirməni tərsinə aparmaq (${frac(f * cs, s * cf)}), düzgün nisbəti tərsinə yazmaq (${frac(d1, n1)}).` });
    }) },
    // 2. proportion with a shifted unknown: (x ± s) : a = b : c
    { tip: "qapali", gen: () => again(() => {
      const a = rnd(2, 12), c = rnd(2, 12), b = rnd(2, 30), s = rnd(2, 9), sg = pick([1, -1]); if (a === c || (a * b) % c) return null;
      const T = a * b / c, x = T - sg * s, P = b * c / a; if (x < 1) return null;
      const w = [T, T + sg * s, P - sg * s, P]; if (![x, ...w].every(v => nice(v))) return null;
      const ex = `(x ${sg > 0 ? "+" : "−"} ${s})`;
      return mc(ae(x, w), { text: `${ex} : ${a} = ${b} : ${c} tənasübündən x-i tapın.`,
        solution: `Kənar hədlərin hasili = orta hədlərin hasili: ${ex} · ${c} = ${a} · ${b}, buradan ${ex} = ${T}, x = ${T} ${sg > 0 ? "−" : "+"} ${s} = ${x}. Tələlər: ${s} ədədini ${sg > 0 ? "çıxmağı" : "əlavə etməyi"} unutmaq (${T}), işarəni səhv aparmaq (${D(T + sg * s)}), hədləri səhv cütləmək (${D(P - sg * s)}), hədləri səhv cütləyib ${s} ədədini də unutmaq (${D(P)}).` });
    }) },
    // 3. map scale: centimetres on the map -> kilometres on the ground
    { tip: "qapali", gen: () => again(() => {
      const M = pick([200000, 250000, 500000, 1000000]), sm = rnd(2, 16) / 2, R = sm * M / 1e5;
      const w = [R * 10, R / 10, R * 100, sm * M]; if (![R, ...w].every(v => nice(v, 3))) return null;
      const f = v => (Number.isInteger(v) ? th(v) : D(v)) + " km";
      return mc(ae(R, w, f), { text: `Xəritənin miqyası 1 : ${th(M)} kimi verilib. Xəritədə iki şəhər arasındakı məsafə ${D(sm)} sm-dir. Yerdə bu məsafə neçə kilometrdir?`,
        solution: `Xəritədə 1 sm yerdə ${th(M)} sm = ${D(M / 1e5)} km deməkdir (1 km = 100 000 sm). ${D(sm)} · ${D(M / 1e5)} = ${D(R)} km. Tələlər: sm-i km-ə çevirməyi unutmaq (${th(sm * M)}), onluq vergülü səhv yerə qoymaq (${D(R * 10)}, ${D(R / 10)}, ${D(R * 100)}).` });
    }) },
    // 4. inverse proportion, more workers join: the new count is n + a
    { tip: "qapali", gen: () => again(() => {
      const n = rnd(4, 20), t = rnd(6, 30), a = rnd(2, 10), x = n * t / (n + a); if (!nice(x, 0) || x === t) return null;
      const w = [n * t / a, t * (n + a) / n, t - a, n * t]; if (![x, ...w].every(v => nice(v))) return null;
      return mc(ae(x, w), { text: `${n} fəhlə bir işi ${t} günə görür. İş başlamazdan əvvəl ona daha ${a} fəhlə qoşuldu. Bütün fəhlələr gündə eyni müddət işləyir və məhsuldarlıqları eynidir. İş neçə günə bitər?`,
        solution: `Fəhlə çox olduqca gün azalır — tərs mütənasiblik, hasil saxlanır: ${n} · ${t} = ${n + a} · x, x = ${n * t} : ${n + a} = ${x}. Tələlər: yalnız əlavə ${a} fəhləni götürmək (${D(n * t / a)}), düz mütənasib hesab (${D(t * (n + a) / n)}), fərqlə düşünmək: ${t} − ${a} = ${t - a}, bir hasili cavab yazmaq (${n * t}).` });
    }) },
    // 5. dividing a number in inverse proportion: the smallest share goes to the biggest number
    { tip: "qapali", gen: () => again(() => {
      const r = distinct(3, 2, 6).sort((a, b) => a - b), L = r.reduce(lcm, 1);
      let parts = r.map(v => L / v); const g = parts.reduce(gcd); parts = parts.map(v => v / g);
      const Sg = parts.reduce((a, b) => a + b, 0), k = rnd(2, 12), N = Sg * k, R = parts[2] * k;
      const dir = N * r[0] / r.reduce((a, b) => a + b, 0), w = [dir, parts[0] * k, parts[1] * k, k]; if (![R, ...w].every(v => nice(v))) return null;
      return mc(ae(R, w), { text: `${N} ədədini ${r.join(", ")} ədədlərinə tərs mütənasib hissələrə böldülər. Ən kiçik hissəni tapın.`,
        solution: `Tərs mütənasib: ${r.map(v => "1/" + v).join(" : ")} = ${parts.join(" : ")}. Cəmi ${Sg} hissə, 1 hissə = ${N} : ${Sg} = ${k}. Ən kiçik hissə ən böyük ədədə (${r[2]}) düşür: ${parts[2]} · ${k} = ${R}. Tələlər: düz bölmək (${D(dir)}), ən böyük (${parts[0] * k}) və ya ortanı (${parts[1] * k}) seçmək, bir hissəni (${k}) cavab yazmaq.` });
    }) },
    // 6. ratio and difference of two numbers (a difference is divided by q − p, not p + q)
    { tip: "qapali", gen: () => again(() => {
      const [p0, q0] = coprime(1, 9), p = Math.min(p0, q0), q = Math.max(p0, q0), k = rnd(2, 15), d = (q - p) * k, R = q * k;
      const w = [p * k, d * q / (p + q), k, d * q / p]; if (![R, ...w].every(v => nice(v))) return null;
      return mc(ae(R, w), { text: `İki müsbət ədədin nisbəti ${p} : ${q} olub, fərqi ${d} ədədinə bərabərdir. Böyük ədədi tapın.`,
        solution: `Ədədlər ${p}k və ${q}k, fərq (${q} − ${p})k = ${d}, k = ${k}. Böyük ədəd ${q} · ${k} = ${R}. Tələlər: kiçik ədədi cavab yazmaq (${p * k}), fərqi cəm kimi bölmək (${D(d * q / (p + q))}), bir hissəni (${k}) yazmaq, fərqi kiçik ədəd saymaq (${D(d * q / p)}).` });
    }) },
    // 7. coded: chain of ratios a : b, b : c with a given sum
    { tip: "kod", gen: () => again(() => {
      const [p1, q1] = coprime(1, 7), [p2, q2] = coprime(2, 7), B = lcm(q1, p2), g0 = [p1 * B / q1, B, q2 * B / p2];
      const g = g0.reduce(gcd), pa = g0.map(v => v / g), Sg = pa[0] + pa[1] + pa[2]; if (Sg > 80) return null;
      const k = rnd(2, 12), N = Sg * k, ask = pick([0, 2]), nm = ["a", "b", "c"][ask], ans = pa[ask] * k;
      return { text: `a : b = ${p1} : ${q1}, b : c = ${p2} : ${q2} və a + b + c = ${N} olarsa, ${nm} ədədini tapın.`, answer: ans, show: String(ans), tol: 1e-6,
        solution: `b ədədini ortaq edirik: b = ${B} hissə. a : b : c = ${g0.join(" : ")}${g > 1 ? " = " + pa.join(" : ") : ""}. Cəmi ${Sg} hissə, 1 hissə = ${N} : ${Sg} = ${k}. ${nm} = ${pa[ask]} · ${k} = ${ans}.` };
    }) },
    // 8. coded: compound proportion (workers and hours per day)
    { tip: "kod", gen: () => again(() => {
      const n = rnd(4, 20), h = rnd(4, 8), t = rnd(6, 30), m = rnd(3, 24), h2 = rnd(3, 10), W = n * h * t, x = W / (m * h2);
      if (!Number.isInteger(x) || x === t || x < 2 || (n === m && h === h2)) return null;
      return { text: `${n} fəhlə gündə ${h} saat işləyərək bir işi ${t} günə görür. Bütün fəhlələrin məhsuldarlığı eynidirsə, ${m} fəhlə gündə ${h2} saat işləsə, həmin işi neçə günə görər?`,
        answer: x, show: String(x), tol: 1e-6, unit: "gün",
        solution: `Sabit iş həcmində gün sayı fəhlə sayı ilə gündəlik saatların hasilinə tərs mütənasibdir; işin həcmi saxlanır: ${n} · ${h} · ${t} = ${W} adam-saat. ${W} : (${m} · ${h2}) = ${W} : ${m * h2} = ${x} gün.` };
    }) },
    // 9. coded: ratio x : y and a linear condition
    { tip: "kod", gen: () => again(() => {
      const [p, q] = coprime(1, 9), a = rnd(2, 5), b = rnd(2, 5), k = rnd(2, 12), N = (a * p + b * q) * k, ans = p * k; if (a === b) return null;
      return { text: `x : y = ${p} : ${q} və ${a}x + ${b}y = ${N} olarsa, x-i tapın.`, answer: ans, show: String(ans), tol: 1e-6,
        solution: `x = ${p}k, y = ${q}k. ${a} · ${p}k + ${b} · ${q}k = ${a * p + b * q}k = ${N}, k = ${k}. x = ${p} · ${k} = ${ans}. Tələ: ${a}x + ${b}y ifadəsini hissələrin cəmi sanıb ${N} ədədini ${p + q} hissəyə bölmək.` };
    }) },
    // 10. written: a ratio that changes after some boys leave
    { tip: "yazili", gen: () => again(() => {
      const [p, q] = coprime(2, 9), [r, s] = coprime(1, 9); if (p * s <= r * q) return null;
      const k = rnd(3, 15), d0 = k * (p * s - r * q); if (d0 % s) return null; const d = d0 / s; if (d < 1 || d >= p * k) return null;
      const T = (p + q) * k; if (T > 45) return null;
      return { text: `Sinifdə oğlanların qızlara nisbəti ${p} : ${q} idi. ${d} oğlan başqa sinfə keçdikdən sonra bu nisbət ${r} : ${s} oldu. Sinifdə əvvəlcə neçə şagird var idi?`,
        answer: T, show: String(T), tol: 1e-6, unit: "şagird",
        solution: `1) Oğlanlar ${p}k, qızlar ${q}k olsun. 2) ${d} oğlan getdikdən sonra: (${p}k − ${d}) : ${q}k = ${r} : ${s}, yəni ${s} · (${p}k − ${d}) = ${r} · ${q}k. 3) ${s * p}k − ${s * d} = ${r * q}k, buradan ${s * p - r * q}k = ${s * d}, k = ${k}. 4) Şagirdlər: (${p} + ${q}) · ${k} = ${T}. Yoxlama: ${p * k - d} : ${q * k} = ${r} : ${s}. Həll yazılmadan yalnız cavab — bal verilmir.` };
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
      key: "nisbet-tenasub", title: "Nisbət, tənasüb, mütənasiblik", fenn: "riyaziyyat", link: "dersler/nisbet-tenasub.html",
      format: "Cavab ədəddir: tam 12, onluq 2,5 (və ya 2.5), kəsr 3/4. Nisbət soruşulanda onun qiymətini kəsr kimi yaz: 2 : 5 → 2/5.",
      levels, imtahan: IMT, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["nisbet", "tenasub", "tenasub", "tani", "duz-ters", "duz-ters", "bolme", "bolme", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/nisbet-tenasub.html")) b.push("dersler/nisbet-tenasub.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
