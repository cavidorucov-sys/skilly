// Ehtimal (DİM) — mastery game levels: events, sum/product rules, classical probability P = m/n,
// complementary event, two trials, word problems, find-the-error; and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
// Probabilities are exact fractions: tol is tiny, so a rounded decimal (0,33 for 1/3) is not accepted.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (p, q) => { const g = gcd(p, q) || 1; return q / g === 1 ? String(p / g) : (p / g) + "/" + (q / g); };
  const fact = n => n <= 1 ? 1 : n * fact(n - 1);
  const dec = x => String(Math.round(x * 1000) / 1000).replace(".", ",");      // 0.48 → "0,48"
  const TOL = 1e-6;
  const prob = (m, n, text, solution) => ({ text, answer: m / n, show: frac(m, n), tol: TOL, placeholder: "məs. 3/8", solution });
  const decProb = (x, text, solution) => ({ text, answer: x, show: dec(x), tol: TOL, placeholder: "məs. 0,3", solution });
  const whole = (n, text, solution) => ({ text, answer: n, show: String(n), tol: 0.01, solution });
  const red = (m, n) => frac(m, n) === m + "/" + n ? `${m}/${n}` : `${m}/${n} = ${frac(m, n)}`;   // "3/6 = 1/2" or "5/6"
  const list = a => a.length ? a.join(", ") : "heç biri";
  const range = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
  const PAIRS = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) PAIRS.push([a, b]);
  const pairS = p => `(${p[0]}; ${p[1]})`;
  const ch3 = ["1-ci addım", "2-ci addım", "3-cü addım"];

  // one die: events {d: description, f: predicate}
  const dieEvents = () => {
    const k = rnd(1, 5), m = rnd(2, 6), b = rnd(2, 5), e = rnd(1, 6);
    return pick([
      { d: "tək ədəddir", f: x => x % 2 === 1 },
      { d: "cüt ədəddir", f: x => x % 2 === 0 },
      { d: `${k} ədədindən böyükdür`, f: x => x > k },
      { d: `${m} ədədindən kiçikdir`, f: x => x < m },
      { d: "sadə ədəddir", f: x => [2, 3, 5].includes(x) },
      { d: `${b} ədədinə bölünür`, f: x => x % b === 0 },
      { d: `${e} ədədinə bərabərdir`, f: x => x === e },
    ]);
  };
  const VOWELS = ["A", "E", "Ə", "İ", "I", "O", "Ö", "U", "Ü"];
  const WORDS = ["RİYAZİYYAT", "AZƏRBAYCAN", "MATEMATİKA", "EHTİMAL", "KİTABXANA", "MƏKTƏB", "ŞAHMAT", "OLİMPİADA", "QARABAĞ", "BAKI"];
  const CARD_EVENTS = [
    { d: "tuzdur", m: 4, w: "4 dəstin hər birində 1 tuz — 4 kart" },
    { d: "şəkilli kartdır (valet, dama və ya kral)", m: 12, w: "hər dəstdə 3 şəkilli kart, 4 dəstdə 3 · 4 = 12" },
    { d: "qırmızı dəstdəndir", m: 18, w: "2 qırmızı dəst, hər birində 9 kart — 18" },
    { d: "qırmızı tuzdur", m: 2, w: "2 qırmızı dəstin hər birində 1 tuz — 2" },
    { d: "ədədli kartdır (6, 7, 8, 9 və ya 10)", m: 20, w: "hər dəstdə 5 ədədli kart, 4 dəstdə 20" },
    { d: "kral və ya damadır", m: 8, w: "4 kral + 4 dama = 8 (toplama prinsipi)" },
    { d: "qara şəkilli kartdır", m: 6, w: "2 qara dəstin hər birində 3 şəkilli kart — 6" },
  ];
  const CARD_TXT = "36 kartlıq dəstdə 4 dəst var (2-si qırmızı, 2-si qara), hər dəstdə 9 kart: 6, 7, 8, 9, 10, valet, dama, kral, tuz.";

  const levels = [
    { id: "hadise", ad: "Hadisənin növü", izah: "Yəqin — mütləq baş verir; mümkün olmayan — heç vaxt baş vermir; təsadüfi — baş verə də bilər, verməyə də.",
      gen() {
        const T = ["Yəqin hadisə", "Mümkün olmayan hadisə", "Təsadüfi hadisə"];
        const verdict = (cnt, all) => cnt === 0 ? 1 : cnt === all ? 0 : 2;
        const end = t => [" Deməli, hadisə həmişə baş verir — yəqindir.", " Deməli, hadisə heç vaxt baş vermir — mümkün deyil.", " Deməli, hadisə baş verə də bilər, verməyə də — təsadüfidir."][t];
        const out = (text, t, why) => ({ text: text + " Bu hansı hadisədir?", choices: T, correct: t, show: T[t], solution: why + end(t) });
        const kind = pick(["zer", "zer", "zer2", "kise", "kise2", "eded"]);
        if (kind === "zer") {
          const mode = pick(["kicik", "beraber", "boyuk"]); let d, f;
          if (mode === "kicik") { const k = rnd(1, 9); d = `${k} ədədindən kiçikdir`; f = x => x < k; }
          else if (mode === "beraber") { const k = rnd(0, 8); d = `${k} ədədinə bərabərdir`; f = x => x === k; }
          else { const k = rnd(0, 7); d = `${k} ədədindən böyükdür`; f = x => x > k; }
          const fit = range(1, 6).filter(f);
          return out(`Zər bir dəfə atılır. Hadisə: düşən xal ${d}.`, verdict(fit.length, 6), `Zərdə 1, 2, 3, 4, 5, 6 xal var. Şərtə uyğun gələnlər: ${list(fit)}.`);
        }
        if (kind === "zer2") {
          const less = Math.random() < .5, s = less ? rnd(2, 14) : rnd(1, 14);
          const cnt = PAIRS.filter(([a, b]) => less ? a + b < s : a + b === s).length;
          return out(`İki zər atılır. Hadisə: xalların cəmi ${s} ədədinə ${less ? "qədər deyil, ondan kiçikdir" : "bərabərdir"}.`.replace(" ədədinə qədər deyil, ondan kiçikdir", " ədədindən kiçikdir"),
            verdict(cnt, 36), `Cəm ən azı 1 + 1 = 2, ən çoxu 6 + 6 = 12 ola bilər. 36 haldan şərtə uyğun gələnlər: ${cnt}.`);
        }
        if (kind === "kise") {
          const a = rnd(1, 9), b = Math.random() < .35 ? 0 : rnd(1, 9), col = pick(["qırmızı", "göy", "yaşıl"]);
          const cnt = { "qırmızı": a, "göy": b, "yaşıl": 0 }[col];
          return out(`Kisədə ${a} qırmızı${b ? ` və ${b} göy` : ""} kürə var${b ? "" : ", başqa kürə yoxdur"}. Baxmadan bir kürə çıxarılır. Hadisə: kürə ${col}dır.`.replace("göydır", "göydür"),
            verdict(cnt, a + b), `Kisədə ${a + b} kürə var, onlardan ${col} olanlar: ${cnt}.`);
        }
        if (kind === "kise2") {
          const a = rnd(1, 6), b = rnd(1, 6), c = rnd(1, Math.min(a + b - 1, b + 2) || 1), ev = pick(["birq", "hamig", "hamiq"]);
          let d, t, why;
          if (ev === "birq") { d = "çıxarılanlar arasında ən azı bir qırmızı kürə var"; t = c > b ? 0 : 2;
            why = c > b ? `Göy kürə cəmi ${b}-dir, ${c} kürənin hamısı göy ola bilməz — biri mütləq qırmızıdır.` : `${c} kürənin hamısı göy də ola bilər (göy ${b}), qırmızı da düşə bilər.`; }
          else if (ev === "hamig") { d = "çıxarılan kürələrin hamısı göydür"; t = c > b ? 1 : 2;
            why = c > b ? `Göy kürə cəmi ${b}-dir, ${c} göy kürə çıxarmaq olmaz.` : `Göy kürə ${b}-dir — ${c} göy çıxa da bilər, qırmızı qarışa da bilər.`; }
          else { d = "çıxarılan kürələrin hamısı qırmızıdır"; t = c > a ? 1 : 2;
            why = c > a ? `Qırmızı kürə cəmi ${a}-dir, ${c} qırmızı kürə çıxarmaq olmaz.` : `Qırmızı kürə ${a}-dir — ${c} qırmızı çıxa da bilər, göy qarışa da bilər.`; }
          return out(`Kisədə ${a} qırmızı və ${b} göy kürə var. Baxmadan ${c} kürə çıxarılır. Hadisə: ${d}.`, t, why);
        }
        const N = rnd(10, 60), ev = pick(["boyukdeyil", "bolunur", "boyuk"]);
        if (ev === "boyukdeyil") { const M = rnd(N - 6, N + 6);
          return out(`1-dən ${N}-ə qədər natural ədədlərdən biri təsadüfən seçilir. Hadisə: seçilən ədəd ${M} ədədindən böyük deyil.`.replace(`${N}-ə`, `${N} daxil olmaqla ${N} ədədinədək`).replace(`1-dən ${N} daxil olmaqla ${N} ədədinədək`, `1, 2, …, ${N} ədədlərindən biri seçilir.`).replace(" natural ədədlərdən biri təsadüfən seçilir.", " (təsadüfən)"),
            M >= N ? 0 : 2, M >= N ? `Ən böyük mümkün ədəd ${N}-dir, o da ${M} ədədindən böyük deyil.` : `${M + 1}, …, ${N} ədədləri ${M} ədədindən böyükdür, qalanları yox.`); }
        if (ev === "bolunur") { const k = Math.random() < .5 ? rnd(2, 9) : N + rnd(1, 20);
          return out(`1, 2, …, ${N} ədədlərindən biri təsadüfən seçilir. Hadisə: seçilən ədəd ${k} ədədinə bölünür.`, k > N ? 1 : 2,
            k > N ? `${k} ədədinə bölünən ən kiçik natural ədəd ${k}-dir, o isə ${N} ədədindən böyükdür.` : `${k} ədədinə bölünənlər var (${k}, ${2 * k <= N ? 2 * k + ", …" : "…"}), bölünməyənlər də var (məs. 1).`); }
        const k = rnd(N - 10, N + 10);
        return out(`1, 2, …, ${N} ədədlərindən biri təsadüfən seçilir. Hadisə: seçilən ədəd ${k} ədədindən böyükdür.`, k >= N ? 1 : k < 1 ? 0 : 2,
          k >= N ? `Ən böyük mümkün ədəd ${N}-dir, ${k} ədədindən böyük ədəd yoxdur.` : `${k + 1}, …, ${N} ədədləri ${k} ədədindən böyükdür, 1 isə yox.`);
      } },

    { id: "say", ad: "Toplama və vurma prinsipləri", izah: "\"Ya … ya …\" (biri seçilir) — topla. \"Həm … həm …\" (ardıcıl addımlar) — vur. Neçə üsul?",
      gen() {
        const kind = pick(["menu", "yol", "reqem", "reqem", "duzulus", "secim", "kitab"]);
        if (kind === "menu") {
          const a = rnd(2, 6), b = rnd(2, 6), c = rnd(2, 5);
          if (Math.random() < .6) return whole(a * b * c, `Yeməkxanada ${a} növ şorba, ${b} növ əsas yemək və ${c} növ desert var. Nahar üçün bir şorba, bir əsas yemək və bir desert seçilir. Neçə müxtəlif nahar mümkündür?`,
            `Üç ardıcıl seçim — vurma prinsipi: ${a} · ${b} · ${c} = ${a * b * c}.`);
          return whole(a + c, `Yeməkxanada ${a} növ şorba, ${b} növ əsas yemək və ${c} növ desert var. Elvin yalnız bir yemək götürür: ya bir şorba, ya bir desert. Neçə üsulla seçə bilər?`,
            `Seçim "ya … ya …" — toplama prinsipi: ${a} + ${c} = ${a + c}. Əsas yemək bu sualda iştirak etmir.`);
        }
        if (kind === "yol") {
          const a = rnd(2, 5), b = rnd(2, 5), c = rnd(1, 4), via = Math.random() < .4;
          const t = `A şəhərindən B şəhərinə ${a} yol, B-dən C şəhərinə ${b} yol, A-dan C-yə isə B-dən keçməyən ${c} birbaşa yol var.`;
          if (via) return whole(a * b, t + " A-dan C-yə B-dən keçməklə neçə yolla getmək olar?", `A → B (${a} yol), sonra B → C (${b} yol) — vurma: ${a} · ${b} = ${a * b}.`);
          return whole(a * b + c, t + " A-dan C-yə cəmi neçə yolla getmək olar?", `B-dən keçməklə: ${a} · ${b} = ${a * b} (vurma). Birbaşa: ${c}. Ya biri, ya digəri — topla: ${a * b} + ${c} = ${a * b + c}.`);
        }
        if (kind === "reqem") {
          const zero = Math.random() < .4, d = rnd(3, 5), k = rnd(2, 3), rep = Math.random() < .5;
          const digs = []; while (digs.length < (zero ? d - 1 : d)) { const x = rnd(1, 9); if (!digs.includes(x)) digs.push(x); }
          if (zero) digs.push(0); digs.sort((x, y) => x - y);
          const kk = k === 2 ? "ikirəqəmli" : "üçrəqəmli";
          const slots = []; for (let i = 0; i < k; i++) { let n; if (rep) n = i === 0 && zero ? d - 1 : d; else n = zero ? (i === 0 ? d - 1 : d - i) : d - i; slots.push(n); }
          const ans = slots.reduce((x, y) => x * y, 1);
          const how = zero ? `Birinci rəqəm 0 ola bilməz: ${d - 1} seçim. ` : "";
          return whole(ans, `${digs.join(", ")} rəqəmlərindən neçə ${kk} ədəd düzəltmək olar? Rəqəmlər ${rep ? "təkrarlana bilər" : "təkrarlanmır"}.`,
            how + `Hər yerə seçimlərin sayı: ${slots.join(" · ")} = ${ans} (vurma prinsipi${rep ? "" : "; işlənmiş rəqəm yenidən götürülmür"}).`);
        }
        if (kind === "duzulus") {
          const n = rnd(3, 6), fixed = Math.random() < .4;
          if (fixed) return whole(fact(n - 1), `${n} şagird bir sırada növbəyə düzülür. Elvin həmişə birinci dayanır. Neçə müxtəlif düzülüş var?`,
            `Birinci yer artıq məlumdur (Elvin). Qalan ${n - 1} şagirdi düzürük: ${range(1, n - 1).reverse().join(" · ")} = ${fact(n - 1)}.`);
          return whole(fact(n), `Rəfə ${n} müxtəlif kitab bir sırada düzülür. Neçə müxtəlif düzülüş var?`,
            `1-ci yerə ${n}, 2-ciyə ${n - 1} kitab qalır və s. Vurma: ${range(1, n).reverse().join(" · ")} = ${fact(n)}.`);
        }
        if (kind === "secim") {
          if (Math.random() < .5) { const n = rnd(8, 30);
            return whole(n * (n - 1), `Sinifdə ${n} şagird var. Sinif nümayəndəsi və onun müavini seçilir (bir nəfər iki vəzifə tuta bilməz). Neçə üsulla seçmək olar?`,
              `Nümayəndə: ${n} seçim. Müavin — qalanlardan: ${n - 1}. Vurma: ${n} · ${n - 1} = ${n * (n - 1)}.`); }
          const n = rnd(4, 9);
          return whole(n * (n - 1) * (n - 2), `Yarışda ${n} idmançı iştirak edir. Qızıl, gümüş və bürünc medalların neçə cür paylanması mümkündür (bərabər yer yoxdur)?`,
            `Qızıl: ${n}, gümüş: ${n - 1}, bürünc: ${n - 2}. Vurma: ${n} · ${n - 1} · ${n - 2} = ${n * (n - 1) * (n - 2)}.`);
        }
        const a = rnd(3, 12), b = rnd(3, 12), both = Math.random() < .5;
        return whole(both ? a * b : a + b, `Rəfdə ${a} müxtəlif riyaziyyat və ${b} müxtəlif fizika kitabı var. ${both ? "Bir riyaziyyat və bir fizika kitabı" : "Oxumaq üçün bir kitab"} neçə üsulla seçmək olar?`,
          both ? `Həm riyaziyyat, həm fizika — iki addım, vurma: ${a} · ${b} = ${a * b}.` : `Bir kitab: ya riyaziyyat, ya fizika — toplama: ${a} + ${b} = ${a + b}.`);
      } },

    { id: "ehtimal", ad: "Hadisənin ehtimalı", izah: "P = m/n: m — əlverişli hallar, n — bütün mümkün hallar. Cavabı ixtisar olunmuş kəsr yaz (1/3, 0,33 yox).",
      gen() {
        const kind = pick(["zer", "zer", "kise", "eded", "kart", "soz"]);
        if (kind === "zer") {
          const e = dieEvents(), fit = range(1, 6).filter(e.f);
          if (!fit.length) return this.gen();
          return prob(fit.length, 6, `Zər bir dəfə atılır. Düşən xalın ${e.d.replace(/dır$|dir$|dur$|dür$/, "")} olma ehtimalını tap.`.replace(" olma ehtimalını", " olması ehtimalını"),
            `Bütün hallar: 6 (1, 2, …, 6). Əlverişli: ${fit.join(", ")} — ${fit.length}. P = ${red(fit.length, 6)}.`);
        }
        if (kind === "kise") {
          const a = rnd(1, 9), b = rnd(1, 9), c = Math.random() < .4 ? 0 : rnd(1, 9), n = a + b + c;
          const opts = [["ağ", a], ["qara", b]]; if (c) opts.push(["qırmızı", c], ["ağ və ya qırmızı", a + c], ["ağ deyil", b + c]);
          const [w, m] = pick(opts);
          return prob(m, n, `Kisədə ${a} ağ, ${b} qara${c ? ` və ${c} qırmızı` : ""} kürə var. Baxmadan bir kürə çıxarılır. Kürənin ${w} olması ehtimalını tap.`,
            `Bütün hallar: ${a} + ${b}${c ? " + " + c : ""} = ${n}. Əlverişli: ${m}${w.includes(" ") ? " (toplama prinsipi)" : ""}. P = ${red(m, n)}.`);
        }
        if (kind === "eded") {
          const N = rnd(10, 50), ev = pick(["bol", "bol", "iki", "kv"]);
          if (ev === "bol") { const k = rnd(2, 9), m = Math.floor(N / k);
            return prob(m, N, `1, 2, …, ${N} ədədlərindən biri təsadüfən seçilir. Onun ${k} ədədinə bölünməsi ehtimalını tap.`,
              `Bütün hallar: ${N}. ${k} ədədinə bölünənlər: ${k}, ${2 * k}, …, ${k * m} — ${N} : ${k} = ${m}${N % k ? " (qalıqlı bölmənin tam hissəsi)" : ""}. P = ${red(m, N)}.`); }
          if (ev === "iki") { const N2 = rnd(15, 99);
            return prob(N2 - 9, N2, `1, 2, …, ${N2} ədədlərindən biri təsadüfən seçilir. Onun ikirəqəmli olması ehtimalını tap.`,
              `Bütün hallar: ${N2}. Birrəqəmlilər 1–9 (9 ədəd), qalanları ikirəqəmlidir: ${N2} − 9 = ${N2 - 9}. P = ${red(N2 - 9, N2)}.`); }
          const m = Math.floor(Math.sqrt(N));
          return prob(m, N, `1, 2, …, ${N} ədədlərindən biri təsadüfən seçilir. Onun tam kvadrat (1, 4, 9, …) olması ehtimalını tap.`,
            `Bütün hallar: ${N}. Tam kvadratlar: ${range(1, m).map(x => x * x).join(", ")} — ${m}. P = ${red(m, N)}.`);
        }
        if (kind === "kart") {
          const e = pick(CARD_EVENTS);
          return prob(e.m, 36, `${CARD_TXT} Qarışdırılmış dəstdən bir kart çəkilir. Kartın ${e.d.replace(/dır$|dir$|dur$|dür$/, "")} olması ehtimalını tap.`,
            `Bütün hallar: 36. Əlverişli: ${e.w}. P = ${red(e.m, 36)}.`);
        }
        const word = pick(WORDS), L = Array.from(word);
        if (Math.random() < .3) { const m = L.filter(x => VOWELS.includes(x)).length;
          return prob(m, L.length, `"${word}" sözünün hər hərfi ayrıca karta yazılıb (${L.length} kart). Baxmadan bir kart çəkilir. Kartda sait hərf olması ehtimalını tap.`,
            `Bütün hallar: ${L.length}. Sait hərflər: ${L.filter(x => VOWELS.includes(x)).join(", ")} — ${m}. P = ${red(m, L.length)}.`); }
        const ch = pick(L), m = L.filter(x => x === ch).length;
        return prob(m, L.length, `"${word}" sözünün hər hərfi ayrıca karta yazılıb (${L.length} kart). Baxmadan bir kart çəkilir. Kartda "${ch}" hərfi olması ehtimalını tap.`,
          `Bütün hallar: ${L.length} hərf. "${ch}" hərfi sözdə ${m} dəfə var. P = ${red(m, L.length)}.`);
      } },

    { id: "eks", ad: "Əks hadisə", izah: "P(Ā) = 1 − P(A). \"Ən azı bir\" sualında əksini — \"heç biri\" — saymaq asandır.",
      gen() {
        const kind = pick(["verilib", "verilib", "zer", "zer2", "sikke", "say", "eded"]);
        if (kind === "verilib") {
          if (Math.random() < .5) { const t = rnd(1, 19) * 5, ctx = pick([["Futbolçunun penaltini qola çevirməsi", "qola çevirməməsi"], ["Atıcının hədəfi vurması", "hədəfi vurmaması"], ["Sabah yağış yağması", "yağış yağmaması"]]);
            const pS = dec(t / 100);
            return decProb((100 - t) / 100, `${ctx[0]} ehtimalı ${pS}-dir. ${ctx[1][0].toUpperCase() + ctx[1].slice(1)} ehtimalı nədir? (Onluq kəsrlə yaz.)`,
              `Bu iki hadisə əksdir: P = 1 − ${pS} = ${dec((100 - t) / 100)}.`); }
          let q = rnd(3, 15), p = rnd(1, q - 1); const g = gcd(p, q); p /= g; q /= g;
          const ctx = pick([["Lotereya biletinin uduşlu olması", "uduşsuz olması"], ["Avtobusun vaxtında gəlməsi", "gecikməsi"], ["Təsadüfi seçilmiş məhsulun qüsurlu olması", "qüsursuz olması"]]);
          return prob(q - p, q, `${ctx[0]} ehtimalı ${p}/${q}-dir. ${ctx[1][0].toUpperCase() + ctx[1].slice(1)} ehtimalını tap.`,
            `Hadisələr əksdir (biri olmasa, o biri mütləq olur). P = 1 − ${p}/${q} = ${red(q - p, q)}.`);
        }
        if (kind === "zer") {
          const e = dieEvents(), fit = range(1, 6).filter(e.f), m = 6 - fit.length;
          if (!m || m === 6) return this.gen();
          return prob(m, 6, `Zər bir dəfə atılır. Düşən xalın ${e.d.replace(/dır$|dir$|dur$|dür$/, "")} olmaması ehtimalını tap.`,
            `A — xal ${e.d}: ${fit.join(", ")}, P(A) = ${red(fit.length, 6)}. Əks hadisə: P = 1 − ${frac(fit.length, 6)} = ${red(m, 6)}.`);
        }
        if (kind === "zer2") {
          const k = rnd(1, 5);
          return prob(36 - k * k, 36, `İki zər atılır. Ən azı bir zərdə xalın ${k} ədədindən böyük olması ehtimalını tap.`,
            `Əks hadisə: hər iki zərdə xal ≤ ${k}, yəni ${k} · ${k} = ${k * k} hal (36-dan). P = 1 − ${k * k}/36 = ${red(36 - k * k, 36)}.`);
        }
        if (kind === "sikke") {
          const n = rnd(2, 4), N = 2 ** n, side = pick(["gerb", "rəqəm"]);
          return prob(N - 1, N, `Sikkə ${n} dəfə atılır. Ən azı bir dəfə "${side}" düşməsi ehtimalını tap.`,
            `Bütün hallar: 2${n === 2 ? " · 2" : n === 3 ? " · 2 · 2" : " · 2 · 2 · 2"} = ${N}. Əks hadisə — heç bir dəfə "${side}" düşməmək: 1 hal. P = 1 − 1/${N} = ${N - 1}/${N}.`);
        }
        if (kind === "say") {
          let q = rnd(3, 9), p = rnd(1, q - 1); const g = gcd(p, q); p /= g; q /= g;
          const T = q * rnd(2, 8);
          return whole(T * (q - p) / q, `Kisədə yalnız ağ və qara kürələr var, cəmi ${T} kürə. Təsadüfən çıxarılan kürənin ağ olması ehtimalı ${p}/${q}-dir. Kisədə neçə qara kürə var?`,
            `Qara olması ehtimalı: 1 − ${p}/${q} = ${frac(q - p, q)}. Qara kürələr: ${T} · ${frac(q - p, q)} = ${T * (q - p) / q}.`);
        }
        const N = rnd(10, 50), k = rnd(2, 9), m = Math.floor(N / k);
        return prob(N - m, N, `1, 2, …, ${N} ədədlərindən biri təsadüfən seçilir. Onun ${k} ədədinə bölünməməsi ehtimalını tap.`,
          `${k} ədədinə bölünənlər: ${m} ədəd. Bölünməyənlər: ${N} − ${m} = ${N - m}. P = ${red(N - m, N)}.`);
      } },

    { id: "iki", ad: "İki sınaq", izah: "İki zər — 6 · 6 = 36 hal; iki sikkə — 4 hal. Asılı olmayan hadisələrdə P(A və B) = P(A) · P(B). Kürə geri qaytarılmırsa, ikinci dəfə bir kürə az qalır.",
      gen() {
        const kind = pick(["cem", "cem", "zer", "sikke", "kise", "kise", "atici"]);
        if (kind === "cem") {
          const s = rnd(2, 12), fit = PAIRS.filter(([a, b]) => a + b === s);
          return prob(fit.length, 36, `İki zər atılır. Xalların cəminin ${s} olması ehtimalını tap.`,
            `Bütün hallar: 6 · 6 = 36. Cəmi ${s}: ${fit.map(pairS).join(", ")} — ${fit.length}. P = ${red(fit.length, 36)}.`);
        }
        if (kind === "zer") {
          const k = rnd(3, 11), ev = pick([
            { d: "xalların bərabər olması", f: ([a, b]) => a === b },
            { d: `xalların cəminin ${k} ədədindən böyük olması`, f: ([a, b]) => a + b > k },
            { d: "xalların hasilinin cüt olması", f: ([a, b]) => a * b % 2 === 0 },
            { d: "hər iki zərdə tək xal düşməsi", f: ([a, b]) => a % 2 && b % 2 },
            { d: `xalların fərqinin (böyükdən kiçiyi) ${k % 5 + 1} olması`, f: ([a, b]) => Math.abs(a - b) === k % 5 + 1 },
          ]);
          const fit = PAIRS.filter(ev.f), m = fit.length;
          return prob(m, 36, `İki zər atılır. ${ev.d[0].toUpperCase() + ev.d.slice(1)} ehtimalını tap.`,
            `Bütün hallar: 36. Əlverişli: ${m <= 12 ? fit.map(pairS).join(", ") + " — " : ""}${m}${m > 12 ? " (cədvəldən say)" : ""}. P = ${red(m, 36)}.`);
        }
        if (kind === "sikke") {
          const n = rnd(2, 3), k = rnd(0, n), all = n === 2 ? ["GG", "GR", "RG", "RR"] : ["GGG", "GGR", "GRG", "RGG", "GRR", "RGR", "RRG", "RRR"];
          const fit = all.filter(x => x.split("G").length - 1 === k);
          return prob(fit.length, all.length, `Sikkə ${n} dəfə atılır. "Gerb" tərəfinin düz ${k} dəfə düşməsi ehtimalını tap.`,
            `G — gerb, R — rəqəm. Bütün hallar (${all.length}): ${all.join(", ")}. Düz ${k} gerb: ${fit.join(", ")} — ${fit.length}. P = ${red(fit.length, all.length)}.`);
        }
        if (kind === "kise") {
          const a = rnd(2, 7), b = rnd(2, 7), n = a + b, back = Math.random() < .5, ev = pick(["aa", "ab", "bb"]);
          const [x, y, wd] = { aa: [a, back ? a : a - 1, "hər iki kürə ağdır"], ab: [a, b, "birinci kürə ağ, ikinci qaradır"], bb: [b, back ? b : b - 1, "hər iki kürə qaradır"] }[ev];
          const N2 = back ? n : n - 1;
          return prob(x * y, n * N2, `Kisədə ${a} ağ və ${b} qara kürə var. Bir kürə çıxarılır, ${back ? "rəngi yazılıb geri qaytarılır" : "geri qaytarılmır"}, sonra ikinci kürə çıxarılır. Ehtimalı tap: ${wd}.`,
            (back ? `Kürə qaytarılır — ikinci çıxarış birincidən asılı deyil. ` : `Kürə qaytarılmır — ikinci dəfə ${n - 1} kürə qalır (asılı hadisələr). `) +
            `Bütün hallar: ${n} · ${N2} = ${n * N2}. Əlverişli: ${x} · ${y} = ${x * y}. P = ${red(x * y, n * N2)}.`.replace("birinciddən", "birincidən"));
        }
        const p1 = rnd(1, 9), p2 = rnd(1, 9), none = Math.random() < .4;
        const t = `İki atıcı bir-birindən asılı olmayaraq hədəfə bir atəş açır. Birincinin vurma ehtimalı ${dec(p1 / 10)}, ikincinin — ${dec(p2 / 10)}.`;
        if (none) return decProb((10 - p1) * (10 - p2) / 100, t + " Heç birinin vurmaması ehtimalı nədir? (Onluq kəsrlə yaz.)",
          `Vurmama ehtimalları: 1 − ${dec(p1 / 10)} = ${dec((10 - p1) / 10)} və 1 − ${dec(p2 / 10)} = ${dec((10 - p2) / 10)}. Asılı olmayan hadisələr — vur: ${dec((10 - p1) / 10)} · ${dec((10 - p2) / 10)} = ${dec((10 - p1) * (10 - p2) / 100)}.`);
        return decProb(p1 * p2 / 100, t + " Hər ikisinin vurması ehtimalı nədir? (Onluq kəsrlə yaz.)",
          `Asılı olmayan hadisələr — ehtimallar vurulur: ${dec(p1 / 10)} · ${dec(p2 / 10)} = ${dec(p1 * p2 / 100)}.`);
      } },

    { id: "heyat", ad: "Həyatdan", izah: "Əvvəl bütün halları (n), sonra əlverişli halları (m) say. P = m/n, ixtisar et.",
      gen() {
        const kind = pick(["lotereya", "sinif", "mehsul", "test", "telefon", "nomre"]);
        if (kind === "lotereya") {
          const N = pick([50, 100, 200, 250, 500, 1000]), k = rnd(1, 20) * pick([1, 2, 5]);
          return prob(k, N, `Lotereyada ${N} bilet var, onlardan ${k} bilet uduşludur. Leyla bir bilet aldı. Biletin uduşlu olması ehtimalını tap.`,
            `n = ${N} (bütün biletlər), m = ${k} (uduşlu). P = ${red(k, N)}.`);
        }
        if (kind === "sinif") {
          const g = rnd(8, 18), o = rnd(8, 18), girl = Math.random() < .5;
          return prob(girl ? g : o, g + o, `Sinifdə ${g} qız və ${o} oğlan var. Növbətçi püşkatma ilə seçilir. Növbətçinin ${girl ? "qız" : "oğlan"} olması ehtimalını tap.`,
            `n = ${g} + ${o} = ${g + o}, m = ${girl ? g : o}. P = ${red(girl ? g : o, g + o)}.`);
        }
        if (kind === "mehsul") {
          const N = pick([20, 25, 40, 50, 60, 80, 100, 120, 200]), d = rnd(1, Math.floor(N / 5));
          return prob(N - d, N, `Partiyada ${N} lampa var, onlardan ${d} lampa qüsurludur. Təsadüfən götürülmüş lampanın qüsursuz olması ehtimalını tap.`,
            `Qüsursuz lampalar: ${N} − ${d} = ${N - d}. P = ${red(N - d, N)}.`);
        }
        if (kind === "test") {
          const n = rnd(3, 5), two = Math.random() < .5;
          if (two) return prob(1, n * n, `Testin hər sualında ${n} cavab variantı var, biri düzdür. Kamran iki suala cavabı təsadüfən seçir. Hər iki cavabın düz olması ehtimalını tap.`,
            `Hər sual üçün P = 1/${n}; seçimlər asılı deyil — vururuq: 1/${n} · 1/${n} = 1/${n * n}. (Və ya: ${n} · ${n} = ${n * n} hal, 1-i əlverişli.)`);
          const k = rnd(n + 1, 5 + n);
          return prob(1, n, `Testin hər sualında ${n} cavab variantı var, biri düzdür. Kamran ${k}-ci suala cavabı təsadüfən seçir. Cavabın düz olması ehtimalını tap.`,
            `n = ${n} variant, m = 1 düz cavab. P = 1/${n}. Sualın nömrəsi rol oynamır.`);
        }
        if (kind === "telefon") {
          const v = pick([["son rəqəmini unudub", 10, "0-dan 9-a qədər 10 rəqəm"], ["son rəqəmini unudub, amma onun cüt olduğunu xatırlayır", 5, "cüt rəqəmlər: 0, 2, 4, 6, 8 — 5"],
            ["son rəqəmini unudub, amma onun tək olduğunu xatırlayır", 5, "tək rəqəmlər: 1, 3, 5, 7, 9 — 5"], ["son rəqəmini unudub, amma onun 0 olmadığını xatırlayır", 9, "1-dən 9-a qədər — 9"],
            ["son iki rəqəmini unudub", 100, "hər yerə 10 rəqəm: 10 · 10 = 100"], ["son iki rəqəmini unudub, amma onların müxtəlif olduğunu xatırlayır", 90, "10 · 9 = 90"],
            ["son rəqəmini unudub, amma onun 5-dən böyük olduğunu xatırlayır", 4, "6, 7, 8, 9 — 4"]]);
          return prob(1, v[1], `Nigar dostunun telefon nömrəsinin ${v[0]} və onu təsadüfən yığır. Birinci cəhddə düz nömrəni yığması ehtimalını tap.`,
            `Mümkün hallar: ${v[2]}. Düz olan 1-dir. P = 1/${v[1]}.`);
        }
        const N = rnd(12, 40), k = rnd(2, 6), m = Math.floor(N / k);
        return prob(m, N, `Sinifdə ${N} şagird var, hər birinin jurnalda nömrəsi var: 1, 2, …, ${N}. Müəllim lövhəyə təsadüfən bir şagird çağırır. Çağırılanın nömrəsinin ${k} ədədinə bölünməsi ehtimalını tap.`,
          `n = ${N}. ${k} ədədinə bölünən nömrələr: ${k}, ${2 * k}, …, ${k * m} — ${m}. P = ${red(m, N)}.`);
      } },

    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const bad = rnd(0, 2);
        let task, steps, why;
        if (Math.random() < .5) {
          const s = rnd(3, 11), fit = PAIRS.filter(([a, b]) => a + b === s), m = fit.length;
          const un = fit.filter(([a, b]) => a <= b);
          task = `İki zər atılır. Xalların cəminin ${s} olması ehtimalı nədir?`;
          steps = [`Bütün hallar: 6 · 6 = 36.`, `Əlverişli hallar: ${fit.map(pairS).join(", ")} — ${m}.`, `P = ${red(m, 36)}.`];
          if (bad === 0) { steps[0] = pick([`Bütün hallar: 6 + 6 = 12.`, `Bütün hallar: cəm 2-dən 12-yə qədərdir — 11.`]); steps[2] = `P = ${m}/${steps[0].includes("12.") ? 12 : 11}.`; }
          if (bad === 1) { steps[1] = `Əlverişli hallar: ${un.map(pairS).join(", ")} — ${un.length}.`; steps[2] = `P = ${red(un.length, 36)}.`; }
          if (bad === 2) steps[2] = pick([`P = 36/${m}.`, `P = ${m}/36 = ${m}/${36 - m}.`, `P = 1 − ${m}/36 = ${frac(36 - m, 36)}.`]);
          why = [`1-ci addım: hər zərin 6 halı hər birinin 6 halı ilə birləşir — vurma: 6 · 6 = 36.`,
            `2-ci addım: (1; ${s - 1}) və (${s - 1}; 1) fərqli hallardır — birinci zər ilə ikinci zər fərqlidir. Düzü: ${m} hal.`,
            `3-cü addım: P = m/n = ${red(m, 36)}; ehtimal 1-dən böyük ola bilməz və burada əks hadisə soruşulmur.`][bad];
        } else {
          const a = rnd(3, 7), b = rnd(2, 6), n = a + b, good = a * (a - 1), all = n * (n - 1);
          task = `Kisədə ${a} ağ və ${b} qara kürə var. Ardıcıl iki kürə çıxarılır (birinci geri qaytarılmır). Hər ikisinin ağ olması ehtimalı nədir?`;
          steps = [`Bütün hallar: ${n} · ${n - 1} = ${all}.`, `Əlverişli hallar: ${a} · ${a - 1} = ${good}.`, `P = ${red(good, all)}.`];
          if (bad === 0) { steps[0] = `Bütün hallar: ${n} · ${n} = ${n * n}.`; steps[2] = `P = ${red(good, n * n)}.`; }
          if (bad === 1) { steps[1] = pick([`Əlverişli hallar: ${a} · ${a} = ${a * a}.`, `Əlverişli hallar: ${a} · ${b} = ${a * b}.`]); const g2 = +steps[1].match(/= (\d+)\.$/)[1]; steps[2] = `P = ${red(g2, all)}.`; }
          if (bad === 2) steps[2] = pick([`P = ${all}/${good}.`, `P = 1 − ${good}/${all} = ${frac(all - good, all)}.`, `P = ${good}/${all - good}.`]);
          why = [`1-ci addım: kürə qaytarılmır — ikinci dəfə ${n - 1} kürə qalır: ${n} · ${n - 1} = ${all}.`,
            `2-ci addım: birinci ağ kürə çıxandan sonra ${a - 1} ağ qalır: ${a} · ${a - 1} = ${good}.`,
            `3-cü addım: P = əlverişli/bütün = ${red(good, all)}.`][bad];
        }
        const text = h("div", {}, h("p", {}, "Məsələ: " + task), h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        return { text, choices: ch3, correct: bad, show: ch3[bad], solution: why };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ehtimal", title: "Ehtimal", fenn: "riyaziyyat", link: "dersler/ehtimal.html",
      format: "Say — tam ədəd: 24. Ehtimal — ixtisar olunmuş kəsr: 1/6, 5/36 (0,17 kimi yuvarlaq onluq qəbul olunmur). Şərtdə onluq verilibsə, onluq yaz: 0,48.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["say", "say", "ehtimal", "ehtimal", "ehtimal", "eks", "iki", "iki", "heyat", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ehtimal.html")) b.push("dersler/ehtimal.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
