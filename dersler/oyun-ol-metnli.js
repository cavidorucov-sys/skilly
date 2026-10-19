// Olimpiada: mətnli məsələlər (hərəkət, iş-hovuz, mürəkkəb faiz, qarışıq və sulandırma, yaş) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
// Tables of "nice" numbers are built once, so every generated problem has a whole-number (or simple fraction) answer.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const S = n => n < 0 ? "−" + (-n) : String(n);
  const frac = (p, q) => { if (q < 0) { p = -p; q = -q; } const g = gcd(Math.abs(p), q) || 1; return q / g === 1 ? S(p / g) : S(p / g) + "/" + (q / g); };
  const NAMES = ["Elvin", "Leyla", "Kamran", "Nigar", "Rauf", "Aysel", "Tural", "Səbinə"];
  const whole = (n, text, solution, unit) => ({ text, answer: n, show: String(n), tol: 0.01, unit, solution });
  const sh = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const C3 = ["1-ci addım", "2-ci addım", "3-cü addım"];

  // ---- tables ----
  const CATCH = [];   // cyclist v1, h hours head start, motorcyclist v2: distance from start
  for (let v1 = 8; v1 <= 30; v1++) for (let v2 = v1 + 2; v2 <= 90; v2++) for (let hh = 1; hh <= 4; hh++) { if ((v1 * hh * v2) % (v2 - v1) === 0 && v1 * hh * v2 / (v2 - v1) <= 420 && (v1 * hh) % (v2 - v1) === 0) CATCH.push([v1, v2, hh]); }
  const AVG = [];     // v1, v2 → harmonic mean is whole
  for (let a = 10; a <= 90; a++) for (let b = a + 1; b <= 90; b++) if ((2 * a * b) % (a + b) === 0) AVG.push([a, b, 2 * a * b / (a + b)]);
  const RAFT = [];    // t1 (downstream), t2 (upstream) hours; raft time whole
  for (let v = 5; v <= 24; v++) for (let u = 1; u < v - 1 && u <= 6; u++) { const l = (v + u) * (v - u) / gcd(v + u, v - u); for (let d = l; d <= 300; d += l) if (d % u === 0) RAFT.push([d / (v + u), d / (v - u), d / u, v, u, d]); }
  const ESC = [];     // a steps at speed u, b steps at speed 2u → N
  for (const [rn, rd] of [[1, 2], [1, 1], [3, 2], [2, 1], [3, 1]]) for (let a = 6; a <= 40; a++) {
    const N = a * (rd + rn) / rd, b = a * (rd + rn) / (rd + rn / 2);
    if (Number.isInteger(N) && Number.isInteger(b) && b !== a) ESC.push([a, b, N, rn, rd]);
  }
  const TWO = [];     // A in x days, B in y days, together k days, then one finishes alone
  for (let x = 3; x <= 40; x++) for (let y = x + 1; y <= 40; y++) for (let k = 1; k <= 10; k++) {
    const rem = x * y - k * (x + y); if (rem <= 0) continue;
    if (rem % y === 0 && rem / y >= 2 && k + rem / y <= 40) TWO.push([x, y, k, rem / y, "A"]);
    if (rem % x === 0 && rem / x >= 2 && k + rem / x <= 40) TWO.push([x, y, k, rem / x, "B"]);
  }
  const TRIO = [];    // x, y, z days each alone: pair times and the common time are whole
  for (let x = 4; x <= 60; x++) for (let y = x; y <= 60; y++) for (let z = y; z <= 60; z++) {
    if ((x * y) % (x + y) || (y * z) % (y + z) || (x * z) % (x + z)) continue;
    const num = x * y * z, den = x * y + y * z + x * z; if (num % den) continue;
    if (x === y && y === z) continue;
    TRIO.push([x, y, z, x * y / (x + y), y * z / (y + z), x * z / (x + z), num / den]);
  }
  const POOL3 = [];   // fill a, fill b, drain c → time whole
  for (let a = 2; a <= 24; a++) for (let b = a; b <= 24; b++) for (let c = 2; c <= 60; c++) { const num = a * b * c, den = b * c + a * c - a * b; if (den > 0 && num % den === 0 && num / den <= 60 && num / den > 1 && c > num / den) POOL3.push([a, b, c, num / den]); }
  const SQUAD = [];   // n workers, d days; after k days m leave → total days
  for (let n = 4; n <= 30; n++) for (let d = 6; d <= 30; d++) for (let k = 2; k < d; k++) for (let m = 1; m < n; m++) { const rem = n * (d - k); if (rem % (n - m) === 0 && n - m >= 2) { const T = k + rem / (n - m); if (T <= 60) SQUAD.push([n, d, k, m, T]); } }
  const AGES = [];    // t years ago r times, u years later s times
  for (let B = 6; B <= 22; B++) for (let A = B + 18; A <= 48; A++) for (let t = 1; t < B; t++) {
    if (B - t < 4 || (A - t) % (B - t) || (A - t) / (B - t) < 2 || (A - t) / (B - t) > 8) continue;
    const r = (A - t) / (B - t);
    for (let u = 1; u <= 14; u++) if ((A + u) % (B + u) === 0) { const s = (A + u) / (B + u); if (s >= 2 && s < r) AGES.push([A, B, t, r, u, s]); }
  }
  const DIL = [];     // fresh water % w1, mass M, dry water % w2
  for (const w1 of [90, 95, 96, 98, 99, 80, 70]) for (const w2 of [10, 20, 25, 30, 40, 50, 60, 75, 80]) { if (w2 >= w1) continue; for (let M = 10; M <= 1000; M += 10) if ((M * (100 - w1)) % 100 === 0 && (M * (100 - w1)) % (100 - w2) === 0 && M * (100 - w1) / (100 - w2) >= 1) { DIL.push([w1, w2, M, M * (100 - w1) / (100 - w2)]); } }
  const WATER = [];   // M kg p% + water → q%
  for (let p = 10; p <= 90; p += 5) for (let q = 5; q < p; q += 5) for (let M = 5; M <= 200; M += 5) if ((M * p) % 100 === 0 && (M * (p - q)) % q === 0) { const wv = M * (p - q) / q; if (wv >= 2 && wv <= 400) WATER.push([p, q, M, wv]); }
  const MIX = [];     // a kg p% + b kg q% → r%
  for (let p = 10; p <= 90; p += 5) for (let q = 5; q < p; q += 5) for (let a = 1; a <= 20; a++) for (let b = 1; b <= 20; b++) if (a !== b && (a * p + b * q) % 100 === 0 && (a * p + b * q) % (a + b) === 0) MIX.push([p, q, a, b, (a * p + b * q) / (a + b)]);

  const levels = [
    { id: "hereket", ad: "Hərəkət: görüş, yetişmə, çay", izah: "Yaxınlaşma sürəti (qarşı-qarşıya) = cəm, yetişmə sürəti (eyni istiqamət) = fərq. Çayda: axınla v + u, axına qarşı v − u.",
      gen() {
        const kind = pick(["gorus", "gorus", "yetis", "yetis", "dayire", "orta", "sal", "esk"]);
        if (kind === "gorus") {
          const [m, n] = pick([[1, 2], [2, 3], [1, 3], [3, 4], [2, 5], [3, 5], [1, 4]].map(p => Math.random() < .5 ? p : [p[1], p[0]])), k = pick([1, 1, 2]);
          const T = m * n * k, a = n * n * k, b = m * m * k;
          const who = pick(["avtomobil", "qatar", "motosikletçi"]);
          const base = `A və B şəhərlərindən eyni anda iki ${who} bir-birinə doğru yola çıxdı (sürətləri sabitdir). Görüşdən sonra birinci B-yə çatmaq üçün ${a} saat, ikinci A-ya çatmaq üçün ${b} saat sərf etdi.`;
          const ask = pick(["T", "tot", "ratio"]);
          const sol = `Birincinin sürəti m, ikincinin n olsun, görüşə qədər T saat getdilər. Görüşə qədər birinci mT, ikinci nT məsafə gedib. Görüşdən sonra birinci nT-ni m sürətlə: nT/m = ${a}, ikinci mT-ni n sürətlə: mT/n = ${b}. Bunları vursaq T² = ${a}·${b} = ${a * b} → T = ${T}. Sürətlər nisbəti m/n = √(${b}/${a}) = ${frac(m, n)}.`;
          if (ask === "T") return whole(T, base + " Onlar yola çıxandan neçə saat sonra görüşüb?", sol + ` Cavab: ${T} saat.`, "saat");
          if (ask === "tot") return whole(T + a, base + " Birinci yolun hamısını neçə saata gedib?", sol + ` Birincinin bütün yolu: ${T} + ${a} = ${T + a} saat.`, "saat");
          return { text: base + " Birincinin sürətinin ikincinin sürətinə nisbətini tap.", answer: m / n, show: frac(m, n), tol: 1e-4, placeholder: "məs. 3/4", solution: sol + ` Cavab: ${frac(m, n)}.` };
        }
        if (kind === "yetis") {
          const [v1, v2, hh] = pick(CATCH), d = v1 * hh * v2 / (v2 - v1), t = v1 * hh / (v2 - v1);
          return whole(d, `Velosipedçi A məntəqəsindən ${v1} km/saat sürətlə yola çıxdı. ${hh} saat sonra həmin yolla motosikletçi ${v2} km/saat sürətlə onun ardınca yola düşdü. Motosikletçi velosipedçiyə A-dan neçə kilometr aralıda çatar?`,
            `Motosikletçi yola çıxanda velosipedçi artıq ${v1}·${hh} = ${v1 * hh} km gedib. Yetişmə sürəti ${v2} − ${v1} = ${v2 - v1} km/saat → ${v1 * hh}/${v2 - v1} = ${t} saat sonra çatır. Məsafə: ${v2}·${t} = ${d} km (yoxla: ${v1}·${t + hh} = ${d}).`, "km");
        }
        if (kind === "dayire") {
          const v2 = rnd(2, 7), v1 = v2 + rnd(1, 5), t = rnd(4, 40), same = Math.random() < .5, L = t * (same ? v1 - v2 : v1 + v2);
          return whole(t, `Uzunluğu ${L} m olan dairəvi yolun eyni nöqtəsindən iki qaçışçı eyni anda start götürür, sürətləri ${v1} m/san və ${v2} m/san-dir. Onlar ${same ? "eyni istiqamətdə" : "əks istiqamətlərdə"} qaçırlar. Neçə saniyə sonra ilk dəfə yenə rastlaşacaqlar?`,
            same ? `Eyni istiqamətdə sürətli qaçışçı yavaşı bir tam dövrə (${L} m) qabağa keçəndə rastlaşırlar. Fərq sürəti ${v1} − ${v2} = ${v1 - v2} m/san → ${L}/${v1 - v2} = ${t} san.`
              : `Əks istiqamətdə birlikdə bir tam dövrə (${L} m) qət edəndə rastlaşırlar. Yaxınlaşma sürəti ${v1} + ${v2} = ${v1 + v2} m/san → ${L}/${v1 + v2} = ${t} san.`, "san");
        }
        if (kind === "orta") {
          const [a, b, hm] = pick(AVG), [x, y] = Math.random() < .5 ? [a, b] : [b, a];
          return whole(hm, `Turist A-dan B-yə ${x} km/saat, qayıdarkən eyni yolla ${y} km/saat sürətlə getdi. Bütün yol boyu orta sürəti neçə km/saatdır?`,
            `Yol d olsun. Vaxt: d/${x} + d/${y}. Orta sürət = bütün yol / bütün vaxt = 2d/(d/${x} + d/${y}) = 2·${x}·${y}/(${x} + ${y}) = ${2 * a * b}/${a + b} = ${hm} km/saat. (Hesabi orta ${String((a + b) / 2).replace(".", ",")} səhv cavabdır: vaxtlar fərqlidir.)`, "km/saat");
        }
        if (kind === "sal") {
          const [t1, t2, R, v, u] = pick(RAFT);
          return whole(R, `Gəmi iki liman arasında axın istiqamətində ${t1} saata, axına qarşı ${t2} saata gedir. Eyni məsafəni sal (taxta parçası) axınla neçə saata gedər? (Sal axının sürəti ilə hərəkət edir.)`,
            `Məsafə d, gəmi v, axın u olsun: d/(v + u) = ${t1}, d/(v − u) = ${t2}. Çıxsaq: d/(v − u) − d/(v + u) = 2du/(v² − u²) = ${t2 - t1}. Hasil: t₁t₂ = d²/(v² − u²) = ${t1 * t2}. Bölsək: (t₂ − t₁)/(t₁t₂) = 2u/d → d/u = 2t₁t₂/(t₂ − t₁) = 2·${t1 * t2}/${t2 - t1} = ${R} saat.`, "saat");
        }
        const [a, b, N, rn, rd] = pick(ESC), nm = pick(NAMES);
        return whole(N, `Eskalator aşağı hərəkət edir. ${nm} eskalatorla birgə aşağı piyada getdi və ${a} pilləkən saydı. Eyni istiqamətdə iki dəfə sürətli getsə, ${b} pilləkən sayardı. Eskalatorun görünən hissəsində neçə pilləkən var?`,
          `${nm}-in sürəti u pilləkən/vahid vaxt, eskalatorun sürəti e olsun, r = e/u. Görünən pilləkənlər N: ${nm} N/(u + e) vaxt gedir və u·N/(u + e) = N/(1 + r) pilləkən sayır → N = ${a}(1 + r). İki dəfə sürətli: N = ${b}(1 + r/2). ${a}(1 + r) = ${b}(1 + r/2) → r = ${frac(rn, rd)}. N = ${a}·${frac(rn + rd, rd)} = ${N}.`);
      } },

    { id: "is", ad: "İş və hovuz", izah: "Bütün işi 1 götür. x günə bitirən işçinin sürəti 1/x-dir. Birlikdə işləyənlərin sürətləri toplanır.",
      gen() {
        const kind = pick(["iki", "iki", "uc", "uc", "hovuz", "novbe", "briqada"]);
        if (kind === "iki") {
          const [x, y, k, rest, who] = pick(TWO), left = who === "A" ? "B" : "A", tail = who === "A" ? x : y, other = who === "A" ? y : x;
          const nm = (c) => c === "A" ? "Birinci usta" : "İkinci usta";
          const ax = who === "A" ? x : y, bx = who === "A" ? y : x;
          return whole(k + rest, `Birinci usta işi təkbaşına ${x} günə, ikinci usta ${y} günə bitirir. İkisi birlikdə ${k} gün işlədi, sonra ${who === "A" ? "ikinci" : "birinci"} usta getdi və qalan işi ${who === "A" ? "birinci" : "ikinci"} usta təkbaşına bitirdi. İş cəmi neçə günə bitdi?`,
            `Birlikdə 1 günə 1/${x} + 1/${y} = ${x + y}/${x * y} iş görürlər, ${k} günə ${frac(k * (x + y), x * y)}. Qalan: 1 − ${frac(k * (x + y), x * y)} = ${frac(x * y - k * (x + y), x * y)}. Təkbaşına ${who === "A" ? x : y} günə bitirən usta onu ${frac(x * y - k * (x + y), x * y)}·${tail} = ${rest} günə bitirir. Cəmi: ${k} + ${rest} = ${k + rest} gün.`, "gün");
        }
        if (kind === "uc") {
          const [x, y, z, a, b, c, T] = pick(TRIO), perm = sh([[x, y, z, a, b, c], [y, z, x, b, c, a]]) && pick([[x, y, z], [y, z, x], [z, x, y]]);
          const [X, Y, Z] = perm, ab = X * Y / (X + Y), bc = Y * Z / (Y + Z), ac = X * Z / (X + Z);
          const base = `Üç işçi var: A və B birlikdə işi ${ab} günə, B və C birlikdə ${bc} günə, A və C birlikdə ${ac} günə bitirir.`;
          if (Math.random() < .5) return whole(T, base + " Üçü birlikdə işləsə, işi neçə günə bitirərlər?",
            `Sürətlər: A + B = 1/${ab}, B + C = 1/${bc}, A + C = 1/${ac}. Üçünü toplasaq 2(A + B + C) = 1/${ab} + 1/${bc} + 1/${ac} = ${frac(ab * bc + ab * ac + bc * ac, ab * bc * ac)} → A + B + C = ${frac(ab * bc + ab * ac + bc * ac, 2 * ab * bc * ac)} → ${T} gün.`, "gün");
          return whole(X, base + " A işi təkbaşına neçə günə bitirər?",
            `A = ((A + B) + (A + C) − (B + C))/2 = (1/${ab} + 1/${ac} − 1/${bc})/2 = ${frac(bc * ac + ab * bc - ab * ac, 2 * ab * bc * ac)} iş/gün → ${X} gün.`, "gün");
        }
        if (kind === "hovuz") {
          const [a, b, c, T] = pick(POOL3);
          return whole(T, `Hovuzu birinci boru ${a} saata, ikinci boru ${b} saata doldurur, üçüncü boru isə dolu hovuzu ${c} saata boşaldır. Boş hovuzda üç boru eyni anda açılsa, hovuz neçə saata dolar?`,
            `Sürətlər: doldurma 1/${a} + 1/${b}, boşaltma −1/${c}. Cəmi: ${frac(b * c + a * c - a * b, a * b * c)} hovuz/saat → hovuz ${T} saata dolur.`, "saat");
        }
        if (kind === "novbe") {
          const c = rnd(2, 9), ds = []; for (let d = 1; d <= c * c; d++) if ((c * c) % d === 0) ds.push(d);
          const d = pick(ds), a = c + d, b = c + c * c / d;
          return whole(2 * c, `Birinci boru hovuzu ${a} saata, ikinci boru ${b} saata doldurur. Boruları növbə ilə açırlar: əvvəl birinci 1 saat, sonra ikinci 1 saat, sonra yenə birinci 1 saat və s. Boş hovuz neçə saata dolar?`,
            `İki saatlıq dövrədə dolan hissə: 1/${a} + 1/${b} = ${frac(a + b, a * b)} = 1/${c}. Deməli, ${c} dövrə = ${2 * c} saatdan sonra hovuz tam dolur (axırıncı dövrəyə qədər ${frac(c - 1, c)} dolur, qalan 1/${c} isə dövrənin sonunda bitir; birinci borunun 1 saatlıq payı 1/${a} < 1/${c} olduğuna görə hovuz dövrənin ortasında dolmur).`, "saat");
        }
        const [n, d, k, m, T] = pick(SQUAD);
        return whole(T, `${n} fəhlə işi ${d} günə bitirə bilər. ${k} gün işlədikdən sonra ${m} fəhlə getdi, qalanlar işi bitirdilər (hər fəhlənin gündəlik işi eynidir). İş cəmi neçə günə bitdi?`,
          `Bütün iş: ${n}·${d} = ${n * d} fəhlə-gün. ${k} gündə görülüb: ${n}·${k} = ${n * k}. Qalıb: ${n * d - n * k} fəhlə-gün. ${n - m} fəhlə onu ${(n * d - n * k) / (n - m)} günə bitirir. Cəmi: ${k} + ${(n * d - n * k) / (n - m)} = ${T} gün.`, "gün");
      } },

    { id: "faiz", ad: "Mürəkkəb faiz", izah: "n il, hər il r%: məbləğ hər il (1 + r/100) dəfə artır — S · (1 + r/100)ⁿ. Ardıcıl faizlər toplanmır, vurulur.",
      gen() {
        const kind = pick(["bank", "bank", "serf", "tap", "iki", "ferqli", "ardicil"]);
        const base = (r, n) => { const den = 100 ** n; return den / gcd(den, (100 + r) ** n); };
        if (kind === "bank") {
          const r = pick([10, 20, 25, 50, 5, 40]), n = pick([2, 2, 3]), S0 = base(r, n) * Math.ceil(100 / base(r, n)) * rnd(1, 3), A = S0 * (100 + r) ** n / 100 ** n;
          if (S0 > 20000 || A > 100000) return levels[2].gen();
          const ask = pick(["sum", "gain"]);
          return whole(ask === "sum" ? A : A - S0, `Bankda ${S0} manat illik ${r}% mürəkkəb faizlə (faiz hər il yığılmış məbləğə hesablanır) ${n} il saxlanıldı. ${ask === "sum" ? "İlin sonunda hesabda neçə manat olacaq?" : "Bu müddətdə neçə manat faiz gəliri olacaq?"}`,
            `Hər il məbləğ ${frac(100 + r, 100)} dəfə artır: ${S0}·(${frac(100 + r, 100)})${n === 2 ? "²" : "³"} = ${A} manat.` + (ask === "gain" ? ` Gəlir: ${A} − ${S0} = ${A - S0} manat.` : ""), "manat");
        }
        if (kind === "serf") {
          const a = pick([10, 20, 25, 30, 40, 50]), b = pick([10, 20, 25, 30, 40, 50]), X = 100 * rnd(1, 9) * 5;
          if ((X * (100 + a) * (100 - b)) % 10000) return levels[2].gen();
          const F = X * (100 + a) * (100 - b) / 10000;
          return whole(F, `Malın qiyməti ${X} manat idi. Əvvəl ${a}% bahalaşdı, sonra yeni qiymət ${b}% ucuzlaşdı. Malın axırıncı qiyməti neçə manatdır?`,
            `${a}% bahalaşma: ${X}·${frac(100 + a, 100)} = ${X * (100 + a) / 100}. Sonra ${b}% ucuzlaşma — yeni qiymətin ${b}%-i: ${X * (100 + a) / 100}·${frac(100 - b, 100)} = ${F} manat. (Faizlər toplanmır: hər dəfə yeni qiymətdən hesablanır.)`, "manat");
        }
        if (kind === "tap") {
          const r = pick([10, 20, 25, 50, 30, 40]), n = pick([2, 2, 3]), S0 = base(r, n) * Math.ceil(100 / base(r, n)) * rnd(1, 2), A = S0 * (100 + r) ** n / 100 ** n;
          if (S0 > 20000 || A > 100000 || (n === 3 && r > 30)) return levels[2].gen();
          return whole(r, `Bankda ${S0} manat qoyuldu. Hər il eyni faizlə mürəkkəb hesablanmaqla ${n} ildən sonra hesabda ${A} manat oldu. İllik faiz neçə faizdir?`,
            `${S0}·(1 + r/100)${n === 2 ? "²" : "³"} = ${A} → (1 + r/100)${n === 2 ? "²" : "³"} = ${A}/${S0} = ${frac(A, S0)} = (${frac(100 + r, 100)})${n === 2 ? "²" : "³"}. Deməli, 1 + r/100 = ${frac(100 + r, 100)} → r = ${r}.`, "%");
        }
        if (kind === "iki") {
          const x = pick([10, 20, 30, 40, 50]), up = Math.random() < .5, c = up ? 100 + x : 100 - x, tot = up ? c * c / 100 - 100 : 100 - c * c / 100;
          return whole(x, `Malın qiyməti ardıcıl iki dəfə eyni faizlə ${up ? "artırıldı" : "azaldıldı"}. Nəticədə qiymət ilkin qiymətə nisbətən ${tot}% ${up ? "artdı" : "azaldı"}. Hər dəfə qiymət neçə faizlə dəyişib?`,
            `Hər dəfə qiymət ${frac(c, 100)} dəfə dəyişir. İki dəfə: (${frac(c, 100)})² = ${frac(c * c, 10000)} — yəni ilkin qiymətin ${c * c / 100}%-i. İlkin qiymətin ${c * c / 100}%-i alınırsa, ${up ? "artım" : "azalma"} ${tot}%-dir. Deməli, bir dəfəlik əmsal ${frac(c, 100)}, faiz ${x}.`, "%");
        }
        if (kind === "ferqli") {
          const r1 = pick([10, 20, 30, 40, 50]), r2 = pick([10, 20, 30, 40, 50]), tot = (100 + r1) * (100 + r2) / 100 - 100;
          return whole(tot, `Depozitin məbləği birinci il ${r1}%, ikinci il ${r2}% artdı (hər il yığılmış məbləğə nisbətən). İki ildə depozit ilkin məbləğə nisbətən neçə faiz artıb?`,
            `Əmsallar vurulur: ${frac(100 + r1, 100)}·${frac(100 + r2, 100)} = ${frac((100 + r1) * (100 + r2), 10000)} = ${String((100 + r1) * (100 + r2) / 10000).replace(".", ",")}. Artım: ${tot}%. (Cəm ${r1 + r2}% yanlışdır: ikinci faiz artmış məbləğdən hesablanır.)`, "%");
        }
        const a = pick([10, 20, 30, 40, 50]);
        return whole(a * a / 100, `Qiymət ${a}% artırıldı, sonra yeni qiymət ${a}% azaldıldı. Son qiymət ilkin qiymətdən neçə faiz aşağıdır?`,
          `İlkin qiymət 100 olsun. Artırılandan sonra ${100 + a}. ${a}% azalma: ${100 + a}·${frac(100 - a, 100)} = ${(100 + a) * (100 - a) / 100}. Aşağıdır: 100 − ${(100 + a) * (100 - a) / 100} = ${a * a / 100}%. (Ümumi qayda: (1 + p)(1 − p) = 1 − p².)`, "%");
      } },

    { id: "qarisiq", ad: "Qarışıq və sulandırma", izah: "Maddənin kütləsi = məhlulun kütləsi · konsentrasiya. Su əlavə etsən maddə dəyişmir; hər dəfə çıxaranda maddənin də bir payı çıxır.",
      gen() {
        const kind = pick(["tekrar", "tekrar", "tersh", "su", "qar", "quru", "buxar"]);
        if (kind === "tekrar") {
          const k = pick([2, 3, 4, 5]), n = k === 2 ? pick([2, 3, 4]) : pick([2, 3]), t = rnd(1, k > 3 ? 2 : 3), a = t * k ** (n - 1), V = a * k, left = a * (k - 1) ** n / k ** (n - 1);
          const liq = pick(["spirt", "sirkə", "şirə"]);
          return whole(left, `Qabda ${V} litr təmiz ${liq} var. Qabdan ${a} litr çıxarılıb yerinə ${a} litr su əlavə edildi, yaxşıca qarışdırıldı. Bu əməliyyat cəmi ${n} dəfə təkrarlandı (hər dəfə ${a} litr çıxarılıb ${a} litr su əlavə edilir). Qabda neçə litr təmiz ${liq} qalıb?`,
            `Hər dəfə qabdakı təmiz maddənin ${frac(V - a, V)} hissəsi qalır (çıxarılan ${a} litr qarışıqda onun payı da var). ${n} dəfədən sonra: ${V}·(${frac(k - 1, k)})${n === 2 ? "²" : n === 3 ? "³" : "⁴"} = ${left} litr.`, "litr");
        }
        if (kind === "tersh") {
          const x = pick([[1, 10, 81], [1, 5, 64], [3, 10, 49], [2, 5, 36], [1, 2, 25], [3, 5, 16]]), V = x[1] * rnd(1, 4) * (x[1] === 10 ? 2 : 1), a = V * x[0] / x[1];
          return whole(a, `Qabda ${V} litr təmiz spirt var. Qabdan bir neçə litr çıxarıb yerinə eyni miqdarda su əlavə etdilər, sonra yenə həmin qədər qarışıq çıxarıb yerinə su əlavə etdilər. Axırda qabdakı məhlulun konsentrasiyası ${x[2]}% oldu. Hər dəfə neçə litr çıxarılıb?`,
            `Hər dəfə spirtin (1 − a/${V}) hissəsi qalır. İki dəfədən sonra konsentrasiya (1 − a/${V})² = ${x[2]}/100 → 1 − a/${V} = ${frac(Math.round(Math.sqrt(x[2])), 10)} → a/${V} = ${frac(x[0], x[1])} → a = ${a} litr.`, "litr");
        }
        if (kind === "su") {
          const [p, q, M, wv] = pick(WATER);
          return whole(wv, `${M} kq ${p}%-li duz məhluluna neçə kiloqram su əlavə etmək lazımdır ki, məhlulun konsentrasiyası ${q}% olsun?`,
            `Duzun kütləsi dəyişmir: ${M}·${p}/100 = ${M * p / 100} kq. Yeni məhlulun kütləsi ${M * p / 100}/(${q}/100) = ${M * p / q} kq. Əlavə su: ${M * p / q} − ${M} = ${wv} kq.`, "kq");
        }
        if (kind === "qar") {
          const [p, q, a, b, r] = pick(MIX);
          if (Math.random() < .5) return whole(r, `${a} kq ${p}%-li və ${b} kq ${q}%-li duz məhlulu qarışdırıldı. Alınan məhlulun konsentrasiyası neçə faizdir?`,
            `Duzun kütləsi: ${a}·${p}/100 + ${b}·${q}/100 = ${(a * p + b * q) / 100} kq. Məhlul ${a + b} kq. Konsentrasiya: ${(a * p + b * q) / 100}/${a + b} = ${r}%.`, "%");
          return whole(b, `${a} kq ${p}%-li duz məhluluna neçə kiloqram ${q}%-li məhlul qatmaq lazımdır ki, alınan məhlulun konsentrasiyası ${r}% olsun?`,
            `Duzun kütləsi: ${a}·${p}/100 + b·${q}/100 = (${a} + b)·${r}/100 → ${a * p} + ${q}b = ${r * a} + ${r}b → ${a * (p - r)} = ${r - q}b → b = ${b} kq.`, "kq");
          return whole(r, `${a} kq ${p}%-li və ${b} kq ${q}%-li duz məhlulu qarışdırıldı. Alınan məhlulun konsentrasiyası neçə faizdir?`, `Duzun kütləsi: ${a}·${p}/100 + ${b}·${q}/100 = ${(a * p + b * q) / 100} kq. Məhlul ${a + b} kq. Konsentrasiya: ${r}%.`, "%");
        }
        if (kind === "quru") {
          const [w1, w2, M, D] = pick(DIL);
          return whole(D, `Təzə meyvənin tərkibində ${w1}% su var. ${M} kq təzə meyvəni qurutdular və qurudulmuş meyvədə ${w2}% su qaldı. Qurudulmuş meyvənin kütləsi neçə kiloqramdır?`,
            `Quru maddənin kütləsi dəyişmir. Təzədə quru maddə: ${M}·${100 - w1}/100 = ${M * (100 - w1) / 100} kq. Qurudulmuşda quru maddə ${100 - w2}%-dir → kütlə ${M * (100 - w1) / 100}/(${100 - w2}/100) = ${D} kq.`, "kq");
        }
        const cand = []; for (let M = 10; M <= 400; M += 10) for (const pp of [2, 4, 5, 8, 10, 12, 15, 20]) for (const qq of [10, 20, 25, 30, 40, 50]) if (qq > pp && (M * pp) % 100 === 0 && (M * pp) % qq === 0) cand.push([M, pp, qq]);
        const [M, pp, qq] = pick(cand), left = M * pp / qq;
        return whole(M - left, `${M} kq ${pp}%-li duz məhlulundan suyun bir hissəsini buxarlandırdılar və məhlulun konsentrasiyası ${qq}% oldu. Neçə kiloqram su buxarlanıb?`,
          `Duzun kütləsi dəyişmir: ${M}·${pp}/100 = ${M * pp / 100} kq. Yeni məhlul: ${M * pp / 100}/(${qq}/100) = ${left} kq. Buxarlanan su: ${M} − ${left} = ${M - left} kq.`, "kq");
      } },

    { id: "yas", ad: "Yaş məsələləri", izah: "Yaşlar fərqi həmişə eyni qalır! Hər şəxsin yaşı üçün bir dəyişən götür, zamanı t il əvvəl / sonra kimi yaz.",
      gen() {
        const kind = pick(["cedvel", "cedvel", "ferq", "ferq", "vaxt"]);
        if (kind === "cedvel") {
          const [A, B, t, r, u, s] = pick(AGES);
          return whole(A, `Atanın yaşı oğlunun yaşından xeyli böyükdür. ${t} il əvvəl ata oğlundan ${r} dəfə böyük idi. ${u} il sonra isə ata oğlundan ${s} dəfə böyük olacaq. Ata indi neçə yaşındadır?`,
            `Oğul indi x, ata y yaşındadır. y − ${t} = ${r}(x − ${t}) və y + ${u} = ${s}(x + ${u}). Birincidən y = ${r}x − ${t * (r - 1)}, ikincidən y = ${s}x + ${u * (s - 1)}. Bərabərləşdirsək: ${r - s}x = ${t * (r - 1) + u * (s - 1)} → x = ${B}, y = ${A}. Yoxla: ${A - t} = ${r}·${B - t}; ${A + u} = ${s}·${B + u}.`, "yaş");
        }
        if (kind === "ferq") {
          const f = pick([2, 3]), k = rnd(2, 8), A = f === 2 ? 4 * k : 3 * k, B = f === 2 ? 3 * k : 2 * k, part = f === 2 ? "yarısı" : "üçdə biri";
          return whole(A, `Əli ilə Vəlinin yaşlarının cəmi ${A + B} ildir. Əli Vəlinin indiki yaşında olanda Vəlinin yaşı Əlinin indiki yaşının ${part} idi. Əli indi neçə yaşındadır?`,
            `Əli x, Vəli y yaşındadır, x > y. Əli y yaşında olanda (x − y) il əvvəl idi; o vaxt Vəlinin yaşı y − (x − y) = 2y − x. Şərt: 2y − x = x/${f} → y = x·${frac(f + 1, 2 * f)}. Cəm: x + x·${frac(f + 1, 2 * f)} = ${A + B} → x = ${A}, y = ${B}.`, "yaş");
        }
        const q = pick([2, 3, 4, 5]), z = rnd(10, 30), d = (q - 1) * z, B = rnd(3, z - 2), u = z - B;
        return whole(u, `Atanın yaşı oğlunun yaşından ${d} il çoxdur. Oğul indi ${B} yaşındadır. Neçə il sonra ata oğlundan ${q} dəfə böyük olacaq?`,
          `Yaş fərqi həmişə ${d} ildir. Ata oğlundan ${q} dəfə böyük olanda oğlun yaşı z, atanın yaşı ${q}z olur: ${q}z − z = ${d} → z = ${z}. Oğul indi ${B} yaşındadır → ${z} − ${B} = ${u} il sonra.`, "il");
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2);
        let task, steps, why;
        if (Math.random() < .5) {
          const [a, b, hm] = pick(AVG);
          task = `Turist A-dan B-yə ${a} km/saat, qayıdarkən eyni yolla ${b} km/saat sürətlə getdi. Orta sürəti tap.`;
          steps = [`Yol d olsun. Gediş vaxtı d/${a}, qayıdış vaxtı d/${b}.`, `Bütün yol 2d, bütün vaxt d/${a} + d/${b} = d(${a + b})/${a * b}.`, `Orta sürət = 2d : d(${a + b})/${a * b} = ${2 * a * b}/${a + b} = ${hm} km/saat.`];
          if (bad === 0) { steps[0] = `Yol d olsun. Gediş vaxtı ${a}/d, qayıdış vaxtı ${b}/d.`; steps[1] = `Bütün yol 2d, bütün vaxt ${a}/d + ${b}/d = ${a + b}/d.`; steps[2] = `Orta sürət = 2d : ${a + b}/d = ${2}d²/${a + b}.`; why = `1-ci addım: vaxt = yol / sürət = d/${a}, ${a}/d yazmaq düzgün deyil. Düz cavab: ${hm} km/saat.`; }
          if (bad === 1) { steps[1] = `Bütün yol d, bütün vaxt d/${a} + d/${b} = d(${a + b})/${a * b}.`; steps[2] = `Orta sürət = d : d(${a + b})/${a * b} = ${frac(a * b, a + b)} km/saat.`; why = `2-ci addım: gediş və qayıdış üçün bütün yol 2d-dir (d + d), yalnız d yox. Düz cavab: ${hm} km/saat.`; }
          if (bad === 2) { steps[2] = `Orta sürət = (${a} + ${b})/2 = ${String((a + b) / 2).replace(".", ",")} km/saat.`; why = `3-cü addım: orta sürət = bütün yol / bütün vaxt; sürətlərin hesabi ortası deyil (vaxtlar fərqlidir). Düz cavab: ${hm} km/saat.`; }
        } else {
          const r = pick([10, 20, 30, 40, 50]), S0 = 1000, A1 = S0 * (100 + r) / 100, A2 = A1 * (100 + r) / 100;
          task = `${S0} manat illik ${r}% mürəkkəb faizlə (faiz hər il yığılmış məbləğə hesablanır) bankda 2 il saxlanıldı. İlin sonunda hesabda nə qədər olacaq?`;
          steps = [`1-ci ilin sonunda: ${S0}·${frac(100 + r, 100)} = ${A1} manat.`, `2-ci ilin sonunda: ${A1}·${frac(100 + r, 100)} = ${A2} manat.`, `Cavab: ${A2} manat.`];
          if (bad === 0) { steps[0] = `1-ci ilin sonunda: ${S0}·${r}% = ${S0 * r / 100} manat.`; steps[1] = `2-ci ilin sonunda: ${S0 * r / 100}·${r}% + ${S0 * r / 100} = ${S0 * r / 100 * (100 + r) / 100} manat.`; steps[2] = `Cavab: ${S0 * r / 100 * (100 + r) / 100} manat.`; why = `1-ci addım: ${S0}·${r}% yalnız faiz gəliridir (${S0 * r / 100} manat), 1-ci ilin sonundakı məbləğ isə ${S0} + ${S0 * r / 100} = ${A1} manatdır (əmsal ${frac(100 + r, 100)}). Düz cavab: ${A2} manat.`; }
          if (bad === 1) { steps[1] = `2-ci ilin sonunda: ${A1} + ${S0}·${r}% = ${A1 + S0 * r / 100} manat.`; steps[2] = `Cavab: ${A1 + S0 * r / 100} manat.`; why = `2-ci addım: faiz hər il yığılmış məbləğə (${A1}) hesablanır, ilkin məbləğə (${S0}) yox. Düz cavab: ${A2} manat.`; }
          if (bad === 2) { steps[2] = `Cavab: ${S0} + ${2 * r}% = ${S0 + S0 * 2 * r / 100} manat.`; why = `3-cü addım: iki ildə faizlər toplanmır; hesablanan nəticə artıq ${A2} manatdır. Düz cavab: ${A2} manat.`; }
        }
        const text = h("div", {}, h("p", {}, "Məsələ: " + task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: C3, correct: bad, show: C3[bad], solution: why };
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Məsələni modelə çevir: sürət, vaxt, məsafə; iş, sürət, vaxt; əmsal. Sonra tənliyi yaz.",
      gen() {
        const kind = pick(["tren", "tren2", "mag", "kredit"]);
        if (kind === "tren") {
          const v = pick([10, 12, 15, 20, 25]), t1 = rnd(6, 20), j = rnd(3, 15), l = v * t1, L = v * j, t2 = t1 + j;
          const ask = pick(["len", "speed"]);
          return whole(ask === "len" ? l : v, `Qatar sütunun yanından ${t1} saniyəyə, uzunluğu ${L} m olan körpünün başlanğıcından sonuna qədər isə ${t2} saniyəyə keçir (sürət sabitdir). Qatarın ${ask === "len" ? "uzunluğu neçə metrdir?" : "sürəti neçə m/saniyədir?"}`,
            `Qatarın uzunluğu l, sürəti v olsun. Sütunu keçəndə l məsafə: l = ${t1}v. Körpünü keçəndə l + ${L} məsafə: l + ${L} = ${t2}v. Çıxsaq: ${L} = ${t2 - t1}v → v = ${v} m/san, l = ${t1}·${v} = ${l} m.`, ask === "len" ? "m" : "m/san");
        }
        if (kind === "tren2") {
          const v1 = rnd(8, 20), v2 = rnd(8, 20), tt = rnd(5, 16), L = tt * (v1 + v2), a = 10 * rnd(3, Math.floor((L - 10) / 10)), b = L - a;
          return whole(tt, `Uzunluğu ${a} m olan sürətli qatar ${v1} m/san sürətlə, uzunluğu ${b} m olan yük qatarı əks istiqamətdə ${v2} m/san sürətlə gedir. Qatarlar rastlaşandan (başlar yanaşı olanda) quyruqlar yanaşı olana qədər (tam keçmə) neçə saniyə keçir?`,
            `Qatarlar bir-birinə nisbətən ${v1} + ${v2} = ${v1 + v2} m/san sürətlə yaxınlaşır. Keçmək üçün birlikdə ${a} + ${b} = ${a + b} m məsafə qət etmək lazımdır: ${a + b}/${v1 + v2} = ${tt} san.`, "san");
        }
        if (kind === "mag") {
          const X = 100 * rnd(2, 12), a = pick([10, 20, 25, 30]), b = pick([10, 20, 25, 50]);
          if (((100 - a) * (100 - b)) % 100) return levels[6].gen();
          const F = X * (100 - a) * (100 - b) / 10000, tot = 100 - (100 - a) * (100 - b) / 100;
          return whole(tot, `Mağazada geyimin ilkin qiyməti ${X} manatdır. Əvvəl ${a}% endirim, sonra yeni qiymətə əlavə ${b}% endirim elan edildi. Geyim ilkin qiymətə nisbətən ümumilikdə neçə faiz ucuzlaşıb?`,
            `Əmsallar vurulur: ${frac(100 - a, 100)}·${frac(100 - b, 100)} = ${frac((100 - a) * (100 - b), 10000)}. Yeni qiymət ${F} manat (${X}-in ${(100 - a) * (100 - b) / 100}%-i). Ucuzlaşma: ${tot}%. (${a} + ${b} = ${a + b} yanlışdır.)`.replace(/\.\d+/g, m => m), "%");
        }
        const r1 = pick([10, 20, 30, 40]), r2 = pick([10, 20, 25, 50]), S0 = 1000 * rnd(1, 5), A = S0 * (100 + r1) * (100 + r2) / 10000;
        if (!Number.isInteger(A)) return levels[6].gen();
        return whole(A, `Bank depozitə birinci il ${r1}%, ikinci il ${r2}% faiz verir (hər il yığılmış məbləğə). ${S0} manat qoyulsa, 2 ildən sonra hesabda neçə manat olacaq?`,
          `Birinci ilin sonunda: ${S0}·${frac(100 + r1, 100)} = ${S0 * (100 + r1) / 100}. İkinci ilin sonunda: ${S0 * (100 + r1) / 100}·${frac(100 + r2, 100)} = ${A} manat.`, "manat");
      } },
  ];
  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-metnli", title: "Mətnli məsələlər (olimpiada)", fenn: "olimpiada", link: "dersler/ol-metnli.html",
      format: "Cavab ədəddir: tam 24, kəsr 3/4. Vahid yazma — yalnız ədəd (məsələn, 12, 36 deyil \"36 km\").",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["hereket", "hereket", "is", "is", "faiz", "faiz", "qarisiq", "yas", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-metnli.html")) b.push("dersler/ol-metnli.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
