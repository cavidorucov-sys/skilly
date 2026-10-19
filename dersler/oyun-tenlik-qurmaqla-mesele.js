// Tənlik qurmaqla məsələ həlli — mastery game levels (numbers and age, digits, motion, average speed, work and mixtures,
// everyday problems, find-the-mistake) and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const lcm = (a, b) => a / gcd(a, b) * b;
  const S = n => n < 0 ? "−" + (-n) : String(n);                       // number with a real minus sign
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  // polynomial from [coef, "x"|""] terms: [[3,"x"],[-5,""]] → "3x − 5"
  const poly = ts => { let o = ""; for (const [c, v] of ts) { if (!c) continue; const a = Math.abs(c), body = v ? (a === 1 ? v : a + v) : String(a); o += o ? (c < 0 ? " − " : " + ") + body : (c < 0 ? "−" : "") + body; } return o || "0"; };
  const NW = { 3: "Üç", 4: "Dörd", 5: "Beş" };
  const solve = (c, r, v = "x") => (c === 1 ? "" : `${poly([[c, v]])} = ${S(r)} → `) + `${v} = ${frac(r, c)}`;   // "3x = 12 → x = 4", or just "x = 4"

  // nice-number tables, built once
  const CATCH = [];   // slow v1, head start t0 hours, fast v2, catch-up time t
  for (const [v1s, v2s] of [[[4, 5, 6], [10, 12, 15, 16, 18, 20]], [[40, 50, 60], [60, 70, 80, 90, 100]]])
    for (const v1 of v1s) for (const v2 of v2s) for (let t0 = 1; t0 <= 3; t0++) { if (v2 <= v1) continue; const t = v1 * t0 / (v2 - v1); if (Number.isInteger(t) && t >= 1 && t <= 8) CATCH.push([v1, t0, v2, t, v1s[0] < 10]); }
  const EQD = [];     // equal distances v1, v2 → average V = 2·v1·v2/(v1 + v2), integer
  for (let v1 = 20; v1 <= 120; v1 += 5) for (let v2 = 20; v2 <= 120; v2 += 5) { if (v1 === v2) continue; const V = 2 * v1 * v2 / (v1 + v2); if (Number.isInteger(V)) EQD.push([v1, v2, V]); }
  const TIM = [];     // t1 h at v1, t2 h at v2 → integer average, t1 ≠ t2
  for (let v1 = 20; v1 <= 100; v1 += 10) for (let v2 = 20; v2 <= 100; v2 += 10) for (let t1 = 1; t1 <= 4; t1++) for (let t2 = 1; t2 <= 4; t2++) {
    if (v1 === v2 || t1 === t2) continue; const V = (v1 * t1 + v2 * t2) / (t1 + t2); if (Number.isInteger(V)) TIM.push([v1, t1, v2, t2, V]); }
  const JOINT = [];   // a days, b days → together t days
  for (let a = 2; a <= 30; a++) for (let b = a + 1; b <= 60; b++) { const t = a * b / (a + b); if (Number.isInteger(t)) JOINT.push([a, b, t]); }
  const DIL = [];     // m g of p% + x g water → q%   (q < p);   or evaporate x g → q%   (q > p)
  for (const m of [100, 200, 300, 400, 500, 600, 800, 1000]) for (const p of [5, 10, 12, 15, 20, 25, 30, 40, 50]) for (const q of [4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60]) {
    if (q === p) continue; const salt = m * p / 100, tot = salt * 100 / q; if (!Number.isInteger(salt) || !Number.isInteger(tot) || tot > 4 * m || tot < m / 3) continue; DIL.push([m, p, q, salt, tot]); }
  const MIX = [];     // p1% and p2% → M g of q%; x g of p1%
  for (const p1 of [5, 10, 15, 20, 25, 30]) for (const p2 of [30, 40, 50, 60, 70]) for (const q of [15, 20, 25, 30, 35, 40, 45, 50]) for (const M of [100, 200, 300, 400, 500, 600]) {
    if (!(p1 < q && q < p2)) continue; const x = M * (p2 - q) / (p2 - p1); if (Number.isInteger(x)) MIX.push([p1, p2, q, M, x]); }

  const levels = [
    { id: "eded-yas", ad: "Ədədlər və yaş", izah: "x — naməlum. Qalanları x ilə yaz, şərtdən tənlik qur. Yaş məsələsində: hər il hamı 1 yaş böyüyür, yaş fərqi dəyişmir.",
      gen() {
        const kind = pick(["ard", "iki", "gel", "kec"]);
        if (kind === "ard") {
          const n = rnd(3, 5), step = pick([1, 1, 2]), par = step === 2 ? pick(["cüt", "tək"]) : "";
          let x = rnd(4, 60); if (step === 2 && (x % 2 === 0) !== (par === "cüt")) x++;
          const add = step * n * (n - 1) / 2, sum = n * x + add, big = Math.random() < .5, ans = big ? x + step * (n - 1) : x;
          const list = Array.from({ length: n }, (_, i) => x + step * i);
          return { text: `${NW[n]} ardıcıl ${step === 1 ? "natural" : par} ədədin cəmi ${sum} olur. Bu ədədlərin ən ${big ? "böyüyünü" : "kiçiyini"} tap.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `x — ən kiçik ədəd. Ədədlər: ${list.map((_, i) => i ? `x + ${step * i}` : "x").join(", ")}. Cəm: ${n}x + ${add} = ${sum} → ${n}x = ${sum - add} → x = ${x}.${big ? ` Ən böyüyü: ${list[n - 1]}.` : ""} Yoxla: ${list.join(" + ")} = ${sum} ✓.` };
        }
        if (kind === "iki") {
          const big = Math.random() < .5;
          if (Math.random() < .5) {
            const x = rnd(3, 40), k = rnd(2, 5), sum = x * (k + 1), ans = big ? k * x : x;
            return { text: `İki ədədin cəmi ${sum} olur. Onlardan biri digərindən ${k} dəfə böyükdür. ${big ? "Böyük" : "Kiçik"} ədədi tap.`, answer: ans, show: String(ans), tol: 0.01,
              solution: `Kiçik ədəd x, böyük ${k}x. x + ${k}x = ${sum} → ${k + 1}x = ${sum} → x = ${x}. Böyük ədəd: ${k * x}. Cavab: ${ans}.` };
          }
          const x = rnd(5, 60), d = rnd(2, 30), sum = 2 * x + d, ans = big ? x + d : x;
          return { text: `İki ədədin cəmi ${sum} olur. Onlardan biri digərindən ${d} vahid çoxdur. ${big ? "Böyük" : "Kiçik"} ədədi tap.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `Kiçik ədəd x, böyük x + ${d}. x + x + ${d} = ${sum} → 2x = ${sum - d} → x = ${x}. Böyük ədəd: ${x + d}. Cavab: ${ans}.` };
        }
        if (kind === "gel") {
          let s, x, k, F;
          do { s = rnd(4, 15); x = rnd(1, 20); k = rnd(2, 3); F = k * (s + x) - x; } while (F - s < 20 || F > 60);
          return { text: `Ata ${F}, oğlu isə ${s} yaşındadır. Neçə ildən sonra ata oğlundan ${k} dəfə böyük olacaq?`, answer: x, show: String(x), tol: 0.01, unit: "il",
            solution: `x ildən sonra ata ${F} + x, oğlu ${s} + x yaşında olacaq (ikisi də x il böyüyür). ${F} + x = ${k}(${s} + x) → ${F} + x = ${k * s} + ${k}x → ${solve(k - 1, F - k * s)}. Yoxla: ${F + x} = ${k}·${s + x} ✓.` };
        }
        let x, y, k, D;
        do { x = rnd(8, 20); y = rnd(2, x - 2); k = rnd(2, 5); D = (k - 1) * (x - y); } while (D < 18 || D > 40);
        return { text: `Ana qızından ${D} yaş böyükdür. ${y} il əvvəl ana qızından ${k} dəfə böyük idi. Qız indi neçə yaşındadır?`, answer: x, show: String(x), tol: 0.01, unit: "yaş",
          solution: `x — qızın indiki yaşı, ana: x + ${D}. ${y} il əvvəl: qız x − ${y}, ana ${poly([[1, "x"], [D - y, ""]])}. ${poly([[1, "x"], [D - y, ""]])} = ${k}(x − ${y}) → ${solve(k - 1, D - y + k * y)}. Yoxla: ${y} il əvvəl qız ${x - y}, ana ${x - y + D} = ${k}·${x - y} ✓.` };
      } },
    { id: "reqem", ad: "Rəqəmlər", izah: "İkirəqəmli ədəd: 10a + b (a — onluq, b — təklik rəqəmi). Yeri dəyişən: 10b + a. Sağına c yazmaq: 10x + c.",
      gen() {
        const kind = pick(["swap", "swap", "kat", "misl", "sag"]);
        if (kind === "swap") {
          let a, b; do { a = rnd(1, 9); b = rnd(1, 9); } while (a === b);
          const N = 10 * a + b, R = 10 * b + a, diff = Math.abs(R - N), up = b > a;
          return { text: `İkirəqəmli ədədin rəqəmlərinin cəmi ${a + b} olur. Rəqəmlərin yerini dəyişsək, ədəd ${diff} ${up ? "artar" : "azalar"}. Ədədi tap.`, answer: N, show: String(N), tol: 0.01,
            solution: `Ədəd 10a + b, yeri dəyişən 10b + a. Fərq: (10${up ? "b + a) − (10a + b" : "a + b) − (10b + a"}) = 9(${up ? "b − a" : "a − b"}) = ${diff} → ${up ? "b − a" : "a − b"} = ${diff / 9}. a + b = ${a + b} → a = ${a}, b = ${b}. Ədəd: ${N}. Yoxla: ${Math.max(N, R)} − ${Math.min(N, R)} = ${diff} ✓.` };
        }
        if (kind === "kat") {
          let k, x; do { k = rnd(2, 4); x = rnd(1, 4); } while (k * x > 9);
          const a = k * x, N = 10 * a + x, M = N - a - x;
          return { text: `İkirəqəmli ədədin onluq rəqəmi təklik rəqəmindən ${k} dəfə böyükdür. Ədəd öz rəqəmlərinin cəmindən ${M} vahid çoxdur. Ədədi tap.`, answer: N, show: String(N), tol: 0.01,
            solution: `Təklik rəqəmi x, onluq ${k}x. Ədəd: 10·${k}x + x = ${10 * k + 1}x, rəqəmlər cəmi ${k + 1}x. ${10 * k + 1}x − ${k + 1}x = ${M} → ${9 * k}x = ${M} → x = ${x}. Ədəd: ${N}. Yoxla: ${N} − ${a + x} = ${M} ✓.` };
        }
        if (kind === "misl") {
          const opts = [];
          for (let a = 1; a <= 8; a++) for (let d = 1; a + d <= 9; d++) { const N = 11 * a + d, s = 2 * a + d; if (N % s === 0) opts.push([a, d, N, N / s]); }
          const [a, d, N, m] = pick(opts);
          return { text: `İkirəqəmli ədədin təklik rəqəmi onluq rəqəmindən ${d} vahid çoxdur. Ədəd öz rəqəmlərinin cəmindən ${m} dəfə böyükdür. Ədədi tap.`, answer: N, show: String(N), tol: 0.01,
            solution: `Onluq rəqəmi x, təklik x + ${d}. Ədəd: 10x + x + ${d} = 11x + ${d}, cəm: 2x + ${d}. 11x + ${d} = ${m}(2x + ${d}) → ${solve(11 - 2 * m, (m - 1) * d)}. Ədəd: ${N}. Yoxla: ${a} + ${a + d} = ${2 * a + d}, ${m}·${2 * a + d} = ${N} ✓.` };
        }
        const x = rnd(10, 99), c = rnd(0, 9), M = 9 * x + c;
        return { text: `İkirəqəmli ədədin sağına ${c} rəqəmini yazdıq. Alınan üçrəqəmli ədəd ilkin ədəddən ${M} vahid böyükdür. İlkin ədədi tap.`, answer: x, show: String(x), tol: 0.01,
          solution: `İlkin ədəd x. Sağına ${c} yazanda: 10x + ${c} (məs. 37 → 37·10 + ${c}). 10x + ${c} − x = ${M} → 9x = ${M - c} → x = ${x}. Yoxla: ${10 * x + c} − ${x} = ${M} ✓.` };
      } },
    { id: "herekat", ad: "Hərəkət", izah: "s = v·t. Qarşı-qarşıya: yaxınlaşma sürəti v₁ + v₂. Ardınca: v₂ − v₁. Gec çıxanın vaxtı az olur.",
      gen() {
        const kind = pick(["gorus", "gec", "catma"]);
        if (kind === "gorus") {
          const x = 5 * rnd(6, 16), d = 5 * rnd(1, 6), t = rnd(2, 5), D = t * (2 * x + d), fast = Math.random() < .5, ans = fast ? x + d : x;
          return { text: `İki şəhər arası ${D} km. Bu şəhərlərdən eyni anda iki maşın qarşı-qarşıya çıxdı və ${t} saat sonra görüşdü. Birinci maşının sürəti ikincininkindən ${d} km/saat çoxdur. ${fast ? "Birinci" : "İkinci"} maşının sürəti neçə km/saatdır?`, answer: ans, show: String(ans), tol: 0.01, unit: "km/saat",
            solution: `x — ikincinin sürəti, birincinin: x + ${d}. ${t} saatda ikisi birlikdə bütün yolu gedir: ${t}x + ${t}(x + ${d}) = ${D} → ${2 * t}x + ${t * d} = ${D} → x = ${x}.${fast ? ` Birincinin sürəti: ${x} + ${d} = ${x + d}.` : ""} Yoxla: ${t}·${x} + ${t}·${x + d} = ${D} ✓.` };
        }
        if (kind === "gec") {
          const v1 = 10 * rnd(4, 9), v2 = 10 * rnd(4, 9), t0 = rnd(1, 2), t = t0 + rnd(1, 4), D = v1 * t + v2 * (t - t0);
          return { text: `A və B şəhərləri arası ${D} km. A-dan B-yə ${v1} km/saat sürətlə maşın çıxdı. ${t0} saat sonra B-dən A-ya ${v2} km/saat sürətlə ikinci maşın çıxdı. Birinci maşın yola çıxandan neçə saat sonra onlar görüşəcək?`, answer: t, show: String(t), tol: 0.01, unit: "saat",
            solution: `t — birincinin yolda olduğu vaxt, ikincinin: t − ${t0}. ${v1}t + ${v2}(t − ${t0}) = ${D} → ${v1 + v2}t − ${v2 * t0} = ${D} → ${v1 + v2}t = ${D + v2 * t0} → t = ${t}. Yoxla: ${v1}·${t} + ${v2}·${t - t0} = ${v1 * t} + ${v2 * (t - t0)} = ${D} ✓.` };
        }
        const [v1, t0, v2, t, walk] = pick(CATCH);
        const [A, B, Bdat] = walk ? ["Piyada", "velosipedçi", "piyadaya"] : ["Yük maşını", "minik maşını", "yük maşınına"];
        return { text: `${A} ${v1} km/saat sürətlə yola çıxdı. ${t0} saat sonra eyni yerdən eyni istiqamətdə ${B} ${v2} km/saat sürətlə yola çıxdı. ${B[0].toUpperCase() + B.slice(1)} yola çıxandan neçə saat sonra ${Bdat} çatar?`, answer: t, show: String(t), tol: 0.01, unit: "saat",
          solution: `t — ${B} yola çıxandan keçən vaxt. Bu vaxtda ${B} ${v2}t km, ${A.toLowerCase()} isə ${v1}(t + ${t0}) km gedir (o, ${t0} saat əvvəl çıxıb). Çatanda yollar bərabərdir: ${v2}t = ${v1}(t + ${t0}) → ${v2 - v1}t = ${v1 * t0} → t = ${t}. Yoxla: ${v2}·${t} = ${v2 * t}, ${v1}·${t + t0} = ${v1 * (t + t0)} ✓.` };
      } },
    { id: "orta", ad: "Orta sürət", izah: "Orta sürət = ümumi yol ÷ ümumi vaxt. Sürətlərin ədədi ortası DEYİL (vaxtlar bərabər olmasa).",
      gen() {
        const kind = pick(["yari", "yari", "vaxt", "yol", "tərs"]);
        if (kind === "yari") {
          const [v1, v2, V] = pick(EQD), L = lcm(v1, v2), t1 = L / v1, t2 = L / v2;
          return { text: `Maşın A-dan B-yə ${v1} km/saat, B-dən A-ya isə ${v2} km/saat sürətlə getdi. Bütün yolda (getmə və qayıtma) orta sürəti neçə km/saatdır?`, answer: V, show: String(V), tol: 0.01, unit: "km/saat",
            solution: `Tələ: (${v1} + ${v2})/2 = ${(v1 + v2) / 2} deyil! A ilə B arası d olsun: orta sürət = 2d/(d/${v1} + d/${v2}) = 2·${v1}·${v2}/(${v1} + ${v2}) = ${V}. Məsələn, d = ${L} km: vaxt ${t1} + ${t2} = ${t1 + t2} saat, yol ${2 * L} km, ${2 * L}/${t1 + t2} = ${V} ✓.` };
        }
        if (kind === "tərs") {
          const [v1, v2, V] = pick(EQD);
          return { text: `Maşın yolun birinci yarısını ${v1} km/saat sürətlə getdi. Yolun ikinci yarısını hansı sürətlə getməlidir ki, bütün yolda orta sürəti ${V} km/saat olsun?`, answer: v2, show: String(v2), tol: 0.01, unit: "km/saat",
            solution: `x — lazım olan sürət. Bərabər yarılar üçün orta sürət 2·${v1}·x/(${v1} + x). 2·${v1}·x/(${v1} + x) = ${V} → ${2 * v1}x = ${V * v1} + ${V}x → ${2 * v1 - V}x = ${V * v1} → x = ${v2}. Yoxla: 2·${v1}·${v2}/${v1 + v2} = ${V} ✓.` };
        }
        const [v1, t1, v2, t2, V] = pick(TIM), s1 = v1 * t1, s2 = v2 * t2;
        if (kind === "vaxt")
          return { text: `Avtobus ${t1} saat ${v1} km/saat, sonra ${t2} saat ${v2} km/saat sürətlə getdi. Bütün yolda orta sürəti neçə km/saatdır?`, answer: V, show: String(V), tol: 0.01, unit: "km/saat",
            solution: `Ümumi yol: ${v1}·${t1} + ${v2}·${t2} = ${s1} + ${s2} = ${s1 + s2} km. Ümumi vaxt: ${t1 + t2} saat. Orta sürət: ${s1 + s2}/${t1 + t2} = ${V} (sürətlərin ortası ${(v1 + v2) / 2} deyil — vaxtlar fərqlidir).` };
        return { text: `Maşın ${s1} km yolu ${v1} km/saat, sonrakı ${s2} km yolu ${v2} km/saat sürətlə getdi. Bütün yolda orta sürəti neçə km/saatdır?`, answer: V, show: String(V), tol: 0.01, unit: "km/saat",
          solution: `Vaxtlar: ${s1}/${v1} = ${t1} saat və ${s2}/${v2} = ${t2} saat. Orta sürət: (${s1} + ${s2})/(${t1} + ${t2}) = ${s1 + s2}/${t1 + t2} = ${V}.` };
      } },
    { id: "is-qarisiq", ad: "İş və qarışıqlar", izah: "İş = məhsuldarlıq · vaxt; bütün iş = 1. Qarışıqda təmiz maddə = məhlul · faiz/100; su əlavə edəndə duz dəyişmir.",
      gen() {
        const kind = pick(["usta", "birge", "su", "qarisiq"]);
        if (kind === "usta") {
          const x = rnd(6, 20), d = rnd(2, 8), t1 = rnd(3, 8), t2 = rnd(3, 8), P = t1 * (x + d) + t2 * x, ust = Math.random() < .5, ans = ust ? x + d : x;
          return { text: `Usta saatda şagirddən ${d} detal çox hazırlayır. Usta ${t1} saat, şagird ${t2} saat işlədi və birlikdə ${P} detal hazırladılar. ${ust ? "Usta" : "Şagird"} saatda neçə detal hazırlayır?`, answer: ans, show: String(ans), tol: 0.01, unit: "detal",
            solution: `x — şagirdin saatlıq işi, ustanınkı x + ${d}. ${t1}(x + ${d}) + ${t2}x = ${P} → ${t1 + t2}x + ${t1 * d} = ${P} → x = ${x}.${ust ? ` Usta: ${x + d}.` : ""} Yoxla: ${t1}·${x + d} + ${t2}·${x} = ${P} ✓.` };
        }
        if (kind === "birge") {
          const [a, b, t] = pick(JOINT);
          if (Math.random() < .5)
            return { text: `Birinci briqada işi ${a} günə, ikinci briqada ${b} günə görür. İki briqada birlikdə işi neçə günə görər?`, answer: t, show: String(t), tol: 0.01, unit: "gün",
              solution: `Bütün iş 1 olsun. 1 gündə birinci 1/${a}, ikinci 1/${b} hissə görür. x gündə: x/${a} + x/${b} = 1 → ortaq məxrəcə vur: ${b}x + ${a}x = ${a * b} → ${a + b}x = ${a * b} → x = ${t}.` };
          return { text: `Birinci briqada işi ${a} günə görür. İki briqada birlikdə həmin işi ${t} günə görür. İkinci briqada təkbaşına işi neçə günə görər?`, answer: b, show: String(b), tol: 0.01, unit: "gün",
            solution: `1 gündə birlikdə 1/${t}, birinci 1/${a} hissə görür. İkinci: 1/${t} − 1/${a} = ${frac(a - t, a * t)} hissə gündə. Deməli, işi ${b} günə görər. Yoxla: 1/${a} + 1/${b} = ${frac(a + b, a * b)} = 1/${t} ✓.` };
        }
        if (kind === "su") {
          const [m, p, q, salt, tot] = pick(DIL), x = Math.abs(tot - m), add = q < p;
          return { text: add ? `${m} q ${p}%-li duz məhluluna neçə qram su əlavə etmək lazımdır ki, məhlul ${q}%-li olsun?` : `${m} q ${p}%-li duz məhlulundan neçə qram su buxarlandırmaq lazımdır ki, məhlul ${q}%-li olsun?`,
            answer: x, show: String(x), tol: 0.01, unit: "q",
            solution: `Duz: ${m}·${p}/100 = ${salt} q. Su ${add ? "əlavə edəndə" : "buxarlananda"} duz dəyişmir. Yeni məhlul: ${salt} = ${q}/100·(${m} ${add ? "+" : "−"} x) → ${m} ${add ? "+" : "−"} x = ${tot} → x = ${x}. Yoxla: ${salt}/${tot} = ${q}% ✓.` };
        }
        const [p1, p2, q, M, x] = pick(MIX);
        return { text: `${p1}%-li və ${p2}%-li duz məhlullarını qarışdırıb ${M} q ${q}%-li məhlul almaq lazımdır. ${p1}%-li məhluldan neçə qram götürmək lazımdır?`, answer: x, show: String(x), tol: 0.01, unit: "q",
          solution: `x q — ${p1}%-li, ${M} − x — ${p2}%-li. Duzlar toplanır: ${p1}/100·x + ${p2}/100·(${M} − x) = ${q}/100·${M}. 100-ə vur: ${p1}x + ${p2 * M} − ${p2}x = ${q * M} → ${p2 - p1}x = ${(p2 - q) * M} → x = ${x}. Yoxla: ${p1 * x / 100} + ${p2 * (M - x) / 100} = ${q * M / 100} q duz ✓.` };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Alış-veriş, pul, endirim. x — soruşulan kəmiyyət; şərti tənliyə çevir, cavabı yoxla.",
      gen() {
        const kind = pick(["defter", "eskinas", "endirim", "pay"]);
        if (kind === "defter") {
          const x = rnd(1, 6), d = rnd(1, 5), a = rnd(2, 5), b = rnd(2, 6), P = a * (x + d) + b * x, q = Math.random() < .5, ans = q ? x : x + d;
          return { text: `Dəftər qələmdən ${d} manat bahadır. ${a} dəftər və ${b} qələm birlikdə ${P} manat edir. Bir ${q ? "qələm" : "dəftər"} neçə manatdır?`, answer: ans, show: String(ans), tol: 0.01, unit: "manat",
            solution: `x — qələmin qiyməti, dəftər x + ${d}. ${a}(x + ${d}) + ${b}x = ${P} → ${a + b}x + ${a * d} = ${P} → x = ${x}.${q ? "" : ` Dəftər: ${x + d}.`} Yoxla: ${a}·${x + d} + ${b}·${x} = ${P} ✓.` };
        }
        if (kind === "eskinas") {
          const [s1, s2] = pick([[1, 5], [5, 10], [5, 20], [10, 20], [10, 50]]), n = rnd(6, 20), y = rnd(1, n - 1), Sm = s1 * (n - y) + s2 * y, big = Math.random() < .5, ans = big ? y : n - y;
          return { text: `Cüzdanda ${s1} və ${s2} manatlıq cəmi ${n} əskinas var. Ümumi məbləğ ${Sm} manatdır. ${big ? s2 : s1} manatlıq əskinasların sayını tap.`, answer: ans, show: String(ans), tol: 0.01,
            solution: `x — ${s2} manatlıqların sayı, ${s1} manatlıqlar: ${n} − x. ${s1 === 1 ? "" : s1}(${n} − x) + ${s2}x = ${Sm} → ${s2 - s1}x = ${Sm - s1 * n} → x = ${y}.${big ? "" : ` ${s1} manatlıqlar: ${n} − ${y} = ${n - y}.`} Yoxla: ${s1}·${n - y} + ${s2}·${y} = ${Sm} ✓.` };
        }
        if (kind === "endirim") {
          let x, p, up, Q;
          do { x = rnd(4, 80) * 5; p = pick([10, 20, 25, 30, 40, 50, 60, 75]); up = Math.random() < .3; Q = x * (up ? 100 + p : 100 - p) / 100; } while (!Number.isInteger(Q));
          const k = up ? 100 + p : 100 - p;
          return { text: up ? `Malın qiyməti ${p}% artandan sonra ${Q} manat oldu. Əvvəlki qiyməti neçə manat idi?` : `Mal ${p}% endirimlə ${Q} manata satılır. Endirimdən əvvəl qiyməti neçə manat idi?`, answer: x, show: String(x), tol: 0.01, unit: "manat",
            solution: `x — əvvəlki qiymət. ${up ? `Artandan sonra qiymət x-in ${k}%-i olur` : `Endirimdən sonra x-in ${k}%-i qalır`}: x·${k}/100 = ${Q} → x = ${Q}·100/${k} = ${x}. (${up ? "Sadəcə " + p + "% çıxmaq" : "Sadəcə " + p + "% əlavə etmək"} səhvdir: faiz yeni qiymətdən yox, əvvəlkindən hesablanıb.)` };
        }
        const a = rnd(2, 5), b = rnd(2, 5), k = rnd(1, 8), x = a * b * k, R = (a - 1) * (b - 1) * k;
        return { text: `Fikrət pulunun 1/${a} hissəsini kitaba, qalan pulun 1/${b} hissəsini dəftərə xərclədi. Ona ${R} manat qaldı. Əvvəlcə onun neçə manatı var idi?`, answer: x, show: String(x), tol: 0.01, unit: "manat",
          solution: `x — ilkin pul. Kitabdan sonra x·${a - 1}/${a} qalır, dəftərdən sonra bunun ${b - 1}/${b} hissəsi: x·${frac((a - 1) * (b - 1), a * b)} = ${R} → x = ${x}. Yoxla: kitab ${x / a}, qalan ${x - x / a}; dəftər ${(x - x / a) / b}, qalan ${R} ✓.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2), ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        if (Math.random() < .5) { // age: father F, son s, after x years k times
          let s, x, k, F; do { s = rnd(4, 14); x = rnd(2, 15); k = rnd(2, 3); F = k * (s + x) - x; } while (F - s < 20 || F > 60);
          const steps = [`x ildən sonra ata ${F} + x, oğlu ${s} + x yaşında olacaq.`, `Tənlik: ${F} + x = ${k}(${s} + x).`, `${F} + x = ${k * s} + ${k}x → ${solve(k - 1, F - k * s)}.`];
          if (bad === 0) { steps[0] = `x ildən sonra ata ${F} + x, oğlu ${s} yaşında olacaq.`; steps[1] = `Tənlik: ${F} + x = ${k}·${s}.`; steps[2] = `x = ${k * s} − ${F} = ${S(k * s - F)}.`; }
          if (bad === 1) { steps[1] = `Tənlik: ${k}(${F} + x) = ${s} + x.`; steps[2] = `${k * F} + ${k}x = ${s} + x → ${solve(k - 1, s - k * F)}.`; }
          if (bad === 2) steps[2] = `${F} + x = ${k * s} + ${k}x → ${solve(k - 1, F + k * s)}.`;
          const text = h("div", {}, h("p", {}, `Məsələ: ata ${F}, oğlu ${s} yaşındadır. Neçə ildən sonra ata oğlundan ${k} dəfə böyük olacaq?`),
            h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
          const why = [`1-ci addım: x ildən sonra oğlu da x il böyüyür — ${s} + x olmalıdır.`,
            `2-ci addım: ata oğlundan ${k} dəfə böyükdür, deməli ${k} dəfə artırılan oğlunun yaşıdır: ${F} + x = ${k}(${s} + x).`,
            `3-cü addım: x-ləri bir tərəfə keçirəndə ${k * s} işarəsini dəyişir: ${poly([[k - 1, "x"]])} = ${F} − ${k * s} = ${F - k * s}${k === 2 ? "" : ` → x = ${x}`}.`][bad];
          return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
        }
        const [v1, v2, V] = pick(EQD), L = lcm(v1, v2), t1 = L / v1, t2 = L / v2;
        const steps = [`Yarı yol ${L} km olsun. Vaxtlar: ${L}/${v1} = ${t1} saat, ${L}/${v2} = ${t2} saat.`, `Ümumi yol ${2 * L} km, ümumi vaxt ${t1 + t2} saat.`, `Orta sürət = ${2 * L}/${t1 + t2} = ${V} km/saat.`];
        if (bad === 0) { steps[0] = `Yarı yol ${L} km olsun. Vaxtlar: ${L}/${v1} = ${t1 + 1} saat, ${L}/${v2} = ${t2} saat.`; steps[1] = `Ümumi yol ${2 * L} km, ümumi vaxt ${t1 + t2 + 1} saat.`; steps[2] = `Orta sürət = ${2 * L}/${t1 + t2 + 1} = ${frac(2 * L, t1 + t2 + 1)} km/saat.`; }
        if (bad === 1) { steps[1] = `Ümumi yol ${L} km, ümumi vaxt ${t1 + t2} saat.`; steps[2] = `Orta sürət = ${L}/${t1 + t2} = ${frac(L, t1 + t2)} km/saat.`; }
        if (bad === 2) steps[2] = `Orta sürət = (${v1} + ${v2})/2 = ${(v1 + v2) / 2} km/saat.`;
        const text = h("div", {}, h("p", {}, `Məsələ: maşın A-dan B-yə ${v1} km/saat, geri ${v2} km/saat sürətlə getdi. Orta sürət?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: ${L}/${v1} = ${t1}, ${t1 + 1} yox.`,
          `2-ci addım: maşın yolu iki dəfə gedib (getmə və qayıtma) — ümumi yol ${2 * L} km.`,
          `3-cü addım: orta sürət sürətlərin ortası deyil, ümumi yol ÷ ümumi vaxt: ${2 * L}/${t1 + t2} = ${V}.`][bad];
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
      key: "tenlik-qurmaqla-mesele", title: "Tənlik qurmaqla məsələ həlli", fenn: "riyaziyyat", link: "dersler/tenlik-qurmaqla-mesele.html",
      format: "Cavab ədəddir, vahidsiz: 48 (km/saat yazma), 12, 250. Lazım olsa kəsr 5/2 və ya onluq 2.5.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["eded-yas", "eded-yas", "reqem", "herekat", "herekat", "orta", "orta", "is-qarisiq", "is-qarisiq", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/tenlik-qurmaqla-mesele.html")) b.push("dersler/tenlik-qurmaqla-mesele.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
