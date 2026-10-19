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

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "nisbet-tenasub", title: "Nisbət, tənasüb, mütənasiblik", fenn: "riyaziyyat", link: "dersler/nisbet-tenasub.html",
      format: "Cavab ədəddir: tam 12, onluq 2,5 (və ya 2.5), kəsr 3/4. Nisbət soruşulanda onun qiymətini kəsr kimi yaz: 2 : 5 → 2/5.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["nisbet", "tenasub", "tenasub", "tani", "duz-ters", "duz-ters", "bolme", "bolme", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/nisbet-tenasub.html")) b.push("dersler/nisbet-tenasub.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
