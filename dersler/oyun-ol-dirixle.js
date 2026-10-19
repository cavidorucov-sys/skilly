// Dirixle prinsipi (olimpiada) — mastery game levels and the final test.
// Every generator returns a new problem with random numbers: {text, answer|choices+correct, show, solution}.
(function () {
  const { h } = Oyun;
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[rnd(0, a.length - 1)];
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const frac = (p, q) => { const g = gcd(p, q) || 1; return q / g === 1 ? String(p / g) : (p / g) + "/" + (q / g); };
  const ceil = (a, b) => Math.ceil(a / b);
  const EX = 0.01;
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const COLORS = ["qırmızı", "göy", "yaşıl", "sarı", "ağ", "qara"];

  // largest subset of {1..N} with no two numbers whose sum is divisible by m (one element per "bad" class, the bigger of each pair r, m − r)
  function sumFree(N, m) {
    const cnt = Array(m).fill(0); for (let x = 1; x <= N; x++) cnt[x % m]++;
    let best = (cnt[0] ? 1 : 0) + (m % 2 === 0 && cnt[m / 2] ? 1 : 0), parts = [];
    for (let r = 1; r < m - r; r++) { best += Math.max(cnt[r], cnt[m - r]); parts.push(`${r} və ${m - r}: ${cnt[r]} və ${cnt[m - r]} ədəd`); }
    return { best, cnt, parts };
  }
  // largest subset of {1..N} with no two numbers differing by exactly k: chains x, x + k, x + 2k, … ; take every other element
  function diffFree(N, k) {
    let best = 0; const lens = [];
    for (let r = 1; r <= k && r <= N; r++) { const L = Math.floor((N - r) / k) + 1; lens.push(L); best += Math.ceil(L / 2); }
    return { best, lens };
  }

  const levels = [
    { id: "corab", ad: "Ən pis hal", izah: "\"Zəmanət\" üçün ən bədbəxt halı düşün: şərt hələ ödənmir, sonra +1. Cavab — ən azı neçə götürmək lazımdır.",
      gen() {
        const m = rnd(3, 4), names = shuffle(COLORS.slice()).slice(0, m), c = names.map(() => rnd(3, 12));
        const total = c.reduce((a, b) => a + b, 0), list = names.map((n, i) => `${c[i]} ${n}`).join(", ");
        const intro = `Qutuda ${list} kürə var. Gözübağlı kürə götürülür.`;
        const kind = pick(["same", "same", "each", "two", "spec"]);
        if (kind === "same") {
          const k = rnd(2, Math.max(...c)), worst = c.map(x => Math.min(x, k - 1)), v = worst.reduce((a, b) => a + b, 0) + 1;
          return { text: `${intro} Ən azı neçə kürə götürmək lazımdır ki, aralarında ${k} eyni rəngli kürə mütləq olsun?`, answer: v, show: String(v), tol: EX,
            solution: `Ən pis hal: hər rəngdən ${k - 1} (o qədər kürəsi olmayan rəngdən — hamısını) götürürük: ${worst.join(" + ")} = ${v - 1}, hələ ${k} eyni rəngli yoxdur. Növbəti kürə ilə hansısa rəngdən artıq ${k} kürə olur: ${v - 1} + 1 = ${v}.` };
        }
        if (kind === "each") { const mn = Math.min(...c), v = total - mn + 1;
          return { text: `${intro} Ən azı neçə kürə götürmək lazımdır ki, hər rəngdən ən azı bir kürə mütləq olsun?`, answer: v, show: String(v), tol: EX,
            solution: `Ən pis hal: ən az olan rəng (${mn} kürə) tam qalır, qalan bütün kürələr götürülür: ${total} − ${mn} = ${total - mn}. Növbəti kürə həmin rəngdəndir: ${total - mn} + 1 = ${v}.` }; }
        if (kind === "two") { const mx = Math.max(...c), v = mx + 1;
          return { text: `${intro} Ən azı neçə kürə götürmək lazımdır ki, aralarında iki müxtəlif rəngli kürə mütləq olsun?`, answer: v, show: String(v), tol: EX,
            solution: `Ən pis hal: əvvəlcə ən çox olan rəngin hamısı çıxır (${mx} kürə). Növbəti kürə başqa rəngdir: ${mx} + 1 = ${v}.` }; }
        const i = rnd(0, m - 1), j = rnd(1, Math.min(3, c[i])), v = total - c[i] + j;
        return { text: `${intro} Ən azı neçə kürə götürmək lazımdır ki, aralarında ən azı ${j} ${names[i]} kürə mütləq olsun?`, answer: v, show: String(v), tol: EX,
          solution: `Ən pis hal: əvvəlcə ${names[i]} olmayan bütün kürələr çıxır: ${total} − ${c[i]} = ${total - c[i]}. Sonra ${j} ${names[i]} lazımdır: ${total - c[i]} + ${j} = ${v}.` };
      } },
    { id: "umumi", ad: "Ümumiləşmiş prinsip", izah: "N əşya n qutuda → hansısa qutuda ən azı ⌈N/n⌉ əşya var (yuxarı yuvarlaqlaşdır). Hansısa qutuda ən azı k əşya olsun deyə: n(k − 1) + 1.",
      gen() {
        const ctx = pick([
          { box: 12, what: "şagird", where: "eyni ayda doğulub", whereQ: "eyni ayda doğulsun", boxes: "12 ay" },
          { box: 7, what: "şagird", where: "həftənin eyni günündə doğulub", whereQ: "həftənin eyni günündə doğulsun", boxes: "həftənin 7 günü" },
          { box: 11, what: "şagird", where: "eyni bal alıb", whereQ: "eyni bal alsın", boxes: "0-dan 10-a qədər 11 mümkün bal", pre: "Testdə bal 0-dan 10-a qədər tam ədəddir." },
          { box: 6, what: "zər atışı", where: "eyni xal göstərib", whereQ: "eyni xal göstərsin", boxes: "zərin 6 üzü" },
        ]);
        const pre = ctx.pre ? ctx.pre + " " : "";
        if (Math.random() < .5) {
          let N = rnd(ctx.box + 2, ctx.box * 9); if (N % ctx.box === 0) N++;
          const v = ceil(N, ctx.box), q = Math.floor(N / ctx.box);
          return { text: `${pre}${N} ${ctx.what} var. Ən böyük hansı k üçün zəmanət vermək olar ki, ən azı k ${ctx.what} ${ctx.where}?`, answer: v, show: String(v), tol: EX,
            solution: `Qutular — ${ctx.boxes}. ${N} = ${ctx.box} · ${q} + ${N - ctx.box * q}. Hər qutuda ${q} olsaydı, ${ctx.box * q} olardı — artıq qalanlar hansısa qutuya düşür: ⌈${N}/${ctx.box}⌉ = ${v}. Daha çoxuna zəmanət yoxdur: əşyaları bərabər paylamaq olar.` };
        }
        const k = rnd(2, 8), v = ctx.box * (k - 1) + 1;
        return { text: `${pre}Ən azı neçə ${ctx.what} olmalıdır ki, aralarında ${k} ${ctx.what} mütləq ${ctx.whereQ}?`, answer: v, show: String(v), tol: EX,
          solution: `Qutular — ${ctx.boxes}. Ən pis hal: hər qutuda ${k - 1}: ${ctx.box} · ${k - 1} = ${ctx.box * (k - 1)} — hələ ${k} eyni yoxdur. Bir əlavə ilə zəmanət: ${ctx.box * (k - 1)} + 1 = ${v}.` };
      } },
    { id: "qaliq", ad: "Qalıqlar", izah: "Qutular — bölmədən qalıqlar. m qalıq var (0, 1, …, m − 1): m + 1 ədəddən ikisinin qalığı eynidir, fərqi m-ə bölünür.",
      gen() {
        const kind = pick(["diff", "diff", "sum"]);
        if (kind === "diff") { const m = rnd(3, 25);
          return { text: `Ən azı neçə tam ədəd götürmək lazımdır ki, aralarında fərqi ${m} ədədinə bölünən iki ədəd mütləq olsun?`, answer: m + 1, show: String(m + 1), tol: EX,
            solution: `${m} ədədinə bölmədə ${m} mümkün qalıq var (0, 1, …, ${m - 1}) — bunlar qutulardır. ${m + 1} ədəddən ikisinin qalığı eynidir, onların fərqi ${m} ədədinə bölünür. ${m} ədəd az ola bilər: 0, 1, …, ${m - 1} ədədlərinin qalıqları müxtəlifdir. Cavab: ${m + 1}.` }; }
        const m = rnd(3, 9), N = m * rnd(2, 6) + rnd(0, m - 1), S = sumFree(N, m), v = S.best + 1;
        return { text: `1, 2, …, ${N} ədədlərindən ən azı neçəsini seçmək lazımdır ki, aralarında cəmi ${m} ədədinə bölünən iki ədəd mütləq olsun?`, answer: v, show: String(v), tol: EX,
          solution: `Qalıqlara bax (mod ${m}). İki ədədin cəmi ${m} ədədinə bölünür ⇔ qalıqlar r və ${m} − r (və ya ikisi də 0${m % 2 === 0 ? `, ya da ikisi də ${m / 2}` : ""}). Pis toplu: 0 qalıqlı ədəddən ən çox 1${m % 2 === 0 ? `, ${m / 2} qalıqlıdan ən çox 1` : ""}; hər r, ${m} − r cütündən — çox olan sinfin hamısı (${S.parts.join("; ")}). Ən böyük pis toplu: ${S.best}. Cavab: ${S.best} + 1 = ${v}.` };
      } },
    { id: "aralig", ad: "1-dən N-ə qədər", izah: "Ədədləri qruplara (qutulara) böl: hər qrupdan iki ədəd seçilsə, şərt ödənir. Qrupların sayı + 1 — cavab.",
      gen() {
        const kind = pick(["consec", "divide", "coprime", "diffk", "diffk"]);
        if (kind === "consec") { const n = rnd(5, 60);
          return { text: `1, 2, …, ${2 * n} ədədlərindən ən azı neçəsini seçmək lazımdır ki, aralarında iki ardıcıl ədəd mütləq olsun?`, answer: n + 1, show: String(n + 1), tol: EX,
            solution: `Qutular: {1, 2}, {3, 4}, …, {${2 * n - 1}, ${2 * n}} — ${n} cüt. ${n + 1} ədəddən ikisi bir cütə düşür — onlar ardıcıldır. ${n} az ola bilər: 1, 3, 5, …, ${2 * n - 1}. Cavab: ${n + 1}.` }; }
        if (kind === "coprime") { const n = rnd(5, 60);
          return { text: `1, 2, …, ${2 * n} ədədlərindən ən azı neçəsini seçmək lazımdır ki, aralarında qarşılıqlı sadə iki ədəd mütləq olsun?`, answer: n + 1, show: String(n + 1), tol: EX,
            solution: `Cütlər {1, 2}, {3, 4}, … — ${n} qutu; ${n + 1} ədəddən ikisi ardıcıldır, ardıcıl ədədlər isə qarşılıqlı sadədir. ${n} az ola bilər: bütün cüt ədədlər (2, 4, …, ${2 * n}) — hər ikisinin ƏBOB-u ≥ 2. Cavab: ${n + 1}.` }; }
        if (kind === "divide") { const n = rnd(5, 60);
          return { text: `1, 2, …, ${2 * n} ədədlərindən ən azı neçəsini seçmək lazımdır ki, aralarında biri digərinə bölünən iki ədəd mütləq olsun?`, answer: n + 1, show: String(n + 1), tol: EX,
            solution: `Hər ədəd = 2^k · (tək ədəd). Tək hissə 1, 3, …, ${2 * n - 1} — ${n} qutu. ${n + 1} ədəddən ikisinin tək hissəsi eynidir — kiçiyi böyüyünə bölünür. ${n} az ola bilər: ${n + 1}, ${n + 2}, …, ${2 * n} (heç biri digərinə bölünmür). Cavab: ${n + 1}.` }; }
        const k = rnd(2, 6), N = rnd(3 * k, 40), D = diffFree(N, k), v = D.best + 1;
        return { text: `1, 2, …, ${N} ədədlərindən ən azı neçəsini seçmək lazımdır ki, aralarında fərqi düz ${k} olan iki ədəd mütləq olsun?`, answer: v, show: String(v), tol: EX,
          solution: `Ədədləri zəncirlərə böl: x, x + ${k}, x + ${2 * k}, … (x = 1, …, ${k}); uzunluqlar: ${D.lens.join(", ")}. Zəncirdə qonşu iki ədədin fərqi düz ${k} olur, ona görə hər zəncirdən "biri-buraxılmaqla" ən çox ⌈L/2⌉ ədəd götürmək olar: cəmi ${D.best}. Cavab: ${D.best} + 1 = ${v}.` };
      } },
    { id: "hendese", ad: "Həndəsədə Dirixle", izah: "Fiquru bərabər hissələrə (qutulara) böl. Nöqtələr hissələrdən çoxdursa, ikisi bir hissədədir — aralarındakı məsafə hissənin \"ölçüsündən\" böyük deyil.",
      gen() {
        const kind = pick(["square", "square", "tri", "seg", "count"]);
        if (kind === "square") { const s = rnd(2, 5), k = rnd(1, 4), a = s * k, N = s * s + 1;
          return { text: `Tərəfi ${a} olan kvadratın içində ${N} nöqtə var. Kvadratı ${s} × ${s} bərabər kvadratcığa bölərək göstər ki, hansısa iki nöqtə arasındakı məsafə d-dən böyük deyil. Bu üsulla alınan d nəyə bərabərdir?`,
            answer: k * Math.SQRT2, show: (k === 1 ? "" : k) + "√2", placeholder: "məs. 2√2",
            solution: `${s * s} kvadratcıq, ${N} nöqtə → ikisi bir kvadratcıqdadır. Kvadratcığın tərəfi ${a}/${s} = ${k}; içindəki iki nöqtə arasındakı məsafə onun diaqonalından böyük deyil: ${k}√2.` }; }
        if (kind === "tri") { const s = rnd(2, 4), k = rnd(1, 5), a = s * k, N = s * s + 1;
          return { text: `Tərəfi ${a} olan bərabərtərəfli üçbucağın içində ${N} nöqtə var. Tərəfləri ${s} bərabər hissəyə bölüb, bölgü nöqtələrindən tərəflərə paralel düz xətlər çəkirik. Hansısa iki nöqtə arasındakı məsafə d-dən böyük deyil. Bu üsulla alınan d?`,
            answer: k, show: String(k), tol: EX,
            solution: `Paralel xətlər üçbucağı ${s}² = ${s * s} kiçik bərabərtərəfli üçbucağa bölür (tərəfi ${a}/${s} = ${k}). ${N} nöqtədən ikisi bir kiçik üçbucaqdadır; kiçik üçbucaqda iki nöqtə arasındakı məsafə tərəfdən (${k}) böyük deyil.` }; }
        if (kind === "seg") { const L = rnd(6, 60), N = rnd(4, 13);
          return { text: `Uzunluğu ${L} olan parçada ${N} nöqtə qeyd olunub (uclar da ola bilər). Zəmanət vermək olar ki, hansısa iki qonşu nöqtə arasındakı məsafə d-dən böyük deyil. d-nin ən kiçik belə qiyməti?`,
            answer: L / (N - 1), show: frac(L, N - 1), placeholder: "məs. 7/3",
            solution: `${N} nöqtə parçanı ${N - 1} aralığa bölür, aralıqların cəmi ≤ ${L}. Hamısı ${L}/${N - 1} ədədindən böyük ola bilməz (onda cəm ${L} ədədini aşardı). Bərabər addımla qoysaq, hər məsafə düz ${frac(L, N - 1)} olur — daha kiçik d olmaz. Cavab: ${frac(L, N - 1)}.` }; }
        const a = rnd(2, 5), b = rnd(2, 5), cells = a * b; let N = rnd(cells + 2, cells * 5); if (N % cells === 0) N++;
        const v = ceil(N, cells);
        return { text: `${a} × ${b} ölçülü düzbucaqlı ${cells} vahid kvadrata bölünüb. İçinə ${N} nöqtə atılıb. Ən böyük hansı k üçün zəmanət var ki, hansısa vahid kvadratda ən azı k nöqtə var?`, answer: v, show: String(v), tol: EX,
          solution: `${cells} qutu, ${N} nöqtə: ⌈${N}/${cells}⌉ = ${v}. Hər kvadratda ${v - 1} olsaydı, cəmi ${cells * (v - 1)} < ${N} olardı.` };
      } },
    { id: "sehv", ad: "Səhvi tap", izah: "Həll üç addımdır, birində səhv var. Birinci səhv addım hansıdır?",
      gen() {
        const m = rnd(3, 6), k = rnd(3, 6), worst = m * (k - 1), v = worst + 1;
        const steps = [
          `Ən pis hal: hər rəngdən ${k - 1} corab götürülüb — hələ ${k} eyni rəngli yoxdur.`,
          `Bu, ${m} · ${k - 1} = ${worst} corabdır.`,
          `Növbəti corabla hansısa rəngdən artıq ${k} corab olur. Cavab: ${v}.`,
        ];
        const bad = rnd(0, 2);
        if (bad === 0) { steps[0] = `Ən pis hal: hər rəngdən ${k} corab götürülüb.`; steps[1] = `Bu, ${m} · ${k} = ${m * k} corabdır.`; steps[2] = `Növbəti corabla hansısa rəngdən artıq ${k} corab olur. Cavab: ${m * k + 1}.`; }
        if (bad === 1) { const w = m + k - 1; steps[1] = `Bu, ${m} + ${k - 1} = ${w} corabdır.`; steps[2] = `Növbəti corabla hansısa rəngdən artıq ${k} corab olur. Cavab: ${w + 1}.`; }
        if (bad === 2) steps[2] = `Deməli, ${worst} corab kifayətdir. Cavab: ${worst}.`;
        const text = h("div", {}, h("p", {}, `Siyirmədə ${m} rəngdə çoxlu corab var. Ən azı neçə corab götürmək lazımdır ki, ${k} eyni rəngli corab mütləq olsun?`),
          h("ol", { class: "oy-steps" }, ...steps.map(st => h("li", {}, st))));
        const why = [`1-ci addım: hər rəngdən ${k} götürsək, artıq ${k} eyni rəngli var — bu "pis hal" deyil. Pis hal: hər rəngdən ${k - 1}.`,
          `2-ci addım: ${m} rəngin hər birindən ${k - 1} — vurmaq lazımdır: ${m} · ${k - 1} = ${worst}.`,
          `3-cü addım: ${worst} corab pis halda hələ şərti ödəmir — bir corab da lazımdır: ${v}.`][bad];
        const ch = ["1-ci addım", "2-ci addım", "3-cü addım"];
        return { text, choices: ch, correct: bad, show: ch[bad], solution: why };
      } },
    { id: "heyat", ad: "Həyatdan", izah: "Nə \"göyərçin\", nə \"yuva\"dır? Yuvaları say, ən pis halı qur, +1.",
      gen() {
        const kind = pick(["school", "gloves", "keys", "hair", "tickets"]);
        if (kind === "school") { let N = rnd(400, 2500); if (N % 366 === 0) N++; const v = ceil(N, 366);
          return { text: `Məktəbdə ${N} şagird oxuyur. Ən böyük hansı k üçün zəmanət var ki, k şagirdin ad günü eyni gündədir? (İldə 366 mümkün tarix götür.)`, answer: v, show: String(v), tol: EX,
            solution: `366 qutu (tarix), ${N} şagird: ⌈${N}/366⌉ = ${v}. Hər tarixdə ${v - 1} olsaydı, ən çoxu ${366 * (v - 1)} < ${N} şagird olardı.` }; }
        if (kind === "gloves") { const n = rnd(3, 12);
          return { text: `Qutuda ${n} cüt eyni rəngli əlcək var (${n} sol və ${n} sağ). Qaranlıqda ən azı neçə əlcək götürmək lazımdır ki, bir cüt (bir sol və bir sağ) mütləq olsun?`, answer: n + 1, show: String(n + 1), tol: EX,
            solution: `Ən pis hal: əvvəlcə ${n} sol əlcək çıxır. Növbəti əlcək mütləq sağdır: ${n} + 1 = ${n + 1}.` }; }
        if (kind === "keys") { const n = rnd(3, 9), v = n * (n - 1) / 2;
          return { text: `${n} açar və ${n} kilid var, hər açar yalnız bir kilidi açır, hansının hansı olduğunu bilmirik. Ən pis halda ən azı neçə sınaq kifayət edir ki, bütün açarların kilidini tapaq? (Sınaq — bir açarı bir kilidə salmaq.)`, answer: v, show: String(v), tol: EX,
            solution: `Birinci açar üçün ən pis halda ${n - 1} sınaq (son kilidi yoxlamağa ehtiyac yoxdur), ikinci üçün ${n - 2}, …, sonuncuya 0. ${n - 1} + ${n - 2} + … + 1 = ${v}.` }; }
        if (kind === "hair") { const P = pick([200, 300, 500, 1000]) * 1000, H = pick([100, 150]) * 1000, v = ceil(P + 0, H + 1);
          return { text: `Şəhərdə ${P} nəfər yaşayır. İnsanın başında ən çox ${H} tük olur (0 da ola bilər). Ən böyük hansı k üçün zəmanət var ki, k nəfərin başında tüklərin sayı eynidir?`, answer: v, show: String(v), tol: EX,
            solution: `Qutular: 0, 1, …, ${H} — cəmi ${H + 1}. ⌈${P}/${H + 1}⌉ = ${v}.` }; }
        const r = rnd(3, 8), k = rnd(2, 5), v = r * (k - 1) + 1;
        return { text: `Lotereyada biletlər ${r} rəngdə olur. Ən azı neçə bilet almaq lazımdır ki, ${k} eyni rəngli bilet mütləq olsun?`, answer: v, show: String(v), tol: EX,
          solution: `Ən pis hal: hər rəngdən ${k - 1} — ${r} · ${k - 1} = ${r * (k - 1)}. Bir də: ${v}.` };
      } },
  ];

  window.__levels = levels;
  function start() {
    const oyunEl = document.getElementById("oyun-root"), testEl = document.getElementById("sinaq-root");
    if (!oyunEl || !window.Oyun) return;
    const tabBtn = document.getElementById("tb-sinaq");
    let game = null;
    game = Oyun.mount({
      key: "ol-dirixle", title: "Dirixle prinsipi", fenn: "olimpiada", link: "dersler/ol-dirixle.html",
      format: "Cavab ədəddir: adətən \"ən azı neçə\" — tam ədəd (məs. 13). Məsafə soruşulanda: 2√2 və ya 7/3 kimi.",
      levels, oyunEl, testEl, entryEl: document.getElementById("giris-root"),
      entry: { n: 8, min: 10 },
      test: { n: 10, pass: 8, from: ["corab", "corab", "umumi", "umumi", "qaliq", "qaliq", "aralig", "hendese", "hendese", "heyat"] },
      goTest: () => SkillyTab("sinaq"), goGame: () => SkillyTab("oyun"), goLesson: () => SkillyTab("d1"),
      onState: st => { if (tabBtn) { tabBtn.classList.toggle("locked", !st.boss.passed); const sm = tabBtn.querySelector("small"); if (sm) sm.textContent = st.boss.passed ? "Sınaq" : "🔒 Sınaq"; } if (game && game.drawTest) game.drawTest(); },
      onPass: () => { try { const b = JSON.parse(localStorage.getItem("skilly-bag") || "[]"); if (!b.includes("dersler/ol-dirixle.html")) b.push("dersler/ol-dirixle.html"); localStorage.setItem("skilly-bag", JSON.stringify(b)); } catch (e) {} },
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
